
// import axios from "axios";
// import { useEffect, useState } from "react";
// import Piechart from "../../../Piechart";
// import StackBarChart from "../../../StackBarChart";
// import { toast } from "react-toastify";
// import {
//   BadgeIndianRupee,
//   Boxes,
//   CalendarDays,
//   CheckCircle2,
//   CircleX,
//   Copy,
//   Loader2,
//   MapPin,
//   PackageOpen,
//   RotateCcw,
//   ShoppingCart,
//   TriangleAlert,
//   Truck,
// } from "lucide-react";
// import CityOrdersChart from "../../../CityOrdersChart";
// import PendingOrders from "./PendingOrders";

// const baseURL = import.meta.env.VITE_BASE_URL;
// const baseFRONT = import.meta.env.VITE_FRONTEND_URL;

// export default function TechMerchantAnalytics() {
//   const [loading, setLoading] = useState(false);
//   const [analytics, setAnalytics] = useState({});
//   const [totalOrders, setTotalOrders] = useState(0);

//   const [selected, setSelected] = useState("Last 30 Days");

//   const [cities, setCities] = useState([]);
//   const [cityWiseOrders, setCityWiseOrders] = useState([]);
//   const [orders, setOrders] = useState([]);

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

//   const [customEndDate, setCustomEndDate] = useState(
//     advanceFilters.end_date,
//   );

//   /* =====================================================
//      DATE PICKER
//   ===================================================== */

//   const openDatePicker = (event) => {
//     try {
//       event.currentTarget.showPicker?.();
//     } catch {
//       return;
//     }
//   };

//   /* =====================================================
//      GET ANALYTICS
//   ===================================================== */

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

//       const order_specific_counts =
//         res?.data?.order_specific_counts;

//       const cityWise = [
//         {
//           data: [],
//           stack: "A",
//           label: "NDD",
//         },
//         {
//           data: [],
//           stack: "A",
//           label: "SDD",
//         },
//         {
//           data: [],
//           stack: "A",
//           label: "Turant",
//         },
//         {
//           data: [],
//           stack: "B",
//           label: "COD",
//         },
//         {
//           data: [],
//           stack: "B",
//           label: "Prepaid",
//         },
//       ];

//       const tempCities = [];

//       cityWise[0].data.push(
//         Number(order_specific_counts?.ndd_count),
//       );

//       cityWise[1].data.push(
//         Number(order_specific_counts?.sdd_count),
//       );

//       cityWise[2].data.push(
//         Number(order_specific_counts?.turant_count),
//       );

//       const city = "";

//       tempCities.push(city);

//       setCityWiseOrders(
//         res?.data?.city_distribution || [],
//       );

//       setCities(tempCities);

//       setOrders(
//         res?.data?.pending_pickup_orders || [],
//       );

//       setAnalytics(res?.data || {});

//       let temp = 0;

//       res?.data?.status_counts?.forEach((element) => {
//         temp += Number(element?.count || 0);
//       });

//       setTotalOrders(temp);
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Error while fetching analytics",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =====================================================
//      DATE FILTER
//   ===================================================== */

//   const handleSelect = (value) => {
//     setSelected(value);

//     if (value === "Custom Range") {
//       setCustomStartDate(
//         advanceFilters.start_date,
//       );

//       setCustomEndDate(
//         advanceFilters.end_date,
//       );

//       return;
//     }

//     let fromDate;
//     let toDate;

//     switch (value) {
//       case "Today": {
//         fromDate = new Date();
//         toDate = new Date();
//         break;
//       }

//       case "Yesterday": {
//         const yesterday = new Date();

//         yesterday.setDate(
//           yesterday.getDate() - 1,
//         );

//         fromDate = yesterday;
//         toDate = yesterday;

//         break;
//       }

//       case "Last 7 Days": {
//         const end = new Date();
//         const start = new Date();

//         start.setDate(
//           start.getDate() - 6,
//         );

//         fromDate = start;
//         toDate = end;

//         break;
//       }

//       case "Last 30 Days": {
//         const end = new Date();
//         const start = new Date();

//         start.setDate(
//           start.getDate() - 29,
//         );

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

//         fromDate.setMonth(
//           fromDate.getMonth() - 1,
//         );

//         fromDate.setDate(1);

//         toDate = new Date();

//         toDate.setDate(1);

//         toDate.setDate(
//           toDate.getDate() - 1,
//         );

