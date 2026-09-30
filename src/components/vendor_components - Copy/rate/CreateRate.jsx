// import axios from "axios";
// import { useEffect, useState } from "react";
// import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
// import toast from "react-hot-toast";

// const baseURL = import.meta.env.VITE_BASE_URL;

// export default function CreateRider() {
//   const [riders, setRiders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [formData, setFormData] = useState({
//     type: "",
//     rider: "",
//     rateType: "",
//     rate: "",
//     orderMode: ""
//   });

//   const rateValues = [
//     { value: "SDD", label: "Same Day Delivery" },
//     { value: "NDD", label: "Next Day Delivery" },
//     { value: "Turant", label: "Turant" },
//   ];

//   const rateTypeValues = [
//     { value: "perorder", label: "Per Order" },
//     { value: "perkms", label: "Per Kilometer" }
//   ];

//   useEffect(() => {
//     if (formData.type === "individual") {
//       fetchRiders();
//     }
//   }, [formData.type]);

//   const fetchRiders = async () => {
//     try {
//       setFetching(true);
//       const res = await axios.get(`${baseURL}/api/vendor/getRidersWithoutVendorRate`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setRiders(res.data.riders);
//     } catch (err) {
//       setError("Failed to fetch riders");
//     } finally {
//       setFetching(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));

//     if (name === "type") {
//       setFormData(prev => ({ ...prev, rider: "" }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//     //         const response = await axios.post(`${baseURL}/api/vendor/checkVendorRateExists`,
//     //     {
//     //       rate_for: formData.type,
//     //       rider_id: formData.rider
//     //     },
//     //     {

//     //       headers: {
//     //         Authorization: `Bearer ${localStorage.getItem("token")}`,
//     //       },

//     //     }
//     //   )
//     //   if(response.data.exists){
//     //     toast.error(response.data.message)
//     //     return
//     //   }
//       const submissionData = {
//         rate_for: formData.type,
//         ...(formData.type === "individual" && { riderId: formData.rider }),
//         rateType: formData.rateType,
//         rate: parseFloat(formData.rate),
//         orderMode: formData.orderMode,
//       };
//       const res = await axios.post(`${baseURL}/api/vendor/addVendorRate`,
//         {
//           "rate_for": submissionData.rate_for,
//           "rider_id": submissionData.riderId,
//           "rate_type": submissionData.rateType,
//           "rate": submissionData.rate,
//           "order_mode": submissionData.orderMode
//         }
//         , {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//       if (res.data.success) {
//         await new Promise(resolve => setTimeout(resolve, 1500));

//         setSuccess("Rider rate created successfully!");

//         setFormData({
//           type: "",
//           rider: "",
//           rateType: "",
//           rate: "",
//           orderMode: ""
//         });
//       }


//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to create rider rate");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isValidForm = () => {
//     if (!formData.type || !formData.rateType || !formData.rate || !formData.orderMode) {
//       return false;
//     }
//     if (formData.type === "individual" && !formData.rider) {
//       return false;
//     }
//     return true;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
//           <p className="mt-4 text-lg text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="">
//       <div className=" mx-auto">

//         <div className="mb-0 bg-[#0446DB] dark:bg-gray-900 py-[24px] shadow-md h-auto px-[24px]">
//           <div className="flex flex-wrap items-center justify-between">
//             {/* Heading */}
//             <h1 className="text-2xl text-white"> Rider Rate Management</h1>
//             <div className="flex flex-wrap items-end gap-4 text-white">
             

//             </div>
//           </div>
//         </div>
        
//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
//             <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
//             <p className="text-red-700">{error}</p>
//           </div>
//         )}

//         {success && (
//           <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
//             <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
//             <p className="text-green-700">{success}</p>
//           </div>
//         )}

