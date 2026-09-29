// import { useEffect, useState } from "react";
// import axios from "axios";
// import { TbFileInfo } from "react-icons/tb";
// import { FaRegFileImage } from "react-icons/fa6";
// import { FaRegCopy } from "react-icons/fa";
// import { CiCircleCheck } from "react-icons/ci";
// import { toast } from "react-toastify";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Loader2 } from "lucide-react";
// const baseURL = import.meta.env.VITE_BASE_URL;
// const frontendURL = import.meta.env.VITE_FRONTEND_URL;

// function MerchantDetails() {
//   const [showPassword, setShowPassword] = useState({
//     password: false,
//     confirmPassword: false,
//   });

//   const [loading, setLoading] = useState(false);
//   const [merchantsData, setMerchantsData] = useState([]);
//   const [popup, setPopup] = useState(null);
//   const [copySuccess, setCopySuccess] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState(null);
//   const [changePasswordPopup, setChangePasswordPopup] = useState(null);
//   const [newPassword, setNewPassword] = useState({
//     id: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (e.target.type === "file") {
//       setFormData({ ...formData, [name]: files[0] });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       const data = new FormData();
//       for (const key in formData) {
//         data.append(key, formData[key]);
//       }

//       await axios.post(
//         `${baseURL}/api/admin/updateMerchantInfo/${formData.id}`,
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       setIsEditing(false);
//       setPopup(null);
//       fetchMerchants();
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Error while saving file");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchMerchants = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${baseURL}/api/admin/getAllMerchants`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setMerchantsData(res.data.merchants);
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Error fetching Merchants");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const changeStatus = async (id, status) => {
//     setLoading(true);
//     try {
//       await axios.post(
//         `${baseURL}/api/admin/updateMerchantStatus/${id}`,
//         { is_active: status },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       fetchMerchants();
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Error while changing status");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handlePasswordChange = () => {
//     setLoading(true);
//     try {
//       const res = axios.post(
//         `${baseURL}/api/admin/changeMerchantPassword/${newPassword.id}`,
//         {
//           password: newPassword.password,
//           confirmPassword: newPassword.confirmPassword,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setChangePasswordPopup(null);
//       setNewPassword({
//         id: "",
//         password: "",
//         newPassword: "",
//       });
//       toast.success("Password Changed successfully");
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Error in updating password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateMerchantType = async (id) => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${baseURL}/api/admin/updateMerchantAccountType/${id}`,
//         {
//           account_type: "main",
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       fetchMerchants();
//       toast.success("Merchant type changed successfully");
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Error updating merchant type");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const VerifyKyc = async (id) => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${baseURL}/api/admin/verifyKycMerchant`,
//         {
//           merchant_id: id,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setPopup(null)
//       fetchMerchants();
//       toast.success(res?.data?.message);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Somthing went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchMerchants();
//   }, []);

//   useEffect(() => {
//     if (popup) {
//       setFormData({ ...popup });
//     }
//   }, [popup]);


//   const [loadingPage, setLoadingPage] = useState(true);

// useEffect(() => {
//   const timer = setTimeout(() => {
//     setLoadingPage(false);
//   }, 2000);

//   return () => clearTimeout(timer);
// }, []);

//   return (
//     <>

//     {
//       loadingPage ? (
//          <div className=" w-full h-[90vh] flex justify-center items-center">
//                   <div>
//                     <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//                     <p className="mt-2"> Loading Merchant Details...</p>
//                   </div>
//                 </div>
//       ):(

