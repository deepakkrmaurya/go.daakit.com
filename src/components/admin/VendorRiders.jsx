// import { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import Select from "react-select";
// import { State, City } from "country-state-city";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// import { Button } from "@/components/ui/button";
// import { TbFileInfo } from "react-icons/tb";
// import { FaRegFileImage } from "react-icons/fa6";
// import { toast } from "react-toastify";
// import {
//   FileText,
//   KeyRound,
//   Landmark,
//   Loader2,
//   Pencil,
//   Save,
//   UserRound,
//   X,
// } from "lucide-react";

// const baseURL = import.meta.env.VITE_BASE_URL;
// const INDIA_COUNTRY_CODE = "IN";

// const indianStates = State.getStatesOfCountry(INDIA_COUNTRY_CODE);

// const stateOptions = indianStates.map((state) => ({
//   value: state.name,
//   label: state.name,
//   isoCode: state.isoCode,
// }));

// const getCitiesByStateName = (stateName) => {
//   if (!stateName) return [];

//   const selectedState = indianStates.find(
//     (state) =>
//       state.name.toLowerCase() === String(stateName).toLowerCase()
//   );

//   if (!selectedState) return [];

//   return City.getCitiesOfState(
//     INDIA_COUNTRY_CODE,
//     selectedState.isoCode
//   ).map((city) => ({
//     value: city.name,
//     label: city.name,
//   }));
// };

// const getSelectStyles = (isDark) => ({
//   menuPortal: (base) => ({
//     ...base,
//     zIndex: 99999,
//     pointerEvents: "auto",
//   }),
//   control: (base, state) => ({
//     ...base,
//     minHeight: "42px",
//     borderRadius: "4px",
//     backgroundColor: isDark ? "#262626" : "#ffffff",
//     borderColor: state.isFocused
//       ? "#0446DB"
//       : isDark
//         ? "#404040"
//         : "#d1d5db",
//     boxShadow: state.isFocused
//       ? "0 0 0 2px rgba(4, 70, 219, 0.12)"
//       : "none",
//     cursor: state.isDisabled ? "not-allowed" : "pointer",
//     opacity: state.isDisabled ? 0.65 : 1,
//     "&:hover": {
//       borderColor: state.isFocused
//         ? "#0446DB"
//         : isDark
//           ? "#525252"
//           : "#9ca3af",
//     },
//   }),
//   menu: (base) => ({
//     ...base,
//     zIndex: 99999,
//     pointerEvents: "auto",
//     backgroundColor: isDark ? "#262626" : "#ffffff",
//     border: `1px solid ${isDark ? "#404040" : "#e5e7eb"}`,
//     overflow: "hidden",
//   }),
//   menuList: (base) => ({
//     ...base,
//     maxHeight: "240px",
//   }),
//   option: (base, state) => ({
//     ...base,
//     cursor: "pointer",
//     backgroundColor: state.isSelected
//       ? "#0446DB"
//       : state.isFocused
//         ? isDark
//           ? "#404040"
//           : "#eff6ff"
//         : isDark
//           ? "#262626"
//           : "#ffffff",
//     color: state.isSelected
//       ? "#ffffff"
//       : isDark
//         ? "#f5f5f5"
//         : "#111827",
//   }),
//   singleValue: (base) => ({
//     ...base,
//     color: isDark ? "#f5f5f5" : "#111827",
//   }),
//   input: (base) => ({
//     ...base,
//     color: isDark ? "#f5f5f5" : "#111827",
//   }),
//   placeholder: (base) => ({
//     ...base,
//     color: isDark ? "#a3a3a3" : "#9ca3af",
//   }),
//   indicatorSeparator: (base) => ({
//     ...base,
//     backgroundColor: isDark ? "#525252" : "#e5e7eb",
//   }),
//   dropdownIndicator: (base) => ({
//     ...base,
//     color: isDark ? "#a3a3a3" : "#6b7280",
//   }),
//   clearIndicator: (base) => ({
//     ...base,
//     color: isDark ? "#a3a3a3" : "#6b7280",
//   }),
// });

// const useDarkMode = () => {
//   const [isDark, setIsDark] = useState(() =>
//     typeof document !== "undefined"
//       ? document.documentElement.classList.contains("dark")
//       : false
//   );

//   useEffect(() => {
//     if (typeof document === "undefined") return;

//     const observer = new MutationObserver(() => {
//       setIsDark(document.documentElement.classList.contains("dark"));
//     });

//     observer.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });

//     return () => observer.disconnect();
//   }, []);

//   return isDark;
// };

// const RiderInput = ({
//   label,
//   name,
//   value,
//   onChange,
//   disabled = false,
//   type = "text",
//   placeholder = "",
// }) => (
//   <div className="space-y-1.5">
//     <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
//       {label}
//     </label>

//     <input
//       type={type}
//       name={name}
//       value={value ?? ""}
//       onChange={onChange}
//       disabled={disabled}
//       placeholder={placeholder}
//       className="h-[42px] w-full rounded-sm border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/10 dark:disabled:border-neutral-800 dark:disabled:bg-neutral-800/60 dark:disabled:text-neutral-400"
//     />
//   </div>
// );

// const StatusCard = ({ label, active, activeText, inactiveText }) => (
//   <div className="flex items-center justify-between rounded-sm border border-gray-200 bg-gray-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/50">
//     <span className="text-sm text-gray-500 dark:text-neutral-400">
//       {label}
//     </span>

//     <span
//       className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
//         active
//           ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
//           : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
//       }`}
//     >
//       {active ? activeText : inactiveText}
//     </span>
//   </div>
// );

// const InfoCard = ({ label, value }) => (
//   <div className="rounded-sm border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
//     <p className="text-xs font-medium text-gray-500 dark:text-neutral-400">
//       {label}
//     </p>
//     <p className="mt-1 break-words text-sm font-semibold text-gray-900 dark:text-white">
//       {value || "N/A"}
//     </p>
//   </div>
// );

// const SectionTitle = ({ icon: Icon, title, description }) => (
//   <div className="mb-4 flex items-center gap-3 border-b border-gray-200 pb-3 dark:border-neutral-800">
//     <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-[#0446DB]/10 text-[#0446DB] dark:bg-[#0446DB]/20 dark:text-blue-400">
//       <Icon className="h-4 w-4" />
//     </div>

//     <div>
//       <h3 className="font-semibold text-gray-900 dark:text-white">
//         {title}
//       </h3>
//       {description && (
//         <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
//           {description}
//         </p>
//       )}
//     </div>
//   </div>
// );

// const ToggleSwitch = ({ checked, onClick, disabled = false }) => (
//   <button
//     type="button"
//     disabled={disabled}
//     onClick={onClick}
//     className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0446DB]/20 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 ${
//       checked ? "bg-green-500" : "bg-gray-300 dark:bg-neutral-700"
//     } ${
//       disabled
//         ? "cursor-not-allowed opacity-40"
//         : "cursor-pointer"
//     }`}
//   >
//     <span
//       className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
//         checked ? "translate-x-6" : "translate-x-1"
//       }`}
//     />
//   </button>
// );

// function VendorRiders() {
//   const isDark = useDarkMode();
//   const selectStyles = useMemo(() => getSelectStyles(isDark), [isDark]);

//   const [loading, setLoading] = useState(false);
//   const [loadingPage, setLoadingPage] = useState(true);

//   const [vendorOptions, setVendorOptions] = useState([]);
//   const [vendor, setVendor] = useState("");
//   const [riders, setRiders] = useState([]);

//   const [popup, setPopup] = useState(null);
//   // IMPORTANT: react-select menus inside a Radix/Shadcn modal must be
//   // portalled INSIDE the DialogContent, not to document.body.
//   // Otherwise Radix modal pointer-events can block mouse selection.
//   const [riderDialogPortal, setRiderDialogPortal] = useState(null);
//   const [formData, setFormData] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);

//   const [cityOptions, setCityOptions] = useState([]);
//   const [facilityCityOptions, setFacilityCityOptions] = useState([]);

//   const [changePasswordPopup, setChangePasswordPopup] = useState(null);
//   const [newPassword, setNewPassword] = useState({
//     id: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const authHeaders = () => ({
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   });

//   const loadCitiesForState = (stateName) => {
//     const cities = getCitiesByStateName(stateName);
//     setCityOptions(cities);
//     setFacilityCityOptions(cities);
//     return cities;
//   };

//   const openRiderDetails = (rider) => {
//     setPopup(rider);
//     setFormData({ ...rider });
//     loadCitiesForState(rider?.state);
//     setIsEditing(false);
//   };

