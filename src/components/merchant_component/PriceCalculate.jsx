
import React, { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BadgeIndianRupee,
  Banknote,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  IndianRupee,
  Loader2,
  MapPin,
  MoveHorizontal,
  MoveVertical,
  Package,
  ReceiptIndianRupee,
  Route,
  Ruler,
  Scale,
  Sparkles,
  Truck,
  WalletCards,
  Weight,
  Zap,
} from "lucide-react";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const MerchantPricingCalculator = () => {
  const [formData, setFormData] = useState({
    pickup_pincode: "",
    destination_pincode: "",
    order_value: "",
    order_weight: "",
    order_type: "",
    package_length: "",
    package_width: "",
    package_height: "",
  });

  const [pricingData, setPricingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("sdd");

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError(null);
    }
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${baseURL}/api/merchant/getSDDNDDPricing`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPricingData(response.data);

      // Automatically select available tab
      if (response?.data?.pricing?.SDD?.length > 0) {
        setActiveTab("sdd");
      } else if (response?.data?.pricing?.NDD?.length > 0) {
        setActiveTab("ndd");
      }
    } catch (err) {
      setPricingData(null);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to calculate shipping rates."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     FORMAT PRICE
  ===================================================== */

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(Number(price || 0));
  };

  /* =====================================================
     ACTIVE PRICING
  ===================================================== */

  const activePricing =
    activeTab === "sdd"
      ? pricingData?.pricing?.SDD || []
      : pricingData?.pricing?.NDD || [];

  const sddCount = pricingData?.pricing?.SDD?.length || 0;
  const nddCount = pricingData?.pricing?.NDD?.length || 0;

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-neutral-950">
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="border-b border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-[#0446DB]/10">
                <BadgeIndianRupee className="h-5 w-5 text-[#0446DB]" />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
                  Shipping Rate Calculator
                </h1>

                <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                  Calculate SDD & NDD shipping rates for your
                  orders.
                </p>
              </div>
            </div>

            
          </div>
        </div>
      </div>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[480px_minmax(0,1fr)]">
          {/* =================================================
              LEFT - ORDER FORM
          ================================================= */}

          <div>
            <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              {/* FORM HEADER */}

              <div className="border-b border-gray-100 px-5 py-5 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#0446DB]/10">
                    <Package className="h-4 w-4 text-[#0446DB]" />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                      Shipment Details
                    </h2>

                    <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                      Enter your order information
                    </p>
                  </div>
                </div>
              </div>

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5 p-5"
              >
                {/* PICKUP */}

                <FormInput
                  label="Pickup Pincode"
                  icon={MapPin}
                  type="text"
                  name="pickup_pincode"
                  value={formData.pickup_pincode}
                  onChange={(e) => {
    const value = e.target.value;

    // Only numbers and maximum 6 digits
    if (/^\d{0,6}$/.test(value)) {
      handleInputChange(e);
    }
  }}
                  placeholder="e.g. 110001"
                  maxLength={6}
                  required
                />

                {/* ROUTE */}

                <div className="relative flex items-center px-1">
                  <div className="h-px flex-1 bg-gray-100 dark:bg-neutral-800" />

                  <div className="mx-3 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800">
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </div>

                  <div className="h-px flex-1 bg-gray-100 dark:bg-neutral-800" />
                </div>

                {/* DESTINATION */}

                <FormInput
                  label="Destination Pincode"
                  icon={MapPin}
                  type="text"
                  name="destination_pincode"
                  value={formData.destination_pincode}
                  onChange={(e) => {
    const value = e.target.value;

    // Only numbers and maximum 6 digits
    if (/^\d{0,6}$/.test(value)) {
      handleInputChange(e);
    }
  }}
                  placeholder="e.g. 122001"
                  maxLength={6}
                  required
                />

                {/* VALUE + WEIGHT */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                  <FormInput
                    label="Order Value"
                    icon={IndianRupee}
                     type="text"
                    name="order_value"
                    value={formData.order_value}
onChange={(e) => {
    const value = e.target.value;

    if (/^\d*\.?\d*$/.test(value)) {
      handleInputChange(e);
    }
  }}                    placeholder="₹ 1000"
                    min="0"
                    step="1"
                    required
                  />

                  <FormInput
                    label="Weight"
                    icon={Weight}
                     type="text"
                    name="order_weight"
                    value={formData.order_weight}
onChange={(e) => {
    const value = e.target.value;

    if (/^\d*\.?\d*$/.test(value)) {
      handleInputChange(e);
    }
  }}                    placeholder="500"
                    suffix="g"
                    min="0"
                    step="1"
                    required
                  />
                </div>

                {/* ORDER TYPE */}

                <div className="grid grid-cols-3 gap-1">
  <FormInput
    label="Package Length"
    icon={Ruler}
    type="text"
    name="package_length"
    value={formData.package_length}
onChange={(e) => {
    const value = e.target.value;

    if (/^\d*\.?\d*$/.test(value)) {
      handleInputChange(e);
    }
  }}    placeholder="Length"
    suffix="cm"
    required
  />

  <FormInput
    label="Package Width"
    icon={MoveHorizontal}
    type="number"
    name="package_width"
    value={formData.package_width}
    onChange={handleInputChange}
    placeholder="Width"
    suffix="cm"
    required
  />

  <FormInput
    label="Package Height"
    icon={MoveVertical}
    type="number"
    name="package_height"
    value={formData.package_height}
    onChange={handleInputChange}
    placeholder="Height"
    suffix="cm"
    required
  />
</div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-700 dark:text-neutral-300">
                    Payment Method
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <PaymentOption
                      active={formData.order_type === "cod"}
                      title="COD"
                      description="Cash"
                      icon={Banknote}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          order_type: "cod",
                        }))
                      }
                    />

                    <PaymentOption
                      active={formData.order_type === "prepaid"}
                      title="Prepaid"
                      description="Paid"
                      icon={WalletCards}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          order_type: "prepaid",
                        }))
                      }
                    />
                  </div>

                  <input
                    type="radio"
                    name="order_type"
                    value="cod"
                    checked={formData.order_type === "cod"}
                    onChange={handleInputChange}
                    required
                    className="sr-only"
                  />

                  <input
                    type="radio"
                    name="order_type"
                    value="prepaid"
                    checked={formData.order_type === "prepaid"}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                </div>

                {/* ERROR */}

                {error && (
                  <div className="flex items-start gap-2.5 rounded-sm border border-red-200 bg-red-50 p-3.5 dark:border-red-500/20 dark:bg-red-500/10">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                    <p className="text-xs leading-5 text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                )}

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#033BB9] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Calculating Rates...
                    </>
                  ) : (
                    <>
                      Calculate Shipping Rate
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

           
          </div>

          {/* =================================================
              RIGHT SECTION
          ================================================= */}

          <div className="min-w-0">
            {/* ===============================================
                LOADING
            =============================================== */}

            {loading && (
              <div className="flex min-h-[520px] items-center justify-center rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex flex-col items-center px-5 text-center">
                  <div className="relative flex h-16 w-16 items-center justify-center">
                    <div className="absolute inset-0 rounded-sm bg-[#0446DB]/10" />

                    <div className="absolute inset-0 animate-ping rounded-sm bg-[#0446DB]/5" />

                    <Loader2 className="relative h-7 w-7 animate-spin text-[#0446DB]" />
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-gray-900 dark:text-white">
                    Finding Shipping Rates
                  </h3>

                  <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500 dark:text-neutral-400">
                    Checking available SDD and NDD pricing for
                    your shipment.
                  </p>

                  <div className="mt-4 flex gap-1.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#0446DB] [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#0446DB] [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#0446DB]" />
                  </div>
                </div>
              </div>
            )}

            {/* ===============================================
                INITIAL EMPTY STATE
            =============================================== */}

            {!pricingData && !loading && (
              <div className="flex min-h-[520px] items-center justify-center overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="max-w-md px-6 py-12 text-center">
                  <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                    <div className="absolute h-20 w-20 rounded-full bg-blue-50 dark:bg-blue-500/10" />

                    <div className="absolute h-14 w-14 rounded-full bg-blue-100/70 dark:bg-blue-500/10" />

                    <Truck className="relative h-8 w-8 text-[#0446DB]" />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
                    Calculate Your Shipping Rate
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-neutral-400">
                    Enter your shipment details to compare
                    available Same Day and Next Day delivery
                    rates.
                  </p>

                 

                  
                </div>
              </div>
            )}

            {/* ===============================================
                RESULT
            =============================================== */}

            {pricingData?.success && !loading && (
              <div className="space-y-4">
                {/* RESULT HEADER */}

                <div className="rounded-sm border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-green-50 dark:bg-green-500/10">
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>

                        <div>
                          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                            Available Shipping Rates
                          </h2>

                          <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                            Compare available rates for your
                            shipment
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-sm border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                        {formData.pickup_pincode}
                      </span>

                      <ArrowRight className="h-3.5 w-3.5 text-gray-400" />

                      <span className="rounded-sm border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                        {formData.destination_pincode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RESULT CARD */}

                <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                  {/* TABS */}

                  <div className="border-b border-gray-100 p-3 dark:border-neutral-800">
                    <div className="grid grid-cols-2 gap-2 rounded-sm bg-gray-100 p-1 dark:bg-neutral-800">
                      <DeliveryTab
                        active={activeTab === "sdd"}
                        onClick={() => setActiveTab("sdd")}
                        icon={Zap}
                        title="Same Day"
                        subtitle="SDD"
                        count={sddCount}
                      />

                      <DeliveryTab
                        active={activeTab === "ndd"}
                        onClick={() => setActiveTab("ndd")}
                        icon={CalendarDays}
                        title="Next Day"
                        subtitle="NDD"
                        count={nddCount}
                      />
                    </div>
                  </div>

                  {/* TABLE INFO */}

                  <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                        {activeTab === "sdd"
                          ? "Same Day Delivery Rates"
                          : "Next Day Delivery Rates"}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                        Pricing according to applicable weight
                        slab
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-300">
                      {activePricing.length}{" "}
                      {activePricing.length === 1
                        ? "Rate"
                        : "Rates"}
                    </span>
                  </div>

                  {/* TABLE */}

                  <div className="overflow-x-auto">
                    <table className="min-w-[720px] w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50/80 dark:border-neutral-800 dark:bg-neutral-950/50">
                          <TableHeading>
                            Weight Slab
                          </TableHeading>

                          <TableHeading>
                            Weight Limit
                          </TableHeading>

                          <TableHeading>
                            Shipping Rate
                          </TableHeading>

                          <TableHeading>
                            COD Charge
                          </TableHeading>

                          <TableHeading>
                            Final Price
                          </TableHeading>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                        {activePricing.length > 0 ? (
                          activePricing.map((item, index) => (
                            <tr
                              key={index}
                              className="transition-colors hover:bg-gray-50/80 dark:hover:bg-neutral-800/50"
                            >
                              {/* SLAB */}

                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-gray-100 dark:bg-neutral-800">
                                    <Scale className="h-3.5 w-3.5 text-gray-500 dark:text-neutral-400" />
                                  </div>

                                  <span className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                    {item?.slab}g
                                  </span>
                                </div>
                              </td>

                              {/* LIMIT */}

                              <td className="px-5 py-4">
                                <span className="text-sm text-gray-600 dark:text-neutral-300">
                                  {item?.weight_limit}g
                                </span>
                              </td>

                              {/* SHIPPING */}

                              <td className="px-5 py-4">
                                <span className="whitespace-nowrap text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                  {formatPrice(
                                    item?.calculated_price
                                  )}
                                </span>
                              </td>

                              {/* COD */}

                              <td className="px-5 py-4">
                                {Number(item?.cod_charge) > 0 ? (
                                  <span className="inline-flex whitespace-nowrap rounded-md bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                                    +
                                    {formatPrice(
                                      item?.cod_charge
                                    )}
                                  </span>
                                ) : (
                                  <span className="text-sm text-gray-400">
                                    —
                                  </span>
                                )}
                              </td>

                              {/* FINAL */}

                              <td className="px-5 py-4">
                                <span className="inline-flex whitespace-nowrap rounded-sm bg-blue-50 px-3 py-1.5 text-sm font-bold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-300">
                                  {formatPrice(
                                    item?.final_price
                                  )}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-5 py-16 text-center"
                            >
                              <div className="flex flex-col items-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-gray-100 dark:bg-neutral-800">
                                  <Truck className="h-5 w-5 text-gray-400" />
                                </div>

                                <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-neutral-300">
                                  No{" "}
                                  {activeTab.toUpperCase()} Rates
                                  Available
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                  No pricing found for this
                                  delivery service.
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* FOOTER */}

                  {activePricing.length > 0 && (
                    <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-950/40">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-neutral-400">
                        <ReceiptIndianRupee className="h-4 w-4" />

                        {formData.order_type === "cod"
                          ? "COD charges included where applicable"
                          : "Prepaid shipment pricing"}
                      </div>

                      <span className="text-xs font-medium text-gray-400">
                        Weight: {formData.order_weight}g
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   FORM INPUT
========================================================= */

const FormInput = ({
  label,
  icon: Icon,
  suffix,
  ...props
}) => {
  return (
    <div>
      <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-neutral-300">
        {Icon && (
          <Icon className="h-3.5 w-3.5 text-gray-400" />
        )}

        {label}

        {props.required && (
          <span className="text-red-500">*</span>
        )}
      </label>

      <div className="relative">
        <input
          {...props}
          className={`
            h-11
            w-full
            rounded-sm
            border
            border-gray-200
            bg-white
            px-3.5
            text-sm
            font-medium
            text-gray-800
            outline-none
            transition-all

            placeholder:text-gray-400
            placeholder:font-normal

            hover:border-gray-300

            focus:border-[#0446DB]
            focus:ring-4
            focus:ring-[#0446DB]/10

            dark:border-neutral-700
            dark:bg-neutral-800
            dark:text-neutral-200
            dark:placeholder:text-neutral-500
            dark:hover:border-neutral-600

            ${suffix ? "pr-10" : ""}
          `}
        />

        {suffix && (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   PAYMENT OPTION
========================================================= */

const PaymentOption = ({
  active,
  title,
  description,
  icon: Icon,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative
        flex
        items-center
        gap-3
        rounded-sm
        border
        p-3
        text-left
        transition-all

        ${
          active
            ? `
              border-[#0446DB]
              bg-blue-50/70
              ring-2
              ring-[#0446DB]/10

              dark:border-blue-500
              dark:bg-blue-500/10
            `
            : `
              border-gray-200
              bg-white

              hover:border-gray-300
              hover:bg-gray-50

              dark:border-neutral-700
              dark:bg-neutral-800
              dark:hover:bg-neutral-800/80
            `
        }
      `}
    >
      <div
        className={`
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-sm

          ${
            active
              ? "bg-[#0446DB] text-white"
              : "bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-neutral-300"
          }
        `}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <p
          className={`text-xs font-semibold ${
            active
              ? "text-[#0446DB] dark:text-blue-300"
              : "text-gray-800 dark:text-neutral-200"
          }`}
        >
          {title}
        </p>

        <p className="mt-0.5 text-[10px] text-gray-400">
          {description}
        </p>
      </div>

      {active && (
        <div className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0446DB]">
          <Check className="h-2.5 w-2.5 text-white" />
        </div>
      )}
    </button>
  );
};

/* =========================================================
   DELIVERY TAB
========================================================= */

const DeliveryTab = ({
  active,
  onClick,
  icon: Icon,
  title,
  subtitle,
  count,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        items-center
        justify-between
        gap-3
        rounded-sm
        px-4
        py-3
        text-left
        transition-all

        ${
          active
            ? `
              bg-white
              text-[#0446DB]
              shadow-sm

              dark:bg-neutral-700
              dark:text-blue-300
            `
            : `
              text-gray-500
              hover:text-gray-700

              dark:text-neutral-400
              dark:hover:text-neutral-200
            `
        }
      `}
    >
      <div className="flex items-center gap-2.5">
        <Icon className="h-4 w-4" />

        <div>
          <p className="text-xs font-semibold">
            {title}
          </p>

          <p className="mt-0.5 text-[10px] opacity-60">
            {subtitle}
          </p>
        </div>
      </div>

      <span
        className={`
          rounded-full
          px-2
          py-0.5
          text-[10px]
          font-semibold

          ${
            active
              ? "bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-300"
              : "bg-gray-200 text-gray-500 dark:bg-neutral-600 dark:text-neutral-300"
          }
        `}
      >
        {count}
      </span>
    </button>
  );
};

/* =========================================================
   TABLE HEADING
========================================================= */

const TableHeading = ({ children }) => {
  return (
    <th className="whitespace-nowrap px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
      {children}
    </th>
  );
};

/* =========================================================
   MINI STEP
========================================================= */

const MiniStep = ({ number, label }) => {
  return (
    <div className="flex items-center gap-1.5">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-300">
        {number}
      </span>

      <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400">
        {label}
      </span>
    </div>
  );
};

export default MerchantPricingCalculator;