
// import { useState, useEffect } from "react";

// import axios from "axios";

// import { FaRegCopy } from "react-icons/fa";

// import { CiCircleCheck } from "react-icons/ci";

// import { toast } from "react-toastify";

// import { Loader2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
//   AlertDialogDescription, AlertDialogFooter, AlertDialogCancel,
// } from "@/components/ui/alert-dialog";

// import AxiosInstance from "../../../Helper/axiosInstance";

// const baseURL = import.meta.env.VITE_BASE_URL;

// const frontEndURL = import.meta.env.VITE_FRONTEND_URL;

// function VendorCodRemittance() {

//   const [loading, setLoading] = useState(false);

//   const [vendorId, setVendorId] = useState(null);

//   const [data, setData] = useState([]);

//   const [page, setPage] = useState(1);

//   const [limit, setLimit] = useState(20);

//   const [totalPages, setTotalPages] = useState(1);

//   const [copySuccess, setCopySuccess] = useState(null);

//   const [pendingAmount, setPendingAmount] = useState("");

//   const [riders, setRiders] = useState([]);
//   const [vendors, setVendors] = useState([]);

//   const [riderOptions, setRiderOptions] = useState([]);

//   const [initiatedAmount, setInitiatedAmount] = useState("");

//   const [receivedAmount, setReceivedAmount] = useState("");

//   const [adjustedAmount, setAdjustedAmount] = useState(0);

//   const [totalAmount, setTotalAmount] = useState("");

//   const [selectedBulkOrders, setSelectedBulkOrders] = useState([]);

//   const [selectedBulkAmount, setSelectedBulkAmount] = useState(0);
//   const [actionOpen, setActionOpen] = useState(false);
//   const [adjusting, setAdjusting] = useState(false);
//   const isAdjustable = (order) => ["pending", "initiated", "adjusted"].includes(order.remittance_status ?? order.status);

//   const filters = ["All", "Pending", "Initiated", "Adjusted", "Received"];

//   const [selectedFilter, setSelectedFilter] = useState("All");

//   const canSelectOrders = ["All", "Pending", "Initiated"].includes(selectedFilter);

//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   const [advanceFilters, setAdvanceFilters] = useState({

//     startDate: "",

//     endDate: "",

//     rider_id: "",

//     order_id: "",

//     awb_number: "",
//     vendor_id:""

//   });

//   const [filterUpdate, setFilterUpdate] = useState(false);

//   //Set Default Date Range of one month from today*

//   const resetAdvanceFilters = async () => {

//     const today = new Date();

//     const oneMonthAgo = new Date();

//     oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

//     setAdvanceFilters((prev) => ({

//       endDate: today.toISOString().split("T")[0],

//       startDate: oneMonthAgo.toISOString().split("T")[0],

//       rider_id: "",

//       order_id: "",

//       awb_number: "",
//       vendor_id:""

//     }));

//     fetchData()

//   };

//   const indianFormat = (num) => {

//     const temp = num.toLocaleString("en-IN", {

//       style: "currency",

//       currency: "INR",

//     });

//     return temp;

//   };

//   useEffect(() => {

//     resetAdvanceFilters();

//   }, []);

//   // Fetch data from API*

//   const checkIsFilterApplied = (filters = {}) => {
//   const {
//     rider_id,
//     mapped_with,
//     merchant_order_id,
//     order_ids,
//     awb_numbers,
//   } = filters;

