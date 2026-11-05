
// "use client";
// import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom"; 

// import { Button } from "@/components/ui/button"
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer"
// import {
//   Loader2,
//   Package,
//   RefreshCw,
//   RotateCcw,
//   Search,
//   X,
//   Upload,
//   FileText,
//   CheckCircle2,
//   MapPin,
//   Filter,
//   ChevronDown,
//   ChevronUp,
//   Truck,
//   ArrowLeftRight,
//   Copy,
//   Inbox,
//   Download,
// } from "lucide-react";
// import { toast } from "react-toastify";
// import AxiosInstance from "@/Helper/axiosInstance";
// import CustomButton from "../common/CustomButton";
// import { FaFilter } from "react-icons/fa";

// const BASE = "/api/loadout";
// const baseURL = import.meta.env.VITE_BASE_URL;

// type LoadoutType = "forward" | "reverse";
// type TargetType = "vendor" | "dc";
// type Filters = { start_date: string; end_date: string; city: string; code: string };
// type Hub = { id: number; hub_name?: string; hub_code?: string; city?: string };
// type Vendor = { id: number; vendor_name: string; company_name: string; city: string; state: string; pincode: string; dc_id?: number };
// type DistributionCenter = { id: number; dc_name: string; dc_code: string; city: string; state: string; pincode: string; name?: string; code?: string; is_active?: number | string | boolean };
// type ScannedOrder = {
//   id?: number; awb_number: string; order_id?: number | null; scan_status: "accepted" | "rejected";
//   status?: string | null; pickup_stage?: string | null; previous_status?: string | null;
//   submit_stage?: string | null; rejection_reason?: string | null;
// };
// type Loadout = {
//   id: number;
//    loadout_code: string;
//     loadout_type: LoadoutType; status: string;
//   target_vendor_name?: string | null; target_dc_name?: string | null;
//   source_hub_city?: string | null; target_id?: number | null; target_type?: TargetType;
//   created_at?: string | null; closed_at?: string | null;
//   accepted_count?: number; rejected_count?: number; total_scanned?: number;
//   orders?: ScannedOrder[];
// };
// type CsvValidation = { csv_awb_count?: number; total_loadout_shipments?: number; projected_rto_delivered_count?: number; projected_rto_undelivered_count?: number };
// type ReverseResult = { total_shipments?: number; rto_delivered_count?: number; rto_undelivered_count?: number; webhook_dispatch_started?: boolean };
// type ApiResponse<T> = { success?: boolean; message?: string; data?: T; code?: string };
// const EMPTY_FILTERS: Filters = { start_date: "", end_date: "", city: "", code: "" };
// const todayISO = (): string => { const d = new Date(); const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return local.toISOString().slice(0, 10); };

// /* ============================ HELPERS ============================ */
// function formatDate(value?: string | null): string {
//   if (!value) return "-";
//   const d = new Date(value);
//   return Number.isNaN(d.getTime()) ? value : d.toLocaleString("en-IN");
// }

// function errorMessage(error: unknown): string {
//   if (axios.isAxiosError<{ message?: string; code?: string }>(error)) {
//     // 🔒 PERM — friendly message for permission denials
//     if (error.response?.status === 403) {
//       return "You don't have permission to perform this action.";
//     }
//     return (
//       error.response?.data?.message ||
//       error.response?.data?.code ||
//       error.message
//     );
//   }
//   return error instanceof Error ? error.message : "Something went wrong";
// }

// const TABS: { id: LoadoutType; label: string }[] = [
//   { id: "forward", label: "Forward Loadout" },
//   { id: "reverse", label: "Reverse Loadout" },
// ];

// /* ============================ MAIN ============================ */
// export default function DcLoadout() {

//   const scanInputRef = useRef<HTMLInputElement>(null);
//   const navigate = useNavigate(); // 🔒 PERM

//   /* ---- shared list / UI ---- */
//   const [activeTab, setActiveTab] = useState<LoadoutType>("forward");
//   const [search, setSearch] = useState("");
//   const [loadouts, setLoadouts] = useState<Loadout[]>([]);
//   const [loadingList, setLoadingList] = useState(false);
//   const [dcs, setDcs] = useState<DistributionCenter[]>([]);

//     const [drawerOpen, setDrawerOpen] = useState(false);
//   const [filters, setFilters] = useState<Filters>({
//     start_date: "",
//     end_date: "",
//     city: "",
//     code: "",
//   });
//   const [filtersVersion, setFiltersVersion] = useState(0);
//   const [appliedFilters, setAppliedFilters] = useState<Filters>(EMPTY_FILTERS);
//   const applyFilters = (): void => {
//     if (filters.start_date && filters.start_date > todayISO()) {
//       toast.warning("Start date cannot be in the future");
//       return;
//     }
//     if (filters.start_date && filters.end_date && filters.start_date > filters.end_date) {
//       toast.warning("Start date cannot be later than end date");
//       return;
//     }
//     if (filters.end_date && filters.end_date > todayISO()) {
//       toast.warning("End date cannot be in the future");
//       return;
//     }
//     setAppliedFilters({ ...filters });
//     setFiltersVersion((v) => v + 1);
//     setDrawerOpen(false);
//   };
//   const resetFilters = (): void => {
//     setFilters({ ...EMPTY_FILTERS });
//     setAppliedFilters({ ...EMPTY_FILTERS });
//     setFiltersVersion((v) => v + 1);
//   };

//   const [creating, setCreating] = useState(false);
//   const [selected, setSelected] = useState<Loadout | null>(null);
//   const [loadingDetails, setLoadingDetails] = useState(false);

//   const [awb, setAwb] = useState("");
//   const [scanning, setScanning] = useState(false);
//   const [closing, setClosing] = useState(false);
//   const [validatingCsv, setValidatingCsv] = useState(false);
//   const [completingReverse, setCompletingReverse] = useState(false);
//   const [csvFile, setCsvFile] = useState<File | null>(null);
//   const [proofPdf, setProofPdf] = useState<File | null>(null);
//   const [proofCsv, setProofCsv] = useState<File | null>(null);
//   const [csvValidation, setCsvValidation] = useState<CsvValidation | null>(null);
//   const [reverseResult, setReverseResult] = useState<ReverseResult | null>(null);

//   const [userHubs, setuserHubs] = useState<Hub[]>([]);
//   const [vendors, setVendors] = useState<Vendor[]>([]);

//   const [forwardSourceHubId, setForwardSourceHubId] = useState("");
//   const [targetType, setTargetType] = useState<TargetType>("vendor");
//   const [targetId, setTargetId] = useState("");
//   const [reverseSourceHubId, setReverseSourceHubId] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 10;

//   const [ordersPage, setOrdersPage] = useState(1);
//   const ordersPerPage = 10;

//   /* ================= 🔒 PERMISSIONS ================= */

//   // Normalize localStorage → array (it may have been stored as a string historically)
//   const [permissions, setPermissions] = useState<string[]>(() => {
//     const raw = localStorage.getItem("permission");
//     if (!raw) return [];
//     try {
//       const parsed = JSON.parse(raw);
//       if (Array.isArray(parsed)) return parsed;
//     } catch {
//       /* fall through */
//     }
//     return raw
//       .split(",")
//       .map((p: string) => p.trim())
//       .filter(Boolean);
//   });

//   const [permLoading, setPermLoading] = useState(true);

//   const hasPermission = useCallback(
//     (perm: string) =>
//       permissions.includes(perm) || permissions.includes("ADMIN_FULL_ACCESS"),
//     [permissions],
//   );

//   const getUserPermissions = useCallback(async () => {
//     try {
//       const res = await AxiosInstance.get<{ data?: { data?: string[] } }>(`${baseURL}/api/user/getUserPermissions`);

//       const list = Array.isArray(res?.data?.data?.data)
//         ? res.data.data.data
//         : [];

//       const allowed =
//         list.includes("LOADOUT_VIEW") || list.includes("ADMIN_FULL_ACCESS");

//       if (!allowed) {
//         navigate("/unauthorized");
//         return;
//       }

//       localStorage.setItem("permission", JSON.stringify(list));
//       setPermissions(list);
//     } catch (error) {
//       const msg =
//         (axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined) ||
//         (error instanceof Error ? error.message : undefined) ||
//         "Failed to load permissions";
//       toast.error(msg);

//       if (axios.isAxiosError(error) && error.response?.status === 401) {
//         localStorage.clear();
//         navigate("/login");
//         return;
//       }
//       if (!localStorage.getItem("permission")) {
//         navigate("/unauthorized");
//       }
//     } finally {
//       setPermLoading(false);
//     }
//   }, [navigate]);

//   useEffect(() => {
//     void getUserPermissions();
//   }, [getUserPermissions]);

//   const canView = hasPermission("LOADOUT_VIEW");
//   const canManage = hasPermission("LOADOUT_MANAGE");

//   /* ======================= COPY ======================= */
//   const copyToClipboard = async (text: string) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       toast.success("Loadout Code copied!");
//     } catch {
//       toast.error("Failed to copy code.");
//     }
//   };

//   /* ======================= FETCH HUBS ======================= */
//   const fetchuserHubs = async () => {
//     try {
//       const res = await AxiosInstance.get<ApiResponse<{ hubs?: Hub[] } | Hub[]>>(`${BASE}/user/hubs`);
//       const raw = res.data?.data;
//       const list: Hub[] = Array.isArray(raw) ? raw : raw?.hubs ?? [];
//       setuserHubs(Array.isArray(list) ? list : []);
//     } catch (error) {
//       toast.error(errorMessage(error));
//     }
//   };

//   /* ======================= FETCH VENDORS ======================= */
//   const fetchVendors = async () => {
//     try {
//       const res = await AxiosInstance.get<ApiResponse<Vendor[]>>(`${BASE}/users/vendors`);
//       const list: Vendor[] = res.data?.data ?? [];

//       setVendors(
//         list.map((v) => ({
//           id: v.id,
//           vendor_name: v.vendor_name || "Unknown Vendor",
//           company_name: v.company_name || "",
//           city: v.city || "",
//           state: v.state || "",
//           pincode: v.pincode || "",
//           dc_id: v.dc_id,
//         })),
//       );
//     } catch (error) {
//       setVendors([]);
//       toast.error(errorMessage(error));
//     }
//   };

//   /* ======================= FETCH DCs ======================= */
//   const fetchDCs = async () => {
//     try {
//       const res = await AxiosInstance.get<ApiResponse<{ dcs?: DistributionCenter[] } | DistributionCenter[]>>(`${BASE}/users/dcs`);

//       const raw = res.data?.data;
//       const list: DistributionCenter[] = Array.isArray(raw) ? raw : raw?.dcs ?? [];

//       const mappedDcs = list
//         .filter((d) => {
//           if (d.is_active !== undefined) {
//             return (
//               d.is_active === 1 || d.is_active === true || d.is_active === "1"
//             );
//           }
//           return true;
//         })
//         .map((d, index) => ({
//           id: d.id,
//           dc_name: d.dc_name || d.name || `Unknown DC ${index + 1}`,
//           dc_code: d.dc_code || d.code || "",
//           city: d.city || "",
//           state: d.state || "",
//           pincode: d.pincode || "",
//         }));

//       setDcs(mappedDcs);
//     } catch (error) {
//       console.error("Error fetching DCs:", error);
//       setDcs([]);
//       toast.error(errorMessage(error));
//     }
//   };
  

//   /* ======================= LIST ======================= */
//   const fetchLoadouts = useCallback(async () => {
//     setLoadingList(true);
//     try {
//       const res = await AxiosInstance.get<ApiResponse<Loadout[] | { loadouts?: Loadout[] }>>(`${BASE}/user`, {
//         params: {
//           limit: 100,
//           offset: 0,
//           start_date: appliedFilters.start_date || undefined,
//           end_date: appliedFilters.end_date || undefined,
//           city: appliedFilters.city || undefined,
//           code: appliedFilters.code || undefined,
//         },
//       });
//       const payload: Loadout[] | { loadouts?: Loadout[] } | undefined = res.data?.data;
//       const rows: Loadout[] = Array.isArray(payload) ? payload : (payload?.loadouts ?? []);
//       setLoadouts(rows);
//     } catch (error) {
//       setLoadouts([]);
//       toast.error(errorMessage(error));
//     } finally {
//       setLoadingList(false);
//     }
//   }, [appliedFilters]);

//   useEffect(() => {
//     void fetchLoadouts();
//   }, [filtersVersion, fetchLoadouts]); // 🔒 PERM — added fetchLoadouts to deps

//   useEffect(() => {
//     setSelected(null);
//     setSearch("");
//     setAwb("");
//     setCsvFile(null);
//     setProofPdf(null);
//     setProofCsv(null)
//     setCsvValidation(null);
//     setReverseResult(null);
//     setForwardSourceHubId("");
//     setTargetType("vendor");
//     setTargetId("");
//     setReverseSourceHubId("");
//     setCurrentPage(1);
//   }, [activeTab]);

//   /* ======================= DOWNLOAD SAMPLE CSV ======================= */
//   const downloadSampleCsv = async () => {
//     try {
//       // Note: API endpoint as per your route
//       const res = await AxiosInstance.get(`${BASE}/users/sample-awb-csv`, {
//         responseType: "blob",
//       });

//       // Blob se URL banayein aur download trigger karein
//       const blob = new Blob([res.data], { type: "text/csv" });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "sample-awb.csv");
//       document.body.appendChild(link);
//       link.click();
//       link.parentNode?.removeChild(link);
//       window.URL.revokeObjectURL(url);

//       toast.success("Sample CSV downloaded successfully");
//     } catch (error) {
//       console.error("Download Error:", error);
//       toast.error(errorMessage(error));
//     }
//   };

//   /* ======================= CREATE FORWARD ======================= */
//   const createForward = async () => {
//     if (!forwardSourceHubId) return toast.warn("Please select a source hub.");
//     if (!targetType) return toast.warn("Please select a target type.");
//     if (!targetId)
//       return toast.warn(
//         targetType === "vendor"
//           ? "Please select a target vendor."
//           : "Please select a target DC.",
//       );

//     const body = {
//       loadout_type: "forward",
//       source_hub_id: Number(forwardSourceHubId),
//       target_type: targetType,
//       target_id: Number(targetId),
//     };

//     setCreating(true);
//     try {
//       const res = await AxiosInstance.post<ApiResponse<{ loadout_id?: number }>>(`${BASE}/user`, body);
//       if (!res.data?.success) {
//         throw new Error(res.data?.message || "Could not create loadout");
//       }
//       const created = res.data?.data ?? {};
//       toast.success(res.data?.message || "Load-out created");

//       setForwardSourceHubId("");
//       setTargetId("");
//       setTargetType("vendor");

//       await fetchLoadouts();
//       if (created.loadout_id) {
//         await fetchDetails(created.loadout_id);
//       }
//     } catch (error) {
//       toast.error(errorMessage(error));
//     } finally {
//       setCreating(false);
//     }
//   };

//   /* ======================= CREATE REVERSE ======================= */
//   const createReverse = async () => {
//     if (!reverseSourceHubId) return toast.warn("Please select a source hub.");

//     const hub = userHubs.find(
//       (h) => String(h.id) === String(reverseSourceHubId),
//     );
//     if (!hub) {
//       return toast.error(
//         "Please select a valid user hub for reverse load-out.",
//       );
//     }

//     const body = {
//       loadout_type: "reverse",
//       source_hub_id: Number(reverseSourceHubId),
//     };

//     setCreating(true);
//     try {
//       const res = await AxiosInstance.post<ApiResponse<{ loadout_id?: number }>>(`${BASE}/user`, body);
//       if (!res.data?.success) {
//         throw new Error(res.data?.message || "Could not create loadout");
//       }
//       const created = res.data?.data ?? {};
//       toast.success(res.data?.message || "Reverse load-out created");

//       setReverseSourceHubId("");
//       await fetchLoadouts();
//       if (created.loadout_id) {
//         await fetchDetails(created.loadout_id);
//       }
//     } catch (error) {
//       toast.error(errorMessage(error));
//     } finally {
//       setCreating(false);
//     }
//   };

