
// import axios from "axios";
// import { useState } from "react";
// import Select from "react-select";
// import { jwtDecode } from "jwt-decode";
// import { toast } from "react-toastify";

// const baseUrl = import.meta.env.VITE_BASE_URL;

// const options = [
//   { value: "Bangalore", label: "Bangalore" },
//   { value: "Delhi", label: "Delhi" },
//   { value: "Mumbai", label: "Mumbai" },
//   { value: "Kolkata", label: "Kolkata" },
//   { value: "Chennai", label: "Chennai" },
//   { value: "Hyderabad", label: "Hyderabad" },
//   { value: "Pune", label: "Pune" },
//   { value: "Ahmedabad", label: "Ahmedabad" },
//   { value: "Gurugram", label: "Gurugram" },
//   { value: "Noida", label: "Noida" },
//   { value: "Faridabad", label: "Faridabad" },
//   { value: "Ghaziabad", label: "Ghaziabad" },
//   { value: "Jaipur", label: "Jaipur" },
//   { value: "Lucknow", label: "Lucknow" },
//   { value: "Kanpur", label: "Kanpur" },
//   { value: "Nagpur", label: "Nagpur" },
//   { value: "Indore", label: "Indore" },
//   { value: "Bhopal", label: "Bhopal" },
//   { value: "Surat", label: "Surat" },
//   { value: "Vadodara", label: "Vadodara" },
//   { value: "Rajkot", label: "Rajkot" },
//   { value: "Nashik", label: "Nashik" },
//   { value: "Thane", label: "Thane" },
//   { value: "Vijayawada", label: "Vijayawada" },
//   { value: "Visakhapatnam", label: "Visakhapatnam" },
//   { value: "Coimbatore", label: "Coimbatore" },
//   { value: "Madurai", label: "Madurai" },
//   { value: "Kochi", label: "Kochi" },
//   { value: "Trivandrum", label: "Trivandrum" },
//   { value: "Kozhikode", label: "Kozhikode" },
//   { value: "Chandigarh", label: "Chandigarh" },
//   { value: "Mohali", label: "Mohali" },
//   { value: "Panchkula", label: "Panchkula" },
//   { value: "Patna", label: "Patna" },
//   { value: "Ranchi", label: "Ranchi" },
//   { value: "Jamshedpur", label: "Jamshedpur" },
//   { value: "Bhubaneswar", label: "Bhubaneswar" },
//   { value: "Cuttack", label: "Cuttack" },
//   { value: "Guwahati", label: "Guwahati" },
//   { value: "Shillong", label: "Shillong" },
//   { value: "Imphal", label: "Imphal" },
//   { value: "Aizawl", label: "Aizawl" },
//   { value: "Gangtok", label: "Gangtok" },
//   { value: "Dehradun", label: "Dehradun" },
//   { value: "Haridwar", label: "Haridwar" },
//   { value: "Rishikesh", label: "Rishikesh" },
//   { value: "Agra", label: "Agra" },
//   { value: "Varanasi", label: "Varanasi" },
//   { value: "Prayagraj", label: "Prayagraj" },
//   { value: "Meerut", label: "Meerut" },
//   { value: "Aligarh", label: "Aligarh" },
//   { value: "Moradabad", label: "Moradabad" },
//   { value: "Bareilly", label: "Bareilly" },
//   { value: "Jodhpur", label: "Jodhpur" },
//   { value: "Udaipur", label: "Udaipur" },
//   { value: "Kota", label: "Kota" },
//   { value: "Ajmer", label: "Ajmer" },
//   { value: "Amritsar", label: "Amritsar" },
//   { value: "Ludhiana", label: "Ludhiana" },
//   { value: "Jalandhar", label: "Jalandhar" },
//   { value: "Mangaluru", label: "Mangaluru" },
//   { value: "Mysuru", label: "Mysuru" },
//   { value: "Hubballi", label: "Hubballi" },
//   { value: "Belagavi", label: "Belagavi" },
//   { value: "Raipur", label: "Raipur" },
//   { value: "Bhilai", label: "Bhilai" },
//   { value: "Bilaspur", label: "Bilaspur" },
//   { value: "Jabalpur", label: "Jabalpur" },
//   { value: "Gwalior", label: "Gwalior" },
//   { value: "Tirupati", label: "Tirupati" },
//   { value: "Warangal", label: "Warangal" },
//   { value: "Nellore", label: "Nellore" },
//   { value: "Tirunelveli", label: "Tirunelveli" },
//   { value: "Salem", label: "Salem" },
//   { value: "Trichy", label: "Trichy" },
//   { value: "Allahabad", label: "Allahabad" },
//   { value: "Srinagar", label: "Srinagar" },
//   { value: "Jammu", label: "Jammu" },
//   { value: "Port Blair", label: "Port Blair" },
//   { value: "Panaji", label: "Panaji" },
//   { value: "Margao", label: "Margao" },
//   { value: "Puducherry", label: "Puducherry" },
// ];


