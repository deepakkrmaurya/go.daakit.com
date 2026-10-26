
// import { useEffect, useState } from "react";
// import moment from "moment";
// import { useSearchParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import logo from '@/assets/logo-2.png'
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import {
//   Alert,
//   AlertDescription,
//   AlertTitle,
// } from "@/components/ui/alert";

// import {
//   AlertCircle,
//   ArrowRight,
//   Box,
//   CalendarDays,
//   CheckCircle2,
//   Clock3,
//   MapPin,
//   Package,
//   Search,
//   ShieldCheck,
//   Truck,
// } from "lucide-react";

// import Loader from "./Loader";
// import AxiosInstance from "@/Helper/axiosInstance";



// function TrackAWBOrder() {
//   const [loading, setLoading] = useState(false);
//   const [searchParams] = useSearchParams();

//   const [awbNumber, setAwbNumber] = useState(
//     searchParams.get("awb_number") || "",
//   );

//   const [trackingHistory, setTrackingHistory] = useState([]);
//   const [error, setError] = useState("");

//   const handleSearch = async () => {
//     if (!awbNumber?.trim()) {
//       toast.warning("Please enter AWB number");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setTrackingHistory([]);

//     try {
//       const res  =  await AxiosInstance.post(`/api/tracking/trackawb`,{
//         awb_number: awbNumber,
//       })
      

//       if (res.data?.success) {
//         setTrackingHistory(res.data.tracking_history || []);
//       } else {
//         setError(res.data?.message || "Tracking data not found.");
//       }
//     } catch (err) {
//       const message =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Error fetching tracking history.";

//       setError(message);
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (awbNumber) {
//       handleSearch();
//     }
//   }, []);

//   const formatStatus = (status = "") => {
//     return status
//       .replaceAll("_", " ")
//       .split(" ")
//       .filter(Boolean)
//       .map(
//         (word) =>
//           word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
//       )
//       .join(" ");
//   };

//   const getStatusIcon = (status = "") => {
//     const value = status.toLowerCase();

//     if (
//       value.includes("delivered") &&
//       !value.includes("undelivered")
//     ) {
//       return CheckCircle2;
//     }

//     if (
//       value.includes("out for delivery") ||
//       value.includes("transit")
//     ) {
//       return Truck;
//     }

//     if (
//       value.includes("pickup") ||
//       value.includes("picked")
//     ) {
//       return Box;
//     }

//     return Package;
//   };

//   const latestTracking = trackingHistory?.[0];

//   return (
//     <div className="min-h-screen bg-slate-50/70 dark:bg-neutral-950">
//       {/* ================= HEADER ================= */}

//       <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/90">
//   <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    
//     {/* Logo */}
//     <div className="flex items-center">
//       <img
//         src={logo}
//         alt="DAAKit GO"
//         className="h-9 w-auto object-contain sm:h-10"
//       />
//     </div>

//     {/* Secure Tracking */}
//     <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:flex dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
//       <ShieldCheck size={14} />
//       Secure Shipment Tracking
//     </div>
    
//   </div>
// </header>

//       {/* ================= HERO ================= */}

//       <section className="relative overflow-hidden border-b border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
//         <div className="absolute left-1/2 top-0 h-72 w-[700px] -translate-x-1/2 rounded-full bg-blue-100/60 blur-[120px] dark:bg-blue-950/20" />

//         <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
//           <div className="mx-auto max-w-2xl text-center">
//             <Badge
//               variant="outline"
//               className="mb-4 rounded-full border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-medium text-[#0446DB] dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400"
//             >
//               <MapPin className="mr-1.5 h-3 w-3" />
//               Live Shipment Tracking
//             </Badge>

//             <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
//               Track your shipment
//             </h1>

//             <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-neutral-400">
//               Enter your AWB number to view the latest shipment status and
//               complete delivery journey.
//             </p>
//           </div>

//           {/* SEARCH */}

//           <Card className="mx-auto mt-8 max-w-2xl rounded-sm border-slate-200 bg-white shadow-xl shadow-slate-200/40 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
//             <CardContent className="p-3 sm:p-4">
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   handleSearch();
//                 }}
//                 className="flex flex-col gap-2 sm:flex-row"
//               >
//                 <div className="relative flex-1">
//                   <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

//                   <Input
//                     type="text"
//                     value={awbNumber}
//                     onChange={(e) => setAwbNumber(e.target.value)}
//                     placeholder="Enter AWB number"
//                     className="h-11 rounded-lg border-slate-200 bg-slate-50 pl-10 text-sm shadow-none focus-visible:border-[#0446DB] focus-visible:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950"
//                   />
//                 </div>

//                 <Button
//                   type="submit"
//                   disabled={loading}
//                   className="h-11 cursor-pointer rounded-lg bg-[#0446DB] px-6 font-medium text-white shadow-sm hover:bg-[#0339b5]"
//                 >
//                   {loading ? (
//                     <>
//                       <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
//                       Tracking...
//                     </>
//                   ) : (
//                     <>
//                       Track Shipment
//                       <ArrowRight className="ml-2 h-4 w-4" />
//                     </>
//                   )}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </div>
//       </section>

//       {/* ================= CONTENT ================= */}

//       <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
//         {/* LOADING */}

//         {loading && (
//           <div className="flex min-h-[300px] items-center justify-center">
//             <Loader />
//           </div>
//         )}

//         {/* ERROR */}

//         {!loading && error && (
//           <div className="mx-auto max-w-2xl">
//             <Alert
//               variant="destructive"
//               className="rounded-sm border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20"
//             >
//               <AlertCircle className="h-4 w-4" />

//               <AlertTitle>Unable to track shipment</AlertTitle>

//               <AlertDescription className="mt-1">
//                 {error}
//               </AlertDescription>
//             </Alert>
//           </div>
//         )}

//         {/* ================= TRACKING ================= */}

//         {!loading && trackingHistory.length > 0 && (
//           <div className="space-y-5">
//             {/* SUMMARY */}

//             <Card className="overflow-hidden rounded-sm border-slate-200 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
//               <CardContent className="p-0">
//                 <div className="grid md:grid-cols-[1fr_auto]">
//                   <div className="flex items-center gap-4 p-5 sm:p-6">
//                     <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-blue-50 text-[#0446DB] dark:bg-blue-950/40 dark:text-blue-400">
//                       <Package size={23} />
//                     </div>

//                     <div className="min-w-0">
//                       <p className="text-xs font-medium text-slate-500 dark:text-neutral-400">
//                         AWB Number
//                       </p>

//                       <h2 className="mt-1 truncate text-lg font-bold tracking-wide text-slate-950 dark:text-white">
//                         {awbNumber}
//                       </h2>

//                       <div className="mt-2 flex items-center gap-2">
//                         <Badge className="rounded-md bg-blue-50 text-[#0446DB] shadow-none hover:bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400">
//                           {formatStatus(latestTracking?.status)}
//                         </Badge>

//                         <span className="text-xs text-slate-400">
//                           Latest update
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 md:min-w-[230px] md:border-l md:border-t-0 md:px-6 md:py-5 dark:border-neutral-800 dark:bg-neutral-950/40">
//                     <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
//                       Last updated
//                     </p>

//                     <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-neutral-200">
//                       <CalendarDays size={15} className="text-[#0446DB]" />

//                       {moment(latestTracking?.event_time).format(
//                         "DD MMM YYYY",
//                       )}
//                     </div>

//                     <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
//                       <Clock3 size={14} />

//                       {moment(latestTracking?.event_time).format(
//                         "hh:mm A",
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* ================= TIMELINE ================= */}

//             <Card className="rounded-sm border-slate-200 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
//               <CardHeader className="border-b border-slate-100 px-5 py-4 sm:px-6 dark:border-neutral-800">
//                 <div className="flex items-center justify-between gap-4">
//                   <div>
//                     <CardTitle className="text-base font-semibold text-slate-950 dark:text-white">
//                       Shipment Journey
//                     </CardTitle>

//                     <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">
//                       Follow your package from pickup to delivery
//                     </p>
//                   </div>

//                   <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800">
//                     <MapPin size={17} />
//                   </div>
//                 </div>
//               </CardHeader>

//               <CardContent className="p-5 sm:p-6">
//                 <div>
//                   {trackingHistory.map((item, index) => {
//                     const isLatest = index === 0;
//                     const isLast =
//                       index === trackingHistory.length - 1;

//                     const StatusIcon = getStatusIcon(item.status);

//                     return (
//                       <div
//                         key={item.id || index}
//                         className="relative flex gap-4"
//                       >
//                         {/* LEFT TIMELINE */}

//                         <div className="relative flex w-9 shrink-0 justify-center">
//                           {!isLast && (
//                             <div className="absolute bottom-0 top-9 w-px bg-slate-200 dark:bg-neutral-700" />
//                           )}

//                           <div
//                             className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 ${
//                               isLatest
//                                 ? "border-[#0446DB] bg-[#0446DB] text-white shadow-md shadow-blue-200"
//                                 : "border-slate-200 bg-white text-slate-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-500"
//                             }`}
//                           >
//                             <StatusIcon size={15} />
//                           </div>
//                         </div>

//                         {/* RIGHT */}

//                         <div
//                           className={`min-w-0 flex-1 ${
//                             !isLast ? "pb-7" : ""
//                           }`}
//                         >
//                           <div
//                             className={`rounded-sm border p-4 transition-all ${
//                               isLatest
//                                 ? "border-blue-200 bg-blue-50/40 dark:border-blue-900/60 dark:bg-blue-950/20"
//                                 : "border-slate-200 bg-white hover:border-slate-300 dark:border-neutral-800 dark:bg-neutral-900"
//                             }`}
//                           >
//                             {/* STATUS HEADER */}

//                             <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
//                               <div>
//                                 <div className="flex flex-wrap items-center gap-2">
//                                   <h3 className="text-sm font-semibold text-slate-900 dark:text-neutral-100">
//                                     {formatStatus(item.status)}
//                                   </h3>

//                                   {isLatest && (
//                                     <Badge className="h-5 rounded-full bg-[#0446DB] px-2 text-[9px] font-semibold uppercase tracking-wide text-white hover:bg-[#0446DB]">
//                                       Latest
//                                     </Badge>
//                                   )}
//                                 </div>

//                                 {item.remarks && (
//                                   <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-neutral-400">
//                                     {item.remarks}
//                                   </p>
//                                 )}
//                               </div>

//                               <div className="shrink-0 sm:text-right">
//                                 <p className="flex items-center gap-1.5 text-xs font-medium text-slate-600 sm:justify-end dark:text-neutral-300">
//                                   <CalendarDays size={13} />

//                                   {moment(item.event_time).format(
//                                     "DD MMM YYYY",
//                                   )}
//                                 </p>

//                                 <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400 sm:justify-end">
//                                   <Clock3 size={12} />

//                                   {moment(item.event_time).format(
//                                     "hh:mm A",
//                                   )}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 <Separator className="my-6" />

//                 <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-4 dark:bg-neutral-950/50">
//                   <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#0446DB] shadow-sm dark:bg-neutral-800">
//                     <ShieldCheck size={16} />
//                   </div>

//                   <div>
//                     <p className="text-xs font-semibold text-slate-700 dark:text-neutral-200">
//                       Tracking information
//                     </p>

//                     <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
//                       Shipment updates are automatically added as your order
//                       progresses through the delivery network.
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         )}