//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Left Panel - Selection */}
//           <div className="bg-gray-100  rounded-sm p-6 md:p-8">
//             <div className="mb-8">
//               <h2 className="text-2xl font-bold text-gray-800 mb-2">
//                 Rate Configuration
//               </h2>
//               <p className="text-gray-600">Select the rider type and configure rates</p>
//             </div>

//             {/* Rider Type Selection */}
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Rate For
//                   <span className="text-red-500 ml-1">*</span>
//                 </label>
//                 <div className="relative">
//                   <select
//                     name="type"
//                     value={formData.type}
//                     onChange={handleChange}
//                     className="w-full p-2 pl-4 border border-gray-300 rounded-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
//                     required
//                   >
//                     <option value="">Select Rider Type</option>
//                     <option value="all">All Riders</option>
//                     <option value="individual">Individual Rider</option>
//                   </select>
//                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
//                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>

//               {/* Individual Rider Selection */}
//               {formData.type === "individual" && (
//                 <div className="animate-fadeIn">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Select Rider
//                     <span className="text-red-500 ml-1">*</span>
//                   </label>
//                   <div className="relative">
//                     {fetching ? (
//                       <div className="flex items-center justify-center p-4 border border-gray-300 rounded-xl">
//                         <Loader2 className="w-5 h-5 animate-spin text-blue-600 mr-2" />
//                         <span className="text-gray-600">Loading riders...</span>
//                       </div>
//                     ) : (
//                       <>
//                         <select
//                           name="rider"
//                           value={formData.rider}
//                           onChange={handleChange}
//                           className="w-full p-2 pl-4 border border-gray-300 rounded-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
//                           required
//                         >
//                           <option value="">Select a Rider</option>
//                           {riders.map((rider) => (
//                             <option key={rider.id} value={rider.id}>
//                               {rider.name} ({rider.id})
//                             </option>
//                           ))}
//                         </select>
//                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
//                           <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                           </svg>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                   {riders.length > 0 && (
//                     <p className="mt-2 text-sm text-gray-500">
//                       {riders.length} riders available
//                     </p>
//                   )}
//                 </div>
//               )}

              
//             </div>
//           </div>

//           {/* Right Panel - Form */}
//           <div className="bg-gray-100 rounded-sm p-6 md:p-8">
//             <div className="mb-8">
//               <h2 className="text-2xl font-bold text-gray-800 mb-2">
//                 Rate Details
//               </h2>
//               <p className="text-gray-600">Fill in the rate information below</p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Rate Type */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Rate Type
//                   <span className="text-red-500 ml-1">*</span>
//                 </label>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   {rateTypeValues.map((rt) => (
//                     <button
//                       key={rt.value}
//                       type="button"
//                       onClick={() => handleChange({ target: { name: "rateType", value: rt.value } })}
//                       className={`p-2 border rounded-sm text-left transition-all duration-200 ${formData.rateType === rt.value
//                         ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
//                         : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
//                         }`}
//                     >
//                       <div className="font-medium text-gray-800">{rt.label}</div>
//                       {/* <div className="text-sm text-gray-500 mt-1">{rt.value}</div> */}
//                     </button>
//                   ))}
//                 </div>
//                 <input
//                   type="hidden"
//                   name="rateType"
//                   value={formData.rateType}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Rate Amount */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Rate Amount
//                   <span className="text-red-500 ml-1">*</span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="number"
//                     name="rate"
//                     value={formData.rate}
//                     onChange={handleChange}
//                     step="0.01"
//                     min="0"
//                     placeholder="Enter rate amount"
//                     className="w-full p-2 pl-4 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                     required
//                   />
//                   <div className="absolute inset-y-0 right-0 flex items-center pr-4">
//                     <span className="text-gray-500">₹</span>
//                   </div>
//                 </div>
//                 <p className="mt-2 text-sm text-gray-500">
//                   {formData.rateType === "perorder"
//                     ? "Amount per order"
//                     : formData.rateType === "perkms"
//                       ? "Amount per kilometer"
//                       : "Enter the rate amount"}
//                 </p>
//               </div>

