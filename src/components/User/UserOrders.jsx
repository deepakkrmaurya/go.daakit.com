
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
import { FaFileExport, FaFilter, FaSearch, FaTasks } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { toast } from "react-toastify";
import { Link, Navigate, useNavigate, useNavigation } from "react-router-dom";
import { ArrowRight, Building2, CheckCircle2, ChevronDown, Loader2, Users } from "lucide-react";

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
import AxiosInstance from "../../Helper/axiosInstance";
import CustomButton from "../common/CustomButton";
const baseURL = import.meta.env.VITE_BASE_URL;
const frontEndURL = import.meta.env.VITE_FRONTEND_URL;


function UserOrderDetails() {
  const [bulkCancelRemark, setBulkCancelRemark] = useState("");
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



    const [ndrstatus, setNdrStatus] = useState("");
  const [ndrDialogOpen, setNdrDialogOpen] = useState(false);
  const [ndrReason, setNdrReason] = useState("");
  const [ndrRemarks, setNdrRemarks] = useState("");
  const [ndrLoading, setNdrLoading] = useState(false);
  const handleStatusChange = (e) => {
    const value = e.target.value;
     console.log(value)
    if (value === "rto undelivered") {
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


 const handleUpdateDeliveryDetails = async (data) => {
    try {
        
      const res = await axios.post(
        `${baseURL}/api/user/updateOrderDetails`,
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
    // "undelivered",
    // "undelivered assigned",
    // "cancelled",
    // "rto in transit",
    // "rto delivered",
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
       localStorage.setItem('permission',JSON.stringify(permission))
       console.log(permission)
      setPermissions(permission)
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

  

  const [generatingLabels, setGeneratingLabels] = useState(false);

const generateBulkLabelRequest = async (awbs) => {
  if (!awbs.length) {
    toast.warn("Please select at least one order");
    return false;
  }

  try {
    setGeneratingLabels(true);

    const response = await AxiosInstance.post(
      "/api/label/usergeneratelabel",
{ awbs: awbs });

    if (response?.data?.pdf_link) {
            window.open(response?.data?.pdf_link, "_blank");
            toast.success("Shipping label(s) generated successfully");
          }

    toast.success("Labels generated successfully");

    return true;
  } catch (error) {
    let message = "Failed to generate labels";

    if (error.response?.data instanceof Blob) {
      try {
        const result = JSON.parse(await error.response.data.text());
        message = result.message || message;
      } catch {
        // Keep fallback message
      }
    } else {
      message = error.response?.data?.message || error.message || message;
    }

    toast.error(message);

    return false;
  } finally {
    setGeneratingLabels(false);
  }
};

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
      // if (res?.data?.data?.data.length == 0) {
      //   setSelectedBulkOrders([]);
      //   setBulkOrderWeight(0);
      //   setFetchBulkAssignmentRider(false);
      //   setFetchBulkAssignmentVendor(false);
      //   setcanceledBulkOrder(false)
      // }
    } catch (err) {
      // toast.error(err.response?.data?.message || err.message || "Failed to load riders");
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

  const changeStatus = async ({id, newStatus,remark,detailed_remarks=""}) => {

    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/api/user/updateOrderStatus/${id}`,
        { status: newStatus,
          remarks:remark ? remark:" ",
          detailed_remarks:detailed_remarks || ""
         },
        
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

  const clearAllState = () => {
  setSelectedBulkOrders([]);
  setBulkOrderWeight(0);

  setAssignmentState("");

  setFetchBulkAssignmentRider(false);
  setFetchBulkAssignmentVendor(false);

  setcanceledBulkOrder(false);
  setSelectedMapType(null);

  setVendor([]);
  setRiders([]);

  setEditingStatusId(null);
  setPopup(null);
  
  setSelectedBulkOrders([]);
setBulkStatusState("");
setNdrLoading(false)
setNdrRemarks("")
setNdrReason("")
setNdrDialogOpen(false)
setNdrStatus("")
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



const generateBulkPickupRequest = async (order_ids) => {
  if (!order_ids?.length) {
    toast.warn("Please select at least one order");
    return;
  }

  try {
    setLoading(true);

    const res = await AxiosInstance.post(
      "/api/user/generateBulkPickupRequest",
      {
        order_ids,
      }
    );

    toast.success(
      res?.data?.message || "Pickup scheduled successfully"
    );

    clearAllState();
    await fetchOrders();
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to schedule pickup"
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
          AxiosInstance.post(`/api/dc/user/cancelOrderMapping/${id}`, {}),
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









  useEffect(() => {
    resetAdvanceFilters();
    getUserPermissions()
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

      <div className="dark:bg-neutral-900 h-[calc(100dvh-90px)] min-h-[420px] w-full flex flex-col overflow-hidden">

        <div className="py-2 shrink-0">
          <div className="  mx-auto   ">
            
            <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
  {/* Heading */}
  <div className="shrink-0">
    <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
      Order Details
    </h1>
  </div>

  {/* Search */}
  <div className="w-full xl:max-w-xl xl:flex-1 xl:px-6">
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
        className="h-10 min-w-0 flex-1 rounded-l-lg border border-gray-300 bg-white px-3 text-sm text-black outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white sm:px-4"
      />

      <button
        type="submit"
        className="flex h-10 shrink-0 items-center justify-center rounded-r-lg border border-l-0 border-gray-300 bg-white px-4 text-gray-600 transition hover:bg-blue-50 hover:text-[#0446DB] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
      >
        <FaSearch />
      </button>
    </form>
  </div>

  {/* Actions */}
  <div className="grid  grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center xl:w-auto xl:flex-nowrap">
    {(permissions?.includes("VIEW_ASSN_CON") ||
      permissions?.includes("ADMIN_FULL_ACCESS")) && (
      <Link
  to="/user/assignemt/console"
  className="col-span-2 sm:col-span-1"
>
  {/* <CustomButton
    variant="primary"
    size="md"
    icon={ArrowRight}
    className="w-full flex  whitespace-nowrap"
  >
    <span className="whitespace-nowrap text-sm font-semibold">
      Assignment Console
    </span>

    
  </CustomButton> */}
</Link>
    )}

    {(permissions?.includes("ODR_EXPORT") ||
      permissions?.includes("ADMIN_FULL_ACCESS")) && (
     <CustomButton
     icon={FaFileExport}
  variant="outline"
  size="md"
  onClick={exportCSV}
  className=""
>
  
  <span>Export</span>
</CustomButton>
    )}

              <Drawer
            direction="right"
            open={isFilterOpen}
            onOpenChange={setIsFilterOpen}
          >
            <DrawerTrigger asChild>
              <DrawerTrigger asChild>
  <CustomButton
    variant="outline"
    size="md"
    icon={FaFilter}
    className=" rounded-sm"
  >
   
    <span>Filter</span>
  </CustomButton>
</DrawerTrigger>
            </DrawerTrigger>

            <DrawerContent className="ml-auto h-full w-full max-w-md rounded-none border-l border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
              {/* Header */}
              <DrawerHeader className="border-b border-neutral-200 px-5 py-4 text-left dark:border-neutral-800">
                <DrawerTitle className="flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                    <FaFilter className="text-sm" />
                  </span>
                  Filter Orders
                </DrawerTitle>

                <DrawerDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                  Apply filters to find specific orders.
                </DrawerDescription>
              </DrawerHeader>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-5 py-5">
                <form
                  id="order-filter-form"
                  onSubmit={(e) => {
                    e.preventDefault();

                    setPage(1);
                    setFilterUpdate((prev) => !prev);
                    setIsFilterOpen(false);
                  }}
                  className="space-y-5"
                >
                  {/* Date Range */}
                  <div>
                    <div className="mb-3">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Date Range
                      </h3>
                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                        Filter orders by created date.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {/* Start Date */}
                      <div>
                        <label
                          htmlFor="start-date"
                          className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                        >
                          Start Date
                        </label>

                        <input
                          id="start-date"
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
                          className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                        />
                      </div>

                      {/* End Date */}
                      <div>
                        <label
                          htmlFor="end-date"
                          className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                        >
                          End Date
                        </label>

                        <input
                          id="end-date"
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
                          className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-neutral-100 dark:bg-neutral-800" />

                  {/* Order Details */}
                  <div>
                    <div className="mb-3">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Order Details
                      </h3>
                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                        Search using order and shipment information.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {/* Order Specific */}
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                          Order Specific
                        </label>

                        <select
                          value={advanceFilters.order_specific}
                          onChange={(e) =>
                            setAdvanceFilters((prev) => ({
                              ...prev,
                              order_specific: e.target.value,
                            }))
                          }
                          className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                        >
                          <option value="">All Orders</option>
                          <option value="HLD">HLD</option>
                          <option value="SDD">Same Day Delivery</option>
                          <option value="NDD">Next Day Delivery</option>
                        </select>
                      </div>

                      {/* AWB */}
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
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
                          placeholder="Enter AWB number"
                          className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                        />
                      </div>

                      {/* Merchant ID */}
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
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
                          placeholder="Enter merchant ID"
                          className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                        />
                      </div>

                      {/* City */}
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
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
                          placeholder="Enter city"
                          className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                        />
                      </div>

                      {/* Vendor ID */}
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
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
                          placeholder="Enter vendor ID"
                          className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                        />
                      </div>

                      {/* Pincode */}
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
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
                          placeholder="Enter pincode"
                          className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                        />
                      </div>

                      {/* Rider ID */}
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
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
                          placeholder="Enter rider ID"
                          className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <DrawerFooter className="border-t border-neutral-200 bg-neutral-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/80">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      await resetAdvanceFilters();
                      setPage(1);
                      setFilterUpdate((prev) => !prev);
                      setIsFilterOpen(false);
                    }}
                    className="h-10 cursor-pointer rounded-sm border-neutral-300 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
                  >
                    Reset
                  </Button>

                  <Button
                    type="submit"
                    form="order-filter-form"
                    className="h-10 cursor-pointer gap-2 rounded-sm bg-[#0446DB] text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <FaFilter className="text-xs" />
                    Apply Filter
                  </Button>
                </div>

                <DrawerClose asChild>
                  <Button
                    variant="ghost"
                    className="mt-1 h-9 cursor-pointer rounded-sm text-sm text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  >
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
            </div>
          </div>
          </div>
        </div>

        <div className="mx-0 z-10 dark:bg-neutral-900 rounded-sm flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="w-full  dark:bg-neutral-800 left-0  z-40 shrink-0">
            <div className="relative flex justify-left ">
              <div className=" flex  overflow-x-auto  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2">
                <div className="flex gap-1 min-w-max  mt-3">
                  {status.map((st) => (
                    <Button
                      key={st}
                      onClick={() => {
                        setSelectedBulkOrders([]);
                        setSelectedStatus(st);
                        setPage(1);
                      }}

                      className={`px-2 py-2.5 rounded-sm my-2 border transition-all duration-300 font-medium text-sm tracking-wide ${selectedStatus === st
                        ? "bg-[#0446DB] text-white"
                        : " bg-white text-gray-700 border-gray-200 hover:bg-[#0446DB] hover:text-white hover:border-gray-300 hover:shadow-md hover:scale-[1.02]"
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
          </div>

          {/* Bulk Assignment */}
           <div className="shrink-0">



              {selectedBulkOrders.length > 0 && selectedStatus === "booked" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="my-2 h-8 py-2 cursor-pointer rounded-sm border-[#0446DB] bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-blue-50 hover:text-[#0446DB] dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10"
                >
                  Action
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
                    selected booked orders.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {/* Content */}
                <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5">

                   {/* ================= SCHEDULE PICKUP ================= */}
                  {
                    (permissions.includes("UPDATE_STATUS") ||
                    permissions.includes("ADMIN_FULL_ACCESS")) && (

                  <div className="overflow-hidden rounded-sm border border-emerald-200 dark:border-emerald-500/20">
                    <div className="border-b border-emerald-100 bg-emerald-50/70 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Schedule Self Pickup
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
                            ...new Set(
                              selectedBulkOrders.map((order) => order.id)
                            ),
                          ];

                          await generateBulkPickupRequest(order_ids);
                        }}
                        className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-emerald-600 px-5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                          Schedule Self Pickup
                      </Button>
                    </div>
                  </div>
                    )
                  }
                  
                  {/* Generete Labels */}

                              <div className="overflow-hidden rounded-sm border border-[#0446DB]/20 dark:border-[#0446DB]/30">
                              <div className="border-b border-[#0446DB]/10 bg-[#0446DB]/5 px-4 py-3 dark:border-[#0446DB]/20 dark:bg-[#0446DB]/10">
                                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                  Generate Labels
                                </h3>

                                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                  Generate shipping labels for all selected orders.
                                </p>
                              </div>

                              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                    Generate Labels for Selected Orders
                                  </p>

                                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                    <span className="font-semibold text-[#0446DB] dark:text-blue-400">
                                      {selectedBulkOrders?.length || 0}
                                    </span>{" "}
                                    selected orders will be included in label generation.
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  disabled={!selectedBulkOrders?.length || generatingLabels}
                                  onClick={async () => {
                                    if (!selectedBulkOrders?.length) {
                                      toast.warn("Please select at least one order");
                                      return;
                                    }
                                    const awbs = [
                                        ...new Set(
                                          selectedBulkOrders.map((order) => order.awb_number)
                                        ),
                                      ];
                                    
                                    if (!awbs.length) {
                                      toast.warn("No valid orders selected");
                                      return;
                                    }

                                    const success = await generateBulkLabelRequest(awbs);

                                    if (success) {
                                      clearAllState();
                                    }
                                  }}
                                  className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {generatingLabels ? "Generating Labels..." : "Generate Labels"}
                                </button>
                              </div>
                              </div>
                              {/* Generete Labels */}

                  {/* ================= CHANGE ACTION ================= */}
                  {(permissions.includes("UPDATE_STATUS") ||
                    permissions.includes("ADMIN_FULL_ACCESS")) && (
                    <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
                      <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                          Change Order Action
                        </h3>

                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                          Change the status of all currently selected orders.
                        </p>
                      </div>

                      <div className="p-4">
                        {!canceledBulkOrder ? (
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                Order Status
                              </p>

                              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                Select an action to update the selected orders.
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                setcanceledBulkOrder(true);
                                // const order_ids = [...new Set(selectedBulkOrders.map(o => o.id))];
                                // fetchVendor(order_ids);
                              }}
                              className="h-9 cursor-pointer rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white transition hover:bg-indigo-800"
                            >
                              Change Action
                            </button>
                          </div>
                        ) : (
                          

                          <form
  onSubmit={async (e) => {
    e.preventDefault();

    const newStatus = e.target.elements.status.value;
    const remark = e.target.elements.remarks.value;

    if (!newStatus) {
      toast.error("Please select status");
      return;
    }

    if (newStatus === "cancelled" && !remark) {
      toast.error("Please select cancel remark");
      return;
    }

    for (const order of selectedBulkOrders) {
      await changeStatus(
       {id: order.id,
      newStatus:  newStatus,
       remark: remark }
      );
    }
    clearAllState()
  }}
  className="space-y-4"
>
  {/* STATUS */}
  <div>
    <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
      Select Status
    </label>

    <select
      name="status"
      className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
    >
      <option value="">Select Status</option>

      <option value="cancelled">
        Cancel Orders
      </option>
    </select>
  </div>

  {/* CANCEL REMARK */}
  <div>
    <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
      Cancel Remark
      <span className="ml-1 text-red-500">*</span>
    </label>

    <select
      name="remarks"
      className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
    >
      <option value="">
        Select Cancel Remark
      </option>

      <option value="Seller Requested Future Pick up">
        Seller Requested Future Pick up
      </option>

      <option value="AWB Rejected">
        AWB Rejected
      </option>

      <option value="Duplicate Pickup Request">
        Duplicate Pickup Request
      </option>

      <option value="Non Serviceable Location">
        Non Serviceable Location
      </option>

      <option value="Dangerous Goods">
        Dangerous Goods
      </option>

      <option value="Packaging Issue">
        Packaging Issue
      </option>

      <option value="Other Courier">
        Other Courier
      </option>

      <option value="Seller Closed">
        Seller Closed
      </option>

      <option value="Pickup Expired">
        Pickup Expired
      </option>

      <option value="Entry not Permitted">
        Entry not Permitted
      </option>

      <option value="refund/replacement">
        Refund / Replacement
      </option>
    </select>

    <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
      Selected remark will be applied to all selected orders.
    </p>
  </div>

  {/* SELECTED ORDERS */}
  <div className="flex items-center justify-between rounded-sm border border-red-100 bg-red-50/50 px-3 py-2.5 dark:border-red-500/20 dark:bg-red-500/5">
    <div>
      <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
        Orders to be cancelled
      </p>

      <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
        Same cancellation remark will apply to all orders.
      </p>
    </div>

    <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
      {selectedBulkOrders?.length || 0}
    </span>
  </div>

  {/* ACTION */}
  <div className="flex items-center justify-end gap-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
    <button
      type="button"
      onClick={() => {
        setcanceledBulkOrder(false);
      }}
      className="h-9 cursor-pointer rounded-sm border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
    >
      Back
    </button>

    <button
      type="submit"
      className="h-9 cursor-pointer rounded-sm bg-red-600 px-5 text-sm font-medium text-white transition hover:bg-red-700"
    >
      Cancel Orders
    </button>
  </div>
</form>
                        )}
                      </div>
                    </div>
                  )}


                  

                  {/* ================= VENDOR ASSIGNMENT ================= */}
                  


                 

                  {/* ================= CLEAR SELECTION ================= */}
                  <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        Clear Selection
                      </p>

                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                        Remove all currently selected orders and reset bulk actions.
                      </p>
                    </div>

                    <button
                      className="h-9 cursor-pointer whitespace-nowrap rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
                      onClick={() => {
                        setSelectedBulkOrders([]);
                        setBulkOrderWeight(0);
                        setFetchBulkAssignmentRider(false);
                        setFetchBulkAssignmentVendor(false);
                        setcanceledBulkOrder(false);
                        clearAllState()
                      }}
                    >
                      Clear Selected Orders
                    </button>
                  </div>
                </div>

                {/* Footer */}
                <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 my-0 dark:border-neutral-800 dark:bg-neutral-950/30">
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


          

          {/* Bulk Pending Pickup Handle */}
          

             {selectedBulkOrders.length > 0 &&
              selectedStatus === "pending pickup" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="my-1 h-8 py-2 cursor-pointer rounded-sm border-[#0446DB] bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-blue-50 hover:text-[#0446DB] dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10"
                    >
                      Action
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
                        selected pending pickup orders.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    {/* Content */}
                    <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5">
                      {/* Generete Labels */}

                              <div className="overflow-hidden rounded-sm border border-[#0446DB]/20 dark:border-[#0446DB]/30">
                              <div className="border-b border-[#0446DB]/10 bg-[#0446DB]/5 px-4 py-3 dark:border-[#0446DB]/20 dark:bg-[#0446DB]/10">
                                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                  Generate Labels
                                </h3>

                                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                  Generate shipping labels for all selected orders.
                                </p>
                              </div>

                              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                    Generate Labels for Selected Orders
                                  </p>

                                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                    <span className="font-semibold text-[#0446DB] dark:text-blue-400">
                                      {selectedBulkOrders?.length || 0}
                                    </span>{" "}
                                    selected orders will be included in label generation.
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  disabled={!selectedBulkOrders?.length || generatingLabels}
                                  onClick={async () => {
                                    if (!selectedBulkOrders?.length) {
                                      toast.warn("Please select at least one order");
                                      return;
                                    }

                                    const awbs = [
                                        ...new Set(
                                          selectedBulkOrders.map((order) => order.awb_number)
                                        ),
                                      ];
                                    
                                    if (!awbs.length) {
                                      toast.warn("No valid orders selected");
                                      return;
                                    }

                                    const success = await generateBulkLabelRequest(awbs);

                                    if (success) {
                                      clearAllState();
                                    }
                                  }}
                                  className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {generatingLabels ? "Generating Labels..." : "Generate Labels"}
                                </button>
                              </div>
                              </div>
                              {/* Generete Labels */}
                      {/* Change Action */}
                      {/* ================= CHANGE ACTION ================= */}
                    {(( permissions.includes("UPDATE_STATUS") || permissions.includes("CANCEL_MAPPED")) || permissions.includes('ADMIN_FULL_ACCESS')) && (
                      <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
                        {/* Header */}
                        <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
                          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                            Change Order Action
                          </h3>

                          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                            Select an action for all currently selected orders.
                          </p>
                        </div>

                        <div className="space-y-4 p-4">
                          {/* Action */}
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                              Select Action
                            </label>

                            <select
                              className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
                              value={bulkStatusState}
                              onChange={(e) => {
                                const value = e.target.value;

                                setBulkStatusState(value);

                                // Cancel ke alawa koi action select ho
                                // to old remark clear ho jaye.
                                if (value !== "Cancelled") {
                                  setBulkCancelRemark("");
                                }
                              }}
                            >
                              <option value="">Select Action</option>

                              {(permissions.includes("UPDATE_STATUS") || permissions.includes('ADMIN_FULL_ACCESS')) && (
                                <option value="Cancelled">
                                  Mark Cancelled
                                </option>
                              )}

                              {console.log(selectedBulkOrders[0].mapped_with!==null)}

                              {(permissions.includes("CANCEL_MAPPED") || permissions.includes('ADMIN_FULL_ACCESS')) && selectedBulkOrders[0].mapped_with!==null && (
                                <option value="Cancel Vendor Mapped">
                                  Cancel Vendor Mapping
                                </option>
                              )}


                              { permissions.includes('ASSIGN_ORDERS_TO_DC') && selectedBulkOrders[0].mapped_dc_id !==
                                        null && (
                                        <option value="Cancel DC Mapped">
                                          Cancel DC Mapping
                                        </option>
                                      )}
                   

                            </select>
                          </div>

                          {/* ================= CANCEL REMARK ================= */}
                          {bulkStatusState === "Cancelled" && (
                            <div className="rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5">
                              <div className="mb-3">
                                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                                  Cancellation Details
                                </p>

                                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                  Select a cancellation reason for all selected orders.
                                </p>
                              </div>

                              <div>
                                <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                  Cancel Remark
                                  <span className="ml-1 text-red-500">*</span>
                                </label>

                                <select
                                  value={bulkCancelRemark}
                                  onChange={(e) => setBulkCancelRemark(e.target.value)}
                                  className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
                                >
                                  <option value="">Select Cancel Remark</option>

                                  <option value="Seller Requested Future Pick up">
                                    Seller Requested Future Pick up
                                  </option>

                                  <option value="AWB Rejected">
                                    AWB Rejected
                                  </option>

                                  <option value="Duplicate Pickup Request">
                                    Duplicate Pickup Request
                                  </option>

                                  <option value="Non Serviceable Location">
                                    Non Serviceable Location
                                  </option>

                                  <option value="Dangerous Goods">
                                    Dangerous Goods
                                  </option>

                                  <option value="Packaging Issue">
                                    Packaging Issue
                                  </option>

                                  <option value="Other Courier">
                                    Other Courier
                                  </option>

                                  <option value="Seller Closed">
                                    Seller Closed
                                  </option>

                                  <option value="Pickup Expired">
                                    Pickup Expired
                                  </option>

                                  <option value="Entry not Permitted">
                                    Entry not Permitted
                                  </option>

                                  <option value="refund/replacement">
                                    Refund / Replacement
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

                          {/* ================= ACTION BUTTON ================= */}
                          <div className="flex justify-end">
                            <button
                              type="button"
                              disabled={
                                !bulkStatusState ||
                                (bulkStatusState === "Cancelled" && !bulkCancelRemark)
                              }
                              onClick={async () => {
                                if (!bulkStatusState) {
                                  toast.warn("Select new status");
                                  return;
                                }

                                // Cancel remark validation
                                if (
                                  bulkStatusState === "Cancelled" &&
                                  !bulkCancelRemark
                                ) {
                                  toast.warn("Please select cancel remark");
                                  return;
                                }

                                try {
                                  // Cancel Rider Assignment
                                  if (bulkStatusState === "Cancel Assignment") {
                                    await Promise.all(
                                      selectedBulkOrders.map((order) =>
                                        cancelRiderAssignment(order.id)
                                      )
                                    );
                                  }

                                  // Cancel Vendor Mapping
                                  else if (
                                    bulkStatusState === "Cancel Vendor Mapped"
                                  ) {
                                    await Promise.all(
                                      selectedBulkOrders.map((order) =>
                                        cancelVendorAssignment(order.id)
                                      )
                                    );
                                  } 

                                  else if(bulkStatusState === "Cancel DC Mapped"){
                                             const orderIds =
                                              selectedBulkOrders.map(
                                                (order) => order.id,
                                              );
                                            console.log(orderIds)
                                            
                                            
                                            CancelDcMapping({ orderIds });
                                            return;
                                            }

                                  // Status Change
                                  else {
                                    await Promise.all(
                                      selectedBulkOrders.map((order) =>
                                        changeStatus({
                                          id: order.id,
                                          newStatus: bulkStatusState,

                                          // Cancelled hone par selected remark jayega
                                          remark:
                                            bulkStatusState === "Cancelled"
                                              ? bulkCancelRemark
                                              : "",
                                        })
                                      )
                                    );
                                  }

                                  setSelectedBulkOrders([]);
                                  setBulkStatusState("");
                                  setBulkCancelRemark("");
                                } catch (error) {
                                  console.error(
                                    "Bulk action error:",
                                    error
                                  );
                                }
                              }}
                              className={`h-9 rounded-sm px-5 text-sm font-medium text-white transition ${
                                bulkStatusState === "Cancelled"
                                  ? "bg-red-600 hover:bg-red-700"
                                  : "bg-[#0446DB] hover:bg-indigo-800"
                              } disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500`}
                            >
                              {bulkStatusState === "Cancel Vendor Mapped"
                                ? "Cancel Vendor Mapped"
                                : bulkStatusState === "Cancelled"
                                  ? "Mark Cancelled"
                                  : bulkStatusState === "Cancel DC Mapped" ? "Cancel DC Mapped": "Change Action"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                      

                      {/* Clear Selection */}
                      <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                            Clear Selection
                          </p>

                          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                            Remove all currently selected orders and reset bulk actions.
                          </p>
                        </div>

                        <button
                          onClick={clearAllState}
                          className="h-9 cursor-pointer whitespace-nowrap rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
                        >
                          Clear Selected Orders
                        </button>
                      </div>
                    </div>

                    <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 my-0 dark:border-neutral-800 dark:bg-neutral-950/30">
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


             {selectedBulkOrders.length > 0 &&  (selectedStatus === "picked" ) && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="my-1 h-8 py-2 cursor-pointer rounded-sm border-[#0446DB] bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-blue-50 hover:text-[#0446DB] dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10"
                    >
                      Action
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
                        selected pending pickup orders.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    {/* Content */}
                    <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5">
                      {/* Generete Labels */}

                              <div className="overflow-hidden rounded-sm border border-[#0446DB]/20 dark:border-[#0446DB]/30">
                              <div className="border-b border-[#0446DB]/10 bg-[#0446DB]/5 px-4 py-3 dark:border-[#0446DB]/20 dark:bg-[#0446DB]/10">
                                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                  Generate Labels
                                </h3>

                                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                  Generate shipping labels for all selected orders.
                                </p>
                              </div>

                              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                    Generate Labels for Selected Orders
                                  </p>

                                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                    <span className="font-semibold text-[#0446DB] dark:text-blue-400">
                                      {selectedBulkOrders?.length || 0}
                                    </span>{" "}
                                    selected orders will be included in label generation.
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  disabled={!selectedBulkOrders?.length || generatingLabels}
                                  onClick={async () => {
                                    if (!selectedBulkOrders?.length) {
                                      toast.warn("Please select at least one order");
                                      return;
                                    }

                                    const awbs = [
                                        ...new Set(
                                          selectedBulkOrders.map((order) => order.awb_number)
                                        ),
                                      ];
                                    
                                    if (!awbs.length) {
                                      toast.warn("No valid orders selected");
                                      return;
                                    }

                                    const success = await generateBulkLabelRequest(awbs);

                                    if (success) {
                                      clearAllState();
                                    }
                                  }}
                                  className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {generatingLabels ? "Generating Labels..." : "Generate Labels"}
                                </button>
                              </div>
                              </div>
                              {/* Generete Labels */}
                      

                      

                      {/* Clear Selection */}
                      <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                            Clear Selection
                          </p>

                          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                            Remove all currently selected orders and reset bulk actions.
                          </p>
                        </div>

                        <button
                          onClick={clearAllState}
                          className="h-9 cursor-pointer whitespace-nowrap rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
                        >
                          Clear Selected Orders
                        </button>
                      </div>
                    </div>

                    <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 my-0 dark:border-neutral-800 dark:bg-neutral-950/30">
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

             {selectedBulkOrders.length > 0 &&  (selectedStatus === "in transit" ) && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="my-1 h-8 py-2 cursor-pointer rounded-sm border-[#0446DB] bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-blue-50 hover:text-[#0446DB] dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10"
                    >
                      Action
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
                        selected pending pickup orders.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    {/* Content */}
                    <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5">
                      {/* Generete Labels */}

                              <div className="overflow-hidden rounded-sm border border-[#0446DB]/20 dark:border-[#0446DB]/30">
                                  <div className="border-b border-[#0446DB]/10 bg-[#0446DB]/5 px-4 py-3 dark:border-[#0446DB]/20 dark:bg-[#0446DB]/10">
                                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                      Generate Labels
                                    </h3>

                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                      Generate shipping labels for all selected orders.
                                    </p>
                                  </div>

                                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                        Generate Labels for Selected Orders
                                      </p>

                                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                        <span className="font-semibold text-[#0446DB] dark:text-blue-400">
                                          {selectedBulkOrders?.length || 0}
                                        </span>{" "}
                                        selected orders will be included in label generation.
                                      </p>
                                    </div>

                                    <button
                                      type="button"
                                      disabled={!selectedBulkOrders?.length || generatingLabels}
                                      onClick={async () => {
                                        if (!selectedBulkOrders?.length) {
                                          toast.warn("Please select at least one order");
                                          return;
                                        }

                                        const awbs = [
                                        ...new Set(
                                          selectedBulkOrders.map((order) => order.awb_number)
                                        ),
                                      ];
                                    
                                    if (!awbs.length) {
                                      toast.warn("No valid orders selected");
                                      return;
                                    }

                                    const success = await generateBulkLabelRequest(awbs);

                                    if (success) {
                                      clearAllState();
                                    }
                                      }}
                                      className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      {generatingLabels ? "Generating Labels..." : "Generate Labels"}
                                    </button>
                                  </div>
                              </div>
                              {/* Generete Labels */}
                      

                      

                      {/* Clear Selection */}
                      <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                            Clear Selection
                          </p>

                          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                            Remove all currently selected orders and reset bulk actions.
                          </p>
                        </div>

                        <button
                          onClick={clearAllState}
                          className="h-9 cursor-pointer whitespace-nowrap rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
                        >
                          Clear Selected Orders
                        </button>
                      </div>
                    </div>

                    <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 my-0 dark:border-neutral-800 dark:bg-neutral-950/30">
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
             {selectedBulkOrders.length > 0 &&  (selectedStatus === "out for delivery" ) && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="my-1 h-8 py-2 cursor-pointer rounded-sm border-[#0446DB] bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-blue-50 hover:text-[#0446DB] dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10"
                    >
                      Action
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
                        selected pending pickup orders.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    {/* Content */}
                    <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5">
                      {/* Generete Labels */}

                              <div className="overflow-hidden rounded-sm border border-[#0446DB]/20 dark:border-[#0446DB]/30">
  <div className="border-b border-[#0446DB]/10 bg-[#0446DB]/5 px-4 py-3 dark:border-[#0446DB]/20 dark:bg-[#0446DB]/10">
    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
      Generate Labels
    </h3>

    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
      Generate shipping labels for all selected orders.
    </p>
  </div>

  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
        Generate Labels for Selected Orders
      </p>

      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
        <span className="font-semibold text-[#0446DB] dark:text-blue-400">
          {selectedBulkOrders?.length || 0}
        </span>{" "}
        selected orders will be included in label generation.
      </p>
    </div>

    <button
      type="button"
      disabled={!selectedBulkOrders?.length || generatingLabels}
      onClick={async () => {
        if (!selectedBulkOrders?.length) {
          toast.warn("Please select at least one order");
          return;
        }

                                 const awbs = [
                                        ...new Set(
                                          selectedBulkOrders.map((order) => order.awb_number)
                                        ),
                                      ];
                                    
                                    if (!awbs.length) {
                                      toast.warn("No valid orders selected");
                                      return;
                                    }

                                    const success = await generateBulkLabelRequest(awbs);

                                    if (success) {
                                      clearAllState();
                                    }
      }}
      className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {generatingLabels ? "Generating Labels..." : "Generate Labels"}
    </button>
  </div>
                              </div>
                              {/* Generete Labels */}
                      

                      

                      {/* Clear Selection */}
                      <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                            Clear Selection
                          </p>

                          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                            Remove all currently selected orders and reset bulk actions.
                          </p>
                        </div>

                        <button
                          onClick={clearAllState}
                          className="h-9 cursor-pointer whitespace-nowrap rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
                        >
                          Clear Selected Orders
                        </button>
                      </div>
                    </div>

                    <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 my-0 dark:border-neutral-800 dark:bg-neutral-950/30">
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
             {selectedBulkOrders.length > 0 &&  (selectedStatus === "undelivered" ) && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="my-1 h-8 py-2 cursor-pointer rounded-sm border-[#0446DB] bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-blue-50 hover:text-[#0446DB] dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10"
                    >
                      Action
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
                        selected pending pickup orders.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    {/* Content */}
                    <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5">
                      {/* Generete Labels */}

                              <div className="overflow-hidden rounded-sm border border-[#0446DB]/20 dark:border-[#0446DB]/30">
  <div className="border-b border-[#0446DB]/10 bg-[#0446DB]/5 px-4 py-3 dark:border-[#0446DB]/20 dark:bg-[#0446DB]/10">
    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
      Generate Labels
    </h3>

    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
      Generate shipping labels for all selected orders.
    </p>
  </div>

  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
        Generate Labels for Selected Orders
      </p>

      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
        <span className="font-semibold text-[#0446DB] dark:text-blue-400">
          {selectedBulkOrders?.length || 0}
        </span>{" "}
        selected orders will be included in label generation.
      </p>
    </div>

    <button
      type="button"
      disabled={!selectedBulkOrders?.length || generatingLabels}
      onClick={async () => {
        if (!selectedBulkOrders?.length) {
          toast.warn("Please select at least one order");
          return;
        }

        const awbs = [
                                        ...new Set(
                                          selectedBulkOrders.map((order) => order.awb_number)
                                        ),
                                      ];
                                    
                                    if (!awbs.length) {
                                      toast.warn("No valid orders selected");
                                      return;
                                    }

                                    const success = await generateBulkLabelRequest(awbs);

                                    if (success) {
                                      clearAllState();
                                    }
      }}
      className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {generatingLabels ? "Generating Labels..." : "Generate Labels"}
    </button>
  </div>
                              </div>
                              {/* Generete Labels */}
                      

                      

                      {/* Clear Selection */}
                      <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                            Clear Selection
                          </p>

                          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                            Remove all currently selected orders and reset bulk actions.
                          </p>
                        </div>

                        <button
                          onClick={clearAllState}
                          className="h-9 cursor-pointer whitespace-nowrap rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
                        >
                          Clear Selected Orders
                        </button>
                      </div>
                    </div>

                    <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 my-0 dark:border-neutral-800 dark:bg-neutral-950/30">
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
             {selectedBulkOrders.length > 0 &&  (selectedStatus === "undelivered assigned" ) && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="my-1 h-8 py-2 cursor-pointer rounded-sm border-[#0446DB] bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-blue-50 hover:text-[#0446DB] dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10"
                    >
                      Action
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
                        selected pending pickup orders.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    {/* Content */}
                    <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5">
                      {/* Generete Labels */}

                              <div className="overflow-hidden rounded-sm border border-[#0446DB]/20 dark:border-[#0446DB]/30">
  <div className="border-b border-[#0446DB]/10 bg-[#0446DB]/5 px-4 py-3 dark:border-[#0446DB]/20 dark:bg-[#0446DB]/10">
    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
      Generate Labels
    </h3>

    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
      Generate shipping labels for all selected orders.
    </p>
  </div>

  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
        Generate Labels for Selected Orders
      </p>

      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
        <span className="font-semibold text-[#0446DB] dark:text-blue-400">
          {selectedBulkOrders?.length || 0}
        </span>{" "}
        selected orders will be included in label generation.
      </p>
    </div>

    <button
      type="button"
      disabled={!selectedBulkOrders?.length || generatingLabels}
      onClick={async () => {
        if (!selectedBulkOrders?.length) {
          toast.warn("Please select at least one order");
          return;
        }

        const awbs = [
                                        ...new Set(
                                          selectedBulkOrders.map((order) => order.awb_number)
                                        ),
                                      ];
                                    
                                    if (!awbs.length) {
                                      toast.warn("No valid orders selected");
                                      return;
                                    }

                                    const success = await generateBulkLabelRequest(awbs);

                                    if (success) {
                                      clearAllState();
                                    }
      }}
      className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {generatingLabels ? "Generating Labels..." : "Generate Labels"}
    </button>
  </div>
                              </div>
                              {/* Generete Labels */}
                      

                      

                      {/* Clear Selection */}
                      <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                            Clear Selection
                          </p>

                          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                            Remove all currently selected orders and reset bulk actions.
                          </p>
                        </div>

                        <button
                          onClick={clearAllState}
                          className="h-9 cursor-pointer whitespace-nowrap rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
                        >
                          Clear Selected Orders
                        </button>
                      </div>
                    </div>

                    <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 my-0 dark:border-neutral-800 dark:bg-neutral-950/30">
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

            {selectedBulkOrders.length > 0 && (selectedStatus === "rto in transit" || selectedStatus === "rto out for delivery" || selectedStatus == 'rto undelivered') && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="my-1 h-8 cursor-pointer rounded-sm border-[#0446DB] bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-blue-50 hover:text-[#0446DB] dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10"
                  >
                     Action
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
                      selected RTO in transit orders.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  {/* Content */}
                  <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5">

                    {/* Generete Labels */}

                              <div className="overflow-hidden rounded-sm border border-[#0446DB]/20 dark:border-[#0446DB]/30">
                              <div className="border-b border-[#0446DB]/10 bg-[#0446DB]/5 px-4 py-3 dark:border-[#0446DB]/20 dark:bg-[#0446DB]/10">
                                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                  Generate Labels
                                </h3>

                                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                  Generate shipping labels for all selected orders.
                                </p>
                              </div>

                              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                    Generate Labels for Selected Orders
                                  </p>

                                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                    <span className="font-semibold text-[#0446DB] dark:text-blue-400">
                                      {selectedBulkOrders?.length || 0}
                                    </span>{" "}
                                    selected orders will be included in label generation.
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  disabled={!selectedBulkOrders?.length || generatingLabels}
                                  onClick={async () => {
                                    if (!selectedBulkOrders?.length) {
                                      toast.warn("Please select at least one order");
                                      return;
                                    }

                                    const awbs = [
                                        ...new Set(
                                          selectedBulkOrders.map((order) => order.awb_number)
                                        ),
                                      ];
                                    
                                    if (!awbs.length) {
                                      toast.warn("No valid orders selected");
                                      return;
                                    }

                                    const success = await generateBulkLabelRequest(awbs);

                                    if (success) {
                                      clearAllState();
                                    }
                                  }}
                                  className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {generatingLabels ? "Generating Labels..." : "Generate Labels"}
                                </button>
                              </div>
                              </div>
                              {/* Generete Labels */}
                    {/* Change Action */}
                    {(permissions.includes("UPDATE_STATUS") || permissions.includes("CANCEL_MAPPED") || permissions.includes('ADMIN_FULL_ACCESS')) && (
                      <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
                        <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
                          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                            Change Order Action
                          </h3>

                          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                            Mark the selected RTO Out For Delivery orders as delivered.
                          </p>
                        </div>
 
                        <div className="space-y-4 p-4">
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                              Select Action
                            </label>

                            <select
                              value={ndrstatus}
                              
                              onChange={handleStatusChange}
                              className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
                            >
                              <option value="">Select Action</option>

                              {(permissions.includes("UPDATE_STATUS") || permissions.includes('ADMIN_FULL_ACCESS')) && (
                                 <>
                                 {
                                  (selectedStatus==='rto in transit' || selectedStatus =='rto undelivered') && (
                                 
                                <option value="rto out for delivery">
                                  RTO Out For Delivery
                                </option>
                                  )
                                 }
                                 {
                                  selectedStatus==='rto out for delivery' && (

                                <>
                                
                                <option value="rto undelivered">
                                  RTO Undelivered
                                </option>
                                </>
                                  )
                                 }
                                 </>
                              )}
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
                                                   
                                                  await Promise.all(
                                                      selectedBulkOrders.map((order) =>
                                                        changeStatus(
                                                          {
                                                          id: order.id,
                                                        newStatus:   'rto undelivered',
                                                        remark: ndrReason,
                                                        detailed_remarks:ndrRemarks|| " "
                                                      }
                                                        )
                                                      )
                                                    );
                                                    
                                                    clearAllState()
                                                    setNdrDialogOpen(false)
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
                          </div>

                          <div className="flex justify-end">
                            <button
                              disabled={!ndrstatus}
                              onClick={async () => {
                                if (!ndrstatus) {
                                  toast.warn("Select new status");
                                  return;
                                } else {

                                  
                                  await Promise.all(
                                    selectedBulkOrders.map((order) =>
                                      changeStatus(
                                        {
                                         id: order.id,
                                      newStatus:  ndrstatus,
                                      remark: ''
                                    }
                                      )
                                    )
                                  );
                                }

                                setSelectedBulkOrders([]);
                                setBulkStatusState("");
                              }}
                              className="h-9 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500"
                            >
                              Change Action
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Clear Selection */}
                    <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                          Clear Selection
                        </p>

                        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                          Remove all currently selected orders and reset bulk actions.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={clearAllState}
                        className="h-9 cursor-pointer whitespace-nowrap rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
                      >
                        Clear Selected Orders
                      </button>
                    </div>
                  </div>

                  {/* Footer */}
                  <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 my-0 dark:border-neutral-800 dark:bg-neutral-950/30">
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

          {/* Table */}
          <div className="min-h-0 flex-1 overflow-auto bg-white dark:bg-neutral-900 shadow">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-600">
                <Loader2 className="h-8 w-8 animate-spin  mb-2" />
                <p className="text-sm font-medium">Loading...</p>
              </div>
            ) : (

              <div className="relative min-w-max">

                <div className="w-full">

                  <table className="min-w-[400px] lg:min-w-full divide-y divide-gray-200">
                    <thead className="sticky top-0 z-30 bg-gray-100 dark:bg-gray-900 text-gray-600 text-sm font-semibold [&_th]:bg-gray-100 dark:[&_th]:bg-gray-900 [&_th]:shadow-[inset_0_-1px_0_#e5e7eb]">
                      <tr>
                        
                           
                                                      
                                       {["rto out for delivery", "rto undelivered","rto in transit"].includes(
                                         selectedStatus
                                    ) ? (
                                      <th className="px-6 py-4">
                                      <input
                                        type="checkbox"
                                        checked={
                                          orders.length > 0 &&
                                          orders.every((order) =>
                                            selectedBulkOrders.some(
                                              (selected) => selected.id === order.id
                                            )
                                          )
                                        }
                                        onChange={toggleSelectAll}
                                        className="h-4 w-4 cursor-pointer accent-[#0446DB]"
                                      />
                                     </th>
                                    ):(
                                      <th className="px-6 py-4">
                                        -
                                      </th>
                                    )}
                                   
                      

                        <th className="text-left  py-3">ORDER ID</th>
                        <th className="text-left ppy-3">SELLER DETAILS</th>

                        {(selectedStatus === "pending pickup" ||
                          selectedStatus === "out for delivery" ||
                          selectedStatus === "delivered" ||
                          selectedStatus === "picked" ||
                          selectedStatus === "undelivered" ||
                          selectedStatus === "in transit" ||
                          selectedStatus === "undelivered assigned") && (
                            <>
                              <th className="text-left whitespace-nowrap px-6 py-3">RIDER ID/VENDOR ID</th>

                            </>
                          )}

                        <th className="text-left whitespace-nowrap px-6  py-3">
                          CONSIGNEE ADDRESS
                        </th>
                        <th className="text-left whitespace-nowrap px-6 py-3">PACKAGE DETAILS</th>

                        <th className="text-left whitespace-nowrap px-6  py-3">STATUS</th>
                        
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
                          } else if (selectedStatus === "pending pickup" ||
                             selectedStatus === 'picked' ||
                             selectedStatus === 'out for delivery' ||
                             selectedStatus === 'undelivered' ||
                              selectedStatus ==='in transit') {
                            isSelected = selectedBulkOrders.some(
                              (o) => o.id === order.id
                            );
                          }else{
                            isSelected = selectedBulkOrders.some(
                              (o) => o.id === order.id
                            );
                          }
                          return (
                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800 border-b overflow-x-scroll">
                              {/* Select */}
                              {(selectedStatus === "booked" ||
                               selectedStatus === "rto in transit" ||
                               selectedStatus === "picked" ||
                               selectedStatus === "in transit" ||
                               selectedStatus === "out for delivery" ||
                               selectedStatus === "undelivered" ||
                               selectedStatus === "undelivered assigned" ||
                                selectedStatus==='rto out for delivery' ||
                                 selectedStatus == 'rto undelivered'  &&
                                  (order.tpc_awb_number == null) ||
                                   selectedStatus === "pending pickup" && order.tpc_awb_number == null) ? (
                               

                                <td className="px-6 py-4 text-center">
                                    {(() => {
                                      // =========================================
                                      // ONLY PENDING PICKUP:
                                      // Mapped + Unmapped orders ko mix nahi karna
                                      // =========================================
                                      const currentIsMapped =
                                        order?.mapped_with !== null &&
                                        order?.mapped_with !== undefined;

                                      const firstSelectedIsMapped =
                                        selectedBulkOrders.length > 0
                                          ? selectedBulkOrders[0]?.mapped_with !== null &&
                                            selectedBulkOrders[0]?.mapped_with !== undefined
                                          : null;

                                      const isDifferentMappingType =
                                        selectedStatus === "pending pickup" &&
                                        selectedBulkOrders.length > 0 &&
                                        firstSelectedIsMapped !== currentIsMapped;

                                      // Pending Pickup me opposite mapping type
                                      // checkbox ki jagah -- show karega
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
                                              selectedStatus === "pending pickup" ||
                                              selectedStatus === "picked" ||
                                              selectedStatus === "in transit" ||
                                              selectedStatus === "out for delivery" ||
                                              selectedStatus === "undelivered" ||
                                              selectedStatus === "undelivered assigned" ||
                                              selectedStatus === "rto in transit" || 
                                              selectedStatus === "rto undelivered" || 
                                              selectedStatus === "rto out for delivery"
                                            ) {
                                              if (isChecked) {
                                                // =========================================
                                                // ONLY PENDING PICKUP CHECK
                                                // =========================================
                                                if (
                                                  selectedStatus === "pending pickup" &&
                                                  selectedBulkOrders.length > 0
                                                ) {
                                                  const firstIsMapped =
                                                    selectedBulkOrders[0]?.mapped_with !== null &&
                                                    selectedBulkOrders[0]?.mapped_with !== undefined;

                                                  const thisIsMapped =
                                                    order?.mapped_with !== null &&
                                                    order?.mapped_with !== undefined;

                                                  // Mapped + Unmapped mix nahi hone dena
                                                  if (firstIsMapped !== thisIsMapped) {
                                                    return;
                                                  }
                                                }

                                                // =========================================
                                                // EXISTING LOGIC - SAME
                                                // =========================================
                                                setSelectedBulkOrders((prev) => {
                                                  const updated = [...prev, order];

                                                  const order_ids = updated.map(
                                                    (o) => o.id
                                                  );

                                                  if (
                                                    ![
                                                      "rto in transit",
                                                      "booked",
                                                    ].includes(selectedStatus)
                                                  ) {
                                                    console.log("rto");
                                                    fetchVendor(order_ids);
                                                  }

                                                  return updated;
                                                });

                                                setBulkOrderWeight(
                                                  (prev) =>
                                                    Number(prev) +
                                                    Number(order.total_weight)
                                                );
                                              } else {
                                                // =========================================
                                                // EXISTING UNCHECK LOGIC - SAME
                                                // =========================================
                                                setSelectedBulkOrders((prev) => {
                                                  const updated = prev.filter(
                                                    (o) => o.id !== order.id
                                                  );

                                                  const order_ids = updated.map(
                                                    (o) => o.id
                                                  );

                                                  // if (
                                                  //   selectedStatus !== "rto in transit"
                                                  // ) {
                                                  //   fetchVendor(order_ids);
                                                  // }

                                                  return updated;
                                                });

                                                setBulkOrderWeight(
                                                  (prev) =>
                                                    Number(prev) -
                                                    Number(order.total_weight)
                                                );
                                              }
                                            }
                                          }}
                                          className="h-4 w-4 rounded border-gray-300 text-[#0446DB]"
                                        />
                                      );
                                    })()}
                                  </td>
                              ) : selectedStatus === "picked" && order?.pickup_stage === "at_central_hub" ? (
                                <td className="px-6 py-4 text-center">
                                  
                                </td>
                              ) :(
                                <>
                                  <td className="px-6 py-4 text-center">
                                    -
                                  </td>
                                </>
                              )}

                              {/* Order ID */}
                              <td className=" py-4 whitespace-pre-line">
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
                                  
                                  

                                  <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="inline-flex cursor-pointer items-center justify-center text-xs font-medium text-red-600"
                                >
                                  <TbFileInfo />
                                </Button>
                              </DialogTrigger>

                              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl dark:border-neutral-800 dark:bg-neutral-900">
                                <DialogHeader>
                                  <DialogTitle className="text-gray-900 dark:text-white">
                                    Order Details
                                  </DialogTitle>
                                </DialogHeader>

                                <div className="space-y-5 bg-white p-6 text-gray-700 dark:bg-neutral-900 dark:text-neutral-300">
                                  {/* ================= BASIC DETAILS ================= */}

                                  <div>
                                    <h3 className="mb-3 font-semibold text-[#0446DB] dark:text-blue-400">
                                      Basic Details
                                    </h3>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                      {/* Order ID */}
                                      <div>
                                        <strong>Order ID:</strong>{" "}
                                        {order?.merchant_order_id || "N/A"}

                                        {order?.merchant_order_id && (
                                          <button
                                            type="button"
                                            className="pl-2 text-lg text-gray-600 transition hover:text-[#0446DB] dark:text-neutral-400"
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
                                            {copySuccess === order?.merchant_order_id ? (
                                              <CiCircleCheck />
                                            ) : (
                                              <FaRegCopy />
                                            )}
                                          </button>
                                        )}
                                      </div>

                                      {/* AWB */}
                                      <div>
                                        <strong>AWB No:</strong>{" "}
                                        {order?.awb_number || "N/A"}

                                        {order?.awb_number && (
                                          <button
                                            type="button"
                                            className="pl-2 text-lg text-gray-600 transition hover:text-[#0446DB] dark:text-neutral-400"
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
                                            {copySuccess === order?.awb_number ? (
                                              <CiCircleCheck />
                                            ) : (
                                              <FaRegCopy />
                                            )}
                                          </button>
                                        )}
                                      </div>

                                      <div>
                                        <strong>Order Type:</strong>{" "}
                                        {order?.order_type === "cod"
                                          ? "COD"
                                          : "Prepaid"}
                                      </div>

                                      <div>
                                        <strong>Order Specific:</strong>{" "}
                                        {order?.order_specific || "N/A"}
                                      </div>

                                      <div>
                                        <strong>Order Status:</strong>{" "}
                                        {order?.status
                                          ? toCapitalizeEachWord(order.status)
                                          : "N/A"}
                                      </div>

                                      <div>
                                        <strong>Total Amount:</strong>{" "}
                                        ₹
                                        {Number(
                                          order?.total_amount || 0
                                        ).toLocaleString()}
                                      </div>

                                      <div>
                                        <strong>Order Weight:</strong>{" "}
                                        {Number(
                                          order?.total_weight || 0
                                        ).toLocaleString()}
                                        g
                                      </div>

                                      <div>
                                        <strong>Charge Weight:</strong>{" "}
                                        {Number(
                                          order?.charged_weight || 0
                                        ).toLocaleString()}
                                        g
                                      </div>

                                      <div>
                                        <strong>Number of Packets:</strong>{" "}
                                        {order?.number_of_boxes || "N/A"}
                                      </div>
                                    </div>
                                  </div>

                                  {/* ================= DELIVERY DETAILS ================= */}

                                  <div className="border-t border-gray-200 pt-4 dark:border-neutral-800">
                                    <div className="mb-3 flex items-center justify-between">
                                      <h3 className="font-semibold text-[#0446DB] dark:text-blue-400">
                                        Delivery Details
                                      </h3>
                                    
                                      {
                                        (permissions.includes('UPDATE_ORD_DETAILS') ||  permissions.includes('ADMIN_FULL_ACCESS')) && (

                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          if (editingDeliveryId === order?.id) {
                                            handleUpdateDeliveryDetails({
                                              order_id: order.id,
                                              delivery_details:
                                                deliveryFormData,
                                            });
                                          } else {
                                            setEditingDeliveryId(order.id);

                                            setDeliveryFormData({
                                              delivery_contact_name:
                                                order?.delivery_contact_name,
                                              delivery_address_line:
                                                order?.delivery_address_line,
                                              delivery_city:
                                                order?.delivery_city,
                                              delivery_state:
                                                order?.delivery_state,
                                              delivery_pincode:
                                                order?.delivery_pincode,
                                            });
                                          }
                                        }}
                                        className="cursor-pointer text-xs"
                                      >
                                        {editingDeliveryId === order?.id
                                          ? "Save"
                                          : "Edit"}
                                      </Button>
                                        )
                                      }

                                    </div>

                                    {editingDeliveryId === order?.id ? (
                                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                          <label className="mb-1 block text-xs text-gray-600 dark:text-neutral-400">
                                            Customer Name
                                          </label>

                                          <input
                                            type="text"
                                            value={
                                              deliveryFormData.delivery_contact_name
                                            }
                                            onChange={(e) =>
                                              setDeliveryFormData((prev) => ({
                                                ...prev,
                                                delivery_contact_name:
                                                  e.target.value,
                                              }))
                                            }
                                            className="w-full rounded-md border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                          />
                                        </div>

                                        <div>
                                          <label className="mb-1 block text-xs text-gray-600 dark:text-neutral-400">
                                            Address
                                          </label>

                                          <input
                                            type="text"
                                            value={
                                              deliveryFormData.delivery_address_line
                                            }
                                            onChange={(e) =>
                                              setDeliveryFormData((prev) => ({
                                                ...prev,
                                                delivery_address_line:
                                                  e.target.value,
                                              }))
                                            }
                                            className="w-full rounded-md border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                          />
                                        </div>

                                        <div>
                                          <label className="mb-1 block text-xs text-gray-600 dark:text-neutral-400">
                                            City
                                          </label>

                                          <input
                                            type="text"
                                            value={deliveryFormData.delivery_city}
                                            onChange={(e) =>
                                              setDeliveryFormData((prev) => ({
                                                ...prev,
                                                delivery_city: e.target.value,
                                              }))
                                            }
                                            className="w-full rounded-md border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                          />
                                        </div>

                                        <div>
                                          <label className="mb-1 block text-xs text-gray-600 dark:text-neutral-400">
                                            State
                                          </label>

                                          <input
                                            type="text"
                                            value={deliveryFormData.delivery_state}
                                            onChange={(e) =>
                                              setDeliveryFormData((prev) => ({
                                                ...prev,
                                                delivery_state: e.target.value,
                                              }))
                                            }
                                            className="w-full rounded-md border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                          />
                                        </div>

                                        <div>
                                          <label className="mb-1 block text-xs text-gray-600 dark:text-neutral-400">
                                            Pincode
                                          </label>

                                          <input
                                            type="text"
                                            value={
                                              deliveryFormData.delivery_pincode
                                            }
                                            onChange={(e) =>
                                              setDeliveryFormData((prev) => ({
                                                ...prev,
                                                delivery_pincode:
                                                  e.target.value,
                                              }))
                                            }
                                            className="w-full rounded-md border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                          />
                                        </div>

                                        <div className="flex items-end">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              setEditingDeliveryId(null)
                                            }
                                            className="cursor-pointer text-red-500"
                                          >
                                            Cancel
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                          <strong>Customer Name:</strong>{" "}
                                          {order?.delivery_contact_name ||
                                            "N/A"}
                                        </div>

                                        <div>
                                          <strong>Address:</strong>{" "}
                                          {order?.delivery_address_line ||
                                            "N/A"}
                                        </div>

                                        <div>
                                          <strong>City:</strong>{" "}
                                          {order?.delivery_city ||
                                          order?.delivery_state ||
                                          order?.delivery_pincode
                                            ? `${order?.delivery_city || ""}, ${
                                                order?.delivery_state || ""
                                              } - ${
                                                order?.delivery_pincode || ""
                                              }`
                                            : "N/A"}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* ================= PICKUP DETAILS ================= */}

                                  <div className="border-t border-gray-200 pt-4 dark:border-neutral-800">
                                    <div className="mb-3 flex items-center justify-between">
                                      <h3 className="font-semibold text-[#0446DB] dark:text-blue-400">
                                        Pickup Details
                                      </h3>
                                      {
                                        (permissions.includes('UPDATE_ORD_DETAILS') || permissions.includes('ADMIN_FULL_ACCESS')) && (

                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          if (editingPickupId === order?.id) {
                                            handleUpdateDeliveryDetails({
                                              order_id: order.id,
                                              pickup_details:
                                                pickupFormData,
                                            });
                                          } else {
                                            setEditingPickupId(order.id);

                                            setPickupFormData({
                                              pickup_contact_name:
                                                order?.pickup_contact_name ||
                                                "",
                                              pickup_phone:
                                                order?.pickup_phone || "",
                                              pickup_address_line:
                                                order?.pickup_address_line ||
                                                "",
                                              pickup_city:
                                                order?.pickup_city || "",
                                              pickup_state:
                                                order?.pickup_state || "",
                                              pickup_pincode:
                                                order?.pickup_pincode || "",
                                            });
                                          }
                                        }}
                                        className="cursor-pointer text-xs"
                                      >
                                        {editingPickupId === order?.id
                                          ? "Save"
                                          : "Edit"}
                                      </Button>
                                        )
                                      }

                                    </div>

                                    {editingPickupId === order?.id ? (
                                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                          <label className="mb-1 block text-xs text-gray-600 dark:text-neutral-400">
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
                                            className="w-full rounded-md border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                          />
                                        </div>

                                        <div>
                                          <label className="mb-1 block text-xs text-gray-600 dark:text-neutral-400">
                                            Phone No
                                          </label>

                                          <input
                                            type="text"
                                            value={pickupFormData.pickup_phone}
                                            onChange={(e) =>
                                              setPickupFormData((prev) => ({
                                                ...prev,
                                                pickup_phone: e.target.value,
                                              }))
                                            }
                                            className="w-full rounded-md border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                          />
                                        </div>

                                        <div>
                                          <label className="mb-1 block text-xs text-gray-600 dark:text-neutral-400">
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
                                            className="w-full rounded-md border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                          />
                                        </div>

                                        <div>
                                          <label className="mb-1 block text-xs text-gray-600 dark:text-neutral-400">
                                            City
                                          </label>

                                          <input
                                            type="text"
                                            value={pickupFormData.pickup_city}
                                            onChange={(e) =>
                                              setPickupFormData((prev) => ({
                                                ...prev,
                                                pickup_city: e.target.value,
                                              }))
                                            }
                                            className="w-full rounded-md border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                          />
                                        </div>

                                        <div>
                                          <label className="mb-1 block text-xs text-gray-600 dark:text-neutral-400">
                                            State
                                          </label>

                                          <input
                                            type="text"
                                            value={pickupFormData.pickup_state}
                                            onChange={(e) =>
                                              setPickupFormData((prev) => ({
                                                ...prev,
                                                pickup_state: e.target.value,
                                              }))
                                            }
                                            className="w-full rounded-md border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                          />
                                        </div>

                                        <div>
                                          <label className="mb-1 block text-xs text-gray-600 dark:text-neutral-400">
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
                                            className="w-full rounded-md border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                          />
                                        </div>

                                        <div className="flex items-end">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              setEditingPickupId(null)
                                            }
                                            className="cursor-pointer text-red-500"
                                          >
                                            Cancel
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                          <strong>Name:</strong>{" "}
                                          {order?.pickup_contact_name ||
                                            "N/A"}
                                        </div>

                                        <div>
                                          <strong>Pickup Phone No:</strong>{" "}
                                          {order?.pickup_phone || "N/A"}
                                        </div>

                                        <div>
                                          <strong>Address:</strong>{" "}
                                          {order?.pickup_address_line ||
                                            "N/A"}
                                        </div>

                                        <div>
                                          <strong>City:</strong>{" "}
                                          {order?.pickup_city ||
                                          order?.pickup_state ||
                                          order?.pickup_pincode
                                            ? `${order?.pickup_city || ""}, ${
                                                order?.pickup_state || ""
                                              } - ${
                                                order?.pickup_pincode || ""
                                              }`
                                            : "N/A"}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* ================= FOOTER ================= */}

                                <DialogFooter>
                                  <DialogClose asChild>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigate(
                                          `/user/order-history?awb=${order?.awb_number}`
                                        );
                                      }}
                                      className="mr-2 cursor-pointer rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
                                    >
                                      Get History
                                    </button>
                                  </DialogClose>

                                  <DialogClose asChild>
                                    <Button
                                      type="button"
                                      onClick={() => {
                                        clearAllState();
                                      }}
                                      variant="outline"
                                      className="cursor-pointer"
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
                                  <span
                                  className={`inline-flex items-center gap-1.5 rounded-full border border-dashed px-2.5 py-1 text-xs font-semibold ${
                                    order.rider_preference === "daakit"
                                      ? "border-blue-500 bg-blue-50/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                                      : "border-emerald-500 bg-emerald-50/50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                  }`}
                                >
                                  {order.rider_preference === "daakit" ? "DDN" : "BYOB"}
                                </span>
                                </p>
                                <p className="text-s text-gray-400 dark:text-white">
                                  Merchant Order ID:{" "}
                                  {order.merchant_order_id?.length <= 20
                                    ? order.merchant_order_id
                                    : `${order.merchant_order_id.slice(
                                      0,
                                      10
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
                            
                                </p>
                              </td>

                              <td className=" py-2">
                              <div className="flex flex-col gap-1.5 text-sm">
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
                                    {order.brand_name}
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
                            </td >

                              {(selectedStatus === "pending pickup" ||
                                selectedStatus === "out for delivery" ||
                                selectedStatus === "delivered" ||
                                selectedStatus === "undelivered" ||
                                selectedStatus === "picked" ||
                                selectedStatus === "in transit" ||
                                selectedStatus === "undelivered assigned") && (
                                  <>

                                    <td className=" px-6 text-left ">
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

                                  {(selectedStatus === "picked" || selectedStatus == "undelivered") && (
                                    <p>
                                      {order.pickup_stage === "at_central_hub"
                                        ? "At Central Hub"
                                        : order.pickup_stage === "at_dc" ? "At DC" : "At Vendor Hub"}
                                    </p>
                                  )}

                                 
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
                                                  changeStatus({
                                                    id:order.id,
                                                    newStatus: newStatus,
                                                   remark:""
                                                  });
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
                                                          <option value="rto out for delivery">
                                                            RTO  Out For Delivery
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


          <div className="shrink-0 mt-auto border-t border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-1 flex flex-wrap items-center justify-end gap-4">

            {/* Pagination Buttons */}
            <div className="flex gap-2">

              <Button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-md text-sm font-medium ${page === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#0446DB] text-white hover:bg-indigo-800"
                  }`}
              >
                Previous
              </Button>

              <p className="text-sm text-gray-700 self-center">
                Page {page} of {totalPages}
              </p>

              <Button
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
              </Button>
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
            <div className="bg-white rounded-sm shadow-xl w-full max-w-4xl overflow-hidden">
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
      )
    }


    </>
  );
}
export default UserOrderDetails;


































































































































// import "../../styles/blink.css";

// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import Select from "react-select";
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card"
// import { Button } from "@/components/ui/button"

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer"

// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { TbFileInfo } from "react-icons/tb";
// import { FaFileExport, FaFilter, FaSearch, FaTasks } from "react-icons/fa";
// import { FaRegCopy } from "react-icons/fa";
// import { CiCircleCheck } from "react-icons/ci";
// import { toast } from "react-toastify";
// import { Link, Navigate, useNavigate, useNavigation } from "react-router-dom";
// import { ArrowRight, Building2, CheckCircle2, ChevronDown, Loader2, Users } from "lucide-react";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import AxiosInstance from "../../Helper/axiosInstance";
// import CustomButton from "../common/CustomButton";
// const baseURL = import.meta.env.VITE_BASE_URL;
// const frontEndURL = import.meta.env.VITE_FRONTEND_URL;


// function UserOrderDetails() {
//   const [bulkCancelRemark, setBulkCancelRemark] = useState("");
//   const startDateRef = useRef(null);
//   const endDateRef = useRef(null);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [copySuccess, setCopySuccess] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(20);
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const [riders, setRiders] = useState([]);
//   const [vendor, setVendor] = useState([]);
//   const [popup, setPopup] = useState(null);

//   const [limitReached, setLimitReached] = useState(false);
//   const [assignmentState, setAssignmentState] = useState("");
//   const [isOpenIndividualAssignmnet, setIsOpenIndividualAssignmnet] = useState("");
//   const [isOpenIndividualVendorAssignmnet, setIsOpenIndividualVendorAssignmnet] = useState("");
//   const [isOpenIndividualAssignmnetMap, setIsOpenIndividualAssignmnetMap] = useState("");

//   const [bulkStatusState, setBulkStatusState] = useState("");
//   const [selectedBulkOrders, setSelectedBulkOrders] = useState([]);

//   const [fetchBulkAssignmentRider, setFetchBulkAssignmentRider] = useState(false);
//   const [fetchBulkAssignmentVendor, setFetchBulkAssignmentVendor] = useState(false);
//   const [canceledBulkOrder, setcanceledBulkOrder] = useState(false);
//   const [bulkOrderWeight, setBulkOrderWeight] = useState(0);
//   const [editingStatusId, setEditingStatusId] = useState(null);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [advanceFilters, setAdvanceFilters] = useState({
//     startDate: "",
//     endDate: "",
//     order_id: "",
//     awbNumber: "",
//     city: "",
//     state: "",
//     vendor_id: "",
//     pincode: "",
//     rider_id: "",
//     order_specific: "",
//     merchant_id: "",
//   });



//     const [ndrstatus, setNdrStatus] = useState("");
//   const [ndrDialogOpen, setNdrDialogOpen] = useState(false);
//   const [ndrReason, setNdrReason] = useState("");
//   const [ndrRemarks, setNdrRemarks] = useState("");
//   const [ndrLoading, setNdrLoading] = useState(false);
//   const handleStatusChange = (e) => {
//     const value = e.target.value;
//      console.log(value)
//     if (value === "rto undelivered") {
//       setNdrReason("");
//       setNdrRemarks("");
//       setNdrDialogOpen(true);
//       return;
//     }

//     setNdrStatus(value);
//   };

//   const [editingDeliveryId, setEditingDeliveryId] = useState(null);
//   const [editingPickupId, setEditingPickupId] = useState(null);
//   const [deliveryFormData, setDeliveryFormData] = useState({
//     delivery_contact_name: '',
//     delivery_address_line: '',
//     delivery_city: '',
//     delivery_state: '',
//     delivery_pincode: '',
//   });
//   const [pickupFormData, setPickupFormData] = useState({
//     pickup_contact_name: '' || "",
//     pickup_phone: "",
//     pickup_address_line: "",
//     pickup_city: "",
//     pickup_state: "",
//     pickup_pincode: "",
//   });


//  const handleUpdateDeliveryDetails = async (data) => {
//     try {
        
//       const res = await axios.post(
//         `${baseURL}/api/user/updateOrderDetails`,
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       toast.success("Delivery details updated successfully");
//       fetchOrders();
//       setEditingDeliveryId(null);
//       setEditingPickupId(null)
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to update delivery details");
//     }
//   };

//  const NDR_REASONS = [
//     "Origin Unavailable",
//     "Origin Closed",
//     "Origin Refused",
//     "Contact Person Unavailable",
//     "Origin Not Reachable",
//     "Address Not Found",
//     "Delivery Attempt Failed",
//     "Other",
//   ];

//   const [filterUpdate, setFilterUpdate] = useState(false);
//   const navigate = useNavigate()
//   function toCapitalizeEachWord(str) {
//     return str
//       .split(" ")
//       .map((word) => {
//         if (!word) return "";
//         return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//       })
//       .join(" ");
//   }

//   const resetAdvanceFilters = async () => {
//     const today = new Date();
//     const oneMonthAgo = new Date();
//     oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

//     setAdvanceFilters({
//       endDate: today.toISOString().split("T")[0],
//       startDate: oneMonthAgo.toISOString().split("T")[0],
//       order_id: "",
//       awbNumber: "",
//       city: "",
//       state: "",
//       vendor_id: "",
//       pincode: "",
//       rider_id: "",
//       order_specific: "",
//       merchant_id: "",
//     });
//   };

//   const status = [
//     "All",
//     "booked",
//     "pending pickup",
//     "picked",
//     "in transit",
//     "out for delivery",
//     "delivered",
//     // "undelivered",
//     // "undelivered assigned",
//     // "cancelled",
//     // "rto in transit",
//     // "rto delivered",
//   ];
//   const [selectedStatus, setSelectedStatus] = useState("All");
//   const [selectedLiveStatus, setSelectedLiveStatus] = useState("All");


//   const [permissions, setPermissions] = useState(localStorage.getItem("permission"))
//   const getUserPermissions = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/api/user/getUserPermissions`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       const permission = res?.data?.data?.data || [];

//       if (
//         !permission.includes("ODR_VIEW") &&
//         !permission.includes("ADMIN_FULL_ACCESS")
//       ) {
//         navigate("/unauthorized");
//         return;
//       }
//       setPermissions(res?.data?.data?.data)


//     } catch (error) {
//       toast.error('')
//     }
//   }


//  const toggleSelectAllRtoOfd = (e) => {
//   const isChecked = e.target.checked;

//   if (isChecked) {
//     setSelectedBulkOrders([...orders]);

//     setBulkOrderWeight(
//       orders.reduce(
//         (total, order) =>
//           total + Number(order.total_weight || 0),
//         0
//       )
//     );
//   } else {
//     setSelectedBulkOrders([]);
//     setBulkOrderWeight(0);
//   }
// };



//   const fetchOrders = async () => {
//     setLoading(true);
//     try {

//       const res = await axios.get(`${baseURL}/api/user/getallorders`, {
//         params: {
//           page,
//           limit,
//           status: selectedStatus === "All" ? undefined : selectedStatus,
//           order_id: advanceFilters.order_id,
//           awb_number: advanceFilters.awbNumber,
//           start_date: advanceFilters.startDate,
//           end_date: advanceFilters.endDate,
//           city: advanceFilters.city,
//           vendor_id: advanceFilters.vendor_id,
//           pincode: advanceFilters.pincode,
//           rider_id: advanceFilters.rider_id,
//           order_specific: advanceFilters.order_specific,
//           merchant_id: advanceFilters.merchant_id,
//         },
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });



//       setOrders(res.data.data || []);

//       setTotalOrders(res.data.pagination?.total);
//       setTotalPages(Math.max(1, res.data.pagination?.totalPages));
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "An error occurred while fetching orders.");
//     } finally {
//       setLoading(false);
//     }
//   };



