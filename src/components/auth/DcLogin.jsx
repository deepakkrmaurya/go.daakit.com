
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

import DaakitGoLogo from "../../assets/DaakitGo-Logo.jpg";
import DaakitMap from "../../assets/daakitmap.png";
import Warehouse1 from "../../assets/fulfillmenthype_warehouse.png";
import Warehouse2 from "../../assets/warehouse5.png";


import { UserRoles } from "@/utils/UserRole";

import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiShield,
  FiMail,
  FiPackage,
  FiMapPin,
  FiActivity,
} from "react-icons/fi";
import AxiosInstance from "../../Helper/axiosInstance";

const slider = [
  {
    link: DaakitMap,
    alt: "Daakit Logistics Network",
  },
  {
    link: Warehouse1,
    alt: "Daakit Warehouse",
  },
  {
    link: Warehouse2,
    alt: "Daakit Fulfillment",
  },
];

const baseURL = import.meta.env.VITE_BASE_URL;
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

function DcUserLogin() {
  const navigate = useNavigate();

  const [captchaToken, setCaptchaToken] = useState("");
  const [index, setIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleCaptchaChange = (value) => {
    setCaptchaToken(value);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================================
  // GET USER PERMISSIONS
  // =========================================================
  const getUserPermissions = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/api/user/getUserPermissions`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      localStorage.setItem(
        "permission",
        JSON.stringify(res?.data?.data?.data),
      );

      const permissions = res?.data?.data?.data || [];

      if (permissions.includes("DASHBOARD_VIEW")) {
        navigate("/user/analytics", {
          state: { permissions },
        });
        return;
      } else if (permissions.includes("ODR_VIEW")) {
        navigate("/user/order-details", {
          state: { permissions },
        });
        return;
      } else if (permissions.includes("NDR_VIEW")) {
        navigate("/user/ndr", {
          state: { permissions },
        });
        return;
      } else {
        navigate("/user/analytics", {
          state: { permissions },
        });
        return;
      }
    } catch (error) {
      toast.error("");
    }
  };

  // =========================================================
  // LOGIN
  // =========================================================
  const handleAdminSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await AxiosInstance.post(
        `/api/dc/login`,
        {
          ...formData,
          captcha_key:captchaToken
        },
      );

      const token = res.data.token;
        
      if (token) {
        localStorage.setItem("token", token);

        // localStorage.setItem("userType",'dc',);
        navigate("/dc/analytics");

        toast.success("Login successful");
      }
    } catch (err) {
      setCaptchaToken('')
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Login Failed",
      );
    }
  };

  // =========================================================
  // ALREADY LOGGED IN + SLIDER
  // =========================================================
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const decoded = jwtDecode(
        localStorage.getItem("token"),
      );

      const userRole =
        decoded.usertype ||
        decoded.type ||
        decoded.userType;

      if (UserRoles.includes(userRole)) {
        getUserPermissions();
        return;
      }

      navigate("/user/analytics");
      return;
    }

    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev === slider.length - 1) {
          return 0;
        }

        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex min-h-screen bg-[#0446DB] lg:h-screen lg:overflow-hidden">
      {/* =====================================================
          LEFT SECTION
      ===================================================== */}
      <section
        className="relative hidden w-[51%] shrink-0 overflow-hidden rounded-tr-[58px] lg:flex"
        style={{
          background:
            "radial-gradient(circle at 100% 0%,rgba(232,225,160,.8),rgba(141,170,198,.55) 28%,rgba(4,70,219,0) 55%),linear-gradient(135deg,#0647d9,#245acb)",
        }}
      >
        {/* Decorative Background */}
        <div className="pointer-events-none absolute -left-32 top-[35%] h-[350px] w-[350px] rounded-full bg-white/[0.04]" />

        <div className="pointer-events-none absolute -bottom-40 -right-32 h-[450px] w-[450px] rounded-full bg-white/[0.05]" />

        <div className="pointer-events-none absolute right-[20%] top-[15%] h-40 w-40 rounded-full bg-white/[0.03]" />

        {/* Content */}
        <div className="relative z-10 flex h-full w-full flex-col px-10 py-10 xl:px-12 xl:py-12">
          {/* Company Badge */}
          <div>
           

            {/* Main Heading */}
            <h1 className="max-w-[650px] text-[clamp(2.3rem,3.1vw,3.8rem)] font-extrabold leading-[1.06] tracking-tight text-white">
              Smarter Logistics.
              <br />

              <span className="text-white/75">
                Seamless Operations.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-[590px] text-[15px] font-medium leading-7 text-blue-100/90 xl:text-base">
              Powering modern logistics with intelligent
              technology for faster, simpler and more reliable
              operations.
            </p>

            {/* Features */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              <div className="flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white/90 backdrop-blur-sm">
                <FiPackage className="h-4 w-4" />
                Order Management
              </div>

              <div className="flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white/90 backdrop-blur-sm">
                <FiMapPin className="h-4 w-4" />
                Smart Logistics
              </div>

              <div className="flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white/90 backdrop-blur-sm">
                <FiActivity className="h-4 w-4" />
                Real-time Tracking
              </div>
            </div>
          </div>

          {/* =================================================
              SLIDER
          ================================================= */}
          <div className="mt-auto flex min-h-0 flex-1 items-end justify-center pb-3 pt-6">
            <div className="relative h-[40vh] min-h-[280px] w-full max-w-[680px] overflow-hidden">
              <div
                className="flex h-full w-full transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${index * 100}%)`,
                }}
              >
                {slider.map((item, i) => (
                  <div
                    key={i}
                    className="flex h-full w-full flex-shrink-0 items-center justify-center px-5 pb-7"
                  >
                    <img
                      src={item.link}
                      alt={item.alt}
                      className="max-h-full w-full object-contain drop-shadow-2xl"
                    />
                  </div>
                ))}
              </div>

              {/* Slider Indicators */}
              <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-2">
                {slider.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                      i === index
                        ? "w-7 bg-white"
                        : "w-1.5 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Left Footer */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[11px] font-medium text-white/55">
            <span>
              Technology that moves business forward.
            </span>

            <span>
              Daakit Technology Pvt. Ltd.
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          RIGHT LOGIN SECTION
      ===================================================== */}
      <section className="flex min-w-0 flex-1 bg-[#0446DB] p-2 lg:pl-4">
        <div className="flex min-h-[calc(100vh-16px)] w-full flex-col overflow-y-auto rounded-[3px] border border-gray-200 bg-white lg:h-[calc(100vh-16px)]">
          <div className="mx-auto flex w-full max-w-[850px] flex-1 flex-col px-5 py-8 sm:px-10 lg:px-12 xl:px-14">
            {/* Logo */}
            <div className="flex justify-center pt-4 sm:pt-6 lg:pt-10">
              <Link to="/">
                <img
                  src={DaakitGoLogo}
                  alt="Daakit Technology"
                  className="h-[68px] w-auto object-contain sm:h-[72px]"
                />
              </Link>
            </div>

            {/* =================================================
                LOGIN FORM AREA
            ================================================= */}
            <div className="my-auto py-8">
              {/* Heading */}
              <div className="mb-8 text-center">
                <h2 className="text-[28px] font-extrabold tracking-tight text-[#111827] sm:text-[30px]">
                  Distribution Center
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-[#667085]">
                  Enter your credentials to access your account
                </p>
              </div>

              <form
                onSubmit={handleAdminSubmit}
                className="space-y-5"
              >
                {/* =================================================
                    EMAIL
                ================================================= */}
                <div>
                  <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[.06em] text-[#344054]">
                    Email Address
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#98A2B3]">
                      <FiMail className="h-[18px] w-[18px]" />
                    </span>

                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      autoComplete="username"
                      required
                      placeholder="Enter Your username"
                      className="h-[52px] w-full rounded-sm border border-[#D0D5DD] bg-[#F8F9FB] pl-12 pr-4 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] hover:border-[#B8C0CC] focus:border-[#0446DB] focus:bg-white focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                </div>

                {/* =================================================
                    PASSWORD
                ================================================= */}
                <div>
                  <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[.06em] text-[#344054]">
                    Password
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#98A2B3]">
                      <FiLock className="h-[18px] w-[18px]" />
                    </span>

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      required
                      placeholder="Enter your password"
                      className="h-[52px] w-full rounded-sm border border-[#D0D5DD] bg-[#F8F9FB] pl-12 pr-12 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] hover:border-[#B8C0CC] focus:border-[#0446DB] focus:bg-white focus:ring-4 focus:ring-blue-50"
                    />

                    {/* Show / Hide */}
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev,
                        )
                      }
                      className="absolute inset-y-0 right-0 flex cursor-pointer items-center justify-center px-4 text-[#98A2B3] transition-colors hover:text-[#475467]"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-[19px] w-[19px]" />
                      ) : (
                        <FiEye className="h-[19px] w-[19px]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* =================================================
                    SECURITY VERIFICATION
                ================================================= */}
                <div>
                  <div className="mb-2 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[.06em] text-[#667085]">
                    <FiShield className="h-4 w-4" />

                    <span>
                      Security Verification
                    </span>
                  </div>

                  <div className="min-h-[88px] overflow-x-auto rounded-sm border border-[#D0D5DD] bg-[#F8F9FB] p-2">
                    {RECAPTCHA_SITE_KEY ? (
                      <ReCAPTCHA
                        sitekey={
                          RECAPTCHA_SITE_KEY
                        }
                        onChange={
                          handleCaptchaChange
                        }
                        onExpired={() =>
                          setCaptchaToken("")
                        }
                        onErrored={() =>
                          setCaptchaToken("")
                        }
                      />
                    ) : (
                      <div className="p-4 text-xs font-medium text-red-500">
                        VITE_RECAPTCHA_SITE_KEY is
                        missing.
                      </div>
                    )}
                  </div>
                </div>

                {/* =================================================
                    LOGIN BUTTON
                ================================================= */}
                <button
                  type="submit"
                  disabled={
                    !formData.username ||
                    !formData.password ||
                    !captchaToken
                  }
                  className="flex h-[54px] w-full cursor-pointer items-center justify-center gap-3 rounded-sm bg-[#0446DB] text-sm font-bold text-white transition-colors hover:bg-[#0338AF] focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-[#98A2B3] disabled:hover:bg-[#98A2B3]"
                >
                  Sign In

                  <span className="text-xl leading-none">
                    →
                  </span>
                </button>
              </form>

              {/* =================================================
                  FOOTER
              ================================================= */}
              <div className="mt-7 flex flex-col items-center justify-between gap-3 border-t border-[#EAECF0] pt-5 text-[11px] text-[#98A2B3] sm:flex-row">
                <span>
                  © {new Date().getFullYear()} Daakit
                  Technology Pvt. Ltd.
                </span>

                <div className="flex items-center gap-5">
                  <a
                    href="https://daakit.com/privacy-policy/"
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-[#0446DB]"
                  >
                    Privacy Policy
                  </a>

                  <a
                    href="https://daakit.com/terms-and-conditions/"
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-[#0446DB]"
                  >
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default DcUserLogin;