//         {/* ================= EMPTY STATE ================= */}

//         {!loading &&
//           !error &&
//           trackingHistory.length === 0 &&
//           !awbNumber && (
//             <Card className="mx-auto max-w-xl rounded-sm border-dashed border-slate-300 bg-white shadow-none dark:border-neutral-700 dark:bg-neutral-900">
//               <CardContent className="flex flex-col items-center px-6 py-14 text-center">
//                 <div className="relative">
//                   <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-slate-100 text-slate-400 dark:bg-neutral-800">
//                     <Package size={28} />
//                   </div>

//                   <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#0446DB] text-white dark:border-neutral-900">
//                     <Search size={11} />
//                   </div>
//                 </div>

//                 <h3 className="mt-5 text-sm font-semibold text-slate-900 dark:text-white">
//                   Track your first shipment
//                 </h3>

//                 <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500 dark:text-neutral-400">
//                   Enter an AWB number above to see shipment status, delivery
//                   progress and tracking history.
//                 </p>
//               </CardContent>
//             </Card>
//           )}
//       </main>

//       {/* ================= FOOTER ================= */}

//       <footer className="mt-8 border-t border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
//         <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
//           <p className="text-xs text-slate-400">
//             © {new Date().getFullYear()} DAAKit Technology
//           </p>

//           <div className="flex items-center gap-1.5 text-xs text-slate-400">
//             <ShieldCheck size={13} />
//             Secure & reliable shipment tracking
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default TrackAWBOrder;





// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import moment from "moment";
// import {
//   ArrowRight, Barcode, Box, CalendarCheck2, Check,
//   Clock3, Copy, Info, LockKeyhole, MapPin, Package, RotateCcw,
//   Search, ShieldCheck, Truck, Warehouse,
// } from "lucide-react";
// import AxiosInstance from "@/Helper/axiosInstance";
// import logo from "@/assets/logo-2.png";


// const STEPS = [
//   { label: "Order Booked", icon: Package },
//   { label: "Picked Up", icon: Warehouse },
//   { label: "In Transit", icon: Truck },
//   { label: "Out for Delivery", icon: MapPin },
//   { label: "Delivered", icon: CalendarCheck2 },
// ];

