
// import { useCallback, useEffect, useState } from "react";

// import axios from "axios";

// import Select from "react-select";

// import { AlertCircleIcon, BadgeCheckIcon, CheckIcon, Loader2 } from "lucide-react"

// import { TbFileInfo } from "react-icons/tb";

// import { FaRegFileImage } from "react-icons/fa6";

// import { toast } from "react-toastify";

// import { Button } from "@/components/ui/button"

// import {

//   Drawer,

//   DrawerClose,

//   DrawerContent,

//   DrawerFooter,

//   DrawerHeader,

//   DrawerTitle,

//   DrawerTrigger,

// } from "@/components/ui/drawer"

// import { Calendar } from "@/components/ui/calendar"

// import { Field, FieldLabel } from "@/components/ui/field"

// import {

//   Popover,

//   PopoverContent,

//   PopoverTrigger,

// } from "@/components/ui/popover"

// import { FaFilter } from "react-icons/fa";

// const baseURL = import.meta.env.VITE_BASE_URL;

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

// function VendorAllRiders() {

//   const [open, setOpen] = useState(false)

//   const [endopen, setEndOpen] = useState(false)

//   const [ridersData, setRidersData] = useState([]);

//   const [loading, setLoading] = useState(false);

//   const [popup, setPopup] = useState(null);

//   const [changePasswordPopup, setChangePasswordPopup] = useState(null);

//   const [newPassword, setNewPassword] = useState({

//     id: "",

//     password: "",

//     confirmPassword: "",

//   });

//   const [isEditing, setIsEditing] = useState(false);

//   const [formData, setFormData] = useState(null);

//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   const [advanceFilters, setAdvanceFilters] = useState({

//     rider_id: "",

//     facility_city: "",

//     facility_zone: "",

//     start_date: "",

//     end_date: "",

//   });

//   const [filterUpdate, setFilterUpdate] = useState(false);

//   const resetAdvanceFilters = () => {

//     setAdvanceFilters({

//       rider_id: "",

//       facility_city: "",

//       facility_zone: "",

//     });

//   };

//   const handleChange = (e) => {

//     const { name, value, files } = e.target;

//     if (e.target.type === "file") {

//       setFormData({ ...formData, [name]: files[0] });

//     } else {

//       setFormData({ ...formData, [name]: value });

//     }

//   };

//   //Change

//   const handleSave = async () => {

//     setLoading(true);

//     try {

//       const data = new FormData();

//       for (const key in formData) {

//         data.append(key, formData[key]);

//       }

//       await axios.post(

//         `${baseURL}/api/vendor/updateRiderProfile/${formData.id}`,

//         data,

//         {

//           headers: {

//             Authorization: `Bearer ${localStorage.getItem("token")}`,

//             "Content-Type": "multipart/form-data",

//           },

//         }

//       );

//       setIsEditing(false);

//       setPopup(null);

//       fetchRiders();

//     } catch (err) {

//       toast.error(err.response?.data?.message || err.message || "Error saving data");

//     } finally {

//       setLoading(false);

//     }

//   };

//   const fetchRiders = useCallback(async () => {

//     setLoading(true);

//     try {

//       const res = await axios.get(`${baseURL}/api/vendor/getVendorRiders`, {

//         params: {

//           rider_id: advanceFilters?.rider_id,

//           facility_city: advanceFilters?.facility_city,

//           facility_zone: advanceFilters?.facility_zone,

//           start_date: advanceFilters?.start_date,

//           end_date: advanceFilters?.end_date,

//         },

//         headers: {

//           Authorization: `Bearer ${localStorage.getItem("token")}`,

//         },

//       });

//       setRidersData(res.data.data);

//     } catch (err) {

//       toast.error(err.response?.data?.message || err.message || "Error fetching riders");

//     } finally {

//       setLoading(false);

//     }

//   }, [advanceFilters, baseURL]);

//   const changeVerificationStatus = async (id, status) => {

//     setLoading(true);

//     try {

//       await axios.post(

//         `${baseURL}/api/vendor/markRiderVerified/${id}`,

//         {

//           account_status: status,

//         },

//         {

//           headers: {

//             Authorization: `Bearer ${localStorage.getItem("token")}`,

//           },

//         }

//       );

//       fetchRiders();

//     } catch (err) {

//       toast.error(err.response?.data?.message || err.message || "Error while changing status");

//     } finally {

//       setLoading(false);

//     }

//   };

//   const changeActiveStatus = async (id, status) => {

//     setLoading(true);

//     try {

//       await axios.post(

//         `${baseURL}/api/vendor/markRiderActive/${id}`,

//         {

//           is_active: status,

//         },

//         {

//           headers: {

//             Authorization: `Bearer ${localStorage.getItem("token")}`,

//           },

//         }

//       );

//       fetchRiders();

//     } catch (err) {

//       toast.error(err.response?.data?.message || err.message || "Error while changing status");

//     } finally {

//       setLoading(false);

//     }

//   };

//   const changeAvailabilityStatus = async (id, status) => {

//     setLoading(true);

//     try {

//       await axios.post(

//         `${baseURL}/api/vendor/markRiderAvailable/${id}`,

//         {

//           is_available: status,

//         },

//         {

//           headers: {

//             Authorization: `Bearer ${localStorage.getItem("token")}`,

//           },

//         }

//       );

//       fetchRiders();

//     } catch (err) {

//       toast.error(err.response?.data?.message || err.message || "Error while changing status");

//     } finally {

//       setLoading(false);

//     }

//   };

//   const handlePasswordChange = () => {

//     setLoading(true);

//     try {

//       const res = axios.post(

//         `${baseURL}/api/vendor/changeRiderPassword/${newPassword.id}`,

//         {

//           password: newPassword.password,

//           confirmPassword: newPassword.confirmPassword,

//         },

//         {

//           headers: {

//             Authorization: `Bearer ${localStorage.getItem("token")}`,

//           },

//         }

//       );

//       setChangePasswordPopup(null);

//       setNewPassword({

//         id: "",

//         password: "",

//         newPassword: "",

//       });

//       toast.success("Password Changed successfully");

//     } catch (err) {

//       toast.error(err.response?.data?.message || err.message || "Error in updating password");

//     } finally {

//       setLoading(false);

//     }

//   };

//   const verifyKyc = async () => {

//     setLoading(true);

//     try {

//       const data = new FormData();

//       // for (const key in formData) {

//       //   data.append(key, formData[key]);

//       //   if (data.get("kyc_verified") === "0") {

//       //   }

//       // }

//       data.set("kyc_verified", "1");









//       const res = await axios.post(

//         `${baseURL}/api/vendor/updateRiderProfile/${formData.id}`,

//         data,

//         {

//           headers: {

//             Authorization: `Bearer ${localStorage.getItem("token")}`,

//             "Content-Type": "multipart/form-data",

//           },

//         }

//       );





//       setIsEditing(false);

//       setPopup(null);

//       fetchRiders();

//     } catch (err) {

//       toast.error(err.response?.data?.message || err.message || "Error saving data");

//     } finally {

//       setLoading(false);

//     }

//   }

//   const formatToDMY = (dateStr) => {

