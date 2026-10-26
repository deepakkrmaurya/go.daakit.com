
// import { useEffect, useState } from "react";

// import { toast } from "react-toastify";



// import {

//   FaBoxOpen,

//   FaClock,

//   FaCheckCircle,

//   FaPlayCircle,

//   FaPaperPlane,

// } from "react-icons/fa";



// import {

//   MdPeople,

//   MdVerified,

//   MdDirectionsBike,

//   MdEventAvailable,

// } from "react-icons/md";



// import {

//   CalendarDays,

//   ChevronDown,

//   Loader2,

//   SlidersHorizontal,

//   RotateCcw,

//   Check,

//   X,

// } from "lucide-react";



// import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose, DrawerFooter } from "@/components/ui/drawer";

// import axiosInstance from "@/Helper/axiosInstance";



// const baseURL = import.meta.env.VITE_BASE_URL;



// export default function VendorAnalytics() {

//   /* =====================================================
//       STATE

//   ====================================================== */
//   const [loading, setLoading] = useState(false);



//   const [analytics, setAnalytics] = useState({});

//   const [analytics2, setAnalytics2] = useState({});



//   const [selected, setSelected] = useState("Last 30 Days");

//   // Drawer presentation state; filters still use the original handlers.
//   const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
//   const [draftSelected, setDraftSelected] = useState("Last 30 Days");
//   const [isMobileDrawer, setIsMobileDrawer] = useState(false);

//   useEffect(() => {
//     const media = window.matchMedia("(max-width: 767px)");
//     const update = () => setIsMobileDrawer(media.matches);
//     update();
//     media.addEventListener?.("change", update);
//     return () => media.removeEventListener?.("change", update);
//   }, []);



//   const today = new Date();

//   const thirtyDaysBack = new Date();



//   thirtyDaysBack.setDate(thirtyDaysBack.getDate() - 29);



//   const [advanceFilters, setAdvanceFilters] = useState({

//     end_date: today.toISOString().split("T")[0],

//     start_date: thirtyDaysBack.toISOString().split("T")[0],

//   });



//   const [customStartDate, setCustomStartDate] = useState(

//     advanceFilters.start_date,

//   );



//   const [customEndDate, setCustomEndDate] = useState(

//     advanceFilters.end_date,

//   );



//   /* =====================================================
//       GET ANALYTICS

//   ====================================================== */
//   const getAnalytics = async () => {

//     setLoading(true);



//     try {

//       const res = await axiosInstance.get(

//         `${baseURL}/api/vendor/getVendorDeliveredAndPendingCodSummary`,

//         {

//           params: advanceFilters,



//           headers: {

//             Authorization: `Bearer ${localStorage.getItem("token")}`,

//           },

//         },

//       );



//       setCustomStartDate(advanceFilters.start_date);

//       setCustomEndDate(advanceFilters.end_date);



//       setAnalytics(res.data);

//     } catch (err) {

//       toast.error(

//         err?.response?.data?.message ||

//           err?.message ||

//           "Error while fetching order analytics",

//       );

//     }



//     try {

//       const res = await axiosInstance.get(

//         `${baseURL}/api/vendor/getVendorRidersSummary`,

//         {

//           headers: {

//             Authorization: `Bearer ${localStorage.getItem("token")}`,

//           },

//         },

//       );



//       setAnalytics2(res.data);

//     } catch (err) {

//       toast.error(

//         err?.response?.data?.message ||

//           err?.message ||

//           "Error while fetching rider analytics",

//       );

//     } finally {

//       setLoading(false);

//     }

//   };



//   /* =====================================================
//       DATE FILTER

//   ====================================================== */
//   const handleSelect = (value) => {

//     setSelected(value);



//     if (value === "Custom Range") {

//       return;

//     }



//     let fromDate;

//     let toDate;



//     switch (value) {

//       case "Today": {

//         fromDate = new Date();

//         toDate = new Date();

//         break;

//       }



//       case "Yesterday": {

//         const yesterday = new Date();



//         yesterday.setDate(yesterday.getDate() - 1);



//         fromDate = yesterday;

//         toDate = yesterday;



//         break;

//       }



//       case "Last 7 Days": {

//         const end = new Date();

//         const start = new Date();



//         start.setDate(start.getDate() - 6);



//         fromDate = start;

//         toDate = end;



//         break;

//       }



//       case "Last 30 Days": {

//         const end = new Date();

//         const start = new Date();



//         start.setDate(start.getDate() - 29);



//         fromDate = start;

//         toDate = end;



//         break;

//       }



//       case "This Month": {

//         fromDate = new Date();

//         fromDate.setDate(1);



//         toDate = new Date();



//         break;

//       }



//       case "Last Month": {

//         fromDate = new Date();



//         fromDate.setDate(1);

//         fromDate.setMonth(fromDate.getMonth() - 1);



//         toDate = new Date();



//         toDate.setDate(1);

//         toDate.setDate(toDate.getDate() - 1);



//         break;

//       }



//       default:

//         return;

//     }



//     setAdvanceFilters({

//       start_date: fromDate.toISOString().split("T")[0],

//       end_date: toDate.toISOString().split("T")[0],

//     });

//   };



//   /* =====================================================
//       CUSTOM DATE RANGE

