import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader";

import { TbFileInfo } from "react-icons/tb";
import { FaRegFileImage } from "react-icons/fa6";
import { FaRegCopy } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { toast } from "react-toastify";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
const baseURL = import.meta.env.VITE_BASE_URL;
const frontendURL = import.meta.env.VITE_FRONTEND_URL;

function MerchantDetails() {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [merchantsData, setMerchantsData] = useState([]);
  const [popup, setPopup] = useState(null);
  const [copySuccess, setCopySuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [changePasswordPopup, setChangePasswordPopup] = useState(null);
  const [newPassword, setNewPassword] = useState({
    id: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (e.target.type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      await axios.post(
        `${baseURL}/api/admin/updateMerchantInfo/${formData.id}`,
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
      fetchMerchants();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error while saving file");
    } finally {
      setLoading(false);
    }
  };

  const fetchMerchants = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/admin/getAllMerchants`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMerchantsData(res.data.merchants);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error fetching Merchants");
    } finally {
      setLoading(false);
    }
  };


  const changeStatus = async (id, status) => {
    setLoading(true);
    try {
      await axios.post(
        `${baseURL}/api/admin/updateMerchantStatus/${id}`,
        { is_active: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchMerchants();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error while changing status");
    } finally {
      setLoading(false);
    }
  };


  const handlePasswordChange = () => {
    setLoading(true);
    try {
      const res = axios.post(
        `${baseURL}/api/admin/changeMerchantPassword/${newPassword.id}`,
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

  const updateMerchantType = async (id) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/api/admin/updateMerchantAccountType/${id}`,
        {
          account_type: "main",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchMerchants();
      toast.success("Merchant type changed successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error updating merchant type");
    } finally {
      setLoading(false);
    }
  };

  const VerifyKyc = async (id) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/api/admin/verifyKycMerchant`,
        {
          merchant_id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPopup(null)
      fetchMerchants();
      toast.success(res?.data?.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Somthing went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMerchants();
  }, []);

  useEffect(() => {
    if (popup) {
      setFormData({ ...popup });
    }
  }, [popup]);

  return (
    <>

      <div className="bg-gray-50 dark:bg-gray-900  min-h-screen w-full">
        {/* Header */}
        <div className=" bg-[#0446DB] dark:bg-gray-900 py-6 shadow-lg">
          <div className=" mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Merchant Details</h1>
                <p className="text-indigo-100 mt-1">Manage and view merchant information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 relative z-10">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Container */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {[
                      "MERCHANT ID",
                      "MERCHANT NAME",
                      "EMAIL ID",
                      "ACCOUNT STATUS",
                      "DOCUMENT",
                      "CHANGE PASSWORD",
                      "INCOGNITO LOGIN",
                      "ACCOUNT TYPE"
                    ].map((header) => (
                      <TableHead
                        key={header}

                      >
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    loading ? (
                      <>
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                            <p className="mt-2">Loading orders...</p>
                          </TableCell>
                        </TableRow>
                      </>
                    ) : merchantsData.length == 0 ? (
                      <>
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-10">
                            No NDR found
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (

                      <>
                        {merchantsData?.map((merchant) => (
                          <TableRow
                            key={merchant.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 group"
                          >
                            {/* Merchant ID */}
                            <TableCell className="px-4 py-4">
                              <span className="font-mono text-sm text-gray-900 dark:text-white">#{merchant.id}</span>
                            </TableCell>

                            {/* Merchant Name */}
                            <TableCell className="px-4 py-4">
                              <div className="flex items-center">

                                <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">{merchant.name}</span>
                              </div>
                            </TableCell>

                            {/* Email */}
                            <TableCell className="px-4 py-4">
                              <span className="text-gray-600 text-sm dark:text-white">{merchant.email}</span>
                            </TableCell>

                            {/* Account Status Toggle */}
                            <TableCell className="px-4 py-4">
                              <button
                                onClick={() => changeStatus(merchant.id, merchant.is_active == 1 ? 0 : 1)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${merchant.is_active ? "bg-green-500" : "bg-gray-300"
                                  }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${merchant.is_active ? "translate-x-6" : "translate-x-1"
                                    }`}
                                />
                              </button>
                              <span className="ml-2 text-xs dark:text-white font-medium text-gray-600">
                                {merchant.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </TableCell>

                            {/* Document Info */}
                            <TableCell className="px-4 py-4">
                              <button
                                onClick={() => setPopup(merchant)}
                                className="p-2 text-gray-400 hover:text-[#554dc0] hover:bg-indigo-50 rounded-lg transition-colors duration-200 group"
                                title="View Documents"
                              >
                                <TbFileInfo className="text-xl group-hover:scale-110 transition-transform" />
                              </button>
                            </TableCell>

                            {/* Change Password */}
                            <TableCell className="px-4 py-4">
                              <button
                                onClick={() => {
                                  setNewPassword({ id: merchant.id });
                                  setChangePasswordPopup(merchant);
                                }}
                                className="px-3 py-1.5 whitespace-nowrap bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                              >
                                Change Password
                              </button>
                            </TableCell>

                            {/* Incognito Login */}
                            <TableCell className="px-4 py-4">
                              <a
                                href={`${frontendURL}/incognitoLogin/${localStorage.getItem("token")}/${merchant.email}/merchant`}
                                className="inline-flex whitespace-nowrap items-center px-3 py-1.5 bg-purple-50 text-purple-600 text-sm font-medium rounded-lg hover:bg-purple-100 transition-colors duration-200 border border-purple-200"
                                title="Right click and open in incognito"
                              >
                                <span>Incognito Login</span>
                              </a>
                            </TableCell>

                            {/* Account Type */}
                            <TableCell className="px-4 py-4">
                              {merchant.account_type === "test" ? (
                                <button
                                  onClick={() => updateMerchantType(merchant.id)}
                                  className="px-3 py-1 bg-amber-50 text-amber-700 text-sm font-medium rounded-full border border-amber-200 hover:bg-amber-100 transition-colors duration-200 cursor-pointer"
                                >
                                  Test
                                </button>
                              ) : merchant.account_type === "main" ? (
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-200">
                                  Main
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full border border-gray-200">
                                  NA
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )
                  }

                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Merchant Details Popup */}
        {popup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200 flex flex-col">
              {/* Header */}
              <div className="bg-[#0446DB] px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Merchant Details</h2>
                  <button
                    onClick={() => {
                      setPopup(null);
                      setFormData(null);
                      setIsEditing(false);
                    }}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSave} className="space-y-6">
                  {/* Key Information */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Merchant ID:</span>
                        <span className="ml-2 text-gray-900">#{popup.id}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-700">Merchant Key:</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(popup.merchant_key);
                            setCopySuccess(popup.merchant_key);
                            setTimeout(() => setCopySuccess(null), 2000);
                          }}
                          className="ml-2 flex items-center text-gray-600 hover:text-[#554dc0] transition-colors"
                        >
                          {copySuccess === popup.merchant_key ? (
                            <CiCircleCheck className="text-green-500 text-lg" />
                          ) : (
                            <FaRegCopy className="text-lg" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-700">Secret Key:</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(popup.secret_key);
                            setCopySuccess(popup.secret_key);
                            setTimeout(() => setCopySuccess(null), 2000);
                          }}
                          className="ml-2 flex items-center text-gray-600 hover:text-[#554dc0] transition-colors"
                        >
                          {copySuccess === popup.secret_key ? (
                            <CiCircleCheck className="text-green-500 text-lg" />
                          ) : (
                            <FaRegCopy className="text-lg" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Basic Details */}
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Basic Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: "Merchant Name", name: "name", value: formData?.name },
                        { label: "Phone No", name: "phone", value: formData?.phone },
                        { label: "Email", name: "email", value: formData?.email },
                        { label: "Company Name", name: "company_name", value: formData?.company_name },
                        { label: "Company Address", name: "company_address", value: formData?.company_address },
                        { label: "Company City", name: "company_city", value: formData?.company_city },
                        { label: "Company State", name: "company_state", value: formData?.company_state },
                        { label: "Company Pincode", name: "company_pincode", value: formData?.company_pincode },
                        { label: "Company GST No", name: "company_gst_number", value: formData?.company_gst_number },
                      ].map((field) => (
                        <div key={field.name}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                          </label>
                          <input
                            name={field.name}
                            value={field.value || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder={field.value || "NA"}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#554dc0] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                  </section>

                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-[rgb(85,77,192)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      KYC Details
                    </h3>

                    <div className="space-y-6">
                      {
                        (popup?.document_type || popup?.document_id) && (
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                              <span className="w-2 h-2 bg-[rgb(85,77,192)] rounded-full mr-2"></span>
                              Primary Document
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <div className="text-sm text-gray-500 mb-1">Company Type</div>
                                <div className="font-medium">{popup?.company_type || "N/A"}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500 mb-1">Document Type</div>
                                <div className="font-medium">{popup?.document_type || "N/A"}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500 mb-1">Document ID</div>
                                <div className="font-medium">{popup?.document_id || "N/A"}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500 mb-1">Document File</div>
                                {popup?.document_image ? (

                                  <>
                                    <a
                                      href={`${baseURL}/${popup?.document_image}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center text-[rgb(85,77,192)] hover:text-[rgb(75,67,182)] transition-colors"
                                    >
                                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                      View Document
                                    </a>


                                  </>
                                ) : (
                                  <span className="text-gray-400">No document uploaded</span>
                                )}
                              </div>

                            </div>
                            <div className=" flex mt-2 ">
                              {
                                popup?.kyc_verified === 0 ? (
                                  <div
                                    onClick={() => { VerifyKyc(popup?.id) }}
                                    className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Verify KYC
                                  </div>
                                ) : (
                                  <div
                                    className="flex justify-center whitespace-nowrap  items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg  transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    KYC completed Successfully.
                                  </div>
                                )
                              }
                            </div>
                          </div>
                        )
                      }


                      {/* Supporting Document */}
                      {
                        popup.supporting_document_id && (
                          <div className="bg-white rounded-lg p-4 mt-2 border border-gray-200">

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <div className="text-sm text-gray-500 mb-1">Company Type</div>
                                <div className="font-medium">{popup.company_type || "N/A"}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500 mb-1">Document Type</div>
                                <div className="font-medium">{popup.supporting_document_type || "N/A"}</div>
                              </div>


                              <div>
                                <div className="text-sm text-gray-500 mb-1">Document ID</div>
                                <div className="font-medium">{popup.supporting_document_id || "N/A"}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500 mb-1">Document File</div>
                                {popup.supporting_document_image ? (
                                  <div>
                                    <a
                                      href={`${baseURL}/${popup.supporting_document_image}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center text-[rgb(85,77,192)] hover:text-[rgb(75,67,182)] transition-colors"
                                    >
                                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                      View Document
                                    </a>

                                    <div className=" flex">
                                      {
                                        popup?.kyc_verified === 0 ? (
                                          <div
                                            onClick={() => { VerifyKyc(popup?.id) }}
                                            className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            Verify KYC
                                          </div>
                                        ) : (
                                          <div
                                            className="flex justify-center  whitespace-nowrap items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg  transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            KYC completed Successfully.
                                          </div>
                                        )
                                      }
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">No document uploaded</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      }

                    </div>
                  </div>

                  {/* Bank Details */}
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Bank Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: "Bank Name", name: "bank_name", value: formData?.bank_name },
                        { label: "Account No", name: "bank_account_number", value: formData?.bank_account_number },
                        { label: "Branch", name: "bank_branch", value: formData?.bank_branch },
                        { label: "IFSC Code", name: "bank_ifsc_code", value: formData?.bank_ifsc_code },
                      ].map((field) => (
                        <div key={field.name}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                          </label>
                          <input
                            name={field.name}
                            value={field.value || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder={field.value || "NA"}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#554dc0] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                          />
                        </div>
                      ))}

                      {/* Cheque Image */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cheque Image
                        </label>
                        {!isEditing ? (
                          <a
                            href={`${baseURL}/${popup.cheque_image}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <FaRegFileImage className="mr-2" />
                            View Cheque Image
                          </a>
                        ) : (
                          <input
                            type="file"
                            name="cheque_image"
                            onChange={handleChange}
                            accept="image/*,application/pdf"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#554dc0] focus:border-transparent file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700"
                          />
                        )}
                      </div>
                    </div>
                  </section>
                </form>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <div className="flex justify-end space-x-3">
                  {isEditing ? (
                    <>
                      <button
                        type="submit"
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(popup);
                          setIsEditing(false);
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
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
                      className="px-4 py-2 bg-[#0446DB] text-white rounded-lg hover:bg-[#4540a3] transition-colors font-medium"
                    >
                      Edit Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Popup - Keep your existing implementation */}
        {changePasswordPopup && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200">
              {/* Header */}
              <div className="bg-[rgb(85,77,192)]  px-6 py-4">
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
                className="px-6 py-6 bg-white dark:bg-gray-900 space-y-6"
              >
                {/* User Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <label className="block font-medium mb-1 dark:text-white">ID:</label>
                    <p className="bg-gray-100 p-2 rounded">
                      {changePasswordPopup.id}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium dark:text-white mb-1">
                      Merchant Name:
                    </label>
                    <p className="bg-gray-100 p-2 rounded">
                      {changePasswordPopup.name}
                    </p>
                  </div>
                </div>

                {/* Password Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium dark:text-white mb-1">
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
                      className="w-full border px-3 dark:bg-white py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium dark:text-white mb-1">
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
                      className="w-full border dark:bg-white px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
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

    </>
  );
}

export default MerchantDetails;
