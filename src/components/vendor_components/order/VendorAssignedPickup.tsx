// import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
// import axios from "axios";
// import logo from "@/assets/DaakitGo-Logo-removebg.png";
// import { toast } from "react-toastify";
// import {
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   ChevronUp,
//   ClipboardList,
//   Download,
//   Filter,
//   Loader2,
//   PackageCheck,
//   RefreshCw,
//   Search,
//   X,
// } from "lucide-react";
// import AxiosInstance from "@/Helper/axiosInstance";

// /**
//  * Assigned pickup loadouts for authenticated DC.
//  * GET /assignedPickupLoadouts (mounted under your DC router's base path).
//  * This page is read-only: the supplied API does not perform pickup actions.
//  */

// const baseURL = import.meta.env.VITE_BASE_URL as string | undefined;
// // Change ONLY this route constant if the DC router has an additional prefix.
// const ASSIGNED_PICKUP_ENDPOINT = `/api/dc/assignedPickupLoadouts`;

// interface PickupAwb {
//   awb_number: string;
//   status: string;
//   substatus: string | null;
//   pickup_stage: string | null;
// }

// interface AssignedPickupLoadout {
//   loadout_id: number;
//   loadout_code: string;
//   loadout_type: string;
//   status: string;
//   source_hub_id: number;
//   source_hub_name: string;
//   source_hub_code: string;
//   target_type: string;
//   target_id: number;
//   created_at: string | null;
//   closed_at: string | null;
//   accepted_count: number;
//   pickup_ready_count: number;
//   awbs: PickupAwb[];
// }

// interface AssignedPickupResponse {
//   success: boolean;
//   status: number;
//   message: string;
//   data: AssignedPickupLoadout[];
//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;
//   filters?: {
//     start_date?: string;
//     end_date?: string;
//     awb_number?: string | null;
//     loadout_code?: string | null;
//   };
// }

// type FilterValues = {
//   start_date: string;
//   end_date: string;
//   loadout_code: string;
//   awb_number: string;
// };

// // All filter dates are calculated in Indian Standard Time (not UTC browser time).
// function istToday(): string {
//   const parts = new Intl.DateTimeFormat("en-GB", {
//     timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",
//   }).formatToParts(new Date());
//   const value = (key: string) => parts.find((part) => part.type === key)?.value ?? "";
//   return `${value("year")}-${value("month")}-${value("day")}`;
// }

// function shiftCalendarDate(date: string, days: number): string {
//   const parsed = new Date(`${date}T12:00:00.000Z`);
//   parsed.setUTCDate(parsed.getUTCDate() + days);
//   return parsed.toISOString().slice(0, 10);
// }

// function daysBetween(start: string, end: string): number {
//   return Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86_400_000);
// }

// function defaultFilters(): FilterValues {
//   const end = istToday();
//   return { start_date: shiftCalendarDate(end, -2), end_date: end, loadout_code: "", awb_number: "" };
// }

// const EMPTY_FILTERS: FilterValues = {
//   start_date: "",
//   end_date: "",
//   loadout_code: "",
//   awb_number: "",
// };

// function errorText(error: unknown): string {
//   if (axios.isAxiosError<{ message?: string }>(error)) {
//     return error.response?.data?.message || error.message || "Failed to fetch assigned pickups";
//   }
//   return error instanceof Error ? error.message : "Failed to fetch assigned pickups";
// }

// function formatDate(value: string | null): string {
//   if (!value) return "—";
//   const date = new Date(value);
//   return Number.isNaN(date.getTime())
//     ? value
//     : date.toLocaleString("en-IN", {
//         timeZone: "Asia/Kolkata",
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });
// }

// function statusLabel(value: string): string {
//   return (value || "—").replace("_", " ");
// }

// export default function AssignPickup() {
//   const [items, setItems] = useState<AssignedPickupLoadout[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(20);
//   const [total, setTotal] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const [draftFilters, setDraftFilters] = useState<FilterValues>(defaultFilters);
//   const [appliedFilters, setAppliedFilters] = useState<FilterValues>(defaultFilters);
//   const [filterOpen, setFilterOpen] = useState(false);
//   const [expandedId, setExpandedId] = useState<number | null>(null);
//   const [reloadKey, setReloadKey] = useState(0);
//   const [downloadingLoadoutId, setDownloadingLoadoutId] = useState<number | null>(null);
//   const todayIST = istToday();

//   const fetchLoadouts = useCallback(async (signal: AbortSignal) => {
//     setLoading(true);
//     try {
//       const response = await AxiosInstance.get<AssignedPickupResponse>(ASSIGNED_PICKUP_ENDPOINT, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         signal,
//         params: {
//           page,
//           limit,
//           start_date: appliedFilters.start_date || undefined,
//           end_date: appliedFilters.end_date || undefined,
//           loadout_code: appliedFilters.loadout_code || undefined,
//           awb_number: appliedFilters.awb_number || undefined,
//         },
//       });
//       if (!response.data.success) {
//         throw new Error(response.data.message || "Failed to fetch assigned pickups");
//       }
//       if (signal.aborted) return;
//       setItems(Array.isArray(response.data.data) ? response.data.data : []);
//       setTotal(Number(response.data.total) || 0);
//       setTotalPages(Math.max(Number(response.data.totalPages) || 1, 1));
//     } catch (error) {
//       if (signal.aborted || (axios.isAxiosError(error) && error.code === "ERR_CANCELED")) return;
//       setItems([]);
//       setTotal(0);
//       setTotalPages(1);
//       toast.error(errorText(error));
//     } finally {
//       if (!signal.aborted) setLoading(false);
//     }
//   }, [page, limit, appliedFilters, reloadKey]);

//   useEffect(() => {
//     const controller = new AbortController();
//     void fetchLoadouts(controller.signal);
//     return () => controller.abort();
//   }, [fetchLoadouts]);

//   const applyFilters = (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if (
//       draftFilters.start_date &&
//       draftFilters.end_date &&
//       draftFilters.start_date > draftFilters.end_date
//     ) {
//       toast.warning("Start Date cannot be after End Date");
//       return;
//     }
//     if (!draftFilters.start_date || !draftFilters.end_date) {
//       toast.warning("Please select both Start Date and End Date");
//       return;
//     }
//     if (draftFilters.end_date > istToday()) {
//       toast.warning("Future dates are not allowed");
//       return;
//     }
//     if (daysBetween(draftFilters.start_date, draftFilters.end_date) > 9) {
//       toast.warning("You can select a maximum of 10 calendar days (inclusive)");
//       return;
//     }
//     setPage(1);
//     setExpandedId(null);
//     setAppliedFilters({ ...draftFilters });
//     setFilterOpen(false);
//   };

//   const clearFilters = () => {
//     setDraftFilters(defaultFilters());
//     setAppliedFilters(defaultFilters());
//     setPage(1);
//     setExpandedId(null);
//     setFilterOpen(false);
//   };

