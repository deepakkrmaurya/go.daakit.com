
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

import AxiosInstance from "../../Helper/axiosInstance";
import DaakitGoLogo from "../../assets/DaakitGo-Logo.jpg";
import DaakitMap from "../../assets/daakitmap.png";

const baseURL = import.meta.env.VITE_BASE_URL;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const otpInputRef = useRef(null);

  // =========================================================
  // STATE
  // =========================================================

  const [currentStep, setCurrentStep] = useState("send");

  const [phoneNumber, setPhoneNumber] = useState("");

  // OTP as single string
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [timeLeft, setTimeLeft] = useState(180);

  const [isResendDisabled, setIsResendDisabled] =
    useState(true);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // =========================================================
  // OTP TIMER
  // =========================================================

  useEffect(() => {
    if (currentStep !== "verify") return;

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
  // OTP AUTO FOCUS
  // =========================================================

  useEffect(() => {
    if (currentStep !== "verify") return;

    const timer = setTimeout(() => {
      otpInputRef.current?.focus();
    }, 150);

    return () => clearTimeout(timer);
  }, [currentStep]);

  // =========================================================
  // TIMER FORMAT
  // =========================================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;

    return `${minutes}:${secondsLeft.toString().padStart(2, "0")}`;
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

    const cleanPhone = phoneNumber.replace(/\D/g, "");

    if (!cleanPhone) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!/^\d{10}$/.test(cleanPhone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);

    try {
      // Check merchant
      const checkUser = await AxiosInstance.post(
        "/api/check/user",
        {
          phone: cleanPhone,
          user_type: "merchant",
        }
      );

      if (!checkUser?.data?.exists) {
        toast.error(
          checkUser?.data?.message || "User not found"
        );
        return;
      }

      // Send OTP
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

        toast.success("Verification code sent successfully!");
      } else {
        toast.error(
          response?.data?.message ||
            "Failed to send verification code"
        );
      }
    } catch (error) {
      console.error("Send OTP Error:", error);

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
    if (timeLeft > 0 || loading || resending) return;

    setResending(true);

    try {
      const response = await axios.post(
        `${baseURL}/api/otp/sendpasswordchangeotp`,
        {
          phone: phoneNumber.replace(/\D/g, ""),
        }
      );

      if (response?.data?.success) {
        setOtp("");
        setTimeLeft(180);
        setIsResendDisabled(true);

        toast.success("New verification code sent successfully!");

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
      console.error("Resend OTP Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to resend OTP. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  // =========================================================
  // OTP CHANGE
  // =========================================================

  const handleOtpChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 4);

    setOtp(value);
  };

  // =========================================================
  // OTP ENTER KEY
  // =========================================================

  const handleOtpKeyDown = (e) => {
    if (e.key === "Enter" && otp.length === 4) {
      verifyOTP();
    }
  };

  // =========================================================
  // VERIFY OTP
  // =========================================================

  const verifyOTP = async () => {
    if (otp.length !== 4) {
      toast.error("Please enter the 4-digit verification code");
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
          phone: phoneNumber.replace(/\D/g, ""),
          otp,
        }
      );

      if (response?.data?.success) {
        toast.success("Phone number verified successfully!");

        setCurrentStep("change-password");
      } else {
        toast.error(
          response?.data?.message ||
            "Invalid verification code. Please try again."
        );
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);

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
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isPasswordValid =
    passwordRules.length &&
    passwordRules.uppercase &&
    passwordRules.number;

  // =========================================================
  // RESET PASSWORD
  // =========================================================

  const SubmitChangePassword = async () => {
    if (!password) {
      toast.error("Please enter a new password");
      return;
    }

    if (password.length < 6) {
      toast.error(
        "Password must be at least 6 characters long"
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
      toast.error("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${baseURL}/api/vendor/resetVendorPassword`,
        {
          phone: phoneNumber.replace(/\D/g, ""),
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
      console.error("Reset Password Error:", error);

      toast.error(
        error?.response?.data?.message ||
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
    setPassword("");
    setConfirmPassword("");

    setTimeLeft(180);
    setIsResendDisabled(true);
  };

  // =========================================================
  // MASK PHONE
  // =========================================================

  const maskedPhone = () => {
    const cleanPhone = phoneNumber.replace(/\D/g, "");

    if (cleanPhone.length < 10) {
      return `+91 ${cleanPhone}`;
    }

    return `+91 ${cleanPhone.slice(0, 6)}XXXX`;
  };

  // =========================================================
  // LOGO
  // =========================================================

  const renderLogo = () => (
    <div className="mb-6 flex justify-center">
      <img
        src={DaakitGoLogo}
        alt="DaakitGo"
        className="h-[72px] w-auto object-contain"
      />
    </div>
  );

  // =========================================================
  // FOOTER
  // =========================================================

  const renderFooter = () => (
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
          className="transition hover:text-gray-900"
        >
          Privacy Policy
        </a>

        <a
          href="https://daakit.com/terms-and-conditions/"
          target="_blank"
          rel="noreferrer"
          className="transition hover:text-gray-900"
        >
          Terms of Service
        </a>
      </div>

      <a
        href="https://daakit.com/contact/"
        target="_blank"
        rel="noreferrer"
        className="
          flex items-center gap-1.5
          transition hover:text-gray-900
        "
      >
        <Info className="h-4 w-4" />
        Need Support?
      </a>
    </div>
  );

  

  // =========================================================
  // PASSWORD RULE
  // =========================================================

  const renderPasswordRule = (valid, text) => (
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

  // =========================================================
  // LEFT SIDE
  // =========================================================

  const renderLeftSide = () => (
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
      {/* TEXT */}

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
          Recover your account securely and continue
          <br className="hidden xl:block" /> managing orders,
          shipments and fulfillment.
        </p>
      </div>

      {/* IMAGE */}

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

  // =========================================================
  // SEND PHONE SCREEN
  // =========================================================

  const renderSendScreen = () => (
    <div className="w-full">
      {renderLogo()}

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
          Enter your registered mobile number and we'll send
          you a verification code.
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
            flex h-[52px]
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

          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
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
          disabled={loading || phoneNumber.length !== 10}
          className="
            mt-6

            flex h-[52px] w-full
            items-center justify-center
            gap-2

            rounded-sm

            bg-[#0446DB]

            px-5

            text-sm font-bold
            text-white

            shadow-sm

            transition-all

            hover:bg-[#0338AF]

            active:scale-[0.99]

            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />

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

      {renderFooter()}
    </div>
  );

  // =========================================================
  // VERIFY OTP SCREEN
  // =========================================================

  const renderVerifyScreen = () => (
    <div className="w-full">
      {renderLogo()}

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
          <ShieldCheck className="h-6 w-6" />
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
          We've sent a 4-digit verification code to{" "}

          <span className="font-bold text-gray-900">
            {maskedPhone()}
          </span>

          .
        </p>
      </div>

      {/* =============================================
          SINGLE REAL OTP INPUT

          Continuous typing:
          1 -> 12 -> 123 -> 1234
      ============================================= */}

      <div
        className="
          relative
          mx-auto
          max-w-[360px]
          cursor-text
        "
        onClick={() => {
          if (timeLeft > 0 && !loading) {
            otpInputRef.current?.focus();
          }
        }}
      >
        <input
          ref={otpInputRef}
          id="otp-verification"
          name="otp"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          value={otp}
          onChange={handleOtpChange}
          onKeyDown={handleOtpKeyDown}
          maxLength={4}
          disabled={timeLeft <= 0 || loading}
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
          {[0, 1, 2, 3].map((index) => {
            const digit = otp[index] || "";

            const isActive =
              otp.length === index ||
              (otp.length === 4 && index === 3);

            return (
              <div
                key={index}
                className={`
                  flex h-16
                  items-center justify-center

                  rounded-xl
                  border-2

                  text-2xl font-bold
                  text-gray-900

                  transition-all
                  duration-200

                  ${
                    isActive &&
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

                {isActive &&
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
          })}
        </div>
      </div>

      {/* TIMER */}

      <div className="mt-5 text-center">
        {timeLeft > 0 ? (
          <p className="text-sm font-semibold text-gray-500">
            Code expires in{" "}

            <span className="font-bold text-[#0446DB]">
              {formatTime(timeLeft)}
            </span>
          </p>
        ) : (
          <p className="text-sm font-bold text-red-600">
            Verification code has expired.
          </p>
        )}
      </div>

      {/* VERIFY */}

      <button
        type="button"
        onClick={verifyOTP}
        disabled={
          otp.length !== 4 ||
          loading ||
          timeLeft <= 0
        }
        className="
          mt-6

          flex h-[52px] w-full
          items-center justify-center
          gap-2

          rounded-lg

          bg-[#0446DB]

          px-5

          text-sm font-bold
          text-white

          shadow-sm

          transition-all

          hover:bg-[#0338AF]

          active:scale-[0.99]

          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />

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

          flex h-[50px] w-full
          items-center justify-center
          gap-2

          rounded-lg

          border-2
          border-[#0446DB]

          bg-white

          px-5

          text-sm font-bold
          text-[#0446DB]

          transition-all

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
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : timeLeft > 0 ? (
          <>
            <RefreshCw className="h-4 w-4" />

            Resend Code in {formatTime(timeLeft)}
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4" />

            Resend Code
          </>
        )}
      </button>

      

      {renderFooter()}
    </div>
  );

  // =========================================================
  // CHANGE PASSWORD SCREEN
  // =========================================================

  const renderChangePasswordScreen = () => {
    const passwordsMatch =
      password &&
      confirmPassword &&
      password === confirmPassword;

    return (
      <div className="w-full">
        {renderLogo()}

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

          Start Again
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
              leading-relaxed
              text-gray-500
            "
          >
            Choose a strong password to secure your DaakitGo
            account.
          </p>
        </div>

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
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              maxLength={50}
              autoComplete="new-password"
              placeholder="Enter new password"
              disabled={loading}
              className="
                h-[52px] w-full

                rounded-lg

                border-2
                border-gray-300

                bg-[#F8F9FB]

                px-4 pr-12

                text-sm font-medium
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
                setShowPassword((prev) => !prev)
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

        <div className="mt-5">
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
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              maxLength={50}
              autoComplete="new-password"
              placeholder="Confirm new password"
              disabled={loading}
              className={`
                h-[52px] w-full

                rounded-lg
                border-2

                bg-[#F8F9FB]

                px-4 pr-12

                text-sm font-medium
                text-gray-900

                outline-none

                transition-all

                placeholder:text-gray-400

                focus:bg-white
                focus:ring-4

                ${
                  confirmPassword &&
                  password !== confirmPassword
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
                setShowConfirmPassword((prev) => !prev)
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
            password !== confirmPassword && (
              <p
                className="
                  mt-2
                  text-xs font-semibold
                  text-red-600
                "
              >
                Passwords do not match.
              </p>
            )}

          {passwordsMatch && (
            <p
              className="
                mt-2
                flex items-center gap-1

                text-xs font-semibold
                text-green-600
              "
            >
              <Check className="h-3.5 w-3.5" />

              Passwords match.
            </p>
          )}
        </div>

        {/* PASSWORD REQUIREMENTS */}

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

              text-sm font-bold
              tracking-wide
              text-gray-800
            "
          >
            Password must contain:
          </p>

          <div className="space-y-3">
            {renderPasswordRule(
              passwordRules.length,
              "Minimum 6 characters"
            )}

            {renderPasswordRule(
              passwordRules.uppercase,
              "At least one uppercase letter"
            )}

            {renderPasswordRule(
              passwordRules.number,
              "At least one number"
            )}
          </div>
        </div>

        {/* RESET BUTTON */}

        <button
          type="button"
          onClick={SubmitChangePassword}
          disabled={
            loading ||
            !isPasswordValid ||
            !confirmPassword ||
            password !== confirmPassword
          }
          className="
            mt-6

            flex h-[52px] w-full
            items-center justify-center
            gap-2

            rounded-lg

            bg-[#0446DB]

            px-5

            text-sm font-bold
            text-white

            shadow-sm

            transition-all

            hover:bg-[#0338AF]

            active:scale-[0.99]

            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />

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

        {renderFooter()}
      </div>
    );
  };

  // =========================================================
  // RIGHT SIDE
  // =========================================================

  const renderRightSide = () => (
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
          items-center justify-center
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

            border border-gray-100

            bg-white

            px-6 py-8

            shadow-[0_20px_60px_-28px_rgba(15,23,42,0.28)]

            sm:px-10
            lg:px-12
            xl:px-14
          "
        >
          <div className="my-auto w-full">
            {currentStep === "send" &&
              renderSendScreen()}

            {currentStep === "verify" &&
              renderVerifyScreen()}

            {currentStep === "change-password" &&
              renderChangePasswordScreen()}
          </div>
        </div>
      </div>
    </section>
  );

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <section
      className="min-h-screen bg-[#0446DB]"
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
        {renderLeftSide()}

        {renderRightSide()}
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