//     if (!dateStr) return "";

//     const date = new Date(dateStr);

//     const dd = String(date.getDate()).padStart(2, "0");

//     const mm = String(date.getMonth() + 1).padStart(2, "0");

//     const yyyy = date.getFullYear();

//     return `${dd}/${mm}/${yyyy}`;

//   };





//   useEffect(() => {

//     fetchRiders();

//   }, []);

//   useEffect(() => {

//     if (popup) {

//       setFormData({ ...popup });

//     }

//   }, [popup]);

//   useEffect(() => {

//     if (filterUpdate) {

//       fetchRiders();

//       setFilterUpdate(false);

//     }

//   }, [filterUpdate]);


//       const [loadingPage, setLoadingPage] = useState(true);

// useEffect(() => {
//   const timer = setTimeout(() => {
//     setLoadingPage(false);
//   }, 2000);

//   return () => clearTimeout(timer);
// }, []);

//   return (

//     <>
//     {
//       loadingPage ?(
//          <div className=" w-full h-[90vh] flex justify-center items-center">
//           <div>
//             <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//             <p className="mt-2">Loading Rider Details...</p>
//           </div>
//         </div>
//       ):(

//       <div className="min-h-screen w-full bg-[#F6F8FC] text-gray-900 dark:bg-neutral-950 dark:text-white">



//         {/* Heading Strip */}

//         <div className=" px-4 py-5  dark:border-neutral-800 dark:bg-neutral-900 sm:px-6 lg:px-8">

//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

//             {/* Heading */}

//             <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">Rider Details</h1>

//             <div className="flex flex-wrap items-center gap-2">

//               <Drawer direction="right"

//                 open={isFilterOpen}

//                 onOpenChange={setIsFilterOpen}

//               >

//                 <DrawerTrigger asChild>

//                   <Button variant="outline"

//                     className="h-10 gap-2 rounded-sm border-gray-200 bg-white px-4 text-sm font-semibold text-[#0446DB] shadow-sm hover:border-[#0446DB]/30 hover:bg-[#0446DB]/5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-blue-400 dark:hover:bg-[#0446DB]/10"

//                   >

//                     <FaFilter className="text-sm" />

//                     <span>Filter</span>

//                   </Button>

//                 </DrawerTrigger>

//                 <DrawerContent>

//                   <DrawerHeader>

//                     <DrawerTitle>Advance Filters</DrawerTitle>

//                     {/* <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}

//                   </DrawerHeader>

//                   <form

//                     onSubmit={(e) => {

//                       e.preventDefault();





//                       setFilterUpdate((prev) => !prev);

//                       setIsFilterOpen(false); // Drawer Close

//                     }}

//                   >

//                     <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-2">

//                       <div className="w-full py-3">

//                         <div className="flex flex-col gap-4">

//                           {/* Rider ID */}

//                           <Field className="mx-auto w-full">

//                             <FieldLabel htmlFor="enddate">Start Date</FieldLabel>

//                             <Popover open={open} onOpenChange={setOpen}>

//                               <PopoverTrigger asChild>

//                                 <Button

//                                   variant="outline"

//                                   id="enddate"

//                                   className="justify-start w-full font-normal"

//                                 >

//                                   {advanceFilters.start_date ? formatToDMY(advanceFilters.start_date) : "Select date"}

//                                 </Button>

//                               </PopoverTrigger>

//                               <PopoverContent className="w-auto overflow-hidden p-0" align="start">

//                                 <Calendar

//                                   mode="single"

//                                   selected={advanceFilters.start_date}

//                                   defaultMonth={advanceFilters.start_date}

//                                   captionLayout="dropdown"

//                                   onSelect={(date) => {

//                                     const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)

//                                       .toString()

//                                       .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;

//                                     setAdvanceFilters({

//                                       ...advanceFilters,

//                                       start_date: formattedDate

//                                     })

//                                     setOpen(false)

//                                   }}

//                                 />

//                               </PopoverContent>

//                             </Popover>

//                           </Field>

//                           <Field className="mx-auto w-full">

//                             <FieldLabel htmlFor="enddate">End Date</FieldLabel>

//                             <Popover open={endopen} onOpenChange={setEndOpen}>

//                               <PopoverTrigger asChild>

//                                 <Button

//                                   variant="outline"

//                                   id="enddate"

//                                   className="justify-start w-full font-normal"

//                                 >

//                                   {advanceFilters.end_date ? formatToDMY(advanceFilters.end_date) : "Select date"}

//                                 </Button>

//                               </PopoverTrigger>

//                               <PopoverContent className="w-auto overflow-hidden p-0" align="start">

//                                 <Calendar

//                                   mode="single"

//                                   selected={advanceFilters.end_date}

//                                   defaultMonth={advanceFilters.end_date}

//                                   captionLayout="dropdown"

//                                   onSelect={(date) => {

//                                     const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)

//                                       .toString()

//                                       .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;

//                                     setAdvanceFilters({

//                                       ...advanceFilters,

//                                       end_date: formattedDate

//                                     })

//                                     setEndOpen(false)

//                                   }}

//                                 />

//                               </PopoverContent>

//                             </Popover>

//                           </Field>

//                           <div className=" w-full">

//                             <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">

//                               Rider ID

//                             </label>

//                             <input

//                               type="text"

//                               value={advanceFilters.rider_id}

//                               onChange={(e) =>

//                                 setAdvanceFilters((prev) => ({

//                                   ...prev,

//                                   rider_id: e.target.value,

//                                 }))

//                               }

//                               placeholder="Enter Id(s)"

//                               className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"

//                             />

//                           </div>

//                           {/* Facility City */}

//                           <div className=" w-full">

//                             <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">

//                               Facility City

//                             </label>

//                             <Select

//                               required

//                               options={options}

//                               isSearchable

//                               value={options.find(

//                                 (option) => option.value === advanceFilters?.facility_city

//                               )}

//                               onChange={(selectedOption) =>

//                                 setAdvanceFilters((prev) => ({

//                                   ...prev,

//                                   facility_city: selectedOption?.value || "",

//                                 }))

//                               }

//                               placeholder="Select City"

//                               className="w-full rounded-sm text-sm dark:text-black"

//                             />

//                           </div>

//                           {/* Facility Zone */}

//                           <div className=" w-full">

//                             <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">

//                               Facility Zone

//                             </label>

//                             <input

//                               type="text"

//                               value={advanceFilters.facility_zone}

//                               onChange={(e) =>

//                                 setAdvanceFilters((prev) => ({

//                                   ...prev,

//                                   facility_zone: e.target.value,

//                                 }))

//                               }

//                               placeholder="Enter Facility Zone"

//                               className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"

//                             />

//                           </div>

//                           {/* Update Button */}

//                           <div className="w-full flex gap-2 pt-2">

//                             <button

//                               onClick={() => {

//                                 setFilterUpdate(true);

//                                 setIsFilterOpen(false);

//                               }}

//                               className="h-10 w-1/2 rounded-sm bg-[#0446DB] px-4 text-sm font-semibold text-white transition hover:bg-[#0339B5]"

//                             >

//                               Filter

//                             </button>

