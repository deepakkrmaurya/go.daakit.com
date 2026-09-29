import { useState, useEffect } from "react";
import axios from "axios";

import { FaFilter, FaRegCopy } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { toast } from "react-toastify";
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
import { Download, Filter, Landmark, Loader2, Upload } from "lucide-react";
import { Link } from "react-router-dom";
const baseURL = import.meta.env.VITE_BASE_URL;
const frontEndURL = import.meta.env.VITE_FRONTEND_URL;

function CODRemittances() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [copySuccess, setCopySuccess] = useState(null);
  const filters = ["All", "Pending", "Initiated", "Adjusted", "Received"];
  const [pendingAmount, setPendingAmount] = useState(0);
  const [initiatedAmount, setInitiatedAmount] = useState(0);
  const [adjustedAmount, setAdjustedAmount] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    orderId: "",
    remarks: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [advanceFilters, setAdvanceFilters] = useState({
    startDate: "",
    endDate: "",
    order_id: "",
    awbNumber: "",
    vendor_id: "",
    rider_id: "",
  });
  const [filterUpdate, setFilterUpdate] = useState(false);

  //Set Default Date Range of one month from today
  const resetAdvanceFilters = async () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    setAdvanceFilters({
      endDate: today.toISOString().split("T")[0],
      startDate: oneMonthAgo.toISOString().split("T")[0],
      order_id: "",
      awbNumber: "",
      vendor_id: "",
      rider_id: "",
    });
  };

  useEffect(() => {
    resetAdvanceFilters();
  }, []);

  const openDatePicker = (event) => {
    try {
      event.currentTarget.showPicker?.();
    } catch {
      // Some browsers block programmatic picker opening; normal focus still works.
    }
  };

  const updateAdvanceFilter = (name, value) => {
    setAdvanceFilters((prev) => {
      if (name === "startDate") {
        return {
          ...prev,
          startDate: value,
          endDate:
            prev.endDate && value && prev.endDate < value
              ? value
              : prev.endDate,
        };
      }

      if (name === "endDate") {
        return {
          ...prev,
          startDate:
            prev.startDate && value && prev.startDate > value
              ? value
              : prev.startDate,
          endDate: value,
        };
      }

      return { ...prev, [name]: value };
    });
  };

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
    setFilterUpdate((prev) => !prev);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    resetAdvanceFilters();
    setPage(1);
    setFilterUpdate((prev) => !prev);
    setIsFilterOpen(false);
  };

  const indianFormat = (num) => {
    const temp = num.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
    return temp;
  };

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/admin/cod-remittance`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          page,
          limit,
          start_date: advanceFilters.startDate,
          end_date: advanceFilters.endDate,
          order_id: advanceFilters.order_id,
          awb_number: advanceFilters.awbNumber,
          rider_id: advanceFilters.rider_id,
          vendor_id: advanceFilters.vendor_id,
          status: selectedFilter === "All" ? "" : selectedFilter,
        },
      });
      setData(res.data?.data || []);
      setTotalPages(Math.max(1, res.data.pagination?.totalPages));
      setPendingAmount(
        indianFormat(Number(res.data?.overallStatusSummary?.pending)),
      );
      setInitiatedAmount(
        indianFormat(Number(res.data?.overallStatusSummary?.initiated)),
      );
      setAdjustedAmount(
        indianFormat(Number(res.data?.overallStatusSummary?.adjusted)),
      );
      setReceivedAmount(
        indianFormat(Number(res.data?.overallStatusSummary?.received)),
      );
      setTotalAmount(
        indianFormat(
          Number(res.data?.overallStatusSummary?.received) +
            Number(res.data?.overallStatusSummary?.initiated) +
            Number(res.data?.overallStatusSummary?.pending) +
            Number(res.data?.overallStatusSummary?.adjusted),
        ),
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to fetch data:",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedFilter, filterUpdate, page]);

  const handleEditClick = (item) => {
    setEditItem(item);
    setFormData({
      orderId: item.order_id,
      remarks:
        selectedFilter === "Pending"
          ? "Remittance is received  by Admin"
          : selectedFilter === "Adjusted"
            ? "Remittance is received by Admin"
            : "Remittance is received by Admin",
      receivedBy: item.receivedBy || "",
    });
  };

  //Update Status and Remarks
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/api/admin/updateCODRemittance/${formData.orderId}`,
        {
          remarks: formData.remarks,
          status: "received",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      fetchData();
      setEditItem(null);
      setFormData({ orderId: "", remarks: "", receivedBy: "" });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Error while updating remittance",
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
      const res = await axios.post(
        `${baseURL}/api/admin/uploadCODRemittance`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log(res.data);
      toast.success("File uploaded successfully");
      fetchData();
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to upload file",
      );
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/admin/exportCodRemittance`, {
        params: {
          status: selectedFilter === "All" ? "" : selectedFilter,
          order_id: advanceFilters.order_id,
          awb_number: advanceFilters.awbNumber,
          rider_id: advanceFilters.rider_id,
          vendor_id: advanceFilters.vendor_id,
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
      link.setAttribute("download", "cod_remittances.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Error in exporting CSV file",
      );
    } finally {
      setLoading(false);
    }
  };
  const SampleCSV = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/admin/downloadCODRemittanceSample`,
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
      link.setAttribute("download", "Cod_Sample.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Error in exporting CSV file",
      );
    } finally {
      setLoading(false);
    }
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
      {loadingPage ? (
        <>
          <div className=" w-full h-[90vh] flex justify-center items-center">
            <div>
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2"> Loading COD Remittances Details...</p>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen w-full">
          {/* Right Sidebar for filters */}

          {/* Heading */}
          <div className="mb-0  dark:bg-gray-900 py-2 md:h-20 px-[24px]">
            <div className="flex flex-wrap items-center justify-between">
              {/* Heading */}
              <h1 className="text-2xl font-bold dark:text-white">
                COD Remittances
              </h1>
              <div className="flex flex-wrap items-end gap-4 text-white">
                <Button
                  asChild
                  className="
      flex h-10 cursor-pointer items-center gap-2
      rounded-md border border-blue-100
      bg-white px-4 text-sm font-medium
      text-[#0446DB] shadow-sm
      transition-all
      hover:bg-blue-50 hover:shadow-md
      dark:border-gray-700 dark:bg-gray-800
      dark:text-blue-400 dark:hover:bg-gray-700
    "
                >
                  <Link
                    to="/admin/vendor-remittances"
                    className="flex items-center gap-2"
                  >
                    <Landmark size={17} />
                    Vendor Remittances
                  </Link>
                </Button>
                <label
                  className="
      flex h-10 cursor-pointer items-center gap-2
      rounded-md border border-blue-100
      bg-white px-4 text-sm font-medium
      text-[#0446DB] shadow-sm
      transition-all
      hover:bg-blue-50 hover:shadow-md
      dark:border-gray-700 dark:bg-gray-800
      dark:text-blue-400 dark:hover:bg-gray-700
    "
                >
                  <Upload size={17} />

                  <span>Upload CSV</span>

                  <input
                    type="file"
                    name="bulk_remittance"
                    onChange={handleChange}
                    accept=".csv"
                    className="hidden"
                  />
                </label>
                <Button
                  onClick={SampleCSV}
                  className="
      flex h-10 items-center gap-2 rounded-md
      border border-blue-100 bg-white px-4
      font-medium text-[#0446DB] shadow-sm
      transition-all
      hover:bg-blue-50 hover:text-[#0446DB]
      hover:shadow-md
      dark:border-gray-700 dark:bg-gray-800
      dark:text-blue-400 dark:hover:bg-gray-700
    "
                >
                  <Download size={17} />
                  Sample CSV
                </Button>
                <Button
                  onClick={exportCSV}
                  className="
      flex h-10 items-center gap-2 rounded-md
      border border-blue-100 bg-white px-4
      font-medium text-[#0446DB] shadow-sm
      transition-all
      hover:bg-blue-50 hover:text-[#0446DB]
      hover:shadow-md
      dark:border-gray-700 dark:bg-gray-800
      dark:text-blue-400 dark:hover:bg-gray-700
    "
                >
                  <Download size={17} />
                  Export
                </Button>

                <Drawer
                  direction="right"
                  open={isFilterOpen}
                  onOpenChange={setIsFilterOpen}
                >
                  <DrawerTrigger asChild>
                    <Button
                      variant="outline"
                      className="
          flex h-10 items-center gap-2 rounded-md
          border border-blue-100 bg-white px-4
          font-medium text-[#0446DB] shadow-sm
          transition-all
          hover:bg-blue-50 hover:text-[#0446DB]
          hover:shadow-md
          dark:border-gray-700 dark:bg-gray-800
          dark:text-blue-400 dark:hover:bg-gray-700
        "
                    >
                      <Filter size={17} />
                      <span>Filter</span>
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Filter</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          applyFilters();
                          setIsFilterOpen(false);
                        }}
                        className="flex-col  w-full  items-end gap-4"
                      >
                        <div className="p-4">
                          <div className="flex flex-wrap items-end gap-4">
                            {/* Start Date */}
                            <div className=" w-full">
                              <label className="block text-xs text-gray-600 mb-1">
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
                                className="border flex w-full  px-3 py-2 rounded-md text-sm cursor-pointer bg-white text-gray-900 dark:bg-gray-900 dark:text-white"
                              />
                            </div>

                            {/* End Date */}
                            <div className=" w-full">
                              <label className="block text-xs text-gray-600 mb-1">
                                End Date
                              </label>
                              <input
                                type="date"
                                value={advanceFilters.endDate}
                                min={advanceFilters.startDate || undefined}
                                onChange={(e) =>
                                  updateAdvanceFilter("endDate", e.target.value)
                                }
                                onClick={openDatePicker}
                                onFocus={openDatePicker}
                                className="border flex w-full px-3 py-2 rounded-md text-sm cursor-pointer bg-white text-gray-900 dark:bg-gray-900 dark:text-white"
                              />
                            </div>

                            {/* Order ID */}
                            <div className=" w-full">
                              <label className="block text-xs text-gray-600 mb-1">
                                Order ID
                              </label>
                              <input
                                type="text"
                                value={advanceFilters.order_id}
                                onChange={(e) =>
                                  updateAdvanceFilter(
                                    "order_id",
                                    e.target.value,
                                  )
                                }
                                placeholder="Enter Id(s)"
                                className="border w-full px-3 py-2 rounded-md text-sm"
                              />
                            </div>

                            {/* AWB Number */}
                            <div className=" w-full">
                              <label className="block text-xs text-gray-600 mb-1">
                                AWB Number
                              </label>
                              <input
                                type="text"
                                value={advanceFilters.awbNumber}
                                onChange={(e) =>
                                  updateAdvanceFilter(
                                    "awbNumber",
                                    e.target.value,
                                  )
                                }
                                placeholder="Enter AWB Number(s)"
                                className="border px-3 w-full py-2 rounded-md text-sm"
                              />
                            </div>

                            {/* Rider ID */}
                            <div className=" w-full">
                              <label className="block text-xs text-gray-600 mb-1">
                                Rider ID
                              </label>
                              <input
                                type="number"
                                value={advanceFilters.rider_id}
                                onChange={(e) =>
                                  updateAdvanceFilter(
                                    "rider_id",
                                    e.target.value,
                                  )
                                }
                                placeholder="Integer Only"
                                className="border px-3 w-full py-2 rounded-md text-sm"
                              />
                            </div>

                            {/* Vendor ID */}
                            <div className=" w-full">
                              <label className="block text-xs text-gray-600 mb-1">
                                Vendor ID
                              </label>
                              <input
                                type="number"
                                value={advanceFilters.vendor_id}
                                onChange={(e) =>
                                  updateAdvanceFilter(
                                    "vendor_id",
                                    e.target.value,
                                  )
                                }
                                placeholder="Integer Only"
                                className="border px-3 w-full py-2 rounded-md text-sm"
                              />
                            </div>

                            {/* Update Button */}
                            <div className=" w-full flex">
                              <button
                                type="submit"
                                onClick={applyFilters}
                                className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
                              >
                                Filter
                              </button>
                              <button
                                type="button"
                                onClick={resetFilters}
                                className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
                              >
                                Reset
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                    <DrawerFooter>
                      <Button
                        onClick={() => setIsFilterOpen(false)}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          </div>

          <div className="mx-1 z-10 bg-white dark:bg-gray-900 rounded-md">
            <div className="w-full  justify-center bg-white  rounded shadow-2xl  dark:bg-gray-900   left-0 px-4 z-40   ">
              <div className="relative ">
                <div className=" flex md:justify-center  overflow-x-auto  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2">
                  <div className="flex gap-2 min-w-max px-8 mt-3">
                    {filters.map((filter) => (
                      <Button
                        key={filter}
                        onClick={() => {
                          setSelectedFilter(filter);
                          setPage(1);
                        }}
                        className={`px-4 py-2 rounded-full border transition font-medium mt-0 ${
                          selectedFilter === filter
                            ? "bg-[#0446DB] text-white"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {filter}(
                        {filter === "All"
                          ? `${totalAmount}`
                          : filter === "Pending"
                            ? `${pendingAmount}`
                            : filter === "Initiated"
                              ? `${initiatedAmount}`
                              : filter === "Adjusted"
                                ? `${adjustedAmount}`
                                : filter === "Received"
                                  ? `${receivedAmount}`
                                  : filter}
                        )
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Table */}
            <div className="overflow-x-auto bg-white dark:bg-gray-900">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6 py-3 text-left">
                      RIDER ID
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left">
                      ORDER ID
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left">
                      AMOUNT
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left">
                      RECEIVED BY
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left">
                      REMARKS
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left">
                      STATUS
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <>
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-10">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                          <p className="mt-2">Loading Remittances...</p>
                        </TableCell>
                      </TableRow>
                    </>
                  ) : data.length == 0 ? (
                    <>
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-10">
                          No found
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    data.map((d, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell className="px-6 py-4 dark:text-white">
                            {d.vendor_id
                              ? `FP_${d.vendor_id}_${d.rider_id}`
                              : `DKT_${d.rider_id}`}
                            {}
                          </TableCell>

                          <TableCell className="px-6 py-4">
                            <p className="text-l text-gray-800 flex items-center">
                              <a
                                href={`${frontEndURL}/track-order?awb_number=${d.awb_number}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-blue-700 hover:text-blue-500"
                              >
                                {d.awb_number}
                              </a>
                              <button
                                className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
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
                            <p className="text-s text-gray-500 dark:text-white">
                              {new Date(d.submitted_at).toLocaleString(
                                "en-IN",
                                {
                                  timeZone: "Asia/Kolkata",
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                },
                              )}
                            </p>

                            <p className="text-s text-gray-400 dark:text-white">
                              Merchant ID: {d.merchant_id}
                            </p>
                            <p className="text-s text-gray-400 whitespace-nowrap">
                              Order ID:{" "}
                              {d.merchant_order_id?.length <= 20
                                ? d.merchant_order_id
                                : d.merchant_order_id?.slice(0, 20) + "..."}
                              <button
                                className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
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
                          </TableCell>
                          <TableCell className="px-6 py-4 dark:text-white">
                            {d.amount}
                          </TableCell>
                          <TableCell className="px-6 py-4 dark:text-white">
                            {d.received_by || "-"}
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap dark:text-white">
                            {d.remarks || "NA"}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            {d.status === "received" ? (
                              <span className="text-green-800 bg-green-100 hover:bg-green-200 font-medium px-3 py-1 rounded-full">
                                Received
                              </span>
                            ) : (
                              <button onClick={() => handleEditClick(d)}>
                                <>
                                  {d.status === "pending" ? (
                                    <span className="text-red-800 bg-red-100 hover:bg-red-200 font-medium px-3 py-1 rounded-full">
                                      Pending
                                    </span>
                                  ) : d.status === "initiated" ? (
                                    <span className="text-yellow-800 bg-yellow-100 hover:bg-yellow-200 font-medium px-3 py-1 rounded-full">
                                      Initiated
                                    </span>
                                  ) : d.status === "received" ? (
                                    <span className="text-green-800 bg-green-100 hover:bg-green-200 font-medium px-3 py-1 rounded-full">
                                      Received
                                    </span>
                                  ) : d.status === "adjusted" ? (
                                    <span className="text-blue-800 bg-blue-100 hover:bg-blue-200 font-medium px-3 py-1 rounded-full hover:cursor-pointer">
                                      Adjusted
                                    </span>
                                  ) : (
                                    <span className="text-blue-800 bg-blue-100 hover:bg-blue-200 font-medium px-3 py-1 rounded-full">
                                      {d.status}
                                    </span>
                                  )}
                                </>
                              </button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center items-center gap-4">
              <Button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-sm text-sm font-medium ${
                  page === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#0446DB] text-white hover:bg-indigo-800"
                }`}
              >
                Previous
              </Button>
              <span className="text-gray-700">
                Page {page} of {totalPages}
              </span>
              <Button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-sm text-sm font-medium ${
                  page === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#0446DB] text-white hover:bg-indigo-800"
                }`}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Modal */}
          {editItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(46,46,46,0.5)]">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                {/* Modal Header */}
                <div className="bg-[#0446DB] px-6 py-4">
                  <h2 className="text-xl font-semibold text-white">
                    Update Remittance
                  </h2>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
                  {/* Order ID */}
                  <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">
                      Order ID
                    </label>
                    <input
                      type="text"
                      value={formData.orderId}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-sm"
                    />
                  </div>

                  {/* Remarks */}
                  <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">
                      Remarks
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm"
                      value={formData.remarks}
                      onChange={(e) =>
                        setFormData({ ...formData, remarks: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* New Status */}
                  <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">
                      New Status
                    </label>
                    <input
                      type="text"
                      value="Received"
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 bg-green-100 text-green-500 rounded-sm"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditItem(null)}
                      className="px-5 py-2 rounded-sm bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-sm bg-[#0446DB] text-white hover:bg-indigo-800 transition"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default CODRemittances;
