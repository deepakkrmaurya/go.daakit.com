import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_BASE_URL;

function VendorOnboarding() {
  const [loading, setLoading] = useState(false);
  const [formVendorData, setFormVendorData] = useState({
    vendor_name: "",
    company_name: "",
    gst_no: "",
    company_address: "",
    phone: "",
    email: "",
    password: "",
    document_type: "",
    document_id: "",
    document_image: null,
  });

  const handleVendorChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormVendorData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value.trim?.() ?? value,
    }));
  };

  const handleVendorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    for (const key in formVendorData) {
      if (formVendorData[key] !== null && formVendorData[key] !== "") {
        data.append(key, formVendorData[key]);
      }
    }

    try {
      const res = await axios.post(
        `${baseURL}/api/vendor/createVendor`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Vendor Onboarded Successfully!");
      setFormVendorData({
        vendor_name: "",
        company_name: "",
        gst_no: "",
        company_address: "",
        phone: "",
        email: "",
        password: "",
        document_type: "",
        document_id: "",
        document_image: null,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error onboarding vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (<Loader />) : (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen w-full">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#554dc0] to-[#6b63ff] py-8 shadow-lg">
            <div className="container mx-auto px-6">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Vendor Onboarding</h1>
                <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                  Join our network and start growing your business with us
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-6 py-8 -mt-16">
            <div className="max-w-4xl mx-auto">
              {/* Form Card */}
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-[#554dc0] to-[#6b63ff] px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-white/20 p-3 rounded-xl mr-4">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Vendor Registration</h2>
                        <p className="text-blue-100 text-sm mt-1">Complete your business details to get started</p>
                      </div>
                    </div>
                    <div className="hidden md:block bg-white/10 px-4 py-2 rounded-lg">
                      <span className="text-white text-sm font-medium">Step 1 of 1</span>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleVendorSubmit} className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Business Information */}
                    <div className="space-y-6">
                      {/* Business Details Card */}
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <svg className="w-5 h-5 text-[#554dc0] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Business Information
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Vendor Name *
                            </label>
                            <input
                              type="text"
                              name="vendor_name"
                              value={formVendorData.vendor_name}
                              onChange={handleVendorChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent transition-colors"
                              placeholder="Enter vendor name"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Company Name
                            </label>
                            <input
                              type="text"
                              name="company_name"
                              value={formVendorData.company_name}
                              onChange={handleVendorChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent"
                              placeholder="Enter company name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              GST Number
                            </label>
                            <input
                              type="text"
                              name="gst_no"
                              value={formVendorData.gst_no}
                              onChange={handleVendorChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent"
                              placeholder="Enter GST number"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Contact Information Card */}
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <svg className="w-5 h-5 text-[#554dc0] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Contact Details
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number *
                            </label>
                            <input
                              type="text"
                              name="phone"
                              value={formVendorData.phone}
                              onChange={handleVendorChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent"
                              placeholder="Enter phone number"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email ID *
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formVendorData.email}
                              onChange={handleVendorChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent"
                              placeholder="Enter email address"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Address Information */}
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <svg className="w-5 h-5 text-[#554dc0] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Company Address
                        </h3>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Address
                          </label>
                          <textarea
                            name="company_address"
                            value={formVendorData.company_address}
                            onChange={handleVendorChange}
                            rows="4"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent resize-none"
                            placeholder="Enter complete company address"
                          ></textarea>
                        </div>
                      </div>

                      {/* Security Information */}
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <svg className="w-5 h-5 text-[#554dc0] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Security
                        </h3>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password *
                          </label>
                          <input
                            type="password"
                            name="password"
                            value={formVendorData.password}
                            onChange={handleVendorChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent"
                            placeholder="Create a strong password"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-2">Use 8+ characters with mix of letters, numbers & symbols</p>
                        </div>
                      </div>

                      {/* Document Details */}
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <svg className="w-5 h-5 text-[#554dc0] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Document Verification
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Document Type
                            </label>
                            <select
                              name="document_type"
                              value={formVendorData.document_type}
                              onChange={handleVendorChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent"
                            >
                              <option value="">Select Document Type</option>
                              <option value="aadhar">Aadhar Card</option>
                              <option value="pan">PAN Card</option>
                              <option value="voterid">Voter ID</option>
                              <option value="passport">Passport</option>
                              <option value="driving_license">Driving License</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Document ID
                            </label>
                            <input
                              type="text"
                              name="document_id"
                              value={formVendorData.document_id}
                              onChange={handleVendorChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent"
                              placeholder="Enter document ID number"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Document Upload
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#554dc0] transition-colors cursor-pointer">
                              <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <input
                                type="file"
                                name="document_image"
                                onChange={handleVendorChange}
                                accept="image/*,application/pdf"
                                className="hidden"
                                id="document-upload"
                              />
                              <label htmlFor="document-upload" className="cursor-pointer">
                                <p className="text-sm font-medium text-gray-700 mb-1">Click to upload document</p>
                                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                      
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-[#554dc0] to-[#6b63ff] hover:from-[#4840a0] hover:to-[#5951d1] text-white py-3 px-8 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl min-w-[200px]"
                      >
                        Complete Registration
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        // <div className="bg-gray-100 min-h-screen w-full">
        //   {/* Heading Strip */}
        //   <div className="mb-6 bg-[rgb(85,77,192)] py-[24px] shadow-md h-38 px-[24px]">
        //     <div className="flex flex-wrap items-center justify-between">
        //       {/* Heading */}
        //       <h1 className="text-2xl text-white">Onboarding</h1>

        //     </div>
        //   </div>
        //   <div className="mx-6 z-10 items-center rounded-md">

        //     {/* Form Card */}
        //     <div className="max w-full md:w-5xl -mt-20 relative z-10 gap-8">
        //       {/* Vendor Onboarding Form */}
        //       <form
        //         onSubmit={handleVendorSubmit}
        //         className="bg-white rounded-2xl w-[100%] shadow-lg p-8 space-y-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
        //       >
        //         <h1 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
        //           Vendor Onboarding
        //         </h1>

        //         {/* Vendor Name */}
        //         <div>
        //           <label className="block text-gray-700 font-medium mb-1">
        //             Vendor Name*
        //           </label>
        //           <input
        //             type="text"
        //             name="vendor_name"
        //             value={formVendorData.vendor_name}
        //             onChange={handleVendorChange}
        //             className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(85,77,192)]"
        //             required
        //           />
        //         </div>

        //         {/* Company Name */}
        //         <div>
        //           <label className="block text-gray-700 font-medium mb-1">
        //             Company Name
        //           </label>
        //           <input
        //             type="text"
        //             name="company_name"
        //             value={formVendorData.company_name}
        //             onChange={handleVendorChange}
        //             className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(85,77,192)]"

        //           />
        //         </div>

        //         {/* GST No. */}
        //         <div>
        //           <label className="block text-gray-700 font-medium mb-1">
        //             GST Number
        //           </label>
        //           <input
        //             type="text"
        //             name="gst_no"
        //             value={formVendorData.gst_no}
        //             onChange={handleVendorChange}
        //             className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(85,77,192)]"

        //           />
        //         </div>

        //         {/* Company Address*/}
        //         <div>
        //           <label className="block text-gray-700 font-medium mb-1">
        //             Company Address
        //           </label>
        //           <input
        //             type="text"
        //             name="company_address"
        //             value={formVendorData.company_address}
        //             onChange={handleVendorChange}
        //             className="w-full border border-gray-300 rounded-lg px-4 py-2"

        //           />
        //         </div>

        //         {/* Phone */}
        //         <div>
        //           <label className="block text-gray-700 font-medium mb-1">
        //             Phone Number*
        //           </label>
        //           <input
        //             type="text"
        //             name="phone"
        //             value={formVendorData.phone}
        //             onChange={handleVendorChange}
        //             className="w-full border border-gray-300 rounded-lg px-4 py-2"
        //             required
        //           />
        //         </div>

        //         {/* Email ID */}
        //         <div>
        //           <label className="block text-gray-700 font-medium mb-1">
        //             Email ID*
        //           </label>
        //           <input
        //             type="email"
        //             name="email"
        //             value={formVendorData.email}
        //             onChange={handleVendorChange}
        //             className="w-full border border-gray-300 rounded-lg px-4 py-2"
        //             required
        //           />
        //         </div>

        //         {/* Password */}
        //         <div>
        //           <label className="block text-gray-700 font-medium mb-1">
        //             Password*
        //           </label>
        //           <input
        //             type="password"
        //             name="password"
        //             value={formVendorData.password}
        //             onChange={handleVendorChange}
        //             className="w-full border border-gray-300 rounded-lg px-4 py-2"
        //             required
        //           />
        //         </div>

        //         {/* Document Details */}
        //         <div>
        //           <label className="block text-gray-700 font-medium mb-1">
        //             Document Type
        //           </label>
        //           <select
        //             name="document_type"
        //             value={formVendorData.document_type}
        //             onChange={handleVendorChange}
        //             className="w-full border border-gray-300 rounded-lg px-4 py-2"

        //           >
        //             <option value="">Select</option>
        //             <option value="aadhar">Aadhar</option>
        //             <option value="pan">PAN Card</option>
        //             <option value="voterid">Voter ID</option>
        //             <option value="passport">Paasport</option>
        //             <option value="driving_license">Driving License</option>
        //           </select>
        //         </div>

        //         <div>
        //           <label className="block text-gray-700 font-medium mb-1">
        //             Document ID
        //           </label>
        //           <input
        //             type="text"
        //             name="document_id"
        //             value={formVendorData.document_id}
        //             onChange={handleVendorChange}
        //             className="w-full border border-gray-300 rounded-lg px-4 py-2"

        //           />
        //         </div>

        //         <div>
        //           <label className="block text-gray-700 font-medium mb-1">
        //             Doc Image
        //           </label>
        //           <input
        //             type="file"
        //             name="document_image"
        //             onChange={handleVendorChange}
        //             accept="image/*,application/pdf"
        //             className="w-full border border-gray-300 rounded-lg px-4 py-2"

        //           />
        //         </div>

        //         {/* Submit Button */}
        //         <button
        //           type="submit"
        //           className="w-full bg-[rgb(85,77,192)] hover:bg-indigo-800 text-white py-2 px-4 rounded-lg font-medium transition"
        //         >
        //           Submit
        //         </button>
        //       </form>
        //     </div>
        //   </div>
        // </div>
      )}
    </>
  );
}

export default VendorOnboarding;
