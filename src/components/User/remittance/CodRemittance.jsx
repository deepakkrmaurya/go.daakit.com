
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AxiosInstance from "@/Helper/axiosInstance";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  Copy,
  Download,
  Eye,
  EyeOff,
  FileDown,
  FileSpreadsheet,
  Filter,
  Landmark,
  Loader2,
  LockKeyhole,
  RotateCcw,
  Search,
  ShieldCheck,
  Upload,
  Wallet,
  X,
  ExternalLink,
} from "lucide-react";

const frontEndURL = import.meta.env.VITE_FRONTEND_URL;

const PAGE_UNLOCK_KEY = "cod_remittance_unlocked_at";
const PAGE_UNLOCK_TIME = 5 * 60 * 1000;
const statuses = ["All", "Pending", "Initiated", "Adjusted", "Received"];
const initialFilters = () => {
  const today = new Date();
  const past = new Date();
  past.setMonth(past.getMonth() - 1);
  return {
    startDate: past.toISOString().split("T")[0],
    endDate: today.toISOString().split("T")[0],
    order_id: "",
    awbNumber: "",
    vendor_id: "",
    rider_id: "",
    dc_id: "",
  };
};
const currency = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(n || 0));
const dateIST = (v) => {
  if (!v) return "—";
  const date = new Date(v);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
};
const classes = {
  input:
    "h-10 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
  lightButton:
    "inline-flex h-9 items-center justify-center gap-2 rounded-sm border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0446DB] disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
  primaryButton:
    "inline-flex h-9 items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-4 text-xs font-semibold text-white transition hover:bg-[#0338b5] disabled:opacity-50",
};
const statusClass = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  initiated: "bg-blue-50 text-blue-700 ring-blue-200",
  adjusted: "bg-violet-50 text-violet-700 ring-violet-200",
  received: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

function StatusPill({ item }) {
  const status = String(item.status || "unknown").toLowerCase();
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusClass[status=='received'?'received': "pending"] || "bg-slate-100 text-slate-600 ring-slate-200"}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      <span>
        {Number(item.pending_reconciliation) === 1 ? "Pending Reconciliation" : status=='received' ? 'Received' : "Pending"}
      </span>
      {Number(item.pending_reconciliation) === 1 && item.aging != null && (
        <span className="rounded bg-white/80 px-1.5 py-0.5 text-[10px]">{item.aging}d</span>
      )}
    </span>
  );
}