//         break;
//       }

//       default:
//         return;
//     }

//     const nextFilters = {
//       start_date:
//         fromDate.toISOString().split("T")[0],

//       end_date:
//         toDate.toISOString().split("T")[0],
//     };

//     setCustomStartDate(
//       nextFilters.start_date,
//     );

//     setCustomEndDate(
//       nextFilters.end_date,
//     );

//     setAdvanceFilters(nextFilters);
//   };

//   /* =====================================================
//      CUSTOM FILTER
//   ===================================================== */

//   const handleCustomFilterApply = (event) => {
//     event.preventDefault();

//     if (
//       !customStartDate ||
//       !customEndDate
//     ) {
//       toast.error(
//         "Please select both start and end dates",
//       );

//       return;
//     }

//     if (
//       customStartDate > customEndDate
//     ) {
//       toast.error(
//         "Start date cannot be after end date",
//       );

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

//   /* =====================================================
//      HELPERS
//   ===================================================== */

//   const getPercentage = (
//     count,
//     total,
//   ) => {
//     const safeCount = Number(
//       count || 0,
//     );

//     const safeTotal = Number(
//       total || 0,
//     );

//     if (safeTotal <= 0) {
//       return 0;
//     }

//     return Math.round(
//       (safeCount / safeTotal) * 100,
//     );
//   };

//   const getStatusCount = (status) => {
//     return Number(
//       analytics?.status_counts?.find(
//         (item) =>
//           item?.status === status,
//       )?.count || 0,
//     );
//   };

//   /* =====================================================
//      LOADER
//   ===================================================== */

//   if (loading) {
//     return (
//       <div
//         className="
//           flex min-h-screen w-full
//           items-center justify-center
//           bg-[#F7F8FA]
//           dark:bg-neutral-950
//         "
//       >
//         <div className="flex flex-col items-center gap-3">

//           <div
//             className="
//               flex h-12 w-12
//               items-center justify-center
//               rounded-sm
//               border border-gray-200
//               bg-white
//               shadow-sm
//               dark:border-neutral-800
//               dark:bg-neutral-900
//             "
//           >
//             <Loader2
//               className="
//                 h-6 w-6
//                 animate-spin
//                 text-[#0446DB]
//               "
//             />
//           </div>

//           <p
//             className="
//               text-sm font-medium
//               text-gray-500
//               dark:text-neutral-400
//             "
//           >
//             Loading analytics...
//           </p>

//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="
//         min-h-screen
//         w-full
//         bg-[#F7F8FA]
//         dark:bg-neutral-950
//       "
//     >

//       {/* =================================================
//           HEADER
//       ================================================= */}

//       <div
//         className="
//           dark:bg-neutral-900
//         "
//       >
//         <div className="">

//           <div
//             className="
//               flex flex-col gap-5
//               xl:flex-row
//               xl:items-end
//               xl:justify-between
//             "
//           >

//             {/* LEFT */}

//             <div>

//               <div className="flex items-center gap-3">

               

//                 <div>

//                   <h1
//                     className="
//                       text-2xl
//                       font-bold
//                       tracking-tight
//                       text-gray-900
//                       dark:text-white
//                       lg:text-3xl
//                     "
//                   >
//                     Analytics Dashboard
//                   </h1>

//                   <p
//                     className="
//                       mt-1
//                       text-sm
//                       text-gray-500
//                       dark:text-neutral-400
//                     "
//                   >
//                     Real-time insights and performance metrics
//                   </p>

//                 </div>

//               </div>

//             </div>

//             {/* RIGHT */}

//             <div
//               className="
//                 flex flex-col gap-3
//                 lg:flex-row
//                 lg:items-end
//               "
//             >

//               <div className="min-w-[210px]">

//                 <label
//                   className="
//                     mb-1.5 block
//                     text-xs font-medium
//                     text-gray-600
//                     dark:text-neutral-300
//                   "
//                 >
//                   Filter by Date
//                 </label>

//                 <div className="relative">

//                   <CalendarDays
//                     className="
//                       pointer-events-none
//                       absolute
//                       left-3
//                       top-1/2
//                       h-4 w-4
//                       -translate-y-1/2
//                       text-gray-400
//                     "
//                   />

