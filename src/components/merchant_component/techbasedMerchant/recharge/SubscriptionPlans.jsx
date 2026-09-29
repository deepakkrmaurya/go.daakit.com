import React, { useEffect, useState } from "react";
import {
  Package,
  BarChart3,
  Crown,
  Check,
  X,
  Loader2,
} from "lucide-react";

import { toast } from "react-toastify";
import AxiosInstance from "../../../../Helper/axiosInstance";
import GenerateSubscriptionUPI from "./GenerateSubscriptionUPI";

// ======================================================
// STATIC UI CONFIG
// Price + plan id API se aayega
// ======================================================

const staticSubscriptionPlans = [
  {
    id: "basic",
    name: "Basic",
    subtitle: "",
    buttonText: "Get Basic Access",
    type: "dark",
    popular: false,

    features: [
      "500 self-delivery orders / month",
      "Up to 4 riders",
      "60 API requests / minute",
      "API documentation access",
      "1 integration",
      "Standard support",
    ],

    unavailableFeatures: ["Webhooks not included"],
    extraFeatures: [],
  },
  
  {
    id: "pro",
    name: "Pro",
    subtitle: "",
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

    unavailableFeatures: [],
    extraFeatures: [],
  },

  {
    id: "elite",
    name: "Elite",
    subtitle: "",
    buttonText: "Get Elite Access",
    type: "dark",
    popular: false,

    features: [
      "10,000 self-delivery orders / month",
      "Up to 25 riders",
      "1,000 API requests / minute",
      "API documentation access",
      "Webhooks enabled",
      "Up to 10 integrations",
      "Dedicated support",
    ],

    unavailableFeatures: [],
    extraFeatures: [],
  },
];

// ======================================================
// COMPONENT
// ======================================================

