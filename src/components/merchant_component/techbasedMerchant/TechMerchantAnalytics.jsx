
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Loader2,
  PackageCheck,
  PackageOpen,
  RefreshCw,
  RotateCcw,
  ShoppingCart,
  Truck,
} from "lucide-react";
import Piechart from "../../Piechart";
import CityOrdersChart from "../../CityOrdersChart";
import axiosInstance from "../../../Helper/axiosInstance";

const baseURL = import.meta.env.VITE_FRONTEND_URL;

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const money = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

const statusLabel = (status = "") =>
  status
    .split(" ")
    .filter(Boolean)
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");

const TechMerchantAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({});
  const [analyticsTab, setAnalyticsTab] = useState("all");
  const [selected, setSelected] = useState("Last 30 Days");

  const today = new Date();
  const thirtyDaysBack = new Date();
  thirtyDaysBack.setDate(thirtyDaysBack.getDate() - 29);

  const [advanceFilters, setAdvanceFilters] = useState({
    start_date: thirtyDaysBack.toISOString().split("T")[0],
    end_date: today.toISOString().split("T")[0],
  });

  const [customStartDate, setCustomStartDate] = useState(
    advanceFilters.start_date,
  );
  const [customEndDate, setCustomEndDate] = useState(advanceFilters.end_date);

  // API returns combined data at root and separate self/daakit summaries.
  const dashboardData = useMemo(() => {
    if (analyticsTab === "self") return analytics?.self || {};
    if (analyticsTab === "daakit") return analytics?.daakit || {};
    return analytics || {};
  }, [analytics, analyticsTab]);

  const getStatusCount = (status) =>
    Number(
      dashboardData?.status_counts?.find(
        (item) =>
          String(item?.status || "").toLowerCase() === status.toLowerCase(),
      )?.count || 0,
    );

  const totalOrders = useMemo(
    () =>
      (dashboardData?.status_counts || []).reduce(
        (total, item) => total + Number(item?.count || 0),
        0,
      ),
    [dashboardData?.status_counts],
  );

  const percentage = (value) => {
    if (!totalOrders) return 0;
    return Math.min(100, Math.round((Number(value || 0) / totalOrders) * 100));
  };

  const getAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axiosInstance.get(
        "/api/tech-merchant/getMerchantOrderStatusSummary",
        {
          params: advanceFilters,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAnalytics(res?.data || {});
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

  useEffect(() => {
    getAnalytics();
  }, [advanceFilters]);

  const openDatePicker = (event) => {
    try {
      event.currentTarget.showPicker?.();
    } catch {
      // Browser fallback.
    }
  };

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
        toDate = new Date();
        fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 6);
        break;
      }
      case "Last 30 Days": {
        toDate = new Date();
        fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 29);
        break;
      }
      case "This Month": {
        toDate = new Date();
        fromDate = new Date();
        fromDate.setDate(1);
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

  const cards = [
    {
      title: "Total Revenue",
      value: `₹${money(dashboardData?.order_revenue)}`,
      subtitle: "Total order revenue",
      rate: 100,
      icon: IndianRupee,
      iconClass: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300",
      barClass: "bg-[#0446DB]",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      subtitle: "All orders",
      rate: 100,
      icon: BarChart3,
      iconClass: "bg-blue-100 text-[#0446DB] dark:bg-blue-500/15 dark:text-blue-300",
      barClass: "bg-[#0446DB]",
    },
    {
      title: "Booked",
      value: getStatusCount("booked"),
      subtitle: "Booking rate",
      rate: percentage(getStatusCount("booked")),
      icon: ShoppingCart,
      iconClass: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
      barClass: "bg-blue-600",
    },
    {
      title: "Pending Pickup",
      value: getStatusCount("pending pickup"),
      subtitle: "Pending pickup rate",
      rate: percentage(getStatusCount("pending pickup")),
      icon: Clock3,
      iconClass: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
      barClass: "bg-amber-500",
    },
    {
      title: "Picked",
      value: getStatusCount("picked"),
      subtitle: "Picked rate",
      rate: percentage(getStatusCount("picked")),
      icon: PackageCheck,
      iconClass: "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-300",
      barClass: "bg-cyan-500",
    },
    {
      title: "Delivered",
      value: getStatusCount("delivered"),
      subtitle: "Success rate",
      rate: percentage(getStatusCount("delivered")),
      icon: CheckCircle2,
      iconClass: "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-300",
      barClass: "bg-green-500",
    },
    {
      title: "NDR",
      value: getStatusCount("ndr"),
      subtitle: "NDR rate",
      rate: percentage(getStatusCount("ndr")),
      icon: PackageOpen,
      iconClass: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300",
      barClass: "bg-red-500",
    },
    {
      title: "RTO Delivered",
      value: getStatusCount("rto delivered"),
      subtitle: "RTO rate",
      rate: percentage(getStatusCount("rto delivered")),
      icon: RotateCcw,
      iconClass: "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300",
      barClass: "bg-purple-500",
    },
  ];

  const chartColors = ["#0446DB", "#FFA673", "#03A6A1", "#F25912", "#7C3AED", "#16A34A", "#E11D48", "#0891B2"];

  const statusChartData = (dashboardData?.status_counts || []).map((item, index) => ({
    id: item.status,
    name: statusLabel(item.status),
    label: statusLabel(item.status),
    value: Number(item.count || 0),
    color: chartColors[index % chartColors.length],
  }));

  const orderModeData = [
    {
      id: "ndd",
      name: "NDD",
      label: "NDD",
      value: Number(dashboardData?.order_specific_counts?.ndd_count || 0),
      color: "#0446DB",
    },
    {
      id: "sdd",
      name: "SDD",
      label: "SDD",
      value: Number(dashboardData?.order_specific_counts?.sdd_count || 0),
      color: "#FFA673",
    },
    {
      id: "hld",
      name: "HLD",
      label: "HLD",
      value: Number(dashboardData?.order_specific_counts?.hld_count || 0),
      color: "#03A6A1",
    },
  ];

  const paymentData = (dashboardData?.order_type_counts || []).map((item, index) => ({
    id: item.order_type,
    name: statusLabel(item.order_type),
    label: statusLabel(item.order_type),
    value: Number(item.count || 0),
    color: ["#0446DB", "#FFA673", "#03A6A1"][index % 3],
  }));

  // Admin CityOrdersChart expects pickup_city + total_orders.
  const cityChartData = (dashboardData?.city_distribution || []).map((item) => ({
    pickup_city: item?.delivery_city || item?.pickup_city || "Unknown",
    total_orders: Number(item?.count ?? item?.total_orders ?? 0),
  }));

  if (loading) {
    return (
      <div className="flex min-h-[80vh] w-full items-center justify-center bg-white dark:bg-neutral-950">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-3 text-sm font-medium text-gray-600 dark:text-neutral-300">
            Loading Analytics Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="relative dark:bg-neutral-800">
        <div className="relative z-10 mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-center lg:text-left">
              <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
                Analytics Dashboard
              </h1>
              <p className="text-base text-gray-500 dark:text-indigo-100 lg:text-lg">
                Real-time insights and performance metrics
              </p>
            </div>

            <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-end">
              <div className="min-w-[220px]">
                <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-100">
                  Filter by Date
                </label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <select
                    value={selected}
                    onChange={(e) => handleSelect(e.target.value)}
                    className="h-11 w-full cursor-pointer appearance-none rounded-sm border border-gray-200 bg-white pl-10 pr-9 text-sm text-gray-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                  >
                    <option>Today</option>
                    <option>Yesterday</option>
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>This Month</option>
                    <option>Last Month</option>
                    <option>Custom Range</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={getAnalytics}
                className="flex h-11 items-center justify-center gap-2 rounded-sm border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:border-[#0446DB]/30 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>

          {selected === "Custom Range" && (
            <form
              onSubmit={handleCustomFilterApply}
              className="mt-5 flex flex-col gap-4 rounded-sm border border-gray-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900 sm:flex-row sm:items-end"
            >
              <div className="flex-1">
                <label className="mb-2 block text-xs font-medium text-gray-600 dark:text-neutral-300">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  max={customEndDate || undefined}
                  onClick={openDatePicker}
                  onFocus={openDatePicker}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCustomStartDate(value);
                    if (customEndDate && customEndDate < value) {
                      setCustomEndDate(value);
                    }
                  }}
                  className="h-11 w-full cursor-pointer rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div className="flex-1">
                <label className="mb-2 block text-xs font-medium text-gray-600 dark:text-neutral-300">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  min={customStartDate || undefined}
                  onClick={openDatePicker}
                  onFocus={openDatePicker}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCustomEndDate(value);
                    if (customStartDate && customStartDate > value) {
                      setCustomStartDate(value);
                    }
                  }}
                  className="h-11 w-full cursor-pointer rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="h-11 rounded-sm bg-[#0446DB] px-6 text-sm font-semibold text-white transition hover:bg-[#033bb9]"
              >
                Apply
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="mx-auto px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between border-b border-gray-200 dark:border-neutral-800">
          <div className="flex items-center gap-1">
            {[
              { key: "all", label: "All Orders" },
              { key: "self", label: "Self" },
              { key: "daakit", label: "Daakit" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setAnalyticsTab(tab.key)}
                className={`relative px-4 py-3 text-sm font-semibold transition ${
                  analyticsTab === tab.key
                    ? "text-[#0446DB] dark:text-blue-300"
                    : "text-gray-500 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-white"
                }`}
              >
                {tab.label}
                {analyticsTab === tab.key && (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#0446DB]" />
                )}
              </button>
            ))}
          </div>
          <span className="hidden text-xs text-gray-500 dark:text-neutral-400 sm:block">
            Showing {analyticsTab === "all" ? "combined" : analyticsTab} analytics
          </span>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="group rounded-sm border-1 border-gray-300 bg-white p-6 transition-all duration-300 hover:border-[#0446DB]/20 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h2 className="mb-1 text-lg font-semibold text-gray-700 dark:text-white">
                      {card.title}
                    </h2>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {card.value}
                    </p>
                  </div>
                  <div className={`rounded-xl p-3 ${card.iconClass}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-sm text-gray-600 dark:text-neutral-300">
                    <span>{card.subtitle}</span>
                    <span className="font-semibold">{card.rate}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-700">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${card.barClass}`}
                      style={{ width: `${card.rate}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <ChartCard title="Live Orders Status" live>
            <Piechart data={statusChartData} />
          </ChartCard>

          <ChartCard title="Payment Methods">
            <Piechart data={paymentData} />
          </ChartCard>

          <ChartCard title="Order Mode">
            <Piechart data={orderModeData} />
          </ChartCard>
        </div>

        <div className="mt-6 rounded-sm border border-gray-100 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                City Wise Order Distribution
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                Orders grouped by delivery city
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-neutral-400">
              Total Cities: {dashboardData?.city_distribution?.length || 0}
            </div>
          </div>

          <CityOrdersChart cityWiseOrders={cityChartData} />
        </div>

        <div className="mt-6">
          <PendingOrders
            orders={dashboardData?.pending_pickup_orders || []}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({ title, children, live = false }) => (
  <div className="rounded-sm border border-gray-100 bg-white p-6 transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-900">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
        {title}
      </h3>
      {live && (
        <span className="flex items-center gap-2 text-xs font-medium text-green-600 dark:text-green-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          Live
        </span>
      )}
    </div>
    <div className="min-h-[250px]">{children}</div>
  </div>
);

const PendingOrders = ({ orders = [], loading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalOrders = orders.length;
  const totalPages = Math.max(1, Math.ceil(totalOrders / itemsPerPage));
  const start = (currentPage - 1) * itemsPerPage;
  const currentOrders = orders.slice(start, start + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [orders]);

  const getPageNumbers = () => {
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    return Array.from(
      { length: Math.max(0, endPage - startPage + 1) },
      (_, index) => startPage + index,
    );
  };

  return (
    <div className="overflow-hidden rounded-sm border border-gray-100 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-5 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-[#0446DB]" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pending Pickups
            </h2>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            Pending pickup orders requiring attention
          </p>
        </div>

        <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-300">
          {totalOrders} Pending
        </span>
      </div>

      {loading ? (
        <div className="flex min-h-[220px] items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-[#0446DB]" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[1050px] w-full">
            <thead className="bg-gray-50 dark:bg-neutral-950/70">
              <tr className="border-b border-gray-100 dark:border-neutral-800">
                {[
                  "Order Information",
                  "Order Type",
                  "Pickup",
                  "Delivery Address",
                  "Package Details",
                  "Status",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition hover:bg-gray-50/70 dark:hover:bg-neutral-800/50"
                  >
                    <td className="px-5 py-4 align-top">
                      <a
                        href={`${baseURL}/track-order?awb_number=${order.awb_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-[#0446DB] hover:underline"
                      >
                        {order.awb_number || order.orderno || "-"}
                      </a>
                      <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                        {formatDate(order.created_at)}
                      </p>
                      <p className="mt-1 max-w-[200px] truncate text-xs text-gray-400">
                        MOID: {order.merchant_order_id || "-"}
                      </p>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <div className="space-y-2">
                        <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold uppercase text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-300">
                          {order.order_type || "-"}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-neutral-400">
                          {order.order_specific || "-"}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <p className="text-sm font-medium text-gray-800 dark:text-neutral-200">
                        {order.pickup_contact_name || "-"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                        {order.pickup_city || "-"}, {order.pickup_state || "-"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.pickup_pincode || "-"}
                      </p>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <p className="text-sm font-medium text-gray-800 dark:text-neutral-200">
                        {order.delivery_contact_name || "-"}
                      </p>
                      <p className="mt-1 max-w-[250px] text-xs text-gray-500 dark:text-neutral-400">
                        {order.delivery_address_line || "-"}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {order.delivery_city || "-"}, {order.delivery_state || "-"}{" "}
                        - {order.delivery_pincode || "-"}
                      </p>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <p className="text-sm font-medium text-gray-800 dark:text-neutral-200">
                        {Number(order.total_weight || 0).toLocaleString()}g
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                        {order.package_length || "-"} × {order.package_breadth || "-"} ×{" "}
                        {order.package_height || "-"}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {order.number_of_boxes || 0} box
                        {Number(order.number_of_boxes || 0) === 1 ? "" : "es"}
                      </p>
                    </td>

                    <td className="px-5 py-4 align-top">
                      <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                        {statusLabel(order.status)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center">
                    <PackageOpen className="mx-auto h-9 w-9 text-gray-300 dark:text-neutral-600" />
                    <p className="mt-3 text-sm font-medium text-gray-500 dark:text-neutral-400">
                      No pending pickup orders found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalOrders > 0 && (
        <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-950/60 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500 dark:text-neutral-400">
            Showing {start + 1} to {Math.min(start + itemsPerPage, totalOrders)} of{" "}
            {totalOrders} orders
          </p>

          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded-sm border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            >
              Previous
            </button>

            {getPageNumbers().map((page) => (
              <button
                type="button"
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`min-w-8 rounded-sm border px-2.5 py-1.5 text-xs font-medium ${
                  currentPage === page
                    ? "border-[#0446DB] bg-[#0446DB] text-white"
                    : "border-gray-200 bg-white text-gray-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
              className="rounded-sm border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechMerchantAnalytics;

