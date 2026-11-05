
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import DaakitGoLogo from "../../assets/DaakitGo-Logo.jpg";
import DaakitMap from "../../assets/daakitmap.png";
import axiosInstance from "../../Helper/axiosInstance";
import { FiEye, FiEyeOff, FiLock, FiShield } from "react-icons/fi";
import LoginIllustration from "@/assets/image.png";
const baseURL = import.meta.env.VITE_BASE_URL;
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

function AdminLogin() {
  const navigate = useNavigate();
  const [captchaToken, setCaptchaToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      const role = decoded?.usertype || decoded?.type || decoded?.userType;
      if (role === "admin") navigate("/admin/analytics");
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password || !captchaToken) return;
    setLoading(true);
    try {
      const res = await axiosInstance.post(`${baseURL}/api/admin/login`, {
        email: formData.email.trim(),
        password: formData.password,
        captcha_key:captchaToken
      });
      const token = res?.data?.token;
      if (!token) return toast.error(res?.data?.message || "Login failed");
      localStorage.setItem("token", token);
      localStorage.setItem("userType", res?.data?.userType || "admin");
      toast.success("Login successful");
      navigate("/admin/analytics");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || "Login Failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-[#0446DB] lg:h-screen lg:overflow-hidden">
      <section
        className="relative hidden w-[51%] shrink-0 overflow-hidden rounded-tr-[58px] lg:flex"
        
      >
        <div className="relative z-10 flex h-full w-full flex-col px-12 py-14">
  {/* Content */}
  <div>
    

    <h1 className="max-w-2xl text-[clamp(2.5rem,3.3vw,4rem)] font-extrabold leading-[1.05] tracking-tight text-white">
      Powering Smarter
      <br />
      Logistics Operations
    </h1>

    <p className="mt-5 max-w-xl text-[clamp(1rem,1.15vw,1.2rem)] font-medium leading-relaxed text-white/80">
      DAAKit brings fulfillment, smart warehousing and last-mile
      delivery together to help businesses manage logistics faster,
      smarter and more efficiently.
    </p>

    {/* Features */}
    {/* <div className="mt-7 flex flex-wrap gap-3">
      <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
        <p className="text-sm font-bold text-white">
          Smart Fulfillment
        </p>
        <p className="mt-0.5 text-[11px] text-white/60">
          Efficient Operations
        </p>
      </div>

      <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
        <p className="text-sm font-bold text-white">
          Hyperlocal
        </p>
        <p className="mt-0.5 text-[11px] text-white/60">
          Faster Deliveries
        </p>
      </div>

      <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
        <p className="text-sm font-bold text-white">
          Tech Powered
        </p>
        <p className="mt-0.5 text-[11px] text-white/60">
          Connected Logistics
        </p>
      </div>
    </div> */}
  </div>

  {/* Existing Image */}
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
</div>
      </section>

      <section className="flex min-w-0 flex-1 bg-[#0446DB] p-2 lg:pl-4"
      style={{
          background:
            "radial-gradient(circle at 100% 0%,rgba(232,225,160,.8),rgba(141,170,198,.55) 28%,rgba(4,70,219,0) 55%),linear-gradient(135deg,#0647d9,#245acb)",
        }}
      >
        <div className="flex h-[calc(100vh-16px)] w-full flex-col overflow-y-auto rounded-[3px] border border-gray-200 bg-white">
          <div className="mx-auto flex w-full max-w-[850px] flex-1 flex-col px-5 py-8 sm:px-10 lg:px-12 xl:px-14">
            <div className="flex justify-center pt-6 lg:pt-14">
              <Link to="/">
                <img
                  src={DaakitGoLogo}
                  alt="DaakitGo"
                  className="h-[72px] w-auto object-contain"
                />
              </Link>
            </div>

            <div className="my-auto py-8">
              <div className="mb-8 text-center">
                <h2 className="text-[30px] font-extrabold tracking-tight text-[#111827]">
                  Admin Login
                </h2>
                <p className="mt-2 text-sm font-medium text-[#667085]">
                  Enter your credentials to access the admin panel
                </p>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[.06em] text-[#344054]">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-xl text-[#98A2B3]">
                      ✉
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      placeholder="name@company.com"
                      className="h-[52px] w-full rounded-sm border border-[#D0D5DD] bg-[#F8F9FB] pl-12 pr-4 text-sm outline-none transition placeholder:text-[#98A2B3] focus:border-[#0446DB] focus:bg-white focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[.06em] text-[#344054]">
                    Password
                  </label>

                  <div className="relative">
                    {/* Lock Icon */}
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#98A2B3]">
                      <FiLock className="h-[18px] w-[18px]" />
                    </span>

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="h-[52px] w-full rounded-sm border border-[#D0D5DD] bg-[#F8F9FB] pl-12 pr-12 text-sm outline-none transition
                 placeholder:text-[#98A2B3]
                 focus:border-[#0446DB]
                 focus:bg-white
                 focus:ring-4
                 focus:ring-blue-50"
                    />

                    {/* Show / Hide Password */}
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-[#98A2B3] transition-colors hover:text-[#475467]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
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

                <div>
                  <div className="mb-2 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[.06em] text-[#667085]">
                  <FiShield className="h-4 w-4 " />
                  <span>Security Verification</span>
                </div>
                  <div className="min-h-[88px] overflow-x-auto rounded-sm border border-[#D0D5DD] bg-[#F8F9FB] p-2">
                    {RECAPTCHA_SITE_KEY ? (
                      <ReCAPTCHA
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={(v) => setCaptchaToken(v || "")}
                        onExpired={() => setCaptchaToken("")}
                        onErrored={() => setCaptchaToken("")}
                      />
                    ) : (
                      <div className="p-4 text-xs text-red-500">
                        VITE_RECAPTCHA_SITE_KEY is missing.
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.email.trim() ||
                    !formData.password ||
                    !captchaToken
                  }
                  className="flex h-[54px] w-full items-center justify-center gap-3 rounded-sm bg-[#0446DB] text-sm font-bold text-white transition hover:bg-[#0338AF] disabled:cursor-not-allowed disabled:bg-[#98A2B3]"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login <span className="text-xl">→</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-7 flex items-center justify-between border-t border-[#EAECF0] pt-5 text-[11px] text-[#98A2B3]">
                <span>© {new Date().getFullYear()} DAAKitGo</span>
                <div className="flex gap-5">
                  <a
                    href="https://daakit.com/privacy-policy/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="https://daakit.com/terms-and-conditions/"
                    target="_blank"
                    rel="noreferrer"
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

export default AdminLogin;
