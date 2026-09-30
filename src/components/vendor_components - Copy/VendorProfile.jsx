// import axios from 'axios';
// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { toast } from 'react-toastify';
// import Cropper from 'react-easy-crop';
// import {
//   UserIcon,
//   BuildingOfficeIcon,
//   DocumentTextIcon,
//   BanknotesIcon,
//   KeyIcon,
//   CalendarIcon,
//   WalletIcon,
//   CogIcon,
//   ShieldCheckIcon,
//   ClipboardDocumentListIcon,
//   PhotoIcon,
//   CheckBadgeIcon,
//   XMarkIcon,
//   PencilSquareIcon,
//   ChevronDownIcon,
//   ChevronUpIcon
// } from '@heroicons/react/24/outline';

// const baseURL = import.meta.env.VITE_BASE_URL;
// // local uploaded screenshot path provided in conversation (developer note)
// const defaultAvatarPath = '/mnt/data/Screenshot 2025-11-25 at 2.22.38 PM.png';

// const VendorProfile = () => {
//   const [editTabPhone, setEditTabPhone] = useState('phone');
//   const [editPhone, setEditPhone] = useState(false);
//   const [phone, setPhone] = useState('');
//   const [showOTPModal, setShowOTPModal] = useState(false);
//   const [verificationLoading, setVerificationLoading] = useState(false);
//   const [profile, setProfile] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [editForm, setEditForm] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('personal');
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   // File states: these are Files to be appended to FormData on save
//   const [profileImageFile, setProfileImageFile] = useState(null);
//   const [documentFile, setDocumentFile] = useState(null);
//   const [chequeFile, setChequeFile] = useState(null);

//   // Previews (data URLs or object URLs) for immediate UI
//   const [profilePreview, setProfilePreview] = useState(null);
//   const [documentPreview, setDocumentPreview] = useState(null);
//   const [chequePreview, setChequePreview] = useState(null);
//   const inputsRef = useRef([]);
//   const documentTypes = ['aadhar', 'pan', 'voterid', 'passport', 'driving_license'];

//   const getMerchantProfile = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/api/vendor/getVendorProfile`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setProfile(res.data.data || {});
//       setEditForm(res.data.data || {});
//     } catch (err) {
//       console.error('profile', err);
//     }
//   };

//   useEffect(() => {
//     getMerchantProfile();
//   }, []);

//   const handleEdit = () => {
//     setIsEditing(true);
//     setEditForm({ ...profile });
//   };

//   const sendOTP = async () => {
//     try {
//       if (!phone) {
//         toast.error("Please enter a valid phone number");
//         return;
//       }

//       if (profile.phone === phone) {
//         toast.error("Please enter a different number");
//         return;
//       }

//       if (!/^[0-9]{10}$/.test(phone)) {
//         toast.error("Please enter a valid 10-digit phone number");
//         return;
//       }

//       const response = await axios.post(`${baseURL}/api/otp/sendphonenumberchangeotp`, {
//         phone: phone,
//       },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (response.data.success) {
//         toast.success(response.data.message)
//         setShowOTPModal(true);
//         setEditPhone(false);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to send OTP");
//       return;
//     }
//   };

//   const handleResendOTP = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post(`${baseURL}/api/otp/sendpasswordchangeotp`, {
//         phone: phone.replace(/\D/g, '')
//       });

//       if (response.data.success) {
//         toast.success('New OTP sent successfully!');
//         inputsRef.current[0]?.focus();
//       } else {
//         toast.error(response.data.message || 'Failed to resend OTP');
//       }
//     } catch (err) {
//       toast.error('Failed to resend OTP. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyOTP = async (otpCode) => {
//     setVerificationLoading(true);
//     try {
//       const response = await axios.post(`${baseURL}/api/otp/verifyphonenumberchangeotp`, {
//         phone: phone,
//         otp: otpCode
//       },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         toast.success(response.data.message);
//         const formData = new FormData();
//         const fields = [
//           'vendor_name',
//           'email',
//           'profile_image',
//           'company_name',
//           'company_address',
//           'company_city',
//           'company_state',
//           'company_pincode',
//           'company_gst_number',
//           'bank_name',
//           'bank_branch',
//           'bank_account_number',
//           'bank_ifsc_code',
//           'document_type',
//           'document_id'
//         ];

//         fields.forEach((f) => {
//           if (editForm[f] !== undefined && editForm[f] !== null) {
//             if (f === 'profile_image' && typeof editForm[f] === 'string' && editForm[f].startsWith('blob:')) {
//               // Skip blob URLs
//             } else {
//               formData.append(f, editForm[f]);
//             }
//           }
//         });

//         if (profileImageFile) {
//           formData.append('profile_image', profileImageFile);
//         } else if (profile.profile_image) {
//           formData.append('profile_image', profile.profile_image);
//         }

//         if (documentFile) {
//           formData.append('document_image', documentFile);
//         } else if (profile.document_image) {
//           formData.append('document_image', profile.document_image);
//         }

//         if (chequeFile) {
//           formData.append('cheque_image', chequeFile);
//         } else if (profile.cheque_image) {
//           formData.append('cheque_image', profile.cheque_image);
//         }
//         formData.append('phone', phone);
        
//         const res = await axios.post(`${baseURL}/api/vendor/updateVendorInfo`, formData, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         });

