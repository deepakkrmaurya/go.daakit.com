
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
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
// import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaRegCopy } from "react-icons/fa";
// import { TbFileInfo } from "react-icons/tb";
// import { CiCircleCheck } from "react-icons/ci";

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
// const baseURL = import.meta.env.VITE_BASE_URL;
// const frontEndURL = import.meta.env.VITE_FRONTEND_URL;
// function BookOrders() {
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
//         order_specific: "",
//         pincode: ""

//     });

//     const [totalOrders, setTotalOrders] = useState(0);
//     const [selectedStatus, setSelectedStatus] = useState("All");


//     const status = [
//         "All",
//         "booked",
//         "picked",

//     ];
//     const navigate = useNavigate()

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
//                     status: selectedStatus == "All" ? " " : selectedStatus
//                 },
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });
//             setOrders(res?.data?.data || []);
//             setTotalOrders(res?.data?.data?.length)
//             setTotalPages(res.data?.pagination.totalPages || 1);
//         } catch (err) {
//             setLoading(false);
//             setOrders([]);
//             toast.error(err.response?.data?.message || err.message || "An error occurred while fetching orders.");
//         } finally {
//         }
//     };

//     const [vendorList, setVendorList] = useState([])
//     const getAllVendors = async () => {


//         setLoading(true);
//         try {
//             const res = await axios.get(`${baseURL}/api/admin/getAllVendors`, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });

//             setVendorList(res.data.data || [])
//         } catch (err) {
//             setVendorList([]);
//             toast.error(err.response?.data?.message || err.message || "An error occurred while fetching orders.");
//         } finally {
//             setLoading(false);
//         }
//     };

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
//             const res = await axios.get(`${baseURL}/api/admin/getEligibleVendorsByOrders?order_id=${order_ids}`, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 }
//             });


//             setVendor(res.data.data || []);
//             if (res.data.data.length == 0) {
//                 setSelectedBulkOrders([]);
//                 setBulkOrderWeight(0);


//                 setFetchBulkAssignmentVendor(false);

//             }
//         } catch (err) {
//             setVendor([])
//             toast.error(err.response?.data?.message || err.message || "Failed to load riders");
//         } finally {
//             setLoading(false);
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
//             fetchOrders();
//             //   setAssignmentState("");
//             //   setSelectedBulkOrders([]);
//             //   setBulkOrderWeight(0);
//             //   setFetchBulkAssignmentRider(false);
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
//                 `${baseURL}/api/admin/assignOrderToVendor`,
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
//             toast.error("Failed to assign vendor");
//             return
//         } finally {
//             setLoading(false);
//         }
//     };

//     function toCapitalizeEachWord(str) {
//         return str
//             .split(" ")
//             .map((word) => {
//                 if (!word) return "";
//                 return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//             })
//             .join(" ");
//     }



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
//         getAllVendors()
//         // const today = new Date();
//         // const oneMonthAgo = new Date();
//         // oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
//         // setAdvanceFilters({
//         //     endDate: today.toISOString().split("T")[0],
//         //     startDate: oneMonthAgo.toISOString().split("T")[0],
//         //     awbNumber: "",
//         //     vendor_id: "",
//         // });
//         fetchOrders();
//     }, [page, limit, selectedStatus]);

//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setAdvanceFilters(prev => ({ ...prev, [name]: value }));
//     };

//     const applyFilters = () => {
//         setPage(1);
//         fetchOrders();
//     };

//     const clearFilters = () => {
//         const emptyFilters = {
//             startDate: "",
//             endDate: "",
//             awbNumber: "",
//             vendor_id: "",
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

//     return (
//         <div className="">
//             <div className="sticky top-0 left-0  z-10 bg-[#0446DB] dark:border-b dark:border-[#0446DB] dark:bg-gray-900 py-4 md:py-6 shadow-md ">
//                 <div className="  mx-auto px-8  ">
//                     {/* Mobile Layout */}
//                     <div className="  flex flex-col space-y-4">
//                         {/* Top Row: Heading and Buttons */}
//                         <div className="flex items-center justify-between">
//                             <h1 className="text-xl font-bold text-white">Assignment Console</h1>

