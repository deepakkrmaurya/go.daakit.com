// import React, { useCallback, useEffect, useMemo, useState } from "react";

// import { State, City } from "country-state-city";

// import {
//   Search,
//   RefreshCw,
//   Users,
//   ChevronLeft,
//   ChevronRight,
//   ShieldCheck,
//   X,
//   Loader2,
//   Pencil,
//   Power,
//   Eye,
//   EyeOff,
//   Save,
//   AlertTriangle,
//   FileText,
//   ExternalLink,
//   CheckCircle2,
//   Building2,
//   Landmark,
//   UserRound,
//   Plus,
// } from "lucide-react";

// import { toast } from "react-toastify";

// import AxiosInstance from "@/Helper/axiosInstance";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";

// import CustomButton from "../../common/CustomButton";

// import { Link } from "react-router-dom";

// const DEFAULT_ENDPOINT = "/api/dc/vendors";

// const STATUS_ENDPOINT = "/api/dc/updateVendorAccountStatus";
// const KYC_ENDPOINT = "/api/dc/updateVendorKyc";
// const KYC_TEXT_KEYS = [
//   "company_gst_number",
//   "company_type",
//   "bank_name",
//   "bank_branch",
//   "bank_account_number",
//   "bank_ifsc_code",
//   "document_type",
//   "document_id",
//   "company_pancard_name",
//   "supporting_document_id",
//   "supporting_document_type",
// ];
// const KYC_FILE_KEYS = [
//   "cheque_image",
//   "document_image",
//   "company_pancard_image",
//   "supporting_document_image",
// ];
// const KYC_FILE_LABELS = {
//   cheque_image: "Cancelled Cheque",
//   document_image: "Identity Document",
//   company_pancard_image: "Company PAN",
//   supporting_document_image: "Supporting Document",
// };

// const LIMIT_OPTIONS = [10, 20, 50, 100];

// const EDIT_FIELDS = [
//   { key: "vendor_name", label: "Vendor Name", required: true, max: 100 },

//   { key: "company_name", label: "Company Name", required: true, max: 150 },

//   { key: "email", label: "Email", required: true, max: 254 },

//   { key: "phone", label: "Phone", required: true, max: 10 },

//   { key: "company_address", label: "Company Address", max: 500 },

//   { key: "company_state", label: "State", max: 100 },

//   { key: "company_city", label: "City", max: 100 },

//   { key: "company_pincode", label: "Pincode", max: 6 },

//   { key: "company_gst_number", label: "GST Number", max: 15 },

//   { key: "bank_name", label: "Bank Name", max: 150 },

//   { key: "bank_branch", label: "Bank Branch", max: 150 },

//   { key: "bank_ifsc_code", label: "IFSC Code", max: 11 },

//   { key: "bank_account_number", label: "Bank Account Number", max: 34 },
// ];

// const DOCUMENT_FIELDS = [
//   {
//     label: "Identity Document",

//     type: "document_type",

//     c_type: "company_type",

//     number: "document_id",

//     image: "document_image",
//   },

//   {
//     label: "Company PAN",

//     c_type: "company_type",

//     type: "company_pancard_name",

//     image: "company_pancard_image",
//   },

//   {
//     label: "Supporting Document",

//     c_type: "company_type",

//     type: "supporting_document_type",

//     number: "supporting_document_id",

//     image: "supporting_document_image",
//   },

//   { label: "Cancelled Cheque", image: "cheque_image" },
// ];

// const EDIT_KEYS = EDIT_FIELDS.map((f) => f.key);

// // Vendor addresses are in India. Keep state/city names in the API payload.
// const INDIAN_STATES = State.getStatesOfCountry("IN");

// const CUSTOM_CITY_VALUE = "__custom_city__";

// const findIndianState = (name) =>
//   INDIAN_STATES.find(
//     (state) =>
//       state.name.toLowerCase() ===
//       String(name ?? "")
//         .trim()

//         .toLowerCase(),
//   );

// const clean = (value) => (value == null ? "" : String(value).trim());

// const getError = (err, fallback) => err?.response?.data?.message || err?.message || fallback;

// const formatDate = (value) => {
//   if (!value) return "—";

//   const date = new Date(value);

//   return Number.isNaN(date.getTime())
//     ? "—"
//     : date.toLocaleDateString("en-IN", {
//         day: "2-digit",

//         month: "short",

//         year: "numeric",
//       });
// };

// function StatusBadge({ active, type = "account" }) {
//   const yes = Number(active) === 1;

//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${yes ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"}`}
//     >
//       <span className={`h-1.5 w-1.5 rounded-full ${yes ? "bg-emerald-500" : "bg-amber-500"}`} />

//       {type === "kyc" ? (yes ? "Verified" : "Not Verified") : yes ? "Active" : "Inactive"}
//     </span>
//   );
// }

// function validateEdit(form, original, changePassword) {
//   const errors = {};

//   for (const field of EDIT_FIELDS) {
//     const value = clean(form[field.key]);

//     if (field.required && !value) errors[field.key] = `${field.label} is required`;
//     else if (value.length > field.max)
//       errors[field.key] = `Maximum ${field.max} characters allowed`;
//   }

//   if (clean(form.company_state) && !findIndianState(form.company_state))
//     errors.company_state = "Select a valid Indian state";

//   if (clean(form.company_city) && !/^[\p{L}\p{M} .'-]{2,100}$/u.test(clean(form.company_city)))
//     errors.company_city = "City must contain 2–100 letters or valid name characters";

//   const vendorName = clean(form.vendor_name);

//   if (
//     !errors.vendor_name &&
//     (!/^[\p{L}\p{M} .'-]+$/u.test(vendorName) ||
//       !/\p{L}/u.test(vendorName) ||
//       vendorName.length < 2)
//   )
//     errors.vendor_name = "Vendor name must contain at least 2 characters and no numbers";

//   if (!errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(form.email)))
//     errors.email = "Enter a valid email";

//   if (!errors.phone && !/^[6-9]\d{9}$/.test(clean(form.phone)))
//     errors.phone = "Enter a valid 10-digit Indian mobile number";

//   if (clean(form.company_pincode) && !/^[1-9]\d{5}$/.test(clean(form.company_pincode)))
//     errors.company_pincode = "Enter a valid 6-digit Indian pincode";

//   const gst = clean(form.company_gst_number).toUpperCase();

//   if (
//     gst &&
//     (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gst) ||
//       Number(gst.slice(0, 2)) < 1 ||
//       Number(gst.slice(0, 2)) > 38)
//   )
//     errors.company_gst_number = "Enter a valid 15-character GSTIN";

//   if (changePassword) {
//     const password = form.password || "";

//     const confirm = form.confirmPassword || "";

//     const bytes = new TextEncoder().encode(password).length;

//     if (bytes < 8 || bytes > 72) errors.password = "Password must be 8–72 bytes";

//     if (password !== confirm) errors.confirmPassword = "Passwords do not match";
//   }

//   return errors;
// }

// export default function DcVendorListing({
//   endpoint = DEFAULT_ENDPOINT,

//   onAddVendor,

//   onVerifyKyc,
// }) {
//   const [vendors, setVendors] = useState([]);

//   const [searchInput, setSearchInput] = useState("");

//   const [search, setSearch] = useState("");

//   const [page, setPage] = useState(1);

//   const [limit, setLimit] = useState(20);

//   const [pagination, setPagination] = useState({
//     page: 1,

//     limit: 20,

//     total: 0,

//     totalPages: 0,
//   });

//   const [loading, setLoading] = useState(false);

//   const [error, setError] = useState("");

//   const [refreshKey, setRefreshKey] = useState(0);

//   const [selectedVendor, setSelectedVendor] = useState(null);

//   const [kycConfirm, setKycConfirm] = useState(false);
//   const [kycEditing, setKycEditing] = useState(null);
//   const [kycForm, setKycForm] = useState({});
//   const [kycFiles, setKycFiles] = useState({});
//   const [kycErrors, setKycErrors] = useState({});
//   const [kycMarkVerified, setKycMarkVerified] = useState(false);

//   const [kycSaving, setKycSaving] = useState(false);

//   const [editing, setEditing] = useState(null);

//   const [form, setForm] = useState({});

//   const [formErrors, setFormErrors] = useState({});

//   const [customCityMode, setCustomCityMode] = useState(false);

//   const selectedState = useMemo(() => findIndianState(form.company_state), [form.company_state]);

//   const availableCities = useMemo(
//     () => (selectedState ? City.getCitiesOfState("IN", selectedState.isoCode) : []),

//     [selectedState],
//   );

//   const [changePassword, setChangePassword] = useState(false);

//   const [showPassword, setShowPassword] = useState(false);

//   const [saving, setSaving] = useState(false);

//   const [statusVendor, setStatusVendor] = useState(null);

//   const [statusSaving, setStatusSaving] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setPage(1);

//       setSearch(searchInput.trim());
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [searchInput]);

//   const fetchVendors = useCallback(
//     async (signal) => {
//       setLoading(true);

//       setError("");

//       try {
//         const { data } = await AxiosInstance.get(endpoint, {
//           params: { page, limit, search },

//           signal,
//         });

//         if (data?.success !== true) throw new Error(data?.message || "Unable to fetch vendors");

//         if (signal.aborted) return;

//         setVendors(Array.isArray(data.data) ? data.data : []);

//         setPagination({
//           page: Number(data.pagination?.page) || page,

//           limit: Number(data.pagination?.limit) || limit,

//           total: Number(data.pagination?.total) || 0,

//           totalPages: Number(data.pagination?.totalPages) || 0,
//         });
//       } catch (err) {
//         if (signal.aborted || err?.code === "ERR_CANCELED") return;

//         const message = getError(err, "Failed to fetch vendors");

//         setError(message);

//         setVendors([]);

//         toast.error(message);
//       } finally {
//         if (!signal.aborted) setLoading(false);
//       }
//     },

//     [endpoint, page, limit, search],
//   );

//   useEffect(() => {
//     const controller = new AbortController();

//     fetchVendors(controller.signal);

//     return () => controller.abort();
//   }, [fetchVendors, refreshKey]);

//   const refresh = () => setRefreshKey((key) => key + 1);

//   const openEdit = (vendor) => {
//     const values = {};

//     for (const key of EDIT_KEYS) values[key] = vendor[key] == null ? "" : String(vendor[key]);

//     setForm({ ...values, password: "", confirmPassword: "" });

//     setFormErrors({});

//     const state = findIndianState(values.company_state);

//     const cities = state ? City.getCitiesOfState("IN", state.isoCode) : [];

//     setCustomCityMode(
//       Boolean(values.company_city) &&
//         !cities.some(
//           (city) => city.name.toLowerCase() === values.company_city.trim().toLowerCase(),
//         ),
//     );

//     setChangePassword(false);

//     setShowPassword(false);

//     setEditing(vendor);
//   };

//   const updateForm = (key, value) => {
//     let next = String(value ?? "");

//     if (key === "vendor_name") next = next.replace(/[^\p{L}\p{M} .'-]/gu, "").slice(0, 100);

//     if (key === "phone") next = next.replace(/\D/g, "").slice(0, 10);

//     if (key === "company_pincode") next = next.replace(/\D/g, "").slice(0, 6);

//     if (key === "company_gst_number")
//       next = next

//         .toUpperCase()

//         .replace(/[^A-Z0-9]/g, "")

//         .slice(0, 15);

//     if (key === "company_state") {
//       setCustomCityMode(false);

//       setForm((previous) => ({ ...previous, company_state: next, company_city: "" }));

//       setFormErrors((previous) => ({
//         ...previous,

//         company_state: undefined,

//         company_city: undefined,
//       }));

