import React, { useCallback, useEffect, useState } from "react";
import { Search, RefreshCw, Building2, Users, ChevronLeft, ChevronRight, ShieldCheck, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import AxiosInstance from "@/Helper/axiosInstance";

const DEFAULT_ENDPOINT = "/api/dc/vendors"; // Match your mounted Express GET route.
const LIMIT_OPTIONS = [10, 20, 50, 100];

const formatDate = (date) => {
  if (!date) return "—";
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const StatusBadge = ({ active, type = "account" }) => {
  const yes = Number(active) === 1;
  const label = type === "kyc" ? (yes ? "Verified" : "Not Verified") : (yes ? "Active" : "Inactive");
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${yes ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${yes ? "bg-emerald-500" : "bg-amber-500"}`} />{label}
    </span>
  );
};

export default function DcVendorListing({ endpoint = DEFAULT_ENDPOINT, onAddVendor }) {
  const [vendors, setVendors] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const fetchVendors = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      // console.log({
      //   params: { page, limit, ...(search ? { search } : {}) },
      //   signal,
      // })
      const {data} = await AxiosInstance.get('/api/dc/vendors')

      

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
      if (signal.aborted || err.code === "ERR_CANCELED") return;
      const message = err.response?.data?.message || err.message || "Failed to fetch vendors";
      setError(message);
      setVendors([]);
      setPagination({ page, limit, total: 0, totalPages: 0 });
      toast.error(message);
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [endpoint, page, limit, search]);

  useEffect(() => {
    const controller = new AbortController();
    fetchVendors(controller.signal);
    return () => controller.abort();
  }, [fetchVendors, refreshKey]);

  const totalPages = pagination.totalPages;
  const start = pagination.total ? (page - 1) * limit + 1 : 0;
  const end = Math.min(page * limit, pagination.total);

  return (
    <div className="min-h-full w-full bg-[#F7F8FA]  text-slate-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto w-full m space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl">
             DC Vendors</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">Manage vendors onboarded under your DC account.</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setRefreshKey(k => k + 1)} disabled={loading} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium hover:bg-slate-50 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            {onAddVendor && <button type="button" onClick={onAddVendor} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0446DB] px-4 text-sm font-semibold text-white hover:bg-blue-700"><Users size={16} /> Add Vendor</button>}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-500/10"><Users size={20} /></span><div><p className="text-xs text-slate-500 dark:text-neutral-400">Total Vendors</p><p className="text-xl font-bold tabular-nums">{pagination.total.toLocaleString("en-IN")}</p></div></div>
            <div className="relative w-full max-w-md sm:w-96"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" value={searchInput} onChange={e => setSearchInput(e.target.value.slice(0, 100))} placeholder="Search vendor, company, phone, email..." aria-label="Search vendors" className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800" />{searchInput && <button type="button" onClick={() => setSearchInput("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"><X size={16} /></button>}</div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-neutral-800"><h2 className="text-sm font-semibold">Vendor Directory</h2><span className="text-xs text-slate-500">{loading ? "Loading..." : `${pagination.total} result${pagination.total === 1 ? "" : "s"}`}</span></div>
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-neutral-800/60 dark:text-neutral-400"><tr>{["Vendor ID", "Vendor", "Company", "Contact", "Account Status", "KYC Status", "Joined On"].map(h => <th key={h} scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                {loading ? <tr><td colSpan={7} className="py-16 text-center"><Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-[#0446DB]" /><span className="text-sm text-slate-500">Fetching vendors...</span></td></tr> : error ? <tr><td colSpan={7} className="px-4 py-16 text-center"><p className="font-medium text-red-600">{error}</p><button type="button" onClick={() => setRefreshKey(k => k + 1)} className="mt-3 text-sm font-semibold text-[#0446DB]">Try again</button></td></tr> : vendors.length === 0 ? <tr><td colSpan={7} className="px-4 py-16 text-center"><Users className="mx-auto mb-3 h-9 w-9 text-slate-300" /><p className="font-semibold">No vendors found</p><p className="mt-1 text-xs text-slate-500">{search ? "Try a different search term." : "Onboard a vendor to see them here."}</p></td></tr> : vendors.map(v => <tr key={v.vendor_id} className="hover:bg-slate-50/80 dark:hover:bg-neutral-800/40"><td className="whitespace-nowrap px-4 py-4 font-medium text-[#0446DB]">#{v.vendor_id}</td><td className="px-4 py-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-[#0446DB] dark:bg-blue-500/10">{String(v.vendor_name || "V").charAt(0).toUpperCase()}</span><span className="font-semibold">{v.vendor_name || "—"}</span></div></td><td className="px-4 py-4">{v.company_name || "—"}</td><td className="px-4 py-4"><div className="space-y-1"><p className="whitespace-nowrap">{v.phone || "—"}</p><p className="text-xs text-slate-500 dark:text-neutral-400">{v.email || "—"}</p></div></td><td className="px-4 py-4"><StatusBadge active={v.is_active} /></td><td className="px-4 py-4"><StatusBadge active={v.kyc_verified} type="kyc" /></td><td className="whitespace-nowrap px-4 py-4 text-slate-500 dark:text-neutral-400">{formatDate(v.created_at)}</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 dark:border-neutral-800">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-neutral-400"><span>Showing {start}–{end} of {pagination.total}</span><label className="flex items-center gap-2">Rows per page <select value={limit} onChange={e => { setLimit(Number(e.target.value)); setPage(1); }} className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-800">{LIMIT_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}</select></label></div>
            <div className="flex items-center gap-2"><span className="mr-1 text-xs text-slate-500">Page {page} of {Math.max(totalPages, 1)}</span><button type="button" aria-label="Previous page" disabled={loading || page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-800"><ChevronLeft size={16} /></button><button type="button" aria-label="Next page" disabled={loading || page >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-800"><ChevronRight size={16} /></button></div>
          </div>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-slate-400"><ShieldCheck size={14} /> Only vendors belonging to your authenticated DC are returned by the API.</p>
      </div>
    </div>
  );
}