//   /* ======================= DETAILS ======================= */
//   const fetchDetails = async (loadoutId: number) => {
//     setLoadingDetails(true);
//     try {
//       const res = await AxiosInstance.get<ApiResponse<Loadout>>(`${BASE}/user/${loadoutId}`);
//       if (!res.data?.success || !res.data?.data) {
//         throw new Error(res.data?.message || "Loadout details unavailable");
//       }
//       setSelected(res.data.data);
//       setAwb("");
//       setCsvFile(null);
//       setProofPdf(null);
//       setCsvValidation(null);
//       setReverseResult(null);
//       setOrdersPage(1);
//     } catch (error) {
//       toast.error(errorMessage(error));
//     } finally {
//       setLoadingDetails(false);
//     }
//   };

//   /* ======================= SCAN ======================= */
//   const scanAwb = async (e?: FormEvent<HTMLFormElement>) => {
//     e?.preventDefault?.();
//     if (!selected || selected.status !== "open" || scanning) return;

//     const awbNumber = awb.trim();
//     if (!awbNumber) return toast.warn("Please enter or scan an AWB number.");

//     setScanning(true);
//     try {
//       const res = await AxiosInstance.post<ApiResponse<unknown>>(`${BASE}/user/${selected.id}/scan`, {
//         awb_number: awbNumber,
//       });
//       if (!res.data?.success) {
//         throw new Error(res.data?.message || "AWB rejected");
//       }
//       toast.success(
//         res.data?.message ||
//           (selected.loadout_type === "forward"
//             ? "Shipment mapped."
//             : "Shipment marked rto out for delivery."),
//       );
//     } catch (error) {
//       const status = axios.isAxiosError(error) ? error.response?.status : undefined;
//       const code = axios.isAxiosError<{ code?: string }>(error) ? error.response?.data?.code : undefined;
//       const msg = axios.isAxiosError<{ message?: string }>(error) ? (error.response?.data?.message || errorMessage(error)) : errorMessage(error);
//       toast.error(
//         status === 409
//           ? `Duplicate scan: ${msg}`
//           : code
//             ? `[${code}] ${msg}`
//             : msg,
//       );
//     } finally {
//       setAwb("");
//       await Promise.all([fetchDetails(selected.id), fetchLoadouts()]);
//       setScanning(false);
//       requestAnimationFrame(() => scanInputRef.current?.focus());
//     }
//   };

//   /* ======================= CLOSE ======================= */
//   const closeLoadout = async () => {
//     if (!selected || selected.status !== "open" || closing) return;
//     if (selected.loadout_type !== "forward") {
//       return toast.error("Only forward load-outs can be closed.");
//     }
//     const acceptedCount =
//       selected.accepted_count ??
//       selected.orders?.filter((o) => o.scan_status === "accepted").length ??
//       0;
//     if (acceptedCount === 0) {
//       return toast.warn(
//         "At least one shipment must be accepted before closing the loadout.",
//       );
//     }
//     if (
//       !window.confirm(
//         `Close loadout ${selected.loadout_code}? You won't be able to scan more.`,
//       )
//     )
//       return;

//     setClosing(true);
//     try {
//       const res = await AxiosInstance.post<ApiResponse<{ accepted_count?: number }>>(`${BASE}/user/${selected.id}/close`);
//       if (!res.data?.success) {
//         throw new Error(res.data?.message || "Failed to close loadout");
//       }
//       toast.success(
//         res.data?.message ||
//           `Load-out closed successfully (accepted: ${
//             res.data?.data?.accepted_count ?? 0
//           })`,
//       );
//       await Promise.all([fetchDetails(selected.id), fetchLoadouts()]);
//     } catch (error) {
//       toast.error(errorMessage(error));
//     } finally {
//       setClosing(false);
//     }
//   };

//   /* ======================= VALIDATE REVERSE CSV ======================= */
//   const validateReverseCsv = async () => {
//     if (!csvFile) return toast.warn("Please choose a CSV file.");
//     setValidatingCsv(true);
//     try {
//       const formData = new FormData();
//       formData.append("awb_csv", csvFile);
//       const res = await AxiosInstance.post<ApiResponse<CsvValidation>>(
//         `${BASE}/user/${selected.id}/validate-reverse-csv`,
//         formData,
//       );
//       if (!res.data?.success) {
//         throw new Error(res.data?.message || "CSV validation failed");
//       }
//       setCsvValidation(res.data.data);
//       toast.success(
//         res.data?.message ||
//           "CSV validated successfully and is ready for reverse load-out completion",
//       );
//     } catch (error) {
//       toast.error(errorMessage(error));
//     } finally {
//       setValidatingCsv(false);
//     }
//   };

//   /* ======================= COMPLETE REVERSE ======================= */
//   const completeReverse = async () => {
//     if (!proofPdf) return toast.warn("Please attach a proof PDF.");
//     if (!proofCsv) return toast.warn("Please attach the AWB CSV.");
//     if (
//       !window.confirm(
//         "Complete reverse loadout? This will finalize the loadout.",
//       )
//     )
//       return;

//     setCompletingReverse(true);
//     try {
//       const formData = new FormData();
//       formData.append("proof_pdf", proofPdf);
//       formData.append("awb_csv", proofCsv);
//       const res = await AxiosInstance.post<ApiResponse<ReverseResult>>(`${BASE}/user/${selected.id}/complete-reverse`,
//         formData,
//       );
//       if (!res.data?.success) {
//         throw new Error(
//           res.data?.message || "Failed to complete reverse loadout",
//         );
//       }
//       setReverseResult(res.data.data);
//       toast.success(
//         res.data?.message || "Reverse load-out proof submitted successfully",
//       );
//       await Promise.all([fetchDetails(selected.id), fetchLoadouts()]);
//     } catch (error) {
//       toast.error(errorMessage(error));
//     } finally {
//       setCompletingReverse(false);
//     }
//   };

//   /* ======================= DERIVED ======================= */
//   const filteredLoadouts = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     return loadouts
//       .filter((i) => i.loadout_type === activeTab)
//       .filter((i) =>
//         [
//           i.loadout_code ?? "",
//           i.target_vendor_name ?? "",
//           i.target_dc_name ?? "",
//           i.source_hub_city ?? "",
//           i.target_id != null ? String(i.target_id) : "",
//         ].some((t) => String(t).toLowerCase().includes(q)),
//       );
//   }, [loadouts, search, activeTab]);

//   const accepted =
//     selected?.accepted_count ??
//     selected?.orders?.filter((o) => o.scan_status === "accepted").length ??
//     0;
//   const rejected =
//     selected?.rejected_count ??
//     selected?.orders?.filter((o) => o.scan_status === "rejected").length ??
//     0;

//   const targetOptions =
//     targetType === "vendor"
//       ? vendors.map((v, i) => ({
//           id: v.id,
//           label: `${i + 1}. ${v.vendor_name}${v.company_name ? ` (${v.company_name})` : ""}${v.city ? ` - ${v.city}` : ""}`,
//         }))
//       : dcs.map((d, i) => ({
//           id: d.id,
//           label: `${i + 1}. ${d.dc_name}${d.dc_code ? ` (${d.dc_code})` : ""}${d.city ? ` - ${d.city}` : ""}`,
//         }));

//   const canCreateForward = !!forwardSourceHubId && !!targetType && !!targetId;
//   const canCreateReverse = !!reverseSourceHubId;

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [activeTab, search, filtersVersion]);

//   const totalPages = Math.ceil(filteredLoadouts.length / rowsPerPage) || 1;
//   const paginatedLoadouts = filteredLoadouts.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage,
//   );

//   const totalOrders = selected?.orders?.length ?? 0;
//   const totalOrderPages = Math.ceil(totalOrders / ordersPerPage) || 1;
//   const paginatedOrders = (selected?.orders ?? []).slice(
//     (ordersPage - 1) * ordersPerPage,
//     ordersPage * ordersPerPage,
//   );

//   /* ================= 🔒 PERM: PAGE-LEVEL GUARDS ================= */
//   if (permLoading) {
//     return (
//       <div className="flex h-[80vh] items-center justify-center gap-2 text-slate-500">
//         <Loader2 className="animate-spin text-[#0446DB]" size={28} />
//         <span className="text-sm">Loading permissions…</span>
//       </div>
//     );
//   }

//   if (!canView) return null; // navigate() already fired

//   /* ======================= RENDER ======================= */
//   return (
//     <div className="flex min-h-[calc(100dvh-100px)] flex-col gap-3 bg-[#F7F8FA] p-3 text-slate-900 sm:gap-4 sm:p-0 dark:bg-neutral-950 dark:text-white">
//       <div className="shrink-0 sm:pt-0">
//         <h1 className="text-lg font-bold sm:text-2xl">Loadout</h1>
//         <p className="mt-0.5 text-xs text-slate-500 sm:mt-1 sm:text-sm">
//           Create loadouts, scan AWBs, validate reverse CSVs and close batches.
//         </p>
//       </div>

//       <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm border border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
//         {/* tabs */}
//         <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-slate-200 px-2 dark:border-neutral-800 sm:px-5">
//           {TABS.map((tab) => (
//             <button
//               key={tab.id}
//               type="button"
//               onClick={() => setActiveTab(tab.id)}
//               className={`shrink-0 border-b-2 px-3 py-3 text-xs font-medium sm:px-4 sm:text-sm cursor-pointer ${
//                 activeTab === tab.id
//                   ? "border-[#0446DB] text-[#0446DB]"
//                   : "border-transparent text-slate-500 hover:text-[#0446DB]"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* ==================== CREATE BAR ==================== */}
//         <div className="flex shrink-0 flex-col gap-3 border-b border-slate-100 p-3 dark:border-neutral-800 sm:p-4">
//           {activeTab === "forward" ? (
//             <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
//               {canManage && (
//                 <label className="flex w-full flex-col gap-1 text-xs font-medium text-slate-600 lg:w-[260px] dark:text-slate-300">
//                   Source Hub
//                   <select
//                   onClick={fetchuserHubs}
//                     value={forwardSourceHubId}
//                     onChange={(e) => setForwardSourceHubId(e.target.value)}
//                     className="h-10 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
//                   >
//                     <option value="">Select Source Hub</option>
//                     {userHubs.map((h) => (
//                       <option key={h.id} value={h.id}>
//                         {h.id}: {h.hub_name} ({h.hub_code})
//                       </option>
//                     ))}
//                   </select>
//                 </label>
//               )}

//               {canManage && (
//                 <label className="flex w-full flex-col gap-1 text-xs font-medium text-slate-600 lg:w-[160px] dark:text-slate-300">
//                   Target Type
//                   <select
//                     value={targetType}
//                     onChange={(e) => {
//                       setTargetType(e.target.value as TargetType);
//                       setTargetId("");
//                     }}
//                     className="h-10 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
//                   >
//                     <option value="vendor">Vendor</option>
//                     <option value="dc">DC</option>
//                   </select>
//                 </label>
//               )}

//               {canManage && (
//                 <label className="flex w-full flex-col gap-1 text-xs font-medium text-slate-600 lg:w-[280px] dark:text-slate-300">
//                   Target
//                   <select
//                   onClick={()=>{
//                       if(targetType === "vendor"){
//                         fetchVendors()
//                       }else{
//                         fetchDCs()
//                       }
                      
//                     }}
//                     value={targetId}
//                     onChange={(e) => setTargetId(e.target.value)}
//                     className="h-10 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
//                   >
//                     <option value=""
//                     onClick={()=>{
//                       if(targetType === "vendor"){
//                         fetchVendors()
//                       }
//                     }}
//                     >
                      
//                       Select {targetType === "vendor" ? "vendor" : "DC"}
//                     </option>
//                     {targetOptions.map((o) => (
//                       <option key={o.id} value={o.id}>
//                         {o.label}
//                       </option>
//                     ))}
//                   </select>
//                 </label>
//               )}

//               {/* 🔒 PERM — hide Create Forward */}
//               {canManage && (
//                 <button
//                   type="button"
//                   onClick={() => void createForward()}
//                   disabled={creating || !canCreateForward}
//                   className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-[#0339b5] disabled:opacity-50 sm:col-span-2 lg:w-auto cursor-pointer"
//                 >
//                   {creating ? (
//                     <Loader2 size={16} className="animate-spin" />
//                   ) : (
//                     <Package size={16} />
//                   )}
//                   Create Loadout
//                 </button>
//               )}
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
//               {canManage && (
//                 <label className="flex w-full flex-col gap-1 text-xs font-medium text-slate-600 lg:w-[280px] dark:text-slate-300">
//                   Source Hub
//                   <select
//                     value={reverseSourceHubId}
//                     onFocus={() => void fetchuserHubs()}
//                     onChange={(e) => setReverseSourceHubId(e.target.value)}
//                     className="h-10 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
//                   >
//                     <option value="">Select user Hub</option>
//                     {userHubs.map((h) => (
//                       <option key={h.id} value={h.id}>
//                         {h.id}: {h.hub_name} ({h.hub_code})
//                       </option>
//                     ))}
//                   </select>
//                 </label>
//               )}

//               {/* 🔒 PERM — hide Create Reverse */}
//               {canManage && (
//                 <button
//                   type="button"
//                   onClick={() => void createReverse()}
//                   disabled={creating || !canCreateReverse}
//                   className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-[#0339b5] disabled:opacity-50 sm:col-span-2 lg:w-auto"
//                 >
//                   {creating ? (
//                     <Loader2 size={16} className="animate-spin" />
//                   ) : (
//                     <Package size={16} />
//                   )}
//                   Create Reverse Loadout
//                 </button>
//               )}
//             </div>
//           )}

//           <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">


            
// <Drawer direction="right" open={drawerOpen} onOpenChange={setDrawerOpen}>
//   <DrawerTrigger asChild>
//     <CustomButton
//       variant="outline"
//       size="md"
//       icon={FaFilter}
//       className="rounded-sm"
//     >
//       <span>Filter</span>
//     </CustomButton>
//   </DrawerTrigger>

//   <DrawerContent className="ml-auto flex h-full w-full max-w-md flex-col overflow-hidden rounded-none border-l border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">

//     {/* Fixed Header */}
//     <DrawerHeader className="shrink-0 border-b border-neutral-200 px-5 py-4 text-left dark:border-neutral-800">
//       <DrawerTitle className="flex items-center gap-3 text-base font-semibold text-neutral-900 dark:text-white">
//         <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
//           <FaFilter className="text-sm" />
//         </span>
//         Filter Orders
//       </DrawerTitle>

//       <DrawerDescription className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
//         Apply filters to find specific orders.
//       </DrawerDescription>
//     </DrawerHeader>

//     {/* Scrollable Body */}
//     <form id="loadout-filter-form" onSubmit={(e: FormEvent<HTMLFormElement>) => { e.preventDefault(); applyFilters(); }} className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
//       <div className="grid grid-cols-1 gap-5">

//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//           <label className="flex flex-col gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300">
//             Start Date
//             <input
//               type="date"
//               value={filters.start_date}
//               max={filters.end_date && filters.end_date < todayISO() ? filters.end_date : todayISO()}
//               onChange={(e) =>
//                 setFilters((f) => ({ ...f, start_date: e.target.value }))
//               }
//               onClick={(e) => {
//                 try {
//                   e.currentTarget.showPicker();
//                 } catch {
//                   // Browser fallback
//                 }
//               }}
//               className="h-10 w-full min-w-0 rounded-sm border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
//             />
//           </label>

//           <label className="flex flex-col gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300">
//             End Date
//             <input
//               type="date"
//               value={filters.end_date}
//               min={filters.start_date || undefined}
//               max={todayISO()}
//               onChange={(e) =>
//                 setFilters((f) => ({ ...f, end_date: e.target.value }))
//               }
//               onClick={(e) => {
//     try {
//       e.currentTarget.showPicker();
//     } catch {
//       // Browser fallback
//     }
//   }}
//               className="h-10 w-full min-w-0 rounded-sm border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
//             />
//           </label>
//         </div>

//         <label className="flex flex-col gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300">
//           City
//           <input
//             type="text"
//             value={filters.city}
//             onChange={(e) =>
//               setFilters((f) => ({ ...f, city: e.target.value }))
//             }
//             placeholder="Enter city name"
//             className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm outline-none placeholder:text-neutral-400 focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
//           />
//         </label>

