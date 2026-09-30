

// import { useEffect, useMemo, useState } from "react";

// import axios from "axios";

// import Select from "react-select";

// import { toast } from "react-toastify";

// import { Country, State, City } from "country-state-city";

// import {

//   User,

//   Mail,

//   Phone,

//   Lock,

//   MapPin,

//   Globe2,

//   Building2,

//   Loader2,
//   EyeOff,
//   Eye,

// } from "lucide-react";

// const baseURL = import.meta.env.VITE_BASE_URL;

// const TECH_MERCHANT_API = `${String(baseURL || "").replace(`/\\/$/`, "")}/api/tech-merchant`;

// const initialFormData = {

//   name: "",

//   email: "",

//   phone_number: "",

//   password: "",

//   country_code: "IN",

//   state_code: "",

//   facility_city: "",

// };

// function TechBasedOnBoarding() {

//   const [loading, setLoading] = useState(false);
//   const [formRiderData, setFormRiderData] = useState(initialFormData);
//   const [showPassword, setShowPassword] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(() =>
//     document.documentElement.classList.contains("dark"),
//   );

//   useEffect(() => {
//     const observer = new MutationObserver(() => {
//       setIsDarkMode(document.documentElement.classList.contains("dark"));
//     });

//     observer.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });

//     return () => observer.disconnect();
//   }, []);

//   const countryOptions = useMemo(() => {

//     return Country.getAllCountries().map((country) => ({

//       value: country.isoCode,

//       label: country.name,

//       phonecode: country.phonecode,

//       flag: country.flag,

//     }));

//   }, []);

//   const stateOptions = useMemo(() => {

//     if (!formRiderData.country_code) return [];

//     return State.getStatesOfCountry(formRiderData.country_code).map((state) => ({

//       value: state.isoCode,

//       label: state.name,

//     }));

//   }, [formRiderData.country_code]);

//   const cityOptions = useMemo(() => {

//     if (!formRiderData.country_code || !formRiderData.state_code) return [];

//     return City.getCitiesOfState(

//       formRiderData.country_code,

//       formRiderData.state_code,

//     ).map((city) => ({

//       value: city.name,

//       label: city.name,

//       latitude: city.latitude,

//       longitude: city.longitude,

//     }));

//   }, [formRiderData.country_code, formRiderData.state_code]);

//   const handleRiderChange = (e) => {

//     const { name, value } = e.target;

//     setFormRiderData((prev) => ({ ...prev, [name]: value }));

//   };

//   const handleCountryChange = (selectedOption) => {

//     setFormRiderData((prev) => ({

//       ...prev,

//       country_code: selectedOption?.value || "",

//       state_code: "",

//       facility_city: "",

//     }));

//   };

//   const handleStateChange = (selectedOption) => {

//     setFormRiderData((prev) => ({

//       ...prev,

//       state_code: selectedOption?.value || "",

//       facility_city: "",

//     }));

//   };

//   const handleCityChange = (selectedOption) => {

//     setFormRiderData((prev) => ({

//       ...prev,

//       facility_city: selectedOption?.value || "",

//     }));

//   };

//   const validateForm = () => {

//     const name = formRiderData.name.trim();

//     const email = formRiderData.email.trim();

//     const phone = formRiderData.phone_number.trim();

//     const password = formRiderData.password.trim();

//     const facilityCity = formRiderData.facility_city.trim();

//     if (!name) return toast.error("Name is required"), false;

//     if (!email) return toast.error("Email is required"), false;

// const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

// if (!gmailRegex.test(email.trim())) {
//   toast.error("Enter a valid Gmail address (example@gmail.com)");
//   return false;
// }

//     if (!phone) return toast.error("Mobile number is required"), false;

//     if (!/^\d{10}$/.test(phone)) return toast.error("Mobile number must be exactly 10 digits"), false;

//     if (!password) return toast.error("Password is required"), false;

//     if (password.length < 6) return toast.error("Password must be at least 6 characters"), false;

