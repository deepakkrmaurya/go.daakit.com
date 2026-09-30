
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";

// ======================================================
// ASSETS
// ======================================================

import DaakitGoLogo from "@/assets/DaakitGo-Logo.jpg";

// Same image used in the reference left-side design
import LoginIllustration from "@/assets/image.png";

// ======================================================
// ENV
// ======================================================

const baseURL = import.meta.env.VITE_BASE_URL;

const RECAPTCHA_SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY;

// ======================================================
// LOGIN COMPONENT
// ======================================================

function Login() {
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

  const [captchaToken, setCaptchaToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [flag, setFlag] = useState("vendor");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ====================================================
  // CHECK EXISTING TOKEN
  // ====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || token === "logout") {
      return;
    }

    try {
      const decoded = jwtDecode(token);

      const userRole =
        decoded?.usertype ||
        decoded?.type ||
        decoded?.userType;

      if (userRole === "admin") {
        navigate("/admin/analytics");
        return;
      }

      if (userRole === "vendor") {
        navigate("/vendor/analytics");
        return;
      }

      if (
        decoded?.tech_based === "0" ||
        decoded?.tech_based === 0
      ) {
        navigate("/merchant/analytics");
        return;
      }

      if (
        decoded?.tech_based === "1" ||
        decoded?.tech_based === 1
      ) {
        navigate("/techbased_merchant/analytics");
        return;
      }

      if (
        ["user", "customer"].includes(userRole)
      ) {
        navigate("/user/analytics");
      }
    } catch (error) {
      console.error("Invalid token:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("userType");
    }
  }, [navigate]);

  // ====================================================
  // INPUT CHANGE
  // ====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ====================================================
  // CAPTCHA
  // ====================================================

  const handleCaptchaChange = (value) => {
    setCaptchaToken(value || "");
  };

  const resetCaptcha = () => {
    setCaptchaToken("");

    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };

  // ====================================================
  // VENDOR LOGIN
  // ====================================================

  const handleVendorSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!formData.password) {
      toast.error("Please enter your password");
      return;
    }

    if (!captchaToken) {
      toast.error("Please verify the reCAPTCHA");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${baseURL}/api/vendor/vendorLogin`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = res?.data?.token;

      if (!token) {
        toast.error(
          res?.data?.message || "Login failed"
        );

        resetCaptcha();
        return;
      }

      localStorage.setItem("token", token);

      localStorage.setItem(
        "userType",
        res?.data?.userType || "vendor"
      );

      toast.success(
        res?.data?.message || "Login successful"
      );

      navigate("/vendor/analytics");
    } catch (err) {
      console.error("Vendor login error:", err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Login Failed"
      );

      resetCaptcha();
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // MERCHANT LOGIN
  // ====================================================

  const handleMerchantSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!formData.password) {
      toast.error("Please enter your password");
      return;
    }

    if (!captchaToken) {
      toast.error("Please verify the reCAPTCHA");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${baseURL}/api/merchant/merchantLogin`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res?.data?.success) {
        toast.error(
          res?.data?.message || "Login failed"
        );

        resetCaptcha();
        return;
      }

      const token = res?.data?.token;

      if (!token) {
        toast.error("Token not received");
        resetCaptcha();
        return;
      }

      localStorage.setItem("token", token);

      if (res?.data?.userType) {
        localStorage.setItem(
          "userType",
          res.data.userType
        );
      }

      toast.success(
        res?.data?.message || "Login successful"
      );

      const decoded = jwtDecode(token);

      const userRole =
        decoded?.usertype ||
        decoded?.type ||
        decoded?.userType;

      if (userRole === "admin") {
        navigate("/admin/analytics");
        return;
      }

      if (userRole === "vendor") {
        navigate("/vendor/analytics");
        return;
      }

      if (
        decoded?.tech_based === "0" ||
        decoded?.tech_based === 0
      ) {
        navigate("/merchant/analytics");
        return;
      }

      if (
        decoded?.tech_based === "1" ||
        decoded?.tech_based === 1
      ) {
        navigate("/techbased_merchant/analytics");
        return;
      }

      navigate("/merchant/analytics");
    } catch (err) {
      console.error("Merchant login error:", err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Login Failed"
      );

      resetCaptcha();
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // CHANGE ACCOUNT TYPE
  // ====================================================

  const handleFlagChange = (type) => {
    if (loading || flag === type) {
      return;
    }

    setFlag(type);

    setFormData({
      email: "",
      password: "",
    });

    setShowPassword(false);

    setTimeout(() => {
      resetCaptcha();
    }, 0);
  };

  // ====================================================
  // BACK TO WEBSITE
  // ====================================================

  const handleBackWebsite = () => {
    navigate("/");
  };

  // ====================================================
  // JSX
  // ====================================================

  return (
    <div className="min-h-screen w-full bg-[#0345DA] font-sans lg:h-screen lg:overflow-hidden">
      <div className="flex min-h-screen w-full flex-col lg:h-screen lg:flex-row">
        {/* ==================================================
            LEFT SECTION
        =================================================== */}

        <section
          className="
            relative
            hidden
            h-screen
            w-[45%]
            flex-col
            overflow-hidden
            rounded-br-[60px]
            rounded-tr-[60px]
            px-[clamp(1.5rem,3vw,3rem)]
            py-[clamp(1.5rem,4vh,3rem)]
            text-white
            lg:flex
            xl:w-[50%]
          "
          style={{
            background:
              "radial-gradient(circle at top right, #d9daab 0%, rgba(191,191,150,0.35) 30%, rgba(191,191,150,0.08) 50%, transparent 70%), linear-gradient(135deg, #0345DA 0%, #0345DA 40%, #0345DA 70%, #0345DA 100%)",
          }}
        >
          {/* ================================================
              BACKGROUND DECORATION
          ================================================= */}

          <div className="pointer-events-none absolute -left-[250px] -top-[250px] h-[520px] w-[520px] rounded-full border border-white/[0.06]" />

          <div className="pointer-events-none absolute -bottom-[300px] -right-[220px] h-[650px] w-[650px] rounded-full border border-white/[0.06]" />

         

          {/* ================================================
              HEADING
          ================================================= */}

          {/* <div className="relative z-10 mt-[clamp(1rem,4vh,2rem)]">
            <h1
              className="
                text-[clamp(2rem,3.2vw,3.75rem)]
                font-extrabold
                leading-[1.05]
                tracking-tight
                text-white
              "
            >
              Welcome to DAAKitGo
              
            </h1>

            <p
              className="
                mt-[clamp(0.5rem,1.8vh,1rem)]
                text-[clamp(1rem,1.35vw,1.5rem)]
                font-medium
                leading-tight
                tracking-wide
                text-white
              "
            >
              Your all-in-one logistics solution

              <br className="hidden xl:block" />

              
            </p>
          </div> */}

          <div className="relative z-10 mt-[clamp(1rem,4vh,2rem)]">
 

  <h1 className="max-w-2xl text-[clamp(2rem,3.2vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight text-white">
    Powering the Future
    <br />
    of Quick Commerce
  </h1>

  <p className="mt-5 max-w-xl text-[clamp(0.95rem,1.15vw,1.2rem)] font-medium leading-relaxed text-white/80">
    From inventory to doorstep, DAAKit connects smart fulfillment,
    hyperlocal delivery and intelligent technology in one seamless
    logistics ecosystem.
  </p>

  <div className="mt-7 flex flex-wrap gap-3">
    <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
      <p className="text-sm font-bold text-white">
        30–60 Min
      </p>
      <p className="mt-0.5 text-[11px] text-white/60">
        Hyperlocal Delivery
      </p>
    </div>

    <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
      <p className="text-sm font-bold text-white">
        Same / Next Day
      </p>
      <p className="mt-0.5 text-[11px] text-white/60">
        Flexible Fulfillment
      </p>
    </div>

    <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
      <p className="text-sm font-bold text-white">
        AI Powered
      </p>
      <p className="mt-0.5 text-[11px] text-white/60">
        Smart Operations
      </p>
    </div>
  </div>
</div>

          

          <div
            className="
              relative
              z-10
              mt-auto
              flex
              min-h-0
              flex-1
              items-end
              justify-center
              pt-[clamp(0.5rem,2vh,1rem)]
            "
          >
            <img
              src={LoginIllustration}
              alt="DAAKit Auth"
              className="
                h-auto
                max-h-[45vh]
                w-full
                object-contain
                max-[1300px]:max-h-[40vh]
              "
            />
          </div>
        </section>

        {/* ==================================================
            RIGHT SECTION
        =================================================== */}

        <section
          className="
            relative
            flex
            min-h-screen
            flex-1
            flex-col
            overflow-y-auto
            bg-gray-50/30
            px-2
            sm:px-4
            lg:h-screen
            lg:min-h-0
            lg:overflow-hidden
            lg:bg-transparent
          "
        >
          

          {/* =================================================
              AUTH PANEL
          ================================================== */}

          <div className="flex flex-1 items-center justify-center py-4 lg:h-full lg:w-full lg:items-stretch lg:justify-end lg:py-[10px]">
            <div
              className="
                relative
                z-10
                my-auto
                flex
                w-full
                max-w-[36rem]
                flex-col
                overflow-y-auto
                rounded-sm
                border
                border-gray-100
                bg-white
                px-4
                py-5
                shadow-[0_20px_60px_-28px_rgba(15,23,42,0.28)]

                sm:px-6
                sm:py-6

                lg:my-0
                lg:h-full
                lg:max-h-none
                lg:max-w-none
                lg:justify-center
                lg:rounded-[4px]
                lg:px-8
                lg:py-6

                xl:px-12
                xl:py-8
              "
            >
              {/* =============================================
                  LOGO
              ============================================== */}

              <div className="mb-4 md:mt-20 flex justify-center">
                <img
                  src={DaakitGoLogo}
                  alt="DaakitGo"
                  className="h-16 w-auto object-contain lg:h-[72px]"
                />
              </div>

              {/* =============================================
                  ACCOUNT TYPE
              ============================================== */}

              <div className="mb-6">
                <div className="relative flex w-full rounded-xl bg-gray-100 p-1.5 shadow-inner">
                  <div
                    className="
                      absolute
                      bottom-1.5
                      left-1.5
                      top-1.5
                      w-[calc(50%-6px)]
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      shadow-sm
                      transition-transform
                      duration-300
                    "
                    style={{
                      transform:
                        flag === "vendor"
                          ? "translateX(0%)"
                          : "translateX(100%)",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      handleFlagChange("vendor")
                    }
                    className={`
                      relative
                      z-10
                      flex
                      h-11
                      flex-1
                      cursor-pointer
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      text-sm
                      font-semibold
                      transition
                      ${
                        flag === "vendor"
                          ? "text-[#0446DB]"
                          : "text-gray-500 hover:text-gray-800"
                      }
                    `}
                  >
                    <Truck className="h-4 w-4" />

                    Fleet Partner
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleFlagChange("merchant")
                    }
                    className={`
                      relative
                      z-10
                      flex
                      h-11
                      flex-1
                      cursor-pointer
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      text-sm
                      font-semibold
                      transition
                      ${
                        flag === "merchant"
                          ? "text-[#0446DB]"
                          : "text-gray-500 hover:text-gray-800"
                      }
                    `}
                  >
                    <Store className="h-4 w-4" />

                    Merchant
                  </button>
                </div>
              </div>

              {/* =============================================
                  HEADING
              ============================================== */}

              <div className="mb-7 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {flag === "vendor"
                    ? "Fleet Partner Login"
                    : "Merchant Login"}
                </h2>

                <p className="mt-2 text-sm font-medium text-gray-500">
                  Enter your credentials to access your
                  account
                </p>
              </div>

              {/* =============================================
                  LOGIN FORM
              ============================================== */}

              <form
                onSubmit={
                  flag === "vendor"
                    ? handleVendorSubmit
                    : handleMerchantSubmit
                }
                className="space-y-5"
              >
                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-[0.05em] text-gray-700"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onInput={(e) => {
                        e.target.value =
                          e.target.value.replace(
                            /[^a-zA-Z0-9@._-]/g,
                            ""
                          );
                      }}
                      required
                      autoComplete="email"
                      placeholder="name@company.com"
                      className="
                        min-h-[52px]
                        w-full
                        rounded-lg
                        border
                        border-gray-300
                        bg-gray-100
                        py-3
                        pl-11
                        pr-4
                        text-sm
                        font-medium
                        text-gray-900
                        outline-none
                        transition-all
                        placeholder:text-gray-400
                        focus:border-[#0446DB]
                        focus:bg-white
                        focus:ring-[3px]
                        focus:ring-[#0446DB]/10
                      "
                    />
                  </div>
                </div>

                {/* PASSWORD */}

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-xs font-bold uppercase tracking-[0.05em] text-gray-700"
                    >
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="
                        min-h-[52px]
                        w-full
                        rounded-lg
                        border
                        border-gray-300
                        bg-gray-100
                        py-3
                        pl-11
                        pr-12
                        text-sm
                        font-medium
                        text-gray-900
                        outline-none
                        transition-all
                        placeholder:text-gray-400
                        focus:border-[#0446DB]
                        focus:bg-white
                        focus:ring-[3px]
                        focus:ring-[#0446DB]/10
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
                        right-3
                        top-1/2
                        flex
                        h-8
                        w-8
                        -translate-y-1/2
                        cursor-pointer
                        items-center
                        justify-center
                        rounded-lg
                        text-gray-400
                        transition
                        hover:bg-gray-200
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

                {/* CAPTCHA */}

                <div>
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-gray-400" />

                    <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-gray-500">
                      Security Verification
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-gray-300 bg-[#F8FAFC] p-1.5">
                    <ReCAPTCHA
                      ref={recaptchaRef}
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
                  </div>
                </div>

                {/* FORGOT PASSWORD */}

                <div className="flex justify-end">
                  {flag === "merchant" ? (
                    <Link
                      to="/merchant-forgot-password"
                      className="text-sm font-semibold text-[#155BD5] transition hover:text-[#0446DB] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  ) : (
                    <Link
                      to="/vendor-forgot-password"
                      className="text-sm font-semibold text-[#155BD5] transition hover:text-[#0446DB] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={
                    !formData.email ||
                    !formData.password ||
                    !captchaToken ||
                    loading
                  }
                  className="
                    group
                    flex
                    min-h-[56px]
                    w-full
                    cursor-pointer
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-[#0446DB]
                    text-base
                    font-bold
                    text-white
                    shadow-md
                    transition-all
                    hover:bg-[#0338AF]
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:bg-gray-400
                    disabled:shadow-none
                    disabled:active:scale-100
                  "
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                      Signing In...
                    </>
                  ) : (
                    <>
                      Login

                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {/* SIGNUP */}

                <div className="flex items-center justify-between pt-2 text-sm">
                  <span className="font-medium text-gray-500">
                    New to DAAKitGo?
                  </span>

                  {flag === "merchant" ? (
                    <Link
                      to="/register"
                      className="font-bold text-[#0446DB] transition hover:underline"
                    >
                      Create an account
                    </Link>
                  ) : (
                    <Link
                      to="/vendor/register"
                      className="font-bold text-[#0446DB] transition hover:underline"
                    >
                      Create an account
                    </Link>
                  )}
                </div>
              </form>

              {/* =============================================
                  FOOTER
              ============================================== */}

              <div className="mt-6 border-t border-gray-100 pt-5">
                <div className="flex flex-col items-center justify-between gap-3 text-xs font-medium text-gray-400 sm:flex-row">
                  <span>
                    © {new Date().getFullYear()} DAAKitGo
                  </span>

                  <div className="flex items-center gap-4">
                    <span>
                      <Link to={'https://daakit.com/privacy-policy/'}>Privacy Policy</Link>
                    </span>

                    <span>
                      <Link to={'https://daakit.com/terms-and-conditions/'}>
                      Terms of Service
                      </Link>
                      </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