//   ====================================================== */
//   const handleCustomRange = (e) => {

//     e.preventDefault();



//     if (!customStartDate || !customEndDate) {

//       toast.error("Please select start and end date");

//       return;

//     }



//     if (customStartDate > customEndDate) {

//       toast.error("Start date cannot be after end date");

//       return;

//     }



//     setAdvanceFilters({

//       start_date: customStartDate,

//       end_date: customEndDate,

//     });

//   };



//   /* =====================================================
//       OPEN DATE PICKER

//   ====================================================== */
//   const openDatePicker = (e) => {

//     try {

//       e.currentTarget.showPicker?.();

//     } catch {

//       return;

//     }

//   };



//   /* =====================================================
//       USE EFFECT

//   ====================================================== */
//   useEffect(() => {

//     getAnalytics();

//   }, [advanceFilters]);



//   /* =====================================================
//       HELPER

//   ====================================================== */
//   const calculatePercentage = (value, total) => {

//     const currentValue = Number(value) || 0;

//     const totalValue = Number(total) || 0;



//     if (totalValue <= 0) {

//       return 0;

//     }



//     const result = Math.round((currentValue / totalValue) * 100);



//     return Math.min(Math.max(result, 0), 100);

//   };



//   /* =====================================================
//       CARD DATA

//   ====================================================== */
//   const cards = [

//     {

//       title: "Total Orders Delivered",

//       value: analytics?.totalDeliveredOrders ?? 0,



//       rateLabel: "Completion Rate",



//       percentage: 100,



//       icon: FaBoxOpen,



//       iconClass:

//         "bg-[#DFE5FF] text-[#5147FF] dark:bg-indigo-950/50 dark:text-indigo-400",



//       progressClass: "bg-[#2448E8]",



//       percentageClass: "text-[#2448E8]",

//     },



//     {

//       title: "Total Riders",

//       value: analytics2?.totalRiders ?? 0,



//       rateLabel: "Registered Riders",



//       percentage: 100,



//       icon: MdPeople,



//       iconClass:

//         "bg-[#E3E8FF] text-[#5147FF] dark:bg-indigo-950/50 dark:text-indigo-400",



//       progressClass: "bg-[#5147FF]",



//       percentageClass: "text-[#5147FF]",

//     },



//     {

//       title: "KYC Verified Riders",

//       value: analytics2?.kycverifiedRiders ?? 0,



//       rateLabel: "Verification Rate",



//       percentage: calculatePercentage(

//         analytics2?.kycverifiedRiders,

//         analytics2?.totalRiders,

//       ),



//       icon: MdVerified,



//       iconClass:

//         "bg-[#D9F8E5] text-[#00A94F] dark:bg-emerald-950/40 dark:text-emerald-400",



//       progressClass: "bg-[#00B95C]",



//       percentageClass: "text-[#00A94F]",

//     },



//     {

//       title: "Active Riders",

//       value: analytics2?.activeRiders ?? 0,



//       rateLabel: "Active Rate",



//       percentage: calculatePercentage(

//         analytics2?.activeRiders,

//         analytics2?.totalRiders,

//       ),



//       icon: MdDirectionsBike,



//       iconClass:

//         "bg-[#D9F8E5] text-[#00A94F] dark:bg-emerald-950/40 dark:text-emerald-400",



//       progressClass: "bg-[#00B95C]",



//       percentageClass: "text-[#00A94F]",

//     },



//     {

//       title: "COD Submitted",

//       value: analytics?.codSummary?.received ?? 0,



//       rateLabel: "Submitted",



//       percentage: 100,



//       icon: FaPaperPlane,



//       iconClass:

//         "bg-[#DFE5FF] text-[#5147FF] dark:bg-indigo-950/50 dark:text-indigo-400",



//       progressClass: "bg-[#5147FF]",



//       percentageClass: "text-[#5147FF]",

//     },



//     {

//       title: "COD Pending",

//       value: analytics?.codSummary?.pending ?? 0,



//       rateLabel: "Pending",



//       percentage: 25,



//       icon: FaClock,



//       iconClass:

//         "bg-[#FFF0C4] text-[#F27A00] dark:bg-amber-950/40 dark:text-amber-400",



//       progressClass: "bg-[#FF8700]",



//       percentageClass: "text-[#F27A00]",

//     },



//     {

//       title: "COD Initiated",

//       value: analytics?.codSummary?.initiated ?? 0,



//       rateLabel: "Initiated",



//       percentage: 65,



//       icon: FaPlayCircle,



//       iconClass:

//         "bg-[#D9F8E5] text-[#00A94F] dark:bg-emerald-950/40 dark:text-emerald-400",



//       progressClass: "bg-[#00B95C]",



//       percentageClass: "text-[#00A94F]",

//     },



//     {

//       title: "COD Adjusted",

//       value: analytics?.codSummary?.adjusted ?? 0,



//       rateLabel: "Adjusted",



//       percentage: 80,



//       icon: FaCheckCircle,



//       iconClass:

//         "bg-[#FFDCDC] text-[#EF1B24] dark:bg-red-950/40 dark:text-red-400",



//       progressClass: "bg-[#EF1B24]",



//       percentageClass: "text-[#EF1B24]",

//     },



//     {

//       title: "Available Riders",

