
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
import axiosInstance from "../../Helper/axiosInstance";
import { UserRoles } from "@/utils/UserRole";

const slider = [
  { link: DaakitMap, alt: "Daakit Map" },
  { link: Warehouse1, alt: "Warehouse 1" },
  { link: Warehouse2, alt: "Warehouse 2" },
];
const baseURL = import.meta.env.VITE_BASE_URL;
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
// import.meta.env.VITE_API_URL
function UserLogin() {
  const [captchaToken, setCaptchaToken] = useState("");
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const handleCaptchaChange = (value) => {
    setCaptchaToken(value);
  };
  useEffect(() => {
    // Redirect to admin analytics if user is already logged in
    if (localStorage.getItem("token")) {
      const decoded = jwtDecode(localStorage.getItem("token"));
      const userRole = decoded.usertype || decoded.type || decoded.userType;
      navigate("/user/analytics");
      return;
    }

    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev == slider.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getUserPermissions = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/user/getUserPermissions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // setPermissions(res?.data?.data?.data)
      localStorage.setItem("permission", JSON.stringify(res?.data?.data?.data));
      const permissions = res?.data?.data?.data || [];

      if (permissions.includes("DASHBOARD_VIEW")) {
        navigate("/user/analytics", { state: { permissions } });
        return
      } else if (permissions.includes("ODR_VIEW")) {
        navigate("/user/order-details", { state: { permissions } });
        return

      } else if (permissions.includes("NDR_VIEW")) {
        navigate("/user/ndr", { state: { permissions } });
        return
      } else {
        navigate("/user/analytics", { state: { permissions } });
        return
      }
      // localStorage.setItem("permission", res?.data?.data?.data);

    } catch (error) {
      toast.error('')
    }
  }

  const handleAdminSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post(`${baseURL}/api/user/login`, formData);


      const token = res.data.token;
      if (token) {

        localStorage.setItem("token", token);
        localStorage.setItem("userType", res?.data?.userType);
        if (UserRoles.includes(res?.data?.userType)) {

          getUserPermissions()
          return
        }
        navigate("/user/analytics");
        toast.success("Login successful");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Login Failed");
    }
  };

  useEffect(() => {
    // Redirect to admin analytics if user is already logged in
    if (localStorage.getItem("token")) {
      const decoded = jwtDecode(localStorage.getItem("token"));
      const userRole = decoded.usertype || decoded.type || decoded.userType;
      if (UserRoles.includes(userRole)) {

        getUserPermissions()
        return
      }

    }

    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev == slider.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Section - Hero/Brand Area */}
      <div className="hidden lg:flex lg:w-[58%] xl:w-[60%] bg-[#0446db] text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        <div className="relative z-10 w-full flex flex-col items-center justify-center px-12 py-8">
          {/* Branding */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Welcome to DaakitGo</h1>
            <p className="text-indigo-100 text-lg">Your all-in-one logistics solution</p>
          </div>

          {/* Enhanced Slider */}
          <div className="w-full max-w-2xl">
            <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div
                className="flex w-full h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {slider.map((item, i) => (
                  <div
                    key={i}
                    className="w-full h-full flex-shrink-0 flex flex-col items-center justify-center p-8"
                  >
                    <img
                      src={item.link}
                      alt={item.alt}
                      className="w-full h-64 object-contain mb-6 transition-transform duration-300 hover:scale-105"
                    />
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-indigo-100 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slider Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slider.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === index ? 'bg-white w-6' : 'bg-white/50'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Area */}
      <div className="flex-1 lg:max-w-[42%] xl:max-w-[40%] flex flex-col overflow-auto bg-white">
        {/* Logo */}
        <div className="flex justify-center pt-12 pb-4">
          <img
            src={DaakitGoLogo}
            alt="DaakitGo"
            className="h-20 w-auto object-contain"
          />
        </div>

        {/* Login Container */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-5 w-full pb-12">
          {/* Login Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                User Login
              </h2>
              <p className="text-gray-500 text-sm">
                Enter your credentials to access the user panel
              </p>
            </div>

            <form
              onSubmit={handleAdminSubmit}
              className="space-y-6"
            >
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    required
                    placeholder="Enter Your Email"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute cursor-pointer inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      // Eye Off
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.038.157-2.04.45-2.981M6.1 6.1A9.956 9.956 0 0112 5c5.523 0 10 4.477 10 10 0 2.21-.716 4.253-1.926 5.91M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    ) : (
                      // Eye
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="w-full flex justify-start overflow-x-auto">
                
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={handleCaptchaChange}
                />
              </div>

              <button
                type="submit"
                disabled={!formData.email || !formData.password || !captchaToken}
                className="w-full cursor-pointer bg-[#0446DB] hover:bg-[rgb(70,62,180)] disabled:bg-gray-400 text-white font-medium py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0446DB] flex items-center justify-center"
              >
                Sign In
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} DaakitGo. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;