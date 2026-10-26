
import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  SlidersHorizontal,
  RotateCcw,
  RefreshCw,
  X,
  Check,
  Download,
  ChevronDown,
} from "lucide-react";

import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

import { rainbowSurgePalette } from "@mui/x-charts/colorPalettes";

import { useTheme } from "@mui/material/styles";

import { toast } from "react-toastify";



import { TbReportAnalytics } from "react-icons/tb";

import { FaPlaneArrival } from "react-icons/fa";

import { GiCancel } from "react-icons/gi";

import { TbTruckReturn } from "react-icons/tb";

import CityOrdersChart from "../../CityOrdersChart";

import BottomScrollCounter from "../../ui/OdometerCounter";

import { Loader2 } from "lucide-react";

import AxiosInstance from "../../../Helper/axiosInstance";
import CustomButton from "../../common/CustomButton";
import MobileAnalytics from "./MobileAnalytics";
import { Piechart } from "../../chart/Piechart";
import OrderAndCODStatus from "./OrderAndCODStatus";
import { OrdersDelivered, PenOrdersIcon, TotalOrderIcon } from "../../common/svg/Icons";
import AdvancedFiltersDrawer from "./AdvancedFiltersDrawe";

export default function Analytics() {
  const theme = useTheme();

  const palette = rainbowSurgePalette(theme.palette.mode);

  const [loading, setLoading] = useState(false);

  const [analytics, setAnalytics] = useState({});

  const [selected, setSelected] = useState("Last 30 Days");

  const [liveOrders, setLiveOrders] = useState(null);

  const [codRemittance, setCODRemittance] = useState(null);

  const [cityWiseOrders, setCityWiseOrders] = useState([]);

  const today = new Date();

  const thirtyDaysBack = new Date();

  thirtyDaysBack.setDate(thirtyDaysBack.getDate() - 29);

  const [advanceFilters, setAdvanceFilters] = useState({
    end_date: today.toISOString().split("T")[0],

    start_date: thirtyDaysBack.toISOString().split("T")[0],
  });

  const [customStartDate, setCustomStartDate] = useState(
    advanceFilters.start_date,
  );

  const [customEndDate, setCustomEndDate] = useState(advanceFilters.end_date);
  
const [expandedMerchant, setExpandedMerchant] = useState(null);
  const [vendorList, setVendorList] = useState([]);
  const [merchantSearch, setMerchantSearch] = useState("");
  const [merchantPage, setMerchantPage] = useState(1);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [draftDatePreset, setDraftDatePreset] = useState("Last 30 Days");
  const [draftStartDate, setDraftStartDate] = useState("");
  const [draftEndDate, setDraftEndDate] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterDcId, setFilterDcId] = useState("");
  const [filterVendorId, setFilterVendorId] = useState("");
  const [appliedScope, setAppliedScope] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [filteredStats, setFilteredStats] = useState(null);
  // Prefer filtered API values only when filters are active and filtered data is returned.
  const hasActiveScope = Object.keys(appliedScope).length > 0;
  const scopedOrders = hasActiveScope
    ? filteredStats?.order_status_counts
    : null;

   const totalOrdersKpi =  Number(analytics?.overall_orders?.total_orders) || 0;
  const deliveredOrdersKpi =  Number(liveOrders?.["delivered"]) || 0
  const ndrOrdersKpi =  Number(liveOrders?.["ndr"]) || 0;
  const rtoOrdersKpi =  Number(liveOrders?.["rto delivered"])  || 0
  const excludedStatuses = [
  "ndr",
  "lost",
  "cancelled",
  "rto delivered",
  "rto in transit",
  "delivered",
];


const selectedVendor = vendorList.find(
  (vendor) =>
    String(vendor.id) === String(appliedScope.vendor_id)
);

const selectedVendorName =
  selectedVendor?.vendor_name || "";