//               {/* Order Mode */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Order Mode
//                   <span className="text-red-500 ml-1">*</span>
//                 </label>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

//                   {formData.rateType == 'perorder' && (
                   
//                       rateValues.map((mode) => (
//                         <>

//                           <button
//                             key={mode.value}
//                             type="button"
//                             onClick={() => handleChange({ target: { name: "orderMode", value: mode.value } })}
//                             className={`p-2 border rounded-sm text-left transition-all duration-200 ${formData.orderMode === mode.value
//                               ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
//                               : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
//                               }`}
//                           >
//                             <div className="font-medium text-gray-800">{mode.label}</div>
//                             {/* <div className="text-sm text-gray-500">{mode.value}</div> */}
//                           </button>

//                         </>


//                       ))
                    
//                   )}
//                   {formData.rateType === 'perkms' && (
//                     <button
//                       type="button"
//                       onClick={() => handleChange({ target: { name: "orderMode", value: "Turant" } })}
//                       className={`p-2 border rounded-sm text-left transition-all duration-200 ${formData.orderMode === "Turant"
//                         ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
//                         : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
//                         }`}
//                     >
//                       <div className="font-medium text-gray-800">Turant</div>
//                       {/* <div className="text-sm text-gray-500">turant</div> */}
//                     </button>
//                   )}
//                 </div>
//                 <input
//                   type="hidden"
//                   name="orderMode"
//                   value={formData.orderMode}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

             

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={!isValidForm() || loading}
//                 className={`w-full py-2 px-6 rounded-sm font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-3 ${isValidForm() && !loading
//                   ? "bg-[rgb(86,78,193)] text-white shadow-lg hover:shadow-xl"
//                   : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                   }`}
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                     Creating Rate...
//                   </>
//                 ) : (
//                   "Create Rider Rate"
//                 )}
//               </button>



//             </form>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }




import axios from "axios";
import { useEffect, useState } from "react";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Users,
  User,
  IndianRupee,
  Bike,
  ChevronDown,
  Settings2,
  PackageCheck,
  MapPinned,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_BASE_URL;

