// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { createPortal } from "react-dom";
// import type { ChangeEvent, ChangeEventHandler } from "react";
// import type { StylesConfig, SingleValue } from "react-select";
// import type { LucideIcon } from "lucide-react";
// import axios from "axios";

// import Select from "react-select";

// import { State, City } from "country-state-city";

// import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
//   Search,
//   SlidersHorizontal,
//   RotateCcw,
//   Pencil,
//   Save,
//   UserRound,
//   X,
// } from "lucide-react";

// import AxiosInstance from "@/Helper/axiosInstance";
// import { useNavigate } from "react-router-dom";

// // Keep /api/admin if these Rider routes are mounted in your admin router.
// // Change this prefix if your backend mounts the same routes elsewhere.
// /** Change this prefix only if the Express router is mounted elsewhere. */
// const RIDER_API_BASE = "/api/user";

// type Flag = 0 | 1 | boolean | number | null;

// interface Rider {
//   id: number;
//   name?: string | null;
//   phone?: string | null;
//   email?: string | null;
//   address_line?: string | null;
//   state?: string | null;
//   city?: string | null;
//   pincode?: string | null;
//   facility_city?: string | null;
//   facility_zone?: string | null;
//   bank_name?: string | null;
//   bank_branch?: string | null;
//   bank_account_number?: string | null;
//   bank_ifsc_code?: string | null;
//   rider_type?: string | null;
//   vendor_id?: number | null;
//   is_active?: Flag;
//   is_available?: Flag;
//   account_status?: Flag;
//   is_verified?: Flag;
//   document_type?: string | null;
//   document_id?: string | null;
//   document_image?: string | null;
//   cheque_image?: string | null;
//   vendor_name?: string | null;
//   dc_id?: number | null;
// }

// interface SelectOption {
//   value: string;
//   label: string;
//   isoCode?: string;
// }

// interface VendorOptionApi {
//   id: number;
//   vendor_name?: string | null;
//   company_name?: string | null;
// }

// interface DcOptionApi {
//   id: number;
//   dc_name: string;
//   city?: string | null;
// }

// interface RiderFilters {
//   vendor: string;
//   dcId: string | null;
//   ownership: string;
// }

// const DEFAULT_RIDER_FILTERS: RiderFilters = {
//   vendor: "all",
//   dcId: null,
//   ownership: "",
// };

// const OWNERSHIP_OPTIONS: SelectOption[] = [
//   { value: "", label: "All vendor types" },
//   { value: "independent", label: "Independent vendors" },
//   { value: "dc_owned", label: "DC-owned vendors" },
// ];

// interface Pagination {
//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;
// }

// type ApiResponse<T> = {
//   success?: boolean;
//   message?: string;
//   data?: T;
//   pagination?: Partial<Pagination>;
// };

// type RiderPatch = Partial<
//   Record<EditableRiderField, string> &
//     Record<"account_status" | "is_active" | "is_available", number>
// >;

// type PasswordState = { id: number | ""; password: string; confirmPassword: string };

// function errorMessage(error: unknown, fallback: string): string {
//   if (axios.isAxiosError<{ message?: string }>(error)) {
//     return error.response?.data?.message || error.message || fallback;
//   }
//   return error instanceof Error ? error.message : fallback;
// }

// const baseURL = import.meta.env.VITE_BASE_URL || "";

// const EDITABLE_RIDER_FIELDS = [
//   "name",
//   "phone",
//   "email",
//   "address_line",
//   "state",
//   "city",
//   "pincode",
//   "facility_city",
//   "facility_zone",
//   "bank_name",
//   "bank_account_number",
//   "bank_branch",
//   "bank_ifsc_code",
// ] as const;

// type EditableRiderField = (typeof EDITABLE_RIDER_FIELDS)[number];

// const isEnabled = (value: Flag | undefined): boolean => Number(value) === 1;
// const riderDisplayId = (rider: Rider | null): string =>
//   rider?.vendor_id && rider?.rider_type !== "self"
//     ? `FP${rider.vendor_id}_${rider.id}`
//     : `DKT_${rider?.id ?? ""}`;

// const fileUrl = (path?: string | null): string =>
//   !path
//     ? ""
//     : /^(https?:)?\/\//i.test(path)
//       ? path
//       : `${baseURL.replace(/\/$/, "")}/${String(path).replace(/^\/+/, "")}`;

// const INDIACOUNTRYCODE = "IN";

// const indianStates = State.getStatesOfCountry(INDIACOUNTRYCODE);

// const stateOptions = indianStates.map((state) => ({
//   value: state.name,

//   label: state.name,

//   isoCode: state.isoCode,
// }));

// const getCitiesByStateName = (stateName?: string | null): SelectOption[] => {
//   if (!stateName) return [];

//   const selectedState = indianStates.find(
//     (state) => state.name.toLowerCase() === String(stateName).toLowerCase(),
//   );

//   if (!selectedState) return [];

//   return City.getCitiesOfState(
//     INDIACOUNTRYCODE,

//     selectedState.isoCode,
//   ).map((city) => ({
//     value: city.name,

//     label: city.name,
//   }));
// };

// const getSelectStyles = (isDark: boolean): StylesConfig<SelectOption, false> => ({
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

//     borderColor: state.isFocused ? "#0446DB" : isDark ? "#404040" : "#d1d5db",

//     boxShadow: state.isFocused ? "0 0 0 2px rgba(4, 70, 219, 0.12)" : "none",

//     cursor: state.isDisabled ? "not-allowed" : "pointer",

//     opacity: state.isDisabled ? 0.65 : 1,

//     "&:hover": {
//       borderColor: state.isFocused ? "#0446DB" : isDark ? "#525252" : "#9ca3af",
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

//     color: state.isSelected ? "#ffffff" : isDark ? "#f5f5f5" : "#111827",
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
//     typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : false,
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

// interface RiderInputProps {
//   label: string;
//   name?: string;
//   value?: string | number | null;
//   onChange?: ChangeEventHandler<HTMLInputElement>;
//   disabled?: boolean;
//   type?: string;
//   placeholder?: string;
// }

// const RiderInput = ({
//   label,
//   name,
//   value,
//   onChange,
//   disabled = false,
//   type = "text",
//   placeholder = "",
// }: RiderInputProps) => (
//   <div className="space-y-1.5">
//     <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">{label}</label>

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

// interface StatusCardProps {
//   label: string;
//   active: boolean;
//   activeText: string;
//   inactiveText: string;
// }
// const StatusCard = ({ label, active, activeText, inactiveText }: StatusCardProps) => (
//   <div className="flex items-center justify-between rounded-sm border border-gray-200 bg-gray-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/50">
//     <span className="text-sm text-gray-500 dark:text-neutral-400">{label}</span>

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

// interface InfoCardProps {
//   label: string;
//   value?: string | number | null;
// }
// const InfoCard = ({ label, value }: InfoCardProps) => (
//   <div className="rounded-sm border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
//     <p className="text-xs font-medium text-gray-500 dark:text-neutral-400">{label}</p>

//     <p className="mt-1 break-words text-sm font-semibold text-gray-900 dark:text-white">
//       {value || "N/A"}
//     </p>
//   </div>
// );

// interface SectionTitleProps {
//   icon: LucideIcon;
//   title: string;
//   description?: string;
// }
// const SectionTitle = ({ icon: Icon, title, description }: SectionTitleProps) => (
//   <div className="mb-4 flex items-center gap-3 border-b border-gray-200 pb-3 dark:border-neutral-800">
//     <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-[#0446DB]/10 text-[#0446DB] dark:bg-[#0446DB]/20 dark:text-blue-400">
//       <Icon className="h-4 w-4" />
//     </div>

//     <div>
//       <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>

//       {description && (
//         <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">{description}</p>
//       )}
//     </div>
//   </div>
// );

// interface ToggleSwitchProps {
//   checked: boolean;
//   onClick: () => void;
//   disabled?: boolean;
// }
// const ToggleSwitch = ({ checked, onClick, disabled = false }: ToggleSwitchProps) => (
//   <button
//     type="button"
//     disabled={disabled}
//     onClick={onClick}
//     className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0446DB]/20 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 ${
//       checked ? "bg-green-500" : "bg-gray-300 dark:bg-neutral-700"
//     } ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
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
//   const requestIdRef = useRef(0);

//   const [loading, setLoading] = useState(false);
//   const [loadingPage, setLoadingPage] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [updatingRiderId, setUpdatingRiderId] = useState<number | null>(null);