const openOrderKpi =
  analytics?.order_status_counts?.reduce((total, item) => {
    const status = String(item.status || "").trim().toLowerCase();

    if (excludedStatuses.includes(status)) {
      return total;
    }

    return total + (Number(item.count) || 0);
  }, 0) || 0;


  const percentOfOrders = (count) =>
    totalOrdersKpi > 0
      ? Math.min(100, Math.max(0, Math.round((count / totalOrdersKpi) * 100)))
      : 0;

  useEffect(() => {
    let cancelled = false;
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await AxiosInstance.get(
          "/api/admin/getOrderAndRemittanceStats",
          {
            params: { ...advanceFilters, ...appliedScope },
          },
        );
        if (cancelled) return;
        if (res.data?.success === false)
          throw new Error(res.data.message || "Failed to load analytics");
        const data = res.data?.data || {};
        setAnalytics(data);
        const statuses = {};
        (data.order_status_counts || []).forEach((item) => {
          statuses[
            String(item.status || "")
              .trim()
              .toLowerCase()
          ] = Number(item.count) || 0;
        });
        setLiveOrders(statuses);
        const remittance = {};
        (data.cod_remittance_counts || []).forEach((item) => {
          remittance[
            String(item.status || "")
              .trim()
              .toLowerCase()
          ] = Number(item.count) || 0;
        });
        setCODRemittance(remittance);
        setCityWiseOrders(data.city_wise_orders || []);
        setFilteredStats(data.filtered_stats || null);
      } catch (err) {
        if (!cancelled)
          toast.error(
            err.response?.data?.message ||
              err.message ||
              "Failed to load analytics",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAnalytics();
    // const timer = setInterval(fetchAnalytics, 120000);

const timer = setInterval(() => {
  const dates = dateRangeForPreset("Last 30 Days");

  setSelected("Last 30 Days");
  setAdvanceFilters(dates);
  setCustomStartDate(dates.start_date);
  setCustomEndDate(dates.end_date);

  setAppliedScope({});

  setDraftDatePreset("Last 30 Days");
  setDraftStartDate(dates.start_date);
  setDraftEndDate(dates.end_date);

  setFilterCity("");
  setFilterDcId("");
  setFilterVendorId("");

  setFilterDrawerOpen(false);
  setRefreshKey((prev) => prev + 1);
},120000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [advanceFilters, appliedScope, refreshKey]);

  const localDate = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const dateRangeForPreset = (preset) => {
    const today = new Date();
    const start = new Date(today);
    const end = new Date(today);
    if (preset === "Yesterday") {
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
    } else if (preset === "Last 7 Days") start.setDate(start.getDate() - 6);
    else if (preset === "Last 30 Days") start.setDate(start.getDate() - 29);
    else if (preset === "This Month") start.setDate(1);
    else if (preset === "Last Month") {
      start.setDate(1);
      start.setMonth(start.getMonth() - 1);
      end.setDate(0);
    }
    return { start_date: localDate(start), end_date: localDate(end) };
  };
  const openFilters = (open) => {
    setFilterDrawerOpen(open);
    if (open) {
      setDraftDatePreset(selected);
      setDraftStartDate(advanceFilters.start_date);
      setDraftEndDate(advanceFilters.end_date);
      setFilterCity(appliedScope.city || "");
      setFilterDcId(String(appliedScope.dc_id || ""));
      setFilterVendorId(String(appliedScope.vendor_id || ""));
    }
  };
  const applyScope = (e) => {
    e.preventDefault();
    const dc = filterDcId.trim();
    const vendorId = filterVendorId.trim();

    if (
      (dc && !/^[1-9]\d*$/.test(dc)) ||
      (vendorId && !/^[1-9]\d*$/.test(vendorId))
    ) {
      toast.error("DC ID and Vendor ID must be positive integers");
      return;
    }
    const dates =
      draftDatePreset === "Custom Range"
        ? { start_date: draftStartDate, end_date: draftEndDate }
        : dateRangeForPreset(draftDatePreset);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(dates.start_date || "") ||
      !/^\d{4}-\d{2}-\d{2}$/.test(dates.end_date || "") ||
      dates.start_date > dates.end_date
    ) {
      toast.error("Please select a valid start and end date");
      return;
    }
    setSelected(draftDatePreset);
    setAdvanceFilters(dates);
    setCustomStartDate(dates.start_date);
    setCustomEndDate(dates.end_date);
    setAppliedScope({
      ...(filterCity ? { city: filterCity } : {}),
      ...(dc ? { dc_id: dc } : {}),
      ...(vendorId ? { vendor_id: vendorId } : {}),
    });
    setFilterDrawerOpen(false);
  };
  const resetAllFilters = () => {
    const dates = dateRangeForPreset("Last 30 Days");
    setDraftDatePreset("Last 30 Days");
    setDraftStartDate(dates.start_date);
    setDraftEndDate(dates.end_date);
    setSelected("Last 30 Days");
    setAdvanceFilters(dates);
    setCustomStartDate(dates.start_date);
    setCustomEndDate(dates.end_date);
    setFilterCity("");
    setFilterDcId("");
    setFilterVendorId("");
    setAppliedScope({});
    setFilterDrawerOpen(false);
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


    useEffect(()=>{
      getAllVendors()
    },[])

  const merchantRows = (analytics.merchant_wise_orders || []).filter((row) =>
    `${row.merchant_name || ""} ${row.merchant_id || ""}`
      .toLowerCase()
      .includes(merchantSearch.toLowerCase()),
  );
  const visibleMerchants = merchantRows.slice(
    (merchantPage - 1) * 10,
    merchantPage * 10,
  );
  const formatCount = (value) => (Number(value) || 0).toLocaleString("en-IN");

  const handleSelect = (value) => {
    setSelected(value);

    if (value === "Custom Range") {
      setCustomStartDate(advanceFilters.start_date);

      setCustomEndDate(advanceFilters.end_date);

      return;
    }

    let fromDate, toDate;

    switch (value) {
      case "Today": {
        fromDate = new Date();

        toDate = new Date();

        break;
      }

      case "Yesterday": {
        const yesterday = new Date();

        yesterday.setDate(yesterday.getDate() - 1);

        fromDate = yesterday;

        toDate = yesterday;

        break;
      }

      case "Last 7 Days": {
        const end = new Date();

        const start = new Date();

        start.setDate(start.getDate() - 6);

        fromDate = start;

        toDate = end;

        break;
      }

      case "Last 30 Days": {
        const end = new Date();

        const start = new Date();

        start.setDate(start.getDate() - 29);

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

        fromDate.setDate(1);

        fromDate.setMonth(fromDate.getMonth() - 1);

        toDate = new Date();

        toDate.setDate(1);

        toDate.setDate(toDate.getDate() - 1);

        break;
      }

      default:
        return;
    }

    const nextFilters = {
      start_date: fromDate.toISOString().split("T")[0],

      end_date: toDate.toISOString().split("T")[0],
    };

    setCustomStartDate(nextFilters.start_date);

    setCustomEndDate(nextFilters.end_date);

    setAdvanceFilters(nextFilters);
  };

  // counter

  const [count, setCount] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [displayValue, setDisplayValue] = useState(200); // initial value

  const targetValue = 204; // or any dynamic value



const [isMobile, setIsMobile] = useState(
  () => typeof window !== "undefined" && window.innerWidth < 768
);

useEffect(() => {
  const mediaQuery = window.matchMedia("(max-width: 767px)");

  const handleChange = (event) => {
    setIsMobile(event.matches);
  };

  setIsMobile(mediaQuery.matches);

  mediaQuery.addEventListener("change", handleChange);

  return () => {
    mediaQuery.removeEventListener("change", handleChange);
  };
}, []);

const removeDateFilter = () => {
    const dates = dateRangeForPreset("Last 30 Days");
    setSelected("Last 30 Days");
    setAdvanceFilters(dates);
    setCustomStartDate(dates.start_date);
    setCustomEndDate(dates.end_date);
    setDraftDatePreset("Last 30 Days"); // Taaki filter drawer me bhi reset dikhe
    setDraftStartDate(dates.start_date);
    setDraftEndDate(dates.end_date);
  };

   // ✅ Sirf City remove karne ke liye
  const removeCityFilter = () => {
    setFilterCity(""); // State reset
    const { city, ...rest } = appliedScope; // Applied scope se city hatao
    setAppliedScope(rest);
  };

  // ✅ Sirf Fleet Partner remove karne ke liye
  const removeVendorFilter = () => {
    setFilterVendorId(""); // State reset
    const { vendor_id, ...rest } = appliedScope; // Applied scope se vendor hatao
    setAppliedScope(rest);
  };

  useEffect(() => {
    if (displayValue === targetValue) return;

    const step = displayValue < targetValue ? 1 : -1;

    const interval = setInterval(() => {
      setDisplayValue((prev) => {
        if (prev === targetValue) {
          clearInterval(interval);

          return prev;
        }

        return prev + step;
      });
    }, 100); // adjust speed as needed

    return () => clearInterval(interval);
  }, [displayValue, targetValue]);

  return (
    <>
    {/* <MobileAnalytics/> */}
    <div>

      {loading ? (
        <div className=" w-full h-[90vh] flex justify-center items-center">
          <div>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />

            <p className="mt-2">Loading Analytics Dashboard...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen w-full">
          {/* Header Section */}
          <div className="relative dark:bg-neutral-800">
            <div className="relative z-10  mx-auto mb-5">
              <div className="flex justify-between gap-6">
                {/* Heading */}
                <div className="text-left">
                  <h1 className="text-2xl lg:text-3xl font-bold dark:text-white mb-0">
                    Dashboard
                  </h1>
                  <div className="flex items-center justify-center"></div>
                  <p className="dark:text-indigo-100 text-gray-500 text-sm md:text-lg">
                    Real-time insights and performance metrics
                  </p>
                </div>
                
                <AdvancedFiltersDrawer
                  filterDrawerOpen={filterDrawerOpen}
                  openFilters={openFilters}
                  draftDatePreset={draftDatePreset}
                  setDraftDatePreset={setDraftDatePreset}
                  draftStartDate={draftStartDate}
                  setDraftStartDate={setDraftStartDate}
                  draftEndDate={draftEndDate}
                  setDraftEndDate={setDraftEndDate}
                  filterCity={filterCity}
                  setFilterCity={setFilterCity}
                  filterVendorId={filterVendorId}
                  setFilterVendorId={setFilterVendorId}
                  vendorList={vendorList}
                  applyScope={applyScope}
                  resetAllFilters={resetAllFilters}
                />

              </div>

              {hasActiveScope && (
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1.5 text-[11px] font-medium text-[#3730A3] dark:bg-indigo-900/30 dark:text-indigo-400 uppercase">
                              {selected}
                              <X
                                className="h-3.5 w-3.5 cursor-pointer hover:text-red-500"
                                onClick={removeDateFilter}
                              />
                            </span>
              
                            {appliedScope.city && (
                              <span className="flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1.5 text-[11px] font-medium text-[#3730A3] dark:bg-indigo-900/30 dark:text-indigo-400 uppercase">
                                {appliedScope.city}
                                <X
                                  className="h-3.5 w-3.5 cursor-pointer hover:text-red-500"
                                  onClick={removeCityFilter}
                                />
                              </span>
                            )}
              
                            {appliedScope.vendor_id && (
                              <span className="flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1.5 text-[11px] font-medium text-[#3730A3] dark:bg-indigo-900/30 dark:text-indigo-400 uppercase">
                                Fleet:{" "}
                                {selectedVendorName || `Vendor #${appliedScope.vendor_id}`}
                                <X
                                  className="h-3.5 w-3.5 cursor-pointer hover:text-red-500"
                                  onClick={removeVendorFilter}
                                />
                              </span>
                            )}
              
                            {/* Clear All */}
                            <button
                              onClick={resetAllFilters}
                              className="ml-1 text-[11px] font-bold text-[#0446DB] hover:underline dark:text-blue-400"
                            >
                              Clear all
                            </button>
                          </div>
                        )}
            </div>
          </div>

          {/* Filtered order status and COD remittance tables; original KPI cards remain below */}
         
          {/* KPI Cards Section */}

          <div className=" mx-auto  dark:bg-neutral-800  relative z-10">
           
          

           
<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5 lg:gap-6 mb-8">

              <div className="col-span-2 min-w-0 lg:col-span-1">
<HoverCard openDelay={250}>

                <HoverCardTrigger render={<div />}>

                <div className="bg-white  dark:bg-neutral-900 dark:border-neutral-900  rounded-2xl rounded-sm hover:rounded-sm transition-all duration-300 p-3 sm:p-6 border  border-gray-300 group hover:border-[#0446DB]/20">

                <div className="flex justify-between items-start mb-4">

                  <div>

                    <h2 className="text-sm sm:text-lg font-semibold dark:text-white text-gray-700 mb-1">Total Orders</h2>

                    <div className="text-2xl font-bold text-gray-900 dark:text-white">

                      <BottomScrollCounter

                        prevValue={200}

                        newValue={totalOrdersKpi?.toLocaleString("en-IN") || 0}

                        className=""

                      />


                      

                      {/* {totalOrdersKpi.toLocaleString("en-IN")} */}

                    </div>

                  </div>

                  <div className="p-2 sm:p-3 bg-indigo-100 rounded-xl group-hover:bg-indigo-200 transition-colors">

                    <TotalOrderIcon />

                  </div>

                </div>

                <div className="mt-4">

                  <div className="flex justify-between text-[11px] sm:text-sm dark:text-white text-gray-600 mb-1">

                    <span>Completion Rate</span>

                    <span className="font-semibold">

                      {100}%

                    </span>

                  </div>

                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">

                    <div

                      className="h-2 bg-[#0446DB] rounded-full"

                      style={{

                        width: `${percentOfOrders(totalOrdersKpi)}%`,

                      }}

                    ></div>

                  </div>

                </div>

              </div>

              </HoverCardTrigger>

                <HoverCardContent side="top" align="start" className="w-64 text-sm">

                  Total number of orders in the selected reporting period.

                </HoverCardContent>

              </HoverCard>
</div>

              {/* Total Orders Card */}

              {/* Open Order */}

            <HoverCard openDelay={250}>

              <HoverCardTrigger render={<div />}>

                <div className="bg-white dark:bg-neutral-900 dark:border-gray-800 rounded-sm transition-all duration-300 p-3 sm:p-6 border border-gray-300 group hover:border-amber-200">

              <div className="flex justify-between items-start mb-4">

                <div>

                  <h2 className="text-sm md:text-lg dark:text-white font-semibold text-gray-700 mb-1">Open Orders</h2>

                  <div className="text-xl sm:text-3xl font-bold dark:text-white text-gray-900">

                    <BottomScrollCounter

                      prevValue={200}

                      newValue={openOrderKpi?.toLocaleString("en-IN") || 0}

                      className=""

                    />

                  </div>

                </div>

                <div className="p-2 sm:p-3 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors">

                  <PenOrdersIcon />

                </div>

              </div>

              <div className="mt-4">

                <div className="flex justify-between dark:text-white text-[11px] sm:text-[11px] sm:text-sm text-gray-600 mb-1">

                  <span className="">Open Orders</span>

                  <span className="font-semibold text-amber-600">

                    {percentOfOrders(openOrderKpi)}%

                  </span>

                </div>

                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">

                  <div

                    className="h-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all duration-500"

                    style={{

                      width: `${Math.min(

                        100,

                        Math.max(0, Number(percentOfOrders(openOrderKpi)) || 0)

                      )}%`,

                    }}

                  />

                </div>

              </div>

            </div>

              </HoverCardTrigger>

                <HoverCardContent

                  side="top"

                  align="start"

                  className="w-80 text-sm"

                >

                  <p className="font-semibold mb-2">Open Orders</p>

                  <p>

                    Includes all orders with active statuses, such as

                    Booked, Pending Pickup, Picked Up, In Transit,

                    Out for Delivery, Undelivered, and Undelivered Assigned.

                  </p>

                  <p className="mt-2 text-gray-500">

                    Excludes: NDR, Lost, Cancelled, Delivered,

                    RTO In Transit, and RTO Delivered.

                  </p>

                </HoverCardContent>

            </HoverCard>

              {/* Orders Delivered Card */}

              <HoverCard openDelay={250}>

                <HoverCardTrigger render={<div />}>

                <div className="bg-white dark:bg-neutral-900 dark:border-gray-800 rounded-2xl rounded-sm hover:rounded-sm transition-all duration-300 p-3 sm:p-6 border border-gray-300 group hover:border-green-200">

                <div className="flex justify-between items-start mb-4">

                  <div>

                    <h2 className=" text-sm md:text-lg dark:text-white font-semibold text-gray-700 mb-1">Orders Delivered</h2>

                    <div className="text-xl sm:text-3xl dark:text-white font-bold text-gray-900">

                      <BottomScrollCounter

                        prevValue={200}

                        newValue={deliveredOrdersKpi.toLocaleString("en-IN")}

                        className=""

                      />

                    </div>

                  </div>

                  <div className="p-2 sm:p-3 bg-green-100  rounded-xl group-hover:bg-green-200 transition-colors">

                    <OrdersDelivered />

                  </div>

                </div>

                <div className="mt-4">

                  <div className="flex justify-between dark:text-white text-[11px] sm:text-[11px] sm:text-sm text-gray-600 mb-1">

                    <span>Success Rate</span>

                    <span className="font-semibold text-green-600">

                      {percentOfOrders(deliveredOrdersKpi)}%

                    </span>

                  </div>

                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">

                    <div

                      className="h-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"

                      style={{

                        width: `${percentOfOrders(deliveredOrdersKpi)}%`,

                      }}

                    ></div>

                  </div>

                </div>

              </div>

              </HoverCardTrigger>

                <HoverCardContent side="top" align="start" className="w-64 text-sm">

                  Orders successfully delivered to customers.

                </HoverCardContent>

              </HoverCard>

              {/* Orders Cancelled Card */}

              <HoverCard openDelay={250}>

                <HoverCardTrigger render={<div />}>

                <div className="bg-white dark:bg-neutral-900 dark:border-gray-800 rounded-2xl rounded-sm hover:rounded-sm transition-all duration-300 p-3 sm:p-6 border border-gray-300 group hover:border-red-200">

                <div className="flex justify-between items-start mb-4">

                  <div>

                    <h2 className="text-sm md:text-lg font-semibold dark:text-white text-gray-700 mb-1">NDR's</h2>

                    <div className="text-xl sm:text-3xl font-bold dark:text-white text-gray-900">

                      <BottomScrollCounter

                        prevValue={200}

                        newValue={ndrOrdersKpi.toLocaleString("en-IN")}

                        className=""

                      />

                    </div>

                  </div>

                  <div className="p-2 sm:p-3 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors">

                    <GiCancel className="text-xl sm:text-2xl text-red-600" />

                  </div>

                </div>

                <div className="mt-4">

                  <div className="flex justify-between dark:text-white text-[11px] sm:text-[11px] sm:text-sm text-gray-600 mb-1">

                    <span>NDR's Rate</span>

                    <span className="font-semibold text-red-600">

                      {percentOfOrders(ndrOrdersKpi)}%

                    </span>

                  </div>

                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">

                    <div

                      className="h-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-full"

                      style={{

                        width: `${percentOfOrders(ndrOrdersKpi)}%`,

                      }}

                    ></div>

                  </div>

                </div>

              </div>

              </HoverCardTrigger>

                <HoverCardContent side="top" align="start" className="w-64 text-sm">

                  Non-Delivery Report orders that need delivery follow-up.

                </HoverCardContent>

              </HoverCard>

              {/* RTO Delivered Card */}

              <HoverCard openDelay={250}>

                <HoverCardTrigger render={<div />}>

                <div className="bg-white dark:bg-neutral-900 dark:border-gray-800 rounded-2xl rounded-sm hover:rounded-sm transition-all duration-300 p-3 sm:p-6 border border-gray-300 group hover:border-amber-200">

                <div className="flex justify-between items-start mb-4">

                  <div>

                    <h2 className="text-sm md:text-lg dark:text-white font-semibold text-gray-700 mb-1">RTO Delivered</h2>

                    <div className="text-xl sm:text-3xl font-bold dark:text-white text-gray-900">

                      <BottomScrollCounter

                        prevValue={200}

                        newValue={rtoOrdersKpi.toLocaleString("en-IN")}

                        className=""

                      />

                    </div>

                  </div>

                  <div className="p-2 sm:p-3 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors">

                    <TbTruckReturn className="text-xl sm:text-2xl text-amber-600" />

                  </div>

                </div>

                <div className="mt-4">

                  <div className="flex justify-between dark:text-white text-[11px] sm:text-[11px] sm:text-sm text-gray-600 mb-1">

                    <span>RTO Recovery</span>

                    <span className="font-semibold text-amber-600">

                      {percentOfOrders(rtoOrdersKpi)}%

                    </span>

                  </div>

                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">

                    <div

                      className="h-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"

                      style={{

                        width: `${percentOfOrders(rtoOrdersKpi)}%`,

                      }}

                    ></div>

                  </div>

                </div>

              </div>

              </HoverCardTrigger>

                <HoverCardContent side="top" align="start" className="w-64 text-sm">

                  Return-to-Origin orders successfully returned to the sender.

                </HoverCardContent>

              </HoverCard>

            </div>


            {/* Charts Section */}

            <div className="space-y-6">
              {/* First Row - Pie Charts */}

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Live Orders Pie Chart */}

                <div className="bg-white dark:bg-neutral-900 dark:border-gray-800 rounded-2xl rounded-sm hover:rounded-sm transition-all duration-300 p-6 border border-gray-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Live Orders Status
                    </h3>


<span className="relative inline-flex h-3 w-3 items-center justify-center">
  <span className="absolute h-full w-full animate-ping rounded-full bg-green-400 opacity-50" />
  <span className="relative h-2 w-2 animate-[pulse_0.8s_steps(2,end)_infinite] rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
</span>
                  </div>

                   <Piechart
                data={[
                  {
                    id: "booked",
                    label: "Booked",
                    value: Number(liveOrders?.["booked"]) || 0,
                    color: "#0446DB",
                  },
                  {
                    id: "rto-in-transit",
                    label: "RTO in transit",
                    value: Number(liveOrders?.["rto in transit"]) || 0,
                    color: "#FFA673",
                  },
                  {
                    id: "out-for-delivery",
                    label: "Out for delivery",
                    value: Number(liveOrders?.["out for delivery"]) || 0,
                    color: "#03A6A1",
                  },
                  {
                    id: "pending-pickup",
                    label: "Pending pickup",
                    value: Number(liveOrders?.["pending pickup"]) || 0,
                    color: "#F25912",
                  },
                ]}
              />
                </div>

                {/* COD vs Prepaid */}

                <div className="bg-white dark:bg-neutral-900 dark:border-gray-800 rounded-2xl rounded-sm hover:rounded-sm transition-all duration-300 p-6 border border-gray-300">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Payment Methods
                  </h3>

                  <Piechart
                    data={[
                      {
                        id: "cod",
                        label: "COD",
                        value:
                          Number(analytics?.overall_orders?.cod_orders) || 0,
                        color: "#0446DB",
                      },

                      {
                        id: "prepaid",
                        label: "Prepaid",
                        value:
                          Number(analytics?.overall_orders?.prepaid_orders) ||
                          0,
                        color: "#FFA673",
                      },
                    ]}
                  />
                </div>

                {/* Delivery Types */}

                <div className="bg-white dark:bg-neutral-900 dark:border-gray-800 rounded-2xl rounded-sm hover:rounded-sm transition-all duration-300 p-6 border border-gray-300">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Delivery Types
                  </h3>

                  <Piechart
                    data={[
                      {
                        id: "ndd",
                        label: "NDD",
                        value:
                          Number(analytics?.overall_orders?.ndd_orders) || 0,
                        color: "#0446DB",
                      },

                      {
                        id: "sdd",
                        label: "SDD",
                        value:
                          Number(analytics?.overall_orders?.sdd_orders) || 0,
                        color: "#FFA673",
                      },

                      {
                        id: "hld",
                        label: "HLD",
                        value:
                          Number(analytics?.overall_orders?.hld_orders) || 0,
                        color: "#03A6A1",
                      },
                    ]}
                  />
                </div>

                <div className="bg-white dark:bg-neutral-900 dark:border-gray-800 rounded-2xl rounded-sm hover:rounded-sm transition-all duration-300 p-6 border border-gray-300">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    COD Remittance Status
                  </h3>

                  <Piechart
                    data={[
                      {
                        id: "pending",
                        label: "Pending",
                        value: Number(codRemittance?.["pending"]) || 0,
                        color: "#616FE5",
                      },

                      {
                        id: "initiated",
                        label: "Initiated",
                        value: Number(codRemittance?.["initiated"]) || 0,
                        color: "#FFA673",
                      },

                      {
                        id: "adjusted",
                        label: "Adjusted",
                        value: Number(codRemittance?.["adjusted"]) || 0,
                        color: "#03A6A1",
                      },

                      {
                        id: "received",
                        label: "Received",
                        value: Number(codRemittance?.["received"]) || 0,
                        color: "#0446DB",
                      },
                    ]}
                  />
                </div>
              </div>

              {/* City Wise Orders - Full Width */}

              <div className="text-center text-gray-500 py-0">
                <div className="bg-white dark:bg-neutral-900 dark:border-gray-800 rounded-2xl rounded-sm hover:rounded-sm transition-all duration-300 p-6 border border-gray-300">
                  {/* DESKTOP VIEW - 768px and above */}
<div className="mb-6 hidden items-center justify-between gap-3 md:flex">
  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
    City Wise Order Distribution
  </h3>

  <div className="text-sm text-gray-500 dark:text-gray-300">
    Total Cities: {cityWiseOrders?.length || 0}
  </div>
</div>

{/* MOBILE VIEW - Below 768px */}
<div className="mb-6 flex  justify-between gap-3 md:hidden">
  <div className=" flex flex-col text-left">

  <h3 className="text-base font-semibold text-gray-800 dark:text-white">
   City Wise Order Distribution
  </h3>
  <p className="text-base  text-gray-400 dark:text-white">
    Total orders by pickup city
  </p>
  </div>

  <div className="shrink-0 text-xs text-gray-500 dark:text-gray-300">
    Total Cities: {cityWiseOrders?.length || 0}
  </div>
</div>

                  <CityOrdersChart cityWiseOrders={cityWiseOrders} />
                </div>

                {/* Merchant Wise Orders - original dashboard layout preserved */}
                
{/* MERCHANT WISE ORDER SUMMARY */}
<div className="mt-6 rounded-sm border border-gray-300 bg-white p-4 dark:border-gray-800 dark:bg-neutral-900 sm:p-6">

  {/* HEADER + SEARCH */}
  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <h3 className="text-base font-semibold text-gray-800 dark:text-white sm:text-lg">
      Merchant Wise Order Summary
    </h3>

    <input
      value={merchantSearch}
      onChange={(e) => {
        setMerchantSearch(e.target.value);
        setMerchantPage(1);
      }}
      placeholder="Search merchant name or ID"
      className="w-full rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#0446DB] dark:border-gray-700 dark:bg-neutral-800 dark:text-white sm:w-72"
    />
  </div>

  {/* DESKTOP VIEW - TABLE */}
  <div className="hidden overflow-x-auto md:block">
    <table className="w-full min-w-[1100px] text-center text-sm">
      <thead className="bg-gray-50 text-gray-600 dark:bg-neutral-800 dark:text-gray-300">
        <tr>
          {[
            "Merchant",
            "Booked",
            "Pending Pickup",
            "Picked",
            "In Transit",
            "Out For Delivery",
            "Delivered",
            "NDR",
            "Undelivered",
            "RTO In Transit",
            "RTO Delivered",
          ].map((heading) => (
            <th
              key={heading}
              className="whitespace-nowrap px-3 py-3 font-semibold"
            >
              {heading}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
        {visibleMerchants.map((row, index) => (
          <tr
            key={`${row.merchant_id}-${index}`}
            className="text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-neutral-800/50"
          >
            <td className="whitespace-nowrap px-3 py-3 font-medium">
              {row.merchant_name || `Merchant #${row.merchant_id}`}
              <span className="block text-xs text-gray-400">
                ID: {row.merchant_id ?? "—"}
              </span>
            </td>

            {[
              "booked_orders",
              "pending_pickup_orders",
              "picked_orders",
              "in_transit_orders",
              "out_for_delivery_orders",
              "delivered_orders",
              "ndr_orders",
              "undelivered_orders",
              "rto_in_transit_orders",
              "rto_delivered_orders",
            ].map((key) => (
              <td key={key} className="px-3 py-3 tabular-nums">
                {formatCount(row[key])}
              </td>
            ))}
          </tr>
        ))}

        {visibleMerchants.length === 0 && (
          <tr>
            <td
              colSpan={11}
              className="px-4 py-10 text-center text-gray-500"
            >
              No merchant records found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* MOBILE VIEW - EXPANDABLE CARDS */}
  <div className="space-y-2 md:hidden">
    {visibleMerchants.map((row, index) => {
      const merchantKey = String(row.merchant_id ?? index);
      const isExpanded = expandedMerchant === merchantKey;

      return (
        <div
          key={`${merchantKey}-${index}`}
          className="overflow-hidden rounded-lg border border-gray-200 dark:border-neutral-800"
        >
          <button
            type="button"
            onClick={() =>
              setExpandedMerchant(
                isExpanded ? null : merchantKey
              )
            }
            aria-expanded={isExpanded}
            className="flex w-full items-center justify-between gap-2 bg-gray-50/50 p-3 text-left dark:bg-neutral-800/50"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {row.merchant_name || `Merchant #${row.merchant_id}`}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                ID: {row.merchant_id ?? "—"}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <div className="text-center">
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatCount(row.delivered_orders)}
                </p>
                <p className="text-[9px] text-gray-500">Delivered</p>
              </div>

              <div className="text-center">
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatCount(row.booked_orders)}
                </p>
                <p className="text-[9px] text-gray-500">Booked</p>
              </div>

              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {isExpanded && (
            <div className="grid grid-cols-2 gap-2 bg-white p-3 dark:bg-neutral-900">
              {[
                { label: "Booked", key: "booked_orders" },
                { label: "Pending Pickup", key: "pending_pickup_orders" },
                { label: "Picked", key: "picked_orders" },
                { label: "In Transit", key: "in_transit_orders" },
                { label: "Out for Delivery", key: "out_for_delivery_orders" },
                { label: "Delivered", key: "delivered_orders" },
                { label: "NDR", key: "ndr_orders" },
                { label: "Undelivered", key: "undelivered_orders" },
                { label: "RTO In Transit", key: "rto_in_transit_orders" },
                { label: "RTO Delivered", key: "rto_delivered_orders" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-800/60"
                >
                  <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">
                    {item.label}
                  </span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    {formatCount(row[item.key])}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    })}

    {visibleMerchants.length === 0 && (
      <div className="py-6 text-center text-xs text-gray-500">
        No merchant records found
      </div>
    )}
  </div>

  {/* PAGINATION - BOTH DESKTOP AND MOBILE */}
  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 text-sm text-gray-600 dark:border-neutral-800 dark:text-gray-300">
    <span className="text-xs">
      Showing {visibleMerchants.length} of {merchantRows.length}
    </span>

    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={merchantPage === 1}
        onClick={() => setMerchantPage((page) => Math.max(1, page - 1))}
        className="rounded-sm border border-gray-200 px-3 py-1.5 text-xs disabled:opacity-40 dark:border-neutral-700"
      >
        Previous
      </button>

      <span className="whitespace-nowrap text-xs">
        {merchantPage} / {Math.max(1, Math.ceil(merchantRows.length / 10))}
      </span>

      <button
        type="button"
        disabled={merchantPage >= Math.ceil(merchantRows.length / 10)}
        onClick={() => setMerchantPage((page) => page + 1)}
        className="rounded-sm border border-gray-200 px-3 py-1.5 text-xs disabled:opacity-40 dark:border-neutral-700"
      >
        Next
      </button>
    </div>
  </div>
</div>




                

                <OrderAndCODStatus
                filteredStats={filteredStats}
  appliedScope={appliedScope}
  selectedVendorName={selectedVendorName}
  formatCount={formatCount}
                />
                


              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
