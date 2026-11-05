
// // import { useCallback, useEffect, useState } from "react";
// // import { toast } from "react-toastify";
// // import {
// //   CalendarDays,
// //   ChevronLeft,
// //   ChevronRight,
// //   Download,
// //   FileText,
// //   Filter,
// //   Loader2,
// //   RefreshCw,
// //   Search,
// //   X,
// // } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Drawer,
// //   DrawerClose,
// //   DrawerContent,
// //   DrawerFooter,
// //   DrawerHeader,
// //   DrawerTitle,
// //   DrawerTrigger,
// // } from "@/components/ui/drawer";
// // import AxiosInstance from "../../../Helper/axiosInstance";

// // const baseURL = import.meta.env.VITE_BASE_URL;

// // const getDefaultFilters = () => {
// //   const today = new Date();
// //   const monthAgo = new Date(today);
// //   monthAgo.setMonth(monthAgo.getMonth() - 1);
// //   const toLocalDate = (date) => {
// //     const year = date.getFullYear();
// //     const month = String(date.getMonth() + 1).padStart(2, "0");
// //     const day = String(date.getDate()).padStart(2, "0");
// //     return `${year}-${month}-${day}`;
// //   };
// //   return {
// //     startDate: toLocalDate(monthAgo),
// //     endDate: toLocalDate(today),
// //     awb_number: "",
// //   };
// // };

// // const formatAmount = (amount) =>
// //   Number(amount ?? 0).toLocaleString("en-IN", {
// //     style: "currency",
// //     currency: "INR",
// //     maximumFractionDigits: 2,
// //   });

// // const formatDate = (date) => {
// //   if (!date) return "—";
// //   const parsed = new Date(date);
// //   if (Number.isNaN(parsed.getTime())) return "—";
// //   return parsed.toLocaleString("en-IN", {
// //     timeZone: "Asia/Kolkata",
// //     day: "2-digit",
// //     month: "short",
// //     year: "numeric",
// //     hour: "2-digit",
// //     minute: "2-digit",
// //     hour12: true,
// //   });
// // };

// // const inputClass =
// //   "h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white";

// // export default function VendorRemittanceRecord() {
// //   const [loading, setLoading] = useState(false);
// //   const [data, setData] = useState([]);
// //   const [page, setPage] = useState(1);
// //   const [limit, setLimit] = useState(20);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [isFilterOpen, setIsFilterOpen] = useState(false);
// //   const [isMobile, setIsMobile] = useState(() =>
// //     typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches,
// //   );

// //   useEffect(() => {
// //     const query = window.matchMedia("(max-width: 639px)");
// //     const update = (event) => setIsMobile(event.matches);
// //     setIsMobile(query.matches);
// //     query.addEventListener("change", update);
// //     return () => query.removeEventListener("change", update);
// //   }, []);
// //   const [advanceFilters, setAdvanceFilters] = useState(getDefaultFilters);
// //   const [appliedFilters, setAppliedFilters] = useState(getDefaultFilters);

// //   const fetchData = useCallback(async (signal) => {
// //     setLoading(true);
// //     try {
// //       const res = await AxiosInstance.get("api/dc/remittance/vendorSubmittedRecords", {
// //         params: {
// //           page,
// //           limit,
// //           start_date: appliedFilters.startDate,
// //           end_date: appliedFilters.endDate,
// //           awb_number: appliedFilters.awb_number,
// //         },
// //         ...(signal ? { signal } : {}),
// //       });
// //       setData(Array.isArray(res.data?.data) ? res.data.data : []);
// //       setTotalPages(Math.max(1, Number(res.data?.total_pages) || 1));
// //     } catch (err) {
// //       if (err.code !== "ERR_CANCELED" && err.name !== "CanceledError") {
// //         toast.error(err.response?.data?.message || err.message || "Failed to fetch remittance records");
// //       }
// //     } finally {
// //       if (!signal?.aborted) setLoading(false);
// //     }
// //   }, [page, limit, appliedFilters]);

// //   useEffect(() => {
// //     const controller = new AbortController();
// //     fetchData(controller.signal);
// //     return () => controller.abort();
// //   }, [fetchData]);

// //   const applyFilters = (event) => {
// //     event.preventDefault();
// //     if (advanceFilters.startDate && advanceFilters.endDate && advanceFilters.startDate > advanceFilters.endDate) {
// //       toast.error("Start date cannot be after end date");
// //       return;
// //     }
// //     setPage(1);
// //     setAppliedFilters({ ...advanceFilters });
// //     setIsFilterOpen(false);
// //   };

// //   const resetFilters = () => {
// //     const defaults = getDefaultFilters();
// //     setAdvanceFilters(defaults);
// //     setAppliedFilters(defaults);
// //     setPage(1);
// //     setIsFilterOpen(false);
// //   };

// //   const activeFilters = Number(Boolean(appliedFilters.awb_number)) +
// //     Number(appliedFilters.startDate !== getDefaultFilters().startDate || appliedFilters.endDate !== getDefaultFilters().endDate);

// //   return (
// //     <div className="flex h-[calc(100dvh-80px)] min-h-0 w-full flex-col overflow-hidden bg-[#F5F7FB] text-slate-900 dark:bg-neutral-950 dark:text-white">
// //       {/* Fixed page heading */}
// //       <header className="z-20 shrink-0 border-b border-slate-200  px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6 sm:py-5">
// //         <div className="flex flex-wrap items-center justify-between gap-3">
// //           <div className="flex min-w-0 items-center gap-3">
// //             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0446DB]/10 text-[#0446DB] dark:bg-blue-500/15 dark:text-blue-400">
// //               <FileText className="h-5 w-5" />
// //             </div>
// //             <div className="min-w-0">
// //               <h1 className="text-lg font-bold tracking-tight sm:text-2xl"> Vendor Remittance Records</h1>
// //               <p className="mt-0.5 text-xs text-slate-500 dark:text-neutral-400 sm:text-sm">
// //                 View submitted COD remittances and download supporting documents
// //               </p>
// //             </div>
// //           </div>
// //           <div className="flex shrink-0 items-center gap-2">
// //             <Button
// //               type="button"
// //               variant="outline"
// //               size="sm"
// //               disabled={loading}
// //               onClick={() => fetchData()}
// //               className="h-9 gap-2 rounded-lg border-slate-200 bg-white text-slate-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
// //             >
// //               <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
// //               <span className="hidden sm:inline">Refresh</span>
// //             </Button>

