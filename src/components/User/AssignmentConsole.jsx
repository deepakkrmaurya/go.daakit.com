
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import {
//     Drawer,
//     DrawerClose,
//     DrawerContent,
//     DrawerFooter,
//     DrawerHeader,
//     DrawerTitle,
//     DrawerTrigger,
// } from "@/components/ui/drawer";
// import {
//     HoverCard,
//     HoverCardContent,
//     HoverCardTrigger,
// } from "@/components/ui/hover-card"


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
// } from "@/components/ui/alert-dialog"
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { FaFilter } from 'react-icons/fa';
// import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaRegCopy } from "react-icons/fa";
// import { TbFileInfo } from "react-icons/tb";
// import { CiCircleCheck } from "react-icons/ci";
// import { UserRoles } from "@/utils/UserRole";
// import {
//     Dialog,
//     DialogClose,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog"
// import { Calendar } from "@/components/ui/calendar"
// import { Field, FieldLabel } from "@/components/ui/field"
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/components/ui/popover"
// import AxiosInstance from '../../Helper/axiosInstance';
// const baseURL = import.meta.env.VITE_BASE_URL;
// const frontEndURL = import.meta.env.VITE_FRONTEND_URL;
// function AssignmentConsole() {
//     const [open, setOpen] = useState(false)
//     const [endopen, setEndOpen] = useState(false)
//     const [fetchBulkAssignmentVendor, setFetchBulkAssignmentVendor] = useState(false);
//     const [selectedBulkOrders, setSelectedBulkOrders] = useState([]);
//     const [assignmentState, setAssignmentState] = useState("");
//     const [vendor, setVendor] = useState([]);
//     const [isOpenIndividualVendorAssignmnet, setIsOpenIndividualVendorAssignmnet] = useState("");
//     const [copySuccess, setCopySuccess] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [orders, setOrders] = useState([]);
//     const [totalPages, setTotalPages] = useState(1);
//     const [page, setPage] = useState(1);
//     const [limit, setLimit] = useState(10);
//     const [advanceFilters, setAdvanceFilters] = useState({
//         startDate: "",
//         endDate: "",
//         awbNumber: "",
//         vendor_id: "",
//         order_specific: ""

//     });
//     const [isFilterOpen, setIsFilterOpen] = useState(false);

//     const [totalOrders, setTotalOrders] = useState(0);
//     const [selectedStatus, setSelectedStatus] = useState("All");


//     const navigate = useNavigate()

//     const fetchOrders = async () => {


//         setLoading(true);
//         try {
//             const res = await axios.get(`${baseURL}/api/user/getBookedEligibleOrders`, {
//                 params: {
//                     page,
//                     limit,
//                     vendor_id: advanceFilters.vendor_id,
//                     start_date: advanceFilters.startDate,
//                     end_date: advanceFilters.endDate,
//                     awb_number: advanceFilters.awbNumber,
//                     order_specific: advanceFilters.order_specific,
//                     status: selectedStatus == "All" ? " " : selectedStatus
//                 },
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });
//             setOrders(res?.data?.data || []);
//             setTotalPages(res.data?.pagination.totalPages || 1);
//         } catch (err) {
//             setOrders([]);
//             toast.error(err.response?.data?.message || err.message || "An error occurred while fetching orders.");
//         } finally {
//             setLoading(false);
//         }
//     };


//     const status = [
//         "All",
//         "booked",
//         "pending pickup",
//         "picked",

//     ];

//     function toCapitalizeEachWord(str) {
//         return str
//             .split(" ")
//             .map((word) => {
//                 if (!word) return "";
//                 return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//             })
//             .join(" ");
//     }


//     const fetchVendor = async (order_ids) => {
//         if (order_ids.length == 0) {
//             return;
//         }

//         try {
//             const res = await axios.get(`${baseURL}/api/user/getEligibleVendorsByOrders?order_id=${order_ids}`, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 }
//             });

//             setVendor(res?.data?.data?.data || []);
//             if (res?.data?.data?.data.length == 0) {
//                 // setSelectedBulkOrders([]);
//                 // setBulkOrderWeight(0);
//                 // setFetchBulkAssignmentVendor(false);

//             }
//         } catch (err) {
//             setVendor([])
//             toast.error(err.response?.data?.message || err.message || "Failed to load riders");
//         } finally {
//             setLoading(false);
//         }
//     };


//     const clearAllState = () => {
//   // Selected orders
//   setSelectedBulkOrders([]);
//   setBulkOrderWeight(0);

//   // Bulk vendor assignment
//   setFetchBulkAssignmentVendor(false);
//   setAssignmentState("");
//   setVendor([]);

//   // Individual vendor assignment
//   setIsOpenIndividualVendorAssignmnet("");

//   // Other UI states
//   setCopySuccess(null);
// };


//     const assignVendor = async (orderId, vendorId) => {
//         setLoading(true);
//         try {
//             const res = await axios.post(
//                 `${baseURL}/api/user/assignOrderToVendor`,
//                 { order_id: orderId, vendor_id: vendorId },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                 }
//             );

//             toast.success(res.data.message || "Vendor assigned successfully");
//             fetchOrders();

//         } catch (err) {
//             toast.error("Failed to assign vendor");
//             return
//         } finally {
//             setLoading(false);
//         }
//     };

//     const assignBulkOrderVendor = async (orderIds, vendorId) => {
//         setLoading(true);
//         try {

//             await axios.post(
//                 `${baseURL}/api/user/assignOrderToVendor`,
//                 {
//                     order_id: orderIds,
//                     vendor_id: vendorId,
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                 }
//             );

//             toast.success("Vendor assigned successfully");
//             fetchOrders();
//             setAssignmentState("");
//             setSelectedBulkOrders([]);
//             setBulkOrderWeight(0);

//         } catch (err) {
//             toast.error(err.response.data.message || "Failed to assign vendor");
//             return
//         } finally {
//             setLoading(false);
//         }
//     };

//     const [permissions, setPermissions] = useState([])
//     const getUserPermissions = async () => {
//         try {
//             const res = await axios.get(`${baseURL}/api/user/getUserPermissions`, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });
//             const permission = res?.data?.data?.data || [];

//             if (!permission.includes("VIEW_ASSN_CON") &&
//                 !permission.includes("ADMIN_FULL_ACCESS")) {
//                 navigate("/unauthorized");
//                 return
//             }
//             setPermissions(res?.data?.data?.data)


//         } catch (error) {
//             toast.error('')
//         }
//     }



//     const generateBulkPickupRequest = async (order_ids) => {
//   if (!order_ids?.length) {
//     toast.warn("Please select at least one order");
//     return;
//   }

//   try {
//     setLoading(true);

//     const res = await AxiosInstance.post(
//       "/api/user/generateBulkPickupRequest",
//       {
//         order_ids,
//       }
//     );

//     toast.success(
//       res?.data?.message || "Pickup scheduled successfully"
//     );

//     // Clear all bulk states
//     clearAllState();

//     // Refresh orders
//     await fetchOrders();
//   } catch (error) {
//     console.error("Generate Bulk Pickup Request Error:", error);

//     toast.error(
//       error?.response?.data?.message ||
//         error?.message ||
//         "Failed to schedule pickup"
//     );
//   } finally {
//     setLoading(false);
//   }
// };

//     const [bulkOrderWeight, setBulkOrderWeight] = useState(0);
//     const toggleSelectAll = () => {
//         if (selectedBulkOrders.length === orders.filter((o) => o.tpc_awb_number === null).length) {
//             setSelectedBulkOrders([]);
//             setBulkOrderWeight(0);
//         } else {


//             const ord = orders.filter(order => order.tpc_awb_number == null);
//             setSelectedBulkOrders(ord);


//             const totalWeight = orders
//                 .filter(order => order.tpc_awb_number == null)
//                 .reduce(
//                     (acc, order) => acc + Number(order.total_weight),
//                     0
//                 );
//             setBulkOrderWeight(totalWeight);
//         }
//     };

//     const formatToDMY = (dateStr) => {
//         if (!dateStr) return "";

//         const date = new Date(dateStr);

//         const dd = String(date.getDate()).padStart(2, "0");
//         const mm = String(date.getMonth() + 1).padStart(2, "0");
//         const yyyy = date.getFullYear();

//         return `${dd}/${mm}/${yyyy}`;
//     };



//     useEffect(() => {
//         if (UserRoles.includes(localStorage.getItem("userType"))) {
//             getUserPermissions()
//         }

//         // setAdvanceFilters({
//         //     endDate: today.toISOString().split("T")[0],
//         //     startDate: oneMonthAgo.toISOString().split("T")[0],
//         //     awbNumber: "",
//         //     vendor_id: "",
//         //     order_specific:""
//         // });

//         fetchOrders();
//     }, [page, limit, selectedStatus]);

//     useEffect(() => {
//         const today = new Date();
//         const oneMonthAgo = new Date();
//         oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
//         setAdvanceFilters((pre) => ({
//             ...pre,
//             endDate: today.toISOString().split("T")[0],
//             startDate: oneMonthAgo.toISOString().split("T")[0],
//         }));
//     }, [])

//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setAdvanceFilters(prev => ({ ...prev, [name]: value }));
//     };

//     const applyFilters = () => {


//         setPage(1);
//         fetchOrders();
//     };

//     const clearFilters = () => {
//         const today = new Date();
//         const oneMonthAgo = new Date();
//         oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
//         const emptyFilters = {
//             endDate: today.toISOString().split("T")[0],
//             startDate: oneMonthAgo.toISOString().split("T")[0],
//             awbNumber: "",
//             vendor_id: "",
//             order_specific: ""
//         };

//         setAdvanceFilters(emptyFilters);
//         setPage(1);
//         fetchOrders()
//     };

//     const handlePageChange = (newPage) => {
//         if (newPage >= 1 && newPage <= totalPages) {
//             setPage(newPage);
//         }
//     };
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         applyFilters();
//         setIsFilterOpen(false);
//     };


//       const [loadingPage, setLoadingPage] = useState(true);

// useEffect(() => {
//   const timer = setTimeout(() => {
//     setLoadingPage(false);
//   }, 2000);

//   return () => clearTimeout(timer);
// }, []);

//     return (
//         <>
//          {
//             loadingPage ? (
//                 <div className=" w-full h-[90vh] flex justify-center items-center">
//                   <div>
//                     <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//                     <p className="mt-2"> Loading Assignment Console...</p>
//                   </div>
//                 </div>
        
//             ):(

//         <div className="">
//             <div className="  z-10  dark:bg-neutral-900 py-2 ">
//                 <div className="  mx-auto px-8  ">
//                     {/* Mobile Layout */}
//                     <div className="  flex flex-col space-y-4">
//                         {/* Top Row: Heading and Buttons */}
//                         <div className="flex items-center justify-between">
//                             <h1 className="text-xl font-bold text-gray-900 dark:text-white">Assignment Console</h1>