//   // Single-row PDF: match the approved white A4 pickup-details reference.
//   // Existing API, filters, pagination and pickup status logic are untouched.
//   const downloadLoadoutPdf = async (row: AssignedPickupLoadout) => {
//     if (!row.awbs?.length || downloadingLoadoutId !== null) return;
//     setDownloadingLoadoutId(row.loadout_id);
//     try {
//       const { jsPDF } = await import("jspdf");
//       const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
//       const W = 210;
//       const H = 297;
//       const margin = 12;
//       const right = W - margin;
//       const blue: [number, number, number] = [4, 70, 219];
//       const ink: [number, number, number] = [23, 37, 61];
//       const muted: [number, number, number] = [99, 111, 129];
//       const stroke: [number, number, number] = [218, 226, 236];
//       const col = [margin, 26, 70, 115, 165, right];
//       const rowHeight = 16;
//       const safe = (value: unknown): string =>
//         String(value ?? "-").replace(/[^\x20-\x7E]/g, " ").trim() || "-";
//       const fit = (value: unknown, maxWidth: number): string => {
//         const text = safe(value);
//         if (pdf.getTextWidth(text) <= maxWidth) return text;
//         let trimmed = text;
//         while (trimmed.length && pdf.getTextWidth(`${trimmed}...`) > maxWidth) {
//           trimmed = trimmed.slice(0, -1);
//         }
//         return `${trimmed}...`;
//       };
//       const generated = new Date().toLocaleString("en-IN", {
//         timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric",
//         hour: "2-digit", minute: "2-digit", hour12: true,
//       });
//       const line = (y: number) => {
//         pdf.setDrawColor(...stroke);
//         pdf.setLineWidth(0.3);
//         pdf.line(margin, y, right, y);
//       };
//       // Convert the bundled DAAKit image to PNG data for jsPDF.
//       // No PDF icons are drawn; this is the only visual brand mark.
//       const logoDataUrl = await new Promise<string>((resolve, reject) => {
//         const image = new Image();
//         image.onload = () => {
//           const canvas = document.createElement("canvas");
//           canvas.width = image.naturalWidth;
//           canvas.height = image.naturalHeight;
//           const context = canvas.getContext("2d");
//           if (!context) {
//             reject(new Error("Could not prepare DAAKit logo for PDF"));
//             return;
//           }
//           context.drawImage(image, 0, 0);
//           resolve(canvas.toDataURL("image/png"));
//         };
//         image.onerror = () => reject(new Error("Could not load DAAKit logo"));
//         image.src = logo;
//       });
//       const drawHeader = (continued = false) => {
//         // Keep aspect ratio while fitting the imported logo into the header.
//         const logoProperties = pdf.getImageProperties(logoDataUrl);
//         const logoMaxWidth = 27;
//         const logoMaxHeight = 17;
//         const ratio = Math.min(logoMaxWidth / logoProperties.width, logoMaxHeight / logoProperties.height);
//         const logoWidth = logoProperties.width * ratio;
//         const logoHeight = logoProperties.height * ratio;
//         pdf.addImage(logoDataUrl, "PNG", margin, 13, logoWidth, logoHeight);
//         pdf.setFont("helvetica", "bold");
//         pdf.setFontSize(16);
//         pdf.setTextColor(...ink);
//         pdf.text("Loadout Pickup Details", margin + 31, 19);
//         pdf.setFont("helvetica", "normal");
//         pdf.setFontSize(9);
//         pdf.setTextColor(...muted);
//         pdf.text(continued ? "Pickup Ready AWB List (continued)" : "Pickup Ready AWB List", margin + 31, 26);
//         pdf.setFontSize(8);
//         pdf.text("Loadout Code", right, 14.5, { align: "right" });
//         pdf.setFillColor(231, 240, 255);
//         pdf.roundedRect(right - 51, 18, 51, 11, 1.5, 1.5, "F");
//         pdf.setFont("helvetica", "bold");
//         pdf.setFontSize(10.3);
//         pdf.setTextColor(...blue);
//         pdf.text(fit(row.loadout_code, 46), right - 25.5, 25, { align: "center" });
//         line(37);
//       };
//       // Code 39 barcode, drawn as PDF vectors: no extra dependency needed.
//       // AWB characters are normalized to upper-case (Code 39 supports A-Z, 0-9 and - . space $ / + %).
//       const code39: Record<string, string> = {
//         "0": "nnnwwnwnn", "1": "wnnwnnnnw", "2": "nnwwnnnnw", "3": "wnwwnnnnn",
//         "4": "nnnwwnnnw", "5": "wnnwwnnnn", "6": "nnwwwnnnn", "7": "nnnwnnwnw",
//         "8": "wnnwnnwnn", "9": "nnwwnnwnn", "A": "wnnnnwnnw", "B": "nnwnnwnnw",
//         "C": "wnwnnwnnn", "D": "nnnnwwnnw", "E": "wnnnwwnnn", "F": "nnwnwwnnn",
//         "G": "nnnnnwwnw", "H": "wnnnnwwnn", "I": "nnwnnwwnn", "J": "nnnnwwwnn",
//         "K": "wnnnnnnww", "L": "nnwnnnnww", "M": "wnwnnnnwn", "N": "nnnnwnnww",
//         "O": "wnnnwnnwn", "P": "nnwnwnnwn", "Q": "nnnnnnwww", "R": "wnnnnnwwn",
//         "S": "nnwnnnwwn", "T": "nnnnwnwwn", "U": "wwnnnnnnw", "V": "nwwnnnnnw",
//         "W": "wwwnnnnnn", "X": "nwnnwnnnw", "Y": "wwnnwnnnn", "Z": "nwwnwnnnn",
//         "-": "nwnnnnwnw", ".": "wwnnnnwnn", " ": "nwwnnnwnn", "$": "nwnwnwnnn",
//         "/": "nwnwnnnwn", "+": "nwnnnwnwn", "%": "nnnwnwnwn", "*": "nwnnwnwnn",
//       };
//       const drawAwbBarcode = (awbNumber: string, x: number, top: number, width: number) => {
//         const raw = awbNumber.toUpperCase();
//         // If an AWB contains unsupported characters, retain its printed text without drawing a misleading barcode.
//         if (![...raw].every((ch) => code39[ch])) return;
//         const encoded = `*${raw}*`;
//         const modules = [...encoded].reduce((sum, c) => sum + [...code39[c]].reduce((n, b) => n + (b === "w" ? 2.5 : 1), 0) + 1, 0);
//         const moduleWidth = Math.min(0.32, width / modules);
//         let cursor = x + (width - modules * moduleWidth) / 2;
//         pdf.setFillColor(20, 32, 53);
//         for (const ch of encoded) {
//           [...code39[ch]].forEach((bar, i) => {
//             const lineWidth = moduleWidth * (bar === "w" ? 2.5 : 1);
//             if (i % 2 === 0) pdf.rect(cursor, top, lineWidth, 6.6, "F");
//             cursor += lineWidth;
//           });
//           cursor += moduleWidth;
//         }
//       };
//       const drawTableHead = (top: number) => {
//         pdf.setFillColor(239, 243, 248);
//         pdf.rect(margin, top, right - margin, 10, "F");
//         pdf.setDrawColor(...stroke);
//         pdf.setLineWidth(0.25);
//         for (let j = 0; j < col.length; j++) pdf.line(col[j], top, col[j], top + 10);
//         pdf.line(margin, top, right, top);
//         pdf.line(margin, top + 10, right, top + 10);
//         pdf.setFont("helvetica", "bold");
//         pdf.setFontSize(8);
//         pdf.setTextColor(...ink);
//         ["#", "AWB Number", "Order Status", "Substatus", "Pickup Stage"].forEach((t, j) => {
//           pdf.text(t, col[j] + 3, top + 6.7);
//         });
//         return top + 10;
//       };
//       drawHeader();
//       const sourceHub = `${safe(row.source_hub_code || "")} - ${safe(row.source_hub_name || "")}`.replace(/^\s*-\s*|\s*-\s*$/g, "");
//       // Compact summary panel: aligned columns, subtle border and a restrained blue count badge.
//       // PDF fields, export data and barcode handling remain unchanged.
//       pdf.setFillColor(248, 250, 253);
//       pdf.setDrawColor(...stroke);
//       pdf.setLineWidth(0.3);
//       pdf.roundedRect(margin, 42, right - margin, 32, 2.5, 2.5, "FD");
//       // Soft divider between metadata columns.
//       pdf.setDrawColor(227, 233, 242);
//       pdf.line(109, 47, 109, 60);
//       pdf.setFont("helvetica", "bold");
//       pdf.setFontSize(7.7);
//       pdf.setTextColor(...muted);
//       pdf.text("SOURCE HUB", margin + 5, 49);
//       pdf.text("CREATED AT", 114, 49);
//       pdf.setFont("helvetica", "bold");
//       pdf.setFontSize(9.4);
//       pdf.setTextColor(...ink);
//       pdf.text(fit(sourceHub, 87), margin + 5, 56.5);
//       pdf.setFont("helvetica", "normal");
//       pdf.setFontSize(9);
//       pdf.text(fit(formatDate(row.created_at), 76), 114, 56.5);
//       pdf.setDrawColor(229, 234, 242);
//       pdf.line(margin + 5, 62, right - 5, 62);
//       pdf.setFont("helvetica", "bold");
//       pdf.setFontSize(8.4);
//       pdf.setTextColor(...ink);
//       pdf.text("Pickup Ready Count", margin + 5, 69.1);
//       pdf.setFillColor(232, 241, 255);
//       pdf.roundedRect(margin + 48, 64.1, 22, 8, 2.5, 2.5, "F");
//       pdf.setFont("helvetica", "bold");
//       pdf.setFontSize(10);
//       pdf.setTextColor(...blue);
//       pdf.text(String(row.pickup_ready_count ?? 0), margin + 59, 69.8, { align: "center" });
//       line(80);
//       pdf.setFont("helvetica", "bold");
//       pdf.setFontSize(11);
//       pdf.setTextColor(...ink);
//       pdf.text("Pickup Ready AWBs", margin, 90);
//       let y = drawTableHead(97);
//       row.awbs.forEach((awb, index) => {
//         if (y + rowHeight > H - 28) {
//           pdf.addPage();
//           drawHeader(true);
//           pdf.setFont("helvetica", "bold");
//           pdf.setFontSize(10);
//           pdf.setTextColor(...ink);
//           pdf.text("Pickup Ready AWBs", margin, 47);
//           y = drawTableHead(53);
//         }
//         pdf.setFont("helvetica", "normal");
//         pdf.setFontSize(7.8);
//         pdf.setTextColor(...ink);
//         const values: unknown[] = [index + 1, awb.awb_number, statusLabel(awb.status),
//           statusLabel(awb.substatus || "-"), statusLabel(awb.pickup_stage || "-")];
//         if (index % 2 === 1) {
//           pdf.setFillColor(251, 252, 254);
//           pdf.rect(margin, y, right - margin, rowHeight, "F");
//         }
//         values.forEach((value, j) => {
//           if (j === 1) {
//             drawAwbBarcode(String(awb.awb_number || ""), col[j] + 2, y + 1.3, col[j + 1] - col[j] - 4);
//             pdf.setFont("helvetica", "normal");
//             pdf.setFontSize(7);
//             pdf.text(fit(value, col[j + 1] - col[j] - 5), (col[j] + col[j + 1]) / 2, y + 12.4, { align: "center" });
//           } else {
//             pdf.setFontSize(7.8);
//             pdf.text(fit(value, col[j + 1] - col[j] - 5), col[j] + 3, y + 9.2);
//           }
//         });
//         pdf.setDrawColor(...stroke);
//         pdf.setLineWidth(0.25);
//         pdf.line(margin, y + rowHeight, right, y + rowHeight);
//         for (let j = 0; j < col.length; j++) pdf.line(col[j], y, col[j], y + rowHeight);
//         y += rowHeight;
//       });
//       const count = pdf.getNumberOfPages();
//       for (let n = 1; n <= count; n++) {
//         pdf.setPage(n);
//         line(H - 24);
//         pdf.setFont("helvetica", "normal");
//         pdf.setFontSize(7.3);
//         pdf.setTextColor(...ink);
//         pdf.text(`Generated On: ${generated}`, margin, H - 17);
//         pdf.text("Generated By: DC User", margin, H - 12);
//         pdf.text(`Page ${n} of ${count}`, right, H - 17, { align: "right" });
//       }
//       pdf.setProperties({ title: `Loadout Pickup Details - ${safe(row.loadout_code)}` });
//       const filename = safe(row.loadout_code).replace(/[^a-zA-Z0-9_-]/g, "_");
//       pdf.save(`Loadout_Pickup_Details_${filename}.pdf`);
//       toast.success(`PDF downloaded for ${row.loadout_code}`);
//     } catch (error) {
//       toast.error(errorText(error));
//     } finally {
//       setDownloadingLoadoutId(null);
//     }
//   };