//   const closeRiderDetails = () => {
//     setPopup(null);
//     setFormData(null);
//     setIsEditing(false);
//     setCityOptions([]);
//     setFacilityCityOptions([]);
//   };

//   const fetchVendors = async () => {
//     setLoading(true);

//     try {
//       const res = await axios.get(`${baseURL}/api/admin/getAllVendors`, {
//         headers: authHeaders(),
//         params: { limit: 200 },
//       });

//       const tempArr = [{ value: "self", label: "Self Riders" }];

//       (res?.data?.data || []).forEach((element) => {
//         tempArr.push({
//           value: element.id,
//           label: `FP${element.id}: ${element.vendor_name}`,
//         });
//       });

//       setVendorOptions(tempArr);
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Error fetching vendors"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRiders = async (input) => {
//     if (!input) return;

//     setLoading(true);

//     const vendor_id = input === "self" ? null : input;
//     const rider_type = input === "self" ? "self" : null;

//     try {
//       const res = await axios.get(
//         `${baseURL}/api/admin/getRidersByVendorId`,
//         {
//           params: {
//             vendor_id,
//             rider_type,
//             limit: 500,
//           },
//           headers: authHeaders(),
//         }
//       );

//       setRiders(res?.data?.data || []);
//     } catch (err) {
//       setRiders([]);
//       toast.error(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Error fetching rider's data"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const changeVerificationStatus = async (id, status) => {
//     setLoading(true);

//     try {
//       const res = await axios.post(
//         `${baseURL}/api/admin/markRiderVerified/${id}`,
//         { account_status: status },
//         { headers: authHeaders() }
//       );

//       toast.success(
//         res?.data?.message || "Verification status updated successfully"
//       );

//       await fetchRiders(vendor);
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Error while changing status"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const changeActiveStatus = async (id, status) => {
//     setLoading(true);

//     try {
//       const res = await axios.post(
//         `${baseURL}/api/admin/markRiderActive/${id}`,
//         { is_active: status },
//         { headers: authHeaders() }
//       );

//       toast.success(
//         res?.data?.message || "Rider active status updated successfully"
//       );

//       await fetchRiders(vendor);
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Error while changing status"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const changeAvailabilityStatus = async (id, status) => {
//     setLoading(true);

//     try {
//       const res = await axios.post(
//         `${baseURL}/api/admin/markRiderAvailable/${id}`,
//         { is_available: status },
//         { headers: authHeaders() }
//       );

//       toast.success(
//         res?.data?.message || "Availability updated successfully"
//       );

//       await fetchRiders(vendor);
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Error while changing status"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, files, type } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "file" ? files?.[0] || null : value,
//     }));
//   };

//   const handleStateChange = (selectedOption) => {
//     const stateName = selectedOption?.value || "";
//     const cities = getCitiesByStateName(stateName);

//     setFormData((prev) => ({
//       ...prev,
//       state: stateName,
//       city: "",
//       facility_city: "",
//     }));

//     setCityOptions(cities);
//     setFacilityCityOptions(cities);
//   };

//   const handleSave = async () => {
//     if (!formData?.id) return;

//     if (!formData?.state) {
//       toast.error("Please select state");
//       return;
//     }

//     if (!formData?.city) {
//       toast.error("Please select city");
//       return;
//     }

//     if (!formData?.facility_city) {
//       toast.error("Please select facility city");
//       return;
//     }

//     setLoading(true);

//     try {
//       const data = new FormData();

//       Object.entries(formData).forEach(([key, value]) => {
//         if (value !== undefined && value !== null) {
//           data.append(key, value);
//         }
//       });

//       const res = await axios.post(
//         `${baseURL}/api/admin/updateRiderProfile/${formData.id}`,
//         data,
//         {
//           headers: {
//             ...authHeaders(),
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       toast.success(res?.data?.message || "Rider updated successfully");

//       closeRiderDetails();
//       await fetchRiders(vendor);
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Error saving data"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePasswordChange = async () => {
//     if (!newPassword.password) {
//       toast.error("Please enter new password");
//       return;
//     }

//     if (!newPassword.confirmPassword) {
//       toast.error("Please confirm password");
//       return;
//     }

//     if (newPassword.password !== newPassword.confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await axios.post(
//         `${baseURL}/api/admin/changeRiderPassword/${newPassword.id}`,
//         {
//           password: newPassword.password,
//           confirmPassword: newPassword.confirmPassword,
//         },
//         { headers: authHeaders() }
//       );

//       toast.success(res?.data?.message || "Password changed successfully");

//       setChangePasswordPopup(null);
//       setNewPassword({
//         id: "",
//         password: "",
//         confirmPassword: "",
//       });
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Error in updating password"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVendors();
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoadingPage(false);
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []);

//   if (loadingPage) {
//     return (
//       <div className="flex h-[90vh] w-full items-center justify-center bg-white dark:bg-neutral-950">
//         <div className="text-center">
//           <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#0446DB]" />
//           <p className="mt-3 text-sm font-medium text-gray-600 dark:text-neutral-300">
//             Loading Vendor Riders Details...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#f5f8fb] text-gray-900 dark:bg-neutral-950 dark:text-white">
//       <div className="border-b border-gray-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900 md:px-6">
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-xl font-semibold text-gray-900 dark:text-white md:text-2xl">
//               Vendor Riders
//             </h1>
//             <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
//               Manage rider status, profile and account information.
//             </p>
//           </div>

//           <div className="relative z-40 w-full sm:w-[280px]">
//             <Select
//               options={vendorOptions}
//               isSearchable
//               isClearable
//               value={
//                 vendorOptions.find((option) => option.value === vendor) ||
//                 null
//               }
//               onChange={(selectedOption) => {
//                 const value = selectedOption?.value || "";
//                 setVendor(value);
//                 setRiders([]);