//       return;
//     }

//     setForm((previous) => ({ ...previous, [key]: next }));

//     setFormErrors((previous) => ({ ...previous, [key]: undefined }));
//   };

//   const saveVendor = async (event) => {
//     event.preventDefault();

//     if (!editing || saving) return;

//     // const errors = validateEdit(form, editing, changePassword);
//     // if (Object.keys(errors).length) {
//     //   setFormErrors(errors);
//     //   toast.error("Please correct the highlighted fields");
//     //   return;
//     // }
//     const payload = {};

//     for (const key of EDIT_KEYS) {
//       const next = clean(form[key]);

//       const before = clean(editing[key]);

//       if (next !== before)
//         payload[key] = next || (EDIT_FIELDS.find((f) => f.key === key)?.required ? next : null);
//     }

//     if (payload.email) payload.email = payload.email.toLowerCase();

//     if (payload.company_gst_number)
//       payload.company_gst_number = payload.company_gst_number.toUpperCase();

//     if (payload.bank_ifsc_code) payload.bank_ifsc_code = payload.bank_ifsc_code.toUpperCase();

//     if (changePassword) {
//       payload.password = form.password;

//       payload.confirmPassword = form.confirmPassword;
//     }

//     if (!Object.keys(payload).length) {
//       toast.info("No changes to save");

//       return;
//     }

//     setSaving(true);

//     try {
//       const { data } = await AxiosInstance.patch(
//         `${endpoint}/${encodeURIComponent(editing.vendor_id)}`,

//         payload,
//       );

//       if (data?.success !== true) throw new Error(data?.message || "Unable to update vendor");

//       toast.success(data.message || "Vendor updated successfully");

//       setEditing(null);

//       refresh();
//     } catch (err) {
//       toast.error(getError(err, "Failed to update vendor"));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const openKycEdit = (vendor) => {
//     setKycEditing(vendor);
//     setKycForm(Object.fromEntries(KYC_TEXT_KEYS.map((key) => [key, String(vendor?.[key] ?? "")])));
//     setKycFiles({});
//     setKycErrors({});
//     setKycMarkVerified(false);
//   };

//   const saveKyc = async (event) => {
//     event.preventDefault();
//     if (!kycEditing || kycSaving) return;
//     const errors = {};
//     const gst = (kycForm.company_gst_number || "").trim().toUpperCase();
//     const ifsc = (kycForm.bank_ifsc_code || "").trim().toUpperCase();
//     if (gst && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gst))
//       errors.company_gst_number = "Invalid 15-character GSTIN";
//     if (ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc))
//       errors.bank_ifsc_code = "Invalid 11-character IFSC";
//     if (Object.keys(errors).length) {
//       setKycErrors(errors);
//       toast.error("Please check KYC fields");
//       return;
//     }

//     const data = new FormData();
//     data.append("vendor_id", String(kycEditing.vendor_id));
//     let changes = 0;
//     for (const key of KYC_TEXT_KEYS) {
//       const value = String(kycForm[key] ?? "").trim();
//       if (value !== String(kycEditing[key] ?? "").trim()) {
//         data.append(key, value);
//         changes += 1;
//       }
//     }
//     for (const key of KYC_FILE_KEYS) {
//       if (kycFiles[key] instanceof File) {
//         data.append(key, kycFiles[key]);
//         changes += 1;
//       }
//     }
//     if (kycMarkVerified) {
//       data.append("kyc_verified", "1");
//       changes += 1;
//     }
//     if (!changes) {
//       toast.info("No KYC changes to save");
//       return;
//     }

//     setKycSaving(true);
//     try {
//       // Let Axios set the multipart boundary; do not set Content-Type manually.
//       const { data: result } = await AxiosInstance.post(KYC_ENDPOINT, data);
//       if (result?.success !== true) throw new Error(result?.message || "Failed to update KYC");
//       toast.success(result.message || "Vendor KYC updated successfully");
//       setKycEditing(null);
//       setSelectedVendor(null);
//       refresh();
//     } catch (err) {
//       toast.error(getError(err, "Failed to update vendor KYC"));
//     } finally {
//       setKycSaving(false);
//     }
//   };

//   const verifyKyc = async () => {
//     if (!selectedVendor || kycSaving) return;
//     setKycSaving(true);
//     try {
//       // const data = new FormData();
//       // data.append("vendor_id", String(selectedVendor.vendor_id));
//       // data.append("kyc_verified", 1);
//       const data = {
//         vendor_id: selectedVendor.vendor_id,
//         kyc_verified: 1,
//       };
//       const { data: result } = await AxiosInstance.post(KYC_ENDPOINT, data);
//       if (result?.success !== true) throw new Error(result?.message || "KYC approval failed");
//       toast.success(result.message || "KYC verified successfully");
//       setKycConfirm(false);
//       setSelectedVendor(null);
//       refresh();
//     } catch (err) {
//       toast.error(getError(err, "KYC verification failed"));
//     } finally {
//       setKycSaving(false);
//     }
//   };

//   const updateAccountStatus = async () => {
//     if (!statusVendor || statusSaving) return;

//     const nextStatus = Number(statusVendor.is_active) === 1 ? 0 : 1;

//     setStatusSaving(true);

//     try {
//       const { data } = await AxiosInstance.post(STATUS_ENDPOINT, {
//         vendor_id: statusVendor.vendor_id,

//         is_active: nextStatus,
//       });

//       if (data?.success !== true)
//         throw new Error(data?.message || "Unable to update account status");

//       toast.success(data.message || "Account status updated successfully");

//       setStatusVendor(null);

//       refresh();
//     } catch (err) {
//       toast.error(getError(err, "Failed to update account status"));
//     } finally {
//       setStatusSaving(false);
//     }
//   };

//   const [loadingPage, setLoadingPage] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoadingPage(false);
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []);

//   const totalPages = pagination.totalPages;

//   const start = pagination.total ? (page - 1) * limit + 1 : 0;

//   const end = Math.min(page * limit, pagination.total);

//   const inputClass =
//     "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white";

//   return (
//     <>
//       {loadingPage ? (
//         <div className=" w-full h-[90vh] flex justify-center items-center">
//           <div>
//             <Loader2 className="h-8 w-8 animate-spin mx-auto" />

//             <p className="mt-2">Loading Vendor Details...</p>
//           </div>
//         </div>
//       ) : (
//         <div className="flex h-[calc(100dvh-100px)] min-h-0 w-full flex-col overflow-hidden bg-[#F7F8FA] text-slate-900 dark:bg-neutral-950 dark:text-neutral-100">
//           <div className="mx-auto flex min-h-0 w-full flex-1 flex-col gap-3 overflow-hidden">
//             <div className="flex shrink-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
//               {/* LEFT - Heading */}

//               <div className="min-w-0 lg:shrink-0">
//                 <h1 className="text-xl font-bold tracking-tight sm:text-2xl">DC Vendors</h1>

//                 <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">
//                   Manage vendors onboarded under your DC account.
//                 </p>
//               </div>

//               {/* RIGHT - Search + Buttons */}

//               <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
//                 {/* Search */}

//                 <div className="relative w-full sm:min-w-[220px] sm:flex-1 lg:w-80 lg:flex-none">
//                   <Search
//                     size={17}
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                   />

//                   <input
//                     type="search"
//                     value={searchInput}
//                     onChange={(e) => setSearchInput(e.target.value.slice(0, 100))}
//                     placeholder="Search vendor, company, phone, email..."
//                     _aria-label_="Search vendors"
//                     className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800"
//                   />

//                   {searchInput && (
//                     <button
//                       type="button"
//                       onClick={() => setSearchInput("")}
//                       _aria-label_="Clear search"
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
//                     >
//                       <X size={16} />
//                     </button>
//                   )}
//                 </div>

//                 {/* Action Buttons */}

//                 <div className="flex shrink-0 items-center gap-2">
//                   <button
//                     type="button"
//                     onClick={refresh}
//                     disabled={loading}
//                     className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium hover:bg-slate-50 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
//                   >
//                     <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
//                     Refresh
//                   </button>

//                   <CustomButton icon={Plus}>
//                     <Link to={"/dc/vendor/on-boarding"}>Add Vendor</Link>
//                   </CustomButton>
//                 </div>
//               </div>
//             </div>

//             <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
//               <div className="min-h-0 w-full flex-1 overflow-auto overscroll-contain">
//                 <table className="w-full min-w-[1080px] text-left text-sm">
//                   <thead className="sticky top-0 z-20 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 shadow-[0_1px_0_#e2e8f0] dark:bg-neutral-800 dark:text-neutral-400">
//                     <tr>
//                       {[
//                         "Vendor ID",

//                         "Vendor",

//                         "Company",

//                         "Contact",

//                         "Account Status",

//                         "KYC Status",

//                         "Joined On",

//                         "Actions",
//                       ].map((heading) => (
//                         <th
//                           key={heading}
//                           scope="col"
//                           className="sticky top-0 z-20 whitespace-nowrap bg-slate-50 px-4 py-3 font-semibold dark:bg-neutral-800"
//                         >
//                           {heading}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
//                     {loading ? (
//                       <tr>
//                         <td colSpan={8} className="py-16 text-center">
//                           <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-[#0446DB]" />

//                           <span className="text-sm text-slate-500">Fetching vendors...</span>
//                         </td>
//                       </tr>
//                     ) : error ? (
//                       <tr>
//                         <td colSpan={8} className="px-4 py-16 text-center">
//                           <p className="font-medium text-red-600">{error}</p>

//                           <button
//                             type="button"
//                             onClick={refresh}
//                             className="mt-3 text-sm font-semibold text-[#0446DB]"
//                           >
//                             Try again
//                           </button>
//                         </td>
//                       </tr>
//                     ) : vendors.length === 0 ? (
//                       <tr>
//                         <td colSpan={8} className="px-4 py-16 text-center">
//                           <Users className="mx-auto mb-3 h-9 w-9 text-slate-300" />

//                           <p className="font-semibold">No vendors found</p>

//                           <p className="mt-1 text-xs text-slate-500">
//                             {search
//                               ? "Try a different search term."
//                               : "Onboard a vendor to see them here."}
//                           </p>
//                         </td>
//                       </tr>
//                     ) : (
//                       vendors.map((vendor) => (
//                         <tr
//                           key={vendor.vendor_id}
//                           className="hover:bg-slate-50/80 dark:hover:bg-neutral-800/40"
//                         >
//                           <td className="whitespace-nowrap px-4 py-4 font-medium text-[#0446DB]">
//                             #{vendor.vendor_id}
//                           </td>

//                           <td className="px-4 py-4">
//                             <div className="flex items-center gap-3">
//                               <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-[#0446DB] dark:bg-blue-500/10">
//                                 {String(vendor.vendor_name || "V")
//                                   .charAt(0)

//                                   .toUpperCase()}
//                               </span>

//                               <span className="font-semibold">{vendor.vendor_name || "—"}</span>
//                             </div>
//                           </td>

//                           <td className="px-4 py-4">{vendor.company_name || "—"}</td>

//                           <td className="px-4 py-4">
//                             <div className="space-y-1">
//                               <p className="whitespace-nowrap">{vendor.phone || "—"}</p>

//                               <p className="text-xs text-slate-500 dark:text-neutral-400">
//                                 {vendor.email || "—"}
//                               </p>
//                             </div>
//                           </td>

//                           <td className="px-4 py-4">
//                             <StatusBadge active={vendor.is_active} />
//                           </td>

//                           <td className="px-4 py-4">
//                             <StatusBadge active={vendor.kyc_verified} type="kyc" />
//                           </td>

