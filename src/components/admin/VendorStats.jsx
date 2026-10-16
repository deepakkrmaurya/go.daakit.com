// import { useEffect, useState } from "react";
// import axios from "axios";
// import { TbFileInfo } from "react-icons/tb";
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
// function VendorStats() {
//   const [vendorsData, setVendorsData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [popup, setPopup] = useState(null);
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
//         `${baseURL}/api/admin/updateVendor/${formData.id}`,
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
//       fetchVendors();
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Error saving data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchVendors = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${baseURL}/api/admin/getAllVendors`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         params: {
//           limit: 500,
//         }
//       });
//       setVendorsData(res.data.data);
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Error fetching vendors: ");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const changeStatus = async (id, status) => {
//     setLoading(true);
//     try {
//       await axios.post(
//         `${baseURL}/api/admin/updateVendorAccountStatus`,
//         {},
//         {
//           params: {
//             vendor_id: id,
//             is_active: status,
//           },
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       fetchVendors();
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
//         `${baseURL}/api/admin/changeVendorPassword/${newPassword.id}`,
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
//   useEffect(() => {
//     fetchVendors();

//   }, []);

//   useEffect(() => {
//     if (popup) {
//       setFormData({ ...popup });
//     }
//   }, [popup]);

//   const VerifyKyc = async (vendor_id) => {
//     const token = localStorage.getItem("token");
//     try {

//       const res = await axios.post(
//         `${baseURL}/api/admin/verifyKycVendor`,
//         { vendor_id },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setPopup(null)
//       fetchVendors()
//       if (res?.data?.success) {
//         toast.success(res?.data?.message)
//         return
//       }
//     } catch (error) {
//       console.log(error)
//       // toast.error(error.response.data.message || "Somthing went wrong.")
//       return
//     }
//   }

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
//       loadingPage ?(
//          <div className=" w-full h-[90vh] flex justify-center items-center">
//                   <div>
//                     <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//                     <p className="mt-2"> Loading Vendor Details...</p>
//                   </div>
//                 </div>
//       ):(
//       <div className="bg-gray-100 dark:bg-gray-900 min-h-screen w-full">
//         {/* Heading Strip */}
//         <div className=" dark:bg-gray-900  py-3 px-6  ">
//           <div className="flex flex-wrap items-center justify-between">
//             {/* Heading */}
//             <h1 className="text-2xl font-bold dark:text-white">Vendor Details</h1>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className=" z-10">
//           <div className="max-w-full  relative z-10">
//             {/* Table Container */}
//             <div className="bg-white dark:bg-gray-900 border border-gray-200 overflow-hidden">
//               {/* Table Wrapper */}
//               <div className="overflow-x-auto">
//                 <Table >
//                   <TableHeader >
//                     <TableRow>
//                       {[
//                         { label: "VENDOR ID", width: "w-24" },
//                         { label: "VENDOR NAME", width: "w-48" },
//                         { label: "COMPANY NAME", width: "w-56" },
//                         // { label: "VERIFICATION STATUS", width: "w-36" },
//                         { label: "ACCOUNT STATUS", width: "w-28" },
//                         { label: "DOCUMENT", width: "w-20" },
//                         { label: "PASSWORD", width: "w-32" },
//                         { label: "INCOGNITO LOGIN", width: "w-48" }
//                       ].map((header) => (
//                         <TableHead
//                           key={header.label}

//                         >
//                           {header.label}
//                         </TableHead>
//                       ))}
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody >


//                     {loading ? (
//                       <TableRow>
//                         <TableCell colSpan={10} className="text-center py-10">
//                           <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//                           <p className="mt-2">Loading orders...</p>
//                         </TableCell>
//                       </TableRow>
//                     ) : vendorsData.length === 0 ? (
//                       <TableRow>
//                         <TableCell colSpan={10} className="text-center py-10">
//                           No orders found
//                         </TableCell>
//                       </TableRow>
//                     ) : (

//                       vendorsData.map((vendor) => (
//                         <TableRow
//                           key={vendor.id}
//                           className="hover:bg-gray-50/80 dark:hover:bg-gray-800 transition-all duration-200 group"
//                         >
//                           {/* Vendor ID */}
//                           <TableCell className="px-4 py-4">
//                             <div className="flex items-center">

//                               <span className="font-mono dark:text-white text-sm font-semibold text-gray-900">
//                                 FP_{vendor.id}
//                               </span>
//                             </div>
//                           </TableCell>

//                           {/* Vendor Name */}
//                           <TableCell className="px-4 py-4">
//                             <div className="flex items-center">

//                               <span className="text-sm dark:text-white whitespace-nowrap font-medium text-gray-900">
//                                 {vendor.vendor_name}
//                               </span>
//                             </div>
//                           </TableCell>

//                           {/* Company Name */}
//                           <TableCell className="px-4 py-4 dark:text-white">
//                             <span className={`text-sm dark:text-white whitespace-nowrap ${vendor.company_name && vendor.company_name !== "null" ? 'text-gray-900' : 'text-gray-400 italic'}`}>
//                               {vendor.company_name && vendor.company_name !== "null" ? vendor.company_name : "Not provided"}
//                             </span>
//                           </TableCell>

                          

//                           {/* Status Toggle */}
//                           <TableCell className="px-4 py-4">
//                             <div className="flex items-center justify-center">
//                               <button
//                                 onClick={() => changeStatus(vendor.id, vendor.is_active == 1 ? 0 : 1)}
//                                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500/30 ${vendor.is_active ? "bg-green-500" : "bg-gray-300"
//                                   }`}
//                               >
//                                 <span
//                                   className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-all duration-300 ${vendor.is_active ? "translate-x-6" : "translate-x-1"
//                                     }`}
//                                 />
//                               </button>
//                               <p className=" whitespace-nowrap ml-1 text-sm text-gray-700">{vendor.is_active == 1 ? "Active" : 'Inactive'}</p>
//                             </div>
//                           </TableCell>