//                   <select
//                     value={selected}
//                     onChange={(e) =>
//                       handleSelect(
//                         e.target.value,
//                       )
//                     }
//                     className="
//                       h-10 w-full
//                       appearance-none
//                       rounded-sm
//                       border border-gray-200
//                       bg-white
//                       pl-9 pr-8
//                       text-sm
//                       text-gray-700
//                       outline-none
//                       transition

//                       focus:border-[#0446DB]
//                       focus:ring-2
//                       focus:ring-[#0446DB]/10

//                       dark:border-neutral-700
//                       dark:bg-neutral-800
//                       dark:text-neutral-200
//                     "
//                   >
//                     <option>
//                       Today
//                     </option>

//                     <option>
//                       Yesterday
//                     </option>

//                     <option>
//                       Last 7 Days
//                     </option>

//                     <option>
//                       Last 30 Days
//                     </option>

//                     <option>
//                       This Month
//                     </option>

//                     <option>
//                       Last Month
//                     </option>

//                     <option>
//                       Custom Range
//                     </option>

//                   </select>

//                 </div>

//               </div>

//               {/* CUSTOM RANGE */}

//               {selected ===
//                 "Custom Range" && (

//                 <form
//                   onSubmit={
//                     handleCustomFilterApply
//                   }
//                   className="
//                     flex flex-col gap-3
//                     sm:flex-row
//                     sm:items-end
//                   "
//                 >

//                   <div className="min-w-[155px]">

//                     <label
//                       className="
//                         mb-1.5 block
//                         text-xs font-medium
//                         text-gray-600
//                         dark:text-neutral-300
//                       "
//                     >
//                       Start Date
//                     </label>

//                     <input
//                       type="date"
//                       value={
//                         customStartDate
//                       }
//                       max={
//                         customEndDate
//                       }
//                       onClick={
//                         openDatePicker
//                       }
//                       onChange={(e) => {

//                         const newStart =
//                           e.target.value;

//                         setCustomStartDate(
//                           newStart,
//                         );

//                         if (
//                           customEndDate <
//                           newStart
//                         ) {
//                           setCustomEndDate(
//                             newStart,
//                           );
//                         }
//                       }}
//                       className="
//                         h-10 w-full
//                         cursor-pointer
//                         rounded-sm
//                         border border-gray-200
//                         bg-white
//                         px-3
//                         text-sm
//                         text-gray-700
//                         outline-none

//                         focus:border-[#0446DB]
//                         focus:ring-2
//                         focus:ring-[#0446DB]/10

//                         dark:border-neutral-700
//                         dark:bg-neutral-800
//                         dark:text-neutral-200
//                       "
//                     />

//                   </div>

//                   <div className="min-w-[155px]">

//                     <label
//                       className="
//                         mb-1.5 block
//                         text-xs font-medium
//                         text-gray-600
//                         dark:text-neutral-300
//                       "
//                     >
//                       End Date
//                     </label>

//                     <input
//                       type="date"
//                       value={
//                         customEndDate
//                       }
//                       min={
//                         customStartDate
//                       }
//                       onClick={
//                         openDatePicker
//                       }
//                       onChange={(e) => {

//                         const newEnd =
//                           e.target.value;

//                         setCustomEndDate(
//                           newEnd,
//                         );

//                         if (
//                           customStartDate >
//                           newEnd
//                         ) {
//                           setCustomStartDate(
//                             newEnd,
//                           );
//                         }
//                       }}
//                       className="
//                         h-10 w-full
//                         cursor-pointer
//                         rounded-sm
//                         border border-gray-200
//                         bg-white
//                         px-3
//                         text-sm
//                         text-gray-700
//                         outline-none

//                         focus:border-[#0446DB]
//                         focus:ring-2
//                         focus:ring-[#0446DB]/10

//                         dark:border-neutral-700
//                         dark:bg-neutral-800
//                         dark:text-neutral-200
//                       "
//                     />

//                   </div>

//                   <button
//                     type="submit"
//                     className="
//                       h-10
//                       rounded-sm
//                       bg-[#0446DB]
//                       px-5
//                       text-sm
//                       font-semibold
//                       text-white
//                       transition

//                       hover:bg-[#033bb9]

//                       focus:ring-2
//                       focus:ring-[#0446DB]/20
//                     "
//                   >
//                     Apply
//                   </button>

//                 </form>
//               )}

//             </div>

//           </div>

//         </div>
//       </div>

//       {/* =================================================
//           CONTENT
//       ================================================= */}

