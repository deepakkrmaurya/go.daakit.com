// import { useState, useEffect } from "react";
// import type { FormEvent } from "react";

// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// import Loader from "../Loader";

// import { FaRegCopy, FaSearch } from "react-icons/fa";

// import { CiCircleCheck } from "react-icons/ci";

// import { toast } from "react-toastify";

// import { UserRoles } from "@/utils/UserRole";

// import { Button } from "@/components/ui/button";

// import { Loader2 } from "lucide-react";

// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
// } from "@/components/ui/drawer";

// import {
//   AlertDialog,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";

// import { TbFileInfo } from "react-icons/tb";

// const baseURL = import.meta.env.VITE_BASE_URL;

// const frontEndURL = import.meta.env.VITE_FRONTEND_URL;

// function UserNDR() {
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);

//   const [data, setData] = useState<any[]>([]);

//   const [page, setPage] = useState<number>(1);

//   const [limit, setLimit] = useState<number>(50);

//   const [totalPages, setTotalPages] = useState<number>(1);

//   const [historyItem, setHistoryItem] = useState<any>(null);

//   const [takeAction, setTakeAction] = useState<any>(null);

//   const [copySuccess, setCopySuccess] = useState<any>(null);

//   const [editingStatusId, setEditingStatusId] = useState<any>(null);

//   const [newStatus, setNewStatus] = useState<string | null>("");

//   const [newRTORemarkStatus, setRTORemarksStatus] = useState("");

//   function toCapitalizeEachWord(str: string) {
//     return str

//       .split(" ")

//       .map((word) => {
//         if (!word) return "";

//         return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//       })

//       .join(" ");
//   }

//   /* Status Filter */

//   const filters: [string, string][] = [
//     ["All", ""],

//     ["Action Required", "actionable"],

//     ["Action Taken", "actiontaken"],

//     ["RTO", "rto"],

//     ["Delivered", "delivered"],
//   ];

//   const [selectedFilter, setSelectedFilter] = useState("");

//   /* Advance Filter */

//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   const [advanceFilters, setAdvanceFilters] = useState({
//     startDate: "",

//     endDate: "",

//     awb_number: "",
//   });

//   const [filterUpdate, setFilterUpdate] = useState(false);

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

//   useEffect(() => {
//     resetAdvanceFilters();
//   }, []);

//   // Fetch data from API

//   const fetchData = async () => {
//     setLoading(true);

//     try {
//       const res = await axios.get(`${baseURL}/api/user/getNDRs`, {
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
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || err.message || "Failed to fetch NDR data:");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const [permissions, setPermissions] = useState<any>(localStorage.getItem("permission"));

//   const getUserPermissions = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/api/user/getUserPermissions`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       const permission = res?.data?.data?.data || [];

//       if (!permission.includes("ODR_VIEW") && !permission.includes("ADMIN_FULL_ACCESS")) {
//         navigate("/unauthorized");

//         return;
//       }

//       setPermissions(res?.data?.data?.data);
//     } catch (error: any) {
//       console.log(error.response.data);
//     }
//   };

//   useEffect(() => {
//     fetchData();

//     // if (UserRoles.includes(localStorage.getItem("userType"))) {

//     //   getUserPermissions()

//     // }
//   }, [selectedFilter, filterUpdate, page]);

//   /* Handle Change Status */

//   const changeStatus = async (data: any, ndr_id: number | string) => {
//     setLoading(true);

//     try {
//       // console.log(data)

//       // return

//       const res = await axios.post(
//         `${baseURL}/api/user/handlendrs/${ndr_id}`,

//         data,

//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );

//       await fetchData();

//       setEditingStatusId(null);

//       setTakeAction(null);

//       toast.success(res?.data?.data?.message);
//     } catch (err: any) {
//       toast.error(
//         err.response?.data?.message ||
//           err.message ||
//           "Failed to take action on current NDR's status",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* Fetch History */

//   const handleHistoryClick = async (d: any) => {
//     setLoading(true);

//     try {
//       const res = await axios.get(
//         `${baseURL}/api/user/getNDRHistory/${d.ndr_id}`,

//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );

//       setHistoryItem(res.data.data);
//     } catch (err: any) {
//       toast.error(
//         err.response?.data?.message ||
//           err.message ||
//           "Error while fetching history data of the order",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const exportCSV = async () => {
//     setLoading(true);

//     try {
//       const res = await axios.get(`${baseURL}/api/user/exportNDRs`, {
//         params: {
//           statusType: selectedFilter === "All" ? "" : selectedFilter,

//           awb_number: advanceFilters.awb_number,

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

//       link.setAttribute("download", "ndr.csv");

//       document.body.appendChild(link);

//       link.click();

//       link.remove();
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || err.message || "Failed to export orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault(); // Page refresh rokega

//     fetchData();
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

//             <p className="mt-2"> Loading NDR Details...</p>
//           </div>
//         </div>
//       ) : (
//         <div className="  dark:bg-gray-900 flex h-[calc(100dvh-80px)] min-h-0 w-full flex-col overflow-hidden">
//           {/* Right Sidebar for filters */}

//           {/* Heading */}

//           <div className="w-full shrink-0 dark:bg-neutral-900 pb-4">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               {/* Title */}

//               <h1 className="text-xl sm:text-2xl font-semibold dark:text-white text-left">NDR</h1>

//               {/* Search Box */}

//               <div className="w-full md:flex-1 md:max-w-xl">
//                 <form onSubmit={handleSearch} className="flex w-full">
//                   <input
//                     name="awb_number"
//                     value={advanceFilters.awb_number}
//                     onChange={(e) => {
//                       setAdvanceFilters((prev) => ({
//                         ...prev,

//                         awb_number: e.target.value,
//                       }));
//                     }}
//                     type="text"
//                     placeholder="Search by AWB Number..."
//                     className="w-full px-4 py-2.5 rounded-l-lg text-sm text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0446db] focus:border-transparent"
//                   />

//                   <button
//                     type="submit"
//                     className="bg-white px-4 sm:px-5 py-2.5 rounded-r-lg border border-l-0 border-gray-300 text-gray-600 hover:bg-indigo-100 hover:text-[#0446db] transition"
//                   >
//                     <FaSearch />
//                   </button>
//                 </form>
//               </div>

//               {/* Buttons */}

//               <div className="flex  justify-center md:justify-end gap-3">
//                 {(permissions?.includes("NDR_EXPORT") ||
//                   permissions.includes("ADMIN_FULL_ACCESS")) && (
//                   <Button
//                     onClick={exportCSV}
//                     className="bg-[#0446DB] text-[#fff] hover:bg-[#0446DB]  font-medium px-4 sm:px-5 py-2 rounded-sm transition w-full sm:w-auto"
//                   >
//                     Export
//                   </Button>
//                 )}

//                 <Button
//                   onClick={() => setIsFilterOpen(true)}
//                   className="bg-[#0446DB] text-[#fff] hover:bg-[#0446DB] font-medium px-4 sm:px-5 py-2 rounded-sm transition w-full sm:w-auto"
//                 >
//                   Filter
//                 </Button>

//                 <Drawer direction="right" open={isFilterOpen} onOpenChange={setIsFilterOpen}>
//                   <DrawerContent className="h-full w-full sm:max-w-md rounded-none sm:rounded-l-xl border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
//                     {/* Header */}

//                     <DrawerHeader className="border-b border-gray-200 dark:border-gray-800 px-5 py-4">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <DrawerTitle className="text-lg font-semibold text-gray-900 dark:text-white">
//                             Advance Filters
//                           </DrawerTitle>

//                           <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
//                             Filter orders using date range and AWB number.
//                           </p>
//                         </div>