//                             <button

//                               onClick={() => {

//                                 resetAdvanceFilters();

//                                 setFilterUpdate(true);

//                                 setIsFilterOpen(false);

//                               }}

//                               className="h-10 w-1/2 rounded-sm bg-[#0446DB] px-4 text-sm font-semibold text-white transition hover:bg-[#0339B5]"

//                             >

//                               Reset

//                             </button>

//                           </div>

//                         </div>

//                       </div>

//                     </div>

//                   </form>

//                   <DrawerFooter>

//                     <DrawerClose asChild>

//                       <Button variant="outline">Cancel</Button>

//                     </DrawerClose>

//                   </DrawerFooter>

//                 </DrawerContent>

//               </Drawer>





//             </div>

//           </div>

//         </div>

//         {/* Main Content */}

//         <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

//           <div className="w-full overflow-x-auto">

//             <table className="min-w-[1050px] w-full border-collapse text-left">

//               <thead className="border-b border-gray-200 bg-gray-50/80 text-center text-gray-500 dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-400">

//                 <tr>

//                   <th className="whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider">RIDER ID</th>

//                   <th className="whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider">RIDER NAME</th>

//                   <th className="whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider">ACCOUNT STATUS</th>

//                   <th className="whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider">ACTIVE</th>

//                   <th className="whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider">AVAILABLE</th>

//                   <th className="whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider">RIDER DOCUMENT</th>

//                   <th className="whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider">CHANGE PASSWORD</th>

//                 </tr>

//               </thead>

//               <tbody className="divide-y divide-gray-100 text-gray-700 dark:divide-neutral-800 dark:text-neutral-300">

//                 {

//                   loading ? (

//                     <>

//                       <tr key={"No record found"}>

//                         <td

//                           colSpan="6"

//                           className="text-center px-6 py-6 text-gray-500"

//                         >

//                           <div className=" w-full  flex justify-center items-center">

//                             <div>

//                               <Loader2 className="h-8 w-8 animate-spin mx-auto" />

//                               <p className="mt-2">Loading Remittance Record...</p>

//                             </div>

//                           </div>

//                         </td>

//                       </tr>

//                     </>

//                   ) : ridersData.length == 0 ? (

//                     <>

//                       <tr key={"No record found"}>

//                         <td

//                           colSpan="6"

//                           className="text-center px-6 py-6 text-gray-500"

//                         >

//                           No records found.

//                         </td>

//                       </tr>

//                     </>

//                   ) : (

//                     ridersData.map((rider) => (

//                       <tr

//                         key={rider.id}

//                         className="text-center transition-colors duration-200 hover:bg-gray-50/80 dark:hover:bg-neutral-800/50"

//                       >

//                         <td className="px-6 py-4">

//                           FP_{rider.vendor_id}_{rider.id}

//                         </td>

//                         <td className="px-6 py-4">{rider.name}</td>

//                         <td className="">

//                           <button

//                             onClick={() => {

//                               changeVerificationStatus(

//                                 rider.id,

//                                 rider.account_status == 1 ? 0 : 1

//                               );

//                             }}

//                             className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-200 ${rider.account_status ? "bg-green-500" : "bg-gray-300"

//                               }`}

//                           >

//                             <span

//                               className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${rider.account_status

//                                 ? "translate-x-6 sm:translate-x-7"

//                                 : "translate-x-1"

//                                 }`}

//                             />

//                           </button>

//                         </td>

//                         <td className="">

//                           <button

//                             onClick={() => {

//                               if (rider.account_status) {

//                                 changeActiveStatus(

//                                   rider.id,

//                                   rider.is_active == 1 ? 0 : 1

//                                 );

//                               }

//                             }}

//                             className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-200 ${rider.is_active ? "bg-green-500" : "bg-gray-300"

//                               }`}

//                           >

//                             <span

//                               className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${rider.is_active

//                                 ? "translate-x-6 sm:translate-x-7"

//                                 : "translate-x-1"

//                                 }`}

//                             />

//                           </button>

//                         </td>

//                         <td className="">

//                           <button

//                             onClick={() => {

//                               if (rider.account_status && rider.is_active) {

//                                 changeAvailabilityStatus(

//                                   rider.id,

//                                   rider.is_available == 1 ? 0 : 1

//                                 );

//                               }

//                             }}

//                             className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-200 ${rider.is_available ? "bg-green-500" : "bg-gray-300"

//                               }`}

//                           >

//                             <span

//                               className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${rider.is_available

//                                 ? "translate-x-6 sm:translate-x-7"

//                                 : "translate-x-1"

//                                 }`}

//                             />

//                           </button>

//                         </td>

//                         <td

//                           className="text-xl text-[#0446DB] hover:cursor-pointer hover:text-[#0339B5] dark:text-blue-400"

//                           onClick={() => {

//                             setPopup(rider);

//                           }}

//                         >

//                           <TbFileInfo />

//                         </td>

//                         <td>

//                           <button

//                             className="rounded-sm border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0446DB] transition hover:cursor-pointer hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"

//                             onClick={() => {

//                               setNewPassword({

//                                 id: rider.id,

//                               });

//                               setChangePasswordPopup(rider);

//                             }}

//                           >

//                             Change Password

//                           </button>

//                         </td>

//                       </tr>

//                     ))

//                   )

//                 }

//               </tbody>

//             </table>

//           </div>

//         </div>

//         {popup && (

//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] backdrop-blur-[2px]">

//             <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-sm border border-gray-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">

//               <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">

//                 <h2 className="text-lg font-semibold text-gray-900 dark:text-white">

//                   Rider Details

//                 </h2>

//               </div>





//               <form

//                 onSubmit={(e) => {

//                   e.preventDefault();

//                   handleSave();

//                 }}

//                 className="max-h-[calc(92vh-72px)] space-y-5 overflow-y-auto bg-white px-6 py-5 dark:bg-neutral-900"

//               >

//                 {/* Basic Info */}

//                 <section>

//                   <h3 className="mb-4 border-b border-gray-200 pb-2 text-sm font-semibold uppercase tracking-wide text-[#0446DB] dark:border-neutral-800 dark:text-blue-400">

//                     Basic Details

//                   </h3>

//                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

//                     <div>

//                       <strong>ID:</strong> FP_{popup.vendor_id}_{popup.id}

//                     </div>

//                     <div>

//                       <strong>Account Status:</strong>{" "}

//                       {popup.account_status ? (

//                         <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">

//                           Active

//                         </span>

//                       ) : (

//                         <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">

//                           Not Active

//                         </span>

//                       )}

//                     </div>

//                     <div>

//                       <strong>Active:</strong>{" "}

//                       {popup.is_active ? (

//                         <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">

//                           Active

//                         </span>

//                       ) : (

//                         <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">

//                           Not Active

//                         </span>

//                       )}

//                     </div>

//                     <div>

//                       <strong>Availability:</strong>{" "}

//                       {popup.is_available ? (

//                         <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">

//                           Available

//                         </span>

//                       ) : (

//                         <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">

//                           Not Available

//                         </span>

//                       )}

//                     </div>

//                     <div>