//                             <div className="flex items-center gap-2">
//                                 <Drawer direction="right"
//                                     open={isFilterOpen}
//                                     onOpenChange={setIsFilterOpen}
//                                 >
//                                     <DrawerTrigger asChild>
//                                         <Button variant="outline"
//                                             className="bg-[#0446DB] text-white font-medium px-5 py-2.5 rounded-sm shadow hover:bg-indigo-100 hover:shadow-lg transition flex items-center gap-2"
//                                         >
//                                             <FaFilter className="text-sm" />
//                                             <span>Filter</span>
//                                         </Button>
//                                     </DrawerTrigger>
//                                     <DrawerContent>
//                                         <DrawerHeader>
//                                             <DrawerTitle>Filter Orders</DrawerTitle>
//                                         </DrawerHeader>

//                                         <form onSubmit={handleSubmit}>
//                                             <div className="p-6">
//                                                 <div className="grid grid-cols-1 gap-4">
//                                                     <Field className="mx-auto w-full">
//                                                         <FieldLabel htmlFor="date">Start Date</FieldLabel>
//                                                         <Popover open={open} onOpenChange={setOpen}>
//                                                             <PopoverTrigger asChild>
//                                                                 <Button
//                                                                     variant="outline"
//                                                                     id="date"
//                                                                     className="justify-start w-full font-normal"
//                                                                 >

//                                                                     {advanceFilters.startDate ? formatToDMY(advanceFilters.startDate) : "Select date"}
//                                                                 </Button>
//                                                             </PopoverTrigger>
//                                                             <PopoverContent className="w-auto overflow-hidden p-0" align="start">
//                                                                 <Calendar
//                                                                     mode="single"
//                                                                     selected={advanceFilters.startDate}
//                                                                     defaultMonth={advanceFilters.startDate}
//                                                                     captionLayout="dropdown"
//                                                                     onSelect={(date) => {
//                                                                         const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)
//                                                                             .toString()
//                                                                             .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
//                                                                         setAdvanceFilters({
//                                                                             ...advanceFilters,
//                                                                             startDate: formattedDate
//                                                                         })
//                                                                         setOpen(false)
//                                                                     }}
//                                                                 />
//                                                             </PopoverContent>
//                                                         </Popover>
//                                                     </Field>

//                                                     <Field className="mx-auto w-full">
//                                                         <FieldLabel htmlFor="date">End Date</FieldLabel>
//                                                         <Popover open={endopen} onOpenChange={setEndOpen}>
//                                                             <PopoverTrigger asChild>
//                                                                 <Button
//                                                                     variant="outline"
//                                                                     id="date"
//                                                                     className="justify-start w-full font-normal"
//                                                                 >

//                                                                     {advanceFilters.endDate ? formatToDMY(advanceFilters.endDate) : "Select date"}
//                                                                 </Button>
//                                                             </PopoverTrigger>
//                                                             <PopoverContent className="w-auto overflow-hidden p-0" align="start">
//                                                                 <Calendar
//                                                                     mode="single"
//                                                                     selected={advanceFilters.endDate}
//                                                                     defaultMonth={advanceFilters.endDate}
//                                                                     captionLayout="dropdown"
//                                                                     onSelect={(date) => {
//                                                                         const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)
//                                                                             .toString()
//                                                                             .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
//                                                                         setAdvanceFilters({
//                                                                             ...advanceFilters,
//                                                                             endDate: formattedDate
//                                                                         })
//                                                                         setOpen(false)
//                                                                     }}
//                                                                 />
//                                                             </PopoverContent>
//                                                         </Popover>
//                                                     </Field>

//                                                     <div>
//                                                         <label className="block text-xs dark:text-white text-gray-600 mb-1">
//                                                             Order Specific
//                                                         </label>
//                                                         <select
//                                                             value={advanceFilters.order_specific}
//                                                             onChange={(e) => {
//                                                                 setAdvanceFilters((prev) => ({
//                                                                     ...prev,
//                                                                     order_specific: e.target.value,
//                                                                 }));
//                                                             }}
//                                                             className="w-full border dark:border-gray-700 dark:bg-gray-800 
//                                     dark:text-white px-3 py-2 rounded-sm text-sm 
//                                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                                         >
//                                                             <option value="">All orders</option>

//                                                             <option value="HLD">HLD</option>
//                                                             <option value="SDD">Same Day Delivery</option>
//                                                             <option value="NDD">Next Day Delivery</option>
//                                                         </select>
//                                                     </div>

//                                                     <div>
//                                                         <Label htmlFor="awbNumber">AWB Number</Label>
//                                                         <Input
//                                                             id="awbNumber"
//                                                             name="awbNumber"
//                                                             value={advanceFilters.awbNumber}
//                                                             onChange={handleFilterChange}
//                                                             placeholder="Enter AWB number"
//                                                         />
//                                                     </div>

//                                                     <div>
//                                                         <Label htmlFor="vendor_id">Vendor ID</Label>
//                                                         <Input
//                                                             id="vendor_id"
//                                                             name="vendor_id"
//                                                             value={advanceFilters.vendor_id}
//                                                             onChange={handleFilterChange}
//                                                             placeholder="Enter vendor ID"
//                                                         />
//                                                     </div>






//                                                 </div>
//                                             </div>
//                                             <DrawerFooter>
//                                                 <Button
//                                                     className='bg-[#0446DB]'

//                                                     onClick={applyFilters}>Apply Filters</Button>
//                                                 <DrawerClose asChild>
//                                                     <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
//                                                 </DrawerClose>
//                                             </DrawerFooter>

//                                         </form>
//                                     </DrawerContent>
//                                 </Drawer>
//                             </div>
//                         </div>




//                     </div>


//                 </div>
//             </div>

//             <div className="border rounded-sm">
//                 {/* {selectedBulkOrders.length > 0 && (

//                     <>
//                         <div className="mb-10 bg-white  rounded-xl shadow-lg p-2 border border-gray-200">
                            
//                             <div className="mt-6 flex flex-wrap items-center gap-4">
                                


//                                 {!fetchBulkAssignmentVendor || vendor?.length == 0 ? (
//                                     (permissions.includes('ADMIN_FULL_ACCESS') || permissions.includes('VENDOR_VIEW')) && (

//                                         <button
//                                             onClick={() => {
//                                                 setFetchBulkAssignmentVendor(true);
//                                                 const order_ids = [...new Set(selectedBulkOrders.map(o => o.id))];
//                                                 fetchVendor(order_ids);

//                                             }}
//                                             className="bg-[#0446db] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
//                                         >
//                                             Get Available Vendor
//                                         </button>
//                                     )
//                                 ) : (
//                                     <>
//                                         {
//                                             vendor?.length > 0 && (
//                                                 <>
//                                                     <select
//                                                         className="border border-gray-300 text-sm text-gray-700 px-4 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
//                                                         value={assignmentState}
//                                                         onChange={(e) => setAssignmentState(e.target.value)}
//                                                     >
//                                                         <option value="">
//                                                             Select Vendor for Bulk Assignment
//                                                         </option>
//                                                         {vendor.map((vendor) => (
//                                                             <option
//                                                                 key={vendor.vendor_id}
//                                                                 value={vendor.vendor_id}
//                                                             >
//                                                                 {vendor.vendor_id} :{" "}
//                                                                 {vendor.vendor_name}

//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                     <button
//                                                         onClick={async () => {
//                                                             if (!assignmentState) {
//                                                                 toast.warn("Please select a vendor");
//                                                                 return;
//                                                             }
//                                                             for (const order of selectedBulkOrders) {
//                                                                 const result = await assignBulkOrderVendor(
//                                                                     order.id,
//                                                                     assignmentState
//                                                                 );
//                                                             }
//                                                             setSelectedBulkOrders([]);
//                                                             setBulkOrderWeight(0);
//                                                             setFetchBulkAssignmentVendor(false);
//                                                         }}
//                                                         className="bg-[#0446db] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
//                                                     >
//                                                         Bulk Assign
//                                                     </button>
//                                                 </>
//                                             )
//                                         }

//                                     </>
//                                 )}
//                                 <button
//                                     className="bg-red-500 hover:bg-red-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
//                                     onClick={() => {
//                                         setSelectedBulkOrders([]);
//                                         setBulkOrderWeight(0);

//                                         setFetchBulkAssignmentVendor(false);
//                                         setcanceledBulkOrder(false)
//                                     }}
//                                 >
//                                     Clear Selected Orders
//                                 </button>
//                             </div>



//                         </div>
//                     </>

//                 )} */}

//                 <div className="w-full  bg-white  rounded   dark:bg-neutral-900  left-0 px-4 z-40   ">
//                     <div className="relative flex justify-center ">
//                         <div className=" flex  overflow-x-auto  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2">
//                             <div className="flex gap-2 min-w-max px-8 mt-3">
//                                 {status.map((st) => (
//                                     <Button
//                                         key={st}
//                                         onClick={() => {
//                                             setSelectedBulkOrders([]);
//                                             setSelectedStatus(st);
//                                             setPage(1);
//                                         }}
                                        
//                                         className={`px-5 py-2.5 rounded-full my-2 border transition-all duration-300 font-medium text-sm tracking-wide ${selectedStatus === st
//                                             ? "bg-[#0446DB] text-white "
//                                             : "bg-white hover:bg-[#0446DB] hover:text-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]"
//                                             }`}
//                                     >
//                                         {st === "rto in transit"
//                                             ? "RTO In Transit"
//                                             : st === "rto delivered"
//                                                 ? "RTO Delivered"
//                                                 : toCapitalizeEachWord(st)}
//                                         {selectedStatus === st && ` (${orders.length})`}
//                                     </Button>
//                                 ))}
//                             </div>
//                         </div>

                    
//                     </div>


//                     {selectedBulkOrders.length > 0 && (
//   <AlertDialog>
//     <AlertDialogTrigger asChild>
//       <Button
//         variant="outline"
//         className="my-1 h-9 cursor-pointer rounded-sm border-[#0446DB] bg-[#0446DB] px-4 text-sm font-medium text-white transition hover:bg-blue-700 hover:text-white dark:border-blue-500 dark:bg-[#0446DB] dark:text-white"
//       >
//         Bulk Actions
//       </Button>
//     </AlertDialogTrigger>

//     <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
//       {/* ================= HEADER ================= */}
//       <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
//         <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
//           Bulk Order Actions
//         </AlertDialogTitle>

//         <AlertDialogDescription className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
//           Manage{" "}
//           <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//             {selectedBulkOrders?.length || 0}
//           </span>{" "}
//           selected orders.
//         </AlertDialogDescription>
//       </AlertDialogHeader>

//       {/* ================= CONTENT ================= */}
//       <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5">
//         {/* ================= VENDOR ASSIGNMENT ================= */}
//         {(permissions.includes("ADMIN_FULL_ACCESS") ||
//           permissions.includes("VENDOR_VIEW")) && (
//           <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
//             {/* Section Header */}
//             <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
//               <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                 Vendor Assignment
//               </h3>

