

import { useCallback, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import Select from "react-select";

import { Country, State, City } from "country-state-city";

import { TbFileInfo } from "react-icons/tb";

import { FaRegFileImage } from "react-icons/fa6";

import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";

import {

  Drawer,

  DrawerContent,

  DrawerHeader,

  DrawerTitle,

  DrawerDescription,

  DrawerFooter,

} from "@/components/ui/drawer";

import {
  Filter, Search, RotateCcw, X, RefreshCw, Bike, Users,
  UserCheck, UserX, ShieldCheck, KeyRound,
  Loader2,
  UserPlus,
  Download
} from "lucide-react";

import AxiosInstance from "@/Helper/axiosInstance";
import { Link } from "react-router-dom";

const baseURL = import.meta.env.VITE_BASE_URL;

const TECH_MERCHANT_API = "/api/tech-merchant";

const INDIA_CODE = Country.getCountryByCode("IN")?.isoCode || "IN";

const stateOptions = State.getStatesOfCountry(INDIA_CODE).map((state) => ({

  value: state.isoCode,

  label: state.name,

}));

const getCityOptions = (stateCode) => {

  if (!stateCode) return [];

  return City.getCitiesOfState(INDIA_CODE, stateCode).map((city) => ({

    value: city.name,

    label: city.name,

  }));

};


const StatusToggle = ({ checked, onClick, disabled = false }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-pressed={checked}
    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#0446DB]/20 disabled:cursor-not-allowed disabled:opacity-40 ${
      checked ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
    }`}
  >
    <span
      className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

function TechBasedRiderStats() {

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [ridersData, setRidersData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() =>

    document.documentElement.classList.contains("dark"),

  );

  useEffect(() => {

    const observer = new MutationObserver(() => {

      setIsDarkMode(document.documentElement.classList.contains("dark"));

    });

    observer.observe(document.documentElement, {

      attributes: true,

      attributeFilter: ["class"],

    });

    return () => observer.disconnect();

  }, []);





  const [popup, setPopup] = useState(null);

  const [changePasswordPopup, setChangePasswordPopup] = useState(null);

  const [newPassword, setNewPassword] = useState({

    id: "",

    password: "",

    confirmPassword: "",

  });

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState(null);

  const selectedStateCode =

    formData?.state_code ||

    stateOptions.find(

      (item) =>

        item.label?.toLowerCase() === formData?.state?.toLowerCase(),

    )?.value ||

    "";

  const cityOptions = getCityOptions(selectedStateCode);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [advanceFilters, setAdvanceFilters] = useState({

    rider_id: "",

    facility_city: "",

    facility_zone: "",

  });

  const [filterUpdate, setFilterUpdate] = useState(false);

  const resetAdvanceFilters = () => {

    setAdvanceFilters({

      rider_id: "",

      facility_city: "",

      facility_zone: "",

    });

  };

  const handleChange = (e) => {

    const { name, value, files } = e.target;

    if (e.target.type === "file") {

      setFormData({ ...formData, [name]: files[0] });

    } else {

      setFormData({ ...formData, [name]: value });

    }

  };

  const kycVerify = async (kyc) => {

    if (!formData?.id) {

      toast.error("Rider ID is missing");

      return;

    }

    setLoading(true);

    try {

      const data = new FormData();

      data.append("kyc_verified", Number(kyc));

      const response = await AxiosInstance.put(

        `${TECH_MERCHANT_API}/updateRiderProfile/${formData.id}`,

        data,

      );

      toast.success(

        response?.data?.message || "KYC status updated successfully",

      );

      setIsEditing(false);

      setPopup(null);

      await fetchRiders();

    } catch (err) {

      toast.error(

        err?.response?.data?.message ||

          err?.message ||

          "Error updating KYC status",

      );

    } finally {

      setLoading(false);

    }

  };

  //Change

  const handleSave = async () => {

    if (!formData?.id) {

      toast.error("Rider ID is missing");

      return;

    }

    setLoading(true);

    try {

      const data = new FormData();

      // Only fields supported by updateRiderProfile backend.

      const supportedFields = [

        "name",

        "email",

        "phone",

        "facility_city",

        "address_line",

        "facility_zone",

        "city",

        "state",

        "pincode",

        "bank_name",

        "bank_branch",

        "bank_ifsc_code",

        "bank_account_number",

        "kyc_verified",

      ];

      supportedFields.forEach((key) => {

        const value = formData?.[key];

        if (value !== undefined && value !== null && value !== "") {

          data.append(key, value);

        }

      });

      if (formData?.cheque_image instanceof File) {

        data.append("cheque_image", formData.cheque_image);

      }





      const response = await AxiosInstance.put(

        `${TECH_MERCHANT_API}/updateRiderProfile/${formData.id}`,

        data,

      );

      toast.success(

        response?.data?.message || "Rider profile updated successfully",

      );

      setIsEditing(false);

      setPopup(null);

      await fetchRiders();

    } catch (err) {

      toast.error(

        err?.response?.data?.message ||

          err?.message ||

          "Error saving rider data",

      );

    } finally {

      setLoading(false);

    }

  };

  const fetchRiders = useCallback(async () => {

    setLoading(true);

    try {

      const result = await AxiosInstance.get("/api/tech-merchant/getMerchantRiders",{params:advanceFilters});

      

      setRidersData(result.data.data);

    } catch (err) {

      toast.error(

        err.response?.data?.message || err.message || "Error fetching riders",

      );

    } finally {

      setLoading(false);

    }

  }, [advanceFilters]);

  const changeVerificationStatus = async (id, status) => {

    setLoading(true);

    try {

      const response = await AxiosInstance.post(

        `${TECH_MERCHANT_API}/markRiderVerified/${id}`,

        {

          account_status: Number(status),

        },

      );

      toast.success(response?.data?.message || "Rider verification updated");

      await fetchRiders();

    } catch (err) {

      toast.error(

        err?.response?.data?.message ||

          err?.message ||

          "Error while changing verification status",

      );

    } finally {

      setLoading(false);

    }

  };

  const changeActiveStatus = async (id, status) => {

    setLoading(true);

    try {

      const response = await AxiosInstance.post(

        `${TECH_MERCHANT_API}/markRiderActive/${id}`,

        {

          is_active: Number(status),

        },

      );

      toast.success(response?.data?.message || "Rider active status updated");

      await fetchRiders();

    } catch (err) {

      toast.error(

        err?.response?.data?.message ||

          err?.message ||

          "Error while changing active status",

      );

    } finally {

      setLoading(false);

    }

  };

  const changeAvailabilityStatus = async (id, status) => {

    setLoading(true);

    try {

      const response = await AxiosInstance.post(

        `${TECH_MERCHANT_API}/markRiderAvailable/${id}`,

        {

          is_available: Number(status),

        },

      );

      toast.success(response?.data?.message || "Rider availability updated");

      await fetchRiders();

    } catch (err) {

      toast.error(

        err?.response?.data?.message ||

          err?.message ||

          "Error while changing availability status",

      );

    } finally {

      setLoading(false);

    }

  };

 
const options = City.getCitiesOfCountry("IN").map((city) => ({
  value: city.name,
  label: city.name,
}));

  const handlePasswordChange = async () => {

    setLoading(true);

    try {
      const res = await AxiosInstance.post(`/api/tech-merchant/changeRiderPassword/${newPassword.id}`,
        {
          password: newPassword.password,
          confirmPassword: newPassword.confirmPassword,
        }
      )
      

      setChangePasswordPopup(null);

      setNewPassword({

        id: "",

        password: "",

        confirmPassword: "",

      });

      toast.success("Password Changed successfully");

    } catch (err) {

      toast.error(

        err.response?.data?.message ||

          err.message ||

          "Error in updating password",

      );

    } finally {

      setLoading(false);

    }

  };

 const handleExport = async () => {
  try {
    setLoading(true);

    const response = await AxiosInstance.get(
      "/api/tech-merchant/exportRiders",
      {
        responseType: "blob",
      }
    );

    const contentType =
      response.headers["content-type"] ||
      "application/octet-stream";

    

    // Agar backend JSON error blob ke andar bhej raha hai
    if (contentType.includes("application/json")) {
      const errorText = await response.data.text();
      const errorData = JSON.parse(errorText);

      throw new Error(
        errorData?.message || "Failed to export riders"
      );
    }

    let fileName = "riders";

    const contentDisposition =
      response.headers["content-disposition"];

    if (contentDisposition) {
      const utfMatch = contentDisposition.match(
        /filename\*=UTF-8''([^;]+)/
      );

      const normalMatch = contentDisposition.match(
        /filename="?([^"]+)"?/
      );

      if (utfMatch?.[1]) {
        fileName = decodeURIComponent(utfMatch[1]);
      } else if (normalMatch?.[1]) {
        fileName = normalMatch[1].trim();
      }
    } else {
      // Backend filename nahi bhej raha to Content-Type se extension decide karo
      if (
        contentType.includes(
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
      ) {
        fileName = "riders.xlsx";
      } else if (
        contentType.includes("text/csv") ||
        contentType.includes("application/csv")
      ) {
        fileName = "riders.csv";
      } else if (
        contentType.includes("application/vnd.ms-excel")
      ) {
        fileName = "riders.xls";
      } else {
        fileName = "riders.xlsx";
      }
    }

    const blob = new Blob([response.data], {
      type: contentType,
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);

    toast.success("Riders exported successfully");
  } catch (error) {
    console.error("Export error:", error);

    toast.error(
      error?.message ||
        error?.response?.data?.message ||
        "Failed to export riders"
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {

    fetchRiders();

  }, []);

  useEffect(() => {

    if (popup) {

      setFormData({ ...popup });

    }

  }, [popup]);

  useEffect(() => {

    if (filterUpdate) {

      fetchRiders();

      setFilterUpdate(false);

    }

  }, [filterUpdate]);





  const darkSelectStyles = {

    control: (base, state) => ({

      ...base,

      minHeight: "40px",

      backgroundColor: isDarkMode ? "#171717": "#ffffff",

      borderColor: state.isFocused

        ? "#0446DB"

       : isDarkMode

          ? "#404040"

         : "#d1d5db",

      boxShadow: state.isFocused

        ? "0 0 0 2px rgba(4,70,219,0.12)"

       : "none",

      "&:hover": {

        borderColor: state.isFocused

          ? "#0446DB"

         : isDarkMode

            ? "#525252"

           : "#9ca3af",

      },

    }),

    singleValue: (base) => ({

      ...base,

      color: isDarkMode ? "#f5f5f5": "#111827",

    }),

    input: (base) => ({

      ...base,

      color: isDarkMode ? "#f5f5f5": "#111827",

    }),

    placeholder: (base) => ({

      ...base,

      color: isDarkMode ? "#737373": "#9ca3af",

    }),

    menu: (base) => ({

      ...base,

      zIndex: 70,

      backgroundColor: isDarkMode ? "#171717": "#ffffff",

      border: `1px solid ${isDarkMode ? "#404040": "#e5e7eb"}`,

      boxShadow: isDarkMode

        ? "0 12px 30px rgba(0,0,0,0.35)"

       : "0 12px 30px rgba(15,23,42,0.12)",

    }),

    menuList: (base) => ({

      ...base,

      backgroundColor: isDarkMode ? "#171717": "#ffffff",

    }),

    option: (base, state) => ({

      ...base,

      cursor: "pointer",

      color: isDarkMode ? "#e5e5e5": "#111827",

      backgroundColor: state.isSelected

        ? "#0446DB"

       : state.isFocused

          ? isDarkMode

            ? "#262626"

           : "#eff6ff"

         : isDarkMode

            ? "#171717"

           : "#ffffff",

      "&:active": {

        backgroundColor: "#0446DB",

        color: "#ffffff",

      },

    }),

    indicatorSeparator: (base) => ({

      ...base,

      backgroundColor: isDarkMode ? "#404040": "#e5e7eb",

    }),

    dropdownIndicator: (base) => ({

      ...base,

      color: isDarkMode ? "#a3a3a3": "#6b7280",

    }),

    clearIndicator: (base) => ({

      ...base,

      color: isDarkMode ? "#a3a3a3": "#6b7280",

    }),

  };

  const totalRiders = ridersData.length;
  const verifiedRiders = ridersData.filter((rider) => Number(rider.account_status) === 1).length;
  const activeRiders = ridersData.filter((rider) => Number(rider.is_active) === 1).length;
  const availableRiders = ridersData.filter((rider) => Number(rider.is_available) === 1).length;
const applyFiltersAndClose = () => {
  setFilterUpdate(true);
  setIsFilterOpen(false);
};

const handleFilterKeyDown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    applyFiltersAndClose();
  }
};

    const [loadingPage, setLoadingPage] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setLoadingPage(false);
  }, 2000);

  return () => clearTimeout(timer);
}, []);

  return (

    <>
    {
      loadingPage ? (
        <div className=" w-full h-[90vh] flex justify-center items-center">
                  <div>
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    <p className="mt-2"> Loading Rider Details...</p>
                  </div>
                </div>
      ):(

      <div className="min-h-screen w-full  text-slate-900 dark:bg-[#080d17] dark:text-slate-100">

        <Drawer

          direction="right"

          open={isFilterOpen}

          onOpenChange={setIsFilterOpen}

        >

          <DrawerContent className="left-auto right-0 top-0 mt-0 h-full w-full max-w-md rounded-none border-l border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0d1421]">

            <DrawerHeader className="border-b border-slate-200 px-6 py-5 text-left dark:border-slate-800">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <DrawerTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">

                    <Filter className="h-5 w-5 text-[#0446DB]" />

                    Advance Filters

                  </DrawerTitle>

                  <DrawerDescription className="mt-1 text-sm text-gray-500 dark:text-neutral-400">

                    Filter riders using rider ID, facility city and facility zone.

                  </DrawerDescription>

                </div>

                <Button

                  type="button"

                  variant="ghost"

                  size="icon"

                  onClick={() => setIsFilterOpen(false)}

                  className="h-9 w-9 shrink-0 rounded-full text-gray-500 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800"

                >

                  <X className="h-5 w-5" />

                </Button>

              </div>

            </DrawerHeader>

            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">

                  Rider ID

                </label>

                <input

                  type="text"

                  value={advanceFilters.rider_id}

                  onChange={(e) =>

                    setAdvanceFilters((prev) => ({

                      ...prev,

                      rider_id: e.target.value,

                    }))

                  }
                  onKeyDown={handleFilterKeyDown}

                  placeholder="Enter Rider ID"

                  className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"

                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">

                  Facility City

                </label>

                <Select

                  options={options}

                  isSearchable

                  isClearable

                  value={

                    options.find(

                      (option) => option.value === advanceFilters.facility_city,

                    ) || null

                  }

                  onChange={(selectedOption) =>

                    setAdvanceFilters((prev) => ({

                      ...prev,

                      facility_city: selectedOption?.value || "",

                    }))

                  }

                  placeholder="Select City"

                  styles={darkSelectStyles}

                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">

                  Facility Zone

                </label>

                <input

                  type="text"

                  value={advanceFilters.facility_zone}

                  onChange={(e) =>

                    setAdvanceFilters((prev) => ({

                      ...prev,

                      facility_zone: e.target.value,

                    }))

                  }
                  onKeyDown={handleFilterKeyDown}

                  placeholder="Enter Facility Zone"

                  className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"

                />

              </div>

            </div>

            <DrawerFooter className="border-t border-gray-200 px-6 py-4 dark:border-neutral-800">

              <div className="flex w-full items-center gap-2">

                <Button
 
                  type="button"

                  variant="outline"

                  onClick={() => {

                    resetAdvanceFilters();

                    setFilterUpdate(true);

                    setIsFilterOpen(false);

                  }}

                  className="gap-2 w-1/2"

                >

                  <RotateCcw className="h-4 w-4" />

                  Reset

                </Button>

                <Button

                  type="button"

                  onClick={() => {

                    setFilterUpdate(true);

                    setIsFilterOpen(false);

                  }}

                  className="gap-2 w-1/2 bg-[#0446DB] text-white hover:bg-[#0339b5]"

                >

                  <Search className="h-4 w-4" />

                  Apply Filter

                </Button>

              </div>

            </DrawerFooter>

          </DrawerContent>

        </Drawer>

        <div className=" dark:border-slate-800 dark:bg-[#0d1421]">
          <div className="">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white ">Rider Details</h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage rider accounts, availability, KYC and credentials.</p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                <Button
                  asChild
                  className="group h-10 cursor-pointer rounded-sm bg-[#0446DB] px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0339B5] hover:shadow-md"
                >
                  <Link
                    to="/techbased_merchant/rider/onboarding"
                    className="inline-flex items-center justify-center gap-2"
                  >
                    <UserPlus className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    Rider Onboarding
                  </Link>
                </Button>

                <Button
  type="button"
  onClick={handleExport}
  disabled={loading}
  className="group h-10 cursor-pointer rounded-sm bg-[#0446DB] px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0339B5] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
>
  <Download
    className={`h-4 w-4 transition-transform duration-200 ${
      loading ? "animate-bounce" : "group-hover:translate-y-0.5"
    }`}
  />

  {loading ? "Exporting..." : "Export"}
</Button>
                
                <Button type="button" onClick={fetchRiders} disabled={loading} 
  className="group h-10 cursor-pointer rounded-sm bg-[#0446DB] px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0339B5] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
                </Button>
                <Button type="button" onClick={() => setIsFilterOpen(true)} 
  className="group h-10 cursor-pointer rounded-sm bg-[#0446DB] px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0339B5] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Filter className="h-4 w-4" /> Filter
                </Button>
              </div>
            </div>
          </div>
        </div>

        <main className="  py-3">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: "Total Riders", value: totalRiders, icon: Users, tone: "blue" },
              { label: "Verified", value: verifiedRiders, icon: ShieldCheck, tone: "emerald" },
              { label: "Active", value: activeRiders, icon: UserCheck, tone: "violet" },
              { label: "Available", value: availableRiders, icon: Bike, tone: "amber" },
            ].map((item) => {
              const Icon = item.icon;
              const tones = {
                blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
                emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
                violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
                amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
              };
              return (
                <div key={item.label} className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0d1421] sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</p>
                      <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{item.value}</p>
                    </div>
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-sm ${tones[item.tone]}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0d1421]">
            <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-950 dark:text-white">All Riders</h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">View and manage rider account status and documents.</p>
              </div>
              <span className="w-fit rounded-sm bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{totalRiders} riders</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[1050px] w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/70">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    {["Rider ID", "Rider Name", "Account Status", "Active", "Available", "Rider Document", "Change Password"].map((heading) => (
                      <th key={heading} className="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {ridersData.length === 0 ? (
                    <tr><td colSpan={7} className="px-5 py-14 text-center text-sm text-slate-500 dark:text-slate-400">{loading ? "Loading riders..." : "No riders found."}</td></tr>
                  ) : ridersData.map((rider) => (
                    <tr key={rider.id} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
                      <td className="px-5 py-4 text-center text-sm font-semibold text-slate-700 dark:text-slate-200">M_{rider.merchant_id}_{rider.id}</td>
                      <td className="px-5 py-4 text-center text-sm font-medium text-slate-800 dark:text-slate-100">{rider.name || "N/A"}</td>
                      <td className="px-5 py-4 text-center"><StatusToggle checked={Number(rider.account_status) === 1} onClick={() => changeVerificationStatus(rider.id, rider.account_status == 1 ? 0 : 1)} /></td>
                      <td className="px-5 py-4 text-center"><StatusToggle checked={Number(rider.is_active) === 1} disabled={!rider.account_status} onClick={() => { if (rider.account_status) changeActiveStatus(rider.id, rider.is_active == 1 ? 0 : 1); }} /></td>
                      <td className="px-5 py-4 text-center"><StatusToggle checked={Number(rider.is_available) === 1} disabled={!rider.account_status || !rider.is_active} onClick={() => { if (rider.account_status && rider.is_active) changeAvailabilityStatus(rider.id, rider.is_available == 1 ? 0 : 1); }} /></td>
                      <td className="px-5 py-4 text-center">
                        <button type="button" onClick={() => setPopup(rider)} className="inline-flex h-9 items-center justify-center gap-2 rounded-sm border border-blue-200 bg-blue-50 px-3 text-xs font-bold text-[#0446DB] transition hover:border-[#0446DB] hover:bg-[#0446DB] hover:text-white dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                          <TbFileInfo className="text-base" /> View
                        </button>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button type="button" onClick={() => { setNewPassword({ id: rider.id, password: "", confirmPassword: "" }); setChangePasswordPopup(rider); }} className="inline-flex h-9 items-center justify-center gap-2 rounded-sm border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0446DB] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-blue-500/10 dark:hover:text-blue-400">
                          <KeyRound className="h-4 w-4" /> Change Password
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {popup && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

            <div className="w-full max-w-5xl overflow-hidden rounded-sm border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0d1421]">

















              <div className="bg-[#0446DB] px-6 py-5">

                <div className="flex justify-between items-center">

                  <h2 className="text-2xl font-bold text-white">

                    Rider Details

                  </h2>

                  <div className="flex items-center space-x-2">

                    <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">

                      ID: M_{popup?.merchant_id}_{popup.id}

                    </span>

                  </div>

                </div>

              </div>

              <form

                onSubmit={(e) => {

                  e.preventDefault();

                  handleSave();

                }}

                className="max-h-[78vh] space-y-5 overflow-y-auto bg-[#f8fafc] px-4 py-5 dark:bg-[#080d17] sm:px-6"

              >

















                <div className="flex flex-wrap gap-3 rounded-sm bg-gray-50 p-3 dark:bg-neutral-800/60">

                  <div className="flex items-center">

                    <div

                      className={`w-3 h-3 rounded-full mr-2 ${popup.account_status ? "bg-green-500": "bg-red-500"}`}

                    ></div>

                    <span className="text-sm font-medium">

                      {popup.account_status ? "Verified": "Not Verified"}

                    </span>

                  </div>

                  <div className="flex items-center">

                    <div

                      className={`w-3 h-3 rounded-full mr-2 ${popup.is_active ? "bg-green-500": "bg-red-500"}`}

                    ></div>

                    <span className="text-sm font-medium">

                      {popup.is_active ? "Active": "Not Active"}

                    </span>

                  </div>

                  <div className="flex items-center">

                    <div

                      className={`w-3 h-3 rounded-full mr-2 ${popup.is_available ? "bg-green-500": "bg-red-500"}`}

                    ></div>

                    <span className="text-sm font-medium">

                      {popup.is_available ? "Available": "Not Available"}

                    </span>

                  </div>

                  <div className="flex items-center">

                    <div

                      className={`w-3 h-3 rounded-full mr-2 ${popup.kyc_verified == "1" ? "bg-green-500": "bg-red-500"}`}

                    ></div>

                    <span className="text-sm font-medium">

                      {popup.kyc_verified == "1"

                        ? "Rider Identity Approved"

                       : "Rider Identity Pending"}

                    </span>

                  </div>

                </div>

















                <section className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0d1421]">

                  <div className="flex items-center mb-4">

                    <div className="w-1 h-5 bg-[#554dc0] mr-2 rounded"></div>

                    <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-100">

                      Basic Details

                    </h3>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="space-y-1">

                      <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">

                        Rider Name

                      </label>

                      <input

                        name="name"

                        value={formData?.name || ""}

                        onChange={handleChange}

                        disabled={!isEditing}

                        placeholder={formData?.name || "NA"}

                        className={`w-full px-3 py-2 border rounded-sm focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${

                          !isEditing

                            ? "bg-gray-100 text-gray-600 cursor-not-allowed"

                           : "bg-white"

                        }`}

                      />

                    </div>

                    <div className="space-y-1">

                      <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">

                        Phone No

                      </label>

                     <input
  name="phone"
  type="text"
  inputMode="numeric"
  maxLength={10}
  value={formData?.phone || ""}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);

    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
  }}
  disabled={!isEditing}
  placeholder="Enter 10 digit mobile number"
  className={`w-full px-3 py-2 border rounded-sm focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${
    !isEditing
      ? "bg-gray-100 text-gray-600 cursor-not-allowed"
      : "bg-white"
  }`}
/>

                    </div>

                    <div className="space-y-1">

                      <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">

                        Email

                      </label>

                      <input

                        name="email"

                        value={formData?.email || ""}

                        onChange={handleChange}

                        disabled={!isEditing}

                        placeholder={formData?.email || "NA"}

                        className={`w-full px-3 py-2 border rounded-sm focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${

                          !isEditing

                            ? "bg-gray-100 text-gray-600 cursor-not-allowed"

                           : "bg-white"

                        }`}

                      />

                    </div>

                    <div className="space-y-1">

                      <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">

                        Address

                      </label>

                      <input

                        name="address_line"

                        value={formData?.address_line || ""}

                        onChange={handleChange}

                        disabled={!isEditing}

                        placeholder={formData?.address_line || "NA"}

                        className={`w-full px-3 py-2 border rounded-sm focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${

                          !isEditing

                            ? "bg-gray-100 text-gray-600 cursor-not-allowed"

                           : "bg-white"

                        }`}

                      />

                    </div>

                    <div className="space-y-1">

                      <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">

                        State

                      </label>

                      <Select
                        isDisabled={!isEditing}
                        options={stateOptions}
                        isSearchable
                        isClearable
                        value={
                          stateOptions.find(
                            (option) => option.value === selectedStateCode,
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          setFormData((prev) => ({
                            ...prev,
                            state: selectedOption?.label || "",
                            state_code: selectedOption?.value || "",
                            city: "",
                          }))
                        }
                        placeholder="Select State"
                        styles={darkSelectStyles}
                      />

                    </div>

                    <div className="space-y-1">

                      <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">

                        City

                      </label>

                      <Select
                        isDisabled={!isEditing || !selectedStateCode}
                        options={cityOptions}
                        isSearchable
                        isClearable
                        value={
                          cityOptions.find(
                            (option) => option.value === formData?.city,
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          setFormData((prev) => ({
                            ...prev,
                            city: selectedOption?.value || "",
                          }))
                        }
                        placeholder={
                          selectedStateCode ? "Select City" : "Select State first"
                        }
                        styles={darkSelectStyles}
                      />

                    </div>

                    

                    <div className="space-y-1">

                      <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">

                        Pincode

                      </label>

                      <input
  name="pincode"
  type="text"
  inputMode="numeric"
  maxLength={6}
  value={formData?.pincode || ""}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);

    setFormData((prev) => ({
      ...prev,
      pincode: value,
    }));
  }}
  disabled={!isEditing}
  placeholder="Enter 6 digit pincode"
  className={`w-full px-3 py-2 border rounded-sm focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${
    !isEditing
      ? "bg-gray-100 text-gray-600 cursor-not-allowed"
      : "bg-white"
  }`}
/>

                    </div>

                    <div className="space-y-1">

                      <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">

                        Facility City

                      </label>

                      <Select

                        isDisabled={!isEditing}

                        options={options}

                        isSearchable

                        value={options.find(

                          (option) => option.value === formData?.facility_city,

                        )}

                        onChange={(selectedOption) =>

                          setFormData((prev) => ({

                            ...prev,

                            facility_city: selectedOption?.value || "",

                          }))

                        }

                        placeholder={formData?.facility_city || "NA"}

                        className="border rounded-sm text-sm w-full"

                        styles={darkSelectStyles}

                      />

                    </div>

                    <div className="space-y-1">

                      <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">

                        Facility Zone

                      </label>

                      <input

                        name="facility_zone"

                        value={formData?.facility_zone || ""}

                        onChange={handleChange}

                        disabled={!isEditing}

                        placeholder={formData?.facility_zone || "NA"}

                        className={`w-full px-3 py-2 border rounded-sm focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${

                          !isEditing

                            ? "bg-gray-100 text-gray-600 cursor-not-allowed"

                           : "bg-white"

                        }`}

                      />

                    </div>

                  </div>

                </section>

















                <section className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0d1421]">

                  <div className="flex items-center mb-4">

                    <div className="w-1 h-5 bg-[#554dc0] mr-2 rounded"></div>

                    <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-100">

                      KYC Details

                    </h3>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div className="space-y-1">

                      <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">

                        Document Type

                      </label>

                      <div className="rounded-sm border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">

                        {popup.document_type || "N/A"}

                      </div>

                    </div>

                    <div className="space-y-1">

                      <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">

                        Document ID

                      </label>

                      <input

                        name="document_id"

                        value={formData?.document_id || ""}

                        onChange={handleChange}

                        disabled={true}

                        placeholder={formData?.document_id || "NA"}

                        className={`w-full px-3 py-2 border rounded-sm focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${

                          !isEditing

                            ? "bg-gray-100 text-gray-600 cursor-not-allowed"

                           : "bg-white"

                        }`}

                      />

















                    </div>

                    <div className="space-y-1">

                      <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">

                        Document File

                      </label>

                      <div className="rounded-sm border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">

                        {popup.document_image ? (

                          <a

                            href={`${baseURL}/${popup.document_image}`}

                            target="_blank"

                            rel="noopener noreferrer"

                            className="flex items-center text-[#554dc0] hover:text-[#4038a0] hover:underline transition"

                          >

                            <FaRegFileImage className="mr-2" />

                            View Document

                          </a>

                        ): (

                          <div className="flex items-center text-gray-500 dark:text-neutral-400">

                            <FaRegFileImage className="mr-2" />

                            No Document Available

                          </div>

                        )}

                      </div>

                    </div>

                  </div>

                  {

                    <Button

  type="button"

  disabled={Number(popup?.kyc_verified) === 1 || loading}

  onClick={() => {

    if (Number(popup?.kyc_verified) !== 1) {

      kycVerify(1);

    }

  }}

  className={`

    mt-5 inline-flex items-center gap-2 rounded-md px-4 py-2

    text-sm font-semibold transition-all duration-200

    ${

      Number(popup?.kyc_verified) === 1

        ? "cursor-not-allowed border border-green-200 bg-green-50 text-green-700 shadow-none hover:bg-green-50 dark:border-green-800 dark:bg-green-950/40 dark:text-green-400"

        : "cursor-pointer bg-[#0446DB] text-white shadow-sm hover:bg-[#0339b4]"

    }

  `}

>

  {Number(popup?.kyc_verified) === 1 ? (

    <>

      <svg

        className="h-5 w-5"

        fill="none"

        stroke="currentColor"

        strokeWidth="2"

        viewBox="0 0 24 24"

      >

        <path

          d="M5 13l4 4L19 7"

          strokeLinecap="round"

          strokeLinejoin="round"

        />

      </svg>

      Rider KYC Approved

    </>

  ) : loading ? (

    <>

      <svg

        className="h-4 w-4 animate-spin"

        viewBox="0 0 24 24"

        fill="none"

      >

        <circle

          className="opacity-25"

          cx="12"

          cy="12"

          r="10"

          stroke="currentColor"

          strokeWidth="4"

        />

        <path

          className="opacity-75"

          fill="currentColor"

          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"

        />

      </svg>

      Verifying...

    </>

  ) : (

    <>

      <svg

        className="h-5 w-5"

        fill="none"

        stroke="currentColor"

        strokeWidth="2"

        viewBox="0 0 24 24"

      >

        <path

          strokeLinecap="round"

          strokeLinejoin="round"

          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"

        />

      </svg>

      Verify KYC

    </>

  )}

</Button>

                  }

                </section>

















                <section className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0d1421]">

                  <div className="flex items-center mb-4">

                    <div className="w-1 h-5 bg-[#554dc0] mr-2 rounded"></div>

                    <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-100">

                      Bank Details

                    </h3>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="space-y-1">

                      <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">

                        Bank Name

                      </label>

                      <input
  name="bank_name"
  type="text"
  inputMode="numeric"
  value={formData?.bank_name || ""}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "");

    setFormData((prev) => ({
      ...prev,
      bank_name: value,
    }));
  }}
  disabled={!isEditing}
  placeholder="Enter number"
  className={`w-full px-3 py-2 border rounded-sm focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${
    !isEditing
      ? "bg-gray-100 text-gray-600 cursor-not-allowed"
      : "bg-white"
  }`}
/>

                    </div>

                    <div className="space-y-1">

                      <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">

                        Account Number

                      </label>

                      <input

                        name="bank_account_number"

                        value={formData?.bank_account_number || ""}

                        onChange={handleChange}

                        disabled={!isEditing}

                        placeholder={formData?.bank_account_number || "NA"}

                        className={`w-full px-3 py-2 border rounded-sm focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${

                          !isEditing

                            ? "bg-gray-100 text-gray-600 cursor-not-allowed"

                           : "bg-white"

                        }`}

                      />

                    </div>

                    <div className="space-y-1">

                      <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">

                        Branch

                      </label>

                      <input

                        name="bank_branch"

                        value={formData?.bank_branch || ""}

                        onChange={handleChange}

                        disabled={!isEditing}

                        placeholder={formData?.bank_branch || "NA"}

                        className={`w-full px-3 py-2 border rounded-sm focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${

                          !isEditing

                            ? "bg-gray-100 text-gray-600 cursor-not-allowed"

                           : "bg-white"

                        }`}

                      />

                    </div>

                    <div className="space-y-1">

                      <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">

                        IFSC Code

                      </label>

                      <input

                        name="bank_ifsc_code"

                        value={formData?.bank_ifsc_code || ""}

                        onChange={handleChange}

                        disabled={!isEditing}

                        placeholder={formData?.bank_ifsc_code || "NA"}

                        className={`w-full px-3 py-2 border rounded-sm focus:ring-2 focus:ring-[#554dc0] focus:border-[#554dc0] focus:outline-none transition ${

                          !isEditing

                            ? "bg-gray-100 text-gray-600 cursor-not-allowed"

                           : "bg-white"

                        }`}

                      />

                    </div>

                    <div className="space-y-1 md:col-span-2">

                      <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">

                        {!isEditing ? "Cheque Image": "Upload Cheque Image"}

                      </label>

                      {!isEditing ? (

                        <div className="rounded-sm border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">

















                          {popup.cheque_image ? (

                            <div>

                              <a

                                href={`${baseURL}/${popup.cheque_image}`}

                                target="_blank"

                                rel="noopener noreferrer"

                                className="flex items-center text-[#554dc0] hover:text-[#4038a0] hover:underline transition"

                              >

                                <FaRegFileImage className="mr-2" />

                                View Cheque Image

                              </a>

                            </div>

                          ): (

                            <div className="flex items-center text-gray-500 dark:text-neutral-400">

                              <FaRegFileImage className="mr-2" />

                              No Cheque Image Available

                            </div>

                          )}

                        </div>

                      ): (

                        <input

                          type="file"

                          name="cheque_image"

                          onChange={handleChange}

                          disabled={!isEditing}

                          accept="image/\\\\\\\\\\\\\\\\,application/pdf"

                          className="w-full rounded-sm border border-gray-300 bg-white px-3 py-2 text-gray-900 transition focus:border-[#554dc0] focus:outline-none focus:ring-2 focus:ring-[#554dc0] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"

                        />

                      )}

                    </div>

                  </div>

                </section>

















                <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-4 dark:border-neutral-800">

                  {isEditing ? (

                    <>

                      <Button

                        type="submit"

                        className="bg-green-600 text-white px-5 py-2.5 rounded-sm hover:bg-green-700 transition font-medium flex items-center"

                      >

                        <svg

                          className="w-4 h-4 mr-2"

                          fill="none"

                          stroke="currentColor"

                          viewBox="0 0 24 24"

                        >

                          <path

                            strokeLinecap="round"

                            strokeLinejoin="round"

                            strokeWidth={2}

                            d="M5 13l4 4L19 7"

                          />

                        </svg>

                        Save Changes

                      </Button>

                      <Button

                        type="button"

                        onClick={() => {

                          setFormData(popup);

                          setIsEditing(false);

                        }}

                        className="bg-gray-500 text-white px-5 py-2.5 rounded-sm hover:bg-gray-600 transition font-medium"

                      >

                        Cancel

                      </Button>

                    </>

                  ): (

                    <Button

                      type="button"

                      onClick={() => {

                        setIsEditing(true);

                        setFormData(popup);

                      }}

                      className="bg-[#0446DB] text-white px-5 py-2.5 rounded-sm hover:bg-[#4038a0] transition font-medium flex items-center"

                    >

                      <svg

                        className="w-4 h-4 mr-2"

                        fill="none"

                        stroke="currentColor"

                        viewBox="0 0 24 24"

                      >

                        <path

                          strokeLinecap="round"

                          strokeLinejoin="round"

                          strokeWidth={2}

                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"

                        />

                      </svg>

                      Edit Details

                    </Button>

                  )}

                  <Button

                    type="button"

                    onClick={() => {

                      setPopup(null);

                      setFormData(null);

                      setIsEditing(false);

                    }}

                    className="bg-gray-300 text-gray-700 px-5 py-2.5 rounded-sm hover:bg-gray-400 transition font-medium"

                  >

                    Close

                  </Button>

                </div>

              </form>

            </div>

          </div>

        )}

        {changePasswordPopup && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200">

















              <div className="bg-[#0446DB] px-6 py-4">

                <h2 className="text-2xl font-semibold text-white text-center">

                  Change Password

                </h2>

              </div>

















              <form

                onSubmit={(e) => {

                  e.preventDefault();

                  handlePasswordChange();

                }}

                className="px-6 py-6 bg-white space-y-6"

              >

















                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">

                  <div>

                    <label className="block font-medium mb-1">ID:</label>

                    <p className="bg-gray-100 p-2 rounded">

                      {changePasswordPopup.id}

                    </p>

                  </div>

                  <div>

                    <label className="block font-medium mb-1">

                      Rider Name:

                    </label>

                    <p className="bg-gray-100 p-2 rounded">

                      {changePasswordPopup.name}

                    </p>

                  </div>

                </div>

















                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

















                  <div>

                    <label className="block font-medium mb-1">

                      New Password

                    </label>

                    <div className="relative">

                      <input

                        type={showPassword ? "text": "password"}

                        name="password"

                        value={newPassword?.password || ""}

                        onChange={(e) =>

                          setNewPassword({

                            ...newPassword,

                            password: e.target.value,

                          })

                        }

                        placeholder="Enter new password"

                        required

                        className="w-full border px-3 py-2 pr-10 rounded-md focus:ring-2 focus:ring-[#0446DB]/30 focus:border-[#0446DB] focus:outline-none"

                      />

                      <button

                        type="button"

                        onClick={() => setShowPassword((prev) => !prev)}

                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0446DB]"

                        tabIndex={-1}

                      >

                        {showPassword ? (

                          <FaEyeSlash className="text-lg" />

                        ): (

                          <FaEye className="text-lg" />

                        )}

                      </button>

                    </div>

                  </div>

















                  <div>

                    <label className="block font-medium mb-1">

                      Confirm Password

                    </label>

                    <div className="relative">

                      <input

                        type={showConfirmPassword ? "text": "password"}

                        name="confirmPassword"

                        value={newPassword?.confirmPassword || ""}

                        onChange={(e) =>

                          setNewPassword({

                            ...newPassword,

                            confirmPassword: e.target.value,

                          })

                        }

                        placeholder="Confirm password"

                        required

                        className="w-full border px-3 py-2 pr-10 rounded-md focus:ring-2 focus:ring-[#0446DB]/30 focus:border-[#0446DB] focus:outline-none"

                      />

                      <button

                        type="button"

                        onClick={() => setShowConfirmPassword((prev) => !prev)}

                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0446DB]"

                        tabIndex={-1}

                      >

                        {showConfirmPassword ? (

                          <FaEyeSlash className="text-lg" />

                        ): (

                          <FaEye className="text-lg" />

                        )}

                      </button>

                    </div>

                  </div>

                </div>

















                <div className="flex justify-end gap-3 pt-4 border-t">

                  <button

                    type="button"

                    onClick={() => {

                      setChangePasswordPopup(null);

                      setNewPassword({

                        id: "",

                        password: "",

                        confirmPassword: "",

                      });

                      setShowPassword(false);

                      setShowConfirmPassword(false);

                    }}

                    className="bg-gray-200 text-gray-800 px-5 py-2 rounded-sm hover:bg-gray-300 transition"

                  >

                    Close

                  </button>

                  <button

                    type="submit"

                    disabled={loading}

                    className="bg-[#0446DB] text-white px-5 py-2 rounded-sm hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"

                  >

                    {loading ? "Updating...": "Change Password"}

                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </div>
      )
    }


    </>

  );

}

export default TechBasedRiderStats;