//   const pageStart = total === 0 ? 0 : (page - 1) * limit + 1;
//   const pageEnd = Math.min(page * limit, total);
//   const readyTotalOnPage = useMemo(
//     () => items.reduce((sum, item) => sum + Number(item.pickup_ready_count || 0), 0),
//     [items],
//   );

//   return (
//     <div className="flex h-[calc(100dvh-80px)] min-h-0 w-full flex-col gap-3 overflow-hidden bg-[#F7F8FA] text-slate-900 dark:bg-neutral-950 dark:text-white">
//       {/* Page heading stays fixed. Adjust 80px above to your dashboard navbar height. */}
//       <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-1 pt-1">
//         <div className="min-w-0">
//           <h1 className="flex items-center gap-2 text-xl font-semibold sm:text-2xl">
//             <PackageCheck className="h-6 w-6 text-[#0446DB]" /> Assigned Pickups
//           </h1>
//           <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
//             Forward loadouts assigned to your DC and their pickup-ready shipments.
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//         <button
//           type="button"
//           onClick={() => setReloadKey((value) => value + 1)}
//           disabled={loading}
//           className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium hover:bg-slate-50 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900"
//         >
//           <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
//         </button></div>
//       </div>

//       <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
//         {/* Non-scrolling toolbar */}
//         <div className="shrink-0 border-b border-slate-200 px-3 py-3 dark:border-neutral-800 sm:px-4">
//           <div className="flex flex-wrap items-center justify-between gap-3">
//             <div>
//               <p className="text-sm font-semibold">Assigned Pickup Loadouts</p>
//               <p className="text-xs text-slate-500 dark:text-slate-400">
//                 {total} loadout(s) • {readyTotalOnPage} pickup-ready AWBs on this page
//               </p>
//             </div>
//             <button
//               type="button"
//               onClick={() => setFilterOpen((value) => !value)}
//               className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm hover:border-[#0446DB] hover:text-[#0446DB] dark:border-neutral-700"
//               aria-expanded={filterOpen}
//             >
//               <Filter className="h-4 w-4" /> Filters
//               {filterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
//             </button>
//           </div>
//           {filterOpen && (
//             <form onSubmit={applyFilters} className="mt-3 grid grid-cols-1 gap-3 border-t border-slate-100 pt-3 dark:border-neutral-800 sm:grid-cols-2 xl:grid-cols-4">
//               <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
//                 Start Date
//                 <input type="date" value={draftFilters.start_date}
//                   max={todayIST}
//                   onChange={(e) => setDraftFilters((f) => {
//                     const start = e.target.value;
//                     if (!start) return { ...f, start_date: start };
//                     const maxEnd = shiftCalendarDate(start, 9) < todayIST ? shiftCalendarDate(start, 9) : todayIST;
//                     const end = !f.end_date || f.end_date < start || f.end_date > maxEnd ? maxEnd : f.end_date;
//                     return { ...f, start_date: start, end_date: end };
//                   })}
//                   className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800" />
//               </label>
//               <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
//                 End Date
//                 <input type="date" value={draftFilters.end_date} min={draftFilters.start_date || undefined}
//                   max={draftFilters.start_date ? (shiftCalendarDate(draftFilters.start_date, 9) < todayIST ? shiftCalendarDate(draftFilters.start_date, 9) : todayIST) : todayIST}
//                   onChange={(e) => setDraftFilters((f) => ({ ...f, end_date: e.target.value }))}
//                   className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800" />
//               </label>
//               <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
//                 Loadout Code
//                 <div className="relative mt-1">
//                   <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
//                   <input value={draftFilters.loadout_code} onChange={(e) => setDraftFilters((f) => ({ ...f, loadout_code: e.target.value }))}
//                     placeholder="Search loadout code" className="h-9 w-full rounded-md border border-slate-200 bg-white pl-8 pr-2 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800" />
//                 </div>
//               </label>
//               <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
//                 AWB Number
//                 <input value={draftFilters.awb_number} onChange={(e) => setDraftFilters((f) => ({ ...f, awb_number: e.target.value }))}
//                   placeholder="Exact AWB number" className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800" />
//               </label>
//               <p className="text-xs text-slate-500 sm:col-span-2 xl:col-span-4">By default, the last 3 calendar days are selected (including today). Custom ranges can cover up to 10 days, including both dates.</p>
//               <div className="flex gap-2 sm:col-span-2 xl:col-span-4 xl:justify-end">
//                 <button type="button" onClick={clearFilters} className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-200 px-4 text-sm dark:border-neutral-700">
//                   <X className="h-4 w-4" /> Clear
//                 </button>
//                 <button type="submit" className="h-9 rounded-md bg-[#0446DB] px-5 text-sm font-medium text-white hover:bg-[#0339b5]">
//                   Apply Filters
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>

