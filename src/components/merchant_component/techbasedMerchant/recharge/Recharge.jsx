
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

import GenerateUPI from "../../../../utils/GenerateUPI";
import GenerateSubscriptionUPI from "./GenerateSubscriptionUPI";
import AxiosInstance from "../../../../Helper/axiosInstance";
import TechGenerateUPI from "./GenerateUpiLink";
import SubscriptionPlans from "./SubscriptionPlans";

const baseUrl = import.meta.env.VITE_BASE_URL;

function Recharge() {
  const token = localStorage.getItem("token");

  const decoded = useMemo(() => {
    try {
      return token ? jwtDecode(token) : {};
    } catch (error) {
      return {};
    }
  }, [token]);

  const [activeTab, setActiveTab] = useState("recharge");
  const [couponApply, setCouponApply] = useState({});
  const [selectedAmount, setSelectedAmount] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [customAmount, setCustomAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
const staticSubscriptionPlans = [
  {
    id: "basic",
    name: "Basic",
    subtitle: "For small self-delivery teams",
    price: "499",
    oldPrice: "",
    buttonText: "Get Basic Access",
    type: "dark",
    features: [
      "500 self-delivery orders / month",
      "Up to 4 riders",
      "60 API requests / minute",
      "API documentation access",
      "1 integration",
      "Standard support",
    ],
  },
  {
    id: "Pro",
    name: "Pro",
    subtitle: "For growing delivery operations",
    price: "999",
    oldPrice: "",
    buttonText: "Get Pro Access",
    type: "light",
    popular: true,
    features: [
      "2,000 self-delivery orders / month",
      "Up to 10 riders",
      "300 API requests / minute",
      "API documentation access",
      "Webhooks enabled",
      "Up to 3 integrations",
      "Priority support",
    ],
    extraFeatures: [],
  },
  {
    id: "elite",
    name: "Elite",
    subtitle: "For high-volume delivery businesses",
    price: "1999",
    oldPrice: "",
    buttonText: "Get Elite Access",
    type: "dark",
    features: [
      "10,000 self-delivery orders / month",
      "Up to 25 riders",
      "1,000 API requests / minute",
      "API documentation access",
      "Webhooks enabled",
      "Up to 10 integrations",
      "Dedicated support",
    ],
    extraFeatures: [
     
    ],
  },
];
  const rechargeAmounts = [100, 200, 500, 1000, 2000, 5000];

  const isTechBased = decoded?.tech_based === "1";

  useEffect(() => {
    getSubscriptionPlan();
  }, []);

  const getSubscriptionPlan = async () => {
    try {
      setIsLoading(true);
      const response = await AxiosInstance.get('/api/tech-merchant/getAllSubscriptionPlans')
      

      setSubscriptionPlans(response?.data?.data || []);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load subscription plans"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetCoupon = () => {
    setCouponApply({});
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    resetCoupon();
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setCustomAmount("");
      setSelectedAmount("");
      resetCoupon();
      return;
    }

    const sanitized = value.replace(/[^\d]/g, "");
    const amount = Number(sanitized);

    setCustomAmount(sanitized);
    setSelectedAmount(amount);
    resetCoupon();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  };

  const applyCoupon = async () => {
    try {
      if (!selectedAmount || !coupon.trim()) {
        toast.error("Please select an amount and enter a coupon");
        return;
      }

      setCouponLoading(true);

      const response = await axios.post(
        `${baseUrl}/api/tech-merchant/validateCoupon`,
        {
          coupon_code: coupon.trim(),
          rechargeAmount: selectedAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCouponApply(response.data);

      if (response?.data?.success) {
        toast.success(
          response?.data?.message || "Coupon applied successfully"
        );
      }
    } catch (error) {
      setCouponApply({});

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to apply coupon"
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const finalAmount =
    couponApply?.success && couponApply?.discountAmount
      ? Math.max(
          0,
          Number(selectedAmount || 0) -
            Number(couponApply.discountAmount || 0)
        )
      : Number(selectedAmount || 0);

  const WalletIcon = ({ className = "h-5 w-5" }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7.5A2.5 2.5 0 0 1 5.5 5h11A2.5 2.5 0 0 1 19 7.5v9A2.5 2.5 0 0 1 16.5 19h-11A2.5 2.5 0 0 1 3 16.5v-9Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 10h5v4h-5a2 2 0 0 1 0-4Z"
      />
    </svg>
  );

  const CrownIcon = ({ className = "h-5 w-5" }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4 7 4 4 4-7 4 7 4-4-2 10H6L4 7Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 20h10"
      />
    </svg>
  );

  const ShieldIcon = ({ className = "h-5 w-5" }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3 5 6v5c0 4.2 2.5 8 7 10 4.5-2 7-5.8 7-10V6l-7-3Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9 12 2 2 4-4"
      />
    </svg>
  );

  const CheckIcon = ({ className = "h-4 w-4" }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m5 12 4 4L19 6"
      />
    </svg>
  );

  const TicketIcon = ({ className = "h-5 w-5" }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5V9a3 3 0 0 0 0 6v2.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5V15a3 3 0 0 0 0-6V6.5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v1m0 2v2m0 2v1"
      />
    </svg>
  );

  const LockIcon = ({ className = "h-4 w-4" }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );

  return (
    <div className="min-h-auto bg-[#f5f8fb] dark:bg-[#0B0D10]">
      <div className="mx-auto">
        {/* =====================================================
            PREMIUM HERO
        ====================================================== */}
        <section className=" overflow-hidden border-b border-white/10  px-4 dark:bg-neutral-900">
          

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
             

              <h1 className="mt-3 text-2xl font-bold tracking-tight dark:text-white sm:text-3xl lg:text-4xl">
                Wallet & Billing
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 dark:text-blue-100/90 sm:text-base">
                Add funds to your wallet
                {isTechBased
                  ? " or upgrade your account with a subscription plan."
                  : "."}
              </p>
            </div>

          </div>
        </section>

        {/* =====================================================
            PAGE CONTENT
        ====================================================== */}
        <div className="">
          <div className="overflow-hidden rounded-sm border border-gray-200/80 bg-white shadow-[0_20px_70px_-35px_rgba(15,23,42,0.25)] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
            {/* Tabs */}
            <div className="flex flex-col gap-4 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-neutral-800">
              

              
              <div className="w-full min-w-0 sm:w-auto">
                <div
                  className={`
                    grid w-full min-w-0 max-w-full gap-1
                    rounded-[18px]
                    border border-slate-200/80
                    bg-[#F1F4F8] p-[5px]
                    shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)]
                    sm:inline-flex sm:w-auto sm:p-[6px]

                    ${isTechBased ? "grid-cols-2" : "grid-cols-1"}

                    dark:border-neutral-700/70
                    dark:bg-neutral-800
                  `}
                >
                  {/* WALLET RECHARGE */}
                  <button
                    type="button"
                    onClick={() => setActiveTab("recharge")}
                    className={`
                      group flex min-w-0 flex-col
                      items-center justify-center
                      gap-1.5 rounded-[14px]
                      px-2 py-3
                      text-xs font-semibold
                      transition-all duration-200

                      sm:min-w-[190px]
                      sm:flex-row sm:gap-3
                      sm:px-5 sm:py-3 sm:text-sm

                      ${
                        activeTab === "recharge"
                          ? `
                            bg-white text-[#0969F9]
                            shadow-[0_3px_10px_rgba(15,23,42,0.10)]
                            ring-1 ring-black/[0.03]
                            dark:bg-neutral-700
                            dark:text-blue-400
                            dark:ring-white/[0.05]
                          `
                          : `
                            text-slate-500
                            hover:bg-white/50
                            hover:text-slate-800
                            dark:text-neutral-400
                            dark:hover:bg-neutral-700/50
                            dark:hover:text-white
                          `
                      }
                    `}
                  >
                    <span
                      className={`
                        flex h-8 w-8 shrink-0
                        items-center justify-center
                        rounded-[9px]
                        transition-all duration-200

                        ${
                          activeTab === "recharge"
                            ? `
                              bg-[#E8F1FF] text-[#0969F9]
                              dark:bg-blue-500/15
                              dark:text-blue-400
                            `
                            : `
                              bg-slate-200/70 text-slate-500
                              dark:bg-neutral-700
                              dark:text-neutral-400
                            `
                        }
                      `}
                    >
                      <WalletIcon
                        className="h-[17px] w-[17px]"
                        strokeWidth={2}
                      />
                    </span>

                    <span className="text-center leading-tight sm:whitespace-nowrap">
                      Wallet Recharge
                    </span>
                  </button>

                  {/* SUBSCRIPTION */}
                  {isTechBased && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("subscription")}
                      className={`
                        group flex min-w-0 flex-col
                        items-center justify-center
                        gap-1.5 rounded-[14px]
                        px-2 py-3
                        text-xs font-semibold
                        transition-all duration-200

                        sm:min-w-[190px]
                        sm:flex-row sm:gap-3
                        sm:px-5 sm:py-3 sm:text-sm

                        ${
                          activeTab === "subscription"
                            ? `
                              bg-white text-[#0969F9]
                              shadow-[0_3px_10px_rgba(15,23,42,0.10)]
                              ring-1 ring-black/[0.03]
                              dark:bg-neutral-700
                              dark:text-blue-400
                              dark:ring-white/[0.05]
                            `
                            : `
                              text-slate-500
                              hover:bg-white/50
                              hover:text-slate-800
                              dark:text-neutral-400
                              dark:hover:bg-neutral-700/50
                              dark:hover:text-white
                            `
                        }
                      `}
                    >
                      <span
                        className={`
                          flex h-8 w-8 shrink-0
                          items-center justify-center
                          rounded-[9px]
                          transition-all duration-200

                          ${
                            activeTab === "subscription"
                              ? `
                                bg-[#E8F1FF] text-[#0969F9]
                                dark:bg-blue-500/15
                                dark:text-blue-400
                              `
                              : `
                                bg-slate-200/70 text-slate-500
                                dark:bg-neutral-700
                                dark:text-neutral-400
                              `
                          }
                        `}
                      >
                        <CrownIcon
                          className="h-[17px] w-[17px]"
                          strokeWidth={2}
                        />
                      </span>

                      <span className="text-center leading-tight sm:whitespace-nowrap">
                        Subscription
                      </span>
                    </button>
                  )}
                </div>
              </div>


              <div className="hidden items-center gap-2 text-xs font-medium text-gray-400 sm:flex dark:text-neutral-500">
                <LockIcon />
                Encrypted & secure payment
              </div>
            </div>

            {/* =================================================
                RECHARGE TAB
            ================================================== */}
            {activeTab === "recharge" ? (
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px]">
                {/* Left */}
                <div className="border-b border-gray-100 p-4 sm:p-6 lg:border-b-0 lg:border-r lg:p-8 dark:border-neutral-800">
                  <div className="max-w-3xl">
                    <div className="mb-7">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0446DB] dark:text-blue-400">
                        Add Money
                      </p>

                      <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        How much would you like to add?
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-neutral-400">
                        Choose a preset value or enter a custom amount.
                      </p>
                    </div>

                    {/* Quick amounts */}
                    <div>
                      

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {rechargeAmounts.map((amount) => {
                          const active =
                            Number(selectedAmount) === amount && !customAmount;

                          return (
                            <button
                              key={amount}
                              type="button"
                              onClick={() => handleAmountSelect(amount)}
                              disabled={couponApply?.success}
                              className={`relative min-h-[85px] overflow-hidden rounded-sm border p-2 text-left transition-all duration-200 ${
                                active
                                  ? "border-[#0446DB] bg-[#F2F6FF] shadow-[0_10px_25px_-15px_rgba(4,70,219,0.6)] dark:border-blue-500 dark:bg-blue-500/10"
                                  : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-blue-500"
                              } ${
                                couponApply?.success
                                  ? "cursor-not-allowed opacity-60"
                                  : ""
                              }`}
                            >
                              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-neutral-500">
                                Add Funds
                              </p>

                              <p
                                className={`mt-2 text-xl font-bold ${
                                  active
                                    ? "text-[#0446DB] dark:text-blue-400"
                                    : "text-gray-900 dark:text-neutral-100"
                                }`}
                              >
                                {formatCurrency(amount)}
                              </p>

                              {active && (
                                <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#0446DB] text-white shadow-sm">
                                  <CheckIcon className="h-3.5 w-3.5" />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom amount */}
                    <div className="mt-6">
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-neutral-400">
                        Custom Amount
                      </label>

                      <div className="relative">
                        <div className="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg bg-gray-100 text-base font-bold text-gray-500 dark:bg-neutral-800 dark:text-neutral-300">
                          ₹
                        </div>

                        <input
                          type="text"
                          inputMode="numeric"
                          disabled={couponApply?.success}
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                          placeholder="Enter your amount"
                          className="w-full rounded-sm border border-gray-200 bg-white py-2 pl-16 pr-4 text-lg font-semibold text-gray-900 outline-none transition-all focus:border-[#0446DB] focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-600 dark:disabled:bg-neutral-800"
                        />
                      </div>
                    </div>

                    {/* Coupon */}
                    <div className="mt-6 overflow-hidden rounded-sm border border-gray-200 bg-gray-50/60 dark:border-neutral-800 dark:bg-neutral-950/60">
                      <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-4 dark:border-neutral-800">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0446DB] shadow-sm dark:bg-neutral-900 dark:text-blue-400">
                            <TicketIcon />
                          </div>

                          <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                              Apply Coupon
                            </h3>

                            <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                              Enter a promo code to get a discount.
                            </p>
                          </div>
                        </div>

                        {couponApply?.success && (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold tracking-wide text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                            APPLIED
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <input
                            type="text"
                            value={coupon}
                            disabled={couponApply?.success}
                            onChange={(e) => {
                              setCoupon(e.target.value.toUpperCase());

                              if (couponApply?.success) {
                                resetCoupon();
                              }
                            }}
                            placeholder="Enter coupon code"
                            className="min-w-0 flex-1 rounded-sm border border-gray-200 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-wide text-gray-900 outline-none transition focus:border-[#0446DB] focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-600 dark:disabled:bg-neutral-800"
                          />

                          <button
                            type="button"
                            onClick={applyCoupon}
                            disabled={
                              !coupon.trim() ||
                              !selectedAmount ||
                              couponLoading ||
                              couponApply?.success
                            }
                            className="rounded-sm bg-[#0446DB] px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-neutral-700"
                          >
                            {couponLoading
                              ? "Applying..."
                              : couponApply?.success
                                ? "Applied"
                                : "Apply Coupon"}
                          </button>
                        </div>

                        {couponApply?.success && (
                          <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                            <CheckIcon />
                            You saved{" "}
                            {formatCurrency(
                              couponApply?.discountAmount || 0
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right summary */}
                <aside className="bg-gray-50/50 p-4 sm:p-6 lg:p-7 dark:bg-neutral-950/40">
                  <div className="lg:sticky lg:top-5">
                    <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                      <div className="bg-[#0F172A] px-5 py-5 text-white dark:bg-neutral-950">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Payment Summary
                        </p>

                        <div className="mt-3 flex items-end justify-between gap-3">
                          <div>
                            <p className="text-sm text-slate-300">
                              Amount payable
                            </p>

                            <p className="mt-1 text-3xl font-bold tracking-tight">
                              {formatCurrency(selectedAmount)}
                            </p>
                          </div>

                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                            <WalletIcon className="h-5 w-5" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 p-5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 dark:text-neutral-400">
                            Recharge amount
                          </span>

                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(selectedAmount || 0)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 dark:text-neutral-400">
                            Extra Credit
                          </span>

                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            +
                            {formatCurrency(
                              couponApply?.success
                                ? couponApply?.discountAmount || 0
                                : 0
                            )}
                          </span>
                        </div>

                        <div className="border-t border-dashed border-gray-200 pt-4 dark:border-neutral-700">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-700 dark:text-neutral-200">
                              Total
                            </span>

                            <span className="text-xl font-bold text-[#0446DB] dark:text-blue-400">
                              {formatCurrency(
                                Number(selectedAmount || 0) +
                                  (couponApply?.success
                                    ? Number(couponApply?.discountAmount || 0)
                                    : 0)
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="rounded-sm border border-blue-100 bg-blue-50 p-3 dark:border-blue-500/20 dark:bg-blue-500/10">
                          <div className="flex gap-2">
                            <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#0446DB] dark:text-blue-400" />

                            <p className="text-xs leading-5 text-blue-700 dark:text-blue-300">
                              Payment is securely processed via UPI.
                            </p>
                          </div>
                        </div>

                        {!selectedAmount ? (
                          <button
                            type="button"
                            disabled
                            className="w-full cursor-not-allowed rounded-sm bg-gray-200 py-3.5 text-sm font-bold text-gray-400 dark:bg-neutral-800 dark:text-neutral-600"
                          >
                            Select amount to continue
                          </button>
                        ) : (
                          <TechGenerateUPI
                            text={`Pay ${formatCurrency(selectedAmount)} →`}
                            disabled={
                              !selectedAmount ||
                              Number(selectedAmount) <= 0
                            }
                            amount={selectedAmount}
                            coupon={coupon || ""}
                            className="w-full rounded-sm bg-[#0446DB] py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
                          />
                        )}

                        <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-gray-400 dark:text-neutral-500">
                          <LockIcon className="h-3.5 w-3.5" />
                          Safe & encrypted transaction
                        </div>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            ) : (
              /* =================================================
                  SUBSCRIPTION TAB
              ================================================== */
              <div className="">
                <div className=" flex flex-col px-6 gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs  font-semibold uppercase tracking-[0.16em] text-[#0446DB] dark:text-blue-400">
                      Subscription Plans
                    </p>

                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Pick the plan that fits your business
                    </h2>

                    <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
                      Simple pricing, clear benefits and secure payment.
                    </p>
                  </div>

                  <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                    <ShieldIcon className="h-4 w-4" />
                    Secure Subscription
                  </div>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="h-[320px] animate-pulse rounded-3xl border border-gray-200 bg-gray-100 dark:border-neutral-800 dark:bg-neutral-800"
                      />
                    ))}
                  </div>
                ) : subscriptionPlans?.length > 0 ? (
                  

                  <>
                   
                   
                  <SubscriptionPlans/>
                  </>
                ) : (
                  <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center dark:border-neutral-700 dark:bg-neutral-950">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-gray-400 shadow-sm dark:bg-neutral-900 dark:text-neutral-500">
                      <CrownIcon />
                    </div>

                    <p className="mt-4 font-semibold text-gray-700 dark:text-neutral-300">
                      No subscription plans available
                    </p>

                    <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
                      Please try again later.
                    </p>
                  </div>
                )}

                {/* <div className="mt-7">
                  {!selectedPlan ? (
                    <button
                      type="button"
                      disabled
                      className="w-full cursor-not-allowed rounded-xl bg-gray-200 py-3.5 text-sm font-bold text-gray-400 dark:bg-neutral-800 dark:text-neutral-600"
                    >
                      Select a plan to continue
                    </button>
                  ) : (
                    <div className="rounded-sm border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-500/20 dark:bg-blue-500/5">
                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-neutral-500">
                            Selected Plan
                          </p>

                          <p className="mt-1 font-bold text-gray-900 dark:text-white">
                            {selectedPlan?.plan_name}
                          </p>
                        </div>

                        <p className="text-xl font-bold text-[#0446DB] dark:text-blue-400">
                          {formatCurrency(selectedPlan?.amount)}
                        </p>
                      </div>

                      <GenerateSubscriptionUPI
                        plane={`Subscribe to ${
                          selectedPlan?.plan_name || "Plan"
                        }`}
                        plan_id={selectedPlan?.id}
                        amount={selectedPlan?.amount}
                        disabled={!selectedPlan}
                      />
                    </div>
                  )}
                </div> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recharge;
