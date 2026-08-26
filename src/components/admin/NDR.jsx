import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Loader";

import { FaFilter, FaRegCopy, FaSearch } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
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

import {
  Drawer,
  DrawerContent,

  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { TbFileInfo } from "react-icons/tb";
import { sub } from "date-fns/sub";
const baseURL = import.meta.env.VITE_BASE_URL;
const frontEndURL = import.meta.env.VITE_FRONTEND_URL;
function NDR() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [historyItem, setHistoryItem] = useState(null);
  const [takeAction, setTakeAction] = useState(null);
  const [copySuccess, setCopySuccess] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newRTORemarkStatus, setRTORemarksStatus] = useState('');
  const [selectedNdrIds, setSelectedNdrIds] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkRemarks, setBulkRemarks] = useState('');
  const [bulkSubRemarks, setRTOBulkSubRemarksStatus] = useState('');
  const [bulkOtherRemarks, setBulkOtherRemarks] = useState('');
  const [bulkReattemptRemarks, setBulkReattemptRemarks] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [showBulkActionForm, setShowBulkActionForm] = useState(false);

  function toCapitalizeEachWord(str) {
    return str
      .split(" ")
      .map((word) => {
        if (!word) return "";
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  }
  /* Status Filter */
  const filters = [
    ["All", ""],
    ["Action Required", "actionable"],
    ["Action Taken", "actiontaken"],
    ["RTO", "rto"],
    ["Delivered", "delivered"],
  ];
  const [selectedFilter, setSelectedFilter] = useState("");
  /* Advance Filter */
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [advanceFilters, setAdvanceFilters] = useState({
    startDate: "",
    endDate: "",
    awb_number: "",
  });
  const [filterUpdate, setFilterUpdate] = useState(false);

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
      awb_number: "",
    });
  };

  useEffect(() => {
    resetAdvanceFilters();
  }, []);

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
    setFilterUpdate((prev) => !prev);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    resetAdvanceFilters();
    setPage(1);
    setFilterUpdate((prev) => !prev);
    setIsFilterOpen(false);
  };

  // Fetch data from API
  const fetchData = async () => {

    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/admin/ndrs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          page,
          limit,
          start_date: advanceFilters.startDate,
          end_date: advanceFilters.endDate,
          awb_number: advanceFilters.awb_number,
          statusType: selectedFilter,
        },
      });
      setData(res.data.data || []);
      setTotalPages(Math.ceil(Math.max(1, res.data.pagination?.total) / limit));
      setLimit(res.data.pagination?.limit);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to fetch NDR data:");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedFilter, filterUpdate, page]);

  useEffect(() => {
    setSelectedNdrIds([]);
    setBulkAction('');
    setBulkRemarks('');
    setShowBulkActionForm(false);
  }, [selectedFilter, page, filterUpdate]);

  const actionableRows = data.filter((d) => d.tpc_awb_number === null || d.tpc_awb_number === undefined);
  const isAllActionableSelected =
    selectedFilter === "actionable" &&
    actionableRows.length > 0 &&
    actionableRows.every((d) => selectedNdrIds.includes(d.ndr_id));

  const toggleSelectAllActionable = () => {
    if (isAllActionableSelected) {
      setSelectedNdrIds([]);
      return;
    }

    setSelectedNdrIds(actionableRows.map((d) => d.ndr_id));
  };

  const toggleSelectNdr = (ndrId) => {
    setSelectedNdrIds((prev) =>
      prev.includes(ndrId)
        ? prev.filter((id) => id !== ndrId)
        : [...prev, ndrId]
    );
  };

  /* Handle Change Status */
  const changeStatus = async (data, ndr_id) => {
    setLoading(true);
    try {
      
      const res = await axios.post(
        `${baseURL}/api/admin/handlendrs/${ndr_id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      await fetchData();
      setEditingStatusId(null);
      setTakeAction(null)
      toast.success(res?.data?.message)
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to take action on current NDR's status");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async () => {
    if (selectedNdrIds.length === 0) {
      toast.error("Please select at least one NDR");
      return;
    }

    if (!bulkAction) {
      toast.error("Please select RTO or Reattempt");
      return;
    }

    // console.log({ selectedNdrIds, bulkAction, bulkRemarks });

    //  action, ndr_ids, remarks
    setBulkLoading(true);
    try {


      const payload = {
        action: bulkAction,
        remarks: bulkReattemptRemarks || bulkRemarks,
        sub_remarks: bulkSubRemarks,
        ndr_ids: selectedNdrIds,
      };




      const results = await Promise.allSettled(
        selectedNdrIds.map((ndrId) =>
          axios.post(`${baseURL}/api/admin/handleBulkNDRAction`, payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        )
      );

      const failedCount = results.filter((result) => result.status === "rejected").length;
      const successCount = results.length - failedCount;

      if (successCount > 0) {
        toast.success(`${successCount} NDR action updated successfully`);
      }

      if (failedCount > 0) {
        toast.error(`${failedCount} NDR action failed`);
      }

      setSelectedNdrIds([]);
      setBulkAction('');
      setBulkRemarks('');
      setShowBulkActionForm(false);
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to update selected NDR actions");
    } finally {
      setBulkLoading(false);
    }
  };

  /* Fetch History */
  const handleHistoryClick = async (d) => {

    try {
      const res = await axios.get(
        `${baseURL}/api/admin/ndrhistory/${d.ndr_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setHistoryItem(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error while fetching history data of the order");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${baseURL}/api/admin/exportNDRs`, {
        params: {
          statusType: selectedFilter === "All" ? "" : selectedFilter,
          awb_number: advanceFilters.awb_number,
          start_date: advanceFilters.startDate,
          end_date: advanceFilters.endDate,
        },
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ndr.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to export orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <div className="bg-gray-100  dark:bg-gray-900 min-h-screen w-full">
        {/* Right Sidebar for filters */}


        {/* Heading */}
        <div className="w-full bg-[#0446DB] dark:bg-gray-900 shadow-md px-4 sm:px-6 md:px-8 py-4 md:py-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-semibold text-white text-left">
              NDR
            </h1>

            {/* Search Box */}
            <div className="w-full md:flex-1 md:max-w-xl">
              <form onSubmit={(e) => {
                e.preventDefault()
                fetchData()
              }} className="flex w-full">
                <input
                  name="awb_number"
                  value={advanceFilters.awb_number}
                  onChange={(e) =>
                    setAdvanceFilters((prev) => ({
                      ...prev,
                      awb_number: e.target.value,
                    }))
                  }


                  type="text"
                  placeholder="Search by AWB Number..."
                  className="w-full px-4 py-2.5 rounded-l-lg text-sm text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent"
                />

                <button
                  typr="submit"
                  className="bg-white px-4 sm:px-5 py-2.5 rounded-r-lg border border-l-0 border-gray-300 text-gray-600 hover:bg-indigo-100 hover:text-[#0446DB] transition"
                >
                  <FaSearch />
                </button>
              </form>
            </div>

            {/* Buttons */}
            <div className="flex  justify-center md:justify-end gap-3">
              <button
                onClick={exportCSV}
                className="bg-white text-[#0446DB] font-medium px-4  rounded-lg shadow hover:bg-indigo-100 transition w-full sm:w-auto"
              >
                Export
              </button>


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
                    <DrawerTitle>Filter</DrawerTitle>

                  </DrawerHeader>
                  <div className="p-4">
                    <form onSubmit={(e)=>{
                      e.preventDefault()
                      applyFilters()
                    }


                    } className="flex-col  w-full  items-end gap-4">
                      {/* Start Date */}
                      <div>
                        <label className="block text-xs dark:text-white text-gray-600 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={advanceFilters.startDate}
                          max={advanceFilters.endDate || undefined}
                          onChange={(e) => updateAdvanceFilter("startDate", e.target.value)}
                          onClick={openDatePicker}
                          onFocus={openDatePicker}
                          className="border w-full px-3 py-2 cursor-pointer bg-white text-gray-900 dark:bg-gray-900 dark:text-white rounded text-sm"
                        />
                      </div>

                      {/* End Date */}
                      <div className=" mt-3">
                        <label className="block text-xs dark:text-white text-gray-600 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={advanceFilters.endDate}
                          min={advanceFilters.startDate || undefined}
                          onChange={(e) => updateAdvanceFilter("endDate", e.target.value)}
                          onClick={openDatePicker}
                          onFocus={openDatePicker}
                          className="border px-3 py-2 w-full cursor-pointer bg-white text-gray-900 dark:bg-gray-900 dark:text-white rounded text-sm"
                        />
                      </div>

                      {/* NDR ID */}
                      <div className=" mt-3">
                        <label className="block text-xs dark:text-white text-gray-600 mb-1">
                          AWB Number
                        </label>
                        <input
                          type="text"
                          value={advanceFilters.awb_number}
                          onChange={(e) => updateAdvanceFilter("awb_number", e.target.value)}
                          placeholder="Integer Only"
                          className="border w-full px-3 py-2 dark:text-white rounded text-sm"
                        />
                      </div>

                      {/* Update Button */}
                      <div className=" mt-3 flex w-full">
                        <button
                          type="submit"
                          onClick={applyFilters}
                          className="bg-[#0446DB] w-1/2  text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
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
                    <Button onClick={() => setIsFilterOpen(false)} variant="outline">Cancel</Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>

          </div>
        </div>


        <div className="mx-1 z-10 bg-white dark:bg-gray-800 rounded-md">
          <div className="w-full  bg-white dark:border dark:border-[#0446DB] rounded shadow-2xl  dark:bg-gray-900   left-0 px-4 z-40   ">
            <div className="relative flex justify-center ">
              <div className=" flex  overflow-x-auto scrollbar-hide scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2">
                <div className="flex gap-2 min-w-max px-8 mt-0">
                  {/* {filters.map((filter) => (
                      <button
                        key={filter[0]}
                        onClick={() => {
                          setSelectedFilter(filter[1]);
                          setPage(1);
                        }}
                        className={`px-4 py-2 whitespace-nowrap rounded-md border transition font-medium mt-5 ${selectedFilter === filter[1]
                          ? "bg-[#0446DB] text-white"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                          }`}
                      >
                        {filter[0]}
                      </button>
                    ))} */}

                  {filters.map((filter) => (
                    <Button
                      key={filter[0]}
                      onClick={() => {
                        setSelectedFilter(filter[1]);
                        setPage(1);
                      }}
                      className={`px-5 py-2.5 rounded-full my-2 border transition-all duration-300 font-medium text-sm tracking-wide ${selectedFilter === filter[1]
                        ? "bg-[#0446DB] text-white shadow-lg shadow-purple-200 border-transparent"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]"
                        }`}
                    >
                      {filter[0]}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>







          {(selectedNdrIds.length > 0 && selectedFilter === "actionable") && (
            <div className="mx-2 mb-3 mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="text-sm font-medium whitespace-normal text-gray-700 dark:text-white">
                  {selectedNdrIds.length} selected
                </div>

                {!showBulkActionForm ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowBulkActionForm(true)}
                      disabled={selectedNdrIds.length === 0}
                      className={`rounded-md px-4 py-2 text-sm font-medium text-white transition sm:self-end ${selectedNdrIds.length === 0
                        ? "cursor-not-allowed bg-gray-400"
                        : "bg-[#0446DB] hover:bg-indigo-800"
                        }`}
                    >
                      Take Action
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedNdrIds([])}
                      disabled={selectedNdrIds.length === 0}
                      className={`rounded-md px-4 py-2 text-sm font-medium  transition sm:self-end ${selectedNdrIds.length === 0
                        ? "cursor-not-allowed bg-red-500"
                        : "bg-red-500/30 hover:bg-red-600 text-red-500 hover:text-white"
                        }`}
                    >
                      Clear
                    </button>
                  </div>

                ) : (
                  <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
                    <div>
                      <label className="text-xs font-medium dark:text-white">Select Action</label>
                      <select
                        value={bulkAction}
                        onChange={(e) => {
                          setBulkAction(e.target.value)
                          setBulkOtherRemarks(" ")
                          setBulkReattemptRemarks("")
                          setRTOBulkSubRemarksStatus("")
                          setBulkRemarks("")

                        }}
                        className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 mb-0 focus:ring-2 dark:text-white dark:bg-gray-800 focus:ring-indigo-400 focus:outline-none"
                      >
                        <option value="">Bulk Action</option>
                        <option value="reattempt">Reattempt</option>
                        <option value="rto">RTO</option>
                      </select>
                    </div>
                    {/* {
                      bulkAction == 'reattempt' && (
                        <div>
                          <label className="text-xs font-medium dark:text-white">Select Remarks</label>
                          <select
                            name="rot_remarks"
                            defaultValue=""
                            onChange={(e) => setBulkReattemptRemarks(e.target.value)}
                            className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 mb-0 focus:ring-2 dark:text-white dark:bg-gray-800 focus:ring-indigo-400 focus:outline-none"
                            required
                          >
                            <option disabled value="">
                              Reattempt
                            </option>

                            <option value="reattempt_approved">
                              Reattempt Approved
                            </option>

                            <option value="reattempt_assigned_to_rider">
                              Reattempt Assigned to Rider
                            </option>

                            <option value="reattempt_out_for_delivery">
                              Reattempt Out for Delivery
                            </option>

                            <option value="reattempt_rescheduled">
                              Reattempt Rescheduled
                            </option>

                            <option value="reattempt_failed">
                              Reattempt Failed
                            </option>
                          </select>
                        </div>
                      )
                    } */}
                    {
                      bulkAction == "rto" && (

                        <div>
                          <label className="text-xs font-medium dark:text-white">Select  Remarks</label>
                          <select
                            name="rot_remarks"
                            defaultValue=""
                            onChange={(e) => setBulkRemarks(e.target.value)}
                            className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 mb-0 focus:ring-2 dark:text-white dark:bg-gray-800 focus:ring-indigo-400 focus:outline-none"
                            required
                          >
                            <option disabled value="">
                              Remarks
                            </option>

                            <option value="Address Incorrect / Incomplete">
                              Address Incorrect / Incomplete
                            </option>
                            <option value="Customer Refused / Cancelled">
                              Customer Refused / Cancelled
                            </option>
                            <option value="Wrong Pincode / Address">
                              Wrong Pincode / Address
                            </option>
                            <option value="Wrong Contact Details">
                              Wrong Contact Details
                            </option>
                            <option value="Package Damaged">
                              Package Damaged
                            </option>
                            <option value="RTO by Seller">
                              RTO by Seller
                            </option>
                            <option value="Return to Hub">
                              Return to Hub
                            </option>
                            <option value="Return to Seller / FC">
                              Return to Seller / FC
                            </option>
                            <option value="Max. Attempts Reached">
                              Max. Attempts Reached
                            </option>

                          </select>
                        </div>
                      )
                    }

                    {
                      bulkRemarks === "Customer Refused / Cancelled" && (
                        <>

                          <div>
                            <label className="text-xs font-medium dark:text-white">Sub  Remarks</label>
                            <select
                              name="sub_remarks"
                              defaultValue=""
                              onChange={(e) => setRTOBulkSubRemarksStatus(e.target.value)}
                              className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 mb-0 focus:ring-2 dark:text-white dark:bg-gray-800 focus:ring-indigo-400 focus:outline-none"
                              required
                            >
                              <option disabled value="">
                                Select Sub Remarks
                              </option>

                              <option value="Duplicate Order">
                                Duplicate Order
                              </option>
                              <option value="Order Placed by Mistake">
                                Order Placed by Mistake
                              </option>
                              <option value="COD Amount Not Ready">
                                COD Amount Not Ready
                              </option>

                              <option value="Better Price Elsewhere">
                                Better Price Elsewhere
                              </option>
                              <option value="Other">
                                Other
                              </option>

                            </select>
                          </div>

                        </>
                      )
                    }



                    {/* {
                      bulkRemarks == "other" && (
                        <div>
                          <label className="text-xs font-medium dark:text-white">Other</label>
                          <input
                            type="text"
                            value={bulkOtherRemarks}
                            onChange={(e) => setBulkOtherRemarks(e.target.value)}
                            placeholder="Enter Other Remarks"
                            className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 mb-0 focus:ring-2 dark:text-white dark:bg-gray-800 focus:ring-indigo-400 focus:outline-none"
                          />

                        </div>
                      )
                    } */}

                    <div className=" flex-col mt-6">
                      <label className="text-xs font-medium dark:text-white mt-2"></label>
                      <div className=" flex gap-2">
                        <button
                          type="button"
                          onClick={handleBulkAction}
                          disabled={bulkLoading || selectedNdrIds.length === 0}
                          className={`rounded-md px-4 py-2 text-sm font-medium text-white transition sm:whitespace-nowrap ${bulkLoading || selectedNdrIds.length === 0
                            ? "cursor-not-allowed bg-gray-400"
                            : "bg-[#0446DB] hover:bg-indigo-800"
                            }`}
                        >
                          {bulkLoading ? "Updating..." : "Apply"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedNdrIds([])
                            setShowBulkActionForm(false);
                            setBulkAction('');
                            setBulkRemarks('');
                            setBulkOtherRemarks('')
                            setRTOBulkSubRemarksStatus("")
                          }}
                          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 dark:bg-gray-900 text-gray-600 font-semibold">
                <tr>
                  {selectedFilter === "actionable" && (
                    <th className="px-6 py-3 text-left whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isAllActionableSelected}
                        onChange={toggleSelectAllActionable}
                        disabled={actionableRows.length === 0}
                        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-[#0446DB] focus:ring-[#0446DB] disabled:cursor-not-allowed"
                        title="Select all visible NDRs"
                      />
                    </th>
                  )}
                  <th className="px-6 py-3 text-left whitespace-nowrap">NDR ID</th>
                  <th className="px-6 py-3 text-left">ORDER ID</th>
                  <th className="px-6 py-3 text-left">CUSTOMER INFO</th>
                  <th className="px-6 py-3 text-left">RIDER ID</th>
                  <th className="px-6 py-3 text-left">REMARKS</th>
                  <th className="px-6 py-3 text-left">ATTEMPT COUNT</th>
                  <th className="px-6 py-3 text-left">STATUS</th>
                  {selectedFilter === "actionable" && (
                    <th className="px-6 py-3 text-left">ACTION</th>
                  )}

                  <th className="px-6 py-3 text-left">HISTORY</th>
                </tr>
              </thead>
              <tbody>
                {
                  loading ? (
                    <>
                      <tr key={"No record found"}>
                        <td
                          colSpan="12"
                          className="text-center px-6 py-6 text-gray-500"
                        >
                          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                          <p className="mt-2">Loading NDR...</p>
                        </td>
                      </tr>
                    </>
                  ) : data.length > 0 ? (

                    data.map((d) => {

                      return (
                        <tr key={d.ndr_id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          {selectedFilter === "actionable" && (
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedNdrIds.includes(d.ndr_id)}
                                onChange={() => toggleSelectNdr(d.ndr_id)}
                                disabled={d.tpc_awb_number !== null && d.tpc_awb_number !== undefined}
                                className="h-4 w-4 cursor-pointer rounded border-gray-300 text-[#0446DB] focus:ring-[#0446DB] disabled:cursor-not-allowed"
                                title={
                                  d.tpc_awb_number !== null && d.tpc_awb_number !== undefined
                                    ? "Action already taken"
                                    : "Select NDR"
                                }
                              />
                            </td>
                          )}
                          {/* NDR ID */}
                          <td className="px-6 py-4 dark:text-white">{d.ndr_id}</td>

                          {/* Order ID */}
                          <td className="px-6 py-4">
                            <p className=" whitespace-normal">

                              <a
                                href={`${frontEndURL}/track-order?awb_number=${d.awb_number}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline whitespace-nowrap text-blue-700 hover:text-blue-500"
                              >
                                {d.awb_number}

                              </a>
                              <button
                                className="pl-2 text-lg text-gray-600 dark:text-white hover:text-[#0446DB] transition"
                                onClick={() => {
                                  navigator.clipboard.writeText(d.awb_number);
                                  setCopySuccess(d.awb_number);
                                  setTimeout(() => {
                                    setCopySuccess(null);
                                  }, 2000);
                                }}
                              >
                                {copySuccess === d.awb_number ? (
                                  <CiCircleCheck />
                                ) : (
                                  <FaRegCopy />
                                )}
                              </button>
                            </p>
                            <p className="text-l whitespace-nowrap dark:text-white text-gray-800 flex items-center">
                              {d.merchant_order_id}
                              <button
                                className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
                                onClick={() => {
                                  navigator.clipboard.writeText(d.merchant_order_id);
                                  setCopySuccess(d.merchant_order_id);
                                  setTimeout(() => {
                                    setCopySuccess(null);
                                  }, 2000);
                                }}
                              >
                                {copySuccess === d.merchant_order_id ? (
                                  <CiCircleCheck />
                                ) : (
                                  <FaRegCopy />
                                )}
                              </button>
                            </p>
                            <p className="text-s text-gray-500 dark:text-white">
                              {new Date(d.created_at).toLocaleString("en-IN", {
                                timeZone: "Asia/Kolkata",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </p>


                          </td>

                          {/* Customer Info */}
                          <td className="px-6 py-4 whitespace-pre-line">
                            <p className="font-medium whitespace-nowrap dark:text-white text-gray-800">
                              {d.delivery_contact_name}
                            </p>
                            <div className="relative inline-block group">
                              <span className="cursor-pointer whitespace-nowrap dark:text-white text-gray-800 font-medium">
                                {d.delivery_address_line.slice(0, 30)}....
                              </span>
                              <div
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3
                                          hidden group-hover:block">
                                <div className="bg-[#0446DB] dark:text-white text-white text-xs w-48 px-3 py-1 rounded shadow-lg ">
                                  {d.delivery_address_line}
                                </div>

                                {/* Arrow */}
                                <div className="w-2 h-2 bg-[#0446DB] rotate-45 mx-auto -mt-1"></div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-white">
                              {d.delivery_city}, {d.delivery_state} -{" "}
                              {d.delivery_pincode}
                            </p>
                            <p className="text-xs text-gray-400">
                              {d.delivery_country}
                            </p>
                          </td>

                          {/* Remark/Reason */}
                          <td className="px-6 py-4 dark:text-white">{d.vendor_id ? `FP${d.vendor_id}_${d.rider_id}` : `DKT_${d.rider_id}`}</td>

                          {/* Remark/Reason */}
                          <td className="px-6 py-4 dark:text-white">{d.reason || "NA"}</td>
                          <td className="px-6 py-4">
                            <span className="bg-green-100 text-green-800 text-md font-medium px-3 py-1 rounded-full hover:bg-yellow-200">{d.attempt_count || "NA"}</span>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 dark:text-white">
                            {toCapitalizeEachWord(d.status) || "NA"}
                          </td>

                          {/* Action */}
                          {selectedFilter === "actionable" && (
                            <td className="px-6 py-4">
                              {editingStatusId === d.ndr_id ? (
                                <form
                                  onSubmit={async (e) => {
                                    e.preventDefault();
                                    const newStatus =
                                      e.target.elements.status.value;
                                    const newRemarks =
                                      e.target.elements.remarks.value;
                                    changeStatus(d.ndr_id, newStatus, newRemarks);
                                  }}
                                  className="flex flex-col gap-2"
                                >
                                  <div className="my-2">
                                    <label className="mx-2">Remarks</label>
                                    <input
                                      type="text"
                                      name="remarks"
                                      className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <select
                                      name="status"
                                      defaultValue=""
                                      className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                      required
                                    >
                                      <option disabled value="">
                                        Change Status
                                      </option>
                                      <option value="reattempt">Reattempt</option>
                                      <option value="rto">RTO</option>
                                    </select>
                                    <button
                                      type="submit"
                                      className="bg-[#0446DB] text-white text-xs px-3 py-1 rounded hover:bg-indigo-800 transition"
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
                                <>

                                  <Dialog className=''>

                                    <DialogTrigger asChild>
                                      <Button
                                        onClick={() => {
                                          if (d.tpc_awb_number !== null) {
                                            return
                                          }
                                          // setEditingStatusId(d.ndr_id)
                                          setTakeAction(d.ndr_id)
                                        }}
                                        variant="outline"
                                        className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-semibold inline-block bg-blue-100 text-blue-600 cursor-pointer">
                                        Take Action
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="">
                                      <DialogHeader>
                                        <DialogTitle>Take Action</DialogTitle>

                                      </DialogHeader>
                                      <form
                                        onSubmit={async (e) => {
                                          e.preventDefault();
                                          const rot_remarks = e?.target?.elements?.rot_remarks?.value || "";
                                          const newStatus = e?.target?.elements?.status?.value || "";
                                          const newRemarks = rot_remarks ? rot_remarks : e?.target?.elements?.remarks?.value || "";
                                          const other_remarks = e?.target?.elements?.other_remarks?.value || "";
                                          const sub_remarks = e?.target?.elements?.sub_remarks?.value || "";
                                          const phone = e?.target?.elements?.phone?.value || "";
                                          const name = e?.target?.elements?.name?.value || "";
                                          const address1 = e?.target?.elements?.address1?.value || "";
                                          // const address2 = e?.target?.elements?.address2?.value || "";
                                          const data = {
                                            action: newStatus,
                                            remarks: newRemarks,
                                            sub_remarks: sub_remarks,
                                            detailed_remarks: other_remarks,
                                            customer_name: name,
                                            customer_details_address: address1,
                                            customer_phone: phone
                                          }



                                          changeStatus(data, d.ndr_id);
                                        }}

                                        className="flex flex-col gap-1"
                                      >
                                        {/* Status */}
                                        <div>
                                          <label className="text-xs font-medium dark:text-white">Select</label>
                                          <select
                                            name="status"
                                            defaultValue=""
                                            onChange={(e) => {
                                              setNewStatus(e.target.value)
                                              setRTORemarksStatus("")
                                            }}
                                            className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 mb-0 focus:ring-2 dark:text-white dark:bg-gray-800 focus:ring-indigo-400 focus:outline-none"
                                            required
                                          >
                                            <option disabled value="">
                                              Change Status
                                            </option>
                                            <option value="change_address">Change Address</option>
                                            <option value="change_phone">Change Phone Number</option>
                                            <option value="reattempt">Reattempt</option>
                                            <option value="rto">RTO</option>
                                          </select>
                                        </div>

                                        {
                                          newStatus == 'rto' && (
                                            <>
                                              <div>
                                                <label className="text-xs font-medium dark:text-white">Select  Remarks</label>
                                                <select
                                                  name="rot_remarks"
                                                  defaultValue=""
                                                  onChange={(e) => setRTORemarksStatus(e.target.value)}
                                                  className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 mb-0 focus:ring-2 dark:text-white dark:bg-gray-800 focus:ring-indigo-400 focus:outline-none"
                                                  required
                                                >
                                                  <option disabled value="">
                                                    Remarks
                                                  </option>

                                                  <option value="Address Incorrect / Incomplete">
                                                    Address Incorrect / Incomplete
                                                  </option>
                                                  <option value="Customer Refused / Cancelled">
                                                    Customer Refused / Cancelled
                                                  </option>
                                                  <option value="Wrong Pincode / Address">
                                                    Wrong Pincode / Address
                                                  </option>
                                                  <option value="Wrong Contact Details">
                                                    Wrong Contact Details
                                                  </option>
                                                  <option value="Package Damaged">
                                                    Package Damaged
                                                  </option>
                                                  <option value="RTO by Seller">
                                                    RTO by Seller
                                                  </option>
                                                  <option value="Return to Hub">
                                                    Return to Hub
                                                  </option>
                                                  <option value="Return to Seller / FC">
                                                    Return to Seller / FC
                                                  </option>
                                                  <option value="Max. Attempts Reached">
                                                    Max. Attempts Reached
                                                  </option>

                                                </select>
                                              </div>
                                            </>
                                          )
                                        }

                                        {
                                          newRTORemarkStatus === "Customer Refused / Cancelled" && (
                                            <>
                                              <div>
                                                <label className="text-xs font-medium dark:text-white">Sub  Remarks</label>
                                                <select
                                                  name="sub_remarks"
                                                  defaultValue=""
                                                  // onChange={(e) => setRTORemarksStatus(e.target.value)}
                                                  className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 mb-0 focus:ring-2 dark:text-white dark:bg-gray-800 focus:ring-indigo-400 focus:outline-none"
                                                  required
                                                >
                                                  <option disabled value="">
                                                    Select Sub Remarks
                                                  </option>

                                                  <option value="Duplicate Order">
                                                    Duplicate Order
                                                  </option>
                                                  <option value="Order Placed by Mistake">
                                                    Order Placed by Mistake
                                                  </option>
                                                  <option value="COD Amount Not Ready">
                                                    COD Amount Not Ready
                                                  </option>

                                                  <option value="Better Price Elsewhere">
                                                    Better Price Elsewhere
                                                  </option>
                                                  <option value="Other">
                                                    Other
                                                  </option>

                                                </select>
                                              </div>
                                            </>
                                          )
                                        }

                                        {/* change phone number */}
                                        {
                                          newStatus === 'change_phone' && (
                                            <div>
                                              <label className="text-xs font-medium dark:text-white">Phone Number</label>
                                              <input
                                                type="phone"
                                                name="phone"
                                                className="
                                                  mt-0 text-xs w-full
                                                  border border-gray-300
                                                  bg-white text-black
                                                  rounded-md px-2 py-2
                                                  focus:outline-none focus:ring-2 focus:ring-indigo-400
                                                  dark:bg-gray-900 dark:border-gray-700 dark:text-white
                                                  dark:focus:ring-indigo-500
                                                "

                                              />
                                            </div>
                                          )
                                        }
                                        {
                                          newStatus === 'change_address' && (
                                            <>
                                              <div>
                                                <label className="text-xs font-medium dark:text-white">Customer Name</label>
                                                <input
                                                  type="name"
                                                  name="name"
                                                  className="
  mt-0 text-xs w-full
  border border-gray-300
  bg-white text-black
  rounded-md px-2 py-2
  focus:outline-none focus:ring-2 focus:ring-indigo-400
  dark:bg-gray-900 dark:border-gray-700 dark:text-white
  dark:focus:ring-indigo-500
"
                                                />
                                              </div>
                                              <div>
                                                <label className="text-xs font-medium dark:text-white">Customer Address</label>
                                                <input
                                                  type="address1"
                                                  name="address1"
                                                  className="
  mt-0 text-xs w-full
  border border-gray-300
  bg-white text-black
  rounded-md px-2 py-2
  focus:outline-none focus:ring-2 focus:ring-indigo-400
  dark:bg-gray-900 dark:border-gray-700 dark:text-white
  dark:focus:ring-indigo-500
"
                                                />
                                              </div>
                                              {/* <div>
                            <label className="text-xs font-medium">Customer Address2</label>
                            <input
                              type="address2"
                              name="address2"
                              className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            />
                          </div> */}
                                            </>
                                          )
                                        }

                                        {/* {
                                          newStatus == 'reattempt' && (
                                            <>
                                              <div>
                                                <label className="text-xs font-medium dark:text-white">Select Remarks</label>
                                                <select
                                                  name="rot_remarks"
                                                  defaultValue=""
                                                  onChange={(e) => setRTORemarksStatus(e.target.value)}
                                                  className="mt-0 text-xs w-full border border-gray-300 rounded-md
                       px-2 py-2 mb-0 focus:ring-2 dark:text-white dark:bg-gray-800 focus:ring-indigo-400 focus:outline-none"
                                                  required
                                                >
                                                  <option disabled value="">
                                                    Reattempt
                                                  </option>

                                                  <option value="reattempt_approved">
                                                    Reattempt Approved
                                                  </option>

                                                  <option value="reattempt_assigned_to_rider">
                                                    Reattempt Assigned to Rider
                                                  </option>

                                                  <option value="reattempt_out_for_delivery">
                                                    Reattempt Out for Delivery
                                                  </option>

                                                  <option value="reattempt_rescheduled">
                                                    Reattempt Rescheduled
                                                  </option>

                                                  <option value="reattempt_failed">
                                                    Reattempt Failed
                                                  </option>
                                                </select>
                                              </div>
                                            </>
                                          )
                                        } */}
                                        {/* Remarks */}

                                        <div>
                                          <label className="text-xs font-medium dark:text-white">Other Remarks</label>
                                          <input
                                            type="text"
                                            name="other_remarks"
                                            className="
                                                    mt-0 text-xs w-full
                                                    border border-gray-300
                                                    bg-white text-black
                                                    rounded-md px-2 py-2
                                                    focus:outline-none focus:ring-2 focus:ring-indigo-400
                                                    dark:bg-gray-900 dark:border-gray-700 dark:text-white
                                                    dark:focus:ring-indigo-500
                                                  "
                                          />
                                        </div>




                                        {/* Submit */}
                                        <div className=" flex gap-1 justify-end">
                                          <button
                                            type="submit"
                                            className="w-full  bg-[#0446DB] text-white
                                            text-xs px-4 py-2 rounded
                                            hover:bg-indigo-800 transition cursor-pointer"
                                          >
                                            Update
                                          </button>

                                        </div>
                                      </form>


                                      <DialogFooter>

                                        <DialogClose asChild>

                                          <Button variant="outline"
                                            onClick={() => {
                                              setEditingStatusId(null)
                                              setNewStatus(null)
                                              setRTORemarksStatus(" ")
                                            }}
                                          >Cancel</Button>
                                        </DialogClose>

                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </>
                              )}
                            </td>
                          )}
                          <td>
                            <Dialog className='w-5xl'>

                              <DialogTrigger asChild>
                                <Button
                                  onClick={() => handleHistoryClick(d)}
                                  variant="outline" className="text-xs font-medium  text-red-600  inline-block cursor-pointer ">
                                  History
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle> NDR History</DialogTitle>

                                </DialogHeader>

                                <div className="px-6 py-4 overflow-y-auto max-h-[60vh] space-y-4">
                                  {historyItem && historyItem.length > 0 ? (
                                    historyItem.map((item, index) => {
                                      return (
                                        <>
                                          <div
                                            key={item.action_id}
                                            className="border rounded-lg p-4 bg-gray-50"
                                          >
                                            <div className="text-sm font-medium text-gray-800 mb-1">
                                              {item.action_taken === 'change_address' ? <span className=" font-semibold text-gray-900" >Change Address</span> : item.action_taken === 'change_phone' ? <span className=" font-semibold text-gray-900" >Change Phone Number</span> : item.action_taken === 'reattempt' ? < span className=" font-semibold text-gray-900" >Reattempt</span> : < span className=" font-semibold text-gray-900" >{item.action_taken}</span>

                                              }
                                            </div>
                                            <div className="text-sm text-gray-600 mb-1">
                                              {
                                                item.action_taken == 'change_phone' ? (
                                                  <>
                                                    <span className="font-semibold">Phone Number:</span>{" "}
                                                    {item.customer_phone}
                                                  </>
                                                ) : item.action_taken == 'change_address' ? (
                                                  <>
                                                    <>
                                                      <span className="font-semibold">Name:</span>{" "}
                                                      {item.customer_name} <br />
                                                      <span className="font-semibold">Address:</span>{" "}
                                                      {item.customer_details_address}
                                                    </>
                                                  </>
                                                ) : (
                                                  <>
                                                    <span className="font-semibold">Remarks:</span>{" "}
                                                    {item.remarks}
                                                  </>
                                                )
                                              }

                                            </div>
                                            {
                                              item?.sub_remarks && (

                                                <div className="text-sm text-gray-600 mb-1">
                                                  <span className="font-semibold">Sub Remarks : </span>{" "}

                                                  {item?.sub_remarks}
                                                </div>
                                              )
                                            }
                                            {
                                              item?.rescheduled_date && (

                                                <div className="text-sm text-gray-600 mb-1">
                                                  <span className="font-semibold">Rescheduled Date : </span>{" "}

                                                  {item?.rescheduled_date}
                                                </div>
                                              )
                                            }
                                            {
                                              item?.detailed_remarks && (

                                                <div className="text-sm text-gray-600 mb-1">
                                                  <span className="font-semibold">Other Remarks : </span>{" "}

                                                  {item?.detailed_remarks}
                                                </div>
                                              )
                                            }
                                            <div className="text-sm text-gray-600 mb-1">
                                              <span className="font-semibold">Date/Time:</span>{" "}

                                              {new Date(item.created_at).toLocaleString("en-IN", {
                                                timeZone: "Asia/Kolkata",
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                              })}
                                            </div>
                                          </div>
                                        </>
                                      )
                                    })
                                  ) : (
                                    <div className="text-gray-600 text-sm">
                                      No history found.
                                    </div>
                                  )}
                                </div>

                                <DialogFooter>

                                  <DialogClose asChild>

                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>

                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <>
                      <tr key={"No record found"}>
                        <td
                          colSpan="6"
                          className="text-center px-6 py-6 text-gray-500"
                        >
                          No records found.
                        </td>
                      </tr>
                    </>
                  )
                }

              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className=" py-3 flex justify-center items-center gap-4">
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
            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>
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
        </div>
      </div >

    </>
  );
}

export default NDR;
