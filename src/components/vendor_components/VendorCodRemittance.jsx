import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Loader from "../Loader";

import { FaRegCopy } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;
const frontEndURL = import.meta.env.VITE_FRONTEND_URL;


function VendorCodRemittance() {
  const [loading, setLoading] = useState(false);
  const [vendorId, setVendorId] = useState(null);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [copySuccess, setCopySuccess] = useState(null);
  const [pendingAmount, setPendingAmount] = useState("");
  const [riders, setRiders] = useState([]);
  const [riderOptions, setRiderOptions] = useState([]);

  const [initiatedAmount, setInitiatedAmount] = useState("");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [adjustedAmount, setAdjustedAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState("");
  const [selectedBulkOrders, setSelectedBulkOrders] = useState([]);
  const [selectedBulkAmount, setSelectedBulkAmount] = useState([]);

  const filters = ["All", "Pending", "Initiated", "Adjusted", "Received"];
  const [selectedFilter, setSelectedFilter] = useState("All");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [advanceFilters, setAdvanceFilters] = useState({
    startDate: "",
    endDate: "",
    rider_id: "",
    order_id: "",
    awb_number: "",
  });
  const [filterUpdate, setFilterUpdate] = useState(false);

  //Set Default Date Range of one month from today
  const resetAdvanceFilters = async () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    setAdvanceFilters((prev) => ({
      endDate: today.toISOString().split("T")[0],
      startDate: oneMonthAgo.toISOString().split("T")[0],
      rider_id: "",
      order_id: "",
      awb_number: "",
    }));
  };

  const indianFormat = (num) => {
    const temp = num.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
    return temp;
  };

  useEffect(() => {
    resetAdvanceFilters();
  }, []);

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/vendor/getVendorCodRemittance`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            page,
            limit,
            start_date: advanceFilters.startDate,
            end_date: advanceFilters.endDate,
            rider_id: advanceFilters.rider_id,
            order_ids: advanceFilters.order_id,
            awb_numbers: advanceFilters.awb_number,
            status: selectedFilter === "All" ? "" : selectedFilter,
          },
        }
      );
     
      setData(res.data.data || []);
      setTotalPages(Math.max(1, res.data.totalPages));
      setPendingAmount(indianFormat(Number(res.data?.overallSummary?.pendingAmount)));
      setInitiatedAmount(indianFormat(Number(res.data?.overallSummary?.initiatedAmount)));
      setReceivedAmount(indianFormat(Number(res.data?.overallSummary?.receivedAmount)));
      setAdjustedAmount(indianFormat(Number(res.data?.overallSummary?.adjustedAmount)));
      setTotalAmount(
        indianFormat(
          Number(res.data?.overallSummary?.pendingAmount) +
          Number(res.data?.overallSummary?.initiatedAmount) +
            Number(res.data?.overallSummary?.receivedAmount) +
            Number(res.data?.overallSummary?.adjustedAmount)
        )
      );
      setVendorId(res.data.filters.vendor_id);
      
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to fetch data:");
    } finally {
      setLoading(false);
    }
  };

  const fetchRiders = async (order_ids) => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/vendor/getVendorRiders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          limit: 10000,
        },
      });
      setRiders(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to load riders");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedBulkOrders.length === data.length) {
      setSelectedBulkOrders([]);
      setSelectedBulkAmount(0);
    } else {
      setSelectedBulkOrders(data);
      let total = 0;
      data.forEach((d) => {
        total += Number(d.amount);
      });
      setSelectedBulkAmount(total);
    }
  };

  const handleBulkAdjustment = async () => {
    setLoading(true);
    const order_id = selectedBulkOrders.map((o) => o.order_id).join(",");
    try {
      const res = await axios.post(
        `${baseURL}/api/vendor/adjustCodRemittanceAtVendor`,
        {
          order_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSelectedBulkAmount(0);
      setSelectedBulkOrders([]);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error whilte adjusting Remittances");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRiders();
  }, [selectedFilter, page]);

  useEffect(() => {
    if (filterUpdate) {
      fetchData();
      setFilterUpdate(false);
    }
  }, [filterUpdate]);

  const handleChange = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    console.log(formData)
    try {
      const res = await axios.post(
        `${baseURL}/api/vendor/submitrecord`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("File uploaded successfully");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error while uploading file to take action on bulk orders");
    } finally {
      setLoading(false);
    }
  };

  const downloadSample = async ()=>{
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/vendor/downloadSampleFile`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sample.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to export orders");
    } finally {
      setLoading(false);
    }
  }

  const exportCSV = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/vendor/exportCodRemittance`, {
        params: {
          status: selectedFilter === "All" ? "" : selectedFilter,
          order_id: advanceFilters.order_id,
          awb_number: advanceFilters.awbNumber,
          rider_id: advanceFilters.rider_id,
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
      link.setAttribute("download", "orders.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to export orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     
        <div className="bg-gray-100 min-h-screen w-full">
          {/* Right Sidebar for filters */}
          <div
            className={`fixed rounded-tl-4xl top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
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
            <div className="p-4 w-full">
              <div className="flex flex-wrap items-end gap-4">
                {/* Start Date */}
                <div className=" w-full">
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
                    className="border w-full px-3 py-2 rounded text-sm"
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
                    onChange={(e) =>
                      setAdvanceFilters((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className="border w-full px-3 py-2 rounded text-sm"
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
                      setAdvanceFilters((prev) => ({
                        ...prev,
                        order_id: e.target.value,
                      }))
                    }
                    placeholder="Enter Id(s)"
                    className="border w-full px-3 py-2 rounded text-sm"
                  />
                </div>

                {/* AWB Number */}
                <div className=" w-full">
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
                    placeholder="Enter AWB Number(s)"
                    className="border w-full px-3 py-2 rounded text-sm"
                  />
                </div>

                {/* Rider ID */}
                <div className=" w-full">
                  <label className="block text-xs text-gray-600 mb-1">
                    Rider ID
                  </label>
                  <select
                    value={advanceFilters.rider_id}
                    onChange={(e) => {
                      setAdvanceFilters((prev) => ({
                        ...prev,
                        rider_id: e.target.value,
                      }));
                    }}
                    className="border px-3 py-2 w-full rounded"
                  >
                    <option value="">All Riders</option>
                    {riders.map((rider) => (
                      <option key={rider.id} value={rider.id}>
                        FP{vendorId}_{rider.id} | {rider.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Update Button */}
                <div className=" w-full flex">
                  <button
                    onClick={() => {
                      setFilterUpdate(true);
                      setIsFilterOpen(false);
                    }}
                    className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-1"
                  >
                    Filter
                  </button>
                  <button
                    onClick={() => {
                      resetAdvanceFilters();
                      setFilterUpdate(true);
                      setIsFilterOpen(false);
                    }}
                    className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-1"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-6 bg-[#0446DB] py-[24px] shadow-md  px-[24px]">
            <div className="flex flex-wrap items-center justify-between">
              {/* Heading */}
              <h1 className="text-2xl text-white">COD Remittances</h1>
              <div className="flex flex-wrap items-end gap-4 text-white">
                <div className="text-white">
                  <label className="pb-2.5 mx-2">Bulk Action</label>
                  <input
                    type="file"
                    name="bulk_remittance"
                    onChange={handleChange}
                    accept=".csv"
                    className="bg-white text-[#0446DB] font-medium rounded-lg shadow hover:bg-indigo-100 transition cursor-pointer file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[#0446DB] file:bg-white file:hover:bg-indigo-100"
                  />
                </div>
                <button
                  onClick={downloadSample}
                  className="bg-white text-[#0446DB] font-medium px-5 py-2 rounded-lg shadow hover:bg-indigo-100 transition"
                >
                  Sample
                </button>
                <button
                  onClick={exportCSV}
                  className="bg-white text-[#0446DB] font-medium px-5 py-2 rounded-lg shadow hover:bg-indigo-100 transition"
                >
                  Export
                </button>
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="bg-white text-[#0446DB] font-medium px-5 py-2 rounded-lg shadow hover:bg-indigo-100 transition"
                >
                  Filter
                </button>
              </div>
            </div>
          </div>

          <div className="mx-6 z-10 bg-white rounded-md">
            {/* Filters */}
            <div className="max-w-full px-4 -mt-10 relative z-10">
              <div className="flex flex-wrap justify-center gap-8 mb-6">
                {/* Status Filters */}
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setSelectedFilter(filter);
                      setPage(1);
                    }}
                    className={`px-4 py-2 rounded-full border transition font-medium mt-5 ${
                      selectedFilter === filter
                        ? "bg-[#0446DB] text-white"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {filter === "Received"
                      ? "Submitted"
                      : filter === "Adjusted"
                      ? "Received"
                      : filter}{" "}
                    (
                    {filter === "All"
                      ? totalAmount
                      : filter === "Pending"
                      ? pendingAmount
                      : filter === "Adjusted"
                      ? adjustedAmount 
                      : filter === "Initiated" 
                      ? initiatedAmount 
                      : receivedAmount}
                    )
                  </button>
                ))}
              </div>
            </div>

            {/* Bulk Assignment */}
            {selectedBulkOrders.length > 0 && selectedFilter === "Initiated" && (
              <div className="mb-10 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-5">
                  Bulk Assignment ({selectedBulkOrders.length} Selected)
                </h2>

                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border border-gray-200 rounded-md overflow-hidden">
                    <thead className="bg-gray-100 text-gray-600 text-sm font-semibold">
                      <tr>
                        <th className="px-4 py-3 text-left border-b">
                          Order ID
                        </th>
                        <th className="px-4 py-3 text-left border-b">
                          Order Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-800 text-sm">
                      {selectedBulkOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border-b">{order.id}</td>
                          <td className="px-4 py-2 border-b">
                            {Number(order.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-indigo-50 text-indigo-700 font-semibold text-sm">
                        <td className="px-4 py-2 border-t">Total Amount</td>
                        <td className="px-4 py-2 border-t">
                          {Number(selectedBulkAmount).toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => handleBulkAdjustment()}
                    className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                  >
                    Adjust COD
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                    onClick={() => {
                      setSelectedBulkOrders([]);
                      setSelectedBulkAmount(0);
                    }}
                  >
                    Clear Selected Orders
                  </button>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-xl shadow">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100 text-gray-600 font-semibold">
                  <tr>
                    {selectedFilter === "Initiated" && (
                      <th className="px-6 py-4">
                        <div>
                          <span>
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                              checked={
                                selectedBulkOrders.length === data.length
                              }
                              onChange={toggleSelectAll}
                            />
                          </span>
                        </div>
                      </th>
                    )}

                    <th className="px-6 py-3 text-left">RIDER</th>
                    <th className="px-6 py-3 text-left">ORDER ID</th>
                    <th className="px-6 py-3 text-left">AMOUNT</th>
                    <th className="px-6 py-3 text-left">RECEIVED BY</th>
                    <th className="px-6 py-3 text-left">REMARKS</th>
                    <th className="px-6 py-3 text-left">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  { 
                   loading ? (
                     <tr key={"No record found"}>
                        <td
                          colSpan="6"
                          className="text-center px-6 py-6 text-gray-500"
                        >

                          <div className=" w-full  flex justify-center items-center">
                            <div>
                              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                              <p className="mt-2">Loading COD Remittances...</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                   ) : data.length == 0 ? (
                    <tr key={"No record found"}>
                    <td
                      colSpan="6"
                      className="text-center px-6 py-6 text-gray-500"
                    >
                      No records found.
                    </td>
                  </tr>
                   ) : (
                     data.map((d, index) => {
                      let isSelected;
                      if (selectedFilter === "Initiated") {
                        isSelected = selectedBulkOrders.some(
                          (o) => o.id === d.id
                        );
                      }
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          {selectedFilter === "Initiated" && (
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (selectedFilter === "Initiated") {
                                    if (e.target.checked) {
                                      setSelectedBulkOrders((prev) => [
                                        ...prev,
                                        d,
                                      ]);
                                      setSelectedBulkAmount(
                                        (prev) =>
                                          Number(prev) + Number(d.amount)
                                      );
                                    } else {
                                      setSelectedBulkOrders((prev) =>
                                        prev.filter((o) => o.id !== d.id)
                                      );
                                      setSelectedBulkAmount(
                                        (prev) =>
                                          Number(prev) - Number(d.amount)
                                      );
                                    }
                                  }
                                }}
                                className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
                              />
                            </td>
                          )}
                          <td className="px-6 py-4">
                            {`FP${vendorId}_${d.rider_id}`}, {d.rider_name}
                          </td>
                          <td className="px-6 py-4">
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
                            <p className="text-s text-gray-500">
                              {new Date(d.updated_at).toLocaleString("en-IN", {
                                timeZone: "Asia/Kolkata",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </p>

                            <p className="text-s text-gray-400">
                              Order ID:{" "}
                              {d.merchant_order_id?.length <= 20
                                ? d.merchant_order_id
                                : d.merchant_order_id?.slice(0, 20) + "..."}
                              <button
                                className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    d.merchant_order_id
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
                          </td>
                          <td className="px-6 py-4">{d.amount}</td>
                          <td className="px-6 py-4">{d.received_by || "-"}</td>
                          <td className="px-6 py-4">{d.remarks || "NA"}</td>
                          <td className="px-6 py-4">
                            {d.status === "pending" ? (
                              <button className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full">
                                Pending
                              </button>
                            ) : d.status === "initiated" ? (
                              <button className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                                Initiated
                              </button>
                            ) : d.status === "adjusted" ? (
                              <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full">
                                Received
                              </span>
                            ) : (
                              <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                                Submitted
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                   )
                  
                  }
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="py-3 flex justify-center items-center gap-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  page === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#0446DB] text-white hover:bg-indigo-800"
                }`}
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  page === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#0446DB] text-white hover:bg-indigo-800"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
     
    </>
  );
}

export default VendorCodRemittance;
