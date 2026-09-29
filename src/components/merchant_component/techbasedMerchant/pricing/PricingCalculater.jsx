import React, { useState } from "react";
import {
  Calendar,
  IndianRupee,
  MapPin,
  MoveHorizontal,
  MoveVertical,
  Ruler,
  TrendingUp,
  Truck,
  Weight,
} from "lucide-react";

import AxiosInstance from "../../../../Helper/axiosInstance";

const MerchantPricingCalculator = () => {
  const [formData, setFormData] = useState({
    pickup_pincode: "",
    destination_pincode: "",
    order_value: "1000",
    order_weight: "20",
    order_type: "cod",
    rider_preference: "daakit",
    package_length: "",
    package_width: "",
    package_height: "",

  });

  const [pricingData, setPricingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setPricingData(null);
    setActiveTab("");

    try {
      const result = await AxiosInstance.post(
        "/api/tech-merchant/getSDDNDDPricing",
        formData
      );

      const pricing = result?.data?.data?.pricing || {};

      console.log("API Response:", result?.data);
      console.log("Pricing:", pricing);

      setPricingData(pricing);

      if (pricing?.SDD?.length > 0) {
        setActiveTab("SDD");
      } else if (pricing?.NDD?.length > 0) {
        setActiveTab("NDD");
      } else {
        setError("No pricing available for this route.");
      }
    } catch (err) {
      console.error("Pricing API Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Something went wrong while calculating rates."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(Number(price || 0));
  };

  const data = pricingData?.[activeTab] || [];

  const hasSDD = pricingData?.SDD?.length > 0;
  const hasNDD = pricingData?.NDD?.length > 0;
  const hasPricing = hasSDD || hasNDD;

  return (
    <div className="min-h-screen  text-gray-900 transition-colors duration-300 dark:bg-neutral-900 dark:text-neutral-100">
      {/* Header */}
      <header className=" dark:bg-neutral-950">
        <div className="mx-auto px-3 py-2">
          <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="text-center lg:text-left">
              <h1 className="text-xl font-bold dark:text-white sm:text-2xl lg:text-3xl">
                Merchant Shipping Calculator
              </h1>

              <p className="mt-1 text-sm dark:text-blue-100 sm:mt-2 sm:text-base dark:text-neutral-400">
                Calculate SDD & NDD shipping rates for your orders
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Left Form */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm transition-colors dark:border-neutral-700 dark:bg-neutral-800">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-gray-800 dark:text-neutral-100">
                <TrendingUp className="h-5 w-5 text-[#0446DB] dark:text-blue-400" />
                Order Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Pickup and Destination */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
                      <MapPin className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
                      Pickup Pincode
                    </label>

                    <input
  type="text"
  inputMode="numeric"
  name="pickup_pincode"
  value={formData.pickup_pincode}
  onChange={(e) => {
    const value = e.target.value;

    if (/^\d{0,6}$/.test(value)) {
      handleInputChange(e);
    }
  }}
  placeholder="226001"
  maxLength={6}
  pattern="[0-9]{6}"
  required
  className="
    w-full rounded-lg border border-gray-300 bg-white
    px-4 py-2.5 text-gray-900 outline-none
    transition-all placeholder:text-gray-400
    focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/20
    dark:border-neutral-700
    dark:bg-neutral-900
    dark:text-neutral-100
    dark:placeholder:text-neutral-500
    dark:focus:border-blue-500
    dark:focus:ring-blue-500/20
  "
/>
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
                      <MapPin className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
                      Destination Pincode
                    </label>

                    <input
  type="text"
  inputMode="numeric"
  name="destination_pincode"
  value={formData.destination_pincode}
  onChange={(e) => {
    const value = e.target.value;

    if (/^\d{0,6}$/.test(value)) {
      handleInputChange(e);
    }
  }}
  placeholder="226002"
  maxLength={6}
  pattern="[0-9]{6}"
  required
  className="
    w-full rounded-lg border border-gray-300 bg-white
    px-4 py-2.5 text-gray-900 outline-none
    transition-all placeholder:text-gray-400
    focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/20
    dark:border-neutral-700
    dark:bg-neutral-900
    dark:text-neutral-100
    dark:placeholder:text-neutral-500
    dark:focus:border-blue-500
    dark:focus:ring-blue-500/20
  "
/>
                  </div>
                </div>

                {/* Value and Weight */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
                      <IndianRupee className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
                      Order Valuee
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      name="order_value"
                      value={formData.order_value}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (/^\d*$/.test(value)) {
                          handleInputChange(e);
                        }
                      }}
                      placeholder="1000"
                      required
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
                      <Weight className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
                      Order Weight (g)
                    </label>

                    <input
  type="text"
  inputMode="decimal"
  name="order_weight"
  value={formData.order_weight}
  onChange={(e) => {
    const value = e.target.value;

    // Only numbers + single decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      handleInputChange(e);
    }
  }}
  placeholder="500"
  required
  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
/>
                  </div>

                  
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
  {/* Package Length */}
  <div>
    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
      <Ruler className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
      Package Length (cm)
    </label>

    <input
      type="text"
      inputMode="decimal"
      name="package_length"
      value={formData.package_length}
      onChange={(e) => {
        if (/^\d*\.?\d*$/.test(e.target.value)) {
          handleInputChange(e);
        }
      }}
      placeholder="Package length"
      required
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
    />
  </div>

  {/* Package Width */}
  <div>
    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
      <MoveHorizontal className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
      Package Width (cm)
    </label>

    <input
      type="text"
      inputMode="decimal"
      name="package_width"
      value={formData.package_width}
      onChange={(e) => {
        if (/^\d*\.?\d*$/.test(e.target.value)) {
          handleInputChange(e);
        }
      }}
      placeholder="Package width"
      required
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
    />
  </div>

  {/* Package Height */}
  <div>
    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
      <MoveVertical className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
      Package Height (cm)
    </label>

    <input
      type="text"
      inputMode="decimal"
      name="package_height"
      value={formData.package_height}
      onChange={(e) => {
        if (/^\d*\.?\d*$/.test(e.target.value)) {
          handleInputChange(e);
        }
      }}
      placeholder="Package height"
      required
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
    />
  </div>
</div>

                {/* Order Type */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Order Type
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-3 transition-all ${
                        formData.order_type === "cod"
                          ? `
                              border-[#0446DB] bg-blue-50 text-[#0446DB]
                              dark:border-blue-500 dark:bg-blue-500/10 dark:text-blue-400
                            `
                          : `
                              border-gray-200 bg-white text-gray-600 hover:bg-gray-50
                              dark:border-neutral-700 dark:bg-neutral-900
                              dark:text-neutral-300 dark:hover:bg-neutral-800
                            `
                      }`}
                    >
                      <input
                        type="radio"
                        name="order_type"
                        value="cod"
                        checked={formData.order_type === "cod"}
                        onChange={handleInputChange}
                        className="h-4 w-4 accent-[#0446DB]"
                      />

                      <span className="text-sm font-medium">COD</span>
                    </label>

                    <label
                      className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-3 transition-all ${
                        formData.order_type === "prepaid"
                          ? `
                              border-[#0446DB] bg-blue-50 text-[#0446DB]
                              dark:border-blue-500 dark:bg-blue-500/10 dark:text-blue-400
                            `
                          : `
                              border-gray-200 bg-white text-gray-600 hover:bg-gray-50
                              dark:border-neutral-700 dark:bg-neutral-900
                              dark:text-neutral-300 dark:hover:bg-neutral-800
                            `
                      }`}
                    >
                      <input
                        type="radio"
                        name="order_type"
                        value="prepaid"
                        checked={formData.order_type === "prepaid"}
                        onChange={handleInputChange}
                        className="h-4 w-4 accent-[#0446DB]"
                      />

                      <span className="text-sm font-medium">Prepaid</span>
                    </label>
                  </div>
                </div>

                {/* Calculate Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    flex w-full items-center justify-center gap-2 rounded-lg
                    bg-[#0446DB] px-4 py-3 font-semibold text-white
                    transition-all duration-200 hover:bg-blue-700
                    disabled:cursor-not-allowed disabled:opacity-60

                    dark:bg-blue-600 dark:hover:bg-blue-500
                  "
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Truck className="h-5 w-5" />
                      Calculate Rates
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:col-span-2">
            {/* Error */}
            {error && (
              <div
                className="
                  mb-4 rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm
                  dark:border-red-900/60 dark:bg-red-950/40
                "
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                    <span className="text-lg font-bold text-red-600 dark:text-red-400">
                      !
                    </span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-red-800 dark:text-red-300">
                      Unable to calculate pricing
                    </h3>

                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Initial State */}
            {!pricingData && !loading && !error && (
              <div
                className="
                  flex min-h-[360px] flex-col items-center justify-center
                  rounded-lg border border-gray-100 bg-white p-12
                  text-center shadow-sm transition-colors

                  dark:border-neutral-700
                  dark:bg-neutral-800
                "
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-500/10">
                  <Truck className="h-8 w-8 text-[#0446DB] dark:text-blue-400" />
                </div>

                <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-neutral-100">
                  Calculate Your Shipping Rate
                </h3>

                <p className="max-w-md text-sm leading-6 text-gray-500 dark:text-neutral-400">
                  Enter pickup and destination pincodes along with order details
                  to get available SDD and NDD pricing.
                </p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div
                className="
                  flex min-h-[360px] flex-col items-center justify-center
                  rounded-lg border border-gray-100 bg-white p-12
                  shadow-sm transition-colors

                  dark:border-neutral-700
                  dark:bg-neutral-800
                "
              >
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#0446DB] dark:border-neutral-700 dark:border-t-blue-500" />

                <h3 className="font-semibold text-gray-700 dark:text-neutral-200">
                  Calculating rates...
                </h3>

                <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
                  Finding the best shipping options for your order.
                </p>
              </div>
            )}

            {/* Pricing */}
            {pricingData && hasPricing && !loading && (
              <div
                className="
                  overflow-hidden rounded-lg border border-gray-100
                  bg-white shadow-sm transition-colors

                  dark:border-neutral-700
                  dark:bg-neutral-800
                "
              >
                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50/60 dark:border-neutral-700 dark:bg-neutral-900/70">
                  {hasSDD && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("SDD")}
                      className={`relative flex-1 px-4 py-4 text-sm font-semibold transition-all sm:px-6 ${
                        activeTab === "SDD"
                          ? "bg-white text-[#0446DB] dark:bg-neutral-800 dark:text-blue-400"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Same Day Delivery
                        <span className="hidden sm:inline">(SDD)</span>
                      </div>

                      {activeTab === "SDD" && (
                        <div className="absolute bottom-0 left-0 h-[3px] w-full bg-[#0446DB] dark:bg-blue-500" />
                      )}
                    </button>
                  )}

                  {hasNDD && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("NDD")}
                      className={`relative flex-1 px-4 py-4 text-sm font-semibold transition-all sm:px-6 ${
                        activeTab === "NDD"
                          ? "bg-white text-[#0446DB] dark:bg-neutral-800 dark:text-blue-400"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Next Day Delivery
                        <span className="hidden sm:inline">(NDD)</span>
                      </div>

                      {activeTab === "NDD" && (
                        <div className="absolute bottom-0 left-0 h-[3px] w-full bg-[#0446DB] dark:bg-blue-500" />
                      )}
                    </button>
                  )}
                </div>

                {/* Pricing Heading */}
                <div className="border-b border-gray-100 px-6 py-5 dark:border-neutral-700">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-100">
                        {activeTab === "SDD"
                          ? "Same Day Delivery Rates"
                          : "Next Day Delivery Rates"}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                        Available pricing based on your order details.
                      </p>
                    </div>

                    <div className="rounded-md bg-blue-50 px-3 py-1.5 text-sm font-semibold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                      {data.length} {data.length === 1 ? "Rate" : "Rates"}
                    </div>
                  </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900">
                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                          Weight Slab
                        </th>

                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                          Weight Limit
                        </th>

                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                          Shipping Rate
                        </th>

                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                          COD Charge
                        </th>

                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                          Final Price
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {data.length > 0 ? (
                        data.map((item, index) => (
                          <tr
                            key={`${activeTab}-${item?.slab}-${index}`}
                            className="
                              border-b border-gray-100 transition-colors
                              last:border-b-0 hover:bg-gray-50

                              dark:border-neutral-700
                              dark:hover:bg-neutral-900/60
                            "
                          >
                            <td className="px-5 py-4">
                              <span className="inline-flex rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700 dark:bg-neutral-700 dark:text-neutral-200">
                                {item?.slab}g
                              </span>
                            </td>

                            <td className="px-5 py-4 text-sm font-medium text-gray-600 dark:text-neutral-300">
                              {item?.weight_limit}g
                            </td>

                            <td className="px-5 py-4">
                              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                {formatPrice(item?.calculated_price)}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              {Number(item?.cod_charge) > 0 ? (
                                <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                                  {formatPrice(item?.cod_charge)}
                                </span>
                              ) : (
                                <span className="text-sm text-gray-400 dark:text-neutral-500">
                                  —
                                </span>
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <span className="inline-flex rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-bold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                                {formatPrice(item?.final_price)}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-5 py-10 text-center text-sm text-gray-500 dark:text-neutral-400"
                          >
                            No pricing data available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="space-y-3 p-4 md:hidden">
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <div
                        key={`${activeTab}-mobile-${item?.slab}-${index}`}
                        className="
                          rounded-xl border border-gray-200 bg-white p-4

                          dark:border-neutral-700
                          dark:bg-neutral-900
                        "
                      >
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-neutral-500">
                              Weight Slab
                            </p>

                            <p className="mt-1 font-semibold text-gray-800 dark:text-neutral-100">
                              {item?.slab}g
                            </p>
                          </div>

                          <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-bold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                            {formatPrice(item?.final_price)}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-4 dark:border-neutral-700">
                          <div>
                            <p className="text-xs text-gray-400 dark:text-neutral-500">
                              Limit
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-700 dark:text-neutral-300">
                              {item?.weight_limit}g
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-400 dark:text-neutral-500">
                              Shipping
                            </p>

                            <p className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                              {formatPrice(item?.calculated_price)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-400 dark:text-neutral-500">
                              COD
                            </p>

                            <p className="mt-1 text-sm font-semibold text-orange-600 dark:text-orange-400">
                              {Number(item?.cod_charge) > 0
                                ? formatPrice(item?.cod_charge)
                                : "—"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center text-sm text-gray-500 dark:text-neutral-400">
                      No pricing data available.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* No Pricing */}
            {pricingData && !hasPricing && !loading && !error && (
              <div
                className="
                  flex min-h-[320px] flex-col items-center justify-center
                  rounded-lg border border-gray-100 bg-white p-10
                  text-center shadow-sm

                  dark:border-neutral-700
                  dark:bg-neutral-800
                "
              >
                <Truck className="mb-4 h-12 w-12 text-gray-300 dark:text-neutral-600" />

                <h3 className="text-lg font-semibold text-gray-700 dark:text-neutral-200">
                  No Delivery Service Available
                </h3>

                <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
                  SDD or NDD pricing is not available for the selected route.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantPricingCalculator;