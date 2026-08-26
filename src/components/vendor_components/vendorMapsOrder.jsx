import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Loader from "../Loader";

import { TbFileInfo } from "react-icons/tb";
import { FaRegCopy } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
const baseURL = import.meta.env.VITE_BASE_URL;
const frontEndURL = import.meta.env.VITE_FRONTEND_URL;

function VendorMapsOrder() {
  const [loading, setLoading] = useState(true);
  const [vendorId, setVendorId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [popup, setPopup] = useState(null);
  const [copySuccess, setCopySuccess] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [isOpenIndividualAssignmnet, setIsOpenIndividualAssignmnet] = useState("");
  const [isOpenIndividualAssignOrderToRider, setIsOpenIndividualAssignOrderToRider] = useState("");
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
  const [filterUpdate, setFilterUpdate] = useState(false);
  const [riderOptions, setRiderOptions] = useState([]);
  const [reassignRidersOptions, setReassignRidersOptions] = useState([]);

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

  const status = [
    "All",
    "pending pickup",
    "in transit",
    // "out for delivery",
    // "delivered",
    "undelivered",
    // "undelivered assigned",
    // "ndr",
    "rto in transit",
    "rto delivered",
  ];
  const [selectedStatus, setSelectedStatus] = useState("All");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/vendor/getVendorMappedOrders`,
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
        }
      );
      setTotalOrders(res.data.totalResults);
      setOrders(res.data.data || []);
      setTotalPages(Math.max(1, res.data.totalPages));
      setVendorId(res.data.filters.vendor_id);

    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "An error occurred while fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRiders = async (order_ids) => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/vendor/getVendorRiders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          limit: 10000,
        },
      });
      const tempArr = [{ value: "", label: "All Riders" }];
      res?.data?.data?.forEach(element => {
        tempArr.push({ value: element.id, label: `FP${element.vendor_id}_${element.id}: ${element.name}` });
      });
      setRiderOptions(tempArr);

    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to load riders");
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

  const fetchReassignRiders = async (order_id) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/vendor/getRidersOutsideIdealLoad`,
        {
          params: {
            order_id,
            limit: 10000,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const tempArr = [];
      res?.data?.data.forEach((element) => {
        tempArr.push({ value: element.rider_id, label: `${element.rider_id}: ${element.rider_name} | ${element.total_weight_grams}g | ${element.total_boxes} box(es)` })
      })

      setReassignRidersOptions(tempArr);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error in fetching riders");
    } finally {
      setLoading(false);
    }
  };

  const reassignRider = async (order_id, new_rider_id) => {
    setLoading(true);
    try {
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
        }
      );
      fetchOrders();
      setNewRider("");
      setReassignPopup(null);
      setReassignRidersOptions([]);
      setIsOpenIndividualAssignmnet(null);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error while reassigning order to new rider");
    } finally {
      setLoading(false);
    }
  };
  const assignOrderToRider = async (order_id, rider_id) => {
    setLoading(true);
    console.log(order_id, rider_id)
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
        }
      );
      fetchOrders();
      setNewRider("");
      setReassignRidersOptions([]);
      setReassignRiderPopup(null)
      setIsOpenIndividualAssignmnet(null);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error while reassigning order to new rider");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    resetAdvanceFilters();
    fetchRiders();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [page, selectedStatus]);

  useEffect(() => {
    if (filterUpdate) {
      fetchOrders();
      setFilterUpdate(false);
    }
  }, [filterUpdate]);

  return (
    <>

      <div className="bg-gray-100 min-h-screen w-full">
        {/* Right Sidebar for filters */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isFilterOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Advance Filters</h2>
            <button
              onClick={() => {
                setIsFilterOpen(false);
              }}
              className="text-gray-500 hover:text-black text-2xl font-bold"
            >
              &times;
            </button>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap items-end gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
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
                  className="border px-3 py-1 rounded-md text-sm"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
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
                  className="border px-3 py-1 rounded-md text-sm"
                />
              </div>

              {/* Rider ID */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Rider ID
                </label>
                <Select
                  options={riderOptions}
                  isSearchable
                  value={riderOptions.find(
                    (option) => option.value === advanceFilters.rider_id
                  )}
                  onChange={(selectedOption) =>
                    setAdvanceFilters((prev) => ({
                      ...prev,
                      rider_id: selectedOption?.value || "",
                    }))
                  }
                  placeholder="Select Rider"
                  className="text-xs w-[150%]"

                />
              </div>

              {/* Order Specific */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
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
                  className="border px-3 py-1 rounded-md text-sm w-full"
                >
                  <option value="">All orders</option>
                  <option value="Turant">Turant</option>
                  <option value="SDD">Same Day Delivery</option>
                  <option value="NDD">Next Day Delivery</option>
                </select>
              </div>

              {/* Order ID */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Order ID
                </label>
                <input
                  type="text"
                  value={advanceFilters.order_id}
                  onChange={(e) =>
                    setAdvanceFilters((prev) => ({
                      ...prev,
                      order_id: e.target.value,
                    }))
                  }
                  placeholder="Enter Order ID(s)"
                  className="border px-3 py-1 rounded-md text-sm"
                />
              </div>

              {/* AWB Number */}
              <div>
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
                  className="border px-3 py-1 rounded-md text-sm"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
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
                  className="border px-3 py-1 rounded-md text-sm"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
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
                  className="border px-3 py-1 rounded-md text-sm"
                />
              </div>

              {/*  Button */}
              <div>
                <button
                  onClick={() => {
                    setFilterUpdate((prev) => !prev);
                    setIsFilterOpen(false);
                  }}
                  className="bg-[rgb(85,77,192)] text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
                >
                  Filter
                </button>
                <button
                  onClick={() => {
                    resetAdvanceFilters();
                    setFilterUpdate((prev) => !prev);
                    setIsFilterOpen(false);
                  }}
                  className="bg-[rgb(85,77,192)] text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Heading Strip */}
        <div className="mb-6 bg-[rgb(85,77,192)] py-[24px] shadow-md h-38 px-[24px]">
          <div className="flex flex-wrap items-center justify-between">
            {/* Heading */}
            <h1 className="text-2xl text-white">Order Details</h1>
            <div className="flex flex-wrap items-end gap-4 text-white">
              {/* Right Side Filters */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="bg-white text-[rgb(85,77,192)] font-medium px-5 py-2 rounded-lg shadow hover:bg-indigo-100 transition"
              >
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="mx-6 z-10 bg-white rounded-md">
          {/* Status */}
          <div className="max-w-full px-4 -mt-20 relative z-10">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {status.map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setSelectedStatus(st);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-full border transition font-medium mt-5 ${selectedStatus === st
                    ? "bg-[rgb(85,77,192)] text-white"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {st === "ndr" ? "NDR" : toCapitalizeEachWord(st)}
                  {selectedStatus === st && ` (${orders?.length}) `}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div >
            <Table>
              <TableHead >
                <TableRow>

                  <TableHead className="text-left px-6 py-3">ORDER ID</TableHead>
                  <TableHead className="text-left px-6 py-3">RIDER ID</TableHead>
                  <TableHead className="text-left px-6 py-3">CONSIGNEE ADDRESS</TableHead>
                  <TableHead className="text-left px-6 py-3">PACKAGE DETAILS</TableHead>
                  <TableHead className="text-left px-6 py-3">ASSIGNMENT</TableHead>
                  <TableHead className="text-left px-6 py-3">STATUS</TableHead>
                </TableRow>
              </TableHead>
              <TableBody >

                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                      <p className="mt-2">Loading orders...</p>
                    </TableCell>
                  </TableRow>
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

                    return (
                      <tr key={order.id} className="hover:bg-gray-50">

                        {/* Order ID */}
                        <td className="px-6 py-4">
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
                              className="pl-2 text-lg text-gray-600 hover:text-[rgb(85,77,192)] transition"
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
                              className="pl-2 text-lg text-gray-600 hover:text-[rgb(85,77,192)] transition"
                            >
                              <TbFileInfo />
                            </button>
                          </p>
                          <p className="text-s text-gray-500">
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

                          <p className="text-s text-gray-400">
                            Merchant ID: {order.merchant_id}
                          </p>
                          <p className="text-s text-gray-400">
                            Merchant Order ID: {order.merchant_order_id}
                          </p>
                        </td>

                        {/* Rider ID */}
                        <td className="px-6 py-4">{`FP${vendorId}_${order.rider_id}`}</td>

                        {/* Address */}
                        <td className="px-6 py-4 whitespace-pre-line">
                          <p className="font-medium text-gray-800">
                            {order.delivery_contact_name}
                          </p>
                          <p className="font-medium text-gray-800">
                            {order.delivery_address_line}
                          </p>
                          <p className="text-xs text-gray-500">
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
                            <span>
                              ETA:{" "}
                              {(() => {
                                const raw = new Date(order.created_at);
                                const prefix = order.order_specific.slice(
                                  0,
                                  3
                                );

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
                              })()}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium text-gray-800">
                              Weight:
                            </span>{" "}
                            {Number(order.total_weight).toLocaleString()}g
                            <span
                              className={`ml-2 px-2 py-0.5 rounded-full text-sm font-semibold shadow-sm ${order.order_specific.slice(0, 3) === "NDD"
                                ? "text-green-800 bg-green-100 border border-green-300"
                                : order.order_specific.slice(0, 3) === "SDD"
                                  ? "text-yellow-800 bg-yellow-100 border border-yellow-300"
                                  : "text-red-800 bg-red-100 border border-red-300 animate-blink"
                                }`}
                            >
                              {order.order_specific}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium text-gray-800">
                              Dimensions:
                            </span>{" "}
                            {order.package_length}x{order.package_breadth}x
                            {order.package_height}
                          </p>
                        </td>

                        {/* Assignment */}
                        <td className="px-6 py-4">
                          {order.status === "pending pickup" ||
                            order.status === "in transit" ||
                            order.status === "undelivered" ||
                            order.status === "undelivered assigned" ? (
                            <>
                              {!(isOpenIndividualAssignmnet === order.id) ? (
                                // <span
                                //   onClick={() => {
                                //     setIsOpenIndividualAssignmnet(order.id);
                                //   }}
                                //   className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 mb-2 inline-block cursor-pointer"
                                // >
                                //   Assigned
                                // </span>
                                order.status === "undelivered" ? (
                                  <span
                                    onClick={() => {
                                      setIsOpenIndividualAssignmnet(order.id);
                                    }}
                                    className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 whitespace-nowrap text-red-600 mb-2 inline-block cursor-pointer">
                                    Not Assigned
                                  </span>
                                ) : (
                                  <span
                                    onClick={() => {
                                      setIsOpenIndividualAssignmnet(order.id);
                                    }}
                                    className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600  whitespace-nowrap  mb-2 inline-block cursor-pointer">
                                    Assigned
                                  </span>
                                )
                              ) : (
                                <form className="flex items-center gap-2">
                                  {
                                    order.status !== "undelivered" && order.status !== "in transit" && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          cancelRiderAssignment(order.id);
                                          setIsOpenIndividualAssignmnet("");
                                        }}
                                        className="bg-[rgb(85,77,192)] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                      >
                                        Cancel Rider Assignment
                                      </button>
                                    )
                                  }
                                  {
                                    order.status === "undelivered" ? (
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          await fetchReassignRiders(order.id);
                                          setReassignRiderPopup(order.id);
                                        }}
                                        className="bg-[rgb(85,77,192)] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                      >
                                        Reassign Rider
                                      </button>
                                    ) : (

                                      <button
                                        type="button"
                                        onClick={async () => {
                                          await fetchReassignRiders(order.id);
                                          setReassignPopup(order.id);
                                        }}
                                        className="bg-[rgb(85,77,192)] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                      >
                                        Reassign Rider
                                      </button>
                                    )
                                  }

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
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                              Order Delivered
                            </span>
                          ) : order.status === "rto delivered" ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                              Delivered To Origin
                            </span>
                          ) : order.status === "ndr" ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                              Marked as NDR
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                              Assigned
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {order.status === "pending pickup" ? (
                            <span
                              className="px-3 py-1 rounded-full text-xs font-semibold inline-block bg-yellow-100 text-yellow-600"
                            >
                              Pending Pickup
                            </span>
                          ) : order.status === "out for delivery" ? (
                            <span
                              className="px-3 py-1 rounded-full text-xs font-semibold inline-block bg-blue-100 text-blue-600"
                            >
                              Out For Delivery
                            </span>
                          ) : order.status === "delivered" ? (
                            <span
                              className="px-3 py-1 rounded-full text-xs font-semibold inline-block bg-green-100 text-green-600"
                            >
                              Delivered
                            </span>
                          ) : order.status === "undelivered assigned" ? (
                            <span
                              className="px-3 py-1 rounded-full text-xs font-semibold inline-block bg-yellow-100 text-yellow-600"
                            >
                              Undelivered Assigned
                            </span>
                          ) : order.status === "ndr" ? (
                            <span
                              className="px-3 py-1 rounded-full text-xs font-semibold inline-block bg-red-100 text-red-600"
                            >
                              NDR
                            </span>
                          ) : <span
                            className="px-3 py-1 rounded-full text-xs font-semibold inline-block bg-green-100 text-green-600"
                          >
                            {toCapitalizeEachWord(order.status)}
                          </span>
                          }
                        </td>
                      </tr>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-md text-sm font-medium ${page === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[rgb(85,77,192)] text-white hover:bg-indigo-800"
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
                : "bg-[rgb(85,77,192)] text-white hover:bg-indigo-800"
                }`}
            >
              Next
            </button>
          </div>
        </div>

        {popup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(46,46,46,0.5)]">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden">
              {/* Modal Header */}
              <div className="bg-[rgb(85,77,192)] pt-4">
                <h2 className="text-xl font-semibold text-white text-center mb-4">
                  Order Details
                </h2>

                <div className="bg-white p-6  space-y-3 text-gray-700">
                  {/* Basic Info */}
                  <h3 className="font-semibold text-[rgb(85,77,192)] mb-2">
                    Basic Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>Order ID:</strong> {popup.merchant_order_id}
                      <button
                        className="pl-2 text-lg text-gray-600 hover:text-[rgb(85,77,192)] transition"
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
                        className="pl-2 text-lg text-gray-600 hover:text-[rgb(85,77,192)] transition"
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
                    <h3 className="font-semibold text-[rgb(85,77,192)] mb-2">
                      Delivery Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong>Customer Name:</strong>{" "}
                        {popup.delivery_contact_name}
                      </div>
                      <div>
                        <strong>Customer Contact No:</strong>{" "}
                        {popup.delivery_phone}
                      </div>
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
                    <h3 className="font-semibold text-[rgb(85,77,192)] mb-2">
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
                      onClick={() => setPopup(null)}
                      className="bg-[rgb(85,77,192)] text-white px-4 py-2 rounded hover:bg-indigo-800 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {reassignPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(46,46,46,0.5)]">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
              {/* Modal Header */}
              <div className="bg-[rgb(85,77,192)] py-6 px-4">
                <h2 className="text-2xl font-semibold text-white text-center">
                  Reassign Order to a Different Rider
                </h2>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    reassignRider(reassignPopup, newRider);
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
                        (option) => option.value === newRider
                      )}
                      onChange={(selectedOption) =>
                        setNewRider(selectedOption?.value)
                      }
                      placeholder="Select Rider"
                      className="text-sm"
                      classNamePrefix="react-select"
                      menuPortalTarget={document.body} // Renders menu at top level
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
                      className="bg-[rgb(85,77,192)] text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-800 transition"
                    >
                      Reassign
                    </button>
                    <button
                      type="button"
                      onClick={() => setReassignPopup(null)}
                      className="bg-gray-200 text-gray-700 font-semibold px-5 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {reassignRiderPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(46,46,46,0.5)]">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
              {/* Modal Header */}
              <div className="bg-[rgb(85,77,192)] py-6 px-4">
                <h2 className="text-2xl font-semibold text-white text-center">
                  Reassign Order to a Different Rider
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
                        (option) => option.value === newRider
                      )}
                      onChange={(selectedOption) =>
                        setNewRider(selectedOption?.value)
                      }
                      placeholder="Select Rider"
                      className="text-sm"
                      classNamePrefix="react-select"
                      menuPortalTarget={document.body} // Renders menu at top level
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
                      className="bg-[rgb(85,77,192)] text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-800 transition"
                    >
                      Reassign
                    </button>
                    <button
                      type="button"
                      onClick={() => setReassignRiderPopup(null)}
                      className="bg-gray-200 text-gray-700 font-semibold px-5 py-2 rounded-lg hover:bg-gray-300 transition"
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

    </>
  );
}

export default VendorMapsOrder;