//     const [generatingLabels, setGeneratingLabels] = useState(false);

// const generateBulkLabelRequest = async (awbs) => {
//   if (!awbs.length) {
//     toast.warn("Please select at least one order");
//     return false;
//   }

//   try {
//     setGeneratingLabels(true);

//     const response = await AxiosInstance.post(
//       "/api/label/usergeneratelabel",
// { awbs: awbs });

//     if (response?.data?.pdf_link) {
//             window.open(response?.data?.pdf_link, "_blank");
//             toast.success("Shipping label(s) generated successfully");
//           }

//     toast.success("Labels generated successfully");

//     return true;
//   } catch (error) {
//     let message = "Failed to generate labels";

//     if (error.response?.data instanceof Blob) {
//       try {
//         const result = JSON.parse(await error.response.data.text());
//         message = result.message || message;
//       } catch {
//         // Keep fallback message
//       }
//     } else {
//       message = error.response?.data?.message || error.message || message;
//     }

//     toast.error(message);

//     return false;
//   } finally {
//     setGeneratingLabels(false);
//   }
// };



//   const handleSearch = () => {
//     setAdvanceFilters({ ...advanceFilters, awbNumber: searchTerm });
    
//     setFilterUpdate((prev) => !prev);
//   };


//   const fetchVendor = async (order_ids) => {
//     if (!order_ids) {
//       return;
//     }

