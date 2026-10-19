// import React, { useEffect, useState } from "react";
// import {
//   Package,
//   BarChart3,
//   Crown,
//   Check,
//   X,
//   Loader2,
// } from "lucide-react";

// import { toast } from "react-toastify";
// import AxiosInstance from "../../../../Helper/axiosInstance";
// import GenerateSubscriptionUPI from "./GenerateSubscriptionUPI";


// const staticSubscriptionPlans = [
//   {
//     id: "basic",
//     name: "Basic",
//     subtitle: "",
//     buttonText: "Get Basic Access",
//     type: "dark",
//     popular: false,

//     features: [
//       "500 self-delivery orders / month",
//       "Up to 4 riders",
//       "60 API requests / minute",
//       "API documentation access",
//       "1 integration",
//       "Standard support",
//     ],

//     unavailableFeatures: ["Webhooks not included"],
//     extraFeatures: [],
//   },
  
//   {
//     id: "pro",
//     name: "Pro",
//     subtitle: "",
//     buttonText: "Get Pro Access",
//     type: "light",
//     popular: true,

//     features: [
//       "2,000 self-delivery orders / month",
//       "Up to 10 riders",
//       "300 API requests / minute",
//       "API documentation access",
//       "Webhooks enabled",
//       "Up to 3 integrations",
//       "Priority support",
//     ],

//     unavailableFeatures: [],
//     extraFeatures: [],
//   },

//   {
//     id: "elite",
//     name: "Elite",
//     subtitle: "",
//     buttonText: "Get Elite Access",
//     type: "dark",
//     popular: false,

//     features: [
//       "10,000 self-delivery orders / month",
//       "Up to 25 riders",
//       "1,000 API requests / minute",
//       "API documentation access",
//       "Webhooks enabled",
//       "Up to 10 integrations",
//       "Dedicated support",
//     ],

//     unavailableFeatures: [],
//     extraFeatures: [],
//   },
// ];

// // ======================================================
// // COMPONENT
// // ======================================================

// const SubscriptionPlans = () => {
//   const [subscriptionPlans, setSubscriptionPlans] = useState([]);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ======================================================
//   // GET PLAN API
//   // ======================================================

//   const getPlan = async () => {
//     try {
//       setLoading(true);

//       const response = await AxiosInstance.get(
//         "/api/tech-merchant/getAllSubscriptionPlans"
//       );

//       const plans = response?.data?.data || [];

//       console.log("Subscription Plans API:", plans);

//       setSubscriptionPlans(
//         Array.isArray(plans) ? plans : []
//       );
//     } catch (error) {
//       console.error("Get subscription plan error:", error);

//       setSubscriptionPlans([]);

//       toast.error(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Unable to load subscription plans"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ======================================================
//   // CALL API
//   // ======================================================

//   useEffect(() => {
//     getPlan();
//   }, []);

//   // ======================================================
//   // NORMALIZE PLAN NAME
//   //
//   // "Basic Plan" => "basic"
//   // "Pro Plan"   => "pro"
//   // "Elite Plan" => "elite"
//   // ======================================================

//   const normalizePlanName = (value = "") => {
//     return String(value)
//       .toLowerCase()
//       .replace(/\bplan\b/g, "")
//       .replace(/\s+/g, " ")
//       .trim();
//   };

//   // ======================================================
//   // MATCH STATIC PLAN WITH API PLAN
//   // ======================================================

//   const getApiPlan = (staticPlan) => {
//     if (!Array.isArray(subscriptionPlans)) {
//       return null;
//     }

//     const staticName = normalizePlanName(
//       staticPlan?.name
//     );

//     const matchedPlan = subscriptionPlans.find(
//       (apiPlan) => {
//         const apiName = normalizePlanName(
//           apiPlan?.plan_name ||
//             apiPlan?.name ||
//             apiPlan?.plan ||
//             ""
//         );

//         return apiName === staticName;
//       }
//     );

//     return matchedPlan || null;
//   };

//   // ======================================================
//   // GET PRICE FROM API
//   // ======================================================

//   const getPlanPrice = (apiPlan) => {
//     if (!apiPlan) {
//       return "";
//     }

//     const amount =
//       apiPlan?.amount ??
//       apiPlan?.price ??
//       apiPlan?.plan_amount ??
//       "";

//     if (
//       amount === null ||
//       amount === undefined ||
//       amount === ""
//     ) {
//       return "";
//     }

//     return String(amount).replace("₹", "").trim();
//   };

