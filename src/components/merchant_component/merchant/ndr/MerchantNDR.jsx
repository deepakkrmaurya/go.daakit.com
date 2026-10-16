// import { useState, useEffect } from "react";
// import axios from "axios";

// import {
//   FaRegCopy,
//   FaFilter,
//   FaDownload,
//   FaHistory,
//   FaTimes,
//   FaFileUpload,
//   FaFileCsv,
// } from "react-icons/fa";
// import { CiCircleCheck } from "react-icons/ci";
// import { toast } from "react-toastify";
// import { Button } from "@/components/ui/button";
// import {
//   Drawer,
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

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { TbFileInfo } from "react-icons/tb";
// import { Loader2 } from "lucide-react";
// const baseURL = import.meta.env.VITE_BASE_URL;
// const frontEndURL = import.meta.env.VITE_FRONTEND_URL;
// function MerchantNDR() {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState([]);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(50);
//   const [totalPages, setTotalPages] = useState(1);
//   const [historyItem, setHistoryItem] = useState(null);
//   const [copySuccess, setCopySuccess] = useState(null);
//   const [editingStatusId, setEditingStatusId] = useState(null);
//   const [newStatus, setNewStatus] = useState(null);
//   const [newRTORemarkStatus, setRTORemarksStatus] = useState("");

//   function toCapitalizeEachWord(str) {
//     return str
//       .split(" ")
//       .map((word) => {
//         if (!word) return "";
//         return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//       })
//       .join(" ");
//   }

//   /* Status Filter */
//   const filters = [
//     ["All", ""],
//     ["Action Required", "actionable"],
//     ["Action Taken", "actiontaken"],
//     ["RTO", "rto"],
//     ["Delivered", "delivered"],
//   ];
//   const [selectedFilter, setSelectedFilter] = useState("");

//   /* Advance Filter */
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [isDrawerFilterOpen, setIsDrawerFilterOpen] = useState(false);
//   const [advanceFilters, setAdvanceFilters] = useState({
//     startDate: "",
//     endDate: "",
//     awb_number: "",
//   });
//   const [filterUpdate, setFilterUpdate] = useState(false);

//   const openDatePicker = (event) => {
//     try {
//       event.currentTarget.showPicker?.();
//     } catch {
//       return;
//     }
//   };

//   const updateAdvanceFilter = (field, value) => {
//     setAdvanceFilters((prev) => {
//       const next = {
//         ...prev,
//         [field]: value,
//       };

//       if (
//         field === "startDate" &&
//         next.endDate &&
//         value &&
//         next.endDate < value
//       ) {
//         next.endDate = value;
//       }

//       if (
//         field === "endDate" &&
//         next.startDate &&
//         value &&
//         next.startDate > value
//       ) {
//         next.startDate = value;
//       }

//       return next;
//     });
//   };

//   const applyFilters = () => {
//     if (
//       advanceFilters.startDate &&
//       advanceFilters.endDate &&
//       advanceFilters.startDate > advanceFilters.endDate
//     ) {
//       toast.error("Start date cannot be after end date");
//       return false;
//     }

//     setPage(1);
//     setFilterUpdate((prev) => !prev);
//     setIsFilterOpen(false);
//     setIsDrawerFilterOpen(false);
//     return true;
//   };

//   const resetAdvanceFilters = async () => {
//     const today = new Date();
//     const oneMonthAgo = new Date();
//     oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

//     setAdvanceFilters((prev) => ({
//       endDate: today.toISOString().split("T")[0],
//       startDate: oneMonthAgo.toISOString().split("T")[0],
//       awb_number: "",
//     }));
//   };

//   const resetFilters = () => {
//     resetAdvanceFilters();
//     setPage(1);
//     setFilterUpdate((prev) => !prev);
//     setIsFilterOpen(false);
//     setIsDrawerFilterOpen(false);
//   };

//   useEffect(() => {
//     resetAdvanceFilters();
//   }, []);

//   const handleChange = async (e) => {
//     setLoading(true);
//     const file = e.target.files[0];
//     if (!file) {
//       setLoading(false);
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     try {
//       const res = await axios.post(
//         `${baseURL}/api/merchant/handleMerchantNDRBulkAction`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "multipart/form-data",
//           },
//         },
//       );
//       toast.success("File uploaded successfully");
//       fetchData();
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message ||
//           err.message ||
//           "Error while uploading file to take action on bulk orders",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch data from API
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${baseURL}/api/merchant/getMerchantNDRs`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         params: {
//           page,
//           limit,
//           start_date: advanceFilters.startDate,
//           end_date: advanceFilters.endDate,
//           awb_number: advanceFilters.awb_number,
//           statusType: selectedFilter,
//         },
//       });
//       setData(res.data.data || []);
//       setTotalPages(Math.ceil(Math.max(1, res.data.pagination?.total) / limit));
//       setLimit(res.data.pagination?.limit);
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message ||
//           err.message ||
//           "Failed to fetch NDR data:",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [selectedFilter, filterUpdate, page]);

//   /* Handle Change Status */
//   const changeStatus = async (data, ndr_id) => {
//     setLoading(true);

//     try {
//       await axios.post(
//         `${baseURL}/api/merchant/handleMerchantNDRAction/${ndr_id}`,
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );
//       await fetchData();
//       setEditingStatusId(null);
//       toast.success(res?.data?.message);
//       return;
//     } catch (err) {
//       toast.error(err.response?.data?.message);
//       return;
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* Fetch History */
//   const handleHistoryClick = async (d) => {
//     // setLoading(true);
//     try {
//       const res = await axios.get(
//         `${baseURL}/api/merchant/getOrderDetailsByMerchant`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           params: {
//             awb_number: d.awb_number,
//           },
//         },
//       );
//       setHistoryItem(res.data.ndr_details?.actions);
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message ||
//           err.message ||
//           "Error while fetching history data of the order",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const Sample = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${baseURL}/api/merchant/downloadMerchantNDRSampleFile`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );

//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "NDR Action Format.csv");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       toast.success("Sample file downloaded successfully");
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || err.message || "Failed to export orders",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };
//   const exportCSV = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${baseURL}/api/merchant/exportNDRs`,
//         {},
//         {
//           params: {
//             start_date: advanceFilters.startDate,
//             end_date: advanceFilters.endDate,
//             awb_number: advanceFilters.awb_number,
//             statusType: selectedFilter,
//           },
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );

