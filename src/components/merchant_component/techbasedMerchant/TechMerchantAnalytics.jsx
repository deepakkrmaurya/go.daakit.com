import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Piechart from "../../Piechart";
import Loader from "../../Loader";
import { TbReportAnalytics } from "react-icons/tb";
import { FaPlaneArrival } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { MdOutlineShoppingCart } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { GiReturnArrow } from "react-icons/gi";
import { TbTruckReturn } from "react-icons/tb";
import { FaRupeeSign } from "react-icons/fa";
import { toast } from "react-toastify";
import StackBarChart from "../../StackBarChart";
import axiosInstance from "../../../Helper/axiosInstance";
import ChristmasHeader from "../../ddd/FestiveWisher";
const baseURL = import.meta.env.VITE_BASE_URL;
export default function TechMerchantAnalytics() {
    const [loading, setLoading] = useState(false);
    const [analytics, setAnalytics] = useState({});
    const [orders, setorders] = useState([])
    const [totalOrders, setTotalOrders] = useState(0);
    const [selected, setSelected] = useState("Last 30 Days");
    const [cities, setCities] = useState([]);
    const [cityWiseOrders, setCityWiseOrders] = useState([]);
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    // const analytics = useSelector((state) => state.techbased.analytics)
    const [advanceFilters, setAdvanceFilters] = useState({
        end_date: today.toISOString().split("T")[0],
        start_date: oneMonthAgo.toISOString().split("T")[0],
    });
    const [customStartDate, setCustomStartDate] = useState(advanceFilters.start_date);
    const [customEndDate, setCustomEndDate] = useState(advanceFilters.end_date);

    const openDatePicker = (event) => {
        try {
            event.currentTarget.showPicker?.();
        } catch {
            return;
        }
    };

    const getAnalytics = async () => {
        try {
            setLoading(true);
            // const res = await dispatch(TechBasedMerchantGetAnalytics(advanceFilters))
            const token = localStorage.getItem("token");

            const res = await axiosInstance.get(
                "/api/techbasedmerchant/getMerchantOrderStatusSummary",
                {
                    params: advanceFilters,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const order_specific_counts = res.data?.order_specific_counts
            const cityWise = [{ data: [], stack: 'A', label: "NDD" }, { data: [], stack: 'A', label: "SDD" }, { data: [], stack: 'A', label: "Turant" }, { data: [], stack: 'B', label: "COD" }, { data: [], stack: 'B', label: "Prepaid" }];
            const tempCities = [];
            cityWise[0].data.push(Number(order_specific_counts?.ndd_count));
            cityWise[1].data.push(Number(order_specific_counts?.sdd_count));
            cityWise[2].data.push(Number(order_specific_counts?.turant_count));
            // cityWise[3].data.push(Number(order_specific_counts?.cod_orders));
            // cityWise[4].data.push(Number(order_specific_counts?.prepaid_count));
            const city = ""
            tempCities.push(city);
            setCityWiseOrders(res.data?.city_distribution);
            setCities(tempCities);
            setorders(res.data?.pending_pickup_orders)
            setAnalytics(res.data);
            let temp = 0;
            res.data?.status_counts?.forEach(element => {
                temp += element.count;
            });
            setTotalOrders(temp);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Error while fetching analytics");
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (value) => {
        setSelected(value);

        if (value === "Custom Range") {
            setCustomStartDate(advanceFilters.start_date);
            setCustomEndDate(advanceFilters.end_date);
            return;
        }

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
                fromDate.setMonth(fromDate.getMonth() - 1);
                fromDate.setDate(1);
                toDate = new Date();
                toDate.setDate(1);
                toDate.setDate(toDate.getDate() - 1);
                break;
            }

            default:
                return;
        }

        const nextFilters = {
            start_date: fromDate.toISOString().split("T")[0],
            end_date: toDate.toISOString().split("T")[0],
        };

        setCustomStartDate(nextFilters.start_date);
        setCustomEndDate(nextFilters.end_date);
        setAdvanceFilters(nextFilters);
    };

    const handleCustomFilterApply = (event) => {
        event.preventDefault();

        if (!customStartDate || !customEndDate) {
            toast.error("Please select both start and end dates");
            return;
        }

        if (customStartDate > customEndDate) {
            toast.error("Start date cannot be after end date");
            return;
        }

        setAdvanceFilters({
            start_date: customStartDate,
            end_date: customEndDate,
        });
    };

    useEffect(() => {
        getAnalytics();
    }, [advanceFilters]);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className="bg-[#EEEEEE] min-h-screen w-full ">
                    {/* Header Section */}
                    <div className="mb-8 px">

                        <div className="bg-[#0446DB]">
                            {/* <ChristmasHeader/> */}
                            <div className="flex flex-col p-3 lg:flex-row lg:items-center lg:justify-between gap-6">
                                {/* Heading */}
                                <div>
                                    <h1 className="text-2xl lg:text-3xl font-bold text-white  mb-2">Analytics Dashboard</h1>
                                    <p className="text-gray-200 text-sm lg:text-base">Real-time insights and performance metrics</p>
                                </div>

                                {/* Filters */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Date Filter */}
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="block text-xs font-medium text-white mb-2">
                                            Filter by Date
                                        </label>
                                        <select
                                            value={selected}
                                            onChange={(e) => handleSelect(e.target.value)}
                                            className="w-full border rounded px-4 py-2 bg-white text-gray-900 transition-all duration-200"
                                        >
                                            <option className="text-gray-900">Today</option>
                                            <option className="text-gray-900">Yesterday</option>
                                            <option className="text-gray-900">Last 7 Days</option>
                                            <option className="text-gray-900">Last 30 Days</option>
                                            <option className="text-gray-900">This Month</option>
                                            <option className="text-gray-900">Last Month</option>
                                            <option className="text-gray-900">Custom Range</option>
                                        </select>
                                    </div>

                                    {/* Custom Date Range */}
                                    {selected === "Custom Range" && (
                                        <form onSubmit={handleCustomFilterApply} className="flex flex-col sm:flex-row sm:items-end gap-4">
                                            <div className="flex-1 min-w-[150px]">
                                                <label className="block text-xs font-medium text-white mb-2">
                                                    Start Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={customStartDate}
                                                    max={customEndDate}
                                                    onClick={openDatePicker}
                                                    onChange={(e) => {
                                                        const newStart = e.target.value;
                                                        setCustomStartDate(newStart);

                                                        if (customEndDate < newStart) {
                                                            setCustomEndDate(newStart);
                                                        }
                                                    }}
                                                    className="w-full border rounded px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-[150px]">
                                                <label className="block text-xs font-medium text-white mb-2">
                                                    End Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={customEndDate}
                                                    min={customStartDate}
                                                    onClick={openDatePicker}
                                                    onChange={(e) => {
                                                        const newEnd = e.target.value;
                                                        setCustomEndDate(newEnd);

                                                        if (customStartDate > newEnd) {
                                                            setCustomStartDate(newEnd);
                                                        }
                                                    }}
                                                    className="w-full border rounded px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="px-5 py-2 rounded bg-white text-[#0446DB] font-semibold border border-white hover:bg-gray-100 transition-all duration-200"
                                            >
                                                Apply
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
                        {/* Total Orders */}
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-[#0446DB]/20 group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-700 mb-1">Total  Revenue</h2>
                                    <p className="text-2xl lg:text-3xl font-semibold text-gray-900 flex items-center"><FaRupeeSign className=" text-xl " /><span>{analytics?.order_revenue > 0 ? analytics?.order_revenue : 0}</span></p>
                                </div>
                                <div className="p-3 bg-[#0446DB]/10 rounded-xl group-hover:bg-[#0446DB]/20 transition-colors duration-300">
                                    <TbReportAnalytics className="text-2xl text-[#0446DB]" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Total order revenue</span>
                                    <span>100%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#0446DB] rounded-full w-full"></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-[#0446DB]/20 group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-700 mb-1">Total Orders</h2>
                                    <p className="text-2xl lg:text-3xl font-semibold text-gray-900">{totalOrders}</p>
                                </div>
                                <div className="p-3 bg-[#0446DB]/10 rounded-xl group-hover:bg-[#0446DB]/20 transition-colors duration-300">
                                    <TbReportAnalytics className="text-2xl text-[#0446DB]" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>All orders</span>
                                    <span>100%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#0446DB] rounded-full w-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Orders Delivered */}
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-green-100 group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-700 mb-1">Delivered</h2>
                                    <p className="text-2xl lg:text-3xl font-semibold text-gray-900">
                                        {analytics?.status_counts?.find((f) => f.status === "delivered")?.count || 0}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors duration-300">
                                    <FaPlaneArrival className="text-2xl text-green-600" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Success rate</span>
                                    <span>{totalOrders > 0 ? Math.round((Number(analytics?.status_counts?.find((f) => f.status === "delivered")?.count || 0) / Number(totalOrders)) * 100) : 0}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${Math.round((Number(analytics?.status_counts?.find((f) => f.status === "delivered")?.count || 0) / Number(totalOrders)) * 100)}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>



                        {/* Orders Booked */}
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-[#0446DB]/20 group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-700 mb-1">Booked</h2>
                                    <p className="text-2xl lg:text-3xl font-semibold text-gray-900">
                                        {analytics?.status_counts?.find((f) => f.status === "booked")?.count || 0}
                                    </p>
                                </div>
                                <div className="p-3 bg-[#0446DB]/10 rounded-xl group-hover:bg-[#0446DB]/20 transition-colors duration-300">
                                    <MdOutlineShoppingCart className="text-2xl text-[#0446DB]" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Booking rate</span>
                                    <span>{totalOrders > 0 ? Math.round((Number(analytics?.status_counts?.find((f) => f.status === "booked")?.count || 0) / Number(totalOrders)) * 100) : 0}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#0446DB] rounded-full transition-all duration-500"
                                        style={{
                                            width: `${Math.round((Number(analytics?.status_counts?.find((f) => f.status === "booked")?.count || 0) / Number(totalOrders)) * 100)}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
                        {/* Out for Delivery */}
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-yellow-100 group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-700 mb-1">Out for Delivery</h2>
                                    <p className="text-2xl lg:text-3xl font-semibold text-gray-900">
                                        {analytics?.status_counts?.find((f) => f.status === "out for delivery")?.count || 0}
                                    </p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-xl group-hover:bg-yellow-200 transition-colors duration-300">
                                    <TbTruckDelivery className="text-2xl text-yellow-600" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Delivery rate</span>
                                    <span>{totalOrders > 0 ? Math.round((Number(analytics?.status_counts?.find((f) => f.status === "out for delivery")?.count || 0) / Number(totalOrders)) * 100) : 0}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${Math.round((Number(analytics?.status_counts?.find((f) => f.status === "out for delivery")?.count || 0) / Number(totalOrders)) * 100)}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        {/* Orders Cancelled */}
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-red-100 group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-700 mb-1">Cancelled</h2>

                                    <p className="text-2xl lg:text-3xl font-semibold text-gray-900">
                                        {analytics?.status_counts?.find((f) => f.status === "cancelled")?.count || 0}
                                    </p>

                                </div>
                                <div className="p-3 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors duration-300">
                                    <GiCancel className="text-2xl text-red-600" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Cancellation rate</span>
                                    <span>{totalOrders > 0 ? Math.round((Number(analytics?.status_counts?.find((f) => f.status === "cancelled")?.count || 0) / Number(totalOrders)) * 100) : 0}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${Math.round((Number(analytics?.status_counts?.find((f) => f.status === "cancelled")?.count || 0) / Number(totalOrders)) * 100)}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Orders NDR */}
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-rose-100 group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-700 mb-1">Orders NDR</h2>
                                    <p className="text-2xl lg:text-3xl font-semibold text-gray-900">
                                        {analytics?.status_counts?.find((f) => f.status === "ndr")?.count || 0}
                                    </p>
                                </div>
                                <div className="p-3 bg-rose-100 rounded-xl group-hover:bg-rose-200 transition-colors duration-300">
                                    <GiReturnArrow className="text-2xl text-rose-600" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>NDR rate</span>
                                    <span>{totalOrders > 0 ? Math.round((Number(analytics?.status_counts?.find((f) => f.status === "ndr")?.count || 0) / Number(totalOrders)) * 100) : 0}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${Math.round((Number(analytics?.status_counts?.find((f) => f.status === "ndr")?.count || 0) / Number(totalOrders)) * 100)}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Orders Undelivered */}
                        {/* <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-orange-100 group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-700 mb-1">Reschedule</h2>
                                    <p className="text-2xl lg:text-3xl font-semibold text-gray-900">
                                        {analytics.status_counts?.find((f) => f.status === "undelivered")?.count || 0}
                                    </p>
                                </div>
                                <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors duration-300">
                                    <IoAlertCircleOutline className="text-2xl text-orange-600" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Reschedule rate</span>
                                    <span>{Math.round((Number(analytics.status_counts?.find((f) => f.status === "undelivered")?.count || 0) / Number(totalOrders)) * 100)}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${Math.round((Number(analytics.status_counts?.find((f) => f.status === "undelivered")?.count || 0) / Number(totalOrders)) * 100)}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div> */}

                        {/* RTO Delivered */}
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-purple-100 group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-700 mb-1">RTO Delivered</h2>
                                    <p className="text-2xl lg:text-3xl font-semibold text-gray-900">
                                        {analytics?.status_counts?.find((f) => f.status === "rto in transit")?.count || 0}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors duration-300">
                                    <TbTruckReturn className="text-2xl text-purple-600" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>RTO rate</span>
                                    <span>{totalOrders > 0 ? Math.round((Number(analytics?.status_counts?.find((f) => f.status === "rto in transit")?.count || 0) / Number(totalOrders)) * 100) : 0}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${Math.round((Number(analytics?.status_counts?.find((f) => f.status === "rto in transit")?.count || 0) / Number(totalOrders)) * 100)}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Delivery Type Chart */}
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 lg:p-8 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center lg:text-left">
                                Order Mode
                            </h2>
                            <div >
                                <Piechart
                                    data={[
                                        { name: "Turant", value: Number(analytics?.order_specific_counts?.turant_count || 0), label: "Turant" },
                                        { name: "Same Day Delivery", value: Number(analytics?.order_specific_counts?.sdd_count || 0), label: "SDD" },
                                        { name: "Next Day Delivery", value: Number(analytics?.order_specific_counts?.ndd_count || 0), label: "NDD" },
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Live Orders Chart */}
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 lg:p-8 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center lg:text-left">
                                Live Orders Status
                            </h2>
                            <div className="">
                                <Piechart
                                    data={[
                                        { name: "Booked", value: Number(analytics?.status_counts?.[6]?.count || 0), label: 'Booked' },
                                        { name: "Out For Delivery", value: Number(analytics?.status_counts?.[5]?.count || 0), label: 'Out For Delivery' },
                                        { name: "NDR", value: Number(analytics?.status_counts?.[3]?.count || 0), label: "NDR" },
                                        { name: "Undelivered", value: Number(analytics?.status_counts?.[4]?.count || 0), label: "Undelivered" },
                                    ]}
                                />
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 lg:p-8 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center lg:text-left">
                                Payment Methods
                            </h2>
                            <div className="">
                                <Piechart
                                    data={
                                        analytics?.order_type_counts?.map((item) => ({
                                            name: item.order_type,
                                            value: Number(item.count),
                                            label: item.order_type
                                        })) || []
                                    }
                                />

                            </div>
                        </div>
                    </div>
                    {/* City Wise Orders - Full Width */}
                    <div

                        className="bg-white rounded-2xl mt-3 shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-800">City Wise Order Distribution</h3>
                            <div className="text-sm text-gray-500">
                                Total Cities: {cityWiseOrders?.length || 0}
                            </div>
                        </div>
                        <StackBarChart data={cityWiseOrders} labels={cities} />
                    </div>
                    {/* pending orders */}
                    <div>
                        <PendingOrders orders={orders} />
                    </div>
                </div>

            )}
        </>
    );
}





const PendingOrders = ({ orders = [], loading = false }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Calculate pagination values
    const totalOrders = orders.length;
    const totalPages = Math.ceil(totalOrders / itemsPerPage);

    // Get current orders for the page
    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    // Reset to page 1 when orders change
    useEffect(() => {
        setCurrentPage(1);
    }, [orders]);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    return (
        <div className=" bg-white rounded-xl mt-4">
            {/* Header Section */}
            <header className="">
                <div className="mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 sm:space-y-4 lg:space-y-0">
                        <div className="text-center lg:text-left">
                            <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold text-[rgb(11,11,11)]">
                                Upcoming Pickups
                            </h1>
                            {/* <p className="text-[rgb(86,78,193)] mt-1 sm:mt-2 text-sm">
                                Manage and track all your orders in one place
                            </p> */}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                            {/* Additional header content can go here */}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto px-2 sm:px-4 lg:px-6 -mt-2 sm:-mt-6 lg:-mt-4 relative z-10">
                {/* Orders Table */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex justify-center items-center py-16 sm:py-20">
                                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-[#0446DB]"></div>
                            </div>
                        ) : (
                            <div className="min-w-full">
                                <table className="sm:table min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <tr>
                                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Order Information
                                            </th>
                                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Delivery Address
                                            </th>
                                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Package Details
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentOrders.length > 0 ? (
                                            currentOrders.map((order, index) => (
                                                <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                                                    {/* Order Information */}
                                                    <td className="px-3 lg:px-6 py-4">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <a
                                                                    href={`${baseURL}/track-order?awb_number=${order.awb_number}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="font-semibold text-[#0446DB] hover:text-[#0446DB]/80 hover:underline transition-colors duration-200 text-sm"
                                                                >
                                                                    {order.awb_number}
                                                                </a>
                                                                <button
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(order.awb_number);
                                                                        toast.success("AWB copied to clipboard");
                                                                    }}
                                                                    className="text-gray-400 hover:text-[#0446DB] transition-colors duration-200 p-1 rounded"
                                                                >
                                                                    {/* Copy icon */}
                                                                </button>
                                                                <button
                                                                    onClick={() => setPopup(order)}
                                                                    className="text-gray-400 hover:text-[#0446DB] transition-colors duration-200 p-1 rounded"
                                                                >
                                                                    {/* Info icon */}
                                                                </button>
                                                            </div>

                                                            <p className="text-xs text-gray-500">
                                                                {new Date(order.created_at).toLocaleString("en-IN", {
                                                                    timeZone: "Asia/Kolkata",
                                                                    day: "2-digit",
                                                                    month: "2-digit",
                                                                    year: "numeric",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                    hour12: true,
                                                                })}
                                                            </p>

                                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                                <span>MID: {order.merchant_id}</span>
                                                                <span>•</span>
                                                                <span className="flex items-center gap-1">
                                                                    MOID: {order.merchant_order_id?.length <= 15 ? order.merchant_order_id : `${order.merchant_order_id.slice(0, 15)}...`}
                                                                </span>
                                                                <br />
                                                                <span className="bg-[rgb(85,77,192)] px-2 text-white rounded">
                                                                    {order.rider_preference === 'self' ? "Self" : "Daakit"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Delivery Address */}
                                                    <td className="px-3 lg:px-6 py-4">
                                                        <div className="space-y-1">
                                                            <p className="font-medium text-gray-800 flex items-center gap-1 text-sm">
                                                                {order.delivery_contact_name}
                                                            </p>
                                                            <p className="text-xs text-gray-600">{order.delivery_address_line}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {order.delivery_city}, {order.delivery_state} - {order.delivery_pincode}
                                                            </p>
                                                            <p className="text-xs text-gray-400">{order.delivery_country}</p>
                                                        </div>
                                                    </td>

                                                    {/* Package Details */}
                                                    <td className="px-3 lg:px-6 py-4">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-xs">
                                                                <span>Weight: {Number(order.total_weight).toLocaleString()}g</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs">
                                                                <span>
                                                                    Dimensions: {order.package_length}x{order.package_breadth}x{order.package_height}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                                        <p className="text-base sm:text-lg font-medium text-gray-400">No orders found</p>
                                                        <p className="text-xs sm:text-sm text-gray-400 mt-1">Try adjusting your filters or search terms</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Pagination */}
                    {orders.length > 0 && (
                        <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                {/* Page Info */}
                                <div className="text-center sm:text-left">
                                    <p className="text-xs sm:text-sm text-gray-700">
                                        Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, totalOrders)} of {totalOrders} orders
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Page {currentPage} of {totalPages}
                                    </p>
                                </div>

                                {/* Pagination Controls */}
                                <div className="flex items-center justify-center gap-1 sm:gap-2">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${currentPage === 1
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 hover:border-gray-400"
                                            }`}
                                    >
                                        Previous
                                    </button>

                                    {/* Page Numbers */}
                                    {getPageNumbers().map((pageNumber) => (
                                        <button
                                            key={pageNumber}
                                            onClick={() => handlePageChange(pageNumber)}
                                            className={`px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${currentPage === pageNumber
                                                ? "bg-[#0446DB] text-white border border-[#0446DB]"
                                                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 hover:border-gray-400"
                                                }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    ))}

                                    {/* Next Button */}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${currentPage === totalPages
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 hover:border-gray-400"
                                            }`}
                                    >
                                        Next
                                    </button>
                                </div>

                                {/* Items Per Page Selector (Optional) */}
                                <div className="text-center sm:text-right">
                                    <p className="text-xs text-gray-500">
                                        {itemsPerPage} per page
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
