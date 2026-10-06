
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  FaBoxOpen,
  FaClock,
  FaCheckCircle,
  FaPlayCircle,
  FaPaperPlane,
} from "react-icons/fa";

import {
  MdPeople,
  MdVerified,
  MdDirectionsBike,
  MdEventAvailable,
} from "react-icons/md";

import {
  CalendarDays,
  ChevronDown,
  Loader2,
} from "lucide-react";

import axiosInstance from "../../Helper/axiosInstance";

const baseURL = import.meta.env.VITE_BASE_URL;

export default function VendorAnalytics() {
  /* =====================================================
      STATE
  ====================================================== */

  const [loading, setLoading] = useState(false);

  const [analytics, setAnalytics] = useState({});
  const [analytics2, setAnalytics2] = useState({});

  const [selected, setSelected] = useState("Last 30 Days");

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

  /* =====================================================
      GET ANALYTICS
  ====================================================== */

  const getAnalytics = async () => {
    setLoading(true);

    try {
      const res = await axiosInstance.get(
        `${baseURL}/api/vendor/getVendorDeliveredAndPendingCodSummary`,
        {
          params: advanceFilters,

          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setCustomStartDate(advanceFilters.start_date);
      setCustomEndDate(advanceFilters.end_date);

      setAnalytics(res.data);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while fetching order analytics",
      );
    }

    try {
      const res = await axiosInstance.get(
        `${baseURL}/api/vendor/getVendorRidersSummary`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setAnalytics2(res.data);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while fetching rider analytics",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
      DATE FILTER
  ====================================================== */

  const handleSelect = (value) => {
    setSelected(value);

    if (value === "Custom Range") {
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

  /* =====================================================
      CUSTOM DATE RANGE
  ====================================================== */

  const handleCustomRange = (e) => {
    e.preventDefault();

    if (!customStartDate || !customEndDate) {
      toast.error("Please select start and end date");
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

  /* =====================================================
      OPEN DATE PICKER
  ====================================================== */

  const openDatePicker = (e) => {
    try {
      e.currentTarget.showPicker?.();
    } catch {
      return;
    }
  };

  /* =====================================================
      USE EFFECT
  ====================================================== */

  useEffect(() => {
    getAnalytics();
  }, [advanceFilters]);

  /* =====================================================
      HELPER
  ====================================================== */

  const calculatePercentage = (value, total) => {
    const currentValue = Number(value) || 0;
    const totalValue = Number(total) || 0;

    if (totalValue <= 0) {
      return 0;
    }

    const result = Math.round((currentValue / totalValue) * 100);

    return Math.min(Math.max(result, 0), 100);
  };

  /* =====================================================
      CARD DATA
  ====================================================== */

  const cards = [
    {
      title: "Total Orders Delivered",
      value: analytics?.totalDeliveredOrders ?? 0,

      rateLabel: "Completion Rate",

      percentage: 100,

      icon: FaBoxOpen,

      iconClass:
        "bg-[#DFE5FF] text-[#5147FF] dark:bg-indigo-950/50 dark:text-indigo-400",

      progressClass: "bg-[#2448E8]",

      percentageClass: "text-[#2448E8]",
    },

    {
      title: "Total Riders",
      value: analytics2?.totalRiders ?? 0,

      rateLabel: "Registered Riders",

      percentage: 100,

      icon: MdPeople,

      iconClass:
        "bg-[#E3E8FF] text-[#5147FF] dark:bg-indigo-950/50 dark:text-indigo-400",

      progressClass: "bg-[#5147FF]",

      percentageClass: "text-[#5147FF]",
    },

    {
      title: "KYC Verified Riders",
      value: analytics2?.kycverifiedRiders ?? 0,

      rateLabel: "Verification Rate",

      percentage: calculatePercentage(
        analytics2?.kycverifiedRiders,
        analytics2?.totalRiders,
      ),

      icon: MdVerified,

      iconClass:
        "bg-[#D9F8E5] text-[#00A94F] dark:bg-emerald-950/40 dark:text-emerald-400",

      progressClass: "bg-[#00B95C]",

      percentageClass: "text-[#00A94F]",
    },

    {
      title: "Active Riders",
      value: analytics2?.activeRiders ?? 0,

      rateLabel: "Active Rate",

      percentage: calculatePercentage(
        analytics2?.activeRiders,
        analytics2?.totalRiders,
      ),

      icon: MdDirectionsBike,

      iconClass:
        "bg-[#D9F8E5] text-[#00A94F] dark:bg-emerald-950/40 dark:text-emerald-400",

      progressClass: "bg-[#00B95C]",

      percentageClass: "text-[#00A94F]",
    },

    {
      title: "COD Submitted",
      value: analytics?.codSummary?.received ?? 0,

      rateLabel: "Submitted",

      percentage: 100,

      icon: FaPaperPlane,

      iconClass:
        "bg-[#DFE5FF] text-[#5147FF] dark:bg-indigo-950/50 dark:text-indigo-400",

      progressClass: "bg-[#5147FF]",

      percentageClass: "text-[#5147FF]",
    },

    {
      title: "COD Pending",
      value: analytics?.codSummary?.pending ?? 0,

      rateLabel: "Pending",

      percentage: 25,

      icon: FaClock,

      iconClass:
        "bg-[#FFF0C4] text-[#F27A00] dark:bg-amber-950/40 dark:text-amber-400",

      progressClass: "bg-[#FF8700]",

      percentageClass: "text-[#F27A00]",
    },

    {
      title: "COD Initiated",
      value: analytics?.codSummary?.initiated ?? 0,

      rateLabel: "Initiated",

      percentage: 65,

      icon: FaPlayCircle,

      iconClass:
        "bg-[#D9F8E5] text-[#00A94F] dark:bg-emerald-950/40 dark:text-emerald-400",

      progressClass: "bg-[#00B95C]",

      percentageClass: "text-[#00A94F]",
    },

    {
      title: "COD Adjusted",
      value: analytics?.codSummary?.adjusted ?? 0,

      rateLabel: "Adjusted",

      percentage: 80,

      icon: FaCheckCircle,

      iconClass:
        "bg-[#FFDCDC] text-[#EF1B24] dark:bg-red-950/40 dark:text-red-400",

      progressClass: "bg-[#EF1B24]",

      percentageClass: "text-[#EF1B24]",
    },

    {
      title: "Available Riders",
      value: analytics2?.availableRiders ?? 0,

      rateLabel: "Availability Rate",

      percentage: calculatePercentage(
        analytics2?.availableRiders,
        analytics2?.totalRiders,
      ),

      icon: MdEventAvailable,

      iconClass:
        "bg-[#FFF0C4] text-[#F27A00] dark:bg-amber-950/40 dark:text-amber-400",

      progressClass: "bg-[#F27A00]",

      percentageClass: "text-[#F27A00]",
    },
  ];

  /* =====================================================
      LOADER
  ====================================================== */

  if (loading) {
    return (
      <div className="flex h-[90vh] w-full items-center justify-center bg-[#F7F8FA] dark:bg-neutral-950">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#0446DB]" />

          <p className="mt-3 text-sm font-medium text-neutral-600 dark:text-neutral-300">
            Loading Analytics Dashboard...
          </p>

          <p className="mt-1 text-xs text-neutral-400">
            Fetching latest dashboard data
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
      UI
  ====================================================== */

  return (
    <div className="min-h-screen w-full bg-[#F5F6F8] dark:bg-neutral-950">
      {/* =================================================
          BLUE HEADER
      ================================================== */}

      <div className="py-3">
        <div className="mx-auto flex w-full flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          {/* HEADING */}

          <div>
            <h1 className="text-2xl font-semibold dark:text-white sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-1 text-sm  dark:text-neutral-400">
              Track orders, COD remittance and rider performance.
            </p>
          </div>

          {/* DATE FILTER */}

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
            <div className="w-full sm:w-[220px]">
              <label className="mb-1.5 block text-xs font-medium  dark:text-neutral-300">
                Filter by Date
              </label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                <select
                  value={selected}
                  onChange={(e) => handleSelect(e.target.value)}
                  className="
                    h-10
                    w-full
                    cursor-pointer
                    appearance-none
                    rounded-sm
                    border
                    border-white/30
                    bg-white
                    pl-9
                    pr-9
                    text-sm
                    font-medium
                    text-neutral-700
                    outline-none
                    transition
                    focus:border-white
                    focus:ring-2
                    focus:ring-white/20
                    dark:border-neutral-700
                    dark:bg-neutral-800
                    dark:text-neutral-200
                  "
                >
                  <option>Today</option>

                  <option>Yesterday</option>

                  <option>Last 7 Days</option>

                  <option>Last 30 Days</option>

                  <option>This Month</option>

                  <option>Last Month</option>

                  <option>Custom Range</option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              </div>
            </div>
          </div>
        </div>

        {/* ===============================================
            CUSTOM RANGE
        ================================================ */}

        {selected === "Custom Range" && (
          <form
            onSubmit={handleCustomRange}
            className="
              mt-5
              flex
              flex-col
              gap-3
              rounded-sm
              border
              border-white/20
              bg-white/10
              p-4
              md:flex-row
              md:items-end
            "
          >
            {/* START DATE */}

            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium dark:text-blue-100">
                Start Date
              </label>

              <input
                type="date"
                value={customStartDate}
                max={customEndDate || undefined}
                onClick={openDatePicker}
                onFocus={openDatePicker}
                onChange={(e) => {
                  const newStart = e.target.value;

                  setCustomStartDate((prev) => {
                    if (customEndDate < newStart) {
                      setCustomEndDate(newStart);

                      return newStart;
                    }

                    return newStart;
                  });
                }}
                className="
                  h-10
                  w-full
                  cursor-pointer
                  rounded-sm
                  border
                  border-white/30
                  bg-white
                  px-3
                  text-sm
                  text-neutral-700
                  outline-none
                  focus:border-white
                  focus:ring-2
                  focus:ring-white/20
                  dark:border-neutral-700
                  dark:bg-neutral-800
                  dark:text-neutral-200
                "
              />
            </div>

            {/* END DATE */}

            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium dark:text-blue-100">
                End Date
              </label>

              <input
                type="date"
                value={customEndDate}
                min={customStartDate || undefined}
                onClick={openDatePicker}
                onFocus={openDatePicker}
                onChange={(e) => {
                  const newEnd = e.target.value;

                  setCustomEndDate((prev) => {
                    if (customStartDate > newEnd) {
                      setCustomStartDate(newEnd);

                      return newEnd;
                    }

                    return newEnd;
                  });
                }}
                className="
                  h-10
                  w-full
                  cursor-pointer
                  rounded-sm
                  border
                  border-white/30
                  bg-white
                  px-3
                  text-sm
                  text-neutral-700
                  outline-none
                  focus:border-white
                  focus:ring-2
                  focus:ring-white/20
                  dark:border-neutral-700
                  dark:bg-neutral-800
                  dark:text-neutral-200
                "
              />
            </div>

            {/* APPLY */}

            <button
              type="submit"
              className="
                inline-flex
                h-10
                shrink-0
                items-center
                justify-center
                rounded-sm
                bg-white
                px-6
                text-sm
                font-semibold
                text-[#0446DB]
                transition
                hover:bg-blue-50
              "
            >
              Apply Filter
            </button>
          </form>
        )}
      </div>

      {/* =================================================
          KPI CARDS
      ================================================== */}

      <main className="">
        <div
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={`${card.title}-${index}`}
                className="
                  group
                  min-w-0
                  rounded-[20px]
                  border
                  border-neutral-200/80
                  bg-white
                  px-6
                  py-5
                  shadow-[0_8px_20px_rgba(15,23,42,0.10)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_12px_28px_rgba(15,23,42,0.14)]
                  dark:border-neutral-800
                  dark:bg-neutral-900
                "
              >
                {/* =====================================
                    TOP
                ====================================== */}

                <div className="flex items-start justify-between gap-4">
                  {/* TITLE + VALUE */}

                  <div className="min-w-0 flex-1">
                    <h3
                      className="
                        truncate
                        text-[17px]
                        font-semibold
                        leading-6
                        text-[#27364B]
                        dark:text-neutral-200
                      "
                      title={card.title}
                    >
                      {card.title}
                    </h3>

                    <p
                      className="
                        mt-1
                        text-[34px]
                        font-bold
                        leading-none
                        tracking-[-1.5px]
                        text-black
                        dark:text-white
                      "
                    >
                      {Number(card.value || 0).toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* ICON */}

                  <div
                    className={`
                      flex
                      h-[60px]
                      w-[60px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-[17px]
                      ${card.iconClass}
                    `}
                  >
                    <Icon className="text-[24px]" />
                  </div>
                </div>

                {/* =====================================
                    RATE
                ====================================== */}

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="truncate text-[14px] font-medium text-[#3C4A5F] dark:text-neutral-400">
                      {card.rateLabel}
                    </span>

                    <span
                      className={`
                        shrink-0
                        text-[14px]
                        font-bold
                        ${card.percentageClass}
                      `}
                    >
                      {card.percentage}%
                    </span>
                  </div>

                  {/* ===================================
                      PROGRESS
                  ==================================== */}

                  {/* <div className="h-[9px] w-full overflow-hidden rounded-full bg-[#E1E3E7] dark:bg-neutral-700">
                    <div
                      className={`
                        h-full
                        rounded-full
                        transition-all
                        duration-700
                        ${card.progressClass}
                      `}
                      style={{
                        width: `${card.percentage}%`,
                      }}
                    />
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>

        
      </main>
    </div>
  );
}