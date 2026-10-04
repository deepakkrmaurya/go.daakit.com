import { useEffect, useRef, useState } from "react";

import Select from "react-select";
import {  City }  from 'country-state-city';
import { TbFileInfo } from "react-icons/tb";
import {

  FaFilter,
  FaDownload,
  FaCopy,
  FaCheck,
  FaBox,
  FaMapMarkerAlt,
  FaShippingFast,
  FaTasks,
} from "react-icons/fa";

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

import { Loader2 } from "lucide-react";
import AxiosInstance from "@/Helper/axiosInstance";

const frontEndURL = import.meta.env.VITE_FRONTEND_URL;




const options = City.getCitiesOfCountry("IN").map((city) => ({
  value: city.name,
  label: city.name,
}));

function TechMerchantOrderDetails() {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [isCanceled, IsSetcancelOrder] = useState(false);
  const [isOpenIndividualAssignmnet, setIsOpenIndividualAssignmnet] = useState("");
  const [assignmentState, setAssignmentState] = useState("");
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(null);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [statu, setStatus] = useState(1);
  const [limit, setLimit] = useState(15);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [popup, setPopup] = useState(null);
  const [orderDetailsLoading, setOrderDetailsLoading] = useState(false);
  const [orderDetailsData, setOrderDetailsData] = useState(null);
  const [assign, setAssign] = useState(false);
  const [assignRiders, setAssignRiders] = useState([]);
  const [assigningOrderId, setAssigningOrderId] = useState(null);
  const [selectedBulkOrders, setSelectedBulkOrders] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [total, setTotal] = useState(0);
 
 const getDefaultDateRange = () => {
  const today = new Date();
  const oneMonthAgo = new Date();

  oneMonthAgo.setMonth(today.getMonth() - 1);

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  return {
    startDate: formatDate(oneMonthAgo),
    endDate: formatDate(today),
  };
};

 const defaultDateRange = getDefaultDateRange();
const [advanceFilters, setAdvanceFilters] = useState({
  startDate: defaultDateRange.startDate,
  endDate: defaultDateRange.endDate,
  order_id: "",
  awbNumber: "",
  city: "",
  state: "",
  pincode: "",
  order_specific: "",
  rider_preference: "",
});
  const [remarks, setremarks] = useState("");
  const [filterUpdate, setFilterUpdate] = useState(false);
  const statusScrollRef = useRef(null);
  const [assignData, setAssignData] = useState({
    rider_id: "",
    order_id: "",
  });

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const params = {
        page,
        limit,
        status: selectedStatus === "All" ? undefined : selectedStatus,
        order_id: advanceFilters.order_id || undefined,
        awb_number: advanceFilters.awbNumber || undefined,
        start_date: advanceFilters.startDate || undefined,
        end_date: advanceFilters.endDate || undefined,
        city: advanceFilters.city || undefined,
        pincode: advanceFilters.pincode || undefined,
        order_specific: advanceFilters.order_specific || undefined,
        rider_preference: advanceFilters.rider_preference || undefined,
      };

      Object.keys(params).forEach((key) => {
        if (params[key] === undefined || params[key] === "") {
          delete params[key];
        }
      });

      const res = await AxiosInstance.get("/api/tech-merchant/getallorders", {
        params,
      });

      if (res?.data?.success) {
        const data = Array.isArray(res?.data?.data) ? res.data.data : [];
        const pagination = res?.data?.pagination || {};

        setOrders({
          ...res.data,
          data,
          pagination,
        });

        setTotal(Number(pagination?.total || 0));
        setTotalOrders(Number(pagination?.total || 0));
        setTotalPages(Number(pagination?.totalPages || 1));
      } else {
        setOrders({
          data: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        });
        setTotal(0);
      }
    } catch (err) {
      console.error("getallorders error:", err?.response?.data || err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "An error occurred while fetching orders.",
      );
    } finally {
      setLoading(false);
    }
  };


  const assignOrderToRider = async (orderId, riderId) => {
    try {
      setAssigningOrderId(orderId);
     
      const response = await AxiosInstance.post(
        "/api/tech-merchant/assignOrderToRider",
        {
          order_ids: orderId,
          rider_id: Number(riderId),
        },
      );

      if (response?.data?.success) {
        toast.success(
          response?.data?.message || "Order successfully assigned to rider",
        );
        setSelectedBulkOrders("")
        setAssignmentState("");
        setIsOpenIndividualAssignmnet("");
        await fetchOrders();
      }
    } catch (error) {
      console.error(
        "assignOrderToRider error:",
        error?.response?.data || error,
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to assign order to rider",
      );
    } finally {
      setAssigningOrderId(null);
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
    return (
      statusColors[status] ||
      "bg-gray-100 text-gray-800 dark:text-neutral-100 border-gray-200"
    );
  };

  const cancelRiderAssignment = async (id) => {
    setLoading(true);

    try {
      const res = await AxiosInstance.post(
        `/api/tech-merchant/cancelRiderAssignment/${id}`,
      );
      if (res?.data?.success) {
        toast.success(
          res?.data?.message || "Rider assignment cancelled successfully",
        );
        setIsOpenIndividualAssignmnet("");
        await fetchOrders();
      }
    } catch (err) {
      console.error("cancelRiderAssignment error:", err?.response?.data || err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while canceling rider assignment",
      );
    } finally {
      setLoading(false);
    }
  };


  const clearAllState = () => {
  // Bulk selection
  setSelectedBulkOrders([]);

  // Rider assignment
  setAssignDialogOpen(false);
  setIsOpenIndividualAssignmnet("");
  setAssignmentState("");
  setAssignRiders([]);
  setAssigningOrderId(null);
  setAssign(false);

  // Cancel / status
  IsSetcancelOrder(false);
  setEditingStatusId(null);
  setremarks("");

  // Dialog / order details
  setPopup(null);
  setOrderDetailsData(null);
  setOrderDetailsLoading(false);

  // Assign data
  setAssignData({
    rider_id: "",
    order_id: "",
  });

  // Filter drawer
  setIsFilterOpen(false);

  // Copy state
  setCopySuccess(null);
};

  const getOrderTypeColor = (orderType) => {
    const typeColors = {
      NDD: "bg-green-100 text-green-800 border border-green-300",
      SDD: "bg-yellow-100 text-yellow-800 border border-yellow-300",
      Tur: "bg-red-100 text-red-800 border border-red-300 animate-blink",
      default:
        "bg-gray-100 text-gray-800 dark:text-neutral-100 border border-gray-300",
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
      rider_preference:""
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
    selectedBulkOrders?.forEach((order) => {
      awbs.push(order.awb_number);
    });

    try {
      const res = await AxiosInstance.post(`/api/label/generatelabel`,{
         awbs: awbs,
      })
       
      

      if (res?.data?.pdf_link) {
        window.open(res?.data?.pdf_link, "_blank");
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
  try {
    setLoading(true);

    const params = {
      status: selectedStatus === "All" ? undefined : selectedStatus,
      awb_number: advanceFilters?.awbNumber || undefined,
      order_id: advanceFilters?.order_id || undefined,
      start_date: advanceFilters?.startDate || undefined,
      end_date: advanceFilters?.endDate || undefined,
      city: advanceFilters?.city || undefined,
      pincode: advanceFilters?.pincode || undefined,
      order_specific: advanceFilters?.order_specific || undefined,
    };

    const response = await AxiosInstance.get(
      "/api/tech-merchant/exportOrder",
      {
        params,
        responseType: "blob",
      }
    );

    const contentType = response.headers?.["content-type"] || "";

  
    

    // API returned JSON/error instead of file
    if (
      contentType.includes("application/json") ||
      contentType.includes("text/html")
    ) {
      const text = await response.data.text();

     
      

      try {
        const json = JSON.parse(text);
        throw new Error(json?.message || "Export failed");
      } catch (error) {
        if (error?.message !== "Export failed") {
          throw new Error(text || "Invalid export response");
        }

        throw error;
      }
    }

    if (!response.data || response.data.size === 0) {
      throw new Error("Exported file is empty");
    }

    let extension = "xlsx";

    if (contentType.includes("text/csv")) {
      extension = "csv";
    } else if (
      contentType.includes("application/vnd.ms-excel")
    ) {
      extension = "xls";
    } else if (
      contentType.includes(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
    ) {
      extension = "xlsx";
    }

    const url = window.URL.createObjectURL(response.data);

    const link = document.createElement("a");

    link.href = url;
    link.download = `orders_${Date.now()}.${extension}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);

    toast.success("Orders exported successfully!");
  } catch (error) {
    console.error("Export error:", error);

    toast.error(
      error?.message ||
        error?.response?.data?.message ||
        "Failed to export orders"
    );
  } finally {
    setLoading(false);
  }
};

  const getRidersOutsideIdealLoad = async (order_id) => {
    try {
      const res = await AxiosInstance.get(
        `/api/tech-merchant/getRidersOutsideIdealLoad/${order_id}`,
      );
     
      
    
      setAssignRiders(res.data.data);
    } catch (error) {
      toast.error("Error fetching riders");
    }
  };

  const changeStatus = async ({
    id, newStatus,remarks
  }) => {

    setLoading(true);

    try {

      const res = await AxiosInstance.post(`/api/tech-merchant/updateOrderStatus/${id}`,
        {
          status: newStatus,
          remarks: remarks?.trim() || "",
        },
      )
      

      if (res?.data?.success !== false) {
        toast.success(
          res?.data?.message || "Order status updated successfully",
        );

        setremarks("");
        setStatus("");
        setEditingStatusId(null);
        await fetchOrders();
      }
    } catch (err) {
      console.error("updateOrderStatus error:", err?.response?.data || err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update status",
      );
    } finally {
      setLoading(false);
    }
  };

  const getOrderDetailsByMerchant = async (awbNumber) => {
    if (!awbNumber) {
      toast.error("AWB number is required");
      return null;
    }

    try {
      setOrderDetailsLoading(true);
      setOrderDetailsData(null);

       const res = await AxiosInstance.get(`/api/tech-merchant/getOrderDetailsByMerchant`,
        {
          params: {
            awb_number: awbNumber,
          },
        }
       )

      

      if (res?.data?.success) {
        const details = {
          order: res?.data?.order || null,
          tracking_history: Array.isArray(res?.data?.tracking_history)
            ? res.data.tracking_history
            : [],
          ndr_details: res?.data?.ndr_details || null,
        };

        setOrderDetailsData(details);
        setPopup(details.order);

        return details;
      }

      return null;
    } catch (err) {
      console.error(
        "getOrderDetailsByMerchant error:",
        err?.response?.data || err,
      );

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to fetch order details",
      );

      return null;
    } finally {
      setOrderDetailsLoading(false);
    }
  };

  const updateOrderByMerchant = async ({ status, order_ids,remarks }) => {
  setLoading(true);

  try {
   
    const responses = await Promise.all(
      order_ids.map((id) =>
        AxiosInstance.post(
          `/api/tech-merchant/updateOrderStatus/${id}`,
          {
            status: status,
            remarks:remarks
          }
        )
      )
    );

    
    

    toast.success(
      responses?.[0]?.data?.message ||
        "Orders updated successfully"
    );

    await fetchOrders();

    setSelectedBulkOrders([]);

    // Caller await kar sakega
    return responses;

  } catch (err) {
    toast.error(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to update orders."
    );

    // Important: Promise reject hoga
    throw err;

  } finally {
    setLoading(false);
  }
};

  const canPerformAction = (order) => {
    // Check if order has "self" rider preference
    return order.rider_preference === "self";
  };

  const canCancelOrder = (order) => {
    // Check if order has "daakit" rider preference and is in booked/pending pickup status
    return (
      order.rider_preference === "daakit" &&
      (order.status === "booked" || order.status === "pending pickup")
    );
  };

  const canUpdateStatus = (order) => {
    // For self preference: can update status for multiple statuses
    // For daakit preference: can only cancel (update to cancelled) if in booked/pending pickup
    if (order.rider_preference === "self") {
      return true; // Self preference can update status
    } else if (order.rider_preference === "daakit") {
      // Daakit preference can only cancel if in booked/pending pickup
      return order.status === "booked" || order.status === "pending pickup";
    }
    return false;
  };

  useEffect(() => {
    fetchOrders();
    setSelectedBulkOrders([]);
  }, [page, selectedStatus, filterUpdate]);


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
      loadingPage ?(
        <div className=" w-full h-[90vh] flex justify-center items-center">
          <div>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2">Loading Order Details...</p>
          </div>
        </div>
      ):(

     <div className="min-h-screen w-full min-w-0 bg-[#f5f8fb] dark:bg-neutral-950">
        {/* Header Section */}
        <header className="w-full min-w-0 border-b border-transparent dark:border-neutral-800 dark:bg-neutral-900">
          <div className="w-full min-w-0 px-3 py-3 sm:px-4 lg:px-5">
            <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
              <div className="text-center lg:text-left">
                <h1 className="text-2xl font-bold dark:text-white">
                  Order Management
                </h1>
                <p className="dark:text-blue-100  sm:mt-2 text-sm sm:text-base">
                  Manage and track all your orders in one place
                </p>
              </div>

              <div className="flex min-w-0 flex-col items-center gap-3 sm:flex-row sm:gap-4">
                {/* <Button variant="outline" className="bg-white text-center py-1 md:py-2 px-3 w-full md:w-auto rounded text-xl text-[#0446DB] border-white hover:bg-blue-50" asChild>
                    <Link to={'/techbased_merchant/create_order'}>Create Order</Link>
                  </Button> */}
                {/* Action Buttons */}
                <div className="flex w-full min-w-0 flex-wrap justify-center gap-2 sm:w-auto sm:flex-nowrap sm:gap-3">
                  <Button
                    onClick={exportOrder}
                    variant="outline"
                    className="bg-white text-[#0446DB] font-medium rounded-sm hover:bg-blue-50 transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-none"
                  >
                    <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="">Export</span>
                  </Button>

                  <Button
                    onClick={() => setIsFilterOpen(true)}
                    variant="outline"
                    className="bg-white text-[#0446DB] font-medium rounded-sm transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-none"
                  >
                    <FaFilter className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="">Filter</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Filters Drawer */}
        <Drawer
          direction="right"
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
        >
          <DrawerContent className="h-full w-full sm:w-80 sm:max-w-sm">
            <DrawerHeader className="border-b border-gray-200">
              <DrawerTitle className="text-lg sm:text-xl font-bold text-gray-800 dark:text-neutral-100 flex items-center gap-2">
                <FaFilter className="text-[#0446DB] w-4 h-4 sm:w-5 sm:h-5" />
                Advanced Filter
              </DrawerTitle>
            </DrawerHeader>

            <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-4">
                  {/* Date Range */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-200 mb-1">
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
                        onClick={(e) => {
                          e.currentTarget.showPicker?.();
                        }}
                        className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-200 mb-1">
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
                         onClick={(e) => {
                            e.currentTarget.showPicker?.();
                          }}
                        className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-300 text-sm"
                      />
                    </div>
                  </div>

                  {/* Order Specific */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-200 mb-1">
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
                      className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-300 text-sm"
                    >
                      <option value="">All Orders</option>
                      <option value="HLD">HLD</option>
                      <option value="SDD">Same Day Delivery</option>
                      <option value="NDD">Next Day Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-200 mb-1">
                      Rider Preference
                    </label>
                    <select
                      value={advanceFilters.rider_preference}
                      onChange={(e) => {
                        setAdvanceFilters((prev) => ({
                          ...prev,
                          rider_preference: e.target.value,
                        }));
                      }}
                      className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-300 text-sm"
                    >
                      <option value=""> Select Rider Preference</option>
                      <option value="self">BYOB</option>
                      <option value="daakit">DDN</option>
                    </select>
                  </div>

                  {/* AWB Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-200 mb-1">
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
                      className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-300 text-sm"
                    />
                  </div>

                 
                 

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-200 mb-1">
                      City
                    </label>
                    <Select
                      options={options}
                      isSearchable
                      value={options.find(
                        (option) => option.value === advanceFilters.city,
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-200 mb-1">
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
                      className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-300 text-sm"
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
                    className=" bg-[#0446DB] text-white hover:bg-[#0339B5] transition-colors duration-200 font-medium shadow-md text-sm sm:text-base"
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
                    className=" font-medium text-sm sm:text-base"
                  >
                    Reset
                  </Button>
                </DrawerFooter>
              </form>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Main Content */}
        <main className="w-0 min-w-full max-w-full overflow-hidden [contain:inline-size]">
          <div className="w-full min-w-0 border-b border-gray-200 bg-white px-2 dark:border-neutral-800 dark:bg-neutral-900 sm:px-3">
            <div className="relative w-full min-w-0">
              <div
                className="flex w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain pb-2 [contain:inline-size] [scrollbar-width:thin] dark:[color-scheme:dark]"
                onWheel={(e) => {
                  if (e.deltaY === 0) return;
                  e.currentTarget.scrollLeft += e.deltaY;
                }}
              >
                <div className="flex min-w-max gap-2 px-2 sm:px-3">
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
                          : "bg-white hover:bg-[#0446DB] hover:text-white text-gray-700 dark:text-neutral-200 border-gray-200 hover:border-gray-300 hover:shadow-md dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-700 dark:hover:bg-neutral-800"
                      }`}
                    >
                      {st === "ndr" ? "NDR" : toCapitalizeEachWord(st)}
                      {selectedStatus === st && (
                        <span className="bg-white bg-opacity-20 text-gray-800  dark:text-[#0446DB] px-1 sm:px-2 py-0.5 rounded-full text-xs">
                          {total > 99 ? "99+" : total}
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Actions Section */}
          

           {selectedBulkOrders?.length > 0 && (
          <AlertDialog>
            {/* ================= BULK ACTIONS BUTTON ================= */}
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="my-1 h-7 cursor-pointer rounded-sm border-[#0446DB] bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-blue-50 hover:text-[#0446DB] dark:border-blue-500 dark:bg-[#0446DB] dark:text-white dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
              >
                Action
              </Button>
            </AlertDialogTrigger>

            {/* ================= MAIN DIALOG ================= */}
            <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
              {/* Header */}
              <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 text-left dark:border-neutral-800">
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

              {/* ================= CONTENT ================= */}
              <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5">
                {/* ================================================== */}
                {/* SHIPPING LABELS */}
                {/* ================================================== */}
                <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
                  <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Shipping Labels
                    </h3>

                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      Generate shipping labels for all currently selected orders.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        Generate Labels
                      </p>

                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                        <span className="font-semibold text-[#0446DB] dark:text-blue-400">
                          {selectedBulkOrders?.length || 0}
                        </span>{" "}
                        orders selected
                      </p>
                    </div>

                    <Button
                      type="button"
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

                {/* ================================================== */}
                {/* CANCEL ORDERS */}
                {/* ================================================== */}
                {(selectedStatus === "booked" ||
                  selectedStatus === "pending pickup") && (
                  <div className="overflow-hidden rounded-sm border border-red-200 dark:border-red-500/20">
                    {/* Header */}
                    <div className="border-b border-red-100 bg-red-50/70 px-4 py-3 dark:border-red-500/20 dark:bg-red-500/5">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Cancel Orders
                      </h3>

                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        Select a cancellation reason before cancelling the selected
                        orders.
                      </p>
                    </div>

                    <div className="space-y-4 p-4">
                      {/* Cancellation Reason */}
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
                            Product packaging Issue
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

                      {/* Cancel Action */}
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
                          type="button"
                          variant="destructive"
                          disabled={!remarks}
                          onClick={async () => {
                            if (!remarks) {
                              toast.warn("Please select cancellation reason");
                              return;
                            }

                            const orderIds = selectedBulkOrders.map(
                              (order) => order.id,
                            );

                            await updateOrderByMerchant({
                              status: "cancelled",
                              order_ids: orderIds,
                              remarks: remarks,
                            });
                          }}
                          className="h-9 cursor-pointer rounded-sm px-5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Cancel Orders
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================================================== */}
                {/* ASSIGN ORDERS */}
                {/* ================================================== */}
                {(selectedStatus === "booked" || selectedStatus === "undelivered")  && (
                  <div className="overflow-hidden rounded-sm border border-blue-200 dark:border-blue-500/20">
                    {/* Header */}
                    <div className="border-b border-blue-100 bg-blue-50/70 px-4 py-3 dark:border-blue-500/20 dark:bg-blue-500/5">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Assign Orders
                      </h3>

                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        Assign all currently selected booked orders to a rider.
                      </p>
                    </div>

                    <div className="space-y-4 p-4">
                      {/* ================= BEFORE CLICK ASSIGN ================= */}
                      {!assignDialogOpen && (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                              Assign Selected Orders
                            </p>

                            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                              Select a rider for{" "}
                              <span className="font-semibold text-[#0446DB] dark:text-blue-400">
                                {selectedBulkOrders?.length || 0}
                              </span>{" "}
                              selected orders.
                            </p>
                          </div>
                          

                          <Button
                            type="button"
                            onClick={() => {
                              // Check if any selected order is Daakit preference
                              const hasDaakitOrder = selectedBulkOrders?.some(
                                (order) => order?.rider_preference === "daakit"
                              );

                              if (hasDaakitOrder) {
                                toast.error(
                                  "Daakit preference order cannot be assigned manually."
                                );
                                return;
                              }

                              // Only Self preference orders will reach here
                              const orderIds = selectedBulkOrders.map(
                                (order) => order.id
                              );

                              getRidersOutsideIdealLoad(orderIds);
                              setAssignDialogOpen(true);
                            }}
                            className="h-9 cursor-pointer rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-[#0339B5]"
                          >
                            Assign Orders
                          </Button>
                        </div>
                      )}

                      {/* ================= RIDER SELECTION ================= */}
                      {assignDialogOpen && (
                        <>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                              Select Rider
                              <span className="ml-1 text-red-500">*</span>
                            </label>

                            <select
                              value={assignmentState}
                              onChange={(e) =>
                                setAssignmentState(e.target.value)
                              }
                              className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
                            >
                              <option value="" disabled>
                                Select Rider
                              </option>

                              {assignRiders.map((rider) => (
                                <option
                                  key={rider.rider_id}
                                  value={rider.rider_id}
                                >
                                  {rider.rider_id} : {rider.rider_name} :{" "}
                                  {rider.total_weight_grams}g : {rider.total_boxes}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Assign Action */}
                          <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                Assign Selected Orders
                              </p>

                              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                Assign{" "}
                                <span className="font-semibold text-[#0446DB] dark:text-blue-400">
                                  {selectedBulkOrders?.length || 0}
                                </span>{" "}
                                selected orders to the chosen rider.
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setAssignDialogOpen(false);
                                  setAssignmentState("");
                                }}
                                className="h-9 cursor-pointer rounded-sm px-4 text-sm font-medium"
                              >
                                Cancel
                              </Button>

                              <Button
                                type="button"
                                onClick={async () => {
                                  if (!assignmentState) {
                                    toast.warn("Please select a rider");
                                    return;
                                  }

                                  const orderIds = selectedBulkOrders.map(
                                    (order) => order.id,
                                  );

                                  try {
                                    await assignOrderToRider(
                                      orderIds,
                                      assignmentState,
                                    );

                                    setAssignDialogOpen(false);
                                    setAssignmentState("");
                                    setIsOpenIndividualAssignmnet("");
                                  } catch (error) {
                                    console.error(error);

                                    toast.error(
                                      error?.response?.data?.message ||
                                        "Failed to assign orders",
                                    );
                                  }
                                }}
                                className="h-9 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white hover:bg-[#0339B5]"
                              >
                                Continue
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* ================================================== */}
                {/* CLEAR SELECTION */}
                {/* ================================================== */}
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
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSelectedBulkOrders([]);
                      IsSetcancelOrder(false);
                      setAssignDialogOpen(false);
                      setAssignmentState("");
                      setremarks("");
                    }}
                    className="h-9 cursor-pointer rounded-sm border-red-200 bg-white px-4 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    Clear Selected
                  </Button>
                </div>
              </div>

              {/* ================= FOOTER ================= */}
              <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 my-1 dark:border-neutral-800 dark:bg-neutral-950/30">
                <AlertDialogCancel
                  onClick={() => {
                    IsSetcancelOrder(false);
                    setAssignDialogOpen(false);
                    setAssignmentState("");
                    setremarks("");
                    clearAllState()
                  }}
                  className="cursor-pointer rounded-sm"
                >
                  Close
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}


          {/* Orders Table */}
          <div className="w-full min-w-0 overflow-hidden border-y border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="relative w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain [contain:inline-size] [scrollbar-gutter:stable] dark:[color-scheme:dark]">
              <div className=" max-w-none">
                {/* Desktop Table View */}
                <Table className=" max-w-none bg-white dark:bg-neutral-900">
                  <TableHeader className="bg-gray-50 dark:bg-neutral-800/80">
                    <TableRow>
                      <TableHead className="px-3 lg:px-6 py-3 text-left">
                        {
                          selectedStatus=='cancelled' || selectedStatus=='All' ?(
                            <>
                            -
                            </>
                          ):(
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-[#0446DB] rounded border-gray-300 focus:ring-[#0446DB]"
                              checked={
                                selectedBulkOrders?.length ===
                                  orders?.data?.length && orders?.data?.length > 0
                              }
                              onChange={toggleSelectAll}
                            />

                          )
                        }
                      </TableHead>
                      <TableHead className="px-3 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-neutral-200 dark:text-neutral-300 uppercase tracking-wider">
                        Order Information
                      </TableHead>
                      {(selectedStatus === "pending pickup" ||
                        selectedStatus === "out for delivery" ||
                        selectedStatus === "delivered" ||
                        selectedStatus === "undelivered assigned") && (
                        <TableHead className="px-3 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-neutral-200 dark:text-neutral-300 uppercase tracking-wider">
                          Rider Details
                        </TableHead>
                      )}
                      <TableHead className="px-3 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-neutral-200 dark:text-neutral-300 uppercase tracking-wider">
                        Delivery Address
                      </TableHead>
                      <TableHead className="px-3 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-neutral-200 dark:text-neutral-300 uppercase tracking-wider">
                        Package Details
                      </TableHead>
                   
                      <TableHead className="px-3 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-neutral-200 dark:text-neutral-300 uppercase tracking-wider">
                        Assignment
                      </TableHead>
                      <TableHead className="px-3 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-neutral-200 dark:text-neutral-300 uppercase tracking-wider">
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
                      <>
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-10">
                            No orders found
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      orders?.data.map((order, index) => {
                        const isSelected =
                          Array.isArray(selectedBulkOrders) &&
                          selectedBulkOrders.some((o) => o.id === order.id);
                        const isSelfPreference = canPerformAction(order);
                        const isDaakitEligibleForCancel = canCancelOrder(order);
                        const canUpdateOrderStatus = canUpdateStatus(order);

                        return (
                          <TableRow
                            key={order.id}
                            className={`transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-neutral-800/60 ${isSelected ? "bg-indigo-50 dark:bg-blue-950/20" : "dark:bg-neutral-900"}`}
                          >
                            {/* Selection Checkbox */}
                            <TableCell className="px-3 lg:px-6 py-4">
                              {
                                selectedStatus=='cancelled' || selectedStatus=='All'   ?(
                                  <>
                                  -
                                  </>
                                ):(

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
                                    className="w-4 h-4 text-[#0446DB] rounded border-gray-300 focus:ring-[#0446DB]"
                                  />
                                )
                              }
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
                                    className="text-gray-400 dark:text-neutral-500 hover:text-[#0446DB] transition-colors duration-200 p-1 rounded"
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
                                        type="button"
                                        variant="outline"
                                        disabled={orderDetailsLoading}
                                        onClick={() =>
                                          getOrderDetailsByMerchant(
                                            order.awb_number,
                                          )
                                        }
                                        className="text-xs font-medium text-red-600 inline-block cursor-pointer"
                                      >
                                        <span>
                                          {orderDetailsLoading ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                          ) : (
                                            <TbFileInfo />
                                          )}
                                        </span>
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-4xl h-[70%] overflow-y-scroll">
                                      <DialogHeader>
                                        <DialogTitle>Order Details</DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4 sm:space-y-6">
                                        {/* Basic Information */}
                                        <div className="bg-gray-50 dark:bg-neutral-800/60 rounded-sm sm:rounded-xl p-3 sm:p-4">
                                          <h3 className="font-semibold text-gray-800 dark:text-neutral-100 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
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
                                                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-neutral-300">
                                                  {item.label}:
                                                </span>
                                                <div className="flex items-center gap-1 sm:gap-2 max-w-[60%]">
                                                  <span className="text-xs sm:text-sm text-gray-800 dark:text-neutral-100 truncate">
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
                                                      className="text-gray-400 dark:text-neutral-500 hover:text-indigo-600 transition-colors duration-200 flex-shrink-0"
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
                                        <div className="bg-gray-50 dark:bg-neutral-800/60 rounded-sm sm:rounded-xl p-3 sm:p-4">
                                          <h3 className="font-semibold text-gray-800 dark:text-neutral-100 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
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
                                                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-neutral-300">
                                                  {item.label}:
                                                </span>
                                                <p className="text-xs sm:text-sm text-gray-800 dark:text-neutral-100 mt-1 break-words">
                                                  {item.value}
                                                </p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Pickup Information */}
                                        <div className="bg-gray-50 dark:bg-neutral-800/60 rounded-sm sm:rounded-xl p-3 sm:p-4">
                                          <h3 className="font-semibold text-gray-800 dark:text-neutral-100 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
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
                                                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-neutral-300">
                                                  {item.label}:
                                                </span>
                                                <p className="text-xs sm:text-sm text-gray-800 dark:text-neutral-100 mt-1 break-words">
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

                                <p className="text-xs text-gray-500 dark:text-neutral-400">
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

                                <div className="flex-col items-center gap-2 text-xs text-gray-400 dark:text-neutral-500">
                                  <div>
                                  <span>MID: {order.merchant_id}</span>
                                 <span
                              className={`inline-flex items-center ml-2 justify-center rounded-full border border-dashed px-3 py-1 text-xs font-medium ${
                                order?.rider_preference === "self"
                                  ? "border-green-500 text-green-600 dark:border-green-400 dark:text-green-400"
                                  : "border-[#0446DB] text-[#0446DB] dark:border-blue-400 dark:text-blue-400"
                              }`}
                            >
                              {order?.rider_preference === "self" ? "BYOB" : "DDN"}
                            </span>
                                  </div>
                                  
                                  <span className="flex items-center ">
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
                                      className="text-gray-400 dark:text-neutral-500 hover:text-[#0446DB] transition-colors duration-200"
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

                            {/* Rider Details */}
                            {(selectedStatus === "pending pickup" ||
                              selectedStatus === "out for delivery" ||
                              selectedStatus === "delivered" ||
                              selectedStatus === "undelivered assigned") && (
                              <TableCell className="px-3 lg:px-6 py-4">
                                <div className="bg-gray-50 dark:bg-neutral-800/60 rounded-sm p-2">
                                  <p className="font-medium text-gray-800 dark:text-neutral-100 text-sm">
                                    {order.vendor_id
                                      ? `FP_${order.vendor_id}_`
                                      : order.r_merchant_id
                                        ? `M_${order.r_merchant_id}_`
                                        : "DKT_"}
                                    {order.rider_id}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                                    Assigned Rider
                                  </p>
                                </div>
                              </TableCell>
                            )}

                            {/* Delivery Address */}
                            <TableCell className="px-3 lg:px-6 py-4">
                              <div className="space-y-1">
                                <p className="font-medium text-gray-800 dark:text-neutral-100 whitespace-nowrap flex items-center gap-1 text-sm">
                                  {order.delivery_contact_name}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-neutral-300 whitespace-nowrap">
                                  {order.delivery_address_line}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-neutral-400  whitespace-nowrap">
                                  {order.delivery_city}, {order.delivery_state}{" "}
                                  - {order.delivery_pincode}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-neutral-500 whitespace-nowrap">
                                  {order.delivery_country}
                                </p>
                              </div>
                            </TableCell>

                            {/* Package Details */}
                            <TableCell className="px-3 lg:px-6 py-4">
                              <div className="space-y-2">
                                {selectedStatus !== "cancelled" && (
                                  <div className="flex items-center whitespace-nowrap gap-2 text-xs">
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
                                  <span>
                                    Dimensions: {order.package_length}x
                                    {order.package_breadth}x
                                    {order.package_height}
                                  </span>
                                </div>
                              </div>
                            </TableCell>

                           
                            {/* Assignment */}
                            {isSelfPreference ? (
                              <TableCell className="px-6 py-4 text-center">
                                {order.status === "booked" || order.status === "undelivered" ? (
                                  <>
                                    {/* =========================================================
                                        NOT ASSIGNED / ASSIGN RIDER
                                        LOGIC SAME
                                    ========================================================= */}
                                    <AlertDialog
                                      open={isOpenIndividualAssignmnet === order.id}
                                      onOpenChange={(open) => {
                                        if (!open) {
                                          setIsOpenIndividualAssignmnet("");
                                        }
                                      }}
                                    >
                                      {/* ================= TRIGGER ================= */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (selectedStatus == "All") {
                                            return;
                                          }

                                          // SAME LOGIC
                                          getRidersOutsideIdealLoad([order.id]);

                                          setIsOpenIndividualAssignmnet(order.id);
                                        }}
                                        className="group inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/15"
                                      >
                                      

                                        Not Assigned
                                      </button>

                                      {/* ================= DIALOG ================= */}
                                      <AlertDialogContent className="!max-w-[480px] overflow-hidden rounded-xl border border-neutral-200 bg-white p-0 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
                                        <form
                                          onSubmit={(e) => {
                                            e.preventDefault();

                                            // SAME LOGIC
                                            const selectedRider = assignmentState;

                                            if (!selectedRider) {
                                              toast.warn("Please select a rider");
                                              return;
                                            }

                                            assignOrderToRider(
                                              order.id,
                                              selectedRider
                                            );

                                            setIsOpenIndividualAssignmnet("");
                                          }}
                                        >
                                          {/* ================= HEADER ================= */}
                                          <AlertDialogHeader className="border-b border-neutral-200 bg-neutral-50/70 px-6 py-5 text-left dark:border-neutral-800 dark:bg-neutral-950/30">
                                            <div className="flex items-start gap-3">
                                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="20"
                                                  height="20"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                >
                                                  <circle cx="9" cy="7" r="4" />
                                                  <path d="M3 21v-2a6 6 0 0 1 6-6h2" />
                                                  <path d="M19 8v6" />
                                                  <path d="M22 11h-6" />
                                                </svg>
                                              </div>

                                              <div className="min-w-0">
                                                <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
                                                  Assign Rider
                                                </AlertDialogTitle>

                                                <AlertDialogDescription className="mt-1 text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                                                  Select an available rider for this order.
                                                </AlertDialogDescription>
                                              </div>
                                            </div>
                                          </AlertDialogHeader>

                                          {/* ================= BODY ================= */}
                                          <div className="space-y-5 px-6 py-5">
                                            {/* ORDER INFORMATION */}
                                            <div className="rounded-lg border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/30">
                                              <div className="flex items-center justify-between gap-4">
                                                <div className="min-w-0 text-left">
                                                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                                    Order
                                                  </p>

                                                  <p className="mt-1 truncate text-sm font-semibold text-neutral-900 dark:text-white">
                                                    #{order.id}
                                                  </p>
                                                </div>

                                                <div className="text-right">
                                                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                                    Assignment
                                                  </p>

                                                  <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                    Not Assigned
                                                  </span>
                                                </div>
                                              </div>
                                            </div>

                                            {/* ================= RIDER SELECT ================= */}
                                            <div>
                                              <label className="mb-2 block text-left text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                                Select Rider
                                                <span className="ml-1 text-red-500">*</span>
                                              </label>

                                              <select
                                                value={assignmentState}
                                                onChange={(e) =>
                                                  setAssignmentState(e.target.value)
                                                }
                                                className="h-11 w-full cursor-pointer rounded-lg border border-neutral-200 bg-white px-3.5 text-sm text-neutral-800 outline-none transition-all focus:border-[#0446DB] focus:ring-4 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
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

                                              <p className="mt-2 text-left text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                                                Select a rider from the available rider list.
                                              </p>
                                            </div>

                                            {/* RIDER INFO */}
                                            {assignmentState && (
                                              <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-500/20 dark:bg-blue-500/5">
                                                <div className="flex items-start gap-3">
                                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                                                    ✓
                                                  </div>

                                                  <div className="text-left">
                                                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                                      Rider Selected
                                                    </p>

                                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                      Click Assign Rider to assign this
                                                      order to the selected rider.
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </div>

                                          {/* ================= FOOTER ================= */}
                                          <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-6 my-1 dark:border-neutral-800 dark:bg-neutral-950/30">
                                            <AlertDialogCancel
                                              type="button"
                                              onClick={() =>
                                               { 
                                                setIsOpenIndividualAssignmnet("")
                                                 clearAllState()}
                                              }
                                              className="h-10 cursor-pointer rounded-lg border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-700 shadow-none transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                            >
                                              Close
                                            </AlertDialogCancel>

                                            <button
                                              type="submit"
                                              className="h-10 cursor-pointer rounded-lg bg-[#0446DB] px-5 text-sm font-semibold text-white transition-all hover:bg-[#0339B5]"
                                            >
                                              Assign Rider
                                            </button>
                                          </AlertDialogFooter>
                                        </form>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </>
                                ) : order.status === "pending pickup" ||
                                  order.status === "undelivered assigned" ? (
                                  <>
                                    {/* =========================================================
                                        ASSIGNED / CANCEL RIDER ASSIGNMENT
                                        LOGIC SAME
                                    ========================================================= */}

                                    <AlertDialog
                                      open={isOpenIndividualAssignmnet === order.id}
                                      onOpenChange={(open) => {
                                        if (!open) {
                                          setIsOpenIndividualAssignmnet("");
                                        }
                                      }}
                                    >
                                      {/* ================= TRIGGER ================= */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (selectedStatus == "All") {
                                            return;
                                          }

                                          // SAME LOGIC
                                          setIsOpenIndividualAssignmnet(order.id);
                                        }}
                                        className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/15"
                                      >
                                       

                                        Assigned
                                      </button>

                                      {/* ================= DIALOG ================= */}
                                      <AlertDialogContent className="!max-w-[460px] overflow-hidden rounded-xl border border-neutral-200 bg-white p-0 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
                                        <form
                                          onSubmit={(e) => {
                                            e.preventDefault();

                                            // ======================================
                                            // ORIGINAL LOGIC - NOT CHANGED
                                            // ======================================
                                            cancelRiderAssignment(order.id);

                                            setIsOpenIndividualAssignmnet("");
                                          }}
                                        >
                                          {/* ================= HEADER ================= */}
                                          <AlertDialogHeader className="border-b border-neutral-200 bg-neutral-50/70 px-6 py-5 text-left dark:border-neutral-800 dark:bg-neutral-950/30">
                                            <div className="flex items-start gap-3">
                                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="20"
                                                  height="20"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                >
                                                  <path d="M18 6 6 18" />
                                                  <path d="m6 6 12 12" />
                                                </svg>
                                              </div>

                                              <div className="min-w-0">
                                                <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
                                                  Cancel Rider Assignment
                                                </AlertDialogTitle>

                                                <AlertDialogDescription className="mt-1 text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                                                  Remove the currently assigned rider from
                                                  this order.
                                                </AlertDialogDescription>
                                              </div>
                                            </div>
                                          </AlertDialogHeader>

                                          {/* ================= BODY ================= */}
                                          <div className="space-y-5 px-6 py-5">
                                            {/* ORDER INFO */}
                                            <div className="rounded-lg border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/30">
                                              <div className="flex items-center justify-between gap-4">
                                                <div className="min-w-0 text-left">
                                                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                                    Order
                                                  </p>

                                                  <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">
                                                    #{order.id}
                                                  </p>
                                                </div>

                                                <div className="text-right">
                                                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                                    Assignment
                                                  </p>

                                                  <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                    Assigned
                                                  </span>
                                                </div>
                                              </div>
                                            </div>

                                            {/* WARNING */}
                                            <div className="rounded-lg border border-red-200 bg-red-50/60 p-4 dark:border-red-500/20 dark:bg-red-500/5">
                                              <div className="flex items-start gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                                                  !
                                                </div>

                                                <div className="text-left">
                                                  <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                                                    Cancel rider assignment?
                                                  </p>

                                                  <p className="mt-1 text-xs leading-5 text-red-600/80 dark:text-red-400/80">
                                                    The currently assigned rider will be
                                                    removed from this order.
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          {/* ================= FOOTER ================= */}
                                          <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-6 my-1 dark:border-neutral-800 dark:bg-neutral-950/30">
                                            <AlertDialogCancel
                                              type="button"
                                              onClick={() =>
                                                {setIsOpenIndividualAssignmnet("")

                                                  clearAllState()
                                                }
                                                
                                              }
                                              className="h-10 cursor-pointer rounded-lg border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-700 shadow-none transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                            >
                                              Close
                                            </AlertDialogCancel>

                                            <button
                                              type="submit"
                                              className="h-10 cursor-pointer rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition-all hover:bg-red-700"
                                            >
                                              Cancel Rider Assignment
                                            </button>
                                          </AlertDialogFooter>
                                        </form>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </>
                                ) : order.status === "cancelled" ? (
                                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
                                   
                                    Order Canceled
                                  </span>
                                ) : order.status === "delivered" ? (
                                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-600 dark:bg-green-500/10 dark:text-green-400">
                                
                                    Order Delivered
                                  </span>
                                ) : order.status === "rto delivered" ? (
                                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-600 dark:bg-green-500/10 dark:text-green-400">
                                  
                                    Return To Origin
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-600 dark:bg-green-500/10 dark:text-green-400">
                                  
                                    Assigned
                                  </span>
                                )}
                              </TableCell>
                            ) : (
                              /* =========================================================
                                  NOT SELF PREFERENCE
                                  ORIGINAL DISPLAY LOGIC
                              ========================================================= */
                              <TableCell className="text-center">
                                <span
                                  className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                                    order.status
                                  )}`}
                                >
                                  {toCapitalizeEachWord(order.status)}
                                </span>
                              </TableCell>
                            )}

                            {/* Status */}
                            <TableCell className="px-6 py-4 text-center">
  {isSelfPreference ? (
    <>
      {/* =========================================================
          SELF PREFERENCE
      ========================================================= */}

      {[
        "cancelled",
        "undelivered",
        "delivered",
        "ndr",
        "rto delivered",
      ].includes(order.status) ? (
        <span
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusColor(
            order.status
          )}`}
        >
          {order.status === "rto delivered"
            ? "RTO Delivered"
            : order.status === "ndr"
            ? "NDR"
            : toCapitalizeEachWord(order.status)}
        </span>
      ) : (
        <AlertDialog
          open={editingStatusId === order.id}
          onOpenChange={(open) => {
            if (!open) {
              setEditingStatusId(null);
              setStatus("");
              setremarks("");
            }
          }}
        >
          {/* =====================================================
              STATUS TRIGGER
          ===================================================== */}
          <button
            type="button"
            onClick={() => {
              // ORIGINAL GUARD LOGIC
              if (
                selectedStatus === "in transit" ||
                selectedStatus === "out for delivery" ||
                selectedStatus === "undelivered assigned"
              ) {
                return;
              }

              if (selectedStatus === "All") {
                return;
              }

              setStatus("");
              setremarks("");
              setEditingStatusId(order.id);
            }}
            className="inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0446DB] transition-all duration-200 hover:border-[#0446DB]/30 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/15"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />

            {order.status === "rto in transit"
              ? "RTO In Transit"
              : toCapitalizeEachWord(order.status)}
          </button>

          {/* =====================================================
              STATUS DIALOG
          ===================================================== */}
          <AlertDialogContent className="!max-w-[460px] overflow-hidden rounded-xl border border-neutral-200 bg-white p-0 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                
                const newStatus = statu;
               
                if (!newStatus) {
                  toast.error("Please select status");
                  return;
                }

                if (newStatus === "cancelled" && !remarks) {
                  toast.error("Please select cancel remark");
                  return;
                }

                await updateOrderByMerchant({
                  status: newStatus,
                  order_ids: [order.id],

                  ...(newStatus === "cancelled" && {
                    remarks: remarks,
                  }),
                });

                setEditingStatusId(null);
                setStatus("");
                setremarks("");
              }}
            >
              {/* ================= HEADER ================= */}
              <AlertDialogHeader className="border-b border-neutral-200 bg-neutral-50/60 px-6 py-5 text-left dark:border-neutral-800 dark:bg-neutral-950/30">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                    <FaTasks className="text-sm" />
                  </div>

                  <div>
                    <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
                      Change Order Status
                    </AlertDialogTitle>

                    <AlertDialogDescription className="mt-1 text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                      Update the current status for this order.
                    </AlertDialogDescription>
                  </div>
                </div>
              </AlertDialogHeader>

              {/* ================= BODY ================= */}
              <div className="space-y-5 px-6 py-5">
                {/* ORDER INFO */}
                <div className="rounded-lg border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/30">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 text-left">
                      <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        Current Status
                      </p>

                      <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">
                        Order #{order.id}
                      </p>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status === "rto in transit"
                        ? "RTO In Transit"
                        : toCapitalizeEachWord(order.status)}
                    </span>
                  </div>
                </div>

                {/* =====================================================
                    STATUS
                ===================================================== */}
                <div>
                  <label className="mb-2 block text-left text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    Select Status
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <select
                    name="status"
                    value={statu}
                    onChange={(e) => {
                      const selectedValue = e.target.value;

                      setStatus(selectedValue);

                      if (selectedValue !== "cancelled") {
                        setremarks("");
                      }
                    }}
                    className="h-11 w-full cursor-pointer rounded-lg border border-neutral-200 bg-white px-3.5 text-sm text-neutral-800 outline-none transition-all focus:border-[#0446DB] focus:ring-4 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
                    required
                  >
                    <option value="">Select Status</option>

                    {/* ================= BOOKED ================= */}
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

                    {/* ================= PENDING PICKUP ================= */}
                    {order.status === "pending pickup" && (
                      <>
                        <option value="cancelled">
                          Cancelled
                        </option>

                        <option value="lost">
                          Lost
                        </option>
                      </>
                    )}

                    {/* ================= IN TRANSIT ================= */}
                    {order.status === "in transit" && (
                      <option value="lost">
                        Lost
                      </option>
                    )}

                    {/* ================= OUT FOR DELIVERY ================= */}
                    {order.status === "out for delivery" && (
                      <option value="lost">
                        Lost
                      </option>
                    )}

                    {/* ================= RTO IN TRANSIT ================= */}
                    {order.status === "rto in transit" && (
                      <>
                        <option value="rto delivered">
                          RTO Delivered
                        </option>

                        <option value="lost">
                          Lost
                        </option>
                      </>
                    )}

                    {/* ================= UNDELIVERED ASSIGNED ================= */}
                    {order.status === "undelivered assigned" && (
                      <option value="out for delivery">
                        Out For Delivery
                      </option>
                    )}
                  </select>
                </div>

                {/* =====================================================
                    CANCEL REMARK

                    IMPORTANT:
                    Ab sirf status === cancelled check ho raha hai.
                    Isliye Booked aur Pending Pickup dono me show hoga.
                ===================================================== */}
                {statu === "cancelled" && (
                  <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="block text-left text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        Cancellation Remark
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-600 dark:bg-red-500/10 dark:text-red-400">
                        Required
                      </span>
                    </div>

                    <select
                      name="remarks"
                      value={remarks}
                      onChange={(e) =>
                        setremarks(e.target.value)
                      }
                      className="h-11 w-full cursor-pointer rounded-lg border border-neutral-200 bg-white px-3.5 text-sm text-neutral-800 outline-none transition-all focus:border-red-500 focus:ring-4 focus:ring-red-500/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
                      required
                    >
                      <option value="">
                        Select Cancellation Remark
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

                    <p className="mt-2 text-left text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                      Select the reason why this order is being
                      cancelled.
                    </p>
                  </div>
                )}

                {/* =====================================================
                    CANCEL WARNING
                ===================================================== */}
                {status === "cancelled" && (
                  <div className="animate-in fade-in slide-in-from-top-1 rounded-lg border border-red-200 bg-red-50/60 p-4 duration-200 dark:border-red-500/20 dark:bg-red-500/5">
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                        !
                      </div>

                      <div className="text-left">
                        <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                          Cancel this order?
                        </p>

                        <p className="mt-1 text-xs leading-5 text-red-600/80 dark:text-red-400/80">
                          The selected cancellation remark will be
                          saved with this order.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ================= FOOTER ================= */}
              <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-6 my-1 dark:border-neutral-800 dark:bg-neutral-950/30">
                <AlertDialogCancel
                  type="button"
                  onClick={() => {
                    setEditingStatusId(null);
                    setStatus("");
                    setremarks("");
                    clearAllState()
                  }}
                  className="h-10 cursor-pointer rounded-lg border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-700 shadow-none transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  Close
                </AlertDialogCancel>

                <button
                  type="submit"
                  disabled={
                    !status ||
                    (statu === "cancelled" && !remarks)
                  }
                  className={`h-10 min-w-[120px] cursor-pointer rounded-lg px-5 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                    status === "cancelled"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-[#0446DB] hover:bg-[#0339B5]"
                  }`}
                >
                  {statu === "cancelled"
                    ? "Cancel Order"
                    : "Update Status"}
                </button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  ) : (
    <>
      {/* =========================================================
          DAAKIT PREFERENCE
      ========================================================= */}

      {isDaakitEligibleForCancel ? (
        <AlertDialog
          open={editingStatusId === order.id}
          onOpenChange={(open) => {
            if (!open) {
              setEditingStatusId(null);
              setremarks("");
            }
          }}
        >
          {/* ================= TRIGGER ================= */}
          <button
            type="button"
            onClick={() => {
              setremarks("");
              setEditingStatusId(order.id);
            }}
            className={`inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${getStatusColor(
              order.status
            )}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />

            {toCapitalizeEachWord(order.status)}
          </button>

          {/* ================= DIALOG ================= */}
          <AlertDialogContent className="!max-w-[460px] overflow-hidden rounded-xl border border-neutral-200 bg-white p-0 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                const newStatus =
                  e.target.elements.status.value;

                const remark =
                  e.target.elements.remarks.value;

                if (!remark) {
                  toast.error(
                    "Please select cancel remark"
                  );
                  return;
                }

                await changeStatus({
                  id: order.id,
                  newStatus: newStatus,
                  remarks: remark,
                });

                setEditingStatusId(null);
                setremarks("");
              }}
            >
              {/* ================= HEADER ================= */}
              <AlertDialogHeader className="border-b border-neutral-200 bg-neutral-50/60 px-6 py-5 text-left dark:border-neutral-800 dark:bg-neutral-950/30">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                    !
                  </div>

                  <div>
                    <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
                      Cancel Order
                    </AlertDialogTitle>

                    <AlertDialogDescription className="mt-1 text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                      Select a cancellation reason before
                      cancelling this order.
                    </AlertDialogDescription>
                  </div>
                </div>
              </AlertDialogHeader>

              {/* ================= BODY ================= */}
              <div className="space-y-5 px-6 py-5">
                {/* CURRENT STATUS */}
                <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/30">
                  <div className="text-left">
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      Current Status
                    </p>

                    <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">
                      Order #{order.id}
                    </p>
                  </div>

                  <span
                    className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {toCapitalizeEachWord(order.status)}
                  </span>
                </div>

                {/* STATUS */}
                <div>
                  <label className="mb-2 block text-left text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    Status
                  </label>

                  <select
                    name="status"
                    defaultValue="cancelled"
                    className="h-11 w-full cursor-pointer rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 text-sm text-neutral-700 outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
                    required
                  >
                    <option value="cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>

                {/* CANCEL REMARK */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-left text-sm font-medium text-neutral-800 dark:text-neutral-200">
                      Cancellation Remark
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-600 dark:bg-red-500/10 dark:text-red-400">
                      Required
                    </span>
                  </div>

                  <select
                    name="remarks"
                    value={remarks}
                    onChange={(e) =>
                      setremarks(e.target.value)
                    }
                    className="h-11 w-full cursor-pointer rounded-lg border border-neutral-200 bg-white px-3.5 text-sm text-neutral-800 outline-none transition-all focus:border-red-500 focus:ring-4 focus:ring-red-500/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
                    required
                  >
                    <option value="">
                      Select Cancellation Remark
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

                  <p className="mt-2 text-left text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                    Select the reason why this order is being
                    cancelled.v
                  </p>
                </div>

                {/* WARNING */}
                <div className="rounded-lg border border-red-200 bg-red-50/60 p-4 dark:border-red-500/20 dark:bg-red-500/5">
                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                      !
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                        Cancel this order?
                      </p>

                      <p className="mt-1 text-xs leading-5 text-red-600/80 dark:text-red-400/80">
                        The selected cancellation remark will be
                        saved with this order.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= FOOTER ================= */}
              <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-6 my-1 dark:border-neutral-800 dark:bg-neutral-950/30">
                <AlertDialogCancel
                  type="button"
                  onClick={() => {
                    setEditingStatusId(null);
                    setremarks("");
                    clearAllState()
                  }}
                  className="h-10 cursor-pointer rounded-lg border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-700 shadow-none hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  Close
                </AlertDialogCancel>

                <button
                  type="submit"
                  disabled={!remarks}
                  className="h-10 min-w-[120px] cursor-pointer rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel Order
                </button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <span
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusColor(
            order.status
          )}`}
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
              <div className="w-full min-w-0 border-t border-gray-200 bg-gray-50 px-3 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6 sm:py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-neutral-200 text-center sm:text-left">
                    Page {page} of {orders?.pagination?.totalPages || 1} •{" "}
                    {orders?.pagination?.total || 0} total
                  </p>
                  <div className="flex shrink-0 items-center justify-center gap-2">
                    <Button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-sm text-xs sm:text-sm font-medium transition-all duration-200 ${
                        page === 1
                          ? "bg-gray-300 text-gray-500 dark:bg-neutral-800 dark:text-neutral-500 cursor-not-allowed"
                          : "bg-[#0446DB] text-white hover:bg-[#0339B5] shadow-md hover:shadow-lg"
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
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-sm  text-xs sm:text-sm font-medium transition-all duration-200 ${
                        page === orders?.pagination?.totalPages
                          ? "bg-gray-300 text-gray-500 dark:bg-neutral-800 dark:text-neutral-500 cursor-not-allowed"
                          : "bg-[#0446DB] text-white hover:bg-[#0339B5] shadow-md hover:shadow-lg"
                      }`}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      )
    }
    </>
  );
}

export default TechMerchantOrderDetails;