//               <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                 Find an available vendor and assign selected orders.
//               </p>
//             </div>

//             <div className="p-4">
//               {/* Get Vendor */}
//               {!fetchBulkAssignmentVendor ? (
//                 <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                       Available Vendors
//                     </p>

//                     <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                       Check eligible vendors for{" "}
//                       <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                         {selectedBulkOrders.length}
//                       </span>{" "}
//                       selected orders.
//                     </p>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={() => {
//                       setFetchBulkAssignmentVendor(true);

//                       const order_ids = [
//                         ...new Set(
//                           selectedBulkOrders.map((o) => o.id)
//                         ),
//                       ];

//                       fetchVendor(order_ids);
//                     }}
//                     className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white transition hover:bg-indigo-800"
//                   >
//                     Get Available Vendor
//                   </button>
//                 </div>
//               ) : vendor?.length > 0 ? (
//                 /* ================= VENDOR FOUND ================= */
//                 <div className="space-y-4">
//                   <div>
//                     <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                       Select Vendor
//                     </label>

//                     <select
//                       value={assignmentState}
//                       onChange={(e) =>
//                         setAssignmentState(e.target.value)
//                       }
//                       className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
//                     >
//                       <option value="">
//                         Select Vendor for Bulk Assignment
//                       </option>

//                       {vendor.map((vendor) => (
//                         <option
//                           key={vendor.vendor_id}
//                           value={vendor.vendor_id}
//                         >
//                           {vendor.vendor_id} : {vendor.vendor_name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="flex justify-end">
//                     <button
//                       type="button"
//                       disabled={!assignmentState}
//                       onClick={async () => {
//                         if (!assignmentState) {
//                           toast.warn("Please select a vendor");
//                           return;
//                         }

//                         for (const order of selectedBulkOrders) {
//                           const result =
//                             await assignBulkOrderVendor(
//                               order.id,
//                               assignmentState
//                             );
//                         }

//                         setSelectedBulkOrders([]);
//                         setBulkOrderWeight(0);
//                         setFetchBulkAssignmentVendor(false);
//                       }}
//                       className="h-9 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500"
//                     >
//                       Bulk Assign
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 /* ================= NO VENDOR ================= */
//                 <div className="rounded-sm border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
//                   <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
//                     No Vendor Available
//                   </p>

//                   <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
//                     No eligible vendor was found for the selected orders.
//                   </p>

//                   <button
//                     type="button"
//                     onClick={() => {
//                       setFetchBulkAssignmentVendor(false);
//                       setAssignmentState("");
//                     }}
//                     className="mt-3 h-8 cursor-pointer rounded-sm border border-amber-300 bg-white px-3 text-xs font-medium text-amber-700 transition hover:bg-amber-100 dark:border-amber-500/30 dark:bg-neutral-900 dark:text-amber-400"
//                   >
//                     Try Again
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

        

//         {/* ================= SCHEDULE PICKUP ================= */}
//         {
//             selectedStatus=='booked' &&(

//                 <div className="overflow-hidden rounded-sm border border-emerald-200 dark:border-emerald-500/20">
//                 {/* Header */}
//                 <div className="border-b border-emerald-100 bg-emerald-50/70 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/5">
//                     <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                     Schedule Pickup
//                     </h3>

//                     <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                     Generate a pickup request for all currently selected orders.
//                     </p>
//                 </div>

//                 {/* Content */}
//                 <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
//                     <div className="min-w-0">
//                     <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                         Schedule Selected Orders
//                     </p>

//                     <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                         <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                         {selectedBulkOrders?.length || 0}
//                         </span>{" "}
//                         selected orders will be scheduled for pickup.
//                     </p>
//                     </div>

//                     <Button
//                     type="button"
//                     disabled={!selectedBulkOrders?.length || loading}
//                     onClick={async () => {
//                         if (!selectedBulkOrders?.length) {
//                         toast.warn("Please select at least one order");
//                         return;
//                         }

//                         const order_ids = [
//                         ...new Set(
//                             selectedBulkOrders.map((order) => order.id)
//                         ),
//                         ];

//                         await generateBulkPickupRequest(order_ids);
//                     }}
//                     className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-emerald-600 px-5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
//                     >
//                     {loading ? (
//                         <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Scheduling...
//                         </>
//                     ) : (
//                         "Schedule Pickup"
//                     )}
//                     </Button>
//                 </div>
//                 </div>
//             )
//         }


//         {/* ================= CLEAR SELECTION ================= */}
//         <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
//           <div className="min-w-0">
//             <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//               Clear Selection
//             </p>

//             <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//               Remove all currently selected orders and reset bulk actions.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={() => {
//               setSelectedBulkOrders([]);
//               setBulkOrderWeight(0);
//               setFetchBulkAssignmentVendor(false);
//               setcanceledBulkOrder(false);
//             }}
//             className="h-9 cursor-pointer whitespace-nowrap rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
//           >
//             Clear Selected Orders
//           </button>
//         </div>
//       </div>

//       {/* ================= FOOTER ================= */}
//       <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-950/30">
//         <AlertDialogCancel
//           onClick={() => {
//             setFetchBulkAssignmentVendor(false);
//             setAssignmentState("");
//             clearAllState()
//           }}
//           className="cursor-pointer rounded-sm"
//         >
//           Close
//         </AlertDialogCancel>
//       </AlertDialogFooter>
//     </AlertDialogContent>
//   </AlertDialog>
//                      )}
//                 </div>


//                 <Table>
//                     <TableHeader>
//                         <TableRow>
//                             {
//                                 (permissions.includes('ADMIN_FULL_ACCESS') || permissions.includes('VENDOR_VIEW')) && (
//                                     selectedStatus != "All" ? (
//                                         <TableHead>

//                                             <div>
//                                                 <span>
//                                                     <input
//                                                         type="checkbox"
//                                                         className="w-4 h-4 text-indigo-600 rounded border-gray-300"
//                                                         checked={
//                                                             selectedBulkOrders.length === orders.filter((o) => o.tpc_awb_number === null).length

//                                                         }
//                                                         onChange={toggleSelectAll}
//                                                     />
//                                                 </span>
//                                             </div>
//                                         </TableHead>
//                                     ) : (
//                                         <span className="px-6 py-4 text-center">
//                                             -
//                                         </span>
//                                     )
//                                 )
//                             }
//                             <TableHead>ORDER ID</TableHead>
//                             <TableHead>CONSIGNEE ADDRESS</TableHead>
//                             <TableHead>PACKAGE DETAILS</TableHead>
//                             <TableHead>ASSIGNMENT/RIDER</TableHead>
//                             <TableHead>MAPPED/VENDOR</TableHead>
//                             <TableHead>STATUS</TableHead>
//                             <TableHead>ELIGIBLE VENDORS</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {loading ? (
//                             <TableRow>
//                                 <TableCell colSpan={10} className="text-center py-10">
//                                     <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//                                     <p className="mt-2">Loading orders...</p>
//                                 </TableCell>
//                             </TableRow>
//                         ) : orders.length === 0 ? (
//                             <TableRow>
//                                 <TableCell colSpan={10} className="text-center py-10">
//                                     No orders found
//                                 </TableCell>
//                             </TableRow>
//                         ) : (
//                             orders.map((order) => {
//                                 let isSelected;

//                                 isSelected = selectedBulkOrders.some(
//                                     (o) => o.id === order.id
//                                 );

//                                 return (
//                                     <TableRow key={order.id}>
//                                         {
//                                             (permissions.includes('ADMIN_FULL_ACCESS') || permissions.includes('VENDOR_VIEW')) && (

//                                                 <TableCell>
//                                                     {

//                                                         ((order.tpc_awb_number == null) && order.tpc_awb_number == null) ? (
//                                                             selectedStatus != "All" ? (
//                                                                 <div className="px-6 py-4 text-center">
//                                                                     <input
//                                                                         type="checkbox"
//                                                                         checked={isSelected}

//                                                                         onChange={(e) => {
//                                                                             const isChecked = e.target.checked;


//                                                                             if (isChecked) {
//                                                                                 setSelectedBulkOrders((prev) => {
//                                                                                     const updated = [...prev, order];

//                                                                                     const order_ids = updated.map((o) => o.id);
//                                                                                     if(selectedStatus !=='booked'){

//                                                                                         fetchVendor(order_ids); 
//                                                                                     }

//                                                                                     return updated;
//                                                                                 });

//                                                                                 setBulkOrderWeight(
//                                                                                     (prev) => Number(prev) + Number(order.total_weight)
//                                                                                 );
//                                                                             } else {
//                                                                                 setSelectedBulkOrders((prev) => {
//                                                                                     const updated = prev.filter((o) => o.id !== order.id);

//                                                                                     const order_ids = updated.map((o) => o.id);
//                                                                                     fetchVendor(order_ids);

//                                                                                     return updated;
//                                                                                 });

//                                                                                 setBulkOrderWeight(
//                                                                                     (prev) => Number(prev) - Number(order.total_weight) // ✅ fixed bug
//                                                                                 );
//                                                                             }

//                                                                         }}
//                                                                         className="w-4 h-4 text-[#0446db] border-gray-300 rounded"
//                                                                     />

//                                                                 </div>
//                                                             ) : (
//                                                                 <>
//                                                                     <span className="px-6 py-4 text-center">
//                                                                         -
//                                                                     </span>
//                                                                 </>
//                                                             )
//                                                         ) : (
//                                                             <>
//                                                                 <span className="px-6 py-4 text-center">
//                                                                     -
//                                                                 </span>
//                                                             </>
//                                                         )}
//                                                 </TableCell>
//                                             )
//                                         }

//                                         <TableCell>
//                                             <div>
//                                                 <p className="text-l text-gray-800 flex items-center">
//                                                     <a
//                                                         href={`${frontEndURL}/track-order?awb_number=${order.awb_number}`}
//                                                         target="_blank"
//                                                         rel="noopener noreferrer"
//                                                         className="underline text-blue-700 hover:text-blue-500"
//                                                     >
//                                                         {order.awb_number}
//                                                     </a>
//                                                     <button
//                                                         className="pl-2 text-lg text-gray-600 hover:text-[#0446db] transition"
//                                                         onClick={() => {
//                                                             navigator.clipboard.writeText(
//                                                                 order.awb_number
//                                                             );
//                                                             setCopySuccess(order.awb_number);
//                                                             setTimeout(() => {
//                                                                 setCopySuccess(null);
//                                                             }, 2000);
//                                                         }}
//                                                     >
//                                                         {copySuccess === order.awb_number ? (
//                                                             <CiCircleCheck />
//                                                         ) : (
//                                                             <FaRegCopy />
//                                                         )}
//                                                     </button>

//                                                     <Dialog className='w-5xl'>