//                         <DrawerClose asChild>
//                           <button
//                             type="button"
//                             className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-gray-200 text-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
//                           >
//                             ×
//                           </button>
//                         </DrawerClose>
//                       </div>
//                     </DrawerHeader>

//                     {/* Body */}

//                     <form
//                       onSubmit={(e) => {
//                         e.preventDefault();

//                         setFilterUpdate((prev) => !prev);

//                         setIsFilterOpen(false);
//                       }}
//                       className="flex h-full flex-col overflow-hidden"
//                     >
//                       <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
//                         {/* Start Date */}

//                         <div>
//                           <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                             Start Date
//                           </label>

//                           <input
//                             type="date"
//                             value={advanceFilters.startDate}
//                             onChange={(e) =>
//                               setAdvanceFilters((prev) => ({
//                                 ...prev,

//                                 startDate: e.target.value,
//                               }))
//                             }
//                             className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
//                           />
//                         </div>

//                         {/* End Date */}

//                         <div>
//                           <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                             End Date
//                           </label>

//                           <input
//                             type="date"
//                             value={advanceFilters.endDate}
//                             onChange={(e) =>
//                               setAdvanceFilters((prev) => ({
//                                 ...prev,

//                                 endDate: e.target.value,
//                               }))
//                             }
//                             className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
//                           />
//                         </div>

//                         {/* AWB Number */}

//                         <div>
//                           <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                             AWB Number
//                           </label>

//                           <input
//                             type="text"
//                             value={advanceFilters.awb_number}
//                             onChange={(e) =>
//                               setAdvanceFilters((prev) => ({
//                                 ...prev,

//                                 awb_number: e.target.value,
//                               }))
//                             }
//                             placeholder="Enter AWB number"
//                             className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
//                           />
//                         </div>
//                       </div>

//                       {/* Footer */}

//                       <DrawerFooter className="border-t border-gray-200 bg-gray-50/70 px-5 py-4 dark:border-gray-800 dark:bg-gray-950/30">
//                         <div className="flex w-full gap-3">
//                           {/* Reset */}

//                           <Button
//                             type="button"
//                             variant="outline"
//                             onClick={() => {
//                               resetAdvanceFilters();

//                               setFilterUpdate((prev) => !prev);

//                               setIsFilterOpen(false);
//                             }}
//                             className="h-10 flex-1 cursor-pointer rounded-md"
//                           >
//                             Reset
//                           </Button>

//                           {/* Apply */}

//                           <Button
//                             type="submit"
//                             className="h-10 flex-1 cursor-pointer rounded-md bg-[#0446DB] text-white hover:bg-[#0339b5]"
//                           >
//                             Apply Filters
//                           </Button>
//                         </div>
//                       </DrawerFooter>
//                     </form>
//                   </DrawerContent>
//                 </Drawer>
//               </div>
//             </div>
//           </div>

//           <div className="mx-1 z-10 bg-white flex min-h-0 flex-1 flex-col overflow-hidden dark:bg-gray-800 rounded-md">
//             <div className="w-full shrink-0  dark:border dark:border-[#0446db]  dark:bg-gray-900 left-0 z-40   ">
//               <div className="relative flex justify-left ">
//                 <div className=" flex  overflow-x-auto scrollbar-hide scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ">
//                   <div className="flex gap-2 min-w-max mt-0">
//                     {filters.map((filter) => (
//                       <Button
//                         key={filter[0]}
//                         onClick={() => {
//                           setSelectedFilter(filter[1]);

//                           setPage(1);
//                         }}
//                         className={`px-5 py-2.5 rounded-sm my-2 border transition-all duration-300 font-medium text-sm tracking-wide ${
//                           selectedFilter === filter[1]
//                             ? "bg-[#0446db] hover:bg-[#0446DB] text-white shadow-lg shadow-purple-200 border-transparent"
//                             : "bg-white hover:bg-[#0446DB] hover:text-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]"
//                         }`}
//                       >
//                         {filter[0]}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Table */}

//             <div className="min-h-0 flex-1 overflow-auto bg-white dark:bg-gray-900 rounded-xl shadow">
//               <table className="min-w-full divide-y divide-gray-200 text-sm">
//                 <thead className="sticky top-0 z-20 bg-white dark:bg-gray-900 text-gray-600 font-semibold">
//                   <tr>
//                     <th className="px-6 py-3 text-left whitespace-nowrap">NDR ID</th>

//                     <th className="px-6 py-3 text-left">ORDER ID</th>

//                     <th className="px-6 py-3 text-left">CUSTOMER INFO</th>

//                     <th className="px-6 py-3 text-left">RIDER ID</th>

//                     <th className="px-6 py-3 text-left">REMARKS</th>

//                     <th className="px-6 py-3 text-left">ATTEMPT COUNT</th>

//                     <th className="px-6 py-3 text-left">STATUS</th>

//                     {selectedFilter === "actionable" && (
//                       <th className="px-6 py-3 text-left">ACTION</th>
//                     )}

//                     <th className="px-6 py-3 text-left">HISTORY</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {loading ? (
//                     <>
//                       <td colSpan="12" className="w-full text-center border px-6  text-gray-500">
//                         <div className="flex flex-col items-center justify-center py-10 text-gray-600">
//                           <Loader2 className="h-8 w-8 animate-spin mb-2" />

//                           <p className="text-sm font-medium">Loading...</p>
//                         </div>
//                       </td>
//                     </>
//                   ) : data.length > 0 ? (
//                     data.map((d) => {
//                       return (
//                         <tr key={d.ndr_id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
//                           {/* NDR ID */}

//                           <td className="px-6 py-4 dark:text-white">{d.ndr_id}</td>

//                           {/* Order ID */}

//                           <td className="px-6 py-4">
//                             <p className=" whitespace-normal">
//                               <a
//                                 href={`${frontEndURL}/track-order?awb_number=${d.awb_number}`}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="underline whitespace-nowrap text-blue-700 hover:text-blue-500"
//                               >
//                                 {d.awb_number}
//                               </a>

//                               <button
//                                 className="pl-2 text-lg text-gray-600 dark:text-white hover:text-[#0446db] transition"
//                                 onClick={() => {
//                                   navigator.clipboard.writeText(d.awb_number);

//                                   setCopySuccess(d.awb_number);

//                                   setTimeout(() => {
//                                     setCopySuccess(null);
//                                   }, 2000);
//                                 }}
//                               >
//                                 {copySuccess === d.awb_number ? <CiCircleCheck /> : <FaRegCopy />}
//                               </button>
//                             </p>

//                             <p className="text-l whitespace-nowrap dark:text-white text-gray-800 flex items-center">
//                               {d.merchant_order_id}

//                               <button
//                                 className="pl-2 text-lg text-gray-600 hover:text-[#0446db] transition"
//                                 onClick={() => {
//                                   navigator.clipboard.writeText(d.merchant_order_id);

//                                   setCopySuccess(d.merchant_order_id);

//                                   setTimeout(() => {
//                                     setCopySuccess(null);
//                                   }, 2000);
//                                 }}
//                               >
//                                 {copySuccess === d.merchant_order_id ? (
//                                   <CiCircleCheck />
//                                 ) : (
//                                   <FaRegCopy />
//                                 )}
//                               </button>
//                             </p>

//                             <p className="text-s text-gray-500 dark:text-white">
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

//                           {/* Customer Info */}

//                           <td className="px-6 py-4 whitespace-pre-line">
//                             <p className="font-medium whitespace-nowrap dark:text-white text-gray-800">
//                               {d.delivery_contact_name}
//                             </p>

//                             <div className="relative inline-block group">
//                               <span className="cursor-pointer whitespace-nowrap dark:text-white text-gray-800 font-medium">
//                                 {d.delivery_address_line.slice(0, 30)}....
//                               </span>

//                               <div
//                                 className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3

