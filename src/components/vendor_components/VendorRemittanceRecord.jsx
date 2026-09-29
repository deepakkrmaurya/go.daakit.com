import { useState, useEffect, useRef } from "react";
import axios from "axios";


import { FaFilter, FaRegCopy } from "react-icons/fa";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
const baseURL = import.meta.env.VITE_BASE_URL;
const frontEndURL = import.meta.env.VITE_FRONTEND_URL;

function VendorRemittanceRecord() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [copySuccess, setCopySuccess] = useState(null);
  const [pendingAmount, setPendingAmount] = useState("");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [adjustedAmount, setAdjustedAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState("");
  const [selectedBulkOrders, setSelectedBulkOrders] = useState([]);
  const [selectedBulkAmount, setSelectedBulkAmount] = useState([]);

  const filters = ["All", "Pending", "Adjusted", "Received"];
  const [selectedFilter, setSelectedFilter] = useState("All");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [advanceFilters, setAdvanceFilters] = useState({
    startDate: "",
    endDate: "",
    awb_number: "",
  });
  const [filterUpdate, setFilterUpdate] = useState(false);

  //Set Default Date Range of one month from today
  const resetAdvanceFilters = async () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    setAdvanceFilters((prev) => ({
      endDate: today.toISOString().split("T")[0],
      startDate: oneMonthAgo.toISOString().split("T")[0],
      rider_id: "",
      order_id: "",
      awb_number: "",
    }));
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
  const startDateRef = useRef(null);
  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/vendor/getMyVendorSubmittedRecords`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            page,
            limit,
            start_date: advanceFilters.startDate,
            end_date: advanceFilters.endDate,
            awb_number: advanceFilters.awb_number,
          },
        },
      );
      setData(res.data.data || []);
      setTotalPages(Math.max(1, res.data.total_pages));
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to fetch data:",
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedBulkOrders.length === data.length) {
      setSelectedBulkOrders([]);
      setSelectedBulkAmount(0);
    } else {
      setSelectedBulkOrders(data);
      let total = 0;
      data.forEach((d) => {
        total += Number(d.amount);
      });
      setSelectedBulkAmount(total);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedFilter, page]);

  useEffect(() => {
    if (filterUpdate) {
      fetchData();
      setFilterUpdate(false);
    }
  }, [filterUpdate]);

  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen w-full">
        {/* Heading */}
        <div className="mb-6 bg-[#0446DB] dark:bg-gray-900 py-[24px] shadow-sm h-auto px-[24px]">
          <div className="flex flex-wrap items-center justify-between">
            <h1 className="text-2xl text-white">Remittance Record</h1>
            <div className="flex flex-wrap items-end gap-4 text-white">
              <Drawer
                direction="right"
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
              >
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white text-[#0446DB] font-medium px-5 py-2 rounded-lg shadow hover:bg-indigo-100 transition"
                  >
                    <FaFilter className="text-sm" />
                    <span>Filter</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Filter</DrawerTitle>
                    {/* <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}
                  </DrawerHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setFilterUpdate((prev) => !prev);
                      setIsFilterOpen(false);
                    }}
                  >
                    <div className="flex flex-wrap items-end gap-4 p-3">
                      {/* Start Date */}
                      <div className=" w-full">
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
                          onFocus={(e) => {
                            e.currentTarget.showPicker?.();
                          }}
                          className="border  w-full px-3 py-2 rounded text-sm"
                        />
                      </div>
                      {/* End Date */}
                      <div className=" w-full">
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
                          onFocus={(e) => {
                            e.currentTarget.showPicker?.();
                          }}
                          className="border w-full px-3 py-2 rounded rounded-md text-sm"
                        />
                      </div>
                      <div className=" w-full">
                        <label className="block text-xs text-gray-600 mb-1">
                          AWB Number
                        </label>
                        <input
                          type="text"
                          value={advanceFilters.awb_number}
                          onChange={(e) =>
                            setAdvanceFilters((prev) => ({
                              ...prev,
                              awb_number: e.target.value,
                            }))
                          }
                          placeholder="Enter AWB Number"
                          className="border w-full px-3 py-2 rounded rounded-md text-sm"
                        />
                      </div>
                      {/* Update Button */}
                      <div className=" w-full flex">
                        <Button
                          onClick={() => {
                            setFilterUpdate(true);
                            setIsFilterOpen(false);
                          }}
                          className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-1"
                        >
                          Filter
                        </Button>
                        <Button
                          onClick={() => {
                            resetAdvanceFilters();
                            setFilterUpdate(true);
                            setIsFilterOpen(false);
                          }}
                          className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-1"
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </form>
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

        <div className=" bg-white dark:bg-gray-900">
          {/* Table */}
          <div className="max-w-full dark:bg-gray-900 p-4 -mt-6 relative z-10 overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 dark:bg-gray-900 text-gray-600 font-semibold">
                <tr>
                  <th className="px-6 py-3 text-left">AWB NUMBER</th>
                  <th className="px-6 py-3 text-left">AMOUNT</th>
                  <th className="px-6 py-3 text-left">UTR NUMBER</th>
                  <th className="px-6 py-3 whitespace-nowrap text-left">
                    UPLOAD DATE
                  </th>
                  <th className="px-6 py-3 text-left">DOWNLOAD</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    <tr key={"No record found"}>
                      <td
                        colSpan="6"
                        className="text-center px-6 py-6 text-gray-500"
                      >
                        <div className=" w-full  flex justify-center items-center">
                          <div>
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                            <p className="mt-2">Loading Remittance Record...</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </>
                ) : data.length == 0 ? (
                  <tr key={"No record found"}>
                    <td
                      colSpan="6"
                      className="text-center px-6 py-6 text-gray-500"
                    >
                      No records found.
                    </td>
                  </tr>
                ) : (
                  data.map((d, index) => {
                    return (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 dark:border dark:border-white"
                      >
                        <td className="px-6 py-4 dark:text-white">
                          {d.awb_number}
                        </td>
                        <td className="px-6 py-4 dark:text-white">
                          {indianFormat(Number(d.amount))}
                        </td>
                        <td className="px-6 py-4 dark:text-white">
                          {d.utr_number}
                        </td>
                        <td className="px-6 py-4 dark:text-white">
                          {new Date(d.created_at).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={`${baseURL}/${d.file_url}`}
                            className="text-red-500 cursor-pointer border px-2 py-1 hover:bg-red-500 hover:text-white rounded"
                            target="_blank"
                          >
                            Download
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="py-3 flex justify-center items-center gap-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                page === 1
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
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                page === totalPages
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

export default VendorRemittanceRecord;