//                       <strong>KYC:</strong>{" "}

//                       {popup?.kyc_verified === '1' ? (

//                         <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">

//                           KYC Verified

//                         </span>

//                       ) : (

//                         <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">

//                           KYC Not Verified

//                         </span>

//                       )}

//                     </div>

//                     <div>

//                     </div>

//                     <div>

//                       <strong>Rider Name:</strong>

//                       <input

//                         name="name"

//                         value={formData?.name || ""}

//                         onChange={handleChange}

//                         disabled={!isEditing}

//                         placeholder={formData?.name || "NA"}

//                         className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

//                           }`}

//                       />

//                     </div>

//                     <div>

//                       <strong>Address:</strong>

//                       <input

//                         name="address_line"

//                         value={formData?.address_line || ""}

//                         onChange={handleChange}

//                         disabled={!isEditing}

//                         placeholder={formData?.address_line || "NA"}

//                         className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

//                           }`}

//                       />

//                     </div>

//                     <div>

//                       <strong>City:</strong>

//                       <input

//                         name="city"

//                         value={formData?.city || ""}

//                         onChange={handleChange}

//                         disabled={!isEditing}

//                         placeholder={formData?.city || "NA"}

//                         className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

//                           }`}

//                       />

//                     </div>

//                     <div>

//                       <strong>State:</strong>

//                       <input

//                         name="state"

//                         value={formData?.state || ""}

//                         onChange={handleChange}

//                         disabled={!isEditing}

//                         placeholder={formData?.state || "NA"}

//                         className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

//                           }`}

//                       />

//                     </div>

//                     <div>

//                       <strong>Pincode:</strong>

//                       <input

//                         name="pincode"

//                         value={formData?.pincode || ""}

//                         onChange={handleChange}

//                         disabled={!isEditing}

//                         placeholder={formData?.pincode || "NA"}

//                         className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

//                           }`}

//                       />

//                     </div>

//                     <div>

//                       <strong>Facility City:</strong>

//                       <Select

//                         isDisabled={!isEditing}

//                         required

//                         options={options}

//                         isSearchable

//                         value={options.find(

//                           (option) => option.value === formData?.facility_city

//                         )}

//                         onChange={(selectedOption) =>

//                           setFormData((prev) => ({

//                             ...prev,

//                             facility_city: selectedOption?.value || "",

//                           }))

//                         }

//                         placeholder={formData?.facility_city || "NA"}

//                         className="border rounded-md text-sm w-[100%]"

//                       />

//                     </div>

//                     <div>

//                       <strong>Facility Zone:</strong>

//                       <input

//                         name="facility_zone"

//                         value={formData?.facility_zone || ""}

//                         onChange={handleChange}

//                         disabled={!isEditing}

//                         placeholder={formData?.facility_zone || "NA"}

//                         className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

//                           }`}

//                       />

//                     </div>

//                     <div>

//                       <strong>Phone No:</strong>

//                       <input

//                         name="phone"

//                         value={formData?.phone || ""}

//                         onChange={handleChange}

//                         disabled={!isEditing}

//                         placeholder={formData?.phone || "NA"}

//                         className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

//                           }`}

//                       />

//                     </div>

//                     <div>

//                       <strong>Email:</strong>

//                       <input

//                         name="email"

//                         value={formData?.email || ""}

//                         onChange={handleChange}

//                         disabled={!isEditing}

//                         placeholder={formData?.email || "NA"}

//                         className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

//                           }`}

//                       />

//                     </div>

//                   </div>

//                 </section>

//                 {/* Document Info */}

//                 <section className="rounded-sm border border-gray-200 bg-gray-50/40 p-4 dark:border-neutral-800 dark:bg-neutral-800/30">

//                   <h3 className="mb-4 border-b border-gray-200 pb-2 text-sm font-semibold uppercase tracking-wide text-[#0446DB] dark:border-neutral-800 dark:text-blue-400">

//                     KYC Details

//                   </h3>

//                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

//                     <div>

//                       <strong>Type:</strong> {popup.document_type || "N/A"}

//                     </div>

//                     <div>

//                       <strong>ID:</strong> {popup.document_id}

//                     </div>

//                     <div>

//                       <strong>File:</strong>{" "}

//                       {/* ""popup.document_image"" */}

//                       {popup.document_image ? (

//                         <div>

//                           <div>

//                             <a

//                               href={`${baseURL}/${popup.document_image}`}

//                               target="_blank"

//                               rel="noopener noreferrer"

//                               className="font-medium text-[#0446DB] hover:underline dark:text-blue-400"

//                             >

//                               <FaRegFileImage className="inline text-xl" />

//                             </a>

//                           </div>

//                           <div>

//                             {

//                               popup?.kyc_verified === "0" ? (

//                                 <button

//                                   type="button"

//                                   onClick={() => verifyKyc()}

//                                   className="bg-red-500 text-white flex items-center gap-1 px-12 py-2 mt-6 rounded"><BadgeCheckIcon />Verify KYC</button>

//                               ) : (

//                                 <button type="button" className="bg-green-500/20 w-full text-green-800 flex items-center justify-center gap-1 px-12 py-2 mt-6 rounded"><BadgeCheckIcon /> KYC Verified</button>

//                               )

//                             }

//                           </div>

//                         </div>

//                       ) : (

//                         <span className="text-gray-400 text-sm cursor-not-allowed">

//                           <FaRegFileImage className="inline text-xl mr-1" />

//                           No Image Available

//                         </span>

//                       )}

//                     </div>

//                   </div>

//                 </section>

//                 {/* Bank Info */}

//                 <section className="rounded-sm border border-gray-200 bg-gray-50/40 p-4 dark:border-neutral-800 dark:bg-neutral-800/30">

//                   <h3 className="mb-4 border-b border-gray-200 pb-2 text-sm font-semibold uppercase tracking-wide text-[#0446DB] dark:border-neutral-800 dark:text-blue-400">

//                     Bank Details

//                   </h3>

//                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

//                     <div>

//                       <strong>Bank Name:</strong>

//                       <input

//                         name="bank_name"

//                         value={formData?.bank_name || ""}

//                         onChange={handleChange}

//                         disabled={!isEditing}

//                         placeholder={formData?.bank_name || "NA"}

//                         className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

//                           }`}

//                       />

//                     </div>

//                     <div>

//                       <strong>Account No:</strong>

//                       <input

//                         name="bank_account_number"

//                         value={formData?.bank_account_number || ""}

//                         onChange={handleChange}

//                         disabled={!isEditing}

//                         placeholder={formData?.bank_account_number || "NA"}

//                         className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

//                           }`}

//                       />

//                     </div>

//                   </div>

//                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

//                     {/* Branch Field */}

//                     <div className="flex flex-col">

//                       <strong>Branch:</strong>

//                       <input

//                         name="bank_branch"

//                         value={formData?.bank_branch || ""}

//                         onChange={handleChange}

//                         disabled={!isEditing}

//                         placeholder={formData?.bank_branch || "NA"}

//                         className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

//                           }`}

//                       />

//                     </div>

//                     {/* IFSC Field */}

//                     <div className="flex flex-col">