export default function UserCODRemittances() {
  const navigate = useNavigate();
  const uploadRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [busyAction, setBusyAction] = useState("");
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [summary, setSummary] = useState({ pending: 0, initiated: 0, adjusted: 0, received: 0 });
  const [permissions, setPermissions] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [refreshTick, setRefreshTick] = useState(0);
  const [editItem, setEditItem] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [isPageUnlocked, setIsPageUnlocked] = useState(false);
  const [pagePassword, setPagePassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPagePassword, setShowPagePassword] = useState(false);

  const can = useCallback(
    (p) => permissions.includes(p) || permissions.includes("ADMIN_FULL_ACCESS"),
    [permissions],
  );
  const canView = can("REMITTANCE_VIEW");
  const totalAmount = useMemo(
    () => Object.values(summary).reduce((sum, x) => sum + Number(x || 0), 0),
    [summary],
  );
  const activeFilterCount = useMemo(
    () =>
      Object.entries(appliedFilters).filter(([key, value]) => {
        const defaults = initialFilters();
        return String(value || "") !== String(defaults[key] || "");
      }).length,
    [appliedFilters],
  );



  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await AxiosInstance.get("/api/user/getUserPermissions");
        const list = res.data?.data?.data;
        if (!Array.isArray(list)) throw new Error("Invalid permission response");
        if (cancelled) return;
        setPermissions(list);

        console.log('bsah')
        if (!list.includes("REMITTANCE_VIEW") && !list.includes("ADMIN_FULL_ACCESS")) {
          navigate("/unauthorized", { replace: true });
        }
      } catch (err) {
        if (!cancelled) {
          toast.error(err.response?.data?.message || "Unable to load permissions");
          navigate("/unauthorized", { replace: true });
        }
      } finally {
        if (!cancelled) setPermissionsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const fetchData = useCallback(async () => {
    if (!canView) return;
    setLoading(true);
    try {
      const res = await AxiosInstance.get("/api/user/cod-remittance", {
        params: {
          page,
          limit,
          start_date: appliedFilters.startDate,
          end_date: appliedFilters.endDate,
          order_id: appliedFilters.order_id,
          awb_number: appliedFilters.awbNumber,
          rider_id: appliedFilters.rider_id,
          vendor_id: appliedFilters.vendor_id,
          dc_id: appliedFilters.dc_id,
          status: selectedFilter === "All" ? "" : selectedFilter,
        },
      });
      setRows(Array.isArray(res.data?.data) ? res.data.data : []);
      setTotalPages(Math.max(1, Number(res.data?.pagination?.totalPages) || 1));
      const s = res.data?.overallStatusSummary || {};
      setSummary({
        pending: s.pending || 0,
        initiated: s.initiated || 0,
        adjusted: s.adjusted || 0,
        received: s.received || 0,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Unable to fetch remittances");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [canView, page, limit, appliedFilters, selectedFilter, refreshTick]);
  useEffect(() => {
    void fetchData();
  }, [fetchData]);

 

  const applyFilters = (e) => {
    e?.preventDefault();
    if (
      draftFilters.startDate &&
      draftFilters.endDate &&
      draftFilters.startDate > draftFilters.endDate
    ) {
      toast.error("Start date cannot be after end date.");
      return;
    }
    setPage(1);
    setAppliedFilters({ ...draftFilters });
    setIsFilterOpen(false);
  };
  const resetFilters = () => {
    const next = initialFilters();
    setDraftFilters(next);
    setAppliedFilters(next);
    setPage(1);
    setIsFilterOpen(false);
  };
  const updateDraft = (name, value) =>
    setDraftFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "startDate" && prev.endDate && value > prev.endDate ? { endDate: value } : {}),
      ...(name === "endDate" && prev.startDate && value < prev.startDate
        ? { startDate: value }
        : {}),
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editItem || !can("REMITTANCE_UPDATE")) return;
    setBusyAction("update");
    try {
      await AxiosInstance.post(`/api/user/updateCODRemittance/${editItem.order_id}`, {
        remarks,
        status: "received",
      });
      toast.success("Remittance updated successfully");
      setEditItem(null);
      setRemarks("");
      setRefreshTick((x) => x + 1);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Unable to update remittance");
    } finally {
      setBusyAction("");
    }
  };

  const uploadCSV = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusyAction("upload");
    try {
      const form = new FormData();
      form.append("file", file);
      await AxiosInstance.post("/api/user/uploadCODRemittance", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("File uploaded successfully");
      setRefreshTick((x) => x + 1);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to upload file");
    } finally {
      setBusyAction("");
      e.target.value = "";
    }
  };

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  };
  const exportCSV = async () => {
    setBusyAction("export");
    try {
      const res = await AxiosInstance.get("/api/user/exportCodRemittance", {
        params: {
          status: selectedFilter === "All" ? "" : selectedFilter,
          order_id: appliedFilters.order_id,
          awb_number: appliedFilters.awbNumber,
          rider_id: appliedFilters.rider_id,
          vendor_id: appliedFilters.vendor_id,
          start_date: appliedFilters.startDate,
          end_date: appliedFilters.endDate,
        },
        responseType: "blob",
      });
      downloadBlob(res.data, "cod_remittances.csv");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error exporting CSV");
    } finally {
      setBusyAction("");
    }
  };
  const sampleCSV = async () => {
    setBusyAction("sample");
    try {
      const res = await AxiosInstance.get("/api/user/downloadCODRemittanceSample", {
        responseType: "blob",
      });
      downloadBlob(res.data, "Cod_Sample.csv");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error downloading sample");
    } finally {
      setBusyAction("");
    }
  };
  const copyText = async (value) => {
    if (value == null || value === "") return;
    try {
      await navigator.clipboard.writeText(String(value));
      setCopySuccess(String(value));
      window.setTimeout(() => setCopySuccess((v) => (v === String(value) ? "" : v)), 1700);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  return (
    <>
      

      <div className="flex h-[calc(100dvh-80px)] min-h-0 w-full flex-col overflow-hidden bg-[#f6f8fc] dark:bg-slate-950">
        <header className="shrink-0 border-b  dark:border-slate-800 dark:bg-slate-900 ">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  COD Remittances
                </h1>
                
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Monitor remittance settlements and reconciliation
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {can("REMITTANCE_VENDOR_SUBMISSIONS_VIEW") && (
                <Link to="/user/vendor-remittances" className={classes.lightButton}>
                  <Landmark size={15} /> Vendor Remittances
                </Link>
              )}
              {can("REMITTANCE_SAMPLE_DOWNLOAD") && (
                <button
                  type="button"
                  onClick={sampleCSV}
                  disabled={!!busyAction}
                  className={classes.lightButton}
                >
                  <FileDown size={15} /> Sample CSV
                </button>
              )}
              {can("REMITTANCE_COD_UPLOAD") && (
                <>
                  <input
                    ref={uploadRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={uploadCSV}
                  />
                  <button
                    type="button"
                    onClick={() => uploadRef.current?.click()}
                    disabled={!!busyAction}
                    className={classes.lightButton}
                  >
                    {busyAction === "upload" ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Upload size={15} />
                    )}{" "}
                    Upload CSV
                  </button>
                </>
              )}
              {can("REMITTANCE_EXPORT") && (
                <button
                  type="button"
                  onClick={exportCSV}
                  disabled={!!busyAction}
                  className={classes.lightButton}
                >
                  {busyAction === "export" ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Download size={15} />
                  )}{" "}
                  Export
                </button>
              )}
              <button
                type="button"
                onClick={() => setRefreshTick((x) => x + 1)}
                className={classes.lightButton}
              >
                <RotateCcw size={15} /> Refresh
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraftFilters({ ...appliedFilters });
                  setIsFilterOpen(true);
                }}
                className={classes.primaryButton}
              >
                <Filter size={15} /> Filters{" "}
                {activeFilterCount ? (
                  <span className="rounded bg-white/20 px-1.5">{activeFilterCount}</span>
                ) : null}
              </button>
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-3 py-2 dark:border-slate-800 sm:px-4">
              <div className="flex min-w-0 gap-1 overflow-x-auto py-1">
                {statuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setSelectedFilter(status);
                      setPage(1);
                    }}
                    className={`shrink-0 rounded-md border px-3 py-2 text-xs font-semibold transition ${selectedFilter === status ? "border-[#0446DB] bg-[#0446DB] text-white shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"}`}
                  >
                    {status} (
                    {currency(
                      status === "All" ? totalAmount : (summary[status.toLowerCase()] ?? 0),
                    )}
                    )
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs font-semibold text-[#0446DB] hover:underline"
                  >
                    Clear filters
                  </button>
                )}
                
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
              <table className="w-full min-w-[1100px] border-separate border-spacing-0 text-left text-sm">
                <thead className="sticky top-0 z-20 bg-[#f2f5fa] text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                  <tr>
                    {[
                      "Rider / Vendor",
                      "AWB / Order",
                      "Amount",
                      "Received By",
                      "Remarks",
                      "Current Holder",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        className="border-b border-slate-200 px-4 py-3 font-semibold dark:border-slate-700"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading || permissionsLoading ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <Loader2 className="mx-auto animate-spin text-[#0446DB]" size={25} />
                        <p className="mt-2 text-xs text-slate-500">Loading remittances...</p>
                      </td>
                    </tr>
                  ) : !rows.length ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <FileSpreadsheet size={32} className="mx-auto text-slate-300" />
                        <p className="mt-3 font-medium text-slate-700">No remittances found</p>
                        <p className="mt-1 text-xs text-slate-400">
                          Try a different status or filter.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    rows.map((d, i) => (
                      <tr
                        key={`${d.order_id || d.awb_number}-${i}`}
                        className="hover:bg-blue-50/40  dark:hover:bg-slate-800/40"
                      >
                        <td className="whitespace-nowrap px-4 py-3 align-top">
                          <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-100">
                            {d.vendor_id ? `FP_${d.vendor_id}_${d.rider_id}` : `DKT_${d.rider_id}`}
                          </div>
                          <div className="mt-1 text-[11px] text-slate-400">
                            Rider ID: {d.rider_id || "—"}
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`${frontEndURL}/track-order?awb_number=${encodeURIComponent(d.awb_number || "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-[#0446DB] hover:underline"
                            >
                              {d.awb_number || "—"}
                            </a>
                            <button
                              type="button"
                              onClick={() => copyText(d.awb_number)}
                              aria-label="Copy AWB"
                              className="text-slate-400 hover:text-[#0446DB]"
                            >
                              {copySuccess === String(d.awb_number) ? (
                                <Check size={13} />
                              ) : (
                                <Copy size={13} />
                              )}
                            </button>
                          </div>
                          <div className="mt-1 text-[11px] text-slate-500">
                            {dateIST(d.submitted_at)}
                          </div>
                          <div className="mt-1 text-[11px] text-slate-400">
                            Merchant: {d.merchant_id || "—"}
                          </div>
                          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                            <span
                              className="max-w-[200px] truncate"
                              title={String(d.merchant_order_id || "")}
                            >
                              Order: {d.merchant_order_id || "—"}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyText(d.merchant_order_id)}
                              aria-label="Copy order ID"
                            >
                              {copySuccess === String(d.merchant_order_id) ? (
                                <Check size={12} />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 align-top font-bold tabular-nums text-slate-900 dark:text-white">
                          {currency(d.amount)}
                        </td>
                        <td className="max-w-[180px] px-4 py-3 align-top text-xs text-slate-600 dark:text-slate-300">
                          {d.received_by || "—"}
                        </td>
                        <td className="max-w-[250px] px-4 py-3 align-top text-xs text-slate-600 dark:text-slate-300">
                          <span className="block max-w-[240px] truncate" title={d.remarks || ""}>
                            {d.remarks || "—"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 align-top text-xs font-medium capitalize text-slate-700 dark:text-slate-200">
                          {d.current_holder || "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 align-top">
                          {can("REMITTANCE_UPDATE") && d.status !== "received" ? (
                            <button
                              type="button"
                              title="Click to mark received"
                              onClick={() => {
                                setEditItem(d);
                                setRemarks("Remittance is received by Admin");
                              }}
                              className="text-left"
                            >
                              <StatusPill item={d} />
                              
                            </button>
                          ) : (
                            <StatusPill item={d} />
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Rows per page</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded border border-slate-200 bg-white px-2 py-1.5 dark:bg-slate-800"
                >
                  {[10, 20, 50, 100].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={page === 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={classes.lightButton}
                >
                  <ChevronLeft size={15} /> Previous
                </button>
                <button
                  type="button"
                  aria-label="Next page"
                  disabled={page === totalPages || loading}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={classes.lightButton}
                >
                  Next <ChevronRight size={15} />
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>

      <Drawer direction="right" open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DrawerContent className="!inset-y-0 !right-0 !left-auto !mt-0 !h-full !w-full !max-w-[430px] rounded-none border-l bg-white dark:bg-slate-900">
          <DrawerHeader className="border-b border-slate-200 px-5 py-4 text-left dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="flex items-center gap-2 text-lg">
                  <Filter size={18} className="text-[#0446DB]" /> Advanced Filters
                </DrawerTitle>
                <p className="mt-1 text-xs text-slate-500">Filters are applied by the backend</p>
              </div>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setIsFilterOpen(false)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>
          </DrawerHeader>
          <form
            id="cod-remittance-filters"
            onSubmit={applyFilters}
            className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5"
          >
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Start Date", key: "startDate" },
                { label: "End Date", key: "endDate" },
              ].map((f) => (
                <label key={f.key} className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">{f.label}</span>
                  <input
                    type="date"
                    value={draftFilters[f.key]}
                    min={f.key === "endDate" ? draftFilters.startDate || undefined : undefined}
                    max={f.key === "startDate" ? draftFilters.endDate || undefined : undefined}
                    onChange={(e) => updateDraft(f.key, e.target.value)}
                    className={classes.input}
                  />
                </label>
              ))}
            </div>
            {[
              { label: "Order ID", key: "order_id", hint: "Enter order ID(s)" },
              { label: "AWB Number", key: "awbNumber", hint: "Enter AWB number(s)" },
              { label: "Rider ID", key: "rider_id", hint: "Enter rider ID", type: "number" },
              { label: "Vendor ID", key: "vendor_id", hint: "Enter vendor ID", type: "number" },
              { label: "DC ID", key: "dc_id", hint: "Enter DC ID", type: "number" },
            ].map((f) => (
              <label key={f.key} className="block space-y-1.5">
                <span className="text-xs font-semibold text-slate-600">{f.label}</span>
                <input
                  type={f.type || "text"}
                  value={draftFilters[f.key]}
                  onChange={(e) => updateDraft(f.key, e.target.value)}
                  placeholder={f.hint}
                  className={classes.input}
                />
              </label>
            ))}
          </form>
          <DrawerFooter className="flex-row gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
            <button
              type="button"
              onClick={resetFilters}
              className={`${classes.lightButton} h-10 flex-1`}
            >
              <RotateCcw size={15} /> Reset
            </button>
            <button
              type="submit"
              form="cod-remittance-filters"
              className={`${classes.primaryButton} h-10 flex-[2]`}
            >
              <Filter size={15} /> Apply Filters
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {editItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !busyAction) setEditItem(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Update Remittance"
            className="w-full max-w-md overflow-hidden rounded-sm bg-white shadow-2xl dark:bg-slate-900"
          >
            <div className="flex items-center justify-between bg-[#0446DB] px-5 py-4 text-white">
              <h2 className="text-base font-semibold">Update Remittance</h2>
              <button type="button" onClick={() => setEditItem(null)} aria-label="Close modal">
                <X size={19} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Order ID</label>
                <input
                  readOnly
                  value={editItem.order_id || ""}
                  className={`${classes.input} bg-slate-50`}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Remarks</label>
                <textarea
                  required
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className={`${classes.input} h-auto py-2`}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  New Status
                </label>
                <div className="rounded-sm border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 size={15} className="mr-2 inline" /> Received
                </div>
              </div>
              <p className="flex gap-2 rounded-sm bg-amber-50 p-3 text-xs text-amber-800">
                <CircleAlert size={16} className="shrink-0" /> This action updates the remittance
                status to received.
              </p>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  disabled={!!busyAction}
                  onClick={() => setEditItem(null)}
                  className={classes.lightButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!!busyAction || !remarks.trim()}
                  className={classes.primaryButton}
                >
                  {busyAction === "update" ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Check size={15} />
                  )}{" "}
                  Confirm Received
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
