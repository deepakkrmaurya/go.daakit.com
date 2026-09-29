
// import axios from "axios";
// import { useEffect, useState } from "react";
// import Piechart from "../Piechart";
// import StackBarChart from "../StackBarChart";
// import { toast } from "react-toastify";
// import {
//   BadgeIndianRupee,
//   Boxes,
//   CheckCircle2,
//   CircleX,
//   Loader2,
//   RotateCcw,
//   ShoppingCart,
//   TrendingDown,
//   TrendingUp,
//   TriangleAlert,
//   Truck,
// } from "lucide-react";

// const baseURL = import.meta.env.VITE_BASE_URL;
// const baseFRONT = import.meta.env.VITE_FRONTEND_URL;

// export default function TechMerchantAnalytics() {
//   const [loading, setLoading] = useState(false);
//   const [analytics, setAnalytics] = useState({});
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [selected, setSelected] = useState("Last 30 Days");
//   const [cities, setCities] = useState([]);
//   const [cityWiseOrders, setCityWiseOrders] = useState([]);
//   const [orders, setorders] = useState([]);
//   const today = new Date();
//   const oneMonthAgo = new Date();
//   oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

//   const [advanceFilters, setAdvanceFilters] = useState({
//     end_date: today.toISOString().split("T")[0],
//     start_date: oneMonthAgo.toISOString().split("T")[0],
//   });
//   const [customStartDate, setCustomStartDate] = useState(
//     advanceFilters.start_date,
//   );
//   const [customEndDate, setCustomEndDate] = useState(advanceFilters.end_date);

//   const openDatePicker = (event) => {
//     try {
//       event.currentTarget.showPicker?.();
//     } catch {
//       return;
//     }
//   };

//   const getAnalytics = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `${baseURL}/api/merchant/getMerchantOrderStatusSummary`,
//         {
//           params: advanceFilters,
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );
//       const order_specific_counts = res?.data?.order_specific_counts;
//       const cityWise = [
//         { data: [], stack: "A", label: "NDD" },
//         { data: [], stack: "A", label: "SDD" },
//         { data: [], stack: "A", label: "Turant" },
//         { data: [], stack: "B", label: "COD" },
//         { data: [], stack: "B", label: "Prepaid" },
//       ];
//       const tempCities = [];
//       cityWise[0].data.push(Number(order_specific_counts?.ndd_count));
//       cityWise[1].data.push(Number(order_specific_counts?.sdd_count));
//       cityWise[2].data.push(Number(order_specific_counts?.turant_count));
//       // cityWise[3].data.push(Number(order_specific_counts?.cod_orders));
//       // cityWise[4].data.push(Number(order_specific_counts?.prepaid_count));
//       const city = "";
//       tempCities.push(city);

//       setCityWiseOrders(res?.data?.city_distribution);
//       setCities(tempCities);
//       setorders(res.data.pending_pickup_orders);
//       setAnalytics(res.data);
//       let temp = 0;
//       res.data?.status_counts.forEach((element) => {
//         temp += element.count;
//       });
//       setTotalOrders(temp);
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message ||
//           err.message ||
//           "Error while fetching analytics",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelect = (value) => {
//     setSelected(value);

//     if (value === "Custom Range") {
//       setCustomStartDate(advanceFilters.start_date);
//       setCustomEndDate(advanceFilters.end_date);
//       return;
//     }

//     let fromDate, toDate;

//     switch (value) {
//       case "Today": {
//         fromDate = new Date();
//         toDate = new Date();
//         break;
//       }

//       case "Yesterday": {
//         const yesterday = new Date();
//         yesterday.setDate(yesterday.getDate() - 1);
//         fromDate = yesterday;
//         toDate = yesterday;
//         break;
//       }

//       case "Last 7 Days": {
//         const end = new Date();
//         const start = new Date();
//         start.setDate(start.getDate() - 6);
//         fromDate = start;
//         toDate = end;
//         break;
//       }

//       case "Last 30 Days": {
//         const end = new Date();
//         const start = new Date();
//         start.setDate(start.getDate() - 29);
//         fromDate = start;
//         toDate = end;
//         break;
//       }

//       case "This Month": {
//         fromDate = new Date();
//         fromDate.setDate(1);
//         toDate = new Date();
//         break;
//       }

//       case "Last Month": {
//         fromDate = new Date();
//         fromDate.setMonth(fromDate.getMonth() - 1);
//         fromDate.setDate(1);
//         toDate = new Date();
//         toDate.setDate(1);
//         toDate.setDate(toDate.getDate() - 1);
//         break;
//       }

//       default:
//         return;
//     }

//     const nextFilters = {
//       start_date: fromDate.toISOString().split("T")[0],
//       end_date: toDate.toISOString().split("T")[0],
//     };

//     setCustomStartDate(nextFilters.start_date);
//     setCustomEndDate(nextFilters.end_date);
//     setAdvanceFilters(nextFilters);
//   };

//   const handleCustomFilterApply = (event) => {
//     event.preventDefault();

//     if (!customStartDate || !customEndDate) {
//       toast.error("Please select both start and end dates");
//       return;
//     }

//     if (customStartDate > customEndDate) {
//       toast.error("Start date cannot be after end date");
//       return;
//     }

//     setAdvanceFilters({
//       start_date: customStartDate,
//       end_date: customEndDate,
//     });
//   };

//   useEffect(() => {
//     getAnalytics();
//   }, [advanceFilters]);

//   const getPercentage = (count, total) => {
//     const safeCount = Number(count || 0);
//     const safeTotal = Number(total || 0);

//     if (safeTotal <= 0) return 0;
//     return Math.round((safeCount / safeTotal) * 100);
//   };

//   return (
//     <>
//       {loading ? (
//         <>
//           <div className="w-full h-screen flex items-center justify-center">
//             <Loader2 className="h-8 w-8 animate-spin" />
//           </div>
//         </>
//       ) : (
//         <div className="bg-[#F6F7F9] min-h-screen w-full">
//           {/* Header Section */}

//           <div className="mb-4">
//             <div className="bg-[#0446DB]   shadow-lg p-6 lg:p-8">
//               {/* <ChristmasHeader/> */}
//               <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//                 <div>
//                   <h1 className="text-2xl lg:text-3xl font-bold text-white  mb-2">
//                     Analytics Dashboard
//                   </h1>
//                   <p className="text-gray-200 text-sm lg:text-base">
//                     Real-time insights and performance metrics
//                   </p>
//                 </div>

//                 <div className="flex flex-col sm:flex-row gap-4 ">
//                   <div className="flex-1 ">
//                     <label className="block text-xs font-medium text-white mb-2">
//                       Filter by Date
//                     </label>
//                     <select
//                       value={selected}
//                       onChange={(e) => handleSelect(e.target.value)}
//                       className="w-full border rounded px-4 py-2 bg-white transition-all duration-200"
//                     >
//                       <option className="text-gray-900">Today</option>
//                       <option className="text-gray-900">Yesterday</option>
//                       <option className="text-gray-900">Last 7 Days</option>
//                       <option className="text-gray-900">Last 30 Days</option>
//                       <option className="text-gray-900">This Month</option>
//                       <option className="text-gray-900">Last Month</option>
//                       <option className="text-gray-900">Custom Range</option>
//                     </select>
//                   </div>

//                   {selected === "Custom Range" && (
//                     <form
//                       onSubmit={handleCustomFilterApply}
//                       className="flex flex-col sm:flex-row sm:items-end gap-4"
//                     >
//                       <div className="flex-1 min-w-[150px]">
//                         <label className="block text-xs font-medium text-white mb-2">
//                           Start Date
//                         </label>
//                         <input
//                           type="date"
//                           value={customStartDate}
//                           max={customEndDate}
//                           onClick={openDatePicker}
//                           onChange={(e) => {
//                             const newStart = e.target.value;
//                             setCustomStartDate(newStart);