//                             <div className="flex items-center gap-2">
//                                 <Drawer direction="right">
//                                     <DrawerTrigger asChild>
//                                         <Button variant="outline"
//                                             className="bg-white text-[#0446DB] font-medium px-5 py-2.5 rounded-lg shadow hover:bg-indigo-100 hover:shadow-lg transition flex items-center gap-2"
//                                         >
//                                             <FaFilter className="text-sm" />
//                                             <span>Filter</span>
//                                         </Button>
//                                     </DrawerTrigger>
//                                     <DrawerContent>
//                                         <DrawerHeader>
//                                             <DrawerTitle>Filter Orders</DrawerTitle>
//                                         </DrawerHeader>
//                                         <div className="p-6">
//                                             <div className="grid grid-cols-1 gap-4">
//                                                 <Field className="mx-auto w-full">
//                                                     <FieldLabel htmlFor="date">Start Date</FieldLabel>
//                                                     <Popover open={open} onOpenChange={setOpen}>
//                                                         <PopoverTrigger asChild>
//                                                             <Button
//                                                                 variant="outline"
//                                                                 id="date"
//                                                                 className="justify-start w-full font-normal"
//                                                             >

//                                                                 {advanceFilters.startDate ? formatToDMY(advanceFilters.startDate) : "Select date"}
//                                                             </Button>
//                                                         </PopoverTrigger>
//                                                         <PopoverContent className="w-auto overflow-hidden p-0" align="start">
//                                                             <Calendar
//                                                                 mode="single"
//                                                                 selected={advanceFilters.startDate}
//                                                                 defaultMonth={advanceFilters.startDate}
//                                                                 captionLayout="dropdown"
//                                                                 onSelect={(date) => {
//                                                                     const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)
//                                                                         .toString()
//                                                                         .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
//                                                                     setAdvanceFilters({
//                                                                         ...advanceFilters,
//                                                                         startDate: formattedDate
//                                                                     })
//                                                                     setOpen(false)
//                                                                 }}
//                                                             />
//                                                         </PopoverContent>
//                                                     </Popover>
//                                                 </Field>

//                                                 <div>
//                                                     <Field className="mx-auto w-full"

//                                                     >
//                                                         <FieldLabel htmlFor="date"
//                                                             className='p-0 m-0'
//                                                         >End Date</FieldLabel>
//                                                         <Popover
//                                                             className='p-0 m-0'
//                                                             open={endopen} onOpenChange={setEndOpen}>
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
//                                                 </div>


//                                                 <div>
//                                                     <label className="block text-sm font-bold dark:text-white text-gray-600 mb-1">
//                                                         Order Specific
//                                                     </label>
//                                                     <select
//                                                         value={advanceFilters.order_specific}
//                                                         onChange={(e) => {
//                                                             setAdvanceFilters((prev) => ({
//                                                                 ...prev,
//                                                                 order_specific: e.target.value,
//                                                             }));
//                                                         }}
//                                                         className="w-full border dark:border-gray-700 dark:bg-gray-800 
//       dark:text-white px-3 py-2 rounded-lg text-sm 
//       focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                                     >
//                                                         <option value="">All orders</option>
//                                                         <option value="Turant">Turant</option>
//                                                         <option value="SDD">Same Day Delivery</option>
//                                                         <option value="NDD">Next Day Delivery</option>
//                                                     </select>
//                                                 </div>


