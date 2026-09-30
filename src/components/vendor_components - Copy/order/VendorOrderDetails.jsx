import { use, useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Loader from "../../Loader";

import { TbFileInfo } from "react-icons/tb";
import { FaFilter, FaRegCopy } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { toast } from "react-toastify";
import { data } from "react-router-dom";
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
import { Loader2 } from "lucide-react";
import AxiosInstance from "../../../Helper/axiosInstance";
const baseURL = import.meta.env.VITE_BASE_URL;
const frontEndURL = import.meta.env.VITE_FRONTEND_URL;

function VendorOrderDetails() {
  const [isOpenIndividualMap, setIsOpenIndividualMap] = useState("");
  const [open, setOpen] = useState(false);
  const [endopen, setEndOpen] = useState(false);
  const [RtoType, setRtoType] = useState("");
  const [isselectRtoInTransit, selectRtoInTransit] = useState("");
  const [setMark, setmarkPickup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [vendorId, setVendorId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [popup, setPopup] = useState(null);
  const [copySuccess, setCopySuccess] = useState(null);
  const [bulkStatusState, setBulkStatusState] = useState("");
  const [bulkOrderWeight, setBulkOrderWeight] = useState(0);
  const [selectedBulkOrders, setSelectedBulkOrders] = useState([]);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [isOpenIndividualAssignmnet, setIsOpenIndividualAssignmnet] =
    useState("");
  const [
    isOpenIndividualAssignOrderToRider,
    setIsOpenIndividualAssignOrderToRider,
  ] = useState("");
  const [reassignPopup, setReassignPopup] = useState(null);
  const [reassignRiderPopup, setReassignRiderPopup] = useState(null);
  const [newRider, setNewRider] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [advanceFilters, setAdvanceFilters] = useState({
    startDate: "",
    endDate: "",
    order_id: "",
    awbNumber: "",
    city: "",
    state: "",
    pincode: "",
    rider_id: "",
    order_specific: "",
  });
  const [ndrData, setNdrData] = useState({
    ndr_id: "",
    newRemarks: "",
  });

  const [filterUpdate, setFilterUpdate] = useState(false);
  const [riderOptions, setRiderOptions] = useState([]);
  const [reassignRidersOptions, setReassignRidersOptions] = useState([]);
  const [fetchBulkAssignmentRider, setFetchBulkAssignmentRider] =
    useState(false);
  const [fetchBulkAssignmentVendor, setFetchBulkAssignmentVendor] =
    useState(false);
  const [assignmentState, setAssignmentState] = useState("");

  const [showNdrActions, setShowNdrActions] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleSelectAll = () => {
    if (selectedBulkOrders.length === orders.length) {
      setSelectedBulkOrders([]);
      setBulkOrderWeight(0);
    } else {
      const assignedOrder = orders.filter(
        (order) => order.mapped_with !== null,
      );
      setSelectedBulkOrders(assignedOrder);
      const totalWeight = orders
        .filter((order) => order.mapped_with !== null)
        .reduce((acc, order) => acc + Number(order.total_weight), 0);

      setBulkOrderWeight(totalWeight);
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
      rider_id: "",
      order_specific: "",
    });
  };

  const getActionColor = (action) => {
    switch (action) {
      case "change_address":
        return { bg: "bg-blue-100", text: "text-blue-600" };
      case "change_phone":
        return { bg: "bg-green-100", text: "text-green-600" };
      case "reattempt":
        return { bg: "bg-purple-100", text: "text-purple-600" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-600" };
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case "change_address":
        return "Address Changed";
      case "change_phone":
        return "Phone Number Updated";
      case "reattempt":
        return "Delivery Reattempt";
      default:
        return action
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    }
  };

  const status = [
    "All",
    "pending pickup",
    "picked",
    "in transit",
    "out for delivery",
    "delivered",
    "undelivered",
    "undelivered assigned",
    "ndr",
    "rto in transit",
    "rto delivered",
  ];
  const [selectedStatus, setSelectedStatus] = useState("All");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/vendor/getVendorOrdersWithRiders`,
        {
          params: {
            page,
            limit,
            status: selectedStatus === "All" ? undefined : selectedStatus,
            order_id: advanceFilters.order_id,
            awb_number: advanceFilters.awbNumber,
            start_date: advanceFilters.startDate,
            end_date: advanceFilters.endDate,
            city: advanceFilters.city,
            pincode: advanceFilters.pincode,
            rider_id: advanceFilters.rider_id,
            order_specific: advanceFilters.order_specific,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setTotalOrders(res.data.pagination.total_records);
      setOrders(res.data.data || []);
      setTotalPages(Math.max(1, res.data.pagination.total_pages));
      setVendorId(res.data.filters.vendor_id);
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
      setBulkOrderWeight(0);
      setFetchBulkAssignmentRider(false);
    } catch (err) {
      toast.error(err.response.data.message);
      return;
    } finally {
      setLoading(false);
    }
  };

  

  const cancelRiderAssignment = async (id) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/api/vendor/cancelRiderAssignment/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
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
      const res = await axios.post(
        `${baseURL}/api/vendor/cancelMappedWithByVendor/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
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

  const fetchReassignRiders = async (order_id) => {
    try {
      const res = await axios.get(
        `${baseURL}/api/vendor/getRidersOutsideIdealLoad?order_id=${order_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const tempArr = [];
      res?.data?.data.forEach((element) => {
        tempArr.push({
          value: element.rider_id,
          label: `${element.rider_id}: ${element.rider_name} | ${element.total_weight_grams}g | ${element.total_boxes} box(es)`,
        });
      });

      setReassignRidersOptions(tempArr);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Error in fetching riders",
      );
    } finally {
      setLoading(false);
    }
  };

  const reassignRider = async (order_id, new_rider_id) => {
    setLoading(true);
    try {
      if (selectedStatus === "picked") {
        const resPick = await axios.post(
          `${baseURL}/api/vendor/assignOrderToRider`,
          {
            order_id,
            rider_id: new_rider_id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (resPick.data.success) {
          fetchOrders();
          setReassignPopup(null);
          setIsOpenIndividualAssignmnet("");
          toast.success(resPick.data.message);
          return;
        }
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `${baseURL}/api/vendor/reassignOrderToRider`,
        {
          order_id,
          new_rider_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      toast.success("Order reassigned successfully");
      fetchOrders();
      setNewRider("");
      setReassignPopup(null);
      setReassignRidersOptions([]);
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

  const assignBulkOrderRider = async (ids, new_rider_id) => {
  if (!ids?.length) {
    toast.error("Please select at least one order.");
    return;
  }

  if (!new_rider_id) {
    toast.error("Please select a rider.");
    return;
  }

  setLoading(true);

  try {
    const res = await AxiosInstance.post(`/api/vendor/bulkAssignOrdersToRider`,{
      
          order_ids:ids,
          rider_id: new_rider_id,
       
    })
   

    await fetchOrders();

    toast.success(
      `${ids.length} order${ids.length > 1 ? "s" : ""} assigned successfully`
    );

    setSelectedBulkOrders([]);
    setNewRider("");
    setEditingStatusId(null);
  } catch (err) {
    console.error("Bulk assign error:", err);

    toast.error(
      err.response?.data?.message ||
        err.message ||
        "Error while assigning orders to rider"
    );
  } finally {
    setLoading(false);
  }
  };

  const AssignBulkOrder = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/api/vendor/markOrdersPickedBulk`,
        {
          order_ids: selectedBulkOrders.map((order) => order.id),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Bulk Pickup Marked Successfully");
        fetchOrders();
        setSelectedBulkOrders([]);
        setBulkOrderWeight(0);
      }
      return;
    } catch (error) {
      toast.error("Something went wrong while marking bulk pickup");
      return;
    } finally {
      setLoading(false);
    }
  };

  const PickedOrder = async (order_ids) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/api/vendor/markOrdersPickedBulk`,
        {
          order_ids: order_ids,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      fetchOrders();
      toast.success("Pickup Marked Successfully");
      setSelectedBulkOrders([]);
      setBulkOrderWeight(0);
      setIsOpenIndividualMap("");
    } catch (error) {
      toast.error("Something went wrong while marking pickup");
      return;
    } finally {
      setLoading(false);
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
        toast.success(res.data.message);
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

    // Case 1: pending pickup && mapped_with == null
    if (status === "pending pickup" && mapped_with === null) {
      return (
        <>
          {/* <button
            type="button"
            onClick={() => {
              cancelRiderAssignment(id);
              setIsOpenIndividualAssignmnet("");
            }}
            className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 mr-2"
          >
            Cancel Rider Assignment
          </button> */}
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

    // Case 2: pending pickup && mapped_with !== null
    if (status === "pending picku" && mapped_with !== null) {
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
            // onSubmit={async (e) => {
            //   e.preventDefault();
            //   const newStatus =
            //     e.target.elements.status.value;
            //   const newRemarks =
            //     e.target.elements.remarks.value;
            //     console.log(data.ndr_id, newStatus, newRemarks)
            //   //   return
            //   // changeStatus(data.ndr_id, newStatus, newRemarks);
            // }}

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
    if (status === "in transit" && mapped_with === null) {
      return (
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
      );
    }

    // Case 4: in transit && mapped_with !== null
    if (status === "in transit" && mapped_with !== null) {
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

    // Case 5: undelivered && mapped_with !== null
    if (status === "undelivered" && mapped_with !== null) {
      return (
        <button
          type="button"
          onClick={async () => {
            await fetchReassignRiders(id);
            setReassignRiderPopup(id);
          }}
          className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 mr-2"
        >
          Assign Rider
        </button>
      );
    }

    // Case 6 & 7: undelivered assigned && mapped_with !== null
    if (status === "undelivered assigned") {
      return (
        <>
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
          <button
            type="button"
            onClick={() => {
              cancelRiderAssignment(id);
              setIsOpenIndividualAssignmnet("");
            }}
            className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 mr-2"
          >
            Cancel Assignment
          </button>
        </>
      );
    }

    // Case 8: rto in transit && mapped_with !== null - handled in status column

    // For picked status
    if (status === "picked") {
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
              <span
                onClick={() => {
                  PickedOrder([id]);
                }}
                className="bg-[#0446DB] whitespace-nowrap text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 cursor-pointer mr-2"
              >
                Mark as Picked
              </span>
              <span
                onClick={() => {
                  setIsOpenIndividualMap("");
                }}
                className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800 cursor-pointer mr-2"
              >
                Close
              </span>
            </>
          ) : (
            <span
              onClick={() => {
                if (mapped_with === null) {
                  toast.warning("Order is not mapped with any vendor");
                  return;
                }
                setmarkPickup(true);
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
                  onClick={() => setEditingStatusId(null)}
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
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/vendor/exportVendorPendingPickupOrders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "orders_Pending.csv");
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

  const exportVendorOrdersWithRider = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/vendor/exportVendorOrdersWithRider`,
        {
          params: {
            start_date: advanceFilters.startDate,
            end_date: advanceFilters.endDate,
            awb_number: advanceFilters.awbNumber,
            status: selectedStatus,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

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
  const getOrderSpecificBadge = (orderSpecific = "") => {
    const prefix = orderSpecific.split("-")[0]; // HLD4HRS, SDD, NDD

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
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/vendor/exportVendorRtoOrders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "orders_Rto.csv");
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

  useEffect(() => {
    resetAdvanceFilters();
    // fetchRiders();
  }, []);

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
    if (!dateStr) return "";

    const date = new Date(dateStr);

    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
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
        <div className="bg-gray-100 dark:bg-gray-900  min-h-screen w-full">
          {/* Heading Strip */}
          <div className="mb-0  z-10  dark:bg-gray-900 py-[24px]  h-auto px-[24px]">
            <div className="flex flex-wrap items-center justify-between">
              {/* Heading */}
              <h1 className="text-2xl dark:text-white">Order Details</h1>
              <div className="flex flex-wrap items-end gap-4 text-white">
                {/* Right Side Filters */}
                <Button
                  onClick={() => exportVendorPendingPickupOrders()}
                  className="bg-white text-[#0446DB] font-medium px-5 py-2 rounded-sm shadow hover:bg-indigo-100 transition"
                >
                  Export Pickup List
                </Button>
                <Button
                  onClick={() => exportVendorOrdersWithRider()}
                  className="bg-white text-[#0446DB] font-medium px-5 py-2 rounded-sm shadow hover:bg-indigo-100 transition"
                >
                  Export Orders List
                </Button>
                <Button
                  onClick={() => exportVendorRotOrders()}
                  className="bg-white text-[#0446DB] font-medium px-5 py-2 rounded-sm shadow hover:bg-indigo-100 transition"
                >
                  Export RTO List
                </Button>
  
                <Drawer
                  direction="right"
                  open={isFilterOpen}
                  onOpenChange={setIsFilterOpen}
                >
                  <DrawerTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-white text-[#0446DB] font-medium px-5  rounded-sm shadow hover:bg-indigo-100 transition"
                    >
                     
                      <span>Filter</span>
                    </Button>
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
  
                            applyFilters(); // Filter apply
  
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
                                      selected={advanceFilters.startDate}
                                      defaultMonth={advanceFilters.startDate}
                                      captionLayout="dropdown"
                                      onSelect={(date) => {
                                        const formattedDate = `${date.getFullYear()}/${(
                                          date.getMonth() + 1
                                        )
                                          .toString()
                                          .padStart(
                                            2,
                                            "0",
                                          )}/${date.getDate().toString().padStart(2, "0")}`;
                                        setAdvanceFilters({
                                          ...advanceFilters,
                                          startDate: formattedDate,
                                        });
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
                                      selected={advanceFilters.startDate}
                                      defaultMonth={advanceFilters.startDate}
                                      captionLayout="dropdown"
                                      onSelect={(date) => {
                                        const formattedDate = `${date.getFullYear()}/${(
                                          date.getMonth() + 1
                                        )
                                          .toString()
                                          .padStart(
                                            2,
                                            "0",
                                          )}/${date.getDate().toString().padStart(2, "0")}`;
                                        setAdvanceFilters({
                                          ...advanceFilters,
                                          endDate: formattedDate,
                                        });
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
                                onClick={() => {
                                  setFilterUpdate((prev) => !prev);
                                  setIsFilterOpen(false);
                                }}
                                className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-1"
                              >
                                Filter
                              </button>
                              <button
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
  
          <div className="   bg-white dark:bg-gray-900 rounded-md">
            <div className="w-full  bg-white   rounded shadow-sm  dark:bg-gray-900   left-0 px-4 z-40   ">
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
                    {status.map((st) => (
                      <Button
                        key={st}
                        onClick={() => {
                          setSelectedStatus(st);
                          setPage(1);
                          setEditingStatusId(null);
                          setSelectedBulkOrders([]);
                          setBulkOrderWeight(0);
                          setFetchBulkAssignmentRider(false);
                          setFetchBulkAssignmentVendor(false);
                          setmarkPickup(false);
                          setPopup(null);
                          setIsOpenIndividualAssignmnet("");
                        }}
                        className={`px-5 py-2.5 rounded-full my-2 border transition-all duration-300 font-medium text-sm tracking-wide ${
                          selectedStatus === st
                            ? "bg-[#0446DB] text-white shadow-sm  border-transparent"
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]"
                        }`}
                      >
                        {st === "ndr" ? "NDR" : toCapitalizeEachWord(st)}
                        {selectedStatus === st && ` (${totalOrders}) `}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
  
            {/* Bulk Pending Pickup Handle */}
            {selectedBulkOrders.length > 0 &&
              (selectedStatus === "pending pickup" ||
                selectedStatus === "out for delivery" ||
                selectedStatus === "rto in transit" ||
                selectedStatus === "picked" ||
                selectedStatus === "undelivered") && (
                <div className=" bg-white  ">
                  {/* <h2 className="text-xl font-bold text-gray-800 mb-5">
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
                  </div> */}
  
                  <div className=" px-5 py-1 flex flex-wrap items-center gap-4">
                    {selectedStatus === "rto in transit" ? (
                      <>
                        {editingStatusId ? (
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();
                              const newStatus = e.target.elements.status.value;
                              changeStatus(selectedBulkOrders[0].id, newStatus);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <select
                                name="status"
                                defaultValue={"order.status"}
                                className="text-xs border border-gray-300 rounded-md px-2 py-3"
                                required
                              >
                                <option disabled value="">
                                  Change Status
                                </option>
                                <option value="rto delivered">
                                  RTO Delivered
                                </option>
                              </select>
                              <button
                                type="submit"
                                className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                              >
                                Update
                              </button>
                            </div>
                          </form>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingStatusId(true);
                            }}
                            className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                          >
                            Bulk RTO Delivered
                          </button>
                        )}
                      </>
                    ) : selectedStatus === "picked" ||
                      selectedStatus === "undelivered" ? (
                      <>
                        
  
                        <AlertDialog>
                          <AlertDialogTrigger
                            render={<Button variant="outline" />}
                          >
                            <Button
                              onClick={() => {
                                const order_ids = [
                                  ...new Set(selectedBulkOrders.map((o) => o.id)),
                                ];
                                fetchReassignRiders(order_ids);
                              }}
                              className=" bg-[#0446DB] text-white py-1 px-2 rounded-sm cursor-pointer"
                            >
                              Assign Rider
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="!max-w-sm">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Assign Order to a Rider
                              </AlertDialogTitle>
                              <AlertDialogDescription className="w-full">
                                <div className=" flex w-full">
                                  <form className="space-y-6 w-full">
                                    <div className="w-full  space-y-2">
                                      <label
                                        htmlFor="riderSelect"
                                        className="block text-lg font-medium text-gray-700"
                                      >
                                        Select Rider:
                                      </label>
                                      <select
                                        value={newRider || ""}
                                        onChange={(e) =>
                                          setNewRider(e.target.value)
                                        }
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                      >
                                        <option value="">Select Rider</option>
  
                                        {reassignRidersOptions.map((rider) => {
                                          return (
                                            <option
                                              key={rider.rider_id}
                                              value={rider.value}
                                            >
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
                                onClick={async (e) => {
                                  if (!newRider) {
                                    toast.error("Please seleact a rider.");
                                    return;
                                  }

                                    const ids = selectedBulkOrders.map((order) => order.id);
  
                                  
                                    assignBulkOrderRider(ids, newRider);
                                 
                                  setNewRider("");
                                }}

                                
                              >
                                Assign
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    ) : selectedStatus === "out for delivery" ? (
                      <>
                        <>
                          {bulkStatusState ? (
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                const newStatus = e.target.elements.status.value;
                                if (!newStatus) {
                                  toast.error("Please Select Status");
                                }
                                for (const order of selectedBulkOrders) {
                                  markOrdersDeliveredBulk(order.id);
                                }
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <select
                                  name="status"
                                  defaultValue={"order.status"}
                                  className="text-xs border border-gray-300 rounded-md px-2 py-3"
                                  required
                                >
                                  <option disabled value="">
                                    Change Status
                                  </option>
                                  <option value="delivered">Delivered</option>
                                </select>
                                <button
                                  type="submit"
                                  className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                                >
                                  Update Status
                                </button>
                              </div>
                            </form>
                          ) : (
                            <button
                              onClick={() => {
                                setBulkStatusState(true);
                              }}
                              className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
                            >
                              Update Status
                            </button>
                          )}
                        </>
                      </>
                    ) : (
                      <Button
                        onClick={async () => {
                          const order_ids = selectedBulkOrders.map((order) => order.id);
                          const result = await PickedOrder(order_ids);
                          // for (const order of selectedBulkOrders) {
                          // }
                        }}
                        className="bg-[#0446DB]  transition text-white px-5 py-2 rounded-sm shadow font-medium"
                      >
                        Mark Bulk Pickup
                      </Button>
                    )}
  
                    <Button
                      className="bg-red-500 hover:bg-red-800 transition text-white px-3 py-1 rounded-sm shadow-sm font-medium"
                      onClick={() => {
                        setSelectedBulkOrders([]);
                        setEditingStatusId(null);
                      }}
                    >
                      Clear Selected Orders
                    </Button>
                  </div>
                </div>
              )}
  
            {/* Table */}
            <div className="overflow-x-auto bg-white dark:bg-gray-900 ">
              <Table>
                <TableHeader>
                  <TableRow>
                    {selectedStatus === "pending pickup" ||
                    selectedStatus === "picked" ||
                    selectedStatus === "rto in transit" ||
                    selectedStatus === "undelivered" ? (
                      <TableHead className="px-6 py-4">
                        <div>
                          <span>
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                              checked={
                                selectedBulkOrders.filter(
                                  (order) => order.mapped_with !== null,
                                ).length ===
                                orders.filter(
                                  (order) => order.mapped_with !== null,
                                )?.length
                              }
                              onChange={toggleSelectAll}
                            />
                          </span>
                        </div>
                      </TableHead>
                    ) : (
                      <TableHead className="px-6 py-4">-</TableHead>
                    )}
  
                    <TableHead className="text-left whitespace-nowrap px-6 py-3">
                      ORDER ID
                    </TableHead>
                    {(selectedStatus === "in transit" ||
                      selectedStatus === "out for delivery" ||
                      selectedStatus === "delivered" ||
                      selectedStatus === "undelivered assigned" ||
                      selectedStatus === "ndr" ||
                      selectedStatus === "rto in transit" ||
                      selectedStatus === "rto delivered") && (
                      <TableHead className="text-left px-6 py-3">
                        RIDER ID
                      </TableHead>
                    )}
                    <TableHead className="text-left whitespace-nowrap px-6 py-3">
                      CONSIGNEE ADDRESS
                    </TableHead>
                    <TableHead className="text-left whitespace-nowrap px-6 py-3">
                      PACKAGE DETAILS
                    </TableHead>
                    <TableHead className="text-left whitespace-nowrap px-6 py-3">
                      ASSIGNMENT
                    </TableHead>
                    <TableHead className="text-left whitespace-nowrap px-6 py-3">
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
                      const badge = getOrderSpecificBadge(order.order_specific);
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
                            isSelected ? "bg-gray-100 text-white" : ""
                          } dark:hover:bg-gray-800`}
                        >
                          {/* Select */}
                          {(selectedStatus === "pending pickup" ||
                            selectedStatus === "picked" ||
                            selectedStatus === "rto in transit" ||
                            selectedStatus === "undelivered") &&
                          order.mapped_with !== null ? (
                            <TableCell className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedBulkOrders((prev) => [
                                      ...prev,
                                      order,
                                    ]);
                                    setBulkOrderWeight(
                                      (prev) =>
                                        Number(prev) + Number(order.total_weight),
                                    );
                                  } else {
                                    setSelectedBulkOrders((prev) =>
                                      prev.filter((o) => o.id !== order.id),
                                    );
                                    setBulkOrderWeight(
                                      (prev) =>
                                        Number(prev) - Number(order.total_weight),
                                    );
                                  }
                                }}
                                className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
                              />
                            </TableCell>
                          ) : (
                            <TableCell className="px-6 py-4">-</TableCell>
                          )}
  
                          {/* Order ID */}
                          <TableCell className="px-6 py-4">
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
                                <AlertDialogTrigger
                                  render={<Button variant="outline" />}
                                >
                                  <TbFileInfo className=" h-5 w-5" />
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Order Details
                                    </AlertDialogTitle>
                                    <AlertDialogDescription
                                    className='!max-h-96 overflow-y-scroll'
                                    >
                                      <div className="p-6 space-y-6">
                                        {/* Order Badge */}
                                        <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-indigo-50 p-4 rounded-sm border border-indigo-100">
                                          <div className="flex items-center space-x-4">
                                            <div
                                              className={`px-3 py-1 rounded-full ${order.order_type === "cod" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                                            >
                                              <span className="font-semibold text-sm">
                                                {order.order_type === "cod"
                                                  ? "COD"
                                                  : "PREPAID"}
                                              </span>
                                            </div>
                                            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                                              <span className="font-semibold text-sm">
                                                {toCapitalizeEachWord(
                                                  order.status,
                                                )}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <div className="text-2xl font-bold text-gray-800">
                                              ₹
                                              {Number(
                                                order.total_amount,
                                              ).toLocaleString()}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                              Total Amount
                                            </div>
                                          </div>
                                        </div>
  
                                        {/* Basic Details Card */}
                                        <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
                                          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-3 border-b border-grey-200">
                                            <h3 className="font-semibold text-gray-800 flex items-center">
                                              <svg
                                                className="w-5 h-5 mr-2 text-indigo-600"
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
                                              Basic Information
                                            </h3>
                                          </div>
                                          <div className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                                                  value:
                                                    order.order_specific ===
                                                    "Turant"
                                                      ? "Turant"
                                                      : order.order_specific.slice(
                                                          0,
                                                          3,
                                                        ),
                                                },
                                                // { label: "Total Weight", value: `${Number(popup.total_weight).toLocaleString()}g` },
                                                {
                                                  label: "Packets",
                                                  value: order.number_of_boxes,
                                                },
                                                {
                                                  label: "Status",
                                                  value: toCapitalizeEachWord(
                                                    order.status,
                                                  ),
                                                  highlight: true,
                                                },
                                              ].map((item, index) => (
                                                <div
                                                  key={index}
                                                  className="space-y-1"
                                                >
                                                  <div className="text-sm text-gray-500 font-medium">
                                                    {item.label}
                                                  </div>
                                                  <div className="flex items-center">
                                                    <span
                                                      className={`font-semibold ${item.highlight ? "text-indigo-600" : "text-gray-800"}`}
                                                    >
                                                      {item.value}
                                                    </span>
                                                    {item.copy && (
                                                      <button
                                                        onClick={() => {
                                                          navigator.clipboard.writeText(
                                                            item.value,
                                                          );
                                                          setCopySuccess(
                                                            item.value,
                                                          );
                                                          setTimeout(
                                                            () =>
                                                              setCopySuccess(
                                                                null,
                                                              ),
                                                            2000,
                                                          );
                                                        }}
                                                        className="ml-2 p-1 hover:bg-gray-100 rounded transition"
                                                      >
                                                        {copySuccess ===
                                                        item.value ? (
                                                          <svg
                                                            className="w-4 h-4 text-green-500"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                          >
                                                            <path
                                                              fillRule="evenodd"
                                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                              clipRule="evenodd"
                                                            />
                                                          </svg>
                                                        ) : (
                                                          <svg
                                                            className="w-4 h-4 text-gray-400 hover:text-indigo-600"
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
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
  
                                        {/* Delivery Details Card */}
                                        <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
                                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-3 border-b border-grey-200">
                                            <h3 className="font-semibold text-gray-800 flex items-center">
                                              <svg
                                                className="w-5 h-5 mr-2 text-green-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                                />
                                              </svg>
                                              Delivery Details
                                            </h3>
                                          </div>
                                          <div className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                              <div className="space-y-3">
                                                <div className="flex items-center space-x-3">
                                                  <div className="p-2 bg-green-100 rounded-sm">
                                                    <svg
                                                      className="w-5 h-5 text-green-600"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      viewBox="0 0 24 24"
                                                    >
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                      />
                                                    </svg>
                                                  </div>
                                                  <div>
                                                    <div className="text-sm text-gray-500">
                                                      Customer Name
                                                    </div>
                                                    <div className="font-semibold text-gray-800">
                                                      {
                                                        order.delivery_contact_name
                                                      }
                                                    </div>
                                                  </div>
                                                </div>
                                                
                                              </div>
                                              <div className="space-y-3">
                                                <div className="flex items-start space-x-3">
                                                  <div className="p-2 bg-purple-100 rounded-sm mt-1">
                                                    <svg
                                                      className="w-5 h-5 text-purple-600"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      viewBox="0 0 24 24"
                                                    >
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                      />
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                      />
                                                    </svg>
                                                  </div>
                                                  <div>
                                                    <div className="text-sm text-gray-500">
                                                      Address
                                                    </div>
                                                    <div className="font-semibold text-gray-800">
                                                      {
                                                        order.delivery_address_line
                                                      }
                                                    </div>
                                                    <div className="text-sm text-gray-600 mt-1">
                                                      {order.delivery_city},{" "}
                                                      {order.delivery_state} -{" "}
                                                      {order.delivery_pincode}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
  
                                        {/* Pickup Details Card */}
                                        <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
                                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-3 border-b border-grey-200">
                                            <h3 className="font-semibold text-gray-800 flex items-center">
                                              <svg
                                                className="w-5 h-5 mr-2 text-amber-600"
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
                                              Pickup Details
                                            </h3>
                                          </div>
                                          <div className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                              <div className="space-y-3">
                                                <div className="flex items-center space-x-3">
                                                  <div className="p-2 bg-amber-100 rounded-sm">
                                                    <svg
                                                      className="w-5 h-5 text-amber-600"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      viewBox="0 0 24 24"
                                                    >
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                      />
                                                    </svg>
                                                  </div>
                                                  <div>
                                                    <div className="text-sm text-gray-500">
                                                      Pickup Contact
                                                    </div>
                                                    <div className="font-semibold text-gray-800">
                                                      {order.pickup_contact_name ||
                                                        "N/A"}
                                                    </div>
                                                  </div>
                                                </div>
                                                
                                              </div>
                                              <div className="space-y-3">
                                                <div className="flex items-start space-x-3">
                                                  <div className="p-2 bg-orange-100 rounded-sm mt-1">
                                                    <svg
                                                      className="w-5 h-5 text-orange-600"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      viewBox="0 0 24 24"
                                                    >
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                      />
                                                    </svg>
                                                  </div>
                                                  <div>
                                                    <div className="text-sm text-gray-500">
                                                      Address
                                                    </div>
                                                    <div className="font-semibold text-gray-800">
                                                      {order.pickup_address_line ||
                                                        "N/A"}
                                                    </div>
                                                    <div className="text-sm text-gray-600 mt-1">
                                                      {order.pickup_city
                                                        ? `${order.pickup_city}, ${order.pickup_state} - ${order.pickup_pincode}`
                                                        : "N/A"}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
  
                                        {/* NDR Actions Section */}
                                        {order.ndr_actions &&
                                          order.ndr_actions.length > 0 && (
                                            <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
                                              <button
                                                onClick={() =>
                                                  setShowNdrActions(
                                                    !showNdrActions,
                                                  )
                                                }
                                                className="w-full bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition"
                                              >
                                                <div className="flex items-center">
                                                  <svg
                                                    className={`w-5 h-5 mr-3 ${showNdrActions ? "text-red-600" : "text-gray-600"}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                  >
                                                    <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                  </svg>
                                                  <div>
                                                    <h3 className="font-semibold text-gray-800 text-left">
                                                      NDR Actions
                                                    </h3>
                                                    <p className="text-sm text-gray-500 text-left">
                                                      Non-Delivery Reports (
                                                      {order.ndr_actions.length})
                                                    </p>
                                                  </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                                                    {order.ndr_actions.length}{" "}
                                                    actions
                                                  </span>
                                                  <svg
                                                    className={`w-5 h-5 text-gray-600 transform transition ${showNdrActions ? "rotate-180" : ""}`}
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
                                                </div>
                                              </button>
  
                                              {showNdrActions && (
                                                <div className="p-6 space-y-4">
                                                  {order.ndr_actions.map(
                                                    (item) => (
                                                      <div
                                                        key={item.action_id}
                                                        className="border border-gray-200 rounded-sm p-4 hover:border-red-200 hover:bg-red-50/50 transition group relative"
                                                      >
                                                        <div className="flex items-start justify-between">
                                                          <div className="flex items-start space-x-3">
                                                            <div
                                                              className={`p-2 rounded-sm ${getActionColor(item.action_taken).bg}`}
                                                            >
                                                              <svg
                                                                className={`w-5 h-5 ${getActionColor(item.action_taken).text}`}
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                              >
                                                                <path
                                                                  strokeLinecap="round"
                                                                  strokeLinejoin="round"
                                                                  strokeWidth={2}
                                                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                />
                                                              </svg>
                                                            </div>
                                                            <div>
                                                              <div className="flex items-center space-x-2">
                                                                <span className="font-semibold text-gray-800">
                                                                  {getActionLabel(
                                                                    item.action_taken,
                                                                  )}
                                                                </span>
                                                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                                                                  #
                                                                  {item.action_id}
                                                                </span>
                                                              </div>
                                                              <div className="mt-2 space-y-2">
                                                                {item.action_taken ===
                                                                "change_phone" ? (
                                                                  <div className="text-sm text-gray-600">
                                                                    <span className="font-medium">
                                                                      New Phone:
                                                                    </span>{" "}
                                                                    {
                                                                      item.customer_phone
                                                                    }
                                                                  </div>
                                                                ) : item.action_taken ===
                                                                  "change_address" ? (
                                                                  <>
                                                                    <div className="text-sm text-gray-600">
                                                                      <span className="font-medium">
                                                                        Name:
                                                                      </span>{" "}
                                                                      {
                                                                        item.customer_name
                                                                      }
                                                                    </div>
                                                                    <div className="text-sm text-gray-600">
                                                                      <span className="font-medium">
                                                                        Address:
                                                                      </span>{" "}
                                                                      {
                                                                        item.customer_details_address
                                                                      }
                                                                    </div>
                                                                  </>
                                                                ) : (
                                                                  <div className="text-sm text-gray-600">
                                                                    <span className="font-medium">
                                                                      Remarks:
                                                                    </span>{" "}
                                                                    {item.remarks}
                                                                  </div>
                                                                )}
                                                              </div>
                                                              <div className="mt-3 text-xs text-gray-500 flex items-center">
                                                                <svg
                                                                  className="w-4 h-4 mr-1"
                                                                  fill="none"
                                                                  stroke="currentColor"
                                                                  viewBox="0 0 24 24"
                                                                >
                                                                  <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                      2
                                                                    }
                                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                  />
                                                                </svg>
                                                                {new Date(
                                                                  item.created_at,
                                                                ).toLocaleString(
                                                                  "en-IN",
                                                                  {
                                                                    timeZone:
                                                                      "Asia/Kolkata",
                                                                    day: "2-digit",
                                                                    month:
                                                                      "2-digit",
                                                                    year: "numeric",
                                                                    hour: "2-digit",
                                                                    minute:
                                                                      "2-digit",
                                                                    hour12: true,
                                                                  },
                                                                )}
                                                              </div>
                                                            </div>
                                                          </div>
  
                                                          {/* Action Menu */}
                                                          <div className="relative">
                                                            <button
                                                              onClick={() =>
                                                                setOpenDropdown(
                                                                  openDropdown ===
                                                                    item.action_id
                                                                    ? null
                                                                    : item.action_id,
                                                                )
                                                              }
                                                              className="p-2 hover:bg-gray-100 rounded-sm transition opacity-0 group-hover:opacity-100"
                                                            >
                                                              <svg
                                                                className="w-5 h-5 text-gray-400"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                              >
                                                                <path
                                                                  strokeLinecap="round"
                                                                  strokeLinejoin="round"
                                                                  strokeWidth={2}
                                                                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                                                />
                                                              </svg>
                                                            </button>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    ),
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                      </div>
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </p>
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
  
                            <p className="text-s text-gray-400 dark:text-white">
                              Merchant ID: {order.merchant_id}
                            </p>
                            <p className="text-s text-gray-400 dark:text-white whitespace-nowrap">
                              Merchant Order ID: {order.merchant_order_id}
                            </p>
                          </TableCell>
  
                          {/* Rider ID */}
                          {(selectedStatus === "in transit" ||
                            selectedStatus === "out for delivery" ||
                            selectedStatus === "delivered" ||
                            selectedStatus === "undelivered assigned" ||
                            selectedStatus === "ndr" ||
                            selectedStatus === "rto in transit" ||
                            selectedStatus === "rto delivered") && (
                            <td className="px-6 py-4 dark:text-white">{`FP_${order.rider_vendor_id}_${order.rider_id}`}</td>
                          )}
  
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
                                {order.delivery_address_line.slice(0, 35)}....
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
  
                          {/* Package Details */}
                          <TableCell className="px-6 py-4">
                            <p>
                              <span className=" whitespace-nowrap text-gray-800 ">
                                EDD: {order.EDD}
                              </span>
                            </p>
                            <p>
                              <span
                                className={`ml-2 px-2 py-0.5 rounded-full text-sm font-semibold shadow-sm ${
                                  order.order_specific.startsWith("NDD")
                                    ? "text-green-800 bg-green-100 border border-green-300"
                                    : order.order_specific.startsWith("SDD")
                                      ? "text-yellow-800 bg-yellow-100 border border-yellow-300"
                                      : `text-red-800 bg-red-100 border border-red-300 ${order.status !== "delivered" ? "animate-blink" : ""}`
                                }`}
                              >
                                {order.order_specific.split("-")[0]}
                              </span>
                            </p>
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
  
                          {/* Status */}
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusDisplay(order)}
                            </td> */}
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
                                    <TableCell
                                      onClick={() => {
                                        // if (order.order_type === 'cod') {
                                        //   return
                                        // }
                                        setIsOpenIndividualAssignmnet(order.id);
                                      }}
                                      className="px-6 cursor-pointer py-4 whitespace-nowrap"
                                    >
                                      {getStatusDisplay(order)}
                                    </TableCell>
                                  </>
                                ) : (
                                  <>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                      {getStatusDisplay(order)}
                                    </TableCell>
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
  
            <div className="py-3 flex justify-end gap-4  mx-10">
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
  
          
  
          
  
          
          <AlertDialog open={reassignPopup} onOpenChange={setReassignPopup}>
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
                              <option key={rider.rider_id} value={rider.value}>
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
                          (option) => option.value === newRider,
                        )}
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

export default VendorOrderDetails;