//                                                         <DialogTrigger asChild>
//                                                             <Button variant="outline" className="text-xs font-medium  text-red-600  inline-block cursor-pointer ">
//                                                                 <span >
//                                                                     <TbFileInfo />
//                                                                 </span>
//                                                             </Button>
//                                                         </DialogTrigger>
//                                                         <DialogContent className="sm:max-w-4xl">
//                                                             <DialogHeader>
//                                                                 <DialogTitle>Order Details</DialogTitle>

//                                                             </DialogHeader>

//                                                             <div className="bg-white p-6  space-y-3 text-gray-700">
//                                                                 {/* Basic Info */}
//                                                                 <h3 className="font-semibold text-[#0446db] mb-2">
//                                                                     Basic Details
//                                                                 </h3>
//                                                                 <div className="grid grid-cols-2 gap-4">
//                                                                     <div>
//                                                                         <strong>Order ID:</strong> {order.merchant_order_id}
//                                                                         <button
//                                                                             className="pl-2 text-lg text-gray-600 hover:text-[#0446db] transition"
//                                                                             onClick={() => {
//                                                                                 navigator.clipboard.writeText(
//                                                                                     order.merchant_order_id
//                                                                                 );
//                                                                                 setCopySuccess(order.merchant_order_id);
//                                                                                 setTimeout(() => {
//                                                                                     setCopySuccess(null);
//                                                                                 }, 2000);
//                                                                             }}
//                                                                         >
//                                                                             {copySuccess === order.merchant_order_id ? (
//                                                                                 <CiCircleCheck />
//                                                                             ) : (
//                                                                                 <FaRegCopy />
//                                                                             )}
//                                                                         </button>
//                                                                     </div>
//                                                                     <div>
//                                                                         <strong>AWB No:</strong> {order.awb_number}
//                                                                         <button
//                                                                             className="pl-2 text-lg text-gray-600 hover:text-[#0446db] transition"
//                                                                             onClick={() => {
//                                                                                 navigator.clipboard.writeText(order.awb_number);
//                                                                                 setCopySuccess(order.awb_number);
//                                                                                 setTimeout(() => {
//                                                                                     setCopySuccess(null);
//                                                                                 }, 2000);
//                                                                             }}
//                                                                         >
//                                                                             {copySuccess === order.awb_number ? (
//                                                                                 <CiCircleCheck />
//                                                                             ) : (
//                                                                                 <FaRegCopy />
//                                                                             )}
//                                                                         </button>
//                                                                     </div>
//                                                                     <div>
//                                                                         <strong>Order Type:</strong>{" "}
//                                                                         {order.order_type === "cod" ? "COD" : "Prepaid"}
//                                                                     </div>
//                                                                     <div>
//                                                                         <strong>Order Specific:</strong> {order.order_specific}
//                                                                     </div>
//                                                                     <div>
//                                                                         <strong>Order Status:</strong>{" "}
//                                                                         {toCapitalizeEachWord(order.status)}
//                                                                     </div>
//                                                                     <div>
//                                                                         <strong>Total Amount:</strong> ₹
//                                                                         {Number(order.total_amount).toLocaleString()}
//                                                                     </div>
//                                                                     <div>
//                                                                         <strong>Order Weight:</strong>{" "}
//                                                                         {Number(order.total_weight).toLocaleString()}g
//                                                                     </div>
//                                                                     <div>
//                                                                         <strong>Number of Packets:</strong>{" "}
//                                                                         {order.number_of_boxes}
//                                                                     </div>
//                                                                 </div>

//                                                                 {/* Document Info */}
//                                                                 <div className="pt-4 border-t">
//                                                                     <h3 className="font-semibold text-[#0446db] mb-2">
//                                                                         Delivery Details
//                                                                     </h3>
//                                                                     <div className="grid grid-cols-2 gap-4">
//                                                                         <div>
//                                                                             <strong>Customer Name:</strong>{" "}
//                                                                             {order.delivery_contact_name}
//                                                                         </div>
//                                                                         {/* <div>
//                           <strong>Customer Contact No:</strong>{" "}
//                           {order.delivery_phone}
//                         </div> */}
//                                                                         <div>
//                                                                             <strong>Address:</strong>{" "}
//                                                                             {order.delivery_address_line}
//                                                                         </div>
//                                                                         <div>
//                                                                             <strong>City:</strong>{" "}
//                                                                             {`${order.delivery_city}, ${order.delivery_state} - ${order.delivery_pincode}` ||
//                                                                                 "N/A"}
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>

//                                                                 {/* Bank Info */}
//                                                                 <div className="pt-4 border-t">
//                                                                     <h3 className="font-semibold text-[#0446db] mb-2">
//                                                                         Pickup Details
//                                                                     </h3>
//                                                                     <div className="grid grid-cols-2 gap-4">
//                                                                         <div>
//                                                                             <strong>Name:</strong>{" "}
//                                                                             {order.pickup_contact_name || "N/A"}
//                                                                         </div>
//                                                                         <div>
//                                                                             <strong>Pickup Phone No:</strong>{" "}
//                                                                             {`${order.pickup_phone}` || "N/A"}
//                                                                         </div>
//                                                                         <div>
//                                                                             <strong>Address:</strong>{" "}
//                                                                             {order.pickup_address_line || "N/A"}
//                                                                         </div>
//                                                                         <div>
//                                                                             <strong>City:</strong>{" "}
//                                                                             {`${order.pickup_city}, ${order.pickup_state} - ${order.pickup_pincode}` ||
//                                                                                 "N/A"}
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>



//                                                             </div>

//                                                             <DialogFooter>
//                                                                 <DialogClose asChild>

//                                                                     <button
//                                                                         onClick={() => {
//                                                                             navigate(`/admin/order-history?awb=${order?.awb_number}`);
//                                                                         }}
//                                                                         className="bg-green-500 mr-2 text-white px-4 py-2 rounded hover:bg-indigo-800 transition"
//                                                                     >
//                                                                         Get History
//                                                                     </button>
//                                                                 </DialogClose>
//                                                                 <DialogClose asChild>

//                                                                     <Button variant="outline">Cancel</Button>
//                                                                 </DialogClose>

//                                                             </DialogFooter>
//                                                         </DialogContent>
//                                                     </Dialog>

//                                                 </p>

//                                                 <p className="text-s text-gray-500 dark:text-white">
//                                                     {new Date(order.created_at).toLocaleString(
//                                                         "en-IN",
//                                                         {
//                                                             timeZone: "Asia/Kolkata",
//                                                             day: "2-digit",
//                                                             month: "2-digit",
//                                                             year: "numeric",
//                                                             hour: "2-digit",
//                                                             minute: "2-digit",
//                                                             hour12: true,
//                                                         }
//                                                     )}
//                                                 </p>

//                                                 <p className="text-s text-gray-400 dark:text-white">
//                                                     Merchant ID: {order.merchant_id}
//                                                     <span
//                                                     className={`inline-flex items-center gap-1.5 rounded-full border border-dashed px-2.5 py-1 text-xs font-semibold ${
//                                                         order.rider_preference === "daakit"
//                                                         ? "border-blue-500 bg-blue-50/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
//                                                         : "border-emerald-500 bg-emerald-50/50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
//                                                     }`}
//                                                     >
//                                                     {order.rider_preference === "daakit" ? "Daakit" : "Self"}
//                                                     </span>
//                                                 </p>
//                                                 <p className="text-s text-gray-400 dark:text-white">
//                                                     Merchant Order ID:{" "}
//                                                     {order.merchant_order_id?.length <= 20
//                                                         ? order.merchant_order_id
//                                                         : `${order.merchant_order_id.slice(
//                                                             0,
//                                                             20
//                                                         )}...`}
//                                                     <button
//                                                         className="pl-2 text-lg text-gray-600 dark:text-white hover:text-[#0446db] transition"
//                                                         onClick={() => {
//                                                             navigator.clipboard.writeText(
//                                                                 order.merchant_order_id
//                                                             );
//                                                             setCopySuccess(order.merchant_order_id);
//                                                             setTimeout(() => {
//                                                                 setCopySuccess(null);
//                                                             }, 2000);
//                                                         }}
//                                                     >
//                                                         {copySuccess === order.merchant_order_id ? (
//                                                             <CiCircleCheck />
//                                                         ) : (
//                                                             <FaRegCopy />
//                                                         )}
//                                                     </button>
//                                                     {/* <span className="bg-[#0446db] px-2 text-white rounded">{order.rider_preference === 'daakit' ? "Daakit" : "Self"}</span> */}
//                                                 </p>
//                                             </div>
//                                         </TableCell>
//                                         <TableCell>
//                                             <p className="font-medium text-gray-800 dark:text-white">
//                                                 {order.delivery_contact_name}
//                                             </p>
//                                             <HoverCard>
//                                                 <HoverCardTrigger>{order.delivery_address_line.slice(0, 30)}...</HoverCardTrigger>
//                                                 <HoverCardContent
//                                                     className='bg-[#0446db] text-white'
//                                                 >
//                                                     {order.delivery_city}, {order.delivery_state} -{" "}
//                                                     {order.delivery_pincode}
//                                                 </HoverCardContent>
//                                             </HoverCard>
//                                             <p className="text-xs text-gray-500 dark:text-white">
//                                                 {order.delivery_city}, {order.delivery_state} -{" "}
//                                                 {order.delivery_pincode}
//                                             </p>

//                                             <p className="text-xs text-gray-400">
//                                                 {order.delivery_country}
//                                             </p>
//                                         </TableCell>
//                                         <TableCell>
//                                             <p>

//                                                 <span className=" whitespace-nowrap dark:text-white">
//                                                     EDD:{" "}
//                                                     {order.EDD}
//                                                 </span>

//                                             </p>
//                                             <p>
//                                                 <span className="font-medium text-gray-800 dark:text-white">
//                                                     Weight:
//                                                 </span>{" "}
//                                                 <span className="dark:text-white">{Number(order.total_weight).toLocaleString()}g</span>

//                                                 <span
//                                                     className={`ml-2 px-2 py-0.5  rounded-full text-sm font-semibold shadow-sm ${order.order_specific?.slice(0, 3) ===
//                                                         "NDD"
//                                                         ? "text-green-800 bg-green-100 border border-green-300"
//                                                         : order.order_specific?.slice(0, 3) ===
//                                                             "SDD"
//                                                             ? "text-yellow-800 bg-yellow-100 border border-yellow-300"
//                                                             : "text-red-800 bg-red-100 border border-red-300 animate-blink"
//                                                         }`}
//                                                 >
//                                                     {order.order_specific?.slice(0, 3) === "NDD"
//                                                         ? "NDD"
//                                                         : order.order_specific?.slice(0, 3) ===
//                                                             "SDD"
//                                                             ? "SDD"
//                                                             : order.order_specific?.slice(0, 6) ===
//                                                                 "Turant"
//                                                                 ? "Turant"
//                                                                 : order.order_specific}
//                                                 </span>