// let decode;
// if (localStorage.getItem("token")) {
//   decode = jwtDecode(localStorage.getItem("token"));
// }
// const vendorId = decode?.id;


// function VendorRiderOnboarding() {
//   const [loading, setLoading] = useState(false);

//   const [formRiderData, setFormRiderData] = useState({
//     name: "",
//     email: "",
//     phone_number: "",
//     password: "",
//     facility_city: "",
//   });



//   const handleRiderChange = (e) => {
//     const { name, value, type, files } = e.target;
//     setFormRiderData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const ImportRiderSampleCSV = async (e) => {
//     e.preventDefault()
//     e.preventDefault();
//     const file = e.target.files[0];
//     const data = new FormData();
//     data.append('file',file)
//     try {
//       const res = await axios.post(`${baseUrl}/api/vendor/bulkOnboardRidersCSV`,data,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
      
//       toast.success("Sample file downloaded successfully");
//     } catch (err) {
//       toast.error("Error generateRiderSampleCSV ");
//     }
//   }
//   const generateRiderSampleCSV = async () => {

//     try {
//       const res = await axios.get(`${baseUrl}/api/vendor/generateRiderSampleCSV`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "Rider Onboarding Format.csv");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       toast.success("Sample file downloaded successfully");
//     } catch (err) {
//       toast.error("Error generateRiderSampleCSV ");
//     }
//   }

//   const handleRiderSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const data = new FormData();
//     for (const key in formRiderData) {
//       if (formRiderData[key] !== null && formRiderData[key] !== "") {
//         data.append(key, formRiderData[key]);
//       }
//     }



//     try {
//       const res = await axios.post(
//         `${baseUrl}/api/vendor/onboardRider`,
//         {
//           "name": formRiderData.name,
//           "email": formRiderData.email,
//           "phone_number": formRiderData.phone_number,
//           "password": formRiderData.password,
//           "facility_city": formRiderData.facility_city,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       toast.success("Rider onboarded successfully!");
//       setFormRiderData({
//         name: "",
//         email: "",
//         phone_number: "",
//         password: "",
//         facility_city: "",
//       });
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Error onboarding rider");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
      

//         <div className="bg-gray-100 min-h-screen w-full">
//           {/* Heading Strip */}
//           <div className="mb-6 flex flex-col md:flex-row justify-between bg-[#0446DB] py-6 shadow-md px-6">
//             <h1 className="text-2xl text-white">Rider Onboarding</h1>
            
//             <div >
//               <button
//               onClick={() => generateRiderSampleCSV()}
//               className="bg-white mt-2 mr-1  text-[#0446DB] font-medium  p-2 rounded-sm shadow hover:bg-indigo-100 transition"
//             >
//               Sample CSV
//             </button>
//               <input
//               type="file"
//               name="sample"
//               onChange={ImportRiderSampleCSV}
//               className="bg-white text-[#0446DB] font-medium p-2 rounded-sm shadow hover:bg-indigo-100 transition"
//             />
//             </div>


//           </div>

//           <div className="px-4   flex justify-center">
//             <form
//               onSubmit={handleRiderSubmit}
//                       className="
//                 bg-white rounded-sm
//                 w-full max-w-2xl 
//                 shadow-sm p-6 sm:p-8 
//                 space-y-3
//                 border border-gray-200 
                