// // function statusToStep(value) {
// //   const s = String(value ?? "").toLowerCase().replace(/[_-]+/g, " ").trim();
// //   if (s.includes("rto") || s.includes("return")) return -1;
// //   if (s.includes("undelivered") || s.includes("ndr") || s.includes("failed")) return -1;
// //   if (s.includes("delivered")) return 4;
// //   if (s.includes("out for delivery") || s === "ofd") return 3;
// //   if (s.includes("transit") || s.includes("at hub") || s.includes("received at") || s.includes("dispatched")) return 2;
// //   if (s.includes("picked") || s.includes("pickup completed") || s.includes("pickup done")) return 1;
// //   if (s.includes("book") || s.includes("created") || s.includes("placed") || s.includes("manifest")) return 0;
// //   return -1;
// // }


// function statusToStep(value) {
//   const s = String(value ?? "")
//     .toLowerCase()
//     .replace(/[_-]+/g, " ")
//     .trim();

//   if (
//     s.includes("undelivered") ||
//     s.includes("ndr") ||
//     s.includes("delivery failed")
//   ) {
//     return 4;
//   }

//   if (s.includes("rto") || s.includes("return")) return -1;

//   if (s.includes("delivered")) return 4;

//   if (s.includes("out for delivery") || s === "ofd") return 3;

//   if (
//     s.includes("transit") ||
//     s.includes("at hub") ||
//     s.includes("received at") ||
//     s.includes("dispatched")
//   ) {
//     return 2;
//   }

//   if (
//     s.includes("picked") ||
//     s.includes("pickup completed") ||
//     s.includes("pickup done")
//   ) {
//     return 1;
//   }

//   if (
//     s.includes("book") ||
//     s.includes("created") ||
//     s.includes("placed") ||
//     s.includes("manifest")
//   ) {
//     return 0;
//   }

//   return -1;
// }

// const formatStatus = (value = "") =>
//   String(value || "Status Unavailable")
//     .replace(/[_-]+/g, " ")
//     .split(" ")
//     .filter(Boolean)
//     .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
//     .join(" ");

// const formatWhen = (value) => {
//   if (!value || !moment(value).isValid()) return "Date not available";
//   return moment(value).format("DD MMM YYYY, hh:mm A");
// };

// function SmallTitle({ icon: Icon, children, subtitle, color = "blue" }) {
//   return (
//     <div className="flex items-start gap-3">
//       <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm ${color === "orange" ? "bg-orange-50 text-[#eb8300]" : "bg-blue-50 text-[#0446db]"}`}>
//         <Icon size={19} strokeWidth={2.2} />
//       </span>
//       <div>
//         <h2 className="text-base font-bold tracking-tight text-[#101e44] sm:text-lg">{children}</h2>
//         {subtitle && <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{subtitle}</p>}
//       </div>
//     </div>
//   );
// }

// function Journey({ events }) {
//   // const currentStatus = String(events[0]?.status ?? "");
//   // const activeIndex = statusToStep(currentStatus);
//   // const isException = events.length > 0 && activeIndex === -1;


// const currentStatus = String(events[0]?.status ?? "");

// const normalizedStatus = currentStatus
//   .toLowerCase()
//   .replace(/[_-]+/g, " ")
//   .trim();

// const isUndelivered =
//   normalizedStatus.includes("undelivered") ||
//   normalizedStatus.includes("ndr") ||
//   normalizedStatus.includes("delivery failed");

// const activeIndex = statusToStep(currentStatus);

// const isException =
//   events.length > 0 &&
//   activeIndex === -1;

// // Change only the final milestone label/icon
// const journeySteps = useMemo(
//   () => [
//     ...STEPS.slice(0, 4),
//     isUndelivered
//       ? { label: "Undelivered", icon: Info }
//       : STEPS[4],
//   ],
//   [isUndelivered]
// );


//   // const byStep = useMemo(() => {
//   //   const map = {};
//   //   for (const event of events) {
//   //     const index = statusToStep(event.status);
//   //     if (index >= 0 && map[index] === undefined) map[index] = event;
//   //   }
//   //   return map;
//   // }, [events]);



// const byStep = useMemo(() => {
//   const map = {};

//   for (const event of events) {
//     const index = statusToStep(event.status);

//     if (index < 0) continue;

//     // Picked Up: select the earliest pickup event
//     if (index === 1) {
//       if (
//         !map[index] ||
//         moment(event.event_time).valueOf() <
//           moment(map[index].event_time).valueOf()
//       ) {
//         map[index] = event;
//       }
//     } else {
//       // Other milestones: retain the latest event
//       if (map[index] === undefined) {
//         map[index] = event;
//       }
//     }
//   }

//   return map;
// }, [events]);


