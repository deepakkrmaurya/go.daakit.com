

import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import {
  FiRefreshCw,
  FiArrowRight,
  FiSearch,
  FiFilter,
  FiDownload,
  FiCopy,
  FiArrowDown,
  FiArrowUp,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiClock,
} from "react-icons/fi";
import { BsBank, BsCashStack } from "react-icons/bs";
import { HiOutlineClock } from "react-icons/hi";
import AxiosInstance from "../../Helper/axiosInstance";
import CustomButton from "../common/CustomButton";
import { Loader2 } from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;

export default function MerchantCOD() {
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [analytics, setAnalytics] = useState({});

  // Applied filters (used for API)
  const [appliedFilters, setAppliedFilters] = useState({
    searchTerm: "",
    startDate: "",
    endDate: "",
  });

  // Draft filters (used in the filter UI)
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filterRef = useRef(null);

  // ---------- API CALL ----------
  const getAnalytics = async (filters = appliedFilters) => {
    setLoading(true);
    try {
      const params = {};
      if (filters.startDate) params.start_date = filters.startDate;
      if (filters.endDate) params.end_date = filters.endDate;
      if (filters.searchTerm && filters.searchTerm.trim())
        params.utr_number = filters.searchTerm.trim();

      const res = await AxiosInstance.get(
        `${baseURL}/api/merchant/getMerchantRemittanceSummary`,
        {
          
          params,
        },
      );
      setAnalytics(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Error while fetching analytics",
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    getAnalytics(appliedFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close filter popup on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset page when applied filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  // ---------- APPLY / CLEAR FILTERS ----------
  const applyFilters = () => {
    if (startDate && endDate && endDate <= startDate) {
      toast.error("To Date must be after From Date");
      return;
    }
    const newFilters = { searchTerm, startDate, endDate };
    setAppliedFilters(newFilters);
    setShowFilters(false);
    getAnalytics(newFilters);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    const cleared = { searchTerm: "", startDate: "", endDate: "" };
    setAppliedFilters(cleared);
    getAnalytics(cleared);
  };

  // ---------- EXPORT ----------
  const handleExportRemittance = async (utrNumber) => {
    if (!utrNumber) {
      toast.error("UTR number is not available");
      return;
    }

    setExportLoading(true);

    try {
      const response = await AxiosInstance.get(
        `${baseURL}/api/merchant/exportMerchantRemittance`,
        {
          params: { utr_number: utrNumber },
          responseType: "blob",
         
        },
      );

      const contentType = response.headers["content-type"] || "";

      if (contentType.includes("application/json")) {
        const errorText = await response.data.text();
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || "Failed to export remittance");
      }

      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      const safeUtr = String(utrNumber).replace(/[^a-zA-Z0-9_-]/g, "_");

      link.href = downloadUrl;
      link.download = `merchant_remittance_${safeUtr}.csv`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Remittance CSV downloaded successfully.");
    } catch (error) {
      console.error("Export Merchant Remittance Error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to export merchant remittance",
      );
    } finally {
      setExportLoading(false);
    }
  };

  // ---------- FORMATTERS ----------
  const formatCurrency = (value) => {
    const num = Number(value) || 0;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatUpdatedTime = (date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ---------- DATA ----------
  const records = analytics?.remittance_records || [];
  const totalPaid = analytics?.total_paid_remittance_amount || 0;
  const futureRemittance = analytics?.remaining_cod_amount || 0;
  const totalCod = analytics?.total_cod || 0;

  const lastRemittance = {
    amount: analytics?.last_remitted_amount ?? 0,
    utr_number: analytics?.last_remitted_utr_number ?? "-",
    created_at: analytics?.last_remitted_at ?? null,
  };

  const nextExpectedCod = {
    count: analytics?.next_expected_cod?.count ?? 0,
    amount: analytics?.next_expected_cod?.collectable_amount ?? 0,
    deliveryDate: analytics?.next_expected_cod?.delivery_date ?? null,
    cycle: analytics?.next_expected_cod?.remittance_cycle ?? 0,
  };

  const sortedRecords = [...records].sort((a, b) => {
    if (sortConfig.key === "created_at") {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedRecords.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecords = sortedRecords.slice(indexOfFirstItem, indexOfLastItem);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const hasActiveFilters =
    appliedFilters.searchTerm ||
    appliedFilters.startDate ||
    appliedFilters.endDate;

      const [loadingPage, setLoadingPage] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setLoadingPage(false);
  }, 2000);

  return () => clearTimeout(timer);
}, []);

  return (
    <>
      {loading  || loadingPage? (
        <div className=" w-full h-[90vh] flex justify-center items-center">
           <div>
           <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2"> Loading Remittances Details...</p>
          </div>
         </div>
      ) : (
        <div className="min-h-screen w-full font-sans bg-[#F8F9FB]">
          {/* Blue Banner */}
          <div className="">
            <div className="mx-auto">
              <h1 className="text-xl sm:text-2xl font-bold dark:text-white">
                COD Remittance Dashboard
              </h1>
              <p className="dark:text-indigo-100 mt-1.5 md:mt-2 text-xs sm:text-sm md:text-base">
                Track settlements, payment batches and linked COD shipments.
              </p>
            </div>
          </div>

          <div className="mx-auto py-4">
            {/* Seller Account Info Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 md:mb-6 gap-3 md:gap-4">
              <div>
                <h2 className="text-[#2563EB] font-bold text-xs sm:text-sm tracking-wide uppercase mb-1">
                  Seller Account
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm break-all">
                  Acme Corp SELLER {analytics?.merchant_id}
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                <span className="text-gray-400 text-[11px] sm:text-sm">
                  Updated: {formatUpdatedTime(lastUpdated)}
                </span>

                <CustomButton
                variant = "outline"
                onClick={() => getAnalytics(appliedFilters)}
                  disabled={loading}
                  icon = {FiRefreshCw}
                >
                  Refresh
                </CustomButton>
                {/* <button
                  onClick={() => getAnalytics(appliedFilters)}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer"
                >
                  <FiRefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button> */}
              </div>
            </div>

            {/* Cards Grid - 5 Cards (responsive) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
              {/* Card 1: Total COD */}
              <div className="bg-white border border-blue-100 rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[150px] sm:min-h-[190px] shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-[#0446DB] font-bold mb-3 text-base sm:text-[20px]">
                    <BsCashStack className="w-4 h-4" />
                    Total COD
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-[#0446DB] mb-2 break-words">
                    {formatCurrency(totalCod)}
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Overall COD amount
                  </p>
                </div>
              </div>

              {/* Card 2: Total Paid */}
              <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[150px] sm:min-h-[190px]">
                <div>
                  <div className="flex items-center gap-2 text-[#16A34A] font-bold mb-3 text-base sm:text-[20px]">
                    <BsBank className="w-4 h-4" />
                    Total Paid
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-[#16A34A] mb-2 break-words">
                    {formatCurrency(totalPaid)}
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Remitted to you
                  </p>
                </div>
              </div>

              {/* Card 3: Future Remittance */}
              <div className="bg-[#FFFCEB] border border-[#FEF3C7] rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[150px] sm:min-h-[190px]">
                <div>
                  <div className="flex items-center gap-2 text-[#D97706] font-bold mb-3 text-base sm:text-[20px]">
                    <HiOutlineClock className="w-4 h-4" />
                    Future Remittance
                  </div>
                  <p className="text-gray-500 text-[11px] sm:text-xs mb-1">
                    No UTR generated yet
                  </p>
                  <div className="text-lg sm:text-xl font-bold text-[#D97706] mb-2 break-words">
                    {formatCurrency(futureRemittance)}
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Pending settlement
                  </p>
                </div>
              </div>

              {/* Card 4: Last Remittance */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[150px] sm:min-h-[190px] shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-[#0446DB] font-bold mb-3 text-base sm:text-[20px]">
                    <FiArrowRight className="w-4 h-4" />
                    Last Remittance
                  </div>
                  {lastRemittance.created_at ? (
                    <>
                      <p className="text-gray-500 text-[11px] sm:text-xs mb-1">
                        {formatDate(lastRemittance.created_at)}
                      </p>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                          {formatCurrency(lastRemittance.amount)}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-gray-500 truncate">
                        UTR:{" "}
                        <span className="text-gray-800">
                          {lastRemittance.utr_number}
                        </span>
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-400 text-xs sm:text-sm">
                      No recent remittance
                    </p>
                  )}
                </div>
              </div>

              {/* Card 5: Next Expected COD */}
              <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[150px] sm:min-h-[190px]">
                <div>
                  <div className="flex items-center gap-2 text-[#2563EB] font-bold mb-3 text-base sm:text-[20px]">
                    <FiClock className="w-4 h-4" />
                    Next Expected COD
                  </div>
                  <p className="text-gray-500 text-[11px] sm:text-xs mb-1">
                    {nextExpectedCod.deliveryDate
                      ? `Expected: ${formatDate(nextExpectedCod.deliveryDate)}`
                      : "No delivery scheduled"}
                  </p>
                  <div className="text-lg sm:text-xl font-bold text-[#2563EB] mb-2 break-words">
                    {formatCurrency(nextExpectedCod.amount)}
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm mb-1">
                    Orders:{" "}
                    <span className="text-[#1E293B] font-bold text-sm sm:text-base">
                      {nextExpectedCod.count}
                    </span>
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Cycle:{" "}
                    <span className="text-[#1E293B] font-semibold">
                      {nextExpectedCod.cycle}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div>
              <div className="flex flex-row justify-between items-center mb-4 gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Remittance History
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {records.length} payment batches
                  </p>
                </div>

                {/* Filter button — right aligned on all screens */}
                <div className="relative" ref={filterRef}>
                  <button
                    onClick={() => setShowFilters((prev) => !prev)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                      showFilters
                        ? "bg-blue-100 text-blue-700"
                        : "bg-[#EEF2F6] text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <FiFilter /> Filters
                    {hasActiveFilters && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 ml-1"></span>
                    )}
                  </button>

                  {showFilters && (
                    <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-xs sm:w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-800">
                          Filter Records
                        </h3>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          <FiX />
                        </button>
                      </div>

                      <div className="space-y-4">
                        {/* Search Bar */}
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Search by UTR
                          </label>
                          <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                              placeholder="Enter UTR number..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") applyFilters();
                              }}
                              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* Date Range */}
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            From Date
                          </label>
                          <input
                            type="date"
                            value={startDate}
                            max={endDate || undefined}
                            onChange={(e) => {
                              const newStart = e.target.value;
                              setStartDate(newStart);

                              if (endDate && newStart && endDate <= newStart) {
                                setEndDate("");
                              }
                            }}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
                          />
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            To Date
                          </label>
                          <input
                            type="date"
                            value={endDate}
                            min={startDate || undefined}
                            disabled={!startDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            placeholder={
                              !startDate ? "Select From Date first" : ""
                            }
                            className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                              !startDate
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : ""
                            }`}
                          />
                          {!startDate && (
                            <p className="text-[11px] text-gray-400 mt-1">
                              Please select From Date first
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-5">
                        <button
                          onClick={clearFilters}
                          className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                        >
                          Clear
                        </button>
                        <button
                          onClick={applyFilters}
                          className="flex-1 py-2 text-sm font-medium text-white bg-[#0446DB] hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Table Container */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="bg-[#F8F9FB] border-b border-gray-200 text-[#64748B] text-[11px] uppercase tracking-wider font-semibold">
                        <th
                          className="px-3 sm:px-6 py-3 sm:py-4 flex items-center gap-1 cursor-pointer hover:text-gray-900 transition-colors select-none"
                          onClick={() => handleSort("created_at")}
                        >
                          Remittance Date
                          {sortConfig.key === "created_at" &&
                          sortConfig.direction === "asc" ? (
                            <FiArrowUp className="w-3 h-3 text-blue-600" />
                          ) : (
                            <FiArrowDown
                              className={`w-3 h-3 ${
                                sortConfig.key === "created_at"
                                  ? "text-blue-600"
                                  : ""
                              }`}
                            />
                          )}
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          COD Collected
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                          Freight Deduction
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                          Convenience Fee
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                          Remitted to You
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          UTR Number
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-center whitespace-nowrap">
                          Shipments
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-center whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {currentRecords.map((record, idx) => {
                        const shipmentCount = Number(record.awb_count) || 0;
                        const freight = Number(record.freight_deductions) || 0;
                        const convenience = Number(record.convenience_fee) || 0;

                        return (
                          <tr
                            key={record.utr_number || idx}
                            className="hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-800 whitespace-nowrap">
                              {formatDate(record.created_at)}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                              {formatCurrency(record.amount)}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm whitespace-nowrap text-right">
                              
                                <span className="text-red-600 font-medium">
                                  {formatCurrency(freight)}
                                </span>
                             
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm whitespace-nowrap text-right">
                              
                                <span className="text-red-600 font-medium">
                                  {formatCurrency(convenience)}
                                 </span>
                             
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap text-right">
                              {formatCurrency(record.remittance_amount)}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {record.utr_number || "-"}
                                {record.utr_number && (
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        record.utr_number,
                                      );
                                      toast.success("UTR copied!");
                                    }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                  >
                                    <FiCopy className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 text-center">
                              {shipmentCount}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                              <button
                                onClick={() =>
                                  handleExportRemittance(record.utr_number)
                                }
                                disabled={exportLoading}
                                title="Download Remittance CSV"
                                className="p-2 text-[#0446DB] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 border-2"
                              >
                                <FiDownload className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {currentRecords.length === 0 && (
                        <tr>
                          <td
                            colSpan="8"
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            No records match your current filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-3 sm:px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50">
                    <span className="text-xs sm:text-sm text-gray-500">
                      Showing{" "}
                      <span className="font-medium">
                        {indexOfFirstItem + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(indexOfLastItem, sortedRecords.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {sortedRecords.length}
                      </span>{" "}
                      entries
                    </span>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <FiChevronLeft className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1,
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center transition-colors cursor-pointer ${
                              currentPage === page
                                ? "bg-[#0446DB] text-white"
                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <FiChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