//     try {
//       const res = await axios.get(`${baseURL}/api/user/getEligibleVendorsByOrders?order_id=${order_ids}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         }
//       });
//       setVendor(res?.data?.data?.data || []);
//       // if (res?.data?.data?.data.length == 0) {
//       //   setSelectedBulkOrders([]);
//       //   setBulkOrderWeight(0);
//       //   setFetchBulkAssignmentRider(false);
//       //   setFetchBulkAssignmentVendor(false);
//       //   setcanceledBulkOrder(false)
//       // }
//     } catch (err) {
//       // toast.error(err.response?.data?.message || err.message || "Failed to load riders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const assignRider = async (orderId, riderId) => {
//     setLoading(true);
//     try {
//       await axios.post(
//         `${baseURL}/api/user/assignOrder`,
//         { order_id: orderId, rider_id: riderId },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       fetchOrders();
//       setAssignmentState("");
//       setSelectedBulkOrders([]);
//       setBulkOrderWeight(0);
//       setFetchBulkAssignmentRider(false);
//     } catch (err) {
//       const message = err?.response?.data?.message;
//       if (
//         message ===
//         "Rider has exceeded the maximum packet capacity (50 boxes)" ||
//         message === "Rider has exceeded the maximum weight limit (20 KG)"
//       ) {
//         alert(`Can't assign order to rider: ${message}`);
//         return { success: false, limitReached: true };
//       } else {
//         alert("Failed to assign rider");
//         return { success: false, limitReached: false };
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
//   const assignVendor = async (orderId, vendorId) => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${baseURL}/api/user/assignOrderToVendor`,
//         { order_id: orderId, vendor_id: vendorId },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       toast.success(res.data.message || "Vendor assigned successfully");
//       fetchOrders();
//       setAssignmentState("");
//       setSelectedBulkOrders([]);
//       setBulkOrderWeight(0);
//       setFetchBulkAssignmentRider(false);
//     } catch (err) {
//       toast.error("Failed to assign vendor");
//       return
//     } finally {
//       setLoading(false);
//     }
//   };


//   const assignBulkOrderVendor = async (orderIds, vendorId) => {
//     setLoading(true);
//     try {

//       await axios.post(
//         `${baseURL}/api/user/assignOrderToVendor`,
//         {
//           order_id: orderIds,
//           vendor_id: vendorId,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       toast.success("Vendor assigned successfully");
//       fetchOrders();
//       setAssignmentState("");
//       setSelectedBulkOrders([]);
//       setBulkOrderWeight(0);
//       setFetchBulkAssignmentRider(false);
//     } catch (err) {
//       toast.error("Failed to assign vendor");
//       return
//     } finally {
//       setLoading(false);
//     }
//   };

//   const cancelRiderAssignment = async (id) => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${baseURL}/api/user/cancelRiderAssignment/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       fetchOrders();
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Error while canceling rider assignment: ");
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   const cancelVendorAssignment = async (id) => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${baseURL}/api/user/cancelMappedWithUser/${id}`,
//         {
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       toast.success('vendor Mapped Successfully.')
//       fetchOrders();
//       return
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Error while canceling rider assignment: ");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const changeStatus = async ({id, newStatus,remark,detailed_remarks=""}) => {

//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${baseURL}/api/user/updateOrderStatus/${id}`,
//         { status: newStatus,
//           remarks:remark ? remark:" ",
//           detailed_remarks:detailed_remarks || ""
//          },
        
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       fetchOrders();
//       setEditingStatusId(null);
//       toast.success(res?.data?.data?.message)
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Failed to update status");
//     } finally {
//       setLoading(false);
//     }
//   };


  

//   const toggleSelectAll = () => {
//     if (selectedBulkOrders.length === orders.filter((o) => o.tpc_awb_number === null).length) {
//       setSelectedBulkOrders([]);
//       setBulkOrderWeight(0);
//     } else {
//       // setSelectedBulkOrders(orders);

//       // const totalWeight = orders.reduce(
//       //   (acc, order) => acc + Number(order.total_weight),
//       //   0
//       // );
//       // setBulkOrderWeight(totalWeight);

//       const ord = orders.filter(order => order.tpc_awb_number == null);
//       setSelectedBulkOrders(ord);


//       const totalWeight = orders
//         .filter(order => order.tpc_awb_number == null)
//         .reduce(
//           (acc, order) => acc + Number(order.total_weight),
//           0
//         );
//       setBulkOrderWeight(totalWeight);
//     }
//   };

//   const exportCSV = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${baseURL}/api/user/exportOrders`, {
//         params: {
//           status: selectedStatus === "All" ? "" : selectedStatus,
//           awb_number: advanceFilters.awbNumber,
//           order_id: advanceFilters.order_id,
//           start_date: advanceFilters.startDate,
//           end_date: advanceFilters.endDate,
//           city: advanceFilters.city,
//           vendor_id: advanceFilters.vendor_id,
//           pincode: advanceFilters.pincode,
//           rider_id: advanceFilters.rider_id,
//           order_specific: advanceFilters.order_specific,
//           merchant_id: advanceFilters.merchant_id,
//         },
//         responseType: "blob",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;

//       link.setAttribute("download", "orders.csv");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Failed to export orders");
//     } finally {
//       setLoading(false);
//     }
//   };





//   const [selectedMapType, setSelectedMapType] = useState(null);
//   // null | "mapped" | "unmapped"

//   const getOrderMapType = (order) => {
//     return order?.mapped_with === null || order?.mapped_with === undefined
//       ? "unmapped"
//       : "mapped";
//   };

//   const clearAllState = () => {
//   setSelectedBulkOrders([]);
//   setBulkOrderWeight(0);

//   setAssignmentState("");

//   setFetchBulkAssignmentRider(false);
//   setFetchBulkAssignmentVendor(false);

//   setcanceledBulkOrder(false);
//   setSelectedMapType(null);

//   setVendor([]);
//   setRiders([]);

//   setEditingStatusId(null);
//   setPopup(null);
  
//   setSelectedBulkOrders([]);
// setBulkStatusState("");
// setNdrLoading(false)
// setNdrRemarks("")
// setNdrReason("")
// setNdrDialogOpen(false)
// setNdrStatus("")
// };

//   const handleBulkOrderSelect = (order, isChecked) => {
//     if (selectedStatus !== "picked") return;

//     if (order?.pickup_stage !== "at_central_hub") {
//       toast.error("Only orders at the Central Hub can be selected."); return;
//     }
   
//     const currentType = getOrderMapType(order);

//     if (isChecked) {
//       if (selectedMapType && selectedMapType !== currentType) {
//         setSelectedBulkOrders([])
//         setSelectedMapType(null)
//         setBulkOrderWeight(0);
//         return
//         // toast.error("Please select either mapped orders or unmapped orders, not both."); return;
//       }

//       setSelectedBulkOrders((prev) => {
//         const alreadyExists = prev.some((item) => item.id === order.id);

//         if (alreadyExists) return prev;

//         const updated = [...prev, order];
//         const order_ids = updated.map((o) => o.id);

//         setSelectedMapType(currentType);
//         setBulkOrderWeight(
//           (prevWeight) => Number(prevWeight) + Number(order.total_weight || 0)
//         );

//         fetchVendor(order_ids);

//         return updated;
//       });

//       return;
//     }

//     setSelectedBulkOrders((prev) => {
//       const updated = prev.filter((item) => item.id !== order.id);
//       const order_ids = updated.map((o) => o.id);

//       setBulkOrderWeight(
//         (prevWeight) => Number(prevWeight) - Number(order.total_weight || 0)
//       );

//       if (updated.length === 0) {
//         setSelectedMapType(null);
//       } else {
//         setSelectedMapType(getOrderMapType(updated[0]));
//       }

//       fetchVendor(order_ids);

//       return updated;
//     });
//   };



// const generateBulkPickupRequest = async (order_ids) => {
//   if (!order_ids?.length) {
//     toast.warn("Please select at least one order");
//     return;
//   }

//   try {
//     setLoading(true);

//     const res = await AxiosInstance.post(
//       "/api/user/generateBulkPickupRequest",
//       {
//         order_ids,
//       }
//     );

//     toast.success(
//       res?.data?.message || "Pickup scheduled successfully"
//     );

//     clearAllState();
//     await fetchOrders();
//   } catch (error) {
//     toast.error(
//       error?.response?.data?.message ||
//         error?.message ||
//         "Failed to schedule pickup"
//     );
//   } finally {
//     setLoading(false);
//   }
// };













//   useEffect(() => {
//     resetAdvanceFilters();
//     // getUserPermissions()
//   }, []);


//   useEffect(() => {

//     fetchOrders();
//     setSelectedBulkOrders([]);
//     setBulkOrderWeight(0);
//   }, [page, selectedStatus, filterUpdate, limit]);

//   //I should do this on click
//   useEffect(() => {
//     const order_ids = [];
//     selectedBulkOrders.forEach((element) => {
//       order_ids.push(element.id);
//     });

//   }, [fetchBulkAssignmentRider]);

//   useEffect(() => {
//     setFetchBulkAssignmentRider(false);
//   }, [selectedBulkOrders]);


//     const [loadingPage, setLoadingPage] = useState(true);

// useEffect(() => {
//   const timer = setTimeout(() => {
//     setLoadingPage(false);
//   }, 2000);

//   return () => clearTimeout(timer);
// }, []);
//   return (
//     <>

//     {
//       loadingPage ? (
//              <div className=" w-full h-[90vh] flex justify-center items-center">
//                   <div>
//                     <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//                     <p className="mt-2"> Loading Order Details...</p>
//                   </div>
//                 </div>
        
//       ):(

//       <div className="dark:bg-neutral-900 h-[calc(100dvh-90px)] min-h-[420px] w-full flex flex-col overflow-hidden">

//         <div className="py-2 shrink-0">
//           <div className="  mx-auto   ">
            
//             <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
//   {/* Heading */}
//   <div className="shrink-0">
//     <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
//       Order Details
//     </h1>
//   </div>

//   {/* Search */}
//   <div className="w-full xl:max-w-xl xl:flex-1 xl:px-6">
//     <form
//       className="flex w-full"
//       onSubmit={(e) => {
//         e.preventDefault();
//         handleSearch();
//       }}
//     >
//       <input
//         type="text"
//         placeholder="Search by AWB Number..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="h-10 min-w-0 flex-1 rounded-l-lg border border-gray-300 bg-white px-3 text-sm text-black outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white sm:px-4"
//       />

