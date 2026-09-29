import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Loader";

import { FaRegCopy, FaSearch } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { toast } from "react-toastify";
import { UserRoles } from "@/utils/UserRole";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TbFileInfo } from "react-icons/tb";
const baseURL = import.meta.env.VITE_BASE_URL;
const frontEndURL = import.meta.env.VITE_FRONTEND_URL;
function UserNDR() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [historyItem, setHistoryItem] = useState(null);
  const [takeAction, setTakeAction] = useState(null);
  const [copySuccess, setCopySuccess] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [newRTORemarkStatus, setRTORemarksStatus] = useState("");
  function toCapitalizeEachWord(str) {
    return str
      .split(" ")
      .map((word) => {
        if (!word) return "";
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  }
  /* Status Filter */
  const filters = [
    ["All", ""],
    ["Action Required", "actionable"],
    ["Action Taken", "actiontaken"],
    ["RTO", "rto"],
    ["Delivered", "delivered"],
  ];
  const [selectedFilter, setSelectedFilter] = useState("");
  /* Advance Filter */
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [advanceFilters, setAdvanceFilters] = useState({
    startDate: "",
    endDate: "",
    awb_number: "",
  });
  const [filterUpdate, setFilterUpdate] = useState(false);

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

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/user/getNDRs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          page,
          limit,
          start_date: advanceFilters.startDate,
          end_date: advanceFilters.endDate,
          awb_number: advanceFilters.awb_number,
          statusType: selectedFilter,
        },
      });
      setData(res.data.data || []);
      setTotalPages(Math.ceil(Math.max(1, res.data.pagination?.total) / limit));
      setLimit(res.data.pagination?.limit);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch NDR data:",
      );
    } finally {
      setLoading(false);
    }
  };

  const [permissions, setPermissions] = useState(
    localStorage.getItem("permission"),
  );
  const getUserPermissions = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/user/getUserPermissions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const permission = res?.data?.data?.data || [];
      if (
        !permission.includes("ODR_VIEW") &&
        !permission.includes("ADMIN_FULL_ACCESS")
      ) {
        navigate("/unauthorized");
        return;
      }
      setPermissions(res?.data?.data?.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    fetchData();
    // if (UserRoles.includes(localStorage.getItem("userType"))) {
    //   getUserPermissions()
    // }
  }, [selectedFilter, filterUpdate, page]);

  /* Handle Change Status */
  const changeStatus = async (data, ndr_id) => {
    setLoading(true);
    try {
      // console.log(data)
      // return
      const res = await axios.post(
        `${baseURL}/api/user/handlendrs/${ndr_id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      await fetchData();
      setEditingStatusId(null);
      setTakeAction(null);
      toast.success(res?.data?.data?.message);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to take action on current NDR's status",
      );
    } finally {
      setLoading(false);
    }
  };

  /* Fetch History */
  const handleHistoryClick = async (d) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/user/getNDRHistory/${d.ndr_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setHistoryItem(res.data.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Error while fetching history data of the order",
      );
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${baseURL}/api/user/exportNDRs`, {
        params: {
          statusType: selectedFilter === "All" ? "" : selectedFilter,
          awb_number: advanceFilters.awb_number,
          start_date: advanceFilters.startDate,
          end_date: advanceFilters.endDate,
        },
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ndr.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to export orders",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault(); // Page refresh rokega
    fetchData();
  };

    const [loadingPage, setLoadingPage] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setLoadingPage(false);
  }, 2000);

  return () => clearTimeout(timer);
}, []);

  return (
    <>
    {
      loadingPage ? (
        <div className=" w-full h-[90vh] flex justify-center items-center">
                  <div>
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    <p className="mt-2"> Loading NDR Details...</p>
                  </div>
                </div>
        
      ):(

      <div className="  dark:bg-gray-900 min-h-screen w-full">
        {/* Right Sidebar for filters */}
        

        {/* Heading */}
        <div className="w-full  dark:bg-neutral-900 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-semibold dark:text-white text-left">
              NDR
            </h1>

            {/* Search Box */}
            <div className="w-full md:flex-1 md:max-w-xl">
              <form onSubmit={handleSearch} className="flex w-full">
                <input
                  name="awb_number"
                  value={advanceFilters.awb_number}
                  onChange={(e) => {
                    setAdvanceFilters((prev) => ({
                      ...prev,
                      awb_number: e.target.value,
                    }));
                  }}
                  type="text"
                  placeholder="Search by AWB Number..."
                  className="w-full px-4 py-2.5 rounded-l-lg text-sm text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0446db] focus:border-transparent"
                />

                <button
                  type="submit"
                  className="bg-white px-4 sm:px-5 py-2.5 rounded-r-lg border border-l-0 border-gray-300 text-gray-600 hover:bg-indigo-100 hover:text-[#0446db] transition"
                >
                  <FaSearch />
                </button>
              </form>
            </div>

            {/* Buttons */}
            <div className="flex  justify-center md:justify-end gap-3">
              {(permissions?.includes("NDR_EXPORT") ||
                permissions.includes("ADMIN_FULL_ACCESS")) && (
                <Button
                  onClick={exportCSV}
                  className="bg-[#0446DB] text-[#fff] hover:bg-[#0446DB]  font-medium px-4 sm:px-5 py-2 rounded-sm transition w-full sm:w-auto"
                >
                  Export
                </Button>
              )}

              <Button
                onClick={() => setIsFilterOpen(true)}
                className="bg-[#0446DB] text-[#fff] hover:bg-[#0446DB] font-medium px-4 sm:px-5 py-2 rounded-sm transition w-full sm:w-auto"
              >
                Filter
              </Button>

              <Drawer
                direction="right"
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
              >
                <DrawerContent className="h-full w-full sm:max-w-md rounded-none sm:rounded-l-xl border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  {/* Header */}
                  <DrawerHeader className="border-b border-gray-200 dark:border-gray-800 px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <DrawerTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                          Advance Filters
                        </DrawerTitle>

                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Filter orders using date range and AWB number.
                        </p>
                      </div>

                      <DrawerClose asChild>
                        <button
                          type="button"
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-gray-200 text-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                        >
                          &times;
                        </button>
                      </DrawerClose>
                    </div>
                  </DrawerHeader>

                  {/* Body */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setFilterUpdate((prev) => !prev);
                      setIsFilterOpen(false);
                    }}
                    className="flex h-full flex-col overflow-hidden"
                  >
                    <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
                      {/* Start Date */}
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                          className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                      </div>

                      {/* End Date */}
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                          className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                      </div>

                      {/* AWB Number */}
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                          placeholder="Enter AWB number"
                          className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <DrawerFooter className="border-t border-gray-200 bg-gray-50/70 px-5 py-4 dark:border-gray-800 dark:bg-gray-950/30">
                      <div className="flex w-full gap-3">
                        {/* Reset */}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            resetAdvanceFilters();
                            setFilterUpdate((prev) => !prev);
                            setIsFilterOpen(false);
                          }}
                          className="h-10 flex-1 cursor-pointer rounded-md"
                        >
                          Reset
                        </Button>

                        {/* Apply */}
                        <Button
                          type="submit"
                          className="h-10 flex-1 cursor-pointer rounded-md bg-[#0446DB] text-white hover:bg-[#0339b5]"
                        >
                          Apply Filters
                        </Button>
                      </div>
                    </DrawerFooter>
                  </form>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>

        <div className="mx-1 z-10 bg-white dark:bg-gray-800 rounded-md">
          <div className="w-full  bg-white dark:border dark:border-[#0446db] rounded shadow-2xl  dark:bg-gray-900   left-0 px-4 z-40   ">
            <div className="relative flex justify-center ">
              <div className=" flex  overflow-x-auto scrollbar-hide scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2">
                <div className="flex gap-2 min-w-max px-8 mt-0">
                  {filters.map((filter) => (
                    <Button
                      key={filter[0]}
                      onClick={() => {
                        setSelectedFilter(filter[1]);
                        setPage(1);
                      }}
                      className={`px-5 py-2.5 rounded-full my-2 border transition-all duration-300 font-medium text-sm tracking-wide ${
                        selectedFilter === filter[1]
                          ? "bg-[#0446db] text-white shadow-lg shadow-purple-200 border-transparent"
                          : "bg-white hover:bg-[#0446DB] hover:text-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]"
                      }`}
                    >
                      {filter[0]}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 dark:bg-gray-900 text-gray-600 font-semibold">
                <tr>
                  <th className="px-6 py-3 text-left whitespace-nowrap">
                    NDR ID
                  </th>
                  <th className="px-6 py-3 text-left">ORDER ID</th>
                  <th className="px-6 py-3 text-left">CUSTOMER INFO</th>
                  <th className="px-6 py-3 text-left">RIDER ID</th>
                  <th className="px-6 py-3 text-left">REMARKS</th>
                  <th className="px-6 py-3 text-left">ATTEMPT COUNT</th>
                  <th className="px-6 py-3 text-left">STATUS</th>
                  {selectedFilter === "actionable" && (
                    <th className="px-6 py-3 text-left">ACTION</th>
                  )}

                  <th className="px-6 py-3 text-left">HISTORY</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    <td
                      colSpan="12"
                      className="w-full text-center border px-6  text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center py-10 text-gray-600">
                        <Loader2 className="h-8 w-8 animate-spin mb-2" />
                        <p className="text-sm font-medium">Loading...</p>
                      </div>
                    </td>
                  </>
                ) : data.length > 0 ? (
                  data.map((d) => {
                    return (
                      <tr
                        key={d.ndr_id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        {/* NDR ID */}
                        <td className="px-6 py-4 dark:text-white">
                          {d.ndr_id}
                        </td>

                        {/* Order ID */}
                        <td className="px-6 py-4">
                          <p className=" whitespace-normal">
                            <a
                              href={`${frontEndURL}/track-order?awb_number=${d.awb_number}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline whitespace-nowrap text-blue-700 hover:text-blue-500"
                            >
                              {d.awb_number}
                            </a>
                            <button
                              className="pl-2 text-lg text-gray-600 dark:text-white hover:text-[#0446db] transition"
                              onClick={() => {
                                navigator.clipboard.writeText(d.awb_number);
                                setCopySuccess(d.awb_number);
                                setTimeout(() => {
                                  setCopySuccess(null);
                                }, 2000);
                              }}
                            >
                              {copySuccess === d.awb_number ? (
                                <CiCircleCheck />
                              ) : (
                                <FaRegCopy />
                              )}
                            </button>
                          </p>
                          <p className="text-l whitespace-nowrap dark:text-white text-gray-800 flex items-center">
                            {d.merchant_order_id}
                            <button
                              className="pl-2 text-lg text-gray-600 hover:text-[#0446db] transition"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  d.merchant_order_id,
                                );
                                setCopySuccess(d.merchant_order_id);
                                setTimeout(() => {
                                  setCopySuccess(null);
                                }, 2000);
                              }}
                            >
                              {copySuccess === d.merchant_order_id ? (
                                <CiCircleCheck />
                              ) : (
                                <FaRegCopy />
                              )}
                            </button>
                          </p>
                          <p className="text-s text-gray-500 dark:text-white">
                            {new Date(d.created_at).toLocaleString("en-IN", {
                              timeZone: "Asia/Kolkata",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                        </td>

                        {/* Customer Info */}
                        <td className="px-6 py-4 whitespace-pre-line">
                          <p className="font-medium whitespace-nowrap dark:text-white text-gray-800">
                            {d.delivery_contact_name}
                          </p>
                          <div className="relative inline-block group">
                            <span className="cursor-pointer whitespace-nowrap dark:text-white text-gray-800 font-medium">
                              {d.delivery_address_line.slice(0, 30)}....
                            </span>
                            <div
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3
                                          hidden group-hover:block"
                            >
                              <div className="bg-[#0446db] dark:text-white text-white text-xs w-48 px-3 py-1 rounded shadow-lg ">
                                {d.delivery_address_line}
                              </div>

                              {/* Arrow */}
                              <div className="w-2 h-2 bg-[#0446db] rotate-45 mx-auto -mt-1"></div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-white">
                            {d.delivery_city}, {d.delivery_state} -{" "}
                            {d.delivery_pincode}
                          </p>
                          <p className="text-xs text-gray-400">
                            {d.delivery_country}
                          </p>
                        </td>

                        {/* Remark/Reason */}
                        <td className="px-6 py-4 dark:text-white">
                          {d.vendor_id
                            ? `FP${d.vendor_id}_${d.rider_id}`
                            : `DKT_${d.rider_id}`}
                        </td>

                        {/* Remark/Reason */}
                        <td className="px-6 py-4 dark:text-white">
                          {d.reason || "NA"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-green-100 text-green-800 text-md font-medium px-3 py-1 rounded-full hover:bg-yellow-200">
                            {d.attempt_count || "NA"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 dark:text-white">
                          {toCapitalizeEachWord(d.status) || "NA"}
                        </td>

                        {/* Action */}
                        {selectedFilter === "actionable" && (
                          <td className="px-6 py-4">
                            {editingStatusId === d.ndr_id ? (
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault();
                                  const newStatus =
                                    e.target.elements.status.value;
                                  const newRemarks =
                                    e.target.elements.remarks.value;
                                  changeStatus(d.ndr_id, newStatus, newRemarks);
                                }}
                                className="flex flex-col gap-2"
                              >
                                <div className="my-2">
                                  <label className="mx-2">Remarks</label>
                                  <input
                                    type="text"
                                    name="remarks"
                                    className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <select
                                    name="status"
                                    defaultValue=""
                                    className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                    required
                                  >
                                    <option disabled value="">
                                      Change Status
                                    </option>
                                    <option value="reattempt">Reattempt</option>
                                    <option value="rto">RTO</option>
                                  </select>
                                  <button
                                    type="submit"
                                    className="bg-[#0446db] text-white text-xs px-3 py-1 rounded hover:bg-indigo-800 transition"
                                  >
                                    Update
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingStatusId(null)}
                                    className="text-xs text-gray-500 hover:underline"
                                  >
                                    Close
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <span
                                onClick={() => {
                                  if (
                                    !permissions.includes("NDR_ACTION") &&
                                    !permissions.includes("ADMIN_FULL_ACCESS")
                                  ) {
                                    return;
                                  }
                                  if (d.tpc_awb_number !== null) {
                                    return;
                                  }
                                  // setEditingStatusId(d.ndr_id)
                                  setTakeAction(d.ndr_id);
                                }}
                                className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-semibold inline-block bg-blue-100 text-blue-600 cursor-pointer"
                              >
                                Take Action
                              </span>
                            )}
                          </td>
                        )}

                        <td>
                          <button
                            onClick={() => {
                              if (
                                !permissions.includes("NDR_HISTORY") &&
                                !permissions.includes("ADMIN_FULL_ACCESS")
                              ) {
                                return;
                              }
                              handleHistoryClick(d);
                            }}
                            className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full hover:bg-yellow-200"
                          >
                            History
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr key={"No record found"}>
                    <td
                      colSpan="6"
                      className="text-center px-6 py-6 text-gray-500"
                    >
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="py-3 flex justify-center items-center gap-4">
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                page === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#0446db] text-white hover:bg-indigo-800"
              }`}
            >
              Previous
            </Button>
            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                page === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#0446db] text-white hover:bg-indigo-800"
              }`}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Modal */}
        {/* ================= NDR HISTORY DIALOG ================= */}
<AlertDialog
  open={!!historyItem}
  onOpenChange={(open) => {
    if (!open) {
      setHistoryItem(null);
    }
  }}
>
  <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-xl border border-neutral-200 bg-white p-0 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
    {/* ================= HEADER ================= */}
    <AlertDialogHeader className="border-b border-neutral-200 bg-neutral-50/50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
          <TbFileInfo className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <AlertDialogTitle className="text-lg font-semibold text-neutral-900 dark:text-white">
            NDR History
          </AlertDialogTitle>

          <AlertDialogDescription className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Track all actions and updates performed on this NDR.
          </AlertDialogDescription>
        </div>
      </div>
    </AlertDialogHeader>

    {/* ================= BODY ================= */}
    <div className="max-h-[65vh] overflow-y-auto px-5 py-5">
      {Array.isArray(historyItem) && historyItem.length > 0 ? (
        <div className="space-y-4">
          {historyItem.map((item, index) => {
            // null / "null" / undefined / "undefined" / empty ko hide karega
            const hasValue = (value) => {
              if (value === null || value === undefined) {
                return false;
              }

              const normalizedValue = String(value)
                .trim()
                .toLowerCase();

              return (
                normalizedValue !== "" &&
                normalizedValue !== "null" &&
                normalizedValue !== "undefined"
              );
            };

            // Action Name
            const actionTitle =
              item?.action_taken === "change_address"
                ? "Change Address"
                : item?.action_taken === "change_phone"
                  ? "Change Phone Number"
                  : item?.action_taken === "reattempt"
                    ? "Reattempt"
                    : item?.action_taken === "rto"
                      ? "RTO"
                      : item?.action_taken === "marked_as_ndr"
                        ? "Marked as NDR"
                        : item?.action_taken;

            return (
              <div
                key={item?.action_id || index}
                className="overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all duration-200 hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              >
                {/* ================= ACTION HEADER ================= */}
                <div className="flex flex-col gap-3 border-b border-neutral-100 bg-neutral-50/60 px-4 py-3.5 dark:border-neutral-800 dark:bg-neutral-800/30 sm:flex-row sm:items-center sm:justify-between">
                  {/* Action */}
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0446DB] text-xs font-semibold text-white shadow-sm">
                      {index + 1}
                    </div>

                    {hasValue(actionTitle) && (
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                          Action
                        </p>

                        <h3 className="mt-0.5 truncate text-sm font-semibold text-neutral-900 dark:text-white">
                          {actionTitle}
                        </h3>
                      </div>
                    )}
                  </div>

                  {/* Date / Time */}
                  {hasValue(item?.created_at) && (
                    <div className="pl-12 sm:pl-0 sm:text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                        Date / Time
                      </p>

                      <p className="mt-0.5 whitespace-nowrap text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        {new Date(item.created_at).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {/* ================= DETAILS ================= */}
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {/* ================= CHANGE PHONE ================= */}
                    {item?.action_taken === "change_phone" &&
                      hasValue(item?.customer_phone) && (
                        <div className="rounded-lg border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/30 sm:col-span-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                            Phone Number
                          </p>

                          <p className="mt-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                            {item.customer_phone}
                          </p>
                        </div>
                      )}

                    {/* ================= CHANGE ADDRESS - NAME ================= */}
                    {item?.action_taken === "change_address" &&
                      hasValue(item?.customer_name) && (
                        <div className="rounded-lg border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/30">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                            Customer Name
                          </p>

                          <p className="mt-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                            {item.customer_name}
                          </p>
                        </div>
                      )}

                    {/* ================= CHANGE ADDRESS - ADDRESS ================= */}
                    {item?.action_taken === "change_address" &&
                      hasValue(item?.customer_details_address) && (
                        <div className="rounded-lg border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/30 sm:col-span-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                            Address
                          </p>

                          <p className="mt-1.5 break-words text-sm leading-6 text-neutral-700 dark:text-neutral-300">
                            {item.customer_details_address}
                          </p>
                        </div>
                      )}

                    {/* ================= REMARKS ================= */}
                    {item?.action_taken !== "change_phone" &&
                      item?.action_taken !== "change_address" &&
                      hasValue(item?.remarks) && (
                        <div className="rounded-lg border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/30 sm:col-span-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                            Remarks
                          </p>

                          <p className="mt-1.5 break-words text-sm leading-6 text-neutral-800 dark:text-neutral-200">
                            {item.remarks}
                          </p>
                        </div>
                      )}

                    {/* ================= SUB REMARKS ================= */}
                    {hasValue(item?.sub_remarks) && (
                      <div className="rounded-lg border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/30">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                          Sub Remarks
                        </p>

                        <p className="mt-1.5 break-words text-sm leading-6 text-neutral-800 dark:text-neutral-200">
                          {item.sub_remarks}
                        </p>
                      </div>
                    )}

                    {/* ================= RESCHEDULED DATE ================= */}
                    {hasValue(item?.rescheduled_date) && (
                      <div className="rounded-lg border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/30">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                          Rescheduled Date
                        </p>

                        <p className="mt-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                          {item.rescheduled_date}
                        </p>
                      </div>
                    )}

                    {/* ================= OTHER REMARKS ================= */}
                    {hasValue(item?.detailed_remarks) && (
                      <div className="rounded-lg border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/30 sm:col-span-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                          Other Remarks
                        </p>

                        <p className="mt-1.5 break-words text-sm leading-6 text-neutral-800 dark:text-neutral-200">
                          {item.detailed_remarks}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ================= EMPTY STATE ================= */
        <div className="flex min-h-[250px] items-center justify-center">
          <div className="max-w-xs text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
              <TbFileInfo className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              No history found
            </h3>

            <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
              No NDR action history is available for this order.
            </p>
          </div>
        </div>
      )}
    </div>

    {/* ================= FOOTER ================= */}
    <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-950/30">
      <AlertDialogCancel
        onClick={() => setHistoryItem(null)}
        className=" cursor-pointer rounded-md border-neutral-200 px-5 my-1 font-medium dark:border-neutral-700"
      >
        Close
      </AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
        {takeAction && (
          // <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(46,46,46,0.5)]">
          //   <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden">
          //     {/* Modal Header */}
          //     <div className="bg-[#0446db] px-6 py-4">
          //       <h2 className="text-xl font-semibold text-white">
          //         Take Action
          //       </h2>
          //     </div>

          //     {/* History List */}
          //     <div className="px-6 py-4 overflow-y-auto max-h-[60vh] space-y-4">
          //       <form
          //         onSubmit={async (e) => {
          //           e.preventDefault();
          //           const newStatus =
          //             e.target.elements.status.value;
          //           const newRemarks =
          //             e.target.elements.remarks.value;
          //           changeStatus(d.ndr_id, newStatus, newRemarks);
          //         }}
          //         className="flex  gap-2"
          //       >

          //         <div className="flex items-center gap-2">
          //           <div className=" flex-col">
          //             <div className=" flex-col">
          //               <label htmlFor="">Select</label> <br />
          //               <select
          //                 name="status"
          //                 defaultValue=""
          //                 className="text-xs w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          //                 required
          //               >
          //                 <option disabled value="">
          //                   Change Status
          //                 </option>
          //                 <option value="reattempt">Reattempt</option>
          //                 <option value="rto">RTO</option>
          //               </select>
          //             </div>
          //             <div className="my-2">
          //               <label className="mx-2">Remarks</label> <br />
          //               <input
          //                 type="text"
          //                 name="remarks"
          //                 className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          //               />
          //             </div>
          //             <button
          //               type="submit"
          //               className="bg-[#0446db] text-white text-xs px-3 py-1 rounded hover:bg-indigo-800 transition"
          //             >
          //               Update
          //             </button>
          //           </div>

          //         </div>
          //       </form>
          //     </div>

          //     {/* Modal Footer */}
          //     <div className="flex justify-end px-6 py-4">
          //       <button
          //         type="button"
          //         onClick={() => setTakeAction(null)}
          //         className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
          //       >
          //         Close
          //       </button>
          //     </div>
          //   </div>
          // </div>

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(46,46,46,0.5)] px-3 sm:px-0">
            <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-[#0446db] px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-lg sm:text-xl font-semibold text-white">
                  Take Action
                </h2>
              </div>

              {/* Modal Body */}
              <div className="px-4 sm:px-6 py-4 overflow-y-auto max-h-[60vh]">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const rot_remarks =
                      e?.target?.elements?.rot_remarks?.value || "";
                    const newStatus = e?.target?.elements?.status?.value || "";
                    const newRemarks = rot_remarks
                      ? rot_remarks
                      : e?.target?.elements?.remarks?.value || "";
                    const other_remarks =
                      e?.target?.elements?.other_remarks?.value || "";
                    const sub_remarks =
                      e?.target?.elements?.sub_remarks?.value || "";
                    const phone = e?.target?.elements?.phone?.value || "";
                    const name = e?.target?.elements?.name?.value || "";
                    const address1 = e?.target?.elements?.address1?.value || "";
                    // const address2 = e?.target?.elements?.address2?.value || "";
                    const data = {
                      action: newStatus,
                      remarks: newRemarks,
                      detailed_remarks: other_remarks,
                      sub_remarks: sub_remarks,
                      customer_name: name,
                      customer_details_address: address1,
                      customer_phone: phone,
                    };

                    changeStatus(data, takeAction);
                  }}
                  className="flex flex-col gap-1"
                >
                  {/* Status */}
                  <div>
                    <label className="text-xs font-medium dark:text-white">
                      Select
                    </label>
                    <select
                      name="status"
                      defaultValue=""
                      onChange={(e) => {
                        setNewStatus(e.target.value);
                        setRTORemarksStatus(" ");
                      }}
                      className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 mb-0 focus:ring-2 dark:text-white dark:bg-gray-800 focus:ring-indigo-400 focus:outline-none"
                      required
                    >
                      <option disabled value="">
                        Change Status
                      </option>
                      <option value="change_address">Change Address</option>
                      <option value="change_phone">Change Phone Number</option>
                      <option value="reattempt">Reattempt</option>
                      <option value="rto">RTO</option>
                    </select>
                  </div>

                  {/* change phone number */}
                  {newStatus === "change_phone" && (
                    <div>
                      <label className="text-xs font-medium dark:text-white">
                        Phone Number
                      </label>
                      <input
                        type="phone"
                        name="phone"
                        className="
                              mt-0 text-xs w-full
                              border border-gray-300
                              bg-white text-black
                              rounded-md px-2 py-2
                              focus:outline-none focus:ring-2 focus:ring-indigo-400
                              dark:bg-gray-900 dark:border-gray-700 dark:text-white
                              dark:focus:ring-indigo-500
                            "
                      />
                    </div>
                  )}
                  {newStatus === "change_address" && (
                    <>
                      <div>
                        <label className="text-xs font-medium dark:text-white">
                          Customer Name
                        </label>
                        <input
                          type="name"
                          name="name"
                          className="
                                mt-0 text-xs w-full
                                border border-gray-300
                                bg-white text-black
                                rounded-md px-2 py-2
                                focus:outline-none focus:ring-2 focus:ring-indigo-400
                                dark:bg-gray-900 dark:border-gray-700 dark:text-white
                                dark:focus:ring-indigo-500
                              "
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium dark:text-white">
                          Customer Address
                        </label>
                        <input
                          type="address1"
                          name="address1"
                          className="
  mt-0 text-xs w-full
  border border-gray-300
  bg-white text-black
  rounded-md px-2 py-2
  focus:outline-none focus:ring-2 focus:ring-indigo-400
  dark:bg-gray-900 dark:border-gray-700 dark:text-white
  dark:focus:ring-indigo-500
"
                        />
                      </div>
                      {/* <div>
                            <label className="text-xs font-medium">Customer Address2</label>
                            <input
                              type="address2"
                              name="address2"
                              className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            />
                          </div> */}
                    </>
                  )}
                  {newStatus == "rto" && (
                    <>
                      <div>
                        <label className="text-xs font-medium dark:text-white">
                          Select Remarks
                        </label>
                        <select
                          name="rot_remarks"
                          defaultValue=""
                          onChange={(e) => setRTORemarksStatus(e.target.value)}
                          className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 mb-0 focus:ring-2 dark:text-white dark:bg-gray-800 focus:ring-indigo-400 focus:outline-none"
                          required
                        >
                          <option disabled value="">
                            Remarks
                          </option>

                          <option value="Address Incorrect / Incomplete">
                            Address Incorrect / Incomplete
                          </option>
                          <option value="Customer Refused / Cancelled">
                            Customer Refused / Cancelled
                          </option>
                          <option value="Wrong Pincode / Address">
                            Wrong Pincode / Address
                          </option>
                          <option value="Wrong Contact Details">
                            Wrong Contact Details
                          </option>
                          <option value="Package Damaged">
                            Package Damaged
                          </option>
                          <option value="RTO by Seller">RTO by Seller</option>
                          <option value="Return to Hub">Return to Hub</option>
                          <option value="Return to Seller / FC">
                            Return to Seller / FC
                          </option>
                          <option value="Max. Attempts Reached">
                            Max. Attempts Reached
                          </option>
                        </select>
                      </div>
                    </>
                  )}

                  {newRTORemarkStatus === "Customer Refused / Cancelled" && (
                    <>
                      <div>
                        <label className="text-xs font-medium dark:text-white">
                          Sub Remarks
                        </label>
                        <select
                          name="sub_remarks"
                          defaultValue=""
                          // onChange={(e) => setRTORemarksStatus(e.target.value)}
                          className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 mb-0 focus:ring-2 dark:text-white dark:bg-gray-800 focus:ring-indigo-400 focus:outline-none"
                          required
                        >
                          <option disabled value="">
                            Select Sub Remarks
                          </option>

                          <option value="Duplicate Order">
                            Duplicate Order
                          </option>
                          <option value="Order Placed by Mistake">
                            Order Placed by Mistake
                          </option>
                          <option value="COD Amount Not Ready">
                            COD Amount Not Ready
                          </option>

                          <option value="Better Price Elsewhere">
                            Better Price Elsewhere
                          </option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* {
                      newStatus == 'reattempt' && (
                        <>
                          <div>
                            <label className="text-xs font-medium dark:text-white">Select Remarks</label>
                            <select
                              name="rot_remarks"
                              defaultValue=""
                              onChange={(e) => setRTORemarksStatus(e.target.value)}
                              className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 mb-0 focus:ring-2 dark:text-white dark:bg-gray-800 focus:ring-indigo-400 focus:outline-none"
                              required
                            >
                              <option disabled value="">
                                Reattempt
                              </option>

                              <option value="reattempt_approved">
                                Reattempt Approved
                              </option>

                              <option value="reattempt_assigned_to_rider">
                                Reattempt Assigned to Rider
                              </option>

                              <option value="reattempt_out_for_delivery">
                                Reattempt Out for Delivery
                              </option>

                              <option value="reattempt_rescheduled">
                                Reattempt Rescheduled
                              </option>

                              <option value="reattempt_failed">
                                Reattempt Failed
                              </option>
                            </select>
                          </div>
                        </>
                      )
                    } */}

                  <div>
                    <label className="text-xs font-medium dark:text-white">
                      Other Remarks
                    </label>
                    <input
                      type="text"
                      name="other_remarks"
                      className="
                               mt-0 text-xs w-full
                              border border-gray-300
                               bg-white text-black
                                rounded-md px-2 py-2
                                 focus:outline-none focus:ring-2 focus:ring-indigo-400
                                   dark:bg-gray-900 dark:border-gray-700 dark:text-white
                                 dark:focus:ring-indigo-500
                               "
                    />
                  </div>

                  {/* Submit */}
                  <div className=" flex gap-1 justify-end">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-[#0446db] text-white
                     text-xs px-4 py-2 rounded
                     hover:bg-indigo-800 transition cursor-pointer"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        setTakeAction(null);
                        setEditingStatusId(null);
                        setNewStatus(null);
                        setRTORemarksStatus(" ");
                      }}
                      className="w-full sm:w-auto bg-red-200 text-red-600
                     text-xs px-4 py-2 rounded cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      )
    }
    </>
  );
}

export default UserNDR;