//       <div
//         className="
//           space-y-6
//            py-2
//         "
//       >

//         {/* =================================================
//             STATS CARDS
//         ================================================= */}

//         <div
//           className="
//             grid grid-cols-1
//             gap-4
//             sm:grid-cols-2
//             xl:grid-cols-4
//           "
//         >

//           <DashboardStatCard
//             title="Total Revenue"
//             value={`₹${Number(
//               analytics?.order_revenue ||
//                 0,
//             ).toLocaleString("en-IN")}`}
//             icon={BadgeIndianRupee}
//             percentage={100}
//             subtitle="All revenue"
//             accent="blue"
//           />

//           <DashboardStatCard
//             title="Total Orders"
//             value={Number(
//               totalOrders || 0,
//             ).toLocaleString("en-IN")}
//             icon={Boxes}
//             percentage={100}
//             subtitle="All orders"
//             accent="indigo"
//           />

//           <DashboardStatCard
//             title="Delivered"
//             value={getStatusCount(
//               "delivered",
//             ).toLocaleString("en-IN")}
//             icon={CheckCircle2}
//             percentage={getPercentage(
//               getStatusCount(
//                 "delivered",
//               ),
//               totalOrders,
//             )}
//             subtitle="Success rate"
//             accent="green"
//           />

//           <DashboardStatCard
//             title="Booked"
//             value={getStatusCount(
//               "booked",
//             ).toLocaleString("en-IN")}
//             icon={ShoppingCart}
//             percentage={getPercentage(
//               getStatusCount("booked"),
//               totalOrders,
//             )}
//             subtitle="Booking rate"
//             accent="cyan"
//           />

//           <DashboardStatCard
//             title="Out for Delivery"
//             value={getStatusCount(
//               "out for delivery",
//             ).toLocaleString("en-IN")}
//             icon={Truck}
//             percentage={getPercentage(
//               getStatusCount(
//                 "out for delivery",
//               ),
//               totalOrders,
//             )}
//             subtitle="Delivery rate"
//             accent="orange"
//           />

//           <DashboardStatCard
//             title="Cancelled"
//             value={getStatusCount(
//               "cancelled",
//             ).toLocaleString("en-IN")}
//             icon={CircleX}
//             percentage={getPercentage(
//               getStatusCount(
//                 "cancelled",
//               ),
//               totalOrders,
//             )}
//             subtitle="Cancellation rate"
//             accent="red"
//           />

//           <DashboardStatCard
//             title="Order NDR's"
//             value={getStatusCount(
//               "ndr",
//             ).toLocaleString("en-IN")}
//             icon={TriangleAlert}
//             percentage={getPercentage(
//               getStatusCount("ndr"),
//               totalOrders,
//             )}
//             subtitle="NDR rate"
//             accent="amber"
//           />

//           <DashboardStatCard
//             title="RTO Delivered"
//             value={getStatusCount(
//               "rto delivered",
//             ).toLocaleString("en-IN")}
//             icon={RotateCcw}
//             percentage={getPercentage(
//               getStatusCount(
//                 "rto delivered",
//               ),
//               totalOrders,
//             )}
//             subtitle="RTO rate"
//             accent="purple"
//           />

//         </div>

//         {/* =================================================
//             CHARTS
//         ================================================= */}

//         <div
//           className="
//             grid grid-cols-1
//             gap-5
//             lg:grid-cols-3
//           "
//         >

//           {/* ORDER MODE */}

//           <ChartCard
//             title="Order Mode"
//             description="Distribution by delivery mode"
//           >

//             <Piechart
//               data={[
//                 {
//                   id: "turant",
//                   name: "Turant",
//                   value: Number(
//                     analytics
//                       ?.order_specific_counts
//                       ?.turant_count || 0,
//                   ),
//                   label: "Turant",
//                   color: "#F25912",
//                 },

//                 {
//                   id: "sdd",
//                   name:
//                     "Same Day Delivery",
//                   value: Number(
//                     analytics
//                       ?.order_specific_counts
//                       ?.sdd_count || 0,
//                   ),
//                   label: "SDD",
//                   color: "#03A6A1",
//                 },

//                 {
//                   id: "ndd",
//                   name:
//                     "Next Day Delivery",
//                   value: Number(
//                     analytics
//                       ?.order_specific_counts
//                       ?.ndd_count || 0,
//                   ),
//                   label: "NDD",
//                   color: "#0446DB",
//                 },
//               ]}
//             />