//   return (
//     <section 
//   className="
//     sticky top-0 z-40
//     rounded-sm
//     border border-slate-200/80
//     bg-white
//     px-4 py-5
//     shadow-lg
//     sm:px-6 sm:py-6
//     dark:border-neutral-800
//     dark:bg-neutral-900
//   "    >
//       <SmallTitle icon={MapPin} subtitle="Track your package's journey from pickup to delivery.">Shipment Journey</SmallTitle>
//       {isException && (
//         <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
//           Latest update: <strong>{formatStatus(currentStatus)}</strong>. See event history below for details.
//         </div>
//       )}
//       {/* Desktop: horizontal milestone flow */}
//       <div className="relative mt-8 hidden grid-cols-5 gap-2 md:grid">
//         <div className="absolute left-[10%] right-[10%] top-[23px] h-[2px] bg-slate-200" aria-hidden="true" />
//         {activeIndex >= 0 && (
//           <div className="absolute left-[10%] top-[23px] h-[2px] bg-[#0446db] transition-all" style={{ width: `${activeIndex * 20}%` }} aria-hidden="true" />
//         )}
//         {journeySteps.map((step, index) => {
//           const Icon = step.icon;
//           const done = activeIndex >= 0 && index < activeIndex;
//           const current = index === activeIndex;
//           const reached = done || current;
//           const event = byStep[index];
//           return (
//             <div key={step.label} className="relative flex flex-col items-center px-1 text-center">
//               <span className={`z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white shadow-sm ${current ? "bg-[#0446db] text-white shadow-blue-200" : reached ? "bg-[#e9f0ff] text-[#0446db]" : "bg-slate-100 text-slate-400"}`}>
//                 {done ? <Check size={20} /> : <Icon size={20} />}
//               </span>
//               <h3 className={`mt-3 text-xs font-bold lg:text-sm ${current ? "text-[#0446db]" : "text-[#18254b]"}`}>{step.label}</h3>
//               <p className="mt-1 max-w-[170px] text-[11px] leading-5 text-slate-500">
//                 {event ? formatWhen(event.event_time) : "Awaiting update"}
//               </p>
//               {event?.remarks && <p className="mt-1 max-w-[175px] text-[11px] leading-4 text-slate-400">{event.remarks}</p>}
//             </div>
//           );
//         })}
//       </div>
//       {/* Mobile: vertical milestone flow */}
//       <div className="mt-6 space-y-0 md:hidden">
//         {STEPS.map((step, index) => {
//           const Icon = step.icon;
//           const done = activeIndex >= 0 && index < activeIndex;
//           const current = index === activeIndex;
//           const reached = done || current;
//           const event = byStep[index];
//           return (
//             <div key={step.label} className="relative flex gap-3 pb-5 last:pb-0">
//               {index < STEPS.length - 1 && <span className={`absolute left-[19px] top-10 bottom-0 w-[2px] ${reached ? "bg-[#0446db]" : "bg-slate-200"}`} aria-hidden="true" />}
//               <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${current ? "bg-[#0446db] text-white" : reached ? "bg-blue-50 text-[#0446db]" : "bg-slate-100 text-slate-400"}`}>
//                 {done ? <Check size={18} /> : <Icon size={18} />}
//               </div>
//               <div className={`min-w-0 flex-1 rounded-sm px-3 py-2 ${current ? "bg-blue-50" : ""}`}>
//                 <h3 className={`text-sm font-semibold ${current ? "text-[#0446db]" : "text-slate-800"}`}>{step.label}</h3>
//                 <p className="mt-0.5 text-xs text-slate-500">{event ? formatWhen(event.event_time) : "Awaiting update"}</p>
//                 {event?.remarks && <p className="mt-1 text-xs leading-5 text-slate-500">{event.remarks}</p>}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//       {/* Actual API events remain accessible even for uncommon statuses. */}
//       <details className="mt-6 border-t border-slate-100 pt-4">
//         <summary className="cursor-pointer text-sm font-semibold text-[#0446db]">View all tracking updates ({events.length})</summary>
//         <div className="mt-4 space-y-3">
//           {events.map((event, index) => (
//             <div key={`${event.id ?? "event"}-${index}`} className="flex gap-3 border-l-2 border-blue-100 pl-3">
//               <div className="min-w-0">
//                 <p className="text-sm font-semibold text-slate-800">{formatStatus(event.status)}</p>
//                 <p className="text-xs text-slate-500">{formatWhen(event.event_time)}</p>
//                 {event.remarks && <p className="mt-1 text-sm text-slate-600">{event.remarks}</p>}
//               </div>
//             </div>
//           ))}
//         </div>
//       </details>
//     </section>
//   );
// }

// export default function TrackAWBOrder() {
//   const [searchParams] = useSearchParams();
//   const queryAwb = searchParams.get("awb_number") || "";
//   const [awbNumber, setAwbNumber] = useState(queryAwb);
//   const [trackedAwb, setTrackedAwb] = useState("");
//   const [trackingHistory, setTrackingHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const requestId = useRef(0);

//   const handleSearch = useCallback(async (rawAwb) => {
//     const awb = String(rawAwb ?? "").trim();
//     if (!awb) {
//       toast.warning("Please enter AWB number");
//       return;
//     }
//     const id = ++requestId.current;
//     setLoading(true);
//     setError("");
//     setTrackingHistory([]);
//     setTrackedAwb(awb);
//     try {
//       const response = await AxiosInstance.post("/api/tracking/trackawb", { awb_number: awb });
//       if (id !== requestId.current) return;
//       if (!response.data?.success) {
//         setError(response.data?.message || "Tracking data not found.");
//         return;
//       }
//       const events = Array.isArray(response.data?.tracking_history) ? response.data.tracking_history : [];
//       setTrackingHistory(events.slice().sort((a, b) => {
//         const aTime = moment(a.event_time).valueOf();
//         const bTime = moment(b.event_time).valueOf();
//         return (Number.isFinite(bTime) ? bTime : 0) - (Number.isFinite(aTime) ? aTime : 0);
//       }));
//     } catch (err) {
//       if (id !== requestId.current) return;
//       const message = err?.response?.data?.message || err?.message || "Error fetching tracking history.";
//       setError(message);
//       toast.error(message);
//     } finally {
//       if (id === requestId.current) setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     setAwbNumber(queryAwb);
//     if (queryAwb.trim()) handleSearch(queryAwb);
//     else {
//       ++requestId.current;
//       setTrackingHistory([]);
//       setTrackedAwb("");
//       setError("");
//       setLoading(false);
//     }
//   }, [queryAwb, handleSearch]);

//   const latest = trackingHistory[0];
//   const copyAwb = async () => {
//     try {
//       await navigator.clipboard.writeText(trackedAwb);
//       toast.success("AWB number copied");
//     } catch {
//       toast.error("Unable to copy AWB number");
//     }
//   };
//   const resetTracking = () => {
//     ++requestId.current;
//     setTrackedAwb("");
//     setAwbNumber("");
//     setTrackingHistory([]);
//     setError("");
//     setLoading(false);
//   };

//   return (
//     <div className="flex h-screen h-[100dvh] min-h-0 flex-col overflow-hidden bg-[#f5f8ff] text-slate-900">
//       {/* The header never participates in the scroll region. */}
//       <header className="relative z-50 shrink-0 border-b border-slate-200 bg-white shadow-sm">
//         <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
//           <img src={logo} alt="DAAKit GO" className="h-9 w-auto object-contain sm:h-10" />
//           <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-2 text-[11px] font-semibold text-[#0446db] sm:text-xs">
//             <LockKeyhole size={14} /> <span className="hidden min-[350px]:inline">Secure Shipment Tracking</span>
//           </div>
//         </div>
//       </header>

//       {/* Only this element scrolls. Works on desktop and mobile inside 100dvh. */}
//       <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
//         <div className="relative overflow-hidden border-b border-blue-100 bg-gradient-to-br from-[#e9f2ff] via-[#f8fbff] to-[#dceaff]">
//           <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#8ab7ff]/25 blur-3xl" />
//           <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 py-9 sm:px-6 sm:py-12 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:py-16">
//             <div className="z-10 max-w-2xl">
//               <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-semibold text-[#0446db]">
//                 <ShieldCheck size={13} /> Live Shipment Tracking
//               </div>
//               <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#0e1944] sm:text-4xl lg:text-5xl">
//                 Track your <span className="text-[#0446db]">shipment</span>
//               </h1>
//               <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
//                 Enter your AWB number to view the latest shipment status and complete delivery journey.
//               </p>
//               <form onSubmit={(e) => { e.preventDefault(); handleSearch(awbNumber); }} className="mt-6 rounded-sm border border-white/80 bg-white/95 p-3 shadow-[0_16px_40px_rgba(24,54,104,.12)] sm:p-4">
//                 <div className="flex flex-col gap-2 sm:flex-row">
//                   <label className="relative min-w-0 flex-1">
//                     <Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//                     <input type="text" value={awbNumber} onChange={(e) => setAwbNumber(e.target.value)} placeholder="Enter AWB number" aria-label="Enter AWB number" className="h-12 w-full rounded-sm border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#0446db] focus:ring-2 focus:ring-blue-100" />
//                   </label>
//                   <button type="submit" disabled={loading} className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-sm bg-[#0446db] px-6 text-sm font-semibold text-white transition hover:bg-[#0338b5] disabled:cursor-wait disabled:opacity-60">
//                     {loading ? "Tracking..." : "Track Shipment"} <ArrowRight size={18} />
//                   </button>
//                 </div>
//                 <p className="mt-2 px-1 text-xs text-slate-400">Use the tracking number provided for your shipment.</p>
//               </form>
//             </div>