//   const [vendorOptions, setVendorOptions] = useState<SelectOption[]>([
//     { value: "all", label: "All Riders" },
//     { value: "self", label: "Self Riders" },
//   ]);
//   const [dcOptions, setDcOptions] = useState<SelectOption[]>([]);
//   const [vendor, setVendor] = useState("all");
//   const [dcId, setDcId] = useState<string | null>(null);
//   const [ownership, setOwnership] = useState("");
//   const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
//   const [draftFilters, setDraftFilters] = useState<RiderFilters>({ ...DEFAULT_RIDER_FILTERS });
//   const filterCloseButtonRef = useRef<HTMLButtonElement>(null);
//   const activeFilterCount =
//     Number(vendor !== "all") + Number(Boolean(dcId)) + Number(Boolean(ownership));
//   const [searchText, setSearchText] = useState("");
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(20);
//   const [pagination, setPagination] = useState<Pagination>({
//     page: 1,
//     limit: 20,
//     total: 0,
//     totalPages: 0,
//   });
//   const [riders, setRiders] = useState<Rider[]>([]);

//   const [popup, setPopup] = useState<Rider | null>(null);
//   const [riderDialogPortal, setRiderDialogPortal] = useState<HTMLDivElement | null>(null);
//   const [formData, setFormData] = useState<Rider | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [cityOptions, setCityOptions] = useState<SelectOption[]>([]);
//   const [facilityCityOptions, setFacilityCityOptions] = useState<SelectOption[]>([]);
//   const [changePasswordPopup, setChangePasswordPopup] = useState<Rider | null>(null);
//   const [newPassword, setNewPassword] = useState<PasswordState>({
//     id: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const navigate = useNavigate()

//   const [permissions, setPermissions] = useState(localStorage.getItem("permission"))
//   const getUserPermissions = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/api/user/getUserPermissions`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       const permission = res?.data?.data?.data || [];

//       if (
//         !permission.includes("VIEW_RIDER") &&
//         !permission.includes("ADMIN_FULL_ACCESS")
//       ) {
//         navigate("/unauthorized");
//         return;
//       }
//       setPermissions(res?.data?.data?.data)


//     } catch (error) {
//       toast.error('')
//     }
//   }

//   const openFilterDrawer = (): void => {
//     // Edits inside the drawer are drafts until Apply Filters is clicked.
//     setDraftFilters({ vendor, dcId, ownership });
//     setIsFilterDrawerOpen(true);
//   };

//   const applyFilters = (): void => {
//     setVendor(draftFilters.vendor);
//     setDcId(draftFilters.dcId);
//     setOwnership(draftFilters.ownership);
//     setPage(1);
//     setIsFilterDrawerOpen(false);
//   };

//   const resetFilters = (): void => {
//     setDraftFilters({ ...DEFAULT_RIDER_FILTERS });
//     setVendor("all");
//     setDcId(null);
//     setOwnership("");
//     setPage(1);
//     setIsFilterDrawerOpen(false);
//   };

//   useEffect(() => {
//     if (!isFilterDrawerOpen || typeof document === "undefined") return;
//     const previouslyFocusedElement =
//       document.activeElement instanceof HTMLElement ? document.activeElement : null;
//     const previousOverflow = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     filterCloseButtonRef.current?.focus();

//     const onKeyDown = (event: KeyboardEvent) => {
//       if (event.key === "Escape") setIsFilterDrawerOpen(false);
//     };
//     document.addEventListener("keydown", onKeyDown);
//     return () => {
//       document.removeEventListener("keydown", onKeyDown);
//       document.body.style.overflow = previousOverflow;
//       previouslyFocusedElement?.focus();
//     };
//   }, [isFilterDrawerOpen]);

//   const fetchRiders = useCallback(
//     async ({ silent = false }: { silent?: boolean } = {}): Promise<void> => {
//       const currentRequest = ++requestIdRef.current;
//       if (!silent) setLoading(true);
//       const params: Record<string, string | number> = { page, limit };
//       if (vendor === "self") params.rider_type = "self";
//       else if (vendor !== "all") params.vendor_id = Number(vendor);
//       if (dcId) params.dc_id = Number(dcId);
//       if (ownership) params.vendor_ownership = ownership;
//       if (search) params.search = search;

//       try {
//         const response = await AxiosInstance.get<ApiResponse<Rider[]>>(
//           `${RIDER_API_BASE}/getRiders`,
//           { params },
//         );
//         if (currentRequest !== requestIdRef.current) return;
//         if (response.data?.success === false) throw new Error(response.data.message);
//         setRiders(Array.isArray(response.data?.data) ? response.data.data : []);
//         const info = response.data?.pagination || {};
//         setPagination({
//           page: Number(info.page) || page,
//           limit: Number(info.limit) || limit,
//           total: Number(info.total) || 0,
//           totalPages: Number(info.totalPages) || 0,
//         });
//       } catch (error) {
//         if (currentRequest !== requestIdRef.current) return;
//         setRiders([]);
//         setPagination({ page, limit, total: 0, totalPages: 0 });
//         toast.error(errorMessage(error, "Failed to fetch riders"));
//       } finally {
//         if (currentRequest === requestIdRef.current) setLoading(false);
//       }
//     },
//     [page, limit, vendor, dcId, ownership, search],
//   );

//   useEffect(() => {
//     let alive = true;
//     async function fetchFilterOptions() {
//       try {
//         const response = await AxiosInstance.get<
//           ApiResponse<{ vendors: VendorOptionApi[]; dcs: DcOptionApi[] }>
//         >(`${RIDER_API_BASE}/riderFilterOptions`);
//         if (!alive) return;
//         if (response.data?.success === false) throw new Error(response.data.message);
//         const { vendors = [], dcs = [] } = response.data?.data || {};
//         setVendorOptions([
//           { value: "all", label: "All Riders" },
//           { value: "self", label: "Self Riders" },
//           ...vendors.map((item) => ({
//             value: String(item.id),
//             label: `FP${item.id}: ${item.vendor_name || item.company_name || "Vendor"}`,
//           })),
//         ]);
//         setDcOptions(
//           dcs.map((item) => ({
//             value: String(item.id),
//             label: `${item.dc_name}${item.city ? ` - ${item.city}` : ""}`,
//           })),
//         );
//       } catch (error) {
//         if (alive) toast.error(errorMessage(error, "Failed to load rider filters"));
//       } finally {
//         if (alive) setLoadingPage(false);
//       }
//     }
//     fetchFilterOptions();
//     return () => {
//       alive = false;
//     };
//   }, []);

//   useEffect(() => {
//     getUserPermissions()
//     fetchRiders();
//     return () => {
//       requestIdRef.current += 1;
//     };
//   }, [fetchRiders]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const next = searchText.trim();
//       if (next !== search) {
//         setSearch(next);
//         setPage(1);
//       }
//     }, 350);
//     return () => clearTimeout(timer);
//   }, [searchText, search]);

//   const loadCitiesForState = (stateName?: string | null): void => {
//     const cities = getCitiesByStateName(stateName);
//     setCityOptions(cities);
//     setFacilityCityOptions(cities);
//   };

//   const openRiderDetails = (rider: Rider): void => {
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

//   const updateRider = async (
//     id: number,
//     payload: RiderPatch,
//     successText?: string,
//   ): Promise<boolean> => {
//     setUpdatingRiderId(id);
//     try {
//       const response = await AxiosInstance.post<ApiResponse<{ rider_id: number }>>(
//         `${RIDER_API_BASE}/updateRider/${id}`,
//         payload,
//       );
//       if (response.data?.success === false) throw new Error(response.data.message);
//       toast.success(response.data?.message || successText || "Rider updated successfully");
//       await fetchRiders({ silent: true });
//       return true;
//     } catch (error) {
//       toast.error(errorMessage(error, "Failed to update rider"));
//       return false;
//     } finally {
//       setUpdatingRiderId(null);
//     }
//   };

//   const changeVerificationStatus = (id: number, status: number) =>
//     updateRider(id, { account_status: status }, "Account status updated");
//   const changeActiveStatus = (id: number, status: number) =>
//     updateRider(id, { is_active: status }, "Rider active status updated");
//   const changeAvailabilityStatus = (id: number, status: number) =>
//     updateRider(id, { is_available: status }, "Availability updated");

//   const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
//     const { name, value } = event.target;
//     setFormData((previous) => (previous ? { ...previous, [name]: value } : null));
//   };

//   const handleStateChange = (option: SingleValue<SelectOption>): void => {
//     const state = option?.value || "";
//     setFormData((previous) =>
//       previous ? { ...previous, state, city: "", facility_city: "" } : null,
//     );
//     loadCitiesForState(state);
//   };

//   const handleSave = async () => {
//     if (!formData?.id || !popup) return;
    
