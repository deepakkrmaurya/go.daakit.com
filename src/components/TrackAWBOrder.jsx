// import axios from "axios";
// import { useEffect, useState } from "react";
// import { FaSearch } from "react-icons/fa";
// import moment from "moment";
// import { useSearchParams } from "react-router-dom";
// import Loader from "./Loader";
// import { toast } from "react-toastify";

// const baseURL = import.meta.env.VITE_BASE_URL;

// function TrackAWBOrder() {
//   const [loading, setLoading] = useState(false);
//   const [searchParams]= useSearchParams();
//   const [awbNumber, setAwbNumber] = useState(searchParams.get('awb_number'));
//   const [trackingHistory, setTrackingHistory] = useState([]);
//   const [error, setError] = useState("");

//   const handleSearch = async () => {
//     setLoading(true);
//     setError("");
//     setTrackingHistory([]);
//     try {
//       const res = await axios.post(`${baseURL}/api/tracking/trackawb`, {
//         awb_number: awbNumber,
//       });
//       if (res.data?.success) {
//         setTrackingHistory(res.data.tracking_history || []);
//       } else {
//         setError(res.data.message || "Tracking data not found.");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Error fetching tracking history.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(()=>{
//     if(awbNumber){
//       handleSearch();
//     }
//   },[])

//   return (
//     <div className="min-h-screen bg-white pb-10">
//       {/* Top Bar */}
//       <div className="fixed top-0 w-full h-17 bg-[#0446DB] shadow-md z-30 flex items-center px-6">
//         <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-white">
//           DAAKit GO
//         </h1>
//       </div>

//       {/* Search Bar */}
//       <form
//         className="flex flex-col items-center justify-center mt-28"
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleSearch();
//         }}
//       >
//         <div className="flex w-full max-w-md rounded-lg shadow-lg border-2 border-[#0446DB] overflow-hidden">
//           <input
//             type="text"
//             placeholder="Enter AWB Number"
//             value={awbNumber}
//             onChange={(e) => setAwbNumber(e.target.value)}
//             className="flex-grow px-4 py-2 text-sm text-black bg-white focus:outline-none"
//           />
//           <button
//             type="submit"
//             className="bg-[#0446DB] px-4 text-white hover:bg-indigo-700 transition"
//           >
//             <FaSearch />
//           </button>
//         </div>
//       </form>

//       {/* Tracking History */}
//       {loading ? <Loader/> : 
//         <div className="flex justify-center mt-6 px-4">
//           <div className="w-full max-w-2xl">
//             {loading && <p className="text-gray-500 text-center">Loading tracking history...</p>}
//             {error && <p className="text-red-500 text-center">{error}</p>}

//             {trackingHistory.length > 0 && (
//               <div className="bg-gray-50 rounded-xl shadow-md p-6">
//                 <h2 className="text-lg font-semibold text-[#0446DB] mb-4 text-center">
//                   Tracking History
//                 </h2>

//                 <div className="relative border-l-4 border-[#0446DB] pl-6">
//                   {trackingHistory.map((item, index) => {
                    
//                     return (
//                       <div key={item.id} className="mb-8 relative pl-6">
//   {/* Timeline Connector Line */}
//   <div className="absolute left-0 top-6 bottom-0 w-0.5 bg-gradient-to-b from-[#0446DB] to-gray-200"></div>
  
//   {/* Dot */}
//   <div className="absolute left-0 top-1.5 transform -translate-x-1/2">
//     <div className="relative">
//       <div className="w-4 h-4 rounded-full bg-white border-3 border-[#0446DB] shadow-lg shadow-[#0446DB]/20"></div>
//       <div className="absolute inset-0 rounded-full bg-[#0446DB] animate-ping opacity-20"></div>
//     </div>
//   </div>