//                                           hidden group-hover:block"
//                               >
//                                 <div className="bg-[#0446db] dark:text-white text-white text-xs w-48 px-3 py-1 rounded shadow-lg ">
//                                   {d.delivery_address_line}
//                                 </div>

//                                 {/* Arrow */}

//                                 <div className="w-2 h-2 bg-[#0446db] rotate-45 mx-auto -mt-1"></div>
//                               </div>
//                             </div>

//                             <p className="text-xs text-gray-500 dark:text-white">
//                               {d.delivery_city}, {d.delivery_state} - {d.delivery_pincode}
//                             </p>

//                             <p className="text-xs text-gray-400">{d.delivery_country}</p>
//                           </td>

//                           {/* Remark/Reason */}

//                           <td className="px-6 py-4 dark:text-white">
//                             {d.vendor_id ? `FP${d.vendor_id}_${d.rider_id}` : `DKT_${d.rider_id}`}
//                           </td>

//                           {/* Remark/Reason */}

//                           <td className="px-6 py-4 dark:text-white">{d.reason || "NA"}</td>

//                           <td className="px-6 py-4">
//                             <span className="bg-green-100 text-green-800 text-md font-medium px-3 py-1 rounded-full hover:bg-yellow-200">
//                               {d.attempt_count || "NA"}
//                             </span>
//                           </td>

//                           {/* Status */}

//                           <td className="px-6 py-4 dark:text-white">
//                             {toCapitalizeEachWord(d.status) || "NA"}
//                           </td>

//                           {/* Action */}

//                           {selectedFilter === "actionable" && (
//                             <td className="px-6 py-4">
//                               {editingStatusId === d.ndr_id ? (
//                                 <form
//                                   onSubmit={async (e) => {
//                                     e.preventDefault();

//                                     const newStatus = (
//                                       e.currentTarget.elements.namedItem(
//                                         "status",
//                                       ) as HTMLSelectElement
//                                     ).value;

//                                     const newRemarks = (
//                                       e.currentTarget.elements.namedItem(
//                                         "remarks",
//                                       ) as HTMLInputElement
//                                     ).value;

//                                     changeStatus(d.ndr_id, newStatus, newRemarks);
//                                   }}
//                                   className="flex flex-col gap-2"
//                                 >
//                                   <div className="my-2">
//                                     <label className="mx-2">Remarks</label>

//                                     <input
//                                       type="text"
//                                       name="remarks"
//                                       className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//                                     />
//                                   </div>

//                                   <div className="flex items-center gap-2">
//                                     <select
//                                       name="status"
//                                       defaultValue=""
//                                       className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//                                       required
//                                     >
//                                       <option disabled value="">
//                                         Change Status
//                                       </option>

//                                       <option value="reattempt">Reattempt</option>

//                                       <option value="rto">RTO</option>
//                                     </select>

//                                     <button
//                                       type="submit"
//                                       className="bg-[#0446db] text-white text-xs px-3 py-1 rounded hover:bg-indigo-800 transition"
//                                     >
//                                       Update
//                                     </button>

//                                     <button
//                                       type="button"
//                                       onClick={() => setEditingStatusId(null)}
//                                       className="text-xs text-gray-500 hover:underline"
//                                     >
//                                       Close
//                                     </button>
//                                   </div>
//                                 </form>
//                               ) : (
//                                 <span
//                                   onClick={() => {
//                                     if (
//                                       !permissions.includes("NDR_ACTION") &&
//                                       !permissions.includes("ADMIN_FULL_ACCESS")
//                                     ) {
//                                       return;
//                                     }

//                                     if (d.tpc_awb_number !== null) {
//                                       return;
//                                     }

//                                     // setEditingStatusId(d.ndr_id)

//                                     setTakeAction(d.ndr_id);
//                                   }}
//                                   className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-semibold inline-block bg-blue-100 text-blue-600 cursor-pointer"
//                                 >
//                                   Take Action
//                                 </span>
//                               )}
//                             </td>
//                           )}

//                           <td>
//                             <button
//                               onClick={() => {
//                                 if (
//                                   !permissions.includes("NDR_HISTORY") &&
//                                   !permissions.includes("ADMIN_FULL_ACCESS")
//                                 ) {
//                                   return;
//                                 }

//                                 handleHistoryClick(d);
//                               }}
//                               className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full hover:bg-yellow-200"
//                             >
//                               History
//                             </button>
//                           </td>
//                         </tr>
//                       );
//                     })
//                   ) : (
//                     <tr key={"No record found"}>
//                       <td colSpan="6" className="text-center px-6 py-6 text-gray-500">
//                         No records found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}

//             <div className="shrink-0 border-t border-gray-200 bg-white py-3 flex justify-center items-center gap-4 dark:border-gray-800 dark:bg-gray-900">
//               <Button
//                 onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//                 disabled={page === 1}
//                 className={`px-4 py-2 rounded-md text-sm font-medium ${
//                   page === 1
//                     ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                     : "bg-[#0446db] text-white hover:bg-indigo-800"
//                 }`}
//               >
//                 Previous
//               </Button>

//               <span className="text-gray-700">
//                 Page {page} of {totalPages}
//               </span>

//               <Button
//                 onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
//                 disabled={page === totalPages}
//                 className={`px-4 py-2 rounded-md text-sm font-medium ${
//                   page === totalPages
//                     ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                     : "bg-[#0446db] text-white hover:bg-indigo-800"
//                 }`}
//               >
//                 Next
//               </Button>
//             </div>
//           </div>

//           {/* Modal */}

//           {/* ================= NDR HISTORY DIALOG ================= */}

//           <AlertDialog
//             open={!!historyItem}
//             onOpenChange={(open) => {
//               if (!open) {
//                 setHistoryItem(null);
//               }
//             }}
//           >
//             <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-xl border border-neutral-200 bg-white p-0 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
//               {/* ================= HEADER ================= */}

//               <AlertDialogHeader className="border-b border-neutral-200 bg-neutral-50/50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900">
//                 <div className="flex items-start gap-3">
//                   <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
//                     <TbFileInfo className="h-5 w-5" />
//                   </div>

//                   <div className="min-w-0">
//                     <AlertDialogTitle className="text-lg font-semibold text-neutral-900 dark:text-white">
//                       NDR History
//                     </AlertDialogTitle>

//                     <AlertDialogDescription className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
//                       Track all actions and updates performed on this NDR.
//                     </AlertDialogDescription>
//                   </div>
//                 </div>
//               </AlertDialogHeader>

//               {/* ================= BODY ================= */}

//               <div className="max-h-[65vh] overflow-y-auto px-5 py-5">
//                 {Array.isArray(historyItem) && historyItem.length > 0 ? (
//                   <div className="space-y-4">
//                     {historyItem.map((item, index) => {
//                       // null / "null" / undefined / "undefined" / empty ko hide karega

//                       const hasValue = (value: unknown) => {
//                         if (value === null || value === undefined) {
//                           return false;
//                         }

//                         const normalizedValue = String(value)
//                           .trim()

//                           .toLowerCase();

//                         return (
//                           normalizedValue !== "" &&
//                           normalizedValue !== "null" &&
//                           normalizedValue !== "undefined"
//                         );
//                       };

//                       // Action Name

//                       const actionTitle =
//                         item?.action_taken === "change_address"
//                           ? "Change Address"
//                           : item?.action_taken === "change_phone"
//                             ? "Change Phone Number"
//                             : item?.action_taken === "reattempt"
//                               ? "Reattempt"
//                               : item?.action_taken === "rto"
//                                 ? "RTO"
//                                 : item?.action_taken === "marked_as_ndr"
//                                   ? "Marked as NDR"
//                                   : item?.action_taken;

