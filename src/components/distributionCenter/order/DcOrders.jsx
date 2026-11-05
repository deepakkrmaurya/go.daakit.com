// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import Select from "react-select";

// import { HiOutlineDocumentMagnifyingGlass } from "react-icons/hi2";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { FaRegCopy } from "react-icons/fa";
// import { CiCircleCheck } from "react-icons/ci";
// import { toast } from "react-toastify";

// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Field, FieldLabel } from "@/components/ui/field";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Drawer,
//   DrawerClose,
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
// import { ChevronDown, Download, Filter, Loader2, PackageCheck, UserPlus,X, Zap } from "lucide-react";
// import AxiosInstance from "@/Helper/axiosInstance";
// import CustomButton from "../../common/CustomButton";
// import { FiRefreshCw } from "react-icons/fi";
// const baseURL = import.meta.env.VITE_BASE_URL;
// const frontEndURL = import.meta.env.VITE_FRONTEND_URL;

// const toDateKey = (date) => {
//   if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// };

// const fromDateKey = (value) => {
//   if (!value) return undefined;
//   const normalized = String(value).replace(/\//g, "-");
//   const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(normalized);
//   if (!match) return undefined;
//   const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
//   return Number.isNaN(date.getTime()) ? undefined : date;
// };

// const defaultDcFilters = () => {
//   const today = new Date();
//   const monthAgo = new Date(today);
//   monthAgo.setMonth(monthAgo.getMonth() - 1);
//   return {
//     startDate: toDateKey(monthAgo),
//     endDate: toDateKey(today),
//     order_id: "",
//     awbNumber: "",
//     city: "",
//     state: "",
//     pincode: "",
//     rider_id: "",
//     order_specific: "",
//   };
// };

// const readApiError = (error, fallback) =>
//   error?.response?.data?.message || error?.message || fallback;

// const saveCsv = (blobData, fileName) => {
//   const blob = blobData instanceof Blob
//     ? blobData
//     : new Blob([blobData], { type: "text/csv;charset=utf-8" });
//   const url = window.URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = fileName;
//   document.body.appendChild(link);
//   link.click();
//   link.remove();
//   // Revoke on a later event-loop turn, after the browser starts the download.
//   window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
// };

// function DCOrderDetails() {
// const [bulkActionLoading, setBulkActionLoading] = useState(false);
// const [assignRiderLoading, setAssignRiderLoading] = useState(false);
// const [assign, setAssign] = useState(false);

//   const [isOpenIndividualMap, setIsOpenIndividualMap] = useState("");
//   const [open, setOpen] = useState(false);
//   const [endopen, setEndOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [orders, setOrders] = useState([]);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(20);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalOrders, setTotalOrders] = useState(0);

//   const [selectedStatus, setSelectedStatus] = useState("All");
//   const [copySuccess, setCopySuccess] = useState(null);
//   const [bulkStatusState, setBulkStatusState] = useState("");
//   const [selectedBulkOrders, setSelectedBulkOrders] = useState([]);
//   const [editingStatusId, setEditingStatusId] = useState(null);
//   const [isOpenIndividualAssignmnet, setIsOpenIndividualAssignmnet] = useState("");

//   const [reassignPopup, setReassignPopup] = useState(null);
//   const [reassignRiderPopup, setReassignRiderPopup] = useState(null);
//   const [newRider, setNewRider] = useState("");
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [advanceFilters, setAdvanceFilters] = useState(defaultDcFilters);
//   const latestFetchRef = useRef(0);

//   const [ndrData, setNdrData] = useState({
//     ndr_id: "",
//     newRemarks: "",
//   });

//   const [filterUpdate, setFilterUpdate] = useState(false);

//   const [reassignRidersOptions, setReassignRidersOptions] = useState([]);

//   const [assignmentState, setAssignmentState] = useState("");

//   const [showNdrActions, setShowNdrActions] = useState(false);

//   // A vendor mapping is considered active only when mapped_with has a valid ID.
//   const isVendorMapped = (order) =>
//     order?.mapped_with !== null &&
//     order?.mapped_with !== undefined &&
//     String(order.mapped_with).trim() !== "" &&
//     String(order.mapped_with) !== "0";

//   const supportsVendorGroups = ["picked", "undelivered"].includes(selectedStatus);
//   const selectedVendorGroup =
//     supportsVendorGroups && selectedBulkOrders.length > 0
//       ? (isVendorMapped(selectedBulkOrders[0]) ? "mapped" : "unmapped")
//       : null;

//   const selectableOrders = orders.filter((order) => {
//     if (selectedStatus === "pending pickup") return order.mapped_dc_id != null;
//     if (selectedStatus === "picked") return order.pickup_stage === "at_dc";
//     if (selectedStatus === "undelivered") return true;
//     if (selectedStatus === "rto in transit") return true;
//     return false;
//   });

//   const canSelectOrder = (order) =>
//     !selectedVendorGroup ||
//     (isVendorMapped(order) ? "mapped" : "unmapped") === selectedVendorGroup;

//   const eligibleSelectableOrders = selectableOrders.filter(canSelectOrder);

//   const handleOrderSelection = (order, checked) => {
//     if (!checked) {
//       setSelectedBulkOrders((previous) => previous.filter((item) => item.id !== order.id));
//       return;
//     }
//     if (!canSelectOrder(order)) {
//       toast.info(
//         selectedVendorGroup === "mapped"
//           ? "Vendor mapped orders are selected. Clear selection before selecting unmapped orders."
//           : "Unmapped orders are selected. Clear selection before selecting vendor mapped orders."
//       );
//       return;
//     }
//     setSelectedBulkOrders((previous) =>
//       previous.some((item) => item.id === order.id) ? previous : [...previous, order]
//     );
//   };

//   const toggleSelectAll = () => {
//     // When no type is selected and both exist, start with unmapped orders.
//     // The user can select a mapped order first to select all mapped orders instead.
//     const targetGroup = selectedVendorGroup ||
//       (supportsVendorGroups ? "unmapped" : null);
//     const available = selectableOrders.filter((order) =>
//       !targetGroup || (isVendorMapped(order) ? "mapped" : "unmapped") === targetGroup
//     );
//     if (!available.length) {
//       toast.info("Select a vendor mapped order first to select that group.");
//       return;
//     }
//     const ids = new Set(available.map((order) => order.id));
//     const allSelected = available.every((order) =>
//       selectedBulkOrders.some((item) => item.id === order.id)
//     );
//     setSelectedBulkOrders((previous) =>
//       allSelected
//         ? previous.filter((item) => !ids.has(item.id))
//         : [...previous.filter((item) => !ids.has(item.id)), ...available]
//     );
//   };

//   // Only reset transient UI after actions. Do NOT erase fetched orders,
//   // status tab, pagination or filters (the old version did this).
//   const clearAllState = () => {
//     setAssign(false);
//     setIsOpenIndividualMap("");
//     setOpen(false);
//     setEndOpen(false);
//     setIsOpenIndividualAssignmnet("");
//     setReassignPopup(null);
//     setReassignRiderPopup(null);
//     setShowNdrActions(false);
//     setCopySuccess(null);
//     setBulkStatusState("");
//     setSelectedBulkOrders([]);
//     setEditingStatusId(null);
//     setAssignmentState("");
//     setNewRider("");
//     setReassignRidersOptions([]);
//     setAssignVendor(false);
//     setSelectedVendor("");
//     setVendorList([]);
//   };

//   function toCapitalizeEachWord(str) {
//     return String(str || "")
//       .split(" ")
//       .map((word) => {
//         if (!word) return "";
//         return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//       })
//       .join(" ");
//   }

//   const resetAdvanceFilters = () => {
//     setAdvanceFilters(defaultDcFilters());
//     setPage(1);
//   };

//   const status = [
//     "All",
//     "pending pickup",
//     "picked",
//     "in transit",
//     "out for delivery",
//     "delivered",
//     // "undelivered",
//     // "undelivered assigned",
//     // "ndr",
//     // "rto in transit",
//     // "rto delivered",
//   ];
//   const fetchOrders = async () => {
//     const requestId = ++latestFetchRef.current;
//     setLoading(true);
//     try {
//       const params = {
//         page,
//         limit,
//         status: selectedStatus === "All" ? undefined : selectedStatus,
//         awb_number: advanceFilters.awbNumber?.trim() || undefined,
//         start_date: advanceFilters.startDate || undefined,
//         end_date: advanceFilters.endDate || undefined,
//         // These filters require matching server-side SQL support.
//         order_id: advanceFilters.order_id || undefined,
//         city: advanceFilters.city || undefined,
//         pincode: advanceFilters.pincode || undefined,
//         rider_id: advanceFilters.rider_id || undefined,
//         order_specific: advanceFilters.order_specific || undefined,
//       };
//       const response = await AxiosInstance.get("/api/dc/orders", { params });
//       if (requestId !== latestFetchRef.current) return;
//       const payload = response.data?.data || {};
//       setOrders(Array.isArray(payload.orders) ? payload.orders : []);
//       setTotalOrders(Number(payload.total) || 0);
//       setTotalPages(Math.max(1, Number(payload.totalPages) || 1));
//     } catch (error) {
//       if (requestId === latestFetchRef.current) {
//         toast.error(readApiError(error, "Unable to load DC orders"));
//       }
//     } finally {
//       if (requestId === latestFetchRef.current) setLoading(false);
//     }
//   };

//   const markOrdersDeliveredBulk = async (orderId) => {
//     try {
//       const res = await axios.post(
//         `${baseURL}/api/vendor/markOrdersDeliveredBulk`,
//         { order_ids: [orderId] },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );

//       toast.success(res.data.message);
//       fetchOrders();
//       setAssignmentState("");
//       setSelectedBulkOrders([]);
     
   
//     } catch (err) {
//       toast.error(readApiError(err, "Unable to mark order delivered"));
//       return;
//     } finally {
//       setLoading(false);
//     }
//   };

  

//   const cancelRiderAssignment = async (id) => {
//     setLoading(true);
//     try {

//       const res = await AxiosInstance.post('/api/dc/cancelRiderAssignment',{
//         order_id:id
//       })
      
//       if (res.data.success) {
//         toast.success("Rider assignment canceled successfully");
//         fetchOrders();
//       }
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

//   const cancelMappedAssignment = async (id) => {
//     setLoading(true);
//     try {
//       const res = await AxiosInstance.post(`/api/dc/orders/${id}/cancelMapping`)
     
//       if (res.data.success) {
//         toast.success("Mapped assignment canceled successfully");
//         fetchOrders();
//       }
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

//   const fetchReassignRiders = async (orderIdOrIds) => {
//     const ids = (Array.isArray(orderIdOrIds) ? orderIdOrIds : [orderIdOrIds])
//       .map(Number)
//       .filter((value) => Number.isSafeInteger(value) && value > 0);
//     if (!ids.length) {
//       toast.error("Please select valid order IDs");
//       return false;
//     }
//     try {
//       const { data } = await AxiosInstance.get("/api/dc/getRidersOutsideIdealLoad", {
//         params: { order_id: [...new Set(ids)].join(",") },
//       });
//       if (!data?.success) throw new Error(data?.message || "Unable to fetch riders");
//       const options = (Array.isArray(data.data) ? data.data : []).map((rider) => ({
//         value: Number(rider.rider_id),
//         label: `${rider.rider_id}: ${rider.rider_name} | ${rider.total_weight_grams ?? 0}g | ${rider.total_boxes ?? 0} box(es)`,
//       }));
//       setReassignRidersOptions(options);
//       if (!options.length) toast.info("No eligible DC riders currently available");
//       return options.length > 0;
//     } catch (error) {
//       setReassignRidersOptions([]);
//       toast.error(readApiError(error, "Error fetching DC riders"));
//       return false;
//     }
//   };

//   const reassignRider = async (order_id, new_rider_id) => {
//     if (!new_rider_id) return toast.error("Please select a rider");
//     const order = orders.find((item) => Number(item.id) === Number(order_id));
//     if (!order) return toast.error("Order not found. Refresh the list.");
//     // if (order.status === "undelivered" || order.status === "undelivered assigned") {
//     //   return toast.error("This DC rider API only accepts picked orders. An undelivered reattempt endpoint is required.");
//     // }
//     setAssignRiderLoading(true);
//     try {
//       if (order.status === "in transit" || order.status === "undelivered") {
//         // A new assignment cannot be created while the existing one is active.
//         const approved = window.confirm(
//           "This will cancel the current rider assignment before assigning the new rider. Continue?"
//         );
//         if (!approved) return;
//         await AxiosInstance.post("/api/dc/cancelRiderAssignment", { order_id });
//         return
//       } else if (order.status !== "picked") {
//         return toast.error("Order must be picked before assigning a DC rider");
//       }
//       try {
//         const response = await AxiosInstance.post("/api/dc/assignOrdersToRider", {
//           order_id,
//           rider_id: Number(new_rider_id),
//         });
//         if (!response.data?.success) throw new Error(response.data?.message || "Rider assignment failed");
//         toast.success(response.data.message || "Rider assigned successfully");
//         clearAllState();
//       } catch (error) {
//         toast.error(readApiError(error, "Assignment failed. If you just cancelled a rider, the order is now available for reassignment."));
//       }
      


//       await fetchOrders();
//     } catch (error) {
//       toast.error(readApiError(error, "Unable to cancel the previous rider assignment"));
//     } finally {
//       setAssignRiderLoading(false);
//     }
//   };

//   const assignBulkOrderRider = async (ids, new_rider_id) => {
//     const orderIds = [...new Set((ids || []).map(Number))];
//     if (!orderIds.length || orderIds.some((id) => !Number.isSafeInteger(id) || id <= 0)) {
//       toast.error("Please select valid orders");
//       return false;
//     }
//     if (selectedBulkOrders.some(isVendorMapped)) {
//       toast.error("Vendor mapped orders cannot be selected for this rider assignment action");
//       return false;
//     }
//     if (!new_rider_id) {
//       toast.error("Please select a rider");
//       return false;
//     }
//     // DC service currently permits only picked orders at DC/central hub.
    
// if (
//   selectedBulkOrders.some(
//     (order) =>
//       !["picked", "undelivered"].includes(
//         String(order.status || "").trim().toLowerCase()
//       )
//   )
// ) {
//   toast.error(
//     "Bulk DC rider assignment is supported for picked and undelivered orders only"
//   );
//   return false;
// }

//     setAssignRiderLoading(true);
//     try {
//       const response = await AxiosInstance.post("/api/dc/assignOrdersToRider", {
//         order_ids: orderIds,
//         rider_id: Number(new_rider_id),
//       });
//       if (!response.data?.success) throw new Error(response.data?.message || "Assignment failed");
//       toast.success(response.data.message || "Orders assigned successfully");
//       clearAllState();
//       await fetchOrders();
//       return true;
//     } catch (error) {
//       toast.error(readApiError(error, "Error assigning DC orders to rider"));
//       return false;
//     } finally {
//       setAssignRiderLoading(false);
//     }
//   };

//   const PickedOrder = async (order_ids) => {
//     if (!Array.isArray(order_ids) || !order_ids.length) {
//       toast.error("Select at least one order");
//       return false;
//     }
//     setBulkActionLoading(true);
//     try {
//       const response = await AxiosInstance.post("/api/dc/markOrdersPickedBulk", {
//         order_ids,
//       });
//       if (!response.data?.success) throw new Error(response.data?.message || "Pickup failed");
//       toast.success(response.data.message || "Pickup marked successfully");
//       clearAllState();
//       await fetchOrders();
//       return true;
//     } catch (error) {
//       toast.error(readApiError(error, "Error marking DC pickup"));
//       return false;
//     } finally {
//       setBulkActionLoading(false);
//     }
//   };

//   const changeNdrStatus = async (data) => {
//     setLoading(true);

//     try {
//       const res = await axios.post(
//         `${baseURL}/api/vendor/handleVendorNDReattempt/${data.ndr_id}`,
//         {
//           remarks: data.newRemarks,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );
//       if (!res.data.success) {
//         toast.error(res.data.message || "Unable to update NDR status");
//         return;
//       }
//       fetchOrders();
//       setEditingStatusId(null);
//     } catch (err) {
//       toast.error("Failed to update status");
//       return;
//     } finally {
//       setLoading(false);
//     }
//   };
//    const [assignVendor, setAssignVendor] = useState(false);
// const [selectedVendor, setSelectedVendor] = useState("");
//   const [vendorList, setVendorList] = useState([]);
// const [vendorLoading, setVendorLoading] = useState(false);


// const getEligibleVendorsByOrders = async ({ order_ids }) => {
//   try {
//     setVendorLoading(true);

//     const ids = [...new Set(
//       order_ids.map(Number).filter((id) => Number.isSafeInteger(id) && id > 0)
//     )];

//     if (!ids.length) {
//       toast.error("Please select at least one order");
//       return;
//     }

//     const { data } = await AxiosInstance.get(
//       "/api/dc/eligibleVendorsByOrders",
//       {
//         params: { order_ids: ids.join(",") },
//       }
//     );

//     console.log("Eligible Vendors:", data);

//     const vendors = Array.isArray(data?.data)
//       ? data.data
//       : Array.isArray(data?.vendors)
//         ? data.vendors
//         : [];

//     setVendorList(vendors);

//   } catch (error) {
//     console.error(error);
//     setVendorList([]);
//     toast.error(
//       error.response?.data?.message ||
//       "Failed to fetch eligible vendors"
//     );
//   } finally {
//     setVendorLoading(false);
//   }
// };


// const handleRefreshVendors = async () => {
//   const order_ids = [
//     ...new Set(
//       (selectedBulkOrders || [])
//         .map((order) => order.id)
//         .filter((id) => id !== null && id !== undefined)
//     ),
//   ];

//   setSelectedVendor("");

//   await getEligibleVendorsByOrders({ order_ids });
// };


// const handleCancelBulkVendorMapping = async () => {
//   if (!selectedBulkOrders.length) return toast.error("Select at least one order");
//   if (!selectedBulkOrders.every(isVendorMapped)) {
//     return toast.error("Only vendor mapped orders can have their vendor mapping cancelled");
//   }
//   const results = await Promise.allSettled(
//     selectedBulkOrders.map((order) =>
//       AxiosInstance.post(`/api/dc/orders/${order.id}/cancelVendorMapping`)
//     )
//   );
//   const succeeded = results.filter((item) => item.status === "fulfilled").length;
//   const failed = results.length - succeeded;
//   if (succeeded) toast.success(`${succeeded} vendor mapping(s) cancelled`);
//   if (failed) toast.error(`${failed} mapping(s) failed; review orders and retry`);
//   clearAllState();
//   await fetchOrders();
// };

//   const changeStatus = async (id, newStatus) => {
//     setLoading(true);
//     try {
//       await axios.post(
//         `${baseURL}/api/vendor/markOrdersRtoBulk`,
//         {
//           order_ids: [id].toString(),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );
//       fetchOrders();
//       setEditingStatusId(null);
//     } catch (err) {
//       toast.error("Failed to update status");
//       return;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const assignOrderToRider = async (order_id, rider_id) => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${baseURL}/api/vendor/assignOrderToRider`,
//         {
//           order_id,
//           rider_id,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );
//       fetchOrders();
//       setNewRider("");
//       setReassignRidersOptions([]);
//       setReassignRiderPopup(null);
//       setIsOpenIndividualAssignmnet(null);
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message ||
//           err.message ||
//           "Error while reassigning order to new rider",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to get assignment buttons based on status and mapped_with
//   const getAssignmentButtons = (order) => {
//     const { status, mapped_with, id, ndr_id } = order;

//     // Rider assignment is possible only after DC pickup.
//     // Pending pickup uses the Cancel Mapped / Mark as Picked actions in the Status cell.
//     // Case 2: pending pickup && mapped_with !== null
//     if (status === "pending pickup" && mapped_with == null) {
//       return (
//         <>
//           <button
//             type="button"
//             onClick={() => {
//               cancelMappedAssignment(id);
//               setIsOpenIndividualAssignmnet("");
//             }}
//             className="bg-[#0446DB] whitespace-nowrap text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 mr-2"
//           >
//             Cancel Mapped
//           </button>
//         </>
//       );
//     }
//     if (status === "ndr" && mapped_with !== null) {
//       return (
//         <>
//           <div
            

//             className="flex flex-col gap-2"
//           >
//             <div className="my-0">
//               <label className="mx-2">Remarks</label> <br />
//               <input
//                 type="text"
//                 name="newRemarks"
//                 onChange={(e) =>
//                   setNdrData({ ...ndrData, newRemarks: e.target.value })
//                 }
//                 className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//               />
//             </div>
//             <div className="flex items-center gap-1">
//               <div
//                 onClick={() => {
//                   changeNdrStatus({ ...ndrData, ndr_id: id });
//                 }}
//                 className="bg-[#0446DB] cursor-pointer text-center w-full text-white text-xs px-3 py-1 rounded hover:bg-indigo-800 transition"
//               >
//                 Reattempt
//               </div>
//             </div>
//           </div>
//         </>
//       );
//     }

//     // Case 3: in transit && mapped_with === null
//     // if (status === "in transit" && mapped_with === null) {
//     //   return (
//     //     <button
//     //       type="button"
//     //       onClick={async () => {
//     //         await fetchReassignRiders(id);
//     //         setReassignPopup(id);
//     //       }}
//     //       className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 mr-2"
//     //     >
//     //       Reassign Rider
//     //     </button>
//     //   );
//     // }

//     // Case 4: in transit && mapped_with !== null
//     if (status === "in transit" || status === "undelivered assigned"  ) {
//       return (
//         <>
//           <button
//             type="button"
//             onClick={() => {
//               cancelRiderAssignment(id);
//               setIsOpenIndividualAssignmnet("");
//             }}
//             className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 mr-2"
//           >
//             Cancel Rider Assignment
//           </button>
//           <button
//             type="button"
//             onClick={async () => {
//               await fetchReassignRiders(id);
//               setReassignPopup(id);
//             }}
//             className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 mr-2"
//           >
//             Reassign Rider
//           </button>
//         </>
//       );
//     }

//     // Undelivered DC orders can be reassigned to a vendor via bulk action;
//     // DC rider assignment is intentionally unavailable until a reattempt API exists.
//     // if (status === "undelivered") return null;

//     if (status === "undelivered assigned") return null;

//     // Case 8: rto in transit && mapped_with !== null - handled in status column

//     // For picked status
//     if (status === "picked" || status=='undelivered') {
//       return (
//         <button
//           type="button"
//           onClick={async () => {
//             await fetchReassignRiders(id);
//             setReassignPopup(id);
//           }}
//           className="bg-[#0446DB] whitespace-nowrap text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 mr-2"
//         >
//           Assign Rider
//         </button>
//       );
//     }

//     // Default case for other statuses where reassign is possible
//     if (
//       ["out for delivery", "delivered", "ndr"].includes(status) &&
//       mapped_with !== null
//     ) {
//       return (
//         <>
//           <button
//             type="button"
//             onClick={() => {
//               cancelRiderAssignment(id);
//               setIsOpenIndividualAssignmnet("");
//             }}
//             className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 mr-2"
//           >
//             Cancel Rider Assignment
//           </button>
//           <button
//             type="button"
//             onClick={async () => {
//               await fetchReassignRiders(id);
//               setReassignPopup(id);
//             }}
//             className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 mr-2"
//           >
//             Reassign Rider
//           </button>
//         </>
//       );
//     }

//     return null;
//   };

//   // Helper function to get status display based on conditions
//   const getStatusDisplay = (order) => {
//     const { status, mapped_with, id, rider_preference } = order;

