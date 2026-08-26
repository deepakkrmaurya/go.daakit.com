
import axios from "axios";
import { useEffect, useState } from "react";

import Select from "react-select";
import { toast } from "react-toastify";
import Loader from "../../Loader";

const baseURL = import.meta.env.VITE_BASE_URL;

function TechBasedOnBoarding() {
  const [loading, setLoading] = useState(false);
  const [vendorsData, setVendorsData] = useState([]);
  const [formRiderData, setFormRiderData] = useState({
    rider_type: "merchant",
    vendor_id: "",
    name: "",
    email: "",
    phone_number: "",
    password: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    document_type: "",
    document_id: "",
    document_image: null,
    facility_city: "",
    facility_zone: "",
  });

  const options = [
    { value: "Bangalore", label: "Bangalore" },
    { value: "Delhi", label: "Delhi" },
    { value: "Mumbai", label: "Mumbai" },
    { value: "Kolkata", label: "Kolkata" },
    { value: "Chennai", label: "Chennai" },
    { value: "Hyderabad", label: "Hyderabad" },
    { value: "Pune", label: "Pune" },
    { value: "Ahmedabad", label: "Ahmedabad" },
    { value: "Gurugram", label: "Gurugram" },
    { value: "Noida", label: "Noida" },
    { value: "Faridabad", label: "Faridabad" },
    { value: "Ghaziabad", label: "Ghaziabad" },
    { value: "Jaipur", label: "Jaipur" },
    { value: "Lucknow", label: "Lucknow" },
    { value: "Kanpur", label: "Kanpur" },
    { value: "Nagpur", label: "Nagpur" },
    { value: "Indore", label: "Indore" },
    { value: "Bhopal", label: "Bhopal" },
    { value: "Surat", label: "Surat" },
    { value: "Vadodara", label: "Vadodara" },
    { value: "Rajkot", label: "Rajkot" },
    { value: "Nashik", label: "Nashik" },
    { value: "Thane", label: "Thane" },
    { value: "Vijayawada", label: "Vijayawada" },
    { value: "Visakhapatnam", label: "Visakhapatnam" },
    { value: "Coimbatore", label: "Coimbatore" },
    { value: "Madurai", label: "Madurai" },
    { value: "Kochi", label: "Kochi" },
    { value: "Trivandrum", label: "Trivandrum" },
    { value: "Kozhikode", label: "Kozhikode" },
    { value: "Chandigarh", label: "Chandigarh" },
    { value: "Mohali", label: "Mohali" },
    { value: "Panchkula", label: "Panchkula" },
    { value: "Patna", label: "Patna" },
    { value: "Ranchi", label: "Ranchi" },
    { value: "Jamshedpur", label: "Jamshedpur" },
    { value: "Bhubaneswar", label: "Bhubaneswar" },
    { value: "Cuttack", label: "Cuttack" },
    { value: "Guwahati", label: "Guwahati" },
    { value: "Shillong", label: "Shillong" },
    { value: "Imphal", label: "Imphal" },
    { value: "Aizawl", label: "Aizawl" },
    { value: "Gangtok", label: "Gangtok" },
    { value: "Dehradun", label: "Dehradun" },
    { value: "Haridwar", label: "Haridwar" },
    { value: "Rishikesh", label: "Rishikesh" },
    { value: "Agra", label: "Agra" },
    { value: "Varanasi", label: "Varanasi" },
    { value: "Prayagraj", label: "Prayagraj" },
    { value: "Meerut", label: "Meerut" },
    { value: "Aligarh", label: "Aligarh" },
    { value: "Moradabad", label: "Moradabad" },
    { value: "Bareilly", label: "Bareilly" },
    { value: "Jodhpur", label: "Jodhpur" },
    { value: "Udaipur", label: "Udaipur" },
    { value: "Kota", label: "Kota" },
    { value: "Ajmer", label: "Ajmer" },
    { value: "Amritsar", label: "Amritsar" },
    { value: "Ludhiana", label: "Ludhiana" },
    { value: "Jalandhar", label: "Jalandhar" },
    { value: "Mangaluru", label: "Mangaluru" },
    { value: "Mysuru", label: "Mysuru" },
    { value: "Hubballi", label: "Hubballi" },
    { value: "Belagavi", label: "Belagavi" },
    { value: "Raipur", label: "Raipur" },
    { value: "Bhilai", label: "Bhilai" },
    { value: "Bilaspur", label: "Bilaspur" },
    { value: "Jabalpur", label: "Jabalpur" },
    { value: "Gwalior", label: "Gwalior" },
    { value: "Tirupati", label: "Tirupati" },
    { value: "Warangal", label: "Warangal" },
    { value: "Nellore", label: "Nellore" },
    { value: "Tirunelveli", label: "Tirunelveli" },
    { value: "Salem", label: "Salem" },
    { value: "Trichy", label: "Trichy" },
    { value: "Allahabad", label: "Allahabad" },
    { value: "Srinagar", label: "Srinagar" },
    { value: "Jammu", label: "Jammu" },
    { value: "Port Blair", label: "Port Blair" },
    { value: "Panaji", label: "Panaji" },
    { value: "Margao", label: "Margao" },
    { value: "Puducherry", label: "Puducherry" },
  ];

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/admin/getAllVendors`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setVendorsData(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error fetching vendors: ");
    } finally {
      setLoading(false);
    }
  };


  const handleRiderChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormRiderData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleRiderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    for (const key in formRiderData) {
      if (formRiderData[key] !== null && formRiderData[key] !== "") {
        data.append(key, formRiderData[key]);
      }
    }
    const phone = data.get("phone_number")?.toString().trim();
    const password = data.get("password")?.toString().trim();
    const name = data.get("name")?.toString().trim();
    const email = data.get("email")?.toString().trim();   // ✅ fixed typo
    const facility_city = data.get("facility_city")?.toString().trim();

    /* ---------------- REQUIRED FIELD CHECK ---------------- */

    if (!name) {
      toast.error("Name is required");
      return setLoading(false);
    }

    if (!phone) {
      toast.error("Mobile number is required");
      return setLoading(false);
    }

    if (!email) {
      toast.error("Email is required");
      return setLoading(false);
    }

    if (!password) {
      toast.error("Password is required");
      return setLoading(false);
    }

    if (!facility_city) {
      toast.error("City is required");
      return setLoading(false);
    }

    /* ---------------- PHONE VALIDATION ---------------- */

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Mobile number must be exactly 10 digits");
      return setLoading(false);
    }

    /* ---------------- EMAIL VALIDATION ---------------- */

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address");
      return setLoading(false);
    }

    try {
      const res = await axios.post(
        `${baseURL}/api/techbasedmerchant/onboardRider`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Rider onboarded successfully!");
      setFormRiderData({
        name: "",
        email: "",
        phone_number: "",
        password: "",
        address_line: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
        document_type: "",
        document_id: "",
        document_image: null,
        rider_type: "self",
        vendor_id: "",
        facility_city: "",
        facility_zone: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error onboarding rider");
    } finally {
      setLoading(false);
    }
  };

  //   useEffect(() => {
  //     fetchVendors();
  //   }, []);

  return (
    <>
      {loading ? (<Loader />) : (
        <div className="bg-[#EEEEEE] min-h-screen w-full flex flex-col">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#554dc0] to-[#6b63ff] py-8 shadow-lg">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Onboarding</h1>
                <p className="text-blue-100 text-lg">Get started with our platform</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              {/* Form Card Container */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden -mt-16 relative z-10">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-[#554dc0] to-[#6b63ff] px-8 py-6">
                  <div className="flex items-center">
                    <div className="bg-white/20 p-2 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Rider Onboarding</h2>
                  </div>
                  <p className="text-blue-100 mt-2">Complete your profile to start riding with us</p>
                </div>

                {/* Form Content */}
                <form onSubmit={handleRiderSubmit} className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Rider Type Section */}
                      {/* <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <svg className="w-5 h-5 text-[#554dc0] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Account Type
                        </h3>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rider Type*
                          </label>
                          <select
                            name="rider_type"
                            value={formRiderData.rider_type}
                            onChange={handleRiderChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent transition-colors"
                            required
                          >
                            <option value="self">Self</option>
                            <option value="vendor">Third Party Vendor</option>
                            <option value="merchant">Merchant</option>
                          </select>

                          {formRiderData.rider_type === "vendor" && (
                            <div className="mt-4 animate-fadeIn">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Vendor*
                              </label>
                              <select
                                name="vendor_id"
                                value={formRiderData.vendor_id}
                                onChange={handleRiderChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent"
                                required
                              >
                                <option value="">Select Vendor</option>
                                {vendorsData.map((vendor) => (
                                  <option value={vendor.id} key={vendor.id}>
                                    FP{vendor.id} : {vendor.vendor_name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div> */}

                      {/* Personal Information */}
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <svg className="w-5 h-5 text-[#554dc0] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Personal Information
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Name*
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formRiderData.name}
                              onChange={handleRiderChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent transition-colors"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email*
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={formRiderData.email}
                                onChange={handleRiderChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number*
                              </label>
                              <input
                                type="text"
                                name="phone_number"
                                value={formRiderData.phone_number}
                                onChange={handleRiderChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Password*
                            </label>
                            <input
                              type="password"
                              name="password"
                              value={formRiderData.password}
                              onChange={handleRiderChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Facility Information */}
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <svg className="w-5 h-5 text-[#554dc0] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Facility Information
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Facility City*
                            </label>
                            <Select
                              required
                              options={options}
                              isSearchable
                              value={options.find(
                                (option) => option.value === formRiderData?.facility_city
                              )}
                              onChange={(selectedOption) =>
                                setFormRiderData((prev) => ({
                                  ...prev,
                                  facility_city: selectedOption?.value || "",
                                }))
                              }
                              placeholder="Select City"
                              className="w-full border-gray-300 rounded-lg"
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  border: '1px solid #d1d5db',
                                  borderRadius: '0.5rem',
                                  padding: '0.25rem',
                                  '&:hover': {
                                    borderColor: '#d1d5db'
                                  }
                                })
                              }}
                            />
                          </div>

                          {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Facility Zone
                            </label>
                            <input
                              type="text"
                              name="facility_zone"
                              value={formRiderData.facility_zone}
                              onChange={handleRiderChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent"
                            />
                          </div> */}
                        </div>
                      </div>

                      {/* Address Information */}
                      {/* <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <svg className="w-5 h-5 text-[#554dc0] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Address Details
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Address
                            </label>
                            <input
                              type="text"
                              name="address_line"
                              value={formRiderData.address_line}
                              onChange={handleRiderChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                City
                              </label>
                              <input
                                type="text"
                                name="city"
                                value={formRiderData.city}
                                onChange={handleRiderChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                State
                              </label>
                              <input
                                type="text"
                                name="state"
                                value={formRiderData.state}
                                onChange={handleRiderChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pincode
                              </label>
                              <input
                                type="text"
                                name="pincode"
                                value={formRiderData.pincode}
                                onChange={handleRiderChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Country
                              </label>
                              <input
                                type="text"
                                name="country"
                                value={formRiderData.country}
                                onChange={handleRiderChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>
                      </div> */}

                      {/* Document Details */}
                      {/* <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <svg className="w-5 h-5 text-[#554dc0] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Document Details
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Document Type
                            </label>
                            <select
                              name="document_type"
                              value={formRiderData.document_type}
                              onChange={handleRiderChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent"
                            >
                              <option value="">Select Document Type</option>
                              <option value="aadhar">Aadhar</option>
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
                              value={formRiderData.document_id}
                              onChange={handleRiderChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#554dc0] focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Document Image
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#554dc0] transition-colors">
                              <input
                                type="file"
                                name="document_image"
                                onChange={handleRiderChange}
                                accept="image/*,application/pdf"
                                className="w-full"
                              />
                              <p className="text-sm text-gray-500 mt-2">Upload document image (PDF or Image)</p>
                            </div>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#554dc0] to-[#6b63ff] hover:from-[#4840a0] hover:to-[#5951d1] text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    >
                      Complete Onboarding
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        // <div className="bg-gray-100 min-h-screen w-full  flex flex-col justify-center items-center ">
        //     {/* Heading Strip */}
        //     <div className="mb-6 w-full flex flex-col justify-center items-center  bg-[rgb(85,77,192)] py-[24px] shadow-md h-38 px-[24px]">
        //       <div className="flex flex-wrap items-center justify-between">
        //         {/* Heading */}
        //         <h1 className="text-2xl mb-12 text-white">Onboarding</h1>

        //       </div>
        //     </div>
        //   <div className="mx-6 z-10  w-full flex  justify-center rounded-md">

        //     {/* Form Card */}
        //     <div className="max w-full justify-center -mt-20 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        //       {/* Rider Onboarding Form */}
        //       <form
        //         onSubmit={handleRiderSubmit}
        //         className="bg-white rounded-2xl w-[112.5%] shadow-lg p-8 space-y-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
        //       >
        //         <h1 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
        //           Rider Onboarding
        //         </h1>

        //         <div>
        //           <label className="block text-gray-700 font-medium mb-1">
        //             Rider Type*
        //           </label>
        //           <select
        //             name="rider_type"
        //             value={formRiderData.rider_type}
        //             onChange={handleRiderChange}
        //             className="w-full border border-gray-300 rounded-lg px-4 py-2"
        //             required
        //           >
        //             <option value="self">Self</option>
        //             <option value="vendor">Third Party Vendor</option>
        //           </select>
        //           {formRiderData.rider_type === "vendor" && (
        //             <div>
        //               <label className="block text-gray-700 font-medium mb-1 mt-6">
        //                 Vendor*
        //               </label>
        //               <select
        //                 name="vendor_id"
        //                 value={formRiderData.vendor_id}
        //                 onChange={handleRiderChange}
        //                 className="w-full border border-gray-300 rounded-lg px-4 py-2"
        //                 required
        //               >
        //                 <option value="">Select</option>
        //                 {vendorsData.map((vendor) => {
        //                   return (
        //                     <option value={vendor.id} key={vendor.id}>
        //                       FP{vendor.id} : {vendor.vendor_name}
        //                     </option>
        //                   );
        //                 })}
        //               </select>
        //             </div>
        //           )}
        //         </div>

        //         {/* Name */}

        //         <div>
        //           <label className="block text-gray-700 font-medium mb-1">
        //             Name*
        //           </label>
        //           <input
        //             type="text"
        //             name="name"
        //             value={formRiderData.name}
        //             onChange={handleRiderChange}
        //             className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(85,77,192)]"
        //             required
        //           />
        //         </div>

        //         {/* Email and Phone */}
        //         <div>
        //           <label className="block text-gray-700 font-medium mb-1">
        //             Email*
        //           </label>
        //           <input
        //             type="email"
        //             name="email"
        //             value={formRiderData.email}
        //             onChange={handleRiderChange}
        //             className="w-full border border-gray-300 rounded-lg px-4 py-2"
        //             required
        //           />
        //         </div>
        //         <div>
        //           <label className="block text-gray-700 font-medium mb-1">
        //             Phone Number*
        //           </label>
        //           <input
        //             type="text"
        //             name="phone_number"
        //             value={formRiderData.phone_number}
        //             onChange={handleRiderChange}
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
        //             value={formRiderData.password}
        //             onChange={handleRiderChange}
        //             className="w-full border border-gray-300 rounded-lg px-4 py-2"
        //             required
        //           />
        //         </div>

        //         {/* Facility City and Zone */}
        //         <div>

        //           <label className="block text-gray-700 font-medium mb-1">
        //             Facility City*
        //           </label>
        //           <Select
        //             required
        //             options={options}
        //             isSearchable
        //             value={options.find(
        //               (option) => option.value === formRiderData?.facility_city
        //             )}
        //             onChange={(selectedOption) =>
        //               setFormRiderData((prev) => ({
        //                 ...prev,
        //                 facility_city: selectedOption?.value || "",
        //               }))
        //             }
        //             placeholder="Select City"
        //             className="w-full border-gray-300 rounded-lg"
        //           />
        //         </div>

        //         <div>
        //           <label className="block text-gray-700 font-medium mb-1">
        //             Facility Zone
        //           </label>
        //           <input
        //             type="text"
        //             name="facility_zone"
        //             value={formRiderData.facility_zone}
        //             onChange={handleRiderChange}
        //             className="w-full border border-gray-300 rounded-lg px-4 py-2"
        //             //required
        //           />
        //         </div>

        //         {/* Address */}
        //         <div>
        //           <label className="block text-gray-700 font-medium mb-1">
        //             Address
        //           </label>
        //           <input
        //             type="text"
        //             name="address_line"
        //             value={formRiderData.address_line}
        //             onChange={handleRiderChange}
        //             className="w-full border border-gray-300 rounded-lg px-4 py-2"
        //           />
        //         </div>

        //         {/* Location Details */}
        //         <div>
        //           <label className="block text-gray-700 font-medium mb-1">
        //             City
        //           </label>
        //           <input
        //             type="text"
        //             name="city"
        //             value={formRiderData.city}
        //             onChange={handleRiderChange}
        //             className="w-full border border-gray-300 rounded-lg px-4 py-2"
        //           />
        //         </div>

        //         <div>
        //           <label className="block text-gray-700 font-medium mb-1">
        //             State
        //           </label>
        //           <input
        //             type="text"
        //             name="state"
        //             value={formRiderData.state}
        //             onChange={handleRiderChange}
        //             className="w-full border border-gray-300 rounded-lg px-4 py-2"
        //           />
        //         </div>

        //         <div>
        //           <label className="block text-gray-700 font-medium mb-1">
        //             Pincode
        //           </label>
        //           <input
        //             type="text"
        //             name="pincode"
        //             value={formRiderData.pincode}
        //             onChange={handleRiderChange}
        //             className="w-full border border-gray-300 rounded-lg px-4 py-2"
        //           />
        //         </div>

        //         <div>
        //           <label className="block text-gray-700 font-medium mb-1">
        //             Country
        //           </label>
        //           <input
        //             type="text"
        //             name="country"
        //             value={formRiderData.country}
        //             onChange={handleRiderChange}
        //             className="w-full border border-gray-300 rounded-lg px-4 py-2"
        //           />
        //         </div>

        //         {/* Document Details */}
        //         <div>
        //           <label className="block text-gray-700 font-medium mb-1">
        //             Document Type
        //           </label>
        //           <select
        //             name="document_type"
        //             value={formRiderData.document_type}
        //             onChange={handleRiderChange}
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
        //             value={formRiderData.document_id}
        //             onChange={handleRiderChange}
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
        //             onChange={handleRiderChange}
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

export default TechBasedOnBoarding;