//   // ======================================================
//   // LOADING
//   // ======================================================

//   if (loading) {
//     return (
//       <div className="px-4 py-12 dark:bg-black sm:px-6 lg:px-8">
//         <div className="mx-auto flex min-h-[350px] max-w-[1280px] items-center justify-center">
//           <div className="flex flex-col items-center gap-3">
//             <Loader2 className="h-8 w-8 animate-spin text-[#0446DB]" />

//             <p className="text-sm font-medium text-slate-500 dark:text-neutral-400">
//               Loading subscription plans...
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ======================================================
//   // NO PLAN
//   // ======================================================

//   if (!subscriptionPlans?.length) {
//     return (
//       <div className="px-4 py-10 dark:bg-black">
//         <div className="mx-auto max-w-[1280px]">
//           <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center dark:border-neutral-700 dark:bg-neutral-900">
//             <Crown className="mx-auto h-10 w-10 text-slate-400" />

//             <h3 className="mt-4 text-base font-bold text-slate-700 dark:text-white">
//               No subscription plans available
//             </h3>

//             <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">
//               Please try again later.
//             </p>

//             <button
//               type="button"
//               onClick={getPlan}
//               className="mt-5 rounded-lg bg-[#0446DB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0339B5]"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ======================================================
//   // UI
//   // ======================================================

//  return (
//   <div className="px-4 py-8 dark:bg-black sm:px-6 lg:px-8">
//     <div className="mx-auto max-w-[1280px]">
//       <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 xl:grid-cols-3">
//         {staticSubscriptionPlans.map((plan) => {
//           console.log(plan)
//           const isLight = plan.type === "light";

//           const isBasic = plan.id?.toLowerCase() === "basic";
//           const isPro = plan.id?.toLowerCase() === "pro";
//           const isElite =plan.id?.toLowerCase() === "elite";

//           // ================================
//           // API PLAN
//           // ================================

//           const apiPlan = getApiPlan(plan);
//           const price = getPlanPrice(apiPlan);

//           const isSelected =
//             selectedPlan?.id === apiPlan?.id;

//           return (
//             <div
//               key={plan.id}
//               onClick={() => {
//                 if (apiPlan) {
//                   setSelectedPlan(apiPlan);
//                 }
//               }}
//               className={`relative self-start overflow-hidden rounded-[16px] border transition-all duration-200 ${
//                 isPro
//                   ? "border-[#0446DB]"
//                   : isElite
//                     ? "border-[#F6C945]"
//                     : isLight
//                       ? "border-neutral-200"
//                       : "border-neutral-800"
//               } ${
//                 isLight
//                   ? "bg-[#f5f5f7] text-black"
//                   : "bg-[#171717] text-white"
//               } ${
//                 apiPlan
//                   ? "cursor-pointer"
//                   : "cursor-not-allowed opacity-70"
//               } ${
//                 isSelected
//                   ? isElite
//                     ? "ring-1 ring-[#F6C945] "
//                     : isPro
//                       ? "ring-1 ring-[#0446DB]"
//                       : "ring-1 ring-neutral-500"
//                   : ""
//               }`}
//             >
//               {/* ================= TOP ================= */}

//               <div
//                 className={`relative p-5 ${
//                   isLight
//                     ? "bg-[#f1f1f3]"
//                     : "bg-[#272727]"
//                 }`}
//               >
//                 {/* POPULAR BADGE */}

//                 {plan.popular && (
//                   <span className="absolute right-4 top-4 rounded-full bg-black px-3 py-1 text-[9px] font-bold text-white">
//                     Most popular
//                   </span>
//                 )}

//                 {/* ICON */}

//                 <div className="mb-4">
//                   {isBasic && (
//                     <Package
//                       className="h-7 w-7 text-white"
//                       strokeWidth={1.7}
//                     />
//                   )}

//                   {isPro && (
//                     <BarChart3
//                       className="h-7 w-7 text-[#0446DB]"
//                       strokeWidth={2}
//                     />
//                   )}

//                   {isElite && (
//                     <Crown
//                       className="h-7 w-7 fill-[#F6C945] text-[#F6C945]"
//                       strokeWidth={1.8}
//                     />
//                   )}
//                 </div>

//                 {/* PLAN NAME */}

//                 <h3
//                   className={`text-[15px] font-bold ${
//                     isElite
//                       ? "text-[#F6C945]"
//                       : ""
//                   }`}
//                 >
//                   {
//                     apiPlan?.plan_name
//                   }
                 
