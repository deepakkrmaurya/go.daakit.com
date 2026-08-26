import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Loader from "../../Loader";

import { TbFileInfo } from "react-icons/tb";
import { FaRegFileImage } from "react-icons/fa6";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_BASE_URL;

const options = [
  { value: "Bangalore", label: "Bangalore" },
  { value: "Delhi", label: "Delhi" },
  { value: "Gurugram", label: "Gurugram" },
  { value: "Noida", label: "Noida" },
];

function TechBasedRiderStats() {
  const [ridersData, setRidersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const [changePasswordPopup, setChangePasswordPopup] = useState(null);
  const [newPassword, setNewPassword] = useState({
    id: "",
    password: "",
    confirmPassword: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [advanceFilters, setAdvanceFilters] = useState({
    rider_id: "",
    facility_city: "",
    facility_zone: "",
  });
  const [filterUpdate, setFilterUpdate] = useState(false);

  const resetAdvanceFilters = () => {
    setAdvanceFilters({
      rider_id: "",
      facility_city: "",
      facility_zone: "",
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (e.target.type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const kycVerify = async (kyc) => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append('kyc_verified', Number(kyc))
      await axios.post(
        `${baseURL}/api/techbasedmerchant/updateRiderStatsProfile/${formData.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsEditing(false);
      setPopup(null);
      fetchRiders();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error saving data");
    } finally {
      setLoading(false);
    }
  }
  //Change
  const handleSave = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      await axios.post(
        `${baseURL}/api/techbasedmerchant/updateRiderStatsProfile/${formData.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsEditing(false);
      setPopup(null);
      fetchRiders();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error saving data");
    } finally {
      setLoading(false);
    }
  };

  const fetchRiders = useCallback(async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${baseURL}/api/techbasedmerchant/getMerchantRiders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });


      setRidersData(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error fetching riders");
    } finally {
      setLoading(false);
    }
  }, [advanceFilters, baseURL]);

  const changeVerificationStatus = async (id, status) => {
    setLoading(true);
    try {
      await axios.put(
        `${baseURL}/api/techbasedmerchant/markRiderVerified/${id}`,
        {
          account_status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchRiders();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error while changing status");
    } finally {
      setLoading(false);
    }
  };

  const changeActiveStatus = async (id, status) => {
    setLoading(true);
    try {
      await axios.put(
        `${baseURL}/api/techbasedmerchant/markRiderActive/${id}`,
        {
          is_active: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchRiders();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error while changing status");
    } finally {
      setLoading(false);
    }
  };

  const changeAvailabilityStatus = async (id, status) => {
    setLoading(true);
    try {
      await axios.put(
        `${baseURL}/api/techbasedmerchant/markRiderAvailable/${id}`,
        {
          is_available: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchRiders();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error while changing status");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = () => {
    setLoading(true);
    try {
      const res = axios.put(
        `${baseURL}/api/vendor/changeRiderPassword/${newPassword.id}`,
        {
          password: newPassword.password,
          confirmPassword: newPassword.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setChangePasswordPopup(null);
      setNewPassword({
        id: "",
        password: "",
        newPassword: "",
      });
      toast.success("Password Changed successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error in updating password");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  useEffect(() => {
    if (popup) {
      setFormData({ ...popup });
    }
  }, [popup]);

  useEffect(() => {
    if (filterUpdate) {
      fetchRiders();
      setFilterUpdate(false);
    }
  }, [filterUpdate]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-[#EEEEEE] min-h-screen w-full">
          {/* Right Sidebar for filters */}
          <div
            className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isFilterOpen ? "translate-x-0" : "translate-x-full"
              }`}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Advance Filters</h2>
              <button
                onClick={() => {
                  setIsFilterOpen(false);
                }}
                className="text-gray-500 hover:text-black text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap items-end gap-4">
                {/* Rider ID */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Rider ID
                  </label>
                  <input
                    type="text"
                    value={advanceFilters.rider_id}
                    onChange={(e) =>
                      setAdvanceFilters((prev) => ({
                        ...prev,
                        rider_id: e.target.value,
                      }))
                    }
                    placeholder="Enter Id(s)"
                    className="border px-3 py-1 rounded-md text-sm"
                  />
                </div>

                {/* Facility City */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Facility City
                  </label>
                  <Select
                    required
                    options={options}
                    isSearchable
                    value={options.find(
                      (option) => option.value === advanceFilters?.facility_city
                    )}
                    onChange={(selectedOption) =>
                      setAdvanceFilters((prev) => ({
                        ...prev,
                        facility_city: selectedOption?.value || "",
                      }))
                    }
                    placeholder="Select City"
                    className="border rounded-md text-sm w-[148%] h-[60%]"
                  />
                </div>

                {/* Facility Zone */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Facility Zone
                  </label>
                  <input
                    type="text"
                    value={advanceFilters.facility_zone}
                    onChange={(e) =>
                      setAdvanceFilters((prev) => ({
                        ...prev,
                        facility_zone: e.target.value,
                      }))
                    }
                    placeholder="Enter Facility Zone"
                    className="border px-3 py-1 rounded-md text-sm"
                  />
                </div>

                {/* Update Button */}
                <div>
                  <button
                    onClick={() => {
                      setFilterUpdate(true);
                      setIsFilterOpen(false);
                    }}
                    className="bg-[rgb(85,77,192)] text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
                  >
                    Filter
                  </button>
                  <button
                    onClick={() => {
                      resetAdvanceFilters();
                      setFilterUpdate(true);
                      setIsFilterOpen(false);
                    }}
                    className="bg-[rgb(85,77,192)] text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Heading Strip */}
          <div className="mb-6 bg-[rgb(85,77,192)] py-[24px] shadow-md h-38 px-[24px]">
            <div className="flex flex-wrap items-center justify-between">
              {/* Heading */}
              <h1 className="text-2xl text-white">Rider Details</h1>
              <div className="flex flex-wrap items-end gap-4 text-white">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="bg-white text-[rgb(85,77,192)] font-medium px-5 py-2 rounded-lg shadow hover:bg-indigo-100 transition"
                >
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="mx-6 z-10 bg-white rounded-md">
            <div className="max-w-full -mt-20 relative z-10">
              <table className="min-w-full divide-y divide-gray-200 text-left ">
                <thead className="bg-gray-100 text-gray-600 text-sm font-semibold text-center">
                  <tr>
                    <th className="px-6 py-3">RIDER ID</th>
                    <th className="px-6 py-3">RIDER NAME</th>
                    <th className="px-6 py-3">ACCOUNT STATUS</th>
                    <th className="px-6 py-3">ACTIVE</th>
                    <th className="px-6 py-3">AVAILABLE</th>
                    <th className="px-6 py-3">RIDER DOCUMENT</th>
                    <th className="px-6 py-3">CHANGE PASSWORD</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 divide-y divide-gray-200">
                  {ridersData.map((rider) => (
                    <tr
                      key={rider.id}
                      className="hover:bg-gray-50 transition-colors duration-200 text-center"
                    >
                      <td className="px-6 py-4">
                        M{rider.vendor_id}_{rider.id}
                      </td>
                      <td className="px-6 py-4">{rider.name}</td>
                      <td className="">
                        <button
                          onClick={() => {
                            changeVerificationStatus(
                              rider.id,
                              rider.account_status == 1 ? 0 : 1
                            );
                          }}
                          className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-200 ${rider.account_status ? "bg-green-500" : "bg-gray-300"
                            }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${rider.account_status
                              ? "translate-x-6 sm:translate-x-7"
                              : "translate-x-1"
                              }`}
                          />
                        </button>
                      </td>
                      <td className="">
                        <button
                          onClick={() => {
                            if (rider.account_status) {
                              changeActiveStatus(
                                rider.id,
                                rider.is_active == 1 ? 0 : 1
                              );
                            }
                          }}
                          className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-200 ${rider.is_active ? "bg-green-500" : "bg-gray-300"
                            }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${rider.is_active
                              ? "translate-x-6 sm:translate-x-7"
                              : "translate-x-1"
                              }`}
                          />
                        </button>
                      </td>
                      <td className="">
                        <button
                          onClick={() => {
                            if (rider.account_status && rider.is_active) {
                              changeAvailabilityStatus(
                                rider.id,
                                rider.is_available == 1 ? 0 : 1
                              );
                            }
                          }}
                          className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-200 ${rider.is_available ? "bg-green-500" : "bg-gray-300"
                            }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${rider.is_available
                              ? "translate-x-6 sm:translate-x-7"
                              : "translate-x-1"
                              }`}
                          />
                        </button>
                      </td>

                      <td
                        className="pl-25 text-2xl hover:text-gray-500 hover:cursor-pointer hover:text-3xl"
                        onClick={() => {
                          setPopup(rider);
                        }}
                      >
                        <TbFileInfo />
                      </td>

                      <td>
                        <button
                          className="px-2 py-1 bg-blue-100 text-blue-500 rounded-2xl hover:cursor-pointer hover:bg-blue-200"
                          onClick={() => {
                            setNewPassword({
                              id: rider.id,
                            });
                            setChangePasswordPopup(rider);
                          }}
                        >
                          Change Password
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {popup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden border border-gray-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#554dc0] to-[#6b63ce] pt-5 pb-4 px-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Rider Details</h2>
                    <div className="flex items-center space-x-2">
                      <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                        ID: M{popup?.merchant_id}_R{popup.id}
                      </span>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                  className="px-6 py-4 space-y-6 bg-white max-h-[75vh] overflow-y-auto"
                >
                  {/* Status Indicators */}
                  <div className="flex flex-wrap gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${popup.account_status ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm font-medium">
                        {popup.account_status ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${popup.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm font-medium">
                        {popup.is_active ? 'Active' : 'Not Active'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${popup.is_available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm font-medium">
                        {popup.is_available ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${popup.kyc_verified == '1' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm font-medium">
                        {popup.kyc_verified == '1' ? 'KYC Verified' : 'KYC Not Verified'}
                      </span>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <section className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-1 h-5 bg-[#554dc0] mr-2 rounded"></div>
                      <h3 className="text-lg font-semibold text-gray-800">Basic Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Rider Name</label>
                        <input
                          name="name"
                          value={formData?.name || ""}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder={formData?.name || "NA"}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${!isEditing ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white"
                            }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Phone No</label>
                        <input
                          name="phone"
                          value={formData?.phone || ""}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder={formData?.phone || "NA"}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${!isEditing ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white"
                            }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                          name="email"
                          value={formData?.email || ""}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder={formData?.email || "NA"}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${!isEditing ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white"
                            }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Address</label>
                        <input
                          name="address_line"
                          value={formData?.address_line || ""}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder={formData?.address_line || "NA"}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${!isEditing ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white"
                            }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">City</label>
                        <input
                          name="city"
                          value={formData?.city || ""}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder={formData?.city || "NA"}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${!isEditing ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white"
                            }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">State</label>
                        <input
                          name="state"
                          value={formData?.state || ""}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder={formData?.state || "NA"}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${!isEditing ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white"
                            }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Pincode</label>
                        <input
                          name="pincode"
                          value={formData?.pincode || ""}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder={formData?.pincode || "NA"}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${!isEditing ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white"
                            }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Facility City</label>
                        <Select
                          isDisabled={!isEditing}
                          required
                          options={options}
                          isSearchable
                          value={options.find(
                            (option) => option.value === formData?.facility_city
                          )}
                          onChange={(selectedOption) =>
                            setFormData((prev) => ({
                              ...prev,
                              facility_city: selectedOption?.value || "",
                            }))
                          }
                          placeholder={formData?.facility_city || "NA"}
                          className="border rounded-lg text-sm w-full"
                          styles={{
                            control: (base) => ({
                              ...base,
                              padding: '2px',
                              borderRadius: '8px',
                              borderColor: !isEditing ? '#e5e7eb' : '#d1d5db',
                              backgroundColor: !isEditing ? '#f3f4f6' : 'white',
                            })
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Facility Zone</label>
                        <input
                          name="facility_zone"
                          value={formData?.facility_zone || ""}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder={formData?.facility_zone || "NA"}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${!isEditing ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white"
                            }`}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Document Info */}
                  <section className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-1 h-5 bg-[#554dc0] mr-2 rounded"></div>
                      <h3 className="text-lg font-semibold text-gray-800">KYC Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Document Type</label>
                        <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg">
                          {popup.document_type || "N/A"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Document ID</label>
                        <input
                          name="document_id"
                          value={formData?.document_id || ""}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder={formData?.document_id || "NA"}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${!isEditing ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white"
                            }`} />
                        {/* {popup.document_id || "N/A"} */}

                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Document File</label>
                        <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg">
                          {popup.document_image ? (
                            <a
                              href={`${baseURL}/${popup.document_image}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-[#554dc0] hover:text-[#4038a0] hover:underline transition"
                            >
                              <FaRegFileImage className="mr-2" />
                              View Document
                            </a>
                          ) : (
                            <div className="flex items-center text-gray-500">
                              <FaRegFileImage className="mr-2" />
                              No Document Available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {
                      <div
                        onClick={() => kycVerify(popup?.kyc_verified == 0 ? "1" : "1")}
                        className={`
    inline-flex items-center gap-2 px-4 mt-5 py-2 rounded-xl cursor-pointer
    transition-all duration-300 shadow-sm
    ${popup?.kyc_verified == 1
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-red-500 hover:bg-red-600 text-white"}
  `}
                      >
                        {popup?.kyc_verified == 1 ? (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            KYC Verified
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pending Verify
                          </>
                        )}
                      </div>

                    }
                  </section>

                  {/* Bank Info */}
                  <section className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-1 h-5 bg-[#554dc0] mr-2 rounded"></div>
                      <h3 className="text-lg font-semibold text-gray-800">Bank Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Bank Name</label>
                        <input
                          name="bank_name"
                          value={formData?.bank_name || ""}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder={formData?.bank_name || "NA"}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${!isEditing ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white"
                            }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Account Number</label>
                        <input
                          name="bank_account_number"
                          value={formData?.bank_account_number || ""}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder={formData?.bank_account_number || "NA"}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${!isEditing ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white"
                            }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Branch</label>
                        <input
                          name="bank_branch"
                          value={formData?.bank_branch || ""}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder={formData?.bank_branch || "NA"}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${!isEditing ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white"
                            }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">IFSC Code</label>
                        <input
                          name="bank_ifsc_code"
                          value={formData?.bank_ifsc_code || ""}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder={formData?.bank_ifsc_code || "NA"}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${!isEditing ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white"
                            }`}
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">
                          {!isEditing ? "Cheque Image" : "Upload Cheque Image"}
                        </label>
                        {!isEditing ? (
                          <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg">
                            {/* popup.cheque_image */}
                            {popup.cheque_image ? (
                              <div>
                                <a
                                  href={`${baseURL}/${popup.cheque_image}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-[#554dc0] hover:text-[#4038a0] hover:underline transition"
                                >
                                  <FaRegFileImage className="mr-2" />
                                  View Cheque Image
                                </a>



                              </div>
                            ) : (
                              <div className="flex items-center text-gray-500">
                                <FaRegFileImage className="mr-2" />
                                No Cheque Image Available
                              </div>
                            )}
                          </div>
                        ) : (
                          <input
                            type="file"
                            name="cheque_image"
                            onChange={handleChange}
                            disabled={!isEditing}
                            accept="image/*,application/pdf"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition"
                          />
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Footer Buttons */}
                  <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-gray-200">
                    {isEditing ? (
                      <>
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition font-medium flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(popup);
                            setIsEditing(false);
                          }}
                          className="bg-gray-500 text-white px-5 py-2.5 rounded-lg hover:bg-gray-600 transition font-medium"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(true);
                          setFormData(popup);
                        }}
                        className="bg-[#554dc0] text-white px-5 py-2.5 rounded-lg hover:bg-[#4038a0] transition font-medium flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Details
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setPopup(null);
                        setFormData(null);
                        setIsEditing(false);
                      }}
                      className="bg-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-400 transition font-medium"
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {changePasswordPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="bg-[rgb(85,77,192)] px-6 py-4">
                  <h2 className="text-2xl font-semibold text-white text-center">
                    Change Password
                  </h2>
                </div>

                {/* Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePasswordChange();
                  }}
                  className="px-6 py-6 bg-white space-y-6"
                >
                  {/* User Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <label className="block font-medium mb-1">ID:</label>
                      <p className="bg-gray-100 p-2 rounded">
                        {changePasswordPopup.id}
                      </p>
                    </div>
                    <div>
                      <label className="block font-medium mb-1">
                        Rider Name:
                      </label>
                      <p className="bg-gray-100 p-2 rounded">
                        {changePasswordPopup.name}
                      </p>
                    </div>
                  </div>

                  {/* Password Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={newPassword.password}
                        onChange={(e) =>
                          setNewPassword({
                            ...newPassword,
                            password: e.target.value,
                          })
                        }
                        required
                        className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={newPassword.confirmPassword}
                        onChange={(e) =>
                          setNewPassword({
                            ...newPassword,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                        className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="submit"
                      className="bg-[rgb(85,77,192)] text-white px-5 py-2 rounded-md hover:bg-indigo-800 transition"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setChangePasswordPopup(null);
                        setNewPassword(null);
                      }}
                      className="bg-gray-200 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-300 transition"
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default TechBasedRiderStats;