//                       <strong>IFSC Code:</strong>

//                       <input

//                         name="bank_ifsc_code"

//                         value={formData?.bank_ifsc_code || ""}

//                         onChange={handleChange}

//                         disabled={!isEditing}

//                         placeholder={formData?.bank_ifsc_code || "NA"}

//                         className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

//                           }`}

//                       />

//                     </div>

//                     {/* Cheque Image Field */}

//                     {!isEditing ? (

//                       <div className="flex flex-col">

//                         <strong>Cheque Image:</strong>

//                         {popup.cheque_image ? (

//                           <a

//                             href={`${baseURL}/${popup.cheque_image}`}

//                             target="_blank"

//                             rel="noopener noreferrer"

//                             className="font-medium text-[#0446DB] hover:underline dark:text-blue-400 text-sm"

//                           >

//                             <FaRegFileImage className="inline text-xl mr-1" />

//                             View Image

//                           </a>

//                         ) : (

//                           <span className="text-gray-400 text-sm cursor-not-allowed">

//                             <FaRegFileImage className="inline text-xl mr-1" />

//                             No Image Available

//                           </span>

//                         )}

//                       </div>

//                     ) : (

//                       <div className="flex flex-col">

//                         <strong>Upload Cheque Image:</strong>

//                         <input

//                           type="file"

//                           name="cheque_image"

//                           onChange={handleChange}

//                           disabled={!isEditing}

//                           accept="image/\,application/pdf"

//                           className="h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60"

//                         />

//                       </div>

//                     )}

//                   </div>

//                 </section>

//                 {/* Footer Buttons */}

//                 <div className="rounded-sm border border-gray-200 bg-gray-50/40 p-4 dark:border-neutral-800 dark:bg-neutral-800/30 text-right space-x-3">

//                   {isEditing ? (

//                     <>

//                       <button

//                         type="submit"

//                         className="rounded-sm bg-[#0446DB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0339B5]"

//                       >

//                         Save

//                       </button>

//                       <button

//                         type="button"

//                         onClick={() => {

//                           setFormData(popup);

//                           setIsEditing(false);

//                         }}

//                         className="rounded-sm border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"

//                       >

//                         Cancel

//                       </button>

//                     </>

//                   ) : (

//                     <button

//                       type="button"

//                       onClick={() => {

//                         setIsEditing(true);

//                         setFormData(popup);

//                       }}

//                       className="rounded-sm bg-[#0446DB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0339B5]"

//                     >

//                       Edit

//                     </button>

//                   )}

//                   <button

//                     type="button"

//                     onClick={() => {

//                       setPopup(null);

//                       setFormData(null);

//                       setIsEditing(false);

//                     }}

//                     className="rounded-sm border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"

//                   >

//                     Close

//                   </button>

//                 </div>

//               </form>

//             </div>

//           </div>

//         )}

//         {changePasswordPopup && (

//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">

//             <div className="w-full max-w-xl overflow-hidden rounded-sm border border-gray-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">

//               {/* Header */}

//               <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">

//                 <h2 className="text-lg font-semibold text-gray-900 dark:text-white">

//                   Change Password

//                 </h2>

//               </div>

//               {/* Form */}

//               <form

//                 onSubmit={(e) => {

//                   e.preventDefault();

//                   handlePasswordChange();

//                 }}

//                 className="space-y-5 bg-white px-6 py-5 dark:bg-neutral-900"

//               >

//                 {/* User Info */}

//                 <div className="grid grid-cols-1 gap-4 text-sm text-gray-700 sm:grid-cols-2 dark:text-neutral-300">

//                   <div>

//                     <label className="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-neutral-300">ID:</label>

//                     <p className="rounded-sm border border-gray-200 bg-gray-50 p-2.5 dark:border-neutral-700 dark:bg-neutral-800">

//                       {changePasswordPopup.id}

//                     </p>

//                   </div>

//                   <div>

//                     <label className="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-neutral-300">

//                       Rider Name:

//                     </label>

//                     <p className="rounded-sm border border-gray-200 bg-gray-50 p-2.5 dark:border-neutral-700 dark:bg-neutral-800">

//                       {changePasswordPopup.name}

//                     </p>

//                   </div>

//                 </div>

//                 {/* Password Inputs */}

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

//                   <div>

//                     <label className="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-neutral-300">

//                       New Password

//                     </label>

//                     <input

//                       type="password"

//                       name="password"

//                       value={newPassword.password}

//                       onChange={(e) =>

//                         setNewPassword({

//                           ...newPassword,

//                           password: e.target.value,

//                         })

//                       }

//                       required

//                       className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"

//                     />

//                   </div>

//                   <div>

//                     <label className="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-neutral-300">

//                       Confirm Password

//                     </label>

//                     <input

//                       type="password"

//                       name="confirmPassword"

//                       value={newPassword.confirmPassword}

//                       onChange={(e) =>

//                         setNewPassword({

//                           ...newPassword,

//                           confirmPassword: e.target.value,

//                         })

//                       }

//                       required

//                       className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"

//                     />

//                   </div>

//                 </div>

//                 {/* Action Buttons */}

//                 <div className="flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-neutral-800">

//                   <button

//                     type="submit"

//                     className="rounded-sm bg-[#0446DB] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0339B5]"

//                   >

//                     Submit

//                   </button>

//                   <button

//                     type="button"

//                     onClick={() => {

//                       setChangePasswordPopup(null);

//                       setNewPassword(null);

//                     }}

//                     className="rounded-sm border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"

//                   >

//                     Close

//                   </button>

//                 </div>

//               </form>

//             </div>

//           </div>

//         )}

//       </div>
//       )
//     }


//     </>

//   );

// }

// export default VendorAllRiders;




import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { toast } from "react-toastify";
import {
  BadgeCheck, CheckCircle2, ChevronLeft, ChevronRight, Eye, FileImage,
  Filter, KeyRound, Loader2, MapPin, Pencil, RefreshCw, Search,
  ShieldCheck, UserRound, Users, X, XCircle,
} from "lucide-react";

// Existing vendor-rider endpoints are preserved from your JSX component.
const API = `${import.meta.env.VITE_BASE_URL ?? ""}/api/vendor`;

interface Rider {
  id: number;
  vendor_id: number;
  name: string;
  account_status: number | string | boolean;
  is_active: number | string | boolean;
  is_available: number | string | boolean;
  kyc_verified?: number | string | boolean | null;
  address_line?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | number | null;
  facility_city?: string | null;
  facility_zone?: string | null;
  phone?: string | null;
  email?: string | null;
  document_type?: string | null;
  document_id?: string | null;
  document_image?: string | null;
  bank_name?: string | null;
  bank_account_number?: string | null;
  bank_branch?: string | null;
  bank_ifsc_code?: string | null;
  cheque_image?: string | null;
}

type RiderField =
  | "name" | "address_line" | "city" | "state" | "pincode"
  | "facility_city" | "facility_zone" | "phone" | "email"
  | "bank_name" | "bank_account_number" | "bank_branch" | "bank_ifsc_code";