//                 </h3>

//                 {/* SUBTITLE */}

//                 {plan.subtitle && (
//                   <p
//                     className={`mt-2 text-[10px] ${
//                       isLight
//                         ? "text-neutral-600"
//                         : "text-neutral-300"
//                     }`}
//                   >
//                     {plan.subtitle}
//                   </p>
//                 )}

//                 {/* ================= PRICE ================= */}

//                 <div className="mt-5 flex items-end gap-2">
//                   {apiPlan && price !== "" ? (
//                     <>
//                       <span
//                         className={`mb-1 text-[14px] font-semibold ${
//                           isElite
//                             ? "text-[#F6C945]"
//                             : isLight
//                               ? "text-neutral-500"
//                               : "text-white"
//                         }`}
//                       >
//                         ₹
//                       </span>

//                       <span
//                         className={`text-[36px] font-bold leading-none tracking-tight ${
//                           isElite
//                             ? "text-[#F6C945]"
//                             : ""
//                         }`}
//                       >
//                         {price}
//                       </span>

//                       {apiPlan?.oldPrice && (
//                         <span
//                           className={`mb-1 text-[13px] font-semibold line-through ${
//                             isLight
//                               ? "text-neutral-500"
//                               : "text-neutral-300"
//                           }`}
//                         >
//                           {apiPlan.oldPrice}
//                         </span>
//                       )}
//                     </>
//                   ) : (
//                     <span
//                       className={`text-[13px] font-semibold ${
//                         isElite
//                           ? "text-[#F6C945]"
//                           : isLight
//                             ? "text-neutral-500"
//                             : "text-neutral-300"
//                       }`}
//                     >
//                       Plan unavailable
//                     </span>
//                   )}
//                 </div>

//                 {/* VALIDITY */}

//                 {apiPlan?.validity && (
//                   <p
//                     className={`mt-2 text-[10px] font-medium ${
//                       isElite
//                         ? "text-[#F6C945]"
//                         : isLight
//                           ? "text-neutral-500"
//                           : "text-neutral-400"
//                     }`}
//                   >
//                     Valid for {apiPlan.validity} days
//                   </p>
//                 )}

//                 {/* ================= CTA ================= */}

//                 <div
//                   className="mt-7"
//                   onClick={(e) =>
//                     e.stopPropagation()
//                   }
//                 >
//                   {apiPlan ? (
//                     <GenerateSubscriptionUPI
//                       plane={plan.buttonText}
//                       plan_id={apiPlan.id}
//                       amount={
//                         apiPlan?.amount ??
//                         apiPlan?.price ??
//                         apiPlan?.plan_amount
//                       }
//                       disabled={false}
//                       isLight={isLight}
//                     />
//                   ) : (
//                     <button
//                       type="button"
//                       disabled
//                       className={`h-10 w-full cursor-not-allowed rounded-lg text-xs font-semibold ${
//                         isLight
//                           ? "bg-neutral-200 text-neutral-400"
//                           : "bg-neutral-700 text-neutral-400"
//                       }`}
//                     >
//                       Plan Unavailable
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* ================= FEATURES ================= */}

//               <div
//                 className={`${
//                   isLight
//                     ? "bg-white"
//                     : "bg-[#181818]"
//                 }`}
//               >
//                 <div className="space-y-5 px-4 py-8">
//                   {/* AVAILABLE FEATURES */}

//                   {plan.features.map(
//                     (feature, index) => (
//                       <div
//                         key={`${plan.id}-${index}`}
//                         className="flex items-start gap-2.5"
//                       >
//                         <span
//                           className={`mt-[1px] flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full ${
//                             isElite
//                               ? "bg-[#F6C945] text-[#171717]"
//                               : isPro
//                                 ? "bg-[#0446DB] text-white"
//                                 : "bg-neutral-600 text-white"
//                           }`}
//                         >
//                           <Check
//                             className="h-[9px] w-[9px]"
//                             strokeWidth={3}
//                           />
//                         </span>

//                         <p
//                           className={`text-[11px] font-semibold leading-[1.45] ${
//                             isLight
//                               ? "text-neutral-900"
//                               : "text-white"
//                           }`}
//                         >
//                           {feature}
//                         </p>
//                       </div>
//                     )
//                   )}

//                   {/* UNAVAILABLE FEATURES */}