//                                                 <div>
//                                                     <label className="block text-sm font-bold dark:text-white text-gray-600 mb-1">
//                                                         Pincode
//                                                     </label>
//                                                     <input
//                                                         type="text"
//                                                         value={advanceFilters.pincode}
//                                                         onChange={(e) =>
//                                                             setAdvanceFilters((prev) => ({
//                                                                 ...prev,
//                                                                 pincode: e.target.value,
//                                                             }))
//                                                         }
//                                                         placeholder="Enter Pincode"
//                                                         className="w-full border dark:border-gray-700 dark:bg-gray-800 
//                           dark:text-white px-3 py-2 rounded-lg text-sm 
//                              focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                                     />
//                                                 </div>

//                                                 <div>
//                                                     <Label htmlFor="awbNumber">AWB Number</Label>
//                                                     <Input
//                                                         id="awbNumber"
//                                                         name="awbNumber"
//                                                         value={advanceFilters.awbNumber}
//                                                         onChange={handleFilterChange}
//                                                         placeholder="Enter AWB number"
//                                                     />
//                                                 </div>

//                                                 <div>
//                                                     <Label htmlFor="vendor_id">Vendor ID</Label>
//                                                     <Input
//                                                         id="vendor_id"
//                                                         name="vendor_id"
//                                                         value={advanceFilters.vendor_id}
//                                                         onChange={handleFilterChange}
//                                                         placeholder="Enter vendor ID"
//                                                     />
//                                                 </div>


//                                                 {/* <div>
//                                                     <Label htmlFor="vendor_id" className="p-0 m-0">
//                                                         Select Vendor
//                                                     </Label>

//                                                     <Select
//                                                         className="m-0 p-0"
//                                                         value={advanceFilters.vendor_id}
//                                                         onValueChange={(value) => {
//                                                             setAdvanceFilters({
//                                                                 ...advanceFilters,
//                                                                 vendor_id: value,
//                                                             });
//                                                         }}
//                                                     >
//                                                         <SelectTrigger className="w-full max-w-full">
//                                                             <SelectValue placeholder="Select Vendor" />
//                                                         </SelectTrigger>

//                                                         <SelectContent>
//                                                             <SelectGroup

//                                                             >
//                                                                 <SelectLabel>Select Vendor</SelectLabel>

//                                                                 {vendorList?.map((v) => (
//                                                                     <SelectItem
//                                                                         key={v.id}
//                                                                         value={String(v.id)}
//                                                                     >
//                                                                         {v.vendor_name}
//                                                                     </SelectItem>
//                                                                 ))}

//                                                             </SelectGroup>
//                                                         </SelectContent>
//                                                     </Select>
//                                                 </div> */}


//                                                 <div>
//                                                     <Combobox
//                                                         items={vendorList?.map(v => v?.vendor_name) || []}
//                                                         value={advanceFilters.vendor_id}
//                                                         onValueChange={(value) => {
//                                                             setAdvanceFilters((prev) => ({
//                                                                 ...prev,
//                                                                 vendor_id: value,
//                                                             }));
//                                                         }}
//                                                     >
//                                                         <ComboboxInput placeholder="Select a Vendor" />
//                                                         <ComboboxContent>
//                                                             <ComboboxEmpty>No Vendor found.</ComboboxEmpty>
//                                                             <ComboboxList>
//                                                                 {(item) => (
//                                                                     <ComboboxItem key={item} value={item}>
//                                                                         {item}
//                                                                     </ComboboxItem>
//                                                                 )}
//                                                             </ComboboxList>
//                                                         </ComboboxContent>
//                                                     </Combobox>
//                                                 </div>






//                                             </div>
//                                         </div>
//                                         <DrawerFooter>
//                                             <Button
//                                                 className='bg-[#564ec1]'

//                                                 onClick={applyFilters}>Apply Filters</Button>
//                                             <DrawerClose asChild>
//                                                 <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
//                                             </DrawerClose>
//                                         </DrawerFooter>
//                                     </DrawerContent>
//                                 </Drawer>
//                             </div>
//                         </div>




//                     </div>


//                 </div>
//             </div>
//             <div className="border rounded-lg">
//                 {selectedBulkOrders.length > 0 && (

