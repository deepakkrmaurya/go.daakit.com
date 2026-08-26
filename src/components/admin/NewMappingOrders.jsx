
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaFilter } from 'react-icons/fa';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegCopy } from "react-icons/fa";
import { TbFileInfo } from "react-icons/tb";
import { CiCircleCheck } from "react-icons/ci";

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
const baseURL = import.meta.env.VITE_BASE_URL;
const frontEndURL = import.meta.env.VITE_FRONTEND_URL;
function NewMappingOrders() {

  const [isOpenIndividualVendorMap, setIsOpenIndividualVendorMap] = useState("");
  const [fetchBulkAssignmentVendor, setFetchBulkAssignmentVendor] = useState(false);
  const [selectedBulkOrders, setSelectedBulkOrders] = useState([]);
  const [assignmentState, setAssignmentState] = useState("");
  const [vendor, setVendor] = useState([]);
  const [isOpenIndividualVendorAssignmnet, setIsOpenIndividualVendorAssignmnet] = useState("");
  const [copySuccess, setCopySuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [advanceFilters, setAdvanceFilters] = useState({
    startDate: "",
    endDate: "",
    awb_number: "",
    vendor_id: "",
    new_vendor_id: "",
    old_vendor_id: "",
    action: ""
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate()

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
      setIsOpenIndividualVendorMap("");
      fetchOrders()

    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to load riders");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (filters = advanceFilters, targetPage = page) => {


    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/admin/getAllOrderNewMappings`, {
        params: {
          page: targetPage,
          limit,
          ...filters
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setOrders(res.data.data.records || []);

      setTotalPages(res.data?.data?.pagination.totalPages || 1)
    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "An error occurred while fetching orders.");
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


  const fetchVendor = async (order_ids) => {
    if (order_ids.length == 0) {
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
      //   setAssignmentState("");
      //   setSelectedBulkOrders([]);
      //   setBulkOrderWeight(0);
      //   setFetchBulkAssignmentRider(false);
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
      setAssignmentState("");
      setSelectedBulkOrders([]);
      setBulkOrderWeight(0);

    } catch (err) {
      toast.error("Failed to assign vendor");
      return
    } finally {
      setLoading(false);
    }
  };


  const [bulkOrderWeight, setBulkOrderWeight] = useState(0);
  const toggleSelectAll = () => {
    if (selectedBulkOrders.length === orders?.filter((o) => o.tpc_awb_number === null).length) {
      setSelectedBulkOrders([]);
      setBulkOrderWeight(0);
    } else {


      const ord = orders?.filter(order => order.tpc_awb_number == null);
      setSelectedBulkOrders(ord);

      const totalWeight = orders?.filter(order => order.tpc_awb_number == null)
        .reduce(
          (acc, order) => acc + Number(order.total_weight),
          0
        );
      setBulkOrderWeight(totalWeight);
    }
  };





  const openDatePicker = (event) => {
    try {
      event.currentTarget.showPicker?.();
    } catch {
      // Some browsers block programmatic picker opening; normal focus still works.
    }
  };

  const updateAdvanceFilter = (name, value) => {
    setAdvanceFilters((prev) => {
      if (name === "startDate") {
        return {
          ...prev,
          startDate: value,
          endDate: prev.endDate && value && prev.endDate < value ? value : prev.endDate,
        };
      }

      if (name === "endDate") {
        return {
          ...prev,
          startDate: prev.startDate && value && prev.startDate > value ? value : prev.startDate,
          endDate: value,
        };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    updateAdvanceFilter(name, value);
  };

  const applyFilters = () => {
    if (
      advanceFilters.startDate &&
      advanceFilters.endDate &&
      advanceFilters.startDate > advanceFilters.endDate
    ) {
      toast.error("Start date cannot be after end date.");
      return;
    }

    setPage(1);
    fetchOrders(advanceFilters, 1);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    const emptyFilters = {
      startDate: "",
      endDate: "",
      awb_number: "",
      vendor_id: "",
      new_vendor_id: "",
      old_vendor_id: "",
      action: ""
    };


    setAdvanceFilters(emptyFilters);
    setPage(1);
    fetchOrders(emptyFilters, 1);
    setIsFilterOpen(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
  };


  const setLastOneMonth = () => {
    const endDate = new Date();
    const startDate = new Date();

    startDate.setMonth(startDate.getMonth() - 1);

    setAdvanceFilters((prev) => ({
      ...prev,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    }));
  };

  useEffect(() => {
    fetchOrders();
  }, [page, limit]);

  useEffect(()=>{
    setLastOneMonth()
  },[])



  return (
    <div className=" ">
      <div className="sticky top-0 left-0  z-10 bg-[#0446DB] dark:border-b dark:border-[#0446DB] dark:bg-gray-900 py-4 md:py-6 shadow-md ">
        <div className="  mx-auto px-8  ">
          {/* Mobile Layout */}
          <div className="  flex flex-col space-y-4">
            {/* Top Row: Heading and Buttons */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">New Mapped Orders</h1>

              <div className="flex items-center gap-2">
                <Drawer direction="right" open={isFilterOpen} onOpenChange={setIsFilterOpen}>
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
                      <DrawerTitle>Filter Orders</DrawerTitle>
                    </DrawerHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        applyFilters();
                        setIsFilterOpen(false);
                      }}
                    >

                      <div className="p-6">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                              id="startDate"
                              name="startDate"
                              type="date"
                              // value={advanceFilters.startDate}
                              value={advanceFilters.startDate?.replace(/\//g, "-") || ""}
                              max={advanceFilters.endDate || undefined}
                              onChange={handleFilterChange}
                              onClick={openDatePicker}
                              onFocus={openDatePicker}
                              className="cursor-pointer bg-white text-gray-900"
                            />
                          </div>
                          <div>
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                              id="endDate"
                              name="endDate"
                              type="date"
                              // value={advanceFilters.endDate}
                              value={advanceFilters.endDate?.replace(/\//g, "-") || ""}
                              min={advanceFilters.startDate || undefined}
                              onChange={handleFilterChange}
                              onClick={openDatePicker}
                              onFocus={openDatePicker}
                              className="cursor-pointer bg-white text-gray-900"
                            />
                          </div>

                          <div>
                            <Label htmlFor="awb_number">AWB Number</Label>
                            <Input
                              id="awb_number"
                              name="awb_number"
                              value={advanceFilters.awb_number}
                              onChange={handleFilterChange}
                              placeholder="Enter AWB number"
                            />
                          </div>




                          <div>
                            <Label htmlFor="vendor_id">Vendor ID</Label>
                            <Input
                              id="vendor_id"
                              name="vendor_id"
                              value={advanceFilters.vendor_id}
                              onChange={handleFilterChange}
                              placeholder="Enter vendor ID"
                            />
                          </div>
                          <div>
                            <Label htmlFor="vendor_id">NewVendor ID</Label>
                            <Input
                              id="new_vendor_id"
                              name="new_vendor_id"
                              value={advanceFilters.new_vendor_id}
                              onChange={handleFilterChange}
                              placeholder="Enter New vendor ID"
                            />
                          </div>
                          <div>
                            <Label htmlFor="vendor_id">Old Vendor ID</Label>
                            <Input
                              id="old_vendor_id"
                              name="old_vendor_id"
                              value={advanceFilters.old_vendor_id}
                              onChange={handleFilterChange}
                              placeholder="Enter Old vendor ID"
                            />
                          </div>



                          <div>
                            <Label htmlFor="action">Action</Label>
                            <Select
                              value={advanceFilters.action}
                              onValueChange={(value) => {
                                setAdvanceFilters({
                                  ...advanceFilters,
                                  action: value
                                })
                              }}
                            >
                              <SelectTrigger className="w-full max-w-full">
                                <SelectValue placeholder="Select Action" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Select Action</SelectLabel>
                                  <SelectItem value="grant">Grant</SelectItem>
                                  <SelectItem value="revoke">Revoke</SelectItem>

                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <DrawerFooter>
                        <Button
                          type="submit"
                          className='bg-[#564ec1]'

                        >
                          Apply Filters
                        </Button>
                        <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>

                      </DrawerFooter>
                    </form>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          </div>


        </div>
      </div>
      <div className="border rounded-lg ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>AWB NUMBER</TableHead>
              <TableHead>NEW VENDOR ID</TableHead>
              <TableHead>NEW VENDOR REMARKS</TableHead>
              <TableHead>NEW VENDOR STATUS</TableHead>
              <TableHead>OLD VENDOR ID</TableHead>
              <TableHead>OLD VENDOR REMARKS</TableHead>
              <TableHead>OLD VENDOR STATUS</TableHead>
              <TableHead>ORDER STATUS</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>ACTION</TableHead>
              <TableHead>CREATION TIME</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
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
              orders.map((order) => {
                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order.awb_number}
                    </TableCell>
                    <TableCell>
                      {order.new_vendor_id ? order.new_vendor_id : "-"}
                    </TableCell>
                    <TableCell>
                      {order.new_vendor_remarks ? order.new_vendor_remarks : "-"}
                    </TableCell>
                    <TableCell>
                      {order.new_vendor_status ? order.new_vendor_status : "-"}
                    </TableCell>
                    <TableCell>
                      {order.old_vendor_id ? order.old_vendor_id : "-"}
                    </TableCell>
                    <TableCell>
                      {order.old_vendor_remarks ? order.old_vendor_remarks : "-"}
                    </TableCell>
                    <TableCell>
                      {order.old_vendor_status ? order.old_vendor_status : "-"}
                    </TableCell>
                    <TableCell>
                      {order.order_status ? order.order_status : "-"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`${order.status == 'open' ? "bg-green-100 text-green-600 p-1 r" : "bg-red-100 text-red-600"} px-3 py-1 rounded-full text-xs font-medium `}
                      >
                        {order.status ? order.status : "-"}

                      </span>
                    </TableCell>
                    <TableCell>
                      {
                        isOpenIndividualVendorMap === order.id ? (

                          <>
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                revokeVendorMapping(order.order_id)
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

                                  setIsOpenIndividualVendorMap("");
                                }

                                }
                              >
                                Close
                              </button>
                            </form>
                          </>
                        ) : (order.old_vendor_status == 'to be handover' && order.action == 'grant' && order.new_vendor_status == 'pending pickup') ? (
                          <>
                            <span
                              onClick={() => {
                                setIsOpenIndividualVendorMap(order.id)
                              }}
                              className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 mb-2 inline-block cursor-pointer"
                            >Revoke</span>
                          </>
                        ) : (
                          <>
                            <span
                              className={`px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium ${order.action === 'grant' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} mb-2 inline-block cursor-pointer`}
                            >

                              {order.action}
                            </span>

                          </>
                        )
                      }

                    </TableCell>
                    <TableCell>
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
                    </TableCell>


                  </TableRow>
                )
              }


              )
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center py-3 px-3">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
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
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewMappingOrders;
