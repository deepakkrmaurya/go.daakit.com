

// import axios from 'axios';
// import React, { useEffect, useState, useRef } from 'react';
// import toast from 'react-hot-toast';
// import {
//     Combobox,
//     ComboboxContent,
//     ComboboxEmpty,
//     ComboboxInput,
//     ComboboxItem,
//     ComboboxList,
// } from "@/components/ui/combobox"
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";

// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectLabel,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
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
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { FaFilter } from 'react-icons/fa';
// import { Building2, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Users } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaRegCopy } from "react-icons/fa";
// import { TbFileInfo } from "react-icons/tb";
// import { CiCircleCheck } from "react-icons/ci";
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
// import AxiosInstance from '../../../Helper/axiosInstance';
// import CustomButton from '../../common/CustomButton';

// const baseURL = import.meta.env.VITE_BASE_URL;
// const frontEndURL = import.meta.env.VITE_FRONTEND_URL;

// function BookOrders() {
//     const [open, setOpen] = useState(false);
//     const [endopen, setEndOpen] = useState(false);
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
//     const [drawerOpen, setDrawerOpen] = useState(false);
//     const [advanceFilters, setAdvanceFilters] = useState({
//         startDate: "",
//         endDate: "",
//         awbNumber: "",
//         vendor_id: "",
//         order_specific: "",
//         pincode: ""
//     });
//     const clearAllState = () => {
//   // Clear selected orders
//   setSelectedBulkOrders([]);

//   // Reset bulk order weight
//   setBulkOrderWeight(0);

//   // Reset vendor assignment
//   setFetchBulkAssignmentVendor(false);
//   setVendor([]);
//   setAssignmentState("");

//   // Reset bulk action
//   setcanceledBulkOrder(false);

//   // Close individual vendor assignment
//   setIsOpenIndividualVendorAssignmnet("");
// };
//     const [totalOrders, setTotalOrders] = useState(0);
//     const [selectedStatus, setSelectedStatus] = useState("All");
//     const [vendorList, setVendorList] = useState([]);
//     const [bulkOrderWeight, setBulkOrderWeight] = useState(0);
//     const [canceledBulkOrder, setcanceledBulkOrder] = useState(false);

//     const isFirstRender = useRef(true);
//     const navigate = useNavigate();

//     const status = [
//         "All",
//         "booked",
//         "pending pickup",
//         "picked",
//     ];

//     function toCapitalizeEachWord(str) {
//         if (!str) return "";
//         return str
//             .split(" ")
//             .map((word) => {
//                 if (!word) return "";
//                 return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//             })
//             .join(" ");
//     }

//     const fetchOrders = async () => {
//         setLoading(true);
//         try {
//             const res = await axios.get(`${baseURL}/api/admin/getBookedEligibleOrders`, {
//                 params: {
//                     page,
//                     limit,
//                     vendor_id: advanceFilters.vendor_id,
//                     start_date: advanceFilters.startDate,
//                     end_date: advanceFilters.endDate,
//                     awb_number: advanceFilters.awbNumber,
//                     order_specific: advanceFilters.order_specific,
//                     pincode: advanceFilters.pincode,
//                     status: selectedStatus === "All" ? "" : selectedStatus
//                 },
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });
//             setOrders(res?.data?.data || []);
//             setTotalOrders(res?.data?.data?.length || 0);
//             setTotalPages(res.data?.pagination?.totalPages || 1);
//         } catch (err) {
//             setOrders([]);
//             toast.error(err.response?.data?.message || err.message || "An error occurred while fetching orders.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getAllVendors = async () => {
//         try {
//             const res = await AxiosInstance.get('/api/admin/getAllVendors',{
//                 params:{
//                     limit : 1000
//                 }
//             })
            
//             setVendorList(res.data.data || []);
//         } catch (err) {
//             setVendorList([]);
//             toast.error(err.response?.data?.message || err.message || "An error occurred while fetching vendors.");
//         }
//     };

//     const fetchVendor = async (order_ids) => {
//         if (order_ids.length === 0) {
//             setVendor([]);
//             return;
//         }

//         try {
//             const res = await axios.get(`${baseURL}/api/admin/getEligibleVendorsByOrders?order_id=${order_ids}`, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 }
//             });
//             setVendor(res.data.data || []);
//             toast.success(res?.data?.message)
//             // if (res.data.data.length === 0) {
//             //     setSelectedBulkOrders([]);
//             //     setBulkOrderWeight(0);
//             //     setFetchBulkAssignmentVendor(false);
//             // }
//             fetchOrders()
//         } catch (err) {
//             setVendor([]);
//             toast.error(err.response?.data?.message || err.message || "Failed to load vendors");
//         }
//     };

//     const assignVendor = async (orderId, vendorId) => {

        
//         setLoading(true);
//         try {
//             const res = await axios.post(
//                 `${baseURL}/api/admin/assignOrderToVendor`,
//                 { order_id: orderId, vendor_id: vendorId },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                 }
//             );
//             toast.success(res.data.message || "Vendor assigned successfully");
//             setAssignmentState('')
//             fetchOrders();
//             setIsOpenIndividualVendorAssignmnet("");
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to assign vendor");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const assignBulkOrderVendor = async (orderIds, vendorId) => {
//         setLoading(true);
//         try {
//             const res  = await AxiosInstance.post(`/api/admin/bulkAssignOrdersToVendor`,
//                 {
//                     order_ids: orderIds,
//                     vendor_id: vendorId,
//                 }
//             )
           
//             toast.success("Vendor assigned successfully");
//             fetchOrders();
//             setAssignmentState("");
//             setSelectedBulkOrders([]);
//             setBulkOrderWeight(0);
//             setFetchBulkAssignmentVendor(false);
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to assign vendor");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const generateBulkPickupRequest = async(order_ids)=>{
//         try {
//              const res = await AxiosInstance.post(`/api/admin/generateBulkPickupRequest`,{
//           order_ids:order_ids
//         })
//         fetchOrders()
//         toast.success(res?.data?.message)
//         clearAllState()
//         } catch (error) {
            
//         }
//     }

//     const toggleSelectAll = () => {
//         const unassignedOrders = orders.filter((o) => o.tpc_awb_number === null);
//         if (selectedBulkOrders.length === unassignedOrders.length) {
//             setSelectedBulkOrders([]);
//             setBulkOrderWeight(0);
//             setVendor([]);
//             setFetchBulkAssignmentVendor(false);
//         } else {
//             setSelectedBulkOrders(unassignedOrders);
//             const totalWeight = unassignedOrders.reduce(
//                 (acc, order) => acc + Number(order.total_weight),
//                 0
//             );
//             setBulkOrderWeight(totalWeight);
//             if (unassignedOrders.length > 0) {
//                 const order_ids = unassignedOrders.map((o) => o.id);
//                 fetchVendor(order_ids);
//             }
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

//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setAdvanceFilters(prev => ({ ...prev, [name]: value }));
//     };

//     const applyFilters = (e) => {
//         e.preventDefault();
//         setPage(1);
//         fetchOrders();
//         setDrawerOpen(false);
//     };

//     const clearFilters = () => {
//         const emptyFilters = {
//             startDate: "",
//             endDate: "",
//             awbNumber: "",
//             vendor_id: "",
//             order_specific: "",
//             pincode: ""
//         };
//         setAdvanceFilters(emptyFilters);
//         setPage(1);
//         setSelectedStatus("All");
//         setLastOneMonth()
//         fetchOrders();

//     };

//     const handlePageChange = (newPage) => {
//         if (newPage >= 1 && newPage <= totalPages) {
//             setPage(newPage);
//         }
//     };

//     const formatDate = (date) => {
//         return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
//     };

//     const setLastOneMonth = () => {
//         const endDate = new Date();
//         const startDate = new Date();

//         startDate.setMonth(startDate.getMonth() - 1);

//         setAdvanceFilters((prev) => ({
//             ...prev,
//             startDate: formatDate(startDate),
//             endDate: formatDate(endDate),
//         }));
//     };

//     // Initial load - runs only once on mount
//     useEffect(() => {
//         setLastOneMonth()
//         getAllVendors();
//         fetchOrders();
//     }, []);

//     // Handle pagination, limit, and status changes
//     useEffect(() => {
//         if (isFirstRender.current) {
//             isFirstRender.current = false;
//             return;
//         }
//         fetchOrders();
//     }, [page, limit, selectedStatus]);

//     // Handle filter changes
//     useEffect(() => {
//         if (isFirstRender.current) {
//             return;
//         }
//         // Debounce filter changes to avoid too many API calls
//         fetchOrders();

//     }, []);

//     return (
//         <div className="">
//             <div className="sticky top-0 left-0 z-10  dark:bg-neutral-900/50 py-2  ">
//                 <div className="mx-auto">
//                     <div className="flex flex-col space-y-4">
//                         <div className="flex items-center justify-between">
//                             <h1 className="text-xl font-bold dark:text-white">Assignment Console</h1>
//                             <div className="flex items-center gap-2">
//                                 <Drawer
//                                     open={drawerOpen}
//                                     onOpenChange={setDrawerOpen}
//                                     direction="right">
//                                     <DrawerTrigger asChild>
                                        
//                                         <CustomButton
//                                         variant="outline"
//                                         size="md"
//                                         icon={FaFilter}
//                                         className="rounded-sm font-medium shadow "
//                                         >
//                                         Filter
//                                         </CustomButton>