//           </ChartCard>

//           {/* LIVE ORDER STATUS */}

//           <ChartCard
//             title="Live Orders Status"
//             description="Current order lifecycle"
//             live
//           >

//             <Piechart
//               data={[
//                 {
//                   id: "booked",
//                   name: "Booked",
//                   value:
//                     getStatusCount(
//                       "booked",
//                     ),
//                   label: "Booked",
//                   color: "#03A6A1",
//                 },

//                 {
//                   id:
//                     "out for delivery",
//                   name:
//                     "Out For Delivery",
//                   value:
//                     getStatusCount(
//                       "out for delivery",
//                     ),
//                   label:
//                     "Out For Delivery",
//                   color: "#0446DB",
//                 },

//                 {
//                   id: "ndr",
//                   name: "NDR",
//                   value:
//                     getStatusCount(
//                       "ndr",
//                     ),
//                   label: "NDR",
//                   color: "#F59E0B",
//                 },

//                 {
//                   id: "undelivered",
//                   name: "Undelivered",
//                   value:
//                     getStatusCount(
//                       "undelivered",
//                     ),
//                   label:
//                     "Undelivered",
//                   color: "#F25912",
//                 },
//               ]}
//             />

//           </ChartCard>

//           {/* PAYMENT */}

//           <ChartCard
//             title="Payment Methods"
//             description="COD and prepaid distribution"
//           >

//             <Piechart
//               data={
//                 analytics
//                   ?.order_type_counts
//                   ?.map((item) => ({
//                     id: item.order_type
//                       .toLowerCase()
//                       .replace(
//                         /\s+/g,
//                         "_",
//                       ),

//                     name:
//                       item.order_type,

//                     value: Number(
//                       item.count,
//                     ),

//                     label:
//                       item.order_type,

//                     color: item.order_type
//                       .toLowerCase()
//                       .includes("cod")
//                       ? "#F25912"
//                       : "#03A6A1",
//                   })) || []
//               }
//             />

//           </ChartCard>

//         </div>

//         {/* =================================================
//             CITY WISE ORDERS
//         ================================================= */}

//         <div
//           className="
//             rounded-sm
//             border border-gray-200
//             bg-white
//             p-5
//             shadow-sm

//             dark:border-neutral-800
//             dark:bg-neutral-900

//             sm:p-6
//           "
//         >

//           <div
//             className="
//               mb-5
//               flex items-center
//               gap-3
//             "
//           >

//             <div
//               className="
//                 flex h-9 w-9
//                 items-center justify-center
//                 rounded-sm
//                 bg-[#0446DB]/10
//               "
//             >
//               <MapPin
//                 className="
//                   h-4 w-4
//                   text-[#0446DB]
//                 "
//               />
//             </div>

//             <div>

//               <h2
//                 className="
//                   text-base
//                   font-semibold
//                   text-gray-900
//                   dark:text-white
//                 "
//               >
//                 City Wise Order Distribution
//               </h2>

//               <p
//                 className="
//                   mt-0.5
//                   text-xs
//                   text-gray-500
//                   dark:text-neutral-400
//                 "
//               >
//                 Orders distributed across delivery locations
//               </p>

//             </div>

//           </div>

//           <div className="max-h-[390px] overflow-y-scroll">
//             <CityOrdersChart cityWiseOrders={cityWiseOrders} />
             
//             {/* <StackBarChart
//               data={cityWiseOrders}
//               labels={cities}
//             /> */}

//           </div>

//         </div>

//         {/* =================================================
//             UPCOMING PICKUPS
//         ================================================= */}
//                <div className="">

//         <PendingOrders
//           orders={orders}
//         />
//         {/* <PendingOrders
//           orders={orders}
//         /> */}
//                </div>

//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    CHART CARD
// ========================================================= */

// const ChartCard = ({
//   title,
//   description,
//   live = false,
//   children,
// }) => {
//   return (
//     <div
//       className="
//         rounded-sm
//         border border-gray-200
//         bg-white
//         p-5
//         shadow-sm
//         transition-all
//         duration-200

//         hover:shadow-md

//         dark:border-neutral-800
//         dark:bg-neutral-900
//       "
//     >

//       <div
//         className="
//           mb-4
//           flex items-start
//           justify-between
//           gap-3
//           border-b
//           border-gray-100
//           pb-4

