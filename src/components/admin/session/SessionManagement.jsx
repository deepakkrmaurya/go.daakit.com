import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import AxiosInstance from "@/Helper/axiosInstance";
import { toast } from "react-toastify";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  Laptop,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  Server,
  ShieldCheck,
  Smartphone,
  Users,
  X,
} from "lucide-react";
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

/**
 * Admin Session Management
 * GET  /api/admin/sessions?type=&id=&page=&limit=
 * POST /api/admin/sessions/revoke { type, id }
 *
 * Requires valid admin JWT AND active Redis-backed admin session.
 * Uses AxiosInstance (the existing app's authenticated axios client).
 * Keep all authorization checks on the backend; this page is only UI.
 */

const DEFAULT_LIMIT = 20;
const TYPES = [
  { value: "all", label: "All Sessions" },
  { value: "vendor", label: "Vendors" },
  { value: "rider", label: "Riders" },
  { value: "dc", label: "DCs" },
];

const initialDraft = { type: "all", id: "" };

const shortId = (value) => {
  const str = String(value || "");
  return str.length > 24 ? `${str.slice(0, 12)}…${str.slice(-8)}` : str || "—";
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getErrorMessage = (error, fallback) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
};

function DeviceIcon({ agent }) {
  const name = String(agent || "").toLowerCase();
  if (/iphone|android|mobile|ipad/.test(name)) {
    return <Smartphone className="h-4 w-4 shrink-0 text-slate-400" />;
  }
  return <Laptop className="h-4 w-4 shrink-0 text-slate-400" />;
}