//         <label className="flex flex-col gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300">
//           Loadout Code
//           <input
//             type="text"
//             value={filters.code}
//             onChange={(e) =>
//               setFilters((f) => ({ ...f, code: e.target.value }))
//             }
//             placeholder="Enter loadout code"
//             className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm outline-none placeholder:text-neutral-400 focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
//           />
//         </label>
//       </div>
//     </form>

//     {/* Fixed Footer */}
//     <DrawerFooter className="shrink-0 border-t border-neutral-200 bg-neutral-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/80">
//       <div className="grid grid-cols-2 gap-3">
//         <Button type="button" variant="outline" onClick={resetFilters} className="h-10 cursor-pointer rounded-sm border-neutral-300 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">Reset</Button>
//         <Button type="submit" form="loadout-filter-form" className="h-10 cursor-pointer gap-2 rounded-sm bg-[#0446DB] text-sm font-medium text-white hover:bg-blue-700"><FaFilter className="text-xs" />Apply Filter</Button>
//       </div>

//       <DrawerClose asChild>
//         <Button
//           type="button"
//           variant="ghost"
//           className="h-9 cursor-pointer rounded-sm text-sm text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
//         >
//           Cancel
//         </Button>
//       </DrawerClose>
//     </DrawerFooter>
//   </DrawerContent>
// </Drawer>

//             <button
//               type="button"
//               onClick={() => void fetchLoadouts()}
              
//               className="inline-flex h-10 items-center justify-center gap-2 rounded-sm border border-slate-200 px-3 text-xs dark:border-neutral-700 sm:text-sm cursor-pointer"
//             >
//               <RefreshCw
//                 size={16}
//                 className={loadingList ? "animate-spin" : ""}
//               />{" "}
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* filters */}
       

//         {/* search */}
//         <div className="shrink-0 border-b border-slate-100 p-3 dark:border-neutral-800 sm:p-4">
//           <div className="relative w-full sm:max-w-sm">
//             <Search
//               size={16}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//             />
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search loadout, vendor, hub..."
//               className="h-10 w-full rounded-sm border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800"
//             />
//           </div>
//         </div>

//         {/* ====== MOBILE CARDS ====== */}
//         <div className="block min-h-0 flex-1 overflow-y-auto p-3 md:hidden">
//           {paginatedLoadouts.map((item) => (
//             <div
//               key={item.id}
//               className="mb-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
//             >
//               <div className="flex items-start justify-between gap-2">
//                 <div className="min-w-0">
//                   <div
//                     className="group flex items-center gap-1.5 cursor-pointer w-fit"
//                     onClick={() => copyToClipboard(item.loadout_code)}
//                     title="Click to copy"
//                   >
//                     <div className="truncate font-semibold text-[#0446DB]">
//                       {item.loadout_code}
//                     </div>
//                     <Copy
//                       size={12}
//                       className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
//                     />
//                   </div>
//                   <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
//                     <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 dark:bg-neutral-800">
//                       {item.loadout_type === "forward" ? (
//                         <Truck size={10} />
//                       ) : (
//                         <ArrowLeftRight size={10} />
//                       )}
//                       {item.loadout_type}
//                     </span>
//                     <span className="inline-flex items-center gap-1">
//                       <MapPin size={10} /> {item.source_hub_city || "-"}
//                     </span>
//                   </div>
//                 </div>
//                 <span
//                   className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
//                     item.status === "open"
//                       ? "bg-blue-50 text-blue-700"
//                       : "bg-slate-100 text-slate-600"
//                   }`}
//                 >
//                   {item.status}
//                 </span>
//               </div>

//               <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
//                 <span className="font-medium">Target: </span>
//                 {item.target_vendor_name
//                   ? item.target_vendor_name
//                   : item.target_dc_name
//                     ? item.target_dc_name
//                     : item.target_type === "dc"
//                       ? `DC #${item.target_id}`
//                       : item.target_type === "vendor"
//                         ? `Vendor #${item.target_id}`
//                         : "—"}
//               </div>

//               <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[11px]">
//                 <div className="rounded bg-slate-50 py-1 dark:bg-neutral-800">
//                   <div className="text-slate-500">Scanned</div>
//                   <div className="font-semibold">{item.total_scanned ?? 0}</div>
//                 </div>
//                 <div className="rounded bg-blue-50 py-1 text-blue-700">
//                   <div>Accepted</div>
//                   <div className="font-semibold">
//                     {item.accepted_count ?? 0}
//                   </div>
//                 </div>
//                 <div className="rounded bg-orange-50 py-1 text-orange-700">
//                   <div>Rejected</div>
//                   <div className="font-semibold">
//                     {item.rejected_count ?? 0}
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-2 text-[11px] text-slate-500">
//                 Created: {formatDate(item.created_at)}
//               </div>

//               <button
//                 type="button"
//                 onClick={() => void fetchDetails(item.id)}
//                 className="mt-3 w-full rounded-md border border-[#0446DB] py-2 text-sm font-medium text-[#0446DB] hover:bg-blue-50 cursor-pointer"
//               >
//                 View / Scan
//               </button>
//             </div>
//           ))}

//           {!loadingList && filteredLoadouts.length === 0 && (
//             <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
//               <div className="rounded-full bg-slate-100 p-4 dark:bg-neutral-800">
//                 <Inbox size={32} className="text-slate-400" />
//               </div>
//               <p className="text-sm font-medium">No loadouts found</p>
//               <p className="text-xs text-slate-400">
//                 Create a new loadout or adjust your filters.
//               </p>
//             </div>
//           )}
//           {loadingList && (
//             <div className="space-y-3">
//               {[1, 2, 3].map((i) => (
//                 <div
//                   key={i}
//                   className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 animate-pulse"
//                 >
//                   <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-neutral-700"></div>
//                   <div className="mt-3 h-3 w-3/4 rounded bg-slate-100 dark:bg-neutral-800"></div>
//                   <div className="mt-4 grid grid-cols-3 gap-2">
//                     <div className="h-8 rounded bg-slate-100 dark:bg-neutral-800"></div>
//                     <div className="h-8 rounded bg-slate-100 dark:bg-neutral-800"></div>
//                     <div className="h-8 rounded bg-slate-100 dark:bg-neutral-800"></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* ====== DESKTOP TABLE ====== */}
//         <div className="hidden min-h-0 flex-1 overflow-auto md:block">
//           <table className="w-full min-w-[1000px] text-left text-sm">
//             <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase text-slate-500 dark:bg-neutral-800">
//               <tr>
//                 <th className="px-4 py-3">Loadout</th>
//                 <th className="px-4 py-3">Type</th>
//                 <th className="px-4 py-3">Source</th>
//                 <th className="px-4 py-3">Target</th>
//                 <th className="px-4 py-3">Created</th>
//                 <th className="px-4 py-3">Scanned</th>
//                 <th className="px-4 py-3">Accepted</th>
//                 <th className="px-4 py-3">Rejected</th>
//                 <th className="px-4 py-3">Status</th>
//                 <th className="px-4 py-3">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
//               {paginatedLoadouts.map((item) => (
//                 <tr
//                   key={item.id}
//                   className="hover:bg-slate-50 dark:hover:bg-neutral-800/50"
//                 >
//                   <td className="px-4 py-3 font-semibold text-[#0446DB]">
//                     <button
//                       type="button"
//                       onClick={() => copyToClipboard(item.loadout_code)}
//                       className="group flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer text-left"
//                       title="Click to copy"
//                     >
//                       <span className="truncate">{item.loadout_code}</span>
//                       <Copy
//                         size={14}
//                         className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
//                       />
//                     </button>
//                   </td>
//                   <td className="px-4 py-3">
//                     <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-neutral-800 dark:text-slate-200">
//                       {item.loadout_type === "forward" ? (
//                         <Truck size={12} />
//                       ) : (
//                         <ArrowLeftRight size={12} />
//                       )}
//                       {item.loadout_type}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">
//                     <span className="inline-flex items-center gap-1 text-xs">
//                       <MapPin size={12} className="text-slate-400" />{" "}
//                       {item.source_hub_city || "-"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">
//                     {item.target_vendor_name
//                       ? item.target_vendor_name
//                       : item.target_dc_name
//                         ? item.target_dc_name
//                         : item.target_type === "dc"
//                           ? `DC #${item.target_id}`
//                           : item.target_type === "vendor"
//                             ? `Vendor #${item.target_id}`
//                             : "—"}
//                   </td>
//                   <td className="px-4 py-3 text-xs">
//                     {formatDate(item.created_at)}
//                   </td>
//                   <td className="px-4 py-3">{item.total_scanned ?? 0}</td>
//                   <td className="px-4 py-3">{item.accepted_count ?? 0}</td>
//                   <td className="px-4 py-3">{item.rejected_count ?? 0}</td>
//                   <td className="px-4 py-3">
//                     <span
//                       className={`rounded-full px-2 py-1 text-xs font-medium ${
//                         item.status === "open"
//                           ? "bg-blue-50 text-blue-700"
//                           : "bg-slate-100 text-slate-600"
//                       }`}
//                     >
//                       {item.status}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">
//                     <button
//                       type="button"
//                       onClick={() => void fetchDetails(item.id)}
//                       className="rounded-md border border-[#0446DB] px-3 py-1.5 text-xs font-medium text-[#0446DB] hover:bg-blue-50 cursor-pointer"
//                     >
//                       View / Scan
//                     </button>
//                   </td>
//                 </tr>
//               ))}

//               {!loadingList && filteredLoadouts.length === 0 && (
//                 <tr>
//                   <td colSpan={10} className="py-20 text-center">
//                     <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
//                       <div className="rounded-full bg-slate-100 p-4 dark:bg-neutral-800">
//                         <Inbox size={32} className="text-slate-400" />
//                       </div>
//                       <p className="text-sm font-medium">No loadouts found</p>
//                       <p className="text-xs text-slate-400">
//                         Create a new loadout or adjust your filters.
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//               {loadingList && (
//                 <tr>
//                   <td colSpan={10} className="py-20 text-center">
//                     <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
//                       <Loader2
//                         size={32}
//                         className="animate-spin text-[#0446DB]"
//                       />
//                       <p className="text-sm font-medium">Loading loadouts...</p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* ======================= PAGINATION FOOTER ======================= */}
//         <div className="flex shrink-0 flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 dark:border-neutral-800 sm:flex-row">
//           <div className="text-[11px] text-slate-500 sm:text-xs">
//             Showing{" "}
//             <span className="font-medium text-slate-900 dark:text-white">
//               {filteredLoadouts.length === 0
//                 ? 0
//                 : (currentPage - 1) * rowsPerPage + 1}
//             </span>{" "}
//             to{" "}
//             <span className="font-medium text-slate-900 dark:text-white">
//               {Math.min(currentPage * rowsPerPage, filteredLoadouts.length)}
//             </span>{" "}
//             of{" "}
//             <span className="font-medium text-slate-900 dark:text-white">
//               {filteredLoadouts.length}
//             </span>{" "}
//             loadouts
//           </div>

//           <div className="flex items-center gap-1">
//             <button
//               type="button"
//               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//               className="inline-flex h-8 items-center justify-center rounded-sm border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-300 dark:hover:bg-neutral-700"
//             >
//               Previous
//             </button>

//             <div className="flex items-center gap-1 px-2">
//               {Array.from({ length: totalPages }, (_, i) => i + 1)
//                 .filter((p) => {
//                   if (totalPages <= 5) return true;
//                   if (p === 1 || p === totalPages) return true;
//                   if (p >= currentPage - 1 && p <= currentPage + 1) return true;
//                   return false;
//                 })
//                 .map((p, i, arr) => {
//                   const showDots = i > 0 && p - arr[i - 1] > 1;
//                   return (
//                     <div key={p} className="flex items-center">
//                       {showDots && (
//                         <span className="px-1 text-xs text-slate-400">...</span>
//                       )}
//                       <button
//                         type="button"
//                         onClick={() => setCurrentPage(p)}
//                         className={`inline-flex h-8 w-8 items-center justify-center rounded-sm text-xs font-medium transition-colors cursor-pointer ${
//                           currentPage === p
//                             ? "bg-[#0446DB] text-white"
//                             : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-neutral-800"
//                         }`}
//                       >
//                         {p}
//                       </button>
//                     </div>
//                   );
//                 })}
//             </div>

//             <button
//               type="button"
//               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//               disabled={currentPage === totalPages || totalPages === 0}
//               className="inline-flex h-8 items-center justify-center rounded-sm border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-300 dark:hover:bg-neutral-700"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ================= DETAILS MODAL ================= */}
//       {selected && (
//         <div
//           className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
//           role="presentation"
//         >
//           <div
//             role="dialog"
//             aria-modal="true"
//             aria-label="Loadout details"
//             className="flex h-[95dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:h-auto sm:max-h-[92dvh] sm:rounded-sm dark:bg-neutral-900"
//           >
//             <div className="flex shrink-0 items-start justify-between gap-2 border-b border-slate-200 px-3 py-3 dark:border-neutral-800 sm:px-4">
//               <div className="min-w-0">
//                 <h2 className="truncate text-base font-bold sm:text-lg">
//                   <button
//                     type="button"
//                     onClick={() => copyToClipboard(selected.loadout_code)}
//                     className="group flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer text-left"
//                     title="Click to copy"
//                   >
//                     <span className="truncate">{selected.loadout_code}</span>
//                     <Copy
//                       size={16}
//                       className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
//                     />
//                   </button>
//                 </h2>
//                 <p className="mt-0.5 truncate text-[11px] text-slate-500 sm:text-xs">
//                   {selected.loadout_type?.toUpperCase()} ·{" "}
//                   {selected.status?.toUpperCase()} · Source:{" "}
//                   {selected.source_hub_city || "-"}
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setSelected(null)}
//                 aria-label="Close details"
//                 className="shrink-0 rounded p-2 hover:bg-slate-100 dark:hover:bg-neutral-800"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 pb-24 sm:gap-4 sm:p-4 sm:pb-4">
//               <div className="flex flex-wrap gap-2 text-xs sm:gap-3 sm:text-sm">
//                 <span className="rounded-sm bg-blue-50 px-2.5 py-1.5 text-blue-700">
//                   Accepted: {accepted}
//                 </span>
//                 <span className="rounded-sm bg-orange-50 px-2.5 py-1.5 text-orange-700">
//                   Rejected: {rejected}
//                 </span>
//                 <span className="rounded-sm bg-slate-100 px-2.5 py-1.5 text-slate-700">
//                   Total: {selected.orders?.length ?? 0}
//                 </span>
//                 {selected.closed_at && (
//                   <span className="rounded-sm bg-slate-100 px-2.5 py-1.5 text-slate-700">
//                     Closed: {formatDate(selected.closed_at)}
//                   </span>
//                 )}
//               </div>

//               {/* 🔒 PERM — scan form only if canManage */}
//               {selected.status === "open" && canManage && (
//                 <form
//                   onSubmit={(e) => void scanAwb(e)}
//                   className="flex flex-col gap-2 sm:flex-row"
//                 >
//                   <input
//                     ref={scanInputRef}
//                     value={awb}
//                     onChange={(e) => setAwb(e.target.value)}
//                     placeholder={
//                       scanning ? "Scanning…" : "Scan or enter AWB number"
//                     }
//                     autoComplete="off"
//                     disabled={scanning}
//                     className="h-11 p-4 min-w-0 flex-1 rounded-sm border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0446DB] disabled:bg-slate-50 disabled:text-slate-400 dark:border-neutral-700 dark:bg-neutral-800"
//                   />
//                   <button
//                     disabled={scanning || !awb.trim()}
//                     type="submit"
//                     className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white disabled:opacity-50"
//                   >
//                     {scanning && <Loader2 size={16} className="animate-spin" />}
//                     Scan AWB
//                   </button>
//                 </form>
//               )}

