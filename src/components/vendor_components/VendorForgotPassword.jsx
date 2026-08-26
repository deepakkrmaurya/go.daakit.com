import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from "lucide-react";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const baseURL = import.meta.env.VITE_BASE_URL;
const VendorForgotPassword = () => {
    const [currentStep, setCurrentStep] = useState('send');

    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [otp, setOtp] = useState(Array(4).fill(''));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const inputsRef = useRef([]);

    // Timer effect
    useEffect(() => {
        if (currentStep === 'verify' && timeLeft > 0) {
            const timerId = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timerId);
        } else if (currentStep === 'verify' && timeLeft <= 0) {
            setIsResendDisabled(false);
        }
    }, [currentStep, timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Send OTP Function
    const handleSendOTP = async (e) => {
        e.preventDefault();

        if (!phoneNumber) {
            setError('Please enter your phone number');
            return;
        }

        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(phoneNumber.replace(/\D/g, ''))) {
            setError('Please enter a valid phone number');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {

            const response = await axios.post(`${baseURL}/api/otp/sendpasswordchangeotp`, {
                phone: phoneNumber.replace(/\D/g, ''),
            },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                setOtp(Array(4).fill(''));
                setSuccess('OTP sent successfully!');
                setCurrentStep('verify');
                setTimeLeft(180);
                setIsResendDisabled(true);
            } else {
                setError(response.data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to send OTP. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP Function
    const handleResendOTP = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${baseURL}/api/otp/sendpasswordchangeotp`, {
                phone: phoneNumber.replace(/\D/g, '')
            });

            if (response.data.success) {
                setSuccess('New OTP sent successfully!');
                setTimeLeft(180);
                setOtp(Array(4).fill(''));
                setIsResendDisabled(true);
                inputsRef.current[0]?.focus();
            } else {
                setError(response.data.message || 'Failed to resend OTP');
            }
        } catch (err) {
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // OTP Input Handlers
    const handleInputChange = (index, value) => {
        if (value.length > 1) {
            value = value.slice(0, 1);
        }

        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }

        // Auto-verify when all fields are filled
        if (newOtp.every(digit => digit !== '') && newOtp.length === 6) {
            verifyOTP(newOtp.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }

        if (e.key === 'e') {
            e.preventDefault();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 4);
        if (/^\d+$/.test(pasteData)) {
            const newOtp = [...otp];
            pasteData.split('').forEach((char, index) => {
                if (index < 4) {
                    newOtp[index] = char;
                }
            });
            setOtp(newOtp);

            const nextEmptyIndex = newOtp.findIndex((val, idx) => !val && idx < 3);
            const focusIndex = nextEmptyIndex === -1 ? 3 : nextEmptyIndex;
            inputsRef.current[focusIndex]?.focus();
        }
    };

    // Verify OTP Function
    const verifyOTP = async (enteredOtp = null) => {
        const otpToVerify = enteredOtp || otp.join('');

        if (otpToVerify.length !== 4) {
            setError('Please enter a 4-digit OTP');
            return;
        }

        if (timeLeft <= 0) {
            setError('OTP has expired. Please request a new one.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await axios.post(`${baseURL}/api/otp/verifypasswordchangeotp`, {
                phone: phoneNumber.replace(/\D/g, ''),
                otp: otpToVerify
            });

            if (response.data.success) {
                setSuccess('Phone number verified successfully!');
                // Redirect or proceed with your application flow
                setTimeout(() => {
                    setCurrentStep('change-password')
                }, 1000);
            } else {
                setError(response.data.message || 'Invalid OTP. Please try again.');
            }
        } catch (err) {

            setSuccess("");
            setError(err.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        const formattedValue = value.replace(/[^\d+-\s]/g, '');
        setPhoneNumber(formattedValue);
        setError('');
    };

    const goBackToSend = () => {
        setCurrentStep('send');
        setError('');
        setSuccess('');
        setOtp(Array(4).fill(''));
    };
    const navigate = useNavigate()
    const SubmitChangePassword = async () => {
        if (!password) {
            toast.error('Please Enter password')
            return
        }

        try {
            const response = await axios.post(`${baseURL}/api/vendor/resetVendorPassword`, {
                phone: phoneNumber.replace(/\D/g, ''),
                otp: otp.join(''),
                new_password: password

            },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                setSuccess(response.data.message)
                setTimeout(() => {
                    navigate('/login')
                }, 2000)
            }
        } catch (error) {

        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#EEEEEE] p-4">
            <div className="bg-gray-100 rounded-lg shadow-2xl p-8 w-full max-w-md ">

                {currentStep === 'send' ? (

                    <>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-[#0446DB] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-[#0446DB] mb-2">
                                Verify Your Phone
                            </h1>
                            <p className="text-gray-800">
                                We'll send a verification code to your phone number
                            </p>
                        </div>

                        <form onSubmit={handleSendOTP} className="space-y-6">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-[#0446DB] mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={phoneNumber}
                                        onChange={handlePhoneNumberChange}
                                        placeholder="Enter your phone number"
                                        className="w-full px-4 py-3 bg-gray-200 border border-[#0446DB] rounded-lg text-[#0446DB] placeholder-[#0446DB] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        disabled={loading}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className="w-5 h-5 text-[#0446DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>

                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 text-sm font-medium">{error}</p>
                                </div>


                            )}

                            {success && (
                                <div className="p-3 bg-green-900/50 border border-green-700 rounded-lg">
                                    <p className="text-green-200 text-sm">{success}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 bg-[#0446DB] text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending OTP...
                                    </>
                                ) : (
                                    'Send Verification Code'
                                )}
                            </button>
                        </form>
                    </>
                ) : currentStep === 'change-password' ? (
                    <>
                        <div>
                            <div>
                                {success && (
                                    <div className="p-3 bg-green-900/90 border border-green-700 rounded-lg">
                                        <p className="text-green-200 text-sm">{success}</p>
                                    </div>
                                )}
                                <h1 className=' text-[#0446DB] font-bold'>New Password</h1>
                                <div className="relative">
                                    <input
                                        type={show ? "text" : "password"}
                                        placeholder="Enter new password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        className=" border border-[#0446DB] text-[#0446DB] w-full py-2 rounded px-2  pr-10"
                                    />

                                    {/* Eye Icon */}
                                    <span
                                        onClick={() => setShow(!show)}
                                        className="absolute right-3 top-2.5 cursor-pointer text-[#0446DB]"
                                    >
                                        {show ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </span>

                                    <button
                                        onClick={() => SubmitChangePassword()}
                                        className="bg-[#0446DB] w-full mt-3 py-1 rounded text-white cursor-pointer"
                                    >
                                        Submit
                                    </button>
                                </div>

                            </div>
                        </div>
                    </>
                ) : (

                    <>
                        <button
                            onClick={goBackToSend}
                            className="flex items-center text-[#0446DB]  mb-4 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-[#0446DB] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-[#0446DB] mb-2">
                                Verify OTP
                            </h1>
                            <p className="text-gray-800 mb-1">
                                Enter the code sent to
                            </p>
                            {/* <p className="text-[#0446DB] font-semibold">{phoneNumber}</p> */}
                        </div>

                        <div className={`text-lg font-semibold text-center mb-6 ${timeLeft > 0 ? 'text-orange-400' : 'text-red-400'
                            }`}>
                            {timeLeft > 0
                                ? `Time remaining: ${formatTime(timeLeft)}`
                                : "Code expired"
                            }
                        </div>

                        <div className="flex justify-center gap-2 mb-6">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputsRef.current[index] = el)}
                                    type="text"
                                    value={digit}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    disabled={timeLeft <= 0 || loading}
                                    className="w-12 h-12 text-center text-lg font-semibold text-[#0446DB]  border border-[#0446DB] rounded-md  focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        WebkitAppearance: 'none',
                                        MozAppearance: 'textfield'
                                    }}
                                />
                            ))}
                        </div>

                        {error && (
                             <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 text-sm font-medium">{error}</p>
                                </div>
                        )}

                        {success && (
                            <div className="p-3 bg-green-900/50 border border-green-700 rounded-lg mb-4">
                                <p className="text-green-200 text-sm">{success}</p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => verifyOTP()}
                                disabled={otp.join('').length !== 4 || loading || timeLeft <= 0}
                                className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify'
                                )}
                            </button>

                            <button
                                onClick={handleResendOTP}
                                disabled={isResendDisabled || loading}
                                className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed"
                            >
                                Resend Code
                            </button>
                        </div>
                    </>
                )}

                {/* <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div> */}
            </div>
        </div>
    );
};

export default VendorForgotPassword;