//                           {/* Document Info */}
//                           <TableCell className="px-4 py-4">
//                             <button
//                               onClick={() => setPopup(vendor)}
//                               title="View Vendor Documents"
//                               className="inline-flex cursor-pointer items-center px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-all duration-200 border border-blue-200 hover:border-blue-300 hover:shadow-sm"
//                             >
//                               <TbFileInfo className="text-xl" />
//                               View
//                             </button>
//                             {/* <button
//                               onClick={() => setPopup(vendor)}
//                               className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group-hover:scale-110"
//                               title="View Vendor Documents"
//                             >
//                               <TbFileInfo className="text-xl" />
//                             </button> */}
//                           </TableCell>

//                           {/* Change Password */}
//                           <TableCell className="px-4 py-4">
//                             <button
//                               onClick={() => {
//                                 setNewPassword({ id: vendor.id });
//                                 setChangePasswordPopup(vendor);
//                               }}
//                               className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-all duration-200 border border-blue-200 hover:border-blue-300 hover:shadow-sm"
//                             >
//                               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
//                               </svg>
//                               Change
//                             </button>
//                           </TableCell>

//                           {/* Incognito Login */}
//                           <TableCell className="px-4 py-4">
//                             <a
//                               href={`${frontendURL}/incognitoLogin/${localStorage.getItem("token")}/${vendor.email}/vendor`}
//                               className="inline-flex whitespace-nowrap items-center px-3 py-2 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-100 transition-all duration-200 border border-purple-200 hover:border-purple-300 hover:shadow-sm group"
//                               title="Right click and open in incognito"
//                             >
//                               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
//                               </svg>
//                               <span>Incognito Login</span>
//                               <svg className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//                               </svg>
//                             </a>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     )
//                     }




//                   </TableBody>
//                 </Table>
//               </div>

//               {/* Empty State */}
//               {vendorsData.length === 0 && (
//                 <div className="text-center py-12">
//                   <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                     </svg>
//                   </div>
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
//                   <p className="text-gray-500 max-w-sm mx-auto">
//                     There are currently no vendors in the system. Vendors will appear here once they register.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
        

//         {popup && (
          

//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden m-4 border border-gray-200">
//               {/* Header */}
//               <div className="bg-[#0446DB] p-6">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div className="p-2 bg-white/20 rounded-xl">
//                       <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                       </svg>
//                     </div>
//                     <div>
//                       <h2 className="text-2xl font-bold text-white">Vendor Details</h2>
//                       <p className="text-indigo-100 text-sm mt-1">ID: FP{popup.id}</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => {
//                       setPopup(null);
//                       setFormData(null);
//                       setIsEditing(false);
//                     }}
//                     className="text-white hover:text-indigo-200 text-2xl transition-colors"
//                   >
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>

//                 {/* Status Badge */}
//                 {/* <div className="mt-4 flex items-center">
//                     <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${popup.is_verified
//                       ? 'bg-green-100 text-green-800 border border-green-300'
//                       : 'bg-red-100 text-red-800 border border-red-300'
//                       }`}>
//                       {popup.is_verified ? '✓ Verified Vendor' : '✗ Not Verified'}
//                     </span>

//                   </div> */}
//               </div>

//               {/* Content */}
//               <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
//                 <form
//                   onSubmit={(e) => {
//                     e.preventDefault();
//                     handleSave();
//                   }}
//                   className="space-y-8"
//                 >
//                   {/* Basic Information Section */}
//                   <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="text-lg font-semibold text-gray-800">
//                         <span className="flex items-center">
//                           <svg className="w-5 h-5 mr-2 text-[#0446DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                           </svg>
//                           Basic Information
//                         </span>
//                       </h3>
//                       {!isEditing && (
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setIsEditing(true);
//                             setFormData(popup);
//                           }}
//                           className="flex items-center text-sm bg-[#0446DB] text-white px-4 py-2 rounded-lg hover:bg-[rgb(75,67,182)] transition-colors"
//                         >
//                           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                           </svg>
//                           Edit Details
//                         </button>
//                       )}
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       {/* Vendor Name */}
//                       <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700 flex items-center">
//                           <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                           </svg>
//                           Vendor Name
//                         </label>
//                         <input
//                           name="vendor_name"
//                           value={formData?.vendor_name || ""}
//                           onChange={handleChange}
//                           disabled={!isEditing}
//                           placeholder="Enter vendor name"
//                           className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0446DB] focus:border-[#0446DB] outline-none transition-colors ${isEditing
//                             ? 'border-gray-300 bg-white hover:border-gray-400'
//                             : 'border-gray-200 bg-gray-50 text-gray-700'
//                             }`}
//                         />
//                       </div>