//         {/* ONLY this area scrolls; table head remains sticky within it. */}
//         <div className="min-h-0 flex-1 overflow-auto">
//           <table className="w-full min-w-[1020px] border-separate border-spacing-0 text-left text-sm">
//             <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-neutral-800 dark:text-neutral-300">
//               <tr>
//                 {[
//                   "Loadout Code", "Source Hub", "Status", "Accepted", "Pickup Ready", "Created", "Closed", "Details", "PDF",
//                 ].map((header) => (
//                   <th key={header} className="whitespace-nowrap border-b border-slate-200 px-4 py-3 font-semibold dark:border-neutral-700">
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
//               {loading ? (
//                 <tr><td colSpan={9} className="p-12 text-center text-slate-500">
//                   <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-[#0446DB]" /> Loading assigned pickups...
//                 </td></tr>
//               ) : items.length === 0 ? (
//                 <tr><td colSpan={9} className="p-12 text-center text-slate-500">
//                   <ClipboardList className="mx-auto mb-3 h-8 w-8 text-slate-400" /> No assigned pickup loadouts found.
//                 </td></tr>
//               ) : items.map((item) => (
//                 <FragmentRow key={item.loadout_id} item={item} expanded={expandedId === item.loadout_id}
//                   onToggle={() => setExpandedId((current) => current === item.loadout_id ? null : item.loadout_id)}
//                   onDownload={() => void downloadLoadoutPdf(item)}
//                   downloading={downloadingLoadoutId === item.loadout_id}
//                   downloadDisabled={loading || downloadingLoadoutId !== null || !item.awbs?.length} />
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Non-scrolling pagination footer */}
//         <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-3 py-3 text-xs dark:border-neutral-800 dark:bg-neutral-900 sm:px-4">
//           <span className="text-slate-500 dark:text-slate-400">Showing {pageStart}–{pageEnd} of {total} loadouts</span>
//           <div className="flex items-center gap-2">
//             <label className="flex items-center gap-1 text-slate-500">
//               Rows
//               <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); setExpandedId(null); }}
//                 className="h-8 rounded border border-slate-200 bg-white px-1 dark:border-neutral-700 dark:bg-neutral-800">
//                 <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option><option value={100}>100</option>
//               </select>
//             </label>
//             <button type="button" onClick={() => { setPage((p) => Math.max(1, p - 1)); setExpandedId(null); }} disabled={page <= 1 || loading}
//               aria-label="Previous page" className="rounded border border-slate-200 p-2 disabled:opacity-40 dark:border-neutral-700">
//               <ChevronLeft className="h-4 w-4" />
//             </button>
//             <span className="whitespace-nowrap">{page} / {totalPages}</span>
//             <button type="button" onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); setExpandedId(null); }} disabled={page >= totalPages || loading}
//               aria-label="Next page" className="rounded border border-slate-200 p-2 disabled:opacity-40 dark:border-neutral-700">
//               <ChevronRight className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// function FragmentRow({ item, expanded, onToggle, onDownload, downloading, downloadDisabled }: {
//   item: AssignedPickupLoadout;
//   expanded: boolean;
//   onToggle: () => void;
//   onDownload: () => void;
//   downloading: boolean;
//   downloadDisabled: boolean;
// }) {
//   return (
//     <>
//       <tr className="hover:bg-slate-50 dark:hover:bg-neutral-800/50">
//         <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#0446DB]">{item.loadout_code}</td>
//         <td className="px-4 py-3">
//           <p className="whitespace-nowrap font-medium">{item.source_hub_name || "—"}</p>
//           <p className="text-xs text-slate-500">{item.source_hub_code || "—"}</p>
//         </td>
//         <td className="px-4 py-3"><span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium capitalize text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{statusLabel(item.status)}</span></td>
//         <td className="px-4 py-3">{item.accepted_count}</td>
//         <td className="px-4 py-3"><span className="rounded-md bg-emerald-50 px-2 py-1 font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">{item.pickup_ready_count}</span></td>
//         <td className="whitespace-nowrap px-4 py-3 text-xs">{formatDate(item.created_at)}</td>
//         <td className="whitespace-nowrap px-4 py-3 text-xs">{formatDate(item.closed_at)}</td>
//         <td className="px-4 py-3">
//           <button type="button" aria-expanded={expanded} onClick={onToggle}
//             className="inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-blue-200 px-3 py-1.5 text-xs font-semibold text-[#0446DB] hover:bg-blue-50 dark:border-blue-900 dark:hover:bg-neutral-800">
//             {expanded ? "Hide AWBs" : "View AWBs"} {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
//           </button>
//         </td>
//         <td className="px-4 py-3">
//           <button type="button" onClick={onDownload} disabled={downloadDisabled}
//             title={!item.awbs?.length ? "No pickup-ready AWBs to export" : `Download PDF for ${item.loadout_code}`}
//             className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-blue-200 px-3 py-1.5 text-xs font-semibold text-[#0446DB] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-blue-900 dark:hover:bg-neutral-800">
//             {downloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
//             Download PDF
//           </button>
//         </td>
//       </tr>
//       {expanded && (
//         <tr className="bg-slate-50/80 dark:bg-neutral-800/30">
//           <td colSpan={9} className="px-4 py-4">
//             <div className="rounded-lg border border-slate-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
//               <div className="border-b border-slate-200 px-4 py-3 text-xs font-semibold dark:border-neutral-700">
//                 Pickup-ready shipments ({item.awbs?.length ?? 0})
//               </div>
//               {!item.awbs?.length ? (
//                 <p className="p-4 text-xs text-slate-500">No pickup-ready shipments currently match the API status rules.</p>
//               ) : (
//                 <div className="max-h-60 overflow-auto">
//                   <table className="w-full min-w-[600px] text-left text-xs">
//                     <thead className="sticky top-0 bg-slate-100 dark:bg-neutral-800">
//                       <tr><th className="px-4 py-2">AWB Number</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Substatus</th><th className="px-4 py-2">Pickup Stage</th></tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
//                       {item.awbs.map((awb, index) => (
//                         <tr key={`${awb.awb_number}-${index}`}>
//                           <td className="whitespace-nowrap px-4 py-2 font-semibold text-[#0446DB]">{awb.awb_number}</td>
//                           <td className="px-4 py-2 capitalize">{statusLabel(awb.status)}</td>
//                           <td className="px-4 py-2">{awb.substatus ? statusLabel(awb.substatus) : "—"}</td>
//                           <td className="px-4 py-2 capitalize">{awb.pickup_stage ? statusLabel(awb.pickup_stage) : "—"}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </td>
//         </tr>
//       )}
//     </>
//   );
// }