//                       return (
//                         <div
//                           key={item?.action_id || index}
//                           className="overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all duration-200 hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
//                         >
//                           {/* ================= ACTION HEADER ================= */}

//                           <div className="flex flex-col gap-3 border-b border-neutral-100 bg-neutral-50/60 px-4 py-3.5 dark:border-neutral-800 dark:bg-neutral-800/30 sm:flex-row sm:items-center sm:justify-between">
//                             {/* Action */}

//                             <div className="flex min-w-0 items-center gap-3">
//                               <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0446DB] text-xs font-semibold text-white shadow-sm">
//                                 {index + 1}
//                               </div>

//                               {hasValue(actionTitle) && (
//                                 <div className="min-w-0">
//                                   <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
//                                     Action
//                                   </p>

//                                   <h3 className="mt-0.5 truncate text-sm font-semibold text-neutral-900 dark:text-white">
//                                     {actionTitle}
//                                   </h3>
//                                 </div>
//                               )}
//                             </div>

//                             {/* Date / Time */}

//                             {hasValue(item?.created_at) && (
//                               <div className="pl-12 sm:pl-0 sm:text-right">
//                                 <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
//                                   Date / Time
//                                 </p>

//                                 <p className="mt-0.5 whitespace-nowrap text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                                   {new Date(item.created_at).toLocaleString("en-IN", {
//                                     timeZone: "Asia/Kolkata",

//                                     day: "2-digit",

//                                     month: "2-digit",

//                                     year: "numeric",

//                                     hour: "2-digit",

//                                     minute: "2-digit",

//                                     hour12: true,
//                                   })}
//                                 </p>
//                               </div>
//                             )}
//                           </div>

//                           {/* ================= DETAILS ================= */}

//                           <div className="p-4">
//                             <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                               {/* ================= CHANGE PHONE ================= */}

//                               {item?.action_taken === "change_phone" &&
//                                 hasValue(item?.customer_phone) && (
//                                   <div className="rounded-lg border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/30 sm:col-span-2">
//                                     <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
//                                       Phone Number
//                                     </p>

//                                     <p className="mt-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                       {item.customer_phone}
//                                     </p>
//                                   </div>
//                                 )}

//                               {/* ================= CHANGE ADDRESS - NAME ================= */}

//                               {item?.action_taken === "change_address" &&
//                                 hasValue(item?.customer_name) && (
//                                   <div className="rounded-lg border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/30">
//                                     <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
//                                       Customer Name
//                                     </p>

//                                     <p className="mt-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                       {item.customer_name}
//                                     </p>
//                                   </div>
//                                 )}

//                               {/* ================= CHANGE ADDRESS - ADDRESS ================= */}

//                               {item?.action_taken === "change_address" &&
//                                 hasValue(item?.customer_details_address) && (
//                                   <div className="rounded-lg border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/30 sm:col-span-2">
//                                     <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
//                                       Address
//                                     </p>

//                                     <p className="mt-1.5 break-words text-sm leading-6 text-neutral-700 dark:text-neutral-300">
//                                       {item.customer_details_address}
//                                     </p>
//                                   </div>
//                                 )}

//                               {/* ================= REMARKS ================= */}

//                               {item?.action_taken !== "change_phone" &&
//                                 item?.action_taken !== "change_address" &&
//                                 hasValue(item?.remarks) && (
//                                   <div className="rounded-lg border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/30 sm:col-span-2">
//                                     <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
//                                       Remarks
//                                     </p>

//                                     <p className="mt-1.5 break-words text-sm leading-6 text-neutral-800 dark:text-neutral-200">
//                                       {item.remarks}
//                                     </p>
//                                   </div>
//                                 )}

//                               {/* ================= SUB REMARKS ================= */}

//                               {hasValue(item?.sub_remarks) && (
//                                 <div className="rounded-lg border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/30">
//                                   <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
//                                     Sub Remarks
//                                   </p>

//                                   <p className="mt-1.5 break-words text-sm leading-6 text-neutral-800 dark:text-neutral-200">
//                                     {item.sub_remarks}
//                                   </p>
//                                 </div>
//                               )}

//                               {/* ================= RESCHEDULED DATE ================= */}

//                               {hasValue(item?.rescheduled_date) && (
//                                 <div className="rounded-lg border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/30">
//                                   <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
//                                     Rescheduled Date
//                                   </p>

//                                   <p className="mt-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                     {item.rescheduled_date}
//                                   </p>
//                                 </div>
//                               )}

//                               {/* ================= OTHER REMARKS ================= */}

//                               {hasValue(item?.detailed_remarks) && (
//                                 <div className="rounded-lg border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/30 sm:col-span-2">
//                                   <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
//                                     Other Remarks
//                                   </p>

//                                   <p className="mt-1.5 break-words text-sm leading-6 text-neutral-800 dark:text-neutral-200">
//                                     {item.detailed_remarks}
//                                   </p>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   /* ================= EMPTY STATE ================= */

//                   <div className="flex min-h-[250px] items-center justify-center">
//                     <div className="max-w-xs text-center">
//                       <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
//                         <TbFileInfo className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
//                       </div>

//                       <h3 className="mt-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
//                         No history found
//                       </h3>

//                       <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
//                         No NDR action history is available for this order.
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* ================= FOOTER ================= */}

//               <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-950/30">
//                 <AlertDialogCancel
//                   onClick={() => setHistoryItem(null)}
//                   className=" cursor-pointer rounded-md border-neutral-200 px-5 my-1 font-medium dark:border-neutral-700"
//                 >
//                   Close
//                 </AlertDialogCancel>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>

//           {takeAction && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(46,46,46,0.5)] px-3 sm:px-0">
//               <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden">
//                 {/* Modal Header */}

//                 <div className="bg-[#0446db] px-4 sm:px-6 py-3 sm:py-4">
//                   <h2 className="text-lg sm:text-xl font-semibold text-white">Take Action</h2>
//                 </div>

//                 {/* Modal Body */}

//                 <div className="px-4 sm:px-6 py-4 overflow-y-auto max-h-[60vh]">
//                   <form
//                     onSubmit={async (e) => {
//                       e.preventDefault();

//                       const rot_remarks =
//                         (
//                           e.currentTarget.elements.namedItem("rot_remarks") as
//                             | HTMLInputElement
//                             | HTMLSelectElement
//                             | null
//                         )?.value || "";

//                       const newStatus =
//                         (
//                           e.currentTarget.elements.namedItem("status") as
//                             | HTMLInputElement
//                             | HTMLSelectElement
//                             | null
//                         )?.value || "";

//                       const newRemarks = rot_remarks
//                         ? rot_remarks
//                         : (
//                             e.currentTarget.elements.namedItem("remarks") as
//                               | HTMLInputElement
//                               | HTMLSelectElement
//                               | null
//                           )?.value || "";

//                       const other_remarks =
//                         (
//                           e.currentTarget.elements.namedItem("other_remarks") as
//                             | HTMLInputElement
//                             | HTMLSelectElement
//                             | null
//                         )?.value || "";

//                       const sub_remarks =
//                         (
//                           e.currentTarget.elements.namedItem("sub_remarks") as
//                             | HTMLInputElement
//                             | HTMLSelectElement
//                             | null
//                         )?.value || "";

//                       const phone =
//                         (
//                           e.currentTarget.elements.namedItem("phone") as
//                             | HTMLInputElement
//                             | HTMLSelectElement
//                             | null
//                         )?.value || "";

//                       const name =
//                         (
//                           e.currentTarget.elements.namedItem("name") as
//                             | HTMLInputElement
//                             | HTMLSelectElement
//                             | null
//                         )?.value || "";

//                       const address1 =
//                         (
//                           e.currentTarget.elements.namedItem("address1") as
//                             | HTMLInputElement
//                             | HTMLSelectElement
//                             | null
//                         )?.value || "";