//             {/* Decorative in-house vector illustration, no image CDN or dependencies. */}
//             <div className="hidden lg:block" aria-hidden="true">
//               <div className="relative rounded-3xl bg-gradient-to-br from-blue-100 to-white/30 p-8">
//                 <div className="absolute right-8 top-7 h-16 w-16 rounded-full bg-orange-100/80" />
//                 <svg viewBox="0 0 520 300" className="relative w-full drop-shadow-xl" role="presentation">
//                   <path d="M15 254h495" stroke="#b2c9e9" strokeWidth="4" strokeLinecap="round" />
//                   <rect x="90" y="96" width="276" height="135" rx="14" fill="#fff" stroke="#d0dff5" strokeWidth="5" />
//                   <path d="M230 96h136v135H230z" fill="#0446db" opacity=".92" />
//                   <path d="M246 96h58l-58 135h-58z" fill="#eb8300" opacity=".9" />
//                   <text x="109" y="155" fontSize="25" fontWeight="800" fill="#0446db">DAAKit</text>
//                   <text x="109" y="182" fontSize="22" fontWeight="800" fill="#eb8300">GO</text>
//                   <path d="M366 145h57l57 53v33H366z" fill="#fff" stroke="#d0dff5" strokeWidth="5" strokeLinejoin="round" />
//                   <path d="M388 158h27l35 33h-62z" fill="#0446db" opacity=".86" />
//                   <rect x="455" y="207" width="20" height="7" rx="3" fill="#eb8300" />
//                   <circle cx="161" cy="233" r="27" fill="#1e2b51" stroke="#fff" strokeWidth="7" />
//                   <circle cx="161" cy="233" r="9" fill="#b1c2da" />
//                   <circle cx="405" cy="233" r="27" fill="#1e2b51" stroke="#fff" strokeWidth="7" />
//                   <circle cx="405" cy="233" r="9" fill="#b1c2da" />
//                   <path d="M30 251h52m405 0h22" stroke="#0446db" strokeWidth="5" strokeLinecap="round" />
//                 </svg>
//                 <div className="absolute bottom-4 right-6 text-right text-sm font-bold italic text-[#1745a0]">Moving Businesses<br />Forward <span className="text-[#eb8300]">↗</span></div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <main className="relative mx-auto -mt-3 flex max-w-7xl flex-col gap-5 px-4 pb-10 sm:px-6 lg:px-8">
//           {loading && <div role="status" className="rounded-sm border border-blue-100 bg-white p-7 text-center text-sm text-[#0446db] shadow-sm"><RotateCcw className="mx-auto mb-2 animate-spin" />Fetching shipment updates...</div>}
//           {!loading && error && (
//             <div role="alert" className="rounded-sm border border-red-200 bg-red-50 p-5 text-sm text-red-700"><strong>Unable to track shipment.</strong><p className="mt-1">{error}</p></div>
//           )}
//           {!loading && trackingHistory.length > 0 && (
//             <>
//               <section className="rounded-sm border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(22,46,91,.06)] sm:p-6">
//                 <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-5">
//                   <SmallTitle icon={Box} color="orange" subtitle="Here's the latest information for your shipment.">Shipment Summary</SmallTitle>
//                   <button onClick={resetTracking} type="button" className="inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-[#0446db] hover:bg-blue-100">
//                     <RotateCcw size={14} /> Track Another
//                   </button>
//                 </div>
//                 <div className="grid gap-5 pt-5 sm:grid-cols-3">
//                   <div className="flex min-w-0 gap-3 sm:border-r sm:border-slate-100">
//                     <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-blue-50 text-[#0446db]"><Barcode size={20} /></span>
//                     <div className="min-w-0"><p className="text-xs text-slate-500">AWB Number</p><div className="mt-1 flex items-center gap-2"><p className="break-all text-sm font-bold text-[#101e44]">{trackedAwb}</p><button aria-label="Copy AWB" onClick={copyAwb} className="shrink-0 text-slate-500 hover:text-[#0446db]"><Copy size={14} /></button></div></div>
//                   </div>
//                   <div className="flex gap-3 sm:border-r sm:border-slate-100">
//                     <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-blue-50 text-[#0446db]"><Truck size={20} /></span>
//                     <div><p className="text-xs text-slate-500">Current Status</p><span className="mt-1 inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#0446db]">{formatStatus(latest?.status)}</span></div>
//                   </div>
//                   <div className="flex gap-3">
//                     <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-blue-50 text-[#0446db]"><Clock3 size={20} /></span>
//                     <div><p className="text-xs text-slate-500">Last Updated</p><p className="mt-1 text-sm font-bold text-[#101e44]">{formatWhen(latest?.event_time)}</p></div>
//                   </div>
//                 </div>
//               </section>
//               <Journey events={trackingHistory} />
//               <div className="flex items-start gap-3 rounded-sm border border-blue-100 bg-blue-50/80 p-4 text-sm text-[#2652a5]">
//                 <Info className="mt-0.5 shrink-0" size={18} />
//                 <p>Tracking information is automatically updated as your package moves through the delivery network. Updates may occasionally be delayed.</p>
//               </div>
//             </>
//           )}
//           {!loading && !error && trackingHistory.length === 0 && (
//             <div className="rounded-sm border border-dashed border-blue-200 bg-white/90 p-10 text-center shadow-sm">
//               <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-sm bg-blue-50 text-[#0446db]"><Package size={26} /></span>
//               <h2 className="mt-4 font-bold text-[#101e44]">{trackedAwb ? "No tracking updates available" : "Track your first shipment"}</h2>
//               <p className="mt-2 text-sm text-slate-500">{trackedAwb ? "No tracking events were returned for this AWB." : "Enter an AWB number above to see your shipment status and history."}</p>
//             </div>
//           )}
//         </main>
//         <footer className="border-t border-slate-200 bg-white px-4 py-5 text-xs text-slate-400">
//           <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row"><span>© {new Date().getFullYear()} DAAKit Technology</span><span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Secure & reliable shipment tracking</span></div>
//         </footer>
//       </div>
//     </div>
//   );
// }