//                                             </p>
//                                             <p>
//                                                 <span className="font-medium dark:text-white text-gray-800">
//                                                     Dimensions:
//                                                 </span>{" "}
//                                                 <span className=" dark:text-white">
//                                                     {order.package_length}x{order.package_breadth}x
//                                                     {order.package_height}
//                                                 </span>
//                                             </p>
//                                         </TableCell>
//                                         <TableCell>
//                                             <span
//                                                 className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer"
//                                             >
//                                                 Not Assigned
//                                             </span>
//                                         </TableCell>
//                                         <TableCell>
//                                             <>
//                                                 {!(
//                                                     isOpenIndividualVendorAssignmnet === order.id
//                                                 ) ? (

//                                                     <span
//                                                         onClick={() => {
//                                                             if (
//                                                                 !permissions.includes('VENDOR_VIEW') &&
//                                                                 !permissions.includes('ADMIN_FULL_ACCESS')
//                                                             ) {
//                                                                 console.log(permissions)
//                                                                 return;
//                                                             }
//                                                             if (order.tpc_awb_number !== null) {
//                                                                 return
//                                                             }
//                                                             fetchVendor(order.id);
//                                                             if (order.rider_preference === 'daakit') {

//                                                                 setIsOpenIndividualVendorAssignmnet(order.id);

//                                                             }
//                                                         }}
//                                                         className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer">
//                                                         Not Mapped
//                                                     </span>
//                                                 ) : (
//                                                     <form
//                                                         onSubmit={(e) => {
//                                                             e.preventDefault();
//                                                             const selectedVendor = assignmentState;
//                                                             if (!selectedVendor) {
//                                                                 toast.warn("Please select a vendor");
//                                                                 return;
//                                                             }
//                                                             assignVendor(order.id, selectedVendor);

//                                                         }}
//                                                         className="flex items-center gap-2"
//                                                     >
//                                                         <select
//                                                             value={assignmentState}
//                                                             onChange={(e) =>
//                                                                 setAssignmentState(e.target.value)
//                                                             }
//                                                             className="border px-2 py-1 rounded-md"
//                                                             required
//                                                         >
//                                                             <option value="" disabled>
//                                                                 Select Vendor
//                                                             </option>
//                                                             {vendor?.map((vendor) => (
//                                                                 <option
//                                                                     key={vendor.vendor_id}
//                                                                     value={vendor.vendor_id}
//                                                                 >
//                                                                     {vendor.vendor_id} :{" "}
//                                                                     {vendor.vendor_name}

//                                                                 </option>
//                                                             ))}
//                                                         </select>
//                                                         <button
//                                                             type="submit"
//                                                             className="bg-[#0446db] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
//                                                         >
//                                                             Assign
//                                                         </button>
//                                                         <button
//                                                             type="button"
//                                                             className="text-xs text-gray-500 hover:underline"
//                                                             onClick={() =>
//                                                                 setIsOpenIndividualVendorAssignmnet("")
//                                                             }
//                                                         >
//                                                             Close
//                                                         </button>
//                                                     </form>
//                                                 )}
//                                             </>
//                                         </TableCell>
//                                         <TableCell>
//                                             <span

//                                                 className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 mb-2 inline-block cursor-pointer"
//                                             >
//                                                 {order?.status
//                                                     ?.toLowerCase()
//                                                     ?.split(" ")
//                                                     ?.map(word => word.charAt(0).toUpperCase() + word.slice(1))
//                                                     ?.join(" ")
//                                                 }
//                                             </span>
//                                         </TableCell>
//                                         <TableCell>
//                                             <p className="font-medium bg-orange-100 text-orange-700 text-center px-3 whitespace-nowrap py-1 rounded-full dark:bg-orange-900 dark:text-orange-200">
//                                                 {order?.tpc_awb_number !== null
//                                                     ? "-"
//                                                     : order?.eligible_vendors?.split(",").join(" | ")}
//                                             </p>
//                                         </TableCell>

//                                     </TableRow>
//                                 )
//                             }


//                             )
//                         )}
//                     </TableBody>
//                 </Table>
//             </div>

//             {totalPages > 1 && (
//                 <div className="flex justify-between items-center py-3 px-3">
//                     <div className="text-sm text-gray-600">
//                         Page {page} of {totalPages}
//                     </div>
//                     <div className="flex gap-2">
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handlePageChange(page - 1)}
//                             disabled={page === 1}
//                         >
//                             <ChevronLeft className="h-4 w-4" />
//                             Previous
//                         </Button>
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handlePageChange(page + 1)}
//                             disabled={page === totalPages}
//                         >
//                             Next
//                             <ChevronRight className="h-4 w-4" />
//                         </Button>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <Label>Rows per page:</Label>
//                         <select
//                             className="border rounded-md px-2 py-1"
//                             value={limit}
//                             onChange={(e) => {
//                                 setLimit(Number(e.target.value));
//                                 setPage(1);
//                             }}
//                         >
//                             <option value={5}>5</option>
//                             <option value={10}>10</option>
//                             <option value={20}>20</option>
//                             <option value={50}>50</option>
//                         </select>
//                     </div>
//                 </div>
//             )}
//         </div>
//             )
//          }
//         </>
//     );
// }

// export default AssignmentConsole;