//     if (status === "pending pickup") {
//       return (
//         <div className="flex">
//           {isOpenIndividualMap === id ? (
//             <>
//               <button
//                 type="button"
//                 onClick={() => {
//                   cancelMappedAssignment(id);
//                   setIsOpenIndividualAssignmnet("");
//                 }}
//                 className="bg-[#0446DB] whitespace-nowrap text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 mr-2"
//               >
//                 Cancel Mapped
//               </button>
//               {/* <span
//                 onClick={() => {
//                   PickedOrder([id]);
//                 }}
//                 className="bg-[#0446DB] whitespace-nowrap text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 cursor-pointer mr-2"
//               >
//                 Mark as Picked
//               </span> */}
//               <span
//                 onClick={() => {
//                   setIsOpenIndividualMap("");
//                   clearAllState()
//                 }}
//                 className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 cursor-pointer mr-2"
//               >
//                 Close
//               </span>
//             </>
//           ) : (
//             <span
//               onClick={() => {
                
              
//                 setIsOpenIndividualMap(id);
//               }}
//               className="px-3 py-1 cursor-pointer whitespace-nowrap rounded-full text-xs font-semibold inline-block bg-yellow-100 text-yellow-600"
//             >
//               Pending Pickup
//             </span>
//           )}
//         </div>
//       );
//     }

