
// // ForgotPassword.jsx
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Eye, EyeOff, RefreshCwIcon } from "lucide-react";
// import { useNavigate, Link } from 'react-router-dom';
// import toast from 'react-hot-toast';

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Field,
//   FieldDescription,
//   FieldLabel,
// } from "@/components/ui/field";
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSeparator,
//   InputOTPSlot,
// } from "@/components/ui/input-otp";

// import AxiosInstance from '../Helper/axiosInstance';
// import DaakitGoLogo from "../assets/DaakitGo-Logo.jpg";
// import DaakitMap from "../assets/daakitmap.png";
// import Warehouse1 from "../assets/fulfillmenthype_warehouse.png";
// import Warehouse2 from "../assets/warehouse5.png";

// const baseURL = import.meta.env.VITE_BASE_URL;

// // Slider images – same as login page
// const slider = [
//   { link: DaakitMap, alt: "Daakit Map" },
//   { link: Warehouse1, alt: "Warehouse 1" },
//   { link: Warehouse2, alt: "Warehouse 2" },
// ];

// const ForgotPassword = () => {
//   const [currentStep, setCurrentStep] = useState('send');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(180);
//   const [isResendDisabled, setIsResendDisabled] = useState(true);
//   const [otp, setOtp] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const navigate = useNavigate();

//   // Slider index
//   const [index, setIndex] = useState(0);

//   // Slider auto-play
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prev) => (prev === slider.length - 1 ? 0 : prev + 1));
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   // OTP timer effect
//   useEffect(() => {
//     if (currentStep === 'verify' && timeLeft > 0) {
//       const timerId = setTimeout(() => {
//         setTimeLeft(timeLeft - 1);
//       }, 1000);
//       return () => clearTimeout(timerId);
//     } else if (currentStep === 'verify' && timeLeft <= 0) {
//       setIsResendDisabled(false);
//     }
//   }, [currentStep, timeLeft]);

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//   };

//   // Send OTP
//   const handleSendOTP = async (e) => {
//     e.preventDefault();

//     if (!phoneNumber) {
//       setError('Please enter your phone number');
//       toast.error('Please enter your phone number');
//       return;
//     }

//     const phoneRegex = /^[0-9]{10,15}$/;
//     const cleanPhone = phoneNumber.replace(/\D/g, '');
//     if (!phoneRegex.test(cleanPhone)) {
//       setError('Please enter a valid phone number');
//       toast.error('Please enter a valid phone number');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       // Check if user exists
//       const checkUser = await AxiosInstance.post('/api/check/user', {
//         phone: cleanPhone,
//         user_type: 'merchant' // adjust as needed
//       });

//       if (!checkUser?.data?.exists) {
//         toast.error(checkUser?.data?.message || 'User not found');
//         setError(checkUser?.data?.message || 'User not found');
//         setLoading(false);
//         return;
//       }

//       const response = await axios.post(`${baseURL}/api/otp/sendpasswordchangeotp`, {
//         phone: cleanPhone,
//       });

