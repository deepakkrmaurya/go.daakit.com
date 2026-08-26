
import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

import Loader from "../Loader";

import { TbFileInfo } from "react-icons/tb";
import { FaSearch } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_BASE_URL;
const frontEndURL = import.meta.env.VITE_FRONTEND_URL;

const options = [
  { value: "Bangalore", label: "Bangalore" },
  { value: "Delhi", label: "Delhi" },
  { value: "Gurugram", label: "Gurugram" },
  { value: "Noida", label: "Noida" },
];

function S() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copySuccess, setCopySuccess] = useState(null);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [riders, setRiders] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [popup, setPopup] = useState(null);

  const [limitReached, setLimitReached] = useState(false);
  const [assignmentState, setAssignmentState] = useState("");
  const [isOpenIndividualAssignmnet, setIsOpenIndividualAssignmnet] = useState("");
  const [isOpenIndividualVendorAssignmnet, setIsOpenIndividualVendorAssignmnet] = useState("");
  const [isOpenIndividualAssignmnetMap, setIsOpenIndividualAssignmnetMap] = useState("");

  const [bulkStatusState, setBulkStatusState] = useState("");
  const [selectedBulkOrders, setSelectedBulkOrders] = useState([]);

  const [fetchBulkAssignmentRider, setFetchBulkAssignmentRider] = useState(false);
  const [fetchBulkAssignmentVendor, setFetchBulkAssignmentVendor] = useState(false);

  const [bulkOrderWeight, setBulkOrderWeight] = useState(0);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [advanceFilters, setAdvanceFilters] = useState({
    startDate: "",
    endDate: "",
    order_id: "",
    awbNumber: "",
    city: "",
    state: "",
    vendor_id: "",
    pincode: "",
    rider_id: "",
    order_specific: "",
    merchant_id: "",
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

    setAdvanceFilters({
      endDate: today.toISOString().split("T")[0],
      startDate: oneMonthAgo.toISOString().split("T")[0],
      order_id: "",
      awbNumber: "",
      city: "",
      state: "",
      vendor_id: "",
      pincode: "",
      rider_id: "",
      order_specific: "",
      merchant_id: "",
    });
  };

  const status = [
    "All",
    "booked",
    "pending pickup",
    "picked",
    "in transit",
    "out for delivery",
    "delivered",
    "undelivered",
    "undelivered assigned",
    "cancelled",
    "rto in transit",
    "rto delivered",
  ];
  const [selectedStatus, setSelectedStatus] = useState("All");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/admin/getallorders`, {
        params: {
          page,
          limit,
          status: selectedStatus === "All" ? undefined : selectedStatus,
          order_id: advanceFilters.order_id,
          awb_number: advanceFilters.awbNumber,
          start_date: advanceFilters.startDate,
          end_date: advanceFilters.endDate,
          city: advanceFilters.city,
          vendor_id: advanceFilters.vendor_id,
          pincode: advanceFilters.pincode,
          rider_id: advanceFilters.rider_id,
          order_specific: advanceFilters.order_specific,
          merchant_id: advanceFilters.merchant_id,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });



      setOrders(res.data.data || []);

      setTotalOrders(res.data.pagination?.total);
      setTotalPages(Math.max(1, res.data.pagination?.totalPages));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "An error occurred while fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.split("-")[0] === "DKTGO") {
      setAdvanceFilters({ ...advanceFilters, awbNumber: searchTerm });
    } else {
      setAdvanceFilters({ ...advanceFilters, order_id: searchTerm });
    }
    setFilterUpdate((prev) => !prev);
  };

  const fetchRiders = async (order_ids) => {
    if (!order_ids || order_ids?.length === 0) {
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/admin/riders/unideal-load`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          order_id: order_ids.join(","),
        },
      });
      setRiders(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to load riders");
    } finally {
      setLoading(false);
    }
  };
  const fetchVendor = async (order_ids) => {
    if (!order_ids) {
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/admin/getEligibleVendorsByOrders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          order_id: order_ids,
        },
      });


      setVendor(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to load riders");
    } finally {
      setLoading(false);
    }
  };

  const assignRider = async (orderId, riderId) => {
    setLoading(true);
    try {
      await axios.post(
        `${baseURL}/api/admin/assignOrder`,
        { order_id: orderId, rider_id: riderId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchOrders();
      fetchRiders();
      setAssignmentState("");
      setSelectedBulkOrders([]);
      setBulkOrderWeight(0);
      setFetchBulkAssignmentRider(false);
    } catch (err) {
      const message = err?.response?.data?.message;
      if (
        message ===
        "Rider has exceeded the maximum packet capacity (50 boxes)" ||
        message === "Rider has exceeded the maximum weight limit (20 KG)"
      ) {
        alert(`Can't assign order to rider: ${message}`);
        return { success: false, limitReached: true };
      } else {
        alert("Failed to assign rider");
        return { success: false, limitReached: false };
      }
    } finally {
      setLoading(false);
    }
  };
  const assignVendor = async (orderId, vendorId) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/api/admin/assignOrderToVendor`,
        { order_id: orderId, vendor_id: vendorId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(res.data.message || "Vendor assigned successfully");
      fetchOrders();
      setAssignmentState("");
      setSelectedBulkOrders([]);
      setBulkOrderWeight(0);
      setFetchBulkAssignmentRider(false);
    } catch (err) {
      toast.error("Failed to assign vendor");
      return
    } finally {
      setLoading(false);
    }
  };
  const assignBulkOrderVendor = async (orderIds, vendorId) => {
    setLoading(true);

    try {
      await orderIds.map(async (order) => {
        await axios.post(
          `${baseURL}/api/admin/assignOrderToVendor`,
          { order_id: order.id, vendor_id: vendorId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      });
      toast.success("Vendor assigned successfully");
      fetchOrders();
      setAssignmentState("");
      setSelectedBulkOrders([]);
      setBulkOrderWeight(0);
      setFetchBulkAssignmentRider(false);
    } catch (err) {
      toast.error("Failed to assign vendor");
      return
    } finally {
      setLoading(false);
    }
  };

  const cancelRiderAssignment = async (id) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/api/admin/cancelRiderAssignment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error while canceling rider assignment: ");
    } finally {
      setLoading(false);
    }
  };
  const cancelVendorAssignment = async (id) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/api/admin/cancelMappedWithByAdmin/${id}`,
        {

        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error while canceling rider assignment: ");
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id, newStatus) => {
    setLoading(true);
    try {
      await axios.post(
        `${baseURL}/api/admin/updatestatus/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchOrders();
      setEditingStatusId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedBulkOrders.length === orders.length) {
      setSelectedBulkOrders([]);
      setBulkOrderWeight(0);
    } else {
      setSelectedBulkOrders(orders);
      const totalWeight = orders.reduce(
        (acc, order) => acc + Number(order.total_weight),
        0
      );
      setBulkOrderWeight(totalWeight);
    }
  };

  const exportCSV = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/admin/exportOrders`, {
        params: {
          status: selectedStatus === "All" ? "" : selectedStatus,
          awb_number: advanceFilters.awbNumber,
          order_id: advanceFilters.order_id,
          start_date: advanceFilters.startDate,
          end_date: advanceFilters.endDate,
          city: advanceFilters.city,
          vendor_id: advanceFilters.vendor_id,
          pincode: advanceFilters.pincode,
          rider_id: advanceFilters.rider_id,
          order_specific: advanceFilters.order_specific,
          merchant_id: advanceFilters.merchant_id,
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

  useEffect(() => {
    resetAdvanceFilters();
  }, []);

  useEffect(() => {
    fetchOrders();
    setSelectedBulkOrders([]);
    setBulkOrderWeight(0);
  }, [page, selectedStatus, filterUpdate]);

  //I should do this on click
  useEffect(() => {
    const order_ids = [];
    selectedBulkOrders.forEach((element) => {
      order_ids.push(element.id);
    });
    fetchRiders(order_ids);
  }, [fetchBulkAssignmentRider]);

  useEffect(() => {
    setFetchBulkAssignmentRider(false);
  }, [selectedBulkOrders]);

  return (
    <>
      {!loading ? (
        <div className="bg-gray-100 overflow-hidden min-h-screen w-full">
          {/* Right Sidebar for filters */}
          <div
            className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isFilterOpen ? "translate-x-0" : "translate-x-full"
              }`}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Filters</h2>
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
              <div className="flex flex-wrap items-end gap-4">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-2 gap-x-1 gap-y-2 mb-2">
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
                        className="w-28 border px-1 py-1 rounded-md text-xs"
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
                        className="w-28 border px-1 py-1 rounded-md text-xs"
                      />
                    </div>



                    {/* Order Specific */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Order Specific
                      </label>
                      <select
                        value={advanceFilters.order_specific}
                        onChange={(e) => {
                          setAdvanceFilters((prev) => ({
                            ...prev,
                            order_specific: e.target.value,
                          }));
                        }}
                        className="w-28 border px-1 py-1 rounded-md text-xs"
                      >
                        <option value="">All orders</option>
                        <option value="Turant">Turant</option>
                        <option value="SDD">Same Day Delivery</option>
                        <option value="NDD">Next Day Delivery</option>
                      </select>
                    </div>

                    {/* AWB Number */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        AWB Number(s)
                      </label>
                      <input
                        type="text"
                        value={advanceFilters.awbNumber}
                        onChange={(e) =>
                          setAdvanceFilters((prev) => ({
                            ...prev,
                            awbNumber: e.target.value,
                          }))
                        }
                        placeholder="AWB Number(s)"
                        className="w-28 border px-1 py-1 rounded-md text-xs"
                      />
                    </div>
                    {/* Merchant ID */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Merchant ID
                      </label>
                      <input
                        type="number"
                        value={advanceFilters.merchant_id}
                        onChange={(e) =>
                          setAdvanceFilters((prev) => ({
                            ...prev,
                            merchant_id: e.target.value,
                          }))
                        }
                        placeholder="Integer Only"
                        className="w-28 border px-1 py-1 rounded-md text-xs"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        City
                      </label>
                      <Select
                        options={options}
                        isSearchable
                        value={options.find(
                          (option) => option.value === advanceFilters.city
                        )}
                        onChange={(selectedOption) =>
                          setAdvanceFilters((prev) => ({
                            ...prev,
                            city: selectedOption?.value || "",
                          }))
                        }
                        placeholder="Select City"
                        className="text-xs w-28"
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: "28px",
                            height: "28px",
                          }),
                          indicatorsContainer: (base) => ({
                            ...base,
                            height: "28px",
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            padding: "0 6px",
                          }),
                          input: (base) => ({
                            ...base,
                            margin: "0px",
                          }),
                        }}
                      />
                    </div>

                    {/* Vendor ID */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Vendor ID
                      </label>
                      <input
                        type="number"
                        value={advanceFilters.vendor_id}
                        onChange={(e) =>
                          setAdvanceFilters((prev) => ({
                            ...prev,
                            vendor_id: e.target.value,
                          }))
                        }
                        placeholder="Integer Only"
                        className="w-28 border px-1 py-1 rounded-md text-xs"
                      />
                    </div>

                    {/* Pincode */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={advanceFilters.pincode}
                        onChange={(e) =>
                          setAdvanceFilters((prev) => ({
                            ...prev,
                            pincode: e.target.value,
                          }))
                        }
                        placeholder="Enter Pincode"
                        className="w-28 border px-1 py-1 rounded-md text-xs"
                      />
                    </div>

                    {/* Rider ID */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Rider ID
                      </label>
                      <input
                        type="number"
                        value={advanceFilters.rider_id}
                        onChange={(e) =>
                          setAdvanceFilters((prev) => ({
                            ...prev,
                            rider_id: e.target.value,
                          }))
                        }
                        placeholder="Integer Only"
                        className="w-28 border px-1 py-1 rounded-md text-xs"
                      />
                    </div>
                  </div>
                  {/*  Button */}
                  <div>
                    <button
                      type="submit"
                      onClick={() => {
                        setFilterUpdate((prev) => !prev);
                        setIsFilterOpen(false);
                      }}
                      className="bg-[rgb(85,77,192)] text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
                    >
                      Filter
                    </button>
                    <button
                      onClick={() => {
                        resetAdvanceFilters();
                        setFilterUpdate((prev) => !prev);
                        setIsFilterOpen(false);
                      }}
                      className="bg-[rgb(85,77,192)] text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Heading Strip */}
          <div className="mb-6 bg-[rgb(85,77,192)] py-[24px] shadow-md h-46 md:h-32 md:px-[36px]">
            <div className="flex flex-wrap items-center justify-between md:py-2">
              {/* Heading */}
              <h1 className="text-2xl text-white">Order Details</h1>

              {/* Center - Search Bar */}
              <div className="flex-1 mx-4">
                <div className="flex max-w-md w-full">
                  <form
                    className="flex max-w-md w-full mx-4"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <input
                      type="text"
                      placeholder="AWB-Number"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-grow px-4 py-2 rounded-l-lg text-sm text-black bg-white border border-gray-300 focus:outline-none"
                    />
                    <button
                      onClick={handleSearch}
                      type="submit"
                      className="bg-white px-4 py-2 rounded-r-lg border border-l-0 border-gray-300 text-gray-600 hover:bg-indigo-100 hover:text-[rgb(85,77,192)] transition"
                    >
                      <FaSearch />
                    </button>
                  </form>
                </div>
              </div>

              <div className="flex flex-wrap mt-2 mx-8 md:mt-0 items-end gap-4 text-white">
                <button
                  onClick={() => {
                    exportCSV();
                  }}
                  className="bg-white text-[rgb(85,77,192)] font-medium px-5 py-2 rounded-lg shadow hover:bg-indigo-100 transition"
                >
                  Export
                </button>
                {/* Right Side Filters */}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="bg-white text-[rgb(85,77,192)] font-medium px-5 py-2 rounded-lg shadow hover:bg-indigo-100 transition"
                >
                  Filter
                </button>
              </div>
            </div>
          </div>

          <div className="mx-0 z-10 bg-white rounded-md">

            {/* Status */}
            {/* <div className="max-w-full px-2 -mt-16 md:-mt-16 relative z-10">
              <div className="flex flex-wrap justify-center gap-1 mb-4">
                {status.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setSelectedBulkOrders([]);
                      setSelectedStatus(st);
                      setPage(1);
                    }}
                    className={`px-4 py-2 rounded-full border transition font-medium mt-5 ${selectedStatus === st
                      ? "bg-[rgb(85,77,192)] text-white"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    {st === "rto in transit"
                      ? "RTO In Transit"
                      : st === "rto delivered"
                        ? "RTO Delivered"
                        : toCapitalizeEachWord(st)}
                    {selectedStatus === st && ` (${totalOrders}) `}
                  </button>
                ))}
              </div>
            </div> */}

            <div className="bg-white  w-[400px] sm:w-full mx-auto rounded-xl sm:rounded-2xl shadow-lg p-3   overflow-hidden">
              <div className="overflow-x-scroll scrollbar-hide">
                <div className="flex gap-1 sm:gap-3   sm:w-full">
                  {status.map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setSelectedBulkOrders([]);
                        setSelectedStatus(st);
                        setPage(1);
                      }}
                      className={`px-4 py-2 rounded-xl whitespace-nowrap border transition font-medium mt-5 ${selectedStatus === st
                        ? "bg-[rgb(85,77,192)] text-white"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {st === "rto in transit"
                        ? "RTO In Transit"
                        : st === "rto delivered"
                          ? "RTO Delivered"
                          : toCapitalizeEachWord(st)}
                      {selectedStatus === st && ` (${totalOrders}) `}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bulk Assignment */}
            {selectedBulkOrders.length > 0 && selectedStatus === "booked" && (
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
                          Order Weight
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-800 text-sm">
                      {selectedBulkOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border-b">{order.id}</td>
                          <td className="px-4 py-2 border-b">
                            {Number(order.total_weight).toLocaleString()}g
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-indigo-50 text-indigo-700 font-semibold text-sm">
                        <td className="px-4 py-2 border-t">Total Weight</td>
                        <td className="px-4 py-2 border-t">
                          {Number(bulkOrderWeight).toLocaleString()}g
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  {!fetchBulkAssignmentRider ? (
                    <button
                      onClick={() => setFetchBulkAssignmentRider(true)}
                      className="bg-[rgb(85,77,192)] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                    >
                      Get Available Riders
                    </button>
                  ) : (
                    <>
                      <select
                        className="border border-gray-300 text-sm text-gray-700 px-4 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
                        value={assignmentState}
                        onChange={(e) => setAssignmentState(e.target.value)}
                      >
                        <option value="">
                          Select Rider for Bulk Assignment
                        </option>
                        {riders.map((rider) => (
                          <option key={rider.rider_id} value={rider.rider_id}>
                            {rider.rider_id} : {rider.rider_name} :{" "}
                            {Number(rider.total_weight_grams).toLocaleString()}g
                            : {rider.total_boxes}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={async () => {
                          if (!assignmentState) {
                            toast.warn("Please select a rider");
                            return;
                          }
                          for (const order of selectedBulkOrders) {
                            const result = await assignRider(
                              order.id,
                              assignmentState
                            );
                          }
                          setSelectedBulkOrders([]);
                          setBulkOrderWeight(0);
                          setFetchBulkAssignmentRider(false);
                        }}
                        className="bg-[rgb(85,77,192)] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                      >
                        Bulk Assign
                      </button>
                    </>
                  )}
                  {!fetchBulkAssignmentVendor ? (
                    <button
                      onClick={() => {
                        setFetchBulkAssignmentVendor(true);
                        fetchVendor(selectedBulkOrders[0].id);
                      }}
                      className="bg-[rgb(85,77,192)] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                    >
                      Get Available Vendor
                    </button>
                  ) : (
                    <>
                      <select
                        className="border border-gray-300 text-sm text-gray-700 px-4 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
                        value={assignmentState}
                        onChange={(e) => setAssignmentState(e.target.value)}
                      >
                        <option value="">
                          Select Vendor for Bulk Assignment
                        </option>
                        {vendor.map((vendor) => (
                          <option
                            key={vendor.vendor_id}
                            value={vendor.vendor_id}
                          >
                            {vendor.vendor_id} :{" "}
                            {vendor.vendor_name}

                          </option>
                        ))}
                      </select>
                      <button
                        onClick={async () => {
                          if (!assignmentState) {
                            toast.warn("Please select a vendor");
                            return;
                          }
                          for (const order of selectedBulkOrders) {
                            const result = await assignBulkOrderVendor(
                              selectedBulkOrders,
                              assignmentState
                            );
                          }
                          setSelectedBulkOrders([]);
                          setBulkOrderWeight(0);
                          setFetchBulkAssignmentVendor(false);
                        }}
                        className="bg-[rgb(85,77,192)] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                      >
                        Bulk Assign
                      </button>
                    </>
                  )}
                  <button
                    className="bg-red-500 hover:bg-red-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                    onClick={() => {
                      setSelectedBulkOrders([]);
                      setBulkOrderWeight(0);
                      setFetchBulkAssignmentRider(false);
                      setFetchBulkAssignmentVendor(false);
                    }}
                  >
                    Clear Selected Orders
                  </button>
                </div>
              </div>
            )}

            {/* Bulk Pending Pickup Handle */}
            {selectedBulkOrders.length > 0 &&
              selectedStatus === "pending pickup" && (
                <div className="mb-10 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800 mb-5">
                    Orders ({selectedBulkOrders.length} Selected)
                  </h2>

                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border border-gray-200 rounded-md overflow-hidden">
                      <thead className="bg-gray-100 text-gray-600 text-sm font-semibold">
                        <tr>
                          <th className="px-4 py-3 text-left border-b">
                            Order ID
                          </th>
                          <th className="px-4 py-3 text-left border-b">
                            Order Weight
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-800 text-sm">
                        {selectedBulkOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border-b">{order.id}</td>
                            <td className="px-4 py-2 border-b">
                              {order.total_weight}g
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-indigo-50 text-indigo-700 font-semibold text-sm">
                          <td className="px-4 py-2 border-t">Total Weight</td>
                          <td className="px-4 py-2 border-t">
                            {Number(bulkOrderWeight).toLocaleString()}g
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <select
                      className="border border-gray-300 text-sm text-gray-700 px-4 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
                      value={bulkStatusState}
                      onChange={(e) => setBulkStatusState(e.target.value)}
                    >
                      <option value="">Select Status</option>
                      <option value="out for delivery">Out For Delivery</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Cancel Assignment">
                        Cancel Assignment
                      </option>
                    </select>

                    <button
                      onClick={async () => {
                        if (!bulkStatusState) {
                          toast.warn("Select new status");
                          return;
                        }
                        if (bulkStatusState === "Cancel Assignment") {
                          for (const order of selectedBulkOrders) {
                            await cancelRiderAssignment(order.id);
                          }
                        } else {
                          for (const order of selectedBulkOrders) {
                            await changeStatus(order.id, bulkStatusState);
                          }
                        }
                        setSelectedBulkOrders([]);
                        setBulkStatusState("");
                      }}
                      className="bg-[rgb(85,77,192)] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                    >
                      Change Status
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                      onClick={() => {
                        setSelectedBulkOrders([]);
                      }}
                    >
                      Clear Selected Orders
                    </button>
                  </div>
                </div>
              )}



            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-xl shadow">
              {loading ? (
                <div className="text-center py-10 text-gray-600">
                  Loading...
                </div>
              ) : (

                <div className="relative -mx-4 sm:-mx-6 lg:mx-0">
                  {/* <table className="min-w-[1400px] lg:min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 text-gray-600 text-sm font-semibold">
                      ...
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                      ...
                    </tbody>
                  </table> */}




                  <div className="bg-white  w-[400px] sm:w-full mx-auto rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6  overflow-hidden">
                    <div className="overflow-x-scroll">
                      <div className="flex gap-1 sm:gap-3   sm:w-full">
                        <table className=" lg:min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100 text-gray-600 text-sm font-semibold">
                            <tr>
                              {(selectedStatus === "booked" ||
                                selectedStatus === "pending pickup") && (
                                  <th className="px-6 py-4">
                                    <div>
                                      <span>
                                        <input
                                          type="checkbox"
                                          className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                                          checked={
                                            selectedBulkOrders.length === orders.length
                                          }
                                          onChange={toggleSelectAll}
                                        />
                                      </span>
                                    </div>
                                  </th>
                                )}

                              <th className="text-center px-6 py-3">ORDER ID</th>

                              {(selectedStatus === "pending pickup" ||
                                selectedStatus === "out for delivery" ||
                                selectedStatus === "delivered" ||
                                selectedStatus === "picked" ||
                                selectedStatus === "in transit" ||
                                selectedStatus === "undelivered assigned") && (
                                  <>
                                    <th className="text-center px-6 py-3">RIDER ID/VENDOR ID</th>

                                  </>
                                )}

                              <th className="text-center px-6 py-3">
                                CONSIGNEE ADDRESS
                              </th>
                              <th className="text-center px-6 py-3">PACKAGE DETAILS</th>

                              <th className="text-center px-6 py-3">ASSIGNMENT/RIDER</th>
                              <th className="text-center px-6 py-3">MAPPED/VENDOR</th>
                              <th className="text-center pl-6 py-3">STATUS</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-700 text-sm">
                            {orders.length > 0 ? (
                              orders.map((order) => {

                                let isSelected;
                                if (selectedStatus === "booked") {
                                  isSelected = selectedBulkOrders.some(
                                    (o) => o.id === order.id
                                  );
                                } else if (selectedStatus === "pending pickup") {
                                  isSelected = selectedBulkOrders.some(
                                    (o) => o.id === order.id
                                  );
                                }
                                return (
                                  <tr key={order.id} className="hover:bg-gray-50 overflow-x-scroll">
                                    {/* Select */}
                                    {(selectedStatus === "booked" ||
                                      selectedStatus === "pending pickup") && (
                                        <td className="px-6 py-4 text-center">
                                          <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={(e) => {
                                              if (selectedStatus === "booked") {
                                                if (e.target.checked) {
                                                  setSelectedBulkOrders((prev) => [
                                                    ...prev,
                                                    order,
                                                  ]);
                                                  setBulkOrderWeight(
                                                    (prev) =>
                                                      Number(prev) +
                                                      Number(order.total_weight)
                                                  );
                                                } else {
                                                  setSelectedBulkOrders((prev) =>
                                                    prev.filter((o) => o.id !== order.id)
                                                  );
                                                  setBulkOrderWeight(
                                                    (prev) =>
                                                      Number(prev) -
                                                      Number(order.total_weight)
                                                  );
                                                }
                                              } else if (
                                                selectedStatus === "pending pickup"
                                              ) {
                                                if (e.target.checked) {
                                                  setSelectedBulkOrders((prev) => [
                                                    ...prev,
                                                    order,
                                                  ]);
                                                  setBulkOrderWeight(
                                                    (prev) =>
                                                      Number(prev) +
                                                      Number(order.total_weight)
                                                  );
                                                } else {
                                                  setSelectedBulkOrders((prev) =>
                                                    prev.filter((o) => o.id !== order.id)
                                                  );
                                                  setBulkOrderWeight(
                                                    (prev) =>
                                                      Number(prev) +
                                                      Number(order.total_weight)
                                                  );
                                                }
                                              }
                                            }}
                                            className="w-4 h-4 text-[rgb(85,77,192)] border-gray-300 rounded"
                                          />
                                        </td>
                                      )}

                                    {/* Order ID */}
                                    <td className="px-6 py-4 whitespace-pre-line">
                                      <p className="text-l text-gray-800 flex items-center">
                                        <a
                                          href={`${frontEndURL}/track-order?awb_number=${order.awb_number}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="underline text-blue-700 hover:text-blue-500"
                                        >
                                          {order.awb_number}
                                        </a>
                                        <button
                                          className="pl-2 text-lg text-gray-600 hover:text-[rgb(85,77,192)] transition"
                                          onClick={() => {
                                            navigator.clipboard.writeText(
                                              order.awb_number
                                            );
                                            setCopySuccess(order.awb_number);
                                            setTimeout(() => {
                                              setCopySuccess(null);
                                            }, 2000);
                                          }}
                                        >
                                          {copySuccess === order.awb_number ? (
                                            <CiCircleCheck />
                                          ) : (
                                            <FaRegCopy />
                                          )}
                                        </button>
                                        <button
                                          onClick={() => {
                                            setPopup(order);
                                          }}
                                          className="pl-2 text-lg text-gray-600 hover:text-[rgb(85,77,192)] transition"
                                        >
                                          <TbFileInfo />
                                        </button>
                                      </p>
                                      {order.tpc_awb_number && (
                                        <p>
                                          {order.tpc_awb_number}
                                          <button
                                            className="pl-2 text-lg text-gray-600 hover:text-[rgb(85,77,192)] transition"
                                            onClick={() => {
                                              navigator.clipboard.writeText(
                                                order.tpc_awb_number
                                              );
                                              setCopySuccess(order.tpc_awb_number);
                                              setTimeout(() => {
                                                setCopySuccess(null);
                                              }, 2000);
                                            }}
                                          >
                                            {copySuccess === order.tpc_awb_number ? (
                                              <CiCircleCheck />
                                            ) : (
                                              <FaRegCopy />
                                            )}
                                          </button>
                                        </p>
                                      )}

                                      <p className="text-s text-gray-500">
                                        {new Date(order.created_at).toLocaleString(
                                          "en-IN",
                                          {
                                            timeZone: "Asia/Kolkata",
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                          }
                                        )}
                                      </p>

                                      <p className="text-s text-gray-400">
                                        Merchant ID: {order.merchant_id}
                                      </p>
                                      <p className="text-s text-gray-400">
                                        Merchant Order ID:{" "}
                                        {order.merchant_order_id?.length <= 20
                                          ? order.merchant_order_id
                                          : `${order.merchant_order_id.slice(
                                            0,
                                            20
                                          )}...`}
                                        <button
                                          className="pl-2 text-lg text-gray-600 hover:text-[rgb(85,77,192)] transition"
                                          onClick={() => {
                                            navigator.clipboard.writeText(
                                              order.merchant_order_id
                                            );
                                            setCopySuccess(order.merchant_order_id);
                                            setTimeout(() => {
                                              setCopySuccess(null);
                                            }, 2000);
                                          }}
                                        >
                                          {copySuccess === order.merchant_order_id ? (
                                            <CiCircleCheck />
                                          ) : (
                                            <FaRegCopy />
                                          )}
                                        </button>
                                        <span className="bg-[rgb(86,78,193)] px-2 text-white rounded">{order.rider_preference === 'daakit' ? "Daakit" : "Self"}</span>
                                      </p>
                                    </td>

                                    {(selectedStatus === "pending pickup" ||
                                      selectedStatus === "out for delivery" ||
                                      selectedStatus === "delivered" ||
                                      selectedStatus === "picked" ||
                                      selectedStatus === "in transit" ||
                                      selectedStatus === "undelivered assigned") && (
                                        <>
                                          {/* {
                                        order.mapped_with !== null && order.rider_id !==null  ? (
                                          <td className="text-center">
                                            {order.mapped_with ? `M_${order.mapped_with}_${order.rider_id}` : "-"}
                                          </td>
                                        ) : (
                                          <td className="text-center">
                                            {order.rider_id ? `FP_${order.rider_vendor_id}_` : order.rider_merchant_id ? `M${order.r_merchant_id}_R` : "DKT_"}
                                            {order.rider_id}
                                          </td>
                                        )
                                      } */}
                                          <td className="text-center">
                                            {
                                              order.rider_vendor_id === null && order.rider_merchant_id === null && order.mapped_with === null ? (
                                                <>
                                                  {order.rider_id !== null ? `DKT_` : ""}
                                                  {order.rider_id}
                                                </>
                                              ) : (
                                                <>
                                                  {order.rider_id !== null ? `FP_${order.rider_vendor_id}_` : order.rider_merchant_id ? `M${order.r_merchant_id}_R` : order.mapped_with ? `FP_${order.mapped_with}` : "DKT_"}
                                                  {order.rider_id}
                                                </>
                                              )
                                            }

                                          </td>
                                          {/* <td className="text-center">
                                      {order.rider_id ? `FP_${order.rider_vendor_id}_` : order.rider_merchant_id ? `M${order.r_merchant_id}_R` : "DKT_"}
                                      {order.rider_id}
                                    </td> */}
                                        </>
                                      )}
                                    {/* {(selectedStatus === "pending pickup" ||
                                  selectedStatus === "out for delivery" ||
                                  selectedStatus === "delivered" ||
                                  selectedStatus === "undelivered assigned") && (
                                    <td className="text-center">
                                      {order.mapped_with ? `M_${order.mapped_with}_${order.rider_id}` : "-" }
                                    </td>
                                  )} */}

                                    {/* Address */}
                                    <td className="px-6 py-1 whitespace-pre-line">
                                      <p className="font-medium text-gray-800">
                                        {order.delivery_contact_name}
                                      </p>
                                      <div className="relative inline-block group">
                                        <span className="cursor-pointer text-gray-800 font-medium">
                                          {order.delivery_address_line.slice(0, 15)}....
                                        </span>
                                        <div
                                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3
                                          hidden group-hover:block">
                                          <div className="bg-[rgb(85,77,192)] text-white text-xs w-48 px-3 py-1 rounded shadow-lg ">
                                            {order.delivery_address_line}
                                          </div>

                                          {/* Arrow */}
                                          <div className="w-2 h-2 bg-[rgb(85,77,192)] rotate-45 mx-auto -mt-1"></div>
                                        </div>
                                      </div>

                                      <p className="font-medium text-gray-800">

                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {order.delivery_city}, {order.delivery_state} -{" "}
                                        {order.delivery_pincode}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        {order.delivery_country}
                                      </p>
                                    </td>

                                    {/* Package Details */}
                                    <td className="px-6 py-4">
                                      <p>
                                        {selectedStatus !== "cancelled" && (
                                          <span className=" whitespace-nowrap">
                                            EDD:{" "}
                                            {(() => {
                                              const raw = new Date(order.created_at);
                                              const prefix =
                                                order.order_specific?.slice(0, 3);

                                              if (order.order_specific === "Turant") {
                                                // Add 4 hours
                                                raw.setHours(raw.getHours() + 4);
                                              } else if (prefix === "SDD") {
                                                // Set time to 8:00 PM same day
                                                raw.setHours(20, 0, 0, 0);
                                              } else if (prefix === "NDD") {
                                                // Next day at 8:00 PM
                                                raw.setDate(raw.getDate() + 1);
                                                raw.setHours(20, 0, 0, 0);
                                              }

                                              return raw.toLocaleString("en-IN", {
                                                timeZone: "Asia/Kolkata",
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                              });
                                            })()}
                                          </span>
                                        )}
                                      </p>

                                      <p>
                                        <span className="font-medium text-gray-800">
                                          Weight:
                                        </span>{" "}
                                        {Number(order.total_weight).toLocaleString()}g
                                        {selectedStatus !== "cancelled" && (
                                          <span
                                            className={`ml-2 px-2 py-0.5 rounded-full text-sm font-semibold shadow-sm ${order.order_specific?.slice(0, 3) ===
                                              "NDD"
                                              ? "text-green-800 bg-green-100 border border-green-300"
                                              : order.order_specific?.slice(0, 3) ===
                                                "SDD"
                                                ? "text-yellow-800 bg-yellow-100 border border-yellow-300"
                                                : "text-red-800 bg-red-100 border border-red-300 animate-blink"
                                              }`}
                                          >
                                            {order.order_specific?.slice(0, 3) === "NDD"
                                              ? "NDD"
                                              : order.order_specific?.slice(0, 3) ===
                                                "SDD"
                                                ? "SDD"
                                                : order.order_specific?.slice(0, 6) ===
                                                  "Turant"
                                                  ? "Turant"
                                                  : order.order_specific}
                                          </span>
                                        )}
                                      </p>
                                      <p>
                                        <span className="font-medium text-gray-800">
                                          Dimensions:
                                        </span>{" "}
                                        {order.package_length}x{order.package_breadth}x
                                        {order.package_height}
                                      </p>
                                    </td>

                                    {/* Assignment */}
                                    {
                                      selectedStatus === "All" ? (
                                        <>
                                          <td className="px-6 py-4 text-center">
                                            {order.status === "booked" && order.mapped_with === null ? (
                                              <>
                                                <span
                                                  className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block"
                                                >
                                                  Not Assigned
                                                </span>
                                              </>
                                            ) : order.status === "pending pickup" ||
                                              order.status === "undelivered assigned" ? (
                                              <>
                                                {order.status === "booked" && order.mapped_with !== null ? (
                                                  <span

                                                    className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 mb-2 inline-block"
                                                  >
                                                    Assigned
                                                  </span>
                                                ) : (
                                                  <span
                                                    className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block"
                                                  >
                                                    Not Assigned
                                                  </span>
                                                )}
                                              </>
                                            ) : order.status === "cancelled" ? (
                                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                                Order Canceled
                                              </span>
                                            ) : order.status === "delivered" ? (
                                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                                Order Delivered
                                              </span>
                                            ) : order.status === "rto delivered" ? (
                                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                                Return To Origin
                                              </span>
                                            ) : (
                                              <span
                                                className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block"
                                              >
                                                Not Assigned
                                              </span>
                                            )}
                                          </td>
                                        </>
                                      ) : (
                                        <>
                                          <td className="px-6 py-4 text-center">
                                            {order.status === "booked" ||
                                              order.status === "undelivered" ? (
                                              <>
                                                {!(
                                                  isOpenIndividualAssignmnet === order.id

                                                ) ? (
                                                  <span
                                                    onClick={() => {

                                                      // alert(order.status==="undelivered" && order.mapped_with !== null)
                                                      if (order.status === "undelivered" && order.mapped_with !== null) {
                                                        return
                                                      }
                                                      fetchRiders([order.id]);
                                                      if (order.rider_preference === 'daakit') {
                                                        setIsOpenIndividualAssignmnet(order.id);
                                                        setIsOpenIndividualVendorAssignmnet("");
                                                      }
                                                    }}
                                                    className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer"
                                                  >
                                                    Not Assigned
                                                  </span>
                                                ) : (
                                                  <form
                                                    onSubmit={(e) => {
                                                      e.preventDefault();
                                                      const selectedRider = assignmentState;
                                                      if (!selectedRider) {
                                                        toast.warn("Please select a rider");
                                                        return;
                                                      }
                                                      assignRider(order.id, selectedRider);
                                                      setIsOpenIndividualAssignmnet("");
                                                    }}
                                                    className="flex items-center gap-2"
                                                  >
                                                    <select
                                                      value={assignmentState}
                                                      onChange={(e) =>
                                                        setAssignmentState(e.target.value)
                                                      }
                                                      className="border px-2 py-1 rounded-md"
                                                      required
                                                    >
                                                      <option value="" disabled>
                                                        Select Rider
                                                      </option>
                                                      {riders.map((rider) => (
                                                        <option
                                                          key={rider.rider_id}
                                                          value={rider.rider_id}
                                                        >
                                                          {rider.rider_id} :{" "}
                                                          {rider.rider_name} :{" "}
                                                          {rider.total_weight_grams}g :{" "}
                                                          {rider.total_boxes}
                                                        </option>
                                                      ))}
                                                    </select>
                                                    <button
                                                      type="submit"
                                                      className="bg-[rgb(85,77,192)] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                                    >
                                                      Assign
                                                    </button>
                                                    <button
                                                      type="button"
                                                      className="text-xs text-gray-500 hover:underline"
                                                      onClick={() =>
                                                        setIsOpenIndividualAssignmnet("")
                                                      }
                                                    >
                                                      Close
                                                    </button>
                                                  </form>
                                                )}
                                              </>
                                            ) : order.status === "pending pickup" ||
                                              order.status === "in transit" ||
                                              order.status === "picked" ||
                                              order.status === "undelivered assigned" ? (
                                              <>
                                                {!(
                                                  isOpenIndividualAssignmnet === order.id
                                                ) ? (
                                                  order.mapped_with !== null ? (
                                                    <span

                                                      className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer"
                                                    >
                                                      Not Assigned
                                                    </span>
                                                  ) : (
                                                    <span
                                                      onClick={() => {
                                                        if (order.status === "in transit") {
                                                          return;
                                                        }
                                                        setIsOpenIndividualAssignmnet(order.id);

                                                      }}
                                                      className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 mb-2 inline-block cursor-pointer"
                                                    >
                                                      Assigned
                                                    </span>
                                                  )

                                                ) : (
                                                  <form
                                                    onSubmit={(e) => {
                                                      e.preventDefault();
                                                      cancelRiderAssignment(order.id);
                                                      setIsOpenIndividualAssignmnet("");
                                                    }}
                                                    className="flex items-center gap-2"
                                                  >
                                                    <button
                                                      type="submit"
                                                      className="bg-[rgb(85,77,192)] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                                    >
                                                      Cancel Rider Assignment
                                                    </button>
                                                    <button
                                                      type="button"
                                                      className="text-xs text-gray-500 hover:underline"
                                                      onClick={() =>
                                                        setIsOpenIndividualAssignmnet("")
                                                      }
                                                    >
                                                      Close
                                                    </button>
                                                  </form>
                                                )}
                                              </>
                                            ) : order.status === "cancelled" ? (
                                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                                Order Canceled
                                              </span>
                                            ) : order.status === "delivered" ? (
                                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                                Assigned
                                              </span>
                                            ) : order.status === "rto delivered" ? (
                                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                                Return To Origin
                                              </span>
                                            ) : (

                                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                                Assigned
                                              </span>
                                            )}
                                          </td>
                                        </>
                                      )
                                    }

                                    {/* Map */}
                                    {
                                      selectedStatus === "All" ? (
                                        <>
                                          <td className="px-6 py-4 text-center">
                                            {order.status === "booked" && order.mapped_with === null ? (
                                              <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-red-100 text-red-600">
                                                Not Mapped
                                              </span>
                                            ) : order.status === "cancelled" ? (
                                              <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-red-100 text-red-600">
                                                Order Canceled
                                              </span>
                                            ) : order.status === "delivered" ? (
                                              <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-green-100 text-green-600">
                                                Order Delivered
                                              </span>
                                            ) : order.status === "rto delivered" ? (
                                              <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-green-100 text-green-600">
                                                Return To Origin
                                              </span>
                                            ) : (order.status === "booked" && order.mapped_with !== null) ? (
                                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                                Mapped
                                              </span>
                                            ) : (
                                              <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-red-100 text-red-600">
                                                Not Mapped
                                              </span>
                                            )}
                                          </td>
                                        </>
                                      ) : (
                                        <>
                                          <td className="px-6 py-4 text-center">
                                            {order.status === "booked" ? (
                                              <>
                                                {!(
                                                  isOpenIndividualVendorAssignmnet === order.id
                                                ) ? (

                                                  <span
                                                    onClick={() => {
                                                      fetchVendor(order.id);
                                                      if (order.rider_preference === 'daakit') {

                                                        setIsOpenIndividualVendorAssignmnet(order.id);
                                                        setIsOpenIndividualAssignmnet("")
                                                      }
                                                    }}
                                                    className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer">
                                                    Not Mapped
                                                  </span>
                                                ) : (
                                                  <form
                                                    onSubmit={(e) => {
                                                      e.preventDefault();
                                                      const selectedVendor = assignmentState;
                                                      if (!selectedVendor) {
                                                        toast.warn("Please select a vendor");
                                                        return;
                                                      }
                                                      assignVendor(order.id, selectedVendor);
                                                      setIsOpenIndividualAssignmnet("");
                                                    }}
                                                    className="flex items-center gap-2"
                                                  >
                                                    <select
                                                      value={assignmentState}
                                                      onChange={(e) =>
                                                        setAssignmentState(e.target.value)
                                                      }
                                                      className="border px-2 py-1 rounded-md"
                                                      required
                                                    >
                                                      <option value="" disabled>
                                                        Select Vendor
                                                      </option>
                                                      {vendor.map((vendor) => (
                                                        <option
                                                          key={vendor.vendor_id}
                                                          value={vendor.vendor_id}
                                                        >
                                                          {vendor.vendor_id} :{" "}
                                                          {vendor.vendor_name}

                                                        </option>
                                                      ))}
                                                    </select>
                                                    <button
                                                      type="submit"
                                                      className="bg-[rgb(85,77,192)] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                                    >
                                                      Assign
                                                    </button>
                                                    <button
                                                      type="button"
                                                      className="text-xs text-gray-500 hover:underline"
                                                      onClick={() =>
                                                        setIsOpenIndividualVendorAssignmnet("")
                                                      }
                                                    >
                                                      Close
                                                    </button>
                                                  </form>
                                                )}
                                              </>
                                            ) : order.status === "pending pickup" ||
                                              order.status === "out for delivery" ||
                                              order.status === "undelivered assigned" ? (
                                              <>
                                                {!(
                                                  isOpenIndividualAssignmnetMap === order.id
                                                ) ? (
                                                  order.mapped_with !== null ? (
                                                    <span
                                                      onClick={() => {
                                                        if (order.status === "out for delivery" || order.status === 'undelivered assigned') {
                                                          return;
                                                        }

                                                        setIsOpenIndividualAssignmnetMap(order.id);
                                                      }}
                                                      className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 mb-2 inline-block cursor-pointer"
                                                    >
                                                      Mapped
                                                    </span>
                                                  ) : (
                                                    <>
                                                      <span

                                                        className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium  bg-red-100 text-red-600 mb-2 inline-block cursor-pointer"
                                                      >
                                                        Not Mapped
                                                      </span>
                                                    </>
                                                  )
                                                ) : (
                                                  <form
                                                    onSubmit={(e) => {
                                                      e.preventDefault();
                                                      cancelVendorAssignment(order.id);
                                                      setIsOpenIndividualAssignmnet("");
                                                    }}
                                                    className="flex items-center gap-2"
                                                  >
                                                    <button
                                                      type="submit"
                                                      className="bg-[rgb(85,77,192)] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                                    >
                                                      Cancel Vendor Assignment
                                                    </button>
                                                    <button
                                                      type="button"
                                                      className="text-xs text-gray-500 hover:underline"
                                                      onClick={() =>
                                                        setIsOpenIndividualAssignmnetMap("")
                                                      }
                                                    >
                                                      Close
                                                    </button>
                                                  </form>
                                                )}
                                              </>
                                            ) : order.status === "cancelled" ? (
                                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                                Order Canceled
                                              </span>
                                            ) : order.status === "delivered" || order.status === 'undelivered' || order.status === 'rto in transit' ? (
                                              <>
                                                {
                                                  order.mapped_with === null ? (
                                                    <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                                      Not Mapped
                                                    </span>
                                                  ) : (
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                                      Mapped
                                                    </span>
                                                  )
                                                }
                                              </>
                                            ) : order.status === "rto delivered" ? (
                                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                                Return To Origin
                                              </span>
                                            ) : (
                                              order.mapped_with !== null ? (
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                                  Mapped
                                                </span>
                                              ) : order.status === 'in transit' ? (
                                                <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-red-100 text-red-600">
                                                  Not Mapped
                                                </span>
                                              ) : (
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                                  Assigned
                                                </span>
                                              )
                                            )}
                                          </td>
                                        </>
                                      )
                                    }


                                    {/* Status */}
                                    {
                                      selectedStatus === "All" ? (
                                        <>
                                          {/* only view ststus */}
                                          <td className="px-6 py-4  text-center">
                                            {
                                              order.status === "cancelled" ||
                                                order.status === "undelivered" ||
                                                order.status === "delivered" ||
                                                order.status === "ndr" ||
                                                order.status === "rto delivered" ? (
                                                <span
                                                  className={`px-3 py-1 rounded-full whitespace-nowrap text-xs font-semibold inline-block ${order.status === "cancelled"
                                                    ? "bg-red-100 text-red-600"
                                                    : order.status === "undelivered"
                                                      ? "bg-red-100 text-green-600"
                                                      : order.status === "delivered"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-yellow-100 text-yellow-600"
                                                    } `}
                                                >
                                                  {order.status === "rto delivered"
                                                    ? "RTO Delivered"
                                                    : order.status === "ndr"
                                                      ? "NDR"
                                                      : toCapitalizeEachWord(order.status)}
                                                </span>
                                              ) : (
                                                <span
                                                  className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-semibold inline-block bg-blue-100 text-blue-600"
                                                >
                                                  {order.status === "rto in transit"
                                                    ? "RTO In Transit"
                                                    : toCapitalizeEachWord(order.status)}
                                                </span>
                                              )}
                                          </td>


                                        </>
                                      ) : (
                                        <>
                                          <td className="px-6 py-4 text-center">
                                            {
                                              order.status === "cancelled" ||
                                                order.status === "undelivered" ||
                                                order.status === "delivered" ||
                                                order.status === "ndr" ||
                                                order.status === "rto delivered" ? (
                                                <span
                                                  className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${order.status === "cancelled"
                                                    ? "bg-red-100 text-red-600"
                                                    : order.status === "undelivered"
                                                      ? "bg-red-100 text-green-600"
                                                      : order.status === "delivered"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-yellow-100 text-yellow-600"
                                                    } `}
                                                >
                                                  {order.status === "rto delivered"
                                                    ? "RTO Delivered"
                                                    : order.status === "ndr"
                                                      ? "NDR"
                                                      : toCapitalizeEachWord(order.status)}

                                                </span>
                                              ) : (
                                                <>
                                                  {(editingStatusId === order.id) ? (

                                                    <form
                                                      onSubmit={async (e) => {
                                                        e.preventDefault();
                                                        const newStatus =
                                                          e.target.elements.status.value;
                                                        changeStatus(order.id, newStatus);
                                                      }}
                                                    >
                                                      <div className="flex items-center gap-2">
                                                        <select
                                                          name="status"
                                                          defaultValue={order.status}
                                                          className="text-xs border border-gray-300 rounded-md px-2 py-1"
                                                          required
                                                        >
                                                          <option disabled value="">
                                                            Change Status
                                                          </option>
                                                          {order.status === "booked" && (
                                                            <>
                                                              <option value="cancelled">
                                                                Cancelled
                                                              </option>
                                                            </>
                                                          )}
                                                          {order.status ===
                                                            "pending pickup" && (
                                                              <>
                                                                <option value="in transit">
                                                                  In Transit
                                                                </option>
                                                                <option value="cancelled">
                                                                  Cancelled
                                                                </option>
                                                              </>
                                                            )}
                                                          {order.status ===
                                                            "in transit" && (
                                                              <>
                                                                <option value="out for delivery">
                                                                  Out For Delivery
                                                                </option>

                                                              </>
                                                            )}
                                                          {order.status ===
                                                            "out for delivery" && (
                                                              <>
                                                                <option value="delivered">
                                                                  Delivered
                                                                </option>
                                                                <option value="ndr">NDR</option>
                                                              </>
                                                            )}
                                                          {order.status ===
                                                            "rto in transit" && (
                                                              <>
                                                                <option value="rto delivered">
                                                                  RTO Delivered
                                                                </option>
                                                              </>
                                                            )}
                                                          {order.status ===
                                                            "undelivered assigned" && (
                                                              <>
                                                                <option value="out for delivery">
                                                                  Out For Delivery
                                                                </option>
                                                              </>
                                                            )}
                                                        </select>
                                                        <button
                                                          type="submit"
                                                          className="bg-[rgb(85,77,192)] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                                        >
                                                          Update
                                                        </button>
                                                        <button
                                                          type="button"
                                                          onClick={() =>
                                                            setEditingStatusId(null)
                                                          }
                                                          className="text-xs text-gray-500 hover:underline"
                                                        >
                                                          Close
                                                        </button>
                                                      </div>
                                                    </form>
                                                  ) : (

                                                    <span
                                                      onClick={() => {
                                                        if (order.rider_preference === 'daakit') {
                                                          if (order.mapped_with !== null) {
                                                            return
                                                          } else if (order.status === 'booked') {
                                                            return
                                                          }
                                                          setEditingStatusId(order.id)
                                                        }
                                                      }

                                                      }
                                                      className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-semibold inline-block bg-blue-100 text-blue-600 cursor-pointer"
                                                    >
                                                      {order.status === "rto in transit"
                                                        ? "RTO In Transit"
                                                        : toCapitalizeEachWord(order.status)}
                                                    </span>
                                                  )}
                                                </>
                                              )}
                                          </td>
                                        </>
                                      )

                                    }

                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td
                                  colSpan="6"
                                  className="text-center px-6 py-6 text-gray-500"
                                >
                                  No orders found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

              )}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-md text-sm font-medium ${page === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[rgb(85,77,192)] text-white hover:bg-indigo-800"
                  }`}
              >
                Previous
              </button>
              <p className="text-sm text-gray-700 self-center">
                Page {page} of {totalPages}
              </p>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-md text-sm font-medium ${page === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[rgb(85,77,192)] text-white hover:bg-indigo-800"
                  }`}
              >
                Next
              </button>
            </div>
          </div>

          {popup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(46,46,46,0.5)]">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden">
                {/* Modal Header */}
                <div className="bg-[rgb(85,77,192)] pt-4">
                  <h2 className="text-xl font-semibold text-white text-center mb-4">
                    Order Details
                  </h2>

                  <div className="bg-white p-6  space-y-3 text-gray-700">
                    {/* Basic Info */}
                    <h3 className="font-semibold text-[rgb(85,77,192)] mb-2">
                      Basic Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong>Order ID:</strong> {popup.merchant_order_id}
                        <button
                          className="pl-2 text-lg text-gray-600 hover:text-[rgb(85,77,192)] transition"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              popup.merchant_order_id
                            );
                            setCopySuccess(popup.merchant_order_id);
                            setTimeout(() => {
                              setCopySuccess(null);
                            }, 2000);
                          }}
                        >
                          {copySuccess === popup.merchant_order_id ? (
                            <CiCircleCheck />
                          ) : (
                            <FaRegCopy />
                          )}
                        </button>
                      </div>
                      <div>
                        <strong>AWB No:</strong> {popup.awb_number}
                        <button
                          className="pl-2 text-lg text-gray-600 hover:text-[rgb(85,77,192)] transition"
                          onClick={() => {
                            navigator.clipboard.writeText(popup.awb_number);
                            setCopySuccess(popup.awb_number);
                            setTimeout(() => {
                              setCopySuccess(null);
                            }, 2000);
                          }}
                        >
                          {copySuccess === popup.awb_number ? (
                            <CiCircleCheck />
                          ) : (
                            <FaRegCopy />
                          )}
                        </button>
                      </div>
                      <div>
                        <strong>Order Type:</strong>{" "}
                        {popup.order_type === "cod" ? "COD" : "Prepaid"}
                      </div>
                      <div>
                        <strong>Order Specific:</strong> {popup.order_specific}
                      </div>
                      <div>
                        <strong>Order Status:</strong>{" "}
                        {toCapitalizeEachWord(popup.status)}
                      </div>
                      <div>
                        <strong>Total Amount:</strong> ₹
                        {Number(popup.total_amount).toLocaleString()}
                      </div>
                      <div>
                        <strong>Order Weight:</strong>{" "}
                        {Number(popup.total_weight).toLocaleString()}g
                      </div>
                      <div>
                        <strong>Number of Packets:</strong>{" "}
                        {popup.number_of_boxes}
                      </div>
                    </div>

                    {/* Document Info */}
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold text-[rgb(85,77,192)] mb-2">
                        Delivery Details
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <strong>Customer Name:</strong>{" "}
                          {popup.delivery_contact_name}
                        </div>
                        <div>
                          <strong>Customer Contact No:</strong>{" "}
                          {popup.delivery_phone}
                        </div>
                        <div>
                          <strong>Address:</strong>{" "}
                          {popup.delivery_address_line}
                        </div>
                        <div>
                          <strong>City:</strong>{" "}
                          {`${popup.delivery_city}, ${popup.delivery_state} - ${popup.delivery_pincode}` ||
                            "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Bank Info */}
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold text-[rgb(85,77,192)] mb-2">
                        Pickup Details
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <strong>Name:</strong>{" "}
                          {popup.pickup_contact_name || "N/A"}
                        </div>
                        <div>
                          <strong>Pickup Phone No:</strong>{" "}
                          {`${popup.pickup_phone}` || "N/A"}
                        </div>
                        <div>
                          <strong>Address:</strong>{" "}
                          {popup.pickup_address_line || "N/A"}
                        </div>
                        <div>
                          <strong>City:</strong>{" "}
                          {`${popup.pickup_city}, ${popup.pickup_state} - ${popup.pickup_pincode}` ||
                            "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Close Button */}
                    <div className="pt-4 text-right">
                      <button
                        onClick={() => setPopup(null)}
                        className="bg-[rgb(85,77,192)] text-white px-4 py-2 rounded hover:bg-indigo-800 transition"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Loader */
        <Loader />
      )}
    </>
  );
}

export default S;