// //             <Drawer direction={isMobile ? "bottom" : "right"} open={isFilterOpen} onOpenChange={setIsFilterOpen}>
// //               <DrawerTrigger asChild>
// //                 <Button type="button" size="sm" className="h-9 gap-2 rounded-lg bg-[#0446DB] px-3 text-white hover:bg-[#0339b5]">
// //                   <Filter className="h-4 w-4" />
// //                   Filters{activeFilters > 0 ? ` (${activeFilters})` : ""}
// //                 </Button>
// //               </DrawerTrigger>
// //               <DrawerContent className="!fixed !inset-x-0 !bottom-0 !top-auto !mt-0 flex !h-auto !max-h-[92dvh] !w-full !max-w-none flex-col !rounded-t-2xl !rounded-b-none border-t bg-white dark:border-neutral-800 dark:bg-neutral-900 sm:!inset-x-auto sm:!bottom-0 sm:!right-0 sm:!top-0 sm:!h-dvh sm:!max-h-dvh sm:!w-[420px] sm:!rounded-none sm:!border-l sm:!border-t-0">
// //                 <DrawerHeader className="shrink-0 border-b border-slate-100 px-5 py-4 text-left dark:border-neutral-800">
// //                   <div className="flex items-center justify-between gap-3">
// //                     <div>
// //                       <DrawerTitle className="text-lg font-bold">Advanced Filters</DrawerTitle>
// //                       <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">Narrow results by date range or AWB number.</p>
// //                     </div>
// //                     <DrawerClose asChild>
// //                       <button type="button" aria-label="Close filters" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-neutral-800">
// //                         <X className="h-5 w-5" />
// //                       </button>
// //                     </DrawerClose>
// //                   </div>
// //                 </DrawerHeader>
// //                 <form id="remittance-filter-form" onSubmit={applyFilters} className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
// //                   <div className="grid gap-4 sm:grid-cols-2">
// //                     <label className="block">
// //                       <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-neutral-300">Start Date</span>
// //                       <input type="date"
// //                        onClick={(e) => {
// //                         try {
// //                           e.currentTarget.showPicker?.();
// //                         } catch (error) {
// //                           // Browser's native date picker fallback
// //                         }
// //                       }}
// //                       value={advanceFilters.startDate} max={advanceFilters.endDate || undefined} onChange={(e) => setAdvanceFilters((prev) => ({ ...prev, startDate: e.target.value }))} className={inputClass} />
// //                     </label>
// //                     <label className="block">
// //                       <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-neutral-300">End Date</span>
// //                       <input type="date"
// //                        onClick={(e) => {
// //                             try {
// //                               e.currentTarget.showPicker?.();
// //                             } catch (error) {
// //                               // Browser's native date picker fallback
// //                             }
// //                           }}
// //                       value={advanceFilters.endDate} min={advanceFilters.startDate || undefined} onChange={(e) => setAdvanceFilters((prev) => ({ ...prev, endDate: e.target.value }))} className={inputClass} />
// //                     </label>
// //                   </div>
// //                   <label className="block">
// //                     <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-neutral-300">AWB Number</span>
// //                     <div className="relative">
// //                       <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
// //                       <input type="text" value={advanceFilters.awb_number} onChange={(e) => setAdvanceFilters((prev) => ({ ...prev, awb_number: e.target.value }))} placeholder="Search AWB number" className={`${inputClass} pl-9`} />
// //                     </div>
// //                   </label>
// //                 </form>
// //                 <DrawerFooter className="shrink-0 flex-row gap-2 border-t border-slate-100 px-5 py-4 dark:border-neutral-800">
// //                   <Button type="button" variant="outline" className="h-10 flex-1 rounded-lg" onClick={resetFilters}>Reset</Button>
// //                   <Button type="submit" form="remittance-filter-form" className="h-10 flex-1 rounded-lg bg-[#0446DB] text-white hover:bg-[#0339b5]">Apply Filters</Button>
// //                 </DrawerFooter>
// //               </DrawerContent>
// //             </Drawer>
// //           </div>
// //         </div>
// //       </header>

// //       {/* Fixed table toolbar */}
// //       <section className="flex min-h-0 flex-1 flex-col overflow-hidden ">
// //         <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-sm border border-b-0 border-slate-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:px-5">
// //           <div>
// //             <h2 className="text-sm font-semibold sm:text-base">Submitted Remittances</h2>
// //             <p className="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">{data.length} records on this page</p>
// //           </div>
// //           <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
// //             <CalendarDays className="h-3.5 w-3.5" />
// //             <span>{appliedFilters.startDate || "Any"} to {appliedFilters.endDate || "Any"}</span>
// //           </div>
// //         </div>

