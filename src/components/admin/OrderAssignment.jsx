import { useState } from "react";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";
import {cities} from "indian-cities-json";
const baseURL = import.meta.env.VITE_BASE_URL;

// const options = [
//   { value: "Bangalore", label: "Bangalore" },
//   { value: "Delhi", label: "Delhi" },
//   { value: "Gurugram", label: "Gurugram" },
//   { value: "Noida", label: "Noida" },
// ];



export default function OrderAssignment() {
  const [orders, setOrders] = useState([]);
  const [rider, setRider] = useState("");
  const [facilityCity, setFacilityCity] = useState("");
  const [facilityZone, setFacilityZone] = useState("");
  const [riderOptions, setRiderOptions] = useState([]);
  const options = cities?.map(city => ({
  value: city.name,
  label: city.name,
}));


  

  const getRiders = async () => {
    try {
      const res = await axios.post(
        `${baseURL}/api/admin/getRidersByFacilityArea`,
        {
          facility_city: facilityCity,
          facility_zone: facilityZone || "",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            limit: 10000,
          }
        }
      );
      const tempArr = [];
      res?.data?.data?.forEach(element => {
        tempArr.push({value: element.id, label: `${element.id}: ${element.name}, ${element.phone}`})
      });
      setRiderOptions(tempArr);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error fetching riders");
    }
  };

  const getAssignedOrders = async (rider_id) => {
    setRider(rider_id);
    try {
      const res = await axios.get(
        `${baseURL}/api/admin/getRiderAssignedOrders/${rider_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOrders(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error fetching Assigned Orders");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Top Heading Stripe */}
      <div className="relative z-0 mb-6 bg-[rgb(85,77,192)] py-[24px] shadow-md h-38 px-[24px]">
        <div className="flex flex-wrap items-center justify-between">
          <h1 className="text-2xl text-white">Order Assignmnets</h1>
        </div>
      </div>

      <div className=" px-4 -mt-20 relative z-10">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            {/* Facility City and Zone Inputs */}
            <div className="space-y-4 mb-4">
              <form onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Facility City
                  </label>
                  <Select
                    options={options}
                    isSearchable
                    value={options.find(
                      (option) => option.value === facilityCity
                    )}
                    onChange={(selectedOption) =>
                      setFacilityCity(selectedOption?.value || "")
                    }
                    placeholder="Select City"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        border: "1px solid #D1D5DB", // Tailwind border-gray-300
                        borderRadius: "0.5rem", // Tailwind rounded-lg
                        padding: "2px 6px", // to match px-4 py-2
                        boxShadow: state.isFocused
                          ? "0 0 0 2px rgba(99,102,241,0.5)"
                          : "none", // Tailwind ring-2 ring-indigo-500
                        "&:hover": {
                          borderColor: "#A5B4FC", // lighter indigo on hover
                        },
                      }),
                      placeholder: (base) => ({
                        ...base,
                        fontSize: "0.875rem", // Tailwind text-sm
                        color: "#9CA3AF", // Tailwind text-gray-400
                      }),
                      singleValue: (base) => ({
                        ...base,
                        fontSize: "0.875rem",
                        color: "#111827", // Tailwind text-gray-900
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 10,
                      }),
                    }}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Facility Zone
                  </label>
                  <input
                    type="text"
                    value={facilityZone}
                    onChange={(e) => setFacilityZone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter zone"
                  />
                </div>

                <button
                  type="submit"
                  onClick={getRiders}
                  className="w-full mt-4 sm:w-auto text-sm sm:text-base bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg active:scale-95 cursor-pointer transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  Get Riders
                </button>
              </form>
            </div>

            {/* Rider Selection */}

            {riderOptions?.length > 0 && (
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Select Rider
                </label>
                <Select
                  options={riderOptions}
                  isSearchable
                  value={riderOptions.find(
                    (option) => option.value === rider
                  )}
                  onChange={(selectedOption) =>
                    getAssignedOrders(selectedOption?.value)
                  }
                  placeholder="Select Rider"
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      border: "1px solid #D1D5DB", // Tailwind border-gray-300
                      borderRadius: "0.5rem", // Tailwind rounded-lg
                      padding: "2px 6px", // to match px-4 py-2
                      boxShadow: state.isFocused
                        ? "0 0 0 2px rgba(99,102,241,0.5)"
                        : "none", // Tailwind ring-2 ring-indigo-500
                      "&:hover": {
                        borderColor: "#A5B4FC", // lighter indigo on hover
                      },
                    }),
                    placeholder: (base) => ({
                      ...base,
                      fontSize: "0.875rem", // Tailwind text-sm
                      color: "#9CA3AF", // Tailwind text-gray-400
                    }),
                    singleValue: (base) => ({
                      ...base,
                      fontSize: "0.875rem",
                      color: "#111827", // Tailwind text-gray-900
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 10,
                    }),
                  }}
                />
                
              </div>
            )}
          </div>

          {/* Right Section (Orders) */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 w-[100%]">
            {rider ? (
              orders.length > 0 ? (
                <table className="w-full text-left border border-gray-300 rounded-md overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100 text-gray-800 font-semibold">
                      <th className="px-4 py-3 border-b">Order ID</th>
                      <th className="px-4 py-3 border-b">Order Status</th>
                      <th className="px-4 py-3 border-b">Order Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        className="hover:bg-gray-50 transition duration-200"
                        key={order.order_id}
                      >
                        <td className="px-4 py-2 border-b">
                          {order.merchant_order_id}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {order.order_status}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {order.order_type === "cod"
                            ? "COD"
                            : order.order_type === "prepaid"
                            ? "Prepaid"
                            : order.order_type}
                        </td>
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
      </div>
    </div>
  );
}
