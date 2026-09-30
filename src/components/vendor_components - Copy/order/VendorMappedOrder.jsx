// import axios from 'axios';
// import React, { useEffect, useState } from 'react'
// import toast from 'react-hot-toast';
// import {
//     Drawer,
//     DrawerClose,
//     DrawerContent,

//     DrawerFooter,
//     DrawerHeader,
//     DrawerTitle,
//     DrawerTrigger,
// } from "@/components/ui/drawer"
// import { Button } from "@/components/ui/button"

// import { Field, FieldLabel } from "@/components/ui/field"

// import { Calendar } from "@/components/ui/calendar"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { FaFilter } from 'react-icons/fa';
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/components/ui/popover"
// import { Loader2 } from 'lucide-react';
// const baseURL = import.meta.env.VITE_BASE_URL;
// export default function VendorMappedOrder() {
//     const [isFilterOpen, setIsFilterOpen] = useState(false);
//     const [open, setOpen] = useState(false)
//     const [endopen, setEndOpen] = useState(false)
//     const [orderID, setOrderId] = useState(null)
//     const [loading, setLoading] = useState();
//     const [page, setPage] = useState(1)
//     const [limit, setlimit] = useState(20)
//     const [totalPages, settotalPages] = useState(1)
//     const [newVendorRecords, setNewVendorRecords] = useState([])
//     const [oldVendorRecords, setOldVendorRecords] = useState([])
//     const [tab, setTab] = useState("newvendor");
//     const [advanceFilters, setAdvanceFilters] = useState({
//         startDate: "",
//         endDate: "",
//         awbNumber: "",
//     });

//     const formatToDMY = (dateStr) => {
//         if (!dateStr) return "";

//         const date = new Date(dateStr);

//         const dd = String(date.getDate()).padStart(2, "0");
//         const mm = String(date.getMonth() + 1).padStart(2, "0");
//         const yyyy = date.getFullYear();

//         return `${dd}/${mm}/${yyyy}`;
//     };

//     const getAllNewMappedOrders = async () => {

//         setLoading(true);
//         try {
//             const res = await axios.get(
//                 `${baseURL}/api/vendor/getAllNewMappedOrders`,
//                 {
//                     params: {
//                         page,
//                         limit,
//                         awb_number: advanceFilters.awbNumber,
//                         startDate: advanceFilters.startDate,
//                         endDate: advanceFilters.endDate,
//                     },
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                 }
//             );

//             setNewVendorRecords(res?.data?.data?.newVendorRecords)
//             setOldVendorRecords(res?.data?.data?.oldVendorRecords)


//         } catch (err) {
//             toast.error(err.response?.data?.message || err.message || "An error occurred while fetching orders.");
//         } finally {
//             setLoading(false);
//         }
//     };


//     const pickupOrderFromOldVendor = async (order_id) => {
//         try {
//             const res = await axios.post(
//                 `${baseURL}/api/vendor/pickupOrderFromOldVendor`,
//                 {
//                     order_id
//                 },
//                 {

//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                 }
//             );

//             toast.success(res.data.message || "")

//             getAllNewMappedOrders()
//             setOrderId(null)
//             setTab("newvendor")
//             return
//         } catch (error) {
//             toast.error(error?.response?.data.message)
//             return
//         }
//     }
//     const handoverOrderToNewVendor = async (order_id) => {
//         try {
//             const res = await axios.post(
//                 `${baseURL}/api/vendor/handoverOrderToNewVendor`,
//                 {
//                     order_id
//                 },
//                 {

//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                 }
//             );
//             toast.success(res.data.message || "")
//             getAllNewMappedOrders()
//             setOrderId(null)
//             setTab("oldvendor")
//             return
//         } catch (error) {

//             toast.error(error?.response?.data.message)
//         }
//     }

//     const resetAdvanceFilters = async () => {
//         const today = new Date();
//         const oneMonthAgo = new Date();
//         oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

//         setAdvanceFilters({
//             endDate: today.toISOString().split("T")[0],
//             startDate: oneMonthAgo.toISOString().split("T")[0],
//             awbNumber: "",

//         });
//         getAllNewMappedOrders()
//     };

//     useEffect(() => {
//         getAllNewMappedOrders()
//     }, [])

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
//                  <div className=" w-full h-[90vh] flex justify-center items-center">
//           <div>
//             <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//             <p className="mt-2">Loading Mapped Orders...</p>
//           </div>
//         </div>
//             ):(
//             <div className="bg-gray-100  dark:bg-gray-900 min-h-screen w-full">

//                 <div className="sticky top-0 left-0  z-10  dark:bg-neutral-900 py-4 md:py-6  ">
//                     <div className="  mx-auto px-8  ">
//                         {/* Mobile Layout */}
//                         <div className="  flex flex-col space-y-4">
//                             {/* Top Row: Heading and Buttons */}
//                             <div className="flex items-center justify-between">
//                                 <h1 className="text-xl font-bold dark:text-white">New Mapped Orders</h1>

//                                 <div className="flex items-center gap-2">