//       <button
//         type="submit"
//         className="flex h-10 shrink-0 items-center justify-center rounded-r-lg border border-l-0 border-gray-300 bg-white px-4 text-gray-600 transition hover:bg-blue-50 hover:text-[#0446DB] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
//       >
//         <FaSearch />
//       </button>
//     </form>
//   </div>

//   {/* Actions */}
//   <div className="grid  grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center xl:w-auto xl:flex-nowrap">
//     {(permissions?.includes("VIEW_ASSN_CON") ||
//       permissions?.includes("ADMIN_FULL_ACCESS")) && (
//       <Link
//   to="/user/assignemt/console"
//   className="col-span-2 sm:col-span-1"
// >
//   <CustomButton
//     variant="primary"
//     size="md"
//     icon={ArrowRight}
//     className="w-full flex  whitespace-nowrap"
//   >
//     <span className="whitespace-nowrap text-sm font-semibold">
//       Assignment Console
//     </span>

    
//   </CustomButton>
// </Link>
//     )}

//     {(permissions?.includes("ODR_EXPORT") ||
//       permissions?.includes("ADMIN_FULL_ACCESS")) && (
//      <CustomButton
//      icon={FaFileExport}
//   variant="outline"
//   size="md"
//   onClick={exportCSV}
//   className=""
// >
  
//   <span>Export</span>
// </CustomButton>
//     )}

//               <Drawer
//             direction="right"
//             open={isFilterOpen}
//             onOpenChange={setIsFilterOpen}
//           >
//             <DrawerTrigger asChild>
//               <DrawerTrigger asChild>
//   <CustomButton
//     variant="outline"
//     size="md"
//     icon={FaFilter}
//     className=" rounded-sm"
//   >
   
//     <span>Filter</span>
//   </CustomButton>
// </DrawerTrigger>
//             </DrawerTrigger>

//             <DrawerContent className="ml-auto h-full w-full max-w-md rounded-none border-l border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
//               {/* Header */}
//               <DrawerHeader className="border-b border-neutral-200 px-5 py-4 text-left dark:border-neutral-800">
//                 <DrawerTitle className="flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
//                   <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
//                     <FaFilter className="text-sm" />
//                   </span>
//                   Filter Orders
//                 </DrawerTitle>

//                 <DrawerDescription className="text-sm text-neutral-500 dark:text-neutral-400">
//                   Apply filters to find specific orders.
//                 </DrawerDescription>
//               </DrawerHeader>

//               {/* Scrollable Content */}
//               <div className="flex-1 overflow-y-auto px-5 py-5">
//                 <form
//                   id="order-filter-form"
//                   onSubmit={(e) => {
//                     e.preventDefault();

//                     setPage(1);
//                     setFilterUpdate((prev) => !prev);
//                     setIsFilterOpen(false);
//                   }}
//                   className="space-y-5"
//                 >
//                   {/* Date Range */}
//                   <div>
//                     <div className="mb-3">
//                       <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                         Date Range
//                       </h3>
//                       <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                         Filter orders by created date.
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                       {/* Start Date */}
//                       <div>
//                         <label
//                           htmlFor="start-date"
//                           className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
//                         >
//                           Start Date
//                         </label>

//                         <input
//                           id="start-date"
//                           type="date"
//                           ref={startDateRef}
//                           value={advanceFilters.startDate}
//                           onClick={() => startDateRef.current?.showPicker?.()}
//                           onFocus={() => startDateRef.current?.showPicker?.()}
//                           onChange={(e) =>
//                             setAdvanceFilters((prev) => ({
//                               ...prev,
//                               startDate: e.target.value,
//                             }))
//                           }
//                           className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
//                         />
//                       </div>

//                       {/* End Date */}
//                       <div>
//                         <label
//                           htmlFor="end-date"
//                           className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
//                         >
//                           End Date
//                         </label>

//                         <input
//                           id="end-date"
//                           type="date"
//                           ref={endDateRef}
//                           value={advanceFilters.endDate}
//                           onClick={() => endDateRef.current?.showPicker?.()}
//                           onFocus={() => endDateRef.current?.showPicker?.()}
//                           onChange={(e) =>
//                             setAdvanceFilters((prev) => ({
//                               ...prev,
//                               endDate: e.target.value,
//                             }))
//                           }
//                           className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="h-px bg-neutral-100 dark:bg-neutral-800" />

//                   {/* Order Details */}
//                   <div>
//                     <div className="mb-3">
//                       <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                         Order Details
//                       </h3>
//                       <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                         Search using order and shipment information.
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                       {/* Order Specific */}
//                       <div>
//                         <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                           Order Specific
//                         </label>

//                         <select
//                           value={advanceFilters.order_specific}
//                           onChange={(e) =>
//                             setAdvanceFilters((prev) => ({
//                               ...prev,
//                               order_specific: e.target.value,
//                             }))
//                           }
//                           className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
//                         >
//                           <option value="">All Orders</option>
//                           <option value="HLD">HLD</option>
//                           <option value="SDD">Same Day Delivery</option>
//                           <option value="NDD">Next Day Delivery</option>
//                         </select>
//                       </div>

//                       {/* AWB */}
//                       <div>
//                         <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                           AWB Number
//                         </label>

//                         <input
//                           type="text"
//                           value={advanceFilters.awbNumber}
//                           onChange={(e) =>
//                             setAdvanceFilters((prev) => ({
//                               ...prev,
//                               awbNumber: e.target.value,
//                             }))
//                           }
//                           placeholder="Enter AWB number"
//                           className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
//                         />
//                       </div>

//                       {/* Merchant ID */}
//                       <div>
//                         <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                           Merchant ID
//                         </label>

//                         <input
//                           type="number"
//                           value={advanceFilters.merchant_id}
//                           onChange={(e) =>
//                             setAdvanceFilters((prev) => ({
//                               ...prev,
//                               merchant_id: e.target.value,
//                             }))
//                           }
//                           placeholder="Enter merchant ID"
//                           className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
//                         />
//                       </div>

//                       {/* City */}
//                       <div>
//                         <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                           City
//                         </label>

//                         <input
//                           type="text"
//                           value={advanceFilters.city}
//                           onChange={(e) =>
//                             setAdvanceFilters((prev) => ({
//                               ...prev,
//                               city: e.target.value,
//                             }))
//                           }
//                           placeholder="Enter city"
//                           className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
//                         />
//                       </div>

//                       {/* Vendor ID */}
//                       <div>
//                         <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                           Vendor ID
//                         </label>

//                         <input
//                           type="number"
//                           value={advanceFilters.vendor_id}
//                           onChange={(e) =>
//                             setAdvanceFilters((prev) => ({
//                               ...prev,
//                               vendor_id: e.target.value,
//                             }))
//                           }
//                           placeholder="Enter vendor ID"
//                           className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
//                         />
//                       </div>

//                       {/* Pincode */}
//                       <div>
//                         <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                           Pincode
//                         </label>

//                         <input
//                           type="text"
//                           value={advanceFilters.pincode}
//                           onChange={(e) =>
//                             setAdvanceFilters((prev) => ({
//                               ...prev,
//                               pincode: e.target.value,
//                             }))
//                           }
//                           placeholder="Enter pincode"
//                           className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
//                         />
//                       </div>

//                       {/* Rider ID */}
//                       <div className="sm:col-span-2">
//                         <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                           Rider ID
//                         </label>

//                         <input
//                           type="number"
//                           value={advanceFilters.rider_id}
//                           onChange={(e) =>
//                             setAdvanceFilters((prev) => ({
//                               ...prev,
//                               rider_id: e.target.value,
//                             }))
//                           }
//                           placeholder="Enter rider ID"
//                           className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </form>
//               </div>

//               {/* Footer */}
//               <DrawerFooter className="border-t border-neutral-200 bg-neutral-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/80">
//                 <div className="grid grid-cols-2 gap-3">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={async () => {
//                       await resetAdvanceFilters();
//                       setPage(1);
//                       setFilterUpdate((prev) => !prev);
//                       setIsFilterOpen(false);
//                     }}
//                     className="h-10 cursor-pointer rounded-sm border-neutral-300 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
//                   >
//                     Reset
//                   </Button>

//                   <Button
//                     type="submit"
//                     form="order-filter-form"
//                     className="h-10 cursor-pointer gap-2 rounded-sm bg-[#0446DB] text-sm font-medium text-white hover:bg-blue-700"
//                   >
//                     <FaFilter className="text-xs" />
//                     Apply Filter
//                   </Button>
//                 </div>

//                 <DrawerClose asChild>
//                   <Button
//                     variant="ghost"
//                     className="mt-1 h-9 cursor-pointer rounded-sm text-sm text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
//                   >
//                     Cancel
//                   </Button>
//                 </DrawerClose>
//               </DrawerFooter>
//             </DrawerContent>
//           </Drawer>
//             </div>
//           </div>
//           </div>
//         </div>

//         <div className="mx-0 z-10 dark:bg-neutral-900 rounded-sm flex min-h-0 flex-1 flex-col overflow-hidden">
//           <div className="w-full  dark:bg-neutral-800 left-0  z-40 shrink-0">
//             <div className="relative flex justify-left ">
//               <div className=" flex  overflow-x-auto  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2">
//                 <div className="flex gap-1 min-w-max  mt-3">
//                   {status.map((st) => (
//                     <Button
//                       key={st}
//                       onClick={() => {
//                         setSelectedBulkOrders([]);
//                         setSelectedStatus(st);
//                         setPage(1);
//                       }}

//                       className={`px-2 py-2.5 rounded-sm my-2 border transition-all duration-300 font-medium text-sm tracking-wide ${selectedStatus === st
//                         ? "bg-[#0446DB] text-white"
//                         : " bg-white text-gray-700 border-gray-200 hover:bg-[#0446DB] hover:text-white hover:border-gray-300 hover:shadow-md hover:scale-[1.02]"
//                         }`}
//                     >
//                       {st === "rto in transit"
//                         ? "RTO In Transit"
//                         : st === "rto delivered"
//                           ? "RTO Delivered"
//                           : toCapitalizeEachWord(st)}
//                       {selectedStatus === st && ` (${totalOrders})`}
//                     </Button>
//                   ))}

//                    {[
//                                                "undelivered",
//                                                "undelivered assigned",
//                                                "cancelled",
//                                                "rto in transit",
//                                                "rto out for delivery",
//                                                "rto undelivered",
//                                                "rto delivered",
//                                              ].includes(selectedStatus) && (
//                                                <Button
//                                                  className="my-2 rounded-sm border border-[#0446DB] bg-[#0446DB] px-2 py-2.5 text-sm font-medium tracking-wide text-white transition-all duration-300"
//                                                >
//                                                  {selectedStatus === "rto in transit"
//                                                    ? "RTO In Transit"
//                                                    : selectedStatus === "rto delivered"
//                                                      ? "RTO Delivered"
//                                                      : toCapitalizeEachWord(selectedStatus)}
                   
//                                                  {` (${totalOrders})`}
//                                                </Button>
//                                              )}


//                   <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <button
//                             type="button"
//                             className="inline-flex h-8 mt-2 items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-blue-200 bg-blue-50 px-2 text-sm font-medium text-[#0446DB] shadow-sm transition-all duration-200 hover:border-[#0446DB] hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 data-[state=open]:border-[#0446DB] data-[state=open]:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400"
//                           >
//                             More
//                             <ChevronDown className="h-4 w-4 transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
//                           </button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent className="!w-52 !min-w-52">
//                           {[
//                             "undelivered",
//                             "undelivered assigned",
//                             "cancelled",
//                             "rto in transit",
//                             "rto out for delivery",
//                             "rto undelivered",
//                             "rto delivered",
//                           ].map((s) => {
//                             return (
//                               <>
//                                 <DropdownMenuItem
//                                   onClick={() => {
//                                     setSelectedBulkOrders([]);
//                                     setSelectedStatus(s);
//                                     setPage(1);
//                                     clearAllState();
//                                   }}
//                                   variant={
//                                     s === "cancelled"
//                                       ? "destructive"
//                                       : "default"
//                                   }
//                                   className={`${selectedStatus == s ? "bg-[#0446DB] hover:bg-[#0446DB]  text-white" : " hover:bg-[#0446DB] hover:text-white "}`}
//                                 >
//                                   {s.toLowerCase() === "rto"
//                                     ? "RTO"
//                                     : s.charAt(0).toUpperCase() + s.slice(1)}
//                                 </DropdownMenuItem>
//                                 <DropdownMenuSeparator />
//                               </>
//                             );
//                           })}
//                         </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </div>


//             </div>
//           </div>

//           {/* Bulk Assignment */}
//            <div className="shrink-0">
//               {selectedBulkOrders.length > 0 && selectedStatus === "booked" && (
//             <AlertDialog>
//               <AlertDialogTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className="my-2 h-8 py-2 cursor-pointer rounded-sm border-[#0446DB] bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-blue-50 hover:text-[#0446DB] dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10"
//                 >
//                   Action
//                 </Button>
//               </AlertDialogTrigger>

//               <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
//                 {/* Header */}
//                 <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
//                   <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
//                     Bulk Order Actions
//                   </AlertDialogTitle>

//                   <AlertDialogDescription className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
//                     Manage{" "}
//                     <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                       {selectedBulkOrders?.length || 0}
//                     </span>{" "}
//                     selected booked orders.
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>

//                 {/* Content */}
//                 <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5">
                  

//                               {/* Generete Labels */}

//                               <div className="overflow-hidden rounded-sm border border-[#0446DB]/20 dark:border-[#0446DB]/30">
//                               <div className="border-b border-[#0446DB]/10 bg-[#0446DB]/5 px-4 py-3 dark:border-[#0446DB]/20 dark:bg-[#0446DB]/10">
//                                 <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                   Generate Labels
//                                 </h3>

//                                 <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                   Generate shipping labels for all selected orders.
//                                 </p>
//                               </div>

//                               <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
//                                 <div>
//                                   <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                     Generate Labels for Selected Orders
//                                   </p>

//                                   <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                     <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                       {selectedBulkOrders?.length || 0}
//                                     </span>{" "}
//                                     selected orders will be included in label generation.
//                                   </p>
//                                 </div>

//                                 <button
//                                   type="button"
//                                   disabled={!selectedBulkOrders?.length || generatingLabels}
//                                   onClick={async () => {
//                                     if (!selectedBulkOrders?.length) {
//                                       toast.warn("Please select at least one order");
//                                       return;
//                                     }
//                                     const awbs = [
//                                         ...new Set(
//                                           selectedBulkOrders.map((order) => order.awb_number)
//                                         ),
//                                       ];
                                    
//                                     if (!awbs.length) {
//                                       toast.warn("No valid orders selected");
//                                       return;
//                                     }

//                                     const success = await generateBulkLabelRequest(awbs);

//                                     if (success) {
//                                       clearAllState();
//                                     }
//                                   }}
//                                   className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-50"
//                                 >
//                                   {generatingLabels ? "Generating Labels..." : "Generate Labels"}
//                                 </button>
//                               </div>
//                               </div>
//                               {/* Generete Labels */}

//                   {/* ================= CHANGE ACTION ================= */}
//                   {(permissions.includes("UPDATE_STATUS") ||
//                     permissions.includes("ADMIN_FULL_ACCESS")) && (
//                     <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
//                       <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
//                         <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                           Change Order Action
//                         </h3>

//                         <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                           Change the status of all currently selected orders.
//                         </p>
//                       </div>

//                       <div className="p-4">
//                         {!canceledBulkOrder ? (
//                           <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                             <div>
//                               <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                 Order Status
//                               </p>

//                               <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                 Select an action to update the selected orders.
//                               </p>
//                             </div>

//                             <button
//                               onClick={() => {
//                                 setcanceledBulkOrder(true);
//                                 // const order_ids = [...new Set(selectedBulkOrders.map(o => o.id))];
//                                 // fetchVendor(order_ids);
//                               }}
//                               className="h-9 cursor-pointer rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white transition hover:bg-indigo-800"
//                             >
//                               Change Action
//                             </button>
//                           </div>
//                         ) : (
                          

//                           <form
//   onSubmit={async (e) => {
//     e.preventDefault();

//     const newStatus = e.target.elements.status.value;
//     const remark = e.target.elements.remarks.value;

//     if (!newStatus) {
//       toast.error("Please select status");
//       return;
//     }

//     if (newStatus === "cancelled" && !remark) {
//       toast.error("Please select cancel remark");
//       return;
//     }

//     for (const order of selectedBulkOrders) {
//       await changeStatus(
//        {id: order.id,
//       newStatus:  newStatus,
//        remark: remark }
//       );
//     }
//     clearAllState()
//   }}
//   className="space-y-4"
// >
//   {/* STATUS */}
//   <div>
//     <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//       Select Status
//     </label>

//     <select
//       name="status"
//       className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
//     >
//       <option value="">Select Status</option>

//       <option value="cancelled">
//         Cancel Orders
//       </option>
//     </select>
//   </div>

//   {/* CANCEL REMARK */}
//   <div>
//     <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//       Cancel Remark
//       <span className="ml-1 text-red-500">*</span>
//     </label>

//     <select
//       name="remarks"
//       className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
//     >
//       <option value="">
//         Select Cancel Remark
//       </option>

//       <option value="Seller Requested Future Pick up">
//         Seller Requested Future Pick up
//       </option>

//       <option value="AWB Rejected">
//         AWB Rejected
//       </option>

//       <option value="Duplicate Pickup Request">
//         Duplicate Pickup Request
//       </option>

//       <option value="Non Serviceable Location">
//         Non Serviceable Location
//       </option>

//       <option value="Dangerous Goods">
//         Dangerous Goods
//       </option>

//       <option value="Packaging Issue">
//         Packaging Issue
//       </option>

//       <option value="Other Courier">
//         Other Courier
//       </option>

//       <option value="Seller Closed">
//         Seller Closed
//       </option>

//       <option value="Pickup Expired">
//         Pickup Expired
//       </option>

//       <option value="Entry not Permitted">
//         Entry not Permitted
//       </option>

//       <option value="refund/replacement">
//         Refund / Replacement
//       </option>
//     </select>

//     <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
//       Selected remark will be applied to all selected orders.
//     </p>
//   </div>

//   {/* SELECTED ORDERS */}
//   <div className="flex items-center justify-between rounded-sm border border-red-100 bg-red-50/50 px-3 py-2.5 dark:border-red-500/20 dark:bg-red-500/5">
//     <div>
//       <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
//         Orders to be cancelled
//       </p>

//       <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
//         Same cancellation remark will apply to all orders.
//       </p>
//     </div>

//     <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
//       {selectedBulkOrders?.length || 0}
//     </span>
//   </div>

//   {/* ACTION */}
//   <div className="flex items-center justify-end gap-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
//     <button
//       type="button"
//       onClick={() => {
//         setcanceledBulkOrder(false);
//       }}
//       className="h-9 cursor-pointer rounded-sm border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
//     >
//       Back
//     </button>

//     <button
//       type="submit"
//       className="h-9 cursor-pointer rounded-sm bg-red-600 px-5 text-sm font-medium text-white transition hover:bg-red-700"
//     >
//       Cancel Orders
//     </button>
//   </div>
// </form>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* ================= VENDOR ASSIGNMENT ================= */}
//                   {(permissions.includes("VENDOR_VIEW") ||
//                     permissions.includes("ADMIN_FULL_ACCESS")) && (
//                     <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
//                       <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
//                         <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                           Vendor Assignment
//                         </h3>

//                         <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                           Find available vendors and assign selected orders.
//                         </p>
//                       </div>

//                       <div className="p-4">
//             {!fetchBulkAssignmentVendor ? (
//               <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                     Available Vendors
//                   </p>

//                   <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                     Get eligible vendors for the selected orders.
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => {
//                     setFetchBulkAssignmentVendor(true);

//                     const order_ids = [
//                       ...new Set(selectedBulkOrders.map((o) => o.id)),
//                     ];

//                     fetchVendor(order_ids);
//                   }}
//                   className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white transition hover:bg-indigo-800"
//                 >
//                   Get Available Vendor
//                 </button>
//               </div>
//             ) : vendor?.length > 0 ? (
//               <div className="space-y-3">
//                 <div>
//                   <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                     Select Vendor
//                   </label>

//                   <select
//                     className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
//                     value={assignmentState}
//                     onChange={(e) => setAssignmentState(e.target.value)}
//                   >
//                     <option value="">
//                       Select Vendor for Bulk Assignment
//                     </option>

//                     {vendor?.map((vendor) => (
//                       <option
//                         key={vendor?.vendor_id}
//                         value={vendor?.vendor_id}
//                       >
//                         {vendor?.vendor_id} : {vendor?.vendor_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="flex justify-end">
//                   <button
//                     onClick={async () => {
//                       if (!assignmentState) {
//                         toast.warn("Please select a vendor");
//                         return;
//                       }

//                       for (const order of selectedBulkOrders) {
//                         const result = await assignBulkOrderVendor(
//                           order.id,
//                           assignmentState
//                         );
//                       }

//                       setSelectedBulkOrders([]);
//                       setBulkOrderWeight(0);
//                       setFetchBulkAssignmentVendor(false);
//                     }}
//                     className="h-9 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-indigo-800"
//                   >
//                     Bulk Assign
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="rounded-sm border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
//                 <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
//                   No Vendor Available
//                 </p>

//                 <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
//                   No eligible vendor was found for the selected orders.
//                 </p>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     setFetchBulkAssignmentVendor(false);
//                     setAssignmentState("");
//                   }}
//                   className="mt-3 h-8 cursor-pointer rounded-sm border border-amber-300 bg-white px-3 text-xs font-medium text-amber-700 transition hover:bg-amber-100 dark:border-amber-500/30 dark:bg-neutral-900 dark:text-amber-400"
//                 >
//                   Try Again
//                 </button>
//               </div>
//             )}
//                     </div>
//                     </div>
//                   )}


//                   {/* ================= SCHEDULE PICKUP ================= */}
//                   {
//                     (permissions.includes("UPDATE_STATUS") ||
//                     permissions.includes("ADMIN_FULL_ACCESS")) && (

//                   <div className="overflow-hidden rounded-sm border border-emerald-200 dark:border-emerald-500/20">
//                     <div className="border-b border-emerald-100 bg-emerald-50/70 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/5">
//                       <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                         Schedule Self Pickup
//                       </h3>

//                       <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                         Generate a pickup request for all selected booked orders.
//                       </p>
//                     </div>

//                     <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
//                       <div>
//                         <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                           Schedule Selected Orders
//                         </p>

//                         <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                           <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                             {selectedBulkOrders?.length || 0}
//                           </span>{" "}
//                           orders will be scheduled for pickup.
//                         </p>
//                       </div>

//                       <Button
//                         disabled={!selectedBulkOrders?.length}
//                         onClick={async () => {
//                           if (!selectedBulkOrders?.length) {
//                             toast.warn("Please select at least one order");
//                             return;
//                           }

//                           const order_ids = [
//                             ...new Set(
//                               selectedBulkOrders.map((order) => order.id)
//                             ),
//                           ];

//                           await generateBulkPickupRequest(order_ids);
//                         }}
//                         className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-emerald-600 px-5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
//                       >
//                           Schedule Self Pickup
//                       </Button>
//                     </div>
//                   </div>
//                     )
//                   }

//                   {/* ================= CLEAR SELECTION ================= */}
//                   <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
//                     <div className="min-w-0">
//                       <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                         Clear Selection
//                       </p>

//                       <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                         Remove all currently selected orders and reset bulk actions.
//                       </p>
//                     </div>

//                     <button
//                       className="h-9 cursor-pointer whitespace-nowrap rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
//                       onClick={() => {
//                         setSelectedBulkOrders([]);
//                         setBulkOrderWeight(0);
//                         setFetchBulkAssignmentRider(false);
//                         setFetchBulkAssignmentVendor(false);
//                         setcanceledBulkOrder(false);
//                         clearAllState()
//                       }}
//                     >
//                       Clear Selected Orders
//                     </button>
//                   </div>
//                 </div>

//                 {/* Footer */}
//                 <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 my-0 dark:border-neutral-800 dark:bg-neutral-950/30">
//                   <AlertDialogCancel
//                   onClick={()=>{
//                     clearAllState()
//                   }}
//                   className="cursor-pointer rounded-sm">
//                     Close
//                   </AlertDialogCancel>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>
//           )}


//           {/* {selectedBulkOrders.length > 0 && selectedStatus === "picked" && (

//             <>
//               <div className="mb-10 bg-white  rounded-sm shadow-lg p-6 border border-gray-200">
//                 <h2 className="text-xl font-bold text-gray-800 mb-5">
//                   Bulk Orders ({selectedBulkOrders.length} Selected)
//                 </h2>



//                 <div className="overflow-x-auto max-h-[400px] overflow-y-auto">

//                   <table className="min-w-full h-[30%] table-auto border border-gray-200 rounded-md overflow-hidden">
//                     <thead className="bg-gray-100 text-gray-600 text-sm font-semibold">
//                       <tr>
//                         <th className="px-4 py-3 text-left border-b">
//                           Order ID
//                         </th>
//                         <th className="px-4 py-3 text-left border-b">
//                           Order Weight
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="text-gray-800 text-sm">
//                       {selectedBulkOrders.map((order) => (
//                         <tr key={order.id} className="hover:bg-gray-50">
//                           <td className="px-4 py-2 border-b">{order.id}</td>
//                           <td className="px-4 py-2 border-b">
//                             {Number(order.total_weight).toLocaleString()}g
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>

//                   </table>

//                 </div>

//                 <div className="mt-6 flex flex-wrap items-center gap-4">
//                   {selectedMapType === "mapped" && (
//                     selectedBulkOrders.length > 0 ? (
//                       <form
//                         onSubmit={async (e) => {
//                           e.preventDefault();



//                           await Promise.all(
//                             selectedBulkOrders.map(order =>
//                               cancelVendorAssignment(order.id)
//                             )
//                           );

//                           setSelectedBulkOrders([]);
//                           setSelectedMapType(null);
//                         }}
//                       >
//                         <select
//                           className="border border-gray-300 text-sm text-gray-700 px-4 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
//                           name="status"
//                         >
//                           <option value="">Select Status</option>

//                           <option value="Cancel Vendor Mapped">
//                             Cancel Vendor Mapping
//                           </option>
//                         </select>

//                         <button
//                           type="submit"
//                           className="bg-[#0446DB] ml-2 hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
//                         >
//                           Apply Action
//                         </button>
//                       </form>
//                     ) : (
//                       <button
//                         onClick={() => {
//                           setcanceledBulkOrder(true);
//                         }}
//                         className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
//                       >
//                         Change Action
//                       </button>
//                     )
//                   )}
//                   {selectedMapType === "unmapped" && (
//                     <>
//                       {selectedBulkOrders.length > 0 && !fetchBulkAssignmentVendor ? (
//                         <button
//                           onClick={() => {
//                             setFetchBulkAssignmentVendor(true);

//                             const order_ids = [
//                               ...new Set(selectedBulkOrders.map((o) => o.id)),
//                             ];

//                             fetchVendor(order_ids);
//                           }}
//                           className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
//                         >
//                           Get Available Vendor
//                         </button>
//                       ) : (
//                         <>
//                           {vendor?.length > 0 && (
//                             <>
//                               <select
//                                 className="border border-gray-300 text-sm text-gray-700 px-4 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-64"
//                                 value={assignmentState}
//                                 onChange={(e) => setAssignmentState(e.target.value)}
//                               >
//                                 <option value="">
//                                   Select Vendor for Bulk Assignment
//                                 </option>

//                                 {vendor.map((vendorItem) => (
//                                   <option
//                                     key={vendorItem.vendor_id}
//                                     value={vendorItem.vendor_id}
//                                   >
//                                     {vendorItem.vendor_id} : {vendorItem.vendor_name}
//                                   </option>
//                                 ))}
//                               </select>

//                               <button
//                                 onClick={async () => {
//                                   if (!assignmentState) {
//                                     toast.warn("Please select a vendor");
//                                     return;
//                                   }

//                                   for (const order of selectedBulkOrders) {
//                                     await assignBulkOrderVendor(
//                                       order.id,
//                                       assignmentState
//                                     );
//                                   }

//                                   setSelectedBulkOrders([]);
//                                   setBulkOrderWeight(0);
//                                   setFetchBulkAssignmentVendor(false);
//                                   setSelectedMapType(null);
//                                   setAssignmentState("");
//                                 }}
//                                 className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
//                               >
//                                 Bulk Assign
//                               </button>
//                             </>
//                           )}
//                         </>
//                       )}
//                     </>
//                   )}



//                   <button
//                     className="bg-red-500 hover:bg-red-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
//                     onClick={() => {
//                       setSelectedBulkOrders([]);
//                       setBulkOrderWeight(0);
//                       setFetchBulkAssignmentRider(false);
//                       setFetchBulkAssignmentVendor(false);
//                       setcanceledBulkOrder(false)
//                       setSelectedMapType(null)
//                     }}
//                   >
//                     Clear Selected Orders
//                   </button>
//                 </div>



//               </div>
//             </>

//           )} */}



//                 {/* ================= BULK PICKED ORDERS ================= */}
//                 {selectedBulkOrders.length > 0 && selectedStatus === "picked" && (
//                   <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className="my-1 h-8 cursor-pointer rounded-sm border-[#0446DB] bg-[#0446DB] px-4 py-2 text-sm font-medium text-white hover:bg-blue-50 hover:text-[#0446DB] dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10"
//                       >
//                         Action
//                       </Button>
//                     </AlertDialogTrigger>

//                     <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
//                       {/* Header */}
//                       <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
//                         <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
//                           Bulk Order Actions
//                         </AlertDialogTitle>

//                         <AlertDialogDescription className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
//                           Manage{" "}
//                           <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                             {selectedBulkOrders.length}
//                           </span>{" "}
//                           selected picked orders.
//                         </AlertDialogDescription>
//                       </AlertDialogHeader>

//                       {/* Modal Body */}
//                       <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5">

//                         {/* Generete Labels */}

//                                               <div className="overflow-hidden rounded-sm border border-[#0446DB]/20 dark:border-[#0446DB]/30">
//                                               <div className="border-b border-[#0446DB]/10 bg-[#0446DB]/5 px-4 py-3 dark:border-[#0446DB]/20 dark:bg-[#0446DB]/10">
//                                                 <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                                   Generate Labels
//                                                 </h3>

//                                                 <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                                   Generate shipping labels for all selected orders.
//                                                 </p>
//                                               </div>

//                                               <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
//                                                 <div>
//                                                   <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                                     Generate Labels for Selected Orders
//                                                   </p>

//                                                   <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                                     <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                                       {selectedBulkOrders?.length || 0}
//                                                     </span>{" "}
//                                                     selected orders will be included in label generation.
//                                                   </p>
//                                                 </div>

//                                                 <button
//                                                   type="button"
//                                                   disabled={!selectedBulkOrders?.length || generatingLabels}
//                                                   onClick={async () => {
//                                                     if (!selectedBulkOrders?.length) {
//                                                       toast.warn("Please select at least one order");
//                                                       return;
//                                                     }
//                                                     const awbs = [
//                                                         ...new Set(
//                                                           selectedBulkOrders.map((order) => order.awb_number)
//                                                         ),
//                                                       ];
                                                    
//                                                     if (!awbs.length) {
//                                                       toast.warn("No valid orders selected");
//                                                       return;
//                                                     }

//                                                     const success = await generateBulkLabelRequest(awbs);

//                                                     if (success) {
//                                                       clearAllState();
//                                                     }
//                                                   }}
//                                                   className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-50"
//                                                 >
//                                                   {generatingLabels ? "Generating Labels..." : "Generate Labels"}
//                                                 </button>
//                                               </div>
//                                               </div>
//                                               {/* Generete Labels */}

//                         {/* ================= CANCEL VENDOR MAPPING ================= */}
//                         {selectedMapType === "mapped" &&
//                           (permissions.includes("CANCEL_MAPPED") ||
//                             permissions.includes("ADMIN_FULL_ACCESS")) && (
//                             <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">

//                               <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
//                                 <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                   Change Order Action
//                                 </h3>

//                                 <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                   Manage vendor mapping for all selected picked orders.
//                                 </p>
//                               </div>

//                               <div className="space-y-4 p-4">
//                                 <div>
//                                   <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                                     Select Action
//                                   </label>

//                                   <select
//                                     value={bulkStatusState}
//                                     onChange={(e) => setBulkStatusState(e.target.value)}
//                                     className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
//                                   >
//                                     <option value="">Select Action</option>

//                                     <option value="Cancel Vendor Mapped">
//                                       Cancel Vendor Mapping
//                                     </option>
//                                   </select>
//                                 </div>

//                                 <div className="flex justify-end">
//                                   <button
//                                     type="button"
//                                     disabled={bulkStatusState !== "Cancel Vendor Mapped"}
//                                     onClick={async () => {
//                                       if (bulkStatusState !== "Cancel Vendor Mapped") {
//                                         toast.warn("Please select an action");
//                                         return;
//                                       }

//                                       try {
//                                         await Promise.all(
//                                           selectedBulkOrders.map((order) =>
//                                             cancelVendorAssignment(order.id)
//                                           )
//                                         );

//                                         setSelectedBulkOrders([]);
//                                         setBulkOrderWeight(0);
//                                         setSelectedMapType(null);
//                                         setBulkStatusState("");
//                                       } catch (error) {
//                                         console.error(
//                                           "Bulk vendor mapping cancellation error:",
//                                           error
//                                         );
//                                         toast.error("Failed to cancel vendor mapping");
//                                       }
//                                     }}
//                                     className="h-9 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500"
//                                   >
//                                     Cancel Vendor Mapping
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           )}