//                   {plan.unavailableFeatures?.map(
//                     (feature, index) => (
//                       <div
//                         key={`${plan.id}-unavailable-${index}`}
//                         className="flex items-start gap-2.5"
//                       >
//                         <span className="mt-[1px] flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full bg-neutral-500 text-white">
//                           <X
//                             className="h-[9px] w-[9px]"
//                             strokeWidth={3}
//                           />
//                         </span>

//                         <p
//                           className={`text-[11px] font-semibold leading-[1.45] ${
//                             isLight
//                               ? "text-neutral-500"
//                               : "text-neutral-400"
//                           }`}
//                         >
//                           {feature}
//                         </p>
//                       </div>
//                     )
//                   )}
//                 </div>

//                 {/* ================= EXTRA FEATURES ================= */}

//                 {plan.extraFeatures?.length >
//                   0 && (
//                   <div
//                     className={`border-t px-4 py-6 ${
//                       isElite
//                         ? "border-[#F6C945]/30"
//                         : isPro
//                           ? "border-[#0446DB]/30"
//                           : isLight
//                             ? "border-neutral-300"
//                             : "border-neutral-700"
//                     }`}
//                   >
//                     <div className="space-y-4">
//                       {plan.extraFeatures.map(
//                         (feature, index) => (
//                           <div
//                             key={`${plan.id}-extra-${index}`}
//                             className="flex items-center gap-2.5"
//                           >
//                             <span
//                               className={`flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full ${
//                                 isElite
//                                   ? "bg-[#F6C945] text-[#171717]"
//                                   : isPro
//                                     ? "bg-[#0446DB] text-white"
//                                     : "bg-[#5b42ff] text-white"
//                               }`}
//                             >
//                               <Check
//                                 className="h-[9px] w-[9px]"
//                                 strokeWidth={3}
//                               />
//                             </span>

//                             <p
//                               className={`text-[11px] font-semibold ${
//                                 isLight
//                                   ? "text-neutral-900"
//                                   : "text-white"
//                               }`}
//                             >
//                               {feature}
//                             </p>
//                           </div>
//                         )
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   </div>
// );
// };

// export default SubscriptionPlans;





import React, { useEffect, useState } from "react";
import {
  Check,
  X,
  Loader2,
  Crown,
} from "lucide-react";
import { toast } from "react-toastify";
import AxiosInstance from "../../../../Helper/axiosInstance";
import GenerateSubscriptionUPI from "./GenerateSubscriptionUPI";

/* =========================================================
   STATIC SUBSCRIPTION PLAN DATA
========================================================= */

const staticSubscriptionPlans = [
  {
    id: "basic",
    name: "Basic",
    badge: "Starter",
    description: "For small delivery teams",
    buttonText: "Choose Basic",
    features: [
      "500 orders / month",
      "Up to 4 riders",
      "60 API requests / minute",
      "API documentation",
      "1 integration",
      "Customer support (24/7)",
    ],
    unavailableFeatures: ["Webhooks not included"],
  },

  {
    id: "pro",
    name: "Pro",
    badge: "RECOMMENDED",
    description: "For growing delivery businesses",
    buttonText: "Choose Pro",
    features: [
      "2,000 orders / month",
      "Up to 10 riders",
      "300 API requests / minute",
      "API documentation",
      "Webhooks enabled",
      "Up to 3 integrations",
      "Priority support",
    ],
    unavailableFeatures: [
      
    ],
  },

  {
    id: "elite",
    name: "Elite",
    badge: "Advanced",
    description: "For high-volume operations",
    buttonText: "Choose Elite",

    features: [
      "10,000 orders / month",
      "Up to 25 riders",
      "1,000 API requests / minute",
      "API documentation",
      "Webhooks enabled",
      "Up to 10 integrations",
      "Dedicated support",
    ],

    unavailableFeatures: [],
  },
];

/* =========================================================
   COMPONENT
========================================================= */