//     if (!formRiderData.country_code) return toast.error("Please select a country"), false;

//     if (!formRiderData.state_code) return toast.error("Please select a state"), false;

//     if (!facilityCity) return toast.error("Please select facility city"), false;

//     return true;

//   };

//   const handleRiderSubmit = async (e) => {

//     e.preventDefault();

//     if (!validateForm()) return;

//     try {

//       setLoading(true);

//       const token =

//         localStorage.getItem("merchantToken") || localStorage.getItem("token");

//       const payload = {

//         name: formRiderData.name.trim(),

//         email: formRiderData.email.trim(),

//         phone_number: formRiderData.phone_number.trim(),

//         password: formRiderData.password,

//         facility_city: formRiderData.facility_city,

//       };
    
//       const response = await axios.post(

//         `${TECH_MERCHANT_API}/onboardRider`,

//         payload,

//         {

//           headers: {

//             "Content-Type": "application/json",

//             ...(token

//               ? {

//                   Authorization: `Bearer ${token}`,

//                   "x-auth-token": token,

//                 }

//               : {}),

//           },

//         },

//       );

//       if (response?.data?.success) {

//         toast.success(response?.data?.message || "Rider onboarded successfully");

//         setFormRiderData(initialFormData);

//       }

//     } catch (error) {

//       console.error("Rider onboarding error:", error?.response?.data || error);

//       toast.error(

//         error?.response?.data?.message ||

//           error?.response?.data?.error ||

//           error?.message ||

//           "Failed to onboard rider",

//       );

//     } finally {

//       setLoading(false);

//     }

//   };

//   const selectedCountry =

//     countryOptions.find((country) => country.value === formRiderData.country_code) || null;

//   const selectedState =

//     stateOptions.find((state) => state.value === formRiderData.state_code) || null;

//   const selectedCity =

//     cityOptions.find((city) => city.value === formRiderData.facility_city) || null;

//   const selectStyles = {
//     control: (base, state) => ({
//       ...base,
//       minHeight: "46px",
//       borderRadius: "10px",
//       backgroundColor: isDarkMode ? "#171717" : "#ffffff",
//       borderColor: state.isFocused
//         ? "#554dc0"
//         : isDarkMode
//           ? "#404040"
//           : "#d1d5db",
//       boxShadow: state.isFocused
//         ? "0 0 0 2px rgba(85,77,192,0.16)"
//         : "none",
//       color: isDarkMode ? "#f5f5f5" : "#111827",
//       "&:hover": {
//         borderColor: state.isFocused
//           ? "#554dc0"
//           : isDarkMode
//             ? "#525252"
//             : "#9ca3af",
//       },
//     }),
//     valueContainer: (base) => ({
//       ...base,
//       color: isDarkMode ? "#f5f5f5" : "#111827",
//     }),
//     singleValue: (base) => ({
//       ...base,
//       color: isDarkMode ? "#f5f5f5" : "#111827",
//     }),
//     input: (base) => ({
//       ...base,
//       color: isDarkMode ? "#f5f5f5" : "#111827",
//     }),
//     placeholder: (base) => ({
//       ...base,
//       color: isDarkMode ? "#737373" : "#9ca3af",
//     }),
//     dropdownIndicator: (base) => ({
//       ...base,
//       color: isDarkMode ? "#a3a3a3" : "#6b7280",
//     }),
//     clearIndicator: (base) => ({
//       ...base,
//       color: isDarkMode ? "#a3a3a3" : "#6b7280",
//     }),
//     indicatorSeparator: (base) => ({
//       ...base,
//       backgroundColor: isDarkMode ? "#404040" : "#e5e7eb",
//     }),
//     menu: (base) => ({
//       ...base,
//       zIndex: 50,
//       backgroundColor: isDarkMode ? "#171717" : "#ffffff",
//       border: `1px solid ${isDarkMode ? "#404040" : "#e5e7eb"}`,
//       boxShadow: isDarkMode
//         ? "0 12px 32px rgba(0,0,0,0.35)"
//         : "0 12px 32px rgba(15,23,42,0.12)",
//     }),
//     menuList: (base) => ({
//       ...base,
//       backgroundColor: isDarkMode ? "#171717" : "#ffffff",
//     }),
//     option: (base, state) => ({
//       ...base,
//       cursor: "pointer",
//       color: isDarkMode ? "#e5e5e5" : "#111827",
//       backgroundColor: state.isSelected
//         ? "#0446DB"
//         : state.isFocused
//           ? isDarkMode
//             ? "#262626"
//             : "#eff6ff"
//           : isDarkMode
//             ? "#171717"
//             : "#ffffff",
//       "&:active": {
//         backgroundColor: "#0446DB",
//         color: "#ffffff",
//       },
//     }),
//     noOptionsMessage: (base) => ({
//       ...base,
//       color: isDarkMode ? "#a3a3a3" : "#6b7280",
//     }),
//   };