//                     <>
//                         <div className="mb-10 bg-white  rounded-xl shadow-lg p-2 border border-gray-200">
//                             <h2 className="text-xl font-bold text-gray-800 mb-3">
//                                 Bulk Orders ({selectedBulkOrders.length} Selected)
//                             </h2>



//                             <div className="overflow-x-auto max-h-[170px] overflow-y-auto">

//                                 <table className="min-w-full h-[30%] table-auto border border-gray-200 rounded-md overflow-hidden">
//                                     <thead className="bg-gray-100 text-gray-600 text-sm font-semibold">
//                                         <tr>
//                                             <th className="px-4 py-3 text-left border-b">
//                                                 Order ID
//                                             </th>
//                                             <th className="px-4 py-3 text-left border-b">
//                                                 Order Weight
//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="text-gray-800 text-sm">
//                                         {selectedBulkOrders.map((order) => (
//                                             <tr key={order.id} className="hover:bg-gray-50">
//                                                 <td className="px-4 py-2 border-b">{order.id}</td>
//                                                 <td className="px-4 py-2 border-b">
//                                                     {Number(order.total_weight).toLocaleString()}g
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                     <tfoot>
//                                         <tr className="bg-indigo-50 text-indigo-700 font-semibold text-sm">
//                                             <td className="px-4 py-2 border-t">Total Weight</td>
//                                             <td className="px-4 py-2 border-t">
//                                                 {Number(bulkOrderWeight).toLocaleString()}g
//                                             </td>
//                                         </tr>
//                                     </tfoot>
//                                 </table>

//                             </div>
//                             <div className="mt-6 flex flex-wrap items-center gap-4">



//                                 {!fetchBulkAssignmentVendor || vendor?.length == 0 ? (
//                                     <button
//                                         onClick={() => {
//                                             setFetchBulkAssignmentVendor(true);
//                                             const order_ids = [...new Set(selectedBulkOrders.map(o => o.id))];
//                                             fetchVendor(order_ids);

//                                         }}
//                                         className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
//                                     >
//                                         Get Available Vendor
//                                     </button>
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
//                                                         className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
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

//                 )}


//                 <div className="w-full  bg-white dark:border dark:border-[#0446DB] rounded   dark:bg-gray-900   left-0 px-4 z-40   ">
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
//                                         // className={`px-4 py-2 rounded-md whitespace-nowrap border transition font-medium flex-shrink-0 ${selectedStatus === st
//                                         //   ? "bg-[#0446DB] text-white shadow-md"
//                                         //   : "bg-white dark:bg-gray-900 dark:text-white border-gray-300 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
//                                         //   }`}
//                                         className={`px-5 py-2.5 rounded-full my-2 border transition-all duration-300 font-medium text-sm tracking-wide ${selectedStatus === st
//                                             ? "bg-[#0446DB] text-white "
//                                             : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]"
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

//                         {/* Gradient overlays to indicate scroll */}
//                         {/* <div className="absolute left-0 top-0 bottom-2 w-10 dark:bg-gray-900 to-transparent pointer-events-none"></div> */}
//                         {/* <div className="absolute right-0 top-0 bottom-2 w-10 dark:bg-gray-900  to-transparent pointer-events-none"></div> */}
//                     </div>
//                 </div>




//                 <Table>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead>
//                                 <div>
//                                     <span>
//                                         <input
//                                             type="checkbox"
//                                             className="w-4 h-4 text-indigo-600 rounded border-gray-300"
//                                             checked={
//                                                 selectedBulkOrders.length === orders.filter((o) => o.tpc_awb_number === null).length

//                                             }
//                                             onChange={toggleSelectAll}
//                                         />
//                                     </span>
//                                 </div>
//                             </TableHead>
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
//                                         <TableCell>
//                                             {

