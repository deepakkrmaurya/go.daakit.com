import axios from "axios";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_BASE_URL;

export default function CreateRiderRate() {
  const [checkMerchantRateExists, setcheckMerchantRateExists] = useState([])
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    type: "",
    rider: "",
    rateType: "",
    rate: "",
    orderMode: ""
  });

  const rateValues = [
    { value: "SDD", label: "Same Day Delivery" },
    { value: "NDD", label: "Next Day Delivery" },
    { value: "Turant", label: "Turant" },
  ];

  const rateTypeValues = [
    { value: "perorder", label: "Per Order" },
    { value: "perkms", label: "Per Kilometer" }
  ];

  useEffect(() => {
    if (formData.type === "individual") {
      fetchRiders();
    }
  }, [formData.type]);

  const fetchRiders = async () => {
    try {
      setFetching(true);
      const res = await axios.get(`${baseURL}/api/techbasedmerchant/getRidersWithoutMerchantRate`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRiders(res.data.riders);
    } catch (err) {
      setError("Failed to fetch riders");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "type") {
      setFormData(prev => ({ ...prev, rider: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // const response = await axios.post(`${baseURL}/api/techbasedmerchant/checkMerchantRateExists`,
      //   {
      //     rate_for: formData.type,
      //     rider_id: formData.rider
      //   },
      //   {

      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem("token")}`,
      //     },

      //   }
      // )
      // if(response.data.exists){
      //   toast.error(response.data.message)
      //   return
      // }
      const submissionData = {
        rate_for: formData.type,
        ...(formData.type === "individual" && { riderId: formData.rider }),
        rateType: formData.rateType,
        rate: parseFloat(formData.rate),
        orderMode: formData.orderMode,
      };
      const res = await axios.post(`${baseURL}/api/techbasedmerchant/addMerchantRate`,
        {
          "rate_for": submissionData.rate_for,
          "rider_id": submissionData.riderId,
          "rate_type": submissionData.rateType,
          "rate": submissionData.rate,
          "order_mode": submissionData.orderMode
        }
        , {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      if (res.data.success) {
        await new Promise(resolve => setTimeout(resolve, 1500));

        setSuccess("Rider rate created successfully!");

        setFormData({
          type: "",
          rider: "",
          rateType: "",
          rate: "",
          orderMode: ""
        });
      }


    } catch (err) {
      setError(err.response?.data?.message || "Failed to create rider rate");
    } finally {
      setLoading(false);
    }
  };

  const isValidForm = () => {
    if (!formData.type || !formData.rateType || !formData.rate || !formData.orderMode) {
      return false;
    }
    if (formData.type === "individual" && !formData.rider) {
      return false;
    }
    return true;
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Rider Rate Management
          </h1>
          <p className="text-gray-600 mt-2">Create and manage rider rate cards</p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Rate Configuration
              </h2>
              <p className="text-gray-600">Select the rider type and configure rates</p>
            </div>

            {/* Rider Type Selection */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rate For
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full p-3 pl-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                    required
                  >
                    <option value="">Select Rider Type</option>
                    <option value="all">All Riders</option>
                    <option value="individual">Individual Rider</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Individual Rider Selection */}
              {formData.type === "individual" && (
                <div className="animate-fadeIn">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Rider
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    {fetching ? (
                      <div className="flex items-center justify-center p-4 border border-gray-300 rounded-xl">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600 mr-2" />
                        <span className="text-gray-600">Loading riders...</span>
                      </div>
                    ) : (
                      <>
                        <select
                          name="rider"
                          value={formData.rider}
                          onChange={handleChange}
                          className="w-full p-3 pl-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                          required
                        >
                          <option value="">Select a Rider</option>
                          {riders.map((rider) => (
                            <option key={rider.id} value={rider.id}>
                              {rider.name} ({rider.id})
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </>
                    )}
                  </div>
                  {riders.length > 0 && (
                    <p className="mt-2 text-sm text-gray-500">
                      {riders.length} riders available
                    </p>
                  )}
                </div>
              )}


            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Rate Details
              </h2>
              <p className="text-gray-600">Fill in the rate information below</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rate Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rate Type
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {rateTypeValues.map((rt) => (
                    <button
                      key={rt.value}
                      type="button"
                      onClick={() => handleChange({ target: { name: "rateType", value: rt.value } })}
                      className={`p-4 border rounded-xl text-left transition-all duration-200 ${formData.rateType === rt.value
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                        : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                    >
                      <div className="font-medium text-gray-800">{rt.label}</div>
                      {/* <div className="text-sm text-gray-500 mt-1">{rt.value}</div> */}
                    </button>
                  ))}
                </div>
                <input
                  type="hidden"
                  name="rateType"
                  value={formData.rateType}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Rate Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rate Amount
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="rate"
                    value={formData.rate}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="Enter rate amount"
                    className="w-full p-3 pl-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <span className="text-gray-500">₹</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {formData.rateType === "perorder"
                    ? "Amount per order"
                    : formData.rateType === "perkms"
                      ? "Amount per kilometer"
                      : "Enter the rate amount"}
                </p>
              </div>

              {/* Order Mode */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Order Mode
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  {formData.rateType == 'perorder' && (

                    rateValues.map((mode) => (
                      <>

                        <button
                          key={mode.value}
                          type="button"
                          onClick={() => handleChange({ target: { name: "orderMode", value: mode.value } })}
                          className={`p-4 border rounded-xl text-left transition-all duration-200 ${formData.orderMode === mode.value
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                            : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                            }`}
                        >
                          <div className="font-medium text-gray-800">{mode.label}</div>
                          {/* <div className="text-sm text-gray-500">{mode.value}</div> */}
                        </button>

                      </>


                    ))

                  )}
                  {formData.rateType === 'perkms' && (
                    <button
                      type="button"
                      onClick={() => handleChange({ target: { name: "orderMode", value: "Turant" } })}
                      className={`p-4 border rounded-xl text-left transition-all duration-200 ${formData.orderMode === "Turant"
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                        : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                    >
                      <div className="font-medium text-gray-800">Turant</div>
                      {/* <div className="text-sm text-gray-500">turant</div> */}
                    </button>
                  )}
                </div>
                <input
                  type="hidden"
                  name="orderMode"
                  value={formData.orderMode}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Preview Card */}
              {/* <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">Rate Preview</h3>
                <div className="space-y-2">
                  {formData.rate && (
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <div className="font-medium text-gray-800">
                          {formData.rateType === "perorder" ? "Per Order" : "Per Kilometer"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formData.orderMode === "SDD" ? "Same Day Delivery" : "Next Day Delivery"}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        ₹{parseFloat(formData.rate).toFixed(2)}
                      </div>
                    </div>
                  )}
                  {!formData.rate && (
                    <p className="text-gray-500 text-center py-4">Fill the form to see preview</p>
                  )}
                </div>
              </div> */}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isValidForm() || loading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${isValidForm() && !loading
                  ? "bg-[rgb(86,78,193)] text-white shadow-lg hover:shadow-xl"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Rate...
                  </>
                ) : (
                  "Create Rider Rate"
                )}
              </button>



            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}