export default function CreateRider() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    type: "",
    rider: "",
    rateType: "",
    rate: "",
    orderMode: "",
  });

  const rateValues = [
    {
      value: "SDD",
      label: "Same Day Delivery",
      description: "Delivery on the same day",
    },
    {
      value: "NDD",
      label: "Next Day Delivery",
      description: "Delivery on the next day",
    },
    {
      value: "Turant",
      label: "Turant",
      description: "Instant delivery",
    },
  ];

  const rateTypeValues = [
    {
      value: "perorder",
      label: "Per Order",
      description: "Fixed amount for every order",
    },
    {
      value: "perkms",
      label: "Per Kilometer",
      description: "Amount based on distance",
    },
  ];

  /* =========================================================
     FETCH RIDERS
  ========================================================= */

  useEffect(() => {
    if (formData.type === "individual") {
      fetchRiders();
    }
  }, [formData.type]);

  const fetchRiders = async () => {
    try {
      setFetching(true);

      const res = await axios.get(
        `${baseURL}/api/vendor/getRidersWithoutVendorRate`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      setRiders(res.data.riders);
    } catch (err) {
      setError("Failed to fetch riders");
    } finally {
      setFetching(false);
    }
  };

  /* =========================================================
     HANDLE CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        rider: "",
      }));
    }
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const submissionData = {
        rate_for: formData.type,

        ...(formData.type === "individual" && {
          riderId: formData.rider,
        }),

        rateType: formData.rateType,
        rate: parseFloat(formData.rate),
        orderMode: formData.orderMode,
      };

      const res = await axios.post(
        `${baseURL}/api/vendor/addVendorRate`,
        {
          rate_for: submissionData.rate_for,
          rider_id: submissionData.riderId,
          rate_type: submissionData.rateType,
          rate: submissionData.rate,
          order_mode: submissionData.orderMode,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      if (res.data.success) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1500)
        );

        setSuccess(
          "Rider rate created successfully!"
        );

        toast.success(
          "Rider rate created successfully!"
        );

        setFormData({
          type: "",
          rider: "",
          rateType: "",
          rate: "",
          orderMode: "",
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create rider rate"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     VALIDATION
  ========================================================= */

  const isValidForm = () => {
    if (
      !formData.type ||
      !formData.rateType ||
      !formData.rate ||
      !formData.orderMode
    ) {
      return false;
    }

    if (
      formData.type === "individual" &&
      !formData.rider
    ) {
      return false;
    }

    return true;
  };

  /* =========================================================
     LOADER
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <Loader2 className="h-6 w-6 animate-spin text-[#0446DB]" />
          </div>

          <p className="mt-3 text-sm font-medium text-neutral-700 dark:text-neutral-200">
            Creating rider rate...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className=" dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <div className="flex items-center gap-2">
            

              <h1 className="text-xl font-semibold dark:text-white">
                Rider Rate Management
              </h1>
            </div>

            <p className="mt-1 text-sm  dark:text-neutral-400">
              Configure delivery rates for all or
              individual riders
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          PAGE
      ====================================================== */}

      <div className="mx-auto  px-3 py-5 sm:px-5 lg:px-6">

        {/* ===================================================
            ALERTS
        ==================================================== */}

        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-sm border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/30">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                Unable to create rate
              </p>

              <p className="mt-0.5 text-xs text-red-600 dark:text-red-400/80">
                {error}
              </p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-start gap-3 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />

            <div>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Rate created
              </p>

              <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400/80">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* ===================================================
            MAIN CARD
        ==================================================== */}

        <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

          {/* CARD HEADER */}

          <div className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-blue-50 text-[#0446DB] dark:bg-blue-950/40 dark:text-blue-400">
                <IndianRupee className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Create Rider Rate
                </h2>

                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  Select rider scope and configure the
                  applicable delivery rate.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">

              {/* =================================================
                  LEFT SECTION
              ================================================== */}

              <div className="border-b border-neutral-200 p-5 dark:border-neutral-800 lg:border-b-0 lg:border-r sm:p-6">

                {/* SECTION HEADER */}

                <div className="mb-5">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#0446DB]" />

                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Rate Assignment
                    </h3>
                  </div>

                  <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                    Choose whether this rate applies to
                    every rider or a specific rider.
                  </p>
                </div>

                {/* =============================================
                    RATE FOR
                ============================================== */}

                <div>
                  <label className="mb-2 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Rate For
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">

                    {/* ALL RIDERS */}

                    <button
                      type="button"
                      onClick={() =>
                        handleChange({
                          target: {
                            name: "type",
                            value: "all",
                          },
                        })
                      }
                      className={`relative flex items-start gap-3 rounded-sm border p-4 text-left transition ${
                        formData.type === "all"
                          ? "border-[#0446DB] bg-blue-50/70 ring-1 ring-[#0446DB]/10 dark:bg-blue-950/20"
                          : "border-neutral-200 bg-white hover:border-blue-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm ${
                          formData.type === "all"
                            ? "bg-[#0446DB] text-white"
                            : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800"
                        }`}
                      >
                        <Users className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          All Riders
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
                          Apply to every rider
                        </p>
                      </div>

                      {formData.type === "all" && (
                        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#0446DB] text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </button>

                    {/* INDIVIDUAL */}

                    <button
                      type="button"
                      onClick={() =>
                        handleChange({
                          target: {
                            name: "type",
                            value: "individual",
                          },
                        })
                      }
                      className={`relative flex items-start gap-3 rounded-sm border p-4 text-left transition ${
                        formData.type === "individual"
                          ? "border-[#0446DB] bg-blue-50/70 ring-1 ring-[#0446DB]/10 dark:bg-blue-950/20"
                          : "border-neutral-200 bg-white hover:border-blue-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm ${
                          formData.type ===
                          "individual"
                            ? "bg-[#0446DB] text-white"
                            : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800"
                        }`}
                      >
                        <User className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          Individual
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
                          Select a specific rider
                        </p>
                      </div>

                      {formData.type ===
                        "individual" && (
                        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#0446DB] text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </button>
                  </div>

                  {/* hidden value */}

                  <input
                    type="hidden"
                    name="type"
                    value={formData.type}
                    required
                  />
                </div>

                {/* =============================================
                    INDIVIDUAL RIDER
                ============================================== */}

                {formData.type === "individual" && (
                  <div className="mt-5">
                    <label className="mb-2 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Select Rider
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    {fetching ? (
                      <div className="flex h-11 items-center justify-center gap-2 rounded-sm border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                        <Loader2 className="h-4 w-4 animate-spin text-[#0446DB]" />

                        <span className="text-xs text-neutral-500">
                          Loading riders...
                        </span>
                      </div>
                    ) : (
                      <div className="relative">
                        <select
                          name="rider"
                          value={formData.rider}
                          onChange={handleChange}
                          required
                          className="h-11 w-full appearance-none rounded-sm border border-neutral-300 bg-white px-3 pr-10 text-sm text-neutral-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                        >
                          <option value="">
                            Select a Rider
                          </option>

                          {riders.map((rider) => (
                            <option
                              key={rider.id}
                              value={rider.id}
                            >
                              {rider.name} ({rider.id})
                            </option>
                          ))}
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                      </div>
                    )}

                    {!fetching &&
                      riders.length > 0 && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                          {riders.length} riders available
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* =================================================
                  RIGHT SECTION
              ================================================== */}

              <div className="p-5 sm:p-6">

                <div className="mb-5">
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-[#0446DB]" />

                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Rate Configuration
                    </h3>
                  </div>

                  <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                    Configure how the rider will be paid
                    for deliveries.
                  </p>
                </div>

                {/* =============================================
                    RATE TYPE
                ============================================== */}

                <div>
                  <label className="mb-2 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Rate Type
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {rateTypeValues.map((rt) => {
                      const selected =
                        formData.rateType === rt.value;

                      return (
                        <button
                          key={rt.value}
                          type="button"
                          onClick={() =>
                            handleChange({
                              target: {
                                name: "rateType",
                                value: rt.value,
                              },
                            })
                          }
                          className={`relative rounded-sm border p-3.5 text-left transition ${
                            selected
                              ? "border-[#0446DB] bg-blue-50/70 ring-1 ring-[#0446DB]/10 dark:bg-blue-950/20"
                              : "border-neutral-200 hover:border-blue-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm ${
                                selected
                                  ? "bg-[#0446DB] text-white"
                                  : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800"
                              }`}
                            >
                              {rt.value ===
                              "perorder" ? (
                                <PackageCheck className="h-4 w-4" />
                              ) : (
                                <MapPinned className="h-4 w-4" />
                              )}
                            </div>

                            <div>
                              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                {rt.label}
                              </p>

                              <p className="mt-0.5 text-[11px] leading-4 text-neutral-500">
                                {rt.description}
                              </p>
                            </div>
                          </div>

                          {selected && (
                            <CheckCircle className="absolute right-2.5 top-2.5 h-4 w-4 text-[#0446DB]" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <input
                    type="hidden"
                    name="rateType"
                    value={formData.rateType}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* =============================================
                    RATE
                ============================================== */}

                <div className="mt-5">
                  <label className="mb-2 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Rate Amount
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center border-r border-neutral-200 text-neutral-500 dark:border-neutral-700">
                      <IndianRupee className="h-4 w-4" />
                    </div>

                    <input
                      type="number"
                      name="rate"
                      value={formData.rate}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      required
                      className="h-11 w-full rounded-sm border border-neutral-300 bg-white pl-14 pr-4 text-sm font-medium text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    />
                  </div>

                  <p className="mt-1.5 text-xs text-neutral-500">
                    {formData.rateType === "perorder"
                      ? "Amount paid for each completed order."
                      : formData.rateType === "perkms"
                        ? "Amount paid for each kilometer."
                        : "Select a rate type and enter the amount."}
                  </p>
                </div>

                {/* =============================================
                    ORDER MODE
                ============================================== */}

                <div className="mt-5">
                  <label className="mb-2 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Order Mode
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  {!formData.rateType ? (
                    <div className="rounded-sm border border-dashed border-neutral-300 bg-neutral-50 px-4 py-5 text-center dark:border-neutral-700 dark:bg-neutral-800/50">
                      <Bike className="mx-auto h-5 w-5 text-neutral-400" />

                      <p className="mt-2 text-xs text-neutral-500">
                        Select a rate type first to view
                        available order modes.
                      </p>
                    </div>
                  ) : (
                    <div
                      className={`grid gap-2.5 ${
                        formData.rateType ===
                        "perorder"
                          ? "grid-cols-1 sm:grid-cols-3"
                          : "grid-cols-1"
                      }`}
                    >
                      {formData.rateType ===
                        "perorder" &&
                        rateValues.map((mode) => {
                          const selected =
                            formData.orderMode ===
                            mode.value;

                          return (
                            <button
                              key={mode.value}
                              type="button"
                              onClick={() =>
                                handleChange({
                                  target: {
                                    name: "orderMode",
                                    value:
                                      mode.value,
                                  },
                                })
                              }
                              className={`relative rounded-sm border px-3 py-3 text-left transition ${
                                selected
                                  ? "border-[#0446DB] bg-blue-50 text-[#0446DB] ring-1 ring-[#0446DB]/10 dark:bg-blue-950/20"
                                  : "border-neutral-200 text-neutral-700 hover:border-blue-300 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                              }`}
                            >
                              <p className="text-xs font-semibold">
                                {mode.label}
                              </p>

                              {selected && (
                                <Check className="absolute right-2 top-2 h-3.5 w-3.5" />
                              )}
                            </button>
                          );
                        })}

                      {formData.rateType ===
                        "perkms" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleChange({
                              target: {
                                name: "orderMode",
                                value: "Turant",
                              },
                            })
                          }
                          className={`relative rounded-sm border px-4 py-3 text-left transition ${
                            formData.orderMode ===
                            "Turant"
                              ? "border-[#0446DB] bg-blue-50 text-[#0446DB] ring-1 ring-[#0446DB]/10 dark:bg-blue-950/20"
                              : "border-neutral-200 text-neutral-700 hover:border-blue-300 dark:border-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Bike className="h-4 w-4" />

                            <span className="text-sm font-medium">
                              Turant
                            </span>
                          </div>

                          {formData.orderMode ===
                            "Turant" && (
                            <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0446DB]" />
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  <input
                    type="hidden"
                    name="orderMode"
                    value={formData.orderMode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                FOOTER
            ================================================== */}

            <div className="flex flex-col gap-3 border-t border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center sm:justify-between sm:px-6">

              {/* SUMMARY */}

              <div className="text-xs text-neutral-500">
                {isValidForm() ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Configuration is ready
                  </span>
                ) : (
                  <span>
                    Complete all required fields to
                    continue.
                  </span>
                )}
              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={!isValidForm() || loading}
                className={`inline-flex h-10 min-w-[170px] items-center justify-center gap-2 rounded-sm px-5 text-sm font-medium transition ${
                  isValidForm() && !loading
                    ? "bg-[#0446DB] text-white shadow-sm hover:bg-[#0339B8]"
                    : "cursor-not-allowed bg-neutral-200 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <IndianRupee className="h-4 w-4" />
                    Create Rider Rate
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}