// //         {/* Only this region scrolls; sticky column headings stay visible */}
// //         <div className="min-h-0 flex-1 overflow-auto overscroll-contain border-x border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
// //           <table className="w-full min-w-[780px] border-separate border-spacing-0 text-left text-sm">
// //             <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-neutral-800">
// //               <tr>
// //                 {["AWB Number", "Amount", "UTR Number", "Upload Date", "Document"].map((heading) => (
// //                   <th key={heading} scope="col" className="whitespace-nowrap border-b border-slate-200 bg-slate-50 px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
// //                     {heading}
// //                   </th>
// //                 ))}
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
// //               {loading ? (
// //                 <tr><td colSpan={5} className="px-5 py-20 text-center">
// //                   <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#0446DB]" />
// //                   <p className="mt-3 text-sm text-slate-500">Loading remittance records...</p>
// //                 </td></tr>
// //               ) : data.length === 0 ? (
// //                 <tr><td colSpan={5} className="px-5 py-20 text-center">
// //                   <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-neutral-800"><FileText className="h-6 w-6" /></div>
// //                   <p className="mt-3 text-sm font-semibold">No records found</p>
// //                   <p className="mt-1 text-xs text-slate-500">Try changing the date range or AWB filter.</p>
// //                 </td></tr>
// //               ) : data.map((record, index) => (
// //                 <tr key={record.id ?? `${record.awb_number}-${record.utr_number}-${index}`} className="transition-colors hover:bg-blue-50/40 dark:hover:bg-neutral-800/50">
// //                   <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#0446DB] dark:text-blue-400">{record.awb_number || "—"}</td>
// //                   <td className="whitespace-nowrap px-5 py-4 font-semibold tabular-nums text-slate-800 dark:text-neutral-100">{formatAmount(record.amount)}</td>
// //                   <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-700 dark:text-neutral-200">{record.utr_number || "—"}</td>
// //                   <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-600 dark:text-neutral-300">{formatDate(record.created_at)}</td>
// //                   <td className="whitespace-nowrap px-5 py-4">
// //                     {record.file_url ? (
// //                       <a href={`${baseURL}/${String(record.file_url).replace(/^\/+/, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[#0446DB]/20 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0446DB] transition hover:border-[#0446DB]/50 hover:bg-blue-100 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20">
// //                         <Download className="h-3.5 w-3.5" /> Download
// //                       </a>
// //                     ) : <span className="text-xs text-slate-400">Not available</span>}
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* Fixed bottom pagination */}
// //         <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-b-xl border border-slate-200 bg-white px-3 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:px-5">
// //           <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400">
// //             <span className="hidden sm:inline">Rows per page</span>
// //             <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} aria-label="Rows per page" className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
// //               {[10, 20, 50, 100].map((count) => <option key={count} value={count}>{count}</option>)}
// //             </select>
// //           </div>
// //           <nav aria-label="Remittance pagination" className="flex items-center gap-2">
// //             <Button type="button" variant="outline" size="sm" disabled={page === 1 || loading} onClick={() => setPage((prev) => Math.max(prev - 1, 1))} className="h-9 rounded-lg border-slate-200 px-2.5 dark:border-neutral-700 sm:px-3">
// //               <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Previous</span>
// //             </Button>
// //             <span className="min-w-[84px] text-center text-xs font-medium tabular-nums text-slate-600 dark:text-neutral-300">Page {page} / {totalPages}</span>
// //             <Button type="button" variant="outline" size="sm" disabled={page >= totalPages || loading} onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} className="h-9 rounded-lg border-slate-200 px-2.5 dark:border-neutral-700 sm:px-3">
// //               <span className="hidden sm:inline">Next</span> <ChevronRight className="h-4 w-4" />
// //             </Button>
// //           </nav>
// //         </footer>
// //       </section>
// //       <div className="h-3 shrink-0 sm:h-5" />
// //     </div>
// //   );
// // }





// import { useCallback, useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import {
//   CalendarDays,
//   ChevronLeft,
//   ChevronRight,
//   Download,
//   FileText,
//   Filter,
//   Loader2,
//   RefreshCw,
//   Search,
//   X,
//   HandCoins,
//   CircleCheck,
//   Clock3,
//   ArrowRightLeft,
//   Building2,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
// import AxiosInstance from "../../../Helper/axiosInstance";

// const baseURL = import.meta.env.VITE_BASE_URL;

// const getDefaultFilters = () => {
//   const today = new Date();
//   const monthAgo = new Date(today);
//   monthAgo.setMonth(monthAgo.getMonth() - 1);
//   const toLocalDate = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };
//   return {
//     startDate: toLocalDate(monthAgo),
//     endDate: toLocalDate(today),
//     awb_number: "",
//     vendor_id:""
//   };
// };

// const formatAmount = (amount) =>
//   Number(amount ?? 0).toLocaleString("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 2,
//   });

// const formatDate = (date) => {
//   if (!date) return "—";
//   const parsed = new Date(date);
//   if (Number.isNaN(parsed.getTime())) return "—";
//   return parsed.toLocaleString("en-IN", {
//     timeZone: "Asia/Kolkata",
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });
// };

// const inputClass =
//   "h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white";

// export default function VendorRemittanceRecord() {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState([]);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(20);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [vendorCodSummary, setVendorCodSummary] = useState([]);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [vendorList,setVendorList]=useState([])
//   const [isMobile, setIsMobile] = useState(() =>
//     typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches,
//   );

//   useEffect(() => {
//     const query = window.matchMedia("(max-width: 639px)");
//     const update = (event) => setIsMobile(event.matches);
//     setIsMobile(query.matches);
//     query.addEventListener("change", update);
//     return () => query.removeEventListener("change", update);
//   }, []);
//   const [advanceFilters, setAdvanceFilters] = useState(getDefaultFilters);
//   const [appliedFilters, setAppliedFilters] = useState(getDefaultFilters);
//   const getVendots = async()=>{
//     try {
//          const {data} = await AxiosInstance.get(`/api/dc/vendors`)
//          setVendorList(data?.data)
//     } catch (error) {
        
//     }
//   }

//   const fetchData = useCallback(async (signal) => {
//     setLoading(true);
//     try {
//       const res = await AxiosInstance.get("/api/dc/remittance/vendorSubmittedRecords", {
//         params: {
//           page,
//           limit,
//           start_date: appliedFilters.startDate,
//           end_date: appliedFilters.endDate,
//           awb_number: appliedFilters.awb_number,
//           vendor_id: appliedFilters.vendor_id,
//         },
//         ...(signal ? { signal } : {}),
//       });
//       const result = res.data || {};
//       setData(Array.isArray(result.data) ? result.data : []);
//       setVendorCodSummary(Array.isArray(result.vendorCodSummary) ? result.vendorCodSummary : []);
//       setTotalRecords(Number(result.totalRecords) || 0);
//       setTotalPages(Number(result.totalPages) || 0);
//     } catch (err) {
//       if (!signal?.aborted) {
//         setData([]);
//         setVendorCodSummary([]);
//         setTotalRecords(0);
//         setTotalPages(0);
//       }
//       if (err.code !== "ERR_CANCELED" && err.name !== "CanceledError") {
//         toast.error(err.response?.data?.message || err.message || "Failed to fetch remittance records");
//       }
//     } finally {
//       if (!signal?.aborted) setLoading(false);
//     }
//   }, [page, limit, appliedFilters]);