//                                     </DrawerTrigger>
//                                     <DrawerContent>
//                                         <form
//                                             onSubmit={(e) => e.preventDefault()}
//                                         >
//                                             <DrawerHeader>
//                                                 <DrawerTitle>Filter Orders</DrawerTitle>
//                                             </DrawerHeader>
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
//                                                                     selected={advanceFilters.startDate ? new Date(advanceFilters.startDate) : undefined}
//                                                                     defaultMonth={advanceFilters.startDate ? new Date(advanceFilters.startDate) : undefined}
//                                                                     captionLayout="dropdown"
//                                                                     onSelect={(date) => {
//                                                                         if (date) {
//                                                                             const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)
//                                                                                 .toString()
//                                                                                 .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
//                                                                             setAdvanceFilters({
//                                                                                 ...advanceFilters,
//                                                                                 startDate: formattedDate
//                                                                             });
//                                                                             setOpen(false);
//                                                                         }
//                                                                     }}
//                                                                 />
//                                                             </PopoverContent>
//                                                         </Popover>
//                                                     </Field>

//                                                     <Field className="mx-auto w-full">
//                                                         <FieldLabel htmlFor="end-date">End Date</FieldLabel>
//                                                         <Popover open={endopen} onOpenChange={setEndOpen}>
//                                                             <PopoverTrigger asChild>
//                                                                 <Button
//                                                                     variant="outline"
//                                                                     id="end-date"
//                                                                     className="justify-start w-full font-normal"
//                                                                 >
//                                                                     {advanceFilters.endDate ? formatToDMY(advanceFilters.endDate) : "Select date"}
//                                                                 </Button>
//                                                             </PopoverTrigger>
//                                                             <PopoverContent className="w-auto overflow-hidden p-0" align="start">
//                                                                 <Calendar
//                                                                     mode="single"
//                                                                     selected={advanceFilters.endDate ? new Date(advanceFilters.endDate) : undefined}
//                                                                     defaultMonth={advanceFilters.endDate ? new Date(advanceFilters.endDate) : undefined}
//                                                                     captionLayout="dropdown"
//                                                                     onSelect={(date) => {
//                                                                         if (date) {
//                                                                             const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)
//                                                                                 .toString()
//                                                                                 .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
//                                                                             setAdvanceFilters({
//                                                                                 ...advanceFilters,
//                                                                                 endDate: formattedDate
//                                                                             });
//                                                                             setEndOpen(false);
//                                                                         }
//                                                                     }}
//                                                                 />
//                                                             </PopoverContent>
//                                                         </Popover>
//                                                     </Field>

//                                                     <div>
//                                                         <label className="block text-sm font-bold dark:text-white text-gray-600 mb-1">
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
//                                                             className="w-full border dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                                         >
//                                                             <option value="">All orders</option>
//                                                             <option value="Turant">Turant</option>
//                                                             <option value="SDD">Same Day Delivery</option>
//                                                             <option value="NDD">Next Day Delivery</option>
//                                                         </select>
//                                                     </div>

//                                                     <div>
//                                                         <label className="block text-sm font-bold dark:text-white text-gray-600 mb-1">
//                                                             Pincode
//                                                         </label>
//                                                         <input
//                                                             type="text"
//                                                             value={advanceFilters.pincode}
//                                                             onChange={(e) =>
//                                                                 setAdvanceFilters((prev) => ({
//                                                                     ...prev,
//                                                                     pincode: e.target.value,
//                                                                 }))
//                                                             }
//                                                             placeholder="Enter Pincode"
//                                                             className="w-full border dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                                         />
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

//                                                         <select name="" id=""
//                                                          className=' w-full border-gray-200 border py-2 px-2 rounded-sm'
//                                                         onChange={(value) => {
                                                           
//                                                                 setAdvanceFilters((prev) => ({
//                                                                     ...prev,
//                                                                     vendor_id: value.target.value,
//                                                                 }));
//                                                             }}
//                                                         >
//                                                             <option value="">Select a vendo</option>
//                                                             {
//                                                                 vendorList?.map((v)=>{
//                                                                     return (
//                                                                       <option value={v?.id}>{v.id}:{v?.vendor_name}</option>
//                                                                     ) 
//                                                                 })
//                                                             }
//                                                         </select>
                                                        
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <DrawerFooter>
//                                                 <Button className='bg-[#0446DB]' onClick={applyFilters}>Apply Filters</Button>
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

//             <div className="flex h-[calc(100dvh-145px)] min-h-[360px] flex-col overflow-hidden rounded-sm border border-gray-200 dark:border-neutral-800">
                

//                 <div className="w-full shrink-0 rounded-sm dark:bg-neutral-800 left-0 px-4 z-40">
//                     <div className="relative flex justify-left">
//                         <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2">
//                             <div className="flex gap-1 min-w-max  mt-3">
//                                 {status.map((st) => (
//                                     <Button
//                                         key={st}
//                                         onClick={() => {
//                                             setSelectedBulkOrders([]);
//                                             setSelectedStatus(st);
//                                             setPage(1);
//                                         }}
//                                         className={`px-5 py-2.5 cursor-pointer rounded-sm my-2 border transition-all duration-300 font-medium text-sm tracking-wide ${selectedStatus === st
//                                             ? "bg-[#0446DB]  hover:bg-[#0446DB] text-white"
//                                             : "bg-white hover:bg-[#0446DB] hover:text-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]"
//                                             }`}
//                                     >
//                                         {st === "rto in transit"
//                                             ? "RTO In Transit"
//                                             : st === "rto delivered"
//                                                 ? "RTO Delivered"
//                                                 : toCapitalizeEachWord(st)}
//                                         {selectedStatus === st && ` (${totalOrders})`}
//                                     </Button>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 {selectedBulkOrders.length > 0 && (
//                     <>
//                     <AlertDialog>
//                             {/* ================= TRIGGER ================= */}
//                             <AlertDialogTrigger
                            
//                             >
//                                 <Button
//                                 variant="outline"
//                                 className="h-7 cursor-pointer  rounded-sm border-[#0446DB] bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-[#0339B5] hover:text-white dark:border-blue-500 dark:bg-blue-600 dark:text-white"
//                                 >
//                                Action
//                                 </Button>
//                             </AlertDialogTrigger>

//                             {/* ================= POPUP ================= */}
//                             <AlertDialogContent className="!max-w-lg overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
//                             {/* ================= HEADER ================= */}
//                             <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 text-left dark:border-neutral-800">
//                                 <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
//                                 Bulk Order Actions
//                                 </AlertDialogTitle>

//                                 <AlertDialogDescription className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
//                                 Manage{" "}
//                                 <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                     {selectedBulkOrders?.length || 0}
//                                 </span>{" "}
//                                 selected orders.
//                                 </AlertDialogDescription>
//                             </AlertDialogHeader>

//                             {/* ================= BODY ================= */}
//                             <div className="max-h-[75vh] overflow-y-auto px-5 py-5">
//                                 {/* =====================================================
//                                     MAP VENDOR
//                                 ===================================================== */}
//                                 <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
//                                 {/* SECTION HEADER */}
//                                 <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
//                                     <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                     Map Vendor
//                                     </h3>

//                                     <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                     Find an available vendor and map the selected orders.
//                                     </p>
//                                 </div>

//                                 {/* SECTION BODY */}
//                                 <div className="p-4">
//                                     {!fetchBulkAssignmentVendor || vendor?.length === 0 ? (
//                                     /* ================= FETCH VENDOR ================= */
//                                     <Button
//                                         type="button"
//                                         onClick={() => {
//                                         setFetchBulkAssignmentVendor(true);

//                                         const order_ids = [
//                                             ...new Set(
//                                             selectedBulkOrders.map((o) => o.id)
//                                             ),
//                                         ];

//                                         fetchVendor(order_ids);
//                                         }}
//                                         className="h-10 w-full cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition-colors hover:bg-[#0339B5] sm:w-auto"
//                                     >
//                                         Get Available Vendor
//                                     </Button>
//                                     ) : (
//                                     vendor?.length > 0 && (
//                                         <div className="flex flex-col gap-3">
//                                         {/* ================= VENDOR SELECT ================= */}
//                                         <div>
//                                             <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                                             Select Vendor
//                                             </label>

//                                             <select
//                                             className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
//                                             value={assignmentState}
//                                             onChange={(e) =>
//                                                 setAssignmentState(e.target.value)
//                                             }
//                                             >
//                                             <option value="">
//                                                 Select Vendor for Bulk Assignment
//                                             </option>

//                                             {vendor.map((vendorItem) => (
//                                                 <option
//                                                 key={vendorItem.vendor_id}
//                                                 value={vendorItem.vendor_id}
//                                                 >
//                                                 {vendorItem.vendor_id} :{" "}
//                                                 {vendorItem.vendor_name}
//                                                 </option>
//                                             ))}
//                                             </select>
//                                         </div>

//                                         {/* ================= ASSIGN BUTTON ================= */}
//                                         <div className="flex justify-end">
//                                             <Button
//                                             type="button"
//                                             onClick={async () => {
//                                                 if (!assignmentState) {
//                                                 toast.warn("Please select a vendor");
//                                                 return;
//                                                 }

//                                                 const order_ids = selectedBulkOrders.map(
//                                                 (order) => order.id
//                                                 );

//                                                 const result =
//                                                 await assignBulkOrderVendor(
//                                                     order_ids,
//                                                     assignmentState
//                                                 );
//                                             }}
//                                             className="h-10 w-full cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5] sm:w-auto"
//                                             >
//                                             Bulk Assign
//                                             </Button>
//                                         </div>
//                                         </div>
//                                     )
//                                     )}
//                                 </div>
//                                 </div>