//                         {/* ================= VENDOR ASSIGNMENT ================= */}
//                         {selectedMapType === "unmapped" &&
//                           (permissions.includes("VENDOR_VIEW") ||
//                             permissions.includes("ADMIN_FULL_ACCESS")) && (
//                             <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
//                               <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
//                                 <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                   Vendor Assignment
//                                 </h3>

//                                 <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                   Find an available vendor and assign the selected picked orders.
//                                 </p>
//                               </div>

//                               <div className="p-4">
//                                 {!fetchBulkAssignmentVendor ? (
//                                   <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                                     <div>
//                                       <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                         Available Vendors
//                                       </p>

//                                       <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                         Get eligible vendors for{" "}
//                                         <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                           {selectedBulkOrders.length}
//                                         </span>{" "}
//                                         selected orders.
//                                       </p>
//                                     </div>

//                                     <button
//                                       type="button"
//                                       onClick={() => {
//                                         setFetchBulkAssignmentVendor(true);

//                                         const order_ids = [
//                                           ...new Set(
//                                             selectedBulkOrders.map((order) => order.id)
//                                           ),
//                                         ];

//                                         fetchVendor(order_ids);
//                                       }}
//                                       className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white transition hover:bg-indigo-800"
//                                     >
//                                       Get Available Vendor
//                                     </button>
//                                   </div>
//                                 ) : vendor?.length > 0 ? (
//                                   <div className="space-y-4">
//                                     <div>
//                                       <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                                         Select Vendor
//                                       </label>

//                                       <select
//                                         value={assignmentState}
//                                         onChange={(e) =>
//                                           setAssignmentState(e.target.value)
//                                         }
//                                         className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
//                                       >
//                                         <option value="">
//                                           Select Vendor for Bulk Assignment
//                                         </option>

//                                         {vendor.map((vendorItem) => (
//                                           <option
//                                             key={vendorItem.vendor_id}
//                                             value={vendorItem.vendor_id}
//                                           >
//                                             {vendorItem.vendor_id} :{" "}
//                                             {vendorItem.vendor_name}
//                                           </option>
//                                         ))}
//                                       </select>
//                                     </div>

//                                     <div className="flex justify-end">
//                                       <button
//                                         type="button"
//                                         disabled={!assignmentState}
//                                         onClick={async () => {
//                                           if (!assignmentState) {
//                                             toast.warn("Please select a vendor");
//                                             return;
//                                           }

//                                           try {
//                                             for (const order of selectedBulkOrders) {
//                                               await assignBulkOrderVendor(
//                                                 order.id,
//                                                 assignmentState
//                                               );
//                                             }

//                                             setSelectedBulkOrders([]);
//                                             setBulkOrderWeight(0);
//                                             setFetchBulkAssignmentVendor(false);
//                                             setSelectedMapType(null);
//                                             setAssignmentState("");
//                                           } catch (error) {
//                                             console.error(
//                                               "Bulk assignment error:",
//                                               error
//                                             );
//                                             toast.error("Failed to assign selected orders");
//                                           }
//                                         }}
//                                         className="h-9 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500"
//                                       >
//                                         Bulk Assign
//                                       </button>
//                                     </div>
//                                   </div>
//                                 ) : (
//                                   <div className="rounded-sm border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
//                                     <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
//                                       No Vendor Available
//                                     </p>

//                                     <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
//                                       No eligible vendor was found for the selected orders.
//                                     </p>

//                                     <button
//                                       type="button"
//                                       onClick={() => {
//                                         setFetchBulkAssignmentVendor(false);
//                                         setAssignmentState("");
//                                         setVendor([]);
//                                       }}
//                                       className="mt-3 h-8 cursor-pointer rounded-sm border border-amber-300 bg-white px-3 text-xs font-medium text-amber-700 transition hover:bg-amber-100 dark:border-amber-500/30 dark:bg-neutral-900 dark:text-amber-400"
//                                     >
//                                       Try Again
//                                     </button>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           )}

//                         {/* ================= CLEAR SELECTION ================= */}
//                         <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
//                           <div>
//                             <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                               Clear Selection
//                             </p>

//                             <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                               Remove all currently selected orders and reset bulk actions.
//                             </p>
//                           </div>

//                           <button
//                             type="button"
//                             onClick={clearAllState}
//                             className="h-9 cursor-pointer whitespace-nowrap rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
//                           >
//                             Clear Selected Orders
//                           </button>
//                         </div>
//                       </div>

//                       {/* Footer */}
//                       <AlertDialogFooter className="my-0 border-t border-neutral-200 bg-neutral-50/70 px-5 dark:border-neutral-800 dark:bg-neutral-950/30">
//                         <AlertDialogCancel
//                           onClick={() => {
//                             clearAllState();
//                             setBulkStatusState("");
//                           }}
//                           className="cursor-pointer rounded-sm"
//                         >
//                           Close
//                         </AlertDialogCancel>
//                       </AlertDialogFooter>
//                     </AlertDialogContent>
//                   </AlertDialog>
//                 )}
//                 {selectedBulkOrders.length > 0 && selectedStatus === "out for delivery" && (
//                   <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className="my-1 h-8 cursor-pointer rounded-sm border-[#0446DB] bg-[#0446DB] px-4 py-2 text-sm font-medium text-white hover:bg-blue-50 hover:text-[#0446DB] dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10"
//                       >
//                         Action
//                       </Button>
//                     </AlertDialogTrigger>

//                     <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
//                       {/* Header */}
//                       <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
//                         <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
//                           Bulk Order Actions
//                         </AlertDialogTitle>

//                         <AlertDialogDescription className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
//                           Manage{" "}
//                           <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                             {selectedBulkOrders.length}
//                           </span>{" "}
//                           selected picked orders.
//                         </AlertDialogDescription>
//                       </AlertDialogHeader>

//                       {/* Modal Body */}
//                       <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5">

//                         {/* Generete Labels */}

//                                               <div className="overflow-hidden rounded-sm border border-[#0446DB]/20 dark:border-[#0446DB]/30">
//                                               <div className="border-b border-[#0446DB]/10 bg-[#0446DB]/5 px-4 py-3 dark:border-[#0446DB]/20 dark:bg-[#0446DB]/10">
//                                                 <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                                   Generate Labels
//                                                 </h3>

//                                                 <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                                   Generate shipping labels for all selected orders.
//                                                 </p>
//                                               </div>

//                                               <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
//                                                 <div>
//                                                   <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                                     Generate Labels for Selected Orders
//                                                   </p>

//                                                   <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                                     <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                                       {selectedBulkOrders?.length || 0}
//                                                     </span>{" "}
//                                                     selected orders will be included in label generation.
//                                                   </p>
//                                                 </div>

//                                                 <button
//                                                   type="button"
//                                                   disabled={!selectedBulkOrders?.length || generatingLabels}
//                                                   onClick={async () => {
//                                                     if (!selectedBulkOrders?.length) {
//                                                       toast.warn("Please select at least one order");
//                                                       return;
//                                                     }
//                                                     const awbs = [
//                                                         ...new Set(
//                                                           selectedBulkOrders.map((order) => order.awb_number)
//                                                         ),
//                                                       ];
                                                    
//                                                     if (!awbs.length) {
//                                                       toast.warn("No valid orders selected");
//                                                       return;
//                                                     }

//                                                     const success = await generateBulkLabelRequest(awbs);

//                                                     if (success) {
//                                                       clearAllState();
//                                                     }
//                                                   }}
//                                                   className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-50"
//                                                 >
//                                                   {generatingLabels ? "Generating Labels..." : "Generate Labels"}
//                                                 </button>
//                                               </div>
//                                               </div>
//                                               {/* Generete Labels */}

                        

//                         {/* ================= CLEAR SELECTION ================= */}
//                         <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
//                           <div>
//                             <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                               Clear Selection
//                             </p>

//                             <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                               Remove all currently selected orders and reset bulk actions.
//                             </p>
//                           </div>

//                           <button
//                             type="button"
//                             onClick={clearAllState}
//                             className="h-9 cursor-pointer whitespace-nowrap rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
//                           >
//                             Clear Selected Orders
//                           </button>
//                         </div>
//                       </div>

//                       {/* Footer */}
//                       <AlertDialogFooter className="my-0 border-t border-neutral-200 bg-neutral-50/70 px-5 dark:border-neutral-800 dark:bg-neutral-950/30">
//                         <AlertDialogCancel
//                           onClick={() => {
//                             clearAllState();
//                             setBulkStatusState("");
//                           }}
//                           className="cursor-pointer rounded-sm"
//                         >
//                           Close
//                         </AlertDialogCancel>
//                       </AlertDialogFooter>
//                     </AlertDialogContent>
//                   </AlertDialog>
//                 )}
//                 {selectedBulkOrders.length > 0 && selectedStatus === "undelivered" && (
//                   <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className="my-1 h-8 cursor-pointer rounded-sm border-[#0446DB] bg-[#0446DB] px-4 py-2 text-sm font-medium text-white hover:bg-blue-50 hover:text-[#0446DB] dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10"
//                       >
//                         Action
//                       </Button>
//                     </AlertDialogTrigger>

//                     <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
//                       {/* Header */}
//                       <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
//                         <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
//                           Bulk Order Actions
//                         </AlertDialogTitle>

//                         <AlertDialogDescription className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
//                           Manage{" "}
//                           <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                             {selectedBulkOrders.length}
//                           </span>{" "}
//                           selected picked orders.
//                         </AlertDialogDescription>
//                       </AlertDialogHeader>

//                       {/* Modal Body */}
//                       <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5">

//                         {/* Generete Labels */}

//                                               <div className="overflow-hidden rounded-sm border border-[#0446DB]/20 dark:border-[#0446DB]/30">
//                                               <div className="border-b border-[#0446DB]/10 bg-[#0446DB]/5 px-4 py-3 dark:border-[#0446DB]/20 dark:bg-[#0446DB]/10">
//                                                 <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                                   Generate Labels
//                                                 </h3>

//                                                 <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                                   Generate shipping labels for all selected orders.
//                                                 </p>
//                                               </div>

//                                               <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
//                                                 <div>
//                                                   <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                                     Generate Labels for Selected Orders
//                                                   </p>

//                                                   <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                                     <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                                       {selectedBulkOrders?.length || 0}
//                                                     </span>{" "}
//                                                     selected orders will be included in label generation.
//                                                   </p>
//                                                 </div>

//                                                 <button
//                                                   type="button"
//                                                   disabled={!selectedBulkOrders?.length || generatingLabels}
//                                                   onClick={async () => {
//                                                     if (!selectedBulkOrders?.length) {
//                                                       toast.warn("Please select at least one order");
//                                                       return;
//                                                     }
//                                                     const awbs = [
//                                                         ...new Set(
//                                                           selectedBulkOrders.map((order) => order.awb_number)
//                                                         ),
//                                                       ];
                                                    
//                                                     if (!awbs.length) {
//                                                       toast.warn("No valid orders selected");
//                                                       return;
//                                                     }

//                                                     const success = await generateBulkLabelRequest(awbs);

//                                                     if (success) {
//                                                       clearAllState();
//                                                     }
//                                                   }}
//                                                   className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-50"
//                                                 >
//                                                   {generatingLabels ? "Generating Labels..." : "Generate Labels"}
//                                                 </button>
//                                               </div>
//                                               </div>
//                                               {/* Generete Labels */}

                        

//                         {/* ================= CLEAR SELECTION ================= */}
//                         <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
//                           <div>
//                             <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                               Clear Selection
//                             </p>

//                             <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                               Remove all currently selected orders and reset bulk actions.
//                             </p>
//                           </div>

//                           <button
//                             type="button"
//                             onClick={clearAllState}
//                             className="h-9 cursor-pointer whitespace-nowrap rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
//                           >
//                             Clear Selected Orders
//                           </button>
//                         </div>
//                       </div>

//                       {/* Footer */}
//                       <AlertDialogFooter className="my-0 border-t border-neutral-200 bg-neutral-50/70 px-5 dark:border-neutral-800 dark:bg-neutral-950/30">
//                         <AlertDialogCancel
//                           onClick={() => {
//                             clearAllState();
//                             setBulkStatusState("");
//                           }}
//                           className="cursor-pointer rounded-sm"
//                         >
//                           Close
//                         </AlertDialogCancel>
//                       </AlertDialogFooter>
//                     </AlertDialogContent>
//                   </AlertDialog>
//                 )}
                
                
//                 {selectedBulkOrders.length > 0 && selectedStatus === "undelivered assigned" && (
//                   <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className="my-1 h-8 cursor-pointer rounded-sm border-[#0446DB] bg-[#0446DB] px-4 py-2 text-sm font-medium text-white hover:bg-blue-50 hover:text-[#0446DB] dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10"
//                       >
//                         Action
//                       </Button>
//                     </AlertDialogTrigger>

//                     <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
//                       {/* Header */}
//                       <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
//                         <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
//                           Bulk Order Actions
//                         </AlertDialogTitle>

//                         <AlertDialogDescription className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
//                           Manage{" "}
//                           <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                             {selectedBulkOrders.length}
//                           </span>{" "}
//                           selected picked orders.
//                         </AlertDialogDescription>
//                       </AlertDialogHeader>

//                       {/* Modal Body */}
//                       <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5">

//                         {/* Generete Labels */}

//                                               <div className="overflow-hidden rounded-sm border border-[#0446DB]/20 dark:border-[#0446DB]/30">
//                                               <div className="border-b border-[#0446DB]/10 bg-[#0446DB]/5 px-4 py-3 dark:border-[#0446DB]/20 dark:bg-[#0446DB]/10">
//                                                 <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                                   Generate Labels
//                                                 </h3>

//                                                 <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                                   Generate shipping labels for all selected orders.
//                                                 </p>
//                                               </div>

//                                               <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
//                                                 <div>
//                                                   <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                                     Generate Labels for Selected Orders
//                                                   </p>

//                                                   <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                                     <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                                       {selectedBulkOrders?.length || 0}
//                                                     </span>{" "}
//                                                     selected orders will be included in label generation.
//                                                   </p>
//                                                 </div>

//                                                 <button
//                                                   type="button"
//                                                   disabled={!selectedBulkOrders?.length || generatingLabels}
//                                                   onClick={async () => {
//                                                     if (!selectedBulkOrders?.length) {
//                                                       toast.warn("Please select at least one order");
//                                                       return;
//                                                     }
//                                                     const awbs = [
//                                                         ...new Set(
//                                                           selectedBulkOrders.map((order) => order.awb_number)
//                                                         ),
//                                                       ];
                                                    
//                                                     if (!awbs.length) {
//                                                       toast.warn("No valid orders selected");
//                                                       return;
//                                                     }

//                                                     const success = await generateBulkLabelRequest(awbs);

//                                                     if (success) {
//                                                       clearAllState();
//                                                     }
//                                                   }}
//                                                   className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-50"
//                                                 >
//                                                   {generatingLabels ? "Generating Labels..." : "Generate Labels"}
//                                                 </button>
//                                               </div>
//                                               </div>
//                                               {/* Generete Labels */}

                        

//                         {/* ================= CLEAR SELECTION ================= */}
//                         <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
//                           <div>
//                             <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                               Clear Selection
//                             </p>

//                             <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                               Remove all currently selected orders and reset bulk actions.
//                             </p>
//                           </div>

//                           <button
//                             type="button"
//                             onClick={clearAllState}
//                             className="h-9 cursor-pointer whitespace-nowrap rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
//                           >
//                             Clear Selected Orders
//                           </button>
//                         </div>
//                       </div>

//                       {/* Footer */}
//                       <AlertDialogFooter className="my-0 border-t border-neutral-200 bg-neutral-50/70 px-5 dark:border-neutral-800 dark:bg-neutral-950/30">
//                         <AlertDialogCancel
//                           onClick={() => {
//                             clearAllState();
//                             setBulkStatusState("");
//                           }}
//                           className="cursor-pointer rounded-sm"
//                         >
//                           Close
//                         </AlertDialogCancel>
//                       </AlertDialogFooter>
//                     </AlertDialogContent>
//                   </AlertDialog>
//                 )}
//                 {selectedBulkOrders.length > 0 && selectedStatus === "All" && (
//                   <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className="my-1 h-8 cursor-pointer rounded-sm border-[#0446DB] bg-[#0446DB] px-4 py-2 text-sm font-medium text-white hover:bg-blue-50 hover:text-[#0446DB] dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10"
//                       >
//                         Action
//                       </Button>
//                     </AlertDialogTrigger>

//                     <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
//                       {/* Header */}
//                       <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
//                         <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
//                           Bulk Order Actions
//                         </AlertDialogTitle>

//                         <AlertDialogDescription className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
//                           Manage{" "}
//                           <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                             {selectedBulkOrders.length}
//                           </span>{" "}
//                           selected picked orders.
//                         </AlertDialogDescription>
//                       </AlertDialogHeader>

//                       {/* Modal Body */}
//                       <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5">

//                         {/* Generete Labels */}

//                                               <div className="overflow-hidden rounded-sm border border-[#0446DB]/20 dark:border-[#0446DB]/30">
//                                               <div className="border-b border-[#0446DB]/10 bg-[#0446DB]/5 px-4 py-3 dark:border-[#0446DB]/20 dark:bg-[#0446DB]/10">
//                                                 <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                                   Generate Labels
//                                                 </h3>

//                                                 <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                                   Generate shipping labels for all selected orders.
//                                                 </p>
//                                               </div>

//                                               <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
//                                                 <div>
//                                                   <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                                     Generate Labels for Selected Orders
//                                                   </p>

//                                                   <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                                     <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                                       {selectedBulkOrders?.length || 0}
//                                                     </span>{" "}
//                                                     selected orders will be included in label generation.
//                                                   </p>
//                                                 </div>

//                                                 <button
//                                                   type="button"
//                                                   disabled={!selectedBulkOrders?.length || generatingLabels}
//                                                   onClick={async () => {
//                                                     if (!selectedBulkOrders?.length) {
//                                                       toast.warn("Please select at least one order");
//                                                       return;
//                                                     }
//                                                     const awbs = [
//                                                         ...new Set(
//                                                           selectedBulkOrders.map((order) => order.awb_number)
//                                                         ),
//                                                       ];
                                                    
//                                                     if (!awbs.length) {
//                                                       toast.warn("No valid orders selected");
//                                                       return;
//                                                     }

//                                                     const success = await generateBulkLabelRequest(awbs);

//                                                     if (success) {
//                                                       clearAllState();
//                                                     }
//                                                   }}
//                                                   className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-50"
//                                                 >
//                                                   {generatingLabels ? "Generating Labels..." : "Generate Labels"}
//                                                 </button>
//                                               </div>
//                                               </div>
//                                               {/* Generete Labels */}

                        

//                         {/* ================= CLEAR SELECTION ================= */}
//                         <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
//                           <div>
//                             <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                               Clear Selection
//                             </p>

//                             <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                               Remove all currently selected orders and reset bulk actions.
//                             </p>
//                           </div>

//                           <button
//                             type="button"
//                             onClick={clearAllState}
//                             className="h-9 cursor-pointer whitespace-nowrap rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
//                           >
//                             Clear Selected Orders
//                           </button>
//                         </div>
//                       </div>

//                       {/* Footer */}
//                       <AlertDialogFooter className="my-0 border-t border-neutral-200 bg-neutral-50/70 px-5 dark:border-neutral-800 dark:bg-neutral-950/30">
//                         <AlertDialogCancel
//                           onClick={() => {
//                             clearAllState();
//                             setBulkStatusState("");
//                           }}
//                           className="cursor-pointer rounded-sm"
//                         >
//                           Close
//                         </AlertDialogCancel>
//                       </AlertDialogFooter>
//                     </AlertDialogContent>
//                   </AlertDialog>
//                 )}


//           {/* Bulk Pending Pickup Handle */}
          

//              {selectedBulkOrders.length > 0 &&
//               selectedStatus === "pending pickup" && (
//                 <AlertDialog>
//                   <AlertDialogTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className="my-1 h-8 py-2 cursor-pointer rounded-sm border-[#0446DB] bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-blue-50 hover:text-[#0446DB] dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10"
//                     >
//                       Action
//                     </Button>
//                   </AlertDialogTrigger>

//                   <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
//                     {/* Header */}
//                     <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
//                       <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
//                         Bulk Order Actions
//                       </AlertDialogTitle>

//                       <AlertDialogDescription className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
//                         Manage{" "}
//                         <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                           {selectedBulkOrders?.length || 0}
//                         </span>{" "}
//                         selected pending pickup orders.
//                       </AlertDialogDescription>
//                     </AlertDialogHeader>

//                     {/* Content */}
//                     <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5">

//                       {/* Generete Labels */}

//                               <div className="overflow-hidden rounded-sm border border-[#0446DB]/20 dark:border-[#0446DB]/30">
//                               <div className="border-b border-[#0446DB]/10 bg-[#0446DB]/5 px-4 py-3 dark:border-[#0446DB]/20 dark:bg-[#0446DB]/10">
//                                 <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                   Generate Labels
//                                 </h3>

//                                 <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                   Generate shipping labels for all selected orders.
//                                 </p>
//                               </div>

//                               <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
//                                 <div>
//                                   <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                     Generate Labels for Selected Orders
//                                   </p>

//                                   <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                     <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                       {selectedBulkOrders?.length || 0}
//                                     </span>{" "}
//                                     selected orders will be included in label generation.
//                                   </p>
//                                 </div>

//                                 <button
//                                   type="button"
//                                   disabled={!selectedBulkOrders?.length || generatingLabels}
//                                   onClick={async () => {
//                                     if (!selectedBulkOrders?.length) {
//                                       toast.warn("Please select at least one order");
//                                       return;
//                                     }
//                                     const awbs = [
//                                         ...new Set(
//                                           selectedBulkOrders.map((order) => order.awb_number)
//                                         ),
//                                       ];
                                    
//                                     if (!awbs.length) {
//                                       toast.warn("No valid orders selected");
//                                       return;
//                                     }

//                                     const success = await generateBulkLabelRequest(awbs);

