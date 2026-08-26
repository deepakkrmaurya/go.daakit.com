
import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../../Loader";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const baseURL = import.meta.env.VITE_BASE_URL;

export default function TechMerchantOrderTracking() {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [awb_number, setAwb_number] = useState("");

  function toCapitalizeEachWord(str) {
    return str
      .split(" ")
      .map(word => {
        if (!word) return "";
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  }

  // Function to get status color
  const getStatusColor = (status) => {
    const statusColors = {
      'delivered': 'bg-green-500',
      'shipped': 'bg-blue-500',
      'processing': 'bg-yellow-500',
      'cancelled': 'bg-red-500',
      'out for delivery': 'bg-purple-500',
      'pending': 'bg-gray-500'
    };
    return statusColors[status?.toLowerCase()] || 'bg-gray-400';
  };
  // Function to get status icon
  const getStatusIcon = (status) => {
    const statusIcons = {
      'delivered': '✅',
      'shipped': '🚚',
      'processing': '⚙️',
      'cancelled': '❌',
      'out for delivery': '📦',
      'pending': '⏳'
    };
    return statusIcons[status?.toLowerCase()] || '📋';
  };

  const getHistory = async () => {
    if (!awb_number.trim()) {
      toast.error("Please enter AWB number");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/techbasedmerchant/getOrderDetailsByMerchant`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            awb_number,
          },
        }
      );
      setHistory(res.data);
      toast.success("Order details loaded successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error fetching order history");
      setHistory(null);
    } finally {
      setLoading(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setAwb_number("");
    setHistory(null);
  };
  const location = useLocation()
 useEffect(() => {
  if (location?.state) {
    setHistory(location.state);
    setAwb_number(location?.state?.order?.awb_number || "");
  }
}, [location?.state]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-[#EEEEEE]">
          {/* Header Section */}
          <header className="bg-gradient-to-r from-[rgb(85,77,192)] to-[rgb(110,103,214)] shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white">Order Tracking History</h1>
                  <p className="text-indigo-100 mt-1">Track your shipments in real-time</p>
                </div>
                <div className="hidden md:block">
                  <svg className="w-12 h-12 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Search Panel */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">Track Your Order</h2>
                    </div>
                    {history && (
                      <button
                        onClick={clearSearch}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        title="Clear search"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    getHistory();
                  }}>
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">
                        AWB Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={awb_number}
                          onChange={(e) => setAwb_number(e.target.value)}
                          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                          placeholder="Enter AWB Number"
                          disabled={loading}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Enter your Air Waybill number to track your shipment</p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[rgb(85,77,192)] to-[rgb(110,103,214)] text-white font-medium py-3 px-4 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Tracking...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Track Order
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Order Details Panel */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full">
                  <div className="flex items-center mb-6">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
                  </div>

                  {history ? (
                    <div className="space-y-5">
                      {/* Status Badge */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{getStatusIcon(history.order.status)}</span>
                            <div>
                              <p className="text-sm text-gray-600">Current Status</p>
                              <p className="text-lg font-bold text-gray-800">{toCapitalizeEachWord(history.order.status)}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(history.order.status)}`}>
                            {toCapitalizeEachWord(history.order.status)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-sm text-gray-500">Order ID</p>
                          <p className="font-medium text-gray-800">{history.order.merchant_order_id}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-sm text-gray-500">AWB Number</p>
                          <p className="font-medium text-gray-800">{history.order.awb_number}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="font-medium text-gray-800">
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                            }).format(Number(history.order.collectable_amount))}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-sm text-gray-500">Last Updated</p>
                          <p className="font-medium text-gray-800">
                            {history.tracking_history?.[0] ?
                              new Date(history.tracking_history[0].event_time).toLocaleDateString('en-IN') :
                              'N/A'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-500 mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Delivery Address
                        </p>
                        <p className="font-medium text-gray-800">{history.order.delivery_address_line}, {history.order.delivery_city}</p>
                        <p className="text-gray-600">{history.order.delivery_state} - {history.order.delivery_pincode}, {history.order.delivery_country}</p>
                        <div className="flex items-center mt-2">
                          <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <p className="text-gray-600">{history.order.delivery_phone}</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-500 mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Pickup Address
                        </p>
                        <p className="font-medium text-gray-800">{history.order.pickup_address_line}, {history.order.pickup_city}</p>
                        <p className="text-gray-600">{history.order.pickup_state} - {history.order.pickup_pincode}, {history.order.pickup_country}</p>
                        <div className="flex items-center mt-2">
                          <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <p className="text-gray-600">{history.order.pickup_phone}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500">Enter AWB number to view order details</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tracking History Section */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Tracking History</h2>
                  </div>
                  {history && (
                    <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                      {history.tracking_history?.length || 0} events
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                {history ? (
                  history.tracking_history?.length > 0 ? (
                    <div className="space-y-4">
                      {history.tracking_history.map((his, index) => (
                        <div key={his.id} className="flex group">
                          <div className="flex flex-col items-center mr-4">
                            <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-indigo-500 ring-2 ring-indigo-200' : 'bg-gray-300'} group-hover:scale-125 transition-transform duration-200`}></div>
                            {index < history.tracking_history.length - 1 && (
                              <div className="w-0.5 h-full bg-gray-300 mt-1 group-hover:bg-gray-400 transition-colors duration-200"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="bg-gray-50 group-hover:bg-gray-100 p-4 rounded-xl transition-all duration-200 border border-transparent group-hover:border-gray-200">
                              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusColor(his.status)}`}></span>
                                  <p className="font-medium text-gray-800">{toCapitalizeEachWord(his.status)}</p>
                                </div>
                                <p className="text-sm text-gray-500 mt-1 md:mt-0">
                                  {new Date(his.event_time).toLocaleDateString('en-IN')} • {new Date(his.event_time).toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                  })}
                                </p>
                              </div>
                              <p className="text-gray-600">{his.remarks}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500">No tracking history available for this order</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-10">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500">Enter AWB number to view tracking history</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}