//       value: analytics2?.availableRiders ?? 0,



//       rateLabel: "Availability Rate",



//       percentage: calculatePercentage(

//         analytics2?.availableRiders,

//         analytics2?.totalRiders,

//       ),



//       icon: MdEventAvailable,



//       iconClass:

//         "bg-[#FFF0C4] text-[#F27A00] dark:bg-amber-950/40 dark:text-amber-400",



//       progressClass: "bg-[#F27A00]",



//       percentageClass: "text-[#F27A00]",

//     },

//   ];



//   /* =====================================================
//       LOADER

//   ====================================================== */
//   if (loading) {

//     return (

//       <div className="flex h-[90vh] w-full items-center justify-center bg-[#F7F8FA] dark:bg-neutral-950">

//         <div className="text-center">

//           <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#0446DB]" />



//           <p className="mt-3 text-sm font-medium text-neutral-600 dark:text-neutral-300">

//             Loading Analytics Dashboard...

//           </p>



//           <p className="mt-1 text-xs text-neutral-400">

//             Fetching latest dashboard data

//           </p>

//         </div>

//       </div>

//     );

//   }



//   /* =====================================================
//       UI

//   ====================================================== */
//   return (

//     <div className="min-h-screen w-full bg-[#F5F6F8] dark:bg-neutral-950">

//       {/* =================================================*

//           BLUE HEADER

// *      ================================================== */}



//       <div className="py-3">

//         <div className="mx-auto flex w-full flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

//           {/* HEADING */}



//           <div>

//             <h1 className="text-2xl font-semibold dark:text-white sm:text-3xl">

//               Dashboard

//             </h1>



//             <p className="mt-1 text-sm  dark:text-neutral-400">

//               Track orders, COD remittance and rider performance.

//             </p>

//           </div>



//           {/* Admin-style responsive filter drawer (date fields only). */}
//           <Drawer
//             direction={isMobileDrawer ? "bottom" : "right"}
//             open={filterDrawerOpen}
//             onOpenChange={(open) => {
//               if (open) setDraftSelected(selected);
//               setFilterDrawerOpen(open);
//             }}
//           >
//             <DrawerTrigger asChild>
//               <button
//                 type="button"
//                 className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-4 text-sm font-semibold text-white hover:bg-[#0339B5]"
//               >
//                 <SlidersHorizontal size={17} /> Filters
//               </button>
//             </DrawerTrigger>
//             <DrawerContent className="!fixed !inset-x-0 !bottom-0 !top-auto !mt-0 !h-auto !max-h-[90dvh] !w-full !max-w-none !rounded-t-2xl !rounded-b-none border-slate-200 bg-white dark:border-neutral-700 dark:bg-neutral-900 md:!inset-x-auto md:!right-0 md:!top-0 md:!bottom-0 md:!h-dvh md:!max-h-dvh md:!w-[440px] md:!rounded-none md:!border-l flex min-h-0 flex-col overflow-hidden">
//               <DrawerHeader className="shrink-0 border-b border-slate-100 px-5 py-5 text-left dark:border-neutral-800">
//                 <div className="flex items-start justify-between gap-3">
//                   <div>
//                     <DrawerTitle className="text-lg font-bold text-slate-900 dark:text-white">Advanced Filters</DrawerTitle>
//                     <DrawerDescription className="mt-1 text-sm text-slate-500">Filter dashboard analytics by date range.</DrawerDescription>
//                   </div>
//                   <DrawerClose asChild>
//                     <button type="button" aria-label="Close filters" className="rounded-sm p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-neutral-800"><X size={18}/></button>
//                   </DrawerClose>
//                 </div>
//               </DrawerHeader>
//               <form
//                 id="vendor-analytics-filters"
//                 className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-5"
//                 onSubmit={(e) => {
//                   if (draftSelected === "Custom Range") {
//                     handleCustomRange(e);
//                     if (!customStartDate || !customEndDate || customStartDate > customEndDate) return;
//                     setSelected("Custom Range");
//                   } else {
//                     e.preventDefault();
//                     handleSelect(draftSelected);
//                   }
//                   setFilterDrawerOpen(false);
//                 }}
//               >
//                 <label className="block">
//                   <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-neutral-200">Select Period</span>
//                   <select
//                     value={draftSelected}
//                     onChange={(e) => setDraftSelected(e.target.value)}
//                     className="h-11 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
//                   >
//                     {["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Month", "Last Month", "Custom Range"].map((period) => (
//                       <option key={period} value={period}>{period}</option>
//                     ))}
//                   </select>
//                 </label>
//                 {draftSelected === "Custom Range" && (
//                   <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                     <label className="block">
//                       <span className="mb-2 block text-xs font-semibold text-slate-700 dark:text-neutral-200">Start Date</span>
//                       <input
//                         type="date" required value={customStartDate} max={customEndDate || undefined}
//                         onClick={openDatePicker}
//                         onChange={(e) => {
//                           const date = e.target.value;
//                           setCustomStartDate(date);
//                           if (customEndDate < date) setCustomEndDate(date);
//                         }}
//                         className="h-11 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
//                       />
//                     </label>
//                     <label className="block">
//                       <span className="mb-2 block text-xs font-semibold text-slate-700 dark:text-neutral-200">End Date</span>
//                       <input
//                         type="date" required value={customEndDate} min={customStartDate || undefined}
//                         onClick={openDatePicker}
//                         onChange={(e) => {
//                           const date = e.target.value;
//                           setCustomEndDate(date);
//                           if (customStartDate > date) setCustomStartDate(date);
//                         }}
//                         className="h-11 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
//                       />
//                     </label>
//                   </div>
//                 )}
//               </form>
//               <DrawerFooter className="flex w-full shrink-0 flex-row gap-2 border-t border-slate-100 bg-white px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     handleSelect("Last 30 Days");
//                     setDraftSelected("Last 30 Days");
//                     setFilterDrawerOpen(false);
//                   }}
//                   className="inline-flex h-10 w-1/2 items-center justify-center gap-2 rounded-sm border border-slate-200 text-sm font-semibold text-slate-700 dark:border-neutral-700 dark:text-neutral-200"
//                 ><RotateCcw size={16}/> Reset</button>
//                 <button
//                   type="submit" form="vendor-analytics-filters"
//                   className="inline-flex h-10 w-1/2 items-center justify-center gap-2 rounded-sm bg-[#0446DB] text-sm font-semibold text-white hover:bg-[#0339B5]"
//                 ><Check size={16}/> Apply Filters</button>
//               </DrawerFooter>
//             </DrawerContent>
//           </Drawer>
//         </div>