//       if (response.data.success) {
//         setOtp('');
//         toast.success('OTP sent successfully!');
//         setSuccess('OTP sent successfully!');
//         setCurrentStep('verify');
//         setTimeLeft(180);
//         setIsResendDisabled(true);
//       } else {
//         setError(response.data.message || 'Failed to send OTP');
//         toast.error(response.data.message || 'Failed to send OTP');
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || 'Failed to send OTP. Please try again.';
//       setError(errorMsg);
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Resend OTP
//   const handleResendOTP = async () => {
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const response = await axios.post(`${baseURL}/api/otp/sendpasswordchangeotp`, {
//         phone: phoneNumber.replace(/\D/g, '')
//       });

//       if (response.data.success) {
//         toast.success('New OTP sent successfully!');
//         setSuccess('New OTP sent successfully!');
//         setTimeLeft(180);
//         setOtp('');
//         setIsResendDisabled(true);
//       } else {
//         setError(response.data.message || 'Failed to resend OTP');
//         toast.error(response.data.message || 'Failed to resend OTP');
//       }
//     } catch (err) {
//       const errorMsg = 'Failed to resend OTP. Please try again.';
//       setError(errorMsg);
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Verify OTP
//   const verifyOTP = async () => {
//     if (otp.length !== 4) {
//       setError('Please enter a 4-digit OTP');
//       toast.error('Please enter a 4-digit OTP');
//       return;
//     }

//     if (timeLeft <= 0) {
//       setError('OTP has expired. Please request a new one.');
//       toast.error('OTP has expired. Please request a new one.');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const response = await axios.post(`${baseURL}/api/otp/verifypasswordchangeotp`, {
//         phone: phoneNumber.replace(/\D/g, ''),
//         otp: otp
//       });

//       if (response.data.success) {
//         toast.success('Phone number verified successfully!');
//         setSuccess('Phone number verified successfully!');
//         setTimeout(() => {
//           setCurrentStep('change-password');
//         }, 1000);
//       } else {
//         setError(response.data.message || 'Invalid OTP. Please try again.');
//         toast.error(response.data.message || 'Invalid OTP. Please try again.');
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || 'OTP verification failed';
//       setError(errorMsg);
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset Password
//   const SubmitChangePassword = async () => {
//     if (!password) {
//       toast.error('Please enter a new password');
//       return;
//     }
//     if (password.length < 6) {
//       toast.error('Password must be at least 6 characters long');
//       return;
//     }
//     if (password !== confirmPassword) {
//       toast.error('Passwords do not match');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const response = await axios.post(`${baseURL}/api/merchant/resetMerchantPassword`, {
//         phone: phoneNumber.replace(/\D/g, ''),
//         otp: otp,
//         new_password: password
//       });

//       if (response.data.success) {
//         toast.success(response.data.message || 'Password reset successfully!');
//         setSuccess(response.data.message || 'Password reset successfully!');
//         navigate('/login');
//       } else {
//         setError(response.data.message || 'Failed to reset password');
//         toast.error(response.data.message || 'Failed to reset password');
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || 'Failed to reset password. Please try again.';
//       setError(errorMsg);
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePhoneNumberChange = (e) => {
//     const value = e.target.value;
//     const formattedValue = value.replace(/[^\d+-\s]/g, '');
//     setPhoneNumber(formattedValue);
//     setError('');
//   };

//   const goBackToSend = () => {
//     setCurrentStep('send');
//     setError('');
//     setSuccess('');
//     setOtp('');
//     setPassword('');
//     setConfirmPassword('');
//   };

//   // Render left side – same as login page
//   const renderLeftSide = () => (
//     <div className="hidden lg:flex lg:w-[58%] xl:w-[60%] bg-[#0446DB] text-white relative overflow-hidden">
//       <div className="absolute inset-0 bg-black/10"></div>
//       <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
//       <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

//       <div className="relative z-10 w-full flex flex-col items-center justify-center px-12 py-8">
//         {/* Branding */}
//         <div className="mb-8 text-center">
//           <h1 className="text-4xl font-bold mb-2">Welcome to DaakitGo</h1>
//           <p className="text-indigo-100 text-lg">Your all-in-one logistics solution</p>
//         </div>

//         {/* Slider */}
//         <div className="w-full max-w-2xl">
//           <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-sm border border-white/10">
//             <div
//               className="flex w-full h-full transition-transform duration-500 ease-out"
//               style={{ transform: `translateX(-${index * 100}%)` }}
//             >
//               {slider.map((item, i) => (
//                 <div
//                   key={i}
//                   className="w-full h-full flex-shrink-0 flex flex-col items-center justify-center p-8"
//                 >
//                   <img
//                     src={item.link}
//                     alt={item.alt}
//                     className="w-full h-64 object-contain mb-6 transition-transform duration-300 hover:scale-105"
//                   />
//                   <div className="text-center">
//                     <h3 className="text-xl font-semibold mb-2">{item.title || 'DaakitGo'}</h3>
//                     <p className="text-indigo-100 text-sm leading-relaxed">
//                       {item.description || 'Streamline your logistics operations'}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Slider Indicators */}
//             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
//               {slider.map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setIndex(i)}
//                   className={`w-2 h-2 rounded-full transition-all duration-300 ${
//                     i === index ? 'bg-white w-6' : 'bg-white/50'
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Render right side – forgot password form
//   const renderRightSide = () => {
//     // Step: send phone
//     if (currentStep === 'send') {
//       return (
//         <div className="flex-1 lg:max-w-[42%] xl:max-w-[40%] flex flex-col overflow-auto bg-white">
//           <div className="flex justify-center pt-12 pb-4">
//             <img
//               src={DaakitGoLogo}
//               alt="DaakitGo"
//               className="h-20 w-auto object-contain"
//             />
//           </div>
//           <div className="flex-1 flex flex-col justify-center px-1 sm:px-5 w-full pb-12">
//             <Card className="w-full shadow-lg border-0">
//               <CardHeader>
//                 <CardTitle className="text-center text-2xl text-[#0446DB]">
//                   Reset Password
//                 </CardTitle>
//                 <CardDescription className="text-center">
//                   Enter your phone number to receive a verification code
//                 </CardDescription>
//               </CardHeader>
//               <form onSubmit={handleSendOTP}>
//                 <CardContent>
//                   <Field>
//                     <FieldLabel htmlFor="phone" className="text-[#0446DB]">
//                       Phone Number
//                     </FieldLabel>
//                     <input
//                       type="tel"
//                       id="phone"
//                       value={phoneNumber}
//                       onChange={handlePhoneNumberChange}
//                       placeholder="Enter your phone number"
//                       className="w-full px-4 py-3 bg-white border border-[#0446DB] rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                       disabled={loading}
//                     />
//                     {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
//                     {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
//                   </Field>
//                 </CardContent>
//                 <CardFooter>
//                   <Button
//                     type="submit"
//                     className="w-full bg-[#0446DB] hover:bg-blue-700 py-4"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Sending OTP...
//                       </>
//                     ) : (
//                       'Send Verification Code'
//                     )}
//                   </Button>
//                 </CardFooter>
//               </form>
//               <div className="text-center mt-4 pb-5">
//                 <Link to="/login" className="text-[#0446DB] hover:underline text-sm">
//                   Back to Login
//                 </Link>
//               </div>
//             </Card>
//           </div>
//         </div>
//       );
//     }

//     // Step: verify OTP
//     if (currentStep === 'verify') {
//       return (
//         <div className="flex-1 lg:max-w-[42%] xl:max-w-[40%] flex flex-col overflow-auto bg-white">
//           <div className="flex justify-center pt-12 pb-4">
//             <img
//               src={DaakitGoLogo}
//               alt="DaakitGo"
//               className="h-20 w-auto object-contain"
//             />
//           </div>
//           <div className="flex-1 flex flex-col justify-center px-1 sm:px-5 w-full pb-12">
//             <Card className="w-full shadow-lg border-0">
//               <CardHeader>
//                 <button
//                   onClick={goBackToSend}
//                   className="flex items-center text-[#0446DB] hover:text-blue-700 transition-colors mb-2"
//                 >
//                   <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                   </svg>
//                   Back
//                 </button>
//                 <CardTitle className="text-center text-2xl text-[#0446DB]">
//                   Verify OTP
//                 </CardTitle>
//                 <CardDescription className="text-center">
//                   Enter the 6-digit code sent to
//                   <span className="block font-medium text-[#0446DB] mt-1">{phoneNumber}</span>
//                 </CardDescription>
//                 <div className={`text-center font-semibold mt-2 ${timeLeft > 0 ? 'text-blue-600' : 'text-red-600'}`}>
//                   {timeLeft > 0
//                     ? `Time remaining: ${formatTime(timeLeft)}`
//                     : "Code expired"
//                   }
//                 </div>
//               </CardHeader>

//               <CardContent>
//                 <Field>
//                   <div className="flex items-center justify-between mb-2">
//                     <FieldLabel htmlFor="otp-verification" className="text-[#0446DB]">
//                       Verification code
//                     </FieldLabel>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={handleResendOTP}
//                       disabled={isResendDisabled || loading}
//                       className="h-8"
//                     >
//                       <RefreshCwIcon className="h-4 w-4 mr-1" />
//                       Resend
//                     </Button>
//                   </div>
//                   <div className="flex justify-center">
//                     <InputOTP
//                       maxLength={6}
//                       id="otp-verification"
//                       value={otp}
//                       onChange={(value) => {
//                         setOtp(value);
//                         setError('');
//                         if (value.length === 6) {
//                           setTimeout(() => verifyOTP(), 300);
//                         }
//                       }}
//                       disabled={timeLeft <= 0 || loading}
//                       required
//                     >
//                       <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
//                         <InputOTPSlot index={0} />
//                         <InputOTPSlot index={1} />
                       
//                       </InputOTPGroup>
//                       <InputOTPSeparator className="mx-2" />
//                       <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
//                         <InputOTPSlot index={2} />
//                         <InputOTPSlot index={3} />
                    
//                       </InputOTPGroup>
//                     </InputOTP>
//                   </div>
//                   {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
//                   {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
//                 </Field>
//               </CardContent>

//               <CardFooter className="flex flex-col gap-4">
//                 <Button
//                   type="button"
//                   className="w-full bg-green-600 hover:bg-green-700"
//                   onClick={verifyOTP}
//                   disabled={otp.length !== 4 || loading || timeLeft <= 0}
//                 >
//                   {loading ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Verifying...
//                     </>
//                   ) : (
//                     'Verify OTP'
//                   )}
//                 </Button>
//               </CardFooter>
//             </Card>
//           </div>
//         </div>
//       );
//     }

//     // Step: change password
//     return (
//       <div className="flex-1 lg:max-w-[42%] xl:max-w-[40%] flex flex-col overflow-auto bg-white">
//         <div className="flex justify-center pt-12 pb-4">
//           <img
//             src={DaakitGoLogo}
//             alt="DaakitGo"
//             className="h-20 w-auto object-contain"
//           />
//         </div>
//         <div className="flex-1 flex flex-col justify-center px-1 sm:px-5 w-full pb-12">
//           <Card className="w-full shadow-lg border-0">
//             <CardHeader>
//               <button
//                 onClick={goBackToSend}
//                 className="flex items-center text-[#0446DB] hover:text-blue-700 transition-colors mb-2"
//               >
//                 <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                 </svg>
//                 Back
//               </button>
//               <CardTitle className="text-center text-2xl text-[#0446DB]">
//                 Reset Password
//               </CardTitle>
//               <CardDescription className="text-center">
//                 Enter your new password below
//               </CardDescription>
//             </CardHeader>

//             <CardContent className="space-y-4">
//               {error && (
//                 <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//                   <p className="text-red-700 text-sm font-medium">{error}</p>
//                 </div>
//               )}
//               {success && (
//                 <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
//                   <p className="text-green-700 text-sm">{success}</p>
//                 </div>
//               )}

//               <Field>
//                 <FieldLabel htmlFor="new-password" className="text-[#0446DB]">
//                   New Password
//                 </FieldLabel>
//                 <div className="relative">
//                   <input
//                     id="new-password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter new password (min 6 characters)"
//                     onChange={(e) => setPassword(e.target.value)}
//                     value={password}
//                     className="w-full px-4 py-3 bg-white border border-[#0446DB] rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
//                     disabled={loading}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-3 text-[#0446DB] hover:text-blue-700"
//                   >
//                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                   </button>
//                 </div>
//               </Field>

//               <Field>
//                 <FieldLabel htmlFor="confirm-password" className="text-[#0446DB]">
//                   Confirm Password
//                 </FieldLabel>
//                 <div className="relative">
//                   <input
//                     id="confirm-password"
//                     type={showConfirmPassword ? "text" : "password"}
//                     placeholder="Confirm new password"
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     value={confirmPassword}
//                     className="w-full px-4 py-3 bg-white border border-[#0446DB] rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
//                     disabled={loading}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-3 text-[#0446DB] hover:text-blue-700"
//                   >
//                     {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                   </button>
//                 </div>
//                 {password && confirmPassword && password !== confirmPassword && (
//                   <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
//                 )}
//               </Field>
//             </CardContent>

//             <CardFooter>
//               <Button
//                 type="button"
//                 className="w-full bg-[#0446DB] hover:bg-blue-700"
//                 onClick={SubmitChangePassword}
//                 disabled={loading || !password || !confirmPassword || password !== confirmPassword}
//               >
//                 {loading ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Resetting Password...
//                   </>
//                 ) : (
//                   'Reset Password'
//                 )}
//               </Button>
//             </CardFooter>
//           </Card>
//         </div>
//       </div>
//     );
//   };

//   // Main layout – same as login page
//   return (
//     <div className="flex h-screen bg-gray-50">
//       {renderLeftSide()}
//       {renderRightSide()}
//     </div>
//   );
// };

// export default ForgotPassword;




import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Info,
  Loader2,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AxiosInstance from "../Helper/axiosInstance";
import DaakitGoLogo from "../assets/DaakitGo-Logo.jpg";
import DaakitMap from "../assets/daakitmap.png";

const baseURL = import.meta.env.VITE_BASE_URL;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const otpInputRef = useRef(null);

  // =========================================================
  // STATES
  // =========================================================

  const [currentStep, setCurrentStep] = useState("send");

  const [phoneNumber, setPhoneNumber] = useState("");

  // OTP IS STRING - NOT ARRAY
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [timeLeft, setTimeLeft] = useState(180);

  const [
    isResendDisabled,
    setIsResendDisabled,
  ] = useState(true);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] =
    useState(false);

  // =========================================================
  // OTP TIMER
  // =========================================================

  useEffect(() => {
    if (currentStep !== "verify") {
      return;
    }

    if (timeLeft <= 0) {
      setIsResendDisabled(false);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentStep, timeLeft]);

  // =========================================================
  // AUTO FOCUS OTP
  // =========================================================

  useEffect(() => {
    if (currentStep !== "verify") {
      return;
    }

    const timer = setTimeout(() => {
      otpInputRef.current?.focus();
    }, 150);

    return () => clearTimeout(timer);
  }, [currentStep]);

  // =========================================================
  // FORMAT TIMER
  // =========================================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds =
      seconds % 60;

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // =========================================================
  // PHONE INPUT
  // =========================================================

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 10);

    setPhoneNumber(value);
  };

  // =========================================================
  // SEND OTP
  // =========================================================

  const handleSendOTP = async (e) => {
    e.preventDefault();

    const cleanPhone =
      phoneNumber.replace(/\D/g, "");

    if (!cleanPhone) {
      toast.error(
        "Please enter your phone number"
      );
      return;
    }

    if (!/^\d{10}$/.test(cleanPhone)) {
      toast.error(
        "Please enter a valid 10-digit phone number"
      );
      return;
    }

    setLoading(true);

    try {
      // -----------------------------------------
      // CHECK USER
      // -----------------------------------------

      const checkUser =
        await AxiosInstance.post(
          "/api/check/user",
          {
            phone: cleanPhone,
            user_type: "merchant",
          }
        );

      if (!checkUser?.data?.exists) {
        toast.error(
          checkUser?.data?.message ||
            "User not found"
        );

        return;
      }

      // -----------------------------------------
      // SEND OTP
      // -----------------------------------------

      const response = await axios.post(
        `${baseURL}/api/otp/sendpasswordchangeotp`,
        {
          phone: cleanPhone,
        }
      );

      if (response?.data?.success) {
        setOtp("");

        setTimeLeft(180);

        setIsResendDisabled(true);

        setCurrentStep("verify");

        toast.success(
          "Verification code sent successfully!"
        );
      } else {
        toast.error(
          response?.data?.message ||
            "Failed to send verification code"
        );
      }
    } catch (error) {
      console.error(
        "Send OTP error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESEND OTP
  // =========================================================

  const handleResendOTP = async () => {
    if (
      timeLeft > 0 ||
      resending ||
      loading
    ) {
      return;
    }

    setResending(true);

    try {
      const response = await axios.post(
        `${baseURL}/api/otp/sendpasswordchangeotp`,
        {
          phone:
            phoneNumber.replace(/\D/g, ""),
        }
      );

      if (response?.data?.success) {
        setOtp("");

        setTimeLeft(180);

        setIsResendDisabled(true);

        toast.success(
          "New verification code sent successfully!"
        );

        setTimeout(() => {
          otpInputRef.current?.focus();
        }, 100);
      } else {
        toast.error(
          response?.data?.message ||
            "Failed to resend verification code"
        );
      }
    } catch (error) {
      console.error(
        "Resend OTP error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to resend OTP. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  // =========================================================
  // OTP INPUT
  // =========================================================

  const handleOtpChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 4);

    setOtp(value);
  };

  // =========================================================
  // OTP KEYDOWN
  // =========================================================

  const handleOtpKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      otp.length === 4
    ) {
      verifyOTP();
    }
  };

  // =========================================================
  // VERIFY OTP
  // =========================================================

  const verifyOTP = async () => {
    if (otp.length !== 4) {
      toast.error(
        "Please enter the 4-digit verification code"
      );
      return;
    }

    if (timeLeft <= 0) {
      toast.error(
        "Verification code has expired. Please request a new one."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${baseURL}/api/otp/verifypasswordchangeotp`,
        {
          phone:
            phoneNumber.replace(/\D/g, ""),
          otp,
        }
      );

      if (response?.data?.success) {
        toast.success(
          "Phone number verified successfully!"
        );

        setCurrentStep(
          "change-password"
        );
      } else {
        toast.error(
          response?.data?.message ||
            "Invalid verification code. Please try again."
        );
      }
    } catch (error) {
      console.error(
        "Verify OTP error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // PASSWORD RULES
  // =========================================================

  const passwordRules = {
    length: password.length >= 8,

    uppercase:
      /[A-Z]/.test(password),

    number:
      /[0-9]/.test(password),
  };

  const isPasswordValid =
    passwordRules.length &&
    passwordRules.uppercase &&
    passwordRules.number;

  // =========================================================
  // RESET PASSWORD
  // =========================================================

  const SubmitChangePassword =
    async () => {
      if (!password) {
        toast.error(
          "Please enter a new password"
        );
        return;
      }

      if (password.length < 8) {
        toast.error(
          "Password must be at least 8 characters long"
        );
        return;
      }

      if (!/[A-Z]/.test(password)) {
        toast.error(
          "Password must contain at least one uppercase letter"
        );
        return;
      }

      if (!/[0-9]/.test(password)) {
        toast.error(
          "Password must contain at least one number"
        );
        return;
      }

      if (!confirmPassword) {
        toast.error(
          "Please confirm your password"
        );
        return;
      }

      if (
        password !== confirmPassword
      ) {
        toast.error(
          "Passwords do not match"
        );
        return;
      }

      setLoading(true);

      try {
        const response =
          await axios.post(
            `${baseURL}/api/merchant/resetMerchantPassword`,
            {
              phone:
                phoneNumber.replace(
                  /\D/g,
                  ""
                ),

              otp,

              new_password: password,
            }
          );

        if (response?.data?.success) {
          toast.success(
            response?.data?.message ||
              "Password reset successfully!"
          );

          navigate("/login");
        } else {
          toast.error(
            response?.data?.message ||
              "Failed to reset password"
          );
        }
      } catch (error) {
        console.error(
          "Reset password error:",
          error
        );

        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to reset password. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

  // =========================================================
  // BACK TO PHONE
  // =========================================================

  const goBackToSend = () => {
    setCurrentStep("send");

    setOtp("");

    setTimeLeft(180);

    setIsResendDisabled(true);

    setPassword("");

    setConfirmPassword("");
  };

  // =========================================================
  // MASK PHONE
  // =========================================================

  const maskedPhone = () => {
    const cleanPhone =
      phoneNumber.replace(/\D/g, "");

    if (cleanPhone.length < 10) {
      return `+91 ${cleanPhone}`;
    }

    return `+91 ${cleanPhone.slice(
      0,
      6
    )}XXXX`;
  };

  // =========================================================
  // PASSWORD RULE UI
  // IMPORTANT:
  // Function call used instead of <PasswordRule />
  // =========================================================

  const PasswordRule = (
    valid,
    text
  ) => {
    return (
      <div
        className={`
          flex items-center gap-3
          text-sm font-semibold
          transition
          ${
            valid
              ? "text-gray-900"
              : "text-gray-500"
          }
        `}
      >
        <div
          className={`
            flex h-5 w-5
            flex-shrink-0
            items-center justify-center
            rounded-full
            border-2
            transition-all

            ${
              valid
                ? "border-green-500 bg-green-500 text-white"
                : "border-gray-300 bg-white text-transparent"
            }
          `}
        >
          <Check className="h-3 w-3 stroke-[4]" />
        </div>

        <span>{text}</span>
      </div>
    );
  };

  // =========================================================
  // LOGO
  // =========================================================

  const LogoHeader = () => {
    return (
      <div className="mb-6 flex justify-center">
        <img
          src={DaakitGoLogo}
          alt="DaakitGo"
          className="h-[72px] w-auto object-contain"
        />
      </div>
    );
  };

  // =========================================================
  // FOOTER
  // =========================================================

  const FooterLinks = () => {
    return (
      <div
        className="
          mt-7
          flex flex-col
          items-center justify-between
          gap-4
          border-t border-gray-100
          pt-5
          text-xs font-medium
          text-gray-500
          sm:flex-row
        "
      >
        <div className="flex items-center gap-5">
          <a
            href="https://daakit.com/privacy-policy/"
            target="_blank"
            rel="noreferrer"
            className="
              transition
              hover:text-gray-900
            "
          >
            Privacy Policy
          </a>

          <a
            href="https://daakit.com/terms-and-conditions/"
            target="_blank"
            rel="noreferrer"
            className="
              transition
              hover:text-gray-900
            "
          >
            Terms of Service
          </a>
        </div>

        <a
          href="https://daakit.com/contact/"
          target="_blank"
          rel="noreferrer"
          className="
            flex items-center
            gap-1.5
            transition
            hover:text-gray-900
          "
        >
          <Info className="h-4 w-4" />

          Need Support?
        </a>
      </div>
    );
  };

  // =========================================================
  // SECURITY TIP
  // =========================================================

  const SecurityTip = () => {
    return (
      <div
        className="
          relative mt-6
          flex gap-4
          overflow-hidden
          bg-gray-50
          p-5 pl-7
        "
      >
        <div
          className="
            absolute
            bottom-0 left-0 top-0
            w-[7px]
            bg-[#0446DB]
          "
        />

        <ShieldCheck
          className="
            mt-0.5
            h-6 w-6
            flex-shrink-0
            text-[#0446DB]
          "
        />

        <div>
          <h4
            className="
              mb-1
              text-[11px]
              font-bold uppercase
              tracking-[0.15em]
              text-gray-900
            "
          >
            Security Tip
          </h4>

          <p
            className="
              text-sm
              font-medium
              leading-relaxed
              text-gray-500
            "
          >
            Daakit will never call or
            text you to ask for this
            code. Keep it private to
            protect your account.
          </p>
        </div>
      </div>
    );
  };

  // =========================================================
  // LEFT PANEL
  // =========================================================

  const LeftPanel = () => {
    return (
      <aside
        className="
          relative hidden
          h-screen w-[45%]
          flex-col
          overflow-hidden

          rounded-br-[60px]
          rounded-tr-[60px]

          px-10 py-10

          lg:flex

          xl:w-[50%]
          xl:px-12
        "
        style={{
          background:
            "radial-gradient(circle at 100% 0%, rgba(217,218,171,.78) 0%, rgba(141,170,198,.42) 28%, rgba(4,70,219,0) 54%), linear-gradient(135deg, #0345DA 0%, #0345DA 100%)",
        }}
      >
        <div
          className="
            relative z-10
            mt-[clamp(1.5rem,4vh,3rem)]
          "
        >
          <h1
            className="
              text-[clamp(2.2rem,3.4vw,3.8rem)]
              font-extrabold
              leading-[1.05]
              tracking-tight
              text-white
            "
          >
            Your Business.
            <br />

            Your Shipments.
            <br />

            <span className="text-white/80">
              Always Within Reach.
            </span>
          </h1>

          <p
            className="
              mt-5 max-w-xl
              text-[clamp(1rem,1.35vw,1.35rem)]
              font-medium
              leading-relaxed
              tracking-wide
              text-white/90
            "
          >
            Recover your account
            securely and continue
            <br className="hidden xl:block" />{" "}
            managing orders, shipments
            and fulfillment.
          </p>
        </div>

        <div
          className="
            relative z-10
            mt-auto
            flex min-h-0
            items-end justify-center
            pt-4
          "
        >
          <img
            src={DaakitMap}
            alt="DaakitGo Operations"
            className="
              max-h-[45vh]
              w-full
              object-contain
            "
          />
        </div>
      </aside>
    );
  };

  // =========================================================
  // SEND SCREEN
  // =========================================================

  const SendScreen = () => {
    return (
      <div className="w-full">
        {/* IMPORTANT:
            function call, NOT <LogoHeader />
        */}

        {LogoHeader()}

        <div className="mb-8">
          <div
            className="
              mb-4
              flex h-12 w-12
              items-center justify-center
              rounded-xl
              bg-blue-50
              text-[#0446DB]
            "
          >
            <Smartphone className="h-6 w-6" />
          </div>

          <h2
            className="
              text-3xl
              font-bold
              tracking-tight
              text-gray-900
              sm:text-4xl
            "
          >
            Forgot your password?
          </h2>

          <p
            className="
              mt-3
              text-base font-medium
              leading-relaxed
              text-gray-500
            "
          >
            Enter your registered mobile
            number and we'll send you a
            verification code.
          </p>
        </div>

        <form onSubmit={handleSendOTP}>
          <label
            htmlFor="phone"
            className="
              mb-2 block
              text-[11px]
              font-bold uppercase
              tracking-[0.18em]
              text-gray-600
            "
          >
            Mobile Number
          </label>

          <div
            className="
              flex h-[50px]
              overflow-hidden
              rounded-sm
              border-2 border-gray-300
              bg-[#F8F9FB]
              transition-all

              hover:border-gray-400

              focus-within:border-[#0446DB]
              focus-within:bg-white
              focus-within:ring-4
              focus-within:ring-blue-50
            "
          >
            <span
              className="
                flex items-center
                border-r border-gray-200
                bg-[#F1F3F7]
                px-4
                text-sm font-bold
                text-gray-700
              "
            >
              +91
            </span>

            {/* ============================
                PHONE INPUT
                Continuous typing works
            ============================ */}

            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={phoneNumber}
              onChange={
                handlePhoneNumberChange
              }
              maxLength={10}
              placeholder="XXXXX XXXXX"
              disabled={loading}
              className="
                min-w-0 flex-1
                bg-transparent
                px-4

                text-sm font-medium
                text-gray-900

                outline-none

                placeholder:font-normal
                placeholder:text-gray-400

                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />
          </div>

          

          <button
            type="submit"
            disabled={loading}
            className="
              mt-5
              flex h-[50px] w-full
              items-center justify-center
              gap-2

              rounded-sm
              bg-[#0446DB]

              px-5

              text-sm font-bold
              text-white

              shadow-sm
              transition

              hover:bg-[#0338AF]

              active:scale-[0.99]

              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading ? (
              <>
                <Loader2
                  className="
                    h-5 w-5
                    animate-spin
                  "
                />

                Sending Code...
              </>
            ) : (
              <>
                Send Verification Code

                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="
              inline-flex
              items-center gap-2

              text-sm font-bold
              text-[#0446DB]

              transition

              hover:text-[#0338AF]
            "
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Login
          </Link>
        </div>

        {FooterLinks()}
      </div>
    );
  };

  // =========================================================
  // VERIFY SCREEN
  // =========================================================

  const VerifyScreen = () => {
    return (
      <div className="w-full">
        {LogoHeader()}

        <button
          type="button"
          onClick={goBackToSend}
          className="
            mb-6
            inline-flex
            items-center gap-2
            text-sm font-bold
            text-gray-500
            transition
            hover:text-[#0446DB]
          "
        >
          <ArrowLeft className="h-4 w-4" />

          Change Number
        </button>

        <div className="mb-7">
          <div
            className="
              mb-4
              flex h-12 w-12
              items-center justify-center
              rounded-xl
              bg-blue-50
              text-[#0446DB]
            "
          >
            <Smartphone className="h-6 w-6" />
          </div>

          <h2
            className="
              text-3xl
              font-bold
              tracking-tight
              text-gray-900
              sm:text-4xl
            "
          >
            Enter Verification Code
          </h2>

          <p
            className="
              mt-3
              text-base font-medium
              leading-relaxed
              text-gray-500
            "
          >
            We've sent a 4-digit code to{" "}

            <span
              className="
                font-bold text-gray-900
              "
            >
              {maskedPhone()}
            </span>

            . Please enter it below to
            continue.
          </p>
        </div>

        {/* =====================================
            OTP

            ONLY ONE REAL INPUT
            Four boxes are visual only.
        ===================================== */}

        <div
          className="
            relative
            mx-auto
            max-w-[360px]
            cursor-text
          "
          onClick={() => {
            if (
              timeLeft > 0 &&
              !loading
            ) {
              otpInputRef.current?.focus();
            }
          }}
        >
          {/* ACTUAL INPUT */}

          <input
            ref={otpInputRef}
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            value={otp}
            onChange={handleOtpChange}
            onKeyDown={handleOtpKeyDown}
            maxLength={4}
            disabled={
              loading ||
              timeLeft <= 0
            }
            aria-label="Verification code"
            className="
              absolute inset-0
              z-20
              h-16 w-full
              cursor-text
              opacity-0

              disabled:cursor-not-allowed
            "
          />

          {/* VISUAL BOXES */}

          <div
            className="
              pointer-events-none
              grid grid-cols-4
              gap-3
            "
          >
            {[0, 1, 2, 3].map(
              (index) => {
                const digit =
                  otp[index] || "";

                const isCurrent =
                  otp.length === index;

                const isLast =
                  otp.length === 4 &&
                  index === 3;

                const active =
                  isCurrent || isLast;

                return (
                  <div
                    key={index}
                    className={`
                      relative

                      flex h-16
                      items-center
                      justify-center

                      rounded-xl

                      border-[2px]

                      text-2xl
                      font-bold
                      text-gray-900

                      transition-all
                      duration-200

                      ${
                        active &&
                        timeLeft > 0 &&
                        !loading
                          ? `
                            border-[#0446DB]
                            bg-white
                            shadow-sm
                            ring-4
                            ring-blue-50
                          `
                          : digit
                            ? `
                              border-[#0446DB]
                              bg-blue-50/50
                            `
                            : `
                              border-gray-300
                              bg-gray-100
                            `
                      }
                    `}
                  >
                    {digit}

                    {active &&
                      !digit &&
                      timeLeft > 0 &&
                      !loading && (
                        <span
                          className="
                            h-7
                            w-[2px]
                            animate-pulse
                            bg-[#0446DB]
                          "
                        />
                      )}
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* TIMER */}

        <div className="mt-5 text-center">
          {timeLeft > 0 ? (
            <p
              className="
                text-sm
                font-semibold
                text-gray-500
              "
            >
              Code expires in{" "}

              <span
                className="
                  font-bold
                  text-[#0446DB]
                "
              >
                {formatTime(timeLeft)}
              </span>
            </p>
          ) : (
            <p
              className="
                text-sm
                font-bold
                text-red-600
              "
            >
              Verification code has
              expired.
            </p>
          )}
        </div>

        {/* VERIFY */}

        <button
          type="button"
          onClick={verifyOTP}
          disabled={
            loading ||
            otp.length !== 4 ||
            timeLeft <= 0
          }
          className="
            mt-6

            flex h-[50px] w-full
            items-center justify-center
            gap-2

            rounded-lg
            bg-[#0446DB]

            px-5

            text-sm font-bold
            text-white

            shadow-sm
            transition

            hover:bg-[#0338AF]

            active:scale-[0.99]

            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading ? (
            <>
              <Loader2
                className="
                  h-5 w-5
                  animate-spin
                "
              />

              Verifying...
            </>
          ) : (
            <>
              Verify & Continue

              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>

        {/* RESEND */}

        <button
          type="button"
          onClick={handleResendOTP}
          disabled={
            isResendDisabled ||
            timeLeft > 0 ||
            resending
          }
          className="
            mt-3

            flex h-[48px] w-full
            items-center justify-center
            gap-2

            rounded-lg

            border-2
            border-[#0446DB]

            bg-white

            px-5

            text-sm font-bold
            text-[#0446DB]

            transition

            hover:bg-[#0446DB]
            hover:text-white

            disabled:cursor-not-allowed
            disabled:border-gray-300
            disabled:bg-gray-100
            disabled:text-gray-400
          "
        >
          {resending ? (
            <>
              <Loader2
                className="
                  h-4 w-4
                  animate-spin
                "
              />

              Sending...
            </>
          ) : timeLeft > 0 ? (
            <>
              <RefreshCw className="h-4 w-4" />

              Resend Code in{" "}
              {formatTime(timeLeft)}
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />

              Resend Code
            </>
          )}
        </button>

        {SecurityTip()}

        {FooterLinks()}
      </div>
    );
  };

  // =========================================================
  // CHANGE PASSWORD SCREEN
  // =========================================================

  const ChangePasswordScreen =
    () => {
      const passwordsMatch =
        password &&
        confirmPassword &&
        password ===
          confirmPassword;

      return (
        <div className="w-full">
          {LogoHeader()}

          <div className="mb-7">
            <div
              className="
                mb-4
                flex h-12 w-12
                items-center justify-center
                rounded-xl
                bg-blue-50
                text-[#0446DB]
              "
            >
              <LockKeyhole className="h-6 w-6" />
            </div>

            <h2
              className="
                text-3xl
                font-bold
                tracking-tight
                text-gray-900
                sm:text-4xl
              "
            >
              Create new password
            </h2>

            <p
              className="
                mt-3
                text-base font-medium
                text-gray-500
              "
            >
              Choose a strong password
              to protect your account.
            </p>
          </div>

          <div className="space-y-5">
            {/* NEW PASSWORD */}

            <div>
              <label
                htmlFor="new-password"
                className="
                  mb-2 block
                  text-[11px]
                  font-bold uppercase
                  tracking-[0.18em]
                  text-gray-600
                "
              >
                New Password
              </label>

              <div className="relative">
                <input
                  id="new-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  maxLength={50}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  disabled={loading}
                  className="
                    h-[50px] w-full

                    rounded-lg

                    border-2
                    border-gray-300

                    bg-[#F8F9FB]

                    px-4 pr-12

                    text-sm
                    font-medium
                    text-gray-900

                    outline-none

                    transition-all

                    placeholder:text-gray-400

                    hover:border-gray-400

                    focus:border-[#0446DB]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-blue-50
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="
                    absolute
                    right-4 top-1/2
                    -translate-y-1/2

                    text-gray-500

                    transition

                    hover:text-[#0446DB]
                  "
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}

            <div>
              <label
                htmlFor="confirm-password"
                className="
                  mb-2 block

                  text-[11px]
                  font-bold uppercase
                  tracking-[0.18em]
                  text-gray-600
                "
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    confirmPassword
                  }
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  maxLength={50}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  disabled={loading}
                  className={`
                    h-[50px] w-full

                    rounded-lg

                    border-2

                    bg-[#F8F9FB]

                    px-4 pr-12

                    text-sm
                    font-medium
                    text-gray-900

                    outline-none

                    transition-all

                    placeholder:text-gray-400

                    focus:bg-white
                    focus:ring-4

                    ${
                      confirmPassword &&
                      password !==
                        confirmPassword
                        ? `
                          border-red-400
                          focus:border-red-500
                          focus:ring-red-50
                        `
                        : passwordsMatch
                          ? `
                            border-green-400
                            focus:border-green-500
                            focus:ring-green-50
                          `
                          : `
                            border-gray-300
                            hover:border-gray-400
                            focus:border-[#0446DB]
                            focus:ring-blue-50
                          `
                    }
                  `}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  className="
                    absolute
                    right-4 top-1/2
                    -translate-y-1/2

                    text-gray-500

                    transition

                    hover:text-[#0446DB]
                  "
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {password &&
                confirmPassword &&
                password !==
                  confirmPassword && (
                  <p
                    className="
                      mt-2
                      text-xs
                      font-semibold
                      text-red-600
                    "
                  >
                    Passwords do not
                    match.
                  </p>
                )}

              {passwordsMatch && (
                <p
                  className="
                    mt-2
                    flex items-center
                    gap-1
                    text-xs
                    font-semibold
                    text-green-600
                  "
                >
                  <Check className="h-3.5 w-3.5" />

                  Passwords match.
                </p>
              )}
            </div>
          </div>

          {/* PASSWORD RULES */}

          <div
            className="
              mt-6
              rounded-lg
              border border-gray-100
              bg-gray-50
              p-5
            "
          >
            <p
              className="
                mb-4
                text-sm
                font-bold
                tracking-wide
                text-gray-800
              "
            >
              Password must contain:
            </p>

            <div className="space-y-3">
              {PasswordRule(
                passwordRules.length,
                "Minimum 8 characters"
              )}

              {PasswordRule(
                passwordRules.uppercase,
                "At least one uppercase letter"
              )}

              {PasswordRule(
                passwordRules.number,
                "At least one number"
              )}
            </div>
          </div>

          {/* RESET */}

          <button
            type="button"
            onClick={
              SubmitChangePassword
            }
            disabled={
              loading ||
              !isPasswordValid ||
              !confirmPassword ||
              password !==
                confirmPassword
            }
            className="
              mt-6

              flex h-[50px] w-full
              items-center
              justify-center
              gap-2

              rounded-lg

              bg-[#0446DB]

              px-5

              text-sm
              font-bold
              text-white

              shadow-sm

              transition

              hover:bg-[#0338AF]

              active:scale-[0.99]

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? (
              <>
                <Loader2
                  className="
                    h-5 w-5
                    animate-spin
                  "
                />

                Updating Password...
              </>
            ) : (
              <>
                Reset & Log In

                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="
                inline-flex
                items-center
                gap-2

                text-sm
                font-bold
                text-[#0446DB]

                transition

                hover:text-[#0338AF]
              "
            >
              <ArrowLeft className="h-4 w-4" />

              Back to Login
            </Link>
          </div>

          {FooterLinks()}
        </div>
      );
    };

  // =========================================================
  // RIGHT PANEL
  //
  // IMPORTANT:
  // Screens are called as functions.
  // DO NOT write <SendScreen />
  // =========================================================

  const RightPanel = () => {
    return (
      <section
        className="
          relative

          flex flex-1
          flex-col

          overflow-hidden

          bg-transparent

          px-3 py-3

          lg:px-5
          lg:py-4
        "
      >
        <div
          className="
            flex h-full flex-1
            items-center
            justify-center
            overflow-hidden
          "
        >
          <div
            className="
              hide-scrollbar

              relative z-10

              flex

              max-h-[calc(100vh-32px)]
              min-h-[650px]

              w-full
              max-w-[42rem]

              flex-col

              overflow-y-auto

              rounded-xl

              border
              border-gray-100

              bg-white

              px-6 py-8

              shadow-[0_20px_60px_-28px_rgba(15,23,42,0.28)]

              sm:px-10

              lg:px-12

              xl:px-14
            "
          >
            <div className="my-auto w-full">
              {/* =================================
                  IMPORTANT FIX

                  NOT:
                  <SendScreen />

                  USE:
                  SendScreen()
              ================================= */}

              {currentStep === "send" &&
                SendScreen()}

              {currentStep === "verify" &&
                VerifyScreen()}

              {currentStep ===
                "change-password" &&
                ChangePasswordScreen()}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // =========================================================
  // MAIN RETURN
  //
  // IMPORTANT:
  // LeftPanel() and RightPanel()
  // NOT <LeftPanel /> <RightPanel />
  // =========================================================

  return (
    <section
      className="
        min-h-screen
        bg-[#0446DB]
      "
      style={{
        background:
          "radial-gradient(circle at top right, #d9daab 0%, rgba(191,191,150,.35) 30%, rgba(191,191,150,.08) 50%, transparent 70%), linear-gradient(135deg, #0345DA 0%, #0345DA 100%)",
      }}
    >
      <main
        className="
          flex min-h-screen
          overflow-hidden
          font-sans
          lg:h-screen
        "
      >
        {/* IMPORTANT */}

        {LeftPanel()}

        {RightPanel()}
      </main>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default ForgotPassword;