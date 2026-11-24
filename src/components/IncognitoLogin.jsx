import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader } from "lucide-react";
import AxiosInstance from "@/Helper/axiosInstance";

const baseURL = import.meta.env.VITE_BASE_URL;

function IncognitoLogin() {
  const { token, email, role } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleIncognitoLogin = async () => {

      
      if (role === "vendor") {
        try {
          const res = await axios.post(
            `${baseURL}/api/admin/vendorLogin`,
            { email },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const tkn = res.data.token;
          if (tkn) {
            localStorage.setItem("token", tkn);
            toast.success("Login successful");
            navigate("/vendor/analytics");
          }
        } catch (err) {
          toast.error(err.response?.data?.message || err.message || "Error during incognito login");
        } finally {
          setLoading(false);
        }
      } else if (role === "merchant") {
        try {
          const res = await axios.post(
            `${baseURL}/api/admin/merchantLogin`,
            { email },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const tkn = res.data.token;

          if (tkn) {
            localStorage.setItem("token", tkn);
            toast.success("Login successful");
            navigate("/merchant/analytics");
          }

          // const decoded = jwtDecode(tkn);
          // console.log(decoded);
          // const userRole = decoded?.usertype || decoded?.type || decoded?.userType;

          // if (decoded?.tech_based === "0" || decoded?.tech_based === 0) {
          //   navigate("/merchant/analytics");
          //   return;
          // }

          // if (decoded?.tech_based === "1" || decoded?.tech_based === 1) {
          //   navigate("/techbased_merchant/analytics");
          //   return;
          // }

          
        } catch (err) {
          toast.error(err.response?.data?.message || err.message || "Error during incognito login");
        } finally {
          setLoading(false);
        }
      } else if (role === "dc") {
        try {
          const { data } = await axios.post(
            `${baseURL}/api/user/dcLogin`,
            { dc_id: email },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (data?.success && data?.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user_type", "dc");
            toast.success(data?.message || "Login successful");
            navigate("/dc/analytics");
          }
        } catch (error) {
        } finally {
          setLoading(false);
        }
      } else if (role == "user_vendor") {
        const { data } = await axios.post(
          `${baseURL}/api/user/vendorLogin`,
          { email: email },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );


        

        localStorage.setItem("token", data?.data?.token);
        localStorage.setItem("user_type", "vendor");
        navigate("/vendor/analytics");
      }
    };

    handleIncognitoLogin();
  }, [token, email, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {loading ? <Loader className="animate-spin h-8 w-8" /> : null}
    </div>
  );
}

export default IncognitoLogin;