import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import {
  ArrowRight, Barcode, Box, CalendarCheck2, Check,
  Clock3, Copy, Info, LockKeyhole, MapPin, Package, RotateCcw,
  Search, ShieldCheck, Truck, Warehouse,
} from "lucide-react";
import AxiosInstance from "@/Helper/axiosInstance";
import logo from "@/assets/logo-2.png";

// Maps received tracking statuses to high-level milestones for the visual timeline.
// Dates and remarks always come from the tracking API, never from placeholders.
const STEPS = [
  { label: "Order Booked", icon: Package },
  { label: "Picked Up", icon: Warehouse },
  { label: "In Transit", icon: Truck },
  { label: "Out for Delivery", icon: MapPin },
  { label: "Delivered", icon: CalendarCheck2 },
];

function statusToStep(value) {
  const s = String(value ?? "").toLowerCase().replace(/[_-]+/g, " ").trim();
  if (s.includes("rto") || s.includes("return")) return -1;
  if (s.includes("undelivered") || s.includes("ndr") || s.includes("delivery failed")) return 4;
  if (s.includes("delivered")) return 4;
  if (s.includes("out for delivery") || s === "ofd") return 3;
  if (s.includes("transit") || s.includes("at hub") || s.includes("received at") || s.includes("dispatched")) return 2;
  if (s.includes("picked") || s.includes("pickup completed") || s.includes("pickup done")) return 1;
  if (s.includes("book") || s.includes("created") || s.includes("placed") || s.includes("manifest")) return 0;
  return -1;
}

const formatStatus = (value = "") =>
  String(value || "Status Unavailable")
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const formatWhen = (value) => {
  if (!value || !moment(value).isValid()) return "Date not available";
  return moment(value).format("DD MMM YYYY, hh:mm A");
};