//                                     <Drawer direction="right"
//                                         open={isFilterOpen}
//                                         onOpenChange={setIsFilterOpen}
//                                     >
//                                         <DrawerTrigger asChild>
//                                             <Button variant="outline"

//                                                 className="bg-white text-[#0446DB] font-medium px-5 py-2.5 rounded-sm shadow hover:bg-indigo-100 hover:shadow-lg transition flex items-center gap-2"
//                                             >
//                                                 <FaFilter className="text-sm" />
//                                                 <span>Filter</span>
//                                             </Button>
//                                         </DrawerTrigger>
//                                         <DrawerContent>
//                                             <DrawerHeader>
//                                                 <DrawerTitle>Filter</DrawerTitle>
//                                                 {/* <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}
//                                             </DrawerHeader>
//                                             <div className="no-scrollbar overflow-y-auto px-4">
//                                                 <form onSubmit={(e) => {e.preventDefault()

//                                                     setIsFilterOpen(false);
//                                                 }}
//                                                     className=" w-full"
//                                                 >
//                                                     <div className="gap-y-2 mb-2">

//                                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
//                                                             <Field className="mx-auto w-full">
//                                                                 <FieldLabel htmlFor="enddate">Start Date</FieldLabel>
//                                                                 <Popover open={open} onOpenChange={setOpen}>
//                                                                     <PopoverTrigger asChild>
//                                                                         <Button
//                                                                             variant="outline"
//                                                                             id="enddate"
//                                                                             className="justify-start w-full font-normal"
//                                                                         >
//                                                                             {advanceFilters.startDate ? formatToDMY(advanceFilters.startDate) : "Select date"}
//                                                                         </Button>
//                                                                     </PopoverTrigger>
//                                                                     <PopoverContent className="w-auto overflow-hidden p-0" align="start">
//                                                                         <Calendar
//                                                                             mode="single"
//                                                                             selected={advanceFilters.startDate}
//                                                                             defaultMonth={advanceFilters.startDate}
//                                                                             captionLayout="dropdown"
//                                                                             onSelect={(date) => {
//                                                                                 const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)
//                                                                                     .toString()
//                                                                                     .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
//                                                                                 setAdvanceFilters({
//                                                                                     ...advanceFilters,
//                                                                                     startDate: formattedDate
//                                                                                 })
//                                                                                 setOpen(false)
//                                                                             }}
//                                                                         />
//                                                                     </PopoverContent>
//                                                                 </Popover>
//                                                             </Field>

//                                                             <Field className="mx-auto w-full">
//                                                                 <FieldLabel htmlFor="enddate">End Date</FieldLabel>
//                                                                 <Popover open={endopen} onOpenChange={setEndOpen}>
//                                                                     <PopoverTrigger asChild>
//                                                                         <Button
//                                                                             variant="outline"
//                                                                             id="enddate"
//                                                                             className="justify-start w-full font-normal"
//                                                                         >

//                                                                             {advanceFilters.endDate ? formatToDMY(advanceFilters.endDate) : "Select date"}
//                                                                         </Button>
//                                                                     </PopoverTrigger>
//                                                                     <PopoverContent className="w-auto overflow-hidden p-0" align="start">
//                                                                         <Calendar
//                                                                             mode="single"
//                                                                             selected={advanceFilters.startDate}
//                                                                             defaultMonth={advanceFilters.startDate}
//                                                                             captionLayout="dropdown"
//                                                                             onSelect={(date) => {
//                                                                                 const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)
//                                                                                     .toString()
//                                                                                     .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
//                                                                                 setAdvanceFilters({
//                                                                                     ...advanceFilters,
//                                                                                     endDate: formattedDate
//                                                                                 })
//                                                                                 setEndOpen(false)
//                                                                             }}
//                                                                         />
//                                                                     </PopoverContent>
//                                                                 </Popover>
//                                                             </Field>

//                                                         </div>


//                                                         <div className=" mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

//                                                             <div>
//                                                                 <label className="block text-xs dark:text-white text-gray-600 mb-1">
//                                                                     AWB Number(s)
//                                                                 </label>
//                                                                 <input
//                                                                     type="text"
//                                                                     value={advanceFilters.awbNumber}
//                                                                     onChange={(e) =>
//                                                                         setAdvanceFilters((prev) => ({
//                                                                             ...prev,
//                                                                             awbNumber: e.target.value,
//                                                                         }))
//                                                                     }
//                                                                     placeholder="AWB Number(s)"
//                                                                     className="w-full border dark:border-gray-700 dark:bg-gray-800 
//                                                                                         dark:text-white px-3 py-2 rounded-sm text-sm 
//                                                                                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                                                 />
//                                                             </div>
//                                                         </div>















//                                                     </div>

//                                                     <div className=" w-full flex">
//                                                         <button
//                                                             type="submit"
//                                                             onClick={() => {
//                                                                 getAllNewMappedOrders()
//                                                             }}
//                                                             className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
//                                                         >
//                                                             Filter
//                                                         </button>
//                                                         <button
//                                                             onClick={() => {
//                                                                 resetAdvanceFilters();