//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "NDR Action Format.csv");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       toast.success("Sample file downloaded successfully");
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || err.message || "Failed to export orders",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     const statusColors = {
//       actionable: "bg-orange-100 text-orange-800 border-orange-200",
//       actiontaken: "bg-blue-100 text-blue-800 border-blue-200",
//       rto: "bg-red-100 text-red-800 border-red-200",
//       delivered: "bg-green-100 text-green-800 border-green-200",
//       default: "bg-gray-100 text-gray-800 border-gray-200",
//     };
//     return statusColors[status] || statusColors.default;
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
//         <div className=" w-full h-[90vh] flex justify-center items-center">
//           <div>
//             <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//             <p className="mt-2"> Loading NDR Orders...</p>
//           </div>
//         </div>
//       ) : (
//         <div className="min-h-screen dark:bg-neutral-900">
//           {/* Header Section */}
//           <header className=" dark:bg-neutral-900">
//             <div className=" mx-auto py-3">
//               <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
//                 <div className="text-center lg:text-left">
//                   <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">
//                     NDR Management
//                   </h1>
//                   <p className="dark:text-indigo-100 mt-2 text-sm sm:text-base">
//                     Manage Non-Delivery Reports efficiently
//                   </p>
//                 </div>

//                 <div className="flex flex-row md:flex gap-2 items-center">
//                   {/* Bulk Action */}
//                   <div className="relative">
//                     <label className="flex items-center gap-2 bg-white text-[#0446DB] font-medium px-4 py-1 rounded-sm shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 cursor-pointer">
//                       <FaFileUpload className="w-4 h-4" />
//                       <span className="hidden sm:inline">Bulk Action</span>
//                       <input
//                         type="file"
//                         name="bulk_ndr"
//                         onChange={handleChange}
//                         accept=".csv"
//                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                       />
//                     </label>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex justify-center items-center gap-2">
//                     <Button
//                       onClick={Sample}
//                       className="flex items-center gap-2 bg-white text-[#0446DB] font-medium px-4 py-3  shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300"
//                     >
//                       <FaFileCsv className="w-4 h-4" />
//                       <span className="hidden sm:inline">Sample</span>
//                     </Button>
//                     <Button
//                       onClick={exportCSV}
//                       className="flex items-center gap-2 bg-white text-[#0446DB] font-medium px-4 py-3 shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300"
//                     >
//                       <FaFileCsv className="w-4 h-4" />
//                       <span className="hidden sm:inline">Export</span>
//                     </Button>
//                     <Drawer
//                       direction="right"
//                       open={isDrawerFilterOpen}
//                       onOpenChange={setIsDrawerFilterOpen}
//                     >
//                       <DrawerTrigger asChild>
//                         <Button
//                           variant="outline"
//                           className="bg-white mt-1 text-[#0446DB] dark:bg-white font-medium px-5 py-2.5  shadow hover:bg-indigo-100 hover:shadow-lg transition flex items-center gap-2"
//                         >
//                           <FaFilter className="text-sm" />
//                           <span>Filter</span>
//                         </Button>
//                       </DrawerTrigger>
//                       <DrawerContent>
//                         <DrawerHeader>
//                           <DrawerTitle>Filter</DrawerTitle>
//                           {/* <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}
//                         </DrawerHeader>
//                         <div className="p-6 h-[calc(100vh-80px)] overflow-y-auto">
//                           <div className="space-y-4">
//                             {/* Date Range */}
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                   Start Date
//                                 </label>
//                                 <input
//                                   type="date"
//                                   value={advanceFilters.startDate}
//                                   max={advanceFilters.endDate || undefined}
//                                   onClick={openDatePicker}
//                                   onFocus={openDatePicker}
//                                   onChange={(e) =>
//                                     updateAdvanceFilter(
//                                       "startDate",
//                                       e.target.value,
//                                     )
//                                   }
//                                   className="w-full cursor-pointer border border-gray-300 bg-white px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
//                                 />
//                               </div>

//                               <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                   End Date
//                                 </label>
//                                 <input
//                                   type="date"
//                                   value={advanceFilters.endDate}
//                                   min={advanceFilters.startDate || undefined}
//                                   onClick={openDatePicker}
//                                   onFocus={openDatePicker}
//                                   onChange={(e) =>
//                                     updateAdvanceFilter(
//                                       "endDate",
//                                       e.target.value,
//                                     )
//                                   }
//                                   className="w-full cursor-pointer border border-gray-300 bg-white px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
//                                 />
//                               </div>
//                             </div>

//                             {/* NDR ID */}
//                             <div>
//                               <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 AWB No
//                               </label>
//                               <input
//                                 type="text"
//                                 value={advanceFilters.awb_number}
//                                 onChange={(e) =>
//                                   setAdvanceFilters((prev) => ({
//                                     ...prev,
//                                     awb_number: e.target.value,
//                                   }))
//                                 }
//                                 placeholder="Enter AWB Number"
//                                 className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
//                               />
//                             </div>
//                           </div>

//                           {/* Action Buttons */}
//                           <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
//                             <Button
//                               onClick={applyFilters}
//                               className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-md"
//                             >
//                               Apply Filters
//                             </Button>
//                             <Button
//                               onClick={resetFilters}
//                               className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium shadow-md"
//                             >
//                               Reset
//                             </Button>
//                           </div>
//                         </div>
//                         <DrawerFooter>
//                           <Button
//                             onClick={() => setIsDrawerFilterOpen(false)}
//                             variant="outline"
//                           >
//                             Cancel
//                           </Button>
//                         </DrawerFooter>
//                       </DrawerContent>
//                     </Drawer>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </header>

//           {/* Main Content */}
//           <main className=" mx-auto  relative z-10">
//             {/* Status Filter Tabs */}
//             <div className="bg-white dark:bg-neutral-800  p-2 mb-6">
//               <div className="flex flex-wrap gap-2 justify-center">
//                 {filters.map((filter) => (
//                   <Button
//                     key={filter[0]}
//                     onClick={() => {
//                       setSelectedFilter(filter[1]);
//                       setPage(1);
//                     }}
//                     className={`px-4 py-3 rounded-full border-2 transition-all duration-300 font-medium flex items-center gap-2 ${
//                       selectedFilter === filter[1]
//                         ? "bg-[#0446DB] text-white border-transparent shadow-lg transform scale-105"
//                         : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md"
//                     }`}
//                   >
//                     {filter[0]}
//                   </Button>
//                 ))}
//               </div>
//             </div>

//             {/* NDR Table */}
//             <div className="bg-white dark:bg-neutral-900  overflow-hidden">
//               <div className="overflow-x-auto">
//                 {loading? (
//                   <>
//                     <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700 dark:bg-neutral-800">
//                       <thead className="bg-gray-50 dark:bg-neutral-800">
//                         <tr>
//                           <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
//                             NDR Information
//                           </th>

//                           <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
//                             Order Details
//                           </th>

//                           <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
//                             Customer Information
//                           </th>

//                           <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
//                             Status & Actions
//                           </th>
//                         </tr>
//                       </thead>

//                       <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
//                         <tr className="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-neutral-700/50">
//                           <td colSpan={4} className="px-6 py-10 text-center">
//                             <div className="flex items-center justify-center">
//                               <div>
//                                 <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//                                 <p className="mt-2">
//                                   {" "}
//                                   Loading NDR Details...
//                                 </p>
//                               </div>
//                             </div>
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </>
//                 ) : data.length > 0 ? (
//                   <>
//                     {/* Desktop Table */}
//                     <table className=" min-w-full divide-y divide-gray-200 dark:bg-neutral-800">
//                       <thead className=" dark:bg-neutral-800">
//                         <tr>
//                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                             NDR Information
//                           </th>
//                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                             Order Details
//                           </th>
//                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                             Customer Information
//                           </th>
//                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                             Status & Actions
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200">
//                         {data.map((d) => (
//                           <tr
//                             key={d.ndr_id}
//                             className="hover:bg-gray-50 transition-colors duration-200"
//                           >
//                             {/* NDR Information */}
//                             <td className="px-6">
//                               <div className="">
//                                 <p className=" text-gray-800">
//                                   {d.ndr_id}
//                                 </p>
//                               </div>
//                             </td>

//                             {/* Order Details */}
//                             <td className="px-2 ">
//                               <div className="">
//                                 <a
//                                   href={`${frontEndURL}/track-order?awb_number=${d.awb_number}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="underline whitespace-nowrap text-blue-700 hover:text-blue-500"
//                                 >
//                                   {d.awb_number}
//                                 </a>
//                                 <button
//                                   onClick={() => {
//                                     navigator.clipboard.writeText(d.awb_number);
//                                     setCopySuccess(d.awb_number);
//                                     setTimeout(
//                                       () => setCopySuccess(null),
//                                       2000,
//                                     );
//                                     toast.success("AWB copied to clipboard");
//                                   }}
//                                   className="text-gray-400 hover:text-[#0446DB] transition-colors duration-200 p-1 rounded"
//                                 >
//                                   {copySuccess === d.awb_number ? (
//                                     <CiCircleCheck className="w-4 h-4 text-green-500" />
//                                   ) : (
//                                     <FaRegCopy className="w-4 h-4" />
//                                   )}
//                                 </button>
//                                 <div className=" flex items-center">
//                                   <p className="text-sm font-medium whitespace-nowrap text-gray-600">
//                                     Order ID:{" "}
//                                   </p>
//                                   <p className="font-semibold whitespace-nowrap text-gray-800">
//                                     {d.id}
//                                   </p>
//                                 </div>
//                                 <div className=" flex items-center">
//                                   <p className="text-sm font-medium whitespace-nowrap text-gray-600">
//                                     Merchant Order ID:{" "}
//                                   </p>
//                                   <p className="text-gray-800">
//                                     {d.merchant_order_id}
//                                   </p>
//                                 </div>
//                               </div>
//                             </td>

//                             {/* Customer Information */}
//                             <td className="px-2 ">
//                               <div className=" ">
//                                 <p className="font-semibold text-gray-800 whitespace-nowrap">
//                                   {d.delivery_contact_name}
//                                 </p>
//                                 <p className="text-sm text-gray-600">
//                                   {d.delivery_address_line}
//                                 </p>
//                                 <p className="text-sm text-gray-500 whitespace-nowrap">
//                                   {d.delivery_city}, {d.delivery_state} -{" "}
//                                   {d.delivery_pincode}
//                                 </p>
//                                 <p className="text-xs text-gray-400">
//                                   {d.delivery_country}
//                                 </p>
//                               </div>
//                             </td>

//                             {/* Status & Actions */}
//                             <td className="px-2 ">
//                               <div className=" flex items-center gap-1">
//                                 <div>
//                                   <span
//                                     className={`px-3 py-2 rounded-full whitespace-nowrap text-sm font-semibold border ${getStatusColor(d.status)}`}
//                                   >
//                                     {toCapitalizeEachWord(d.status) ||
//                                       "Pending"}
//                                   </span>
//                                 </div>

//                                 {selectedFilter === "actionable" && (
//                                   <div>
//                                     {/* <Button
//                                     onClick={() => setEditingStatusId(d.ndr_id)}
//                                     className="w-full whitespace-nowrap bg-[#0446DB] text-white px-4 py-1 rounded-lg  transition-colors duration-200 font-medium text-sm"
//                                   >
//                                     Take Action
//                                   </Button> */}

//                                     <AlertDialog>
//                                       <AlertDialogTrigger
//                                         render={<Button variant="outline" />}
//                                       >
//                                         <Button className="bg-[#0446DB]">
//                                           Take Action
//                                         </Button>
//                                       </AlertDialogTrigger>

//                                       <AlertDialogContent className="!max-w-xl max-h-[90vh] overflow-y-auto">
//                                         <AlertDialogHeader>
//                                           <AlertDialogTitle>
//                                             Take Action
//                                           </AlertDialogTitle>

//                                           <AlertDialogDescription>
//                                             Select an action and update the
//                                             order details.
//                                           </AlertDialogDescription>
//                                         </AlertDialogHeader>

//                                         <form
//                                           id="status-update-form"
//                                           onSubmit={async (e) => {
//                                             e.preventDefault();

//                                             const form = e.currentTarget;

//                                             const rot_remarks =
//                                               form.elements.rot_remarks
//                                                 ?.value || "";

//                                             const newStatus =
//                                               form.elements.status?.value || "";

//                                             const newRemarks = rot_remarks
//                                               ? rot_remarks
//                                               : form.elements.remarks?.value ||
//                                                 "";

//                                             const other_remarks =
//                                               form.elements.other_remarks
//                                                 ?.value || "";

//                                             const sub_remarks =
//                                               form.elements.sub_remarks
//                                                 ?.value || "";

//                                             const phone =
//                                               form.elements.phone?.value || "";

//                                             const name =
//                                               form.elements.name?.value || "";

//                                             const address1 =
//                                               form.elements.address1?.value ||
//                                               "";

//                                             const data = {
//                                               action: newStatus,
//                                               remarks: newRemarks,
//                                               sub_remarks: sub_remarks,
//                                               detailed_remarks: other_remarks,
//                                               customer_name: name,
//                                               customer_details_address:
//                                                 address1,
//                                               customer_phone: phone,
//                                             };

//                                             console.log("Submit Data:", data);

//                                             await changeStatus(
//                                               data,
//                                               editingStatusId,
//                                             );
//                                           }}
//                                           className="flex flex-col gap-3"
//                                         >
//                                           {/* Status */}
//                                           <div>
//                                             <label className="text-xs font-medium">
//                                               Select
//                                             </label>

//                                             <select
//                                               name="status"
//                                               defaultValue=""
//                                               onChange={(e) => {
//                                                 setNewStatus(e.target.value);
//                                                 setRTORemarksStatus(" ");
//                                               }}
//                                               className="mt-1 text-xs w-full border border-gray-300 rounded-md
//                      px-2 py-2 focus:ring-2 focus:ring-indigo-400
//                      focus:outline-none dark:bg-gray-800 dark:text-white"
//                                               required
//                                             >
//                                               <option disabled value="">
//                                                 Change Status
//                                               </option>

//                                               <option value="change_address">
//                                                 Change Address
//                                               </option>

//                                               <option value="change_phone">
//                                                 Change Phone Number
//                                               </option>

//                                               <option value="reattempt">
//                                                 Reattempt
//                                               </option>

//                                               <option value="rto">RTO</option>
//                                             </select>
//                                           </div>

//                                           {/* RTO */}
//                                           {newStatus === "rto" && (
//                                             <div>
//                                               <label className="text-xs font-medium dark:text-white">
//                                                 Select Remarks
//                                               </label>

//                                               <select
//                                                 name="rot_remarks"
//                                                 defaultValue=""
//                                                 onChange={(e) =>
//                                                   setRTORemarksStatus(
//                                                     e.target.value,
//                                                   )
//                                                 }
//                                                 className="mt-1 text-xs w-full border border-gray-300 rounded-md
//                        px-2 py-2 focus:ring-2 dark:text-white
//                        dark:bg-gray-800 focus:ring-indigo-400
//                        focus:outline-none"
//                                                 required
//                                               >
//                                                 <option disabled value="">
//                                                   Remarks
//                                                 </option>

//                                                 <option value="Address Incorrect / Incomplete">
//                                                   Address Incorrect / Incomplete
//                                                 </option>

//                                                 <option value="Customer Refused / Cancelled">
//                                                   Customer Refused / Cancelled
//                                                 </option>

//                                                 <option value="Wrong Pincode / Address">
//                                                   Wrong Pincode / Address
//                                                 </option>

//                                                 <option value="Wrong Contact Details">
//                                                   Wrong Contact Details
//                                                 </option>

//                                                 <option value="Package Damaged">
//                                                   Package Damaged
//                                                 </option>

//                                                 <option value="RTO by Seller">
//                                                   RTO by Seller
//                                                 </option>

//                                                 <option value="Return to Hub">
//                                                   Return to Hub
//                                                 </option>

//                                                 <option value="Return to Seller / FC">
//                                                   Return to Seller / FC
//                                                 </option>

//                                                 <option value="Max. Attempts Reached">
//                                                   Max. Attempts Reached
//                                                 </option>
//                                               </select>
//                                             </div>
//                                           )}

//                                           {/* Sub Remarks */}
//                                           {newRTORemarkStatus ===
//                                             "Customer Refused / Cancelled" && (
//                                             <div>
//                                               <label className="text-xs font-medium dark:text-white">
//                                                 Sub Remarks
//                                               </label>

//                                               <select
//                                                 name="sub_remarks"
//                                                 defaultValue=""
//                                                 className="mt-1 text-xs w-full border border-gray-300 rounded-md
//                        px-2 py-2 focus:ring-2 dark:text-white
//                        dark:bg-gray-800 focus:ring-indigo-400
//                        focus:outline-none"
//                                                 required
//                                               >
//                                                 <option disabled value="">
//                                                   Select Sub Remarks
//                                                 </option>

//                                                 <option value="Duplicate Order">
//                                                   Duplicate Order
//                                                 </option>

//                                                 <option value="Order Placed by Mistake">
//                                                   Order Placed by Mistake
//                                                 </option>

//                                                 <option value="COD Amount Not Ready">
//                                                   COD Amount Not Ready
//                                                 </option>

//                                                 <option value="Better Price Elsewhere">
//                                                   Better Price Elsewhere
//                                                 </option>

//                                                 <option value="Other">
//                                                   Other
//                                                 </option>
//                                               </select>
//                                             </div>
//                                           )}

//                                           {/* Change Phone */}
//                                           {newStatus === "change_phone" && (
//                                             <div>
//                                               <label className="text-xs font-medium">
//                                                 Phone Number
//                                               </label>

//                                               <input
//                                                 type="tel"
//                                                 name="phone"
//                                                 placeholder="Enter Phone Number"
//                                                 className="mt-1 text-xs w-full border border-gray-300
//                        rounded-md px-2 py-2 focus:ring-2
//                        focus:ring-indigo-400 focus:outline-none"
//                                                 required
//                                               />
//                                             </div>
//                                           )}

//                                           {/* Change Address */}
//                                           {newStatus === "change_address" && (
//                                             <>
//                                               <div>
//                                                 <label className="text-xs font-medium">
//                                                   Customer Name
//                                                 </label>

//                                                 <input
//                                                   type="text"
//                                                   name="name"
//                                                   placeholder="Enter Customer Name"
//                                                   className="mt-1 text-xs w-full border border-gray-300
//                          rounded-md px-2 py-2 focus:ring-2
//                          focus:ring-indigo-400 focus:outline-none"
//                                                   required
//                                                 />
//                                               </div>

//                                               <div>
//                                                 <label className="text-xs font-medium">
//                                                   Customer Address
//                                                 </label>

//                                                 <input
//                                                   type="text"
//                                                   name="address1"
//                                                   placeholder="Enter Customer Address"
//                                                   className="mt-1 text-xs w-full border border-gray-300
//                          rounded-md px-2 py-2 focus:ring-2
//                          focus:ring-indigo-400 focus:outline-none"
//                                                   required
//                                                 />
//                                               </div>
//                                             </>
//                                           )}

//                                           {/* Other Remarks */}
//                                           <div>
//                                             <label className="text-xs font-medium dark:text-white">
//                                               Other Remarks
//                                             </label>

//                                             <input
//                                               type="text"
//                                               name="other_remarks"
//                                               placeholder="Enter remarks"
//                                               className="mt-1 text-xs w-full border border-gray-300
//                      bg-white text-black rounded-md px-2 py-2
//                      focus:outline-none focus:ring-2
//                      focus:ring-indigo-400
//                      dark:bg-gray-900 dark:border-gray-700
//                      dark:text-white"
//                                             />
//                                           </div>
//                                         </form>

//                                         <AlertDialogFooter>
//                                           <AlertDialogCancel
//                                             onClick={() => {
//                                               setEditingStatusId(null);
//                                               setNewStatus(null);
//                                               setRTORemarksStatus(" ");
//                                             }}
//                                           >
//                                             Cancel
//                                           </AlertDialogCancel>

//                                           <AlertDialogAction
//                                             type="submit"
//                                             form="status-update-form"
//                                           >
//                                             Update
//                                           </AlertDialogAction>
//                                         </AlertDialogFooter>
//                                       </AlertDialogContent>
//                                     </AlertDialog>
//                                   </div>
//                                 )}

//                                 <Dialog className="w-5xl">
//                                   <DialogTrigger
//                                     onClick={() => handleHistoryClick(d)}
//                                     asChild
//                                   >
//                                     <Button
//                                       variant="outline"
//                                       className="text-xs font-medium  text-red-600  inline-block cursor-pointer "
//                                     >
//                                       <span>
//                                         <TbFileInfo />
//                                       </span>
//                                     </Button>
//                                   </DialogTrigger>
//                                   <DialogContent className="sm:max-w-4xl">
//                                     <DialogHeader>
//                                       <DialogTitle>
//                                         NDR Action History
//                                       </DialogTitle>
//                                     </DialogHeader>

//                                     <div>
//                                       {historyItem && historyItem.length > 0 ? (
//                                         <div className="space-y-4">
//                                           {historyItem.map((item, index) => (
//                                             <div
//                                               key={item.action_id}
//                                               className="border border-gray-200 rounded-lg p-4 bg-gray-50"
//                                             >
//                                               <div className="text-sm font-medium text-gray-800 mb-1">
//                                                 {item.action_taken ===
//                                                 "change_address" ? (
//                                                   <span className=" font-semibold text-gray-900">
//                                                     Change Address
//                                                   </span>
//                                                 ) : item.action_taken ===
//                                                   "change_phone" ? (
//                                                   <span className=" font-semibold text-gray-900">
//                                                     Change Phone Number
//                                                   </span>
//                                                 ) : item.action_taken ===
//                                                   "reattempt" ? (
//                                                   <span className=" font-semibold text-gray-900">
//                                                     Reattempt
//                                                   </span>
//                                                 ) : (
//                                                   <span className=" font-semibold text-gray-900">
//                                                     {item.action_taken}
//                                                   </span>
//                                                 )}
//                                               </div>
//                                               <div className="text-sm text-gray-600 mb-1">
//                                                 {item.action_taken ==
//                                                 "change_phone" ? (
//                                                   <>
//                                                     <span className="font-semibold">
//                                                       Phone Number:
//                                                     </span>{" "}
//                                                     {item.customer_phone}
//                                                   </>
//                                                 ) : item.action_taken ==
//                                                   "change_address" ? (
//                                                   <>
//                                                     <>
//                                                       <span className="font-semibold">
//                                                         Name:
//                                                       </span>{" "}
//                                                       {item.customer_name}{" "}
//                                                       <br />
//                                                       <span className="font-semibold">
//                                                         Address:
//                                                       </span>{" "}
//                                                       {
//                                                         item.customer_details_address
//                                                       }
//                                                     </>
//                                                   </>
//                                                 ) : (
//                                                   <>
//                                                     <span className="font-semibold">
//                                                       Remarks:
//                                                     </span>{" "}
//                                                     {item.remarks}
//                                                   </>
//                                                 )}
//                                               </div>

//                                               {item?.sub_remarks && (
//                                                 <div className="text-sm text-gray-600 mb-1">
//                                                   <span className="font-semibold">
//                                                     Sub Remarks :{" "}
//                                                   </span>{" "}
//                                                   {item?.sub_remarks}
//                                                 </div>
//                                               )}

//                                               {item?.rescheduled_date && (
//                                                 <div className="text-sm text-gray-600 mb-1">
//                                                   <span className="font-semibold">
//                                                     Rescheduled Date :{" "}
//                                                   </span>{" "}
//                                                   {item?.rescheduled_date}
//                                                 </div>
//                                               )}
//                                               {item?.detailed_remarks && (
//                                                 <div className="text-sm text-gray-600 mb-1">
//                                                   <span className="font-semibold">
//                                                     Other Remarks :{" "}
//                                                   </span>{" "}
//                                                   {item?.detailed_remarks}
//                                                 </div>
//                                               )}
//                                               <div className="text-sm text-gray-600 mb-1">
//                                                 <span className="font-semibold">
//                                                   Date/Time:
//                                                 </span>{" "}
//                                                 {new Date(
//                                                   item.created_at,
//                                                 ).toLocaleString("en-IN", {
//                                                   timeZone: "Asia/Kolkata",
//                                                   day: "2-digit",
//                                                   month: "2-digit",
//                                                   year: "numeric",
//                                                   hour: "2-digit",
//                                                   minute: "2-digit",
//                                                   hour12: true,
//                                                 })}
//                                               </div>
//                                             </div>
//                                           ))}
//                                         </div>
//                                       ) : (
//                                         <div className="text-center py-8 text-gray-500">
//                                           No history found for this NDR
//                                         </div>
//                                       )}
//                                     </div>

//                                     <DialogFooter>
//                                       <DialogClose asChild>
//                                         <Button variant="outline">
//                                           Cancel
//                                         </Button>
//                                       </DialogClose>
//                                     </DialogFooter>
//                                   </DialogContent>
//                                 </Dialog>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </>
//                 ) : (
//                   <div className="text-center py-12">
//                     <div className="flex flex-col items-center justify-center text-gray-500">
//                       <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                         <FaHistory className="w-8 h-8 text-gray-400" />
//                       </div>
//                       <p className="text-lg font-medium text-gray-400">
//                         No NDR records found
//                       </p>
//                       <p className="text-sm text-gray-400 mt-1">
//                         Try adjusting your filters or search terms
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Pagination */}
//               {data.length > 0 && (
//                 <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
//                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                     <p className="text-sm text-gray-700">
//                       Showing page {page} of {totalPages}
//                     </p>
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//                         disabled={page === 1}
//                         className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                           page === 1
//                             ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                             : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//                         }`}
//                       >
//                         Previous
//                       </button>
//                       <button
//                         onClick={() =>
//                           setPage((prev) => Math.min(prev + 1, totalPages))
//                         }
//                         disabled={page === totalPages}
//                         className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                           page === totalPages
//                             ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                             : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//                         }`}
//                       >
//                         Next
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </main>