//   return (

//     <div className="min-h-screen  text-gray-900 dark:bg-neutral-950 dark:text-neutral-100">

//       <div className="border-b border-transparent px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">

//         <div className="mx-auto ">

//           <h1 className="text-3xl font-bold text-gray-700 dark:text-white">Rider Onboarding</h1>

//           <p className="mt-2 text-sm text-gray-500 dark:text-white md:text-base">

//             Create a merchant rider account and select the rider facility location.

//           </p>

//         </div>

//       </div>

//       <div className="mx-auto pb-10">

//         <form

//           onSubmit={handleRiderSubmit}

//           className="overflow-visible border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"

//         >

//           <div className="border-b border-gray-200 px-6 py-5 dark:border-neutral-800 md:px-8">

//             <div className="flex items-center gap-3">

//               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-[#554dc0] dark:bg-indigo-950/40 dark:text-indigo-300">

//                 <User className="h-5 w-5" />

//               </div>

//               <div>

//                 <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">Rider Information</h2>

//                 <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">

//                   Fill all required details to onboard a rider.

//                 </p>

//               </div>

//             </div>

//           </div>

//           <div className="grid grid-cols-1 gap-8 p-6 md:p-8 lg:grid-cols-2">

//             <div className="space-y-5">

//               <div>

//                 <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">

//                   Rider Name <span className="text-red-500">*</span>

//                 </label>

//                 <div className="relative">

//                   <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />

//                   <input

//                     type="text"

//                     name="name"

//                     value={formRiderData.name}

//                     onChange={handleRiderChange}

//                     placeholder="Enter rider name"

//                     autoComplete="name"

//                     className="h-[46px] w-full rounded-[10px] border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#554dc0] focus:ring-2 focus:ring-[#554dc0]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-[#7c72ff] dark:focus:ring-[#7c72ff]/20"

//                   />

//                 </div>

//               </div>

//               <div>

//                 <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">

//                   Email Address <span className="text-red-500">*</span>

//                 </label>

//                 <div className="relative">

//                   <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />

//                   <input

//                     type="email"

//                     name="email"

//                     value={formRiderData.email}

//                     onChange={handleRiderChange}

//                     placeholder="rider\@example.com"

//                     autoComplete="email"

//                     className="h-[46px] w-full rounded-[10px] border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#554dc0] focus:ring-2 focus:ring-[#554dc0]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-[#7c72ff] dark:focus:ring-[#7c72ff]/20"

//                   />

//                 </div>

//               </div>

//               <div>

//                 <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">

//                   Phone Number <span className="text-red-500">*</span>

//                 </label>

//                 <div className="relative">

//                   <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />

//                   <input

//                     type="text"

//                     inputMode="numeric"

//                     maxLength={10}

//                     name="phone_number"

//                     value={formRiderData.phone_number}

//                     onChange={(e) => {

//                       const onlyDigits = e.target.value.replace(/\D/g, "");

//                       setFormRiderData((prev) => ({ ...prev, phone_number: onlyDigits }));

//                     }}

//                     placeholder="10 digit mobile number"

//                     autoComplete="tel"