//       </div>



//       {/* =================================================*

//           KPI CARDS

// *      ================================================== */}



//       <main className="mt-2">
//         <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5 lg:gap-5">
//           {cards.map((card, index) => {
//             const Icon = card.icon;

//             return (
//               <div
//                 key={`${card.title}-${index}`}
//                 className="group flex min-w-0 flex-col justify-between rounded-sm border border-gray-300 bg-white p-3 transition-all duration-300 hover:border-[#0446DB]/20 dark:border-gray-800 dark:bg-neutral-900 sm:p-5"
//               >
//                 <div className="flex items-start justify-between gap-2 sm:gap-3">
//                   <div className="min-w-0 flex-1">
//                     <h3
//                       className="min-h-[32px] text-xs font-semibold leading-4 text-gray-700 dark:text-white sm:min-h-0 sm:text-base sm:leading-6"
//                       title={card.title}
//                     >
//                       {card.title}
//                     </h3>
//                     <div className="mt-2 break-words text-xl font-bold leading-tight tabular-nums text-gray-900 dark:text-white sm:text-3xl">
//                       {Number(card.value || 0).toLocaleString("en-IN")}
//                     </div>
//                   </div>
//                   <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm transition-colors sm:h-11 sm:w-11 ${card.iconClass}`}>
//                     <Icon className="text-lg sm:text-2xl" />
//                   </div>
//                 </div>

//                 <div className="mt-4 sm:mt-6">
//                   <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px] text-gray-600 dark:text-gray-300 sm:text-xs">
//                     <span className="min-w-0 break-words">{card.rateLabel}</span>
//                     <span className={`shrink-0 font-semibold tabular-nums ${card.percentageClass}`}>
//                       {card.percentage}%
//                     </span>
//                   </div>
//                   <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-700">
//                     <div
//                       className={`h-full rounded-full transition-all duration-500 ${card.progressClass}`}
//                       style={{ width: `${card.percentage}%` }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </main>

//     </div>

//   );

// }




import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  AlertTriangle,
  Bike,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  IndianRupee,
  Loader2,
  Package,
  RotateCcw,
  Send,
  SlidersHorizontal,
  Store,
  Truck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import AxiosInstance from "@/Helper/axiosInstance";

const PRESETS = [
  "Today",
  "Yesterday",
  "Last 7 Days",
  "Last 30 Days",
  "This Month",
  "Last Month",
  "Custom Range",
];

const localDate = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

function datesForPreset(preset) {
  const today = new Date();
  const from = new Date(today);
  const to = new Date(today);
  switch (preset) {
    case "Yesterday":
      from.setDate(from.getDate() - 1);
      to.setDate(to.getDate() - 1);
      break;
    case "Last 7 Days":
      from.setDate(from.getDate() - 6);
      break;
    case "Last 30 Days":
      from.setDate(from.getDate() - 29);
      break;
    case "This Month":
      from.setDate(1);
      break;
    case "Last Month":
      from.setDate(1);
      from.setMonth(from.getMonth() - 1);
      to.setDate(0);
      break;
    default:
      break;
  }
  return { start_date: localDate(from), end_date: localDate(to) };
}

const num = (value) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};
const fmt = (value) => num(value).toLocaleString("en-IN");
const money = (value) =>
  num(value).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
const pct = (value, total) =>
  num(total) > 0 ? Math.min(100, Math.max(0, (num(value) / num(total)) * 100)) : 0;
const percentText = (value, total) => `${pct(value, total).toFixed(1)}%`;
const fieldClass =
  "h-11 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white";