//           {editingStatusId && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(46,46,46,0.5)] px-3 sm:px-0">
//               <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden">
//                 {/* Modal Header */}
//                 <div className="bg-[#0446DB] px-4 sm:px-6 py-3 sm:py-4">
//                   <h2 className="text-lg sm:text-xl font-semibold text-white">
//                     Take Action
//                   </h2>
//                 </div>

//                 {/* Modal Body */}
//                 <div className="px-4 sm:px-6 py-4 overflow-y-auto max-h-[60vh]">
//                   <form
//                     onSubmit={async (e) => {
//                       e.preventDefault();
//                       const rot_remarks =
//                         e?.target?.elements?.rot_remarks?.value || "";
//                       const newStatus =
//                         e?.target?.elements?.status?.value || "";
//                       const newRemarks = rot_remarks
//                         ? rot_remarks
//                         : e?.target?.elements?.remarks?.value || "";
//                       const other_remarks =
//                         e?.target?.elements?.other_remarks?.value || "";
//                       const sub_remarks =
//                         e?.target?.elements?.sub_remarks?.value || "";
//                       const phone = e?.target?.elements?.phone?.value || "";
//                       const name = e?.target?.elements?.name?.value || "";
//                       const address1 =
//                         e?.target?.elements?.address1?.value || "";
//                       // const address2 = e?.target?.elements?.address2?.value || "";
//                       const data = {
//                         action: newStatus,
//                         remarks: newRemarks,
//                         sub_remarks: sub_remarks,
//                         detailed_remarks: other_remarks,
//                         customer_name: name,
//                         customer_details_address: address1,
//                         customer_phone: phone,
//                       };

