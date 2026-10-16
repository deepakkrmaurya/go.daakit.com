
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
} from "lucide-react";

import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

import { rainbowSurgePalette } from "@mui/x-charts/colorPalettes";

import { useTheme } from "@mui/material/styles";

import { toast } from "react-toastify";

import Piechart from "../Piechart";

import { TbReportAnalytics } from "react-icons/tb";

import { FaPlaneArrival } from "react-icons/fa";

import { GiCancel } from "react-icons/gi";

import { TbTruckReturn } from "react-icons/tb";

import CityOrdersChart from "../CityOrdersChart";

import BottomScrollCounter from "../ui/OdometerCounter";

import { Loader2 } from "lucide-react";

import AxiosInstance from "../../Helper/axiosInstance";
import CustomButton from "../common/CustomButton";

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
            <div className="relative z-10  mx-auto py-2">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Heading */}
                <div className="text-center lg:text-left">
                  <h1 className="text-2xl lg:text-3xl font-bold dark:text-white mb-2">
                    Dashboard
                  </h1>
                  <div className="flex items-center justify-center"></div>
                  <p className="dark:text-indigo-100 text-lg">
                    Real-time insights and performance metrics
                  </p>
                </div>
                <Drawer
                  direction="right"
                  open={filterDrawerOpen}
                  onOpenChange={openFilters}
                >
                  <DrawerTrigger>
                    <CustomButton
                      variant="primary"
                      size="md"
                      icon={SlidersHorizontal}
                      className="rounded-sm"
                    >
                      Filters
                    </CustomButton>
                  </DrawerTrigger>
                  <DrawerContent className="!fixed !inset-y-0 !right-0 !left-auto !top-0 !bottom-0 !mt-0 !h-dvh !max-h-dvh !w-full sm:!w-[440px] !max-w-[100vw] !rounded-none !border-l !border-t-0 bg-white dark:border-neutral-700 dark:bg-neutral-900 flex flex-col">
                    <DrawerHeader className="border-b border-gray-100 px-5 pb-4 pt-5 text-left dark:border-neutral-800">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <DrawerTitle className="text-lg font-bold text-gray-900 dark:text-white">
                            Advanced Filters
                          </DrawerTitle>
                          <DrawerDescription className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Filter by date, pickup city, DC and vendor.
                          </DrawerDescription>
                        </div>
                        <DrawerClose
                          render={
                            <button
                              type="button"
                              aria-label="Close filters"
                              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800"
                            />
                          }
                        >
                          <X size={18} />
                        </DrawerClose>
                      </div>
                    </DrawerHeader>
                    <form
                      id="analytics-advanced-filters"
                      onSubmit={applyScope}
                      className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5"
                    >
                      <div className="space-y-3 border-gray-100  dark:border-neutral-800">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                          Date Range
                        </h4>
                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Select Period
                          </span>
                          <select
                            value={draftDatePreset}
                            onChange={(e) => setDraftDatePreset(e.target.value)}
                            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                          >
                            {[
                              "Today",
                              "Yesterday",
                              "Last 7 Days",
                              "Last 30 Days",
                              "This Month",
                              "Last Month",
                              "Custom Range",
                            ].map((period) => (
                              <option key={period} value={period}>
                                {period}
                              </option>
                            ))}
                          </select>
                        </label>
                        {draftDatePreset === "Custom Range" && (
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <label className="block">
                              <span className="mb-2 block text-xs font-semibold text-gray-700 dark:text-gray-200">
                                Start Date
                              </span>
                              <input
                                required
                                type="date"
                                value={draftStartDate}
                                max={draftEndDate || undefined}
                                onChange={(e) =>
                                  setDraftStartDate(e.target.value)
                                }
                                onClick={(e) => {
                                    try {
                                      e.currentTarget.showPicker?.();
                                    } catch (error) {
                                      console.error("Calendar picker error:", error);
                                    }
                                  }}
                                className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                              />
                            </label>
                            <label className="block">
                              <span className="mb-2 block text-xs font-semibold text-gray-700 dark:text-gray-200">
                                End Date
                              </span>
                              <input
                                required
                                type="date"
                                value={draftEndDate}
                                min={draftStartDate || undefined}
                                onChange={(e) =>
                                  setDraftEndDate(e.target.value)
                                }
                                onClick={(e) => {
                                    try {
                                      e.currentTarget.showPicker?.();
                                    } catch (error) {
                                      console.error("Calendar picker error:", error);
                                    }
                                  }}
                                className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                              />
                            </label>
                          </div>
                        )}
                      </div>
                     
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                          Pickup City
                        </span>
                        <select
                          value={filterCity}
                          onChange={(e) => setFilterCity(e.target.value)}
                          className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:ring-blue-950"
                        >
                          <option value="">All Cities</option>
                          {["delhi", "lucknow", "gurugram", "bangalore"].map(
                            (city) => (
                              <option key={city} value={city}>
                                {city.charAt(0).toUpperCase() + city.slice(1)}
                              </option>
                            ),
                          )}
                        </select>
                      </label>
                      <div className=" gap-4">
                        {/* <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                            DC ID
                          </span>
                          <input
                            inputMode="numeric"
                            value={filterDcId}
                            onChange={(e) => setFilterDcId(e.target.value)}
                            placeholder="e.g. 12"
                            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:ring-blue-950"
                          />
                        </label> */}
                         <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                           Fleet Partner
                          </span>

                          <select name="" id=""
                          value={filterVendorId}
                          onChange={(e) => setFilterVendorId(e.target.value)}
                           className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:ring-blue-950"
                          >
                            <option value="">Select a Vendor</option>
                          {
                            vendorList.map((v)=>{
                              
                              return (
                                <>
                                  <option value={v.id}>{v?.id}:{v?.vendor_name}</option>
                                </>
                              )
                            })
                          }

                          </select>
                       
                        </label>
                      </div>
                      
                    </form>
                    <DrawerFooter className="flex w-full flex-row items-center justify-end gap-2 border-t border-gray-100 px-5 py-4 dark:border-neutral-800">
                      <CustomButton
                        type="button"
                        variant="outline"
                        size="md"
                        icon={RotateCcw}
                        onClick={resetAllFilters}
                        className="w-1/2 border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-200 dark:hover:bg-neutral-800"
                      >
                        Reset
                      </CustomButton>

                      <CustomButton
                        type="submit"
                        form="analytics-advanced-filters"
                        variant="primary"
                        size="md"
                        icon={Check}
                        className="w-1/2"
                      >
                        Apply Filters
                      </CustomButton>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          </div>

          {/* Filtered order status and COD remittance tables; original KPI cards remain below */}
         
          {/* KPI Cards Section */}

          <div className=" mx-auto  dark:bg-neutral-800  relative z-10">
           
          

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">

              {/* Total Orders Card */}



              <HoverCard openDelay={250}>



                <HoverCardTrigger render={<div />}>
                <div className="bg-white  dark:bg-neutral-900 dark:border-neutral-900  rounded-2xl rounded-sm hover:rounded-sm transition-all duration-300 p-6 border  border-gray-300 group hover:border-[#0446DB]/20">

                <div className="flex justify-between items-start mb-4">

                  <div>

                    <h2 className="text-lg font-semibold dark:text-white text-gray-700 mb-1">Total Orders</h2>



                    <div className="text-2xl font-bold text-gray-900 dark:text-white">

                      <BottomScrollCounter

                        prevValue={200}

                        newValue={totalOrdersKpi || 0}

                        className=""

                      />



                      {/* {totalOrdersKpi.toLocaleString("en-IN")} */}

                    </div>

                  </div>



                  <div className="p-3 bg-indigo-100 rounded-xl group-hover:bg-indigo-200 transition-colors">

                    <TbReportAnalytics className="text-2xl text-indigo-600" />

                  </div>

                </div>



                <div className="mt-4">

                  <div className="flex justify-between text-sm dark:text-white text-gray-600 mb-1">

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



              {/* Open Order */}



            <HoverCard openDelay={250}>



              <HoverCardTrigger render={<div />}>
                <div className="bg-white dark:bg-neutral-900 dark:border-gray-800 rounded-sm transition-all duration-300 p-6 border border-gray-300 group hover:border-amber-200">

              <div className="flex justify-between items-start mb-4">

                <div>

                  <h2 className="text-lg dark:text-white font-semibold text-gray-700 mb-1">Open Orders</h2>



                  <div className="text-3xl font-bold dark:text-white text-gray-900">

                    <BottomScrollCounter

                      prevValue={200}

                      newValue={Number(openOrderKpi) || 0}

                      className=""

                    />

                  </div>

                </div>



                <div className="p-3 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors">

                  <TbTruckReturn className="text-2xl text-amber-600" />

                </div>

              </div>



              <div className="mt-4">

                <div className="flex justify-between dark:text-white text-sm text-gray-600 mb-1">

                  <span>Open Orders</span>



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
                <div className="bg-white dark:bg-neutral-900 dark:border-gray-800 rounded-2xl rounded-sm hover:rounded-sm transition-all duration-300 p-6 border border-gray-300 group hover:border-green-200">

                <div className="flex justify-between items-start mb-4">

                  <div>

                    <h2 className="text-lg dark:text-white font-semibold text-gray-700 mb-1">Orders Delivered</h2>



                    <div className="text-3xl dark:text-white font-bold text-gray-900">

                      <BottomScrollCounter

                        prevValue={200}

                        newValue={deliveredOrdersKpi.toLocaleString("en-IN")}

                        className=""

                      />

                    </div>

                  </div>



                  <div className="p-3 bg-green-100  rounded-xl group-hover:bg-green-200 transition-colors">

                    <FaPlaneArrival className="text-2xl text-green-600" />

                  </div>

                </div>



                <div className="mt-4">

                  <div className="flex justify-between dark:text-white text-sm text-gray-600 mb-1">

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
                <div className="bg-white dark:bg-neutral-900 dark:border-gray-800 rounded-2xl rounded-sm hover:rounded-sm transition-all duration-300 p-6 border border-gray-300 group hover:border-red-200">

                <div className="flex justify-between items-start mb-4">

                  <div>

                    <h2 className="text-lg font-semibold dark:text-white text-gray-700 mb-1">NDR's</h2>



                    <div className="text-3xl font-bold dark:text-white text-gray-900">

                      <BottomScrollCounter

                        prevValue={200}

                        newValue={ndrOrdersKpi.toLocaleString("en-IN")}

                        className=""

                      />

                    </div>

                  </div>



                  <div className="p-3 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors">

                    <GiCancel className="text-2xl text-red-600" />

                  </div>

                </div>



                <div className="mt-4">

                  <div className="flex justify-between dark:text-white text-sm text-gray-600 mb-1">

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
                <div className="bg-white dark:bg-neutral-900 dark:border-gray-800 rounded-2xl rounded-sm hover:rounded-sm transition-all duration-300 p-6 border border-gray-300 group hover:border-amber-200">

                <div className="flex justify-between items-start mb-4">

                  <div>

                    <h2 className="text-lg dark:text-white font-semibold text-gray-700 mb-1">RTO Delivered</h2>



                    <div className="text-3xl font-bold dark:text-white text-gray-900">

                      <BottomScrollCounter

                        prevValue={200}

                        newValue={rtoOrdersKpi.toLocaleString("en-IN")}

                        className=""

                      />

                    </div>

                  </div>



                  <div className="p-3 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors">

                    <TbTruckReturn className="text-2xl text-amber-600" />

                  </div>

                </div>



                <div className="mt-4">

                  <div className="flex justify-between dark:text-white text-sm text-gray-600 mb-1">

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

                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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
                        id: "pending-pickup",
                        label: "Pending Pickup",
                        value: Number(liveOrders?.["pending pickup"]) || 0,
                        color: "#FFA673",
                      },

                      {
                        id: "out-for-delivery",
                        label: "Out For Delivery",
                        value: Number(liveOrders?.["out for delivery"]) || 0,
                        color: "#03A6A1",
                      },

                      {
                        id: "undelivered-assigned",
                        label: "Undelivered Assigned",
                        value:
                          Number(liveOrders?.["undelivered assigned"]) || 0,
                        color: "#F25912",
                      },

                      {
                        id: "rto-in-transit",
                        label: "RTO In Transit",
                        value: Number(liveOrders?.["rto in transit"]) || 0,
                        color: "#FDFFB8",
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
                        id: "turant",
                        label: "Turant",
                        value:
                          Number(analytics?.overall_orders?.turant_orders) || 0,
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
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      City Wise Order Distribution
                    </h3>

                    <div className="text-sm text-gray-500 dark:text-white">
                      Total Cities: {cityWiseOrders?.length || 0}
                    </div>
                  </div>

                  <CityOrdersChart cityWiseOrders={cityWiseOrders} />
                </div>

                {/* Merchant Wise Orders - original dashboard layout preserved */}
                <div className="bg-white dark:bg-neutral-900 dark:border-gray-800 rounded-sm p-6 border border-gray-300 mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Merchant Wise Order Summary
                      </h3>
                     
                    </div>
                    <input
                      value={merchantSearch}
                      onChange={(e) => {
                        setMerchantSearch(e.target.value);
                        setMerchantPage(1);
                      }}
                      placeholder="Search merchant name or ID"
                      className="w-full sm:w-72 rounded-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-gray-800 dark:text-white outline-none focus:border-[#0446DB]"
                    />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1100px] text-sm text-center">
                      <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-gray-300">
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
                            "RTO In Iransit",
                            "RTO Delivered",
                            // "Cancelled",
                            // "Lost",
                            // "Action"
                          ].map((h) => (
                            <th
                              key={h}
                              className="px-3 py-3 whitespace-nowrap font-semibold"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {visibleMerchants.map((row, i) => {
                          const rate = Number(row.total_orders_placed)
                            ? (Number(row.delivered_orders || 0) /
                                Number(row.total_orders_placed)) *
                              100
                            : 0;
                          return (
                            <tr
                              key={`${row.merchant_id}-${i}`}
                              className="text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                            >
                              <td className="px-3 py-3 font-medium whitespace-nowrap">
                                {row.merchant_name ||
                                  `Merchant #${row.merchant_id}`}
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
                                // "cancelled_orders",
                                // "lost_orders",
                              ].map((k) => (
                                <td key={k} className="px-3 py-3 tabular-nums">
                                  {formatCount(row[k])}
                                </td>
                              ))}
                              
                          {/* <td className="px-3 py-3 tabular-nums">
                            <button
                              type="button"
                              // onClick={() => handleDownload(item)}
                              className="inline-flex items-center gap-2 rounded-md
                                bg-blue-50 px-3 py-1.5 text-xs font-semibold
                                text-[#0446DB] transition-colors
                                hover:bg-blue-100
                                dark:bg-blue-500/10 dark:text-blue-400
                                dark:hover:bg-blue-500/20"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </button>
                          </td> */}

                            </tr>
                          );
                        })}
                        {!visibleMerchants.length && (
                          <tr>
                            <td
                              colSpan={13}
                              className="px-4 py-10 text-center text-gray-500"
                            >
                              No merchant records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-300">
                    <span>
                      Showing {visibleMerchants.length} of {merchantRows.length}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={merchantPage === 1}
                        onClick={() =>
                          setMerchantPage((p) => Math.max(1, p - 1))
                        }
                        className="border rounded-sm px-3 py-1 disabled:opacity-40"
                      >
                        Previous
                      </button>
                      <span>
                        {merchantPage} /{" "}
                        {Math.max(1, Math.ceil(merchantRows.length / 10))}
                      </span>
                      <button
                        type="button"
                        disabled={
                          merchantPage >= Math.ceil(merchantRows.length / 10)
                        }
                        onClick={() => setMerchantPage((p) => p + 1)}
                        className="border rounded-sm px-3 py-1 disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>



                

                {filteredStats && (() => {
                  const orders = filteredStats?.order_status_counts || {};
                  const remittance = Array.isArray(filteredStats?.cod_remittance_counts)
                    ? filteredStats.cod_remittance_counts
                    : [];
                  const totalOrders = Math.max(0, Number(orders.total_orders) || 0);
                  const totalCOD = remittance.reduce(
                    (sum, item) => sum + Math.max(0, Number(item?.count) || 0), 0
                  );
                  const orderStatusConfig = {
                    pending_pickup: { label: 'Pending Pickup', dot: 'bg-yellow-400', bar: 'bg-yellow-400' },
                    picked: { label: 'Picked', dot: 'bg-blue-500', bar: 'bg-blue-500' },
                    in_transit: { label: 'In Transit', dot: 'bg-violet-500', bar: 'bg-violet-500' },
                    out_for_delivery: { label: 'Out For Delivery', dot: 'bg-orange-500', bar: 'bg-orange-500' },
                    delivered: { label: 'Delivered', dot: 'bg-green-500', bar: 'bg-green-500' },
                    ndr: { label: 'NDR', dot: 'bg-rose-500', bar: 'bg-rose-500' },
                    undelivered: { label: 'Undelivered', dot: 'bg-red-500', bar: 'bg-red-500' },
                    undelivered_assigned: { label: 'Undelivered Assigned', dot: 'bg-slate-400', bar: 'bg-slate-400' },
                    rto_in_transit: { label: 'RTO In Transit', dot: 'bg-blue-600', bar: 'bg-blue-600' },
                    rto_delivered: { label: 'RTO Delivered', dot: 'bg-teal-500', bar: 'bg-teal-500' },
                    lost: { label: 'Lost', dot: 'bg-slate-500', bar: 'bg-slate-500' },
                  };
                  const codStatusConfig = {
                    received: { dot: 'bg-green-500', bar: 'bg-green-500' },
                    initiated: { dot: 'bg-blue-500', bar: 'bg-blue-500' },
                    adjusted: { dot: 'bg-purple-600', bar: 'bg-purple-600' },
                    pending: { dot: 'bg-orange-500', bar: 'bg-orange-500' },
                  };
                  const orderRows = Object.entries(orders).filter(([status]) => status !== 'total_orders');
                  const percentage = (count, total) => total > 0
                    ? Math.min(100, Math.max(0, ((Number(count) || 0) / total) * 100)) : 0;

                  return (
                    <div className="my-6 grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
                      {/* ORDER STATUS COUNTS */}
                      <div className="min-w-0 overflow-hidden rounded-sm border border-gray-300 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-5">
                          <div className="flex min-w-0 flex-1 items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m3 17 6-6 4 3 8-9" /><path d="M15 5h6v6" /><path d="M4 21v-4M9 21v-6M14 21v-4M19 21v-8" />
                              </svg>
                            </div>
                            <div className="min-w-0 flex-1 text-left">
                              <h4 className="text-base font-bold text-slate-900 dark:text-white">Order Status Counts</h4>
                              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Detailed overview of orders by current status</p>
                              {appliedScope?.vendor_id && (
                                <p className="mt-2 inline-block max-w-full break-words rounded-sm border border-dashed border-orange-300 bg-orange-50 px-3 py-1.5 text-left text-xs font-semibold text-orange-500 dark:border-orange-500/30 dark:bg-orange-500/10">
                                  Fleet Partner: {selectedVendorName || `Vendor #${appliedScope.vendor_id}`}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/70 px-3 py-2 dark:border-blue-500/20 dark:bg-blue-500/10">
                            <span className="text-xs text-slate-500 dark:text-slate-300">Total Orders</span>
                            <span className="text-xl font-bold tabular-nums text-[#0446DB] dark:text-blue-400">{formatCount(totalOrders)}</span>
                          </div>
                        </div>
                        <div className="px-4 pb-4 sm:px-5">
                          <div className="h-[40vh] max-w-full overflow-auto overscroll-contain rounded-lg border border-slate-200 dark:border-neutral-700">
                            <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                              <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-neutral-800">
                                <tr className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                  <th className="w-[35%] px-4 py-3">Order Status</th>
                                  <th className="w-[15%] px-4 py-3 text-right">Orders</th>
                                  <th className="w-[15%] px-4 py-3 text-right">% of Total</th>
                                  <th className="w-[35%] px-4 py-3">Visual</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                                {orderRows.map(([status, count]) => {
                                  const config = orderStatusConfig[status] || { label: status.replaceAll('_', ' '), dot: 'bg-slate-400', bar: 'bg-slate-400' };
                                  const percent = percentage(count, totalOrders);
                                  return (
                                    <tr key={status} className="transition-colors hover:bg-blue-50/40 dark:hover:bg-neutral-800/60">
                                      <td className="px-4 py-3"><div className="flex items-center gap-3"><span className={`h-3.5 w-3.5 shrink-0 rounded-full ${config.dot}`} /><span className="font-medium text-slate-800 dark:text-slate-200">{config.label}</span></div></td>
                                      <td className="px-4 py-3 text-right font-semibold tabular-nums text-slate-900 dark:text-white">{formatCount(count)}</td>
                                      <td className="px-4 py-3 text-right tabular-nums text-slate-600 dark:text-slate-300">{percent.toFixed(1)}%</td>
                                      <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-neutral-700"><div className={`h-full rounded-full transition-all duration-500 ${config.bar}`} style={{ width: `${percent}%` }} /></div><span className="w-12 text-right text-xs tabular-nums text-slate-600 dark:text-slate-300">{percent.toFixed(1)}%</span></div></td>
                                    </tr>
                                  );
                                })}
                                {orderRows.length === 0 && <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">No order statistics available</td></tr>}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* COD REMITTANCE STATUS */}
                      <div className="min-w-0 overflow-hidden rounded-sm border border-gray-300 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-5">
                          <div className="flex min-w-0 flex-1 items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v5c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 10v5c0 1.7 3.6 3 8 3s8-1.3 8-3v-5" /><path d="M4 15v4c0 1.7 3.6 3 8 3s8-1.3 8-3v-4" />
                              </svg>
                            </div>
                            <div className="min-w-0 flex-1 text-left">
                              <h4 className="text-base font-bold text-slate-900 dark:text-white">COD Remittance Status</h4>
                              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Overview of COD remittance records by status</p>
                              {appliedScope?.vendor_id && (
                                <p className="mt-2 inline-block max-w-full break-words rounded-sm border border-dashed border-orange-300 bg-orange-50 px-3 py-1.5 text-left text-xs font-semibold text-orange-500 dark:border-orange-500/30 dark:bg-orange-500/10">
                                  Fleet Partner: {selectedVendorName || `Vendor #${appliedScope.vendor_id}`}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/70 px-3 py-2 dark:border-blue-500/20 dark:bg-blue-500/10">
                            <span className="text-xs text-slate-500 dark:text-slate-300">Total Records</span>
                            <span className="text-xl font-bold tabular-nums text-[#0446DB] dark:text-blue-400">{formatCount(totalCOD)}</span>
                          </div>
                        </div>
                        <div className="px-4 pb-4 sm:px-5">
                          <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-neutral-700">
                            <table className="w-full h-[40vh] max-w-full overflow-auto overscroll-contain rounded-lg border border-slate-200 dark:border-neutral-700">
                              <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-neutral-800">
                                <tr className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                  <th className=" px-4 text-left py-3">Status</th>
                                  <th className=" px-4 text-left py-3 ">Count</th>
                                  <th className=" px-4 text-left py-3 ">% of Total</th>
                                  <th className=" px-4 text-left py-3">Visual</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                                {remittance.map((item, index) => {
                                  const status = String(item?.status || 'unknown').toLowerCase();
                                  const config = codStatusConfig[status] || { dot: 'bg-slate-400', bar: 'bg-slate-400' };
                                  const percent = percentage(item?.count, totalCOD);
                                  return (
                                    <tr key={`${status}-${index}`} className="transition-colors hover:bg-blue-50/40 dark:hover:bg-neutral-800/60">
                                      <td className="px-4 text-left py-3"><div className="flex it gap-3"><span className={`h-3.5 w-3.5 shrink-0 rounded-full ${config.dot}`} /><span className="font-medium capitalize text-slate-800 dark:text-slate-200">{status.replaceAll('_', ' ')}</span></div></td>
                                      <td className="px-4 text-left py-3  font-semibold tabular-nums text-slate-900 dark:text-white">{formatCount(item?.count)}</td>
                                      <td className="px-4 text-left py-3  tabular-nums text-slate-600 dark:text-slate-300">{percent.toFixed(1)}%</td>
                                      <td className="px-4 text-left py-3"><div className="flex it gap-3"><div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-neutral-700"><div className={`h-full rounded-full transition-all duration-500 ${config.bar}`} style={{ width: `${percent}%` }} /></div><span className="w-12 text-right text-xs tabular-nums text-slate-600 dark:text-slate-300">{percent.toFixed(1)}%</span></div></td>
                                    </tr>
                                  );
                                })}
                                {remittance.length === 0 && <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">No COD remittance records found</td></tr>}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}


              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
