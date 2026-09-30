
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

import SignUpImage from "@/assets/daakitmap.png";
import DaakitGoLogo from "@/assets/DaakitGo-Logo.jpg";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  DevicePhoneMobileIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const inputClass =
  "h-[46px] w-full rounded-lg border-2 border-gray-300 bg-[#F8F9FB] px-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-400 focus:border-[#0446DB] focus:bg-white focus:ring-4 focus:ring-blue-50";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);

  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    phoneNumber: "",
    tech_based: "0",
    email: "",
    password: "",
    agreeToTerms: "0",
  });

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(180);

  /* ================================
     OTP TIMER
  ================================= */

  useEffect(() => {
    if (currentStep !== 2 || timeLeft <= 0) return;

    const timer = window.setTimeout(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [currentStep, timeLeft]);

  /* ================================
     INPUT HANDLERS
  ================================= */

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    }));
  };

  const handleNameChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value.replace(/[^A-Za-z ]/g, ""),
    }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);

    setFormData((prev) => ({
      ...prev,
      phoneNumber: value,
    }));
  };

  /* ================================
     PASSWORD STRENGTH
  ================================= */

  const passwordStrength = useMemo(() => {
    const password = formData.password;

    if (!password) {
      return {
        score: 0,
        label: "",
        barClass: "bg-gray-100",
        textClass: "text-gray-400",
      };
    }

    let score = 0;

    if (password.length >= 8) score += 1;

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      score += 1;
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    }

    if (/[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]/.test(password)) {
      score += 1;
    }

    if (score <= 1) {
      return {
        score,
        label: "WEAK",
        barClass: "bg-red-500",
        textClass: "text-red-500",
      };
    }

    if (score <= 3) {
      return {
        score,
        label: "MEDIUM",
        barClass: "bg-amber-400",
        textClass: "text-amber-500",
      };
    }

    return {
      score: 4,
      label: "STRONG",
      barClass: "bg-[#0446DB]",
      textClass: "text-[#0446DB]",
    };
  }, [formData.password]);

  /* ================================
     FORM VALIDATION
  ================================= */

  const isStep1Valid = () => {
    return Boolean(
      formData.firstName.trim() &&
      formData.companyName.trim() &&
      formData.phoneNumber.length === 10 &&
      formData.email.trim() &&
      formData.password.length >= 8 &&
      formData.agreeToTerms === "1" &&
      captchaToken,
    );
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.error("Please enter first name.");
      return false;
    }

    if (!formData.companyName.trim()) {
      toast.error("Please enter company name.");
      return false;
    }

    if (formData.phoneNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return false;
    }

    if (formData.agreeToTerms !== "1") {
      toast.error("Please accept the Terms of Service and Privacy Policy.");
      return false;
    }

    if (!captchaToken) {
      toast.error("Please verify the reCAPTCHA.");
      return false;
    }

    return true;
  };

  /* ================================
     STEP 1 - SEND OTP
  ================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      /* Check Merchant */

      const response = await axios.post(
        `${baseURL}/api/check/user`,
        {
          phone: formData.phoneNumber,
          email: formData.email.trim(),
          user_type: "merchant",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data?.exists) {
        toast.error(response.data?.message || "User already exists.");
        return;
      }

      /* Send OTP */

      const res = await axios.post(
        `${baseURL}/api/otp/sendsignupotp`,
        {
          phone: formData.phoneNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.data?.success) {
        toast.error(res.data?.message || "Unable to send OTP.");
        return;
      }

      toast.success(res.data?.message || "OTP sent successfully!");

      setOtp(["", "", "", ""]);
      setTimeLeft(180);
      setCurrentStep(2);

      window.setTimeout(() => {
        document.getElementById("otp-0")?.focus();
      }, 150);
    } catch (err) {
      console.error("Registration error:", err);

      toast.error(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     OTP INPUT
  ================================= */

  const handleOTPChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const nextOtp = [...otp];

    nextOtp[index] = digit;

    setOtp(nextOtp);

    if (digit && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }

    if (e.key === "ArrowRight" && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }

    if (e.key === "Enter" && otp.join("").length === 4) {
      handleOTPVerify();
    }
  };

  const handleOTPPaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);

    if (!pasted) return;

    const nextOtp = ["", "", "", ""];

    pasted.split("").forEach((digit, index) => {
      nextOtp[index] = digit;
    });

    setOtp(nextOtp);

    window.setTimeout(() => {
      const index = Math.min(pasted.length, 4) - 1;

      document.getElementById(`otp-${index}`)?.focus();
    }, 0);
  };

  /* ================================
     VERIFY OTP + CREATE MERCHANT
  ================================= */

  const handleOTPVerify = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 4) {
      toast.error("Please enter complete 4-digit OTP.");
      return;
    }

    if (timeLeft <= 0) {
      toast.error("OTP has expired. Please resend OTP.");
      return;
    }

    setLoading(true);

    try {
      /* Verify OTP */

      const verifyResponse = await axios.post(
        `${baseURL}/api/otp/verifysignupotp`,
        {
          phone: formData.phoneNumber,
          otp: enteredOtp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!verifyResponse.data?.success) {
        toast.error(verifyResponse.data?.message || "OTP verification failed.");
        return;
      }

      /* Create Merchant */

      const merchantResponse = await axios.post(
        `${baseURL}/api/merchant/createMerchant`,
        {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email.trim(),
          phone: formData.phoneNumber,
          password: formData.password,
          tech_based: formData.tech_based,
          company_name: formData.companyName.trim(),
          accepted_agreement: formData.agreeToTerms,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!merchantResponse.data?.success) {
        toast.error(
          merchantResponse.data?.message ||
            "Unable to create merchant account.",
        );
        return;
      }

      toast.success(
        merchantResponse.data?.message || "Merchant registered successfully.",
      );

      setCurrentStep(3);
    } catch (err) {
      console.error("OTP / Merchant creation error:", err);

      toast.error(
        err.response?.data?.message ||
          "OTP verification failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     RESEND OTP
  ================================= */

  const handleResendOTP = async () => {
    if (timeLeft > 0 || resending) return;

    setResending(true);

    try {
      const res = await axios.post(
        `${baseURL}/api/otp/sendsignupotp`,
        {
          phone: formData.phoneNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.data?.success) {
        toast.error(res.data?.message || "Unable to resend OTP.");
        return;
      }

      setOtp(["", "", "", ""]);
      setTimeLeft(180);

      toast.success(res.data?.message || "New OTP sent successfully.");

      window.setTimeout(() => {
        document.getElementById("otp-0")?.focus();
      }, 100);
    } catch (err) {
      console.error("Resend OTP error:", err);

      toast.error(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  /* ================================
     CHANGE NUMBER
  ================================= */

  const handleChangeNumber = () => {
    setOtp(["", "", "", ""]);
    setTimeLeft(180);
    setCurrentStep(1);

    window.setTimeout(() => {
      document.getElementById("phoneNumber")?.focus();
    }, 100);
  };

  /* ================================
     FORMAT TIMER
  ================================= */

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${minutes}:${String(secs).padStart(2, "0")}`;
  };

  const maskedPhone = useMemo(() => {
    if (!formData.phoneNumber) return "";

    if (formData.phoneNumber.length < 6) {
      return `+91 ${formData.phoneNumber}`;
    }

    return `+91 ${formData.phoneNumber.slice(0, 6)}XXXX`;
  }, [formData.phoneNumber]);

  /* ================================
     STEPPER
  ================================= */

  const Stepper = () => {
    const steps = [
      {
        number: 1,
        title: "Details",
      },
      {
        number: 2,
        title: "Verify",
      },
      {
        number: 3,
        title: "Done",
      },
    ];

    return (
      <div className="mb-6 flex w-full items-start">
        {steps.map((step, index) => {
          const completed = currentStep > step.number;

          const active = currentStep === step.number;

          return (
            <React.Fragment key={step.number}>
              <div className="flex min-w-[52px] flex-col items-center">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-[9px] text-[11px] font-bold transition-all ${
                    completed
                      ? "bg-[#198038] text-white"
                      : active
                        ? "border-2 border-[#0446DB] bg-white text-[#0446DB]"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {completed ? (
                    <CheckIcon className="h-4 w-4 stroke-[3]" />
                  ) : (
                    step.number
                  )}
                </div>

                <span
                  className={`mt-1.5 text-[11px] ${
                    active
                      ? "font-bold text-gray-900"
                      : completed
                        ? "font-medium text-gray-500"
                        : "font-medium text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`mt-[14px] h-[2px] flex-1 ${
                    currentStep > step.number ? "bg-[#198038]" : "bg-gray-100"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  /* ================================
     LEFT PANEL
  ================================= */

  const LeftPanel = () => (
    <aside
      className="relative hidden h-screen w-[51%] flex-col overflow-hidden rounded-tr-[58px] px-10 py-12 lg:flex xl:px-12"
      style={{
        background:
          "radial-gradient(circle at 100% 0%, rgba(232,225,160,.78) 0%, rgba(141,170,198,.58) 27%, rgba(4,70,219,0) 54%), linear-gradient(135deg, #0647d9 0%, #245acb 100%)",
      }}
    >
      <div className="pointer-events-none absolute -right-36 -top-36 h-96 w-96 rounded-full bg-white/[0.05]" />

      <div className="pointer-events-none absolute -bottom-44 -left-44 h-[420px] w-[420px] rounded-full bg-black/[0.04]" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="mt-2">
          <h1 className="text-[clamp(2.5rem,3.4vw,4rem)] font-extrabold leading-[1.05] tracking-tight text-white">
            Start Your Shipping <br />
            Journey.
          </h1>

          <p className="mt-4 text-[clamp(1rem,1.3vw,1.35rem)] font-semibold text-white/95">
            Join thousands of businesses trusting DAAKitGo
          </p>
        </div>

        <div className="mt-auto flex min-h-0 flex-1 items-end justify-center pt-6">
          <img
            src={SignUpImage}
            alt="DaakitGo platform"
            className="max-h-[47vh] w-[92%] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,.10)]"
          />
        </div>
      </div>
    </aside>
  );

  /* ================================
     DETAILS STEP
  ================================= */

  const DetailsStep = () => (
    <div className="w-full">
      {Stepper()}

      <div className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-[28px]">
          Create your account
        </h1>

        <p className="mt-1.5 text-sm font-medium text-gray-500">
          Enter your details to register your DaakitGo account.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* NAME */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[.06em] text-gray-700">
              First Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleNameChange("firstName", e.target.value)}
              placeholder="First name"
              autoComplete="given-name"
              maxLength={50}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[.06em] text-gray-700">
              Last Name
            </label>

            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleNameChange("lastName", e.target.value)}
              placeholder="Last name"
              autoComplete="family-name"
              maxLength={50}
              className={inputClass}
            />
          </div>
        </div>

        {/* COMPANY + EMAIL */}

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[.06em] text-gray-700">
              Company Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Your company"
              autoComplete="organization"
              maxLength={100}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[.06em] text-gray-700">
              Work Email <span className="text-red-500">*</span>
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="dev@company.com"
              autoComplete="email"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[.06em] text-gray-700">
            Tech Based <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <select
              name="tech_based"
              value={formData.tech_based}
              onChange={handleInputChange}
              required
              className="h-[46px] w-full appearance-none rounded-lg border-2 border-gray-300 bg-[#F8F9FB] px-4 pr-11 text-sm font-medium text-gray-900 outline-none transition-all
                 hover:border-gray-400
                 focus:border-[#0446DB]
                 focus:bg-white
                 focus:ring-4
                 focus:ring-blue-50
                 cursor-pointer"
            >
              <option value="">Select Tech Based</option>
              <option value="1">Tech Based</option>
              <option value="0">Not Tech Based</option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <ChevronDownIcon className="h-4 w-4 stroke-[2.5] text-gray-500" />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[.06em] text-gray-700">
            Mobile Number <span className="text-red-500">*</span>
          </label>

          <div className="flex h-[46px] overflow-hidden rounded-lg border-2 border-gray-300 bg-[#F8F9FB] transition-all focus-within:border-[#0446DB] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50">
            <span className="flex items-center border-r border-gray-200 bg-[#F1F3F7] px-4 text-sm font-bold text-gray-700">
              +91
            </span>

            <input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              placeholder="XXXXX XXXXX"
              className="min-w-0 flex-1 bg-transparent px-4 text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* PASSWORD */}

        <div className="mt-4">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[.06em] text-gray-700">
            Create Password <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              maxLength={50}
              className={`${inputClass} pr-12`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* PASSWORD STRENGTH */}

          <div className="mt-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                Password Strength
              </span>

              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${passwordStrength.textClass}`}
              >
                {passwordStrength.label}
              </span>
            </div>

            <div className="mt-1.5 flex gap-1.5">
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={`h-1 flex-1 rounded-full ${
                    bar <= passwordStrength.score
                      ? passwordStrength.barClass
                      : "bg-gray-100"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CAPTCHA */}

        <div className="mt-4 max-w-full overflow-x-auto">
          {recaptchaSiteKey ? (
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={recaptchaSiteKey}
              onChange={(value) => setCaptchaToken(value || "")}
              onExpired={() => setCaptchaToken("")}
              onErrored={() => setCaptchaToken("")}
            />
          ) : (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
              VITE_RECAPTCHA_SITE_KEY is missing in your .env file.
            </div>
          )}
        </div>

        {/* TERMS */}

        <div className="mt-4 flex items-start gap-3">
          <input
            id="agreeToTerms"
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms === "1"}
            onChange={handleInputChange}
            className="mt-1 h-4 w-4 cursor-pointer accent-[#0446DB]"
          />

          <label
            htmlFor="agreeToTerms"
            className="cursor-pointer text-xs font-medium leading-relaxed text-gray-600 sm:text-sm"
          >
            I agree to the{" "}
            <a
              href="https://daakit.com/terms-and-conditions/"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-[#0446DB] hover:underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="https://daakit.com/privacy-policy/"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-[#0446DB] hover:underline"
            >
              Privacy Policy
            </a>
            .
          </label>
        </div>

        {/* REGISTER */}

        <button
          type="submit"
          disabled={!isStep1Valid() || loading}
          className="mt-5 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#0446DB] text-sm font-bold text-white shadow-[0_8px_20px_rgba(4,70,219,.22)] transition hover:bg-[#0338AF] disabled:cursor-not-allowed disabled:bg-blue-300 disabled:shadow-none"
        >
          {loading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Sending OTP...
            </>
          ) : (
            <>
              Register
              <ArrowRightIcon className="h-5 w-5 stroke-[2.5]" />
            </>
          )}
        </button>
      </form>
    </div>
  );

  /* ================================
     VERIFY STEP
  ================================= */

  const VerifyStep = () => (
    <div className="w-full">
      {Stepper()}

      <div className="mt-6 flex justify-center">
        <div className="flex h-[112px] w-[112px] items-center justify-center rounded-[23px] bg-[#F4F4F4]">
          <DevicePhoneMobileIcon className="h-[68px] w-[68px] stroke-[1.4] text-[#0446DB]" />
        </div>
      </div>

      <h2 className="mt-6 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
        Check your phone
      </h2>

      <p className="mt-2 text-center text-sm text-gray-500 sm:text-base">
        Enter the code we sent to{" "}
        <span className="font-bold text-gray-900">{maskedPhone}</span>
      </p>

      {/* OTP */}

      <div className="mx-auto mt-8 grid w-full max-w-[310px] grid-cols-4 gap-3 sm:gap-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digit}
            onChange={(e) => handleOTPChange(index, e.target.value)}
            onKeyDown={(e) => handleOTPKeyDown(index, e)}
            onPaste={handleOTPPaste}
            className="h-14 w-full rounded-lg border border-gray-400 bg-white text-center text-2xl font-semibold text-gray-900 outline-none transition focus:border-[#0446DB] focus:ring-4 focus:ring-blue-50 sm:h-16"
          />
        ))}
      </div>

      {/* BUTTONS */}

      <div className="mt-9 space-y-3">
        <button
          type="button"
          onClick={handleOTPVerify}
          disabled={otp.join("").length !== 4 || loading || timeLeft <= 0}
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#0446DB] text-sm font-bold text-white shadow-md transition hover:bg-[#0338AF] disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {loading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Verifying...
            </>
          ) : (
            <>
              Verify & continue
              <ArrowRightIcon className="h-5 w-5 stroke-[2.5]" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleChangeNumber}
          disabled={loading}
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-[#8D8D8D] bg-white text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          <ArrowLeftIcon className="h-5 w-5 stroke-[2.5]" />
          Change number
        </button>
      </div>

      {/* RESEND */}

      <div className="mt-5 text-center text-sm font-medium text-gray-500">
        {timeLeft > 0 ? (
          <>
            Didn't receive it? Resend code in{" "}
            <span
              className={
                timeLeft <= 30
                  ? "font-bold text-red-500"
                  : "font-bold text-gray-900"
              }
            >
              {formatTime(timeLeft)}
            </span>
          </>
        ) : (
          <>
            Didn't receive it?{" "}
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resending}
              className="font-bold text-[#0446DB] hover:underline disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend code"}
            </button>
          </>
        )}
      </div>

      <div className="mt-7 flex items-center justify-center gap-2 text-xs text-gray-500">
        <LockClosedIcon className="h-4 w-4" />
        Your information is encrypted and secure
      </div>
    </div>
  );

  /* ================================
     SUCCESS STEP
  ================================= */

  const DoneStep = () => (
    <div className="w-full">
      {Stepper()}

      <div className="mt-8 flex justify-center">
        <div className="flex h-[124px] w-[124px] items-center justify-center rounded-[22px] bg-[#A7F0BA]">
          <div className="flex h-[66px] w-[66px] items-center justify-center rounded-full bg-[#198038]">
            <CheckIcon className="h-10 w-10 stroke-[3] text-white" />
          </div>
        </div>
      </div>

      <h2 className="mt-7 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
        You're all set!
      </h2>

      <p className="mx-auto mt-3 max-w-[480px] text-center text-sm leading-relaxed text-gray-500 sm:text-base">
        Your merchant account has been created and your mobile number has been
        verified successfully.
      </p>

      {/* ACCOUNT DETAILS */}

      <div className="mt-7 rounded-xl border border-gray-200 bg-[#F8F9FB] p-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <span className="text-xs font-medium text-gray-500">Account</span>

          <span className="text-sm font-bold text-gray-900">
            {`${formData.firstName} ${formData.lastName}`.trim()}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-gray-200 py-3">
          <span className="text-xs font-medium text-gray-500">Company</span>

          <span className="max-w-[60%] truncate text-sm font-bold text-gray-900">
            {formData.companyName}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3">
          <span className="text-xs font-medium text-gray-500">Mobile</span>

          <span className="text-sm font-bold text-gray-900">
            +91 {formData.phoneNumber}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate("/login")}
        className="mt-7 flex h-[54px] w-full items-center justify-center gap-3 rounded-xl bg-[#0446DB] text-sm font-bold text-white shadow-md transition hover:bg-[#0338AF]"
      >
        Go to Login
        <ArrowRightIcon className="h-5 w-5 stroke-[2.5]" />
      </button>
    </div>
  );

  /* ================================
     MAIN UI
  ================================= */

  return (
    <section className="min-h-screen bg-[#0446DB] lg:h-screen">
      <main className="flex min-h-screen overflow-hidden font-sans lg:h-screen">
        {LeftPanel()}

        {/* RIGHT SIDE */}

        <div className="relative flex flex-1 flex-col overflow-hidden bg-[#0446DB] px-2 py-2 sm:px-3 lg:px-4">
          <div className="flex flex-1 items-stretch justify-center overflow-hidden">
            <div className="signup-scrollbar relative z-10 flex h-full max-h-[calc(100vh-16px)] w-full flex-col overflow-y-auto rounded-[3px] border border-gray-200 bg-white px-6 py-5 shadow-sm sm:px-10 lg:px-12 xl:px-14">
              {/* LOGO */}

              <div className="mb-4 flex flex-col items-center">
                <Link to="/" className="mb-4 inline-flex">
                  <img
                    src={DaakitGoLogo}
                    alt="DaakitGo"
                    className="h-14 w-auto object-contain sm:h-16"
                  />
                </Link>

                {currentStep === 1 && (
                  <div className="w-full text-right text-sm text-gray-500 sm:text-base">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-bold text-[#0446DB] hover:underline"
                    >
                      Login
                    </Link>
                  </div>
                )}
              </div>

              {/* STEPS */}

              {currentStep === 1 && DetailsStep()}

              {currentStep === 2 && VerifyStep()}

              {currentStep === 3 && DoneStep()}
            </div>
          </div>
        </div>
      </main>

      {/* SCROLLBAR */}

      <style>{`
        .signup-scrollbar::-webkit-scrollbar {
          width: 5px;
        }

        .signup-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .signup-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 999px;
        }

        .signup-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db transparent;
        }
      `}</style>
    </section>
  );
};

export default RegistrationPage;