type RiderForm = Partial<Record<RiderField, string>> & { cheque_image?: File | null };
interface Filters {
  rider_id: string;
  facility_city: string;
  facility_zone: string;
  start_date: string;
  end_date: string;
}
interface ApiResponse<T> { success?: boolean; message?: string; data?: T }

const EMPTY_FILTERS: Filters = { rider_id: "", facility_city: "", facility_zone: "", start_date: "", end_date: "" };
const CITIES = [
  "Ahmedabad", "Amritsar", "Bangalore", "Bhopal", "Bhubaneswar", "Chandigarh", "Chennai",
  "Coimbatore", "Delhi", "Faridabad", "Ghaziabad", "Gurugram", "Guwahati", "Hyderabad",
  "Indore", "Jaipur", "Jalandhar", "Kanpur", "Kochi", "Kolkata", "Lucknow",
  "Ludhiana", "Mumbai", "Nagpur", "Noida", "Patna", "Pune", "Surat", "Thane", "Vadodara",
];
const bool = (value: unknown) => value === true || value === 1 || value === "1";
const valueText = (value: unknown) => value === null || value === undefined || value === "" ? "—" : String(value);
const errorMessage = (error: unknown) => {
  if (axios.isAxiosError<{ message?: string }>(error)) return error.response?.data?.message || error.message;
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
};
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
});
const documentUrl = (path?: string | null): string | null => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const root = String(import.meta.env.VITE_BASE_URL ?? "").replace(/\/$/, "");
  return `${root}/${path.replace(/^\//, "")}`;
};
const toForm = (rider: Rider): RiderForm => ({
  name: rider.name ?? "", address_line: rider.address_line ?? "", city: rider.city ?? "",
  state: rider.state ?? "", pincode: String(rider.pincode ?? ""), facility_city: rider.facility_city ?? "",
  facility_zone: rider.facility_zone ?? "", phone: rider.phone ?? "", email: rider.email ?? "",
  bank_name: rider.bank_name ?? "", bank_account_number: rider.bank_account_number ?? "",
  bank_branch: rider.bank_branch ?? "", bank_ifsc_code: rider.bank_ifsc_code ?? "", cheque_image: null,
});
const inputClass = "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0446db] focus:ring-2 focus:ring-[#0446db]/10 disabled:bg-slate-100 disabled:text-slate-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/50";
const ghostButton = "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200";
const primaryButton = "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0446db] px-4 text-sm font-semibold text-white transition hover:bg-[#0338b3] disabled:opacity-50";