//                       changeStatus(data, editingStatusId);
//                     }}
//                     className="flex flex-col gap-1"
//                   >
//                     {/* Status */}
//                     <div>
//                       <label className="text-xs font-medium">Select</label>
//                       <select
//                         name="status"
//                         defaultValue=""
//                         onChange={(e) => {
//                           setNewStatus(e.target.value);
//                           setRTORemarksStatus(" ");
//                         }}
//                         className="mt-0 text-xs w-full border border-gray-300 rounded-md
//                        px-2 py-2 mb-0 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//                         required
//                       >
//                         <option disabled value="">
//                           Change Status
//                         </option>
//                         <option value="change_address">Change Address</option>
//                         <option value="change_phone">
//                           Change Phone Number
//                         </option>
//                         <option value="reattempt">Reattempt</option>
//                         <option value="rto">RTO</option>
//                       </select>
//                     </div>

//                     {/* change phone number */}

//                     {newStatus == "rto" && (
//                       <>
//                         <div>
//                           <label className="text-xs font-medium dark:text-white">
//                             Select Remarks
//                           </label>
//                           <select
//                             name="rot_remarks"
//                             defaultValue=""
//                             onChange={(e) =>
//                               setRTORemarksStatus(e.target.value)
//                             }
//                             className="mt-0 text-xs w-full border border-gray-300 rounded-md
//                        px-2 py-2 mb-0 focus:ring-2 dark:text-white dark:bg-gray-800 focus:ring-indigo-400 focus:outline-none"
//                             required
//                           >
//                             <option disabled value="">
//                               Remarks
//                             </option>