//                           <td className="whitespace-nowrap px-4 py-4 text-slate-500 dark:text-neutral-400">
//                             {formatDate(vendor.created_at)}
//                           </td>

//                           <td className="px-4 py-4">
//                             <div className="flex items-center gap-2">
//                               <button
//                                 type="button"
//                                 onClick={() => setSelectedVendor(vendor)}
//                                 className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
//                               >
//                                 <Eye size={14} /> View Details
//                               </button>

//                               <button
//                                 type="button"
//                                 onClick={() => setStatusVendor(vendor)}
//                                 className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${Number(vendor.is_active) === 1 ? "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/30 dark:hover:bg-emerald-500/10"}`}
//                               >
//                                 <Power size={14} />

//                                 {Number(vendor.is_active) === 1 ? "Deactivate" : "Activate"}
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               <div className="z-20 flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
//                 <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-neutral-400">
//                   <span>
//                     Showing {start}–{end} of {pagination.total}
//                   </span>

//                   <label className="flex items-center gap-2">
//                     Rows per page
//                     <select
//                       value={limit}
//                       onChange={(e) => {
//                         setLimit(Number(e.target.value));

//                         setPage(1);
//                       }}
//                       className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
//                     >
//                       {LIMIT_OPTIONS.map((n) => (
//                         <option key={n} value={n}>
//                           {n}
//                         </option>
//                       ))}
//                     </select>
//                   </label>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <span className="mr-1 text-xs text-slate-500">
//                     Page {page} of {Math.max(totalPages, 1)}
//                   </span>

//                   <button
//                     type="button"
//                     _aria-label_="Previous page"
//                     disabled={loading || page <= 1}
//                     onClick={() => setPage((p) => Math.max(1, p - 1))}
//                     className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-800"
//                   >
//                     <ChevronLeft size={16} />
//                   </button>

//                   <button
//                     type="button"
//                     _aria-label_="Next page"
//                     disabled={loading || page >= totalPages}
//                     onClick={() => setPage((p) => p + 1)}
//                     className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-800"
//                   >
//                     <ChevronRight size={16} />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <p className="flex shrink-0 items-center gap-1.5 text-xs text-slate-400">
//               <ShieldCheck size={14} /> Only vendors belonging to your authenticated DC are returned
//               by the API.
//             </p>
//           </div>

//           <AlertDialog
//             open={!!selectedVendor}
//             onOpenChange={(open) => {
//               if (!open && !kycSaving) setSelectedVendor(null);
//             }}
//           >
//             <AlertDialogContent className="flex max-h-[92vh] w-[calc(100%-1rem)] max-w-4xl flex-col gap-0 overflow-hidden rounded-2xl border-slate-200 p-0 dark:border-neutral-800 dark:bg-neutral-950">
//               {selectedVendor && (
//                 <>
//                   <AlertDialogHeader className="border-b border-slate-200 bg-slate-50 px-5 py-5 text-left dark:border-neutral-800 dark:bg-neutral-900 sm:px-7">
//                     <div className="flex items-start justify-between gap-4">
//                       <div className="flex items-center gap-3">
//                         <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
//                           <Building2 size={24} />
//                         </span>

//                         <div>
//                           <AlertDialogTitle className="text-xl font-bold">
//                             {selectedVendor.vendor_name || "Vendor Details"}
//                           </AlertDialogTitle>

//                           <AlertDialogDescription className="mt-1">
//                             Vendor #{selectedVendor.vendor_id} ·{" "}
//                             {selectedVendor.company_name || "Company not provided"}
//                           </AlertDialogDescription>
//                         </div>
//                       </div>

//                       <StatusBadge active={selectedVendor.kyc_verified} type="kyc" />
//                     </div>
//                   </AlertDialogHeader>

//                   <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-7">
//                     {[
//                       {
//                         title: "Personal & Contact Information",

//                         icon: UserRound,

//                         items: [
//                           ["Vendor Name", "vendor_name"],

//                           ["Email", "email"],

//                           ["Phone", "phone"],

//                           [
//                             "Account Status",

//                             "is_active",

//                             (v) => (Number(v) === 1 ? "Active" : "Inactive"),
//                           ],
//                         ],
//                       },

//                       {
//                         title: "Company Information",

//                         icon: Building2,

//                         items: [
//                           ["Company", "company_name"],

//                           ["Company Type", "company_type"],

//                           ["GST Number", "company_gst_number"],

//                           ["Address", "company_address"],

//                           ["City", "company_city"],

//                           ["State", "company_state"],

//                           ["Pincode", "company_pincode"],
//                         ],
//                       },

//                       {
//                         title: "Bank Information",

//                         icon: Landmark,

//                         items: [
//                           ["Bank", "bank_name"],

//                           ["Branch", "bank_branch"],

//                           ["IFSC", "bank_ifsc_code"],

//                           [
//                             "Account Number",

//                             "bank_account_number",

//                             (v) => (v ? `•••• ${String(v).slice(-4)}` : "—"),
//                           ],
//                         ],
//                       },
//                     ].map((section) => (
//                       <section
//                         key={section.title}
//                         className="overflow-hidden rounded-xl border border-slate-200 dark:border-neutral-800"
//                       >
//                         <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
//                           <section.icon size={17} className="text-blue-600" />

//                           <h3 className="text-sm font-bold">{section.title}</h3>
//                         </div>

//                         <div className="grid grid-cols-1 gap-x-6 gap-y-4 p-4 sm:grid-cols-2">
//                           {section.items.map(([label, key, format]) => (
//                             <div key={key} className="min-w-0">
//                               <p className="mb-1 text-xs text-slate-500">{label}</p>

//                               <p className="break-words text-sm font-medium">
//                                 {format ? format(selectedVendor[key]) : selectedVendor[key] || "—"}
//                               </p>
//                             </div>
//                           ))}
//                         </div>
//                       </section>
//                     ))}

//                     <section className="overflow-hidden rounded-xl border border-slate-200 dark:border-neutral-800">
//                       <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
//                         <div className="flex items-center gap-2">
//                           <FileText size={17} className="text-blue-600" />

//                           <h3 className="text-sm font-bold">KYC Documents</h3>
//                         </div>

//                         <StatusBadge active={selectedVendor.kyc_verified} type="kyc" />
//                       </div>

//                       <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
//                         {DOCUMENT_FIELDS.map((doc) => {
//                           const value = selectedVendor?.[doc.image];

//                           const type = doc.type ? selectedVendor?.[doc.type] : null;

//                           const c_type = doc.type ? selectedVendor?.[doc.c_type] : null;

//                           const number = doc.number ? selectedVendor?.[doc.number] : null;

//                           console.log(value);

//                           const hasValue = (val) =>
//                             val !== null && val !== undefined && String(val).trim() !== "";

//                           // Hide document card if no data exists
//                           if (!hasValue(value) && !hasValue(type) && !hasValue(number)) {
//                             return null;
//                           }

//                           const url = `${import.meta.env.VITE_BASE_URL}/${value}`;

//                           return (
//                             <div
//                               key={doc.label}
//                               className="rounded-lg border border-slate-200 p-3 dark:border-neutral-700"
//                             >
//                               <p className="text-sm font-semibold">{doc.label}</p>

//                               {hasValue(c_type) && (
//                                 <p className="mt-1 break-words text-sm text-slate-500">
//                                   Company Type: {c_type}
//                                 </p>
//                               )}

//                               {hasValue(type) && (
//                                 <p className="mt-1 break-words text-xs text-slate-500">
//                                   Type: {type}
//                                 </p>
//                               )}

//                               {hasValue(number) && (
//                                 <p className="mt-1 break-words text-xs text-slate-500">
//                                   ID: {number}
//                                 </p>
//                               )}

//                               {value &&
//                                 (url ? (
//                                   <a
//                                     href={url}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
//                                   >
//                                     <ExternalLink size={13} />
//                                     View Document
//                                   </a>
//                                 ) : (
//                                   <p className="mt-3 text-xs text-amber-600">
//                                     Document path available; configure file URL to preview
//                                   </p>
//                                 ))}
//                             </div>
//                           );
//                         })}
//                       </div>

//                       {Number(selectedVendor?.kyc_verified) === 1 ? (
//                         <div className="mb-2 ml-4 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
//                           <CheckCircle2 size={18} className="text-emerald-600" />

//                           <span>KYC Verified</span>

//                           <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide dark:bg-emerald-500/20">
//                             Approved
//                           </span>
//                         </div>
//                       ) : (
//                         <button
//                           type="button"
//                           disabled={
//                             !DOCUMENT_FIELDS.some((doc) => Boolean(selectedVendor?.[doc.image]))
//                           }
//                           title="Only approve after reviewing supporting documents"
//                           onClick={() => setKycConfirm(true)}
//                           className="mb-2 ml-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
//                         >
//                           <ShieldCheck size={17} />
//                           Verify KYCd
//                         </button>
//                       )}

//                       <p className="px-4 pb-4 text-xs text-slate-500">
//                         KYC can only be verified after reviewing uploaded documents. Verification
//                         requires a backend API or an onVerifyKyc callback.
//                       </p>
//                     </section>
//                   </div>

//                   <AlertDialogFooter className="flex-row flex-wrap items-center justify-end gap-2 border-t border-slate-200 px-5 my-0 dark:border-neutral-800 sm:px-7">
//                     <AlertDialogCancel disabled={kycSaving}>Close</AlertDialogCancel>

//                     <button
//                       type="button"
//                       onClick={() => {
//                         openKycEdit(selectedVendor);
//                         setSelectedVendor(null);
//                       }}
//                       className="rounded-lg bg-[#0446DB] px-4 py-2 text-sm font-semibold text-white"
//                     >
//                       <ShieldCheck size={15} className="mr-1 inline" />
//                       Update KYC
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         openEdit(selectedVendor);

//                         setSelectedVendor(null);
//                       }}
//                       className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 dark:border-blue-500/30"
//                     >
//                       <Pencil size={15} /> Edit Details
//                     </button>
//                   </AlertDialogFooter>
//                 </>
//               )}
//             </AlertDialogContent>
//           </AlertDialog>

//           <AlertDialog
//             open={kycConfirm}
//             onOpenChange={(open) => {
//               if (!kycSaving) setKycConfirm(open);
//             }}
//           >
//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>Verify vendor KYC?</AlertDialogTitle>

//                 <AlertDialogDescription>
//                   Confirm that you have reviewed and validated the submitted documents for{" "}
//                   {selectedVendor?.vendor_name}. This action will mark the vendor KYC verified
//                   through your configured backend handler.
//                 </AlertDialogDescription>
//               </AlertDialogHeader>

//               <AlertDialogFooter>
//                 <AlertDialogCancel disabled={kycSaving}>Cancel</AlertDialogCancel>

//                 <AlertDialogAction
//                   onClick={(e) => {
//                     e.preventDefault();

//                     verifyKyc();
//                   }}
//                 >
//                   {kycSaving ? "Verifying..." : "Confirm Verification"}
//                 </AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>

//           <AlertDialog
//             open={!!editing}
//             onOpenChange={(open) => {
//               if (!open && !saving) setEditing(null);
//             }}
//           >
//             <AlertDialogContent className="flex max-h-[92vh] w-[calc(100%-1rem)] max-w-3xl flex-col gap-0 overflow-hidden p-0 dark:bg-neutral-950">
//               {editing && (
//                 <>
//                   <AlertDialogHeader className="border-b border-slate-200 bg-slate-50 px-5 py-4 text-left dark:border-neutral-800 dark:bg-neutral-900">
//                     <AlertDialogTitle>Edit Vendor #{editing.vendor_id}</AlertDialogTitle>

