
import { useState, useEffect, useCallback } from "react";

import { FaFileDownload, FaFilter } from "react-icons/fa";

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
} from "@/components/ui/alert-dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";

import {
  Loader2,
  ChevronDown,
  IndianRupee,
  Package,
  ReceiptIndianRupee,
  Clock3,
  CheckCircle2,
  RefreshCcw,
  LockKeyhole,
  EyeOff,
  Eye,
  ArrowLeft,
} from "lucide-react";

import AxiosInstance from "../../../Helper/axiosInstance";

import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_BASE_URL;

const PAGE_PASSWORD = "DaakitFinance\@30092026#0212";

const PAGE_UNLOCK_KEY = "vendor_remittance_unlocked_at";

const PAGE_UNLOCK_TIME = 5 * 60 * 1000;

function UserRemittanceStatusVendor() {
  const navigate = useNavigate();

  // =========================================================

  // STATES

  // =========================================================

  const [vendorList, setVendorList] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState("total");

  const [loading, setLoading] = useState(false);

  const [loadingPage, setLoadingPage] = useState(true);

  const [data, setData] = useState([]);

  const [vendorCodSummary, setVendorCodSummary] = useState([]);

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(20);

  const [totalPages, setTotalPages] = useState(1);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filterUpdate, setFilterUpdate] = useState(false);

  // Which table row dropdown is open

  const [openRow, setOpenRow] = useState(null);

  const [advanceFilters, setAdvanceFilters] = useState({
    startDate: "",

    endDate: "",

    vendor_id: "",

    awb_number: "",
  });

  // lock

  const [isPageUnlocked, setIsPageUnlocked] = useState(false);

  const [pagePassword, setPagePassword] = useState("");

  const [passwordError, setPasswordError] = useState("");

  const [showPagePassword, setShowPagePassword] = useState(false);

  useEffect(() => {
    const checkPageLock = () => {
      const unlockedAt = Number(sessionStorage.getItem(PAGE_UNLOCK_KEY) || 0);

      const isValid = unlockedAt > 0 && Date.now() - unlockedAt < PAGE_UNLOCK_TIME;

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

      String(Date.now()),
    );

    setIsPageUnlocked(true);

    setPagePassword("");

    setPasswordError("");
  };

  // lock

  // =========================================================

  // STATUS TABS

  // =========================================================

  const codStatusTabs = [
    {
      key: "total",

      label: "All",
    },

    {
      key: "pending",

      label: "Pending",
    },

    {
      key: "initiated",

      label: "Initiated",
    },

    {
      key: "adjusted",

      label: "Adjusted",
    },

    {
      key: "received",

      label: "Received",
    },
  ];

  const codSummary = vendorCodSummary?.[0] || {};

  // =========================================================

  // DEFAULT DATE RANGE

  // =========================================================

  const resetAdvanceFilters = () => {
    const today = new Date();

    const oneMonthAgo = new Date();

    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    setAdvanceFilters({
      endDate: today.toISOString().split("T")[0],

      startDate: oneMonthAgo.toISOString().split("T")[0],

      vendor_id: "",
    });
  };

  const getVendorList = async () => {
    try {
      const res = await AxiosInstance.get("api/admin/getAllVendors", {
        params: {
          limit: 1000,
        },
      });

      setVendorList(res?.data?.data);
    } catch (error) {}
  };

  // =========================================================

  // INDIAN CURRENCY

  // =========================================================

  const indianFormat = (num) => {
    const amount = Number(num || 0);

    return amount.toLocaleString("en-IN", {
      style: "currency",

      currency: "INR",
    });
  };

  // =========================================================

  // DATE FORMAT

  // =========================================================

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",

        day: "2-digit",

        month: "2-digit",

        year: "numeric",

        hour: "2-digit",

        minute: "2-digit",

        hour12: true,
      });
    } catch (error) {
      return "-";
    }
  };

  // =========================================================

  // OPEN DATE PICKER

  // =========================================================

  const openDatePicker = (event) => {
    try {
      event.currentTarget.showPicker?.();
    } catch {
      // Browser may block programmatic date picker.
    }
  };

  // =========================================================

  // UPDATE FILTER

  // =========================================================

  const updateAdvanceFilter = (name, value) => {
    setAdvanceFilters((prev) => {
      if (name === "startDate") {
        return {
          ...prev,

          startDate: value,

          endDate: prev.endDate && value && prev.endDate < value ? value : prev.endDate,
        };
      }

      if (name === "endDate") {
        return {
          ...prev,

          startDate: prev.startDate && value && prev.startDate > value ? value : prev.startDate,

          endDate: value,
        };
      }

      return {
        ...prev,

        [name]: value,
      };
    });
  };

  // =========================================================

  // APPLY FILTER

  // =========================================================

  const applyFilters = () => {
    if (
      advanceFilters.startDate &&
      advanceFilters.endDate &&
      advanceFilters.startDate > advanceFilters.endDate
    ) {
      toast.error("Start date cannot be after end date.");

      return;
    }

    setPage(1);

    setFilterUpdate(true);

    setIsFilterOpen(false);
  };


   const [permissions, setPermissions] = useState([]);
     
    const getUserPermissions = useCallback(async () => {
      try {
        const res = await AxiosInstance.get("/api/user/getUserPermissions");
        const list = res.data?.data?.data;
        if (!Array.isArray(list)) throw new Error("Invalid permission response");
        setPermissions(list);
        if (!list.includes("REMITTANCE_VENDOR_SUBMISSIONS_VIEW") && !list.includes("ADMIN_FULL_ACCESS")) navigate("/unauthorized", { replace: true });
      } catch (err) {
        navigate("/unauthorized", { replace: true });
      }
    }, [navigate]);
  
    useEffect(()=>{
      getUserPermissions()
    },[])

  // =========================================================

  // RESET FILTER

  // =========================================================

  const resetFilters = () => {
    resetAdvanceFilters();

    setPage(1);

    setFilterUpdate(true);

    setIsFilterOpen(false);
  };

  // =========================================================

  // FETCH DATA

  // =========================================================

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await AxiosInstance.get(
        "/api/user/fetchVendorSubmittedRecords",

        {
          params: {
            page,

            limit,

            start_date: advanceFilters.startDate,

            end_date: advanceFilters.endDate,

            vendor_id: advanceFilters.vendor_id,

            awb_number: advanceFilters.awb_number,

            status: selectedStatus === "total" ? "" : selectedStatus,
          },
        },
      );

      setVendorCodSummary(res?.data?.vendorCodSummary || []);

      setData(res?.data?.data || []);

      setTotalPages(
        Math.max(
          1,

          Number(res?.data?.totalPages || 1),
        ),
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to fetch data");

      setData([]);

      setVendorCodSummary([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================

  // INITIAL DATE

  // =========================================================

  useEffect(() => {
    resetAdvanceFilters();

    getVendorList();
  }, []);

  // =========================================================

  // FETCH ON PAGE CHANGE

  // =========================================================

  useEffect(() => {
    fetchData();
  }, [page, selectedStatus]);

  // =========================================================

  // FILTER UPDATE

  // =========================================================

  useEffect(() => {
    if (filterUpdate) {
      fetchData();

      setFilterUpdate(false);
    }
  }, [filterUpdate]);

  // =========================================================

  // PAGE LOADER

  // =========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingPage(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // =========================================================

  // STATUS CLICK

  // =========================================================

  const handleStatusChange = (status) => {
    setSelectedStatus(status);

    setPage(1);

    /* Preserved original explanatory comment. */
  };

  // =========================================================

  // FILE URL

  // =========================================================

  const getFileUrl = (fileUrl) => {
    if (!fileUrl) return "#";

    if (fileUrl.startsWith("http\://") || fileUrl.startsWith("https\://")) {
      return fileUrl;
    }

    // Windows "\\" ko URL "/" me convert

    const normalizedPath = fileUrl.replaceAll(
      "\\\\",

      "/",
    );

    return `${baseURL}/${normalizedPath}`;
  };

  // =========================================================

  // FULL PAGE LOADER

  // =========================================================

  if (loadingPage) {
    return (
      <div className="flex h-[90vh] w-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#0446DB]" />

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Loading Vendor Remittance Details...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================

  // UI

  // =========================================================

  return (
    <>
      <div className="flex h-[calc(100dvh-80px)] min-h-0 w-full flex-col overflow-hidden bg-gray-100 dark:bg-gray-900">
        <AlertDialog open={!isPageUnlocked}>
          <AlertDialogContent
            onEscapeKeyDown={(e) => e.preventDefault()}
            overlayClassName="left-0"
            className="

            max-w-[400px]

            -translate-x-1/2

            rounded-sm

            border border-gray-200

            bg-white

            p-0

            shadow-xl

            dark:border-gray-700

            dark:bg-gray-900

          "
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
                  Enter your password to access Vendor Remittances
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
                  <p className="mt-2 text-xs font-medium text-red-500">{passwordError}</p>
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

        {/* =====================================================*

*          HEADER*

*      ====================================================== */}

        <div className="mb-0 shrink-0 px-4 py-2 dark:bg-gray-900">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Vendor Remittance Record
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                View and manage vendor COD remittance records
              </p>
            </div>

            {/* =================================================*

*              FILTER DRAWER*

*          ================================================== */}

            <Drawer direction="right" open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 rounded-sm bg-[#0446DB] px-5 py-2.5 font-medium text-white shadow transition hover:bg-blue-700 hover:text-white"
                >
                  <FaFilter className="text-sm" />

                  <span>Filter</span>
                </Button>
              </DrawerTrigger>

              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Filter Vendor Remittance</DrawerTitle>
                </DrawerHeader>

                <div className="p-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();

                      applyFilters();
                    }}
                    className="flex w-full flex-col gap-5"
                  >
                    {/* START DATE */}

                    <div className="w-full">
                      <label className="mb-1 block text-xs text-gray-600 dark:text-white">
                        Start Date
                      </label>

                      <input
                        type="date"
                        value={advanceFilters.startDate}
                        max={advanceFilters.endDate || undefined}
                        onChange={(e) =>
                          updateAdvanceFilter(
                            "startDate",

                            e.target.value,
                          )
                        }
                        onClick={openDatePicker}
                        onFocus={openDatePicker}
                        className="flex w-full cursor-pointer rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#0446DB] dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
                    </div>

                    {/* END DATE */}

                    <div className="w-full">
                      <label className="mb-1 block text-xs text-gray-600 dark:text-white">
                        End Date
                      </label>

                      <input
                        type="date"
                        value={advanceFilters.endDate}
                        min={advanceFilters.startDate || undefined}
                        onChange={(e) =>
                          updateAdvanceFilter(
                            "endDate",

                            e.target.value,
                          )
                        }
                        onClick={openDatePicker}
                        onFocus={openDatePicker}
                        className="flex w-full cursor-pointer rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#0446DB] dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="w-full">
                      <label className="mb-1 block text-xs text-gray-600 dark:text-white">
                        AWB Number
                      </label>

                      <input
                        type="text"
                        value={advanceFilters.awb_number}
                        onChange={(e) =>
                          updateAdvanceFilter(
                            "awb_number",

                            e.target.value,
                          )
                        }
                        placeholder="Enter AWB Numbers"
                        className="flex w-full cursor-pointer rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#0446DB] dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
                    </div>

                    {/* VENDOR ID */}

                    <div className="w-full">
                      <label className="mb-1 block text-xs text-gray-600 dark:text-white">
                        Vendor ID
                      </label>

                      <select
                        name=""
                        id=""
                        value={advanceFilters.vendor_id}
                        onChange={(e) =>
                          updateAdvanceFilter(
                            "vendor_id",

                            e.target.value,
                          )
                        }
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#0446DB] dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      >
                        <option value="">Select a Vendor</option>

                        {vendorList?.map((v) => {
                          return (
                            <option value={v.id}>
                              {v.id}:{v?.vendor_name}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* BUTTONS */}

                    <div className="flex w-full gap-2">
                      <Button
                        type="submit"
                        className="flex-1 rounded-md bg-[#0446DB] px-4 py-2 text-sm text-white hover:bg-blue-700"
                      >
                        Apply Filter
                      </Button>

                      <Button
                        type="button"
                        onClick={resetFilters}
                        variant="outline"
                        className="flex-1 rounded-md"
                      >
                        Reset
                      </Button>
                    </div>
                  </form>
                </div>

                <DrawerFooter>
                  <Button onClick={() => setIsFilterOpen(false)} variant="outline">
                    Cancel
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        {/* =====================================================*

*          SUMMARY STATUS TABS*

*      ====================================================== */}

        <div className="w-full shrink-0 dark:bg-neutral-800">
          <div className="relative flex justify-left">
            <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex overflow-x-auto pb-2">
              <div className="mt-3 flex min-w-max gap-2 px-8">
                {codStatusTabs.map((item) => {
                  const summary = codSummary?.[item.key] || {
                    count: 0,

                    amount: 0,
                  };

                  const isActive = selectedStatus === item.key;

                  return (
                    <Button
                      key={item.key}
                      type="button"
                      // onClick={() =>

                      //   handleStatusChange(

                      //     item.key

                      //   )

                      // }

                      className={`

                      my-2 flex items-center gap-2 rounded-sm border

                      px-5 py-2.5 text-sm font-medium tracking-wide

                      transition-all duration-300

                      ${
                        true
                          ? "border-[#0446DB] bg-[#0446DB] text-white shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:scale-[1.02] hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                      }

                    `}
                    >
                      <span>{item.label}</span>

                      {/* AMOUNT */}

                      <span
                        className={`

                        text-xs

                        ${true ? "text-blue-100" : "text-gray-400 dark:text-gray-500"}

                      `}
                      >
                        {indianFormat(summary.amount || 0)}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================*

*          TABLE CONTAINER*

*      ====================================================== */}

        <div className="z-10 mx-1 flex min-h-0 flex-1 flex-col overflow-hidden rounded-md bg-white dark:bg-gray-900">
          <div className="relative z-10 min-h-0 flex-1 max-w-full overflow-auto rounded-xl bg-white p-4 shadow dark:bg-gray-900">
            <Table>
              {/* =================================================*

*                TABLE HEADER*

*            ================================================== */}

              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-3 text-left">VENDOR</TableHead>

                  <TableHead className="px-6 py-3 text-left">AWB NUMBER</TableHead>

                  <TableHead className="px-6 py-3 text-left">AMOUNT</TableHead>

                  <TableHead className="px-6 py-3 text-left">UPLOAD DATE</TableHead>

                  <TableHead className="px-6 py-3 text-left">UTR NUMBER</TableHead>

                  <TableHead className="px-6 py-3 text-left">ACTION</TableHead>
                </TableRow>
              </TableHeader>

              {/* =================================================*

*                TABLE BODY*

*            ================================================== */}

              <TableBody>
                {/* LOADING */}

                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-14 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#0446DB]" />

                      <p className="mt-2 text-sm text-gray-500">Loading remittance records...</p>
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  /* EMPTY */

                  <TableRow>
                    <TableCell colSpan={6} className="py-14 text-center">
                      <ReceiptIndianRupee className="mx-auto h-9 w-9 text-gray-300" />

                      <p className="mt-2 font-medium text-gray-600 dark:text-gray-300">
                        No remittance records found
                      </p>

                      <p className="mt-1 text-xs text-gray-400">Try changing your filter</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  /* DATA */

                  data.map((d) => {
                    const isOpen = openRow === d.id;

                    return (
                      <>
                        {/* =========================================*

*                          MAIN ROW*

*                      ========================================== */}

                        <TableRow
                          key={`main-${d.id}`}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          {/* VENDOR */}

                          <TableCell className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                FP_{d.vendor_id}
                              </p>

                              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                {d.vendor_name || "-"}
                              </p>
                            </div>
                          </TableCell>

                          {/* AWB */}

                          <TableCell className="px-6 py-4 dark:text-white">
                            <div className="space-y-1">
                              {d.awb_numbers

                                ?.slice(0, 2)

                                .map((awb) => (
                                  <div key={awb} className="text-sm">
                                    {awb}
                                  </div>
                                ))}

                              {d.awb_numbers?.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => setOpenRow(isOpen ? null : d.id)}
                                  className="text-xs font-medium text-[#0446DB]"
                                >
                                  +{d.awb_numbers.length - 2} more
                                </button>
                              )}
                            </div>
                          </TableCell>

                          {/* AMOUNT */}

                          <TableCell className="px-6 py-4">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {indianFormat(d.total_cod_amount || d.submitted_amount || 0)}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {d.cod_order_count || 0} Orders
                            </p>
                          </TableCell>

                          {/* DATE */}

                          <TableCell className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                            {formatDate(d.created_at)}
                          </TableCell>

                          {/* UTR */}

                          <TableCell className="px-6 py-4">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {d.utr_number || "-"}
                            </span>
                          </TableCell>

                          {/* ACTION */}

                          <TableCell className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {/* DOWNLOAD */}

                              {d.file_url && (
                                <a
                                  href={getFileUrl(d.file_url)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Download CSV"
                                  className="

                                  flex h-9 w-9

                                  items-center justify-center

                                  rounded-md border

                                  border-gray-200

                                  bg-white text-[#0446DB]

                                  transition

                                  hover:border-[#0446DB]

                                  hover:bg-blue-50

                                  dark:border-gray-700

                                  dark:bg-gray-800

                                "
                                >
                                  <FaFileDownload className="text-lg" />
                                </a>
                              )}

                              {/* DROPDOWN */}

                              <button
                                type="button"
                                title="View Details"
                                onClick={() => setOpenRow(isOpen ? null : d.id)}
                                className="

                                flex h-9 w-9

                                items-center justify-center

                                rounded-md border

                                border-gray-200

                                bg-white text-gray-600

                                transition

                                hover:border-[#0446DB]

                                hover:bg-blue-50

                                hover:text-[#0446DB]

                                dark:border-gray-700

                                dark:bg-gray-800

                                dark:text-gray-300

                              "
                              >
                                <ChevronDown
                                  size={18}
                                  className={`

                                  transition-transform

                                  duration-300

                                  ${isOpen ? "rotate-180" : ""}

                                `}
                                />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>

                        {/* =========================================*

*                          DROPDOWN ROW*

*                      ========================================== */}

                        {isOpen && (
                          <TableRow key={`details-${d.id}`}>
                            <TableCell colSpan={6} className="bg-gray-50 p-0 dark:bg-gray-950">
                              <div className="p-5">
                                {/* =================================*

*                                  DROPDOWN HEADER*

*                              ================================== */}

                                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                                  
                                </div>

                                {/* =================================*

*                                  STATUS CARDS*

*                              ================================== */}

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                                  {/* TOTAL */}

                                  
                                </div>

                                {/* =================================*

*                                  OTHER DETAILS*

*                              ================================== */}

                                {/* =================================*

*                                  AWB NUMBERS*

*                              ================================== */}

                                <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                                  <div className="mb-3 flex items-center justify-between">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                      AWB Numbers
                                    </p>

                                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                      {d.awb_numbers?.length || 0}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap gap-2">
                                    {d.awb_numbers?.length > 0 ? (
                                      d.awb_numbers.map((awb) => (
                                        <span
                                          key={awb}
                                          className="

                                            rounded-md

                                            border

                                            border-blue-100

                                            bg-blue-50

                                            px-3 py-1.5

                                            text-xs

                                            font-medium

                                            text-[#0446DB]

                                            dark:border-blue-900

                                            dark:bg-blue-950

                                            dark:text-blue-400

                                          "
                                        >
                                          {awb}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-sm text-gray-500">No AWB numbers</span>
                                    )}
                                  </div>
                                </div>

                                {/* =================================*

*                                  FILE*

*                              ================================== */}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* =====================================================*

*            PAGINATION*

*        ====================================================== */}

          <div className="flex shrink-0 items-center justify-center gap-4 border-t border-gray-200 bg-white py-3 dark:border-gray-700 dark:bg-gray-900">
            <Button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`

              rounded-sm px-4 py-2

              text-sm font-medium

              ${
                page === 1
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : "bg-[#0446DB] text-white hover:bg-blue-700"
              }

            `}
            >
              Previous
            </Button>

            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page <span className="font-semibold">{page}</span> of{" "}
              <span className="font-semibold">{totalPages}</span>
            </span>

            <Button
              type="button"
              onClick={() =>
                setPage((prev) =>
                  Math.min(
                    prev + 1,

                    totalPages,
                  ),
                )
              }
              disabled={page === totalPages}
              className={`

              rounded-sm px-4 py-2

              text-sm font-medium

              ${
                page === totalPages
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : "bg-[#0446DB] text-white hover:bg-blue-700"
              }

            `}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserRemittanceStatusVendor;
