import "../../styles/blink.css";

import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import Loader from "../Loader";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerContent,

  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TbFileInfo } from "react-icons/tb";
import { FaArrowRight, FaFileExport, FaFilter, FaSearch, FaTasks } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { toast } from "react-toastify";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
const baseURL = import.meta.env.VITE_BASE_URL;
const frontEndURL = import.meta.env.VITE_FRONTEND_URL;

const options = [
  { value: "Bangalore", label: "Bangalore" },
  { value: "Delhi", label: "Delhi" },
  { value: "Gurugram", label: "Gurugram" },
  { value: "Noida", label: "Noida" },
];

function OrderDetails() {
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
  const [isMappedOrder, setIsMappedOrder] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [assignmentState, setAssignmentState] = useState("");
  const [riderID, setRiderID] = useState("");
  const [isOpenIndividualAssignmnet, setIsOpenIndividualAssignmnet] = useState("");
  const [isOpenIndividualVendorAssignmnet, setIsOpenIndividualVendorAssignmnet] = useState("");
  const [isOpenIndividualAssignmnetMap, setIsOpenIndividualAssignmnetMap] = useState("");
  const [isOpenIndividualVendorMap, setIsOpenIndividualVendorMap] = useState("");

  const [bulkStatusState, setBulkStatusState] = useState("");
  const [selectedBulkOrders, setSelectedBulkOrders] = useState([]);

  const [fetchBulkAssignmentRider, setFetchBulkAssignmentRider] = useState(false);
  const [fetchBulkAssignmentVendor, setFetchBulkAssignmentVendor] = useState(false);
  const [canceledBulkOrder, setcanceledBulkOrder] = useState(false);
  const [bulkOrderWeight, setBulkOrderWeight] = useState(0);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileFilterDrawerOpen, setIsMobileFilterDrawerOpen] = useState(false);
  const [isDesktopFilterDrawerOpen, setIsDesktopFilterDrawerOpen] = useState(false);
  const [openOfd, setopenOfd] = useState([])
  const [openDelivered, setopenDeliverde] = useState([])
  const [remarks, setRemarks] = useState('')
  const [sub_remarks, setSub_remarks] = useState('')
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [detailed_remarks, setdetailed_remarks] = useState('')
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


  const [editingDeliveryId, setEditingDeliveryId] = useState(null);
  const [editingPickupId, setEditingPickupId] = useState(null);
  const [deliveryFormData, setDeliveryFormData] = useState({
    delivery_contact_name: '',
    delivery_address_line: '',
    delivery_city: '',
    delivery_state: '',
    delivery_pincode: '',
  });
  const [pickupFormData, setPickupFormData] = useState({
    pickup_contact_name: '' || "",
    pickup_phone: "",
    pickup_address_line: "",
    pickup_city: "",
    pickup_state: "",
    pickup_pincode: "",
  });

  const [checkVendorMapping, setCheckVendorMapping] = useState(null);
  const [filterUpdate, setFilterUpdate] = useState(false);
  const navigate = useNavigate()

  const clearAllState = () => {
    setSelectedBulkOrders([]);
    setBulkOrderWeight(0);
    setFetchBulkAssignmentVendor(false);
    setSelectedMapType(null);
    setEditingStatusId(null);
    setAssignmentState("");
    setLoading(false);
    setRiders([]);
    setopenOfd([]);
    setopenDeliverde([]);
    setRescheduleDate('');
    setRemarks('');
    setSub_remarks('');
    setdetailed_remarks('');
    setFetchBulkAssignmentRider(false);
    setcanceledBulkOrder(false);
    setIsOpenIndividualAssignmnet("");
    setIsOpenIndividualVendorAssignmnet("");
    setIsOpenIndividualAssignmnetMap("");
    setIsOpenIndividualVendorMap("");
    setVendor([]); // Clear vendors
    setCheckVendorMapping(null); // Reset vendor mapping check
    setBulkStatusState(""); // Clear bulk status
    setEditingDeliveryId(null); // Clear delivery editing state
    setEditingPickupId(null); // Clear pickup editing state
    // Reset form data if needed
    setDeliveryFormData({
      delivery_contact_name: '',
      delivery_address_line: '',
      delivery_city: '',
      delivery_state: '',
      delivery_pincode: '',
    });
    setPickupFormData({
      pickup_contact_name: '' || "",
      pickup_phone: "",
      pickup_address_line: "",
      pickup_city: "",
      pickup_state: "",
      pickup_pincode: "",
    });
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

      if (field === "startDate" && next.endDate && value && next.endDate < value) {
        next.endDate = value;
      }

      if (field === "endDate" && next.startDate && value && next.startDate > value) {
        next.startDate = value;
      }

      return next;
    });
  };

  const closeFilterDrawers = () => {
    setIsFilterOpen(false);
    setIsMobileFilterDrawerOpen(false);
    setIsDesktopFilterDrawerOpen(false);
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
    closeFilterDrawers();
    return true;
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
      vendor_id: "",
      pincode: "",
      rider_id: "",
      order_specific: "",
      merchant_id: "",
    });
  };

  const resetFilters = () => {
    resetAdvanceFilters();
    setPage(1);
    setFilterUpdate((prev) => !prev);
    closeFilterDrawers();
    clearAllState()
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

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // setSelectedLiveStatus(selectedStatus)
      // console.log(selectedStatus)
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

  const handleUpdateDeliveryDetails = async (data) => {
    try {



      const res = await axios.post(
        `${baseURL}/api/admin/updateOrderDetails`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Delivery details updated successfully");
      fetchOrders();
      setEditingDeliveryId(null);
      setEditingPickupId(null)
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update delivery details");
    }
  };

 







  const handleSearch = () => {
    const value = searchTerm.trim().toUpperCase();

    setPage(1);

    setAdvanceFilters((prev) => {
      if (!value) {
        return {
          ...prev,
          awbNumber: "",
          order_id: "",
        };
      }

      if (
        value.startsWith("DKTGO") ||
        value.startsWith("HL") ||
        value.startsWith("DKT") ||
        value.startsWith("PU")
      ) {
        return {
          ...prev,
          awbNumber: value,
          order_id: "",
        };
      }

      return {
        ...prev,
        order_id: value,
        awbNumber: "",
      };
    });

    setFilterUpdate((prev) => !prev);
  };


  const fetchEligibleVendir = async () => {
    try {


      const order_ids = [...new Set(selectedBulkOrders.map(o => o.id))];

      const res = await axios.get(`${baseURL}/api/admin/getEligibleVendorsByOrders?order_id=${order_ids}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });


      setVendor(res.data.data || []);
      if (res.data.data.length == 0) {
        setSelectedBulkOrders([]);
        setBulkOrderWeight(0);
        setFetchBulkAssignmentRider(false);
        setFetchBulkAssignmentVendor(false);
        setcanceledBulkOrder(false)
        clearAllState()
      }
    } catch (err) {

    } finally {
      setLoading(false);
    }
  }


  const fetchVendor = async (order_ids) => {


    if (order_ids.length === 0) {
      return;
    }

    try {
      const res = await axios.get(`${baseURL}/api/admin/getEligibleVendorsByOrders?order_id=${order_ids}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });


      setVendor(res.data.data || []);
      if (res.data.data.length == 0) {
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
  const fetchRider = async (vendor_ids) => {

    if (!vendor_ids || vendor_ids.length === 0) {
      return;
    }

    // Check if all vendor IDs are the same
    const allSame = vendor_ids.every(id => id === vendor_ids[0]);

    if (!allSame) {
      toast.error("Selected orders must belong to the same vendor");
      setSelectedBulkOrders([]);
      setBulkOrderWeight(0);
      return;
    }

    const vendor_id = vendor_ids[0];


    try {
      const res = await axios.get(`${baseURL}/api/admin/getRidersByVendorId?vendor_id=${vendor_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });



      setRiders(res.data.data || []);
      // if (res.data.data.length == 0) {
      //   setSelectedBulkOrders([]);
      //   setBulkOrderWeight(0);
      //   setFetchBulkAssignmentRider(false);
      //   setFetchBulkAssignmentVendor(false);
      //   setcanceledBulkOrder(false)
      // }
    } catch (err) {


      toast.error(err.response?.data?.message || err.message || "Failed to load riders");
    } finally {
      setLoading(false);
    }
  };


  const revokeVendorMapping = async (order_ids) => {

    if (!order_ids) {
      return;
    }

    try {
      const res = await axios.post(`${baseURL}/api/admin/revokeVendorMapping`,
        { order_id: order_ids },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });

      toast.success(res.data.message || "Vendor mapping revoked successfully");
      setCheckVendorMapping(null)
      setIsOpenIndividualVendorMap("");
      setIsOpenIndividualVendorMap("");
      checkVendorMappingStatus(order_ids);

    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to load riders");
    } finally {
      setLoading(false);
    }
  };



  const checkVendorMappingStatus = async (order_ids) => {
    if (!order_ids) {
      return;
    }

    try {
      const res = await axios.post(`${baseURL}/api/admin/checkVendorMappingStatus`,
        { order_id: order_ids },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });



      setCheckVendorMapping(res.data || []);


    } catch (err) {


      setCheckVendorMapping(err.response.data || []);
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
      clearAllState()
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




  const changeVendorMapping = async (orderId, vendorId) => {
    try {
      const res = await axios.post(
        `${baseURL}/api/admin/changeVendorMapping`,
        {
          order_id: orderId,
          new_vendor_id: vendorId
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(res.data.message || "Vendor assigned successfully");
      fetchOrders();
      setIsOpenIndividualVendorMap("")
      setAssignmentState("");
      setSelectedBulkOrders([]);
      setBulkOrderWeight(0);
      setFetchBulkAssignmentRider(false);
    } catch (err) {
      toast.error(err.response.data.message);
      return
    } finally {
      setLoading(false);
    }
  };


  const assignBulkOrderVendor = async (orderIds, vendorId) => {
    setLoading(true);
    try {

      await axios.post(
        `${baseURL}/api/admin/assignOrderToVendor`,
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
      clearAllState()
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
      toast.success(res.data.message)
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
      toast.success(res?.data?.message)
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };




  const changeOrderStatus = async ({
    order_ids = [],
    newStatus = "",
    rider_id = "",
    remarks = "",
    sub_remarks = "",
    detailed_remarks = "",
    rescheduled_date = "",
  }) => {
    setLoading(true);

    try {
      const promises = order_ids.map((order_id) =>
        axios.post(
          `${baseURL}/api/admin/updatestatus/${order_id}`,
          {
            order_id,
            status: newStatus,
            rider_id,
            remarks,
            sub_remarks,
            detailed_remarks,
            rescheduled_date,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
      );

      const responses = await Promise.all(promises);

      clearAllState();
      fetchOrders();

      toast.success(
        responses[0]?.data?.message || "Orders updated successfully"
      );

      return responses.map((res) => res.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Failed to update status"
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelRiderAssignments = async (order_ids = []) => {
    try {
      const promises = order_ids.map((order_id) =>
        axios.post(
          `${baseURL}/api/admin/cancelRiderAssignment/${order_id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
      );

      const responses = await Promise.all(promises);

      toast.success("Rider assignment cancelled successfully");

      clearAllState();
      fetchOrders();

      return responses.map((res) => res.data);

    } catch (error) {
      console.error("Cancel rider assignment error:", error);

      toast.error(
        error.response?.data?.message || "Failed to cancel rider assignment"
      );

      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong",
      };
    }
  };

  const rtoDelivered = async (ids = []) => {

    setLoading(true);
    try {



      const res = await axios.post(
        `${baseURL}/api/admin/markOrdersRtoDeliveredByAdmin`,
        { order_ids: [...ids] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchOrders();
      setEditingStatusId(null);
      toast.success(res?.data?.message)
      clearAllState()
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedBulkOrders.length === orders.filter((o) => o.tpc_awb_number === null).length) {
      console.log("All selected, clearing selection");
      setSelectedBulkOrders([]);
      setBulkOrderWeight(0);
      clearAllState()
    } else {

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

  const canMarkInTransit = selectedBulkOrders.every(
    (order) => order.status === "picked" && order.mapped_with && (order.pickup_stage === null || order.pickup_stage === "at_vendor")
  );

  const canAssignUndelivered = selectedBulkOrders.every(
    (order) => order.status === "undelivered"
  );


  return (
    <>

      <div className="bg-gray-100  dark:bg-gray-900 min-h-screen w-full">

        <div className="sticky top-0 left-0  z-10 bg-[#0446DB] dark:border-b dark:border-[#0446DB] dark:bg-gray-900 py-4 md:py-6 shadow-md ">
          <div className="  mx-auto px-8  ">
            {/* Mobile Layout */}
            <div className="md:hidden  flex flex-col space-y-4">
              {/* Top Row: Heading and Buttons */}
              <div className="flex-col items-center justify-between">
                <h1 className="text-xl font-bold text-white">Order Details</h1>

                <div className="flex-col  items-center gap-2">
                  <Link to="/admin/bookOrders">
                    <Button
                      variant="outline"
                      className="bg-white w-full mt-1 text-[#0446DB] font-medium px-5 py-2.5 rounded-lg shadow hover:bg-indigo-100 hover:shadow-lg transition flex items-center gap-2"
                    >
                      <FaTasks className="text-sm" />
                      <span>Assignment Console</span>

                    </Button>
                  </Link>
                  <Button variant="outline"
                    onClick={exportCSV}
                    className="bg-white w-full mt-1 text-[#0446DB] font-medium px-5 py-2.5 rounded-lg shadow hover:bg-indigo-100 hover:shadow-lg transition flex items-center gap-2"
                  >
                    <FaFileExport className="text-sm" />
                    <span>Export</span>
                  </Button>
                  <Drawer direction="right"
                    open={isMobileFilterDrawerOpen}
                    onOpenChange={setIsMobileFilterDrawerOpen}>
                    <DrawerTrigger asChild>

                      <Button variant="outline"
                        className="bg-white w-full mt-1 text-[#0446DB] font-medium px-5 py-2.5 rounded-lg shadow hover:bg-indigo-100 hover:shadow-lg transition flex items-center gap-2"
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
                      <div className="no-scrollbar overflow-y-auto">
                        <form onSubmit={(e) => e.preventDefault()}
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
                                  value={advanceFilters.startDate}
                                  max={advanceFilters.endDate || undefined}
                                  onClick={openDatePicker}
                                  onFocus={openDatePicker}
                                  onChange={(e) => updateAdvanceFilter("startDate", e.target.value)}
                                  className="w-full cursor-pointer border dark:border-gray-700 bg-white text-gray-900 dark:bg-gray-800 
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
                                  value={advanceFilters.endDate}
                                  min={advanceFilters.startDate || undefined}
                                  onClick={openDatePicker}
                                  onFocus={openDatePicker}
                                  onChange={(e) => updateAdvanceFilter("endDate", e.target.value)}
                                  className="w-full cursor-pointer border dark:border-gray-700 bg-white text-gray-900 dark:bg-gray-800 
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
                        </form>
                      </div>
                      <DrawerFooter>
                        <Button onClick={() => setIsMobileFilterDrawerOpen(false)} variant="outline">Cancel</Button>
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

              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-white">Order Details</h1>

              </div>


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


              <div className="flex items-center gap-4">
                <Link to="/admin/bookOrders">
                  <Button
                    variant="outline"
                    className="bg-white text-[#0446DB] font-medium px-5 py-2.5 rounded-lg shadow hover:bg-indigo-100 hover:shadow-lg transition flex items-center gap-2"
                  >
                    <FaTasks className="text-sm" />
                    <span>Assignment Console</span>

                  </Button>
                </Link>
                <Button variant="outline"
                  onClick={exportCSV}
                  className="bg-white text-[#0446DB] font-medium px-5 py-2.5 rounded-lg shadow hover:bg-indigo-100 hover:shadow-lg transition flex items-center gap-2"
                >
                  <FaFileExport className="text-sm" />
                  <span>Export</span>
                </Button>
                <Drawer direction="right" open={isDesktopFilterDrawerOpen} onOpenChange={setIsDesktopFilterDrawerOpen}>
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
                      <form onSubmit={(e) => e.preventDefault()}
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
                                value={advanceFilters.startDate}
                                max={advanceFilters.endDate || undefined}
                                onClick={openDatePicker}
                                onFocus={openDatePicker}
                                onChange={(e) => updateAdvanceFilter("startDate", e.target.value)}
                                className="w-full cursor-pointer border dark:border-gray-700 bg-white text-gray-900 dark:bg-gray-800 
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
                                value={advanceFilters.endDate}
                                min={advanceFilters.startDate || undefined}
                                onClick={openDatePicker}
                                onFocus={openDatePicker}
                                onChange={(e) => updateAdvanceFilter("endDate", e.target.value)}
                                className="w-full cursor-pointer border dark:border-gray-700 bg-white text-gray-900 dark:bg-gray-800 
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
                      </form>
                    </div>
                    <DrawerFooter>
                      <Button onClick={() => setIsDesktopFilterDrawerOpen(false)} variant="outline">Cancel</Button>
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
                        clearAllState()
                      }}

                      className={`px-5 py-2.5 rounded-full my-2 border transition-all duration-300 font-medium text-sm tracking-wide ${selectedStatus === st
                        ? "bg-[#0446DB] text-white "
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
          {selectedBulkOrders.length > 0 && (selectedStatus === "booked") && (

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
                    <button
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
                          <option value="lost">
                            Lost Orders
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


                  {!fetchBulkAssignmentVendor || vendor?.length == 0 ? (
                    <button
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
                      {
                        vendor?.length > 0 && (
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
                        )
                      }

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
                      clearAllState()
                    }}
                  >
                    Clear Selected Orders
                  </button>
                </div>



              </div>
            </>

          )}






          {selectedBulkOrders.length > 0 && (selectedStatus === "picked" || selectedStatus === "undelivered") && (

            <>
              <div className="mb-10 bg-white  rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-5">
                  Bulk Orders Rider ({selectedBulkOrders.length} Selected)
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

                        {

                        }

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
                              {
                                assignmentState && (

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
                                    Bulk Assign Orders to Vendor
                                  </button>
                                )
                              }

                            </>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {/* {
                   

                  (selectedStatus === "picked" || selectedStatus === "undelivered") && (
                  <>
                    {selectedBulkOrders.length > 0 && riders.length == 0 ? (
                      <button
                        onClick={() => {
                          // setFetchBulkAssignmentVendor(true);

                          // const order_ids = [
                          //   ...new Set(selectedBulkOrders.map((o) => o.id)),
                          // ];
                          const vendor_ids = [
                            ...new Set(selectedBulkOrders.map((o) => o.mapped_with)),
                          ];

                          fetchRider(vendor_ids);
                        }}
                        className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                      >
                        Get Available Rider
                      </button>
                    ) : (
                      <>
                        {riders?.length > 0 && (
                          <>
                            <select
                              className="border border-gray-300 text-sm text-gray-700 px-4 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
                              value={assignmentState}
                              onChange={(e) => setAssignmentState(e.target.value)}
                            >
                              <option value="">
                                Select Rider for Bulk Assignment
                              </option>

                              {riders.map((rider, index) => (
                                <option
                                  key={index}
                                  value={rider.id}
                                >
                                  {rider.id} : {rider.name}
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

                                  await changeOrderStatus(
                                    {
                                      order_id: order.id || "",
                                      newStatus: selectedStatus === "undelivered" ? "undelivered assigned" : "in transit",
                                      rider_id: assignmentState || ""
                                    }
                                  );
                                }

                                clearAllState()
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
                  )} */}



                  {((selectedStatus === "picked" && canMarkInTransit) ||
                    (selectedStatus === "undelivered" && canAssignUndelivered)) && (
                      <>
                        {selectedBulkOrders.length > 0 && riders.length === 0 ? (
                          <button
                            onClick={() => {
                              const vendor_ids = [
                                ...new Set(selectedBulkOrders.map((o) => o.mapped_with)),
                              ];

                              fetchRider(vendor_ids);
                            }}
                            className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-1 rounded-md shadow font-medium"
                          >
                            Get Available Rider
                          </button>
                        ) : (
                          <>
                            {riders.length > 0 && (
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
                                    <option key={rider.id} value={rider.id}>
                                      {rider.id} : {rider.name}
                                    </option>
                                  ))}
                                </select>
                                {
                                  assignmentState && (

                                    <button
                                      onClick={async () => {
                                        if (!assignmentState) {
                                          toast.warn("Please select a rider");
                                          return;
                                        }

                                        const order_ids = selectedBulkOrders.map((o) => o.id);

                                        await changeOrderStatus({
                                          order_ids: order_ids,
                                          newStatus:
                                            selectedStatus === "undelivered"
                                              ? "undelivered assigned"
                                              : "in transit",
                                          rider_id: assignmentState,
                                        });
                                        // for (const order of selectedBulkOrders) {
                                        // }

                                        clearAllState();
                                      }}
                                      className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                                    >
                                      Bulk Assign Orders to Rider
                                    </button>
                                  )
                                }

                              </>
                            )}
                          </>
                        )}
                      </>
                    )}





                  <button
                    className="bg-red-500 hover:bg-red-800 transition text-white px-5 py-1 rounded-md shadow font-medium"
                    onClick={() => {
                      setSelectedBulkOrders([]);
                      setBulkOrderWeight(0);
                      setFetchBulkAssignmentRider(false);
                      setFetchBulkAssignmentVendor(false);
                      setcanceledBulkOrder(false)
                      setSelectedMapType(null)
                      clearAllState()
                    }}
                  >
                    Clear Selected Orders
                  </button>
                </div>



              </div>
            </>

          )}


          {selectedBulkOrders.length > 0 && (selectedStatus === "in transit" || selectedStatus == 'undelivered assigned') && (

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


                  {(selectedStatus === "in transit" || selectedStatus == 'undelivered assigned') && (
                    <>
                      {selectedBulkOrders.length > 0 && openOfd.length == 0 ? (
                        <button
                          onClick={() => {

                            const order_ids = [
                              ...new Set(selectedBulkOrders.map((o) => o.id)),
                            ];

                            setopenOfd(order_ids);
                          }}
                          className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-1 rounded-md shadow font-medium"
                        >
                          Change Action
                        </button>
                      ) : (
                        <>
                          {openOfd.length > 0 && (
                            <>
                              <select
                                className="border border-gray-300 text-sm text-gray-700 px-4 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
                                value={assignmentState}
                                onChange={(e) => setAssignmentState(e.target.value)}
                              >
                                <option value="">
                                  Select Status
                                </option>


                                <option

                                  value={'out for delivery'}
                                >
                                  Mark Out For Delivery
                                </option>
                                {
                                  selectedStatus == 'undelivered assigned' && (

                                    <option

                                      value={'cancel rider assignment'}
                                    >
                                      Cancel Rider Assignment
                                    </option>
                                  )
                                }
                                <option value="lost">
                                  Lost
                                </option>

                              </select>
                              {
                                assignmentState && (

                                  <button
                                    onClick={async () => {
                                      if (!assignmentState) {
                                        toast.warn("Please select a status");
                                        return;
                                      }
                                      const order_ids = selectedBulkOrders.map((o) => o.id);

                                      if (assignmentState === "cancel rider assignment") {
                                        await cancelRiderAssignments(order_ids);
                                      } else {
                                        // for (const order of selectedBulkOrders) {
                                        // }
                                        await changeOrderStatus({
                                          order_ids: order_ids,
                                          newStatus: assignmentState,
                                          rider_id: ""
                                        });
                                      }

                                      clearAllState();


                                    }}
                                    className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                                  >

                                    {assignmentState == '' ? "Select Status" : assignmentState === "cancel rider assignment" ? "Cancel Rider Assignment" : "Mark Bulk Orders as Out for Delivery"}
                                  </button>
                                )
                              }
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}



                  <button
                    className="bg-red-500 hover:bg-red-800 transition text-white px-5 py-1 rounded-md shadow font-medium"
                    onClick={() => {
                      clearAllState()
                      setSelectedBulkOrders([]);
                      setBulkOrderWeight(0);
                      setFetchBulkAssignmentRider(false);
                      setFetchBulkAssignmentVendor(false);
                      setcanceledBulkOrder(false)
                      setSelectedMapType(null)
                      clearAllState()
                    }}
                  >
                    Clear Selected Orders
                  </button>
                </div>



              </div>
            </>

          )}


          {selectedBulkOrders.length > 0 && selectedStatus === "out for delivery" && (

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


                  {selectedStatus === "out for delivery" && (
                    <>
                      {selectedBulkOrders.length > 0 && openDelivered.length == 0 ? (
                        <button
                          onClick={() => {

                            const order_ids = [
                              ...new Set(selectedBulkOrders.map((o) => o.id)),
                            ];

                            setopenDeliverde(order_ids);
                          }}
                          className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-1 rounded-md shadow font-medium"
                        >
                          Change Action
                        </button>
                      ) : (
                        <>
                          {

                            openDelivered.length > 0 && (
                              <>
                                <select
                                  className="border border-gray-300 text-sm text-gray-700 px-4 py-1 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
                                  value={assignmentState}
                                  onChange={(e) => setAssignmentState(e.target.value)}
                                >
                                  <option value="">
                                    Select Status
                                  </option>


                                  <option

                                    value={'delivered'}
                                  >
                                   Mark Delivered
                                  </option>
                                  <option

                                    value={'ndr'}
                                  >
                                   Mark NDR
                                  </option>

                                  <option value="lost">
                                    Mark Lost
                                  </option>

                                </select>

                                {
                                  assignmentState == 'ndr' && (
                                    <>

                                      <Dialog className='w-5xl'>

                                        <DialogTrigger asChild>
                                          <Button
                                            variant="outline"

                                            className="text-sm font-medium rounded-sm border bg-[#0446DB] hover:text-[#FFF] text-white border-[#0446DB]  hover:bg-[#0446DB] inline-block cursor-pointer"
                                          >
                                            <span>
                                              Mark Bulk Orders as NDR
                                            </span>
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent className="">
                                          <DialogHeader>
                                            <DialogTitle>NDR</DialogTitle>

                                          </DialogHeader>

                                          <div>
                                            <label htmlFor="delivery_reason" className="block mb-1 mt-2">
                                              Undelivered Reason
                                            </label>
                                            <select name="delivery_reason"
                                              id="delivery_reason"
                                              onChange={(e) => {
                                                setRemarks(e.target.value)
                                                setRescheduleDate('')
                                                setSub_remarks("")
                                              }}
                                              className=" border w-full py-2 px-2 rounded"
                                            >
                                              <option value="">-- Select Reason --</option>
                                              <option value="Address Incorrect / Incomplete">Address Incorrect / Incomplete</option>
                                              <option value="Customer Requested Reschedule">Customer Requested Reschedule</option>
                                              <option value="Customer Refused / Cancelled">Customer Refused / Cancelled</option>
                                              <option value="Delivery Attempted – Not Reachable">Delivery Attempted – Not Reachable</option>
                                              <option value="Delivery Attempted – No Response">Delivery Attempted – No Response</option>
                                              <option value="Wrong Pincode / Address">Wrong Pincode / Address</option>
                                              <option value="Wrong Contact Details">Wrong Contact Details</option>
                                              <option value="Vehicle / Weather / Road Issue">Vehicle / Weather / Road Issue</option>
                                              <option value="Package Damaged">Package Damaged</option>
                                            </select>

                                            {
                                              remarks == 'Customer Requested Reschedule' && (
                                                <>
                                                  <div>
                                                    <label htmlFor=""
                                                      className="block mb-1 mt-2"
                                                    >Reschedule Date</label>
                                                    <input
                                                      type="date"
                                                      value={rescheduleDate}
                                                      onClick={(e) => e.target.showPicker?.()}
                                                      onChange={(e) => setRescheduleDate(e.target.value)}
                                                      className=" border w-full py-2 px-2 rounded"
                                                    />
                                                  </div>
                                                </>
                                              )
                                            }
                                            {
                                              remarks == 'Customer Requested Reschedule' && (
                                                <>
                                                  <label htmlFor=""
                                                    className="block mb-1 mt-2 "
                                                  >Sub Remark</label>
                                                  <select

                                                    onChange={(e) => {
                                                      setSub_remarks(e.target.value);
                                                    }}
                                                    className="border w-full py-2 px-2 rounded"
                                                  >
                                                    <option value="">-- Select Reason --</option>
                                                    <option value="Unavailable at Location">Unavailable at Location</option>
                                                    <option value="Out of Station">Out of Station</option>
                                                    <option value="COD Amount Not Ready">COD Amount Not Ready</option>
                                                    <option value="Require Different Time Slot">Require Different Time Slot</option>
                                                    <option value="Other">Other</option>
                                                  </select>
                                                </>
                                              )
                                            }
                                            {
                                              remarks == 'Customer Refused / Cancelled' && (
                                                <>
                                                  <label htmlFor=""
                                                    className="block mb-1 mt-2 "
                                                  >Sub Remark</label>
                                                  <select
                                                    onChange={(e) => {
                                                      setSub_remarks(e.target.value);
                                                    }}
                                                    className="border w-full py-2 px-2 rounded"
                                                  >
                                                    <option value="">-- Select Reason --</option>
                                                    <option value="Duplicate Order">Duplicate Order</option>
                                                    <option value="Order Placed by Mistake">Order Placed by Mistake</option>
                                                    <option value="COD Amount Not Ready">COD Amount Not Ready</option>
                                                    <option value="Better Price Elsewhere">Better Price Elsewhere</option>
                                                    <option value="Other">Other</option>
                                                  </select>
                                                </>
                                              )
                                            }

                                            <div>
                                              <label
                                                htmlFor="remark"
                                                className="block mb-1 mt-2"
                                              >
                                                Remark (Optional)
                                              </label>
                                              <input
                                                type="text"
                                                value={detailed_remarks}
                                                placeholder="Enter remark"
                                                onChange={(e) => setdetailed_remarks(e.target.value)}
                                                className=" border w-full py-2 px-2 rounded"
                                              />
                                            </div>
                                          </div>

                                          <Button
                                            onClick={async () => {
                                              const order_ids = selectedBulkOrders.map((o) => o.id);
                                              await changeOrderStatus({
                                                order_ids: order_ids,
                                                newStatus: assignmentState,
                                                remarks: remarks,
                                                sub_remarks: sub_remarks,
                                                detailed_remarks: detailed_remarks,
                                                rescheduled_date: rescheduleDate,
                                                rider_id: ""
                                              })
                                              // for (const order of selectedBulkOrders) {

                                              // }
                                            }}
                                            className={'bg-[#0446DB]'}
                                          >Submit</Button>


                                          <DialogFooter>

                                            <DialogClose asChild>

                                              <Button variant="outline"
                                                onClick={() => {
                                                  clearAllState()
                                                }}
                                              >Cancel</Button>
                                            </DialogClose>

                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>

                                    </>
                                  )
                                }


                                {
                                  assignmentState == 'delivered' && (

                                    <button
                                      onClick={async () => {
                                        if (!assignmentState) {
                                          toast.warn("Please select a status");
                                          return;
                                        }

                                        const order_ids = selectedBulkOrders.map((o) => o.id);

                                        await changeOrderStatus(
                                          {
                                            order_ids: order_ids,
                                            newStatus: assignmentState,
                                            rider_id: ''
                                          }
                                        );
                                        // for (const order of selectedBulkOrders) {

                                        // }

                                        clearAllState()
                                      }}
                                      className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-1 rounded-md shadow font-medium"
                                    >
                                      Mark Bulk Orders as  {assignmentState == 'delivered' ? "Delivered" : "NDR"}
                                    </button>
                                  )
                                }
                                {
                                  assignmentState == 'lost' && (

                                    <button
                                      onClick={async () => {
                                        if (!assignmentState) {
                                          toast.warn("Please select a status");
                                          return;
                                        }

                                        const order_ids = selectedBulkOrders.map((o) => o.id);

                                        await changeOrderStatus(
                                          {
                                            order_ids: order_ids,
                                            newStatus: assignmentState,
                                            rider_id: ''
                                          }
                                        );
                                        // for (const order of selectedBulkOrders) {

                                        // }

                                        clearAllState()
                                      }}
                                      className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-1 rounded-md shadow font-medium"
                                    >
                                      Mark Bulk Orders as  {assignmentState == 'lost' ? "Lost" : ""}
                                    </button>
                                  )
                                }

                              </>
                            )}
                        </>
                      )}
                    </>
                  )}



                  <button
                    className="bg-red-500 hover:bg-red-800 transition text-white px-5 py-1 rounded-md shadow font-medium"
                    onClick={() => {
                      clearAllState()
                      setSelectedBulkOrders([]);
                      setBulkOrderWeight(0);
                      setFetchBulkAssignmentRider(false);
                      setFetchBulkAssignmentVendor(false);
                      setcanceledBulkOrder(false)
                      setSelectedMapType(null)
                      clearAllState()
                    }}
                  >
                    Clear Selected Orders
                  </button>
                </div>



              </div>
            </>

          )}



          {selectedBulkOrders.length > 0 && selectedStatus === "rto in transit" && (

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
                  {selectedStatus === "rto in transit" && (
                    selectedBulkOrders.length > 0 ? (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();



                          const ids = selectedBulkOrders.map(order => order.id);
                          await rtoDelivered(ids)

                          setSelectedBulkOrders([]);
                          setSelectedMapType(null);
                        }}
                      >
                        <select
                          className="border border-gray-300 text-sm text-gray-700 px-4 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
                          name="status"
                        >
                          <option value="">Select Status</option>

                          <option value="rto delivered">
                            RTO Delivered
                          </option>
                          <option value="lost">
                            Lost
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




                  <button
                    className="bg-red-500 hover:bg-red-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                    onClick={() => {
                      setSelectedBulkOrders([]);
                      setBulkOrderWeight(0);
                      setFetchBulkAssignmentRider(false);
                      setFetchBulkAssignmentVendor(false);
                      setcanceledBulkOrder(false)
                      setSelectedMapType(null)
                      clearAllState()
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
                  <select
                    className="border border-gray-300 text-sm text-gray-700 px-4 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
                    value={bulkStatusState}
                    onChange={(e) => setBulkStatusState(e.target.value)}
                  >
                    <option value="">Select Status</option>

                    <option value="Cancelled">Mark  Cancelled</option>

                    <option value="Cancel Vendor Mapped">
                      Cancel Vendor Mapping
                    </option>
                    <option value="lost">
                      Lost
                    </option>
                  </select>
                  {
                    bulkStatusState && (

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
                    )
                  }


                  <button
                    className="bg-red-500 hover:bg-red-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                    onClick={() => {
                      setSelectedBulkOrders([]);
                      clearAllState()
                    }}
                  >
                    Clear Selected Orders
                  </button>
                </div>
              </div>
            )}



          {/* Table */}
          <div className="overflow-x-auto bg-white dark:bg-gray-900">


            <div className="relative -mx-4 sm:-mx-6 lg:mx-0">



              <div className="w-full overflow-x-auto overscroll-x-contain">

                <Table>
                  <TableHeader >
                    <TableRow>
                      {(selectedStatus === "booked" ||
                        selectedStatus === "pending pickup" ||
                        selectedStatus === "rto in transit" ||
                        selectedStatus === 'picked' ||
                        selectedStatus === 'in transit' ||
                        selectedStatus === 'undelivered' ||
                        selectedStatus === 'undelivered assigned' ||
                        selectedStatus === 'out for delivery'
                      ) ? (
                        <TableHead className="px-6 py-4">
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
                        </TableHead>
                      ) : (
                        <>
                          <TableHead className="px-6 py-4"></TableHead>
                        </>
                      )}

                      <TableHead className="text-center px-6 py-3">ORDER ID</TableHead>

                      {(selectedStatus === "pending pickup" ||
                        selectedStatus === "out for delivery" ||
                        selectedStatus === "delivered" ||
                        selectedStatus === "picked" ||
                        selectedStatus === "in transit" ||
                        selectedStatus === "undelivered assigned") && (
                          <>
                            <TableHead >RIDER ID/VENDOR ID</TableHead>

                          </>
                        )}

                      <TableHead >
                        CONSIGNEE ADDRESS
                      </TableHead>
                      <TableHead >PACKAGE DETAILS</TableHead>

                      <TableHead >ASSIGNMENT/RIDER</TableHead>
                      <TableHead >MAPPED/VENDOR</TableHead>
                      <TableHead >STATUS</TableHead>
                      {
                        selectedStatus === 'booked' && (

                          <TableHead >ELIGIBLE VENDORS</TableHead>
                        )
                      }
                    </TableRow>
                  </TableHeader>
                  <TableBody >
                    {
                      loading ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                            <p className="mt-2">Loading orders...</p>
                          </TableCell>
                        </TableRow>

                      ) : orders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-10">
                            No orders found
                          </TableCell>
                        </TableRow>

                      ) : (
                        orders?.map((order) => {

                          let isSelected;
                          if (selectedStatus === "booked") {
                            isSelected = selectedBulkOrders.some(
                              (o) => o.id === order.id
                            );
                          } else if (selectedStatus === "pending pickup") {
                            isSelected = selectedBulkOrders.some(
                              (o) => o.id === order.id
                            );
                          } else if (selectedStatus === "rto in transit") {

                            isSelected = selectedBulkOrders.some(
                              (o) => o.id === order.id
                            );
                          }
                          const canItMarkInTransit = selectedBulkOrders.every(
                            (order) =>

                              order.mapped_with &&
                              (order.pickup_stage === null || order.pickup_stage === "at_vendor")
                          );
                          return (
                            <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b overflow-x-scroll">
                              {/* Select */}
                              {

                                ((selectedStatus === "booked") && (order.tpc_awb_number == null) || selectedStatus === "pending pickup" && order.tpc_awb_number == null) ? (
                                  <td className="px-6 py-4 text-center">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}

                                      onChange={(e) => {
                                        const isChecked = e.target.checked;

                                        if (selectedStatus === "booked" || selectedStatus === "pending pickup") {
                                          if (isChecked) {
                                            setSelectedBulkOrders((prev) => {
                                              const updated = [...prev, order];

                                              const order_ids = updated.map((o) => o.id);

                                              if (selectedStatus === "booked") {

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
                                              if (selectedStatus === "booked") {
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
                                ) : selectedStatus === 'rto in transit' ? (
                                  <>
                                    <td className="px-6 py-4 text-center">
                                      <input
                                        type="checkbox"
                                        checked={isSelected}

                                        onChange={(e) => {
                                          const isChecked = e.target.checked;

                                          if (selectedStatus === "rto in transit") {
                                            if (isChecked) {
                                              setSelectedBulkOrders((prev) => {
                                                const updated = [...prev, order];
                                                const order_ids = updated.map((o) => o.id);
                                                return updated;
                                              });

                                              setBulkOrderWeight(
                                                (prev) => Number(prev) + Number(order.total_weight)
                                              );
                                            } else {
                                              setSelectedBulkOrders((prev) => {
                                                const updated = prev.filter((o) => o.id !== order.id);
                                                const order_ids = updated.map((o) => o.id);
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
                                  </>
                                ) : ['in transit', 'out for delivery', 'undelivered', 'undelivered assigned'].includes(selectedStatus) ? (
                                  <>
                                    <td className="px-6 py-4 text-center">
                                      <input
                                        type="checkbox"
                                        checked={selectedBulkOrders.some((item) => item.id === order.id)}

                                        onChange={(e) => {
                                          const isChecked = e.target.checked;

                                          if (selectedStatus == 'picked') {
                                            if (
                                              order.pickup_stage !== null &&
                                              order.pickup_stage !== "at_vendor"
                                            ) {

                                              toast.error(
                                                'Pickup stage must be empty or "at_vendor" before marking the order in transit'
                                              );

                                              return
                                            }
                                          }

                                          if (isChecked) {
                                            setSelectedBulkOrders((prev) => {
                                              const updated = [...prev, order];
                                              const order_ids = updated.map((o) => {


                                                return o.id
                                              });
                                              return updated;
                                            });

                                            setBulkOrderWeight(
                                              (prev) => Number(prev) + Number(order.total_weight)
                                            );
                                          } else {
                                            setSelectedBulkOrders((prev) => {
                                              const updated = prev.filter((o) => o.id !== order.id);
                                              const order_ids = updated.map((o) => o.id);
                                              return updated;
                                            });

                                            setBulkOrderWeight(
                                              (prev) => Number(prev) - Number(order.total_weight) // ✅ fixed bug
                                            );
                                          }
                                        }}
                                        className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
                                      />

                                    </td>
                                  </>
                                ) : canMarkInTransit && selectedStatus == 'picked' ? (
                                  <>
                                    <td className="px-6 py-4 text-center">
                                      <input
                                        type="checkbox"
                                        checked={selectedBulkOrders.some((item) => item.id === order.id)}

                                        onChange={(e) => {
                                          const isChecked = e.target.checked;

                                          if (selectedStatus == 'picked') {
                                            if (
                                              order.pickup_stage !== null &&
                                              order.pickup_stage !== "at_vendor"
                                            ) {

                                              toast.error(
                                                'Pickup stage must be empty or "at_vendor" before marking the order in transit'
                                              );

                                              return
                                            }
                                          }

                                          if (isChecked) {
                                            setSelectedBulkOrders((prev) => {
                                              const updated = [...prev, order];
                                              const order_ids = updated.map((o) => {


                                                return o.id
                                              });
                                              return updated;
                                            });

                                            setBulkOrderWeight(
                                              (prev) => Number(prev) + Number(order.total_weight)
                                            );
                                          } else {
                                            setSelectedBulkOrders((prev) => {
                                              const updated = prev.filter((o) => o.id !== order.id);
                                              const order_ids = updated.map((o) => o.id);
                                              return updated;
                                            });

                                            setBulkOrderWeight(
                                              (prev) => Number(prev) - Number(order.total_weight) // ✅ fixed bug
                                            );
                                          }
                                        }}
                                        className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
                                      />

                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <TableCell className="px-6 py-4 text-center">
                                      -
                                    </TableCell>
                                  </>
                                )}

                              {/* Order ID */}
                              <TableCell className="px-6 py-4 whitespace-pre-line">
                                <p className="text-l text-gray-800 flex items-center">
                                  <a
                                    href={`${frontEndURL}/track-order?awb_number=${order.awb_number}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline text-[#0446DB] hover:text-blue-500"
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



                                  <Dialog className='w-5xl'>

                                    <DialogTrigger asChild>
                                      <Button variant="outline" className="text-xs font-medium  text-red-600  inline-block cursor-pointer ">
                                        <span >
                                          <TbFileInfo />
                                        </span>
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-4xl">
                                      <DialogHeader>
                                        <DialogTitle>Order Details</DialogTitle>

                                      </DialogHeader>

                                      <div className="bg-white p-6  space-y-3 text-gray-700">
                                        {/* Basic Info */}
                                        <h3 className="font-semibold text-[#0446DB] mb-2">
                                          Basic Details
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <strong>Order ID:</strong> {order.merchant_order_id}
                                            <button
                                              className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
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
                                          </div>
                                          <div>
                                            <strong>AWB No:</strong> {order.awb_number}
                                            <button
                                              className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
                                              onClick={() => {
                                                navigator.clipboard.writeText(order.awb_number);
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
                                          </div>
                                          <div>
                                            <strong>Order Type:</strong>{" "}
                                            {order.order_type === "cod" ? "COD" : "Prepaid"}
                                          </div>
                                          <div>
                                            <strong>Order Specific:</strong> {order.order_specific}
                                          </div>
                                          <div>
                                            <strong>Order Status:</strong>{" "}
                                            {toCapitalizeEachWord(order.status)}
                                          </div>
                                          <div>
                                            <strong>Total Amount:</strong> ₹
                                            {Number(order.total_amount).toLocaleString()}
                                          </div>
                                          <div>
                                            <strong>Order Weight:</strong>{" "}
                                            {Number(order.total_weight).toLocaleString()}g
                                          </div>
                                          <div>
                                            <strong>Number of Packets:</strong>{" "}
                                            {order.number_of_boxes}
                                          </div>
                                        </div>

                                        {/* Document Info */}
                                        {/* <div className="pt-4 border-t">
                                          <h3 className="font-semibold text-[#0446DB] mb-2">
                                            Delivery Details
                                          </h3>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <strong>Customer Name:</strong>{" "}
                                              {order.delivery_contact_name}
                                            </div>

                                            <div>
                                              <strong>Address:</strong>{" "}
                                              {order.delivery_address_line}
                                            </div>
                                            <div>
                                              <strong>City:</strong>{" "}
                                              {`${order.delivery_city}, ${order.delivery_state} - ${order.delivery_pincode}` ||
                                                "N/A"}
                                            </div>
                                          </div>
                                        </div> */}


                                        {/* <div className="pt-4 border-t">
                                          <h3 className="font-semibold text-[#0446DB] mb-2">
                                            Pickup Details
                                          </h3>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <strong>Name:</strong>{" "}
                                              {order.pickup_contact_name || "N/A"}
                                            </div>
                                            <div>
                                              <strong>Pickup Phone No:</strong>{" "}
                                              {`${order.pickup_phone}` || "N/A"}
                                            </div>
                                            <div>
                                              <strong>Address:</strong>{" "}
                                              {order.pickup_address_line || "N/A"}
                                            </div>
                                            <div>
                                              <strong>City:</strong>{" "}
                                              {`${order.pickup_city}, ${order.pickup_state} - ${order.pickup_pincode}` ||
                                                "N/A"}
                                            </div>
                                          </div>
                                        </div> */}


                                        <div className="pt-4 border-t">
                                          <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-semibold text-[#0446DB]">Delivery Details</h3>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => {
                                                if (editingDeliveryId === order.id) {
                                                  // Save logic here - you'll need to create an API endpoint
                                                  handleUpdateDeliveryDetails({
                                                    order_id: order.id,
                                                    delivery_details: deliveryFormData
                                                  });
                                                } else {
                                                  setEditingDeliveryId(order.id);
                                                  setDeliveryFormData({
                                                    delivery_contact_name: order.delivery_contact_name,
                                                    delivery_address_line: order.delivery_address_line,
                                                    delivery_city: order.delivery_city,
                                                    delivery_state: order.delivery_state,
                                                    delivery_pincode: order.delivery_pincode,
                                                  });
                                                }
                                              }}
                                              className="text-xs"
                                            >
                                              {editingDeliveryId === order.id ? "Save" : "Edit"}
                                            </Button>
                                          </div>

                                          {editingDeliveryId === order.id ? (
                                            <div className="grid grid-cols-2 gap-4">
                                              <div>
                                                <label className="block text-xs text-gray-600 mb-1">Customer Name</label>
                                                <input
                                                  type="text"
                                                  value={deliveryFormData.delivery_contact_name}
                                                  onChange={(e) => setDeliveryFormData(prev => ({ ...prev, delivery_contact_name: e.target.value }))}
                                                  className="w-full border rounded-md px-2 py-1 text-sm"
                                                />
                                              </div>
                                              <div>
                                                <label className="block text-xs text-gray-600 mb-1">Address</label>
                                                <input
                                                  type="text"
                                                  value={deliveryFormData.delivery_address_line}
                                                  onChange={(e) => setDeliveryFormData(prev => ({ ...prev, delivery_address_line: e.target.value }))}
                                                  className="w-full border rounded-md px-2 py-1 text-sm"
                                                />
                                              </div>
                                              <div>
                                                <label className="block text-xs text-gray-600 mb-1">City</label>
                                                <input
                                                  type="text"
                                                  value={deliveryFormData.delivery_city}
                                                  onChange={(e) => setDeliveryFormData(prev => ({ ...prev, delivery_city: e.target.value }))}
                                                  className="w-full border rounded-md px-2 py-1 text-sm"
                                                />
                                              </div>
                                              <div>
                                                <label className="block text-xs text-gray-600 mb-1">State</label>
                                                <input
                                                  type="text"
                                                  value={deliveryFormData.delivery_state}
                                                  onChange={(e) => setDeliveryFormData(prev => ({ ...prev, delivery_state: e.target.value }))}
                                                  className="w-full border rounded-md px-2 py-1 text-sm"
                                                />
                                              </div>
                                              <div>
                                                <label className="block text-xs text-gray-600 mb-1">Pincode</label>
                                                <input
                                                  type="text"
                                                  value={deliveryFormData.delivery_pincode}
                                                  onChange={(e) => setDeliveryFormData(prev => ({ ...prev, delivery_pincode: e.target.value }))}
                                                  className="w-full border rounded-md px-2 py-1 text-sm"
                                                />
                                              </div>
                                              <div className="flex items-end">
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => setEditingDeliveryId(null)}
                                                  className="text-red-500"
                                                >
                                                  Cancel
                                                </Button>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="grid grid-cols-2 gap-4">
                                              <div>
                                                <strong>Customer Name:</strong> {order.delivery_contact_name}
                                              </div>
                                              <div>
                                                <strong>Address:</strong> {order.delivery_address_line}
                                              </div>
                                              <div>
                                                <strong>City:</strong>{" "}
                                                {`${order.delivery_city}, ${order.delivery_state} - ${order.delivery_pincode}` || "N/A"}
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                        {/* Pickup Details */}
                                        <div className="pt-4 border-t">
                                          <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-semibold text-[#0446DB]">Pickup Details</h3>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => {
                                                if (editingPickupId === order.id) {
                                                  // Save logic here
                                                  handleUpdateDeliveryDetails({
                                                    order_id: order.id,
                                                    pickup_details: pickupFormData
                                                  }
                                                  );
                                                } else {
                                                  setEditingPickupId(order.id);
                                                  setPickupFormData({
                                                    pickup_contact_name: order.pickup_contact_name || "",
                                                    pickup_phone: order.pickup_phone || "",
                                                    pickup_address_line: order.pickup_address_line || "",
                                                    pickup_city: order.pickup_city || "",
                                                    pickup_state: order.pickup_state || "",
                                                    pickup_pincode: order.pickup_pincode || "",
                                                  });
                                                }
                                              }}
                                              className="text-xs"
                                            >
                                              {editingPickupId === order.id ? "Save" : "Edit"}
                                            </Button>
                                          </div>

                                          {editingPickupId === order.id ? (
                                            <div className="grid grid-cols-2 gap-4">
                                              <div>
                                                <label className="block text-xs text-gray-600 mb-1">Name</label>
                                                <input
                                                  type="text"
                                                  value={pickupFormData.pickup_contact_name}
                                                  onChange={(e) => setPickupFormData(prev => ({ ...prev, pickup_contact_name: e.target.value }))}
                                                  className="w-full border rounded-md px-2 py-1 text-sm"
                                                />
                                              </div>
                                              <div>
                                                <label className="block text-xs text-gray-600 mb-1">Phone No</label>
                                                <input
                                                  type="text"
                                                  value={pickupFormData.pickup_phone}
                                                  onChange={(e) => setPickupFormData(prev => ({ ...prev, pickup_phone: e.target.value }))}
                                                  className="w-full border rounded-md px-2 py-1 text-sm"
                                                />
                                              </div>
                                              <div>
                                                <label className="block text-xs text-gray-600 mb-1">Address</label>
                                                <input
                                                  type="text"
                                                  value={pickupFormData.pickup_address_line}
                                                  onChange={(e) => setPickupFormData(prev => ({ ...prev, pickup_address_line: e.target.value }))}
                                                  className="w-full border rounded-md px-2 py-1 text-sm"
                                                />
                                              </div>
                                              <div>
                                                <label className="block text-xs text-gray-600 mb-1">City</label>
                                                <input
                                                  type="text"
                                                  value={pickupFormData.pickup_city}
                                                  onChange={(e) => setPickupFormData(prev => ({ ...prev, pickup_city: e.target.value }))}
                                                  className="w-full border rounded-md px-2 py-1 text-sm"
                                                />
                                              </div>
                                              <div>
                                                <label className="block text-xs text-gray-600 mb-1">State</label>
                                                <input
                                                  type="text"
                                                  value={pickupFormData.pickup_state}
                                                  onChange={(e) => setPickupFormData(prev => ({ ...prev, pickup_state: e.target.value }))}
                                                  className="w-full border rounded-md px-2 py-1 text-sm"
                                                />
                                              </div>
                                              <div>
                                                <label className="block text-xs text-gray-600 mb-1">Pincode</label>
                                                <input
                                                  type="text"
                                                  value={pickupFormData.pickup_pincode}
                                                  onChange={(e) => setPickupFormData(prev => ({ ...prev, pickup_pincode: e.target.value }))}
                                                  className="w-full border rounded-md px-2 py-1 text-sm"
                                                />
                                              </div>
                                              <div className="flex items-end">
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => setEditingPickupId(null)}
                                                  className="text-red-500"
                                                >
                                                  Cancel
                                                </Button>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="grid grid-cols-2 gap-4">
                                              <div>
                                                <strong>Name:</strong> {order.pickup_contact_name || "N/A"}
                                              </div>
                                              <div>
                                                <strong>Pickup Phone No:</strong> {`${order.pickup_phone}` || "N/A"}
                                              </div>
                                              <div>
                                                <strong>Address:</strong> {order.pickup_address_line || "N/A"}
                                              </div>
                                              <div>
                                                <strong>City:</strong>{" "}
                                                {`${order.pickup_city}, ${order.pickup_state} - ${order.pickup_pincode}` || "N/A"}
                                              </div>
                                            </div>
                                          )}
                                        </div>



                                      </div>

                                      <DialogFooter>
                                        <DialogClose asChild>

                                          <button
                                            onClick={() => {
                                              navigate(`/admin/order-history?awb=${order?.awb_number}`);
                                            }}
                                            className="bg-green-500 mr-2 text-white px-4 py-2 rounded hover:bg-indigo-800 transition"
                                          >
                                            Get History
                                          </button>
                                        </DialogClose>
                                        <DialogClose asChild>

                                          <Button
                                            onClick={() => {
                                              clearAllState()
                                            }}
                                            variant="outline">Cancel</Button>
                                        </DialogClose>

                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>



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
                              </TableCell>

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
                                    <TableCell className="text-center ">
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

                                    </TableCell>

                                  </>
                                )}

                              {/* Address */}
                              <TableCell className="px-6 py-1 whitespace-pre-line">
                                <p className="font-medium text-gray-800 dark:text-white">
                                  {order.delivery_contact_name}
                                </p>
                                <HoverCard>
                                  <HoverCardTrigger>{order.delivery_address_line.slice(0, 30)}...</HoverCardTrigger>
                                  <HoverCardContent
                                    className='bg-[#0446DB] text-white'
                                  >
                                    {order.delivery_address_line}, {order.delivery_city}, {order.delivery_state} -{" "}
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
                              </TableCell>

                              {/* Package Details */}
                              <TableCell className="px-6 py-4">
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
                              </TableCell>

                              {/* Assignment */}
                              {
                                selectedStatus === "All" ? (
                                  <>
                                    <TableCell className="px-6 py-4 text-center">
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
                                    </TableCell>
                                  </>
                                ) : (
                                  <>
                                    <TableCell className="px-6 py-4 text-center">
                                      {order.status === "booked" ||
                                        order.status === "undelivered" ? (
                                        <>

                                          <span
                                            onClick={() => {


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

                                        <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-green-100 text-green-600">
                                          Assignment Completed
                                        </span>
                                      ) : order.status === "rto in transit" ? (
                                        <>
                                          <span

                                            className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer"
                                          >
                                            Not Assigned
                                          </span>
                                        </>
                                      ) : order.status === "rto delivered" ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                          Return To Origin
                                        </span>
                                      ) : (

                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                          Assigned
                                        </span>
                                      )}
                                    </TableCell>
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
                                    <TableCell className="px-6 py-4 text-center">
                                      {order.status === "booked" ? (
                                        <>
                                          {!(
                                            isOpenIndividualVendorAssignmnet === order.id
                                          ) ? (

                                            <span
                                              onClick={() => {
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
                                      ) : order.status === "picked" && order?.mapped_with === null ? (
                                        <>
                                          <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                            Not Mapped
                                          </span>
                                        </>
                                      ) : order.status === "cancelled" ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                          Order Canceled
                                        </span>
                                      ) : order.status === 'undelivered' ? (

                                        <>
                                          {
                                            (checkVendorMapping !== null && !checkVendorMapping?.canChangeMapping && isOpenIndividualVendorMap === order.id) ? (
                                              <>
                                                <form
                                                  onSubmit={(e) => {
                                                    e.preventDefault();
                                                    revokeVendorMapping(order.id)
                                                  }}
                                                  className="flex items-center gap-2"
                                                >
                                                  <button
                                                    type="submit"
                                                    className="bg-[#0446DB] whitespace-nowrap text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                                  >
                                                    Revoke Vendor Mapping
                                                  </button>
                                                  <button
                                                    type="button"
                                                    className="text-xs bg-red-500/20 px-2 py-1 rounded text-red-500 text-gray-500 hover:underline"
                                                    onClick={() => {
                                                      setCheckVendorMapping({
                                                        canChangeMapping: true,
                                                        currentAction: "grant"
                                                      })
                                                      setIsOpenIndividualVendorMap("");
                                                    }

                                                    }
                                                  >
                                                    Close
                                                  </button>
                                                </form>
                                              </>
                                            ) : (isOpenIndividualVendorMap === order.id) ? (
                                              <>
                                                <form
                                                  onSubmit={(e) => {
                                                    e.preventDefault();
                                                    const selectedVendor = assignmentState;
                                                    if (!selectedVendor) {
                                                      toast.warn("Please select a vendor");
                                                      return;
                                                    }
                                                    changeVendorMapping(order.id, selectedVendor);
                                                    setIsOpenIndividualVendorMap("");
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
                                                    className="bg-[#0446DB] whitespace-nowrap text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                                  >
                                                    Change Mapping
                                                  </button>
                                                  <button
                                                    type="button"
                                                    className="text-xs text-gray-500 hover:underline"
                                                    onClick={() =>
                                                      setIsOpenIndividualVendorMap("")
                                                    }
                                                  >
                                                    Close
                                                  </button>
                                                </form>
                                              </>
                                            ) : (
                                              <span
                                                onClick={() => {
                                                  if (order.status === 'undelivered') {
                                                    checkVendorMappingStatus(order.id);
                                                    fetchVendor(order.id);
                                                    // revokeVendorMapping(order.id);
                                                    setIsOpenIndividualVendorMap(order.id);
                                                    // setIsOpenIndividualAssignmnetMap("")
                                                  }

                                                }}


                                                className="px-3 py-1 cursor-pointer rounded-full text-xs font-medium bg-green-100 text-green-600">
                                                Mapped
                                              </span>
                                            )
                                          }
                                        </>

                                      ) : order.status === "delivered" || order.status === 'undelivered' || order.status === 'rto in transit' ? (
                                        <>
                                          {
                                            order.mapped_with === null ? (
                                              <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                                Not Mapped
                                              </span>
                                            ) : isOpenIndividualVendorMap === order.id ? (
                                              <>
                                                <form
                                                  onSubmit={(e) => {
                                                    e.preventDefault();
                                                    const selectedVendor = assignmentState;
                                                    if (!selectedVendor) {
                                                      toast.warn("Please select a vendor");
                                                      return;
                                                    }
                                                    changeVendorMapping(order.id, selectedVendor);
                                                    setIsOpenIndividualVendorMap("");
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
                                                    className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                                  >
                                                    Assign
                                                  </button>
                                                  <button
                                                    type="button"
                                                    className="text-xs text-gray-500 hover:underline"
                                                    onClick={() =>
                                                      setIsOpenIndividualVendorMap("")
                                                    }
                                                  >
                                                    Close
                                                  </button>
                                                </form>
                                              </>
                                            ) : (
                                              <span
                                                onClick={() => {
                                                  if (order.status === 'undelivered') {
                                                    fetchVendor(order.id);
                                                    setIsOpenIndividualVendorMap(order.id);
                                                    setIsOpenIndividualAssignmnetMap("")
                                                  }
                                                }}
                                                className="px-3 py-1 cursor-pointer rounded-full text-xs font-medium bg-green-100 text-green-600">
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
                                    </TableCell>
                                  </>
                                )
                              }


                              {/* Status */}
                              {
                                selectedStatus === "All" ? (
                                  <>
                                    {/* only view ststus */}
                                    <TableCell className="px-6 py-4  text-center">
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
                                    </TableCell>


                                  </>
                                ) : (
                                  <>
                                    <TableCell className="px-6 py-4 text-center">
                                      {
                                        order.status === "cancelled" ||
                                          // order.status === "undelivered" ||
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

                                                  const newStatus = e.target.elements.status.value;

                                                  if (selectedStatus === "rto in transit") {

                                                    await rtoDelivered([order.id]);
                                                    return;
                                                  }

                                                  if (newStatus == 'cancel rider assignment') {
                                                    cancelRiderAssignments([order.id])

                                                    return
                                                  }

                                                  await changeOrderStatus({
                                                    order_ids: [order.id],
                                                    newStatus,
                                                  });
                                                }}
                                              >
                                                <div className="flex items-center gap-2">
                                                  <select
                                                    name="status"
                                                    defaultValue={order.status}
                                                    onChange={(e) => {
                                                      setAssignmentState(e.target.value)
                                                    }}
                                                    className="text-xs border border-gray-300 rounded-md px-2 py-1"
                                                    required
                                                  >
                                                    <option value="">
                                                      Change Status
                                                    </option>
                                                    {order.status === "booked" && (
                                                      <>
                                                        <option value="cancelled">
                                                          Cancelled
                                                        </option>
                                                        <option value="lost">
                                                          Lost
                                                        </option>
                                                      </>
                                                    )}
                                                    {order.status === "picked" && (
                                                      <>
                                                        <option value="in transit">
                                                          In Transit
                                                        </option>
                                                        <option value="lost">
                                                          Lost
                                                        </option>
                                                      </>
                                                    )}
                                                    {order.status === "undelivered" && (
                                                      <>
                                                        <option value="undelivered assigned">
                                                          Undelivered Assigned
                                                        </option>
                                                        <option value="lost">
                                                          Lost
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
                                                          <option value="lost">
                                                            Lost
                                                          </option>
                                                        </>
                                                      )}
                                                    {order.status ===
                                                      "in transit" && (
                                                        <>
                                                          <option value="out for delivery">
                                                          Mark  Out For Delivery
                                                          </option>
                                                          <option value="lost">
                                                           Mark Lost
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
                                                          <option value="lost">
                                                            Lost
                                                          </option>
                                                        </>
                                                      )}
                                                    {order.status ===
                                                      "rto in transit" && (
                                                        <>
                                                          <option value="rto delivered">
                                                            RTO Delivered
                                                          </option>
                                                          <option value="lost">
                                                            Lost
                                                          </option>
                                                        </>
                                                      )}
                                                    {order.status ===
                                                      "undelivered assigned" && (
                                                        <>
                                                          <option value="out for delivery">
                                                            Mark Out For Delivery
                                                          </option>
                                                          <option value="cancel rider assignment">
                                                            Cancel Rider Assignemnt
                                                          </option>
                                                          <option value="lost">
                                                           Mark Lost
                                                          </option>
                                                        </>
                                                      )}
                                                  </select>
                                                  {
                                                    assignmentState == 'ndr' && (
                                                      <>

                                                        <Dialog className='w-5xl'>

                                                          <DialogTrigger asChild>
                                                            <Button
                                                              variant="outline"

                                                              className="text-sm font-medium rounded-sm border py-0.5 bg-[#0446DB] hover:text-[#FFF] text-white border-[#0446DB]  hover:bg-[#0446DB] inline-block cursor-pointer"
                                                            >
                                                              <span>
                                                                Mark as NDR
                                                              </span>
                                                            </Button>
                                                          </DialogTrigger>
                                                          <DialogContent className="">
                                                            <DialogHeader>
                                                              <DialogTitle>NDR</DialogTitle>

                                                            </DialogHeader>

                                                            <div>
                                                              <label htmlFor="delivery_reason" className="block mb-1 mt-2">
                                                                Undelivered Reason
                                                              </label>
                                                              <select name="delivery_reason"
                                                                id="delivery_reason"
                                                                onChange={(e) => {
                                                                  setRemarks(e.target.value)
                                                                  setRescheduleDate('')
                                                                  setSub_remarks("")
                                                                }}
                                                                className=" border w-full py-2 px-2 rounded"
                                                              >
                                                                <option value="">-- Select Reason --</option>
                                                                <option value="Address Incorrect / Incomplete">Address Incorrect / Incomplete</option>
                                                                <option value="Customer Requested Reschedule">Customer Requested Reschedule</option>
                                                                <option value="Customer Refused / Cancelled">Customer Refused / Cancelled</option>
                                                                <option value="Delivery Attempted – Not Reachable">Delivery Attempted – Not Reachable</option>
                                                                <option value="Delivery Attempted – No Response">Delivery Attempted – No Response</option>
                                                                <option value="Wrong Pincode / Address">Wrong Pincode / Address</option>
                                                                <option value="Wrong Contact Details">Wrong Contact Details</option>
                                                                <option value="Vehicle / Weather / Road Issue">Vehicle / Weather / Road Issue</option>
                                                                <option value="Package Damaged">Package Damaged</option>
                                                              </select>

                                                              {
                                                                remarks == 'Customer Requested Reschedule' && (
                                                                  <>
                                                                    <div>
                                                                      <label htmlFor=""
                                                                        className="block mb-1 mt-2"
                                                                      >Reschedule Date</label>
                                                                      <input
                                                                        type="date"
                                                                        value={rescheduleDate}
                                                                        onClick={(e) => e.target.showPicker?.()}
                                                                        onChange={(e) => setRescheduleDate(e.target.value)}
                                                                        className=" border w-full py-2 px-2 rounded"
                                                                      />
                                                                    </div>
                                                                  </>
                                                                )
                                                              }
                                                              {
                                                                remarks == 'Customer Requested Reschedule' && (
                                                                  <>
                                                                    <label htmlFor=""
                                                                      className="block mb-1 mt-2 "
                                                                    >Sub Remark</label>
                                                                    <select

                                                                      onChange={(e) => {
                                                                        setSub_remarks(e.target.value);
                                                                      }}
                                                                      className="border w-full py-2 px-2 rounded"
                                                                    >
                                                                      <option value="">-- Select Reason --</option>
                                                                      <option value="Unavailable at Location">Unavailable at Location</option>
                                                                      <option value="Out of Station">Out of Station</option>
                                                                      <option value="COD Amount Not Ready">COD Amount Not Ready</option>
                                                                      <option value="Require Different Time Slot">Require Different Time Slot</option>
                                                                      <option value="Other">Other</option>
                                                                    </select>
                                                                  </>
                                                                )
                                                              }
                                                              {
                                                                remarks == 'Customer Refused / Cancelled' && (
                                                                  <>
                                                                    <label htmlFor=""
                                                                      className="block mb-1 mt-2 "
                                                                    >Sub Remark</label>
                                                                    <select
                                                                      onChange={(e) => {
                                                                        setSub_remarks(e.target.value);
                                                                      }}
                                                                      className="border w-full py-2 px-2 rounded"
                                                                    >
                                                                      <option value="">-- Select Reason --</option>
                                                                      <option value="Duplicate Order">Duplicate Order</option>
                                                                      <option value="Order Placed by Mistake">Order Placed by Mistake</option>
                                                                      <option value="COD Amount Not Ready">COD Amount Not Ready</option>
                                                                      <option value="Better Price Elsewhere">Better Price Elsewhere</option>
                                                                      <option value="Other">Other</option>
                                                                    </select>
                                                                  </>
                                                                )
                                                              }

                                                              <div>
                                                                <label
                                                                  htmlFor="remark"
                                                                  className="block mb-1 mt-2"
                                                                >
                                                                  Remark (Optional)
                                                                </label>
                                                                <input
                                                                  type="text"
                                                                  value={detailed_remarks}
                                                                  placeholder="Enter remark"
                                                                  onChange={(e) => setdetailed_remarks(e.target.value)}
                                                                  className=" border w-full py-2 px-2 rounded"
                                                                />
                                                              </div>
                                                            </div>

                                                            <Button
                                                              onClick={async () => {
                                                                // const order_ids = selectedBulkOrders.map((o) => o.id);
                                                                await changeOrderStatus({
                                                                  order_ids: [order.id],
                                                                  newStatus: assignmentState,
                                                                  remarks: remarks,
                                                                  sub_remarks: sub_remarks,
                                                                  detailed_remarks: detailed_remarks,
                                                                  rescheduled_date: rescheduleDate,
                                                                  rider_id: ""
                                                                })

                                                              }}
                                                              className={'bg-[#0446DB]'}
                                                            >Submit</Button>


                                                            <DialogFooter>

                                                              <DialogClose asChild>

                                                                <Button
                                                                  onClick={() => {
                                                                    clearAllState()
                                                                  }}
                                                                  variant="outline">Cancel</Button>
                                                              </DialogClose>

                                                            </DialogFooter>
                                                          </DialogContent>
                                                        </Dialog>

                                                      </>
                                                    )
                                                  }
                                                  {
                                                    (assignmentState == 'undelivered assigned' || assignmentState == 'in transit') && (
                                                      <>

                                                        <Dialog className='w-5xl'>

                                                          <DialogTrigger asChild>
                                                            <Button
                                                              variant="outline"

                                                              className="text-sm font-medium rounded-sm border py-0.5 bg-[#0446DB] hover:text-[#FFF] text-white border-[#0446DB]  hover:bg-[#0446DB] inline-block cursor-pointer"
                                                            >
                                                              <span>
                                                                Select Rider
                                                              </span>
                                                            </Button>
                                                          </DialogTrigger>
                                                          <DialogContent className="">
                                                            <DialogHeader>
                                                              <DialogTitle>Select a Rider</DialogTitle>

                                                            </DialogHeader>

                                                            <div>
                                                              <label htmlFor="delivery_reason" className="block mb-1 mt-2">
                                                                Select Rider
                                                              </label>
                                                              <select name="delivery_reason"
                                                                id="delivery_reason"
                                                                onChange={(e) => {
                                                                  setRiderID(e.target.value)

                                                                }}
                                                                className=" border w-full py-2 px-2 rounded"
                                                              >
                                                                <option value="">-- Select Rider --</option>
                                                                {riders.map((rider) => (
                                                                  <option key={rider.id} value={rider.id}>
                                                                    {rider.id} : {rider.name}
                                                                  </option>
                                                                ))}

                                                              </select>
                                                            </div>
                                                            <Button
                                                              onClick={async () => {

                                                                await changeOrderStatus({
                                                                  order_ids: [order.id],
                                                                  newStatus: assignmentState == "in transit" ? "in transit" : 'undelivered assigned',
                                                                  rider_id: riderID
                                                                })



                                                              }}
                                                              className={'bg-[#0446DB]'}
                                                            >Submit</Button>


                                                            <DialogFooter>

                                                              <DialogClose asChild>

                                                                <Button
                                                                  onClick={() => {
                                                                    clearAllState()
                                                                  }}
                                                                  variant="outline">Cancel</Button>
                                                              </DialogClose>

                                                            </DialogFooter>
                                                          </DialogContent>
                                                        </Dialog>

                                                      </>
                                                    )
                                                  }

                                                  {/* {
                                                  assignmentState || ( assignmentState != 'ndr' && assignmentState != "undelivered assigned") && (

                                                      <button
                                                        type="submit"
                                                        className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                                      >
                                                        Update
                                                      </button>
                                                    )
                                                  } */}
                                                  {assignmentState &&
                                                    assignmentState !== "ndr" &&
                                                    assignmentState !== "in transit" &&
                                                    assignmentState !== "undelivered assigned" && (
                                                      <button
                                                        type="submit"
                                                        className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                                      >
                                                        Update
                                                      </button>
                                                    )}
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      setEditingStatusId(null)
                                                      clearAllState()
                                                    }}
                                                    className="text-xs text-gray-500 hover:underline"
                                                  >
                                                    Close
                                                  </button>
                                                </div>
                                              </form>
                                            ) : (

                                              <>

                                                <span
                                                  onClick={() => {
                                                    if (order.status == 'in transit') {
                                                      setEditingStatusId(order.id)
                                                      return
                                                    }
                                                    if (order.status == 'undelivered assigned') {
                                                      setEditingStatusId(order.id)
                                                      return
                                                    }
                                                    if (order.status == 'out for delivery') {
                                                      setEditingStatusId(order.id)
                                                      return
                                                    }
                                                    if (
                                                      (order.status === "undelivered" || order.status === "picked") &&
                                                      order.mapped_with &&
                                                      (order.pickup_stage === null || order.pickup_stage === "at_vendor")
                                                    ) {


                                                      const vendor_ids = [order?.mapped_with]
                                                      fetchRider(vendor_ids)
                                                      setEditingStatusId(order.id)
                                                      return
                                                    }
                                                    if (order.status === 'pending pickup' && order.tpc_awb_number !== null) {
                                                      return

                                                    }
                                                    if (selectedStatus === 'rto in transit') {

                                                      setEditingStatusId(order.id)
                                                      return
                                                    }
                                                    if (order.tpc_awb_number !== null) {

                                                      return
                                                    }
                                                    if (order.rider_preference === 'daakit') {
                                                      if (order.mapped_with !== null) {

                                                        return
                                                      } else if (order.status === 'booked') {
                                                        setEditingStatusId(order.id)
                                                      }
                                                      // setEditingStatusId(order.id)
                                                    }
                                                  }

                                                  }
                                                  className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-semibold inline-block bg-blue-100 text-blue-600 cursor-pointer"
                                                >
                                                  {order.status === "rto in transit"
                                                    ? `RTO In Transit`
                                                    : toCapitalizeEachWord(order.status)}

                                                </span>
                                              </>

                                            )}
                                          </>
                                        )}
                                    </TableCell>
                                  </>
                                )

                              }
                              {/* eligible_vendors */}
                              {
                                selectedStatus === 'booked' && (
                                  <TableCell className="px-6 py-1 whitespace-pre-line">
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



                                  </TableCell>
                                )
                              }

                            </TableRow>
                          );
                        })
                      )
                    }

                  </TableBody>
                </Table>
              </div>
            </div>


          </div>


          {totalPages > 1 && (
            <div className="flex justify-between items-center py-2 px-3">
              <div className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Label>Rows per page:</Label>
                <select
                  className="border rounded-md px-2 py-1"
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                >

                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
              </div>
            </div>
          )}

        </div>


      </div>

    </>
  );
}
export default OrderDetails;