//                                 {selectedStatus === "booked" && (
//                             <div className="overflow-hidden mt-4 rounded-sm border border-emerald-200 dark:border-emerald-500/20">
//                             {/* SECTION HEADER */}
//                             <div className="border-b border-emerald-100 bg-emerald-50/70 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/5">
//                                 <div className="flex items-start justify-between gap-3">
//                                 <div>
//                                     <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                      Schedule Self Pickup
//                                     </h3>

//                                     <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                    Schedule self-pickup for all selected orders.
//                                     </p>
//                                 </div>

//                                 <span className="shrink-0 rounded-sm bg-blue-50 px-2 py-1 text-[11px] font-semibold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
//                                     {selectedBulkOrders?.length || 0} Orders
//                                 </span>
//                                 </div>
//                             </div>

//                             {/* SECTION BODY */}
//                             <div className="p-4">
//                                 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                                 <div>
//                                     <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                     Schedule Self Pickup for Selected Orders
//                                     </p>

//                                     <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                      selected orders will be included in the self-pickup schedule.
//                                     </p>
//                                 </div>

//                                 <Button
//                                     type="button"
//                                     disabled={!selectedBulkOrders?.length}
//                                     onClick={async () => {
//                                     if (!selectedBulkOrders?.length) {
//                                         toast.warn(
//                                         "Please select at least one order"
//                                         );
//                                         return;
//                                     }

//                                     const order_ids = [
//                                         ...new Set(
//                                         selectedBulkOrders.map(
//                                             (order) => order.id
//                                         )
//                                         ),
//                                     ];

//                                     await generateBulkPickupRequest(
//                                         order_ids
//                                     );
//                                     }}
//                                      className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-emerald-600 px-5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"                                >
//                                      Schedule Self Pickup
//                                 </Button>
//                                 </div>
//                             </div>
//                             </div>
//                         )}

//                                 {/* =====================================================
//                                     CLEAR SELECTED ORDERS
//                                 ===================================================== */}
//                                 <div className="mt-4 flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
//                                 <div className="min-w-0">
//                                     <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                     Clear Selection
//                                     </p>

//                                     <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                     Remove all selected orders from bulk action.
//                                     </p>
//                                 </div>

//                                 <Button
//                                     type="button"
//                                     className="h-10 w-full shrink-0 cursor-pointer rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 shadow-none transition-colors hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10 sm:w-auto"
//                                     onClick={() => {
//                                     setSelectedBulkOrders([]);
//                                     setBulkOrderWeight(0);
//                                     setFetchBulkAssignmentVendor(false);
//                                     setVendor([]);
//                                     setcanceledBulkOrder(false);
//                                     clearAllState()
//                                     }}
//                                 >
//                                     Clear Selected Orders
//                                 </Button>
//                                 </div>
//                             </div>

//                             {/* ================= FOOTER ================= */}
//                             <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 my-0 dark:border-neutral-800 dark:bg-neutral-950/30">
//                                 <AlertDialogCancel 
//                                  onClick={()=>{
//                                      clearAllState()
//                                  }}
//                                 className="cursor-pointer rounded-sm">
//                                 Close
//                                 </AlertDialogCancel>
//                             </AlertDialogFooter>
//                             </AlertDialogContent>
//                     </AlertDialog>
//                             <Button
//                                 className="bg-red-500 hover:bg-red-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
//                                 onClick={() => {
//                                     setSelectedBulkOrders([]);
//                                     setBulkOrderWeight(0);
//                                     setFetchBulkAssignmentVendor(false);
//                                     setVendor([]);
//                                     setcanceledBulkOrder(false);
//                                 }}
//                             >
//                                 Clear Selected Orders
//                             </Button>
//                     </>
//                    )}
//                 </div>

                


//                 <div className="min-h-0 min-w-0 flex-1 overflow-auto overscroll-contain">
//                 <table className="w-full min-w-[1050px] caption-bottom text-sm border-separate border-spacing-0">
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead className="sticky top-0 z-30 whitespace-nowrap bg-slate-100 px-3 py-3 text-xs font-semibold text-slate-800 shadow-[0_1px_0_#e2e8f0] dark:bg-neutral-800 dark:text-neutral-100">
//                                 {
//                                     selectedStatus !== "All"  && (

//                                         <input
//                                             type="checkbox"
//                                             className="w-4 h-4 text-indigo-600 rounded border-gray-300"
//                                             checked={
//                                                 orders.filter((o) => o.tpc_awb_number === null).length > 0 &&
//                                                 selectedBulkOrders.length === orders.filter((o) => o.tpc_awb_number === null).length
//                                             }
//                                             onChange={toggleSelectAll}
//                                         />
//                                     )
//                                 }
//                             </TableHead>
//                             <TableHead className="sticky top-0 z-30 whitespace-nowrap bg-slate-100 px-3 py-3 text-xs font-semibold text-slate-800 shadow-[0_1px_0_#e2e8f0] dark:bg-neutral-800 dark:text-neutral-100">ORDER ID</TableHead>
//                             <TableHead className="sticky top-0 z-30 whitespace-nowrap bg-slate-100 px-3 py-3 text-xs font-semibold text-slate-800 shadow-[0_1px_0_#e2e8f0] dark:bg-neutral-800 dark:text-neutral-100">CONSIGNEE ADDRESS</TableHead>
//                             <TableHead className="sticky top-0 z-30 whitespace-nowrap bg-slate-100 px-3 py-3 text-xs font-semibold text-slate-800 shadow-[0_1px_0_#e2e8f0] dark:bg-neutral-800 dark:text-neutral-100">PACKAGE DETAILS</TableHead>
//                             <TableHead className="sticky top-0 z-30 whitespace-nowrap bg-slate-100 px-3 py-3 text-xs font-semibold text-slate-800 shadow-[0_1px_0_#e2e8f0] dark:bg-neutral-800 dark:text-neutral-100">ASSIGNMENT/RIDER</TableHead>
//                             <TableHead className="sticky top-0 z-30 whitespace-nowrap bg-slate-100 px-3 py-3 text-xs font-semibold text-slate-800 shadow-[0_1px_0_#e2e8f0] dark:bg-neutral-800 dark:text-neutral-100">MAPPED/VENDOR</TableHead>
//                             <TableHead className="sticky top-0 z-30 whitespace-nowrap bg-slate-100 px-3 py-3 text-xs font-semibold text-slate-800 shadow-[0_1px_0_#e2e8f0] dark:bg-neutral-800 dark:text-neutral-100">STATUS</TableHead>
                            
//                             <TableHead className="sticky top-0 z-30 whitespace-nowrap bg-slate-100 px-3 py-3 text-xs font-semibold text-slate-800 shadow-[0_1px_0_#e2e8f0] dark:bg-neutral-800 dark:text-neutral-100">ELIGIBLE VENDORS</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {loading ? (
//                             <TableRow>
//                                 <TableCell colSpan={8} className="text-center py-10">
//                                     <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//                                     <p className="mt-2">Loading orders...</p>
//                                 </TableCell>
//                             </TableRow>
//                         ) : orders.length === 0 ? (
//                             <TableRow>
//                                 <TableCell colSpan={8} className="text-center py-10">
//                                     No orders found
//                                 </TableCell>
//                             </TableRow>
//                         ) : (
//                             orders.map((order) => {
//                                 const isSelected = selectedBulkOrders.some((o) => o.id === order.id);
//                                 return (
//                                     <TableRow key={order.id}>
//                                         <TableCell>
//                                             {  selectedStatus !=="All" && order.tpc_awb_number === null ? (
//                                                 <input
//                                                     type="checkbox"
//                                                     checked={isSelected}
//                                                     onChange={(e) => {
//                                                         const isChecked = e.target.checked;
//                                                         if (isChecked) {
//                                                             setSelectedBulkOrders((prev) => {
//                                                                 const updated = [...prev, order];
//                                                                 const order_ids = updated.map((o) => o.id);
//                                                                 // fetchVendor(order_ids);
//                                                                 return updated;
//                                                             });
//                                                             setBulkOrderWeight(
//                                                                 (prev) => Number(prev) + Number(order.total_weight)
//                                                             );
//                                                         } else {
//                                                             setSelectedBulkOrders((prev) => {
//                                                                 const updated = prev.filter((o) => o.id !== order.id);
//                                                                 const order_ids = updated.map((o) => o.id);
//                                                                 if (order_ids.length > 0) {
//                                                                     // fetchVendor(order_ids);
//                                                                 } else {
//                                                                     setVendor([]);
//                                                                     setFetchBulkAssignmentVendor(false);
//                                                                 }
//                                                                 return updated;
//                                                             });
//                                                             setBulkOrderWeight(
//                                                                 (prev) => Number(prev) - Number(order.total_weight)
//                                                             );
//                                                         }
//                                                     }}
//                                                     className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
//                                                 />
//                                             ) : (
//                                                 <span className="px-6 py-4 text-center">-</span>
//                                             )}
//                                         </TableCell>

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
//                                                         className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
//                                                         onClick={() => {
//                                                             navigator.clipboard.writeText(order.awb_number);
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
//                                                             <Button variant="outline" className="text-xs font-medium text-red-600 inline-block cursor-pointer">
//                                                                 <TbFileInfo />
//                                                             </Button>
//                                                         </DialogTrigger>
//                                                         <DialogContent className="sm:max-w-4xl">
//                                                             <DialogHeader>
//                                                                 <DialogTitle>Order Details</DialogTitle>
//                                                             </DialogHeader>
//                                                             <div className="bg-white p-6 space-y-3 text-gray-700">
//                                                                 <h3 className="font-semibold text-[#0446DB] mb-2">Basic Details</h3>
//                                                                 <div className="grid grid-cols-2 gap-4">
//                                                                     <div>
//                                                                         <strong>Order ID:</strong> {order.merchant_order_id}
//                                                                         <button
//                                                                             className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
//                                                                             onClick={() => {
//                                                                                 navigator.clipboard.writeText(order.merchant_order_id);
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
//                                                                             className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
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
//                                                                         <strong>Order Type:</strong> {order.order_type === "cod" ? "COD" : "Prepaid"}
//                                                                     </div>
//                                                                     <div>
//                                                                         <strong>Order Specific:</strong> {order.order_specific}
//                                                                     </div>
//                                                                     <div>
//                                                                         <strong>Order Status:</strong> {toCapitalizeEachWord(order.status)}
//                                                                     </div>
//                                                                     <div>
//                                                                         <strong>Total Amount:</strong> ₹{Number(order.total_amount).toLocaleString()}
//                                                                     </div>
//                                                                     <div>
//                                                                         <strong>Order Weight:</strong> {Number(order.total_weight).toLocaleString()}g
//                                                                     </div>
//                                                                     <div>
//                                                                         <strong>Number of Packets:</strong> {order.number_of_boxes}
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="pt-4 border-t">
//                                                                     <h3 className="font-semibold text-[#0446DB] mb-2">Delivery Details</h3>
//                                                                     <div className="grid grid-cols-2 gap-4">
//                                                                         <div>
//                                                                             <strong>Customer Name:</strong> {order.delivery_contact_name}
//                                                                         </div>
//                                                                         <div>
//                                                                             <strong>Address:</strong> {order.delivery_address_line}
//                                                                         </div>
//                                                                         <div>
//                                                                             <strong>City:</strong> {`${order.delivery_city}, ${order.delivery_state} - ${order.delivery_pincode}` || "N/A"}
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="pt-4 border-t">
//                                                                     <h3 className="font-semibold text-[#0446DB] mb-2">Pickup Details</h3>
//                                                                     <div className="grid grid-cols-2 gap-4">
//                                                                         <div>
//                                                                             <strong>Name:</strong> {order.pickup_contact_name || "N/A"}
//                                                                         </div>
//                                                                         <div>
//                                                                             <strong>Pickup Phone No:</strong> {order.pickup_phone || "N/A"}
//                                                                         </div>
//                                                                         <div>
//                                                                             <strong>Address:</strong> {order.pickup_address_line || "N/A"}
//                                                                         </div>
//                                                                         <div>
//                                                                             <strong>City:</strong> {`${order.pickup_city}, ${order.pickup_state} - ${order.pickup_pincode}` || "N/A"}
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
//                                                     {new Date(order.created_at).toLocaleString("en-IN", {
//                                                         timeZone: "Asia/Kolkata",
//                                                         day: "2-digit",
//                                                         month: "2-digit",
//                                                         year: "numeric",
//                                                         hour: "2-digit",
//                                                         minute: "2-digit",
//                                                         hour12: true,
//                                                     })}
//                                                 </p>
//                                                 <p className="text-s text-gray-400 dark:text-white">
//                                                     <span>Merchant ID: {order.merchant_id}</span>
                                                    
