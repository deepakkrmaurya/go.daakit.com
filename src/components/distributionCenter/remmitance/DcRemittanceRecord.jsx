
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import AxiosInstance from "../../../Helper/axiosInstance";

const baseURL = import.meta.env.VITE_BASE_URL;

const getDefaultFilters = () => {
  const today = new Date();
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const toLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  return {
    startDate: toLocalDate(monthAgo),
    endDate: toLocalDate(today),
    awb_number: "",
  };
};

const formatAmount = (amount) =>
  Number(amount ?? 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

const formatDate = (date) => {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white";

export default function VendorRemittanceRecord() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const update = (event) => setIsMobile(event.matches);
    setIsMobile(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const [advanceFilters, setAdvanceFilters] = useState(getDefaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(getDefaultFilters);

  const fetchData = useCallback(async (signal) => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get("api/dc/remittance/submittedRecords", {
        params: {
          page,
          limit,
          start_date: appliedFilters.startDate,
          end_date: appliedFilters.endDate,
          awb_number: appliedFilters.awb_number,
        },
        ...(signal ? { signal } : {}),
      });
      setData(Array.isArray(res.data?.data) ? res.data.data : []);
      setTotalPages(Math.max(1, Number(res.data?.total_pages) || 1));
    } catch (err) {
      if (err.code !== "ERR_CANCELED" && err.name !== "CanceledError") {
        toast.error(err.response?.data?.message || err.message || "Failed to fetch remittance records");
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [page, limit, appliedFilters]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);

  const applyFilters = (event) => {
    event.preventDefault();
    if (advanceFilters.startDate && advanceFilters.endDate && advanceFilters.startDate > advanceFilters.endDate) {
      toast.error("Start date cannot be after end date");
      return;
    }
    setPage(1);
    setAppliedFilters({ ...advanceFilters });
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    const defaults = getDefaultFilters();
    setAdvanceFilters(defaults);
    setAppliedFilters(defaults);
    setPage(1);
    setIsFilterOpen(false);
  };

  const activeFilters = Number(Boolean(appliedFilters.awb_number)) +
    Number(appliedFilters.startDate !== getDefaultFilters().startDate || appliedFilters.endDate !== getDefaultFilters().endDate);

  return (
    <div className="flex h-[calc(100dvh-80px)] min-h-0 w-full flex-col overflow-hidden bg-[#F5F7FB] text-slate-900 dark:bg-neutral-950 dark:text-white">
      {/* Fixed page heading */}
      <header className="z-20 shrink-0 border-b border-slate-200  px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6 sm:py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0446DB]/10 text-[#0446DB] dark:bg-blue-500/15 dark:text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold tracking-tight sm:text-2xl">Remittance Records</h1>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-neutral-400 sm:text-sm">
                View submitted COD remittances and download supporting documents
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => fetchData()}
              className="h-9 gap-2 rounded-lg border-slate-200 bg-white text-slate-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Drawer direction={isMobile ? "bottom" : "right"} open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DrawerTrigger asChild>
                <Button type="button" size="sm" className="h-9 gap-2 rounded-lg bg-[#0446DB] px-3 text-white hover:bg-[#0339b5]">
                  <Filter className="h-4 w-4" />
                  Filters{activeFilters > 0 ? ` (${activeFilters})` : ""}
                </Button>
              </DrawerTrigger>
              <DrawerContent className="!fixed !inset-x-0 !bottom-0 !top-auto !mt-0 flex !h-auto !max-h-[92dvh] !w-full !max-w-none flex-col !rounded-t-2xl !rounded-b-none border-t bg-white dark:border-neutral-800 dark:bg-neutral-900 sm:!inset-x-auto sm:!bottom-0 sm:!right-0 sm:!top-0 sm:!h-dvh sm:!max-h-dvh sm:!w-[420px] sm:!rounded-none sm:!border-l sm:!border-t-0">
                <DrawerHeader className="shrink-0 border-b border-slate-100 px-5 py-4 text-left dark:border-neutral-800">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <DrawerTitle className="text-lg font-bold">Advanced Filters</DrawerTitle>
                      <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">Narrow results by date range or AWB number.</p>
                    </div>
                    <DrawerClose asChild>
                      <button type="button" aria-label="Close filters" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-neutral-800">
                        <X className="h-5 w-5" />
                      </button>
                    </DrawerClose>
                  </div>
                </DrawerHeader>
                <form id="remittance-filter-form" onSubmit={applyFilters} className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-neutral-300">Start Date</span>
                      <input type="date"
                       onClick={(e) => {
                        try {
                          e.currentTarget.showPicker?.();
                        } catch (error) {
                          // Browser's native date picker fallback
                        }
                      }}
                      value={advanceFilters.startDate} max={advanceFilters.endDate || undefined} onChange={(e) => setAdvanceFilters((prev) => ({ ...prev, startDate: e.target.value }))} className={inputClass} />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-neutral-300">End Date</span>
                      <input type="date"
                       onClick={(e) => {
                            try {
                              e.currentTarget.showPicker?.();
                            } catch (error) {
                              // Browser's native date picker fallback
                            }
                          }}
                      value={advanceFilters.endDate} min={advanceFilters.startDate || undefined} onChange={(e) => setAdvanceFilters((prev) => ({ ...prev, endDate: e.target.value }))} className={inputClass} />
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-neutral-300">AWB Number</span>
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input type="text" value={advanceFilters.awb_number} onChange={(e) => setAdvanceFilters((prev) => ({ ...prev, awb_number: e.target.value }))} placeholder="Search AWB number" className={`${inputClass} pl-9`} />
                    </div>
                  </label>
                </form>
                <DrawerFooter className="shrink-0 flex-row gap-2 border-t border-slate-100 px-5 py-4 dark:border-neutral-800">
                  <Button type="button" variant="outline" className="h-10 flex-1 rounded-lg" onClick={resetFilters}>Reset</Button>
                  <Button type="submit" form="remittance-filter-form" className="h-10 flex-1 rounded-lg bg-[#0446DB] text-white hover:bg-[#0339b5]">Apply Filters</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </header>

      {/* Fixed table toolbar */}
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden ">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-sm border border-b-0 border-slate-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:px-5">
          <div>
            <h2 className="text-sm font-semibold sm:text-base">Submitted Remittances</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">{data.length} records on this page</p>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{appliedFilters.startDate || "Any"} to {appliedFilters.endDate || "Any"}</span>
          </div>
        </div>

        {/* Only this region scrolls; sticky column headings stay visible */}
        <div className="min-h-0 flex-1 overflow-auto overscroll-contain border-x border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <table className="w-full min-w-[780px] border-separate border-spacing-0 text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-neutral-800">
              <tr>
                {["AWB Number", "Amount", "UTR Number", "Upload Date", "Document"].map((heading) => (
                  <th key={heading} scope="col" className="whitespace-nowrap border-b border-slate-200 bg-slate-50 px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-20 text-center">
                  <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#0446DB]" />
                  <p className="mt-3 text-sm text-slate-500">Loading remittance records...</p>
                </td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-20 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-neutral-800"><FileText className="h-6 w-6" /></div>
                  <p className="mt-3 text-sm font-semibold">No records found</p>
                  <p className="mt-1 text-xs text-slate-500">Try changing the date range or AWB filter.</p>
                </td></tr>
              ) : data.map((record, index) => (
                <tr key={record.id ?? `${record.awb_number}-${record.utr_number}-${index}`} className="transition-colors hover:bg-blue-50/40 dark:hover:bg-neutral-800/50">
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#0446DB] dark:text-blue-400">{record.awb_number || "—"}</td>
                  <td className="whitespace-nowrap px-5 py-4 font-semibold tabular-nums text-slate-800 dark:text-neutral-100">{formatAmount(record.amount)}</td>
                  <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-700 dark:text-neutral-200">{record.utr_number || "—"}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-600 dark:text-neutral-300">{formatDate(record.created_at)}</td>
                  <td className="whitespace-nowrap px-5 py-4">
                    {record.file_url ? (
                      <a href={`${baseURL}/${String(record.file_url).replace(/^\/+/, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[#0446DB]/20 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0446DB] transition hover:border-[#0446DB]/50 hover:bg-blue-100 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20">
                        <Download className="h-3.5 w-3.5" /> Download
                      </a>
                    ) : <span className="text-xs text-slate-400">Not available</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fixed bottom pagination */}
        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-b-xl border border-slate-200 bg-white px-3 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:px-5">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400">
            <span className="hidden sm:inline">Rows per page</span>
            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} aria-label="Rows per page" className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
              {[10, 20, 50, 100].map((count) => <option key={count} value={count}>{count}</option>)}
            </select>
          </div>
          <nav aria-label="Remittance pagination" className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" disabled={page === 1 || loading} onClick={() => setPage((prev) => Math.max(prev - 1, 1))} className="h-9 rounded-lg border-slate-200 px-2.5 dark:border-neutral-700 sm:px-3">
              <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Previous</span>
            </Button>
            <span className="min-w-[84px] text-center text-xs font-medium tabular-nums text-slate-600 dark:text-neutral-300">Page {page} / {totalPages}</span>
            <Button type="button" variant="outline" size="sm" disabled={page >= totalPages || loading} onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} className="h-9 rounded-lg border-slate-200 px-2.5 dark:border-neutral-700 sm:px-3">
              <span className="hidden sm:inline">Next</span> <ChevronRight className="h-4 w-4" />
            </Button>
          </nav>
        </footer>
      </section>
      <div className="h-3 shrink-0 sm:h-5" />
    </div>
  );
}