//                       // const address2 = e?.target?.elements?.address2?.value || "";

//                       const data = {
//                         action: newStatus,

//                         remarks: newRemarks,

//                         detailed_remarks: other_remarks,

//                         sub_remarks: sub_remarks,

//                         customer_name: name,

//                         customer_details_address: address1,

//                         customer_phone: phone,
//                       };

//                       changeStatus(data, takeAction);
//                     }}
//                     className="flex flex-col gap-1"
//                   >
//                     {/* Status */}

//                     <div>
//                       <label className="text-xs font-medium dark:text-white">Select</label>

//                       <select
//                         name="status"
//                         defaultValue=""
//                         onChange={(e) => {
//                           setNewStatus(e.target.value);

//                           setRTORemarksStatus(" ");
//                         }}
//                         className="mt-0 text-xs w-full border border-gray-300 rounded-md

//                        px-2 py-2 mb-0 focus:ring-2 dark:text-white dark:bg-gray-800 focus:ring-indigo-400 focus:outline-none"
//                         required
//                       >
//                         <option disabled value="">
//                           Change Status
//                         </option>

//                         <option value="change_address">Change Address</option>

//                         <option value="change_phone">Change Phone Number</option>

//                         <option value="reattempt">Reattempt</option>

//                         <option value="rto">RTO</option>
//                       </select>
//                     </div>

//                     {/* change phone number */}

//                     {newStatus === "change_phone" && (
//                       <div>
//                         <label className="text-xs font-medium dark:text-white">Phone Number</label>

//                         <input
//                           type="phone"
//                           name="phone"
//                           className="

//                               mt-0 text-xs w-full

//                               border border-gray-300

//                               bg-white text-black

//                               rounded-md px-2 py-2

//                               focus:outline-none focus:ring-2 focus:ring-indigo-400

//                               dark:bg-gray-900 dark:border-gray-700 dark:text-white

//                               dark:focus:ring-indigo-500

//                             "
//                         />
//                       </div>
//                     )}

//                     {newStatus === "change_address" && (
//                       <>
//                         <div>
//                           <label className="text-xs font-medium dark:text-white">
//                             Customer Name
//                           </label>

//                           <input
//                             type="name"
//                             name="name"
//                             className="

//                                 mt-0 text-xs w-full

//                                 border border-gray-300

//                                 bg-white text-black

//                                 rounded-md px-2 py-2

//                                 focus:outline-none focus:ring-2 focus:ring-indigo-400

//                                 dark:bg-gray-900 dark:border-gray-700 dark:text-white

//                                 dark:focus:ring-indigo-500

//                               "
//                           />
//                         </div>

//                         <div>
//                           <label className="text-xs font-medium dark:text-white">
//                             Customer Address
//                           </label>

//                           <input
//                             type="address1"
//                             name="address1"
//                             className="

//   mt-0 text-xs w-full

//   border border-gray-300

//   bg-white text-black

//   rounded-md px-2 py-2

//   focus:outline-none focus:ring-2 focus:ring-indigo-400

//   dark:bg-gray-900 dark:border-gray-700 dark:text-white

//   dark:focus:ring-indigo-500

// "
//                           />
//                         </div>
//                       </>
//                     )}

//                     {newStatus == "rto" && (
//                       <>
//                         <div>
//                           <label className="text-xs font-medium dark:text-white">
//                             Select Remarks
//                           </label>

//                           <select
//                             name="rot_remarks"
//                             defaultValue=""
//                             onChange={(e) => setRTORemarksStatus(e.target.value)}
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

//                             <option value="Wrong Pincode / Address">Wrong Pincode / Address</option>

//                             <option value="Wrong Contact Details">Wrong Contact Details</option>

//                             <option value="Package Damaged">Package Damaged</option>

//                             <option value="RTO by Seller">RTO by Seller</option>

//                             <option value="Return to Hub">Return to Hub</option>

//                             <option value="Return to Seller / FC">Return to Seller / FC</option>

//                             <option value="Max. Attempts Reached">Max. Attempts Reached</option>
//                           </select>
//                         </div>
//                       </>
//                     )}

//                     {newRTORemarkStatus === "Customer Refused / Cancelled" && (
//                       <>
//                         <div>
//                           <label className="text-xs font-medium dark:text-white">Sub Remarks</label>

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

//                             <option value="Duplicate Order">Duplicate Order</option>

//                             <option value="Order Placed by Mistake">Order Placed by Mistake</option>

//                             <option value="COD Amount Not Ready">COD Amount Not Ready</option>

//                             <option value="Better Price Elsewhere">Better Price Elsewhere</option>

//                             <option value="Other">Other</option>
//                           </select>
//                         </div>
//                       </>
//                     )}

//                     <div>
//                       <label className="text-xs font-medium dark:text-white">Other Remarks</label>

//                       <input
//                         type="text"
//                         name="other_remarks"
//                         className="

//                                mt-0 text-xs w-full

//                               border border-gray-300

//                                bg-white text-black

//                                 rounded-md px-2 py-2

//                                  focus:outline-none focus:ring-2 focus:ring-indigo-400

//                                    dark:bg-gray-900 dark:border-gray-700 dark:text-white

//                                  dark:focus:ring-indigo-500

//                                "
//                       />
//                     </div>

//                     {/* Submit */}

//                     <div className=" flex gap-1 justify-end">
//                       <button
//                         type="submit"
//                         className="w-full sm:w-auto bg-[#0446db] text-white

//                      text-xs px-4 py-2 rounded

//                      hover:bg-indigo-800 transition cursor-pointer"
//                       >
//                         Update
//                       </button>

//                       <button
//                         onClick={() => {
//                           setTakeAction(null);

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

// export default UserNDR;

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Filter,
  History,
  Loader2,
  Search,
  X,
} from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL || "";
const frontendURL = import.meta.env.VITE_FRONTEND_URL || "";
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token") || ""}` });
const statusTabs = [
  { label: "All", value: "" },
  { label: "Action Required", value: "actionable" },
  { label: "Action Taken", value: "actiontaken" },
  { label: "RTO", value: "rto" },
  { label: "Delivered", value: "delivered" },
];
const rtoReasons = [
  "Address Incorrect / Incomplete",
  "Customer Refused / Cancelled",
  "Customer wants open delivery",
  "Wrong Pincode / Address",
  "Wrong Contact Details",
  "Package Damaged",
  "RTO by Seller",
  "Return to Hub",
  "Return to Seller / FC",
  "Max. Attempts Reached",
];
const reattemptReasons = [
  "Customer Requested Reschedule",
  "Customer wants open delivery",
];
const refusalReasons = [
  "Duplicate Order",
  "Order Placed by Mistake",
  "Deliver to a different address",
  "COD Amount Not Ready",
  "Better Price Elsewhere",
  "Other",
];
const emptyFilters = { startDate: "", endDate: "", awb_number: "" };
type Filters = typeof emptyFilters;
type Ndr = {
  ndr_id: number | string;
  awb_number?: string;
  merchant_order_id?: string;
  created_at?: string;
  delivery_contact_name?: string;
  delivery_address_line?: string;
  delivery_city?: string;
  delivery_state?: string;
  delivery_pincode?: string;
  delivery_country?: string;
  vendor_id?: number | null;
  rider_id?: number | null;
  reason?: string;
  attempt_count?: number;
  status?: string;
  tpc_awb_number?: string | null;
};
type NdrHistory = Record<string, unknown>;
type ActionType = "" | "reattempt" | "rto" | "change_address" | "change_phone";
type ActionForm = {
  action: ActionType;
  remarks: string;
  detailed_remarks: string;
  sub_remarks: string;
  customer_name: string;
  customer_details_address: string;
  customer_phone: string;
};
const emptyAction: ActionForm = {
  action: "",
  remarks: "",
  detailed_remarks: "",
  sub_remarks: "",
  customer_name: "",
  customer_details_address: "",
  customer_phone: "",
};
const errText = (e: unknown) =>
  axios.isAxiosError(e)
    ? e.response?.data?.message || e.message
    : e instanceof Error
      ? e.message
      : "Request failed";