import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"


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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaFileExport, FaFilter } from 'react-icons/fa';
import { Building2, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegCopy } from "react-icons/fa";
import { TbFileInfo } from "react-icons/tb";
import { CiCircleCheck } from "react-icons/ci";
import { UserRoles } from "@/utils/UserRole";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import AxiosInstance from '../../Helper/axiosInstance';
import CustomButton from '../common/CustomButton';
const baseURL = import.meta.env.VITE_BASE_URL;
const frontEndURL = import.meta.env.VITE_FRONTEND_URL;
function AssignmentConsole() {
    const [open, setOpen] = useState(false)
    const [endopen, setEndOpen] = useState(false)
    const [fetchBulkAssignmentVendor, setFetchBulkAssignmentVendor] = useState(false);
    const [selectedBulkOrders, setSelectedBulkOrders] = useState([]);
    const [assignmentState, setAssignmentState] = useState("");
    const [vendor, setVendor] = useState([]);
    const [isOpenIndividualVendorAssignmnet, setIsOpenIndividualVendorAssignmnet] = useState("");
    const [copySuccess, setCopySuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [advanceFilters, setAdvanceFilters] = useState({
        startDate: "",
        endDate: "",
        awbNumber: "",
        vendor_id: "",
        order_specific: ""

    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [totalOrders, setTotalOrders] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState("All");


    const navigate = useNavigate()

    const fetchOrders = async () => {


        setLoading(true);
        try {
            const res = await axios.get(`${baseURL}/api/user/getBookedEligibleOrders`, {
                params: {
                    page,
                    limit,
                    vendor_id: advanceFilters.vendor_id,
                    start_date: advanceFilters.startDate,
                    end_date: advanceFilters.endDate,
                    awb_number: advanceFilters.awbNumber,
                    order_specific: advanceFilters.order_specific,
                    status: selectedStatus == "All" ? " " : selectedStatus
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setOrders(res?.data?.data || []);
            setTotalPages(res.data?.pagination.totalPages || 1);
        } catch (err) {
            setOrders([]);
            toast.error(err.response?.data?.message || err.message || "An error occurred while fetching orders.");
        } finally {
            setLoading(false);
        }
    };


    const status = [
        "All",
        "booked",
        "pending pickup",
        "picked",

    ];

    function toCapitalizeEachWord(str) {
        return str
            .split(" ")
            .map((word) => {
                if (!word) return "";
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(" ");
    }


    const fetchVendor = async (order_ids) => {
        if (order_ids.length == 0) {
            return;
        }

        try {
            const res = await axios.get(`${baseURL}/api/user/getEligibleVendorsByOrders?order_id=${order_ids}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });

            setVendor(res?.data?.data?.data || []);
            if (res?.data?.data?.data.length == 0) {
                // setSelectedBulkOrders([]);
                // setBulkOrderWeight(0);
                // setFetchBulkAssignmentVendor(false);

            }
        } catch (err) {
            setVendor([])
            toast.error(err.response?.data?.message || err.message || "Failed to load riders");
        } finally {
            setLoading(false);
        }
    };


    const clearAllState = () => {
  // Selected orders
  setSelectedBulkOrders([]);
  setBulkOrderWeight(0);

  // Bulk vendor assignment
  setFetchBulkAssignmentVendor(false);
  setAssignmentState("");
  setVendor([]);

  // Individual vendor assignment
  setIsOpenIndividualVendorAssignmnet("");

  // Other UI states
  setCopySuccess(null);
};


    const assignVendor = async (orderId, vendorId) => {
        setLoading(true);
        try {
            const res = await axios.post(
                `${baseURL}/api/user/assignOrderToVendor`,
                { order_id: orderId, vendor_id: vendorId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            toast.success(res.data.message || "Vendor assigned successfully");
            fetchOrders();

        } catch (err) {
            toast.error("Failed to assign vendor");
            return
        } finally {
            setLoading(false);
        }
    };

    const assignBulkOrderVendor = async (orderIds, vendorId) => {
        setLoading(true);
        try {

            await axios.post(
                `${baseURL}/api/user/assignOrderToVendor`,
                {
                    order_id: orderIds,
                    vendor_id: vendorId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            toast.success("Vendor assigned successfully");
            fetchOrders();
            setAssignmentState("");
            setSelectedBulkOrders([]);
            setBulkOrderWeight(0);

        } catch (err) {
            toast.error(err.response.data.message || "Failed to assign vendor");
            return
        } finally {
            setLoading(false);
        }
    };

    const [permissions, setPermissions] = useState([])
    const getUserPermissions = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/user/getUserPermissions`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const permission = res?.data?.data?.data || [];

            if (!permission.includes("VIEW_ASSN_CON") &&
                !permission.includes("ADMIN_FULL_ACCESS")) {
                navigate("/unauthorized");
                return
            }
            setPermissions(res?.data?.data?.data)


        } catch (error) {
            toast.error('')
        }
    }



    const generateBulkPickupRequest = async (order_ids) => {
  if (!order_ids?.length) {
    toast.warn("Please select at least one order");
    return;
  }

  try {
    setLoading(true);

    const res = await AxiosInstance.post(
      "/api/user/generateBulkPickupRequest",
      {
        order_ids,
      }
    );

    toast.success(
      res?.data?.message || "Pickup scheduled successfully"
    );

    // Clear all bulk states
    clearAllState();

    // Refresh orders
    await fetchOrders();
  } catch (error) {
    console.error("Generate Bulk Pickup Request Error:", error);

    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to schedule pickup"
    );
  } finally {
    setLoading(false);
  }
};

    const [bulkOrderWeight, setBulkOrderWeight] = useState(0);
    const toggleSelectAll = () => {
        if (selectedBulkOrders.length === orders.filter((o) => o.tpc_awb_number === null).length) {
            setSelectedBulkOrders([]);
            setBulkOrderWeight(0);
        } else {


            const ord = orders.filter(order => order.tpc_awb_number == null);
            setSelectedBulkOrders(ord);


            const totalWeight = orders
                .filter(order => order.tpc_awb_number == null)
                .reduce(
                    (acc, order) => acc + Number(order.total_weight),
                    0
                );
            setBulkOrderWeight(totalWeight);
        }
    };

    const formatToDMY = (dateStr) => {
        if (!dateStr) return "";

        const date = new Date(dateStr);

        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();

        return `${dd}/${mm}/${yyyy}`;
    };



    useEffect(() => {
        if (UserRoles.includes(localStorage.getItem("userType"))) {
            getUserPermissions()
        }

        // setAdvanceFilters({
        //     endDate: today.toISOString().split("T")[0],
        //     startDate: oneMonthAgo.toISOString().split("T")[0],
        //     awbNumber: "",
        //     vendor_id: "",
        //     order_specific:""
        // });

        fetchOrders();
    }, [page, limit, selectedStatus]);

    useEffect(() => {
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        setAdvanceFilters((pre) => ({
            ...pre,
            endDate: today.toISOString().split("T")[0],
            startDate: oneMonthAgo.toISOString().split("T")[0],
        }));
    }, [])

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setAdvanceFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {


        setPage(1);
        fetchOrders();
    };

    const clearFilters = () => {
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const emptyFilters = {
            endDate: today.toISOString().split("T")[0],
            startDate: oneMonthAgo.toISOString().split("T")[0],
            awbNumber: "",
            vendor_id: "",
            order_specific: ""
        };

        setAdvanceFilters(emptyFilters);
        setPage(1);
        fetchOrders()
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        applyFilters();
        setIsFilterOpen(false);
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
         {
            loadingPage ? (
                <div className=" w-full h-[90vh] flex justify-center items-center">
                  <div>
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    <p className="mt-2"> Loading Assignment Console...</p>
                  </div>
                </div>
        
            ):(

        <div className="flex h-[88dvh] min-h-0 w-full flex-col overflow-hidden  dark:bg-neutral-900">
            <div className="z-10 shrink-0 dark:bg-neutral-900 py-2">
                <div className="  mx-auto px-8  ">
                    {/* Mobile Layout */}
                    <div className="  flex flex-col space-y-4">
                        {/* Top Row: Heading and Buttons */}
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Assignment Console</h1>

                            <div className="flex items-center gap-2">
                                <Drawer direction="right"
                                    open={isFilterOpen}
                                    onOpenChange={setIsFilterOpen}
                                >
                                    <DrawerTrigger asChild>
                                            <CustomButton
                                             icon={FaFileExport}
                                          variant="outline"
                                          size="md"
                                         
                                          className=""
                                        >
                                           
                                            <span>Filter</span>
                                        </CustomButton>
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader>
                                            <DrawerTitle>Filter Orders</DrawerTitle>
                                        </DrawerHeader>

                                        <form onSubmit={handleSubmit}>
                                            <div className="p-6">
                                                <div className="grid grid-cols-1 gap-4">
                                                    <Field className="mx-auto w-full">
                                                        <FieldLabel htmlFor="date">Start Date</FieldLabel>
                                                        <Popover open={open} onOpenChange={setOpen}>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    id="date"
                                                                    className="justify-start w-full font-normal"
                                                                >

                                                                    {advanceFilters.startDate ? formatToDMY(advanceFilters.startDate) : "Select date"}
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={advanceFilters.startDate}
                                                                    defaultMonth={advanceFilters.startDate}
                                                                    captionLayout="dropdown"
                                                                    onSelect={(date) => {
                                                                        const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)
                                                                            .toString()
                                                                            .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
                                                                        setAdvanceFilters({
                                                                            ...advanceFilters,
                                                                            startDate: formattedDate
                                                                        })
                                                                        setOpen(false)
                                                                    }}
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </Field>

                                                    <Field className="mx-auto w-full">
                                                        <FieldLabel htmlFor="date">End Date</FieldLabel>
                                                        <Popover open={endopen} onOpenChange={setEndOpen}>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    id="date"
                                                                    className="justify-start w-full font-normal"
                                                                >

                                                                    {advanceFilters.endDate ? formatToDMY(advanceFilters.endDate) : "Select date"}
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={advanceFilters.endDate}
                                                                    defaultMonth={advanceFilters.endDate}
                                                                    captionLayout="dropdown"
                                                                    onSelect={(date) => {
                                                                        const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)
                                                                            .toString()
                                                                            .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
                                                                        setAdvanceFilters({
                                                                            ...advanceFilters,
                                                                            endDate: formattedDate
                                                                        })
                                                                        setOpen(false)
                                                                    }}
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </Field>

                                                    <div>
                                                        <label className="block text-xs dark:text-white text-gray-600 mb-1">
                                                            Order Specific
                                                        </label>
                                                        <select
                                                            value={advanceFilters.order_specific}
                                                            onChange={(e) => {
                                                                setAdvanceFilters((prev) => ({
                                                                    ...prev,
                                                                    order_specific: e.target.value,
                                                                }));
                                                            }}
                                                            className="w-full border dark:border-gray-700 dark:bg-gray-800 
                                    dark:text-white px-3 py-2 rounded-sm text-sm 
                                    focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        >
                                                            <option value="">All orders</option>

                                                            <option value="HLD">HLD</option>
                                                            <option value="SDD">Same Day Delivery</option>
                                                            <option value="NDD">Next Day Delivery</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="awbNumber">AWB Number</Label>
                                                        <Input
                                                            id="awbNumber"
                                                            name="awbNumber"
                                                            value={advanceFilters.awbNumber}
                                                            onChange={handleFilterChange}
                                                            placeholder="Enter AWB number"
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="vendor_id">Vendor ID</Label>
                                                        <Input
                                                            id="vendor_id"
                                                            name="vendor_id"
                                                            value={advanceFilters.vendor_id}
                                                            onChange={handleFilterChange}
                                                            placeholder="Enter vendor ID"
                                                        />
                                                    </div>






                                                </div>
                                            </div>
                                            <DrawerFooter>
                                                <Button
                                                    className='bg-[#0446DB]'

                                                    onClick={applyFilters}>Apply Filters</Button>
                                                <DrawerClose asChild>
                                                    <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                                                </DrawerClose>
                                            </DrawerFooter>

                                        </form>
                                    </DrawerContent>
                                </Drawer>
                            </div>
                        </div>




                    </div>


                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm border">
                

                <div className="sticky top-0 z-40 w-full shrink-0 dark:bg-neutral-900">
                    <div className="relative flex justify-left ">
                        <div className=" flex  overflow-x-auto  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2">
                            <div className="flex gap-1 min-w-max  px-5">
                                {status.map((st) => (
                                    <Button
                                        key={st}
                                        onClick={() => {
                                            setSelectedBulkOrders([]);
                                            setSelectedStatus(st);
                                            setPage(1);
                                        }}
                                        
                                        className={`px-5 py-2.5 rounded-sm my-2 border transition-all duration-300 font-medium text-sm tracking-wide ${selectedStatus === st
                                            ? "bg-[#0446DB] text-white "
                                            : "bg-white hover:bg-[#0446DB] hover:text-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]"
                                            }`}
                                    >
                                        {st === "rto in transit"
                                            ? "RTO In Transit"
                                            : st === "rto delivered"
                                                ? "RTO Delivered"
                                                : toCapitalizeEachWord(st)}
                                        {selectedStatus === st && ` (${orders.length})`}
                                    </Button>
                                ))}
                            </div>
                        </div>

                    
                    </div>


                    {selectedBulkOrders.length > 0 && (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        variant="outline"
        className="my-1 h-9 cursor-pointer rounded-sm border-[#0446DB] bg-[#0446DB] px-4 text-sm font-medium text-white transition hover:bg-blue-700 hover:text-white dark:border-blue-500 dark:bg-[#0446DB] dark:text-white"
      >
        Bulk Actions
      </Button>
    </AlertDialogTrigger>

    <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
      {/* ================= HEADER ================= */}
      <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
        <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
          Bulk Order Actions
        </AlertDialogTitle>

        <AlertDialogDescription className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Manage{" "}
          <span className="font-semibold text-[#0446DB] dark:text-blue-400">
            {selectedBulkOrders?.length || 0}
          </span>{" "}
          selected orders.
        </AlertDialogDescription>
      </AlertDialogHeader>

      {/* ================= CONTENT ================= */}
      <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5">
        {/* ================= VENDOR ASSIGNMENT ================= */}
        {(permissions.includes("ADMIN_FULL_ACCESS") ||
          permissions.includes("VENDOR_VIEW")) && (
          <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
            {/* Section Header */}
            <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Vendor Assignment
              </h3>

              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Find an available vendor and assign selected orders.
              </p>
            </div>

            <div className="p-4">
              {/* Get Vendor */}
              {!fetchBulkAssignmentVendor ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                      Available Vendors
                    </p>

                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                      Check eligible vendors for{" "}
                      <span className="font-semibold text-[#0446DB] dark:text-blue-400">
                        {selectedBulkOrders.length}
                      </span>{" "}
                      selected orders.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFetchBulkAssignmentVendor(true);

                      const order_ids = [
                        ...new Set(
                          selectedBulkOrders.map((o) => o.id)
                        ),
                      ];

                      fetchVendor(order_ids);
                    }}
                    className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white transition hover:bg-indigo-800"
                  >
                    Get Available Vendor
                  </button>
                </div>
              ) : vendor?.length > 0 ? (
                /* ================= VENDOR FOUND ================= */
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Select Vendor
                    </label>

                    <select
                      value={assignmentState}
                      onChange={(e) =>
                        setAssignmentState(e.target.value)
                      }
                      className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
                    >
                      <option value="">
                        Select Vendor for Bulk Assignment
                      </option>

                      {vendor.map((vendor) => (
                        <option
                          key={vendor.vendor_id}
                          value={vendor.vendor_id}
                        >
                          {vendor.vendor_id} : {vendor.vendor_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={!assignmentState}
                      onClick={async () => {
                        if (!assignmentState) {
                          toast.warn("Please select a vendor");
                          return;
                        }

                        for (const order of selectedBulkOrders) {
                          const result =
                            await assignBulkOrderVendor(
                              order.id,
                              assignmentState
                            );
                        }

                        setSelectedBulkOrders([]);
                        setBulkOrderWeight(0);
                        setFetchBulkAssignmentVendor(false);
                      }}
                      className="h-9 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500"
                    >
                      Bulk Assign
                    </button>
                  </div>
                </div>
              ) : (
                /* ================= NO VENDOR ================= */
                <div className="rounded-sm border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                    No Vendor Available
                  </p>

                  <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                    No eligible vendor was found for the selected orders.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setFetchBulkAssignmentVendor(false);
                      setAssignmentState("");
                    }}
                    className="mt-3 h-8 cursor-pointer rounded-sm border border-amber-300 bg-white px-3 text-xs font-medium text-amber-700 transition hover:bg-amber-100 dark:border-amber-500/30 dark:bg-neutral-900 dark:text-amber-400"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        

        {/* ================= SCHEDULE PICKUP ================= */}
        {
            selectedStatus=='booked' &&(

                <div className="overflow-hidden rounded-sm border border-emerald-200 dark:border-emerald-500/20">
                {/* Header */}
                <div className="border-b border-emerald-100 bg-emerald-50/70 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Schedule Self Pickup
                    </h3>

                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Generate a pickup request for all currently selected orders.
                    </p>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        Schedule Selected Orders
                    </p>

                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        <span className="font-semibold text-[#0446DB] dark:text-blue-400">
                        {selectedBulkOrders?.length || 0}
                        </span>{" "}
                        selected orders will be scheduled for pickup.
                    </p>
                    </div>

                    <Button
                    type="button"
                    disabled={!selectedBulkOrders?.length || loading}
                    onClick={async () => {
                        if (!selectedBulkOrders?.length) {
                        toast.warn("Please select at least one order");
                        return;
                        }

                        const order_ids = [
                        ...new Set(
                            selectedBulkOrders.map((order) => order.id)
                        ),
                        ];

                        await generateBulkPickupRequest(order_ids);
                    }}
                    className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-emerald-600 px-5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                    {loading ? (
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Scheduling...
                        </>
                    ) : (
                        "Schedule Self Pickup"
                    )}
                    </Button>
                </div>
                </div>
            )
        }


        {/* ================= CLEAR SELECTION ================= */}
        <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
              Clear Selection
            </p>

            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              Remove all currently selected orders and reset bulk actions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedBulkOrders([]);
              setBulkOrderWeight(0);
              setFetchBulkAssignmentVendor(false);
              setcanceledBulkOrder(false);
            }}
            className="h-9 cursor-pointer whitespace-nowrap rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            Clear Selected Orders
          </button>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 my-0 dark:border-neutral-800 dark:bg-neutral-950/30">
        <AlertDialogCancel
          onClick={() => {
            setFetchBulkAssignmentVendor(false);
            setAssignmentState("");
            clearAllState()
          }}
          className="cursor-pointer rounded-sm"
        >
          Close
        </AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
                     )}
                </div>


                <div className="min-h-0 flex-1 overflow-auto overscroll-contain [&>div]:!overflow-visible">
                <Table className="min-w-max border-separate border-spacing-0">
                    <TableHeader className="[&_th]:!sticky [&_th]:!top-0 [&_th]:!z-30 [&_th]:!bg-white dark:[&_th]:!bg-neutral-900 [&_th]:shadow-[0_1px_0_0_#e5e7eb]">
                        <TableRow>
                            {
                                (permissions.includes('ADMIN_FULL_ACCESS') || permissions.includes('VENDOR_VIEW')) && (
                                    selectedStatus != "All" ? (
                                        <TableHead>

                                            <div>
                                                <span>
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                                                        checked={
                                                            selectedBulkOrders.length === orders.filter((o) => o.tpc_awb_number === null).length

                                                        }
                                                        onChange={toggleSelectAll}
                                                    />
                                                </span>
                                            </div>
                                        </TableHead>
                                    ) : (
                                        <TableHead className="px-6 py-4 text-center">
                                            -
                                        </TableHead>
                                    )
                                )
                            }
                            <TableHead>ORDER ID</TableHead>
                            <TableHead>CONSIGNEE ADDRESS</TableHead>
                            <TableHead>PACKAGE DETAILS</TableHead>
                            <TableHead>ASSIGNMENT/RIDER</TableHead>
                            <TableHead>MAPPED/VENDOR</TableHead>
                            <TableHead>STATUS</TableHead>
                            <TableHead>ELIGIBLE VENDORS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center py-10">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                                    <p className="mt-2">Loading orders...</p>
                                </TableCell>
                            </TableRow>
                        ) : orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center py-10">
                                    No orders found
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => {
                                let isSelected;

                                isSelected = selectedBulkOrders.some(
                                    (o) => o.id === order.id
                                );

                                return (
                                    <TableRow key={order.id}>
                                        {
                                            (permissions.includes('ADMIN_FULL_ACCESS') || permissions.includes('VENDOR_VIEW')) && (

                                                <TableCell>
                                                    {

                                                        ((order.tpc_awb_number == null) && order.tpc_awb_number == null) ? (
                                                            selectedStatus != "All" ? (
                                                                <div className="px-6 py-4 text-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isSelected}

                                                                        onChange={(e) => {
                                                                            const isChecked = e.target.checked;


                                                                            if (isChecked) {
                                                                                setSelectedBulkOrders((prev) => {
                                                                                    const updated = [...prev, order];

                                                                                    const order_ids = updated.map((o) => o.id);
                                                                                    if(selectedStatus !=='booked'){

                                                                                        fetchVendor(order_ids); 
                                                                                    }

                                                                                    return updated;
                                                                                });

                                                                                setBulkOrderWeight(
                                                                                    (prev) => Number(prev) + Number(order.total_weight)
                                                                                );
                                                                            } else {
                                                                                setSelectedBulkOrders((prev) => {
                                                                                    const updated = prev.filter((o) => o.id !== order.id);

                                                                                    const order_ids = updated.map((o) => o.id);
                                                                                    fetchVendor(order_ids);

                                                                                    return updated;
                                                                                });

                                                                                setBulkOrderWeight(
                                                                                    (prev) => Number(prev) - Number(order.total_weight) // ✅ fixed bug
                                                                                );
                                                                            }

                                                                        }}
                                                                        className="w-4 h-4 text-[#0446db] border-gray-300 rounded"
                                                                    />

                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <span className="px-6 py-4 text-center">
                                                                        -
                                                                    </span>
                                                                </>
                                                            )
                                                        ) : (
                                                            <>
                                                                <span className="px-6 py-4 text-center">
                                                                    -
                                                                </span>
                                                            </>
                                                        )}
                                                </TableCell>
                                            )
                                        }

                                        <TableCell>
                                            <div>
                                                <p className="text-l text-gray-800 flex items-center">
                                                    <a
                                                        href={`${frontEndURL}/track-order?awb_number=${order.awb_number}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="underline text-blue-700 hover:text-blue-500"
                                                    >
                                                        {order.awb_number}
                                                    </a>
                                                    <button
                                                        className="pl-2 text-lg text-gray-600 hover:text-[#0446db] transition"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(
                                                                order.awb_number
                                                            );
                                                            setCopySuccess(order.awb_number);
                                                            setTimeout(() => {
                                                                setCopySuccess(null);
                                                            }, 2000);
                                                        }}
                                                    >
                                                        {copySuccess === order.awb_number ? (
                                                            <CiCircleCheck />
                                                        ) : (
                                                            <FaRegCopy />
                                                        )}
                                                    </button>

                                                    <Dialog className='w-5xl'>

                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" className="text-xs font-medium  text-red-600  inline-block cursor-pointer ">
                                                                <span >
                                                                    <TbFileInfo />
                                                                </span>
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-4xl">
                                                            <DialogHeader>
                                                                <DialogTitle>Order Details</DialogTitle>

                                                            </DialogHeader>

                                                            <div className="bg-white p-6  space-y-3 text-gray-700">
                                                                {/* Basic Info */}
                                                                <h3 className="font-semibold text-[#0446db] mb-2">
                                                                    Basic Details
                                                                </h3>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <strong>Order ID:</strong> {order.merchant_order_id}
                                                                        <button
                                                                            className="pl-2 text-lg text-gray-600 hover:text-[#0446db] transition"
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText(
                                                                                    order.merchant_order_id
                                                                                );
                                                                                setCopySuccess(order.merchant_order_id);
                                                                                setTimeout(() => {
                                                                                    setCopySuccess(null);
                                                                                }, 2000);
                                                                            }}
                                                                        >
                                                                            {copySuccess === order.merchant_order_id ? (
                                                                                <CiCircleCheck />
                                                                            ) : (
                                                                                <FaRegCopy />
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                    <div>
                                                                        <strong>AWB No:</strong> {order.awb_number}
                                                                        <button
                                                                            className="pl-2 text-lg text-gray-600 hover:text-[#0446db] transition"
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText(order.awb_number);
                                                                                setCopySuccess(order.awb_number);
                                                                                setTimeout(() => {
                                                                                    setCopySuccess(null);
                                                                                }, 2000);
                                                                            }}
                                                                        >
                                                                            {copySuccess === order.awb_number ? (
                                                                                <CiCircleCheck />
                                                                            ) : (
                                                                                <FaRegCopy />
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                    <div>
                                                                        <strong>Order Type:</strong>{" "}
                                                                        {order.order_type === "cod" ? "COD" : "Prepaid"}
                                                                    </div>
                                                                    <div>
                                                                        <strong>Order Specific:</strong> {order.order_specific}
                                                                    </div>
                                                                    <div>
                                                                        <strong>Order Status:</strong>{" "}
                                                                        {toCapitalizeEachWord(order.status)}
                                                                    </div>
                                                                    <div>
                                                                        <strong>Total Amount:</strong> ₹
                                                                        {Number(order.total_amount).toLocaleString()}
                                                                    </div>
                                                                    <div>
                                                                        <strong>Order Weight:</strong>{" "}
                                                                        {Number(order.total_weight).toLocaleString()}g
                                                                    </div>
                                                                    <div>
                                                                        <strong>Number of Packets:</strong>{" "}
                                                                        {order.number_of_boxes}
                                                                    </div>
                                                                </div>

                                                                {/* Document Info */}
                                                                <div className="pt-4 border-t">
                                                                    <h3 className="font-semibold text-[#0446db] mb-2">
                                                                        Delivery Details
                                                                    </h3>
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <strong>Customer Name:</strong>{" "}
                                                                            {order.delivery_contact_name}
                                                                        </div>
                                                                        {/* <div>
                          <strong>Customer Contact No:</strong>{" "}
                          {order.delivery_phone}
                        </div> */}
                                                                        <div>
                                                                            <strong>Address:</strong>{" "}
                                                                            {order.delivery_address_line}
                                                                        </div>
                                                                        <div>
                                                                            <strong>City:</strong>{" "}
                                                                            {`${order.delivery_city}, ${order.delivery_state} - ${order.delivery_pincode}` ||
                                                                                "N/A"}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Bank Info */}
                                                                <div className="pt-4 border-t">
                                                                    <h3 className="font-semibold text-[#0446db] mb-2">
                                                                        Pickup Details
                                                                    </h3>
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <strong>Name:</strong>{" "}
                                                                            {order.pickup_contact_name || "N/A"}
                                                                        </div>
                                                                        <div>
                                                                            <strong>Pickup Phone No:</strong>{" "}
                                                                            {`${order.pickup_phone}` || "N/A"}
                                                                        </div>
                                                                        <div>
                                                                            <strong>Address:</strong>{" "}
                                                                            {order.pickup_address_line || "N/A"}
                                                                        </div>
                                                                        <div>
                                                                            <strong>City:</strong>{" "}
                                                                            {`${order.pickup_city}, ${order.pickup_state} - ${order.pickup_pincode}` ||
                                                                                "N/A"}
                                                                        </div>
                                                                    </div>
                                                                </div>



                                                            </div>

                                                            <DialogFooter>
                                                                <DialogClose asChild>

                                                                    <button
                                                                        onClick={() => {
                                                                            navigate(`/admin/order-history?awb=${order?.awb_number}`);
                                                                        }}
                                                                        className="bg-green-500 mr-2 text-white px-4 py-2 rounded hover:bg-indigo-800 transition"
                                                                    >
                                                                        Get History
                                                                    </button>
                                                                </DialogClose>
                                                                <DialogClose asChild>

                                                                    <Button variant="outline">Cancel</Button>
                                                                </DialogClose>

                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>

                                                </p>

                                                <p className="text-s text-gray-500 dark:text-white">
                                                    {new Date(order.created_at).toLocaleString(
                                                        "en-IN",
                                                        {
                                                            timeZone: "Asia/Kolkata",
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        }
                                                    )}
                                                </p>

                                                <p className="text-s text-gray-400 dark:text-white">
                                                    Merchant ID: {order.merchant_id}
                                                    <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full border border-dashed px-2.5 py-1 text-xs font-semibold ${
                                                        order.rider_preference === "daakit"
                                                        ? "border-blue-500 bg-blue-50/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                                                        : "border-emerald-500 bg-emerald-50/50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                                    }`}
                                                    >
                                                    {order.rider_preference === "daakit" ? "DDN" : "BYOB"}
                                                    </span>
                                                </p>
                                                <p className="text-s text-gray-400 dark:text-white">
                                                    Merchant Order ID:{" "}
                                                    {order.merchant_order_id?.length <= 20
                                                        ? order.merchant_order_id
                                                        : `${order.merchant_order_id.slice(
                                                            0,
                                                            20
                                                        )}...`}
                                                    <button
                                                        className="pl-2 text-lg text-gray-600 dark:text-white hover:text-[#0446db] transition"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(
                                                                order.merchant_order_id
                                                            );
                                                            setCopySuccess(order.merchant_order_id);
                                                            setTimeout(() => {
                                                                setCopySuccess(null);
                                                            }, 2000);
                                                        }}
                                                    >
                                                        {copySuccess === order.merchant_order_id ? (
                                                            <CiCircleCheck />
                                                        ) : (
                                                            <FaRegCopy />
                                                        )}
                                                    </button>
                                                    {/* <span className="bg-[#0446db] px-2 text-white rounded">{order.rider_preference === 'daakit' ? "Daakit" : "Self"}</span> */}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium text-gray-800 dark:text-white">
                                                {order.delivery_contact_name}
                                            </p>
                                            <HoverCard>
                                                <HoverCardTrigger>{order.delivery_address_line.slice(0, 30)}...</HoverCardTrigger>
                                                <HoverCardContent
                                                    className='bg-[#0446db] text-white'
                                                >
                                                    {order.delivery_city}, {order.delivery_state} -{" "}
                                                    {order.delivery_pincode}
                                                </HoverCardContent>
                                            </HoverCard>
                                            <p className="text-xs text-gray-500 dark:text-white">
                                                {order.delivery_city}, {order.delivery_state} -{" "}
                                                {order.delivery_pincode}
                                            </p>

                                            <p className="text-xs text-gray-400">
                                                {order.delivery_country}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <p>

                                                <span className=" whitespace-nowrap dark:text-white">
                                                    EDD:{" "}
                                                    {order.EDD}
                                                </span>

                                            </p>
                                            <p>
                                                <span className="font-medium text-gray-800 dark:text-white">
                                                    Weight:
                                                </span>{" "}
                                                <span className="dark:text-white">{Number(order.total_weight).toLocaleString()}g</span>

                                                <span
                                                    className={`ml-2 px-2 py-0.5  rounded-full text-sm font-semibold shadow-sm ${order.order_specific?.slice(0, 3) ===
                                                        "NDD"
                                                        ? "text-green-800 bg-green-100 border border-green-300"
                                                        : order.order_specific?.slice(0, 3) ===
                                                            "SDD"
                                                            ? "text-yellow-800 bg-yellow-100 border border-yellow-300"
                                                            : "text-red-800 bg-red-100 border border-red-300 animate-blink"
                                                        }`}
                                                >
                                                    {order.order_specific?.slice(0, 3) === "NDD"
                                                        ? "NDD"
                                                        : order.order_specific?.slice(0, 3) ===
                                                            "SDD"
                                                            ? "SDD"
                                                            : order.order_specific?.slice(0, 6) ===
                                                                "Turant"
                                                                ? "Turant"
                                                                : order.order_specific}
                                                </span>

                                            </p>
                                            <p>
                                                <span className="font-medium dark:text-white text-gray-800">
                                                    Dimensions:
                                                </span>{" "}
                                                <span className=" dark:text-white">
                                                    {order.package_length}x{order.package_breadth}x
                                                    {order.package_height}
                                                </span>
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer"
                                            >
                                                Not Assigned
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <>
                                                {!(
                                                    isOpenIndividualVendorAssignmnet === order.id
                                                ) ? (

                                                    <span
                                                        onClick={() => {
                                                            if (
                                                                !permissions.includes('VENDOR_VIEW') &&
                                                                !permissions.includes('ADMIN_FULL_ACCESS')
                                                            ) {
                                                                console.log(permissions)
                                                                return;
                                                            }
                                                            if (order.tpc_awb_number !== null) {
                                                                return
                                                            }
                                                            fetchVendor(order.id);
                                                            if (order.rider_preference === 'daakit') {

                                                                setIsOpenIndividualVendorAssignmnet(order.id);

                                                            }
                                                        }}
                                                        className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer">
                                                        Not Mapped
                                                    </span>
                                                ) : (
                                                    <form
                                                        onSubmit={(e) => {
                                                            e.preventDefault();
                                                            const selectedVendor = assignmentState;
                                                            if (!selectedVendor) {
                                                                toast.warn("Please select a vendor");
                                                                return;
                                                            }
                                                            assignVendor(order.id, selectedVendor);

                                                        }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <select
                                                            value={assignmentState}
                                                            onChange={(e) =>
                                                                setAssignmentState(e.target.value)
                                                            }
                                                            className="border px-2 py-1 rounded-md"
                                                            required
                                                        >
                                                            <option value="" disabled>
                                                                Select Vendor
                                                            </option>
                                                            {vendor?.map((vendor) => (
                                                                <option
                                                                    key={vendor.vendor_id}
                                                                    value={vendor.vendor_id}
                                                                >
                                                                    {vendor.vendor_id} :{" "}
                                                                    {vendor.vendor_name}

                                                                </option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            type="submit"
                                                            className="bg-[#0446db] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                                        >
                                                            Assign
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="text-xs text-gray-500 hover:underline"
                                                            onClick={() =>
                                                                setIsOpenIndividualVendorAssignmnet("")
                                                            }
                                                        >
                                                            Close
                                                        </button>
                                                    </form>
                                                )}
                                            </>
                                        </TableCell>
                                        <TableCell>
                                            <span

                                                className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 mb-2 inline-block cursor-pointer"
                                            >
                                                {order?.status
                                                    ?.toLowerCase()
                                                    ?.split(" ")
                                                    ?.map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                    ?.join(" ")
                                                }
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                         
                               
                                  <td className="max-w-[220px] py-2">
                                {order?.tpc_awb_number != null ? (
                                  <span className="block text-left text-gray-400">
                                    -
                                  </span>
                                ) : (
                                  (() => {
                                    const vendors = String(
                                      order?.eligible_vendors || "",
                                    )
                                      .split(",")
                                      .map((v) => v.trim())
                                      .filter(Boolean);

                                    if (!vendors.length) {
                                      return (
                                        <span className="block text-center text-gray-400">
                                          -
                                        </span>
                                      );
                                    }

                                    return (
                                      <HoverCard
                                        openDelay={150}
                                        closeDelay={150}
                                      >
                                        <HoverCardTrigger asChild>
                                          <div className="max-w-[200px] cursor-pointer">
                                            <div className="flex items-center gap-2 rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-orange-700 transition-all duration-200 hover:border-orange-400 hover:bg-orange-100 hover:shadow-sm dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-300">
                                              <Building2 className="h-4 w-4 shrink-0" />

                                              <span className="min-w-0 flex-1 truncate text-xs font-medium">
                                                {vendors.join(" | ")}
                                              </span>

                                              <span className="shrink-0 rounded-full bg-orange-200 px-1.5 py-0.5 text-[10px] font-semibold dark:bg-orange-900">
                                                {vendors.length}
                                              </span>
                                            </div>
                                          </div>
                                        </HoverCardTrigger>

                                        <HoverCardContent
                                          side="top"
                                          align="start"
                                          sideOffset={8}
                                          className="z-50 w-[320px] rounded-xl border border-gray-200 bg-white p-0 shadow-xl dark:border-gray-700 dark:bg-gray-900"
                                        >
                                          {/* Header */}
                                          <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-2">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950">
                                                  <Users className="h-4 w-4" />
                                                </div>

                                                <div>
                                                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    Eligible Vendors
                                                  </h4>
                                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Available vendor list
                                                  </p>
                                                </div>
                                              </div>

                                              <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                                                {vendors.length} Total
                                              </span>
                                            </div>
                                          </div>

                                          {/* Vendor List */}
                                          <div className="max-h-[250px] space-y-1 overflow-y-auto p-2">
                                            {vendors.map((vendor, index) => (
                                              <div
                                                key={`${vendor}-${index}`}
                                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                                              >
                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                                  {index + 1}
                                                </span>

                                                <span className="min-w-0 flex-1 break-words text-sm font-medium text-gray-700 dark:text-gray-200">
                                                  {vendor}
                                                </span>

                                                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                                              </div>
                                            ))}
                                          </div>

                                          {/* Footer */}
                                          <div className="border-t border-gray-100 px-4 py-2.5 dark:border-gray-800">
                                            <p className="text-center text-xs text-gray-400">
                                              {vendors.length} eligible vendor
                                              {vendors.length !== 1
                                                ? "s"
                                                : ""}{" "}
                                              found
                                            </p>
                                          </div>
                                        </HoverCardContent>
                                      </HoverCard>
                                    );
                                  })()
                                )}
                                  </td>
                                
                            
                                        </TableCell>

                                    </TableRow>
                                )
                            }


                            )
                        )}
                    </TableBody>
                </Table>
                </div>
            </div>

            {totalPages > 1 && (
                <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t bg-white px-3 py-3 dark:bg-neutral-900">
                    <div className="text-sm text-gray-600">
                        Page {page} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label>Rows per page:</Label>
                        <select
                            className="border rounded-md px-2 py-1"
                            value={limit}
                            onChange={(e) => {
                                setLimit(Number(e.target.value));
                                setPage(1);
                            }}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
            )
         }
        </>
    );
}

export default AssignmentConsole;