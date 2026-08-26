
import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../../Loader";

import { FaRegCopy, FaFilter, FaDownload, FaHistory, FaTimes, FaFileUpload, FaFileCsv } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
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
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { TbFileInfo } from "react-icons/tb";
const baseURL = import.meta.env.VITE_BASE_URL;

function TechMerchantNDR() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [historyItem, setHistoryItem] = useState(null);
  const [copySuccess, setCopySuccess] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [newStatus, setNewStatus] = useState(null);


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

  const handleChange = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (!file) {
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
        `${baseURL}/api/techbasedmerchant/handleMerchantNDRBulkAction`,
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

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/techbasedmerchant/getMerchantNDRs`, {
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
      toast.error(err.response?.data?.message || err.message || "Failed to fetch NDR data:");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedFilter, filterUpdate, page]);

  /* Handle Change Status */
  const changeStatus = async (data, ndr_id) => {


    setLoading(true);
    try {
      await axios.post(
        `${baseURL}/api/techbasedmerchant/handleMerchantNDRAction/${ndr_id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      await fetchData();
      setEditingStatusId(null);
      toast.success(res?.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to take action on current NDR's status");
    } finally {
      setLoading(false);
    }
  };

  /* Fetch History */
  const handleHistoryClick = async (d) => {
    
    try {
      const res = await axios.get(
        `${baseURL}/api/techbasedmerchant/getOrderDetailsByMerchant`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            awb_number: d.awb_number,
          },
        }
      );
      setHistoryItem(res.data.ndr_details?.actions);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error while fetching history data of the order");
    } finally {
      setLoading(false);
    }
  };

  const Sample = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/techbasedmerchant/downloadMerchantNDRSampleFile`,
        {

          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "NDR Action Format.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Sample file downloaded successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to export orders");
    } finally {
      setLoading(false);
    }
  };
  const exportCSV = async () => {

    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/api/techbasedmerchant/exportNDRs`,
        {

        },
        {
          params: {
            start_date: advanceFilters.startDate,
            end_date: advanceFilters.endDate,
            awb_number: advanceFilters.awb_number,
            statusType: selectedFilter,
          },

          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "NDR Action Format.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Sample file downloaded successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to export orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'actionable': 'bg-orange-100 text-orange-800 border-orange-200',
      'actiontaken': 'bg-blue-100 text-blue-800 border-blue-200',
      'rto': 'bg-red-100 text-red-800 border-red-200',
      'delivered': 'bg-green-100 text-green-800 border-green-200',
      'default': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return statusColors[status] || statusColors.default;
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Header Section */}
          <header className="bg-[#0446DB] shadow-lg">
            <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="text-center lg:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">NDR Management</h1>
                  <p className="text-indigo-100 mt-2 text-sm sm:text-base">Manage Non-Delivery Reports efficiently</p>
                </div>

                <div className="flex flex-row md:flex gap-2 items-center">
                  {/* Bulk Action */}
                  <div className="relative">
                    <label className="flex items-center gap-2 bg-white text-[#0446DB] font-medium px-4 py-2 md:py-1 rounded-xl shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 cursor-pointer">
                      <FaFileUpload className="w-4 h-4" />
                      <span className="hidden sm:inline">Bulk Action</span>
                      <input
                        type="file"
                        name="bulk_ndr"
                        onChange={handleChange}
                        accept=".csv"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={Sample}
                      className="flex items-center gap-2 bg-white text-[#0446DB] font-medium px-4 py-3 rounded-xl shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300"
                    >
                      <FaFileCsv className="w-4 h-4" />
                      <span className="">Sample</span>
                    </Button>
                    <Button
                      onClick={exportCSV}
                      className="flex items-center gap-2 bg-white text-[#0446DB] font-medium px-4 py-3 rounded-xl shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300"
                    >
                      <FaFileCsv className="w-4 h-4" />
                      <span className="">Export</span>
                    </Button>

                    {/* <Button
                      onClick={() => setIsFilterOpen(true)}
                      className="flex items-center gap-2 bg-white text-[#0446DB] font-medium px-4 py-3 rounded-xl shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300"
                    >
                      <FaFilter className="w-4 h-4" />
                      <span className="">Filters</span>
                    </Button> */}
                    <Drawer direction="right">
                      <DrawerTrigger asChild>

                        <Button variant="outline"
                          className="flex items-center gap-2 bg-white text-[#0446DB] font-medium px-4 py-3 rounded-xl shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300"
                        >
                          <FaFilter className="text-sm" />
                          <span>Filter</span>
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>Filter</DrawerTitle>
                          {/* <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}
                        </DrawerHeader>
                        <div className="p-6 h-[calc(100vh-80px)] overflow-y-auto">
                          <div className="space-y-4">
                            {/* Date Range */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                />
                              </div>
                            </div>

                            {/* NDR ID */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                AWB No
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
                                placeholder="Enter AWB Number"
                                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                            <DrawerClose asChild>

                              <Button
                                onClick={() => {
                                  setFilterUpdate((prev) => !prev);
                                  setIsFilterOpen(false);
                                }}
                                className="flex-1 bg-[#0446DB]  px-4 py-3 rounded-lg  transition-colors duration-200 font-medium shadow-md"
                              >
                                Apply Filters
                              </Button>
                            </DrawerClose>
                            <DrawerClose asChild>

                              <Button
                                onClick={() => {
                                  resetAdvanceFilters();
                                  setFilterUpdate((prev) => !prev);
                                  setIsFilterOpen(false);
                                }}
                                className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium shadow-md"
                              >
                                Reset
                              </Button>
                            </DrawerClose>
                          </div>
                        </div>
                        <DrawerFooter>

                          <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Filters Sidebar */}
          <div
            className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isFilterOpen ? "translate-x-0" : "translate-x-full"
              }`}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaFilter className="text-[#0446DB]" />
                Advanced Filters
              </h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 h-[calc(100vh-80px)] overflow-y-auto">
              <div className="space-y-4">
                {/* Date Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                {/* NDR ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    placeholder="Enter AWB Number"
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setFilterUpdate((prev) => !prev);
                    setIsFilterOpen(false);
                  }}
                  className="flex-1 text-[#0446DB] text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-md"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    resetAdvanceFilters();
                    setFilterUpdate((prev) => !prev);
                    setIsFilterOpen(false);
                  }}
                  className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium shadow-md"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className=" mx-auto px-4 sm:px-6 lg:px-8 -mt-3 relative z-10">
            <div className="w-full  bg-white   rounded shadow-2xl  dark:bg-gray-900   left-0 px-4 z-40   ">
              <div className="relative flex justify-center ">
                <div
                  className="flex  overflow-x-auto  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-4"
                >
                  <div className="flex gap-2  min-w-max px-8 mt-0"> {/* Added padding on sides */}
                    {filters?.map((filter, index) => (
                      <Button
                        key={index}
                      
                        onClick={() => {
                          setSelectedFilter(filter[1]);
                          setPage(1);
                        }}

                        className={`px-5 py-2.5 rounded-full my-2 border transition-all duration-300 font-medium text-sm tracking-wide ${selectedFilter === filter[1]
                          ? "bg-[#0446DB] text-white  border-transparent"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]"
                          }`}
                      >
                        {filter[0]}

                      </Button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* NDR Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                {data.length > 0 ? (
                  <>
                    {/* Desktop Table */}
                    <table className=" min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            NDR Information
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Order Details
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Customer Information
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Status & Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {data.map((d) => (
                          <tr key={d.ndr_id} className="hover:bg-gray-50 transition-colors duration-200">
                            {/* NDR Information */}
                            <td className="px-6">
                              <div className="">
                                <p className="font-semibold text-gray-800">NDR #{d.ndr_id}</p>
                                <p className="text-sm text-gray-500">
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

                              </div>
                            </td>

                            {/* Order Details */}
                            <td className="px-2 ">
                              <div className="">
                                <div className=" flex items-center" >
                                  <p className="text-sm font-medium whitespace-nowrap text-gray-600">Order ID: </p>
                                  <p className="font-semibold whitespace-nowrap text-gray-800">{d.id}</p>
                                </div>
                                <div className=" flex items-center">
                                  <p className="text-sm font-medium whitespace-nowrap text-gray-600">Merchant Order ID: </p>
                                  <p className="text-gray-800">{d.merchant_order_id}</p>
                                </div>
                                <div className=" flex items-center">
                                  <p className="text-sm font-medium whitespace-nowrap text-gray-600">AWB Number: </p>
                                  <div className="flex items-center gap-2">
                                    <p className="font-mono text-gray-800">{d.awb_number}</p>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(d.awb_number);
                                        setCopySuccess(d.awb_number);
                                        setTimeout(() => setCopySuccess(null), 2000);
                                        toast.success("AWB copied to clipboard");
                                      }}
                                      className="text-gray-400 hover:text-[#0446DB] transition-colors duration-200 p-1 rounded"
                                    >
                                      {copySuccess === d.awb_number ? (
                                        <CiCircleCheck className="w-4 h-4 text-green-500" />
                                      ) : (
                                        <FaRegCopy className="w-4 h-4" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Customer Information */}
                            <td className="px-2 ">
                              <div className=" ">
                                <p className="font-semibold text-gray-800 whitespace-nowrap">{d.delivery_contact_name}</p>
                                <p className="text-sm text-gray-600">{d.delivery_address_line}</p>
                                <p className="text-sm text-gray-500 whitespace-nowrap">
                                  {d.delivery_city}, {d.delivery_state} - {d.delivery_pincode}
                                </p>
                                <p className="text-xs text-gray-400">{d.delivery_country}</p>
                              </div>
                            </td>

                            {/* Status & Actions */}
                            <td className="px-2 ">
                              <div className=" flex items-center gap-1">
                                <div>
                                  <span className={`px-3 py-2 rounded-full whitespace-nowrap text-sm font-semibold border ${getStatusColor(d.status)}`}>
                                    {toCapitalizeEachWord(d.status) || "Pending"}
                                  </span>
                                </div>

                                {selectedFilter === "actionable" && (
                                  <div>
                                    {/* {editingStatusId === d.ndr_id ? (
                                      <form
                                        onSubmit={async (e) => {
                                          e.preventDefault();
                                          const newStatus = e.target.elements.status.value;
                                          const newRemarks = e.target.elements.remarks.value;
                                          changeStatus(d.ndr_id, newStatus, newRemarks);
                                        }}
                                        className="space-y-3 bg-gray-50 rounded-lg p-4"
                                      >
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Remarks
                                          </label>
                                          <input
                                            type="text"
                                            name="remarks"
                                            placeholder="Enter remarks..."
                                            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                            required
                                          />
                                        </div>
                                        <div className="flex gap-2">
                                          <select
                                            name="status"
                                            defaultValue=""
                                            className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                            required
                                          >
                                            <option value="" disabled>Select Action</option>
                                            <option value="reattempt">Reattempt Delivery</option>
                                            <option value="rto">Return to Origin</option>
                                          </select>
                                          <button
                                            type="submit"
                                            className="text-[#0446DB] text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
                                          >
                                            Update
                                          </button>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => setEditingStatusId(null)}
                                          className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                        >
                                          Cancel
                                        </button>
                                      </form>
                                    ) : (
                                      <button
                                        onClick={() => setEditingStatusId(d.ndr_id)}
                                        className="w-full text-[#0446DB] text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium text-sm"
                                      >
                                        Take Action
                                      </button>
                                    )} */}
                                    <Button
                                      onClick={() => setEditingStatusId(d.ndr_id)}
                                      className="flex items-center gap-2 text-white bg-[#0446DB] font-medium px-4 py-3 rounded-xl transition-all cursor-pointer duration-300"
                                    >
                                      Take Action
                                    </Button>
                                  </div>
                                )}

                                <Dialog className='w-5xl'>

                                  <DialogTrigger
                                    onClick={() => handleHistoryClick(d)}
                                    asChild>
                                    <Button

                                      variant="outline" className="text-xs font-medium  text-red-600  inline-block cursor-pointer ">
                                      <span >
                                        <TbFileInfo />
                                      </span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-4xl">
                                    <DialogHeader>
                                      <DialogTitle>NDR Action History</DialogTitle>

                                    </DialogHeader>

                                    <div >
                                      {historyItem && historyItem.length > 0 ? (
                                        <div className="space-y-4">
                                          {historyItem.map((item, index) => (
                                            <div
                                              key={item.action_id}
                                              className="border border-[#0446DB] rounded-lg p-4 bg-gray-50"
                                            >
                                              <div className="text-sm font-medium text-gray-800 mb-1">
                                                {item.action_taken === 'change_address' ? <span className=" font-semibold text-gray-900" >Change Address</span> : item.action_taken === 'change_phone' ? <span className=" font-semibold text-gray-900" >Change Phone Number</span> : item.action_taken === 'reattempt' ? < span className=" font-semibold text-gray-900" >Reattempt</span> : < span className=" font-semibold text-gray-900" >{item.action_taken}</span>

                                                }
                                              </div>
                                              <div className="text-sm text-gray-600 mb-1">
                                                {
                                                  item.action_taken == 'change_phone' ? (
                                                    <>
                                                      <span className="font-semibold">Phone Number:</span>{" "}
                                                      {item.customer_phone}
                                                    </>
                                                  ) : item.action_taken == 'change_address' ? (
                                                    <>
                                                      <>
                                                        <span className="font-semibold">Name:</span>{" "}
                                                        {item.customer_name} <br />
                                                        <span className="font-semibold">Address:</span>{" "}
                                                        {item.customer_details_address}
                                                      </>
                                                    </>
                                                  ) : (
                                                    <>
                                                      <span className="font-semibold">Remarks:</span>{" "}
                                                      {item.remarks}
                                                    </>
                                                  )
                                                }

                                              </div>
                                              <div className="text-sm text-gray-600 mb-1">
                                                <span className="font-semibold">Date/Time:</span>{" "}

                                                {new Date(item.created_at).toLocaleString("en-IN", {
                                                  timeZone: "Asia/Kolkata",
                                                  day: "2-digit",
                                                  month: "2-digit",
                                                  year: "numeric",
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                  hour12: true,
                                                })}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="text-center py-8 text-gray-500">
                                          No history found for this NDR
                                        </div>
                                      )}
                                    </div>


                                    <DialogFooter>

                                      <DialogClose asChild>

                                        <Button variant="outline">Cancel</Button>
                                      </DialogClose>

                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>

                                {/* <button
                                  onClick={() => handleHistoryClick(d)}
                                  className="flex items-center gap-2 whitespace-nowrap text-[#0446DB] hover:text-indigo-800 transition-colors duration-200 text-sm font-medium"
                                >
                                  <FaHistory className="w-4 h-4" />
                                  View History
                                </button> */}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>


                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FaHistory className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-lg font-medium text-gray-400">No NDR records found</p>
                      <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {data.length > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-sm text-gray-700">
                      Showing page {page} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${page === 1
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "text-[#0446DB] text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          }`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${page === totalPages
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "text-[#0446DB] text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* History Modal */}


          {
            editingStatusId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(46,46,46,0.5)] px-3 sm:px-0">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden">

                  {/* Modal Header */}
                  <div className="bg-[#0446DB] px-4 sm:px-6 py-3 sm:py-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">
                      Take Action
                    </h2>
                  </div>

                  {/* Modal Body */}
                  <div className="px-4 sm:px-6 py-4 overflow-y-auto max-h-[60vh]">
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const newStatus = e?.target?.elements?.status?.value || "";
                        const newRemarks = e?.target?.elements?.remarks?.value || "";
                        const phone = e?.target?.elements?.phone?.value || "";
                        const name = e?.target?.elements?.name?.value || "";
                        const address1 = e?.target?.elements?.address1?.value || "";
                        // const address2 = e?.target?.elements?.address2?.value || "";
                        const data = {
                          action: newStatus,
                          remarks: newRemarks,
                          customer_name: name,
                          customer_details_address: address1,
                          customer_phone: phone
                        }
                        changeStatus(data, editingStatusId);
                      }}

                      className="flex flex-col gap-1"
                    >
                      {/* Status */}
                      <div>
                        <label className="text-xs font-medium">Select</label>
                        <select
                          name="status"
                          defaultValue=""
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 mb-0 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
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
                      {
                        newStatus === 'change_phone' && (
                          <div>
                            <label className="text-xs font-medium">Phone Number</label>
                            <input
                              type="phone"
                              name="phone"
                              className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            />
                          </div>
                        )
                      }
                      {
                        newStatus === 'change_address' && (
                          <>
                            <div>
                              <label className="text-xs font-medium">Customer Name</label>
                              <input
                                type="name"
                                name="name"
                                className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium">Customer Address</label>
                              <input
                                type="address1"
                                name="address1"
                                className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
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
                        )
                      }
                      {/* Remarks */}
                      <div>
                        <label className="text-xs font-medium">Remarks</label>
                        <input
                          type="text"
                          name="remarks"
                          className="mt-1 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        />
                      </div>

                      {/* Submit */}
                      <div className=" flex gap-1 justify-end">
                        <button
                          type="submit"
                          className="w-full sm:w-auto bg-[#0446DB] text-white
                     text-xs px-4 py-2 rounded
                     hover:bg-indigo-800 transition cursor-pointer"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => setEditingStatusId(null)}
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
            )
          }
        </div>
      )}
    </>
  );
}

export default TechMerchantNDR;