//                             if (customEndDate < newStart) {
//                               setCustomEndDate(newStart);
//                             }
//                           }}
//                           className="w-full border rounded px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200"
//                         />
//                       </div>

//                       <div className="flex-1 min-w-[150px]">
//                         <label className="block text-xs font-medium text-white mb-2">
//                           End Date
//                         </label>
//                         <input
//                           type="date"
//                           value={customEndDate}
//                           min={customStartDate}
//                           onClick={openDatePicker}
//                           onChange={(e) => {
//                             const newEnd = e.target.value;
//                             setCustomEndDate(newEnd);

//                             if (customStartDate > newEnd) {
//                               setCustomStartDate(newEnd);
//                             }
//                           }}
//                           className="w-full border rounded px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200"
//                         />
//                       </div>
//                       <button
//                         type="submit"
//                         className="px-5 py-2 rounded bg-white text-[#0446DB] font-semibold border border-white hover:bg-gray-100 transition-all duration-200"
//                       >
//                         Apply
//                       </button>
//                     </form>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* Professional Stats Cards */}
//           <div className="px-3 pb-2">
//             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
//               <DashboardStatCard
//                 title="Total Revenue"
//                 value={`₹${Number(analytics?.order_revenue || 0).toLocaleString(
//                   "en-IN",
//                 )}`}
//                 icon={BadgeIndianRupee}
//                 percentage={100}
//                 subtitle="All revenue"
//                 trend="up"
//               />

//               <DashboardStatCard
//                 title="Total Orders"
//                 value={Number(totalOrders || 0).toLocaleString("en-IN")}
//                 icon={Boxes}
//                 percentage={100}
//                 subtitle="All orders"
//                 trend="up"
//               />

//               <DashboardStatCard
//                 title="Delivered"
//                 value={Number(
//                   analytics.status_counts?.find(
//                     (item) => item.status === "delivered",
//                   )?.count || 0,
//                 ).toLocaleString("en-IN")}
//                 icon={CheckCircle2}
//                 percentage={getPercentage(
//                   analytics.status_counts?.find(
//                     (item) => item.status === "delivered",
//                   )?.count,
//                   totalOrders,
//                 )}
//                 subtitle="Success rate"
//                 trend="up"
//               />

//               <DashboardStatCard
//                 title="Booked"
//                 value={Number(
//                   analytics.status_counts?.find(
//                     (item) => item.status === "booked",
//                   )?.count || 0,
//                 ).toLocaleString("en-IN")}
//                 icon={ShoppingCart}
//                 percentage={getPercentage(
//                   analytics.status_counts?.find(
//                     (item) => item.status === "booked",
//                   )?.count,
//                   totalOrders,
//                 )}
//                 subtitle="Booking rate"
//                 trend="up"
//               />

//               <DashboardStatCard
//                 title="Out for Delivery"
//                 value={Number(
//                   analytics.status_counts?.find(
//                     (item) => item.status === "out for delivery",
//                   )?.count || 0,
//                 ).toLocaleString("en-IN")}
//                 icon={Truck}
//                 percentage={getPercentage(
//                   analytics.status_counts?.find(
//                     (item) => item.status === "out for delivery",
//                   )?.count,
//                   totalOrders,
//                 )}
//                 subtitle="Delivery rate"
//                 trend="up"
//               />

//               <DashboardStatCard
//                 title="Cancelled"
//                 value={Number(
//                   analytics.status_counts?.find(
//                     (item) => item.status === "cancelled",
//                   )?.count || 0,
//                 ).toLocaleString("en-IN")}
//                 icon={CircleX}
//                 percentage={getPercentage(
//                   analytics.status_counts?.find(
//                     (item) => item.status === "cancelled",
//                   )?.count,
//                   totalOrders,
//                 )}
//                 subtitle="Cancellation rate"
//                 trend="down"
//               />

//               <DashboardStatCard
//                 title="Order NDR's"
//                 value={Number(
//                   analytics.status_counts?.find((item) => item.status === "ndr")
//                     ?.count || 0,
//                 ).toLocaleString("en-IN")}
//                 icon={TriangleAlert}
//                 percentage={getPercentage(
//                   analytics.status_counts?.find((item) => item.status === "ndr")
//                     ?.count,
//                   totalOrders,
//                 )}
//                 subtitle="NDR rate"
//                 trend="down"
//               />

//               <DashboardStatCard
//                 title="RTO Delivered"
//                 value={Number(
//                   analytics.status_counts?.find(
//                     (item) => item.status === "rto in transit",
//                   )?.count || 0,
//                 ).toLocaleString("en-IN")}
//                 icon={RotateCcw}
//                 percentage={getPercentage(
//                   analytics.status_counts?.find(
//                     (item) => item.status === "rto in transit",
//                   )?.count,
//                   totalOrders,
//                 )}
//                 subtitle="RTO rate"
//                 trend="down"
//               />
//             </div>
//           </div>

//           {/* Charts Section */}
//           <div className=" p-3 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
//             {/* Delivery Type Chart */}
//             <div className="bg-white rounded-sm transition-all duration-200 p-3 border border-[#E6E7EA] shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
//               <h2 className="text-xl font-bold text-gray-800 mb-6 text-center lg:text-left">
//                 Order Mode
//               </h2>
//               <div>
//                 <Piechart
//                   data={[
//                     {
//                       id: "turant",
//                       name: "Turant",
//                       value: Number(
//                         analytics.order_specific_counts?.turant_count || 0,
//                       ),
//                       label: "Turant",
//                       color: "#F25912",
//                     },
//                     {
//                       id: "sdd",
//                       name: "Same Day Delivery",
//                       value: Number(
//                         analytics.order_specific_counts?.sdd_count || 0,
//                       ),
//                       label: "SDD",
//                       color: "#03A6A1",
//                     },
//                     {
//                       id: "ndd",
//                       name: "Next Day Delivery",
//                       value: Number(
//                         analytics.order_specific_counts?.ndd_count || 0,
//                       ),
//                       label: "NDD",
//                       color: "#0446DB",
//                     },
//                   ]}
//                 />
//               </div>
//             </div>

//             {/* Live Orders Chart */}
//             <div className="bg-white rounded-sm transition-all duration-200 p-3 border border-[#E6E7EA] shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
//               <h2 className="text-xl font-bold text-gray-800 mb-6 text-center lg:text-left">
//                 Live Orders Status
//               </h2>
//               <div className="">
//                 <Piechart
//                   data={[
//                     {
//                       id: "booked",
//                       name: "Booked",
//                       value:
//                         analytics.status_counts?.filter(
//                           (c) => c.status === "booked",
//                         )[0]?.count || 0,
//                       label: "Booked",
//                       color: "#03A6A1",
//                     },
//                     {
//                       id: "out for delivery",
//                       name: "Out For Delivery",
//                       value:
//                         analytics?.status_counts?.filter(
//                           (c) => c.status === "out for delivery",
//                         )[0]?.count || 0,
//                       label: "Out For Delivery",
//                       color: "#0446DB",
//                     },
//                     {
//                       id: "ndr",
//                       name: "NDR",
//                       value:
//                         analytics.status_counts?.filter(
//                           (c) => c.status === "ndr",
//                         )[0]?.count || 0,
//                       label: "NDR",
//                       color: "orange",
//                     },
//                     {
//                       id: "undelivered",
//                       name: "Undelivered",
//                       value:
//                         analytics.status_counts?.filter(
//                           (c) => c.status === "undelivered",
//                         )[0]?.count || 0,
//                       label: "Undelivered",
//                       color: "#F25912",
//                     },
//                   ]}
//                 />
//               </div>
//             </div>
//             <div className="bg-white rounded-sm transition-all duration-200 p-3 border border-[#E6E7EA] shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
//               <h2 className="text-xl font-bold text-gray-800 mb-6 text-center lg:text-left">
//                 Payment Methods
//               </h2>
//               <div className="">
//                 <Piechart
//                   data={
//                     analytics?.order_type_counts?.map((item) => ({
//                       id: item.order_type.toLowerCase().replace(/\s+/g, "_"),
//                       name: item.order_type,
//                       value: Number(item.count),
//                       label: item.order_type,
//                       color: item.order_type.toLowerCase().includes("cod")
//                         ? "#F25912"
//                         : "#03A6A1",
//                     })) || []
//                   }
//                 />
//               </div>
//             </div>
//           </div>
//           {/* City Wise Orders - Full Width */}
//           <div className=" bg-white mt-3 mx-3 rounded-sm transition-all duration-200 p-6 border border-[#E6E7EA] shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
//             <StackBarChart data={cityWiseOrders} labels={cities} />
//           </div>

