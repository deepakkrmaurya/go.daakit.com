import "../../styles/blink.css";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Select from "react-select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import Loader from "../Loader";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { TbFileInfo } from "react-icons/tb";
import { FaFileExport, FaFilter, FaSearch, FaTasks } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { toast } from "react-toastify";
import { Link, Navigate, useNavigate, useNavigation } from "react-router-dom";
import { Loader2 } from "lucide-react";


const baseURL = import.meta.env.VITE_BASE_URL;
const frontEndURL = import.meta.env.VITE_FRONTEND_URL;


function UserOrderDetails() {
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
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
  const [canceledBulkOrder, setcanceledBulkOrder] = useState(false);
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
  const navigate = useNavigate()
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
  const [selectedLiveStatus, setSelectedLiveStatus] = useState("All");


  const [permissions, setPermissions] = useState(localStorage.getItem("permission"))
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
      setPermissions(res?.data?.data?.data)


    } catch (error) {
      toast.error('')
    }
  }

  const fetchOrders = async () => {
    setLoading(true);
    try {

      const res = await axios.get(`${baseURL}/api/user/getallorders`, {
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
    setAdvanceFilters({ ...advanceFilters, awbNumber: searchTerm });
    
    setFilterUpdate((prev) => !prev);
  };


  const fetchVendor = async (order_ids) => {
    if (!order_ids) {
      return;
    }

    try {
      const res = await axios.get(`${baseURL}/api/user/getEligibleVendorsByOrders?order_id=${order_ids}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      setVendor(res?.data?.data?.data || []);
      if (res?.data?.data?.data.length == 0) {
        setSelectedBulkOrders([]);
        setBulkOrderWeight(0);
        setFetchBulkAssignmentRider(false);
        setFetchBulkAssignmentVendor(false);
        setcanceledBulkOrder(false)
      }
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
        `${baseURL}/api/user/assignOrder`,
        { order_id: orderId, rider_id: riderId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchOrders();
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
        `${baseURL}/api/user/assignOrderToVendor`,
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

      await axios.post(
        `${baseURL}/api/user/assignOrderToVendor`,
        {
          order_id: orderIds,
          vendor_id: vendorId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

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
        `${baseURL}/api/user/cancelRiderAssignment/${id}`,
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
        `${baseURL}/api/user/cancelMappedWithUser/${id}`,
        {
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success('vendor Mapped Successfully.')
      fetchOrders();
      return
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error while canceling rider assignment: ");
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id, newStatus) => {

    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/api/user/updateOrderStatus/${id}`,
        { status: newStatus },
        
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchOrders();
      setEditingStatusId(null);
      toast.success(res?.data?.data?.message)
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedBulkOrders.length === orders.filter((o) => o.tpc_awb_number === null).length) {
      setSelectedBulkOrders([]);
      setBulkOrderWeight(0);
    } else {
      // setSelectedBulkOrders(orders);

      // const totalWeight = orders.reduce(
      //   (acc, order) => acc + Number(order.total_weight),
      //   0
      // );
      // setBulkOrderWeight(totalWeight);

      const ord = orders.filter(order => order.tpc_awb_number == null);
      setSelectedBulkOrders(ord);


      const totalWeight = orders
        .filter(order => order.tpc_awb_number == null)
        .reduce(
          (acc, order) => acc + Number(order.total_weight),
          0
        );
      setBulkOrderWeight(totalWeight);
    }
  };

  const exportCSV = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/user/exportOrders`, {
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





  const [selectedMapType, setSelectedMapType] = useState(null);
  // null | "mapped" | "unmapped"

  const getOrderMapType = (order) => {
    return order?.mapped_with === null || order?.mapped_with === undefined
      ? "unmapped"
      : "mapped";
  };

  const handleBulkOrderSelect = (order, isChecked) => {
    if (selectedStatus !== "picked") return;

    if (order?.pickup_stage !== "at_central_hub") {
      toast.error("Only orders at the Central Hub can be selected."); return;
    }

    const currentType = getOrderMapType(order);

    if (isChecked) {
      if (selectedMapType && selectedMapType !== currentType) {
        setSelectedBulkOrders([])
        setSelectedMapType(null)
        setBulkOrderWeight(0);
        return
        // toast.error("Please select either mapped orders or unmapped orders, not both."); return;
      }

      setSelectedBulkOrders((prev) => {
        const alreadyExists = prev.some((item) => item.id === order.id);

        if (alreadyExists) return prev;

        const updated = [...prev, order];
        const order_ids = updated.map((o) => o.id);

        setSelectedMapType(currentType);
        setBulkOrderWeight(
          (prevWeight) => Number(prevWeight) + Number(order.total_weight || 0)
        );

        fetchVendor(order_ids);

        return updated;
      });

      return;
    }

    setSelectedBulkOrders((prev) => {
      const updated = prev.filter((item) => item.id !== order.id);
      const order_ids = updated.map((o) => o.id);

      setBulkOrderWeight(
        (prevWeight) => Number(prevWeight) - Number(order.total_weight || 0)
      );

      if (updated.length === 0) {
        setSelectedMapType(null);
      } else {
        setSelectedMapType(getOrderMapType(updated[0]));
      }

      fetchVendor(order_ids);

      return updated;
    });
  };

















  useEffect(() => {
    resetAdvanceFilters();
    // getUserPermissions()
  }, []);


  useEffect(() => {

    fetchOrders();
    setSelectedBulkOrders([]);
    setBulkOrderWeight(0);
  }, [page, selectedStatus, filterUpdate, limit]);

  //I should do this on click
  useEffect(() => {
    const order_ids = [];
    selectedBulkOrders.forEach((element) => {
      order_ids.push(element.id);
    });

  }, [fetchBulkAssignmentRider]);

  useEffect(() => {
    setFetchBulkAssignmentRider(false);
  }, [selectedBulkOrders]);

  return (
    <>

      <div className="bg-gray-100  dark:bg-gray-900 min-h-screen w-full">

        <div className="sticky top-0 left-0  z-10 bg-[#0446DB] dark:border-b dark:border-[#0446DB] dark:bg-gray-900 py-4 md:py-6 shadow-md ">
          <div className="  mx-auto px-8  ">
            {/* Mobile Layout */}
            <div className="md:hidden  flex flex-col space-y-4">
              {/* Top Row: Heading and Buttons */}
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">Order Detailss</h1>

                <div className="flex items-center gap-2">
                  {
                    (permissions?.includes('VIEW_ASSN_CON') || permissions.includes('ADMIN_FULL_ACCESS')) && (

                      <Link to="/user/assignemt/console">
                        <Button
                          variant="outline"
                          className="bg-white w-full mt-1 text-[#0446DB] font-medium px-5 py-2.5 rounded-lg shadow hover:bg-indigo-100 hover:shadow-lg transition flex items-center gap-2"
                        >
                          <FaTasks className="text-sm" />
                          <span>Assignment Console</span>
                        </Button>
                      </Link>
                    )
                  }
                  {
                    (permissions?.includes('ODR_EXPORT') || permissions.includes('ADMIN_FULL_ACCESS')) && (

                      <Button variant="outline"
                        onClick={exportCSV}
                        className="bg-white text-[#0446DB] font-medium px-5 py-2.5 rounded-lg shadow hover:bg-indigo-100 hover:shadow-lg transition flex items-center gap-2"
                      >
                        <FaFilter className="text-sm" />
                        <span>Export</span>
                      </Button>
                    )
                  }

                  <Drawer direction="right"
                    open={isFilterOpen}
                    onOpenChange={setIsFilterOpen}
                  >
                    <DrawerTrigger asChild>
                      <Button variant="outline"
                        className="bg-white text-[#0446DB] font-medium px-5 py-2.5 rounded-lg shadow hover:bg-indigo-100 hover:shadow-lg transition flex items-center gap-2"
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
                      <div className="no-scrollbar overflow-y-auto px-4">

                        <form onSubmit={(e) => {
                          e.preventDefault()
                          setIsFilterOpen(false)
                        }}
                          className=" w-full"
                        >
                          <div className="gap-y-2 mb-2">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">


                              <div>
                                <label for="start-date-label" className="block text-xs text-gray-600 dark:text-gray-300 mb-1">
                                  Start Date
                                </label>
                                <input
                                  id="start-date-label"
                                  type="date"
                                  ref={startDateRef}
                                  value={advanceFilters.startDate}
                                  onClick={() => startDateRef.current?.showPicker?.()}
                                  onFocus={() => startDateRef.current?.showPicker?.()}
                                  onChange={(e) =>
                                    setAdvanceFilters((prev) => ({
                                      ...prev,
                                      startDate: e.target.value,
                                    }))
                                  }
                                  className="w-full border dark:border-gray-700 dark:bg-gray-800 
                                  dark:text-white px-3 py-2 rounded-lg text-sm 
                                  focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>

                              {/* End Date */}
                              <div>
                                <label for="end-date-label" className="block text-xs text-gray-600 dark:text-gray-300 mb-1">
                                  End Date
                                </label>
                                <input
                                  id="end-date-label"
                                  type="date"
                                  ref={endDateRef}
                                  value={advanceFilters.endDate}
                                  onClick={() => endDateRef.current?.showPicker?.()}
                                  onFocus={() => endDateRef.current?.showPicker?.()}
                                  onChange={(e) =>
                                    setAdvanceFilters((prev) => ({
                                      ...prev,
                                      endDate: e.target.value,
                                    }))
                                  }
                                  className="w-full border dark:border-gray-700 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-lg text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>

                            </div>


                            <div className=" mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                              <div>
                                <label className="block text-xs dark:text-white text-gray-600 mb-1">
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
                                  className="w-full border dark:border-gray-700 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-lg text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                  <option value="">All orders</option>
                                  <option value="Turant">Turant</option>
                                  <option value="SDD">Same Day Delivery</option>
                                  <option value="NDD">Next Day Delivery</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs dark:text-white text-gray-600 mb-1">
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
                                  className="w-full border dark:border-gray-700 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-lg text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>
                            </div>



                            <div className=" mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

                              <div>
                                <label className="block text-xs dark:text-white text-gray-600 mb-1">
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
                                  className="w-full border dark:border-gray-700 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-lg text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>


                              <div>
                                <label className="block text-xs dark:text-white text-gray-600 mb-1">
                                  City
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
                                  className="w-full border dark:border-gray-700 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-lg text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>
                            </div>


                            <div className=" mt-2 grid  grid-cols-1 md:grid-cols-2 gap-4 w-full">

                              <div>
                                <label className="block text-xs dark:text-white text-gray-600 mb-1">
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
                                  className="w-full border dark:border-gray-700 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-lg text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>


                              <div>
                                <label className="block text-xs dark:text-white text-gray-600 mb-1">
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
                                  className="w-full border dark:border-gray-700 dark:bg-gray-800 
                          dark:text-white px-3 py-2 rounded-lg text-sm 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>
                            </div>







                            <div className=" mt-2">
                              <label className="block text-xs dark:text-white text-gray-600 mb-1">
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
                                className="w-full border dark:border-gray-700 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-lg text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>

                          <div className=" w-full flex">
                            <button
                              // type="submit"
                              onClick={() => {
                                console.log('ff')
                                setFilterUpdate((prev) => !prev);
                                setIsFilterOpen(false);
                              }}
                              className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
                            >
                              Filter
                            </button>
                            <button
                              onClick={() => {

                                resetAdvanceFilters();
                                setFilterUpdate((prev) => !prev);
                                setIsFilterOpen(false);
                              }}
                              className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
                            >
                              Reset
                            </button>
                          </div>
                        </form>
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

              {/* Search Bar */}
              <div className="w-full">
                <form
                  className="flex w-full"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search AWB Number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow px-4 py-2 rounded-l-lg text-sm text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0446DB]"
                  />
                  <button
                    type="submit"
                    className="bg-white px-4 py-2 rounded-r-lg border border-l-0 border-gray-300 text-gray-600 hover:bg-indigo-100 hover:text-[#0446DB] transition"
                  >
                    <FaSearch />
                  </button>
                </form>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex  items-center justify-between h-full">
              {/* Left Side - Heading */}
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-white">Order Details</h1>

              </div>

              {/* Center - Search Bar */}
              <div className="flex-1 max-w-xl mx-8">
                <form
                  className="flex w-full"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search by AWB Number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow px-4 py-2.5 rounded-l-lg text-sm text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="bg-white px-5 py-2.5 rounded-r-lg border border-l-0 border-gray-300 text-gray-600 hover:bg-indigo-100 hover:text-[#0446DB] transition"
                  >
                    <FaSearch />
                  </button>
                </form>
              </div>

              {/* Right Side - Buttons */}
              <div className="flex items-center gap-4">
                {
                  (permissions?.includes('VIEW_ASSN_CON') || permissions.includes('ADMIN_FULL_ACCESS')) && (

                    <Link to="/user/assignemt/console">
                      <Button
                        variant="outline"
                        className="bg-white w-full mt-1 text-[#0446DB] font-medium px-5 py-2.5 rounded-lg shadow hover:bg-indigo-100 hover:shadow-lg transition flex items-center gap-2"
                      >
                        <FaTasks className="text-sm" />
                        <span>Assignment Console</span>
                      </Button>
                    </Link>
                  )
                }
                {
                  (permissions?.includes('ODR_EXPORT') || permissions.includes('ADMIN_FULL_ACCESS')) && (

                    <Button variant="outline"
                      onClick={exportCSV}
                      className="bg-white text-[#0446DB] font-medium px-5 py-2.5 rounded-lg shadow hover:bg-indigo-100 hover:shadow-lg transition flex items-center gap-2"
                    >
                      <FaFilter className="text-sm" />
                      <span>Export</span>
                    </Button>
                  )
                }

                <Drawer direction="right"
                  open={isFilterOpen}
                  onOpenChange={setIsFilterOpen}
                >
                  <DrawerTrigger asChild>
                    <Button variant="outline"
                      className="bg-white text-[#0446DB] font-medium px-5 py-2.5 rounded-lg shadow hover:bg-indigo-100 hover:shadow-lg transition flex items-center gap-2"
                    >
                      <FaFilter className="text-sm" />
                      <span>Filter</span>
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Filter</DrawerTitle>

                    </DrawerHeader>
                    <div className="no-scrollbar overflow-y-auto px-4">
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        setIsFilterOpen(false);
                      }}
                        className=" w-full"
                      >
                        <div className="gap-y-2 mb-2">

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">


                            <div>
                              <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">
                                Start Date
                              </label>
                              <input
                                type="date"
                                ref={startDateRef}
                                value={advanceFilters.startDate}
                                onClick={() => startDateRef.current?.showPicker?.()}
                                onFocus={() => startDateRef.current?.showPicker?.()}
                                onChange={(e) =>
                                  setAdvanceFilters((prev) => ({
                                    ...prev,
                                    startDate: e.target.value,
                                  }))
                                }
                                className="w-full border dark:border-gray-700 dark:bg-gray-800 
                                dark:text-white px-3 py-2 rounded-lg text-sm 
                                focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            {/* End Date */}
                            <div>
                              <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">
                                End Date
                              </label>
                              <input
                                type="date"
                                ref={endDateRef}
                                value={advanceFilters.endDate}
                                onClick={() => endDateRef.current?.showPicker?.()}
                                onFocus={() => endDateRef.current?.showPicker?.()}
                                onChange={(e) =>
                                  setAdvanceFilters((prev) => ({
                                    ...prev,
                                    endDate: e.target.value,
                                  }))
                                }
                                className="w-full border dark:border-gray-700 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-lg text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                          </div>


                          <div className=" mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <div>
                              <label className="block text-xs dark:text-white text-gray-600 mb-1">
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
                                className="w-full border dark:border-gray-700 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-lg text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              >
                                <option value="">All orders</option>
                                <option value="Turant">Turant</option>
                                <option value="SDD">Same Day Delivery</option>
                                <option value="NDD">Next Day Delivery</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs dark:text-white text-gray-600 mb-1">
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
                                className="w-full border dark:border-gray-700 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-lg text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>



                          <div className=" mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

                            <div>
                              <label className="block text-xs dark:text-white text-gray-600 mb-1">
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
                                className="w-full border dark:border-gray-700 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-lg text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>


                            <div>
                              <label className="block text-xs dark:text-white text-gray-600 mb-1">
                                City
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
                                className="w-full border dark:border-gray-700 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-lg text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>


                          <div className=" mt-2 grid  grid-cols-1 md:grid-cols-2 gap-4 w-full">

                            <div>
                              <label className="block text-xs dark:text-white text-gray-600 mb-1">
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
                                className="w-full border dark:border-gray-700 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-lg text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>


                            <div>
                              <label className="block text-xs dark:text-white text-gray-600 mb-1">
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
                                className="w-full border dark:border-gray-700 dark:bg-gray-800 
                          dark:text-white px-3 py-2 rounded-lg text-sm 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>







                          <div className=" mt-2">
                            <label className="block text-xs dark:text-white text-gray-600 mb-1">
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
                              className="w-full border dark:border-gray-700 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-lg text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>

                        <div className=" w-full flex">
                          <button
                            type="submit"
                            onClick={() => {
                              console.log('sxshfhsgf')
                              setFilterUpdate((prev) => !prev);
                              setIsFilterOpen(false);
                            }}
                            className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
                          >
                            Filter
                          </button>
                          <button
                            onClick={() => {
                              resetAdvanceFilters();
                              setFilterUpdate((prev) => !prev);
                              setIsFilterOpen(false);
                            }}
                            className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
                          >
                            Reset
                          </button>
                        </div>
                      </form>
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

        <div className="mx-0 z-10 md:px-1 -mt-4 md:-mt-0 bg-white dark:bg-gray-900 rounded-md">
          <div className="w-full  bg-white dark:border dark:border-[#0446DB] rounded shadow-2xl  dark:bg-gray-900   left-0 px-4 z-40   ">
            <div className="relative flex justify-center ">
              <div className=" flex  overflow-x-auto  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2">
                <div className="flex gap-2 min-w-max px-8 mt-3">
                  {status.map((st) => (
                    <Button
                      key={st}
                      onClick={() => {
                        setSelectedBulkOrders([]);
                        setSelectedStatus(st);
                        setPage(1);
                      }}

                      className={`px-5 py-2.5 rounded-full my-2 border transition-all duration-300 font-medium text-sm tracking-wide ${selectedStatus === st
                        ? "bg-[#0446DB] text-white shadow-lg shadow-purple-200 border-transparent"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]"
                        }`}
                    >
                      {st === "rto in transit"
                        ? "RTO In Transit"
                        : st === "rto delivered"
                          ? "RTO Delivered"
                          : toCapitalizeEachWord(st)}
                      {selectedStatus === st && ` (${totalOrders})`}
                    </Button>
                  ))}
                </div>
              </div>


            </div>
          </div>

          {/* Bulk Assignment */}
          {selectedBulkOrders.length > 0 && selectedStatus === "booked" && (

            <>
              <div className="mb-10 bg-white  rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-5">
                  Bulk Orders ({selectedBulkOrders.length} Selected)
                </h2>



                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">

                  <table className="min-w-full h-[30%] table-auto border border-gray-200 rounded-md overflow-hidden">
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


                  {!canceledBulkOrder ? (
                    (permissions.includes('UPDATE_STATUS') || permissions.includes('ADMIN_FULL_ACCESS')) && <button
                      onClick={() => {

                        setcanceledBulkOrder(true);
                        // const order_ids = [...new Set(selectedBulkOrders.map(o => o.id))];
                        //  fetchVendor(order_ids);

                      }}
                      className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                    >
                      Change Action
                    </button>
                  ) : (
                    <>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const newStatus =
                            e.target.elements.status.value;
                          if (!newStatus) {
                            toast.error('Please select status')
                            return
                          }
                          for (const order of selectedBulkOrders) {
                            const result = await changeStatus(
                              order.id,
                              newStatus
                            );
                          }
                        }}
                      >
                        <select
                          className="border border-gray-300 text-sm text-gray-700 px-4 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
                          name="status"

                        >

                          <option value="">
                            Select Status
                          </option>
                          <option value="cancelled">
                            Cancel Orders
                          </option>
                        </select>
                        <button
                          type="submit"
                          className="bg-[#0446DB] ml-2 hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                        >
                          Apply Action
                        </button>
                      </form>
                    </>
                  )}


                  {!fetchBulkAssignmentVendor ? (
                    (permissions.includes('VENDOR_VIEW') || permissions.includes('ADMIN_FULL_ACCESS')) && <button
                      onClick={() => {
                        setFetchBulkAssignmentVendor(true);
                        const order_ids = [...new Set(selectedBulkOrders.map(o => o.id))];
                        fetchVendor(order_ids);

                      }}
                      className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
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
                        {vendor?.map((vendor) => (
                          <option
                            key={vendor?.vendor_id}
                            value={vendor?.vendor_id}
                          >
                            {vendor?.vendor_id} :{" "}
                            {vendor?.vendor_name}

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
                              order.id,
                              assignmentState
                            );
                          }
                          setSelectedBulkOrders([]);
                          setBulkOrderWeight(0);
                          setFetchBulkAssignmentVendor(false);
                        }}
                        className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
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
                      setcanceledBulkOrder(false)
                    }}
                  >
                    Clear Selected Orders
                  </button>
                </div>



              </div>
            </>

          )}


          {selectedBulkOrders.length > 0 && selectedStatus === "picked" && (

            <>
              <div className="mb-10 bg-white  rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-5">
                  Bulk Orders ({selectedBulkOrders.length} Selected)
                </h2>



                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">

                  <table className="min-w-full h-[30%] table-auto border border-gray-200 rounded-md overflow-hidden">
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

                  </table>

                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  {selectedMapType === "mapped" && (
                    selectedBulkOrders.length > 0 ? (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();



                          await Promise.all(
                            selectedBulkOrders.map(order =>
                              cancelVendorAssignment(order.id)
                            )
                          );

                          setSelectedBulkOrders([]);
                          setSelectedMapType(null);
                        }}
                      >
                        <select
                          className="border border-gray-300 text-sm text-gray-700 px-4 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
                          name="status"
                        >
                          <option value="">Select Status</option>

                          <option value="Cancel Vendor Mapped">
                            Cancel Vendor Mapping
                          </option>
                        </select>

                        <button
                          type="submit"
                          className="bg-[#0446DB] ml-2 hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                        >
                          Apply Action
                        </button>
                      </form>
                    ) : (
                      <button
                        onClick={() => {
                          setcanceledBulkOrder(true);
                        }}
                        className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                      >
                        Change Action
                      </button>
                    )
                  )}
                  {selectedMapType === "unmapped" && (
                    <>
                      {selectedBulkOrders.length > 0 && !fetchBulkAssignmentVendor ? (
                        <button
                          onClick={() => {
                            setFetchBulkAssignmentVendor(true);

                            const order_ids = [
                              ...new Set(selectedBulkOrders.map((o) => o.id)),
                            ];

                            fetchVendor(order_ids);
                          }}
                          className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                        >
                          Get Available Vendor
                        </button>
                      ) : (
                        <>
                          {vendor?.length > 0 && (
                            <>
                              <select
                                className="border border-gray-300 text-sm text-gray-700 px-4 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
                                value={assignmentState}
                                onChange={(e) => setAssignmentState(e.target.value)}
                              >
                                <option value="">
                                  Select Vendor for Bulk Assignment
                                </option>

                                {vendor.map((vendorItem) => (
                                  <option
                                    key={vendorItem.vendor_id}
                                    value={vendorItem.vendor_id}
                                  >
                                    {vendorItem.vendor_id} : {vendorItem.vendor_name}
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
                                    await assignBulkOrderVendor(
                                      order.id,
                                      assignmentState
                                    );
                                  }

                                  setSelectedBulkOrders([]);
                                  setBulkOrderWeight(0);
                                  setFetchBulkAssignmentVendor(false);
                                  setSelectedMapType(null);
                                  setAssignmentState("");
                                }}
                                className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                              >
                                Bulk Assign
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}



                  <button
                    className="bg-red-500 hover:bg-red-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                    onClick={() => {
                      setSelectedBulkOrders([]);
                      setBulkOrderWeight(0);
                      setFetchBulkAssignmentRider(false);
                      setFetchBulkAssignmentVendor(false);
                      setcanceledBulkOrder(false)
                      setSelectedMapType(null)
                    }}
                  >
                    Clear Selected Orders
                  </button>
                </div>



              </div>
            </>

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
                  {
                    (
                      permissions.includes('UPDATE_STATUS') ||
                      permissions.includes('CANCEL_MAPPED')
                    ) && (
                      <>
                        <select
                          className="border border-gray-300 text-sm text-gray-700 px-4 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
                          value={bulkStatusState}
                          onChange={(e) => setBulkStatusState(e.target.value)}
                        >
                          <option value="">Select Status</option>
                          {
                            permissions.includes('UPDATE_STATUS') && (

                              <option value="Cancelled">Mark  Cancelled</option>
                            )
                          }
                          {
                            permissions.includes('CANCEL_MAPPED') && (

                              <option value="Cancel Vendor Mapped">
                                Cancel Vendor Mapping
                              </option>
                            )
                          }
                        </select>

                        <button
                          onClick={async () => {
                            if (!bulkStatusState) {
                              toast.warn("Select new status");
                              return;
                            }

                            if (bulkStatusState === "Cancel Assignment") {
                              await Promise.all(
                                selectedBulkOrders.map(order =>
                                  cancelRiderAssignment(order.id)
                                )
                              );
                            }
                            else if (bulkStatusState === "Cancel Vendor Mapped") {
                              await Promise.all(
                                selectedBulkOrders.map(order =>
                                  cancelVendorAssignment(order.id)
                                )
                              );
                            }
                            else {
                              await Promise.all(
                                selectedBulkOrders.map(order =>
                                  changeStatus(order.id, bulkStatusState)
                                )
                              );
                            }



                            setSelectedBulkOrders([]);
                            setBulkStatusState("");
                          }}
                          className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                        >
                          {bulkStatusState === 'Cancel Vendor Mapped' ? "Cancel Vendor Mapped" : "Change Action"}
                        </button>
                      </>

                    )
                  }

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


            {selectedBulkOrders.length > 0 &&
            selectedStatus === "rto in transit" && (
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
                  {
                    (
                      permissions.includes('UPDATE_STATUS') ||
                      permissions.includes('CANCEL_MAPPED')
                    ) && (
                      <>
                        <select
                          className="border border-gray-300 text-sm text-gray-700 px-4 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
                          value={bulkStatusState}
                          onChange={(e) => setBulkStatusState(e.target.value)}
                        >
                          <option value="">Select Status</option>
                          {
                            permissions.includes('UPDATE_STATUS') && (

                              <option value="rto delivered">Rto Delivered</option>
                            )
                          }
                          
                        </select>

                        <button
                          onClick={async () => {
                            if (!bulkStatusState) {
                              toast.warn("Select new status");
                              return;
                            }else{
                              await Promise.all(
                                selectedBulkOrders.map(order =>
                                  changeStatus(order.id, bulkStatusState)
                                )
                              );
                            }

                            
    
                            setSelectedBulkOrders([]);
                            setBulkStatusState("");
                          }}
                          className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                        >
                          {bulkStatusState === 'Cancel Vendor Mapped' ? "Cancel Vendor Mapped" : "Change Action"}
                        </button>
                      </>

                    )
                  }

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
          <div className="overflow-x-auto bg-white dark:bg-gray-900  shadow">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-600">
                <Loader2 className="h-8 w-8 animate-spin  mb-2" />
                <p className="text-sm font-medium">Loading...</p>
              </div>
            ) : (

              <div className="relative -mx-4 sm:-mx-6 lg:mx-0">

                <div className="w-full overflow-x-auto overscroll-x-contain">

                  <table className="min-w-[400px] lg:min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 dark:bg-gray-900 text-gray-600 text-sm font-semibold">
                      <tr>
                        {(selectedStatus === "booked" ||
                          selectedStatus === "pending pickup") ? (
                          <th className="px-6 py-4">
                            <div>
                              <span>
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                                  checked={
                                    selectedBulkOrders.length === orders.filter((o) => o.tpc_awb_number === null).length

                                  }
                                  onChange={toggleSelectAll}
                                />
                              </span>
                            </div>
                          </th>
                        ) : (
                          <>
                            <th className="px-6 py-4"></th>
                          </>
                        )}

                        <th className="text-center px-6 py-3">ORDER ID</th>

                        {(selectedStatus === "pending pickup" ||
                          selectedStatus === "out for delivery" ||
                          selectedStatus === "delivered" ||
                          selectedStatus === "picked" ||
                          selectedStatus === "in transit" ||
                          selectedStatus === "undelivered assigned") && (
                            <>
                              <th className="text-center whitespace-nowrap px-6 py-3">RIDER ID/VENDOR ID</th>

                            </>
                          )}

                        <th className="text-center whitespace-nowrap px-6 py-3">
                          CONSIGNEE ADDRESS
                        </th>
                        <th className="text-center whitespace-nowrap px-6 py-3">PACKAGE DETAILS</th>

                        <th className="text-center whitespace-nowrap px-6 py-3">ASSIGNMENT/RIDER</th>
                        <th className="text-center whitespace-nowrap px-6 py-3">MAPPED/VENDOR</th>
                        <th className="text-center whitespace-nowrap pl-6 py-3">STATUS</th>
                        {
                          selectedStatus === 'booked' && (

                            <th className="text-center whitespace-nowrap pl-6 py-3">ELIGIBLE VENDORS</th>
                          )
                        }
                      </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                      {loading ? (
                        <>
                          <div>
                            <div>
                              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                              <p className="mt-2">Loading orders...</p>
                            </div>
                          </div>
                        </>
                      ) : orders.length == 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="text-center px-6 py-6 text-gray-500"
                          >
                            No orders found.
                          </td>
                        </tr>
                      ) : (
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
                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b overflow-x-scroll">
                              {/* Select */}
                              {(selectedStatus === "booked" || selectedStatus === "rto in transit"  && (order.tpc_awb_number == null) || selectedStatus === "pending pickup" && order.tpc_awb_number == null) ? (
                                <td className="px-6 py-4 text-center">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;

                                      if (selectedStatus === "booked" || selectedStatus === "pending pickup" || selectedStatus == 'rto in transit' ) {
                                        if (isChecked) {
                                          setSelectedBulkOrders((prev) => {
                                            const updated = [...prev, order];

                                            const order_ids = updated.map((o) => o.id);
                                            
                                            if(selectedStatus !== 'rto in transit'){

                                              fetchVendor(order_ids);
                                            }


                                            return updated;
                                          });

                                          setBulkOrderWeight(
                                            (prev) => Number(prev) + Number(order.total_weight)
                                          );
                                        } else {
                                          setSelectedBulkOrders((prev) => {
                                            const updated = prev.filter((o) => o.id !== order.id);

                                            const order_ids = updated.map((o) => o.id);
                                            if(selectedStatus !== 'rto in transit'){
                                            fetchVendor(order_ids); 
                                            }

                                            return updated;
                                          });

                                          setBulkOrderWeight(
                                            (prev) => Number(prev) - Number(order.total_weight) // ✅ fixed bug
                                          );
                                        }
                                      }
                                    }}
                                    className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
                                  />

                                </td>
                              ) : selectedStatus === "picked" && order?.pickup_stage === "at_central_hub" ? (
                                <td className="px-6 py-4 text-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedBulkOrders.some((item) => item.id === order.id)}
                                    onChange={(e) => handleBulkOrderSelect(order, e.target.checked)}
                                    className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
                                  />
                                </td>
                              ) : (
                                <>
                                  <td className="px-6 py-4 text-center">
                                    -
                                  </td>
                                </>
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
                                    className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
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
                                    className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
                                  >
                                    <TbFileInfo />
                                  </button>
                                </p>
                                {order.tpc_awb_number && (
                                  <p>
                                    {order.tpc_awb_number}
                                    <button
                                      className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
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

                                <p className="text-s text-gray-500 dark:text-white">
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

                                <p className="text-s text-gray-400 dark:text-white">
                                  Merchant ID: {order.merchant_id}
                                </p>
                                <p className="text-s text-gray-400 dark:text-white">
                                  Merchant Order ID:{" "}
                                  {order.merchant_order_id?.length <= 20
                                    ? order.merchant_order_id
                                    : `${order.merchant_order_id.slice(
                                      0,
                                      20
                                    )}...`}
                                  <button
                                    className="pl-2 text-lg text-gray-600 dark:text-white hover:text-[#0446DB] transition"
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
                                  <span className="bg-[#0446DB] px-2 text-white rounded">{order.rider_preference === 'daakit' ? "Daakit" : "Self"}</span>
                                </p>
                              </td>

                              {(selectedStatus === "pending pickup" ||
                                selectedStatus === "out for delivery" ||
                                selectedStatus === "delivered" ||
                                selectedStatus === "picked" ||
                                selectedStatus === "in transit" ||
                                selectedStatus === "undelivered assigned") && (
                                  <>

                                    <td className="text-center ">
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

                                      {
                                        selectedStatus === "picked" && (
                                          <p>
                                            {order.pickup_stage === "at_central_hub"
                                              ? "At Central Hub"
                                              : "At Vendor Hub"}
                                          </p>
                                        )
                                      }

                                    </td>

                                  </>
                                )}


                              {/* Address */}
                              <td className="px-6 py-1 whitespace-pre-line">
                                <p className="font-medium text-gray-800 dark:text-white">
                                  {order.delivery_contact_name}
                                </p>
                                <HoverCard>
                                  <HoverCardTrigger>{order.delivery_address_line.slice(0, 30)}...</HoverCardTrigger>
                                  <HoverCardContent
                                    className='bg-[#0446DB] text-white'
                                  >
                                    {order.delivery_address_line} {order.delivery_city}, {order.delivery_state} -{" "}
                                    {order.delivery_pincode}
                                  </HoverCardContent>
                                </HoverCard>
                                <p className="text-xs text-gray-500 dark:text-white">
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
                                    <span className=" whitespace-nowrap dark:text-white">
                                      EDD:{" "}
                                      {/* {(() => {
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
                                        })()} */}
                                      {order.EDD}
                                    </span>
                                  )}
                                </p>

                                <p>
                                  <span className="font-medium text-gray-800 dark:text-white">
                                    Weight:
                                  </span>{" "}
                                  <span className="dark:text-white">{Number(order.total_weight).toLocaleString()}g</span>
                                  {selectedStatus !== "cancelled" && (
                                    <span
                                      className={`ml-2 px-2 py-0.5  rounded-full text-sm font-semibold shadow-sm ${order.order_specific?.slice(0, 3) ===
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
                                  <span className="font-medium dark:text-white text-gray-800">
                                    Dimensions:
                                  </span>{" "}
                                  <span className=" dark:text-white">
                                    {order.package_length}x{order.package_breadth}x
                                    {order.package_height}
                                  </span>
                                </p>
                              </td>

                              {/* Assignment */}
                              {
                                selectedStatus === "All" ? (
                                  <>
                                    <td className="px-6 py-4 text-center">
                                      {
                                        order.status === "booked" ||
                                          order.status === "undelivered" ? (
                                          <>
                                            {!(
                                              isOpenIndividualAssignmnet === order.id

                                            ) ? (
                                              <span

                                                className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer"
                                              >
                                                Not Assigned
                                              </span>
                                            ) : (
                                              <></>
                                            )}
                                          </>
                                        ) : order.status === "pending pickup" ||
                                          order.status === "in transit" ||
                                          order.status === "picked" ||
                                          order.status === "out for delivery" ||
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
                                              ) : order.rider_id == null ? (
                                                <>
                                                  <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                                    Not Mapped
                                                  </span>
                                                </>
                                              ) : (
                                                <span

                                                  className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 mb-2 inline-block cursor-pointer"
                                                >
                                                  Assigned
                                                </span>
                                              )
                                            ) : (
                                              <>
                                              </>
                                            )}
                                          </>
                                        ) : order.status === "cancelled" ? (
                                          <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
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
                                ) : (
                                  <>
                                    <td className="px-6 py-4 text-center">
                                      {order.status === "booked" ||
                                        order.status === "undelivered" ? (
                                        <>

                                          <span
                                            onClick={() => {

                                              // alert(order.status==="undelivered" && order.mapped_with !== null)
                                              if (order.status === "undelivered" && order.mapped_with !== null) {
                                                return
                                              }
                                              if (order.tpc_awb_number !== null) {
                                                return
                                              }

                                            }}
                                            className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer"
                                          >
                                            Not Assigned
                                          </span>

                                        </>
                                      ) : order.status === "picked" && order.rider_id == null ? (
                                        <>
                                          <span

                                            className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer"
                                          >
                                            Not Assigned
                                          </span>
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
                                                  if (order.tpc_awb_number !== null) {
                                                    return
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
                                                className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                              >
                                                Cancel Rider Assignment
                                              </button>
                                              <button
                                                type="button"
                                                className="text-xs  text-gray-500 hover:underline"
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
                                      {order.mapped_with === null ? (
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
                                      ) : (order.mapped_with !== null) ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                          Mapped
                                        </span>
                                      ) : (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                          Mapped
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
                                                if (
                                                  !permissions.includes('ASGN_ODR_TO_VENDOR') &&
                                                  !permissions.includes('ADMIN_FULL_ACCESS')
                                                ) {
                                                  return;
                                                }
                                                if (order.tpc_awb_number !== null) {
                                                  return
                                                }
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
                                                {

                                                  vendor.length > 0 && (
                                                    vendor.map((vendor) => (
                                                      <option
                                                        key={vendor.vendor_id}
                                                        value={vendor.vendor_id}
                                                      >
                                                        {vendor.vendor_id} :{" "}
                                                        {vendor.vendor_name}

                                                      </option>
                                                    ))
                                                  )
                                                }
                                              </select>
                                              <button
                                                type="submit"
                                                className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
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

                                                  if (
                                                    !permissions.includes('CANCEL_MAPPED') &&
                                                    !permissions.includes('ADMIN_FULL_ACCESS')
                                                  ) {
                                                    return;
                                                  }

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
                                                className="bg-[#0446DB] whitespace-nowrap text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                              >
                                                Cancel Vendor Assignment
                                              </button>
                                              <button
                                                type="button"
                                                className="text-xs bg-red-500/20 px-2 py-1 rounded text-red-500 text-gray-500 hover:underline"
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
                                      ) : order.status === "picked" && order?.mapped_with === null ? (
                                        <>
                                          <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                            Not Mapped
                                          </span>
                                        </>
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
                                                    className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
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

                                                  

                                                  if (!permissions.includes('UPDATE_STATUS') && !permissions.includes('ADMIN_FULL_ACCESS')) {
                                                    
                                                    return
                                                  }


                                                  if (order.status === 'pending pickup' && order.tpc_awb_number !== null) {
                                                    return
                                                  }
                                                  if (order.tpc_awb_number !== null) {
                                                    return
                                                  }
                                                  if(order.status === 'rto in transit'){
                                                    setEditingStatusId(order.id)
                                                    return
                                                  }
                                                  
                                                  if (order.rider_preference === 'daakit') {
                                                    if (order.mapped_with !== null) {
                                                      return
                                                    } else if (order.status === 'booked') {
                                                      setEditingStatusId(order.id)
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
                              {/* eligible_vendors */}
                              {
                                selectedStatus === 'booked' && (
                                  <td className="px-6 py-1 whitespace-pre-line">
                                    {/* <p className="font-medium bg-orange-500 text-[#e4e6ee] text-center px-3 whitespace-nowrap py-1 rounded-full   dark:text-white">
                                         { order?.tpc_awb_number !== null ? "-" : order?.eligible_vendors?.split(",").join(" | ")}
                                      </p> */}
                                    {
                                      order?.tpc_awb_number !== null ? (
                                        <>
                                          <p className="font-medium   text-center px-3 whitespace-nowrap py-1 rounded-full ">
                                            -
                                          </p>
                                        </>
                                      ) : (
                                        <>
                                          <p className="font-medium bg-orange-100 text-orange-700 text-center px-3 whitespace-nowrap py-1 rounded-full dark:bg-orange-900 dark:text-orange-200">
                                            {order?.tpc_awb_number !== null
                                              ? "-"
                                              : order?.eligible_vendors?.split(",").join(" | ")}
                                          </p>
                                        </>)
                                    }



                                  </td>
                                )
                              }

                            </tr>
                          );
                        }
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            )}
          </div>


          <div className=" py-3 flex justify-end gap-4 mx-10">

            {/* Pagination Buttons */}
            <div className="flex gap-2">

              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-md text-sm font-medium ${page === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#0446DB] text-white hover:bg-indigo-800"
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
                  : "bg-[#0446DB] text-white hover:bg-indigo-800"
                  }`}
              >
                Next
              </button>
            </div>

            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Per Page
              </label>

              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value)); // ✅ convert to number
                  setPage(1); // ✅ reset page when limit changes
                }}
                className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>


          </div>

        </div>

        {popup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(46,46,46,0.5)]">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden">
              {/* Modal Header */}
              <div className="bg-[#0446DB]  pt-4">
                <h2 className="text-xl font-semibold text-white text-center mb-4">
                  Order Details
                </h2>

                <div className="bg-white p-6  space-y-3 text-gray-700">
                  {/* Basic Info */}
                  <h3 className="font-semibold text-[#0446DB] mb-2">
                    Basic Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>Order ID:</strong> {popup.merchant_order_id}
                      <button
                        className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
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
                        className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
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
                    <h3 className="font-semibold text-[#0446DB] mb-2">
                      Delivery Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong>Customer Name:</strong>{" "}
                        {popup.delivery_contact_name}
                      </div>
                      {/* <div>
                          <strong>Customer Contact No:</strong>{" "}
                          {popup.delivery_phone}
                        </div> */}
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
                    <h3 className="font-semibold text-[#0446DB] mb-2">
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
                      onClick={() => {
                        navigate(`/admin/order-history?awb=${popup?.awb_number}`);
                      }}
                      className="bg-green-500 mr-2 text-white px-4 py-2 rounded hover:bg-indigo-800 transition"
                    >
                      Get History
                    </button>
                    <button
                      onClick={() => setPopup(null)}
                      className="bg-[#0446DB] text-white px-4 py-2 rounded hover:bg-indigo-800 transition"
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

    </>
  );
}
export default UserOrderDetails;