//                     <AlertDialogDescription>
//                       Update vendor information and save changes securely.
//                     </AlertDialogDescription>
//                   </AlertDialogHeader>

//                   <form onSubmit={saveVendor} noValidate className="flex min-h-0 flex-1 flex-col">
//                     <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
//                       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                         {EDIT_FIELDS.map((field) => (
//                           <label
//                             key={field.key}
//                             className={`block space-y-1.5 ${field.key === "company_address" ? "sm:col-span-2" : ""}`}
//                           >
//                             <span className="text-xs font-semibold text-slate-700 dark:text-neutral-200">
//                               {field.label}

//                               {field.required && <span className="ml-1 text-red-500">*</span>}
//                             </span>

//                             {field.key === "company_state" ? (
//                               <select
//                                 value={selectedState?.name || ""}
//                                 onChange={(e) => updateForm("company_state", e.target.value)}
//                                 className={`${inputClass} ${formErrors.company_state ? "border-red-500" : ""}`}
//                               >
//                                 <option value="">Select State</option>

//                                 {INDIAN_STATES.map((state) => (
//                                   <option key={state.isoCode} value={state.name}>
//                                     {state.name}
//                                   </option>
//                                 ))}
//                               </select>
//                             ) : field.key === "company_city" ? (
//                               <div className="space-y-2">
//                                 <select
//                                   value={
//                                     customCityMode
//                                       ? CUSTOM_CITY_VALUE
//                                       : availableCities.some((c) => c.name === form.company_city)
//                                         ? form.company_city
//                                         : ""
//                                   }
//                                   disabled={!selectedState}
//                                   onChange={(e) => {
//                                     if (e.target.value === CUSTOM_CITY_VALUE) {
//                                       setCustomCityMode(true);

//                                       updateForm("company_city", "");
//                                     } else {
//                                       setCustomCityMode(false);

//                                       updateForm("company_city", e.target.value);
//                                     }
//                                   }}
//                                   className={`${inputClass} ${formErrors.company_city ? "border-red-500" : ""}`}
//                                 >
//                                   <option value="">Select City</option>

//                                   {availableCities.map((city) => (
//                                     <option
//                                       key={`${city.name}-${city.latitude}-${city.longitude}`}
//                                       value={city.name}
//                                     >
//                                       {city.name}
//                                     </option>
//                                   ))}

//                                   <option value={CUSTOM_CITY_VALUE}>
//                                     Other / Enter custom city
//                                   </option>
//                                 </select>

//                                 {customCityMode && (
//                                   <input
//                                     type="text"
//                                     value={form.company_city ?? ""}
//                                     maxLength={100}
//                                     onChange={(e) => updateForm("company_city", e.target.value)}
//                                     placeholder="Enter city name"
//                                     className={`${inputClass} ${formErrors.company_city ? "border-red-500" : ""}`}
//                                   />
//                                 )}
//                               </div>
//                             ) : (
//                               <input
//                                 type="text"
//                                 inputMode={
//                                   ["phone", "company_pincode"].includes(field.key)
//                                     ? "numeric"
//                                     : "text"
//                                 }
//                                 value={form[field.key] ?? ""}
//                                 onChange={(e) => updateForm(field.key, e.target.value)}
//                                 maxLength={field.max}
//                                 autoComplete="off"
//                                 className={`${inputClass} ${formErrors[field.key] ? "border-red-500" : ""}`}
//                                 aria-invalid={!!formErrors[field.key]}
//                               />
//                             )}

//                             {formErrors[field.key] && (
//                               <span className="block text-xs text-red-600">
//                                 {formErrors[field.key]}
//                               </span>
//                             )}
//                           </label>
//                         ))}
//                       </div>

//                       <div className="rounded-lg border border-slate-200 p-4 dark:border-neutral-700">
//                         <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
//                           <input
//                             type="checkbox"
//                             checked={changePassword}
//                             onChange={(e) => {
//                               setChangePassword(e.target.checked);

//                               setFormErrors({});
//                             }}
//                           />{" "}
//                           Change vendor password
//                         </label>

//                         {changePassword && (
//                           <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             {[
//                               { key: "password", label: "New Password" },

//                               { key: "confirmPassword", label: "Confirm Password" },
//                             ].map((field) => (
//                               <label key={field.key} className="space-y-1.5">
//                                 <span className="block text-xs font-semibold">{field.label}</span>

//                                 <span className="relative block">
//                                   <input
//                                     type={showPassword ? "text" : "password"}
//                                     value={form[field.key] || ""}
//                                     onChange={(e) => updateForm(field.key, e.target.value)}
//                                     className={`${inputClass} pr-10`}
//                                     autoComplete="new-password"
//                                   />

//                                   <button
//                                     type="button"
//                                     onClick={() => setShowPassword((v) => !v)}
//                                     _aria-label_={showPassword ? "Hide password" : "Show password"}
//                                     className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
//                                   >
//                                     {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                                   </button>
//                                 </span>

//                                 {formErrors[field.key] && (
//                                   <span className="block text-xs text-red-600">
//                                     {formErrors[field.key]}
//                                   </span>
//                                 )}
//                               </label>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <AlertDialogFooter className="border-t border-slate-200 px-5 my-0 dark:border-neutral-800">
//                       <AlertDialogCancel type="button" disabled={saving}>
//                         Cancel
//                       </AlertDialogCancel>

//                       <button
//                         type="submit"
//                         disabled={saving}
//                         className="inline-flex items-center gap-2 rounded-lg bg-[#0446DB] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
//                       >
//                         {saving ? (
//                           <Loader2 size={16} className="animate-spin" />
//                         ) : (
//                           <Save size={16} />
//                         )}{" "}
//                         Save Changes
//                       </button>
//                     </AlertDialogFooter>
//                   </form>
//                 </>
//               )}
//             </AlertDialogContent>
//           </AlertDialog>

//           <AlertDialog
//             open={!!kycEditing}
//             onOpenChange={(open) => {
//               if (!open && !kycSaving) setKycEditing(null);
//             }}
//           >
//             <AlertDialogContent className="flex max-h-[92dvh] w-[calc(100%-1rem)] max-w-3xl flex-col gap-0 overflow-hidden p-0 dark:bg-neutral-950">
//               <AlertDialogHeader className="shrink-0 border-b border-slate-200 bg-slate-50 px-5 py-4 text-left dark:border-neutral-800 dark:bg-neutral-900">
//                 <AlertDialogTitle>Update KYC - {kycEditing?.vendor_name}</AlertDialogTitle>
//                 <AlertDialogDescription>
//                   Upload updated documents and edit KYC or bank information. Changes reset
//                   verification unless explicitly approved.
//                 </AlertDialogDescription>
//               </AlertDialogHeader>
//               <form onSubmit={saveKyc} className="flex min-h-0 flex-1 flex-col" noValidate>
//                 <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
//                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                     {[
//                       ["company_type", "Company Type"],
//                       ["company_gst_number", "GST Number"],
//                       ["company_pancard_name", "Company PAN Name"],
//                       ["document_type", "Identity Document Type"],
//                       ["document_id", "Identity Document ID"],
//                       ["supporting_document_type", "Supporting Document Type"],
//                       ["supporting_document_id", "Supporting Document ID"],
//                       ["bank_name", "Bank Name"],
//                       ["bank_branch", "Bank Branch"],
//                       ["bank_ifsc_code", "IFSC Code"],
//                       ["bank_account_number", "Bank Account Number"],
//                     ].map(([key, label]) => (
//                       <label key={key} className="block space-y-1.5">
//                         <span className="text-xs font-semibold text-slate-700 dark:text-neutral-200">
//                           {label}
//                         </span>
//                         {key == "document_type" ? (
//                           <select
//                             name="document_type"
//                             id="document_type"
//                             value={kycForm[key] ?? ""}
//                             onChange={(e) => {
//                               setKycForm((prev) => ({
//                                 ...prev,
//                                 [key]: e.target.value,
//                               }));
//                               setKycErrors((prev) => ({
//                                 ...prev,
//                                 [key]: "",
//                               }));
//                             }}
//                             className={inputClass}
//                           >
//                             <option value="">Select Identity Document</option>
//                             <option value="aadhar">Aadhaar Card</option>
//                             <option value="pan">PAN Card</option>
//                             <option value="voterid">Voter ID</option>
//                             <option value="passport">Passport</option>
//                             <option value="driving_license">Driving Licence</option>
//                           </select>
//                         ) : key == "company_type" ? (
//                           <>
//                             <select
//                               name="company_type"
//                               id="company_type"
//                               value={kycForm.company_type ?? ""}
//                               onChange={(e) => {
//                                 setKycForm((prev) => ({
//                                   ...prev,
//                                   company_type: e.target.value,
//                                 }));

//                                 setKycErrors((prev) => ({
//                                   ...prev,
//                                   company_type: "",
//                                 }));
//                               }}
//                               className={inputClass}
//                             >
//                               <option value="">Select company type</option>
//                               <option value="Sole Proprietorship">Sole Proprietorship</option>
//                               <option value="Partnership">Partnership</option>
//                               <option value="Limited liability partnership">
//                                 Limited liability partnership
//                               </option>
//                               <option value="Private limited company">
//                                 Private limited company
//                               </option>
//                               <option value="Public limited company">Public limited company</option>
//                             </select>
//                           </>
//                         ) : (
//                           <input
//                             type="text"
//                             value={kycForm[key] ?? ""}
//                             placeholder={label}
//                             onChange={(e) => {
//                               const value = ["company_gst_number", "bank_ifsc_code"].includes(key)
//                                 ? e.target.value.toUpperCase()
//                                 : e.target.value;
//                               setKycForm((p) => ({ ...p, [key]: value }));
//                               setKycErrors((p) => ({ ...p, [key]: "" }));
//                             }}
//                             className={inputClass}
//                             maxLength={
//                               key === "company_gst_number"
//                                 ? 15
//                                 : key === "bank_ifsc_code"
//                                   ? 11
//                                   : undefined
//                             }
//                           />
//                         )}
//                         {kycErrors[key] && (
//                           <span className="text-xs text-red-600">{kycErrors[key]}</span>
//                         )}
//                       </label>
//                     ))}
//                   </div>
//                   <section className="rounded-xl border border-slate-200 p-4 dark:border-neutral-700">
//                     <h3 className="mb-3 font-semibold">KYC Documents</h3>
//                     <div className="grid gap-4 sm:grid-cols-2">
//                       {KYC_FILE_KEYS.map((key) => (
//                         <label key={key} className="block space-y-1.5">
//                           <span className="block text-xs font-semibold">
//                             {KYC_FILE_LABELS[key]}
//                           </span>
//                           {kycEditing?.[key] && (
//                             <span className="block break-all text-[11px] text-slate-500">
//                               Existing file: {String(kycEditing[key]).split(/[\\/]/).pop()}
//                             </span>
//                           )}
//                           <input
//                             type="file"
//                             accept="image/*,.pdf"
//                             onChange={(e) =>
//                               setKycFiles((p) => ({ ...p, [key]: e.target.files?.[0] || null }))
//                             }
//                             className="block w-full rounded-lg border border-slate-200 p-2 text-xs file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-[#0446DB] dark:border-neutral-700"
//                           />
//                         </label>
//                       ))}
//                     </div>
//                   </section>
//                   <label className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-900 dark:bg-amber-950/20">
//                     <input
//                       type="checkbox"
//                       checked={kycMarkVerified}
//                       onChange={(e) => setKycMarkVerified(e.target.checked)}
//                       className="mt-1"
//                     />
//                     <span>
//                       <strong>Approve KYC as verified</strong>
//                       <br />
//                       <span className="text-xs text-slate-600">
//                         Only select after personally reviewing required documents. Leave unchecked
//                         to reset KYC on document/detail changes.
//                       </span>
//                     </span>
//                   </label>
//                 </div>
//                 <AlertDialogFooter className="shrink-0 border-t border-slate-200 bg-white px-5 py-4 dark:border-neutral-800 dark:bg-neutral-950">
//                   <button
//                     type="button"
//                     disabled={kycSaving}
//                     onClick={() => setKycEditing(null)}
//                     className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={kycSaving}
//                     className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0446DB] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
//                   >
//                     {kycSaving && <Loader2 size={16} className="animate-spin" />} Save KYC
//                   </button>
//                 </AlertDialogFooter>
//               </form>
//             </AlertDialogContent>
//           </AlertDialog>

