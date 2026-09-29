import { useEffect, useState } from "react";
import axios from "axios";
import { TbFileInfo } from "react-icons/tb";
import {
  FaFilter,
  FaDownload,
  FaTimes,
  FaCopy,
  FaCheck,
  FaBox,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaWeightHanging,
  FaRulerCombined,
  FaShippingFast,
  FaRegCopy,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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
import { CirclePlus, Layers3, Loader2 } from "lucide-react";
import AxiosInstance from "../../../../Helper/axiosInstance";

const baseURL = import.meta.env.VITE_BASE_URL;
const frontEndURL = import.meta.env.VITE_FRONTEND_URL;

const options = [
  { value: "Bangalore", label: "Bangalore" },
  { value: "Delhi", label: "Delhi" },
  { value: "Gurugram", label: "Gurugram" },
  { value: "Noida", label: "Noida" },
];

function TechMerchantOrderDetails() {
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(null);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [popup, setPopup] = useState(null);
  const [selectedBulkOrders, setSelectedBulkOrders] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDrawerFilterOpen, setIsDrawerFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  // const [advanceFilters, setAdvanceFilters] = useState({
  //   startDate: "",
  //   endDate: "",
  //   order_id: "",
  //   awbNumber: "",
  //   city: "",
  //   state: "",
  //   pincode: "",
  //   order_specific: "",
  // });

  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const [advanceFilters, setAdvanceFilters] = useState({
    startDate: oneMonthAgo.toISOString().split("T")[0],
    endDate: today.toISOString().split("T")[0],
    order_id: "",
    awbNumber: "",
    city: "",
    state: "",
    pincode: "",
    order_specific: "",
  });
  const [remarks, setremarks] = useState("");
  const [filterUpdate, setFilterUpdate] = useState(false);
  const [total, setTotal] = useState(0);

  const openDatePicker = (event) => {
    try {
      event.currentTarget.showPicker?.();
    } catch {
      return;
    }
  };

  const updateAdvanceFilter = (field, value) => {
    setAdvanceFilters((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };

      if (
        field === "startDate" &&
        next.endDate &&
        value &&
        next.endDate < value
      ) {
        next.endDate = value;
      }

      if (
        field === "endDate" &&
        next.startDate &&
        value &&
        next.startDate > value
      ) {
        next.startDate = value;
      }

      return next;
    });
  };

  const applyFilters = () => {
    if (
      advanceFilters.startDate &&
      advanceFilters.endDate &&
      advanceFilters.startDate > advanceFilters.endDate
    ) {
      toast.error("Start date cannot be after end date");
      return false;
    }

    setPage(1);
    setFilterUpdate((prev) => !prev);
    setIsFilterOpen(false);
    setIsDrawerFilterOpen(false);
    return true;
  };

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
        order_specific: advanceFilters.order_specific
      };
      const res = await axios.get(`${baseURL}/api/merchant/getallorders`, {
        params: params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res?.data?.success) {
        setOrders(res?.data);
        setTotal(res?.data?.pagination?.total);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while fetching orders.",
      );
    } finally {
      setLoading(false);
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
      delivered: "bg-green-100 text-green-800 border-green-200",
      booked: "bg-blue-100 text-blue-800 border-blue-200",
      "pending pickup": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "out for delivery": "bg-purple-100 text-purple-800 border-purple-200",
      undelivered: "bg-orange-100 text-orange-800 border-orange-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      "rto in transit": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "rto delivered": "bg-teal-100 text-teal-800 border-teal-200",
      "undelivered assigned": "bg-pink-100 text-pink-800 border-pink-200",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getOrderTypeColor = (orderType) => {
    const typeColors = {
      NDD: "bg-green-100 text-green-800 border border-green-300",
      SDD: "bg-yellow-100 text-yellow-800 border border-yellow-300",
      Tur: "bg-red-100 text-red-800 border border-red-300 animate-blink",
      default: "bg-gray-100 text-gray-800 border border-gray-300",
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

  const generateShippingLabel = async () => {
    setLoading(true);
    const awbs = [];
    selectedBulkOrders?.forEach((order) => {
      awbs.push(order.awb_number);
    });
    try {
      const res = await axios.post(`${baseURL}/api/label/generatelabel`, {
        awbs: awbs,
      });

      if (res.data.pdf_link) {
        window.open(res.data.pdf_link, "_blank");
        toast.success("Shipping label(s) generated successfully");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Error generating shipping label(s).",
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
      const res = await axios.get(`${baseURL}/api/merchant/exportOrder`, {
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

      link.setAttribute("download", "Orders.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Orders exported successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to export orders",
      );
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id, newStatus) => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${baseURL}/api/merchant/cancelOrderByMerchant`,
        { 
          order_ids:[id],
          status: newStatus,
          remarks: remarks,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success("Order cancelled successfully");
      fetchOrders();
      setEditingStatusId(null);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to update status",
      );
    } finally {
      setLoading(false);
    }
  };

  const clearAllState = () => {
  setSelectedBulkOrders([]);
  setremarks("");
  setEditingStatusId(null);
  setPopup(null);
};

  const cancelOrderByMerchant = async () => {

     if (!remarks) {
    toast.warning("Please select cancellation reason");
    return;
  }
    const eligibleOrders = selectedBulkOrders.filter(
      (order) => order.status === "booked" || order.status === "pending pickup",
    );

    if (eligibleOrders.length === 0) {
      toast.error(
        "No eligible orders found. Only orders in 'booked' or 'pending pickup' status can be cancelled.",
      );
      return;
    }

    let order_ids = [];
    eligibleOrders?.map((o) => {
      order_ids.push(o.id);
    });
   
    try {
      const res = await axios.post(
        `${baseURL}/api/merchant/cancelOrderByMerchant`,
        { order_ids ,

          remarks: remarks,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      clearAllState()
      toast.success(res.data.message);
      fetchOrders();
      setSelectedBulkOrders([]);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while fetching orders.",
      );
    } finally {
      setLoading(false);
    }
  };



  const generateBulkPickupRequest = async (order_ids) => {
  if (!order_ids?.length) {
    toast.warn("Please select at least one order");
    return;
  }

  try {
    setLoading(true);

    const res = await AxiosInstance.post(
      "/api/admin/generateBulkPickupRequest",
      {
        order_ids,
      }
    );

    toast.success(
      res?.data?.message || "Pickup scheduled successfully"
    );

    // Clear selected orders after success
    setSelectedBulkOrders([]);

    // Refresh orders
    await fetchOrders();
  } catch (error) {
    console.error("Generate Bulk Pickup Request Error:", error);

    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to schedule pickup"
    );
  } finally {
    setLoading(false);
  }
};

  const canCancelOrder = (order) => {
    return order.status === "booked" || order.status === "pending pickup";
  };

  useEffect(() => {
    fetchOrders();
    setSelectedBulkOrders([]);
    // resetAdvanceFilters();
  }, [page, selectedStatus, filterUpdate]);
  // filterUpdate

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
                    <p className="mt-2"> Loading Order Details...</p>
                  </div>
                </div>
      ):(

      <div className="min-h-screen">
        {/* Header Section */}
        <header className="">
          <div className=" mx-auto px-3 py-3">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 sm:space-y-4 lg:space-y-0">
              <div className="text-center lg:text-left">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold dar:text-white">
                  Order Management
                </h1>
                <p className="darl:text-indigo-100 mt-1 sm:mt-2 text-sm sm:text-base">
                  Manage and track all your orders in one place
                </p>
              </div>

              <div>
               
                <div className="flex flex-wrap items-center justify-end gap-3">
                {/* Action Buttons */}

                {/* Create Order */}
                <button className="">
                  <Link
                    to="/merchant/create_order"
                    className="inline-flex h-9 w-auto items-center gap-1.5 rounded-md border border-[#0446DB]/25 bg-white px-4 text-xs font-medium text-[#0446DB] shadow-sm transition hover:border-[#0446DB] hover:bg-blue-50 hover:text-[#0446DB] cursor-pointer"
                  >
                    <CirclePlus size={17} />
                    <span>Create Order</span>
                  </Link>
                </button>

                {/* Bulk Upload */}
                <button className="">
                  <Link
                    to="/merchant/bulk-upload"
                    className="inline-flex h-9 w-auto items-center gap-1.5 rounded-md border border-[#0446DB]/25 bg-white px-4 text-xs font-medium text-[#0446DB] shadow-sm transition hover:border-[#0446DB] hover:bg-blue-50 hover:text-[#0446DB] cursor-pointer"
                  >
                    <Layers3 size={17} />
                    <span>Bulk Upload</span>
                  </Link>
                </button>

                {/* Export */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={exportOrder}
                  className="inline-flex h-9 w-auto items-center gap-1.5 rounded-md border border-[#0446DB]/25 bg-white px-4 text-xs font-medium text-[#0446DB] shadow-sm transition hover:border-[#0446DB] hover:bg-blue-50 hover:text-[#0446DB] cursor-pointer"
                >
                  <FaDownload className="h-3 w-3" />
                  <span>Export</span>
                </Button>

                

                <Drawer
                  direction="right"
                  open={isDrawerFilterOpen}
                  onOpenChange={setIsDrawerFilterOpen}
                >
                  <DrawerTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-white w-auto  mt-1 text-[#0446DB] font-medium px-5  rounded-sm shadow hover:bg-indigo-100 hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
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
                    <div className=" p-3">
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
                                max={advanceFilters.endDate || undefined}
                                onClick={openDatePicker}
                                onFocus={openDatePicker}
                                onChange={(e) =>
                                  updateAdvanceFilter(
                                    "startDate",
                                    e.target.value,
                                  )
                                }
                                className="w-full cursor-pointer border border-gray-300 bg-white px-3 py-2 rounded-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                              </label>
                              <input
                                type="date"
                                value={advanceFilters.endDate}
                                min={advanceFilters.startDate || undefined}
                                onClick={openDatePicker}
                                onFocus={openDatePicker}
                                onChange={(e) =>
                                  updateAdvanceFilter("endDate", e.target.value)
                                }
                                className="w-full cursor-pointer border border-gray-300 bg-white px-3 py-2 rounded-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
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
                              className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
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
                              className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
                            />
                          </div>

                          {/* City */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Pickup City
                            </label>

                            <input
                              type="text"
                              value={advanceFilters.city}
                              onChange={(e) =>
                                setAdvanceFilters((prev) => ({
                                  ...prev,
                                  city: e.target.value,
                                }))
                              }
                              placeholder="Enter City"
                              className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
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
                              className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col xs:flex-row gap-3 mt-6 pt-4 border-t border-gray-200">
                          <Button
                            type="submit"
                            onClick={applyFilters}
                            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-sm hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-md text-sm sm:text-base"
                          >
                            Apply Filters
                          </Button>
                        </div>
                      </form>
                    </div>
                    <DrawerFooter>
                      <Button
                        onClick={() => {
                          resetAdvanceFilters();
                          setPage(1);
                          setFilterUpdate((prev) => !prev);
                          setIsFilterOpen(false);
                          setIsDrawerFilterOpen(false);
                        }}
                        variant="outline"
                      >
                        Reset
                      </Button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
              </div>
            </div>
          </div>
        </header>

        {/* Filters Sidebar - Mobile Friendly */}
        <div
          className={`fixed top-0 right-0 h-full rounded-tl-4xl w-full sm:w-80 bg-white shadow-xl shadow-white z-50 transform transition-transform duration-300 ease-in-out ${
            isFilterOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaFilter className="text-indigo-600 w-4 h-4 sm:w-5 sm:h-5" />
              Advanced Filters
            </h2>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-sm hover:bg-gray-100"
            >
              <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="p-4 sm:p-6 h-[calc(100vh-80px)] overflow-y-auto">
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
                      max={advanceFilters.endDate || undefined}
                      onClick={openDatePicker}
                      onFocus={openDatePicker}
                      onChange={(e) =>
                        updateAdvanceFilter("startDate", e.target.value)
                      }
                      className="w-full cursor-pointer border border-gray-300 bg-white px-3 py-2 rounded-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={advanceFilters.endDate}
                      min={advanceFilters.startDate || undefined}
                      onClick={openDatePicker}
                      onFocus={openDatePicker}
                      onChange={(e) =>
                        updateAdvanceFilter("endDate", e.target.value)
                      }
                      className="w-full cursor-pointer border border-gray-300 bg-white px-3 py-2 rounded-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
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
                    className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
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
                    className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup City
                  </label>
                  {/* <Select
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
                    /> */}
                  <input
                    type="text"
                    value={advanceFilters.city}
                    onChange={(e) =>
                      setAdvanceFilters((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    placeholder="Enter City"
                    className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
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
                    className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col xs:flex-row gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  onClick={applyFilters}
                  className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-sm hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-md text-sm sm:text-base"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    resetAdvanceFilters();
                    setPage(1);
                    setFilterUpdate((prev) => !prev);
                    setIsFilterOpen(false);
                    setIsDrawerFilterOpen(false);
                  }}
                  className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-sm hover:bg-gray-600 transition-colors duration-200 font-medium shadow-md text-sm sm:text-base"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Main Content */}
        <main className=" mx-auto  z-10">
          <div className="w-full  bg-white   rounded shadow-2xl  dark:bg-gray-900   left-0 px-4 z-40   ">
            <div className="relative flex justify-center ">
              <div
                className="flex  overflow-x-auto  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-4"
                onWheel={(e) => {
                  if (e.deltaY === 0) return;
                  e.currentTarget.scrollLeft += e.deltaY;
                }}
              >
                <div className="flex gap-2  min-w-max px-8 mt-0">
                  {" "}
                  {/* Added padding on sides */}
                  {status?.map((st) => (
                    <Button
                      key={st}
                      onClick={() => {
                        setSelectedBulkOrders([]);
                        setSelectedStatus(st);
                        setPage(1);
                      }}
                      className={`px-5 py-2.5 rounded-full my-2 border transition-all duration-300 font-medium text-sm tracking-wide ${
                        selectedStatus === st
                          ? "bg-[#0446DB] text-white  border-transparent"
                          : "bg-white hover:bg-[#0446DB] hover:text-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]"
                      }`}
                    >
                      {st === "ndr" ? "NDR" : toCapitalizeEachWord(st)}
                      {selectedStatus === st && (
                        <span className="bg-white bg-opacity-20 text-gray-800 px-1 sm:px-2 py-0.5 rounded-full text-xs">
                          {total > 99 ? "99+" : total}
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            {selectedBulkOrders?.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger
                    
                  >

                    <Button
                        variant="outline"
                        className="h-7 cursor-pointer rounded-sm my-1 border-[#0446DB] px-4 text-sm font-medium bg-[#0446DB] text-[#fff] hover:bg-blue-50 hover:text-[#0446DB] dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10"
                      >
                        Bulk Actions
                        </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                    
                    {/* Header */}
                    <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
                      <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
                        Bulk Order Actions
                      </AlertDialogTitle>

                      <AlertDialogDescription className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Manage{" "}
                        <span className="font-semibold text-[#0446DB] dark:text-blue-400">
                          {selectedBulkOrders?.length || 0}
                        </span>{" "}
                        selected orders.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    {/* Content */}
                    <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5">
                      
                      {/* Generate Labels */}
                      <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
                        <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
                          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                            Shipping Labels
                          </h3>

                          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                            Generate shipping labels for all currently selected orders.
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 p-4">
                          <div>
                            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                              Generate Labels
                            </p>

                            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                              {selectedBulkOrders?.length || 0} orders selected
                            </p>
                          </div>

                          <Button
                            onClick={async () => {
                              await generateShippingLabel();
                              setSelectedBulkOrders([]);
                            }}
                            className="h-9 cursor-pointer rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-[#0339b5]"
                          >
                            Generate Labels
                          </Button>
                        </div>
                      </div>


                      {/* Schedule Pickup - Only for Booked Orders */}
                        {selectedStatus === "booked" && (
                          <div className="overflow-hidden rounded-sm border border-emerald-200 dark:border-emerald-500/20">
                            <div className="border-b border-emerald-100 bg-emerald-50/70 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                Schedule Pickup
                              </h3>

                              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                Generate a pickup request for all selected booked orders.
                              </p>
                            </div>

                            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                  Schedule Selected Orders
                                </p>

                                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                  <span className="font-semibold text-[#0446DB] dark:text-blue-400">
                                    {selectedBulkOrders?.length || 0}
                                  </span>{" "}
                                  orders will be scheduled for pickup.
                                </p>
                              </div>

                              <Button
                                disabled={!selectedBulkOrders?.length}
                                onClick={async () => {
                                  if (!selectedBulkOrders?.length) {
                                    toast.warn("Please select at least one order");
                                    return;
                                  }

                                  const order_ids = [
                                    ...new Set(selectedBulkOrders.map((order) => order.id)),
                                  ];

                                  await generateBulkPickupRequest(order_ids);
                                }}
                                className="h-9 cursor-pointer rounded-sm bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Schedule Pickup
                              </Button>
                            </div>
                          </div>
                        )}

                      {/* Cancel Orders */}
                      {/* Cancel Orders */}
{["booked", "pending pickup"].includes(selectedStatus) && (
  <div className="overflow-hidden rounded-sm border border-red-200 dark:border-red-500/20">
    {/* Header */}
    <div className="border-b border-red-100 bg-red-50/70 px-4 py-3 dark:border-red-500/20 dark:bg-red-500/5">
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
        Cancel Orders
      </h3>

      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        Select a cancellation reason before cancelling the selected orders.
      </p>
    </div>

    <div className="space-y-4 p-4">
      {/* Remark */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
          Cancellation Reason
          <span className="ml-1 text-red-500">*</span>
        </label>

        <select
          value={remarks}
          onChange={(e) => setremarks(e.target.value)}
          className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
        >
          <option value="">Select cancellation reason</option>

          <option value="Seller Requested Future Pick up">
            Seller Requested Future Pick up
          </option>

          <option value="Awb rejected">
            AWB Rejected
          </option>

          <option value="Duplicate Pickup Request">
            Duplicate Pickup Request
          </option>

          <option value="Non Serviceable Location">
            Non Serviceable Location
          </option>

          <option value="Pick Failed Due to Dangerous Goods">
            Pick Failed Due to Dangerous Goods
          </option>

          <option value="Product packaging Issue">
            Product Packaging Issue
          </option>

          <option value="Shipment Handedover to other courier">
            Shipment Handedover to Other Courier
          </option>

          <option value="Seller Closed">
            Seller Closed
          </option>

          <option value="Pick up Request Expired">
            Pick up Request Expired
          </option>

          <option value="Entry not Permitted">
            Entry not Permitted
          </option>

          <option value="Customer wants refund/replacement first">
            Customer wants refund/replacement first
          </option>
        </select>
      </div>

      {/* Action */}
      <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Cancel Selected Orders
          </p>

          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            This will cancel{" "}
            <span className="font-semibold text-red-600 dark:text-red-400">
              {selectedBulkOrders?.length || 0}
            </span>{" "}
            selected orders.
          </p>
        </div>

        <Button
          variant="destructive"
          disabled={!remarks || loading}
          onClick={cancelOrderByMerchant}
          className="h-9 cursor-pointer rounded-sm px-5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Cancelling..." : "Cancel Orders"}
        </Button>
      </div>
    </div>
  </div>
)}

                      {/* Clear Selection */}
                      <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                            Clear Selection
                          </p>

                          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                            Remove all currently selected orders and reset bulk actions.
                          </p>
                        </div>

                        <Button
                          variant="outline"
                          onClick={() => setSelectedBulkOrders([])}
                          className="h-9 cursor-pointer rounded-sm border-red-200 bg-white px-4 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
                        >
                          Clear Selected
                        </Button>
                      </div>
                    </div>

                    {/* Footer */}
                    <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-950/30">
                      <AlertDialogCancel
                      onClick={()=>{
                        clearAllState()
                      }}
                      className="cursor-pointer rounded-sm">
                        Close
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
          </div>

          {/* Bulk Actions Section */}
          {/* {selectedBulkOrders?.length > 0 && (
            <div className=" bg-[#ffffff] dark:bg-neutral-800 px-5">
              <div className="flex lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                

                <div className="flex gap-2 sm:gap-3">
                  <Button
                    onClick={async () => {
                      await generateShippingLabel();
                      setSelectedBulkOrders([]);
                    }}
                    className="flex items-center gap-1 sm:gap-2 bg-[#0446DB]  hover:bg-indigo-700 text-white px-3 sm:px-4 lg:px-6  rounded-sm hover:shadow-lg transition-all duration-300 font-medium text-sm sm:text-base justify-center"
                  >
                   
                    Generate Labels
                  </Button>

                
                  {["booked", "pending pickup"].includes(selectedStatus) && (
                    <Button
                      className="flex items-center gap-1 sm:gap-2 bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-sm sm:rounded-sm shadow-md hover:shadow-lg transition-all duration-300 font-medium text-sm sm:text-base justify-center"
                      onClick={() => cancelOrderByMerchant()}
                    >
                      
                      Cancel Order
                    </Button>
                  )}

                  <Button
                    className="flex items-center gap-1 sm:gap-2 bg-gray-500 hover:bg-gray-600 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-sm hover:shadow-lg transition-all duration-300 font-medium text-sm sm:text-base justify-center"
                    onClick={() => setSelectedBulkOrders([])}
                  >
                    
                    Clear
                  </Button>
                </div>
              </div>

              
            </div>
          )} */}

          

          {/* Orders Table */}
          <div className=" overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className=" bg-[#FFFFFF] dark:bg-neutral-900">
                  <TableRow>
                    <TableHead className="px-3 lg:px-6 py-3 text-left">
                      {selectedStatus === "All" ? (
                        <></>
                      ) : (
                        <>
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            checked={
                              selectedBulkOrders?.length ===
                                orders?.data?.length && orders?.data?.length > 0
                            }
                            onChange={toggleSelectAll}
                          />
                        </>
                      )}
                    </TableHead>
                    <TableHead className="px-3 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Order Information
                    </TableHead>
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
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <>
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-10">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                          <p className="mt-2">Loading orders...</p>
                        </TableCell>
                      </TableRow>
                    </>
                  ) : orders?.data?.length == 0 ? (
                    <TableRow className="bg-indigo-50">
                      <TableCell colSpan={10} className="text-center py-10">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders?.data?.map((order, index) => {
                      const isSelected = selectedBulkOrders?.some(
                        (o) => o.id === order.id,
                      );
                      const isEligibleForCancel = canCancelOrder(order);
                      return selectedStatus === "All" ? (
                        <>
                          <TableRow
                            key={order.id}
                            className={` hover:bg-indigo-50 dark:hover:bg-neutral-700 dark:bg-neutral-900 transition-colors duration-200 ${isSelected ? "bg-indigo-50" : "bg-[#FFFFFF]"}`}
                          >
                            {/* Selection Checkbox */}
                            <TableCell className="px-3">-</TableCell>

                            {/* Order Information */}
                            <TableCell className="px-3 ">
                              <div className="space-y-0">
                                <div className="flex items-center gap-2">
                                  <a
                                    href={`${frontEndURL}/track-order?awb_number=${order.awb_number}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-[#0446DB] hover:text-indigo-800 hover:underline transition-colors duration-200 text-sm"
                                  >
                                    {order.awb_number}
                                  </a>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        order.awb_number,
                                      );
                                      setCopySuccess(order.awb_number);
                                      setTimeout(
                                        () => setCopySuccess(null),
                                        2000,
                                      );
                                      toast.success("AWB copied to clipboard");
                                    }}
                                    className="text-gray-400 hover:text-indigo-600 transition-colors duration-200 p-1 rounded"
                                  >
                                    {copySuccess === order.awb_number ? (
                                      <FaCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                                    ) : (
                                      <FaCopy className="w-3 h-3 sm:w-4 sm:h-4" />
                                    )}
                                  </button>

                                  <Dialog className="w-5xl">
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className="text-xs font-medium  text-red-600  inline-block cursor-pointer "
                                      >
                                        <span>
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
                                        <div className="bg-gray-50 rounded-sm sm:rounded-sm p-3 sm:p-4">
                                          <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                            <FaBox className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                                            Basic Information
                                          </h3>
                                          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                                            {[
                                              {
                                                label: "Order ID",
                                                value: order.merchant_order_id,
                                                copy: true,
                                              },
                                              {
                                                label: "AWB Number",
                                                value: order.awb_number,
                                                copy: true,
                                              },
                                              {
                                                label: "Order Type",
                                                value:
                                                  order.order_type === "cod"
                                                    ? "COD"
                                                    : "Prepaid",
                                              },
                                              {
                                                label: "Order Specific",
                                                value: order.order_specific,
                                              },
                                              {
                                                label: "Rider Preference",
                                                value:
                                                  order.rider_preference ===
                                                  "self"
                                                    ? "Self"
                                                    : "Daakit",
                                              },
                                              {
                                                label: "Order Status",
                                                value: toCapitalizeEachWord(
                                                  order.status,
                                                ),
                                              },
                                              {
                                                label: "Total Amount",
                                                value: `₹${Number(order.total_amount).toLocaleString()}`,
                                              },
                                              {
                                                label: "Order Weight",
                                                value: `${Number(order.total_weight).toLocaleString()}g`,
                                              },
                                              {
                                                label: "Number of Packets",
                                                value: order.number_of_boxes,
                                              },
                                            ].map((item, index) => (
                                              <div
                                                key={index}
                                                className="flex items-center justify-between"
                                              >
                                                <span className="text-xs sm:text-sm font-medium text-gray-600">
                                                  {item.label}:
                                                </span>
                                                <div className="flex items-center gap-1 sm:gap-2 max-w-[60%]">
                                                  <span className="text-xs sm:text-sm text-gray-800 truncate">
                                                    {item.value}
                                                  </span>
                                                  {item.copy && (
                                                    <button
                                                      onClick={() => {
                                                        navigator.clipboard.writeText(
                                                          item.value,
                                                        );
                                                        toast.success(
                                                          `${item.label} copied!`,
                                                        );
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
                                        <div className="bg-gray-50 rounded-sm sm:rounded-sm p-3 sm:p-4">
                                          <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                            <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                            Delivery Information
                                          </h3>
                                          <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                            {[
                                              {
                                                label: "Customer Name",
                                                value:
                                                  order.delivery_contact_name,
                                              },
                                              {
                                                label: "Contact Number",
                                                value: order.delivery_phone,
                                              },
                                              {
                                                label: "Address",
                                                value:
                                                  order.delivery_address_line,
                                              },
                                              {
                                                label: "City/State/Pincode",
                                                value: `${order.delivery_city}, ${order.delivery_state} - ${order.delivery_pincode}`,
                                              },
                                            ].map((item, index) => (
                                              <div key={index}>
                                                <span className="text-xs sm:text-sm font-medium text-gray-600">
                                                  {item.label}:
                                                </span>
                                                <p className="text-xs sm:text-sm text-gray-800 mt-1 break-words">
                                                  {item.value}
                                                </p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Pickup Information */}
                                        <div className="bg-gray-50 rounded-sm sm:rounded-sm p-3 sm:p-4">
                                          <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                            <FaShippingFast className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                            Pickup Information
                                          </h3>
                                          <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                            {[
                                              {
                                                label: "Pickup Name",
                                                value:
                                                  order.pickup_contact_name ||
                                                  "N/A",
                                              },
                                              {
                                                label: "Pickup Phone",
                                                value:
                                                  order.pickup_phone || "N/A",
                                              },
                                              {
                                                label: "Pickup Address",
                                                value:
                                                  order.pickup_address_line ||
                                                  "N/A",
                                              },
                                              {
                                                label: "Pickup Location",
                                                value: order.pickup_city
                                                  ? `${order.pickup_city}, ${order.pickup_state} - ${order.pickup_pincode}`
                                                  : "N/A",
                                              },
                                            ].map((item, index) => (
                                              <div key={index}>
                                                <span className="text-xs sm:text-sm font-medium text-gray-600">
                                                  {item.label}:
                                                </span>
                                                <p className="text-xs sm:text-sm text-gray-800 mt-1 break-words">
                                                  {item.value}
                                                </p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>

                                      <DialogFooter>
                                        <DialogClose asChild>
                                          <Button variant="outline">
                                            Cancel
                                          </Button>
                                        </DialogClose>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>

                                <p className="text-xs text-gray-500">
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
                                    },
                                  )}
                                </p>

                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                  <span>MID: {order.merchant_id}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    MOID:{" "}
                                    {order.merchant_order_id?.length <= 15
                                      ? order.merchant_order_id
                                      : `${order.merchant_order_id.slice(0, 15)}...`}
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          order.merchant_order_id,
                                        );
                                        setCopySuccess(order.merchant_order_id);
                                        setTimeout(
                                          () => setCopySuccess(null),
                                          2000,
                                        );
                                        toast.success(
                                          "Order ID copied to clipboard",
                                        );
                                      }}
                                      className="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                                    >
                                      {copySuccess ===
                                      order.merchant_order_id ? (
                                        <FaCheck className="w-3 h-3 text-green-500" />
                                      ) : (
                                        <FaCopy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </span>
                                </div>
                              </div>
                            </TableCell>

                            {/* Delivery Address */}
                            <TableCell className="px-3">
                              
                              <p className="font-medium text-gray-800 dark:text-white">
                                {order.delivery_contact_name}
                              </p>
                              <HoverCard>
                                <HoverCardTrigger>
                                  {order.delivery_address_line.slice(0, 30)}...
                                </HoverCardTrigger>
                                <HoverCardContent className="bg-[#0446DB] text-white">
                                  {order.delivery_address_line},{" "}
                                  {order.delivery_city}, {order.delivery_state}{" "}
                                  - {order.delivery_pincode}
                                </HoverCardContent>
                              </HoverCard>
                              <p className="text-xs text-gray-500 dark:text-white">
                                {order.delivery_city}, {order.delivery_state} -{" "}
                                {order.delivery_pincode}
                              </p>

                              <p className="text-xs text-gray-400">
                                {order.delivery_country}
                              </p>
                            </TableCell>

                            {/* Package Details */}
                            <TableCell className="px-3 ">
                              <div className="">
                                {selectedStatus !== "cancelled" && (
                                  <div className="flex whitespace-nowrap items-center gap-2 text-xs">
                                    <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                                    <span>
                                      EDD:{" "}
                                      {(() => {
                                        const raw = new Date(order.created_at);
                                        const prefix =
                                          order.order_specific?.slice(0, 3);

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
                                  <span>
                                    Weight:{" "}
                                    {Number(
                                      order.total_weight,
                                    ).toLocaleString()}
                                    g
                                  </span>
                                  {selectedStatus !== "cancelled" && (
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getOrderTypeColor(order.order_specific?.slice(0, 3))}`}
                                    >
                                      {order.order_specific?.slice(0, 3) ===
                                      "NDD"
                                        ? "NDD"
                                        : order.order_specific?.slice(0, 3) ===
                                            "SDD"
                                          ? "SDD"
                                          : order.order_specific?.slice(
                                                0,
                                                6,
                                              ) === "Turant"
                                            ? "Turant"
                                            : order.order_specific}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 text-xs">
                                  <FaRulerCombined className="w-3 h-3 text-gray-400" />
                                  <span>
                                    Dimensions: {order.package_length}x
                                    {order.package_breadth}x
                                    {order.package_height}
                                  </span>
                                </div>
                              </div>
                            </TableCell>

                            {/* Rider Preference */}
                            <TableCell className="px-3">
                              <div className="space-y-0">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${order.rider_preference === "self" ? "bg-green-100 text-green-800 border border-green-300" : "bg-blue-100 text-blue-800 border border-blue-300"}`}
                                >
                                  {order.rider_preference === "self"
                                    ? "Self"
                                    : "Daakit"}
                                </span>
                              </div>
                            </TableCell>

                            {/* Status */}
                            <TableCell className="px-6 py-4 text-center">
                              {order.status === "cancelled" ||
                              order.status === "undelivered" ||
                              order.status === "delivered" ||
                              order.status === "ndr" ||
                              order.status === "rto delivered" ? (
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${getStatusColor(order.status)} whitespace-nowrap`}
                                >
                                  {order.status === "rto delivered"
                                    ? "RTO Delivered"
                                    : order.status === "ndr"
                                      ? "NDR"
                                      : toCapitalizeEachWord(order.status)}
                                </span>
                              ) : (
                                <>
                                  {isEligibleForCancel ? (
                                    <>
                                      {editingStatusId === order.id ? (
                                        <></>
                                      ) : (
                                        <span
                                          className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${getStatusColor(order.status)} cursor-pointer whitespace-nowrap hover:opacity-80 transition-colors duration-200`}
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
                        </>
                      ) : (
                        <>
                          <TableRow
                            key={order.id}
                            className={`hover:bg-indigo-50 dark:hover:bg-neutral-700 dark:bg-neutral-900 transition-colors duration-200 ${isSelected ? "bg-indigo-50" : "bg-[#FFFFFF]"}`}
                          >
                            <TableCell className="px-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedBulkOrders((prev) => [
                                      ...prev,
                                      order,
                                    ]);
                                  } else {
                                    setSelectedBulkOrders((prev) =>
                                      prev?.filter((o) => o.id !== order.id),
                                    );
                                  }
                                }}
                                className="w-4 h-4 dark:border-3 dark:border-[#0446DB] text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                              />
                            </TableCell>

                            {/* Order Information */}
                            <TableCell className="px-3 ">
                              <div className="space-y-0">
                                <div className="flex items-center gap-2">
                                  <a
                                    href={`${frontEndURL}/track-order?awb_number=${order.awb_number}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-[#0446DB] hover:text-indigo-800 hover:underline transition-colors duration-200 text-sm"
                                  >
                                    {order.awb_number}
                                  </a>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        order.awb_number,
                                      );
                                      setCopySuccess(order.awb_number);
                                      setTimeout(
                                        () => setCopySuccess(null),
                                        2000,
                                      );
                                      toast.success("AWB copied to clipboard");
                                    }}
                                    className="text-gray-400 hover:text-indigo-600 transition-colors duration-200 p-1 rounded"
                                  >
                                    {copySuccess === order.awb_number ? (
                                      <FaCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                                    ) : (
                                      <FaCopy className="w-3 h-3 sm:w-4 sm:h-4" />
                                    )}
                                  </button>
                                  {/* <button
                                      onClick={() => setPopup(order)}
                                      className="text-gray-400 hover:text-indigo-600 transition-colors duration-200 p-1 rounded"
                                    >
                                      <TbFileInfo className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </button> */}
                                  <Dialog className="w-5xl">
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className="text-xs font-medium  text-red-600  inline-block cursor-pointer "
                                      >
                                        <span>
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
                                        <div className="bg-gray-50 rounded-sm sm:rounded-sm p-3 sm:p-4">
                                          <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                            <FaBox className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                                            Basic Information
                                          </h3>
                                          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                                            {[
                                              {
                                                label: "Order ID",
                                                value: order.merchant_order_id,
                                                copy: true,
                                              },
                                              {
                                                label: "AWB Number",
                                                value: order.awb_number,
                                                copy: true,
                                              },
                                              {
                                                label: "Order Type",
                                                value:
                                                  order.order_type === "cod"
                                                    ? "COD"
                                                    : "Prepaid",
                                              },
                                              {
                                                label: "Order Specific",
                                                value: order.order_specific,
                                              },
                                              {
                                                label: "Rider Preference",
                                                value:
                                                  order.rider_preference ===
                                                  "self"
                                                    ? "Self"
                                                    : "Daakit",
                                              },
                                              {
                                                label: "Order Status",
                                                value: toCapitalizeEachWord(
                                                  order.status,
                                                ),
                                              },
                                              {
                                                label: "Total Amount",
                                                value: `₹${Number(order.total_amount).toLocaleString()}`,
                                              },
                                              {
                                                label: "Order Weight",
                                                value: `${Number(order.total_weight).toLocaleString()}g`,
                                              },
                                              {
                                                label: "Number of Packets",
                                                value: order.number_of_boxes,
                                              },
                                            ].map((item, index) => (
                                              <div
                                                key={index}
                                                className="flex items-center justify-between"
                                              >
                                                <span className="text-xs sm:text-sm font-medium text-gray-600">
                                                  {item.label}:
                                                </span>
                                                <div className="flex items-center gap-1 sm:gap-2 max-w-[60%]">
                                                  <span className="text-xs sm:text-sm text-gray-800 truncate">
                                                    {item.value}
                                                  </span>
                                                  {item.copy && (
                                                    <button
                                                      onClick={() => {
                                                        navigator.clipboard.writeText(
                                                          item.value,
                                                        );
                                                        toast.success(
                                                          `${item.label} copied!`,
                                                        );
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
                                        <div className="bg-gray-50 rounded-sm sm:rounded-sm p-3 sm:p-4">
                                          <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                            <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                            Delivery Information
                                          </h3>
                                          <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                            {[
                                              {
                                                label: "Customer Name",
                                                value:
                                                  order.delivery_contact_name,
                                              },
                                              {
                                                label: "Contact Number",
                                                value: order.delivery_phone,
                                              },
                                              {
                                                label: "Address",
                                                value:
                                                  order.delivery_address_line,
                                              },
                                              {
                                                label: "City/State/Pincode",
                                                value: `${order.delivery_city}, ${order.delivery_state} - ${order.delivery_pincode}`,
                                              },
                                            ].map((item, index) => (
                                              <div key={index}>
                                                <span className="text-xs sm:text-sm font-medium text-gray-600">
                                                  {item.label}:
                                                </span>
                                                <p className="text-xs sm:text-sm text-gray-800 mt-1 break-words">
                                                  {item.value}
                                                </p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Pickup Information */}
                                        <div className="bg-gray-50 rounded-sm sm:rounded-sm p-3 sm:p-4">
                                          <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                            <FaShippingFast className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                            Pickup Information
                                          </h3>
                                          <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                            {[
                                              {
                                                label: "Pickup Name",
                                                value:
                                                  order.pickup_contact_name ||
                                                  "N/A",
                                              },
                                              {
                                                label: "Pickup Phone",
                                                value:
                                                  order.pickup_phone || "N/A",
                                              },
                                              {
                                                label: "Pickup Address",
                                                value:
                                                  order.pickup_address_line ||
                                                  "N/A",
                                              },
                                              {
                                                label: "Pickup Location",
                                                value: order.pickup_city
                                                  ? `${order.pickup_city}, ${order.pickup_state} - ${order.pickup_pincode}`
                                                  : "N/A",
                                              },
                                            ].map((item, index) => (
                                              <div key={index}>
                                                <span className="text-xs sm:text-sm font-medium text-gray-600">
                                                  {item.label}:
                                                </span>
                                                <p className="text-xs sm:text-sm text-gray-800 mt-1 break-words">
                                                  {item.value}
                                                </p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>

                                      <DialogFooter>
                                        <DialogClose asChild>
                                          <Button variant="outline">
                                            Cancel
                                          </Button>
                                        </DialogClose>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>

                                <p className="text-xs text-gray-500">
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
                                    },
                                  )}
                                </p>

                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                  <span>MID: {order.merchant_id}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    MOID:{" "}
                                    {order.merchant_order_id?.length <= 15
                                      ? order.merchant_order_id
                                      : `${order.merchant_order_id.slice(0, 15)}...`}
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          order.merchant_order_id,
                                        );
                                        setCopySuccess(order.merchant_order_id);
                                        setTimeout(
                                          () => setCopySuccess(null),
                                          2000,
                                        );
                                        toast.success(
                                          "Order ID copied to clipboard",
                                        );
                                      }}
                                      className="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                                    >
                                      {copySuccess ===
                                      order.merchant_order_id ? (
                                        <FaCheck className="w-3 h-3 text-green-500" />
                                      ) : (
                                        <FaCopy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </span>
                                </div>
                              </div>
                            </TableCell>

                            {/* Delivery Address */}
                            <TableCell className="px-3">
                              {/* <div className="space-y-1">
                                  <p className="font-medium whitespace-nowrap text-gray-800 flex items-center gap-1 text-sm">
                                    <FaMapMarkerAlt className="w-3 h-3 text-red-500" />
                                    {order.delivery_contact_name}
                                  </p>
                                  <p className="text-xs whitespace-nowrap text-gray-600">{order.delivery_address_line}</p>
                                  <p className="text-xs whitespace-nowrap text-gray-500">
                                    {order.delivery_city}, {order.delivery_state} - {order.delivery_pincode}
                                  </p>
                                  <p className="text-xs text-gray-400">{order.delivery_country}</p>
                                </div> */}
                              <p className="font-medium text-gray-800 dark:text-white">
                                {order.delivery_contact_name}
                              </p>
                              <HoverCard>
                                <HoverCardTrigger>
                                  {order.delivery_address_line.slice(0, 30)}...
                                </HoverCardTrigger>
                                <HoverCardContent className="bg-[#0446DB] text-white">
                                  {order.delivery_address_line},{" "}
                                  {order.delivery_city}, {order.delivery_state}{" "}
                                  - {order.delivery_pincode}
                                </HoverCardContent>
                              </HoverCard>
                              <p className="text-xs text-gray-500 dark:text-white">
                                {order.delivery_city}, {order.delivery_state} -{" "}
                                {order.delivery_pincode}
                              </p>

                              <p className="text-xs text-gray-400">
                                {order.delivery_country}
                              </p>
                            </TableCell>

                            {/* Package Details */}
                            <TableCell className="px-3 ">
                              <div className="">
                                {selectedStatus !== "cancelled" && (
                                  <div className="flex whitespace-nowrap items-center gap-2 text-xs">
                                    <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                                    <span>
                                      EDD:{" "}
                                      {(() => {
                                        const raw = new Date(order.created_at);
                                        const prefix =
                                          order.order_specific?.slice(0, 3);

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
                                  <span>
                                    Weight:{" "}
                                    {Number(
                                      order.total_weight,
                                    ).toLocaleString()}
                                    g
                                  </span>
                                  {selectedStatus !== "cancelled" && (
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getOrderTypeColor(order.order_specific?.slice(0, 3))}`}
                                    >
                                      {order.order_specific?.slice(0, 3) ===
                                      "NDD"
                                        ? "NDD"
                                        : order.order_specific?.slice(0, 3) ===
                                            "SDD"
                                          ? "SDD"
                                          : order.order_specific?.slice(
                                                0,
                                                6,
                                              ) === "Turant"
                                            ? "Turant"
                                            : order.order_specific}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 text-xs">
                                  <FaRulerCombined className="w-3 h-3 text-gray-400" />
                                  <span>
                                    Dimensions: {order.package_length}x
                                    {order.package_breadth}x
                                    {order.package_height}
                                  </span>
                                </div>
                              </div>
                            </TableCell>

                            {/* Rider Preference */}
                            <TableCell className="px-3">
                              <div className="space-y-0">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${order.rider_preference === "self" ? "bg-green-100 text-green-800 border border-green-300" : "bg-blue-100 text-blue-800 border border-blue-300"}`}
                                >
                                  {order.rider_preference === "self"
                                    ? "Self"
                                    : "Daakit"}
                                </span>
                              </div>
                            </TableCell>

                            {/* Status */}
                            <TableCell className="px-6 py-4 text-center">
                              {order.status === "cancelled" ||
                              order.status === "undelivered" ||
                              order.status === "delivered" ||
                              order.status === "ndr" ||
                              order.status === "rto delivered" ? (
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${getStatusColor(order.status)} whitespace-nowrap`}
                                >
                                  {order.status === "rto delivered"
                                    ? "RTO Delivered"
                                    : order.status === "ndr"
                                      ? "NDR"
                                      : toCapitalizeEachWord(order.status)}
                                </span>
                              ) : (
                                <>
                                  {isEligibleForCancel ? (
                                    <>
                                      {editingStatusId === order.id ? (
                                        <form
                                          onSubmit={async (e) => {
                                            e.preventDefault();
                                            const newStatus =
                                              e.target.elements.status.value;
                                            changeStatus(order.id, newStatus);
                                          }}
                                        >
                                          <div className="flex flex-col items-center gap-2">
                                            <input
                                              type="text"
                                              onChange={(e) =>
                                                setremarks(e.target.value)
                                              }
                                              placeholder="Enter cancellation reason"
                                              className="w-full px-2 py-1 rounded border border-gray-300 focus:border-[rgb(86,78,193)] focus:ring-2 focus:ring-[rgb(86,78,193)] focus:outline-none text-gray-700 placeholder-gray-400 text-xs"
                                            />
                                            <select
                                              name="status"
                                              defaultValue="cancelled"
                                              className="text-xs border border-gray-300 rounded-md px-2 py-1 w-full"
                                              required
                                              hidden
                                            >
                                              <option
                                                value="cancelled"
                                                selected
                                              >
                                                Cancelled
                                              </option>
                                            </select>
                                            <div className="flex gap-2 w-full justify-center">
                                              <button
                                                type="submit"
                                                className="bg-[#564ec1] w-[50% text-white text-xs px-2 py-1 rounded  whitespace-nowrap"
                                              >
                                                Cancel Order
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  setEditingStatusId(null)
                                                }
                                                className="text-xs w-[50%] bg-red-500 text-white px-1 rounded  hover:underline whitespace-nowrap"
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
                                          className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${getStatusColor(order.status)} cursor-pointer whitespace-nowrap hover:opacity-80 transition-colors duration-200`}
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
                        </>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            
              <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <p className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                    Page {page} of {orders?.pagination?.totalPages} •{" "}
                    {orders?.data?.length} total
                  </p>
                  <div className="flex items-center gap-2 justify-center">
                    <Button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-sm text-xs sm:text-sm font-medium transition-all duration-200 ${
                        page === 1
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
                      }`}
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() =>
                        setPage((prev) =>
                          Math.min(prev + 1, orders?.pagination?.totalPages),
                        )
                      }
                      disabled={page === orders?.pagination?.totalPages}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-sm text-xs sm:text-sm font-medium transition-all duration-200 ${
                        page === orders?.pagination?.totalPages
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
                      }`}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            
          </div>
        </main>
      </div>
      )
    }
    </>
  );
}

export default TechMerchantOrderDetails;