//                     className="h-[46px] w-full rounded-[10px] border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#554dc0] focus:ring-2 focus:ring-[#554dc0]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-[#7c72ff] dark:focus:ring-[#7c72ff]/20"

//                   />

//                 </div>

//               </div>

//              <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">
//                   Password <span className="text-red-500">*</span>
//                 </label>

//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />

//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     value={formRiderData.password}
//                     onChange={handleRiderChange}
//                     placeholder="Minimum 6 characters"
//                     autoComplete="new-password"
//                     className="h-[46px] w-full rounded-[10px] border border-gray-300 bg-white pl-10 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#554dc0] focus:ring-2 focus:ring-[#554dc0]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-[#7c72ff] dark:focus:ring-[#7c72ff]/20"
//                   />

//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((prev) => !prev)}
//                     className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-gray-400 transition hover:text-gray-700 focus:outline-none dark:text-neutral-500 dark:hover:text-neutral-200"
//                     aria-label={showPassword ? "Hide password" : "Show password"}
//                     title={showPassword ? "Hide password" : "Show password"}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-5 w-5" />
//                     ) : (
//                       <Eye className="h-5 w-5" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//             </div>

//             <div className="space-y-5">

//               <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-5 dark:border-neutral-800 dark:bg-neutral-950/60">

//                 <div className="mb-5 flex items-center gap-2">

//                   <MapPin className="h-5 w-5 text-[#554dc0] dark:text-indigo-300" />

//                   <div>

//                     <h3 className="font-semibold text-gray-900 dark:text-neutral-100">Facility Location</h3>

//                     <p className="text-xs text-gray-500 dark:text-neutral-400">Country → State → City</p>

//                   </div>

//                 </div>

//                 <div className="space-y-5">

//                   <div>

//                     <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">

//                       <Globe2 className="h-4 w-4 text-gray-400 dark:text-neutral-500" />

//                       Country <span className="text-red-500">*</span>

//                     </label>

//                     <Select

//                       options={countryOptions}

//                       value={selectedCountry}

//                       onChange={handleCountryChange}

//                       isSearchable

//                       isClearable

//                       placeholder="Select country"

//                       styles={selectStyles}

//                       formatOptionLabel={(option) => (

//                         <div className="flex items-center gap-2">

//                           <span>{option.flag}</span>

//                           <span>{option.label}</span>

//                         </div>

//                       )}

//                     />

//                   </div>

//                   <div>

//                     <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">

//                       <Building2 className="h-4 w-4 text-gray-400 dark:text-neutral-500" />

//                       State <span className="text-red-500">*</span>

//                     </label>

//                     <Select

//                       options={stateOptions}

//                       value={selectedState}

//                       onChange={handleStateChange}

//                       isSearchable

//                       isClearable

//                       isDisabled={!formRiderData.country_code}

//                       placeholder={formRiderData.country_code ? "Select state" : "Select country first"}

//                       styles={selectStyles}

//                     />

//                   </div>

//                   <div>

//                     <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">

//                       <MapPin className="h-4 w-4 text-gray-400 dark:text-neutral-500" />

//                       Facility City <span className="text-red-500">*</span>

//                     </label>

//                     <Select

//                       options={cityOptions}

//                       value={selectedCity}

//                       onChange={handleCityChange}

//                       isSearchable

//                       isClearable

//                       isDisabled={!formRiderData.country_code || !formRiderData.state_code}

//                       placeholder={formRiderData.state_code ? "Select facility city" : "Select state first"}

//                       styles={selectStyles}

//                       noOptionsMessage={() => "No city found"}

//                     />

//                   </div>

//                 </div>

//               </div>



//             </div>

//           </div>

//           <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-6 py-5 dark:border-neutral-800 dark:bg-neutral-950/60 sm:flex-row sm:items-center sm:justify-end md:px-8">

//             <button

//               type="button"

//               disabled={loading}

//               onClick={() => setFormRiderData(initialFormData)}

//               className="h-11 rounded-sm border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"