//     if (status === "rto in transit") {
//       return (
//         <>
//           {editingStatusId === id ? (
//             <form
//               onSubmit={async (e) => {
//                 e.preventDefault();
//                 const newStatus = e.target.elements.status.value;
//                 if (mapped_with === null) {
//                   toast.warning("Order is not mapped with any vendor");
//                   return;
//                 }
//                 changeStatus(id, newStatus);
//               }}
//             >
//               <div className="flex items-center gap-2">
//                 <select
//                   name="status"
//                   defaultValue={status}
//                   className="text-xs border border-gray-300 rounded-md px-2 py-1"
//                   required
//                 >
//                   <option disabled value="">
//                     Change Status
//                   </option>
//                   <option value="rto delivered">RTO Delivered</option>
//                 </select>
//                 <button
//                   type="submit"
//                   className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
//                 >
//                   Update
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {setEditingStatusId(null)

//                     clearAllState()
//                   }}
//                   className="text-xs text-gray-500 hover:underline"
//                 >
//                   Close
//                 </button>
//               </div>
//             </form>
//           ) : (
//             <span
//               onClick={() => {
//                 if (rider_preference === "daakit" && mapped_with === null) {
//                   toast.warning("Order is not mapped with any vendor");
//                   return;
//                 }
//                 if (mapped_with === null) {
//                   toast.warning("Order is not mapped with any vendor");
//                   return;
//                 }
//                 setEditingStatusId(id);
//               }}
//               className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-semibold inline-block bg-blue-100 text-blue-600 cursor-pointer"
//             >
//               RTO In Transit
//             </span>
//           )}
//         </>
//       );
//     }

//     // Default status display
//     const statusColors = {
//       "out for delivery": "bg-blue-100 text-blue-600",
//       delivered: "bg-green-100 text-green-600",
//       "undelivered assigned": "bg-yellow-100 text-yellow-600",
//       ndr: "bg-red-100 text-red-600",
//       "in transit": "bg-purple-100 text-purple-600",
//       picked: "bg-teal-100 text-teal-600",
//       "rto delivered": "bg-gray-100 text-gray-600",
//     };

//     const colorClass = statusColors[status] || "bg-green-100 text-green-600";

//     return (
//       <span
//         className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${colorClass}`}
//       >
//         {toCapitalizeEachWord(status)}
//       </span>
//     );
//   };

//   // Helper function to get assignment status text
//   const getAssignmentStatusText = (order) => {
//     const { status, mapped_with } = order;

//     if (status === "undelivered" || status === "picked") {
//       return "Not Assigned";
//     }

//     if (status === "pending pickup" && mapped_with) {
//       return "Not Assigned";
//     }

//     if (status === "cancelled") {
//       return "Order Canceled";
//     }

//     if (status === "delivered") {
//       return "Order Delivered";
//     }

//     if (status === "rto delivered") {
//       return "Delivered To Origin";
//     }

//     if (status === "ndr") {
//       return "Take Action";
//     }
//     return "Assigned";
//   };

//   // Helper function to get assignment status color
//   const getAssignmentStatusColor = (order, mapped_with) => {
//     const { status } = order;

//     if (status === "undelivered" || status === "picked") {
//       return "bg-red-100 text-red-600";
//     }

//     if (status === "cancelled") {
//       return "bg-red-100 text-red-600";
//     }
//     if (status === "pending pickup" && mapped_with) {
//       return "bg-red-100 text-red-600";
//     }

//     if (status === "delivered") {
//       return "bg-green-100 text-green-600";
//     }

//     if (status === "rto delivered") {
//       return "bg-green-100 text-green-600";
//     }
//     if (status === "rto") {
//       return "bg-green-100 text-green-600";
//     }

//     if (status === "ndr") {
//       return "bg-green-100 text-green-600";
//     }

//     return "bg-green-100 text-green-600";
//   };

//   const exportVendorPendingPickupOrders = async () => {
//     try {
//       const response = await AxiosInstance.get("/api/dc/orders/exportPendingPickup", {
//         responseType: "blob",
//       });
//       saveCsv(response.data, "dc_pending_pickup_orders.csv");
//     } catch (error) {
//       toast.error(readApiError(error, "Failed to export pending pickup orders"));
//     }
//   };

//   const exportVendorOrdersWithRider = async () => {
//     try {
//       const response = await AxiosInstance.get("/api/dc/orders/export", {
//         responseType: "blob",
//         params: {
//           ...{
//             start_date: advanceFilters.startDate || undefined,
//             end_date: advanceFilters.endDate || undefined,
//             awb_number: advanceFilters.awbNumber || undefined,
//             status: selectedStatus === "All" ? undefined : selectedStatus,
//           },
//           // Backend export must implement exportAll=true to avoid 100-row pagination.
//         },
//       });
//       saveCsv(response.data, "dc_orders.csv");
//     } catch (error) {
//       toast.error(readApiError(error, "Failed to export DC orders"));
//     }
//   };

//   const getOrderSpecificBadge = (orderSpecific = "") => {
//     const prefix = String(orderSpecific || "").split("-")[0]; // HLD4HRS, SDD, NDD

//     switch (prefix) {
//       case "NDD":
//         return {
//           text: prefix,
//           className: "text-green-800 bg-green-100 border border-green-300",
//         };

//       case "SDD":
//         return {
//           text: prefix,
//           className: "text-yellow-800 bg-yellow-100 border border-yellow-300",
//         };

//       default:
//         return {
//           text: prefix,
//           className:
//             "text-red-800 bg-red-100 border border-red-300 animate-blink",
//         };
//     }
//   };

//   const exportVendorRotOrders = async () => {
//     try {
//       const response = await AxiosInstance.get("/api/dc/orders/exportRto", {
//         responseType: "blob",
//       });
//       saveCsv(response.data, "dc_rto_orders.csv");
//     } catch (error) {
//       toast.error(readApiError(error, "Failed to export RTO orders"));
//     }
//   };

//   const assignOrderToVendoe = async ({ vendor_id, order_ids }) => {
//     if (!vendor_id || !order_ids?.length) return toast.error("Select vendor and orders");
//     if (selectedBulkOrders.some(isVendorMapped)) return toast.error("Clear vendor mapped orders before assigning a vendor");
//     setVendorLoading(true);
//     try {
//       const response = await AxiosInstance.post("/api/dc/bulkAssignOrdersToVendor", {
//         order_ids,
//         vendor_id: Number(vendor_id),
//       });
//       if (!response.data?.success) throw new Error(response.data?.message || "Vendor assignment failed");
//       toast.success(response.data.message || "Orders assigned to vendor");
//       clearAllState();
//       await fetchOrders();
//     } catch (error) {
//       toast.error(readApiError(error, "Error assigning orders to vendor"));
//     } finally {
//       setVendorLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [page, selectedStatus, limit]);

//   useEffect(() => {
//     if (filterUpdate) {
//       fetchOrders();
//       setFilterUpdate(false);
//     }
//   }, [filterUpdate]);
//   const formatToDMY = (dateStr) => {
//     const date = fromDateKey(dateStr);
//     if (!date) return "";
//     return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
//   };

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
//         <>
//            <div className=" w-full h-[90vh] flex justify-center items-center">
//           <div>
//             <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//             <p className="mt-2">Loading Order Details...</p>
//           </div>
//         </div>
//         </>
//       ):(
//         <div className="flex h-[calc(100dvh-100px)] min-h-0 min-w-0 w-full flex-col overflow-hidden bg-gray-100 dark:bg-gray-900">
//           {/* Heading Strip */}
//           <div className="z-10 shrink-0 bg-gray-100 pb-3 dark:bg-gray-900">
//             <div className="flex w-full min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
//               {/* Heading */}
//               <h1 className="text-2xl font-bold dark:text-white">Order Details</h1>
//               <div className="grid w-full grid-cols-2 gap-2 text-white sm:grid-cols-4 lg:flex lg:w-auto lg:flex-wrap lg:items-center lg:justify-end">
//                 {/* Right Side Filters */}
//                 <CustomButton
//                     icon={Download}
//                     onClick={exportVendorPendingPickupOrders}
//                     className="w-full min-w-0 text-xs sm:text-sm lg:w-auto"
//                   >
//                     Export Pickup List
//                   </CustomButton>
//                                   <CustomButton
//                     variant="outline"
//                     icon={Download}
//                     onClick={exportVendorOrdersWithRider}
//                     className="w-full min-w-0 text-xs sm:text-sm lg:w-auto"
//                   >
//                     Export Orders List
//                   </CustomButton>
//                                   <CustomButton
//                       variant="outline"
//                       icon={Download}
//                       onClick={exportVendorRotOrders}
//                       className="w-full min-w-0 text-xs sm:text-sm lg:w-auto"
//                     >
//                       Export RTO List
//                     </CustomButton>
  
//                 <Drawer
//                   direction="right"
//                   open={isFilterOpen}
//                   onOpenChange={setIsFilterOpen}
//                 >
//                   <DrawerTrigger asChild>
//                      <CustomButton variant="outline" icon={Filter} className="w-full min-w-0 text-xs sm:text-sm lg:w-auto">
//     Filter
//   </CustomButton>
//                   </DrawerTrigger>
//                   <DrawerContent>
//                     <DrawerHeader>
//                       <DrawerTitle>Filter</DrawerTitle>
//                       {/* <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}
//                     </DrawerHeader>
//                     <div className="no-scrollbar overflow-y-auto">
//                       <div className="p-4 w-full">
//                         <form
//                           onSubmit={(e) => {
//                             e.preventDefault();
//                             setPage(1);
//                             setFilterUpdate((prev) => !prev);
  
//                             setIsFilterOpen(false); // Drawer Close
//                           }}
//                         >
//                           <div className="flex flex-wrap items-end gap-4">
//                             {/* Start Date */}
//                             <div className=" w-full ">
//                               <Field className="mx-auto w-full">
//                                 <FieldLabel htmlFor="date">Start Date</FieldLabel>
//                                 <Popover open={open} onOpenChange={setOpen}>
//                                   <PopoverTrigger asChild>
//                                     <Button
//                                       type="button"
//                                       variant="outline"
//                                       id="date"
//                                       className="justify-start w-full font-normal"
//                                     >
//                                       {advanceFilters.startDate
//                                         ? formatToDMY(advanceFilters.startDate)
//                                         : "Select date"}
//                                     </Button>
//                                   </PopoverTrigger>
//                                   <PopoverContent
//                                     className="w-auto overflow-hidden p-0"
//                                     align="start"
//                                   >
//                                     <Calendar
//                                       mode="single"
//                                       selected={fromDateKey(advanceFilters.startDate)}
//                                       defaultMonth={fromDateKey(advanceFilters.startDate)}
//                                       captionLayout="dropdown"
//                                       onSelect={(date) => {
//                                         setAdvanceFilters((prev) => ({ ...prev, startDate: toDateKey(date) }));
//                                         setOpen(false);
//                                       }}
//                                     />
//                                   </PopoverContent>
//                                 </Popover>
//                               </Field>
//                             </div>
  
//                             {/* End Date */}
//                             <div className=" w-full">
//                               <Field className="mx-auto w-full">
//                                 <FieldLabel htmlFor="enddate">
//                                   End Date
//                                 </FieldLabel>
//                                 <Popover open={endopen} onOpenChange={setEndOpen}>
//                                   <PopoverTrigger asChild>
//                                     <Button
//                                       type="button"
//                                       variant="outline"
//                                       id="enddate"
//                                       className="justify-start w-full font-normal"
//                                     >
//                                       {advanceFilters.endDate
//                                         ? formatToDMY(advanceFilters.endDate)
//                                         : "Select date"}
//                                     </Button>
//                                   </PopoverTrigger>
//                                   <PopoverContent
//                                     className="w-auto overflow-hidden p-0"
//                                     align="start"
//                                   >
//                                     <Calendar
//                                       mode="single"
//                                       selected={fromDateKey(advanceFilters.endDate)}
//                                       defaultMonth={fromDateKey(advanceFilters.endDate)}
//                                       captionLayout="dropdown"
//                                       onSelect={(date) => {
//                                         setAdvanceFilters((prev) => ({ ...prev, endDate: toDateKey(date) }));
//                                         setEndOpen(false);
//                                       }}
//                                     />
//                                   </PopoverContent>
//                                 </Popover>
//                               </Field>
//                             </div>
//                             {/* AWB Number */}
//                             <div className=" w-full">
//                               <label className="block text-xs text-gray-600 mb-1">
//                                 AWB Number
//                               </label>
//                               <input
//                                 type="text"
//                                 value={advanceFilters.awbNumber}
//                                 onChange={(e) =>
//                                   setAdvanceFilters((prev) => ({
//                                     ...prev,
//                                     awbNumber: e.target.value,
//                                   }))
//                                 }
//                                 placeholder="Enter AWB(s)"
//                                 className="border w-full px-3 py-2 rounded text-sm"
//                               />
//                             </div>
//                             {/*  Button */}
//                             <div className=" w-full flex">
//                               <button
//                                 type="submit"
//                                 className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-1"
//                               >
//                                 Filter
//                               </button>
//                               <button
//                                 type="button"
//                                 onClick={() => {
//                                   resetAdvanceFilters();
//                                   setFilterUpdate((prev) => !prev);
//                                   setIsFilterOpen(false);
//                                 }}
//                                 className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-1"
//                               >
//                                 Reset
//                               </button>
//                             </div>
//                           </div>
//                         </form>
//                       </div>
//                     </div>
//                     <DrawerFooter>
//                       <DrawerClose asChild>
//                         <Button variant="outline">Cancel</Button>
//                       </DrawerClose>
//                     </DrawerFooter>
//                   </DrawerContent>
//                 </Drawer>
//               </div>
//             </div>
//           </div>
  
//           <div className="flex min-h-0 min-w-0 flex-1 flex-col rounded-md dark:bg-gray-900">
//             <div className="z-20 w-full shrink-0 bg-white px-2 shadow-sm dark:bg-gray-900 sm:px-4">
//               <div className="relative flex justify-left ">
//                 <div
//                   className="flex  overflow-x-auto  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 "
//                   onWheel={(e) => {
//                     if (e.deltaY === 0) return;
//                     e.currentTarget.scrollLeft += e.deltaY;
//                   }}
//                 >
//                   <div className="flex gap-2  min-w-max  mt-0">
//                     {" "}
//                     {/* Added padding on sides */}
//                     {status.map((st) => (
//                       <Button
//                         key={st}
//                         onClick={() => {
//                           setSelectedStatus(st);
//                           setPage(1);
//                           setEditingStatusId(null);
//                           setSelectedBulkOrders([]);
                         
//                           setIsOpenIndividualAssignmnet("");
//                         }}
//                         className={`px-5 py-2.5 rounded-sm my-2 border transition-all duration-300 font-medium text-sm tracking-wide ${
//                           selectedStatus === st
//                             ? "bg-[#0446DB] text-white shadow-sm  border-transparent"
//                             : "bg-white hover:bg-[#0446DB] hover:text-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]"
//                         }`}
//                       >
//                         {st === "ndr" ? "NDR" : toCapitalizeEachWord(st)}
//                         {selectedStatus === st && ` (${totalOrders}) `}
//                       </Button>
//                     ))}

//                                         {[
//                                           'undelivered',
//                                           "undelivered assigned",
//                                           "ndr",
//                                           "rto in transit",
//                                           "rto delivered",
//                                                 ].includes(selectedStatus) && (
//                                                   <Button
//                                                     className="my-2 rounded-sm border border-[#0446DB] bg-[#0446DB] px-2 py-2.5 text-sm font-medium tracking-wide text-white transition-all duration-300"
//                                                   >
//                                                     {selectedStatus === "rto in transit"
//                                                       ? "RTO In Transit"
//                                                       : selectedStatus === "rto delivered"
//                                                         ? "RTO Delivered"
//                                                         : toCapitalizeEachWord(selectedStatus)}
                      
//                                                     {` (${totalOrders})`}
//                                                   </Button>
//                                                 )}
                    
                    
                    
                    
//                                           <DropdownMenu>
//                                             <DropdownMenuTrigger asChild>
//                                               <button
//                                                 type="button"
//                                                 className="inline-flex h-8 mt-2 items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-blue-200 bg-blue-50 px-2 text-sm font-medium text-[#0446DB] shadow-sm transition-all duration-200 hover:border-[#0446DB] hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 data-[state=open]:border-[#0446DB] data-[state=open]:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400"
//                                               >
//                                                 More
//                                                 <ChevronDown className="h-4 w-4 transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
//                                               </button>
//                                             </DropdownMenuTrigger>
//                                             <DropdownMenuContent className="!w-52 !min-w-52">
//                                               {[
//                                                 "undelivered",
//                                                "undelivered assigned",
//                                                 "ndr",
//                                                 "rto in transit",
//                                                 "rto delivered",
//                                               ].map((s) => {
//                                                 return (
//                                                   <>
//                                                     <DropdownMenuItem
//                                                       onClick={() => {
//                                                         setSelectedBulkOrders([]);
//                                                         setSelectedStatus(s);
                                                        
//                                                         setPage(1);
                                                       
//                                                       }}
//                                                       variant={
//                                                         s === "cancelled"
//                                                           ? "destructive"
//                                                           : "default"
//                                                       }
//                                                       className={`${selectedStatus == s ? "bg-[#0446DB] hover:bg-[#0446DB]  text-white" : " hover:bg-[#0446DB] hover:text-white "}`}
//                                                     >
//                                                       {s.toLowerCase() === "rto"
//                                                         ? "RTO"
//                                                         : s.charAt(0).toUpperCase() + s.slice(1)}
//                                                     </DropdownMenuItem>
//                                                     <DropdownMenuSeparator />
//                                                   </>
//                                                 );
//                                               })}
//                                             </DropdownMenuContent>
//                                           </DropdownMenu>
//                   </div>
//                 </div>
//               </div>
//               {supportsVendorGroups && selectedBulkOrders.length > 0 && (
//                 <div className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-900 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200">
//                   <span>
//                     <strong>{selectedBulkOrders.length} selected</strong> — {selectedVendorGroup === "mapped"
//                       ? "Vendor mapped orders: Cancel Vendor Mapping"
//                       : "Unmapped orders: Assign to Rider / Vendor"}. Other group checkboxes are disabled.
//                   </span>
//                   <button type="button" onClick={() => setSelectedBulkOrders([])} className="font-semibold underline">Clear selection</button>
//                 </div>
//               )}
//               {selectedBulkOrders.length > 0 &&
//               (selectedStatus === "pending pickup" ||
//                 selectedStatus === "out for delivery" ||
//                 selectedStatus === "rto in transit" ||
//                 selectedStatus === "picked" ||
//                 selectedStatus === "undelivered") && (
//                 <AlertDialog>
//                   {/* ================= ACTION BUTTON ================= */}
//                   <AlertDialogTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className="my-1 h-7 py-2 cursor-pointer rounded-sm border-[#0446DB] bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-blue-50 hover:text-[#0446DB] dark:border-blue-500 dark:bg-[#0446DB] dark:text-white dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
//                     >
//                       Action
//                     </Button>

                 
//                   </AlertDialogTrigger>

//                   {/* ================= MAIN POPUP ================= */}
//                   <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
//                     {/* ================= HEADER ================= */}
//                     <AlertDialogHeader className="border-b border-neutral-200 px-5 py-4 text-left dark:border-neutral-800">
//                       <AlertDialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
//                         Bulk Order Actions
//                       </AlertDialogTitle>

//                       <AlertDialogDescription className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
//                         Manage{" "}
//                         <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                           {selectedBulkOrders?.length || 0}
//                         </span>{" "}
//                         selected orders.
//                       </AlertDialogDescription>
//                     </AlertDialogHeader>

//                     {/* ================= CONTENT ================= */}
//                     <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5">
//                       {/* =====================================================
//                           RTO IN TRANSIT
//                       ===================================================== */}

//                       {selectedStatus === "rto in transit" && (
//                         <div className="overflow-hidden rounded-sm border border-blue-200 dark:border-blue-500/20">
//                           {/* CARD HEADER */}
//                           <div className="border-b border-blue-100 bg-blue-50/70 px-4 py-3 dark:border-blue-500/20 dark:bg-blue-500/5">
//                             <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                               RTO Delivery
//                             </h3>

//                             <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                               Mark the selected RTO order as delivered.
//                             </p>
//                           </div>

//                           <div className="space-y-4 p-4">
//                             {!editingStatusId ? (
//                               <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                                 <div>
//                                   <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                     Bulk RTO Delivered
//                                   </p>

//                                   <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                     Update{" "}
//                                     <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                       {selectedBulkOrders?.length || 0}
//                                     </span>{" "}
//                                     selected orders.
//                                   </p>
//                                 </div>

//                                 <Button
//                                   type="button"
//                                   onClick={() => {
//                                     setEditingStatusId(true);
//                                   }}
//                                   className="h-9 cursor-pointer rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-[#0339B5]"
//                                 >
//                                   Bulk RTO Delivered
//                                 </Button>
//                               </div>
//                             ) : (
//                               <>
//                                 <div>
//                                   <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                                     Change Status
//                                     <span className="ml-1 text-red-500">*</span>
//                                   </label>

//                                   <select
//                                     id="bulkRtoStatus"
//                                     defaultValue=""
//                                     disabled={bulkActionLoading}
//                                     className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
//                                   >
//                                     <option value="" disabled>
//                                       Change Status
//                                     </option>

//                                     <option value="rto delivered">
//                                       RTO Delivered
//                                     </option>
//                                   </select>
//                                 </div>

//                                 <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
//                                   <div>
//                                     <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                       Update RTO Status
//                                     </p>

//                                     <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                       Confirm status update for the selected order.
//                                     </p>
//                                   </div>

//                                   <div className="flex items-center gap-2">
//                                     <Button
//                                       type="button"
//                                       variant="outline"
//                                       disabled={bulkActionLoading}
//                                       onClick={() => {
//                                         setEditingStatusId(null);
//                                       }}
//                                       className="h-9 cursor-pointer rounded-sm px-4 text-sm font-medium"
//                                     >
//                                       Cancel
//                                     </Button>

//                                     <Button
//                                       type="button"
//                                       disabled={bulkActionLoading}
//                                       onClick={async () => {
//                                         const select =
//                                           document.getElementById("bulkRtoStatus");

//                                         const newStatus = select?.value;

//                                         if (!newStatus) {
//                                           toast.error("Please Select Status");
//                                           return;
//                                         }

//                                         try {
//                                           setBulkActionLoading(true);

//                                           await changeStatus(
//                                             selectedBulkOrders[0].id,
//                                             newStatus
//                                           );
//                                         } finally {
//                                           setBulkActionLoading(false);
//                                         }
//                                       }}
//                                       className="h-9 min-w-[110px] cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-60"
//                                     >
//                                       {bulkActionLoading ? (
//                                         <>
//                                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                           Updating...
//                                         </>
//                                       ) : (
//                                         "Continue"
//                                       )}
//                                     </Button>
//                                   </div>
//                                 </div>
//                               </>
//                             )}
//                           </div>
//                         </div>
//                       )}

//                       {/* =====================================================
//                           PICKED / UNDELIVERED - ASSIGN RIDER
//                       ===================================================== */}

//                       {(selectedStatus === "picked" || selectedStatus === "undelivered")  && (
//                         <div className="overflow-hidden rounded-sm border border-blue-200 dark:border-blue-500/20">
//                           {/* CARD HEADER */}
//                           <div className="border-b border-blue-100 bg-blue-50/70 px-4 py-3 dark:border-blue-500/20 dark:bg-blue-500/5">
//                             <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                               Assign Orders to Rider
//                             </h3>

//                             <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                               Assign all currently selected orders to a rider.
//                             </p>
//                           </div>

//                           <div className="space-y-4 p-4">
//                             {!assign ? (
//                               <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                                 <div>
//                                   <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                     Assign Selected Orders
//                                   </p>

//                                   <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                     Select a rider for{" "}
//                                     <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                       {selectedBulkOrders?.length || 0}
//                                     </span>{" "}
//                                     selected orders.
//                                   </p>
//                                 </div>

//                                 <Button
//                                   type="button"
//                                   disabled={assignRiderLoading}
//                                   onClick={async () => {
//                                     const order_ids = [
//                                       ...new Set(
//                                         selectedBulkOrders.map((o) => o.id)
//                                       ),
//                                     ];

//                                     try {
//                                       setAssignRiderLoading(true);

//                                       const hasRiders = await fetchReassignRiders(order_ids);
//                                       if (hasRiders) setAssign(true);
//                                     } finally {
//                                       setAssignRiderLoading(false);
//                                     }
//                                   }}
//                                   className="h-9 min-w-[120px] cursor-pointer rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-60"
//                                 >
//                                   {assignRiderLoading ? (
//                                     <>
//                                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                       Loading...
//                                     </>
//                                   ) : (
//                                     "Assign Orders"
//                                   )}
//                                 </Button>
//                               </div>
//                             ) : (
//                               <>
//                                 {/* RIDER SELECT */}

//                                 <div>
//                                   <label
//                                     htmlFor="riderSelect"
//                                     className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
//                                   >
//                                     Select Rider
//                                     <span className="ml-1 text-red-500">*</span>
//                                   </label>

//                                   <select
//                                     id="riderSelect"
//                                     value={newRider || ""}
//                                     disabled={assignRiderLoading}
//                                     onChange={(e) =>
//                                       setNewRider(e.target.value)
//                                     }
//                                     className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
//                                   >
//                                     <option value="">
//                                       Select Rider
//                                     </option>

//                                     {reassignRidersOptions.map((rider) => (
//                                       <option
//                                         key={rider.value}
//                                         value={rider.value}
//                                       >
//                                         {rider.label}
//                                       </option>
//                                     ))}
//                                   </select>
//                                 </div>

//                                 {/* ASSIGN ACTION */}

//                                 <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
//                                   <div>
//                                     <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                       Assign Selected Orders
//                                     </p>

//                                     <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                       Assign{" "}
//                                       <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                         {selectedBulkOrders?.length || 0}
//                                       </span>{" "}
//                                       selected orders to the chosen rider.
//                                     </p>
//                                   </div>

//                                   <div className="flex items-center gap-2">
//                                     <Button
//                                       type="button"
//                                       variant="outline"
//                                       disabled={assignRiderLoading}
//                                       onClick={() => {
//                                         setAssign(false);
//                                         setNewRider("");
//                                       }}
//                                       className="h-9 cursor-pointer rounded-sm px-4 text-sm font-medium"
//                                     >
//                                       Cancel
//                                     </Button>

//                                     <Button
//                                       type="button"
//                                       disabled={assignRiderLoading}
//                                       onClick={async () => {
//                                         if (!newRider) {
//                                           toast.error("Please select a rider.");
//                                           return;
//                                         }

//                                         const ids = selectedBulkOrders.map(
//                                           (order) => order.id
//                                         );

//                                         try {
//                                           setAssignRiderLoading(true);

//                                           const success = await assignBulkOrderRider(ids, newRider);
//                                           if (success) {
//                                             setNewRider("");
//                                             setAssign(false);
//                                           }
//                                         } catch (error) {
//                                           console.error(error);
//                                         } finally {
//                                           setAssignRiderLoading(false);
//                                         }
//                                       }}
//                                       className="h-9 min-w-[105px] cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-60"
//                                     >
//                                       {assignRiderLoading ? (
//                                         <>
//                                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                           Assigning...
//                                         </>
//                                       ) : (
//                                         "Continue"
//                                       )}
//                                     </Button>
//                                   </div>
//                                 </div>
//                               </>
//                             )}
//                           </div>
//                         </div>
//                       )}
                       

//                        {
//                          (supportsVendorGroups && selectedVendorGroup === 'mapped' && selectedBulkOrders.every(isVendorMapped))  && (
//                           <div className="overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
//                                                           <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
//                                                             <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                                                               Change Order Status
//                                                             </h3>
                          
//                                                             <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                                                               Select an action to apply to all selected
//                                                               orders.
//                                                             </p>
//                                                           </div>
                          
//                                                           <div className="space-y-4 p-4">
//                                                             <div>
//                                                               <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                                                                 Select Status
//                                                               </label>
                          
//                                                               <select
//                                                                 className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
//                                                                 value={bulkStatusState}
//                                                                 onChange={(e) => {
//                                                                   const value = e.target.value;
                          
//                                                                   setBulkStatusState(value);
//                                                                   // if (value === "cancelled") {
//                                                                   //   setNewStatus(value);
//                                                                   // } else {
//                                                                   //   setNewStatus("");
//                                                                   //   setRemark("");
//                                                                   // }
//                                                                 }}
//                                                               >
//                                                                 <option value="">Select Status</option>
//                                                                   <option value="Cancel Vendor Mapped">
//                                                                     Cancel Vendor Mapping
//                                                                   </option>
//                                                               </select>
//                                                             </div>
                          
                                                            
                          
//                                                             {bulkStatusState && (
//                                                               <div className="flex items-center justify-between rounded-sm border border-blue-100 bg-blue-50/50 px-3 py-2.5 dark:border-blue-500/20 dark:bg-blue-500/5">
//                                                                 <div>
//                                                                   <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                                                                     Selected Orders
//                                                                   </p>
                          
//                                                                   <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
//                                                                     This action will be applied to all
//                                                                     selected orders.
//                                                                   </p>
//                                                                 </div>
                          
//                                                                 <span className="rounded-full bg-[#0446DB]/10 px-2.5 py-1 text-xs font-semibold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
//                                                                   {selectedBulkOrders?.length || 0}
//                                                                 </span>
//                                                               </div>
//                                                             )}
                          
//                                                             {bulkStatusState && (
//                                                               <div className="flex justify-end border-t border-neutral-100 pt-4 dark:border-neutral-800">
//                                                                 <Button
//                                                               variant="default"
//                                                               onClick={handleCancelBulkVendorMapping}
//                                                               disabled={!selectedBulkOrders?.length}
//                                                             >
//                                                               Cancel Vendor Mapping
//                                                             </Button>
//                                                               </div>
//                                                             )}
//                                                           </div>
//                           </div>
//                          )
//                        }


//                       {(selectedStatus === "uundelivered") && (
//                         <div className="overflow-hidden rounded-sm border border-emerald-200 dark:border-emerald-500/20">
//                           {/* HEADER */}
//                           <div className="border-b border-emerald-100 bg-emerald-50/70 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/5">
//                             <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                               Assign Orders to Vendor
//                             </h3>
//                             <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                               Assign all currently selected orders to a vendor.
//                             </p>
//                           </div>

//                           <div className="space-y-4 p-4">
//                             {!assignVendor ? (
//                               /* INITIAL ASSIGN BUTTON */
//                               <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                                 <div>
//                                   <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                     Assign Selected Orders
//                                   </p>
//                                   <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                     Select a vendor for{" "}
//                                     <span className="font-semibold text-emerald-600">
//                                       {selectedBulkOrders?.length || 0}
//                                     </span>{" "}
//                                     selected orders.
//                                   </p>
//                                 </div>

//                                 <Button
//                                   type="button"
//                                   disabled={vendorLoading || !selectedBulkOrders?.length}
//                                   onClick={async () => {
//                                     const order_ids = [
//                                       ...new Set(
//                                         (selectedBulkOrders || [])
//                                           .map((order) => order.id)
//                                           .filter((id) => id != null)
//                                       ),
//                                     ];

//                                     if (!order_ids.length) {
//                                       toast.error("Please select at least one order");
//                                       return;
//                                     }

//                                     setSelectedVendor("");
//                                     setAssignVendor(true);

//                                     await getEligibleVendorsByOrders({ order_ids });
//                                   }}
//                                   className="h-9 min-w-[120px] rounded-sm bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
//                                 >
//                                   {vendorLoading ? (
//                                     <>
//                                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                       Loading...
//                                     </>
//                                   ) : (
//                                     "Assign Orders"
//                                   )}
//                                 </Button>
//                               </div>
//                             ) : (
//                               <>
//                                 {/* VENDOR DROPDOWN */}
//                                 <div>
//                                   <div className="mb-1.5 flex items-center justify-between">
//                                     <label
//                                       htmlFor="vendorSelect"
//                                       className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
//                                     >
//                                       Select Vendor <span className="text-red-500">*</span>
//                                     </label>

//                                     {vendorList.length === 0 && (
//                                       <button
//                                         type="button"
//                                         onClick={handleRefreshVendors}
//                                         disabled={vendorLoading}
//                                         className="flex h-8 items-center gap-2 rounded-sm border border-emerald-200 px-3 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 dark:border-emerald-500/30 dark:text-emerald-400"
//                                       >
//                                         <FiRefreshCw
//                                           className={vendorLoading ? "animate-spin" : ""}
//                                         />
//                                         {vendorLoading ? "Refreshing..." : "Refresh"}
//                                       </button>
//                                     )}
//                                   </div>

//                                   <select
//                                     id="vendorSelect"
//                                     value={selectedVendor}
//                                     onChange={(e) => setSelectedVendor(e.target.value)}
//                                     disabled={vendorLoading || vendorList.length === 0}
//                                     className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
//                                   >
//                                     <option value="">
//                                       {vendorLoading
//                                         ? "Loading vendors..."
//                                         : vendorList.length === 0
//                                           ? "No vendors available"
//                                           : "Select Vendor"}
//                                     </option>

//                                     {vendorList.map((vendor) => (
//                                       <option
//                                         key={vendor.vendor_id ?? vendor.id}
//                                         value={vendor.vendor_id ?? vendor.id}
//                                       >
//                                         {vendor.vendor_id}:
//                                         {vendor.vendor_name ??
//                                           vendor.company_name ??
//                                           vendor.name}
//                                       </option>
//                                     ))}
//                                   </select>

//                                   {!vendorLoading && vendorList.length === 0 && (
//                                     <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
//                                       No eligible vendors found. Click Refresh to try again.
//                                     </p>
//                                   )}
//                                 </div>

//                                 {/* FOOTER */}
//                                 <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
//                                   <div>
//                                     <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                       Assign Selected Orders
//                                     </p>
//                                     <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                       Assign{" "}
//                                       <span className="font-semibold text-emerald-600">
//                                         {selectedBulkOrders?.length || 0}
//                                       </span>{" "}
//                                       selected orders to the chosen vendor.
//                                     </p>
//                                   </div>

//                                   <div className="flex items-center gap-2">
//                                     <Button
//                                       type="button"
//                                       variant="outline"
//                                       disabled={vendorLoading}
//                                       onClick={() => {
//                                         setAssignVendor(false);
//                                         setSelectedVendor("");
//                                       }}
//                                       className="h-9 rounded-sm px-4 text-sm font-medium"
//                                     >
//                                       Cancel
//                                     </Button>

//                                     <Button
//                                       type="button"
//                                       disabled={
//                                         vendorLoading ||
//                                         !selectedVendor ||
//                                         !selectedBulkOrders?.length
//                                       }
//                                       onClick={() => {
//                                         const order_ids = [
//                                           ...new Set(
//                                             (selectedBulkOrders || [])
//                                               .map((order) => order.id)
//                                               .filter((id) => id != null)
//                                           ),
//                                         ];

//                                         // Call actual vendor assignment API here
//                                         console.log({
//                                           order_ids,
//                                           vendor_id: Number(selectedVendor),
//                                         });
//                                         assignOrderToVendoe({
//                                           order_ids,
//                                           vendor_id: Number(selectedVendor),
//                                         })
//                                       }}
//                                       className="h-9 min-w-[105px] rounded-sm bg-emerald-600 px-5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
//                                     >
//                                       Continue
//                                     </Button>
//                                   </div>
//                                 </div>
//                               </>
//                             )}
//                           </div>
//                         </div>
//                        )}



//                       {/* =====================================================
//                           OUT FOR DELIVERY
//                       ===================================================== */}

//                       {selectedStatus === "out for delivery" && (
//                         <div className="overflow-hidden rounded-sm border border-blue-200 dark:border-blue-500/20">
//                           {/* HEADER */}

//                           <div className="border-b border-blue-100 bg-blue-50/70 px-4 py-3 dark:border-blue-500/20 dark:bg-blue-500/5">
//                             <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                               Update Order Status
//                             </h3>

//                             <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                               Update the selected out for delivery orders.
//                             </p>
//                           </div>

//                           <div className="space-y-4 p-4">
//                             {!bulkStatusState ? (
//                               <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                                 <div>
//                                   <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                     Mark Orders Delivered
//                                   </p>

//                                   <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                     Update{" "}
//                                     <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                       {selectedBulkOrders?.length || 0}
//                                     </span>{" "}
//                                     selected orders.
//                                   </p>
//                                 </div>

//                                 <Button
//                                   type="button"
//                                   onClick={() => {
//                                     setBulkStatusState(true);
//                                   }}
//                                   className="h-9 cursor-pointer rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-[#0339B5]"
//                                 >
//                                   Update Status
//                                 </Button>
//                               </div>
//                             ) : (
//                               <>
//                                 {/* STATUS */}

//                                 <div>
//                                   <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
//                                     Change Status
//                                     <span className="ml-1 text-red-500">*</span>
//                                   </label>

//                                   <select
//                                     id="bulkDeliveryStatus"
//                                     defaultValue=""
//                                     disabled={bulkActionLoading}
//                                     className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
//                                   >
//                                     <option value="" disabled>
//                                       Change Status
//                                     </option>

//                                     <option value="delivered">
//                                       Delivered
//                                     </option>
//                                   </select>
//                                 </div>

//                                 {/* ACTION */}

//                                 <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
//                                   <div>
//                                     <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                       Update Selected Orders
//                                     </p>

//                                     <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                       Mark{" "}
//                                       <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                         {selectedBulkOrders?.length || 0}
//                                       </span>{" "}
//                                       selected orders as delivered.
//                                     </p>
//                                   </div>

//                                   <div className="flex items-center gap-2">
//                                     <Button
//                                       type="button"
//                                       variant="outline"
//                                       disabled={bulkActionLoading}
//                                       onClick={() => {
//                                         setBulkStatusState(false);
//                                       }}
//                                       className="h-9 cursor-pointer rounded-sm px-4 text-sm font-medium"
//                                     >
//                                       Cancel
//                                     </Button>

//                                     <Button
//                                       type="button"
//                                       disabled={bulkActionLoading}
//                                       onClick={async () => {
//                                         const select =
//                                           document.getElementById(
//                                             "bulkDeliveryStatus"
//                                           );

//                                         const newStatus = select?.value;

//                                         if (!newStatus) {
//                                           toast.error("Please Select Status");
//                                           return;
//                                         }

//                                         try {
//                                           setBulkActionLoading(true);

//                                           for (const order of selectedBulkOrders) {
//                                             await markOrdersDeliveredBulk(
//                                               order.id
//                                             );
//                                           }
//                                         } finally {
//                                           setBulkActionLoading(false);
//                                         }
//                                       }}
//                                       className="h-9 min-w-[120px] cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-60"
//                                     >
//                                       {bulkActionLoading ? (
//                                         <>
//                                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                           Updating...
//                                         </>
//                                       ) : (
//                                         "Continue"
//                                       )}
//                                     </Button>
//                                   </div>
//                                 </div>
//                               </>
//                             )}
//                           </div>
//                         </div>
//                       )}

//                       {/* =====================================================
//                           PENDING PICKUP
//                       ===================================================== */}

//                       {selectedStatus === "pending pickup" && (
//                         <div className="overflow-hidden rounded-sm border border-blue-200 dark:border-blue-500/20">
//                           {/* HEADER */}

//                           <div className="border-b border-blue-100 bg-blue-50/70 px-4 py-3 dark:border-blue-500/20 dark:bg-blue-500/5">
//                             <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
//                               Pickup Orders
//                             </h3>

//                             <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//                               Mark all currently selected orders as picked.
//                             </p>
//                           </div>

//                           <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
//                             <div>
//                               <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                                 Mark Bulk Pickup
//                               </p>

//                               <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                                 Mark{" "}
//                                 <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                                   {selectedBulkOrders?.length || 0}
//                                 </span>{" "}
//                                 selected orders as picked.
//                               </p>
//                             </div>

//                             <Button
//                               type="button"
//                               disabled={bulkActionLoading}
//                               onClick={async () => {
//                                 const order_ids =
//                                   selectedBulkOrders.map(
//                                     (order) => order.id
//                                   );

//                                 try {
//                                   setBulkActionLoading(true);

//                                   await PickedOrder(order_ids);
//                                 } catch (error) {
//                                   console.error(error);
//                                 } finally {
//                                   setBulkActionLoading(false);
//                                 }
//                               }}
//                               className="h-9 min-w-[145px] cursor-pointer rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-60"
//                             >
//                               {bulkActionLoading ? (
//                                 <>
//                                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                   Processing...
//                                 </>
//                               ) : (
//                                 "Mark Bulk Pickup"
//                               )}
//                             </Button>
//                           </div>
//                         </div>
//                       )}

//                       {/* =====================================================
//                           CLEAR SELECTION
//                       ===================================================== */}

//                       <div className="flex flex-col gap-4 rounded-sm border border-red-200 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between">
//                         <div className="min-w-0">
//                           <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
//                             Clear Selection
//                           </p>

//                           <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
//                             Remove all currently selected orders and reset bulk actions.
//                           </p>
//                         </div>

//                         <Button
//                           type="button"
//                           variant="outline"
//                           disabled={
//                             bulkActionLoading ||
//                             assignRiderLoading
//                           }
//                           onClick={() => {
//                             setSelectedBulkOrders([]);
//                             setEditingStatusId(null);
//                             setBulkStatusState(false);
//                             setNewRider("");
//                             setAssign(false);
//                           }}
//                           className="h-9 cursor-pointer rounded-sm border-red-200 bg-white px-4 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
//                         >
//                           Clear Selected
//                         </Button>
//                       </div>
//                     </div>

//                     {/* ================= FOOTER ================= */}

//                     <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 my-0 dark:border-neutral-800 dark:bg-neutral-950/30">
//                       <AlertDialogCancel
//                         disabled={
//                           bulkActionLoading ||
//                           assignRiderLoading
//                         }
//                         onClick={() => {
//                           setEditingStatusId(null);
//                           setBulkStatusState(false);
//                           setNewRider("");
//                           setAssign(false);
//                           clearAllState()
//                         }}
//                         className="cursor-pointer rounded-sm"
//                       >
//                         Close
//                       </AlertDialogCancel>
//                     </AlertDialogFooter>
//                   </AlertDialogContent>
//                 </AlertDialog>
//               )}
//             </div>
  
            


              


             
  
//             {/* Table */}
//             <div className="min-h-0 min-w-0 w-full flex-1 overflow-hidden bg-white dark:bg-gray-900">
//   <div className="h-full w-full overflow-auto overscroll-contain">
//               <Table className="w-full min-w-max border-separate border-spacing-0">
//                 <TableHeader className="bg-slate-50 dark:bg-gray-800">
//                  <TableRow className="hover:bg-transparent">
//                     {
//                     selectedStatus === "picked" ||
//                     selectedStatus === "rto in transit" ||
//                     selectedStatus === "undelivered" ? (
//                       <TableHead className="sticky top-0 z-30 bg-white dark:bg-gray-900 px-6 py-4">
//                         <div>
//                           <span>
//                             <input
//                               type="checkbox"
//                               className="w-4 h-4 text-indigo-600 rounded border-gray-300"
//                               checked={
//                                 eligibleSelectableOrders.length > 0 &&
//                                 eligibleSelectableOrders.every((order) =>
//                                   selectedBulkOrders.some((selected) => selected.id === order.id)
//                                 )
//                               }
//                               onChange={toggleSelectAll}
//                             />
//                           </span>
//                         </div>
//                       </TableHead>
//                     ) : (
//                       <TableHead className="sticky top-0 z-30 bg-white dark:bg-gray-900 px-6 py-4">-</TableHead>
//                     )}
  
//                     <TableHead className="sticky top-0 z-40 whitespace-nowrap border-b border-slate-200 bg-slate-50 px-6 py-3 text-left font-semibold text-slate-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
//   ORDER ID
// </TableHead>
//                     <TableHead className="sticky top-0 z-30 bg-white dark:bg-gray-900 text-left whitespace-nowrap uppercase px-6 py-3">
//                      Seller Details
//                     </TableHead>
                    
//                     <TableHead className="sticky top-0 z-30 bg-white dark:bg-gray-900 text-left whitespace-nowrap px-6 py-3">
//                       CONSIGNEE ADDRESS
//                     </TableHead>

//                     {(
//                         selectedStatus === "out for delivery" ||
//                         selectedStatus === "delivered" ||
//                         selectedStatus === "in transit" ||
//                         selectedStatus === "rto in transit" ||
//                         selectedStatus === "undelivered assigned") && (
//                         <>
//                           <TableHead className="sticky top-0 z-30 whitespace-nowrap bg-white py-3 text-left font-semibold dark:bg-gray-900 dark:text-white">
//                             RIDER ID/VENDOR ID
//                           </TableHead>
//                         </>
//                       )}
//                     <TableHead className="sticky top-0 z-30 bg-white dark:bg-gray-900 text-left whitespace-nowrap px-6 py-3">
//                       PACKAGE DETAILS
//                     </TableHead>
//                     <TableHead className="sticky top-0 z-30 bg-white dark:bg-gray-900 text-left whitespace-nowrap px-6 py-3">
//                       ASSIGNMENT
//                     </TableHead>
//                     <TableHead className="sticky top-0 z-30 bg-white dark:bg-gray-900 text-left whitespace-nowrap px-6 py-3">
//                       STATUS
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {loading ? (
//                     <>
//                       <TableRow>
//                         <TableCell colSpan={10} className="text-center py-10">
//                           <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//                           <p className="mt-2">Loading orders...</p>
//                         </TableCell>
//                       </TableRow>
//                     </>
//                   ) : orders.length == 0 ? (
//                     <>
//                       <TableRow>
//                         <TableCell colSpan={10} className="text-center py-10">
//                           No orders found
//                         </TableCell>
//                       </TableRow>
//                     </>
//                   ) : (
//                     orders.map((order) => {
                      
//                       const isVendorMapped = (order) => {
//                         const vendorId = order?.mapped_with;

//                         return (
//                           vendorId !== null &&
//                           vendorId !== undefined &&
//                           String(vendorId).trim() !== "" &&
//                           String(vendorId) !== "0"
//                         );
//                       };

                      
//                       let isSelected;
//                       if (
//                         selectedStatus === "pending pickup" ||
//                         selectedStatus === "rto in transit" ||
//                         selectedStatus === "picked" ||
//                         selectedStatus === "undelivered"
//                       ) {
//                         isSelected = selectedBulkOrders.some(
//                           (o) => o.id === order.id,
//                         );
//                       }

                   
  
//                       return (
//                         <TableRow
//                           key={order.id}
//                           className={`hover:bg-gray-50 ${
//                             isSelected ? "bg-blue-50 text-white" : ""
//                           } dark:hover:bg-gray-800`}
//                         >
//                           {/* Select */}
//                           {(
//                             selectedStatus === "picked" ||
//                             selectedStatus === "rto in transit" ||
//                             selectedStatus === "undelivered") &&
//                           selectableOrders.some((item) => item.id === order.id) ? (
//                             <TableCell className="px-6 py-4 whitespace-nowrap">
//                               <input
//                                 type="checkbox"
//                                 checked={Boolean(isSelected)}
//                                 disabled={!canSelectOrder(order)}
//                                 title={!canSelectOrder(order)
//                                   ? "Clear selection to switch between vendor mapped and unmapped orders"
//                                   : isVendorMapped(order) ? "Vendor mapped order" : "Unmapped order"}
//                                 onChange={(e) => handleOrderSelection(order, e.target.checked)}
//                                 className="h-4 w-4 rounded border-gray-300 text-[#0446DB] disabled:cursor-not-allowed disabled:opacity-30"
//                               />
//                             </TableCell>
//                           ) : (
//                             <TableCell className="px-6 py-4">-</TableCell>
//                           )}






  
//                           {/* Order ID */}
//                           <TableCell className="px-6 py-4">
//                             <div className="text-l flex items-center text-gray-800">
                              
//                               <a
//                                 href={`${frontEndURL}/track-order?awb_number=${order.awb_number}`}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="underline text-blue-700 hover:text-blue-500"
//                               >
//                                 {order.awb_number}
//                               </a>
//                               <button
//                                 className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
//                                 onClick={() => {
//                                   navigator.clipboard.writeText(order.awb_number);
//                                   setCopySuccess(order.awb_number);
//                                   setTimeout(() => {
//                                     setCopySuccess(null);
//                                   }, 2000);
//                                 }}
//                               >
//                                 {copySuccess === order.awb_number ? (
//                                   <CiCircleCheck />
//                                 ) : (
//                                   <FaRegCopy />
//                                 )}
//                               </button>
                              
//                               <AlertDialog>
//                                 <AlertDialogTrigger asChild>
//                                   <button
//   type="button"
//   title="View Details"
//   className="
//     group flex ml-2 h-7 w-7 cursor-pointer items-center justify-center
//     rounded-lg border border-slate-200
//     bg-white text-slate-500
//     shadow-sm transition-all duration-200
//     hover:border-[#0446DB]/30
//     hover:bg-blue-50
//     hover:text-[#0446DB]
//     hover:shadow-md
//     active:scale-95
//     dark:border-slate-700
//     dark:bg-slate-900
//     dark:text-slate-400
//     dark:hover:border-blue-500/30
//     dark:hover:bg-blue-500/10
//     dark:hover:text-blue-400
//   "
// >
//   <HiOutlineDocumentMagnifyingGlass
//     className="h-[19px] w-[19px] transition-transform duration-200 group-hover:scale-110"
//   />
// </button>
//                                 </AlertDialogTrigger>
//                                 <AlertDialogContent
//   className="
//     flex max-h-[92dvh] w-[calc(100%-24px)] !max-w-5xl flex-col
//     overflow-hidden rounded-xl border border-slate-200
//     bg-white p-0 shadow-2xl
//     dark:border-slate-800 dark:bg-[#0d1421]
//   "
// >
//   {/* ================= HEADER ================= */}
//   <AlertDialogHeader className="shrink-0 border-b border-slate-200 px-5 py-4 text-left dark:border-slate-800 sm:px-6">
//     <div className="flex items-start justify-between gap-4">
//       <div>
//         <AlertDialogTitle className="text-lg font-semibold text-slate-900 dark:text-white">
//           Order Details
//         </AlertDialogTitle>

//         <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//           Complete shipment and customer information
//         </p>
//       </div>

//       <div className="hidden items-center gap-2 sm:flex">
//         <span
//           className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
//             order?.order_type === "cod"
//               ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20"
//               : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
//           }`}
//         >
//           {order?.order_type === "cod" ? "COD" : "PREPAID"}
//         </span>

//         <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#0446DB] ring-1 ring-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20">
//           {toCapitalizeEachWord(order?.status)}
//         </span>
//       </div>
//     </div>
//   </AlertDialogHeader>

//   {/* ================= SCROLL BODY ================= */}
//   <div className="min-h-0 flex-1 overflow-y-auto">
//     <div className="space-y-5 p-4 sm:p-6">
//       {/* ================= ORDER SUMMARY ================= */}

//       <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40 sm:p-5">
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div className="min-w-0">
//             <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
//               Order
//             </p>

//             <div className="mt-1 flex flex-wrap items-center gap-2">
//               <p className="truncate text-base font-semibold text-slate-900 dark:text-white">
//                 {order?.merchant_order_id || "N/A"}
//               </p>

//               <div className="flex items-center gap-2 sm:hidden">
//                 <span
//                   className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
//                     order?.order_type === "cod"
//                       ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
//                       : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
//                   }`}
//                 >
//                   {order?.order_type === "cod" ? "COD" : "PREPAID"}
//                 </span>

//                 <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
//                   {toCapitalizeEachWord(order?.status)}
//                 </span>
//               </div>
//             </div>

//             <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
//               AWB: {order?.awb_number || "N/A"}
//             </p>
//           </div>

//           <div className="sm:text-right">
//             <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
//               Total Amount
//             </p>

//             <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
//               ₹{Number(order?.total_amount || 0).toLocaleString("en-IN")}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ================= BASIC INFORMATION ================= */}

//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/30">
//         <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5 dark:border-slate-800 sm:px-5">
//           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
//             <svg
//               className="h-4 w-4"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//               />
//             </svg>
//           </div>

//           <div>
//             <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
//               Basic Information
//             </h3>

//             <p className="text-xs text-slate-500 dark:text-slate-400">
//               Shipment and order information
//             </p>
//           </div>
//         </div>
         
//         <div className="grid grid-cols-1 gap-px overflow-hidden bg-slate-200 sm:grid-cols-2 lg:grid-cols-4 dark:bg-slate-800">
//   {[
//     {
//       label: "Order ID",
//       value: order?.merchant_order_id || "N/A",
//       copy: true,
//     },
//     {
//       label: "AWB Number",
//       value: order?.awb_number || "N/A",
//       copy: true,
//     },
//     {
//       label: "Order Type",
//       value: order?.order_type === "cod" ? "COD" : "Prepaid",
//       type: "orderType",
//     },
//     {
//       label: "Order Specific",
//       value:
//         order?.order_specific === "Turant"
//           ? "Turant"
//           : order?.order_specific?.slice(0, 3) || "N/A",
//     },
//     {
//       label: "Packets",
//       value: order?.number_of_boxes ?? "N/A",
//     },
//     {
//       label: "Weight",
//       value:
//         order?.total_weight !== null &&
//         order?.total_weight !== undefined &&
//         order?.total_weight !== ""
//           ? `${order.total_weight} g`
//           : "N/A",
//     },
//     {
//       label: "Status",
//       value: order?.status
//         ? toCapitalizeEachWord(order.status)
//         : "N/A",
//       type: "status",
//     },
//   ].map((item, index) => (
//     <div
//       key={index}
//       className="
//         group min-w-0 bg-white px-4 py-4
//         transition-colors duration-200
//         hover:bg-slate-50
//         dark:bg-[#0d1421]
//         dark:hover:bg-slate-800/50
//         sm:px-5
//       "
//     >
//       {/* LABEL */}
//       <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400 dark:text-slate-500">
//         {item.label}
//       </p>

//       {/* VALUE */}
//       <div className="flex min-h-7 min-w-0 items-center gap-2">
//         {item.type === "status" ? (
//           <span
//             className="
//               inline-flex max-w-full items-center gap-1.5
//               rounded-full border border-blue-200
//               bg-blue-50 px-2.5 py-1
//               text-xs font-semibold text-[#0446DB]
//               dark:border-blue-500/20
//               dark:bg-blue-500/10
//               dark:text-blue-400
//             "
//           >
//             <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0446DB] dark:bg-blue-400" />

//             <span className="truncate">
//               {item.value}
//             </span>
//           </span>
//         ) : item.type === "orderType" ? (
//           <span
//             className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
//               order?.order_type === "cod"
//                 ? `
//                   border-amber-200 bg-amber-50 text-amber-700
//                   dark:border-amber-500/20
//                   dark:bg-amber-500/10
//                   dark:text-amber-400
//                 `
//                 : `
//                   border-emerald-200 bg-emerald-50 text-emerald-700
//                   dark:border-emerald-500/20
//                   dark:bg-emerald-500/10
//                   dark:text-emerald-400
//                 `
//             }`}
//           >
//             {item.value}
//           </span>
//         ) : (
//           <span
//             className="
//               min-w-0 truncate text-sm
//               font-semibold text-slate-800
//               dark:text-slate-100
//             "
//             title={String(item.value)}
//           >
//             {item.value}
//           </span>
//         )}

//         {/* COPY BUTTON */}
//         {item.copy && item.value !== "N/A" && (
//           <button
//             type="button"
//             title={
//               copySuccess === item.value
//                 ? "Copied"
//                 : `Copy ${item.label}`
//             }
//             onClick={() => {
//               navigator.clipboard.writeText(
//                 String(item.value)
//               );

//               setCopySuccess(item.value);

//               setTimeout(() => {
//                 setCopySuccess(null);
//               }, 2000);
//             }}
//             className="
//               flex h-7 w-7 shrink-0 cursor-pointer
//               items-center justify-center rounded-md
//               text-slate-400 transition-all
//               hover:bg-blue-50
//               hover:text-[#0446DB]
//               active:scale-95
//               dark:text-slate-500
//               dark:hover:bg-blue-500/10
//               dark:hover:text-blue-400
//             "
//           >
//             {copySuccess === item.value ? (
//               <svg
//                 className="h-4 w-4 text-emerald-500"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   clipRule="evenodd"
//                   d="M16.704 5.292a1 1 0 010 1.416l-8 8a1 1 0 01-1.416 0l-4-4a1 1 0 011.416-1.416L8 12.586l7.296-7.294a1 1 0 011.408 0z"
//                 />
//               </svg>
//             ) : (
//               <svg
//                 className="h-4 w-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1.8}
//                   d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
//                 />
//               </svg>
//             )}
//           </button>
//         )}
//       </div>
//     </div>
//   ))}
// </div>
//       </div>

//       {/* ================= DELIVERY + PICKUP ================= */}

//       <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
//         {/* ================= DELIVERY ================= */}

//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/30">
//           <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5 dark:border-slate-800 sm:px-5">
//             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
//               <svg
//                 className="h-4 w-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4m-4 0h4"
//                 />
//               </svg>
//             </div>

//             <div>
//               <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
//                 Delivery Details
//               </h3>

//               <p className="text-xs text-slate-500 dark:text-slate-400">
//                 Customer and delivery address
//               </p>
//             </div>
//           </div>

//           <div className="space-y-5 p-4 sm:p-5">
//             <div>
//               <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
//                 Customer Name
//               </p>

//               <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
//                 {order?.delivery_contact_name || "N/A"}
//               </p>
//             </div>

//             <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
//               <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
//                 Delivery Address
//               </p>

//               <p className="mt-1 text-sm font-medium leading-6 text-slate-800 dark:text-slate-200">
//                 {order?.delivery_address_line || "N/A"}
//               </p>

//               <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
//                 {order?.delivery_city || "N/A"}
//                 {order?.delivery_state
//                   ? `, ${order.delivery_state}`
//                   : ""}
//                 {order?.delivery_pincode
//                   ? ` - ${order.delivery_pincode}`
//                   : ""}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* ================= PICKUP ================= */}

//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/30">
//           <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5 dark:border-slate-800 sm:px-5">
//             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
//               <svg
//                 className="h-4 w-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
//                 />
//               </svg>
//             </div>

//             <div>
//               <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
//                 Pickup Details
//               </h3>

//               <p className="text-xs text-slate-500 dark:text-slate-400">
//                 Pickup contact and warehouse address
//               </p>
//             </div>
//           </div>

//           <div className="space-y-5 p-4 sm:p-5">
//             <div>
//               <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
//                 Pickup Contact
//               </p>

//               <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
//                 {order?.pickup_contact_name || "N/A"}
//               </p>
//             </div>

//             <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
//               <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
//                 Pickup Address
//               </p>

//               <p className="mt-1 text-sm font-medium leading-6 text-slate-800 dark:text-slate-200">
//                 {order?.pickup_address_line || "N/A"}
//               </p>

//               <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
//                 {order?.pickup_city
//                   ? `${order.pickup_city}, ${order?.pickup_state || ""} - ${
//                       order?.pickup_pincode || ""
//                     }`
//                   : "N/A"}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* =========================================================
//           AAPKA EXISTING NDR ACTIONS BLOCK YAHA SAME RAHEGA
//           Iski logic bilkul change mat karo.
//       ========================================================== */}

//       {order?.ndr_actions && order.ndr_actions.length > 0 && (
//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/30">
//           <button
//             type="button"
//             onClick={() => setShowNdrActions(!showNdrActions)}
//             className="flex w-full cursor-pointer items-center justify-between px-4 py-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50 sm:px-5"
//           >
//             <div>
//               <div className="flex items-center gap-2">
//                 <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
//                   NDR Actions
//                 </h3>

//                 <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
//                   {order.ndr_actions.length}
//                 </span>
//               </div>

//               <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
//                 Non-Delivery Reports
//               </p>
//             </div>

//             <svg
//               className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
//                 showNdrActions ? "rotate-180" : ""
//               }`}
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M19 9l-7 7-7-7"
//               />
//             </svg>
//           </button>

//           {showNdrActions && (
//             <div className="space-y-3 border-t border-slate-200 p-4 dark:border-slate-800 sm:p-5">
//               {order.ndr_actions.map((item) => (
//                 <div
//                   key={item.action_id}
//                   className="group rounded-lg border border-slate-200 bg-slate-50/50 p-4 transition hover:border-red-200 hover:bg-red-50/30 dark:border-slate-800 dark:bg-slate-950/30 dark:hover:border-red-500/20 dark:hover:bg-red-500/5"
//                 >
//                   {/* YAHAN AAPKE CURRENT NDR ITEM KA
//                       EXISTING INNER CONTENT SAME PASTE KARO */}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   </div>

//   {/* ================= STICKY FOOTER ================= */}

//                         <AlertDialogFooter className="shrink-0 border-t border-slate-200 bg-slate-50/70 px-4 my-0 dark:border-slate-800 dark:bg-slate-900/50 sm:px-6">
//                           <AlertDialogCancel className="m-0 h-9 cursor-pointer rounded-md border-slate-300 px-5 text-sm font-medium dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
//                             Close
//                           </AlertDialogCancel>
//                         </AlertDialogFooter>
//                               </AlertDialogContent>
//                               </AlertDialog>
//                             </div>
//                             <p className="text-s text-gray-500 dark:text-white">
//                               {new Date(order.created_at).toLocaleString(
//                                 "en-IN",
//                                 {
//                                   timeZone: "Asia/Kolkata",
//                                   day: "2-digit",
//                                   month: "2-digit",
//                                   year: "numeric",
//                                   hour: "2-digit",
//                                   minute: "2-digit",
//                                   hour12: true,
//                                 },
//                               )}
//                             </p>
  
                            
//                             <div className="flex min-w-0 items-center gap-1.5">
//                               <p className="min-w-0 text-xs text-gray-400 dark:text-gray-400">
//                                 <span className="whitespace-nowrap">MOID: </span>

//                                 <span
//                                   className="inline-block max-w-[150px] truncate align-bottom font-medium text-gray-600 dark:text-gray-300"
//                                   title={order?.merchant_order_id}
//                                 >
//                                   {order?.merchant_order_id || "N/A"}
//                                 </span>
//                               </p>

//                               {order?.merchant_order_id && (
//                                 <button
//                                   type="button"
//                                   title="Copy Merchant Order ID"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     navigator.clipboard.writeText(order.merchant_order_id);
//                                     setCopySuccess(order.merchant_order_id);

//                                     setTimeout(() => {
//                                       setCopySuccess(null);
//                                     }, 2000);
//                                   }}
//                                   className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded text-gray-400 transition hover:bg-blue-50 hover:text-[#0446DB] dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
//                                 >
//                                   {copySuccess === order.merchant_order_id ? (
//                                     <span className="text-xs text-green-500">✓</span>
//                                   ) : (
//                                     <svg
//                                       className="h-3.5 w-3.5"
//                                       fill="none"
//                                       stroke="currentColor"
//                                       viewBox="0 0 24 24"
//                                     >
//                                       <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth={2}
//                                         d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
//                                       />
//                                     </svg>
//                                   )}
//                                 </button>
//                               )}
//                             </div>

//                             {/* Vendor and Rider mapping — independent statuses */}
//                             <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
//                               {isVendorMapped(order) ? (
//                                 <span
//                                   title={`Vendor ID: ${order.mapped_with}`}
//                                   className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
//                                 >
//                                   <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//                                   Vendor: {order.mapped_with}
//                                 </span>
//                               ) : (
//                                 <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
//                                   <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
//                                   Vendor Not Mapped
//                                 </span>
//                               )}

//                               {
//                                 !['picked','pending pickup'].includes(order?.status) && (
//                                   order.rider_id != null &&
//                                   String(order.rider_id).trim() !== "" &&
//                                   Number(order.rider_id) > 0 ? (
//                                     <span
//                                       title={`Rider ID: ${order.rider_id}`}
//                                       className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
//                                     >
//                                       <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
//                                       Rider: {order.rider_id}
//                                     </span>
//                                   ) : (
//                                     <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
//                                       <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
//                                       Rider Not Assigned
//                                     </span>
//                                   )

//                                 )
//                               }

//                             </div>

                          
//                           </TableCell>
  
                        
//                          {/* SELLER DETAILS */}
//                             <TableCell className="px-6 py-4 whitespace-pre-line">
//                               <div className="flex flex-col  text-sm">
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
//                                     {order?.brand_name}
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
//                             </TableCell>


                         
  
//                           {/* Address */}
//                           <TableCell className="px-6 py-4 whitespace-pre-line">
//                             <p className="font-medium text-gray-800 dark:text-white">
//                               {order.delivery_contact_name}
//                             </p>
//                             {/* <p className="font-medium text-gray-800">
//                                 {order.delivery_address_line}
//                               </p> */}
//                             <div className="relative inline-block group">
//                               <span className="cursor-pointer whitespace-nowrap dark:text-white text-gray-800 font-medium">
//                                 {String(order.delivery_address_line || "").slice(0, 35)}...
//                               </span>
//                               <div
//                                 className="absolute bottom-full left-1/2 -translate-x-1/2 mb-0
//                                             hidden group-hover:block"
//                               >
//                                 <div className="bg-[#0446DB]  text-white text-xs w-48 px-3 py-1 rounded shadow-lg ">
//                                   {order.delivery_address_line}
//                                 </div>
  
//                                 {/* Arrow */}
//                                 <div className="w-2 h-2 bg-[#0446DB] rotate-45 mx-auto -mt-1"></div>
//                               </div>
//                             </div>
//                             <p className="text-xs whitespace-nowrap dark:text-white text-gray-500">
//                               {order.delivery_city}, {order.delivery_state} -{" "}
//                               {order.delivery_pincode}
//                             </p>
//                             <p className="text-xs text-gray-400">
//                               {order.delivery_country}
//                             </p>
//                           </TableCell>
                         
                         
//                           {(
//                               selectedStatus === "out for delivery" ||
//                               selectedStatus === "delivered" ||
//                               selectedStatus === "in transit" ||
//                               selectedStatus === "rto in transit" ||
//                               selectedStatus === "undelivered assigned") && (
//                               <>
//                                 <TableCell className="px-6 py-4 text-gray-800 dark:text-white whitespace-pre-line">
                                  
//                                  {order?.mapped_with == null && order?.rider_id == null ? (
//                                   "-"
//                                 ) : (
//                                   <p>
//                                     {order?.mapped_with && order?.rider_id
//                                       ? `FP_${order.mapped_with}_${order.rider_id}`
//                                       : order?.mapped_with
//                                         ? `FP_${order.mapped_with}`
//                                         : `R_${order?.rider_id}`}

//                                         <p>
//                                           {order?.pickup_stage == 'at_dc' ? (
//                                             <span>At DC</span>
//                                           ) : order?.pickup_stage == 'at_vendor' ? (<span>At Vendor</span>) : (<></>)}
//                                         </p>
//                                   </p>
//                                 )}
//                                 </TableCell>
//                               </>
//                             )}
                          


                         
  
//                           {/* Package Details */}
//                           <TableCell className="px-6 py-4">
//                             <p>
//                               <span className=" whitespace-nowrap text-gray-800 ">
//                                 EDD: {order.EDD}
//                               </span>
//                             </p>
//                             <p>
//                                 <span className="font-medium text-gray-800 dark:text-white">
//                                   Weight Slab:
//                                 </span>
//                                 {selectedStatus !== "cancelled" && (
//                                   <span
//                                     className={`ml-2 px-2 py-0.5 rounded-full text-sm font-semibold shadow-sm ${
//                                       order?.order_specific === "NDD"
//                                         ? "text-green-800 bg-green-100 border border-green-300"
//                                         : order?.order_specific === "SDD"
//                                           ? "text-yellow-800 bg-yellow-100 border border-yellow-300"
//                                           : order?.order_specific === "Turant"
//                                             ? "text-red-800 bg-red-100 border border-red-300 animate-blink"
//                                             : "text-gray-800 bg-gray-100 border border-gray-300"
//                                     }`}
//                                   >
//                                     {order?.order_specific || "N/A"}
//                                   </span>
//                                 )}
//                               </p>
//                                {order?.order_type && (
//                                   <p className="flex flex-wrap mt-1 items-center gap-2 text-gray-700 dark:text-gray-300">
//                                     <span className="font-medium text-gray-900 dark:text-white">
//                                       Payment Details:
//                                     </span>

//                                     <span
//                                       className={`inline-flex items-center gap-2  text-xs font-bold ${
//                                         order.order_type.toUpperCase() === "COD"
//                                           ? " text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300"
//                                           : order.order_type.toUpperCase() === "PREPAID"
//                                             ? " text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
//                                             : "border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
//                                       }`}
//                                     >
                                      

//                                       <span className="font-extrabold">
//                                         {Number(order.total_amount || 0).toLocaleString("en-IN", {
//                                           style: "currency",
//                                           currency: "INR",
//                                           maximumFractionDigits: 2,
//                                         })}
//                                       </span>

//                                       <span className="opacity-40">|</span>

//                                       {order.order_type.toUpperCase() === "COD"
//                                         ? "COD"
//                                         : order.order_type.toUpperCase() === "PREPAID"
//                                           ? "Prepaid"
//                                           : order.order_type}
//                                     </span>
//                                   </p>
//                                 )}
//                             <p className="text-gray-800 ">
//                               <span className="font-medium  text-gray-800">
//                                 Dimensions:
//                               </span>{" "}
//                               {order.package_length}x{order.package_breadth}x
//                               {order.package_height}
//                             </p>
//                           </TableCell>
  
//                           {/* Assignment */}
//                           {selectedStatus === "All" ? (
//                             <>
//                               <TableCell className="px-6 py-4">
//                                 {order.status === "pending pickup" ||
//                                 order.status === "in transit" ||
//                                 order.status === "picked" ||
//                                 order.status === "undelivered" ||
//                                 order.status === "undelivered assigned" ? (
//                                   <>
//                                     {!(
//                                       isOpenIndividualAssignmnet === order.id
//                                     ) ? (
//                                       <span
//                                         className={`px-3 py-1 rounded-full text-xs font-medium ${getAssignmentStatusColor(order, order.mapped_with)} whitespace-nowrap mb-2 inline-block cursor-pointer`}
//                                       >
//                                         {getAssignmentStatusText(order)}
//                                       </span>
//                                     ) : (
//                                       <></>
//                                     )}
//                                   </>
//                                 ) : order.status === "cancelled" ? (
//                                   <span className="px-3  whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
//                                     Order Canceled
//                                   </span>
//                                 ) : order.status === "delivered" ? (
//                                   <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                     Order Delivered
//                                   </span>
//                                 ) : order.status === "rto delivered" ? (
//                                   <span className="px-3 py-1  whitespace-nowrap rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                     Delivered To Origin
//                                   </span>
//                                 ) : order.status === "ndr" ? (
//                                   <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                     Marked as NDR
//                                   </span>
//                                 ) : (
//                                   <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                     Assigned
//                                   </span>
//                                 )}
//                               </TableCell>
//                             </>
//                           ) : (
//                             <>
//                               <TableCell className="px-6 py-4">
//                                 {order.status === "pending pickup" ||
//                                 order.status === "in transit" ||
//                                 order.status === "picked" ||
//                                 order.status === "undelivered" ||
//                                 order.status === "undelivered assigned" ? (
//                                   <>
//                                     {!(
//                                       isOpenIndividualAssignmnet === order.id
//                                     ) ? (
//                                       <span
//                                         onClick={() => {
//                                            if(order.status === "picked" && order?.mapped_with){
//                                             return
//                                            }


//                                            if(order.status === "in transit" && order?.mapped_with){
//                                             return
//                                            }
//                                           setIsOpenIndividualAssignmnet(order.id);
//                                         }}
//                                         className={`px-3 py-1 rounded-full text-xs font-medium ${getAssignmentStatusColor(order, order.mapped_with)} whitespace-nowrap mb-2 inline-block cursor-pointer`}
//                                       >
//                                         {getAssignmentStatusText(order)}
//                                       </span>
//                                     ) : (
//                                       <form className="flex items-center gap-2">
//                                         {getAssignmentButtons(order)}
//                                         <button
//                                           type="button"
//                                           className="text-xs text-gray-500 hover:underline"
//                                           onClick={() =>
//                                             setIsOpenIndividualAssignmnet("")
//                                           }
//                                         >
//                                           Close
//                                         </button>
//                                       </form>
//                                     )}
//                                   </>
//                                 ) : order.status === "cancelled" ? (
//                                   <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
//                                     Order Canceled
//                                   </span>
//                                 ) : order.status === "delivered" ? (
//                                   <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                     Assignment Completed
//                                   </span>
//                                 ) : order.status === "rto delivered" ? (
//                                   <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                     Delivered To Origin
//                                   </span>
//                                 ) : order.status === "ndr" ? (
//                                   <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
//                                     Assignment Not Completed
//                                   </span>
//                                 ) : order.status === "rto in transit" ? (
//                                   <>
//                                     <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
//                                       Not Assigned
//                                     </span>
//                                   </>
//                                 ) : (
//                                   <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
//                                     Assigned
//                                   </span>
//                                 )}
//                               </TableCell>
//                             </>
//                           )}
  
                          
//                           {selectedStatus === "All" ? (
//                             <>
//                               <TableCell className="px-6 py-4 whitespace-nowrap">
//                                 {getStatusDisplay(order)}
//                               </TableCell>
//                             </>
//                           ) : (
//                             <>
//                               <TableCell className="px-6 py-4 whitespace-nowrap">
//                                 {order.status === "ndr" ? (
//                                   <>
//                                     {!(
//                                       isOpenIndividualAssignmnet === order.id
//                                     ) ? (
//                                       <span
//                                         onClick={() => {
//                                           setIsOpenIndividualAssignmnet(order.id);
//                                         }}
//                                         className={`px-3 py-1 rounded-full text-xs font-medium ${getAssignmentStatusColor(order, order.mapped_with)} whitespace-nowrap mb-2 inline-block cursor-pointer`}
//                                       >
//                                         {getAssignmentStatusText(order)}
//                                       </span>
//                                     ) : (
//                                       <form className="flex items-center gap-2">
//                                         {getAssignmentButtons(order)}
//                                         <button
//                                           type="button"
//                                           className="text-xs text-gray-500 hover:underline"
//                                           onClick={() =>
//                                             setIsOpenIndividualAssignmnet("")
//                                           }
//                                         >
//                                           Close
//                                         </button>
//                                       </form>
//                                     )}
//                                   </>
//                                 ) : isOpenIndividualAssignmnet === order.id &&
//                                   order.status === "out for delivery" ? (
//                                   <form
//                                     onSubmit={(e) => {
//                                       e.preventDefault();
//                                       const selectedVendor = assignmentState;
//                                       if (!selectedVendor) {
//                                         toast.warn("Please select Status");
//                                         return;
//                                       }
//                                       markOrdersDeliveredBulk(order.id);
//                                       setIsOpenIndividualAssignmnet("");
//                                     }}
//                                     className="flex items-center gap-2"
//                                   >
//                                     <select
//                                       value={assignmentState}
//                                       onChange={(e) =>
//                                         setAssignmentState(e.target.value)
//                                       }
//                                       className="border px-2 py-1 rounded-md"
//                                       required
//                                     >
//                                       <option value="" disabled>
//                                         Select Status
//                                       </option>
//                                       <option key={order.id} value={"delivered"}>
//                                         Delivered
//                                       </option>
//                                     </select>
//                                     <button
//                                       type="submit"
//                                       className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
//                                     >
//                                       Change Status
//                                     </button>
//                                     <button
//                                       type="button"
//                                       className="text-xs text-gray-500 hover:underline"
//                                       onClick={() =>
//                                         setIsOpenIndividualAssignmnet("")
//                                       }
//                                     >
//                                       Close
//                                     </button>
//                                   </form>
//                                 ) : order.status === "out for delivery" ? (
//                                   <>
//                                     <span
//                                       // onClick={() => {
                                        
//                                       //   setIsOpenIndividualAssignmnet(order.id);
//                                       // }}
//                                       className="inline-block cursor-pointer whitespace-nowrap"
//                                     >
//                                       {getStatusDisplay(order)}
//                                     </span>
//                                   </>
//                                 ) : (
//                                   <>
//                                     <span className="inline-block whitespace-nowrap">
//                                       {getStatusDisplay(order)}
//                                     </span>
//                                   </>
//                                 )}
//                               </TableCell>
//                             </>
//                           )}
//                         </TableRow>
//                       );
//                     })
//                   )}
//                 </TableBody>
//               </Table>
//               </div>
//             </div>
  
//             <div className="z-20 flex shrink-0 flex-col items-center justify-between gap-3 border-t border-gray-200 bg-white px-2 py-3 dark:border-gray-700 dark:bg-gray-900 sm:flex-row sm:px-6">
//               {/* Pagination Buttons */}
//               <div className="flex gap-2">
//                 <Button
//                   onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//                   disabled={page === 1}
//                   className={`px-4 py-2 rounded-sm text-sm font-medium ${
//                     page === 1
//                       ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                       : "bg-[#0446DB] text-white hover:bg-indigo-800"
//                   }`}
//                 >
//                   Previous
//                 </Button>
  
//                 <p className="text-sm text-gray-700 self-center">
//                   Page {page} of {totalPages}
//                 </p>
  
//                 <Button
//                   onClick={() =>
//                     setPage((prev) => Math.min(prev + 1, totalPages))
//                   }
//                   disabled={page === totalPages}
//                   className={`px-4 py-2 rounded-sm text-sm font-medium ${
//                     page === totalPages
//                       ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                       : "bg-[#0446DB] text-white hover:bg-indigo-800"
//                   }`}
//                 >
//                   Next
//                 </Button>
//               </div>
  
//               {/* Page Size Selector */}
//               <div className="flex items-center gap-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Per Page
//                 </label>
  
//                 <select
//                   value={limit}
//                   onChange={(e) => {
//                     setLimit(Number(e.target.value)); // ✅ convert to number
//                     setPage(1); // ✅ reset page when limit changes
//                   }}
//                   className="border rounded-sm px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
//                 >
//                   <option value={10}>10</option>
//                   <option value={20}>20</option>
//                   <option value={50}>50</option>
//                   <option value={100}>100</option>
//                   <option value={200}>200</option>
//                 </select>
//               </div>
//             </div>
//           </div>
  
          
  
          
  
          
//           <AlertDialog open={reassignPopup != null} onOpenChange={(isOpen) => !isOpen && setReassignPopup(null)}>
//             <AlertDialogContent className="!max-w-sm">
//               <AlertDialogHeader>
//                 <AlertDialogTitle>
//                   <h2 className=" font-semibold  text-center">
//                     {selectedStatus === "picked" ||
//                     selectedStatus === "undelivered"
//                       ? "Assign Order to a Rider"
//                       : "Reassign Order to a Different Rider"}
//                   </h2>
//                 </AlertDialogTitle>
  
//                 <AlertDialogDescription className="w-full">
//                   {/* Modal Content */}
//                   <div className=" flex w-full">
//                     <form
//                       onSubmit={(e) => {
//                         e.preventDefault();
//                         reassignRider(reassignPopup, newRider);
//                       }}
//                       className="space-y-6 w-full"
//                     >
//                       <div className="w-full  space-y-2">
//                         <label
//                           htmlFor="riderSelect"
//                           className="block text-lg font-medium text-gray-700"
//                         >
//                           Select Rider:
//                         </label>
//                         <select
//                           value={newRider || ""}
//                           onChange={(e) => {
                           
//                             setNewRider(e.target.value)
//                           }}
//                           className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
//                         >
//                           <option value="">Select Rider</option>
  
//                           {reassignRidersOptions.map((rider) => {
                           
//                             return (
//                               <option key={rider.value} value={rider.value}>
//                                 {rider.label}
//                               </option>
//                             );
//                           })}
//                         </select>
//                       </div>
//                     </form>
//                   </div>
//                 </AlertDialogDescription>
//               </AlertDialogHeader>
  
//               <AlertDialogFooter>
//                 <AlertDialogCancel>Cancel</AlertDialogCancel>
  
//                 <AlertDialogAction
//                   onClick={() => {
//                     reassignRider(reassignPopup, newRider);
//                   }}
//                 >
//                   {selectedStatus === "picked" ||
//                   selectedStatus === "pending pickup"
//                     ? "Assign"
//                     : "Reassign"}
//                 </AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>
  
//           {/* Assign Rider Popup */}
//           {reassignRiderPopup && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(46,46,46,0.5)]">
//               <div className="bg-white rounded-sm shadow-2xl w-full max-w-3xl overflow-hidden">
//                 {/* Modal Header */}
//                 <div className="bg-[#0446DB] py-6 px-4">
//                   <h2 className="text-2xl font-semibold text-white text-center">
//                     Assign Order to Rider
//                   </h2>
//                 </div>
  
//                 {/* Modal Content */}
//                 <div className="p-6 space-y-4">
//                   <form
//                     onSubmit={(e) => {
//                       e.preventDefault();
//                       assignOrderToRider(reassignRiderPopup, newRider);
//                     }}
//                     className="space-y-6"
//                   >
//                     <div className="space-y-2">
//                       <label
//                         htmlFor="riderSelect"
//                         className="block text-lg font-medium text-gray-700"
//                       >
//                         Select Rider:
//                       </label>
//                       <Select
//                         options={reassignRidersOptions}
//                         isSearchable
//                         value={reassignRidersOptions.find(
//                           (option) => Number(option.value) === Number(newRider),
//                         ) || null}
//                         onChange={(selectedOption) =>
//                           setNewRider(selectedOption?.value)
//                         }
//                         placeholder="Select Rider"
//                         className="text-sm"
//                         classNamePrefix="react-select"
//                         menuPortalTarget={document.body}
//                         styles={{
//                           menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//                           menu: (base) => ({ ...base, zIndex: 9999 }),
//                         }}
//                       />
//                     </div>
  
//                     {/* Buttons */}
//                     <div className="flex justify-end space-x-4 pt-4">
//                       <button
//                         type="submit"
//                         className="bg-[#0446DB] text-white font-semibold px-5 py-2 rounded-sm hover:bg-indigo-800 transition"
//                       >
//                         Assign
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => setReassignRiderPopup(null)}
//                         className="bg-gray-200 text-gray-700 font-semibold px-5 py-2 rounded-sm hover:bg-gray-300 transition"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )
//     }
//     </>
//   );
// }

// export default DCOrderDetails;






import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Select from "react-select";

import { HiOutlineDocumentMagnifyingGlass } from "react-icons/hi2";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaRegCopy } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { ChevronDown, Download, Filter, Loader2, PackageCheck, UserPlus,X, Zap } from "lucide-react";
import AxiosInstance from "@/Helper/axiosInstance";
import CustomButton from "../../common/CustomButton";
import { FiRefreshCw } from "react-icons/fi";
const baseURL = import.meta.env.VITE_BASE_URL;
const frontEndURL = import.meta.env.VITE_FRONTEND_URL;

const toDateKey = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const fromDateKey = (value) => {
  if (!value) return undefined;
  const normalized = String(value).replace(/\//g, "-");
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(normalized);
  if (!match) return undefined;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const defaultDcFilters = () => {
  const today = new Date();
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  return {
    startDate: toDateKey(monthAgo),
    endDate: toDateKey(today),
    order_id: "",
    awbNumber: "",
    city: "",
    state: "",
    pincode: "",
    rider_id: "",
    order_specific: "",
  };
};

const readApiError = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const saveCsv = (blobData, fileName) => {
  const blob = blobData instanceof Blob
    ? blobData
    : new Blob([blobData], { type: "text/csv;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoke on a later event-loop turn, after the browser starts the download.
  window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
};

function DCOrderDetails() {
const [bulkActionLoading, setBulkActionLoading] = useState(false);
const [assignRiderLoading, setAssignRiderLoading] = useState(false);
const [assign, setAssign] = useState(false);

  const [isOpenIndividualMap, setIsOpenIndividualMap] = useState("");
  const [open, setOpen] = useState(false);
  const [endopen, setEndOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [copySuccess, setCopySuccess] = useState(null);
  const [bulkStatusState, setBulkStatusState] = useState("");
  const [selectedBulkOrders, setSelectedBulkOrders] = useState([]);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [isOpenIndividualAssignmnet, setIsOpenIndividualAssignmnet] = useState("");

  const [reassignPopup, setReassignPopup] = useState(null);
  const [reassignRiderPopup, setReassignRiderPopup] = useState(null);
  const [newRider, setNewRider] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [advanceFilters, setAdvanceFilters] = useState(defaultDcFilters);
  const latestFetchRef = useRef(0);

  const [ndrData, setNdrData] = useState({
    ndr_id: "",
    newRemarks: "",
  });

  const [filterUpdate, setFilterUpdate] = useState(false);

  const [reassignRidersOptions, setReassignRidersOptions] = useState([]);

  const [assignmentState, setAssignmentState] = useState("");

  const [showNdrActions, setShowNdrActions] = useState(false);

  // A vendor mapping is considered active only when mapped_with has a valid ID.
  const isVendorMapped = (order) =>
    order?.mapped_with !== null &&
    order?.mapped_with !== undefined &&
    String(order.mapped_with).trim() !== "" &&
    String(order.mapped_with) !== "0";

  const supportsVendorGroups = ["picked", "undelivered"].includes(selectedStatus);
  const selectedVendorGroup =
    supportsVendorGroups && selectedBulkOrders.length > 0
      ? (isVendorMapped(selectedBulkOrders[0]) ? "mapped" : "unmapped")
      : null;

  const selectableOrders = orders.filter((order) => {
    if (selectedStatus === "pending pickup") return order.mapped_dc_id != null;
    if (selectedStatus === "picked") return order.pickup_stage === "at_dc";
    if (selectedStatus === "undelivered") return true;
    if (selectedStatus === "rto in transit") return true;
    return false;
  });

  const canSelectOrder = (order) =>
    !selectedVendorGroup ||
    (isVendorMapped(order) ? "mapped" : "unmapped") === selectedVendorGroup;

  const eligibleSelectableOrders = selectableOrders.filter(canSelectOrder);

  const handleOrderSelection = (order, checked) => {
    if (!checked) {
      setSelectedBulkOrders((previous) => previous.filter((item) => item.id !== order.id));
      return;
    }
    if (!canSelectOrder(order)) {
      toast.info(
        selectedVendorGroup === "mapped"
          ? "Vendor mapped orders are selected. Clear selection before selecting unmapped orders."
          : "Unmapped orders are selected. Clear selection before selecting vendor mapped orders."
      );
      return;
    }
    setSelectedBulkOrders((previous) =>
      previous.some((item) => item.id === order.id) ? previous : [...previous, order]
    );
  };

  const toggleSelectAll = () => {
    // When no type is selected and both exist, start with unmapped orders.
    // The user can select a mapped order first to select all mapped orders instead.
    const targetGroup = selectedVendorGroup ||
      (supportsVendorGroups ? "unmapped" : null);
    const available = selectableOrders.filter((order) =>
      !targetGroup || (isVendorMapped(order) ? "mapped" : "unmapped") === targetGroup
    );
    if (!available.length) {
      toast.info("Select a vendor mapped order first to select that group.");
      return;
    }
    const ids = new Set(available.map((order) => order.id));
    const allSelected = available.every((order) =>
      selectedBulkOrders.some((item) => item.id === order.id)
    );
    setSelectedBulkOrders((previous) =>
      allSelected
        ? previous.filter((item) => !ids.has(item.id))
        : [...previous.filter((item) => !ids.has(item.id)), ...available]
    );
  };

  // Only reset transient UI after actions. Do NOT erase fetched orders,
  // status tab, pagination or filters (the old version did this).
  const clearAllState = () => {
    setAssign(false);
    setIsOpenIndividualMap("");
    setOpen(false);
    setEndOpen(false);
    setIsOpenIndividualAssignmnet("");
    setReassignPopup(null);
    setReassignRiderPopup(null);
    setShowNdrActions(false);
    setCopySuccess(null);
    setBulkStatusState("");
    setSelectedBulkOrders([]);
    setEditingStatusId(null);
    setAssignmentState("");
    setNewRider("");
    setReassignRidersOptions([]);
    setAssignVendor(false);
    setSelectedVendor("");
    setVendorList([]);
  };

  function toCapitalizeEachWord(str) {
    return String(str || "")
      .split(" ")
      .map((word) => {
        if (!word) return "";
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  }

  const resetAdvanceFilters = () => {
    setAdvanceFilters(defaultDcFilters());
    setPage(1);
  };

  const status = [
    "All",
    "pending pickup",
    "picked",
    "in transit",
    "out for delivery",
    "delivered",
    // "undelivered",
    // "undelivered assigned",
    // "ndr",
    // "rto in transit",
    // "rto delivered",
  ];
  const fetchOrders = async () => {
    const requestId = ++latestFetchRef.current;
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        status: selectedStatus === "All" ? undefined : selectedStatus,
        awb_number: advanceFilters.awbNumber?.trim() || undefined,
        start_date: advanceFilters.startDate || undefined,
        end_date: advanceFilters.endDate || undefined,
        // These filters require matching server-side SQL support.
        order_id: advanceFilters.order_id || undefined,
        city: advanceFilters.city || undefined,
        pincode: advanceFilters.pincode || undefined,
        rider_id: advanceFilters.rider_id || undefined,
        order_specific: advanceFilters.order_specific || undefined,
      };
      const response = await AxiosInstance.get("/api/dc/orders", { params });
      if (requestId !== latestFetchRef.current) return;
      const payload = response.data?.data || {};
      setOrders(Array.isArray(payload.orders) ? payload.orders : []);
      setTotalOrders(Number(payload.total) || 0);
      setTotalPages(Math.max(1, Number(payload.totalPages) || 1));
    } catch (error) {
      if (requestId === latestFetchRef.current) {
        toast.error(readApiError(error, "Unable to load DC orders"));
      }
    } finally {
      if (requestId === latestFetchRef.current) setLoading(false);
    }
  };

  const markOrdersDeliveredBulk = async (orderId) => {
    try {
      const res = await axios.post(
        `${baseURL}/api/vendor/markOrdersDeliveredBulk`,
        { order_ids: [orderId] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success(res.data.message);
      fetchOrders();
      setAssignmentState("");
      setSelectedBulkOrders([]);
     
   
    } catch (err) {
      toast.error(readApiError(err, "Unable to mark order delivered"));
      return;
    } finally {
      setLoading(false);
    }
  };

  

  const cancelRiderAssignment = async (id) => {
    setLoading(true);
    try {

      const res = await AxiosInstance.post('/api/dc/cancelRiderAssignment',{
        order_id:id
      })
      
      if (res.data.success) {
        toast.success("Rider assignment canceled successfully");
        fetchOrders();
      }
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

  const cancelMappedAssignment = async (id) => {
    setLoading(true);
    try {
      const res = await AxiosInstance.post(`/api/dc/orders/${id}/cancelMapping`)
     
      if (res.data.success) {
        toast.success("Mapped assignment canceled successfully");
        fetchOrders();
      }
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

  const fetchReassignRiders = async (orderIdOrIds) => {
    const ids = (Array.isArray(orderIdOrIds) ? orderIdOrIds : [orderIdOrIds])
      .map(Number)
      .filter((value) => Number.isSafeInteger(value) && value > 0);
    if (!ids.length) {
      toast.error("Please select valid order IDs");
      return false;
    }
    try {
      const { data } = await AxiosInstance.get("/api/dc/getRidersOutsideIdealLoad", {
        params: { order_id: [...new Set(ids)].join(",") },
      });
      if (!data?.success) throw new Error(data?.message || "Unable to fetch riders");
      const options = (Array.isArray(data.data) ? data.data : []).map((rider) => ({
        value: Number(rider.rider_id),
        label: `${rider.rider_id}: ${rider.rider_name} | ${rider.total_weight_grams ?? 0}g | ${rider.total_boxes ?? 0} box(es)`,
      }));
      setReassignRidersOptions(options);
      if (!options.length) toast.info("No eligible DC riders currently available");
      return options.length > 0;
    } catch (error) {
      setReassignRidersOptions([]);
      toast.error(readApiError(error, "Error fetching DC riders"));
      return false;
    }
  };

  const reassignRider = async (order_id, new_rider_id) => {
    if (!new_rider_id) return toast.error("Please select a rider");
    const order = orders.find((item) => Number(item.id) === Number(order_id));
    if (!order) return toast.error("Order not found. Refresh the list.");
    // if (order.status === "undelivered" || order.status === "undelivered assigned") {
    //   return toast.error("This DC rider API only accepts picked orders. An undelivered reattempt endpoint is required.");
    // }
    setAssignRiderLoading(true);
    try {
      if (order.status === "in transit" || order.status === "undelivered") {
        // A new assignment cannot be created while the existing one is active.
        const approved = window.confirm(
          "This will cancel the current rider assignment before assigning the new rider. Continue?"
        );
        if (!approved) return;
        await AxiosInstance.post("/api/dc/cancelRiderAssignment", { order_id });
        return
      } else if (order.status !== "picked") {
        return toast.error("Order must be picked before assigning a DC rider");
      }
      try {
        const response = await AxiosInstance.post("/api/dc/assignOrdersToRider", {
          order_id,
          rider_id: Number(new_rider_id),
        });
        if (!response.data?.success) throw new Error(response.data?.message || "Rider assignment failed");
        toast.success(response.data.message || "Rider assigned successfully");
        clearAllState();
      } catch (error) {
        toast.error(readApiError(error, "Assignment failed. If you just cancelled a rider, the order is now available for reassignment."));
      }
      


      await fetchOrders();
    } catch (error) {
      toast.error(readApiError(error, "Unable to cancel the previous rider assignment"));
    } finally {
      setAssignRiderLoading(false);
    }
  };

  const assignBulkOrderRider = async (ids, new_rider_id) => {
    const orderIds = [...new Set((ids || []).map(Number))];
    if (!orderIds.length || orderIds.some((id) => !Number.isSafeInteger(id) || id <= 0)) {
      toast.error("Please select valid orders");
      return false;
    }
    if (selectedBulkOrders.some(isVendorMapped)) {
      toast.error("Vendor mapped orders cannot be selected for this rider assignment action");
      return false;
    }
    if (!new_rider_id) {
      toast.error("Please select a rider");
      return false;
    }
    // DC service currently permits only picked orders at DC/central hub.
    
if (
  selectedBulkOrders.some(
    (order) =>
      !["picked", "undelivered"].includes(
        String(order.status || "").trim().toLowerCase()
      )
  )
) {
  toast.error(
    "Bulk DC rider assignment is supported for picked and undelivered orders only"
  );
  return false;
}

    setAssignRiderLoading(true);
    try {
      const response = await AxiosInstance.post("/api/dc/assignOrdersToRider", {
        order_ids: orderIds,
        rider_id: Number(new_rider_id),
      });
      if (!response.data?.success) throw new Error(response.data?.message || "Assignment failed");
      toast.success(response.data.message || "Orders assigned successfully");
      clearAllState();
      await fetchOrders();
      return true;
    } catch (error) {
      toast.error(readApiError(error, "Error assigning DC orders to rider"));
      return false;
    } finally {
      setAssignRiderLoading(false);
    }
  };

  const PickedOrder = async (order_ids) => {
    if (!Array.isArray(order_ids) || !order_ids.length) {
      toast.error("Select at least one order");
      return false;
    }
    setBulkActionLoading(true);
    try {
      const response = await AxiosInstance.post("/api/dc/markOrdersPickedBulk", {
        order_ids,
      });
      if (!response.data?.success) throw new Error(response.data?.message || "Pickup failed");
      toast.success(response.data.message || "Pickup marked successfully");
      clearAllState();
      await fetchOrders();
      return true;
    } catch (error) {
      toast.error(readApiError(error, "Error marking DC pickup"));
      return false;
    } finally {
      setBulkActionLoading(false);
    }
  };

  const changeNdrStatus = async (data) => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${baseURL}/api/vendor/handleVendorNDReattempt/${data.ndr_id}`,
        {
          remarks: data.newRemarks,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (!res.data.success) {
        toast.error(res.data.message || "Unable to update NDR status");
        return;
      }
      fetchOrders();
      setEditingStatusId(null);
    } catch (err) {
      toast.error("Failed to update status");
      return;
    } finally {
      setLoading(false);
    }
  };
   const [assignVendor, setAssignVendor] = useState(false);
const [selectedVendor, setSelectedVendor] = useState("");
  const [vendorList, setVendorList] = useState([]);
const [vendorLoading, setVendorLoading] = useState(false);


const getEligibleVendorsByOrders = async ({ order_ids }) => {
  try {
    setVendorLoading(true);

    const ids = [...new Set(
      order_ids.map(Number).filter((id) => Number.isSafeInteger(id) && id > 0)
    )];

    if (!ids.length) {
      toast.error("Please select at least one order");
      return;
    }

    const { data } = await AxiosInstance.get(
      "/api/dc/eligibleVendorsByOrders",
      {
        params: { order_ids: ids.join(",") },
      }
    );

    console.log("Eligible Vendors:", data);

    const vendors = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.vendors)
        ? data.vendors
        : [];

    setVendorList(vendors);

  } catch (error) {
    console.error(error);
    setVendorList([]);
    toast.error(
      error.response?.data?.message ||
      "Failed to fetch eligible vendors"
    );
  } finally {
    setVendorLoading(false);
  }
};


const handleRefreshVendors = async () => {
  const order_ids = [
    ...new Set(
      (selectedBulkOrders || [])
        .map((order) => order.id)
        .filter((id) => id !== null && id !== undefined)
    ),
  ];

  setSelectedVendor("");

  await getEligibleVendorsByOrders({ order_ids });
};


const handleCancelBulkVendorMapping = async () => {
  if (!selectedBulkOrders.length) return toast.error("Select at least one order");
  if (!selectedBulkOrders.every(isVendorMapped)) {
    return toast.error("Only vendor mapped orders can have their vendor mapping cancelled");
  }
  const results = await Promise.allSettled(
    selectedBulkOrders.map((order) =>
      AxiosInstance.post(`/api/dc/orders/${order.id}/cancelVendorMapping`)
    )
  );
  const succeeded = results.filter((item) => item.status === "fulfilled").length;
  const failed = results.length - succeeded;
  if (succeeded) toast.success(`${succeeded} vendor mapping(s) cancelled`);
  if (failed) toast.error(`${failed} mapping(s) failed; review orders and retry`);
  clearAllState();
  await fetchOrders();
};

  const changeStatus = async (id, newStatus) => {
    setLoading(true);
    try {
      await axios.post(
        `${baseURL}/api/vendor/markOrdersRtoBulk`,
        {
          order_ids: [id].toString(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      fetchOrders();
      setEditingStatusId(null);
    } catch (err) {
      toast.error("Failed to update status");
      return;
    } finally {
      setLoading(false);
    }
  };

  const assignOrderToRider = async (order_id, rider_id) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/api/vendor/assignOrderToRider`,
        {
          order_id,
          rider_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      fetchOrders();
      setNewRider("");
      setReassignRidersOptions([]);
      setReassignRiderPopup(null);
      setIsOpenIndividualAssignmnet(null);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Error while reassigning order to new rider",
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get assignment buttons based on status and mapped_with
  const getAssignmentButtons = (order) => {
    const { status, mapped_with, id, ndr_id } = order;

    // Rider assignment is possible only after DC pickup.
    // Pending pickup uses the Cancel Mapped / Mark as Picked actions in the Status cell.
    // Case 2: pending pickup && mapped_with !== null
    if (status === "pending pickup" && mapped_with == null) {
      return (
        <>
          <button
            type="button"
            onClick={() => {
              cancelMappedAssignment(id);
              setIsOpenIndividualAssignmnet("");
            }}
            className="bg-[#0446DB] whitespace-nowrap text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 mr-2"
          >
            Cancel Mapped
          </button>
        </>
      );
    }
    if (status === "ndr" && mapped_with !== null) {
      return (
        <>
          <div
            

            className="flex flex-col gap-2"
          >
            <div className="my-0">
              <label className="mx-2">Remarks</label> <br />
              <input
                type="text"
                name="newRemarks"
                onChange={(e) =>
                  setNdrData({ ...ndrData, newRemarks: e.target.value })
                }
                className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1">
              <div
                onClick={() => {
                  changeNdrStatus({ ...ndrData, ndr_id: id });
                }}
                className="bg-[#0446DB] cursor-pointer text-center w-full text-white text-xs px-3 py-1 rounded hover:bg-indigo-800 transition"
              >
                Reattempt
              </div>
            </div>
          </div>
        </>
      );
    }

    // Case 3: in transit && mapped_with === null
    // if (status === "in transit" && mapped_with === null) {
    //   return (
    //     <button
    //       type="button"
    //       onClick={async () => {
    //         await fetchReassignRiders(id);
    //         setReassignPopup(id);
    //       }}
    //       className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 mr-2"
    //     >
    //       Reassign Rider
    //     </button>
    //   );
    // }

    // Case 4: in transit && mapped_with !== null
    if (status === "in transit" || status === "undelivered assigned"  ) {
      return (
        <>
          <button
            type="button"
            onClick={() => {
              cancelRiderAssignment(id);
              setIsOpenIndividualAssignmnet("");
            }}
            className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 mr-2"
          >
            Cancel Rider Assignment
          </button>
          <button
            type="button"
            onClick={async () => {
              await fetchReassignRiders(id);
              setReassignPopup(id);
            }}
            className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 mr-2"
          >
            Reassign Rider
          </button>
        </>
      );
    }

    // Undelivered DC orders can be reassigned to a vendor via bulk action;
    // DC rider assignment is intentionally unavailable until a reattempt API exists.
    // if (status === "undelivered") return null;

    if (status === "undelivered assigned") return null;

    // Case 8: rto in transit && mapped_with !== null - handled in status column

    // For picked status
    if (status === "picked" || status=='undelivered') {
      return (
        <button
          type="button"
          onClick={async () => {
            await fetchReassignRiders(id);
            setReassignPopup(id);
          }}
          className="bg-[#0446DB] whitespace-nowrap text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 mr-2"
        >
          Assign Rider
        </button>
      );
    }

    // Default case for other statuses where reassign is possible
    if (
      ["out for delivery", "delivered", "ndr"].includes(status) &&
      mapped_with !== null
    ) {
      return (
        <>
          <button
            type="button"
            onClick={() => {
              cancelRiderAssignment(id);
              setIsOpenIndividualAssignmnet("");
            }}
            className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 mr-2"
          >
            Cancel Rider Assignment
          </button>
          <button
            type="button"
            onClick={async () => {
              await fetchReassignRiders(id);
              setReassignPopup(id);
            }}
            className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 mr-2"
          >
            Reassign Rider
          </button>
        </>
      );
    }

    return null;
  };

  // Helper function to get status display based on conditions
  const getStatusDisplay = (order) => {
    const { status, mapped_with, id, rider_preference } = order;

    if (status === "pending pickup") {
      return (
        <div className="flex">
          {isOpenIndividualMap === id ? (
            <>
              <button
                type="button"
                onClick={() => {
                  cancelMappedAssignment(id);
                  setIsOpenIndividualAssignmnet("");
                }}
                className="bg-[#0446DB] whitespace-nowrap text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 mr-2"
              >
                Cancel Mapped
              </button>
              {/* <span
                onClick={() => {
                  PickedOrder([id]);
                }}
                className="bg-[#0446DB] whitespace-nowrap text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 cursor-pointer mr-2"
              >
                Mark as Picked
              </span> */}
              <span
                onClick={() => {
                  setIsOpenIndividualMap("");
                  clearAllState()
                }}
                className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 cursor-pointer mr-2"
              >
                Close
              </span>
            </>
          ) : (
            <span
              onClick={() => {
                
              
                setIsOpenIndividualMap(id);
              }}
              className="px-3 py-1 cursor-pointer whitespace-nowrap rounded-full text-xs font-semibold inline-block bg-yellow-100 text-yellow-600"
            >
              Pending Pickup
            </span>
          )}
        </div>
      );
    }

    if (status === "rto in transit") {
      return (
        <>
          {editingStatusId === id ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const newStatus = e.target.elements.status.value;
                if (mapped_with === null) {
                  toast.warning("Order is not mapped with any vendor");
                  return;
                }
                changeStatus(id, newStatus);
              }}
            >
              <div className="flex items-center gap-2">
                <select
                  name="status"
                  defaultValue={status}
                  className="text-xs border border-gray-300 rounded-md px-2 py-1"
                  required
                >
                  <option disabled value="">
                    Change Status
                  </option>
                  <option value="rto delivered">RTO Delivered</option>
                </select>
                <button
                  type="submit"
                  className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => {setEditingStatusId(null)

                    clearAllState()
                  }}
                  className="text-xs text-gray-500 hover:underline"
                >
                  Close
                </button>
              </div>
            </form>
          ) : (
            <span
              onClick={() => {
                if (rider_preference === "daakit" && mapped_with === null) {
                  toast.warning("Order is not mapped with any vendor");
                  return;
                }
                if (mapped_with === null) {
                  toast.warning("Order is not mapped with any vendor");
                  return;
                }
                setEditingStatusId(id);
              }}
              className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-semibold inline-block bg-blue-100 text-blue-600 cursor-pointer"
            >
              RTO In Transit
            </span>
          )}
        </>
      );
    }

    // Default status display
    const statusColors = {
      "out for delivery": "bg-blue-100 text-blue-600",
      delivered: "bg-green-100 text-green-600",
      "undelivered assigned": "bg-yellow-100 text-yellow-600",
      ndr: "bg-red-100 text-red-600",
      "in transit": "bg-purple-100 text-purple-600",
      picked: "bg-teal-100 text-teal-600",
      "rto delivered": "bg-gray-100 text-gray-600",
    };

    const colorClass = statusColors[status] || "bg-green-100 text-green-600";

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${colorClass}`}
      >
        {toCapitalizeEachWord(status)}
      </span>
    );
  };

  // Helper function to get assignment status text
  const getAssignmentStatusText = (order) => {
    const { status, mapped_with } = order;

    if (status === "undelivered" || status === "picked") {
      return "Not Assigned";
    }

    if (status === "pending pickup" && mapped_with) {
      return "Not Assigned";
    }

    if (status === "cancelled") {
      return "Order Canceled";
    }

    if (status === "delivered") {
      return "Order Delivered";
    }

    if (status === "rto delivered") {
      return "Delivered To Origin";
    }

    if (status === "ndr") {
      return "Take Action";
    }
    return "Assigned";
  };

  // Helper function to get assignment status color
  const getAssignmentStatusColor = (order, mapped_with) => {
    const { status } = order;

    if (status === "undelivered" || status === "picked") {
      return "bg-red-100 text-red-600";
    }

    if (status === "cancelled") {
      return "bg-red-100 text-red-600";
    }
    if (status === "pending pickup" && mapped_with) {
      return "bg-red-100 text-red-600";
    }

    if (status === "delivered") {
      return "bg-green-100 text-green-600";
    }

    if (status === "rto delivered") {
      return "bg-green-100 text-green-600";
    }
    if (status === "rto") {
      return "bg-green-100 text-green-600";
    }

    if (status === "ndr") {
      return "bg-green-100 text-green-600";
    }

    return "bg-green-100 text-green-600";
  };

  const exportVendorPendingPickupOrders = async () => {
    try {
      const response = await AxiosInstance.get("/api/dc/orders/exportPendingPickup", {
        responseType: "blob",
      });
      saveCsv(response.data, "dc_pending_pickup_orders.csv");
    } catch (error) {
      toast.error(readApiError(error, "Failed to export pending pickup orders"));
    }
  };

  const exportVendorOrdersWithRider = async () => {
    try {
      const response = await AxiosInstance.get("/api/dc/orders/export", {
        responseType: "blob",
        params: {
          ...{
            start_date: advanceFilters.startDate || undefined,
            end_date: advanceFilters.endDate || undefined,
            awb_number: advanceFilters.awbNumber || undefined,
            status: selectedStatus === "All" ? undefined : selectedStatus,
          },
          // Backend export must implement exportAll=true to avoid 100-row pagination.
        },
      });
      saveCsv(response.data, "dc_orders.csv");
    } catch (error) {
      toast.error(readApiError(error, "Failed to export DC orders"));
    }
  };

  const getOrderSpecificBadge = (orderSpecific = "") => {
    const prefix = String(orderSpecific || "").split("-")[0]; // HLD4HRS, SDD, NDD

    switch (prefix) {
      case "NDD":
        return {
          text: prefix,
          className: "text-green-800 bg-green-100 border border-green-300",
        };

      case "SDD":
        return {
          text: prefix,
          className: "text-yellow-800 bg-yellow-100 border border-yellow-300",
        };

      default:
        return {
          text: prefix,
          className:
            "text-red-800 bg-red-100 border border-red-300 animate-blink",
        };
    }
  };

  const exportVendorRotOrders = async () => {
    try {
      const response = await AxiosInstance.get("/api/dc/orders/exportRto", {
        responseType: "blob",
      });
      saveCsv(response.data, "dc_rto_orders.csv");
    } catch (error) {
      toast.error(readApiError(error, "Failed to export RTO orders"));
    }
  };

  const assignOrderToVendoe = async ({ vendor_id, order_ids }) => {
    if (!vendor_id || !order_ids?.length) return toast.error("Select vendor and orders");
    if (selectedBulkOrders.some(isVendorMapped)) return toast.error("Clear vendor mapped orders before assigning a vendor");
    setVendorLoading(true);
    try {
      const response = await AxiosInstance.post("/api/dc/bulkAssignOrdersToVendor", {
        order_ids,
        vendor_id: Number(vendor_id),
      });
      if (!response.data?.success) throw new Error(response.data?.message || "Vendor assignment failed");
      toast.success(response.data.message || "Orders assigned to vendor");
      clearAllState();
      await fetchOrders();
    } catch (error) {
      toast.error(readApiError(error, "Error assigning orders to vendor"));
    } finally {
      setVendorLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, selectedStatus, limit]);

  useEffect(() => {
    if (filterUpdate) {
      fetchOrders();
      setFilterUpdate(false);
    }
  }, [filterUpdate]);
  const formatToDMY = (dateStr) => {
    const date = fromDateKey(dateStr);
    if (!date) return "";
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };

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
        <>
           <div className=" w-full h-[90vh] flex justify-center items-center">
          <div>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2">Loading Order Details...</p>
          </div>
        </div>
        </>
      ):(
        <div className="flex h-[calc(100dvh-100px)] min-h-0 min-w-0 w-full flex-col overflow-hidden bg-gray-100 dark:bg-gray-900">
          {/* Heading Strip */}
          <div className="z-10 shrink-0 bg-gray-100 pb-3 dark:bg-gray-900">
            <div className="flex w-full min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Heading */}
              <h1 className="text-2xl font-bold dark:text-white">Order Details</h1>
              <div className="grid w-full grid-cols-2 gap-2 text-white sm:grid-cols-4 lg:flex lg:w-auto lg:flex-wrap lg:items-center lg:justify-end">
                {/* Right Side Filters */}
                <CustomButton
                    icon={Download}
                    onClick={exportVendorPendingPickupOrders}
                    className="w-full min-w-0 text-xs sm:text-sm lg:w-auto"
                  >
                    Export Pickup List
                  </CustomButton>
                                  <CustomButton
                    variant="outline"
                    icon={Download}
                    onClick={exportVendorOrdersWithRider}
                    className="w-full min-w-0 text-xs sm:text-sm lg:w-auto"
                  >
                    Export Orders List
                  </CustomButton>
                                  <CustomButton
                      variant="outline"
                      icon={Download}
                      onClick={exportVendorRotOrders}
                      className="w-full min-w-0 text-xs sm:text-sm lg:w-auto"
                    >
                      Export RTO List
                    </CustomButton>
  
                <Drawer
                  direction="right"
                  open={isFilterOpen}
                  onOpenChange={setIsFilterOpen}
                >
                  <DrawerTrigger asChild>
                     <CustomButton variant="outline" icon={Filter} className="w-full min-w-0 text-xs sm:text-sm lg:w-auto">
    Filter
  </CustomButton>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Filter</DrawerTitle>
                      {/* <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}
                    </DrawerHeader>
                    <div className="no-scrollbar overflow-y-auto">
                      <div className="p-4 w-full">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            setPage(1);
                            setFilterUpdate((prev) => !prev);
  
                            setIsFilterOpen(false); // Drawer Close
                          }}
                        >
                          <div className="flex flex-wrap items-end gap-4">
                            {/* Start Date */}
                            <div className=" w-full ">
                              <Field className="mx-auto w-full">
                                <FieldLabel htmlFor="date">Start Date</FieldLabel>
                                <Popover open={open} onOpenChange={setOpen}>
                                  <PopoverTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      id="date"
                                      className="justify-start w-full font-normal"
                                    >
                                      {advanceFilters.startDate
                                        ? formatToDMY(advanceFilters.startDate)
                                        : "Select date"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto overflow-hidden p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={fromDateKey(advanceFilters.startDate)}
                                      defaultMonth={fromDateKey(advanceFilters.startDate)}
                                      captionLayout="dropdown"
                                      onSelect={(date) => {
                                        setAdvanceFilters((prev) => ({ ...prev, startDate: toDateKey(date) }));
                                        setOpen(false);
                                      }}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </Field>
                            </div>
  
                            {/* End Date */}
                            <div className=" w-full">
                              <Field className="mx-auto w-full">
                                <FieldLabel htmlFor="enddate">
                                  End Date
                                </FieldLabel>
                                <Popover open={endopen} onOpenChange={setEndOpen}>
                                  <PopoverTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      id="enddate"
                                      className="justify-start w-full font-normal"
                                    >
                                      {advanceFilters.endDate
                                        ? formatToDMY(advanceFilters.endDate)
                                        : "Select date"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto overflow-hidden p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={fromDateKey(advanceFilters.endDate)}
                                      defaultMonth={fromDateKey(advanceFilters.endDate)}
                                      captionLayout="dropdown"
                                      onSelect={(date) => {
                                        setAdvanceFilters((prev) => ({ ...prev, endDate: toDateKey(date) }));
                                        setEndOpen(false);
                                      }}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </Field>
                            </div>
                            {/* AWB Number */}
                            <div className=" w-full">
                              <label className="block text-xs text-gray-600 mb-1">
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
                                placeholder="Enter AWB(s)"
                                className="border w-full px-3 py-2 rounded text-sm"
                              />
                            </div>
                            {/*  Button */}
                            <div className=" w-full flex">
                              <button
                                type="submit"
                                className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-1"
                              >
                                Filter
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  resetAdvanceFilters();
                                  setFilterUpdate((prev) => !prev);
                                  setIsFilterOpen(false);
                                }}
                                className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-1"
                              >
                                Reset
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
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
  
          <div className="flex min-h-0 min-w-0 flex-1 flex-col rounded-md dark:bg-gray-900">
            <div className="z-20 w-full shrink-0 bg-white px-2 shadow-sm dark:bg-gray-900 sm:px-4">
              <div className="relative flex justify-left ">
                <div
                  className="flex  overflow-x-auto  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 "
                  onWheel={(e) => {
                    if (e.deltaY === 0) return;
                    e.currentTarget.scrollLeft += e.deltaY;
                  }}
                >
                  <div className="flex gap-2  min-w-max  mt-0">
                    {" "}
                    {/* Added padding on sides */}
                    {status.map((st) => (
                      <Button
                        key={st}
                        onClick={() => {
                          setSelectedStatus(st);
                          setPage(1);
                          setEditingStatusId(null);
                          setSelectedBulkOrders([]);
                         
                          setIsOpenIndividualAssignmnet("");
                        }}
                        className={`px-5 py-2.5 rounded-sm my-2 border transition-all duration-300 font-medium text-sm tracking-wide ${
                          selectedStatus === st
                            ? "bg-[#0446DB] text-white shadow-sm  border-transparent"
                            : "bg-white hover:bg-[#0446DB] hover:text-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]"
                        }`}
                      >
                        {st === "ndr" ? "NDR" : toCapitalizeEachWord(st)}
                        {selectedStatus === st && ` (${totalOrders}) `}
                      </Button>
                    ))}

                                        {[
                                          'undelivered',
                                          "undelivered assigned",
                                          "ndr",
                                          "rto in transit",
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
                                                "ndr",
                                                "rto in transit",
                                                "rto delivered",
                                              ].map((s) => {
                                                return (
                                                  <>
                                                    <DropdownMenuItem
                                                      onClick={() => {
                                                        setSelectedBulkOrders([]);
                                                        setSelectedStatus(s);
                                                        
                                                        setPage(1);
                                                       
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
              {supportsVendorGroups && selectedBulkOrders.length > 0 && (
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-900 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200">
                  <span>
                    <strong>{selectedBulkOrders.length} selected</strong> — {selectedVendorGroup === "mapped"
                      ? "Vendor mapped orders: Cancel Vendor Mapping"
                      : "Unmapped orders: Assign to Rider / Vendor"}. Other group checkboxes are disabled.
                  </span>
                  <button type="button" onClick={() => setSelectedBulkOrders([])} className="font-semibold underline">Clear selection</button>
                </div>
              )}
              {selectedBulkOrders.length > 0 &&
              (selectedStatus === "pending pickup" ||
                selectedStatus === "out for delivery" ||
                selectedStatus === "rto in transit" ||
                selectedStatus === "picked" ||
                selectedStatus === "undelivered") && (
                <AlertDialog>
                  {/* ================= ACTION BUTTON ================= */}
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="my-1 h-7 py-2 cursor-pointer rounded-sm border-[#0446DB] bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-blue-50 hover:text-[#0446DB] dark:border-blue-500 dark:bg-[#0446DB] dark:text-white dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                    >
                      Action
                    </Button>

                 
                  </AlertDialogTrigger>

                  {/* ================= MAIN POPUP ================= */}
                  <AlertDialogContent className="!max-w-2xl overflow-hidden rounded-sm border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                    {/* ================= HEADER ================= */}
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
                      {/* =====================================================
                          RTO IN TRANSIT
                      ===================================================== */}

                      {selectedStatus === "rto in transit" && (
                        <div className="overflow-hidden rounded-sm border border-blue-200 dark:border-blue-500/20">
                          {/* CARD HEADER */}
                          <div className="border-b border-blue-100 bg-blue-50/70 px-4 py-3 dark:border-blue-500/20 dark:bg-blue-500/5">
                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                              RTO Delivery
                            </h3>

                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                              Mark the selected RTO order as delivered.
                            </p>
                          </div>

                          <div className="space-y-4 p-4">
                            {!editingStatusId ? (
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                    Bulk RTO Delivered
                                  </p>

                                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                    Update{" "}
                                    <span className="font-semibold text-[#0446DB] dark:text-blue-400">
                                      {selectedBulkOrders?.length || 0}
                                    </span>{" "}
                                    selected orders.
                                  </p>
                                </div>

                                <Button
                                  type="button"
                                  onClick={() => {
                                    setEditingStatusId(true);
                                  }}
                                  className="h-9 cursor-pointer rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-[#0339B5]"
                                >
                                  Bulk RTO Delivered
                                </Button>
                              </div>
                            ) : (
                              <>
                                <div>
                                  <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                    Change Status
                                    <span className="ml-1 text-red-500">*</span>
                                  </label>

                                  <select
                                    id="bulkRtoStatus"
                                    defaultValue=""
                                    disabled={bulkActionLoading}
                                    className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
                                  >
                                    <option value="" disabled>
                                      Change Status
                                    </option>

                                    <option value="rto delivered">
                                      RTO Delivered
                                    </option>
                                  </select>
                                </div>

                                <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                      Update RTO Status
                                    </p>

                                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                      Confirm status update for the selected order.
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      disabled={bulkActionLoading}
                                      onClick={() => {
                                        setEditingStatusId(null);
                                      }}
                                      className="h-9 cursor-pointer rounded-sm px-4 text-sm font-medium"
                                    >
                                      Cancel
                                    </Button>

                                    <Button
                                      type="button"
                                      disabled={bulkActionLoading}
                                      onClick={async () => {
                                        const select =
                                          document.getElementById("bulkRtoStatus");

                                        const newStatus = select?.value;

                                        if (!newStatus) {
                                          toast.error("Please Select Status");
                                          return;
                                        }

                                        try {
                                          setBulkActionLoading(true);

                                          await changeStatus(
                                            selectedBulkOrders[0].id,
                                            newStatus
                                          );
                                        } finally {
                                          setBulkActionLoading(false);
                                        }
                                      }}
                                      className="h-9 min-w-[110px] cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      {bulkActionLoading ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Updating...
                                        </>
                                      ) : (
                                        "Continue"
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* =====================================================
                          PICKED / UNDELIVERED - ASSIGN RIDER
                      ===================================================== */}

                      {(selectedStatus === "picked" || selectedStatus === "undelivered")  && (
                        <div className="overflow-hidden rounded-sm border border-blue-200 dark:border-blue-500/20">
                          {/* CARD HEADER */}
                          <div className="border-b border-blue-100 bg-blue-50/70 px-4 py-3 dark:border-blue-500/20 dark:bg-blue-500/5">
                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                              Assign Orders to Rider
                            </h3>

                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                              Assign all currently selected orders to a rider.
                            </p>
                          </div>

                          <div className="space-y-4 p-4">
                            {!assign ? (
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
                                  disabled={assignRiderLoading}
                                  onClick={async () => {
                                    const order_ids = [
                                      ...new Set(
                                        selectedBulkOrders.map((o) => o.id)
                                      ),
                                    ];

                                    try {
                                      setAssignRiderLoading(true);

                                      const hasRiders = await fetchReassignRiders(order_ids);
                                      if (hasRiders) setAssign(true);
                                    } finally {
                                      setAssignRiderLoading(false);
                                    }
                                  }}
                                  className="h-9 min-w-[120px] cursor-pointer rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {assignRiderLoading ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Loading...
                                    </>
                                  ) : (
                                    "Assign Orders"
                                  )}
                                </Button>
                              </div>
                            ) : (
                              <>
                                {/* RIDER SELECT */}

                                <div>
                                  <label
                                    htmlFor="riderSelect"
                                    className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                                  >
                                    Select Rider
                                    <span className="ml-1 text-red-500">*</span>
                                  </label>

                                  <select
                                    id="riderSelect"
                                    value={newRider || ""}
                                    disabled={assignRiderLoading}
                                    onChange={(e) =>
                                      setNewRider(e.target.value)
                                    }
                                    className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
                                  >
                                    <option value="">
                                      Select Rider
                                    </option>

                                    {reassignRidersOptions.map((rider) => (
                                      <option
                                        key={rider.value}
                                        value={rider.value}
                                      >
                                        {rider.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {/* ASSIGN ACTION */}

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
                                      disabled={assignRiderLoading}
                                      onClick={() => {
                                        setAssign(false);
                                        setNewRider("");
                                      }}
                                      className="h-9 cursor-pointer rounded-sm px-4 text-sm font-medium"
                                    >
                                      Cancel
                                    </Button>

                                    <Button
                                      type="button"
                                      disabled={assignRiderLoading}
                                      onClick={async () => {
                                        if (!newRider) {
                                          toast.error("Please select a rider.");
                                          return;
                                        }

                                        const ids = selectedBulkOrders.map(
                                          (order) => order.id
                                        );

                                        try {
                                          setAssignRiderLoading(true);

                                          const success = await assignBulkOrderRider(ids, newRider);
                                          if (success) {
                                            setNewRider("");
                                            setAssign(false);
                                          }
                                        } catch (error) {
                                          console.error(error);
                                        } finally {
                                          setAssignRiderLoading(false);
                                        }
                                      }}
                                      className="h-9 min-w-[105px] cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      {assignRiderLoading ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Assigning...
                                        </>
                                      ) : (
                                        "Continue"
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                       

                       {
                         (supportsVendorGroups && selectedVendorGroup === 'mapped' && selectedBulkOrders.every(isVendorMapped))  && (
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
                                                                  // if (value === "cancelled") {
                                                                  //   setNewStatus(value);
                                                                  // } else {
                                                                  //   setNewStatus("");
                                                                  //   setRemark("");
                                                                  // }
                                                                }}
                                                              >
                                                                <option value="">Select Status</option>
                                                                  <option value="Cancel Vendor Mapped">
                                                                    Cancel Vendor Mapping
                                                                  </option>
                                                              </select>
                                                            </div>
                          
                                                            
                          
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
                                                                <Button
                                                              variant="default"
                                                              onClick={handleCancelBulkVendorMapping}
                                                              disabled={!selectedBulkOrders?.length}
                                                            >
                                                              Cancel Vendor Mapping
                                                            </Button>
                                                              </div>
                                                            )}
                                                          </div>
                          </div>
                         )
                       }


                      {(selectedStatus === "uundelivered") && (
                        <div className="overflow-hidden rounded-sm border border-emerald-200 dark:border-emerald-500/20">
                          {/* HEADER */}
                          <div className="border-b border-emerald-100 bg-emerald-50/70 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                              Assign Orders to Vendor
                            </h3>
                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                              Assign all currently selected orders to a vendor.
                            </p>
                          </div>

                          <div className="space-y-4 p-4">
                            {!assignVendor ? (
                              /* INITIAL ASSIGN BUTTON */
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                    Assign Selected Orders
                                  </p>
                                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                    Select a vendor for{" "}
                                    <span className="font-semibold text-emerald-600">
                                      {selectedBulkOrders?.length || 0}
                                    </span>{" "}
                                    selected orders.
                                  </p>
                                </div>

                                <Button
                                  type="button"
                                  disabled={vendorLoading || !selectedBulkOrders?.length}
                                  onClick={async () => {
                                    const order_ids = [
                                      ...new Set(
                                        (selectedBulkOrders || [])
                                          .map((order) => order.id)
                                          .filter((id) => id != null)
                                      ),
                                    ];

                                    if (!order_ids.length) {
                                      toast.error("Please select at least one order");
                                      return;
                                    }

                                    setSelectedVendor("");
                                    setAssignVendor(true);

                                    await getEligibleVendorsByOrders({ order_ids });
                                  }}
                                  className="h-9 min-w-[120px] rounded-sm bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                                >
                                  {vendorLoading ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Loading...
                                    </>
                                  ) : (
                                    "Assign Orders"
                                  )}
                                </Button>
                              </div>
                            ) : (
                              <>
                                {/* VENDOR DROPDOWN */}
                                <div>
                                  <div className="mb-1.5 flex items-center justify-between">
                                    <label
                                      htmlFor="vendorSelect"
                                      className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                                    >
                                      Select Vendor <span className="text-red-500">*</span>
                                    </label>

                                    {vendorList.length === 0 && (
                                      <button
                                        type="button"
                                        onClick={handleRefreshVendors}
                                        disabled={vendorLoading}
                                        className="flex h-8 items-center gap-2 rounded-sm border border-emerald-200 px-3 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 dark:border-emerald-500/30 dark:text-emerald-400"
                                      >
                                        <FiRefreshCw
                                          className={vendorLoading ? "animate-spin" : ""}
                                        />
                                        {vendorLoading ? "Refreshing..." : "Refresh"}
                                      </button>
                                    )}
                                  </div>

                                  <select
                                    id="vendorSelect"
                                    value={selectedVendor}
                                    onChange={(e) => setSelectedVendor(e.target.value)}
                                    disabled={vendorLoading || vendorList.length === 0}
                                    className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
                                  >
                                    <option value="">
                                      {vendorLoading
                                        ? "Loading vendors..."
                                        : vendorList.length === 0
                                          ? "No vendors available"
                                          : "Select Vendor"}
                                    </option>

                                    {vendorList.map((vendor) => (
                                      <option
                                        key={vendor.vendor_id ?? vendor.id}
                                        value={vendor.vendor_id ?? vendor.id}
                                      >
                                        {vendor.vendor_id}:
                                        {vendor.vendor_name ??
                                          vendor.company_name ??
                                          vendor.name}
                                      </option>
                                    ))}
                                  </select>

                                  {!vendorLoading && vendorList.length === 0 && (
                                    <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                                      No eligible vendors found. Click Refresh to try again.
                                    </p>
                                  )}
                                </div>

                                {/* FOOTER */}
                                <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                      Assign Selected Orders
                                    </p>
                                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                      Assign{" "}
                                      <span className="font-semibold text-emerald-600">
                                        {selectedBulkOrders?.length || 0}
                                      </span>{" "}
                                      selected orders to the chosen vendor.
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      disabled={vendorLoading}
                                      onClick={() => {
                                        setAssignVendor(false);
                                        setSelectedVendor("");
                                      }}
                                      className="h-9 rounded-sm px-4 text-sm font-medium"
                                    >
                                      Cancel
                                    </Button>

                                    <Button
                                      type="button"
                                      disabled={
                                        vendorLoading ||
                                        !selectedVendor ||
                                        !selectedBulkOrders?.length
                                      }
                                      onClick={() => {
                                        const order_ids = [
                                          ...new Set(
                                            (selectedBulkOrders || [])
                                              .map((order) => order.id)
                                              .filter((id) => id != null)
                                          ),
                                        ];

                                        // Call actual vendor assignment API here
                                        console.log({
                                          order_ids,
                                          vendor_id: Number(selectedVendor),
                                        });
                                        assignOrderToVendoe({
                                          order_ids,
                                          vendor_id: Number(selectedVendor),
                                        })
                                      }}
                                      className="h-9 min-w-[105px] rounded-sm bg-emerald-600 px-5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
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



                      {/* =====================================================
                          OUT FOR DELIVERY
                      ===================================================== */}

                      {selectedStatus === "out for delivery" && (
                        <div className="overflow-hidden rounded-sm border border-blue-200 dark:border-blue-500/20">
                          {/* HEADER */}

                          <div className="border-b border-blue-100 bg-blue-50/70 px-4 py-3 dark:border-blue-500/20 dark:bg-blue-500/5">
                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                              Update Order Status
                            </h3>

                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                              Update the selected out for delivery orders.
                            </p>
                          </div>

                          <div className="space-y-4 p-4">
                            {!bulkStatusState ? (
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                    Mark Orders Delivered
                                  </p>

                                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                    Update{" "}
                                    <span className="font-semibold text-[#0446DB] dark:text-blue-400">
                                      {selectedBulkOrders?.length || 0}
                                    </span>{" "}
                                    selected orders.
                                  </p>
                                </div>

                                <Button
                                  type="button"
                                  onClick={() => {
                                    setBulkStatusState(true);
                                  }}
                                  className="h-9 cursor-pointer rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-[#0339B5]"
                                >
                                  Update Status
                                </Button>
                              </div>
                            ) : (
                              <>
                                {/* STATUS */}

                                <div>
                                  <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                    Change Status
                                    <span className="ml-1 text-red-500">*</span>
                                  </label>

                                  <select
                                    id="bulkDeliveryStatus"
                                    defaultValue=""
                                    disabled={bulkActionLoading}
                                    className="h-10 w-full cursor-pointer rounded-sm border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
                                  >
                                    <option value="" disabled>
                                      Change Status
                                    </option>

                                    <option value="delivered">
                                      Delivered
                                    </option>
                                  </select>
                                </div>

                                {/* ACTION */}

                                <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                      Update Selected Orders
                                    </p>

                                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                      Mark{" "}
                                      <span className="font-semibold text-[#0446DB] dark:text-blue-400">
                                        {selectedBulkOrders?.length || 0}
                                      </span>{" "}
                                      selected orders as delivered.
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      disabled={bulkActionLoading}
                                      onClick={() => {
                                        setBulkStatusState(false);
                                      }}
                                      className="h-9 cursor-pointer rounded-sm px-4 text-sm font-medium"
                                    >
                                      Cancel
                                    </Button>

                                    <Button
                                      type="button"
                                      disabled={bulkActionLoading}
                                      onClick={async () => {
                                        const select =
                                          document.getElementById(
                                            "bulkDeliveryStatus"
                                          );

                                        const newStatus = select?.value;

                                        if (!newStatus) {
                                          toast.error("Please Select Status");
                                          return;
                                        }

                                        try {
                                          setBulkActionLoading(true);

                                          for (const order of selectedBulkOrders) {
                                            await markOrdersDeliveredBulk(
                                              order.id
                                            );
                                          }
                                        } finally {
                                          setBulkActionLoading(false);
                                        }
                                      }}
                                      className="h-9 min-w-[120px] cursor-pointer rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      {bulkActionLoading ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Updating...
                                        </>
                                      ) : (
                                        "Continue"
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* =====================================================
                          PENDING PICKUP
                      ===================================================== */}

                      {selectedStatus === "pending pickup" && (
                        <div className="overflow-hidden rounded-sm border border-blue-200 dark:border-blue-500/20">
                          {/* HEADER */}

                          <div className="border-b border-blue-100 bg-blue-50/70 px-4 py-3 dark:border-blue-500/20 dark:bg-blue-500/5">
                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                              Pickup Orders
                            </h3>

                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                              Mark all currently selected orders as picked.
                            </p>
                          </div>

                          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                Mark Bulk Pickup
                              </p>

                              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                Mark{" "}
                                <span className="font-semibold text-[#0446DB] dark:text-blue-400">
                                  {selectedBulkOrders?.length || 0}
                                </span>{" "}
                                selected orders as picked.
                              </p>
                            </div>

                            <Button
                              type="button"
                              disabled={bulkActionLoading}
                              onClick={async () => {
                                const order_ids =
                                  selectedBulkOrders.map(
                                    (order) => order.id
                                  );

                                try {
                                  setBulkActionLoading(true);

                                  await PickedOrder(order_ids);
                                } catch (error) {
                                  console.error(error);
                                } finally {
                                  setBulkActionLoading(false);
                                }
                              }}
                              className="h-9 min-w-[145px] cursor-pointer rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {bulkActionLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                "Mark Bulk Pickup"
                              )}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* =====================================================
                          CLEAR SELECTION
                      ===================================================== */}

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
                          disabled={
                            bulkActionLoading ||
                            assignRiderLoading
                          }
                          onClick={() => {
                            setSelectedBulkOrders([]);
                            setEditingStatusId(null);
                            setBulkStatusState(false);
                            setNewRider("");
                            setAssign(false);
                          }}
                          className="h-9 cursor-pointer rounded-sm border-red-200 bg-white px-4 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/30 dark:bg-neutral-900 dark:text-red-400 dark:hover:bg-red-500/10"
                        >
                          Clear Selected
                        </Button>
                      </div>
                    </div>

                    {/* ================= FOOTER ================= */}

                    <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50/70 px-5 my-0 dark:border-neutral-800 dark:bg-neutral-950/30">
                      <AlertDialogCancel
                        disabled={
                          bulkActionLoading ||
                          assignRiderLoading
                        }
                        onClick={() => {
                          setEditingStatusId(null);
                          setBulkStatusState(false);
                          setNewRider("");
                          setAssign(false);
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
            </div>
  
            


              


             
  
            {/* Table */}
            <div className="min-h-0 min-w-0 w-full flex-1 overflow-hidden bg-white dark:bg-gray-900">
  <div className="relative h-full w-full min-h-0 overflow-auto overscroll-contain [&>div]:!overflow-visible">
              <Table className="w-full min-w-max border-separate border-spacing-0">
                <TableHeader className="bg-slate-50 dark:bg-gray-800">
                 <TableRow className="hover:bg-transparent">
                    {
                    selectedStatus === "picked" ||
                    selectedStatus === "rto in transit" ||
                    selectedStatus === "undelivered" ? (
                      <TableHead className="sticky top-0 px-6 py-4 z-40 bg-slate-50 dark:bg-gray-800">
                        <div>
                          <span>
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                              checked={
                                eligibleSelectableOrders.length > 0 &&
                                eligibleSelectableOrders.every((order) =>
                                  selectedBulkOrders.some((selected) => selected.id === order.id)
                                )
                              }
                              onChange={toggleSelectAll}
                            />
                          </span>
                        </div>
                      </TableHead>
                    ) : (
                      <TableHead className="sticky top-0 px-6 py-4 z-40 bg-slate-50 dark:bg-gray-800">-</TableHead>
                    )}
  
                    <TableHead className="sticky top-0 z-40 whitespace-nowrap border-b border-slate-200 bg-slate-50 px-6 py-3 text-left font-semibold text-slate-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
  ORDER ID
</TableHead>
                    <TableHead className="sticky top-0 text-left whitespace-nowrap uppercase px-6 py-3 z-40 bg-slate-50 dark:bg-gray-800">
                     Seller Details
                    </TableHead>
                    
                    <TableHead className="sticky top-0 text-left whitespace-nowrap px-6 py-3 z-40 bg-slate-50 dark:bg-gray-800">
                      CONSIGNEE ADDRESS
                    </TableHead>

                    {(
                        selectedStatus === "out for delivery" ||
                        selectedStatus === "delivered" ||
                        selectedStatus === "in transit" ||
                        selectedStatus === "rto in transit" ||
                        selectedStatus === "undelivered assigned") && (
                        <>
                          <TableHead className="sticky top-0 whitespace-nowrap py-3 text-left font-semibold dark:text-white z-40 bg-slate-50 dark:bg-gray-800">
                            RIDER ID/VENDOR ID
                          </TableHead>
                        </>
                      )}
                    <TableHead className="sticky top-0 text-left whitespace-nowrap px-6 py-3 z-40 bg-slate-50 dark:bg-gray-800">
                      PACKAGE DETAILS
                    </TableHead>
                    <TableHead className="sticky top-0 text-left whitespace-nowrap px-6 py-3 z-40 bg-slate-50 dark:bg-gray-800">
                      ASSIGNMENT
                    </TableHead>
                    <TableHead className="sticky top-0 text-left whitespace-nowrap px-6 py-3 z-40 bg-slate-50 dark:bg-gray-800">
                      STATUS
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
                  ) : orders.length == 0 ? (
                    <>
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-10">
                          No orders found
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    orders.map((order) => {
                      
                      const isVendorMapped = (order) => {
                        const vendorId = order?.mapped_with;

                        return (
                          vendorId !== null &&
                          vendorId !== undefined &&
                          String(vendorId).trim() !== "" &&
                          String(vendorId) !== "0"
                        );
                      };

                      
                      let isSelected;
                      if (
                        selectedStatus === "pending pickup" ||
                        selectedStatus === "rto in transit" ||
                        selectedStatus === "picked" ||
                        selectedStatus === "undelivered"
                      ) {
                        isSelected = selectedBulkOrders.some(
                          (o) => o.id === order.id,
                        );
                      }

                   
  
                      return (
                        <TableRow
                          key={order.id}
                          className={`hover:bg-gray-50 ${
                            isSelected ? "bg-blue-50 text-white" : ""
                          } dark:hover:bg-gray-800`}
                        >
                          {/* Select */}
                          {(
                            selectedStatus === "picked" ||
                            selectedStatus === "rto in transit" ||
                            selectedStatus === "undelivered") &&
                          selectableOrders.some((item) => item.id === order.id) ? (
                            <TableCell className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={Boolean(isSelected)}
                                disabled={!canSelectOrder(order)}
                                title={!canSelectOrder(order)
                                  ? "Clear selection to switch between vendor mapped and unmapped orders"
                                  : isVendorMapped(order) ? "Vendor mapped order" : "Unmapped order"}
                                onChange={(e) => handleOrderSelection(order, e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-[#0446DB] disabled:cursor-not-allowed disabled:opacity-30"
                              />
                            </TableCell>
                          ) : (
                            <TableCell className="px-6 py-4">-</TableCell>
                          )}






  
                          {/* Order ID */}
                          <TableCell className="px-6 py-4">
                            <div className="text-l flex items-center text-gray-800">
                              
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
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button
  type="button"
  title="View Details"
  className="
    group flex ml-2 h-7 w-7 cursor-pointer items-center justify-center
    rounded-lg border border-slate-200
    bg-white text-slate-500
    shadow-sm transition-all duration-200
    hover:border-[#0446DB]/30
    hover:bg-blue-50
    hover:text-[#0446DB]
    hover:shadow-md
    active:scale-95
    dark:border-slate-700
    dark:bg-slate-900
    dark:text-slate-400
    dark:hover:border-blue-500/30
    dark:hover:bg-blue-500/10
    dark:hover:text-blue-400
  "
>
  <HiOutlineDocumentMagnifyingGlass
    className="h-[19px] w-[19px] transition-transform duration-200 group-hover:scale-110"
  />
</button>
                                </AlertDialogTrigger>
                                <AlertDialogContent
  className="
    flex max-h-[92dvh] w-[calc(100%-24px)] !max-w-5xl flex-col
    overflow-hidden rounded-xl border border-slate-200
    bg-white p-0 shadow-2xl
    dark:border-slate-800 dark:bg-[#0d1421]
  "
>
  {/* ================= HEADER ================= */}
  <AlertDialogHeader className="shrink-0 border-b border-slate-200 px-5 py-4 text-left dark:border-slate-800 sm:px-6">
    <div className="flex items-start justify-between gap-4">
      <div>
        <AlertDialogTitle className="text-lg font-semibold text-slate-900 dark:text-white">
          Order Details
        </AlertDialogTitle>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Complete shipment and customer information
        </p>
      </div>

      <div className="hidden items-center gap-2 sm:flex">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            order?.order_type === "cod"
              ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20"
              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
          }`}
        >
          {order?.order_type === "cod" ? "COD" : "PREPAID"}
        </span>

        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#0446DB] ring-1 ring-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20">
          {toCapitalizeEachWord(order?.status)}
        </span>
      </div>
    </div>
  </AlertDialogHeader>

  {/* ================= SCROLL BODY ================= */}
  <div className="min-h-0 flex-1 overflow-y-auto">
    <div className="space-y-5 p-4 sm:p-6">
      {/* ================= ORDER SUMMARY ================= */}

      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Order
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p className="truncate text-base font-semibold text-slate-900 dark:text-white">
                {order?.merchant_order_id || "N/A"}
              </p>

              <div className="flex items-center gap-2 sm:hidden">
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    order?.order_type === "cod"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                  }`}
                >
                  {order?.order_type === "cod" ? "COD" : "PREPAID"}
                </span>

                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                  {toCapitalizeEachWord(order?.status)}
                </span>
              </div>
            </div>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              AWB: {order?.awb_number || "N/A"}
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Amount
            </p>

            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              ₹{Number(order?.total_amount || 0).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* ================= BASIC INFORMATION ================= */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/30">
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5 dark:border-slate-800 sm:px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Basic Information
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Shipment and order information
            </p>
          </div>
        </div>
         
        <div className="grid grid-cols-1 gap-px overflow-hidden bg-slate-200 sm:grid-cols-2 lg:grid-cols-4 dark:bg-slate-800">
  {[
    {
      label: "Order ID",
      value: order?.merchant_order_id || "N/A",
      copy: true,
    },
    {
      label: "AWB Number",
      value: order?.awb_number || "N/A",
      copy: true,
    },
    {
      label: "Order Type",
      value: order?.order_type === "cod" ? "COD" : "Prepaid",
      type: "orderType",
    },
    {
      label: "Order Specific",
      value:
        order?.order_specific === "Turant"
          ? "Turant"
          : order?.order_specific?.slice(0, 3) || "N/A",
    },
    {
      label: "Packets",
      value: order?.number_of_boxes ?? "N/A",
    },
    {
      label: "Weight",
      value:
        order?.total_weight !== null &&
        order?.total_weight !== undefined &&
        order?.total_weight !== ""
          ? `${order.total_weight} g`
          : "N/A",
    },
    {
      label: "Status",
      value: order?.status
        ? toCapitalizeEachWord(order.status)
        : "N/A",
      type: "status",
    },
  ].map((item, index) => (
    <div
      key={index}
      className="
        group min-w-0 bg-white px-4 py-4
        transition-colors duration-200
        hover:bg-slate-50
        dark:bg-[#0d1421]
        dark:hover:bg-slate-800/50
        sm:px-5
      "
    >
      {/* LABEL */}
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-400 dark:text-slate-500">
        {item.label}
      </p>

      {/* VALUE */}
      <div className="flex min-h-7 min-w-0 items-center gap-2">
        {item.type === "status" ? (
          <span
            className="
              inline-flex max-w-full items-center gap-1.5
              rounded-full border border-blue-200
              bg-blue-50 px-2.5 py-1
              text-xs font-semibold text-[#0446DB]
              dark:border-blue-500/20
              dark:bg-blue-500/10
              dark:text-blue-400
            "
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0446DB] dark:bg-blue-400" />

            <span className="truncate">
              {item.value}
            </span>
          </span>
        ) : item.type === "orderType" ? (
          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
              order?.order_type === "cod"
                ? `
                  border-amber-200 bg-amber-50 text-amber-700
                  dark:border-amber-500/20
                  dark:bg-amber-500/10
                  dark:text-amber-400
                `
                : `
                  border-emerald-200 bg-emerald-50 text-emerald-700
                  dark:border-emerald-500/20
                  dark:bg-emerald-500/10
                  dark:text-emerald-400
                `
            }`}
          >
            {item.value}
          </span>
        ) : (
          <span
            className="
              min-w-0 truncate text-sm
              font-semibold text-slate-800
              dark:text-slate-100
            "
            title={String(item.value)}
          >
            {item.value}
          </span>
        )}

        {/* COPY BUTTON */}
        {item.copy && item.value !== "N/A" && (
          <button
            type="button"
            title={
              copySuccess === item.value
                ? "Copied"
                : `Copy ${item.label}`
            }
            onClick={() => {
              navigator.clipboard.writeText(
                String(item.value)
              );

              setCopySuccess(item.value);

              setTimeout(() => {
                setCopySuccess(null);
              }, 2000);
            }}
            className="
              flex h-7 w-7 shrink-0 cursor-pointer
              items-center justify-center rounded-md
              text-slate-400 transition-all
              hover:bg-blue-50
              hover:text-[#0446DB]
              active:scale-95
              dark:text-slate-500
              dark:hover:bg-blue-500/10
              dark:hover:text-blue-400
            "
          >
            {copySuccess === item.value ? (
              <svg
                className="h-4 w-4 text-emerald-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.704 5.292a1 1 0 010 1.416l-8 8a1 1 0 01-1.416 0l-4-4a1 1 0 011.416-1.416L8 12.586l7.296-7.294a1 1 0 011.408 0z"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  ))}
</div>
      </div>

      {/* ================= DELIVERY + PICKUP ================= */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* ================= DELIVERY ================= */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/30">
          <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5 dark:border-slate-800 sm:px-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4m-4 0h4"
                />
              </svg>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Delivery Details
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customer and delivery address
              </p>
            </div>
          </div>

          <div className="space-y-5 p-4 sm:p-5">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Customer Name
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {order?.delivery_contact_name || "N/A"}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Delivery Address
              </p>

              <p className="mt-1 text-sm font-medium leading-6 text-slate-800 dark:text-slate-200">
                {order?.delivery_address_line || "N/A"}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {order?.delivery_city || "N/A"}
                {order?.delivery_state
                  ? `, ${order.delivery_state}`
                  : ""}
                {order?.delivery_pincode
                  ? ` - ${order.delivery_pincode}`
                  : ""}
              </p>
            </div>
          </div>
        </div>

        {/* ================= PICKUP ================= */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/30">
          <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5 dark:border-slate-800 sm:px-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Pickup Details
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pickup contact and warehouse address
              </p>
            </div>
          </div>

          <div className="space-y-5 p-4 sm:p-5">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Pickup Contact
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {order?.pickup_contact_name || "N/A"}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Pickup Address
              </p>

              <p className="mt-1 text-sm font-medium leading-6 text-slate-800 dark:text-slate-200">
                {order?.pickup_address_line || "N/A"}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {order?.pickup_city
                  ? `${order.pickup_city}, ${order?.pickup_state || ""} - ${
                      order?.pickup_pincode || ""
                    }`
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          AAPKA EXISTING NDR ACTIONS BLOCK YAHA SAME RAHEGA
          Iski logic bilkul change mat karo.
      ========================================================== */}

      {order?.ndr_actions && order.ndr_actions.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/30">
          <button
            type="button"
            onClick={() => setShowNdrActions(!showNdrActions)}
            className="flex w-full cursor-pointer items-center justify-between px-4 py-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50 sm:px-5"
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  NDR Actions
                </h3>

                <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  {order.ndr_actions.length}
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Non-Delivery Reports
              </p>
            </div>

            <svg
              className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                showNdrActions ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showNdrActions && (
            <div className="space-y-3 border-t border-slate-200 p-4 dark:border-slate-800 sm:p-5">
              {order.ndr_actions.map((item) => (
                <div
                  key={item.action_id}
                  className="group rounded-lg border border-slate-200 bg-slate-50/50 p-4 transition hover:border-red-200 hover:bg-red-50/30 dark:border-slate-800 dark:bg-slate-950/30 dark:hover:border-red-500/20 dark:hover:bg-red-500/5"
                >
                  {/* YAHAN AAPKE CURRENT NDR ITEM KA
                      EXISTING INNER CONTENT SAME PASTE KARO */}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  </div>

  {/* ================= STICKY FOOTER ================= */}

                        <AlertDialogFooter className="shrink-0 border-t border-slate-200 bg-slate-50/70 px-4 my-0 dark:border-slate-800 dark:bg-slate-900/50 sm:px-6">
                          <AlertDialogCancel className="m-0 h-9 cursor-pointer rounded-md border-slate-300 px-5 text-sm font-medium dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                            Close
                          </AlertDialogCancel>
                        </AlertDialogFooter>
                              </AlertDialogContent>
                              </AlertDialog>
                            </div>
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
                                },
                              )}
                            </p>
  
                            
                            <div className="flex min-w-0 items-center gap-1.5">
                              <p className="min-w-0 text-xs text-gray-400 dark:text-gray-400">
                                <span className="whitespace-nowrap">MOID: </span>

                                <span
                                  className="inline-block max-w-[150px] truncate align-bottom font-medium text-gray-600 dark:text-gray-300"
                                  title={order?.merchant_order_id}
                                >
                                  {order?.merchant_order_id || "N/A"}
                                </span>
                              </p>

                              {order?.merchant_order_id && (
                                <button
                                  type="button"
                                  title="Copy Merchant Order ID"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(order.merchant_order_id);
                                    setCopySuccess(order.merchant_order_id);

                                    setTimeout(() => {
                                      setCopySuccess(null);
                                    }, 2000);
                                  }}
                                  className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded text-gray-400 transition hover:bg-blue-50 hover:text-[#0446DB] dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                                >
                                  {copySuccess === order.merchant_order_id ? (
                                    <span className="text-xs text-green-500">✓</span>
                                  ) : (
                                    <svg
                                      className="h-3.5 w-3.5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                      />
                                    </svg>
                                  )}
                                </button>
                              )}
                            </div>

                            {/* Vendor and Rider mapping — independent statuses */}
                            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                              {isVendorMapped(order) ? (
                                <span
                                  title={`Vendor ID: ${order.mapped_with}`}
                                  className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                                >
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                  Vendor: {order.mapped_with}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                  Vendor Not Mapped
                                </span>
                              )}

                              {
                                !['picked','pending pickup'].includes(order?.status) && (
                                  order.rider_id != null &&
                                  String(order.rider_id).trim() !== "" &&
                                  Number(order.rider_id) > 0 ? (
                                    <span
                                      title={`Rider ID: ${order.rider_id}`}
                                      className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                    >
                                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                      Rider: {order.rider_id}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                      Rider Not Assigned
                                    </span>
                                  )

                                )
                              }

                            </div>

                          
                          </TableCell>
  
                        
                         {/* SELLER DETAILS */}
                            <TableCell className="px-6 py-4 whitespace-pre-line">
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
                            </TableCell>


                         
  
                          {/* Address */}
                          <TableCell className="px-6 py-4 whitespace-pre-line">
                            <p className="font-medium text-gray-800 dark:text-white">
                              {order.delivery_contact_name}
                            </p>
                            {/* <p className="font-medium text-gray-800">
                                {order.delivery_address_line}
                              </p> */}
                            <div className="relative inline-block group">
                              <span className="cursor-pointer whitespace-nowrap dark:text-white text-gray-800 font-medium">
                                {String(order.delivery_address_line || "").slice(0, 35)}...
                              </span>
                              <div
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-0
                                            hidden group-hover:block"
                              >
                                <div className="bg-[#0446DB]  text-white text-xs w-48 px-3 py-1 rounded shadow-lg ">
                                  {order.delivery_address_line}
                                </div>
  
                                {/* Arrow */}
                                <div className="w-2 h-2 bg-[#0446DB] rotate-45 mx-auto -mt-1"></div>
                              </div>
                            </div>
                            <p className="text-xs whitespace-nowrap dark:text-white text-gray-500">
                              {order.delivery_city}, {order.delivery_state} -{" "}
                              {order.delivery_pincode}
                            </p>
                            <p className="text-xs text-gray-400">
                              {order.delivery_country}
                            </p>
                          </TableCell>
                         
                         
                          {(
                              selectedStatus === "out for delivery" ||
                              selectedStatus === "delivered" ||
                              selectedStatus === "in transit" ||
                              selectedStatus === "rto in transit" ||
                              selectedStatus === "undelivered assigned") && (
                              <>
                                <TableCell className="px-6 py-4 text-gray-800 dark:text-white whitespace-pre-line">
                                  
                                 {order?.mapped_with == null && order?.rider_id == null ? (
                                  "-"
                                ) : (
                                  <p>
                                    {order?.mapped_with && order?.rider_id
                                      ? `FP_${order.mapped_with}_${order.rider_id}`
                                      : order?.mapped_with
                                        ? `FP_${order.mapped_with}`
                                        : `R_${order?.rider_id}`}

                                        <p>
                                          
                                          {order?.pickup_stage == 'at_dc' ? (
                                            <span>At DC</span>
                                          ) : order?.pickup_stage == 'at_vendor' ? (<span>At Vendor</span>) : (<>qq</>)}
                                        </p>
                                  </p>
                                )}
                                </TableCell>
                              </>
                            )}
                          


                         
  
                          {/* Package Details */}
                          <TableCell className="px-6 py-4">
                            <p>
                              <span className=" whitespace-nowrap text-gray-800 ">
                                EDD: {order.EDD}
                              </span>
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
                            <p className="text-gray-800 ">
                              <span className="font-medium  text-gray-800">
                                Dimensions:
                              </span>{" "}
                              {order.package_length}x{order.package_breadth}x
                              {order.package_height}
                            </p>
                          </TableCell>
  
                          {/* Assignment */}
                          {selectedStatus === "All" ? (
                            <>
                              <TableCell className="px-6 py-4">
                                {order.status === "pending pickup" ||
                                order.status === "in transit" ||
                                order.status === "picked" ||
                                order.status === "undelivered" ||
                                order.status === "undelivered assigned" ? (
                                  <>
                                    {!(
                                      isOpenIndividualAssignmnet === order.id
                                    ) ? (
                                      <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getAssignmentStatusColor(order, order.mapped_with)} whitespace-nowrap mb-2 inline-block cursor-pointer`}
                                      >
                                        {getAssignmentStatusText(order)}
                                      </span>
                                    ) : (
                                      <></>
                                    )}
                                  </>
                                ) : order.status === "cancelled" ? (
                                  <span className="px-3  whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                    Order Canceled
                                  </span>
                                ) : order.status === "delivered" ? (
                                  <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                    Order Delivered
                                  </span>
                                ) : order.status === "rto delivered" ? (
                                  <span className="px-3 py-1  whitespace-nowrap rounded-full text-xs font-medium bg-green-100 text-green-600">
                                    Delivered To Origin
                                  </span>
                                ) : order.status === "ndr" ? (
                                  <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-green-100 text-green-600">
                                    Marked as NDR
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
                              <TableCell className="px-6 py-4">
                                {order.status === "pending pickup" ||
                                order.status === "in transit" ||
                                order.status === "picked" ||
                                order.status === "undelivered" ||
                                order.status === "undelivered assigned" ? (
                                  <>
                                    {!(
                                      isOpenIndividualAssignmnet === order.id
                                    ) ? (
                                      <span
                                        onClick={() => {
                                           if(order.status === "picked" && order?.mapped_with){
                                            return
                                           }


                                           if(order.status === "in transit" && order?.mapped_with){
                                            return
                                           }
                                          setIsOpenIndividualAssignmnet(order.id);
                                        }}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getAssignmentStatusColor(order, order.mapped_with)} whitespace-nowrap mb-2 inline-block cursor-pointer`}
                                      >
                                        {getAssignmentStatusText(order)}
                                      </span>
                                    ) : (
                                      <form className="flex items-center gap-2">
                                        {getAssignmentButtons(order)}
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
                                  <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                    Assignment Completed
                                  </span>
                                ) : order.status === "rto delivered" ? (
                                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                    Delivered To Origin
                                  </span>
                                ) : order.status === "ndr" ? (
                                  <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                    Assignment Not Completed
                                  </span>
                                ) : order.status === "rto in transit" ? (
                                  <>
                                    <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                      Not Assigned
                                    </span>
                                  </>
                                ) : (
                                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                    Assigned
                                  </span>
                                )}
                              </TableCell>
                            </>
                          )}
  
                          
                          {selectedStatus === "All" ? (
                            <>
                              <TableCell className="px-6 py-4 whitespace-nowrap">
                                {getStatusDisplay(order)}
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell className="px-6 py-4 whitespace-nowrap">
                                {order.status === "ndr" ? (
                                  <>
                                    {!(
                                      isOpenIndividualAssignmnet === order.id
                                    ) ? (
                                      <span
                                        onClick={() => {
                                          setIsOpenIndividualAssignmnet(order.id);
                                        }}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getAssignmentStatusColor(order, order.mapped_with)} whitespace-nowrap mb-2 inline-block cursor-pointer`}
                                      >
                                        {getAssignmentStatusText(order)}
                                      </span>
                                    ) : (
                                      <form className="flex items-center gap-2">
                                        {getAssignmentButtons(order)}
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
                                ) : isOpenIndividualAssignmnet === order.id &&
                                  order.status === "out for delivery" ? (
                                  <form
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      const selectedVendor = assignmentState;
                                      if (!selectedVendor) {
                                        toast.warn("Please select Status");
                                        return;
                                      }
                                      markOrdersDeliveredBulk(order.id);
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
                                        Select Status
                                      </option>
                                      <option key={order.id} value={"delivered"}>
                                        Delivered
                                      </option>
                                    </select>
                                    <button
                                      type="submit"
                                      className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                    >
                                      Change Status
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
                                ) : order.status === "out for delivery" ? (
                                  <>
                                    <span
                                      // onClick={() => {
                                        
                                      //   setIsOpenIndividualAssignmnet(order.id);
                                      // }}
                                      className="inline-block cursor-pointer whitespace-nowrap"
                                    >
                                      {getStatusDisplay(order)}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="inline-block whitespace-nowrap">
                                      {getStatusDisplay(order)}
                                    </span>
                                  </>
                                )}
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
              </div>
            </div>
  
            <div className="z-20 flex shrink-0 flex-col items-center justify-between gap-3 border-t border-gray-200 bg-white px-2 py-3 dark:border-gray-700 dark:bg-gray-900 sm:flex-row sm:px-6">
              {/* Pagination Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-sm text-sm font-medium ${
                    page === 1
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
                  className={`px-4 py-2 rounded-sm text-sm font-medium ${
                    page === totalPages
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
                  className="border rounded-sm px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
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
  
          
  
          
  
          
          <AlertDialog open={reassignPopup != null} onOpenChange={(isOpen) => !isOpen && setReassignPopup(null)}>
            <AlertDialogContent className="!max-w-sm">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  <h2 className=" font-semibold  text-center">
                    {selectedStatus === "picked" ||
                    selectedStatus === "undelivered"
                      ? "Assign Order to a Rider"
                      : "Reassign Order to a Different Rider"}
                  </h2>
                </AlertDialogTitle>
  
                <AlertDialogDescription className="w-full">
                  {/* Modal Content */}
                  <div className=" flex w-full">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        reassignRider(reassignPopup, newRider);
                      }}
                      className="space-y-6 w-full"
                    >
                      <div className="w-full  space-y-2">
                        <label
                          htmlFor="riderSelect"
                          className="block text-lg font-medium text-gray-700"
                        >
                          Select Rider:
                        </label>
                        <select
                          value={newRider || ""}
                          onChange={(e) => {
                           
                            setNewRider(e.target.value)
                          }}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        >
                          <option value="">Select Rider</option>
  
                          {reassignRidersOptions.map((rider) => {
                           
                            return (
                              <option key={rider.value} value={rider.value}>
                                {rider.label}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </form>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
  
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
  
                <AlertDialogAction
                  onClick={() => {
                    reassignRider(reassignPopup, newRider);
                  }}
                >
                  {selectedStatus === "picked" ||
                  selectedStatus === "pending pickup"
                    ? "Assign"
                    : "Reassign"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
  
          {/* Assign Rider Popup */}
          {reassignRiderPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(46,46,46,0.5)]">
              <div className="bg-white rounded-sm shadow-2xl w-full max-w-3xl overflow-hidden">
                {/* Modal Header */}
                <div className="bg-[#0446DB] py-6 px-4">
                  <h2 className="text-2xl font-semibold text-white text-center">
                    Assign Order to Rider
                  </h2>
                </div>
  
                {/* Modal Content */}
                <div className="p-6 space-y-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      assignOrderToRider(reassignRiderPopup, newRider);
                    }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label
                        htmlFor="riderSelect"
                        className="block text-lg font-medium text-gray-700"
                      >
                        Select Rider:
                      </label>
                      <Select
                        options={reassignRidersOptions}
                        isSearchable
                        value={reassignRidersOptions.find(
                          (option) => Number(option.value) === Number(newRider),
                        ) || null}
                        onChange={(selectedOption) =>
                          setNewRider(selectedOption?.value)
                        }
                        placeholder="Select Rider"
                        className="text-sm"
                        classNamePrefix="react-select"
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          menu: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                    </div>
  
                    {/* Buttons */}
                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="submit"
                        className="bg-[#0446DB] text-white font-semibold px-5 py-2 rounded-sm hover:bg-indigo-800 transition"
                      >
                        Assign
                      </button>
                      <button
                        type="button"
                        onClick={() => setReassignRiderPopup(null)}
                        className="bg-gray-200 text-gray-700 font-semibold px-5 py-2 rounded-sm hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
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

export default DCOrderDetails;
