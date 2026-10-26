// MobileAnalytics.jsx
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
  X,
  Check,
  Loader2,
  ChevronDown,
} from "lucide-react";

import { toast } from "react-toastify";
import { GiCancel } from "react-icons/gi";
import { TbTruckReturn } from "react-icons/tb";
import AxiosInstance from "@/Helper/axiosInstance";


import { ResponsivePie } from "@nivo/pie";
import CustomButton from "../../common/CustomButton";


const MobileDonutChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[150px] items-center justify-center text-xs text-gray-500">
        No data available
      </div>
    );
  }

  const activeData = data.filter((item) => Number(item.value) > 0);

  if (activeData.length === 0) {
    return (
      <div className="flex h-[150px] items-center justify-center text-xs text-gray-500">
        No active data
      </div>
    );
  }

  const total = activeData.reduce((sum, item) => sum + Number(item.value), 0);

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Left Side: Donut Chart */}
      <div className="relative h-[130px] w-[130px] shrink-0">
        <ResponsivePie
          data={activeData}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          innerRadius={0.65}
          padAngle={0}
          cornerRadius={2}
          // activeOuterRadiusOffset={2}
          colors={{ datum: "data.color" }}
          borderWidth={0}
          enableArcLinkLabels={false}
          enableArcLabels={false}
          isInteractive={true}
          tooltip={({ datum }) => (
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: datum.color }}
              />
              <span>{datum.label}:</span>
              <span className="font-bold">
                {datum.value.toLocaleString("en-IN")}
              </span>
            </div>
          )}
        />
      </div>

      {/* Right Side: Legend List */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-3">
        {data.map((item, idx) => {
          return (
            <div key={idx} className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate text-xs font-semibold text-gray-600 dark:text-gray-300">
                  {item.label}
                </span>
              </div>
              <span className="shrink-0 text-xs font-bold text-gray-900 dark:text-white">
                {Number(item.value).toLocaleString("en-IN")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TotalOrderIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.69 0.0822984C9.78442 0.0283669 9.89127 0 10 0C10.1087 0 10.2156 0.0283669 10.31 0.0822984L14.9975 2.76105C15.0932 2.81569 15.1727 2.89465 15.228 2.98992C15.2833 3.08518 15.3125 3.19338 15.3125 3.30355V8.2973L19.685 10.7973C19.7803 10.8517 19.8596 10.9303 19.9149 11.0251C19.9702 11.1199 19.9995 11.2276 20 11.3373V16.6948C20 16.805 19.9708 16.9132 19.9155 17.0084C19.8602 17.1037 19.7807 17.1827 19.685 17.2373L14.9975 19.916C14.9031 19.97 14.7962 19.9983 14.6875 19.9983C14.5788 19.9983 14.4719 19.97 14.3775 19.916L10 17.416L5.6225 19.9173C5.52808 19.9712 5.42123 19.9996 5.3125 19.9996C5.20377 19.9996 5.09692 19.9712 5.0025 19.9173L0.315 17.2385C0.219341 17.1839 0.139825 17.105 0.0845069 17.0097C0.0291891 16.9144 3.55338e-05 16.8062 0 16.696L0 11.3385C3.55338e-05 11.2284 0.0291891 11.1202 0.0845069 11.0249C0.139825 10.9296 0.219341 10.8507 0.315 10.796L4.6875 8.2973V3.30355C4.68754 3.19338 4.71669 3.08518 4.77201 2.98992C4.82732 2.89465 4.90684 2.81569 5.0025 2.76105L9.69 0.0822984ZM5.3125 9.3798L1.885 11.3385L5.3125 13.2973L8.74 11.3385L5.3125 9.3798ZM9.375 12.416L5.9375 14.3798V18.2973L9.375 16.3335V12.416ZM10.625 16.3335L14.0625 18.2973V14.3798L10.625 12.416V16.3335ZM11.26 11.3385L14.6875 13.2973L18.115 11.3385L14.6875 9.3798L11.26 11.3385ZM14.0625 8.2973V4.3798L10.625 6.3448V10.2623L14.0625 8.2973ZM9.375 10.2623V6.3448L5.9375 4.3798V8.2973L9.375 10.2623ZM6.5725 3.30355L10 5.2623L13.4275 3.30355L10 1.3448L6.5725 3.30355ZM18.75 12.416L15.3125 14.3798V18.2973L18.75 16.3335V12.416ZM4.6875 18.2973V14.3798L1.25 12.416V16.3335L4.6875 18.2973Z"
        fill="#4338CA"
      />
    </svg>
  );
};

const PenOrdersIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.666504 2H10.6665V2V10.6667V10.6667H0.666504V10.6667V2V2V2"
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke="#D97706"
      />
      <path
        d="M10.6665 5.33398H13.3332L15.3332 7.33398V10.6673H10.6665V5.33398V5.33398"
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke="#D97706"
      />
      <path
        d="M2 12.3327C2 13.2525 2.74681 13.9993 3.66667 13.9993C4.58653 13.9993 5.33333 13.2525 5.33333 12.3327C5.33333 11.4128 4.58653 10.666 3.66667 10.666C2.74681 10.666 2 11.4128 2 12.3327V12.3327"
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke="#D97706"
      />
      <path
        d="M10.6665 12.3327C10.6665 13.2525 11.4133 13.9993 12.3332 13.9993C13.253 13.9993 13.9998 13.2525 13.9998 12.3327C13.9998 11.4128 13.253 10.666 12.3332 10.666C11.4133 10.666 10.6665 11.4128 10.6665 12.3327Z"
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke="#D97706"
      />
    </svg>
  );
};

const OrdersDelivered = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 1.66699C9.83333 1.66699 9.66667 1.75033 9.5 1.83366L2.91667 5.50033C2.66667 5.66699 2.5 5.91699 2.5 6.25033V13.7503C2.5 14.0837 2.66667 14.3337 2.91667 14.5003L9.5 18.167C9.66667 18.2503 9.83333 18.3337 10 18.3337C10.1667 18.3337 10.3333 18.2503 10.5 18.167L11.25 17.7503C11 17.2503 10.9167 16.667 10.8333 16.0837V10.5003L15.8333 7.66699V10.8337C16.4167 10.8337 17 10.917 17.5 11.0837V6.25033C17.5 5.91699 17.3333 5.66699 17.0833 5.50033L10.5 1.83366C10.3333 1.75033 10.1667 1.66699 10 1.66699ZM10 3.50033L15 6.25033L13.3333 7.16699L8.41667 4.33366L10 3.50033ZM6.75 5.25033L11.6667 8.16699L10 9.08366L5 6.25033L6.75 5.25033ZM4.16667 7.66699L9.16667 10.5003V16.0837L4.16667 13.2503V7.66699ZM17.75 13.167L14.75 16.167L13.4167 14.8337L12.5 15.8337L14.8333 18.3337L18.8333 14.3337L17.75 13.167Z"
        fill="#16A34A"
      />
    </svg>
  );
};