//       <div className="bg-[#f5f8fb] dark:bg-neutral-900  min-h-screen w-full">
//         {/* Header */}
//         <div className=" dark:bg-neutral-900py-6 ">
//           <div className=" mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-2xl md:text-3xl font-bold dark:text-white">Merchant Details</h1>
//                 <p className="dark:text-indigo-100 mt-1">Manage and view merchant information</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="">
//           <div className="bg-white dark:bg-neutral-900 rounded-sm  overflow-hidden">
//             {/* Table Container */}
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     {[
//                       "MERCHANT ID",
//                       "MERCHANT NAME",
//                       "EMAIL ID",
//                       "ACCOUNT STATUS",
//                       "DOCUMENT",
//                       "CHANGE PASSWORD",
//                       "INCOGNITO LOGIN",
//                       "ACCOUNT TYPE"
//                     ].map((header) => (
//                       <TableHead
//                         key={header}

//                       >
//                         {header}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {
//                     loading ? (
//                       <>
//                         <TableRow>
//                           <TableCell colSpan={10} className="text-center py-10">
//                             <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//                             <p className="mt-2">Loading orders...</p>
//                           </TableCell>
//                         </TableRow>
//                       </>
//                     ) : merchantsData.length == 0 ? (
//                       <>
//                         <TableRow>
//                           <TableCell colSpan={10} className="text-center py-10">
//                             No NDR found
//                           </TableCell>
//                         </TableRow>
//                       </>
//                     ) : (

//                       <>
//                         {merchantsData?.map((merchant) => (
//                           <TableRow
//                             key={merchant.id}
//                             className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 group"
//                           >
//                             {/* Merchant ID */}
//                             <TableCell className="px-4 py-4">
//                               <span className="font-mono text-sm text-gray-900 dark:text-white">#{merchant.id}</span>
//                             </TableCell>

//                             {/* Merchant Name */}
//                             <TableCell className="px-4 py-4">
//                               <div className="flex items-center">

//                                 <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">{merchant.name}</span>
//                               </div>
//                             </TableCell>

//                             {/* Email */}
//                             <TableCell className="px-4 py-4">
//                               <span className="text-gray-600 text-sm dark:text-white">{merchant.email}</span>
//                             </TableCell>

//                             {/* Account Status Toggle */}
//                             <TableCell className="px-4 py-4">
//                               <button
//                                 onClick={() => changeStatus(merchant.id, merchant.is_active == 1 ? 0 : 1)}
//                                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${merchant.is_active ? "bg-green-500" : "bg-gray-300"
//                                   }`}
//                               >
//                                 <span
//                                   className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${merchant.is_active ? "translate-x-6" : "translate-x-1"
//                                     }`}
//                                 />
//                               </button>
//                               <span className="ml-2 text-xs dark:text-white font-medium text-gray-600">
//                                 {merchant.is_active ? 'Active' : 'Inactive'}
//                               </span>
//                             </TableCell>

//                             {/* Document Info */}
//                             <TableCell className="px-4 py-4">
//                               <button
//                                 onClick={() => setPopup(merchant)}
//                                 className="p-2 text-gray-400 hover:text-[#554dc0] hover:bg-indigo-50 rounded-lg transition-colors duration-200 group"
//                                 title="View Documents"
//                               >
//                                 <TbFileInfo className="text-xl group-hover:scale-110 transition-transform" />
//                               </button>
//                             </TableCell>

//                             {/* Change Password */}
//                             <TableCell className="px-4 py-4">
//                               <button
//                                 onClick={() => {
//                                   setNewPassword({ id: merchant.id });
//                                   setChangePasswordPopup(merchant);
//                                 }}
//                                 className="px-3 py-1.5 whitespace-nowrap bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
//                               >
//                                 Change Password
//                               </button>
//                             </TableCell>

//                             {/* Incognito Login */}
//                             <TableCell className="px-4 py-4">
//                               <a
//                                 href={`${frontendURL}/incognitoLogin/${localStorage.getItem("token")}/${merchant.email}/merchant`}
//                                 className="inline-flex whitespace-nowrap items-center px-3 py-1.5 bg-purple-50 text-purple-600 text-sm font-medium rounded-lg hover:bg-purple-100 transition-colors duration-200 border border-purple-200"
//                                 title="Right click and open in incognito"
//                               >
//                                 <span>Incognito Login</span>
//                               </a>
//                             </TableCell>

//                             {/* Account Type */}
//                             <TableCell className="px-4 py-4">
//                               {merchant.account_type === "test" ? (
//                                 <button
//                                   onClick={() => updateMerchantType(merchant.id)}
//                                   className="px-3 py-1 bg-amber-50 text-amber-700 text-sm font-medium rounded-full border border-amber-200 hover:bg-amber-100 transition-colors duration-200 cursor-pointer"
//                                 >
//                                   Test
//                                 </button>
//                               ) : merchant.account_type === "main" ? (
//                                 <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-200">
//                                   Main
//                                 </span>
//                               ) : (
//                                 <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full border border-gray-200">
//                                   NA
//                                 </span>
//                               )}
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </>
//                     )
//                   }

//                 </TableBody>
//               </Table>
//             </div>
//           </div>
//         </div>

//         {/* Merchant Details Popup */}
//         {popup && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200 flex flex-col">
//               {/* Header */}
//               <div className="bg-[#0446DB] px-6 py-4">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-xl font-bold text-white">Merchant Details</h2>
//                   <button
//                     onClick={() => {
//                       setPopup(null);
//                       setFormData(null);
//                       setIsEditing(false);
//                     }}
//                     className="text-white hover:text-gray-200 transition-colors"
//                   >
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//               {/* Content */}
//               <div className="flex-1 overflow-y-auto p-6">
//                 <form onSubmit={handleSave} className="space-y-6">
//                   {/* Key Information */}
//                   <div className="bg-gray-50 rounded-lg p-4 mb-6">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                       <div>
//                         <span className="font-semibold text-gray-700">Merchant ID:</span>
//                         <span className="ml-2 text-gray-900">#{popup.id}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <span className="font-semibold text-gray-700">Merchant Key:</span>
//                         <button
//                           type="button"
//                           onClick={() => {
//                             navigator.clipboard.writeText(popup.merchant_key);
//                             setCopySuccess(popup.merchant_key);
//                             setTimeout(() => setCopySuccess(null), 2000);
//                           }}
//                           className="ml-2 flex items-center text-gray-600 hover:text-[#554dc0] transition-colors"
//                         >
//                           {copySuccess === popup.merchant_key ? (
//                             <CiCircleCheck className="text-green-500 text-lg" />
//                           ) : (
//                             <FaRegCopy className="text-lg" />
//                           )}
//                         </button>
//                       </div>
//                       <div className="flex items-center">
//                         <span className="font-semibold text-gray-700">Secret Key:</span>
//                         <button
//                           type="button"
//                           onClick={() => {
//                             navigator.clipboard.writeText(popup.secret_key);
//                             setCopySuccess(popup.secret_key);
//                             setTimeout(() => setCopySuccess(null), 2000);
//                           }}
//                           className="ml-2 flex items-center text-gray-600 hover:text-[#554dc0] transition-colors"
//                         >
//                           {copySuccess === popup.secret_key ? (
//                             <CiCircleCheck className="text-green-500 text-lg" />
//                           ) : (
//                             <FaRegCopy className="text-lg" />
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Basic Details */}
//                   <section>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
//                       Basic Details
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {[
//                         { label: "Merchant Name", name: "name", value: formData?.name },
//                         { label: "Phone No", name: "phone", value: formData?.phone },
//                         { label: "Email", name: "email", value: formData?.email },
//                         { label: "Company Name", name: "company_name", value: formData?.company_name },
//                         { label: "Company Address", name: "company_address", value: formData?.company_address },
//                         { label: "Company City", name: "company_city", value: formData?.company_city },
//                         { label: "Company State", name: "company_state", value: formData?.company_state },
//                         { label: "Company Pincode", name: "company_pincode", value: formData?.company_pincode },
//                         { label: "Company GST No", name: "company_gst_number", value: formData?.company_gst_number },
//                       ].map((field) => (
//                         <div key={field.name}>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             {field.label}
//                           </label>
//                           <input
//                             name={field.name}
//                             value={field.value || ""}
//                             onChange={handleChange}
//                             disabled={!isEditing}
//                             placeholder={field.value || "NA"}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#554dc0] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   </section>

//                   <div className="bg-gray-50 rounded-sm p-6 border border-gray-100">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                       <svg className="w-5 h-5 mr-2 text-[rgb(85,77,192)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                       </svg>
//                       KYC Details
//                     </h3>

//                     <div className="space-y-6">
//                       {
//                         (popup?.document_type || popup?.document_id) && (
//                           <div className="bg-white rounded-lg p-4 border border-gray-200">
//                             <h4 className="font-medium text-gray-700 mb-3 flex items-center">
//                               <span className="w-2 h-2 bg-[rgb(85,77,192)] rounded-full mr-2"></span>
//                               Primary Document
//                             </h4>
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                               <div>
//                                 <div className="text-sm text-gray-500 mb-1">Company Type</div>
//                                 <div className="font-medium">{popup?.company_type || "N/A"}</div>
//                               </div>
//                               <div>
//                                 <div className="text-sm text-gray-500 mb-1">Document Type</div>
//                                 <div className="font-medium">{popup?.document_type || "N/A"}</div>
//                               </div>
//                               <div>
//                                 <div className="text-sm text-gray-500 mb-1">Document ID</div>
//                                 <div className="font-medium">{popup?.document_id || "N/A"}</div>
//                               </div>
//                               <div>
//                                 <div className="text-sm text-gray-500 mb-1">Document File</div>
//                                 {popup?.document_image ? (

//                                   <>
//                                     <a
//                                       href={`${baseURL}/${popup?.document_image}`}
//                                       target="_blank"
//                                       rel="noopener noreferrer"
//                                       className="inline-flex items-center text-[rgb(85,77,192)] hover:text-[rgb(75,67,182)] transition-colors"
//                                     >
//                                       <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                       </svg>
//                                       View Document
//                                     </a>


//                                   </>
//                                 ) : (
//                                   <span className="text-gray-400">No document uploaded</span>
//                                 )}
//                               </div>

//                             </div>
//                             <div className=" flex mt-2 ">
//                               {
//                                 popup?.kyc_verified === 0 ? (
//                                   <div
//                                     onClick={() => { VerifyKyc(popup?.id) }}
//                                     className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-blue-700 transition-colors">
//                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                                     </svg>
//                                     Verify KYC
//                                   </div>
//                                 ) : (
//                                   <div
//                                     className="flex justify-center whitespace-nowrap  items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg  transition-colors">
//                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                                     </svg>
//                                     KYC completed Successfully.
//                                   </div>
//                                 )
//                               }
//                             </div>
//                           </div>
//                         )
//                       }


//                       {/* Supporting Document */}
//                       {
//                         popup.supporting_document_id && (
//                           <div className="bg-white rounded-lg p-4 mt-2 border border-gray-200">

//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                               <div>
//                                 <div className="text-sm text-gray-500 mb-1">Company Type</div>
//                                 <div className="font-medium">{popup.company_type || "N/A"}</div>
//                               </div>
//                               <div>
//                                 <div className="text-sm text-gray-500 mb-1">Document Type</div>
//                                 <div className="font-medium">{popup.supporting_document_type || "N/A"}</div>
//                               </div>


//                               <div>
//                                 <div className="text-sm text-gray-500 mb-1">Document ID</div>
//                                 <div className="font-medium">{popup.supporting_document_id || "N/A"}</div>
//                               </div>
//                               <div>
//                                 <div className="text-sm text-gray-500 mb-1">Document File</div>
//                                 {popup.supporting_document_image ? (
//                                   <div>
//                                     <a
//                                       href={`${baseURL}/${popup.supporting_document_image}`}
//                                       target="_blank"
//                                       rel="noopener noreferrer"
//                                       className="inline-flex items-center text-[rgb(85,77,192)] hover:text-[rgb(75,67,182)] transition-colors"
//                                     >
//                                       <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                       </svg>
//                                       View Document
//                                     </a>

//                                     <div className=" flex">
//                                       {
//                                         popup?.kyc_verified === 0 ? (
//                                           <div
//                                             onClick={() => { VerifyKyc(popup?.id) }}
//                                             className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-blue-700 transition-colors">
//                                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                                             </svg>
//                                             Verify KYC
//                                           </div>
//                                         ) : (
//                                           <div
//                                             className="flex justify-center  whitespace-nowrap items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg  transition-colors">
//                                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                                             </svg>
//                                             KYC completed Successfully.
//                                           </div>
//                                         )
//                                       }
//                                     </div>
//                                   </div>
//                                 ) : (
//                                   <span className="text-gray-400">No document uploaded</span>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         )
//                       }

//                     </div>
//                   </div>

//                   {/* Bank Details */}
//                   <section>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
//                       Bank Details
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {[
//                         { label: "Bank Name", name: "bank_name", value: formData?.bank_name },
//                         { label: "Account No", name: "bank_account_number", value: formData?.bank_account_number },
//                         { label: "Branch", name: "bank_branch", value: formData?.bank_branch },
//                         { label: "IFSC Code", name: "bank_ifsc_code", value: formData?.bank_ifsc_code },
//                       ].map((field) => (
//                         <div key={field.name}>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             {field.label}
//                           </label>
//                           <input
//                             name={field.name}
//                             value={field.value || ""}
//                             onChange={handleChange}
//                             disabled={!isEditing}
//                             placeholder={field.value || "NA"}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#554dc0] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
//                           />
//                         </div>
//                       ))}

//                       {/* Cheque Image */}
//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Cheque Image
//                         </label>
//                         {!isEditing ? (
//                           <a
//                             href={`${baseURL}/${popup.cheque_image}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-flex items-center px-3 py-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
//                           >
//                             <FaRegFileImage className="mr-2" />
//                             View Cheque Image
//                           </a>
//                         ) : (
//                           <input
//                             type="file"
//                             name="cheque_image"
//                             onChange={handleChange}
//                             accept="image/*,application/pdf"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#554dc0] focus:border-transparent file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700"
//                           />
//                         )}
//                       </div>
//                     </div>
//                   </section>
//                 </form>
//               </div>

//               {/* Footer */}
//               <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
//                 <div className="flex justify-end space-x-3">
//                   {isEditing ? (
//                     <>
//                       <button
//                         type="submit"
//                         onClick={handleSave}
//                         className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
//                       >
//                         Save Changes
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setFormData(popup);
//                           setIsEditing(false);
//                         }}
//                         className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
//                       >
//                         Cancel
//                       </button>
//                     </>
//                   ) : (
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setIsEditing(true);
//                         setFormData(popup);
//                       }}
//                       className="px-4 py-2 bg-[#0446DB] text-white rounded-lg hover:bg-[#4540a3] transition-colors font-medium"
//                     >
//                       Edit Details
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Change Password Popup - Keep your existing implementation */}
//         {changePasswordPopup && (

//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//             <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200">
//               {/* Header */}
//               <div className="bg-[rgb(85,77,192)]  px-6 py-4">
//                 <h2 className="text-2xl font-semibold text-white text-center">
//                   Change Password
//                 </h2>
//               </div>

//               {/* Form */}
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   handlePasswordChange();
//                 }}
//                 className="px-6 py-6 bg-white dark:bg-gray-900 space-y-6"
//               >
//                 {/* User Info */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
//                   <div>
//                     <label className="block font-medium mb-1 dark:text-white">ID:</label>
//                     <p className="bg-gray-100 p-2 rounded">
//                       {changePasswordPopup.id}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="block font-medium dark:text-white mb-1">
//                       Merchant Name:
//                     </label>
//                     <p className="bg-gray-100 p-2 rounded">
//                       {changePasswordPopup.name}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Password Inputs */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block font-medium dark:text-white mb-1">
//                       New Password
//                     </label>
//                     <input
//                       type="password"
//                       name="password"
//                       value={newPassword.password}
//                       onChange={(e) =>
//                         setNewPassword({
//                           ...newPassword,
//                           password: e.target.value,
//                         })
//                       }
//                       required
//                       className="w-full border px-3 dark:bg-white py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//                     />
//                   </div>
//                   <div>
//                     <label className="block font-medium dark:text-white mb-1">
//                       Confirm Password
//                     </label>
//                     <input
//                       type="password"
//                       name="confirmPassword"
//                       value={newPassword.confirmPassword}
//                       onChange={(e) =>
//                         setNewPassword({
//                           ...newPassword,
//                           confirmPassword: e.target.value,
//                         })
//                       }
//                       required
//                       className="w-full border dark:bg-white px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//                     />
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex justify-end gap-3 pt-4">
//                   <button
//                     type="submit"
//                     className="bg-[rgb(85,77,192)] text-white px-5 py-2 rounded-md hover:bg-indigo-800 transition"
//                   >
//                     Submit
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setChangePasswordPopup(null);
//                       setNewPassword(null);
//                     }}
//                     className="bg-gray-200 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-300 transition"
//                   >
//                     Close
//                   </button>
//                 </div>


//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//       )
//     }


//     </>
//   );
// }

// export default MerchantDetails;



import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Search,
  RefreshCw,
  Store,
  Users,
  UserCheck,
  UserX,
  FileText,
  KeyRound,
  ExternalLink,
  ShieldCheck,
  Copy,
  Check,
  X,
  Pencil,
  Save,
  Loader2,
  Building2,
  Mail,
  Phone,
  MapPin,
  Landmark,
  Eye,
  EyeOff,
  Upload,
  BadgeCheck,
  CircleAlert,
  WalletCards,
  Hash,
  MapPinned,
  FileCheck2,
  UserRound,
  ChevronRight,
} from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;
const frontendURL = import.meta.env.VITE_FRONTEND_URL;

function MerchantDetails() {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [merchantsData, setMerchantsData] = useState([]);
  const [search, setSearch] = useState("");

  const [popup, setPopup] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [copySuccess, setCopySuccess] = useState(null);

  const [changePasswordPopup, setChangePasswordPopup] = useState(null);

  const [newPassword, setNewPassword] = useState({
    id: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const [actionLoading, setActionLoading] = useState({
    status: null,
    account: null,
    kyc: null,
    password: false,
    save: false,
  });

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // =========================================================
  // FETCH MERCHANTS
  // =========================================================

  const fetchMerchants = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${baseURL}/api/admin/getAllMerchants`,
        {
          headers: authHeaders(),
        },
      );

      setMerchantsData(
        Array.isArray(res?.data?.merchants)
          ? res.data.merchants
          : [],
      );
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error fetching merchants",
      );
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] : value,
    }));
  };

  // =========================================================
  // UPDATE MERCHANT
  // =========================================================

  const handleSave = async (e) => {
    e?.preventDefault();

    if (!formData?.id) return;

    try {
      setActionLoading((prev) => ({
        ...prev,
        save: true,
      }));

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        const value = formData[key];

        if (
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          data.append(key, value);
        }
      });

      const res = await axios.post(
        `${baseURL}/api/admin/updateMerchantInfo/${formData.id}`,
        data,
        {
          headers: {
            ...authHeaders(),
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success(
        res?.data?.message ||
          "Merchant details updated successfully",
      );

      setIsEditing(false);
      setPopup(null);
      setFormData(null);

      await fetchMerchants();
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while saving merchant",
      );
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        save: false,
      }));
    }
  };

  // =========================================================
  // STATUS
  // =========================================================

  const changeStatus = async (id, status) => {
    try {
      setActionLoading((prev) => ({
        ...prev,
        status: id,
      }));

      await axios.post(
        `${baseURL}/api/admin/updateMerchantStatus/${id}`,
        {
          is_active: status,
        },
        {
          headers: authHeaders(),
        },
      );

      toast.success(
        status === 1
          ? "Merchant activated successfully"
          : "Merchant deactivated successfully",
      );

      await fetchMerchants();
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while changing status",
      );
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        status: null,
      }));
    }
  };

  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  const handlePasswordChange = async () => {
    if (!newPassword.password) {
      toast.error("Please enter new password");
      return;
    }

    if (!newPassword.confirmPassword) {
      toast.error("Please confirm password");
      return;
    }

    if (
      newPassword.password !==
      newPassword.confirmPassword
    ) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setActionLoading((prev) => ({
        ...prev,
        password: true,
      }));

      const res = await axios.post(
        `${baseURL}/api/admin/changeMerchantPassword/${newPassword.id}`,
        {
          password: newPassword.password,
          confirmPassword:
            newPassword.confirmPassword,
        },
        {
          headers: authHeaders(),
        },
      );

      toast.success(
        res?.data?.message ||
          "Password changed successfully",
      );

      closePasswordModal();
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error updating password",
      );
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        password: false,
      }));
    }
  };

  // =========================================================
  // ACCOUNT TYPE
  // =========================================================

  const updateMerchantType = async (id) => {
    try {
      setActionLoading((prev) => ({
        ...prev,
        account: id,
      }));

      const res = await axios.post(
        `${baseURL}/api/admin/updateMerchantAccountType/${id}`,
        {
          account_type: "main",
        },
        {
          headers: authHeaders(),
        },
      );

      toast.success(
        res?.data?.message ||
          "Merchant type changed successfully",
      );

      await fetchMerchants();
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error updating merchant type",
      );
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        account: null,
      }));
    }
  };

  // =========================================================
  // VERIFY KYC
  // =========================================================

  const VerifyKyc = async (id) => {
    try {
      setActionLoading((prev) => ({
        ...prev,
        kyc: id,
      }));

      const res = await axios.post(
        `${baseURL}/api/admin/verifyKycMerchant`,
        {
          merchant_id: id,
        },
        {
          headers: authHeaders(),
        },
      );

      toast.success(
        res?.data?.message ||
          "KYC verified successfully",
      );

      setPopup(null);
      setFormData(null);

      await fetchMerchants();
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          "Something went wrong",
      );
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        kyc: null,
      }));
    }
  };

  // =========================================================
  // COPY
  // =========================================================

  const copyText = async (value, type) => {
    if (!value) {
      toast.error("Value not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);

      setCopySuccess(type);

      toast.success("Copied");

      setTimeout(() => {
        setCopySuccess(null);
      }, 1500);
    } catch {
      toast.error("Unable to copy");
    }
  };

  // =========================================================
  // MODALS
  // =========================================================

  const openMerchant = (merchant) => {
    setPopup(merchant);
    setFormData({ ...merchant });
    setIsEditing(false);
  };

  const closeMerchantModal = () => {
    setPopup(null);
    setFormData(null);
    setIsEditing(false);
  };

  const openPasswordModal = (merchant) => {
    setChangePasswordPopup(merchant);

    setNewPassword({
      id: merchant.id,
      password: "",
      confirmPassword: "",
    });

    setShowPassword({
      password: false,
      confirmPassword: false,
    });
  };

  const closePasswordModal = () => {
    setChangePasswordPopup(null);

    setNewPassword({
      id: "",
      password: "",
      confirmPassword: "",
    });

    setShowPassword({
      password: false,
      confirmPassword: false,
    });
  };

  // =========================================================
  // FILTER
  // =========================================================

  const filteredMerchants = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return merchantsData;

    return merchantsData.filter((merchant) =>
      [
        merchant?.id,
        merchant?.name,
        merchant?.email,
        merchant?.phone,
        merchant?.company_name,
        merchant?.account_type,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [merchantsData, search]);

  // =========================================================
  // STATS
  // =========================================================

  const stats = useMemo(() => {
    const total = merchantsData.length;

    const active = merchantsData.filter(
      (item) => Number(item?.is_active) === 1,
    ).length;

    const inactive = total - active;

    const verified = merchantsData.filter(
      (item) => Number(item?.kyc_verified) === 1,
    ).length;

    return {
      total,
      active,
      inactive,
      verified,
    };
  }, [merchantsData]);

  // =========================================================
  // EFFECT
  // =========================================================

  useEffect(() => {
    fetchMerchants();
  }, []);

  // =========================================================
  // PAGE LOADER
  // =========================================================

  if (pageLoading) {
    return (
      <div className="flex min-h-[85vh] w-full items-center justify-center bg-[#f6f8fc] dark:bg-[#080d17]">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-white shadow-sm dark:border-blue-500/20 dark:bg-slate-900">
            <Loader2 className="h-6 w-6 animate-spin text-[#0446DB]" />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Loading merchant details...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Please wait a moment
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#f6f8fc] pb-10 text-slate-900 transition-colors dark:bg-[#080d17] dark:text-slate-100">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0d1421]">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                    <Store className="h-4 w-4" />
                  </span>

                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#0446DB] dark:text-blue-400">
                    Merchant Management
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white md:text-3xl">
                  Merchant Details
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Manage merchant accounts, KYC,
                  credentials and account access.
                </p>
              </div>

              <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">

                <div className="relative sm:w-[330px]">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search merchants..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0446DB] focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500 dark:focus:bg-slate-900 dark:focus:ring-blue-500/10"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={fetchMerchants}
                  disabled={loading}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      loading ? "animate-spin" : ""
                    }`}
                  />

                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <main className="space-y-5 px-4 py-6 sm:px-6 lg:px-8">

          {/* STATS */}

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

            <StatCard
              title="Total Merchants"
              value={stats.total}
              subtitle="Registered merchants"
              icon={<Users className="h-5 w-5" />}
              iconClass="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
            />

            <StatCard
              title="Active"
              value={stats.active}
              subtitle="Active accounts"
              icon={<UserCheck className="h-5 w-5" />}
              iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
            />

            <StatCard
              title="Inactive"
              value={stats.inactive}
              subtitle="Inactive accounts"
              icon={<UserX className="h-5 w-5" />}
              iconClass="bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
            />

            <StatCard
              title="KYC Verified"
              value={stats.verified}
              subtitle="Verified merchants"
              icon={<ShieldCheck className="h-5 w-5" />}
              iconClass="bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
            />
          </div>

          {/* ================================================= */}
          {/* TABLE */}
          {/* ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0d1421]">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  All Merchants
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {filteredMerchants.length} merchant
                  {filteredMerchants.length !== 1
                    ? "s"
                    : ""}{" "}
                  found
                </p>
              </div>

              <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {filteredMerchants.length} /{" "}
                {merchantsData.length}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">

                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60">
                    <TableHead>Merchant</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>KYC</TableHead>
                    <TableHead>Account Type</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>Access</TableHead>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                  {loading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-20 text-center"
                      >
                        <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#0446DB]" />

                        <p className="mt-3 text-sm font-medium text-slate-500">
                          Loading merchants...
                        </p>
                      </td>
                    </tr>
                  ) : filteredMerchants.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-20"
                      >
                        <EmptyState
                          search={search}
                          clear={() => setSearch("")}
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredMerchants.map(
                      (merchant) => (
                        <tr
                          key={merchant.id}
                          className="group transition hover:bg-slate-50/80 dark:hover:bg-slate-900/40"
                        >

                          {/* MERCHANT */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                                {getInitials(
                                  merchant?.name,
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="max-w-[190px] truncate text-sm font-bold text-slate-900 dark:text-white">
                                  {merchant?.name ||
                                    "Unnamed Merchant"}
                                </p>

                                <p className="mt-0.5 text-xs text-slate-400">
                                  ID #{merchant?.id}
                                </p>

                                {merchant?.company_name && (
                                  <p className="mt-0.5 max-w-[190px] truncate text-xs text-slate-500 dark:text-slate-400">
                                    {
                                      merchant.company_name
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* CONTACT */}

                          <td className="px-5 py-4">
                            <div className="space-y-1.5">

                              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                                <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                                <span className="max-w-[210px] truncate">
                                  {merchant?.email ||
                                    "N/A"}
                                </span>
                              </div>

                              {merchant?.phone && (
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                  <Phone className="h-3.5 w-3.5" />
                                  {merchant.phone}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">

                              <button
                                type="button"
                                disabled={
                                  actionLoading.status ===
                                  merchant.id
                                }
                                onClick={() =>
                                  changeStatus(
                                    merchant.id,
                                    Number(
                                      merchant.is_active,
                                    ) === 1
                                      ? 0
                                      : 1,
                                  )
                                }
                                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
                                  Number(
                                    merchant.is_active,
                                  ) === 1
                                    ? "bg-emerald-500"
                                    : "bg-slate-300 dark:bg-slate-600"
                                }`}
                              >
                                {actionLoading.status ===
                                merchant.id ? (
                                  <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin text-white" />
                                ) : (
                                  <span
                                    className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                                      Number(
                                        merchant.is_active,
                                      ) === 1
                                        ? "translate-x-6"
                                        : "translate-x-1"
                                    }`}
                                  />
                                )}
                              </button>

                              <span
                                className={`text-xs font-semibold ${
                                  Number(
                                    merchant.is_active,
                                  ) === 1
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-slate-500 dark:text-slate-400"
                                }`}
                              >
                                {Number(
                                  merchant.is_active,
                                ) === 1
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </div>
                          </td>

                          {/* KYC */}

                          <td className="px-5 py-4">
                            {Number(
                              merchant?.kyc_verified,
                            ) === 1 ? (
                              <StatusBadge type="success">
                                <BadgeCheck className="h-3.5 w-3.5" />
                                Verified
                              </StatusBadge>
                            ) : (
                              <StatusBadge type="warning">
                                <CircleAlert className="h-3.5 w-3.5" />
                                Pending
                              </StatusBadge>
                            )}
                          </td>

                          {/* ACCOUNT TYPE */}

                          <td className="px-5 py-4">

                            {merchant?.account_type ===
                            "test" ? (
                              <button
                                type="button"
                                disabled={
                                  actionLoading.account ===
                                  merchant.id
                                }
                                onClick={() =>
                                  updateMerchantType(
                                    merchant.id,
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400"
                              >
                                {actionLoading.account ===
                                merchant.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <CircleAlert className="h-3.5 w-3.5" />
                                )}

                                Test
                              </button>
                            ) : merchant?.account_type ===
                              "main" ? (
                              <StatusBadge type="blue">
                                <BadgeCheck className="h-3.5 w-3.5" />
                                Main
                              </StatusBadge>
                            ) : (
                              <StatusBadge>
                                N/A
                              </StatusBadge>
                            )}
                          </td>

                          {/* DOCUMENT */}

                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                openMerchant(merchant)
                              }
                              className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0446DB] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                            >
                              <FileText className="h-4 w-4" />
                              View
                            </button>
                          </td>

                          {/* PASSWORD */}

                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                openPasswordModal(
                                  merchant,
                                )
                              }
                              className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0446DB] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                            >
                              <KeyRound className="h-4 w-4" />
                              Change
                            </button>
                          </td>

                          {/* LOGIN */}

                          <td className="px-5 py-4">
                            <a
                              href={`${frontendURL}/incognitoLogin/${localStorage.getItem(
                                "token",
                              )}/${merchant.email}/merchant`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#0446DB] px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0338b5]"
                            >
                              Login
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </td>
                        </tr>
                      ),
                    )
                  )}
                </tbody>
              </table>
            </div>

            {!loading &&
              filteredMerchants.length > 0 && (
                <div className="flex flex-col gap-1 border-t border-slate-200 bg-slate-50/70 px-5 py-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">

                  <p>
                    Showing{" "}
                    <strong className="text-slate-700 dark:text-slate-200">
                      {filteredMerchants.length}
                    </strong>{" "}
                    merchants
                  </p>

                  {search && (
                    <p>
                      Search:{" "}
                      <span className="font-semibold text-[#0446DB] dark:text-blue-400">
                        "{search}"
                      </span>
                    </p>
                  )}
                </div>
              )}
          </section>
        </main>
      </div>

      {/* ================================================= */}
      {/* MERCHANT DETAILS MODAL */}
      {/* ================================================= */}

      {popup && formData && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-[3px] sm:p-5"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !actionLoading.save
            ) {
              closeMerchantModal();
            }
          }}
        >
          <div className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#0d1421]">

            {/* MODAL HEADER */}

            <div className="shrink-0 border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-[#0d1421] sm:px-6">

              <div className="flex items-start justify-between gap-4">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0446DB] font-bold text-white">
                    {getInitials(popup?.name)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">

                      <h2 className="truncate text-lg font-bold text-slate-900 dark:text-white">
                        {popup?.name ||
                          "Merchant Details"}
                      </h2>

                      {Number(
                        popup?.kyc_verified,
                      ) === 1 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                          <BadgeCheck className="h-3 w-3" />
                          KYC Verified
                        </span>
                      )}
                    </div>

                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Merchant ID #{popup?.id}
                      {popup?.company_name
                        ? ` • ${popup.company_name}`
                        : ""}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeMerchantModal}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* MODAL CONTENT */}

            <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 dark:bg-[#080d17] sm:p-6">

              <form
                onSubmit={handleSave}
                className="space-y-5"
              >

                {/* CREDENTIALS */}

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">

                  <InfoBox
                    icon={
                      <Hash className="h-4 w-4" />
                    }
                    label="Merchant ID"
                    value={`#${popup?.id}`}
                  />

                  <CopyBox
                    label="Merchant Key"
                    value={popup?.merchant_key}
                    copied={
                      copySuccess ===
                      "merchant_key"
                    }
                    onCopy={() =>
                      copyText(
                        popup?.merchant_key,
                        "merchant_key",
                      )
                    }
                  />

                  <CopyBox
                    label="Secret Key"
                    value={popup?.secret_key}
                    copied={
                      copySuccess === "secret_key"
                    }
                    onCopy={() =>
                      copyText(
                        popup?.secret_key,
                        "secret_key",
                      )
                    }
                  />
                </div>

                {/* BASIC DETAILS */}

                <ModalSection
                  icon={
                    <UserRound className="h-5 w-5" />
                  }
                  title="Basic Information"
                  subtitle="Merchant and company information"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <FormInput
                      label="Merchant Name"
                      name="name"
                      value={formData?.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<UserRound />}
                    />

                    <FormInput
                      label="Phone Number"
                      name="phone"
                      value={formData?.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<Phone />}
                    />

                    <FormInput
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData?.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<Mail />}
                    />

                    <FormInput
                      label="Company Name"
                      name="company_name"
                      value={
                        formData?.company_name
                      }
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<Building2 />}
                    />

                    <FormInput
                      label="Company Address"
                      name="company_address"
                      value={
                        formData?.company_address
                      }
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<MapPin />}
                    />

                    <FormInput
                      label="Company City"
                      name="company_city"
                      value={
                        formData?.company_city
                      }
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<MapPinned />}
                    />

                    <FormInput
                      label="Company State"
                      name="company_state"
                      value={
                        formData?.company_state
                      }
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<MapPinned />}
                    />

                    <FormInput
                      label="Company Pincode"
                      name="company_pincode"
                      value={
                        formData?.company_pincode
                      }
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<MapPin />}
                    />

                    <FormInput
                      label="Company GST Number"
                      name="company_gst_number"
                      value={
                        formData?.company_gst_number
                      }
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<FileText />}
                    />
                  </div>
                </ModalSection>

                {/* KYC */}

                <ModalSection
                  icon={
                    <ShieldCheck className="h-5 w-5" />
                  }
                  title="KYC Verification"
                  subtitle="Review merchant verification documents"
                  right={
                    Number(
                      popup?.kyc_verified,
                    ) === 1 ? (
                      <StatusBadge type="success">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verified
                      </StatusBadge>
                    ) : (
                      <StatusBadge type="warning">
                        Pending Verification
                      </StatusBadge>
                    )
                  }
                >

                  <div className="space-y-4">

                    {(popup?.document_type ||
                      popup?.document_id) && (
                      <DocumentCard
                        title="Primary Document"
                        companyType={
                          popup?.company_type
                        }
                        documentType={
                          popup?.document_type
                        }
                        documentId={
                          popup?.document_id
                        }
                        image={
                          popup?.document_image
                        }
                      />
                    )}

                    {popup?.supporting_document_id && (
                      <DocumentCard
                        title="Supporting Document"
                        companyType={
                          popup?.company_type
                        }
                        documentType={
                          popup?.supporting_document_type
                        }
                        documentId={
                          popup?.supporting_document_id
                        }
                        image={
                          popup?.supporting_document_image
                        }
                      />
                    )}

                    {!popup?.document_id &&
                      !popup?.supporting_document_id && (
                        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                          <FileText className="mx-auto h-7 w-7 text-slate-300 dark:text-slate-600" />

                          <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                            No KYC documents
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Merchant has not uploaded
                            verification documents.
                          </p>
                        </div>
                      )}

                    {Number(
                      popup?.kyc_verified,
                    ) !== 1 &&
                      (popup?.document_id ||
                        popup?.supporting_document_id) && (
                        <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10 sm:flex-row sm:items-center sm:justify-between">

                          <div className="flex items-start gap-3">
                            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />

                            <div>
                              <p className="text-sm font-bold text-amber-900 dark:text-amber-300">
                                Verification Required
                              </p>

                              <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
                                Review the uploaded
                                documents before approving
                                KYC.
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={
                              actionLoading.kyc ===
                              popup?.id
                            }
                            onClick={() =>
                              VerifyKyc(popup?.id)
                            }
                            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                          >
                            {actionLoading.kyc ===
                            popup?.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <ShieldCheck className="h-4 w-4" />
                            )}

                            Verify KYC
                          </button>
                        </div>
                      )}
                  </div>
                </ModalSection>

                {/* BANK */}

                <ModalSection
                  icon={
                    <Landmark className="h-5 w-5" />
                  }
                  title="Bank Details"
                  subtitle="Settlement and banking information"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <FormInput
                      label="Bank Name"
                      name="bank_name"
                      value={formData?.bank_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<Landmark />}
                    />

                    <FormInput
                      label="Account Number"
                      name="bank_account_number"
                      value={
                        formData?.bank_account_number
                      }
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<WalletCards />}
                    />

                    <FormInput
                      label="Branch"
                      name="bank_branch"
                      value={formData?.bank_branch}
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<Building2 />}
                    />

                    <FormInput
                      label="IFSC Code"
                      name="bank_ifsc_code"
                      value={
                        formData?.bank_ifsc_code
                      }
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<Hash />}
                    />

                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300">
                        Cheque Document
                      </label>

                      {!isEditing ? (
                        popup?.cheque_image ? (
                          <a
                            href={`${baseURL}${popup.cheque_image}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex min-h-[60px] items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 transition hover:border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10"
                          >
                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#0446DB] shadow-sm dark:bg-slate-800 dark:text-blue-400">
                                <FileCheck2 className="h-4 w-4" />
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                  Cheque Document
                                </p>

                                <p className="text-xs text-slate-400">
                                  Click to view uploaded
                                  document
                                </p>
                              </div>
                            </div>

                            <ExternalLink className="h-4 w-4 text-slate-400" />
                          </a>
                        ) : (
                          <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-400 dark:border-slate-700">
                            No cheque document uploaded
                          </div>
                        )
                      ) : (
                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-[#0446DB] hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-500 dark:hover:bg-blue-500/10">

                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#0446DB] shadow-sm dark:bg-slate-800 dark:text-blue-400">
                            <Upload className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                              Upload new cheque
                            </p>

                            <p className="text-xs text-slate-400">
                              Image or PDF document
                            </p>
                          </div>

                          <input
                            type="file"
                            name="cheque_image"
                            accept="image/*,application/pdf"
                            onChange={handleChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </ModalSection>
              </form>
            </div>

            {/* MODAL FOOTER */}

            <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-[#0d1421]">

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                {isEditing ? (
                  <>
                    <button
                      type="button"
                      disabled={
                        actionLoading.save
                      }
                      onClick={() => {
                        setFormData({
                          ...popup,
                        });
                        setIsEditing(false);
                      }}
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      disabled={
                        actionLoading.save
                      }
                      onClick={handleSave}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0446DB] px-5 text-sm font-semibold text-white transition hover:bg-[#0338b5] disabled:opacity-60"
                    >
                      {actionLoading.save ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}

                      {actionLoading.save
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={
                        closeMerchantModal
                      }
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Close
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...popup,
                        });
                        setIsEditing(true);
                      }}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0446DB] px-5 text-sm font-semibold text-white transition hover:bg-[#0338b5]"
                    >
                      <Pencil className="h-4 w-4" />

                      Edit Details
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* CHANGE PASSWORD MODAL */}
      {/* ================================================= */}

      {changePasswordPopup && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-[3px]"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !actionLoading.password
            ) {
              closePasswordModal();
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#0d1421]">

            {/* HEADER */}

            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">

              <div className="flex gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                  <KeyRound className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Change Password
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Update merchant login password.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closePasswordModal}
                disabled={actionLoading.password}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePasswordChange();
              }}
            >

              <div className="space-y-5 p-5">

                {/* USER */}

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-[#0446DB] shadow-sm dark:bg-slate-800 dark:text-blue-400">
                    {getInitials(
                      changePasswordPopup?.name,
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      {changePasswordPopup?.name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Merchant ID #
                      {changePasswordPopup?.id}
                    </p>
                  </div>
                </div>

                {/* PASSWORD */}

                <PasswordInput
                  label="New Password"
                  value={newPassword.password}
                  show={showPassword.password}
                  onToggle={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      password:
                        !prev.password,
                    }))
                  }
                  onChange={(e) =>
                    setNewPassword((prev) => ({
                      ...prev,
                      password:
                        e.target.value,
                    }))
                  }
                />

                <PasswordInput
                  label="Confirm Password"
                  value={
                    newPassword.confirmPassword
                  }
                  show={
                    showPassword.confirmPassword
                  }
                  onToggle={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      confirmPassword:
                        !prev.confirmPassword,
                    }))
                  }
                  onChange={(e) =>
                    setNewPassword((prev) => ({
                      ...prev,
                      confirmPassword:
                        e.target.value,
                    }))
                  }
                />

                {newPassword.password &&
                  newPassword.confirmPassword &&
                  newPassword.password !==
                    newPassword.confirmPassword && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                      <CircleAlert className="h-4 w-4" />
                      Passwords do not match
                    </div>
                  )}
              </div>

              {/* FOOTER */}

              <div className="flex gap-3 border-t border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/50">

                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={
                    actionLoading.password
                  }
                  className="h-10 flex-1 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    actionLoading.password
                  }
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0446DB] text-sm font-semibold text-white transition hover:bg-[#0338b5] disabled:opacity-60"
                >
                  {actionLoading.password ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <KeyRound className="h-4 w-4" />
                  )}

                  {actionLoading.password
                    ? "Updating..."
                    : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

/* ========================================================= */
/* COMPONENTS */
/* ========================================================= */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-[#0d1421]">

      <div className="flex items-start justify-between gap-3">

        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            {value}
          </p>

          <p className="mt-1 hidden text-xs text-slate-400 sm:block">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function TableHead({ children }) {
  return (
    <th className="whitespace-nowrap px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
      {children}
    </th>
  );
}

function StatusBadge({
  type = "default",
  children,
}) {
  const classes = {
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",

    warning:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400",

    blue:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",

    default:
      "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-bold ${classes[type]}`}
    >
      {children}
    </span>
  );
}

function ModalSection({
  icon,
  title,
  subtitle,
  right,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0d1421]">

      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
            {icon}
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {title}
            </h3>

            <p className="mt-0.5 text-xs text-slate-400">
              {subtitle}
            </p>
          </div>
        </div>

        {right}
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}

function FormInput({
  label,
  icon,
  disabled,
  ...props
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300">
        {label}
      </label>

      <div className="relative">

        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 [&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </div>
        )}

        <input
          {...props}
          disabled={disabled}
          value={props.value || ""}
          placeholder="N/A"
          className={`h-11 w-full rounded-xl border px-3 text-sm outline-none transition ${
            icon ? "pl-9" : ""
          } ${
            disabled
              ? "cursor-default border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
              : "border-slate-300 bg-white text-slate-900 focus:border-[#0446DB] focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/10"
          }`}
        />
      </div>
    </div>
  );
}