//           {/* pending orders */}
//           <div className=" mx-3">
//             <PendingOrders orders={orders} />
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// const DashboardStatCard = ({
//   title,
//   value,
//   icon: Icon,
//   percentage = 0,
//   subtitle,
//   trend = "up",
// }) => {
//   const isUp = trend === "up";

//   return (
//     <div className="group overflow-hidden rounded-sm border border-[#E1E3E6] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.02)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D5D8DC] hover:shadow-[0_8px_24px_rgba(16,24,40,0.06)]">
//       <div className="flex min-h-[70px] items-center justify-between px-5 py-4">
//         <h3 className="text-[16px] font-semibold tracking-[-0.1px] text-[#171717]">
//           {title}
//         </h3>

//         <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#F7F7F8] transition-colors group-hover:bg-[#F2F4F7]">
//           <Icon
//             size={21}
//             strokeWidth={1.7}
//             className="text-[#A4A7AE]"
//           />
//         </div>
//       </div>

//       <div className="border-t rounded-tl-xl border-[#ECEDEF]" />

//       <div className="px-5 pb-5 pt-5">
//         <div className="text-[32px] font-semibold leading-none tracking-[-1px] text-[#0A0A0A] sm:text-[34px]">
//           {value}
//         </div>

        
//       </div>
//     </div>
//   );
// };

// const PendingOrders = ({ orders = [], loading = false }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(5);

//   // Calculate pagination values
//   const totalOrders = orders.length;
//   const totalPages = Math.ceil(totalOrders / itemsPerPage);

//   // Get current orders for the page
//   const indexOfLastOrder = currentPage * itemsPerPage;
//   const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
//   const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

//   // Reset to page 1 when orders change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [orders]);

//   // Handle page change
//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   // Generate page numbers for pagination
//   const getPageNumbers = () => {
//     const pageNumbers = [];
//     const maxVisiblePages = 5;

//     let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//     let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//     // Adjust start page if we're near the end
//     if (endPage - startPage + 1 < maxVisiblePages) {
//       startPage = Math.max(1, endPage - maxVisiblePages + 1);
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(i);
//     }

//     return pageNumbers;
//   };

//   return (
//     <div className=" bg-white rounded-sm mt-4">
//       {/* Header Section */}
//       <header className="">
//         <div className="mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 sm:space-y-4 lg:space-y-0">
//             <div className="text-center lg:text-left">
//               <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold text-[rgb(11,11,11)]">
//                 Upcoming Pickups
//               </h1>
//               {/* <p className="text-[rgb(86,78,193)] mt-1 sm:mt-2 text-sm">
//                                 Manage and track all your orders in one place
//                             </p> */}
//             </div>

