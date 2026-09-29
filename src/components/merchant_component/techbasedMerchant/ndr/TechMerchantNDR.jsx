
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import {
//   FaRegCopy,
//   FaFilter,
//   FaHistory,
//   FaFileUpload,
//   FaFileCsv,
//   FaTimes,
// } from "react-icons/fa";

// import { CiCircleCheck } from "react-icons/ci";
// import { TbFileInfo } from "react-icons/tb";

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

// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// const baseURL = import.meta.env.VITE_BASE_URL;

// function TechMerchantNDR() {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState([]);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(50);
//   const [totalPages, setTotalPages] = useState(1);

//   const [historyItem, setHistoryItem] = useState(null);
//   const [copySuccess, setCopySuccess] = useState(null);

//   const [editingStatusId, setEditingStatusId] = useState(null);
//   const [newStatus, setNewStatus] = useState("");

//   const [selectedFilter, setSelectedFilter] = useState("");
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [filterUpdate, setFilterUpdate] = useState(false);

//   const [advanceFilters, setAdvanceFilters] = useState({
//     startDate: "",
//     endDate: "",
//     awb_number: "",
//   });

//   const filters = [
//     ["All", ""],
//     ["Action Required", "actionable"],
//     ["Action Taken", "actiontaken"],
//     ["RTO", "rto"],
//     ["Delivered", "delivered"],
//   ];

//   function toCapitalizeEachWord(str) {
//     if (!str) return "";

//     return str
//       .split(" ")
//       .map((word) => {
//         if (!word) return "";
//         return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//       })
//       .join(" ");
//   }

//   const resetAdvanceFilters = () => {
//     const today = new Date();
//     const oneMonthAgo = new Date();

//     oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

//     setAdvanceFilters({
//       endDate: today.toISOString().split("T")[0],
//       startDate: oneMonthAgo.toISOString().split("T")[0],
//       awb_number: "",
//     });
//   };

//   useEffect(() => {
//     resetAdvanceFilters();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);

//     try {
//       const res = await axios.get(
//         `${baseURL}/api/tech-merchant/getMerchantNDRs`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           params: {
//             page,
//             limit,
//             start_date: advanceFilters.startDate,
//             end_date: advanceFilters.endDate,
//             awb_number: advanceFilters.awb_number,
//             statusType: selectedFilter,
//           },
//         },
//       );
      
      


//       setData(res?.data?.data || []);

//       const total = res?.data?.pagination?.total || 0;
//       const apiLimit = res?.data?.pagination?.limit || limit;

//       setTotalPages(Math.ceil(Math.max(1, total) / apiLimit));
//       setLimit(apiLimit);
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Failed to fetch NDR data",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [selectedFilter, filterUpdate, page]);

//   const handleChange = async (e) => {
//     const file = e.target.files?.[0];

//     if (!file) return;

//     setLoading(true);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       await axios.post(
//         `${baseURL}/api/techbasedmerchant/handleMerchantNDRBulkAction`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "multipart/form-data",
//           },
//         },
//       );

//       toast.success("File uploaded successfully");
//       await fetchData();
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Error while uploading bulk NDR file",
//       );
//     } finally {
//       e.target.value = "";
//       setLoading(false);
//     }
//   };

//   const changeStatus = async (payload, ndr_id) => {
//     setLoading(true);

//     try {
//       const res = await axios.post(
//         `${baseURL}/api/techbasedmerchant/handleMerchantNDRAction/${ndr_id}`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );

//       await fetchData();

//       setEditingStatusId(null);
//       setNewStatus("");

//       toast.success(
//         res?.data?.message || "NDR action updated successfully",
//       );
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message ||
//           "Failed to take action on current NDR",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleHistoryClick = async (item) => {
//     try {
//       setHistoryItem(null);

//       const res = await axios.get(
//         `${baseURL}/api/tech-merchant/getOrderDetailsByMerchant`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           params: {
//             awb_number: item.awb_number,
//           },
//         },
//       );

//       setHistoryItem(res?.data?.ndr_details?.actions || []);
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Error while fetching NDR history",
//       );
//     }
//   };

//   const downloadFile = (blob, fileName) => {
//     const url = window.URL.createObjectURL(new Blob([blob]));
//     const link = document.createElement("a");

//     link.href = url;
//     link.setAttribute("download", fileName);

//     document.body.appendChild(link);
//     link.click();
//     link.remove();

//     window.URL.revokeObjectURL(url);
//   };

//   const Sample = async () => {
//     setLoading(true);

//     try {
//       const res = await axios.get(
//         `${baseURL}/api/techbasedmerchant/downloadMerchantNDRSampleFile`,
//         {
//           responseType: "blob",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );

//       downloadFile(res.data, "NDR Action Format.csv");
//       toast.success("Sample file downloaded successfully");
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Failed to download sample file",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const exportCSV = async () => {
//     setLoading(true);

//     try {
//       const res = await axios.post(
//         `${baseURL}/api/tech-merchant/exportNDRs`,
//         {},
//         {
//           params: {
//             start_date: advanceFilters.startDate,
//             end_date: advanceFilters.endDate,
//             awb_number: advanceFilters.awb_number,
//             statusType: selectedFilter,
//           },
//           responseType: "blob",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );

//       downloadFile(res.data, "NDR Export.csv");
//       toast.success("NDR data exported successfully");
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Failed to export NDR data",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApplyFilters = () => {
//     setPage(1);
//     setFilterUpdate((prev) => !prev);
//     setIsFilterOpen(false);
//   };

//   const handleResetFilters = () => {
//     const today = new Date();
//     const oneMonthAgo = new Date();

//     oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

//     setAdvanceFilters({
//       endDate: today.toISOString().split("T")[0],
//       startDate: oneMonthAgo.toISOString().split("T")[0],
//       awb_number: "",
//     });

//     setPage(1);
//     setFilterUpdate((prev) => !prev);
//     setIsFilterOpen(false);
//   };

//   const copyAwb = async (awb) => {
//     try {
//       await navigator.clipboard.writeText(awb);

//       setCopySuccess(awb);
//       setTimeout(() => setCopySuccess(null), 2000);

//       toast.success("AWB copied to clipboard");
//     } catch {
//       toast.error("Unable to copy AWB");
//     }
//   };

//   const getStatusColor = (status) => {
//     const statusColors = {
//       actionable:
//         "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",

//       actiontaken:
//         "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",

//       rto:
//         "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",

//       delivered:
//         "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",

//       default:
//         "bg-gray-100 text-gray-700 border-gray-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700",
//     };

//     return statusColors[status] || statusColors.default;
//   };

//   return (
//     <>
     
//         <div className="min-h-screen bg-[#f5f8fb] text-gray-900 transition-colors dark:bg-neutral-950 dark:text-neutral-100">
//           {/* =====================================================
//               HEADER
//           ====================================================== */}
//           <header className="border-b border-blue-500/20  dark:border-neutral-800 dark:bg-neutral-900">
//             <div className="mx-auto px-4 py-4">
//               <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//                 <div>
//                   <h1 className="text-2xl font-bold dark:text-white sm:text-3xl">
//                     NDR Management
//                   </h1>

//                   <p className="mt-1 text-sm dark:text-blue-100 dark:text-neutral-400">
//                     Manage Non-Delivery Reports efficiently
//                   </p>
//                 </div>

//                 <div className="flex flex-wrap items-center gap-2">
//                   {/* Bulk Action */}
//                   <label className="relative inline-flex cursor-pointer items-center gap-2 rounded-sm bg-white px-4 py-2.5 text-sm font-semibold text-[#0446DB] shadow-sm transition hover:bg-blue-50 dark:border dark:border-neutral-700 dark:bg-neutral-800 dark:text-blue-400 dark:hover:bg-neutral-700">
//                     <FaFileUpload className="h-4 w-4" />

//                     <span>Bulk Action</span>

//                     <input
//                       type="file"
//                       name="bulk_ndr"
//                       onChange={handleChange}
//                       accept=".csv"
//                       className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
//                     />
//                   </label>

//                   <Button
//                     type="button"
//                     onClick={Sample}
//                     className="flex items-center gap-2 rounded-sm bg-white px-4 py-2.5 font-semibold text-[#0446DB] shadow-sm transition hover:bg-blue-50 hover:text-[#0446DB] dark:border dark:border-neutral-700 dark:bg-neutral-800 dark:text-blue-400 dark:hover:bg-neutral-700"
//                   >
//                     <FaFileCsv className="h-4 w-4" />
//                     Sample
//                   </Button>

//                   <Button
//                     type="button"
//                     onClick={exportCSV}
//                     className="flex items-center gap-2 rounded-sm bg-white px-4 py-2.5 font-semibold text-[#0446DB] shadow-sm transition hover:bg-blue-50 hover:text-[#0446DB] dark:border dark:border-neutral-700 dark:bg-neutral-800 dark:text-blue-400 dark:hover:bg-neutral-700"
//                   >
//                     <FaFileCsv className="h-4 w-4" />
//                     Export
//                   </Button>

//                   {/* Filter Drawer */}
//                   <Drawer
//                     direction="right"
//                     open={isFilterOpen}
//                     onOpenChange={setIsFilterOpen}
//                   >
//                     <DrawerTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className="flex items-center gap-2 rounded-sm border-0 bg-white px-4 py-2.5 font-semibold text-[#0446DB] shadow-sm transition hover:bg-blue-50 hover:text-[#0446DB] dark:border dark:border-neutral-700 dark:bg-neutral-800 dark:text-blue-400 dark:hover:bg-neutral-700"
//                       >
//                         <FaFilter className="text-sm" />
//                         Filter
//                       </Button>
//                     </DrawerTrigger>

//                     <DrawerContent className="ml-auto h-full w-full max-w-md rounded-none border-l border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
//                       <DrawerHeader className="border-b border-gray-100 px-5 py-5 dark:border-neutral-800">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <DrawerTitle className="text-xl font-bold text-gray-900 dark:text-white">
//                               Advanced Filters
//                             </DrawerTitle>

//                             <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
//                               Filter NDR records by date and AWB.
//                             </p>
//                           </div>

//                           <DrawerClose asChild>
//                             <button
//                               type="button"
//                               className="flex h-9 w-9 items-center justify-center rounded-sm text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white"
//                             >
//                               <FaTimes className="h-4 w-4" />
//                             </button>
//                           </DrawerClose>
//                         </div>
//                       </DrawerHeader>

//                       <form
//                         onSubmit={(e) => {
//                           e.preventDefault();
//                           handleApplyFilters();
//                         }}
//                         className="flex min-h-0 flex-1 flex-col"
//                       >
//                         <div className="flex-1 space-y-5 overflow-y-auto p-5">
//                           <div>
//                             <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-neutral-300">
//                               Start Date
//                             </label>

//                             <input
//                               type="date"
//                               value={advanceFilters.startDate}
//                               onChange={(e) =>
//                                 setAdvanceFilters((prev) => ({
//                                   ...prev,
//                                   startDate: e.target.value,
//                                 }))
//                               }
//                               onClick={(e) =>
//                                 e.currentTarget.showPicker?.()
//                               }
//                               className="w-full rounded-sm border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:[color-scheme:dark]"
//                             />
//                           </div>

//                           <div>
//                             <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-neutral-300">
//                               End Date
//                             </label>

//                             <input
//                               type="date"
//                               value={advanceFilters.endDate}
//                               onChange={(e) =>
//                                 setAdvanceFilters((prev) => ({
//                                   ...prev,
//                                   endDate: e.target.value,
//                                 }))
//                               }
//                               onClick={(e) =>
//                                 e.currentTarget.showPicker?.()
//                               }
//                               className="w-full rounded-sm border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:[color-scheme:dark]"
//                             />
//                           </div>

//                           <div>
//                             <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-neutral-300">
//                               AWB Number
//                             </label>

//                             <input
//                               type="text"
//                               value={advanceFilters.awb_number}
//                               onChange={(e) =>
//                                 setAdvanceFilters((prev) => ({
//                                   ...prev,
//                                   awb_number: e.target.value,
//                                 }))
//                               }
//                               placeholder="Enter AWB Number"
//                               className="w-full rounded-sm border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
//                             />
//                           </div>

//                           <div className="rounded-sm border border-blue-100 bg-blue-50 px-3 py-2.5 text-xs font-medium text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
//                             Press Enter after entering AWB to apply filters.
//                           </div>
//                         </div>

//                         <DrawerFooter className="border-t border-gray-100 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
//                           <div className="grid grid-cols-2 gap-3">
//                             <button
//                               type="button"
//                               onClick={handleResetFilters}
//                               className="rounded-sm border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
//                             >
//                               Reset
//                             </button>

//                             <button
//                               type="submit"
//                               className="rounded-sm bg-[#0446DB] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
//                             >
//                               Apply Filters
//                             </button>
//                           </div>
//                         </DrawerFooter>
//                       </form>
//                     </DrawerContent>
//                   </Drawer>
//                 </div>
//               </div>
//             </div>
//           </header>

//           {/* =====================================================
//               STATUS FILTERS
//           ====================================================== */}
//           <main>
//             <div className="border-b border-gray-200 bg-white px-3 dark:border-neutral-800 dark:bg-neutral-900">
//               <div className="overflow-x-auto">
//                 <div className="flex min-w-max justify-center gap-2 py-3">
//                   {filters.map((filter, index) => (
//                     <Button
//                       key={index}
//                       type="button"
//                       onClick={() => {
//                         setSelectedFilter(filter[1]);
//                         setPage(1);
//                       }}
//                       className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all ${
//                         selectedFilter === filter[1]
//                           ? "border-[#0446DB] bg-[#0446DB] text-white shadow-sm hover:bg-blue-700"
//                           : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-blue-500 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
//                       }`}
//                     >
//                       {filter[0]}
//                     </Button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* ===================================================
//                 TABLE
//             ==================================================== */}
//             <div className="border-b border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
//               <div className="overflow-x-auto">
//                 {data.length > 0 ? (
//                   <table className="min-w-full">
//                     <thead className="border-b border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-950">
//                       <tr>
//                         {[
//                           "NDR Information",
//                           "Order Details",
//                           "Customer Information",
//                           "Status & Actions",
//                         ].map((item) => (
//                           <th
//                             key={item}
//                             className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-neutral-400"
//                           >
//                             {item}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>

//                     <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
//                       {data.map((d) => (
//                         <tr
//                           key={d.ndr_id}
//                           className="transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/60"
//                         >
//                           {/* NDR */}
//                           <td className="px-6 py-4">
//                             <p className="font-semibold text-gray-900 dark:text-neutral-100">
//                               NDR #{d.ndr_id}
//                             </p>

//                             <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
//                               {new Date(d.created_at).toLocaleString("en-IN", {
//                                 timeZone: "Asia/Kolkata",
//                                 day: "2-digit",
//                                 month: "2-digit",
//                                 year: "numeric",
//                                 hour: "2-digit",
//                                 minute: "2-digit",
//                                 hour12: true,
//                               })}
//                             </p>
//                           </td>

//                           {/* Order */}
//                           <td className="px-6 py-4">
//                             <div className="space-y-1.5 text-sm">
//                               <div className="flex items-center gap-1.5">
//                                 <span className="whitespace-nowrap font-medium text-gray-500 dark:text-neutral-500">
//                                   Order ID:
//                                 </span>

//                                 <span className="font-semibold text-gray-800 dark:text-neutral-200">
//                                   {d.id}
//                                 </span>
//                               </div>

//                               <div className="flex items-center gap-1.5">
//                                 <span className="whitespace-nowrap font-medium text-gray-500 dark:text-neutral-500">
//                                   Merchant Order ID:
//                                 </span>

//                                 <span className="text-gray-800 dark:text-neutral-300">
//                                   {d.merchant_order_id}
//                                 </span>
//                               </div>

//                               <div className="flex items-center gap-1.5">
//                                 <span className="whitespace-nowrap font-medium text-gray-500 dark:text-neutral-500">
//                                   AWB:
//                                 </span>

//                                 <div className="flex items-center gap-1">
//                                   <span className="font-mono font-semibold text-gray-800 dark:text-neutral-200">
//                                     {d.awb_number}
//                                   </span>

//                                   <button
//                                     type="button"
//                                     onClick={() => copyAwb(d.awb_number)}
//                                     className="rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-[#0446DB] dark:text-neutral-500 dark:hover:bg-neutral-700 dark:hover:text-blue-400"
//                                   >
//                                     {copySuccess === d.awb_number ? (
//                                       <CiCircleCheck className="h-4 w-4 text-emerald-500" />
//                                     ) : (
//                                       <FaRegCopy className="h-3.5 w-3.5" />
//                                     )}
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           </td>

//                           {/* Customer */}
//                           <td className="max-w-[360px] px-6 py-4">
//                             <p className="font-semibold text-gray-900 dark:text-neutral-100">
//                               {d.delivery_contact_name}
//                             </p>

//                             <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
//                               {d.delivery_address_line}
//                             </p>

//                             <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
//                               {d.delivery_city}, {d.delivery_state} -{" "}
//                               {d.delivery_pincode}
//                             </p>

//                             <p className="mt-0.5 text-xs text-gray-400 dark:text-neutral-600">
//                               {d.delivery_country}
//                             </p>
//                           </td>

//                           {/* Status */}
//                           <td className="px-6 py-4">
//                             <div className="flex flex-wrap items-center gap-2">
//                               <span
//                                 className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusColor(
//                                   d.status,
//                                 )}`}
//                               >
//                                 {toCapitalizeEachWord(d.status) || "Pending"}
//                               </span>

//                               {selectedFilter === "actionable" && (
//                                 <Button
//                                   type="button"
//                                   onClick={() => {
//                                     setEditingStatusId(d.ndr_id);
//                                     setNewStatus("");
//                                   }}
//                                   className="rounded-sm bg-[#0446DB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
//                                 >
//                                   Take Action
//                                 </Button>
//                               )}

//                               <Dialog>
//                                 <DialogTrigger asChild>
//                                   <Button
//                                     type="button"
//                                     variant="outline"
//                                     onClick={() => handleHistoryClick(d)}
//                                     className="h-9 w-9 rounded-sm border-gray-200 p-0 text-gray-500 hover:border-blue-300 hover:bg-blue-50 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-blue-500 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
//                                   >
//                                     <TbFileInfo className="h-4 w-4" />
//                                   </Button>
//                                 </DialogTrigger>

//                                 <DialogContent className="max-h-[85vh] overflow-hidden border-gray-200 bg-white sm:max-w-4xl dark:border-neutral-800 dark:bg-neutral-900">
//                                   <DialogHeader className="border-b border-gray-100 pb-4 dark:border-neutral-800">
//                                     <DialogTitle className="text-gray-900 dark:text-white">
//                                       NDR Action History
//                                     </DialogTitle>
//                                   </DialogHeader>

//                                   <div className="max-h-[60vh] overflow-y-auto py-2">
//                                     {historyItem === null ? (
//                                       <div className="py-10 text-center text-sm text-gray-500 dark:text-neutral-500">
//                                         Loading history...
//                                       </div>
//                                     ) : historyItem.length > 0 ? (
//                                       <div className="space-y-3">
//                                         {historyItem.map((item, index) => (
//                                           <div
//                                             key={item.action_id || index}
//                                             className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-500/20 dark:bg-blue-500/5"
//                                           >
//                                             <div className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
//                                               {item.action_taken ===
//                                               "change_address"
//                                                 ? "Change Address"
//                                                 : item.action_taken ===
//                                                     "change_phone"
//                                                   ? "Change Phone Number"
//                                                   : item.action_taken ===
//                                                       "reattempt"
//                                                     ? "Reattempt"
//                                                     : toCapitalizeEachWord(
//                                                         item.action_taken,
//                                                       )}
//                                             </div>

//                                             <div className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
//                                               {item.action_taken ===
//                                               "change_phone" ? (
//                                                 <>
//                                                   <span className="font-semibold text-gray-700 dark:text-neutral-300">
//                                                     Phone Number:
//                                                   </span>{" "}
//                                                   {item.customer_phone}
//                                                 </>
//                                               ) : item.action_taken ===
//                                                 "change_address" ? (
//                                                 <>
//                                                   <div>
//                                                     <span className="font-semibold text-gray-700 dark:text-neutral-300">
//                                                       Name:
//                                                     </span>{" "}
//                                                     {item.customer_name}
//                                                   </div>

//                                                   <div className="mt-1">
//                                                     <span className="font-semibold text-gray-700 dark:text-neutral-300">
//                                                       Address:
//                                                     </span>{" "}
//                                                     {
//                                                       item.customer_details_address
//                                                     }
//                                                   </div>
//                                                 </>
//                                               ) : (
//                                                 <>
//                                                   <span className="font-semibold text-gray-700 dark:text-neutral-300">
//                                                     Remarks:
//                                                   </span>{" "}
//                                                   {item.remarks || "-"}
//                                                 </>
//                                               )}
//                                             </div>

//                                             <div className="mt-2 text-xs text-gray-500 dark:text-neutral-500">
//                                               <span className="font-semibold">
//                                                 Date/Time:
//                                               </span>{" "}
//                                               {new Date(
//                                                 item.created_at,
//                                               ).toLocaleString("en-IN", {
//                                                 timeZone: "Asia/Kolkata",
//                                                 day: "2-digit",
//                                                 month: "2-digit",
//                                                 year: "numeric",
//                                                 hour: "2-digit",
//                                                 minute: "2-digit",
//                                                 hour12: true,
//                                               })}
//                                             </div>
//                                           </div>
//                                         ))}
//                                       </div>
//                                     ) : (
//                                       <div className="py-10 text-center text-sm text-gray-500 dark:text-neutral-500">
//                                         No history found for this NDR
//                                       </div>
//                                     )}
//                                   </div>

//                                   <DialogFooter className="border-t border-gray-100 pt-4 dark:border-neutral-800">
//                                     <DialogClose asChild>
//                                       <Button
//                                         variant="outline"
//                                         className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
//                                       >
//                                         Close
//                                       </Button>
//                                     </DialogClose>
//                                   </DialogFooter>
//                                 </DialogContent>
//                               </Dialog>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
//                     <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">
//                       <FaHistory className="h-7 w-7 text-gray-400 dark:text-neutral-600" />
//                     </div>

//                     <p className="mt-4 text-base font-semibold text-gray-600 dark:text-neutral-300">
//                       No NDR records found
//                     </p>

//                     <p className="mt-1 text-sm text-gray-400 dark:text-neutral-500">
//                       Try adjusting your filters or search terms
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Pagination */}
//               {data.length > 0 && (
//                 <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950">
//                   <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                     <p className="text-sm text-gray-600 dark:text-neutral-400">
//                       Showing page{" "}
//                       <span className="font-semibold text-gray-900 dark:text-white">
//                         {page}
//                       </span>{" "}
//                       of{" "}
//                       <span className="font-semibold text-gray-900 dark:text-white">
//                         {totalPages}
//                       </span>
//                     </p>