// <span
//   className={`ml-2 inline-flex items-center gap-1.5 rounded-full border border-dashed px-2.5 py-1 text-[11px] font-semibold ${
//     order?.rider_preference === "daakit"
//       ? "border-blue-200 bg-blue-50 text-[#0446DB] dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400"
//       : "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400"
//   }`}
// >
//   <span
//     className={`h-1.5 w-1.5 rounded-full ${
//       order?.rider_preference === "daakit"
//         ? "bg-[#0446DB]"
//         : "bg-violet-500"
//     }`}
//   />

//   {order?.rider_preference === "daakit" ? "DDN" : "BYOB"}
// </span>

//                                                 </p>

//                                                 <p className="text-s text-gray-400 dark:text-white">
//                                                     Merchant Order ID: {order.merchant_order_id?.length <= 20
//                                                         ? order.merchant_order_id
//                                                         : `${order.merchant_order_id.slice(0, 20)}...`}
                                                        
//                                                     <button
//                                                         className="pl-2 text-lg text-gray-600 dark:text-white hover:text-[#0446DB] transition"
//                                                         onClick={() => {
//                                                             navigator.clipboard.writeText(order.merchant_order_id);
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
                                                    
//                                                     {/* <span className="bg-[#0446DB] px-2 text-white rounded">{order.rider_preference === 'daakit' ? "Daakit" : "Self"}</span> */}
//                                                 </p>
//                                             </div>
//                                         </TableCell>
//                                         <TableCell>
//                                             <p className="font-medium text-gray-800 dark:text-white">{order.delivery_contact_name}</p>
//                                             <HoverCard>
//                                                 <HoverCardTrigger>{order.delivery_address_line.slice(0, 30)}...</HoverCardTrigger>
//                                                 <HoverCardContent className='bg-[#0446DB] text-white'>
//                                                     {order.delivery_address_line}, {order.delivery_city}, {order.delivery_state} - {order.delivery_pincode}
//                                                 </HoverCardContent>
//                                             </HoverCard>
//                                             <p className="text-xs text-gray-500 dark:text-white">
//                                                 {order.delivery_city}, {order.delivery_state} - {order.delivery_pincode}
//                                             </p>
//                                             <p className="text-xs text-gray-400">{order.delivery_country}</p>
//                                         </TableCell>
//                                         <TableCell>
//                                             <p>
//                                                 <span className="whitespace-nowrap dark:text-white">EDD: {order.EDD}</span>
//                                             </p>
//                                             <p>
//                                                 <span className="font-medium text-gray-800 dark:text-white">Weight:</span>
//                                                 <span className="dark:text-white"> {Number(order.total_weight).toLocaleString()}g</span>
//                                                 <span
//                                                     className={`ml-2 px-2 py-0.5 rounded-full text-sm font-semibold shadow-sm ${order.order_specific?.slice(0, 3) === "NDD"
//                                                         ? "text-green-800 bg-green-100 border border-green-300"
//                                                         : order.order_specific?.slice(0, 3) === "SDD"
//                                                             ? "text-yellow-800 bg-yellow-100 border border-yellow-300"
//                                                             : "text-red-800 bg-red-100 border border-red-300 animate-blink"
//                                                         }`}
//                                                 >
//                                                     {order.order_specific?.slice(0, 3) === "NDD"
//                                                         ? "NDD"
//                                                         : order.order_specific?.slice(0, 3) === "SDD"
//                                                             ? "SDD"
//                                                             : order.order_specific?.slice(0, 6) === "Turant"
//                                                                 ? "Turant"
//                                                                 : order.order_specific}
//                                                 </span>
//                                             </p>
//                                             <p>
//                                                 <span className="font-medium dark:text-white text-gray-800">Dimensions:</span>
//                                                 <span className="dark:text-white"> {order.package_length}x{order.package_breadth}x{order.package_height}</span>
//                                             </p>
//                                         </TableCell>
//                                         <TableCell>
//                                             <span className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer">
//                                                 Not Assigned
//                                             </span>
//                                         </TableCell>
//                                         <TableCell>
//                                             {isOpenIndividualVendorAssignmnet !== order.id ? (
//                                                 <span
//                                                     onClick={() => {
//                                                         if (order.tpc_awb_number !== null) return;
//                                                         if (order.rider_preference === 'daakit') {
//                                                             fetchVendor([order.id]);
//                                                             setIsOpenIndividualVendorAssignmnet(order.id);
//                                                         }
//                                                     }}
//                                                     className={`px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium ${order.tpc_awb_number !== null || order.rider_preference !== 'daakit'
//                                                         ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                                                         : "bg-red-100 text-red-600 cursor-pointer"
//                                                         } mb-2 inline-block`}
//                                                 >
//                                                     {order.tpc_awb_number !== null ? "Mapped" : "Not Mapped"}
//                                                 </span>
//                                             ) : (
//                                                 <form
//                                                     onSubmit={(e) => {
//                                                         e.preventDefault();
//                                                         if (!assignmentState) {
//                                                             toast.warn("Please select a vendor");
//                                                             return;
//                                                         }
//                                                         assignVendor(order.id, assignmentState);
//                                                     }}
//                                                     className="flex items-center gap-2"
//                                                 >
//                                                     <select
//                                                         value={assignmentState}
//                                                         onChange={(e) => setAssignmentState(e.target.value)}
//                                                         className="border px-2 py-1 rounded-md"
//                                                         required
//                                                     >
//                                                         <option value="" disabled>Select Vendor</option>
//                                                         {vendor.map((vendor) => (
//                                                             <option key={vendor.vendor_id} value={vendor.vendor_id}>
//                                                                 {vendor.vendor_id} : {vendor.vendor_name}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                     <button type="submit" className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800">
//                                                         Assign
//                                                     </button>
//                                                     <button
//                                                         type="button"
//                                                         className="text-xs text-gray-500 hover:underline"
//                                                         onClick={() => {
//                                                             setIsOpenIndividualVendorAssignmnet("");
//                                                             setAssignmentState("");
//                                                         }}
//                                                     >
//                                                         Close
//                                                     </button>
//                                                 </form>
//                                             )}
//                                         </TableCell>
//                                         <TableCell>
//                                             <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 mb-2 inline-block cursor-pointer">
//                                                 {order?.status
//                                                     ?.toLowerCase()
//                                                     ?.split(" ")
//                                                     ?.map(word => word.charAt(0).toUpperCase() + word.slice(1))
//                                                     ?.join(" ")
//                                                 }
//                                             </span>
//                                         </TableCell>
//                                         <TableCell>
                                            


                                            
//                                                 <div className="max-w-[220px] px-3 py-2">
//                                                     {order?.tpc_awb_number != null ? (
//                                                     <span className="block text-center text-gray-400">-</span>
//                                                     ) : (() => {
//                                                     const vendors = String(order?.eligible_vendors || "")
//                                                         .split(",")
//                                                         .map((v) => v.trim())
//                                                         .filter(Boolean);