function SmallTitle({ icon: Icon, children, subtitle, color = "blue" }) {
  return (
    <div className="flex items-start gap-3">
      <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm ${color === "orange" ? "bg-orange-50 text-[#eb8300]" : "bg-blue-50 text-[#0446db]"}`}>
        <Icon size={19} strokeWidth={2.2} />
      </span>
      <div>
        <h2 className="text-base font-bold tracking-tight text-[#101e44] sm:text-lg">{children}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{subtitle}</p>}
      </div>
    </div>
  );
}

function Journey({ events }) {
  const currentStatus = String(events[0]?.status ?? "");
  const normalizeStatus = (value) =>
    String(value ?? "").toLowerCase().replace(/[_-]+/g, " ").trim();
  const isUndeliveredStatus = (value) => {
    const status = normalizeStatus(value);
    return status.includes("undelivered") || status.includes("ndr") || status.includes("delivery failed");
  };
  const isDeliveredStatus = (value) => {
    const status = normalizeStatus(value);
    return !isUndeliveredStatus(value) && status.includes("delivered");
  };

  const { journeySteps, byStep, activeIndex } = useMemo(() => {
    const ordered = [...events].sort(
      (a, b) => moment(a.event_time).valueOf() - moment(b.event_time).valueOf(),
    );
    const pickupEvents = ordered.filter((event) => statusToStep(event.status) === 1);
    const undeliveredEvents = ordered.filter((event) => isUndeliveredStatus(event.status));
    const deliveredEvents = ordered.filter((event) => isDeliveredStatus(event.status));
    const latestUndelivered = undeliveredEvents[undeliveredEvents.length - 1];
    const latestDelivered = deliveredEvents[deliveredEvents.length - 1];
    const hasUndelivered = undeliveredEvents.length > 0;
    // A delivered milestone after Undelivered is shown only if it happened afterward.
    const hasDeliveredAfterUndelivered = Boolean(
      latestDelivered &&
      (!latestUndelivered || moment(latestDelivered.event_time).isAfter(moment(latestUndelivered.event_time))),
    );

    const steps = [
      ...STEPS.slice(0, 4),
      ...(hasUndelivered ? [{ label: "Undelivered", icon: Info }] : []),
      ...(!hasUndelivered || hasDeliveredAfterUndelivered ? [STEPS[4]] : []),
    ];
    const map = {};
    for (const event of events) {
      const index = statusToStep(event.status);
      if (index < 0 || index === 4) continue;
      if (index === 1) continue; // Handle earliest pickup separately.
      if (!map[index]) map[index] = event; // Sorted latest-first by API fetch.
    }
    if (pickupEvents.length) map[1] = pickupEvents[0];
    if (hasUndelivered) map[4] = latestUndelivered;
    if (hasDeliveredAfterUndelivered) map[5] = latestDelivered;
    if (!hasUndelivered && latestDelivered) map[4] = latestDelivered;

    // Reflect the current event in the progress highlight, not merely historical presence.
    const currentStep = statusToStep(currentStatus);
    let highlighted = currentStep;
    if (isUndeliveredStatus(currentStatus)) highlighted = 4;
    else if (isDeliveredStatus(currentStatus)) {
      highlighted = hasUndelivered && hasDeliveredAfterUndelivered ? 5 : 4;
    }
    // An exception such as RTO has no active milestone.
    if (currentStep === -1) highlighted = -1;

    return { journeySteps: steps, byStep: map, activeIndex: highlighted };
  }, [events, currentStatus]);

  const isException = events.length > 0 && activeIndex === -1;
  const progress = activeIndex >= 0
    ? (activeIndex / Math.max(1, journeySteps.length - 1)) * 80
    : 0;
  const progressColor = isUndeliveredStatus(currentStatus) ? "#eb8300" : "#0446db";

  return (
    <section className="sticky top-0 z-40 rounded-sm border border-slate-200/80 bg-white px-4 py-5  sm:px-6 sm:py-6 dark:border-neutral-800 dark:bg-neutral-900">
      <SmallTitle icon={MapPin} subtitle="Track your package's journey from pickup to delivery.">Shipment Journey</SmallTitle>
      {isException && (
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Latest update: <strong>{formatStatus(currentStatus)}</strong>. See event history below for details.
        </div>
      )}
      {/* Desktop milestones */}
      <div className={`relative mt-8 hidden gap-2 md:grid ${journeySteps.length === 6 ? "grid-cols-6" : "grid-cols-5"}`}>
        <div className="absolute left-[10%] right-[10%] top-[23px] h-[2px] bg-slate-200" aria-hidden="true" />
        {activeIndex >= 0 && (
          <div className="absolute left-[10%] top-[23px] h-[2px] transition-all" style={{ width: `${progress}%`, backgroundColor: progressColor }} aria-hidden="true" />
        )}
        {journeySteps.map((step, index) => {
          const Icon = step.icon;
          const done = activeIndex >= 0 && index < activeIndex;
          const current = index === activeIndex;
          const reached = done || current;
          const event = byStep[index];
          const exceptionStep = step.label === "Undelivered";
          return (
            <div key={step.label} className="relative flex flex-col items-center px-1 text-center">
              <span className={`z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white shadow-sm ${current ? exceptionStep ? "bg-[#eb8300] text-white" : "bg-[#0446db] text-white shadow-blue-200" : reached ? "bg-[#e9f0ff] text-[#0446db]" : "bg-slate-100 text-slate-400"}`}>
                {done ? <Check size={20} /> : <Icon size={20} />}
              </span>
              <h3 className={`mt-3 text-xs font-bold lg:text-sm ${current ? exceptionStep ? "text-[#eb8300]" : "text-[#0446db]" : "text-[#18254b]"}`}>{step.label}</h3>
              <p className="mt-1 max-w-[170px] text-[11px] leading-5 text-slate-500">
                {event ? formatWhen(event.event_time) : "Awaiting update"}
              </p>
              {event?.remarks && <p className="mt-1 max-w-[175px] text-[11px] leading-4 text-slate-400">{event.remarks}</p>}
            </div>
          );
        })}
      </div>
      {/* Mobile milestones */}
      <div className="mt-6 space-y-0 md:hidden">
        {journeySteps.map((step, index) => {
          const Icon = step.icon;
          const done = activeIndex >= 0 && index < activeIndex;
          const current = index === activeIndex;
          const reached = done || current;
          const event = byStep[index];
          const exceptionStep = step.label === "Undelivered";
          return (
            <div key={step.label} className="relative flex gap-3 pb-5 last:pb-0">
              {index < journeySteps.length - 1 && <span className={`absolute left-[19px] top-10 bottom-0 w-[2px] ${reached ? "bg-[#0446db]" : "bg-slate-200"}`} aria-hidden="true" />}
              <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${current ? exceptionStep ? "bg-[#eb8300] text-white" : "bg-[#0446db] text-white" : reached ? "bg-blue-50 text-[#0446db]" : "bg-slate-100 text-slate-400"}`}>
                {done ? <Check size={18} /> : <Icon size={18} />}
              </div>
              <div className={`min-w-0 flex-1 rounded-sm px-3 py-2 ${current ? exceptionStep ? "bg-orange-50" : "bg-blue-50" : ""}`}>
                <h3 className={`text-sm font-semibold ${current ? exceptionStep ? "text-[#eb8300]" : "text-[#0446db]" : "text-slate-800"}`}>{step.label}</h3>
                <p className="mt-0.5 text-xs text-slate-500">{event ? formatWhen(event.event_time) : "Awaiting update"}</p>
                {event?.remarks && <p className="mt-1 text-xs leading-5 text-slate-500">{event.remarks}</p>}
              </div>
            </div>
          );
        })}
      </div>
      <details className="mt-6 border-t border-slate-100 pt-4">
        <summary className="cursor-pointer text-sm font-semibold text-[#0446db]">View all tracking updates ({events.length})</summary>
        <div className="mt-4 space-y-3">
          {events.map((event, index) => (
            <div key={`${event.id ?? "event"}-${index}`} className="flex gap-3 border-l-2 border-blue-100 pl-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">{formatStatus(event.status)}</p>
                <p className="text-xs text-slate-500">{formatWhen(event.event_time)}</p>
                {event.remarks && <p className="mt-1 text-sm text-slate-600">{event.remarks}</p>}
              </div>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}

export default function TrackAWBOrder() {
  const [searchParams] = useSearchParams();
  const queryAwb = searchParams.get("awb_number") || "";
  const [awbNumber, setAwbNumber] = useState(queryAwb);
  const [trackedAwb, setTrackedAwb] = useState("");
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef(0);

  const handleSearch = useCallback(async (rawAwb) => {
    const awb = String(rawAwb ?? "").trim();
    if (!awb) {
      toast.warning("Please enter AWB number");
      return;
    }
    const id = ++requestId.current;
    setLoading(true);
    setError("");
    setTrackingHistory([]);
    setTrackedAwb(awb);
    try {
      const response = await AxiosInstance.post("/api/tracking/trackawb", { awb_number: awb });
      if (id !== requestId.current) return;
      if (!response.data?.success) {
        setError(response.data?.message || "Tracking data not found.");
        return;
      }
      const events = Array.isArray(response.data?.tracking_history) ? response.data.tracking_history : [];
      setTrackingHistory(events.slice().sort((a, b) => {
        const aTime = moment(a.event_time).valueOf();
        const bTime = moment(b.event_time).valueOf();
        return (Number.isFinite(bTime) ? bTime : 0) - (Number.isFinite(aTime) ? aTime : 0);
      }));
    } catch (err) {
      if (id !== requestId.current) return;
      const message = err?.response?.data?.message || err?.message || "Error fetching tracking history.";
      setError(message);
      toast.error(message);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    setAwbNumber(queryAwb);
    if (queryAwb.trim()) handleSearch(queryAwb);
    else {
      ++requestId.current;
      setTrackingHistory([]);
      setTrackedAwb("");
      setError("");
      setLoading(false);
    }
  }, [queryAwb, handleSearch]);

  const latest = trackingHistory[0];
  const copyAwb = async () => {
    try {
      await navigator.clipboard.writeText(trackedAwb);
      toast.success("AWB number copied");
    } catch {
      toast.error("Unable to copy AWB number");
    }
  };
  const resetTracking = () => {
    ++requestId.current;
    setTrackedAwb("");
    setAwbNumber("");
    setTrackingHistory([]);
    setError("");
    setLoading(false);
  };

  return (
    <div className="flex h-screen h-[100dvh] min-h-0 flex-col overflow-hidden bg-[#f5f8ff] text-slate-900">
      {/* The header never participates in the scroll region. */}
      <header className="relative z-50 shrink-0 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <img src={logo} alt="DAAKit GO" className="h-9 w-auto object-contain sm:h-10" />
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-2 text-[11px] font-semibold text-[#0446db] sm:text-xs">
            <LockKeyhole size={14} /> <span className="hidden min-[350px]:inline">Secure Shipment Tracking</span>
          </div>
        </div>
      </header>

      {/* Only this element scrolls. Works on desktop and mobile inside 100dvh. */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="relative overflow-hidden border-b border-blue-100 bg-gradient-to-br from-[#e9f2ff] via-[#f8fbff] to-[#dceaff]">
          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#8ab7ff]/25 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 py-9 sm:px-6 sm:py-12 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:py-16">
            <div className="z-10 max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-semibold text-[#0446db]">
                <ShieldCheck size={13} /> Live Shipment Tracking
              </div>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#0e1944] sm:text-4xl lg:text-5xl">
                Track your <span className="text-[#0446db]">shipment</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                Enter your AWB number to view the latest shipment status and complete delivery journey.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); handleSearch(awbNumber); }} className="mt-6 rounded-sm border border-white/80 bg-white/95 p-3 shadow-[0_16px_40px_rgba(24,54,104,.12)] sm:p-4">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <label className="relative min-w-0 flex-1">
                    <Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" value={awbNumber} onChange={(e) => setAwbNumber(e.target.value)} placeholder="Enter AWB number" aria-label="Enter AWB number" className="h-12 w-full rounded-sm border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#0446db] focus:ring-2 focus:ring-blue-100" />
                  </label>
                  <button type="submit" disabled={loading} className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-sm bg-[#0446db] px-6 text-sm font-semibold text-white transition hover:bg-[#0338b5] disabled:cursor-wait disabled:opacity-60">
                    {loading ? "Tracking..." : "Track Shipment"} <ArrowRight size={18} />
                  </button>
                </div>
                <p className="mt-2 px-1 text-xs text-slate-400">Use the tracking number provided for your shipment.</p>
              </form>
            </div>

            {/* Decorative in-house vector illustration, no image CDN or dependencies. */}
            <div className="hidden lg:block" aria-hidden="true">
              <div className="relative rounded-3xl bg-gradient-to-br from-blue-100 to-white/30 p-8">
                <div className="absolute right-8 top-7 h-16 w-16 rounded-full bg-orange-100/80" />
                <svg viewBox="0 0 520 300" className="relative w-full drop-shadow-xl" role="presentation">
                  <path d="M15 254h495" stroke="#b2c9e9" strokeWidth="4" strokeLinecap="round" />
                  <rect x="90" y="96" width="276" height="135" rx="14" fill="#fff" stroke="#d0dff5" strokeWidth="5" />
                  <path d="M230 96h136v135H230z" fill="#0446db" opacity=".92" />
                  <path d="M246 96h58l-58 135h-58z" fill="#eb8300" opacity=".9" />
                  <text x="109" y="155" fontSize="25" fontWeight="800" fill="#0446db">DAAKit</text>
                  <text x="109" y="182" fontSize="22" fontWeight="800" fill="#eb8300">GO</text>
                  <path d="M366 145h57l57 53v33H366z" fill="#fff" stroke="#d0dff5" strokeWidth="5" strokeLinejoin="round" />
                  <path d="M388 158h27l35 33h-62z" fill="#0446db" opacity=".86" />
                  <rect x="455" y="207" width="20" height="7" rx="3" fill="#eb8300" />
                  <circle cx="161" cy="233" r="27" fill="#1e2b51" stroke="#fff" strokeWidth="7" />
                  <circle cx="161" cy="233" r="9" fill="#b1c2da" />
                  <circle cx="405" cy="233" r="27" fill="#1e2b51" stroke="#fff" strokeWidth="7" />
                  <circle cx="405" cy="233" r="9" fill="#b1c2da" />
                  <path d="M30 251h52m405 0h22" stroke="#0446db" strokeWidth="5" strokeLinecap="round" />
                </svg>
                <div className="absolute bottom-4 right-6 text-right text-sm font-bold italic text-[#1745a0]">Moving Businesses<br />Forward <span className="text-[#eb8300]">↗</span></div>
              </div>
            </div>
          </div>
        </div>

        <main className="relative mx-auto -mt-3 flex max-w-7xl flex-col gap-5 px-4 pb-10 sm:px-6 lg:px-8">
          {loading && <div role="status" className="rounded-sm border border-blue-100 bg-white p-7 text-center text-sm text-[#0446db] shadow-sm"><RotateCcw className="mx-auto mb-2 animate-spin" />Fetching shipment updates...</div>}
          {!loading && error && (
            <div role="alert" className="rounded-sm border border-red-200 bg-red-50 p-5 text-sm text-red-700"><strong>Unable to track shipment.</strong><p className="mt-1">{error}</p></div>
          )}
          {!loading && trackingHistory.length > 0 && (
            <>
              <section className="rounded-sm border border-slate-200/80 bg-white p-4  sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-5">
                  <SmallTitle icon={Box} color="orange" subtitle="Here's the latest information for your shipment.">Shipment Summary</SmallTitle>
                  <button onClick={resetTracking} type="button" className="inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-[#0446db] hover:bg-blue-100">
                    <RotateCcw size={14} /> Track Another
                  </button>
                </div>
                <div className="grid gap-5 pt-5 sm:grid-cols-3">
                  <div className="flex min-w-0 gap-3 sm:border-r sm:border-slate-100">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-blue-50 text-[#0446db]"><Barcode size={20} /></span>
                    <div className="min-w-0"><p className="text-xs text-slate-500">AWB Number</p><div className="mt-1 flex items-center gap-2"><p className="break-all text-sm font-bold text-[#101e44]">{trackedAwb}</p><button aria-label="Copy AWB" onClick={copyAwb} className="shrink-0 text-slate-500 hover:text-[#0446db]"><Copy size={14} /></button></div></div>
                  </div>
                  <div className="flex gap-3 sm:border-r sm:border-slate-100">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-blue-50 text-[#0446db]"><Truck size={20} /></span>
                    <div><p className="text-xs text-slate-500">Current Status</p><span className="mt-1 inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#0446db]">{formatStatus(latest?.status)}</span></div>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-blue-50 text-[#0446db]"><Clock3 size={20} /></span>
                    <div><p className="text-xs text-slate-500">Last Updated</p><p className="mt-1 text-sm font-bold text-[#101e44]">{formatWhen(latest?.event_time)}</p></div>
                  </div>
                </div>
              </section>
              <Journey events={trackingHistory} />
              <div className="flex items-start gap-3 rounded-sm border border-blue-100 bg-blue-50/80 p-4 text-sm text-[#2652a5]">
                <Info className="mt-0.5 shrink-0" size={18} />
                <p>Tracking information is automatically updated as your package moves through the delivery network. Updates may occasionally be delayed.</p>
              </div>
            </>
          )}
          {!loading && !error && trackingHistory.length === 0 && (
            <div className="rounded-sm border border-dashed border-blue-200 bg-white/90 p-10 text-center shadow-sm">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-sm bg-blue-50 text-[#0446db]"><Package size={26} /></span>
              <h2 className="mt-4 font-bold text-[#101e44]">{trackedAwb ? "No tracking updates available" : "Track your first shipment"}</h2>
              <p className="mt-2 text-sm text-slate-500">{trackedAwb ? "No tracking events were returned for this AWB." : "Enter an AWB number above to see your shipment status and history."}</p>
            </div>
          )}
        </main>
        <footer className="border-t border-slate-200 bg-white px-4 py-5 text-xs text-slate-400">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row"><span>© {new Date().getFullYear()} DAAKit Technology</span><span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Secure & reliable shipment tracking</span></div>
        </footer>
      </div>
    </div>
  );
}