function StatusPill({ active, onLabel, offLabel }: { active: boolean; onLabel: string; offLabel: string }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${active ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-300"}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`} />
    {active ? onLabel : offLabel}
  </span>;
}

function Toggle({ checked, disabled, onClick, label }: { checked: boolean; disabled?: boolean; onClick: () => void; label: string }) {
  return <button type="button" role="switch" aria-label={label} aria-checked={checked} disabled={disabled} onClick={onClick}
    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-40 ${checked ? "bg-[#0446db]" : "bg-slate-300 dark:bg-neutral-600"}`}>
    <span className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
  </button>;
}

function FieldInput({ label, name, value, disabled, onChange }: {
  label: string; name: RiderField; value: string; disabled: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return <label className="block min-w-0 space-y-1.5">
    <span className="text-xs font-semibold text-slate-600 dark:text-neutral-300">{label}</span>
    <input name={name} value={value} disabled={disabled} onChange={onChange} className={inputClass} />
  </label>;
}

export default function VendorAllRiders(): React.JSX.Element {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<Filters>({ ...EMPTY_FILTERS });
  const [filters, setFilters] = useState<Filters>({ ...EMPTY_FILTERS });
  const [selected, setSelected] = useState<Rider | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<RiderForm>({});
  const [passwordRider, setPasswordRider] = useState<Rider | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const fetchRiders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<ApiResponse<Rider[]>>(`${API}/getVendorRiders`, {
        ...authConfig(), params: Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== "")),
      });
      if (data.success === false) throw new Error(data.message || "Could not fetch riders");
      setRiders(Array.isArray(data.data) ? data.data : []);
    } catch (error: unknown) {
      toast.error(errorMessage(error));
      setRiders([]);
    } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { void fetchRiders(); }, [fetchRiders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return riders;
    return riders.filter(r => [r.id, r.vendor_id, r.name, r.phone, r.email, r.facility_city, r.facility_zone,
      `FP_${r.vendor_id}_${r.id}`].some(v => String(v ?? "").toLowerCase().includes(q)));
  }, [riders, search]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const verifiedCount = riders.filter(r => bool(r.account_status)).length;
  const activeCount = riders.filter(r => bool(r.is_active)).length;
  const availableCount = riders.filter(r => bool(r.is_available)).length;

  const setRiderFlag = async (rider: Rider, field: "account_status" | "is_active" | "is_available") => {
    if (field === "is_active" && !bool(rider.account_status)) return toast.warn("Verify the rider account before changing active status.");
    if (field === "is_available" && (!bool(rider.account_status) || !bool(rider.is_active))) return toast.warn("Rider must be verified and active before changing availability.");
    const next = bool(rider[field]) ? 0 : 1;
    const routes = {
      account_status: { path: "markRiderVerified", property: "account_status" },
      is_active: { path: "markRiderActive", property: "is_active" },
      is_available: { path: "markRiderAvailable", property: "is_available" },
    };
    const route = routes[field];
    setBusyId(rider.id);
    try {
      const { data } = await axios.post<ApiResponse<unknown>>(`${API}/${route.path}/${rider.id}`, { [route.property]: next }, authConfig());
      if (data.success === false) throw new Error(data.message || "Unable to update rider");
      toast.success(data.message || "Rider status updated successfully.");
      await fetchRiders();
    } catch (error: unknown) { toast.error(errorMessage(error)); }
    finally { setBusyId(null); }
  };

  const openDetails = (rider: Rider) => { setSelected(rider); setForm(toForm(rider)); setEditing(false); };
  const closeDetails = () => { if (saving) return; setSelected(null); setEditing(false); setForm({}); };
  const changeField = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected || !editing || saving) return;
    setSaving(true);
    try {
      const body = new FormData();
      for (const [key, value] of Object.entries(form)) {
        if (value instanceof File) body.append(key, value);
        else if (typeof value === "string") body.append(key, value);
      }
      const { data } = await axios.post<ApiResponse<unknown>>(`${API}/updateRiderProfile/${selected.id}`, body, authConfig());
      if (data.success === false) throw new Error(data.message || "Could not update rider profile");
      toast.success(data.message || "Rider profile updated successfully.");
      setEditing(false); setSelected(null);
      await fetchRiders();
    } catch (error: unknown) { toast.error(errorMessage(error)); }
    finally { setSaving(false); }
  };

  const verifyKyc = async () => {
    if (!selected || saving || bool(selected.kyc_verified)) return;
    if (!window.confirm(`Verify KYC for ${selected.name}?`)) return;
    setSaving(true);
    try {
      const body = new FormData();
      body.set("kyc_verified", "1");
      const { data } = await axios.post<ApiResponse<unknown>>(`${API}/updateRiderProfile/${selected.id}`, body, authConfig());
      if (data.success === false) throw new Error(data.message || "KYC verification failed");
      toast.success(data.message || "Rider KYC verified successfully.");
      setSelected(prev => prev ? { ...prev, kyc_verified: "1" } : prev);
      await fetchRiders();
    } catch (error: unknown) { toast.error(errorMessage(error)); }
    finally { setSaving(false); }
  };

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!passwordRider || saving) return;
    if (!password || password !== confirmPassword) return toast.warn("Passwords must match and cannot be empty.");
    setSaving(true);
    try {
      const { data } = await axios.post<ApiResponse<unknown>>(`${API}/changeRiderPassword/${passwordRider.id}`,
        { password, confirmPassword }, authConfig());
      if (data.success === false) throw new Error(data.message || "Password update failed");
      toast.success(data.message || "Password changed successfully.");
      setPasswordRider(null); setPassword(""); setConfirmPassword("");
    } catch (error: unknown) { toast.error(errorMessage(error)); }
    finally { setSaving(false); }
  };


  

  return <div className="flex h-[calc(100dvh-100px)] min-h-[520px] flex-col gap-4 overflow-hidden bg-[#f6f8fc]  text-slate-900 dark:bg-neutral-950 dark:text-white ">
    <div className="flex shrink-0 flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2"><h1 className="text-xl font-bold tracking-tight sm:text-2xl">Riders</h1></div>
        <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">Manage rider accounts, availability, documents and KYC.</p>
      </div>
      <div className="flex gap-2">
        <button className={ghostButton} onClick={() => setFilterOpen(true)}><Filter size={16} /> Filters {Object.values(filters).some(Boolean) && <span className="h-2 w-2 rounded-full bg-[#eb8300]" />}</button>
        <button className={ghostButton} onClick={() => void fetchRiders()} disabled={loading}><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh</button>
      </div>
    </div>



    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-slate-100 p-3 dark:border-neutral-800 sm:p-4">
        <div className="relative w-full max-w-sm"><Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input className={`${inputClass} pl-9`} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by rider, ID, city, phone..." />
        </div>
        <span className="text-xs text-slate-500">{filtered.length} riders found</span>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500 dark:bg-neutral-800 dark:text-neutral-400"><tr>
            <th className="px-4 py-3">Rider</th><th className="px-4 py-3">Location</th><th className="px-4 py-3 text-center">Account</th>
            <th className="px-4 py-3 text-center">Active</th><th className="px-4 py-3 text-center">Available</th>
            <th className="px-4 py-3 text-center">KYC</th><th className="px-4 py-3 text-right">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
            {loading ? <tr><td colSpan={7} className="py-16 text-center"><Loader2 className="mx-auto mb-2 animate-spin text-[#0446db]" /> Loading riders...</td></tr>
            : visible.length === 0 ? <tr><td colSpan={7} className="py-16 text-center text-slate-500">No riders found. Try adjusting your filters.</td></tr>
            : visible.map(rider => <tr key={rider.id} className="transition hover:bg-slate-50 dark:hover:bg-neutral-800/50">
              <td className="px-4 py-3"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 font-bold text-[#0446db] dark:bg-[#0446db]/20">{(rider.name || "R").charAt(0).toUpperCase()}</span><div><p className="font-semibold">{rider.name}</p><p className="text-xs text-slate-500">FP_{rider.vendor_id}_{rider.id}</p></div></div></td>
              <td className="px-4 py-3"><p>{valueText(rider.facility_city)}</p><p className="text-xs text-slate-500">{valueText(rider.facility_zone)}</p></td>
              <td className="px-4 py-3 text-center"><Toggle label={`Verify account for ${rider.name}`} checked={bool(rider.account_status)} disabled={busyId !== null} onClick={() => void setRiderFlag(rider, "account_status")} /></td>
              <td className="px-4 py-3 text-center"><Toggle label={`Toggle active status for ${rider.name}`} checked={bool(rider.is_active)} disabled={busyId !== null || !bool(rider.account_status)} onClick={() => void setRiderFlag(rider, "is_active")} /></td>
              <td className="px-4 py-3 text-center"><Toggle label={`Toggle availability for ${rider.name}`} checked={bool(rider.is_available)} disabled={busyId !== null || !bool(rider.account_status) || !bool(rider.is_active)} onClick={() => void setRiderFlag(rider, "is_available")} /></td>
              <td className="px-4 py-3 text-center"><StatusPill active={bool(rider.kyc_verified)} onLabel="Verified" offLabel="Pending" /></td>
              <td className="px-4 py-3"><div className="flex justify-end gap-2"><button className={ghostButton} onClick={() => openDetails(rider)} title="View and edit rider"><Eye size={16} /> Details</button><button className={ghostButton} onClick={() => { setPasswordRider(rider); setPassword(""); setConfirmPassword(""); }} title="Change password"><KeyRound size={16} /></button></div></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 p-3 text-xs text-slate-500 dark:border-neutral-800 sm:px-4">
        <span>Showing {filtered.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
        <div className="flex items-center gap-2"><button className={ghostButton} disabled={currentPage <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}><ChevronLeft size={16} /> Prev</button><span className="tabular-nums">{currentPage} / {pages}</span><button className={ghostButton} disabled={currentPage >= pages} onClick={() => setPage(p => Math.min(pages, p + 1))}>Next <ChevronRight size={16} /></button></div>
      </div>
    </div>

    {/* Original shadcn right-side filter Drawer preserved. */}
    <Drawer direction="right" open={filterOpen} onOpenChange={setFilterOpen}>
      <DrawerContent className="flex h-full max-h-screen w-full flex-col sm:max-w-md dark:bg-neutral-900">
        <DrawerHeader className="shrink-0 border-b border-slate-200 dark:border-neutral-800">
          <DrawerTitle>Advance Filters</DrawerTitle>
          <p className="text-xs text-slate-500">Filter riders by date, ID, city and zone.</p>
        </DrawerHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setFilters({ ...draftFilters });
            setPage(1);
            setFilterOpen(false);
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-slate-600 dark:text-neutral-300">Start Date</span>
              <input type="date" value={draftFilters.start_date} onChange={(e) => setDraftFilters((prev) => ({ ...prev, start_date: e.target.value }))} className={inputClass} />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-slate-600 dark:text-neutral-300">End Date</span>
              <input type="date" value={draftFilters.end_date} onChange={(e) => setDraftFilters((prev) => ({ ...prev, end_date: e.target.value }))} className={inputClass} />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-slate-600 dark:text-neutral-300">Rider ID</span>
              <input type="text" value={draftFilters.rider_id} onChange={(e) => setDraftFilters((prev) => ({ ...prev, rider_id: e.target.value }))} className={inputClass} placeholder="Enter ID(s)" />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-slate-600 dark:text-neutral-300">Facility City</span>
              <input list="rider-cities" value={draftFilters.facility_city} onChange={(e) => setDraftFilters((prev) => ({ ...prev, facility_city: e.target.value }))} className={inputClass} placeholder="Select city" />
              <datalist id="rider-cities">{CITIES.map((city) => <option key={city} value={city} />)}</datalist>
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-slate-600 dark:text-neutral-300">Facility Zone</span>
              <input type="text" value={draftFilters.facility_zone} onChange={(e) => setDraftFilters((prev) => ({ ...prev, facility_zone: e.target.value }))} className={inputClass} placeholder="Enter facility zone" />
            </label>
          </div>
          <div className="flex shrink-0 gap-2 border-t border-slate-200 px-5 py-4 dark:border-neutral-800">
            <button type="button" className={`${ghostButton} flex-1`} onClick={() => {
              setDraftFilters({ ...EMPTY_FILTERS });
              setFilters({ ...EMPTY_FILTERS });
              setPage(1);
              setFilterOpen(false);
            }}>Reset</button>
            <button type="submit" className={`${primaryButton} flex-1`}>Filter</button>
          </div>
        </form>
        <DrawerFooter className="shrink-0 border-t border-slate-100 dark:border-neutral-800">
          <DrawerClose asChild><button type="button" className={ghostButton}>Cancel</button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>

    {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-[2px]" onMouseDown={e => { if (e.target === e.currentTarget) closeDetails(); }}>
      <div role="dialog" aria-modal="true" aria-label="Rider details" className="flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white text-slate-900 shadow-2xl dark:bg-neutral-900 dark:text-white">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-neutral-800 sm:px-6"><div className="flex items-center gap-3"><span className="rounded-lg bg-blue-50 p-2 text-[#0446db]"><UserRound size={20}/></span><div><h2 className="font-bold">{selected.name}</h2><p className="text-xs text-slate-500">FP_{selected.vendor_id}_{selected.id} · Rider Profile</p></div></div><button type="button" onClick={closeDetails} disabled={saving} aria-label="Close"><X size={20}/></button></div>
        <form onSubmit={saveProfile} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
            <div className="flex flex-wrap gap-2"><StatusPill active={bool(selected.account_status)} onLabel="Account verified" offLabel="Account unverified" /><StatusPill active={bool(selected.is_active)} onLabel="Active" offLabel="Inactive" /><StatusPill active={bool(selected.is_available)} onLabel="Available" offLabel="Unavailable" /><StatusPill active={bool(selected.kyc_verified)} onLabel="KYC verified" offLabel="KYC pending" /></div>
            <section className="space-y-3"><h3 className="border-b border-slate-100 pb-2 text-sm font-bold text-[#0446db] dark:border-neutral-800">Basic Information</h3><div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {([ ["name","Rider Name"], ["phone","Mobile Number"], ["email","Email"], ["address_line","Address"], ["city","City"], ["state","State"], ["pincode","Pincode"], ["facility_city","Facility City"], ["facility_zone","Facility Zone"] ] as const).map(([field,label]) => <FieldInput key={field} label={label} name={field} value={form[field] ?? ""} disabled={!editing} onChange={changeField}/>)}
            </div></section>
            <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/40"><h3 className="mb-3 text-sm font-bold text-[#0446db]">KYC & Documents</h3><div className="grid gap-3 text-sm sm:grid-cols-2"><div><p className="text-xs text-slate-500">Document Type</p><p className="font-medium">{valueText(selected.document_type)}</p></div><div><p className="text-xs text-slate-500">Document ID</p><p className="font-medium">{valueText(selected.document_id)}</p></div></div><div className="mt-3 flex flex-wrap items-center gap-3">{documentUrl(selected.document_image) ? <a href={documentUrl(selected.document_image)!} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0446db] hover:underline"><FileImage size={16}/> View KYC Document</a> : <span className="text-xs text-slate-500">No KYC document available</span>}{bool(selected.kyc_verified) ? <StatusPill active onLabel="KYC Verified" offLabel=""/> : <button type="button" className={primaryButton} disabled={saving || !selected.document_image} onClick={() => void verifyKyc()}><BadgeCheck size={16}/> Verify KYC</button>}</div></section>
            <section className="space-y-3"><h3 className="border-b border-slate-100 pb-2 text-sm font-bold text-[#0446db] dark:border-neutral-800">Bank Details</h3><div className="grid gap-3 sm:grid-cols-2">{([ ["bank_name", "Bank Name"], ["bank_account_number", "Account Number"], ["bank_branch", "Branch"], ["bank_ifsc_code", "IFSC Code"] ] as const).map(([field,label]) => <FieldInput key={field} label={label} name={field} value={form[field] ?? ""} disabled={!editing} onChange={changeField}/>)}</div><div className="flex flex-wrap items-center gap-3">{documentUrl(selected.cheque_image) && <a href={documentUrl(selected.cheque_image)!} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#0446db] hover:underline">View Cheque Image</a>}{editing && <label className="block text-xs font-semibold text-slate-600 dark:text-neutral-300">Upload New Cheque <input type="file" accept="image/*,application/pdf" className="mt-1 block w-full text-xs" onChange={e => setForm(prev => ({ ...prev, cheque_image: e.target.files?.[0] ?? null }))}/></label>}</div></section>
          </div>
          <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-slate-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6">{editing ? <><button type="button" className={ghostButton} disabled={saving} onClick={() => { setForm(toForm(selected)); setEditing(false); }}>Cancel Edit</button><button className={primaryButton} type="submit" disabled={saving}>{saving ? <Loader2 size={16} className="animate-spin"/> : <CheckCircle2 size={16}/>} Save Changes</button></> : <button type="button" className={primaryButton} onClick={() => setEditing(true)}><Pencil size={16}/> Edit Rider</button>}<button type="button" className={ghostButton} onClick={closeDetails} disabled={saving}>Close</button></div>
        </form>
      </div>
    </div>}

    {passwordRider && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-3 backdrop-blur-[2px]" onMouseDown={e => { if (e.target === e.currentTarget && !saving) setPasswordRider(null); }}>
      <div role="dialog" aria-modal="true" aria-label="Change rider password" className="w-full max-w-md overflow-hidden rounded-xl bg-white text-slate-900 shadow-2xl dark:bg-neutral-900 dark:text-white"><div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-neutral-800"><div><h2 className="font-bold">Change Password</h2><p className="text-xs text-slate-500">{passwordRider.name} · FP_{passwordRider.vendor_id}_{passwordRider.id}</p></div><button type="button" disabled={saving} onClick={() => setPasswordRider(null)} aria-label="Close"><X size={20}/></button></div>
      <form onSubmit={changePassword} className="space-y-4 p-5"><label className="block space-y-1.5"><span className="text-xs font-semibold">New Password</span><input type="password" required autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} className={inputClass}/></label><label className="block space-y-1.5"><span className="text-xs font-semibold">Confirm Password</span><input type="password" required autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClass}/></label>{confirmPassword && password !== confirmPassword && <p className="flex items-center gap-1 text-xs text-red-600"><XCircle size={14}/> Passwords do not match</p>}<div className="flex justify-end gap-2 pt-2"><button type="button" className={ghostButton} onClick={() => setPasswordRider(null)} disabled={saving}>Cancel</button><button type="submit" className={primaryButton} disabled={saving || !password || password !== confirmPassword}>{saving && <Loader2 size={15} className="animate-spin"/>} Update Password</button></div></form>
      </div>
    </div>}
  </div>;
}