//                                                 ((order.tpc_awb_number == null) && order.tpc_awb_number == null) ? (
//                                                     <div className="px-6 py-4 text-center">
//                                                         <input
//                                                             type="checkbox"
//                                                             checked={isSelected}

//                                                             onChange={(e) => {
//                                                                 const isChecked = e.target.checked;


//                                                                 if (isChecked) {
//                                                                     setSelectedBulkOrders((prev) => {
//                                                                         const updated = [...prev, order];

//                                                                         const order_ids = updated.map((o) => o.id);
//                                                                         fetchVendor(order_ids); // ✅ send all selected IDs

//                                                                         return updated;
//                                                                     });

//                                                                     setBulkOrderWeight(
//                                                                         (prev) => Number(prev) + Number(order.total_weight)
//                                                                     );
//                                                                 } else {
//                                                                     setSelectedBulkOrders((prev) => {
//                                                                         const updated = prev.filter((o) => o.id !== order.id);

//                                                                         const order_ids = updated.map((o) => o.id);
//                                                                         fetchVendor(order_ids);

//                                                                         return updated;
//                                                                     });

//                                                                     setBulkOrderWeight(
//                                                                         (prev) => Number(prev) - Number(order.total_weight) // ✅ fixed bug
//                                                                     );
//                                                                 }

//                                                             }}
//                                                             className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
//                                                         />