//                                                     if (!vendors.length) {
//                                                         return (
//                                                         <span className="block text-center text-gray-400">-</span>
//                                                         );
//                                                     }

//                                                     return (
//                                                         <HoverCard openDelay={150} closeDelay={150}>
//                                                         <HoverCardTrigger asChild>
//                                                             <div className="max-w-[200px] cursor-pointer">
//                                                             <div className="flex items-center gap-2 rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-orange-700 transition-all duration-200 hover:border-orange-400 hover:bg-orange-100 hover:shadow-sm dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-300">
//                                                                 <Building2 className="h-4 w-4 shrink-0" />

//                                                                 <span className="min-w-0 flex-1 truncate text-xs font-medium">
//                                                                 {vendors.join(" | ")}
//                                                                 </span>

//                                                                 <span className="shrink-0 rounded-full bg-orange-200 px-1.5 py-0.5 text-[10px] font-semibold dark:bg-orange-900">
//                                                                 {vendors.length}
//                                                                 </span>
//                                                             </div>
//                                                             </div>
//                                                         </HoverCardTrigger>

//                                                         <HoverCardContent
//                                                             side="top"
//                                                             align="start"
//                                                             sideOffset={8}
//                                                             className="z-50 w-[320px] rounded-xl border border-gray-200 bg-white p-0 shadow-xl dark:border-gray-700 dark:bg-gray-900"
//                                                         >
//                                                             {/* Header */}
//                                                             <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
//                                                             <div className="flex items-center justify-between">
//                                                                 <div className="flex items-center gap-2">
//                                                                 <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950">
//                                                                     <Users className="h-4 w-4" />
//                                                                 </div>

//                                                                 <div>
//                                                                     <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
//                                                                     Eligible Vendors
//                                                                     </h4>
//                                                                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                                                                     Available vendor list
//                                                                     </p>
//                                                                 </div>
//                                                                 </div>

//                                                                 <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
//                                                                 {vendors.length} Total
//                                                                 </span>
//                                                             </div>
//                                                             </div>

//                                                             {/* Vendor List */}
//                                                             <div className="max-h-[250px] space-y-1 overflow-y-auto p-2">
//                                                             {vendors?.map((vendor, index) => (
//                                                                 <div
//                                                                 key={`${vendor}-${index}`}
//                                                                 className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
//                                                                 >
//                                                                 <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
//                                                                     {index + 1}
//                                                                 </span>

//                                                                 <span className="min-w-0 flex-1 break-words text-sm font-medium text-gray-700 dark:text-gray-200">
//                                                                     {vendor}
//                                                                 </span>

//                                                                 <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
//                                                                 </div>
//                                                             ))}
//                                                             </div>

//                                                             {/* Footer */}
//                                                             <div className="border-t border-gray-100 px-4 py-2.5 dark:border-gray-800">
//                                                             <p className="text-center text-xs text-gray-400">
//                                                                 {vendors.length} eligible vendor
//                                                                 {vendors.length !== 1 ? "s" : ""} found
//                                                             </p>
//                                                             </div>
//                                                         </HoverCardContent>
//                                                         </HoverCard>
//                                                     );
//                                                     })()}
//                                                 </div>

//                                         </TableCell>
//                                     </TableRow>
//                                 );
//                             })
//                         )}
//                     </TableBody>
//                 </table>
//                 </div>

//             {totalPages > 1 && (
//                 <div className="mt-auto flex shrink-0 items-center justify-between border-t border-gray-200 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900">
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
//             </div>
//         </div>
//     );
// }

// export default BookOrders;




import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaFilter } from 'react-icons/fa';
import { Building2, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegCopy } from "react-icons/fa";
import { TbFileInfo } from "react-icons/tb";
import { CiCircleCheck } from "react-icons/ci";
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
import AxiosInstance from '../../../Helper/axiosInstance';
import CustomButton from '../../common/CustomButton';

const baseURL = import.meta.env.VITE_BASE_URL;
const frontEndURL = import.meta.env.VITE_FRONTEND_URL;