//           <AlertDialog
//             open={!!statusVendor}
//             onOpenChange={(open) => {
//               if (!open && !statusSaving) setStatusVendor(null);
//             }}
//           >
//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>
//                   {Number(statusVendor?.is_active) === 1 ? "Deactivate" : "Activate"} Vendor?
//                 </AlertDialogTitle>

//                 <AlertDialogDescription>
//                   Are you sure you want to{" "}
//                   {Number(statusVendor?.is_active) === 1 ? "deactivate" : "activate"}{" "}
//                   {statusVendor?.vendor_name} (#{statusVendor?.vendor_id})?
//                 </AlertDialogDescription>
//               </AlertDialogHeader>

//               {Number(statusVendor?.is_active) === 1 && (
//                 <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
//                   This will also deactivate all linked riders. Activating the vendor later will not
//                   automatically reactivate those riders.
//                 </p>
//               )}

//               <AlertDialogFooter>
//                 <AlertDialogCancel disabled={statusSaving}>Cancel</AlertDialogCancel>

//                 <AlertDialogAction
//                   disabled={statusSaving}
//                   onClick={(e) => {
//                     e.preventDefault();

//                     updateAccountStatus();
//                   }}
//                 >
//                   {statusSaving
//                     ? "Updating..."
//                     : Number(statusVendor?.is_active) === 1
//                       ? "Deactivate"
//                       : "Activate"}
//                 </AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>
//         </div>
//       )}
//     </>
//   );
// }

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { State, City } from "country-state-city";

import {
  Search,
  RefreshCw,
  Users,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X,
  Loader2,
  Pencil,
  Power,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  FileText,
  ExternalLink,
  CheckCircle2,
  Building2,
  Landmark,
  UserRound,
  Plus,
} from "lucide-react";

import { toast } from "react-toastify";

import AxiosInstance from "@/Helper/axiosInstance";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import CustomButton from "../../common/CustomButton";

import { Link } from "react-router-dom";

const DEFAULT_ENDPOINT = "/api/dc/vendors";

const STATUS_ENDPOINT = "/api/dc/updateVendorAccountStatus";
const KYC_ENDPOINT = "/api/dc/updateVendorKyc";
const KYC_TEXT_KEYS = [
  "company_gst_number",
  "company_type",
  "bank_name",
  "bank_branch",
  "bank_account_number",
  "bank_ifsc_code",
  "document_type",
  "document_id",
  "company_pancard_name",
  "supporting_document_id",
  "supporting_document_type",
];
const KYC_FILE_KEYS = [
  "cheque_image",
  "profile_image",
  "document_image",
  "company_pancard_image",
  "supporting_document_image",
];
const KYC_FILE_LABELS = {
  cheque_image: "Cancelled Cheque",
  profile_image: "Profile Image",
  document_image: "Identity Document",
  company_pancard_image: "Company PAN",
  supporting_document_image: "Supporting Document",
};

const COMPANY_TYPES = [
  { value: "sole Proprietorship", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "limited liability partnership", label: "Limited liability partnership" },
  { value: "private limited company", label: "Private limited company" },
  { value: "public limited company", label: "Public limited company" },
];
const IDENTITY_TYPES = [
  ["aadhar", "Aadhaar Card"],
  ["pan", "PAN Card"],
  ["voterid", "Voter ID"],
  ["passport", "Passport"],
  ["driving_license", "Driving Licence"],
];
const SUPPORTING_TYPES = [
  ["certificate_of_incorporation", "Certificate of Incorporation"],
  ["partnership_deed", "Partnership Deed"],
  ["llp_agreement", "LLP Agreement"],
  ["gst_certificate", "GST Certificate"],
  ["other", "Other"],
];
const normalizeCompanyType = (value) => {
  const matching = COMPANY_TYPES.find(
    (t) =>
      t.value.toLowerCase() ===
      String(value ?? "")
        .trim()
        .toLowerCase(),
  );
  return matching?.value || String(value ?? "").trim();
};
const isSoleCompany = (type) => normalizeCompanyType(type) === "sole Proprietorship";
const isMultiCompany = (type) =>
  COMPANY_TYPES.slice(1).some((t) => t.value === normalizeCompanyType(type));
const getApplicableKycKeys = (type) => {
  const base = [
    "company_type",
    "company_gst_number",
    "bank_name",
    "bank_branch",
    "bank_account_number",
    "bank_ifsc_code",
  ];
  if (isSoleCompany(type)) return [...base, "document_type", "document_id"];
  if (isMultiCompany(type))
    return [...base, "company_pancard_name", "supporting_document_type", "supporting_document_id"];
  return base;
};
const getApplicableKycFiles = (type) => {
  const base = ["profile_image", "cheque_image"];
  if (isSoleCompany(type)) return [...base, "document_image"];
  if (isMultiCompany(type)) return [...base, "company_pancard_image", "supporting_document_image"];
  return base;
};

const LIMIT_OPTIONS = [10, 20, 50, 100];

const EDIT_FIELDS = [
  { key: "vendor_name", label: "Vendor Name", required: true, max: 100 },

  { key: "company_name", label: "Company Name", required: true, max: 150 },

  { key: "email", label: "Email", required: true, max: 254 },

  { key: "phone", label: "Phone", required: true, max: 10 },

  { key: "company_address", label: "Company Address", max: 500 },

  { key: "company_state", label: "State", max: 100 },

  { key: "company_city", label: "City", max: 100 },

  { key: "company_pincode", label: "Pincode", max: 6 },

  { key: "company_gst_number", label: "GST Number", max: 15 },

  { key: "bank_name", label: "Bank Name", max: 150 },

  { key: "bank_branch", label: "Bank Branch", max: 150 },

  { key: "bank_ifsc_code", label: "IFSC Code", max: 11 },

  { key: "bank_account_number", label: "Bank Account Number", max: 34 },
];

const DOCUMENT_FIELDS = [
  {
    label: "Identity Document",

    type: "document_type",

    c_type: "company_type",

    number: "document_id",

    image: "document_image",
  },

  {
    label: "Company PAN",

    c_type: "company_type",

    type: "company_pancard_name",

    image: "company_pancard_image",
  },

  {
    label: "Supporting Document",

    c_type: "company_type",

    type: "supporting_document_type",

    number: "supporting_document_id",

    image: "supporting_document_image",
  },

  { label: "Cancelled Cheque", image: "cheque_image" },
];

const EDIT_KEYS = EDIT_FIELDS.map((f) => f.key);

// Vendor addresses are in India. Keep state/city names in the API payload.
const INDIAN_STATES = State.getStatesOfCountry("IN");

const CUSTOM_CITY_VALUE = "__custom_city__";

const findIndianState = (name) =>
  INDIAN_STATES.find(
    (state) =>
      state.name.toLowerCase() ===
      String(name ?? "")
        .trim()

        .toLowerCase(),
  );

const clean = (value) => (value == null ? "" : String(value).trim());

const getError = (err, fallback) => err?.response?.data?.message || err?.message || fallback;

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",

        month: "short",

        year: "numeric",
      });
};