const fmtDate = (v: unknown) => {
  if (!v) return "—";
  const d = new Date(String(v));
  return Number.isNaN(d.getTime())
    ? String(v)
    : d.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};
const titleCase = (s: string) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const pretty = (v: unknown) =>
  v === null || v === undefined || v === "" || v === "null" || v === "undefined" ? "—" : String(v);
const inputClass =
  "h-10 w-full rounded-l-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white";

function ActionFields({
  value,
  onChange,
  bulk = false,
}: {
  value: ActionForm;
  onChange: (v: ActionForm) => void;
  bulk?: boolean;
}) {
  const change = (key: keyof ActionForm, newValue: string) =>
    onChange({ ...value, [key]: newValue });
  return (
    <div className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Action</span>
        <select
          required
          className={inputClass}
          value={value.action}
          onChange={(e) => onChange({ ...emptyAction, action: e.target.value as ActionType })}
        >
          <option value="">Select action</option>
          {!bulk && (
            <>
              <option value="change_address">Change Address</option>
              <option value="change_phone">Change Phone Number</option>
            </>
          )}
          <option value="reattempt">Reattempt</option>
          <option value="rto">RTO</option>
        </select>
      </label>
      {value.action === "change_phone" && (
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Customer phone number</span>
          <input
            required
            className={inputClass}
            type="tel"
            value={value.customer_phone}
            onChange={(e) => change("customer_phone", e.target.value)}
          />
        </label>
      )}
      {value.action === "change_address" && (
        <>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Customer name</span>
            <input
              required
              className={inputClass}
              value={value.customer_name}
              onChange={(e) => change("customer_name", e.target.value)}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Customer address</span>
            <textarea
              required
              rows={3}
              className={`${inputClass} h-auto py-2`}
              value={value.customer_details_address}
              onChange={(e) => change("customer_details_address", e.target.value)}
            />
          </label>
        </>
      )}
      {value.action === "rto" && (
        <>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">RTO Reason</span>
            <select
              required
              className={inputClass}
              value={value.remarks}
              onChange={(e) => onChange({ ...value, remarks: e.target.value, sub_remarks: "" })}
            >
              <option value="">Select reason</option>
              {rtoReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          {value.remarks === "Customer Refused / Cancelled" && (
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Sub Remarks</span>
              <select
                required
                className={inputClass}
                value={value.sub_remarks}
                onChange={(e) => change("sub_remarks", e.target.value)}
              >
                <option value="">Select sub remarks</option>
                {refusalReasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
          )}
        </>
      )}

      
       
       {value.action=='reattempt' && (
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Remarks</span>
              <select
               
                className={inputClass}
                value={value.remarks}
                onChange={(e) => change("remarks", e.target.value)}
              >
                <option value="">Select sub remarks</option>
                {reattemptReasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
          )}
       { value.remarks=='Customer Requested Reschedule' && (
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Sub Remarks</span>
              <select
                
                className={inputClass}
                value={value.sub_remarks}
                onChange={(e) => change("sub_remarks", e.target.value)}
              >
                <option value="">Select sub remarks</option>
                
                  <option  value={'Deliver to a different address'}>
                   Deliver to a different address
                  </option>
                
              </select>
            </label>
          )}

      {value.action && (
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Other Remarks (optional)</span>
          <textarea
            rows={3}
            className={`${inputClass} h-auto py-2`}
            value={value.detailed_remarks}
            onChange={(e) => change("detailed_remarks", e.target.value)}
            placeholder="Additional notes"
          />
        </label>
      )}
    </div>
  );
}

export default function UserNDR() {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [permLoading, setPermLoading] = useState(true);
  const [data, setData] = useState<Ndr[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [filters, setFilters] = useState<Filters>({ ...emptyFilters });
  const [draftFilters, setDraftFilters] = useState<Filters>({ ...emptyFilters });
  const [searchInput, setSearchInput] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ done: 0, total: 0 });
  const [bulkForm, setBulkForm] = useState<ActionForm>({ ...emptyAction });
  const [singleItem, setSingleItem] = useState<Ndr | null>(null);
  const [singleForm, setSingleForm] = useState<ActionForm>({ ...emptyAction });
  const [singleSaving, setSingleSaving] = useState(false);
  const [historyItem, setHistoryItem] = useState<NdrHistory[] | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const requestRef = useRef(0);

  const can = (code: string) =>
    permissions.includes(code) || permissions.includes("ADMIN_FULL_ACCESS");
  const canAction = can("NDR_ACTION");
  const canHistory = can("NDR_HISTORY");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await axios.get(`${baseURL}/api/user/getUserPermissions`, {
          headers: authHeaders(),
        });
        const p = r.data?.data?.data;
        if (!Array.isArray(p)) throw new Error("Invalid permissions response");
        if (!alive) return;
        setPermissions(p);
        if (!p.includes("NDR_VIEW") && !p.includes("ADMIN_FULL_ACCESS") && !p.includes("ODR_VIEW"))
          navigate("/unauthorized", { replace: true });
      } catch (e) {
        if (alive) toast.error(`Could not check permissions: ${errText(e)}`);
      } finally {
        if (alive) setPermLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [navigate]);

  const fetchData = useCallback(async () => {
    const request = ++requestRef.current;
    setLoading(true);
    try {
      const r = await axios.get(`${baseURL}/api/user/getNDRs`, {
        headers: authHeaders(),
        params: {
          page,
          limit,
          start_date: filters.startDate,
          end_date: filters.endDate,
          awb_number: filters.awb_number,
          statusType: selectedFilter,
        },
      });
      if (request !== requestRef.current) return;
      if (r.data?.success === false) throw new Error(r.data?.message || "Failed to load NDRs");
      setData(Array.isArray(r.data?.data) ? r.data.data : []);
      setTotal(Number(r.data?.pagination?.total) || 0);
    } catch (e) {
      if (request === requestRef.current) {
        setData([]);
        setTotal(0);
        toast.error(errText(e));
      }
    } finally {
      if (request === requestRef.current) setLoading(false);
    }
  }, [page, limit, filters, selectedFilter]);

  useEffect(() => {
    if (!permLoading && (can("NDR_VIEW") || can("ODR_VIEW"))) void fetchData();
  }, [permLoading, permissions, fetchData]);
  useEffect(() => {
    setSelected([]);
  }, [page, limit, selectedFilter, filters]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const eligible = useMemo(
    () => (selectedFilter === "actionable" ? data.filter((d) => d.tpc_awb_number == null) : []),
    [data, selectedFilter],
  );
  const eligibleIds = useMemo(() => eligible.map((d) => String(d.ndr_id)), [eligible]);
  const selectedOnPage = selected.filter((id) => eligibleIds.includes(id));
  const allSelected =
    eligibleIds.length > 0 && eligibleIds.every((id) => selectedOnPage.includes(id));
  const someSelected = selectedOnPage.length > 0 && !allSelected;
  const toggleRow = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleAll = () =>
    setSelected((prev) =>
      allSelected
        ? prev.filter((id) => !eligibleIds.includes(id))
        : [...new Set([...prev, ...eligibleIds])],
    );
  const validateAction = (form: ActionForm, bulk: boolean) => {
    if (!form.action) return "Select an action";
    if (bulk && !["reattempt", "rto"].includes(form.action)) return "Invalid bulk action";
    if (form.action === "rto" && !form.remarks.trim()) return "Select RTO remarks";
    if (
      form.action === "rto" &&
      form.remarks === "Customer Refused / Cancelled" &&
      !form.sub_remarks
    )
      return "Select sub remarks";
    if (form.action === "change_phone" && !form.customer_phone.trim())
      return "Enter customer phone";
    if (
      form.action === "change_address" &&
      (!form.customer_name.trim() || !form.customer_details_address.trim())
    )
      return "Enter customer name and address";
    return "";
  };
  const postNdrAction = async (id: string, payload: ActionForm) => {
    const r = await axios.post(
      `${baseURL}/api/user/handlendrs/${encodeURIComponent(id)}`,
      payload,
      { headers: authHeaders() },
    );
    if (r.data?.success === false) throw new Error(r.data?.message || `Failed for NDR ${id}`);
  };
  const handleSingle = async (e: FormEvent) => {
    e.preventDefault();
    if (!singleItem || !canAction || singleSaving) return;
    const error = validateAction(singleForm, false);
    if (error) return toast.error(error);
    setSingleSaving(true);
    try {
      
      await postNdrAction(String(singleItem.ndr_id), singleForm);
      toast.success("NDR action updated");
      setSingleItem(null);
      setSingleForm({ ...emptyAction });
      await fetchData();
    } catch (e) {
      toast.error(errText(e));
    } finally {
      setSingleSaving(false);
    }
  };
  const handleBulk = async (e: FormEvent) => {
    e.preventDefault();
    if (!canAction || bulkLoading) return;
    const error = validateAction(bulkForm, true);
    if (error) return toast.error(error);
    const ids = selectedOnPage;
    if (!ids.length) return toast.error("Select at least one eligible NDR");
    setBulkLoading(true);
    setBulkProgress({ done: 0, total: ids.length });
    const failures: string[] = [];
    let successes = 0;
    try {
      for (let i = 0; i < ids.length; i++) {
        try {
          await postNdrAction(ids[i], bulkForm);
          successes++;
        } catch (e) {
          failures.push(ids[i]);
          console.error(`Bulk NDR ${ids[i]} failed:`, e);
        }
        setBulkProgress({ done: i + 1, total: ids.length });
      }
      if (successes) toast.success(`${successes} NDR(s) updated`);
      if (failures.length)
        toast.error(`${failures.length} NDR(s) failed. They remain selected for retry.`);
      setSelected(failures);
      setBulkOpen(false);
      setBulkForm({ ...emptyAction });
      await fetchData();
    } finally {
      setBulkLoading(false);
    }
  };
  const loadHistory = async (ndr: Ndr) => {
    if (!canHistory) return;
    setHistoryLoading(true);
    try {
      const r = await axios.get(`${baseURL}/api/user/getNDRHistory/${ndr.ndr_id}`, {
        headers: authHeaders(),
      });
      setHistoryItem(Array.isArray(r.data?.data) ? r.data.data : []);
    } catch (e) {
      toast.error(errText(e));
    } finally {
      setHistoryLoading(false);
    }
  };
  const exportCSV = async () => {
    if (!can("NDR_EXPORT") || exporting) return;
    setExporting(true);
    try {
      const r = await axios.get(`${baseURL}/api/user/exportNDRs`, {
        headers: authHeaders(),
        responseType: "blob",
        params: {
          statusType: selectedFilter,
          awb_number: filters.awb_number,
          start_date: filters.startDate,
          end_date: filters.endDate,
        },
      });
      const url = URL.createObjectURL(r.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ndr.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      toast.error(errText(e));
    } finally {
      setExporting(false);
    }
  };
  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopySuccess(value);
      setTimeout(() => setCopySuccess(""), 1500);
    } catch {
      toast.error("Cannot copy value");
    }
  };
  const applyFilters = (e: FormEvent) => {
    e.preventDefault();
    if (
      draftFilters.startDate &&
      draftFilters.endDate &&
      draftFilters.startDate > draftFilters.endDate
    )
      return toast.error("Start date cannot be after end date");
    setFilters({ ...draftFilters });
    setSearchInput(draftFilters.awb_number);
    setPage(1);
    setFilterOpen(false);
  };

  if (permLoading)
    return (
      <div className="flex h-[80vh] items-center justify-center gap-2">
        <Loader2 className="animate-spin text-[#0446DB]" /> Checking permissions...
      </div>
    );
  return (
    <div className="flex h-[calc(100dvh-80px)] min-h-0 w-full flex-col overflow-hidden bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="shrink-0 space-y-3 border-b border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">NDR Management</h1>
            <p className="mt-1 text-xs text-gray-500">
              Review delivery exceptions and manage follow-up actions
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {can("NDR_EXPORT") && (
              <Button disabled={exporting} variant="outline" onClick={exportCSV}>
                <Download className="mr-2 h-4 w-4" />
                {exporting ? "Exporting..." : "Export CSV"}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                setDraftFilters({ ...filters });
                setFilterOpen(true);
              }}
            >
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>
        </div>
        <form
          className="flex max-w-lg"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setFilters((prev) => ({ ...prev, awb_number: searchInput.trim() }));
          }}
        >
          <input
            aria-label="Search AWB"
            className={inputClass}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by AWB number..."
          />
          <Button type="submit" className="bg-[#0446DB] h-10  rounded-r-sm m-0   hover:bg-blue-800">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statusTabs.map((t) => (
            <Button
              key={t.value}
              size="sm"
              variant={selectedFilter === t.value ? "default" : "outline"}
              onClick={() => {
                setSelectedFilter(t.value);
                setPage(1);
              }}
              className={
                selectedFilter === t.value
                  ? "shrink-0 bg-[#0446DB] text-white hover:bg-blue-800"
                  : "shrink-0"
              }
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>
      {selectedFilter === "actionable" && canAction && selectedOnPage.length > 0 && (
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-blue-100 bg-blue-50 px-4 py-3 dark:border-blue-900 dark:bg-blue-950/30">
          <div className="flex items-center gap-3">
            <span className="rounded bg-[#0446DB] px-2.5 py-1 text-xs font-semibold text-white">
              {selectedOnPage.length} selected
            </span>
            <button
              className="text-xs text-gray-600 hover:underline"
              onClick={() => setSelected([])}
            >
              Clear selection
            </button>
          </div>
          <Button
            disabled={loading || bulkLoading}
            onClick={() => {
              setBulkForm({ ...emptyAction });
              setBulkOpen(true);
            }}
            className="bg-[#0446DB] text-white hover:bg-blue-800"
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Bulk Take Action
          </Button>
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-auto bg-white dark:bg-gray-900">
        <table className="w-full min-w-[1180px] border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 z-20 bg-gray-50 text-left text-xs uppercase text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <tr>
              {selectedFilter === "actionable" && canAction && (
                <th className="px-4 py-3">
                  <Checkbox
                    aria-label="Select all eligible NDRs on this page"
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    disabled={loading || !eligibleIds.length || bulkLoading}
                    onCheckedChange={toggleAll}
                  />
                </th>
              )}
              {[
                "NDR ID",
                "Order / AWB",
                "Customer info",
                "Rider",
                "Reason",
                "Attempts",
                "Status",
                ...(selectedFilter === "actionable" ? ["Action"] : []),
                "History",
              ].map((c) => (
                <th
                  key={c}
                  className="whitespace-nowrap border-b border-gray-200 px-4 py-3 font-semibold dark:border-gray-700"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={11} className="py-20 text-center">
                  <Loader2 className="mx-auto animate-spin text-[#0446DB]" />
                  Loading NDRs...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-20 text-center text-gray-500">
                  No NDR records found
                </td>
              </tr>
            ) : (
              data.map((d) => {
                const id = String(d.ndr_id);
                const selectable = d.tpc_awb_number == null;
                return (
                  <tr key={id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    {selectedFilter === "actionable" && canAction && (
                      <td className="px-4 py-3">
                        <Checkbox
                          aria-label={`Select NDR ${id}`}
                          checked={selected.includes(id)}
                          disabled={!selectable || loading || bulkLoading}
                          onCheckedChange={() => toggleRow(id)}
                        />
                      </td>
                    )}
                    <td className="border-b px-4 py-3 font-medium dark:border-gray-800">{id}</td>
                    <td className="border-b px-4 py-3 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <a
                          className="font-medium text-[#0446DB] hover:underline"
                          href={`${frontendURL}/track-order?awb_number=${encodeURIComponent(d.awb_number || "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {pretty(d.awb_number)}
                        </a>
                        <button
                          type="button"
                          onClick={() => copy(d.awb_number || "")}
                          aria-label="Copy AWB"
                        >
                          {copySuccess === d.awb_number ? (
                            <CheckCheck size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {pretty(d.merchant_order_id)}
                      </div>
                      <div className="text-xs text-gray-400">{fmtDate(d.created_at)}</div>
                    </td>
                    <td className="max-w-[260px] border-b px-4 py-3 dark:border-gray-800">
                      <div className="font-medium">{pretty(d.delivery_contact_name)}</div>
                      <div
                        title={d.delivery_address_line || ""}
                        className="max-w-[260px] truncate text-xs text-gray-500"
                      >
                        {pretty(d.delivery_address_line)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {[d.delivery_city, d.delivery_state, d.delivery_pincode]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-3 dark:border-gray-800">
                      {d.vendor_id
                        ? `FP${d.vendor_id}_${d.rider_id ?? ""}`
                        : `DKT_${d.rider_id ?? ""}`}
                    </td>
                    <td className="max-w-[220px] border-b px-4 py-3 dark:border-gray-800">
                      {pretty(d.reason)}
                    </td>
                    <td className="border-b px-4 py-3 dark:border-gray-800">
                      {d.attempt_count ?? "—"}
                    </td>
                    <td className="border-b px-4 py-3 dark:border-gray-800">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {titleCase(d.status || "Unknown")}
                      </span>
                    </td>
                    {selectedFilter === "actionable" && (
                      <td className="border-b px-4 py-3 dark:border-gray-800">
                        {canAction ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={!selectable || bulkLoading}
                            onClick={() => {
                              setSingleItem(d);
                              setSingleForm({ ...emptyAction });
                            }}
                          >
                            Take Action
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-400">No access</span>
                        )}
                      </td>
                    )}
                    <td className="border-b px-4 py-3 dark:border-gray-800">
                      {canHistory ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={historyLoading}
                          onClick={() => void loadHistory(d)}
                        >
                          <History className="mr-1.5 h-4 w-4" />
                          History
                        </Button>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3 text-xs dark:border-gray-800 dark:bg-gray-900">
        <span>
          {total ? `${(page - 1) * limit + 1}–${Math.min(page * limit, total)} of ${total}` : "0"}{" "}
          NDR records
        </span>
        <div className="flex items-center gap-2">
          <span>Rows</span>
          <select
            className="rounded border px-2 py-1 dark:bg-gray-800"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            {[20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft size={14} />
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      <Drawer direction="right" open={filterOpen} onOpenChange={setFilterOpen}>
        <DrawerContent className="h-full w-full rounded-none bg-white sm:max-w-md dark:bg-gray-900">
          <DrawerHeader className="border-b">
            <div className="flex justify-between">
              <DrawerTitle>Advanced Filters</DrawerTitle>
              <DrawerClose asChild>
                <button aria-label="Close filters">
                  <X size={18} />
                </button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <form onSubmit={applyFilters} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
              {(
                [
                  ["startDate", "Start Date"],
                  ["endDate", "End Date"],
                  ["awb_number", "AWB Number"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block space-y-2">
                  <span className="text-sm font-medium">{label}</span>
                  <input
  className={`${inputClass} cursor-pointer`}
  type={key === "awb_number" ? "text" : "date"}
  value={draftFilters[key]}
  onChange={(e) =>
    setDraftFilters((prev) => ({
      ...prev,
      [key]: e.target.value,
    }))
  }
  onClick={(e) => {
    if (key !== "awb_number") {
      const input = e.currentTarget;

      if (typeof input.showPicker === "function") {
        try {
          input.showPicker();
        } catch (error) {
          console.error("Unable to open date picker:", error);
        }
      }
    }
  }}
/>
                </label>
              ))}
            </div>
            <DrawerFooter className="flex-row border-t">
              <Button
                type="button"
                className="flex-1"
                variant="outline"
                onClick={() => {
                  setDraftFilters({ ...emptyFilters });
                  setFilters({ ...emptyFilters });
                  setSearchInput("");
                  setPage(1);
                  setFilterOpen(false);
                }}
              >
                Reset
              </Button>
              <Button type="submit" className="flex-1 bg-[#0446DB] text-white hover:bg-blue-800">
                Apply Filters
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>

      <Dialog
        open={Boolean(singleItem)}
        onOpenChange={(v) => {
          if (!v && !singleSaving) setSingleItem(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>Take Action</DialogTitle>
            <DialogDescription>
              NDR {singleItem?.ndr_id} — choose the action and required details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSingle} className="space-y-5">
            <ActionFields value={singleForm} onChange={setSingleForm} />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={singleSaving}
                onClick={() => setSingleItem(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={singleSaving || !singleForm.action}
                className="bg-[#0446DB] text-white hover:bg-blue-800"
              >
                {singleSaving ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={bulkOpen}
        onOpenChange={(v) => {
          if (!bulkLoading) setBulkOpen(v);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>Bulk NDR Action</DialogTitle>
            <DialogDescription>
              Apply one action to {selectedOnPage.length} selected NDR(s). Each NDR is processed
              separately.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBulk} className="space-y-5">
            <ActionFields value={bulkForm} onChange={setBulkForm} bulk />
            {bulkLoading && (
              <p className="text-sm text-[#0446DB]">
                Processing {bulkProgress.done} of {bulkProgress.total}...
              </p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={bulkLoading}
                onClick={() => setBulkOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={bulkLoading || !bulkForm.action || !selectedOnPage.length}
                className="bg-[#0446DB] text-white hover:bg-blue-800"
              >
                {bulkLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Apply to ${selectedOnPage.length} NDR(s)`
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={historyItem !== null}
        onOpenChange={(v) => {
          if (!v) setHistoryItem(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>NDR History</DialogTitle>
            <DialogDescription>History of actions performed on this NDR</DialogDescription>
          </DialogHeader>
          {historyItem?.length ? (
            <div className="max-h-[65vh] space-y-3 overflow-y-auto">
              {historyItem.map((h, i) => (
                <div key={String(h.action_id || i)} className="rounded-md border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <b className="text-sm">{titleCase(String(h.action_taken || "Action"))}</b>
                    <span className="text-xs text-gray-500">{fmtDate(h.created_at)}</span>
                  </div>
                  <div className="mt-2 grid gap-2 text-sm">
                    {(
                      [
                        ["remarks", "Remarks"],
                        ["sub_remarks", "Sub remarks"],
                        ["detailed_remarks", "Other remarks"],
                        ["customer_phone", "Phone"],
                        ["customer_name", "Customer name"],
                        ["customer_details_address", "Address"],
                        ["rescheduled_date", "Rescheduled date"],
                      ] as const
                    )
                      .filter(([k]) => pretty(h[k]) !== "—")
                      .map(([k, label]) => (
                        <div key={k}>
                          <span className="text-xs text-gray-500">{label}: </span>
                          {pretty(h[k])}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-gray-500">No history found</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryItem(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