//                             <option value="Address Incorrect / Incomplete">
//                               Address Incorrect / Incomplete
//                             </option>
//                             <option value="Customer Refused / Cancelled">
//                               Customer Refused / Cancelled
//                             </option>
//                             <option value="Wrong Pincode / Address">
//                               Wrong Pincode / Address
//                             </option>
//                             <option value="Wrong Contact Details">
//                               Wrong Contact Details
//                             </option>
//                             <option value="Package Damaged">
//                               Package Damaged
//                             </option>
//                             <option value="RTO by Seller">RTO by Seller</option>
//                             <option value="Return to Hub">Return to Hub</option>
//                             <option value="Return to Seller / FC">
//                               Return to Seller / FC
//                             </option>
//                             <option value="Max. Attempts Reached">
//                               Max. Attempts Reached
//                             </option>
//                           </select>
//                         </div>
//                       </>
//                     )}
//                     {newRTORemarkStatus === "Customer Refused / Cancelled" && (
//                       <>
//                         <div>
//                           <label className="text-xs font-medium dark:text-white">
//                             Sub Remarks
//                           </label>
//                           <select
//                             name="sub_remarks"
//                             defaultValue=""
//                             // onChange={(e) => setRTORemarksStatus(e.target.value)}
//                             className="mt-0 text-xs w-full border border-gray-300 rounded-md
//                        px-2 py-2 mb-0 focus:ring-2 dark:text-white dark:bg-gray-800 focus:ring-indigo-400 focus:outline-none"
//                             required
//                           >
//                             <option disabled value="">
//                               Select Sub Remarks
//                             </option>

//                             <option value="Duplicate Order">
//                               Duplicate Order
//                             </option>
//                             <option value="Order Placed by Mistake">
//                               Order Placed by Mistake
//                             </option>
//                             <option value="COD Amount Not Ready">
//                               COD Amount Not Ready
//                             </option>

//                             <option value="Better Price Elsewhere">
//                               Better Price Elsewhere
//                             </option>
//                             <option value="Other">Other</option>
//                           </select>
//                         </div>
//                       </>
//                     )}

//                     {newStatus === "change_phone" && (
//                       <div>
//                         <label className="text-xs font-medium">
//                           Phone Number
//                         </label>
//                         <input
//                           type="phone"
//                           name="phone"
//                           className="mt-0 text-xs w-full border border-gray-300 rounded-md
//                        px-2 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//                         />
//                       </div>
//                     )}
//                     {newStatus === "change_address" && (
//                       <>
//                         <div>
//                           <label className="text-xs font-medium">
//                             Customer Name
//                           </label>
//                           <input
//                             type="name"
//                             name="name"
//                             className="mt-0 text-xs w-full border border-gray-300 rounded-md
//                        px-2 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//                           />
//                         </div>
//                         <div>
//                           <label className="text-xs font-medium">
//                             Customer Address
//                           </label>
//                           <input
//                             type="address1"
//                             name="address1"
//                             className="mt-0 text-xs w-full border border-gray-300 rounded-md
//                        px-2 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//                           />
//                         </div>
//                         {/* <div>
//                             <label className="text-xs font-medium">Customer Address2</label>
//                             <input
//                               type="address2"
//                               name="address2"
//                               className="mt-0 text-xs w-full border border-gray-300 rounded-md
//                        px-2 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//                             />
//                           </div> */}
//                       </>
//                     )}

//                     <div>
//                       <label className="text-xs font-medium dark:text-white">
//                         Other Remarks
//                       </label>
//                       <input
//                         type="text"
//                         name="other_remarks"
//                         className="
//                                                     mt-0 text-xs w-full
//                                                     border border-gray-300
//                                                     bg-white text-black
//                                                     rounded-md px-2 py-2
//                                                     focus:outline-none focus:ring-2 focus:ring-indigo-400
//                                                     dark:bg-gray-900 dark:border-gray-700 dark:text-white
//                                                     dark:focus:ring-indigo-500
//                                                   "
//                       />
//                     </div>

//                     {/* Submit */}
//                     <div className=" flex gap-1 justify-end">
//                       <button
//                         type="submit"
//                         className="w-full sm:w-auto bg-[#0446DB] text-white
//                      text-xs px-4 py-2 rounded
//                       transition cursor-pointer"
//                       >
//                         Update
//                       </button>
//                       <button
//                         onClick={() => {
//                           setEditingStatusId(null);
//                           setNewStatus(null);
//                           setRTORemarksStatus(" ");
//                         }}
//                         className="w-full sm:w-auto bg-red-200 text-red-600
//                      text-xs px-4 py-2 rounded cursor-pointer"
//                       >
//                         Close
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );
// }

// export default MerchantNDR;






import { useState, useEffect } from "react";
import axios from "axios";