//   useEffect(() => {
//     const controller = new AbortController();
//     fetchData(controller.signal);
//     return () => controller.abort();
//   }, [fetchData]);

//   const applyFilters = (event) => {
//     event.preventDefault();
//     if (advanceFilters.startDate && advanceFilters.endDate && advanceFilters.startDate > advanceFilters.endDate) {
//       toast.error("Start date cannot be after end date");
//       return;
//     }
//     setPage(1);
//     setAppliedFilters({ ...advanceFilters });
//     setIsFilterOpen(false);
//   };

//   const resetFilters = () => {
//     const defaults = getDefaultFilters();
//     setAdvanceFilters(defaults);
//     setAppliedFilters(defaults);
//     setPage(1);
//     setIsFilterOpen(false);
//   };

//   useEffect(()=>{
//     getVendots()
//   },[])

//   const summary = vendorCodSummary.reduce((acc, vendor) => {
//     for (const key of ["total", "pending", "initiated", "adjusted", "received"]) {
//       acc[key].count += Number(vendor[key]?.count || 0);
//       acc[key].amount += Number(vendor[key]?.amount || 0);
//     }
//     return acc;
//   }, Object.fromEntries(["total", "pending", "initiated", "adjusted", "received"].map((key) => [key, { count: 0, amount: 0 }])));

//   const summaryCards = [
//     { key: "total", title: "Total COD", icon: HandCoins, iconClass: "text-[#0446DB] bg-blue-50 dark:bg-blue-500/15" },
//     { key: "pending", title: "Pending", icon: Clock3, iconClass: "text-amber-600 bg-amber-50 dark:bg-amber-500/15" },
//     { key: "initiated", title: "Initiated", icon: ArrowRightLeft, iconClass: "text-violet-600 bg-violet-50 dark:bg-violet-500/15" },
//     { key: "adjusted", title: "Adjusted", icon: FileText, iconClass: "text-orange-600 bg-orange-50 dark:bg-orange-500/15" },
//     { key: "received", title: "Received", icon: CircleCheck, iconClass: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/15" },
//   ];

//   const activeFilters = Number(Boolean(appliedFilters.awb_number)) +
//     Number(appliedFilters.startDate !== getDefaultFilters().startDate || appliedFilters.endDate !== getDefaultFilters().endDate);

//   return (
//     <div className="flex h-[calc(100dvh-80px)] min-h-0 w-full flex-col overflow-hidden bg-[#F5F7FB] text-slate-900 dark:bg-neutral-950 dark:text-white">
//       {/* Fixed page heading */}
//       <header className="z-20 shrink-0 border-b border-slate-200 px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6 sm:py-5">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <div className="flex min-w-0 items-center gap-3">
//             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0446DB]/10 text-[#0446DB] dark:bg-blue-500/15 dark:text-blue-400">
//               <FileText className="h-5 w-5" />
//             </div>
//             <div className="min-w-0">
//               <h1 className="text-lg font-bold tracking-tight sm:text-2xl">Vendor Remittance Records</h1>
//               <p className="mt-0.5 text-xs text-slate-500 dark:text-neutral-400 sm:text-sm">
//                 Track vendor COD dues, submissions and settlement status
//               </p>
//             </div>
//           </div>
//           <div className="flex shrink-0 items-center gap-2">
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               disabled={loading}
//               onClick={() => fetchData()}
//               className="h-9 gap-2 rounded-lg border-slate-200 bg-white text-slate-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
//             >
//               <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
//               <span className="hidden sm:inline">Refresh</span>
//             </Button>

//             <Drawer direction={isMobile ? "bottom" : "right"} open={isFilterOpen} onOpenChange={setIsFilterOpen}>
//               <DrawerTrigger asChild>
//                 <Button type="button" size="sm" className="h-9 gap-2 rounded-lg bg-[#0446DB] px-3 text-white hover:bg-[#0339b5]">
//                   <Filter className="h-4 w-4" />
//                   Filters{activeFilters > 0 ? ` (${activeFilters})` : ""}
//                 </Button>
//               </DrawerTrigger>
//               <DrawerContent className="!fixed !inset-x-0 !bottom-0 !top-auto !mt-0 flex !h-auto !max-h-[92dvh] !w-full !max-w-none flex-col !rounded-t-2xl !rounded-b-none border-t bg-white dark:border-neutral-800 dark:bg-neutral-900 sm:!inset-x-auto sm:!bottom-0 sm:!right-0 sm:!top-0 sm:!h-dvh sm:!max-h-dvh sm:!w-[420px] sm:!rounded-none sm:!border-l sm:!border-t-0">
//                 <DrawerHeader className="shrink-0 border-b border-slate-100 px-5 py-4 text-left dark:border-neutral-800">
//                   <div className="flex items-center justify-between gap-3">
//                     <div>
//                       <DrawerTitle className="text-lg font-bold">Advanced Filters</DrawerTitle>
//                       <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">Narrow results by date range or AWB number.</p>
//                     </div>
//                     <DrawerClose asChild>
//                       <button type="button" aria-label="Close filters" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-neutral-800">
//                         <X className="h-5 w-5" />
//                       </button>
//                     </DrawerClose>
//                   </div>
//                 </DrawerHeader>
//                 <form id="remittance-filter-form" onSubmit={applyFilters} className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
//                   <div className="grid gap-4 sm:grid-cols-2">
//                     <label className="block">
//                       <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-neutral-300">Start Date</span>
//                       <input type="date" value={advanceFilters.startDate} max={advanceFilters.endDate || undefined} onChange={(e) => setAdvanceFilters((prev) => ({ ...prev, startDate: e.target.value }))} className={inputClass} />
//                     </label>
//                     <label className="block">
//                       <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-neutral-300">End Date</span>
//                       <input type="date" value={advanceFilters.endDate} min={advanceFilters.startDate || undefined} onChange={(e) => setAdvanceFilters((prev) => ({ ...prev, endDate: e.target.value }))} className={inputClass} />
//                     </label>
//                   </div>
//                   <label className="block">
//                     <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-neutral-300">AWB Number</span>
//                     <div className="relative">
//                       <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//                       <input type="text" value={advanceFilters.awb_number} onChange={(e) => setAdvanceFilters((prev) => ({ ...prev, awb_number: e.target.value }))} placeholder="Search AWB number" className={`${inputClass} pl-9`} />
//                     </div>
//                   </label>
//                   <label className="block">
//                     <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-neutral-300">Fleet</span>
//                     <div className="relative">
                      
