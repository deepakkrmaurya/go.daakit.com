import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Loader";

import { FaFileDownload, FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";
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
  DrawerContent,

  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react";
const baseURL = import.meta.env.VITE_BASE_URL;

function RemittanceStatusVendor() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [advanceFilters, setAdvanceFilters] = useState({
    startDate: "",
    endDate: "",
    vendor_id: "",
  });
  const [filterUpdate, setFilterUpdate] = useState(false);

  //Set Default Date Range of one month from today
  const resetAdvanceFilters = async () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    setAdvanceFilters({
      endDate: today.toISOString().split("T")[0],
      startDate: oneMonthAgo.toISOString().split("T")[0],
      vendor_id: "",
    });
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
    setFilterUpdate(true);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    resetAdvanceFilters();
    setPage(1);
    setFilterUpdate(true);
    setIsFilterOpen(false);
  };

  const indianFormat = (num) => {
    const temp = num.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
    return temp;
  };

  useEffect(() => {
    resetAdvanceFilters();
  }, []);

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/admin/fetchVendorSubmittedRecords`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            page,
            limit,
            start_date: advanceFilters.startDate,
            end_date: advanceFilters.endDate,
            vendor_id: advanceFilters.vendor_id,
          },
        }
      );
      setData(res.data.data || []);
      setTotalPages(Math.max(1, res.data.totalPages));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to fetch data:");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    if (filterUpdate) {
      fetchData();
      setFilterUpdate(false);
    }
  }, [filterUpdate]);



  return (
    <>

      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen w-full">
        {/* Right Sidebar for filters */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isFilterOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold dark:text-white">Advance Filters</h2>
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
              <div className=" w-full">
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
                  className="border flex w-full px-3 py-1 cursor-pointer bg-white text-gray-900 dark:bg-gray-900 dark:text-white rounded-md text-sm"
                />
              </div>

              {/* End Date */}
              <div className=" w-full">
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
                  className="border flex w-full px-3 py-1 cursor-pointer bg-white text-gray-900 dark:bg-gray-900 dark:text-white rounded-md text-sm"
                />
              </div>

              {/* Order ID */}
              <div>
                <label className="block dark:text-white text-xs text-gray-600 mb-1">
                  Vendor ID
                </label>
                <input
                  type="number"
                  value={advanceFilters.vendor_id}
                  onChange={(e) => updateAdvanceFilter("vendor_id", e.target.value)}
                  placeholder="Only Integer Value"
                  className="border dark:text-white px-3 py-1 rounded-md text-sm"
                />
              </div>

              {/* Update Button */}
              <div>
                <button
                  type="button"
                  onClick={applyFilters}
                  className="bg-[#0446DB] text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
                >
                  Filter
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="bg-[#0446DB] text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-0 bg-[#0446DB] dark:bg-gray-900 py-[24px]  px-[24px]">
          <div className="flex flex-wrap items-center justify-between">
            {/* Heading */}
            <h1 className="text-2xl text-white">Vendor Remittance Record</h1>
            <div className="flex flex-wrap items-end gap-4 text-white">
              <Drawer direction="right"
             open={isFilterOpen}
  onOpenChange={setIsFilterOpen}
              >
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
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      applyFilters()
                      setIsFilterOpen(false)

                    }}
                      className="flex-col  w-full  items-end gap-4"
                    >
                      <div className="flex flex-wrap items-end gap-4">
                        {/* Start Date */}
                        <div className=" w-full">
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
                            className="border flex w-full px-3 py-1 cursor-pointer bg-white text-gray-900 dark:bg-gray-900 dark:text-white rounded-md text-sm"
                          />
                        </div>

                        {/* End Date */}
                        <div className=" w-full">
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
                            className="border flex w-full px-3 py-1 cursor-pointer bg-white text-gray-900 dark:bg-gray-900 dark:text-white rounded-md text-sm"
                          />
                        </div>

                        {/* Order ID */}
                        <div className=" w-full">
                          <label className="block dark:text-white text-xs text-gray-600 mb-1">
                            Vendor ID
                          </label>
                          <input
                            type="number"
                            value={advanceFilters.vendor_id}
                            onChange={(e) => updateAdvanceFilter("vendor_id", e.target.value)}
                            placeholder="Only Integer Value"
                            className="border w-full dark:text-white px-3 py-2 rounded-md text-sm"
                          />
                        </div>

                        {/* Update Button */}
                        <div>
                          <button
                            type="submit"
                            onClick={applyFilters}
                            className="bg-[#0446DB] text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
                          >
                            Filter
                          </button>
                          <button
                            type="button"
                            onClick={resetFilters}
                            className="bg-[#0446DB] text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
                          >
                            Reset
                          </button>
                        </div>
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

        <div className="mx-1 z-10 bg-white dark:bg-gray-900 rounded-md">
          {/* Table */}
          <div className="max-w-full p-4  relative z-10 overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow">
            <Table>
              <TableHeader >
                <TableRow>
                  <TableHead className="px-6 py-3 text-left">VENDOR ID</TableHead>
                  <TableHead className="px-6 py-3 text-left">AWB NUMBER</TableHead>
                  <TableHead className="px-6 py-3 text-left">AMOUNT</TableHead>
                  <TableHead className="px-6 py-3 text-left">UPLOAD DATE</TableHead>
                  <TableHead className="px-6 py-3 text-left">UTR NUMBER</TableHead>
                  <TableHead className="px-6 py-3 text-left">CSV FILE</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  loading ? (
                    <>
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-10">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                          <p className="mt-2">Loading orders...</p>
                        </TableCell>
                      </TableRow>
                    </>
                  ) : data.length == 0 ? (
                    <>
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-10">
                          No found
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    data.map((d, index) => {
                      return (
                        <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell className="px-6 py-4 dark:text-white">FP_{d.vendor_id}</TableCell>
                          <TableCell className="px-6 py-4 dark:text-white">{d.awb_number}</TableCell>
                          <TableCell className="px-6 py-4 dark:text-white">{indianFormat(Number(d.amount))}</TableCell>
                          <TableCell className="px-6 py-4 dark:text-white">
                            {new Date(d.created_at).toLocaleString("en-IN", {
                              timeZone: "Asia/Kolkata",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </TableCell>
                          <TableCell className="px-6 py-4 dark:text-white">{d.utr_number}</TableCell>
                          <TableCell className="px-6 py-4">
                            <a
                              href={`${baseURL}/${d.file_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline"
                            >
                              <FaFileDownload className="inline text-xl" />
                            </a>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )
                }

              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center items-center gap-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-md text-sm font-medium ${page === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#0446DB] text-white hover:bg-indigo-800"
                }`}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
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
            </button>
          </div>
        </div>
      </div>

    </>
  );
}

export default RemittanceStatusVendor;