function BookOrders() {
    const [open, setOpen] = useState(false);
    const [endopen, setEndOpen] = useState(false);
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
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [advanceFilters, setAdvanceFilters] = useState({
        startDate: "",
        endDate: "",
        awbNumber: "",
        vendor_id: "",
        order_specific: "",
        pincode: ""
    });
    const clearAllState = () => {
  // Clear selected orders
  setSelectedBulkOrders([]);

  // Reset bulk order weight
  setBulkOrderWeight(0);

  // Reset vendor assignment
  setFetchBulkAssignmentVendor(false);
  setVendor([]);
  setAssignmentState("");

  // Reset bulk action
  setcanceledBulkOrder(false);

  // Close individual vendor assignment
  setIsOpenIndividualVendorAssignmnet("");
};
    const [totalOrders, setTotalOrders] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [vendorList, setVendorList] = useState([]);
    const [bulkOrderWeight, setBulkOrderWeight] = useState(0);
    const [canceledBulkOrder, setcanceledBulkOrder] = useState(false);

    const tableScrollRef = useRef(null);
    const handleStickyScroll = (e) => {
        const table = tableScrollRef.current;
        if (!table) return;
        const canScrollY = table.scrollHeight > table.clientHeight;
        const canScrollX = table.scrollWidth > table.clientWidth;
        if (!canScrollY && !canScrollX) return;
        if ((e.deltaY && canScrollY) || (e.deltaX && canScrollX)) {
            e.preventDefault();
            if (canScrollY) table.scrollTop += e.deltaY;
            if (canScrollX) table.scrollLeft += e.deltaX;
        }
    };

    const isFirstRender = useRef(true);
    const navigate = useNavigate();

    const status = [
        "All",
        "booked",
        "pending pickup",
        "picked",
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

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${baseURL}/api/admin/getBookedEligibleOrders`, {
                params: {
                    page,
                    limit,
                    vendor_id: advanceFilters.vendor_id,
                    start_date: advanceFilters.startDate,
                    end_date: advanceFilters.endDate,
                    awb_number: advanceFilters.awbNumber,
                    order_specific: advanceFilters.order_specific,
                    pincode: advanceFilters.pincode,
                    status: selectedStatus === "All" ? "" : selectedStatus
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setOrders(res?.data?.data || []);
            setTotalOrders(res?.data?.data?.length || 0);
            setTotalPages(res.data?.pagination?.totalPages || 1);
        } catch (err) {
            setOrders([]);
            toast.error(err.response?.data?.message || err.message || "An error occurred while fetching orders.");
        } finally {
            setLoading(false);
        }
    };

    const getAllVendors = async () => {
        try {
            const res = await AxiosInstance.get('/api/admin/getAllVendors',{
                params:{
                    limit : 1000
                }
            })
            
            setVendorList(res.data.data || []);
        } catch (err) {
            setVendorList([]);
            toast.error(err.response?.data?.message || err.message || "An error occurred while fetching vendors.");
        }
    };

    const fetchVendor = async (order_ids) => {
        if (order_ids.length === 0) {
            setVendor([]);
            return;
        }

        try {
            const res = await axios.get(`${baseURL}/api/admin/getEligibleVendorsByOrders?order_id=${order_ids}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            setVendor(res.data.data || []);
            toast.success(res?.data?.message)
            // if (res.data.data.length === 0) {
            //     setSelectedBulkOrders([]);
            //     setBulkOrderWeight(0);
            //     setFetchBulkAssignmentVendor(false);
            // }
            fetchOrders()
        } catch (err) {
            setVendor([]);
            toast.error(err.response?.data?.message || err.message || "Failed to load vendors");
        }
    };

    const assignVendor = async (orderId, vendorId) => {

        
        setLoading(true);
        try {
            const res = await axios.post(
                `${baseURL}/api/admin/assignOrderToVendor`,
                { order_id: orderId, vendor_id: vendorId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            toast.success(res.data.message || "Vendor assigned successfully");
            setAssignmentState('')
            fetchOrders();
            setIsOpenIndividualVendorAssignmnet("");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to assign vendor");
        } finally {
            setLoading(false);
        }
    };

    const assignBulkOrderVendor = async (orderIds, vendorId) => {
        setLoading(true);
        try {
            const res  = await AxiosInstance.post(`/api/admin/bulkAssignOrdersToVendor`,
                {
                    order_ids: orderIds,
                    vendor_id: vendorId,
                }
            )
           
            toast.success("Vendor assigned successfully");
            fetchOrders();
            setAssignmentState("");
            setSelectedBulkOrders([]);
            setBulkOrderWeight(0);
            setFetchBulkAssignmentVendor(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to assign vendor");
        } finally {
            setLoading(false);
        }
    };

    const generateBulkPickupRequest = async(order_ids)=>{
        try {
             const res = await AxiosInstance.post(`/api/admin/generateBulkPickupRequest`,{
          order_ids:order_ids
        })
        fetchOrders()
        toast.success(res?.data?.message)
        clearAllState()
        } catch (error) {
            
        }
    }

    const toggleSelectAll = () => {
        const unassignedOrders = orders.filter((o) => o.tpc_awb_number === null);
        if (selectedBulkOrders.length === unassignedOrders.length) {
            setSelectedBulkOrders([]);
            setBulkOrderWeight(0);
            setVendor([]);
            setFetchBulkAssignmentVendor(false);
        } else {
            setSelectedBulkOrders(unassignedOrders);
            const totalWeight = unassignedOrders.reduce(
                (acc, order) => acc + Number(order.total_weight),
                0
            );
            setBulkOrderWeight(totalWeight);
            if (unassignedOrders.length > 0) {
                const order_ids = unassignedOrders.map((o) => o.id);
                fetchVendor(order_ids);
            }
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

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setAdvanceFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = (e) => {
        e.preventDefault();
        setPage(1);
        fetchOrders();
        setDrawerOpen(false);
    };

    const clearFilters = () => {
        const emptyFilters = {
            startDate: "",
            endDate: "",
            awbNumber: "",
            vendor_id: "",
            order_specific: "",
            pincode: ""
        };
        setAdvanceFilters(emptyFilters);
        setPage(1);
        setSelectedStatus("All");
        setLastOneMonth()
        fetchOrders();

    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const formatDate = (date) => {
        return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
    };

    const setLastOneMonth = () => {
        const endDate = new Date();
        const startDate = new Date();

        startDate.setMonth(startDate.getMonth() - 1);

        setAdvanceFilters((prev) => ({
            ...prev,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
        }));
    };

    // Initial load - runs only once on mount
    useEffect(() => {
        setLastOneMonth()
        getAllVendors();
        fetchOrders();
    }, []);

    // Handle pagination, limit, and status changes
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        fetchOrders();
    }, [page, limit, selectedStatus]);

    // Handle filter changes
    useEffect(() => {
        if (isFirstRender.current) {
            return;
        }
        // Debounce filter changes to avoid too many API calls
        fetchOrders();

    }, []);

    return (
        <div className="flex h-[calc(102dvh-110px)] min-h-0 w-full flex-col overflow-hidden">
            <div onWheel={handleStickyScroll} className="sticky top-0 left-0 z-10 shrink-0  dark:bg-neutral-900 py-2">
                <div className="mx-auto">
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-bold dark:text-white">Assignment Console</h1>
                            <div className="flex items-center gap-2">
                                <Drawer
                                    open={drawerOpen}
                                    onOpenChange={setDrawerOpen}
                                    direction="right">
                                    <DrawerTrigger asChild>
                                        
                                        <CustomButton
                                        variant="outline"
                                        size="md"
                                        icon={FaFilter}
                                        className="rounded-sm font-medium shadow "
                                        >
                                        Filter
                                        </CustomButton>

                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <form
                                            onSubmit={(e) => e.preventDefault()}
                                        >
                                            <DrawerHeader>
                                                <DrawerTitle>Filter Orders</DrawerTitle>
                                            </DrawerHeader>
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
                                                                    selected={advanceFilters.startDate ? new Date(advanceFilters.startDate) : undefined}
                                                                    defaultMonth={advanceFilters.startDate ? new Date(advanceFilters.startDate) : undefined}
                                                                    captionLayout="dropdown"
                                                                    onSelect={(date) => {
                                                                        if (date) {
                                                                            const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)
                                                                                .toString()
                                                                                .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
                                                                            setAdvanceFilters({
                                                                                ...advanceFilters,
                                                                                startDate: formattedDate
                                                                            });
                                                                            setOpen(false);
                                                                        }
                                                                    }}
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </Field>

                                                    <Field className="mx-auto w-full">
                                                        <FieldLabel htmlFor="end-date">End Date</FieldLabel>
                                                        <Popover open={endopen} onOpenChange={setEndOpen}>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    id="end-date"
                                                                    className="justify-start w-full font-normal"
                                                                >
                                                                    {advanceFilters.endDate ? formatToDMY(advanceFilters.endDate) : "Select date"}
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={advanceFilters.endDate ? new Date(advanceFilters.endDate) : undefined}
                                                                    defaultMonth={advanceFilters.endDate ? new Date(advanceFilters.endDate) : undefined}
                                                                    captionLayout="dropdown"
                                                                    onSelect={(date) => {
                                                                        if (date) {
                                                                            const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)
                                                                                .toString()
                                                                                .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
                                                                            setAdvanceFilters({
                                                                                ...advanceFilters,
                                                                                endDate: formattedDate
                                                                            });
                                                                            setEndOpen(false);
                                                                        }
                                                                    }}
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </Field>

                                                    <div>
                                                        <label className="block text-sm font-bold dark:text-white text-gray-600 mb-1">
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
                                                            className="w-full border dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        >
                                                            <option value="">All orders</option>
                                                            <option value="Turant">Turant</option>
                                                            <option value="SDD">Same Day Delivery</option>
                                                            <option value="NDD">Next Day Delivery</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-bold dark:text-white text-gray-600 mb-1">
                                                            Pincode
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={advanceFilters.pincode}
                                                            onChange={(e) =>
                                                                setAdvanceFilters((prev) => ({
                                                                    ...prev,
                                                                    pincode: e.target.value,
                                                                }))
                                                            }
                                                            placeholder="Enter Pincode"
                                                            className="w-full border dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        />
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

                                                        <select name="" id=""
                                                         className=' w-full border-gray-200 border py-2 px-2 rounded-sm'
                                                        onChange={(value) => {
                                                           
                                                                setAdvanceFilters((prev) => ({
                                                                    ...prev,
                                                                    vendor_id: value.target.value,
                                                                }));
                                                            }}
                                                        >
                                                            <option value="">Select a vendo</option>
                                                            {
                                                                vendorList?.map((v)=>{
                                                                    return (
                                                                      <option value={v?.id}>{v.id}:{v?.vendor_name}</option>
                                                                    ) 
                                                                })
                                                            }
                                                        </select>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                            <DrawerFooter>
                                                <Button className='bg-[#0446DB]' onClick={applyFilters}>Apply Filters</Button>
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

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm border border-gray-200 dark:border-neutral-800">
                

                <div onWheel={handleStickyScroll} className="w-full shrink-0 rounded-sm bg-white dark:bg-neutral-800 left-0 px-4 z-40">
                    <div className="relative flex justify-left">
                        <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2">
                            <div className="flex gap-1 min-w-max  mt-3">
                                {status.map((st) => (
                                    <Button
                                        key={st}
                                        onClick={() => {
                                            setSelectedBulkOrders([]);
                                            setSelectedStatus(st);
                                            setPage(1);
                                        }}
                                        className={`px-5 py-2.5 cursor-pointer rounded-sm my-2 border transition-all duration-300 font-medium text-sm tracking-wide ${selectedStatus === st
                                            ? "bg-[#0446DB]  hover:bg-[#0446DB] text-white"
                                            : "bg-white hover:bg-[#0446DB] hover:text-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]"
                                            }`}
                                    >
                                        {st === "rto in transit"
                                            ? "RTO In Transit"
                                            : st === "rto delivered"
                                                ? "RTO Delivered"
                                                : toCapitalizeEachWord(st)}
                                        {selectedStatus === st && ` (${totalOrders})`}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                {selectedBulkOrders.length > 0 && (
                    <>
                    <AlertDialog>
                            {/* ================= TRIGGER ================= */}
                            <AlertDialogTrigger
                            
                            >
                                <Button
                                variant="outline"
                                className="h-7 cursor-pointer  rounded-sm border-[#0446DB] bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-[#0339B5] hover:text-white dark:border-blue-500 dark:bg-blue-600 dark:text-white"
                                >
                               Action
                                </Button>
                            </AlertDialogTrigger>

                            {/* ================= POPUP ================= */}
                            <AlertDialogContent className="!max-w-lg overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                            {/* ================= HEADER ================= */}
                            <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 text-left dark:border-neutral-800">
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

                            {/* ================= BODY ================= */}
                            <div className="max-h-[75vh] overflow-y-auto px-5 py-5">
                                {/* =====================================================
                                    MAP VENDOR
                                ===================================================== */}
                                <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
                                {/* SECTION HEADER */}
                                <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
                                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                    Map Vendor
                                    </h3>

                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                    Find an available vendor and map the selected orders.
                                    </p>
                                </div>

                                {/* SECTION BODY */}
                                <div className="p-4">
                                    {!fetchBulkAssignmentVendor || vendor?.length === 0 ? (
                                    /* ================= FETCH VENDOR ================= */
                                    <Button
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
                                        className="h-10 w-full cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition-colors hover:bg-[#0339B5] sm:w-auto"
                                    >
                                        Get Available Vendor
                                    </Button>
                                    ) : (
                                    vendor?.length > 0 && (
                                        <div className="flex flex-col gap-3">
                                        {/* ================= VENDOR SELECT ================= */}
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                            Select Vendor
                                            </label>

                                            <select
                                            className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                            value={assignmentState}
                                            onChange={(e) =>
                                                setAssignmentState(e.target.value)
                                            }
                                            >
                                            <option value="">
                                                Select Vendor for Bulk Assignment
                                            </option>

                                            {vendor.map((vendorItem) => (
                                                <option
                                                key={vendorItem.vendor_id}
                                                value={vendorItem.vendor_id}
                                                >
                                                {vendorItem.vendor_id} :{" "}
                                                {vendorItem.vendor_name}
                                                </option>
                                            ))}
                                            </select>
                                        </div>

                                        {/* ================= ASSIGN BUTTON ================= */}
                                        <div className="flex justify-end">
                                            <Button
                                            type="button"
                                            onClick={async () => {
                                                if (!assignmentState) {
                                                toast.warn("Please select a vendor");
                                                return;
                                                }

                                                const order_ids = selectedBulkOrders.map(
                                                (order) => order.id
                                                );

                                                const result =
                                                await assignBulkOrderVendor(
                                                    order_ids,
                                                    assignmentState
                                                );
                                            }}
                                            className="h-10 w-full cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5] sm:w-auto"
                                            >
                                            Bulk Assign
                                            </Button>
                                        </div>
                                        </div>
                                    )
                                    )}
                                </div>
                                </div>

                                {selectedStatus === "booked" && (
                            <div className="overflow-hidden mt-4 rounded-sm border border-emerald-200 dark:border-emerald-500/20">
                            {/* SECTION HEADER */}
                            <div className="border-b border-emerald-100 bg-emerald-50/70 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                                <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                     Schedule Self Pickup
                                    </h3>

                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                   Schedule self-pickup for all selected orders.
                                    </p>
                                </div>

                                <span className="shrink-0 rounded-sm bg-blue-50 px-2 py-1 text-[11px] font-semibold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                                    {selectedBulkOrders?.length || 0} Orders
                                </span>
                                </div>
                            </div>

                            {/* SECTION BODY */}
                            <div className="p-4">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                    Schedule Self Pickup for Selected Orders
                                    </p>

                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                     selected orders will be included in the self-pickup schedule.
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    disabled={!selectedBulkOrders?.length}
                                    onClick={async () => {
                                    if (!selectedBulkOrders?.length) {
                                        toast.warn(
                                        "Please select at least one order"
                                        );
                                        return;
                                    }

                                    const order_ids = [
                                        ...new Set(
                                        selectedBulkOrders.map(
                                            (order) => order.id
                                        )
                                        ),
                                    ];

                                    await generateBulkPickupRequest(
                                        order_ids
                                    );
                                    }}
                                     className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-emerald-600 px-5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"                                >
                                     Schedule Self Pickup
                                </Button>
                                </div>
                            </div>
                            </div>
                        )}

                                {/* =====================================================
                                    CLEAR SELECTED ORDERS
                                ===================================================== */}
                                <div className="mt-4 flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                    Clear Selection
                                    </p>

                                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                    Remove all selected orders from bulk action.
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    className="h-10 w-full shrink-0 cursor-pointer rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 shadow-none transition-colors hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10 sm:w-auto"
                                    onClick={() => {
                                    setSelectedBulkOrders([]);
                                    setBulkOrderWeight(0);
                                    setFetchBulkAssignmentVendor(false);
                                    setVendor([]);
                                    setcanceledBulkOrder(false);
                                    clearAllState()
                                    }}
                                >
                                    Clear Selected Orders
                                </Button>
                                </div>
                            </div>

                            {/* ================= FOOTER ================= */}
                            <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 my-0 dark:border-neutral-800 dark:bg-neutral-950/30">
                                <AlertDialogCancel 
                                 onClick={()=>{
                                     clearAllState()
                                 }}
                                className="cursor-pointer rounded-sm">
                                Close
                                </AlertDialogCancel>
                            </AlertDialogFooter>
                            </AlertDialogContent>
                    </AlertDialog>
                            <Button
                                className="bg-red-500 hover:bg-red-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                                onClick={() => {
                                    setSelectedBulkOrders([]);
                                    setBulkOrderWeight(0);
                                    setFetchBulkAssignmentVendor(false);
                                    setVendor([]);
                                    setcanceledBulkOrder(false);
                                }}
                            >
                                Clear Selected Orders
                            </Button>
                    </>
                   )}
                </div>

                


                <div ref={tableScrollRef} className="min-h-0 min-w-0 flex-1 overflow-auto overscroll-contain">
                <table className="w-full min-w-[1050px] caption-bottom text-sm border-separate border-spacing-0">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="sticky top-0 z-30 whitespace-nowrap bg-slate-100 px-3 py-3 text-xs font-semibold text-slate-800 shadow-[0_1px_0_#e2e8f0] dark:bg-neutral-800 dark:text-neutral-100">
                                {
                                    selectedStatus !== "All"  && (

                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                                            checked={
                                                orders.filter((o) => o.tpc_awb_number === null).length > 0 &&
                                                selectedBulkOrders.length === orders.filter((o) => o.tpc_awb_number === null).length
                                            }
                                            onChange={toggleSelectAll}
                                        />
                                    )
                                }
                            </TableHead>
                            <TableHead className="sticky top-0 z-30 whitespace-nowrap bg-slate-100 px-3 py-3 text-xs font-semibold text-slate-800 shadow-[0_1px_0_#e2e8f0] dark:bg-neutral-800 dark:text-neutral-100">ORDER ID</TableHead>
                            <TableHead className="sticky top-0 z-30 whitespace-nowrap bg-slate-100 px-3 py-3 text-xs font-semibold text-slate-800 shadow-[0_1px_0_#e2e8f0] dark:bg-neutral-800 dark:text-neutral-100">SELLER DETAILS</TableHead>
                            
                            <TableHead className="sticky top-0 z-30 whitespace-nowrap bg-slate-100 px-3 py-3 text-xs font-semibold text-slate-800 shadow-[0_1px_0_#e2e8f0] dark:bg-neutral-800 dark:text-neutral-100">CONSIGNEE ADDRESS</TableHead>
                            <TableHead className="sticky top-0 z-30 whitespace-nowrap bg-slate-100 px-3 py-3 text-xs font-semibold text-slate-800 shadow-[0_1px_0_#e2e8f0] dark:bg-neutral-800 dark:text-neutral-100">PACKAGE DETAILS</TableHead>
                            <TableHead className="sticky top-0 z-30 whitespace-nowrap bg-slate-100 px-3 py-3 text-xs font-semibold text-slate-800 shadow-[0_1px_0_#e2e8f0] dark:bg-neutral-800 dark:text-neutral-100">ASSIGNMENT/RIDER</TableHead>
                            <TableHead className="sticky top-0 z-30 whitespace-nowrap bg-slate-100 px-3 py-3 text-xs font-semibold text-slate-800 shadow-[0_1px_0_#e2e8f0] dark:bg-neutral-800 dark:text-neutral-100">MAPPED/VENDOR</TableHead>
                            <TableHead className="sticky top-0 z-30 whitespace-nowrap bg-slate-100 px-3 py-3 text-xs font-semibold text-slate-800 shadow-[0_1px_0_#e2e8f0] dark:bg-neutral-800 dark:text-neutral-100">STATUS</TableHead>
                            
                            <TableHead className="sticky top-0 z-30 whitespace-nowrap bg-slate-100 px-3 py-3 text-xs font-semibold text-slate-800 shadow-[0_1px_0_#e2e8f0] dark:bg-neutral-800 dark:text-neutral-100">ELIGIBLE VENDORS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                                    <p className="mt-2">Loading orders...</p>
                                </TableCell>
                            </TableRow>
                        ) : orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10">
                                    No orders found
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => {
                                const isSelected = selectedBulkOrders.some((o) => o.id === order.id);
                                return (
                                    <TableRow key={order.id}>
                                        <TableCell>
                                            {  selectedStatus !=="All" && order.tpc_awb_number === null ? (
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={(e) => {
                                                        const isChecked = e.target.checked;
                                                        if (isChecked) {
                                                            setSelectedBulkOrders((prev) => {
                                                                const updated = [...prev, order];
                                                                const order_ids = updated.map((o) => o.id);
                                                                // fetchVendor(order_ids);
                                                                return updated;
                                                            });
                                                            setBulkOrderWeight(
                                                                (prev) => Number(prev) + Number(order.total_weight)
                                                            );
                                                        } else {
                                                            setSelectedBulkOrders((prev) => {
                                                                const updated = prev.filter((o) => o.id !== order.id);
                                                                const order_ids = updated.map((o) => o.id);
                                                                if (order_ids.length > 0) {
                                                                    // fetchVendor(order_ids);
                                                                } else {
                                                                    setVendor([]);
                                                                    setFetchBulkAssignmentVendor(false);
                                                                }
                                                                return updated;
                                                            });
                                                            setBulkOrderWeight(
                                                                (prev) => Number(prev) - Number(order.total_weight)
                                                            );
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
                                                />
                                            ) : (
                                                <span className="px-6 py-4 text-center">-</span>
                                            )}
                                        </TableCell>

                                        

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
                                                        className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
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
                                                    <Dialog className='w-5xl'>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" className="text-xs font-medium text-red-600 inline-block cursor-pointer">
                                                                <TbFileInfo />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-4xl">
                                                            <DialogHeader>
                                                                <DialogTitle>Order Details</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="bg-white p-6 space-y-3 text-gray-700">
                                                                <h3 className="font-semibold text-[#0446DB] mb-2">Basic Details</h3>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <strong>Order ID:</strong> {order.merchant_order_id}
                                                                        <button
                                                                            className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText(order.merchant_order_id);
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
                                                                            className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
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
                                                                        <strong>Order Type:</strong> {order.order_type === "cod" ? "COD" : "Prepaid"}
                                                                    </div>
                                                                    <div>
                                                                        <strong>Order Specific:</strong> {order.order_specific}
                                                                    </div>
                                                                    <div>
                                                                        <strong>Order Status:</strong> {toCapitalizeEachWord(order.status)}
                                                                    </div>
                                                                    <div>
                                                                        <strong>Total Amount:</strong> ₹{Number(order.total_amount).toLocaleString()}
                                                                    </div>
                                                                    <div>
                                                                        <strong>Order Weight:</strong> {Number(order.total_weight).toLocaleString()}g
                                                                    </div>
                                                                    <div>
                                                                        <strong>Number of Packets:</strong> {order.number_of_boxes}
                                                                    </div>
                                                                </div>
                                                                <div className="pt-4 border-t">
                                                                    <h3 className="font-semibold text-[#0446DB] mb-2">Delivery Details</h3>
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <strong>Customer Name:</strong> {order.delivery_contact_name}
                                                                        </div>
                                                                        <div>
                                                                            <strong>Address:</strong> {order.delivery_address_line}
                                                                        </div>
                                                                        <div>
                                                                            <strong>City:</strong> {`${order.delivery_city}, ${order.delivery_state} - ${order.delivery_pincode}` || "N/A"}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="pt-4 border-t">
                                                                    <h3 className="font-semibold text-[#0446DB] mb-2">Pickup Details</h3>
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <strong>Name:</strong> {order.pickup_contact_name || "N/A"}
                                                                        </div>
                                                                        <div>
                                                                            <strong>Pickup Phone No:</strong> {order.pickup_phone || "N/A"}
                                                                        </div>
                                                                        <div>
                                                                            <strong>Address:</strong> {order.pickup_address_line || "N/A"}
                                                                        </div>
                                                                        <div>
                                                                            <strong>City:</strong> {`${order.pickup_city}, ${order.pickup_state} - ${order.pickup_pincode}` || "N/A"}
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
                                                    {new Date(order.created_at).toLocaleString("en-IN", {
                                                        timeZone: "Asia/Kolkata",
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    })}
                                                </p>
                                                <p className="text-s text-gray-400 dark:text-white">
                                                    <span>MID: {order.merchant_id}</span>
                                                    
                                                            <span
                                                            className={`ml-2 inline-flex items-center gap-1.5 rounded-full border border-dashed px-2.5 py-1 text-[11px] font-semibold ${
                                                                order?.rider_preference === "daakit"
                                                                ? "border-blue-200 bg-blue-50 text-[#0446DB] dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400"
                                                                : "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400"
                                                            }`}
                                                            >
                                                            <span
                                                                className={`h-1.5 w-1.5 rounded-full ${
                                                                order?.rider_preference === "daakit"
                                                                    ? "bg-[#0446DB]"
                                                                    : "bg-violet-500"
                                                                }`}
                                                            />

                                                            {order?.rider_preference === "daakit" ? "DDN" : "BYOB"}
                                                            </span>

                                                </p>

                                                <p className="text-s text-gray-400 dark:text-white">
                                                    MOID: {order.merchant_order_id?.length <= 20
                                                        ? order.merchant_order_id
                                                        : `${order.merchant_order_id.slice(0, 20)}...`}
                                                        
                                                    <button
                                                        className="pl-2 text-lg text-gray-600 dark:text-white hover:text-[#0446DB] transition"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(order.merchant_order_id);
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
                                                    
                                                    {/* <span className="bg-[#0446DB] px-2 text-white rounded">{order.rider_preference === 'daakit' ? "Daakit" : "Self"}</span> */}
                                                </p>
                                            </div>
                                        </TableCell>
                                        {/* SELLER DETAILS */}
                            <TableCell className=" py-2">
                              <div className="flex flex-col  text-sm">
                                <p className="text-gray-700 dark:text-gray-300">
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    Merchant ID:
                                  </span>{" "}
                                  {order?.merchant_id ?? "N/A"}
                                </p>
                                
                                {order?.brand_name && (
                                  <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-medium text-gray-900 dark:text-white">
                                      Brand Name:
                                    </span>{" "}
                                    {order?.brand_name}
                                  </p>
                                )}
                              

                                {order?.merchant_company_name && (
                                  <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-medium text-gray-900 dark:text-white">
                                      Company Name:
                                    </span>{" "}
                                    {order.merchant_company_name}
                                  </p>
                                )}
                                
                              </div>
                            </TableCell>
                                        <TableCell>
                                            <p className="font-medium text-gray-800 dark:text-white">{order.delivery_contact_name}</p>
                                            <HoverCard>
                                                <HoverCardTrigger>{order.delivery_address_line.slice(0, 30)}...</HoverCardTrigger>
                                                <HoverCardContent className='bg-[#0446DB] text-white'>
                                                    {order.delivery_address_line}, {order.delivery_city}, {order.delivery_state} - {order.delivery_pincode}
                                                </HoverCardContent>
                                            </HoverCard>
                                            <p className="text-xs text-gray-500 dark:text-white">
                                                {order.delivery_city}, {order.delivery_state} - {order.delivery_pincode}, {order.delivery_country}
                                            </p>
                                            
                                        </TableCell>
                                        <TableCell>
                                            <p>
                                                <span className="whitespace-nowrap dark:text-white">EDD: {order.EDD}</span>
                                            </p>
                                            

                                            <p>
                                <span className="font-medium text-gray-800 dark:text-white">
                                  Weight Slab:
                                </span>
                              
                                

                                {selectedStatus !== "cancelled" && (
                                  <span
                                    className={`ml-2 px-2 py-0.5 rounded-full text-sm font-semibold shadow-sm ${
                                      order?.order_specific === "NDD"
                                        ? "text-green-800 bg-green-100 border border-green-300"
                                        : order?.order_specific === "SDD"
                                          ? "text-yellow-800 bg-yellow-100 border border-yellow-300"
                                          : order?.order_specific === "Turant"
                                            ? "text-red-800 bg-red-100 border border-red-300 animate-blink"
                                            : "text-gray-800 bg-gray-100 border border-gray-300"
                                    }`}
                                  >
                                    {order?.order_specific || "N/A"}
                                  </span>
                                )}
                              </p>
                              {order?.order_type && (
                                  <p className="flex whitespace-nowrap mt-1 items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <span className="font-medium text-gray-900 dark:text-white">
                                      Payment Details:
                                    </span>

                                    <span
                                      className={`inline-flex items-center gap-2  text-xs font-bold ${
                                        order.order_type.toUpperCase() === "COD"
                                          ? " text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300"
                                          : order.order_type.toUpperCase() === "PREPAID"
                                            ? " text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                            : "border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                      }`}
                                    >
                                      

                                      <span className="font-extrabold">
                                        {Number(order.total_amount || 0).toLocaleString("en-IN", {
                                          style: "currency",
                                          currency: "INR",
                                          maximumFractionDigits: 2,
                                        })}
                                      </span>

                                      <span className="opacity-40">|</span>

                                      {order.order_type.toUpperCase() === "COD"
                                        ? "COD"
                                        : order.order_type.toUpperCase() === "PREPAID"
                                          ? "Prepaid"
                                          : order.order_type}
                                    </span>
                                  </p>
                                )}
                                            <p>
                                                <span className="font-medium dark:text-white text-gray-800">Dimensions:</span>
                                                <span className="dark:text-white"> {order.package_length}x{order.package_breadth}x{order.package_height}</span>
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <span className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer">
                                                Not Assigned
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {isOpenIndividualVendorAssignmnet !== order.id ? (
                                                <span
                                                    onClick={() => {
                                                        if (order.tpc_awb_number !== null) return;
                                                        if (order.rider_preference === 'daakit') {
                                                            fetchVendor([order.id]);
                                                            setIsOpenIndividualVendorAssignmnet(order.id);
                                                        }
                                                    }}
                                                    className={`px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium ${order.tpc_awb_number !== null || order.rider_preference !== 'daakit'
                                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        : "bg-red-100 text-red-600 cursor-pointer"
                                                        } mb-2 inline-block`}
                                                >
                                                    {order.tpc_awb_number !== null ? "Mapped" : "Not Mapped"}
                                                </span>
                                            ) : (
                                                <form
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        if (!assignmentState) {
                                                            toast.warn("Please select a vendor");
                                                            return;
                                                        }
                                                        assignVendor(order.id, assignmentState);
                                                    }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <select
                                                        value={assignmentState}
                                                        onChange={(e) => setAssignmentState(e.target.value)}
                                                        className="border px-2 py-1 rounded-md"
                                                        required
                                                    >
                                                        <option value="" disabled>Select Vendor</option>
                                                        {vendor.map((vendor) => (
                                                            <option key={vendor.vendor_id} value={vendor.vendor_id}>
                                                                {vendor.vendor_id} : {vendor.vendor_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button type="submit" className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800">
                                                        Assign
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="text-xs text-gray-500 hover:underline"
                                                        onClick={() => {
                                                            setIsOpenIndividualVendorAssignmnet("");
                                                            setAssignmentState("");
                                                        }}
                                                    >
                                                        Close
                                                    </button>
                                                </form>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 mb-2 inline-block cursor-pointer">
                                                {order?.status
                                                    ?.toLowerCase()
                                                    ?.split(" ")
                                                    ?.map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                    ?.join(" ")
                                                }
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            


                                            
                                                <div className="max-w-[220px] px-3 py-2">
                                                    {order?.tpc_awb_number != null ? (
                                                    <span className="block text-center text-gray-400">-</span>
                                                    ) : (() => {
                                                    const vendors = String(order?.eligible_vendors || "")
                                                        .split(",")
                                                        .map((v) => v.trim())
                                                        .filter(Boolean);

                                                    if (!vendors.length) {
                                                        return (
                                                        <span className="block text-center text-gray-400">-</span>
                                                        );
                                                    }

                                                    return (
                                                        <HoverCard openDelay={150} closeDelay={150}>
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
                                                            {vendors?.map((vendor, index) => (
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
                                                                {vendors.length !== 1 ? "s" : ""} found
                                                            </p>
                                                            </div>
                                                        </HoverCardContent>
                                                        </HoverCard>
                                                    );
                                                    })()}
                                                </div>

                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </table>
                </div>

            {totalPages > 1 && (
                <div className="mt-auto flex shrink-0 items-center justify-between border-t border-gray-200 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900">
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
        </div>
    );
}

export default BookOrders;