//                       <select name="" id=""
//                       value={advanceFilters.vendor_id}
//                       onChange={(e) => setAdvanceFilters((prev) => ({ ...prev, vendor_id: e.target.value }))}
//                       className={`${inputClass} `} 
//                       >
//                         <option value="">Select Vendor</option>
//                         {
//                             vendorList?.map((v)=>{
                                
//                                 return (
//                                      <option value={v?.vendor_id}>{v?.vendor_id}:{v?.vendor_name}</option>
//                                 )
//                             })
//                         }
//                       </select>
//                     </div>
//                   </label>
//                 </form>
//                 <DrawerFooter className="shrink-0 flex-row gap-2 border-t border-slate-100 px-5 py-4 dark:border-neutral-800">
//                   <Button type="button" variant="outline" className="h-10 flex-1 rounded-lg" onClick={resetFilters}>Reset</Button>
//                   <Button type="submit" form="remittance-filter-form" className="h-10 flex-1 rounded-lg bg-[#0446DB] text-white hover:bg-[#0339b5]">Apply Filters</Button>
//                 </DrawerFooter>
//               </DrawerContent>
//             </Drawer>
//           </div>
//         </div>
//       </header>

//       {/* Vendor COD totals: independent of submitted records */}
//       <div className="shrink-0 border-b border-slate-200 bg-[#F5F7FB] px-3 py-3 dark:border-neutral-800 dark:bg-neutral-950 sm:px-6">
//         <div className="mb-2 flex items-center justify-between gap-2">
//           <div className="flex items-center gap-2 text-sm font-semibold">
//             <Building2 className="h-4 w-4 text-[#0446DB]" /> Vendor COD Overview
//           </div>
//           <span className="text-xs text-slate-500">{vendorCodSummary.length} vendor{vendorCodSummary.length === 1 ? "" : "s"}</span>
//         </div>
//         <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
//           {summaryCards.map(({ key, title, icon: Icon, iconClass }) => (
//             <div key={key} className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:px-4">
//               <div className="flex items-center justify-between gap-1">
//                 <span className="truncate text-[11px] font-semibold text-slate-500 dark:text-neutral-400">{title}</span>
//                 <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${iconClass}`}><Icon className="h-4 w-4" /></span>
//               </div>
//               <div className="mt-1 truncate text-base font-bold tabular-nums text-slate-900 dark:text-white sm:text-lg">{formatAmount(summary[key].amount)}</div>
//               <div className="mt-0.5 text-[11px] text-slate-500">{summary[key].count} order{summary[key].count === 1 ? "" : "s"}</div>
//             </div>
//           ))}
//         </div>
        
//       </div>

//       {/* Fixed table toolbar */}
//       <section className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pt-3 sm:px-6 sm:pt-5">
//         <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-t-xl border border-b-0 border-slate-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:px-5">
//           <div>
//             <h2 className="text-sm font-semibold sm:text-base">Submitted Remittances</h2>
//             <p className="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">{data.length} on this page · {totalRecords} total submissions</p>
//           </div>
//           <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
//             <CalendarDays className="h-3.5 w-3.5" />
//             <span>{appliedFilters.startDate || "Any"} to {appliedFilters.endDate || "Any"}</span>
//           </div>
//         </div>

//         {/* Only this region scrolls; sticky column headings stay visible */}
//         <div className="min-h-0 flex-1 overflow-auto overscroll-contain border-x border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
//           <table className="w-full min-w-[1160px] border-separate border-spacing-0 text-left text-sm">
//             <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-neutral-800">
//               <tr>
//                 {["Vendor", "AWB Numbers", "Submitted Amount", "Records", "UTR Number", "Upload Date", "COD Breakdown", "Document"].map((heading) => (
//                   <th key={heading} scope="col" className="whitespace-nowrap border-b border-slate-200 bg-slate-50 px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
//                     {heading}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
//               {loading ? (
//                 <tr><td colSpan={8} className="px-5 py-20 text-center">
//                   <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#0446DB]" />
//                   <p className="mt-3 text-sm text-slate-500">Loading remittance records...</p>
//                 </td></tr>
//               ) : data.length === 0 ? (
//                 <tr><td colSpan={8} className="px-5 py-20 text-center">
//                   <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-neutral-800"><FileText className="h-6 w-6" /></div>
//                   <p className="mt-3 text-sm font-semibold">No vendor submissions found</p>
//                   <p className="mt-1 text-xs text-slate-500">COD totals above can still exist even when no vendor submission is recorded.</p>
//                 </td></tr>
//               ) : data.map((record, index) => (
//                 <tr key={`${record.vendor_id}-${record.utr_number || record.id}-${index}`} className="transition-colors hover:bg-blue-50/40 dark:hover:bg-neutral-800/50">
//                   <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900 dark:text-white">{record.vendor_name || `Vendor #${record.vendor_id}`}</td>
//                   <td className="px-5 py-4 text-xs text-[#0446DB] dark:text-blue-400">
//                     <div className="max-w-[240px] break-words">{Array.isArray(record.awb_numbers) && record.awb_numbers.length ? record.awb_numbers.join(", ") : "—"}</div>
//                   </td>
//                   <td className="whitespace-nowrap px-5 py-4 font-semibold tabular-nums">{formatAmount(record.submitted_amount)}</td>
//                   <td className="whitespace-nowrap px-5 py-4">{record.submitted_record_count ?? 0}</td>
//                   <td className="whitespace-nowrap px-5 py-4 font-medium">{record.utr_number || "—"}</td>
//                   <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-600 dark:text-neutral-300">{formatDate(record.created_at)}</td>
//                   <td className="px-5 py-4 text-xs text-slate-600 dark:text-neutral-300">
//                     <div className="whitespace-nowrap">Pending: {record.pending_count ?? 0} ({formatAmount(record.pending_amount)})</div>
//                     <div className="whitespace-nowrap">Received: {record.received_count ?? 0} ({formatAmount(record.received_amount)})</div>
//                   </td>
//                   <td className="whitespace-nowrap px-5 py-4">
//                     {record.file_url ? (
//                       <a href={/^https?:\/\//i.test(record.file_url) ? record.file_url : `${baseURL}/${String(record.file_url).replace(/^\/+/, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[#0446DB]/20 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0446DB] transition hover:bg-blue-100 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-400">
//                         <Download className="h-3.5 w-3.5" /> Download
//                       </a>
//                     ) : <span className="text-xs text-slate-400">Not available</span>}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Fixed bottom pagination */}
//         <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-b-xl border border-slate-200 bg-white px-3 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:px-5">
//           <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400">
//             <span className="hidden sm:inline">Rows per page</span>
//             <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} aria-label="Rows per page" className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
//               {[10, 20, 50, 100].map((count) => <option key={count} value={count}>{count}</option>)}
//             </select>
//           </div>
//           <nav aria-label="Remittance pagination" className="flex items-center gap-2">
//             <Button type="button" variant="outline" size="sm" disabled={page <= 1 || loading || totalPages === 0} onClick={() => setPage((prev) => Math.max(prev - 1, 1))} className="h-9 rounded-lg border-slate-200 px-2.5 dark:border-neutral-700 sm:px-3">
//               <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Previous</span>
//             </Button>
//             <span className="min-w-[84px] text-center text-xs font-medium tabular-nums text-slate-600 dark:text-neutral-300">Page {page} / {Math.max(1, totalPages)}</span>
//             <Button type="button" variant="outline" size="sm" disabled={page >= totalPages || loading || totalPages === 0} onClick={() => setPage((prev) => Math.min(prev + 1, Math.max(1, totalPages)))} className="h-9 rounded-lg border-slate-200 px-2.5 dark:border-neutral-700 sm:px-3">
//               <span className="hidden sm:inline">Next</span> <ChevronRight className="h-4 w-4" />
//             </Button>
//           </nav>
//         </footer>
//       </section>
//       <div className="h-3 shrink-0 sm:h-5" />
//     </div>
//   );
// }

