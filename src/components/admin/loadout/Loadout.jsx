

"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
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
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "react-toastify";
import AxiosInstance from "@/Helper/axiosInstance";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

const BASE = "/api/loadout";

// Inclusive 10-day default range in India Standard Time.
function todayIST() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const get = (type) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function shiftDate(date, days) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function defaultLoadoutDates() {
  const end = todayIST();
  return { start_date: shiftDate(end, -9), end_date: end };
}


/* ============================ HELPERS ============================ */
function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString("en-IN");
}

function errorMessage(error) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.response?.data?.code || error.message;
  }
  return error instanceof Error ? error.message : "Something went wrong";
}

const TABS = [
  { id: "forward", label: "Forward Loadout" },
  { id: "reverse", label: "Reverse Loadout" },
];

/* ============================ MAIN ============================ */
export default function DcLoadout() {
  const scanInputRef = useRef(null);

  /* ---- shared list / UI ---- */
  const [activeTab, setActiveTab] = useState("forward");
  const [search, setSearch] = useState("");
  const [loadouts, setLoadouts] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [dcs, setDcs] = useState([]);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(() => ({
    ...defaultLoadoutDates(),
    city: "",
    code: "",
  }));
  const [filtersVersion, setFiltersVersion] = useState(0);

  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [awb, setAwb] = useState("");
  const [scanning, setScanning] = useState(false);
  const [closing, setClosing] = useState(false);
  const [validatingCsv, setValidatingCsv] = useState(false);
  const [completingReverse, setCompletingReverse] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [proofPdf, setProofPdf] = useState(null);
  const [proofCsv, setProofCsv] = useState(null);
  const [csvValidation, setCsvValidation] = useState(null);
  const [reverseResult, setReverseResult] = useState(null);

  const [adminHubs, setAdminHubs] = useState([]);

  /* ---- vendors: forward only ---- */
  const [vendors, setVendors] = useState([]);

  /* ---- per-tab form state ---- */
  const [forwardSourceHubId, setForwardSourceHubId] = useState("");
  const [targetType, setTargetType] = useState("vendor");
  const [targetId, setTargetId] = useState("");
  const [reverseSourceHubId, setReverseSourceHubId] = useState("");

  /* ---- Pagination State (List) ---- */
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  /* ---- Pagination State (Modal Orders) ---- */
  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPerPage = 10;

  /* ======================= COPY LOADOUT CODE ======================= */
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Loadout Code copied!");
    } catch (err) {
      toast.error("Failed to copy code.");
    }
  };

  /* ======================= DOWNLOAD SAMPLE CSV ======================= */
  const downloadSampleCsv = async () => {
    try {
      // Note: API endpoint as per your route
      const res = await AxiosInstance.get(`${BASE}/admin/sample-awb-csv`, {
        responseType: "blob",
      });
      
      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sample-awb.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Sample CSV downloaded successfully");
    } catch (error) {
      console.error("Download Error:", error);
      toast.error(errorMessage(error));
    }
  };
  /* ======================= FETCH ADMIN HUBS ======================= */
  const fetchAdminHubs = async () => {
    try {
      const res = await AxiosInstance.get(`${BASE}/admin/hubs`);
      const list = res.data?.data?.hubs ?? res.data?.data ?? [];
      setAdminHubs(Array.isArray(list) ? list : []);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  /* ======================= FETCH VENDORS ======================= */

  const fetchVendors = async () => {
    try {
      const res = await AxiosInstance.get(`${BASE}/admin/vendors`);
      const list = res.data?.data ?? [];

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
  // GET /api/loadout/admin/dcs
  const fetchDCs = async () => {
    try {
      const res = await AxiosInstance.get(`${BASE}/admin/dcs`);
      const list = res.data?.data?.dcs ?? res.data?.data ?? res.data ?? [];

      const mappedDcs = list
        .filter((d) => {
          if (d.is_active !== undefined) {
            return d.is_active === 1 || d.is_active === true || d.is_active === "1";
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
      const res = await AxiosInstance.get(`${BASE}/admin`, {
        params: {
          limit: 100,
          offset: 0,
          start_date: filters.start_date || undefined,
          end_date: filters.end_date || undefined,
          city: filters.city || undefined,
          code: filters.code || undefined,
        },
      });
      const payload = res.data?.data;
      const rows = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.loadouts)
          ? payload.loadouts
          : [];
      setLoadouts(rows);
    } catch (error) {
      setLoadouts([]);
      toast.error(errorMessage(error));
    } finally {
      setLoadingList(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchLoadouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersVersion]);

  /* Reset per-tab form state on tab switch */
  useEffect(() => {
    setSelected(null);
    setSearch("");
    setAwb("");
    setCsvFile(null);
    setProofPdf(null);
    setCsvValidation(null);
    setProofCsv(null);
    setReverseResult(null);
    setForwardSourceHubId("");
    setTargetType("vendor");
    setTargetId("");
    setReverseSourceHubId("");
    setCurrentPage(1);
  }, [activeTab]);

  /* ======================= CREATE FORWARD ======================= */
  const createForward = async () => {
    if (!forwardSourceHubId) {
      toast.warn("Please select a source hub.");
      return;
    }
    if (!targetType) {
      toast.warn("Please select a target type.");
      return;
    }
    if (!targetId) {
      toast.warn(
        targetType === "vendor" ? "Please select a target vendor." : "Please select a target DC.",
      );
      return;
    }

    const body = {
      loadout_type: "forward",
      source_hub_id: Number(forwardSourceHubId),
      target_type: targetType,
      target_id: Number(targetId),
    };

    setCreating(true);
    try {
      const res = await AxiosInstance.post(`${BASE}/admin`, body);
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
    if (!reverseSourceHubId) {
      toast.warn("Please select a source hub.");
      return;
    }

    const hub = adminHubs.find((h) => String(h.id) === String(reverseSourceHubId));
    if (!hub) {
      toast.error("Please select a valid admin hub for reverse load-out.");
      return;
    }

    const body = {
      loadout_type: "reverse",
      source_hub_id: Number(reverseSourceHubId),
    };

    setCreating(true);
    try {
      const res = await AxiosInstance.post(`${BASE}/admin`, body);
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
  const fetchDetails = async (loadoutId) => {
    setLoadingDetails(true);
    try {
      const res = await AxiosInstance.get(`${BASE}/admin/${loadoutId}`);
      if (!res.data?.success || !res.data?.data) {
        throw new Error(res.data?.message || "Loadout details unavailable");
      }
      setSelected(res.data.data);
      setAwb("");
      setCsvFile(null);
      setProofPdf(null);
      setCsvValidation(null);
      setReverseResult(null);
      setOrdersPage(1); // Reset orders pagination on fetch
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoadingDetails(false);
    }
  };

  /* ======================= SCAN ======================= */
  const scanAwb = async (e) => {
    e?.preventDefault?.();
    if (!selected || selected.status !== "open" || scanning) return;

    const awbNumber = awb.trim();
    if (!awbNumber) {
      toast.warn("Please enter or scan an AWB number.");
      return;
    }

    setScanning(true);
    try {
      const res = await AxiosInstance.post(`${BASE}/admin/${selected.id}/scan`, {
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
      const status = error?.response?.status;
      const code = error?.response?.data?.code;
      const msg = error?.response?.data?.message || errorMessage(error);
      toast.error(status === 409 ? `Duplicate scan: ${msg}` : code ? `[${code}] ${msg}` : msg);
    } finally {
      setAwb("");
      await Promise.all([fetchDetails(selected.id), fetchLoadouts()]);
      setScanning(false);
      requestAnimationFrame(() => scanInputRef.current?.focus());
    }
  };

  /* ======================= CLOSE FORWARD ======================= */
  const closeLoadout = async () => {
    if (!selected || selected.status !== "open" || closing) return;
    if (selected.loadout_type !== "forward") {
      toast.error("Only forward load-outs can be closed.");
      return;
    }
    const acceptedCount =
      selected.accepted_count ??
      selected.orders?.filter((o) => o.scan_status === "accepted").length ??
      0;
    if (acceptedCount === 0) {
      toast.warn("At least one shipment must be accepted before closing the loadout.");
      return;
    }
    if (!window.confirm(`Close loadout ${selected.loadout_code}? You won't be able to scan more.`))
      return;

    setClosing(true);
    try {
      const res = await AxiosInstance.post(`${BASE}/admin/${selected.id}/close`);
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to close loadout");
      }
      toast.success(
        res.data?.message ||
          `Load-out closed successfully (accepted: ${res.data?.data?.accepted_count ?? 0})`,
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
    if (!csvFile) {
      toast.warn("Please choose a CSV file.");
      return;
    }
    setValidatingCsv(true);
    try {
      const formData = new FormData();
      formData.append("awb_csv", csvFile);
      const res = await AxiosInstance.post(
        `${BASE}/admin/${selected.id}/validate-reverse-csv`,
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
    if (!proofPdf) {
      toast.warn("Please attach a proof PDF.");
      return;
    }
    if (!proofCsv) {
      toast.warn("Please attach the AWB CSV.");
      return;
    }
  

    setCompletingReverse(true);
    try {
      const formData = new FormData();
      formData.append("proof_pdf", proofPdf);
      formData.append("awb_csv", proofCsv);
      const res = await AxiosInstance.post(
        `${BASE}/admin/${selected.id}/complete-reverse`,
        formData,
      );
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to complete reverse loadout");
      }
      setReverseResult(res.data.data);
      toast.success(res.data?.message || "Reverse load-out proof submitted successfully");
      await Promise.all([fetchDetails(selected.id), fetchLoadouts()]);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setCompletingReverse(false);
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
          label: `${v?.id}. ${v.vendor_name}${v.company_name ? ` (${v.company_name})` : ""}${v.city ? ` - ${v.city}` : ""}`,
        }))
      : dcs.map((d, i) => ({
          id: d.id,
          label: `${d?.id}. ${d.dc_name}${d.dc_code ? ` (${d.dc_code})` : ""}${d.city ? ` - ${d.city}` : ""}`,
        }));
  const canCreateForward = !!forwardSourceHubId && !!targetType && !!targetId;
  const canCreateReverse = !!reverseSourceHubId;

  /* ======================= PAGINATION LOGIC ======================= */
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search, filtersVersion]);

  const totalPages = Math.ceil(filteredLoadouts.length / rowsPerPage) || 1;
  const paginatedLoadouts = filteredLoadouts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  /* ---- Orders Pagination Logic ---- */
  const totalOrders = selected?.orders?.length ?? 0;
  const totalOrderPages = Math.ceil(totalOrders / ordersPerPage) || 1;
  const paginatedOrders = (selected?.orders ?? []).slice(
    (ordersPage - 1) * ordersPerPage,
    ordersPage * ordersPerPage,
  );

  /* ======================= RENDER ======================= */
  return (
    <div className="flex min-h-[calc(100dvh-100px)] flex-col gap-3 bg-[#F7F8FA] p-3 text-slate-900 sm:gap-4 sm:p-0 dark:bg-neutral-950 dark:text-white">
      {/* header */}
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
              <label className="flex w-full flex-col gap-1 text-xs font-medium text-slate-600 lg:w-[260px] dark:text-slate-300">
                Source Hub
                <select
                 onClick={fetchAdminHubs}
                  value={forwardSourceHubId}
                  onChange={(e) => setForwardSourceHubId(e.target.value)}
                  className="h-10 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                >
                  <option value="">Select Source Hub</option>
                  {adminHubs.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.id}: {h.hub_name} ({h.hub_code})
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex w-full flex-col gap-1 text-xs font-medium text-slate-600 lg:w-[160px] dark:text-slate-300">
                Target Type
                <select
                  value={targetType}
                  onChange={(e) => {
                    setTargetType(e.target.value);
                    setTargetId("");
                  }}
                  className="h-10 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                >
                  <option value="vendor">Vendor</option>
                  <option value="dc">DC</option>
                </select>
              </label>

              <label className="flex w-full flex-col gap-1 text-xs font-medium text-slate-600 lg:w-[280px] dark:text-slate-300">
                Target
                <select
                  value={targetId}
                  onClick={()=>{
                    if(targetType === "vendor"){
                      fetchVendors()
                    }else{
                      fetchDCs()
                    }
                  }}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="h-10 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                >
                  <option value="">Select {targetType === "vendor" ? "vendor" : "DC"}</option>
                  {targetOptions.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={() => void createForward()}
                disabled={creating || !canCreateForward}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-[#0339b5] disabled:opacity-50 sm:col-span-2 lg:w-auto cursor-pointer"
              >
                {creating ? <Loader2 size={16} className="animate-spin" /> : <Package size={16} />}
                Create Loadout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
              <label className="flex w-full flex-col gap-1 text-xs font-medium text-slate-600 lg:w-[280px] dark:text-slate-300">
                Source Hub
                <select
                  onClick={fetchAdminHubs}
                  value={reverseSourceHubId}
                  onChange={(e) => setReverseSourceHubId(e.target.value)}
                  className="h-10 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                >
                  <option value="">Select Source Hub</option>
                  {adminHubs.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.id}: {h.hub_name} ({h.hub_code})
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={() => void createReverse()}
                disabled={creating || !canCreateReverse}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-[#0339b5] disabled:opacity-50 sm:col-span-2 lg:w-auto"
              >
                {creating ? <Loader2 size={16} className="animate-spin" /> : <Package size={16} />}
                Create Reverse Loadout
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-sm border border-slate-200 px-3 text-xs dark:border-neutral-700 sm:text-sm cursor-pointer"
            >
              <Filter size={16} /> Filters{" "}
              {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <button
              type="button"
              onClick={() => void fetchLoadouts()}
              disabled={loadingList}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-sm border border-slate-200 px-3 text-xs dark:border-neutral-700 sm:text-sm cursor-pointer"
            >
              <RefreshCw size={16} className={loadingList ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
        </div>

        {/* Filters drawer - UI only; original filter state and API params preserved */}
        <Drawer open={showFilters} onOpenChange={setShowFilters} direction="right">
          <DrawerContent className="h-full w-full max-w-full rounded-none sm:max-w-md">
            <DrawerHeader className="shrink-0 border-b border-slate-200 text-left dark:border-neutral-800">
              <DrawerTitle className="flex items-center gap-2 text-base">
                <Filter size={18} className="text-[#0446DB]" /> Loadout Filters
              </DrawerTitle>
            </DrawerHeader>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5">
              <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                Start Date
                <input
                  type="date"
                  value={filters.start_date}
                  max={todayIST()}
                  onChange={(e) => {
                    const next = e.target.value;
                    if (!next || next > todayIST()) return;
                    setFilters((f) => {
                      const end = f.end_date < next ? next : f.end_date;
                      return { ...f, start_date: next, end_date: end };
                    });
                  }}
                  onClick={(e) => { try { e.currentTarget.showPicker?.(); } catch {} }}
                  className="h-10 w-full cursor-pointer rounded-sm border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                End Date
                <input
                  type="date"
                  value={filters.end_date}
                  min={filters.start_date}
                  max={todayIST()}
                  onChange={(e) => {
                    const next = e.target.value;
                    if (!next || next < filters.start_date || next > todayIST()) return;
                    setFilters((f) => ({ ...f, end_date: next }));
                  }}
                  onClick={(e) => { try { e.currentTarget.showPicker?.(); } catch {} }}
                  className="h-10 w-full cursor-pointer rounded-sm border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                City
                <input
                  value={filters.city}
                  onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
                  placeholder="e.g. Mumbai"
                  className="h-10 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                Loadout Code
                <input
                  value={filters.code}
                  onChange={(e) => setFilters((f) => ({ ...f, code: e.target.value }))}
                  placeholder="e.g. LO-"
                  className="h-10 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800"
                />
              </label>
            </div>
            <DrawerFooter className="shrink-0 border-t border-slate-200 dark:border-neutral-800">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFilters({ ...defaultLoadoutDates(), city: "", code: "" });
                    setFiltersVersion((v) => v + 1);
                    setShowFilters(false);
                  }}
                  className="h-10 rounded-sm border border-slate-200 px-3 text-sm dark:border-neutral-700 cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFiltersVersion((v) => v + 1);
                    setShowFilters(false);
                  }}
                  className="h-10 rounded-sm bg-[#0446DB] px-3 text-sm font-medium text-white cursor-pointer"
                >
                  Apply
                </button>
              </div>
              <DrawerClose asChild>
                <button type="button" className="h-9 rounded-sm border border-slate-200 text-sm dark:border-neutral-700">Cancel</button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* search */}
        <div className="shrink-0 border-b border-slate-100 p-3 dark:border-neutral-800 sm:p-4">
          <div className="relative w-full sm:max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                    <div className="truncate font-semibold text-[#0446DB]">{item.loadout_code}</div>
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
                  <div className="font-semibold">{item.accepted_count ?? 0}</div>
                </div>
                <div className="rounded bg-orange-50 py-1 text-orange-700">
                  <div>Rejected</div>
                  <div className="font-semibold">{item.rejected_count ?? 0}</div>
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

          {/* --- Mobile Loading & Empty State --- */}
          {!loadingList && filteredLoadouts.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
              <div className="rounded-full bg-slate-100 p-4 dark:bg-neutral-800">
                <Inbox size={32} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium">No loadouts found</p>
              <p className="text-xs text-slate-400">Create a new loadout or adjust your filters.</p>
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
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800/50">
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
                      <MapPin size={12} className="text-slate-400" /> {item.source_hub_city || "-"}
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
                  <td className="px-4 py-3 text-xs">{formatDate(item.created_at)}</td>
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

              {/* --- Desktop Loading & Empty State --- */}
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
                      <Loader2 size={32} className="animate-spin text-[#0446DB]" />
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
              {filteredLoadouts.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}
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
                      {showDots && <span className="px-1 text-xs text-slate-400">...</span>}
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
            {/* modal header */}
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
                  {selected.loadout_type?.toUpperCase()} | {selected.status?.toUpperCase()} |{" "}
                  <span className="">Source</span>: {selected.source_hub_city || "-"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close details"
                className="shrink-0 rounded p-2 hover:bg-slate-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 pb-24 sm:gap-4 sm:p-4 sm:pb-4">
              {/* summary chips */}
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

              {/* scan form */}
              {selected.status === "open" && (
                <form onSubmit={(e) => void scanAwb(e)} className="flex flex-col gap-2 sm:flex-row">
                  <input
                    ref={scanInputRef}
                    value={awb}
                    onChange={(e) => setAwb(e.target.value)}
                    placeholder={scanning ? "Scanning…" : "Scan or enter AWB number"}
                    autoComplete="off"
                    disabled={scanning}
                    className="h-11 min-w-0 p-4 flex-1 rounded-sm border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0446DB] disabled:bg-slate-50 disabled:text-slate-400 dark:border-neutral-700 dark:bg-neutral-800"
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

                      <div className="col-span-2">
                        <span className="text-slate-400">Reason: </span>
                        {o.rejection_reason || "-"}
                      </div>
                    </div>
                  </div>
                ))}
                {/* Mobile Empty state for orders */}
                {(selected.orders ?? []).length === 0 && (
                  <div className="flex flex-col items-center justify-center gap-2 py-8 text-slate-500">
                    <Inbox size={24} className="text-slate-300" />
                    <span className="text-sm">No AWBs scanned yet</span>
                  </div>
                )}
              </div>

              {/* ====== ORDERS: desktop table ====== */}
              
{/* ====== ORDERS: desktop table ====== */}
<div className="hidden w-full min-w-0 shrink-0 overflow-hidden rounded-sm border border-slate-200 md:block dark:border-neutral-800">
  <div className="max-h-[40vh] overflow-auto overscroll-contain">
    <table className="w-full min-w-[800px] text-left text-sm">
      <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase text-slate-500 dark:bg-neutral-800">
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
            <td className="px-3 py-3">
              {o.order_id ?? "-"}
            </td>
            <td className="px-3 py-3">
              {o.scan_status}
            </td>
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
                <span className="text-sm">
                  No AWBs scanned yet
                </span>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>


              {/* ---- Orders Pagination (Inside Modal) ---- */}
              {totalOrders > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-neutral-800">
                  <span className="text-[11px] text-slate-500">
                    Showing {(ordersPage - 1) * ordersPerPage + 1} to{" "}
                    {Math.min(ordersPage * ordersPerPage, totalOrders)} of {totalOrders} AWBs
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
                      onClick={() => setOrdersPage((p) => Math.min(totalOrderPages, p + 1))}
                      disabled={ordersPage === totalOrderPages}
                      className="h-7 px-2 rounded-sm border border-slate-200 text-xs disabled:opacity-50 hover:bg-slate-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* reverse actions */}
              {selected.loadout_type === "reverse" && selected.status === "open" && (
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
                        Upload CSV, validate, then attach proof PDF to finalize.
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
                          <FileText size={12} className="shrink-0 text-slate-400" />
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
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#0446DB] px-3 text-xs font-medium text-white transition hover:bg-[#0538ad] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-neutral-700"
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
                                  <span className="text-emerald-600">Delivered</span>
                                  <span className="font-semibold text-emerald-700">
                                    {csvValidation.projected_rto_delivered_count}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-orange-600">Undelivered</span>
                                  <span className="font-semibold text-orange-700">
                                    {csvValidation.projected_rto_undelivered_count}
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
      Proof PDF & CSV <span className="text-red-500">*</span>
    </span>
  </div>

  {/* ---------- STEP 1: Proof PDF ---------- */}
  {!proofPdf ? (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
        Proof PDF <span className="text-red-500">*</span>
      </label>

      <label
        htmlFor="reverse-proof-pdf"
        className="relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-slate-300 bg-slate-50 py-4 text-center transition hover:border-[#0446DB] hover:bg-blue-50/50 dark:border-neutral-700 dark:bg-neutral-800/50"
      >
        <FileText size={18} className="text-slate-400" />
        <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
          Choose PDF File
        </span>
        <span className="text-[10px] text-slate-400">.pdf · max 10 MB</span>

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
    </div>
  ) : (
    /* PDF locked summary — lets user remove and re-upload */
    <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-[11px] text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
      <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
      <span className="min-w-0 flex-1 truncate">{proofPdf.name}</span>
      <span className="shrink-0 text-emerald-600/70">
        {(proofPdf.size / 1024).toFixed(1)} KB
      </span>
      <button
        type="button"
        onClick={() => {
          setProofPdf(null);
          setProofCsv(null);
          setReverseResult(null);
          toast.info("PDF removed — please upload again");
        }}
        className="shrink-0 rounded-full p-0.5 text-emerald-600 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/50 cursor-pointer"
        title="Remove PDF"
      >
        <X size={12} />
      </button>
    </div>
  )}

  {/* ---------- STEP 2: CSV (only after PDF) ---------- */}
  {proofPdf && (
    <>
      {!proofCsv ? (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            AWB CSV File <span className="text-red-500">*</span>
          </label>

          <label
            htmlFor="reverse-proof-csv"
            className="relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-slate-300 bg-slate-50 py-4 text-center transition hover:border-[#0446DB] hover:bg-blue-50/50 dark:border-neutral-700 dark:bg-neutral-800/50"
          >
            <Upload size={18} className="text-slate-400" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
              Choose CSV File
            </span>
            <span className="text-[10px] text-slate-400">.csv file</span>

            <input
              id="reverse-proof-csv"
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setProofCsv(file);
                setReverseResult(null);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      ) : (
        /* CSV locked summary */
        <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-[11px] text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
          <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
          <span className="min-w-0 flex-1 truncate">{proofCsv.name}</span>
          <span className="shrink-0 text-emerald-600/70">
            {(proofCsv.size / 1024).toFixed(1)} KB
          </span>
          <button
            type="button"
            onClick={() => {
              setProofCsv(null);
              setReverseResult(null);
              toast.info("CSV removed");
            }}
            className="shrink-0 rounded-full p-0.5 text-emerald-600 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/50 cursor-pointer"
            title="Remove CSV"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </>
  )}

  {/* ---------- STEP 3: Submit button (only after PDF + CSV) ---------- */}
  {proofPdf && proofCsv && (
    <button
      type="button"
      onClick={() => void completeReverse()}
      disabled={completingReverse}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#0446DB] px-3 text-xs font-medium text-white transition hover:bg-[#0339b5] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-neutral-700"
    >
      {completingReverse ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <CheckCircle2 size={14} />
      )}
      {completingReverse ? "Submitting..." : "Complete Reverse"}
    </button>
  )}

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
          <span className="font-semibold">{reverseResult.total_shipments}</span>
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
            {reverseResult.webhook_dispatch_started === true
              ? "Started"
              : reverseResult.webhook_dispatch_started === false
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

             

             {selected?.loadout_type === "reverse" &&
  selected?.status === "closed" &&
  !reverseResult && (
    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 space-y-3">

      {/* Success Message */}
      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
        <CheckCircle2 size={18} className="text-emerald-600" />
        Reverse Loadout Closed
      </div>

      <p className="text-xs text-emerald-700">
        This reverse loadout has been successfully closed.
        You can download the available documents below.
      </p>

      {/* Download Buttons */}
      {(selected?.proof_pdf_path || selected?.awb_csv_path) && (
        <div className="flex flex-wrap items-center gap-2 border-t border-emerald-200 pt-3">

          {/* Proof PDF */}
          {selected?.proof_pdf_path && (
            <a
              href={`https://go-admin.daakit.com/${selected.proof_pdf_path}`}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-blue-700 shadow-sm transition hover:border-blue-400 hover:bg-blue-50"
            >
              <FileText size={15} />
              Proof PDF
              <Download size={14} />
            </a>
          )}

          {/* AWB CSV */}
          {selected?.awb_csv_path && (
  <a
    href={`https://go-admin.daakit.com/${selected.awb_csv_path}`}
    download="awb_list.csv"
    className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-white px-3 py-2 text-xs font-medium text-emerald-700 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50"
  >
    <FileSpreadsheet size={15} />
    Download AWB CSV 
    <Download size={14} />
  </a>
)}

        </div>
      )}
    </div>
  )}
            </div>

            {/* modal footer — desktop */}
            <div className="sticky bottom-0 hidden shrink-0 flex-wrap justify-end gap-2 border-t border-slate-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900 sm:flex sm:p-4">
              <button
                type="button"
                onClick={() => void fetchDetails(selected.id)}
                disabled={loadingDetails}
                className="inline-flex items-center gap-2 rounded-sm border border-slate-200 px-4 py-2 text-sm dark:border-neutral-700 cursor-pointer"
              >
                <RefreshCw size={15} className={loadingDetails ? "animate-spin" : ""} /> Refresh
              </button>
              {selected.status === "open" && selected.loadout_type === "forward" && (
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
                onClick={() => void fetchDetails(selected.id)}
                disabled={loadingDetails}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm border border-slate-200 py-2.5 hover:bg-[#0446DB] hover:text-white text-sm dark:border-neutral-700 cursor-pointer"
              >
                <RefreshCw size={15} className={loadingDetails ? "animate-spin" : ""} /> Refresh
              </button>
              {selected.status === "open" && selected.loadout_type === "forward" && (
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