//     // Only send editable, changed fields. Never send the full rider object.
//     // The backend PATCH service accepts JSON, not multipart/form-data.
//     const payload: RiderPatch = {};
//     for (const field of EDITABLE_RIDER_FIELDS) {
//       const next = String(formData[field] ?? "").trim();
//       const previous = String(popup[field] ?? "").trim();
//       if (next !== previous) payload[field] = next;
//     }
//     if (!Object.keys(payload).length) {
//       toast.info("No changes to save");
//       return;
//     }
//     setSaving(true);
//     try {
//       const response = await AxiosInstance.patch<ApiResponse<{ rider_id: number }>>(
//         `${RIDER_API_BASE}/updateRider/${formData.id}`,
//         payload,
//       );
//       if (response.data?.success === false) throw new Error(response.data.message);
//       toast.success(response.data?.message || "Rider updated successfully");
//       closeRiderDetails();
//       await fetchRiders({ silent: true });
//     } catch (error) {
//       toast.error(errorMessage(error, "Failed to save rider"));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handlePasswordChange = async () => {
//     const { id, password, confirmPassword } = newPassword;
//     if (!id || !password || !confirmPassword) {
//       toast.error("Enter and confirm the new password");
//       return;
//     }
//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }
//     if (password.length < 8 || new TextEncoder().encode(password).length > 72) {
//       toast.error("Password must have at least 8 characters and at most 72 bytes");
//       return;
//     }
//     setSaving(true);
//     try {
//       const response = await AxiosInstance.patch<ApiResponse<{ rider_id: number }>>(
//         `${RIDER_API_BASE}/updateRider/${id}`,
//         {
//           password,
//           confirmPassword,
//         },
//       );
//       if (response.data?.success === false) throw new Error(response.data.message);
//       toast.success(response.data?.message || "Password updated successfully");
//       setChangePasswordPopup(null);
//       setNewPassword({ id: "", password: "", confirmPassword: "" });
//     } catch (error) {
//       toast.error(errorMessage(error, "Failed to change password"));
//     } finally {
//       setSaving(false);
//     }
//   };

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
//     <div className="relative isolate h-[calc(100dvh-100px)] min-h-0 overflow-y-auto overscroll-contain text-gray-900 dark:bg-neutral-950 dark:text-white">
//       <div className="sticky top-0 z-40 border-b border-gray-200  px-4 py-4  dark:border-neutral-800 dark:bg-neutral-900">
//         <div className="flex flex-wrap items-center justify-between gap-4">
//           <div>
//             <h1 className="text-xl font-semibold text-gray-900 dark:text-white md:text-2xl">
//               Vendor Riders
//             </h1>
//             <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
//               Manage rider status, profile and account information.
//             </p>
//           </div>
         
//         </div>
//         <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div className="relative w-full sm:max-w-[440px]">
//             <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//             <input
//               value={searchText}
//               onChange={(event) => setSearchText(event.target.value)}
//               placeholder="Search rider name, email, phone..."
//               aria-label="Search riders"
//               className="h-[42px] w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             {activeFilterCount > 0 && (
//               <button
//                 type="button"
//                 onClick={resetFilters}
//                 className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
//               >
//                 <RotateCcw className="h-3.5 w-3.5" />
//                 Clear filters
//               </button>
//             )}
//             <Button
//               type="button"
//               variant="outline"
//               onClick={openFilterDrawer}
//               aria-label={`Open rider filters${activeFilterCount ? `, ${activeFilterCount} active` : ""}`}
//               className="h-[42px] gap-2 rounded-md border-gray-200 bg-white px-4 font-semibold text-gray-700 shadow-sm hover:border-[#0446DB]/40 hover:bg-blue-50 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
//             >
//               <SlidersHorizontal className="h-4 w-4" />
//               Filters
//               {activeFilterCount > 0 && (
//                 <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0446DB] px-1.5 text-[11px] font-bold text-white">
//                   {activeFilterCount}
//                 </span>
//               )}
//             </Button>
//           </div>
//         </div>
//         {activeFilterCount > 0 && (
//           <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
//             <span className="text-gray-500 dark:text-neutral-400">Active:</span>
//             {vendor !== "all" && (
//               <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 font-medium text-[#0446DB] dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
//                 {vendorOptions.find((option) => option.value === vendor)?.label || "Vendor"}
//               </span>
//             )}
//             {dcId && (
//               <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 font-medium text-[#0446DB] dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
//                 {dcOptions.find((option) => option.value === dcId)?.label || "DC"}
//               </span>
//             )}
//             {ownership && (
//               <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 font-medium text-[#0446DB] dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
//                 {OWNERSHIP_OPTIONS.find((option) => option.value === ownership)?.label ||
//                   "Ownership"}
//               </span>
//             )}
//           </div>
//         )}
//       </div>

//       <div className="">
//         <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
//           <div className="h-[calc(100dvh-290px)] min-h-[320px] w-full overflow-auto overscroll-contain">
//             <table className="w-full min-w-[1000px] caption-bottom text-sm border-separate border-spacing-0">
//               <TableHeader className="bg-gray-50 dark:bg-neutral-800">
//                 <TableRow className="border-gray-200 hover:bg-transparent dark:border-neutral-800">
//                   <TableHead className="sticky top-0 z-30 bg-gray-50 dark:bg-neutral-800 px-4 py-3 text-xs font-semibold text-gray-600 dark:text-neutral-300">
//                     RIDER ID
//                   </TableHead>

//                   <TableHead className="sticky top-0 z-30 bg-gray-50 dark:bg-neutral-800 px-4 py-3 text-xs font-semibold text-gray-600 dark:text-neutral-300">
//                     RIDER NAME
//                   </TableHead>

//                   <TableHead className="sticky top-0 z-30 bg-gray-50 dark:bg-neutral-800 px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-neutral-300">
//                     ACCOUNT STATUS
//                   </TableHead>

//                   <TableHead className="sticky top-0 z-30 bg-gray-50 dark:bg-neutral-800 px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-neutral-300">
//                     ACTIVE
//                   </TableHead>

//                   <TableHead className="sticky top-0 z-30 bg-gray-50 dark:bg-neutral-800 px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-neutral-300">
//                     AVAILABLE
//                   </TableHead>

//                   <TableHead className="sticky top-0 z-30 bg-gray-50 dark:bg-neutral-800 px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-neutral-300">
//                     RIDER DOCUMENT
//                   </TableHead>

//                   <TableHead className="sticky top-0 z-30 bg-gray-50 dark:bg-neutral-800 px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-neutral-300">
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
//                           Try a different rider search or filter.
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
//                         {riderDisplayId(rider)}
//                       </TableCell>

//                       <TableCell className="px-4 py-4 text-gray-700 dark:text-neutral-300">
//                         {rider.name || "-"}
//                       </TableCell>

//                       <TableCell className="px-4 py-4 text-center">
//                         <ToggleSwitch
//                           checked={isEnabled(rider.account_status)}
//                           disabled={updatingRiderId !== null || rider.account_status == null}
//                           onClick={() =>
//                             changeVerificationStatus(
//                               rider.id,

//                               isEnabled(rider.account_status) ? 0 : 1,
//                             )
//                           }
//                         />
//                       </TableCell>

//                       <TableCell className="px-4 py-4 text-center">
//                         <ToggleSwitch
//                           checked={isEnabled(rider.is_active)}
//                           disabled={updatingRiderId !== null || !isEnabled(rider.account_status)}
//                           onClick={() => {
//                             if (isEnabled(rider.account_status)) {
//                               changeActiveStatus(
//                                 rider.id,

//                                 isEnabled(rider.is_active) ? 0 : 1,
//                               );
//                             }
//                           }}
//                         />
//                       </TableCell>

//                       <TableCell className="px-4 py-4 text-center">
//                         <ToggleSwitch
//                           checked={isEnabled(rider.is_available)}
//                           disabled={
//                             updatingRiderId !== null ||
//                             !isEnabled(rider.account_status) ||
//                             !isEnabled(rider.is_active)
//                           }
//                           onClick={() => {
//                             if (isEnabled(rider.account_status) && isEnabled(rider.is_active)) {
//                               changeAvailabilityStatus(
//                                 rider.id,