function TypeBadge({ type }) {
  const styles = {
    vendor: "bg-blue-50 text-[#0446DB] border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-300",
    rider: "bg-orange-50 text-[#b95e00] border-orange-100 dark:bg-orange-500/10 dark:border-orange-500/20 dark:text-orange-300",
    dc: "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-300",
  };
  return (
    <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold capitalize ${styles[type] || "border-slate-200 bg-slate-50 text-slate-700"}`}>
      {type === "dc" ? "DC" : type || "Unknown"}
    </span>
  );
}

export default function AdminSessionManagement() {
  const [appliedFilters, setAppliedFilters] = useState(initialDraft);
  const [draftFilters, setDraftFilters] = useState(initialDraft);
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [sessions, setSessions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: DEFAULT_LIMIT, total: 0, total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [revoking, setRevoking] = useState(false);
  const [accessError, setAccessError] = useState("");
  const requestId = useRef(0);

  const loadSessions = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setAccessError("");
    try {
      const params = { page, limit };
      if (appliedFilters.type !== "all") params.type = appliedFilters.type;
      if (appliedFilters.id) params.id = Number(appliedFilters.id);
      const response = await AxiosInstance.get("/api/admin/sessions", { params });
      if (currentRequest !== requestId.current) return;
      if (response.data?.success === false) {
        throw new Error(response.data?.message || "Failed to fetch sessions");
      }
      setSessions(Array.isArray(response.data?.data) ? response.data.data : []);
      setPagination({
        total: Number(response.data?.pagination?.total) || 0,
        page: Number(response.data?.pagination?.page) || page,
        limit: Number(response.data?.pagination?.limit) || limit,
        total_pages: Math.max(1, Number(response.data?.pagination?.total_pages) || 1),
      });
    } catch (err) {
      if (currentRequest !== requestId.current) return;
      setSessions([]);
      setPagination({ total: 0, page, limit, total_pages: 1 });
      if (axios.isAxiosError(err) && [401, 403].includes(err.response?.status)) {
        setAccessError(err.response?.status === 401 ? "Your admin session has expired or is no longer valid. Please sign in again." : "This account is not authorized to manage admin sessions.");
      } else {
        toast.error(getErrorMessage(err, "Unable to load active sessions"));
      }
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, [page, limit, appliedFilters, refreshKey]);

  useEffect(() => {
    void loadSessions();
    return () => { requestId.current += 1; };
  }, [loadSessions]);

  const applyFilters = (next = draftFilters) => {
    const raw = next.id.trim();
    if (raw && !/^[1-9]\d*$/.test(raw)) {
      toast.error("Entity ID must be a positive integer");
      return;
    }
    if (raw && !Number.isSafeInteger(Number(raw))) {
      toast.error("Entity ID is too large");
      return;
    }
    setAppliedFilters({ type: next.type, id: raw });
    setPage(1);
    setFilterOpen(false);
  };

  const clearFilters = () => {
    setDraftFilters(initialDraft);
    setAppliedFilters(initialDraft);
    setPage(1);
    setFilterOpen(false);
  };

  const openFilters = () => {
    setDraftFilters({ ...appliedFilters });
    setFilterOpen(true);
  };

  const selectType = (type) => {
    setAppliedFilters((prev) => ({ ...prev, type }));
    setPage(1);
  };

  const confirmRevoke = async () => {
    if (!revokeTarget || revoking) return;
    setRevoking(true);
    try {
      const response = await AxiosInstance.post("/api/admin/sessions/revoke", {
        type: revokeTarget.type,
        id: revokeTarget.entity_id,
      });
      if (response.data?.success === false) {
        throw new Error(response.data?.message || "Unable to revoke sessions");
      }
      const count = response.data?.data?.revoked_sessions;
      toast.success(
        Number.isFinite(Number(count))
          ? `${count} session${Number(count) === 1 ? "" : "s"} revoked for ${revokeTarget.type.toUpperCase()} #${revokeTarget.entity_id}`
          : response.data?.message || "Sessions revoked successfully",
      );
      setRevokeTarget(null);
      setRefreshKey((v) => v + 1);
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to revoke sessions"));
    } finally {
      setRevoking(false);
    }
  };

  const filtersActive = appliedFilters.type !== "all" || Boolean(appliedFilters.id);
  const from = pagination.total ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const to = Math.min(pagination.page * pagination.limit, pagination.total);
  const uniqueEntities = useMemo(() => new Set(sessions.map((item) => `${item.type}:${item.entity_id}`)).size, [sessions]);
  const typeCounts = useMemo(() => {
    return sessions.reduce((acc, item) => {
      if (item?.type in acc) acc[item.type] += 1;
      return acc;
    }, { vendor: 0, rider: 0, dc: 0 });
  }, [sessions]);

  return (
    <div className="flex h-[calc(100dvh-80px)] min-h-0 w-full flex-col overflow-hidden bg-[#f5f7fb] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="shrink-0 border-b border-slate-200 bg-[#f5f7fb] px-4 py-4 dark:border-slate-800 dark:bg-slate-950 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-500/10">
                <ShieldCheck size={19} />
              </div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Session Management</h1>
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Monitor active vendor, rider and DC sessions · Admin only</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={openFilters} className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-semibold transition ${filtersActive ? "border-blue-200 bg-blue-50 text-[#0446DB]" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"}`}>
              <Filter size={15} /> Filters {filtersActive ? "•" : ""}
            </button>
            <button type="button" onClick={() => setRefreshKey((v) => v + 1)} disabled={loading} className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
        </div>

        
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
            {TYPES.map((item) => (
              <button key={item.value} type="button" onClick={() => selectType(item.value)} className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${appliedFilters.type === item.value ? "bg-[#0446DB] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}>
                {item.label}
              </button>
            ))}
          </div>
          {filtersActive && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {appliedFilters.id && <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-[#0446DB]">Entity ID: {appliedFilters.id}</span>}
              <button type="button" onClick={clearFilters} className="inline-flex items-center gap-1 font-semibold text-slate-500 hover:text-red-600"><X size={13} /> Clear filters</button>
            </div>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4 pt-3 sm:px-6">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold">Active Login Sessions</h2>
              <p className="mt-0.5 text-xs text-slate-500">Session details are read-only. Revoking an entity terminates all its active sessions.</p>
            </div>
            {!loading && !accessError && <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{uniqueEntities} entities on page</span>}
          </div>
          <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
            <table className="w-full min-w-[1060px] border-separate border-spacing-0 text-left text-sm">
              <thead className="sticky top-0 z-10 bg-[#f1f5fa] text-xs font-bold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <tr>
                  {[
                    "Type", "Entity", "Session ID", "IP Address", "Device / Browser", "Login Time (IST)", "Last Activity (IST)", "Expiry (IST)", "Action",
                  ].map((head) => <th key={head} className="whitespace-nowrap border-b border-slate-200 px-4 py-3 dark:border-slate-700">{head}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr><td colSpan={9} className="px-4 py-20 text-center"><Loader2 className="mx-auto h-7 w-7 animate-spin text-[#0446DB]" /><p className="mt-3 text-slate-500">Loading active sessions...</p></td></tr>
                ) : accessError ? (
                  <tr><td colSpan={9} className="px-4 py-20 text-center"><AlertTriangle className="mx-auto h-8 w-8 text-amber-500" /><p className="mt-3 font-semibold text-slate-800 dark:text-slate-100">Access restricted</p><p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{accessError}</p></td></tr>
                ) : sessions.length === 0 ? (
                  <tr><td colSpan={9} className="px-4 py-20 text-center"><CheckCircle2 className="mx-auto h-9 w-9 text-green-500" /><p className="mt-3 font-semibold">No active sessions found</p><p className="mt-1 text-sm text-slate-500">Try changing the selected type or clearing filters.</p></td></tr>
                ) : sessions.map((item, index) => (
                  <tr key={`${item.type}:${item.entity_id}:${item.session_id || index}`} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="whitespace-nowrap px-4 py-3"><TypeBadge type={item.type} /></td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold tabular-nums">{item.type === "vendor" ? "FP" : item.type === "dc" ? "DC" : "Rider"}{item.entity_id}</td>
                    <td className="px-4 py-3"><span title={item.session_id || ""} className="font-mono text-xs text-slate-600 dark:text-slate-300">{shortId(item.session_id)}</span></td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{item.ip_address || "—"}</td>
                    <td className="max-w-[240px] px-4 py-3"><div className="flex items-center gap-2"><DeviceIcon agent={item.user_agent} /><span className="max-w-[200px] truncate text-xs text-slate-600 dark:text-slate-300" title={item.user_agent || ""}>{item.user_agent || "Unknown device"}</span></div></td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs">{formatDate(item.login_at)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs">{formatDate(item.last_seen_at)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs"><span className="inline-flex items-center gap-1.5"><Clock3 size={13} className="text-slate-400" />{formatDate(item.expires_at)}</span></td>
                    <td className="whitespace-nowrap px-4 py-3"><button type="button" onClick={() => setRevokeTarget({ type: item.type, entity_id: item.entity_id })} className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"><LogOut size={14} /> Revoke All</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">Showing {from}–{to} of {pagination.total} sessions</span>
              <label className="flex items-center gap-1.5 text-xs text-slate-500">Rows
                <select value={limit} onChange={(event) => { setLimit(Number(event.target.value)); setPage(1); }} className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-800 outline-none focus:border-[#0446DB] dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                  {[10, 20, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={loading || page <= 1} className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 px-2.5 text-xs font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"><ChevronLeft size={15} /> Previous</button>
              <span className="min-w-[80px] text-center text-xs font-semibold tabular-nums">Page {page} / {pagination.total_pages}</span>
              <button type="button" onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))} disabled={loading || page >= pagination.total_pages} className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 px-2.5 text-xs font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700">Next <ChevronRight size={15} /></button>
            </div>
          </div>
        </div>
      </div>

      <Drawer direction="right" open={filterOpen} onOpenChange={setFilterOpen}>
        <DrawerContent className="inset-y-0 left-auto right-0 mt-0 h-full w-full max-w-[420px] rounded-none border-l border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <DrawerHeader className="border-b border-slate-100 text-left dark:border-slate-800">
            <DrawerTitle className="flex items-center gap-2"><Filter size={18} className="text-[#0446DB]" /> Filter Sessions</DrawerTitle>
            <DrawerDescription>Filters are applied by the backend across all active sessions.</DrawerDescription>
          </DrawerHeader>
          <form className="flex min-h-0 flex-1 flex-col" onSubmit={(event) => { event.preventDefault(); applyFilters(); }}>
            <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
              <div>
                <label htmlFor="session-filter-type" className="mb-1.5 block text-sm font-semibold">Session Type</label>
                <select id="session-filter-type" value={draftFilters.type} onChange={(event) => setDraftFilters((prev) => ({ ...prev, type: event.target.value }))} className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0446DB] dark:border-slate-700 dark:bg-slate-800">
                  {TYPES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="session-filter-id" className="mb-1.5 block text-sm font-semibold">Entity ID</label>
                <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input id="session-filter-id" inputMode="numeric" type="text" pattern="[0-9]*" value={draftFilters.id} onChange={(event) => setDraftFilters((prev) => ({ ...prev, id: event.target.value }))} placeholder="Enter Vendor / Rider / DC ID" className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#0446DB] dark:border-slate-700 dark:bg-slate-800" /></div>
                <p className="mt-2 text-xs leading-5 text-slate-500">When Type is All Sessions, this ID is searched across vendors, riders and DCs. Otherwise only the selected type is searched.</p>
              </div>
              <div className="rounded-md border border-blue-100 bg-blue-50 p-3 text-xs leading-5 text-slate-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-slate-300"><ShieldCheck size={16} className="mr-1 inline text-[#0446DB]" /> Admin authentication and session validity are verified on the server.</div>
            </div>
            <DrawerFooter className="border-t border-slate-100 dark:border-slate-800">
              <button type="submit" className="h-10 rounded-md bg-[#0446DB] px-4 text-sm font-semibold text-white hover:bg-[#0338b3]">Apply Filters</button>
              <button type="button" onClick={clearFilters} className="h-10 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200">Reset Filters</button>
              <DrawerClose asChild><button type="button" className="h-9 text-sm text-slate-500">Cancel</button></DrawerClose>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>

      <AlertDialog open={Boolean(revokeTarget)} onOpenChange={(open) => { if (!open && !revoking) setRevokeTarget(null); }}>
        <AlertDialogContent className="max-w-md rounded-xl dark:bg-slate-900">
          <AlertDialogHeader>
            <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10"><AlertTriangle size={22} /></div>
            <AlertDialogTitle>Revoke all active sessions?</AlertDialogTitle>
            <AlertDialogDescription className="leading-6">
              This will immediately terminate <strong>every active session</strong> for {revokeTarget?.type === "dc" ? "DC" : revokeTarget?.type} <strong>#{revokeTarget?.entity_id}</strong>. All signed-in devices for this entity will need to log in again. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel disabled={revoking}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={(event) => { event.preventDefault(); void confirmRevoke(); }} disabled={revoking} className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600">
              {revoking ? <><Loader2 size={16} className="mr-2 inline animate-spin" /> Revoking...</> : <><LogOut size={16} className="mr-2 inline" /> Revoke All Sessions</>}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