//                                                             }}
//                                                             className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
//                                                         >
//                                                             Reset
//                                                         </button>
//                                                     </div>
//                                                 </form>
//                                             </div>
//                                             <DrawerFooter>

//                                                 <DrawerClose asChild>
//                                                     <Button variant="outline">Cancel</Button>
//                                                 </DrawerClose>
//                                             </DrawerFooter>
//                                         </DrawerContent>
//                                     </Drawer>
//                                 </div>
//                             </div>



//                         </div>


//                     </div>
//                 </div>

//                 <div className="mx-0 z-10 md:px-1 -mt-4 md:-mt-0 bg-white dark:bg-gray-900 rounded-md">






//                     {/* Table */}
//                     <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-sm shadow">
//                         {loading ? (
//                             <div className="text-center py-10 text-gray-600">
//                                 Loading...
//                             </div>
//                         ) : (

//                             <>
//                                 <Tabs defaultValue={tab} >
//                                     <div className="w-full flex justify-center items-center  mt-5 md:my-3">
//                                         <TabsList className="bg-gray-300 w-[90%] md:w-[20%] justify-center rounded">
//                                             <TabsTrigger value="newvendor" className="flex-1 h-9 rounded-sm flex items-center justify-center text-sm font-medium transition-all duration-300 data-[state=active]:bg-[#0446DB] data-[state=active]:text-white data-[state=active]:shadow text-[#0446DB] cursor-pointer">
//                                                 New Vendor
//                                             </TabsTrigger>
//                                             <TabsTrigger value="oldvendor" className="flex-1 h-9 rounded-sm flex items-center justify-center text-sm font-medium transition-all duration-300 data-[state=active]:bg-[#0446DB] data-[state=active]:text-white data-[state=active]:shadow text-[#0446DB] cursor-pointer">
//                                                 Old Vendor
//                                             </TabsTrigger>
//                                         </TabsList>
//                                     </div>
//                                     <TabsContent value="newvendor">
//                                         <div className="relative -mx-4 sm:-mx-6 lg:mx-0">
//                                             <div className="w-full overflow-x-auto overscroll-x-contain">

//                                                 <table className="min-w-[400px] lg:min-w-full divide-y divide-gray-200">
//                                                     <thead className="bg-gray-100 dark:bg-gray-900 text-gray-600 text-sm font-semibold">
//                                                         <tr>

//                                                             <th className="text-center whitespace-nowrap px-6 py-3">ORDER ID</th>
//                                                             <th className="text-center whitespace-nowrap px-6 py-3">AWB NUMBER</th>
//                                                             <th className="text-center whitespace-nowrap px-6 py-3">NEW VENDOR REMARKS</th>
//                                                             <th className="text-center whitespace-nowrap px-6 py-3">NEW VENDOR STATUS</th>

//                                                         </tr>
//                                                     </thead>
//                                                     <tbody className="text-gray-700 text-sm">
//                                                         {loading ? (
//                                                             <>
//                                                                 <div className="w-full h-screen flex justify-center items-center">
//                                                                     <span className="loader"></span>
//                                                                 </div>

//                                                             </>
//                                                         ) : newVendorRecords.length > 0 ? (
//                                                             newVendorRecords.map((order) => (
//                                                                 <tr
//                                                                     key={order.id}
//                                                                     className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b overflow-x-scroll"
//                                                                 >
//                                                                     <td className="px-6 py-4 text-center">{order.order_id || "-"}</td>
//                                                                     <td className="px-6 py-4 text-center">{order.awb_number || "-"}</td>
//                                                                     <td className="px-6 py-4 text-center">{order.new_vendor_remarks || "-"}</td>
//                                                                     {
//                                                                         order?.new_vendor_status === 'picked' ? (
//                                                                             <>
//                                                                                 <td className="px-6 py-4 text-center">
//                                                                                     <span

//                                                                                         className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 mb-2 inline-block cursor-pointer">
//                                                                                         Picked
//                                                                                     </span>
//                                                                                 </td>
//                                                                             </>
//                                                                         ) : order.order_id === orderID ? (
//                                                                             <>

//                                                                                 <td className="px-6 py-4 text-center">
//                                                                                     <Button
//                                                                                         onClick={() => {
//                                                                                             pickupOrderFromOldVendor(order.order_id)
//                                                                                         }}
//                                                                                         className="px-3  rounded text-xs bg-[#564ec1] font-medium  mb-2 inline-block cursor-pointer">
//                                                                                         Picked
//                                                                                     </Button>
//                                                                                     <Button
//                                                                                         onClick={() => {
//                                                                                             setOrderId(null)
//                                                                                         }}
//                                                                                         className="px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer">
//                                                                                         Close
//                                                                                     </Button>
//                                                                                 </td>


//                                                                             </>
//                                                                         ) : order.old_vendor_status == 'handovered' ? (
//                                                                             <>
//                                                                                 <td className="px-6 py-4 text-center">

