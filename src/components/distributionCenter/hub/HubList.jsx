import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Building2, CalendarDays, ChevronLeft, ChevronRight, Copy, Pencil,
  ExternalLink, Eye, Loader2, MapPin, Plus, RefreshCw,
  Search, UserRound, X,
} from "lucide-react";
import AxiosInstance from "@/Helper/axiosInstance";

const PER_PAGE = 10;
const formatText = (value) => value == null || String(value).trim() === "" ? "—" : String(value);
const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};
const hasCoords = (hub) =>
  hub.latitude !== null && hub.latitude !== undefined && hub.latitude !== "" &&
  hub.longitude !== null && hub.longitude !== undefined && hub.longitude !== "" &&
  Number.isFinite(Number(hub.latitude)) && Number.isFinite(Number(hub.longitude)) &&
  Math.abs(Number(hub.latitude)) <= 90 && Math.abs(Number(hub.longitude)) <= 180;

export default function DcHubList() {
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedHub, setSelectedHub] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      if (refreshKey === 0) setLoading(true);
      else setRefreshing(true);
      setError("");
      try {
        const response = await AxiosInstance.get("/api/dc/hubs", { signal: controller.signal });
        // Supports both the direct service response and a {data: serviceResponse} wrapper.
        const outer = response.data;
        const payload = Array.isArray(outer?.data) ? outer : (outer?.data ?? outer);
        if (payload?.success === false || outer?.success === false) {
          throw new Error(payload?.message || outer?.message || "Failed to fetch DC hubs");
        }
        const rows = Array.isArray(payload?.data) ? payload.data : [];
        if (!controller.signal.aborted) {
          setHubs(rows);
          setPage(1);
        }
      } catch (err) {
        if (controller.signal.aborted || err?.code === "ERR_CANCELED") return;
        const message = err?.response?.data?.message || err?.message || "Failed to fetch DC hubs";
        setError(message);
        toast.error(message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };
    load();
    return () => controller.abort();
  }, [refreshKey]);

  const filtered = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return hubs;
    return hubs.filter((hub) => [
      hub.hub_name, hub.hub_code, hub.hub_type, hub.hub_role,
      hub.username, hub.address, hub.city, hub.state, hub.pincode, hub.id,
    ].some((value) => String(value ?? "").toLowerCase().includes(needle)));
  }, [hubs, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageHubs = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const firstItem = filtered.length === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1;
  const lastItem = Math.min(currentPage * PER_PAGE, filtered.length);
  const updateSearch = (value) => { setSearchTerm(value); setPage(1); };

  const copyCode = useCallback(async (code) => {
    try {
      await navigator.clipboard.writeText(String(code));
      toast.success("Hub code copied");
    } catch {
      toast.error("Unable to copy hub code");
    }
  }, []);

  return (
    <div className="flex h-[100dvh] min-h-0 w-full flex-col overflow-hidden bg-[#F6F8FC] text-slate-900 dark:bg-neutral-950 dark:text-white">
      {/* Fixed within this page: only the middle content scrolls. */}
      <header className="z-20 shrink-0 border-b border-slate-200  pb-3 dark:border-neutral-800 dark:bg-neutral-900 ">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Hub Management</h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400 sm:text-sm">View and manage hubs registered under your DC.</p>
          </div>
          <Link to="/dc/hub_create" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0446DB] px-4 text-sm font-semibold text-white transition hover:bg-[#0339B5]">
            <Plus size={17} /> Add New Hub
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1">
            <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={searchTerm} onChange={(e) => updateSearch(e.target.value)} placeholder="Search name, code, city, state, username..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-9 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800" />
            {searchTerm && <button onClick={() => updateSearch("")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700"><X size={16} /></button>}
          </div>
          <button onClick={() => setRefreshKey((key) => key + 1)} disabled={loading || refreshing}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800">
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh
          </button>
          <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-[#0446DB] dark:bg-blue-950/40">Total Hubs: {hubs.length}</span>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain ">
        {loading ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-slate-500"><Loader2 className="h-8 w-8 animate-spin text-[#0446DB]" /> Loading DC hubs...</div>
        ) : error && hubs.length === 0 ? (
          <div className="mx-auto mt-10 max-w-lg rounded-sm border border-red-200 bg-white p-8 text-center dark:bg-neutral-900">
            <p className="font-semibold">Unable to load hubs</p><p className="mt-2 text-sm text-slate-500">{error}</p>
            <button onClick={() => setRefreshKey((key) => key + 1)} className="mt-4 rounded-lg bg-[#0446DB] px-4 py-2 text-sm text-white">Try Again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mx-auto mt-10 max-w-lg rounded-sm border border-slate-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
            <Building2 size={40} className="mx-auto mb-3 text-slate-400" />
            <h2 className="font-semibold">{searchTerm ? "No matching hubs" : "No hubs created yet"}</h2>
            <p className="mt-2 text-sm text-slate-500">{searchTerm ? "Try a different search keyword." : "Create your first DC hub to get started."}</p>
            {!searchTerm && <Link to="/dc/hub_create" className="mt-4 inline-flex rounded-lg bg-[#0446DB] px-4 py-2 text-sm text-white">Create Hub</Link>}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden  border border-slate-200 bg-white  dark:border-neutral-800 dark:bg-neutral-900 md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-neutral-800 dark:text-neutral-400">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Hub Details</th><th className="px-5 py-4 font-semibold">Type / Role</th>
                      <th className="px-5 py-4 font-semibold">Location</th><th className="px-5 py-4 font-semibold">Username</th>
                      <th className="px-5 py-4 font-semibold">Created</th><th className="px-5 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                    {pageHubs.map((hub) => (
                      <tr key={hub.id} className="transition hover:bg-blue-50/30 dark:hover:bg-neutral-800/40">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-900 dark:text-white">{formatText(hub.hub_name)}</div>
                          <div className="mt-2 flex items-center gap-1.5"><code className="rounded bg-slate-100 px-2 py-1 text-xs dark:bg-neutral-800">{formatText(hub.hub_code)}</code>
                            <button title="Copy hub code" onClick={() => copyCode(hub.hub_code)} className="rounded p-1 text-slate-400 hover:text-[#0446DB]"><Copy size={14} /></button>
                          </div>
                        </td>
                        <td className="px-5 py-4"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold uppercase text-[#0446DB] dark:bg-blue-950/40">{formatText(hub.hub_type)}</span><div className="mt-2 text-xs text-slate-500">{formatText(hub.hub_role)}</div></td>
                        <td className="max-w-xs px-5 py-4"><div className="flex items-start gap-1.5"><MapPin size={15} className="mt-0.5 shrink-0 text-slate-400" /><span className="break-words">{[hub.city, hub.state].filter(Boolean).join(", ") || "—"}</span></div><div className="mt-1 text-xs text-slate-500">PIN: {formatText(hub.pincode)}</div></td>
                        <td className="px-5 py-4"><div className="flex items-center gap-1.5"><UserRound size={15} className="text-slate-400" />{formatText(hub.username)}</div></td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-neutral-300"><CalendarDays size={15} className="mr-1 inline text-slate-400" />{formatDate(hub.created_at)}</td>
                        <td className="px-5 py-4 text-right"><div className="inline-flex items-center gap-2"><button onClick={() => setSelectedHub(hub)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#0446DB] hover:bg-blue-50 dark:border-neutral-700"><Eye size={15} /> View</button><Link to={`/dc/hub_create?hubId=${hub.id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-[#0446DB] px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"><Pencil size={15} /> Edit</Link></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Responsive cards */}
            <div className="grid gap-3 md:hidden">
              {pageHubs.map((hub) => (
                <article key={hub.id} className="rounded-sm border border-slate-200 bg-white p-4  dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="truncate font-semibold">{formatText(hub.hub_name)}</h2><div className="mt-1 flex items-center gap-2 text-xs text-slate-500"><code>{formatText(hub.hub_code)}</code><button onClick={() => copyCode(hub.hub_code)} aria-label="Copy code"><Copy size={14} /></button></div></div><span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold uppercase text-[#0446DB]">{formatText(hub.hub_type)}</span></div>
                  <div className="mt-4 space-y-2 text-sm"><p className="flex gap-2"><MapPin size={16} className="shrink-0 text-slate-400" />{[hub.city, hub.state, hub.pincode].filter(Boolean).join(", ") || "—"}</p><p className="flex gap-2"><UserRound size={16} className="text-slate-400" />{formatText(hub.username)}</p></div>
                  <div className="mt-4 grid grid-cols-2 gap-2"><button onClick={() => setSelectedHub(hub)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-[#0446DB] dark:border-neutral-700"><Eye size={16} /> View Details</button><Link to={`/dc/hub_create?hubId=${hub.id}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0446DB] py-2 text-sm font-semibold text-white"><Pencil size={16} /> Edit</Link></div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>

      {!loading && !error && filtered.length > 0 && (
        <footer className="z-10 flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6">
          <p className="text-xs text-slate-500 sm:text-sm">Showing {firstItem}–{lastItem} of {filtered.length} hubs</p>
          <div className="flex items-center gap-2"><button type="button" disabled={currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700"><ChevronLeft size={16} /> Prev</button><span className="px-2 text-xs font-semibold">{currentPage} / {totalPages}</span><button type="button" disabled={currentPage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700">Next <ChevronRight size={16} /></button></div>
        </footer>
      )}

      {selectedHub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedHub(null); }}>
          <section role="dialog" aria-modal="true" aria-label="Hub Details" className="flex max-h-[90dvh] w-full max-w-xl flex-col overflow-hidden rounded-sm bg-white dark:bg-neutral-900">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-neutral-800"><div><h2 className="text-lg font-bold">{formatText(selectedHub.hub_name)}</h2><p className="mt-0.5 text-xs text-slate-500">Hub ID: {formatText(selectedHub.id)}</p></div><button onClick={() => setSelectedHub(null)} aria-label="Close details" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-neutral-800"><X size={19} /></button></div>
            <div className="min-h-0 space-y-3 overflow-y-auto p-5 text-sm">
              {[["Hub Code", selectedHub.hub_code], ["Hub Type", selectedHub.hub_type], ["Hub Role", selectedHub.hub_role], ["Username", selectedHub.username], ["Address", selectedHub.address], ["City", selectedHub.city], ["State", selectedHub.state], ["Pincode", selectedHub.pincode], ["Latitude", selectedHub.latitude], ["Longitude", selectedHub.longitude], ["DC ID", selectedHub.dc_id], ["Created At", formatDate(selectedHub.created_at)]].map(([label, value]) => <div key={label} className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 border-b border-slate-100 pb-2 dark:border-neutral-800"><span className="text-slate-500">{label}</span><span className="break-words font-medium">{formatText(value)}</span></div>)}
              {hasCoords(selectedHub) && <a href={`https://www.google.com/maps?q=${encodeURIComponent(`${selectedHub.latitude},${selectedHub.longitude}`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0446DB]">Open Location in Google Maps <ExternalLink size={15} /></a>}
            </div>
            <div className="flex shrink-0 justify-end gap-2 border-t border-slate-200 p-4 dark:border-neutral-800"><button onClick={() => setSelectedHub(null)} className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-semibold dark:border-neutral-700">Close</button><Link to={`/dc/hub_create?hubId=${selectedHub.id}`} className="inline-flex items-center gap-2 rounded-lg bg-[#0446DB] px-5 py-2 text-sm font-semibold text-white"><Pencil size={15} /> Edit Hub</Link></div>
          </section>
        </div>
      )}
    </div>
  );
}