//                                     if (success) {
//                                       clearAllState();
//                                     }
//                                   }}
//                                   className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-50"
//                                 >
//                                   {generatingLabels ? "Generating Labels..." : "Generate Labels"}
//                                 </button>
//                               </div>
//                               </div>
//                               {/* Generete Labels */}
//                       {/* Change Action */}
//                       {/* ================= CHANGE ACTION ================= */}
//                     {(permissions.includes("UPDATE_STATUS") ||
//                       permissions.includes("CANCEL_MAPPED")) || permissions.includes('ADMIN_FULL_ACCESS') && (
//                       <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
//                         {/* Header */}
//                         <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
//                           <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                             Change Order Action
//                           </h3>

//                           <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                             Select an action for all currently selected orders.
//                           </p>
//                         </div>

//                         <div className="space-y-4 p-4">
//                           {/* Action */}
//                           <div>
//                             <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                               Select Action
//                             </label>

//                             <select
//                               className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
//                               value={bulkStatusState}
//                               onChange={(e) => {
//                                 const value = e.target.value;

//                                 setBulkStatusState(value);

//                                 // Cancel ke alawa koi action select ho
//                                 // to old remark clear ho jaye.
//                                 if (value !== "Cancelled") {
//                                   setBulkCancelRemark("");
//                                 }
//                               }}
//                             >
//                               <option value="">Select Action</option>

//                               {(permissions.includes("UPDATE_STATUS") || permissions.includes('ADMIN_FULL_ACCESS')) && (
//                                 <option value="Cancelled">
//                                   Mark Cancelled
//                                 </option>
//                               )}

//                               {console.log(selectedBulkOrders[0].mapped_with!==null)}

//                               {(permissions.includes("CANCEL_MAPPED") || permissions.includes('ADMIN_FULL_ACCESS')) && selectedBulkOrders[0].mapped_with!==null && (
//                                 <option value="Cancel Vendor Mapped">
//                                   Cancel Vendor Mapping
//                                 </option>
//                               )}
//                             </select>
//                           </div>

//                           {/* ================= CANCEL REMARK ================= */}
//                           {bulkStatusState === "Cancelled" && (
//                             <div className="rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5">
//                               <div className="mb-3">
//                                 <p className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                   Cancellation Details
//                                 </p>

//                                 <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                   Select a cancellation reason for all selected orders.
//                                 </p>
//                               </div>

//                               <div>
//                                 <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                                   Cancel Remark
//                                   <span className="ml-1 text-red-500">*</span>
//                                 </label>

//                                 <select
//                                   value={bulkCancelRemark}
//                                   onChange={(e) => setBulkCancelRemark(e.target.value)}
//                                   className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
//                                 >
//                                   <option value="">Select Cancel Remark</option>

//                                   <option value="Seller Requested Future Pick up">
//                                     Seller Requested Future Pick up
//                                   </option>

//                                   <option value="AWB Rejected">
//                                     AWB Rejected
//                                   </option>

//                                   <option value="Duplicate Pickup Request">
//                                     Duplicate Pickup Request
//                                   </option>

//                                   <option value="Non Serviceable Location">
//                                     Non Serviceable Location
//                                   </option>

//                                   <option value="Dangerous Goods">
//                                     Dangerous Goods
//                                   </option>

//                                   <option value="Packaging Issue">
//                                     Packaging Issue
//                                   </option>

//                                   <option value="Other Courier">
//                                     Other Courier
//                                   </option>

//                                   <option value="Seller Closed">
//                                     Seller Closed
//                                   </option>

//                                   <option value="Pickup Expired">
//                                     Pickup Expired
//                                   </option>

//                                   <option value="Entry not Permitted">
//                                     Entry not Permitted
//                                   </option>

//                                   <option value="refund/replacement">
//                                     Refund / Replacement
//                                   </option>
//                                 </select>

//                                 <p className="mt-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
//                                   This remark will be applied to all{" "}
//                                   <span className="font-semibold text-red-600 dark:text-red-400">
//                                     {selectedBulkOrders?.length || 0}
//                                   </span>{" "}
//                                   selected orders.
//                                 </p>
//                               </div>
//                             </div>
//                           )}

//                           {/* ================= ACTION BUTTON ================= */}
//                           <div className="flex justify-end">
//                             <button
//                               type="button"
//                               disabled={
//                                 !bulkStatusState ||
//                                 (bulkStatusState === "Cancelled" && !bulkCancelRemark)
//                               }
//                               onClick={async () => {
//                                 if (!bulkStatusState) {
//                                   toast.warn("Select new status");
//                                   return;
//                                 }

//                                 // Cancel remark validation
//                                 if (
//                                   bulkStatusState === "Cancelled" &&
//                                   !bulkCancelRemark
//                                 ) {
//                                   toast.warn("Please select cancel remark");
//                                   return;
//                                 }

//                                 try {
//                                   // Cancel Rider Assignment
//                                   if (bulkStatusState === "Cancel Assignment") {
//                                     await Promise.all(
//                                       selectedBulkOrders.map((order) =>
//                                         cancelRiderAssignment(order.id)
//                                       )
//                                     );
//                                   }

//                                   // Cancel Vendor Mapping
//                                   else if (
//                                     bulkStatusState === "Cancel Vendor Mapped"
//                                   ) {
//                                     await Promise.all(
//                                       selectedBulkOrders.map((order) =>
//                                         cancelVendorAssignment(order.id)
//                                       )
//                                     );
//                                   }

//                                   // Status Change
//                                   else {
//                                     await Promise.all(
//                                       selectedBulkOrders.map((order) =>
//                                         changeStatus({
//                                           id: order.id,
//                                           newStatus: bulkStatusState,

//                                           // Cancelled hone par selected remark jayega
//                                           remark:
//                                             bulkStatusState === "Cancelled"
//                                               ? bulkCancelRemark
//                                               : "",
//                                         })
//                                       )
//                                     );
//                                   }

//                                   setSelectedBulkOrders([]);
//                                   setBulkStatusState("");
//                                   setBulkCancelRemark("");
//                                 } catch (error) {
//                                   console.error(
//                                     "Bulk action error:",
//                                     error
//                                   );
//                                 }
//                               }}
//                               className={`h-9 rounded-sm px-5 text-sm font-medium text-white transition ${
//                                 bulkStatusState === "Cancelled"
//                                   ? "bg-red-600 hover:bg-red-700"
//                                   : "bg-[#0446DB] hover:bg-indigo-800"
//                               } disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500`}
//                             >
//                               {bulkStatusState === "Cancel Vendor Mapped"
//                                 ? "Cancel Vendor Mapped"
//                                 : bulkStatusState === "Cancelled"
//                                   ? "Mark Cancelled"
//                                   : "Change Action"}
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                       {/* Vendor Assignment */}
//                       {(permissions.includes("VENDOR_VIEW") ||
//                         permissions.includes("ADMIN_FULL_ACCESS")) && (
//                         <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
//                           <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
//                             <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                               Vendor Assignment
//                             </h3>

//                             <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                               Find an available vendor and assign the selected orders.
//                             </p>
//                           </div>

//                           <div className="p-4">
//                             {!fetchBulkAssignmentVendor ? (
//                               <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                                 <div>
//                                   <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                     Available Vendors
//                                   </p>

//                                   <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                     Get eligible vendors for{" "}
//                                     <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                       {selectedBulkOrders.length}
//                                     </span>{" "}
//                                     selected orders.
//                                   </p>
//                                 </div>

//                                 <button
//                                   type="button"
//                                   onClick={() => {
//                                     setFetchBulkAssignmentVendor(true);

//                                     const order_ids = [
//                                       ...new Set(
//                                         selectedBulkOrders.map((order) => order.id)
//                                       ),
//                                     ];

//                                     fetchVendor(order_ids);
//                                   }}
//                                   className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white transition hover:bg-indigo-800"
//                                 >
//                                   Get Available Vendor
//                                 </button>
//                               </div>
//                             ) : vendor?.length > 0 ? (
//                               <div className="space-y-4">
//                                 <div>
//                                   <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                                     Select Vendor
//                                   </label>

//                                   <select
//                                     value={assignmentState}
//                                     onChange={(e) =>
//                                       setAssignmentState(e.target.value)
//                                     }
//                                     className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
//                                   >
//                                     <option value="">
//                                       Select Vendor for Bulk Assignment
//                                     </option>

//                                     {vendor?.map((vendor) => (
//                                       <option
//                                         key={vendor?.vendor_id}
//                                         value={vendor?.vendor_id}
//                                       >
//                                         {vendor?.vendor_id} : {vendor?.vendor_name}
//                                       </option>
//                                     ))}
//                                   </select>
//                                 </div>

//                                 <div className="flex justify-end">
//                                   <button
//                                     type="button"
//                                     disabled={!assignmentState}
//                                     onClick={async () => {
//                                       if (!assignmentState) {
//                                         toast.warn("Please select a vendor");
//                                         return;
//                                       }

//                                       for (const order of selectedBulkOrders) {
//                                         const result = await assignBulkOrderVendor(
//                                           order.id,
//                                           assignmentState
//                                         );
//                                       }

//                                       setSelectedBulkOrders([]);
//                                       setBulkOrderWeight(0);
//                                       setFetchBulkAssignmentVendor(false);
//                                     }}
//                                     className="h-9 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500"
//                                   >
//                                     Bulk Assign
//                                   </button>
//                                 </div>
//                               </div>
//                             ) : (
//                               <div className="rounded-sm border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
//                                 <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
//                                   No Vendor Available
//                                 </p>

//                                 <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
//                                   No eligible vendor was found for the selected orders.
//                                 </p>

//                                 <button
//                                   type="button"
//                                   onClick={() => {
//                                     setFetchBulkAssignmentVendor(false);
//                                     setAssignmentState("");
//                                     setVendor([]);
//                                   }}
//                                   className="mt-3 h-8 cursor-pointer rounded-sm border border-amber-300 bg-white px-3 text-xs font-medium text-amber-700 transition hover:bg-amber-100 dark:border-amber-500/30 dark:bg-neutral-900 dark:text-amber-400"
//                                 >
//                                   Try Again
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       )}

//                       {/* Clear Selection */}
//                       <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
//                         <div>
//                           <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                             Clear Selection
//                           </p>

//                           <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                             Remove all currently selected orders and reset bulk actions.
//                           </p>
//                         </div>

//                         <button
//                           onClick={clearAllState}
//                           className="h-9 cursor-pointer whitespace-nowrap rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
//                         >
//                           Clear Selected Orders
//                         </button>
//                       </div>
//                     </div>

//                     <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 my-0 dark:border-neutral-800 dark:bg-neutral-950/30">
//                       <AlertDialogCancel 
//                       onClick={()=>{
//                         clearAllState()
//                       }}
//                       className="cursor-pointer rounded-sm">
//                         Close
//                       </AlertDialogCancel>
//                     </AlertDialogFooter>
//                   </AlertDialogContent>
//                 </AlertDialog>
//               )}


            


//             {selectedBulkOrders.length > 0 && (selectedStatus === "rto in transit" || selectedStatus === "rto out for delivery" || selectedStatus == 'rto undelivered') && (
//               <AlertDialog>
//                 <AlertDialogTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="my-1 h-8 cursor-pointer rounded-sm border-[#0446DB] bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-blue-50 hover:text-[#0446DB] dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10"
//                   >
//                      Action
//                   </Button>
//                 </AlertDialogTrigger>

//                 <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
//                   {/* Header */}
//                   <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
//                     <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
//                       Bulk Order Actions
//                     </AlertDialogTitle>

//                     <AlertDialogDescription className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
//                       Manage{" "}
//                       <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                         {selectedBulkOrders?.length || 0}
//                       </span>{" "}
//                       selected RTO in transit orders.
//                     </AlertDialogDescription>
//                   </AlertDialogHeader>

//                   {/* Content */}
//                   <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5">

//                     {/* Generete Labels */}

//                               <div className="overflow-hidden rounded-sm border border-[#0446DB]/20 dark:border-[#0446DB]/30">
//                               <div className="border-b border-[#0446DB]/10 bg-[#0446DB]/5 px-4 py-3 dark:border-[#0446DB]/20 dark:bg-[#0446DB]/10">
//                                 <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                   Generate Labels
//                                 </h3>

//                                 <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                   Generate shipping labels for all selected orders.
//                                 </p>
//                               </div>

//                               <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
//                                 <div>
//                                   <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                     Generate Labels for Selected Orders
//                                   </p>

//                                   <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                     <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                       {selectedBulkOrders?.length || 0}
//                                     </span>{" "}
//                                     selected orders will be included in label generation.
//                                   </p>
//                                 </div>

//                                 <button
//                                   type="button"
//                                   disabled={!selectedBulkOrders?.length || generatingLabels}
//                                   onClick={async () => {
//                                     if (!selectedBulkOrders?.length) {
//                                       toast.warn("Please select at least one order");
//                                       return;
//                                     }
//                                     const awbs = [
//                                         ...new Set(
//                                           selectedBulkOrders.map((order) => order.awb_number)
//                                         ),
//                                       ];
                                    
//                                     if (!awbs.length) {
//                                       toast.warn("No valid orders selected");
//                                       return;
//                                     }

//                                     const success = await generateBulkLabelRequest(awbs);

//                                     if (success) {
//                                       clearAllState();
//                                     }
//                                   }}
//                                   className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-50"
//                                 >
//                                   {generatingLabels ? "Generating Labels..." : "Generate Labels"}
//                                 </button>
//                               </div>
//                               </div>
//                               {/* Generete Labels */}
//                     {/* Change Action */}
//                     {(permissions.includes("UPDATE_STATUS") || permissions.includes("CANCEL_MAPPED") || permissions.includes('ADMIN_FULL_ACCESS')) && (
//                       <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
//                         <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
//                           <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                             Change Order Action
//                           </h3>

//                           <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                             Mark the selected RTO Out For Delivery orders as delivered.
//                           </p>
//                         </div>
 
//                         <div className="space-y-4 p-4">
//                           <div>
//                             <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                               Select Action
//                             </label>

//                             <select
//                               value={ndrstatus}
//                               // onChange={(e) =>
//                               //   setBulkStatusState(e.target.value)
//                               //    handleStatusChange(e)
//                               // }
//                               onChange={handleStatusChange}
//                               className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
//                             >
//                               <option value="">Select Action</option>

//                               {(permissions.includes("UPDATE_STATUS") || permissions.includes('ADMIN_FULL_ACCESS')) && (
//                                  <>
//                                  {
//                                   (selectedStatus==='rto in transit' || selectedStatus =='rto undelivered') && (
                                 
//                                 <option value="rto out for delivery">
//                                   RTO Out For Delivery
//                                 </option>
//                                   )
//                                  }
//                                  {
//                                   selectedStatus==='rto out for delivery' && (

//                                 <>
//                                 <option value="rto delivered">
//                                   RTO Delivered
//                                 </option>
//                                 <option value="rto undelivered">
//                                   RTO Undelivered
//                                 </option>
//                                 </>
//                                   )
//                                  }
//                                  </>
//                               )}
//                             </select>

//                             <AlertDialog
//                                           open={ndrDialogOpen}
//                                           onOpenChange={(open) => {
//                                             if (!ndrLoading)
//                                               setNdrDialogOpen(open);
//                                           }}
//                                         >
//                                           <AlertDialogContent className="w-[calc(100%-32px)] max-w-[440px] overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
//                                             <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 text-left dark:border-neutral-700">
//                                               <AlertDialogTitle className="text-lg font-semibold text-neutral-900 dark:text-white">
//                                                 Update NDR Status
//                                               </AlertDialogTitle>
//                                               <AlertDialogDescription className="text-sm text-neutral-500 dark:text-neutral-400">
//                                                 Select the reason for marking
//                                                 this order as NDR.
//                                               </AlertDialogDescription>
//                                             </AlertDialogHeader>

//                                             <div className="space-y-4 px-5 py-5">
//                                               <div className="space-y-2">
//                                                 <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
//                                                   NDR Reason{" "}
//                                                   <span className="text-red-500">
//                                                     *
//                                                   </span>
//                                                 </label>

//                                                 <select
//                                                   value={ndrReason}
//                                                   onChange={(e) =>
//                                                     setNdrReason(e.target.value)
//                                                   }
//                                                   disabled={ndrLoading}
//                                                   className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
//                                                 >
//                                                   <option value="">
//                                                     Select NDR Reason
//                                                   </option>
//                                                   {NDR_REASONS.map((reason) => (
//                                                     <option
//                                                       key={reason}
//                                                       value={reason}
//                                                     >
//                                                       {reason}
//                                                     </option>
//                                                   ))}
//                                                 </select>
//                                               </div>

//                                               <div className="space-y-2">
//                                                 <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
//                                                   Remarks{" "}
//                                                   {ndrReason === "Other"
//                                                     ? "*"
//                                                     : "(Optional)"}
//                                                 </label>

//                                                 <textarea
//                                                   value={ndrRemarks}
//                                                   onChange={(e) =>
//                                                     setNdrRemarks(
//                                                       e.target.value,
//                                                     )
//                                                   }
//                                                   maxLength={500}
//                                                   disabled={ndrLoading}
//                                                   placeholder="Enter additional details..."
//                                                   rows={3}
//                                                   className="w-full resize-none rounded-sm border border-neutral-200 bg-white p-3 text-sm text-neutral-700 outline-none focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
//                                                 />
//                                                 <p className="text-right text-xs text-neutral-400">
//                                                   {ndrRemarks.length}/500
//                                                 </p>
//                                               </div>
//                                             </div>

//                                             <AlertDialogFooter className="flex-row gap-2 overflow-hidden border-t border-neutral-200 px-8 my-0 dark:border-neutral-700">
//                                               <AlertDialogCancel
//                                                 disabled={ndrLoading}
//                                                 className="mt-0 flex-1 rounded-sm"
//                                               >
//                                                 Cancel
//                                               </AlertDialogCancel>

//                                               <Button
//                                                 type="button"
//                                                 disabled={
//                                                   ndrLoading ||
//                                                   !ndrReason ||
//                                                   (ndrReason === "Other" &&
//                                                     !ndrRemarks.trim())
//                                                 }

//                                                 onClick={async () => {
                                                   
//                                                   await Promise.all(
//                                                       selectedBulkOrders.map((order) =>
//                                                         changeStatus(
//                                                           {
//                                                           id: order.id,
//                                                         newStatus:   'rto undelivered',
//                                                         remark: ndrReason,
//                                                         detailed_remarks:ndrRemarks|| " "
//                                                       }
//                                                         )
//                                                       )
//                                                     );
                                                    
//                                                     clearAllState()
//                                                     setNdrDialogOpen(false)
//                                                 }}
//                                                 className="flex-1 rounded-sm bg-[#0446DB] text-white hover:bg-[#0339B5]"
//                                               >
//                                                 {ndrLoading
//                                                   ? "Submitting..."
//                                                   : "Submit NDR"}
//                                               </Button>
//                                             </AlertDialogFooter>
//                                           </AlertDialogContent>
//                                         </AlertDialog>
//                           </div>

//                           <div className="flex justify-end">
//                             <button
//                               disabled={!ndrstatus}
//                               onClick={async () => {
//                                 if (!ndrstatus) {
//                                   toast.warn("Select new status");
//                                   return;
//                                 } else {

                                  
//                                   await Promise.all(
//                                     selectedBulkOrders.map((order) =>
//                                       changeStatus(
//                                         {
//                                          id: order.id,
//                                       newStatus:  ndrstatus,
//                                       remark: ''
//                                     }
//                                       )
//                                     )
//                                   );
//                                 }

//                                 setSelectedBulkOrders([]);
//                                 setBulkStatusState("");
//                               }}
//                               className="h-9 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500"
//                             >
//                               Change Action
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* Clear Selection */}
//                     <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
//                       <div>
//                         <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                           Clear Selection
//                         </p>

//                         <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                           Remove all currently selected orders and reset bulk actions.
//                         </p>
//                       </div>

//                       <button
//                         type="button"
//                         onClick={clearAllState}
//                         className="h-9 cursor-pointer whitespace-nowrap rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
//                       >
//                         Clear Selected Orders
//                       </button>
//                     </div>
//                   </div>

//                   {/* Footer */}
//                   <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 my-0 dark:border-neutral-800 dark:bg-neutral-950/30">
//                     <AlertDialogCancel 
//                     onClick={()=>{
//                               clearAllState()
//                             }}
//                     className="cursor-pointer rounded-sm">
//                       Close
//                     </AlertDialogCancel>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>
//               </AlertDialog>
//             )}
//            </div>

//           {/* Table */}
//           <div className="min-h-0 flex-1 overflow-auto bg-white dark:bg-neutral-900 shadow">
//             {loading ? (
//               <div className="flex flex-col items-center justify-center py-10 text-gray-600">
//                 <Loader2 className="h-8 w-8 animate-spin  mb-2" />
//                 <p className="text-sm font-medium">Loading...</p>
//               </div>
//             ) : (

//               <div className="relative min-w-max">

//                 <div className="w-full">

//                   <table className="min-w-[400px] lg:min-w-full divide-y divide-gray-200">
//                     <thead className="sticky top-0 z-30 bg-gray-100 dark:bg-gray-900 text-gray-600 text-sm font-semibold [&_th]:bg-gray-100 dark:[&_th]:bg-gray-900 [&_th]:shadow-[inset_0_-1px_0_#e5e7eb]">
//                       <tr>
                        
//                            <>
//                             <th className="px-6 py-4">
//                               {["rto out for delivery", "rto undelivered","rto in transit"].includes(
//   selectedStatus
// ) && (
//   <input
//     type="checkbox"
//     checked={
//       orders.length > 0 &&
//       orders.every((order) =>
//         selectedBulkOrders.some(
//           (selected) => selected.id === order.id
//         )
//       )
//     }
//     onChange={toggleSelectAllRtoOfd}
//     className="h-4 w-4 cursor-pointer accent-[#0446DB]"
//   />
// )}
//                             </th>
//                           </>

//                         <th className="text-left  py-3">ORDER ID</th>
//                         <th className="text-left ppy-3">SELLER DETAILS</th>

//                         {(selectedStatus === "pending pickup" ||
//                           selectedStatus === "out for delivery" ||
//                           selectedStatus === "delivered" ||
//                           selectedStatus === "picked" ||
//                           selectedStatus === "in transit" ||
//                           selectedStatus === "undelivered assigned") && (
//                             <>
//                               <th className="text-left whitespace-nowrap px-6 py-3">RIDER ID/VENDOR ID</th>

//                             </>
//                           )}

//                         <th className="text-left whitespace-nowrap px-6  py-3">
//                           CONSIGNEE ADDRESS
//                         </th>
//                         <th className="text-left whitespace-nowrap px-6 py-3">PACKAGE DETAILS</th>

//                         {/* <th className="text-left whitespace-nowrap px-6  py-3">ASSIGNMENT/RIDER</th> */}
//                         {/* <th className="text-left whitespace-nowrap  px-6 py-3">MAPPED/VENDOR</th> */}
//                         <th className="text-left whitespace-nowrap px-6  py-3">STATUS</th>
//                         {
//                           selectedStatus === 'booked' && (

//                             <th className="text-left whitespace-nowrap  py-3">ELIGIBLE VENDORS</th>
//                           )
//                         }
//                       </tr>
//                     </thead>
//                     <tbody className="text-gray-700 text-sm">
//                       {loading ? (
//                         <>
//                           <div>
//                             <div>
//                               <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//                               <p className="mt-2">Loading orders...</p>
//                             </div>
//                           </div>
//                         </>
//                       ) : orders.length == 0 ? (
//                         <tr>
//                           <td
//                             colSpan="6"
//                             className="text-center px-6 py-6 text-gray-500"
//                           >
//                             No orders found.
//                           </td>
//                         </tr>
//                       ) : (
//                         orders.map((order) => {

//                           let isSelected;
//                           if (selectedStatus === "booked") {
//                             isSelected = selectedBulkOrders.some(
//                               (o) => o.id === order.id
//                             );
//                           } else if (selectedStatus === "pending pickup") {
//                             isSelected = selectedBulkOrders.some(
//                               (o) => o.id === order.id
//                             );
//                           }else{
//                             isSelected = selectedBulkOrders.some(
//                               (o) => o.id === order.id
//                             );
//                           }
//                           return (
//                             <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800 border-b overflow-x-scroll">
//                               {/* Select */}
//                               {(
//                                 selectedStatus === "All" ||
//                                 selectedStatus === "booked" ||
//                                 selectedStatus === "out for delivery" ||
//                                 selectedStatus === "undelivered" ||
//                                 selectedStatus === "undelivered assigned" ||
//                                 selectedStatus === "rto in transit" || selectedStatus==='rto out for delivery' || selectedStatus == 'rto undelivered'  && (order.tpc_awb_number == null) || selectedStatus === "pending pickup" && order.tpc_awb_number == null) ? (
                               

//                                 <td className="px-6 py-4 text-center">
//                                     {(() => {
//                                       // =========================================
//                                       // ONLY PENDING PICKUP:
//                                       // Mapped + Unmapped orders ko mix nahi karna
//                                       // =========================================
//                                       const currentIsMapped =
//                                         order?.mapped_with !== null &&
//                                         order?.mapped_with !== undefined;

//                                       const firstSelectedIsMapped =
//                                         selectedBulkOrders.length > 0
//                                           ? selectedBulkOrders[0]?.mapped_with !== null &&
//                                             selectedBulkOrders[0]?.mapped_with !== undefined
//                                           : null;

//                                       const isDifferentMappingType =
//                                         selectedStatus === "pending pickup" &&
//                                         selectedBulkOrders.length > 0 &&
//                                         firstSelectedIsMapped !== currentIsMapped;

//                                       // Pending Pickup me opposite mapping type
//                                       // checkbox ki jagah -- show karega
//                                       if (isDifferentMappingType) {
//                                         return (
//                                           <span
//                                             className="text-sm font-medium text-gray-400 dark:text-gray-500"
//                                             title={
//                                               firstSelectedIsMapped
//                                                 ? "Only mapped orders can be selected"
//                                                 : "Only unmapped orders can be selected"
//                                             }
//                                           >
//                                             --
//                                           </span>
//                                         );
//                                       }

//                                       return (
//                                         <input
//                                           type="checkbox"
//                                           checked={isSelected}
//                                           onChange={(e) => {
//                                             const isChecked = e.target.checked;

//                                             if (
//                                               (selectedStatus === "All" ||
//                                               selectedStatus === "booked" ||
//                                               selectedStatus === "pending pickup" ||
//                                               selectedStatus === "in transit" ||
//                                               selectedStatus === "out for delivery" ||
//                                               selectedStatus === "undelivered" ||
//                                               selectedStatus === "undelivered assigned" ||
//                                               selectedStatus === "rto in transit" || 
//                                               selectedStatus === "rto undelivered" || 
//                                               selectedStatus === "rto out for delivery") && 
//                                               order.status != 'cancelled'
//                                             ) {
//                                               if (isChecked) {
//                                                 // =========================================
//                                                 // ONLY PENDING PICKUP CHECK
//                                                 // =========================================
//                                                 if (
//                                                   selectedStatus === "pending pickup" &&
//                                                   selectedBulkOrders.length > 0
//                                                 ) {
//                                                   const firstIsMapped =
//                                                     selectedBulkOrders[0]?.mapped_with !== null &&
//                                                     selectedBulkOrders[0]?.mapped_with !== undefined;

//                                                   const thisIsMapped =
//                                                     order?.mapped_with !== null &&
//                                                     order?.mapped_with !== undefined;

//                                                   // Mapped + Unmapped mix nahi hone dena
//                                                   if (firstIsMapped !== thisIsMapped) {
//                                                     return;
//                                                   }
//                                                 }

//                                                 // =========================================
//                                                 // EXISTING LOGIC - SAME
//                                                 // =========================================
//                                                 setSelectedBulkOrders((prev) => {
//                                                   const updated = [...prev, order];

//                                                   const order_ids = updated.map(
//                                                     (o) => o.id
//                                                   );

