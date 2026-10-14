
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
  FiUpload,
  FiChevronDown,
  FiCheck,
} from "react-icons/fi";
import { BsBank, BsCashStack } from "react-icons/bs";
import { HiOutlineClock } from "react-icons/hi";

const baseURL = import.meta.env.VITE_BASE_URL;
const PAGE_PASSWORD = "DaakitFinance@30092026#0212";
const PAGE_UNLOCK_KEY = "merchant_remittance_unlocked_at";
const PAGE_UNLOCK_TIME = 5 * 60 * 1000;
import AxiosInstance from "@/Helper/axiosInstance";
import CustomButton from "../common/CustomButton.jsx";
import { ArrowLeft, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MerchantRemittances() {
  const navigate = useNavigate();
  const [isMerchantOpen, setIsMerchantOpen] = useState(false);
  const [merchantSearch, setMerchantSearch] = useState("");
  const merchantRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [rowExportLoading, setRowExportLoading] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("history");
  const [allMerchants, setAllMerchants] = useState([]);
  const [merchant, setMerchant] = useState("");
  const [stats, setStats] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const [advanceFilters, setAdvanceFilters] = useState({
    startDate: "",
    endDate: "",
    awb_number: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    startDate: "",
    endDate: "",
    awb_number: "",
  });

  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });



  const [isPageUnlocked, setIsPageUnlocked] = useState(false);
  const [pagePassword, setPagePassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPagePassword, setShowPagePassword] = useState(false);
  
  useEffect(() => {
    const checkPageLock = () => {
      const unlockedAt = Number(
        sessionStorage.getItem(PAGE_UNLOCK_KEY) || 0
      );
  
      const isValid =
        unlockedAt > 0 &&
        Date.now() - unlockedAt < PAGE_UNLOCK_TIME;
  
      if (isValid) {
        setIsPageUnlocked(true);
      } else {
        sessionStorage.removeItem(PAGE_UNLOCK_KEY);
        setIsPageUnlocked(false);
      }
    };
  
    checkPageLock();
  
    const interval = setInterval(checkPageLock, 1000);
  
    return () => clearInterval(interval);
  }, []);

  const handlePageUnlock = (e) => {
  e.preventDefault();

  if (pagePassword !== PAGE_PASSWORD) {
    setPasswordError("Incorrect password. Please try again.");
    return;
  }

  sessionStorage.setItem(
    PAGE_UNLOCK_KEY,
    String(Date.now())
  );

  setIsPageUnlocked(true);
  setPagePassword("");
  setPasswordError("");
};

  const filteredMerchants = allMerchants.filter((mch) => {
    const q = merchantSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      String(mch.id).toLowerCase().includes(q) ||
      (mch.name || "").toLowerCase().includes(q) ||
      (mch.email || "").toLowerCase().includes(q)
    );
  });

  const selectedMerchant = allMerchants.find(
    (m) => String(m.id) === String(merchant),
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (merchantRef.current && !merchantRef.current.contains(event.target)) {
        setIsMerchantOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getMerchants = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get(
        `${baseURL}/api/admin/getAllMerchants`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setAllMerchants(res.data.merchants);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Error fetching merchants",
      );
    } finally {
      setLoading(false);
    }
  };

  const getMerchantStats = async (id, filters = appliedFilters) => {
    const merchantId = id || merchant;
    setMerchant(merchantId);
    setLoading(true);
    try {
      const res = await AxiosInstance.get(
        `${baseURL}/api/admin/getMerchantRemittanceSummary/${merchantId}`,
        {
          params: {
            start_date: filters.startDate,
            end_date: filters.endDate,
            awb_numbers: filters.awb_number,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setStats(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Error while fetching the merchant's stat",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    try {
      await AxiosInstance.post(
        `${baseURL}/api/admin/uploadMerchantRemittance`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      toast.success("File uploaded successfully");
      getMerchants();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Error while uploading file",
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadMerchantRemittanceSampleFile = async () => {
    try {
      const res = await AxiosInstance.get(
        `${baseURL}/api/admin/downloadMerchantRemittanceSampleFile`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "RemittanceSampleFile.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error("Failed to download sample file");
    }
  };

  const handleExportNextExpected = async () => {
    if (!merchant) {
      toast.error("Please select a merchant first");
      return;
    }

    setExportLoading(true);
    try {
      const res = await AxiosInstance.get(
        `${baseURL}/api/admin/exportNextExpectedRemittance/${merchant}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const contentType = res.headers["content-type"] || "";
      if (contentType.includes("application/json")) {
        const text = await res.data.text();
        const errData = JSON.parse(text);
        throw new Error(errData.message || "Export failed");
      }

      const blob = new Blob([res.data], {
        type: "text/csv;charset=utf-8;",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `next_expected_remittance_${merchant}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Export downloaded successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to export next expected remittance",
      );
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportRemittanceByUtr = async (utrNumber) => {
    if (!merchant) {
      toast.error("Please select a merchant first");
      return;
    }
    if (!utrNumber) {
      toast.error("UTR number is missing for this record");
      return;
    }

    setRowExportLoading(utrNumber);
    try {
      const res = await AxiosInstance.get(
        `${baseURL}/api/admin/exportMerchantRemittance`,
        {
          params: {
            merchant_id: merchant,
            utr_number: utrNumber,
          },
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const contentType = res.headers["content-type"] || "";
      if (contentType.includes("application/json")) {
        const text = await res.data.text();
        const errData = JSON.parse(text);
        throw new Error(errData.message || "Export failed");
      }

      const blob = new Blob([res.data], {
        type: "text/csv;charset=utf-8;",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      const safeUtr = String(utrNumber).replace(/[^a-zA-Z0-9_-]/g, "_");

      link.href = url;
      link.download = `merchant_${merchant}_remittance_${safeUtr}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Remittance CSV downloaded successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to export remittance",
      );
    } finally {
      setRowExportLoading(null);
    }
  };

  const setInitialDefaultFilters = () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const defaults = {
      endDate: today.toISOString().split("T")[0],
      startDate: oneMonthAgo.toISOString().split("T")[0],
      awb_number: "",
    };
    setAdvanceFilters(defaults);
    setAppliedFilters(defaults);
  };

  useEffect(() => {
    setInitialDefaultFilters();
  }, []);

  const applyFilters = () => {
    setAppliedFilters(advanceFilters);
    setIsFilterOpen(false);
    if (merchant) {
      getMerchantStats(merchant, advanceFilters);
    }
  };

  const clearFilters = () => {
    const blank = { startDate: "", endDate: "", awb_number: "" };
    setAdvanceFilters(blank);
    setAppliedFilters(blank);
    setIsFilterOpen(false);
    if (merchant) {
      getMerchantStats(merchant, blank);
    }
  };

  const openPopUp = (remittance) => setPopupData(remittance);
  const closePopUp = () => setPopupData(null);

  useEffect(() => {
    getMerchants();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters, merchant]);

  const formatCurrency = (value) => {
    const num = Number(value) || 0;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatUpdatedTime = (date) =>
    date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const records = stats?.remittance_records || [];
  const totalCod = stats?.total_cod || 0;
  const remainingCod = stats?.remaining_cod_amount || 0;
  const totalPaid = stats?.total_paid_remittance_amount || 0;

  const lastRemittance = {
    amount: stats?.last_remitted_amount ?? 0,
    utr: stats?.last_remitted_utr_number ?? "-",
    at: stats?.last_remitted_at ?? null,
  };

  const nextExpectedCod = {
    count: stats?.next_expected_cod?.count ?? 0,
    amount: stats?.next_expected_cod?.collectable_amount ?? 0,
    deliveryDate: stats?.next_expected_cod?.delivery_date ?? null,
    cycle: stats?.next_expected_cod?.remittance_cycle ?? 0,
  };

  const sortedRecords = [...records].sort((a, b) => {
    if (sortConfig.key === "created_at") {
      const a1 = new Date(a.created_at).getTime();
      const b1 = new Date(b.created_at).getTime();
      return sortConfig.direction === "asc" ? a1 - b1 : b1 - a1;
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
    appliedFilters.startDate ||
    appliedFilters.endDate ||
    appliedFilters.awb_number;



      const [loadingPage, setLoadingPage] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setLoadingPage(false);
  }, 2000);

  return () => clearTimeout(timer);
}, []);

  return (
    <>


    <AlertDialog open={!isPageUnlocked}>
      <AlertDialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="w-[calc(100%-32px)] max-w-[400px] rounded-sm border border-gray-200 bg-white p-0 shadow-xl dark:border-gray-700 dark:bg-gray-900"
      >
        <div className="p-6">
          <AlertDialogHeader className="flex flex-col items-center text-center">
            
    <div className="relative mb-4 flex w-full items-center ">
      {/* Lock Icon - Center */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
        <LockKeyhole className="h-5 w-5" />
      </div>
    
      {/* Back Button - Right */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute right-0 flex items-center gap-1.5
          rounded-sm px-2 py-1.5 text-sm font-medium
          text-gray-600 transition-colors
          hover:bg-blue-50 hover:text-[#0446DB]
          dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
    </div>
    
    
            <AlertDialogTitle className="text-center text-xl font-semibold text-gray-900 dark:text-white">
              Verify Access
            </AlertDialogTitle>
    
            <AlertDialogDescription className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
              Enter your password to access Remittances
            </AlertDialogDescription>
          </AlertDialogHeader>
    
          <form onSubmit={handlePageUnlock} className="mt-6">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
    
            <div className="relative">
              <input
                type={showPagePassword ? "text" : "password"}
                value={pagePassword}
                onChange={(e) => {
                  setPagePassword(e.target.value);
                  setPasswordError("");
                }}
                autoFocus
                autoComplete="off"
                placeholder="Enter access password"
                className={`h-11 w-full rounded-sm border bg-white px-3 pr-11 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 dark:bg-gray-800 dark:text-white ${
                  passwordError
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                    : "border-gray-300 focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700"
                }`}
              />
    
              <button
                type="button"
                onClick={() => setShowPagePassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-200"
              >
                {showPagePassword ? (
                  <EyeOff className="h-[18px] w-[18px]" />
                ) : (
                  <Eye className="h-[18px] w-[18px]" />
                )}
              </button>
            </div>
    
            {passwordError && (
              <p className="mt-2 text-xs font-medium text-red-500">
                {passwordError}
              </p>
            )}
    
            <button
              type="submit"
              disabled={!pagePassword.trim()}
              className="mt-5 h-11 w-full rounded-sm bg-[#0446DB] text-sm font-medium text-white transition-colors hover:bg-[#0339b5] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
    
            <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
              Access expires automatically after 5 minutes
            </p>
          </form>
        </div>
      </AlertDialogContent>
        </AlertDialog>
      {loading || loadingPage ? (
         <div className=" w-full h-[90vh] flex justify-center items-center">
          <div>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
           <p className="mt-2"> Loading Merchant Remittances Details...</p>
           </div>
        </div>
      ) : (
        <div className="min-h-screen w-full font-sans bg-[#F8F9FB]">
          <div className="">
            <div className="mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold dark:text-white">
                  Merchant Remittances
                </h1>
                <p className="dark:text-indigo-100 mt-1 text-xs sm:text-sm md:text-base">
                  Track settlements, payment batches and linked COD shipments.
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="dark:text-white/90 text-[11px] sm:text-sm">
                  Updated: {formatUpdatedTime(lastUpdated)}
                </span>
                <CustomButton
                variant='outline'
                icon = {FiRefreshCw}
                
                  onClick={() => merchant && getMerchantStats(merchant)}
                  disabled={loading || !merchant}
                >
                       Refresh
                </CustomButton>

                {/* <button
                  onClick={() => merchant && getMerchantStats(merchant)}
                  disabled={loading || !merchant}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white text-gray-700 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer hover:bg-gray-100"
                >
                  <FiRefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button> */}
              </div>
            </div>
          </div>

          <div className="mx-auto py-4">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-4 sm:mb-6 gap-3">
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                <button
                  onClick={() => setSelectedStatus("history")}
                  className={`px-3 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-medium shadow-sm transition-all cursor-pointer ${
                    selectedStatus === "history"
                      ? "bg-[#0446DB] text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Remittance History
                </button>
                <button
                  onClick={() => setSelectedStatus("upload")}
                  className={`px-3 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-medium shadow-sm transition-all cursor-pointer ${
                    selectedStatus === "upload"
                      ? "bg-[#0446DB] text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  ⬆ Upload Remittance
                </button>
                <button
                  onClick={downloadMerchantRemittanceSampleFile}
                  className="col-span-2 sm:col-span-1 bg-white text-[#0446DB] font-semibold text-xs sm:text-sm px-3 sm:px-5 py-2 rounded-xl shadow hover:bg-indigo-50 transition cursor-pointer"
                >
                  ⬇ Sample CSV
                </button>
              </div>
            </div>

            {selectedStatus === "upload" && (
              <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
                <label
                  htmlFor="remittance-file"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add("bg-blue-50/50");
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove("bg-blue-50/50");
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("bg-blue-50/50");
                    const droppedFile = e.dataTransfer.files?.[0];
                    if (droppedFile) {
                      handleChange({ target: { files: [droppedFile] } });
                    }
                  }}
                  className="flex flex-col items-center justify-center text-center border-2 border-dashed border-[#2563EB] rounded-xl px-4 sm:px-6 py-10 sm:py-12 cursor-pointer transition-colors hover:bg-blue-50/40"
                >
                  <div className="mb-3 text-[#2563EB]">
                    <FiUpload className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <p className="text-sm sm:text-base md:text-lg text-gray-800 font-semibold mb-1">
                    Remittance File
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-400 mt-1">
                    Only .csv files are accepted
                  </p>
                  <input
                    id="remittance-file"
                    type="file"
                    name="bulk_remittance"
                    onChange={handleChange}
                    accept=".csv"
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {selectedStatus === "history" && (
              <>
                {/* <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 mb-5">
                  {allMerchants?.length > 0 ? (
                    <div>
                      <label className="block text-xs font-bold text-[#2563EB] uppercase tracking-wide mb-2">
                        Select Merchant
                      </label>
                      <select
                        required
                        value={merchant}
                        onChange={(e) => getMerchantStats(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0446DB]/40 focus:border-[#0446DB]"
                      >
                        <option value="" disabled>
                          -- Choose a merchant --
                        </option>
                        {allMerchants.map((mch) => (
                          <option key={mch.id} value={mch.id}>
                            {mch.name} - {mch.email}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4 text-sm">
                      No merchant registered
                    </div>
                  )}
                </div> */}

                <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 mb-5">
                  {allMerchants?.length > 0 ? (
                    <div ref={merchantRef} className="relative">
                      <label className="block text-xs font-bold text-[#2563EB] uppercase tracking-wide mb-2">
                        Select Merchant
                      </label>

                      {/* Trigger */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsMerchantOpen((p) => !p);
                          setMerchantSearch("");
                        }}
                        className={`w-full flex items-center justify-between gap-3 px-3 sm:px-4 py-2.5 bg-gray-50 border rounded-xl text-sm text-left transition-colors cursor-pointer ${
                          isMerchantOpen
                            ? "border-[#0446DB] ring-2 ring-[#0446DB]/30"
                            : "border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {selectedMerchant ? (
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-[#0446DB] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {(selectedMerchant.name || "?")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {selectedMerchant.name}
                              </p>
                              <p className="text-[11px] text-gray-500 truncate">
                                #{selectedMerchant.id} ·{" "}
                                {selectedMerchant.email}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">
                            -- Choose a merchant --
                          </span>
                        )}
                        <FiChevronDown
                          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${
                            isMerchantOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Dropdown */}
                      {isMerchantOpen && (
                        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                          {/* Search bar */}
                          <div className="p-2 border-b border-gray-100">
                            <div className="relative">
                              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                autoFocus
                                type="text"
                                value={merchantSearch}
                                onChange={(e) =>
                                  setMerchantSearch(e.target.value)
                                }
                                placeholder="Search by name, email or ID..."
                                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0446DB] focus:border-[#0446DB]"
                              />
                            </div>
                          </div>

                          {/* List */}
                          <div className="max-h-64 overflow-y-auto">
                            {filteredMerchants.length === 0 ? (
                              <p className="px-4 py-6 text-center text-xs text-gray-400">
                                No merchant found
                              </p>
                            ) : (
                              filteredMerchants.map((mch) => {
                                const isSelected =
                                  String(mch.id) === String(merchant);
                                return (
                                  <button
                                    key={mch.id}
                                    type="button"
                                    onClick={() => {
                                      getMerchantStats(mch.id);
                                      setIsMerchantOpen(false);
                                      setMerchantSearch("");
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors cursor-pointer ${
                                      isSelected
                                        ? "bg-blue-50"
                                        : "hover:bg-gray-50"
                                    }`}
                                  >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0446DB] to-[#3b71e2] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                      {(mch.name || "?")
                                        .charAt(0)
                                        .toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-semibold text-gray-900 truncate">
                                        {mch.name}
                                      </p>
                                      <p className="text-[11px] text-gray-500 truncate">
                                        #{mch.id} · {mch.email}
                                      </p>
                                    </div>
                                    {isSelected && (
                                      <FiCheck className="w-4 h-4 text-[#0446DB] flex-shrink-0" />
                                    )}
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4 text-sm">
                      No merchant registered
                    </div>
                  )}
                </div>

                {merchant && (
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4 mb-5 md:mb-8">
                    <div className="bg-white border border-blue-100 rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[140px] sm:min-h-[170px] shadow-sm">
                      <div>
                        <div className="flex items-center gap-2 text-[#0446DB] font-bold mb-2 sm:mb-3 text-sm sm:text-[18px] md:text-[20px]">
                          <BsCashStack className="w-4 h-4" />
                          Total COD
                        </div>
                        <div className="text-base sm:text-lg md:text-xl font-bold text-[#0446DB] mb-1.5 break-words">
                          {formatCurrency(totalCod)}
                        </div>
                        <p className="text-gray-500 text-[11px] sm:text-xs md:text-sm">
                          Overall COD amount
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#FFFCEB] border border-[#FEF3C7] rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[140px] sm:min-h-[170px]">
                      <div>
                        <div className="flex items-center gap-2 text-[#D97706] font-bold mb-2 sm:mb-3 text-sm sm:text-[18px] md:text-[20px]">
                          <HiOutlineClock className="w-4 h-4" />
                          Remaining
                        </div>
                        <div className="text-base sm:text-lg md:text-xl font-bold text-[#D97706] mb-1.5 break-words">
                          {formatCurrency(remainingCod)}
                        </div>
                        <p className="text-gray-500 text-[11px] sm:text-xs md:text-sm">
                          Pending settlement
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[140px] sm:min-h-[170px]">
                      <div>
                        <div className="flex items-center gap-2 text-[#16A34A] font-bold mb-2 sm:mb-3 text-sm sm:text-[18px] md:text-[20px]">
                          <BsBank className="w-4 h-4" />
                          Paid
                        </div>
                        <div className="text-base sm:text-lg md:text-xl font-bold text-[#16A34A] mb-1.5 break-words">
                          {formatCurrency(totalPaid)}
                        </div>
                        <p className="text-gray-500 text-[11px] sm:text-xs md:text-sm">
                          Remitted to you
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[140px] sm:min-h-[170px] shadow-sm">
                      <div>
                        <div className="flex items-center gap-2 text-[#0446DB] font-bold mb-2 sm:mb-3 text-sm sm:text-[18px] md:text-[20px]">
                          <FiArrowRight className="w-4 h-4" />
                          Last Remittance
                        </div>
                        {lastRemittance.at ? (
                          <>
                            <p className="text-gray-500 text-[10px] sm:text-xs mb-1">
                              {formatDate(lastRemittance.at)}
                            </p>
                            <div className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-2 break-words">
                              {formatCurrency(lastRemittance.amount)}
                            </div>
                            <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                              UTR:{" "}
                              <span className="text-gray-800">
                                {lastRemittance.utr}
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

                    <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[140px] sm:min-h-[170px]">
                      <div>
                        <div className="flex items-center gap-2 text-[#2563EB] font-bold mb-2 sm:mb-3 text-sm sm:text-[18px] md:text-[20px]">
                          <FiClock className="w-4 h-4" />
                          Next Expected COD
                        </div>
                        <p className="text-gray-500 text-[10px] sm:text-xs mb-1">
                          {nextExpectedCod.deliveryDate
                            ? `Expected: ${formatDate(
                                nextExpectedCod.deliveryDate,
                              )}`
                            : "No delivery scheduled"}
                        </p>
                        <div className="text-base sm:text-lg md:text-xl font-bold text-[#2563EB] mb-1.5 break-words">
                          {formatCurrency(nextExpectedCod.amount)}
                        </div>
                        <p className="text-gray-500 text-[11px] sm:text-xs md:text-sm mb-0.5">
                          Orders:{" "}
                          <span className="text-[#1E293B] font-bold">
                            {nextExpectedCod.count}
                          </span>
                        </p>
                        <p className="text-gray-500 text-[11px] sm:text-xs md:text-sm">
                          Cycle:{" "}
                          <span className="text-[#1E293B] font-semibold">
                            {nextExpectedCod.cycle}
                          </span>
                        </p>
                      </div>

                      <button
                        onClick={handleExportNextExpected}
                        disabled={exportLoading || !merchant}
                        title="Export Next Expected Remittance"
                        className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2563EB] bg-blue-100/70 hover:bg-blue-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiDownload className="w-3.5 h-3.5" />
                        {exportLoading ? "Exporting..." : "Export"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-row justify-between items-center mb-4 gap-3">
                  <div>
                    <h2 className="text-base sm:text-xl font-bold text-gray-900">
                      Remittance History
                    </h2>
                    <p className="text-[11px] sm:text-sm text-gray-500">
                      {records.length} payment batches
                    </p>
                  </div>

                  <div className="relative" ref={filterRef}>
                    <button
                      onClick={() => setIsFilterOpen((p) => !p)}
                      disabled={!merchant}
                      className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                        isFilterOpen
                          ? "bg-blue-100 text-blue-700"
                          : "bg-[#EEF2F6] text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <FiFilter /> Filters
                      {hasActiveFilters && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 ml-1"></span>
                      )}
                    </button>

                    {isFilterOpen && (
                      <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-xs sm:w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-gray-800">
                            Filter Records
                          </h3>
                          <button
                            onClick={() => setIsFilterOpen(false)}
                            className="text-gray-400 hover:text-gray-600 cursor-pointer"
                          >
                            <FiX />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              AWB Number
                            </label>
                            <div className="relative">
                              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                type="text"
                                placeholder="Enter AWB number..."
                                value={advanceFilters.awb_number}
                                onChange={(e) =>
                                  setAdvanceFilters((p) => ({
                                    ...p,
                                    awb_number: e.target.value,
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") applyFilters();
                                }}
                                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={advanceFilters.startDate}
                              max={advanceFilters.endDate || undefined}
                              onChange={(e) => {
                                const v = e.target.value;
                                setAdvanceFilters((p) => {
                                  const next = { ...p, startDate: v };
                                  if (p.endDate && v && p.endDate <= v) {
                                    next.endDate = "";
                                  }
                                  return next;
                                });
                              }}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
                            />
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={advanceFilters.endDate}
                              min={advanceFilters.startDate || undefined}
                              disabled={!advanceFilters.startDate}
                              onChange={(e) =>
                                setAdvanceFilters((p) => ({
                                  ...p,
                                  endDate: e.target.value,
                                }))
                              }
                              className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                !advanceFilters.startDate
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : ""
                              }`}
                            />
                            {!advanceFilters.startDate && (
                              <p className="text-[11px] text-gray-400 mt-1">
                                Please select Start Date first
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

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                      <thead>
                        <tr className="bg-[#F8F9FB] border-b border-gray-200 text-[#64748B] text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold">
                          <th
                            className="px-3 sm:px-6 py-3 sm:py-4 flex items-center gap-1 cursor-pointer hover:text-gray-900 select-none whitespace-nowrap"
                            onClick={() => handleSort("created_at")}
                          >
                            Upload Date
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
                          <th className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                            Amount
                          </th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                            Remitted
                          </th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                            Freight
                          </th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                            Convenience Fee
                          </th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            AWB
                          </th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            UTR
                          </th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 text-center whitespace-nowrap">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {currentRecords.map((remittance, idx) => {
                          const freight =
                            Number(remittance.freight_deductions) || 0;
                          const conv = Number(remittance.convenience_fee) || 0;
                          const awbList = (remittance.awb_number || "")
                            .split(",")
                            .filter(Boolean);

                          return (
                            <tr
                              key={remittance.utr_number || idx}
                              className="hover:bg-gray-50/50 transition-colors"
                            >
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-800 whitespace-nowrap">
                                {formatDate(remittance.created_at)}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 whitespace-nowrap text-right">
                                {formatCurrency(remittance.amount)}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap text-right">
                                {formatCurrency(remittance.remittance_amount)}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm whitespace-nowrap text-right">
                                {freight > 0 ? (
                                  <span className="text-red-600 font-medium">
                                    - {formatCurrency(freight)}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm whitespace-nowrap text-right">
                                {conv > 0 ? (
                                  <span className="text-red-600 font-medium">
                                    - {formatCurrency(conv)}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                                {awbList.length === 0
                                  ? remittance.awb_count || 0
                                  : awbList.join(", ")}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  {remittance.utr_number || "-"}
                                  {remittance.utr_number && (
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          remittance.utr_number,
                                        );
                                        toast.success("UTR copied!");
                                      }}
                                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                    >
                                      <FiCopy className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-center whitespace-nowrap">
                                <button
                                  onClick={() =>
                                    handleExportRemittanceByUtr(
                                      remittance.utr_number,
                                    )
                                  }
                                  disabled={
                                    rowExportLoading ===
                                      remittance.utr_number ||
                                    !remittance.utr_number
                                  }
                                  title="Download Remittance CSV"
                                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium text-[#0446DB] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <FiDownload className="w-3.5 h-3.5" />
                                  {rowExportLoading === remittance.utr_number
                                    ? "Exporting..."
                                    : "Export"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {currentRecords.length === 0 && (
                          <tr>
                            <td
                              colSpan="8"
                              className="px-6 py-12 text-center text-gray-500 text-sm"
                            >
                              No records match your current filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="px-3 sm:px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50">
                      <span className="text-[11px] sm:text-sm text-gray-500">
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
                          className="p-1.5 sm:p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[11px] sm:text-sm font-medium flex items-center justify-center transition-colors cursor-pointer ${
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
                          className="p-1.5 sm:p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <FiChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {popupData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                AWB Numbers
              </h2>
              <button
                onClick={closePopUp}
                className="text-gray-400 hover:text-gray-700 text-xl leading-none"
              >
                &times;
              </button>
            </div>
            <ul className="space-y-1.5 max-h-[45vh] overflow-y-auto pr-1">
              {(popupData?.awb_number || "")
                .split(",")
                .filter(Boolean)
                .map((awb, idx) => (
                  <li
                    key={idx}
                    className="text-gray-700 text-xs sm:text-sm bg-gray-50 px-3 py-2 rounded-lg border border-gray-100"
                  >
                    {awb}
                  </li>
                ))}
            </ul>
            <button
              onClick={closePopUp}
              className="mt-5 w-full px-4 py-2.5 bg-[#0446DB] text-white rounded-xl font-medium hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