//             <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
//               {/* Additional header content can go here */}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="mx-auto px-2  relative z-10">
//         {/* Orders Table */}
//         <div className="bg-white rounded-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             {loading ? (
//               <div className="flex justify-center items-center py-16 sm:py-20">
//                 <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-indigo-600"></div>
//               </div>
//             ) : (
//               <div className="min-w-full">
//                 <table className="sm:table min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
//                     <tr>
//                       <th className="px-3 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                         Order Information
//                       </th>
//                       <th className="px-3 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                         Delivery Address
//                       </th>
//                       <th className="px-3 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                         Package Details
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {currentOrders?.length > 0 ? (
//                       currentOrders?.map((order, index) => (
//                         <tr
//                           key={order.id}
//                           className="hover:bg-gray-50 transition-colors duration-200"
//                         >
//                           {/* Order Information */}
//                           <td className="px-3 lg:px-6 py-4">
//                             <div className="space-y-2">
//                               <div className="flex items-center gap-2">
//                                 <a
//                                   href={`${baseFRONT}/track-order?awb_number=${order.awb_number}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200 text-sm"
//                                 >
//                                   {order?.awb_number}
//                                 </a>
//                                 <button
//                                   onClick={() => {
//                                     navigator?.clipboard.writeText(
//                                       order.awb_number,
//                                     );
//                                     toast.success("AWB copied to clipboard");
//                                   }}
//                                   className="text-gray-400 hover:text-indigo-600 transition-colors duration-200 p-1 rounded"
//                                 >
//                                   {/* Copy icon */}
//                                 </button>
//                                 <button
//                                   onClick={() => setPopup(order)}
//                                   className="text-gray-400 hover:text-indigo-600 transition-colors duration-200 p-1 rounded"
//                                 >
//                                   {/* Info icon */}
//                                 </button>
//                               </div>

//                               <p className="text-xs text-gray-500">
//                                 {new Date(order.created_at).toLocaleString(
//                                   "en-IN",
//                                   {
//                                     timeZone: "Asia/Kolkata",
//                                     day: "2-digit",
//                                     month: "2-digit",
//                                     year: "numeric",
//                                     hour: "2-digit",
//                                     minute: "2-digit",
//                                     hour12: true,
//                                   },
//                                 )}
//                               </p>

//                               <div className="flex items-center gap-2 text-xs text-gray-400">
//                                 <span>MID: {order.merchant_id}</span>
//                                 <span>•</span>
//                                 <span className="flex items-center gap-1">
//                                   MOID:{" "}
//                                   {order.merchant_order_id?.length <= 15
//                                     ? order.merchant_order_id
//                                     : `${order.merchant_order_id.slice(0, 15)}...`}
//                                 </span>
//                                 <br />
//                                 <span className="bg-[rgb(85,77,192)] px-2 text-white rounded">
//                                   {order.rider_preference === "self"
//                                     ? "Self"
//                                     : "Daakit"}
//                                 </span>
//                               </div>
//                             </div>
//                           </td>

//                           {/* Delivery Address */}
//                           <td className="px-3 lg:px-6 py-4">
//                             <div className="space-y-1">
//                               <p className="font-medium text-gray-800 flex items-center gap-1 text-sm">
//                                 {order.delivery_contact_name}
//                               </p>
//                               <p className="text-xs text-gray-600">
//                                 {order.delivery_address_line}
//                               </p>
//                               <p className="text-xs text-gray-500">
//                                 {order.delivery_city}, {order.delivery_state} -{" "}
//                                 {order.delivery_pincode}
//                               </p>
//                               <p className="text-xs text-gray-400">
//                                 {order.delivery_country}
//                               </p>
//                             </div>
//                           </td>

//                           {/* Package Details */}
//                           <td className="px-3 lg:px-6 py-4">
//                             <div className="space-y-2">
//                               <div className="flex items-center gap-2 text-xs">
//                                 <span>
//                                   Weight:{" "}
//                                   {Number(order.total_weight).toLocaleString()}g
//                                 </span>
//                               </div>
//                               <div className="flex items-center gap-2 text-xs">
//                                 <span>
//                                   Dimensions: {order.package_length}x
//                                   {order.package_breadth}x{order.package_height}
//                                 </span>
//                               </div>
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="3" className="px-6 py-12 text-center">
//                           <div className="flex flex-col items-center justify-center text-gray-500">
//                             <p className="text-base sm:text-lg font-medium text-gray-400">
//                               No orders found
//                             </p>
//                             <p className="text-xs sm:text-sm text-gray-400 mt-1">
//                               Try adjusting your filters or search terms
//                             </p>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//           {/* Enhanced Pagination */}
//           {orders.length > 0 && (
//             <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
//                 {/* Page Info */}
//                 <div className="text-center sm:text-left">
//                   <p className="text-xs sm:text-sm text-gray-700">
//                     Showing {indexOfFirstOrder + 1} to{" "}
//                     {Math.min(indexOfLastOrder, totalOrders)} of {totalOrders}{" "}
//                     orders
//                   </p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Page {currentPage} of {totalPages}
//                   </p>
//                 </div>

//                 {/* Pagination Controls */}
//                 <div className="flex items-center justify-center gap-1 sm:gap-2">
//                   {/* Previous Button */}
//                   <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className={`px-3 py-1.5 sm:py-2 rounded-sm text-xs sm:text-sm font-medium transition-all duration-200 ${
//                       currentPage === 1
//                         ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                         : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 hover:border-gray-400"
//                     }`}
//                   >
//                     Previous
//                   </button>

//                   {/* Page Numbers */}
//                   {getPageNumbers().map((pageNumber) => (
//                     <button
//                       key={pageNumber}
//                       onClick={() => handlePageChange(pageNumber)}
//                       className={`px-3 py-1.5 sm:py-2 rounded-sm text-xs sm:text-sm font-medium transition-all duration-200 ${
//                         currentPage === pageNumber
//                           ? "bg-[rgb(86,78,193)] text-white border border-[rgb(86,78,193)]"
//                           : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 hover:border-gray-400"
//                       }`}
//                     >
//                       {pageNumber}
//                     </button>
//                   ))}

//                   {/* Next Button */}
//                   <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className={`px-3 py-1.5 sm:py-2 rounded-sm text-xs sm:text-sm font-medium transition-all duration-200 ${
//                       currentPage === totalPages
//                         ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                         : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 hover:border-gray-400"
//                     }`}
//                   >
//                     Next
//                   </button>
//                 </div>

//                 {/* Items Per Page Selector (Optional) */}
//                 <div className="text-center sm:text-right">
//                   <p className="text-xs text-gray-500">
//                     {itemsPerPage} per page
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };





import axios from "axios";
import { useEffect, useState } from "react";
import Piechart from "../Piechart";
import StackBarChart from "../StackBarChart";
import { toast } from "react-toastify";
import {
  BadgeIndianRupee,
  Boxes,
  CalendarDays,
  CheckCircle2,
  CircleX,
  Copy,
  Loader2,
  MapPin,
  PackageOpen,
  RotateCcw,
  ShoppingCart,
  TriangleAlert,
  Truck,
} from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;
const baseFRONT = import.meta.env.VITE_FRONTEND_URL;

export default function TechMerchantAnalytics() {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({});
  const [totalOrders, setTotalOrders] = useState(0);

  const [selected, setSelected] = useState("Last 30 Days");

  const [cities, setCities] = useState([]);
  const [cityWiseOrders, setCityWiseOrders] = useState([]);
  const [orders, setOrders] = useState([]);

  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const [advanceFilters, setAdvanceFilters] = useState({
    end_date: today.toISOString().split("T")[0],
    start_date: oneMonthAgo.toISOString().split("T")[0],
  });

  const [customStartDate, setCustomStartDate] = useState(
    advanceFilters.start_date,
  );

  const [customEndDate, setCustomEndDate] = useState(
    advanceFilters.end_date,
  );

  /* =====================================================
     DATE PICKER
  ===================================================== */

  const openDatePicker = (event) => {
    try {
      event.currentTarget.showPicker?.();
    } catch {
      return;
    }
  };

  /* =====================================================
     GET ANALYTICS
  ===================================================== */

  const getAnalytics = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${baseURL}/api/merchant/getMerchantOrderStatusSummary`,
        {
          params: advanceFilters,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const order_specific_counts =
        res?.data?.order_specific_counts;

      const cityWise = [
        {
          data: [],
          stack: "A",
          label: "NDD",
        },
        {
          data: [],
          stack: "A",
          label: "SDD",
        },
        {
          data: [],
          stack: "A",
          label: "Turant",
        },
        {
          data: [],
          stack: "B",
          label: "COD",
        },
        {
          data: [],
          stack: "B",
          label: "Prepaid",
        },
      ];

      const tempCities = [];

      cityWise[0].data.push(
        Number(order_specific_counts?.ndd_count),
      );

      cityWise[1].data.push(
        Number(order_specific_counts?.sdd_count),
      );

      cityWise[2].data.push(
        Number(order_specific_counts?.turant_count),
      );

      const city = "";

      tempCities.push(city);

      setCityWiseOrders(
        res?.data?.city_distribution || [],
      );

      setCities(tempCities);

      setOrders(
        res?.data?.pending_pickup_orders || [],
      );

      setAnalytics(res?.data || {});

      let temp = 0;

      res?.data?.status_counts?.forEach((element) => {
        temp += Number(element?.count || 0);
      });

      setTotalOrders(temp);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while fetching analytics",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     DATE FILTER
  ===================================================== */

  const handleSelect = (value) => {
    setSelected(value);

    if (value === "Custom Range") {
      setCustomStartDate(
        advanceFilters.start_date,
      );

      setCustomEndDate(
        advanceFilters.end_date,
      );

      return;
    }

    let fromDate;
    let toDate;

    switch (value) {
      case "Today": {
        fromDate = new Date();
        toDate = new Date();
        break;
      }

      case "Yesterday": {
        const yesterday = new Date();

        yesterday.setDate(
          yesterday.getDate() - 1,
        );

        fromDate = yesterday;
        toDate = yesterday;

        break;
      }

      case "Last 7 Days": {
        const end = new Date();
        const start = new Date();

        start.setDate(
          start.getDate() - 6,
        );

        fromDate = start;
        toDate = end;

        break;
      }

      case "Last 30 Days": {
        const end = new Date();
        const start = new Date();

        start.setDate(
          start.getDate() - 29,
        );

        fromDate = start;
        toDate = end;

        break;
      }

      case "This Month": {
        fromDate = new Date();
        fromDate.setDate(1);

        toDate = new Date();

        break;
      }

      case "Last Month": {
        fromDate = new Date();

        fromDate.setMonth(
          fromDate.getMonth() - 1,
        );

        fromDate.setDate(1);

        toDate = new Date();

        toDate.setDate(1);

        toDate.setDate(
          toDate.getDate() - 1,
        );

        break;
      }

      default:
        return;
    }

    const nextFilters = {
      start_date:
        fromDate.toISOString().split("T")[0],

      end_date:
        toDate.toISOString().split("T")[0],
    };

    setCustomStartDate(
      nextFilters.start_date,
    );

    setCustomEndDate(
      nextFilters.end_date,
    );

    setAdvanceFilters(nextFilters);
  };

  /* =====================================================
     CUSTOM FILTER
  ===================================================== */

  const handleCustomFilterApply = (event) => {
    event.preventDefault();

    if (
      !customStartDate ||
      !customEndDate
    ) {
      toast.error(
        "Please select both start and end dates",
      );

      return;
    }

    if (
      customStartDate > customEndDate
    ) {
      toast.error(
        "Start date cannot be after end date",
      );

      return;
    }

    setAdvanceFilters({
      start_date: customStartDate,
      end_date: customEndDate,
    });
  };

  useEffect(() => {
    getAnalytics();
  }, [advanceFilters]);

  /* =====================================================
     HELPERS
  ===================================================== */

  const getPercentage = (
    count,
    total,
  ) => {
    const safeCount = Number(
      count || 0,
    );

    const safeTotal = Number(
      total || 0,
    );

    if (safeTotal <= 0) {
      return 0;
    }

    return Math.round(
      (safeCount / safeTotal) * 100,
    );
  };

  const getStatusCount = (status) => {
    return Number(
      analytics?.status_counts?.find(
        (item) =>
          item?.status === status,
      )?.count || 0,
    );
  };

  /* =====================================================
     LOADER
  ===================================================== */

  if (loading) {
    return (
      <div
        className="
          flex min-h-screen w-full
          items-center justify-center
          bg-[#F7F8FA]
          dark:bg-neutral-950
        "
      >
        <div className="flex flex-col items-center gap-3">

          <div
            className="
              flex h-12 w-12
              items-center justify-center
              rounded-sm
              border border-gray-200
              bg-white
              shadow-sm
              dark:border-neutral-800
              dark:bg-neutral-900
            "
          >
            <Loader2
              className="
                h-6 w-6
                animate-spin
                text-[#0446DB]
              "
            />
          </div>

          <p
            className="
              text-sm font-medium
              text-gray-500
              dark:text-neutral-400
            "
          >
            Loading analytics...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        w-full
        bg-[#F7F8FA]
        dark:bg-neutral-950
      "
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          dark:bg-neutral-900
        "
      >
        <div className="">

          <div
            className="
              flex flex-col gap-5
              xl:flex-row
              xl:items-end
              xl:justify-between
            "
          >

            {/* LEFT */}

            <div>

              <div className="flex items-center gap-3">

               

                <div>

                  <h1
                    className="
                      text-2xl
                      font-bold
                      tracking-tight
                      text-gray-900
                      dark:text-white
                      lg:text-3xl
                    "
                  >
                    Analytics Dashboard
                  </h1>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-gray-500
                      dark:text-neutral-400
                    "
                  >
                    Real-time insights and performance metrics
                  </p>

                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div
              className="
                flex flex-col gap-3
                lg:flex-row
                lg:items-end
              "
            >

              <div className="min-w-[210px]">

                <label
                  className="
                    mb-1.5 block
                    text-xs font-medium
                    text-gray-600
                    dark:text-neutral-300
                  "
                >
                  Filter by Date
                </label>

                <div className="relative">

                  <CalendarDays
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-1/2
                      h-4 w-4
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <select
                    value={selected}
                    onChange={(e) =>
                      handleSelect(
                        e.target.value,
                      )
                    }
                    className="
                      h-10 w-full
                      appearance-none
                      rounded-sm
                      border border-gray-200
                      bg-white
                      pl-9 pr-8
                      text-sm
                      text-gray-700
                      outline-none
                      transition

                      focus:border-[#0446DB]
                      focus:ring-2
                      focus:ring-[#0446DB]/10

                      dark:border-neutral-700
                      dark:bg-neutral-800
                      dark:text-neutral-200
                    "
                  >
                    <option>
                      Today
                    </option>

                    <option>
                      Yesterday
                    </option>

                    <option>
                      Last 7 Days
                    </option>

                    <option>
                      Last 30 Days
                    </option>

                    <option>
                      This Month
                    </option>

                    <option>
                      Last Month
                    </option>

                    <option>
                      Custom Range
                    </option>

                  </select>

                </div>

              </div>

              {/* CUSTOM RANGE */}

              {selected ===
                "Custom Range" && (

                <form
                  onSubmit={
                    handleCustomFilterApply
                  }
                  className="
                    flex flex-col gap-3
                    sm:flex-row
                    sm:items-end
                  "
                >

                  <div className="min-w-[155px]">

                    <label
                      className="
                        mb-1.5 block
                        text-xs font-medium
                        text-gray-600
                        dark:text-neutral-300
                      "
                    >
                      Start Date
                    </label>

                    <input
                      type="date"
                      value={
                        customStartDate
                      }
                      max={
                        customEndDate
                      }
                      onClick={
                        openDatePicker
                      }
                      onChange={(e) => {

                        const newStart =
                          e.target.value;

                        setCustomStartDate(
                          newStart,
                        );

                        if (
                          customEndDate <
                          newStart
                        ) {
                          setCustomEndDate(
                            newStart,
                          );
                        }
                      }}
                      className="
                        h-10 w-full
                        cursor-pointer
                        rounded-sm
                        border border-gray-200
                        bg-white
                        px-3
                        text-sm
                        text-gray-700
                        outline-none

                        focus:border-[#0446DB]
                        focus:ring-2
                        focus:ring-[#0446DB]/10

                        dark:border-neutral-700
                        dark:bg-neutral-800
                        dark:text-neutral-200
                      "
                    />

                  </div>

                  <div className="min-w-[155px]">

                    <label
                      className="
                        mb-1.5 block
                        text-xs font-medium
                        text-gray-600
                        dark:text-neutral-300
                      "
                    >
                      End Date
                    </label>

                    <input
                      type="date"
                      value={
                        customEndDate
                      }
                      min={
                        customStartDate
                      }
                      onClick={
                        openDatePicker
                      }
                      onChange={(e) => {

                        const newEnd =
                          e.target.value;

                        setCustomEndDate(
                          newEnd,
                        );

                        if (
                          customStartDate >
                          newEnd
                        ) {
                          setCustomStartDate(
                            newEnd,
                          );
                        }
                      }}
                      className="
                        h-10 w-full
                        cursor-pointer
                        rounded-sm
                        border border-gray-200
                        bg-white
                        px-3
                        text-sm
                        text-gray-700
                        outline-none

                        focus:border-[#0446DB]
                        focus:ring-2
                        focus:ring-[#0446DB]/10

                        dark:border-neutral-700
                        dark:bg-neutral-800
                        dark:text-neutral-200
                      "
                    />

                  </div>

                  <button
                    type="submit"
                    className="
                      h-10
                      rounded-sm
                      bg-[#0446DB]
                      px-5
                      text-sm
                      font-semibold
                      text-white
                      transition

                      hover:bg-[#033bb9]

                      focus:ring-2
                      focus:ring-[#0446DB]/20
                    "
                  >
                    Apply
                  </button>

                </form>
              )}

            </div>

          </div>

        </div>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="
          space-y-6
           py-2
        "
      >

        {/* =================================================
            STATS CARDS
        ================================================= */}

        <div
          className="
            grid grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >

          <DashboardStatCard
            title="Total Revenue"
            value={`₹${Number(
              analytics?.order_revenue ||
                0,
            ).toLocaleString("en-IN")}`}
            icon={BadgeIndianRupee}
            percentage={100}
            subtitle="All revenue"
            accent="blue"
          />

          <DashboardStatCard
            title="Total Orders"
            value={Number(
              totalOrders || 0,
            ).toLocaleString("en-IN")}
            icon={Boxes}
            percentage={100}
            subtitle="All orders"
            accent="indigo"
          />

          <DashboardStatCard
            title="Delivered"
            value={getStatusCount(
              "delivered",
            ).toLocaleString("en-IN")}
            icon={CheckCircle2}
            percentage={getPercentage(
              getStatusCount(
                "delivered",
              ),
              totalOrders,
            )}
            subtitle="Success rate"
            accent="green"
          />

          <DashboardStatCard
            title="Booked"
            value={getStatusCount(
              "booked",
            ).toLocaleString("en-IN")}
            icon={ShoppingCart}
            percentage={getPercentage(
              getStatusCount("booked"),
              totalOrders,
            )}
            subtitle="Booking rate"
            accent="cyan"
          />

          <DashboardStatCard
            title="Out for Delivery"
            value={getStatusCount(
              "out for delivery",
            ).toLocaleString("en-IN")}
            icon={Truck}
            percentage={getPercentage(
              getStatusCount(
                "out for delivery",
              ),
              totalOrders,
            )}
            subtitle="Delivery rate"
            accent="orange"
          />

          <DashboardStatCard
            title="Cancelled"
            value={getStatusCount(
              "cancelled",
            ).toLocaleString("en-IN")}
            icon={CircleX}
            percentage={getPercentage(
              getStatusCount(
                "cancelled",
              ),
              totalOrders,
            )}
            subtitle="Cancellation rate"
            accent="red"
          />

          <DashboardStatCard
            title="Order NDR's"
            value={getStatusCount(
              "ndr",
            ).toLocaleString("en-IN")}
            icon={TriangleAlert}
            percentage={getPercentage(
              getStatusCount("ndr"),
              totalOrders,
            )}
            subtitle="NDR rate"
            accent="amber"
          />

          <DashboardStatCard
            title="RTO Delivered"
            value={getStatusCount(
              "rto in transit",
            ).toLocaleString("en-IN")}
            icon={RotateCcw}
            percentage={getPercentage(
              getStatusCount(
                "rto in transit",
              ),
              totalOrders,
            )}
            subtitle="RTO rate"
            accent="purple"
          />

        </div>

        {/* =================================================
            CHARTS
        ================================================= */}

        <div
          className="
            grid grid-cols-1
            gap-5
            lg:grid-cols-3
          "
        >

          {/* ORDER MODE */}

          <ChartCard
            title="Order Mode"
            description="Distribution by delivery mode"
          >

            <Piechart
              data={[
                {
                  id: "turant",
                  name: "Turant",
                  value: Number(
                    analytics
                      ?.order_specific_counts
                      ?.turant_count || 0,
                  ),
                  label: "Turant",
                  color: "#F25912",
                },

                {
                  id: "sdd",
                  name:
                    "Same Day Delivery",
                  value: Number(
                    analytics
                      ?.order_specific_counts
                      ?.sdd_count || 0,
                  ),
                  label: "SDD",
                  color: "#03A6A1",
                },

                {
                  id: "ndd",
                  name:
                    "Next Day Delivery",
                  value: Number(
                    analytics
                      ?.order_specific_counts
                      ?.ndd_count || 0,
                  ),
                  label: "NDD",
                  color: "#0446DB",
                },
              ]}
            />

          </ChartCard>

          {/* LIVE ORDER STATUS */}

          <ChartCard
            title="Live Orders Status"
            description="Current order lifecycle"
            live
          >

            <Piechart
              data={[
                {
                  id: "booked",
                  name: "Booked",
                  value:
                    getStatusCount(
                      "booked",
                    ),
                  label: "Booked",
                  color: "#03A6A1",
                },

                {
                  id:
                    "out for delivery",
                  name:
                    "Out For Delivery",
                  value:
                    getStatusCount(
                      "out for delivery",
                    ),
                  label:
                    "Out For Delivery",
                  color: "#0446DB",
                },

                {
                  id: "ndr",
                  name: "NDR",
                  value:
                    getStatusCount(
                      "ndr",
                    ),
                  label: "NDR",
                  color: "#F59E0B",
                },

                {
                  id: "undelivered",
                  name: "Undelivered",
                  value:
                    getStatusCount(
                      "undelivered",
                    ),
                  label:
                    "Undelivered",
                  color: "#F25912",
                },
              ]}
            />

          </ChartCard>

          {/* PAYMENT */}

          <ChartCard
            title="Payment Methods"
            description="COD and prepaid distribution"
          >

            <Piechart
              data={
                analytics
                  ?.order_type_counts
                  ?.map((item) => ({
                    id: item.order_type
                      .toLowerCase()
                      .replace(
                        /\s+/g,
                        "_",
                      ),

                    name:
                      item.order_type,

                    value: Number(
                      item.count,
                    ),

                    label:
                      item.order_type,

                    color: item.order_type
                      .toLowerCase()
                      .includes("cod")
                      ? "#F25912"
                      : "#03A6A1",
                  })) || []
              }
            />

          </ChartCard>

        </div>

        {/* =================================================
            CITY WISE ORDERS
        ================================================= */}

        <div
          className="
            rounded-sm
            border border-gray-200
            bg-white
            p-5
            shadow-sm

            dark:border-neutral-800
            dark:bg-neutral-900

            sm:p-6
          "
        >

          <div
            className="
              mb-5
              flex items-center
              gap-3
            "
          >

            <div
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-sm
                bg-[#0446DB]/10
              "
            >
              <MapPin
                className="
                  h-4 w-4
                  text-[#0446DB]
                "
              />
            </div>

            <div>

              <h2
                className="
                  text-base
                  font-semibold
                  text-gray-900
                  dark:text-white
                "
              >
                City Wise Order Distribution
              </h2>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-gray-500
                  dark:text-neutral-400
                "
              >
                Orders distributed across delivery locations
              </p>

            </div>

          </div>

          <div className="min-h-[280px]">

            <StackBarChart
              data={cityWiseOrders}
              labels={cities}
            />

          </div>

        </div>

        {/* =================================================
            UPCOMING PICKUPS
        ================================================= */}

        <PendingOrders
          orders={orders}
        />

      </div>
    </div>
  );
}

/* =========================================================
   CHART CARD
========================================================= */

const ChartCard = ({
  title,
  description,
  live = false,
  children,
}) => {
  return (
    <div
      className="
        rounded-sm
        border border-gray-200
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-200

        hover:shadow-md

        dark:border-neutral-800
        dark:bg-neutral-900
      "
    >

      <div
        className="
          mb-4
          flex items-start
          justify-between
          gap-3
          border-b
          border-gray-100
          pb-4

          dark:border-neutral-800
        "
      >

        <div>

          <h2
            className="
              text-base
              font-semibold
              text-gray-900
              dark:text-white
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-1
              text-xs
              text-gray-500
              dark:text-neutral-400
            "
          >
            {description}
          </p>

        </div>

        {live && (

          <span
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-full
              bg-green-50
              px-2.5
              py-1
              text-[11px]
              font-semibold
              text-green-700

              dark:bg-green-500/10
              dark:text-green-400
            "
          >

            <span
              className="
                h-1.5 w-1.5
                animate-pulse
                rounded-full
                bg-green-500
              "
            />

            Live

          </span>

        )}

      </div>

      <div className="min-h-[250px]">
        {children}
      </div>

    </div>
  );
};

/* =========================================================
   DASHBOARD STAT CARD
========================================================= */

const DashboardStatCard = ({
  title,
  value,
  icon: Icon,
  percentage = 0,
  subtitle,
  accent = "blue",
}) => {
  const styles = {
    blue: {
      icon: `
        bg-blue-50
        text-[#0446DB]
        dark:bg-blue-500/10
        dark:text-blue-300
      `,
      bar: "bg-[#0446DB]",
    },

    indigo: {
      icon: `
        bg-indigo-50
        text-indigo-600
        dark:bg-indigo-500/10
        dark:text-indigo-300
      `,
      bar: "bg-indigo-500",
    },

    green: {
      icon: `
        bg-green-50
        text-green-600
        dark:bg-green-500/10
        dark:text-green-400
      `,
      bar: "bg-green-500",
    },

    cyan: {
      icon: `
        bg-cyan-50
        text-cyan-600
        dark:bg-cyan-500/10
        dark:text-cyan-300
      `,
      bar: "bg-cyan-500",
    },

    orange: {
      icon: `
        bg-orange-50
        text-orange-600
        dark:bg-orange-500/10
        dark:text-orange-300
      `,
      bar: "bg-orange-500",
    },

    red: {
      icon: `
        bg-red-50
        text-red-600
        dark:bg-red-500/10
        dark:text-red-400
      `,
      bar: "bg-red-500",
    },

    amber: {
      icon: `
        bg-amber-50
        text-amber-600
        dark:bg-amber-500/10
        dark:text-amber-300
      `,
      bar: "bg-amber-500",
    },

    purple: {
      icon: `
        bg-purple-50
        text-purple-600
        dark:bg-purple-500/10
        dark:text-purple-300
      `,
      bar: "bg-purple-500",
    },
  };

  const current =
    styles[accent] ||
    styles.blue;

  const safePercentage =
    Math.min(
      100,
      Math.max(
        0,
        Number(
          percentage || 0,
        ),
      ),
    );

  return (
    <div
      className="
        group
        overflow-hidden
        rounded-sm
        border border-gray-200
        bg-white
        shadow-sm
        transition-all
        duration-200

        hover:-translate-y-0.5
        hover:shadow-md

        dark:border-neutral-800
        dark:bg-neutral-900
      "
    >

      <div className="p-5">

        <div
          className="
            flex items-start
            justify-between
            gap-4
          "
        >

          <div className="min-w-0">

            <p
              className="
                truncate
                text-sm
                font-medium
                text-gray-500
                dark:text-neutral-400
              "
            >
              {title}
            </p>

            <p
              className="
                mt-2
                text-2xl
                font-bold
                tracking-tight
                text-gray-900

                dark:text-white

                sm:text-3xl
              "
            >
              {value}
            </p>

          </div>

          <div
            className={`
              flex
              h-10 w-10
              shrink-0
              items-center
              justify-center
              rounded-sm

              ${current.icon}
            `}
          >

            <Icon
              size={20}
              strokeWidth={1.8}
            />

          </div>

        </div>

        <div className="mt-5">

          <div
            className="
              mb-2
              flex items-center
              justify-between
              gap-3
            "
          >

            <span
              className="
                text-xs
                text-gray-500
                dark:text-neutral-400
              "
            >
              {subtitle}
            </span>

            <span
              className="
                text-xs
                font-semibold
                text-gray-700
                dark:text-neutral-200
              "
            >
              {safePercentage}%
            </span>

          </div>

          <div
            className="
              h-1.5
              overflow-hidden
              rounded-full
              bg-gray-100
              dark:bg-neutral-800
            "
          >

            <div
              className={`
                h-full
                rounded-full
                ${current.bar}
              `}
              style={{
                width: `${safePercentage}%`,
              }}
            />

          </div>

        </div>

      </div>

    </div>
  );
};

/* =========================================================
   PENDING ORDERS
========================================================= */

const PendingOrders = ({
  orders = [],
  loading = false,
}) => {
  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [itemsPerPage] =
    useState(5);

  const totalOrders =
    orders.length;

  const totalPages =
    Math.ceil(
      totalOrders /
        itemsPerPage,
    );

  const indexOfLastOrder =
    currentPage *
    itemsPerPage;

  const indexOfFirstOrder =
    indexOfLastOrder -
    itemsPerPage;

  const currentOrders =
    orders.slice(
      indexOfFirstOrder,
      indexOfLastOrder,
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [orders]);

  const handlePageChange = (
    pageNumber,
  ) => {
    setCurrentPage(
      pageNumber,
    );
  };

  const getPageNumbers = () => {
    const pageNumbers = [];

    const maxVisiblePages = 5;

    let startPage = Math.max(
      1,
      currentPage -
        Math.floor(
          maxVisiblePages / 2,
        ),
    );

    let endPage = Math.min(
      totalPages,
      startPage +
        maxVisiblePages -
        1,
    );

    if (
      endPage -
        startPage +
        1 <
      maxVisiblePages
    ) {
      startPage = Math.max(
        1,
        endPage -
          maxVisiblePages +
          1,
      );
    }

    for (
      let i = startPage;
      i <= endPage;
      i++
    ) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const copyAwb = async (
    awb,
  ) => {
    try {
      await navigator?.clipboard?.writeText(
        awb,
      );

      toast.success(
        "AWB copied to clipboard",
      );
    } catch {
      toast.error(
        "Unable to copy AWB",
      );
    }
  };

  return (
    <div
      className="
        overflow-hidden
        rounded-sm
        border border-gray-200
        bg-white
        shadow-sm

        dark:border-neutral-800
        dark:bg-neutral-900
      "
    >

      {/* HEADER */}

      <div
        className="
          flex flex-col
          gap-3
          border-b
          border-gray-100
          px-5 py-5

          dark:border-neutral-800

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div
          className="
            flex items-center
            gap-3
          "
        >

          <div
            className="
              flex h-9 w-9
              items-center
              justify-center
              rounded-sm
              bg-[#0446DB]/10
            "
          >
            <Truck
              className="
                h-4 w-4
                text-[#0446DB]
              "
            />
          </div>

          <div>

            <h2
              className="
                text-base
                font-semibold
                text-gray-900
                dark:text-white
              "
            >
              Pending Pickup
            </h2>

            <p
              className="
                mt-0.5
                text-xs
                text-gray-500
                dark:text-neutral-400
              "
            >
              Pending pickup orders requiring attention
            </p>

          </div>

        </div>

        <span
          className="
            w-fit
            rounded-full
            border border-blue-100
            bg-blue-50
            px-3 py-1
            text-xs
            font-semibold
            text-[#0446DB]

            dark:border-blue-500/20
            dark:bg-blue-500/10
            dark:text-blue-300
          "
        >
          {totalOrders} Orders
        </span>

      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">

        {loading ? (

          <div
            className="
              flex min-h-[250px]
              items-center
              justify-center
            "
          >
            <Loader2
              className="
                h-7 w-7
                animate-spin
                text-[#0446DB]
              "
            />
          </div>

        ) : (

          <table
            className="
              w-full
              min-w-[900px]
            "
          >

            <thead>

              <tr
                className="
                  border-b
                  border-gray-100
                  bg-gray-50/80

                  dark:border-neutral-800
                  dark:bg-neutral-950/50
                "
              >

                <th
                  className="
                    px-5 py-3.5
                    text-left
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-500
                    dark:text-neutral-400
                  "
                >
                  Order Information
                </th>

                <th
                  className="
                    px-5 py-3.5
                    text-left
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-500
                    dark:text-neutral-400
                  "
                >
                  Delivery Address
                </th>

                <th
                  className="
                    px-5 py-3.5
                    text-left
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-500
                    dark:text-neutral-400
                  "
                >
                  Package Details
                </th>

              </tr>

            </thead>

            <tbody
              className="
                divide-y
                divide-gray-100
                dark:divide-neutral-800
              "
            >

              {currentOrders?.length >
              0 ? (

                currentOrders.map(
                  (order) => (

                    <tr
                      key={
                        order.id
                      }
                      className="
                        transition-colors
                        hover:bg-gray-50/70
                        dark:hover:bg-neutral-800/50
                      "
                    >

                      {/* ORDER */}

                      <td
                        className="
                          px-5 py-4
                          align-top
                        "
                      >

                        <div className="space-y-2">

                          <div
                            className="
                              flex
                              items-center
                              gap-1.5
                            "
                          >

                            <a
                              href={`${baseFRONT}/track-order?awb_number=${order.awb_number}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="
                                text-sm
                                font-semibold
                                text-[#0446DB]
                                transition
                                hover:underline
                              "
                            >
                              {order?.awb_number ||
                                "-"}
                            </a>

                            <button
                              type="button"
                              onClick={() =>
                                copyAwb(
                                  order?.awb_number,
                                )
                              }
                              title="Copy AWB"
                              className="
                                rounded-md
                                p-1
                                text-gray-400
                                transition

                                hover:bg-blue-50
                                hover:text-[#0446DB]

                                dark:hover:bg-blue-500/10
                              "
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>

                          </div>

                          <p
                            className="
                              text-xs
                              text-gray-500
                              dark:text-neutral-400
                            "
                          >
                            {order?.created_at
                              ? new Date(
                                  order.created_at,
                                ).toLocaleString(
                                  "en-IN",
                                  {
                                    timeZone:
                                      "Asia/Kolkata",
                                    day: "2-digit",
                                    month:
                                      "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute:
                                      "2-digit",
                                    hour12: true,
                                  },
                                )
                              : "-"}
                          </p>

                          <div
                            className="
                              flex
                              flex-wrap
                              items-center
                              gap-1.5
                              text-[11px]
                              text-gray-400
                            "
                          >

                            <span>
                              MID:{" "}
                              {order.merchant_id}
                            </span>

                            <span>
                              •
                            </span>

                            <span>
                              MOID:{" "}
                              {order
                                .merchant_order_id
                                ?.length <=
                              15
                                ? order.merchant_order_id
                                : `${order.merchant_order_id?.slice(
                                    0,
                                    15,
                                  )}...`}
                            </span>

                          </div>

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              px-2.5
                              py-1
                              text-[11px]
                              font-semibold

                              ${
                                order.rider_preference ===
                                "self"
                                  ? `
                                    bg-purple-50
                                    text-purple-700
                                    dark:bg-purple-500/10
                                    dark:text-purple-300
                                  `
                                  : `
                                    bg-blue-50
                                    text-[#0446DB]
                                    dark:bg-blue-500/10
                                    dark:text-blue-300
                                  `
                              }
                            `}
                          >
                            {order.rider_preference ===
                            "self"
                              ? "Self"
                              : "Daakit"}
                          </span>

                        </div>

                      </td>

                      {/* ADDRESS */}

                      <td
                        className="
                          px-5 py-4
                          align-top
                        "
                      >

                        <div className="max-w-[330px]">

                          <div
                            className="
                              flex
                              items-start
                              gap-2
                            "
                          >

                            <MapPin
                              className="
                                mt-0.5
                                h-4 w-4
                                shrink-0
                                text-gray-400
                              "
                            />

                            <div>

                              <p
                                className="
                                  text-sm
                                  font-semibold
                                  text-gray-800
                                  dark:text-neutral-200
                                "
                              >
                                {order.delivery_contact_name ||
                                  "-"}
                              </p>

                              <p
                                className="
                                  mt-1
                                  text-xs
                                  leading-5
                                  text-gray-500
                                  dark:text-neutral-400
                                "
                              >
                                {order.delivery_address_line ||
                                  "-"}
                              </p>

                              <p
                                className="
                                  mt-1
                                  text-xs
                                  text-gray-400
                                  dark:text-neutral-500
                                "
                              >
                                {order.delivery_city ||
                                  "-"}
                                ,{" "}
                                {order.delivery_state ||
                                  "-"}{" "}
                                -{" "}
                                {order.delivery_pincode ||
                                  "-"}
                              </p>

                              <p
                                className="
                                  mt-0.5
                                  text-[11px]
                                  text-gray-400
                                  dark:text-neutral-500
                                "
                              >
                                {order.delivery_country ||
                                  "-"}
                              </p>

                            </div>

                          </div>

                        </div>

                      </td>

                      {/* PACKAGE */}

                      <td
                        className="
                          px-5 py-4
                          align-top
                        "
                      >

                        <div className="space-y-2">

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >

                            <PackageOpen
                              className="
                                h-4 w-4
                                text-gray-400
                              "
                            />

                            <span
                              className="
                                text-sm
                                font-medium
                                text-gray-700
                                dark:text-neutral-200
                              "
                            >
                              {Number(
                                order.total_weight ||
                                  0,
                              ).toLocaleString()}
                              g
                            </span>

                          </div>

                          <p
                            className="
                              pl-6
                              text-xs
                              text-gray-500
                              dark:text-neutral-400
                            "
                          >
                            {order.package_length ||
                              "-"}{" "}
                            ×{" "}
                            {order.package_breadth ||
                              "-"}{" "}
                            ×{" "}
                            {order.package_height ||
                              "-"}
                          </p>

                        </div>

                      </td>

                    </tr>

                  ),
                )

              ) : (

                <tr>

                  <td
                    colSpan="3"
                    className="
                      px-6
                      py-16
                      text-center
                    "
                  >

                    <div
                      className="
                        flex
                        flex-col
                        items-center
                        justify-center
                      "
                    >

                      <div
                        className="
                          flex h-12 w-12
                          items-center
                          justify-center
                          rounded-full
                          bg-gray-100
                          dark:bg-neutral-800
                        "
                      >
                        <PackageOpen
                          className="
                            h-5 w-5
                            text-gray-400
                          "
                        />
                      </div>

                      <p
                        className="
                          mt-3
                          text-sm
                          font-semibold
                          text-gray-600
                          dark:text-neutral-300
                        "
                      >
                        No orders found
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-gray-400
                          dark:text-neutral-500
                        "
                      >
                        Try adjusting your date filters
                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        )}

      </div>

      {/* =================================================
          PAGINATION
      ================================================= */}

      {orders.length > 0 && (

        <div
          className="
            flex flex-col
            gap-3
            border-t
            border-gray-100
            bg-gray-50/70
            px-5 py-4

            dark:border-neutral-800
            dark:bg-neutral-950/50

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>

            <p
              className="
                text-xs
                text-gray-600
                dark:text-neutral-300
              "
            >

              Showing{" "}

              <span className="font-semibold">
                {indexOfFirstOrder +
                  1}
              </span>

              {" "}to{" "}

              <span className="font-semibold">
                {Math.min(
                  indexOfLastOrder,
                  totalOrders,
                )}
              </span>

              {" "}of{" "}

              <span className="font-semibold">
                {totalOrders}
              </span>

              {" "}orders

            </p>

          </div>

          <div
            className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-1.5
            "
          >

            {/* PREVIOUS */}

            <button
              type="button"
              onClick={() =>
                handlePageChange(
                  currentPage - 1,
                )
              }
              disabled={
                currentPage === 1
              }
              className="
                h-8
                rounded-sm
                border
                border-gray-200
                bg-white
                px-3
                text-xs
                font-medium
                text-gray-600
                transition

                hover:border-[#0446DB]/30
                hover:text-[#0446DB]

                disabled:cursor-not-allowed
                disabled:opacity-40

                dark:border-neutral-700
                dark:bg-neutral-900
                dark:text-neutral-300
              "
            >
              Previous
            </button>

            {/* PAGE NUMBERS */}

            {getPageNumbers().map(
              (pageNumber) => (

                <button
                  type="button"
                  key={
                    pageNumber
                  }
                  onClick={() =>
                    handlePageChange(
                      pageNumber,
                    )
                  }
                  className={`
                    flex
                    h-8
                    min-w-8
                    items-center
                    justify-center
                    rounded-sm
                    border
                    px-2
                    text-xs
                    font-semibold
                    transition

                    ${
                      currentPage ===
                      pageNumber
                        ? `
                          border-[#0446DB]
                          bg-[#0446DB]
                          text-white
                        `
                        : `
                          border-gray-200
                          bg-white
                          text-gray-600

                          hover:border-[#0446DB]/30
                          hover:text-[#0446DB]

                          dark:border-neutral-700
                          dark:bg-neutral-900
                          dark:text-neutral-300
                        `
                    }
                  `}
                >
                  {pageNumber}
                </button>

              ),
            )}

            {/* NEXT */}

            <button
              type="button"
              onClick={() =>
                handlePageChange(
                  currentPage + 1,
                )
              }
              disabled={
                currentPage ===
                totalPages
              }
              className="
                h-8
                rounded-sm
                border
                border-gray-200
                bg-white
                px-3
                text-xs
                font-medium
                text-gray-600
                transition

                hover:border-[#0446DB]/30
                hover:text-[#0446DB]

                disabled:cursor-not-allowed
                disabled:opacity-40

                dark:border-neutral-700
                dark:bg-neutral-900
                dark:text-neutral-300
              "
            >
              Next
            </button>

          </div>

          <p
            className="
              text-xs
              text-gray-400
              dark:text-neutral-500
            "
          >
            {itemsPerPage} per page
          </p>

        </div>

      )}

    </div>
  );
};
