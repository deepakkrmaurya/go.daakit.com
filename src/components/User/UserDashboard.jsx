

import axios from "axios";
import { useEffect, useState } from "react";
import { rainbowSurgePalette } from "@mui/x-charts/colorPalettes";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
// import Piechart from "../Piechart";
import { Piechart } from "@/components/chart/Piechart";
import { TbReportAnalytics, TbTruckReturn } from "react-icons/tb";
import { FaPlaneArrival } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import CityOrdersChart from "../CityOrdersChart";
import BottomScrollCounter from "../ui/OdometerCounter";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;

export default function UserAnalytics() {
  const theme = useTheme();
  const palette = rainbowSurgePalette(theme.palette.mode);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({});
  const [selected, setSelected] = useState("Last 30 Days");
  const [liveOrdes, setLiveOrders] = useState(null);
  const [codRemittance, setCODRemittance] = useState(null);
  const [cityWiseOrders, setCityWiseOrders] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [vendor2, setVendor2] = useState([]);

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

  const [customEndDate, setCustomEndDate] = useState(
    advanceFilters.end_date,
  );

  // =========================================================
  // ANALYTICS
  // =========================================================

  const getAnalytics = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${baseURL}/api/user/getOrderAndRemittanceStats`,
        {
          params: advanceFilters,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setCustomStartDate(advanceFilters.start_date);
      setCustomEndDate(advanceFilters.end_date);

      setAnalytics(res.data.data.data);

      const temp = {};

      res.data.data?.data?.order_status_counts?.forEach((element) => {
        temp[element.status] = element.count;
      });

      setLiveOrders(temp);

      const cod = {};

      res.data.data?.data?.cod_remittance_counts?.forEach((element) => {
        cod[element.status] = element.count;
      });

      setCODRemittance(cod);

      setCityWiseOrders(res?.data?.data?.data?.city_wise_orders);

      const tempVendorData = [];
      const tempVendorData2 = [];

      res.data.data?.vendor_assignments?.forEach((element, index) => {
        tempVendorData.push({
          label: `FP${element.vendor_id}`,
          value:
            Number(element.assignment_completed) +
            Number(element.assignment_cancelled) +
            Number(element.assignment_not_completed),
        });

        tempVendorData2.push({
          label: `FP${element.vendor_id}-Completed`,
          value: Number(element.assignment_completed),
          color: palette[index],
        });

        tempVendorData2.push({
          label: `FP${element.vendor_id}-Cancelled`,
          value: Number(element.assignment_cancelled),
          color: palette[index],
        });

        tempVendorData2.push({
          label: `FP${element.vendor_id}-Not Completed`,
          value: Number(element.assignment_not_completed),
          color: palette[index],
        });
      });

      setVendor(tempVendorData);
      setVendor2(tempVendorData2);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to get analytics data:",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // PERMISSIONS
  // =========================================================

  const getUserPermissions = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/user/getUserPermissions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const permission = res?.data?.data?.data || [];
      
      localStorage.setItem("permission", JSON.stringify(permission));
      if (
        !permission.includes("DASHBOARD_VIEW") &&
        !permission.includes("ADMIN_FULL_ACCESS")
      ) {
        navigate("/unauthorized");
        return;
      }
    } catch (error) {
      toast.error("");
    }
  };

  // =========================================================
  // LIVE ANALYTICS
  // =========================================================

  const getLiveAnalytics = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/api/user/getOrderAndRemittanceStats`,
        {
          params: advanceFilters,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setCustomStartDate(advanceFilters.start_date);
      setCustomEndDate(advanceFilters.end_date);

      setAnalytics(res.data.data.data);

      const temp = {};

      res.data.data?.data?.order_status_counts?.forEach((element) => {
        temp[element.status] = element.count;
      });

      setLiveOrders(temp);

      const cod = {};

      res.data.data?.data?.cod_remittance_counts?.forEach((element) => {
        cod[element.status] = element.count;
      });

      setCODRemittance(cod);

      setCityWiseOrders(res?.data?.data?.data?.city_wise_orders);

      const tempVendorData = [];
      const tempVendorData2 = [];

      res.data.data?.vendor_assignments?.forEach((element, index) => {
        tempVendorData.push({
          label: `FP${element.vendor_id}`,
          value:
            Number(element.assignment_completed) +
            Number(element.assignment_cancelled) +
            Number(element.assignment_not_completed),
        });

        tempVendorData2.push({
          label: `FP${element.vendor_id}-Completed`,
          value: Number(element.assignment_completed),
          color: palette[index],
        });

        tempVendorData2.push({
          label: `FP${element.vendor_id}-Cancelled`,
          value: Number(element.assignment_cancelled),
          color: palette[index],
        });

        tempVendorData2.push({
          label: `FP${element.vendor_id}-Not Completed`,
          value: Number(element.assignment_not_completed),
          color: palette[index],
        });
      });

      setVendor(tempVendorData);
      setVendor2(tempVendorData2);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to get analytics data:",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LIVE UPDATE
  // =========================================================

  useEffect(() => {
    getUserPermissions();

    const interval = setInterval(() => {
      getLiveAnalytics();
      console.log("Fetching live order data...");
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  // =========================================================
  // DATE FILTER
  // =========================================================

  const handleSelect = (value) => {
    setSelected(value);

    if (value === "Custom Range") {
      setCustomStartDate(advanceFilters.start_date);
      setCustomEndDate(advanceFilters.end_date);
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

    setAdvanceFilters({
      start_date: fromDate.toISOString().split("T")[0],
      end_date: toDate.toISOString().split("T")[0],
    });
  };

  // =========================================================
  // CUSTOM DATE
  // =========================================================

  const openDatePicker = (event) => {
    try {
      event.currentTarget.showPicker?.();
    } catch {
      return;
    }
  };

  const updateCustomStartDate = (value) => {
    setCustomStartDate(value);

    if (customEndDate && value && customEndDate < value) {
      setCustomEndDate(value);
    }
  };

  const updateCustomEndDate = (value) => {
    setCustomEndDate(value);

    if (customStartDate && value && customStartDate > value) {
      setCustomStartDate(value);
    }
  };

  const handleCustomFilterApply = (event) => {
    event.preventDefault();

    if (!customStartDate || !customEndDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (customStartDate > customEndDate) {
      toast.error("Start date cannot be after end date");
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

  // =========================================================
  // PERCENTAGE HELPER
  // =========================================================

  const totalOrders = Number(analytics?.overall_orders?.total_orders) || 0;

  const getPercentage = (value) => {
    if (!totalOrders) return 0;

    return Math.round(((Number(value) || 0) / totalOrders) * 100);
  };

  const deliveredPercentage = getPercentage(liveOrdes?.["delivered"]);
  const ndrPercentage = getPercentage(liveOrdes?.["ndr"]);
  const rtoPercentage = getPercentage(liveOrdes?.["rto delivered"]);

  // =========================================================
  // LOADER
  // =========================================================

  if (loading) {
    return (
      <div className="flex h-[90vh] w-full items-center justify-center bg-white dark:bg-neutral-950">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin " />

          <p className="mt-3 text-sm font-medium text-neutral-600 dark:text-neutral-300">
            Loading Analytics Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-neutral-50 dark:bg-neutral-950">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            {/* Heading */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white lg:text-3xl">
                Analytics Dashboard
              </h1>

              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Real-time insights and performance metrics
              </p>
            </div>

            {/* Filter */}
            <div className="w-full lg:w-auto">
              <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                Filter by Date
              </label>

              <div className="relative w-full lg:w-[260px]">
                <select
                  value={selected}
                  onChange={(e) => handleSelect(e.target.value)}
                  className="h-10 w-full cursor-pointer appearance-none rounded-md border border-neutral-200 bg-white px-3 pr-9 text-sm font-medium text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  <option>Today</option>
                  <option>Yesterday</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>Custom Range</option>
                </select>

                <svg
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* =================================================
              CUSTOM RANGE
          ================================================== */}

          {selected === "Custom Range" && (
            <div className="mt-5 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
              <form
                onSubmit={handleCustomFilterApply}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]"
              >
                {/* Start */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={customStartDate}
                    max={customEndDate || undefined}
                    onClick={openDatePicker}
                    onFocus={openDatePicker}
                    onChange={(e) =>
                      updateCustomStartDate(e.target.value)
                    }
                    className="h-10 w-full cursor-pointer rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                  />
                </div>

                {/* End */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    End Date
                  </label>

                  <input
                    type="date"
                    value={customEndDate}
                    min={customStartDate || undefined}
                    onClick={openDatePicker}
                    onFocus={openDatePicker}
                    onChange={(e) =>
                      updateCustomEndDate(e.target.value)
                    }
                    className="h-10 w-full cursor-pointer rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                  />
                </div>

                {/* Apply */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="h-10 w-full cursor-pointer rounded-md bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-[#0339b5] lg:w-auto"
                  >
                    Apply
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="mx-auto space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* ===================================================
            KPI CARDS
        ==================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* ================= TOTAL ORDERS ================= */}

          <div className="group rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-500/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Total Orders
                </p>

                <div className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  <BottomScrollCounter
                    prevValue={200}
                    newValue={
                      analytics?.overall_orders?.total_orders?.toLocaleString() ||
                      0
                    }
                    className=""
                  />
                </div>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] transition group-hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400">
                <TbReportAnalytics className="text-xl" />
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-neutral-500 dark:text-neutral-400">
                  Completion Rate
                </span>

                <span className="font-semibold text-neutral-700 dark:text-neutral-200">
                  100%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div className="h-full w-full rounded-full bg-[#0446DB]" />
              </div>
            </div>
          </div>

          {/* ================= DELIVERED ================= */}

          <div className="group rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-emerald-200 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-500/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Orders Delivered
                </p>

                <div className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  <BottomScrollCounter
                    prevValue={200}
                    newValue={
                      liveOrdes?.["delivered"]?.toLocaleString() || 0
                    }
                    className=""
                  />
                </div>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400">
                <FaPlaneArrival className="text-xl" />
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-neutral-500 dark:text-neutral-400">
                  Success Rate
                </span>

                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {deliveredPercentage}%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(deliveredPercentage, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* ================= NDR ================= */}

          <div className="group rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-red-200 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-red-500/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  NDR's
                </p>

                <div className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  <BottomScrollCounter
                    prevValue={200}
                    newValue={liveOrdes?.["ndr"]?.toLocaleString() || 0}
                    className=""
                  />
                </div>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600 transition group-hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400">
                <GiCancel className="text-xl" />
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-neutral-500 dark:text-neutral-400">
                  NDR's Rate
                </span>

                <span className="font-semibold text-red-600 dark:text-red-400">
                  {ndrPercentage}%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div
                  className="h-full rounded-full bg-red-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(ndrPercentage, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* ================= RTO ================= */}

          <div className="group rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-amber-200 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-amber-500/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  RTO Delivered
                </p>

                <div className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  <BottomScrollCounter
                    prevValue={200}
                    newValue={
                      liveOrdes?.["rto delivered"]?.toLocaleString() || 0
                    }
                    className=""
                  />
                </div>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-600 transition group-hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400">
                <TbTruckReturn className="text-xl" />
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-neutral-500 dark:text-neutral-400">
                  RTO Recovery
                </span>

                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {rtoPercentage}%
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(rtoPercentage, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            CHARTS
        ==================================================== */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* ================= LIVE ORDERS ================= */}

          <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Live Orders Status
                </h3>

                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  Current shipment status
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>

                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Live
                </span>
              </div>
            </div>

            <div className="p-5">
              <Piechart
                data={[
                  {
                    id: "Booked",
                    label: "Booked",
                    value: Number(liveOrdes?.["booked"]) || 0,
                    color: "#0446DB",
                  },
                  {
                    id: "Pending Pickup",
                    label: "Pending Pickup",
                    value: Number(liveOrdes?.["pending pickup"]) || 0,
                    color: "#FFA673",
                  },
                  {
                    id: "Out For Delivery",
                    label: "Out For Delivery",
                    value: Number(liveOrdes?.["out for delivery"]) || 0,
                    color: "#03A6A1",
                  },
                  {
                    id: "Undelivered Assigned",
                    label: "Undelivered Assigned",
                    value:
                      Number(liveOrdes?.["undelivered assigned"]) || 0,
                    color: "#F25912",
                  },
                  {
                    id: "RTO In Transit",
                    label: "RTO In Transit",
                    value: Number(liveOrdes?.["rto in transit"]) || 0,
                    color: "#FDFFB8",
                  },
                ]}
              />
            </div>
          </div>

          {/* ================= PAYMENT METHODS ================= */}

          <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Payment Methods
              </h3>

              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                COD and prepaid distribution
              </p>
            </div>

            <div className="p-5">
              <Piechart
                data={[
                  {
                    id: "COD",
                    label: "COD",
                    value:
                      Number(analytics?.overall_orders?.cod_orders) || 0,
                    color: "#0446DB",
                  },
                  {
                    id: "Prepaid",
                    label: "Prepaid",
                    value:
                      Number(analytics?.overall_orders?.prepaid_orders) || 0,
                    color: "#FFA673",
                  },
                ]}
              />
            </div>
          </div>

          {/* ================= DELIVERY TYPES ================= */}

          <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Delivery Types
              </h3>

              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                Service type distribution
              </p>
            </div>

            <div className="p-5">
              <Piechart
                data={[
                  {
                    id: "NDD",
                    label: "NDD",
                    value:
                      Number(analytics?.overall_orders?.ndd_orders) || 0,
                    color: "#0446DB",
                  },
                  {
                    id: "SDD",
                    label: "SDD",
                    value:
                      Number(analytics?.overall_orders?.sdd_orders) || 0,
                    color: "#FFA673",
                  },
                  {
                    id: "hld",
                    label: "HLD",
                    value:
                      Number(analytics?.overall_orders?.turant_orders) || 0,
                    color: "#03A6A1",
                  },
                ]}
              />
            </div>
          </div>

          {/* ================= COD REMITTANCE ================= */}

          <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                COD Remittance Status
              </h3>

              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                Current COD settlement status
              </p>
            </div>

            <div className="p-5">
              <Piechart
                data={[
                  {
                    id: "Pending",
                    label: "Pending",
                    value: Number(codRemittance?.["pending"]) || 0,
                    color: "#0446DB",
                  },
                  {
                    id: "Initiated",
                    label: "Initiated",
                    value: Number(codRemittance?.["initiated"]) || 0,
                    color: "#FFA673",
                  },
                  {
                    id: "Adjusted",
                    label: "Adjusted",
                    value: Number(codRemittance?.["adjusted"]) || 0,
                    color: "#03A6A1",
                  },
                  {
                    id: "Received",
                    label: "Received",
                    value: Number(codRemittance?.["received"]) || 0,
                    color: "#FF2DD1",
                  },
                ]}
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            CITY WISE DISTRIBUTION
        ==================================================== */}

        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-col gap-2 border-b border-neutral-100 px-5 py-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                City Wise Order Distribution
              </h3>

              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                Orders distributed across serviceable cities
              </p>
            </div>

            <div className="inline-flex w-fit items-center rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              Total Cities:&nbsp;
              <span className="font-semibold text-neutral-900 dark:text-white">
                {cityWiseOrders?.length || 0}
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            {cityWiseOrders?.length > 0 ? (
              <div className="w-full overflow-x-auto">
                <CityOrdersChart cityWiseOrders={cityWiseOrders} />
              </div>
            ) : (
              <div className="flex min-h-[250px] items-center justify-center">
                <div className="text-center">
                  <TbReportAnalytics className="mx-auto h-7 w-7 text-neutral-300 dark:text-neutral-600" />

                  <p className="mt-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">
                    No city data available
                  </p>

                  <p className="mt-1 text-xs text-neutral-400">
                    City wise order data will appear here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