//                       {/* Company Name */}
//                       <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700 flex items-center">
//                           <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                           </svg>
//                           Company Name
//                         </label>
//                         <input
//                           name="company_name"
//                           value={formData?.company_name || ""}
//                           onChange={handleChange}
//                           disabled={!isEditing}
//                           placeholder="Enter company name"
//                           className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0446DB] focus:border-[#0446DB] outline-none transition-colors ${isEditing
//                             ? 'border-gray-300 bg-white hover:border-gray-400'
//                             : 'border-gray-200 bg-gray-50 text-gray-700'
//                             }`}
//                         />
//                       </div>

//                       {/* GST Number */}
//                       <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700 flex items-center">
//                           <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                           </svg>
//                           GST Number
//                         </label>
//                         <input
//                           name="company_gst_number"
//                           value={formData?.company_gst_number || ""}
//                           onChange={handleChange}
//                           disabled={!isEditing}
//                           placeholder="Enter GST number"
//                           className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0446DB] focus:border-[#0446DB] outline-none transition-colors ${isEditing
//                             ? 'border-gray-300 bg-white hover:border-gray-400'
//                             : 'border-gray-200 bg-gray-50 text-gray-700'
//                             }`}
//                         />
//                       </div>

//                       {/* Phone Number */}
//                       <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700 flex items-center">
//                           <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                           </svg>
//                           Phone Number
//                         </label>
//                         <input
//                           name="phone"
//                           value={formData?.phone || ""}
//                           onChange={handleChange}
//                           disabled={!isEditing}
//                           placeholder="Enter phone number"
//                           className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0446DB] focus:border-[#0446DB] outline-none transition-colors ${isEditing
//                             ? 'border-gray-300 bg-white hover:border-gray-400'
//                             : 'border-gray-200 bg-gray-50 text-gray-700'
//                             }`}
//                         />
//                       </div>

//                       {/* Email */}
//                       <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700 flex items-center">
//                           <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                           </svg>
//                           Email Address
//                         </label>
//                         <input
//                           name="email"
//                           value={formData?.email || ""}
//                           onChange={handleChange}
//                           disabled={!isEditing}
//                           placeholder="Enter email address"
//                           type="email"
//                           className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0446DB] focus:border-[#0446DB] outline-none transition-colors ${isEditing
//                             ? 'border-gray-300 bg-white hover:border-gray-400'
//                             : 'border-gray-200 bg-gray-50 text-gray-700'
//                             }`}
//                         />
//                       </div>

//                       {/* Company Address */}
//                       <div className="md:col-span-2 space-y-2">
//                         <label className="text-sm font-medium text-gray-700 flex items-center">
//                           <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                           </svg>
//                           Company Address
//                         </label>
//                         <input
//                           name="company_address"
//                           value={formData?.company_address || ""}
//                           onChange={handleChange}
//                           disabled={!isEditing}
//                           placeholder="Enter company address"
//                           className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0446DB] focus:border-[#0446DB] outline-none transition-colors ${isEditing
//                             ? 'border-gray-300 bg-white hover:border-gray-400'
//                             : 'border-gray-200 bg-gray-50 text-gray-700'
//                             }`}
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* KYC Details Section */}
//                   <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                       <svg className="w-5 h-5 mr-2 text-[#0446DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                       </svg>
//                       KYC Details
//                     </h3>

//                     <div className="space-y-6">
//                       {
//                         (popup?.document_type || popup?.document_id) && (
//                           <div className="bg-white rounded-lg p-4 border border-gray-200">
//                             <h4 className="font-medium text-gray-700 mb-3 flex items-center">
//                               <span className="w-2 h-2 bg-[#0446DB] rounded-full mr-2"></span>
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
//                                       className="inline-flex items-center text-[#0446DB] hover:text-[rgb(75,67,182)] transition-colors"
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
//                               <div className=" flex mt-3">
//                                 {
//                                   popup?.kyc_verified === 0 ? (
//                                     <div
//                                       onClick={() => { VerifyKyc(popup?.id) }}
//                                       className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-blue-700 transition-colors">
//                                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                                       </svg>
//                                       Verify KYC
//                                     </div>
//                                   ) : (

//                                     <div

//                                       className="flex justify-center whitespace-nowrap  items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg  transition-colors">
//                                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                                       </svg>
//                                       KYC completed Successfully.

//                                     </div>
//                                   )
//                                 }
//                               </div>
//                             </div>
//                           </div>
//                         )
//                       }


//                       {/* Supporting Document */}
//                       {
//                         popup.supporting_document_id && (
//                           <div className="bg-white rounded-lg p-4 border border-gray-200">

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
//                                       className="inline-flex items-center text-[#0446DB] hover:text-[rgb(75,67,182)] transition-colors"
//                                     >
//                                       <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                       </svg>
//                                       View Document
//                                     </a>

//                                     <div className=" flex mt-3">
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

//                   {/* Bank Details Section */}
//                   <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                       <svg className="w-5 h-5 mr-2 text-[#0446DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//                       </svg>
//                       Bank Details
//                     </h3>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       {/* Bank Name */}
//                       <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700">Bank Name</label>
//                         <input
//                           name="bank_name"
//                           value={formData?.bank_name || ""}
//                           onChange={handleChange}
//                           disabled={!isEditing}
//                           placeholder="Enter bank name"
//                           className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0446DB] focus:border-[#0446DB] outline-none transition-colors ${isEditing
//                             ? 'border-gray-300 bg-white hover:border-gray-400'
//                             : 'border-gray-200 bg-gray-50 text-gray-700'
//                             }`}
//                         />
//                       </div>

