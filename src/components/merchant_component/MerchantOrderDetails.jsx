import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Loader from "../Loader";
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
import { CirclePlus, Layers3, Loader2 } from "lucide-react";

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

  const cancelOrderByMerchant = async () => {
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
        { order_ids },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
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

  const canCancelOrder = (order) => {
    return order.status === "booked" || order.status === "pending pickup";
  };

  useEffect(() => {
    fetchOrders();
    setSelectedBulkOrders([]);
    // resetAdvanceFilters();
  }, [page, selectedStatus, filterUpdate]);
  // filterUpdate
  return (
    <>
      <div className="min-h-screen bg-[#EEEEEE]">
        {/* Header Section */}
        <header className="bg-[#0446DB] shadow-lg">
          <div className=" mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 sm:space-y-4 lg:space-y-0">
              <div className="text-center lg:text-left">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  Order Management
                </h1>
                <p className="text-indigo-100 mt-1 sm:mt-2 text-sm sm:text-base">
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
                      className="bg-white w-auto  mt-1 text-[#0446DB] font-medium px-5 py-2.5 rounded-lg shadow hover:bg-indigo-100 hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
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
                                className="w-full cursor-pointer border border-gray-300 bg-white px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
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
                                className="w-full cursor-pointer border border-gray-300 bg-white px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
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
                              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
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
                              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
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
                              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
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
                              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col xs:flex-row gap-3 mt-6 pt-4 border-t border-gray-200">
                          <Button
                            type="submit"
                            onClick={applyFilters}
                            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-md text-sm sm:text-base"
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
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
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
                      className="w-full cursor-pointer border border-gray-300 bg-white px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
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
                      className="w-full cursor-pointer border border-gray-300 bg-white px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
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
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
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
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
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
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
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
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col xs:flex-row gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  onClick={applyFilters}
                  className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-md text-sm sm:text-base"
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
                  className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium shadow-md text-sm sm:text-base"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Main Content */}
        <main className=" mx-auto   -mt-2  lg:-mt-4 relative z-10">
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
                    <button
                      key={st}
                      onClick={() => {
                        setSelectedBulkOrders([]);
                        setSelectedStatus(st);
                        setPage(1);
                      }}
                      className={`px-5 py-2.5 rounded-full my-2 border transition-all duration-300 font-medium text-sm tracking-wide ${
                        selectedStatus === st
                          ? "bg-[#0446DB] text-white  border-transparent"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]"
                      }`}
                    >
                      {st === "ndr" ? "NDR" : toCapitalizeEachWord(st)}
                      {selectedStatus === st && (
                        <span className="bg-white bg-opacity-20 text-gray-800 px-1 sm:px-2 py-0.5 rounded-full text-xs">
                          {total > 99 ? "99+" : total}
                        </span>
                      )}
                    </button>
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

                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={async () => {
                      await generateShippingLabel();
                      setSelectedBulkOrders([]);
                    }}
                    className="flex items-center gap-1 sm:gap-2 bg-[#0446DB]  hover:bg-indigo-700 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium text-sm sm:text-base justify-center"
                  >
                    <FaShippingFast className="w-3 h-3 sm:w-4 sm:h-4" />
                    Generate Labels
                  </button>

                  {/* Cancel Order Button - Only for booked/pending pickup status */}
                  {["booked", "pending pickup"].includes(selectedStatus) && (
                    <button
                      className="flex items-center gap-1 sm:gap-2 bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium text-sm sm:text-base justify-center"
                      onClick={() => cancelOrderByMerchant()}
                    >
                      <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                      Cancel Order
                    </button>
                  )}

                  <button
                    className="flex items-center gap-1 sm:gap-2 bg-gray-500 hover:bg-gray-600 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium text-sm sm:text-base justify-center"
                    onClick={() => setSelectedBulkOrders([])}
                  >
                    <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                    Clear
                  </button>
                </div>
              </div>

              {/* Selected Orders Preview */}
              <div className="mt-3 sm:mt-4 bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-h-32 sm:max-h-40 overflow-y-auto">
                  {selectedBulkOrders?.map((order) => (
                    <div
                      key={order?.id}
                      className="flex items-center justify-between p-2 sm:p-3 bg-gray-100 rounded-lg"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-800 text-sm truncate">
                          {order.merchant_order_id}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {order.awb_number}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          <span
                            className={`px-1 py-0.5 rounded ${order.rider_preference === "self" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                          >
                            {order?.rider_preference === "self"
                              ? "Self"
                              : "Daakit"}
                          </span>
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${getStatusColor(order.status)}`}
                      >
                        {toCapitalizeEachWord(order.status)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders Table */}
          <div className=" shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
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
                    <TableRow>
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
                            className={`hover:bg-gray-50 transition-colors duration-200 ${isSelected ? "bg-indigo-50" : ""}`}
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
                                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
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
                                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
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
                                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
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
                                  <div className="relative inline-block group dark:text-white">
                                    <span className="cursor-pointer whitespace-nowrap dark:text-white text-gray-800 font-medium">
                                      {order.delivery_address_line.slice(0, 30)}....
                                    </span>
                                    

                                    <div
                                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3
                                          hidden group-hover:block">
                                      <div className="bg-[rgb(85,77,192)] text-white dark:text-white text-xs w-48 px-3 py-1 rounded shadow-lg ">
                                        {order.delivery_address_line}
                                      </div>

                                      
                                      <div className="w-2 h-2 bg-[rgb(85,77,192)] rotate-45 mx-auto -mt-1"></div>
                                    </div>
                                  </div>


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
                            className={`hover:bg-gray-50 transition-colors duration-200 ${isSelected ? "bg-indigo-50" : ""}`}
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
                                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
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
                                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
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
                                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
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
                                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
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
            {orders?.data?.length > 0 && (
              <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <p className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                    Page {page} of {orders?.pagination?.totalPages} •{" "}
                    {orders?.data?.length} total
                  </p>
                  <div className="flex items-center gap-2 justify-center">
                    <button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                        page === 1
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setPage((prev) =>
                          Math.min(prev + 1, orders?.pagination?.totalPages),
                        )
                      }
                      disabled={page === orders?.pagination?.totalPages}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                        page === orders?.pagination?.totalPages
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
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
