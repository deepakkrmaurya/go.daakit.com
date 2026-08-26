import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_BASE_URL;

export default function OrderTracking() {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");

  function toCapitalizeEachWord(str) {
    return str
      .split(" ")
      .map(word => {
        if (!word) return "";
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();})
      .join(" ");
  }

  const getHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/admin/getOrderDetailsWithAssignmentAndTracking/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setHistory(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error fetching order history:");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-gray-100 min-h-screen">
          {/* Top Heading Stripe */}
          <div className="relative z-0 mb-6 bg-[rgb(85,77,192)] py-[24px] shadow-md h-34 md:h-30 px-[24px]">
            <div className="flex flex-wrap items-center justify-between">
              <h1 className="text-2xl text-white">Order Tracking</h1>
            </div>
          </div>

          <div className="max-w-4xl pl-4 -mt-20 relative z-10">
            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Section */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                {/* Facility City and Zone Inputs */}
                <form className="space-y-4 mb-6" onSubmit={e=>e.preventDefault()}>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Order ID
                    </label>
                    <input
                      type="text"
                      required
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter Order ID"
                    />
                  </div>

                  <button
                    type="submit"
                    onClick={getHistory}
                    className="w-full sm:w-auto text-sm sm:text-base bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg active:scale-95 cursor-pointer transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    Get History
                  </button>
                </form>
              </div>

              {/* Right Section (Order Details) */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 w-[222%]">
                {history && (
                  <>
                    <strong>Order Details</strong>
                    <div>Order ID: {history.order.merchant_order_id}</div>
                    <div>AWB Number: {history.order.awb_number}</div>
                    <div>
                      Amount:{" "}
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(Number(history.order.collectable_amount))}
                    </div>
                    <div>Address: {history.order.delivery_address_line}, {history.order.delivery_city}</div>
                    <div>{history.order.delivery_state} -{history.order.delivery_pincode}, {history.order.delivery_country}</div>
                    <div>Phone Number: {history.order.delivery_phone}</div>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Bottom Section (History) */}
          <div className="w-[97%] p-4 bg-white mx-4 mt-4 rounded-xl shadow-md border border-gray-200">
            {history ? (
              history.trackingHistory?.length > 0 ? (
                <table className="w-full text-left border border-gray-300 rounded-md overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100 text-gray-800 font-semibold">
                      <th className="px-4 py-3 border-b">Order Status</th>
                      <th className="px-4 py-3 border-b">Remarks</th>
                      <th className="px-4 py-3 border-b">Timestamp</th>
                      <th className="px-4 py-3 border-b">Updated By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.trackingHistory.map((his) => (
                      <tr
                        className="hover:bg-gray-50 transition duration-200"
                        key={his.id}
                      >
                        <td className="px-4 py-2 border-b">
                          {toCapitalizeEachWord(his.status)}
                        </td>
                        <td className="px-4 py-2 border-b">{his.remarks}</td>
                        <td className="px-4 py-2 border-b">{new Date(his.event_time).toLocaleDateString().split('T')[0]} ; {new Date(his.event_time).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                        })}</td>
                        <td className="px-4 py-2 border-b">{toCapitalizeEachWord(his.updated_by || "")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-500 italic text-center py-32">
                  No Orders Assigned
                </div>
              )
            ) : (
              <div className="text-gray-500 italic text-center py-32">
                No Rider Selected
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