//                 transition duration-300
//               "
//             >
//               <h1 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
//                 Rider Onboarding
//               </h1>

//               {/* Name */}
//               <div>
//                 <label className="block text-gray-700 font-medium ">Name*</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formRiderData.name}
//                   onChange={handleRiderChange}
//                   className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:ring-2 focus:ring-[#0446DB]"
//                   required
//                 />
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-gray-700 font-medium ">Email*</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formRiderData.email}
//                   onChange={handleRiderChange}
//                   className="w-full border border-gray-300 rounded-sm p-2"
//                   required
//                 />
//               </div>

//               {/* Phone Number */}
//               <div>
//                 <label className="block text-gray-700 font-medium mb-2">
//                   Phone Number*
//                 </label>
//                 <input
//                   type="text"
//                   name="phone_number"
//                   value={formRiderData.phone_number}
//                   onChange={handleRiderChange}
//                   className="w-full border border-gray-300 rounded-sm p-2"
//                   required
//                 />
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block text-gray-700 font-medium mb-2">
//                   Password*
//                 </label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={formRiderData.password}
//                   onChange={handleRiderChange}
//                   className="w-full border border-gray-300 rounded-sm p-2"
//                   required
//                 />
//               </div>

//               {/* Facility City */}
//               <div>
//                 <label className="block text-gray-700 font-medium mb-2">
//                   Facility City*
//                 </label>
//                 <Select
//                   required
//                   options={options}
//                   isSearchable
//                   value={options.find(
//                     (option) => option.value === formRiderData?.facility_city
//                   )}
//                   onChange={(selectedOption) =>
//                     setFormRiderData((prev) => ({
//                       ...prev,
//                       facility_city: selectedOption?.value || "",
//                     }))
//                   }
//                   placeholder="Select City"
//                 />
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 className="w-full bg-[#0446DB] hover:bg-indigo-800 text-white p-2 rounded-sm font-medium transition"
//               >
//                 Submit
//               </button>
//             </form>
//           </div>
//         </div>

//     </>
//   );
// }

// export default VendorRiderOnboarding;



import axios from "axios";
import { useMemo, useState } from "react";
import Select from "react-select";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { State, City } from "country-state-city";

const baseUrl = import.meta.env.VITE_BASE_URL;

/* =========================================================
   AUTH
========================================================= */

let decode;

if (localStorage.getItem("token")) {
  decode = jwtDecode(localStorage.getItem("token"));
}

const vendorId = decode?.id;

/* =========================================================
   COMPONENT
========================================================= */