//                       {/* Account Number */}
//                       <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700">Account Number</label>
//                         <input
//                           name="bank_account_number"
//                           value={formData?.bank_account_number || ""}
//                           onChange={handleChange}
//                           disabled={!isEditing}
//                           placeholder="Enter account number"
//                           className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0446DB] focus:border-[#0446DB] outline-none transition-colors ${isEditing
//                             ? 'border-gray-300 bg-white hover:border-gray-400'
//                             : 'border-gray-200 bg-gray-50 text-gray-700'
//                             }`}
//                         />
//                       </div>

//                       {/* Branch */}
//                       <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700">Branch</label>
//                         <input
//                           name="bank_branch"
//                           value={formData?.bank_branch || ""}
//                           onChange={handleChange}
//                           disabled={!isEditing}
//                           placeholder="Enter branch name"
//                           className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0446DB] focus:border-[#0446DB] outline-none transition-colors ${isEditing
//                             ? 'border-gray-300 bg-white hover:border-gray-400'
//                             : 'border-gray-200 bg-gray-50 text-gray-700'
//                             }`}
//                         />
//                       </div>

//                       {/* IFSC Code */}
//                       <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700">IFSC Code</label>
//                         <input
//                           name="bank_ifsc_code"
//                           value={formData?.bank_ifsc_code || ""}
//                           onChange={handleChange}
//                           disabled={!isEditing}
//                           placeholder="Enter IFSC code"
//                           className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0446DB] focus:border-[#0446DB] outline-none transition-colors ${isEditing
//                             ? 'border-gray-300 bg-white hover:border-gray-400'
//                             : 'border-gray-200 bg-gray-50 text-gray-700'
//                             }`}
//                         />
//                       </div>

//                       {/* Cheque Image */}
//                       <div className="md:col-span-2 space-y-2">
//                         <label className="text-sm font-medium text-gray-700">Cheque Image</label>
//                         {!isEditing ? (
//                           <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
//                             <div className="flex items-center">
//                               {popup.cheque_image ? (
//                                 <>
//                                   <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                   </svg>
//                                   <span className="text-gray-700">Cheque image uploaded</span>
//                                 </>
//                               ) : (
//                                 <>
//                                   <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                                   </svg>
//                                   <span className="text-gray-400">No cheque image available</span>
//                                 </>
//                               )}
//                             </div>
//                             {popup.cheque_image && (
//                               <a
//                                 href={`${baseURL}/${popup.cheque_image}`}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="flex items-center text-[#0446DB] hover:text-[rgb(75,67,182)] transition-colors"
//                               >
//                                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                 </svg>
//                                 View Image
//                               </a>
//                             )}
//                           </div>
//                         ) : (
//                           <div className="space-y-3">
//                             {popup.cheque_image && (
//                               <div className="flex items-center p-3 bg-blue-50 rounded-lg">
//                                 <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                 </svg>
//                                 <span className="text-sm text-blue-700">Current file will be replaced with new upload</span>
//                               </div>
//                             )}
//                             <input
//                               type="file"
//                               name="cheque_image"
//                               onChange={handleChange}
//                               accept="image/*,application/pdf"
//                               className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-[#0446DB] focus:border-[#0446DB] outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#0446DB] file:text-white hover:file:bg-[rgb(75,67,182)]"
//                             />
//                             <p className="text-sm text-gray-500">Upload cheque image or PDF (max 5MB)</p>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="pt-4 border-t border-gray-200">
//                     <div className="flex justify-end space-x-3">
//                       {isEditing ? (
//                         <>
//                           <button
//                             type="button"
//                             onClick={() => {
//                               setFormData(popup);
//                               setIsEditing(false);
//                             }}
//                             className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
//                           >
//                             Cancel
//                           </button>
//                           <button
//                             type="submit"
//                             className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-medium shadow-sm"
//                           >
//                             Save Changes
//                           </button>
//                         </>
//                       ) : (
//                         <button
//                           type="button"
//                           onClick={() => setPopup(null)}
//                           className="px-6 py-3 bg-gradient-to-r from-[#0446DB] to-[rgb(95,87,202)] text-white rounded-xl hover:from-[rgb(75,67,182)] hover:to-[#0446DB] transition-all font-medium shadow-sm"
//                         >
//                           Close
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}

//         {changePasswordPopup && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200">
//               {/* Header */}
//               <div className="bg-[#0446DB] px-6 py-4">
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
//                 className="px-6 py-6 bg-white space-y-6"
//               >
//                 {/* User Info */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
//                   <div>
//                     <label className="block font-medium mb-1">ID:</label>
//                     <p className="bg-gray-100 p-2 rounded">
//                       FP{changePasswordPopup.id}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="block font-medium mb-1">
//                       Vendor Name:
//                     </label>
//                     <p className="bg-gray-100 p-2 rounded">
//                       {changePasswordPopup.vendor_name}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Password Inputs */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block font-medium mb-1">
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
//                       className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//                     />
//                   </div>
//                   <div>
//                     <label className="block font-medium mb-1">
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
//                       className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//                     />
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex justify-end gap-3 pt-4">
//                   <button
//                     type="submit"
//                     className="bg-[#0446DB] text-white px-5 py-2 rounded-md hover:bg-indigo-800 transition"
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

// export default VendorStats;






import { useEffect, useState } from "react";

import axios from "axios";

import { TbFileInfo } from "react-icons/tb";

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