//                                                   if (
//                                                     ![
//                                                       "rto in transit",
//                                                       "booked",
//                                                     ].includes(selectedStatus)
//                                                   ) {
                                                   
//                                                     fetchVendor(order_ids);
//                                                   }

//                                                   return updated;
//                                                 });

//                                                 setBulkOrderWeight(
//                                                   (prev) =>
//                                                     Number(prev) +
//                                                     Number(order.total_weight)
//                                                 );
//                                               } else {
//                                                 // =========================================
//                                                 // EXISTING UNCHECK LOGIC - SAME
//                                                 // =========================================
//                                                 setSelectedBulkOrders((prev) => {
//                                                   const updated = prev.filter(
//                                                     (o) => o.id !== order.id
//                                                   );

//                                                   const order_ids = updated.map(
//                                                     (o) => o.id
//                                                   );

//                                                   // if (
//                                                   //   selectedStatus !== "rto in transit"
//                                                   // ) {
//                                                   //   fetchVendor(order_ids);
//                                                   // }

//                                                   return updated;
//                                                 });

//                                                 setBulkOrderWeight(
//                                                   (prev) =>
//                                                     Number(prev) -
//                                                     Number(order.total_weight)
//                                                 );
//                                               }
//                                             }
//                                           }}
//                                           className="h-4 w-4 rounded border-gray-300 text-[#0446DB]"
//                                         />
//                                       );
//                                     })()}
//                                   </td>
//                               ) : selectedStatus === "picked"  && order?.pickup_stage === "at_central_hub" ? (
//                                 <td className="px-6 py-4 text-center">
//                                   <input
//                                     type="checkbox"
//                                     checked={selectedBulkOrders.some((item) => item.id === order.id)}
//                                     onChange={(e) => handleBulkOrderSelect(order, e.target.checked)}
//                                     className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
//                                   />
//                                 </td>
//                               ) :(
//                                 <>
//                                   <td className="px-6 py-4 text-center">
//                                     -
//                                   </td>
//                                 </>
//                               )}

//                               {/* Order ID */}
//                               <td className=" py-4 whitespace-pre-line">
//                                 <p className="text-l text-gray-800 flex items-center">
//                                   <a
//                                     href={`${frontEndURL}/track-order?awb_number=${order.awb_number}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="underline text-blue-700 hover:text-blue-500"
//                                   >
//                                     {order.awb_number}
//                                   </a>
//                                   <button
//                                     className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
//                                     onClick={() => {
//                                       navigator.clipboard.writeText(
//                                         order.awb_number
//                                       );
//                                       setCopySuccess(order.awb_number);
//                                       setTimeout(() => {
//                                         setCopySuccess(null);
//                                       }, 2000);
//                                     }}
//                                   >
//                                     {copySuccess === order.awb_number ? (
//                                       <CiCircleCheck />
//                                     ) : (
//                                       <FaRegCopy />
//                                     )}
//                                   </button>
                                  
                                  

//                                   <Dialog>
//                               <DialogTrigger asChild>
//                                 <Button
//                                   variant="outline"
//                                   className="inline-flex cursor-pointer items-center justify-center text-xs font-medium text-red-600"
//                                 >
//                                   <TbFileInfo />
//                                 </Button>
//                               </DialogTrigger>

//                               <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl dark:border-neutral-800 dark:bg-neutral-900">
//                                 <DialogHeader>
//                                   <DialogTitle className="text-gray-900 dark:text-white">
//                                     Order Details
//                                   </DialogTitle>
//                                 </DialogHeader>

//                                 <div className="space-y-5 bg-white p-6 text-gray-700 dark:bg-neutral-900 dark:text-neutral-300">
//                                   {/* ================= BASIC DETAILS ================= */}

//                                   <div>
//                                     <h3 className="mb-3 font-semibold text-[#0446DB] dark:text-blue-400">
//                                       Basic Details
//                                     </h3>

//                                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                                       {/* Order ID */}
//                                       <div>
//                                         <strong>Order ID:</strong>{" "}
//                                         {order?.merchant_order_id || "N/A"}

//                                         {order?.merchant_order_id && (
//                                           <button
//                                             type="button"
//                                             className="pl-2 text-lg text-gray-600 transition hover:text-[#0446DB] dark:text-neutral-400"
//                                             onClick={() => {
//                                               navigator.clipboard.writeText(
//                                                 order.merchant_order_id
//                                               );

//                                               setCopySuccess(order.merchant_order_id);

//                                               setTimeout(() => {
//                                                 setCopySuccess(null);
//                                               }, 2000);
//                                             }}
//                                           >
//                                             {copySuccess === order?.merchant_order_id ? (
//                                               <CiCircleCheck />
//                                             ) : (
//                                               <FaRegCopy />
//                                             )}
//                                           </button>
//                                         )}
//                                       </div>

//                                       {/* AWB */}
//                                       <div>
//                                         <strong>AWB No:</strong>{" "}
//                                         {order?.awb_number || "N/A"}

//                                         {order?.awb_number && (
//                                           <button
//                                             type="button"
//                                             className="pl-2 text-lg text-gray-600 transition hover:text-[#0446DB] dark:text-neutral-400"
//                                             onClick={() => {
//                                               navigator.clipboard.writeText(
//                                                 order.awb_number
//                                               );

//                                               setCopySuccess(order.awb_number);

//                                               setTimeout(() => {
//                                                 setCopySuccess(null);
//                                               }, 2000);
//                                             }}
//                                           >
//                                             {copySuccess === order?.awb_number ? (
//                                               <CiCircleCheck />
//                                             ) : (
//                                               <FaRegCopy />
//                                             )}
//                                           </button>
//                                         )}
//                                       </div>

//                                       <div>
//                                         <strong>Order Type:</strong>{" "}
//                                         {order?.order_type === "cod"
//                                           ? "COD"
//                                           : "Prepaid"}
//                                       </div>

//                                       <div>
//                                         <strong>Order Specific:</strong>{" "}
//                                         {order?.order_specific || "N/A"}
//                                       </div>

//                                       <div>
//                                         <strong>Order Status:</strong>{" "}
//                                         {order?.status
//                                           ? toCapitalizeEachWord(order.status)
//                                           : "N/A"}
//                                       </div>

//                                       <div>
//                                         <strong>Total Amount:</strong>{" "}
//                                         ₹
//                                         {Number(
//                                           order?.total_amount || 0
//                                         ).toLocaleString()}
//                                       </div>

//                                       <div>
//                                         <strong>Order Weight:</strong>{" "}
//                                         {Number(
//                                           order?.total_weight || 0
//                                         ).toLocaleString()}
//                                         g
//                                       </div>

//                                       <div>
//                                         <strong>Charge Weight:</strong>{" "}
//                                         {Number(
//                                           order?.charged_weight || 0
//                                         ).toLocaleString()}
//                                         g
//                                       </div>

//                                       <div>
//                                         <strong>Number of Packets:</strong>{" "}
//                                         {order?.number_of_boxes || "N/A"}
//                                       </div>
//                                     </div>
//                                   </div>

//                                   {/* ================= DELIVERY DETAILS ================= */}

//                                   <div className="border-t border-gray-200 pt-4 dark:border-neutral-800">
//                                     <div className="mb-3 flex items-center justify-between">
//                                       <h3 className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                         Delivery Details
//                                       </h3>
                                    
//                                       {
//                                         (permissions.includes('UPDATE_ORD_DETAILS') ||  permissions.includes('ADMIN_FULL_ACCESS')) && (

//                                       <Button
//                                         variant="outline"
//                                         size="sm"
//                                         onClick={() => {
//                                           if (editingDeliveryId === order?.id) {
//                                             handleUpdateDeliveryDetails({
//                                               order_id: order.id,
//                                               delivery_details:
//                                                 deliveryFormData,
//                                             });
//                                           } else {
//                                             setEditingDeliveryId(order.id);

//                                             setDeliveryFormData({
//                                               delivery_contact_name:
//                                                 order?.delivery_contact_name,
//                                               delivery_address_line:
//                                                 order?.delivery_address_line,
//                                               delivery_city:
//                                                 order?.delivery_city,
//                                               delivery_state:
//                                                 order?.delivery_state,
//                                               delivery_pincode:
//                                                 order?.delivery_pincode,
//                                             });
//                                           }
//                                         }}
//                                         className="cursor-pointer text-xs"
//                                       >
//                                         {editingDeliveryId === order?.id
//                                           ? "Save"
//                                           : "Edit"}
//                                       </Button>
//                                         )
//                                       }

//                                     </div>

//                                     {editingDeliveryId === order?.id ? (
//                                       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                                         <div>
//                                           <label className="mb-1 block text-xs text-gray-600 dark:text-neutral-400">
//                                             Customer Name
//                                           </label>

//                                           <input
//                                             type="text"
//                                             value={
//                                               deliveryFormData.delivery_contact_name
//                                             }
//                                             onChange={(e) =>
//                                               setDeliveryFormData((prev) => ({
//                                                 ...prev,
//                                                 delivery_contact_name:
//                                                   e.target.value,
//                                               }))
//                                             }
//                                             className="w-full rounded-md border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
//                                           />
//                                         </div>

//                                         <div>
//                                           <label className="mb-1 block text-xs text-gray-600 dark:text-neutral-400">
//                                             Address
//                                           </label>

//                                           <input
//                                             type="text"
//                                             value={
//                                               deliveryFormData.delivery_address_line
//                                             }
//                                             onChange={(e) =>
//                                               setDeliveryFormData((prev) => ({
//                                                 ...prev,
//                                                 delivery_address_line:
//                                                   e.target.value,
//                                               }))
//                                             }
//                                             className="w-full rounded-md border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
//                                           />
//                                         </div>

//                                         <div>
//                                           <label className="mb-1 block text-xs text-gray-600 dark:text-neutral-400">
//                                             City
//                                           </label>

//                                           <input
//                                             type="text"
//                                             value={deliveryFormData.delivery_city}
//                                             onChange={(e) =>
//                                               setDeliveryFormData((prev) => ({
//                                                 ...prev,
//                                                 delivery_city: e.target.value,
//                                               }))
//                                             }
//                                             className="w-full rounded-md border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
//                                           />
//                                         </div>

//                                         <div>
//                                           <label className="mb-1 block text-xs text-gray-600 dark:text-neutral-400">
//                                             State
//                                           </label>

//                                           <input
//                                             type="text"
//                                             value={deliveryFormData.delivery_state}
//                                             onChange={(e) =>
//                                               setDeliveryFormData((prev) => ({
//                                                 ...prev,
//                                                 delivery_state: e.target.value,
//                                               }))
//                                             }
//                                             className="w-full rounded-md border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
//                                           />
//                                         </div>

//                                         <div>
//                                           <label className="mb-1 block text-xs text-gray-600 dark:text-neutral-400">
//                                             Pincode
//                                           </label>

//                                           <input
//                                             type="text"
//                                             value={
//                                               deliveryFormData.delivery_pincode
//                                             }
//                                             onChange={(e) =>
//                                               setDeliveryFormData((prev) => ({
//                                                 ...prev,
//                                                 delivery_pincode:
//                                                   e.target.value,
//                                               }))
//                                             }
//                                             className="w-full rounded-md border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
//                                           />
//                                         </div>

//                                         <div className="flex items-end">
//                                           <Button
//                                             variant="ghost"
//                                             size="sm"
//                                             onClick={() =>
//                                               setEditingDeliveryId(null)
//                                             }
//                                             className="cursor-pointer text-red-500"
//                                           >
//                                             Cancel
//                                           </Button>
//                                         </div>
//                                       </div>
//                                     ) : (
//                                       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                                         <div>
//                                           <strong>Customer Name:</strong>{" "}
//                                           {order?.delivery_contact_name ||
//                                             "N/A"}
//                                         </div>

//                                         <div>
//                                           <strong>Address:</strong>{" "}
//                                           {order?.delivery_address_line ||
//                                             "N/A"}
//                                         </div>

//                                         <div>
//                                           <strong>City:</strong>{" "}
//                                           {order?.delivery_city ||
//                                           order?.delivery_state ||
//                                           order?.delivery_pincode
//                                             ? `${order?.delivery_city || ""}, ${
//                                                 order?.delivery_state || ""
//                                               } - ${
//                                                 order?.delivery_pincode || ""
//                                               }`
//                                             : "N/A"}
//                                         </div>
//                                       </div>
//                                     )}
//                                   </div>

//                                   {/* ================= PICKUP DETAILS ================= */}

//                                   <div className="border-t border-gray-200 pt-4 dark:border-neutral-800">
//                                     <div className="mb-3 flex items-center justify-between">
//                                       <h3 className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                         Pickup Details
//                                       </h3>
//                                       {
//                                         (permissions.includes('UPDATE_ORD_DETAILS') || permissions.includes('ADMIN_FULL_ACCESS')) && (

//                                       <Button
//                                         variant="outline"
//                                         size="sm"
//                                         onClick={() => {
//                                           if (editingPickupId === order?.id) {
//                                             handleUpdateDeliveryDetails({
//                                               order_id: order.id,
//                                               pickup_details:
//                                                 pickupFormData,
//                                             });
//                                           } else {
//                                             setEditingPickupId(order.id);

//                                             setPickupFormData({
//                                               pickup_contact_name:
//                                                 order?.pickup_contact_name ||
//                                                 "",
//                                               pickup_phone:
//                                                 order?.pickup_phone || "",
//                                               pickup_address_line:
//                                                 order?.pickup_address_line ||
//                                                 "",
//                                               pickup_city:
//                                                 order?.pickup_city || "",
//                                               pickup_state:
//                                                 order?.pickup_state || "",
//                                               pickup_pincode:
//                                                 order?.pickup_pincode || "",
//                                             });
//                                           }
//                                         }}
//                                         className="cursor-pointer text-xs"
//                                       >
//                                         {editingPickupId === order?.id
//                                           ? "Save"
//                                           : "Edit"}
//                                       </Button>
//                                         )
//                                       }

//                                     </div>

//                                     {editingPickupId === order?.id ? (
//                                       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                                         <div>
//                                           <label className="mb-1 block text-xs text-gray-600 dark:text-neutral-400">
//                                             Name
//                                           </label>

//                                           <input
//                                             type="text"
//                                             value={
//                                               pickupFormData.pickup_contact_name
//                                             }
//                                             onChange={(e) =>
//                                               setPickupFormData((prev) => ({
//                                                 ...prev,
//                                                 pickup_contact_name:
//                                                   e.target.value,
//                                               }))
//                                             }
//                                             className="w-full rounded-md border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
//                                           />
//                                         </div>

//                                         <div>
//                                           <label className="mb-1 block text-xs text-gray-600 dark:text-neutral-400">
//                                             Phone No
//                                           </label>

//                                           <input
//                                             type="text"
//                                             value={pickupFormData.pickup_phone}
//                                             onChange={(e) =>
//                                               setPickupFormData((prev) => ({
//                                                 ...prev,
//                                                 pickup_phone: e.target.value,
//                                               }))
//                                             }
//                                             className="w-full rounded-md border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
//                                           />
//                                         </div>

//                                         <div>
//                                           <label className="mb-1 block text-xs text-gray-600 dark:text-neutral-400">
//                                             Address
//                                           </label>

//                                           <input
//                                             type="text"
//                                             value={
//                                               pickupFormData.pickup_address_line
//                                             }
//                                             onChange={(e) =>
//                                               setPickupFormData((prev) => ({
//                                                 ...prev,
//                                                 pickup_address_line:
//                                                   e.target.value,
//                                               }))
//                                             }
//                                             className="w-full rounded-md border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
//                                           />
//                                         </div>

//                                         <div>
//                                           <label className="mb-1 block text-xs text-gray-600 dark:text-neutral-400">
//                                             City
//                                           </label>

//                                           <input
//                                             type="text"
//                                             value={pickupFormData.pickup_city}
//                                             onChange={(e) =>
//                                               setPickupFormData((prev) => ({
//                                                 ...prev,
//                                                 pickup_city: e.target.value,
//                                               }))
//                                             }
//                                             className="w-full rounded-md border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
//                                           />
//                                         </div>

//                                         <div>
//                                           <label className="mb-1 block text-xs text-gray-600 dark:text-neutral-400">
//                                             State
//                                           </label>

//                                           <input
//                                             type="text"
//                                             value={pickupFormData.pickup_state}
//                                             onChange={(e) =>
//                                               setPickupFormData((prev) => ({
//                                                 ...prev,
//                                                 pickup_state: e.target.value,
//                                               }))
//                                             }
//                                             className="w-full rounded-md border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
//                                           />
//                                         </div>

//                                         <div>
//                                           <label className="mb-1 block text-xs text-gray-600 dark:text-neutral-400">
//                                             Pincode
//                                           </label>

//                                           <input
//                                             type="text"
//                                             value={
//                                               pickupFormData.pickup_pincode
//                                             }
//                                             onChange={(e) =>
//                                               setPickupFormData((prev) => ({
//                                                 ...prev,
//                                                 pickup_pincode:
//                                                   e.target.value,
//                                               }))
//                                             }
//                                             className="w-full rounded-md border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
//                                           />
//                                         </div>

//                                         <div className="flex items-end">
//                                           <Button
//                                             variant="ghost"
//                                             size="sm"
//                                             onClick={() =>
//                                               setEditingPickupId(null)
//                                             }
//                                             className="cursor-pointer text-red-500"
//                                           >
//                                             Cancel
//                                           </Button>
//                                         </div>
//                                       </div>
//                                     ) : (
//                                       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                                         <div>
//                                           <strong>Name:</strong>{" "}
//                                           {order?.pickup_contact_name ||
//                                             "N/A"}
//                                         </div>

//                                         <div>
//                                           <strong>Pickup Phone No:</strong>{" "}
//                                           {order?.pickup_phone || "N/A"}
//                                         </div>

//                                         <div>
//                                           <strong>Address:</strong>{" "}
//                                           {order?.pickup_address_line ||
//                                             "N/A"}
//                                         </div>

//                                         <div>
//                                           <strong>City:</strong>{" "}
//                                           {order?.pickup_city ||
//                                           order?.pickup_state ||
//                                           order?.pickup_pincode
//                                             ? `${order?.pickup_city || ""}, ${
//                                                 order?.pickup_state || ""
//                                               } - ${
//                                                 order?.pickup_pincode || ""
//                                               }`
//                                             : "N/A"}
//                                         </div>
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>

//                                 {/* ================= FOOTER ================= */}

//                                 <DialogFooter>
//                                   <DialogClose asChild>
//                                     <button
//                                       type="button"
//                                       onClick={() => {
//                                         navigate(
//                                           `/user/order-history?awb=${order?.awb_number}`
//                                         );
//                                       }}
//                                       className="mr-2 cursor-pointer rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
//                                     >
//                                       Get History
//                                     </button>
//                                   </DialogClose>

//                                   <DialogClose asChild>
//                                     <Button
//                                       type="button"
//                                       onClick={() => {
//                                         clearAllState();
//                                       }}
//                                       variant="outline"
//                                       className="cursor-pointer"
//                                     >
//                                       Cancel
//                                     </Button>
//                                   </DialogClose>
//                                 </DialogFooter>
//                               </DialogContent>
//                             </Dialog>
//                                 </p>
//                                 {order.tpc_awb_number && (
//                                   <p>
//                                     {order.tpc_awb_number}
//                                     <button
//                                       className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
//                                       onClick={() => {
//                                         navigator.clipboard.writeText(
//                                           order.tpc_awb_number
//                                         );
//                                         setCopySuccess(order.tpc_awb_number);
//                                         setTimeout(() => {
//                                           setCopySuccess(null);
//                                         }, 2000);
//                                       }}
//                                     >
//                                       {copySuccess === order.tpc_awb_number ? (
//                                         <CiCircleCheck />
//                                       ) : (
//                                         <FaRegCopy />
//                                       )}
//                                     </button>
//                                   </p>
//                                 )}

//                                 <p className="text-s text-gray-500 dark:text-white">
//                                   {new Date(order.created_at).toLocaleString(
//                                     "en-IN",
//                                     {
//                                       timeZone: "Asia/Kolkata",
//                                       day: "2-digit",
//                                       month: "2-digit",
//                                       year: "numeric",
//                                       hour: "2-digit",
//                                       minute: "2-digit",
//                                       hour12: true,
//                                     }
//                                   )}
//                                 </p>

//                                 <p className="text-s text-gray-400 dark:text-white">
//                                   Merchant ID: {order.merchant_id}
//                                   <span
//                                   className={`inline-flex items-center gap-1.5 rounded-full border border-dashed px-2.5 py-1 text-xs font-semibold ${
//                                     order.rider_preference === "daakit"
//                                       ? "border-blue-500 bg-blue-50/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
//                                       : "border-emerald-500 bg-emerald-50/50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
//                                   }`}
//                                 >
//                                   {order.rider_preference === "daakit" ? "DDN" : "BYOB"}
//                                 </span>
//                                 </p>
//                                 <p className="text-s text-gray-400 dark:text-white">
//                                   Merchant Order ID:{" "}
//                                   {order.merchant_order_id?.length <= 20
//                                     ? order.merchant_order_id
//                                     : `${order.merchant_order_id.slice(
//                                       0,
//                                       20
//                                     )}...`}
//                                   <button
//                                     className="pl-2 text-lg text-gray-600 dark:text-white hover:text-[#0446DB] transition"
//                                     onClick={() => {
//                                       navigator.clipboard.writeText(
//                                         order.merchant_order_id
//                                       );
//                                       setCopySuccess(order.merchant_order_id);
//                                       setTimeout(() => {
//                                         setCopySuccess(null);
//                                       }, 2000);
//                                     }}
//                                   >
//                                     {copySuccess === order.merchant_order_id ? (
//                                       <CiCircleCheck />
//                                     ) : (
//                                       <FaRegCopy />
//                                     )}
//                                   </button>
//                                   {/* <span className="bg-[#0446DB] px-2 text-white rounded">{order.rider_preference === 'daakit' ? "Daakit" : "Self"}</span> */}
//                                 </p>
//                               </td>

//                               <td className=" py-2">
//                               <div className="flex flex-col gap-1.5 text-sm">
//                                 <p className="text-gray-700 dark:text-gray-300">
//                                   <span className="font-medium text-gray-900 dark:text-white">
//                                     Merchant ID:
//                                   </span>{" "}
//                                   {order?.merchant_id ?? "N/A"}
//                                 </p>

//                                 {order?.brand_name && (
//                                   <p className="text-gray-700 dark:text-gray-300">
//                                     <span className="font-medium text-gray-900 dark:text-white">
//                                       Brand Name:
//                                     </span>{" "}
//                                     {order.brand_name}
//                                   </p>
//                                 )}

//                                 {order?.merchant_company_name && (
//                                   <p className="text-gray-700 dark:text-gray-300">
//                                     <span className="font-medium text-gray-900 dark:text-white">
//                                       Company Name:
//                                     </span>{" "}
//                                     {order.merchant_company_name}
//                                   </p>
//                                 )}
//                               </div>
//                             </td>

//                               {(selectedStatus === "pending pickup" ||
//                                 selectedStatus === "out for delivery" ||
//                                 selectedStatus === "delivered" ||
//                                 selectedStatus === "picked" ||
//                                 selectedStatus === "in transit" ||
//                                 selectedStatus === "undelivered assigned") && (
//                                   <>

//                                     <td className="text-center ">
//                                       {
//                                         order.rider_vendor_id === null && order.rider_merchant_id === null && order.mapped_with === null ? (
//                                           <>
//                                             {order.rider_id !== null ? `DKT_` : ""}
//                                             {order.rider_id}
//                                           </>
//                                         ) : (
//                                           <>
//                                             {order.rider_id !== null ? `FP_${order.rider_vendor_id}_` : order.rider_merchant_id ? `M${order.r_merchant_id}_R` : order.mapped_with ? `FP_${order.mapped_with}` : "DKT_"}
//                                             {order.rider_id}
//                                           </>
//                                         )
//                                       }

//                                       {
//                                         selectedStatus === "picked" && (
//                                           <p>
//                                             {order.pickup_stage === "at_central_hub"
//                                               ? "At Central Hub"
//                                               : "At Vendor Hub"}
//                                           </p>
//                                         )
//                                       }

//                                     </td>

//                                   </>
//                                 )}


//                               {/* Address */}
//                               <td className="px-6 py-1 whitespace-pre-line">
//                                 <p className="font-medium text-gray-800 dark:text-white">
//                                   {order.delivery_contact_name}
//                                 </p>
//                                 <HoverCard>
//                                   <HoverCardTrigger>{order.delivery_address_line.slice(0, 30)}...</HoverCardTrigger>
//                                   <HoverCardContent
//                                     className='bg-[#0446DB] text-white'
//                                   >
//                                     {order.delivery_address_line} {order.delivery_city}, {order.delivery_state} -{" "}
//                                     {order.delivery_pincode}
//                                   </HoverCardContent>
//                                 </HoverCard>
//                                 <p className="text-xs text-gray-500 dark:text-white">
//                                   {order.delivery_city}, {order.delivery_state} -{" "}
//                                   {order.delivery_pincode}
//                                 </p>

//                                 <p className="text-xs text-gray-400">
//                                   {order.delivery_country}
//                                 </p>
//                               </td>

//                               {/* Package Details */}
//                               <td className="px-6 py-4">
//                                 <p>
//                                   {selectedStatus !== "cancelled" && (
//                                     <span className=" whitespace-nowrap dark:text-white">
//                                       EDD:{" "}
//                                       {/* {(() => {
//                                           const raw = new Date(order.created_at);
//                                           const prefix =
//                                             order.order_specific?.slice(0, 3);

//                                           if (order.order_specific === "Turant") {
//                                             // Add 4 hours
//                                             raw.setHours(raw.getHours() + 4);
//                                           } else if (prefix === "SDD") {
//                                             // Set time to 8:00 PM same day
//                                             raw.setHours(20, 0, 0, 0);
//                                           } else if (prefix === "NDD") {
//                                             // Next day at 8:00 PM
//                                             raw.setDate(raw.getDate() + 1);
//                                             raw.setHours(20, 0, 0, 0);
//                                           }

//                                           return raw.toLocaleString("en-IN", {
//                                             timeZone: "Asia/Kolkata",
//                                             day: "2-digit",
//                                             month: "2-digit",
//                                             year: "numeric",
//                                             hour: "2-digit",
//                                             minute: "2-digit",
//                                             hour12: true,
//                                           });
//                                         })()} */}
//                                       {order.EDD}
//                                     </span>
//                                   )}
//                                 </p>

//                                 <p>
//                                   <span className="font-medium text-gray-800 dark:text-white">
//                                     Weight:
//                                   </span>{" "}
//                                   <span className="dark:text-white">{Number(order.total_weight).toLocaleString()}g</span>
//                                   {selectedStatus !== "cancelled" && (
//                                     <span
//                                       className={`ml-2 px-2 py-0.5  rounded-full text-sm font-semibold shadow-sm ${order.order_specific?.slice(0, 3) ===
//                                         "NDD"
//                                         ? "text-green-800 bg-green-100 border border-green-300"
//                                         : order.order_specific?.slice(0, 3) ===
//                                           "SDD"
//                                           ? "text-yellow-800 bg-yellow-100 border border-yellow-300"
//                                           : "text-red-800 bg-red-100 border border-red-300 animate-blink"
//                                         }`}
//                                     >
//                                       {order.order_specific?.slice(0, 3) === "NDD"
//                                         ? "NDD"
//                                         : order.order_specific?.slice(0, 3) ===
//                                           "SDD"
//                                           ? "SDD"
//                                           : order.order_specific?.slice(0, 6) ===
//                                             "Turant"
//                                             ? "Turant"
//                                             : order.order_specific}
//                                     </span>
//                                   )}
//                                 </p>
//                                 <p>
//                                   <span className="font-medium dark:text-white text-gray-800">
//                                     Dimensions:
//                                   </span>{" "}
//                                   <span className=" dark:text-white">
//                                     {order.package_length}x{order.package_breadth}x
//                                     {order.package_height}
//                                   </span>
//                                 </p>
//                               </td>

