import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../Loader.jsx";
import { toast } from "react-toastify";
import { ArrowLeft, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
const baseURL = import.meta.env.VITE_BASE_URL;
const PAGE_PASSWORD = "DaakitFinance@30092026#0212";
const PAGE_UNLOCK_KEY = "merchant_remittance_unlocked_at";
const PAGE_UNLOCK_TIME = 5 * 60 * 1000;
export default function MerchantRemittances() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("history");
  // const [merchanntId,setMerchanrId]=useState('')
  const [allMerchants, setAllMerchants] = useState([]);
  const [merchant, setMerchant] = useState("");
  const [stats, setStats] = useState(null);

  const [popupData, setPopupData] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [advanceFilters, setAdvanceFilters] = useState({
    startDate: "",
    endDate: "",
    awb_number: "",
  });

  // lock
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
// lock

  const [filterUpdate, setFilterUpdate] = useState(false);
  const getMerchants = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/admin/getAllMerchants`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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

  const getMerchantStats = async (id) => {
    setMerchant(id);

    setLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/admin/getMerchantRemittanceSummary/${id || merchant}`,
        {
          params: {
            start_date: advanceFilters.startDate,
            end_date: advanceFilters.endDate,
            awb_numbers: advanceFilters.awb_number,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setStats(res.data);
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

  useEffect(() => {
    if (filterUpdate) {
      getMerchantStats();
    }
  }, [filterUpdate]);

  const handleChange = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
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
          "Error while uploading file to take action on bulk orders",
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadMerchantRemittanceSampleFile = async () => {
    try {
      const res = await axios.get(
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
    } catch (error) {}
  };

  // advance filter

  function toCapitalizeEachWord(str) {
    return str
      .split(" ")
      .map((word) => {
        if (!word) return "";
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  }

  const resetAdvanceFilters = async () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    setAdvanceFilters((prev) => ({
      endDate: today.toISOString().split("T")[0],
      startDate: oneMonthAgo.toISOString().split("T")[0],
      awb_number: "",
    }));
  };

  useEffect(() => {
    resetAdvanceFilters();
  }, []);
  // advance filter

  const openPopUp = (remmitance) => {
    setPopupData(remmitance);
  };

  const closePopUp = () => {
    setPopupData(null);
  };

  useEffect(() => {
    getMerchants();
  }, []);

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
      {loadingPage ? (
        <div className=" w-full h-[90vh] flex justify-center items-center">
          <div>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2"> Loading Merchant Remittances Details...</p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
          {/* Top Heading Stripe */}
          <div className="mb-0  dark:bg-gray-900 py-[24px]   px-[24px]">
            <div className="flex flex-wrap items-center justify-between">
              {/* Heading */}
              <h1 className="text-2xl dark:text-white">Merchant Remittances</h1>
              <div>
                <button
                  onClick={() => downloadMerchantRemittanceSampleFile()}
                  className={`bg-white text-[#0446DB] font-medium px-5 py-2 rounded-sm shadow hover:bg-indigo-100 transition mr-2`}
                >
                  Sample CSV
                </button>
              </div>
            </div>
          </div>

          {/* filter right side */}
          <div
            className={`fixed top-0 rounded-tl-4xl right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
              isFilterOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Advance Filters</h2>

              <button
                onClick={() => {
                  setIsFilterOpen(false);
                }}
                className="text-gray-500 hover:text-black text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-wrap items-end gap-4"
              >
                {/* Start Date */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={advanceFilters.startDate}
                    onChange={(e) =>
                      setAdvanceFilters((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="border px-3 py-1 rounded-md text-sm"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={advanceFilters.endDate}
                    onChange={(e) =>
                      setAdvanceFilters((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className="border px-3 py-1 rounded-md text-sm"
                  />
                </div>

                {/* NDR ID */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    AWB Number
                  </label>
                  <input
                    type="text"
                    value={advanceFilters.awb_number}
                    onChange={(e) =>
                      setAdvanceFilters((prev) => ({
                        ...prev,
                        awb_number: e.target.value,
                      }))
                    }
                    placeholder="Integer Only"
                    className="border px-3 py-1 rounded-md text-sm"
                  />
                </div>

                {/* Update Button */}
                <div>
                  <button
                    onClick={() => {
                      setFilterUpdate((prev) => !prev);
                      setIsFilterOpen(false);
                    }}
                    className="bg-[#0446DB]  text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
                  >
                    Filter
                  </button>
                  <button
                    onClick={() => {
                      resetAdvanceFilters();
                      setFilterUpdate((prev) => !prev);
                      setIsFilterOpen(false);
                    }}
                    className="bg-[#0446DB] text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* filter right side */}

          <div className="mx-1 z-10 bg-white dark:bg-gray-900 rounded-md">
            {/* Status */}
            <div className="max-w-full px-4  relative z-10">
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <button
                  onClick={() => setSelectedStatus("history")}
                  className={`mt-4 px-6 py-2 rounded-md border transition font-medium shadow-sm ${
                    selectedStatus === "history"
                      ? "bg-[#0446DB] text-white"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Remittance History
                </button>
                <button
                  onClick={() => setSelectedStatus("upload")}
                  className={`mt-4 px-6 py-2 rounded-md border transition font-medium shadow-sm ${
                    selectedStatus === "upload"
                      ? "bg-[#0446DB] text-white"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Upload Remittance
                </button>
              </div>

              {selectedStatus === "upload" && (
                <div className="bg-white dark:bg-gray-900 p-6 rounded-sm shadow-md border border-gray-200 space-y-4">
                  <label className="block text-gray-700 dark:text-white font-semibold">
                    Remittance File
                  </label>
                  <input
                    type="file"
                    name="bulk_remittance"
                    onChange={handleChange}
                    accept=".csv"
                    className="block w-full text-sm dark:text-white text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-white file:bg-[#0446DB] file:hover:bg-indigo-600 cursor-pointer"
                  />
                </div>
              )}

              {selectedStatus === "history" && (
                <>
                  <div>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-sm shadow-md border border-gray-200 mb-2">
                      {allMerchants?.length > 0 ? (
                        <div>
                          <label className="block dark:text-white text-gray-700 font-semibold mb-1">
                            Select Merchant
                          </label>
                          <select
                            required
                            value={merchant}
                            onChange={(e) => getMerchantStats(e.target.value)}
                            className="w-full px-4 dark:text-white py-2 dark:bg-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="" disabled>
                              Select Merchant
                            </option>
                            {allMerchants.map((mch) => (
                              <option key={mch.id} value={mch.id}>
                                {mch.name} - {mch.email}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <>No merchant registered</>
                      )}
                    </div>

                    {merchant && (
                      <div className="bg-white dark:bg-gray-900 p-6 rounded-sm shadow-md border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex flex-col justify-center items-center bg-gray-50 p-4 rounded-sm shadow-sm border border-gray-100">
                            <span className="text-gray-600 font-medium">
                              Total COD
                            </span>
                            <span className="text-xl font-bold text-[#0446DB]">
                              ₹{Number(stats?.total_cod).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex flex-col justify-center items-center bg-gray-50 p-4 rounded-sm shadow-sm border border-gray-100">
                            <span className="text-gray-600 font-medium">
                              Remaining
                            </span>
                            <span className="text-xl font-bold text-yellow-600">
                              ₹
                              {Number(
                                stats?.remaining_cod_amount,
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex flex-col justify-center items-center bg-gray-50 p-4 rounded-sm shadow-sm border border-gray-100">
                            <span className="text-gray-600 font-medium">
                              Paid
                            </span>
                            <span className="text-xl font-bold text-green-600">
                              ₹
                              {Number(
                                stats?.total_paid_remittance_amount,
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end mt-1">
                    <button
                      onClick={() => setIsFilterOpen(true)}
                      className="bg-[#0446DB] text-white font-medium px-5 py-2 rounded shadow hover:bg-indigo-100 transition"
                    >
                      Filter
                    </button>
                  </div>

                  {stats?.remittance_records.length > 0 && (
                    <div className="overflow-x-auto mt-1 rounded-sm shadow-md border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#0446DB] text-white">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                              ID
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-semibold uppercase tracking-wider">
                              REMITTANCE AMOUNT
                            </th>
                            <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-semibold uppercase tracking-wider">
                              FREIGHT DEDUCTION
                            </th>
                            <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-semibold uppercase tracking-wider">
                              {"convenience fee".toLocaleUpperCase()}
                            </th>
                            <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-semibold uppercase tracking-wider">
                              AWB Number
                            </th>
                            <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-semibold uppercase tracking-wider">
                              UTR Number
                            </th>
                            <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-semibold uppercase tracking-wider">
                              UPLOAD DATE
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {stats?.remittance_records.map((remittance) => (
                            <tr
                              key={remittance.id}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 text-sm text-gray-800">
                                {remittance.id}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800">
                                {remittance.amount}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800">
                                {remittance.remittance_amount}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800">
                                {remittance.freight_deductions}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800">
                                {remittance.convenience_fee}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800">
                                {remittance.awb_number.split(",").length ===
                                1 ? (
                                  <>{remittance.awb_number}</>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => openPopUp(remittance)}
                                      className="hover:cursor-pointer"
                                    >
                                      {`${remittance.awb_number.split(",")[0]}...`}
                                    </button>
                                  </>
                                )}
                              </td>

                              <td className="px-6 py-4 text-sm text-gray-800">
                                {remittance.utr_number}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-800">
                                {new Date(remittance.created_at).toLocaleString(
                                  "en-IN",
                                  {
                                    timeZone: "Asia/Kolkata",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  },
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* 👇 Popup Modal */}
      {popupData && (
        <div className="fixed inset-0 bg-[rgba(46,46,46,0.5)] flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-sm shadow-lg w-96 max-h-[70vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">AWB Numbers</h2>
            <ul className="list-disc pl-5 space-y-1">
              {popupData.awb_numbers.split(",").map((awb, idx) => (
                <li key={idx} className="text-gray-700">
                  {awb}
                </li>
              ))}
            </ul>
            <button
              onClick={closePopUp}
              className="mt-4 px-4 py-2 bg-[#0446DB] text-white rounded hover:bg-indigo-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}