//                     <div className="flex items-center gap-2">
//                       <button
//                         type="button"
//                         onClick={() =>
//                           setPage((prev) => Math.max(prev - 1, 1))
//                         }
//                         disabled={page === 1}
//                         className="rounded-sm border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
//                       >
//                         Previous
//                       </button>

//                       <span className="rounded-sm border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
//                         {page} / {totalPages}
//                       </span>

//                       <button
//                         type="button"
//                         onClick={() =>
//                           setPage((prev) =>
//                             Math.min(prev + 1, totalPages),
//                           )
//                         }
//                         disabled={page === totalPages}
//                         className="rounded-sm bg-[#0446DB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
//                       >
//                         Next
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </main>

//           {/* =====================================================
//               TAKE ACTION MODAL
//           ====================================================== */}
//           {editingStatusId && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 backdrop-blur-[2px]">
//               <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
//                 <div className="flex items-center justify-between bg-[#0446DB] px-5 py-4 dark:bg-neutral-950">
//                   <div>
//                     <h2 className="text-lg font-bold text-white">
//                       Take Action
//                     </h2>

//                     <p className="mt-0.5 text-xs text-blue-100 dark:text-neutral-400">
//                       Update NDR action details
//                     </p>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={() => {
//                       setEditingStatusId(null);
//                       setNewStatus("");
//                     }}
//                     className="flex h-8 w-8 items-center justify-center rounded-sm bg-white/10 text-white transition hover:bg-white/20"
//                   >
//                     <FaTimes className="h-4 w-4" />
//                   </button>
//                 </div>