//                                 isEnabled(rider.is_available) ? 0 : 1,
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
//             </table>
//           </div>
//           <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3 text-sm dark:border-neutral-800 dark:bg-neutral-900">
//             <span className="text-gray-500 dark:text-neutral-400">
//               {pagination.total === 0
//                 ? "0 riders"
//                 : `${(page - 1) * limit + 1}-${Math.min(page * limit, pagination.total)} of ${pagination.total} riders`}
//             </span>
//             <div className="flex flex-wrap items-center gap-2">
//               <label htmlFor="rider-page-limit" className="text-gray-500 dark:text-neutral-400">
//                 Rows
//               </label>
//               <select
//                 id="rider-page-limit"
//                 value={limit}
//                 onChange={(event) => {
//                   setLimit(Number(event.target.value));
//                   setPage(1);
//                 }}
//                 className="rounded border border-gray-300 bg-white px-2 py-1 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
//               >
//                 {[20, 50, 100].map((size) => (
//                   <option key={size} value={size}>
//                     {size}
//                   </option>
//                 ))}
//               </select>
//               <button
//                 type="button"
//                 disabled={page <= 1 || loading}
//                 onClick={() => setPage((value) => Math.max(1, value - 1))}
//                 className="rounded border border-gray-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700"
//               >
//                 Previous
//               </button>
//               <span className="px-2 text-gray-700 dark:text-neutral-200">
//                 Page {page} / {Math.max(pagination.totalPages, 1)}
//               </span>
//               <button
//                 type="button"
//                 disabled={page >= pagination.totalPages || loading}
//                 onClick={() => setPage((value) => value + 1)}
//                 className="rounded border border-gray-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {isFilterDrawerOpen &&
//         typeof document !== "undefined" &&
//         createPortal(
//           <div className="fixed inset-0 z-[9990]">
//             <div
//               className="absolute inset-0 bg-gray-950/50 backdrop-blur-[2px]"
//               onClick={() => setIsFilterDrawerOpen(false)}
//               aria-hidden="true"
//             />
//             <aside
//               role="dialog"
//               aria-modal="true"
//               aria-labelledby="rider-filters-title"
//               className="absolute inset-y-0 right-0 flex w-full max-w-[430px] flex-col bg-white shadow-2xl dark:bg-neutral-900"
//               style={{ animation: "rider-filter-drawer-enter 220ms ease-out both" }}
//             >
//               <div className="border-b border-gray-200 px-6 py-5 dark:border-neutral-800">
//                 <div className="flex items-start justify-between gap-3">
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0446DB]/10 text-[#0446DB] dark:bg-blue-500/20 dark:text-blue-400">
//                       <SlidersHorizontal className="h-5 w-5" />
//                     </div>
//                     <div>
//                       <h2
//                         id="rider-filters-title"
//                         className="text-lg font-semibold text-gray-900 dark:text-white"
//                       >
//                         Filter Riders
//                       </h2>
//                       <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
//                         Select criteria to narrow your list
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     ref={filterCloseButtonRef}
//                     type="button"
//                     onClick={() => setIsFilterDrawerOpen(false)}
//                     aria-label="Close rider filters"
//                     className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0446DB] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
//                   >
//                     <X className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>

//               <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6">
               
//                 <div className="space-y-2">
//                   <label
//                     htmlFor="rider-filter-vendor"
//                     className="block text-sm font-semibold text-gray-700 dark:text-neutral-200"
//                   >
//                     Vendor / Rider Group
//                   </label>
//                   <Select<SelectOption, false>
//                     inputId="rider-filter-vendor"
//                     options={vendorOptions}
//                     value={
//                       vendorOptions.find((option) => option.value === draftFilters.vendor) ||
//                       vendorOptions[0]
//                     }
//                     onChange={(option) =>
//                       setDraftFilters((prev) => ({ ...prev, vendor: option?.value || "all" }))
//                     }
//                     placeholder="All Riders"
//                     isSearchable
//                     menuPortalTarget={document.body}
//                     menuPosition="fixed"
//                     styles={selectStyles}
//                   />
//                   <p className="text-xs text-gray-500 dark:text-neutral-500">
//                     Includes all riders, self riders, or a specific vendor.
//                   </p>
//                 </div>

//                 <div className="space-y-2">
//                   <label
//                     htmlFor="rider-filter-dc"
//                     className="block text-sm font-semibold text-gray-700 dark:text-neutral-200"
//                   >
//                     Delivery Center (DC)
//                   </label>
//                   <Select<SelectOption, false>
//                     inputId="rider-filter-dc"
//                     options={dcOptions}
//                     value={dcOptions.find((option) => option.value === draftFilters.dcId) || null}
//                     onChange={(option) =>
//                       setDraftFilters((prev) => ({ ...prev, dcId: option?.value || null }))
//                     }
//                     placeholder="All DCs"
//                     isClearable
//                     isSearchable
//                     menuPortalTarget={document.body}
//                     menuPosition="fixed"
//                     styles={selectStyles}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label
//                     htmlFor="rider-filter-ownership"
//                     className="block text-sm font-semibold text-gray-700 dark:text-neutral-200"
//                   >
//                     Vendor Ownership
//                   </label>
//                   <Select<SelectOption, false>
//                     inputId="rider-filter-ownership"
//                     options={OWNERSHIP_OPTIONS}
//                     value={
//                       OWNERSHIP_OPTIONS.find((option) => option.value === draftFilters.ownership) ||
//                       OWNERSHIP_OPTIONS[0]
//                     }
//                     onChange={(option) =>
//                       setDraftFilters((prev) => ({ ...prev, ownership: option?.value || "" }))
//                     }
//                     placeholder="All vendor types"
//                     menuPortalTarget={document.body}
//                     menuPosition="fixed"
//                     styles={selectStyles}
//                   />
//                 </div>
//               </div>

//               <div className="flex shrink-0 items-center gap-3 border-t border-gray-200 bg-white px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={resetFilters}
//                   className="h-11 flex-1 gap-2 rounded-md border-gray-300 font-medium dark:border-neutral-700 dark:text-white"
//                 >
//                   <RotateCcw className="h-4 w-4" />
//                   Reset All
//                 </Button>
//                 <Button
//                   type="button"
//                   onClick={applyFilters}
//                   className="h-11 flex-1 rounded-md bg-[#0446DB] font-semibold text-white hover:bg-[#0339b5]"
//                 >
//                   Apply Filters
//                 </Button>
//               </div>
//             </aside>
//             <style>{`@keyframes rider-filter-drawer-enter { from { transform: translateX(100%); opacity: .8; } to { transform: translateX(0); opacity: 1; } }`}</style>
//           </div>,
//           document.body,
//         )}

//       <Dialog
//         open={!!popup}
//         onOpenChange={(open) => {
//           if (!open) closeRiderDetails();
//         }}
//       >
//         <DialogContent
//           ref={setRiderDialogPortal}
//           className="max-h-[90vh] !max-w-[60vw] overflow-y-auto rounded-sm border border-gray-200 bg-white p-0 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-white max-lg:!max-w-[90vw] max-sm:!max-w-[95vw]"
//         >
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
//                   View and update rider profile, location, documents and bank information.
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
//                   <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
//                     <StatusCard
//                       label="Account"
//                       active={isEnabled(popup.account_status)}
//                       activeText="Active"
//                       inactiveText="Not Active"
//                     />

//                     <StatusCard
//                       label="Rider Status"
//                       active={isEnabled(popup.is_active)}
//                       activeText="Active"
//                       inactiveText="Inactive"
//                     />

//                     <StatusCard
//                       label="Availability"
//                       active={isEnabled(popup.is_available)}
//                       activeText="Available"
//                       inactiveText="Unavailable"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                     <RiderInput label="Rider ID" value={riderDisplayId(popup)} disabled />

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
//                                   String(formData.state).toLowerCase(),
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
//                                   String(formData.city).toLowerCase(),
//                               ) || {
//                                 value: formData.city,

//                                 label: formData.city,
//                               }
//                             : null
//                         }
//                         onChange={(selectedOption) =>
//                           setFormData((prev) =>
//                             prev
//                               ? {
//                                   ...prev,
//                                   city: selectedOption?.value || "",
//                                 }
//                               : null,
//                           )
//                         }
//                         placeholder={formData?.state ? "Select city" : "Select state first"}
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
//                                   String(formData.facility_city).toLowerCase(),
//                               ) || {
//                                 value: formData.facility_city,

//                                 label: formData.facility_city,
//                               }
//                             : null
//                         }
//                         onChange={(selectedOption) =>
//                           setFormData((prev) =>
//                             prev
//                               ? {
//                                   ...prev,
//                                   facility_city: selectedOption?.value || "",
//                                 }
//                               : null,
//                           )
//                         }
//                         placeholder={
//                           formData?.state ? "Select facility city" : "Select state first"
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
//                     <InfoCard label="Document Type" value={popup.document_type || "N/A"} />

//                     <InfoCard label="Document ID" value={popup.document_id || "N/A"} />

//                     <div className="rounded-sm border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
//                       <p className="text-xs font-medium text-gray-500 dark:text-neutral-400">
//                         Document File
//                       </p>

//                       {popup.document_image ? (
//                         <a
//                           href={fileUrl(popup.document_image)}
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

//                       <div className="flex min-h-[42px] items-center rounded-sm border border-gray-200 bg-gray-50 px-3 dark:border-neutral-700 dark:bg-neutral-800">
//                         {popup.cheque_image ? (
//                           <a
//                             href={fileUrl(popup.cheque_image)}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center gap-2 text-sm font-medium text-[#0446DB] hover:underline dark:text-blue-400"
//                           >
//                             <FaRegFileImage /> View Cheque Image
//                           </a>
//                         ) : (
//                           <span className="text-sm text-gray-400 dark:text-neutral-500">
//                             No image available
//                           </span>
//                         )}
//                       </div>
//                       {isEditing && (
//                         <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
//                           Cheque upload is not supported by the current JSON PATCH API.
//                         </p>
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
//                       disabled={saving}
//                       className="gap-2 bg-[#0446DB] text-white hover:bg-[#0339b5]"
//                     >
//                       {saving ? (
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                       ) : (
//                         <Save className="h-4 w-4" />
//                       )}
//                       Save Changes
//                     </Button>
//                   </>
//                 ) : (

//                   <>

//                   {
//                     (permissions?.includes('UPDATE_RIDER') || permissions?.includes('ADMIN_FULL_ACCESS')) && (

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
//                     )
//                   }
                  
//                   </>
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
//                     <p className="text-xs text-gray-500 dark:text-neutral-400">Rider ID</p>

//                     <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
//                       {riderDisplayId(changePasswordPopup)}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-xs text-gray-500 dark:text-neutral-400">Rider Name</p>

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
//                     <p className="text-xs font-medium text-red-500">Passwords do not match.</p>
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
//                   disabled={saving || !newPassword.password || !newPassword.confirmPassword}
//                   className="gap-2 bg-[#0446DB] text-white hover:bg-[#0339b5] disabled:opacity-60"
//                 >
//                   {saving ? (
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





import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ChangeEvent, ChangeEventHandler } from "react";
import type { StylesConfig, SingleValue } from "react-select";
import type { LucideIcon } from "lucide-react";
import axios from "axios";