import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import axios from "axios";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import logo from "@/assets/DaakitGo-Logo-removebg.png";
import { toast } from "react-toastify";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  Download,
  Filter,
  Loader2,
  PackageCheck,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import AxiosInstance from "@/Helper/axiosInstance";

/**
 * Assigned pickup loadouts for authenticated DC.
 * GET /assignedPickupLoadouts (mounted under your DC router's base path).
 * This page is read-only: the supplied API does not perform pickup actions.
 */

const baseURL = import.meta.env.VITE_BASE_URL as string | undefined;
// Change ONLY this route constant if the DC router has an additional prefix.
const ASSIGNED_PICKUP_ENDPOINT = `/api/vendor/assignedPickupLoadouts`;

interface PickupAwb {
  awb_number: string;
  status: string;
  substatus: string | null;
  pickup_stage: string | null;
}

interface AssignedPickupLoadout {
  loadout_id: number;
  loadout_code: string;
  loadout_type: string;
  status: string;
  source_hub_id: number;
  source_hub_name: string;
  source_hub_code: string;
  target_type: string;
  target_id: number;
  created_at: string | null;
  closed_at: string | null;
  accepted_count: number;
  pickup_ready_count: number;
  awbs: PickupAwb[];
}

interface AssignedPickupResponse {
  success: boolean;
  status: number;
  message: string;
  data: AssignedPickupLoadout[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  filters?: {
    start_date?: string;
    end_date?: string;
    awb_number?: string | null;
    loadout_code?: string | null;
  };
}

type FilterValues = {
  start_date: string;
  end_date: string;
  loadout_code: string;
  awb_number: string;
};

// All filter dates are calculated in Indian Standard Time (not UTC browser time).
function istToday(): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const value = (key: string) => parts.find((part) => part.type === key)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

function shiftCalendarDate(date: string, days: number): string {
  const parsed = new Date(`${date}T12:00:00.000Z`);
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return parsed.toISOString().slice(0, 10);
}

function daysBetween(start: string, end: string): number {
  return Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86_400_000);
}

function defaultFilters(): FilterValues {
  const end = istToday();
  return { start_date: shiftCalendarDate(end, -2), end_date: end, loadout_code: "", awb_number: "" };
}

const EMPTY_FILTERS: FilterValues = {
  start_date: "",
  end_date: "",
  loadout_code: "",
  awb_number: "",
};

function errorText(error: unknown): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message || "Failed to fetch assigned pickups";
  }
  return error instanceof Error ? error.message : "Failed to fetch assigned pickups";
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}

function statusLabel(value: string): string {
  return (value || "—").replaceAll("_", " ");
}