//                                                     </div>
//                                                 ) : (
//                                                     <>
//                                                         <span className="px-6 py-4 text-center">
//                                                             -
//                                                         </span>
//                                                     </>
//                                                 )}
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
//                                                                 <h3 className="font-semibold text-[#0446DB] mb-2">
//                                                                     Basic Details
//                                                                 </h3>
//                                                                 <div className="grid grid-cols-2 gap-4">
//                                                                     <div>
//                                                                         <strong>Order ID:</strong> {order.merchant_order_id}
//                                                                         <button
//                                                                             className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
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
//                                                                     <h3 className="font-semibold text-[#0446DB] mb-2">
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
//                                                                     <h3 className="font-semibold text-[#0446DB] mb-2">
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
//                                                         className="pl-2 text-lg text-gray-600 dark:text-white hover:text-[#0446DB] transition"
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
//                                                     <span className="bg-[#0446DB] px-2 text-white rounded">{order.rider_preference === 'daakit' ? "Daakit" : "Self"}</span>
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
//                                                     className='bg-[#0446DB] text-white'
//                                                 >
//                                                     {order.delivery_address_line}, {order.delivery_city}, {order.delivery_state} -{" "}
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
//                                                             {vendor.map((vendor) => (
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
//                                                             className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
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
//                 <div className="flex justify-between items-center py-2 px-3">
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
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegCopy } from "react-icons/fa";
import { TbFileInfo } from "react-icons/tb";
import { CiCircleCheck } from "react-icons/ci";

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
    const [totalOrders, setTotalOrders] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [vendorList, setVendorList] = useState([]);
    const [bulkOrderWeight, setBulkOrderWeight] = useState(0);
    const [canceledBulkOrder, setcanceledBulkOrder] = useState(false);

    const isFirstRender = useRef(true);
    const navigate = useNavigate();

    const status = [
        "All",
        "booked",
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
            const res = await axios.get(`${baseURL}/api/admin/getAllVendors`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
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
            if (res.data.data.length === 0) {
                setSelectedBulkOrders([]);
                setBulkOrderWeight(0);
                setFetchBulkAssignmentVendor(false);
            }
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
            await axios.post(
                `${baseURL}/api/admin/assignOrderToVendor`,
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
            setFetchBulkAssignmentVendor(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to assign vendor");
        } finally {
            setLoading(false);
        }
    };

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
        <div className="">
            <div className="sticky top-0 left-0 z-10 bg-[#0446DB] dark:border-b dark:border-[#0446DB] dark:bg-gray-900 py-4 md:py-6 shadow-md ">
                <div className="mx-auto px-8">
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-bold text-white">Assignment Console</h1>
                            <div className="flex items-center gap-2">
                                <Drawer
                                    open={drawerOpen}
                                    onOpenChange={setDrawerOpen}
                                    direction="right">
                                    <DrawerTrigger asChild>
                                        <Button variant="outline"
                                            className="bg-white text-[#0446DB] font-medium px-5 py-2.5 rounded-lg shadow hover:bg-indigo-100 hover:shadow-lg transition flex items-center gap-2"
                                        >
                                            <FaFilter className="text-sm" />
                                            <span>Filter</span>
                                        </Button>
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
                                                        <Label htmlFor="vendor_id">Vendor ID</Label>
                                                        <Input
                                                            id="vendor_id"
                                                            name="vendor_id"
                                                            value={advanceFilters.vendor_id}
                                                            onChange={handleFilterChange}
                                                            placeholder="Enter vendor ID"
                                                        />
                                                    </div>

                                                    <div>
                                                        <Combobox
                                                            items={vendorList?.map(v => v?.vendor_name) || []}
                                                            value={advanceFilters.vendor_id}
                                                            onValueChange={(value) => {
                                                                setAdvanceFilters((prev) => ({
                                                                    ...prev,
                                                                    vendor_id: value,
                                                                }));
                                                            }}
                                                        >
                                                            <ComboboxInput placeholder="Select a Vendor" />
                                                            <ComboboxContent>
                                                                <ComboboxEmpty>No Vendor found.</ComboboxEmpty>
                                                                <ComboboxList>
                                                                    {(item) => (
                                                                        <ComboboxItem key={item} value={item}>
                                                                            {item}
                                                                        </ComboboxItem>
                                                                    )}
                                                                </ComboboxList>
                                                            </ComboboxContent>
                                                        </Combobox>
                                                    </div>
                                                </div>
                                            </div>
                                            <DrawerFooter>
                                                <Button className='bg-[#564ec1]' onClick={applyFilters}>Apply Filters</Button>
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

            <div className="border rounded-lg">
                {selectedBulkOrders.length > 0 && (
                    <div className="mb-10 bg-white rounded-xl shadow-lg p-2 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-3">
                            Bulk Orders ({selectedBulkOrders.length} Selected)
                        </h2>
                        <div className="overflow-x-auto max-h-[170px] overflow-y-auto">
                            <table className="min-w-full h-[30%] table-auto border border-gray-200 rounded-md overflow-hidden">
                                <thead className="bg-gray-100 text-gray-600 text-sm font-semibold">
                                    <tr>
                                        <th className="px-4 py-3 text-left border-b">Order ID</th>
                                        <th className="px-4 py-3 text-left border-b">Order Weight</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800 text-sm">
                                    {selectedBulkOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 border-b">{order.id}</td>
                                            <td className="px-4 py-2 border-b">
                                                {Number(order.total_weight).toLocaleString()}g
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-indigo-50 text-indigo-700 font-semibold text-sm">
                                        <td className="px-4 py-2 border-t">Total Weight</td>
                                        <td className="px-4 py-2 border-t">
                                            {Number(bulkOrderWeight).toLocaleString()}g
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div className="mt-6 flex flex-wrap items-center gap-4">
                            {!fetchBulkAssignmentVendor || vendor?.length === 0 ? (
                                <button
                                    onClick={() => {
                                        setFetchBulkAssignmentVendor(true);
                                        const order_ids = [...new Set(selectedBulkOrders.map(o => o.id))];
                                        fetchVendor(order_ids);
                                    }}
                                    className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                                >
                                    Get Available Vendor
                                </button>
                            ) : (
                                vendor?.length > 0 && (
                                    <>
                                        <select
                                            className="border border-gray-300 text-sm text-gray-700 px-4 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
                                            value={assignmentState}
                                            onChange={(e) => setAssignmentState(e.target.value)}
                                        >
                                            <option value="">Select Vendor for Bulk Assignment</option>
                                            {vendor.map((vendor) => (
                                                <option key={vendor.vendor_id} value={vendor.vendor_id}>
                                                    {vendor.vendor_id} : {vendor.vendor_name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={async () => {
                                                if (!assignmentState) {
                                                    toast.warn("Please select a vendor");
                                                    return;
                                                }
                                                for (const order of selectedBulkOrders) {
                                                    const result = await assignBulkOrderVendor(
                                                        order.id,
                                                        assignmentState
                                                    );
                                                }
                                            }}
                                            className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                                        >
                                            Bulk Assign
                                        </button>
                                    </>
                                )
                            )}
                            <button
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
                            </button>
                        </div>
                    </div>
                )}

                <div className="w-full bg-white dark:border dark:border-[#0446DB] rounded dark:bg-gray-900 left-0 px-4 z-40">
                    <div className="relative flex justify-center">
                        <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2">
                            <div className="flex gap-2 min-w-max px-8 mt-3">
                                {status.map((st) => (
                                    <Button
                                        key={st}
                                        onClick={() => {
                                            setSelectedBulkOrders([]);
                                            setSelectedStatus(st);
                                            setPage(1);
                                        }}
                                        className={`px-5 py-2.5 rounded-full my-2 border transition-all duration-300 font-medium text-sm tracking-wide ${selectedStatus === st
                                            ? "bg-[#0446DB] text-white"
                                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]"
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
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                {
                                    selectedStatus !== "All" && (

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
                                                                fetchVendor(order_ids);
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
                                                                    fetchVendor(order_ids);
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
                                                <p className="text-s text-gray-400 dark:text-white">Merchant ID: {order.merchant_id}</p>
                                                <p className="text-s text-gray-400 dark:text-white">
                                                    Merchant Order ID: {order.merchant_order_id?.length <= 20
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
                                                    <span className="bg-[#0446DB] px-2 text-white rounded">{order.rider_preference === 'daakit' ? "Daakit" : "Self"}</span>
                                                </p>
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
                                                {order.delivery_city}, {order.delivery_state} - {order.delivery_pincode}
                                            </p>
                                            <p className="text-xs text-gray-400">{order.delivery_country}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p>
                                                <span className="whitespace-nowrap dark:text-white">EDD: {order.EDD}</span>
                                            </p>
                                            <p>
                                                <span className="font-medium text-gray-800 dark:text-white">Weight:</span>
                                                <span className="dark:text-white"> {Number(order.total_weight).toLocaleString()}g</span>
                                                <span
                                                    className={`ml-2 px-2 py-0.5 rounded-full text-sm font-semibold shadow-sm ${order.order_specific?.slice(0, 3) === "NDD"
                                                        ? "text-green-800 bg-green-100 border border-green-300"
                                                        : order.order_specific?.slice(0, 3) === "SDD"
                                                            ? "text-yellow-800 bg-yellow-100 border border-yellow-300"
                                                            : "text-red-800 bg-red-100 border border-red-300 animate-blink"
                                                        }`}
                                                >
                                                    {order.order_specific?.slice(0, 3) === "NDD"
                                                        ? "NDD"
                                                        : order.order_specific?.slice(0, 3) === "SDD"
                                                            ? "SDD"
                                                            : order.order_specific?.slice(0, 6) === "Turant"
                                                                ? "Turant"
                                                                : order.order_specific}
                                                </span>
                                            </p>
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
                                                        <option value="" disabled>Select Vendorr</option>
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
                                            <p className="font-medium bg-orange-100 text-orange-700 text-center px-3 whitespace-nowrap py-1 rounded-full dark:bg-orange-900 dark:text-orange-200">
                                                {order?.tpc_awb_number !== null
                                                    ? "-"
                                                    : order?.eligible_vendors?.split(",").join(" | ")}
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center py-2 px-3">
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
    );
}

export default BookOrders;