import Select from "react-select";

import { State, City } from "country-state-city";

import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  Search,
  SlidersHorizontal,
  RotateCcw,
  RefreshCcw,
  Eye,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Save,
  UserRound,
  X,
} from "lucide-react";

import AxiosInstance from "@/Helper/axiosInstance";
import { useNavigate } from "react-router-dom";

// Keep /api/admin if these Rider routes are mounted in your admin router.
// Change this prefix if your backend mounts the same routes elsewhere.
/** Change this prefix only if the Express router is mounted elsewhere. */
const RIDER_API_BASE = "/api/user";

type Flag = 0 | 1 | boolean | number | null;

interface Rider {
  id: number;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  address_line?: string | null;
  state?: string | null;
  city?: string | null;
  pincode?: string | null;
  facility_city?: string | null;
  facility_zone?: string | null;
  bank_name?: string | null;
  bank_branch?: string | null;
  bank_account_number?: string | null;
  bank_ifsc_code?: string | null;
  rider_type?: string | null;
  vendor_id?: number | null;
  is_active?: Flag;
  is_available?: Flag;
  account_status?: Flag;
  is_verified?: Flag;
  document_type?: string | null;
  document_id?: string | null;
  document_image?: string | null;
  cheque_image?: string | null;
  vendor_name?: string | null;
  dc_id?: number | null;
}

interface SelectOption {
  value: string;
  label: string;
  isoCode?: string;
}

interface VendorOptionApi {
  id: number;
  vendor_name?: string | null;
  company_name?: string | null;
}

interface DcOptionApi {
  id: number;
  dc_name: string;
  city?: string | null;
}

interface RiderFilters {
  vendor: string;
  dcId: string | null;
  ownership: string;
}

const DEFAULT_RIDER_FILTERS: RiderFilters = {
  vendor: "all",
  dcId: null,
  ownership: "",
};

const OWNERSHIP_OPTIONS: SelectOption[] = [
  { value: "", label: "All vendor types" },
  { value: "independent", label: "Independent vendors" },
  { value: "dc_owned", label: "DC-owned vendors" },
];

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  pagination?: Partial<Pagination>;
};

type RiderPatch = Partial<
  Record<EditableRiderField, string> &
    Record<"account_status" | "is_active" | "is_available", number>
>;

type PasswordState = { id: number | ""; password: string; confirmPassword: string };

function errorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

const baseURL = import.meta.env.VITE_BASE_URL || "";

const EDITABLE_RIDER_FIELDS = [
  "name",
  "phone",
  "email",
  "address_line",
  "state",
  "city",
  "pincode",
  "facility_city",
  "facility_zone",
  "bank_name",
  "bank_account_number",
  "bank_branch",
  "bank_ifsc_code",
] as const;

type EditableRiderField = (typeof EDITABLE_RIDER_FIELDS)[number];

const isEnabled = (value: Flag | undefined): boolean => Number(value) === 1;
const riderDisplayId = (rider: Rider | null): string =>
  rider?.vendor_id && rider?.rider_type !== "self"
    ? `FP${rider.vendor_id}_${rider.id}`
    : `DKT_${rider?.id ?? ""}`;

const fileUrl = (path?: string | null): string =>
  !path
    ? ""
    : /^(https?:)?\/\//i.test(path)
      ? path
      : `${baseURL.replace(/\/$/, "")}/${String(path).replace(/^\/+/, "")}`;

const INDIACOUNTRYCODE = "IN";

const indianStates = State.getStatesOfCountry(INDIACOUNTRYCODE);

const stateOptions = indianStates.map((state) => ({
  value: state.name,

  label: state.name,

  isoCode: state.isoCode,
}));

const getCitiesByStateName = (stateName?: string | null): SelectOption[] => {
  if (!stateName) return [];

  const selectedState = indianStates.find(
    (state) => state.name.toLowerCase() === String(stateName).toLowerCase(),
  );

  if (!selectedState) return [];

  return City.getCitiesOfState(
    INDIACOUNTRYCODE,

    selectedState.isoCode,
  ).map((city) => ({
    value: city.name,

    label: city.name,
  }));
};