//                               {/* Assignment */}
//                               {/* {
//                                 selectedStatus === "All" ? (
//                                   <>
//                                     <td className="px-6 py-4 text-center">
//                                       {
//                                         order.status === "booked" ||
//                                           order.status === "undelivered" ? (
//                                           <>
//                                             {!(
//                                               isOpenIndividualAssignmnet === order.id

//                                             ) ? (
//                                               <span

//                                                 className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer"
//                                               >
//                                                 Not Assigned
//                                               </span>
//                                             ) : (
//                                               <></>
//                                             )}
//                                           </>
//                                         ) : order.status === "pending pickup" ||
//                                           order.status === "in transit" ||
//                                           order.status === "picked" ||
//                                           order.status === "out for delivery" ||
//                                           order.status === "undelivered assigned" ? (
//                                           <>
//                                             {!(
//                                               isOpenIndividualAssignmnet === order.id
//                                             ) ? (
//                                               order.mapped_with !== null ? (
//                                                 <span

//                                                   className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer"
//                                                 >
//                                                   Not Assigned
//                                                 </span>
//                                               ) : order.rider_id == null ? (
//                                                 <>
//                                                   <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
//                                                     Not Mapped
//                                                   </span>
//                                                 </>
//                                               ) : (
//                                                 <span

//                                                   className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 mb-2 inline-block cursor-pointer"
//                                                 >
//                                                   Assigned
//                                                 </span>
//                                               )
//                                             ) : (
//                                               <>
//                                               </>
//                                             )}
//                                           </>
//                                         ) : order.status === "cancelled" ? (
//                                           <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
//                                             Order Canceled
//                                           </span>
//                                         ) : order.status === "delivered" ? (
//                                           <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                             Assigned
//                                           </span>
//                                         ) : order.status === "rto delivered" ? (
//                                           <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                             Return To Origin
//                                           </span>
//                                         ) : (

//                                           <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                             Assigned
//                                           </span>
//                                         )}
//                                     </td>
//                                   </>
//                                 ) : (
//                                   <>
//                                     <td className="px-6 py-4 text-center">
//                                       {order.status === "booked" ||
//                                         order.status === "undelivered" ? (
//                                         <>

//                                           <span
//                                             onClick={() => {

//                                               // alert(order.status==="undelivered" && order.mapped_with !== null)
//                                               if (order.status === "undelivered" && order.mapped_with !== null) {
//                                                 return
//                                               }
//                                               if (order.tpc_awb_number !== null) {
//                                                 return
//                                               }

//                                             }}
//                                             className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer"
//                                           >
//                                             Not Assigned
//                                           </span>

//                                         </>
//                                       ) : order.status === "picked" && order.rider_id == null ? (
//                                         <>
//                                           <span

//                                             className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer"
//                                           >
//                                             Not Assigned
//                                           </span>
//                                         </>
//                                       ) : order.status === "pending pickup" ||
//                                         order.status === "in transit" ||
//                                         order.status === "picked" ||
//                                         order.status === "undelivered assigned" ? (
//                                         <>
//                                           {!(
//                                             isOpenIndividualAssignmnet === order.id
//                                           ) ? (
//                                             order.mapped_with !== null || order.rider_id == null ? (
//                                               <span

//                                                 className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer"
//                                               >
//                                                 Not Assigned
//                                               </span>
//                                             ) : (
//                                               <span
//                                                 onClick={() => {
//                                                   if (order.status === "in transit") {
//                                                     return;
//                                                   }
//                                                   if (order.tpc_awb_number !== null) {
//                                                     return
//                                                   }
//                                                   setIsOpenIndividualAssignmnet(order.id);

//                                                 }}
//                                                 className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 mb-2 inline-block cursor-pointer"
//                                               >
//                                                 Assigned
//                                               </span>
//                                             )

//                                           ) : (
//                                             <form
//                                               onSubmit={(e) => {
//                                                 e.preventDefault();
//                                                 cancelRiderAssignment(order.id);
//                                                 setIsOpenIndividualAssignmnet("");
//                                               }}
//                                               className="flex items-center gap-2"
//                                             >
//                                               <button
//                                                 type="submit"
//                                                 className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
//                                               >
//                                                 Cancel Rider Assignment
//                                               </button>
//                                               <button
//                                                 type="button"
//                                                 className="text-xs  text-gray-500 hover:underline"
//                                                 onClick={() =>
//                                                   setIsOpenIndividualAssignmnet("")
//                                                 }
//                                               >
//                                                 Close
//                                               </button>
//                                             </form>
//                                           )}
//                                         </>
//                                       ) : order.status === "cancelled" ? (
//                                         <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
//                                           Order Canceled
//                                         </span>
//                                       ) : order.status === "delivered" ? (

//                                         <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                           Assigned
//                                         </span>
//                                       ) : order.status === "rto delivered" ? (
//                                         <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                           Return To Origin
//                                         </span>
//                                       ) : (

//                                         <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                           Assigned
//                                         </span>
//                                       )}
//                                     </td>
//                                   </>
//                                 )
//                               } */}

//                               {/* Map */}
//                               {/* {
//                                 selectedStatus === "All" ? (
//                                   <>
//                                     <td className="px-6 py-4 text-center">
//                                       {order.mapped_with === null ? (
//                                         <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-red-100 text-red-600">
//                                           Not Mapped
//                                         </span>
//                                       ) : order.status === "cancelled" ? (
//                                         <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-red-100 text-red-600">
//                                           Order Canceled
//                                         </span>
//                                       ) : order.status === "delivered" ? (
//                                         <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                           Order Delivered
//                                         </span>
//                                       ) : order.status === "rto delivered" ? (
//                                         <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                           Return To Origin
//                                         </span>
//                                       ) : (order.mapped_with !== null) ? (
//                                         <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                           Mapped
//                                         </span>
//                                       ) : (
//                                         <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                           Mapped
//                                         </span>
//                                       )}
//                                     </td>
//                                   </>
//                                 ) : (
//                                   <>
//                                     <td className="px-6 py-4 text-center">
//                                       {order.status === "booked" ? (
//                                         <>
//                                           {!(
//                                             isOpenIndividualVendorAssignmnet === order.id
//                                           ) ? (

//                                             <span
//                                               onClick={() => {
//                                                 if (
//                                                   !permissions.includes('ASGN_ODR_TO_VENDOR') &&
//                                                   !permissions.includes('ADMIN_FULL_ACCESS')
//                                                 ) {
//                                                   return;
//                                                 }
//                                                 if (order.tpc_awb_number !== null) {
//                                                   return
//                                                 }
//                                                 fetchVendor(order.id);
//                                                 if (order.rider_preference === 'daakit') {

//                                                   setIsOpenIndividualVendorAssignmnet(order.id);
//                                                   setIsOpenIndividualAssignmnet("")
//                                                 }
//                                               }}
//                                               className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer">
//                                               Not Mapped
//                                             </span>
//                                           ) : (
//                                             <form
//                                               onSubmit={(e) => {
//                                                 e.preventDefault();
//                                                 const selectedVendor = assignmentState;
//                                                 if (!selectedVendor) {
//                                                   toast.warn("Please select a vendor");
//                                                   return;
//                                                 }
//                                                 assignVendor(order.id, selectedVendor);
//                                                 setIsOpenIndividualAssignmnet("");
//                                               }}
//                                               className="flex items-center gap-2"
//                                             >
//                                               <select
//                                                 value={assignmentState}
//                                                 onChange={(e) =>
//                                                   setAssignmentState(e.target.value)
//                                                 }
//                                                 className="border px-2 py-1 rounded-md"
//                                                 required
//                                               >
//                                                 <option value="" disabled>
//                                                   Select Vendor
//                                                 </option>
//                                                 {

//                                                   vendor.length > 0 && (
//                                                     vendor.map((vendor) => (
//                                                       <option
//                                                         key={vendor.vendor_id}
//                                                         value={vendor.vendor_id}
//                                                       >
//                                                         {vendor.vendor_id} :{" "}
//                                                         {vendor.vendor_name}

//                                                       </option>
//                                                     ))
//                                                   )
//                                                 }
//                                               </select>
//                                               <button
//                                                 type="submit"
//                                                 className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
//                                               >
//                                                 Assign
//                                               </button>
//                                               <button
//                                                 type="button"
//                                                 className="text-xs text-gray-500 hover:underline"
//                                                 onClick={() =>
//                                                   setIsOpenIndividualVendorAssignmnet("")
//                                                 }
//                                               >
//                                                 Close
//                                               </button>
//                                             </form>
//                                           )}
//                                         </>
//                                       ) : order.status === "pending pickup" ||
//                                         order.status === "out for delivery" ||
//                                         order.status === "undelivered assigned" ? (
//                                         <>
//                                           {!(
//                                             isOpenIndividualAssignmnetMap === order.id
//                                           ) ? (
//                                             order.mapped_with !== null ? (
//                                               <span
//                                                 onClick={() => {

//                                                   if (
//                                                     !permissions.includes('CANCEL_MAPPED') &&
//                                                     !permissions.includes('ADMIN_FULL_ACCESS')
//                                                   ) {
//                                                     return;
//                                                   }

//                                                   if (order.status === "out for delivery" || order.status === 'undelivered assigned') {
//                                                     return;
//                                                   }

//                                                   setIsOpenIndividualAssignmnetMap(order.id);
//                                                 }}
//                                                 className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 mb-2 inline-block cursor-pointer"
//                                               >
//                                                 Mapped
//                                               </span>
//                                             ) : (
//                                               <>
//                                                 <span

//                                                   className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium  bg-red-100 text-red-600 mb-2 inline-block cursor-pointer"
//                                                 >
//                                                   Not Mapped
//                                                 </span>
//                                               </>
//                                             )
//                                           ) : (
//                                             <form
//                                               onSubmit={(e) => {
//                                                 e.preventDefault();
//                                                 cancelVendorAssignment(order.id);
//                                                 setIsOpenIndividualAssignmnet("");
//                                               }}
//                                               className="flex items-center gap-2"
//                                             >
//                                               <button
//                                                 type="submit"
//                                                 className="bg-[#0446DB] whitespace-nowrap text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
//                                               >
//                                                 Cancel Vendor Assignment
//                                               </button>
//                                               <button
//                                                 type="button"
//                                                 className="text-xs bg-red-500/20 px-2 py-1 rounded text-red-500 text-gray-500 hover:underline"
//                                                 onClick={() =>
//                                                   setIsOpenIndividualAssignmnetMap("")
//                                                 }
//                                               >
//                                                 Close
//                                               </button>
//                                             </form>
//                                           )}
//                                         </>
//                                       ) : order.status === "cancelled" ? (
//                                         <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
//                                           Order Canceled
//                                         </span>
//                                       ) : order.status === "picked" && order?.mapped_with === null ? (
//                                         <>
//                                           <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
//                                             Not Mapped
//                                           </span>
//                                         </>
//                                       ) : order.status === "delivered" || order.status === 'undelivered' || order.status === 'rto in transit' ? (
//                                         <>
//                                           {
//                                             order.mapped_with === null ? (
//                                               <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
//                                                 Not Mapped
//                                               </span>
//                                             ) : (
//                                               <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                                 Mapped
//                                               </span>
//                                             )
//                                           }
//                                         </>
//                                       ) : order.status === "rto delivered" ? (
//                                         <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                           Return To Origin
//                                         </span>
//                                       ) : (
//                                         order.mapped_with !== null ? (
//                                           <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                             Mapped
//                                           </span>
//                                         ) : order.status === 'in transit' ? (
//                                           <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-red-100 text-red-600">
//                                             Not Mapped
//                                           </span>
//                                         ) : (
//                                           <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                             Assigned
//                                           </span>
//                                         )
//                                       )}
//                                     </td>
//                                   </>
//                                 )
//                               } */}


//                               {/* Status */}
//                               {
//                                 selectedStatus === "All" ? (
//                                   <>
//                                     {/* only view ststus */}
//                                     <td className="px-6 py-4  text-center">
//                                       {
//                                         order.status === "cancelled" ||
//                                           order.status === "undelivered" ||
//                                           order.status === "delivered" ||
//                                           order.status === "ndr" ||
//                                           order.status === "rto delivered" ? (
//                                           <span
//                                             className={`px-3 py-1 rounded-full whitespace-nowrap text-xs font-semibold inline-block ${order.status === "cancelled"
//                                               ? "bg-red-100 text-red-600"
//                                               : order.status === "undelivered"
//                                                 ? "bg-red-100 text-green-600"
//                                                 : order.status === "delivered"
//                                                   ? "bg-green-100 text-green-600"
//                                                   : "bg-yellow-100 text-yellow-600"
//                                               } `}
//                                           >
//                                             {order.status === "rto delivered"
//                                               ? "RTO Delivered"
//                                               : order.status === "ndr"
//                                                 ? "NDR"
//                                                 : toCapitalizeEachWord(order.status)}
//                                           </span>
//                                         ) : (
//                                           <span
//                                             className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-semibold inline-block bg-blue-100 text-blue-600"
//                                           >
//                                             {order.status === "rto in transit"
//                                               ? "RTO In Transit"
//                                               : toCapitalizeEachWord(order.status)}
                                              
//                                           </span>
//                                         )}
//                                     </td>


//                                   </>
//                                 ) : (
//                                   <>
//                                     <td className="px-6 py-4 text-center">
//                                       {
//                                         order.status === "cancelled" ||
//                                           order.status === "undelivered" ||
//                                           order.status === "delivered" ||
//                                           order.status === "ndr" ||
//                                           order.status === "rto delivered" ? (
//                                           <span
//                                             className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${order.status === "cancelled"
//                                               ? "bg-red-100 text-red-600"
//                                               : order.status === "undelivered"
//                                                 ? "bg-red-100 text-green-600"
//                                                 : order.status === "delivered"
//                                                   ? "bg-green-100 text-green-600"
//                                                   : "bg-yellow-100 text-yellow-600"
//                                               } `}
//                                           >
//                                             {order.status === "rto delivered"
//                                               ? "RTO Delivered"
//                                               : order.status === "ndr"
//                                                 ? "NDR"
//                                                 : toCapitalizeEachWord(order.status)}

//                                           </span>
//                                         ) : (
//                                           <>
//                                             {(editingStatusId === order.id) ? (

//                                               <form
//                                                 onSubmit={async (e) => {
//                                                   e.preventDefault();
//                                                   const newStatus =
//                                                     e.target.elements.status.value;
//                                                   changeStatus({
//                                                     id:order.id,
//                                                     newStatus: newStatus,
//                                                    remark:""
//                                                   });
//                                                 }}
//                                               >
//                                                 <div className="flex items-center gap-2">
//                                                   <select
//                                                     name="status"
//                                                     defaultValue={order.status}
//                                                     className="text-xs border border-gray-300 rounded-md px-2 py-1"
//                                                     required
//                                                   >
//                                                     <option disabled value="">
//                                                       Change Status
//                                                     </option>
//                                                     {order.status === "booked" && (
//                                                       <>
//                                                         <option value="cancelled">
//                                                           Cancelled
//                                                         </option>
//                                                       </>
//                                                     )}
//                                                     {order.status ===
//                                                       "pending pickup" && (
//                                                         <>
//                                                           <option value="in transit">
//                                                             In Transit
//                                                           </option>
//                                                           <option value="cancelled">
//                                                             Cancelled
//                                                           </option>
//                                                         </>
//                                                       )}
//                                                     {order.status ===
//                                                       "in transit" && (
//                                                         <>
//                                                           <option value="out for delivery">
//                                                             Out For Delivery
//                                                           </option>

//                                                         </>
//                                                       )}
//                                                     {order.status ===
//                                                       "out for delivery" && (
//                                                         <>
//                                                           <option value="delivered">
//                                                             Delivered
//                                                           </option>
//                                                           <option value="ndr">NDR</option>
//                                                         </>
//                                                       )}
//                                                     {order.status ===
//                                                       "rto in transit" && (
//                                                         <>
//                                                           <option value="rto out for delivery">
//                                                             RTO  Out For Delivery
//                                                           </option>
//                                                         </>
//                                                       )}
//                                                     {order.status ===
//                                                       "undelivered assigned" && (
//                                                         <>
//                                                           <option value="out for delivery">
//                                                             Out For Delivery
//                                                           </option>
//                                                         </>
//                                                       )}
//                                                   </select>
//                                                   <button
//                                                     type="submit"
//                                                     className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
//                                                   >
//                                                     Update
//                                                   </button>
//                                                   <button
//                                                     type="button"
//                                                     onClick={() =>

//                                                       setEditingStatusId(null)
//                                                     }
//                                                     className="text-xs text-gray-500 hover:underline"
//                                                   >
//                                                     Close
//                                                   </button>
//                                                 </div>
//                                               </form>
//                                             ) : (

//                                               <span
//                                                 onClick={() => {

                                                  

//                                                   if (!permissions.includes('UPDATE_STATUS') && !permissions.includes('ADMIN_FULL_ACCESS')) {
                                                    
//                                                     return
//                                                   }


//                                                   if (order.status === 'pending pickup' && order.tpc_awb_number !== null) {
//                                                     return
//                                                   }
//                                                   if (order.tpc_awb_number !== null) {
//                                                     return
//                                                   }
//                                                   if(order.status === 'rto in transit'){
//                                                     setEditingStatusId(order.id)
//                                                     return
//                                                   }
                                                  
//                                                   if (order.rider_preference === 'daakit') {
//                                                     if (order.mapped_with !== null) {
//                                                       return
//                                                     } else if (order.status === 'booked') {
//                                                       setEditingStatusId(order.id)
//                                                     }
//                                                     setEditingStatusId(order.id)
//                                                   }
//                                                 }

//                                                 }
//                                                 className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-semibold inline-block bg-blue-100 text-blue-600 cursor-pointer"
//                                               >
//                                                 {order.status === "rto in transit"
//                                                   ? "RTO In Transit"
//                                                   : toCapitalizeEachWord(order.status)}
//                                               </span>
//                                             )}
//                                           </>
//                                         )}
//                                     </td>
//                                   </>
//                                 )

//                               }
//                               {/* eligible_vendors */}
//                               {
//                                 selectedStatus === 'booked' && (
//                                   <td className="max-w-[220px] py-2">
//                                 {order?.tpc_awb_number != null ? (
//                                   <span className="block text-left text-gray-400">
//                                     -
//                                   </span>
//                                 ) : (
//                                   (() => {
//                                     const vendors = String(
//                                       order?.eligible_vendors || "",
//                                     )
//                                       .split(",")
//                                       .map((v) => v.trim())
//                                       .filter(Boolean);

//                                     if (!vendors.length) {
//                                       return (
//                                         <span className="block text-center text-gray-400">
//                                           -
//                                         </span>
//                                       );
//                                     }

//                                     return (
//                                       <HoverCard
//                                         openDelay={150}
//                                         closeDelay={150}
//                                       >
//                                         <HoverCardTrigger asChild>
//                                           <div className="max-w-[200px] cursor-pointer">
//                                             <div className="flex items-center gap-2 rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-orange-700 transition-all duration-200 hover:border-orange-400 hover:bg-orange-100 hover:shadow-sm dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-300">
//                                               <Building2 className="h-4 w-4 shrink-0" />

//                                               <span className="min-w-0 flex-1 truncate text-xs font-medium">
//                                                 {vendors.join(" | ")}
//                                               </span>

//                                               <span className="shrink-0 rounded-full bg-orange-200 px-1.5 py-0.5 text-[10px] font-semibold dark:bg-orange-900">
//                                                 {vendors.length}
//                                               </span>
//                                             </div>
//                                           </div>
//                                         </HoverCardTrigger>

//                                         <HoverCardContent
//                                           side="top"
//                                           align="start"
//                                           sideOffset={8}
//                                           className="z-50 w-[320px] rounded-xl border border-gray-200 bg-white p-0 shadow-xl dark:border-gray-700 dark:bg-gray-900"
//                                         >
//                                           {/* Header */}
//                                           <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
//                                             <div className="flex items-center justify-between">
//                                               <div className="flex items-center gap-2">
//                                                 <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950">
//                                                   <Users className="h-4 w-4" />
//                                                 </div>

//                                                 <div>
//                                                   <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
//                                                     Eligible Vendors
//                                                   </h4>
//                                                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                                                     Available vendor list
//                                                   </p>
//                                                 </div>
//                                               </div>

//                                               <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
//                                                 {vendors.length} Total
//                                               </span>
//                                             </div>
//                                           </div>

//                                           {/* Vendor List */}
//                                           <div className="max-h-[250px] space-y-1 overflow-y-auto p-2">
//                                             {vendors.map((vendor, index) => (
//                                               <div
//                                                 key={`${vendor}-${index}`}
//                                                 className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
//                                               >
//                                                 <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
//                                                   {index + 1}
//                                                 </span>

//                                                 <span className="min-w-0 flex-1 break-words text-sm font-medium text-gray-700 dark:text-gray-200">
//                                                   {vendor}
//                                                 </span>

//                                                 <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
//                                               </div>
//                                             ))}
//                                           </div>

//                                           {/* Footer */}
//                                           <div className="border-t border-gray-100 px-4 py-2.5 dark:border-gray-800">
//                                             <p className="text-center text-xs text-gray-400">
//                                               {vendors.length} eligible vendor
//                                               {vendors.length !== 1
//                                                 ? "s"
//                                                 : ""}{" "}
//                                               found
//                                             </p>
//                                           </div>
//                                         </HoverCardContent>
//                                       </HoverCard>
//                                     );
//                                   })()
//                                 )}
//                               </td>
//                                 )
//                               }

//                             </tr>
//                           );
//                         }
//                         )
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//             )}
//           </div>


//           <div className="shrink-0 mt-auto border-t border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-1 flex flex-wrap items-center justify-end gap-4">

//             {/* Pagination Buttons */}
//             <div className="flex gap-2">

//               <Button
//                 onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//                 disabled={page === 1}
//                 className={`px-4 py-2 rounded-md text-sm font-medium ${page === 1
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : "bg-[#0446DB] text-white hover:bg-indigo-800"
//                   }`}
//               >
//                 Previous
//               </Button>

//               <p className="text-sm text-gray-700 self-center">
//                 Page {page} of {totalPages}
//               </p>

//               <Button
//                 onClick={() =>
//                   setPage((prev) => Math.min(prev + 1, totalPages))
//                 }
//                 disabled={page === totalPages}
//                 className={`px-4 py-2 rounded-md text-sm font-medium ${page === totalPages
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : "bg-[#0446DB] text-white hover:bg-indigo-800"
//                   }`}
//               >
//                 Next
//               </Button>
//             </div>

//             {/* Page Size Selector */}
//             <div className="flex items-center gap-2">
//               <label className="text-sm font-medium text-gray-700">
//                 Per Page
//               </label>

//               <select
//                 value={limit}
//                 onChange={(e) => {
//                   setLimit(Number(e.target.value)); // ✅ convert to number
//                   setPage(1); // ✅ reset page when limit changes
//                 }}
//                 className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
//               >
//                 <option value={10}>10</option>
//                 <option value={20}>20</option>
//                 <option value={50}>50</option>
//                 <option value={100}>100</option>
//                 <option value={200}>200</option>
//               </select>
//             </div>


//           </div>

//         </div>

//         {popup && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(46,46,46,0.5)]">
//             <div className="bg-white rounded-sm shadow-xl w-full max-w-4xl overflow-hidden">
//               {/* Modal Header */}
//               <div className="bg-[#0446DB]  pt-4">
//                 <h2 className="text-xl font-semibold text-white text-center mb-4">
//                   Order Details
//                 </h2>

//                 <div className="bg-white p-6  space-y-3 text-gray-700">
//                   {/* Basic Info */}
//                   <h3 className="font-semibold text-[#0446DB] mb-2">
//                     Basic Details
//                   </h3>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <strong>Order ID:</strong> {popup.merchant_order_id}
//                       <button
//                         className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
//                         onClick={() => {
//                           navigator.clipboard.writeText(
//                             popup.merchant_order_id
//                           );
//                           setCopySuccess(popup.merchant_order_id);
//                           setTimeout(() => {
//                             setCopySuccess(null);
//                           }, 2000);
//                         }}
//                       >
//                         {copySuccess === popup.merchant_order_id ? (
//                           <CiCircleCheck />
//                         ) : (
//                           <FaRegCopy />
//                         )}
//                       </button>
//                     </div>
//                     <div>
//                       <strong>AWB No:</strong> {popup.awb_number}
//                       <button
//                         className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
//                         onClick={() => {
//                           navigator.clipboard.writeText(popup.awb_number);
//                           setCopySuccess(popup.awb_number);
//                           setTimeout(() => {
//                             setCopySuccess(null);
//                           }, 2000);
//                         }}
//                       >
//                         {copySuccess === popup.awb_number ? (
//                           <CiCircleCheck />
//                         ) : (
//                           <FaRegCopy />
//                         )}
//                       </button>
//                     </div>
//                     <div>
//                       <strong>Order Type:</strong>{" "}
//                       {popup.order_type === "cod" ? "COD" : "Prepaid"}
//                     </div>
//                     <div>
//                       <strong>Order Specific:</strong> {popup.order_specific}
//                     </div>
//                     <div>
//                       <strong>Order Status:</strong>{" "}
//                       {toCapitalizeEachWord(popup.status)}
//                     </div>
//                     <div>
//                       <strong>Total Amount:</strong> ₹
//                       {Number(popup.total_amount).toLocaleString()}
//                     </div>
//                     <div>
//                       <strong>Order Weight:</strong>{" "}
//                       {Number(popup.total_weight).toLocaleString()}g
//                     </div>
//                     <div>
//                       <strong>Number of Packets:</strong>{" "}
//                       {popup.number_of_boxes}
//                     </div>
//                   </div>

//                   {/* Document Info */}
//                   <div className="pt-4 border-t">
//                     <h3 className="font-semibold text-[#0446DB] mb-2">
//                       Delivery Details
//                     </h3>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <strong>Customer Name:</strong>{" "}
//                         {popup.delivery_contact_name}
//                       </div>
//                       {/* <div>
//                           <strong>Customer Contact No:</strong>{" "}
//                           {popup.delivery_phone}
//                         </div> */}
//                       <div>
//                         <strong>Address:</strong>{" "}
//                         {popup.delivery_address_line}
//                       </div>
//                       <div>
//                         <strong>City:</strong>{" "}
//                         {`${popup.delivery_city}, ${popup.delivery_state} - ${popup.delivery_pincode}` ||
//                           "N/A"}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Bank Info */}
//                   <div className="pt-4 border-t">
//                     <h3 className="font-semibold text-[#0446DB] mb-2">
//                       Pickup Details
//                     </h3>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <strong>Name:</strong>{" "}
//                         {popup.pickup_contact_name || "N/A"}
//                       </div>
//                       <div>
//                         <strong>Pickup Phone No:</strong>{" "}
//                         {`${popup.pickup_phone}` || "N/A"}
//                       </div>
//                       <div>
//                         <strong>Address:</strong>{" "}
//                         {popup.pickup_address_line || "N/A"}
//                       </div>
//                       <div>
//                         <strong>City:</strong>{" "}
//                         {`${popup.pickup_city}, ${popup.pickup_state} - ${popup.pickup_pincode}` ||
//                           "N/A"}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Close Button */}
//                   <div className="pt-4 text-right">
//                     <button
//                       onClick={() => {
//                         navigate(`/admin/order-history?awb=${popup?.awb_number}`);
//                       }}
//                       className="bg-green-500 mr-2 text-white px-4 py-2 rounded hover:bg-indigo-800 transition"
//                     >
//                       Get History
//                     </button>
//                     <button
//                       onClick={() => setPopup(null)}
//                       className="bg-[#0446DB] text-white px-4 py-2 rounded hover:bg-indigo-800 transition"
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       )
//     }


//     </>
//   );
// }
// export default UserOrderDetails;
