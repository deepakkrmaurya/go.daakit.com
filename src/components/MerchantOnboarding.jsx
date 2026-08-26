import axios from "axios";
import { useState } from "react";
import Loader from "./Loader";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_BASE_URL;

function MerchantOnboarding() {
  const [loading, setLoading] = useState(false);
  const [formMerchantData, setFormMerchantData] = useState({
    name: "",
    email: "",
    phone: "",
    tech_based: 0,
    password: "",
    account_type: "test",
  });

  const handleMerchantChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormMerchantData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleMerchantSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {


      const res = await axios.post(`${baseURL}/api/merchant/onboard`, formMerchantData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Merchant onboarded successfully!");
      setFormMerchantData({
        name: "",
        email: "",
        phone: "",
        password: "",
        account_type: "test",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error onboarding merchant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-[rgb(85,77,192)] to-[rgb(110,103,214)] shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Onboarding Portal
                </h1>
                <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
                  Streamline your merchant onboarding process with our simple and efficient form
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-8 lg:col-start-3">
                {/* Form Card */}
                <form
                  onSubmit={handleMerchantSubmit}
                  className="bg-white rounded-2xl shadow-xl border border-gray-200/60 hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-[rgb(85,77,192)] to-[rgb(110,103,214)] px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Merchant Onboarding</h2>
                        <p className="text-indigo-100 text-sm">Fill in the required details to create a new merchant account</p>
                      </div>
                    </div>
                  </div>

                  {/* Form Content */}
                  <div className="p-6 space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={formMerchantData.name}
                          onChange={handleMerchantChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(85,77,192)] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                          placeholder="Enter merchant's full name"
                          required
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formMerchantData.email}
                          onChange={handleMerchantChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(85,77,192)] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                          placeholder="Enter email address"
                          required
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={formMerchantData.phone}
                          onChange={handleMerchantChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(85,77,192)] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                          placeholder="Enter phone number"
                          required
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                       Is Tech Based <span className="text-red-500">*</span>
                      </label>
                      <select name="tech_based" value={formMerchantData.tech_based} onChange={handleMerchantChange} id="tech_based" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(85,77,192)] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white">
                        <option>Select Tech Based</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>

                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          name="password"
                          value={formMerchantData.password}
                          onChange={handleMerchantChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(85,77,192)] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                          placeholder="Create a secure password"
                          required
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Password must be at least 8 characters with numbers and special characters
                      </p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[rgb(85,77,192)] to-[rgb(110,103,214)] hover:from-[rgb(75,67,172)] hover:to-[rgb(100,93,194)] text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                      >
                        Create Merchant Account
                        <svg className="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MerchantOnboarding;
