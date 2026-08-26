
import "../../../styles/blink.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Loader from "../../Loader";
import { TbFileInfo } from "react-icons/tb";
import { FaSearch, FaFilter, FaDownload, FaTimes, FaCopy, FaCheck, FaBox, FaMapMarkerAlt, FaCalendarAlt, FaWeightHanging, FaRulerCombined, FaShippingFast } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
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

const baseURL = import.meta.env.VITE_BASE_URL;
const frontEndURL = import.meta.env.VITE_FRONTEND_URL;

const options = [
  { value: "Bangalore", label: "Bangalore" },
  { value: "Delhi", label: "Delhi" },
  { value: "Gurugram", label: "Gurugram" },
  { value: "Noida", label: "Noida" },
];

function TechMerchantOrderDetails() {
  const [isCanceled, IsSetcancelOrder] = useState(false);
  const [isOpenIndividualAssignmnet, setIsOpenIndividualAssignmnet] = useState("");
  const [assignmentState, setAssignmentState] = useState("");
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copySuccess, setCopySuccess] = useState(null);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [statu, setStatus] = useState(1);
  const [limit, setLimit] = useState(15);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [popup, setPopup] = useState(null);
  const [assign, setAssign] = useState(false);
  const [assignRiders, setAssignRiders] = useState([]);
  const [assigningOrderId, setAssigningOrderId] = useState(null);
  const [selectedBulkOrders, setSelectedBulkOrders] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [total, setTotal] = useState(0)
  const [advanceFilters, setAdvanceFilters] = useState({
    startDate: "",
    endDate: "",
    order_id: "",
    awbNumber: "",
    city: "",
    state: "",
    pincode: "",
    order_specific: "",
  });
  const [remarks, setremarks] = useState('');
  const [filterUpdate, setFilterUpdate] = useState(false);
  const statusScrollRef = useRef(null);
  const [assignData, setAssignData] = useState({
    rider_id: "",
    order_id: ""
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        status: selectedStatus === "All" ? undefined : selectedStatus,
        order_id: advanceFilters.order_id,
        awb_number: advanceFilters.awbNumber,
        start_date: advanceFilters.startDate,
        end_date: advanceFilters.endDate,
        city: advanceFilters.city,
        pincode: advanceFilters.pincode,
        order_specific: advanceFilters.order_specific,
        token: localStorage.getItem("token"),
      };
      const res = await axios.get(`${baseURL}/api/techbasedmerchant/getallorders`,
        {
          params: params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      if (res?.data?.success) {
        setOrders(res?.data);
        setTotal(res?.data?.pagination?.total)
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "An error occurred while fetching orders."
      );
    } finally {
      setLoading(false);
    }
  };

  const assignOrderToRider = async (orderId, riderId) => {
    try {
      const data = {
        order_id: orderId,
        rider_id: riderId
      };
      const response = await axios.post(`${baseURL}/api/techbasedmerchant/assignOrderToRider`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        fetchOrders();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  function toCapitalizeEachWord(str) {
    return str
      .split(" ")
      .map((word) => {
        if (!word) return "";
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  }

  const getStatusColor = (status) => {
    const statusColors = {
      'delivered': 'bg-green-100 text-green-800 border-green-200',
      'booked': 'bg-blue-100 text-blue-800 border-blue-200',
      'pending pickup': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'out for delivery': 'bg-purple-100 text-purple-800 border-purple-200',
      'undelivered': 'bg-orange-100 text-orange-800 border-orange-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200',
      'rto in transit': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'rto delivered': 'bg-teal-100 text-teal-800 border-teal-200',
      'undelivered assigned': 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const cancelRiderAssignment = async (id) => {
    setLoading(true);
    try {
      const res = await axios.post(`${baseURL}/api/techbasedmerchant/cancelRiderAssignment/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res?.payload?.success) {
        toast.success(res?.data?.message);
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error while canceling rider assignment: ");
    } finally {
      setLoading(false);
    }
  };

  const getOrderTypeColor = (orderType) => {
    const typeColors = {
      'NDD': 'bg-green-100 text-green-800 border border-green-300',
      'SDD': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      'Tur': 'bg-red-100 text-red-800 border border-red-300 animate-blink',
      'default': 'bg-gray-100 text-gray-800 border border-gray-300'
    };
    return typeColors[orderType] || typeColors.default;
  };

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
      pincode: "",
      order_specific: "",
    });
  };

  const status = [
    "All",
    "booked",
    "pending pickup",
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

  const generateShippingLabel = async () => {
    setLoading(true);
    const awbs = [];
    selectedBulkOrders?.forEach(order => {
      awbs.push(order.awb_number);
    });
    try {
      const res = await axios.post(`${baseURL}/api/label/generatelabel`, {
        awbs: awbs
      });

      if (res.data.pdf_link) {
        window.open(res.data.pdf_link, "_blank");
        toast.success("Shipping label(s) generated successfully");
      }
    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Error generating shipping label(s)."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedBulkOrders?.length === orders?.data?.length) {
      setSelectedBulkOrders([]);
    } else {
      setSelectedBulkOrders(orders?.data);
    }
  };

  const exportOrder = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/techbasedmerchant/exportOrder`, {
        params: {
          status: selectedStatus === "All" ? "" : selectedStatus,
          awb_number: advanceFilters.awbNumber,
          order_id: advanceFilters.order_id,
          start_date: advanceFilters.startDate,
          end_date: advanceFilters.endDate,
          city: advanceFilters.city,
          pincode: advanceFilters.pincode,
          order_specific: advanceFilters.order_specific,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "downlode Orders Format.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Orders exported successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to export orders");
    } finally {
      setLoading(false);
    }
  };

  const getRidersOutsideIdealLoad = async (order_id) => {
    try {
      const res = await axios.get(`${baseURL}/api/techbasedmerchant/getRidersOutsideIdealLoad/${order_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAssignRiders(res.data.data);
    } catch (error) {
      toast.error("Error fetching riders");
    }
  };

  const changeStatus = async (id, newStatus) => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${baseURL}/api/techbasedmerchant/updateOrderStatusByMerchant/${id}`,
        {
          status: newStatus,
          remarks: remarks
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(res.data.message);
      fetchOrders();
      setEditingStatusId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrderByMerchant = async () => {
    // Filter only orders that are not already cancelled
    const order = selectedBulkOrders.filter((order) => order.status !== 'cancelled');

    // Filter only "daakit" preference orders
    const daakitOrders = order.filter((o) => o.rider_preference === 'daakit');

    // Filter only orders in "booked" or "pending pickup" status
    const eligibleOrders = daakitOrders.filter((o) =>
      o.status === 'booked' || o.status === 'pending pickup'
    );

    if (eligibleOrders.length === 0) {
      toast.error("No eligible orders found. Only 'daakit' preference orders in 'booked' or 'pending pickup' status can be cancelled.");
      return;
    }

    let order_ids = [];
    eligibleOrders.map((o) => {
      order_ids.push(o.id);
    });

    try {
      const res = await axios.post(`${baseURL}/api/techbasedmerchant/cancelOrderByMerchant`,
        { order_ids },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      toast.success(res.data.message);
      fetchOrders();
      setSelectedBulkOrders([]);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "An error occurred while fetching orders."
      );
    } finally {
      setLoading(false);
    }
  };

  const canPerformAction = (order) => {
    // Check if order has "self" rider preference
    return order.rider_preference === 'self';
  };

  const canCancelOrder = (order) => {
    // Check if order has "daakit" rider preference and is in booked/pending pickup status
    return order.rider_preference === 'daakit' &&
      (order.status === 'booked' || order.status === 'pending pickup');
  };

  const canUpdateStatus = (order) => {
    // For self preference: can update status for multiple statuses
    // For daakit preference: can only cancel (update to cancelled) if in booked/pending pickup
    if (order.rider_preference === 'self') {
      return true; // Self preference can update status
    } else if (order.rider_preference === 'daakit') {
      // Daakit preference can only cancel if in booked/pending pickup
      return order.status === 'booked' || order.status === 'pending pickup';
    }
    return false;
  };

  useEffect(() => {
    fetchOrders();
    setSelectedBulkOrders([]);
    resetAdvanceFilters();
  }, [page, selectedStatus, filterUpdate]);

  return (
    <>
      
        <div className="min-h-screen bg-[#EEEEEE]">
          {/* Header Section */}
          <header className="bg-gradient-to-r from-[#0446DB] to-[#3668E5] shadow-lg">
            <div className=" mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 sm:space-y-4 lg:space-y-0">
                <div className="text-center lg:text-left">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Order Management</h1>
                  <p className="text-blue-100 mt-1 sm:mt-2 text-sm sm:text-base">Manage and track all your orders in one place</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                  {/* <Button variant="outline" className="bg-white text-center py-1 md:py-2 px-3 w-full md:w-auto rounded text-xl text-[#0446DB] border-white hover:bg-blue-50" asChild>
                    <Link to={'/techbased_merchant/create_order'}>Create Order</Link>
                  </Button> */}
                  {/* Action Buttons */}
                  <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-center">
                    <Button
                      onClick={exportOrder}
                      variant="outline"
                      className="bg-white text-[#0446DB] font-medium shadow-md hover:shadow-lg hover:bg-blue-50 transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-none"
                    >
                      <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="">Export</span>
                    </Button>

                    <Button
                      onClick={() => setIsFilterOpen(true)}
                      variant="outline"
                      className="bg-white text-[#0446DB] font-medium shadow-md hover:shadow-lg hover:bg-blue-50 transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-none"
                    >
                      <FaFilter className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="">Filters</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Filters Drawer */}
          <Drawer direction="right" open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DrawerContent className="h-full w-full sm:w-80 sm:max-w-sm">
              <DrawerHeader className="border-b border-gray-200">
                <DrawerTitle className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaFilter className="text-[#0446DB] w-4 h-4 sm:w-5 sm:h-5" />
                  Advanced Filters
                </DrawerTitle>
              </DrawerHeader>

              <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-4">
                    {/* Date Range */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
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
                          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-300 text-sm"
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
                          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-300 text-sm"
                        />
                      </div>
                    </div>

                    {/* Order Specific */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order Type
                      </label>
                      <select
                        value={advanceFilters.order_specific}
                        onChange={(e) => {
                          setAdvanceFilters((prev) => ({
                            ...prev,
                            order_specific: e.target.value,
                          }));
                        }}
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-300 text-sm"
                      >
                        <option value="">All Orders</option>
                        <option value="Turant">Turant</option>
                        <option value="SDD">Same Day Delivery</option>
                        <option value="NDD">Next Day Delivery</option>
                      </select>
                    </div>

                    {/* AWB Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        AWB Number
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
                        placeholder="Enter AWB Number"
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-300 text-sm"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        className="text-sm"
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: "42px",
                            borderColor: "#d1d5db",
                            "&:hover": { borderColor: "#9ca3af" },
                            fontSize: "14px",
                          }),
                          menu: (base) => ({
                            ...base,
                            fontSize: "14px",
                          }),
                        }}
                      />
                    </div>

                    {/* Pincode */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-300 text-sm"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <DrawerFooter className="px-0">
                    <Button
                      type="submit"
                      onClick={() => {
                        setFilterUpdate((prev) => !prev);
                        setIsFilterOpen(false);
                      }}
                      className="flex-1 bg-[#0446DB] text-white hover:bg-[#0339B5] transition-colors duration-200 font-medium shadow-md text-sm sm:text-base"
                    >
                      Apply Filters
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        resetAdvanceFilters();
                        setFilterUpdate((prev) => !prev);
                        setIsFilterOpen(false);
                      }}
                      className="flex-1 font-medium text-sm sm:text-base"
                    >
                      Reset
                    </Button>
                  </DrawerFooter>
                </form>
              </div>
            </DrawerContent>
          </Drawer>

          {/* Main Content */}
          <main className=" mx-auto px-2 sm:px-4 lg:px-6 -mt-2 sm:-mt-6 lg:-mt-4 relative z-10">
            {/* Status Filter Tabs */}
            {/* <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
              <div
                ref={statusScrollRef}
                onWheel={(e) => {
                  if (statusScrollRef.current) {
                    e.preventDefault();
                    statusScrollRef.current.scrollLeft += e.deltaY;
                  }
                }}
                className="flex gap-1 sm:gap-2 overflow-x-auto pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {status.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setSelectedBulkOrders([]);
                      setSelectedStatus(st);
                      setPage(1);
                    }}
                    className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-3 rounded-lg sm:rounded-xl border-2 transition-all duration-300 font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${selectedStatus === st
                      ? "bg-gradient-to-r from-[#0446DB] to-[#3668E5] text-white border-transparent shadow-lg transform scale-105"
                      : "bg-white border-gray-300  hover:bg-gray-50 hover:border-gray-400 hover:shadow-md"
                      }`}
                  >
                    {st === "rto in transit"
                      ? "RTO In Transit"
                      : st === "rto delivered"
                        ? "RTO Delivered"
                        : st === "undelivered assigned"
                          ? "Undelivered Assigned"
                          : toCapitalizeEachWord(st)}
                    {selectedStatus === st && (
                      <span className="bg-white bg-opacity-20 text-gray-800 px-1 sm:px-2 py-0.5 rounded-full text-xs">
                        {orders?.data?.length > 99 ? "99+" : orders?.data?.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div> */}
            <div className="w-full  bg-white   rounded shadow-2xl  dark:bg-gray-900   left-0 px-4 z-40   ">
              <div className="relative flex justify-center ">
                <div
                  className="flex  overflow-x-auto  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-4"
                  onWheel={(e) => {
                    if (e.deltaY === 0) return;
                    e.currentTarget.scrollLeft += e.deltaY;
                  }}
                >
                  <div className="flex gap-2  min-w-max px-8 mt-0"> {/* Added padding on sides */}
                    {status?.map((st) => (
                      <Button
                        key={st}
                        onClick={() => {
                          setSelectedBulkOrders([]);
                          setSelectedStatus(st);
                          setPage(1);
                        }}

                        className={`px-5 py-2.5 rounded-full my-2 border transition-all duration-300 font-medium text-sm tracking-wide ${selectedStatus === st
                          ? "bg-[#0446DB] text-white  border-transparent"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]"
                          }`}
                      >
                        {st === "ndr" ? "NDR" : toCapitalizeEachWord(st)}
                        {selectedStatus === st && (
                          <span className="bg-white bg-opacity-20 text-gray-800 px-1 sm:px-2 py-0.5 rounded-full text-xs">
                            {total > 99 ? "99+" : total}
                          </span>
                        )

                        }
                      </Button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Bulk Actions Section */}
            {selectedBulkOrders?.length > 0 && (
              <div className="mb-4 sm:mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-indigo-100">
                <div className="flex lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">
                      Bulk Actions
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {selectedBulkOrders?.length} order(s) selected
                    </p>
                  </div>

                  <div className="flex   gap-2 sm:gap-3">
                    <Button
                      onClick={async () => {
                        await generateShippingLabel();
                        setSelectedBulkOrders([]);
                      }}
                      className="flex items-center gap-1 sm:gap-2 bg-[#0446DB] hover:bg-[#0339B5] text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium text-sm sm:text-base justify-center"
                    >
                      <FaShippingFast className="w-3 h-3 sm:w-4 sm:h-4" />
                      Generate Labels
                    </Button>

                    {/* Cancel Order Button - Only for daakit preference */}
                    {
                      isCanceled && (

                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const newStatus = e.target.elements.status.value;
                            cancelOrderByMerchant()
                          }}
                        >
                          <div className="flex flex-col items-center gap-2">

                            <select
                              name="status"
                              defaultValue="cancelled"
                              className="text-xs border border-gray-300 rounded-md px-2 py-1 w-full"
                              required
                            >
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-[#0339B5] whitespace-nowrap"
                              >
                                Cancel Order
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  IsSetcancelOrder(false)
                                }
                                className="text-xs text-gray-500 hover:underline whitespace-nowrap"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </form>
                      )
                    }
                    {
                      !isCanceled && selectedStatus == 'booked' && selectedStatus == 'pending pickup' && (

                        <Button
                          className="flex items-center gap-1 sm:gap-2 bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium text-sm sm:text-base justify-center"
                          onClick={() => IsSetcancelOrder(true)}
                        >
                          <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                          Cancel Order
                        </Button>
                      )
                    }

                    <Button
                      className="flex items-center gap-1 sm:gap-2 bg-gray-500 hover:bg-gray-600 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium text-sm sm:text-base justify-center"
                      onClick={() => {
                        setSelectedBulkOrders([])
                        IsSetcancelOrder(false)

                      }}
                    >
                      <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                      Clear
                    </Button>
                  </div>
                </div>

                {/* Selected Orders Preview */}
                <div className="mt-3 sm:mt-4 bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-h-32 sm:max-h-40 overflow-y-auto">
                    {selectedBulkOrders?.slice(0, 4).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-800 text-sm truncate">{order.merchant_order_id}</p>
                          <p className="text-xs text-gray-500 truncate">{order.awb_number}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            <span className={`px-1 py-0.5 rounded ${order.rider_preference === 'self' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                              {order.rider_preference === 'self' ? 'Self' : 'Daakit'}
                            </span>
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${getStatusColor(order.status)}`}>
                          {toCapitalizeEachWord(order.status)}
                        </span>
                      </div>
                    ))}
                    {selectedBulkOrders?.length > 4 && (
                      <div className="flex items-center justify-center p-2 sm:p-3 bg-gray-100 rounded-lg">
                        <p className="text-gray-600 text-sm">+{selectedBulkOrders?.length - 4} more</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Orders Table */}
            <div className="bg-white shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                
                  <div className="min-w-full">


                    {/* Desktop Table View */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="px-3 lg:px-6 py-3 text-left">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-[#0446DB] rounded border-gray-300 focus:ring-[#0446DB]"
                              checked={selectedBulkOrders?.length === orders?.data?.length && orders?.data?.length > 0}
                              onChange={toggleSelectAll}
                            />
                          </TableHead>
                          <TableHead className="px-3 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Order Information
                          </TableHead>
                          {(selectedStatus === "pending pickup" ||
                            selectedStatus === "out for delivery" ||
                            selectedStatus === "delivered" ||
                            selectedStatus === "undelivered assigned") && (
                              <TableHead className="px-3 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Rider Details
                              </TableHead>
                            )}
                          <TableHead className="px-3 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Delivery Address
                          </TableHead>
                          <TableHead className="px-3 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Package Details
                          </TableHead>
                          <TableHead className="px-3 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Preference
                          </TableHead>
                          <TableHead className="px-3 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Assignment
                          </TableHead>
                          <TableHead className="px-3 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {


                          loading ? (
                            <>
                              <TableRow>
                                <TableCell colSpan={10} className="text-center py-10">
                                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                                  <p className="mt-2">Loading orders...</p>
                                </TableCell>
                              </TableRow>
                            </>
                          ) : orders?.data?.length == 0 ? (
                            <>
                              <TableRow>
                                <TableCell colSpan={10} className="text-center py-10">
                                  No orders found
                                </TableCell>
                              </TableRow>
                            </>
                          ) : (
                            orders?.data.map((order, index) => {
                              const isSelected = selectedBulkOrders?.some((o) => o.id === order.id);
                              const isSelfPreference = canPerformAction(order);
                              const isDaakitEligibleForCancel = canCancelOrder(order);
                              const canUpdateOrderStatus = canUpdateStatus(order);

                              return (
                                <TableRow key={order.id} className={`hover:bg-gray-50 transition-colors duration-200 ${isSelected ? 'bg-indigo-50' : ''}`}>
                                  {/* Selection Checkbox */}
                                  <TableCell className="px-3 lg:px-6 py-4">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedBulkOrders((prev) => [...prev, order]);
                                        } else {
                                          setSelectedBulkOrders((prev) => prev?.filter((o) => o.id !== order.id));
                                        }
                                      }}
                                      className="w-4 h-4 text-[#0446DB] rounded border-gray-300 focus:ring-[#0446DB]"
                                    />
                                  </TableCell>

                                  {/* Order Information */}
                                  <TableCell className="px-3 lg:px-6 py-4">
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <a
                                          href={`${frontEndURL}/track-order?awb_number=${order.awb_number}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="font-semibold text-[#0446DB] hover:text-[#0339B5] hover:underline transition-colors duration-200 text-sm"
                                        >
                                          {order.awb_number}
                                        </a>
                                        <button
                                          onClick={() => {
                                            navigator.clipboard.writeText(order.awb_number);
                                            setCopySuccess(order.awb_number);
                                            setTimeout(() => setCopySuccess(null), 2000);
                                            toast.success("AWB copied to clipboard");
                                          }}
                                          className="text-gray-400 hover:text-[#0446DB] transition-colors duration-200 p-1 rounded"
                                        >
                                          {copySuccess === order.awb_number ? <FaCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" /> : <FaCopy className="w-3 h-3 sm:w-4 sm:h-4" />}
                                        </button>
                                        {/* <button
                                        onClick={() => setPopup(order)}
                                        className="text-gray-400 hover:text-[#0446DB] transition-colors duration-200 p-1 rounded"
                                      >
                                        <TbFileInfo className="w-3 h-3 sm:w-4 sm:h-4" />
                                      </button> */}
                                        <Dialog className='w-5xl'>

                                          <DialogTrigger asChild>
                                            <Button variant="outline" className="text-xs font-medium  text-red-600  inline-block cursor-pointer ">
                                              <span >
                                                <TbFileInfo />
                                              </span>
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent className="sm:max-w-4xl h-[70%] overflow-y-scroll">
                                            <DialogHeader>
                                              <DialogTitle>Order Details</DialogTitle>

                                            </DialogHeader>
                                            <div className="space-y-4 sm:space-y-6">
                                              {/* Basic Information */}
                                              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                                                <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                                  <FaBox className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                                                  Basic Information
                                                </h3>
                                                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                                                  {[
                                                    { label: "Order ID", value: order.merchant_order_id, copy: true },
                                                    { label: "AWB Number", value: order.awb_number, copy: true },
                                                    { label: "Order Type", value: order.order_type === "cod" ? "COD" : "Prepaid" },
                                                    { label: "Order Specific", value: order.order_specific },
                                                    { label: "Rider Preference", value: order.rider_preference === 'self' ? 'Self' : 'Daakit' },
                                                    { label: "Order Status", value: toCapitalizeEachWord(order.status) },
                                                    { label: "Total Amount", value: `₹${Number(order.total_amount).toLocaleString()}` },
                                                    { label: "Order Weight", value: `${Number(order.total_weight).toLocaleString()}g` },
                                                    { label: "Number of Packets", value: order.number_of_boxes },
                                                  ].map((item, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                      <span className="text-xs sm:text-sm font-medium text-gray-600">{item.label}:</span>
                                                      <div className="flex items-center gap-1 sm:gap-2 max-w-[60%]">
                                                        <span className="text-xs sm:text-sm text-gray-800 truncate">{item.value}</span>
                                                        {item.copy && (
                                                          <button
                                                            onClick={() => {
                                                              navigator.clipboard.writeText(item.value);
                                                              toast.success(`${item.label} copied!`);
                                                            }}
                                                            className="text-gray-400 hover:text-indigo-600 transition-colors duration-200 flex-shrink-0"
                                                          >
                                                            <FaCopy className="w-3 h-3" />
                                                          </button>
                                                        )}
                                                      </div>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>

                                              {/* Delivery Information */}
                                              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                                                <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                                  <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                                  Delivery Information
                                                </h3>
                                                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                                  {[
                                                    { label: "Customer Name", value: order.delivery_contact_name },
                                                    { label: "Contact Number", value: order.delivery_phone },
                                                    { label: "Address", value: order.delivery_address_line },
                                                    { label: "City/State/Pincode", value: `${order.delivery_city}, ${order.delivery_state} - ${order.delivery_pincode}` },
                                                  ].map((item, index) => (
                                                    <div key={index}>
                                                      <span className="text-xs sm:text-sm font-medium text-gray-600">{item.label}:</span>
                                                      <p className="text-xs sm:text-sm text-gray-800 mt-1 break-words">{item.value}</p>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>

                                              {/* Pickup Information */}
                                              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                                                <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                                  <FaShippingFast className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                                  Pickup Information
                                                </h3>
                                                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                                  {[
                                                    { label: "Pickup Name", value: order.pickup_contact_name || "N/A" },
                                                    { label: "Pickup Phone", value: order.pickup_phone || "N/A" },
                                                    { label: "Pickup Address", value: order.pickup_address_line || "N/A" },
                                                    { label: "Pickup Location", value: order.pickup_city ? `${order.pickup_city}, ${order.pickup_state} - ${order.pickup_pincode}` : "N/A" },
                                                  ].map((item, index) => (
                                                    <div key={index}>
                                                      <span className="text-xs sm:text-sm font-medium text-gray-600">{item.label}:</span>
                                                      <p className="text-xs sm:text-sm text-gray-800 mt-1 break-words">{item.value}</p>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            </div>

                                            <DialogFooter>

                                              <DialogClose asChild>

                                                <Button variant="outline">Cancel</Button>
                                              </DialogClose>

                                            </DialogFooter>
                                          </DialogContent>
                                        </Dialog>
                                      </div>

                                      <p className="text-xs text-gray-500">
                                        {new Date(order.created_at).toLocaleString("en-IN", {
                                          timeZone: "Asia/Kolkata",
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          hour12: true,
                                        })}
                                      </p>

                                      <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <span>MID: {order.merchant_id}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                          MOID: {order.merchant_order_id?.length <= 15 ? order.merchant_order_id : `${order.merchant_order_id.slice(0, 15)}...`}
                                          <button
                                            onClick={() => {
                                              navigator.clipboard.writeText(order.merchant_order_id);
                                              setCopySuccess(order.merchant_order_id);
                                              setTimeout(() => setCopySuccess(null), 2000);
                                              toast.success("Order ID copied to clipboard");
                                            }}
                                            className="text-gray-400 hover:text-[#0446DB] transition-colors duration-200"
                                          >
                                            {copySuccess === order.merchant_order_id ? <FaCheck className="w-3 h-3 text-green-500" /> : <FaCopy className="w-3 h-3" />}
                                          </button>
                                        </span>
                                      </div>
                                    </div>
                                  </TableCell>

                                  {/* Rider Details */}
                                  {(selectedStatus === "pending pickup" ||
                                    selectedStatus === "out for delivery" ||
                                    selectedStatus === "delivered" ||
                                    selectedStatus === "undelivered assigned") && (
                                      <TableCell className="px-3 lg:px-6 py-4">
                                        <div className="bg-gray-50 rounded-lg p-2">
                                          <p className="font-medium text-gray-800 text-sm">
                                            {order.vendor_id ? `FP_${order.vendor_id}_` : order.r_merchant_id ? `M${order.r_merchant_id}_R` : "DKT_"}
                                            {order.rider_id}
                                          </p>
                                          <p className="text-xs text-gray-500 mt-1">Assigned Rider</p>
                                        </div>
                                      </TableCell>
                                    )}

                                  {/* Delivery Address */}
                                  <TableCell className="px-3 lg:px-6 py-4">
                                    <div className="space-y-1">
                                      <p className="font-medium text-gray-800 whitespace-nowrap flex items-center gap-1 text-sm">
                                        <FaMapMarkerAlt className="w-3 h-3 text-red-500" />
                                        {order.delivery_contact_name}
                                      </p>
                                      <p className="text-xs text-gray-600 whitespace-nowrap">{order.delivery_address_line}</p>
                                      <p className="text-xs text-gray-500  whitespace-nowrap">
                                        {order.delivery_city}, {order.delivery_state} - {order.delivery_pincode}
                                      </p>
                                      <p className="text-xs text-gray-400 whitespace-nowrap">{order.delivery_country}</p>
                                    </div>
                                  </TableCell>

                                  {/* Package Details */}
                                  <TableCell className="px-3 lg:px-6 py-4">
                                    <div className="space-y-2">
                                      {selectedStatus !== "cancelled" && (
                                        <div className="flex items-center whitespace-nowrap gap-2 text-xs">
                                          <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                                          <span>
                                            EDD:{" "}
                                            {(() => {
                                              const raw = new Date(order.created_at);
                                              const prefix = order.order_specific?.slice(0, 3);

                                              if (order.order_specific === "Turant") {
                                                raw.setHours(raw.getHours() + 4);
                                              } else if (prefix === "SDD") {
                                                raw.setHours(20, 0, 0, 0);
                                              } else if (prefix === "NDD") {
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
                                        </div>
                                      )}

                                      <div className="flex items-center gap-2 text-xs">
                                        <FaWeightHanging className="w-3 h-3 text-gray-400" />
                                        <span>Weight: {Number(order.total_weight).toLocaleString()}g</span>
                                        {selectedStatus !== "cancelled" && (
                                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getOrderTypeColor(order.order_specific?.slice(0, 3))}`}>
                                            {order.order_specific?.slice(0, 3) === "NDD"
                                              ? "NDD"
                                              : order.order_specific?.slice(0, 3) === "SDD"
                                                ? "SDD"
                                                : order.order_specific?.slice(0, 6) === "Turant"
                                                  ? "Turant"
                                                  : order.order_specific}
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-2 text-xs">
                                        <FaRulerCombined className="w-3 h-3 text-gray-400" />
                                        <span>
                                          Dimensions: {order.package_length}x{order.package_breadth}x{order.package_height}
                                        </span>
                                      </div>
                                    </div>
                                  </TableCell>

                                  {/* Rider Preference */}
                                  <TableCell className="px-3 lg:px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.rider_preference === 'self' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-blue-100 text-blue-800 border border-blue-300'}`}>
                                      {order.rider_preference === 'self' ? 'Self' : 'Daakit'}
                                    </span>
                                  </TableCell>

                                  {/* Assignment */}
                                  {isSelfPreference ? (
                                    <TableCell className="px-6 py-4 text-center">
                                      {order.status === "booked" ||
                                        order.status === "undelivered" ? (
                                        <>
                                          {!(
                                            isOpenIndividualAssignmnet === order.id
                                          ) ? (
                                            <span
                                              onClick={() => {
                                                getRidersOutsideIdealLoad([order.id]);
                                                setIsOpenIndividualAssignmnet(order.id);
                                              }}
                                              className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer whitespace-nowrap"
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
                                                assignOrderToRider(order.id, selectedRider);
                                                setIsOpenIndividualAssignmnet("");
                                              }}
                                              className="flex items-center gap-2"
                                            >
                                              <select
                                                value={assignmentState}
                                                onChange={(e) =>
                                                  setAssignmentState(e.target.value)
                                                }
                                                className="border px-2 py-1 rounded-md text-xs"
                                                required
                                              >
                                                <option value="" disabled>
                                                  Select Rider
                                                </option>
                                                {assignRiders.map((rider) => (
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
                                                className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-[#0339B5] whitespace-nowrap"
                                              >
                                                Assign
                                              </button>
                                              <button
                                                type="button"
                                                className="text-xs text-gray-500 hover:underline whitespace-nowrap"
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
                                        order.status === "undelivered assigned" ? (
                                        <>
                                          {!(
                                            isOpenIndividualAssignmnet === order.id
                                          ) ? (
                                            <span
                                              onClick={() => {
                                                setIsOpenIndividualAssignmnet(order.id);
                                              }}
                                              className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 mb-2 inline-block cursor-pointer whitespace-nowrap"
                                            >
                                              Assigned
                                            </span>
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
                                                className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-[#0339B5] whitespace-nowrap"
                                              >
                                                Cancel Rider Assignment
                                              </button>
                                              <button
                                                type="button"
                                                className="text-xs text-gray-500 hover:underline whitespace-nowrap"
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
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 whitespace-nowrap">
                                          Order Canceled
                                        </span>
                                      ) : order.status === "delivered" ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 whitespace-nowrap">
                                          Order Delivered
                                        </span>
                                      ) : order.status === "rto delivered" ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 whitespace-nowrap">
                                          Return To Origin
                                        </span>
                                      ) : (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 whitespace-nowrap">
                                          Assigned
                                        </span>
                                      )}
                                    </TableCell>
                                  ) : (
                                    <TableCell className="text-center">
                                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} inline-block whitespace-nowrap`}>
                                        {toCapitalizeEachWord(order.status)}
                                      </span>
                                    </TableCell>
                                  )}

                                  {/* Status */}
                                  <TableCell className="px-6 py-4 text-center">
                                    {isSelfPreference ? (
                                      <>
                                        {order.status === "cancelled" ||
                                          order.status === "undelivered" ||
                                          order.status === "delivered" ||
                                          order.status === "ndr" ||
                                          order.status === "rto delivered" ? (
                                          <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${getStatusColor(order.status)}`}
                                          >
                                            {order.status === "rto delivered"
                                              ? "RTO Delivered"
                                              : order.status === "ndr"
                                                ? "NDR"
                                                : toCapitalizeEachWord(order.status)}
                                          </span>
                                        ) : (
                                          <>
                                            {editingStatusId === order.id ? (
                                              <form
                                                onSubmit={async (e) => {
                                                  e.preventDefault();
                                                  var newStatus =
                                                    e.target.elements.status.value;
                                                  changeStatus(order.id, newStatus);
                                                }}
                                              >
                                                <div className="flex-col items-center gap-2">
                                                  {(order.status === "booked" || statu === 'cancelled') && (
                                                    <input
                                                      type="text"
                                                      onChange={(e) => setremarks(e.target.value)}
                                                      placeholder="Enter cancelled region"
                                                      className="w-full px-2 py-0 rounded border border-gray-300 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB] focus:outline-none text-gray-700 placeholder-gray-400 text-xs"
                                                    />
                                                  )}
                                                  <select
                                                    name="status"
                                                    defaultValue={order.status}
                                                    onChange={(e) => setStatus(e.target.value)}
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
                                                            in transit
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
                                                            out for delivery
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
                                                    className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-[#0339B5] whitespace-nowrap"
                                                  >
                                                    Update
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      setEditingStatusId(null)
                                                    }
                                                    className="text-xs text-gray-500 hover:underline whitespace-nowrap"
                                                  >
                                                    Close
                                                  </button>
                                                </div>
                                              </form>
                                            ) : (
                                              <span
                                                onClick={() =>
                                                  setEditingStatusId(order.id)
                                                }
                                                className="px-3 py-1 rounded-full text-xs font-semibold inline-block bg-blue-100 text-blue-600 cursor-pointer whitespace-nowrap"
                                              >
                                                {order.status === "rto in transit"
                                                  ? "RTO In Transit"
                                                  : toCapitalizeEachWord(order.status)}
                                              </span>
                                            )}
                                          </>
                                        )}
                                      </>
                                    ) : (
                                      /* Daakit preference status */
                                      <>
                                        {isDaakitEligibleForCancel ? (
                                          <>
                                            {editingStatusId === order.id ? (
                                              <form
                                                onSubmit={async (e) => {
                                                  e.preventDefault();
                                                  const newStatus = e.target.elements.status.value;
                                                  changeStatus(order.id, newStatus);
                                                }}
                                              >
                                                <div className="flex flex-col items-center gap-2">
                                                  <input
                                                    type="text"
                                                    onChange={(e) => setremarks(e.target.value)}
                                                    placeholder="Enter cancellation reason"
                                                    className="w-full px-2 py-1 rounded border border-gray-300 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB] focus:outline-none text-gray-700 placeholder-gray-400 text-xs"
                                                    required
                                                  />
                                                  <select
                                                    name="status"
                                                    defaultValue="cancelled"
                                                    className="text-xs border border-gray-300 rounded-md px-2 py-1 w-full"
                                                    required
                                                  >
                                                    <option value="cancelled">Cancelled</option>
                                                  </select>
                                                  <div className="flex gap-2">
                                                    <button
                                                      type="submit"
                                                      className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-[#0339B5] whitespace-nowrap"
                                                    >
                                                      Cancel Order
                                                    </button>
                                                    <button
                                                      type="button"
                                                      onClick={() =>
                                                        setEditingStatusId(null)
                                                      }
                                                      className="text-xs text-gray-500 hover:underline whitespace-nowrap"
                                                    >
                                                      Close
                                                    </button>
                                                  </div>
                                                </div>
                                              </form>
                                            ) : (
                                              <span
                                                onClick={() => {
                                                  setEditingStatusId(order.id);
                                                }}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${getStatusColor(order.status)} cursor-pointer whitespace-nowrap  transition-colors duration-200`}
                                              >
                                                {toCapitalizeEachWord(order.status)}
                                              </span>
                                            )}
                                          </>
                                        ) : (
                                          <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${getStatusColor(order.status)} whitespace-nowrap`}
                                          >
                                            {toCapitalizeEachWord(order.status)}
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          )}
                      </TableBody>
                    </Table>
                  </div>
               
              </div>

              {/* Pagination */}
              {orders?.data?.length > 0 && (
                <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <p className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                      Page {page} of {orders?.pagination?.totalPages} • {orders?.data?.length} total
                    </p>
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${page === 1
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-[#0446DB] text-white hover:bg-[#0339B5] shadow-md hover:shadow-lg"
                          }`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, orders?.pagination?.totalPages))}
                        disabled={page === orders?.pagination?.totalPages}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${page === orders?.pagination?.totalPages
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-[#0446DB] text-white hover:bg-[#0339B5] shadow-md hover:shadow-lg"
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

          
        </div>
      
    </>
  );
}

export default TechMerchantOrderDetails;