//           dark:border-neutral-800
//         "
//       >

//         <div>

//           <h2
//             className="
//               text-base
//               font-semibold
//               text-gray-900
//               dark:text-white
//             "
//           >
//             {title}
//           </h2>

//           <p
//             className="
//               mt-1
//               text-xs
//               text-gray-500
//               dark:text-neutral-400
//             "
//           >
//             {description}
//           </p>

//         </div>

//         {live && (

//           <span
//             className="
//               inline-flex
//               items-center
//               gap-1.5
//               rounded-full
//               bg-green-50
//               px-2.5
//               py-1
//               text-[11px]
//               font-semibold
//               text-green-700

//               dark:bg-green-500/10
//               dark:text-green-400
//             "
//           >

//             <span
//               className="
//                 h-1.5 w-1.5
//                 animate-pulse
//                 rounded-full
//                 bg-green-500
//               "
//             />

//             Live

//           </span>

//         )}

//       </div>

//       <div className="min-h-[250px]">
//         {children}
//       </div>

//     </div>
//   );
// };

// /* =========================================================
//    DASHBOARD STAT CARD
// ========================================================= */

// const DashboardStatCard = ({
//   title,
//   value,
//   icon: Icon,
//   percentage = 0,
//   subtitle,
//   accent = "blue",
// }) => {
//   const styles = {
//     blue: {
//       icon: `
//         bg-blue-50
//         text-[#0446DB]
//         dark:bg-blue-500/10
//         dark:text-blue-300
//       `,
//       bar: "bg-[#0446DB]",
//     },

//     indigo: {
//       icon: `
//         bg-indigo-50
//         text-indigo-600
//         dark:bg-indigo-500/10
//         dark:text-indigo-300
//       `,
//       bar: "bg-indigo-500",
//     },

//     green: {
//       icon: `
//         bg-green-50
//         text-green-600
//         dark:bg-green-500/10
//         dark:text-green-400
//       `,
//       bar: "bg-green-500",
//     },

//     cyan: {
//       icon: `
//         bg-cyan-50
//         text-cyan-600
//         dark:bg-cyan-500/10
//         dark:text-cyan-300
//       `,
//       bar: "bg-cyan-500",
//     },

//     orange: {
//       icon: `
//         bg-orange-50
//         text-orange-600
//         dark:bg-orange-500/10
//         dark:text-orange-300
//       `,
//       bar: "bg-orange-500",
//     },

//     red: {
//       icon: `
//         bg-red-50
//         text-red-600
//         dark:bg-red-500/10
//         dark:text-red-400
//       `,
//       bar: "bg-red-500",
//     },

//     amber: {
//       icon: `
//         bg-amber-50
//         text-amber-600
//         dark:bg-amber-500/10
//         dark:text-amber-300
//       `,
//       bar: "bg-amber-500",
//     },

//     purple: {
//       icon: `
//         bg-purple-50
//         text-purple-600
//         dark:bg-purple-500/10
//         dark:text-purple-300
//       `,
//       bar: "bg-purple-500",
//     },
//   };

//   const current =
//     styles[accent] ||
//     styles.blue;

//   const safePercentage =
//     Math.min(
//       100,
//       Math.max(
//         0,
//         Number(
//           percentage || 0,
//         ),
//       ),
//     );

//   return (
//     <div
//       className="
//         group
//         overflow-hidden
//         rounded-sm
//         border border-gray-200
//         bg-white
//         shadow-sm
//         transition-all
//         duration-200

//         hover:-translate-y-0.5
//         hover:shadow-md

//         dark:border-neutral-800
//         dark:bg-neutral-900
//       "
//     >

//       <div className="p-5">

//         <div
//           className="
//             flex items-start
//             justify-between
//             gap-4
//           "
//         >

//           <div className="min-w-0">

//             <p
//               className="
//                 truncate
//                 text-sm
//                 font-medium
//                 text-gray-500
//                 dark:text-neutral-400
//               "
//             >
//               {title}
//             </p>

//             <p
//               className="
//                 mt-2
//                 text-2xl
//                 font-bold
//                 tracking-tight
//                 text-gray-900

//                 dark:text-white

//                 sm:text-3xl
//               "
//             >
//               {value}
//             </p>

//           </div>

//           <div
//             className={`
//               flex
//               h-10 w-10
//               shrink-0
//               items-center
//               justify-center
//               rounded-sm