const tone = {
  blue: { icon: "bg-blue-50 text-blue-600 dark:bg-blue-950/50", bar: "bg-[#1769ff]", text: "text-blue-600", hex: "#1769ff" },
  orange: { icon: "bg-orange-50 text-orange-500 dark:bg-orange-950/40", bar: "bg-[#ff851b]", text: "text-orange-600", hex: "#ff851b" },
  purple: { icon: "bg-violet-50 text-violet-600 dark:bg-violet-950/40", bar: "bg-violet-500", text: "text-violet-600", hex: "#8952f4" },
  green: { icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40", bar: "bg-emerald-500", text: "text-emerald-600", hex: "#12a76d" },
  red: { icon: "bg-rose-50 text-rose-500 dark:bg-rose-950/40", bar: "bg-rose-500", text: "text-rose-600", hex: "#fa515d" },
  cyan: { icon: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40", bar: "bg-cyan-500", text: "text-cyan-600", hex: "#06b6d4" },
};

function StatCard({ item, compact = false }) {
  const Icon = item.icon;
  const theme = tone[item.tone] || tone.blue;
  return (
    <article className={`flex min-w-0 flex-col justify-between rounded-sm border border-gray-300 bg-white p-3 shadow-[0_4px_18px_rgba(28,50,100,0.035)] transition hover:border-blue-200 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 ${compact ? "sm:p-4" : "sm:p-5"}`}>
      <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm sm:h-11 sm:w-11 ${theme.icon}`}>
          <Icon className="h-[18px] w-[18px] sm:h-[21px] sm:w-[21px]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="min-h-[30px] text-[11px] font-medium leading-[15px] text-slate-600 dark:text-slate-300 sm:min-h-[36px] sm:text-xs" title={item.title}>
            {item.title}
          </p>
          <p className="mt-1 break-words text-xl font-bold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-2xl">
            {item.isMoney ? money(item.value) : fmt(item.value)}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-2 flex min-w-0 items-end justify-between gap-2">
          <span className="text-[10px] leading-4 text-slate-500 dark:text-slate-400 sm:text-[11px]">{item.rateLabel}</span>
          {item.rateValue !== undefined && (
            <span className={`shrink-0 text-xs font-semibold tabular-nums ${theme.text}`}>{item.rateValue}%</span>
          )}
        </div>
        <div className="h-[7px] overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-700">
          <div className={`h-full rounded-full transition-[width] duration-500 ${theme.bar}`} style={{ width: `${Math.max(0, Math.min(100, num(item.rateValue)))}%` }} />
        </div>
        {item.amount !== undefined && (
          <p className="mt-2 text-[10px] leading-4 text-slate-500 dark:text-slate-400 sm:text-[11px]">
            Amount: <span className="font-semibold text-slate-700 dark:text-slate-200">{money(item.amount)}</span>
          </p>
        )}
      </div>
    </article>
  );
}

function SummaryPanel({ title, icon: Icon, children, trailing }) {
  return (
    <section className="min-w-0 rounded-sm border border-slate-200/80 bg-white p-4 shadow-[0_4px_18px_rgba(28,50,100,0.035)] dark:border-neutral-800 dark:bg-neutral-900 sm:p-5">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-blue-50 text-[#0446DB] dark:bg-blue-950/40"><Icon size={18} /></span>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">{title}</h2>
        </div>
        {trailing}
      </header>
      {children}
    </section>
  );
}

function ColoredDot({ color }) {
  return <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />;
}

function Donut({ parts, total }) {
  let progress = 0;
  const gradientParts = parts.map((p) => {
    const begin = progress;
    progress += pct(p.value, total);
    return `${p.hex} ${begin}% ${progress}%`;
  });
  const background = num(total) > 0
    ? `conic-gradient(${gradientParts.join(", ")}, #e2e8f0 ${Math.min(100, progress)}% 100%)`
    : "#e2e8f0";
  return (
    <div className="relative mx-auto flex h-44 w-44 shrink-0 items-center justify-center rounded-full sm:h-52 sm:w-52" style={{ background }} role="img" aria-label={`Delivery breakdown for ${fmt(total)} delivered orders`}>
      <div className="flex h-[72%] w-[72%] flex-col items-center justify-center rounded-full bg-white text-center dark:bg-neutral-900">
        <p className="text-2xl font-extrabold text-slate-950 dark:text-white">{fmt(total)}</p>
        <p className="text-[11px] text-slate-500">Delivered Orders</p>
      </div>
    </div>
  );
}

export default function DcAnalytics() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("Last 30 Days");
  const [advanceFilters, setAdvanceFilters] = useState(() => datesForPreset("Last 30 Days"));
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [draftSelected, setDraftSelected] = useState("Last 30 Days");
  const [draftStartDate, setDraftStartDate] = useState(() => datesForPreset("Last 30 Days").start_date);
  const [draftEndDate, setDraftEndDate] = useState(() => datesForPreset("Last 30 Days").end_date);
  const [isMobileDrawer, setIsMobileDrawer] = useState(false);
  const [codView, setCodView] = useState("Amount");

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobileDrawer(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      try {
        const response = await AxiosInstance.get("/api/dc/getDcDeliveredAndPendingCodSummary", {
          params: advanceFilters,
          signal: controller.signal,
        });
        const payload = response.data?.data?.codSummary ? response.data.data : response.data;
        if (response.data?.success === false || payload?.success === false) {
          throw new Error(payload?.message || response.data?.message || "Failed to fetch DC analytics");
        }
        if (!payload || typeof payload !== "object" || !payload.codSummary || !payload.deliverySummary) {
          throw new Error("Unexpected DC analytics response");
        }
        if (!controller.signal.aborted) setSummary(payload);
      } catch (error) {
        if (error?.code !== "ERR_CANCELED" && error?.name !== "CanceledError" && !controller.signal.aborted) {
          toast.error(error?.response?.data?.message || error?.message || "Failed to fetch DC analytics");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [advanceFilters]);

  function openFilters(open) {
    if (open) {
      setDraftSelected(selected);
      setDraftStartDate(advanceFilters.start_date);
      setDraftEndDate(advanceFilters.end_date);
    }
    setFilterDrawerOpen(open);
  }
  function applyFilters(event) {
    event.preventDefault();
    let next;
    if (draftSelected === "Custom Range") {
      if (!draftStartDate || !draftEndDate || draftStartDate > draftEndDate) {
        toast.error("Please select a valid date range");
        return;
      }
      next = { start_date: draftStartDate, end_date: draftEndDate };
    } else {
      next = datesForPreset(draftSelected);
    }
    setSelected(draftSelected);
    setAdvanceFilters(next);
    setFilterDrawerOpen(false);
  }
  function resetFilters() {
    const dates = datesForPreset("Last 30 Days");
    setDraftSelected("Last 30 Days");
    setDraftStartDate(dates.start_date);
    setDraftEndDate(dates.end_date);
    setSelected("Last 30 Days");
    setAdvanceFilters(dates);
    setFilterDrawerOpen(false);
  }

  const delivery = summary?.deliverySummary || {};
  const cod = summary?.codSummary || {};
  const delivered = num(summary?.totalDeliveredOrders);
  const codTotal = num(cod.totalRecords);

  const cards = useMemo(() => [
    { title: "Total Delivered Orders", icon: Package, value: delivered, tone: "blue", rateLabel: "Delivered-order baseline", rateValue: delivered > 0 ? 100 : 0 },
    { title: "Delivered COD Orders", icon: IndianRupee, value: delivery.codOrders, tone: "orange", rateLabel: "Share of delivered orders", rateValue: Math.round(pct(delivery.codOrders, delivered)) },
    { title: "Delivered Prepaid Orders", icon: Wallet, value: delivery.prepaidOrders, tone: "purple", rateLabel: "Share of delivered orders", rateValue: Math.round(pct(delivery.prepaidOrders, delivered)) },
    { title: "Direct DC Orders", icon: Store, value: delivery.directDcOrders, tone: "green", rateLabel: "Share of delivered orders", rateValue: Math.round(pct(delivery.directDcOrders, delivered)) },
    { title: "Mapped Vendor Orders", icon: Users, value: delivery.mappedVendorOrders, tone: "red", rateLabel: "Share of delivered orders", rateValue: Math.round(pct(delivery.mappedVendorOrders, delivered)) },
    { title: "Delivered by DC Riders", icon: Bike, value: delivery.deliveredByDcRiders, tone: "blue", rateLabel: "Share of delivered orders", rateValue: Math.round(pct(delivery.deliveredByDcRiders, delivered)) },
    { title: "Delivered by Vendor Riders", icon: Truck, value: delivery.deliveredByVendorRiders, tone: "purple", rateLabel: "Share of delivered orders", rateValue: Math.round(pct(delivery.deliveredByVendorRiders, delivered)) },
    { title: "COD Collectable Amount", icon: IndianRupee, value: delivery.codCollectableAmount, tone: "green", isMoney: true, rateLabel: "Delivered COD order amount", rateValue: undefined },
    { title: "Unremitted COD Orders", icon: AlertTriangle, value: delivery.unremittedCodOrders, tone: "red", rateLabel: "Share of delivered COD orders", rateValue: Math.round(pct(delivery.unremittedCodOrders, delivery.codOrders)), amount: delivery.unremittedCodAmount },
  ], [delivery, delivered]);

  const codRows = [
    { label: "Pending", count: num(cod.pending), amount: num(cod.pendingAmount), tone: "orange", icon: Clock3 },
    { label: "Initiated", count: num(cod.initiated), amount: num(cod.initiatedAmount), tone: "blue", icon: Send },
    { label: "Adjusted", count: num(cod.adjusted), amount: num(cod.adjustedAmount), tone: "purple", icon: Wallet },
    { label: "Received", count: num(cod.received), amount: num(cod.receivedAmount), tone: "green", icon: CheckCircle2 },
  ];
  const chartBreakdown = [
    { label: "COD Orders", value: num(delivery.codOrders), total: delivered, hex: tone.orange.hex },
    { label: "Prepaid Orders", value: num(delivery.prepaidOrders), total: delivered, hex: tone.blue.hex },
  ];
  const otherBreakdowns = [
    { label: "Direct DC Orders", value: num(delivery.directDcOrders), total: delivered, hex: tone.green.hex },
    { label: "Mapped Vendor Orders", value: num(delivery.mappedVendorOrders), total: delivered, hex: tone.red.hex },
    { label: "DC Rider Deliveries", value: num(delivery.deliveredByDcRiders), total: delivered, hex: tone.purple.hex },
    { label: "Vendor Rider Deliveries", value: num(delivery.deliveredByVendorRiders), total: delivered, hex: tone.blue.hex },
  ];
  const totalAmount = num(cod.totalAmount);

  return (
    <div className="min-h-screen w-full text-slate-900 dark:bg-neutral-950 dark:text-white">
      {/* This component is dashboard CONTENT; use your existing app shell/sidebar. */}
      <div className="mx-auto w-full max-w-[1800px] ">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#10203b] dark:text-white sm:text-[28px]">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track delivered orders, COD remittance and rider-wise performance.</p>
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <span className="inline-flex h-10 min-w-0 flex-1 items-center gap-2 rounded-sm border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-slate-300 sm:flex-none sm:text-sm">
              <CalendarDays size={15} className="shrink-0 text-[#0446DB]" /> <span className="truncate">{selected}</span>
            </span>
            <Drawer direction={isMobileDrawer ? "bottom" : "right"} open={filterDrawerOpen} onOpenChange={openFilters}>
              <DrawerTrigger asChild>
                <button type="button" className="inline-flex h-10 shrink-0 items-center gap-2 rounded-sm bg-[#0446DB] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                  <SlidersHorizontal size={16} /> Filters
                </button>
              </DrawerTrigger>
              <DrawerContent className="!fixed !inset-x-0 !bottom-0 !top-auto !mt-0 !h-auto !max-h-[92dvh] !w-full !max-w-none !rounded-t-2xl !rounded-b-none border-slate-200 bg-white dark:border-neutral-700 dark:bg-neutral-900 md:!inset-x-auto md:!right-0 md:!top-0 md:!bottom-0 md:!h-dvh md:!max-h-dvh md:!w-[390px] md:!rounded-none md:!border-l flex min-h-0 flex-col overflow-hidden">
                <DrawerHeader className="shrink-0 border-b border-slate-100 px-5 py-5 text-left dark:border-neutral-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <DrawerTitle className="text-lg font-bold">Filters</DrawerTitle>
                      <DrawerDescription className="mt-1 text-xs">Choose the reporting date range.</DrawerDescription>
                    </div>
                    <DrawerClose asChild><button type="button" aria-label="Close filters" className="rounded-sm p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-neutral-800"><X size={18} /></button></DrawerClose>
                  </div>
                </DrawerHeader>
                <form id="dc-summary-filters" onSubmit={applyFilters} className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
                  <div>
                    <p className="mb-3 text-sm font-bold">Date Range</p>
                    <div className="grid grid-cols-3 gap-2">
                      {PRESETS.map((preset) => (
                        <button key={preset} type="button" onClick={() => {
                          setDraftSelected(preset);
                          if (preset !== "Custom Range") {
                            const dates = datesForPreset(preset);
                            setDraftStartDate(dates.start_date);
                            setDraftEndDate(dates.end_date);
                          }
                        }} className={`min-h-9 rounded-sm border px-2 py-1.5 text-[11px] font-medium transition ${draftSelected === preset ? "border-[#0446DB] bg-[#0446DB] text-white" : "border-slate-200 text-slate-600 hover:border-blue-300 dark:border-neutral-700 dark:text-slate-300"}`}>
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-3 text-sm font-bold">{draftSelected === "Custom Range" ? "Custom Date Range" : "Selected Date Range"}</p>
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Start Date
                        <input type="date" value={draftStartDate} max={draftEndDate || undefined} disabled={draftSelected !== "Custom Range"} required onChange={(e) => setDraftStartDate(e.target.value)} className={`mt-2 ${fieldClass} disabled:opacity-65`} />
                      </label>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">End Date
                        <input type="date" value={draftEndDate} min={draftStartDate || undefined} disabled={draftSelected !== "Custom Range"} required onChange={(e) => setDraftEndDate(e.target.value)} className={`mt-2 ${fieldClass} disabled:opacity-65`} />
                      </label>
                    </div>
                  </div>
                </form>
                <DrawerFooter className="flex shrink-0 flex-row gap-2 border-t border-slate-100 bg-white px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900">
                  <button type="button" onClick={resetFilters} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-sm border border-slate-200 text-sm font-semibold text-slate-700 dark:border-neutral-700 dark:text-white"><RotateCcw size={15} /> Reset</button>
                  <button type="submit" form="dc-summary-filters" className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-sm bg-[#0446DB] text-sm font-semibold text-white hover:bg-blue-700"><Check size={15} /> Apply Filters</button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        <p className="mb-4 inline-flex items-center gap-2 rounded-sm bg-blue-50/70 px-3 py-2 text-xs font-medium text-slate-500 dark:bg-neutral-900 dark:text-slate-300"><CalendarDays size={14} className="text-[#0446DB]" /> {advanceFilters.start_date} to {advanceFilters.end_date}</p>
        {loading && !summary ? (
          <div className="flex min-h-[45vh] flex-col items-center justify-center gap-3"><Loader2 className="h-8 w-8 animate-spin text-[#0446DB]" /><span className="text-sm text-slate-500">Loading DC analytics...</span></div>
        ) : !summary ? (
          <div className="rounded-sm border border-slate-200 bg-white p-10 text-center text-slate-500 dark:border-neutral-800 dark:bg-neutral-900">No analytics data available for this range.</div>
        ) : (
          <>
            {loading && <div className="mb-3 flex items-center gap-2 text-xs text-blue-600"><Loader2 size={13} className="animate-spin" /> Refreshing summary...</div>}
            <div className="mb-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
              {cards.map((item) => <StatCard key={item.title} item={item} />)}
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <SummaryPanel title="COD Remittance Summary" icon={Wallet} trailing={
                <select aria-label="COD summary metric" value={codView} onChange={(e) => setCodView(e.target.value)} className="h-9 hidden rounded-sm border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                  <option value="Count">Count</option><option value="Amount">Amount</option>
                </select>
              }>
                <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {codRows.map((row) => {
                    const Icon = row.icon;
                    const itemTone = tone[row.tone];
                    const share = codView === "Count" ? pct(row.count, codTotal) : pct(row.amount, totalAmount);
                    return (
                      <div key={row.label} className="min-w-0 rounded-sm border border-gray-300  p-3 dark:border-neutral-700 dark:bg-neutral-900">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-sm ${itemTone.icon}`}><Icon size={17}/></span>
                        <p className={`mt-2 text-xs font-semibold ${itemTone.text}`}>{row.label}</p>
                        <p className="mt-1 text-lg font-extrabold">{codView === "Count" ? fmt(row.count) : money(row.amount)}</p>
                        <p className="mt-1 text-[10px] text-slate-500">{codView === "Count" ? money(row.amount) : `${fmt(row.count)} records`}</p>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-700"><div className={`h-full rounded-full ${itemTone.bar}`} style={{width: `${share}%`}} /></div>
                      </div>
                    );
                  })}
                </div>
                <div className="overflow-x-auto rounded-sm border border-slate-100 dark:border-neutral-800">
                  <table className="min-w-[460px] w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 dark:bg-neutral-800 dark:text-slate-200"><tr><th className="px-3 py-3 font-semibold">Status</th><th className="px-3 py-3 text-right font-semibold">Orders</th><th className="px-3 py-3 text-right font-semibold">Amount (₹)</th><th className="px-3 py-3 font-semibold">Share</th></tr></thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                      {codRows.map((row) => (
                        <tr key={row.label}>
                          <td className="px-3 py-3 font-medium">{row.label}</td>
                          <td className="px-3 py-3 text-right tabular-nums">{fmt(row.count)}</td>
                          <td className="px-3 py-3 text-right tabular-nums">{money(row.amount)}</td>
                          <td className="px-3 py-3"><div className="flex items-center gap-2"><div className="h-1.5 min-w-10 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-700"><div className={`h-full rounded-full ${tone[row.tone].bar}`} style={{width: `${pct(codView === "Count" ? row.count : row.amount, codView === "Count" ? codTotal : totalAmount)}%`}} /></div><span className="w-10 text-right tabular-nums text-slate-500">{percentText(codView === "Count" ? row.count : row.amount, codView === "Count" ? codTotal : totalAmount)}</span></div></td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 font-bold dark:bg-neutral-800"><tr><td className="px-3 py-3">Total</td><td className="px-3 py-3 text-right">{fmt(codTotal)}</td><td className="px-3 py-3 text-right">{money(totalAmount)}</td><td className="px-3 py-3 text-right">100%</td></tr></tfoot>
                  </table>
                </div>
              </SummaryPanel>

              <SummaryPanel title="Delivery Summary" icon={Truck}>
                <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
                  <Donut total={delivered} parts={chartBreakdown} />
                  <div className="w-full min-w-0 flex-1 space-y-3">
                    {chartBreakdown.map((row) => (
                      <div key={row.label} className="flex items-center gap-2 text-xs"><ColoredDot color={row.hex} /><span className="flex-1 text-slate-600 dark:text-slate-300">{row.label}</span><strong className="tabular-nums">{fmt(row.value)}</strong><span className="w-12 text-right tabular-nums text-slate-500">{percentText(row.value, row.total)}</span></div>
                    ))}
                    <hr className="border-slate-100 dark:border-neutral-800" />
                    {otherBreakdowns.map((row) => (
                      <div key={row.label} className="flex items-center gap-2 text-xs"><ColoredDot color={row.hex} /><span className="flex-1 text-slate-600 dark:text-slate-300">{row.label}</span><strong className="tabular-nums">{fmt(row.value)}</strong><span className="w-12 text-right tabular-nums text-slate-500">{percentText(row.value, row.total)}</span></div>
                    ))}
                  </div>
                </div>
              </SummaryPanel>
            </div>
            {/* <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-sm border border-slate-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"><p className="text-xs font-semibold text-slate-500">Total COD Remittance</p><p className="mt-2 text-2xl font-extrabold">{money(cod.totalAmount)}</p><p className="mt-1 text-xs text-slate-500">{fmt(cod.totalRecords)} remittance records in selected range</p></div>
              <div className="rounded-sm border border-slate-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"><p className="text-xs font-semibold text-slate-500">Delivered COD Collectable</p><p className="mt-2 text-2xl font-extrabold">{money(delivery.codCollectableAmount)}</p><p className="mt-1 text-xs text-slate-500">Based on orders delivered in the selected date range</p></div>
            </div> */}
            {/* <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">Note: Delivered-order metrics use delivery timestamps, while COD remittance metrics use submitted_at. Their totals can differ for the same date range. Percentages indicate proportions, not period-over-period growth.</p> */}
          </>
        )}
      </div>
    </div>
  );
}