function InfoBox({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0d1421]">

      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-[11px] font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-2 truncate text-sm font-bold text-slate-900 dark:text-white">
        {value || "N/A"}
      </p>
    </div>
  );
}

function CopyBox({
  label,
  value,
  copied,
  onCopy,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0d1421]">

      <div className="flex items-center justify-between gap-3">

        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>

        <button
          type="button"
          onClick={onCopy}
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-blue-50 hover:text-[#0446DB] dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>

      <p
        className="mt-2 max-w-full truncate font-mono text-xs font-semibold text-slate-700 dark:text-slate-300"
        title={value}
      >
        {value || "Not available"}
      </p>
    </div>
  );
}

function DocumentCard({
  title,
  companyType,
  documentType,
  documentId,
  image,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">

      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70">

        <FileCheck2 className="h-4 w-4 text-[#0446DB] dark:text-blue-400" />

        <p className="text-sm font-bold text-slate-800 dark:text-white">
          {title}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">

        <DocumentInfo
          label="Company Type"
          value={companyType}
        />

        <DocumentInfo
          label="Document Type"
          value={documentType}
        />

        <DocumentInfo
          label="Document ID"
          value={documentId}
        />

        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Document File
          </p>

          {image ? (
            <a
              href={`${baseURL}${image}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0446DB] transition hover:underline dark:text-blue-400"
            >
              <Eye className="h-4 w-4" />
              View Document
            </a>
          ) : (
            <p className="mt-1.5 text-sm text-slate-400">
              Not uploaded
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function DocumentInfo({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-semibold text-slate-700 dark:text-slate-200">
        {value || "N/A"}
      </p>
    </div>
  );
}

function PasswordInput({
  label,
  value,
  show,
  onToggle,
  onChange,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300">
        {label}
        <span className="ml-1 text-red-500">
          *
        </span>
      </label>

      <div className="relative">

        <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          type={show ? "text" : "password"}
          value={value || ""}
          onChange={onChange}
          required
          autoComplete="new-password"
          placeholder={`Enter ${label.toLowerCase()}`}
          className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0446DB] focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/10"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 dark:hover:text-white"
        >
          {show ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

function EmptyState({ search, clear }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 text-center">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
        <Store className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-white">
        {search
          ? "No merchants found"
          : "No merchants available"}
      </h3>

      <p className="mt-1 max-w-sm text-xs text-slate-400">
        {search
          ? `No merchant matches "${search}". Try another search.`
          : "Merchant records will appear here once available."}
      </p>

      {search && (
        <button
          type="button"
          onClick={clear}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#0446DB] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0338b5]"
        >
          <X className="h-3.5 w-3.5" />
          Clear Search
        </button>
      )}
    </div>
  );
}

function getInitials(name) {
  if (!name) return "M";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

export default MerchantDetails;