//               ${current.icon}
//             `}
//           >

//             <Icon
//               size={20}
//               strokeWidth={1.8}
//             />

//           </div>

//         </div>

//         <div className="mt-5">

//           <div
//             className="
//               mb-2
//               flex items-center
//               justify-between
//               gap-3
//             "
//           >

//             <span
//               className="
//                 text-xs
//                 text-gray-500
//                 dark:text-neutral-400
//               "
//             >
//               {subtitle}
//             </span>

//             <span
//               className="
//                 text-xs
//                 font-semibold
//                 text-gray-700
//                 dark:text-neutral-200
//               "
//             >
//               {safePercentage}%
//             </span>

//           </div>

//           <div
//             className="
//               h-1.5
//               overflow-hidden
//               rounded-full
//               bg-gray-100
//               dark:bg-neutral-800
//             "
//           >

//             <div
//               className={`
//                 h-full
//                 rounded-full
//                 ${current.bar}
//               `}
//               style={{
//                 width: `${safePercentage}%`,
//               }}
//             />

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// };

// /* =========================================================
//    PENDING ORDERS
// ========================================================= */



import axios from "axios";
import { useEffect, useState } from "react";
import {Piechart} from "../../../chart/Piechart";
import StackBarChart from "../../../StackBarChart";
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
import CityOrdersChart from "./CityOrdersChart";
import PendingOrders from "./PendingOrders";
const formatRevenue = (value) => {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount)) return "₹0";
  const absolute = Math.abs(amount);
  const format = (number) => number.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  if (absolute >= 10000000) return `₹${format(amount / 10000000)} Cr`;
  if (absolute >= 100000) return `₹${format(amount / 100000)} Lakh`;
  if (absolute >= 1000) return `₹${format(amount / 1000)} K`;
  return `₹${format(amount)}`;
};

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
        className="flex min-h-screen w-full items-center justify-center bg-[#F7F8FA] dark:bg-neutral-950"
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <Loader2
              className="h-6 w-6 animate-spin text-[#0446DB]"
            />
          </div>
          <p
            className="text-sm font-medium text-gray-500 dark:text-neutral-400"
          >
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div
      className="min-h-screen w-full min-w-0 dark:bg-neutral-800"
    >
      {/* =================================================
          HEADER
      ================================================= */}
      <div
        className="relative mb-5 dark:bg-neutral-800"
      >
        <div className="">
          <div
            className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"
          >
            {/* LEFT */}
            <div>
              <div className="flex items-center gap-3">
                <div>
                  <h1
                    className="text-2xl font-bold text-gray-900 dark:text-white"
                  >
                    Analytics Dashboard
                  </h1>
                  <p
                    className="mt-2 text-sm text-gray-500 dark:text-neutral-400"
                  >
                    Real-time insights and performance metrics
                  </p>
                </div>
              </div>
            </div>
            {/* RIGHT */}
            <div
              className="flex flex-col gap-3 lg:flex-row lg:items-end"
            >
              <div className="min-w-[210px]">
                <label
                  className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-neutral-300"
                >
                  Filter by Date
                </label>
                <div className="relative">
                  <CalendarDays
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    value={selected}
                    onChange={(e) =>
                      handleSelect(
                        e.target.value,
                      )
                    }
                    className="h-10 w-full appearance-none rounded-sm border border-gray-200 bg-white pl-9 pr-8 text-sm text-gray-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
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
                  className="flex flex-col gap-3 sm:flex-row sm:items-end"
                >
                  <div className="min-w-[155px]">
                    <label
                      className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-neutral-300"
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
                      className="h-10 w-full cursor-pointer rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    />
                  </div>
                  <div className="min-w-[155px]">
                    <label
                      className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-neutral-300"
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
                      className="h-10 w-full cursor-pointer rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-10 rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition hover:bg-[#033bb9] focus:ring-2 focus:ring-[#0446DB]/20"
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
        className="space-y-6"
      >
        {/* =================================================
            STATS CARDS
        ================================================= */}
        <div
          className="mb-8 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-6"
        >
          <DashboardStatCard
            title="Total Revenue"
            value={formatRevenue(analytics?.order_revenue)}
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
              "rto delivered",
            ).toLocaleString("en-IN")}
            icon={RotateCcw}
            percentage={getPercentage(
              getStatusCount(
                "rto delivered",
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
          className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          {/* ORDER MODE */}
          <ChartCard
            title="Order Mode"
          >
            <Piechart
              data={[
                {
                  id: "hld",
                  name: "HLD",
                  value: Number(
                    analytics
                      ?.order_hld_counts
                      ?.hld_count || 0,
                  ),
                  label: "Turant",
                  color: "#03A6A1",
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
                  color: "#FFA673",
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
                  color: "#0446DB",
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
                  color: "#03A6A1",
                },
                {
                  id: "ndr",
                  name: "NDR",
                  value:
                    getStatusCount(
                      "ndr",
                    ),
                  label: "NDR",
                  color: "#FFA673",
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
                      ? "#0446DB"
                      : "#FFA673",
                  })) || []
              }
            />
          </ChartCard>
        </div>
        {/* =================================================
            CITY WISE ORDERS
        ================================================= */}
        <div
          className=""
        >
         
            <CityOrdersChart cityWiseOrders={cityWiseOrders} />
            
        </div>
        {/* =================================================
            UPCOMING PICKUPS
        ================================================= */}
               <div className="">
        <PendingOrders
          orders={orders}
        />
        {/* <PendingOrders
          orders={orders}
        /> */}
               </div>
      </div>
    </div>
  );
}
/* =========================================================
   CHART CARD
========================================================= */
const ChartCard = ({ title, live = false, children }) => {
  return (
    <div className="min-w-0 rounded-sm border border-gray-300 bg-white p-6 transition-all duration-300 dark:border-gray-800 dark:bg-neutral-900">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h3>
        {live && (
          <span className="relative inline-flex h-3 w-3 shrink-0 items-center justify-center" aria-label="Live">
            <span className="absolute h-full w-full animate-ping rounded-full bg-green-400 opacity-50" />
            <span className="relative h-2 w-2 animate-[pulse_0.8s_steps(2,end)_infinite] rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          </span>
        )}
      </div>
      {children}
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
        bg-blue-100
        text-[#0446DB]
        dark:bg-blue-500/10
        dark:text-blue-300
      `,
      bar: "bg-[#0446DB]",
    },
    indigo: {
      icon: `
        bg-indigo-100
        text-indigo-600
        dark:bg-indigo-500/10
        dark:text-indigo-300
      `,
      bar: "bg-indigo-500",
    },
    green: {
      icon: `
        bg-green-100
        text-green-600
        dark:bg-green-500/10
        dark:text-green-400
      `,
      bar: "bg-green-500",
    },
    cyan: {
      icon: `
        bg-cyan-100
        text-cyan-600
        dark:bg-cyan-500/10
        dark:text-cyan-300
      `,
      bar: "bg-cyan-500",
    },
    orange: {
      icon: `
        bg-orange-100
        text-orange-600
        dark:bg-orange-500/10
        dark:text-orange-300
      `,
      bar: "bg-orange-500",
    },
    red: {
      icon: `
        bg-red-100
        text-red-600
        dark:bg-red-500/10
        dark:text-red-400
      `,
      bar: "bg-red-500",
    },
    amber: {
      icon: `
        bg-amber-100
        text-amber-600
        dark:bg-amber-500/10
        dark:text-amber-300
      `,
      bar: "bg-amber-500",
    },
    purple: {
      icon: `
        bg-purple-100
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
      className="group flex h-full w-full min-w-0 flex-col rounded-sm border border-gray-300 bg-white transition-all duration-300 hover:border-[#0446DB]/20 dark:border-gray-800 dark:bg-neutral-900"
    >
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div
          className="flex items-start justify-between gap-2"
        >
          <div className="min-w-0 flex-1">
            <p
              className="mb-1 text-sm font-semibold text-gray-700 dark:text-white"
            >
              {title}
            </p>
            <p
              className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl"
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
              rounded-xl
              ${current.icon}
            `}
          >
            <Icon
              size={20}
              strokeWidth={1.8}
            />
          </div>
        </div>
        <div className="mt-auto pt-4">
          <div
            className="mb-1 flex items-center justify-between gap-2"
          >
            <span
              className="text-xs text-gray-500 dark:text-neutral-400"
            >
              {subtitle}
            </span>
            <span
              className="text-xs font-semibold text-gray-700 dark:text-neutral-200"
            >
              {safePercentage}%
            </span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-800"
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