//                 <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
//                   <form
//                     onSubmit={async (e) => {
//                       e.preventDefault();

//                       const form = e.currentTarget;

//                       const status = form.elements.status?.value || "";
//                       const remarks = form.elements.remarks?.value || "";
//                       const phone = form.elements.phone?.value || "";
//                       const name = form.elements.name?.value || "";
//                       const address1 = form.elements.address1?.value || "";

//                       const payload = {
//                         action: status,
//                         remarks,
//                         customer_name: name,
//                         customer_details_address: address1,
//                         customer_phone: phone,
//                       };

//                       await changeStatus(payload, editingStatusId);
//                     }}
//                     className="space-y-4"
//                   >
//                     <div>
//                       <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-neutral-400">
//                         Action
//                       </label>

//                       <select
//                         name="status"
//                         defaultValue=""
//                         onChange={(e) => setNewStatus(e.target.value)}
//                         required
//                         className="w-full rounded-sm border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
//                       >
//                         <option disabled value="">
//                           Change Status
//                         </option>

//                         <option value="change_address">
//                           Change Address
//                         </option>

//                         <option value="change_phone">
//                           Change Phone Number
//                         </option>

//                         <option value="reattempt">Reattempt</option>

//                         <option value="rto">RTO</option>
//                       </select>
//                     </div>