//   return (
//     (rider_id != null && rider_id !== "all") ||
//     (mapped_with != null && mapped_with !== "all") ||
//     (merchant_order_id != null && merchant_order_id !== "all") ||
//     (order_ids != null && order_ids !== "all") ||
//     (awb_numbers != null && awb_numbers !== "all")
//   );
// };

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const { data: response } = await AxiosInstance.get(`/api/dc/getDcCodRemittance`, {
//         params: {
//           page,
//           limit,
//           start_date: advanceFilters.startDate,
//           end_date: advanceFilters.endDate,
//           rider_id: advanceFilters.rider_id,
//           mapped_with: advanceFilters.vendor_id,
//           order_ids: advanceFilters.order_id,
//           awb_numbers: advanceFilters.awb_number,
//           status: selectedFilter === "All" ? undefined : selectedFilter.toLowerCase(),
//         },
//       });
//       if (!response?.success) {
//         throw new Error(response?.message || "Failed to fetch DC COD remittances");
//       }
//       // Preserve existing table rendering: its status cell reads d.status.
//       const records = (response.data || []).map((record) => ({
//         ...record,
//         id: record.remittance_id,
//         status: record.remittance_status,
//       }));
//       setData(records);
//       setTotalPages(Math.max(1, Number(response.totalPages) || 1));



//       // setPendingAmount(indianFormat(Number(response?.overallSummary?.pending?.amount || 0)));
//       // setInitiatedAmount(indianFormat(Number(response?.overallSummary?.initiated?.amount || 0)));
//       // setReceivedAmount(indianFormat(Number(response?.overallSummary?.received?.amount || 0)));
//       // setAdjustedAmount(indianFormat(Number(response?.overallSummary?.adjusted?.amount || 0)));
//       // setTotalAmount(indianFormat(
//       //   Number(response?.overallSummary?.pending?.amount || 0) +
//       //   Number(response?.overallSummary?.initiated?.amount || 0) +
//       //   Number(response?.overallSummary?.received?.amount || 0) +
//       //   Number(response?.overallSummary?.adjusted?.amount || 0)
//       // ));



//       // Check if any filter is applied
// const isFilterApplied =
//   (advanceFilters.rider_id && advanceFilters.rider_id !== "all") ||
//   (advanceFilters.vendor_id && advanceFilters.vendor_id !== "all") ||
//   (advanceFilters.order_id && advanceFilters.order_id !== "all") ||
//   (advanceFilters.awb_number && advanceFilters.awb_number !== "all") ||
//   selectedFilter !== "All";

// // Select summary based on filter
// const summary = isFilterApplied
//   ? response?.filteredSummary
//   : response?.overallSummary;

// // Set summary amounts
// const pending = Number(summary?.pending?.amount || 0);
// const initiated = Number(summary?.initiated?.amount || 0);
// const received = Number(summary?.received?.amount || 0);
// const adjusted = Number(summary?.adjusted?.amount || 0);

// setPendingAmount(indianFormat(pending));
// setInitiatedAmount(indianFormat(initiated));
// setReceivedAmount(indianFormat(received));
// setAdjustedAmount(indianFormat(adjusted));

// setTotalAmount(
//   indianFormat(pending + initiated + received + adjusted)
// );



//       setVendorId(response?.filters?.dc_id ?? null);
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Failed to fetch data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRiders = async (order_ids) => {

//     setLoading(true);

//     try {

//       const res = await AxiosInstance.get(`/api/dc/riders`,{

//         params: {

//           limit: 10000,

//         },

//       })

//       setRiders(res.data.data || []);

//     } catch (err) {

//       toast.error(err.response?.data?.message || err.message || "Failed to load riders");

//     } finally {

//       setLoading(false);

//     }

//   };

//   const fetchVendors = async () => {

    

//     try {

//       const res = await AxiosInstance.get(`/api/dc/vendors`,{

//         params: {

//           limit: 10000,

//         },

//       })

//       setVendors(res.data.data || []);

//     } catch (err) {

//       toast.error(err.response?.data?.message || err.message || "Failed to load riders");

//     } finally {

//       setLoading(false);

//     }

//   };

//   const toggleSelectAll = () => {
//     const eligible = data.filter(isAdjustable);
//     const allSelected = eligible.length > 0 && eligible.every((d) => selectedBulkOrders.some((o) => o.order_id === d.order_id));
//     const next = allSelected ? [] : eligible;
//     setSelectedBulkOrders(next);
//     setSelectedBulkAmount(next.reduce((sum, order) => sum + Number(order.amount || 0), 0));
//   };

//   const toggleOrder = (order, checked) => {
//     if (!isAdjustable(order)) return;
//     setSelectedBulkOrders((previous) => {
//       const next = checked
//         ? [...previous.filter((o) => o.order_id !== order.order_id), order]
//         : previous.filter((o) => o.order_id !== order.order_id);
//       setSelectedBulkAmount(next.reduce((sum, item) => sum + Number(item.amount || 0), 0));
//       return next;
//     });
//   };

//   useEffect(() => {
//     setSelectedBulkOrders([]);
//     setSelectedBulkAmount(0);
//     setActionOpen(false);
//   }, [selectedFilter, page]);

//   const handleBulkAdjustment = async () => {
//     const order_ids = [...new Set(selectedBulkOrders.map((o) => Number(o.order_id)))];
//     if (!order_ids.length || order_ids.some((id) => !Number.isSafeInteger(id) || id <= 0)) {
//       toast.error("Please select valid COD orders to adjust.");
//       return;
//     }
//     if (order_ids.length > 500) {
//       toast.error("Maximum 500 orders can be adjusted at once.");
//       return;
//     }
//     setAdjusting(true);
//     try {
//       const { data: response } = await AxiosInstance.post(`/api/dc/remittance/cod/adjust`, {
//         order_ids,
//         status: "adjusted",
//       });
//       if (!response?.success) {
//         throw new Error(response?.message || "COD adjustment failed");
//       }
//       toast.success(response.message || "COD adjusted successfully");
//       setSelectedBulkAmount(0);
//       setSelectedBulkOrders([]);
//       setActionOpen(false);
//       await fetchData();
//     } catch (err) {
//       const invalidIds = err.response?.data?.invalid_order_ids;
//       toast.error(
//         (err.response?.data?.message || err.message || "Error while adjusting remittances") +
//         (Array.isArray(invalidIds) && invalidIds.length ? ` (Invalid IDs: ${invalidIds.join(", ")})` : "")
//       );
//     } finally {
//       setAdjusting(false);
//     }
//   };

//   useEffect(() => {

//     fetchData();

   

//   }, [selectedFilter, page]);

//   useEffect(() => {

//     if (filterUpdate) {

//       fetchData();

//       setFilterUpdate(false);

//     }

//   }, [filterUpdate]);

//   const handleChange = async (e) => {

//     setLoading(true);

//     const file = e.target.files[0];

//     const formData = new FormData();

//     formData.append("file", file);

  

//     try {

//       const res = await AxiosInstance.post(`/api/dc/remittance/submitRecords`,formData,)

//       toast.success("File uploaded successfully");

//       fetchData();

//     } catch (err) {

//       toast.error(

//         err.response?.data?.message ||

//         err.message ||

//         "Error while uploading file to take action on bulk orders",

//       );

//     } finally {

//       setLoading(false);

//     }

//   };

//   const downloadSample = async () => {

//     setLoading(true);

//     try {

//       const res = await AxiosInstance.get(`/api/dc/remittance/downloadSampleFile`,{

//         responseType: "blob",

//       })

//       const url = window.URL.createObjectURL(new Blob([res.data]));

//       const link = document.createElement("a");

//       link.href = url;

//       link.setAttribute("download", "CODRemittancesSample.csv");

//       document.body.appendChild(link);

//       link.click();

//       link.remove();

//     } catch (err) {

//       toast.error(err.response?.data?.message || err.message || "Failed to export orders");

//     } finally {

//       setLoading(false);

//     }

//   };

//   const exportCSV = async () => {

//     setLoading(true);

//     try {

//       const res = await axios.get(`${baseURL}/api/vendor/exportCodRemittance`, {

//         params: {

//           status: selectedFilter === "All" ? "" : selectedFilter,

//           order_id: advanceFilters.order_id,

//           awb_number: advanceFilters.awb_number,

//           rider_id: advanceFilters.rider_id,

//           start_date: advanceFilters.startDate,

//           end_date: advanceFilters.endDate,

//         },

//         responseType: "blob",

//         headers: {

//           Authorization: `Bearer ${localStorage.getItem("token")}`,

//         },

//       });

//       const url = window.URL.createObjectURL(new Blob([res.data]));

//       const link = document.createElement("a");

//       link.href = url;

//       link.setAttribute("download", "orders.csv");

//       document.body.appendChild(link);

//       link.click();

//       link.remove();

//     } catch (err) {

//       toast.error(err.response?.data?.message || err.message || "Failed to export orders");

//     } finally {

//       setLoading(false);

//     }

//   };

//   const [loadingPage, setLoadingPage] = useState(true);

//   useEffect(() => {

//     const timer = setTimeout(() => {

//       setLoadingPage(false);

//     }, 2000);

//     return () => clearTimeout(timer);

//   }, []);

//   return (
//     <>
//       {loadingPage ? (
//         <>
//           <div className=" w-full h-[90vh] flex justify-center items-center">
//             <div>
//               <Loader2 className="h-8 w-8 animate-spin mx-auto" />

//               <p className="mt-2">Loading COD Remittances...</p>
//             </div>
//           </div>
//         </>
//       ) : (
//         <div className="flex h-[calc(100dvh-80px)] min-h-0 w-full flex-col overflow-hidden bg-[#F6F8FC] text-gray-900 dark:bg-neutral-950 dark:text-white">
//           {/** ===================== ADVANCE FILTER SIDEBAR ===================== */}

//           {isFilterOpen && (
//             <div
//               className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] dark:bg-black/50"
//               onClick={() => setIsFilterOpen(false)}
//             />
//           )}

//           <div
//             className={`fixed right-0 top-0 z-50 h-full w-[92%] max-w-[390px] transform border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:border-neutral-800 dark:bg-neutral-900 ${
//               isFilterOpen ? "translate-x-0" : "translate-x-full"
//             }`}
//           >
//             <div className="flex h-full flex-col">
//               <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5 dark:border-neutral-800">
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
//                     Advance Filters
//                   </h2>

//                   <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
//                     Filter COD remittance records
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => {
//                     setIsFilterOpen(false);
//                   }}
//                   className="flex h-9 w-9 items-center justify-center rounded-sm border border-gray-200 text-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="flex-1 overflow-y-auto p-5">
//                 <div className="space-y-5">
//                   {/** Start Date */}

//                   <div className="w-full">
//                     <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
//                       Start Date
//                     </label>

//                     <input
//                       type="date"
//                       value={advanceFilters.startDate}
//                       onChange={(e) =>
//                         setAdvanceFilters((prev) => ({
//                           ...prev,

//                           startDate: e.target.value,
//                         }))
//                       }
//                       className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:[color-scheme:dark]"
//                     />
//                   </div>

//                   {/** End Date */}

//                   <div className="w-full">
//                     <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
//                       End Date
//                     </label>

//                     <input
//                       type="date"
//                       value={advanceFilters.endDate}
//                       onChange={(e) =>
//                         setAdvanceFilters((prev) => ({
//                           ...prev,

//                           endDate: e.target.value,
//                         }))
//                       }
//                       className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:[color-scheme:dark]"
//                     />
//                   </div>

//                   {/** Order ID */}

//                   <div className="w-full">
//                     <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
//                       Order ID
//                     </label>

//                     <input
//                       type="text"
//                       value={advanceFilters.order_id}
//                       onChange={(e) =>
//                         setAdvanceFilters((prev) => ({
//                           ...prev,

//                           order_id: e.target.value,
//                         }))
//                       }
//                       placeholder="Enter Id(s)"
//                       className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
//                     />
//                   </div>

//                   {/** AWB Number */}

//                   <div className="w-full">
//                     <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
//                       AWB Number
//                     </label>

//                     <input
//                       type="text"
//                       value={advanceFilters.awb_number}
//                       onChange={(e) =>
//                         setAdvanceFilters((prev) => ({
//                           ...prev,

//                           awb_number: e.target.value,
//                         }))
//                       }
//                       placeholder="Enter AWB Number(s)"
//                       className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
//                     />
//                   </div>

//                   {/** Rider ID */}

//                   <div className="w-full">
//                     <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
//                       Vendor
//                     </label>

//                     <select
//                     onClick={fetchVendors}
//                       value={advanceFilters.vendor_id}
//                       onChange={(e) => {
//                         setAdvanceFilters((prev) => ({
//                           ...prev,

//                           vendor_id: e.target.value,
//                         }));
//                       }}
//                       className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
//                     >
//                       <option value="">All Vendors</option>

//                       {vendors.map((v) => {
                       
//                        return (
                        
//                         <option key={v?.id} value={v?.id} >
//                           {v.id} | {v.vendor_name}
//                         </option>
//                       )
//                       })}
//                     </select>
//                   </div>


//                   <div className="w-full">
//                     <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
//                       Rider ID
//                     </label>

//                     <select
//                     onClick={fetchRiders}
//                       value={advanceFilters.rider_id}
//                       onChange={(e) => {
//                         setAdvanceFilters((prev) => ({
//                           ...prev,

//                           rider_id: e.target.value,
//                         }));
//                       }}
//                       className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
//                     >
//                       <option value="">All Riders</option>

//                       {riders.map((rider) => (
//                         <option key={rider.id} value={rider.id}>
//                           FP{vendorId}_{rider.id} | {rider.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               <div className="border-t border-gray-200 bg-gray-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-900">
//                 <div className="grid grid-cols-2 gap-3">
//                   <button
//                     onClick={() => {
//                       resetAdvanceFilters();

//                       setFilterUpdate(true);

//                       setIsFilterOpen(false);
//                     }}
//                     className="h-11 rounded-sm border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
//                   >
//                     Reset
//                   </button>

//                   <button
//                     onClick={() => {
//                       setFilterUpdate(true);

//                       setIsFilterOpen(false);
//                     }}
//                     className="h-11 rounded-sm bg-[#0446DB] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0339B5]"
//                   >
//                     Apply Filter
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/** ===================== PAGE HEADER ===================== */}

//           <div className="relative z-20 shrink-0 border-b border-slate-200  px-3 pt-3  dark:border-neutral-800 dark:bg-neutral-900  sm:pt-4">
//             <div className="pb-3 sm:pb-4">
//               <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
//                 <div>
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#0446DB]/10 text-[#0446DB] dark:bg-[#0446DB]/20 dark:text-blue-400">
//                       <span className="text-lg font-bold">₹</span>
//                     </div>

//                     <div>
//                       <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
//                         COD Remittances
//                       </h1>

//                       <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
//                         Track, manage and reconcile COD remittance records
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap items-center gap-2">
//                   <label className="group relative inline-flex h-10 cursor-pointer items-center overflow-hidden rounded-sm border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#0446DB]/30 hover:bg-[#0446DB]/5 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-[#0446DB]/10 dark:hover:text-blue-400">
//                     <span>Bulk Upload</span>

//                     <input
//                       type="file"
//                       name="bulk_remittance"
//                       onChange={handleChange}
//                       accept=".csv"
//                       className="absolute inset-0 cursor-pointer opacity-0"
//                     />
//                   </label>

//                   <button
//                     onClick={downloadSample}
//                     className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#0446DB]/30 hover:bg-[#0446DB]/5 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-[#0446DB]/10 dark:hover:text-blue-400"
//                   >
//                     Sample
//                   </button>

//                   <button
//                     onClick={exportCSV}
//                     className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#0446DB]/30 hover:bg-[#0446DB]/5 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-[#0446DB]/10 dark:hover:text-blue-400"
//                   >
//                     Export
//                   </button>

//                   <button
//                     onClick={() => setIsFilterOpen(true)}
//                     className="h-10 rounded-lg bg-[#0446DB] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0339B5]"
//                   >
//                     Filter
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/** ===================== CONTENT ===================== */}

//           <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-3 pb-3 pt-2 sm:px-5 sm:pb-4">
//             {/** Summary / Status Filters */}

//             <div className="shrink-0 rounded-sm border border-slate-200 bg-white p-1.5 dark:border-neutral-800 dark:bg-neutral-900">
//               <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap [scrollbar-width:thin]">
//                 {filters.map((filter) => {
//                   const amount =
//                     filter === "All"
//                       ? totalAmount
//                       : filter === "Pending"
//                         ? pendingAmount
//                         : filter === "Adjusted"
//                           ? adjustedAmount
//                           : filter === "Initiated"
//                             ? initiatedAmount
//                             : receivedAmount;

//                   const label =
//                     filter === "Received"
//                       ? "Submitted"
//                       : filter === "Adjusted"
//                         ? "Received"
//                         : filter;

//                   return (
//                     <Button
//                       key={filter}
//                       onClick={() => {
//                         setSelectedFilter(filter);

//                         setPage(1);
//                       }}
//                       className={`  justify-center rounded-sm  border  pb-1 text-left shadow-none transition ${
//                         selectedFilter === filter
//                           ? "border-[#0446DB] bg-[#0446DB] text-white hover:bg-[#0446DB]"
//                           : "border-gray-200 bg-white text-gray-700 hover:border-[#0446DB]/30 hover:bg-[#0446DB]/5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-[#0446DB]/10"
//                       }`}
//                     >
//                       <div className="w-full flex items-center justify-center gap-2">
//                         <p
//                           className={`text-xs font-semibold mt-1 uppercase tracking-wide ${
//                             selectedFilter === filter
//                               ? "text-white/75"
//                               : "text-gray-400 dark:text-neutral-500"
//                           }`}
//                         >
//                           {label}
//                         </p>

//                         <p className="mt-1.5 truncate text-base font-bold">{amount || "₹0.00"}</p>
//                       </div>
//                     </Button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/** Selected COD actions: review in dialog before submitting. */}
//             {selectedBulkOrders.length > 0 && canSelectOrders && (
//               <div>
//                 <Button
//                   type="button"
//                   onClick={() => setActionOpen(true)}
//                   className="inline rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white hover:bg-[#0339B5]"
//                 >
//                   Action
//                 </Button>
//               </div>
//             )}

//             <AlertDialog
//               open={actionOpen}
//               onOpenChange={(open) => {
//                 if (!adjusting) setActionOpen(open);
//               }}
//             >
//               <AlertDialogContent className="flex max-h-[90dvh] w-[calc(100%-24px)] max-w-2xl flex-col overflow-hidden rounded-sm bg-white p-0 dark:bg-neutral-900">
//                 <AlertDialogHeader className="border-b border-gray-200 px-5 py-4 text-left dark:border-neutral-800">
//                   <AlertDialogTitle>Adjust COD Ownership</AlertDialogTitle>
//                   <AlertDialogDescription>
//                     Confirm COD handover to this DC. This updates the selected remittance records to
//                     adjusted and their current holder to DC.
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>
//                 <div className="min-h-0 space-y-3 overflow-y-auto px-5 py-4">
//                   <div className="flex flex-wrap justify-between gap-2 rounded-sm bg-blue-50 p-3 text-sm dark:bg-blue-950/20">
//                     <span>
//                       <strong>{selectedBulkOrders.length}</strong> selected orders
//                     </span>
//                     <span className="font-bold text-[#0446DB]">
//                       ₹{Number(selectedBulkAmount).toLocaleString("en-IN")}
//                     </span>
//                   </div>
//                   <div className="overflow-x-auto rounded-sm border border-gray-200 dark:border-neutral-800">
//                     <table className="min-w-full text-left text-sm">
//                       <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-neutral-800">
//                         <tr>
//                           <th className="px-3 py-3">Order ID</th>
//                           <th className="px-3 py-3">AWB</th>
//                           <th className="px-3 py-3">Current Status</th>
//                           <th className="px-3 py-3 text-right">Amount</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
//                         {selectedBulkOrders.map((order) => (
//                           <tr key={order.order_id}>
//                             <td className="px-3 py-3">{order.order_id}</td>
//                             <td className="px-3 py-3 font-medium">{order.awb_number}</td>
//                             <td className="px-3 py-3 capitalize">
//                               {order.remittance_status ?? order.status}
//                             </td>
//                             <td className="px-3 py-3 text-right">
//                               ₹{Number(order.amount || 0).toLocaleString("en-IN")}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//                 <AlertDialogFooter className="flex-row justify-end gap-2 border-t border-gray-200 mb-0 px-7 dark:border-neutral-800">
//                   <AlertDialogCancel
//                     disabled={adjusting}
//                     onClick={() => {
//                       setSelectedBulkOrders([]);
//                       setSelectedBulkAmount(0);
//                     }}
//                     className="m-0"
//                   >
//                     Cancel
//                   </AlertDialogCancel>
//                   <Button
//                     type="button"
//                     disabled={adjusting || !selectedBulkOrders.length}
//                     onClick={handleBulkAdjustment}
//                     className="inline-flex h-8 items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-1 text-sm font-semibold text-white disabled:opacity-50"
//                   >
//                     {adjusting && <Loader2 className="h-4 w-4 animate-spin" />}
//                     {adjusting ? "Submitting..." : "Submit · Adjust COD"}
//                   </Button>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>

//             {/** ===================== TABLE ===================== */}

//             <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
//               <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-neutral-800 sm:px-5">
//                 <div>
//                   <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
//                     Remittance Records
//                   </h3>

//                   <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
//                     COD transaction and settlement details
//                   </p>
//                 </div>

//                 <div className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
//                   {data.length} Records
//                 </div>
//               </div>

//               <div className="min-h-0 w-full flex-1 overflow-auto overscroll-contain">
//                 <table className="min-w-[1050px] w-full border-separate border-spacing-0 text-sm">
//                   <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-neutral-800">
//                     <tr className="border-b border-gray-200 bg-slate-50 dark:border-neutral-800 dark:bg-neutral-800">
//                       {canSelectOrders && (
//                         <th className="w-[60px] px-5 py-3.5 text-center">
//                           <input
//                             type="checkbox"
//                             className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#0446DB]"
//                             checked={
//                               data.some(isAdjustable) &&
//                               data
//                                 .filter(isAdjustable)
//                                 .every((row) =>
//                                   selectedBulkOrders.some(
//                                     (selected) => selected.order_id === row.order_id,
//                                   ),
//                                 )
//                             }
//                             onChange={toggleSelectAll}
//                           />
//                         </th>
//                       )}

//                       <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
//                         Rider
//                       </th>

//                       <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
//                         Order Details
//                       </th>

//                       <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
//                         Amount
//                       </th>

//                       <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
//                         Received By
//                       </th>

//                       <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
//                         Remarks
//                       </th>

//                       <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
//                         Current Holder
//                       </th>

//                       <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
//                         Status
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
//                     {loading ? (
//                       <tr key={"No record found"}>
//                         <td
//                           colSpan={canSelectOrders ? "8" : "7"}
//                           className="px-6 py-16 text-center text-gray-500"
//                         >
//                           <div className="flex w-full items-center justify-center">
//                             <div>
//                               <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#0446DB]" />

//                               <p className="mt-3 text-sm text-gray-500 dark:text-neutral-400">
//                                 Loading COD Remittances...
//                               </p>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     ) : data.length == 0 ? (
//                       <tr key={"No record found"}>
//                         <td
//                           colSpan={canSelectOrders ? "8" : "7"}
//                           className="px-6 py-16 text-center"
//                         >
//                           <div className="mx-auto max-w-sm">
//                             <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm bg-gray-100 text-gray-400 dark:bg-neutral-800 dark:text-neutral-500">
//                               ₹
//                             </div>

//                             <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-neutral-200">
//                               No records found
//                             </p>

//                             <p className="mt-1 text-xs text-gray-400 dark:text-neutral-500">
//                               Try changing the selected status or filters.
//                             </p>
//                           </div>
//                         </td>
//                       </tr>
//                     ) : (
//                       data.map((d, index) => {
//                         let isSelected;

//                         if (canSelectOrders) {
//                           isSelected = selectedBulkOrders.some((o) => o.order_id === d.order_id);
//                         }

//                         return (
//                           <tr
//                             key={index}
//                             className={`transition-colors hover:bg-gray-50/80 dark:hover:bg-neutral-800/40 ${
//                               isSelected ? "bg-[#0446DB]/[0.035] dark:bg-[#0446DB]/10" : ""
//                             }`}
//                           >
//                             {canSelectOrders && (
//                               <td className="px-5 py-4 text-center">
//                                 <input
//                                   type="checkbox"
//                                   checked={isSelected}
//                                   disabled={!isAdjustable(d)}
//                                   onChange={(e) => toggleOrder(d, e.target.checked)}
//                                   className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#0446DB]"
//                                 />
//                               </td>
//                             )}

//                             <td className="px-5 py-4 align-top">
//                               <div className="min-w-[160px]">
                             

//                                 <p className="text-sm font-semibold text-gray-900 dark:text-white">
//                                   {d.rider_name || "-"}
//                                 </p>

//                                 <p className="mt-1 text-xs font-medium text-gray-400 dark:text-neutral-500">
//                                   {
//                                     d?.rider_vendor_id ? (
//                                       <>
//                                       FP_{d?.rider_vendor_id}_{d.rider_id}
                                      
//                                       </>
//                                     ) : (
//                                       <>
//                                         DC_{d.rider_id}
//                                       </>
//                                     )
//                                   }
//                                 </p>
//                               </div>
//                             </td>

//                             <td className="px-5 py-4 align-top">
//                               <div className="min-w-[250px]">
//                                 <div className="flex items-center gap-1.5">
//                                   <a
//                                     href={`${frontEndURL}/track-order?awb_number=${d.awb_number}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="font-semibold text-[#0446DB] hover:underline dark:text-blue-400"
//                                   >
//                                     {d.awb_number}
//                                   </a>

//                                   <button
//                                     className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-[#0446DB]/10 hover:text-[#0446DB] dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
//                                     onClick={() => {
//                                       navigator.clipboard.writeText(d.awb_number);

//                                       setCopySuccess(d.awb_number);

//                                       setTimeout(() => {
//                                         setCopySuccess(null);
//                                       }, 2000);
//                                     }}
//                                   >
//                                     {copySuccess === d.awb_number ? (
//                                       <CiCircleCheck className="text-lg text-emerald-500" />
//                                     ) : (
//                                       <FaRegCopy />
//                                     )}
//                                   </button>
//                                 </div>

//                                 <p className="mt-1.5 text-xs text-gray-500 dark:text-neutral-400">
//                                   {new Date(d.submitted_at).toLocaleString("en-IN", {
//                                     timeZone: "Asia/Kolkata",

//                                     day: "2-digit",

//                                     month: "2-digit",

//                                     year: "numeric",

//                                     hour: "2-digit",

//                                     minute: "2-digit",

//                                     hour12: true,
//                                   })}
//                                 </p>

//                                 <div className="mt-1 flex items-center gap-1">
//                                   <p className="max-w-[190px] truncate text-xs text-gray-400 dark:text-neutral-500">
//                                     Order ID:{" "}
//                                     {d.merchant_order_id?.length <= 20
//                                       ? d.merchant_order_id
//                                       : d.merchant_order_id?.slice(0, 20) + "..."}
//                                   </p>

//                                   <button
//                                     className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition hover:bg-[#0446DB]/10 hover:text-[#0446DB] dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
//                                     onClick={() => {
//                                       navigator.clipboard.writeText(d.merchant_order_id);

//                                       setCopySuccess(d.merchant_order_id);

//                                       setTimeout(() => {
//                                         setCopySuccess(null);
//                                       }, 2000);
//                                     }}
//                                   >
//                                     {copySuccess === d.merchant_order_id ? (
//                                       <CiCircleCheck className="text-base text-emerald-500" />
//                                     ) : (
//                                       <FaRegCopy className="text-xs" />
//                                     )}
//                                   </button>
//                                 </div>
//                               </div>
//                             </td>

//                             <td className="px-5 py-4 align-top">
//                               <span className="whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
//                                 ₹{Number(d.amount || 0).toLocaleString("en-IN")}
//                               </span>
//                             </td>

//                             <td className="px-5 py-4 align-top text-sm text-gray-600 dark:text-neutral-300">
//                               {d.receivedby_ || "-"}
//                             </td>

//                             <td className="px-5 py-4 align-top">
//                               <p
//                                 className="max-w-[220px] truncate text-sm text-gray-500 dark:text-neutral-400"
//                                 title={d.remarks || "NA"}
//                               >
//                                 {d.remarks || "NA"}
//                               </p>
//                             </td>

//                             <td className="px-5 py-4 align-top">
//                             <p
//                             className={`max-w-[220px] truncate text-sm font-semibold ${
//                               d.current_holder === "dc"
//                                 ? "text-emerald-600 dark:text-emerald-400"
//                                 : d.current_holder === "rider"
//                                   ? "text-blue-600 dark:text-blue-400"
//                                   : d.current_holder === "vendor"
//                                     ? "text-orange-600 dark:text-orange-400"
//                                     : d.current_holder === "admin"
//                                       ? "text-purple-600 dark:text-purple-400"
//                                       : "text-gray-400"
//                             }`}
//                           >
//                             {!d.current_holder
//                               ? "-"
//                               : d.current_holder === "dc"
//                                 ? "Self"
//                                 : d.current_holder.charAt(0).toUpperCase() +
//                                   d.current_holder.slice(1)}
//                           </p>
//                             </td>

//                             <td className="px-5 py-4 align-top">
//                               {d.status === "pending" ? (
//                                 <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
//                                   Pending
//                                 </span>
//                               ) : d.status === "initiated" ? (
//                                 <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
//                                   Initiated
//                                 </span>
//                               ) : d.status === "adjusted" ? (
//                                 <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
//                                   Received
//                                 </span>
//                               ) : (
//                                 <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
//                                   Submitted
//                                 </span>
//                               )}
//                             </td>
//                           </tr>
//                         );
//                       })
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/** ===================== PAGINATION ===================== */}

//               <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-3 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:px-5">
//                 <p className="text-xs text-gray-500 dark:text-neutral-400">
//                   Page <span className="font-semibold text-gray-900 dark:text-white">{page}</span>{" "}
//                   of{" "}
//                   <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
//                 </p>

//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//                     disabled={page === 1}
//                     className={`h-9 rounded-lg border px-4 text-sm font-semibold transition ${
//                       page === 1
//                         ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-600"
//                         : "border-gray-200 bg-white text-gray-700 hover:border-[#0446DB]/30 hover:bg-[#0446DB]/5 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-[#0446DB]/10 dark:hover:text-blue-400"
//                     }`}
//                   >
//                     Previous
//                   </button>

//                   <button
//                     onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
//                     disabled={page === totalPages}
//                     className={`h-9 rounded-lg border px-4 text-sm font-semibold transition ${
//                       page === totalPages
//                         ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-600"
//                         : "border-[#0446DB] bg-[#0446DB] text-white hover:bg-[#0339B5]"
//                     }`}
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );

// }

// export default VendorCodRemittance;







import { useState, useEffect } from "react";

import axios from "axios";

import { FaRegCopy } from "react-icons/fa";

import { CiCircleCheck } from "react-icons/ci";

import { toast } from "react-toastify";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

import {

  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,

  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel,

} from "@/components/ui/alert-dialog";

import AxiosInstance from "../../../Helper/axiosInstance";

const baseURL = import.meta.env.VITE_BASE_URL;

const frontEndURL = import.meta.env.VITE_FRONTEND_URL;

function VendorCodRemittance() {

  const [loading, setLoading] = useState(false);

  const [vendorId, setVendorId] = useState(null);

  const [data, setData] = useState([]);

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(20);

  const [totalPages, setTotalPages] = useState(1);

  const [copySuccess, setCopySuccess] = useState(null);

  const [pendingAmount, setPendingAmount] = useState("");

  const [riders, setRiders] = useState([]);

  const [vendors, setVendors] = useState([]);

  const [riderOptions, setRiderOptions] = useState([]);

  const [initiatedAmount, setInitiatedAmount] = useState("");

  const [receivedAmount, setReceivedAmount] = useState("");

  const [adjustedAmount, setAdjustedAmount] = useState(0);

  const [totalAmount, setTotalAmount] = useState("");

  const [selectedBulkOrders, setSelectedBulkOrders] = useState([]);

  const [selectedBulkAmount, setSelectedBulkAmount] = useState(0);

  const [actionOpen, setActionOpen] = useState(false);

  const [adjusting, setAdjusting] = useState(false);

  const isAdjustable = (order) => ["pending", "initiated", "adjusted"].includes(order.remittance_status ?? order.status);

  const filters = ["All", "Pending", "Initiated", "Adjusted", "Received"];

  const [selectedFilter, setSelectedFilter] = useState("All");

  const canSelectOrders = ["All", "Pending", "Initiated"].includes(selectedFilter);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [advanceFilters, setAdvanceFilters] = useState({

    startDate: "",

    endDate: "",

    rider_id: "",

    order_id: "",

    awb_number: "",

    vendor_id:""

  });

  const [filterUpdate, setFilterUpdate] = useState(false);

  //Set Default Date Range of one month from today\

  const resetAdvanceFilters = async () => {

    const today = new Date();

    const oneMonthAgo = new Date();

    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    setAdvanceFilters((prev) => ({

      endDate: today.toISOString().split("T")[0],

      startDate: oneMonthAgo.toISOString().split("T")[0],

      rider_id: "",

      order_id: "",

      awb_number: "",

      vendor_id:""

    }));

    fetchData()

  };

  const indianFormat = (num) => {

    const temp = num.toLocaleString("en-IN", {

      style: "currency",

      currency: "INR",

    });

    return temp;

  };

  useEffect(() => {

    resetAdvanceFilters();

  }, []);

  // Fetch data from API\

  const checkIsFilterApplied = (filters = {}) => {

  const {

    rider_id,

    mapped_with,

    merchant_order_id,

    order_ids,

    awb_numbers,

  } = filters;

  return (

    (rider_id != null && rider_id !== "all") ||

    (mapped_with != null && mapped_with !== "all") ||

    (merchant_order_id != null && merchant_order_id !== "all") ||

    (order_ids != null && order_ids !== "all") ||

    (awb_numbers != null && awb_numbers !== "all")

  );

};

  const fetchData = async () => {

    setLoading(true);

    try {

      const { data: response } = await AxiosInstance.get(`/api/dc/getDcCodRemittance`, {

        params: {

          page,

          limit,

          start_date: advanceFilters.startDate,

          end_date: advanceFilters.endDate,

          rider_id: advanceFilters.rider_id,

          mapped_with: advanceFilters.vendor_id,

          order_ids: Number(advanceFilters.order_id) || undefined,

          awb_numbers: advanceFilters.awb_number,

          status: selectedFilter === "All" ? undefined : selectedFilter.toLowerCase(),

        },

      });

      if (!response?.success) {

        throw new Error(response?.message || "Failed to fetch DC COD remittances");

      }

      // Preserve existing table rendering: its status cell reads d.status.*

      const records = (response.data || []).map((record) => ({

        ...record,

        id: record.remittance_id,

        status: record.remittance_status,

      }));

      setData(records);

      setTotalPages(Math.max(1, Number(response.totalPages) || 1));

      // setPendingAmount(indianFormat(Number(response?.overallSummary?.pending?.amount || 0)));*

      // setInitiatedAmount(indianFormat(Number(response?.overallSummary?.initiated?.amount || 0)));*

      // setReceivedAmount(indianFormat(Number(response?.overallSummary?.received?.amount || 0)));*

      // setAdjustedAmount(indianFormat(Number(response?.overallSummary?.adjusted?.amount || 0)));*

      // setTotalAmount(indianFormat(*

      //   Number(response?.overallSummary?.pending?.amount || 0) +*

      //   Number(response?.overallSummary?.initiated?.amount || 0) +*

      //   Number(response?.overallSummary?.received?.amount || 0) +*

      //   Number(response?.overallSummary?.adjusted?.amount || 0)*

      // ));*

      // Check if any filter is applied*

const isFilterApplied =

  (advanceFilters.rider_id && advanceFilters.rider_id !== "all") ||

  (advanceFilters.vendor_id && advanceFilters.vendor_id !== "all") ||

  (advanceFilters.order_id && advanceFilters.order_id !== "all") ||

  (advanceFilters.awb_number && advanceFilters.awb_number !== "all") ||

  selectedFilter !== "All";

// Select summary based on filter*

const summary = isFilterApplied

  ? response?.filteredSummary

  : response?.overallSummary;

// Set summary amounts*

const pending = Number(summary?.pending?.amount || 0);

const initiated = Number(summary?.initiated?.amount || 0);

const received = Number(summary?.received?.amount || 0);

const adjusted = Number(summary?.adjusted?.amount || 0);

setPendingAmount(indianFormat(pending));

setInitiatedAmount(indianFormat(initiated));

setReceivedAmount(indianFormat(received));

setAdjustedAmount(indianFormat(adjusted));

setTotalAmount(

  indianFormat(pending + initiated + received + adjusted)

);

      setVendorId(response?.filters?.dc_id ?? null);

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Failed to fetch data");

    } finally {

      setLoading(false);

    }

  };

  const fetchRiders = async (order_ids) => {

    setLoading(true);

    try {

      const res = await AxiosInstance.get(`/api/dc/riders`,{

        params: {

          limit: 10000,

        },

      })

      setRiders(res.data.data || []);

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Failed to load riders");

    } finally {

      setLoading(false);

    }

  };

  const fetchVendors = async () => {

    try {

      const res = await AxiosInstance.get(`/api/dc/vendors`,{

        params: {

          limit: 10000,

        },

      })

      setVendors(res.data.data || []);

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Failed to load riders");

    } finally {

      setLoading(false);

    }

  };

  const toggleSelectAll = () => {

    const eligible = data.filter(isAdjustable);

    const allSelected = eligible.length > 0 && eligible.every((d) => selectedBulkOrders.some((o) => o.order_id === d.order_id));

    const next = allSelected ? [] : eligible;

    setSelectedBulkOrders(next);

    setSelectedBulkAmount(next.reduce((sum, order) => sum + Number(order.amount || 0), 0));

  };

  const toggleOrder = (order, checked) => {

    if (!isAdjustable(order)) return;

    setSelectedBulkOrders((previous) => {

      const next = checked

        ? [...previous.filter((o) => o.order_id !== order.order_id), order]

        : previous.filter((o) => o.order_id !== order.order_id);

      setSelectedBulkAmount(next.reduce((sum, item) => sum + Number(item.amount || 0), 0));

      return next;

    });

  };

  useEffect(() => {

    setSelectedBulkOrders([]);

    setSelectedBulkAmount(0);

    setActionOpen(false);

  }, [selectedFilter, page]);

  const handleBulkAdjustment = async () => {

    const order_ids = [...new Set(selectedBulkOrders.map((o) => Number(o.order_id)))];

    if (!order_ids.length || order_ids.some((id) => !Number.isSafeInteger(id) || id <= 0)) {

      toast.error("Please select valid COD orders to adjust.");

      return;

    }

    if (order_ids.length > 500) {

      toast.error("Maximum 500 orders can be adjusted at once.");

      return;

    }

    setAdjusting(true);

    try {

      const { data: response } = await AxiosInstance.post(`/api/dc/remittance/cod/adjust`, {

        order_ids,

        status: "adjusted",

      });

      if (!response?.success) {

        throw new Error(response?.message || "COD adjustment failed");

      }

      toast.success(response.message || "COD adjusted successfully");

      setSelectedBulkAmount(0);

      setSelectedBulkOrders([]);

      setActionOpen(false);

      await fetchData();

    } catch (err) {

      const invalidIds = err.response?.data?.invalid_order_ids;

      toast.error(

        (err.response?.data?.message || err.message || "Error while adjusting remittances") +

        (Array.isArray(invalidIds) && invalidIds.length ? ` (Invalid IDs: ${invalidIds.join(", ")})` : "")

      );

    } finally {

      setAdjusting(false);

    }

  };

  useEffect(() => {

    fetchData();

  }, [selectedFilter, page]);

  useEffect(() => {

    if (filterUpdate) {

      fetchData();

      setFilterUpdate(false);

    }

  }, [filterUpdate]);

  const handleChange = async (e) => {

    setLoading(true);

    const file = e.target.files[0];

    const formData = new FormData();

    formData.append("file", file);

    try {

      const res = await AxiosInstance.post(`/api/dc/remittance/submitRecords`,formData,)

      toast.success("File uploaded successfully");

      fetchData();

    } catch (err) {

      toast.error(

        err.response?.data?.message ||

        err.message ||

        "Error while uploading file to take action on bulk orders",

      );

    } finally {

      setLoading(false);

    }

  };

  const downloadSample = async () => {

    setLoading(true);

    try {

      const res = await AxiosInstance.get(`/api/dc/remittance/downloadSampleFile`,{

        responseType: "blob",

      })

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute("download", "CODRemittancesSample.csv");

      document.body.appendChild(link);

      link.click();

      link.remove();

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Failed to export orders");

    } finally {

      setLoading(false);

    }

  };

  const exportCSV = async () => {

    setLoading(true);

    try {

      const res = await axios.get(`${baseURL}/api/vendor/exportCodRemittance`, {

        params: {

          status: selectedFilter === "All" ? "" : selectedFilter,

          order_id: advanceFilters.order_id,

          awb_number: advanceFilters.awb_number,

          rider_id: advanceFilters.rider_id,

          start_date: advanceFilters.startDate,

          end_date: advanceFilters.endDate,

        },

        responseType: "blob",

        headers: {

          Authorization: `Bearer ${localStorage.getItem("token")}`,

        },

      });

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute("download", "orders.csv");

      document.body.appendChild(link);

      link.click();

      link.remove();

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Failed to export orders");

    } finally {

      setLoading(false);

    }

  };

  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {

      setLoadingPage(false);

    }, 2000);

    return () => clearTimeout(timer);

  }, []);

  return (

    <>

      {loadingPage ? (

        <>

          <div className=" w-full h-[90vh] flex justify-center items-center">

            <div>

              <Loader2 className="h-8 w-8 animate-spin mx-auto" />

              <p className="mt-2">Loading COD Remittances...</p>

            </div>

          </div>

        </>

      ) : (

        <div className="flex h-[calc(100dvh-80px)] min-h-0 w-full flex-col overflow-hidden bg-[#F6F8FC] text-gray-900 dark:bg-neutral-950 dark:text-white">

          {/* ===================== ADVANCE FILTER SIDEBAR ===================== */}

          <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen} direction="right">
            <DrawerContent className="!fixed !inset-y-0 !right-0 !left-auto !top-0 !mt-0 !h-dvh !w-[92%] !max-w-[390px] !rounded-none border-l border-gray-200 bg-white p-0 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
              <form
                className="flex h-full min-h-0 flex-col"
                onSubmit={(e) => {
                  e.preventDefault();
                  setFilterUpdate(true);
                  setIsFilterOpen(false);
                }}
              >
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5 dark:border-neutral-800">

                <div>

                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">

                    Advance Filters

                  </h2>

                  <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">

                    Filter COD remittance records

                  </p>

                </div>

                <button
                  type="button"
                  onClick={() => {

                    setIsFilterOpen(false);

                  }}

                  className="flex h-9 w-9 items-center justify-center rounded-sm border border-gray-200 text-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"

                >

                  ×

                </button>

              </div>

              <div className="flex-1 overflow-y-auto p-5">

                <div className="space-y-5">

                  {/* Start Date */}

                  <div className="w-full">

                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">

                      Start Date

                    </label>

                    <input

                      type="date"

                      value={advanceFilters.startDate}

                      onChange={(e) =>

                        setAdvanceFilters((prev) => ({

                          ...prev,

                          startDate: e.target.value,

                        }))

                      }

                      className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:[color-scheme:dark]"

                    />

                  </div>

                  {/* End Date */}

                  <div className="w-full">

                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">

                      End Date

                    </label>

                    <input

                      type="date"

                      value={advanceFilters.endDate}

                      onChange={(e) =>

                        setAdvanceFilters((prev) => ({

                          ...prev,

                          endDate: e.target.value,

                        }))

                      }

                      className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:[color-scheme:dark]"

                    />

                  </div>

                  {/* Order ID */}

                  <div className="w-full">

                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">

                      Order ID

                    </label>

                    <input

                      type="text"

                      value={advanceFilters.order_id}

                      onChange={(e) =>

                        setAdvanceFilters((prev) => ({

                          ...prev,

                          order_id: e.target.value,

                        }))

                      }

                      placeholder="Enter Id(s)"

                      className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"

                    />

                  </div>

                  {/* AWB Number */}

                  <div className="w-full">

                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">

                      AWB Number

                    </label>

                    <input

                      type="text"

                      value={advanceFilters.awb_number}

                      onChange={(e) =>

                        setAdvanceFilters((prev) => ({

                          ...prev,

                          awb_number: e.target.value,

                        }))

                      }

                      placeholder="Enter AWB Number(s)"

                      className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"

                    />

                  </div>

                  {/* Rider ID */}

                  <div className="w-full">

                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">

                      Vendor

                    </label>

                    <select

                    onClick={fetchVendors}

                      value={advanceFilters.vendor_id}

                      onChange={(e) => {

                        setAdvanceFilters((prev) => ({

                          ...prev,

                          vendor_id: e.target.value,

                        }));

                      }}

                      className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"

                    >

                      <option value="">All Vendors</option>

                      {vendors.map((v) => {

                       return (

                        <option key={v?.id} value={v?.id} >

                          {v.id} | {v.vendor_name}

                        </option>

                      )

                      })}

                    </select>

                  </div>

                  <div className="w-full">

                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">

                      Rider ID

                    </label>

                    <select

                    onClick={fetchRiders}

                      value={advanceFilters.rider_id}

                      onChange={(e) => {

                        setAdvanceFilters((prev) => ({

                          ...prev,

                          rider_id: e.target.value,

                        }));

                      }}

                      className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"

                    >

                      <option value="">All Riders</option>

                      {riders.map((rider) => (

                        <option key={rider.id} value={rider.id}>

                          FP{vendorId}_{rider.id} | {rider.name}

                        </option>

                      ))}

                    </select>

                  </div>

                </div>

              </div>

              <div className="border-t border-gray-200 bg-gray-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-900">

                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() => {

                      resetAdvanceFilters();

                      setFilterUpdate(true);

                      setIsFilterOpen(false);

                    }}

                    className="h-11 rounded-sm border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"

                  >

                    Reset

                  </button>

                  <button
                    type="submit"

                    className="h-11 rounded-sm bg-[#0446DB] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0339B5]"

                  >

                    Apply Filter

                  </button>

                </div>

              </div>

              </form>

            </DrawerContent>
          </Drawer>

          {/* ===================== PAGE HEADER ===================== */}

          <div className="relative z-20 shrink-0 border-b border-slate-200  px-3 pt-3  dark:border-neutral-800 dark:bg-neutral-900  sm:pt-4">

            <div className="pb-3 sm:pb-4">

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                <div>

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#0446DB]/10 text-[#0446DB] dark:bg-[#0446DB]/20 dark:text-blue-400">

                      <span className="text-lg font-bold">₹</span>

                    </div>

                    <div>

                      <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">

                        COD Remittances

                      </h1>

                      <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">

                        Track, manage and reconcile COD remittance records

                      </p>

                    </div>

                  </div>

                </div>

                <div className="flex flex-wrap items-center gap-2">

                  <label className="group relative inline-flex h-10 cursor-pointer items-center overflow-hidden rounded-sm border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#0446DB]/30 hover:bg-[#0446DB]/5 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-[#0446DB]/10 dark:hover:text-blue-400">

                    <span>Bulk Upload</span>

                    <input

                      type="file"

                      name="bulk_remittance"

                      onChange={handleChange}

                      accept=".csv"

                      className="absolute inset-0 cursor-pointer opacity-0"

                    />

                  </label>

                  <button

                    onClick={downloadSample}

                    className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#0446DB]/30 hover:bg-[#0446DB]/5 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-[#0446DB]/10 dark:hover:text-blue-400"

                  >

                    Sample

                  </button>

                  <button

                    onClick={exportCSV}

                    className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#0446DB]/30 hover:bg-[#0446DB]/5 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-[#0446DB]/10 dark:hover:text-blue-400"

                  >

                    Export

                  </button>

                  <button

                    onClick={() => setIsFilterOpen(true)}

                    className="h-10 rounded-lg bg-[#0446DB] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0339B5]"

                  >

                    Filter

                  </button>

                </div>

              </div>

            </div>

          </div>

          {/* ===================== CONTENT ===================== */}

          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-3 pb-3 pt-2 sm:px-5 sm:pb-4">

            {/* Summary / Status Filters */}

            <div className="shrink-0 rounded-sm border border-slate-200 bg-white p-1.5 dark:border-neutral-800 dark:bg-neutral-900">

              <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap [scrollbar-width:thin]">

                {filters.map((filter) => {

                  const amount =

                    filter === "All"

                      ? totalAmount

                      : filter === "Pending"

                        ? pendingAmount

                        : filter === "Adjusted"

                          ? adjustedAmount

                          : filter === "Initiated"

                            ? initiatedAmount

                            : receivedAmount;

                  const label =

                    filter === "Received"

                      ? "Submitted"

                      : filter === "Adjusted"

                        ? "Received"

                        : filter;

                  return (

                    <Button

                      key={filter}

                      onClick={() => {

                        setSelectedFilter(filter);

                        setPage(1);

                      }}

                      className={`  justify-center rounded-sm  border  pb-1 text-left shadow-none transition ${

                        selectedFilter === filter

                          ? "border-[#0446DB] bg-[#0446DB] text-white hover:bg-[#0446DB]"

                          : "border-gray-200 bg-white text-gray-700 hover:border-[#0446DB]/30 hover:bg-[#0446DB]/5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-[#0446DB]/10"

                      }`}

                    >

                      <div className="w-full flex items-center justify-center gap-2">

                        <p

                          className={`text-xs font-semibold mt-1 uppercase tracking-wide ${

                            selectedFilter === filter

                              ? "text-white/75"

                              : "text-gray-400 dark:text-neutral-500"

                          }`}

                        >

                          {label}

                        </p>

                        <p className="mt-1.5 truncate text-base font-bold">{amount || "₹0.00"}</p>

                      </div>

                    </Button>

                  );

                })}

              </div>

            </div>

            {/* Selected COD actions: review in dialog before submitting. */}

            {selectedBulkOrders.length > 0 && canSelectOrders && (

              <div>

                <Button

                  type="button"

                  onClick={() => setActionOpen(true)}

                  className="inline rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white hover:bg-[#0339B5]"

                >

                  Action

                </Button>

              </div>

            )}

            <AlertDialog

              open={actionOpen}

              onOpenChange={(open) => {

                if (!adjusting) setActionOpen(open);

              }}

            >

              <AlertDialogContent className="flex max-h-[90dvh] w-[calc(100%-24px)] max-w-2xl flex-col overflow-hidden rounded-sm bg-white p-0 dark:bg-neutral-900">

                <AlertDialogHeader className="border-b border-gray-200 px-5 py-4 text-left dark:border-neutral-800">

                  <AlertDialogTitle>Adjust COD Ownership</AlertDialogTitle>

                  <AlertDialogDescription>

                    Confirm COD handover to this DC. This updates the selected remittance records to

                    adjusted and their current holder to DC.

                  </AlertDialogDescription>

                </AlertDialogHeader>

                <div className="min-h-0 space-y-3 overflow-y-auto px-5 py-4">

                  <div className="flex flex-wrap justify-between gap-2 rounded-sm bg-blue-50 p-3 text-sm dark:bg-blue-950/20">

                    <span>

                      <strong>{selectedBulkOrders.length}</strong> selected orders

                    </span>

                    <span className="font-bold text-[#0446DB]">

                      ₹{Number(selectedBulkAmount).toLocaleString("en-IN")}

                    </span>

                  </div>

                  <div className="overflow-x-auto rounded-sm border border-gray-200 dark:border-neutral-800">

                    <table className="min-w-full text-left text-sm">

                      <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-neutral-800">

                        <tr>

                          <th className="px-3 py-3">Order ID</th>

                          <th className="px-3 py-3">AWB</th>

                          <th className="px-3 py-3">Current Status</th>

                          <th className="px-3 py-3 text-right">Amount</th>

                        </tr>

                      </thead>

                      <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">

                        {selectedBulkOrders.map((order) => (

                          <tr key={order.order_id}>

                            <td className="px-3 py-3">{order.order_id}</td>

                            <td className="px-3 py-3 font-medium">{order.awb_number}</td>

                            <td className="px-3 py-3 capitalize">

                              {order.remittance_status ?? order.status}

                            </td>

                            <td className="px-3 py-3 text-right">

                              ₹{Number(order.amount || 0).toLocaleString("en-IN")}

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                </div>

                <AlertDialogFooter className="flex-row justify-end gap-2 border-t border-gray-200 mb-0 px-7 dark:border-neutral-800">

                  <AlertDialogCancel

                    disabled={adjusting}

                    onClick={() => {

                      setSelectedBulkOrders([]);

                      setSelectedBulkAmount(0);

                    }}

                    className="m-0"

                  >

                    Cancel

                  </AlertDialogCancel>

                  <Button

                    type="button"

                    disabled={adjusting || !selectedBulkOrders.length}

                    onClick={handleBulkAdjustment}

                    className="inline-flex h-8 items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-1 text-sm font-semibold text-white disabled:opacity-50"

                  >

                    {adjusting && <Loader2 className="h-4 w-4 animate-spin" />}

                    {adjusting ? "Submitting..." : "Submit · Adjust COD"}

                  </Button>

                </AlertDialogFooter>

              </AlertDialogContent>

            </AlertDialog>

            {/* ===================== TABLE ===================== */}

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

              <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-neutral-800 sm:px-5">

                <div>

                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">

                    Remittance Records

                  </h3>

                  <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">

                    COD transaction and settlement details

                  </p>

                </div>

                <div className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">

                  {data.length} Records

                </div>

              </div>

              <div className="min-h-0 w-full flex-1 overflow-auto overscroll-contain">

                <table className="min-w-[1050px] w-full border-separate border-spacing-0 text-sm">

                  <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-neutral-800">

                    <tr className="border-b border-gray-200 bg-slate-50 dark:border-neutral-800 dark:bg-neutral-800">

                      {canSelectOrders && (

                        <th className="w-[60px] px-5 py-3.5 text-center">

                          <input

                            type="checkbox"

                            className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#0446DB]"

                            checked={

                              data.some(isAdjustable) &&

                              data

                                .filter(isAdjustable)

                                .every((row) =>

                                  selectedBulkOrders.some(

                                    (selected) => selected.order_id === row.order_id,

                                  ),

                                )

                            }

                            onChange={toggleSelectAll}

                          />

                        </th>

                      )}

                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">

                        Rider

                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">

                        Order Details

                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">

                        Amount

                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">

                        Received By

                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">

                        Remarks

                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">

                        Current Holder

                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">

                        Status

                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">

                    {loading ? (

                      <tr key={"No record found"}>

                        <td

                          colSpan={canSelectOrders ? "8" : "7"}

                          className="px-6 py-16 text-center text-gray-500"

                        >

                          <div className="flex w-full items-center justify-center">

                            <div>

                              <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#0446DB]" />

                              <p className="mt-3 text-sm text-gray-500 dark:text-neutral-400">

                                Loading COD Remittances...

                              </p>

                            </div>

                          </div>

                        </td>

                      </tr>

                    ) : data.length == 0 ? (

                      <tr key={"No record found"}>

                        <td

                          colSpan={canSelectOrders ? "8" : "7"}

                          className="px-6 py-16 text-center"

                        >

                          <div className="mx-auto max-w-sm">

                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm bg-gray-100 text-gray-400 dark:bg-neutral-800 dark:text-neutral-500">

                              ₹

                            </div>

                            <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-neutral-200">

                              No records found

                            </p>

                            <p className="mt-1 text-xs text-gray-400 dark:text-neutral-500">

                              Try changing the selected status or filters.

                            </p>

                          </div>

                        </td>

                      </tr>

                    ) : (

                      data.map((d, index) => {

                        let isSelected;

                        if (canSelectOrders) {

                          isSelected = selectedBulkOrders.some((o) => o.order_id === d.order_id);

                        }

                        return (

                          <tr

                            key={index}

                            className={`transition-colors hover:bg-gray-50/80 dark:hover:bg-neutral-800/40 ${

                              isSelected ? "bg-[#0446DB]/[0.035] dark:bg-[#0446DB]/10" : ""

                            }`}

                          >

                            {canSelectOrders && (

                              <td className="px-5 py-4 text-center">

                                <input

                                  type="checkbox"

                                  checked={isSelected}

                                  disabled={!isAdjustable(d)}

                                  onChange={(e) => toggleOrder(d, e.target.checked)}

                                  className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#0446DB]"

                                />

                              </td>

                            )}

                            <td className="px-5 py-4 align-top">

                              <div className="min-w-[160px]">

                                <p className="text-sm font-semibold text-gray-900 dark:text-white">

                                  {d.rider_name || "-"}

                                </p>

                                <p className="mt-1 text-xs font-medium text-gray-400 dark:text-neutral-500">

                                  {

                                    d?.rider_vendor_id ? (

                                      <>

                                      FP_{d?.rider_vendor_id}_{d.rider_id}

                                      </>

                                    ) : (

                                      <>

                                        DC_{d.rider_id}

                                      </>

                                    )

                                  }

                                </p>

                              </div>

                            </td>

                            <td className="px-5 py-4 align-top">

                              <div className="min-w-[250px]">

                                <div className="flex items-center gap-1.5">

                                  <a

                                    href={`${frontEndURL}/track-order?awb_number=${d.awb_number}`}

                                    target="_blank"

                                    rel="noopener noreferrer"

                                    className="font-semibold text-[#0446DB] hover:underline dark:text-blue-400"

                                  >

                                    {d.awb_number}

                                  </a>

                                  <button

                                    className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-[#0446DB]/10 hover:text-[#0446DB] dark:hover:bg-blue-500/10 dark:hover:text-blue-400"

                                    onClick={() => {

                                      navigator.clipboard.writeText(d.awb_number);

                                      setCopySuccess(d.awb_number);

                                      setTimeout(() => {

                                        setCopySuccess(null);

                                      }, 2000);

                                    }}

                                  >

                                    {copySuccess === d.awb_number ? (

                                      <CiCircleCheck className="text-lg text-emerald-500" />

                                    ) : (

                                      <FaRegCopy />

                                    )}

                                  </button>

                                </div>

                                <p className="mt-1.5 text-xs text-gray-500 dark:text-neutral-400">

                                  {new Date(d.submitted_at).toLocaleString("en-IN", {

                                    timeZone: "Asia/Kolkata",

                                    day: "2-digit",

                                    month: "2-digit",

                                    year: "numeric",

                                    hour: "2-digit",

                                    minute: "2-digit",

                                    hour12: true,

                                  })}

                                </p>

                                <div className="mt-1 flex items-center gap-1">

                                  <p className="max-w-[190px] truncate text-xs text-gray-400 dark:text-neutral-500">

                                    Order ID:{" "}

                                    {d.merchant_order_id?.length <= 20

                                      ? d.merchant_order_id

                                      : d.merchant_order_id?.slice(0, 20) + "..."}

                                  </p>

                                  <button

                                    className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition hover:bg-[#0446DB]/10 hover:text-[#0446DB] dark:hover:bg-blue-500/10 dark:hover:text-blue-400"

                                    onClick={() => {

                                      navigator.clipboard.writeText(d.merchant_order_id);

                                      setCopySuccess(d.merchant_order_id);

                                      setTimeout(() => {

                                        setCopySuccess(null);

                                      }, 2000);

                                    }}

                                  >

                                    {copySuccess === d.merchant_order_id ? (

                                      <CiCircleCheck className="text-base text-emerald-500" />

                                    ) : (

                                      <FaRegCopy className="text-xs" />

                                    )}

                                  </button>

                                </div>

                              </div>

                            </td>

                            <td className="px-5 py-4 align-top">

                              <span className="whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">

                                ₹{Number(d.amount || 0).toLocaleString("en-IN")}

                              </span>

                            </td>

                            <td className="px-5 py-4 align-top text-sm text-gray-600 dark:text-neutral-300">

                              {d._receivedby__ || "-"}

                            </td>

                            <td className="px-5 py-4 align-top">

                              <p

                                className="max-w-[220px] truncate text-sm text-gray-500 dark:text-neutral-400"

                                title={d.remarks || "NA"}

                              >

                                {d.remarks || "NA"}

                              </p>

                            </td>

                            <td className="px-5 py-4 align-top">

                            <p

                            className={`max-w-[220px] truncate text-sm font-semibold ${

                              d.current_holder === "dc"

                                ? "text-emerald-600 dark:text-emerald-400"

                                : d.current_holder === "rider"

                                  ? "text-blue-600 dark:text-blue-400"

                                  : d.current_holder === "vendor"

                                    ? "text-orange-600 dark:text-orange-400"

                                    : d.current_holder === "admin"

                                      ? "text-purple-600 dark:text-purple-400"

                                      : "text-gray-400"

                            }`}

                          >

                            {!d.current_holder

                              ? "-"

                              : d.current_holder === "dc"

                                ? "Self"

                                : d.current_holder.charAt(0).toUpperCase() +

                                  d.current_holder.slice(1)}

                          </p>

                            </td>

                            <td className="px-5 py-4 align-top">

                              {d.status === "pending" ? (

                                <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">

                                  Pending

                                </span>

                              ) : d.status === "initiated" ? (

                                <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">

                                  Initiated

                                </span>

                              ) : d.status === "adjusted" ? (

                                <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">

                                  Received

                                </span>

                              ) : (

                                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">

                                  Submitted

                                </span>

                              )}

                            </td>

                          </tr>

                        );

                      })

                    )}

                  </tbody>

                </table>

              </div>

              {/* ===================== PAGINATION ===================== */}

              <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-3 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:px-5">

                <p className="text-xs text-gray-500 dark:text-neutral-400">

                  Page <span className="font-semibold text-gray-900 dark:text-white">{page}</span>{" "}

                  of{" "}

                  <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>

                </p>

                <div className="flex items-center gap-2">

                  <button

                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}

                    disabled={page === 1}

                    className={`h-9 rounded-lg border px-4 text-sm font-semibold transition ${

                      page === 1

                        ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-600"

                        : "border-gray-200 bg-white text-gray-700 hover:border-[#0446DB]/30 hover:bg-[#0446DB]/5 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-[#0446DB]/10 dark:hover:text-blue-400"

                    }`}

                  >

                    Previous

                  </button>

                  <button

                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}

                    disabled={page === totalPages}

                    className={`h-9 rounded-lg border px-4 text-sm font-semibold transition ${

                      page === totalPages

                        ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-600"

                        : "border-[#0446DB] bg-[#0446DB] text-white hover:bg-[#0339B5]"

                    }`}

                  >

                    Next

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </>

  );

}

export default VendorCodRemittance;