function VendorRiderOnboarding() {
  const [loading, setLoading] = useState(false);

  // State is only used for filtering cities.
  // API payload remains unchanged.
  const [selectedState, setSelectedState] = useState(null);

  const [formRiderData, setFormRiderData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    facility_city: "",
  });

  /* =========================================================
     INDIA STATES
  ========================================================= */

  const stateOptions = useMemo(() => {
    return State.getStatesOfCountry("IN")
      .map((state) => ({
        value: state.isoCode,
        label: state.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  /* =========================================================
     CITIES OF SELECTED STATE
  ========================================================= */

  const cityOptions = useMemo(() => {
    if (!selectedState?.value) {
      return [];
    }

    const cities = City.getCitiesOfState(
      "IN",
      selectedState.value
    );

    /*
      Some datasets can contain duplicate city names.
      Map removes duplicate city names.
    */
    const uniqueCities = new Map();

    cities.forEach((city) => {
      if (!uniqueCities.has(city.name)) {
        uniqueCities.set(city.name, {
          value: city.name,
          label: city.name,
        });
      }
    });

    return Array.from(uniqueCities.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [selectedState]);

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
     BULK RIDER CSV IMPORT
  ========================================================= */

  const ImportRiderSampleCSV = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const data = new FormData();

    data.append("file", file);

    try {
      await axios.post(
        `${baseUrl}/api/vendor/bulkOnboardRidersCSV`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      toast.success("Riders imported successfully");

      // Allow selecting the same CSV again.
      e.target.value = "";
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          "Error importing rider CSV"
      );

      e.target.value = "";
    }
  };

  /* =========================================================
     DOWNLOAD SAMPLE CSV
  ========================================================= */

  const generateRiderSampleCSV = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/vendor/generateRiderSampleCSV`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },

          // Important for actual CSV download.
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        "Rider Onboarding Format.csv"
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Sample file downloaded successfully");
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          "Error downloading sample CSV"
      );
    }
  };

  /* =========================================================
     RIDER SUBMIT
  ========================================================= */

  const handleRiderSubmit = async (e) => {
    e.preventDefault();

    if (!formRiderData.name.trim()) {
      toast.error("Please enter rider name");
      return;
    }

    if (!formRiderData.email.trim()) {
      toast.error("Please enter rider email");
      return;
    }

    if (!formRiderData.phone_number.trim()) {
      toast.error("Please enter phone number");
      return;
    }

    if (!formRiderData.password) {
      toast.error("Please enter password");
      return;
    }

    if (!selectedState) {
      toast.error("Please select state");
      return;
    }

    if (!formRiderData.facility_city) {
      toast.error("Please select facility city");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${baseUrl}/api/vendor/onboardRider`,
        {
          name: formRiderData.name,
          email: formRiderData.email,
          phone_number: formRiderData.phone_number,
          password: formRiderData.password,
          facility_city: formRiderData.facility_city,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      toast.success("Rider onboarded successfully!");

      setFormRiderData({
        name: "",
        email: "",
        phone_number: "",
        password: "",
        facility_city: "",
      });

      setSelectedState(null);
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error onboarding rider"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     REACT SELECT STYLE
  ========================================================= */

  const selectStyles = {
    control: (provided, state) => ({
      ...provided,

      minHeight: "44px",

      borderRadius: "6px",

      borderColor: state.isFocused
        ? "#0446DB"
        : "#d1d5db",

      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(4,70,219,0.10)"
        : "none",

      "&:hover": {
        borderColor: "#0446DB",
      },
    }),

    valueContainer: (provided) => ({
      ...provided,
      paddingLeft: "12px",
    }),

    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
      fontSize: "14px",
    }),

    singleValue: (provided) => ({
      ...provided,
      fontSize: "14px",
    }),

    option: (provided, state) => ({
      ...provided,

      fontSize: "14px",

      cursor: "pointer",

      backgroundColor: state.isSelected
        ? "#0446DB"
        : state.isFocused
        ? "#eef4ff"
        : "white",

      color: state.isSelected
        ? "white"
        : "#374151",
    }),

    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <div className="min-h-screen w-full bg-[#F7F8FA] dark:bg-neutral-950">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className=" dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">

          {/* Heading */}

          <div>
            <div className="flex items-center gap-3">
             

              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Rider Onboarding
                </h1>

                <p className="mt-0.5 text-sm text-gray-500 dark:text-neutral-400">
                  Add new riders or upload riders using CSV
                </p>
              </div>
            </div>
          </div>

          {/* Header Actions */}

          <div className="flex flex-wrap items-center gap-2">

            <button
              type="button"
              onClick={generateRiderSampleCSV}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-sm border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition hover:border-[#0446DB]/40 hover:bg-[#0446DB]/5 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-[#0446DB]/10 dark:hover:text-blue-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />

                <polyline points="7 10 12 15 17 10" />

                <line
                  x1="12"
                  x2="12"
                  y1="15"
                  y2="3"
                />
              </svg>

              Sample CSV
            </button>

            {/* CSV Upload */}

            <label className="relative inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#0339B8]">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />

                <polyline points="17 8 12 3 7 8" />

                <line
                  x1="12"
                  x2="12"
                  y1="3"
                  y2="15"
                />
              </svg>

              Upload CSV

              <input
                type="file"
                name="sample"
                accept=".csv,text/csv"
                onChange={ImportRiderSampleCSV}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="mx-auto w-full max-w-5xl px-3 py-5 sm:px-5 lg:px-6">

        <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

          {/* Card Header */}

          <div className="border-b border-gray-200 px-5 py-4 dark:border-neutral-800 sm:px-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Rider Information
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Enter rider details to create a new rider
              account.
            </p>
          </div>

          {/* =================================================
              FORM
          ================================================== */}

          <form
            onSubmit={handleRiderSubmit}
            className="p-5 sm:p-6"
          >
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">

              {/* NAME */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                  Rider Name
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={formRiderData.name}
                  onChange={handleRiderChange}
                  placeholder="Enter rider name"
                  autoComplete="name"
                  className="h-11 w-full rounded-sm border border-gray-300 bg-white px-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
                  required
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                  Email Address
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="email"
                  name="email"
                  value={formRiderData.email}
                  onChange={handleRiderChange}
                  placeholder="rider@example.com"
                  autoComplete="email"
                  className="h-11 w-full rounded-sm border border-gray-300 bg-white px-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
                  required
                />
              </div>

              {/* PHONE */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                  Phone Number
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="tel"
                  name="phone_number"
                  value={formRiderData.phone_number}
                  onChange={handleRiderChange}
                  placeholder="Enter phone number"
                  autoComplete="tel"
                  className="h-11 w-full rounded-sm border border-gray-300 bg-white px-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
                  required
                />
              </div>

              {/* PASSWORD */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                  Password
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="password"
                  name="password"
                  value={formRiderData.password}
                  onChange={handleRiderChange}
                  placeholder="Enter password"
                  autoComplete="new-password"
                  className="h-11 w-full rounded-sm border border-gray-300 bg-white px-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
                  required
                />
              </div>

              {/* =================================================
                  STATE
              ================================================== */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                  State
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <Select
                  options={stateOptions}
                  value={selectedState}
                  isSearchable
                  isClearable
                  styles={selectStyles}
                  menuPortalTarget={
                    typeof document !== "undefined"
                      ? document.body
                      : null
                  }
                  menuPosition="fixed"
                  placeholder="Search state..."
                  noOptionsMessage={() =>
                    "No state found"
                  }
                  onChange={(option) => {
                    setSelectedState(option);

                    /*
                      Clear old city whenever state changes.
                    */
                    setFormRiderData((prev) => ({
                      ...prev,
                      facility_city: "",
                    }));
                  }}
                />

                <p className="mt-1.5 text-xs text-gray-400 dark:text-neutral-500">
                  Select an Indian state
                </p>
              </div>

              {/* =================================================
                  CITY
              ================================================== */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                  Facility City
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <Select
                  options={cityOptions}
                  isSearchable
                  isClearable
                  isDisabled={!selectedState}
                  styles={selectStyles}
                  menuPortalTarget={
                    typeof document !== "undefined"
                      ? document.body
                      : null
                  }
                  menuPosition="fixed"
                  value={
                    cityOptions.find(
                      (option) =>
                        option.value ===
                        formRiderData.facility_city
                    ) || null
                  }
                  placeholder={
                    selectedState
                      ? "Search facility city..."
                      : "Select state first"
                  }
                  noOptionsMessage={() =>
                    selectedState
                      ? "No city found"
                      : "Select state first"
                  }
                  onChange={(selectedOption) =>
                    setFormRiderData((prev) => ({
                      ...prev,

                      facility_city:
                        selectedOption?.value || "",
                    }))
                  }
                />

                <p className="mt-1.5 text-xs text-gray-400 dark:text-neutral-500">
                  {selectedState
                    ? `Showing cities of ${selectedState.label}`
                    : "Select state to load cities"}
                </p>
              </div>
            </div>

           

           

            {/* =================================================
                FOOTER
            ================================================== */}

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-end">

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setFormRiderData({
                    name: "",
                    email: "",
                    phone_number: "",
                    password: "",
                    facility_city: "",
                  });

                  setSelectedState(null);
                }}
                className="h-10 rounded-sm border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-10 min-w-[150px] items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#0339B8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && (
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
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
                )}

                {loading
                  ? "Onboarding..."
                  : "Onboard Rider"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VendorRiderOnboarding;