//                                                                                     <span
//                                                                                         onClick={() => {
//                                                                                             if (order.old_vendor_status === 'to be handover') {
//                                                                                                 return
//                                                                                             }
//                                                                                             setOrderId(order.order_id)

//                                                                                         }}


//                                                                                         className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer">
//                                                                                         {order.new_vendor_status}
//                                                                                     </span>
//                                                                                 </td>
//                                                                             </>
//                                                                         ) : (
//                                                                             <>
//                                                                                 <td className="px-6 py-4 text-center">

//                                                                                     <span
//                                                                                         // onClick={() => {
//                                                                                         //     if (order.old_vendor_status === 'to be handover') {
//                                                                                         //         return
//                                                                                         //     }
//                                                                                         //     setOrderId(order.order_id)

//                                                                                         // }}

//                                                                                         className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer">
//                                                                                         {order.new_vendor_status}
//                                                                                     </span>
//                                                                                     {/* <Dialog>
//                                                                                     <form>
//                                                                                         <DialogTrigger asChild>
//                                                                                             <Button variant="outline" className="p-0  px-3  rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer ">
//                                                                                                 <span >
//                                                                                                     {order.new_vendor_status || "-"}
//                                                                                                 </span>
//                                                                                             </Button>
//                                                                                         </DialogTrigger>
//                                                                                         <DialogContent className="sm:max-w-sm">
//                                                                                             <DialogHeader>
//                                                                                                 <DialogTitle>Pickup Order</DialogTitle>
//                                                                                                 <DialogDescription>
//                                                                                                     Make changes to your profile here. Click save when you&apos;re
//                                                                                                     done.
//                                                                                                 </DialogDescription>
//                                                                                             </DialogHeader>
//                                                                                             <FieldGroup>
//                                                                                                 <Field>
//                                                                                                     <Label htmlFor="name-1">Select Vendor</Label>
//                                                                                                     <Select>
//                                                                                                         <SelectTrigger className="w-full max-w-full">
//                                                                                                             <SelectValue placeholder="Select a fruit" />
//                                                                                                         </SelectTrigger>
//                                                                                                         <SelectContent>
//                                                                                                             <SelectGroup>
//                                                                                                                 <SelectLabel>Fruits</SelectLabel>
//                                                                                                                 <SelectItem value="apple">Apple</SelectItem>
//                                                                                                                 <SelectItem value="banana">Banana</SelectItem>
//                                                                                                                 <SelectItem value="blueberry">Blueberry</SelectItem>
//                                                                                                                 <SelectItem value="grapes">Grapes</SelectItem>
//                                                                                                                 <SelectItem value="pineapple">Pineapple</SelectItem>
//                                                                                                             </SelectGroup>
//                                                                                                         </SelectContent>
//                                                                                                     </Select>
//                                                                                                 </Field>
//                                                                                                 <Field>
//                                                                                                     <Label htmlFor="username-1">Remarks</Label>
//                                                                                                     <Input id="username-1" name="username" placeholder="Enter Remarks" />
//                                                                                                 </Field>
//                                                                                             </FieldGroup>
//                                                                                             <DialogFooter>
//                                                                                                 <DialogClose asChild>
//                                                                                                     <Button variant="outline">Cancel</Button>
//                                                                                                 </DialogClose>
//                                                                                                 <Button type="submit">Save changes</Button>
//                                                                                             </DialogFooter>
//                                                                                         </DialogContent>
//                                                                                     </form>
//                                                                                 </Dialog> */}


//                                                                                 </td>
//                                                                             </>
//                                                                         )




//                                                                     }

//                                                                 </tr>
//                                                             ))
//                                                         ) : (
//                                                             <tr>
//                                                                 <td colSpan="10" className="text-center px-6 py-6 text-gray-500">
//                                                                     No orders found.
//                                                                 </td>
//                                                             </tr>
//                                                         )}
//                                                     </tbody>
//                                                 </table>


//                                             </div>
//                                         </div>
//                                     </TabsContent>
//                                     <TabsContent value="oldvendor">
//                                         <div className="relative -mx-4 sm:-mx-6 lg:mx-0">
//                                             <div className="w-full overflow-x-auto overscroll-x-contain">

//                                                 <table className="min-w-[400px] lg:min-w-full divide-y divide-gray-200">
//                                                     <thead className="bg-gray-100 dark:bg-gray-900 text-gray-600 text-sm font-semibold">
//                                                         <tr>

//                                                             <th className="text-center whitespace-nowrap px-6 py-3">ORDER ID</th>
//                                                             <th className="text-center whitespace-nowrap px-6 py-3">AWB Number</th>
//                                                             <th className="text-center whitespace-nowrap px-6 py-3">OLD VENDOR REMARKS</th>
//                                                             <th className="text-center whitespace-nowrap px-6 py-3">OLD VENDOR STATUS</th>
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody className="text-gray-700 text-sm">
//                                                         {oldVendorRecords?.length > 0 ? (
//                                                             oldVendorRecords?.map((order) => (
//                                                                 <tr
//                                                                     key={order.id}
//                                                                     className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b overflow-x-scroll"
//                                                                 >