function StatusBadge({ active, type = "account" }) {
  const yes = Number(active) === 1;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${yes ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${yes ? "bg-emerald-500" : "bg-amber-500"}`} />

      {type === "kyc" ? (yes ? "Verified" : "Not Verified") : yes ? "Active" : "Inactive"}
    </span>
  );
}

function validateEdit(form, original, changePassword) {
  const errors = {};

  for (const field of EDIT_FIELDS) {
    const value = clean(form[field.key]);

    if (field.required && !value) errors[field.key] = `${field.label} is required`;
    else if (value.length > field.max)
      errors[field.key] = `Maximum ${field.max} characters allowed`;
  }

  if (clean(form.company_state) && !findIndianState(form.company_state))
    errors.company_state = "Select a valid Indian state";

  if (clean(form.company_city) && !/^[\p{L}\p{M} .'-]{2,100}$/u.test(clean(form.company_city)))
    errors.company_city = "City must contain 2–100 letters or valid name characters";

  const vendorName = clean(form.vendor_name);

  if (
    !errors.vendor_name &&
    (!/^[\p{L}\p{M} .'-]+$/u.test(vendorName) ||
      !/\p{L}/u.test(vendorName) ||
      vendorName.length < 2)
  )
    errors.vendor_name = "Vendor name must contain at least 2 characters and no numbers";

  if (!errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(form.email)))
    errors.email = "Enter a valid email";

  if (!errors.phone && !/^[6-9]\d{9}$/.test(clean(form.phone)))
    errors.phone = "Enter a valid 10-digit Indian mobile number";

  if (clean(form.company_pincode) && !/^[1-9]\d{5}$/.test(clean(form.company_pincode)))
    errors.company_pincode = "Enter a valid 6-digit Indian pincode";

  const gst = clean(form.company_gst_number).toUpperCase();

  if (
    gst &&
    (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gst) ||
      Number(gst.slice(0, 2)) < 1 ||
      Number(gst.slice(0, 2)) > 38)
  )
    errors.company_gst_number = "Enter a valid 15-character GSTIN";

  if (changePassword) {
    const password = form.password || "";

    const confirm = form.confirmPassword || "";

    const bytes = new TextEncoder().encode(password).length;

    if (bytes < 8 || bytes > 72) errors.password = "Password must be 8–72 bytes";

    if (password !== confirm) errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export default function DcVendorListing({
  endpoint = DEFAULT_ENDPOINT,

  onAddVendor,

  onVerifyKyc,
}) {
  const [vendors, setVendors] = useState([]);

  const [searchInput, setSearchInput] = useState("");

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(20);

  const [pagination, setPagination] = useState({
    page: 1,

    limit: 20,

    total: 0,

    totalPages: 0,
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedVendor, setSelectedVendor] = useState(null);

  const [kycConfirm, setKycConfirm] = useState(false);
  const [kycEditing, setKycEditing] = useState(null);
  const [kycForm, setKycForm] = useState({});
  const [kycFiles, setKycFiles] = useState({});
  const [kycErrors, setKycErrors] = useState({});
  const [kycMarkVerified, setKycMarkVerified] = useState(false);

  const [kycSaving, setKycSaving] = useState(false);

  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({});

  const [formErrors, setFormErrors] = useState({});

  const [customCityMode, setCustomCityMode] = useState(false);

  const selectedState = useMemo(() => findIndianState(form.company_state), [form.company_state]);

  const availableCities = useMemo(
    () => (selectedState ? City.getCitiesOfState("IN", selectedState.isoCode) : []),

    [selectedState],
  );

  const [changePassword, setChangePassword] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [saving, setSaving] = useState(false);

  const [statusVendor, setStatusVendor] = useState(null);

  const [statusSaving, setStatusSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);

      setSearch(searchInput.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchVendors = useCallback(
    async (signal) => {
      setLoading(true);

      setError("");

      try {
        const { data } = await AxiosInstance.get(endpoint, {
          params: { page, limit, search },

          signal,
        });

        if (data?.success !== true) throw new Error(data?.message || "Unable to fetch vendors");

        if (signal.aborted) return;

        setVendors(Array.isArray(data.data) ? data.data : []);

        setPagination({
          page: Number(data.pagination?.page) || page,

          limit: Number(data.pagination?.limit) || limit,

          total: Number(data.pagination?.total) || 0,

          totalPages: Number(data.pagination?.totalPages) || 0,
        });
      } catch (err) {
        if (signal.aborted || err?.code === "ERR_CANCELED") return;

        const message = getError(err, "Failed to fetch vendors");

        setError(message);

        setVendors([]);

        toast.error(message);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    },

    [endpoint, page, limit, search],
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchVendors(controller.signal);

    return () => controller.abort();
  }, [fetchVendors, refreshKey]);

  const refresh = () => setRefreshKey((key) => key + 1);

  const openEdit = (vendor) => {
    const values = {};

    for (const key of EDIT_KEYS) values[key] = vendor[key] == null ? "" : String(vendor[key]);

    setForm({ ...values, password: "", confirmPassword: "" });

    setFormErrors({});

    const state = findIndianState(values.company_state);

    const cities = state ? City.getCitiesOfState("IN", state.isoCode) : [];

    setCustomCityMode(
      Boolean(values.company_city) &&
        !cities.some(
          (city) => city.name.toLowerCase() === values.company_city.trim().toLowerCase(),
        ),
    );

    setChangePassword(false);

    setShowPassword(false);

    setEditing(vendor);
  };

  const updateForm = (key, value) => {
    let next = String(value ?? "");

    if (key === "vendor_name") next = next.replace(/[^\p{L}\p{M} .'-]/gu, "").slice(0, 100);

    if (key === "phone") next = next.replace(/\D/g, "").slice(0, 10);

    if (key === "company_pincode") next = next.replace(/\D/g, "").slice(0, 6);

    if (key === "company_gst_number")
      next = next

        .toUpperCase()

        .replace(/[^A-Z0-9]/g, "")

        .slice(0, 15);

    if (key === "company_state") {
      setCustomCityMode(false);

      setForm((previous) => ({ ...previous, company_state: next, company_city: "" }));

      setFormErrors((previous) => ({
        ...previous,

        company_state: undefined,

        company_city: undefined,
      }));

      return;
    }

    setForm((previous) => ({ ...previous, [key]: next }));

    setFormErrors((previous) => ({ ...previous, [key]: undefined }));
  };

  const saveVendor = async (event) => {
    event.preventDefault();

    if (!editing || saving) return;

   
    const payload = {};

    for (const key of EDIT_KEYS) {
      const next = clean(form[key]);

      const before = clean(editing[key]);

      if (next !== before)
        payload[key] = next || (EDIT_FIELDS.find((f) => f.key === key)?.required ? next : null);
    }

    if (payload.email) payload.email = payload.email.toLowerCase();

    if (payload.company_gst_number)
      payload.company_gst_number = payload.company_gst_number.toUpperCase();

    if (payload.bank_ifsc_code) payload.bank_ifsc_code = payload.bank_ifsc_code.toUpperCase();

    if (changePassword) {
      payload.password = form.password;

      payload.confirmPassword = form.confirmPassword;
    }

    if (!Object.keys(payload).length) {
      toast.info("No changes to save");

      return;
    }

    setSaving(true);

    try {
      const { data } = await AxiosInstance.patch(
        `${endpoint}/${encodeURIComponent(Number(editing?.id))}`,

        payload,
      );

      if (data?.success !== true) throw new Error(data?.message || "Unable to update vendor");

      toast.success(data.message || "Vendor updated successfully");

      setEditing(null);

      refresh();
    } catch (err) {
      toast.error(getError(err, "Failed to update vendor"));
    } finally {
      setSaving(false);
    }
  };

  const openKycEdit = (vendor) => {
    setKycEditing(vendor);
    setKycForm(
      Object.fromEntries(
        KYC_TEXT_KEYS.map((key) => [
          key,
          key === "company_type"
            ? normalizeCompanyType(vendor?.[key])
            : String(vendor?.[key] ?? ""),
        ]),
      ),
    );
    setKycFiles({});
    setKycErrors({});
    setKycMarkVerified(false);
  };

  const saveKyc = async (event) => {
    event.preventDefault();
    if (!kycEditing || kycSaving) return;
    const errors = {};
    const companyType = normalizeCompanyType(kycForm.company_type);
    if (!COMPANY_TYPES.some((t) => t.value === companyType)) {
      errors.company_type = "Select a valid company type";
    }
    const gst = (kycForm.company_gst_number || "").trim().toUpperCase();
    const ifsc = (kycForm.bank_ifsc_code || "").trim().toUpperCase();
    if (gst && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gst))
      errors.company_gst_number = "Invalid 15-character GSTIN";
    if (ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc))
      errors.bank_ifsc_code = "Invalid 11-character IFSC";
    if (Object.keys(errors).length) {
      setKycErrors(errors);
      toast.error("Please check KYC fields");
      return;
    }

    const data = new FormData();
    data.append("vendor_id", String(kycEditing.vendor_id));
    let changes = 0;
    for (const key of getApplicableKycKeys(companyType)) {
      const value = String(kycForm[key] ?? "").trim();
      if (value !== String(kycEditing[key] ?? "").trim()) {
        data.append(key, value);
        changes += 1;
      }
    }
    for (const key of getApplicableKycFiles(companyType)) {
      if (kycFiles[key] instanceof File) {
        data.append(key, kycFiles[key]);
        changes += 1;
      }
    }
    // Approval requires the relevant documents to be present, either already uploaded or newly selected.
    if (kycMarkVerified) {
      const requiredDocs = isSoleCompany(companyType)
        ? ["document_image"]
        : ["company_pancard_image", "supporting_document_image"];
      const missing = requiredDocs.filter((key) => !kycFiles[key] && !kycEditing?.[key]);
      if (missing.length) {
        setKycErrors((prev) => ({
          ...prev,
          documents: "Upload the required documents before approval",
        }));
        toast.error("Required documents are missing; cannot approve KYC");
        return;
      }
      data.append("kyc_verified", "1");
      changes += 1;
    }
    if (!changes) {
      toast.info("No KYC changes to save");
      return;
    }

    setKycSaving(true);
    try {
      // Let Axios set the multipart boundary; do not set Content-Type manually.
      const { data: result } = await AxiosInstance.post(KYC_ENDPOINT, data);
      if (result?.success !== true) throw new Error(result?.message || "Failed to update KYC");
      toast.success(result.message || "Vendor KYC updated successfully");
      setKycEditing(null);
      setSelectedVendor(null);
      refresh();
    } catch (err) {
      toast.error(getError(err, "Failed to update vendor KYC"));
    } finally {
      setKycSaving(false);
    }
  };

  const verifyKyc = async () => {
    if (!selectedVendor || kycSaving) return;
    setKycSaving(true);
    try {
      // const data = new FormData();
      // data.append("vendor_id", String(selectedVendor.vendor_id));
      // data.append("kyc_verified", 1);
      const data = {
        vendor_id: selectedVendor.id,
        kyc_verified: 1,
      };
      console.log(data,selectedVendor)
      const { data: result } = await AxiosInstance.post(KYC_ENDPOINT, data);
      if (result?.success !== true) throw new Error(result?.message || "KYC approval failed");
      toast.success(result.message || "KYC verified successfully");
      setKycConfirm(false);
      setSelectedVendor(null);
      refresh();
    } catch (err) {
      toast.error(getError(err, "KYC verification failed"));
    } finally {
      setKycSaving(false);
    }
  };

  const updateAccountStatus = async () => {
    if (!statusVendor || statusSaving) return;

    const nextStatus = Number(statusVendor.is_active) === 1 ? 0 : 1;

    setStatusSaving(true);
    console.log(statusVendor)
    try {
      const { data } = await AxiosInstance.post(STATUS_ENDPOINT, {
        vendor_id: statusVendor.id,

        is_active: nextStatus,
      });

      if (data?.success !== true)
        throw new Error(data?.message || "Unable to update account status");

      toast.success(data.message || "Account status updated successfully");

      setStatusVendor(null);

      refresh();
    } catch (err) {
      toast.error(getError(err, "Failed to update account status"));
    } finally {
      setStatusSaving(false);
    }
  };

  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingPage(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const totalPages = pagination.totalPages;

  const start = pagination.total ? (page - 1) * limit + 1 : 0;

  const end = Math.min(page * limit, pagination.total);

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white";

  return (
    <>
      {loadingPage ? (
        <div className=" w-full h-[90vh] flex justify-center items-center">
          <div>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />

            <p className="mt-2">Loading Vendor Details...</p>
          </div>
        </div>
      ) : (
        <div className="flex h-[calc(100dvh-100px)] min-h-0 w-full flex-col overflow-hidden bg-[#F7F8FA] text-slate-900 dark:bg-neutral-950 dark:text-neutral-100">
          <div className="mx-auto flex min-h-0 w-full flex-1 flex-col gap-3 overflow-hidden">
            <div className="flex shrink-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* LEFT - Heading */}

              <div className="min-w-0 lg:shrink-0">
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">DC Vendors</h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">
                  Manage vendors onboarded under your DC account.
                </p>
              </div>

              {/* RIGHT - Search + Buttons */}

              <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
                {/* Search */}

                <div className="relative w-full sm:min-w-[220px] sm:flex-1 lg:w-80 lg:flex-none">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value.slice(0, 100))}
                    placeholder="Search vendor, company, phone, email..."
                    aria-label="Search vendors"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800"
                  />

                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => setSearchInput("")}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Action Buttons */}

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={refresh}
                    disabled={loading}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium hover:bg-slate-50 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                  >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    Refresh
                  </button>

                  <CustomButton icon={Plus}>
                    <Link to={"/dc/vendor/on-boarding"}>Add Vendor</Link>
                  </CustomButton>
                </div>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="min-h-0 w-full flex-1 overflow-auto overscroll-contain">
                <table className="w-full min-w-[1080px] text-left text-sm">
                  <thead className="sticky top-0 z-20 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 shadow-[0_1px_0_#e2e8f0] dark:bg-neutral-800 dark:text-neutral-400">
                    <tr>
                      {[
                        "Vendor ID",

                        "Vendor",

                        "Company",

                        "Contact",

                        "Account Status",

                        "KYC Status",

                        "Joined On",

                        "Actions",
                      ].map((heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="sticky top-0 z-20 whitespace-nowrap bg-slate-50 px-4 py-3 font-semibold dark:bg-neutral-800"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="py-16 text-center">
                          <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-[#0446DB]" />

                          <span className="text-sm text-slate-500">Fetching vendors...</span>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-16 text-center">
                          <p className="font-medium text-red-600">{error}</p>

                          <button
                            type="button"
                            onClick={refresh}
                            className="mt-3 text-sm font-semibold text-[#0446DB]"
                          >
                            Try again
                          </button>
                        </td>
                      </tr>
                    ) : vendors.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-16 text-center">
                          <Users className="mx-auto mb-3 h-9 w-9 text-slate-300" />

                          <p className="font-semibold">No vendors found</p>

                          <p className="mt-1 text-xs text-slate-500">
                            {search
                              ? "Try a different search term."
                              : "Onboard a vendor to see them here."}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      vendors.map((vendor) => (
                        <tr
                          key={vendor.vendor_id}
                          className="hover:bg-slate-50/80 dark:hover:bg-neutral-800/40"
                        >
                          <td className="whitespace-nowrap px-4 py-4 font-medium text-[#0446DB]">
                            #{vendor.id}
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-[#0446DB] dark:bg-blue-500/10">
                                {String(vendor.vendor_name || "V")
                                  .charAt(0)

                                  .toUpperCase()}
                              </span>

                              <span className="font-semibold">{vendor.vendor_name || "—"}</span>
                            </div>
                          </td>

                          <td className="px-4 py-4">{vendor.company_name || "—"}</td>

                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              <p className="whitespace-nowrap">{vendor.phone || "—"}</p>

                              <p className="text-xs text-slate-500 dark:text-neutral-400">
                                {vendor.email || "—"}
                              </p>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge active={vendor.is_active} />
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge active={vendor.kyc_verified} type="kyc" />
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 text-slate-500 dark:text-neutral-400">
                            {formatDate(vendor.created_at)}
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedVendor(vendor)}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                              >
                                <Eye size={14} /> View Details
                              </button>

                              <button
                                type="button"
                                onClick={() => setStatusVendor(vendor)}
                                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${Number(vendor.is_active) === 1 ? "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/30 dark:hover:bg-emerald-500/10"}`}
                              >
                                <Power size={14} />

                                {Number(vendor.is_active) === 1 ? "Deactivate" : "Activate"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="z-20 flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-neutral-400">
                  <span>
                    Showing {start}–{end} of {pagination.total}
                  </span>

                  <label className="flex items-center gap-2">
                    Rows per page
                    <select
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value));

                        setPage(1);
                      }}
                      className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                    >
                      {LIMIT_OPTIONS.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <span className="mr-1 text-xs text-slate-500">
                    Page {page} of {Math.max(totalPages, 1)}
                  </span>

                  <button
                    type="button"
                    aria-label="Previous page"
                    disabled={loading || page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    type="button"
                    aria-label="Next page"
                    disabled={loading || page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            <p className="flex shrink-0 items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck size={14} /> Only vendors belonging to your authenticated DC are returned
              by the API.
            </p>
          </div>

          <AlertDialog
            open={!!selectedVendor}
            onOpenChange={(open) => {
              if (!open && !kycSaving) setSelectedVendor(null);
            }}
          >
            <AlertDialogContent className="flex max-h-[92vh] w-[calc(100%-1rem)] max-w-4xl flex-col gap-0 overflow-hidden rounded-2xl border-slate-200 p-0 dark:border-neutral-800 dark:bg-neutral-950">
              {selectedVendor && (
                <>
                  <AlertDialogHeader className="border-b border-slate-200 bg-slate-50 px-5 py-5 text-left dark:border-neutral-800 dark:bg-neutral-900 sm:px-7">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                          <Building2 size={24} />
                        </span>

                        <div>
                          <AlertDialogTitle className="text-xl font-bold">
                            {selectedVendor.vendor_name || "Vendor Details"}
                          </AlertDialogTitle>

                          <AlertDialogDescription className="mt-1">
                            Vendor #{selectedVendor.vendor_id} ·{" "}
                            {selectedVendor.company_name || "Company not provided"}
                          </AlertDialogDescription>
                        </div>
                      </div>

                      <StatusBadge active={selectedVendor.kyc_verified} type="kyc" />
                    </div>
                  </AlertDialogHeader>

                  <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-7">
                    {[
                      {
                        title: "Personal & Contact Information",

                        icon: UserRound,

                        items: [
                          ["Vendor Name", "vendor_name"],

                          ["Email", "email"],

                          ["Phone", "phone"],

                          [
                            "Account Status",

                            "is_active",

                            (v) => (Number(v) === 1 ? "Active" : "Inactive"),
                          ],
                        ],
                      },

                      {
                        title: "Company Information",

                        icon: Building2,

                        items: [
                          ["Company", "company_name"],

                          ["Company Type", "company_type"],

                          ["GST Number", "company_gst_number"],

                          ["Address", "company_address"],

                          ["City", "company_city"],

                          ["State", "company_state"],

                          ["Pincode", "company_pincode"],
                        ],
                      },

                      {
                        title: "Bank Information",

                        icon: Landmark,

                        items: [
                          ["Bank", "bank_name"],

                          ["Branch", "bank_branch"],

                          ["IFSC", "bank_ifsc_code"],

                          ["Account Number", "bank_account_number", ,],
                        ],
                      },
                    ].map((section) => (
                      <section
                        key={section.title}
                        className="overflow-hidden rounded-xl border border-slate-200 dark:border-neutral-800"
                      >
                        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
                          <section.icon size={17} className="text-blue-600" />

                          <h3 className="text-sm font-bold">{section.title}</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-x-6 gap-y-4 p-4 sm:grid-cols-2">
                          {section.items.map(([label, key, format]) => (
                            <div key={key} className="min-w-0">
                              <p className="mb-1 text-xs text-slate-500">{label}</p>

                              <p className="break-words text-sm font-medium">
                                {format ? format(selectedVendor[key]) : selectedVendor[key] || "—"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </section>
                    ))}

                    <section className="overflow-hidden rounded-xl border border-slate-200 dark:border-neutral-800">
                      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center gap-2">
                          <FileText size={17} className="text-blue-600" />

                          <h3 className="text-sm font-bold">KYC Documents</h3>
                        </div>

                        <StatusBadge active={selectedVendor.kyc_verified} type="kyc" />
                      </div>

                      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                        {DOCUMENT_FIELDS.map((doc) => {
                          const value = selectedVendor?.[doc.image];

                          const type = doc.type ? selectedVendor?.[doc.type] : null;

                          const c_type = doc.type ? selectedVendor?.[doc.c_type] : null;

                          const number = doc.number ? selectedVendor?.[doc.number] : null;

                          console.log(value);

                          const hasValue = (val) =>
                            val !== null && val !== undefined && String(val).trim() !== "";

                          // Hide document card if no data exists
                          if (!hasValue(value) && !hasValue(type) && !hasValue(number)) {
                            return null;
                          }

                          const url = `${import.meta.env.VITE_BASE_URL}/${value}`;

                          return (
                            <div
                              key={doc.label}
                              className="rounded-lg border border-slate-200 p-3 dark:border-neutral-700"
                            >
                              <p className="text-sm font-semibold">{doc.label}</p>

                              {hasValue(c_type) && (
                                <p className="mt-1 break-words text-sm text-slate-500">
                                  Company Type: {c_type}
                                </p>
                              )}

                              {hasValue(type) && (
                                <p className="mt-1 break-words text-xs text-slate-500">
                                  Type: {type}
                                </p>
                              )}

                              {hasValue(number) && (
                                <p className="mt-1 break-words text-xs text-slate-500">
                                  ID: {number}
                                </p>
                              )}

                              {value &&
                                (url ? (
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                                  >
                                    <ExternalLink size={13} />
                                    View Document
                                  </a>
                                ) : (
                                  <p className="mt-3 text-xs text-amber-600">
                                    Document path available; configure file URL to preview
                                  </p>
                                ))}
                            </div>
                          );
                        })}
                      </div>

                      {Number(selectedVendor?.kyc_verified) === 1 ? (
                        <div className="mb-2 ml-4 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
                          <CheckCircle2 size={18} className="text-emerald-600" />

                          <span>KYC Verified</span>

                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide dark:bg-emerald-500/20">
                            Approved
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={
                            !DOCUMENT_FIELDS.some((doc) => Boolean(selectedVendor?.[doc.image]))
                          }
                          title="Only approve after reviewing supporting documents"
                          onClick={() => setKycConfirm(true)}
                          className="mb-2 ml-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ShieldCheck size={17} />
                          Verify KYC
                        </button>
                      )}

                      <p className="px-4 pb-4 text-xs text-slate-500">
                        KYC can only be verified after reviewing uploaded documents. Verification
                        requires a backend API or an onVerifyKyc callback.
                      </p>
                    </section>
                  </div>

                  <AlertDialogFooter className="flex-row flex-wrap items-center justify-end gap-2 border-t border-slate-200 px-5 my-0 dark:border-neutral-800 sm:px-7">
                    <AlertDialogCancel disabled={kycSaving}>Close</AlertDialogCancel>

                    <button
                      type="button"
                      onClick={() => {
                        openKycEdit(selectedVendor);
                        setSelectedVendor(null);
                      }}
                      className="rounded-lg bg-[#0446DB] px-4 py-2 text-sm font-semibold text-white"
                    >
                      <ShieldCheck size={15} className="mr-1 inline" />
                      Update KYC
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        openEdit(selectedVendor);

                        setSelectedVendor(null);
                      }}
                      className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 dark:border-blue-500/30"
                    >
                      <Pencil size={15} /> Edit Details
                    </button>
                  </AlertDialogFooter>
                </>
              )}
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog
            open={kycConfirm}
            onOpenChange={(open) => {
              if (!kycSaving) setKycConfirm(open);
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Verify vendor KYC?</AlertDialogTitle>

                <AlertDialogDescription>
                  Confirm that you have reviewed and validated the submitted documents for{" "}
                  {selectedVendor?.vendor_name}. This action will mark the vendor KYC verified
                  through your configured backend handler.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={kycSaving}>Cancel</AlertDialogCancel>

                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();

                    verifyKyc();
                  }}
                >
                  {kycSaving ? "Verifying..." : "Confirm Verification"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog
            open={!!editing}
            onOpenChange={(open) => {
              if (!open && !saving) setEditing(null);
            }}
          >
            <AlertDialogContent className="flex max-h-[92vh] w-[calc(100%-1rem)] max-w-3xl flex-col gap-0 overflow-hidden p-0 dark:bg-neutral-950">
              {editing && (
                <>
                  <AlertDialogHeader className="border-b border-slate-200 bg-slate-50 px-5 py-4 text-left dark:border-neutral-800 dark:bg-neutral-900">
                    <AlertDialogTitle>Edit Vendor #{editing.vendor_id}</AlertDialogTitle>

                    <AlertDialogDescription>
                      Update vendor information and save changes securely.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <form onSubmit={saveVendor} noValidate className="flex min-h-0 flex-1 flex-col">
                    <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {EDIT_FIELDS.map((field) => (
                          <label
                            key={field.key}
                            className={`block space-y-1.5 ${field.key === "company_address" ? "sm:col-span-2" : ""}`}
                          >
                            <span className="text-xs font-semibold text-slate-700 dark:text-neutral-200">
                              {field.label}

                              {field.required && <span className="ml-1 text-red-500">*</span>}
                            </span>

                            {field.key === "company_state" ? (
                              <select
                                value={selectedState?.name || ""}
                                onChange={(e) => updateForm("company_state", e.target.value)}
                                className={`${inputClass} ${formErrors.company_state ? "border-red-500" : ""}`}
                              >
                                <option value="">Select State</option>

                                {INDIAN_STATES.map((state) => (
                                  <option key={state.isoCode} value={state.name}>
                                    {state.name}
                                  </option>
                                ))}
                              </select>
                            ) : field.key === "company_city" ? (
                              <div className="space-y-2">
                                <select
                                  value={
                                    customCityMode
                                      ? CUSTOM_CITY_VALUE
                                      : availableCities.some((c) => c.name === form.company_city)
                                        ? form.company_city
                                        : ""
                                  }
                                  disabled={!selectedState}
                                  onChange={(e) => {
                                    if (e.target.value === CUSTOM_CITY_VALUE) {
                                      setCustomCityMode(true);

                                      updateForm("company_city", "");
                                    } else {
                                      setCustomCityMode(false);

                                      updateForm("company_city", e.target.value);
                                    }
                                  }}
                                  className={`${inputClass} ${formErrors.company_city ? "border-red-500" : ""}`}
                                >
                                  <option value="">Select City</option>

                                  {availableCities.map((city) => (
                                    <option
                                      key={`${city.name}-${city.latitude}-${city.longitude}`}
                                      value={city.name}
                                    >
                                      {city.name}
                                    </option>
                                  ))}

                                  <option value={CUSTOM_CITY_VALUE}>
                                    Other / Enter custom city
                                  </option>
                                </select>

                                {customCityMode && (
                                  <input
                                    type="text"
                                    value={form.company_city ?? ""}
                                    maxLength={100}
                                    onChange={(e) => updateForm("company_city", e.target.value)}
                                    placeholder="Enter city name"
                                    className={`${inputClass} ${formErrors.company_city ? "border-red-500" : ""}`}
                                  />
                                )}
                              </div>
                            ) : (
                              <input
                                type="text"
                                inputMode={
                                  ["phone", "company_pincode"].includes(field.key)
                                    ? "numeric"
                                    : "text"
                                }
                                value={form[field.key] ?? ""}
                                onChange={(e) => updateForm(field.key, e.target.value)}
                                maxLength={field.max}
                                autoComplete="off"
                                className={`${inputClass} ${formErrors[field.key] ? "border-red-500" : ""}`}
                                aria-invalid={!!formErrors[field.key]}
                              />
                            )}

                            {formErrors[field.key] && (
                              <span className="block text-xs text-red-600">
                                {formErrors[field.key]}
                              </span>
                            )}
                          </label>
                        ))}
                      </div>

                      <div className="rounded-lg border border-slate-200 p-4 dark:border-neutral-700">
                        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                          <input
                            type="checkbox"
                            checked={changePassword}
                            onChange={(e) => {
                              setChangePassword(e.target.checked);

                              setFormErrors({});
                            }}
                          />{" "}
                          Change vendor password
                        </label>

                        {changePassword && (
                          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {[
                              { key: "password", label: "New Password" },

                              { key: "confirmPassword", label: "Confirm Password" },
                            ].map((field) => (
                              <label key={field.key} className="space-y-1.5">
                                <span className="block text-xs font-semibold">{field.label}</span>

                                <span className="relative block">
                                  <input
                                    type={showPassword ? "text" : "password"}
                                    value={form[field.key] || ""}
                                    onChange={(e) => updateForm(field.key, e.target.value)}
                                    className={`${inputClass} pr-10`}
                                    autoComplete="new-password"
                                  />

                                  <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                                  >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                  </button>
                                </span>

                                {formErrors[field.key] && (
                                  <span className="block text-xs text-red-600">
                                    {formErrors[field.key]}
                                  </span>
                                )}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <AlertDialogFooter className="border-t border-slate-200 px-5 my-0 dark:border-neutral-800">
                      <AlertDialogCancel type="button" disabled={saving}>
                        Cancel
                      </AlertDialogCancel>

                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#0446DB] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                      >
                        {saving ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Save size={16} />
                        )}{" "}
                        Save Changes
                      </button>
                    </AlertDialogFooter>
                  </form>
                </>
              )}
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog
            open={!!kycEditing}
            onOpenChange={(open) => {
              if (!open && !kycSaving) setKycEditing(null);
            }}
          >
            <AlertDialogContent className="flex max-h-[92dvh] w-[calc(100%-1rem)] max-w-3xl flex-col gap-0 overflow-hidden p-0 dark:bg-neutral-950">
              <AlertDialogHeader className="shrink-0 border-b border-slate-200 bg-slate-50 px-5 py-4 text-left dark:border-neutral-800 dark:bg-neutral-900">
                <AlertDialogTitle>Update KYC - {kycEditing?.vendor_name}</AlertDialogTitle>
                <AlertDialogDescription>
                  Upload updated documents and edit KYC or bank information. Changes reset
                  verification unless explicitly approved.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <form onSubmit={saveKyc} className="flex min-h-0 flex-1 flex-col" noValidate>
                <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
                  <section className="space-y-3">
                    <h3 className="text-sm font-semibold">Business Verification</h3>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold">
                        Company Type <span className="text-red-500">*</span>
                      </span>
                      <select
                        className={inputClass}
                        value={kycForm.company_type ?? ""}
                        onChange={(e) => {
                          setKycForm((prev) => ({ ...prev, company_type: e.target.value }));
                          setKycErrors((prev) => ({ ...prev, company_type: "" }));
                          setKycMarkVerified(false);
                        }}
                      >
                        <option value="">Select company type</option>
                        {COMPANY_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {kycErrors.company_type && (
                        <span className="text-xs text-red-600">{kycErrors.company_type}</span>
                      )}
                    </label>
                    {!kycForm.company_type && (
                      <p className="rounded-lg border border-dashed p-4 text-sm text-slate-500">
                        Select company type to see applicable KYC documents.
                      </p>
                    )}
                    {isSoleCompany(kycForm.company_type) && (
                      <p className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700 dark:bg-blue-950/30">
                        Sole Proprietorship: Identity document details and identity document upload.
                      </p>
                    )}
                    {isMultiCompany(kycForm.company_type) && (
                      <p className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700 dark:bg-blue-950/30">
                        Company / Partnership: Company PAN and supporting document details and
                        uploads.
                      </p>
                    )}
                    {kycForm.company_type && (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {[
                          ["company_gst_number", "GST Number"],
                          ...(isSoleCompany(kycForm.company_type)
                            ? [
                                ["document_type", "Identity Document Type"],
                                ["document_id", "Identity Document ID"],
                              ]
                            : []),
                          ...(isMultiCompany(kycForm.company_type)
                            ? [
                                ["company_pancard_name", "Company PAN Card Name"],
                                ["supporting_document_type", "Supporting Document Type"],
                                ["supporting_document_id", "Supporting Document ID"],
                              ]
                            : []),
                        ].map(([key, label]) => (
                          <label key={key} className="block space-y-1.5">
                            <span className="text-xs font-semibold text-slate-700 dark:text-neutral-200">
                              {label}
                            </span>
                            {["document_type", "supporting_document_type"].includes(key) ? (
                              <select
                                className={inputClass}
                                value={kycForm[key] ?? ""}
                                onChange={(e) => {
                                  setKycForm((prev) => ({ ...prev, [key]: e.target.value }));
                                  setKycErrors((prev) => ({ ...prev, [key]: "" }));
                                }}
                              >
                                <option value="">Select {label}</option>
                                {(key === "document_type" ? IDENTITY_TYPES : SUPPORTING_TYPES).map(
                                  ([value, title]) => (
                                    <option key={value} value={value}>
                                      {title}
                                    </option>
                                  ),
                                )}
                              </select>
                            ) : (
                              <input
                                type="text"
                                className={inputClass}
                                value={kycForm[key] ?? ""}
                                placeholder={label}
                                maxLength={key === "company_gst_number" ? 15 : undefined}
                                onChange={(e) => {
                                  const value =
                                    key === "company_gst_number"
                                      ? e.target.value.toUpperCase()
                                      : e.target.value;
                                  setKycForm((prev) => ({ ...prev, [key]: value }));
                                  setKycErrors((prev) => ({ ...prev, [key]: "" }));
                                }}
                              />
                            )}
                            {kycErrors[key] && (
                              <span className="text-xs text-red-600">{kycErrors[key]}</span>
                            )}
                          </label>
                        ))}
                      </div>
                    )}
                  </section>
                  <section className="rounded-xl border border-slate-200 p-4 dark:border-neutral-700">
                    <h3 className="mb-3 font-semibold">Bank Details</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {[
                        ["bank_name", "Bank Name"],
                        ["bank_branch", "Bank Branch"],
                        ["bank_ifsc_code", "IFSC Code"],
                        ["bank_account_number", "Bank Account Number"],
                      ].map(([key, label]) => (
                        <label key={key} className="block space-y-1.5">
                          <span className="text-xs font-semibold">{label}</span>
                          <input
                            className={inputClass}
                            type="text"
                            value={kycForm[key] ?? ""}
                            placeholder={label}
                            maxLength={key === "bank_ifsc_code" ? 11 : undefined}
                            onChange={(e) => {
                              const value =
                                key === "bank_ifsc_code"
                                  ? e.target.value.toUpperCase()
                                  : e.target.value;
                              setKycForm((prev) => ({ ...prev, [key]: value }));
                              setKycErrors((prev) => ({ ...prev, [key]: "" }));
                            }}
                          />
                          {kycErrors[key] && (
                            <span className="text-xs text-red-600">{kycErrors[key]}</span>
                          )}
                        </label>
                      ))}
                    </div>
                  </section>
                  <section className="rounded-xl border border-slate-200 p-4 dark:border-neutral-700">
                    <h3 className="mb-3 font-semibold">KYC Documents</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {getApplicableKycFiles(kycForm.company_type).map((key) => (
                        <label key={key} className="block space-y-1.5">
                          <span className="block text-xs font-semibold">
                            {KYC_FILE_LABELS[key]}
                          </span>
                          {kycEditing?.[key] && (
                            <span className="block break-all text-[11px] text-slate-500">
                              Existing file: {String(kycEditing[key]).split(/[\\/]/).pop()}
                            </span>
                          )}
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              if (file && file.size > 10 * 1024 * 1024) {
                                toast.error("Maximum file size is 10 MB");
                                e.target.value = "";
                                return;
                              }
                              setKycFiles((prev) => ({ ...prev, [key]: file }));
                            }}
                            className="block w-full rounded-lg border border-slate-200 p-2 text-xs file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-[#0446DB] dark:border-neutral-700"
                          />
                        </label>
                      ))}
                    </div>
                    {kycErrors.documents && (
                      <p className="mt-2 text-xs text-red-600">{kycErrors.documents}</p>
                    )}
                  </section>
                  <label className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-900 dark:bg-amber-950/20">
                    <input
                      type="checkbox"
                      checked={kycMarkVerified}
                      onChange={(e) => setKycMarkVerified(e.target.checked)}
                      className="mt-1"
                    />
                    <span>
                      <strong>Approve KYC as verified</strong>
                      <br />
                      <span className="text-xs text-slate-600">
                        Only select after personally reviewing required documents. Leave unchecked
                        to reset KYC on document/detail changes.
                      </span>
                    </span>
                  </label>
                </div>
                <AlertDialogFooter className="shrink-0 border-t border-slate-200 bg-white px-5 mb-0 dark:border-neutral-800 dark:bg-neutral-950">
                  <button
                    type="button"
                    disabled={kycSaving}
                    onClick={() => setKycEditing(null)}
                    className="rounded-sm border border-slate-200 px-4 py-2 text-sm">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={kycSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {kycSaving && <Loader2 size={16} className="animate-spin" />} Save KYC
                  </button>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog
            open={!!statusVendor}
            onOpenChange={(open) => {
              if (!open && !statusSaving) setStatusVendor(null);
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {Number(statusVendor?.is_active) === 1 ? "Deactivate" : "Activate"} Vendor?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  Are you sure you want to{" "}
                  {Number(statusVendor?.is_active) === 1 ? "deactivate" : "activate"}{" "}
                  {statusVendor?.vendor_name} (#{statusVendor?.vendor_id})?
                </AlertDialogDescription>
              </AlertDialogHeader>

              {Number(statusVendor?.is_active) === 1 && (
                <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                  This will also deactivate all linked riders. Activating the vendor later will not
                  automatically reactivate those riders.
                </p>
              )}

              <AlertDialogFooter>
                <AlertDialogCancel disabled={statusSaving}>Cancel</AlertDialogCancel>

                <AlertDialogAction
                  disabled={statusSaving}
                  onClick={(e) => {
                    e.preventDefault();

                    updateAccountStatus();
                  }}
                >
                  {statusSaving
                    ? "Updating..."
                    : Number(statusVendor?.is_active) === 1
                      ? "Deactivate"
                      : "Activate"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </>
  );
}