import { Fragment, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  X,
  HandCoins,
  CircleCheck,
  Clock3,
  ArrowRightLeft,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import AxiosInstance from "../../../Helper/axiosInstance";

const baseURL = import.meta.env.VITE_BASE_URL;

const getDefaultFilters = () => {
  const today = new Date();
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const toLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  return {
    startDate: toLocalDate(monthAgo),
    endDate: toLocalDate(today),
    awb_number: "",
    vendor_id: "",
  };
};

const formatAmount = (amount) =>
  Number(amount ?? 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

const formatDate = (date) => {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white";

export default function VendorRemittanceRecord() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [expandedAwbs, setExpandedAwbs] = useState({});
  const toggleAwbs = (key) => setExpandedAwbs((prev) => ({ ...prev, [key]: !prev[key] }));
  const [vendorList, setVendorList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [vendorCodSummary, setVendorCodSummary] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const update = (event) => setIsMobile(event.matches);
    setIsMobile(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const [advanceFilters, setAdvanceFilters] = useState(getDefaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(getDefaultFilters);

  useEffect(() => {
    let active = true;
    AxiosInstance.get("/api/dc/vendors")
      .then(({ data: response }) => {
        if (active) setVendorList(Array.isArray(response?.data) ? response.data : []);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const fetchData = useCallback(async (signal) => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get("/api/dc/remittance/vendorSubmittedRecords", {
        params: {
          page,
          limit,
          start_date: appliedFilters.startDate,
          end_date: appliedFilters.endDate,
          awb_number: appliedFilters.awb_number,
          vendor_id: appliedFilters.vendor_id,
        },
        ...(signal ? { signal } : {}),
      });
      const result = res.data || {};
      setData(Array.isArray(result.data) ? result.data : []);
      setVendorCodSummary(Array.isArray(result.vendorCodSummary) ? result.vendorCodSummary : []);
      setTotalRecords(Number(result.totalRecords) || 0);
      setTotalPages(Number(result.totalPages) || 0);
    } catch (err) {
      if (!signal?.aborted) {
        setData([]);
        setVendorCodSummary([]);
        setTotalRecords(0);
        setTotalPages(0);
      }
      if (err.code !== "ERR_CANCELED" && err.name !== "CanceledError") {
        toast.error(err.response?.data?.message || err.message || "Failed to fetch remittance records");
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [page, limit, appliedFilters]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);

  const applyFilters = (event) => {
    event.preventDefault();
    if (advanceFilters.startDate && advanceFilters.endDate && advanceFilters.startDate > advanceFilters.endDate) {
      toast.error("Start date cannot be after end date");
      return;
    }
    setPage(1);
    setAppliedFilters({ ...advanceFilters });
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    const defaults = getDefaultFilters();
    setAdvanceFilters(defaults);
    setAppliedFilters(defaults);
    setPage(1);
    setIsFilterOpen(false);
  };

  const summary = vendorCodSummary.reduce((acc, vendor) => {
    for (const key of ["total", "pending", "initiated", "adjusted", "received"]) {
      acc[key].count += Number(vendor[key]?.count || 0);
      acc[key].amount += Number(vendor[key]?.amount || 0);
    }
    return acc;
  }, Object.fromEntries(["total", "pending", "initiated", "adjusted", "received"].map((key) => [key, { count: 0, amount: 0 }])));

  const summaryCards = [
    { key: "total", title: "Total COD", icon: HandCoins, iconClass: "text-[#0446DB] bg-blue-50 dark:bg-blue-500/15" },
    { key: "pending", title: "Pending", icon: Clock3, iconClass: "text-amber-600 bg-amber-50 dark:bg-amber-500/15" },
    { key: "initiated", title: "Initiated", icon: ArrowRightLeft, iconClass: "text-violet-600 bg-violet-50 dark:bg-violet-500/15" },
    { key: "adjusted", title: "Adjusted", icon: FileText, iconClass: "text-orange-600 bg-orange-50 dark:bg-orange-500/15" },
    { key: "received", title: "Received", icon: CircleCheck, iconClass: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/15" },
  ];

  const activeFilters = Number(Boolean(appliedFilters.vendor_id)) + Number(Boolean(appliedFilters.awb_number)) +
    Number(appliedFilters.startDate !== getDefaultFilters().startDate || appliedFilters.endDate !== getDefaultFilters().endDate);
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingPage(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
    {
      loadingPage ? (
         <div className=" w-full h-[90vh] flex justify-center items-center">
          <div>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />

            <p className="mt-2">Loading Remittance Records...</p>
          </div>
        </div>
      ):(
        
    <div className="flex h-[calc(100dvh-80px)] min-h-0 w-full flex-col overflow-hidden bg-[#F5F7FB] text-slate-900 dark:bg-neutral-950 dark:text-white">
      {/* Fixed page heading */}
      <header className="z-20 shrink-0 border-b border-slate-200  px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6 sm:py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0446DB]/10 text-[#0446DB] dark:bg-blue-500/15 dark:text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold tracking-tight sm:text-2xl">Vendor Remittance Records</h1>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-neutral-400 sm:text-sm">
                Track vendor COD dues, submissions and settlement status
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => fetchData()}
              className="h-9 gap-2 rounded-lg border-slate-200 bg-white text-slate-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Drawer direction={isMobile ? "bottom" : "right"} open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DrawerTrigger asChild>
                <Button type="button" size="sm" className="h-9 gap-2 rounded-lg bg-[#0446DB] px-3 text-white hover:bg-[#0339b5]">
                  <Filter className="h-4 w-4" />
                  Filters{activeFilters > 0 ? ` (${activeFilters})` : ""}
                </Button>
              </DrawerTrigger>
              <DrawerContent className="!fixed !inset-x-0 !bottom-0 !top-auto !mt-0 flex !h-auto !max-h-[92dvh] !w-full !max-w-none flex-col !rounded-t-2xl !rounded-b-none border-t bg-white dark:border-neutral-800 dark:bg-neutral-900 sm:!inset-x-auto sm:!bottom-0 sm:!right-0 sm:!top-0 sm:!h-dvh sm:!max-h-dvh sm:!w-[420px] sm:!rounded-none sm:!border-l sm:!border-t-0">
                <DrawerHeader className="shrink-0 border-b border-slate-100 px-5 py-4 text-left dark:border-neutral-800">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <DrawerTitle className="text-lg font-bold">Advanced Filters</DrawerTitle>
                      <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">Narrow results by date range or AWB number.</p>
                    </div>
                    <DrawerClose asChild>
                      <button type="button" aria-label="Close filters" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-neutral-800">
                        <X className="h-5 w-5" />
                      </button>
                    </DrawerClose>
                  </div>
                </DrawerHeader>
                <form id="remittance-filter-form" onSubmit={applyFilters} className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-neutral-300">Start Date</span>
                      <input type="date" value={advanceFilters.startDate} max={advanceFilters.endDate || undefined} onChange={(e) => setAdvanceFilters((prev) => ({ ...prev, startDate: e.target.value }))} className={inputClass} />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-neutral-300">End Date</span>
                      <input type="date" value={advanceFilters.endDate} min={advanceFilters.startDate || undefined} onChange={(e) => setAdvanceFilters((prev) => ({ ...prev, endDate: e.target.value }))} className={inputClass} />
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-neutral-300">AWB Number</span>
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input type="text" value={advanceFilters.awb_number} onChange={(e) => setAdvanceFilters((prev) => ({ ...prev, awb_number: e.target.value }))} placeholder="Search AWB number" className={`${inputClass} pl-9`} />
                    </div>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-neutral-300">Fleet</span>
                    <select
                      value={advanceFilters.vendor_id}
                      onChange={(event) => setAdvanceFilters((prev) => ({ ...prev, vendor_id: event.target.value }))}
                      className={inputClass}
                    >
                      <option value="">All Vendors</option>
                      {vendorList.map((vendor) => (
                        <option key={vendor.vendor_id ?? vendor.id} value={vendor.vendor_id ?? vendor.id}>
                          {vendor.vendor_name ?? vendor.name ?? `Vendor #${vendor.vendor_id ?? vendor.id}`}
                        </option>
                      ))}
                    </select>
                  </label>
                </form>
                <DrawerFooter className="shrink-0 flex-row gap-2 border-t border-slate-100 px-5 py-4 dark:border-neutral-800">
                  <Button type="button" variant="outline" className="h-10 flex-1 rounded-lg" onClick={resetFilters}>Reset</Button>
                  <Button type="submit" form="remittance-filter-form" className="h-10 flex-1 rounded-lg bg-[#0446DB] text-white hover:bg-[#0339b5]">Apply Filters</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </header>

      {/* Compact overview: preserve key numbers without consuming table height */}
      <section className="shrink-0 border-b border-slate-200 bg-white  py-2 dark:border-neutral-800 dark:bg-neutral-900 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="hidden shrink-0 items-center gap-2 border-r border-slate-200 pr-3 text-xs font-semibold text-slate-600 dark:border-neutral-700 dark:text-neutral-300 lg:flex">
            <Building2 className="h-4 w-4 text-[#0446DB]" />
            COD Overview
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] dark:bg-neutral-800">{vendorCodSummary.length}</span>
          </div>
          <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto overscroll-x-contain pb-0.5">
            {summaryCards.map(({ key, title, icon: Icon, iconClass }) => (
              <div
                key={key}
                className="flex min-w-[158px] flex-1 shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-[#F8FAFD] px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 sm:min-w-[170px]"
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${iconClass}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-slate-500 dark:text-neutral-400">{title} · {summary[key].count}</p>
                  <p className="truncate text-sm font-bold tabular-nums text-slate-900 dark:text-white">{formatAmount(summary[key].amount)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fixed table toolbar */}
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden  pt-2  sm:pt-3">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-t-xl border border-b-0 border-slate-200 bg-white px-4 py-2 dark:border-neutral-800 dark:bg-neutral-900 sm:px-5">
          <div>
            <h2 className="text-sm font-semibold sm:text-base">Submitted Remittances</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">{data.length} on this page · {totalRecords} total submissions</p>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{appliedFilters.startDate || "Any"} to {appliedFilters.endDate || "Any"}</span>
          </div>
        </div>

        {/* Only this region scrolls; sticky column headings stay visible */}
        <div className="min-h-0 flex-1 overflow-auto overscroll-contain border-x border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <table className="w-full min-w-[1160px] border-separate border-spacing-0 text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-neutral-800">
              <tr>
                {["Vendor", "AWB Numbers", "Submitted Amount", "Records", "UTR Number", "Upload Date", "COD Breakdown", "Document"].map((heading) => (
                  <th key={heading} scope="col" className="whitespace-nowrap border-b border-slate-200 bg-slate-50 px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {loading ? (
                <tr><td colSpan={8} className="px-5 py-20 text-center">
                  <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#0446DB]" />
                  <p className="mt-3 text-sm text-slate-500">Loading remittance records...</p>
                </td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-20 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-neutral-800"><FileText className="h-6 w-6" /></div>
                  <p className="mt-3 text-sm font-semibold">No vendor submissions found</p>
                  <p className="mt-1 text-xs text-slate-500">COD totals above can still exist even when no vendor submission is recorded.</p>
                </td></tr>
              ) : data.map((record, index) => {
                  const rowKey = `${record.vendor_id}-${record.utr_number || record.id}-${index}`;
                  const awbs = Array.isArray(record.awb_numbers)
                    ? record.awb_numbers.filter(Boolean)
                    : String(record.awb_numbers_csv || record.awb_number || "")
                        .split(",")
                        .map((awb) => awb.trim())
                        .filter(Boolean);
                  const isExpanded = Boolean(expandedAwbs[rowKey]);
                  const remainingCount = Math.max(0, awbs.length - 2);
                  return (
                    <Fragment key={rowKey}>
                      <tr className="hover:bg-blue-50/40 dark:hover:bg-neutral-800/50">
                        <td className="whitespace-nowrap px-4 py-4 font-semibold">
                          {record.vendor_name || `Vendor #${record.vendor_id}`}
                        </td>
                        <td className="px-4 py-4 text-xs text-[#0446DB] dark:text-blue-400">
                          <div className="flex flex-col items-start gap-1.5">
                            {awbs.length === 0 ? (
                              <span className="text-slate-400">—</span>
                            ) : (
                              <>
                                {awbs.slice(0, 2).map((awb, awbIndex) => (
                                  <span key={`${awb}-${awbIndex}`} className="whitespace-nowrap font-medium">
                                    {awb}
                                  </span>
                                ))}
                                {remainingCount > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => toggleAwbs(rowKey)}
                                    aria-expanded={isExpanded}
                                    aria-label={`${isExpanded ? "Hide" : "Show"} AWB numbers for ${record.vendor_name || "vendor"}`}
                                    className="mt-1 rounded-sm text-xs font-bold text-[#0446DB] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0446DB]"
                                  >
                                    {isExpanded ? "Show less" : `+${remainingCount} more`}
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 font-bold tabular-nums">{formatAmount(record.submitted_amount)}</td>
                        <td className="px-4 py-4">{record.submitted_record_count ?? 0}</td>
                        <td className="whitespace-nowrap px-4 py-4">{record.utr_number || "—"}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-xs">{formatDate(record.created_at)}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-xs">
                          <p>Pending: {formatAmount(record.pending_amount)}</p>
                          <p className="mt-1">Received: {formatAmount(record.received_amount)}</p>
                        </td>
                        <td className="px-4 py-4">
                          {record.file_url ? (
                            <a
                              href={/^https?:\/\//i.test(record.file_url) ? record.file_url : `${baseURL}/${String(record.file_url).replace(/^\/+/, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-3 py-2 text-xs font-semibold text-[#0446DB] hover:bg-blue-100 dark:bg-blue-500/10"
                            >
                              <Download className="h-4 w-4" /> Download
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">Not available</span>
                          )}
                        </td>
                      </tr>
                      {isExpanded && remainingCount > 0 && (
                        <tr className="bg-slate-50/80 dark:bg-neutral-900/80">
                          <td colSpan={8} className="border-b border-slate-200 p-3 dark:border-neutral-800 sm:p-5">
                            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900 sm:p-5">
                              <div className="mb-4 flex items-center justify-between gap-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">AWB Numbers</h3>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-neutral-800 dark:text-neutral-300">{awbs.length}</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {awbs.map((awb, awbIndex) => (
                                  <span
                                    key={`${awb}-${awbIndex}`}
                                    className="max-w-full break-all rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium text-[#0446DB] dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300"
                                  >
                                    {awb}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
          </table>
        </div>

        {/* Fixed bottom pagination */}
        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-b-xl border border-slate-200 bg-white px-3 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:px-5">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400">
            <span className="hidden sm:inline">Rows per page</span>
            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} aria-label="Rows per page" className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
              {[10, 20, 50, 100].map((count) => <option key={count} value={count}>{count}</option>)}
            </select>
          </div>
          <nav aria-label="Remittance pagination" className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" disabled={page <= 1 || loading || totalPages === 0} onClick={() => setPage((prev) => Math.max(prev - 1, 1))} className="h-9 rounded-lg border-slate-200 px-2.5 dark:border-neutral-700 sm:px-3">
              <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Previous</span>
            </Button>
            <span className="min-w-[84px] text-center text-xs font-medium tabular-nums text-slate-600 dark:text-neutral-300">Page {page} / {Math.max(1, totalPages)}</span>
            <Button type="button" variant="outline" size="sm" disabled={page >= totalPages || loading || totalPages === 0} onClick={() => setPage((prev) => Math.min(prev + 1, Math.max(1, totalPages)))} className="h-9 rounded-lg border-slate-200 px-2.5 dark:border-neutral-700 sm:px-3">
              <span className="hidden sm:inline">Next</span> <ChevronRight className="h-4 w-4" />
            </Button>
          </nav>
        </footer>
      </section>
      <div className="h-1 shrink-0 sm:h-2" />
    </div>
      )
    }
    </>
  );
}