export default function MobileAnalytics() {
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

  const [expandedMerchant, setExpandedMerchant] = useState("DAAKit One");

  const hasActiveScope = Object.keys(appliedScope).length > 0;
  const totalOrdersKpi = Number(analytics?.overall_orders?.total_orders) || 0;
  const deliveredOrdersKpi = Number(liveOrders?.["delivered"]) || 0;
  const ndrOrdersKpi = Number(liveOrders?.["ndr"]) || 0;
  const rtoOrdersKpi = Number(liveOrders?.["rto delivered"]) || 0;

  const excludedStatuses = [
    "ndr",
    "lost",
    "cancelled",
    "rto delivered",
    "rto in transit",
    "delivered",
  ];

  const selectedVendor = vendorList.find(
    (vendor) => String(vendor.id) === String(appliedScope.vendor_id),
  );
  const selectedVendorName = selectedVendor?.vendor_name || "";

  const openOrderKpi =
    analytics?.order_status_counts?.reduce((total, item) => {
      const status = String(item.status || "")
        .trim()
        .toLowerCase();
      if (excludedStatuses.includes(status)) return total;
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
    }, 120000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [advanceFilters, appliedScope, refreshKey]);

  const localDate = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const dateRangeForPreset = (preset) => {
    const t = new Date();
    const start = new Date(t);
    const end = new Date(t);
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

  // ✅ Sirf Date remove karne ke liye
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

  const getAllVendors = async () => {
    try {
      const res = await AxiosInstance.get("/api/admin/getAllVendors", {
        params: { limit: 1000 },
      });
      setVendorList(res.data.data || []);
    } catch (err) {
      setVendorList([]);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while fetching vendors.",
      );
    }
  };

  useEffect(() => {
    getAllVendors();
  }, []);

  // Merchant Data & Pagination Logic
  const merchantRows = (analytics.merchant_wise_orders || []).filter((row) =>
    `${row.merchant_name || ""} ${row.merchant_id || ""}`
      .toLowerCase()
      .includes(merchantSearch.toLowerCase()),
  );

  const itemsPerPage = 5;
  const totalPages = Math.ceil(merchantRows.length / itemsPerPage) || 1;
  const startIndex = (merchantPage - 1) * itemsPerPage;
  const displayMerchants = merchantRows.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const formatCount = (value) => (Number(value) || 0).toLocaleString("en-IN");

  return (
    <div className="block md:hidden bg-[#F5F6F8] dark:bg-neutral-950 min-h-screen">
      {loading ? (
        <div className="flex h-[70vh] w-full flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0446DB]" />
          <p className="mt-2 text-sm text-gray-500">
            Loading Analytics Dashboard...
          </p>
        </div>
      ) : (
        <div className="w-full space-y-4 px-3 pb-24 pt-2">
          {/* <OrderSearch /> */}
          {/* Header & Filter */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Real-time insights and performance metrics
              </p>
            </div>

            {/* FILTER DRAWER (Bottom Sheet Style) */}
            <Drawer
              direction="bottom"
              open={filterDrawerOpen}
              onOpenChange={openFilters}
            >
              <DrawerTrigger asChild>
                <button className="flex items-center gap-1.5 rounded-lg bg-[#0446DB] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#033bb9]">
                  <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
                </button>
              </DrawerTrigger>

              <DrawerContent className="w-full rounded-t-2xl bg-white dark:bg-neutral-900">
                <DrawerHeader className="relative border-b border-gray-100 px-5 pb-4 pt-6 text-left dark:border-neutral-800">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-left">
                      <DrawerTitle className="text-lg font-bold text-gray-900 dark:text-white">
                        Advanced Filters
                      </DrawerTitle>
                      <DrawerDescription className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Filter by date, pickup city, DC and vendor.
                      </DrawerDescription>
                    </div>

                    <DrawerClose asChild>
                      <button
                        type="button"
                        aria-label="Close filters"
                        className="mt-0.5 rounded-full p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <X className="h-5 w-5" strokeWidth={2.5} />
                      </button>
                    </DrawerClose>
                  </div>
                </DrawerHeader>
                <form
                  id="analytics-advanced-filters"
                  onSubmit={applyScope}
                  className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4"
                >
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      Date Range
                    </h4>
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold text-gray-700 dark:text-gray-200">
                        Select Period
                      </span>
                      <select
                        value={draftDatePreset}
                        onChange={(e) => setDraftDatePreset(e.target.value)}
                        className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
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
                      <div className="grid grid-cols-2 gap-2">
                        <label className="block">
                          <span className="mb-1 block text-[11px] font-semibold text-gray-700 dark:text-gray-200">
                            Start Date
                          </span>
                          <input
                            required
                            type="date"
                            value={draftStartDate}
                            max={draftEndDate || undefined}
                            onChange={(e) => setDraftStartDate(e.target.value)}
                            className="h-10 w-full rounded-lg border border-gray-200 bg-white px-2 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-[11px] font-semibold text-gray-700 dark:text-gray-200">
                            End Date
                          </span>
                          <input
                            required
                            type="date"
                            value={draftEndDate}
                            min={draftStartDate || undefined}
                            onChange={(e) => setDraftEndDate(e.target.value)}
                            className="h-10 w-full rounded-lg border border-gray-200 bg-white px-2 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-200">
                      Pickup City
                    </span>
                    <select
                      value={filterCity}
                      onChange={(e) => setFilterCity(e.target.value)}
                      className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
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
                  <div className="gap-4">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-200">
                        Fleet Partner
                      </span>
                      <select
                        value={filterVendorId}
                        onChange={(e) => setFilterVendorId(e.target.value)}
                        className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                      >
                        <option value="">Select a Vendor</option>
                        {vendorList.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.id}: {v.vendor_name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </form>
                <DrawerFooter className="flex w-full flex-row items-center justify-end gap-2 border-t border-gray-100 px-4 py-3 dark:border-neutral-800">
                  <CustomButton
                    type="button"
                    variant="outline"
                    size="md"
                    icon={RotateCcw}
                    onClick={resetAllFilters}
                    className="w-1/2"
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
                    Apply
                  </CustomButton>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
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

          {/* KPI Cards Section */}
          <div className="grid grid-cols-1 gap-3">
            {/* Total Orders */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Total Orders
                  </h2>
                  <div className="mt-1 text-3xl font-extrabold text-gray-900 dark:text-white">
                    {formatCount(totalOrdersKpi)}
                  </div>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
                  <TotalOrderIcon />
                </div>
              </div>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-gray-600 dark:text-gray-300">
                  <span>Completion Rate</span>
                  <span className="font-bold text-[#0446DB] dark:text-blue-400">
                    100%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800">
                  <div
                    className="h-full rounded-full bg-[#0446DB]"
                    style={{ width: `100%` }}
                  />
                </div>
              </div>
            </div>

            {/* Split 2 Columns for Open & Delivered */}
            <div className="grid grid-cols-2 gap-3">
              {/* Open Orders */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      Open Orders
                    </h2>
                    <div className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                      {formatCount(openOrderKpi)}
                    </div>
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/10">
                    <PenOrdersIcon className="text-lg text-amber-500" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-[10px] text-gray-600 dark:text-gray-300">
                    <span>Open Orders</span>
                    <span className="font-bold text-amber-500">
                      {percentOfOrders(openOrderKpi)}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: `${percentOfOrders(openOrderKpi)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Orders Delivered */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      Orders Delivered
                    </h2>
                    <div className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                      {formatCount(deliveredOrdersKpi)}
                    </div>
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50 dark:bg-green-500/10">
                    <OrdersDelivered className="text-lg text-green-500" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-[10px] text-gray-600 dark:text-gray-300">
                    <span>Success Rate</span>
                    <span className="font-bold text-green-500">
                      {percentOfOrders(deliveredOrdersKpi)}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{
                        width: `${percentOfOrders(deliveredOrdersKpi)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Split 2 Columns for NDR & RTO */}
            <div className="grid grid-cols-2 gap-3">
              {/* NDR's */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      NDR's
                    </h2>
                    <div className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                      {formatCount(ndrOrdersKpi)}
                    </div>
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 dark:bg-red-500/10">
                    <GiCancel className="text-lg text-red-500" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-[10px] text-gray-600 dark:text-gray-300">
                    <span>NDR's Rate</span>
                    <span className="font-bold text-red-500">
                      {percentOfOrders(ndrOrdersKpi)}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800">
                    <div
                      className="h-full rounded-full bg-red-500"
                      style={{ width: `${percentOfOrders(ndrOrdersKpi)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* RTO Delivered */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      RTO Delivered
                    </h2>
                    <div className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                      {formatCount(rtoOrdersKpi)}
                    </div>
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-500/10">
                    <TbTruckReturn className="text-lg text-[#D97706]" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-[10px] text-gray-600 dark:text-gray-300">
                    <span>RTO Recovery</span>
                    <span className="font-bold text-[#D97706]">
                      {percentOfOrders(rtoOrdersKpi)}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800">
                    <div
                      className="h-full rounded-full bg-orange-500"
                      style={{ width: `${percentOfOrders(rtoOrdersKpi)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="space-y-3 pt-2">
            {/* Live Orders Status */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Live Orders Status
                </h3>
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
              </div>
              <MobileDonutChart
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

            {/* Payment Methods */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-white">
                Payment Methods
              </h3>
              <MobileDonutChart
                data={[
                  {
                    id: "cod",
                    label: "COD",
                    value: Number(analytics?.overall_orders?.cod_orders) || 0,
                    color: "#0446DB",
                  },
                  {
                    id: "prepaid",
                    label: "Prepaid",
                    value:
                      Number(analytics?.overall_orders?.prepaid_orders) || 0,
                    color: "#FFA673",
                  },
                ]}
              />
            </div>

            {/* Delivery Types */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-white">
                Delivery Types
              </h3>
              <MobileDonutChart
                data={[
                  {
                    id: "ndd",
                    label: "Ndd",
                    value: Number(analytics?.overall_orders?.ndd_orders) || 0,
                    color: "#0446DB",
                  },
                  {
                    id: "sdd",
                    label: "Sdd",
                    value: Number(analytics?.overall_orders?.sdd_orders) || 0,
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

            {/* COD Remittance Status */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-white">
                COD Remittance Status
              </h3>
              <MobileDonutChart
                data={[
                  {
                    id: "received",
                    label: "Received",
                    value: Number(codRemittance?.["received"]) || 0,
                    color: "#0446DB",
                  },
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
                ]}
              />
            </div>
          </div>

          {/* City Wise Orders */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 mt-3">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  City Wise Order Distribution
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  Total orders by pickup city
                </p>
              </div>
              <div className="text-xs font-medium text-gray-500">
                Total Cities: {cityWiseOrders?.length || 0}
              </div>
            </div>

            {cityWiseOrders?.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-400 dark:text-neutral-500">
                No city data available
              </p>
            ) : (
              <div className="space-y-4">
                {cityWiseOrders.map((city, index) => {
                  const orders =
                    Number(city.total_orders) || Number(city.count) || 0;
                  const maxOrders = Math.max(
                    ...cityWiseOrders.map(
                      (c) => Number(c.total_orders) || Number(c.count) || 0,
                    ),
                  );
                  const percent =
                    maxOrders > 0 ? (orders / maxOrders) * 100 : 0;
                  const cityName =
                    city.pickup_city ||
                    city.delivery_city ||
                    city.city ||
                    "Unknown";

                  return (
                    <div
                      key={`${cityName}-${index}`}
                      className="flex items-center gap-3"
                    >
                      <span className="w-20 shrink-0 truncate text-sm font-medium text-gray-600 dark:text-gray-300">
                        {cityName}
                      </span>
                      <div className="flex-1 h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800">
                        <div
                          className="h-full rounded-full bg-[#0446DB] transition-all duration-500"
                          style={{ width: `${Math.max(percent, 0)}%` }}
                        />
                      </div>
                      <span className="w-12 shrink-0 text-right text-sm font-bold text-gray-900 dark:text-white">
                        {orders.toLocaleString("en-IN")}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Merchant Wise Orders (With Pagination) */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 mt-3">
            <div className="mb-3 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Merchant Wise Order Summary
              </h3>
              <input
                value={merchantSearch}
                onChange={(e) => {
                  setMerchantSearch(e.target.value);
                  setMerchantPage(1);
                }}
                placeholder="Search merchant name or ID"
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs text-gray-800 dark:text-white outline-none focus:border-[#0446DB]"
              />
            </div>

            <div className="space-y-2">
              {displayMerchants.map((row, i) => {
                const isExpanded = expandedMerchant === row.merchant_name;
                return (
                  <div
                    key={`${row.merchant_id}-${i}`}
                    className="rounded-lg border border-gray-100 dark:border-neutral-800 overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedMerchant(
                          isExpanded ? null : row.merchant_name,
                        )
                      }
                      className="flex w-full items-center justify-between bg-gray-50/50 p-3 text-left dark:bg-neutral-800/50"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {row.merchant_name || `Merchant #${row.merchant_id}`}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          ID: {row.merchant_id}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatCount(row.delivered_orders)}
                          </p>
                          <p className="text-[9px] text-gray-500">Delivered</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatCount(row.booked_orders)}
                          </p>
                          <p className="text-[9px] text-gray-500">Booked</p>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="grid grid-cols-2 gap-2 p-3 bg-white dark:bg-neutral-900">
                        {[
                          { label: "Booked", key: "booked_orders" },
                          {
                            label: "Pending pickup",
                            key: "pending_pickup_orders",
                          },
                          { label: "Picked", key: "picked_orders" },
                          { label: "In transit", key: "in_transit_orders" },
                          {
                            label: "Out for delivery",
                            key: "out_for_delivery_orders",
                          },
                          { label: "Delivered", key: "delivered_orders" },
                          { label: "NDR", key: "ndr_orders" },
                          { label: "Undelivered", key: "undelivered_orders" },
                          {
                            label: "RTO in transit",
                            key: "rto_in_transit_orders",
                          },
                          {
                            label: "RTO delivered",
                            key: "rto_delivered_orders",
                          },
                        ].map((k) => (
                          <div
                            key={k.key}
                            className="flex items-center justify-between rounded-md bg-white p-2  border dark:bg-neutral-800/60"
                          >
                            <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">
                              {k.label}
                            </span>
                            <span className="text-xs font-bold text-gray-900 dark:text-white">
                              {formatCount(row[k.key])}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {!displayMerchants.length && (
                <div className="py-6 text-center text-xs text-gray-500">
                  No merchant records found
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {merchantRows.length > 0 && (
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-neutral-800">
                <span className="text-[11px] font-medium text-gray-500">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + itemsPerPage, merchantRows.length)} of{" "}
                  {merchantRows.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={merchantPage === 1}
                    onClick={() => setMerchantPage((p) => Math.max(1, p - 1))}
                    className="rounded-md border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-300"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {merchantPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={merchantPage >= totalPages}
                    onClick={() =>
                      setMerchantPage((p) => Math.min(totalPages, p + 1))
                    }
                    className="rounded-md border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-300"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Filtered Stats Section (Matching Screenshot UI) */}
          {filteredStats &&
            (() => {
              const orders = filteredStats?.order_status_counts || {};
              const remittance = Array.isArray(
                filteredStats?.cod_remittance_counts,
              )
                ? filteredStats.cod_remittance_counts
                : [];
              const totalOrders = Math.max(0, Number(orders.total_orders) || 0);
              const totalCOD = remittance.reduce(
                (sum, item) => sum + Math.max(0, Number(item?.count) || 0),
                0,
              );

              // Filter out total_orders from status list
              const orderRows = Object.entries(orders).filter(
                ([status]) => status !== "total_orders",
              );

              const percentage = (count, total) =>
                total > 0
                  ? Math.min(
                      100,
                      Math.max(0, ((Number(count) || 0) / total) * 100),
                    )
                  : 0;

              // Status Colors Mapping (Screenshot Match)
              const orderStatusConfig = {
                pending_pickup: {
                  label: "Pending Pickup",
                  color: "bg-amber-400",
                  text: "text-amber-500",
                },
                picked: {
                  label: "Picked",
                  color: "bg-blue-500",
                  text: "text-blue-500",
                },
                in_transit: {
                  label: "In Transit",
                  color: "bg-violet-500",
                  text: "text-violet-500",
                },
                out_for_delivery: {
                  label: "Out For Delivery",
                  color: "bg-orange-500",
                  text: "text-orange-500",
                },
                delivered: {
                  label: "Delivered",
                  color: "bg-green-500",
                  text: "text-green-500",
                },
                ndr: {
                  label: "NDR",
                  color: "bg-red-500",
                  text: "text-red-500",
                },
                rto_in_transit: {
                  label: "RTO In Transit",
                  color: "bg-blue-600",
                  text: "text-slate-500",
                },
                rto_delivered: {
                  label: "RTO Delivered",
                  color: "bg-teal-500",
                  text: "text-teal-500",
                },
                undelivered: {
                  label: "Undelivered",
                  color: "bg-red-600",
                  text: "text-red-600",
                },
                booked: {
                  label: "Booked",
                  color: "bg-indigo-500",
                  text: "text-indigo-500",
                },
                cancelled: {
                  label: "Cancelled",
                  color: "bg-gray-500",
                  text: "text-gray-500",
                },
                lost: {
                  label: "Lost",
                  color: "bg-gray-400",
                  text: "text-gray-400",
                },
              };

              const codStatusConfig = {
                initiated: {
                  label: "Initiated",
                  color: "bg-blue-500",
                  text: "text-blue-500",
                },
                pending: {
                  label: "Pending",
                  color: "bg-orange-500",
                  text: "text-orange-500",
                },
                received: {
                  label: "Received",
                  color: "bg-green-500",
                  text: "text-green-500",
                },
                adjusted: {
                  label: "Adjusted",
                  color: "bg-purple-500",
                  text: "text-purple-500",
                },
              };

              return (
                <div className="space-y-4 mt-4">
                  {/* 1. ORDER STATUS COUNTS CARD */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.666992 7.41602C0.666992 7.00202 1.00299 6.66602 1.41699 6.66602H2.91699C3.33099 6.66602 3.66699 7.00202 3.66699 7.41602V11.916C3.66699 12.33 3.33099 12.666 2.91699 12.666H1.41699C1.00306 12.666 0.666992 12.33 0.666992 11.916V7.41602V7.41602M5.16699 4.41602C5.16699 4.00202 5.50299 3.66602 5.91699 3.66602H7.41699C7.83099 3.66602 8.16699 4.00202 8.16699 4.41602V11.916C8.16699 12.33 7.83099 12.666 7.41699 12.666H5.91699C5.50306 12.666 5.16699 12.33 5.16699 11.916V4.41602V4.41602M9.66699 1.41602C9.66699 1.00202 10.003 0.666016 10.417 0.666016H11.917C12.331 0.666016 12.667 1.00202 12.667 1.41602V11.916C12.667 12.33 12.331 12.666 11.917 12.666H10.417C10.0031 12.666 9.66699 12.33 9.66699 11.916V1.41602V1.41602"
                            stroke-width="1.33333"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke="#2563EB"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-gray-900 dark:text-white">
                          Order Status Counts
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                          Detailed overview of orders by current status
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col  mb-5">
                      {/* Fleet Partner Tag */}
                      {appliedScope?.vendor_id && (
                        <div className="mb-3 w-[60%] inline-block rounded-full border border-dashed border-orange-400 bg-orange-50 px-3 py-1 text-[11px] font-semibold text-orange-600 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-400">
                          Fleet Partner:{" "}
                          <span className="font-bold">
                            {selectedVendorName ||
                              `Vendor #${appliedScope.vendor_id}`}
                          </span>
                        </div>
                      )}

                      {/* Total Orders Tag */}
                      <div className="inline-block w-[50%] rounded-md bg-blue-50 px-3 py-1 text-[12px] font-semibold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                        Total Orders{" "}
                        <span className="font-bold">
                          {formatCount(totalOrders)}
                        </span>
                      </div>
                    </div>

                    {/* Table Headers */}
                    <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-gray-500 dark:text-gray-400">
                      <span>Order Status</span>
                      <div className="flex items-center gap-4 pr-1">
                        <span className="w-12 text-right">Orders</span>
                        <span className="w-14 text-right">% of total</span>
                      </div>
                    </div>

                    {/* Status Rows */}
                    <div className="space-y-4">
                      {orderRows.map(([status, count]) => {
                        const config = orderStatusConfig[status] || {
                          label: status.replaceAll("_", " "),
                          color: "bg-gray-400",
                          text: "text-gray-500",
                        };
                        const percent = percentage(count, totalOrders);

                        return (
                          <div key={status} className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`h-2.5 w-2.5 rounded-full ${config.color}`}
                                />
                                <span className="text-xs font-medium text-gray-800 dark:text-gray-200 capitalize">
                                  {config.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 pr-1">
                                <span className="w-12 text-right text-xs font-bold text-gray-900 dark:text-white">
                                  {formatCount(count)}
                                </span>
                                <span className="w-14 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
                                  {percent.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                            {/* Progress Bar */}
                            <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-neutral-800">
                              <div
                                className={`h-full rounded-full ${config.color}`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. COD REMITTANCE STATUS CARD */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <ellipse cx="12" cy="5" rx="8" ry="3" />
                          <path d="M4 5v5c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
                          <path d="M4 10v5c0 1.7 3.6 3 8 3s8-1.3 8-3v-5" />
                          <path d="M4 15v4c0 1.7 3.6 3 8 3s8-1.3 8-3v-4" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-gray-900 dark:text-white">
                          COD Remittance Status
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                          Overview of COD remittance records by status
                        </p>
                      </div>
                    </div>

                    {/* Fleet Partner Tag */}
                    <div className="flex flex-col  mb-5">
                      {appliedScope?.vendor_id && (
                        <div className="mb-4 w-[60%] inline-block rounded-md border border-dashed border-orange-300 bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-orange-500 dark:border-orange-500/30 dark:bg-orange-500/10">
                          Fleet Partner:{" "}
                          {selectedVendorName ||
                            `Vendor #${appliedScope.vendor_id}`}
                        </div>
                      )}

                      {/* Total Records Tag */}

                      <div className="inline-block w-[40%] rounded-md bg-blue-50 px-3 py-1 text-[12px] font-semibold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                        <span className="font-bold">
                          Total Records {formatCount(totalCOD)}
                        </span>
                      </div>
                    </div>

                    {/* Table Headers */}
                    <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-gray-500 dark:text-gray-400">
                      <span>Status</span>
                      <div className="flex items-center gap-4 pr-1">
                        <span className="w-12 text-right">Count</span>
                        <span className="w-14 text-right">% of total</span>
                      </div>
                    </div>

                    {/* Remittance Rows */}
                    <div className="space-y-4">
                      {remittance.map((item, index) => {
                        const status = String(
                          item?.status || "unknown",
                        ).toLowerCase();
                        const config = codStatusConfig[status] || {
                          label: status.replaceAll("_", " "),
                          color: "bg-gray-400",
                          text: "text-gray-500",
                        };
                        const percent = percentage(item?.count, totalCOD);

                        return (
                          <div
                            key={`${status}-${index}`}
                            className="flex flex-col gap-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`h-2.5 w-2.5 rounded-full ${config.color}`}
                                />
                                <span className="text-xs font-medium text-gray-800 dark:text-gray-200 capitalize">
                                  {config.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 pr-1">
                                <span className="w-12 text-right text-xs font-bold text-gray-900 dark:text-white">
                                  {formatCount(item?.count)}
                                </span>
                                <span className="w-14 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
                                  {percent.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                            {/* Progress Bar */}
                            <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-neutral-800">
                              <div
                                className={`h-full rounded-full ${config.color}`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}
        </div>
      )}
    </div>
  );
}