//                                                                     <td className="px-6 py-4 text-center">{order.order_id || "-"}</td>
//                                                                     <td className="px-6 py-4 text-center">{order.awb_number || "-"}</td>
//                                                                     <td className="px-6 py-4 text-center">{order.old_vendor_remarks || "-"}</td>
//                                                                     {
//                                                                         orderID === order.order_id ? (
//                                                                             <>


//                                                                                 <td className="px-6 py-4 text-center">
//                                                                                     <Button
//                                                                                         onClick={() => {
//                                                                                             handoverOrderToNewVendor(order.order_id)
//                                                                                         }}
//                                                                                         className="px-3  rounded text-xs bg-[#564ec1] font-medium  mb-2 inline-block cursor-pointer">
//                                                                                         Handover
//                                                                                     </Button>
//                                                                                     <Button
//                                                                                         onClick={() => {
//                                                                                             setOrderId(null)
//                                                                                         }}
//                                                                                         className="px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer">
//                                                                                         Close
//                                                                                     </Button>
//                                                                                 </td>



//                                                                             </>
//                                                                         ) : order.old_vendor_status == 'handovered' ? (
//                                                                             <>
//                                                                                 <td className="px-6 py-4 text-center">
//                                                                                     <span

//                                                                                         className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 mb-2 inline-block cursor-pointer">
//                                                                                         {order.old_vendor_status}
//                                                                                     </span>
//                                                                                 </td>
//                                                                             </>
//                                                                         ) : (
//                                                                             <>
//                                                                                 <td className="px-6 py-4 text-center">
//                                                                                     <span
//                                                                                         onClick={() => {
//                                                                                             setOrderId(order.order_id)
//                                                                                             // handoverOrderToNewVendor(order.order_id)
//                                                                                         }}
//                                                                                         className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer">
//                                                                                         {order.old_vendor_status}
//                                                                                     </span>
//                                                                                 </td>
//                                                                             </>
//                                                                         )
//                                                                     }

//                                                                 </tr>
//                                                             ))
//                                                         ) : (
//                                                             <tr>
//                                                                 <td colSpan="10" className="text-center px-6 py-6 text-gray-500">
//                                                                     No orders found.
//                                                                 </td>
//                                                             </tr>
//                                                         )}
//                                                     </tbody>
//                                                 </table>


//                                             </div>
//                                         </div>
//                                     </TabsContent>
//                                 </Tabs>

//                             </>


//                         )}
//                     </div>
//                     <div className="py-3 flex justify-end gap-4 mx-10">

//                         {/* Pagination Buttons */}
//                         <div className="flex gap-2">

//                             <button
//                                 onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//                                 disabled={page === 1}
//                                 className={`px-4 py-2 rounded-md text-sm font-medium ${page === 1
//                                     ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                                     : "bg-[#0446DB] text-white hover:bg-indigo-800"
//                                     }`}
//                             >
//                                 Previous
//                             </button>

//                             <p className="text-sm text-gray-700 self-center">
//                                 Page {page} of {totalPages}
//                             </p>

//                             <button
//                                 onClick={() =>
//                                     setPage((prev) => Math.min(prev + 1, totalPages))
//                                 }
//                                 disabled={page === totalPages}
//                                 className={`px-4 py-2 rounded-md text-sm font-medium ${page === totalPages
//                                     ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                                     : "bg-[#0446DB] text-white hover:bg-indigo-800"
//                                     }`}
//                             >
//                                 Next
//                             </button>
//                         </div>

//                         {/* Page Size Selector */}
//                         <div className="flex items-center gap-2">
//                             <label className="text-sm font-medium text-gray-700">
//                                 Per Page
//                             </label>

//                             <select
//                                 value={limit}
//                                 onChange={(e) => {
//                                     setlimit(Number(e.target.value)); // ✅ convert to number
//                                     setPage(1); // ✅ reset page when limit changes
//                                 }}
//                                 className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
//                             >
//                                 <option value={10}>10</option>
//                                 <option value={20}>20</option>
//                                 <option value={50}>50</option>
//                                 <option value={100}>100</option>
//                                 <option value={200}>200</option>
//                             </select>
//                         </div>


//                     </div>
//                 </div>
//             </div >
//             )
//          }

//         </>
//     )
// }




import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Handshake,
  Loader2,
  PackageCheck,
  PackageOpen,
  RotateCcw,
  Search,
  Truck,
  X,
} from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;

const toApiDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatToDMY = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${d.getFullYear()}`;
};

const getDefaultFilters = () => {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  return {
    startDate: oneMonthAgo,
    endDate: today,
    awbNumber: "",
  };
};

const statusClass = (status) => {
  const value = String(status || "").toLowerCase();

  if (["picked", "handovered", "completed", "delivered"].includes(value)) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400";
  }

  if (["pending", "to be handover", "to be picked"].includes(value)) {
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400";
  }

  return "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400";
};

const StatusBadge = ({ children }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(
      children
    )}`}
  >
    {children || "-"}
  </span>
);