const SubscriptionPlans = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =======================================================
     GET SUBSCRIPTION PLANS
  ======================================================= */

  const getPlan = async () => {
    try {
      setLoading(true);

      const response = await AxiosInstance.get(
        "/api/tech-merchant/getAllSubscriptionPlans"
      );

      const plans = response?.data?.data || [];

      console.log("Subscription Plans API:", plans);

      setSubscriptionPlans(Array.isArray(plans) ? plans : []);
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

  useEffect(() => {
    getPlan();
  }, []);

  /* =======================================================
     NORMALIZE PLAN NAME
  ======================================================= */

  const normalizePlanName = (value = "") => {
    return String(value)
      .toLowerCase()
      .replace(/\bplan\b/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  /* =======================================================
     FIND API PLAN
  ======================================================= */

  const getApiPlan = (staticPlan) => {
    if (!Array.isArray(subscriptionPlans)) {
      return null;
    }

    const staticName = normalizePlanName(staticPlan?.name);

    const matchedPlan = subscriptionPlans.find((apiPlan) => {
      const apiName = normalizePlanName(
        apiPlan?.plan_name ||
          apiPlan?.name ||
          apiPlan?.plan ||
          ""
      );

      return apiName === staticName;
    });

    return matchedPlan || null;
  };

  /* =======================================================
     GET PRICE
  ======================================================= */

  const getPlanPrice = (apiPlan) => {
    if (!apiPlan) return "";

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

  /* =======================================================
     CARD STYLES
  ======================================================= */

  const getCardStyle = (planId) => {
    switch (planId) {
      case "basic":
        return {
          card: `
            bg-[#EEF5FC]
            border-[#E5EEF7]
            dark:bg-[#111A24]
            dark:border-[#1E2B38]
          `,

          badge: `
            bg-[#DCE5EE]
            text-[#475569]
            dark:bg-[#263442]
            dark:text-[#CBD5E1]
          `,

          button: `
            border border-[#AAB8C6]
            bg-white
            text-[#111827]
            hover:bg-[#F8FAFC]
            dark:border-[#455567]
            dark:bg-[#17212B]
            dark:text-white
            dark:hover:bg-[#1E2A36]
          `,
        };

      case "pro":
        return {
          card: `
            bg-[#E5F0FF]
            border-[#D8E8FF]
            dark:bg-[#0D1B32]
            dark:border-[#18345F]
          `,

          badge: `
            bg-[#0969F9]
            text-white
          `,

          button: `
            border border-[#0969F9]
            bg-[#0969F9]
            text-white
            hover:bg-[#005BE6]
            hover:border-[#005BE6]
            shadow-[0_5px_14px_rgba(9,105,249,0.18)]
          `,
        };

      case "elite":
        return {
          card: `
            bg-[#F5EDF9]
            border-[#EEE3F4]
            dark:bg-[#201426]
            dark:border-[#392442]
          `,

          badge: `
            bg-[#DDD3E3]
            text-[#4C4052]
            dark:bg-[#3A2942]
            dark:text-[#E7DAEC]
          `,

          button: `
            border border-[#32143D]
            bg-[#32143D]
            text-white
            hover:bg-[#27102F]
            dark:border-[#6B4779]
            dark:bg-[#4A2857]
            dark:hover:bg-[#583366]
          `,
        };

      default:
        return {};
    }
  };

  /* =======================================================
     LOADER
  ======================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[450px] items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-[#0969F9]" />

          <p className="text-sm font-medium text-slate-500 dark:text-neutral-400">
            Loading subscription plans...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (!subscriptionPlans?.length) {
    return (
      <div className="flex min-h-[450px] items-center justify-center bg-white px-4 dark:bg-black">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-neutral-800">
            <Crown className="h-5 w-5 text-slate-500" />
          </div>

          <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
            No subscription plans available
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">
            Please try again.
          </p>

          <button
            type="button"
            onClick={getPlan}
            className="mt-5 rounded-lg bg-[#0969F9] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#005BE6]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className=" bg-white px-4 py-10 dark:bg-black sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1250px]">

        {/* =================================================
            CARDS
        ================================================= */}

        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
          {staticSubscriptionPlans.map((plan) => {
            const apiPlan = getApiPlan(plan);
            const price = getPlanPrice(apiPlan);
            const styles = getCardStyle(plan.id);

            const isSelected =
              apiPlan && selectedPlan?.id === apiPlan?.id;

            return (
              <div
                key={plan.id}
                onClick={() => {
                  if (apiPlan) {
                    setSelectedPlan(apiPlan);
                  }
                }}
                className={`
                  relative
                  flex
                  min-h-auto
                  flex-col
                  overflow-hidden
                  rounded-[15px]
                  border
                  p-5
                  transition-all
                  duration-200

                  ${styles.card}

                  ${
                    apiPlan
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-60"
                  }

                  ${
                    isSelected
                      ? plan.id === "pro"
                        ? "ring-2 ring-[#0969F9]/30"
                        : plan.id === "elite"
                        ? "ring-2 ring-[#32143D]/20"
                        : "ring-2 ring-slate-400/20"
                      : ""
                  }
                `}
              >
                {/* =========================================
                    PLAN HEADER
                ========================================= */}

                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-[19px] font-bold leading-none text-[#111111] dark:text-white">
                    {apiPlan?.plan_name || plan.name}
                  </h2>

                  <span
                    className={`
                      inline-flex
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      px-2.5
                      py-[5px]
                      text-[9px]
                      font-bold
                      leading-none

                      ${styles.badge}
                    `}
                  >
                    {plan.badge}
                  </span>
                </div>

                {/* DESCRIPTION */}

                <p className="mt-4 text-[11px] font-medium leading-5 text-[#4B5563] dark:text-neutral-400">
                  {plan.description}
                </p>

                {/* =========================================
                    PRICE
                ========================================= */}

                <div className="mt-5">
                  {apiPlan && price !== "" ? (
                    <>
                      <div className="flex items-start">
                        <span className="mr-[2px] mt-[4px] text-[19px] font-bold text-[#111111] dark:text-white">
                          ₹
                        </span>

                        <span className="text-[31px] font-extrabold leading-none tracking-[-0.03em] text-[#111111] dark:text-white">
                          {price}
                        </span>
                      </div>

                      {apiPlan?.validity && (
                        <p className="mt-2 text-[10px] font-medium text-[#667085] dark:text-neutral-400">
                          Valid for {apiPlan.validity} days
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="h-[54px]">
                      <p className="text-sm font-semibold text-slate-400">
                        Plan unavailable
                      </p>
                    </div>
                  )}
                </div>

                {/* =========================================
                    DIVIDER
                ========================================= */}

                <div className="my-5 h-px w-full bg-black/[0.06] dark:bg-white/[0.08]" />

                {/* =========================================
                    FEATURES
                ========================================= */}

                <div className="flex-1">
                  <div className="space-y-[10px]">
                    {plan.features.map((feature, index) => (
                      <div
                        key={`${plan.id}-${index}`}
                        className="flex items-start gap-2"
                      >
                        <Check
                          className="mt-[1px] h-[14px] w-[14px] shrink-0 text-[#16A34A]"
                          strokeWidth={3}
                        />

                        <span className="text-[11px] font-medium leading-[16px] text-[#1F2937] dark:text-neutral-200">
                          {feature}
                        </span>
                      </div>
                    ))}

                    {plan.unavailableFeatures?.map(
                      (feature, index) => (
                        <div
                          key={`${plan.id}-unavailable-${index}`}
                          className="flex items-start gap-2"
                        >
                          <X
                            className="mt-[1px] h-[14px] w-[14px] shrink-0 text-[#EF4444]"
                            strokeWidth={3}
                          />

                          <span className="text-[11px] font-medium leading-[16px] text-[#1F2937] dark:text-neutral-300">
                            {feature}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* =========================================
                    BUTTON
                ========================================= */}

                <div
                  className="mt-7"
                  onClick={(e) => e.stopPropagation()}
                >
                  {apiPlan ? (
                    <div
                      className={`
                        subscription-plan-button
                        rounded-[7px]

                        ${styles.button}
                      `}
                    >
                      <GenerateSubscriptionUPI
                        plane={plan.buttonText}
                        plan_id={apiPlan.id}
                        amount={
                          apiPlan?.amount ??
                          apiPlan?.price ??
                          apiPlan?.plan_amount
                        }
                        disabled={false}
                        isLight={true}
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="flex h-[40px] w-full cursor-not-allowed items-center justify-center rounded-[7px] border border-slate-300 bg-white/50 text-[11px] font-bold text-slate-400 dark:border-neutral-700 dark:bg-neutral-800"
                    >
                      Plan Unavailable
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================
          FORCE PAYMENT BUTTON TO MATCH CARD DESIGN

          This only styles the button rendered inside
          GenerateSubscriptionUPI.
      ================================================= */}

      <style>
        {`
          .subscription-plan-button > * {
            width: 100% !important;
          }

          .subscription-plan-button button {
            width: 100% !important;
            min-height: 40px !important;
            height: 40px !important;

            border: none !important;
            border-radius: 7px !important;

            background: transparent !important;
            color: inherit !important;

            font-size: 11px !important;
            line-height: 1 !important;
            font-weight: 700 !important;

            box-shadow: none !important;

            display: flex !important;
            align-items: center !important;
            justify-content: center !important;

            padding: 0 16px !important;

            cursor: pointer !important;
          }

          .subscription-plan-button button:hover {
            background: transparent !important;
          }
        `}
      </style>
    </div>
  );
};

export default SubscriptionPlans;