//         if (res.data.success) {
//           getMerchantProfile();
//           setTimeout(() => {
//             setVerificationLoading(false);
//             setShowOTPModal(false);
//             toast.success(res.data.message);
//           }, 2000);
//         }
//       }
//     } catch (error) {
//       setVerificationLoading(false);
//       toast.error(error?.response?.data?.message || "Verification failed");
//     }
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setEditForm(profile);
//     setProfileImageFile(null);
//     setDocumentFile(null);
//     setChequeFile(null);
//     setProfilePreview(null);
//     setDocumentPreview(null);
//     setChequePreview(null);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm((p) => ({ ...p, [name]: value }));
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       const fields = [
//         'vendor_name',
//         'email',
//         'phone',
//         'profile_image',
//         'company_name',
//         'company_address',
//         'company_city',
//         'company_state',
//         'company_pincode',
//         'company_gst_number',
//         'bank_name',
//         'bank_branch',
//         'bank_account_number',
//         'bank_ifsc_code',
//         'document_type',
//         'document_id'
//       ];
      
//       fields.forEach((f) => {
//         if (editForm[f] !== undefined && editForm[f] !== null) {
//           if (f === 'profile_image' && typeof editForm[f] === 'string' && editForm[f].startsWith('blob:')) {
//             // Skip blob URLs
//           } else {
//             formData.append(f, editForm[f]);
//           }
//         }
//       });

//       if (profileImageFile) {
//         formData.append('profile_image', profileImageFile);
//       } else if (profile.profile_image) {
//         formData.append('profile_image', profile.profile_image);
//       }

//       if (documentFile) {
//         formData.append('document_image', documentFile);
//       } else if (profile.document_image) {
//         formData.append('document_image', profile.document_image);
//       }

//       if (chequeFile) {
//         formData.append('cheque_image', chequeFile);
//       } else if (profile.cheque_image) {
//         formData.append('cheque_image', profile.cheque_image);
//       }
        
//       const res = await axios.post(`${baseURL}/api/vendor/updateVendorInfo`, formData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       setProfile(res.data.data || {});
//       setIsEditing(false);
//       setProfileImageFile(null);
//       setDocumentFile(null);
//       setChequeFile(null);
//       setProfilePreview(null);
//       setDocumentPreview(null);
//       setChequePreview(null);
//       toast.success(res.data.message || 'Profile updated successfully');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Error updating profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createImage = (url) =>
//     new Promise((resolve, reject) => {
//       const img = new Image();
//       img.setAttribute('crossOrigin', 'anonymous');
//       img.onload = () => resolve(img);
//       img.onerror = (e) => reject(e);
//       img.src = url;
//     });

//   const getCroppedImg = async (imageSrc, pixelCrop) => {
//     const image = await createImage(imageSrc);
//     const canvas = document.createElement('canvas');
//     canvas.width = pixelCrop.width;
//     canvas.height = pixelCrop.height;
//     const ctx = canvas.getContext('2d');

//     ctx.drawImage(
//       image,
//       pixelCrop.x,
//       pixelCrop.y,
//       pixelCrop.width,
//       pixelCrop.height,
//       0,
//       0,
//       pixelCrop.width,
//       pixelCrop.height
//     );

//     return new Promise((resolve) => {
//       canvas.toBlob((blob) => {
//         const file = new File([blob], 'cropped.jpeg', { type: blob.type || 'image/jpeg' });
//         resolve(file);
//       }, 'image/jpeg');
//     });
//   };

//   const CropModal = ({ file, onClose, onCropDone, aspect = 1 }) => {
//     const [crop, setCrop] = useState({ x: 0, y: 0 });
//     const [zoom, setZoom] = useState(1);
//     const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

//     const onCropComplete = useCallback((croppedArea, croppedPixels) => {
//       setCroppedAreaPixels(croppedPixels);
//     }, []);

//     const handleSave = async () => {
//       try {
//         const url = URL.createObjectURL(file);
//         const croppedFile = await getCroppedImg(url, croppedAreaPixels);
//         onCropDone(croppedFile);
//       } catch (err) {
//         toast.error('Could not crop image');
//       } finally {
//         onClose();
//       }
//     };

//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//         <div className="bg-white rounded-lg w-[92%] max-w-lg p-4">
//           <h3 className="text-lg font-semibold mb-3">Crop Image</h3>
//           <div className="relative w-full h-64 bg-gray-100">
//             <Cropper
//               image={URL.createObjectURL(file)}
//               crop={crop}
//               zoom={zoom}
//               aspect={aspect}
//               onCropChange={setCrop}
//               onZoomChange={setZoom}
//               onCropComplete={onCropComplete}
//             />
//           </div>

//           <div className="mt-3">
//             <input
//               type="range"
//               min={1}
//               max={3}
//               step={0.05}
//               value={zoom}
//               onChange={(e) => setZoom(Number(e.target.value))}
//               className="w-full"
//             />
//           </div>

//           <div className="flex justify-end gap-2 mt-4">
//             <button onClick={onClose} className="px-3 py-2 bg-gray-200 rounded">
//               Cancel
//             </button>
//             <button onClick={handleSave} className="px-3 py-2 bg-blue-600 text-white rounded">
//               Crop & Save
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const UploadWithCrop = ({ label, accept = 'image/*,.pdf', type = 'profile' }) => {
//     const [rawFile, setRawFile] = useState(null);
//     const [showCrop, setShowCrop] = useState(false);

//     const handleSelect = (e) => {
//       const f = e?.target?.files ? e.target.files[0] : e;
//       if (!f) return;

//       if (!f.type.startsWith('image/')) {
//         attachFileDirectly(f);
//         return;
//       }

//       setRawFile(f);
//       setShowCrop(true);
//     };

//     const attachFileDirectly = (file) => {
//       const objectUrl = URL.createObjectURL(file);
//       if (type === 'profile') {
//         setProfileImageFile(file);
//         setProfilePreview(objectUrl);
//         setEditForm((p) => ({ ...p, profile_image: objectUrl }));
//       } else if (type === 'document') {
//         setDocumentFile(file);
//         setDocumentPreview(objectUrl);
//         setEditForm((p) => ({ ...p, document_image: objectUrl }));
//       } else if (type === 'cheque') {
//         setChequeFile(file);
//         setChequePreview(objectUrl);
//         setEditForm((p) => ({ ...p, cheque_image: objectUrl }));
//       }
//     };

//     const handleCropDone = (croppedFile) => {
//       attachFileDirectly(croppedFile);
//     };

//     const previewSrc =
//       (type === 'profile' && (profilePreview || (profile.profile_image ? `${baseURL}/${profile.profile_image}` : null))) ||
//       (type === 'document' && (documentPreview || (profile.document_image ? `${baseURL}/${profile.document_image}` : null))) ||
//       (type === 'cheque' && (chequePreview || (profile.cheque_image ? `${baseURL}/${profile.cheque_image}` : null))) ||
//       null;

//     return (
//       <div className="space-y-3">
//         <label className="block text-sm font-medium text-gray-700">{label}</label>
//         <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
//           <label className="flex-1 cursor-pointer">
//             <input
//               type="file"
//               accept={accept}
//               onChange={handleSelect}
//               className="hidden"
//             />
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-blue-500 transition-colors">
//               <PhotoIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
//               <p className="text-xs sm:text-sm text-gray-600">Click to upload {label}</p>
//               <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</p>
//             </div>
//           </label>

//           {previewSrc && (
//             <div className="flex-shrink-0 flex justify-center sm:justify-start">
//               {previewSrc.endsWith('.pdf') ? (
//                 <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-lg border flex items-center justify-center">
//                   <DocumentTextIcon className="w-8 h-8 text-red-600" />
//                   <span className="text-xs text-red-600 mt-1">PDF</span>
//                 </div>
//               ) : (
//                 <img
//                   src={previewSrc}
//                   alt={label}
//                   className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border"
//                 />
//               )}
//             </div>
//           )}
//         </div>

//         {showCrop && rawFile && (
//           <CropModal
//             file={rawFile}
//             onClose={() => {
//               setShowCrop(false);
//               setRawFile(null);
//             }}
//             onCropDone={(croppedFile) => {
//               setShowCrop(false);
//               setRawFile(null);
//               handleCropDone(croppedFile);
//             }}
//             aspect={1}
//           />
//         )}
//       </div>
//     );
//   };

//   const OTPModal = ({
//     isOpen,
//     onClose,
//     onVerify,
//     onResend,
//     phoneNumber,
//     loading = false
//   }) => {
//     const [otp, setOtp] = useState(['', '', '', '']);
//     const [timeLeft, setTimeLeft] = useState(180);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const [isResendDisabled, setIsResendDisabled] = useState(false);

//     const otpInputsRef = useRef([]);

//     useEffect(() => {
//       otpInputsRef.current = otpInputsRef.current.slice(0, 4);
//     }, []);

//     useEffect(() => {
//       if (timeLeft > 0 && isOpen) {
//         const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//         return () => clearTimeout(timer);
//       }
//     }, [timeLeft, isOpen]);

//     useEffect(() => {
//       if (isOpen) {
//         setOtp(['', '', '', '']);
//         setTimeLeft(180);
//         setError('');
//         setSuccess('');
//         setIsResendDisabled(false);

//         setTimeout(() => {
//           if (otpInputsRef.current[0]) {
//             otpInputsRef.current[0].focus();
//           }
//         }, 100);
//       }
//     }, [isOpen]);

//     const formatTime = (seconds) => {
//       const minutes = Math.floor(seconds / 60);
//       const remainingSeconds = seconds % 60;
//       return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//     };

//     const handleInputChange = (index, value) => {
//       const numericValue = value.replace(/\D/g, '');

//       if (numericValue.length <= 1) {
//         const newOtp = [...otp];
//         newOtp[index] = numericValue;
//         setOtp(newOtp);

//         if (numericValue && index < 3) {
//           otpInputsRef.current[index + 1]?.focus();
//         }
//       }

//       if (error) setError('');
//     };

//     const handleKeyDown = (index, e) => {
//       if (e.key === 'Backspace' && !otp[index] && index > 0) {
//         otpInputsRef.current[index - 1]?.focus();
//       }
//     };

//     const handlePaste = (e) => {
//       e.preventDefault();
//       const pasteData = e.clipboardData.getData('text').replace(/\D/g, '');
//       if (pasteData.length === 4) {
//         const newOtp = pasteData.split('').slice(0, 4);
//         setOtp(newOtp);
//         otpInputsRef.current[3]?.focus();
//       }
//     };

//     const handleVerify = () => {
//       if (otp.join('').length === 4) {
//         onVerify(otp.join(''));
//       }
//     };

//     const handleResendOTP = async () => {
//       if (!isResendDisabled && timeLeft <= 0) {
//         try {
//           const response = await axios.post(`${baseURL}/api/otp/sendphonenumberchangeotp`, {
//             phone: phone,
//           },
//             {
//               headers: {
//                 "Content-Type": "application/json",
//               },
//             }
//           );
//           if (response.data.success) {
//             toast.success(response.data.message);
//             setTimeLeft(180);
//             setIsResendDisabled(true);
//             setTimeout(() => setIsResendDisabled(false), 30000);
//             onResend?.();
//           }
//         } catch (error) {
//           toast.error(error.response?.data?.message || "Failed to resend OTP");
//         }
//       }
//     };

//     const handleBackdropClick = (e) => {
//       if (e.target === e.currentTarget) {
//         onClose();
//       }
//     };

//     if (!isOpen) return null;

//     return (
//       <div
//         className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
//         onClick={handleBackdropClick}
//       >
//         <div className="bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all duration-300 scale-100">
//           <div className="flex items-center justify-between p-6 border-b border-gray-100">
//             <h2 className="text-xl font-semibold text-gray-800">Verify Phone Number</h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           <div className="p-6">
//             <div className="text-center mb-6">
//               <div className="w-16 h-16 bg-[#0446DB] rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                 </svg>
//               </div>
//               <h1 className="text-2xl font-bold text-[#0446DB] mb-2">
//                 Verify OTP
//               </h1>
//               <p className="text-gray-800 mb-1">
//                 Enter the code sent to
//               </p>
//               <p className="text-[#0446DB] font-semibold">{phoneNumber}</p>
//             </div>

//             <div className={`text-lg font-semibold text-center mb-6 ${timeLeft > 0 ? 'text-orange-400' : 'text-red-400'}`}>
//               {timeLeft > 0
//                 ? `Time remaining: ${formatTime(timeLeft)}`
//                 : "Code expired"
//               }
//             </div>

//             <div className="flex justify-center gap-3 mb-6">
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   ref={(el) => (otpInputsRef.current[index] = el)}
//                   type="text"
//                   value={digit}
//                   onChange={(e) => handleInputChange(index, e.target.value)}
//                   onKeyDown={(e) => handleKeyDown(index, e)}
//                   onPaste={handlePaste}
//                   disabled={timeLeft <= 0 || loading}
//                   className="w-14 h-14 text-center text-xl font-semibold text-[#0446DB] border-2 border-[#0446DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                   style={{
//                     WebkitAppearance: 'none',
//                     MozAppearance: 'textfield'
//                   }}
//                 />
//               ))}
//             </div>

//             {error && (
//               <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
//                 <p className="text-red-700 text-sm font-medium">{error}</p>
//               </div>
//             )}

//             {success && (
//               <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
//                 <p className="text-green-700 text-sm font-medium">{success}</p>
//               </div>
//             )}

//             <div className="flex flex-col sm:flex-row gap-3">
//               <button
//                 onClick={handleVerify}
//                 disabled={otp.join('').length !== 4 || loading || timeLeft <= 0}
//                 className="flex-1 py-3 bg-[#0446DB] disabled:bg-[rgb(88,82,164)] text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
//               >
//                 {loading ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Verifying...
//                   </>
//                 ) : (
//                   'Verify'
//                 )}
//               </button>

//               <button
//                 onClick={handleResendOTP}
//                 disabled={isResendDisabled || loading || timeLeft > 0}
//                 className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed"
//               >
//                 Resend Code
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const tabs = [
//     { id: 'personal', label: 'Personal Info', icon: UserIcon },
//     { id: 'company', label: 'Company', icon: BuildingOfficeIcon },
//     { id: 'documents', label: 'Company KYC', icon: DocumentTextIcon },
//     { id: 'bank', label: 'Bank Details', icon: BanknotesIcon },
//   ];

//   const KYC = () => {
//     const [kycCompanyType, setCompanyType] = useState('');
//     const [kycProfile, setKycProfile] = useState({});
//     const [kycEditForm, setKycEditForm] = useState({});
//     const [kycIsEditing, setKycIsEditing] = useState(false);
//     const [kycLoading, setKycLoading] = useState(false);

//     const getMerchantKYCProfile = async () => {
//       try {
//         const res = await axios.get(`${baseURL}/api/vendor/getVendorProfile`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         setKycProfile(res.data.data || {});
//         setKycEditForm(res.data.data || {});
//         if (res.data.data?.company_type) {
//           setCompanyType(res.data.data.company_type);
//         }
//       } catch (err) {
//         console.error('profile', err);
//       }
//     };

//     useEffect(() => {
//       getMerchantKYCProfile();
//     }, []);

//     const handleEdit = () => {
//       setKycIsEditing(true);
//       setKycEditForm({ ...kycProfile });
//     };

//     const handleCancel = () => {
//       setKycIsEditing(false);
//       setKycEditForm(kycProfile);
//       setCompanyType(kycProfile.company_type || '');
//     };

//     const handleChange = (e) => {
//       const { name, value } = e.target;
//       setKycEditForm((p) => ({ ...p, [name]: value }));
//     };

//     const handleFileChange = (e) => {
//       const { name, files } = e.target;
//       if (files && files[0]) {
//         setKycEditForm((p) => ({ ...p, [name]: files[0] }));
//       }
//     };

//     const handleSave = async () => {
//       setKycLoading(true);
//       try {
//         const formData = new FormData();
//         formData.append('company_type', kycCompanyType);

//         const fields = [
//           'document_type',
//           'document_id',
//           'company_pancard_name',
//           'supporting_document_id',
//           'supporting_document_type'
//         ];

//         fields.forEach((f) => {
//           if (kycEditForm[f] !== undefined && kycEditForm[f] !== null) {
//             formData.append(f, kycEditForm[f]);
//           }
//         });

//         if (kycCompanyType === "sole Proprietorship") {
//           if (kycEditForm.document_image instanceof File) {
//             formData.append('document_image', kycEditForm.document_image);
//           } else if (kycProfile.document_image) {
//             formData.append('document_image', kycProfile.document_image);
//           }
//         } else if (kycCompanyType === "partnership" || 
//                    kycCompanyType === "limited liability partnership" || 
//                    kycCompanyType === "private limited company" || 
//                    kycCompanyType === "public limited company") {
//           if (kycEditForm.company_pancard_image instanceof File) {
//             formData.append('company_pancard_image', kycEditForm.company_pancard_image);
//           } else if (kycProfile.company_pancard_image) {
//             formData.append('company_pancard_image', kycProfile.company_pancard_image);
//           }

//           if (kycEditForm.supporting_document_image instanceof File) {
//             formData.append('supporting_document_image', kycEditForm.supporting_document_image);
//           } else if (kycProfile.supporting_document_image) {
//             formData.append('supporting_document_image', kycProfile.supporting_document_image);
//           }
//         }
//         const res = await axios.post(`${baseURL}/api/vendor/updateVendorInfo`, formData, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         });
     
//         setKycProfile(res.data.data || {});
//         setKycIsEditing(false);
//         toast.success(res.data.message || 'KYC updated successfully');
//       } catch (err) {
//         toast.error(err.response?.data?.message || 'Error updating KYC');
//       } finally {
//         setKycLoading(false);
//       }
//     };

//     const renderKYCForm = () => {
//       switch (kycCompanyType) {
//         case "sole Proprietorship":
//           return (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Document Type <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="document_type"
//                   value={kycEditForm.document_type || ''}
//                   onChange={handleChange}
//                   disabled={!kycIsEditing}
//                   className="border border-[#0446DB] py-2 px-3 w-full rounded text-[#0446DB] disabled:bg-gray-100 disabled:cursor-not-allowed"
//                   required
//                 >
//                   <option value="">Select Document Type</option>
//                   {documentTypes.map((type) => (
//                     <option key={type} value={type}>
//                       {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Document ID <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="document_id"
//                   value={kycEditForm.document_id || ''}
//                   onChange={handleChange}
//                   disabled={!kycIsEditing}
//                   className="border border-[#0446DB] py-2 px-3 w-full rounded text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                   placeholder="Enter document ID"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Upload Document Image <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="file"
//                   name="document_image"
//                   onChange={handleFileChange}
//                   disabled={!kycIsEditing}
//                   accept="image/*,.pdf"
//                   className="border border-[#0446DB] py-2 px-3 w-full rounded text-[#0446DB] disabled:bg-gray-100 disabled:cursor-not-allowed"
//                 />
//                 {kycProfile.document_image && !kycEditForm.document_image && (
//                   <p className="text-sm text-green-600 mt-1">
//                     Current file: {kycProfile.document_image}
//                   </p>
//                 )}
//               </div>
//             </div>
//           );
//         case "partnership":
//         case "limited liability partnership":
//         case "private limited company":
//         case "public limited company":
//           return (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Company PAN Card Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="company_pancard_name"
//                   value={kycEditForm.company_pancard_name || ''}
//                   onChange={handleChange}
//                   disabled={!kycIsEditing}
//                   className="border border-[#0446DB] py-2 px-3 w-full rounded text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                   placeholder="Enter name as on PAN card"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Upload PAN Card Image <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="file"
//                   name="company_pancard_image"
//                   onChange={handleFileChange}
//                   disabled={!kycIsEditing}
//                   accept="image/*,.pdf"
//                   className="border border-[#0446DB] py-2 px-3 w-full rounded text-[#0446DB] disabled:bg-gray-100 disabled:cursor-not-allowed"
//                 />
//                 {kycProfile.company_pancard_image && !kycEditForm.company_pancard_image && (
//                   <p className="text-sm text-green-600 mt-1">
//                     Current file: {kycProfile.company_pancard_image}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Supporting Document Type <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="supporting_document_type"
//                   value={kycEditForm.supporting_document_type || ''}
//                   onChange={handleChange}
//                   disabled={!kycIsEditing}
//                   className="border border-[#0446DB] py-2 px-3 w-full rounded text-[#0446DB] disabled:bg-gray-100 disabled:cursor-not-allowed"
//                   required
//                 >
//                   <option value="">Select Document Type</option>
//                   <option value="bank_account_statement">Bank Account Statement</option>
//                   <option value="electricity_bill">Electricity Bill</option>
//                   <option value="lease_rent_agreement">Lease / Rent Agreement</option>
//                   <option value="telephone_bill">Telephone Bill</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Supporting Document ID <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="supporting_document_id"
//                   value={kycEditForm.supporting_document_id || ''}
//                   onChange={handleChange}
//                   disabled={!kycIsEditing}
//                   className="border border-[#0446DB] py-2 px-3 w-full rounded text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                   placeholder="Enter document ID"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Upload Supporting Document <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="file"
//                   name="supporting_document_image"
//                   onChange={handleFileChange}
//                   disabled={!kycIsEditing}
//                   accept="image/*,.pdf"
//                   className="border border-[#0446DB] py-2 px-3 w-full rounded text-[#0446DB] disabled:bg-gray-100 disabled:cursor-not-allowed"
//                 />
//                 {kycProfile.supporting_document_image && !kycEditForm.supporting_document_image && (
//                   <p className="text-sm text-green-600 mt-1">
//                     Current file: {kycProfile.supporting_document_image}
//                   </p>
//                 )}
//               </div>
//             </div>
//           );

//         default:
//           return (
//             <div className="text-center py-8">
//               <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-500">Please select a company type to view KYC requirements</p>
//             </div>
//           );
//       }
//     };

//     return (
//       <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto">
//           {kycProfile.kyc_verified === 1 ? (
//             <div className="w-full max-w-md mx-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-center gap-4">
//               <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={2}
//                   stroke="white"
//                   className="w-8 h-8"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-lg font-semibold">KYC Verified</p>
//                 <p className="text-sm opacity-90">Your KYC is successfully completed.</p>
//               </div>
//             </div>
//           ) : (
//             <>
//               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 mb-8">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-4">
//                     <div className="p-3 bg-blue-100 rounded-xl">
//                       <DocumentTextIcon className="w-8 h-8 text-blue-600" />
//                     </div>
//                     <div>
//                       <h1 className="text-xl lg:text-3xl font-bold text-gray-900">KYC Verification</h1>
//                       <p className="text-gray-600 mt-1">Complete your Know Your Customer verification</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     {!kycIsEditing ? (
//                       <button
//                         onClick={handleEdit}
//                         className="flex items-center space-x-2 bg-[#0446DB] text-white px-6 py-3 rounded-xl hover:bg-[rgb(70,65,180)] transition-colors shadow-lg shadow-blue-100"
//                       >
//                         <span>Edit KYC</span>
//                       </button>
//                     ) : (
//                       <div className="flex flex-col md:flex-row gap-2">
//                         <button
//                           onClick={handleSave}
//                           disabled={kycLoading}
//                           className="flex items-center space-x-2 bg-[#0446DB] text-white px-6 py-2 rounded-xl transition-colors disabled:opacity-50"
//                         >
//                           {kycLoading ? 'Saving...' : 'Save Changes'}
//                         </button>
//                         <button
//                           onClick={handleCancel}
//                           className="flex items-center text-center space-x-2 bg-gray-600 text-white px-6 py-2 rounded-xl hover:bg-gray-700 transition-colors"
//                         >
//                           <span>Cancel</span>
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
//                 <div className="mb-6">
//                   <h2 className="text-xl font-bold text-gray-900 mb-2">Company Information</h2>
//                   <p className="text-gray-600">Select your company type to view specific KYC requirements</p>
//                 </div>

//                 <div className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Select Type of Company <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       value={kycCompanyType}
//                       onChange={(e) => setCompanyType(e.target.value)}
//                       disabled={!kycIsEditing}
//                       className="border border-[#0446DB] py-3 px-4 w-full rounded text-[#0446DB] disabled:bg-gray-100 disabled:cursor-not-allowed"
//                       required
//                     >
//                       <option value="">Select Company Type</option>
//                       <option value="sole Proprietorship">Sole Proprietorship</option>
//                       <option value="partnership">Partnership</option>
//                       <option value="limited liability partnership">Limited Liability Partnership</option>
//                       <option value="public limited company">Public Limited Company</option>
//                       <option value="private limited company">Private Limited Company</option>
//                     </select>
//                   </div>

//                   {kycCompanyType && (
//                     <div className="border-t pt-6">
//                       <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                         {kycCompanyType.charAt(0).toUpperCase() + kycCompanyType.slice(1)} KYC Requirements
//                       </h3>
//                       {renderKYCForm()}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderTabContent = () => {
//     const currentData = isEditing ? editForm : profile;

//     switch (activeTab) {
//       case 'personal':
//         return (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">
//                 Full Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="vendor_name"
//                 value={currentData.vendor_name || ''}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//                 className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">
//                 Email <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={currentData.email || ''}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//                 className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">
//                 Phone <span className="text-red-500">*</span>
//               </label>
//               <div>
//                 {editPhone ? (
//                   <div className="space-y-4">
//                     <div className="flex gap-3 items-start">
//                       <div className="flex-1">
//                         <div className="relative">
//                           <input
//                             type="tel"
//                             name="phone"
//                             onChange={(e) => setPhone(e.target.value)}
//                             placeholder="Enter your phone number"
//                             className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
//                             autoFocus
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex gap-2">
//                       <button
//                         onClick={sendOTP}
//                         className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0446DB] text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-green-200"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                         </svg>
//                         Send OTP
//                       </button>
//                       <button
//                         onClick={() => setEditPhone(false)}
//                         className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="relative flex items-center gap-1">
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={currentData.phone || ''}
//                       onChange={handleChange}
//                       disabled={true}
//                       className="w-full px-1 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 transition-colors pl-4"
//                     />
//                     <svg
//                       onClick={() => setEditPhone(true)}
//                       className="w-6 h-6 cursor-pointer text-[#0446DB]"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
//                     </svg>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {isEditing ? (
//               <UploadWithCrop label="Profile Image" accept="image/*" type="profile" />
//             ) : (
//               <div className="space-y-3">
//                 <label className="block text-sm font-medium text-gray-700">Profile Image</label>
//                 {profilePreview || currentData.profile_image ? (
//                   <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
//                     <img
//                       src={
//                         profilePreview
//                           ? profilePreview
//                           : currentData.profile_image
//                             ? `${baseURL}/${currentData.profile_image}`
//                             : defaultAvatarPath
//                       }
//                       alt="Profile"
//                       className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg mx-auto sm:mx-0"
//                     />
//                   </div>
//                 ) : (
//                   <p className="text-gray-500 text-sm text-center sm:text-left">No photo uploaded</p>
//                 )}
//               </div>
//             )}
//           </div>
//         );

//       case 'company':
//         return (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//             {[
//               { label: 'Company Name', name: 'company_name' },
//               { label: 'GST Number', name: 'company_gst_number' },
//               { label: 'Company Address', name: 'company_address' },
//               { label: 'City', name: 'company_city' },
//               { label: 'State', name: 'company_state' },
//               { label: 'Pincode', name: 'company_pincode' }
//             ].map((field) => (
//               <div key={field.name} className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">{field.label}</label>
//                 <input
//                   type="text"
//                   name={field.name}
//                   value={currentData[field.name] || ''}
//                   onChange={handleChange}
//                   disabled={!isEditing}
//                   className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
//                 />
//               </div>
//             ))}
//           </div>
//         );

//       case 'documents':
//         return <KYC />;

//       case 'bank':
//         return (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//               {[
//                 { label: 'Bank Name', name: 'bank_name' },
//                 { label: 'Account Number', name: 'bank_account_number' },
//                 { label: 'IFSC Code', name: 'bank_ifsc_code' },
//                 { label: 'Branch', name: 'bank_branch' }
//               ].map((field) => (
//                 <div key={field.name} className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">{field.label}</label>
//                   <input
//                     type="text"
//                     name={field.name}
//                     value={currentData[field.name] || ''}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
//                   />
//                 </div>
//               ))}
//             </div>

//             {isEditing ? (
//               <UploadWithCrop label="Cheque Image" accept="image/*,.pdf" type="cheque" />
//             ) : (
//               <div className="space-y-3">
//                 <label className="block text-sm font-medium text-gray-700">Cheque Image</label>
//                 {chequePreview || currentData.cheque_image ? (
//                   <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
//                     <img
//                       src={chequePreview ? chequePreview : currentData.cheque_image ? `${baseURL}/${currentData.cheque_image}` : defaultAvatarPath}
//                       alt="Cheque"
//                       className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border mx-auto sm:mx-0"
//                     />
//                     {currentData.cheque_image && !chequePreview && (
//                       <a
//                         href={`${baseURL}/${currentData.cheque_image}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 hover:text-blue-700 text-sm font-medium text-center sm:text-left"
//                       >
//                         View Full Image
//                       </a>
//                     )}
//                   </div>
//                 ) : (
//                   <p className="text-gray-500 text-sm text-center sm:text-left">No cheque image uploaded</p>
//                 )}
//               </div>
//             )}
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
//       <div className=" mx-auto">
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
//             <div className="flex items-center space-x-3 sm:space-x-4 mb-4 lg:mb-0">
//               <div className="p-2 sm:p-3 rounded-xl">
//                 {profilePreview || profile?.profile_image ? (
//                   <img
//                     src={
//                       profilePreview
//                         ? profilePreview
//                         : profile.profile_image
//                           ? `${baseURL}/${profile.profile_image}`
//                           : defaultAvatarPath
//                     }
//                     alt="Profile"
//                     className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
//                   />
//                 ) : (
//                   <UserIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
//                 )}
//               </div>

//               <div>
//                 <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{profile?.vendor_name}</h1>
//                 <p className="text-gray-600 mt-1 text-xs sm:text-sm">Manage your account information and preferences</p>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center gap-3">
//               <div className="flex items-center space-x-2 sm:space-x-3">
//                 <span
//                   className={`inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${profile.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                     }`}
//                 >
//                   <ShieldCheckIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
//                   {profile.is_active ? 'Active' : 'Inactive'}
//                 </span>
//               </div>

//               {!isEditing ? (
//                 <button
//                   onClick={handleEdit}
//                   className="flex items-center space-x-1 sm:space-x-2 bg-[#0446DB] text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-[#0446DB] transition-colors shadow-lg shadow-blue-100 text-sm sm:text-base"
//                 >
//                   <PencilSquareIcon className="w-4 h-4 sm:w-5 sm:h-5" />
//                   <span>Edit Profile</span>
//                 </button>
//               ) : (
//                 <div className="flex gap-2 sm:gap-3">
//                   <button
//                     onClick={handleSave}
//                     disabled={loading}
//                     className="flex items-center space-x-1 sm:space-x-2 bg-green-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
//                   >
//                     {loading ? 'Saving...' : 'Save Changes'}
//                   </button>
//                   <button
//                     onClick={handleCancel}
//                     className="flex items-center space-x-1 sm:space-x-2 bg-gray-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-gray-700 transition-colors text-sm sm:text-base"
//                   >
//                     <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
//                     <span>Cancel</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
//           <div className="lg:hidden">
//             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="w-full flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
//               <span className="text-lg font-semibold text-gray-900">{tabs.find((t) => t.id === activeTab)?.label}</span>
//               {mobileMenuOpen ? <ChevronUpIcon className="w-5 h-5 text-gray-600" /> : <ChevronDownIcon className="w-5 h-5 text-gray-600" />}
//             </button>
//           </div>

//           {mobileMenuOpen && (
//             <div className="lg:hidden">
//               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
//                 <nav className="space-y-2">
//                   {tabs.map((tab) => (
//                     <button
//                       key={tab.id}
//                       onClick={() => {
//                         setActiveTab(tab.id);
//                         setMobileMenuOpen(false);
//                       }}
//                       className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === tab.id ? 'bg-[#0446DB] text-white shadow-lg shadow-blue-100' : 'text-gray-600 hover:text-[#0446DB] hover:bg-blue-50'
//                         }`}
//                     >
//                       <tab.icon className="w-5 h-5" />
//                       <span>{tab.label}</span>
//                     </button>
//                   ))}
//                 </nav>
//               </div>
//             </div>
//           )}

//           <div className="hidden lg:block lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
//               <nav className="space-y-2">
//                 {tabs.map((tab) => (
//                   <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === tab.id ? 'bg-[#0446DB] text-white shadow-lg shadow-blue-100' : 'text-gray-600 hover:text-[#0446DB] hover:bg-blue-50'
//                       }`}
//                   >
//                     <tab.icon className="w-5 h-5" />
//                     <span>{tab.label}</span>
//                   </button>
//                 ))}
//               </nav>
//             </div>
//           </div>

//           <div className={`${mobileMenuOpen ? 'hidden lg:block' : ''} lg:col-span-3`}>
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
//               <div className="flex items-center justify-between mb-6 sm:mb-8">
//                 <div>
//                   <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{tabs.find((t) => t.id === activeTab)?.label}</h2>
//                 </div>

//                 {isEditing && (
//                   <div className="flex items-center space-x-2 text-sm text-[#0446DB]">
//                     <CogIcon className="w-4 h-4" />
//                     <span className="hidden sm:inline">Editing Mode</span>
//                   </div>
//                 )}
//               </div>

//               <div className="space-y-4 sm:space-y-6">{renderTabContent()}</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <OTPModal
//         isOpen={showOTPModal}
//         onClose={() => setShowOTPModal(false)}
//         onVerify={verifyOTP}
//         onResend={handleResendOTP}
//         phoneNumber={phone}
//         loading={verificationLoading}
//       />
//     </div>
//   );
// };

// export default VendorProfile;


import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  UserIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  XMarkIcon,
  PencilSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
  ArrowUpTrayIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const baseURL = import.meta.env.VITE_BASE_URL;

const documentTypes = [
  "aadhar",
  "pan",
  "voterid",
  "passport",
  "driving_license",
];

const companyTypes = [
  "sole Proprietorship",
  "partnership",
  "limited liability partnership",
  "private limited company",
  "public limited company",
];

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const inputClass = `
  h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5
  text-sm font-medium text-gray-900 outline-none transition-all
  placeholder:text-gray-400 hover:border-gray-300
  focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10
  disabled:cursor-default disabled:border-gray-100 disabled:bg-gray-50
  disabled:text-gray-600
`;

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-gray-500";

const primaryButton = `
  inline-flex h-10 items-center justify-center gap-2 rounded-lg
  bg-[#0446DB] px-4 text-sm font-semibold text-white shadow-sm
  transition-all hover:bg-[#0339B5] active:scale-[0.98]
  disabled:cursor-not-allowed disabled:opacity-50
`;

const secondaryButton = `
  inline-flex h-10 items-center justify-center gap-2 rounded-lg
  border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700
  transition-all hover:bg-gray-50 active:scale-[0.98]
  disabled:cursor-not-allowed disabled:opacity-50
`;

function resolveFileUrl(path) {
  if (!path) return "";
  if (path.startsWith("blob:") || path.startsWith("data:") || path.startsWith("http")) {
    return path;
  }
  return `${baseURL}/${String(path).replace(/^\/+/, "")}`;
}

function Field({ label, name, value, onChange, disabled, type = "text", placeholder = "" }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, disabled, children, required }) {
  return (
    <div>
      <label className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={inputClass}
      >
        {children}
      </select>
    </div>
  );
}

function UploadWithCrop({
  label,
  accept = "image/*,.pdf",
  currentPath,
  preview,
  onFileReady,
  disabled,
}) {
  const previewSrc = preview || resolveFileUrl(currentPath);
  const isPdf =
    previewSrc?.toLowerCase().includes(".pdf") ||
    previewSrc?.toLowerCase().startsWith("data:application/pdf");

  const selectFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    const allowedImage = file.type.startsWith("image/");
    const allowedPdf = file.type === "application/pdf";

    if (!allowedImage && !allowedPdf) {
      toast.error("Please select a valid image or PDF file");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onFileReady(file, previewUrl);
  };

  return (
    <div>
      <label className={labelClass}>{label}</label>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <label
          className={`
            flex min-h-[116px] cursor-pointer flex-col items-center justify-center
            rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-4
            text-center transition hover:border-[#0446DB] hover:bg-blue-50/40
            ${disabled ? "pointer-events-none opacity-60" : ""}
          `}
        >
          <input
            type="file"
            accept={accept}
            onChange={selectFile}
            className="hidden"
            disabled={disabled}
          />

          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white">
            <ArrowUpTrayIcon className="h-5 w-5 text-[#0446DB]" />
          </div>

          <p className="text-sm font-semibold text-gray-700">
            Click to upload {label.toLowerCase()}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            PNG, JPG or PDF · Maximum 10MB
          </p>
        </label>

        {previewSrc && (
          <div className="flex min-h-[116px] min-w-[116px] items-center justify-center rounded-xl border border-gray-200 bg-white p-2">
            {isPdf ? (
              <a
                href={previewSrc}
                target="_blank"
                rel="noreferrer"
                className="flex h-24 w-24 flex-col items-center justify-center rounded-lg bg-red-50 text-red-600"
              >
                <DocumentTextIcon className="h-8 w-8" />
                <span className="mt-1 text-xs font-bold">View PDF</span>
              </a>
            ) : (
              <img
                src={previewSrc}
                alt={label}
                className="h-24 w-24 rounded-lg object-cover"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function OTPModal({ isOpen, onClose, onVerify, phoneNumber, loading }) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);
  const [resending, setResending] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setOtp("");
    setTimeLeft(180);
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(timer);
  }, [isOpen, timeLeft]);

  const formatTime = (seconds) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  const resend = async () => {
    if (timeLeft > 0 || resending) return;
    setResending(true);
    try {
      const response = await axios.post(
        `${baseURL}/api/otp/sendphonenumberchangeotp`,
        { phone: phoneNumber },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response?.data?.success) {
        toast.success(response.data.message || "OTP sent successfully");
        setOtp("");
        setTimeLeft(180);
        setTimeout(() => inputRef.current?.focus(), 100);
      } else {
        toast.error(response?.data?.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Verify phone number</h2>
            <p className="mt-0.5 text-xs text-gray-500">Confirm your new mobile number.</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0446DB]">
            <ShieldCheckIcon className="h-6 w-6" />
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900">Enter verification code</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              We sent a 4-digit OTP to{" "}
              <span className="font-semibold text-gray-900">+91 {phoneNumber}</span>
            </p>
          </div>

          <div
            className="relative mx-auto mt-6 max-w-[320px] cursor-text"
            onClick={() => timeLeft > 0 && inputRef.current?.focus()}
          >
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && otp.length === 4 && timeLeft > 0) onVerify(otp);
              }}
              maxLength={4}
              disabled={loading || timeLeft <= 0}
              className="absolute inset-0 z-10 h-14 w-full opacity-0"
            />

            <div className="pointer-events-none grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((index) => {
                const digit = otp[index] || "";
                const active = otp.length === index || (otp.length === 4 && index === 3);
                return (
                  <div
                    key={index}
                    className={`
                      flex h-14 items-center justify-center rounded-xl border-2
                      text-xl font-bold text-gray-900 transition-all
                      ${
                        active && timeLeft > 0
                          ? "border-[#0446DB] bg-white ring-4 ring-blue-50"
                          : digit
                          ? "border-blue-200 bg-blue-50/60"
                          : "border-gray-200 bg-gray-50"
                      }
                    `}
                  >
                    {digit}
                    {active && !digit && timeLeft > 0 && (
                      <span className="h-6 w-[2px] animate-pulse bg-[#0446DB]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <p className={`mt-4 text-center text-xs font-semibold ${timeLeft > 0 ? "text-gray-500" : "text-red-600"}`}>
            {timeLeft > 0 ? (
              <>Code expires in <span className="text-[#0446DB]">{formatTime(timeLeft)}</span></>
            ) : (
              "Verification code has expired."
            )}
          </p>

          <button
            onClick={() => onVerify(otp)}
            disabled={loading || otp.length !== 4 || timeLeft <= 0}
            className={`${primaryButton} mt-6 w-full`}
          >
            {loading ? (
              <>
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4" />
                Verify & Update
              </>
            )}
          </button>

          <button
            onClick={resend}
            disabled={resending || timeLeft > 0}
            className={`${secondaryButton} mt-2 w-full`}
          >
            <ArrowPathIcon className={`h-4 w-4 ${resending ? "animate-spin" : ""}`} />
            {timeLeft > 0 ? `Resend in ${formatTime(timeLeft)}` : resending ? "Sending..." : "Resend Code"}
          </button>

          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-3">
            <p className="text-xs leading-5 text-blue-800">
              Never share this verification code with anyone. Daakit will not ask you for the OTP over a call.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function KYCSection() {
  const [companyType, setCompanyType] = useState("");
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const isKycVerified =
    profile?.kyc_verified == "1" ||
    profile?.kyc_verified === 1 ||
    profile?.kyc_verified === true;

  const loadKYC = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/vendor/getVendorProfile`, {
        headers: authHeaders(),
      });
      const data = res?.data?.data || {};
      setProfile(data);
      setForm(data);
      setCompanyType(data.company_type || "");
    } catch (error) {
      console.error("KYC profile:", error);
    }
  };

  useEffect(() => {
    loadKYC();
  }, []);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fileChange = (e) => {
    const { name, files } = e.target;
    if (files?.[0]) setForm((prev) => ({ ...prev, [name]: files[0] }));
  };

  const cancel = () => {
    setEditing(false);
    setForm(profile);
    setCompanyType(profile.company_type || "");
  };

  const save = async () => {
    if (isKycVerified) {
      toast.error("Your KYC is already verified and cannot be updated.");
      setEditing(false);
      return;
    }

    if (!companyType) {
      toast.error("Please select company type");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("company_type", companyType);

      [
        "document_type",
        "document_id",
        "company_pancard_name",
        "supporting_document_id",
        "supporting_document_type",
      ].forEach((key) => {
        if (form[key] !== undefined && form[key] !== null) fd.append(key, form[key]);
      });

      if (companyType === "sole Proprietorship") {
        if (form.document_image instanceof File) fd.append("document_image", form.document_image);
        else if (profile.document_image) fd.append("document_image", profile.document_image);
      } else {
        if (form.company_pancard_image instanceof File) {
          fd.append("company_pancard_image", form.company_pancard_image);
        } else if (profile.company_pancard_image) {
          fd.append("company_pancard_image", profile.company_pancard_image);
        }

        if (form.supporting_document_image instanceof File) {
          fd.append("supporting_document_image", form.supporting_document_image);
        } else if (profile.supporting_document_image) {
          fd.append("supporting_document_image", profile.supporting_document_image);
        }
      }

      const res = await axios.post(`${baseURL}/api/vendor/updateVendorInfo`, fd, {
        headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
      });

      const data = res?.data?.data || form;
      setProfile(data);
      setForm(data);
      setEditing(false);
      toast.success(res?.data?.message || "KYC updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating KYC");
    } finally {
      setLoading(false);
    }
  };

  const multiCompany =
    companyType === "partnership" ||
    companyType === "limited liability partnership" ||
    companyType === "private limited company" ||
    companyType === "public limited company";

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">Business verification</h3>
          <p className="mt-1 text-sm text-gray-500">Manage documents used to verify your business.</p>
        </div>

        {isKycVerified ? (
          <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-700">
            <ShieldCheckIcon className="h-5 w-5" />
            KYC Verified
          </div>
        ) : !editing ? (
          <button onClick={() => setEditing(true)} className={secondaryButton}>
            <PencilSquareIcon className="h-4 w-4" />
            Edit KYC
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={cancel} className={secondaryButton}>Cancel</button>
            <button onClick={save} disabled={loading} className={primaryButton}>
              {loading ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4" />
                  Save KYC
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {isKycVerified && (
        <div className="mb-6 overflow-hidden rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-start gap-3 p-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100">
              <ShieldCheckIcon className="h-5 w-5 text-emerald-700" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-bold text-emerald-900">KYC verification completed</h4>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                  Locked
                </span>
              </div>
              <p className="mt-1 text-xs leading-5 text-emerald-700">
                Your business KYC has been verified. Verified KYC information is now read-only and cannot be edited from this page.
              </p>
            </div>
          </div>
        </div>
      )}

      {!isKycVerified && !editing && (
        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <div className="flex items-start gap-3">
            <DocumentTextIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#0446DB]" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Review your KYC details</p>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                You can edit these details until your KYC is verified.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <SelectField
          label="Company Type"
          value={companyType}
          onChange={(e) => {
            setCompanyType(e.target.value);
            setForm((prev) => ({ ...prev, company_type: e.target.value }));
          }}
          disabled={!editing || isKycVerified}
          required
        >
          <option value="">Select company type</option>
          {companyTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </SelectField>
      </div>

      {!companyType && (
        <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
          <DocumentTextIcon className="mx-auto h-8 w-8 text-gray-300" />
          <p className="mt-2 text-sm font-semibold text-gray-600">Select your company type</p>
          <p className="mt-1 text-xs text-gray-400">Required KYC fields will appear here.</p>
        </div>
      )}

      {companyType === "sole Proprietorship" && (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <SelectField
            label="Document Type"
            name="document_type"
            value={form.document_type}
            onChange={change}
            disabled={!editing || isKycVerified}
            required
          >
            <option value="">Select document type</option>
            {documentTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </SelectField>

          <Field
            label="Document ID"
            name="document_id"
            value={form.document_id}
            onChange={change}
            disabled={!editing || isKycVerified}
            placeholder="Enter document ID"
          />

          <div className="md:col-span-2">
            <label className={labelClass}>Document Image</label>
            {editing && !isKycVerified ? (
              <input
                type="file"
                name="document_image"
                onChange={fileChange}
                accept="image/*,.pdf"
                className="block w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-[#0446DB]"
              />
            ) : profile.document_image ? (
              <a
                href={resolveFileUrl(profile.document_image)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0446DB]"
              >
                <DocumentTextIcon className="h-5 w-5" /> View uploaded document
              </a>
            ) : (
              <p className="text-sm text-gray-400">No document uploaded</p>
            )}
          </div>
        </div>
      )}

      {multiCompany && (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field
            label="Company PAN Card Name"
            name="company_pancard_name"
            value={form.company_pancard_name}
            onChange={change}
            disabled={!editing || isKycVerified}
            placeholder="Name as printed on PAN"
          />

          <div>
            <label className={labelClass}>Company PAN Card</label>
            {editing && !isKycVerified ? (
              <input
                type="file"
                name="company_pancard_image"
                onChange={fileChange}
                accept="image/*,.pdf"
                className="block w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-[#0446DB]"
              />
            ) : profile.company_pancard_image ? (
              <a href={resolveFileUrl(profile.company_pancard_image)} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#0446DB]">
                View PAN document
              </a>
            ) : (
              <p className="text-sm text-gray-400">No PAN document uploaded</p>
            )}
          </div>

          <SelectField
            label="Supporting Document Type"
            name="supporting_document_type"
            value={form.supporting_document_type}
            onChange={change}
            disabled={!editing || isKycVerified}
          >
            <option value="">Select supporting document</option>
            <option value="certificate_of_incorporation">Certificate of Incorporation</option>
            <option value="partnership_deed">Partnership Deed</option>
            <option value="llp_agreement">LLP Agreement</option>
            <option value="gst_certificate">GST Certificate</option>
            <option value="other">Other</option>
          </SelectField>

          <Field
            label="Supporting Document ID"
            name="supporting_document_id"
            value={form.supporting_document_id}
            onChange={change}
            disabled={!editing || isKycVerified}
            placeholder="Enter supporting document ID"
          />

          <div className="md:col-span-2">
            <label className={labelClass}>Supporting Document</label>
            {editing && !isKycVerified ? (
              <input
                type="file"
                name="supporting_document_image"
                onChange={fileChange}
                accept="image/*,.pdf"
                className="block w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-[#0446DB]"
              />
            ) : profile.supporting_document_image ? (
              <a href={resolveFileUrl(profile.supporting_document_image)} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#0446DB]">
                View supporting document
              </a>
            ) : (
              <p className="text-sm text-gray-400">No supporting document uploaded</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function VendorProfile() {
  const [profile, setProfile] = useState({});
  const [editForm, setEditForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [editPhone, setEditPhone] = useState(false);
  const [phone, setPhone] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [chequeFile, setChequeFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [chequePreview, setChequePreview] = useState(null);

  const getMerchantProfile = async () => {
    try {
      setPageLoading(true);
      const res = await axios.get(`${baseURL}/api/vendor/getVendorProfile`, {
        headers: authHeaders(),
      });
      const data = res?.data?.data || {};
      setProfile(data);
      setEditForm(data);
      setPhone(data.phone || "");
    } catch (error) {
      console.error("Profile:", error);
      toast.error(error?.response?.data?.message || "Unable to load profile");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getMerchantProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (profilePreview?.startsWith("blob:")) URL.revokeObjectURL(profilePreview);
      if (chequePreview?.startsWith("blob:")) URL.revokeObjectURL(chequePreview);
    };
  }, [profilePreview, chequePreview]);

  const tabs = [
    { id: "personal", label: "Personal Info", icon: UserIcon, description: "Name, email and phone" },
    { id: "company", label: "Company", icon: BuildingOfficeIcon, description: "Business information" },
    { id: "documents", label: "Company KYC", icon: DocumentTextIcon, description: "Business verification" },
    { id: "bank", label: "Bank Details", icon: BanknotesIcon, description: "Settlement account" },
  ];

  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];
  const currentData = isEditing ? editForm : profile;
  const mainKycVerified =
    profile?.kyc_verified == "1" ||
    profile?.kyc_verified === 1 ||
    profile?.kyc_verified === true;

  const handleEdit = () => {
    setEditForm({ ...profile });
    setPhone(profile.phone || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditPhone(false);
    setEditForm(profile);
    setPhone(profile.phone || "");
    setProfileImageFile(null);
    setChequeFile(null);
    setProfilePreview(null);
    setChequePreview(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const appendProfileFields = (fd, data) => {
    [
      "vendor_name",
      "email",
      "phone",
      "profile_image",
      "company_name",
      "company_address",
      "company_city",
      "company_state",
      "company_pincode",
      "company_gst_number",
      "bank_name",
      "bank_branch",
      "bank_account_number",
      "bank_ifsc_code",
      "document_type",
      "document_id",
    ].forEach((key) => {
      const value = data[key];
      if (value === undefined || value === null) return;
      if (key === "profile_image" && typeof value === "string" && value.startsWith("blob:")) return;
      fd.append(key, value);
    });

    if (profileImageFile) fd.set("profile_image", profileImageFile);
    else if (profile.profile_image) fd.set("profile_image", profile.profile_image);

    if (chequeFile) fd.set("cheque_image", chequeFile);
    else if (profile.cheque_image) fd.set("cheque_image", profile.cheque_image);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      appendProfileFields(fd, editForm);

      const res = await axios.post(`${baseURL}/api/vendor/updateVendorInfo`, fd, {
        headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
      });

      const data = res?.data?.data || editForm;
      setProfile(data);
      setEditForm(data);
      setIsEditing(false);
      setProfileImageFile(null);
      setChequeFile(null);
      setProfilePreview(null);
      setChequePreview(null);

      toast.success(res?.data?.message || "Profile updated successfully");
      getMerchantProfile();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async () => {
    const cleanPhone = phone.replace(/\D/g, "");

    if (!/^\d{10}$/.test(cleanPhone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    if (String(profile.phone || "") === cleanPhone) {
      toast.error("Please enter a different number");
      return;
    }

    try {
      const response = await axios.post(
        `${baseURL}/api/otp/sendphonenumberchangeotp`,
        { phone: cleanPhone },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message || "OTP sent successfully");
        setPhone(cleanPhone);
        setShowOTPModal(true);
        setEditPhone(false);
      } else {
        toast.error(response?.data?.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOTP = async (otpCode) => {
    if (otpCode.length !== 4) {
      toast.error("Please enter the 4-digit OTP");
      return;
    }

    setVerificationLoading(true);

    try {
      const response = await axios.post(
        `${baseURL}/api/otp/verifyphonenumberchangeotp`,
        { phone, otp: otpCode },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!response?.data?.success) {
        toast.error(response?.data?.message || "OTP verification failed");
        return;
      }

      const fd = new FormData();
      appendProfileFields(fd, editForm);
      fd.set("phone", phone);

      const res = await axios.post(`${baseURL}/api/vendor/updateVendorInfo`, fd, {
        headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
      });

      if (res?.data?.success) {
        toast.success(res?.data?.message || "Phone number updated successfully");
        setShowOTPModal(false);
        setEditPhone(false);
        setIsEditing(false);
        await getMerchantProfile();
      } else {
        toast.error(res?.data?.message || "Could not update phone number");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Verification failed");
    } finally {
      setVerificationLoading(false);
    }
  };

  const profileImage = profilePreview || resolveFileUrl(profile.profile_image);

  const renderPersonal = () => (
    <div className="grid gap-5 md:grid-cols-2">
      <Field
        label="Vendor Name"
        name="vendor_name"
        value={currentData.vendor_name}
        onChange={handleChange}
        disabled={!isEditing}
        placeholder="Enter vendor name"
      />

      <Field
        label="Email Address"
        name="email"
        type="email"
        value={currentData.email}
        onChange={handleChange}
        disabled={!isEditing}
        placeholder="name@company.com"
      />

      <div className="md:col-span-2">
        <label className={labelClass}>Phone Number</label>

        {editPhone ? (
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex h-11 flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white focus-within:border-[#0446DB] focus-within:ring-2 focus-within:ring-[#0446DB]/10">
                <span className="flex items-center border-r border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-600">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  maxLength={10}
                  autoFocus
                  placeholder="Enter new mobile number"
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm font-medium outline-none"
                />
              </div>

              <button onClick={sendOTP} className={primaryButton}>
                Send OTP
              </button>
              <button
                onClick={() => {
                  setEditPhone(false);
                  setPhone(profile.phone || "");
                }}
                className={secondaryButton}
              >
                Cancel
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">We will verify the new number before updating your profile.</p>
          </div>
        ) : (
          <div className="relative">
            <input value={currentData.phone || ""} disabled className={`${inputClass} pr-12`} />
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setPhone("");
                  setEditPhone(true);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-[#0446DB] hover:bg-blue-50"
                title="Change phone number"
              >
                <PencilSquareIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="md:col-span-2">
        {isEditing ? (
          <UploadWithCrop
            label="Profile Image"
            accept="image/*"
            type="profile"
            currentPath={profile.profile_image}
            preview={profilePreview}
            onFileReady={(file, previewUrl) => {
              setProfileImageFile(file);
              setProfilePreview(previewUrl);
              setEditForm((prev) => ({ ...prev, profile_image: previewUrl }));
            }}
          />
        ) : (
          <div>
            <label className={labelClass}>Profile Image</label>
            {profileImage ? (
              <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <img src={profileImage} alt="Profile" className="h-20 w-20 rounded-xl object-cover ring-1 ring-gray-200" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Current profile photo</p>
                  <p className="mt-1 text-xs text-gray-400">Click Edit Profile to replace this image.</p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-400">
                No profile image uploaded
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderCompany = () => (
    <div className="grid gap-5 md:grid-cols-2">
      <Field label="Company Name" name="company_name" value={currentData.company_name} onChange={handleChange} disabled={!isEditing} />
      <Field label="GST Number" name="company_gst_number" value={currentData.company_gst_number} onChange={handleChange} disabled={!isEditing} />
      <div className="md:col-span-2">
        <Field label="Company Address" name="company_address" value={currentData.company_address} onChange={handleChange} disabled={!isEditing} />
      </div>
      <Field label="City" name="company_city" value={currentData.company_city} onChange={handleChange} disabled={!isEditing} />
      <Field label="State" name="company_state" value={currentData.company_state} onChange={handleChange} disabled={!isEditing} />
      <Field label="Pincode" name="company_pincode" value={currentData.company_pincode} onChange={handleChange} disabled={!isEditing} />
    </div>
  );

  const renderBank = () => (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Bank Name" name="bank_name" value={currentData.bank_name} onChange={handleChange} disabled={!isEditing} />
        <Field label="Account Number" name="bank_account_number" value={currentData.bank_account_number} onChange={handleChange} disabled={!isEditing} />
        <Field label="IFSC Code" name="bank_ifsc_code" value={currentData.bank_ifsc_code} onChange={handleChange} disabled={!isEditing} />
        <Field label="Branch" name="bank_branch" value={currentData.bank_branch} onChange={handleChange} disabled={!isEditing} />
      </div>

      <div className="border-t border-gray-100 pt-6">
        {isEditing ? (
          <UploadWithCrop
            label="Cancelled Cheque"
            accept="image/*,.pdf"
            type="cheque"
            currentPath={profile.cheque_image}
            preview={chequePreview}
            onFileReady={(file, previewUrl) => {
              setChequeFile(file);
              setChequePreview(previewUrl);
            }}
          />
        ) : profile.cheque_image ? (
          <div>
            <label className={labelClass}>Cancelled Cheque</label>
            <a
              href={resolveFileUrl(profile.cheque_image)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-[#0446DB]"
            >
              <DocumentTextIcon className="h-5 w-5" />
              View cheque
            </a>
          </div>
        ) : (
          <p className="text-sm text-gray-400">No cheque uploaded.</p>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    if (activeTab === "personal") return renderPersonal();
    if (activeTab === "company") return renderCompany();
    if (activeTab === "documents") return <KYCSection />;
    if (activeTab === "bank") return renderBank();
    return null;
  };

  if (pageLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F7F8FA]">
        <div className="text-center">
          <ArrowPathIcon className="mx-auto h-7 w-7 animate-spin text-[#0446DB]" />
          <p className="mt-3 text-sm font-medium text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] ">
      <div className="mx-auto ">
        {/* PROFILE HEADER */}
        <div className="mb-5 rounded-xl border border-gray-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <UserIcon className="h-7 w-7 text-gray-400" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                    {profile.vendor_name || "Vendor Profile"}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      profile.is_active
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                        : "bg-red-50 text-red-700 ring-1 ring-red-100"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${profile.is_active ? "bg-emerald-500" : "bg-red-500"}`} />
                    {profile.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-gray-500">
                  {profile.email || "Manage account information, KYC and settlement details."}
                </p>
              </div>
            </div>

            {!isEditing ? (
              <button onClick={handleEdit} className={primaryButton}>
                <PencilSquareIcon className="h-4 w-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button onClick={handleCancel} className={secondaryButton}>
                  <XMarkIcon className="h-4 w-4" />
                  Cancel
                </button>
                <button onClick={handleSave} disabled={loading} className={primaryButton}>
                  {loading ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE TAB */}
        <div className="mb-4 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <currentTab.icon className="h-5 w-5 text-[#0446DB]" />
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">{currentTab.label}</p>
                <p className="text-xs text-gray-400">{currentTab.description}</p>
              </div>
            </div>
            {mobileMenuOpen ? <ChevronUpIcon className="h-5 w-5 text-gray-400" /> : <ChevronDownIcon className="h-5 w-5 text-gray-400" />}
          </button>

          {mobileMenuOpen && (
            <div className="mt-2 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
                    activeTab === tab.id ? "bg-blue-50 text-[#0446DB]" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-semibold">{tab.label}</p>
                    <div className="flex items-center gap-2">
                      <p className="mt-0.5 text-xs text-gray-400">{tab.description}</p>
                      {tab.id === "documents" && mainKycVerified && (
                        <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-700">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="sticky top-5 rounded-xl border border-gray-200/80 bg-white p-2 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
              <div className="px-3 pb-2 pt-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">Profile Settings</p>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all
                      ${
                        activeTab === tab.id
                          ? "bg-[#0446DB] text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <div
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                        activeTab === tab.id ? "bg-white/15" : "bg-gray-50 group-hover:bg-white"
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{tab.label}</p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <p className={`truncate text-[11px] ${activeTab === tab.id ? "text-blue-100" : "text-gray-400"}`}>
                          {tab.description}
                        </p>
                        {tab.id === "documents" && mainKycVerified && (
                          <CheckIcon className={`h-3.5 w-3.5 flex-shrink-0 ${activeTab === tab.id ? "text-emerald-200" : "text-emerald-600"}`} />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* CONTENT */}
          <section className="min-w-0 rounded-xl border border-gray-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <div className="flex items-center gap-2">
                  <currentTab.icon className="h-5 w-5 text-[#0446DB]" />
                  <h2 className="text-lg font-bold text-gray-900">{currentTab.label}</h2>
                </div>
                <p className="mt-1 text-sm text-gray-500">{currentTab.description}</p>
              </div>

              {isEditing && activeTab !== "documents" && (
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-100">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                  Editing mode
                </span>
              )}
            </div>

            <div className="p-5 sm:p-6">{renderContent()}</div>
          </section>
        </div>
      </div>

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={verifyOTP}
        phoneNumber={phone}
        loading={verificationLoading}
      />
    </div>
  );
}