//   {/* Content Card */}
//   <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 p-4 group hover:border-[#0446DB]/20">
//     {/* Status & Time */}
//     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
//       <div className="flex items-center gap-2">
//         <span className="text-sm font-bold text-gray-900 capitalize tracking-wide">
//           {item.status}
//         </span>
//         <div className="w-1 h-1 rounded-full bg-gray-400"></div>
//         <span className="text-xs font-medium text-[#0446DB] bg-[#0446DB]/10 px-2 py-1 rounded-full">
//           {moment(item.event_time).format("DD MMM YYYY")}
//         </span>
//       </div>
//       <span className="text-xs text-gray-500 font-medium">
//         {moment(item.event_time).format("hh:mm A")}
//       </span>
//     </div>

//     {/* Remarks */}
//     <p className="text-sm text-gray-700 leading-relaxed mb-3 group-hover:text-gray-900 transition-colors">
//       {item.remarks}
//     </p>

//     {/* Updated By */}
//     {/* {item.updated_by && (
//       <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
//         <div className="w-6 h-6 bg-gradient-to-br from-[#0446DB] to-[rgb(110,103,214)] rounded-full flex items-center justify-center text-white text-xs font-bold">
//           {item.updated_by.charAt(0).toUpperCase()}
//         </div>
//         <div>
//           <p className="text-xs text-gray-500 font-medium">Updated by</p>
//           <p className="text-xs text-gray-700 font-semibold">{item.updated_by}</p>
//         </div>
//       </div>
//     )} */}
//   </div>
// </div>
//                     // <div key={item.id} className="mb-8 relative">
//                     //   {/* Dot */}
//                     //   <div className="absolute -left-3 top-1.5 w-3 h-3 rounded-full bg-[#0446DB] border-2 border-white shadow-md"></div>

//                     //   <div>
//                     //     <p className="text-sm font-semibold text-gray-800 capitalize">
//                     //       {item.status}
//                     //     </p>
//                     //     <p className="text-xs text-gray-500">
//                     //       {moment(item.event_time).format("DD MMM YYYY, hh:mm A")}
//                     //     </p>
//                     //     <p className="text-sm text-gray-600 mt-1">{item.remarks}</p>
//                     //     {item.updated_by && (
//                     //       <p className="text-xs text-gray-400 mt-1">Updated by: {item.updated_by}</p>
//                     //     )}
//                     //   </div>
//                     // </div>
//                   )
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
      
//       }

//     </div>
//   );
// }

// export default TrackAWBOrder;