//               {/* ====== ORDERS: mobile cards ====== */}
//               <div className="space-y-2 md:hidden">
//                 {paginatedOrders.map((o) => (
//                   <div
//                     key={o.id ?? o.awb_number}
//                     className="rounded-lg border border-slate-200 p-3 text-xs dark:border-neutral-800"
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className="font-semibold">{o.awb_number}</span>
//                       <span
//                         className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
//                           o.scan_status === "accepted"
//                             ? "bg-blue-50 text-blue-700"
//                             : "bg-orange-50 text-orange-700"
//                         }`}
//                       >
//                         {o.scan_status}
//                       </span>
//                     </div>
//                     <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-slate-600 dark:text-slate-300">
//                       <div>
//                         <span className="text-slate-400">Order: </span>
//                         {o.order_id ?? "-"}
//                       </div>
//                       {selected.loadout_type === "forward" ? (
//                         <>
//                           <div>
//                             <span className="text-slate-400">Status: </span>
//                             {o.status ?? "-"}
//                           </div>
//                           <div>
//                             <span className="text-slate-400">Stage: </span>
//                             {o.pickup_stage ?? "-"}
//                           </div>
//                         </>
//                       ) : (
//                         <>
//                           <div>
//                             <span className="text-slate-400">Prev: </span>
//                             {o.previous_status ?? "-"}
//                           </div>
//                           <div>
//                             <span className="text-slate-400">Status: </span>
//                             {o.status ?? "-"}
//                           </div>
//                           <div>
//                             <span className="text-slate-400">Submit: </span>
//                             {o.submit_stage ?? "-"}
//                           </div>
//                         </>
//                       )}
//                       <div className="col-span-2">
//                         <span className="text-slate-400">Reason: </span>
//                         {o.rejection_reason || "-"}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 {(selected.orders ?? []).length === 0 && (
//                   <div className="flex flex-col items-center justify-center gap-2 py-8 text-slate-500">
//                     <Inbox size={24} className="text-slate-300" />
//                     <span className="text-sm">No AWBs scanned yet</span>
//                   </div>
//                 )}
//               </div>

//               {/* ====== ORDERS: desktop table ====== */}
//               <div className="hidden overflow-x-auto rounded-sm border border-slate-200 md:block dark:border-neutral-800">
//                 <table className="w-full min-w-[800px] text-left text-sm">
//                   <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-neutral-800">
//                     <tr>
//                       <th className="px-3 py-3">AWB Number</th>
//                       <th className="px-3 py-3">Order ID</th>
//                       <th className="px-3 py-3">Scan Status</th>
//                       <th className="px-3 py-3">Reason</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
//                     {paginatedOrders.map((o) => (
//                       <tr key={o.id ?? o.awb_number}>
//                         <td className="px-3 py-3 font-medium">
//                           {o.awb_number}
//                         </td>
//                         <td className="px-3 py-3">{o.order_id ?? "-"}</td>
//                         <td className="px-3 py-3">{o.scan_status}</td>
//                         <td className="px-3 py-3">
//                           {o.rejection_reason || "-"}
//                         </td>
//                       </tr>
//                     ))}
//                     {(selected.orders ?? []).length === 0 && (
//                       <tr>
//                         <td colSpan={4} className="py-12 text-center">
//                           <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
//                             <Inbox size={24} className="text-slate-300" />
//                             <span className="text-sm">No AWBs scanned yet</span>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {totalOrders > 0 && (
//                 <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-neutral-800">
//                   <span className="text-[11px] text-slate-500">
//                     Showing {(ordersPage - 1) * ordersPerPage + 1} to{" "}
//                     {Math.min(ordersPage * ordersPerPage, totalOrders)} of{" "}
//                     {totalOrders} AWBs
//                   </span>
//                   <div className="flex gap-1">
//                     <button
//                       onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
//                       disabled={ordersPage === 1}
//                       className="h-7 px-2 rounded-sm border border-slate-200 text-xs disabled:opacity-50 hover:bg-slate-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
//                     >
//                       Prev
//                     </button>
//                     <span className="h-7 px-2 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300">
//                       {ordersPage} / {totalOrderPages}
//                     </span>
//                     <button
//                       onClick={() =>
//                         setOrdersPage((p) => Math.min(totalOrderPages, p + 1))
//                       }
//                       disabled={ordersPage === totalOrderPages}
//                       className="h-7 px-2 rounded-sm border border-slate-200 text-xs disabled:opacity-50 hover:bg-slate-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
//                     >
//                       Next
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* 🔒 PERM — reverse completion only if canManage */}
//               {canManage &&
//                 selected.loadout_type === "reverse" &&
//                 selected.status === "open" && (
//                   <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3 dark:border-neutral-800 dark:bg-neutral-900/50 sm:p-4">
//                     <div className="mb-4 flex items-center gap-2">
//                       <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0446DB]/10 text-[#0446DB]">
//                         <Upload size={16} />
//                       </div>
//                       <div>
//                         <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
//                           Reverse Completion
//                         </h3>
//                         <p className="text-[11px] text-slate-500">
//                           Upload CSV, validate, then attach proof PDF to
//                           finalize.
//                         </p>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//                       {/* ---- STEP 1: AWB CSV ---- */}
//                       <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
//                         {/* Title & Download Button Row */}
//                         <div className="flex items-center justify-between gap-2">
//                           <div className="flex items-center gap-2">
//                             <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0446DB] text-[10px] font-bold text-white">
//                               1
//                             </span>
//                             <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
//                               AWB CSV <span className="text-red-500">*</span>
//                             </span>
//                             {csvValidation && (
//                               <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
//                                 <CheckCircle2 size={10} /> Validated
//                               </span>
//                             )}
//                           </div>

//                           {/* Modern Download Button */}
//                           <button
//                             type="button"
//                             onClick={() => void downloadSampleCsv()}
//                             className="group inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:bg-[#0446DB]/10 hover:text-[#0446DB] dark:bg-neutral-800 dark:text-slate-300 dark:hover:bg-[#0446DB]/20 dark:hover:text-[#0446DB] cursor-pointer"
//                             title="Download Sample CSV"
//                           >
//                             <Download
//                               size={12}
//                               className="transition-transform group-hover:-translate-y-0.5"
//                             />
//                             <span className="hidden sm:inline">Sample CSV</span>
//                             <span className="sm:hidden">Sample</span>
//                           </button>
//                         </div>

//                         {/* File picker styled as dropzone */}
//                         <label
//                           htmlFor="reverse-awb-csv"
//                           className="relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-slate-300 bg-slate-50 py-4 text-center transition hover:border-[#0446DB] hover:bg-blue-50/40 dark:border-neutral-700 dark:bg-neutral-800/50 dark:hover:border-[#0446DB]"
//                         >
                        
//                           {csvFile && (
//                             <button
//                               type="button"
//                               onClick={(e) => {
//                                 e.preventDefault();
//                                 e.stopPropagation();
//                                 setCsvFile(null);
//                                 setCsvValidation(null);
//                                 toast.info("CSV file removed");
//                               }}
//                               className="absolute right-2 top-2 z-10 rounded-full bg-red-50 p-1 text-red-500 hover:bg-red-100 hover:text-red-600 dark:bg-red-950/50 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
//                               title="Remove CSV"
//                             >
//                               <X size={14} />
//                             </button>
//                           )}

//                           <FileText size={18} className="text-slate-400" />
                          
//                           <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
//                             {csvFile ? "Change CSV" : "Choose CSV file"}
//                           </span>
                          
//                           <span className="text-[10px] text-slate-400">
//                             .csv · max 10 MB
//                           </span>
                          
//                           <input
//                             id="reverse-awb-csv"
//                             type="file"
//                             accept=".csv,text/csv"
//                             onChange={(e) => {
//                               setCsvFile(e.target.files?.[0] || null);
//                               setCsvValidation(null);
//                             }}
//                             className="hidden"
//                           />
//                         </label>

//                         {csvFile && (
//                           <div className="flex items-center gap-2 rounded-md bg-slate-50 px-2 py-1.5 text-[11px] text-slate-600 dark:bg-neutral-800 dark:text-slate-300">
//                             <FileText
//                               size={12}
//                               className="shrink-0 text-slate-400"
//                             />
//                             <span className="truncate">{csvFile.name}</span>
//                             <span className="ml-auto shrink-0 text-slate-400">
//                               {(csvFile.size / 1024).toFixed(1)} KB
//                             </span>
//                           </div>
//                         )}

//                         <button
//                           type="button"
//                           onClick={() => void validateReverseCsv()}
//                           disabled={validatingCsv || !csvFile}
//                           className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#0446DB] px-3 text-xs font-medium text-white transition hover:bg-[#0438b1] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-neutral-700"
//                         >
//                           {validatingCsv ? (
//                             <Loader2 size={14} className="animate-spin" />
//                           ) : (
//                             <CheckCircle2 size={14} />
//                           )}
//                           {validatingCsv ? "Validating…" : "Validate CSV"}
//                         </button>

//                         {csvValidation && (
//                           <div className="rounded-md border border-blue-100 bg-blue-50 p-2.5 text-xs text-blue-800 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-200">
//                             {csvValidation && (
//                               <div className="rounded-md border border-blue-100 bg-blue-50 p-2.5 text-xs text-blue-800 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-200">
//                                 <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
//                                   Validation Result
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-x-3 gap-y-1">
//                                   <div className="flex justify-between">
//                                     <span className="text-blue-600/80 dark:text-blue-300/80">
//                                       CSV AWBs
//                                     </span>
//                                     <span className="font-semibold">
//                                       {csvValidation.csv_awb_count}
//                                     </span>
//                                   </div>
//                                   <div className="flex justify-between">
//                                     <span className="text-blue-600/80 dark:text-blue-300/80">
//                                       Total
//                                     </span>
//                                     <span className="font-semibold">
//                                       {csvValidation.total_loadout_shipments}
//                                     </span>
//                                   </div>
//                                   <div className="flex justify-between">
//                                     <span className="text-emerald-600">
//                                       Delivered
//                                     </span>
//                                     <span className="font-semibold text-emerald-700">
//                                       {
//                                         csvValidation.projected_rto_delivered_count
//                                       }
//                                     </span>
//                                   </div>
//                                   <div className="flex justify-between">
//                                     <span className="text-orange-600">
//                                       Undelivered
//                                     </span>
//                                     <span className="font-semibold text-orange-700">
//                                       {
//                                         csvValidation.projected_rto_undelivered_count
//                                       }
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>

//                       {/* STEP 2: Proof PDF + Proof CSV */}
//                       <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
//                         {/* Heading */}
//                         <div className="flex items-center gap-2">
//                           <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0446DB] text-[10px] font-bold text-white">
//                             2
//                           </span>
//                           <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
//                             Proof PDF & CSV{" "}
//                             <span className="text-red-500">*</span>
//                           </span>
//                         </div>

//                         {/* ---- Proof PDF ---- */}
//                         <div className="flex flex-col gap-2">
//                           <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
//                             Proof PDF <span className="text-red-500">*</span>
//                           </label>

//                           <label
//                             htmlFor="reverse-proof-pdf"
//                             className="relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-slate-300 bg-slate-50 py-4 text-center transition hover:border-[#0446DB] hover:bg-blue-50/50 dark:border-neutral-700 dark:bg-neutral-800/50"
//                           >
//                             {proofPdf && (
//                               <button
//                                 type="button"
//                                 onClick={(e) => {
//                                   e.preventDefault();
//                                   e.stopPropagation();
//                                   setProofPdf(null);
//                                   toast.info("PDF file removed");
//                                 }}
//                                 className="absolute right-2 top-2 z-10 rounded-full bg-red-50 p-1 text-red-500 hover:bg-red-100 hover:text-red-600 dark:bg-red-950/50 dark:hover:bg-red-900/50 cursor-pointer"
//                                 title="Remove PDF"
//                               >
//                                 <X size={14} />
//                               </button>
//                             )}

//                             <FileText size={18} className="text-slate-400" />
//                             <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
//                               {proofPdf ? "Change PDF" : "Choose PDF File"}
//                             </span>
//                             <span className="text-[10px] text-slate-400">
//                               .pdf · max 10 MB
//                             </span>

//                             <input
//                               id="reverse-proof-pdf"
//                               type="file"
//                               accept=".pdf,application/pdf"
//                               className="hidden"
//                               onChange={(e) => {
//                                 const file = e.target.files?.[0] || null;
//                                 if (file && file.size > 10 * 1024 * 1024) {
//                                   toast.warn("PDF size must not exceed 10 MB.");
//                                   e.target.value = "";
//                                   return;
//                                 }
//                                 setProofPdf(file);
//                                 e.target.value = "";
//                               }}
//                             />
//                           </label>

//                           {proofPdf && (
//                             <div className="flex items-center gap-2 rounded-md bg-slate-50 px-2 py-1.5 text-[11px] text-slate-600 dark:bg-neutral-800 dark:text-slate-300">
//                               <FileText
//                                 size={14}
//                                 className="shrink-0 text-[#0446DB]"
//                               />
//                               <span className="min-w-0 flex-1 truncate">
//                                 {proofPdf.name}
//                               </span>
//                               <span className="shrink-0 text-slate-400">
//                                 {(proofPdf.size / 1024).toFixed(1)} KB
//                               </span>
//                               <button
//                                 type="button"
//                                 onClick={() => {
//                                   setProofPdf(null);
//                                   toast.info("PDF file removed");
//                                 }}
//                                 className="shrink-0 rounded-full p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/50 cursor-pointer"
//                                 title="Remove PDF"
//                               >
//                                 <X size={12} />
//                               </button>
//                             </div>
//                           )}
//                         </div>

//                         {/* ---- Proof CSV (separate state!) ---- */}
//                         <div className="flex flex-col gap-2">
//                           <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
//                             AWB CSV File <span className="text-red-500">*</span>
//                           </label>

//                           <label
//                             htmlFor="reverse-proof-csv"
//                             className="relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-slate-300 bg-slate-50 py-4 text-center transition hover:border-[#0446DB] hover:bg-blue-50/50 dark:border-neutral-700 dark:bg-neutral-800/50"
//                           >
//                             {proofCsv && (
//                               <button
//                                 type="button"
//                                 onClick={(e) => {
//                                   e.preventDefault();
//                                   e.stopPropagation();
//                                   setProofCsv(null);
//                                   setReverseResult(null);
//                                   toast.info("CSV file removed");
//                                 }}
//                                 className="absolute right-2 top-2 z-10 rounded-full bg-red-50 p-1 text-red-500 hover:bg-red-100 hover:text-red-600 dark:bg-red-950/50 dark:hover:bg-red-900/50 cursor-pointer"
//                                 title="Remove CSV"
//                               >
//                                 <X size={14} />
//                               </button>
//                             )}

//                             <Upload size={18} className="text-slate-400" />
//                             <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
//                               {proofCsv ? "Change CSV File" : "Choose CSV File"}
//                             </span>
//                             <span className="text-[10px] text-slate-400">
//                               .csv file
//                             </span>

//                             <input
//                               id="reverse-proof-csv"
//                               type="file"
//                               accept=".csv,text/csv"
//                               className="hidden"
//                               onChange={(e) => {
//                                 const file = e.target.files?.[0] || null;
//                                 setProofCsv(file); // ✅ separate
//                                 setReverseResult(null);
//                                 e.target.value = "";
//                               }}
//                             />
//                           </label>

//                           {proofCsv && (
//                             <div className="flex items-center gap-2 rounded-md bg-slate-50 px-2 py-1.5 text-[11px] text-slate-600 dark:bg-neutral-800 dark:text-slate-300">
//                               <FileText
//                                 size={14}
//                                 className="shrink-0 text-[#0446DB]"
//                               />
//                               <span className="min-w-0 flex-1 truncate">
//                                 {proofCsv.name}
//                               </span>
//                               <span className="shrink-0 text-slate-400">
//                                 {(proofCsv.size / 1024).toFixed(1)} KB
//                               </span>
//                               <button
//                                 type="button"
//                                 onClick={() => {
//                                   setProofCsv(null); // ✅ separate
//                                   setReverseResult(null);
//                                   toast.info("CSV file removed");
//                                 }}
//                                 className="shrink-0 rounded-full p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/50 cursor-pointer"
//                                 title="Remove CSV"
//                               >
//                                 <X size={12} />
//                               </button>
//                             </div>
//                           )}
//                         </div>

//                         {/* Complete Reverse */}
//                         <button
//                           type="button"
//                           onClick={() => void completeReverse()}
//                           disabled={
//                             completingReverse ||
//                             validatingCsv ||
//                             !proofPdf ||
//                             !proofCsv
//                           }
//                           className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#0446DB] px-3 text-xs font-medium text-white transition hover:bg-[#0339b5] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-neutral-700"
//                         >
//                           {completingReverse ? (
//                             <Loader2 size={14} className="animate-spin" />
//                           ) : (
//                             <CheckCircle2 size={14} />
//                           )}
//                           {completingReverse
//                             ? "Submitting..."
//                             : "Complete Reverse"}
//                         </button>

