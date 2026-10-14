
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  CalendarDays,
  Package,
  MapPin,
  Phone,
  User,
  CreditCard,
  Truck,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  FileText,
  Box,
  DollarSign,
  Hash,
  Navigation,
  Wallet,
  Banknote,
  Receipt,
  Download,
  ShieldCheck,
  UserCheck,
  IndianRupee,
  Loader2,
  GitMerge
} from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";
import NewMappingOrders from "./NewMappingOrders";

const baseURL = import.meta.env.VITE_BASE_URL;

export default function OrderHistory() {
   
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [activeTab, setActiveTab] = useState("tracking");

  function toCapitalizeEachWord(str) {
    if (!str) return "";
    return str
      .split(" ")
      .map(word => {
        if (!word) return "";
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  }

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "delivered") return "bg-green-100 text-green-800 border-green-200";
    if (statusLower === "undelivered") return "bg-red-100 text-red-800 border-red-200";
    if (statusLower === "booked" || statusLower === "picked") return "bg-blue-100 text-blue-800 border-blue-200";
    if (statusLower === "in_transit" || statusLower === "out_for_delivery") return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (statusLower === "rto") return "bg-purple-100 text-purple-800 border-purple-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "delivered") return <CheckCircle className="w-4 h-4" />;
    if (statusLower === "undelivered") return <XCircle className="w-4 h-4" />;
    if (statusLower === "booked") return <Package className="w-4 h-4" />;
    if (statusLower === "picked") return <Truck className="w-4 h-4" />;
    if (statusLower === "out_for_delivery") return <Navigation className="w-4 h-4" />;
    if (statusLower === "rto") return <RefreshCw className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };



  const getHistory = async (awb) => {
    const finalOrderId = awb ?? orderId;

    if (!finalOrderId) {
      toast.error("Please Enter AWB Number");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/admin/getAwbCompleteHistory/${finalOrderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setHistory(res.data.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Error fetching order history"
      );
    } finally {
      setLoading(false);
    }
  };

  const getHistorys = async () => {
    const finalOrderId =  orderId;

    if (!finalOrderId) {
      toast.error("Please Enter AWB Number");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/admin/getAwbCompleteHistory/${finalOrderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setHistory(res.data.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Error fetching order history"
      );
    } finally {
      setLoading(false);
    }
  };

  const [searchParams] = useSearchParams();
  const awbFromUrl = searchParams.get("awb_number");
  useEffect(() => {

    if (searchParams.get("awb_number")) {
      setOrderId(searchParams.get("awb_number"));
      getHistory(searchParams.get("awb_number"));
    }
  }, [awbFromUrl]);




  return (
    <>
      
        <div className="min-h-screen bg-[#f5f8fb]">
          {/* Header */}
          <div className="py-3 px-8 ">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold dark:text-white flex items-center gap-2">
              
                Order History
              </h1>

            </div>
            <p className="text-gray-100">Track and view complete order details, shipment history, and delivery updates</p>
          </div>

          {/* Search Card */}
          <div className="bg-gray-50 flex justify-center rounded-sm p-6 mb-8 border border-gray-200">
            <div className="flex flex-col w-[50%] md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">

                  Enter  AWB Number
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    required
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder=" DKTGO-2794323100"
                    onKeyPress={(e) => e.key === 'Enter' && getHistory()}
                  />
                  <button
                    onClick={getHistorys}
                    className="bg-[#0446DB] whitespace-nowrap text-white px-6 py-3 rounded-sm shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98] transition-all duration-200 font-medium flex items-center gap-2"
                  >
                    <Truck className="w-5 h-5" />
                    Get History
                  </button>
                </div>
              </div>
            </div>
          </div>

          {history && (
            <div className="space-y-8">
              {/* Order Summary Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Info Card */}
                <div className="bg-white rounded-sm shadow-lg p-6 border border-gray-200 lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Order Details
                    </h2>
                    <div className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(history.order?.status)} flex items-center gap-2`}>
                      {getStatusIcon(history.order?.status)}
                      {toCapitalizeEachWord(history.order?.status || "Unknown")}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-50 rounded-sm">
                          <Hash className="w-5 h-5 text-[#0446DB]" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Order ID</p>
                          <p className="font-semibold text-gray-900">{history.order.merchant_order_id}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 rounded-sm">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">AWB Number</p>
                          <p className="font-semibold text-gray-900 font-mono">{history.order.awb_number}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-50 rounded-sm">
                          <FaRupeeSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="font-semibold text-gray-900">
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                            }).format(Number(history.order.collectable_amount))}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-50 rounded-sm">
                          <User className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Customer</p>
                          <p className="font-semibold text-gray-900">{history.order.delivery_contact_name}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-yellow-50 rounded-sm">
                          <Phone className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Contact</p>
                          <p className="font-semibold text-gray-900">{history.order.delivery_phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-50 rounded-sm">
                          <CalendarDays className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Order Type</p>
                          <p className="font-semibold text-gray-900 uppercase">{history.order.order_type}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-50 rounded-sm">
                        <MapPin className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Pickup Address</p>
                        <p className="text-gray-900">
                          {history.order.pickup_address_line}, {history.order.pickup_city}, {history.order.pickup_state} - {history.order.pickup_pincode}, {history.order.pickup_country}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-50 rounded-sm">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
                        <p className="text-gray-900">
                          {history.order.delivery_address_line}, {history.order.delivery_city}, {history.order.delivery_state} - {history.order.delivery_pincode}, {history.order.delivery_country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Card */}
                <div className="bg-[#0446DB] rounded-sm shadow-lg p-6 text-white">
                  <h3 className="text-lg font-semibold mb-6">Quick Stats</h3>

                  <div className="space-y-5">
                    <div>
                      <p className="text-sm opacity-90">Total Items</p>
                      <p className="text-2xl font-bold">{history.items?.length || 0}</p>
                    </div>

                    <div>
                      <p className="text-sm opacity-90">Tracking Events</p>
                      <p className="text-2xl font-bold">{history.tracking_history?.length || 0}</p>
                    </div>

                    <div>
                      <p className="text-sm opacity-90">NDR Attempts</p>
                      <p className="text-2xl font-bold">{history.ndr_history?.[0]?.attempt_count || 0}</p>
                    </div>

                    <div>
                      <p className="text-sm opacity-90">Assigned Rider</p>
                      <p className="text-lg font-semibold">{history.rider_assignments?.[0]?.rider_name || "Not Assigned"}</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/20">
                    <p className="text-sm opacity-90 mb-2">Last Updated</p>
                    <p className="font-medium">
                      {new Date(history.order.updated_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="bg-white rounded-sm shadow-lg border border-gray-200">
                <div className="border-b border-gray-200">
                  <nav className="flex overflow-x-scroll space-x-8 px-6">
                    <button
                      onClick={() => setActiveTab("tracking")}
                      className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${activeTab === "tracking" ? "border-indigo-600 text-[#0446DB]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                      <span className="flex whitespace-nowrap items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Tracking History
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab("items")}
                      className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${activeTab === "items" ? "border-indigo-600 text-[#0446DB]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                      <span className="flex whitespace-nowrap items-center gap-2">
                        <Box className="w-4 h-4" />
                        Order Items ({history.items?.length || 0})
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab("ndr")}
                      className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${activeTab === "ndr" ? "border-indigo-600 text-[#0446DB]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                      <span className="flex whitespace-nowrap items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        NDR History ({history.ndr_history?.length || 0})
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab("assignment")}
                      className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${activeTab === "assignment" ? "border-indigo-600 text-[#0446DB]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                      <span className="flex whitespace-nowrap items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        Rider Assignment 
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab("newMappedOrder")}
                      className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${activeTab === "newMappedOrder" ? "border-[#0446DB] text-[#0446DB]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                      <span className="flex whitespace-nowrap items-center gap-2">
                        <GitMerge className="w-4 h-4" />
                        New Mappings
                      </span>
                    </button>
                    
                    {
                      history?.cod_remittance.length > 0 && (
                        <button
                          onClick={() => setActiveTab("cod_remittance")}
                          className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${activeTab === "cod_remittance" ? "border-indigo-600 text-[#0446DB]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                        >
                          <span className="flex whitespace-nowrap items-center gap-2">
                            <IndianRupee className="w-4 h-4" />
                            Cod Remittance
                          </span>
                        </button>
                      )
                    }

                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === "tracking" && (
                    <div className="space-y-4">
                      {history.tracking_history?.length > 0 ? (
                        <div className="relative">
                          {/* Timeline line */}
                          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                          {[...history.tracking_history].reverse().map((his, index) => (
                            <div key={his.id} className="relative flex items-start gap-6 mb-8 last:mb-0">
                              {/* Timeline dot */}
                              <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${index === 0 ? "bg-indigo-100" : "bg-gray-100"}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? "bg-indigo-600 text-white" : "bg-white text-gray-400 border-2 border-gray-300"}`}>
                                  {getStatusIcon(his.status)}
                                </div>
                              </div>

                              {/* Content */}
                              <div className="flex-1 bg-white rounded-sm border border-gray-200 p-5 shadow-sm">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                  <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(his.status)} flex items-center gap-1`}>
                                      {getStatusIcon(his.status)}
                                      {toCapitalizeEachWord(his.status)}
                                    </span>
                                    {his.location && (
                                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {his.location}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {new Date(his.event_time).toLocaleDateString('en-IN')} • {new Date(his.event_time).toLocaleTimeString('en-IN', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true
                                    })}
                                  </span>
                                </div>

                                <p className="text-gray-700 mb-2">{his.remarks}</p>

                                {his.updated_by && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <User className="w-4 h-4" />
                                    <span>Updated by: {toCapitalizeEachWord(his.updated_by)}</span>
                                  </div>
                                )}
                              </div>

                              {/* Chevron for all but last */}
                              {index < history.tracking_history.length - 1 && (
                                <div className="absolute left-[5.8rem] -bottom-4 transform -translate-x-1/2">
                                  <ChevronRight className="w-6 h-6 text-gray-300 rotate-90" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No tracking history available</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "items" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {history.items?.map((item) => (
                        <div key={item.id} className="bg-gray-50 rounded-sm p-4 border border-gray-200 hover:border-indigo-300 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 line-clamp-1">{item.product_name}</h4>
                            <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                              SKU: {item.product_sku}
                            </span>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Price:</span>
                              <span className="font-medium">
                                {new Intl.NumberFormat("en-IN", {
                                  style: "currency",
                                  currency: "INR",
                                }).format(Number(item.product_price))}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Quantity:</span>
                              <span className="font-medium">{item.product_quantity}</span>
                            </div>
                            {/* <div className="flex justify-between">
                              <span className="text-gray-600">Weight:</span>
                              <span className="font-medium">{item.product_weight} kg</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Dimensions:</span>
                              <span className="font-medium font-mono">{item.dimensions}</span>
                            </div> */}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "ndr" && (
                    <div className="space-y-4">
                      {history.ndr_history?.map((ndr) => (
                        <div key={ndr.id} className="bg-red-50 border border-red-200 rounded-sm p-5">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <AlertCircle className="w-5 h-5 text-red-600" />
                              <h4 className="font-semibold text-red-900">NDR Attempt #{ndr.id}</h4>
                            </div>
                            <span className="text-sm text-red-700 font-medium">
                              Attempts: {ndr.attempt_count}
                            </span>
                          </div>

                          <p className="text-red-800 mb-4">{ndr.reason}</p>

                          <div className="space-y-3">
                            {history.ndr_actions
                              ?.filter(action => action.ndr_id === ndr.id)
                              .map((action) => (
                                <div key={action.id} className="bg-white rounded-sm p-3 border border-red-100">

                                  <div className="flex items-center justify-between mb-2">
                                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                      {toCapitalizeEachWord(action.action_taken)}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      {new Date(action.created_at).toLocaleDateString('en-IN')}
                                    </span>
                                  </div>
                                  <p className="text-gray-700">{action.remarks}</p>
                                  {action.created_by && (
                                    <p className="text-sm text-gray-600 mt-2">By: {action.created_by}</p>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}

                      {(!history.ndr_history || history.ndr_history.length === 0) && (
                        <div className="text-center py-12">
                          <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
                          <p className="text-gray-500">No NDR history for this order</p>
                        </div>
                      )}
                    </div>
                  )}
                  {activeTab === "assignment" && (
                    <div className="space-y-4">
                      {history.rider_assignments?.length > 0 && (
                        <div className="bg-white rounded-sm shadow-lg p-6 border border-gray-200">
                          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Truck className="w-5 h-5" />
                            Rider Assignment
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {history.rider_assignments.map((assignment) => (
                              <div key={assignment.id} className="bg-gray-50 rounded-sm p-5">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="p-2 bg-indigo-50 rounded-sm">
                                    <User className="w-6 h-6 text-[#0446DB]" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-gray-900">{assignment.rider_name}</h4>
                                    <p className="text-sm text-gray-600">{assignment.rider_phone}</p>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Assigned On:</span>
                                    <span className="font-medium">
                                      {new Date(assignment.assigned_at).toLocaleDateString('en-IN')}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${assignment.status === "assignment not completed" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                                      {toCapitalizeEachWord(assignment.status)}
                                    </span>
                                  </div>
                                  {assignment.remarks && (
                                    <div>
                                      <span className="text-gray-600 block mb-1">Remarks:</span>
                                      <p className="text-gray-700 text-sm">{assignment.remarks}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {activeTab === "cod_remittance" && (
                    <div className="space-y-4">
                      
                      {activeTab === "cod_remittance" && (
                        <div className="space-y-6">
                          {/* COD Remittance Header with Stats */}




                          {/* COD Remittance Table */}
                          <div className="bg-white rounded-sm shadow-lg border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Transaction Details</th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Amount</th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">UTR / Reference</th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Submitted</th>

                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {history.cod_remittance?.map((remit) => (
                                    <tr key={remit.id} className="hover:bg-gray-50 transition-colors">
                                      <td className="py-4 px-6">
                                        <div className="space-y-1">
                                          <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-indigo-50 rounded">
                                              <CreditCard className="w-4 h-4 text-[#0446DB]" />
                                            </div>
                                            <div>
                                              <p className="font-medium text-gray-900">Transaction #{remit.id}</p>
                                              <p className="text-sm text-gray-600">Rider ID: {remit.rider_id}</p>
                                            </div>
                                          </div>
                                          {remit.received_by && (
                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                              <User className="w-3 h-3" />
                                              Received by: {remit.received_by}
                                            </p>
                                          )}
                                        </div>
                                      </td>
                                      <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                          <Banknote className="w-4 h-4 text-green-600" />
                                          <span className="font-bold text-gray-900">
                                            {new Intl.NumberFormat("en-IN", {
                                              style: "currency",
                                              currency: "INR",
                                            }).format(parseFloat(remit.amount))}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="py-4 px-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${remit.status === "received"
                                          ? "bg-green-100 text-green-800 border border-green-200"
                                          : remit.status === "pending"
                                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                            : "bg-red-100 text-red-800 border border-red-200"
                                          }`}>
                                          {remit.status === "received" ? (
                                            <CheckCircle className="w-3 h-3" />
                                          ) : remit.status === "pending" ? (
                                            <Clock className="w-3 h-3" />
                                          ) : (
                                            <AlertCircle className="w-3 h-3" />
                                          )}
                                          {remit.status.charAt(0).toUpperCase() + remit.status.slice(1)}
                                        </span>
                                      </td>
                                      <td className="py-4 px-6">
                                        {remit.utr_number ? (
                                          <div className="space-y-1">
                                            <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                              {remit.utr_number}
                                            </code>
                                            <p className="text-xs text-gray-500">Transaction reference</p>
                                          </div>
                                        ) : (
                                          <span className="text-gray-400 text-sm">-</span>
                                        )}
                                      </td>
                                      <td className="py-4 px-6">
                                        <div className="space-y-1">
                                          <p className="text-sm text-gray-900">
                                            {new Date(remit.submitted_at).toLocaleDateString('en-IN', {
                                              day: 'numeric',
                                              month: 'short',
                                              year: 'numeric'
                                            })}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {new Date(remit.submitted_at).toLocaleTimeString('en-IN', {
                                              hour: '2-digit',
                                              minute: '2-digit'
                                            })}
                                          </p>
                                        </div>
                                      </td>

                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Empty State */}
                            {(!history.cod_remittance || history.cod_remittance.length === 0) && (
                              <div className="text-center py-16">
                                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                  <Wallet className="w-10 h-10 text-gray-400" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">No COD Remittance Found</h4>
                                <p className="text-gray-600 max-w-md mx-auto">
                                  No cash on delivery transactions have been recorded for this order.
                                </p>
                              </div>
                            )}


                          </div>


                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "newMappedOrder" && (
                    <div className="space-y-4">
                      
                      {activeTab === "newMappedOrder" && (
                        <div className="space-y-6">
                          {/* COD Remittance Header with Stats */}




                          {/* COD Remittance Table */}
                          <div className="bg-white rounded-sm  border border-gray-200 overflow-hidden">
                           
                           <NewMappingOrders 
                             orders = {history?.new_order_mappings}
                           />


                          </div>


                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Rider Assignment Section */}

            </div>
          )}

          {!history && !loading && (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-sm flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-[#0446DB]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Track Your Order</h3>
                <p className="text-gray-600 mb-8">
                  Enter  AWB number above to view complete order details, tracking history, and delivery updates.
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Real-time Tracking
                  </span>
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Detailed History
                  </span>
                  <span className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> NDR Updates
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
 
    </>
  );
}