const EmptyState = ({ message }) => (
  <tr>
    <td colSpan={4} className="px-6 py-16">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-gray-100 dark:bg-neutral-800">
          <PackageOpen className="h-6 w-6 text-gray-400 dark:text-neutral-500" />
        </div>
        <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-neutral-200">
          {message}
        </p>
        <p className="mt-1 text-xs text-gray-400 dark:text-neutral-500">
          Try changing your filters or date range.
        </p>
      </div>
    </td>
  </tr>
);

const TableLoader = () => (
  <tr>
    <td colSpan={4} className="px-6 py-20">
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#0446DB]" />
        <p className="mt-3 text-sm text-gray-500 dark:text-neutral-400">
          Loading mapped orders...
        </p>
      </div>
    </td>
  </tr>
);

const DateFilter = ({
  label,
  value,
  open,
  setOpen,
  onSelect,
  disabled,
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
      {label}
    </label>

    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full justify-start gap-2 rounded-sm border-gray-200 bg-white px-3 font-normal text-gray-700 shadow-none hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          <CalendarDays className="h-4 w-4 text-[#0446DB]" />
          {value ? formatToDMY(value) : "Select date"}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto overflow-hidden rounded-sm border-gray-200 p-0 shadow-xl dark:border-neutral-700"
        align="start"
      >
        <Calendar
          mode="single"
          selected={value || undefined}
          defaultMonth={value || undefined}
          disabled={disabled}
          onSelect={(date) => {
            if (!date) return;
            onSelect(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  </div>
);

export default function VendorMappedOrder() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const [orderID, setOrderId] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const [newVendorRecords, setNewVendorRecords] = useState([]);
  const [oldVendorRecords, setOldVendorRecords] = useState([]);
  const [tab, setTab] = useState("newvendor");

  const [advanceFilters, setAdvanceFilters] = useState(getDefaultFilters);

  const getAllNewMappedOrders = async (customFilters = advanceFilters) => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${baseURL}/api/vendor/getAllNewMappedOrders`,
        {
          params: {
            page,
            limit,
            awb_number: customFilters.awbNumber?.trim() || "",
            startDate: toApiDate(customFilters.startDate),
            endDate: toApiDate(customFilters.endDate),
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res.data)
      const data = res?.data?.data || {};

      setNewVendorRecords(data?.newVendorRecords || []);
      setOldVendorRecords(data?.oldVendorRecords || []);

      const pages =
        data?.totalPages ??
        res?.data?.totalPages ??
        data?.pagination?.totalPages ??
        1;

      setTotalPages(Math.max(Number(pages) || 1, 1));
    } catch (err) {
      setNewVendorRecords([]);
      setOldVendorRecords([]);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "An error occurred while fetching orders."
      );
    } finally {
      setLoading(false);
    }
  };

  const pickupOrderFromOldVendor = async (order_id) => {
    setActionLoadingId(order_id);

    try {
      const res = await axios.post(
        `${baseURL}/api/vendor/pickupOrderFromOldVendor`,
        { order_id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(res?.data?.message || "Order picked successfully");
      setOrderId(null);
      setTab("newvendor");
      await getAllNewMappedOrders();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to pick order"
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handoverOrderToNewVendor = async (order_id) => {
    setActionLoadingId(order_id);

    try {
      const res = await axios.post(
        `${baseURL}/api/vendor/handoverOrderToNewVendor`,
        { order_id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(res?.data?.message || "Order handed over successfully");
      setOrderId(null);
      setTab("oldvendor");
      await getAllNewMappedOrders();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to handover order"
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const applyFilters = async (e) => {
    e?.preventDefault();

    if (
      advanceFilters.startDate &&
      advanceFilters.endDate &&
      new Date(advanceFilters.startDate) > new Date(advanceFilters.endDate)
    ) {
      toast.error("Start date cannot be after end date");
      return;
    }

    setPage(1);
    setIsFilterOpen(false);
    await getAllNewMappedOrders();
  };

  const resetAdvanceFilters = async () => {
    const defaults = getDefaultFilters();
    setAdvanceFilters(defaults);
    setPage(1);
    setIsFilterOpen(false);
    await getAllNewMappedOrders(defaults);
  };

  useEffect(() => {
    getAllNewMappedOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  useEffect(() => {
    const timer = setTimeout(() => setLoadingPage(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loadingPage) {
    return (
      <div className="flex h-[90vh] w-full items-center justify-center bg-[#f7f8fa] dark:bg-neutral-950">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center ">
            <Loader2 className="h-7 w-7 animate-spin text-[#0446DB]" />
          </div>
          <p className="mt-4 text-sm font-medium text-gray-600 dark:text-neutral-300">
            Loading Mapped Orders...
          </p>
        </div>
      </div>
    );
  }

  const currentCount =
    tab === "newvendor" ? newVendorRecords.length : oldVendorRecords.length;

  return (
    <div className="min-h-screen w-full text-gray-900 dark:bg-neutral-950 dark:text-white">
      {/* Header */}
      <div className="sticky top-0 z-20  dark:bg-neutral-900/90">
        <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-2">
              
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  New Mapped Orders
                </h1>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                  Manage vendor pickup and handover orders
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-sm border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500 sm:block dark:border-neutral-800 dark:bg-neutral-800/70 dark:text-neutral-400">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {currentCount}
              </span>{" "}
              records
            </div>

            <Drawer
              direction="right"
              open={isFilterOpen}
              onOpenChange={setIsFilterOpen}
            >
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 gap-2 rounded-sm border-gray-200 bg-white px-4 text-[#0446DB] shadow-sm hover:border-[#0446DB]/30 hover:bg-[#0446DB]/5 dark:border-neutral-700 dark:bg-neutral-900 dark:text-blue-400 dark:hover:bg-[#0446DB]/10"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DrawerTrigger>

              <DrawerContent className="ml-auto h-full w-full max-w-md rounded-none border-l border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <DrawerHeader className="border-b border-gray-200 px-5 py-5 text-left dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#0446DB]/10 text-[#0446DB] dark:bg-[#0446DB]/20 dark:text-blue-400">
                      <Filter className="h-4 w-4" />
                    </div>
                    <div>
                      <DrawerTitle className="text-lg">
                        Filter Orders
                      </DrawerTitle>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                        Narrow down mapped orders
                      </p>
                    </div>
                  </div>
                </DrawerHeader>

                <form
                  onSubmit={applyFilters}
                  className="flex min-h-0 flex-1 flex-col"
                >
                  <div className="flex-1 space-y-5 overflow-y-auto p-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <DateFilter
                        label="Start Date"
                        value={advanceFilters.startDate}
                        open={startOpen}
                        setOpen={setStartOpen}
                        onSelect={(date) =>
                          setAdvanceFilters((prev) => ({
                            ...prev,
                            startDate: date,
                            endDate:
                              prev.endDate && new Date(prev.endDate) < date
                                ? null
                                : prev.endDate,
                          }))
                        }
                        disabled={(date) => date > new Date()}
                      />

                      <DateFilter
                        label="End Date"
                        value={advanceFilters.endDate}
                        open={endOpen}
                        setOpen={setEndOpen}
                        onSelect={(date) =>
                          setAdvanceFilters((prev) => ({
                            ...prev,
                            endDate: date,
                          }))
                        }
                        disabled={(date) =>
                          date > new Date() ||
                          (advanceFilters.startDate &&
                            date < new Date(advanceFilters.startDate))
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                        AWB Number(s)
                      </label>

                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={advanceFilters.awbNumber}
                          onChange={(e) =>
                            setAdvanceFilters((prev) => ({
                              ...prev,
                              awbNumber: e.target.value,
                            }))
                          }
                          placeholder="Enter AWB number"
                          className="h-11 w-full rounded-sm border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500"
                        />
                      </div>
                    </div>
                  </div>

                  <DrawerFooter className="border-t border-gray-200 bg-gray-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetAdvanceFilters}
                        className="h-11 gap-2 rounded-sm dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reset
                      </Button>

                      <Button
                        type="submit"
                        className="h-11 gap-2 rounded-sm bg-[#0446DB] text-white hover:bg-[#0339b5]"
                      >
                        <Filter className="h-4 w-4" />
                        Apply Filter
                      </Button>
                    </div>

                    <DrawerClose asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        className="mt-1 h-10 gap-2 text-gray-500 dark:text-neutral-400"
                      >
                        <X className="h-4 w-4" />
                        Close
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </form>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5 lg:p-6">
        <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <Tabs
            value={tab}
            onValueChange={(value) => {
              setTab(value);
              setOrderId(null);
            }}
          >
            <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
              <TabsList className="grid h-10 w-full grid-cols-2 rounded-sm bg-gray-100 p-1 sm:w-[320px] dark:bg-neutral-800">
                <TabsTrigger
                  value="newvendor"
                  className="gap-2 rounded-md text-xs font-semibold text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#0446DB] data-[state=active]:shadow-sm dark:text-neutral-400 dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-blue-400"
                >
                  <PackageCheck className="h-4 w-4" />
                  New Vendor
                  <span className="rounded-full bg-[#0446DB]/10 px-1.5 py-0.5 text-[10px] text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                    {newVendorRecords.length}
                  </span>
                </TabsTrigger>

                <TabsTrigger
                  value="oldvendor"
                  className="gap-2 rounded-md text-xs font-semibold text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#0446DB] data-[state=active]:shadow-sm dark:text-neutral-400 dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-blue-400"
                >
                  <Handshake className="h-4 w-4" />
                  Old Vendor
                  <span className="rounded-full bg-[#0446DB]/10 px-1.5 py-0.5 text-[10px] text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                    {oldVendorRecords.length}
                  </span>
                </TabsTrigger>
              </TabsList>

              <p className="text-xs text-gray-400 dark:text-neutral-500">
                Click a pending status to perform the vendor action.
              </p>
            </div>

            {/* New Vendor */}
            <TabsContent value="newvendor" className="m-0">
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/80 dark:border-neutral-800 dark:bg-neutral-800/50">
                      {[
                        "ORDER ID",
                        "AWB NUMBER",
                        "NEW VENDOR REMARKS",
                        "NEW VENDOR STATUS",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="whitespace-nowrap px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                    {loading ? (
                      <TableLoader />
                    ) : newVendorRecords.length === 0 ? (
                      <EmptyState message="No new vendor orders found" />
                    ) : (
                      newVendorRecords.map((order) => (
                        <tr
                          key={order.id}
                          className="transition-colors hover:bg-gray-50/70 dark:hover:bg-neutral-800/40"
                        >
                          <td className="px-5 py-4">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {order.order_id || "-"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-md bg-gray-100 px-2.5 py-1 font-mono text-xs font-medium text-gray-700 dark:bg-neutral-800 dark:text-neutral-300">
                              {order.awb_number || "-"}
                            </span>
                          </td>

                          <td className="max-w-[320px] px-5 py-4 text-sm text-gray-500 dark:text-neutral-400">
                            <span className="line-clamp-2">
                              {order.new_vendor_remarks || "-"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            {order.new_vendor_status === "picked" ? (
                              <StatusBadge>picked</StatusBadge>
                            ) : order.order_id === orderID ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  disabled={actionLoadingId === order.order_id}
                                  onClick={() =>
                                    pickupOrderFromOldVendor(order.order_id)
                                  }
                                  className="h-8 gap-1.5 rounded-md bg-[#0446DB] px-3 text-xs text-white hover:bg-[#0339b5]"
                                >
                                  {actionLoadingId === order.order_id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <PackageCheck className="h-3.5 w-3.5" />
                                  )}
                                  Pick
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setOrderId(null)}
                                  className="h-8 rounded-md px-3 text-xs dark:border-neutral-700"
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : order.old_vendor_status === "handovered" ? (
                              <button
                                type="button"
                                onClick={() => setOrderId(order.order_id)}
                                className="cursor-pointer"
                              >
                                <StatusBadge>
                                  {order.new_vendor_status}
                                </StatusBadge>
                              </button>
                            ) : (
                              <StatusBadge>
                                {order.new_vendor_status}
                              </StatusBadge>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Old Vendor */}
            <TabsContent value="oldvendor" className="m-0">
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/80 dark:border-neutral-800 dark:bg-neutral-800/50">
                      {[
                        "ORDER ID",
                        "AWB NUMBER",
                        "OLD VENDOR REMARKS",
                        "OLD VENDOR STATUS",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="whitespace-nowrap px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                    {loading ? (
                      <TableLoader />
                    ) : oldVendorRecords.length === 0 ? (
                      <EmptyState message="No old vendor orders found" />
                    ) : (
                      oldVendorRecords.map((order) => (
                        <tr
                          key={order.id}
                          className="transition-colors hover:bg-gray-50/70 dark:hover:bg-neutral-800/40"
                        >
                          <td className="px-5 py-4">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {order.order_id || "-"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-md bg-gray-100 px-2.5 py-1 font-mono text-xs font-medium text-gray-700 dark:bg-neutral-800 dark:text-neutral-300">
                              {order.awb_number || "-"}
                            </span>
                          </td>

                          <td className="max-w-[320px] px-5 py-4 text-sm text-gray-500 dark:text-neutral-400">
                            <span className="line-clamp-2">
                              {order.old_vendor_remarks || "-"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            {order.order_id === orderID ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  disabled={actionLoadingId === order.order_id}
                                  onClick={() =>
                                    handoverOrderToNewVendor(order.order_id)
                                  }
                                  className="h-8 gap-1.5 rounded-md bg-[#0446DB] px-3 text-xs text-white hover:bg-[#0339b5]"
                                >
                                  {actionLoadingId === order.order_id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <ArrowRight className="h-3.5 w-3.5" />
                                  )}
                                  Handover
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setOrderId(null)}
                                  className="h-8 rounded-md px-3 text-xs dark:border-neutral-700"
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : order.old_vendor_status === "handovered" ? (
                              <StatusBadge>
                                {order.old_vendor_status}
                              </StatusBadge>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setOrderId(order.order_id)}
                                className="cursor-pointer"
                              >
                                <StatusBadge>
                                  {order.old_vendor_status}
                                </StatusBadge>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>

          {/* Pagination */}
          <div className="flex flex-col gap-4 border-t border-gray-200 bg-gray-50/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 dark:text-neutral-400">
                Rows per page
              </span>

              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="h-9 rounded-md border border-gray-200 bg-white px-2.5 text-sm text-gray-700 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                {[10, 20, 50, 100, 200].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <p className="text-xs text-gray-500 dark:text-neutral-400">
                Page{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {totalPages}
                </span>
              </p>

              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page === 1 || loading}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="h-9 gap-1 rounded-md border-gray-200 px-3 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || loading}
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="h-9 gap-1 rounded-md border-gray-200 px-3 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