import {
  FaRegCopy,
  FaFilter,
  FaDownload,
  FaHistory,
  FaTimes,
  FaFileUpload,
  FaFileCsv,
} from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Drawer,
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TbFileInfo } from "react-icons/tb";
import { Loader2 } from "lucide-react";
import CustomButton from "../../../common/CustomButton";
const baseURL = import.meta.env.VITE_BASE_URL;
const frontEndURL = import.meta.env.VITE_FRONTEND_URL;
function MerchantNDR() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [historyItem, setHistoryItem] = useState(null);
  const [copySuccess, setCopySuccess] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [newRTORemarkStatus, setRTORemarksStatus] = useState("");

  function toCapitalizeEachWord(str) {
    return str
      .split(" ")
      .map((word) => {
        if (!word) return "";
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  }

  /* Status Filter */
  const filters = [
    ["All", ""],
    ["Action Required", "actionable"],
    ["Action Taken", "actiontaken"],
    ["RTO", "rto"],
    ["Delivered", "delivered"],
  ];
  const [selectedFilter, setSelectedFilter] = useState("");

  /* Advance Filter */
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDrawerFilterOpen, setIsDrawerFilterOpen] = useState(false);
  const [advanceFilters, setAdvanceFilters] = useState({
    startDate: "",
    endDate: "",
    awb_number: "",
  });
  const [filterUpdate, setFilterUpdate] = useState(false);

  const openDatePicker = (event) => {
    try {
      event.currentTarget.showPicker?.();
    } catch {
      return;
    }
  };

  const updateAdvanceFilter = (field, value) => {
    setAdvanceFilters((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };

      if (
        field === "startDate" &&
        next.endDate &&
        value &&
        next.endDate < value
      ) {
        next.endDate = value;
      }

      if (
        field === "endDate" &&
        next.startDate &&
        value &&
        next.startDate > value
      ) {
        next.startDate = value;
      }

      return next;
    });
  };

  const applyFilters = () => {
    if (
      advanceFilters.startDate &&
      advanceFilters.endDate &&
      advanceFilters.startDate > advanceFilters.endDate
    ) {
      toast.error("Start date cannot be after end date");
      return false;
    }

    setPage(1);
    setFilterUpdate((prev) => !prev);
    setIsFilterOpen(false);
    setIsDrawerFilterOpen(false);
    return true;
  };

  const resetAdvanceFilters = async () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    setAdvanceFilters((prev) => ({
      endDate: today.toISOString().split("T")[0],
      startDate: oneMonthAgo.toISOString().split("T")[0],
      awb_number: "",
    }));
  };

  const resetFilters = () => {
    resetAdvanceFilters();
    setPage(1);
    setFilterUpdate((prev) => !prev);
    setIsFilterOpen(false);
    setIsDrawerFilterOpen(false);
  };

  useEffect(() => {
    resetAdvanceFilters();
  }, []);

  const handleChange = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (!file) {
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
        `${baseURL}/api/merchant/handleMerchantNDRBulkAction`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
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

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/merchant/getMerchantNDRs`, {
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
      });
      setData(res.data.data || []);
      setTotalPages(Math.ceil(Math.max(1, res.data.pagination?.total) / limit));
      setLimit(res.data.pagination?.limit);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch NDR data:",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedFilter, filterUpdate, page]);

  /* Handle Change Status */
  const changeStatus = async (data, ndr_id) => {
    setLoading(true);

    try {
      await axios.post(
        `${baseURL}/api/merchant/handleMerchantNDRAction/${ndr_id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      await fetchData();
      setEditingStatusId(null);
      toast.success(res?.data?.message);
      return;
    } catch (err) {
      toast.error(err.response?.data?.message);
      return;
    } finally {
      setLoading(false);
    }
  };

  /* Fetch History */
  const handleHistoryClick = async (d) => {
    // setLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/merchant/getOrderDetailsByMerchant`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            awb_number: d.awb_number,
          },
        },
      );
      setHistoryItem(res.data.ndr_details?.actions);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Error while fetching history data of the order",
      );
    } finally {
      setLoading(false);
    }
  };

  const Sample = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/merchant/downloadMerchantNDRSampleFile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "NDR Action Format.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Sample file downloaded successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to export orders",
      );
    } finally {
      setLoading(false);
    }
  };
  const exportCSV = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/api/merchant/exportNDRs`,
        {},
        {
          params: {
            start_date: advanceFilters.startDate,
            end_date: advanceFilters.endDate,
            awb_number: advanceFilters.awb_number,
            statusType: selectedFilter,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "NDR Action Format.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Sample file downloaded successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to export orders",
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      actionable: "bg-orange-100 text-orange-800 border-orange-200",
      actiontaken: "bg-blue-100 text-blue-800 border-blue-200",
      rto: "bg-red-100 text-red-800 border-red-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      default: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return statusColors[status] || statusColors.default;
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
        <div className=" w-full h-[90vh] flex justify-center items-center">
          <div>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2"> Loading NDR Orders...</p>
          </div>
        </div>
      ) : (
        <div className="flex h-[calc(100dvh-76px)] min-h-0 flex-col overflow-hidden dark:bg-neutral-900">
          {/* Header Section */}
          <header className="z-20 shrink-0  dark:bg-neutral-900">
            <div className=" mx-auto py-3">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="text-center lg:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">
                    NDR Management
                  </h1>
                  <p className="dark:text-indigo-100 mt-2 text-sm sm:text-base">
                    Manage Non-Delivery Reports efficiently
                  </p>
                </div>

                <div className="flex flex-row md:flex gap-2 items-center">
                  {/* Bulk Action */}
                  <div className="relative">

                    <CustomButton 
                     icon={FaFileUpload}
                    >
                       
                      Bulk Action
                      <input
                        type="file"
                        name="bulk_ndr"
                        onChange={handleChange}
                        accept=".csv"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </CustomButton>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center items-center gap-2">
                    <CustomButton
                      variant="outline"
                      icon={FaFileCsv}
                      onClick={Sample}
                    >
                      
                    Sample
                    </CustomButton>
                    <CustomButton
                    variant="outline"
                    icon={FaFileCsv}
                      onClick={exportCSV}
                    >
                      
                      Export
                    </CustomButton>
                    <Drawer
                      direction="right"
                      open={isDrawerFilterOpen}
                      onOpenChange={setIsDrawerFilterOpen}
                    >
                      <DrawerTrigger asChild>
                        <CustomButton
                          icon={FaFilter}
                          variant="outline"
                          className="bg-white mt-1 text-[#0446DB] dark:bg-white font-medium px-5 py-2.5  shadow hover:bg-indigo-100 hover:shadow-lg transition flex items-center gap-2"
                        >
                          
                          <span>Filter</span>
                        </CustomButton>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>Filter</DrawerTitle>
                          {/* <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}
                        </DrawerHeader>
                        <div className="p-6 h-[calc(100vh-80px)] overflow-y-auto">
                          <div className="space-y-4">
                            {/* Date Range */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Start Date
                                </label>
                                <input
                                  type="date"
                                  value={advanceFilters.startDate}
                                  max={advanceFilters.endDate || undefined}
                                  onClick={openDatePicker}
                                  onFocus={openDatePicker}
                                  onChange={(e) =>
                                    updateAdvanceFilter(
                                      "startDate",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full cursor-pointer border border-gray-300 bg-white px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  End Date
                                </label>
                                <input
                                  type="date"
                                  value={advanceFilters.endDate}
                                  min={advanceFilters.startDate || undefined}
                                  onClick={openDatePicker}
                                  onFocus={openDatePicker}
                                  onChange={(e) =>
                                    updateAdvanceFilter(
                                      "endDate",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full cursor-pointer border border-gray-300 bg-white px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                />
                              </div>
                            </div>

                            {/* NDR ID */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                AWB No
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
                                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                            <Button
                              onClick={applyFilters}
                              className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-md"
                            >
                              Apply Filters
                            </Button>
                            <Button
                              onClick={resetFilters}
                              className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium shadow-md"
                            >
                              Reset
                            </Button>
                          </div>
                        </div>
                        <DrawerFooter>
                          <Button
                            onClick={() => setIsDrawerFilterOpen(false)}
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="relative z-10 flex min-h-0 w-full flex-1 flex-col overflow-hidden">
            {/* Status Filter Tabs */}
            <div className="z-10 shrink-0 bg-white border-b  p-2 dark:bg-neutral-800">
              <div className="flex bg-white flex-wrap gap-2 justify-left">
                {filters.map((filter) => (
                  <Button
                    key={filter[0]}
                    onClick={() => {
                      setSelectedFilter(filter[1]);
                      setPage(1);
                    }}
                    className={`px-2 py-3 rounded-sm border-2 transition-all duration-300 font-medium flex items-center gap-2 ${
                      selectedFilter === filter[1]
                        ? "bg-[#0446DB] text-white border-transparent shadow-lg transform scale-105"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md"
                    }`}
                  >
                    {filter[0]}
                  </Button>
                ))}
              </div>
            </div>

            {/* NDR Table */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-neutral-900">
              <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
                {loading? (
                  <>
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700 dark:bg-neutral-800">
                      <thead className="dark:bg-neutral-800">
                        <tr>
                          <th className="sticky top-0 z-20 bg-gray-50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:bg-neutral-800 dark:text-gray-300">
                            NDR Information
                          </th>

                          <th className="sticky top-0 z-20 bg-gray-50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:bg-neutral-800 dark:text-gray-300">
                            Order Details
                          </th>

                          <th className="sticky top-0 z-20 bg-gray-50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:bg-neutral-800 dark:text-gray-300">
                            Customer Information
                          </th>

                          <th className="sticky top-0 z-20 bg-gray-50 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:bg-neutral-800 dark:text-gray-300">
                            Status & Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                        <tr className="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-neutral-700/50">
                          <td colSpan={4} className="px-6 py-10 text-center">
                            <div className="flex items-center justify-center">
                              <div>
                                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                                <p className="mt-2">
                                  {" "}
                                  Loading NDR Details...
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                ) : data.length > 0 ? (
                  <>
                    {/* Desktop Table */}
                    <table className="min-w-full divide-y divide-gray-200 dark:bg-neutral-800">
                      <thead className="dark:bg-neutral-800">
                        <tr>
                          <th className="sticky top-0 z-20 bg-gray-50 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:bg-neutral-800 dark:text-gray-300">
                            NDR Information
                          </th>
                          <th className="sticky top-0 z-20 bg-gray-50 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:bg-neutral-800 dark:text-gray-300">
                            Order Details
                          </th>
                          <th className="sticky top-0 z-20 bg-gray-50 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:bg-neutral-800 dark:text-gray-300">
                            Customer Information
                          </th>
                          <th className="sticky top-0 z-20 bg-gray-50 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:bg-neutral-800 dark:text-gray-300">
                            Status & Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {data.map((d) => (
                          <tr
                            key={d.ndr_id}
                            className="hover:bg-gray-50 transition-colors duration-200"
                          >
                            {/* NDR Information */}
                            <td className="px-6">
                              <div className="">
                                <p className=" text-gray-800">
                                  {d.ndr_id}
                                </p>
                              </div>
                            </td>

                            {/* Order Details */}
                            <td className="px-2 ">
                              <div className="">
                                <a
                                  href={`${frontEndURL}/track-order?awb_number=${d.awb_number}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline whitespace-nowrap text-blue-700 hover:text-blue-500"
                                >
                                  {d.awb_number}
                                </a>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(d.awb_number);
                                    setCopySuccess(d.awb_number);
                                    setTimeout(
                                      () => setCopySuccess(null),
                                      2000,
                                    );
                                    toast.success("AWB copied to clipboard");
                                  }}
                                  className="text-gray-400 hover:text-[#0446DB] transition-colors duration-200 p-1 rounded"
                                >
                                  {copySuccess === d.awb_number ? (
                                    <CiCircleCheck className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <FaRegCopy className="w-4 h-4" />
                                  )}
                                </button>
                                <div className=" flex items-center">
                                  <p className="text-sm font-medium whitespace-nowrap text-gray-600">
                                    Order ID:{" "}
                                  </p>
                                  <p className="font-semibold whitespace-nowrap text-gray-800">
                                    {d.id}
                                  </p>
                                </div>
                                <div className=" flex items-center">
                                  <p className="text-sm font-medium whitespace-nowrap text-gray-600">
                                    Merchant Order ID:{" "}
                                  </p>
                                  <p className="text-gray-800">
                                    {d.merchant_order_id}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Customer Information */}
                            <td className="px-2 ">
                              <div className=" ">
                                <p className="font-semibold text-gray-800 whitespace-nowrap">
                                  {d.delivery_contact_name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {d.delivery_address_line}
                                </p>
                                <p className="text-sm text-gray-500 whitespace-nowrap">
                                  {d.delivery_city}, {d.delivery_state} -{" "}
                                  {d.delivery_pincode}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {d.delivery_country}
                                </p>
                              </div>
                            </td>

                            {/* Status & Actions */}
                            <td className="px-2 ">
                              <div className=" flex items-center gap-1">
                                <div>
                                  <span
                                    className={`px-3 py-2 rounded-full whitespace-nowrap text-sm font-semibold border ${getStatusColor(d.status)}`}
                                  >
                                    {toCapitalizeEachWord(d.status) ||
                                      "Pending"}
                                  </span>
                                </div>

                                {selectedFilter === "actionable" && (
                                  <div>
                                    {/* <Button
                                    onClick={() => setEditingStatusId(d.ndr_id)}
                                    className="w-full whitespace-nowrap bg-[#0446DB] text-white px-4 py-1 rounded-lg  transition-colors duration-200 font-medium text-sm"
                                  >
                                    Take Action
                                  </Button> */}

                                    <AlertDialog>
                                      <AlertDialogTrigger
                                        render={<Button variant="outline" />}
                                      >
                                        <Button className="bg-[#0446DB]">
                                          Take Action
                                        </Button>
                                      </AlertDialogTrigger>

                                      <AlertDialogContent className="!max-w-xl max-h-[90vh] overflow-y-auto">
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>
                                            Take Action
                                          </AlertDialogTitle>

                                          <AlertDialogDescription>
                                            Select an action and update the
                                            order details.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>

                                        <form
                                          id="status-update-form"
                                          onSubmit={async (e) => {
                                            e.preventDefault();

                                            const form = e.currentTarget;

                                            const rot_remarks =
                                              form.elements.rot_remarks
                                                ?.value || "";

                                            const newStatus =
                                              form.elements.status?.value || "";

                                            const newRemarks = rot_remarks
                                              ? rot_remarks
                                              : form.elements.remarks?.value ||
                                                "";

                                            const other_remarks =
                                              form.elements.other_remarks
                                                ?.value || "";

                                            const sub_remarks =
                                              form.elements.sub_remarks
                                                ?.value || "";

                                            const phone =
                                              form.elements.phone?.value || "";

                                            const name =
                                              form.elements.name?.value || "";

                                            const address1 =
                                              form.elements.address1?.value ||
                                              "";

                                            const data = {
                                              action: newStatus,
                                              remarks: newRemarks,
                                              sub_remarks: sub_remarks,
                                              detailed_remarks: other_remarks,
                                              customer_name: name,
                                              customer_details_address:
                                                address1,
                                              customer_phone: phone,
                                            };

                                            console.log("Submit Data:", data);

                                            await changeStatus(
                                              data,
                                              editingStatusId,
                                            );
                                          }}
                                          className="flex flex-col gap-3"
                                        >
                                          {/* Status */}
                                          <div>
                                            <label className="text-xs font-medium">
                                              Select
                                            </label>

                                            <select
                                              name="status"
                                              defaultValue=""
                                              onChange={(e) => {
                                                setNewStatus(e.target.value);
                                                setRTORemarksStatus(" ");
                                              }}
                                              className="mt-1 text-xs w-full border border-gray-300 rounded-md
                     px-2 py-2 focus:ring-2 focus:ring-indigo-400
                     focus:outline-none dark:bg-gray-800 dark:text-white"
                                              required
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

                                              <option value="reattempt">
                                                Reattempt
                                              </option>

                                              <option value="rto">RTO</option>
                                            </select>
                                          </div>

                                          {/* RTO */}
                                          {newStatus === "rto" && (
                                            <div>
                                              <label className="text-xs font-medium dark:text-white">
                                                Select Remarks
                                              </label>

                                              <select
                                                name="rot_remarks"
                                                defaultValue=""
                                                onChange={(e) =>
                                                  setRTORemarksStatus(
                                                    e.target.value,
                                                  )
                                                }
                                                className="mt-1 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 focus:ring-2 dark:text-white
                       dark:bg-gray-800 focus:ring-indigo-400
                       focus:outline-none"
                                                required
                                              >
                                                <option disabled value="">
                                                  Remarks
                                                </option>

                                                <option value="Address Incorrect / Incomplete">
                                                  Address Incorrect / Incomplete
                                                </option>

                                                <option value="Customer Refused / Cancelled">
                                                  Customer Refused / Cancelled
                                                </option>

                                                <option value="Wrong Pincode / Address">
                                                  Wrong Pincode / Address
                                                </option>

                                                <option value="Wrong Contact Details">
                                                  Wrong Contact Details
                                                </option>

                                                <option value="Package Damaged">
                                                  Package Damaged
                                                </option>

                                                <option value="RTO by Seller">
                                                  RTO by Seller
                                                </option>

                                                <option value="Return to Hub">
                                                  Return to Hub
                                                </option>

                                                <option value="Return to Seller / FC">
                                                  Return to Seller / FC
                                                </option>

                                                <option value="Max. Attempts Reached">
                                                  Max. Attempts Reached
                                                </option>
                                              </select>
                                            </div>
                                          )}

                                          {/* Sub Remarks */}
                                          {newRTORemarkStatus ===
                                            "Customer Refused / Cancelled" && (
                                            <div>
                                              <label className="text-xs font-medium dark:text-white">
                                                Sub Remarks
                                              </label>

                                              <select
                                                name="sub_remarks"
                                                defaultValue=""
                                                className="mt-1 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 focus:ring-2 dark:text-white
                       dark:bg-gray-800 focus:ring-indigo-400
                       focus:outline-none"
                                                required
                                              >
                                                <option disabled value="">
                                                  Select Sub Remarks
                                                </option>

                                                <option value="Duplicate Order">
                                                  Duplicate Order
                                                </option>

                                                <option value="Order Placed by Mistake">
                                                  Order Placed by Mistake
                                                </option>

                                                <option value="COD Amount Not Ready">
                                                  COD Amount Not Ready
                                                </option>

                                                <option value="Better Price Elsewhere">
                                                  Better Price Elsewhere
                                                </option>

                                                <option value="Other">
                                                  Other
                                                </option>
                                              </select>
                                            </div>
                                          )}

                                          {/* Change Phone */}
                                          {newStatus === "change_phone" && (
                                            <div>
                                              <label className="text-xs font-medium">
                                                Phone Number
                                              </label>

                                              <input
                                                type="tel"
                                                name="phone"
                                                placeholder="Enter Phone Number"
                                                className="mt-1 text-xs w-full border border-gray-300
                       rounded-md px-2 py-2 focus:ring-2
                       focus:ring-indigo-400 focus:outline-none"
                                                required
                                              />
                                            </div>
                                          )}

                                          {/* Change Address */}
                                          {newStatus === "change_address" && (
                                            <>
                                              <div>
                                                <label className="text-xs font-medium">
                                                  Customer Name
                                                </label>

                                                <input
                                                  type="text"
                                                  name="name"
                                                  placeholder="Enter Customer Name"
                                                  className="mt-1 text-xs w-full border border-gray-300
                         rounded-md px-2 py-2 focus:ring-2
                         focus:ring-indigo-400 focus:outline-none"
                                                  required
                                                />
                                              </div>

                                              <div>
                                                <label className="text-xs font-medium">
                                                  Customer Address
                                                </label>

                                                <input
                                                  type="text"
                                                  name="address1"
                                                  placeholder="Enter Customer Address"
                                                  className="mt-1 text-xs w-full border border-gray-300
                         rounded-md px-2 py-2 focus:ring-2
                         focus:ring-indigo-400 focus:outline-none"
                                                  required
                                                />
                                              </div>
                                            </>
                                          )}

                                          {/* Other Remarks */}
                                          <div>
                                            <label className="text-xs font-medium dark:text-white">
                                              Other Remarks
                                            </label>

                                            <input
                                              type="text"
                                              name="other_remarks"
                                              placeholder="Enter remarks"
                                              className="mt-1 text-xs w-full border border-gray-300
                     bg-white text-black rounded-md px-2 py-2
                     focus:outline-none focus:ring-2
                     focus:ring-indigo-400
                     dark:bg-gray-900 dark:border-gray-700
                     dark:text-white"
                                            />
                                          </div>
                                        </form>

                                        <AlertDialogFooter>
                                          <AlertDialogCancel
                                            onClick={() => {
                                              setEditingStatusId(null);
                                              setNewStatus(null);
                                              setRTORemarksStatus(" ");
                                            }}
                                          >
                                            Cancel
                                          </AlertDialogCancel>

                                          <AlertDialogAction
                                            type="submit"
                                            form="status-update-form"
                                          >
                                            Update
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                )}

                                <Dialog className="w-5xl">
                                  <DialogTrigger
                                    onClick={() => handleHistoryClick(d)}
                                    asChild
                                  >
                                    <Button
                                      variant="outline"
                                      className="text-xs font-medium  text-red-600  inline-block cursor-pointer "
                                    >
                                      <span>
                                        <TbFileInfo />
                                      </span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-4xl">
                                    <DialogHeader>
                                      <DialogTitle>
                                        NDR Action History
                                      </DialogTitle>
                                    </DialogHeader>

                                    <div>
                                      {historyItem && historyItem.length > 0 ? (
                                        <div className="space-y-4">
                                          {historyItem.map((item, index) => (
                                            <div
                                              key={item.action_id}
                                              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                                            >
                                              <div className="text-sm font-medium text-gray-800 mb-1">
                                                {item.action_taken ===
                                                "change_address" ? (
                                                  <span className=" font-semibold text-gray-900">
                                                    Change Address
                                                  </span>
                                                ) : item.action_taken ===
                                                  "change_phone" ? (
                                                  <span className=" font-semibold text-gray-900">
                                                    Change Phone Number
                                                  </span>
                                                ) : item.action_taken ===
                                                  "reattempt" ? (
                                                  <span className=" font-semibold text-gray-900">
                                                    Reattempt
                                                  </span>
                                                ) : (
                                                  <span className=" font-semibold text-gray-900">
                                                    {item.action_taken}
                                                  </span>
                                                )}
                                              </div>
                                              <div className="text-sm text-gray-600 mb-1">
                                                {item.action_taken ==
                                                "change_phone" ? (
                                                  <>
                                                    <span className="font-semibold">
                                                      Phone Number:
                                                    </span>{" "}
                                                    {item.customer_phone}
                                                  </>
                                                ) : item.action_taken ==
                                                  "change_address" ? (
                                                  <>
                                                    <>
                                                      <span className="font-semibold">
                                                        Name:
                                                      </span>{" "}
                                                      {item.customer_name}{" "}
                                                      <br />
                                                      <span className="font-semibold">
                                                        Address:
                                                      </span>{" "}
                                                      {
                                                        item.customer_details_address
                                                      }
                                                    </>
                                                  </>
                                                ) : (
                                                  <>
                                                    <span className="font-semibold">
                                                      Remarks:
                                                    </span>{" "}
                                                    {item.remarks}
                                                  </>
                                                )}
                                              </div>

                                              {item?.sub_remarks && (
                                                <div className="text-sm text-gray-600 mb-1">
                                                  <span className="font-semibold">
                                                    Sub Remarks :{" "}
                                                  </span>{" "}
                                                  {item?.sub_remarks}
                                                </div>
                                              )}

                                              {item?.rescheduled_date && (
                                                <div className="text-sm text-gray-600 mb-1">
                                                  <span className="font-semibold">
                                                    Rescheduled Date :{" "}
                                                  </span>{" "}
                                                  {item?.rescheduled_date}
                                                </div>
                                              )}
                                              {item?.detailed_remarks && (
                                                <div className="text-sm text-gray-600 mb-1">
                                                  <span className="font-semibold">
                                                    Other Remarks :{" "}
                                                  </span>{" "}
                                                  {item?.detailed_remarks}
                                                </div>
                                              )}
                                              <div className="text-sm text-gray-600 mb-1">
                                                <span className="font-semibold">
                                                  Date/Time:
                                                </span>{" "}
                                                {new Date(
                                                  item.created_at,
                                                ).toLocaleString("en-IN", {
                                                  timeZone: "Asia/Kolkata",
                                                  day: "2-digit",
                                                  month: "2-digit",
                                                  year: "numeric",
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                  hour12: true,
                                                })}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="text-center py-8 text-gray-500">
                                          No history found for this NDR
                                        </div>
                                      )}
                                    </div>

                                    <DialogFooter>
                                      <DialogClose asChild>
                                        <Button variant="outline">
                                          Cancel
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
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FaHistory className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-lg font-medium text-gray-400">
                        No NDR records found
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting your filters or search terms
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {data.length > 0 && (
                <div className="z-10 shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-neutral-700 dark:bg-neutral-800">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-sm text-gray-700">
                      Showing page {page} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          page === 1
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-[#0446DB] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        }`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          setPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={page === totalPages}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          page === totalPages
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-[#0446DB] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        }`}
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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(46,46,46,0.5)] px-3 sm:px-0">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="bg-[#0446DB] px-4 sm:px-6 py-3 sm:py-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-white">
                    Take Action
                  </h2>
                </div>

                {/* Modal Body */}
                <div className="px-4 sm:px-6 py-4 overflow-y-auto max-h-[60vh]">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const rot_remarks =
                        e?.target?.elements?.rot_remarks?.value || "";
                      const newStatus =
                        e?.target?.elements?.status?.value || "";
                      const newRemarks = rot_remarks
                        ? rot_remarks
                        : e?.target?.elements?.remarks?.value || "";
                      const other_remarks =
                        e?.target?.elements?.other_remarks?.value || "";
                      const sub_remarks =
                        e?.target?.elements?.sub_remarks?.value || "";
                      const phone = e?.target?.elements?.phone?.value || "";
                      const name = e?.target?.elements?.name?.value || "";
                      const address1 =
                        e?.target?.elements?.address1?.value || "";
                      // const address2 = e?.target?.elements?.address2?.value || "";
                      const data = {
                        action: newStatus,
                        remarks: newRemarks,
                        sub_remarks: sub_remarks,
                        detailed_remarks: other_remarks,
                        customer_name: name,
                        customer_details_address: address1,
                        customer_phone: phone,
                      };

                      changeStatus(data, editingStatusId);
                    }}
                    className="flex flex-col gap-1"
                  >
                    {/* Status */}
                    <div>
                      <label className="text-xs font-medium">Select</label>
                      <select
                        name="status"
                        defaultValue=""
                        onChange={(e) => {
                          setNewStatus(e.target.value);
                          setRTORemarksStatus(" ");
                        }}
                        className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 mb-0 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        required
                      >
                        <option disabled value="">
                          Change Status
                        </option>
                        <option value="change_address">Change Address</option>
                        <option value="change_phone">
                          Change Phone Number
                        </option>
                        <option value="reattempt">Reattempt</option>
                        <option value="rto">RTO</option>
                      </select>
                    </div>

                    {/* change phone number */}

                    {newStatus == "rto" && (
                      <>
                        <div>
                          <label className="text-xs font-medium dark:text-white">
                            Select Remarks
                          </label>
                          <select
                            name="rot_remarks"
                            defaultValue=""
                            onChange={(e) =>
                              setRTORemarksStatus(e.target.value)
                            }
                            className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 mb-0 focus:ring-2 dark:text-white dark:bg-gray-800 focus:ring-indigo-400 focus:outline-none"
                            required
                          >
                            <option disabled value="">
                              Remarks
                            </option>

                            <option value="Address Incorrect / Incomplete">
                              Address Incorrect / Incomplete
                            </option>
                            <option value="Customer Refused / Cancelled">
                              Customer Refused / Cancelled
                            </option>
                            <option value="Wrong Pincode / Address">
                              Wrong Pincode / Address
                            </option>
                            <option value="Wrong Contact Details">
                              Wrong Contact Details
                            </option>
                            <option value="Package Damaged">
                              Package Damaged
                            </option>
                            <option value="RTO by Seller">RTO by Seller</option>
                            <option value="Return to Hub">Return to Hub</option>
                            <option value="Return to Seller / FC">
                              Return to Seller / FC
                            </option>
                            <option value="Max. Attempts Reached">
                              Max. Attempts Reached
                            </option>
                          </select>
                        </div>
                      </>
                    )}
                    {newRTORemarkStatus === "Customer Refused / Cancelled" && (
                      <>
                        <div>
                          <label className="text-xs font-medium dark:text-white">
                            Sub Remarks
                          </label>
                          <select
                            name="sub_remarks"
                            defaultValue=""
                            // onChange={(e) => setRTORemarksStatus(e.target.value)}
                            className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 mb-0 focus:ring-2 dark:text-white dark:bg-gray-800 focus:ring-indigo-400 focus:outline-none"
                            required
                          >
                            <option disabled value="">
                              Select Sub Remarks
                            </option>

                            <option value="Duplicate Order">
                              Duplicate Order
                            </option>
                            <option value="Order Placed by Mistake">
                              Order Placed by Mistake
                            </option>
                            <option value="COD Amount Not Ready">
                              COD Amount Not Ready
                            </option>

                            <option value="Better Price Elsewhere">
                              Better Price Elsewhere
                            </option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </>
                    )}

                    {newStatus === "change_phone" && (
                      <div>
                        <label className="text-xs font-medium">
                          Phone Number
                        </label>
                        <input
                          type="phone"
                          name="phone"
                          className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        />
                      </div>
                    )}
                    {newStatus === "change_address" && (
                      <>
                        <div>
                          <label className="text-xs font-medium">
                            Customer Name
                          </label>
                          <input
                            type="name"
                            name="name"
                            className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">
                            Customer Address
                          </label>
                          <input
                            type="address1"
                            name="address1"
                            className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                          />
                        </div>
                        {/* <div>
                            <label className="text-xs font-medium">Customer Address2</label>
                            <input
                              type="address2"
                              name="address2"
                              className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            />
                          </div> */}
                      </>
                    )}

                    <div>
                      <label className="text-xs font-medium dark:text-white">
                        Other Remarks
                      </label>
                      <input
                        type="text"
                        name="other_remarks"
                        className="
                                                    mt-0 text-xs w-full
                                                    border border-gray-300
                                                    bg-white text-black
                                                    rounded-md px-2 py-2
                                                    focus:outline-none focus:ring-2 focus:ring-indigo-400
                                                    dark:bg-gray-900 dark:border-gray-700 dark:text-white
                                                    dark:focus:ring-indigo-500
                                                  "
                      />
                    </div>

                    {/* Submit */}
                    <div className=" flex gap-1 justify-end">
                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-[#0446DB] text-white
                     text-xs px-4 py-2 rounded
                      transition cursor-pointer"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => {
                          setEditingStatusId(null);
                          setNewStatus(null);
                          setRTORemarksStatus(" ");
                        }}
                        className="w-full sm:w-auto bg-red-200 text-red-600
                     text-xs px-4 py-2 rounded cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default MerchantNDR;