//                     {newStatus === "change_phone" && (
//                       <div>
//                         <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-neutral-400">
//                           Phone Number
//                         </label>

//                         <input
//                           type="tel"
//                           name="phone"
//                           placeholder="Enter phone number"
//                           className="w-full rounded-sm border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
//                         />
//                       </div>
//                     )}

//                     {newStatus === "change_address" && (
//                       <>
//                         <div>
//                           <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-neutral-400">
//                             Customer Name
//                           </label>

//                           <input
//                             type="text"
//                             name="name"
//                             placeholder="Enter customer name"
//                             className="w-full rounded-sm border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
//                           />
//                         </div>

//                         <div>
//                           <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-neutral-400">
//                             Customer Address
//                           </label>

//                           <textarea
//                             name="address1"
//                             rows={3}
//                             placeholder="Enter customer address"
//                             className="w-full resize-none rounded-sm border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
//                           />
//                         </div>
//                       </>
//                     )}

//                     <div>
//                       <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-neutral-400">
//                         Remarks
//                       </label>

//                       <input
//                         type="text"
//                         name="remarks"
//                         placeholder="Enter remarks"
//                         className="w-full rounded-sm border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
//                       />
//                     </div>

//                     <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-neutral-800">
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setEditingStatusId(null);
//                           setNewStatus("");
//                         }}
//                         className="rounded-sm border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
//                       >
//                         Close
//                       </button>

//                       <button
//                         type="submit"
//                         className="rounded-sm bg-[#0446DB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
//                       >
//                         Update
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
    
//     </>
//   );
// }

// export default TechMerchantNDR;







import { useEffect, useState } from "react";

import axios from "axios";

import { toast } from "react-toastify";

import {

  FaRegCopy,

  FaFilter,

  FaHistory,

  FaFileUpload,

  FaFileCsv,

  FaTimes,

} from "react-icons/fa";

import { CiCircleCheck } from "react-icons/ci";

import { TbFileInfo } from "react-icons/tb";

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

import {

  Dialog,

  DialogClose,

  DialogContent,

  DialogFooter,

  DialogHeader,

  DialogTitle,

  DialogTrigger,

} from "@/components/ui/dialog";
import AxiosInstance from "../../../../Helper/axiosInstance";

const baseURL = import.meta.env.VITE_BASE_URL;