//                 if (value) {
//                   fetchRiders(value);
//                 }
//               }}
//               placeholder="Select Vendor"
//               menuPortalTarget={document.body}
//               menuPosition="fixed"
//               styles={selectStyles}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="p-3 md:p-5">
//         <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
//           <div className="w-full overflow-x-auto">
//             <Table className="min-w-[1000px]">
//               <TableHeader className="bg-gray-50 dark:bg-neutral-800/70">
//                 <TableRow className="border-gray-200 hover:bg-transparent dark:border-neutral-800">
//                   <TableHead className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-neutral-300">
//                     RIDER ID
//                   </TableHead>
//                   <TableHead className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-neutral-300">
//                     RIDER NAME
//                   </TableHead>
//                   <TableHead className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-neutral-300">
//                     ACCOUNT STATUS
//                   </TableHead>
//                   <TableHead className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-neutral-300">
//                     ACTIVE
//                   </TableHead>
//                   <TableHead className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-neutral-300">
//                     AVAILABLE
//                   </TableHead>
//                   <TableHead className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-neutral-300">
//                     RIDER DOCUMENT
//                   </TableHead>
//                   <TableHead className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-neutral-300">
//                     CHANGE PASSWORD
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {loading ? (
//                   <TableRow>
//                     <TableCell colSpan={7} className="h-[300px]">
//                       <div className="flex h-full flex-col items-center justify-center">
//                         <Loader2 className="h-8 w-8 animate-spin text-[#0446DB]" />
//                         <p className="mt-3 text-sm text-gray-500 dark:text-neutral-400">
//                           Loading riders...
//                         </p>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ) : riders.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={7} className="h-[300px]">
//                       <div className="flex h-full flex-col items-center justify-center">
//                         <UserRound className="h-10 w-10 text-gray-300 dark:text-neutral-600" />
//                         <p className="mt-3 font-medium text-gray-600 dark:text-neutral-300">
//                           No riders found
//                         </p>
//                         <p className="mt-1 text-sm text-gray-400 dark:text-neutral-500">
//                           Select a vendor to view riders.
//                         </p>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   riders.map((rider) => (
//                     <TableRow
//                       key={rider.id}
//                       className="border-gray-200 transition-colors hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
//                     >
//                       <TableCell className="px-4 py-4 font-medium text-gray-900 dark:text-white">
//                         {vendor !== "self" ? `FP${vendor}_` : "DKT_"}
//                         {rider.id}
//                       </TableCell>

//                       <TableCell className="px-4 py-4 text-gray-700 dark:text-neutral-300">
//                         {rider.name || "-"}
//                       </TableCell>

//                       <TableCell className="px-4 py-4 text-center">
//                         <ToggleSwitch
//                           checked={!!rider.account_status}
//                           onClick={() =>
//                             changeVerificationStatus(
//                               rider.id,
//                               rider.account_status ? 0 : 1
//                             )
//                           }
//                         />
//                       </TableCell>

//                       <TableCell className="px-4 py-4 text-center">
//                         <ToggleSwitch
//                           checked={!!rider.is_active}
//                           disabled={!rider.account_status}
//                           onClick={() => {
//                             if (rider.account_status) {
//                               changeActiveStatus(
//                                 rider.id,
//                                 rider.is_active ? 0 : 1
//                               );
//                             }
//                           }}
//                         />
//                       </TableCell>

//                       <TableCell className="px-4 py-4 text-center">
//                         <ToggleSwitch
//                           checked={!!rider.is_available}
//                           disabled={
//                             !rider.account_status || !rider.is_active
//                           }
//                           onClick={() => {
//                             if (rider.account_status && rider.is_active) {
//                               changeAvailabilityStatus(
//                                 rider.id,
//                                 rider.is_available ? 0 : 1
//                               );
//                             }
//                           }}
//                         />
//                       </TableCell>

//                       <TableCell className="px-4 py-4 text-center">
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="sm"
//                           onClick={() => openRiderDetails(rider)}
//                           className="gap-2 border-gray-200 bg-white text-gray-700 hover:border-[#0446DB]/30 hover:bg-[#0446DB]/5 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-[#0446DB]/10 dark:hover:text-blue-400"
//                         >
//                           <TbFileInfo className="h-4 w-4" />
//                           Details
//                         </Button>
//                       </TableCell>

//                       <TableCell className="px-4 py-4 text-center">
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="sm"
//                           onClick={() => {
//                             setNewPassword({
//                               id: rider.id,
//                               password: "",
//                               confirmPassword: "",
//                             });
//                             setChangePasswordPopup(rider);
//                           }}
//                           className="gap-2 border-blue-200 bg-blue-50 text-[#0446DB] hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
//                         >
//                           <KeyRound className="h-4 w-4" />
//                           Password
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </div>
//       </div>

//       <Dialog
//         open={!!popup}
//         onOpenChange={(open) => {
//           if (!open) closeRiderDetails();
//         }}
//       >
//         <DialogContent ref={setRiderDialogPortal} className="max-h-[90vh] !max-w-[60vw] overflow-y-auto rounded-sm border border-gray-200 bg-white p-0 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-white max-lg:!max-w-[90vw] max-sm:!max-w-[95vw]">
//           <DialogHeader className="sticky top-0 z-20 border-b border-gray-200 bg-white px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900">
//             <div className="flex items-center gap-3">
//               <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-[#0446DB]/10 text-[#0446DB] dark:bg-[#0446DB]/20 dark:text-blue-400">
//                 <UserRound className="h-5 w-5" />
//               </div>

//               <div className="text-left">
//                 <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
//                   Rider Details
//                 </DialogTitle>
//                 <DialogDescription className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
//                   View and update rider profile, location, documents and bank
//                   information.
//                 </DialogDescription>
//               </div>
//             </div>
//           </DialogHeader>

//           {popup && formData && (
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleSave();
//               }}
//             >
//               <div className="space-y-7 px-6 py-5">
//                 <section>
//                   <SectionTitle
//                     icon={UserRound}
//                     title="Basic Details"
//                     description="Personal and operational information"
//                   />

//                   <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
//                     <StatusCard
//                       label="Account"
//                       active={!!popup.account_status}
//                       activeText="Active"
//                       inactiveText="Not Active"
//                     />
//                     <StatusCard
//                       label="Rider Status"
//                       active={!!popup.is_active}
//                       activeText="Active"
//                       inactiveText="Inactive"
//                     />
//                     <StatusCard
//                       label="Availability"
//                       active={!!popup.is_available}
//                       activeText="Available"
//                       inactiveText="Unavailable"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                     <RiderInput
//                       label="Rider ID"
//                       value={`${
//                         vendor !== "self" ? `FP${vendor}_` : "DKT_"
//                       }${popup.id}`}
//                       disabled
//                     />

//                     <RiderInput
//                       label="Rider Name"
//                       name="name"
//                       value={formData?.name || ""}
//                       onChange={handleChange}
//                       disabled={!isEditing}
//                     />

//                     <RiderInput
//                       label="Phone Number"
//                       name="phone"
//                       value={formData?.phone || ""}
//                       onChange={handleChange}
//                       disabled={!isEditing}
//                     />

//                     <RiderInput
//                       label="Email Address"
//                       name="email"
//                       value={formData?.email || ""}
//                       onChange={handleChange}
//                       disabled={!isEditing}
//                     />

//                     <div className="md:col-span-2">
//                       <RiderInput
//                         label="Address"
//                         name="address_line"
//                         value={formData?.address_line || ""}
//                         onChange={handleChange}
//                         disabled={!isEditing}
//                       />
//                     </div>

//                     <div className="space-y-1.5">
//                       <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
//                         State
//                       </label>
//                       <Select
//                         isDisabled={!isEditing}
//                         options={stateOptions}
//                         isSearchable
//                         isClearable
//                         value={
//                           formData?.state
//                             ? stateOptions.find(
//                                 (option) =>
//                                   option.value.toLowerCase() ===
//                                   String(formData.state).toLowerCase()
//                               ) || {
//                                 value: formData.state,
//                                 label: formData.state,
//                               }
//                             : null
//                         }
//                         onChange={handleStateChange}
//                         placeholder="Select state"
//                         noOptionsMessage={() => "No state found"}
//                         menuPortalTarget={riderDialogPortal || undefined}
//                         menuPosition="fixed"
//                         styles={selectStyles}
//                       />
//                     </div>

//                     <div className="space-y-1.5">
//                       <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
//                         City
//                       </label>
//                       <Select
//                         isDisabled={!isEditing || !formData?.state}
//                         options={cityOptions}
//                         isSearchable
//                         isClearable
//                         value={
//                           formData?.city
//                             ? cityOptions.find(
//                                 (option) =>
//                                   option.value.toLowerCase() ===
//                                   String(formData.city).toLowerCase()
//                               ) || {
//                                 value: formData.city,
//                                 label: formData.city,
//                               }
//                             : null
//                         }
//                         onChange={(selectedOption) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             city: selectedOption?.value || "",
//                           }))
//                         }
//                         placeholder={
//                           formData?.state
//                             ? "Select city"
//                             : "Select state first"
//                         }
//                         noOptionsMessage={() => "No city found"}
//                         menuPortalTarget={riderDialogPortal || undefined}
//                         menuPosition="fixed"
//                         styles={selectStyles}
//                       />
//                     </div>

//                     <RiderInput
//                       label="Pincode"
//                       name="pincode"
//                       value={formData?.pincode || ""}
//                       onChange={handleChange}
//                       disabled={!isEditing}
//                     />

//                     <RiderInput
//                       label="Facility Zone"
//                       name="facility_zone"
//                       value={formData?.facility_zone || ""}
//                       onChange={handleChange}
//                       disabled={!isEditing}
//                     />

//                     <div className="space-y-1.5">
//                       <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
//                         Facility City
//                       </label>
//                       <Select
//                         isDisabled={!isEditing || !formData?.state}
//                         options={facilityCityOptions}
//                         isSearchable
//                         isClearable
//                         value={
//                           formData?.facility_city
//                             ? facilityCityOptions.find(
//                                 (option) =>
//                                   option.value.toLowerCase() ===
//                                   String(formData.facility_city).toLowerCase()
//                               ) || {
//                                 value: formData.facility_city,
//                                 label: formData.facility_city,
//                               }
//                             : null
//                         }
//                         onChange={(selectedOption) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             facility_city: selectedOption?.value || "",
//                           }))
//                         }
//                         placeholder={
//                           formData?.state
//                             ? "Select facility city"
//                             : "Select state first"
//                         }
//                         noOptionsMessage={() => "No city found"}
//                         menuPortalTarget={riderDialogPortal || undefined}
//                         menuPosition="fixed"
//                         styles={selectStyles}
//                       />
//                     </div>
//                   </div>
//                 </section>

//                 <section>
//                   <SectionTitle
//                     icon={FileText}
//                     title="Rider Document"
//                     description="Identity and verification information"
//                   />

//                   <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
//                     <InfoCard
//                       label="Document Type"
//                       value={popup.document_type || "N/A"}
//                     />
//                     <InfoCard
//                       label="Document ID"
//                       value={popup.document_id || "N/A"}
//                     />

//                     <div className="rounded-sm border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
//                       <p className="text-xs font-medium text-gray-500 dark:text-neutral-400">
//                         Document File
//                       </p>

//                       {popup.document_image ? (
//                         <a
//                           href={`${baseURL}/${popup.document_image}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#0446DB] hover:underline dark:text-blue-400"
//                         >
//                           <FaRegFileImage className="text-lg" />
//                           View Document
//                         </a>
//                       ) : (
//                         <p className="mt-2 text-sm text-gray-400 dark:text-neutral-500">
//                           No document available
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </section>

//                 <section>
//                   <SectionTitle
//                     icon={Landmark}
//                     title="Bank Details"
//                     description="Settlement account information"
//                   />

//                   <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                     <RiderInput
//                       label="Bank Name"
//                       name="bank_name"
//                       value={formData?.bank_name || ""}
//                       onChange={handleChange}
//                       disabled={!isEditing}
//                     />

//                     <RiderInput
//                       label="Account Number"
//                       name="bank_account_number"
//                       value={formData?.bank_account_number || ""}
//                       onChange={handleChange}
//                       disabled={!isEditing}
//                     />

//                     <RiderInput
//                       label="Bank Branch"
//                       name="bank_branch"
//                       value={formData?.bank_branch || ""}
//                       onChange={handleChange}
//                       disabled={!isEditing}
//                     />

//                     <RiderInput
//                       label="IFSC Code"
//                       name="bank_ifsc_code"
//                       value={formData?.bank_ifsc_code || ""}
//                       onChange={handleChange}
//                       disabled={!isEditing}
//                     />

//                     <div className="space-y-1.5 md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
//                         Cheque Image
//                       </label>

//                       {!isEditing ? (
//                         <div className="flex min-h-[42px] items-center rounded-sm border border-gray-200 bg-gray-50 px-3 dark:border-neutral-700 dark:bg-neutral-800">
//                           {popup.cheque_image ? (
//                             <a
//                               href={`${baseURL}/${popup.cheque_image}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="flex items-center gap-2 text-sm font-medium text-[#0446DB] hover:underline dark:text-blue-400"
//                             >
//                               <FaRegFileImage />
//                               View Cheque Image
//                             </a>
//                           ) : (
//                             <span className="text-sm text-gray-400 dark:text-neutral-500">
//                               No image available
//                             </span>
//                           )}
//                         </div>
//                       ) : (
//                         <input
//                           type="file"
//                           name="cheque_image"
//                           accept="image/*,application/pdf"
//                           onChange={handleChange}
//                           className="w-full rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-[#0446DB]/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:file:bg-[#0446DB]/20 dark:file:text-blue-400"
//                         />
//                       )}
//                     </div>
//                   </div>
//                 </section>
//               </div>

//               <DialogFooter className="sticky bottom-0 z-20 flex-row justify-end gap-2 border-t border-gray-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
//                 {isEditing ? (
//                   <>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={() => {
//                         setFormData({ ...popup });
//                         loadCitiesForState(popup?.state);
//                         setIsEditing(false);
//                       }}
//                       className="gap-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
//                     >
//                       <X className="h-4 w-4" />
//                       Cancel
//                     </Button>

//                     <Button
//                       type="submit"
//                       disabled={loading}
//                       className="gap-2 bg-[#0446DB] text-white hover:bg-[#0339b5]"
//                     >
//                       {loading ? (
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                       ) : (
//                         <Save className="h-4 w-4" />
//                       )}
//                       Save Changes
//                     </Button>
//                   </>
//                 ) : (
//                   <Button
//                     type="button"
//                     onClick={() => {
//                       setFormData({ ...popup });
//                       loadCitiesForState(popup?.state);
//                       setIsEditing(true);
//                     }}
//                     className="gap-2 bg-[#0446DB] text-white hover:bg-[#0339b5]"
//                   >
//                     <Pencil className="h-4 w-4" />
//                     Edit Rider
//                   </Button>
//                 )}

//                 <DialogClose asChild>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     className="dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
//                   >
//                     Close
//                   </Button>
//                 </DialogClose>
//               </DialogFooter>
//             </form>
//           )}
//         </DialogContent>
//       </Dialog>

//       <Dialog
//         open={!!changePasswordPopup}
//         onOpenChange={(open) => {
//           if (!open) {
//             setChangePasswordPopup(null);
//             setNewPassword({
//               id: "",
//               password: "",
//               confirmPassword: "",
//             });
//           }
//         }}
//       >
//         <DialogContent className="w-[95vw] max-w-lg overflow-hidden rounded-sm border border-gray-200 bg-white p-0 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-white">
//           <DialogHeader className="border-b border-gray-200 px-6 py-5 dark:border-neutral-800">
//             <div className="flex items-center gap-3">
//               <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[#0446DB]/10 text-[#0446DB] dark:bg-[#0446DB]/20 dark:text-blue-400">
//                 <KeyRound className="h-5 w-5" />
//               </div>

//               <div className="text-left">
//                 <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
//                   Change Password
//                 </DialogTitle>
//                 <DialogDescription className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
//                   Create a new password for this rider account.
//                 </DialogDescription>
//               </div>
//             </div>
//           </DialogHeader>

//           {changePasswordPopup && (
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handlePasswordChange();
//               }}
//             >
//               <div className="space-y-5 px-6 py-5">
//                 <div className="grid grid-cols-1 gap-4 rounded-sm border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2 dark:border-neutral-800 dark:bg-neutral-800/50">
//                   <div>
//                     <p className="text-xs text-gray-500 dark:text-neutral-400">
//                       Rider ID
//                     </p>
//                     <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
//                       {vendor !== "self"
//                         ? `FP${vendor}_${changePasswordPopup.id}`
//                         : `DKT_${changePasswordPopup.id}`}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-xs text-gray-500 dark:text-neutral-400">
//                       Rider Name
//                     </p>
//                     <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
//                       {changePasswordPopup.name || "N/A"}
//                     </p>
//                   </div>
//                 </div>

//                 <RiderInput
//                   label="New Password"
//                   type="password"
//                   value={newPassword.password}
//                   onChange={(e) =>
//                     setNewPassword((prev) => ({
//                       ...prev,
//                       password: e.target.value,
//                     }))
//                   }
//                   placeholder="Enter new password"
//                 />

//                 <RiderInput
//                   label="Confirm Password"
//                   type="password"
//                   value={newPassword.confirmPassword}
//                   onChange={(e) =>
//                     setNewPassword((prev) => ({
//                       ...prev,
//                       confirmPassword: e.target.value,
//                     }))
//                   }
//                   placeholder="Confirm new password"
//                 />

//                 {newPassword.password &&
//                   newPassword.confirmPassword &&
//                   newPassword.password !== newPassword.confirmPassword && (
//                     <p className="text-xs font-medium text-red-500">
//                       Passwords do not match.
//                     </p>
//                   )}
//               </div>

//               <DialogFooter className="flex-row justify-end gap-2 border-t border-gray-200 bg-gray-50/50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
//                 <DialogClose asChild>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     className="dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
//                   >
//                     Cancel
//                   </Button>
//                 </DialogClose>

//                 <Button
//                   type="submit"
//                   disabled={
//                     loading ||
//                     !newPassword.password ||
//                     !newPassword.confirmPassword
//                   }
//                   className="gap-2 bg-[#0446DB] text-white hover:bg-[#0339b5] disabled:opacity-60"
//                 >
//                   {loading ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : (
//                     <KeyRound className="h-4 w-4" />
//                   )}
//                   Update Password
//                 </Button>
//               </DialogFooter>
//             </form>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// export default VendorRiders;



import { useEffect, useMemo, useState } from "react";

import axios from "axios";

import Select from "react-select";

import { State, City } from "country-state-city";



import {

  Table,

  TableBody,

  TableCell,

  TableHead,

  TableHeader,

  TableRow,

} from "@/components/ui/table";



import {

  Dialog,

  DialogClose,

  DialogContent,

  DialogDescription,

  DialogFooter,

  DialogHeader,

  DialogTitle,

} from "@/components/ui/dialog";



import { Button } from "@/components/ui/button";

import { TbFileInfo } from "react-icons/tb";

import { FaRegFileImage } from "react-icons/fa6";

import { toast } from "react-toastify";

import {

  FileText,

  KeyRound,

  Landmark,

  Loader2,

  Pencil,

  Save,

  UserRound,

  X,

} from "lucide-react";
import AxiosInstance from "../../Helper/axiosInstance";



const baseURL = import.meta.env.VITE_BASE_URL;

const INDIACOUNTRYCODE = "IN";



const indianStates = State.getStatesOfCountry(INDIACOUNTRYCODE);



const stateOptions = indianStates.map((state) => ({

  value: state.name,

  label: state.name,

  isoCode: state.isoCode,

}));



const getCitiesByStateName = (stateName) => {

  if (!stateName) return [];



  const selectedState = indianStates.find(

    (state) =>

      state.name.toLowerCase() === String(stateName).toLowerCase()

  );



  if (!selectedState) return [];



  return City.getCitiesOfState(

    INDIACOUNTRYCODE,

    selectedState.isoCode

  ).map((city) => ({

    value: city.name,

    label: city.name,

  }));

};



const getSelectStyles = (isDark) => ({

  menuPortal: (base) => ({

    ...base,

    zIndex: 99999,

    pointerEvents: "auto",

  }),

  control: (base, state) => ({

    ...base,

    minHeight: "42px",

    borderRadius: "4px",

    backgroundColor: isDark ? "#262626" : "#ffffff",

    borderColor: state.isFocused

      ? "#0446DB"

      : isDark

        ? "#404040"

        : "#d1d5db",

    boxShadow: state.isFocused

      ? "0 0 0 2px rgba(4, 70, 219, 0.12)"

      : "none",

    cursor: state.isDisabled ? "not-allowed" : "pointer",

    opacity: state.isDisabled ? 0.65 : 1,

    "&:hover": {

      borderColor: state.isFocused

        ? "#0446DB"

        : isDark

          ? "#525252"

          : "#9ca3af",

    },

  }),

  menu: (base) => ({

    ...base,

    zIndex: 99999,

    pointerEvents: "auto",

    backgroundColor: isDark ? "#262626" : "#ffffff",

    border: `1px solid ${isDark ? "#404040" : "#e5e7eb"}`,

    overflow: "hidden",

  }),

  menuList: (base) => ({

    ...base,

    maxHeight: "240px",

  }),

  option: (base, state) => ({

    ...base,

    cursor: "pointer",

    backgroundColor: state.isSelected

      ? "#0446DB"

      : state.isFocused

        ? isDark

          ? "#404040"

          : "#eff6ff"

        : isDark

          ? "#262626"

          : "#ffffff",

    color: state.isSelected

      ? "#ffffff"

      : isDark

        ? "#f5f5f5"

        : "#111827",

  }),

  singleValue: (base) => ({

    ...base,

    color: isDark ? "#f5f5f5" : "#111827",

  }),

  input: (base) => ({

    ...base,

    color: isDark ? "#f5f5f5" : "#111827",

  }),

  placeholder: (base) => ({

    ...base,

    color: isDark ? "#a3a3a3" : "#9ca3af",

  }),

  indicatorSeparator: (base) => ({

    ...base,

    backgroundColor: isDark ? "#525252" : "#e5e7eb",

  }),

  dropdownIndicator: (base) => ({

    ...base,

    color: isDark ? "#a3a3a3" : "#6b7280",

  }),

  clearIndicator: (base) => ({

    ...base,

    color: isDark ? "#a3a3a3" : "#6b7280",

  }),

});



const useDarkMode = () => {

  const [isDark, setIsDark] = useState(() =>

    typeof document !== "undefined"

      ? document.documentElement.classList.contains("dark")

      : false

  );



  useEffect(() => {

    if (typeof document === "undefined") return;



    const observer = new MutationObserver(() => {

      setIsDark(document.documentElement.classList.contains("dark"));

    });



    observer.observe(document.documentElement, {

      attributes: true,

      attributeFilter: ["class"],

    });



    return () => observer.disconnect();

  }, []);



  return isDark;

};



const RiderInput = ({

  label,

  name,

  value,

  onChange,

  disabled = false,

  type = "text",

  placeholder = "",

}) => (

  <div className="space-y-1.5">

    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">

      {label}

    </label>



    <input

      type={type}

      name={name}

      value={value ?? ""}

      onChange={onChange}

      disabled={disabled}

      placeholder={placeholder}

      className="h-[42px] w-full rounded-sm border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/10 dark:disabled:border-neutral-800 dark:disabled:bg-neutral-800/60 dark:disabled:text-neutral-400"

    />

  </div>

);



const StatusCard = ({ label, active, activeText, inactiveText }) => (

  <div className="flex items-center justify-between rounded-sm border border-gray-200 bg-gray-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/50">

    <span className="text-sm text-gray-500 dark:text-neutral-400">

      {label}

    </span>



    <span

      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${

        active

          ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"

          : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"

      }`}

    >

      {active ? activeText : inactiveText}

    </span>

  </div>

);



const InfoCard = ({ label, value }) => (

  <div className="rounded-sm border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">

    <p className="text-xs font-medium text-gray-500 dark:text-neutral-400">

      {label}

    </p>

    <p className="mt-1 break-words text-sm font-semibold text-gray-900 dark:text-white">

      {value || "N/A"}

    </p>

  </div>

);



const SectionTitle = ({ icon: Icon, title, description }) => (

  <div className="mb-4 flex items-center gap-3 border-b border-gray-200 pb-3 dark:border-neutral-800">

    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-[#0446DB]/10 text-[#0446DB] dark:bg-[#0446DB]/20 dark:text-blue-400">

      <Icon className="h-4 w-4" />

    </div>



    <div>

      <h3 className="font-semibold text-gray-900 dark:text-white">

        {title}

      </h3>

      {description && (

        <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">

          {description}

        </p>

      )}

    </div>

  </div>

);



const ToggleSwitch = ({ checked, onClick, disabled = false }) => (

  <button

    type="button"

    disabled={disabled}

    onClick={onClick}

    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0446DB]/20 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 ${

      checked ? "bg-green-500" : "bg-gray-300 dark:bg-neutral-700"

    } ${

      disabled

        ? "cursor-not-allowed opacity-40"

        : "cursor-pointer"

    }`}

  >

    <span

      className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${

        checked ? "translate-x-6" : "translate-x-1"

      }`}

    />

  </button>

);



function VendorRiders() {

  const isDark = useDarkMode();

  const selectStyles = useMemo(() => getSelectStyles(isDark), [isDark]);



  const [loading, setLoading] = useState(false);

  const [loadingPage, setLoadingPage] = useState(true);



  const [vendorOptions, setVendorOptions] = useState([]);

  const [vendor, setVendor] = useState("");

  const [riders, setRiders] = useState([]);



  const [popup, setPopup] = useState(null);



  const [riderDialogPortal, setRiderDialogPortal] = useState(null);

  const [formData, setFormData] = useState(null);

  const [isEditing, setIsEditing] = useState(false);



  const [cityOptions, setCityOptions] = useState([]);

  const [facilityCityOptions, setFacilityCityOptions] = useState([]);



  const [changePasswordPopup, setChangePasswordPopup] = useState(null);

  const [newPassword, setNewPassword] = useState({

    id: "",

    password: "",

    confirmPassword: "",

  });



  const authHeaders = () => ({

    Authorization: `Bearer ${localStorage.getItem("token")}`,

  });



  const loadCitiesForState = (stateName) => {

    const cities = getCitiesByStateName(stateName);

    setCityOptions(cities);

    setFacilityCityOptions(cities);

    return cities;

  };



  const openRiderDetails = (rider) => {

    setPopup(rider);

    setFormData({ ...rider });

    loadCitiesForState(rider?.state);

    setIsEditing(false);

  };



  const closeRiderDetails = () => {

    setPopup(null);

    setFormData(null);

    setIsEditing(false);

    setCityOptions([]);

    setFacilityCityOptions([]);

  };



  const fetchVendors = async () => {

    setLoading(true);



    try {

      const res = await AxiosInstance.get(`/api/admin/getAllVendors`, {
        params: { limit: 200 },

      });



      const tempArr = [{ value: "self", label: "Self Riders" }];



      (res?.data?.data || []).forEach((element) => {

        tempArr.push({

          value: element.id,

          label: `FP${element.id}: ${element.vendor_name}`,

        });

      });



      setVendorOptions(tempArr);

    } catch (err) {

      toast.error(

        err?.response?.data?.message ||

          err?.message ||

          "Error fetching vendors"

      );

    } finally {

      setLoading(false);

    }

  };



  const fetchRiders = async (input) => {

    if (!input) return;



    setLoading(true);



    const vendor_id = input === "self" ? null : input;

    const rider_type = input === "self" ? "self" : null;



    try {

      const res = await AxiosInstance.get(

        `/api/admin/getRidersByVendorId`,

        {

          params: {

            vendor_id,

            rider_type,

            limit: 500,

          },

         

        }

      );



      setRiders(res?.data?.data || []);

    } catch (err) {

      setRiders([]);

      toast.error(

        err?.response?.data?.message ||

          err?.message ||

          "Error fetching rider's data"

      );

    } finally {

      setLoading(false);

    }

  };



  const changeVerificationStatus = async (id, status) => {

    setLoading(true);



    try {

      const res = await axios.post(

        `${baseURL}/api/admin/markRiderVerified/${id}`,

        { account_status: status },

        { headers: authHeaders() }

      );



      toast.success(

        res?.data?.message || "Verification status updated successfully"

      );



      await fetchRiders(vendor);

    } catch (err) {

      toast.error(

        err?.response?.data?.message ||

          err?.message ||

          "Error while changing status"

      );

    } finally {

      setLoading(false);

    }

  };



  const changeActiveStatus = async (id, status) => {

    setLoading(true);



    try {

      const res = await axios.post(

        `${baseURL}/api/admin/markRiderActive/${id}`,

        { is_active: status },

        { headers: authHeaders() }

      );



      toast.success(

        res?.data?.message || "Rider active status updated successfully"

      );



      await fetchRiders(vendor);

    } catch (err) {

      toast.error(

        err?.response?.data?.message ||

          err?.message ||

          "Error while changing status"

      );

    } finally {

      setLoading(false);

    }

  };



  const changeAvailabilityStatus = async (id, status) => {

    setLoading(true);



    try {

      const res = await axios.post(

        `${baseURL}/api/admin/markRiderAvailable/${id}`,

        { is_available: status },

        { headers: authHeaders() }

      );



      toast.success(

        res?.data?.message || "Availability updated successfully"

      );



      await fetchRiders(vendor);

    } catch (err) {

      toast.error(

        err?.response?.data?.message ||

          err?.message ||

          "Error while changing status"

      );

    } finally {

      setLoading(false);

    }

  };



  const handleChange = (e) => {

    const { name, value, files, type } = e.target;



    setFormData((prev) => ({

      ...prev,

      [name]: type === "file" ? files?.[0] || null : value,

    }));

  };



  const handleStateChange = (selectedOption) => {

    const stateName = selectedOption?.value || "";

    const cities = getCitiesByStateName(stateName);



    setFormData((prev) => ({

      ...prev,

      state: stateName,

      city: "",

      facility_city: "",

    }));



    setCityOptions(cities);

    setFacilityCityOptions(cities);

  };



  const handleSave = async () => {

    if (!formData?.id) return;



    if (!formData?.state) {

      toast.error("Please select state");

      return;

    }



    if (!formData?.city) {

      toast.error("Please select city");

      return;

    }



    if (!formData?.facility_city) {

      toast.error("Please select facility city");

      return;

    }



    setLoading(true);



    try {

      const data = new FormData();



      Object.entries(formData).forEach(([key, value]) => {

        if (value !== undefined && value !== null) {

          data.append(key, value);

        }

      });



      const res = await axios.post(

        `${baseURL}/api/admin/updateRiderProfile/${formData.id}`,

        data,

        {

          headers: {

            ...authHeaders(),

            "Content-Type": "multipart/form-data",

          },

        }

      );



      toast.success(res?.data?.message || "Rider updated successfully");



      closeRiderDetails();

      await fetchRiders(vendor);

    } catch (err) {

      toast.error(

        err?.response?.data?.message ||

          err?.message ||

          "Error saving data"

      );

    } finally {

      setLoading(false);

    }

  };



  const handlePasswordChange = async () => {

    if (!newPassword.password) {

      toast.error("Please enter new password");

      return;

    }



    if (!newPassword.confirmPassword) {

      toast.error("Please confirm password");

      return;

    }



    if (newPassword.password !== newPassword.confirmPassword) {

      toast.error("Passwords do not match");

      return;

    }



    setLoading(true);



    try {

      const res = await axios.post(

        `${baseURL}/api/admin/changeRiderPassword/${newPassword.id}`,

        {

          password: newPassword.password,

          confirmPassword: newPassword.confirmPassword,

        },

        { headers: authHeaders() }

      );



      toast.success(res?.data?.message || "Password changed successfully");



      setChangePasswordPopup(null);

      setNewPassword({

        id: "",

        password: "",

        confirmPassword: "",

      });

    } catch (err) {

      toast.error(

        err?.response?.data?.message ||

          err?.message ||

          "Error in updating password"

      );

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    fetchVendors();

  }, []);



  useEffect(() => {

    const timer = setTimeout(() => {

      setLoadingPage(false);

    }, 2000);



    return () => clearTimeout(timer);

  }, []);



  if (loadingPage) {

    return (

      <div className="flex h-[90vh] w-full items-center justify-center bg-white dark:bg-neutral-950">

        <div className="text-center">

          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#0446DB]" />

          <p className="mt-3 text-sm font-medium text-gray-600 dark:text-neutral-300">

            Loading Vendor Riders Details...

          </p>

        </div>

      </div>

    );

  }



  return (

    <div className="relative isolate h-[calc(110dvh-100px)] min-h-0 overflow-y-auto overscroll-contain bg-[#f5f8fb] text-gray-900 dark:bg-neutral-950 dark:text-white">

      <div className="sticky top-0  border-b py-4  dark:bg-neutral-900 ">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-xl font-semibold text-gray-900 dark:text-white md:text-2xl">

              Vendor Riders

            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">

              Manage rider status, profile and account information.

            </p>

          </div>



          <div className="relative z-40 w-full sm:w-[280px]">

            <Select

              options={vendorOptions}

              isSearchable

              isClearable

              value={

                vendorOptions.find((option) => option.value === vendor) ||

                null

              }

              onChange={(selectedOption) => {

                const value = selectedOption?.value || "";

                setVendor(value);

                setRiders([]);



                if (value) {

                  fetchRiders(value);

                }

              }}

              placeholder="Select Vendor"

              menuPortalTarget={document.body}

              menuPosition="fixed"

              styles={selectStyles}

            />

          </div>

        </div>

      </div>



      <div className="">

        <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

          <div className="h-[calc(100vh-180px)] min-h-[320px] w-full overflow-auto overscroll-contain">

            <table className="w-full min-w-[1000px] caption-bottom text-sm border-separate border-spacing-0">

              <TableHeader className="bg-gray-50 dark:bg-neutral-800">

                <TableRow className="border-gray-200 hover:bg-transparent dark:border-neutral-800">

                  <TableHead className="sticky top-0 z-30 bg-gray-50 dark:bg-neutral-800 px-4 py-3 text-xs font-semibold text-gray-600 dark:text-neutral-300">

                    RIDER ID

                  </TableHead>

                  <TableHead className="sticky top-0 z-30 bg-gray-50 dark:bg-neutral-800 px-4 py-3 text-xs font-semibold text-gray-600 dark:text-neutral-300">

                    RIDER NAME

                  </TableHead>

                  <TableHead className="sticky top-0 z-30 bg-gray-50 dark:bg-neutral-800 px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-neutral-300">

                    ACCOUNT STATUS

                  </TableHead>

                  <TableHead className="sticky top-0 z-30 bg-gray-50 dark:bg-neutral-800 px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-neutral-300">

                    ACTIVE

                  </TableHead>

                  <TableHead className="sticky top-0 z-30 bg-gray-50 dark:bg-neutral-800 px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-neutral-300">

                    AVAILABLE

                  </TableHead>

                  <TableHead className="sticky top-0 z-30 bg-gray-50 dark:bg-neutral-800 px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-neutral-300">

                    RIDER DOCUMENT

                  </TableHead>

                  <TableHead className="sticky top-0 z-30 bg-gray-50 dark:bg-neutral-800 px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-neutral-300">

                    CHANGE PASSWORD

                  </TableHead>

                </TableRow>

              </TableHeader>



              <TableBody>

                {loading ? (

                  <TableRow>

                    <TableCell colSpan={7} className="h-[300px]">

                      <div className="flex h-full flex-col items-center justify-center">

                        <Loader2 className="h-8 w-8 animate-spin text-[#0446DB]" />

                        <p className="mt-3 text-sm text-gray-500 dark:text-neutral-400">

                          Loading riders...

                        </p>

                      </div>

                    </TableCell>

                  </TableRow>

                ) : riders.length === 0 ? (

                  <TableRow>

                    <TableCell colSpan={7} className="h-[300px]">

                      <div className="flex h-full flex-col items-center justify-center">

                        <UserRound className="h-10 w-10 text-gray-300 dark:text-neutral-600" />

                        <p className="mt-3 font-medium text-gray-600 dark:text-neutral-300">

                          No riders found

                        </p>

                        <p className="mt-1 text-sm text-gray-400 dark:text-neutral-500">

                          Select a vendor to view riders.

                        </p>

                      </div>

                    </TableCell>

                  </TableRow>

                ) : (

                  riders.map((rider) => (

                    <TableRow

                      key={rider.id}

                      className="border-gray-200 transition-colors hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"

                    >

                      <TableCell className="px-4 py-4 font-medium text-gray-900 dark:text-white">

                        {vendor !== "self" ? `FP_${vendor}_` : "DKT_"}

                        {rider.id}

                      </TableCell>



                      <TableCell className="px-4 py-4 text-gray-700 dark:text-neutral-300">

                        {rider.name || "-"}

                      </TableCell>



                      <TableCell className="px-4 py-4 text-center">

                        <ToggleSwitch

                          checked={!!rider.account_status}

                          onClick={() =>

                            changeVerificationStatus(

                              rider.id,

                              rider.account_status ? 0 : 1

                            )

                          }

                        />

                      </TableCell>



                      <TableCell className="px-4 py-4 text-center">

                        <ToggleSwitch

                          checked={!!rider.is_active}

                          disabled={!rider.account_status}

                          onClick={() => {

                            if (rider.account_status) {

                              changeActiveStatus(

                                rider.id,

                                rider.is_active ? 0 : 1

                              );

                            }

                          }}

                        />

                      </TableCell>



                      <TableCell className="px-4 py-4 text-center">

                        <ToggleSwitch

                          checked={!!rider.is_available}

                          disabled={

                            !rider.account_status || !rider.is_active

                          }

                          onClick={() => {

                            if (rider.account_status && rider.is_active) {

                              changeAvailabilityStatus(

                                rider.id,

                                rider.is_available ? 0 : 1

                              );

                            }

                          }}

                        />

                      </TableCell>



                      <TableCell className="px-4 py-4 text-center">

                        <Button

                          type="button"

                          variant="outline"

                          size="sm"

                          onClick={() => openRiderDetails(rider)}

                          className="gap-2 border-gray-200 bg-white text-gray-700 hover:border-[#0446DB]/30 hover:bg-[#0446DB]/5 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-[#0446DB]/10 dark:hover:text-blue-400"

                        >

                          <TbFileInfo className="h-4 w-4" />

                          Details

                        </Button>

                      </TableCell>



                      <TableCell className="px-4 py-4 text-center">

                        <Button

                          type="button"

                          variant="outline"

                          size="sm"

                          onClick={() => {

                            setNewPassword({

                              id: rider.id,

                              password: "",

                              confirmPassword: "",

                            });

                            setChangePasswordPopup(rider);

                          }}

                          className="gap-2 border-blue-200 bg-blue-50 text-[#0446DB] hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"

                        >

                          <KeyRound className="h-4 w-4" />

                          Password

                        </Button>

                      </TableCell>

                    </TableRow>

                  ))

                )}

              </TableBody>

            </table>

          </div>

        </div>

      </div>



      <Dialog

        open={!!popup}

        onOpenChange={(open) => {

          if (!open) closeRiderDetails();

        }}

      >

        <DialogContent ref={setRiderDialogPortal} className="max-h-[90vh] !max-w-[60vw] overflow-y-auto rounded-sm border border-gray-200 bg-white p-0 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-white max-lg:!max-w-[90vw] max-sm:!max-w-[95vw]">

          <DialogHeader className="sticky top-0 z-20 border-b border-gray-200 bg-white px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-[#0446DB]/10 text-[#0446DB] dark:bg-[#0446DB]/20 dark:text-blue-400">

                <UserRound className="h-5 w-5" />

              </div>



              <div className="text-left">

                <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">

                  Rider Details

                </DialogTitle>

                <DialogDescription className="mt-1 text-sm text-gray-500 dark:text-neutral-400">

                  View and update rider profile, location, documents and bank

                  information.

                </DialogDescription>

              </div>

            </div>

          </DialogHeader>



          {popup && formData && (

            <form

              onSubmit={(e) => {

                e.preventDefault();

                handleSave();

              }}

            >

              <div className="space-y-7 px-6 py-5">

                <section>

                  <SectionTitle

                    icon={UserRound}

                    title="Basic Details"

                    description="Personal and operational information"

                  />



                  <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

                    <StatusCard

                      label="Account"

                      active={!!popup.account_status}

                      activeText="Active"

                      inactiveText="Not Active"

                    />

                    <StatusCard

                      label="Rider Status"

                      active={!!popup.is_active}

                      activeText="Active"

                      inactiveText="Inactive"

                    />

                    <StatusCard

                      label="Availability"

                      active={!!popup.is_available}

                      activeText="Available"

                      inactiveText="Unavailable"

                    />

                  </div>



                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <RiderInput

                      label="Rider ID"

                      value={`${

                        vendor !== "self" ? `FP${vendor}_` : "DKT_"

                      }${popup.id}`}

                      disabled

                    />



                    <RiderInput

                      label="Rider Name"

                      name="name"

                      value={formData?.name || ""}

                      onChange={handleChange}

                      disabled={!isEditing}

                    />



                    <RiderInput

                      label="Phone Number"

                      name="phone"

                      value={formData?.phone || ""}

                      onChange={handleChange}

                      disabled={!isEditing}

                    />



                    <RiderInput

                      label="Email Address"

                      name="email"

                      value={formData?.email || ""}

                      onChange={handleChange}

                      disabled={!isEditing}

                    />



                    <div className="md:col-span-2">

                      <RiderInput

                        label="Address"

                        name="address_line"

                        value={formData?.address_line || ""}

                        onChange={handleChange}

                        disabled={!isEditing}

                      />

                    </div>



                    <div className="space-y-1.5">

                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">

                        State

                      </label>

                      <Select

                        isDisabled={!isEditing}

                        options={stateOptions}

                        isSearchable

                        isClearable

                        value={

                          formData?.state

                            ? stateOptions.find(

                                (option) =>

                                  option.value.toLowerCase() ===

                                  String(formData.state).toLowerCase()

                              ) || {

                                value: formData.state,

                                label: formData.state,

                              }

                            : null

                        }

                        onChange={handleStateChange}

                        placeholder="Select state"

                        noOptionsMessage={() => "No state found"}

                        menuPortalTarget={riderDialogPortal || undefined}

                        menuPosition="fixed"

                        styles={selectStyles}

                      />

                    </div>



                    <div className="space-y-1.5">

                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">

                        City

                      </label>

                      <Select

                        isDisabled={!isEditing || !formData?.state}

                        options={cityOptions}

                        isSearchable

                        isClearable

                        value={

                          formData?.city

                            ? cityOptions.find(

                                (option) =>

                                  option.value.toLowerCase() ===

                                  String(formData.city).toLowerCase()

                              ) || {

                                value: formData.city,

                                label: formData.city,

                              }

                            : null

                        }

                        onChange={(selectedOption) =>

                          setFormData((prev) => ({

                            ...prev,

                            city: selectedOption?.value || "",

                          }))

                        }

                        placeholder={

                          formData?.state

                            ? "Select city"

                            : "Select state first"

                        }

                        noOptionsMessage={() => "No city found"}

                        menuPortalTarget={riderDialogPortal || undefined}

                        menuPosition="fixed"

                        styles={selectStyles}

                      />

                    </div>



                    <RiderInput

                      label="Pincode"

                      name="pincode"

                      value={formData?.pincode || ""}

                      onChange={handleChange}

                      disabled={!isEditing}

                    />



                    <RiderInput

                      label="Facility Zone"

                      name="facility_zone"

                      value={formData?.facility_zone || ""}

                      onChange={handleChange}

                      disabled={!isEditing}

                    />



                    <div className="space-y-1.5">

                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">

                        Facility City

                      </label>

                      <Select

                        isDisabled={!isEditing || !formData?.state}

                        options={facilityCityOptions}

                        isSearchable

                        isClearable

                        value={

                          formData?.facility_city

                            ? facilityCityOptions.find(

                                (option) =>

                                  option.value.toLowerCase() ===

                                  String(formData.facility_city).toLowerCase()

                              ) || {

                                value: formData.facility_city,

                                label: formData.facility_city,

                              }

                            : null

                        }

                        onChange={(selectedOption) =>

                          setFormData((prev) => ({

                            ...prev,

                            facility_city: selectedOption?.value || "",

                          }))

                        }

                        placeholder={

                          formData?.state

                            ? "Select facility city"

                            : "Select state first"

                        }

                        noOptionsMessage={() => "No city found"}

                        menuPortalTarget={riderDialogPortal || undefined}

                        menuPosition="fixed"

                        styles={selectStyles}

                      />

                    </div>

                  </div>

                </section>



                <section>

                  <SectionTitle

                    icon={FileText}

                    title="Rider Document"

                    description="Identity and verification information"

                  />



                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                    <InfoCard

                      label="Document Type"

                      value={popup.document_type || "N/A"}

                    />

                    <InfoCard

                      label="Document ID"

                      value={popup.document_id || "N/A"}

                    />



                    <div className="rounded-sm border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">

                      <p className="text-xs font-medium text-gray-500 dark:text-neutral-400">

                        Document File

                      </p>



                      {popup.document_image ? (

                        <a

                          href={`${baseURL}/${popup.document_image}`}

                          target="_blank"

                          rel="noopener noreferrer"

                          className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#0446DB] hover:underline dark:text-blue-400"

                        >

                          <FaRegFileImage className="text-lg" />

                          View Document

                        </a>

                      ) : (

                        <p className="mt-2 text-sm text-gray-400 dark:text-neutral-500">

                          No document available

                        </p>

                      )}

                    </div>

                  </div>

                </section>



                <section>

                  <SectionTitle

                    icon={Landmark}

                    title="Bank Details"

                    description="Settlement account information"

                  />



                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <RiderInput

                      label="Bank Name"

                      name="bank_name"

                      value={formData?.bank_name || ""}

                      onChange={handleChange}

                      disabled={!isEditing}

                    />



                    <RiderInput

                      label="Account Number"

                      name="bankaccountnumber"

                      value={formData?.bank_account_number || ""}

                      onChange={handleChange}

                      disabled={!isEditing}

                    />



                    <RiderInput

                      label="Bank Branch"

                      name="bank_branch"

                      value={formData?.bank_branch || ""}

                      onChange={handleChange}

                      disabled={!isEditing}

                    />



                    <RiderInput

                      label="IFSC Code"

                      name="bankifsccode"

                      value={formData?.bank_ifsc_code || ""}

                      onChange={handleChange}

                      disabled={!isEditing}

                    />



                    <div className="space-y-1.5 md:col-span-2">

                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">

                        Cheque Image

                      </label>



                      {!isEditing ? (

                        <div className="flex min-h-[42px] items-center rounded-sm border border-gray-200 bg-gray-50 px-3 dark:border-neutral-700 dark:bg-neutral-800">

                          {popup.cheque_image ? (

                            <a

                              href={`${baseURL}/${popup.cheque_image}`}

                              target="_blank"

                              rel="noopener noreferrer"

                              className="flex items-center gap-2 text-sm font-medium text-[#0446DB] hover:underline dark:text-blue-400"

                            >

                              <FaRegFileImage />

                              View Cheque Image

                            </a>

                          ) : (

                            <span className="text-sm text-gray-400 dark:text-neutral-500">

                              No image available

                            </span>

                          )}

                        </div>

                      ) : (

                        <input

                          type="file"

                          name="cheque_image"

                          accept="image/\*,application/pdf"

                          onChange={handleChange}

                          className="w-full rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-[#0446DB]/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:file:bg-[#0446DB]/20 dark:file:text-blue-400"

                        />

                      )}

                    </div>

                  </div>

                </section>

              </div>



              <DialogFooter className="sticky bottom-0 z-20 flex-row justify-end gap-2 border-t border-gray-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">

                {isEditing ? (

                  <>

                    <Button

                      type="button"

                      variant="outline"

                      onClick={() => {

                        setFormData({ ...popup });

                        loadCitiesForState(popup?.state);

                        setIsEditing(false);

                      }}

                      className="gap-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"

                    >

                      <X className="h-4 w-4" />

                      Cancel

                    </Button>



                    <Button

                      type="submit"

                      disabled={loading}

                      className="gap-2 bg-[#0446DB] text-white hover:bg-[#0339b5]"

                    >

                      {loading ? (

                        <Loader2 className="h-4 w-4 animate-spin" />

                      ) : (

                        <Save className="h-4 w-4" />

                      )}

                      Save Changes

                    </Button>

                  </>

                ) : (

                  <Button

                    type="button"

                    onClick={() => {

                      setFormData({ ...popup });

                      loadCitiesForState(popup?.state);

                      setIsEditing(true);

                    }}

                    className="gap-2 bg-[#0446DB] text-white hover:bg-[#0339b5]"

                  >

                    <Pencil className="h-4 w-4" />

                    Edit Rider

                  </Button>

                )}



                <DialogClose asChild>

                  <Button

                    type="button"

                    variant="outline"

                    className="dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"

                  >

                    Close

                  </Button>

                </DialogClose>

              </DialogFooter>

            </form>

          )}

        </DialogContent>

      </Dialog>



      <Dialog

        open={!!changePasswordPopup}

        onOpenChange={(open) => {

          if (!open) {

            setChangePasswordPopup(null);

            setNewPassword({

              id: "",

              password: "",

              confirmPassword: "",

            });

          }

        }}

      >

        <DialogContent className="w-[95vw] max-w-lg overflow-hidden rounded-sm border border-gray-200 bg-white p-0 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-white">

          <DialogHeader className="border-b border-gray-200 px-6 py-5 dark:border-neutral-800">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[#0446DB]/10 text-[#0446DB] dark:bg-[#0446DB]/20 dark:text-blue-400">

                <KeyRound className="h-5 w-5" />

              </div>



              <div className="text-left">

                <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">

                  Change Password

                </DialogTitle>

                <DialogDescription className="mt-1 text-sm text-gray-500 dark:text-neutral-400">

                  Create a new password for this rider account.

                </DialogDescription>

              </div>

            </div>

          </DialogHeader>



          {changePasswordPopup && (

            <form

              onSubmit={(e) => {

                e.preventDefault();

                handlePasswordChange();

              }}

            >

              <div className="space-y-5 px-6 py-5">

                <div className="grid grid-cols-1 gap-4 rounded-sm border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2 dark:border-neutral-800 dark:bg-neutral-800/50">

                  <div>

                    <p className="text-xs text-gray-500 dark:text-neutral-400">

                      Rider ID

                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">

                      {vendor !== "self"

                        ? `FP${vendor}_${changePasswordPopup.id}`

                        : `DKT_${changePasswordPopup.id}`}

                    </p>

                  </div>



                  <div>

                    <p className="text-xs text-gray-500 dark:text-neutral-400">

                      Rider Name

                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">

                      {changePasswordPopup.name || "N/A"}

                    </p>

                  </div>

                </div>



                <RiderInput

                  label="New Password"

                  type="password"

                  value={newPassword.password}

                  onChange={(e) =>

                    setNewPassword((prev) => ({

                      ...prev,

                      password: e.target.value,

                    }))

                  }

                  placeholder="Enter new password"

                />



                <RiderInput

                  label="Confirm Password"

                  type="password"

                  value={newPassword.confirmPassword}

                  onChange={(e) =>

                    setNewPassword((prev) => ({

                      ...prev,

                      confirmPassword: e.target.value,

                    }))

                  }

                  placeholder="Confirm new password"

                />



                {newPassword.password &&

                  newPassword.confirmPassword &&

                  newPassword.password !== newPassword.confirmPassword && (

                    <p className="text-xs font-medium text-red-500">

                      Passwords do not match.

                    </p>

                  )}

              </div>



              <DialogFooter className="flex-row justify-end gap-2 border-t border-gray-200 bg-gray-50/50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">

                <DialogClose asChild>

                  <Button

                    type="button"

                    variant="outline"

                    className="dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"

                  >

                    Cancel

                  </Button>

                </DialogClose>



                <Button

                  type="submit"

                  disabled={

                    loading ||

                    !newPassword.password ||

                    !newPassword.confirmPassword

                  }

                  className="gap-2 bg-[#0446DB] text-white hover:bg-[#0339b5] disabled:opacity-60"

                >

                  {loading ? (

                    <Loader2 className="h-4 w-4 animate-spin" />

                  ) : (

                    <KeyRound className="h-4 w-4" />

                  )}

                  Update Password

                </Button>

              </DialogFooter>

            </form>

          )}

        </DialogContent>

      </Dialog>

    </div>

  );

}



export default VendorRiders;