import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import logo from '@/assets/logo-2.png'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import {
  AlertCircle,
  ArrowRight,
  Box,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";

import Loader from "./Loader";
import AxiosInstance from "../Helper/axiosInstance";

const baseURL = import.meta.env.VITE_BASE_URL;

function TrackAWBOrder() {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const [awbNumber, setAwbNumber] = useState(
    searchParams.get("awb_number") || "",
  );

  const [trackingHistory, setTrackingHistory] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!awbNumber?.trim()) {
      toast.warning("Please enter AWB number");
      return;
    }

    setLoading(true);
    setError("");
    setTrackingHistory([]);

    try {
      const res  =  await AxiosInstance.post(`/api/tracking/trackawb`,{
        awb_number: awbNumber,
      })
      

      if (res.data?.success) {
        setTrackingHistory(res.data.tracking_history || []);
      } else {
        setError(res.data?.message || "Tracking data not found.");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Error fetching tracking history.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (awbNumber) {
      handleSearch();
    }
  }, []);

  const formatStatus = (status = "") => {
    return status
      .replaceAll("_", " ")
      .split(" ")
      .filter(Boolean)
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join(" ");
  };

  const getStatusIcon = (status = "") => {
    const value = status.toLowerCase();

    if (
      value.includes("delivered") &&
      !value.includes("undelivered")
    ) {
      return CheckCircle2;
    }

    if (
      value.includes("out for delivery") ||
      value.includes("transit")
    ) {
      return Truck;
    }

    if (
      value.includes("pickup") ||
      value.includes("picked")
    ) {
      return Box;
    }

    return Package;
  };

  const latestTracking = trackingHistory?.[0];

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-neutral-950">
      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/90">
  <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    
    {/* Logo */}
    <div className="flex items-center">
      <img
        src={logo}
        alt="DAAKit GO"
        className="h-9 w-auto object-contain sm:h-10"
      />
    </div>

    {/* Secure Tracking */}
    <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:flex dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
      <ShieldCheck size={14} />
      Secure Shipment Tracking
    </div>
    
  </div>
</header>

      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden border-b border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <div className="absolute left-1/2 top-0 h-72 w-[700px] -translate-x-1/2 rounded-full bg-blue-100/60 blur-[120px] dark:bg-blue-950/20" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="outline"
              className="mb-4 rounded-full border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-medium text-[#0446DB] dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400"
            >
              <MapPin className="mr-1.5 h-3 w-3" />
              Live Shipment Tracking
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              Track your shipment
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-neutral-400">
              Enter your AWB number to view the latest shipment status and
              complete delivery journey.
            </p>
          </div>

          {/* SEARCH */}

          <Card className="mx-auto mt-8 max-w-2xl rounded-xl border-slate-200 bg-white shadow-xl shadow-slate-200/40 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
            <CardContent className="p-3 sm:p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
                className="flex flex-col gap-2 sm:flex-row"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <Input
                    type="text"
                    value={awbNumber}
                    onChange={(e) => setAwbNumber(e.target.value)}
                    placeholder="Enter AWB number"
                    className="h-11 rounded-lg border-slate-200 bg-slate-50 pl-10 text-sm shadow-none focus-visible:border-[#0446DB] focus-visible:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 cursor-pointer rounded-lg bg-[#0446DB] px-6 font-medium text-white shadow-sm hover:bg-[#0339b5]"
                >
                  {loading ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Tracking...
                    </>
                  ) : (
                    <>
                      Track Shipment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ================= CONTENT ================= */}

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* LOADING */}

        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader />
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="mx-auto max-w-2xl">
            <Alert
              variant="destructive"
              className="rounded-xl border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20"
            >
              <AlertCircle className="h-4 w-4" />

              <AlertTitle>Unable to track shipment</AlertTitle>

              <AlertDescription className="mt-1">
                {error}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* ================= TRACKING ================= */}

        {!loading && trackingHistory.length > 0 && (
          <div className="space-y-5">
            {/* SUMMARY */}

            <Card className="overflow-hidden rounded-xl border-slate-200 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-[1fr_auto]">
                  <div className="flex items-center gap-4 p-5 sm:p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0446DB] dark:bg-blue-950/40 dark:text-blue-400">
                      <Package size={23} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                        AWB Number
                      </p>

                      <h2 className="mt-1 truncate text-lg font-bold tracking-wide text-slate-950 dark:text-white">
                        {awbNumber}
                      </h2>

                      <div className="mt-2 flex items-center gap-2">
                        <Badge className="rounded-md bg-blue-50 text-[#0446DB] shadow-none hover:bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400">
                          {formatStatus(latestTracking?.status)}
                        </Badge>

                        <span className="text-xs text-slate-400">
                          Latest update
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 md:min-w-[230px] md:border-l md:border-t-0 md:px-6 md:py-5 dark:border-neutral-800 dark:bg-neutral-950/40">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      Last updated
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-neutral-200">
                      <CalendarDays size={15} className="text-[#0446DB]" />

                      {moment(latestTracking?.event_time).format(
                        "DD MMM YYYY",
                      )}
                    </div>

                    <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
                      <Clock3 size={14} />

                      {moment(latestTracking?.event_time).format(
                        "hh:mm A",
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ================= TIMELINE ================= */}

            <Card className="rounded-xl border-slate-200 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <CardHeader className="border-b border-slate-100 px-5 py-4 sm:px-6 dark:border-neutral-800">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base font-semibold text-slate-950 dark:text-white">
                      Shipment Journey
                    </CardTitle>

                    <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">
                      Follow your package from pickup to delivery
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800">
                    <MapPin size={17} />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 sm:p-6">
                <div>
                  {trackingHistory.map((item, index) => {
                    const isLatest = index === 0;
                    const isLast =
                      index === trackingHistory.length - 1;

                    const StatusIcon = getStatusIcon(item.status);

                    return (
                      <div
                        key={item.id || index}
                        className="relative flex gap-4"
                      >
                        {/* LEFT TIMELINE */}

                        <div className="relative flex w-9 shrink-0 justify-center">
                          {!isLast && (
                            <div className="absolute bottom-0 top-9 w-px bg-slate-200 dark:bg-neutral-700" />
                          )}

                          <div
                            className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 ${
                              isLatest
                                ? "border-[#0446DB] bg-[#0446DB] text-white shadow-md shadow-blue-200"
                                : "border-slate-200 bg-white text-slate-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-500"
                            }`}
                          >
                            <StatusIcon size={15} />
                          </div>
                        </div>

                        {/* RIGHT */}

                        <div
                          className={`min-w-0 flex-1 ${
                            !isLast ? "pb-7" : ""
                          }`}
                        >
                          <div
                            className={`rounded-xl border p-4 transition-all ${
                              isLatest
                                ? "border-blue-200 bg-blue-50/40 dark:border-blue-900/60 dark:bg-blue-950/20"
                                : "border-slate-200 bg-white hover:border-slate-300 dark:border-neutral-800 dark:bg-neutral-900"
                            }`}
                          >
                            {/* STATUS HEADER */}

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-sm font-semibold text-slate-900 dark:text-neutral-100">
                                    {formatStatus(item.status)}
                                  </h3>

                                  {isLatest && (
                                    <Badge className="h-5 rounded-full bg-[#0446DB] px-2 text-[9px] font-semibold uppercase tracking-wide text-white hover:bg-[#0446DB]">
                                      Latest
                                    </Badge>
                                  )}
                                </div>

                                {item.remarks && (
                                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-neutral-400">
                                    {item.remarks}
                                  </p>
                                )}
                              </div>

                              <div className="shrink-0 sm:text-right">
                                <p className="flex items-center gap-1.5 text-xs font-medium text-slate-600 sm:justify-end dark:text-neutral-300">
                                  <CalendarDays size={13} />

                                  {moment(item.event_time).format(
                                    "DD MMM YYYY",
                                  )}
                                </p>

                                <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400 sm:justify-end">
                                  <Clock3 size={12} />

                                  {moment(item.event_time).format(
                                    "hh:mm A",
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator className="my-6" />

                <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-4 dark:bg-neutral-950/50">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#0446DB] shadow-sm dark:bg-neutral-800">
                    <ShieldCheck size={16} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-neutral-200">
                      Tracking information
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-400">
                      Shipment updates are automatically added as your order
                      progresses through the delivery network.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}

        {!loading &&
          !error &&
          trackingHistory.length === 0 &&
          !awbNumber && (
            <Card className="mx-auto max-w-xl rounded-xl border-dashed border-slate-300 bg-white shadow-none dark:border-neutral-700 dark:bg-neutral-900">
              <CardContent className="flex flex-col items-center px-6 py-14 text-center">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-neutral-800">
                    <Package size={28} />
                  </div>

                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#0446DB] text-white dark:border-neutral-900">
                    <Search size={11} />
                  </div>
                </div>

                <h3 className="mt-5 text-sm font-semibold text-slate-900 dark:text-white">
                  Track your first shipment
                </h3>

                <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500 dark:text-neutral-400">
                  Enter an AWB number above to see shipment status, delivery
                  progress and tracking history.
                </p>
              </CardContent>
            </Card>
          )}
      </main>

      {/* ================= FOOTER ================= */}

      <footer className="mt-8 border-t border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} DAAKit Technology
          </p>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck size={13} />
            Secure & reliable shipment tracking
          </div>
        </div>
      </footer>
    </div>
  );
}

export default TrackAWBOrder;
