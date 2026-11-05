

import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  CreditCardIcon,
  IndianRupee,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
} from "@/components/ui/alert-dialog";

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
import { TbFileInfo } from "react-icons/tb";
import {
  FaArrowRight,
  FaFileExport,
  FaFilter,
  FaSearch,
  FaTasks,
} from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { toast } from "react-toastify";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import AxiosInstance from "@/Helper/axiosInstance";
import CustomButton from "../../common/CustomButton";
const baseURL = import.meta.env.VITE_BASE_URL;
const frontEndURL = import.meta.env.VITE_FRONTEND_URL;

function OrderDetails() {
  const [newStatus, setNewStatus] = useState("");
  const [remark, setRemark] = useState("");
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
  const [assignmentState, setAssignmentState] = useState("");
  const [riderID, setRiderID] = useState("");
  const [isOpenIndividualAssignmnet, setIsOpenIndividualAssignmnet] =
    useState("");
  const [
    isOpenIndividualVendorAssignmnet,
    setIsOpenIndividualVendorAssignmnet,
  ] = useState("");
  const [isOpenIndividualAssignmnetMap, setIsOpenIndividualAssignmnetMap] =
    useState("");
  const [isOpenIndividualVendorMap, setIsOpenIndividualVendorMap] =
    useState("");

  const [bulkStatusState, setBulkStatusState] = useState("");
  const [selectedBulkOrders, setSelectedBulkOrders] = useState([]);

  const [fetchBulkAssignmentRider, setFetchBulkAssignmentRider] =
    useState(false);
  const [fetchBulkAssignmentVendor, setFetchBulkAssignmentVendor] =
    useState(false);
  const [canceledBulkOrder, setcanceledBulkOrder] = useState(false);
  const [dcBulkOrder, setDcBulkOrder] = useState(false);
  const [bulkOrderWeight, setBulkOrderWeight] = useState(0);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileFilterDrawerOpen, setIsMobileFilterDrawerOpen] =
    useState(false);
  const [isDesktopFilterDrawerOpen, setIsDesktopFilterDrawerOpen] =
    useState(false);
  const [openOfd, setopenOfd] = useState([]);
  const [openDelivered, setopenDeliverde] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [sub_remarks, setSub_remarks] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [detailed_remarks, setdetailed_remarks] = useState("");
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

  const NDR_REASONS = [
    "Origin Unavailable",
    "Origin Closed",
    "Origin Refused",
    "Contact Person Unavailable",
    "Origin Not Reachable",
    "Address Not Found",
    "Delivery Attempt Failed",
    "Other",
  ];

  // Add these states inside your component
  const [ndrstatus, setNdrStatus] = useState("");
  const [ndrDialogOpen, setNdrDialogOpen] = useState(false);
  const [ndrReason, setNdrReason] = useState("");
  const [ndrRemarks, setNdrRemarks] = useState("");
  const [ndrLoading, setNdrLoading] = useState(false);
  const handleStatusChange = (e) => {
    const value = e.target.value;

    if (value === "ndr") {
      setNdrReason("");
      setNdrRemarks("");
      setNdrDialogOpen(true);
      return;
    }

    setNdrStatus(value);
  };



  const [editingDeliveryId, setEditingDeliveryId] = useState(null);
  const [editingPickupId, setEditingPickupId] = useState(null);
  const [deliveryFormData, setDeliveryFormData] = useState({
    delivery_contact_name: "",
    delivery_address_line: "",
    delivery_city: "",
    delivery_state: "",
    delivery_pincode: "",
  });
  const [pickupFormData, setPickupFormData] = useState({
    pickup_contact_name: "" || "",
    pickup_phone: "",
    pickup_address_line: "",
    pickup_city: "",
    pickup_state: "",
    pickup_pincode: "",
  });

  const [vendorList, setVendorList] = useState([]);
  const [merchantList, setMerchantList] = useState([]);

  const [checkVendorMapping, setCheckVendorMapping] = useState(null);
  const [filterUpdate, setFilterUpdate] = useState(false);
  const navigate = useNavigate();
  const clearAll = () => {
    setNewStatus("");
    setRemark("");
     setCheckVendorMapping()
    setBulkOrderWeight(0);
    setFetchBulkAssignmentVendor(false);
    setSelectedMapType(null);
    setEditingStatusId(null);
    setAssignmentState("");
    setLoading(false);
    setRiders([]);
    setopenOfd([]);
    setopenDeliverde([]);
    setRescheduleDate("");
    setRemarks("");
    setSub_remarks("");
    setdetailed_remarks("");
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
      delivery_contact_name: "",
      delivery_address_line: "",
      delivery_city: "",
      delivery_state: "",
      delivery_pincode: "",
    });
    setPickupFormData({
      pickup_contact_name: "" || "",
      pickup_phone: "",
      pickup_address_line: "",
      pickup_city: "",
      pickup_state: "",
      pickup_pincode: "",
    });
  };
 const clearAllState = () => {
  setBulkMappingOpen(false);
  setAssignmentState("");
  setCheckVendorMapping(null);
  setVendor([]);
  setNewStatus("");
  setRemark("");
  setSelectedBulkOrders([]);
  setBulkOrderWeight(0);
  setFetchBulkAssignmentVendor(false);
  setSelectedMapType(null);
  setEditingStatusId(null);
  setLoading(false);
  setRiders([]);
  setopenOfd([]);
  setopenDeliverde([]);
  setRescheduleDate("");
  setRemarks("");
  setSub_remarks("");
  setdetailed_remarks("");
  setFetchBulkAssignmentRider(false);
  setcanceledBulkOrder(false);
  setIsOpenIndividualAssignmnet("");
  setIsOpenIndividualVendorAssignmnet("");
  setIsOpenIndividualAssignmnetMap("");
  setIsOpenIndividualVendorMap("");
  setBulkStatusState("");
  setEditingDeliveryId(null);
  setEditingPickupId(null);

  // Reset delivery form
  setDeliveryFormData({
    delivery_contact_name: "",
    delivery_address_line: "",
    delivery_city: "",
    delivery_state: "",
    delivery_pincode: "",
  });

  // Reset pickup form
  setPickupFormData({
    pickup_contact_name: "",
    pickup_phone: "",
    pickup_address_line: "",
    pickup_city: "",
    pickup_state: "",
    pickup_pincode: "",
  });

  setDcBulkOrder(false);
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








const [bulkMappingOpen, setBulkMappingOpen] = useState(false);
const [bulkMappingLoading, setBulkMappingLoading] = useState(false);

const undeliveredOrders = selectedBulkOrders.filter(
  (order) => order.status === "undelivered"
);

const allSelectedUndelivered =
  selectedBulkOrders.length > 0 &&
  undeliveredOrders.length === selectedBulkOrders.length;

const handleOpenBulkVendorMapping = async () => {
  if (!allSelectedUndelivered) {
    toast.warn("Please select only undelivered orders");
    return;
  }

  setBulkMappingLoading(true);
  setAssignmentState("");
  setCheckVendorMapping(null);

  try {
    const orderIds = undeliveredOrders.map((order) => order.id);

  
    

    setBulkMappingOpen(true);
  } catch (error) {
    toast.error("Failed to load eligible vendors");
  } finally {
    setBulkMappingLoading(false);
  }
};

const handleBulkChangeVendorMapping = async (e) => {
  e.preventDefault();

  if (!allSelectedUndelivered) {
    toast.warn("Please select only undelivered orders");
    return;
  }

  if (!assignmentState) {
    toast.warn("Please select a vendor");
    return;
  }

  setBulkMappingLoading(true);

  try {
    for (const order of undeliveredOrders) {
      await changeVendorMapping(order.id, assignmentState);
    }

    setBulkMappingOpen(false);
    setAssignmentState("");
    setSelectedBulkOrders([]);
    fetchOrders();
  } finally {
    setBulkMappingLoading(false);
  }
};




const handleBulkRevokeVendorMapping = async () => {
  if (!allSelectedUndelivered) {
    toast.warn("Please select only undelivered orders");
    return;
  }

  setBulkMappingLoading(true);

  try {
    for (const order of undeliveredOrders) {
      await revokeVendorMapping(order.id);
    }

    setBulkMappingOpen(false);
    setSelectedBulkOrders([]);
    fetchOrders();
  } finally {
    setBulkMappingLoading(false);
  }
};

  const getAllVendors = async () => {
    try {
      const res = await AxiosInstance.get("/api/admin/getAllVendors", {
        params: {
          limit: 1000,
        },
      });

      setVendorList(res.data.data || []);
    } catch (err) {
      setVendorList([]);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while fetching vendors.",
      );
    }
  };
  const getAllMerchant = async () => {
    try {
      const {data} = await AxiosInstance.get("/api/admin/getAllMerchants", {
        params: {
          limit: 1000,
        },
      });

      setMerchantList(data?.merchants || []);
    } catch (err) {
      setMerchantList([]);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while fetching vendors.",
      );
    }
  };

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
    clearAllState();
  };

  const status = [
    "All",
    "booked",
    "pending pickup",
    "picked",
    "in transit",
    "out for delivery",
    "delivered",
    
  ];
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [dcList, setDcList] = useState([]);

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
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while fetching orders.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDcList = async () => {
    try {
      const getDcList = await AxiosInstance.get(`/api/dc/list`);
      
      setDcList(getDcList?.data?.data || []);
    } catch (error) {
      setDcList([]);
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
        },
      );
      toast.success("Delivery details updated successfully");
      fetchOrders();
      setEditingDeliveryId(null);
      setEditingPickupId(null);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update delivery details",
      );
    }
  };

  const generateBulkPickupRequest = async (order_ids) => {
    try {
      const res = await AxiosInstance.post(
        `/api/admin/generateBulkPickupRequest`,
        {
          order_ids: order_ids,
        },
      );
      fetchOrders();
      toast.success(res?.data?.message);
      clearAllState();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const assignOrdersToDc = async ({ order_ids, dc_id }) => {
    try {
      const res = await AxiosInstance.post(`/api/dc/admin/assignOrders`, {
        order_ids,
        dc_id,
      });
      toast.success(res?.data?.message);
      clearAllState();
      fetchOrders();
    } catch (error) {
      toast.error(error?.response?.data?.message);
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

 

  const fetchRider = async (vendor_ids) => {
    if (!vendor_ids || vendor_ids.length === 0) {
      return;
    }

    // Check if all vendor IDs are the same
    const allSame = vendor_ids.every((id) => id === vendor_ids[0]);

    if (!allSame) {
      toast.error("Selected orders must belong to the same vendor");
      setSelectedBulkOrders([]);
      setBulkOrderWeight(0);
      return;
    }

    const vendor_id = vendor_ids[0];

    try {
      const res = await axios.get(
        `${baseURL}/api/admin/getRidersByVendorId?vendor_id=${vendor_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setRiders(res.data.data || []);
      // if (res.data.data.length == 0) {
      //   setSelectedBulkOrders([]);
      //   setBulkOrderWeight(0);
      //   setFetchBulkAssignmentRider(false);
      //   setFetchBulkAssignmentVendor(false);
      //   setcanceledBulkOrder(false)
      // }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to load riders",
      );
    } finally {
      setLoading(false);
    }
  };

  const revokeVendorMapping = async (order_ids) => {
    if (!order_ids) {
      return;
    }

    try {
      const res = await axios.post(
        `${baseURL}/api/admin/revokeVendorMapping`,
        { order_id: order_ids },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success(res.data.message || "Vendor mapping revoked successfully");
      setCheckVendorMapping(null);
      setIsOpenIndividualVendorMap("");
      setIsOpenIndividualVendorMap("");
      checkVendorMappingStatus(order_ids);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to load riders",
      );
    } finally {
      setLoading(false);
    }
  };

  const checkVendorMappingStatus = async (order_ids) => {
    if (!order_ids) {
      return;
    }

    try {
      const res = await axios.post(
        `${baseURL}/api/admin/checkVendorMappingStatus`,
        { order_id: order_ids },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

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
        },
      );

      toast.success(res.data.message || "Vendor assigned successfully");
      fetchOrders();
      clearAllState();
      setAssignmentState("");
      setSelectedBulkOrders([]);
      setBulkOrderWeight(0);
      setFetchBulkAssignmentRider(false);
    } catch (err) {
      toast.error("Failed to assign vendor");
      return;
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
          new_vendor_id: vendorId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success(res.data.message || "Vendor assigned successfully");
      fetchOrders();
      setIsOpenIndividualVendorMap("");
      setAssignmentState("");
      setSelectedBulkOrders([]);
      setBulkOrderWeight(0);
      setFetchBulkAssignmentRider(false);
    } catch (err) {
      toast.error(err.response.data.message);
      return;
    } finally {
      setLoading(false);
    }
  };

  const assignBulkOrderVendor = async (orderIds, vendorId) => {
    setLoading(true);
    try {
      await axios.post(
        `${baseURL}/api/admin/bulkAssignOrdersToVendor`,
        {
          order_ids: orderIds,
          vendor_id: vendorId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success("Vendor assigned successfully");
      fetchOrders();
      clearAllState();
      setAssignmentState("");
      setSelectedBulkOrders([]);
      setBulkOrderWeight(0);
      setFetchBulkAssignmentRider(false);
    } catch (err) {
      toast.error("Failed to assign vendor");
      return;
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
        },
      );
      fetchOrders();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Error while canceling rider assignment: ",
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelVendorAssignment = async (id) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/api/admin/cancelMappedWithByAdmin/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      toast.success(res.data.message);
      fetchOrders();
      return;
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Error while canceling rider assignment: ",
      );
    } finally {
      setLoading(false);
    }
  };

  const CancelDcMapping = async ({ orderIds }) => {
    try {
      setLoading(true);

      const responses = await Promise.all(
        orderIds.map((id) =>
          AxiosInstance.post(`/api/dc/admin/cancelOrderMapping/${id}`, {}),
        ),
      );

      toast.success(
        responses[0]?.data?.message || "DC mapping cancelled successfully",
      );

      setSelectedBulkOrders([]);
      setBulkOrderWeight(0);

      fetchOrders();
      clearAllState();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while canceling DC mapping",
      );
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async ({ id, newStatus, remark }) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/api/admin/updatestatus/${id}`,
        {
          status: newStatus,
          remarks: remark,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      fetchOrders();
      setEditingStatusId(null);
      toast.success(res?.data?.message);
      clearAllState();
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to update status",
      );
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
          },
        ),
      );

      const responses = await Promise.all(promises);

      clearAllState();
      fetchOrders();

      toast.success(
        responses[0]?.data?.message || "Orders updated successfully",
      );

      return responses.map((res) => res.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to update status",
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (
      selectedBulkOrders.length ===
      orders.filter(
        (o) => o.tpc_awb_number === null && o.rider_preference === "daakit",
      ).length
    ) {
      setSelectedBulkOrders([]);
      setBulkOrderWeight(0);
      clearAllState();
    } else {
      const ord = orders.filter(
        (order) =>
          order.tpc_awb_number == null && order.rider_preference === "daakit",
      );

      setSelectedBulkOrders(ord);

      const totalWeight = orders
        .filter((order) => order.tpc_awb_number == null)
        .reduce((acc, order) => acc + Number(order.total_weight), 0);
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
      toast.error(
        err.response?.data?.message || err.message || "Failed to export orders",
      );
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
      toast.error("Only orders at the Central Hub can be selected.");
      return;
    }

    const currentType = getOrderMapType(order);

    if (isChecked) {
      if (selectedMapType && selectedMapType !== currentType) {
        setSelectedBulkOrders([]);
        setSelectedMapType(null);
        setBulkOrderWeight(0);
        return;
        // toast.error("Please select either mapped orders or unmapped orders, not both."); return;
      }

      setSelectedBulkOrders((prev) => {
        const alreadyExists = prev.some((item) => item.id === order.id);

        if (alreadyExists) return prev;

        const updated = [...prev, order];
        const order_ids = updated.map((o) => o.id);

        setSelectedMapType(currentType);
        setBulkOrderWeight(
          (prevWeight) => Number(prevWeight) + Number(order.total_weight || 0),
        );

        

        return updated;
      });

      return;
    }

    setSelectedBulkOrders((prev) => {
      const updated = prev.filter((item) => item.id !== order.id);
      const order_ids = updated.map((o) => o.id);

      setBulkOrderWeight(
        (prevWeight) => Number(prevWeight) - Number(order.total_weight || 0),
      );

      if (updated.length === 0) {
        setSelectedMapType(null);
      } else {
        setSelectedMapType(getOrderMapType(updated[0]));
      }

      

      return updated;
    });
  };



  useEffect(() => {
    resetAdvanceFilters();
  }, []);

  useEffect(() => {
    fetchDcList();
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
    (order) =>
      order.status === "picked" &&
      order.mapped_with &&
      (order.pickup_stage === null || order.pickup_stage === "at_vendor"),
  );

  const canAssignUndelivered = selectedBulkOrders.every(
    (order) => order.status === "undelivered",
  );

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
              <p className="mt-2"> Loading Order Details...</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex h-[calc(98dvh-83px)] min-h-0 w-full flex-col overflow-hidden bg-[#f5f8fb] dark:bg-gray-900">
            <div className="sticky top-0 left-0 z-40 shrink-0 bg-[#f5f8fb] dark:bg-neutral-900">
              <div className="  mx-auto   ">
                {/* Desktop Layout */}
<div className="flex w-full min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex-shrink-0">
                    <h1 className="text-2xl font-bold dark:text-white">
                      Order Details
                    </h1>
                  </div>

                  <div className="w-full min-w-0 xl:mx-4 xl:max-w-xl xl:flex-1">
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
className="min-w-0 flex-1 px-4 py-2.5 rounded-l-lg text-sm text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent"                      />
                      <button
                        type="submit"
                        className="bg-white px-5 py-2.5 rounded-r-lg border border-l-0 border-gray-300 text-gray-600 hover:bg-indigo-100 hover:text-[#0446DB] transition"
                      >
                        <FaSearch />
                      </button>
                    </form>
                  </div>

                 <div className="flex w-full flex-wrap items-center gap-2 sm:gap-3 xl:w-auto xl:flex-nowrap">
                   {/* <CustomButton
                     variant="outline"
                     size="md"
                     icon={FaTasks}
                    className="w-full sm:w-auto rounded-sm"
                   >
                    <Link
                        to="/admin/bookOrders"
                        
                      >
                        Assignment Console
                    </Link>
                      </CustomButton> */}

                    <CustomButton
                      variant="outline"
                      size="md"
                      icon={FaFileExport}
                      onClick={exportCSV}
                      className="w-full sm:w-auto rounded-sm"
                    >
                      Export
                    </CustomButton>

                    <Drawer
                      direction="right"
                      open={isDesktopFilterDrawerOpen}
                      onOpenChange={setIsDesktopFilterDrawerOpen}
                    >
                      <DrawerTrigger asChild>
                        <CustomButton
                          variant="outline"
                          size="md"
                          icon={FaFilter}
                          className="w-full sm:w-auto rounded-sm"
                        >
                          Filter
                        </CustomButton>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>Filter</DrawerTitle>
                        </DrawerHeader>
                        <div className="no-scrollbar overflow-y-auto px-4">
                          <form
                            onSubmit={(e) => e.preventDefault()}
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
                                    onChange={(e) =>
                                      updateAdvanceFilter(
                                        "startDate",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full cursor-pointer border dark:border-gray-700 bg-white text-gray-900 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-sm text-sm 
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
                                    onChange={(e) =>
                                      updateAdvanceFilter(
                                        "endDate",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full cursor-pointer border dark:border-gray-700 bg-white text-gray-900 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-sm text-sm 
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
      dark:text-white px-3 py-2 rounded-sm text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  >
                                    <option value="">All orders</option>
                                    
                                    <option value="SDD">
                                      Same Day Delivery
                                    </option>
                                    <option value="NDD">
                                      Next Day Delivery
                                    </option>
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
      dark:text-white px-3 py-2 rounded-sm text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  />
                                </div>
                              </div>

                              <div className=" mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <div>
                                  
                                  <label className="block text-xs dark:text-white text-gray-600 mb-1">
                                    Merchant
                                  </label>
                                  <select  
                                  onClick={getAllMerchant}
                                  className="w-full border dark:border-gray-700 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-sm text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  value={advanceFilters.merchant_id}
                                    onChange={(e) =>
                                      setAdvanceFilters((prev) => ({
                                        ...prev,
                                        merchant_id: e.target.value,
                                      }))
                                    }
                                   
                                  >
                                    <option value="">Select Merchant</option>
                                    {
                                      merchantList?.map((m)=>{
                                        return (
                                         <option value={m.id}>{m?.id}:{m?.name}</option>
                                        )
                                      })
                                    }
                                  </select>

                                  
                                  
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
      dark:text-white px-3 py-2 rounded-sm text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  />
                                </div>
                              </div>

                              <div className=" mt-2 grid  grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <div>
                                  <label className="block text-xs dark:text-white text-gray-600 mb-1">
                                    Vendor 
                                  </label>

                                  <select 
                                  onClick={getAllVendors}
                                  value={advanceFilters.vendor_id}
                                    onChange={(e) =>
                                      setAdvanceFilters((prev) => ({
                                        ...prev,
                                        vendor_id: e.target.value,
                                      }))
                                    }
                                   className="w-full border dark:border-gray-700 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-sm text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                 
                                  >
                                    <option value="">Select Vendor</option>
                                    {vendorList?.map((v) => {
                                      
                                      return (
                                        <option value={v?.id}>{v?.id}:{v?.vendor_name}</option>
                                      );
                                    })}
                                  </select>
                                  
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
                          dark:text-white px-3 py-2 rounded-sm text-sm 
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
      dark:text-white px-3 py-2 rounded-sm text-sm 
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
                          <Button
                            onClick={() => setIsDesktopFilterDrawerOpen(false)}
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
            </div>

            {/* Table */}
            <div className="mt-5 flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-sm border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
              <div className="relative left-0 z-40 w-full shrink-0 bg-white dark:bg-neutral-800">
                <div className="relative flex justify-self-start ">
                  <div className=" flex  overflow-x-auto  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="flex gap-1 min-w-max  pl-2">
                      {status.map((st) => (
                        <Button
                          key={st}
                          onClick={() => {
                            setSelectedBulkOrders([]);
                            setSelectedStatus(st);
                            setPage(1);
                            clearAllState();
                          }}
                          className={`px-2 py-2.5 rounded-sm my-2 border transition-all duration-300 font-medium text-sm tracking-wide ${
                            selectedStatus === st
                              ? "bg-[#0446DB] text-white "
                              : "bg-white hover:bg-[#0446DB] hover:text-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]"
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
                      
                          {[
                            "undelivered",
                            "undelivered assigned",
                            "cancelled",
                            "rto in transit",
                            "rto out for delivery",
                            "rto undelivered",
                            "rto delivered",
                          ].includes(selectedStatus) && (
                            <Button
                              className="my-2 rounded-sm border border-[#0446DB] bg-[#0446DB] px-2 py-2.5 text-sm font-medium tracking-wide text-white transition-all duration-300"
                            >
                              {selectedStatus === "rto in transit"
                                ? "RTO In Transit"
                                : selectedStatus === "rto delivered"
                                  ? "RTO Delivered"
                                  : toCapitalizeEachWord(selectedStatus)}

                              {` (${totalOrders})`}
                            </Button>
                          )}




                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex h-8 mt-2 items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-blue-200 bg-blue-50 px-2 text-sm font-medium text-[#0446DB] shadow-sm transition-all duration-200 hover:border-[#0446DB] hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 data-[state=open]:border-[#0446DB] data-[state=open]:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400"
                          >
                            More
                            <ChevronDown className="h-4 w-4 transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="!w-52 !min-w-52">
                          {[
                            "undelivered",
                            "undelivered assigned",
                            "cancelled",
                            "rto in transit",
                            "rto out for delivery",
                            "rto undelivered",
                            "rto delivered",
                          ].map((s) => {
                            return (
                              <>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedBulkOrders([]);
                                    setSelectedStatus(s);
                                    setPage(1);
                                    clearAllState();
                                  }}
                                  variant={
                                    s === "cancelled"
                                      ? "destructive"
                                      : "default"
                                  }
                                  className={`${selectedStatus == s ? "bg-[#0446DB] hover:bg-[#0446DB]  text-white" : " hover:bg-[#0446DB] hover:text-white "}`}
                                >
                                  {s.toLowerCase() === "rto"
                                    ? "RTO"
                                    : s.charAt(0).toUpperCase() + s.slice(1)}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 min-w-max ">
                  {selectedBulkOrders.length > 0 &&
                    selectedStatus === "booked" && (
                      <>
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <CustomButton
                              variant="primary"
                              size="sm"
                              className="rounded-sm  mb-2 "
                            >
                              Action
                            </CustomButton>
                          </AlertDialogTrigger>

                          {/* =========================
                                                DIALOG
                                            ========================= */}
                          <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-lg border border-gray-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                            {/* =========================
                                                  HEADER
                                              ========================= */}
                            <AlertDialogHeader className="border-b border-gray-200 px-6 py-5 dark:border-neutral-800">
                              <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                Bulk Order Actions
                              </AlertDialogTitle>

                              <AlertDialogDescription className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                                Manage status and vendor assignment for{" "}
                                <span className="font-semibold text-[#0446DB]">
                                  {selectedBulkOrders?.length || 0}
                                </span>{" "}
                                selected orders.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            {/* =========================
                                                  BODY
                                              ========================= */}
                            <div className="max-h-[65vh] space-y-5 overflow-y-auto px-6 py-5">
                              {/* ============================================
                                                    CHANGE ORDER STATUS
                                                ============================================ */}
                              <div className="rounded-md border border-red-400 dark:border-neutral-800">
                                {/* SECTION HEADER */}
                                <div className="border-b border-gray-100 bg-red-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/50">
                                  <h3 className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                    Change Order Status
                                  </h3>

                                  <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                                    Update the status of all selected orders.
                                  </p>
                                </div>

                                <div className="p-4">
                                  {!canceledBulkOrder ? (
                                    <Button
                                      type="button"
                                      onClick={() => {
                                        setcanceledBulkOrder(true);
                                      }}
                                      className=" h-9 cursor-pointer items-center justify-center rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0339b5]"
                                    >
                                      Change Action
                                    </Button>
                                  ) : (
                                    <form
                                      className="grid grid-cols-1 gap-3"
                                      onSubmit={async (e) => {
                                        e.preventDefault();

                                        const status =
                                          e.currentTarget.elements.status.value;
                                        const selectedRemark =
                                          e.currentTarget.elements.remark
                                            ?.value || "";

                                        if (!status) {
                                          toast.error("Please select status");
                                          return;
                                        }

                                        if (
                                          status === "cancelled" &&
                                          !selectedRemark
                                        ) {
                                          toast.error("Please select remark");
                                          return;
                                        }

                                        for (const order of selectedBulkOrders) {
                                          await changeStatus({
                                            id: order.id,
                                            newStatus: status,
                                            remark: selectedRemark,
                                          });
                                        }

                                        // Reset
                                        clearAllState();
                                      }}
                                    >
                                      {/* STATUS */}
                                      <select
                                        name="status"
                                        defaultValue=""
                                        onChange={(e) => {
                                          if (e.target.value === "cancelled") {
                                            setNewStatus(e.target.value);
                                          } else {
                                            setNewStatus("");
                                          }
                                        }}
                                        className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none lg:flex-1 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                      >
                                        <option value="">Select Status</option>

                                        <option value="cancelled">
                                          Cancel Orders
                                        </option>
                                      </select>

                                      {/* REMARK */}
                                      {newStatus === "cancelled" && (
                                        <select
                                          name="remark"
                                          defaultValue=""
                                          onChange={(e) => {
                                            setRemark(e.target.value);
                                          }}
                                          className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none lg:flex-1 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                        >
                                          <option value="">
                                            Select Remark
                                          </option>

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
                                            Customer wants refund/replacement
                                            first
                                          </option>
                                        </select>
                                      )}

                                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                      
                                      <div className="flex flex-col gap-1">
                                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                          Cancel Selected Orders
                                        </p>

                                        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                          <span className="font-semibold text-red-600 dark:text-red-400">
                                            {selectedBulkOrders?.length || 0}
                                          </span>{" "}
                                          selected orders will be cancelled.
                                        </p>
                                      </div>

                                      <button
                                        type="submit"
                                        className="h-10 w-full shrink-0 cursor-pointer rounded-md bg-[#0446DB] px-5 text-sm font-medium text-white hover:bg-[#0339b5] lg:w-auto"
                                      >
                                        Apply Action
                                      </button>
                                      </div>

                                    </form>
                                  )}
                                </div>
                              </div>

                              
                              

                              {/* ================= GENERATE BULK PICKUP REQUEST ================= */}
                              <div className="overflow-hidden rounded-sm border border-emerald-200 dark:border-emerald-500/20">
                               
                                <div className="border-b border-emerald-100 bg-emerald-50/70 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                    Schedule Self Pickup
                                  </h3>

                                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                    Schedule self-assignment for all selected
                                    orders.
                                  </p>
                                </div>

                               
                                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                                
                                  <div>
                                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                      Schedule Self Pickup for Selected Orders
                                    </p>

                                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                        {selectedBulkOrders?.length || 0}
                                      </span>{" "}
                                      selected orders will be included in the
                                      self-pickup schedule.
                                    </p>
                                  </div>

                                
                                  <button
                                    type="submit"
                                    disabled={!selectedBulkOrders?.length}
                                    onClick={async () => {
                                      if (!selectedBulkOrders?.length) {
                                        toast.warn(
                                          "Please select at least one order",
                                        );
                                        return;
                                      }

                                      const order_ids = [
                                        ...new Set(
                                          selectedBulkOrders.map(
                                            (order) => order.id,
                                          ),
                                        ),
                                      ];

                                      await generateBulkPickupRequest(
                                        order_ids,
                                      );

                                      clearAllState();
                                    }}
                                    className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-emerald-600 px-5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    Schedule Self Pickup
                                  </button>
                                </div>
                              </div>

                              {/* ============================================
                                                    CLEAR SELECTED ORDERS
                                                ============================================ */}
                              <div className="rounded-md border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                  <div>
                                    <h3 className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                      Clear Selection
                                    </h3>

                                    <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                                      Remove all currently selected orders.
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedBulkOrders([]);
                                      setBulkOrderWeight(0);

                                      setFetchBulkAssignmentRider(false);
                                      setFetchBulkAssignmentVendor(false);

                                      setcanceledBulkOrder(false);

                                      clearAllState();
                                    }}
                                    className="h-10 shrink-0 cursor-pointer rounded-md border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
                                  >
                                    Clear Selected Orders
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* =========================
                                                  FOOTER
                                              ========================= */}
                            <AlertDialogFooter className="border-t border-gray-200 bg-gray-50 px-6 mb-1 mr-1  dark:border-neutral-800 dark:bg-neutral-950/30">
                              <AlertDialogCancel
                                onClick={() => {
                                  clearAll();
                                  clearAllState();
                                }}
                                className="cursor-pointer"
                              >
                                Close
                              </AlertDialogCancel>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}

                  {selectedBulkOrders.length > 0 &&
                    (selectedStatus === "picked" ||
                      selectedStatus === "undelivered") && (
                      <>
                        <AlertDialog>
                          {/* =====================================================
          OPEN BULK ACTION DIALOG
      ===================================================== */}
                          <AlertDialogTrigger>
                            <CustomButton
                              variant="primary"
                              size="sm"
                              className="rounded-sm  mb-2 "
                            >
                              Action
                            </CustomButton>
                          </AlertDialogTrigger>

                          <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                            {/* =====================================================
            HEADER
        ===================================================== */}
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

                            {/* =====================================================
            BODY
        ===================================================== */}
                            <div className="max-h-[65vh] overflow-y-auto px-5 py-5">
                              <div className="space-y-4">
                                {/* =================================================
                MAPPED ORDERS
            ================================================= */}
                                {selectedMapType === "mapped" && (
                                  <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
                                    {/* HEADER */}
                                    <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
                                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                        Change Order Action
                                      </h3>

                                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                        Apply an action to the selected mapped
                                        orders.
                                      </p>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="p-4">
                                      {selectedBulkOrders.length > 0 ? (
                                        <form
                                          className="flex flex-col gap-3 sm:flex-row sm:items-center"
                                          onSubmit={async (e) => {
                                            e.preventDefault();

                                            await Promise.all(
                                              selectedBulkOrders.map((order) =>
                                                cancelVendorAssignment(
                                                  order.id,
                                                ),
                                              ),
                                            );

                                            setSelectedBulkOrders([]);
                                            setSelectedMapType(null);
                                          }}
                                        >
                                          <select
                                            className="h-10 min-w-0 flex-1 rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                            name="status"
                                          >
                                            <option value="">
                                              Select Status
                                            </option>

                                            <option value="Cancel Vendor Mapped">
                                              Cancel Vendor Mapping
                                            </option>
                                          </select>

                                          <button
                                            type="submit"
                                            className="h-10 shrink-0 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5]"
                                          >
                                            Apply Action
                                          </button>
                                        </form>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            setcanceledBulkOrder(true);
                                          }}
                                          className="h-10 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5]"
                                        >
                                          Change Action
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* =================================================
                CLEAR SELECTED ORDERS
            ================================================= */}
                                <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                      Clear Selection
                                    </p>

                                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                      Remove all currently selected orders and
                                      reset bulk actions.
                                    </p>
                                  </div>

                                  <button
                                    className="h-10 shrink-0 cursor-pointer rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
                                    onClick={() => {
                                      setSelectedBulkOrders([]);
                                      setBulkOrderWeight(0);
                                      setFetchBulkAssignmentRider(false);
                                      setFetchBulkAssignmentVendor(false);
                                      setcanceledBulkOrder(false);
                                      setSelectedMapType(null);
                                      clearAllState();
                                    }}
                                  >
                                    Clear Selected Orders
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* =====================================================
            FOOTER
        ===================================================== */}
                            <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 mb-1 mr-1  dark:border-neutral-800 dark:bg-neutral-950/30">
                              <AlertDialogCancel
                                onClick={() => {
                                  
                                  clearAllState();
                                }}
                                className="cursor-pointer rounded-sm"
                              >
                                Close
                              </AlertDialogCancel>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}

                  {selectedBulkOrders.length > 0 &&
                    (selectedStatus === "in transit" ||
                      selectedStatus == "undelivered assigned") && (
                      <>
                        <AlertDialog>
                          {/* =====================================================
          OPEN DIALOG BUTTON
      ===================================================== */}
                          <AlertDialogTrigger>
                            <CustomButton
                              variant="primary"
                              size="sm"
                              className="rounded-sm  mb-2 "
                            >
                              Action
                            </CustomButton>
                          </AlertDialogTrigger>

                          {/* =====================================================
          DIALOG
      ===================================================== */}
                          <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                            {/* ===================================================
            HEADER
        =================================================== */}
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

                            {/* ===================================================
            BODY
        =================================================== */}
                            <div className="max-h-[65vh] overflow-y-auto px-5 py-5">
                              <div className="space-y-4">
                                {/* ===============================================
                ORDER ACTION
            =============================================== */}

                                {(selectedStatus === "in transit" ||
                                  selectedStatus == "undelivered assigned") && (
                                  <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
                                    {/* SECTION HEADER */}
                                    <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
                                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                        Change Order Action
                                      </h3>

                                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                        Select an action to apply to all
                                        selected orders.
                                      </p>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="p-4">
                                      {selectedBulkOrders.length > 0 &&
                                      openOfd.length == 0 ? (
                                        /* =========================================
                          CHANGE ACTION
                      ========================================= */
                                        <button
                                          onClick={() => {
                                            const order_ids = [
                                              ...new Set(
                                                selectedBulkOrders.map(
                                                  (o) => o.id,
                                                ),
                                              ),
                                            ];

                                            setopenOfd(order_ids);
                                          }}
                                          className="h-10 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5]"
                                        >
                                          Change Action
                                        </button>
                                      ) : (
                                        <>
                                          {openOfd.length > 0 && (
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                              {/* ===============================
                              STATUS SELECT
                          =============================== */}

                                              <select
                                                className="h-10 min-w-0 flex-1 rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                                value={assignmentState}
                                                onChange={(e) =>
                                                  setAssignmentState(
                                                    e.target.value,
                                                  )
                                                }
                                              >
                                                <option value="">
                                                  Select Status
                                                </option>

                                               

                                                

                                                <option value="lost">
                                                 Mark Lost
                                                </option>
                                              </select>

                                              {/* ===============================
                              APPLY ACTION
                          =============================== */}

                                              {assignmentState && (
                                                <button
                                                  onClick={async () => {
                                                    if (!assignmentState) {
                                                      toast.warn(
                                                        "Please select a status",
                                                      );
                                                      return;
                                                    }

                                                    const order_ids =
                                                      selectedBulkOrders.map(
                                                        (o) => o.id,
                                                      );

                                                   
                                                    await changeOrderStatus({
                                                      order_ids: order_ids,
                                                      newStatus:
                                                        assignmentState,
                                                      rider_id: "",
                                                    });

                                                    clearAllState();
                                                  }
                                                }
                                                  className="h-10 shrink-0 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5]"
                                                >
                                                  {assignmentState == ""
                                                    ? "Select Status"
                                                    : assignmentState ===
                                                        "cancel rider assignment"
                                                      ? "Cancel Rider Assignment"
                                                      : "Mark Bulk Orders as Out for Delivery"}
                                                </button>
                                              )}
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* ===============================================
                CLEAR SELECTED ORDERS
            =============================================== */}

                                <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                      Clear Selection
                                    </p>

                                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                      Remove all currently selected orders and
                                      reset bulk actions.
                                    </p>
                                  </div>

                                  <button
                                    className="h-10 shrink-0 cursor-pointer rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
                                    onClick={() => {
                                      clearAllState();
                                      setSelectedBulkOrders([]);
                                      setBulkOrderWeight(0);
                                      setFetchBulkAssignmentRider(false);
                                      setFetchBulkAssignmentVendor(false);
                                      setcanceledBulkOrder(false);
                                      setSelectedMapType(null);
                                      clearAllState();
                                    }}
                                  >
                                    Clear Selected Orders
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* ===================================================
            FOOTER
        =================================================== */}
                            <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 mb-1 mr-1  dark:border-neutral-800 dark:bg-neutral-950/30">
                              <AlertDialogCancel
                                onClick={() => {
                                  clearAll();
                                  clearAllState();
                                }}
                                className="cursor-pointer rounded-sm"
                              >
                                Close
                              </AlertDialogCancel>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}

                  {selectedBulkOrders.length > 0 &&
                    selectedStatus === "out for delivery" && (
                      <>
                        <AlertDialog>
                          {/* =====================================================
          OPEN BULK ACTIONS
      ===================================================== */}
                          <AlertDialogTrigger>
                            <CustomButton
                              variant="primary"
                              size="sm"
                              className="rounded-sm  mb-2 "
                            >
                              Action
                            </CustomButton>
                          </AlertDialogTrigger>

                          {/* =====================================================
          MAIN BULK ACTION DIALOG
      ===================================================== */}
                          <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                            {/* HEADER */}
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

                            {/* =====================================================
            BODY
        ===================================================== */}
                            <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
                              <div className="space-y-4">
                                {/* =================================================
                OUT FOR DELIVERY ACTIONS
            ================================================= */}
                                {selectedStatus === "out for delivery" && (
                                  <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
                                    {/* SECTION HEADER */}
                                    <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
                                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                        Change Order Action
                                      </h3>

                                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                        Update the status of selected out for
                                        delivery orders.
                                      </p>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="p-4">
                                      {selectedBulkOrders.length > 0 &&
                                      openDelivered.length == 0 ? (
                                        /* =========================================
                        CHANGE ACTION BUTTON
                    ========================================= */
                                        <button
                                          onClick={() => {
                                            const order_ids = [
                                              ...new Set(
                                                selectedBulkOrders.map(
                                                  (o) => o.id,
                                                ),
                                              ),
                                            ];

                                            setopenDeliverde(order_ids);
                                          }}
                                          className="h-10 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5]"
                                        >
                                          Change Action
                                        </button>
                                      ) : (
                                        <>
                                          {openDelivered.length > 0 && (
                                            <div className="space-y-4">
                                              {/* =====================================
                              STATUS SELECT
                          ===================================== */}
                                              <div>
                                                <label className="mb-2 block text-xs font-medium text-neutral-600 dark:text-neutral-300">
                                                  Select New Status
                                                </label>

                                                <select
                                                  className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                                  value={assignmentState}
                                                  onChange={(e) =>
                                                    setAssignmentState(
                                                      e.target.value,
                                                    )
                                                  }
                                                >
                                                   

                                                  <option value="">
                                                    -- Select Status --
                                                  </option>
                                                  <option value="lost">
                                                    Mark Lost
                                                  </option>
                                                </select>
                                              </div>

                                              

                                              {/* =====================================
                              DELIVERED
                          ===================================== */}
                                              {assignmentState ==
                                                "delivered" && (
                                                <button
                                                  onClick={async () => {
                                                    if (!assignmentState) {
                                                      toast.warn(
                                                        "Please select a status",
                                                      );
                                                      return;
                                                    }

                                                    const order_ids =
                                                      selectedBulkOrders.map(
                                                        (o) => o.id,
                                                      );

                                                    await changeOrderStatus({
                                                      order_ids: order_ids,
                                                      newStatus:
                                                        assignmentState,
                                                      rider_id: "",
                                                    });

                                                    

                                                    clearAllState();
                                                  }}
                                                  className="h-10 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5]"
                                                >
                                                  Mark Bulk Orders as{" "}
                                                  {assignmentState ==
                                                  "delivered"
                                                    ? "Delivered"
                                                    : "NDR"}
                                                </button>
                                              )}

                                              {/* =====================================
                              LOST
                          ===================================== */}
                                              {assignmentState == "lost" && (
                                                <button
                                                  onClick={async () => {
                                                    if (!assignmentState) {
                                                      toast.warn(
                                                        "Please select a status",
                                                      );
                                                      return;
                                                    }

                                                    const order_ids =
                                                      selectedBulkOrders.map(
                                                        (o) => o.id,
                                                      );

                                                    await changeOrderStatus({
                                                      order_ids: order_ids,
                                                      newStatus:
                                                        assignmentState,
                                                      rider_id: "",
                                                    });

                                                    // for (const order of selectedBulkOrders) {
                                                    // }

                                                    clearAllState();
                                                  }}
                                                  className="h-10 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5]"
                                                >
                                                  Mark Bulk Orders as{" "}
                                                  {assignmentState == "lost"
                                                    ? "Lost"
                                                    : ""}
                                                </button>
                                              )}
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* =================================================
                CLEAR SELECTED ORDERS
            ================================================= */}
                                <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                      Clear Selection
                                    </p>

                                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                      Remove all currently selected orders and
                                      reset bulk actions.
                                    </p>
                                  </div>

                                  <button
                                    className="h-10 shrink-0 cursor-pointer rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
                                    onClick={() => {
                                      clearAllState();
                                      setSelectedBulkOrders([]);
                                      setBulkOrderWeight(0);
                                      setFetchBulkAssignmentRider(false);
                                      setFetchBulkAssignmentVendor(false);
                                      setcanceledBulkOrder(false);
                                      setSelectedMapType(null);
                                      clearAllState();
                                    }}
                                  >
                                    Clear Selected Orders
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* =====================================================
            FOOTER
        ===================================================== */}
                            <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 my-0 dark:border-neutral-800 dark:bg-neutral-950/30">
                              <AlertDialogCancel
                                onClick={() => {
                                  clearAll();
                                  clearAllState();
                                }}
                                className="cursor-pointer rounded-sm"
                              >
                                Close
                              </AlertDialogCancel>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}

                  {selectedBulkOrders.length > 0 &&
                    (selectedStatus === "rto in transit" ||
                      selectedStatus == "rto out for delivery" ||
                      selectedStatus == "rto undelivered") && (
                      <>
                        {(selectedStatus === "rto in transit" ||
                          selectedStatus == "rto out for delivery" ||
                          selectedStatus == "rto undelivered") && (
                          <AlertDialog>
                            {/* ================= TRIGGER ================= */}
                            <AlertDialogTrigger>
                              <CustomButton
                                variant="primary"
                                size="sm"
                                className="rounded-sm  mb-2 "
                              >
                                Action
                              </CustomButton>
                            </AlertDialogTrigger>

                            {/* ================= POPUP ================= */}
                            <AlertDialogContent className="!max-w-lg overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                              {/* ================= HEADER ================= */}
                              <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 text-left dark:border-neutral-800">
                                <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
                                  Bulk Order Actions
                                </AlertDialogTitle>

                                <AlertDialogDescription className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                  Change action for{" "}
                                  <span className="font-semibold text-[#0446DB] dark:text-blue-400">
                                    {selectedBulkOrders?.length || 0}
                                  </span>{" "}
                                  selected RTO orders.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              {/* ================= BODY ================= */}
                              <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
                                {/* =====================================================
                RTO ORDER STATUS
            ===================================================== */}
                                <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
                                  {/* SECTION HEADER */}
                                  <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
                                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                      Change RTO Status
                                    </h3>

                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                      Update the status of all selected RTO in
                                      transit orders.
                                    </p>
                                  </div>

                                  {/* ================= ACTION ================= */}
                                  <div className="p-4">
                                    {selectedBulkOrders.length > 0 ? (
                                      <form
                                        className="flex flex-col gap-3 sm:flex-row sm:items-center"
                                        onSubmit={async (e) => {
                                          e.preventDefault();

                                          const ids = selectedBulkOrders.map(
                                            (order) => order.id,
                                          );

                                          if (!ndrstatus) {
                                            toast.error("Please select status");
                                            return;
                                          }

                                          
                                          await changeOrderStatus({
                                            order_ids: ids,
                                            newStatus: ndrstatus,
                                          });

                                          setSelectedBulkOrders([]);
                                          setSelectedMapType(null);
                                        }}
                                      >
                                        <select
                                          name="status"
                                          value={ndrstatus}
                                          onChange={handleStatusChange}
                                          className="h-10 min-w-0 flex-1 rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                        >
                                          <option value="">
                                           -- Select Status --
                                          </option>

                                          

                                          <option value="lost">Mark Lost</option>
                                        </select>

                                        <AlertDialog
                                          open={ndrDialogOpen}
                                          onOpenChange={(open) => {
                                            if (!ndrLoading)
                                              setNdrDialogOpen(open);
                                          }}
                                        >
                                          <AlertDialogContent className="w-[calc(100%-32px)] max-w-[440px] overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                                            <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 text-left dark:border-neutral-700">
                                              <AlertDialogTitle className="text-lg font-semibold text-neutral-900 dark:text-white">
                                                Update NDR Status
                                              </AlertDialogTitle>
                                              <AlertDialogDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                                                Select the reason for marking
                                                this order as NDR.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>

                                            <div className="space-y-4 px-5 py-5">
                                              <div className="space-y-2">
                                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                                                  NDR Reason{" "}
                                                  <span className="text-red-500">
                                                    *
                                                  </span>
                                                </label>

                                                <select
                                                  value={ndrReason}
                                                  onChange={(e) =>
                                                    setNdrReason(e.target.value)
                                                  }
                                                  disabled={ndrLoading}
                                                  className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                                >
                                                  <option value="">
                                                    Select NDR Reason
                                                  </option>
                                                  {NDR_REASONS.map((reason) => (
                                                    <option
                                                      key={reason}
                                                      value={reason}
                                                    >
                                                      {reason}
                                                    </option>
                                                  ))}
                                                </select>
                                              </div>

                                              <div className="space-y-2">
                                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                                                  Remarks{" "}
                                                  {ndrReason === "Other"
                                                    ? "*"
                                                    : "(Optional)"}
                                                </label>

                                                <textarea
                                                  value={ndrRemarks}
                                                  onChange={(e) =>
                                                    setNdrRemarks(
                                                      e.target.value,
                                                    )
                                                  }
                                                  maxLength={500}
                                                  disabled={ndrLoading}
                                                  placeholder="Enter additional details..."
                                                  rows={3}
                                                  className="w-full resize-none rounded-sm border border-neutral-200 bg-white p-3 text-sm text-neutral-700 outline-none focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                                />
                                                <p className="text-right text-xs text-neutral-400">
                                                  {ndrRemarks.length}/500
                                                </p>
                                              </div>
                                            </div>

                                            <AlertDialogFooter className="flex-row gap-2 overflow-hidden border-t border-neutral-200 px-8 my-0 dark:border-neutral-700">
                                              <AlertDialogCancel
                                                disabled={ndrLoading}
                                                className="mt-0 flex-1 rounded-sm"
                                              >
                                                Cancel
                                              </AlertDialogCancel>

                                              <Button
                                                type="button"
                                                disabled={
                                                  ndrLoading ||
                                                  !ndrReason ||
                                                  (ndrReason === "Other" &&
                                                    !ndrRemarks.trim())
                                                }
                                                onClick={async () => {
                                                  const ids =
                                                    selectedBulkOrders.map(
                                                      (order) => order.id,
                                                    );
                                                  await changeOrderStatus({
                                                    order_ids: ids,
                                                    newStatus:
                                                      "rto undelivered",
                                                  });
                                                }}
                                                className="flex-1 rounded-sm bg-[#0446DB] text-white hover:bg-[#0339B5]"
                                              >
                                                {ndrLoading
                                                  ? "Submitting..."
                                                  : "Submit NDR"}
                                              </Button>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>

                                        {/* APPLY ACTION */}
                                        <button
                                          type="submit"
                                          className="h-10 w-full shrink-0 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5] sm:w-auto"
                                        >
                                          Apply Action
                                        </button>
                                      </form>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setcanceledBulkOrder(true);
                                        }}
                                        className="h-10 w-full cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5] sm:w-auto"
                                      >
                                        Change Action
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* =====================================================
                CLEAR SELECTION
            ===================================================== */}
                                <div className="mt-4 flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                      Clear Selection
                                    </p>

                                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                      Remove all selected orders and reset bulk
                                      actions.
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    className="h-10 w-full shrink-0 cursor-pointer rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10 sm:w-auto"
                                    onClick={() => {
                                      setSelectedBulkOrders([]);
                                      setBulkOrderWeight(0);
                                      setFetchBulkAssignmentRider(false);
                                      setFetchBulkAssignmentVendor(false);
                                      setcanceledBulkOrder(false);
                                      setSelectedMapType(null);
                                      clearAllState();
                                    }}
                                  >
                                    Clear Selected Orders
                                  </button>
                                </div>
                              </div>

                              {/* ================= FOOTER ================= */}
                              <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 my-0 dark:border-neutral-800 dark:bg-neutral-950/30">
                                <AlertDialogCancel
                                  onClick={clearAllState}
                                  className="cursor-pointer rounded-sm"
                                >
                                  Close
                                </AlertDialogCancel>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </>
                    )}

                  {/* Bulk Pending Pickup Handle */}
                  {selectedBulkOrders.length > 0 &&
                    selectedStatus === "pending pickup" && (
                      <>
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <CustomButton
                              variant="primary"
                              size="sm"
                              className="rounded-sm  mb-2 "
                            >
                              Action
                            </CustomButton>
                          </AlertDialogTrigger>

                          <AlertDialogContent className="!max-w-3xl !max-h-[90Vh] overflow-y-scroll overflow-x-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                            <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
                              <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
                                Bulk Order Actions
                              </AlertDialogTitle>

                              <AlertDialogDescription className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                Change action for{" "}
                                <span className="font-semibold text-[#0446DB] dark:text-blue-400">
                                  {selectedBulkOrders?.length || 0}
                                </span>{" "}
                                selected orders.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <div className="px-5 py-5">
                              <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
                                <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
                                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                    Change Order Status
                                  </h3>

                                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                    Select an action to apply to all selected
                                    orders.
                                  </p>
                                </div>

                                <div className="space-y-4 p-4">
                                  <div>
                                    <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                      Select Status
                                    </label>

                                    <select
                                      className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
                                      value={bulkStatusState}
                                      onChange={(e) => {
                                        const value = e.target.value;

                                        setBulkStatusState(value);

                                        if (value === "cancelled") {
                                          setNewStatus(value);
                                        } else {
                                          setNewStatus("");
                                          setRemark("");
                                        }
                                      }}
                                    >
                                      <option value="">Select Status</option>

                                      <option value="cancelled">
                                        Mark Cancelled
                                      </option>
                                      {selectedBulkOrders[0].mapped_with !==
                                        null && (
                                        <option value="Cancel Vendor Mapped">
                                          Cancel Vendor Mapping
                                        </option>
                                      )}
                                      {selectedBulkOrders[0].mapped_dc_id !==
                                        null && (
                                        <option value="Cancel DC Mapped">
                                          Cancel DC Mapping
                                        </option>
                                      )}
                                    </select>
                                  </div>

                                  {newStatus === "cancelled" && (
                                    <div className="rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5">
                                      <div className="mb-3">
                                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                                          Cancellation Details
                                        </p>

                                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                          Select a cancellation remark for all
                                          selected orders.
                                        </p>
                                      </div>

                                      <div>
                                        <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                          Cancel Remark
                                          <span className="ml-1 text-red-500">
                                            *
                                          </span>
                                        </label>

                                        <select
                                          name="remark"
                                          value={remark || ""}
                                          onChange={(e) => {
                                            setRemark(e.target.value);
                                          }}
                                          className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
                                        >
                                          <option value="">
                                            Select Remark
                                          </option>

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
                                            Customer wants refund/replacement
                                            first
                                          </option>
                                        </select>

                                        <p className="mt-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                                          This remark will be applied to all{" "}
                                          <span className="font-semibold text-red-600 dark:text-red-400">
                                            {selectedBulkOrders?.length || 0}
                                          </span>{" "}
                                          selected orders.
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {bulkStatusState && (
                                    <div className="flex items-center justify-between rounded-sm border border-blue-100 bg-blue-50/50 px-3 py-2.5 dark:border-blue-500/20 dark:bg-blue-500/5">
                                      <div>
                                        <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                          Selected Orders
                                        </p>

                                        <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                                          This action will be applied to all
                                          selected orders.
                                        </p>
                                      </div>

                                      <span className="rounded-full bg-[#0446DB]/10 px-2.5 py-1 text-xs font-semibold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                                        {selectedBulkOrders?.length || 0}
                                      </span>
                                    </div>
                                  )}

                                  {bulkStatusState && (
                                    <div className="flex justify-end border-t border-neutral-100 pt-4 dark:border-neutral-800">
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          if (!bulkStatusState) {
                                            toast.warn("Select new status");
                                            return;
                                          }

                                          if (
                                            bulkStatusState ===
                                            "Cancel Assignment"
                                          ) {
                                            await Promise.all(
                                              selectedBulkOrders.map((order) =>
                                                cancelRiderAssignment(order.id),
                                              ),
                                            );
                                          } else if (
                                            bulkStatusState ===
                                            "Cancel Vendor Mapped"
                                          ) {
                                            await Promise.all(
                                              selectedBulkOrders.map((order) =>
                                                cancelVendorAssignment(
                                                  order.id,
                                                ),
                                              ),
                                            );
                                          } else if (
                                            bulkStatusState ===
                                            "Cancel DC Mapped"
                                          ) {
                                            const orderIds =
                                              selectedBulkOrders.map(
                                                (order) => order.id,
                                              );

                                            
                                            CancelDcMapping({ orderIds });
                                            return;
                                          } else {
                                            if (!bulkStatusState) {
                                              toast.error(
                                                "Please select status",
                                              );
                                              return;
                                            }

                                            if (
                                              bulkStatusState === "cancelled"
                                            ) {
                                              if (!remark) {
                                                toast.error(
                                                  "Please select remark",
                                                );
                                                return;
                                              }
                                            }

                                            await Promise.all(
                                              selectedBulkOrders.map((order) =>
                                                changeStatus({
                                                  id: order.id,
                                                  newStatus: bulkStatusState,
                                                  remark: remark,
                                                }),
                                              ),
                                            );
                                          }

                                          setSelectedBulkOrders([]);
                                          setBulkStatusState("");
                                        }}
                                        className={`h-9 w-full shrink-0 cursor-pointer rounded-sm px-5 text-sm font-medium text-white transition sm:w-auto ${
                                          bulkStatusState === "cancelled"
                                            ? "bg-red-600 hover:bg-red-700"
                                            : "bg-[#0446DB] hover:bg-indigo-800"
                                        }`}
                                      >
                                        {bulkStatusState ===
                                        "Cancel Vendor Mapped"
                                          ? "Cancel Vendor Mapped"
                                          : bulkStatusState === "cancelled"
                                            ? "Mark Cancelled"
                                            : bulkStatusState === "lost"
                                              ? "Mark Lost"
                                              : bulkStatusState ===
                                                  "Cancel DC Mapped"
                                                ? "Cancel DC Mapped"
                                                : "Change Action"}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {
                                false && (
                              <div className="overflow-hidden mt-4 rounded-sm border border-neutral-200 dark:border-neutral-800">
                                <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
                                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                    Map Vendor
                                  </h3>

                                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                    Select an available vendor and map selected
                                    orders.
                                  </p>
                                </div>

                               
                                <div className="p-4">
                                  {!fetchBulkAssignmentVendor ? (
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                      <div>
                                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                          Available Vendors
                                        </p>

                                        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                          Get eligible vendors for{" "}
                                          <span className="font-semibold text-[#0446DB] dark:text-blue-400">
                                            {selectedBulkOrders?.length || 0}
                                          </span>{" "}
                                          selected orders.
                                        </p>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (
                                            !selectedBulkOrders ||
                                            selectedBulkOrders.length === 0
                                          ) {
                                            toast.warn(
                                              "Please select at least one order",
                                            );
                                            return;
                                          }

                                          const order_ids = [
                                            ...new Set(
                                              selectedBulkOrders.map(
                                                (order) => order.id,
                                              ),
                                            ),
                                          ];

                                          
                                         
                                          
                                        }}
                                        className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white transition hover:bg-indigo-800"
                                      >
                                        Get Available Vendors
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      {vendor?.length > 0 ? (
                                        <div className="space-y-4">
                                          <div>
                                            <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                              Select Vendor
                                            </label>

                                            <select
                                              value={assignmentState}
                                              onChange={(e) =>
                                                setAssignmentState(
                                                  e.target.value,
                                                )
                                              }
                                              className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
                                            >
                                              <option value="">
                                                Select Vendor for Bulk
                                                Assignment
                                              </option>

                                              {vendor.map((vendorItem) => (
                                                <option
                                                  key={vendorItem.vendor_id}
                                                  value={vendorItem.vendor_id}
                                                >
                                                  {vendorItem.vendor_id} :{" "}
                                                  {vendorItem.vendor_name}
                                                </option>
                                              ))}
                                            </select>
                                          </div>

                                          <div className="flex items-center justify-between rounded-sm border border-blue-100 bg-blue-50/50 px-3 py-2.5 dark:border-blue-500/20 dark:bg-blue-500/5">
                                            <div>
                                              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                                Selected Orders
                                              </p>

                                              <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                                                Selected vendor will be mapped
                                                to all orders.
                                              </p>
                                            </div>

                                            <span className="rounded-full bg-[#0446DB]/10 px-2.5 py-1 text-xs font-semibold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                                              {selectedBulkOrders?.length || 0}
                                            </span>
                                          </div>

                                          <div className="flex justify-end border-t border-neutral-100 pt-4 dark:border-neutral-800">
                                            <button
                                              type="button"
                                              onClick={async () => {
                                                if (!assignmentState) {
                                                  toast.warn(
                                                    "Please select a vendor",
                                                  );
                                                  return;
                                                }

                                                const order_ids =
                                                  selectedBulkOrders.map(
                                                    (order) => order.id,
                                                  );

                                                await assignBulkOrderVendor(
                                                  order_ids,
                                                  assignmentState,
                                                );

                                                setSelectedBulkOrders([]);
                                                setBulkOrderWeight(0);
                                                setFetchBulkAssignmentVendor(
                                                  false,
                                                );
                                                setAssignmentState("");
                                              }}
                                              className="h-9 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-indigo-800"
                                            >
                                              Map Vendor
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="space-y-4">
                                          <div className="rounded-sm border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
                                            <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                                              No Vendor Available
                                            </p>

                                            <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                                              No eligible vendor was found for
                                              the selected orders.
                                            </p>
                                          </div>

                                          <div className="flex justify-end">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                if (
                                                  !selectedBulkOrders ||
                                                  selectedBulkOrders.length ===
                                                    0
                                                ) {
                                                  toast.warn(
                                                    "Please select at least one order",
                                                  );
                                                  return;
                                                }

                                                const order_ids = [
                                                  ...new Set(
                                                    selectedBulkOrders.map(
                                                      (order) => order.id,
                                                    ),
                                                  ),
                                                ];

                                                setFetchBulkAssignmentVendor(
                                                  true,
                                                );
                                                
                                                
                                              }}
                                              className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white transition hover:bg-indigo-800"
                                            >
                                              Get Available Vendors
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>

                                )
                              }


                              <div className="mt-4 flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                    Clear Selection
                                  </p>

                                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                    Remove all selected orders from bulk action.
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  className="h-10 w-full shrink-0 cursor-pointer rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10 sm:w-auto"
                                  onClick={() => {
                                    setSelectedBulkOrders([]);
                                    clearAllState();
                                  }}
                                >
                                  Clear Selected Orders
                                </button>
                              </div>
                            </div>

                            <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 mb-1 mr-1  dark:border-neutral-800 dark:bg-neutral-950/30">
                              <AlertDialogCancel
                                onClick={() => {
                                  clearAll();
                                  clearAllState();
                                }}
                                className="cursor-pointer rounded-sm"
                              >
                                Close
                              </AlertDialogCancel>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                </div>
              </div>
              <div className="min-h-0 min-w-0 flex-1 overflow-auto overscroll-contain bg-[#f5f8fb] dark:bg-neutral-900/50">
                <div className="mx-0 z-10 md:px-1  md:-mt-0  dark:bg-neutral-900/50 rounded-sm">
                  {/* Bulk Assignment */}
                </div>
                <table className="w-full min-w-max border-separate border-spacing-0 text-sm">
                  <thead className="bg-gray-100 dark:bg-neutral-800">
                    <tr>
                      {selectedStatus === "booked" ||
                      selectedStatus === "pending pickup" ||
                      selectedStatus === "rto in transit" ||
                      selectedStatus === "picked" ||
                      selectedStatus === "in transit" ||
                      selectedStatus === "undelivered" ||
                      selectedStatus === "undelivered assigned" ||
                      selectedStatus === "rto out for delivery" ||
                      selectedStatus === "rto undelivered" ||
                      selectedStatus === "out for delivery" ? (
                        <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap  px-2 font-semibold py-3">
                          <div>
                            <span>
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-indigo-600 text-center rounded border-gray-300"
                                checked={
                                  selectedBulkOrders.length ===
                                  orders.filter(
                                    (o) =>
                                      o.tpc_awb_number === null &&
                                      o.rider_preference === "daakit",
                                  ).length
                                }
                                onChange={toggleSelectAll}
                              />
                            </span>
                          </div>
                        </th>
                      ) : (
                        <>
                          <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap text-center  font-semibold py-3">
                            -
                          </th>
                        </>
                      )}

                      <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap text-left  font-semibold py-3">
                        ORDER
                      </th>
                      <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap text-left uppercase  font-semibold py-3">
                        Seller Details
                      </th>

                      {(selectedStatus === "pending pickup" ||
                        selectedStatus === "out for delivery" ||
                        selectedStatus === "delivered" ||
                        selectedStatus === "picked" ||
                        selectedStatus === "in transit" ||
                        selectedStatus === "undelivered assigned") && (
                        <>
                          <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap text-left  font-semibold py-3">
                            RIDER ID/VENDOR ID
                          </th>
                        </>
                      )}

                      <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap text-left  font-semibold py-3">
                        CONSIGNEE ADDRESS
                      </th>
                      <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap text-left  font-semibold py-3">
                        PACKAGE DETAILS
                      </th>

                      <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap text-center px-2 font-semibold py-3">MAPPED/VENDOR</th> */}
                      <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap text-left  font-semibold py-3">
                        STATUS
                      </th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={10} className="text-center py-10">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                          <p className="mt-2">Loading orders...</p>
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center py-10">
                          No orders found
                        </td>
                      </tr>
                    ) : (
                      orders?.map((order) => {
                        let isSelected;
                        if (selectedStatus === "booked") {
                          isSelected = selectedBulkOrders.some(
                            (o) => o.id === order.id,
                          );
                        } else if (selectedStatus === "pending pickup") {
                          isSelected = selectedBulkOrders.some(
                            (o) => o.id === order.id,
                          );
                        } else if (selectedStatus === "rto in transit") {
                          isSelected = selectedBulkOrders.some(
                            (o) => o.id === order.id,
                          );
                        }

                        return (
                          <tr
                            key={order.id}
                            className="hover:bg-gray-50 text-left  dark:hover:bg-gray-800 border-b"
                          >
                            {/* Select */}
                            {(selectedStatus === "booked" &&
                              order?.rider_preference == "daakit" &&
                              order.tpc_awb_number == null) ||
                            (selectedStatus === "pending pickup" &&
                              order?.rider_preference == "daakit" &&
                              order.tpc_awb_number == null) ? (
                              <td className="py-2 text-center">
                                {(() => {
                                  const currentIsMapped =
                                    order?.mapped_with !== null &&
                                    order?.mapped_with !== undefined;

                                  const firstSelectedIsMapped =
                                    selectedBulkOrders.length > 0
                                      ? selectedBulkOrders[0]?.mapped_with !==
                                          null &&
                                        selectedBulkOrders[0]?.mapped_with !==
                                          undefined
                                      : null;

                                  const isDifferentMappingType =
                                    selectedStatus === "pending pickup" &&
                                    selectedBulkOrders.length > 0 &&
                                    firstSelectedIsMapped !== currentIsMapped;

                                  if (isDifferentMappingType) {
                                    return (
                                      <span
                                        className="text-sm font-medium text-gray-400 dark:text-gray-500"
                                        title={
                                          firstSelectedIsMapped
                                            ? "Only mapped orders can be selected"
                                            : "Only unmapped orders can be selected"
                                        }
                                      >
                                        --
                                      </span>
                                    );
                                  }

                                  return (
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) => {
                                        const isChecked = e.target.checked;

                                        if (
                                          selectedStatus === "booked" ||
                                          selectedStatus === "pending pickup"
                                        ) {
                                          if (isChecked) {
                                            if (
                                              selectedStatus ===
                                                "pending pickup" &&
                                              selectedBulkOrders.length > 0
                                            ) {
                                              const firstIsMapped =
                                                selectedBulkOrders[0]
                                                  ?.mapped_with !== null &&
                                                selectedBulkOrders[0]
                                                  ?.mapped_with !== undefined;

                                              const thisIsMapped =
                                                order?.mapped_with !== null &&
                                                order?.mapped_with !==
                                                  undefined;

                                              if (
                                                firstIsMapped !== thisIsMapped
                                              ) {
                                                return;
                                              }
                                            }

                                            setSelectedBulkOrders((prev) => {
                                              const alreadySelected = prev.some(
                                                (o) => o.id === order.id,
                                              );

                                              if (alreadySelected) {
                                                return prev;
                                              }

                                              const updated = [...prev, order];

                                              return updated;
                                            });

                                            setBulkOrderWeight(
                                              (prev) =>
                                                Number(prev) +
                                                Number(
                                                  order?.total_weight || 0,
                                                ),
                                            );
                                          } else {
                                            setSelectedBulkOrders((prev) => {
                                              const updated = prev.filter(
                                                (o) => o.id !== order.id,
                                              );

                                              const order_ids = updated.map(
                                                (o) => o.id,
                                              );

                                              // Booked ka existing logic
                                              
                                              

                                              return updated;
                                            });

                                            setBulkOrderWeight((prev) =>
                                              Math.max(
                                                0,
                                                Number(prev) -
                                                  Number(
                                                    order?.total_weight || 0,
                                                  ),
                                              ),
                                            );
                                          }
                                        }
                                      }}
                                      className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
                                    />
                                  );
                                })()}
                              </td>
                            ) : selectedStatus === "picked" &&
                              order?.pickup_stage === "at_central_hub" &&
                              order?.rider_preference == "daakit" ? (
                              <td className="px-6 py-4 text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedBulkOrders.some(
                                    (item) => item.id === order.id,
                                  )}
                                  onChange={(e) =>
                                    handleBulkOrderSelect(
                                      order,
                                      e.target.checked,
                                    )
                                  }
                                  className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
                                />
                              </td>
                            ) : selectedStatus === "rto in transit" &&
                              order?.rider_preference == "daakit" ? (
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
                                            const order_ids = updated.map(
                                              (o) => o.id,
                                            );
                                            return updated;
                                          });

                                          setBulkOrderWeight(
                                            (prev) =>
                                              Number(prev) +
                                              Number(order.total_weight),
                                          );
                                        } else {
                                          setSelectedBulkOrders((prev) => {
                                            const updated = prev.filter(
                                              (o) => o.id !== order.id,
                                            );
                                            const order_ids = updated.map(
                                              (o) => o.id,
                                            );
                                            return updated;
                                          });

                                          setBulkOrderWeight(
                                            (prev) =>
                                              Number(prev) -
                                              Number(order.total_weight), // ✅ fixed bug
                                          );
                                        }
                                      }
                                    }}
                                    className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
                                  />
                                </td>
                              </>
                            ) : [
                                "in transit",
                                "out for delivery",
                                "undelivered",
                                "rto out for delivery",
                                "undelivered assigned",
                                "rto undelivered",
                              ].includes(selectedStatus) &&
                              order?.rider_preference == "daakit" ? (
                              <>
                                <td className="px-6 py-4 text-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedBulkOrders.some(
                                      (item) => item.id === order.id,
                                    )}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;

                                      if (selectedStatus == "picked") {
                                        if (
                                          order.pickup_stage !== null &&
                                          order.pickup_stage !== "at_vendor"
                                        ) {
                                          toast.error(
                                            'Pickup stage must be empty or "at_vendor" before marking the order in transit',
                                          );

                                          return;
                                        }
                                      }

                                      if (isChecked) {
                                        setSelectedBulkOrders((prev) => {
                                          const updated = [...prev, order];
                                          const order_ids = updated.map((o) => {
                                            return o.id;
                                          });
                                          return updated;
                                        });

                                        setBulkOrderWeight(
                                          (prev) =>
                                            Number(prev) +
                                            Number(order.total_weight),
                                        );
                                      } else {
                                        setSelectedBulkOrders((prev) => {
                                          const updated = prev.filter(
                                            (o) => o.id !== order.id,
                                          );
                                          const order_ids = updated.map(
                                            (o) => o.id,
                                          );
                                          return updated;
                                        });

                                        setBulkOrderWeight(
                                          (prev) =>
                                            Number(prev) -
                                            Number(order.total_weight), // ✅ fixed bug
                                        );
                                      }
                                    }}
                                    className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
                                  />
                                </td>
                              </>
                            ) : canMarkInTransit &&
                              selectedStatus == "picked" &&
                              order?.rider_preference == "daakit" ? (
                              <>
                                <td className="px-6 py-4 text-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedBulkOrders.some(
                                      (item) => item.id === order.id,
                                    )}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;

                                      if (selectedStatus == "picked") {
                                        if (
                                          order.pickup_stage !== null &&
                                          order.pickup_stage !== "at_vendor"
                                        ) {
                                          toast.error(
                                            'Pickup stage must be empty or "at_vendor" before marking the order in transit',
                                          );

                                          return;
                                        }
                                      }

                                      if (isChecked) {
                                        setSelectedBulkOrders((prev) => {
                                          const updated = [...prev, order];
                                          const order_ids = updated.map((o) => {
                                            return o.id;
                                          });
                                          return updated;
                                        });

                                        setBulkOrderWeight(
                                          (prev) =>
                                            Number(prev) +
                                            Number(order.total_weight),
                                        );
                                      } else {
                                        setSelectedBulkOrders((prev) => {
                                          const updated = prev.filter(
                                            (o) => o.id !== order.id,
                                          );
                                          const order_ids = updated.map(
                                            (o) => o.id,
                                          );
                                          return updated;
                                        });

                                        setBulkOrderWeight(
                                          (prev) =>
                                            Number(prev) -
                                            Number(order.total_weight),
                                        );
                                      }
                                    }}
                                    className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
                                  />
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="px-6 py-4 text-center">-</td>
                              </>
                            )}

                            {/* Order ID */}
                            <td className=" py-2 text-left whitespace-pre-line">
                              <p className="text-sm text-gray-500 dark:text-white">
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
                                <span
                                  className={`ml-2 inline-flex mb-1 items-center gap-1.5 rounded-full border border-dashed px-2.5 py-1 text-xs font-semibold ${
                                    order?.rider_preference === "daakit"
                                      ? "border-blue-500 bg-blue-50/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                                      : "border-emerald-500 bg-emerald-50/50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                  }`}
                                >
                                  {order?.rider_preference === "daakit"
                                    ? "DDN"
                                    : "BYOB"}
                                </span>
                              </p>
                              <p className="text-left text-gray-800 flex items-center">
                                <Link
                                target="_blank"
                                  to={`/admin/order-history?awb_number=${encodeURIComponent(order.awb_number)}`}
                                  
                                  rel="noopener noreferrer"
                                  className="underline text-[#0446DB] hover:text-blue-500"
                                >
                                  {order.awb_number}
                                </Link>

                                <button
                                  className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      order.awb_number,
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

                                <Dialog className="w-5xl">
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="text-xs ml-1 font-medium  text-red-600  inline-block cursor-pointer "
                                    >
                                      <span>
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
                                          <strong>Order ID:</strong>{" "}
                                          {order.merchant_order_id}
                                          <button
                                            className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
                                            onClick={() => {
                                              navigator.clipboard.writeText(
                                                order.merchant_order_id,
                                              );
                                              setCopySuccess(
                                                order.merchant_order_id,
                                              );
                                              setTimeout(() => {
                                                setCopySuccess(null);
                                              }, 2000);
                                            }}
                                          >
                                            {copySuccess ===
                                            order.merchant_order_id ? (
                                              <CiCircleCheck />
                                            ) : (
                                              <FaRegCopy />
                                            )}
                                          </button>
                                        </div>
                                        <div>
                                          <strong>AWB No:</strong>{" "}
                                          {order.awb_number}
                                          <button
                                            className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
                                            onClick={() => {
                                              navigator.clipboard.writeText(
                                                order.awb_number,
                                              );
                                              setCopySuccess(order.awb_number);
                                              setTimeout(() => {
                                                setCopySuccess(null);
                                              }, 2000);
                                            }}
                                          >
                                            {copySuccess ===
                                            order.awb_number ? (
                                              <CiCircleCheck />
                                            ) : (
                                              <FaRegCopy />
                                            )}
                                          </button>
                                        </div>
                                        <div>
                                          <strong>Order Type:</strong>{" "}
                                          {order.order_type === "cod"
                                            ? "COD"
                                            : "Prepaid"}
                                        </div>
                                        <div>
                                          <strong>Weight Slab:</strong>{" "}
                                          {order.order_specific}
                                        </div>
                                        <div>
                                          <strong>Order Status:</strong>{" "}
                                          {toCapitalizeEachWord(order.status)}
                                        </div>
                                        <div>
                                          <strong>Total Amount:</strong> ₹
                                          {Number(
                                            order.total_amount,
                                          ).toLocaleString()}
                                        </div>
                                        {/* <div>
                                          <strong>Order Weight:</strong>{" "}
                                          {Number(
                                            order.total_weight,
                                          ).toLocaleString()}
                                          g
                                        </div> */}
                                        <div>
                                          <strong>Charge Weight:</strong>{" "}
                                          {Number(
                                            order.charged_weight,
                                          ).toLocaleString()}
                                          g
                                        </div>
                                        <div>
                                          <strong>Number of Packets:</strong>{" "}
                                          {order.number_of_boxes}
                                        </div>
                                      </div>

                                      <div className="pt-4 border-t">
                                        <div className="flex justify-between items-center mb-2">
                                          <h3 className="font-semibold text-[#0446DB]">
                                            Delivery Details
                                          </h3>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              if (
                                                editingDeliveryId === order.id
                                              ) {
                                                // Save logic here - you'll need to create an API endpoint
                                                handleUpdateDeliveryDetails({
                                                  order_id: order.id,
                                                  delivery_details:
                                                    deliveryFormData,
                                                });
                                              } else {
                                                setEditingDeliveryId(order.id);
                                                setDeliveryFormData({
                                                  delivery_contact_name:
                                                    order.delivery_contact_name,
                                                  delivery_address_line:
                                                    order.delivery_address_line,
                                                  delivery_city:
                                                    order.delivery_city,
                                                  delivery_state:
                                                    order.delivery_state,
                                                  delivery_pincode:
                                                    order.delivery_pincode,
                                                });
                                              }
                                            }}
                                            className="text-xs"
                                          >
                                            {editingDeliveryId === order.id
                                              ? "Save"
                                              : "Edit"}
                                          </Button>
                                        </div>

                                        {editingDeliveryId === order.id ? (
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <label className="block text-xs text-gray-600 mb-1">
                                                Customer Name
                                              </label>
                                              <input
                                                type="text"
                                                value={
                                                  deliveryFormData.delivery_contact_name
                                                }
                                                onChange={(e) =>
                                                  setDeliveryFormData(
                                                    (prev) => ({
                                                      ...prev,
                                                      delivery_contact_name:
                                                        e.target.value,
                                                    }),
                                                  )
                                                }
                                                className="w-full border rounded-md px-2 py-1 text-sm"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-xs text-gray-600 mb-1">
                                                Address
                                              </label>
                                              <input
                                                type="text"
                                                value={
                                                  deliveryFormData.delivery_address_line
                                                }
                                                onChange={(e) =>
                                                  setDeliveryFormData(
                                                    (prev) => ({
                                                      ...prev,
                                                      delivery_address_line:
                                                        e.target.value,
                                                    }),
                                                  )
                                                }
                                                className="w-full border rounded-md px-2 py-1 text-sm"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-xs text-gray-600 mb-1">
                                                City
                                              </label>
                                              <input
                                                type="text"
                                                value={
                                                  deliveryFormData.delivery_city
                                                }
                                                onChange={(e) =>
                                                  setDeliveryFormData(
                                                    (prev) => ({
                                                      ...prev,
                                                      delivery_city:
                                                        e.target.value,
                                                    }),
                                                  )
                                                }
                                                className="w-full border rounded-md px-2 py-1 text-sm"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-xs text-gray-600 mb-1">
                                                State
                                              </label>
                                              <input
                                                type="text"
                                                value={
                                                  deliveryFormData.delivery_state
                                                }
                                                onChange={(e) =>
                                                  setDeliveryFormData(
                                                    (prev) => ({
                                                      ...prev,
                                                      delivery_state:
                                                        e.target.value,
                                                    }),
                                                  )
                                                }
                                                className="w-full border rounded-md px-2 py-1 text-sm"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-xs text-gray-600 mb-1">
                                                Pincode
                                              </label>
                                              <input
                                                type="text"
                                                value={
                                                  deliveryFormData.delivery_pincode
                                                }
                                                onChange={(e) =>
                                                  setDeliveryFormData(
                                                    (prev) => ({
                                                      ...prev,
                                                      delivery_pincode:
                                                        e.target.value,
                                                    }),
                                                  )
                                                }
                                                className="w-full border rounded-md px-2 py-1 text-sm"
                                              />
                                            </div>
                                            <div className="flex items-end">
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                  setEditingDeliveryId(null)
                                                }
                                                className="text-red-500"
                                              >
                                                Cancel
                                              </Button>
                                            </div>
                                          </div>
                                        ) : (
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
                                        )}
                                      </div>

                                      {/* Pickup Details */}
                                      <div className="pt-4 border-t">
                                        <div className="flex justify-between items-center mb-2">
                                          <h3 className="font-semibold text-[#0446DB]">
                                            Pickup Details
                                          </h3>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              if (
                                                editingPickupId === order.id
                                              ) {
                                                // Save logic here
                                                handleUpdateDeliveryDetails({
                                                  order_id: order.id,
                                                  pickup_details:
                                                    pickupFormData,
                                                });
                                              } else {
                                                setEditingPickupId(order.id);
                                                setPickupFormData({
                                                  pickup_contact_name:
                                                    order.pickup_contact_name ||
                                                    "",
                                                  pickup_phone:
                                                    order.pickup_phone || "",
                                                  pickup_address_line:
                                                    order.pickup_address_line ||
                                                    "",
                                                  pickup_city:
                                                    order.pickup_city || "",
                                                  pickup_state:
                                                    order.pickup_state || "",
                                                  pickup_pincode:
                                                    order.pickup_pincode || "",
                                                });
                                              }
                                            }}
                                            className="text-xs"
                                          >
                                            {editingPickupId === order.id
                                              ? "Save"
                                              : "Edit"}
                                          </Button>
                                        </div>

                                        {editingPickupId === order.id ? (
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <label className="block text-xs text-gray-600 mb-1">
                                                Name
                                              </label>
                                              <input
                                                type="text"
                                                value={
                                                  pickupFormData.pickup_contact_name
                                                }
                                                onChange={(e) =>
                                                  setPickupFormData((prev) => ({
                                                    ...prev,
                                                    pickup_contact_name:
                                                      e.target.value,
                                                  }))
                                                }
                                                className="w-full border rounded-md px-2 py-1 text-sm"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-xs text-gray-600 mb-1">
                                                Phone No
                                              </label>
                                              <input
                                                type="text"
                                                value={
                                                  pickupFormData.pickup_phone
                                                }
                                                onChange={(e) =>
                                                  setPickupFormData((prev) => ({
                                                    ...prev,
                                                    pickup_phone:
                                                      e.target.value,
                                                  }))
                                                }
                                                className="w-full border rounded-md px-2 py-1 text-sm"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-xs text-gray-600 mb-1">
                                                Address
                                              </label>
                                              <input
                                                type="text"
                                                value={
                                                  pickupFormData.pickup_address_line
                                                }
                                                onChange={(e) =>
                                                  setPickupFormData((prev) => ({
                                                    ...prev,
                                                    pickup_address_line:
                                                      e.target.value,
                                                  }))
                                                }
                                                className="w-full border rounded-md px-2 py-1 text-sm"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-xs text-gray-600 mb-1">
                                                City
                                              </label>
                                              <input
                                                type="text"
                                                value={
                                                  pickupFormData.pickup_city
                                                }
                                                onChange={(e) =>
                                                  setPickupFormData((prev) => ({
                                                    ...prev,
                                                    pickup_city: e.target.value,
                                                  }))
                                                }
                                                className="w-full border rounded-md px-2 py-1 text-sm"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-xs text-gray-600 mb-1">
                                                State
                                              </label>
                                              <input
                                                type="text"
                                                value={
                                                  pickupFormData.pickup_state
                                                }
                                                onChange={(e) =>
                                                  setPickupFormData((prev) => ({
                                                    ...prev,
                                                    pickup_state:
                                                      e.target.value,
                                                  }))
                                                }
                                                className="w-full border rounded-md px-2 py-1 text-sm"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-xs text-gray-600 mb-1">
                                                Pincode
                                              </label>
                                              <input
                                                type="text"
                                                value={
                                                  pickupFormData.pickup_pincode
                                                }
                                                onChange={(e) =>
                                                  setPickupFormData((prev) => ({
                                                    ...prev,
                                                    pickup_pincode:
                                                      e.target.value,
                                                  }))
                                                }
                                                className="w-full border rounded-md px-2 py-1 text-sm"
                                              />
                                            </div>
                                            <div className="flex items-end">
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                  setEditingPickupId(null)
                                                }
                                                className="text-red-500"
                                              >
                                                Cancel
                                              </Button>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <strong>Name:</strong>{" "}
                                              {order.pickup_contact_name ||
                                                "N/A"}
                                            </div>
                                            <div>
                                              <strong>Pickup Phone No:</strong>{" "}
                                              {`${order.pickup_phone}` || "N/A"}
                                            </div>
                                            <div>
                                              <strong>Address:</strong>{" "}
                                              {order.pickup_address_line ||
                                                "N/A"}
                                            </div>
                                            <div>
                                              <strong>City:</strong>{" "}
                                              {`${order.pickup_city}, ${order.pickup_state} - ${order.pickup_pincode}` ||
                                                "N/A"}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <DialogFooter>
                                      <DialogClose asChild>
                                        <button
                                          onClick={() => {
                                            navigate(
                                              `/admin/order-history?awb_number=${order?.awb_number}`,
                                            );
                                          }}
                                          className="bg-green-500 mr-2 text-white px-4 py-2 rounded hover:bg-indigo-800 transition"
                                        >
                                          Get History
                                        </button>
                                      </DialogClose>
                                      <DialogClose asChild>
                                        <Button
                                          onClick={() => {
                                            clearAllState();
                                          }}
                                          variant="outline"
                                        >
                                          Cancel
                                        </Button>
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
                                        order.tpc_awb_number,
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

                              <p className="text-sm whitespace-nowrap text-gray-400 dark:text-white">
                                MOID:{" "}
                                {order.merchant_order_id?.length <= 20
                                  ? order.merchant_order_id
                                  : `${order.merchant_order_id.slice(
                                      0,
                                      16,
                                    )}...`}
                                <button
                                  className="pl-2 text-lg text-gray-600 dark:text-white hover:text-[#0446DB] transition"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      order.merchant_order_id,
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
                              </p>
                            </td>

                            {/* SELLER DETAILS */}
                            <td className=" py-2">
                              <div className="flex flex-col  text-sm">
                                <p className="text-gray-700 dark:text-gray-300">
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    Merchant ID:
                                  </span>{" "}
                                  {order?.merchant_id ?? "N/A"}
                                </p>
                                

                                {order?.brand_name && (
                                  <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-medium text-gray-900 dark:text-white">
                                      Brand Name:
                                    </span>{" "}
                                    {order?.brand_name}
                                  </p>
                                )}
                              

                                {order?.merchant_company_name && (
                                  <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-medium text-gray-900 dark:text-white">
                                      Company Name:
                                    </span>{" "}
                                    {order.merchant_company_name}
                                  </p>
                                )}
                                
                              </div>
                            </td>

                            {(selectedStatus === "pending pickup" ||
                              selectedStatus === "out for delivery" ||
                              selectedStatus === "delivered" ||
                              selectedStatus === "undelivered" ||
                              selectedStatus === "picked" ||
                              selectedStatus === "in transit" ||
                              selectedStatus === "undelivered assigned") && (
                              <>
                                <td className="text-left ">
                                  {order.mapped_dc_id !== null ? (
                                    <>DC_{order.mapped_dc_id}</>
                                  ) : order.rider_vendor_id === null &&
                                    order.rider_merchant_id === null &&
                                    order.mapped_with === null ? (
                                    <>
                                      {order.rider_id !== null ? "DKT_" : ""}
                                      {order.rider_id}
                                    </>
                                  ) : (
                                    <>
                                      {order.rider_id !== null
                                        ? `FP_${order.rider_vendor_id}_`
                                        : order.rider_merchant_id
                                          ? `M${order.rider_merchant_id}_R`
                                          : order.mapped_with
                                            ? `FP_${order.mapped_with}`
                                            : "DKT_"}

                                      {order.rider_id}
                                    </>
                                  )}

                                  {( ['in transit','out for delivery','delivered','pending pickup','undelivered assigned',''].includes(selectedStatus) || selectedStatus === "picked" || selectedStatus == "undelivered") && (
                                    <p>
                                      {order.pickup_stage === "at_central_hub"
                                        ? "At Central Hub"
                                        : order.pickup_stage === "at_dc" ? "At DC" : order.pickup_stage == "at_vendor"  ? "At Vendor Hub" : "-"}
                                    </p>
                                  )}

                                 
                                </td>
                              </>
                            )}

                            {/* Address */}
                            <td className=" py-2 whitespace-pre-line">
                              <p className="font-medium text-gray-800 dark:text-white">
                                {order.delivery_contact_name}
                              </p>
                              <HoverCard>
                                <HoverCardTrigger>
                                  {order.delivery_address_line.slice(0, 40)}
                                  ...
                                </HoverCardTrigger>
                                <HoverCardContent className="bg-[#0446DB] text-white">
                                  {order.delivery_address_line},{" "}
                                  {order.delivery_city}, {order.delivery_state}{" "}
                                  - {order.delivery_pincode}
                                </HoverCardContent>
                              </HoverCard>
                              <p className="text-xs text-gray-500 dark:text-white">
                                {order.delivery_city}, {order.delivery_state} -{" "}  {order.delivery_pincode}, {" "}
                               

                                {order.delivery_country}
                              
                              </p>

                            </td>

                            {/* Package Details */}
                            <td className=" py-2">
                              <p>
                                {selectedStatus !== "cancelled" && (
                                  <span className=" whitespace-nowrap dark:text-white">
                                    EDD: {order.EDD}
                                  </span>
                                )}
                              </p>
                              <p>
                                <span className="font-medium text-gray-800 dark:text-white">
                                  Weight Slab:
                                </span>
                                {selectedStatus !== "cancelled" && (
                                  <span
                                    className={`ml-2 px-2 py-0.5 rounded-full text-sm font-semibold shadow-sm ${
                                      order?.order_specific === "NDD"
                                        ? "text-green-800 bg-green-100 border border-green-300"
                                        : order?.order_specific === "SDD"
                                          ? "text-yellow-800 bg-yellow-100 border border-yellow-300"
                                          : order?.order_specific === "HLD"
                                            ? "text-red-800 bg-red-100 border border-red-300 animate-blink"
                                            : "text-gray-800 bg-gray-100 border border-gray-300"
                                    }`}
                                  >
                                    {order?.order_specific || "N/A"}
                                  </span>
                                )}
                              </p>
                              {order?.order_type && (
                                  <p className="flex flex-wrap mt-1 items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <span className="font-medium text-gray-900 dark:text-white">
                                      Payment Details:
                                    </span>

                                    <span
                                      className={`inline-flex items-center gap-2  text-xs font-bold ${
                                        order.order_type.toUpperCase() === "COD"
                                          ? " text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300"
                                          : order.order_type.toUpperCase() === "PREPAID"
                                            ? " text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                            : "border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                      }`}
                                    >
                                      

                                      <span className="font-extrabold">
                                        {Number(order.total_amount || 0).toLocaleString("en-IN", {
                                          style: "currency",
                                          currency: "INR",
                                          maximumFractionDigits: 2,
                                        })}
                                      </span>

                                      <span className="opacity-40">|</span>

                                      {order.order_type.toUpperCase() === "COD"
                                        ? "COD"
                                        : order.order_type.toUpperCase() === "PREPAID"
                                          ? "Prepaid"
                                          : order.order_type}
                                    </span>
                                  </p>
                                )}
                                
                              <p>
                                <span className="font-medium dark:text-white text-gray-800">
                                  Dimensions:
                                </span>{" "}
                                <span className=" dark:text-white">
                                  {order.package_length}x{order.package_breadth}
                                  x{order.package_height}
                                </span>
                              </p>
                            </td>

                            

                            {/* Status */}
                            {selectedStatus === "All" ? (
                              <>
                                {/* only view ststus */}
                                <td className=" py-2 text-center">
                                  {order.status === "cancelled" ||
                                  order.status === "undelivered" ||
                                  order.status === "delivered" ||
                                  order.status === "ndr" ||
                                  order.status === "rto delivered" ? (
                                    <span
                                      className={`px-3 py-1 rounded-full whitespace-nowrap text-xs font-semibold inline-block ${
                                        order.status === "cancelled"
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
                                    <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-semibold inline-block bg-blue-100 text-blue-600">
                                      {order.status === "rto in transit"
                                        ? "RTO In Transit"
                                        : toCapitalizeEachWord(order.status)}
                                    </span>
                                  )}
                                </td>
                              </>
                            ) : (
                              <>
                                <td className=" py-2 text-left">
                                  {order.status === "cancelled" ||
                                  // order.status === "undelivered" ||
                                  order.status === "delivered" ||
                                  order.status === "ndr" ||
                                  order.status === "rto delivered" ? (
                                    <span
                                      className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                                        order.status === "cancelled"
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
                                      {editingStatusId === order.id ? (
                                        <form
                                          onSubmit={async (e) => {
                                            e.preventDefault();

                                            const newStatus =
                                              e.target.elements.status.value;

                                            

                                            

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
                                                setAssignmentState(
                                                  e.target.value,
                                                );
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
                                                </>
                                              )}
                                              
                                              {order.status ===
                                                "undelivered" && (
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
                                                </>
                                              )}
                                              {order.status ===
                                                "in transit" && (
                                                <>
                                                  
                                                  <option value="lost">
                                                    Mark Lost
                                                  </option>
                                                </>
                                              )}
                                              {order.status ===
                                                "out for delivery" && (
                                                <>
                                                  
                                                  <option value="lost">
                                                    Lost
                                                  </option>
                                                </>
                                              )}

                                              {order.status ==
                                                "rto out for delivery" && (
                                                <>
                                                 
                                                  <option value="ndr">
                                                    NDR
                                                  </option>
                                                </>
                                              )}
                                              {order.status ===
                                                "rto in transit" && (
                                                <>
                                                 
                                                  
                                                  <option value="lost">
                                                    Lost
                                                  </option>
                                                </>
                                              )}
                                              {order.status ===
                                                "rto undelivered" && (
                                                <>
                                                 

                                                  <option value="lost">
                                                    Lost
                                                  </option>
                                                </>
                                              )}
                                              {order.status ===
                                                "undelivered assigned" && (
                                                <>
                                                 
                                                  <option value="lost">
                                                    Mark Lost
                                                  </option>
                                                </>
                                              )}
                                            </select>
                                            
                                            

                                            {assignmentState &&
                                              assignmentState !== "ndr" &&
                                              assignmentState !==
                                                "in transit" &&
                                              assignmentState !==
                                                "undelivered assigned" && (
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
                                                setEditingStatusId(null);
                                                clearAllState();
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
                                              if (
                                                order.rider_preference ===
                                                "self"
                                              ) {
                                                return;
                                              }
                                              if (
                                                order.status == "in transit"
                                              ) {
                                                setEditingStatusId(order.id);
                                                return;
                                              }
                                              if (
                                                order.status ==
                                                "undelivered assigned"
                                              ) {
                                                setEditingStatusId(order.id);
                                                return;
                                              }
                                              if (
                                                order.status ==
                                                  "out for delivery" ||
                                                order.status ==
                                                  "rto out for delivery"
                                              ) {
                                                setEditingStatusId(order.id);
                                                return;
                                              }
                                              if (
                                                (order.status ===
                                                  "undelivered" ||
                                                  order.status === "picked") &&
                                                order.mapped_with &&
                                                (order.pickup_stage === null ||
                                                  order.pickup_stage ===
                                                    "at_vendor")
                                              ) {
                                                const vendor_ids = [
                                                  order?.mapped_with,
                                                ];
                                                fetchRider(vendor_ids);
                                                setEditingStatusId(order.id);
                                                return;
                                              }
                                              if (
                                                order.status ===
                                                  "pending pickup" &&
                                                order.tpc_awb_number !== null
                                              ) {
                                                return;
                                              }
                                              if (
                                                selectedStatus ===
                                                "rto in transit"
                                              ) {
                                                setEditingStatusId(order.id);
                                                return;
                                              }

                                              if (
                                                selectedStatus ===
                                                  "rto in transit" ||
                                                selectedStatus ==
                                                  "rto undelivered"
                                              ) {
                                                setEditingStatusId(order.id);
                                                return;
                                              }
                                              if (
                                                order.tpc_awb_number !== null
                                              ) {
                                                return;
                                              }
                                              if (
                                                order.rider_preference ===
                                                "daakit"
                                              ) {
                                                if (
                                                  order.mapped_with !== null
                                                ) {
                                                  return;
                                                } else if (
                                                  order.status === "booked"
                                                ) {
                                                  setEditingStatusId(order.id);
                                                }
                                                // setEditingStatusId(order.id)
                                              }
                                            }}
                                            className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-semibold inline-block bg-blue-100 text-blue-600 cursor-pointer"
                                          >
                                            {order.status === "rto in transit"
                                              ? `RTO In Transit`
                                              : toCapitalizeEachWord(
                                                  order.status,
                                                )}
                                          </span>
                                        </>
                                      )}
                                    </>
                                  )}
                                </td>
                              </>
                            )}
                           
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages  && (
                <div className="sticky bottom-0  flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-gray-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
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
                      onClick={() =>
                        setPage((prev) => Math.min(prev + 1, totalPages))
                      }
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

            {/* Table */}
          </div>
        </>
      )}
    </>
  );
}
export default OrderDetails;
