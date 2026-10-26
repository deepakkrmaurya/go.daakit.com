// import { useEffect, useState } from "react";
// import axios from "axios";
// import Select from "react-select";
// import { Input } from "@/components/ui/input";
// import {
//   Building2,
//   CheckCircle2,
//   ChevronDown,
//   CreditCardIcon,
//   LogOutIcon,
//   SettingsIcon,
//   UserIcon,
//   Users,
// } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

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
// } from "@/components/ui/alert-dialog";

// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { TbFileInfo } from "react-icons/tb";
// import {
//   FaArrowRight,
//   FaFileExport,
//   FaFilter,
//   FaSearch,
//   FaTasks,
// } from "react-icons/fa";
// import { FaRegCopy } from "react-icons/fa";
// import { CiCircleCheck } from "react-icons/ci";
// import { toast } from "react-toastify";
// import { Link, Navigate, useNavigate } from "react-router-dom";
// import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
// import AxiosInstance from "@/Helper/axiosInstance";
// import CustomButton from "../../common/CustomButton";
// const baseURL = import.meta.env.VITE_BASE_URL;
// const frontEndURL = import.meta.env.VITE_FRONTEND_URL;

// function OrderDetails() {
//   const [newStatus, setNewStatus] = useState("");
//   const [remark, setRemark] = useState("");
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
//   const [assignmentState, setAssignmentState] = useState("");
//   const [riderID, setRiderID] = useState("");
//   const [isOpenIndividualAssignmnet, setIsOpenIndividualAssignmnet] =
//     useState("");
//   const [
//     isOpenIndividualVendorAssignmnet,
//     setIsOpenIndividualVendorAssignmnet,
//   ] = useState("");
//   const [isOpenIndividualAssignmnetMap, setIsOpenIndividualAssignmnetMap] =
//     useState("");
//   const [isOpenIndividualVendorMap, setIsOpenIndividualVendorMap] =
//     useState("");

//   const [bulkStatusState, setBulkStatusState] = useState("");
//   const [selectedBulkOrders, setSelectedBulkOrders] = useState([]);

//   const [fetchBulkAssignmentRider, setFetchBulkAssignmentRider] =
//     useState(false);
//   const [fetchBulkAssignmentVendor, setFetchBulkAssignmentVendor] =
//     useState(false);
//   const [canceledBulkOrder, setcanceledBulkOrder] = useState(false);
//   const [dcBulkOrder, setDcBulkOrder] = useState(false);
//   const [bulkOrderWeight, setBulkOrderWeight] = useState(0);
//   const [editingStatusId, setEditingStatusId] = useState(null);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [isMobileFilterDrawerOpen, setIsMobileFilterDrawerOpen] =
//     useState(false);
//   const [isDesktopFilterDrawerOpen, setIsDesktopFilterDrawerOpen] =
//     useState(false);
//   const [openOfd, setopenOfd] = useState([]);
//   const [openDelivered, setopenDeliverde] = useState([]);
//   const [remarks, setRemarks] = useState("");
//   const [sub_remarks, setSub_remarks] = useState("");
//   const [rescheduleDate, setRescheduleDate] = useState("");
//   const [detailed_remarks, setdetailed_remarks] = useState("");
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

//   const NDR_REASONS = [
//     "Origin Unavailable",
//     "Origin Closed",
//     "Origin Refused",
//     "Contact Person Unavailable",
//     "Origin Not Reachable",
//     "Address Not Found",
//     "Delivery Attempt Failed",
//     "Other",
//   ];

//   // Add these states inside your component
//   const [ndrstatus, setNdrStatus] = useState("");
//   const [ndrDialogOpen, setNdrDialogOpen] = useState(false);
//   const [ndrReason, setNdrReason] = useState("");
//   const [ndrRemarks, setNdrRemarks] = useState("");
//   const [ndrLoading, setNdrLoading] = useState(false);
//   const handleStatusChange = (e) => {
//     const value = e.target.value;

//     if (value === "ndr") {
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
//     delivery_contact_name: "",
//     delivery_address_line: "",
//     delivery_city: "",
//     delivery_state: "",
//     delivery_pincode: "",
//   });
//   const [pickupFormData, setPickupFormData] = useState({
//     pickup_contact_name: "" || "",
//     pickup_phone: "",
//     pickup_address_line: "",
//     pickup_city: "",
//     pickup_state: "",
//     pickup_pincode: "",
//   });

//   const [vendorList, setVendorList] = useState([]);
//   const [merchantList, setMerchantList] = useState([]);

//   const [checkVendorMapping, setCheckVendorMapping] = useState(null);
//   const [filterUpdate, setFilterUpdate] = useState(false);
//   const navigate = useNavigate();
//   const clearAll = () => {
//     setNewStatus("");
//     setRemark("");

//     setBulkOrderWeight(0);
//     setFetchBulkAssignmentVendor(false);
//     setSelectedMapType(null);
//     setEditingStatusId(null);
//     setAssignmentState("");
//     setLoading(false);
//     setRiders([]);
//     setopenOfd([]);
//     setopenDeliverde([]);
//     setRescheduleDate("");
//     setRemarks("");
//     setSub_remarks("");
//     setdetailed_remarks("");
//     setFetchBulkAssignmentRider(false);
//     setcanceledBulkOrder(false);
//     setIsOpenIndividualAssignmnet("");
//     setIsOpenIndividualVendorAssignmnet("");
//     setIsOpenIndividualAssignmnetMap("");
//     setIsOpenIndividualVendorMap("");
//     setVendor([]); // Clear vendors
//     setCheckVendorMapping(null); // Reset vendor mapping check
//     setBulkStatusState(""); // Clear bulk status
//     setEditingDeliveryId(null); // Clear delivery editing state
//     setEditingPickupId(null); // Clear pickup editing state
//     // Reset form data if needed
//     setDeliveryFormData({
//       delivery_contact_name: "",
//       delivery_address_line: "",
//       delivery_city: "",
//       delivery_state: "",
//       delivery_pincode: "",
//     });
//     setPickupFormData({
//       pickup_contact_name: "" || "",
//       pickup_phone: "",
//       pickup_address_line: "",
//       pickup_city: "",
//       pickup_state: "",
//       pickup_pincode: "",
//     });
//   };
//   const clearAllState = () => {
//     setNewStatus("");
//     setRemark("");
//     setSelectedBulkOrders([]);
//     setBulkOrderWeight(0);
//     setFetchBulkAssignmentVendor(false);
//     setSelectedMapType(null);
//     setEditingStatusId(null);
//     setAssignmentState("");
//     setLoading(false);
//     setRiders([]);
//     setopenOfd([]);
//     setopenDeliverde([]);
//     setRescheduleDate("");
//     setRemarks("");
//     setSub_remarks("");
//     setdetailed_remarks("");
//     setFetchBulkAssignmentRider(false);
//     setcanceledBulkOrder(false);
//     setIsOpenIndividualAssignmnet("");
//     setIsOpenIndividualVendorAssignmnet("");
//     setIsOpenIndividualAssignmnetMap("");
//     setIsOpenIndividualVendorMap("");
//     setVendor([]); // Clear vendors
//     setCheckVendorMapping(null); // Reset vendor mapping check
//     setBulkStatusState(""); // Clear bulk status
//     setEditingDeliveryId(null); // Clear delivery editing state
//     setEditingPickupId(null); // Clear pickup editing state
//     // Reset form data if needed
//     setDeliveryFormData({
//       delivery_contact_name: "",
//       delivery_address_line: "",
//       delivery_city: "",
//       delivery_state: "",
//       delivery_pincode: "",
//     });
//     setPickupFormData({
//       pickup_contact_name: "" || "",
//       pickup_phone: "",
//       pickup_address_line: "",
//       pickup_city: "",
//       pickup_state: "",
//       pickup_pincode: "",
//     });
//     setDcBulkOrder(false);
//   };
//   function toCapitalizeEachWord(str) {
//     return str
//       .split(" ")
//       .map((word) => {
//         if (!word) return "";
//         return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//       })
//       .join(" ");
//   }








// const [bulkMappingOpen, setBulkMappingOpen] = useState(false);
// const [bulkMappingLoading, setBulkMappingLoading] = useState(false);

// const undeliveredOrders = selectedBulkOrders.filter(
//   (order) => order.status === "undelivered"
// );

// const allSelectedUndelivered =
//   selectedBulkOrders.length > 0 &&
//   undeliveredOrders.length === selectedBulkOrders.length;

// const handleOpenBulkVendorMapping = async () => {
//   if (!allSelectedUndelivered) {
//     toast.warn("Please select only undelivered orders");
//     return;
//   }

//   setBulkMappingLoading(true);
//   setAssignmentState("");
//   setCheckVendorMapping(null);

//   try {
//     const orderIds = undeliveredOrders.map((order) => order.id);

//     // Existing function ko selected order IDs ke saath call karo
//     await fetchVendor(orderIds);

//     setBulkMappingOpen(true);
//   } catch (error) {
//     toast.error("Failed to load eligible vendors");
//   } finally {
//     setBulkMappingLoading(false);
//   }
// };

// const handleBulkChangeVendorMapping = async (e) => {
//   e.preventDefault();

//   if (!allSelectedUndelivered) {
//     toast.warn("Please select only undelivered orders");
//     return;
//   }

//   if (!assignmentState) {
//     toast.warn("Please select a vendor");
//     return;
//   }

//   setBulkMappingLoading(true);

//   try {
//     for (const order of undeliveredOrders) {
//       await changeVendorMapping(order.id, assignmentState);
//     }

//     setBulkMappingOpen(false);
//     setAssignmentState("");
//     setSelectedBulkOrders([]);
//     fetchOrders();
//   } finally {
//     setBulkMappingLoading(false);
//   }
// };

// const handleBulkRevokeVendorMapping = async () => {
//   if (!allSelectedUndelivered) {
//     toast.warn("Please select only undelivered orders");
//     return;
//   }

//   setBulkMappingLoading(true);

//   try {
//     for (const order of undeliveredOrders) {
//       await revokeVendorMapping(order.id);
//     }

//     setBulkMappingOpen(false);
//     setSelectedBulkOrders([]);
//     fetchOrders();
//   } finally {
//     setBulkMappingLoading(false);
//   }
// };

































//   const getAllVendors = async () => {
//     try {
//       const res = await AxiosInstance.get("/api/admin/getAllVendors", {
//         params: {
//           limit: 1000,
//         },
//       });

//       setVendorList(res.data.data || []);
//     } catch (err) {
//       setVendorList([]);
//       toast.error(
//         err.response?.data?.message ||
//           err.message ||
//           "An error occurred while fetching vendors.",
//       );
//     }
//   };
//   const getAllMerchant = async () => {
//     try {
//       const res = await AxiosInstance.get("/api/admin/getAllMerchants", {
//         params: {
//           limit: 1000,
//         },
//       });

//       setMerchantList(res.data.data || []);
//     } catch (err) {
//       setMerchantList([]);
//       toast.error(
//         err.response?.data?.message ||
//           err.message ||
//           "An error occurred while fetching vendors.",
//       );
//     }
//   };

//   const openDatePicker = (event) => {
//     try {
//       event.currentTarget.showPicker?.();
//     } catch {
//       return;
//     }
//   };

//   const updateAdvanceFilter = (field, value) => {
//     setAdvanceFilters((prev) => {
//       const next = {
//         ...prev,
//         [field]: value,
//       };

//       if (
//         field === "startDate" &&
//         next.endDate &&
//         value &&
//         next.endDate < value
//       ) {
//         next.endDate = value;
//       }

//       if (
//         field === "endDate" &&
//         next.startDate &&
//         value &&
//         next.startDate > value
//       ) {
//         next.startDate = value;
//       }

//       return next;
//     });
//   };

//   const closeFilterDrawers = () => {
//     setIsFilterOpen(false);
//     setIsMobileFilterDrawerOpen(false);
//     setIsDesktopFilterDrawerOpen(false);
//   };

//   const applyFilters = () => {
//     if (
//       advanceFilters.startDate &&
//       advanceFilters.endDate &&
//       advanceFilters.startDate > advanceFilters.endDate
//     ) {
//       toast.error("Start date cannot be after end date");
//       return false;
//     }

//     setPage(1);
//     setFilterUpdate((prev) => !prev);
//     closeFilterDrawers();
//     return true;
//   };

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

//   const resetFilters = () => {
//     resetAdvanceFilters();
//     setPage(1);
//     setFilterUpdate((prev) => !prev);
//     closeFilterDrawers();
//     clearAllState();
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
//     // "rto out for delivery",
//     // "rto undelivered",
//     // "rto delivered",
//   ];
//   const [selectedStatus, setSelectedStatus] = useState("All");
//   const [dcList, setDcList] = useState([]);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       // setSelectedLiveStatus(selectedStatus)
//       // console.log(selectedStatus)
//       const res = await axios.get(`${baseURL}/api/admin/getallorders`, {
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
//       toast.error(
//         err.response?.data?.message ||
//           err.message ||
//           "An error occurred while fetching orders.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDcList = async () => {
//     try {
//       const getDcList = await AxiosInstance.get(`/api/dc/list`);
//       console.log("getDcList", getDcList?.data?.data);
//       setDcList(getDcList?.data?.data || []);
//     } catch (error) {
//       setDcList([]);
//     }
//   };

//   const handleUpdateDeliveryDetails = async (data) => {
//     try {
//       const res = await axios.post(
//         `${baseURL}/api/admin/updateOrderDetails`,
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );
//       toast.success("Delivery details updated successfully");
//       fetchOrders();
//       setEditingDeliveryId(null);
//       setEditingPickupId(null);
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || "Failed to update delivery details",
//       );
//     }
//   };

//   const generateBulkPickupRequest = async (order_ids) => {
//     try {
//       const res = await AxiosInstance.post(
//         `/api/admin/generateBulkPickupRequest`,
//         {
//           order_ids: order_ids,
//         },
//       );
//       fetchOrders();
//       toast.success(res?.data?.message);
//       clearAllState();
//     } catch (error) {
//       toast.error(error?.response?.data?.message);
//     }
//   };

//   const assignOrdersToDc = async ({ order_ids, dc_id }) => {
//     try {
//       const res = await AxiosInstance.post(`/api/dc/admin/assignOrders`, {
//         order_ids,
//         dc_id,
//       });
//       toast.success(res?.data?.message);
//       clearAllState();
//       fetchOrders();
//     } catch (error) {
//       toast.error(error?.response?.data?.message);
//     }
//   };

//   const handleSearch = () => {
//     const value = searchTerm.trim().toUpperCase();

//     setPage(1);

//     setAdvanceFilters((prev) => {
//       if (!value) {
//         return {
//           ...prev,
//           awbNumber: "",
//           order_id: "",
//         };
//       }

//       if (
//         value.startsWith("DKTGO") ||
//         value.startsWith("HL") ||
//         value.startsWith("DKT") ||
//         value.startsWith("PU")
//       ) {
//         return {
//           ...prev,
//           awbNumber: value,
//           order_id: "",
//         };
//       }

//       return {
//         ...prev,
//         order_id: value,
//         awbNumber: "",
//       };
//     });

//     setFilterUpdate((prev) => !prev);
//   };

//   const fetchVendor = async (order_ids) => {
//     if (order_ids.length === 0) {
//       return;
//     }

//     try {
//       const res = await axios.get(
//         `${baseURL}/api/admin/getEligibleVendorsByOrders?order_id=${order_ids}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );

//       setVendor(res.data.data || []);
//       // if (res.data.data.length == 0) {
//       //   setSelectedBulkOrders([]);
//       //   setBulkOrderWeight(0);
//       //   setFetchBulkAssignmentRider(false);
//       //   setFetchBulkAssignmentVendor(false);
//       //   setcanceledBulkOrder(false)
//       // }
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || err.message || "Failed to load riders",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };
//   const fetchRider = async (vendor_ids) => {
//     if (!vendor_ids || vendor_ids.length === 0) {
//       return;
//     }

//     // Check if all vendor IDs are the same
//     const allSame = vendor_ids.every((id) => id === vendor_ids[0]);

//     if (!allSame) {
//       toast.error("Selected orders must belong to the same vendor");
//       setSelectedBulkOrders([]);
//       setBulkOrderWeight(0);
//       return;
//     }

//     const vendor_id = vendor_ids[0];

//     try {
//       const res = await axios.get(
//         `${baseURL}/api/admin/getRidersByVendorId?vendor_id=${vendor_id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );

//       setRiders(res.data.data || []);
//       // if (res.data.data.length == 0) {
//       //   setSelectedBulkOrders([]);
//       //   setBulkOrderWeight(0);
//       //   setFetchBulkAssignmentRider(false);
//       //   setFetchBulkAssignmentVendor(false);
//       //   setcanceledBulkOrder(false)
//       // }
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || err.message || "Failed to load riders",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const revokeVendorMapping = async (order_ids) => {
//     if (!order_ids) {
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `${baseURL}/api/admin/revokeVendorMapping`,
//         { order_id: order_ids },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );

//       toast.success(res.data.message || "Vendor mapping revoked successfully");
//       setCheckVendorMapping(null);
//       setIsOpenIndividualVendorMap("");
//       setIsOpenIndividualVendorMap("");
//       checkVendorMappingStatus(order_ids);
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || err.message || "Failed to load riders",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkVendorMappingStatus = async (order_ids) => {
//     if (!order_ids) {
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `${baseURL}/api/admin/checkVendorMappingStatus`,
//         { order_id: order_ids },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );

//       setCheckVendorMapping(res.data || []);
//     } catch (err) {
//       setCheckVendorMapping(err.response.data || []);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const assignVendor = async (orderId, vendorId) => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${baseURL}/api/admin/assignOrderToVendor`,
//         { order_id: orderId, vendor_id: vendorId },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );

//       toast.success(res.data.message || "Vendor assigned successfully");
//       fetchOrders();
//       clearAllState();
//       setAssignmentState("");
//       setSelectedBulkOrders([]);
//       setBulkOrderWeight(0);
//       setFetchBulkAssignmentRider(false);
//     } catch (err) {
//       toast.error("Failed to assign vendor");
//       return;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const changeVendorMapping = async (orderId, vendorId) => {
//     try {
//       const res = await axios.post(
//         `${baseURL}/api/admin/changeVendorMapping`,
//         {
//           order_id: orderId,
//           new_vendor_id: vendorId,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );

//       toast.success(res.data.message || "Vendor assigned successfully");
//       fetchOrders();
//       setIsOpenIndividualVendorMap("");
//       setAssignmentState("");
//       setSelectedBulkOrders([]);
//       setBulkOrderWeight(0);
//       setFetchBulkAssignmentRider(false);
//     } catch (err) {
//       toast.error(err.response.data.message);
//       return;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const assignBulkOrderVendor = async (orderIds, vendorId) => {
//     setLoading(true);
//     try {
//       await axios.post(
//         `${baseURL}/api/admin/bulkAssignOrdersToVendor`,
//         {
//           order_ids: orderIds,
//           vendor_id: vendorId,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );

//       toast.success("Vendor assigned successfully");
//       fetchOrders();
//       clearAllState();
//       setAssignmentState("");
//       setSelectedBulkOrders([]);
//       setBulkOrderWeight(0);
//       setFetchBulkAssignmentRider(false);
//     } catch (err) {
//       toast.error("Failed to assign vendor");
//       return;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const cancelRiderAssignment = async (id) => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${baseURL}/api/admin/cancelRiderAssignment/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );
//       fetchOrders();
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message ||
//           err.message ||
//           "Error while canceling rider assignment: ",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const cancelVendorAssignment = async (id) => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${baseURL}/api/admin/cancelMappedWithByAdmin/${id}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );
//       toast.success(res.data.message);
//       fetchOrders();
//       return;
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message ||
//           err.message ||
//           "Error while canceling rider assignment: ",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const CancelDcMapping = async ({ orderIds }) => {
//     try {
//       setLoading(true);

//       const responses = await Promise.all(
//         orderIds.map((id) =>
//           AxiosInstance.post(`/api/dc/admin/cancelOrderMapping/${id}`, {}),
//         ),
//       );

//       toast.success(
//         responses[0]?.data?.message || "DC mapping cancelled successfully",
//       );

//       setSelectedBulkOrders([]);
//       setBulkOrderWeight(0);

//       fetchOrders();
//       clearAllState();
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Error while canceling DC mapping",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const changeStatus = async ({ id, newStatus, remark }) => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${baseURL}/api/admin/updatestatus/${id}`,
//         {
//           status: newStatus,
//           remarks: remark,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );
//       fetchOrders();
//       setEditingStatusId(null);
//       toast.success(res?.data?.message);
//       clearAllState();
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || err.message || "Failed to update status",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const changeOrderStatus = async ({
//     order_ids = [],
//     newStatus = "",
//     rider_id = "",
//     remarks = "",
//     sub_remarks = "",
//     detailed_remarks = "",
//     rescheduled_date = "",
//   }) => {
//     setLoading(true);

//     try {
//       const promises = order_ids.map((order_id) =>
//         axios.post(
//           `${baseURL}/api/admin/updatestatus/${order_id}`,
//           {
//             order_id,
//             status: newStatus,
//             rider_id,
//             remarks,
//             sub_remarks,
//             detailed_remarks,
//             rescheduled_date,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           },
//         ),
//       );

//       const responses = await Promise.all(promises);

//       clearAllState();
//       fetchOrders();

//       toast.success(
//         responses[0]?.data?.message || "Orders updated successfully",
//       );

//       return responses.map((res) => res.data);
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || err.message || "Failed to update status",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const cancelRiderAssignments = async (order_ids = []) => {
//     try {
//       const promises = order_ids.map((order_id) =>
//         axios.post(
//           `${baseURL}/api/admin/cancelRiderAssignment/${order_id}`,
//           {},
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           },
//         ),
//       );

//       const responses = await Promise.all(promises);

//       toast.success("Rider assignment cancelled successfully");

//       clearAllState();
//       fetchOrders();

//       return responses.map((res) => res.data);
//     } catch (error) {
//       console.error("Cancel rider assignment error:", error);

//       toast.error(
//         error.response?.data?.message || "Failed to cancel rider assignment",
//       );

//       return {
//         success: false,
//         message: error.response?.data?.message || "Something went wrong",
//       };
//     }
//   };

//   const rtoDelivered = async (ids = []) => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${baseURL}/api/admin/markOrdersRtoDeliveredByAdmin`,
//         { order_ids: [...ids] },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );
//       fetchOrders();
//       setEditingStatusId(null);
//       toast.success(res?.data?.message);
//       clearAllState();
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || err.message || "Failed to update status",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleSelectAll = () => {
//     if (
//       selectedBulkOrders.length ===
//       orders.filter(
//         (o) => o.tpc_awb_number === null && o.rider_preference === "daakit",
//       ).length
//     ) {
//       setSelectedBulkOrders([]);
//       setBulkOrderWeight(0);
//       clearAllState();
//     } else {
//       const ord = orders.filter(
//         (order) =>
//           order.tpc_awb_number == null && order.rider_preference === "daakit",
//       );

//       setSelectedBulkOrders(ord);

//       const totalWeight = orders
//         .filter((order) => order.tpc_awb_number == null)
//         .reduce((acc, order) => acc + Number(order.total_weight), 0);
//       setBulkOrderWeight(totalWeight);
//     }
//   };

//   const exportCSV = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${baseURL}/api/admin/exportOrders`, {
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
//       toast.error(
//         err.response?.data?.message || err.message || "Failed to export orders",
//       );
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

//   const handleBulkOrderSelect = (order, isChecked) => {
//     if (selectedStatus !== "picked") return;

//     if (order?.pickup_stage !== "at_central_hub") {
//       toast.error("Only orders at the Central Hub can be selected.");
//       return;
//     }

//     const currentType = getOrderMapType(order);

//     if (isChecked) {
//       if (selectedMapType && selectedMapType !== currentType) {
//         setSelectedBulkOrders([]);
//         setSelectedMapType(null);
//         setBulkOrderWeight(0);
//         return;
//         // toast.error("Please select either mapped orders or unmapped orders, not both."); return;
//       }

//       setSelectedBulkOrders((prev) => {
//         const alreadyExists = prev.some((item) => item.id === order.id);

//         if (alreadyExists) return prev;

//         const updated = [...prev, order];
//         const order_ids = updated.map((o) => o.id);

//         setSelectedMapType(currentType);
//         setBulkOrderWeight(
//           (prevWeight) => Number(prevWeight) + Number(order.total_weight || 0),
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
//         (prevWeight) => Number(prevWeight) - Number(order.total_weight || 0),
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

//   useEffect(() => {
//     resetAdvanceFilters();
//     getAllVendors();
//   }, []);

//   useEffect(() => {
//     fetchDcList();
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

//   const canMarkInTransit = selectedBulkOrders.every(
//     (order) =>
//       order.status === "picked" &&
//       order.mapped_with &&
//       (order.pickup_stage === null || order.pickup_stage === "at_vendor"),
//   );

//   const canAssignUndelivered = selectedBulkOrders.every(
//     (order) => order.status === "undelivered",
//   );

//   const [loadingPage, setLoadingPage] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoadingPage(false);
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []);

  

//   return (
//     <>
//       {loadingPage ? (
//         <>
//           <div className=" w-full h-[90vh] flex justify-center items-center">
//             <div>
//               <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//               <p className="mt-2"> Loading Order Details...</p>
//             </div>
//           </div>
//         </>
//       ) : (
//         <>
//           <div className="bg-[#f5f8fb] h-[90vh] overflow-hidden dark:bg-gray-900  w-full">
//             <div className=" sticky top-0 left-0  z-10  dark:bg-neutral-900  ">
//               <div className="  mx-auto   ">
//                 {/* Desktop Layout */}
//                 <div className=" md:flex  items-center justify-between ">
//                   <div className="flex-shrink-0">
//                     <h1 className="text-2xl font-bold dark:text-white">
//                       Order Details
//                     </h1>
//                   </div>

//                   <div className="flex-1 max-w-xl mx-8">
//                     <form
//                       className="flex w-full"
//                       onSubmit={(e) => {
//                         e.preventDefault();
//                         handleSearch();
//                       }}
//                     >
//                       <input
//                         type="text"
//                         placeholder="Search by AWB Number..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="flex-grow px-4 py-2.5 rounded-l-lg text-sm text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent"
//                       />
//                       <button
//                         type="submit"
//                         className="bg-white px-5 py-2.5 rounded-r-lg border border-l-0 border-gray-300 text-gray-600 hover:bg-indigo-100 hover:text-[#0446DB] transition"
//                       >
//                         <FaSearch />
//                       </button>
//                     </form>
//                   </div>

//                   <div className="flex items-center gap-4">
//                     <Link to="/admin/bookOrders" className="block w-full">
//                       <CustomButton
//                         variant="outline"
//                         size="md"
//                         icon={FaTasks}
//                         className="w-full mt-1 whitespace-nowrap rounded-sm"
//                       >
//                         Assignment Console
//                       </CustomButton>
//                     </Link>

//                     <CustomButton
//                       variant="outline"
//                       size="md"
//                       icon={FaFileExport}
//                       onClick={exportCSV}
//                       className="w-full mt-1 rounded-sm "
//                     >
//                       Export
//                     </CustomButton>

//                     <Drawer
//                       direction="right"
//                       open={isDesktopFilterDrawerOpen}
//                       onOpenChange={setIsDesktopFilterDrawerOpen}
//                     >
//                       <DrawerTrigger asChild>
//                         <CustomButton
//                           variant="outline"
//                           size="md"
//                           icon={FaFilter}
//                           className="w-full mt-1 rounded-sm"
//                         >
//                           Filter
//                         </CustomButton>
//                       </DrawerTrigger>
//                       <DrawerContent>
//                         <DrawerHeader>
//                           <DrawerTitle>Filter</DrawerTitle>
//                         </DrawerHeader>
//                         <div className="no-scrollbar overflow-y-auto px-4">
//                           <form
//                             onSubmit={(e) => e.preventDefault()}
//                             className=" w-full"
//                           >
//                             <div className="gap-y-2 mb-2">
//                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
//                                 <div>
//                                   <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">
//                                     Start Date
//                                   </label>
//                                   <input
//                                     type="date"
//                                     value={advanceFilters.startDate}
//                                     max={advanceFilters.endDate || undefined}
//                                     onClick={openDatePicker}
//                                     onFocus={openDatePicker}
//                                     onChange={(e) =>
//                                       updateAdvanceFilter(
//                                         "startDate",
//                                         e.target.value,
//                                       )
//                                     }
//                                     className="w-full cursor-pointer border dark:border-gray-700 bg-white text-gray-900 dark:bg-gray-800 
//       dark:text-white px-3 py-2 rounded-sm text-sm 
//       focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                   />
//                                 </div>

//                                 {/* End Date */}
//                                 <div>
//                                   <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">
//                                     End Date
//                                   </label>
//                                   <input
//                                     type="date"
//                                     value={advanceFilters.endDate}
//                                     min={advanceFilters.startDate || undefined}
//                                     onClick={openDatePicker}
//                                     onFocus={openDatePicker}
//                                     onChange={(e) =>
//                                       updateAdvanceFilter(
//                                         "endDate",
//                                         e.target.value,
//                                       )
//                                     }
//                                     className="w-full cursor-pointer border dark:border-gray-700 bg-white text-gray-900 dark:bg-gray-800 
//       dark:text-white px-3 py-2 rounded-sm text-sm 
//       focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                   />
//                                 </div>
//                               </div>

//                               <div className=" mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
//                                 <div>
//                                   <label className="block text-xs dark:text-white text-gray-600 mb-1">
//                                     Order Specific
//                                   </label>
//                                   <select
//                                     value={advanceFilters.order_specific}
//                                     onChange={(e) => {
//                                       setAdvanceFilters((prev) => ({
//                                         ...prev,
//                                         order_specific: e.target.value,
//                                       }));
//                                     }}
//                                     className="w-full border dark:border-gray-700 dark:bg-gray-800 
//       dark:text-white px-3 py-2 rounded-sm text-sm 
//       focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                   >
//                                     <option value="">All orders</option>
//                                     <option value="Turant">Turant</option>
//                                     <option value="SDD">
//                                       Same Day Delivery
//                                     </option>
//                                     <option value="NDD">
//                                       Next Day Delivery
//                                     </option>
//                                   </select>
//                                 </div>
//                                 <div>
//                                   <label className="block text-xs dark:text-white text-gray-600 mb-1">
//                                     AWB Number(s)
//                                   </label>
//                                   <input
//                                     type="text"
//                                     value={advanceFilters.awbNumber}
//                                     onChange={(e) =>
//                                       setAdvanceFilters((prev) => ({
//                                         ...prev,
//                                         awbNumber: e.target.value,
//                                       }))
//                                     }
//                                     placeholder="AWB Number(s)"
//                                     className="w-full border dark:border-gray-700 dark:bg-gray-800 
//       dark:text-white px-3 py-2 rounded-sm text-sm 
//       focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                   />
//                                 </div>
//                               </div>

//                               <div className=" mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
//                                 <div>
//                                   <label className="block text-xs dark:text-white text-gray-600 mb-1">
//                                     Merchant ID
//                                   </label>

                                  
//                                   <input
//                                     type="number"
//                                     value={advanceFilters.merchant_id}
//                                     onChange={(e) =>
//                                       setAdvanceFilters((prev) => ({
//                                         ...prev,
//                                         merchant_id: e.target.value,
//                                       }))
//                                     }
//                                     placeholder="Integer Only"
//                                     className="w-full border dark:border-gray-700 dark:bg-gray-800 
//       dark:text-white px-3 py-2 rounded-sm text-sm 
//       focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                   />
//                                 </div>

//                                 <div>
//                                   <label className="block text-xs dark:text-white text-gray-600 mb-1">
//                                     City
//                                   </label>

//                                   <input
//                                     type="text"
//                                     value={advanceFilters.city}
//                                     onChange={(e) =>
//                                       setAdvanceFilters((prev) => ({
//                                         ...prev,
//                                         city: e.target.value,
//                                       }))
//                                     }
//                                     placeholder="Enter City"
//                                     className="w-full border dark:border-gray-700 dark:bg-gray-800 
//       dark:text-white px-3 py-2 rounded-sm text-sm 
//       focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                   />
//                                 </div>
//                               </div>

//                               <div className=" mt-2 grid  grid-cols-1 md:grid-cols-2 gap-4 w-full">
//                                 <div>
//                                   <label className="block text-xs dark:text-white text-gray-600 mb-1">
//                                     Vendor ID
//                                   </label>

//                                   <select 
//                                   value={advanceFilters.vendor_id}
//                                     onChange={(e) =>
//                                       setAdvanceFilters((prev) => ({
//                                         ...prev,
//                                         vendor_id: e.target.value,
//                                       }))
//                                     }
//                                    className="w-full border dark:border-gray-700 dark:bg-gray-800 
//       dark:text-white px-3 py-2 rounded-sm text-sm 
//       focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                 
//                                   >
//                                     <option value="">Select Vendor</option>
//                                     {vendorList?.map((v) => {
                                      
//                                       return (
//                                         <option value={v?.id}>{v?.vendor_name}({v?.id})</option>
//                                       );
//                                     })}
//                                   </select>
                                  
//                                 </div>

//                                 <div>
//                                   <label className="block text-xs dark:text-white text-gray-600 mb-1">
//                                     Pincode
//                                   </label>
//                                   <input
//                                     type="text"
//                                     value={advanceFilters.pincode}
//                                     onChange={(e) =>
//                                       setAdvanceFilters((prev) => ({
//                                         ...prev,
//                                         pincode: e.target.value,
//                                       }))
//                                     }
//                                     placeholder="Enter Pincode"
//                                     className="w-full border dark:border-gray-700 dark:bg-gray-800 
//                           dark:text-white px-3 py-2 rounded-sm text-sm 
//                              focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                   />
//                                 </div>
//                               </div>

//                               <div className=" mt-2">
//                                 <label className="block text-xs dark:text-white text-gray-600 mb-1">
//                                   Rider ID
//                                 </label>
//                                 <input
//                                   type="number"
//                                   value={advanceFilters.rider_id}
//                                   onChange={(e) =>
//                                     setAdvanceFilters((prev) => ({
//                                       ...prev,
//                                       rider_id: e.target.value,
//                                     }))
//                                   }
//                                   placeholder="Integer Only"
//                                   className="w-full border dark:border-gray-700 dark:bg-gray-800 
//       dark:text-white px-3 py-2 rounded-sm text-sm 
//       focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 />
//                               </div>
//                             </div>

//                             <div className=" w-full flex">
//                               <button
//                                 type="submit"
//                                 onClick={applyFilters}
//                                 className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
//                               >
//                                 Filter
//                               </button>
//                               <button
//                                 type="button"
//                                 onClick={resetFilters}
//                                 className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
//                               >
//                                 Reset
//                               </button>
//                             </div>
//                           </form>
//                         </div>
//                         <DrawerFooter>
//                           <Button
//                             onClick={() => setIsDesktopFilterDrawerOpen(false)}
//                             variant="outline"
//                           >
//                             Cancel
//                           </Button>
//                         </DrawerFooter>
//                       </DrawerContent>
//                     </Drawer>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Table */}
//             <div className="flex h-[calc(105dvh-190px)] min-h-[350px] w-full flex-col mt-5 overflow-hidden rounded-sm border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
//               <div className="w-full   dark:bg-neutral-800   left-0  z-40   ">
//                 <div className="relative flex justify-self-start ">
//                   <div className=" flex  overflow-x-auto  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//                     <div className="flex gap-1 min-w-max  pl-2">
//                       {status.map((st) => (
//                         <Button
//                           key={st}
//                           onClick={() => {
//                             setSelectedBulkOrders([]);
//                             setSelectedStatus(st);
//                             setPage(1);
//                             clearAllState();
//                           }}
//                           className={`px-2 py-2.5 rounded-sm my-2 border transition-all duration-300 font-medium text-sm tracking-wide ${
//                             selectedStatus === st
//                               ? "bg-[#0446DB] text-white "
//                               : "bg-white hover:bg-[#0446DB] hover:text-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]"
//                           }`}
//                         >
//                           {st === "rto in transit"
//                             ? "RTO In Transit"
//                             : st === "rto delivered"
//                               ? "RTO Delivered"
//                               : toCapitalizeEachWord(st)}
//                           {selectedStatus === st && ` (${totalOrders})`}
//                         </Button>
//                       ))}

//                       <DropdownMenu>
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
//                       </DropdownMenu>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex gap-2 min-w-max ">
//                   {selectedBulkOrders.length > 0 &&
//                     selectedStatus === "booked" && (
//                       <>
//                         <AlertDialog>
//                           <AlertDialogTrigger>
//                             <CustomButton
//                               variant="primary"
//                               size="sm"
//                               className="rounded-sm  mb-2 "
//                             >
//                               Action
//                             </CustomButton>
//                           </AlertDialogTrigger>

//                           {/* =========================
//                                                 DIALOG
//                                             ========================= */}
//                           <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-lg border border-gray-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
//                             {/* =========================
//                                                   HEADER
//                                               ========================= */}
//                             <AlertDialogHeader className="border-b border-gray-200 px-6 py-5 dark:border-neutral-800">
//                               <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
//                                 Bulk Order Actions
//                               </AlertDialogTitle>

//                               <AlertDialogDescription className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
//                                 Manage status and vendor assignment for{" "}
//                                 <span className="font-semibold text-[#0446DB]">
//                                   {selectedBulkOrders?.length || 0}
//                                 </span>{" "}
//                                 selected orders.
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>

//                             {/* =========================
//                                                   BODY
//                                               ========================= */}
//                             <div className="max-h-[65vh] space-y-5 overflow-y-auto px-6 py-5">
//                               {/* ============================================
//                                                     CHANGE ORDER STATUS
//                                                 ============================================ */}
//                               <div className="rounded-md border border-gray-200 dark:border-neutral-800">
//                                 {/* SECTION HEADER */}
//                                 <div className="border-b border-gray-100 bg-gray-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/50">
//                                   <h3 className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
//                                     Change Order Status
//                                   </h3>

//                                   <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
//                                     Update the status of all selected orders.
//                                   </p>
//                                 </div>

//                                 <div className="p-4">
//                                   {!canceledBulkOrder ? (
//                                     <button
//                                       type="button"
//                                       onClick={() => {
//                                         setcanceledBulkOrder(true);
//                                       }}
//                                       className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-[#0446DB] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0339b5]"
//                                     >
//                                       Change Action
//                                     </button>
//                                   ) : (
//                                     <form
//                                       className="flex w-full flex-col gap-3 lg:flex-row lg:items-start"
//                                       onSubmit={async (e) => {
//                                         e.preventDefault();

//                                         const status =
//                                           e.currentTarget.elements.status.value;
//                                         const selectedRemark =
//                                           e.currentTarget.elements.remark
//                                             ?.value || "";

//                                         if (!status) {
//                                           toast.error("Please select status");
//                                           return;
//                                         }

//                                         if (
//                                           status === "cancelled" &&
//                                           !selectedRemark
//                                         ) {
//                                           toast.error("Please select remark");
//                                           return;
//                                         }

//                                         for (const order of selectedBulkOrders) {
//                                           await changeStatus({
//                                             id: order.id,
//                                             newStatus: status,
//                                             remark: selectedRemark,
//                                           });
//                                         }

//                                         // Reset
//                                         clearAllState();
//                                       }}
//                                     >
//                                       {/* STATUS */}
//                                       <select
//                                         name="status"
//                                         defaultValue=""
//                                         onChange={(e) => {
//                                           if (e.target.value === "cancelled") {
//                                             setNewStatus(e.target.value);
//                                           } else {
//                                             setNewStatus("");
//                                           }
//                                         }}
//                                         className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none lg:flex-1 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
//                                       >
//                                         <option value="">Select Status</option>

//                                         <option value="cancelled">
//                                           Cancel Orders
//                                         </option>
//                                       </select>

//                                       {/* REMARK */}
//                                       {newStatus === "cancelled" && (
//                                         <select
//                                           name="remark"
//                                           defaultValue=""
//                                           onChange={(e) => {
//                                             setRemark(e.target.value);
//                                           }}
//                                           className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none lg:flex-1 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
//                                         >
//                                           <option value="">
//                                             Select Remark
//                                           </option>

//                                           <option value="Seller Requested Future Pick up">
//                                             Seller Requested Future Pick up
//                                           </option>

//                                           <option value="Awb rejected">
//                                             AWB Rejected
//                                           </option>

//                                           <option value="Duplicate Pickup Request">
//                                             Duplicate Pickup Request
//                                           </option>

//                                           <option value="Non Serviceable Location">
//                                             Non Serviceable Location
//                                           </option>

//                                           <option value="Pick Failed Due to Dangerous Goods">
//                                             Pick Failed Due to Dangerous Goods
//                                           </option>

//                                           <option value="Product packaging Issue">
//                                             Product Packaging Issue
//                                           </option>

//                                           <option value="Shipment Handedover to other courier">
//                                             Shipment Handedover to Other Courier
//                                           </option>

//                                           <option value="Seller Closed">
//                                             Seller Closed
//                                           </option>

//                                           <option value="Pick up Request Expired">
//                                             Pick up Request Expired
//                                           </option>

//                                           <option value="Entry not Permitted">
//                                             Entry not Permitted
//                                           </option>

//                                           <option value="Customer wants refund/replacement first">
//                                             Customer wants refund/replacement
//                                             first
//                                           </option>
//                                         </select>
//                                       )}

//                                       <button
//                                         type="submit"
//                                         className="h-10 w-full shrink-0 cursor-pointer rounded-md bg-[#0446DB] px-5 text-sm font-medium text-white hover:bg-[#0339b5] lg:w-auto"
//                                       >
//                                         Apply Action
//                                       </button>
//                                     </form>
//                                   )}
//                                 </div>
//                               </div>

//                               {/* map dc  */}

//                               {false && (
//                                 <div className="overflow-hidden rounded-sm border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
//                                   <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-800/40">
//                                     <div>
//                                       <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
//                                         Assign Orders to DC
//                                       </h3>

//                                       <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
//                                         Assign all selected orders to a
//                                         distribution center.
//                                       </p>
//                                     </div>

//                                     <div className="hidden rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 sm:block dark:bg-blue-500/10 dark:text-blue-400">
//                                       Bulk Action
//                                     </div>
//                                   </div>

//                                   <div className="p-5">
//                                     {!dcBulkOrder ? (
//                                       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                                         <div>
//                                           <p className="text-sm font-medium text-gray-700 dark:text-neutral-200">
//                                             Select a distribution center
//                                           </p>

//                                           <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
//                                             Choose a DC to map the selected
//                                             orders.
//                                           </p>
//                                         </div>

//                                         <button
//                                           type="button"
//                                           onClick={() => setDcBulkOrder(true)}
//                                           className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0446DB] px-5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0339b5] hover:shadow-md active:scale-[0.98]"
//                                         >
//                                           Assign to DC
//                                         </button>
//                                       </div>
//                                     ) : (
//                                       <form
//                                         className="space-y-4"
//                                         onSubmit={async (e) => {
//                                           e.preventDefault();

//                                           const dcId = Number(
//                                             e.currentTarget.elements.dc_id
//                                               .value,
//                                           );

//                                           if (!dcId) {
//                                             toast.error("Please select a DC");
//                                             return;
//                                           }

//                                           const orderIds =
//                                             selectedBulkOrders.map(
//                                               (order) => order.id,
//                                             );

//                                           await assignOrdersToDc({
//                                             order_ids: orderIds,
//                                             dc_id: dcId,
//                                           });
//                                         }}
//                                       >
//                                         <div>
//                                           <label
//                                             htmlFor="dc_id"
//                                             className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-neutral-300"
//                                           >
//                                             Distribution Center
//                                           </label>

//                                           <div className="relative">
//                                             <select
//                                               id="dc_id"
//                                               name="dc_id"
//                                               defaultValue=""
//                                               className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-10 text-sm text-gray-700 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:focus:border-blue-500"
//                                             >
//                                               <option value="" disabled>
//                                                 Select a distribution center
//                                               </option>

//                                               {dcList?.map((dc) => (
//                                                 <option
//                                                   key={dc.id}
//                                                   value={dc.id}
//                                                 >
//                                                   {dc?.dc_code} : {dc?.dc_name}
//                                                 </option>
//                                               ))}
//                                             </select>

//                                             <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
//                                               <svg
//                                                 className="h-4 w-4 text-gray-400"
//                                                 viewBox="0 0 20 20"
//                                                 fill="currentColor"
//                                               >
//                                                 <path
//                                                   fillRule="evenodd"
//                                                   d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
//                                                   clipRule="evenodd"
//                                                 />
//                                               </svg>
//                                             </div>
//                                           </div>
//                                         </div>

//                                         <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end dark:border-neutral-800">
//                                           <button
//                                             type="button"
//                                             onClick={() =>
//                                               setDcBulkOrder(false)
//                                             }
//                                             className="h-10 cursor-pointer rounded-sm border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
//                                           >
//                                             Cancel
//                                           </button>

//                                           <button
//                                             type="submit"
//                                             className="h-10 cursor-pointer rounded-sm bg-[#0446DB] px-6 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0339b5] hover:shadow-md active:scale-[0.98]"
//                                           >
//                                             Assign Orders
//                                           </button>
//                                         </div>
//                                       </form>
//                                     )}
//                                   </div>
//                                 </div>
//                               )}

//                               {/* ============================================
//                                                     VENDOR ASSIGNMENT
//                                                 ============================================ */}
//                               {/* ================= VENDOR ASSIGNMENT ================= */}
//                               <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
//                                 {/* Header */}
//                                 <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
//                                   <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                     Vendor Assignment
//                                   </h3>

//                                   <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                     Find an available vendor and assign the
//                                     selected orders.
//                                   </p>
//                                 </div>

//                                 <div className="p-4">
//                                   {!fetchBulkAssignmentVendor ? (
//                                     /* ================= GET AVAILABLE VENDOR ================= */
//                                     <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                                       <div>
//                                         <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                           Available Vendors
//                                         </p>

//                                         <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                           Get eligible vendors for{" "}
//                                           <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                             {selectedBulkOrders?.length || 0}
//                                           </span>{" "}
//                                           selected orders.
//                                         </p>
//                                       </div>

//                                       <button
//                                         type="button"
//                                         onClick={() => {
//                                           setFetchBulkAssignmentVendor(true);

//                                           const order_ids = [
//                                             ...new Set(
//                                               selectedBulkOrders.map(
//                                                 (order) => order.id,
//                                               ),
//                                             ),
//                                           ];

//                                           fetchVendor(order_ids);
//                                         }}
//                                         className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white transition hover:bg-indigo-800"
//                                       >
//                                         Get Available Vendor
//                                       </button>
//                                     </div>
//                                   ) : vendor?.length > 0 ? (
//                                     /* ================= VENDOR FOUND ================= */
//                                     <div className="space-y-4">
//                                       <div>
//                                         <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                                           Select Vendor
//                                         </label>

//                                         <select
//                                           value={assignmentState}
//                                           onChange={(e) =>
//                                             setAssignmentState(e.target.value)
//                                           }
//                                           className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
//                                         >
//                                           <option value="">
//                                             Select Vendor for Bulk Assignment
//                                           </option>

//                                           {vendor?.map((vendorItem) => (
//                                             <option
//                                               key={vendorItem?.vendor_id}
//                                               value={vendorItem?.vendor_id}
//                                             >
//                                               {vendorItem?.vendor_id} :{" "}
//                                               {vendorItem?.vendor_name}
//                                             </option>
//                                           ))}
//                                         </select>
//                                       </div>

//                                       {/* Selected Orders Info */}
//                                       <div className="flex items-center justify-between rounded-sm border border-blue-100 bg-blue-50/50 px-3 py-2.5 dark:border-blue-500/20 dark:bg-blue-500/5">
//                                         <div>
//                                           <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                                             Selected Orders
//                                           </p>

//                                           <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
//                                             Selected vendor will be assigned to
//                                             all orders.
//                                           </p>
//                                         </div>

//                                         <span className="rounded-full bg-[#0446DB]/10 px-2.5 py-1 text-xs font-semibold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
//                                           {selectedBulkOrders?.length || 0}
//                                         </span>
//                                       </div>

//                                       {/* Action */}
//                                       <div className="flex justify-end border-t border-neutral-100 pt-4 dark:border-neutral-800">
//                                         <button
//                                           type="button"
//                                           disabled={!assignmentState}
//                                           onClick={async () => {
//                                             if (!assignmentState) {
//                                               toast.warn(
//                                                 "Please select a vendor",
//                                               );
//                                               return;
//                                             }

//                                             const order_ids =
//                                               selectedBulkOrders.map(
//                                                 (order) => order.id,
//                                               );

//                                             await assignBulkOrderVendor(
//                                               order_ids,
//                                               assignmentState,
//                                             );

//                                             setSelectedBulkOrders([]);
//                                             setBulkOrderWeight(0);
//                                             setFetchBulkAssignmentVendor(false);
//                                           }}
//                                           className="h-9 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500"
//                                         >
//                                           Bulk Assign
//                                         </button>
//                                       </div>
//                                     </div>
//                                   ) : (
//                                     /* ================= NO VENDOR ================= */
//                                     <div className="rounded-sm border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
//                                       <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
//                                         No Vendor Available
//                                       </p>

//                                       <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
//                                         No eligible vendor was found for the
//                                         selected orders.
//                                       </p>

//                                       <button
//                                         type="button"
//                                         onClick={() => {
//                                           setFetchBulkAssignmentVendor(false);
//                                           setAssignmentState("");
//                                           setVendor([]);
//                                         }}
//                                         className="mt-3 h-8 cursor-pointer rounded-sm border border-amber-300 bg-white px-3 text-xs font-medium text-amber-700 transition hover:bg-amber-100 dark:border-amber-500/30 dark:bg-neutral-900 dark:text-amber-400"
//                                       >
//                                         Try Again
//                                       </button>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>

//                               {/* ================= GENERATE BULK PICKUP REQUEST ================= */}
//                               <div className="overflow-hidden rounded-sm border border-emerald-200 dark:border-emerald-500/20">
//                                 {/* Header */}
//                                 <div className="border-b border-emerald-100 bg-emerald-50/70 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/5">
//                                   <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                     Schedule Self Pickup
//                                   </h3>

//                                   <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                     Schedule self-assignment for all selected
//                                     orders.
//                                   </p>
//                                 </div>

//                                 {/* Content */}
//                                 <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
//                                   {/* Info */}
//                                   <div>
//                                     <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                       Schedule Self Pickup for Selected Orders
//                                     </p>

//                                     <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                       <span className="font-semibold text-emerald-600 dark:text-emerald-400">
//                                         {selectedBulkOrders?.length || 0}
//                                       </span>{" "}
//                                       selected orders will be included in the
//                                       self-pickup schedule.
//                                     </p>
//                                   </div>

//                                   {/* Button */}
//                                   <button
//                                     type="submit"
//                                     disabled={!selectedBulkOrders?.length}
//                                     onClick={async () => {
//                                       if (!selectedBulkOrders?.length) {
//                                         toast.warn(
//                                           "Please select at least one order",
//                                         );
//                                         return;
//                                       }

//                                       const order_ids = [
//                                         ...new Set(
//                                           selectedBulkOrders.map(
//                                             (order) => order.id,
//                                           ),
//                                         ),
//                                       ];

//                                       await generateBulkPickupRequest(
//                                         order_ids,
//                                       );

//                                       clearAllState();
//                                     }}
//                                     className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-emerald-600 px-5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
//                                   >
//                                     Schedule Self Pickup
//                                   </button>
//                                 </div>
//                               </div>

//                               {/* ============================================
//                                                     CLEAR SELECTED ORDERS
//                                                 ============================================ */}
//                               <div className="rounded-md border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5">
//                                 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                                   <div>
//                                     <h3 className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
//                                       Clear Selection
//                                     </h3>

//                                     <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
//                                       Remove all currently selected orders.
//                                     </p>
//                                   </div>

//                                   <button
//                                     type="button"
//                                     onClick={() => {
//                                       setSelectedBulkOrders([]);
//                                       setBulkOrderWeight(0);

//                                       setFetchBulkAssignmentRider(false);
//                                       setFetchBulkAssignmentVendor(false);

//                                       setcanceledBulkOrder(false);

//                                       clearAllState();
//                                     }}
//                                     className="h-10 shrink-0 cursor-pointer rounded-md border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
//                                   >
//                                     Clear Selected Orders
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>

//                             {/* =========================
//                                                   FOOTER
//                                               ========================= */}
//                             <AlertDialogFooter className="border-t border-gray-200 bg-gray-50 px-6 mb-1 mr-1  dark:border-neutral-800 dark:bg-neutral-950/30">
//                               <AlertDialogCancel
//                                 onClick={() => {
//                                   clearAll();
//                                   clearAllState();
//                                 }}
//                                 className="cursor-pointer"
//                               >
//                                 Close
//                               </AlertDialogCancel>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </>
//                     )}

//                   {selectedBulkOrders.length > 0 &&
//                     (selectedStatus === "picked" ||
//                       selectedStatus === "undelivered") && (
//                       <>
//                         <AlertDialog>
//                           {/* =====================================================
//           OPEN BULK ACTION DIALOG
//       ===================================================== */}
//                           <AlertDialogTrigger>
//                             <CustomButton
//                               variant="primary"
//                               size="sm"
//                               className="rounded-sm  mb-2 "
//                             >
//                               Action
//                             </CustomButton>
//                           </AlertDialogTrigger>

//                           <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
//                             {/* =====================================================
//             HEADER
//         ===================================================== */}
//                             <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
//                               <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
//                                 Bulk Order Actions
//                               </AlertDialogTitle>

//                               <AlertDialogDescription className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
//                                 Manage{" "}
//                                 <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                   {selectedBulkOrders?.length || 0}
//                                 </span>{" "}
//                                 selected orders.
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>

//                             {/* =====================================================
//             BODY
//         ===================================================== */}
//                             <div className="max-h-[65vh] overflow-y-auto px-5 py-5">
//                               <div className="space-y-4">
//                                 {/* =================================================
//                 MAPPED ORDERS
//             ================================================= */}
//                                 {selectedMapType === "mapped" && (
//                                   <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
//                                     {/* HEADER */}
//                                     <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
//                                       <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                         Change Order Action
//                                       </h3>

//                                       <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                         Apply an action to the selected mapped
//                                         orders.
//                                       </p>
//                                     </div>

//                                     {/* CONTENT */}
//                                     <div className="p-4">
//                                       {selectedBulkOrders.length > 0 ? (
//                                         <form
//                                           className="flex flex-col gap-3 sm:flex-row sm:items-center"
//                                           onSubmit={async (e) => {
//                                             e.preventDefault();

//                                             await Promise.all(
//                                               selectedBulkOrders.map((order) =>
//                                                 cancelVendorAssignment(
//                                                   order.id,
//                                                 ),
//                                               ),
//                                             );

//                                             setSelectedBulkOrders([]);
//                                             setSelectedMapType(null);
//                                           }}
//                                         >
//                                           <select
//                                             className="h-10 min-w-0 flex-1 rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
//                                             name="status"
//                                           >
//                                             <option value="">
//                                               Select Status
//                                             </option>

//                                             <option value="Cancel Vendor Mapped">
//                                               Cancel Vendor Mapping
//                                             </option>
//                                           </select>

//                                           <button
//                                             type="submit"
//                                             className="h-10 shrink-0 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5]"
//                                           >
//                                             Apply Action
//                                           </button>
//                                         </form>
//                                       ) : (
//                                         <button
//                                           onClick={() => {
//                                             setcanceledBulkOrder(true);
//                                           }}
//                                           className="h-10 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5]"
//                                         >
//                                           Change Action
//                                         </button>
//                                       )}
//                                     </div>
//                                   </div>
//                                 )}

//                                 {/* =================================================
//                 UNMAPPED ORDERS - VENDOR ASSIGNMENT
//             ================================================= */}
//                                 {selectedMapType === "unmapped" && (
//                                   <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
//                                     {/* HEADER */}
//                                     <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
//                                       <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                         Vendor Assignment
//                                       </h3>

//                                       <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                         Find an available vendor and assign the
//                                         selected orders.
//                                       </p>
//                                     </div>

//                                     {/* CONTENT */}
//                                     <div className="p-4">
//                                       {selectedBulkOrders.length > 0 &&
//                                       !fetchBulkAssignmentVendor ? (
//                                         <button
//                                           onClick={() => {
//                                             setFetchBulkAssignmentVendor(true);

//                                             const order_ids = [
//                                               ...new Set(
//                                                 selectedBulkOrders.map(
//                                                   (o) => o.id,
//                                                 ),
//                                               ),
//                                             ];

//                                             fetchVendor(order_ids);
//                                           }}
//                                           className="h-10 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5]"
//                                         >
//                                           Get Available Vendor
//                                         </button>
//                                       ) : (
//                                         <>
//                                           {vendor?.length > 0 && (
//                                             <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
//                                               <select
//                                                 className="h-10 min-w-0 flex-1 rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
//                                                 value={assignmentState}
//                                                 onChange={(e) =>
//                                                   setAssignmentState(
//                                                     e.target.value,
//                                                   )
//                                                 }
//                                               >
//                                                 <option value="">
//                                                   Select Vendor for Bulk
//                                                   Assignment
//                                                 </option>

//                                                 {vendor.map((vendorItem) => (
//                                                   <option
//                                                     key={vendorItem.vendor_id}
//                                                     value={vendorItem.vendor_id}
//                                                   >
//                                                     {vendorItem.vendor_id} :{" "}
//                                                     {vendorItem.vendor_name}
//                                                   </option>
//                                                 ))}
//                                               </select>

//                                               {assignmentState && (
//                                                 <button
//                                                   onClick={async () => {
//                                                     if (!assignmentState) {
//                                                       toast.warn(
//                                                         "Please select a vendor",
//                                                       );
//                                                       return;
//                                                     }

//                                                     const order_ids =
//                                                       selectedBulkOrders.map(
//                                                         (order) => order.id,
//                                                       );

//                                                     const result =
//                                                       await assignBulkOrderVendor(
//                                                         order_ids,
//                                                         assignmentState,
//                                                       );

//                                                     setSelectedBulkOrders([]);
//                                                     setBulkOrderWeight(0);
//                                                     setFetchBulkAssignmentVendor(
//                                                       false,
//                                                     );
//                                                     setSelectedMapType(null);
//                                                     setAssignmentState("");
//                                                   }}
//                                                   className="h-10 shrink-0 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5]"
//                                                 >
//                                                   Bulk Assign Orders to Vendor
//                                                 </button>
//                                               )}
//                                             </div>
//                                           )}
//                                         </>
//                                       )}
//                                     </div>
//                                   </div>
//                                 )}

//                                 {/* =================================================
//                 RIDER ASSIGNMENT
//             ================================================= */}
//                                 {((selectedStatus === "picked" &&
//                                   canMarkInTransit) ||
//                                   (selectedStatus === "undelivered" &&
//                                     canAssignUndelivered)) && (
//                                   <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
//                                     {/* HEADER */}
//                                     <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
//                                       <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                         Rider Assignment
//                                       </h3>

//                                       <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                         Find an available rider and assign the
//                                         selected orders.
//                                       </p>
//                                     </div>

//                                     {/* CONTENT */}
//                                     <div className="p-4">
//                                       {selectedBulkOrders.length > 0 &&
//                                       riders.length === 0 ? (
//                                         <button
//                                           onClick={() => {
//                                             const vendor_ids = [
//                                               ...new Set(
//                                                 selectedBulkOrders.map(
//                                                   (o) => o.mapped_with,
//                                                 ),
//                                               ),
//                                             ];

//                                             fetchRider(vendor_ids);
//                                           }}
//                                           className="h-10 w-full cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5]"
//                                         >
//                                           Get Available Rider
//                                         </button>
//                                       ) : (
//                                         <>
//                                           {riders.length > 0 && (
//                                             <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
//                                               <select
//                                                 className="h-10 min-w-0 flex-1 rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
//                                                 value={assignmentState}
//                                                 onChange={(e) =>
//                                                   setAssignmentState(
//                                                     e.target.value,
//                                                   )
//                                                 }
//                                               >
//                                                 <option value="">
//                                                   Select Rider for Bulk
//                                                   Assignment
//                                                 </option>

//                                                 {riders.map((rider) => (
//                                                   <option
//                                                     key={rider.id}
//                                                     value={rider.id}
//                                                   >
//                                                     {rider.id} : {rider.name}
//                                                   </option>
//                                                 ))}
//                                               </select>

//                                               {assignmentState && (
//                                                 <button
//                                                   onClick={async () => {
//                                                     if (!assignmentState) {
//                                                       toast.warn(
//                                                         "Please select a rider",
//                                                       );
//                                                       return;
//                                                     }

//                                                     const order_ids =
//                                                       selectedBulkOrders.map(
//                                                         (o) => o.id,
//                                                       );

//                                                     await changeOrderStatus({
//                                                       order_ids: order_ids,
//                                                       newStatus:
//                                                         selectedStatus ===
//                                                         "undelivered"
//                                                           ? "undelivered assigned"
//                                                           : "in transit",
//                                                       rider_id: assignmentState,
//                                                     });

//                                                     // for (const order of selectedBulkOrders) {
//                                                     // }

//                                                     clearAllState();
//                                                   }}
//                                                   className="h-10 shrink-0 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5]"
//                                                 >
//                                                   Bulk Assign Orders to Rider
//                                                 </button>
//                                               )}
//                                             </div>
//                                           )}
//                                         </>
//                                       )}
//                                     </div>
//                                   </div>
//                                 )}


//                                 {
//                                   console.log(selectedBulkOrders[0],)
//                                 }


//                                 {allSelectedUndelivered && (
//   <div className="space-y-3 rounded-sm border border-gray-200 p-4 dark:border-neutral-700">
//     <div>
//       <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
//         Vendor Mapping
//       </h3>

//       <p className="mt-1 text-xs text-gray-500">
//         Manage vendor mapping for {undeliveredOrders.length} selected
//         undelivered orders.
//       </p>
//     </div>

//     {!bulkMappingOpen ? (
//       <button
//         type="button"
//         disabled={bulkMappingLoading}
//         onClick={async()=>{
//           handleOpenBulkVendorMapping()
//          await checkVendorMappingStatus(selectedBulkOrders[0].id);
//          await fetchVendor(selectedBulkOrders[0].id);
//         }}
//         className="w-full rounded-sm bg-[#0446DB] px-3 py-2 text-sm font-medium text-white hover:bg-[#0339b5] disabled:opacity-50"
//       >
//         Manage Vendor Mapping
//       </button>
//     ) : (
//       <div className="space-y-3">
//         {
//           checkVendorMapping?.canChangeMapping && (

//         <form
//           onSubmit={handleBulkChangeVendorMapping}
//           className="space-y-3"
//         >
//           <select
//             value={assignmentState}
//             onChange={(e) => setAssignmentState(e.target.value)}
//             required
//             disabled={bulkMappingLoading}
//             className="h-10 w-full rounded-sm border border-gray-300 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
//           >
//             <option value="" disabled>
//               Select Vendor
//             </option>

//             {vendor.map((item) => (
//               <option
//                 key={item.vendor_id}
//                 value={item.vendor_id}
//               >
//                 {item.vendor_id} : {item.vendor_name}
//               </option>
//             ))}
//           </select>

//           <button
//             type="submit"
//             disabled={bulkMappingLoading || !assignmentState}
//             className="w-full rounded-sm bg-[#0446DB] px-3 py-2 text-sm font-medium text-white hover:bg-[#0339b5] disabled:opacity-50"
//           >
//             Assign New Vendor
//           </button>
//         </form>
//           )
//         }

        

//         {
//           !checkVendorMapping?.canChangeMapping && (

//         <button
//           type="button"
//           disabled={bulkMappingLoading}
//           onClick={handleBulkRevokeVendorMapping}
//           className="w-full rounded-sm bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
//         >
//           Revoke Vendor Mapping
//         </button>
//           )
//         }


//         <button
//           type="button"
//           disabled={bulkMappingLoading}
//           onClick={() => {
//             setBulkMappingOpen(false);
//             setAssignmentState("");
//             setCheckVendorMapping(null);
//           }}
//           className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm dark:border-neutral-700"
//         >
//           Close
//         </button>
//       </div>
//     )}
//   </div>
//                                  )}

//                                 {/* =================================================
//                 CLEAR SELECTED ORDERS
//             ================================================= */}
//                                 <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
//                                   <div className="min-w-0">
//                                     <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                       Clear Selection
//                                     </p>

//                                     <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                       Remove all currently selected orders and
//                                       reset bulk actions.
//                                     </p>
//                                   </div>

//                                   <button
//                                     className="h-10 shrink-0 cursor-pointer rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
//                                     onClick={() => {
//                                       setSelectedBulkOrders([]);
//                                       setBulkOrderWeight(0);
//                                       setFetchBulkAssignmentRider(false);
//                                       setFetchBulkAssignmentVendor(false);
//                                       setcanceledBulkOrder(false);
//                                       setSelectedMapType(null);
//                                       clearAllState();
//                                     }}
//                                   >
//                                     Clear Selected Orders
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>

//                             {/* =====================================================
//             FOOTER
//         ===================================================== */}
//                             <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 mb-1 mr-1  dark:border-neutral-800 dark:bg-neutral-950/30">
//                               <AlertDialogCancel
//                                 onClick={() => {
//                                   clearAll();
//                                   clearAllState();
//                                 }}
//                                 className="cursor-pointer rounded-sm"
//                               >
//                                 Close
//                               </AlertDialogCancel>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </>
//                     )}

//                   {selectedBulkOrders.length > 0 &&
//                     (selectedStatus === "in transit" ||
//                       selectedStatus == "undelivered assigned") && (
//                       <>
//                         <AlertDialog>
//                           {/* =====================================================
//           OPEN DIALOG BUTTON
//       ===================================================== */}
//                           <AlertDialogTrigger>
//                             <CustomButton
//                               variant="primary"
//                               size="sm"
//                               className="rounded-sm  mb-2 "
//                             >
//                               Action
//                             </CustomButton>
//                           </AlertDialogTrigger>

//                           {/* =====================================================
//           DIALOG
//       ===================================================== */}
//                           <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
//                             {/* ===================================================
//             HEADER
//         =================================================== */}
//                             <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
//                               <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
//                                 Bulk Order Actions
//                               </AlertDialogTitle>

//                               <AlertDialogDescription className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
//                                 Manage{" "}
//                                 <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                   {selectedBulkOrders?.length || 0}
//                                 </span>{" "}
//                                 selected orders.
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>

//                             {/* ===================================================
//             BODY
//         =================================================== */}
//                             <div className="max-h-[65vh] overflow-y-auto px-5 py-5">
//                               <div className="space-y-4">
//                                 {/* ===============================================
//                 ORDER ACTION
//             =============================================== */}

//                                 {(selectedStatus === "in transit" ||
//                                   selectedStatus == "undelivered assigned") && (
//                                   <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
//                                     {/* SECTION HEADER */}
//                                     <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
//                                       <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                         Change Order Action
//                                       </h3>

//                                       <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                         Select an action to apply to all
//                                         selected orders.
//                                       </p>
//                                     </div>

//                                     {/* CONTENT */}
//                                     <div className="p-4">
//                                       {selectedBulkOrders.length > 0 &&
//                                       openOfd.length == 0 ? (
//                                         /* =========================================
//                           CHANGE ACTION
//                       ========================================= */
//                                         <button
//                                           onClick={() => {
//                                             const order_ids = [
//                                               ...new Set(
//                                                 selectedBulkOrders.map(
//                                                   (o) => o.id,
//                                                 ),
//                                               ),
//                                             ];

//                                             setopenOfd(order_ids);
//                                           }}
//                                           className="h-10 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5]"
//                                         >
//                                           Change Action
//                                         </button>
//                                       ) : (
//                                         <>
//                                           {openOfd.length > 0 && (
//                                             <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
//                                               {/* ===============================
//                               STATUS SELECT
//                           =============================== */}

//                                               <select
//                                                 className="h-10 min-w-0 flex-1 rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
//                                                 value={assignmentState}
//                                                 onChange={(e) =>
//                                                   setAssignmentState(
//                                                     e.target.value,
//                                                   )
//                                                 }
//                                               >
//                                                 <option value="">
//                                                   Select Status
//                                                 </option>

//                                                 <option
//                                                   value={"out for delivery"}
//                                                 >
//                                                   Mark Out For Delivery
//                                                 </option>

//                                                 {selectedStatus ==
//                                                   "undelivered assigned" ||
//                                                   (selectedStatus ==
//                                                     "in transit" && (
//                                                     <option
//                                                       value={
//                                                         "cancel rider assignment"
//                                                       }
//                                                     >
//                                                       Cancel Rider Assignment
//                                                     </option>
//                                                   ))}

//                                                 <option value="lost">
//                                                   Lost
//                                                 </option>
//                                               </select>

//                                               {/* ===============================
//                               APPLY ACTION
//                           =============================== */}

//                                               {assignmentState && (
//                                                 <button
//                                                   onClick={async () => {
//                                                     if (!assignmentState) {
//                                                       toast.warn(
//                                                         "Please select a status",
//                                                       );
//                                                       return;
//                                                     }

//                                                     const order_ids =
//                                                       selectedBulkOrders.map(
//                                                         (o) => o.id,
//                                                       );

//                                                     if (
//                                                       assignmentState ===
//                                                       "cancel rider assignment"
//                                                     ) {
//                                                       await cancelRiderAssignments(
//                                                         order_ids,
//                                                       );
//                                                     } else {
//                                                       // for (const order of selectedBulkOrders) {
//                                                       // }

//                                                       await changeOrderStatus({
//                                                         order_ids: order_ids,
//                                                         newStatus:
//                                                           assignmentState,
//                                                         rider_id: "",
//                                                       });
//                                                     }

//                                                     clearAllState();
//                                                   }}
//                                                   className="h-10 shrink-0 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5]"
//                                                 >
//                                                   {assignmentState == ""
//                                                     ? "Select Status"
//                                                     : assignmentState ===
//                                                         "cancel rider assignment"
//                                                       ? "Cancel Rider Assignment"
//                                                       : "Mark Bulk Orders as Out for Delivery"}
//                                                 </button>
//                                               )}
//                                             </div>
//                                           )}
//                                         </>
//                                       )}
//                                     </div>
//                                   </div>
//                                 )}

//                                 {/* ===============================================
//                 CLEAR SELECTED ORDERS
//             =============================================== */}

//                                 <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
//                                   <div className="min-w-0">
//                                     <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                       Clear Selection
//                                     </p>

//                                     <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                       Remove all currently selected orders and
//                                       reset bulk actions.
//                                     </p>
//                                   </div>

//                                   <button
//                                     className="h-10 shrink-0 cursor-pointer rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
//                                     onClick={() => {
//                                       clearAllState();
//                                       setSelectedBulkOrders([]);
//                                       setBulkOrderWeight(0);
//                                       setFetchBulkAssignmentRider(false);
//                                       setFetchBulkAssignmentVendor(false);
//                                       setcanceledBulkOrder(false);
//                                       setSelectedMapType(null);
//                                       clearAllState();
//                                     }}
//                                   >
//                                     Clear Selected Orders
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>

//                             {/* ===================================================
//             FOOTER
//         =================================================== */}
//                             <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 mb-1 mr-1  dark:border-neutral-800 dark:bg-neutral-950/30">
//                               <AlertDialogCancel
//                                 onClick={() => {
//                                   clearAll();
//                                   clearAllState();
//                                 }}
//                                 className="cursor-pointer rounded-sm"
//                               >
//                                 Close
//                               </AlertDialogCancel>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </>
//                     )}

//                   {selectedBulkOrders.length > 0 &&
//                     selectedStatus === "out for delivery" && (
//                       <>
//                         <AlertDialog>
//                           {/* =====================================================
//           OPEN BULK ACTIONS
//       ===================================================== */}
//                           <AlertDialogTrigger>
//                             <CustomButton
//                               variant="primary"
//                               size="sm"
//                               className="rounded-sm  mb-2 "
//                             >
//                               Action
//                             </CustomButton>
//                           </AlertDialogTrigger>

//                           {/* =====================================================
//           MAIN BULK ACTION DIALOG
//       ===================================================== */}
//                           <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
//                             {/* HEADER */}
//                             <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
//                               <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
//                                 Bulk Order Actions
//                               </AlertDialogTitle>

//                               <AlertDialogDescription className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
//                                 Manage{" "}
//                                 <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                   {selectedBulkOrders?.length || 0}
//                                 </span>{" "}
//                                 selected orders.
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>

//                             {/* =====================================================
//             BODY
//         ===================================================== */}
//                             <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
//                               <div className="space-y-4">
//                                 {/* =================================================
//                 OUT FOR DELIVERY ACTIONS
//             ================================================= */}
//                                 {selectedStatus === "out for delivery" && (
//                                   <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
//                                     {/* SECTION HEADER */}
//                                     <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
//                                       <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                         Change Order Action
//                                       </h3>

//                                       <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                         Update the status of selected out for
//                                         delivery orders.
//                                       </p>
//                                     </div>

//                                     {/* CONTENT */}
//                                     <div className="p-4">
//                                       {selectedBulkOrders.length > 0 &&
//                                       openDelivered.length == 0 ? (
//                                         /* =========================================
//                         CHANGE ACTION BUTTON
//                     ========================================= */
//                                         <button
//                                           onClick={() => {
//                                             const order_ids = [
//                                               ...new Set(
//                                                 selectedBulkOrders.map(
//                                                   (o) => o.id,
//                                                 ),
//                                               ),
//                                             ];

//                                             setopenDeliverde(order_ids);
//                                           }}
//                                           className="h-10 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5]"
//                                         >
//                                           Change Action
//                                         </button>
//                                       ) : (
//                                         <>
//                                           {openDelivered.length > 0 && (
//                                             <div className="space-y-4">
//                                               {/* =====================================
//                               STATUS SELECT
//                           ===================================== */}
//                                               <div>
//                                                 <label className="mb-2 block text-xs font-medium text-neutral-600 dark:text-neutral-300">
//                                                   Select New Status
//                                                 </label>

//                                                 <select
//                                                   className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
//                                                   value={assignmentState}
//                                                   onChange={(e) =>
//                                                     setAssignmentState(
//                                                       e.target.value,
//                                                     )
//                                                   }
//                                                 >
//                                                   <option value="">
//                                                     Select Status
//                                                   </option>

//                                                   <option value={"delivered"}>
//                                                     Mark Delivered
//                                                   </option>

//                                                   <option value={"ndr"}>
//                                                     Mark NDR
//                                                   </option>

//                                                   <option value="lost">
//                                                     Mark Lost
//                                                   </option>
//                                                 </select>
//                                               </div>

//                                               {/* =====================================
//                               NDR
//                           ===================================== */}
//                                               {assignmentState == "ndr" && (
//                                                 <>
//                                                   <Dialog className="w-5xl">
//                                                     <DialogTrigger asChild>
//                                                       <Button
//                                                         variant="outline"
//                                                         className="h-10 cursor-pointer rounded-sm border border-[#0446DB] bg-[#0446DB] px-5 text-sm font-semibold text-white hover:bg-[#0339B5] hover:text-white"
//                                                       >
//                                                         <span>
//                                                           Mark Bulk Orders as
//                                                           NDR
//                                                         </span>
//                                                       </Button>
//                                                     </DialogTrigger>

//                                                     {/* ===============================
//                                     NDR DIALOG
//                                 =============================== */}
//                                                     <DialogContent className="!max-w-lg overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 dark:border-neutral-800 dark:bg-neutral-900">
//                                                       {/* NDR HEADER */}
//                                                       <DialogHeader className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
//                                                         <DialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
//                                                           NDR
//                                                         </DialogTitle>

//                                                         <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
//                                                           Add undelivered
//                                                           details for selected
//                                                           orders.
//                                                         </p>
//                                                       </DialogHeader>

//                                                       {/* NDR BODY */}
//                                                       <div className="max-h-[65vh] space-y-4 overflow-y-auto px-5 py-5">
//                                                         {/* ===========================
//                                         DELIVERY REASON
//                                     =========================== */}
//                                                         <div>
//                                                           <label
//                                                             htmlFor="delivery_reason"
//                                                             className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-200"
//                                                           >
//                                                             Undelivered Reason
//                                                           </label>

//                                                           <select
//                                                             name="delivery_reason"
//                                                             id="delivery_reason"
//                                                             onChange={(e) => {
//                                                               setRemarks(
//                                                                 e.target.value,
//                                                               );
//                                                               setRescheduleDate(
//                                                                 "",
//                                                               );
//                                                               setSub_remarks(
//                                                                 "",
//                                                               );
//                                                             }}
//                                                             className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
//                                                           >
//                                                             <option value="">
//                                                               -- Select Reason
//                                                               --
//                                                             </option>

//                                                             <option value="Address Incorrect / Incomplete">
//                                                               Address Incorrect
//                                                               / Incomplete
//                                                             </option>

//                                                             <option value="Customer Requested Reschedule">
//                                                               Customer Requested
//                                                               Reschedule
//                                                             </option>

//                                                             <option value="Customer Refused / Cancelled">
//                                                               Customer Refused /
//                                                               Cancelled
//                                                             </option>

//                                                             <option value="Delivery Attempted – Not Reachable">
//                                                               Delivery Attempted
//                                                               – Not Reachable
//                                                             </option>

//                                                             <option value="Delivery Attempted – No Response">
//                                                               Delivery Attempted
//                                                               – No Response
//                                                             </option>

//                                                             <option value="Wrong Pincode / Address">
//                                                               Wrong Pincode /
//                                                               Address
//                                                             </option>

//                                                             <option value="Wrong Contact Details">
//                                                               Wrong Contact
//                                                               Details
//                                                             </option>

//                                                             <option value="Vehicle / Weather / Road Issue">
//                                                               Vehicle / Weather
//                                                               / Road Issue
//                                                             </option>

//                                                             <option value="Package Damaged">
//                                                               Package Damaged
//                                                             </option>
//                                                           </select>
//                                                         </div>

//                                                         {/* ===========================
//                                         RESCHEDULE DATE
//                                     =========================== */}
//                                                         {remarks ==
//                                                           "Customer Requested Reschedule" && (
//                                                           <>
//                                                             <div>
//                                                               <label
//                                                                 htmlFor=""
//                                                                 className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-200"
//                                                               >
//                                                                 Reschedule Date
//                                                               </label>

//                                                               <input
//                                                                 type="date"
//                                                                 value={
//                                                                   rescheduleDate
//                                                                 }
//                                                                 onClick={(e) =>
//                                                                   e.target.showPicker?.()
//                                                                 }
//                                                                 onChange={(e) =>
//                                                                   setRescheduleDate(
//                                                                     e.target
//                                                                       .value,
//                                                                   )
//                                                                 }
//                                                                 className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
//                                                               />
//                                                             </div>
//                                                           </>
//                                                         )}

//                                                         {/* ===========================
//                                         RESCHEDULE SUB REMARK
//                                     =========================== */}
//                                                         {remarks ==
//                                                           "Customer Requested Reschedule" && (
//                                                           <>
//                                                             <div>
//                                                               <label
//                                                                 htmlFor=""
//                                                                 className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-200"
//                                                               >
//                                                                 Sub Remark
//                                                               </label>

//                                                               <select
//                                                                 onChange={(
//                                                                   e,
//                                                                 ) => {
//                                                                   setSub_remarks(
//                                                                     e.target
//                                                                       .value,
//                                                                   );
//                                                                 }}
//                                                                 className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
//                                                               >
//                                                                 <option value="">
//                                                                   -- Select
//                                                                   Reason --
//                                                                 </option>

//                                                                 <option value="Unavailable at Location">
//                                                                   Unavailable at
//                                                                   Location
//                                                                 </option>

//                                                                 <option value="Out of Station">
//                                                                   Out of Station
//                                                                 </option>

//                                                                 <option value="COD Amount Not Ready">
//                                                                   COD Amount Not
//                                                                   Ready
//                                                                 </option>

//                                                                 <option value="Require Different Time Slot">
//                                                                   Require
//                                                                   Different Time
//                                                                   Slot
//                                                                 </option>

//                                                                 <option value="Other">
//                                                                   Other
//                                                                 </option>
//                                                               </select>
//                                                             </div>
//                                                           </>
//                                                         )}

//                                                         {/* ===========================
//                                         CUSTOMER REFUSED SUB REMARK
//                                     =========================== */}
//                                                         {remarks ==
//                                                           "Customer Refused / Cancelled" && (
//                                                           <>
//                                                             <div>
//                                                               <label
//                                                                 htmlFor=""
//                                                                 className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-200"
//                                                               >
//                                                                 Sub Remark
//                                                               </label>

//                                                               <select
//                                                                 onChange={(
//                                                                   e,
//                                                                 ) => {
//                                                                   setSub_remarks(
//                                                                     e.target
//                                                                       .value,
//                                                                   );
//                                                                 }}
//                                                                 className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
//                                                               >
//                                                                 <option value="">
//                                                                   -- Select
//                                                                   Reason --
//                                                                 </option>

//                                                                 <option value="Duplicate Order">
//                                                                   Duplicate
//                                                                   Order
//                                                                 </option>

//                                                                 <option value="Order Placed by Mistake">
//                                                                   Order Placed
//                                                                   by Mistake
//                                                                 </option>

//                                                                 <option value="COD Amount Not Ready">
//                                                                   COD Amount Not
//                                                                   Ready
//                                                                 </option>

//                                                                 <option value="Better Price Elsewhere">
//                                                                   Better Price
//                                                                   Elsewhere
//                                                                 </option>

//                                                                 <option value="Other">
//                                                                   Other
//                                                                 </option>
//                                                               </select>
//                                                             </div>
//                                                           </>
//                                                         )}

//                                                         {/* ===========================
//                                         DETAILED REMARK
//                                     =========================== */}
//                                                         <div>
//                                                           <label
//                                                             htmlFor="remark"
//                                                             className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-200"
//                                                           >
//                                                             Remark (Optional)
//                                                           </label>

//                                                           <input
//                                                             type="text"
//                                                             value={
//                                                               detailed_remarks
//                                                             }
//                                                             placeholder="Enter remark"
//                                                             onChange={(e) =>
//                                                               setdetailed_remarks(
//                                                                 e.target.value,
//                                                               )
//                                                             }
//                                                             className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
//                                                           />
//                                                         </div>
//                                                       </div>

//                                                       {/* ===============================
//                                       NDR FOOTER
//                                   =============================== */}
//                                                       <DialogFooter className="border-t border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-950/30">
//                                                         <DialogClose asChild>
//                                                           <Button
//                                                             variant="outline"
//                                                             onClick={() => {
//                                                               clearAllState();
//                                                             }}
//                                                           >
//                                                             Cancel
//                                                           </Button>
//                                                         </DialogClose>

//                                                         <Button
//                                                           onClick={async () => {
//                                                             const order_ids =
//                                                               selectedBulkOrders.map(
//                                                                 (o) => o.id,
//                                                               );

//                                                             await changeOrderStatus(
//                                                               {
//                                                                 order_ids:
//                                                                   order_ids,
//                                                                 newStatus:
//                                                                   assignmentState,
//                                                                 remarks:
//                                                                   remarks,
//                                                                 sub_remarks:
//                                                                   sub_remarks,
//                                                                 detailed_remarks:
//                                                                   detailed_remarks,
//                                                                 rescheduled_date:
//                                                                   rescheduleDate,
//                                                                 rider_id: "",
//                                                               },
//                                                             );

//                                                             // for (const order of selectedBulkOrders) {
//                                                             // }
//                                                           }}
//                                                           className="bg-[#0446DB] text-white hover:bg-[#0339B5]"
//                                                         >
//                                                           Submit
//                                                         </Button>
//                                                       </DialogFooter>
//                                                     </DialogContent>
//                                                   </Dialog>
//                                                 </>
//                                               )}

//                                               {/* =====================================
//                               DELIVERED
//                           ===================================== */}
//                                               {assignmentState ==
//                                                 "delivered" && (
//                                                 <button
//                                                   onClick={async () => {
//                                                     if (!assignmentState) {
//                                                       toast.warn(
//                                                         "Please select a status",
//                                                       );
//                                                       return;
//                                                     }

//                                                     const order_ids =
//                                                       selectedBulkOrders.map(
//                                                         (o) => o.id,
//                                                       );

//                                                     await changeOrderStatus({
//                                                       order_ids: order_ids,
//                                                       newStatus:
//                                                         assignmentState,
//                                                       rider_id: "",
//                                                     });

//                                                     // for (const order of selectedBulkOrders) {
//                                                     // }

//                                                     clearAllState();
//                                                   }}
//                                                   className="h-10 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5]"
//                                                 >
//                                                   Mark Bulk Orders as{" "}
//                                                   {assignmentState ==
//                                                   "delivered"
//                                                     ? "Delivered"
//                                                     : "NDR"}
//                                                 </button>
//                                               )}

//                                               {/* =====================================
//                               LOST
//                           ===================================== */}
//                                               {assignmentState == "lost" && (
//                                                 <button
//                                                   onClick={async () => {
//                                                     if (!assignmentState) {
//                                                       toast.warn(
//                                                         "Please select a status",
//                                                       );
//                                                       return;
//                                                     }

//                                                     const order_ids =
//                                                       selectedBulkOrders.map(
//                                                         (o) => o.id,
//                                                       );

//                                                     await changeOrderStatus({
//                                                       order_ids: order_ids,
//                                                       newStatus:
//                                                         assignmentState,
//                                                       rider_id: "",
//                                                     });

//                                                     // for (const order of selectedBulkOrders) {
//                                                     // }

//                                                     clearAllState();
//                                                   }}
//                                                   className="h-10 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5]"
//                                                 >
//                                                   Mark Bulk Orders as{" "}
//                                                   {assignmentState == "lost"
//                                                     ? "Lost"
//                                                     : ""}
//                                                 </button>
//                                               )}
//                                             </div>
//                                           )}
//                                         </>
//                                       )}
//                                     </div>
//                                   </div>
//                                 )}

//                                 {/* =================================================
//                 CLEAR SELECTED ORDERS
//             ================================================= */}
//                                 <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
//                                   <div className="min-w-0">
//                                     <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                       Clear Selection
//                                     </p>

//                                     <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                       Remove all currently selected orders and
//                                       reset bulk actions.
//                                     </p>
//                                   </div>

//                                   <button
//                                     className="h-10 shrink-0 cursor-pointer rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
//                                     onClick={() => {
//                                       clearAllState();
//                                       setSelectedBulkOrders([]);
//                                       setBulkOrderWeight(0);
//                                       setFetchBulkAssignmentRider(false);
//                                       setFetchBulkAssignmentVendor(false);
//                                       setcanceledBulkOrder(false);
//                                       setSelectedMapType(null);
//                                       clearAllState();
//                                     }}
//                                   >
//                                     Clear Selected Orders
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>

//                             {/* =====================================================
//             FOOTER
//         ===================================================== */}
//                             <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 my-0 dark:border-neutral-800 dark:bg-neutral-950/30">
//                               <AlertDialogCancel
//                                 onClick={() => {
//                                   clearAll();
//                                   clearAllState();
//                                 }}
//                                 className="cursor-pointer rounded-sm"
//                               >
//                                 Close
//                               </AlertDialogCancel>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </>
//                     )}

//                   {selectedBulkOrders.length > 0 &&
//                     (selectedStatus === "rto in transit" ||
//                       selectedStatus == "rto out for delivery" ||
//                       selectedStatus == "rto undelivered") && (
//                       <>
//                         {(selectedStatus === "rto in transit" ||
//                           selectedStatus == "rto out for delivery" ||
//                           selectedStatus == "rto undelivered") && (
//                           <AlertDialog>
//                             {/* ================= TRIGGER ================= */}
//                             <AlertDialogTrigger>
//                               <CustomButton
//                                 variant="primary"
//                                 size="sm"
//                                 className="rounded-sm  mb-2 "
//                               >
//                                 Action
//                               </CustomButton>
//                             </AlertDialogTrigger>

//                             {/* ================= POPUP ================= */}
//                             <AlertDialogContent className="!max-w-lg overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
//                               {/* ================= HEADER ================= */}
//                               <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 text-left dark:border-neutral-800">
//                                 <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
//                                   Bulk Order Actions
//                                 </AlertDialogTitle>

//                                 <AlertDialogDescription className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
//                                   Change action for{" "}
//                                   <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                     {selectedBulkOrders?.length || 0}
//                                   </span>{" "}
//                                   selected RTO orders.
//                                 </AlertDialogDescription>
//                               </AlertDialogHeader>

//                               {/* ================= BODY ================= */}
//                               <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
//                                 {/* =====================================================
//                 RTO ORDER STATUS
//             ===================================================== */}
//                                 <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
//                                   {/* SECTION HEADER */}
//                                   <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
//                                     <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                       Change RTO Status
//                                     </h3>

//                                     <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                       Update the status of all selected RTO in
//                                       transit orders.
//                                     </p>
//                                   </div>

//                                   {/* ================= ACTION ================= */}
//                                   <div className="p-4">
//                                     {selectedBulkOrders.length > 0 ? (
//                                       <form
//                                         className="flex flex-col gap-3 sm:flex-row sm:items-center"
//                                         onSubmit={async (e) => {
//                                           e.preventDefault();

//                                           const ids = selectedBulkOrders.map(
//                                             (order) => order.id,
//                                           );

//                                           if (!ndrstatus) {
//                                             toast.error("Please select status");
//                                             return;
//                                           }

//                                           // await rtoDelivered(ids);
//                                           await changeOrderStatus({
//                                             order_ids: ids,
//                                             newStatus: ndrstatus,
//                                           });

//                                           setSelectedBulkOrders([]);
//                                           setSelectedMapType(null);
//                                         }}
//                                       >
//                                         <select
//                                           name="status"
//                                           value={ndrstatus}
//                                           onChange={handleStatusChange}
//                                           className="h-10 min-w-0 flex-1 rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
//                                         >
//                                           <option value="">
//                                             Select Status
//                                           </option>

//                                           {selectedStatus ===
//                                             "rto in transit" && (
//                                             <option value="rto out for delivery">
//                                               RTO Out For Delivery
//                                             </option>
//                                           )}

//                                           {selectedStatus ===
//                                             "rto out for delivery" && (
//                                             <>
//                                               <option value="rto delivered">
//                                                 RTO Delivered
//                                               </option>
//                                               <option value="ndr">NDR</option>
//                                             </>
//                                           )}

//                                           {selectedStatus ==
//                                             "rto undelivered" && (
//                                             <option value="rto out for delivery">
//                                               RTO Out For Delivery
//                                             </option>
//                                           )}

//                                           <option value="lost">Lost</option>
//                                         </select>

//                                         <AlertDialog
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
//                                                   const ids =
//                                                     selectedBulkOrders.map(
//                                                       (order) => order.id,
//                                                     );
//                                                   await changeOrderStatus({
//                                                     order_ids: ids,
//                                                     newStatus:
//                                                       "rto undelivered",
//                                                   });
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

//                                         {/* APPLY ACTION */}
//                                         <button
//                                           type="submit"
//                                           className="h-10 w-full shrink-0 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5] sm:w-auto"
//                                         >
//                                           Apply Action
//                                         </button>
//                                       </form>
//                                     ) : (
//                                       <button
//                                         type="button"
//                                         onClick={() => {
//                                           setcanceledBulkOrder(true);
//                                         }}
//                                         className="h-10 w-full cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5] sm:w-auto"
//                                       >
//                                         Change Action
//                                       </button>
//                                     )}
//                                   </div>
//                                 </div>

//                                 {/* =====================================================
//                 CLEAR SELECTION
//             ===================================================== */}
//                                 <div className="mt-4 flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
//                                   <div className="min-w-0">
//                                     <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                       Clear Selection
//                                     </p>

//                                     <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                       Remove all selected orders and reset bulk
//                                       actions.
//                                     </p>
//                                   </div>

//                                   <button
//                                     type="button"
//                                     className="h-10 w-full shrink-0 cursor-pointer rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10 sm:w-auto"
//                                     onClick={() => {
//                                       setSelectedBulkOrders([]);
//                                       setBulkOrderWeight(0);
//                                       setFetchBulkAssignmentRider(false);
//                                       setFetchBulkAssignmentVendor(false);
//                                       setcanceledBulkOrder(false);
//                                       setSelectedMapType(null);
//                                       clearAllState();
//                                     }}
//                                   >
//                                     Clear Selected Orders
//                                   </button>
//                                 </div>
//                               </div>

//                               {/* ================= FOOTER ================= */}
//                               <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 my-0 dark:border-neutral-800 dark:bg-neutral-950/30">
//                                 <AlertDialogCancel
//                                   onClick={clearAllState}
//                                   className="cursor-pointer rounded-sm"
//                                 >
//                                   Close
//                                 </AlertDialogCancel>
//                               </AlertDialogFooter>
//                             </AlertDialogContent>
//                           </AlertDialog>
//                         )}
//                       </>
//                     )}

//                   {/* Bulk Pending Pickup Handle */}
//                   {selectedBulkOrders.length > 0 &&
//                     selectedStatus === "pending pickup" && (
//                       <>
//                         <AlertDialog>
//                           <AlertDialogTrigger>
//                             <CustomButton
//                               variant="primary"
//                               size="sm"
//                               className="rounded-sm  mb-2 "
//                             >
//                               Action
//                             </CustomButton>
//                           </AlertDialogTrigger>

//                           <AlertDialogContent className="!max-w-3xl !max-h-[90Vh] overflow-y-scroll overflow-x-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
//                             <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
//                               <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
//                                 Bulk Order Actions
//                               </AlertDialogTitle>

//                               <AlertDialogDescription className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
//                                 Change action for{" "}
//                                 <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                   {selectedBulkOrders?.length || 0}
//                                 </span>{" "}
//                                 selected orders.
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>

//                             <div className="px-5 py-5">
//                               <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
//                                 <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
//                                   <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                     Change Order Status
//                                   </h3>

//                                   <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                     Select an action to apply to all selected
//                                     orders.
//                                   </p>
//                                 </div>

//                                 <div className="space-y-4 p-4">
//                                   <div>
//                                     <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                                       Select Status
//                                     </label>

//                                     <select
//                                       className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
//                                       value={bulkStatusState}
//                                       onChange={(e) => {
//                                         const value = e.target.value;

//                                         setBulkStatusState(value);

//                                         if (value === "cancelled") {
//                                           setNewStatus(value);
//                                         } else {
//                                           setNewStatus("");
//                                           setRemark("");
//                                         }
//                                       }}
//                                     >
//                                       <option value="">Select Status</option>

//                                       <option value="cancelled">
//                                         Mark Cancelled
//                                       </option>
//                                       {selectedBulkOrders[0].mapped_with !==
//                                         null && (
//                                         <option value="Cancel Vendor Mapped">
//                                           Cancel Vendor Mapping
//                                         </option>
//                                       )}
//                                       {selectedBulkOrders[0].mapped_dc_id !==
//                                         null && (
//                                         <option value="Cancel DC Mapped">
//                                           Cancel DC Mapping
//                                         </option>
//                                       )}
//                                     </select>
//                                   </div>

//                                   {newStatus === "cancelled" && (
//                                     <div className="rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5">
//                                       <div className="mb-3">
//                                         <p className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                           Cancellation Details
//                                         </p>

//                                         <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                           Select a cancellation remark for all
//                                           selected orders.
//                                         </p>
//                                       </div>

//                                       <div>
//                                         <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                                           Cancel Remark
//                                           <span className="ml-1 text-red-500">
//                                             *
//                                           </span>
//                                         </label>

//                                         <select
//                                           name="remark"
//                                           value={remark || ""}
//                                           onChange={(e) => {
//                                             setRemark(e.target.value);
//                                           }}
//                                           className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
//                                         >
//                                           <option value="">
//                                             Select Remark
//                                           </option>

//                                           <option value="Seller Requested Future Pick up">
//                                             Seller Requested Future Pick up
//                                           </option>

//                                           <option value="Awb rejected">
//                                             AWB Rejected
//                                           </option>

//                                           <option value="Duplicate Pickup Request">
//                                             Duplicate Pickup Request
//                                           </option>

//                                           <option value="Non Serviceable Location">
//                                             Non Serviceable Location
//                                           </option>

//                                           <option value="Pick Failed Due to Dangerous Goods">
//                                             Pick Failed Due to Dangerous Goods
//                                           </option>

//                                           <option value="Product packaging Issue">
//                                             Product Packaging Issue
//                                           </option>

//                                           <option value="Shipment Handedover to other courier">
//                                             Shipment Handedover to Other Courier
//                                           </option>

//                                           <option value="Seller Closed">
//                                             Seller Closed
//                                           </option>

//                                           <option value="Pick up Request Expired">
//                                             Pick up Request Expired
//                                           </option>

//                                           <option value="Entry not Permitted">
//                                             Entry not Permitted
//                                           </option>

//                                           <option value="Customer wants refund/replacement first">
//                                             Customer wants refund/replacement
//                                             first
//                                           </option>
//                                         </select>

//                                         <p className="mt-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
//                                           This remark will be applied to all{" "}
//                                           <span className="font-semibold text-red-600 dark:text-red-400">
//                                             {selectedBulkOrders?.length || 0}
//                                           </span>{" "}
//                                           selected orders.
//                                         </p>
//                                       </div>
//                                     </div>
//                                   )}

//                                   {bulkStatusState && (
//                                     <div className="flex items-center justify-between rounded-sm border border-blue-100 bg-blue-50/50 px-3 py-2.5 dark:border-blue-500/20 dark:bg-blue-500/5">
//                                       <div>
//                                         <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                                           Selected Orders
//                                         </p>

//                                         <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
//                                           This action will be applied to all
//                                           selected orders.
//                                         </p>
//                                       </div>

//                                       <span className="rounded-full bg-[#0446DB]/10 px-2.5 py-1 text-xs font-semibold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
//                                         {selectedBulkOrders?.length || 0}
//                                       </span>
//                                     </div>
//                                   )}

//                                   {bulkStatusState && (
//                                     <div className="flex justify-end border-t border-neutral-100 pt-4 dark:border-neutral-800">
//                                       <button
//                                         type="button"
//                                         onClick={async () => {
//                                           if (!bulkStatusState) {
//                                             toast.warn("Select new status");
//                                             return;
//                                           }

//                                           if (
//                                             bulkStatusState ===
//                                             "Cancel Assignment"
//                                           ) {
//                                             await Promise.all(
//                                               selectedBulkOrders.map((order) =>
//                                                 cancelRiderAssignment(order.id),
//                                               ),
//                                             );
//                                           } else if (
//                                             bulkStatusState ===
//                                             "Cancel Vendor Mapped"
//                                           ) {
//                                             await Promise.all(
//                                               selectedBulkOrders.map((order) =>
//                                                 cancelVendorAssignment(
//                                                   order.id,
//                                                 ),
//                                               ),
//                                             );
//                                           } else if (
//                                             bulkStatusState ===
//                                             "Cancel DC Mapped"
//                                           ) {
//                                             const orderIds =
//                                               selectedBulkOrders.map(
//                                                 (order) => order.id,
//                                               );

//                                             console.log(
//                                               "Cancel DC Mapped action triggered",
//                                               orderIds,
//                                             );
//                                             CancelDcMapping({ orderIds });
//                                             return;
//                                           } else {
//                                             if (!bulkStatusState) {
//                                               toast.error(
//                                                 "Please select status",
//                                               );
//                                               return;
//                                             }

//                                             if (
//                                               bulkStatusState === "cancelled"
//                                             ) {
//                                               if (!remark) {
//                                                 toast.error(
//                                                   "Please select remark",
//                                                 );
//                                                 return;
//                                               }
//                                             }

//                                             await Promise.all(
//                                               selectedBulkOrders.map((order) =>
//                                                 changeStatus({
//                                                   id: order.id,
//                                                   newStatus: bulkStatusState,
//                                                   remark: remark,
//                                                 }),
//                                               ),
//                                             );
//                                           }

//                                           setSelectedBulkOrders([]);
//                                           setBulkStatusState("");
//                                         }}
//                                         className={`h-9 w-full shrink-0 cursor-pointer rounded-sm px-5 text-sm font-medium text-white transition sm:w-auto ${
//                                           bulkStatusState === "cancelled"
//                                             ? "bg-red-600 hover:bg-red-700"
//                                             : "bg-[#0446DB] hover:bg-indigo-800"
//                                         }`}
//                                       >
//                                         {bulkStatusState ===
//                                         "Cancel Vendor Mapped"
//                                           ? "Cancel Vendor Mapped"
//                                           : bulkStatusState === "cancelled"
//                                             ? "Mark Cancelled"
//                                             : bulkStatusState === "lost"
//                                               ? "Mark Lost"
//                                               : bulkStatusState ===
//                                                   "Cancel DC Mapped"
//                                                 ? "Cancel DC Mapped"
//                                                 : "Change Action"}
//                                       </button>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>

//                               <div className="overflow-hidden mt-4 rounded-sm border border-neutral-200 dark:border-neutral-800">
//                                 <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
//                                   <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                     Map Vendor
//                                   </h3>

//                                   <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                     Select an available vendor and map selected
//                                     orders.
//                                   </p>
//                                 </div>

//                                 {/* Body */}
//                                 <div className="p-4">
//                                   {!fetchBulkAssignmentVendor ? (
//                                     <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                                       <div>
//                                         <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                           Available Vendors
//                                         </p>

//                                         <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                           Get eligible vendors for{" "}
//                                           <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                             {selectedBulkOrders?.length || 0}
//                                           </span>{" "}
//                                           selected orders.
//                                         </p>
//                                       </div>

//                                       <button
//                                         type="button"
//                                         onClick={() => {
//                                           if (
//                                             !selectedBulkOrders ||
//                                             selectedBulkOrders.length === 0
//                                           ) {
//                                             toast.warn(
//                                               "Please select at least one order",
//                                             );
//                                             return;
//                                           }

//                                           const order_ids = [
//                                             ...new Set(
//                                               selectedBulkOrders.map(
//                                                 (order) => order.id,
//                                               ),
//                                             ),
//                                           ];

//                                           setFetchBulkAssignmentVendor(true);
//                                           fetchVendor(order_ids);
//                                         }}
//                                         className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white transition hover:bg-indigo-800"
//                                       >
//                                         Get Available Vendors
//                                       </button>
//                                     </div>
//                                   ) : (
//                                     <>
//                                       {vendor?.length > 0 ? (
//                                         <div className="space-y-4">
//                                           <div>
//                                             <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                                               Select Vendor
//                                             </label>

//                                             <select
//                                               value={assignmentState}
//                                               onChange={(e) =>
//                                                 setAssignmentState(
//                                                   e.target.value,
//                                                 )
//                                               }
//                                               className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
//                                             >
//                                               <option value="">
//                                                 Select Vendor for Bulk
//                                                 Assignment
//                                               </option>

//                                               {vendor.map((vendorItem) => (
//                                                 <option
//                                                   key={vendorItem.vendor_id}
//                                                   value={vendorItem.vendor_id}
//                                                 >
//                                                   {vendorItem.vendor_id} :{" "}
//                                                   {vendorItem.vendor_name}
//                                                 </option>
//                                               ))}
//                                             </select>
//                                           </div>

//                                           <div className="flex items-center justify-between rounded-sm border border-blue-100 bg-blue-50/50 px-3 py-2.5 dark:border-blue-500/20 dark:bg-blue-500/5">
//                                             <div>
//                                               <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                                                 Selected Orders
//                                               </p>

//                                               <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
//                                                 Selected vendor will be mapped
//                                                 to all orders.
//                                               </p>
//                                             </div>

//                                             <span className="rounded-full bg-[#0446DB]/10 px-2.5 py-1 text-xs font-semibold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
//                                               {selectedBulkOrders?.length || 0}
//                                             </span>
//                                           </div>

//                                           <div className="flex justify-end border-t border-neutral-100 pt-4 dark:border-neutral-800">
//                                             <button
//                                               type="button"
//                                               onClick={async () => {
//                                                 if (!assignmentState) {
//                                                   toast.warn(
//                                                     "Please select a vendor",
//                                                   );
//                                                   return;
//                                                 }

//                                                 const order_ids =
//                                                   selectedBulkOrders.map(
//                                                     (order) => order.id,
//                                                   );

//                                                 await assignBulkOrderVendor(
//                                                   order_ids,
//                                                   assignmentState,
//                                                 );

//                                                 setSelectedBulkOrders([]);
//                                                 setBulkOrderWeight(0);
//                                                 setFetchBulkAssignmentVendor(
//                                                   false,
//                                                 );
//                                                 setAssignmentState("");
//                                               }}
//                                               className="h-9 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-indigo-800"
//                                             >
//                                               Map Vendor
//                                             </button>
//                                           </div>
//                                         </div>
//                                       ) : (
//                                         <div className="space-y-4">
//                                           <div className="rounded-sm border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
//                                             <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
//                                               No Vendor Available
//                                             </p>

//                                             <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
//                                               No eligible vendor was found for
//                                               the selected orders.
//                                             </p>
//                                           </div>

//                                           <div className="flex justify-end">
//                                             <button
//                                               type="button"
//                                               onClick={() => {
//                                                 if (
//                                                   !selectedBulkOrders ||
//                                                   selectedBulkOrders.length ===
//                                                     0
//                                                 ) {
//                                                   toast.warn(
//                                                     "Please select at least one order",
//                                                   );
//                                                   return;
//                                                 }

//                                                 const order_ids = [
//                                                   ...new Set(
//                                                     selectedBulkOrders.map(
//                                                       (order) => order.id,
//                                                     ),
//                                                   ),
//                                                 ];

//                                                 setFetchBulkAssignmentVendor(
//                                                   true,
//                                                 );
//                                                 fetchVendor(order_ids);
//                                               }}
//                                               className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white transition hover:bg-indigo-800"
//                                             >
//                                               Get Available Vendors
//                                             </button>
//                                           </div>
//                                         </div>
//                                       )}
//                                     </>
//                                   )}
//                                 </div>
//                               </div>

//                               <div className="mt-4 flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
//                                 <div className="min-w-0">
//                                   <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                     Clear Selection
//                                   </p>

//                                   <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                     Remove all selected orders from bulk action.
//                                   </p>
//                                 </div>

//                                 <button
//                                   type="button"
//                                   className="h-10 w-full shrink-0 cursor-pointer rounded-sm border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10 sm:w-auto"
//                                   onClick={() => {
//                                     setSelectedBulkOrders([]);
//                                     clearAllState();
//                                   }}
//                                 >
//                                   Clear Selected Orders
//                                 </button>
//                               </div>
//                             </div>

//                             <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 mb-1 mr-1  dark:border-neutral-800 dark:bg-neutral-950/30">
//                               <AlertDialogCancel
//                                 onClick={() => {
//                                   clearAll();
//                                   clearAllState();
//                                 }}
//                                 className="cursor-pointer rounded-sm"
//                               >
//                                 Close
//                               </AlertDialogCancel>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </>
//                     )}
//                 </div>
//               </div>
//               <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-[#f5f8fb] dark:bg-neutral-900/50">
//                 <div className="mx-0 z-10 md:px-1  md:-mt-0  dark:bg-neutral-900/50 rounded-sm">
//                   {/* Bulk Assignment */}
//                 </div>
//                 <table className="w-full min-w-max border-separate border-spacing-0 text-sm">
//                   <thead className="bg-gray-100 dark:bg-neutral-800">
//                     <tr>
//                       {selectedStatus === "booked" ||
//                       selectedStatus === "pending pickup" ||
//                       selectedStatus === "rto in transit" ||
//                       selectedStatus === "picked" ||
//                       selectedStatus === "in transit" ||
//                       selectedStatus === "undelivered" ||
//                       selectedStatus === "undelivered assigned" ||
//                       selectedStatus === "out for delivery" ? (
//                         <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap  px-2 font-semibold py-3">
//                           <div>
//                             <span>
//                               <input
//                                 type="checkbox"
//                                 className="w-4 h-4 text-indigo-600 text-center rounded border-gray-300"
//                                 checked={
//                                   selectedBulkOrders.length ===
//                                   orders.filter(
//                                     (o) =>
//                                       o.tpc_awb_number === null &&
//                                       o.rider_preference === "daakit",
//                                   ).length
//                                 }
//                                 onChange={toggleSelectAll}
//                               />
//                             </span>
//                           </div>
//                         </th>
//                       ) : (
//                         <>
//                           <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap text-center  font-semibold py-3">
//                             -
//                           </th>
//                         </>
//                       )}

//                       <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap text-left  font-semibold py-3">
//                         ORDER
//                       </th>
//                       <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap text-left uppercase  font-semibold py-3">
//                         Seller Details
//                       </th>

//                       {(selectedStatus === "pending pickup" ||
//                         selectedStatus === "out for delivery" ||
//                         selectedStatus === "delivered" ||
//                         selectedStatus === "picked" ||
//                         selectedStatus === "in transit" ||
//                         selectedStatus === "undelivered assigned") && (
//                         <>
//                           <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap text-left  font-semibold py-3">
//                             RIDER ID/VENDOR ID
//                           </th>
//                         </>
//                       )}

//                       <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap text-left  font-semibold py-3">
//                         CONSIGNEE ADDRESS
//                       </th>
//                       <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap text-left  font-semibold py-3">
//                         PACKAGE DETAILS
//                       </th>

//                       {/* <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap text-center px-2 font-semibold py-3">ASSIGNMENT/RIDER</th> */}
//                       {/* <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap text-center px-2 font-semibold py-3">MAPPED/VENDOR</th> */}
//                       <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap text-left  font-semibold py-3">
//                         STATUS
//                       </th>
//                       {selectedStatus === "booked" && (
//                         <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap text-left  font-semibold py-3">
//                           ELIGIBLE VENDORS
//                         </th>
//                       )}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {loading ? (
//                       <tr>
//                         <td colSpan={10} className="text-center py-10">
//                           <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//                           <p className="mt-2">Loading orders...</p>
//                         </td>
//                       </tr>
//                     ) : orders.length === 0 ? (
//                       <tr>
//                         <td colSpan={10} className="text-center py-10">
//                           No orders found
//                         </td>
//                       </tr>
//                     ) : (
//                       orders?.map((order) => {
//                         let isSelected;
//                         if (selectedStatus === "booked") {
//                           isSelected = selectedBulkOrders.some(
//                             (o) => o.id === order.id,
//                           );
//                         } else if (selectedStatus === "pending pickup") {
//                           isSelected = selectedBulkOrders.some(
//                             (o) => o.id === order.id,
//                           );
//                         } else if (selectedStatus === "rto in transit") {
//                           isSelected = selectedBulkOrders.some(
//                             (o) => o.id === order.id,
//                           );
//                         }

//                         return (
//                           <tr
//                             key={order.id}
//                             className="hover:bg-gray-50 text-left dark:hover:bg-gray-800 border-b"
//                           >
//                             {/* Select */}
//                             {(selectedStatus === "booked" &&
//                               order?.rider_preference == "daakit" &&
//                               order.tpc_awb_number == null) ||
//                             (selectedStatus === "pending pickup" &&
//                               order?.rider_preference == "daakit" &&
//                               order.tpc_awb_number == null) ? (
//                               <td className="py-2 text-center">
//                                 {(() => {
//                                   const currentIsMapped =
//                                     order?.mapped_with !== null &&
//                                     order?.mapped_with !== undefined;

//                                   const firstSelectedIsMapped =
//                                     selectedBulkOrders.length > 0
//                                       ? selectedBulkOrders[0]?.mapped_with !==
//                                           null &&
//                                         selectedBulkOrders[0]?.mapped_with !==
//                                           undefined
//                                       : null;

//                                   const isDifferentMappingType =
//                                     selectedStatus === "pending pickup" &&
//                                     selectedBulkOrders.length > 0 &&
//                                     firstSelectedIsMapped !== currentIsMapped;

//                                   if (isDifferentMappingType) {
//                                     return (
//                                       <span
//                                         className="text-sm font-medium text-gray-400 dark:text-gray-500"
//                                         title={
//                                           firstSelectedIsMapped
//                                             ? "Only mapped orders can be selected"
//                                             : "Only unmapped orders can be selected"
//                                         }
//                                       >
//                                         --
//                                       </span>
//                                     );
//                                   }

//                                   return (
//                                     <input
//                                       type="checkbox"
//                                       checked={isSelected}
//                                       onChange={(e) => {
//                                         const isChecked = e.target.checked;

//                                         if (
//                                           selectedStatus === "booked" ||
//                                           selectedStatus === "pending pickup"
//                                         ) {
//                                           if (isChecked) {
//                                             if (
//                                               selectedStatus ===
//                                                 "pending pickup" &&
//                                               selectedBulkOrders.length > 0
//                                             ) {
//                                               const firstIsMapped =
//                                                 selectedBulkOrders[0]
//                                                   ?.mapped_with !== null &&
//                                                 selectedBulkOrders[0]
//                                                   ?.mapped_with !== undefined;

//                                               const thisIsMapped =
//                                                 order?.mapped_with !== null &&
//                                                 order?.mapped_with !==
//                                                   undefined;

//                                               if (
//                                                 firstIsMapped !== thisIsMapped
//                                               ) {
//                                                 return;
//                                               }
//                                             }

//                                             setSelectedBulkOrders((prev) => {
//                                               const alreadySelected = prev.some(
//                                                 (o) => o.id === order.id,
//                                               );

//                                               if (alreadySelected) {
//                                                 return prev;
//                                               }

//                                               const updated = [...prev, order];

//                                               return updated;
//                                             });

//                                             setBulkOrderWeight(
//                                               (prev) =>
//                                                 Number(prev) +
//                                                 Number(
//                                                   order?.total_weight || 0,
//                                                 ),
//                                             );
//                                           } else {
//                                             setSelectedBulkOrders((prev) => {
//                                               const updated = prev.filter(
//                                                 (o) => o.id !== order.id,
//                                               );

//                                               const order_ids = updated.map(
//                                                 (o) => o.id,
//                                               );

//                                               // Booked ka existing logic
//                                               if (selectedStatus === "booked") {
//                                                 fetchVendor(order_ids);
//                                               }

//                                               return updated;
//                                             });

//                                             setBulkOrderWeight((prev) =>
//                                               Math.max(
//                                                 0,
//                                                 Number(prev) -
//                                                   Number(
//                                                     order?.total_weight || 0,
//                                                   ),
//                                               ),
//                                             );
//                                           }
//                                         }
//                                       }}
//                                       className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
//                                     />
//                                   );
//                                 })()}
//                               </td>
//                             ) : selectedStatus === "picked" &&
//                               order?.pickup_stage === "at_central_hub" &&
//                               order?.rider_preference == "daakit" ? (
//                               <td className="px-6 py-4 text-center">
//                                 <input
//                                   type="checkbox"
//                                   checked={selectedBulkOrders.some(
//                                     (item) => item.id === order.id,
//                                   )}
//                                   onChange={(e) =>
//                                     handleBulkOrderSelect(
//                                       order,
//                                       e.target.checked,
//                                     )
//                                   }
//                                   className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
//                                 />
//                               </td>
//                             ) : selectedStatus === "rto in transit" &&
//                               order?.rider_preference == "daakit" ? (
//                               <>
//                                 <td className="px-6 py-4 text-center">
//                                   <input
//                                     type="checkbox"
//                                     checked={isSelected}
//                                     onChange={(e) => {
//                                       const isChecked = e.target.checked;

//                                       if (selectedStatus === "rto in transit") {
//                                         if (isChecked) {
//                                           setSelectedBulkOrders((prev) => {
//                                             const updated = [...prev, order];
//                                             const order_ids = updated.map(
//                                               (o) => o.id,
//                                             );
//                                             return updated;
//                                           });

//                                           setBulkOrderWeight(
//                                             (prev) =>
//                                               Number(prev) +
//                                               Number(order.total_weight),
//                                           );
//                                         } else {
//                                           setSelectedBulkOrders((prev) => {
//                                             const updated = prev.filter(
//                                               (o) => o.id !== order.id,
//                                             );
//                                             const order_ids = updated.map(
//                                               (o) => o.id,
//                                             );
//                                             return updated;
//                                           });

//                                           setBulkOrderWeight(
//                                             (prev) =>
//                                               Number(prev) -
//                                               Number(order.total_weight), // ✅ fixed bug
//                                           );
//                                         }
//                                       }
//                                     }}
//                                     className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
//                                   />
//                                 </td>
//                               </>
//                             ) : [
//                                 "in transit",
//                                 "out for delivery",
//                                 "undelivered",
//                                 "rto out for delivery",
//                                 "undelivered assigned",
//                                 "rto undelivered",
//                               ].includes(selectedStatus) &&
//                               order?.rider_preference == "daakit" ? (
//                               <>
//                                 <td className="px-6 py-4 text-center">
//                                   <input
//                                     type="checkbox"
//                                     checked={selectedBulkOrders.some(
//                                       (item) => item.id === order.id,
//                                     )}
//                                     onChange={(e) => {
//                                       const isChecked = e.target.checked;

//                                       if (selectedStatus == "picked") {
//                                         if (
//                                           order.pickup_stage !== null &&
//                                           order.pickup_stage !== "at_vendor"
//                                         ) {
//                                           toast.error(
//                                             'Pickup stage must be empty or "at_vendor" before marking the order in transit',
//                                           );

//                                           return;
//                                         }
//                                       }

//                                       if (isChecked) {
//                                         setSelectedBulkOrders((prev) => {
//                                           const updated = [...prev, order];
//                                           const order_ids = updated.map((o) => {
//                                             return o.id;
//                                           });
//                                           return updated;
//                                         });

//                                         setBulkOrderWeight(
//                                           (prev) =>
//                                             Number(prev) +
//                                             Number(order.total_weight),
//                                         );
//                                       } else {
//                                         setSelectedBulkOrders((prev) => {
//                                           const updated = prev.filter(
//                                             (o) => o.id !== order.id,
//                                           );
//                                           const order_ids = updated.map(
//                                             (o) => o.id,
//                                           );
//                                           return updated;
//                                         });

//                                         setBulkOrderWeight(
//                                           (prev) =>
//                                             Number(prev) -
//                                             Number(order.total_weight), // ✅ fixed bug
//                                         );
//                                       }
//                                     }}
//                                     className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
//                                   />
//                                 </td>
//                               </>
//                             ) : canMarkInTransit &&
//                               selectedStatus == "picked" &&
//                               order?.rider_preference == "daakit" ? (
//                               <>
//                                 <td className="px-6 py-4 text-center">
//                                   <input
//                                     type="checkbox"
//                                     checked={selectedBulkOrders.some(
//                                       (item) => item.id === order.id,
//                                     )}
//                                     onChange={(e) => {
//                                       const isChecked = e.target.checked;

//                                       if (selectedStatus == "picked") {
//                                         if (
//                                           order.pickup_stage !== null &&
//                                           order.pickup_stage !== "at_vendor"
//                                         ) {
//                                           toast.error(
//                                             'Pickup stage must be empty or "at_vendor" before marking the order in transit',
//                                           );

//                                           return;
//                                         }
//                                       }

//                                       if (isChecked) {
//                                         setSelectedBulkOrders((prev) => {
//                                           const updated = [...prev, order];
//                                           const order_ids = updated.map((o) => {
//                                             return o.id;
//                                           });
//                                           return updated;
//                                         });

//                                         setBulkOrderWeight(
//                                           (prev) =>
//                                             Number(prev) +
//                                             Number(order.total_weight),
//                                         );
//                                       } else {
//                                         setSelectedBulkOrders((prev) => {
//                                           const updated = prev.filter(
//                                             (o) => o.id !== order.id,
//                                           );
//                                           const order_ids = updated.map(
//                                             (o) => o.id,
//                                           );
//                                           return updated;
//                                         });

//                                         setBulkOrderWeight(
//                                           (prev) =>
//                                             Number(prev) -
//                                             Number(order.total_weight),
//                                         );
//                                       }
//                                     }}
//                                     className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
//                                   />
//                                 </td>
//                               </>
//                             ) : (
//                               <>
//                                 <td className="px-6 py-4 text-center">-</td>
//                               </>
//                             )}

//                             {/* Order ID */}
//                             <td className=" py-2 text-left whitespace-pre-line">
//                               <p className="text-sm text-gray-500 dark:text-white">
//                                 {new Date(order.created_at).toLocaleString(
//                                   "en-IN",
//                                   {
//                                     timeZone: "Asia/Kolkata",
//                                     day: "2-digit",
//                                     month: "2-digit",
//                                     year: "numeric",
//                                     hour: "2-digit",
//                                     minute: "2-digit",
//                                     hour12: true,
//                                   },
//                                 )}
//                                 <span
//                                   className={`ml-2 inline-flex mb-1 items-center gap-1.5 rounded-full border border-dashed px-2.5 py-1 text-xs font-semibold ${
//                                     order?.rider_preference === "daakit"
//                                       ? "border-blue-500 bg-blue-50/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
//                                       : "border-emerald-500 bg-emerald-50/50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
//                                   }`}
//                                 >
//                                   {order?.rider_preference === "daakit"
//                                     ? "DDN"
//                                     : "BYOB"}
//                                 </span>
//                               </p>
//                               <p className="text-left text-gray-800 flex items-center">
//                                 <Link
//                                   to={`/admin/order-history?awb_number=${encodeURIComponent(order.awb_number)}`}
                                  
//                                   rel="noopener noreferrer"
//                                   className="underline text-[#0446DB] hover:text-blue-500"
//                                 >
//                                   {order.awb_number}
//                                 </Link>

//                                 <button
//                                   className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
//                                   onClick={() => {
//                                     navigator.clipboard.writeText(
//                                       order.awb_number,
//                                     );
//                                     setCopySuccess(order.awb_number);
//                                     setTimeout(() => {
//                                       setCopySuccess(null);
//                                     }, 2000);
//                                   }}
//                                 >
//                                   {copySuccess === order.awb_number ? (
//                                     <CiCircleCheck />
//                                   ) : (
//                                     <FaRegCopy />
//                                   )}
//                                 </button>

//                                 <Dialog className="w-5xl">
//                                   <DialogTrigger asChild>
//                                     <Button
//                                       variant="outline"
//                                       className="text-xs ml-1 font-medium  text-red-600  inline-block cursor-pointer "
//                                     >
//                                       <span>
//                                         <TbFileInfo />
//                                       </span>
//                                     </Button>
//                                   </DialogTrigger>
//                                   <DialogContent className="sm:max-w-4xl">
//                                     <DialogHeader>
//                                       <DialogTitle>Order Details</DialogTitle>
//                                     </DialogHeader>

//                                     <div className="bg-white p-6  space-y-3 text-gray-700">
//                                       {/* Basic Info */}
//                                       <h3 className="font-semibold text-[#0446DB] mb-2">
//                                         Basic Details
//                                       </h3>
//                                       <div className="grid grid-cols-2 gap-4">
//                                         <div>
//                                           <strong>Order ID:</strong>{" "}
//                                           {order.merchant_order_id}
//                                           <button
//                                             className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
//                                             onClick={() => {
//                                               navigator.clipboard.writeText(
//                                                 order.merchant_order_id,
//                                               );
//                                               setCopySuccess(
//                                                 order.merchant_order_id,
//                                               );
//                                               setTimeout(() => {
//                                                 setCopySuccess(null);
//                                               }, 2000);
//                                             }}
//                                           >
//                                             {copySuccess ===
//                                             order.merchant_order_id ? (
//                                               <CiCircleCheck />
//                                             ) : (
//                                               <FaRegCopy />
//                                             )}
//                                           </button>
//                                         </div>
//                                         <div>
//                                           <strong>AWB No:</strong>{" "}
//                                           {order.awb_number}
//                                           <button
//                                             className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
//                                             onClick={() => {
//                                               navigator.clipboard.writeText(
//                                                 order.awb_number,
//                                               );
//                                               setCopySuccess(order.awb_number);
//                                               setTimeout(() => {
//                                                 setCopySuccess(null);
//                                               }, 2000);
//                                             }}
//                                           >
//                                             {copySuccess ===
//                                             order.awb_number ? (
//                                               <CiCircleCheck />
//                                             ) : (
//                                               <FaRegCopy />
//                                             )}
//                                           </button>
//                                         </div>
//                                         <div>
//                                           <strong>Order Type:</strong>{" "}
//                                           {order.order_type === "cod"
//                                             ? "COD"
//                                             : "Prepaid"}
//                                         </div>
//                                         <div>
//                                           <strong>Order Specific:</strong>{" "}
//                                           {order.order_specific}
//                                         </div>
//                                         <div>
//                                           <strong>Order Status:</strong>{" "}
//                                           {toCapitalizeEachWord(order.status)}
//                                         </div>
//                                         <div>
//                                           <strong>Total Amount:</strong> ₹
//                                           {Number(
//                                             order.total_amount,
//                                           ).toLocaleString()}
//                                         </div>
//                                         <div>
//                                           <strong>Order Weight:</strong>{" "}
//                                           {Number(
//                                             order.total_weight,
//                                           ).toLocaleString()}
//                                           g
//                                         </div>
//                                         <div>
//                                           <strong>Charge Weight:</strong>{" "}
//                                           {Number(
//                                             order.charged_weight,
//                                           ).toLocaleString()}
//                                           g
//                                         </div>
//                                         <div>
//                                           <strong>Number of Packets:</strong>{" "}
//                                           {order.number_of_boxes}
//                                         </div>
//                                       </div>

//                                       <div className="pt-4 border-t">
//                                         <div className="flex justify-between items-center mb-2">
//                                           <h3 className="font-semibold text-[#0446DB]">
//                                             Delivery Details
//                                           </h3>
//                                           <Button
//                                             variant="outline"
//                                             size="sm"
//                                             onClick={() => {
//                                               if (
//                                                 editingDeliveryId === order.id
//                                               ) {
//                                                 // Save logic here - you'll need to create an API endpoint
//                                                 handleUpdateDeliveryDetails({
//                                                   order_id: order.id,
//                                                   delivery_details:
//                                                     deliveryFormData,
//                                                 });
//                                               } else {
//                                                 setEditingDeliveryId(order.id);
//                                                 setDeliveryFormData({
//                                                   delivery_contact_name:
//                                                     order.delivery_contact_name,
//                                                   delivery_address_line:
//                                                     order.delivery_address_line,
//                                                   delivery_city:
//                                                     order.delivery_city,
//                                                   delivery_state:
//                                                     order.delivery_state,
//                                                   delivery_pincode:
//                                                     order.delivery_pincode,
//                                                 });
//                                               }
//                                             }}
//                                             className="text-xs"
//                                           >
//                                             {editingDeliveryId === order.id
//                                               ? "Save"
//                                               : "Edit"}
//                                           </Button>
//                                         </div>

//                                         {editingDeliveryId === order.id ? (
//                                           <div className="grid grid-cols-2 gap-4">
//                                             <div>
//                                               <label className="block text-xs text-gray-600 mb-1">
//                                                 Customer Name
//                                               </label>
//                                               <input
//                                                 type="text"
//                                                 value={
//                                                   deliveryFormData.delivery_contact_name
//                                                 }
//                                                 onChange={(e) =>
//                                                   setDeliveryFormData(
//                                                     (prev) => ({
//                                                       ...prev,
//                                                       delivery_contact_name:
//                                                         e.target.value,
//                                                     }),
//                                                   )
//                                                 }
//                                                 className="w-full border rounded-md px-2 py-1 text-sm"
//                                               />
//                                             </div>
//                                             <div>
//                                               <label className="block text-xs text-gray-600 mb-1">
//                                                 Address
//                                               </label>
//                                               <input
//                                                 type="text"
//                                                 value={
//                                                   deliveryFormData.delivery_address_line
//                                                 }
//                                                 onChange={(e) =>
//                                                   setDeliveryFormData(
//                                                     (prev) => ({
//                                                       ...prev,
//                                                       delivery_address_line:
//                                                         e.target.value,
//                                                     }),
//                                                   )
//                                                 }
//                                                 className="w-full border rounded-md px-2 py-1 text-sm"
//                                               />
//                                             </div>
//                                             <div>
//                                               <label className="block text-xs text-gray-600 mb-1">
//                                                 City
//                                               </label>
//                                               <input
//                                                 type="text"
//                                                 value={
//                                                   deliveryFormData.delivery_city
//                                                 }
//                                                 onChange={(e) =>
//                                                   setDeliveryFormData(
//                                                     (prev) => ({
//                                                       ...prev,
//                                                       delivery_city:
//                                                         e.target.value,
//                                                     }),
//                                                   )
//                                                 }
//                                                 className="w-full border rounded-md px-2 py-1 text-sm"
//                                               />
//                                             </div>
//                                             <div>
//                                               <label className="block text-xs text-gray-600 mb-1">
//                                                 State
//                                               </label>
//                                               <input
//                                                 type="text"
//                                                 value={
//                                                   deliveryFormData.delivery_state
//                                                 }
//                                                 onChange={(e) =>
//                                                   setDeliveryFormData(
//                                                     (prev) => ({
//                                                       ...prev,
//                                                       delivery_state:
//                                                         e.target.value,
//                                                     }),
//                                                   )
//                                                 }
//                                                 className="w-full border rounded-md px-2 py-1 text-sm"
//                                               />
//                                             </div>
//                                             <div>
//                                               <label className="block text-xs text-gray-600 mb-1">
//                                                 Pincode
//                                               </label>
//                                               <input
//                                                 type="text"
//                                                 value={
//                                                   deliveryFormData.delivery_pincode
//                                                 }
//                                                 onChange={(e) =>
//                                                   setDeliveryFormData(
//                                                     (prev) => ({
//                                                       ...prev,
//                                                       delivery_pincode:
//                                                         e.target.value,
//                                                     }),
//                                                   )
//                                                 }
//                                                 className="w-full border rounded-md px-2 py-1 text-sm"
//                                               />
//                                             </div>
//                                             <div className="flex items-end">
//                                               <Button
//                                                 variant="ghost"
//                                                 size="sm"
//                                                 onClick={() =>
//                                                   setEditingDeliveryId(null)
//                                                 }
//                                                 className="text-red-500"
//                                               >
//                                                 Cancel
//                                               </Button>
//                                             </div>
//                                           </div>
//                                         ) : (
//                                           <div className="grid grid-cols-2 gap-4">
//                                             <div>
//                                               <strong>Customer Name:</strong>{" "}
//                                               {order.delivery_contact_name}
//                                             </div>
//                                             <div>
//                                               <strong>Address:</strong>{" "}
//                                               {order.delivery_address_line}
//                                             </div>
//                                             <div>
//                                               <strong>City:</strong>{" "}
//                                               {`${order.delivery_city}, ${order.delivery_state} - ${order.delivery_pincode}` ||
//                                                 "N/A"}
//                                             </div>
//                                           </div>
//                                         )}
//                                       </div>

//                                       {/* Pickup Details */}
//                                       <div className="pt-4 border-t">
//                                         <div className="flex justify-between items-center mb-2">
//                                           <h3 className="font-semibold text-[#0446DB]">
//                                             Pickup Details
//                                           </h3>
//                                           <Button
//                                             variant="outline"
//                                             size="sm"
//                                             onClick={() => {
//                                               if (
//                                                 editingPickupId === order.id
//                                               ) {
//                                                 // Save logic here
//                                                 handleUpdateDeliveryDetails({
//                                                   order_id: order.id,
//                                                   pickup_details:
//                                                     pickupFormData,
//                                                 });
//                                               } else {
//                                                 setEditingPickupId(order.id);
//                                                 setPickupFormData({
//                                                   pickup_contact_name:
//                                                     order.pickup_contact_name ||
//                                                     "",
//                                                   pickup_phone:
//                                                     order.pickup_phone || "",
//                                                   pickup_address_line:
//                                                     order.pickup_address_line ||
//                                                     "",
//                                                   pickup_city:
//                                                     order.pickup_city || "",
//                                                   pickup_state:
//                                                     order.pickup_state || "",
//                                                   pickup_pincode:
//                                                     order.pickup_pincode || "",
//                                                 });
//                                               }
//                                             }}
//                                             className="text-xs"
//                                           >
//                                             {editingPickupId === order.id
//                                               ? "Save"
//                                               : "Edit"}
//                                           </Button>
//                                         </div>

//                                         {editingPickupId === order.id ? (
//                                           <div className="grid grid-cols-2 gap-4">
//                                             <div>
//                                               <label className="block text-xs text-gray-600 mb-1">
//                                                 Name
//                                               </label>
//                                               <input
//                                                 type="text"
//                                                 value={
//                                                   pickupFormData.pickup_contact_name
//                                                 }
//                                                 onChange={(e) =>
//                                                   setPickupFormData((prev) => ({
//                                                     ...prev,
//                                                     pickup_contact_name:
//                                                       e.target.value,
//                                                   }))
//                                                 }
//                                                 className="w-full border rounded-md px-2 py-1 text-sm"
//                                               />
//                                             </div>
//                                             <div>
//                                               <label className="block text-xs text-gray-600 mb-1">
//                                                 Phone No
//                                               </label>
//                                               <input
//                                                 type="text"
//                                                 value={
//                                                   pickupFormData.pickup_phone
//                                                 }
//                                                 onChange={(e) =>
//                                                   setPickupFormData((prev) => ({
//                                                     ...prev,
//                                                     pickup_phone:
//                                                       e.target.value,
//                                                   }))
//                                                 }
//                                                 className="w-full border rounded-md px-2 py-1 text-sm"
//                                               />
//                                             </div>
//                                             <div>
//                                               <label className="block text-xs text-gray-600 mb-1">
//                                                 Address
//                                               </label>
//                                               <input
//                                                 type="text"
//                                                 value={
//                                                   pickupFormData.pickup_address_line
//                                                 }
//                                                 onChange={(e) =>
//                                                   setPickupFormData((prev) => ({
//                                                     ...prev,
//                                                     pickup_address_line:
//                                                       e.target.value,
//                                                   }))
//                                                 }
//                                                 className="w-full border rounded-md px-2 py-1 text-sm"
//                                               />
//                                             </div>
//                                             <div>
//                                               <label className="block text-xs text-gray-600 mb-1">
//                                                 City
//                                               </label>
//                                               <input
//                                                 type="text"
//                                                 value={
//                                                   pickupFormData.pickup_city
//                                                 }
//                                                 onChange={(e) =>
//                                                   setPickupFormData((prev) => ({
//                                                     ...prev,
//                                                     pickup_city: e.target.value,
//                                                   }))
//                                                 }
//                                                 className="w-full border rounded-md px-2 py-1 text-sm"
//                                               />
//                                             </div>
//                                             <div>
//                                               <label className="block text-xs text-gray-600 mb-1">
//                                                 State
//                                               </label>
//                                               <input
//                                                 type="text"
//                                                 value={
//                                                   pickupFormData.pickup_state
//                                                 }
//                                                 onChange={(e) =>
//                                                   setPickupFormData((prev) => ({
//                                                     ...prev,
//                                                     pickup_state:
//                                                       e.target.value,
//                                                   }))
//                                                 }
//                                                 className="w-full border rounded-md px-2 py-1 text-sm"
//                                               />
//                                             </div>
//                                             <div>
//                                               <label className="block text-xs text-gray-600 mb-1">
//                                                 Pincode
//                                               </label>
//                                               <input
//                                                 type="text"
//                                                 value={
//                                                   pickupFormData.pickup_pincode
//                                                 }
//                                                 onChange={(e) =>
//                                                   setPickupFormData((prev) => ({
//                                                     ...prev,
//                                                     pickup_pincode:
//                                                       e.target.value,
//                                                   }))
//                                                 }
//                                                 className="w-full border rounded-md px-2 py-1 text-sm"
//                                               />
//                                             </div>
//                                             <div className="flex items-end">
//                                               <Button
//                                                 variant="ghost"
//                                                 size="sm"
//                                                 onClick={() =>
//                                                   setEditingPickupId(null)
//                                                 }
//                                                 className="text-red-500"
//                                               >
//                                                 Cancel
//                                               </Button>
//                                             </div>
//                                           </div>
//                                         ) : (
//                                           <div className="grid grid-cols-2 gap-4">
//                                             <div>
//                                               <strong>Name:</strong>{" "}
//                                               {order.pickup_contact_name ||
//                                                 "N/A"}
//                                             </div>
//                                             <div>
//                                               <strong>Pickup Phone No:</strong>{" "}
//                                               {`${order.pickup_phone}` || "N/A"}
//                                             </div>
//                                             <div>
//                                               <strong>Address:</strong>{" "}
//                                               {order.pickup_address_line ||
//                                                 "N/A"}
//                                             </div>
//                                             <div>
//                                               <strong>City:</strong>{" "}
//                                               {`${order.pickup_city}, ${order.pickup_state} - ${order.pickup_pincode}` ||
//                                                 "N/A"}
//                                             </div>
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>

//                                     <DialogFooter>
//                                       <DialogClose asChild>
//                                         <button
//                                           onClick={() => {
//                                             navigate(
//                                               `/admin/order-history?awb=${order?.awb_number}`,
//                                             );
//                                           }}
//                                           className="bg-green-500 mr-2 text-white px-4 py-2 rounded hover:bg-indigo-800 transition"
//                                         >
//                                           Get History
//                                         </button>
//                                       </DialogClose>
//                                       <DialogClose asChild>
//                                         <Button
//                                           onClick={() => {
//                                             clearAllState();
//                                           }}
//                                           variant="outline"
//                                         >
//                                           Cancel
//                                         </Button>
//                                       </DialogClose>
//                                     </DialogFooter>
//                                   </DialogContent>
//                                 </Dialog>
//                               </p>

//                               {order.tpc_awb_number && (
//                                 <p>
//                                   {order.tpc_awb_number}
//                                   <button
//                                     className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
//                                     onClick={() => {
//                                       navigator.clipboard.writeText(
//                                         order.tpc_awb_number,
//                                       );
//                                       setCopySuccess(order.tpc_awb_number);
//                                       setTimeout(() => {
//                                         setCopySuccess(null);
//                                       }, 2000);
//                                     }}
//                                   >
//                                     {copySuccess === order.tpc_awb_number ? (
//                                       <CiCircleCheck />
//                                     ) : (
//                                       <FaRegCopy />
//                                     )}
//                                   </button>
//                                 </p>
//                               )}

//                               <p className="text-sm whitespace-nowrap text-gray-400 dark:text-white">
//                                 MOID:{" "}
//                                 {order.merchant_order_id?.length <= 20
//                                   ? order.merchant_order_id
//                                   : `${order.merchant_order_id.slice(
//                                       0,
//                                       16,
//                                     )}...`}
//                                 <button
//                                   className="pl-2 text-lg text-gray-600 dark:text-white hover:text-[#0446DB] transition"
//                                   onClick={() => {
//                                     navigator.clipboard.writeText(
//                                       order.merchant_order_id,
//                                     );
//                                     setCopySuccess(order.merchant_order_id);
//                                     setTimeout(() => {
//                                       setCopySuccess(null);
//                                     }, 2000);
//                                   }}
//                                 >
//                                   {copySuccess === order.merchant_order_id ? (
//                                     <CiCircleCheck />
//                                   ) : (
//                                     <FaRegCopy />
//                                   )}
//                                 </button>
//                               </p>
//                             </td>

//                             {/* SELLER DETAILS */}
//                             <td className=" py-2">
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

//                             {(selectedStatus === "pending pickup" ||
//                               selectedStatus === "out for delivery" ||
//                               selectedStatus === "delivered" ||
//                               selectedStatus === "picked" ||
//                               selectedStatus === "in transit" ||
//                               selectedStatus === "undelivered assigned") && (
//                               <>
//                                 <td className="text-left ">
//                                   {order.mapped_dc_id !== null ? (
//                                     <>DC_{order.mapped_dc_id}</>
//                                   ) : order.rider_vendor_id === null &&
//                                     order.rider_merchant_id === null &&
//                                     order.mapped_with === null ? (
//                                     <>
//                                       {order.rider_id !== null ? "DKT_" : ""}
//                                       {order.rider_id}
//                                     </>
//                                   ) : (
//                                     <>
//                                       {order.rider_id !== null
//                                         ? `FP_${order.rider_vendor_id}_`
//                                         : order.rider_merchant_id
//                                           ? `M${order.rider_merchant_id}_R`
//                                           : order.mapped_with
//                                             ? `FP_${order.mapped_with}`
//                                             : "DKT_"}

//                                       {order.rider_id}
//                                     </>
//                                   )}

//                                   {selectedStatus === "picked" && (
//                                     <p>
//                                       {order.pickup_stage === "at_central_hub"
//                                         ? "At Central Hub"
//                                         : "At Vendor Hub"}
//                                     </p>
//                                   )}

//                                   {/* {
//                                         order.mapped_with === null && (
//                                           <>
//                                            -
//                                           </>
//                                         )
//                                       } */}
//                                 </td>
//                               </>
//                             )}

//                             {/* Address */}
//                             <td className=" py-2 whitespace-pre-line">
//                               <p className="font-medium text-gray-800 dark:text-white">
//                                 {order.delivery_contact_name}
//                               </p>
//                               <HoverCard>
//                                 <HoverCardTrigger>
//                                   {order.delivery_address_line.slice(0, 30)}
//                                   ...
//                                 </HoverCardTrigger>
//                                 <HoverCardContent className="bg-[#0446DB] text-white">
//                                   {order.delivery_address_line},{" "}
//                                   {order.delivery_city}, {order.delivery_state}{" "}
//                                   - {order.delivery_pincode}
//                                 </HoverCardContent>
//                               </HoverCard>
//                               <p className="text-xs text-gray-500 dark:text-white">
//                                 {order.delivery_city}, {order.delivery_state} -{" "}
//                                 {order.delivery_pincode}
//                               </p>

//                               <p className="text-xs text-gray-400">
//                                 {order.delivery_country}
//                               </p>
//                             </td>

//                             {/* Package Details */}
//                             <td className=" py-2">
//                               <p>
//                                 {selectedStatus !== "cancelled" && (
//                                   <span className=" whitespace-nowrap dark:text-white">
//                                     EDD: {order.EDD}
//                                   </span>
//                                 )}
//                               </p>
//                               <p>
//                                 <span className="font-medium text-gray-800 dark:text-white">
//                                   Weight:
//                                 </span>{" "}
//                                 <span className="dark:text-white">
//                                   {Number(order.total_weight).toLocaleString()}g
//                                 </span>
//                                 {selectedStatus !== "cancelled" && (
//                                   <span
//                                     className={`ml-2 px-2 py-0.5  rounded-full text-sm font-semibold shadow-sm ${
//                                       order.order_specific?.slice(0, 3) ===
//                                       "NDD"
//                                         ? "text-green-800 bg-green-100 border border-green-300"
//                                         : order.order_specific?.slice(0, 3) ===
//                                             "SDD"
//                                           ? "text-yellow-800 bg-yellow-100 border border-yellow-300"
//                                           : "text-red-800 bg-red-100 border border-red-300 animate-blink"
//                                     }`}
//                                   >
//                                     {order.order_specific?.slice(0, 3) === "NDD"
//                                       ? "NDD"
//                                       : order.order_specific?.slice(0, 3) ===
//                                           "SDD"
//                                         ? "SDD"
//                                         : order.order_specific?.slice(0, 6) ===
//                                             "Turant"
//                                           ? "Turant"
//                                           : order.order_specific}
//                                   </span>
//                                 )}
//                               </p>
//                               <p>
//                                 <span className="font-medium dark:text-white text-gray-800">
//                                   Dimensions:
//                                 </span>{" "}
//                                 <span className=" dark:text-white">
//                                   {order.package_length}x{order.package_breadth}
//                                   x{order.package_height}
//                                 </span>
//                               </p>
//                             </td>

//                             {/* Assignment */}
//                             {/* {selectedStatus === "All" ? (
//                                   <>
//                                     <td className="px-6 py-4 text-center">
//                                       {order.status === "booked" ||
//                                       order.status === "undelivered" ? (
//                                         <>
//                                           {!(
//                                             isOpenIndividualAssignmnet ===
//                                             order.id
//                                           ) ? (
//                                             <span className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer">
//                                               Not Assigned
//                                             </span>
//                                           ) : (
//                                             <></>
//                                           )}
//                                         </>
//                                       ) : order.status === "pending pickup" ||
//                                         order.status === "in transit" ||
//                                         order.status === "picked" ||
//                                         order.status === "out for delivery" ||
//                                         order.status ===
//                                           "undelivered assigned" ? (
//                                         <>
//                                           {!(
//                                             isOpenIndividualAssignmnet ===
//                                             order.id
//                                           ) ? (
//                                             order.mapped_with !== null ? (
//                                               <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer">
//                                                 Not Assigned
//                                               </span>
//                                             ) : (
//                                               <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 mb-2 inline-block cursor-pointer">
//                                                 Assigned
//                                               </span>
//                                             )
//                                           ) : (
//                                             <></>
//                                           )}
//                                         </>
//                                       ) : order.status === "cancelled" ? (
//                                         <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
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
//                                 ) : (
//                                   <>
//                                     <td className="px-6 py-4 text-center">
//                                       {order.status === "booked" ||
//                                       order.status === "undelivered" ? (
//                                         <>
//                                           <span
//                                             onClick={() => {
//                                               if (
//                                                 order.status ===
//                                                   "undelivered" &&
//                                                 order.mapped_with !== null
//                                               ) {
//                                                 return;
//                                               }
//                                               if (
//                                                 order.tpc_awb_number !== null
//                                               ) {
//                                                 return;
//                                               }
//                                             }}
//                                             className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer"
//                                           >
//                                             Not Assigned
//                                           </span>
//                                         </>
//                                       ) : order.status === "picked" &&
//                                         order.rider_id == null ? (
//                                         <>
//                                           <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer">
//                                             Not Assignedd
//                                           </span>
//                                         </>
//                                       ) : order.status === "pending pickup" ||
//                                         order.status === "in transit" ||
//                                         order.status === "picked" ||
//                                         order.status ===
//                                           "undelivered assigned" ? (
//                                         <>
//                                           {!(
//                                             isOpenIndividualAssignmnet ===
//                                             order.id
//                                           ) ? (
//                                             order.mapped_with !== null ||
//                                             order.rider_id == null ? (
//                                               <span
//                                                 onClick={() => {
//                                                   if (
//                                                     order.rider_preference ===
//                                                     "self"
//                                                   ) {
//                                                     return;
//                                                   }
//                                                   if (
//                                                     order.status ===
//                                                     "in transit"
//                                                   ) {
//                                                     return;
//                                                   }
//                                                   if (
//                                                     order.tpc_awb_number !==
//                                                     null
//                                                   ) {
//                                                     return;
//                                                   }
//                                                   if (order.rider_id == null) {
//                                                     return;
//                                                   }

//                                                   setIsOpenIndividualAssignmnet(
//                                                     order.id,
//                                                   );
//                                                 }}
//                                                 className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer"
//                                               >
//                                                 Not Assigned
//                                               </span>
//                                             ) : (
//                                               <span
//                                                 onClick={() => {
//                                                   if (
//                                                     order.rider_preference ===
//                                                     "self"
//                                                   ) {
//                                                     return;
//                                                   }
//                                                   if (
//                                                     order.status ===
//                                                     "in transit"
//                                                   ) {
//                                                     return;
//                                                   }
//                                                   if (
//                                                     order.tpc_awb_number !==
//                                                     null
//                                                   ) {
//                                                     return;
//                                                   }
//                                                   setIsOpenIndividualAssignmnet(
//                                                     order.id,
//                                                   );
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
//                                                 setIsOpenIndividualAssignmnet(
//                                                   "",
//                                                 );
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
//                                                   setIsOpenIndividualAssignmnet(
//                                                     "",
//                                                   )
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
//                                         <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                           Assignment Completed
//                                         </span>
//                                       ) : order.status === "rto in transit" ? (
//                                         <>
//                                           <span className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer">
//                                             Not Assigned
//                                           </span>
//                                         </>
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
//                                 )} */}

//                             {/* Map */}
//                              {/* {selectedStatus === "All" ? (
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
//                                       ) : order.mapped_with !== null ? (
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
//                                             isOpenIndividualVendorAssignmnet ===
//                                             order.id
//                                           ) ? (
//                                             <span
//                                               onClick={() => {
//                                                 if (
//                                                   order.tpc_awb_number !== null
//                                                 ) {
//                                                   return;
//                                                 }
//                                                 fetchVendor(order.id);
//                                                 if (
//                                                   order.rider_preference ===
//                                                   "daakit"
//                                                 ) {
//                                                   setIsOpenIndividualVendorAssignmnet(
//                                                     order.id,
//                                                   );
//                                                   setIsOpenIndividualAssignmnet(
//                                                     "",
//                                                   );
//                                                 }
//                                               }}
//                                               className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer"
//                                             >
//                                               Not Mapped
//                                             </span>
//                                           ) : (
//                                             <form
//                                               onSubmit={(e) => {
//                                                 e.preventDefault();
//                                                 const selectedVendor =
//                                                   assignmentState;
//                                                 if (!selectedVendor) {
//                                                   toast.warn(
//                                                     "Please select a vendor",
//                                                   );
//                                                   return;
//                                                 }
//                                                 assignVendor(
//                                                   order.id,
//                                                   selectedVendor,
//                                                 );
//                                                 setIsOpenIndividualAssignmnet(
//                                                   "",
//                                                 );
//                                               }}
//                                               className="flex items-center gap-2"
//                                             >
//                                               <select
//                                                 value={assignmentState}
//                                                 onChange={(e) =>
//                                                   setAssignmentState(
//                                                     e.target.value,
//                                                   )
//                                                 }
//                                                 className="border px-2 py-1 rounded-md"
//                                                 required
//                                               >
//                                                 <option value="" disabled>
//                                                   Select Vendor
//                                                 </option>
//                                                 {vendor.map((vendor) => (
//                                                   <option
//                                                     key={vendor.vendor_id}
//                                                     value={vendor.vendor_id}
//                                                   >
//                                                     {vendor.vendor_id} :{" "}
//                                                     {vendor.vendor_name}
//                                                   </option>
//                                                 ))}
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
//                                                   setIsOpenIndividualVendorAssignmnet(
//                                                     "",
//                                                   )
//                                                 }
//                                               >
//                                                 Close
//                                               </button>
//                                             </form>
//                                           )}
//                                         </>
//                                       ) : order.status === "pending pickup" ||
//                                         order.status === "out for delivery" ||
//                                         order.status ===
//                                           "undelivered assigned" ? (
//                                         <>
//                                           {!(
//                                             isOpenIndividualAssignmnetMap ===
//                                             order.id
//                                           ) ? (
//                                             order.mapped_with !== null ? (
//                                               <span
//                                                 onClick={() => {
//                                                   if (
//                                                     order.status ===
//                                                       "out for delivery" ||
//                                                     order.status ===
//                                                       "undelivered assigned"
//                                                   ) {
//                                                     return;
//                                                   }

//                                                   setIsOpenIndividualAssignmnetMap(
//                                                     order.id,
//                                                   );
//                                                 }}
//                                                 className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 mb-2 inline-block cursor-pointer"
//                                               >
//                                                 Mapped
//                                               </span>
//                                             ) : order.mapped_with == null ? (
//                                               <>
//                                                 <AlertDialog>
//                                                   <AlertDialogTrigger asChild>
//                                                     <Button
//                                                       type="button"
//                                                       onClick={() => {
//                                                         const order_ids = [
//                                                           order.id,
//                                                         ];

//                                                         setFetchBulkAssignmentVendor(
//                                                           true,
//                                                         );
//                                                         fetchVendor(order_ids);
//                                                       }}
//                                                       className="cursor-pointer rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600 transition-colors hover:bg-green-200"
//                                                     >
//                                                       Map Vendor
//                                                     </Button>
//                                                   </AlertDialogTrigger>

//                                                   <AlertDialogContent className="!max-w-md overflow-hidden rounded-md border border-gray-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                                                   
//                                                     <AlertDialogHeader className="border-b border-gray-100 px-5 py-4 text-left dark:border-neutral-800">
//                                                       <AlertDialogTitle className="text-base font-semibold text-gray-900 dark:text-white">
//                                                         Map Orders to Vendor
//                                                       </AlertDialogTitle>

//                                                       <AlertDialogDescription className="mt-1 text-sm text-gray-500 dark:text-neutral-400"></AlertDialogDescription>
//                                                     </AlertDialogHeader>

                                                
//                                                     <div className="px-5 py-5">
//                                                       <label className="mb-2 block text-xs font-semibold text-gray-700 dark:text-neutral-300">
//                                                         Select Vendor
//                                                       </label>

//                                                       <select
//                                                         value={assignmentState}
//                                                         onChange={(e) =>
//                                                           setAssignmentState(
//                                                             e.target.value,
//                                                           )
//                                                         }
//                                                         className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:focus:ring-blue-500/10"
//                                                       >
//                                                         <option value="">
//                                                           Select Vendor
//                                                         </option>

//                                                         {vendor?.map(
//                                                           (vendorItem) => (
//                                                             <option
//                                                               key={
//                                                                 vendorItem.vendor_id
//                                                               }
//                                                               value={
//                                                                 vendorItem.vendor_id
//                                                               }
//                                                             >
//                                                               {
//                                                                 vendorItem.vendor_id
//                                                               }{" "}
//                                                               :{" "}
//                                                               {
//                                                                 vendorItem.vendor_name
//                                                               }
//                                                             </option>
//                                                           ),
//                                                         )}
//                                                       </select>

//                                                       {fetchBulkAssignmentVendor &&
//                                                         vendor?.length ===
//                                                           0 && (
//                                                           <p className="mt-2 text-xs text-gray-500 dark:text-neutral-400">
//                                                             Loading available
//                                                             vendors...
//                                                           </p>
//                                                         )}
//                                                     </div>

                                                  
//                                                     <AlertDialogFooter className="border-t border-gray-100 bg-gray-50/70 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-950/30">
//                                                       <AlertDialogCancel className=" cursor-pointer rounded-md">
//                                                         Cancel
//                                                       </AlertDialogCancel>

//                                                       <Button
//                                                         type="button"
//                                                         onClick={async () => {
//                                                           if (
//                                                             !assignmentState
//                                                           ) {
//                                                             toast.warn(
//                                                               "Please select a vendor",
//                                                             );
//                                                             return;
//                                                           }

//                                                           const order_ids = [
//                                                             order.id,
//                                                           ];

//                                                           await assignVendor(
//                                                             order_ids,
//                                                             assignmentState,
//                                                           );

//                                                           setSelectedBulkOrders(
//                                                             [],
//                                                           );
//                                                           setBulkOrderWeight(0);
//                                                           setFetchBulkAssignmentVendor(
//                                                             false,
//                                                           );
//                                                           setAssignmentState(
//                                                             "",
//                                                           );
//                                                         }}
//                                                         className=" cursor-pointer rounded-md bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-[#0339b5]"
//                                                       >
//                                                         Map Vendors
//                                                       </Button>
//                                                     </AlertDialogFooter>
//                                                   </AlertDialogContent>
//                                                 </AlertDialog>
//                                               </>
//                                             ) : (
//                                               <>
//                                                 <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium  bg-red-100 text-red-600 mb-2 inline-block cursor-pointer">
//                                                   Not Mapped
//                                                 </span>
//                                               </>
//                                             )
//                                           ) : (
//                                             <form
//                                               onSubmit={(e) => {
//                                                 e.preventDefault();
//                                                 cancelVendorAssignment(
//                                                   order.id,
//                                                 );
//                                                 setIsOpenIndividualAssignmnet(
//                                                   "",
//                                                 );
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
//                                                   setIsOpenIndividualAssignmnetMap(
//                                                     "",
//                                                   )
//                                                 }
//                                               >
//                                                 Close
//                                               </button>
//                                             </form>
//                                           )}
//                                         </>
//                                       ) : order.status === "picked" &&
//                                         order?.mapped_with === null ? (
//                                         <>
//                                           <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
//                                             Not Mapped
//                                           </span>
//                                         </>
//                                       ) : order.status === "cancelled" ? (
//                                         <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
//                                           Order Canceled
//                                         </span>
//                                       ) : order.status === "undelivered" ? (
//                                         <>
//                                           {checkVendorMapping !== null &&
//                                           !checkVendorMapping?.canChangeMapping &&
//                                           isOpenIndividualVendorMap ===
//                                             order.id ? (
//                                             <>
//                                               <form
//                                                 onSubmit={(e) => {
//                                                   e.preventDefault();
//                                                   revokeVendorMapping(order.id);
//                                                 }}
//                                                 className="flex items-center gap-2"
//                                               >
//                                                 <button
//                                                   type="submit"
//                                                   className="bg-[#0446DB] whitespace-nowrap text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
//                                                 >
//                                                   Revoke Vendor Mapping
//                                                 </button>
//                                                 <button
//                                                   type="button"
//                                                   className="text-xs bg-red-500/20 px-2 py-1 rounded text-red-500 text-gray-500 hover:underline"
//                                                   onClick={() => {
//                                                     setCheckVendorMapping({
//                                                       canChangeMapping: true,
//                                                       currentAction: "grant",
//                                                     });
//                                                     setIsOpenIndividualVendorMap(
//                                                       "",
//                                                     );
//                                                   }}
//                                                 >
//                                                   Close
//                                                 </button>
//                                               </form>
//                                             </>
//                                           ) : isOpenIndividualVendorMap ===
//                                             order.id ? (
//                                             <>
//                                               <form
//                                                 onSubmit={(e) => {
//                                                   e.preventDefault();
//                                                   const selectedVendor =
//                                                     assignmentState;
//                                                   if (!selectedVendor) {
//                                                     toast.warn(
//                                                       "Please select a vendor",
//                                                     );
//                                                     return;
//                                                   }
//                                                   changeVendorMapping(
//                                                     order.id,
//                                                     selectedVendor,
//                                                   );
//                                                   setIsOpenIndividualVendorMap(
//                                                     "",
//                                                   );
//                                                 }}
//                                                 className="flex items-center gap-2"
//                                               >
//                                                 <select
//                                                   value={assignmentState}
//                                                   onChange={(e) =>
//                                                     setAssignmentState(
//                                                       e.target.value,
//                                                     )
//                                                   }
//                                                   className="border px-2 py-1 rounded-md"
//                                                   required
//                                                 >
//                                                   <option value="" disabled>
//                                                     Select Vendor
//                                                   </option>
//                                                   {vendor.map((vendor) => (
//                                                     <option
//                                                       key={vendor.vendor_id}
//                                                       value={vendor.vendor_id}
//                                                     >
//                                                       {vendor.vendor_id} :{" "}
//                                                       {vendor.vendor_name}
//                                                     </option>
//                                                   ))}
//                                                 </select>
//                                                 <button
//                                                   type="submit"
//                                                   className="bg-[#0446DB] whitespace-nowrap text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
//                                                 >
//                                                   Change Mapping
//                                                 </button>
//                                                 <button
//                                                   type="button"
//                                                   className="text-xs text-gray-500 hover:underline"
//                                                   onClick={() =>
//                                                     setIsOpenIndividualVendorMap(
//                                                       "",
//                                                     )
//                                                   }
//                                                 >
//                                                   Close
//                                                 </button>
//                                               </form>
//                                             </>
//                                           ) : (
//                                             <span
//                                               onClick={() => {
//                                                 if (
//                                                   order.status === "undelivered"
//                                                 ) {
//                                                   checkVendorMappingStatus(
//                                                     order.id,
//                                                   );
//                                                   fetchVendor(order.id);
                                                 
//                                                   setIsOpenIndividualVendorMap(
//                                                     order.id,
//                                                   );
                                                
//                                                 }
//                                               }}
//                                               className="px-3 py-1 cursor-pointer rounded-full text-xs font-medium bg-green-100 text-green-600"
//                                             >
//                                               Mapped
//                                             </span>
//                                           )}
//                                         </>
//                                       ) : order.status === "delivered" ||
//                                         order.status === "undelivered" ||
//                                         order.status === "rto in transit" ? (
//                                         <>
//                                           {order.mapped_with === null ? (
//                                             <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
//                                               Not Mapped
//                                             </span>
//                                           ) : isOpenIndividualVendorMap ===
//                                             order.id ? (
//                                             <>
//                                               <form
//                                                 onSubmit={(e) => {
//                                                   e.preventDefault();
//                                                   const selectedVendor =
//                                                     assignmentState;
//                                                   if (!selectedVendor) {
//                                                     toast.warn(
//                                                       "Please select a vendor",
//                                                     );
//                                                     return;
//                                                   }
//                                                   changeVendorMapping(
//                                                     order.id,
//                                                     selectedVendor,
//                                                   );
//                                                   setIsOpenIndividualVendorMap(
//                                                     "",
//                                                   );
//                                                 }}
//                                                 className="flex items-center gap-2"
//                                               >
//                                                 <select
//                                                   value={assignmentState}
//                                                   onChange={(e) =>
//                                                     setAssignmentState(
//                                                       e.target.value,
//                                                     )
//                                                   }
//                                                   className="border px-2 py-1 rounded-md"
//                                                   required
//                                                 >
//                                                   <option value="" disabled>
//                                                     Select Vendor
//                                                   </option>
//                                                   {vendor.map((vendor) => (
//                                                     <option
//                                                       key={vendor.vendor_id}
//                                                       value={vendor.vendor_id}
//                                                     >
//                                                       {vendor.vendor_id} :{" "}
//                                                       {vendor.vendor_name}
//                                                     </option>
//                                                   ))}
//                                                 </select>
//                                                 <button
//                                                   type="submit"
//                                                   className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
//                                                 >
//                                                   Assign
//                                                 </button>
//                                                 <button
//                                                   type="button"
//                                                   className="text-xs text-gray-500 hover:underline"
//                                                   onClick={() =>
//                                                     setIsOpenIndividualVendorMap(
//                                                       "",
//                                                     )
//                                                   }
//                                                 >
//                                                   Close
//                                                 </button>
//                                               </form>
//                                             </>
//                                           ) : (
//                                             <span
//                                               onClick={() => {
//                                                 if (
//                                                   order.status === "undelivered"
//                                                 ) {
//                                                   fetchVendor(order.id);
//                                                   setIsOpenIndividualVendorMap(
//                                                     order.id,
//                                                   );
//                                                   setIsOpenIndividualAssignmnetMap(
//                                                     "",
//                                                   );
//                                                 }
//                                               }}
//                                               className="px-3 py-1 cursor-pointer rounded-full text-xs font-medium bg-green-100 text-green-600"
//                                             >
//                                               Mapped
//                                             </span>
//                                           )}
//                                         </>
//                                       ) : order.status === "rto delivered" ? (
//                                         <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                           Return To Origin
//                                         </span>
//                                       ) : order.mapped_with !== null ? (
//                                         <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                           Mapped
//                                         </span>
//                                       ) : order.status === "in transit" ? (
//                                         <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-red-100 text-red-600">
//                                           Not Mapped
//                                         </span>
//                                       ) : (
//                                         <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                           Assigned
//                                         </span>
//                                       )}
//                                     </td>
//                                   </>
//                                 )}  */}

//                             {/* Status */}
//                             {selectedStatus === "All" ? (
//                               <>
//                                 {/* only view ststus */}
//                                 <td className=" py-2 text-center">
//                                   {order.status === "cancelled" ||
//                                   order.status === "undelivered" ||
//                                   order.status === "delivered" ||
//                                   order.status === "ndr" ||
//                                   order.status === "rto delivered" ? (
//                                     <span
//                                       className={`px-3 py-1 rounded-full whitespace-nowrap text-xs font-semibold inline-block ${
//                                         order.status === "cancelled"
//                                           ? "bg-red-100 text-red-600"
//                                           : order.status === "undelivered"
//                                             ? "bg-red-100 text-green-600"
//                                             : order.status === "delivered"
//                                               ? "bg-green-100 text-green-600"
//                                               : "bg-yellow-100 text-yellow-600"
//                                       } `}
//                                     >
//                                       {order.status === "rto delivered"
//                                         ? "RTO Delivered"
//                                         : order.status === "ndr"
//                                           ? "NDR"
//                                           : toCapitalizeEachWord(order.status)}
//                                     </span>
//                                   ) : (
//                                     <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-semibold inline-block bg-blue-100 text-blue-600">
//                                       {order.status === "rto in transit"
//                                         ? "RTO In Transit"
//                                         : toCapitalizeEachWord(order.status)}
//                                     </span>
//                                   )}
//                                 </td>
//                               </>
//                             ) : (
//                               <>
//                                 <td className=" py-2 text-left">
//                                   {order.status === "cancelled" ||
//                                   // order.status === "undelivered" ||
//                                   order.status === "delivered" ||
//                                   order.status === "ndr" ||
//                                   order.status === "rto delivered" ? (
//                                     <span
//                                       className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
//                                         order.status === "cancelled"
//                                           ? "bg-red-100 text-red-600"
//                                           : order.status === "undelivered"
//                                             ? "bg-red-100 text-green-600"
//                                             : order.status === "delivered"
//                                               ? "bg-green-100 text-green-600"
//                                               : "bg-yellow-100 text-yellow-600"
//                                       } `}
//                                     >
//                                       {order.status === "rto delivered"
//                                         ? "RTO Delivered"
//                                         : order.status === "ndr"
//                                           ? "NDR"
//                                           : toCapitalizeEachWord(order.status)}
//                                     </span>
//                                   ) : (
//                                     <>
//                                       {editingStatusId === order.id ? (
//                                         <form
//                                           onSubmit={async (e) => {
//                                             e.preventDefault();

//                                             const newStatus =
//                                               e.target.elements.status.value;

//                                             if (
//                                               selectedStatus ===
//                                                 "rto in transit" &&
//                                               newStatus == "rto delivered"
//                                             ) {
//                                               await rtoDelivered([order.id]);
//                                               return;
//                                             }

//                                             if (
//                                               newStatus ==
//                                               "cancel rider assignment"
//                                             ) {
//                                               cancelRiderAssignments([
//                                                 order.id,
//                                               ]);
//                                             }

//                                             await changeOrderStatus({
//                                               order_ids: [order.id],
//                                               newStatus,
//                                             });
//                                           }}
//                                         >
//                                           <div className="flex items-center gap-2">
//                                             <select
//                                               name="status"
//                                               defaultValue={order.status}
//                                               onChange={(e) => {
//                                                 setAssignmentState(
//                                                   e.target.value,
//                                                 );
//                                               }}
//                                               className="text-xs border border-gray-300 rounded-md px-2 py-1"
//                                               required
//                                             >
//                                               <option value="">
//                                                 Change Status
//                                               </option>
//                                               {order.status === "booked" && (
//                                                 <>
//                                                   <option value="cancelled">
//                                                     Cancelled
//                                                   </option>
//                                                 </>
//                                               )}
//                                               {order.status === "picked" && (
//                                                 <>
//                                                   <option value="in transit">
//                                                     In Transit
//                                                   </option>
//                                                 </>
//                                               )}
//                                               {order.status ===
//                                                 "undelivered" && (
//                                                 <>
//                                                   <option value="undelivered assigned">
//                                                     Undelivered Assigned
//                                                   </option>
//                                                   <option value="lost">
//                                                     Lost
//                                                   </option>
//                                                 </>
//                                               )}
//                                               {order.status ===
//                                                 "pending pickup" && (
//                                                 <>
//                                                   <option value="in transit">
//                                                     In Transit
//                                                   </option>
//                                                   <option value="cancelled">
//                                                     Cancelled
//                                                   </option>
//                                                 </>
//                                               )}
//                                               {order.status ===
//                                                 "in transit" && (
//                                                 <>
//                                                   <option value="out for delivery">
//                                                     Mark Out For Delivery
//                                                   </option>
//                                                   <option value="lost">
//                                                     Mark Lost
//                                                   </option>
//                                                 </>
//                                               )}
//                                               {order.status ===
//                                                 "out for delivery" && (
//                                                 <>
//                                                   <option value="delivered">
//                                                     Delivered
//                                                   </option>
//                                                   <option value="ndr">
//                                                     NDR
//                                                   </option>
//                                                   <option value="lost">
//                                                     Lost
//                                                   </option>
//                                                 </>
//                                               )}

//                                               {order.status ==
//                                                 "rto out for delivery" && (
//                                                 <>
//                                                   <option value="rto delivered">
//                                                     RTO Delivered
//                                                   </option>
//                                                   <option value="ndr">
//                                                     NDR
//                                                   </option>
//                                                 </>
//                                               )}
//                                               {order.status ===
//                                                 "rto in transit" && (
//                                                 <>
//                                                   {/* <option value="rto delivered">
//                                                         RTO Delivered
//                                                       </option> */}
//                                                   <option value="rto out for delivery">
//                                                     RTO Out For Delivery
//                                                   </option>
//                                                   <option value="lost">
//                                                     Lost
//                                                   </option>
//                                                 </>
//                                               )}
//                                               {order.status ===
//                                                 "rto undelivered" && (
//                                                 <>
//                                                   <option value="rto out for delivery">
//                                                     RTO Out For Delivery
//                                                   </option>

//                                                   <option value="lost">
//                                                     Lost
//                                                   </option>
//                                                 </>
//                                               )}
//                                               {order.status ===
//                                                 "undelivered assigned" && (
//                                                 <>
//                                                   <option value="out for delivery">
//                                                     Mark Out For Delivery
//                                                   </option>
//                                                   <option value="cancel rider assignment">
//                                                     Cancel Rider Assignemnt
//                                                   </option>
//                                                   <option value="lost">
//                                                     Mark Lost
//                                                   </option>
//                                                 </>
//                                               )}
//                                             </select>
//                                             {assignmentState == "ndr" && (
//                                               <>
//                                                 <Dialog className="w-5xl">
//                                                   <DialogTrigger asChild>
//                                                     <Button
//                                                       variant="outline"
//                                                       className="text-sm font-medium rounded-sm border py-0.5 bg-[#0446DB] hover:text-[#FFF] text-white border-[#0446DB]  hover:bg-[#0446DB] inline-block cursor-pointer"
//                                                     >
//                                                       <span>Mark as NDR</span>
//                                                     </Button>
//                                                   </DialogTrigger>
//                                                   <DialogContent className="">
//                                                     <DialogHeader>
//                                                       <DialogTitle>
//                                                         NDR
//                                                       </DialogTitle>
//                                                     </DialogHeader>

//                                                     <div>
//                                                       <label
//                                                         htmlFor="delivery_reason"
//                                                         className="block mb-1 mt-2"
//                                                       >
//                                                         Undelivered Reason
//                                                       </label>
//                                                       <select
//                                                         name="delivery_reason"
//                                                         id="delivery_reason"
//                                                         onChange={(e) => {
//                                                           setRemarks(
//                                                             e.target.value,
//                                                           );
//                                                           setRescheduleDate("");
//                                                           setSub_remarks("");
//                                                         }}
//                                                         className=" border w-full py-2 px-2 rounded"
//                                                       >
//                                                         <option value="">
//                                                           -- Select Reason --
//                                                         </option>
//                                                         {assignmentState ==
//                                                           "ndr" &&
//                                                           selectedStatus ==
//                                                             "out for delivery" && (
//                                                             <>
//                                                               <option value="Address Incorrect / Incomplete">
//                                                                 Address
//                                                                 Incorrect /
//                                                                 Incomplete
//                                                               </option>
//                                                               <option value="Customer Requested Reschedule">
//                                                                 Customer
//                                                                 Requested
//                                                                 Reschedule
//                                                               </option>
//                                                               <option value="Customer Refused / Cancelled">
//                                                                 Customer Refused
//                                                                 / Cancelled
//                                                               </option>
//                                                               <option value="Delivery Attempted – Not Reachable">
//                                                                 Delivery
//                                                                 Attempted – Not
//                                                                 Reachable
//                                                               </option>
//                                                               <option value="Delivery Attempted – No Response">
//                                                                 Delivery
//                                                                 Attempted – No
//                                                                 Response
//                                                               </option>
//                                                               <option value="Wrong Pincode / Address">
//                                                                 Wrong Pincode /
//                                                                 Address
//                                                               </option>
//                                                               <option value="Wrong Contact Details">
//                                                                 Wrong Contact
//                                                                 Details
//                                                               </option>
//                                                               <option value="Vehicle / Weather / Road Issue">
//                                                                 Vehicle /
//                                                                 Weather / Road
//                                                                 Issue
//                                                               </option>
//                                                               <option value="Package Damaged">
//                                                                 Package Damaged
//                                                               </option>
//                                                             </>
//                                                           )}

//                                                         {selectedStatus ==
//                                                           "rto out for delivery" && (
//                                                           <>
//                                                             {[
//                                                               {
//                                                                 label:
//                                                                   "Origin Unavailable",
//                                                               },
//                                                               {
//                                                                 label:
//                                                                   "Origin Closed",
//                                                               },
//                                                               {
//                                                                 label:
//                                                                   "Origin Refused",
//                                                               },
//                                                               {
//                                                                 label:
//                                                                   "Contact Person Unavailable",
//                                                               },
//                                                               {
//                                                                 label:
//                                                                   "Origin Not Reachable",
//                                                               },
//                                                               {
//                                                                 label:
//                                                                   "Address Not Found",
//                                                               },
//                                                               {
//                                                                 label:
//                                                                   "Delivery Attempt Failed",
//                                                               },
//                                                               {
//                                                                 label: "Other",
//                                                               },
//                                                             ].map((e) => (
//                                                               <option
//                                                                 key={e.label}
//                                                                 value={e.label}
//                                                               >
//                                                                 {e.label}
//                                                               </option>
//                                                             ))}
//                                                             gjhgjhgjhg
//                                                           </>
//                                                         )}
//                                                       </select>

//                                                       {remarks ==
//                                                         "Customer Requested Reschedule" && (
//                                                         <>
//                                                           <div>
//                                                             <label
//                                                               htmlFor=""
//                                                               className="block mb-1 mt-2"
//                                                             >
//                                                               Reschedule Date
//                                                             </label>
//                                                             <input
//                                                               type="date"
//                                                               value={
//                                                                 rescheduleDate
//                                                               }
//                                                               onClick={(e) =>
//                                                                 e.target.showPicker?.()
//                                                               }
//                                                               onChange={(e) =>
//                                                                 setRescheduleDate(
//                                                                   e.target
//                                                                     .value,
//                                                                 )
//                                                               }
//                                                               className=" border w-full py-2 px-2 rounded"
//                                                             />
//                                                           </div>
//                                                         </>
//                                                       )}
//                                                       {remarks ==
//                                                         "Customer Requested Reschedule" && (
//                                                         <>
//                                                           <label
//                                                             htmlFor=""
//                                                             className="block mb-1 mt-2 "
//                                                           >
//                                                             Sub Remark
//                                                           </label>
//                                                           <select
//                                                             onChange={(e) => {
//                                                               setSub_remarks(
//                                                                 e.target.value,
//                                                               );
//                                                             }}
//                                                             className="border w-full py-2 px-2 rounded"
//                                                           >
//                                                             <option value="">
//                                                               -- Select Reason
//                                                               --
//                                                             </option>
//                                                             <option value="Unavailable at Location">
//                                                               Unavailable at
//                                                               Location
//                                                             </option>
//                                                             <option value="Out of Station">
//                                                               Out of Station
//                                                             </option>
//                                                             <option value="COD Amount Not Ready">
//                                                               COD Amount Not
//                                                               Ready
//                                                             </option>
//                                                             <option value="Require Different Time Slot">
//                                                               Require Different
//                                                               Time Slot
//                                                             </option>
//                                                             <option value="Other">
//                                                               Other
//                                                             </option>
//                                                           </select>
//                                                         </>
//                                                       )}
//                                                       {remarks ==
//                                                         "Customer Refused / Cancelled" && (
//                                                         <>
//                                                           <label
//                                                             htmlFor=""
//                                                             className="block mb-1 mt-2 "
//                                                           >
//                                                             Sub Remark
//                                                           </label>
//                                                           <select
//                                                             onChange={(e) => {
//                                                               setSub_remarks(
//                                                                 e.target.value,
//                                                               );
//                                                             }}
//                                                             className="border w-full py-2 px-2 rounded"
//                                                           >
//                                                             <option value="">
//                                                               -- Select Reason
//                                                               --
//                                                             </option>
//                                                             <option value="Duplicate Order">
//                                                               Duplicate Order
//                                                             </option>
//                                                             <option value="Order Placed by Mistake">
//                                                               Order Placed by
//                                                               Mistake
//                                                             </option>
//                                                             <option value="COD Amount Not Ready">
//                                                               COD Amount Not
//                                                               Ready
//                                                             </option>
//                                                             <option value="Better Price Elsewhere">
//                                                               Better Price
//                                                               Elsewhere
//                                                             </option>
//                                                             <option value="Other">
//                                                               Other
//                                                             </option>
//                                                           </select>
//                                                         </>
//                                                       )}

//                                                       <div>
//                                                         <label
//                                                           htmlFor="remark"
//                                                           className="block mb-1 mt-2"
//                                                         >
//                                                           Remark (Optional)
//                                                         </label>
//                                                         <input
//                                                           type="text"
//                                                           value={
//                                                             detailed_remarks
//                                                           }
//                                                           placeholder="Enter remark"
//                                                           onChange={(e) =>
//                                                             setdetailed_remarks(
//                                                               e.target.value,
//                                                             )
//                                                           }
//                                                           className=" border w-full py-2 px-2 rounded"
//                                                         />
//                                                       </div>
//                                                     </div>

//                                                     <Button
//                                                       onClick={async () => {
//                                                         // const order_ids = selectedBulkOrders.map((o) => o.id);
//                                                         await changeOrderStatus(
//                                                           {
//                                                             order_ids: [
//                                                               order.id,
//                                                             ],
//                                                             newStatus:
//                                                               order.status ==
//                                                               "rto out for delivery"
//                                                                 ? "rto undelivered"
//                                                                 : assignmentState,
//                                                             remarks: remarks,
//                                                             sub_remarks:
//                                                               sub_remarks,
//                                                             detailed_remarks:
//                                                               detailed_remarks,
//                                                             rescheduled_date:
//                                                               rescheduleDate,
//                                                             rider_id: "",
//                                                           },
//                                                         );
//                                                       }}
//                                                       className={"bg-[#0446DB]"}
//                                                     >
//                                                       Submit
//                                                     </Button>

//                                                     <DialogFooter>
//                                                       <DialogClose asChild>
//                                                         <Button
//                                                           onClick={() => {
//                                                             clearAllState();
//                                                           }}
//                                                           variant="outline"
//                                                         >
//                                                           Cancel
//                                                         </Button>
//                                                       </DialogClose>
//                                                     </DialogFooter>
//                                                   </DialogContent>
//                                                 </Dialog>
//                                               </>
//                                             )}
//                                             {(assignmentState ==
//                                               "undelivered assigned" ||
//                                               assignmentState ==
//                                                 "in transit") && (
//                                               <>
//                                                 <Dialog className="w-5xl">
//                                                   <DialogTrigger asChild>
//                                                     <Button
//                                                       variant="outline"
//                                                       className="text-sm font-medium rounded-sm border  bg-[#0446DB] hover:text-[#FFF] text-white border-[#0446DB]  hover:bg-[#0446DB] inline-block cursor-pointer"
//                                                     >
//                                                       <span>Select Rider</span>
//                                                     </Button>
//                                                   </DialogTrigger>
//                                                   <DialogContent className="">
//                                                     <DialogHeader>
//                                                       <DialogTitle>
//                                                         Select a Rider
//                                                       </DialogTitle>
//                                                     </DialogHeader>

//                                                     <div>
//                                                       <label
//                                                         htmlFor="delivery_reason"
//                                                         className="block mb-1 mt-2"
//                                                       >
//                                                         Select Rider
//                                                       </label>
//                                                       <select
//                                                         name="delivery_reason"
//                                                         id="delivery_reason"
//                                                         onChange={(e) => {
//                                                           setRiderID(
//                                                             e.target.value,
//                                                           );
//                                                         }}
//                                                         className=" border w-full py-2 px-2 rounded"
//                                                       >
//                                                         <option value="">
//                                                           -- Select Rider --
//                                                         </option>
//                                                         {riders.map((rider) => (
//                                                           <option
//                                                             key={rider.id}
//                                                             value={rider.id}
//                                                           >
//                                                             {rider.id} :{" "}
//                                                             {rider.name}
//                                                           </option>
//                                                         ))}
//                                                       </select>
//                                                     </div>
//                                                     <Button
//                                                       onClick={async () => {
//                                                         await changeOrderStatus(
//                                                           {
//                                                             order_ids: [
//                                                               order.id,
//                                                             ],
//                                                             newStatus:
//                                                               assignmentState ==
//                                                               "in transit"
//                                                                 ? "in transit"
//                                                                 : "undelivered assigned",
//                                                             rider_id: riderID,
//                                                           },
//                                                         );
//                                                       }}
//                                                       className={"bg-[#0446DB]"}
//                                                     >
//                                                       Submit
//                                                     </Button>

//                                                     <DialogFooter>
//                                                       <DialogClose asChild>
//                                                         <Button
//                                                           onClick={() => {
//                                                             clearAllState();
//                                                           }}
//                                                           variant="outline"
//                                                         >
//                                                           Cancel
//                                                         </Button>
//                                                       </DialogClose>
//                                                     </DialogFooter>
//                                                   </DialogContent>
//                                                 </Dialog>
//                                               </>
//                                             )}

//                                             {assignmentState &&
//                                               assignmentState !== "ndr" &&
//                                               assignmentState !==
//                                                 "in transit" &&
//                                               assignmentState !==
//                                                 "undelivered assigned" && (
//                                                 <button
//                                                   type="submit"
//                                                   className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
//                                                 >
//                                                   Update
//                                                 </button>
//                                               )}
//                                             <button
//                                               type="button"
//                                               onClick={() => {
//                                                 setEditingStatusId(null);
//                                                 clearAllState();
//                                               }}
//                                               className="text-xs text-gray-500 hover:underline"
//                                             >
//                                               Close
//                                             </button>
//                                           </div>
//                                         </form>
//                                       ) : (
//                                         <>
//                                           <span
//                                             onClick={() => {
//                                               if (
//                                                 order.rider_preference ===
//                                                 "self"
//                                               ) {
//                                                 return;
//                                               }
//                                               if (
//                                                 order.status == "in transit"
//                                               ) {
//                                                 setEditingStatusId(order.id);
//                                                 return;
//                                               }
//                                               if (
//                                                 order.status ==
//                                                 "undelivered assigned"
//                                               ) {
//                                                 setEditingStatusId(order.id);
//                                                 return;
//                                               }
//                                               if (
//                                                 order.status ==
//                                                   "out for delivery" ||
//                                                 order.status ==
//                                                   "rto out for delivery"
//                                               ) {
//                                                 setEditingStatusId(order.id);
//                                                 return;
//                                               }
//                                               if (
//                                                 (order.status ===
//                                                   "undelivered" ||
//                                                   order.status === "picked") &&
//                                                 order.mapped_with &&
//                                                 (order.pickup_stage === null ||
//                                                   order.pickup_stage ===
//                                                     "at_vendor")
//                                               ) {
//                                                 const vendor_ids = [
//                                                   order?.mapped_with,
//                                                 ];
//                                                 fetchRider(vendor_ids);
//                                                 setEditingStatusId(order.id);
//                                                 return;
//                                               }
//                                               if (
//                                                 order.status ===
//                                                   "pending pickup" &&
//                                                 order.tpc_awb_number !== null
//                                               ) {
//                                                 return;
//                                               }
//                                               if (
//                                                 selectedStatus ===
//                                                 "rto in transit"
//                                               ) {
//                                                 setEditingStatusId(order.id);
//                                                 return;
//                                               }

//                                               if (
//                                                 selectedStatus ===
//                                                   "rto in transit" ||
//                                                 selectedStatus ==
//                                                   "rto undelivered"
//                                               ) {
//                                                 setEditingStatusId(order.id);
//                                                 return;
//                                               }
//                                               if (
//                                                 order.tpc_awb_number !== null
//                                               ) {
//                                                 return;
//                                               }
//                                               if (
//                                                 order.rider_preference ===
//                                                 "daakit"
//                                               ) {
//                                                 if (
//                                                   order.mapped_with !== null
//                                                 ) {
//                                                   return;
//                                                 } else if (
//                                                   order.status === "booked"
//                                                 ) {
//                                                   setEditingStatusId(order.id);
//                                                 }
//                                                 // setEditingStatusId(order.id)
//                                               }
//                                             }}
//                                             className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-semibold inline-block bg-blue-100 text-blue-600 cursor-pointer"
//                                           >
//                                             {order.status === "rto in transit"
//                                               ? `RTO In Transit`
//                                               : toCapitalizeEachWord(
//                                                   order.status,
//                                                 )}
//                                           </span>
//                                         </>
//                                       )}
//                                     </>
//                                   )}
//                                 </td>
//                               </>
//                             )}
//                             {/* eligible_vendors */}
//                             {/* {selectedStatus === "booked" && (
//                                   <td className="px-6 py-1 whitespace-pre-line">
                                    
//                                     {order?.tpc_awb_number !== null ? (
//                                       <>
//                                         <p className="font-medium   text-center px-3 whitespace-nowrap py-1 rounded-full ">
//                                           -
//                                         </p>
//                                       </>
//                                     ) : (
//                                       <>
//                                         <p className="font-medium bg-orange-100 text-orange-700 text-center px-3 whitespace-nowrap py-1 rounded-full dark:bg-orange-900 dark:text-orange-200">
//                                           {order?.tpc_awb_number !== null
//                                             ? "-"
//                                             : order?.eligible_vendors
//                                                 ?.split(",")
//                                                 .join(" | ")}
//                                         </p>
//                                       </>
//                                     )}
//                                   </td>
//                                 )} */}

//                             {selectedStatus === "booked" && (
//                               <td className="max-w-[220px] py-2">
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
//                             )}
//                           </tr>
//                         );
//                       })
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {totalPages > 1 && (
//                 <div className="z-10  flex  justify-between shrink-0 border-t border-gray-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
//                   <div className="text-sm text-gray-600">
//                     Page {page} of {totalPages}
//                   </div>
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//                       disabled={page === 1}
//                     >
//                       <ChevronLeft className="h-4 w-4" />
//                       Previous
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() =>
//                         setPage((prev) => Math.min(prev + 1, totalPages))
//                       }
//                       disabled={page === totalPages}
//                     >
//                       Next
//                       <ChevronRight className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Label>Rows per page:</Label>
//                     <select
//                       className="border rounded-md px-2 py-1"
//                       value={limit}
//                       onChange={(e) => {
//                         setLimit(Number(e.target.value));
//                         setPage(1);
//                       }}
//                     >
//                       <option value={10}>10</option>
//                       <option value={20}>20</option>
//                       <option value={50}>50</option>
//                       <option value={100}>100</option>
//                       <option value={200}>200</option>
//                     </select>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Table */}
//           </div>
//         </>
//       )}
//     </>
//   );
// }
// export default OrderDetails;






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

    // Existing function ko selected order IDs ke saath call karo
    await fetchVendor(orderIds);

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
    // "undelivered",
    // "undelivered assigned",
    // "cancelled",
    // "rto in transit",
    // "rto out for delivery",
    // "rto undelivered",
    // "rto delivered",
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

  const fetchVendor = async (order_ids) => {
    if (order_ids.length === 0) {
      return;
    }

    try {
      const res = await axios.get(
        `${baseURL}/api/admin/getEligibleVendorsByOrders?order_id=${order_ids}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setVendor(res.data.data || []);
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
          },
        ),
      );

      const responses = await Promise.all(promises);

      toast.success("Rider assignment cancelled successfully");

      clearAllState();
      fetchOrders();

      return responses.map((res) => res.data);
    } catch (error) {
      console.error("Cancel rider assignment error:", error);

      toast.error(
        error.response?.data?.message || "Failed to cancel rider assignment",
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

        fetchVendor(order_ids);

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

      fetchVendor(order_ids);

      return updated;
    });
  };



  useEffect(() => {
    resetAdvanceFilters();
    getAllVendors();
    getAllMerchant()
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
                   <CustomButton
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
                      </CustomButton>

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
                                    <option value="Turant">Turant</option>
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
                                    Merchant ID
                                  </label>
                                  <select  
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
                                    Vendor ID
                                  </label>

                                  <select 
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
                              <div className="rounded-md border border-gray-200 dark:border-neutral-800">
                                {/* SECTION HEADER */}
                                <div className="border-b border-gray-100 bg-gray-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/50">
                                  <h3 className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                    Change Order Status
                                  </h3>

                                  <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                                    Update the status of all selected orders.
                                  </p>
                                </div>

                                <div className="p-4">
                                  {!canceledBulkOrder ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setcanceledBulkOrder(true);
                                      }}
                                      className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-[#0446DB] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0339b5]"
                                    >
                                      Change Action
                                    </button>
                                  ) : (
                                    <form
                                      className="flex w-full flex-col gap-3 lg:flex-row lg:items-start"
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

                                      <button
                                        type="submit"
                                        className="h-10 w-full shrink-0 cursor-pointer rounded-md bg-[#0446DB] px-5 text-sm font-medium text-white hover:bg-[#0339b5] lg:w-auto"
                                      >
                                        Apply Action
                                      </button>
                                    </form>
                                  )}
                                </div>
                              </div>

                              {/* map dc  */}

                              {true && (
                                <div className="overflow-hidden rounded-sm border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                                  <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-800/40">
                                    <div>
                                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Assign Orders to DC
                                      </h3>

                                      <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                                        Assign all selected orders to a
                                        distribution center.
                                      </p>
                                    </div>

                                    <div className="hidden rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 sm:block dark:bg-blue-500/10 dark:text-blue-400">
                                      Bulk Action
                                    </div>
                                  </div>

                                  <div className="p-5">
                                    {!dcBulkOrder ? (
                                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                          <p className="text-sm font-medium text-gray-700 dark:text-neutral-200">
                                            Select a distribution center
                                          </p>

                                          <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                                            Choose a DC to map the selected
                                            orders.
                                          </p>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => setDcBulkOrder(true)}
                                          className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0446DB] px-5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0339b5] hover:shadow-md active:scale-[0.98]"
                                        >
                                          Assign to DC
                                        </button>
                                      </div>
                                    ) : (
                                      <form
                                        className="space-y-4"
                                        onSubmit={async (e) => {
                                          e.preventDefault();

                                          const dcId = Number(
                                            e.currentTarget.elements.dc_id
                                              .value,
                                          );

                                          if (!dcId) {
                                            toast.error("Please select a DC");
                                            return;
                                          }

                                          const orderIds =
                                            selectedBulkOrders.map(
                                              (order) => order.id,
                                            );

                                          await assignOrdersToDc({
                                            order_ids: orderIds,
                                            dc_id: dcId,
                                          });
                                        }}
                                      >
                                        <div>
                                          <label
                                            htmlFor="dc_id"
                                            className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-neutral-300"
                                          >
                                            Distribution Center
                                          </label>

                                          <div className="relative">
                                            <select
                                              id="dc_id"
                                              name="dc_id"
                                              defaultValue=""
                                              className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-10 text-sm text-gray-700 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:focus:border-blue-500"
                                            >
                                              <option value="" disabled>
                                                Select a distribution center
                                              </option>

                                              {dcList?.map((dc) => (
                                                <option
                                                  key={dc.id}
                                                  value={dc.id}
                                                >
                                                  {dc?.dc_code} : {dc?.dc_name}
                                                </option>
                                              ))}
                                            </select>

                                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                              <svg
                                                className="h-4 w-4 text-gray-400"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                              >
                                                <path
                                                  fillRule="evenodd"
                                                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                  clipRule="evenodd"
                                                />
                                              </svg>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end dark:border-neutral-800">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setDcBulkOrder(false)
                                            }
                                            className="h-10 cursor-pointer rounded-sm border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                          >
                                            Cancel
                                          </button>

                                          <button
                                            type="submit"
                                            className="h-10 cursor-pointer rounded-sm bg-[#0446DB] px-6 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0339b5] hover:shadow-md active:scale-[0.98]"
                                          >
                                            Assign Orders
                                          </button>
                                        </div>
                                      </form>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* ============================================
                                                    VENDOR ASSIGNMENT
                                                ============================================ */}
                              {/* ================= VENDOR ASSIGNMENT ================= */}
                              <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
                                {/* Header */}
                                <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
                                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                    Vendor Assignment
                                  </h3>

                                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                    Find an available vendor and assign the
                                    selected orders.
                                  </p>
                                </div>

                                <div className="p-4">
                                  {!fetchBulkAssignmentVendor ? (
                                    /* ================= GET AVAILABLE VENDOR ================= */
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
                                          setFetchBulkAssignmentVendor(true);

                                          const order_ids = [
                                            ...new Set(
                                              selectedBulkOrders.map(
                                                (order) => order.id,
                                              ),
                                            ),
                                          ];

                                          fetchVendor(order_ids);
                                        }}
                                        className="h-9 cursor-pointer whitespace-nowrap rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white transition hover:bg-indigo-800"
                                      >
                                        Get Available Vendor
                                      </button>
                                    </div>
                                  ) : vendor?.length > 0 ? (
                                    /* ================= VENDOR FOUND ================= */
                                    <div className="space-y-4">
                                      <div>
                                        <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                          Select Vendor
                                        </label>

                                        <select
                                          value={assignmentState}
                                          onChange={(e) =>
                                            setAssignmentState(e.target.value)
                                          }
                                          className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
                                        >
                                          <option value="">
                                            Select Vendor for Bulk Assignment
                                          </option>

                                          {vendor?.map((vendorItem) => (
                                            <option
                                              key={vendorItem?.vendor_id}
                                              value={vendorItem?.vendor_id}
                                            >
                                              {vendorItem?.vendor_id} :{" "}
                                              {vendorItem?.vendor_name}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      {/* Selected Orders Info */}
                                      <div className="flex items-center justify-between rounded-sm border border-blue-100 bg-blue-50/50 px-3 py-2.5 dark:border-blue-500/20 dark:bg-blue-500/5">
                                        <div>
                                          <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                            Selected Orders
                                          </p>

                                          <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                                            Selected vendor will be assigned to
                                            all orders.
                                          </p>
                                        </div>

                                        <span className="rounded-full bg-[#0446DB]/10 px-2.5 py-1 text-xs font-semibold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                                          {selectedBulkOrders?.length || 0}
                                        </span>
                                      </div>

                                      {/* Action */}
                                      <div className="flex justify-end border-t border-neutral-100 pt-4 dark:border-neutral-800">
                                        <button
                                          type="button"
                                          disabled={!assignmentState}
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
                                            setFetchBulkAssignmentVendor(false);
                                          }}
                                          className="h-9 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500"
                                        >
                                          Bulk Assign
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    /* ================= NO VENDOR ================= */
                                    <div className="rounded-sm border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
                                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                                        No Vendor Available
                                      </p>

                                      <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                                        No eligible vendor was found for the
                                        selected orders.
                                      </p>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setFetchBulkAssignmentVendor(false);
                                          setAssignmentState("");
                                          setVendor([]);
                                        }}
                                        className="mt-3 h-8 cursor-pointer rounded-sm border border-amber-300 bg-white px-3 text-xs font-medium text-amber-700 transition hover:bg-amber-100 dark:border-amber-500/30 dark:bg-neutral-900 dark:text-amber-400"
                                      >
                                        Try Again
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* ================= GENERATE BULK PICKUP REQUEST ================= */}
                              <div className="overflow-hidden rounded-sm border border-emerald-200 dark:border-emerald-500/20">
                                {/* Header */}
                                <div className="border-b border-emerald-100 bg-emerald-50/70 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                    Schedule Self Pickup
                                  </h3>

                                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                    Schedule self-assignment for all selected
                                    orders.
                                  </p>
                                </div>

                                {/* Content */}
                                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                                  {/* Info */}
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

                                  {/* Button */}
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
                UNMAPPED ORDERS - VENDOR ASSIGNMENT
            ================================================= */}
                                {selectedMapType === "unmapped" && (
                                  <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
                                    {/* HEADER */}
                                    <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
                                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                        Vendor Assignment
                                      </h3>

                                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                        Find an available vendor and assign the
                                        selected orders.
                                      </p>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="p-4">
                                      {selectedBulkOrders.length > 0 &&
                                      !fetchBulkAssignmentVendor ? (
                                        <button
                                          onClick={() => {
                                            setFetchBulkAssignmentVendor(true);

                                            const order_ids = [
                                              ...new Set(
                                                selectedBulkOrders.map(
                                                  (o) => o.id,
                                                ),
                                              ),
                                            ];

                                            fetchVendor(order_ids);
                                          }}
                                          className="h-10 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5]"
                                        >
                                          Get Available Vendor
                                        </button>
                                      ) : (
                                        <>
                                          {vendor?.length > 0 && (
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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

                                              {assignmentState && (
                                                <button
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

                                                    const result =
                                                      await assignBulkOrderVendor(
                                                        order_ids,
                                                        assignmentState,
                                                      );

                                                    setSelectedBulkOrders([]);
                                                    setBulkOrderWeight(0);
                                                    setFetchBulkAssignmentVendor(
                                                      false,
                                                    );
                                                    setSelectedMapType(null);
                                                    setAssignmentState("");
                                                  }}
                                                  className="h-10 shrink-0 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5]"
                                                >
                                                  Bulk Assign Orders to Vendor
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
                RIDER ASSIGNMENT
            ================================================= */}
                                {((selectedStatus === "picked" &&
                                  canMarkInTransit) ||
                                  (selectedStatus === "undelivered" &&
                                    canAssignUndelivered)) && (
                                  <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
                                    {/* HEADER */}
                                    <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
                                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                        Rider Assignment
                                      </h3>

                                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                        Find an available rider and assign the
                                        selected orders.
                                      </p>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="p-4">
                                      {selectedBulkOrders.length > 0 &&
                                      riders.length === 0 ? (
                                        <button
                                          onClick={() => {
                                            const vendor_ids = [
                                              ...new Set(
                                                selectedBulkOrders.map(
                                                  (o) => o.mapped_with,
                                                ),
                                              ),
                                            ];

                                            fetchRider(vendor_ids);
                                          }}
                                          className="h-10 w-full cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5]"
                                        >
                                          Get Available Rider
                                        </button>
                                      ) : (
                                        <>
                                          {riders.length > 0 && (
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
                                                  Select Rider for Bulk
                                                  Assignment
                                                </option>

                                                {riders.map((rider) => (
                                                  <option
                                                    key={rider.id}
                                                    value={rider.id}
                                                  >
                                                    {rider.id} : {rider.name}
                                                  </option>
                                                ))}
                                              </select>

                                              {assignmentState && (
                                                <button
                                                  onClick={async () => {
                                                    if (!assignmentState) {
                                                      toast.warn(
                                                        "Please select a rider",
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
                                                        selectedStatus ===
                                                        "undelivered"
                                                          ? "undelivered assigned"
                                                          : "in transit",
                                                      rider_id: assignmentState,
                                                    });

                                                    // for (const order of selectedBulkOrders) {
                                                    // }

                                                    clearAllState();
                                                  }}
                                                  className="h-10 shrink-0 cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0339B5]"
                                                >
                                                  Bulk Assign Orders to Rider
                                                </button>
                                              )}
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}




                                {allSelectedUndelivered && (
  <div className="space-y-3 rounded-sm border border-gray-200 p-4 dark:border-neutral-700">
    <div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
        Vendor Mapping
      </h3>

      <p className="mt-1 text-xs text-gray-500">
        Manage vendor mapping for {undeliveredOrders.length} selected
        undelivered orders.
      </p>
    </div>

    {!bulkMappingOpen ? (
      <button
        type="button"
        disabled={bulkMappingLoading}
        onClick={async()=>{
          handleOpenBulkVendorMapping()
         await checkVendorMappingStatus(selectedBulkOrders[0].id);
         await fetchVendor(selectedBulkOrders[0].id);
        }}
        className="w-full rounded-sm bg-[#0446DB] px-3 py-2 text-sm font-medium text-white hover:bg-[#0339b5] disabled:opacity-50"
      >
        Manage Vendor Mapping
      </button>
    ) : (
      <div className="space-y-3">
        {
          checkVendorMapping?.canChangeMapping && (

        <form
          onSubmit={handleBulkChangeVendorMapping}
          className="space-y-3"
        >
          <select
            value={assignmentState}
            onChange={(e) => setAssignmentState(e.target.value)}
            required
            disabled={bulkMappingLoading}
            className="h-10 w-full rounded-sm border border-gray-300 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          >
            <option value="" disabled>
              Select Vendor
            </option>

            {vendor.map((item) => (
              <option
                key={item.vendor_id}
                value={item.vendor_id}
              >
                {item.vendor_id} : {item.vendor_name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={bulkMappingLoading || !assignmentState}
            className="w-full rounded-sm bg-[#0446DB] px-3 py-2 text-sm font-medium text-white hover:bg-[#0339b5] disabled:opacity-50"
          >
            Assign New Vendor
          </button>
        </form>
          )
        }

        

        {
          !checkVendorMapping?.canChangeMapping && (

        <button
          type="button"
          disabled={bulkMappingLoading}
          onClick={handleBulkRevokeVendorMapping}
          className="w-full rounded-sm bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          Revoke Vendor Mapping
        </button>
          )
        }


        <button
          type="button"
          disabled={bulkMappingLoading}
          onClick={() => {
            setBulkMappingOpen(false);
            setAssignmentState("");
            setCheckVendorMapping(null);
          }}
          className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm dark:border-neutral-700"
        >
          Close
        </button>
      </div>
    )}
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

                                                <option
                                                  value={"out for delivery"}
                                                >
                                                  Mark Out For Delivery
                                                </option>

                                                {selectedStatus ==
                                                  "undelivered assigned" ||
                                                  (selectedStatus ==
                                                    "in transit" && (
                                                    <option
                                                      value={
                                                        "cancel rider assignment"
                                                      }
                                                    >
                                                      Cancel Rider Assignment
                                                    </option>
                                                  ))}

                                                <option value="lost">
                                                  Lost
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

                                                    if (
                                                      assignmentState ===
                                                      "cancel rider assignment"
                                                    ) {
                                                      await cancelRiderAssignments(
                                                        order_ids,
                                                      );
                                                    } else {
                                                      // for (const order of selectedBulkOrders) {
                                                      // }

                                                      await changeOrderStatus({
                                                        order_ids: order_ids,
                                                        newStatus:
                                                          assignmentState,
                                                        rider_id: "",
                                                      });
                                                    }

                                                    clearAllState();
                                                  }}
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
                                                    Select Status
                                                  </option>

                                                  <option value={"delivered"}>
                                                    Mark Delivered
                                                  </option>

                                                  <option value={"ndr"}>
                                                    Mark NDR
                                                  </option>

                                                  <option value="lost">
                                                    Mark Lost
                                                  </option>
                                                </select>
                                              </div>

                                              {/* =====================================
                              NDR
                          ===================================== */}
                                              {assignmentState == "ndr" && (
                                                <>
                                                  <Dialog className="w-5xl">
                                                    <DialogTrigger asChild>
                                                      <Button
                                                        variant="outline"
                                                        className="h-10 cursor-pointer rounded-sm border border-[#0446DB] bg-[#0446DB] px-5 text-sm font-semibold text-white hover:bg-[#0339B5] hover:text-white"
                                                      >
                                                        <span>
                                                          Mark Bulk Orders as
                                                          NDR
                                                        </span>
                                                      </Button>
                                                    </DialogTrigger>

                                                    {/* ===============================
                                    NDR DIALOG
                                =============================== */}
                                                    <DialogContent className="!max-w-lg overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 dark:border-neutral-800 dark:bg-neutral-900">
                                                      {/* NDR HEADER */}
                                                      <DialogHeader className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
                                                        <DialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
                                                          NDR
                                                        </DialogTitle>

                                                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                                          Add undelivered
                                                          details for selected
                                                          orders.
                                                        </p>
                                                      </DialogHeader>

                                                      {/* NDR BODY */}
                                                      <div className="max-h-[65vh] space-y-4 overflow-y-auto px-5 py-5">
                                                        {/* ===========================
                                        DELIVERY REASON
                                    =========================== */}
                                                        <div>
                                                          <label
                                                            htmlFor="delivery_reason"
                                                            className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-200"
                                                          >
                                                            Undelivered Reason
                                                          </label>

                                                          <select
                                                            name="delivery_reason"
                                                            id="delivery_reason"
                                                            onChange={(e) => {
                                                              setRemarks(
                                                                e.target.value,
                                                              );
                                                              setRescheduleDate(
                                                                "",
                                                              );
                                                              setSub_remarks(
                                                                "",
                                                              );
                                                            }}
                                                            className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                                          >
                                                            <option value="">
                                                              -- Select Reason
                                                              --
                                                            </option>

                                                            <option value="Address Incorrect / Incomplete">
                                                              Address Incorrect
                                                              / Incomplete
                                                            </option>

                                                            <option value="Customer Requested Reschedule">
                                                              Customer Requested
                                                              Reschedule
                                                            </option>

                                                            <option value="Customer Refused / Cancelled">
                                                              Customer Refused /
                                                              Cancelled
                                                            </option>

                                                            <option value="Delivery Attempted – Not Reachable">
                                                              Delivery Attempted
                                                              – Not Reachable
                                                            </option>

                                                            <option value="Delivery Attempted – No Response">
                                                              Delivery Attempted
                                                              – No Response
                                                            </option>

                                                            <option value="Wrong Pincode / Address">
                                                              Wrong Pincode /
                                                              Address
                                                            </option>

                                                            <option value="Wrong Contact Details">
                                                              Wrong Contact
                                                              Details
                                                            </option>

                                                            <option value="Vehicle / Weather / Road Issue">
                                                              Vehicle / Weather
                                                              / Road Issue
                                                            </option>

                                                            <option value="Package Damaged">
                                                              Package Damaged
                                                            </option>
                                                          </select>
                                                        </div>

                                                        {/* ===========================
                                        RESCHEDULE DATE
                                    =========================== */}
                                                        {remarks ==
                                                          "Customer Requested Reschedule" && (
                                                          <>
                                                            <div>
                                                              <label
                                                                htmlFor=""
                                                                className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-200"
                                                              >
                                                                Reschedule Date
                                                              </label>

                                                              <input
                                                                type="date"
                                                                value={
                                                                  rescheduleDate
                                                                }
                                                                onClick={(e) =>
                                                                  e.target.showPicker?.()
                                                                }
                                                                onChange={(e) =>
                                                                  setRescheduleDate(
                                                                    e.target
                                                                      .value,
                                                                  )
                                                                }
                                                                className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                                              />
                                                            </div>
                                                          </>
                                                        )}

                                                        {/* ===========================
                                        RESCHEDULE SUB REMARK
                                    =========================== */}
                                                        {remarks ==
                                                          "Customer Requested Reschedule" && (
                                                          <>
                                                            <div>
                                                              <label
                                                                htmlFor=""
                                                                className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-200"
                                                              >
                                                                Sub Remark
                                                              </label>

                                                              <select
                                                                onChange={(
                                                                  e,
                                                                ) => {
                                                                  setSub_remarks(
                                                                    e.target
                                                                      .value,
                                                                  );
                                                                }}
                                                                className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                                              >
                                                                <option value="">
                                                                  -- Select
                                                                  Reason --
                                                                </option>

                                                                <option value="Unavailable at Location">
                                                                  Unavailable at
                                                                  Location
                                                                </option>

                                                                <option value="Out of Station">
                                                                  Out of Station
                                                                </option>

                                                                <option value="COD Amount Not Ready">
                                                                  COD Amount Not
                                                                  Ready
                                                                </option>

                                                                <option value="Require Different Time Slot">
                                                                  Require
                                                                  Different Time
                                                                  Slot
                                                                </option>

                                                                <option value="Other">
                                                                  Other
                                                                </option>
                                                              </select>
                                                            </div>
                                                          </>
                                                        )}

                                                        {/* ===========================
                                        CUSTOMER REFUSED SUB REMARK
                                    =========================== */}
                                                        {remarks ==
                                                          "Customer Refused / Cancelled" && (
                                                          <>
                                                            <div>
                                                              <label
                                                                htmlFor=""
                                                                className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-200"
                                                              >
                                                                Sub Remark
                                                              </label>

                                                              <select
                                                                onChange={(
                                                                  e,
                                                                ) => {
                                                                  setSub_remarks(
                                                                    e.target
                                                                      .value,
                                                                  );
                                                                }}
                                                                className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                                              >
                                                                <option value="">
                                                                  -- Select
                                                                  Reason --
                                                                </option>

                                                                <option value="Duplicate Order">
                                                                  Duplicate
                                                                  Order
                                                                </option>

                                                                <option value="Order Placed by Mistake">
                                                                  Order Placed
                                                                  by Mistake
                                                                </option>

                                                                <option value="COD Amount Not Ready">
                                                                  COD Amount Not
                                                                  Ready
                                                                </option>

                                                                <option value="Better Price Elsewhere">
                                                                  Better Price
                                                                  Elsewhere
                                                                </option>

                                                                <option value="Other">
                                                                  Other
                                                                </option>
                                                              </select>
                                                            </div>
                                                          </>
                                                        )}

                                                        {/* ===========================
                                        DETAILED REMARK
                                    =========================== */}
                                                        <div>
                                                          <label
                                                            htmlFor="remark"
                                                            className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-200"
                                                          >
                                                            Remark (Optional)
                                                          </label>

                                                          <input
                                                            type="text"
                                                            value={
                                                              detailed_remarks
                                                            }
                                                            placeholder="Enter remark"
                                                            onChange={(e) =>
                                                              setdetailed_remarks(
                                                                e.target.value,
                                                              )
                                                            }
                                                            className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                                          />
                                                        </div>
                                                      </div>

                                                      {/* ===============================
                                      NDR FOOTER
                                  =============================== */}
                                                      <DialogFooter className="border-t border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-950/30">
                                                        <DialogClose asChild>
                                                          <Button
                                                            variant="outline"
                                                            onClick={() => {
                                                              clearAllState();
                                                            }}
                                                          >
                                                            Cancel
                                                          </Button>
                                                        </DialogClose>

                                                        <Button
                                                          onClick={async () => {
                                                            const order_ids =
                                                              selectedBulkOrders.map(
                                                                (o) => o.id,
                                                              );

                                                            await changeOrderStatus(
                                                              {
                                                                order_ids:
                                                                  order_ids,
                                                                newStatus:
                                                                  assignmentState,
                                                                remarks:
                                                                  remarks,
                                                                sub_remarks:
                                                                  sub_remarks,
                                                                detailed_remarks:
                                                                  detailed_remarks,
                                                                rescheduled_date:
                                                                  rescheduleDate,
                                                                rider_id: "",
                                                              },
                                                            );

                                                            // for (const order of selectedBulkOrders) {
                                                            // }
                                                          }}
                                                          className="bg-[#0446DB] text-white hover:bg-[#0339B5]"
                                                        >
                                                          Submit
                                                        </Button>
                                                      </DialogFooter>
                                                    </DialogContent>
                                                  </Dialog>
                                                </>
                                              )}

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

                                                    // for (const order of selectedBulkOrders) {
                                                    // }

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

                                          // await rtoDelivered(ids);
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
                                            Select Status
                                          </option>

                                          {selectedStatus ===
                                            "rto in transit" && (
                                            <option value="rto out for delivery">
                                              RTO Out For Delivery
                                            </option>
                                          )}

                                          {selectedStatus ===
                                            "rto out for delivery" && (
                                            <>
                                              <option value="rto delivered">
                                                RTO Delivered
                                              </option>
                                              <option value="ndr">RTO Undelivered</option>
                                            </>
                                          )}

                                          {selectedStatus ==
                                            "rto undelivered" && (
                                            <option value="rto out for delivery">
                                              RTO Out For Delivery
                                            </option>
                                          )}

                                          <option value="lost">Lost</option>
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

                                {/* Body */}
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

                                          setFetchBulkAssignmentVendor(true);
                                          fetchVendor(order_ids);
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
                                                fetchVendor(order_ids);
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

                      {/* <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap text-center px-2 font-semibold py-3">ASSIGNMENT/RIDER</th> */}
                      {/* <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap text-center px-2 font-semibold py-3">MAPPED/VENDOR</th> */}
                      <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap text-left  font-semibold py-3">
                        STATUS
                      </th>
                      {selectedStatus === "booked" && (
                        <th className="sticky top-0 z-30 bg-gray-100 dark:bg-neutral-800 dark:text-white whitespace-nowrap text-left  font-semibold py-3">
                          ELIGIBLE VENDORS
                        </th>
                      )}
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
                            className="hover:bg-gray-50 text-left dark:hover:bg-gray-800 border-b"
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
                                              if (selectedStatus === "booked") {
                                                fetchVendor(order_ids);
                                              }

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

                                  {selectedStatus === "picked" && (
                                    <p>
                                      {order.pickup_stage === "at_central_hub"
                                        ? "At Central Hub"
                                        : order.pickup_stage === "at_dc" ? "At DC" : "At Vendor Hub"}
                                    </p>
                                  )}

                                  {/* {
                                        order.mapped_with === null && (
                                          <>
                                           -
                                          </>
                                        )
                                      } */}
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
                                          : order?.order_specific === "Turant"
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

                                            if (
                                              selectedStatus ===
                                                "rto in transit" &&
                                              newStatus == "rto delivered"
                                            ) {
                                              await rtoDelivered([order.id]);
                                              return;
                                            }

                                            if (
                                              newStatus ==
                                              "cancel rider assignment"
                                            ) {
                                              cancelRiderAssignments([
                                                order.id,
                                              ]);
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
                                              {order.status === "picked" && (
                                                <>
                                                  <option value="in transit">
                                                    In Transit
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
                                                  <option value="out for delivery">
                                                    Mark Out For Delivery
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
                                                  <option value="ndr">
                                                    NDR
                                                  </option>
                                                  <option value="lost">
                                                    Lost
                                                  </option>
                                                </>
                                              )}

                                              {order.status ==
                                                "rto out for delivery" && (
                                                <>
                                                  <option value="rto delivered">
                                                    RTO Delivered
                                                  </option>
                                                  <option value="ndr">
                                                    NDR
                                                  </option>
                                                </>
                                              )}
                                              {order.status ===
                                                "rto in transit" && (
                                                <>
                                                  {/* <option value="rto delivered">
                                                        RTO Delivered
                                                      </option> */}
                                                  <option value="rto out for delivery">
                                                    RTO Out For Delivery
                                                  </option>
                                                  <option value="lost">
                                                    Lost
                                                  </option>
                                                </>
                                              )}
                                              {order.status ===
                                                "rto undelivered" && (
                                                <>
                                                  <option value="rto out for delivery">
                                                    RTO Out For Delivery
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
                                            {assignmentState == "ndr" && (
                                              <>
                                                <Dialog className="w-5xl">
                                                  <DialogTrigger asChild>
                                                    <Button
                                                      variant="outline"
                                                      className="text-sm font-medium rounded-sm border py-0.5 bg-[#0446DB] hover:text-[#FFF] text-white border-[#0446DB]  hover:bg-[#0446DB] inline-block cursor-pointer"
                                                    >
                                                      <span>Mark as NDR</span>
                                                    </Button>
                                                  </DialogTrigger>
                                                  <DialogContent className="">
                                                    <DialogHeader>
                                                      <DialogTitle>
                                                        NDR
                                                      </DialogTitle>
                                                    </DialogHeader>

                                                    <div>
                                                      <label
                                                        htmlFor="delivery_reason"
                                                        className="block mb-1 mt-2"
                                                      >
                                                        Undelivered Reason
                                                      </label>
                                                      <select
                                                        name="delivery_reason"
                                                        id="delivery_reason"
                                                        onChange={(e) => {
                                                          setRemarks(
                                                            e.target.value,
                                                          );
                                                          setRescheduleDate("");
                                                          setSub_remarks("");
                                                        }}
                                                        className=" border w-full py-2 px-2 rounded"
                                                      >
                                                        <option value="">
                                                          -- Select Reason --
                                                        </option>
                                                        {assignmentState ==
                                                          "ndr" &&
                                                          selectedStatus ==
                                                            "out for delivery" && (
                                                            <>
                                                              <option value="Address Incorrect / Incomplete">
                                                                Address
                                                                Incorrect /
                                                                Incomplete
                                                              </option>
                                                              <option value="Customer Requested Reschedule">
                                                                Customer
                                                                Requested
                                                                Reschedule
                                                              </option>
                                                              <option value="Customer Refused / Cancelled">
                                                                Customer Refused
                                                                / Cancelled
                                                              </option>
                                                              <option value="Delivery Attempted – Not Reachable">
                                                                Delivery
                                                                Attempted – Not
                                                                Reachable
                                                              </option>
                                                              <option value="Delivery Attempted – No Response">
                                                                Delivery
                                                                Attempted – No
                                                                Response
                                                              </option>
                                                              <option value="Wrong Pincode / Address">
                                                                Wrong Pincode /
                                                                Address
                                                              </option>
                                                              <option value="Wrong Contact Details">
                                                                Wrong Contact
                                                                Details
                                                              </option>
                                                              <option value="Vehicle / Weather / Road Issue">
                                                                Vehicle /
                                                                Weather / Road
                                                                Issue
                                                              </option>
                                                              <option value="Package Damaged">
                                                                Package Damaged
                                                              </option>
                                                            </>
                                                          )}

                                                        {selectedStatus ==
                                                          "rto out for delivery" && (
                                                          <>
                                                            {[
                                                              {
                                                                label:
                                                                  "Origin Unavailable",
                                                              },
                                                              {
                                                                label:
                                                                  "Origin Closed",
                                                              },
                                                              {
                                                                label:
                                                                  "Origin Refused",
                                                              },
                                                              {
                                                                label:
                                                                  "Contact Person Unavailable",
                                                              },
                                                              {
                                                                label:
                                                                  "Origin Not Reachable",
                                                              },
                                                              {
                                                                label:
                                                                  "Address Not Found",
                                                              },
                                                              {
                                                                label:
                                                                  "Delivery Attempt Failed",
                                                              },
                                                              {
                                                                label: "Other",
                                                              },
                                                            ].map((e) => (
                                                              <option
                                                                key={e.label}
                                                                value={e.label}
                                                              >
                                                                {e.label}
                                                              </option>
                                                            ))}
                                                            gjhgjhgjhg
                                                          </>
                                                        )}
                                                      </select>

                                                      {remarks ==
                                                        "Customer Requested Reschedule" && (
                                                        <>
                                                          <div>
                                                            <label
                                                              htmlFor=""
                                                              className="block mb-1 mt-2"
                                                            >
                                                              Reschedule Date
                                                            </label>
                                                            <input
                                                              type="date"
                                                              value={
                                                                rescheduleDate
                                                              }
                                                              onClick={(e) =>
                                                                e.target.showPicker?.()
                                                              }
                                                              onChange={(e) =>
                                                                setRescheduleDate(
                                                                  e.target
                                                                    .value,
                                                                )
                                                              }
                                                              className=" border w-full py-2 px-2 rounded"
                                                            />
                                                          </div>
                                                        </>
                                                      )}
                                                      {remarks ==
                                                        "Customer Requested Reschedule" && (
                                                        <>
                                                          <label
                                                            htmlFor=""
                                                            className="block mb-1 mt-2 "
                                                          >
                                                            Sub Remark
                                                          </label>
                                                          <select
                                                            onChange={(e) => {
                                                              setSub_remarks(
                                                                e.target.value,
                                                              );
                                                            }}
                                                            className="border w-full py-2 px-2 rounded"
                                                          >
                                                            <option value="">
                                                              -- Select Reason
                                                              --
                                                            </option>
                                                            <option value="Unavailable at Location">
                                                              Unavailable at
                                                              Location
                                                            </option>
                                                            <option value="Out of Station">
                                                              Out of Station
                                                            </option>
                                                            <option value="COD Amount Not Ready">
                                                              COD Amount Not
                                                              Ready
                                                            </option>
                                                            <option value="Require Different Time Slot">
                                                              Require Different
                                                              Time Slot
                                                            </option>
                                                            <option value="Other">
                                                              Other
                                                            </option>
                                                          </select>
                                                        </>
                                                      )}
                                                      {remarks ==
                                                        "Customer Refused / Cancelled" && (
                                                        <>
                                                          <label
                                                            htmlFor=""
                                                            className="block mb-1 mt-2 "
                                                          >
                                                            Sub Remark
                                                          </label>
                                                          <select
                                                            onChange={(e) => {
                                                              setSub_remarks(
                                                                e.target.value,
                                                              );
                                                            }}
                                                            className="border w-full py-2 px-2 rounded"
                                                          >
                                                            <option value="">
                                                              -- Select Reason
                                                              --
                                                            </option>
                                                            <option value="Duplicate Order">
                                                              Duplicate Order
                                                            </option>
                                                            <option value="Order Placed by Mistake">
                                                              Order Placed by
                                                              Mistake
                                                            </option>
                                                            <option value="COD Amount Not Ready">
                                                              COD Amount Not
                                                              Ready
                                                            </option>
                                                            <option value="Better Price Elsewhere">
                                                              Better Price
                                                              Elsewhere
                                                            </option>
                                                            <option value="Other">
                                                              Other
                                                            </option>
                                                          </select>
                                                        </>
                                                      )}

                                                      <div>
                                                        <label
                                                          htmlFor="remark"
                                                          className="block mb-1 mt-2"
                                                        >
                                                          Remark (Optional)
                                                        </label>
                                                        <input
                                                          type="text"
                                                          value={
                                                            detailed_remarks
                                                          }
                                                          placeholder="Enter remark"
                                                          onChange={(e) =>
                                                            setdetailed_remarks(
                                                              e.target.value,
                                                            )
                                                          }
                                                          className=" border w-full py-2 px-2 rounded"
                                                        />
                                                      </div>
                                                    </div>

                                                    <Button
                                                      onClick={async () => {
                                                        // const order_ids = selectedBulkOrders.map((o) => o.id);
                                                        await changeOrderStatus(
                                                          {
                                                            order_ids: [
                                                              order.id,
                                                            ],
                                                            newStatus:
                                                              order.status ==
                                                              "rto out for delivery"
                                                                ? "rto undelivered"
                                                                : assignmentState,
                                                            remarks: remarks,
                                                            sub_remarks:
                                                              sub_remarks,
                                                            detailed_remarks:
                                                              detailed_remarks,
                                                            rescheduled_date:
                                                              rescheduleDate,
                                                            rider_id: "",
                                                          },
                                                        );
                                                      }}
                                                      className={"bg-[#0446DB]"}
                                                    >
                                                      Submit
                                                    </Button>

                                                    <DialogFooter>
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
                                              </>
                                            )}
                                            {(assignmentState ==
                                              "undelivered assigned" ||
                                              assignmentState ==
                                                "in transit") && (
                                              <>
                                                <Dialog className="w-5xl">
                                                  <DialogTrigger asChild>
                                                    <Button
                                                      variant="outline"
                                                      className="text-sm font-medium rounded-sm border  bg-[#0446DB] hover:text-[#FFF] text-white border-[#0446DB]  hover:bg-[#0446DB] inline-block cursor-pointer"
                                                    >
                                                      <span>Select Rider</span>
                                                    </Button>
                                                  </DialogTrigger>
                                                  <DialogContent className="">
                                                    <DialogHeader>
                                                      <DialogTitle>
                                                        Select a Rider
                                                      </DialogTitle>
                                                    </DialogHeader>

                                                    <div>
                                                      <label
                                                        htmlFor="delivery_reason"
                                                        className="block mb-1 mt-2"
                                                      >
                                                        Select Rider
                                                      </label>
                                                      <select
                                                        name="delivery_reason"
                                                        id="delivery_reason"
                                                        onChange={(e) => {
                                                          setRiderID(
                                                            e.target.value,
                                                          );
                                                        }}
                                                        className=" border w-full py-2 px-2 rounded"
                                                      >
                                                        <option value="">
                                                          -- Select Rider --
                                                        </option>
                                                        {riders.map((rider) => (
                                                          <option
                                                            key={rider.id}
                                                            value={rider.id}
                                                          >
                                                            {rider.id} :{" "}
                                                            {rider.name}
                                                          </option>
                                                        ))}
                                                      </select>
                                                    </div>
                                                    <Button
                                                      onClick={async () => {
                                                        await changeOrderStatus(
                                                          {
                                                            order_ids: [
                                                              order.id,
                                                            ],
                                                            newStatus:
                                                              assignmentState ==
                                                              "in transit"
                                                                ? "in transit"
                                                                : "undelivered assigned",
                                                            rider_id: riderID,
                                                          },
                                                        );
                                                      }}
                                                      className={"bg-[#0446DB]"}
                                                    >
                                                      Submit
                                                    </Button>

                                                    <DialogFooter>
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
                                              </>
                                            )}

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
                            {/* eligible_vendors */}
                            {/* {selectedStatus === "booked" && (
                                  <td className="px-6 py-1 whitespace-pre-line">
                                    
                                    {order?.tpc_awb_number !== null ? (
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
                                            : order?.eligible_vendors
                                                ?.split(",")
                                                .join(" | ")}
                                        </p>
                                      </>
                                    )}
                                  </td>
                                )} */}

                            {selectedStatus === "booked" && (
                              <td className="max-w-[220px] py-2">
                                {order?.tpc_awb_number != null ? (
                                  <span className="block text-left text-gray-400">
                                    -
                                  </span>
                                ) : (
                                  (() => {
                                    const vendors = String(
                                      order?.eligible_vendors || "",
                                    )
                                      .split(",")
                                      .map((v) => v.trim())
                                      .filter(Boolean);

                                    if (!vendors.length) {
                                      return (
                                        <span className="block text-center text-gray-400">
                                          -
                                        </span>
                                      );
                                    }

                                    return (
                                      <HoverCard
                                        openDelay={150}
                                        closeDelay={150}
                                      >
                                        <HoverCardTrigger asChild>
                                          <div className="max-w-[200px] cursor-pointer">
                                            <div className="flex items-center gap-2 rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-orange-700 transition-all duration-200 hover:border-orange-400 hover:bg-orange-100 hover:shadow-sm dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-300">
                                              <Building2 className="h-4 w-4 shrink-0" />

                                              <span className="min-w-0 flex-1 truncate text-xs font-medium">
                                                {vendors.join(" | ")}
                                              </span>

                                              <span className="shrink-0 rounded-full bg-orange-200 px-1.5 py-0.5 text-[10px] font-semibold dark:bg-orange-900">
                                                {vendors.length}
                                              </span>
                                            </div>
                                          </div>
                                        </HoverCardTrigger>

                                        <HoverCardContent
                                          side="top"
                                          align="start"
                                          sideOffset={8}
                                          className="z-50 w-[320px] rounded-xl border border-gray-200 bg-white p-0 shadow-xl dark:border-gray-700 dark:bg-gray-900"
                                        >
                                          {/* Header */}
                                          <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-2">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950">
                                                  <Users className="h-4 w-4" />
                                                </div>

                                                <div>
                                                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    Eligible Vendors
                                                  </h4>
                                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Available vendor list
                                                  </p>
                                                </div>
                                              </div>

                                              <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                                                {vendors.length} Total
                                              </span>
                                            </div>
                                          </div>

                                          {/* Vendor List */}
                                          <div className="max-h-[250px] space-y-1 overflow-y-auto p-2">
                                            {vendors.map((vendor, index) => (
                                              <div
                                                key={`${vendor}-${index}`}
                                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                                              >
                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                                  {index + 1}
                                                </span>

                                                <span className="min-w-0 flex-1 break-words text-sm font-medium text-gray-700 dark:text-gray-200">
                                                  {vendor}
                                                </span>

                                                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                                              </div>
                                            ))}
                                          </div>

                                          {/* Footer */}
                                          <div className="border-t border-gray-100 px-4 py-2.5 dark:border-gray-800">
                                            <p className="text-center text-xs text-gray-400">
                                              {vendors.length} eligible vendor
                                              {vendors.length !== 1
                                                ? "s"
                                                : ""}{" "}
                                              found
                                            </p>
                                          </div>
                                        </HoverCardContent>
                                      </HoverCard>
                                    );
                                  })()
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="sticky bottom-0 z-40 flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-gray-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
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