function VendorStats() {

  const [vendorsData, setVendorsData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState(null);

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

        `${baseURL}/api/admin/updateVendor/${formData.id}`,

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

      fetchVendors();

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Error saving data");

    } finally {

      setLoading(false);

    }

  };



  const fetchVendors = async () => {

    setLoading(true);

    try {

      const res = await axios.get(`${baseURL}/api/admin/getAllVendors`, {

        headers: {

          Authorization: `Bearer ${localStorage.getItem("token")}`,

        },

        params: {

          limit: 500,

        }

      });

      setVendorsData(res.data.data);

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Error fetching vendors: ");

    } finally {

      setLoading(false);

    }

  };



  const changeStatus = async (id, status) => {

    setLoading(true);

    try {

      await axios.post(

        `${baseURL}/api/admin/updateVendorAccountStatus`,

        {},

        {

          params: {

            vendor_id: id,

            is_active: status,

          },

          headers: {

            Authorization: `Bearer ${localStorage.getItem("token")}`,

          },

        }

      );

      fetchVendors();

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

        `${baseURL}/api/admin/changeVendorPassword/${newPassword.id}`,

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

    fetchVendors();



  }, []);



  useEffect(() => {

    if (popup) {

      setFormData({ ...popup });

    }

  }, [popup]);



  const VerifyKyc = async (vendor_id) => {

    const token = localStorage.getItem("token");

    try {



      const res = await axios.post(

        `${baseURL}/api/admin/verifyKycVendor`,

        { vendor_id },

        {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        }

      );

      setPopup(null)

      fetchVendors()

      if (res?.data?.success) {

        toast.success(res?.data?.message)

        return

      }

    } catch (error) {

      console.log(error)

      // toast.error(error.response.data.message || "Somthing went wrong.")

      return

    }

  }



  const [loadingPage, setLoadingPage] = useState(true);