//             >

//               Reset

//             </button>

//             <button

//               type="submit"

//               disabled={loading}

//               className="flex h-11 items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-6 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"

//             >

//               {loading ? (

//                 <>

//                   <Loader2 className="h-4 w-4 animate-spin" />

//                   Onboarding Rider...

//                 </>

//               ) : (

//                 "Complete Onboarding"

//               )}

//             </button>

//           </div>

//         </form>

//       </div>

//     </div>

//   );

// }

// export default TechBasedOnBoarding;



import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";
import { City } from "country-state-city";

import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Loader2,
  EyeOff,
  Eye,
} from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;

const TECH_MERCHANT_API = `${String(baseURL || "").replace(
  /\/$/,
  ""
)}/api/tech-merchant`;

const initialFormData = {
  name: "",
  email: "",
  phone_number: "",
  password: "",
  facility_city: "",
};

function TechBasedOnBoarding() {
  const [loading, setLoading] = useState(false);

  const [formRiderData, setFormRiderData] =
    useState(initialFormData);

  const [showPassword, setShowPassword] =
    useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  /* =========================================================
     DARK MODE OBSERVER
  ========================================================= */

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(
        document.documentElement.classList.contains("dark")
      );
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  /* =========================================================
     ALL INDIA CITIES
  ========================================================= */

  const cityOptions = useMemo(() => {
  const indiaCities = City.getCitiesOfCountry("IN") || [];

  // Cities/towns missing from country-state-city package
  const customCities = [
    "Shohratgarh",
  ];

  const allCities = [
    ...indiaCities.map((city) => city.name),
    ...customCities,
  ];

  return [
    ...new Map(
      allCities.map((cityName) => [
        cityName.toLowerCase(),
        {
          value: cityName,
          label: cityName,
        },
      ])
    ).values(),
  ].sort((a, b) =>
    a.label.localeCompare(b.label)
  );
}, []);

  /* =========================================================
     NORMAL INPUT CHANGE
  ========================================================= */

  const handleRiderChange = (e) => {
    const { name, value } = e.target;

    setFormRiderData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     CITY CHANGE
  ========================================================= */

  const handleCityChange = (selectedOption) => {
    setFormRiderData((prev) => ({
      ...prev,
      facility_city: selectedOption?.value || "",
    }));
  };

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validateForm = () => {
    const name = formRiderData.name.trim();
    const email = formRiderData.email.trim();
    const phone =
      formRiderData.phone_number.trim();
    const password =
      formRiderData.password.trim();
    const facilityCity =
      formRiderData.facility_city.trim();

    if (!name) {
      toast.error("Name is required");
      return false;
    }

    if (!email) {
      toast.error("Email is required");
      return false;
    }

    const gmailRegex =
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

    if (!gmailRegex.test(email)) {
      toast.error(
        "Enter a valid Gmail address (example@gmail.com)"
      );

      return false;
    }

    if (!phone) {
      toast.error("Mobile number is required");
      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error(
        "Mobile number must be exactly 10 digits"
      );

      return false;
    }

    if (!password) {
      toast.error("Password is required");
      return false;
    }

    if (password.length < 6) {
      toast.error(
        "Password must be at least 6 characters"
      );

      return false;
    }

    if (!facilityCity) {
      toast.error("Please select facility city");
      return false;
    }

    return true;
  };

  /* =========================================================
     SUBMIT RIDER
  ========================================================= */

  const handleRiderSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const token =
        localStorage.getItem("merchantToken") ||
        localStorage.getItem("token");

      /*
        IMPORTANT:
        Country aur State API me nahi ja rahe.

        Backend ko sirf selected city ka name
        facility_city me milega.
      */

      const payload = {
        name: formRiderData.name.trim(),
        email: formRiderData.email.trim(),
        phone_number:
          formRiderData.phone_number.trim(),
        password: formRiderData.password,
        facility_city:
          formRiderData.facility_city,
      };

      console.log(
        "Rider onboarding payload:",
        payload
      );

      const response = await axios.post(
        `${TECH_MERCHANT_API}/onboardRider`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",

            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                  "x-auth-token": token,
                }
              : {}),
          },
        }
      );

      if (response?.data?.success) {
        toast.success(
          response?.data?.message ||
            "Rider onboarded successfully"
        );

        setFormRiderData(initialFormData);
        setShowPassword(false);
      }
    } catch (error) {
      console.error(
        "Rider onboarding error:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to onboard rider"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     SELECTED CITY
  ========================================================= */

  const selectedCity =
    cityOptions.find(
      (city) =>
        city.value ===
        formRiderData.facility_city
    ) || null;

  /* =========================================================
     REACT SELECT STYLES
  ========================================================= */

  const selectStyles = {
    control: (base, state) => ({
      ...base,

      minHeight: "46px",
      borderRadius: "10px",

      backgroundColor: isDarkMode
        ? "#171717"
        : "#ffffff",

      borderColor: state.isFocused
        ? "#554dc0"
        : isDarkMode
          ? "#404040"
          : "#d1d5db",

      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(85,77,192,0.16)"
        : "none",

      color: isDarkMode
        ? "#f5f5f5"
        : "#111827",

      "&:hover": {
        borderColor: state.isFocused
          ? "#554dc0"
          : isDarkMode
            ? "#525252"
            : "#9ca3af",
      },
    }),

    valueContainer: (base) => ({
      ...base,

      color: isDarkMode
        ? "#f5f5f5"
        : "#111827",
    }),

    singleValue: (base) => ({
      ...base,

      color: isDarkMode
        ? "#f5f5f5"
        : "#111827",
    }),

    input: (base) => ({
      ...base,

      color: isDarkMode
        ? "#f5f5f5"
        : "#111827",
    }),

    placeholder: (base) => ({
      ...base,

      color: isDarkMode
        ? "#737373"
        : "#9ca3af",
    }),

    dropdownIndicator: (base) => ({
      ...base,

      color: isDarkMode
        ? "#a3a3a3"
        : "#6b7280",
    }),

    clearIndicator: (base) => ({
      ...base,

      color: isDarkMode
        ? "#a3a3a3"
        : "#6b7280",
    }),

    indicatorSeparator: (base) => ({
      ...base,

      backgroundColor: isDarkMode
        ? "#404040"
        : "#e5e7eb",
    }),

    menu: (base) => ({
      ...base,

      zIndex: 50,

      backgroundColor: isDarkMode
        ? "#171717"
        : "#ffffff",

      border: `1px solid ${
        isDarkMode ? "#404040" : "#e5e7eb"
      }`,

      boxShadow: isDarkMode
        ? "0 12px 32px rgba(0,0,0,0.35)"
        : "0 12px 32px rgba(15,23,42,0.12)",
    }),

    menuList: (base) => ({
      ...base,

      backgroundColor: isDarkMode
        ? "#171717"
        : "#ffffff",
    }),

    option: (base, state) => ({
      ...base,

      cursor: "pointer",

      color: isDarkMode
        ? "#e5e5e5"
        : "#111827",

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

    noOptionsMessage: (base) => ({
      ...base,

      color: isDarkMode
        ? "#a3a3a3"
        : "#6b7280",
    }),
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen text-gray-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* ================= HEADER ================= */}

      <div className="border-b border-transparent px-4  dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto">
          <h1 className="text-2xl font-bold text-gray-700 dark:text-white">
            Rider Onboarding
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-white md:text-base">
            Create a merchant rider account and
            select the rider facility city.
          </p>
        </div>
      </div>

      {/* ================= CONTENT ================= */}

      <div className="mx-auto pb-10">
        <form
          onSubmit={handleRiderSubmit}
          className="overflow-visible border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
        >
          {/* ================= FORM HEADER ================= */}

          <div className="border-b border-gray-200 px-6 py-5 dark:border-neutral-800 md:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-[#554dc0] dark:bg-indigo-950/40 dark:text-indigo-300">
                <User className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">
                  Rider Information
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                  Fill all required details to
                  onboard a rider.
                </p>
              </div>
            </div>
          </div>

          {/* ================= FORM BODY ================= */}

          <div className="grid grid-cols-1 gap-8 p-6 md:p-8 lg:grid-cols-2">
            {/* ================= LEFT SIDE ================= */}

            <div className="space-y-5">
              {/* RIDER NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                  Rider Name{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />

                  <input
                    type="text"
                    name="name"
                    value={formRiderData.name}
                    onChange={handleRiderChange}
                    placeholder="Enter rider name"
                    autoComplete="name"
                    className="h-[46px] w-full rounded-[10px] border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#554dc0] focus:ring-2 focus:ring-[#554dc0]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-[#7c72ff] dark:focus:ring-[#7c72ff]/20"
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                  Email Address{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />

                  <input
                    type="email"
                    name="email"
                    value={formRiderData.email}
                    onChange={handleRiderChange}
                    placeholder="rider@example.com"
                    autoComplete="email"
                    className="h-[46px] w-full rounded-[10px] border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#554dc0] focus:ring-2 focus:ring-[#554dc0]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-[#7c72ff] dark:focus:ring-[#7c72ff]/20"
                  />
                </div>
              </div>

              {/* PHONE NUMBER */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                  Phone Number{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    name="phone_number"
                    value={
                      formRiderData.phone_number
                    }
                    onChange={(e) => {
                      const onlyDigits =
                        e.target.value.replace(
                          /\D/g,
                          ""
                        );

                      setFormRiderData(
                        (prev) => ({
                          ...prev,
                          phone_number:
                            onlyDigits,
                        })
                      );
                    }}
                    placeholder="10 digit mobile number"
                    autoComplete="tel"
                    className="h-[46px] w-full rounded-[10px] border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#554dc0] focus:ring-2 focus:ring-[#554dc0]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-[#7c72ff] dark:focus:ring-[#7c72ff]/20"
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                  Password{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={
                      formRiderData.password
                    }
                    onChange={handleRiderChange}
                    placeholder="Minimum 6 characters"
                    autoComplete="new-password"
                    className="h-[46px] w-full rounded-[10px] border border-gray-300 bg-white pl-10 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#554dc0] focus:ring-2 focus:ring-[#554dc0]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-[#7c72ff] dark:focus:ring-[#7c72ff]/20"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-gray-400 transition hover:text-gray-700 focus:outline-none dark:text-neutral-500 dark:hover:text-neutral-200"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    title={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ================= RIGHT SIDE ================= */}

            <div className="space-y-5">
              <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-5 dark:border-neutral-800 dark:bg-neutral-950/60">
                {/* FACILITY HEADER */}

                <div className="mb-5 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#554dc0] dark:text-indigo-300" />

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-neutral-100">
                      Facility Location
                    </h3>

                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                      Select rider facility city
                    </p>
                  </div>
                </div>

                {/* FACILITY CITY */}

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
                    <MapPin className="h-4 w-4 text-gray-400 dark:text-neutral-500" />

                    Facility City

                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <Select
                    options={cityOptions}
                    value={selectedCity}
                    onChange={handleCityChange}
                    isSearchable
                    isClearable
                    placeholder="Search facility city"
                    styles={selectStyles}
                    noOptionsMessage={() =>
                      "No city found"
                    }
                  />

                  <p className="mt-2 text-xs text-gray-500 dark:text-neutral-500">
                    Search and select a city from
                    India.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= FOOTER ================= */}

          <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-6 py-5 dark:border-neutral-800 dark:bg-neutral-950/60 sm:flex-row sm:items-center sm:justify-end md:px-8">
            {/* RESET */}

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setFormRiderData(
                  initialFormData
                );

                setShowPassword(false);
              }}
              className="h-11 rounded-sm border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Reset
            </button>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-6 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Onboarding Rider...
                </>
              ) : (
                "Complete Onboarding"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TechBasedOnBoarding;