//                         {/* Final Result */}
//                         {reverseResult && (
//                           <div className="rounded-md border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200">
//                             <div className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide">
//                               <CheckCircle2 size={12} />
//                               Completed
//                             </div>

//                             <div className="space-y-1">
//                               <div className="flex justify-between">
//                                 <span>Total</span>
//                                 <span className="font-semibold">
//                                   {reverseResult.total_shipments}
//                                 </span>
//                               </div>
//                               <div className="flex justify-between">
//                                 <span>Delivered</span>
//                                 <span className="font-semibold">
//                                   {reverseResult.rto_delivered_count}
//                                 </span>
//                               </div>
//                               <div className="flex justify-between">
//                                 <span>Undelivered</span>
//                                 <span className="font-semibold">
//                                   {reverseResult.rto_undelivered_count}
//                                 </span>
//                               </div>
//                               <div className="flex justify-between">
//                                 <span>Webhook</span>
//                                 <span className="font-semibold">
//                                   {reverseResult.webhook_dispatch_started ===
//                                   true
//                                     ? "Started"
//                                     : reverseResult.webhook_dispatch_started ===
//                                         false
//                                       ? "Idle"
//                                       : "—"}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//               {selected.loadout_type === "reverse" &&
//                 selected.status === "closed" &&
//                 !reverseResult && (
//                   <div className="rounded-sm border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
//                     <div className="flex items-center gap-2 font-semibold">
//                       <CheckCircle2 size={14} /> Reverse loadout closed
//                     </div>
//                   </div>
//                 )}
//             </div>

//             {/* modal footer — desktop */}
//             <div className="sticky bottom-0 hidden shrink-0 flex-wrap justify-end gap-2 border-t border-slate-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900 sm:flex sm:p-4">
//               <button
//                 type="button"
//                 onClick={() => void fetchDetails(selected.id)}
//                 disabled={loadingDetails}
//                 className="inline-flex items-center gap-2 rounded-sm border border-slate-200 px-4 py-2 text-sm dark:border-neutral-700 cursor-pointer"
//               >
//                 <RefreshCw
//                   size={15}
//                   className={loadingDetails ? "animate-spin" : ""}
//                 />{" "}
//                 Refresh
//               </button>
//               {/* 🔒 PERM — Close only if canManage */}
//               {canManage &&
//                 selected.status === "open" &&
//                 selected.loadout_type === "forward" && (
//                   <button
//                     type="button"
//                     onClick={() => void closeLoadout()}
//                     disabled={closing || scanning || accepted === 0}
//                     className="inline-flex items-center gap-2 rounded-sm bg-[#0446DB] px-4 py-2 text-sm font-medium text-white disabled:opacity-50 cursor-pointer"
//                   >
//                     {closing ? (
//                       <Loader2 size={16} className="animate-spin" />
//                     ) : (
//                       <RotateCcw size={16} />
//                     )}
//                     Close Loadout
//                   </button>
//                 )}
//             </div>
//           </div>

//           {/* MOBILE sticky action bar */}
//           <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center sm:hidden">
//             <div className="pointer-events-auto flex w-full max-w-5xl gap-2 border-t border-slate-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
//               <button
//                 type="button"
//                 onClick={() => void fetchDetails(selected.id)}
//                 disabled={loadingDetails}
//                 className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm border border-slate-200 py-2.5 text-sm dark:border-neutral-700 cursor-pointer"
//               >
//                 <RefreshCw
//                   size={15}
//                   className={loadingDetails ? "animate-spin" : ""}
//                 />{" "}
//                 Refresh
//               </button>
//               {/* 🔒 PERM — Close only if canManage */}
//               {canManage &&
//                 selected.status === "open" &&
//                 selected.loadout_type === "forward" && (
//                   <button
//                     type="button"
//                     onClick={() => void closeLoadout()}
//                     disabled={closing || scanning || accepted === 0}
//                     className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-[#0446DB] py-2.5 text-sm font-medium text-white disabled:opacity-50"
//                   >
//                     {closing ? (
//                       <Loader2 size={16} className="animate-spin" />
//                     ) : (
//                       <RotateCcw size={16} />
//                     )}
//                     Close
//                   </button>
//                 )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





"use client";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Loader2,
  Package,
  RefreshCw,
  RotateCcw,
  Search,
  X,
  Upload,
  FileText,
  CheckCircle2,
  MapPin,
  Filter,
  ChevronDown,
  ChevronUp,
  Truck,
  ArrowLeftRight,
  Copy,
  Inbox,
  Download,
} from "lucide-react";
import { toast } from "react-toastify";
import AxiosInstance from "@/Helper/axiosInstance";
import CustomButton from "../common/CustomButton";
import { FaFilter } from "react-icons/fa";
import logo from "@/assets/DaakitGo-Logo-removebg.png";

const BASE = "/api/loadout";
const baseURL = import.meta.env.VITE_BASE_URL;

type LoadoutType = "forward" | "reverse";
type TargetType = "vendor" | "dc";
type Filters = { start_date: string; end_date: string; city: string; code: string };
type Hub = { id: number; hub_name?: string; hub_code?: string; city?: string };
type Vendor = { id: number; vendor_name: string; company_name: string; city: string; state: string; pincode: string; dc_id?: number };
type DistributionCenter = { id: number; dc_name: string; dc_code: string; city: string; state: string; pincode: string; name?: string; code?: string; is_active?: number | string | boolean };
type ScannedOrder = {
  id?: number; awb_number: string; order_id?: number | null; scan_status: "accepted" | "rejected";
  status?: string | null; pickup_stage?: string | null; previous_status?: string | null;
  submit_stage?: string | null; rejection_reason?: string | null;
};
type Loadout = {
  id: number;
   loadout_code: string;
    loadout_type: LoadoutType; status: string;
  target_vendor_name?: string | null; target_dc_name?: string | null;
  source_hub_city?: string | null; target_id?: number | null; target_type?: TargetType;
  created_at?: string | null; closed_at?: string | null;
  accepted_count?: number; rejected_count?: number; total_scanned?: number;
  orders?: ScannedOrder[];
};
type CsvValidation = { csv_awb_count?: number; total_loadout_shipments?: number; projected_rto_delivered_count?: number; projected_rto_undelivered_count?: number };
type ReverseResult = { total_shipments?: number; rto_delivered_count?: number; rto_undelivered_count?: number; webhook_dispatch_started?: boolean };
type ApiResponse<T> = { success?: boolean; message?: string; data?: T; code?: string };
const todayISO = (): string => { const d = new Date(); const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return local.toISOString().slice(0, 10); };
const defaultDateFilters = (): Filters => {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 9);
  const toLocalISO = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  return { start_date: toLocalISO(startDate), end_date: toLocalISO(endDate), city: "", code: "" };
};

/* ============================ HELPERS ============================ */
function formatDate(value?: string | null): string {
  if (!value) return "-";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString("en-IN");
}

function errorMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: string; code?: string }>(error)) {
    // 🔒 PERM — friendly message for permission denials
    if (error.response?.status === 403) {
      return "You don't have permission to perform this action.";
    }
    return (
      error.response?.data?.message ||
      error.response?.data?.code ||
      error.message
    );
  }
  return error instanceof Error ? error.message : "Something went wrong";
}

const TABS: { id: LoadoutType; label: string }[] = [
  { id: "forward", label: "Forward Loadout" },
  { id: "reverse", label: "Reverse Loadout" },
];