export default function VendorAssignPickup() {
  const [items, setItems] = useState<AssignedPickupLoadout[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [draftFilters, setDraftFilters] = useState<FilterValues>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>(defaultFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [downloadingLoadoutId, setDownloadingLoadoutId] = useState<number | null>(null);
  const todayIST = istToday();

  const fetchLoadouts = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get<AssignedPickupResponse>(ASSIGNED_PICKUP_ENDPOINT, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        signal,
        params: {
          page,
          limit,
          start_date: appliedFilters.start_date || undefined,
          end_date: appliedFilters.end_date || undefined,
          loadout_code: appliedFilters.loadout_code || undefined,
          awb_number: appliedFilters.awb_number || undefined,
        },
      });
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch assigned pickups");
      }
      if (signal.aborted) return;
      setItems(Array.isArray(response.data.data) ? response.data.data : []);
      setTotal(Number(response.data.total) || 0);
      setTotalPages(Math.max(Number(response.data.totalPages) || 1, 1));
    } catch (error) {
      if (signal.aborted || (axios.isAxiosError(error) && error.code === "ERR_CANCELED")) return;
      setItems([]);
      setTotal(0);
      setTotalPages(1);
      toast.error(errorText(error));
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [page, limit, appliedFilters, reloadKey]);

  useEffect(() => {
    const controller = new AbortController();
    void fetchLoadouts(controller.signal);
    return () => controller.abort();
  }, [fetchLoadouts]);

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      draftFilters.start_date &&
      draftFilters.end_date &&
      draftFilters.start_date > draftFilters.end_date
    ) {
      toast.warning("Start Date cannot be after End Date");
      return;
    }
    if (!draftFilters.start_date || !draftFilters.end_date) {
      toast.warning("Please select both Start Date and End Date");
      return;
    }
    if (draftFilters.end_date > istToday()) {
      toast.warning("Future dates are not allowed");
      return;
    }
    if (daysBetween(draftFilters.start_date, draftFilters.end_date) > 9) {
      toast.warning("You can select a maximum of 10 calendar days (inclusive)");
      return;
    }
    setPage(1);
    setExpandedId(null);
    setAppliedFilters({ ...draftFilters });
    setFilterOpen(false);
  };

  const clearFilters = () => {
    setDraftFilters(defaultFilters());
    setAppliedFilters(defaultFilters());
    setPage(1);
    setExpandedId(null);
    setFilterOpen(false);
  };

  // Single-row PDF: match the approved white A4 pickup-details reference.
  // Existing API, filters, pagination and pickup status logic are untouched.
  const downloadLoadoutPdf = async (row: AssignedPickupLoadout) => {
    if (!row.awbs?.length || downloadingLoadoutId !== null) return;
    setDownloadingLoadoutId(row.loadout_id);
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = 210;
      const H = 297;
      const margin = 12;
      const right = W - margin;
      const blue: [number, number, number] = [4, 70, 219];
      const ink: [number, number, number] = [23, 37, 61];
      const muted: [number, number, number] = [99, 111, 129];
      const stroke: [number, number, number] = [218, 226, 236];
      const col = [margin, 26, 70, 115, 165, right];
      const rowHeight = 16;
      const safe = (value: unknown): string =>
        String(value ?? "-").replace(/[^\x20-\x7E]/g, " ").trim() || "-";
      const fit = (value: unknown, maxWidth: number): string => {
        const text = safe(value);
        if (pdf.getTextWidth(text) <= maxWidth) return text;
        let trimmed = text;
        while (trimmed.length && pdf.getTextWidth(`${trimmed}...`) > maxWidth) {
          trimmed = trimmed.slice(0, -1);
        }
        return `${trimmed}...`;
      };
      const generated = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
      });
      const line = (y: number) => {
        pdf.setDrawColor(...stroke);
        pdf.setLineWidth(0.3);
        pdf.line(margin, y, right, y);
      };
      // Convert the bundled DAAKit image to PNG data for jsPDF.
      // No PDF icons are drawn; this is the only visual brand mark.
      const logoDataUrl = await new Promise<string>((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          const context = canvas.getContext("2d");
          if (!context) {
            reject(new Error("Could not prepare DAAKit logo for PDF"));
            return;
          }
          context.drawImage(image, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        };
        image.onerror = () => reject(new Error("Could not load DAAKit logo"));
        image.src = logo;
      });
      const drawHeader = (continued = false) => {
        // Keep aspect ratio while fitting the imported logo into the header.
        const logoProperties = pdf.getImageProperties(logoDataUrl);
        const logoMaxWidth = 27;
        const logoMaxHeight = 17;
        const ratio = Math.min(logoMaxWidth / logoProperties.width, logoMaxHeight / logoProperties.height);
        const logoWidth = logoProperties.width * ratio;
        const logoHeight = logoProperties.height * ratio;
        pdf.addImage(logoDataUrl, "PNG", margin, 13, logoWidth, logoHeight);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.setTextColor(...ink);
        pdf.text("Loadout Pickup Details", margin + 31, 19);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(...muted);
        pdf.text(continued ? "Pickup Ready AWB List (continued)" : "Pickup Ready AWB List", margin + 31, 26);
        pdf.setFontSize(8);
        pdf.text("Loadout Code", right, 14.5, { align: "right" });
        pdf.setFillColor(231, 240, 255);
        pdf.roundedRect(right - 51, 18, 51, 11, 1.5, 1.5, "F");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10.3);
        pdf.setTextColor(...blue);
        pdf.text(fit(row.loadout_code, 46), right - 25.5, 25, { align: "center" });
        line(37);
      };
      // Code 39 barcode, drawn as PDF vectors: no extra dependency needed.
      // AWB characters are normalized to upper-case (Code 39 supports A-Z, 0-9 and - . space $ / + %).
      const code39: Record<string, string> = {
        "0": "nnnwwnwnn", "1": "wnnwnnnnw", "2": "nnwwnnnnw", "3": "wnwwnnnnn",
        "4": "nnnwwnnnw", "5": "wnnwwnnnn", "6": "nnwwwnnnn", "7": "nnnwnnwnw",
        "8": "wnnwnnwnn", "9": "nnwwnnwnn", "A": "wnnnnwnnw", "B": "nnwnnwnnw",
        "C": "wnwnnwnnn", "D": "nnnnwwnnw", "E": "wnnnwwnnn", "F": "nnwnwwnnn",
        "G": "nnnnnwwnw", "H": "wnnnnwwnn", "I": "nnwnnwwnn", "J": "nnnnwwwnn",
        "K": "wnnnnnnww", "L": "nnwnnnnww", "M": "wnwnnnnwn", "N": "nnnnwnnww",
        "O": "wnnnwnnwn", "P": "nnwnwnnwn", "Q": "nnnnnnwww", "R": "wnnnnnwwn",
        "S": "nnwnnnwwn", "T": "nnnnwnwwn", "U": "wwnnnnnnw", "V": "nwwnnnnnw",
        "W": "wwwnnnnnn", "X": "nwnnwnnnw", "Y": "wwnnwnnnn", "Z": "nwwnwnnnn",
        "-": "nwnnnnwnw", ".": "wwnnnnwnn", " ": "nwwnnnwnn", "$": "nwnwnwnnn",
        "/": "nwnwnnnwn", "+": "nwnnnwnwn", "%": "nnnwnwnwn", "*": "nwnnwnwnn",
      };
      const drawAwbBarcode = (awbNumber: string, x: number, top: number, width: number) => {
        const raw = awbNumber.toUpperCase();
        // If an AWB contains unsupported characters, retain its printed text without drawing a misleading barcode.
        if (![...raw].every((ch) => code39[ch])) return;
        const encoded = `*${raw}*`;
        const modules = [...encoded].reduce((sum, c) => sum + [...code39[c]].reduce((n, b) => n + (b === "w" ? 2.5 : 1), 0) + 1, 0);
        const moduleWidth = Math.min(0.32, width / modules);
        let cursor = x + (width - modules * moduleWidth) / 2;
        pdf.setFillColor(20, 32, 53);
        for (const ch of encoded) {
          [...code39[ch]].forEach((bar, i) => {
            const lineWidth = moduleWidth * (bar === "w" ? 2.5 : 1);
            if (i % 2 === 0) pdf.rect(cursor, top, lineWidth, 6.6, "F");
            cursor += lineWidth;
          });
          cursor += moduleWidth;
        }
      };
      const drawTableHead = (top: number) => {
        pdf.setFillColor(239, 243, 248);
        pdf.rect(margin, top, right - margin, 10, "F");
        pdf.setDrawColor(...stroke);
        pdf.setLineWidth(0.25);
        for (let j = 0; j < col.length; j++) pdf.line(col[j], top, col[j], top + 10);
        pdf.line(margin, top, right, top);
        pdf.line(margin, top + 10, right, top + 10);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...ink);
        ["#", "AWB Number", "Order Status", "Substatus", "Pickup Stage"].forEach((t, j) => {
          pdf.text(t, col[j] + 3, top + 6.7);
        });
        return top + 10;
      };
      drawHeader();
      const sourceHub = `${safe(row.source_hub_code || "")} - ${safe(row.source_hub_name || "")}`.replace(/^\s*-\s*|\s*-\s*$/g, "");
      // Compact summary panel: aligned columns, subtle border and a restrained blue count badge.
      // PDF fields, export data and barcode handling remain unchanged.
      pdf.setFillColor(248, 250, 253);
      pdf.setDrawColor(...stroke);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(margin, 42, right - margin, 32, 2.5, 2.5, "FD");
      // Soft divider between metadata columns.
      pdf.setDrawColor(227, 233, 242);
      pdf.line(109, 47, 109, 60);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7.7);
      pdf.setTextColor(...muted);
      pdf.text("SOURCE HUB", margin + 5, 49);
      pdf.text("CREATED AT", 114, 49);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9.4);
      pdf.setTextColor(...ink);
      pdf.text(fit(sourceHub, 87), margin + 5, 56.5);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(fit(formatDate(row.created_at), 76), 114, 56.5);
      pdf.setDrawColor(229, 234, 242);
      pdf.line(margin + 5, 62, right - 5, 62);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8.4);
      pdf.setTextColor(...ink);
      pdf.text("Pickup Ready Count", margin + 5, 69.1);
      pdf.setFillColor(232, 241, 255);
      pdf.roundedRect(margin + 48, 64.1, 22, 8, 2.5, 2.5, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(...blue);
      pdf.text(String(row.pickup_ready_count ?? 0), margin + 59, 69.8, { align: "center" });
      line(80);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(...ink);
      pdf.text("Pickup Ready AWBs", margin, 90);
      let y = drawTableHead(97);
      row.awbs.forEach((awb, index) => {
        if (y + rowHeight > H - 28) {
          pdf.addPage();
          drawHeader(true);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(10);
          pdf.setTextColor(...ink);
          pdf.text("Pickup Ready AWBs", margin, 47);
          y = drawTableHead(53);
        }
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7.8);
        pdf.setTextColor(...ink);
        const values: unknown[] = [index + 1, awb.awb_number, statusLabel(awb.status),
          statusLabel(awb.substatus || "-"), statusLabel(awb.pickup_stage || "-")];
        if (index % 2 === 1) {
          pdf.setFillColor(251, 252, 254);
          pdf.rect(margin, y, right - margin, rowHeight, "F");
        }
        values.forEach((value, j) => {
          if (j === 1) {
            drawAwbBarcode(String(awb.awb_number || ""), col[j] + 2, y + 1.3, col[j + 1] - col[j] - 4);
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(7);
            pdf.text(fit(value, col[j + 1] - col[j] - 5), (col[j] + col[j + 1]) / 2, y + 12.4, { align: "center" });
          } else {
            pdf.setFontSize(7.8);
            pdf.text(fit(value, col[j + 1] - col[j] - 5), col[j] + 3, y + 9.2);
          }
        });
        pdf.setDrawColor(...stroke);
        pdf.setLineWidth(0.25);
        pdf.line(margin, y + rowHeight, right, y + rowHeight);
        for (let j = 0; j < col.length; j++) pdf.line(col[j], y, col[j], y + rowHeight);
        y += rowHeight;
      });
      const count = pdf.getNumberOfPages();
      for (let n = 1; n <= count; n++) {
        pdf.setPage(n);
        line(H - 24);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7.3);
        pdf.setTextColor(...ink);
        pdf.text(`Generated On: ${generated}`, margin, H - 17);
        pdf.text("Generated By: DC User", margin, H - 12);
        pdf.text(`Page ${n} of ${count}`, right, H - 17, { align: "right" });
      }
      pdf.setProperties({ title: `Loadout Pickup Details - ${safe(row.loadout_code)}` });
      const filename = safe(row.loadout_code).replace(/[^a-zA-Z0-9_-]/g, "_");
      pdf.save(`Loadout_Pickup_Details_${filename}.pdf`);
      toast.success(`PDF downloaded for ${row.loadout_code}`);
    } catch (error) {
      toast.error(errorText(error));
    } finally {
      setDownloadingLoadoutId(null);
    }
  };

  const pageStart = total === 0 ? 0 : (page - 1) * limit + 1;
  const pageEnd = Math.min(page * limit, total);
  const readyTotalOnPage = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.pickup_ready_count || 0), 0),
    [items],
  );

  return (
    <div className="flex h-[calc(100dvh-80px)] min-h-0 w-full flex-col gap-3 overflow-hidden bg-[#F7F8FA] text-slate-900 dark:bg-neutral-950 dark:text-white">
      {/* Page heading stays fixed. Adjust 80px above to your dashboard navbar height. */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-1 pt-1">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-xl font-semibold sm:text-2xl">
            <PackageCheck className="h-6 w-6 text-[#0446DB]" /> Assigned Pickups
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Forward loadouts assigned to your DC and their pickup-ready shipments.
          </p>
        </div>
        <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setReloadKey((value) => value + 1)}
          disabled={loading}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium hover:bg-slate-50 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button></div>
      </div>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        {/* Non-scrolling toolbar */}
        <div className="shrink-0 border-b border-slate-200 px-3 py-3 dark:border-neutral-800 sm:px-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Assigned Pickup Loadouts</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {total} loadout(s) • {readyTotalOnPage} pickup-ready AWBs on this page
              </p>
            </div>
            <Drawer open={filterOpen} onOpenChange={(open) => {
              if (open) setDraftFilters({ ...appliedFilters });
              setFilterOpen(open);
            }} direction="right">
              <DrawerTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm hover:border-[#0446DB] hover:text-[#0446DB] dark:border-neutral-700"
                  aria-expanded={filterOpen}
                >
                  <Filter className="h-4 w-4" /> Filters
                  <ChevronRight className="h-4 w-4" />
                </button>
              </DrawerTrigger>
              <DrawerContent className="ml-auto flex h-full w-full max-w-md flex-col rounded-none border-l border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <DrawerHeader className="shrink-0 border-b border-slate-200 px-5 py-4 text-left dark:border-neutral-800">
                  <DrawerTitle className="flex items-center gap-2 text-lg font-semibold">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-[#0446DB] dark:bg-blue-950">
                      <Filter className="h-4 w-4" />
                    </span>
                    Filter Assigned Pickups
                  </DrawerTitle>
                  <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">Filter loadouts by date, code and AWB.</p>
                </DrawerHeader>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
                  <form id="assigned-pickup-filter-form" onSubmit={applyFilters} className="flex flex-col gap-5">
                    <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                      Start Date
                      <input type="date" value={draftFilters.start_date}
                        max={todayIST}
                        onChange={(e) => setDraftFilters((f) => {
                          const start = e.target.value;
                          if (!start) return { ...f, start_date: start };
                          const maxEnd = shiftCalendarDate(start, 9) < todayIST ? shiftCalendarDate(start, 9) : todayIST;
                          const end = !f.end_date || f.end_date < start || f.end_date > maxEnd ? maxEnd : f.end_date;
                          return { ...f, start_date: start, end_date: end };
                        })}
                        onClick={(event) => {
                          try { event.currentTarget.showPicker(); } catch { /* Native picker fallback */ }
                        }}
                        className="h-10 w-full cursor-pointer rounded-sm border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-900" />
                    </label>
                    <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                      End Date
                      <input type="date" value={draftFilters.end_date} min={draftFilters.start_date || undefined}
                        max={draftFilters.start_date ? (shiftCalendarDate(draftFilters.start_date, 9) < todayIST ? shiftCalendarDate(draftFilters.start_date, 9) : todayIST) : todayIST}
                        onChange={(e) => setDraftFilters((f) => ({ ...f, end_date: e.target.value }))}
                        onClick={(event) => {
                          try { event.currentTarget.showPicker(); } catch { /* Native picker fallback */ }
                        }}
                        className="h-10 w-full cursor-pointer rounded-sm border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-900" />
                    </label>
                    <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                      Loadout Code
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input value={draftFilters.loadout_code} onChange={(e) => setDraftFilters((f) => ({ ...f, loadout_code: e.target.value }))}
                          placeholder="Search loadout code" className="h-10 w-full rounded-sm border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-900" />
                      </div>
                    </label>
                    <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                      AWB Number
                      <input value={draftFilters.awb_number} onChange={(e) => setDraftFilters((f) => ({ ...f, awb_number: e.target.value }))}
                        placeholder="Exact AWB number" className="h-10 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-900" />
                    </label>
                    <p className="text-xs leading-relaxed text-slate-500 dark:text-neutral-400">By default, the last 3 calendar days are selected (including today). Custom ranges can cover up to 10 days, including both dates.</p>
                  </form>
                </div>
                <DrawerFooter className="shrink-0 border-t border-slate-200 bg-slate-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={clearFilters} className="h-10 rounded-sm border border-slate-200 bg-white text-sm font-medium hover:bg-slate-100 dark:border-neutral-700 dark:bg-neutral-900">
                      Clear Filters
                    </button>
                    <button type="submit" form="assigned-pickup-filter-form" className="h-10 rounded-sm bg-[#0446DB] text-sm font-medium text-white hover:bg-[#0339b5]">
                      Apply Filters
                    </button>
                  </div>
                  <DrawerClose asChild>
                    <button type="button" className="h-9 rounded-sm text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-neutral-800">Cancel</button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        {/* ONLY this area scrolls; table head remains sticky within it. */}
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-[1020px] border-separate border-spacing-0 text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-neutral-800 dark:text-neutral-300">
              <tr>
                {[
                  "Loadout Code", "Source Hub", "Status", "Accepted", "Pickup Ready", "Created", "Closed", "Details", "PDF",
                ].map((header) => (
                  <th key={header} className="whitespace-nowrap border-b border-slate-200 px-4 py-3 font-semibold dark:border-neutral-700">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {loading ? (
                <tr><td colSpan={9} className="p-12 text-center text-slate-500">
                  <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-[#0446DB]" /> Loading assigned pickups...
                </td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={9} className="p-12 text-center text-slate-500">
                  <ClipboardList className="mx-auto mb-3 h-8 w-8 text-slate-400" /> No assigned pickup loadouts found.
                </td></tr>
              ) : items.map((item) => (
                <FragmentRow key={item.loadout_id} item={item} expanded={expandedId === item.loadout_id}
                  onToggle={() => setExpandedId((current) => current === item.loadout_id ? null : item.loadout_id)}
                  onDownload={() => void downloadLoadoutPdf(item)}
                  downloading={downloadingLoadoutId === item.loadout_id}
                  downloadDisabled={loading || downloadingLoadoutId !== null || !item.awbs?.length} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Non-scrolling pagination footer */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-3 py-3 text-xs dark:border-neutral-800 dark:bg-neutral-900 sm:px-4">
          <span className="text-slate-500 dark:text-slate-400">Showing {pageStart}–{pageEnd} of {total} loadouts</span>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-slate-500">
              Rows
              <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); setExpandedId(null); }}
                className="h-8 rounded border border-slate-200 bg-white px-1 dark:border-neutral-700 dark:bg-neutral-800">
                <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option><option value={100}>100</option>
              </select>
            </label>
            <button type="button" onClick={() => { setPage((p) => Math.max(1, p - 1)); setExpandedId(null); }} disabled={page <= 1 || loading}
              aria-label="Previous page" className="rounded border border-slate-200 p-2 disabled:opacity-40 dark:border-neutral-700">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="whitespace-nowrap">{page} / {totalPages}</span>
            <button type="button" onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); setExpandedId(null); }} disabled={page >= totalPages || loading}
              aria-label="Next page" className="rounded border border-slate-200 p-2 disabled:opacity-40 dark:border-neutral-700">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FragmentRow({ item, expanded, onToggle, onDownload, downloading, downloadDisabled }: {
  item: AssignedPickupLoadout;
  expanded: boolean;
  onToggle: () => void;
  onDownload: () => void;
  downloading: boolean;
  downloadDisabled: boolean;
}) {
  return (
    <>
      <tr className="hover:bg-slate-50 dark:hover:bg-neutral-800/50">
        <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#0446DB]">{item.loadout_code}</td>
        <td className="px-4 py-3">
          <p className="whitespace-nowrap font-medium">{item.source_hub_name || "—"}</p>
          <p className="text-xs text-slate-500">{item.source_hub_code || "—"}</p>
        </td>
        <td className="px-4 py-3"><span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium capitalize text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{statusLabel(item.status)}</span></td>
        <td className="px-4 py-3">{item.accepted_count}</td>
        <td className="px-4 py-3"><span className="rounded-md bg-emerald-50 px-2 py-1 font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">{item.pickup_ready_count}</span></td>
        <td className="whitespace-nowrap px-4 py-3 text-xs">{formatDate(item.created_at)}</td>
        <td className="whitespace-nowrap px-4 py-3 text-xs">{formatDate(item.closed_at)}</td>
        <td className="px-4 py-3">
          <button type="button" aria-expanded={expanded} onClick={onToggle}
            className="inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-blue-200 px-3 py-1.5 text-xs font-semibold text-[#0446DB] hover:bg-blue-50 dark:border-blue-900 dark:hover:bg-neutral-800">
            {expanded ? "Hide AWBs" : "View AWBs"} {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </td>
        <td className="px-4 py-3">
          <button type="button" onClick={onDownload} 
          disabled={downloadDisabled}
            title={!item.awbs?.length ? "No pickup-ready AWBs to export" : `Download PDF for ${item.loadout_code}`}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-blue-200 px-3 py-1.5 text-xs font-semibold text-[#0446DB] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-blue-900 dark:hover:bg-neutral-800">
            {downloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            Download PDF
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-slate-50/80 dark:bg-neutral-800/30">
          <td colSpan={9} className="px-4 py-4">
            <div className="rounded-lg border border-slate-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
              <div className="border-b border-slate-200 px-4 py-3 text-xs font-semibold dark:border-neutral-700">
                Pickup-ready shipments ({item.awbs?.length ?? 0})
              </div>
              {!item.awbs?.length ? (
                <p className="p-4 text-xs text-slate-500">No pickup-ready shipments currently match the API status rules.</p>
              ) : (
                <div className="max-h-60 overflow-auto">
                  <table className="w-full min-w-[600px] text-left text-xs">
                    <thead className="sticky top-0 bg-slate-100 dark:bg-neutral-800">
                      <tr><th className="px-4 py-2">AWB Number</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Substatus</th><th className="px-4 py-2">Pickup Stage</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                      {item.awbs.map((awb, index) => (
                        <tr key={`${awb.awb_number}-${index}`}>
                          <td className="whitespace-nowrap px-4 py-2 font-semibold text-[#0446DB]">{awb.awb_number}</td>
                          <td className="px-4 py-2 capitalize">{statusLabel(awb.status)}</td>
                          <td className="px-4 py-2">{awb.substatus ? statusLabel(awb.substatus) : "—"}</td>
                          <td className="px-4 py-2 capitalize">{awb.pickup_stage ? statusLabel(awb.pickup_stage) : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