useEffect(() => {

  const timer = setTimeout(() => {

    setLoadingPage(false);

  }, 2000);



  return () => clearTimeout(timer);

}, []);

  return (

    <>



    {

      loadingPage ?(

         <div className=" w-full h-[90vh] flex justify-center items-center">

                  <div>

                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />

                    <p className="mt-2"> Loading Vendor Details...</p>

                  </div>

                </div>

      ):(

      <div className="flex h-[88dvh] min-h-0 w-full flex-col overflow-hidden bg-gray-100 dark:bg-gray-900">

        {/* Heading Strip */}

        <div className="z-30 shrink-0 bg-gray-100 px-6 py-3 dark:bg-gray-900">

          <div className="flex flex-wrap items-center justify-between">

            {/* Heading */}

            <h1 className="text-2xl font-bold dark:text-white">Vendor Details</h1>

          </div>

        </div>



        {/* Main Content */}

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">

          <div className="relative flex min-h-0 flex-1 flex-col">

            {/* Table Container */}

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden border border-gray-200 bg-white dark:bg-gray-900">

              {/* Table Wrapper */}

              <div className="min-h-0 flex-1 overflow-auto overscroll-contain [&>div]:!overflow-visible">

                <Table className="min-w-max border-separate border-spacing-0">

                  <TableHeader className="[&_th]:!sticky [&_th]:!top-0 [&_th]:!z-20 [&_th]:!bg-white dark:[&_th]:!bg-gray-900 [&_th]:shadow-[0_1px_0_0_#e5e7eb]">

                    <TableRow>

                      {[

                        { label: "VENDOR ID", width: "w-24" },

                        { label: "VENDOR NAME", width: "w-48" },

                        { label: "COMPANY NAME", width: "w-56" },

                        // { label: "VERIFICATION STATUS", width: "w-36" },

                        { label: "ACCOUNT STATUS", width: "w-28" },

                        { label: "DOCUMENT", width: "w-20" },

                        { label: "PASSWORD", width: "w-32" },

                        { label: "INCOGNITO LOGIN", width: "w-48" }

                      ].map((header) => (

                        <TableHead

                          key={header.label}



                        >

                          {header.label}

                        </TableHead>

                      ))}

                    </TableRow>

                  </TableHeader>

                  <TableBody >





                    {loading ? (

                      <TableRow>

                        <TableCell colSpan={10} className="text-center py-10">

                          <Loader2 className="h-8 w-8 animate-spin mx-auto" />

                          <p className="mt-2">Loading orders...</p>

                        </TableCell>

                      </TableRow>

                    ) : vendorsData.length === 0 ? (

                      <TableRow>

                        <TableCell colSpan={10} className="text-center py-10">

                          No orders found

                        </TableCell>

                      </TableRow>

                    ) : (



                      vendorsData.map((vendor) => (

                        <TableRow

                          key={vendor.id}

                          className="hover:bg-gray-50/80 dark:hover:bg-gray-800 transition-all duration-200 group"

                        >

                          {/* Vendor ID */}

                          <TableCell className="px-4 py-4">

                            <div className="flex items-center">



                              <span className="font-mono dark:text-white text-sm font-semibold text-gray-900">

                                FP_{vendor.id}

                              </span>

                            </div>

                          </TableCell>



                          {/* Vendor Name */}

                          <TableCell className="px-4 py-4">

                            <div className="flex items-center">



                              <span className="text-sm dark:text-white whitespace-nowrap font-medium text-gray-900">

                                {vendor.vendor_name}

                              </span>

                            </div>

                          </TableCell>



                          {/* Company Name */}

                          <TableCell className="px-4 py-4 dark:text-white">

                            <span className={`text-sm dark:text-white whitespace-nowrap ${vendor.company_name && vendor.company_name !== "null" ? 'text-gray-900' : 'text-gray-400 italic'}`}>

                              {vendor.company_name && vendor.company_name !== "null" ? vendor.company_name : "Not provided"}

                            </span>

                          </TableCell>







                          {/* Status Toggle */}

                          <TableCell className="px-4 py-4">

                            <div className="flex items-center justify-center">

                              <button

                                onClick={() => changeStatus(vendor.id, vendor.is_active == 1 ? 0 : 1)}

                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500/30 ${vendor.is_active ? "bg-green-500" : "bg-gray-300"

                                  }`}

                              >

                                <span

                                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-all duration-300 ${vendor.is_active ? "translate-x-6" : "translate-x-1"

                                    }`}

                                />

                              </button>

                              <p className=" whitespace-nowrap ml-1 text-sm text-gray-700">{vendor.is_active == 1 ? "Active" : 'Inactive'}</p>

                            </div>

                          </TableCell>



                          {/* Document Info */}

                          <TableCell className="px-4 py-4">

                            <button

                              onClick={() => setPopup(vendor)}

                              title="View Vendor Documents"

                              className="inline-flex cursor-pointer items-center px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-all duration-200 border border-blue-200 hover:border-blue-300 hover:shadow-sm"

                            >

                              <TbFileInfo className="text-xl" />

                              View

                            </button>

                            {/* <button

                              onClick={() => setPopup(vendor)}

                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group-hover:scale-110"

                              title="View Vendor Documents"

                            >

                              <TbFileInfo className="text-xl" />

                            </button> */}

                          </TableCell>



                          {/* Change Password */}

                          <TableCell className="px-4 py-4">

                            <button

                              onClick={() => {

                                setNewPassword({ id: vendor.id });

                                setChangePasswordPopup(vendor);

                              }}

                              className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-all duration-200 border border-blue-200 hover:border-blue-300 hover:shadow-sm"

                            >

                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />

                              </svg>

                              Change

                            </button>

                          </TableCell>



                          {/* Incognito Login */}

                          <TableCell className="px-4 py-4">

                            <a

                              href={`${frontendURL}/incognitoLogin/${localStorage.getItem("token")}/${vendor.email}/vendor`}

                              className="inline-flex whitespace-nowrap items-center px-3 py-2 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-100 transition-all duration-200 border border-purple-200 hover:border-purple-300 hover:shadow-sm group"

                              title="Right click and open in incognito"

                            >

                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />

                              </svg>

                              <span>Incognito Login</span>

                              <svg className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />

                              </svg>

                            </a>

                          </TableCell>

                        </TableRow>

                      ))

                    )

                    }









                  </TableBody>

                </Table>

              </div>



              {/* Empty State */}

              {vendorsData.length === 0 && (

                <div className="text-center py-12">

                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">

                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />

                    </svg>

                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>

                  <p className="text-gray-500 max-w-sm mx-auto">

                    There are currently no vendors in the system. Vendors will appear here once they register.

                  </p>

                </div>

              )}

            </div>

          </div>

        </div>





        {popup && (





          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden m-4 border border-gray-200">

              {/* Header */}

              <div className="bg-[#0446DB] p-6">

                <div className="flex items-center justify-between">

                  <div className="flex items-center space-x-3">

                    <div className="p-2 bg-white/20 rounded-xl">

                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />

                      </svg>

                    </div>

                    <div>

                      <h2 className="text-2xl font-bold text-white">Vendor Details</h2>

                      <p className="text-indigo-100 text-sm mt-1">ID: FP{popup.id}</p>

                    </div>

                  </div>

                  <button

                    onClick={() => {

                      setPopup(null);

                      setFormData(null);

                      setIsEditing(false);

                    }}

                    className="text-white hover:text-indigo-200 text-2xl transition-colors"

                  >

                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />

                    </svg>

                  </button>

                </div>



                {/* Status Badge */}

                {/* <div className="mt-4 flex items-center">

                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${popup.is_verified

                      ? 'bg-green-100 text-green-800 border border-green-300'

                      : 'bg-red-100 text-red-800 border border-red-300'

                      }`}>

                      {popup.is_verified ? '✓ Verified Vendor' : '✗ Not Verified'}

                    </span>



                  </div> */}

              </div>



              {/* Content */}

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">

                <form

                  onSubmit={(e) => {

                    e.preventDefault();

                    handleSave();

                  }}

                  className="space-y-8"

                >

                  {/* Basic Information Section */}

                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">

                    <div className="flex items-center justify-between mb-4">

                      <h3 className="text-lg font-semibold text-gray-800">

                        <span className="flex items-center">

                          <svg className="w-5 h-5 mr-2 text-[#0446DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />

                          </svg>

                          Basic Information

                        </span>

                      </h3>

                      {!isEditing && (

                        <button

                          type="button"

                          onClick={() => {

                            setIsEditing(true);

                            setFormData(popup);

                          }}

                          className="flex items-center text-sm bg-[#0446DB] text-white px-4 py-2 rounded-lg hover:bg-[rgb(75,67,182)] transition-colors"

                        >

                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />

                          </svg>

                          Edit Details

                        </button>

                      )}

                    </div>



                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      {/* Vendor Name */}

                      <div className="space-y-2">

                        <label className="text-sm font-medium text-gray-700 flex items-center">

                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />

                          </svg>

                          Vendor Name

                        </label>

                        <input

                          name="vendor_name"

                          value={formData?.vendor_name || ""}

                          onChange={handleChange}

                          disabled={!isEditing}

                          placeholder="Enter vendor name"

                          className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0446DB] focus:border-[#0446DB] outline-none transition-colors ${isEditing

                            ? 'border-gray-300 bg-white hover:border-gray-400'

                            : 'border-gray-200 bg-gray-50 text-gray-700'

                            }`}

                        />

                      </div>



                      {/* Company Name */}

                      <div className="space-y-2">

                        <label className="text-sm font-medium text-gray-700 flex items-center">

                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />

                          </svg>

                          Company Name

                        </label>

                        <input

                          name="company_name"

                          value={formData?.company_name || ""}

                          onChange={handleChange}

                          disabled={!isEditing}

                          placeholder="Enter company name"

                          className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0446DB] focus:border-[#0446DB] outline-none transition-colors ${isEditing

                            ? 'border-gray-300 bg-white hover:border-gray-400'

                            : 'border-gray-200 bg-gray-50 text-gray-700'

                            }`}

                        />

                      </div>



                      {/* GST Number */}

                      <div className="space-y-2">

                        <label className="text-sm font-medium text-gray-700 flex items-center">

                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />

                          </svg>

                          GST Number

                        </label>

                        <input

                          name="company_gst_number"

                          value={formData?.company_gst_number || ""}

                          onChange={handleChange}

                          disabled={!isEditing}

                          placeholder="Enter GST number"

                          className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0446DB] focus:border-[#0446DB] outline-none transition-colors ${isEditing

                            ? 'border-gray-300 bg-white hover:border-gray-400'

                            : 'border-gray-200 bg-gray-50 text-gray-700'

                            }`}

                        />

                      </div>



                      {/* Phone Number */}

                      <div className="space-y-2">

                        <label className="text-sm font-medium text-gray-700 flex items-center">

                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />

                          </svg>

                          Phone Number

                        </label>

                        <input

                          name="phone"

                          value={formData?.phone || ""}

                          onChange={handleChange}

                          disabled={!isEditing}

                          placeholder="Enter phone number"

                          className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0446DB] focus:border-[#0446DB] outline-none transition-colors ${isEditing

                            ? 'border-gray-300 bg-white hover:border-gray-400'

                            : 'border-gray-200 bg-gray-50 text-gray-700'

                            }`}

                        />

                      </div>



                      {/* Email */}

                      <div className="space-y-2">

                        <label className="text-sm font-medium text-gray-700 flex items-center">

                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />

                          </svg>

                          Email Address

                        </label>

                        <input

                          name="email"

                          value={formData?.email || ""}

                          onChange={handleChange}

                          disabled={!isEditing}

                          placeholder="Enter email address"

                          type="email"

                          className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0446DB] focus:border-[#0446DB] outline-none transition-colors ${isEditing

                            ? 'border-gray-300 bg-white hover:border-gray-400'

                            : 'border-gray-200 bg-gray-50 text-gray-700'

                            }`}

                        />

                      </div>



                      {/* Company Address */}

                      <div className="md:col-span-2 space-y-2">

                        <label className="text-sm font-medium text-gray-700 flex items-center">

                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />

                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />

                          </svg>

                          Company Address

                        </label>

                        <input

                          name="company_address"

                          value={formData?.company_address || ""}

                          onChange={handleChange}

                          disabled={!isEditing}

                          placeholder="Enter company address"

                          className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0446DB] focus:border-[#0446DB] outline-none transition-colors ${isEditing

                            ? 'border-gray-300 bg-white hover:border-gray-400'

                            : 'border-gray-200 bg-gray-50 text-gray-700'

                            }`}

                        />

                      </div>

                    </div>

                  </div>



                  {/* KYC Details Section */}

                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">

                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">

                      <svg className="w-5 h-5 mr-2 text-[#0446DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />

                      </svg>

                      KYC Details

                    </h3>



                    <div className="space-y-6">

                      {

                        (popup?.document_type || popup?.document_id) && (

                          <div className="bg-white rounded-lg p-4 border border-gray-200">

                            <h4 className="font-medium text-gray-700 mb-3 flex items-center">

                              <span className="w-2 h-2 bg-[#0446DB] rounded-full mr-2"></span>

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

                                      className="inline-flex items-center text-[#0446DB] hover:text-[rgb(75,67,182)] transition-colors"

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

                              <div className=" flex mt-3">

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

                          </div>

                        )

                      }





                      {/* Supporting Document */}

                      {

                        popup.supporting_document_id && (

                          <div className="bg-white rounded-lg p-4 border border-gray-200">



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

                                      className="inline-flex items-center text-[#0446DB] hover:text-[rgb(75,67,182)] transition-colors"

                                    >

                                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />

                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />

                                      </svg>

                                      View Document

                                    </a>



                                    <div className=" flex mt-3">

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



                  {/* Bank Details Section */}

                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">

                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">

                      <svg className="w-5 h-5 mr-2 text-[#0446DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />

                      </svg>

                      Bank Details

                    </h3>



                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      {/* Bank Name */}

                      <div className="space-y-2">

                        <label className="text-sm font-medium text-gray-700">Bank Name</label>

                        <input

                          name="bank_name"

                          value={formData?.bank_name || ""}

                          onChange={handleChange}

                          disabled={!isEditing}

                          placeholder="Enter bank name"

                          className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0446DB] focus:border-[#0446DB] outline-none transition-colors ${isEditing

                            ? 'border-gray-300 bg-white hover:border-gray-400'

                            : 'border-gray-200 bg-gray-50 text-gray-700'

                            }`}

                        />

                      </div>



                      {/* Account Number */}

                      <div className="space-y-2">

                        <label className="text-sm font-medium text-gray-700">Account Number</label>

                        <input

                          name="bank_account_number"

                          value={formData?.bank_account_number || ""}

                          onChange={handleChange}

                          disabled={!isEditing}

                          placeholder="Enter account number"

                          className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0446DB] focus:border-[#0446DB] outline-none transition-colors ${isEditing

                            ? 'border-gray-300 bg-white hover:border-gray-400'

                            : 'border-gray-200 bg-gray-50 text-gray-700'

                            }`}

                        />

                      </div>



                      {/* Branch */}

                      <div className="space-y-2">

                        <label className="text-sm font-medium text-gray-700">Branch</label>

                        <input

                          name="bank_branch"

                          value={formData?.bank_branch || ""}

                          onChange={handleChange}

                          disabled={!isEditing}

                          placeholder="Enter branch name"

                          className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0446DB] focus:border-[#0446DB] outline-none transition-colors ${isEditing

                            ? 'border-gray-300 bg-white hover:border-gray-400'

                            : 'border-gray-200 bg-gray-50 text-gray-700'

                            }`}

                        />

                      </div>



                      {/* IFSC Code */}

                      <div className="space-y-2">

                        <label className="text-sm font-medium text-gray-700">IFSC Code</label>

                        <input

                          name="bank_ifsc_code"

                          value={formData?.bank_ifsc_code || ""}

                          onChange={handleChange}

                          disabled={!isEditing}

                          placeholder="Enter IFSC code"

                          className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0446DB] focus:border-[#0446DB] outline-none transition-colors ${isEditing

                            ? 'border-gray-300 bg-white hover:border-gray-400'

                            : 'border-gray-200 bg-gray-50 text-gray-700'

                            }`}

                        />

                      </div>



                      {/* Cheque Image */}

                      <div className="md:col-span-2 space-y-2">

                        <label className="text-sm font-medium text-gray-700">Cheque Image</label>

                        {!isEditing ? (

                          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">

                            <div className="flex items-center">

                              {popup.cheque_image ? (

                                <>

                                  <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />

                                  </svg>

                                  <span className="text-gray-700">Cheque image uploaded</span>

                                </>

                              ) : (

                                <>

                                  <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />

                                  </svg>

                                  <span className="text-gray-400">No cheque image available</span>

                                </>

                              )}

                            </div>

                            {popup.cheque_image && (

                              <a

                                href={`${baseURL}/${popup.cheque_image}`}

                                target="_blank"

                                rel="noopener noreferrer"

                                className="flex items-center text-[#0446DB] hover:text-[rgb(75,67,182)] transition-colors"

                              >

                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />

                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />

                                </svg>

                                View Image

                              </a>

                            )}

                          </div>

                        ) : (

                          <div className="space-y-3">

                            {popup.cheque_image && (

                              <div className="flex items-center p-3 bg-blue-50 rounded-lg">

                                <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />

                                </svg>

                                <span className="text-sm text-blue-700">Current file will be replaced with new upload</span>

                              </div>

                            )}

                            <input

                              type="file"

                              name="cheque_image"

                              onChange={handleChange}

                              accept="image/\,application/pdf"

                              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-[#0446DB] focus:border-[#0446DB] outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#0446DB] file:text-white hover:file:bg-[rgb(75,67,182)]"

                            />

                            <p className="text-sm text-gray-500">Upload cheque image or PDF (max 5MB)</p>

                          </div>

                        )}

                      </div>

                    </div>

                  </div>



                  {/* Action Buttons */}

                  <div className="pt-4 border-t border-gray-200">

                    <div className="flex justify-end space-x-3">

                      {isEditing ? (

                        <>

                          <button

                            type="button"

                            onClick={() => {

                              setFormData(popup);

                              setIsEditing(false);

                            }}

                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"

                          >

                            Cancel

                          </button>

                          <button

                            type="submit"

                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-medium shadow-sm"

                          >

                            Save Changes

                          </button>

                        </>

                      ) : (

                        <button

                          type="button"

                          onClick={() => setPopup(null)}

                          className="px-6 py-3 bg-gradient-to-r from-[#0446DB] to-[rgb(95,87,202)] text-white rounded-xl hover:from-[rgb(75,67,182)] hover:to-[#0446DB] transition-all font-medium shadow-sm"

                        >

                          Close

                        </button>

                      )}

                    </div>

                  </div>

                </form>

              </div>

            </div>

          </div>

        )}



        {changePasswordPopup && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200">

              {/* Header */}

              <div className="bg-[#0446DB] px-6 py-4">

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

                      FP{changePasswordPopup.id}

                    </p>

                  </div>

                  <div>

                    <label className="block font-medium mb-1">

                      Vendor Name:

                    </label>

                    <p className="bg-gray-100 p-2 rounded">

                      {changePasswordPopup.vendor_name}

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

                    className="bg-[#0446DB] text-white px-5 py-2 rounded-md hover:bg-indigo-800 transition"

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



      )

    }





    </>

  );

}



export default VendorStats;