/* ============================ MAIN ============================ */
export default function DcLoadout() {

  const scanInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate(); // 🔒 PERM

  /* ---- shared list / UI ---- */
  const [activeTab, setActiveTab] = useState<LoadoutType>("forward");
  const [search, setSearch] = useState("");
  const [loadouts, setLoadouts] = useState<Loadout[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [dcs, setDcs] = useState<DistributionCenter[]>([]);

    const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultDateFilters);
  const [filtersVersion, setFiltersVersion] = useState(0);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(defaultDateFilters);
  const applyFilters = (): void => {
    if (filters.start_date && filters.start_date > todayISO()) {
      toast.warning("Start date cannot be in the future");
      return;
    }
    if (filters.start_date && filters.end_date && filters.start_date > filters.end_date) {
      toast.warning("Start date cannot be later than end date");
      return;
    }
    if (filters.end_date && filters.end_date > todayISO()) {
      toast.warning("End date cannot be in the future");
      return;
    }
    setAppliedFilters({ ...filters });
    setFiltersVersion((v) => v + 1);
    setDrawerOpen(false);
  };
  const resetFilters = (): void => {
    const defaults = defaultDateFilters();
    setFilters(defaults);
    setAppliedFilters(defaults);
    setFiltersVersion((v) => v + 1);
  };

  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<Loadout | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const [awb, setAwb] = useState("");
  const [scanning, setScanning] = useState(false);
  const [closing, setClosing] = useState(false);
  const [validatingCsv, setValidatingCsv] = useState(false);
  const [completingReverse, setCompletingReverse] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [proofPdf, setProofPdf] = useState<File | null>(null);
  const [proofCsv, setProofCsv] = useState<File | null>(null);
  const [csvValidation, setCsvValidation] = useState<CsvValidation | null>(null);
  const [reverseResult, setReverseResult] = useState<ReverseResult | null>(null);

  const [userHubs, setuserHubs] = useState<Hub[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  const [forwardSourceHubId, setForwardSourceHubId] = useState("");
  const [targetType, setTargetType] = useState<TargetType>("vendor");
  const [targetId, setTargetId] = useState("");
  const [reverseSourceHubId, setReverseSourceHubId] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPerPage = 10;

  /* ================= 🔒 PERMISSIONS ================= */

  // Normalize localStorage → array (it may have been stored as a string historically)
  const [permissions, setPermissions] = useState<string[]>(() => {
    const raw = localStorage.getItem("permission");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      /* fall through */
    }
    return raw
      .split(",")
      .map((p: string) => p.trim())
      .filter(Boolean);
  });

  const [permLoading, setPermLoading] = useState(true);

  const hasPermission = useCallback(
    (perm: string) =>
      permissions.includes(perm) || permissions.includes("ADMIN_FULL_ACCESS"),
    [permissions],
  );

  const getUserPermissions = useCallback(async () => {
    try {
      const res = await AxiosInstance.get<{ data?: { data?: string[] } }>(`${baseURL}/api/user/getUserPermissions`);

      const list = Array.isArray(res?.data?.data?.data)
        ? res.data.data.data
        : [];

      const allowed =
        list.includes("LOADOUT_VIEW") || list.includes("ADMIN_FULL_ACCESS");

      if (!allowed) {
        navigate("/unauthorized");
        return;
      }

      localStorage.setItem("permission", JSON.stringify(list));
      setPermissions(list);
    } catch (error) {
      const msg =
        (axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined) ||
        (error instanceof Error ? error.message : undefined) ||
        "Failed to load permissions";
      toast.error(msg);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
        return;
      }
      if (!localStorage.getItem("permission")) {
        navigate("/unauthorized");
      }
    } finally {
      setPermLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void getUserPermissions();
  }, [getUserPermissions]);

  const canView = hasPermission("LOADOUT_VIEW");
  const canManage = hasPermission("LOADOUT_MANAGE");

  /* ======================= COPY ======================= */
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Loadout Code copied!");
    } catch {
      toast.error("Failed to copy code.");
    }
  };

  /* ======================= FETCH HUBS ======================= */
  const fetchuserHubs = async () => {
    try {
      const res = await AxiosInstance.get<ApiResponse<{ hubs?: Hub[] } | Hub[]>>(`${BASE}/user/hubs`);
      const raw = res.data?.data;
      const list: Hub[] = Array.isArray(raw) ? raw : raw?.hubs ?? [];
      setuserHubs(Array.isArray(list) ? list : []);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  /* ======================= FETCH VENDORS ======================= */
  const fetchVendors = async () => {
    try {
      const res = await AxiosInstance.get<ApiResponse<Vendor[]>>(`${BASE}/users/vendors`);
      const list: Vendor[] = res.data?.data ?? [];

      setVendors(
        list.map((v) => ({
          id: v.id,
          vendor_name: v.vendor_name || "Unknown Vendor",
          company_name: v.company_name || "",
          city: v.city || "",
          state: v.state || "",
          pincode: v.pincode || "",
          dc_id: v.dc_id,
        })),
      );
    } catch (error) {
      setVendors([]);
      toast.error(errorMessage(error));
    }
  };

  /* ======================= FETCH DCs ======================= */
  const fetchDCs = async () => {
    try {
      const res = await AxiosInstance.get<ApiResponse<{ dcs?: DistributionCenter[] } | DistributionCenter[]>>(`${BASE}/users/dcs`);

      const raw = res.data?.data;
      const list: DistributionCenter[] = Array.isArray(raw) ? raw : raw?.dcs ?? [];

      const mappedDcs = list
        .filter((d) => {
          if (d.is_active !== undefined) {
            return (
              d.is_active === 1 || d.is_active === true || d.is_active === "1"
            );
          }
          return true;
        })
        .map((d, index) => ({
          id: d.id,
          dc_name: d.dc_name || d.name || `Unknown DC ${index + 1}`,
          dc_code: d.dc_code || d.code || "",
          city: d.city || "",
          state: d.state || "",
          pincode: d.pincode || "",
        }));

      setDcs(mappedDcs);
    } catch (error) {
      console.error("Error fetching DCs:", error);
      setDcs([]);
      toast.error(errorMessage(error));
    }
  };
  

  /* ======================= LIST ======================= */
  const fetchLoadouts = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await AxiosInstance.get<ApiResponse<Loadout[] | { loadouts?: Loadout[] }>>(`${BASE}/user`, {
        params: {
          limit: 100,
          offset: 0,
          start_date: appliedFilters.start_date || undefined,
          end_date: appliedFilters.end_date || undefined,
          city: appliedFilters.city || undefined,
          code: appliedFilters.code || undefined,
        },
      });
      const payload: Loadout[] | { loadouts?: Loadout[] } | undefined = res.data?.data;
      const rows: Loadout[] = Array.isArray(payload) ? payload : (payload?.loadouts ?? []);
      setLoadouts(rows);
    } catch (error) {
      setLoadouts([]);
      toast.error(errorMessage(error));
    } finally {
      setLoadingList(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    void fetchLoadouts();
  }, [filtersVersion, fetchLoadouts]); // 🔒 PERM — added fetchLoadouts to deps

  useEffect(() => {
    setSelected(null);
    setSearch("");
    setAwb("");
    setCsvFile(null);
    setProofPdf(null);
    setProofCsv(null)
    setCsvValidation(null);
    setReverseResult(null);
    setForwardSourceHubId("");
    setTargetType("vendor");
    setTargetId("");
    setReverseSourceHubId("");
    setCurrentPage(1);
  }, [activeTab]);

  /* ======================= DOWNLOAD SAMPLE CSV ======================= */
  const downloadSampleCsv = async () => {
    try {
      // Note: API endpoint as per your route
      const res = await AxiosInstance.get(`${BASE}/users/sample-awb-csv`, {
        responseType: "blob",
      });

      // Blob se URL banayein aur download trigger karein
      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sample-awb.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Sample CSV downloaded successfully");
    } catch (error) {
      console.error("Download Error:", error);
      toast.error(errorMessage(error));
    }
  };

  /* ======================= CREATE FORWARD ======================= */
  const createForward = async () => {
    if (!forwardSourceHubId) return toast.warn("Please select a source hub.");
    if (!targetType) return toast.warn("Please select a target type.");
    if (!targetId)
      return toast.warn(
        targetType === "vendor"
          ? "Please select a target vendor."
          : "Please select a target DC.",
      );

    const body = {
      loadout_type: "forward",
      source_hub_id: Number(forwardSourceHubId),
      target_type: targetType,
      target_id: Number(targetId),
    };

    setCreating(true);
    try {
      const res = await AxiosInstance.post<ApiResponse<{ loadout_id?: number }>>(`${BASE}/user`, body);
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Could not create loadout");
      }
      const created = res.data?.data ?? {};
      toast.success(res.data?.message || "Load-out created");

      setForwardSourceHubId("");
      setTargetId("");
      setTargetType("vendor");

      await fetchLoadouts();
      if (created.loadout_id) {
        await fetchDetails(created.loadout_id);
      }
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setCreating(false);
    }
  };

  /* ======================= CREATE REVERSE ======================= */
  const createReverse = async () => {
    if (!reverseSourceHubId) return toast.warn("Please select a source hub.");

    const hub = userHubs.find(
      (h) => String(h.id) === String(reverseSourceHubId),
    );
    if (!hub) {
      return toast.error(
        "Please select a valid user hub for reverse load-out.",
      );
    }

    const body = {
      loadout_type: "reverse",
      source_hub_id: Number(reverseSourceHubId),
    };

    setCreating(true);
    try {
      const res = await AxiosInstance.post<ApiResponse<{ loadout_id?: number }>>(`${BASE}/user`, body);
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Could not create loadout");
      }
      const created = res.data?.data ?? {};
      toast.success(res.data?.message || "Reverse load-out created");

      setReverseSourceHubId("");
      await fetchLoadouts();
      if (created.loadout_id) {
        await fetchDetails(created.loadout_id);
      }
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setCreating(false);
    }
  };

  /* ======================= DETAILS ======================= */
  const fetchDetails = async (loadoutId: number) => {
    setLoadingDetails(true);
    try {
      const res = await AxiosInstance.get<ApiResponse<Loadout>>(`${BASE}/user/${loadoutId}`);
      if (!res.data?.success || !res.data?.data) {
        throw new Error(res.data?.message || "Loadout details unavailable");
      }
      setSelected(res.data.data);
      setAwb("");
      setCsvFile(null);
      setProofPdf(null);
      setCsvValidation(null);
      setReverseResult(null);
      setOrdersPage(1);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoadingDetails(false);
    }
  };

  /* ======================= SCAN ======================= */
  const scanAwb = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault?.();
    if (!selected || selected.status !== "open" || scanning) return;

    const awbNumber = awb.trim();
    if (!awbNumber) return toast.warn("Please enter or scan an AWB number.");

    setScanning(true);
    try {
      const res = await AxiosInstance.post<ApiResponse<unknown>>(`${BASE}/user/${selected.id}/scan`, {
        awb_number: awbNumber,
      });
      if (!res.data?.success) {
        throw new Error(res.data?.message || "AWB rejected");
      }
      toast.success(
        res.data?.message ||
          (selected.loadout_type === "forward"
            ? "Shipment mapped."
            : "Shipment marked rto out for delivery."),
      );
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      const code = axios.isAxiosError<{ code?: string }>(error) ? error.response?.data?.code : undefined;
      const msg = axios.isAxiosError<{ message?: string }>(error) ? (error.response?.data?.message || errorMessage(error)) : errorMessage(error);
      toast.error(
        status === 409
          ? `Duplicate scan: ${msg}`
          : code
            ? `[${code}] ${msg}`
            : msg,
      );
    } finally {
      setAwb("");
      await Promise.all([fetchDetails(selected.id), fetchLoadouts()]);
      setScanning(false);
      requestAnimationFrame(() => scanInputRef.current?.focus());
    }
  };

  /* ======================= CLOSE ======================= */
  const closeLoadout = async () => {
    if (!selected || selected.status !== "open" || closing) return;
    if (selected.loadout_type !== "forward") {
      return toast.error("Only forward load-outs can be closed.");
    }
    const acceptedCount =
      selected.accepted_count ??
      selected.orders?.filter((o) => o.scan_status === "accepted").length ??
      0;
    if (acceptedCount === 0) {
      return toast.warn(
        "At least one shipment must be accepted before closing the loadout.",
      );
    }
    if (
      !window.confirm(
        `Close loadout ${selected.loadout_code}? You won't be able to scan more.`,
      )
    )
      return;

    setClosing(true);
    try {
      const res = await AxiosInstance.post<ApiResponse<{ accepted_count?: number }>>(`${BASE}/user/${selected.id}/close`);
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to close loadout");
      }
      toast.success(
        res.data?.message ||
          `Load-out closed successfully (accepted: ${
            res.data?.data?.accepted_count ?? 0
          })`,
      );
      await Promise.all([fetchDetails(selected.id), fetchLoadouts()]);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setClosing(false);
    }
  };

  /* ======================= VALIDATE REVERSE CSV ======================= */
  const validateReverseCsv = async () => {
    if (!csvFile) return toast.warn("Please choose a CSV file.");
    setValidatingCsv(true);
    try {
      const formData = new FormData();
      formData.append("awb_csv", csvFile);
      const res = await AxiosInstance.post<ApiResponse<CsvValidation>>(
        `${BASE}/user/${selected.id}/validate-reverse-csv`,
        formData,
      );
      if (!res.data?.success) {
        throw new Error(res.data?.message || "CSV validation failed");
      }
      setCsvValidation(res.data.data);
      toast.success(
        res.data?.message ||
          "CSV validated successfully and is ready for reverse load-out completion",
      );
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setValidatingCsv(false);
    }
  };

  /* ======================= COMPLETE REVERSE ======================= */
  const completeReverse = async () => {
    if (!proofPdf) return toast.warn("Please attach a proof PDF.");
    if (!proofCsv) return toast.warn("Please attach the AWB CSV.");
    if (
      !window.confirm(
        "Complete reverse loadout? This will finalize the loadout.",
      )
    )
      return;

    setCompletingReverse(true);
    try {
      const formData = new FormData();
      formData.append("proof_pdf", proofPdf);
      formData.append("awb_csv", proofCsv);
      const res = await AxiosInstance.post<ApiResponse<ReverseResult>>(`${BASE}/user/${selected.id}/complete-reverse`,
        formData,
      );
      if (!res.data?.success) {
        throw new Error(
          res.data?.message || "Failed to complete reverse loadout",
        );
      }
      setReverseResult(res.data.data);
      toast.success(
        res.data?.message || "Reverse load-out proof submitted successfully",
      );
      await Promise.all([fetchDetails(selected.id), fetchLoadouts()]);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setCompletingReverse(false);
    }
  };


  /* ======================= DOWNLOAD LOADOUT PDF ======================= */
  // Client-side export using the already-loaded details. Existing APIs are not touched.
  const downloadLoadoutPdf = async () => {
    if (!selected || downloadingPdf) return;
    setDownloadingPdf(true);
    try {
      const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const left = 12;
      const right = pageWidth - left;
      const ink: [number, number, number] = [23, 37, 61];
      const muted: [number, number, number] = [99, 111, 129];
      const border: [number, number, number] = [218, 226, 236];
      const brandBlue: [number, number, number] = [4, 70, 219];
      const orders = (selected.orders ?? []).filter((order) => order.scan_status === "accepted");
      const text = (value: unknown): string => String(value ?? "-").replace(/[^\x20-\x7E]/g, " ").trim() || "-";
      const short = (value: unknown, width: number): string => {
        let result = text(value);
        while (result.length > 3 && pdf.getTextWidth(result) > width) result = result.slice(0, -4) + "...";
        return result;
      };
      const line = (y: number) => {
        pdf.setDrawColor(...border);
        pdf.setLineWidth(0.3);
        pdf.line(left, y, right, y);
      };
      let logoData: string | null = null;
      let logoSize: { w: number; h: number } | null = null;
      try {
        const image = new Image();
        const src = typeof logo === "string" ? logo : (logo as { src?: string }).src ?? "";
        const loaded = await new Promise<HTMLImageElement>((resolve, reject) => {
          image.onload = () => resolve(image);
          image.onerror = () => reject(new Error("Logo unavailable"));
          image.src = src;
        });
        const canvas = document.createElement("canvas");
        canvas.width = loaded.naturalWidth;
        canvas.height = loaded.naturalHeight;
        const context = canvas.getContext("2d");
        if (context) {
          context.drawImage(loaded, 0, 0);
          logoData = canvas.toDataURL("image/png");
          const scale = Math.min(27 / canvas.width, 17 / canvas.height);
          logoSize = { w: canvas.width * scale, h: canvas.height * scale };
        }
      } catch {
        // A missing logo should not prevent an otherwise valid PDF export.
      }
      const drawHeader = (continued = false) => {
        if (logoData && logoSize) pdf.addImage(logoData, "PNG", left, 13, logoSize.w, logoSize.h);
        else {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(13);
          pdf.setTextColor(...brandBlue);
          pdf.text("DAAKit", left, 22);
        }
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(15);
        pdf.setTextColor(...ink);
        pdf.text("Loadout Details", left + 31, 19);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(...muted);
        pdf.text(continued ? "Accepted AWB List (continued)" : "Accepted AWB List", left + 31, 26);
        pdf.setFontSize(8);
        pdf.text("Loadout Code", right, 14.5, { align: "right" });
        pdf.setFillColor(231, 240, 255);
        pdf.roundedRect(right - 51, 18, 51, 11, 1.5, 1.5, "F");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9.5);
        pdf.setTextColor(...brandBlue);
        pdf.text(short(selected.loadout_code, 46), right - 25.5, 25, { align: "center" });
        line(37);
      };
      drawHeader();
      pdf.setFillColor(248, 250, 253);
      pdf.setDrawColor(...border);
      pdf.roundedRect(left, 42, right - left, 32, 2.5, 2.5, "FD");
      pdf.setDrawColor(227, 233, 242);
      pdf.line(109, 46, 109, 69);
      const detail = (label: string, value: unknown, x: number, valueX: number, y: number, maxWidth: number) => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8.1);
        pdf.setTextColor(...muted);
        pdf.text(`${label} :`, x, y);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8.5);
        pdf.setTextColor(...ink);
        pdf.text(short(value, maxWidth), valueX, y);
      };
      detail("LOADOUT TYPE", selected.loadout_type === "forward" ? "Forward Loadout" : "Reverse Loadout", left + 5, left + 38, 50, 57);
      detail("CREATED AT", formatDate(selected.created_at), 114, 138, 50, 56);
      detail("SOURCE HUB", selected.source_hub_city, left + 5, left + 38, 60, 57);
      detail("STATUS", selected.status.toUpperCase(), 114, 138, 60, 56);
      detail("ACCEPTED SHIPMENTS", String(orders.length), left + 5, left + 48, 69, 23);
      line(80);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(...ink);
      pdf.text("Accepted AWBs", left, 88);
      autoTable(pdf, {
        startY: 94,
        margin: { left, right: left, bottom: 28, top: 45 },
        head: [["#", "AWB Number", "Order ID", "Scan Status", "Reason"]],
        body: orders.map((order, index) => [
          String(index + 1), text(order.awb_number), text(order.order_id),
          text(order.scan_status), text(order.rejection_reason || "-"),
        ]),
        theme: "grid",
        styles: { font: "helvetica", fontSize: 8, cellPadding: 3, textColor: ink, lineColor: border, lineWidth: 0.16, overflow: "linebreak" },
        headStyles: { fillColor: [239, 243, 248], textColor: ink, fontStyle: "bold", lineColor: border },
        alternateRowStyles: { fillColor: [251, 252, 254] },
        columnStyles: { 0: { cellWidth: 11, halign: "center" }, 1: { cellWidth: 57 }, 2: { cellWidth: 38 }, 3: { cellWidth: 33 }, 4: { cellWidth: 47 } },
        didDrawPage: (data) => { if (data.pageNumber > 1) drawHeader(true); },
      });
      const generated = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
      const pages = pdf.getNumberOfPages();
      for (let page = 1; page <= pages; page++) {
        pdf.setPage(page);
        line(pageHeight - 24);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7.4);
        pdf.setTextColor(...ink);
        pdf.text(`Generated On: ${generated}`, left, pageHeight - 17);
        pdf.text("Generated By: Loadout User", left, pageHeight - 12);
        pdf.text(`Page ${page} of ${pages}`, right, pageHeight - 17, { align: "right" });
      }
      pdf.setProperties({ title: `DAAKit Loadout - ${text(selected.loadout_code)}` });
      pdf.save(`DAAKit_Loadout_${selected.loadout_code.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`);
      toast.success("Loadout PDF downloaded");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setDownloadingPdf(false);
    }
  };

  /* ======================= DERIVED ======================= */
  const filteredLoadouts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return loadouts
      .filter((i) => i.loadout_type === activeTab)
      .filter((i) =>
        [
          i.loadout_code ?? "",
          i.target_vendor_name ?? "",
          i.target_dc_name ?? "",
          i.source_hub_city ?? "",
          i.target_id != null ? String(i.target_id) : "",
        ].some((t) => String(t).toLowerCase().includes(q)),
      );
  }, [loadouts, search, activeTab]);

  const accepted =
    selected?.accepted_count ??
    selected?.orders?.filter((o) => o.scan_status === "accepted").length ??
    0;
  const rejected =
    selected?.rejected_count ??
    selected?.orders?.filter((o) => o.scan_status === "rejected").length ??
    0;

  const targetOptions =
    targetType === "vendor"
      ? vendors.map((v, i) => ({
          id: v.id,
          label: `${i + 1}. ${v.vendor_name}${v.company_name ? ` (${v.company_name})` : ""}${v.city ? ` - ${v.city}` : ""}`,
        }))
      : dcs.map((d, i) => ({
          id: d.id,
          label: `${i + 1}. ${d.dc_name}${d.dc_code ? ` (${d.dc_code})` : ""}${d.city ? ` - ${d.city}` : ""}`,
        }));

  const canCreateForward = !!forwardSourceHubId && !!targetType && !!targetId;
  const canCreateReverse = !!reverseSourceHubId;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search, filtersVersion]);

  const totalPages = Math.ceil(filteredLoadouts.length / rowsPerPage) || 1;
  const paginatedLoadouts = filteredLoadouts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const totalOrders = selected?.orders?.length ?? 0;
  const totalOrderPages = Math.ceil(totalOrders / ordersPerPage) || 1;
  const paginatedOrders = (selected?.orders ?? []).slice(
    (ordersPage - 1) * ordersPerPage,
    ordersPage * ordersPerPage,
  );

  /* ================= 🔒 PERM: PAGE-LEVEL GUARDS ================= */
  if (permLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center gap-2 text-slate-500">
        <Loader2 className="animate-spin text-[#0446DB]" size={28} />
        <span className="text-sm">Loading permissions…</span>
      </div>
    );
  }

  if (!canView) return null; // navigate() already fired

  /* ======================= RENDER ======================= */
  return (
    <div className="flex min-h-[calc(100dvh-100px)] flex-col gap-3 bg-[#F7F8FA] p-3 text-slate-900 sm:gap-4 sm:p-0 dark:bg-neutral-950 dark:text-white">
      <div className="shrink-0 sm:pt-0">
        <h1 className="text-lg font-bold sm:text-2xl">Loadout</h1>
        <p className="mt-0.5 text-xs text-slate-500 sm:mt-1 sm:text-sm">
          Create loadouts, scan AWBs, validate reverse CSVs and close batches.
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm border border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        {/* tabs */}
        <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-slate-200 px-2 dark:border-neutral-800 sm:px-5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 border-b-2 px-3 py-3 text-xs font-medium sm:px-4 sm:text-sm cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#0446DB] text-[#0446DB]"
                  : "border-transparent text-slate-500 hover:text-[#0446DB]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ==================== CREATE BAR ==================== */}
        <div className="flex shrink-0 flex-col gap-3 border-b border-slate-100 p-3 dark:border-neutral-800 sm:p-4">
          {activeTab === "forward" ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
              {canManage && (
                <label className="flex w-full flex-col gap-1 text-xs font-medium text-slate-600 lg:w-[260px] dark:text-slate-300">
                  Source Hub
                  <select
                  onClick={fetchuserHubs}
                    value={forwardSourceHubId}
                    onChange={(e) => setForwardSourceHubId(e.target.value)}
                    className="h-10 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="">Select Source Hub</option>
                    {userHubs.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.id}: {h.hub_name} ({h.hub_code})
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {canManage && (
                <label className="flex w-full flex-col gap-1 text-xs font-medium text-slate-600 lg:w-[160px] dark:text-slate-300">
                  Target Type
                  <select
                    value={targetType}
                    onChange={(e) => {
                      setTargetType(e.target.value as TargetType);
                      setTargetId("");
                    }}
                    className="h-10 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="vendor">Vendor</option>
                    <option value="dc">DC</option>
                  </select>
                </label>
              )}

              {canManage && (
                <label className="flex w-full flex-col gap-1 text-xs font-medium text-slate-600 lg:w-[280px] dark:text-slate-300">
                  Target
                  <select
                  onClick={()=>{
                      if(targetType === "vendor"){
                        fetchVendors()
                      }else{
                        fetchDCs()
                      }
                      
                    }}
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="h-10 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value=""
                    onClick={()=>{
                      if(targetType === "vendor"){
                        fetchVendors()
                      }
                    }}
                    >
                      
                      Select {targetType === "vendor" ? "vendor" : "DC"}
                    </option>
                    {targetOptions.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {/* 🔒 PERM — hide Create Forward */}
              {canManage && (
                <button
                  type="button"
                  onClick={() => void createForward()}
                  disabled={creating || !canCreateForward}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-[#0339b5] disabled:opacity-50 sm:col-span-2 lg:w-auto cursor-pointer"
                >
                  {creating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Package size={16} />
                  )}
                  Create Loadout
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
              {canManage && (
                <label className="flex w-full flex-col gap-1 text-xs font-medium text-slate-600 lg:w-[280px] dark:text-slate-300">
                  Source Hub
                  <select
                    value={reverseSourceHubId}
                    onFocus={() => void fetchuserHubs()}
                    onChange={(e) => setReverseSourceHubId(e.target.value)}
                    className="h-10 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="">Select user Hub</option>
                    {userHubs.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.id}: {h.hub_name} ({h.hub_code})
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {/* 🔒 PERM — hide Create Reverse */}
              {canManage && (
                <button
                  type="button"
                  onClick={() => void createReverse()}
                  disabled={creating || !canCreateReverse}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-[#0339b5] disabled:opacity-50 sm:col-span-2 lg:w-auto"
                >
                  {creating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Package size={16} />
                  )}
                  Create Reverse Loadout
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">


            
<Drawer direction="right" open={drawerOpen} onOpenChange={setDrawerOpen}>
  <DrawerTrigger asChild>
    <CustomButton
      variant="outline"
      size="md"
      icon={FaFilter}
      className="rounded-sm"
    >
      <span>Filter</span>
    </CustomButton>
  </DrawerTrigger>

  <DrawerContent className="ml-auto flex h-full w-full max-w-md flex-col overflow-hidden rounded-none border-l border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">

    {/* Fixed Header */}
    <DrawerHeader className="shrink-0 border-b border-neutral-200 px-5 py-4 text-left dark:border-neutral-800">
      <DrawerTitle className="flex items-center gap-3 text-base font-semibold text-neutral-900 dark:text-white">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
          <FaFilter className="text-sm" />
        </span>
        Filter Orders
      </DrawerTitle>

      <DrawerDescription className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        Apply filters to find specific orders.
      </DrawerDescription>
    </DrawerHeader>

    {/* Scrollable Body */}
    <form id="loadout-filter-form" onSubmit={(e: FormEvent<HTMLFormElement>) => { e.preventDefault(); applyFilters(); }} className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
      <div className="grid grid-cols-1 gap-5">

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300">
            Start Date
            <input
              type="date"
              value={filters.start_date}
              max={todayISO()}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  start_date: e.target.value,
                  end_date: f.end_date && e.target.value > f.end_date ? e.target.value : f.end_date,
                }))
              }
              onClick={(e) => {
                try {
                  e.currentTarget.showPicker();
                } catch {
                  // Browser fallback
                }
              }}
              className="h-10 w-full min-w-0 rounded-sm border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300">
            End Date
            <input
              type="date"
              value={filters.end_date}
              min={filters.start_date || undefined}
              max={todayISO()}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  end_date: e.target.value && f.start_date && e.target.value < f.start_date ? f.start_date : e.target.value,
                }))
              }
              onClick={(e) => {
    try {
      e.currentTarget.showPicker();
    } catch {
      // Browser fallback
    }
  }}
              className="h-10 w-full min-w-0 rounded-sm border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300">
          City
          <input
            type="text"
            value={filters.city}
            onChange={(e) =>
              setFilters((f) => ({ ...f, city: e.target.value }))
            }
            placeholder="Enter city name"
            className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm outline-none placeholder:text-neutral-400 focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300">
          Loadout Code
          <input
            type="text"
            value={filters.code}
            onChange={(e) =>
              setFilters((f) => ({ ...f, code: e.target.value }))
            }
            placeholder="Enter loadout code"
            className="h-10 w-full rounded-sm border border-neutral-200 bg-white px-3 text-sm outline-none placeholder:text-neutral-400 focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
          />
        </label>
      </div>
    </form>

    {/* Fixed Footer */}
    <DrawerFooter className="shrink-0 border-t border-neutral-200 bg-neutral-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/80">
      <div className="grid grid-cols-2 gap-3">
        <Button type="button" variant="outline" onClick={resetFilters} className="h-10 cursor-pointer rounded-sm border-neutral-300 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">Reset</Button>
        <Button type="submit" form="loadout-filter-form" className="h-10 cursor-pointer gap-2 rounded-sm bg-[#0446DB] text-sm font-medium text-white hover:bg-blue-700"><FaFilter className="text-xs" />Apply Filter</Button>
      </div>

      <DrawerClose asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-9 cursor-pointer rounded-sm text-sm text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          Cancel
        </Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>

            <button
              type="button"
              onClick={() => void fetchLoadouts()}
              
              className="inline-flex h-10 items-center justify-center gap-2 rounded-sm border border-slate-200 px-3 text-xs dark:border-neutral-700 sm:text-sm cursor-pointer"
            >
              <RefreshCw
                size={16}
                className={loadingList ? "animate-spin" : ""}
              />{" "}
              Refresh
            </button>
          </div>
        </div>

        {/* filters */}
       

        {/* search */}
        <div className="shrink-0 border-b border-slate-100 p-3 dark:border-neutral-800 sm:p-4">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search loadout, vendor, hub..."
              className="h-10 w-full rounded-sm border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>
        </div>

        {/* ====== MOBILE CARDS ====== */}
        <div className="block min-h-0 flex-1 overflow-y-auto p-3 md:hidden">
          {paginatedLoadouts.map((item) => (
            <div
              key={item.id}
              className="mb-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div
                    className="group flex items-center gap-1.5 cursor-pointer w-fit"
                    onClick={() => copyToClipboard(item.loadout_code)}
                    title="Click to copy"
                  >
                    <div className="truncate font-semibold text-[#0446DB]">
                      {item.loadout_code}
                    </div>
                    <Copy
                      size={12}
                      className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 dark:bg-neutral-800">
                      {item.loadout_type === "forward" ? (
                        <Truck size={10} />
                      ) : (
                        <ArrowLeftRight size={10} />
                      )}
                      {item.loadout_type}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={10} /> {item.source_hub_city || "-"}
                    </span>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    item.status === "open"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-medium">Target: </span>
                {item.target_vendor_name
                  ? item.target_vendor_name
                  : item.target_dc_name
                    ? item.target_dc_name
                    : item.target_type === "dc"
                      ? `DC #${item.target_id}`
                      : item.target_type === "vendor"
                        ? `Vendor #${item.target_id}`
                        : "—"}
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="rounded bg-slate-50 py-1 dark:bg-neutral-800">
                  <div className="text-slate-500">Scanned</div>
                  <div className="font-semibold">{item.total_scanned ?? 0}</div>
                </div>
                <div className="rounded bg-blue-50 py-1 text-blue-700">
                  <div>Accepted</div>
                  <div className="font-semibold">
                    {item.accepted_count ?? 0}
                  </div>
                </div>
                <div className="rounded bg-orange-50 py-1 text-orange-700">
                  <div>Rejected</div>
                  <div className="font-semibold">
                    {item.rejected_count ?? 0}
                  </div>
                </div>
              </div>

              <div className="mt-2 text-[11px] text-slate-500">
                Created: {formatDate(item.created_at)}
              </div>

              <button
                type="button"
                onClick={() => void fetchDetails(item.id)}
                className="mt-3 w-full rounded-md border border-[#0446DB] py-2 text-sm font-medium text-[#0446DB] hover:bg-blue-50 cursor-pointer"
              >
                View / Scan
              </button>
            </div>
          ))}

          {!loadingList && filteredLoadouts.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
              <div className="rounded-full bg-slate-100 p-4 dark:bg-neutral-800">
                <Inbox size={32} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium">No loadouts found</p>
              <p className="text-xs text-slate-400">
                Create a new loadout or adjust your filters.
              </p>
            </div>
          )}
          {loadingList && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 animate-pulse"
                >
                  <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-neutral-700"></div>
                  <div className="mt-3 h-3 w-3/4 rounded bg-slate-100 dark:bg-neutral-800"></div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="h-8 rounded bg-slate-100 dark:bg-neutral-800"></div>
                    <div className="h-8 rounded bg-slate-100 dark:bg-neutral-800"></div>
                    <div className="h-8 rounded bg-slate-100 dark:bg-neutral-800"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ====== DESKTOP TABLE ====== */}
        <div className="hidden min-h-0 flex-1 overflow-auto md:block">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase text-slate-500 dark:bg-neutral-800">
              <tr>
                <th className="px-4 py-3">Loadout</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Scanned</th>
                <th className="px-4 py-3">Accepted</th>
                <th className="px-4 py-3">Rejected</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {paginatedLoadouts.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 dark:hover:bg-neutral-800/50"
                >
                  <td className="px-4 py-3 font-semibold text-[#0446DB]">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.loadout_code)}
                      className="group flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer text-left"
                      title="Click to copy"
                    >
                      <span className="truncate">{item.loadout_code}</span>
                      <Copy
                        size={14}
                        className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-neutral-800 dark:text-slate-200">
                      {item.loadout_type === "forward" ? (
                        <Truck size={12} />
                      ) : (
                        <ArrowLeftRight size={12} />
                      )}
                      {item.loadout_type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <MapPin size={12} className="text-slate-400" />{" "}
                      {item.source_hub_city || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {item.target_vendor_name
                      ? item.target_vendor_name
                      : item.target_dc_name
                        ? item.target_dc_name
                        : item.target_type === "dc"
                          ? `DC #${item.target_id}`
                          : item.target_type === "vendor"
                            ? `Vendor #${item.target_id}`
                            : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="px-4 py-3">{item.total_scanned ?? 0}</td>
                  <td className="px-4 py-3">{item.accepted_count ?? 0}</td>
                  <td className="px-4 py-3">{item.rejected_count ?? 0}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        item.status === "open"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => void fetchDetails(item.id)}
                      className="rounded-md border border-[#0446DB] px-3 py-1.5 text-xs font-medium text-[#0446DB] hover:bg-blue-50 cursor-pointer"
                    >
                      View / Scan
                    </button>
                  </td>
                </tr>
              ))}

              {!loadingList && filteredLoadouts.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
                      <div className="rounded-full bg-slate-100 p-4 dark:bg-neutral-800">
                        <Inbox size={32} className="text-slate-400" />
                      </div>
                      <p className="text-sm font-medium">No loadouts found</p>
                      <p className="text-xs text-slate-400">
                        Create a new loadout or adjust your filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {loadingList && (
                <tr>
                  <td colSpan={10} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
                      <Loader2
                        size={32}
                        className="animate-spin text-[#0446DB]"
                      />
                      <p className="text-sm font-medium">Loading loadouts...</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ======================= PAGINATION FOOTER ======================= */}
        <div className="flex shrink-0 flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 dark:border-neutral-800 sm:flex-row">
          <div className="text-[11px] text-slate-500 sm:text-xs">
            Showing{" "}
            <span className="font-medium text-slate-900 dark:text-white">
              {filteredLoadouts.length === 0
                ? 0
                : (currentPage - 1) * rowsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-slate-900 dark:text-white">
              {Math.min(currentPage * rowsPerPage, filteredLoadouts.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-900 dark:text-white">
              {filteredLoadouts.length}
            </span>{" "}
            loadouts
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex h-8 items-center justify-center rounded-sm border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-300 dark:hover:bg-neutral-700"
            >
              Previous
            </button>

            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 5) return true;
                  if (p === 1 || p === totalPages) return true;
                  if (p >= currentPage - 1 && p <= currentPage + 1) return true;
                  return false;
                })
                .map((p, i, arr) => {
                  const showDots = i > 0 && p - arr[i - 1] > 1;
                  return (
                    <div key={p} className="flex items-center">
                      {showDots && (
                        <span className="px-1 text-xs text-slate-400">...</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setCurrentPage(p)}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-sm text-xs font-medium transition-colors cursor-pointer ${
                          currentPage === p
                            ? "bg-[#0446DB] text-white"
                            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-neutral-800"
                        }`}
                      >
                        {p}
                      </button>
                    </div>
                  );
                })}
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="inline-flex h-8 items-center justify-center rounded-sm border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-300 dark:hover:bg-neutral-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ================= DETAILS MODAL ================= */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Loadout details"
            className="flex h-[95dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:h-auto sm:max-h-[92dvh] sm:rounded-sm dark:bg-neutral-900"
          >
            <div className="flex shrink-0 items-start justify-between gap-2 border-b border-slate-200 px-3 py-3 dark:border-neutral-800 sm:px-4">
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold sm:text-lg">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selected.loadout_code)}
                    className="group flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer text-left"
                    title="Click to copy"
                  >
                    <span className="truncate">{selected.loadout_code}</span>
                    <Copy
                      size={16}
                      className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                </h2>
                <p className="mt-0.5 truncate text-[11px] text-slate-500 sm:text-xs">
                  {selected.loadout_type?.toUpperCase()} ·{" "}
                  {selected.status?.toUpperCase()} · Source:{" "}
                  {selected.source_hub_city || "-"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close details"
                className="shrink-0 rounded p-2 hover:bg-slate-100 dark:hover:bg-neutral-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 pb-24 sm:gap-4 sm:p-4 sm:pb-4">
              <div className="flex flex-wrap gap-2 text-xs sm:gap-3 sm:text-sm">
                <span className="rounded-sm bg-blue-50 px-2.5 py-1.5 text-blue-700">
                  Accepted: {accepted}
                </span>
                <span className="rounded-sm bg-orange-50 px-2.5 py-1.5 text-orange-700">
                  Rejected: {rejected}
                </span>
                <span className="rounded-sm bg-slate-100 px-2.5 py-1.5 text-slate-700">
                  Total: {selected.orders?.length ?? 0}
                </span>
                {selected.closed_at && (
                  <span className="rounded-sm bg-slate-100 px-2.5 py-1.5 text-slate-700">
                    Closed: {formatDate(selected.closed_at)}
                  </span>
                )}
              </div>

              {/* 🔒 PERM — scan form only if canManage */}
              {selected.status === "open" && canManage && (
                <form
                  onSubmit={(e) => void scanAwb(e)}
                  className="flex flex-col gap-2 sm:flex-row"
                >
                  <input
                    ref={scanInputRef}
                    value={awb}
                    onChange={(e) => setAwb(e.target.value)}
                    placeholder={
                      scanning ? "Scanning…" : "Scan or enter AWB number"
                    }
                    autoComplete="off"
                    disabled={scanning}
                    className="h-11 p-4 min-w-0 flex-1 rounded-sm border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0446DB] disabled:bg-slate-50 disabled:text-slate-400 dark:border-neutral-700 dark:bg-neutral-800"
                  />
                  <button
                    disabled={scanning || !awb.trim()}
                    type="submit"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {scanning && <Loader2 size={16} className="animate-spin" />}
                    Scan AWB
                  </button>
                </form>
              )}

              {/* ====== ORDERS: mobile cards ====== */}
              <div className="space-y-2 md:hidden">
                {paginatedOrders.map((o) => (
                  <div
                    key={o.id ?? o.awb_number}
                    className="rounded-lg border border-slate-200 p-3 text-xs dark:border-neutral-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{o.awb_number}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          o.scan_status === "accepted"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {o.scan_status}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-slate-600 dark:text-slate-300">
                      <div>
                        <span className="text-slate-400">Order: </span>
                        {o.order_id ?? "-"}
                      </div>
                      {selected.loadout_type === "forward" ? (
                        <>
                          <div>
                            <span className="text-slate-400">Status: </span>
                            {o.status ?? "-"}
                          </div>
                          <div>
                            <span className="text-slate-400">Stage: </span>
                            {o.pickup_stage ?? "-"}
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <span className="text-slate-400">Prev: </span>
                            {o.previous_status ?? "-"}
                          </div>
                          <div>
                            <span className="text-slate-400">Status: </span>
                            {o.status ?? "-"}
                          </div>
                          <div>
                            <span className="text-slate-400">Submit: </span>
                            {o.submit_stage ?? "-"}
                          </div>
                        </>
                      )}
                      <div className="col-span-2">
                        <span className="text-slate-400">Reason: </span>
                        {o.rejection_reason || "-"}
                      </div>
                    </div>
                  </div>
                ))}
                {(selected.orders ?? []).length === 0 && (
                  <div className="flex flex-col items-center justify-center gap-2 py-8 text-slate-500">
                    <Inbox size={24} className="text-slate-300" />
                    <span className="text-sm">No AWBs scanned yet</span>
                  </div>
                )}
              </div>

              {/* ====== ORDERS: desktop table ====== */}
              <div className="hidden overflow-x-auto rounded-sm border border-slate-200 md:block dark:border-neutral-800">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-neutral-800">
                    <tr>
                      <th className="px-3 py-3">AWB Number</th>
                      <th className="px-3 py-3">Order ID</th>
                      <th className="px-3 py-3">Scan Status</th>
                      <th className="px-3 py-3">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                    {paginatedOrders.map((o) => (
                      <tr key={o.id ?? o.awb_number}>
                        <td className="px-3 py-3 font-medium">
                          {o.awb_number}
                        </td>
                        <td className="px-3 py-3">{o.order_id ?? "-"}</td>
                        <td className="px-3 py-3">{o.scan_status}</td>
                        <td className="px-3 py-3">
                          {o.rejection_reason || "-"}
                        </td>
                      </tr>
                    ))}
                    {(selected.orders ?? []).length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                            <Inbox size={24} className="text-slate-300" />
                            <span className="text-sm">No AWBs scanned yet</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalOrders > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-neutral-800">
                  <span className="text-[11px] text-slate-500">
                    Showing {(ordersPage - 1) * ordersPerPage + 1} to{" "}
                    {Math.min(ordersPage * ordersPerPage, totalOrders)} of{" "}
                    {totalOrders} AWBs
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                      disabled={ordersPage === 1}
                      className="h-7 px-2 rounded-sm border border-slate-200 text-xs disabled:opacity-50 hover:bg-slate-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    >
                      Prev
                    </button>
                    <span className="h-7 px-2 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300">
                      {ordersPage} / {totalOrderPages}
                    </span>
                    <button
                      onClick={() =>
                        setOrdersPage((p) => Math.min(totalOrderPages, p + 1))
                      }
                      disabled={ordersPage === totalOrderPages}
                      className="h-7 px-2 rounded-sm border border-slate-200 text-xs disabled:opacity-50 hover:bg-slate-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* 🔒 PERM — reverse completion only if canManage */}
              {canManage &&
                selected.loadout_type === "reverse" &&
                selected.status === "open" && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3 dark:border-neutral-800 dark:bg-neutral-900/50 sm:p-4">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0446DB]/10 text-[#0446DB]">
                        <Upload size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                          Reverse Completion
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Upload CSV, validate, then attach proof PDF to
                          finalize.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {/* ---- STEP 1: AWB CSV ---- */}
                      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        {/* Title & Download Button Row */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0446DB] text-[10px] font-bold text-white">
                              1
                            </span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                              AWB CSV <span className="text-red-500">*</span>
                            </span>
                            {csvValidation && (
                              <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                                <CheckCircle2 size={10} /> Validated
                              </span>
                            )}
                          </div>

                          {/* Modern Download Button */}
                          <button
                            type="button"
                            onClick={() => void downloadSampleCsv()}
                            className="group inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:bg-[#0446DB]/10 hover:text-[#0446DB] dark:bg-neutral-800 dark:text-slate-300 dark:hover:bg-[#0446DB]/20 dark:hover:text-[#0446DB] cursor-pointer"
                            title="Download Sample CSV"
                          >
                            <Download
                              size={12}
                              className="transition-transform group-hover:-translate-y-0.5"
                            />
                            <span className="hidden sm:inline">Sample CSV</span>
                            <span className="sm:hidden">Sample</span>
                          </button>
                        </div>

                        {/* File picker styled as dropzone */}
                        <label
                          htmlFor="reverse-awb-csv"
                          className="relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-slate-300 bg-slate-50 py-4 text-center transition hover:border-[#0446DB] hover:bg-blue-50/40 dark:border-neutral-700 dark:bg-neutral-800/50 dark:hover:border-[#0446DB]"
                        >
                        
                          {csvFile && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setCsvFile(null);
                                setCsvValidation(null);
                                toast.info("CSV file removed");
                              }}
                              className="absolute right-2 top-2 z-10 rounded-full bg-red-50 p-1 text-red-500 hover:bg-red-100 hover:text-red-600 dark:bg-red-950/50 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
                              title="Remove CSV"
                            >
                              <X size={14} />
                            </button>
                          )}

                          <FileText size={18} className="text-slate-400" />
                          
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                            {csvFile ? "Change CSV" : "Choose CSV file"}
                          </span>
                          
                          <span className="text-[10px] text-slate-400">
                            .csv · max 10 MB
                          </span>
                          
                          <input
                            id="reverse-awb-csv"
                            type="file"
                            accept=".csv,text/csv"
                            onChange={(e) => {
                              setCsvFile(e.target.files?.[0] || null);
                              setCsvValidation(null);
                            }}
                            className="hidden"
                          />
                        </label>

                        {csvFile && (
                          <div className="flex items-center gap-2 rounded-md bg-slate-50 px-2 py-1.5 text-[11px] text-slate-600 dark:bg-neutral-800 dark:text-slate-300">
                            <FileText
                              size={12}
                              className="shrink-0 text-slate-400"
                            />
                            <span className="truncate">{csvFile.name}</span>
                            <span className="ml-auto shrink-0 text-slate-400">
                              {(csvFile.size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => void validateReverseCsv()}
                          disabled={validatingCsv || !csvFile}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#0446DB] px-3 text-xs font-medium text-white transition hover:bg-[#0438b1] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-neutral-700"
                        >
                          {validatingCsv ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}
                          {validatingCsv ? "Validating…" : "Validate CSV"}
                        </button>

                        {csvValidation && (
                          <div className="rounded-md border border-blue-100 bg-blue-50 p-2.5 text-xs text-blue-800 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-200">
                            {csvValidation && (
                              <div className="rounded-md border border-blue-100 bg-blue-50 p-2.5 text-xs text-blue-800 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-200">
                                <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
                                  Validation Result
                                </div>
                                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-blue-600/80 dark:text-blue-300/80">
                                      CSV AWBs
                                    </span>
                                    <span className="font-semibold">
                                      {csvValidation.csv_awb_count}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-blue-600/80 dark:text-blue-300/80">
                                      Total
                                    </span>
                                    <span className="font-semibold">
                                      {csvValidation.total_loadout_shipments}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-emerald-600">
                                      Delivered
                                    </span>
                                    <span className="font-semibold text-emerald-700">
                                      {
                                        csvValidation.projected_rto_delivered_count
                                      }
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-orange-600">
                                      Undelivered
                                    </span>
                                    <span className="font-semibold text-orange-700">
                                      {
                                        csvValidation.projected_rto_undelivered_count
                                      }
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* STEP 2: Proof PDF + Proof CSV */}
                      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        {/* Heading */}
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0446DB] text-[10px] font-bold text-white">
                            2
                          </span>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                            Proof PDF & CSV{" "}
                            <span className="text-red-500">*</span>
                          </span>
                        </div>

                        {/* ---- Proof PDF ---- */}
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                            Proof PDF <span className="text-red-500">*</span>
                          </label>

                          <label
                            htmlFor="reverse-proof-pdf"
                            className="relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-slate-300 bg-slate-50 py-4 text-center transition hover:border-[#0446DB] hover:bg-blue-50/50 dark:border-neutral-700 dark:bg-neutral-800/50"
                          >
                            {proofPdf && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setProofPdf(null);
                                  toast.info("PDF file removed");
                                }}
                                className="absolute right-2 top-2 z-10 rounded-full bg-red-50 p-1 text-red-500 hover:bg-red-100 hover:text-red-600 dark:bg-red-950/50 dark:hover:bg-red-900/50 cursor-pointer"
                                title="Remove PDF"
                              >
                                <X size={14} />
                              </button>
                            )}

                            <FileText size={18} className="text-slate-400" />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                              {proofPdf ? "Change PDF" : "Choose PDF File"}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              .pdf · max 10 MB
                            </span>

                            <input
                              id="reverse-proof-pdf"
                              type="file"
                              accept=".pdf,application/pdf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                if (file && file.size > 10 * 1024 * 1024) {
                                  toast.warn("PDF size must not exceed 10 MB.");
                                  e.target.value = "";
                                  return;
                                }
                                setProofPdf(file);
                                e.target.value = "";
                              }}
                            />
                          </label>

                          {proofPdf && (
                            <div className="flex items-center gap-2 rounded-md bg-slate-50 px-2 py-1.5 text-[11px] text-slate-600 dark:bg-neutral-800 dark:text-slate-300">
                              <FileText
                                size={14}
                                className="shrink-0 text-[#0446DB]"
                              />
                              <span className="min-w-0 flex-1 truncate">
                                {proofPdf.name}
                              </span>
                              <span className="shrink-0 text-slate-400">
                                {(proofPdf.size / 1024).toFixed(1)} KB
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setProofPdf(null);
                                  toast.info("PDF file removed");
                                }}
                                className="shrink-0 rounded-full p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/50 cursor-pointer"
                                title="Remove PDF"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* ---- Proof CSV (separate state!) ---- */}
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                            AWB CSV File <span className="text-red-500">*</span>
                          </label>

                          <label
                            htmlFor="reverse-proof-csv"
                            className="relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-slate-300 bg-slate-50 py-4 text-center transition hover:border-[#0446DB] hover:bg-blue-50/50 dark:border-neutral-700 dark:bg-neutral-800/50"
                          >
                            {proofCsv && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setProofCsv(null);
                                  setReverseResult(null);
                                  toast.info("CSV file removed");
                                }}
                                className="absolute right-2 top-2 z-10 rounded-full bg-red-50 p-1 text-red-500 hover:bg-red-100 hover:text-red-600 dark:bg-red-950/50 dark:hover:bg-red-900/50 cursor-pointer"
                                title="Remove CSV"
                              >
                                <X size={14} />
                              </button>
                            )}

                            <Upload size={18} className="text-slate-400" />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                              {proofCsv ? "Change CSV File" : "Choose CSV File"}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              .csv file
                            </span>

                            <input
                              id="reverse-proof-csv"
                              type="file"
                              accept=".csv,text/csv"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setProofCsv(file); // ✅ separate
                                setReverseResult(null);
                                e.target.value = "";
                              }}
                            />
                          </label>

                          {proofCsv && (
                            <div className="flex items-center gap-2 rounded-md bg-slate-50 px-2 py-1.5 text-[11px] text-slate-600 dark:bg-neutral-800 dark:text-slate-300">
                              <FileText
                                size={14}
                                className="shrink-0 text-[#0446DB]"
                              />
                              <span className="min-w-0 flex-1 truncate">
                                {proofCsv.name}
                              </span>
                              <span className="shrink-0 text-slate-400">
                                {(proofCsv.size / 1024).toFixed(1)} KB
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setProofCsv(null); // ✅ separate
                                  setReverseResult(null);
                                  toast.info("CSV file removed");
                                }}
                                className="shrink-0 rounded-full p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/50 cursor-pointer"
                                title="Remove CSV"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Complete Reverse */}
                        <button
                          type="button"
                          onClick={() => void completeReverse()}
                          disabled={
                            completingReverse ||
                            validatingCsv ||
                            !proofPdf ||
                            !proofCsv
                          }
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#0446DB] px-3 text-xs font-medium text-white transition hover:bg-[#0339b5] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-neutral-700"
                        >
                          {completingReverse ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}
                          {completingReverse
                            ? "Submitting..."
                            : "Complete Reverse"}
                        </button>

                        {/* Final Result */}
                        {reverseResult && (
                          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200">
                            <div className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide">
                              <CheckCircle2 size={12} />
                              Completed
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span>Total</span>
                                <span className="font-semibold">
                                  {reverseResult.total_shipments}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Delivered</span>
                                <span className="font-semibold">
                                  {reverseResult.rto_delivered_count}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Undelivered</span>
                                <span className="font-semibold">
                                  {reverseResult.rto_undelivered_count}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Webhook</span>
                                <span className="font-semibold">
                                  {reverseResult.webhook_dispatch_started ===
                                  true
                                    ? "Started"
                                    : reverseResult.webhook_dispatch_started ===
                                        false
                                      ? "Idle"
                                      : "—"}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              {selected.loadout_type === "reverse" &&
                selected.status === "closed" &&
                !reverseResult && (
                  <div className="rounded-sm border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                    <div className="flex items-center gap-2 font-semibold">
                      <CheckCircle2 size={14} /> Reverse loadout closed
                    </div>
                  </div>
                )}
            </div>

            {/* modal footer — desktop */}
            <div className="sticky bottom-0 hidden shrink-0 flex-wrap justify-end gap-2 border-t border-slate-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900 sm:flex sm:p-4">
              <button
                type="button"
                onClick={() => void downloadLoadoutPdf()}
                disabled={downloadingPdf}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-[#0446DB] px-4 py-2 text-sm font-medium text-[#0446DB] hover:bg-blue-50 disabled:opacity-50 dark:hover:bg-neutral-800"
              >
                {downloadingPdf ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
                {downloadingPdf ? "Generating PDF..." : "Download PDF"}
              </button>
              <button
                type="button"
                onClick={() => void fetchDetails(selected.id)}
                disabled={loadingDetails}
                className="inline-flex items-center gap-2 rounded-sm border border-slate-200 px-4 py-2 text-sm dark:border-neutral-700 cursor-pointer"
              >
                <RefreshCw
                  size={15}
                  className={loadingDetails ? "animate-spin" : ""}
                />{" "}
                Refresh
              </button>
              {/* 🔒 PERM — Close only if canManage */}
              {canManage &&
                selected.status === "open" &&
                selected.loadout_type === "forward" && (
                  <button
                    type="button"
                    onClick={() => void closeLoadout()}
                    disabled={closing || scanning || accepted === 0}
                    className="inline-flex items-center gap-2 rounded-sm bg-[#0446DB] px-4 py-2 text-sm font-medium text-white disabled:opacity-50 cursor-pointer"
                  >
                    {closing ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <RotateCcw size={16} />
                    )}
                    Close Loadout
                  </button>
                )}
            </div>
          </div>

          {/* MOBILE sticky action bar */}
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center sm:hidden">
            <div className="pointer-events-auto flex w-full max-w-5xl gap-2 border-t border-slate-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
              <button
                type="button"
                onClick={() => void downloadLoadoutPdf()}
                disabled={downloadingPdf}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-sm border border-[#0446DB] px-2 py-2.5 text-xs font-medium text-[#0446DB] disabled:opacity-50"
              >
                {downloadingPdf ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                PDF
              </button>
              <button
                type="button"
                onClick={() => void fetchDetails(selected.id)}
                disabled={loadingDetails}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm border border-slate-200 py-2.5 text-sm dark:border-neutral-700 cursor-pointer"
              >
                <RefreshCw
                  size={15}
                  className={loadingDetails ? "animate-spin" : ""}
                />{" "}
                Refresh
              </button>
              {/* 🔒 PERM — Close only if canManage */}
              {canManage &&
                selected.status === "open" &&
                selected.loadout_type === "forward" && (
                  <button
                    type="button"
                    onClick={() => void closeLoadout()}
                    disabled={closing || scanning || accepted === 0}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-[#0446DB] py-2.5 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {closing ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <RotateCcw size={16} />
                    )}
                    Close
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
