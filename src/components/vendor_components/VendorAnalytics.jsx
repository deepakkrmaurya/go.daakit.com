import axios from "axios";
import { useEffect, useState } from "react";
import Piechart from "../Piechart";
import Loader from "../Loader";
import { TbReportAnalytics } from "react-icons/tb";


import { toast } from "react-toastify";
import {
  FaBoxOpen,        // For Total Orders
  FaClock,          // For COD Pending
  FaCheckCircle,    // For COD Adjusted
  FaPlayCircle,     // For COD Initiated
  FaPaperPlane      // For COD Submitted
} from 'react-icons/fa';

import {
  MdPeople,          // For Total Riders (replacing bike)
  MdVerified,        // For KYC Verified
  MdDirectionsBike,  // For Active Riders
  MdEventAvailable   // For Available Riders
} from 'react-icons/md';
import axiosInstance from "../../Helper/axiosInstance";
import { Loader2 } from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;

export default function VendorAnalytics() {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({});
  const [analytics2, setAnalytics2] = useState({});
  const [selected, setSelected] = useState("Last 30 Days");

  const today = new Date();
  const thirtyDaysBack = new Date();
  thirtyDaysBack.setDate(thirtyDaysBack.getDate() - 29);

  const [advanceFilters, setAdvanceFilters] = useState({
    end_date: today.toISOString().split("T")[0],
    start_date: thirtyDaysBack.toISOString().split("T")[0],
  });

  const [customStartDate, setCustomStartDate] = useState(advanceFilters.start_date);
  const [customEndDate, setCustomEndDate] = useState(advanceFilters.end_date);


  const getAnalytics = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `${baseURL}/api/vendor/getVendorDeliveredAndPendingCodSummary`,
        {
          params: advanceFilters,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCustomStartDate(advanceFilters.start_date);
      setCustomEndDate(advanceFilters.end_date);
      setAnalytics(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error while fetching order analytics");
    } finally {
      setLoading(false);
    }

    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `${baseURL}/api/vendor/getVendorRidersSummary`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAnalytics2(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error while fetching rider analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (value) => {
    setSelected(value);

    let fromDate, toDate;

    switch (value) {
      case "Today": {
        fromDate = new Date();
        toDate = new Date();
        break;
      }

      case "Yesterday": {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        fromDate = yesterday;
        toDate = yesterday;
        break;
      }

      case "Last 7 Days": {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 6);
        fromDate = start;
        toDate = end;
        break;
      }

      case "Last 30 Days": {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 29);
        fromDate = start;
        toDate = end;
        break;
      }

      case "This Month": {
        fromDate = new Date();
        fromDate.setDate(1);
        toDate = new Date();
        break;
      }

      case "Last Month": {
        fromDate = new Date();
        fromDate.setDate(1);
        fromDate.setMonth(fromDate.getMonth() - 1);
        toDate = new Date();
        toDate.setDate(1);
        toDate.setDate(toDate.getDate() - 1);
        break;
      }

      default:
        return;
    }

    setAdvanceFilters({
      start_date: fromDate.toISOString().split("T")[0],
      end_date: toDate.toISOString().split("T")[0],
    });
  };

  useEffect(() => {
    getAnalytics();
  }, [advanceFilters]);

  return (
    <>
      {loading ? (
        <>
          <div className=" w-full h-[90vh] flex justify-center items-center">
            <div>
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2">Loading Analytics Dashboard...</p>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen w-full">
          {/* Top Heading Stripe */}
          <div className="relative z-0 mb-6 bg-[#0446DB] dark:bg-gray-900 py-[24px] shadow-md  px-[24px]">
            <div className="flex flex-wrap items-center justify-between">
              {/* Heading */}
              <h1 className="text-3xl text-white">Dashboard</h1>

              {/* Filters */}
              <div className="flex flex-wrap items-end gap-4 text-white">
                <div>
                  <label className="block text-xs text-gray-200 mb-1">
                    Filter by Date
                  </label>
                  <select
                    value={selected}
                    onChange={(e) => handleSelect(e.target.value)}
                    className="w-full border rounded px-2 py-1 bg-white text-black"
                  >
                    <option>Today</option>
                    <option>Yesterday</option>
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>This Month</option>
                    <option>Last Month</option>
                    <option>Custom Range</option>
                  </select>
                </div>
                {selected === "Custom Range" && (
                  <>
                    <form className="flex flex-wrap items-end gap-4" onSubmit={(e) => {
                      e.preventDefault();
                      setAdvanceFilters({ start_date: customStartDate, end_date: customEndDate });
                    }}>
                      {/* Start Date */}
                      <div>
                        <label className="block text-xs text-gray-200 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => {
                            const newStart = e.target.value;
                            setCustomStartDate((prev) => {
                              if (customEndDate < newStart) {
                                setCustomEndDate(newStart);
                                return newStart;
                              } else {
                                return newStart;
                              }
                            });
                          }}
                          className="border px-3 py-1 rounded-md text-sm text-black bg-white"
                        />
                      </div>

                      {/* End Date */}
                      <div>
                        <label className="block text-xs text-gray-200 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => {
                            const newEnd = e.target.value;
                            setCustomEndDate((prev) => {
                              if (customStartDate > newEnd) {
                                setCustomStartDate(newEnd);
                                return newEnd;
                              }
                              else {
                                return newEnd;
                              }
                            })

                          }}
                          className="border px-3 py-1 rounded-md text-sm text-black bg-white"
                        />
                      </div>
                      <button className="bg-white text-[#0446DB] font-medium px-5 py-1 rounded-lg shadow hover:bg-indigo-100 transition" type="submit">Submit</button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Cards Section */}
          <div className="max-w-full px-4 -mt-10 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 dark:border-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-base font-semibold dark:text-white text-gray-600 mb-1">
                      Total Orders Delivered
                    </h2>
                    <p className="text-xl  text-gray-900 dark:text-white">
                      {analytics.totalDeliveredOrders}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <FaBoxOpen className="text-2xl text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 dark:border-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-base font-semibold dark:text-white text-gray-600 mb-1">
                      Total Riders
                    </h2>
                    <p className="text-xl dark:text-white text-gray-900">
                      {analytics2.totalRiders}
                    </p>
                  </div>
                  <div className="bg-cyan-100 p-3 rounded-lg">
                    <MdPeople className="text-2xl text-cyan-600" />
                  </div>
                </div>

              </div>

              {/* KYC Verified Riders Card */}
              <div className="bg-white dark:bg-gray-800 dark:border-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-base dark:text-white font-semibold text-gray-600 mb-1">
                      KYC Verified Riders
                    </h2>
                    <p className="text-xl dark:text-white text-gray-900">
                      {analytics2.kycverifiedRiders}
                    </p>
                  </div>
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <MdVerified className="text-2xl text-emerald-600" />
                  </div>
                </div>

              </div>

              {/* Active Riders Card */}
              <div className="bg-white dark:bg-gray-800 dark:border-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-base dark:text-white font-semibold text-gray-600 mb-1">
                      Active Riders
                    </h2>
                    <p className="text-xl dark:text-white text-gray-900">
                      {analytics2.activeRiders}
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <MdDirectionsBike className="text-2xl text-orange-600" />
                  </div>
                </div>

              </div>
              {/* COD Submitted Card */}
              <div className="bg-white dark:bg-gray-800 dark:border-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-base font-semibold dark:text-white text-gray-600 mb-1">
                      COD Submitted
                    </h2>

                    <p className="text-lg font-semibold  text-indigo-600 mt-1">
                      {analytics?.codSummary?.received}
                    </p>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <FaPaperPlane className="text-2xl text-indigo-600" />
                  </div>
                </div>

              </div>




              {/* COD Pending Card */}
              <div className="bg-white dark:bg-gray-800 dark:border-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-base dark:text-white font-semibold text-gray-600 mb-1">
                      COD Pending
                    </h2>

                    <p className="text-lg font-semibold text-rose-600 mt-1">
                      {analytics?.codSummary?.pending}
                    </p>
                  </div>
                  <div className="bg-rose-100 p-3 rounded-lg">
                    <FaClock className="text-2xl text-rose-600" />
                  </div>
                </div>

              </div>
              {/* COD Initiated Card */}
              <div className="bg-white dark:bg-gray-800 dark:border-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-base dark:text-white font-semibold text-gray-600 mb-1">
                      COD Initiated
                    </h2>

                    <p className="text-lg font-semibold text-purple-600 mt-1">
                      {analytics?.codSummary?.initiated}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FaPlayCircle className="text-2xl text-purple-600" />
                  </div>
                </div>

              </div>
              {/* COD Adjusted Card */}
              <div className="bg-white dark:bg-gray-800 dark:border-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-base dark:text-white font-semibold text-gray-600 mb-1">
                      COD Adjusted
                    </h2>

                    <p className="text-lg font-semibold text-blue-600 mt-1">
                      {analytics?.codSummary?.adjusted}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaCheckCircle className="text-2xl text-blue-600" />
                  </div>
                </div>

              </div>

              {/* Available Riders Card */}
              <div className="bg-white dark:bg-gray-800 dark:border-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-base dark:text-white font-semibold text-gray-600 mb-1">
                      Available Riders
                    </h2>
                    <p className="text-xl dark:text-white text-gray-900">
                      {analytics2.availableRiders}
                    </p>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <MdEventAvailable className="text-2xl text-amber-600" />
                  </div>
                </div>

              </div>


            </div>
          </div>


        </div>
      )}
    </>
  );
}