const getSelectStyles = (isDark: boolean): StylesConfig<SelectOption, false> => ({
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

    borderColor: state.isFocused ? "#0446DB" : isDark ? "#404040" : "#d1d5db",

    boxShadow: state.isFocused ? "0 0 0 2px rgba(4, 70, 219, 0.12)" : "none",

    cursor: state.isDisabled ? "not-allowed" : "pointer",

    opacity: state.isDisabled ? 0.65 : 1,

    "&:hover": {
      borderColor: state.isFocused ? "#0446DB" : isDark ? "#525252" : "#9ca3af",
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

    color: state.isSelected ? "#ffffff" : isDark ? "#f5f5f5" : "#111827",
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
    typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : false,
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

interface RiderInputProps {
  label: string;
  name?: string;
  value?: string | number | null;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
}

const RiderInput = ({
  label,
  name,
  value,
  onChange,
  disabled = false,
  type = "text",
  placeholder = "",
}: RiderInputProps) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">{label}</label>

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

interface StatusCardProps {
  label: string;
  active: boolean;
  activeText: string;
  inactiveText: string;
}
const StatusCard = ({ label, active, activeText, inactiveText }: StatusCardProps) => (
  <div className="flex items-center justify-between rounded-sm border border-gray-200 bg-gray-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/50">
    <span className="text-sm text-gray-500 dark:text-neutral-400">{label}</span>

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

interface InfoCardProps {
  label: string;
  value?: string | number | null;
}
const InfoCard = ({ label, value }: InfoCardProps) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
    <p className="text-xs font-medium text-gray-500 dark:text-neutral-400">{label}</p>

    <p className="mt-1 break-words text-sm font-semibold text-gray-900 dark:text-white">
      {value || "N/A"}
    </p>
  </div>
);

interface SectionTitleProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}
const SectionTitle = ({ icon: Icon, title, description }: SectionTitleProps) => (
  <div className="mb-4 flex items-center gap-3 border-b border-gray-200 pb-3 dark:border-neutral-800">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-[#0446DB]/10 text-[#0446DB] dark:bg-[#0446DB]/20 dark:text-blue-400">
      <Icon className="h-4 w-4" />
    </div>

    <div>
      <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>

      {description && (
        <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">{description}</p>
      )}
    </div>
  </div>
);

interface ToggleSwitchProps {
  checked: boolean;
  onClick: () => void;
  disabled?: boolean;
}
const ToggleSwitch = ({ checked, onClick, disabled = false }: ToggleSwitchProps) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0446DB]/20 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 ${
      checked ? "bg-green-500" : "bg-gray-300 dark:bg-neutral-700"
    } ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
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
  const requestIdRef = useRef(0);

  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingRiderId, setUpdatingRiderId] = useState<number | null>(null);

  const [vendorOptions, setVendorOptions] = useState<SelectOption[]>([
    { value: "all", label: "All Riders" },
    { value: "self", label: "Self Riders" },
  ]);
  const [dcOptions, setDcOptions] = useState<SelectOption[]>([]);
  const [vendor, setVendor] = useState("all");
  const [dcId, setDcId] = useState<string | null>(null);
  const [ownership, setOwnership] = useState("");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<RiderFilters>({ ...DEFAULT_RIDER_FILTERS });
  const filterCloseButtonRef = useRef<HTMLButtonElement>(null);
  const activeFilterCount =
    Number(vendor !== "all") + Number(Boolean(dcId)) + Number(Boolean(ownership));
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [riders, setRiders] = useState<Rider[]>([]);

  const [popup, setPopup] = useState<Rider | null>(null);
  const [riderDialogPortal, setRiderDialogPortal] = useState<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState<Rider | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [cityOptions, setCityOptions] = useState<SelectOption[]>([]);
  const [facilityCityOptions, setFacilityCityOptions] = useState<SelectOption[]>([]);
  const [changePasswordPopup, setChangePasswordPopup] = useState<Rider | null>(null);
  const [newPassword, setNewPassword] = useState<PasswordState>({
    id: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<"loading" | "allowed" | "denied" | "error">("loading");
  const canViewRider = permissionStatus === "allowed";
  const canUpdateRider = canViewRider &&
    (permissions.includes("UPDATE_RIDER") || permissions.includes("ADMIN_FULL_ACCESS"));

  // Permission API is checked once per page mount, before loading rider data.
  useEffect(() => {
    let active = true;
    const loadPermissions = async () => {
      try {
        const response = await AxiosInstance.get("/api/user/getUserPermissions");
        const codes = response.data?.data?.data;
        if (!Array.isArray(codes)) throw new Error("Invalid permission response");
        if (!active) return;
        setPermissions(codes);
        const allowed = codes.includes("VIEW_RIDER") || codes.includes("ADMIN_FULL_ACCESS");
        setPermissionStatus(allowed ? "allowed" : "denied");
        if (!allowed) navigate("/unauthorized", { replace: true });
      } catch (error) {
        if (!active) return;
        setPermissionStatus("error");
        toast.error(errorMessage(error, "Unable to verify rider permissions"));
      }
    };
    void loadPermissions();
    return () => { active = false; };
  }, [navigate]);

  const openFilterDrawer = (): void => {
    // Edits inside the drawer are drafts until Apply Filters is clicked.
    setDraftFilters({ vendor, dcId, ownership });
    setIsFilterDrawerOpen(true);
  };

  const applyFilters = (): void => {
    setVendor(draftFilters.vendor);
    setDcId(draftFilters.dcId);
    setOwnership(draftFilters.ownership);
    setPage(1);
    setIsFilterDrawerOpen(false);
  };

  const resetFilters = (): void => {
    setDraftFilters({ ...DEFAULT_RIDER_FILTERS });
    setVendor("all");
    setDcId(null);
    setOwnership("");
    setPage(1);
    setIsFilterDrawerOpen(false);
  };

  useEffect(() => {
    if (!isFilterDrawerOpen || typeof document === "undefined") return;
    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    filterCloseButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsFilterDrawerOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedElement?.focus();
    };
  }, [isFilterDrawerOpen]);

  const fetchRiders = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}): Promise<void> => {
      if (!canViewRider) return;
      const currentRequest = ++requestIdRef.current;
      if (!silent) setLoading(true);
      const params: Record<string, string | number> = { page, limit };
      if (vendor === "self") params.rider_type = "self";
      else if (vendor !== "all") params.vendor_id = Number(vendor);
      if (dcId) params.dc_id = Number(dcId);
      if (ownership) params.vendor_ownership = ownership;
      if (search) params.search = search;

      try {
        const response = await AxiosInstance.get<ApiResponse<Rider[]>>(
          `${RIDER_API_BASE}/getRiders`,
          { params },
        );
        if (currentRequest !== requestIdRef.current) return;
        if (response.data?.success === false) throw new Error(response.data.message);
        setRiders(Array.isArray(response.data?.data) ? response.data.data : []);
        const info = response.data?.pagination || {};
        setPagination({
          page: Number(info.page) || page,
          limit: Number(info.limit) || limit,
          total: Number(info.total) || 0,
          totalPages: Number(info.totalPages) || 0,
        });
      } catch (error) {
        if (currentRequest !== requestIdRef.current) return;
        setRiders([]);
        setPagination({ page, limit, total: 0, totalPages: 0 });
        toast.error(errorMessage(error, "Failed to fetch riders"));
      } finally {
        if (currentRequest === requestIdRef.current) setLoading(false);
      }
    },
    [page, limit, vendor, dcId, ownership, search, canViewRider],
  );

  useEffect(() => {
    if (!canViewRider) return;
    let alive = true;
    async function fetchFilterOptions() {
      try {
        const response = await AxiosInstance.get<
          ApiResponse<{ vendors: VendorOptionApi[]; dcs: DcOptionApi[] }>
        >(`${RIDER_API_BASE}/riderFilterOptions`);
        if (!alive) return;
        if (response.data?.success === false) throw new Error(response.data.message);
        const { vendors = [], dcs = [] } = response.data?.data || {};
        setVendorOptions([
          { value: "all", label: "All Riders" },
          { value: "self", label: "Self Riders" },
          ...vendors.map((item) => ({
            value: String(item.id),
            label: `FP${item.id}: ${item.vendor_name || item.company_name || "Vendor"}`,
          })),
        ]);
        setDcOptions(
          dcs.map((item) => ({
            value: String(item.id),
            label: `${item.dc_name}${item.city ? ` - ${item.city}` : ""}`,
          })),
        );
      } catch (error) {
        if (alive) toast.error(errorMessage(error, "Failed to load rider filters"));
      } finally {
        if (alive) setLoadingPage(false);
      }
    }
    fetchFilterOptions();
    return () => {
      alive = false;
    };
  }, [canViewRider]);

  useEffect(() => {
    if (!canViewRider) return;
    void fetchRiders();
    return () => {
      requestIdRef.current += 1;
    };
  }, [fetchRiders]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = searchText.trim();
      if (next !== search) {
        setSearch(next);
        setPage(1);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchText, search]);

  const loadCitiesForState = (stateName?: string | null): void => {
    const cities = getCitiesByStateName(stateName);
    setCityOptions(cities);
    setFacilityCityOptions(cities);
  };

  const openRiderDetails = (rider: Rider): void => {
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

  const updateRider = async (
    id: number,
    payload: RiderPatch,
    successText?: string,
  ): Promise<boolean> => {
    if (!canUpdateRider) {
      toast.error("UPDATE_RIDER permission is required");
      return false;
    }
    setUpdatingRiderId(id);
    try {
      const response = await AxiosInstance.post<ApiResponse<{ rider_id: number }>>(
        `${RIDER_API_BASE}/updateRider/${id}`,
        payload,
      );
      if (response.data?.success === false) throw new Error(response.data.message);
      toast.success(response.data?.message || successText || "Rider updated successfully");
      await fetchRiders({ silent: true });
      return true;
    } catch (error) {
      toast.error(errorMessage(error, "Failed to update rider"));
      return false;
    } finally {
      setUpdatingRiderId(null);
    }
  };

  const changeVerificationStatus = (id: number, status: number) =>
    updateRider(id, { account_status: status }, "Account status updated");
  const changeActiveStatus = (id: number, status: number) =>
    updateRider(id, { is_active: status }, "Rider active status updated");
  const changeAvailabilityStatus = (id: number, status: number) =>
    updateRider(id, { is_available: status }, "Availability updated");

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormData((previous) => (previous ? { ...previous, [name]: value } : null));
  };

  const handleStateChange = (option: SingleValue<SelectOption>): void => {
    const state = option?.value || "";
    setFormData((previous) =>
      previous ? { ...previous, state, city: "", facility_city: "" } : null,
    );
    loadCitiesForState(state);
  };

  const handleSave = async () => {
    if (!canUpdateRider || !formData?.id || !popup) return;
    
    // Only send editable, changed fields. Never send the full rider object.
    // The backend PATCH service accepts JSON, not multipart/form-data.
    const payload: RiderPatch = {};
    for (const field of EDITABLE_RIDER_FIELDS) {
      const next = String(formData[field] ?? "").trim();
      const previous = String(popup[field] ?? "").trim();
      if (next !== previous) payload[field] = next;
    }
    if (!Object.keys(payload).length) {
      toast.info("No changes to save");
      return;
    }
    setSaving(true);
    try {
      const response = await AxiosInstance.post<ApiResponse<{ rider_id: number }>>(
        `${RIDER_API_BASE}/updateRider/${formData.id}`,
        payload,
      );
      if (response.data?.success === false) throw new Error(response.data.message);
      toast.success(response.data?.message || "Rider updated successfully");
      closeRiderDetails();
      await fetchRiders({ silent: true });
    } catch (error) {
      toast.error(errorMessage(error, "Failed to save rider"));
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!canUpdateRider) return;
    const { id, password, confirmPassword } = newPassword;
    if (!id || !password || !confirmPassword) {
      toast.error("Enter and confirm the new password");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8 || new TextEncoder().encode(password).length > 72) {
      toast.error("Password must have at least 8 characters and at most 72 bytes");
      return;
    }
    setSaving(true);
    try {
      const response = await AxiosInstance.post<ApiResponse<{ rider_id: number }>>(
        `${RIDER_API_BASE}/updateRider/${id}`,
        {
          password,
          confirmPassword,
        },
      );
      if (response.data?.success === false) throw new Error(response.data.message);
      toast.success(response.data?.message || "Password updated successfully");
      setChangePasswordPopup(null);
      setNewPassword({ id: "", password: "", confirmPassword: "" });
    } catch (error) {
      toast.error(errorMessage(error, "Failed to change password"));
    } finally {
      setSaving(false);
    }
  };

  if (permissionStatus === "error") {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-3 text-center dark:text-white">
        <p className="font-semibold">Unable to verify rider permissions.</p>
        <p className="text-sm text-gray-500">Please refresh the page or contact your administrator.</p>
        <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }
  if (permissionStatus !== "allowed" || loadingPage) {
    return (
      <div className="flex h-[90vh] w-full items-center justify-center bg-white dark:bg-neutral-950">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />

          <p className="mt-3 text-sm font-medium text-gray-600 dark:text-neutral-300">
            Loading Vendor Riders Details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative isolate flex h-[87dvh] min-h-0 w-full flex-col overflow-hidden  text-slate-900 dark:bg-neutral-950 dark:text-white">
      <div className="z-20 shrink-0 border-b px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Vendor Riders
            </h1>
            <p className="mt-1 text-xs text-gray-600">
              Manage riders across your permitted cities
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => void fetchRiders()}
            disabled={loading}
            className="h-9 gap-2 rounded-md border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          >
            <RefreshCcw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[170px] flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search rider name, email, phone..."
              aria-label="Search riders"
              className="h-10 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear filters
              </button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={openFilterDrawer}
              aria-label={`Open rider filters${activeFilterCount ? `, ${activeFilterCount} active` : ""}`}
              className="h-10 gap-2 rounded-md border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-none hover:border-[#0446DB]/40 hover:bg-blue-50 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0446DB] px-1.5 text-[11px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        </div>
        {activeFilterCount > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-500 dark:text-neutral-400">Active:</span>
            {vendor !== "all" && (
              <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 font-medium text-[#0446DB] dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
                {vendorOptions.find((option) => option.value === vendor)?.label || "Vendor"}
              </span>
            )}
            {dcId && (
              <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 font-medium text-[#0446DB] dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
                {dcOptions.find((option) => option.value === dcId)?.label || "DC"}
              </span>
            )}
            {ownership && (
              <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 font-medium text-[#0446DB] dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
                {OWNERSHIP_OPTIONS.find((option) => option.value === ownership)?.label ||
                  "Ownership"}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden border border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="min-h-0 w-full flex-1 overflow-auto overscroll-contain">
            <table className="w-full min-w-[930px] caption-bottom border-separate border-spacing-0 text-sm">
              <TableHeader className="bg-gray-50 dark:bg-neutral-800">
                <TableRow className="border-gray-200 hover:bg-transparent dark:border-neutral-800">
                  <TableHead className="sticky top-0 z-30 bg-slate-100 px-4 py-3 text-xs font-semibold text-slate-600 dark:bg-neutral-800 dark:text-neutral-300">
                    RIDER ID
                  </TableHead>

                  <TableHead className="sticky top-0 z-30 bg-slate-100 px-4 py-3 text-xs font-semibold text-slate-600 dark:bg-neutral-800 dark:text-neutral-300">
                    RIDER NAME
                  </TableHead>

                  <TableHead className="sticky top-0 z-30 bg-slate-100 px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:bg-neutral-800 dark:text-neutral-300">
                    ACCOUNT STATUS
                  </TableHead>

                  <TableHead className="sticky top-0 z-30 bg-slate-100 px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:bg-neutral-800 dark:text-neutral-300">
                    ACTIVE
                  </TableHead>

                  <TableHead className="sticky top-0 z-30 bg-slate-100 px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:bg-neutral-800 dark:text-neutral-300">
                    AVAILABLE
                  </TableHead>

                  <TableHead className="sticky top-0 z-30 bg-slate-100 px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:bg-neutral-800 dark:text-neutral-300">
                    RIDER DOCUMENT
                  </TableHead>

                  <TableHead className="sticky top-0 z-30 bg-slate-100 px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:bg-neutral-800 dark:text-neutral-300">
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
                          Try a different rider search or filter.
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
                        {riderDisplayId(rider)}
                      </TableCell>

                      <TableCell className="px-4 py-4 text-gray-700 dark:text-neutral-300">
                        <div className="font-semibold text-slate-900 dark:text-white">{rider.name || "-"}</div>
                        <div className="mt-0.5 text-xs text-slate-500">{rider.email || rider.phone || "No contact provided"}</div>
                        {rider.vendor_name && <div className="mt-0.5 text-xs text-slate-400">{rider.vendor_name}</div>}
                      </TableCell>

                      <TableCell className="px-4 py-4 text-center">
                        <ToggleSwitch
                          checked={isEnabled(rider.account_status)}
                          disabled={!canUpdateRider || updatingRiderId !== null || rider.account_status == null}
                          onClick={() =>
                            changeVerificationStatus(
                              rider.id,

                              isEnabled(rider.account_status) ? 0 : 1,
                            )
                          }
                        />
                      </TableCell>

                      <TableCell className="px-4 py-4 text-center">
                        <ToggleSwitch
                          checked={isEnabled(rider.is_active)}
                          disabled={!canUpdateRider || updatingRiderId !== null || !isEnabled(rider.account_status)}
                          onClick={() => {
                            if (isEnabled(rider.account_status)) {
                              changeActiveStatus(
                                rider.id,

                                isEnabled(rider.is_active) ? 0 : 1,
                              );
                            }
                          }}
                        />
                      </TableCell>

                      <TableCell className="px-4 py-4 text-center">
                        <ToggleSwitch
                          checked={isEnabled(rider.is_available)}
                          disabled={
                            !canUpdateRider ||
                            updatingRiderId !== null ||
                            !isEnabled(rider.account_status) ||
                            !isEnabled(rider.is_active)
                          }
                          onClick={() => {
                            if (isEnabled(rider.account_status) && isEnabled(rider.is_active)) {
                              changeAvailabilityStatus(
                                rider.id,

                                isEnabled(rider.is_available) ? 0 : 1,
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
                          <Eye className="h-4 w-4" />
                          View / Edit
                        </Button>
                      </TableCell>

                      <TableCell className="px-4 py-4 text-center">
                        {canUpdateRider ? <Button
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
                        </Button> : <span className="text-xs text-gray-400">No access</span>}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </table>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 text-xs dark:border-neutral-800 dark:bg-neutral-900">
            <span className="text-gray-500 dark:text-neutral-400">
              {pagination.total === 0
                ? "0 riders"
                : `${(page - 1) * limit + 1}-${Math.min(page * limit, pagination.total)} of ${pagination.total} riders`}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="rider-page-limit" className="text-gray-500 dark:text-neutral-400">
                Rows
              </label>
              <select
                id="rider-page-limit"
                value={limit}
                onChange={(event) => {
                  setLimit(Number(event.target.value));
                  setPage(1);
                }}
                className="rounded border border-gray-300 bg-white px-2 py-1 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              >
                {[20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                className="rounded border border-gray-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700"
              >
                <ChevronLeft size={14} className="mr-1 inline-block" /> Previous
              </button>
              <span className="px-2 text-gray-700 dark:text-neutral-200">
                Page {page} / {Math.max(pagination.totalPages, 1)}
              </span>
              <button
                type="button"
                disabled={page >= pagination.totalPages || loading}
                onClick={() => setPage((value) => value + 1)}
                className="rounded border border-gray-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700"
              >
                Next <ChevronRight size={14} className="ml-1 inline-block" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isFilterDrawerOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9990]">
            <div
              className="absolute inset-0 bg-gray-950/50 backdrop-blur-[2px]"
              onClick={() => setIsFilterDrawerOpen(false)}
              aria-hidden="true"
            />
            <aside
              role="dialog"
              aria-modal="true"
              aria-labelledby="rider-filters-title"
              className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl dark:bg-neutral-900"
              style={{ animation: "rider-filter-drawer-enter 220ms ease-out both" }}
            >
              <div className="border-b border-gray-200 px-6 py-5 dark:border-neutral-800">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0446DB]/10 text-[#0446DB] dark:bg-blue-500/20 dark:text-blue-400">
                      <SlidersHorizontal className="h-5 w-5" />
                    </div>
                    <div>
                      <h2
                        id="rider-filters-title"
                        className="text-lg font-semibold text-gray-900 dark:text-white"
                      >
                        Filter Riders
                      </h2>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                        Select criteria to narrow your list
                      </p>
                    </div>
                  </div>
                  <button
                    ref={filterCloseButtonRef}
                    type="button"
                    onClick={() => setIsFilterDrawerOpen(false)}
                    aria-label="Close rider filters"
                    className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0446DB] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div
                className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6"
                onKeyDown={(event) => {
                  if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
                  const target = event.target as HTMLElement;
                  if (target.closest('[role="combobox"]') || target.closest('[role="listbox"]')) return;
                  event.preventDefault();
                  applyFilters();
                }}
              >
               
                <div className="space-y-2">
                  <label
                    htmlFor="rider-filter-vendor"
                    className="block text-sm font-semibold text-gray-700 dark:text-neutral-200"
                  >
                    Vendor / Rider Group
                  </label>
                  <Select<SelectOption, false>
                    inputId="rider-filter-vendor"
                    options={vendorOptions}
                    value={
                      vendorOptions.find((option) => option.value === draftFilters.vendor) ||
                      vendorOptions[0]
                    }
                    onChange={(option) =>
                      setDraftFilters((prev) => ({ ...prev, vendor: option?.value || "all" }))
                    }
                    placeholder="All Riders"
                    isSearchable
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={selectStyles}
                  />
                  <p className="text-xs text-gray-500 dark:text-neutral-500">
                    Includes all riders, self riders, or a specific vendor.
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="rider-filter-dc"
                    className="block text-sm font-semibold text-gray-700 dark:text-neutral-200"
                  >
                    Delivery Center (DC)
                  </label>
                  <Select<SelectOption, false>
                    inputId="rider-filter-dc"
                    options={dcOptions}
                    value={dcOptions.find((option) => option.value === draftFilters.dcId) || null}
                    onChange={(option) =>
                      setDraftFilters((prev) => ({ ...prev, dcId: option?.value || null }))
                    }
                    placeholder="All DCs"
                    isClearable
                    isSearchable
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={selectStyles}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="rider-filter-ownership"
                    className="block text-sm font-semibold text-gray-700 dark:text-neutral-200"
                  >
                    Vendor Ownership
                  </label>
                  <Select<SelectOption, false>
                    inputId="rider-filter-ownership"
                    options={OWNERSHIP_OPTIONS}
                    value={
                      OWNERSHIP_OPTIONS.find((option) => option.value === draftFilters.ownership) ||
                      OWNERSHIP_OPTIONS[0]
                    }
                    onChange={(option) =>
                      setDraftFilters((prev) => ({ ...prev, ownership: option?.value || "" }))
                    }
                    placeholder="All vendor types"
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={selectStyles}
                  />
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3 border-t border-gray-200 bg-white px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetFilters}
                  className="h-11 flex-1 gap-2 rounded-md border-gray-300 font-medium dark:border-neutral-700 dark:text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset All
                </Button>
                <Button
                  type="button"
                  onClick={applyFilters}
                  className="h-11 flex-1 rounded-md bg-[#0446DB] font-semibold text-white hover:bg-[#0339b5]"
                >
                  Apply Filters
                </Button>
              </div>
            </aside>
            <style>{`@keyframes rider-filter-drawer-enter { from { transform: translateX(100%); opacity: .8; } to { transform: translateX(0); opacity: 1; } }`}</style>
          </div>,
          document.body,
        )}

      <Dialog
        open={!!popup}
        onOpenChange={(open) => {
          if (!open) closeRiderDetails();
        }}
      >
        <DialogContent
          ref={setRiderDialogPortal}
          className="flex max-h-[92dvh] !w-[95vw] !max-w-5xl flex-col overflow-y-auto rounded-xl border border-slate-200 bg-white p-0 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
        >
          <DialogHeader className="sticky top-0 z-20 border-b border-blue-700 bg-[#0446DB] px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white">
                <UserRound className="h-5 w-5" />
              </div>

              <div className="text-left">
                <DialogTitle className="text-lg font-bold text-white">
                  Rider Details
                </DialogTitle>

                <DialogDescription className="mt-1 text-sm text-gray-100 dark:text-neutral-400">
                  View and update rider profile, location, documents and bank information.
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
                  <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <StatusCard
                      label="Account"
                      active={isEnabled(popup.account_status)}
                      activeText="Active"
                      inactiveText="Not Active"
                    />

                    <StatusCard
                      label="Rider Status"
                      active={isEnabled(popup.is_active)}
                      activeText="Active"
                      inactiveText="Inactive"
                    />

                    <StatusCard
                      label="Availability"
                      active={isEnabled(popup.is_available)}
                      activeText="Available"
                      inactiveText="Unavailable"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <RiderInput label="Rider ID" value={riderDisplayId(popup)} disabled />

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
                                  String(formData.state).toLowerCase(),
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
                                  String(formData.city).toLowerCase(),
                              ) || {
                                value: formData.city,

                                label: formData.city,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          setFormData((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  city: selectedOption?.value || "",
                                }
                              : null,
                          )
                        }
                        placeholder={formData?.state ? "Select city" : "Select state first"}
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
                                  String(formData.facility_city).toLowerCase(),
                              ) || {
                                value: formData.facility_city,

                                label: formData.facility_city,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          setFormData((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  facility_city: selectedOption?.value || "",
                                }
                              : null,
                          )
                        }
                        placeholder={
                          formData?.state ? "Select facility city" : "Select state first"
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
                    <InfoCard label="Document Type" value={popup.document_type || "N/A"} />

                    <InfoCard label="Document ID" value={popup.document_id || "N/A"} />

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                      <p className="text-xs font-medium text-gray-500 dark:text-neutral-400">
                        Document File
                      </p>

                      {popup.document_image ? (
                        <a
                          href={fileUrl(popup.document_image)}
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
                      name="bank_account_number"
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
                      name="bank_ifsc_code"
                      value={formData?.bank_ifsc_code || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
                        Cheque Image
                      </label>

                      <div className="flex min-h-[42px] items-center rounded-sm border border-gray-200 bg-gray-50 px-3 dark:border-neutral-700 dark:bg-neutral-800">
                        {popup.cheque_image ? (
                          <a
                            href={fileUrl(popup.cheque_image)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm font-medium text-[#0446DB] hover:underline dark:text-blue-400"
                          >
                            <FaRegFileImage /> View Cheque Image
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-neutral-500">
                            No image available
                          </span>
                        )}
                      </div>
                      {isEditing && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                          Cheque upload is not supported by the current JSON PATCH API.
                        </p>
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
                      disabled={saving || !canUpdateRider}
                      className="gap-2 bg-[#0446DB] text-white hover:bg-[#0339b5]"
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save Changes
                    </Button>
                  </>
                ) : (

                  <>

                  {
                    canUpdateRider && (

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
                    )
                  }
                  
                  </>
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
                    <p className="text-xs text-gray-500 dark:text-neutral-400">Rider ID</p>

                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                      {riderDisplayId(changePasswordPopup)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">Rider Name</p>

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
                    <p className="text-xs font-medium text-red-500">Passwords do not match.</p>
                  )}
              </div>

              <DialogFooter className="flex-row justify-end gap-2 border-t border-gray-200 bg-gray-50/50 px-6 mb-0 dark:border-neutral-800 dark:bg-neutral-900">
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
                  disabled={!canUpdateRider || saving || !newPassword.password || !newPassword.confirmPassword}
                  className="gap-2 bg-[#0446DB] text-white hover:bg-[#0339b5] disabled:opacity-60"
                >
                  {saving ? (
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