function TechMerchantNDR() {

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(50);

  const [totalPages, setTotalPages] = useState(1);

  const [historyItem, setHistoryItem] = useState(null);

  const [copySuccess, setCopySuccess] = useState(null);

  const [editingStatusId, setEditingStatusId] = useState(null);

  const [newStatus, setNewStatus] = useState("");
  const [newRTORemarkStatus, setRTORemarksStatus] = useState("");

  const [selectedFilter, setSelectedFilter] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filterUpdate, setFilterUpdate] = useState(false);

  const [advanceFilters, setAdvanceFilters] = useState({

    startDate: "",

    endDate: "",

    awb_number: "",

  });

  const filters = [

    ["All", ""],

    ["Action Required", "actionable"],

    ["Action Taken", "actiontaken"],

    ["RTO", "rto"],

    ["Delivered", "delivered"],

  ];

  function toCapitalizeEachWord(str) {

    if (!str) return "";

    return str

      .split(" ")

      .map((word) => {

        if (!word) return "";

        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

      })

      .join(" ");

  }

  const resetAdvanceFilters = () => {

    const today = new Date();

    const oneMonthAgo = new Date();

    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    setAdvanceFilters({

      endDate: today.toISOString().split("T")[0],

      startDate: oneMonthAgo.toISOString().split("T")[0],

      awb_number: "",

    });

  };

  useEffect(() => {

    resetAdvanceFilters();

  }, []);

  const fetchData = async () => {

    setLoading(true);

    try {

      const res = await axios.get(

        `${baseURL}/api/tech-merchant/getMerchantNDRs`,

        {

          headers: {

            Authorization: `Bearer ${localStorage.getItem("token")}`,

          },

          params: {

            page,

            limit,

            start_date: advanceFilters.startDate,

            end_date: advanceFilters.endDate,

            awb_number: advanceFilters.awb_number,

            statusType: selectedFilter,

          },

        },

      );







      setData(res?.data?.data || []);

      const total = res?.data?.pagination?.total || 0;

      const apiLimit = res?.data?.pagination?.limit || limit;

      setTotalPages(Math.ceil(Math.max(1, total) / apiLimit));

      setLimit(apiLimit);

    } catch (err) {

      toast.error(

        err?.response?.data?.message ||

          err?.message ||

          "Failed to fetch NDR data",

      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchData();

  }, [selectedFilter, filterUpdate, page]);

  const handleChange = async (e) => {

    const file = e.target.files?.[0];

    if (!file) return;

    setLoading(true);

    const formData = new FormData();

    formData.append("file", file);

    try {

      await axios.post(

        `${baseURL}/api/techbasedmerchant/handleMerchantNDRBulkAction`,

        formData,

        {

          headers: {

            Authorization: `Bearer ${localStorage.getItem("token")}`,

            "Content-Type": "multipart/form-data",

          },

        },

      );

      toast.success("File uploaded successfully");

      await fetchData();

    } catch (err) {

      toast.error(

        err?.response?.data?.message ||

          err?.message ||

          "Error while uploading bulk NDR file",

      );

    } finally {

      e.target.value = "";

      setLoading(false);

    }

  };

  const changeStatus = async (payload, ndr_id) => {

    setLoading(true);

    try {

      const res = await axios.post(

        `${baseURL}/api/tech-merchant/handleMerchantNDRAction/${ndr_id}`,

        payload,

        {

          headers: {

            Authorization: `Bearer ${localStorage.getItem("token")}`,

          },

        },

      );

      await fetchData();

      setEditingStatusId(null);

      setNewStatus("");

      toast.success(

        res?.data?.message || "NDR action updated successfully",

      );

    } catch (err) {

      toast.error(

        err?.response?.data?.message ||

          "Failed to take action on current NDR",

      );

    } finally {

      setLoading(false);

    }

  };

  const handleHistoryClick = async (item) => {
  try {
    setHistoryItem(null);

    const res = await axios.get(
      `${baseURL}/api/tech-merchant/getOrderDetailsByMerchant`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          awb_number: item.awb_number,
        },
      },
    );

    // ONLY NDR ACTIONS
    const actions = res?.data?.ndr_details?.actions || [];

    setHistoryItem(Array.isArray(actions) ? actions : []);
  } catch (err) {
    setHistoryItem([]);

    toast.error(
      err?.response?.data?.message ||
        err?.message ||
        "Error while fetching NDR history",
    );
  }
};

  const downloadFile = (blob, fileName) => {

    const url = window.URL.createObjectURL(new Blob([blob]));

    const link = document.createElement("a");

    link.href = url;

    link.setAttribute("download", fileName);

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  };

  const Sample = async () => {

    setLoading(true);

    try {

      const res = await axios.get(

        `${baseURL}/api/tech-merchant/downloadMerchantNDRSampleFile`,

        {

          responseType: "blob",

          headers: {

            Authorization: `Bearer ${localStorage.getItem("token")}`,

          },

        },

      );

      downloadFile(res.data, "NDR Action Format.csv");

      toast.success("Sample file downloaded successfully");

    } catch (err) {

      toast.error(

        err?.response?.data?.message ||

          err?.message ||

          "Failed to download sample file",

      );

    } finally {

      setLoading(false);

    }

  };

  const exportCSV = async () => {

    setLoading(true);

    try {

  const res = await AxiosInstance.get('/api/tech-merchant/exportNDRs',{
    params: {

            start_date: advanceFilters.startDate,

            end_date: advanceFilters.endDate,

            awb_number: advanceFilters.awb_number,

            statusType: selectedFilter,

          },

  })

      

      downloadFile(res.data, "NDR Export.csv");

      toast.success("NDR data exported successfully");

    } catch (err) {

      toast.error(

        err?.response?.data?.message ||

          err?.message ||

          "Failed to export NDR data",

      );

    } finally {

      setLoading(false);

    }

  };

  const handleApplyFilters = () => {

    setPage(1);

    setFilterUpdate((prev) => !prev);

    setIsFilterOpen(false);

  };

  const handleResetFilters = () => {

    const today = new Date();

    const oneMonthAgo = new Date();

    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    setAdvanceFilters({

      endDate: today.toISOString().split("T")[0],

      startDate: oneMonthAgo.toISOString().split("T")[0],

      awb_number: "",

    });

    setPage(1);

    setFilterUpdate((prev) => !prev);

    setIsFilterOpen(false);

  };

  const copyAwb = async (awb) => {

    try {

      await navigator.clipboard.writeText(awb);

      setCopySuccess(awb);

      setTimeout(() => setCopySuccess(null), 2000);

      toast.success("AWB copied to clipboard");

    } catch {

      toast.error("Unable to copy AWB");

    }

  };

  const getStatusColor = (status) => {

    const statusColors = {

      actionable:

        "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",

      actiontaken:

        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",

      rto:

        "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",

      delivered:

        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",

      default:

        "bg-gray-100 text-gray-700 border-gray-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700",

    };

    return statusColors[status] || statusColors.default;

  };

  return (

    <>

        <div className="min-h-screen bg-[#f5f8fb] text-gray-900 transition-colors dark:bg-neutral-950 dark:text-neutral-100">

        

          <header className="border-b border-blue-500/20  dark:border-neutral-800 dark:bg-neutral-900">

            <div className="mx-auto px-4 py-4">

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                  <h1 className="text-2xl font-bold dark:text-white">
                    NDR Management
                  </h1>

                  <p className="mt-1 text-sm dark:text-blue-100 ">
                    Manage Non-Delivery Reports efficiently
                  </p>

                </div>

                <div className="flex flex-wrap items-center gap-2">

                

                  <label className="relative inline-flex cursor-pointer items-center gap-2 rounded-sm bg-white px-4 py-2.5 text-sm font-semibold text-[#0446DB] shadow-sm transition hover:bg-blue-50 dark:border dark:border-neutral-700 dark:bg-neutral-800 dark:text-blue-400 dark:hover:bg-neutral-700">

                    <FaFileUpload className="h-4 w-4" />

                    <span>Bulk Action</span>

                    <input

                      type="file"

                      name="bulk_ndr"

                      onChange={handleChange}

                      accept=".csv"

                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"

                    />

                  </label>

                  <Button

                    type="button"

                    onClick={Sample}

                    className="flex items-center gap-2 rounded-sm bg-white px-4 py-2.5 font-semibold text-[#0446DB] shadow-sm transition hover:bg-blue-50 hover:text-[#0446DB] dark:border dark:border-neutral-700 dark:bg-neutral-800 dark:text-blue-400 dark:hover:bg-neutral-700"

                  >

                    <FaFileCsv className="h-4 w-4" />

                    Sample

                  </Button>

                  <Button

                    type="button"

                    onClick={exportCSV}

                    className="flex items-center gap-2 rounded-sm bg-white px-4 py-2.5 font-semibold text-[#0446DB] shadow-sm transition hover:bg-blue-50 hover:text-[#0446DB] dark:border dark:border-neutral-700 dark:bg-neutral-800 dark:text-blue-400 dark:hover:bg-neutral-700"

                  >

                    <FaFileCsv className="h-4 w-4" />

                    Export

                  </Button>

                 

                  <Drawer

                    direction="right"

                    open={isFilterOpen}

                    onOpenChange={setIsFilterOpen}

                  >

                    <DrawerTrigger asChild>

                      <Button

                        variant="outline"

                        className="flex items-center gap-2 rounded-sm border-0 bg-white px-4 py-2.5 font-semibold text-[#0446DB] shadow-sm transition hover:bg-blue-50 hover:text-[#0446DB] dark:border dark:border-neutral-700 dark:bg-neutral-800 dark:text-blue-400 dark:hover:bg-neutral-700"

                      >

                        <FaFilter className="text-sm" />

                        Filter

                      </Button>

                    </DrawerTrigger>

                    <DrawerContent className="ml-auto h-full w-full max-w-md rounded-none border-l border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">

                      <DrawerHeader className="border-b border-gray-100 px-5 py-5 dark:border-neutral-800">

                        <div className="flex items-center justify-between">

                          <div>

                            <DrawerTitle className="text-xl font-bold text-gray-900 dark:text-white">

                              Advanced Filters

                            </DrawerTitle>

                            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">

                              Filter NDR records by date and AWB.

                            </p>

                          </div>

                          <DrawerClose asChild>

                            <button

                              type="button"

                              className="flex h-9 w-9 items-center justify-center rounded-sm text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-white"

                            >

                              <FaTimes className="h-4 w-4" />

                            </button>

                          </DrawerClose>

                        </div>

                      </DrawerHeader>

                      <form

                        onSubmit={(e) => {

                          e.preventDefault();

                          handleApplyFilters();

                        }}

                        className="flex min-h-0 flex-1 flex-col"

                      >

                        <div className="flex-1 space-y-5 overflow-y-auto p-5">

                          <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-neutral-300">

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

                              onClick={(e) =>

                                e.currentTarget.showPicker?.()

                              }

                              className="w-full rounded-sm border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:[color-scheme:dark]"

                            />

                          </div>

                          <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-neutral-300">

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

                              onClick={(e) =>

                                e.currentTarget.showPicker?.()

                              }

                              className="w-full rounded-sm border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:[color-scheme:dark]"

                            />

                          </div>

                          <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-neutral-300">

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

                              placeholder="Enter AWB Number"

                              className="w-full rounded-sm border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"

                            />

                          </div>

                          <div className="rounded-sm border border-blue-100 bg-blue-50 px-3 py-2.5 text-xs font-medium text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">

                            Press Enter after entering AWB to apply filters.

                          </div>

                        </div>

                        <DrawerFooter className="border-t border-gray-100 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">

                          <div className="grid grid-cols-2 gap-3">

                            <button

                              type="button"

                              onClick={handleResetFilters}

                              className="rounded-sm border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"

                            >

                              Reset

                            </button>

                            <button

                              type="submit"

                              className="rounded-sm bg-[#0446DB] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"

                            >

                              Apply Filters

                            </button>

                          </div>

                        </DrawerFooter>

                      </form>

                    </DrawerContent>

                  </Drawer>

                </div>

              </div>

            </div>

          </header>

         

          <main>

            <div className="border-b border-gray-200 bg-white px-3 dark:border-neutral-800 dark:bg-neutral-900">

              <div className="overflow-x-auto">

                <div className="flex min-w-max justify-center gap-2 py-3">

                  {filters.map((filter, index) => (

                    <Button

                      key={index}

                      type="button"

                      onClick={() => {

                        setSelectedFilter(filter[1]);

                        setPage(1);

                      }}

                      className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all ${

                        selectedFilter === filter[1]

                          ? "border-[#0446DB] bg-[#0446DB] text-white shadow-sm hover:bg-blue-700"

                          : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-blue-500 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"

                      }`}

                    >

                      {filter[0]}

                    </Button>

                  ))}

                </div>

              </div>

            </div>


            <div className="border-b border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">

              <div className="overflow-x-auto">

                {data.length > 0 ? (

                  <table className="min-w-full">

                    <thead className="border-b border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-950">

                      <tr>

                        {[

                          "NDR Information",

                          "Order Details",

                          "Customer Information",

                          "Status & Actions",

                        ].map((item) => (

                          <th

                            key={item}

                            className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-neutral-400"

                          >

                            {item}

                          </th>

                        ))}

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">

                      {data.map((d) => (

                        <tr

                          key={d.ndr_id}

                          className="transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/60"

                        >

                      

                          <td className="px-6 py-4">

                            <p className="font-semibold text-gray-900 dark:text-neutral-100">

                              NDR #{d.ndr_id}

                            </p>

                            <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">

                              {new Date(d.created_at).toLocaleString("en-IN", {

                                timeZone: "Asia/Kolkata",

                                day: "2-digit",

                                month: "2-digit",

                                year: "numeric",

                                hour: "2-digit",

                                minute: "2-digit",

                                hour12: true,

                              })}

                            </p>

                          </td>

                        

                          <td className="px-6 py-4">

                            <div className="space-y-1.5 text-sm">

                              <div className="flex items-center gap-1.5">

                                <span className="whitespace-nowrap font-medium text-gray-500 dark:text-neutral-500">

                                  Order ID:

                                </span>

                                <span className="font-semibold text-gray-800 dark:text-neutral-200">

                                  {d.id}

                                </span>

                              </div>

                              <div className="flex items-center gap-1.5">

                                <span className="whitespace-nowrap font-medium text-gray-500 dark:text-neutral-500">

                                  Merchant Order ID:

                                </span>

                                <span className="text-gray-800 dark:text-neutral-300">

                                  {d.merchant_order_id}

                                </span>

                              </div>

                              <div className="flex items-center gap-1.5">

                                <span className="whitespace-nowrap font-medium text-gray-500 dark:text-neutral-500">

                                  AWB:

                                </span>

                                <div className="flex items-center gap-1">

                                  <span className="font-mono font-semibold text-gray-800 dark:text-neutral-200">

                                    {d.awb_number}

                                  </span>

                                  <button

                                    type="button"

                                    onClick={() => copyAwb(d.awb_number)}

                                    className="rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-[#0446DB] dark:text-neutral-500 dark:hover:bg-neutral-700 dark:hover:text-blue-400"

                                  >

                                    {copySuccess === d.awb_number ? (

                                      <CiCircleCheck className="h-4 w-4 text-emerald-500" />

                                    ) : (

                                      <FaRegCopy className="h-3.5 w-3.5" />

                                    )}

                                  </button>

                                </div>

                              </div>

                            </div>

                          </td>

                       

                          <td className="max-w-[360px] px-6 py-4">

                            <p className="font-semibold text-gray-900 dark:text-neutral-100">

                              {d.delivery_contact_name}

                            </p>

                            <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">

                              {d.delivery_address_line}

                            </p>

                            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">

                              {d.delivery_city}, {d.delivery_state} -{" "}

                              {d.delivery_pincode}

                            </p>

                            <p className="mt-0.5 text-xs text-gray-400 dark:text-neutral-600">

                              {d.delivery_country}

                            </p>

                          </td>

{/*                           {/\ Status \/} */}

                          <td className="px-6 py-4">

                            <div className="flex flex-wrap items-center gap-2">

                              <span

                                className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusColor(

                                  d.status,

                                )}`}

                              >

                                {toCapitalizeEachWord(d.status) || "Pending"}

                              </span>

                              {selectedFilter === "actionable" && (

                                <Button

                                  type="button"

                                  onClick={() => {

                                    setEditingStatusId(d.ndr_id);

                                    setNewStatus("");

                                  }}

                                  className="rounded-sm bg-[#0446DB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"

                                >

                                  Take Action

                                </Button>

                              )}

                             <Dialog>
  <DialogTrigger asChild>
    <Button
      type="button"
      variant="outline"
      onClick={() => handleHistoryClick(d)}
      className="h-9 w-9 rounded-sm border-gray-200 p-0 text-gray-500 hover:border-blue-300 hover:bg-blue-50 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-blue-500 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
    >
      <TbFileInfo className="h-4 w-4" />
    </Button>
  </DialogTrigger>

  <DialogContent className="max-h-[90vh] overflow-hidden border-gray-200 bg-white p-0 sm:max-w-4xl dark:border-neutral-800 dark:bg-neutral-900">
    {/* Header */}
    <DialogHeader className="border-b border-gray-100 px-6 py-5 dark:border-neutral-800">
      <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
        NDR Action History
      </DialogTitle>
    </DialogHeader>

    {/* Content */}
    <div className="max-h-[65vh] overflow-y-auto px-5 py-5">
      {historyItem === null ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#0446DB]" />
            Loading history...
          </div>
        </div>
      ) : historyItem.length > 0 ? (
        <div className="space-y-4">
          {historyItem.map((item, index) => {
            const actionName =
              item?.action_taken === "change_address"
                ? "Change Address"
                : item?.action_taken === "change_phone"
                  ? "Change Phone Number"
                  : item?.action_taken === "reattempt"
                    ? "Reattempt"
                    : item?.action_taken === "rto"
                      ? "RTO"
                      : toCapitalizeEachWord(
                          item?.action_taken || "Action",
                        );

            return (
              <div
                key={item?.id || item?.action_id || index}
                className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5 dark:border-blue-500/20 dark:bg-blue-500/5"
              >
                {/* Action */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {actionName}
                  </h3>

                  {item?.created_by && (
                    <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      {item.created_by}
                    </span>
                  )}
                </div>

                <div className="space-y-2.5 text-sm">
                  {/* Remarks / Main NDR Reason */}
                  {item?.remarks && (
                    <div className="flex flex-wrap gap-1">
                      <span className="font-semibold text-gray-700 dark:text-neutral-300">
                        Remarks:
                      </span>

                      <span className="text-gray-600 dark:text-neutral-400">
                        {item.remarks}
                      </span>
                    </div>
                  )}

                  {/* Sub Remarks */}
                  {(() => {
  const subRemarks = item?.sub_remarks;

  const hasSubRemarks =
    subRemarks !== null &&
    subRemarks !== undefined &&
    String(subRemarks).trim() !== "" &&
    String(subRemarks).trim().toLowerCase() !== "null" &&
    String(subRemarks).trim().toLowerCase() !== "undefined";

  if (!hasSubRemarks) return null;

  return (
    <div className="flex flex-wrap gap-1">
      <span className="font-semibold text-gray-700 dark:text-neutral-300">
        Sub Remarks:
      </span>

      <span className="text-gray-600 dark:text-neutral-400">
        {String(subRemarks).trim()}
      </span>
    </div>
  );
})()}

                  {/* Detailed Remarks */}
                 {(() => {
  const detailedRemarks = item?.detailed_remarks;

  const hasDetailedRemarks =
    detailedRemarks !== null &&
    detailedRemarks !== undefined &&
    String(detailedRemarks).trim() !== "" &&
    String(detailedRemarks).trim().toLowerCase() !== "null" &&
    String(detailedRemarks).trim().toLowerCase() !== "undefined";

  if (!hasDetailedRemarks) return null;

  return (
    <div className="flex flex-wrap gap-1">
      <span className="font-semibold text-gray-700 dark:text-neutral-300">
        Other Remarks:
      </span>

      <span className="text-gray-600 dark:text-neutral-400">
        {String(detailedRemarks).trim()}
      </span>
    </div>
  );
})()}

                  {/* Reattempt Rescheduled Date */}
                 {item?.rescheduled_date &&
  String(item.rescheduled_date).trim().toLowerCase() !== "null" && (
    <div className="flex flex-wrap items-center gap-1">
      <span className="font-semibold text-gray-700 dark:text-neutral-300">
        Rescheduled Date:
      </span>

      <span className="text-gray-600 dark:text-neutral-400">
        {new Date(
          `${item.rescheduled_date}T00:00:00`
        ).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </span>
    </div>
  )}

                  {/* Change Phone */}
                  {item?.action_taken === "change_phone" &&
                    item?.customer_phone && (
                      <div className="flex flex-wrap gap-1">
                        <span className="font-semibold text-gray-700 dark:text-neutral-300">
                          Phone Number:
                        </span>

                        <span className="text-gray-600 dark:text-neutral-400">
                          {item.customer_phone}
                        </span>
                      </div>
                    )}

                  {/* Change Address */}
                  {item?.action_taken === "change_address" && (
                    <>
                      {item?.customer_name && (
                        <div className="flex flex-wrap gap-1">
                          <span className="font-semibold text-gray-700 dark:text-neutral-300">
                            Customer Name:
                          </span>

                          <span className="text-gray-600 dark:text-neutral-400">
                            {item.customer_name}
                          </span>
                        </div>
                      )}

                      {item?.customer_details_address && (
                        <div className="flex gap-1">
                          <span className="shrink-0 font-semibold text-gray-700 dark:text-neutral-300">
                            Address:
                          </span>

                          <span className="text-gray-600 dark:text-neutral-400">
                            {item.customer_details_address}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Created By */}
                  {item?.created_by && (
                    <div className="flex flex-wrap gap-1">
                      <span className="font-semibold text-gray-700 dark:text-neutral-300">
                        Created By:
                      </span>

                      <span className="text-gray-600 dark:text-neutral-400">
                        {item.created_by}
                      </span>
                    </div>
                  )}

                  {/* Date */}
                  {item?.created_at && (
                    <div className="border-t border-blue-100 pt-3 text-xs text-gray-500 dark:border-neutral-800 dark:text-neutral-500">
                      <span className="font-semibold">
                        Date/Time:
                      </span>{" "}

                      {new Date(item.created_at).toLocaleString(
                        "en-IN",
                        {
                          timeZone: "Asia/Kolkata",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        },
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
          <TbFileInfo className="mb-3 h-8 w-8 text-gray-300 dark:text-neutral-700" />

          <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">
            No history found for this NDR
          </p>
        </div>
      )}
    </div>

    {/* Footer */}
    <DialogFooter className="border-t border-gray-100 bg-gray-50 px-5 my-1 dark:border-neutral-800 dark:bg-neutral-950">
      <DialogClose asChild>
        <Button
          type="button"
          variant="outline"
          className="rounded-lg border-gray-200 bg-white px-5 text-gray-700 hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
        >
          Close
        </Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>

                            </div>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                ) : (

                  <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">

                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">

                      <FaHistory className="h-7 w-7 text-gray-400 dark:text-neutral-600" />

                    </div>

                    <p className="mt-4 text-base font-semibold text-gray-600 dark:text-neutral-300">

                      No NDR records found

                    </p>

                    <p className="mt-1 text-sm text-gray-400 dark:text-neutral-500">

                      Try adjusting your filters or search terms

                    </p>

                  </div>

                )}

              </div>



              {data.length > 0 && (

                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-sm text-gray-600 dark:text-neutral-400">

                      Showing page{" "}

                      <span className="font-semibold text-gray-900 dark:text-white">

                        {page}

                      </span>{" "}

                      of{" "}

                      <span className="font-semibold text-gray-900 dark:text-white">

                        {totalPages}

                      </span>

                    </p>

                    <div className="flex items-center gap-2">

                      <button

                        type="button"

                        onClick={() =>

                          setPage((prev) => Math.max(prev - 1, 1))

                        }

                        disabled={page === 1}

                        className="rounded-sm border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"

                      >

                        Previous

                      </button>

                      <span className="rounded-sm border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">

                        {page} / {totalPages}

                      </span>

                      <button

                        type="button"

                        onClick={() =>

                          setPage((prev) =>

                            Math.min(prev + 1, totalPages),

                          )

                        }

                        disabled={page === totalPages}

                        className="rounded-sm bg-[#0446DB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"

                      >

                        Next

                      </button>

                    </div>

                  </div>

                </div>

              )}

            </div>

          </main>



          {editingStatusId && (

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 backdrop-blur-[2px]">

              <div className="w-full max-w-lg overflow-hidden rounded-sm  bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">

                <div className="flex items-center justify-between bg-[#0446DB] px-5 py-4 dark:bg-neutral-950">

                  <div>

                    <h2 className="text-lg font-bold text-white">

                      Take Action

                    </h2>

                    <p className="mt-0.5 text-xs text-blue-100 dark:text-neutral-400">

                      Update NDR action details

                    </p>

                  </div>

                  <button

                    type="button"

                    onClick={() => {

                      setEditingStatusId(null);

                      setNewStatus("");
                      setRTORemarksStatus("");

                    }}

                    className="flex h-8 w-8 items-center justify-center rounded-sm bg-white/10 text-white transition hover:bg-white/20"

                  >

                    <FaTimes className="h-4 w-4" />

                  </button>

                </div>

                <div className="max-h-[70vh] overflow-y-auto px-5 py-5">

                  <form

                    onSubmit={async (e) => {

                      e.preventDefault();

                      const form = e.currentTarget;

                      const status = form.elements.status?.value || "";

                      const rtoRemarks = form.elements.rot_remarks?.value || "";
                      const subRemarks = form.elements.sub_remarks?.value || "";
                      const otherRemarks = form.elements.other_remarks?.value || "";
                      const phone = form.elements.phone?.value || "";
                      const name = form.elements.name?.value || "";
                      const address1 = form.elements.address1?.value || "";
                      const payload = {
                        action: status,
                        remarks: rtoRemarks,
                        sub_remarks: subRemarks,
                        detailed_remarks: otherRemarks,
                        customer_name: name,
                        customer_details_address: address1,
                        customer_phone: phone,
                      };

                      // action, remarks, sub_remarks, detailed_remarks, customer_name, customer_details_address, customer_phone

                      await changeStatus(payload, editingStatusId);

                    }}

                    className="space-y-4"

                  >

                    <div>

                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-neutral-400">

                        Action

                      </label>

                      <select

                        name="status"

                        defaultValue=""

                        onChange={(e) => {
                          setNewStatus(e.target.value);
                          setRTORemarksStatus("");
                        }}

                        required

                        className="w-full rounded-sm border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"

                      >

                        <option disabled value="">

                          Change Status

                        </option>

                        <option value="change_address">

                          Change Address

                        </option>

                        <option value="change_phone">

                          Change Phone Number

                        </option>

                        <option value="reattempt">Reattempt</option>

                        <option value="rto">RTO</option>

                      </select>

                    </div>

                    {newStatus === "rto" && (
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-neutral-400">NDR Reason</label>
                        <select name="rot_remarks" defaultValue="" required onChange={(e) => setRTORemarksStatus(e.target.value)} className="w-full rounded-sm border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                          <option disabled value="">Select NDR Reason</option>
                          <option value="Address Incorrect / Incomplete">Address Incorrect / Incomplete</option>
                          <option value="Customer Refused / Cancelled">Customer Refused / Cancelled</option>
                          <option value="Wrong Pincode / Address">Wrong Pincode / Address</option>
                          <option value="Wrong Contact Details">Wrong Contact Details</option>
                          <option value="Package Damaged">Package Damaged</option>
                          <option value="RTO by Seller">RTO by Seller</option>
                          <option value="Return to Hub">Return to Hub</option>
                          <option value="Return to Seller / FC">Return to Seller / FC</option>
                          <option value="Max. Attempts Reached">Max. Attempts Reached</option>
                        </select>
                      </div>
                    )}

                    {newStatus === "rto" && newRTORemarkStatus === "Customer Refused / Cancelled" && (
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-neutral-400">Sub Reason</label>
                        <select name="sub_remarks" defaultValue="" required className="w-full rounded-sm border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                          <option disabled value="">Select Sub Reason</option>
                          <option value="Duplicate Order">Duplicate Order</option>
                          <option value="Order Placed by Mistake">Order Placed by Mistake</option>
                          <option value="COD Amount Not Ready">COD Amount Not Ready</option>
                          <option value="Better Price Elsewhere">Better Price Elsewhere</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    )}

                    {newStatus === "change_phone" && (

                      <div>

                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-neutral-400">

                          Phone Number

                        </label>

                        <input

                          type="tel"

                          name="phone"

                          placeholder="Enter phone number"

                          className="w-full rounded-sm border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"

                        />

                      </div>

                    )}

                    {newStatus === "change_address" && (

                      <>

                        <div>

                          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-neutral-400">

                            Customer Name

                          </label>

                          <input

                            type="text"

                            name="name"

                            placeholder="Enter customer name"

                            className="w-full rounded-sm border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"

                          />

                        </div>

                        <div>

                          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-neutral-400">

                            Customer Address

                          </label>

                          <textarea

                            name="address1"

                            rows={3}

                            placeholder="Enter customer address"

                            className="w-full resize-none rounded-sm border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"

                          />

                        </div>

                      </>

                    )}

                    <div>

                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-neutral-400">
                        Other Remarks
                      </label>
                      <input
                        type="text"
                        name="other_remarks"
                        placeholder="Enter additional remarks"

                        className="w-full rounded-sm border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"

                      />

                    </div>

                    <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-neutral-800">

                      <button

                        type="button"

                        onClick={() => {

                          setEditingStatusId(null);

                          setNewStatus("");
                      setRTORemarksStatus("");

                        }}

                        className="rounded-sm border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"

                      >

                        Close

                      </button>

                      <button

                        type="submit"

                        className="rounded-sm bg-[#0446DB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"

                      >

                        Update

                      </button>

                    </div>

                  </form>

                </div>

              </div>

            </div>

          )}

        </div>

    </>

  );

}

export default TechMerchantNDR;