const SubscriptionPlans = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // GET PLAN API
  // ======================================================

  const getPlan = async () => {
    try {
      setLoading(true);

      const response = await AxiosInstance.get(
        "/api/tech-merchant/getAllSubscriptionPlans"
      );

      const plans = response?.data?.data || [];

      console.log("Subscription Plans API:", plans);

      setSubscriptionPlans(
        Array.isArray(plans) ? plans : []
      );
    } catch (error) {
      console.error("Get subscription plan error:", error);

      setSubscriptionPlans([]);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load subscription plans"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // CALL API
  // ======================================================

  useEffect(() => {
    getPlan();
  }, []);

  // ======================================================
  // NORMALIZE PLAN NAME
  //
  // "Basic Plan" => "basic"
  // "Pro Plan"   => "pro"
  // "Elite Plan" => "elite"
  // ======================================================

  const normalizePlanName = (value = "") => {
    return String(value)
      .toLowerCase()
      .replace(/\bplan\b/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  // ======================================================
  // MATCH STATIC PLAN WITH API PLAN
  // ======================================================

  const getApiPlan = (staticPlan) => {
    if (!Array.isArray(subscriptionPlans)) {
      return null;
    }

    const staticName = normalizePlanName(
      staticPlan?.name
    );

    const matchedPlan = subscriptionPlans.find(
      (apiPlan) => {
        const apiName = normalizePlanName(
          apiPlan?.plan_name ||
            apiPlan?.name ||
            apiPlan?.plan ||
            ""
        );

        return apiName === staticName;
      }
    );

    return matchedPlan || null;
  };

  // ======================================================
  // GET PRICE FROM API
  // ======================================================

  const getPlanPrice = (apiPlan) => {
    if (!apiPlan) {
      return "";
    }

    const amount =
      apiPlan?.amount ??
      apiPlan?.price ??
      apiPlan?.plan_amount ??
      "";

    if (
      amount === null ||
      amount === undefined ||
      amount === ""
    ) {
      return "";
    }

    return String(amount).replace("₹", "").trim();
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="px-4 py-12 dark:bg-black sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[350px] max-w-[1280px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#0446DB]" />

            <p className="text-sm font-medium text-slate-500 dark:text-neutral-400">
              Loading subscription plans...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // NO PLAN
  // ======================================================

  if (!subscriptionPlans?.length) {
    return (
      <div className="px-4 py-10 dark:bg-black">
        <div className="mx-auto max-w-[1280px]">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center dark:border-neutral-700 dark:bg-neutral-900">
            <Crown className="mx-auto h-10 w-10 text-slate-400" />

            <h3 className="mt-4 text-base font-bold text-slate-700 dark:text-white">
              No subscription plans available
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">
              Please try again later.
            </p>

            <button
              type="button"
              onClick={getPlan}
              className="mt-5 rounded-lg bg-[#0446DB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0339B5]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

 return (
  <div className="px-4 py-8 dark:bg-black sm:px-6 lg:px-8">
    <div className="mx-auto max-w-[1280px]">
      <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {staticSubscriptionPlans.map((plan) => {
          console.log(plan)
          const isLight = plan.type === "light";

          const isBasic = plan.id?.toLowerCase() === "basic";
          const isPro = plan.id?.toLowerCase() === "pro";
          const isElite =plan.id?.toLowerCase() === "elite";

          // ================================
          // API PLAN
          // ================================

          const apiPlan = getApiPlan(plan);
          const price = getPlanPrice(apiPlan);

          const isSelected =
            selectedPlan?.id === apiPlan?.id;

          return (
            <div
              key={plan.id}
              onClick={() => {
                if (apiPlan) {
                  setSelectedPlan(apiPlan);
                }
              }}
              className={`relative self-start overflow-hidden rounded-[16px] border transition-all duration-200 ${
                isPro
                  ? "border-[#0446DB]"
                  : isElite
                    ? "border-[#F6C945]"
                    : isLight
                      ? "border-neutral-200"
                      : "border-neutral-800"
              } ${
                isLight
                  ? "bg-[#f5f5f7] text-black"
                  : "bg-[#171717] text-white"
              } ${
                apiPlan
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-70"
              } ${
                isSelected
                  ? isElite
                    ? "ring-1 ring-[#F6C945] "
                    : isPro
                      ? "ring-1 ring-[#0446DB]"
                      : "ring-1 ring-neutral-500"
                  : ""
              }`}
            >
              {/* ================= TOP ================= */}

              <div
                className={`relative p-5 ${
                  isLight
                    ? "bg-[#f1f1f3]"
                    : "bg-[#272727]"
                }`}
              >
                {/* POPULAR BADGE */}

                {plan.popular && (
                  <span className="absolute right-4 top-4 rounded-full bg-black px-3 py-1 text-[9px] font-bold text-white">
                    Most popular
                  </span>
                )}

                {/* ICON */}

                <div className="mb-4">
                  {isBasic && (
                    <Package
                      className="h-7 w-7 text-white"
                      strokeWidth={1.7}
                    />
                  )}

                  {isPro && (
                    <BarChart3
                      className="h-7 w-7 text-[#0446DB]"
                      strokeWidth={2}
                    />
                  )}

                  {isElite && (
                    <Crown
                      className="h-7 w-7 fill-[#F6C945] text-[#F6C945]"
                      strokeWidth={1.8}
                    />
                  )}
                </div>

                {/* PLAN NAME */}

                <h3
                  className={`text-[15px] font-bold ${
                    isElite
                      ? "text-[#F6C945]"
                      : ""
                  }`}
                >
                  {
                    apiPlan?.plan_name
                  }
                 
                </h3>

                {/* SUBTITLE */}

                {plan.subtitle && (
                  <p
                    className={`mt-2 text-[10px] ${
                      isLight
                        ? "text-neutral-600"
                        : "text-neutral-300"
                    }`}
                  >
                    {plan.subtitle}
                  </p>
                )}

                {/* ================= PRICE ================= */}

                <div className="mt-5 flex items-end gap-2">
                  {apiPlan && price !== "" ? (
                    <>
                      <span
                        className={`mb-1 text-[14px] font-semibold ${
                          isElite
                            ? "text-[#F6C945]"
                            : isLight
                              ? "text-neutral-500"
                              : "text-white"
                        }`}
                      >
                        ₹
                      </span>

                      <span
                        className={`text-[36px] font-bold leading-none tracking-tight ${
                          isElite
                            ? "text-[#F6C945]"
                            : ""
                        }`}
                      >
                        {price}
                      </span>

                      {apiPlan?.oldPrice && (
                        <span
                          className={`mb-1 text-[13px] font-semibold line-through ${
                            isLight
                              ? "text-neutral-500"
                              : "text-neutral-300"
                          }`}
                        >
                          {apiPlan.oldPrice}
                        </span>
                      )}
                    </>
                  ) : (
                    <span
                      className={`text-[13px] font-semibold ${
                        isElite
                          ? "text-[#F6C945]"
                          : isLight
                            ? "text-neutral-500"
                            : "text-neutral-300"
                      }`}
                    >
                      Plan unavailable
                    </span>
                  )}
                </div>

                {/* VALIDITY */}

                {apiPlan?.validity && (
                  <p
                    className={`mt-2 text-[10px] font-medium ${
                      isElite
                        ? "text-[#F6C945]"
                        : isLight
                          ? "text-neutral-500"
                          : "text-neutral-400"
                    }`}
                  >
                    Valid for {apiPlan.validity} days
                  </p>
                )}

                {/* ================= CTA ================= */}

                <div
                  className="mt-7"
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >
                  {apiPlan ? (
                    <GenerateSubscriptionUPI
                      plane={plan.buttonText}
                      plan_id={apiPlan.id}
                      amount={
                        apiPlan?.amount ??
                        apiPlan?.price ??
                        apiPlan?.plan_amount
                      }
                      disabled={false}
                      isLight={isLight}
                    />
                  ) : (
                    <button
                      type="button"
                      disabled
                      className={`h-10 w-full cursor-not-allowed rounded-lg text-xs font-semibold ${
                        isLight
                          ? "bg-neutral-200 text-neutral-400"
                          : "bg-neutral-700 text-neutral-400"
                      }`}
                    >
                      Plan Unavailable
                    </button>
                  )}
                </div>
              </div>

              {/* ================= FEATURES ================= */}

              <div
                className={`${
                  isLight
                    ? "bg-white"
                    : "bg-[#181818]"
                }`}
              >
                <div className="space-y-5 px-4 py-8">
                  {/* AVAILABLE FEATURES */}

                  {plan.features.map(
                    (feature, index) => (
                      <div
                        key={`${plan.id}-${index}`}
                        className="flex items-start gap-2.5"
                      >
                        <span
                          className={`mt-[1px] flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full ${
                            isElite
                              ? "bg-[#F6C945] text-[#171717]"
                              : isPro
                                ? "bg-[#0446DB] text-white"
                                : "bg-neutral-600 text-white"
                          }`}
                        >
                          <Check
                            className="h-[9px] w-[9px]"
                            strokeWidth={3}
                          />
                        </span>

                        <p
                          className={`text-[11px] font-semibold leading-[1.45] ${
                            isLight
                              ? "text-neutral-900"
                              : "text-white"
                          }`}
                        >
                          {feature}
                        </p>
                      </div>
                    )
                  )}

                  {/* UNAVAILABLE FEATURES */}

                  {plan.unavailableFeatures?.map(
                    (feature, index) => (
                      <div
                        key={`${plan.id}-unavailable-${index}`}
                        className="flex items-start gap-2.5"
                      >
                        <span className="mt-[1px] flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full bg-neutral-500 text-white">
                          <X
                            className="h-[9px] w-[9px]"
                            strokeWidth={3}
                          />
                        </span>

                        <p
                          className={`text-[11px] font-semibold leading-[1.45] ${
                            isLight
                              ? "text-neutral-500"
                              : "text-neutral-400"
                          }`}
                        >
                          {feature}
                        </p>
                      </div>
                    )
                  )}
                </div>

                {/* ================= EXTRA FEATURES ================= */}

                {plan.extraFeatures?.length >
                  0 && (
                  <div
                    className={`border-t px-4 py-6 ${
                      isElite
                        ? "border-[#F6C945]/30"
                        : isPro
                          ? "border-[#0446DB]/30"
                          : isLight
                            ? "border-neutral-300"
                            : "border-neutral-700"
                    }`}
                  >
                    <div className="space-y-4">
                      {plan.extraFeatures.map(
                        (feature, index) => (
                          <div
                            key={`${plan.id}-extra-${index}`}
                            className="flex items-center gap-2.5"
                          >
                            <span
                              className={`flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full ${
                                isElite
                                  ? "bg-[#F6C945] text-[#171717]"
                                  : isPro
                                    ? "bg-[#0446DB] text-white"
                                    : "bg-[#5b42ff] text-white"
                              }`}
                            >
                              <Check
                                className="h-[9px] w-[9px]"
                                strokeWidth={3}
                              />
                            </span>

                            <p
                              className={`text-[11px] font-semibold ${
                                isLight
                                  ? "text-neutral-900"
                                  : "text-white"
                              }`}
                            >
                              {feature}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);
};

export default SubscriptionPlans;