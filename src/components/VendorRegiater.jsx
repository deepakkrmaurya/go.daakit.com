
import { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import SignUpImage from '../assets/daakitmap.png';
import DaakitGoLogo from "../assets/DaakitGo-Logo.jpg";

const baseURL = import.meta.env.VITE_BASE_URL;

const VendorRegistrationPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1); // 1: Registration, 2: OTP Verification
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        phoneNumber: '',
        email: '',
        password: '',
        agreeToTerms: false
    });
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes for OTP
    const [captchaToken, setCaptchaToken] = useState("");
    const [loading, setLoading] = useState(false);
    const monthlyShipmentOptions = [
        'Less than 100',
        '100 - 500',
        '500 - 1000',
        '1000 - 5000',
        'More than 5000'
    ];

    // OTP Timer Effect

    useEffect(() => {
        if (currentStep === 2 && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [currentStep, timeLeft]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {

            const response = await axios.post(`${baseURL}/api/check/user`, {
                "phone": formData.phoneNumber,
                "email": formData.email,
                "user_type": "vendor"
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.data.exists) {
                toast.error(response.data.message)
                return
            }
            const res = await axios.post(`${baseURL}/api/otp/sendsignupotp`, {
                phone: formData.phoneNumber
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.data.success) {
                toast.success(res.data.message);
                setCurrentStep(2);
                setTimeLeft(180);
                setOtp(['', '', '', ''])
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOTPChange = (index, value) => {
        if (value.length > 1) value = value.slice(0, 1);
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleOTPVerify = async () => {

        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 4) {
            toast.error("Please enter complete OTP");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(`${baseURL}/api/otp/verifysignupotp`, {
                phone: formData.phoneNumber,
                otp: enteredOtp
            });

            if (res.data.success) {
                const res = await axios.post(`${baseURL}/api/vendor/createVendor`, {
                    "vendor_name": `${formData.firstName} ${formData.lastName}`,
                    "email": formData.email,
                    "phone": formData.phoneNumber,
                    "password": formData.password,
                    "company_name": formData.companyName,
                    "accepted_agreement": formData.agreeToTerms ? "1" : 0
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (res.data.success) {
                    toast.success("Vendor registerd successfully...")
                    setTimeout(() => {
                        navigate('/login');

                    }, 2000)
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "OTP verification failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            const res = await axios.post(`${baseURL}/api/otp/sendsignupotp`, {
                phone: formData.phoneNumber
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.data.success) {
                setTimeLeft(180);
                setOtp(['', '', '', ''])
                toast.success("New OTP sent to your number");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to resend OTP.");
        }
    };

    const isStep1Valid = () => {
        return (
            formData.firstName &&
            formData.companyName &&
            formData.phoneNumber &&
            formData.email &&
            formData.password &&
            formData.agreeToTerms
        );
    };

    const handleCaptchaChange = (value) => {
        setCaptchaToken(value);
    };
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Left Section - Hero/Brand Area */}
            <div className="hidden lg:flex lg:w-[58%] xl:w-[60%] bg-[#0446DB] text-white relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

                <div className="relative z-10 w-full flex flex-col items-center justify-center px-12 py-8">
                    {/* Branding */}
                    <div className="mb-8 text-center px-4">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight">
                            Join the DaakitGo Vendor Community and <br /> Simplify Your Shipping.
                        </h1>
                        <p className="text-indigo-100 text-base sm:text-lg md:text-xl">
                            Trusted by thousands of growing businesses across India
                        </p>
                    </div>


                    {/* Sign Up Illustration */}
                    <div className="w-full max-w-2xl">
                        <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center p-8">
                            <img
                                src={SignUpImage}
                                alt="Sign Up Process"
                                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                            />
                        </div>
                    </div>


                </div>
            </div>

            {/* Right Section - Registration Area */}
            <div className="flex-1 lg:max-w-[42%] xl:max-w-[40%] flex flex-col overflow-auto bg-white">
                {/* Logo */}
                <div className="flex justify-center pt-8 pb-4">
                    <img
                        src={DaakitGoLogo}
                        alt="DaakitGo"
                        className="h-16 w-auto object-contain"
                    />
                </div>

                {/* Registration Container */}
                <div className="flex-1 flex flex-col justify-center px-1 sm:px-5 w-full pb-3">
                    {currentStep === 1 ? (
                        // Registration Form
                        <div className="bg-white rounded-2xl p-2 md:p-8 shadow-sm border border-gray-100">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Create Your Account
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    Fill in your details to get started with shipping
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Personal Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            // onChange={handleInputChange}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/[^A-Za-z ]/g, "");
                                                setFormData({ ...formData, firstName: value });
                                            }}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                                            placeholder="Enter your first name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            // onChange={handleInputChange}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/[^A-Za-z ]/g, "");
                                                setFormData({ ...formData, lastName: value });
                                            }}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                                            placeholder="Enter your last name"
                                        />
                                    </div>
                                </div>

                                {/* Company Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Company Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                                            placeholder="Enter company name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                handleInputChange({
                                                    target: {
                                                        name: "phoneNumber",
                                                        value,
                                                    },
                                                });
                                            }}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                                            placeholder="Enter your phone number"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Account Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                                                placeholder="your@email.com"
                                                required
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Password *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}

                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                                                placeholder="Create a password"
                                                required
                                            />
                                            {/* <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                </svg>
                                            </div> */}
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? (
                                                    <EyeSlashIcon className="w-5 h-5" />
                                                ) : (
                                                    <EyeIcon className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Terms and Conditions */}
                                <div className="flex items-start space-x-3">
                                    <input
                                        type="checkbox"
                                        name="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onChange={handleInputChange}
                                        className="mt-1 w-4 h-4 text-[#0446DB] border-gray-300 rounded focus:ring-[#0446DB]"
                                        required
                                    />
                                    <label className="text-sm text-gray-600">
                                        By submitting Signup form, you agree to our{' '}
                                        <a href="https://daakit.com/privacy-policy/" className="text-[#0446DB] hover:text-[rgb(70,62,180)] font-medium">
                                            Terms Of Service
                                        </a>{' '}
                                        and{' '}
                                        <a href="https://daakit.com/privacy-policy/" className="text-[#0446DB] hover:text-[rgb(70,62,180)] font-medium">
                                            Privacy Policy
                                        </a>
                                        .
                                    </label>
                                </div>
                                <div className="my-4">
                                    <ReCAPTCHA
                                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                        onChange={handleCaptchaChange}
                                    />
                                </div>

                                {/* Submit Button */}
                                {/* || !captchaToken */}
                                <button
                                    type="submit"
                                    disabled={!isStep1Valid() || loading || !captchaToken}
                                    className="w-full cursor-pointer bg-[#0446DB] hover:bg-[rgb(70,62,180)] disabled:bg-gray-400 text-white font-medium py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0446DB] flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Account...
                                        </>
                                    ) : (
                                        'Create Account & Continue'
                                    )}
                                </button>

                                {/* Login Link */}
                                <div className="text-center pt-4 border-t border-gray-200">
                                    <p className="text-gray-600">
                                        Already a User?{' '}
                                        <Link to="/login" className="text-[#0446DB] hover:text-[rgb(70,62,180)] font-semibold">
                                            Login
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    ) : (

                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-[#0446DB] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Verify Your Phone
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    We sent a 4-digit code to your phone
                                </p>
                                <p className="text-[#0446DB] font-semibold mt-2">
                                    {formData.phoneNumber}
                                </p>
                            </div>

                            {/* OTP Input */}
                            <div className="flex justify-center gap-3 mb-6">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        value={digit}
                                        onChange={(e) => handleOTPChange(index, e.target.value)}
                                        className="w-12 h-12 text-center text-xl font-bold bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-200"
                                        maxLength="1"
                                        style={{
                                            WebkitAppearance: 'none',
                                            MozAppearance: 'textfield'
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Timer */}
                            <div className="text-center mb-6">
                                <p className={`text-lg font-semibold ${timeLeft > 60 ? 'text-green-600' : timeLeft > 30 ? 'text-orange-500' : 'text-red-600'
                                    }`}>
                                    {timeLeft > 0 ? `Time remaining: ${formatTime(timeLeft)}` : 'Code expired'}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-4">
                                <button
                                    onClick={handleOTPVerify}
                                    disabled={otp.join('').length !== 4 || loading || timeLeft === 0}
                                    className="w-full cursor-pointer bg-[#0446DB] hover:bg-[rgb(70,62,180)] disabled:bg-gray-400 text-white font-medium py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0446DB] flex items-center justify-center"
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
                                        'Verify OTP'
                                    )}
                                </button>

                                <button
                                    onClick={handleResendOTP}
                                    disabled={timeLeft > 0 || loading}
                                    className="w-full py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 font-medium rounded-xl transition-colors duration-200"
                                >
                                    Resend Code
                                </button>

                                <button
                                    onClick={() => setCurrentStep(1)}
                                    className="w-full py-3 text-[#0446DB] hover:text-[rgb(70,62,180)] font-medium"
                                >
                                    Back to Registration
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} DaakitGo. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorRegistrationPage;