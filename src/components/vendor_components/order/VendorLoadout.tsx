// "use client";

// import { useCallback, useEffect, useState, type FormEvent } from "react";

// import { Download, Loader2, Package, RefreshCw, RotateCcw, Search, X } from "lucide-react";

// import axios from "axios";

// import { toast } from "react-toastify";

// import AxiosInstance from "@/Helper/axiosInstance";

// import logo from "@/assets/DaakitGo-Logo-removebg.png";

// const API = "/api/vendor/loadouts";

// type LoadoutType = "rto" | "misroute";

// type LoadoutStatus = "open" | "closed" | "cancelled";

// type Loadout = {

//   id: number;

//   loadout_code: string;

//   loadout_type: LoadoutType;

//   status: LoadoutStatus;

//   accepted_count?: number;

//   rejected_count?: number;

//   total_scanned?: number;

//   created_at?: string;

//   closed_at?: string | null;

// };

// type ScannedOrder = {

//   id: number;

//   order_id: number | null;

//   awb_number: string;

//   scan_status: "accepted" | "rejected";

//   rejection_code?: string | null;

//   rejection_reason?: string | null;

//   previous_status?: string | null;

//   result_stage?: string | null;

//   scanned_at?: string | null;

//   previous_pickup_stage?: string | null;

//   previous_submit_stage?: string | null;

// };

// type LoadoutDetails = Loadout & { orders: ScannedOrder[] };

// type ApiResponse<T> = {

//   success: boolean;

//   message?: string;

//   data?: T;

//   total?: number;

//   code?: string;

// };

// type CreateResult = {

//   loadout_id: number;

//   loadout_code: string;

//   loadout_type: LoadoutType;

// };

// type ScanResult = {

//   loadout_id: number;

//   loadout_type: LoadoutType;

//   order_id: number;

//   awb_number: string;

//   status: string;

//   result_stage: string | null;

// };

// const tabs: { id: LoadoutType; label: string }[] = [

//   { id: "rto", label: "Reverse Loadout" },

//   { id: "misroute", label: "Mis Route" },

// ];

// function errorMessage(error: unknown): string {

//   if (axios.isAxiosError<{ message?: string }>(error)) {

//     return error.response?.data?.message || error.message;

//   }

//   return error instanceof Error ? error.message : "Something went wrong";

// }

// function formatDate(value?: string | null): string {

//   if (!value) return "-";

//   const date = new Date(value);

//   return Number.isNaN(date.getTime()) ? value : date.toLocaleString("en-IN");

// }

// type StaticImageLike = string | { src: string };

// function getImageSrc(image: StaticImageLike): string {

//   return typeof image === "string" ? image : image.src;

// }

// async function convertImageToPngDataUrl(

//   src: string,

// ): Promise<{ dataUrl: string; width: number; height: number }> {

//   return await new Promise((resolve, reject) => {

//     const image = new Image();

//     image.crossOrigin = "anonymous";

//     image.onload = () => {

//       const canvas = document.createElement("canvas");

//       canvas.width = image.naturalWidth || image.width;

//       canvas.height = image.naturalHeight || image.height;

//       const context = canvas.getContext("2d");

//       if (!context) {

//         reject(new Error("Unable to prepare logo for PDF"));

//         return;

//       }

//       context.clearRect(0, 0, canvas.width, canvas.height);

//       context.drawImage(image, 0, 0, canvas.width, canvas.height);

//       resolve({

//         dataUrl: canvas.toDataURL("image/png"),

//         width: canvas.width,

//         height: canvas.height,

//       });

//     };

//     image.onerror = () => reject(new Error("Unable to load DAAKit logo for PDF"));

//     image.src = src;

//   });

// }

// export default function DcLoadout(): React.JSX.Element {

//   const [activeTab, setActiveTab] = useState<LoadoutType>("rto");

//   const [search, setSearch] = useState("");

//   const [loadouts, setLoadouts] = useState<Loadout[]>([]);

//   const [selected, setSelected] = useState<LoadoutDetails | null>(null);

//   const [awb, setAwb] = useState("");

//   const [loadingList, setLoadingList] = useState(false);

//   const [loadingDetails, setLoadingDetails] = useState(false);

//   const [creating, setCreating] = useState(false);

//   const [scanning, setScanning] = useState(false);

//   const [closing, setClosing] = useState(false);

//   const [downloadingPdf, setDownloadingPdf] = useState(false);

//   // GET /loadouts?loadout_type=rto|misroute

//   const fetchLoadouts = useCallback(async () => {

//     setLoadingList(true);

//     try {

//       const res = await AxiosInstance.get<ApiResponse<Loadout[]>>(API, {

//         params: { loadout_type: activeTab },

//       });

//       if (!res.data.success) {

//         throw new Error(res.data.message || "Failed to load loadouts");

//       }

//       setLoadouts(res.data.data ?? []);

//     } catch (error: unknown) {

//       setLoadouts([]);

//       toast.error(errorMessage(error));

//     } finally {

//       setLoadingList(false);

//     }

//   }, [activeTab]);

//   // GET /loadouts/:loadoutId

//   const fetchDetails = async (loadoutId: number) => {

//     setLoadingDetails(true);

//     try {

//       const res = await AxiosInstance.get<ApiResponse<LoadoutDetails>>(`${API}/${loadoutId}`);

//       if (!res.data.success || !res.data.data) {

//         throw new Error(res.data.message || "Loadout details unavailable");

//       }

//       setSelected(res.data.data);

//     } catch (error: unknown) {

//       toast.error(errorMessage(error));

//     } finally {

//       setLoadingDetails(false);

//     }

//   };

//   useEffect(() => {

//     setSelected(null);

//     setSearch("");

//     setAwb("");

//     void fetchLoadouts();

//   }, [fetchLoadouts]);

//   // POST /loadouts

//   const createLoadout = async () => {

//     setCreating(true);

//     try {

//       const body: { loadout_type: LoadoutType } = {

//         loadout_type: activeTab,

//       };

//       const res = await AxiosInstance.post<ApiResponse<CreateResult>>(API, body);

//       if (!res.data.success || !res.data.data) {

//         throw new Error(res.data.message || "Could not create loadout");

//       }

//       toast.success(res.data.message || "Loadout created successfully.");

//       await fetchLoadouts();

//       await fetchDetails(res.data.data.loadout_id);

//     } catch (error: unknown) {

//       toast.error(errorMessage(error));

//     } finally {

//       setCreating(false);

//     }

//   };

//   // POST /loadouts/:loadoutId/scan

//   const scanAwb = async (event: FormEvent<HTMLFormElement>) => {

//     event.preventDefault();

//     if (!selected || selected.status !== "open" || scanning) return;

//     const awbNumber = awb.trim();

//     if (!awbNumber) {

//       toast.warn("Please enter or scan an AWB number.");

//       return;

//     }

//     setScanning(true);

//     try {

//       const res = await AxiosInstance.post<ApiResponse<ScanResult>>(

//         `${API}/${selected.id}/scan`,

//         { awb_number: awbNumber },

//       );

//       if (!res.data.success) {

//         throw new Error(res.data.message || "AWB rejected");

//       }

//       toast.success(res.data.message || "AWB accepted successfully.");

//       setAwb("");

//     } catch (error: unknown) {

//       setAwb("");

//       toast.error(errorMessage(error));

//       // Rejected scans may be saved on the backend.

//     } finally {

//       await Promise.all([fetchDetails(selected.id), fetchLoadouts()]);

//       setScanning(false);

//     }

//   };

//   // POST /loadouts/:loadoutId/close

//   const closeLoadout = async () => {

//     if (!selected || selected.status !== "open" || closing) return;

//     if (!(selected.orders ?? []).some((order) => order.scan_status === "accepted")) {

//       toast.warn("At least one shipment must be accepted before closing the loadout.");

//       return;

//     }

//     if (

//       !window.confirm(

//         `Are you sure you want to close loadout ${selected.loadout_code}? You will not be able to scan additional shipments after closing this loadout.`,

//       )

//     ) {

//       return;

//     }

//     setClosing(true);

//     try {

//       const res = await AxiosInstance.post<ApiResponse<{ accepted_count: number }>>(

//         `${API}/${selected.id}/close`,

//         {},

//       );

//       if (!res.data.success) {

//         throw new Error(res.data.message || "Failed to close loadout");

//       }

//       toast.success(res.data.message || "Loadout closed successfully.");

//       await Promise.all([fetchDetails(selected.id), fetchLoadouts()]);

//     } catch (error: unknown) {

//       toast.error(errorMessage(error));

//     } finally {

//       setClosing(false);

//     }

//   };

//   // Download a handover manifest containing accepted shipments only.

//   const downloadManifest = async () => {

//     if (!selected || downloadingPdf) return;

//     setDownloadingPdf(true);

//     try {

//       const response = await AxiosInstance.get<ApiResponse<LoadoutDetails>>(

//         `${API}/${selected.id}`,

//       );

//       const details = response.data.data;

//       if (!response.data.success || !details) {

//         throw new Error(response.data.message || "Unable to load manifest details");

//       }

//       // These packages are loaded only when a PDF is requested.

//       const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([

//         import("jspdf"),

//         import("jspdf-autotable"),

//       ]);

//       const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

//       const pageWidth = doc.internal.pageSize.getWidth();

//       const margin = 13;

//       const blue: [number, number, number] = [4, 70, 219];

//       const navy: [number, number, number] = [14, 30, 69];

//       const lightBlue: [number, number, number] = [239, 245, 255];

//       const gray: [number, number, number] = [93, 108, 128];

//       const white: [number, number, number] = [255, 255, 255];

//       const loadoutName = {

//         rto: "RTO Loadout",

//         misroute: "Miss Loadout (Misroute)",

//       }[details.loadout_type];

//       const acceptedOrders = (details.orders ?? []).filter((o) => o.scan_status === "accepted");

//       const acceptedCount = acceptedOrders.length;

//       const generatedAt = new Date().toLocaleString("en-IN");

//       // Convert the logo to PNG through a canvas before adding it to jsPDF.

//       // This avoids addImage errors for SVG or unsupported static imports.

//       doc.setFillColor(...blue);

//       doc.rect(0, 0, pageWidth, 4, "F");

//       const logoSource = getImageSrc(logo);

//       const {

//         dataUrl: logoDataUrl,

//         width: rawLogoWidth,

//         height: rawLogoHeight,

//       } = await convertImageToPngDataUrl(logoSource);

//       const preferredLogoHeight = 18;

//       const logoWidth = Math.min(52, (rawLogoWidth / rawLogoHeight) * preferredLogoHeight);

//       const logoHeight = (logoWidth * rawLogoHeight) / rawLogoWidth;

//       doc.addImage(logoDataUrl, "PNG", margin, 6, logoWidth, logoHeight);

//       doc.setFont("helvetica", "bold");

//       doc.setTextColor(...navy);

//       doc.setFontSize(16);

//       doc.text("VENDOR LOADOUT MANIFEST", pageWidth - margin, 18, { align: "right" });

//       doc.setFont("helvetica", "normal");

//       doc.setTextColor(...gray);

//       doc.setFontSize(9);

//       doc.text(`Generated: ${generatedAt}`, pageWidth - margin, 24, { align: "right" });

//       // Manifest identification and metadata.

//       doc.setFillColor(...lightBlue);

//       doc.roundedRect(margin, 30, pageWidth - margin * 2, 26, 2, 2, "F");

//       doc.setFont("helvetica", "bold");

//       doc.setTextColor(...navy);

//       doc.setFontSize(9);

//       doc.text("LOADOUT CODE", margin + 5, 37);

//       doc.setFontSize(14);

//       doc.text(details.loadout_code, margin + 5, 46);

//       doc.setFontSize(9);

//       doc.text("LOADOUT TYPE", pageWidth / 2, 37);

//       doc.setFontSize(12);

//       doc.setTextColor(...blue);

//       doc.text(loadoutName, pageWidth / 2, 46);

//       doc.setFontSize(9);

//       doc.setTextColor(...navy);

//       doc.setFont("helvetica", "normal");

//       const labelValue = (label: string, value: string, x: number, y: number) => {

//         doc.setFont("helvetica", "normal");

//         doc.setTextColor(...gray);

//         doc.text(label, x, y);

//         doc.setFont("helvetica", "bold");

//         doc.setTextColor(...navy);

//         doc.text(value, x + 32, y);

//       };

//       labelValue("Status", details.status.toUpperCase(), margin + 3, 65);

//       labelValue("Created At", formatDate(details.created_at), margin + 3, 72);

//       labelValue("Closed At", formatDate(details.closed_at), margin + 3, 79);

//       // The handover PDF intentionally excludes rejected scans and their counts.

//       const summaryY = 86;

//       const gap = 5;

//       const boxWidth = (pageWidth - margin * 2 - gap) / 2;

//       (

//         [

//           ["ACCEPTED SHIPMENTS", acceptedCount, [223, 247, 237]],

//           ["TOTAL IN MANIFEST", acceptedCount, lightBlue],

//         ] as Array<[string, number, number[]]>

//       ).forEach(([label, value, fill], index) => {

//         const x = margin + index * (boxWidth + gap);

//         doc.setFillColor(fill[0], fill[1], fill[2]);

//         doc.roundedRect(x, summaryY, boxWidth, 18, 2, 2, "F");

//         doc.setFont("helvetica", "bold");

//         doc.setTextColor(...navy);

//         doc.setFontSize(13);

//         doc.text(String(value), x + 5, summaryY + 8);

//         doc.setFontSize(8);

//         doc.text(label, x + 5, summaryY + 14);

//       });

//       doc.setFont("helvetica", "bold");

//       doc.setFontSize(11);

//       doc.text("ACCEPTED SHIPMENTS", margin, 113);

//       autoTable(doc, {

//         startY: 117,

//         margin: { left: margin, right: margin, bottom: 18 },

//         head: [["#", "AWB Number", "Order ID", "Previous Status", "Result Stage", "Scanned At"]],

//         body: acceptedOrders.map((order, index) => [

//           String(index + 1),

//           order.awb_number || "-",

//           String(order.order_id ?? "-"),

//           order.previous_status || "-",

//           order.result_stage || "-",

//           formatDate(order.scanned_at),

//         ]),

//         theme: "grid",

//         styles: {

//           font: "helvetica",

//           fontSize: 7.2,

//           cellPadding: 2.2,

//           overflow: "linebreak",

//           lineColor: [225, 231, 240],

//           lineWidth: 0.15,

//         },

//         headStyles: { fillColor: blue, textColor: white, fontStyle: "bold" },

//         alternateRowStyles: { fillColor: [247, 249, 253] },

//         columnStyles: {

//           0: { cellWidth: 12 },

//           1: { cellWidth: 63 },

//           2: { cellWidth: 33 },

//           3: { cellWidth: 52 },

//           4: { cellWidth: 44 },

//           5: { cellWidth: 67 },

//         },

//       });

//       const tableBottom =

//         (doc as typeof doc & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 117;

//       const notesY = tableBottom + 9;

//       if (notesY + 18 < doc.internal.pageSize.getHeight() - 17) {

//         doc.setFont("helvetica", "normal");

//         doc.setFontSize(8);

//         doc.setTextColor(...gray);

//         doc.text(

//           "Note: Verify physical shipment count against accepted scans before handover.",

//           margin,

//           notesY,

//         );

//         doc.text("Vendor Representative: ____________________", margin, notesY + 12);

//         doc.text("Receiving Representative: ____________________", pageWidth / 2, notesY + 12);

//       }

//       const pageCount = doc.getNumberOfPages();

//       for (let page = 1; page <= pageCount; page++) {

//         doc.setPage(page);

//         const footerY = doc.internal.pageSize.getHeight() - 8;

//         doc.setFontSize(8);

//         doc.setTextColor(...gray);

//         doc.text(details.loadout_code, margin, footerY);

//         doc.text(`Page ${page} of ${pageCount}`, pageWidth - margin, footerY, { align: "right" });

//       }

//       const safeCode = details.loadout_code.replace(/[^a-zA-Z0-9_-]/g, "_");

//       doc.save(`DAAKit_Vendor_Loadout_${safeCode}.pdf`);

//       toast.success("Loadout manifest PDF downloaded");

//     } catch (error: unknown) {

//       toast.error(errorMessage(error));

//     } finally {

//       setDownloadingPdf(false);

//     }

//   };

//   const filteredLoadouts = loadouts.filter((item) =>

//     [item.loadout_code, item.status, item.loadout_type].some(

//       (text) => text.toLowerCase().includes(search.trim().toLowerCase()),

//     ),

//   );

//   const accepted = selected?.orders?.filter((order) => order.scan_status === "accepted").length ?? 0;

//   const rejected = selected?.orders?.filter((order) => order.scan_status === "rejected").length ?? 0;

//   const [loadingPage, setLoadingPage] = useState(true);

//   useEffect(() => {

//     const timer = setTimeout(() => {

//       setLoadingPage(false);

//     }, 2000);

//     return () => clearTimeout(timer);

//   }, []);

//   return (

//     <>

//       {loadingPage ? (

//         <div className=" w-full h-[90vh] flex justify-center items-center">

//           <div>

//             <Loader2 className="h-8 w-8 animate-spin mx-auto" />

//             <p className="mt-2">Loading Loadout Details...</p>

//           </div>

//         </div>

//       ) : (

//         <div className="flex h-[calc(100dvh-100px)] min-h-0 flex-col gap-4 overflow-hidden bg-[#F7F8FA] text-slate-900 dark:bg-neutral-950 dark:text-white">

//           <div className="shrink-0">

//             <h1 className="text-xl font-bold sm:text-2xl">Vendor Loadout</h1>

//             <p className="mt-1 text-sm text-slate-500">

//               Create RTO or Miss loadouts, scan AWBs and close completed batches.

//             </p>

//           </div>

//           <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm border border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">

//             <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-slate-200 px-3 dark:border-neutral-800 sm:px-5">

//               {tabs.map((tab) => (

//                 <button

//                   key={tab.id}

//                   type="button"

//                   onClick={() => setActiveTab(tab.id)}

//                   className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium ${

//                     activeTab === tab.id

//                       ? "border-[#0446DB] text-[#0446DB]"

//                       : "border-transparent text-slate-500 hover:text-[#0446DB]"

//                   }`}

//                 >

//                   {tab.label}

//                 </button>

//               ))}

//             </div>

//             <div className="flex shrink-0 flex-col gap-3 border-b border-slate-100 p-3 dark:border-neutral-800 sm:flex-row sm:items-end sm:justify-between sm:p-4">

//               <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-end">

//                 <button

//                   type="button"

//                   onClick={() => void createLoadout()}

//                   disabled={creating}

//                   className="inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-[#0339b5] disabled:opacity-50"

//                 >

//                   {creating ? (

//                     <Loader2 size={16} className="animate-spin" />

//                   ) : (

//                     <Package size={16} />

//                   )}

//                   Create Loadout

//                 </button>

//               </div>

//               <button

//                 type="button"

//                 onClick={() => void fetchLoadouts()}

//                 disabled={loadingList}

//                 className="inline-flex h-10 items-center justify-center gap-2 rounded-sm border border-slate-200 px-3 text-sm dark:border-neutral-700"

//               >

//                 <RefreshCw size={16} className={loadingList ? "animate-spin" : ""} /> Refresh

//               </button>

//             </div>

//             <div className="shrink-0 border-b border-slate-100 p-3 dark:border-neutral-800 sm:p-4">

//               <div className="relative max-w-sm">

//                 <Search

//                   size={16}

//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"

//                 />

//                 <input

//                   value={search}

//                   onChange={(event) => setSearch(event.target.value)}

//                   placeholder="Search loadout code or status..."

//                   className="h-10 w-full rounded-sm border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800"

//                 />

//               </div>

//             </div>

//             <div className="min-h-0 flex-1 overflow-auto">

//               <table className="w-full min-w-[850px] text-left text-sm">

//                 <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase text-slate-500 dark:bg-neutral-800">

//                   <tr>

//                     <th className="px-4 py-3">Loadout</th>

//                     <th className="px-4 py-3">Created</th>

//                     <th className="px-4 py-3">Accepted</th>

//                     <th className="px-4 py-3">Rejected</th>

//                     <th className="px-4 py-3">Status</th>

//                     <th className="px-4 py-3">Action</th>

//                   </tr>

//                 </thead>

//                 <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">

//                   {filteredLoadouts.map((item) => (

//                     <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800/50">

//                       <td className="px-4 py-3 font-semibold text-[#0446DB]">

//                         {item.loadout_code}

//                       </td>

//                       <td className="px-4 py-3">{formatDate(item.created_at)}</td>

//                       <td className="px-4 py-3">{item.accepted_count ?? 0}</td>

//                       <td className="px-4 py-3">{item.rejected_count ?? 0}</td>

//                       <td className="px-4 py-3">

//                         <span

//                           className={`rounded-full px-2 py-1 text-xs font-medium ${item.status === "open" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"}`}

//                         >

//                           {item.status}

//                         </span>

//                       </td>

//                       <td className="px-4 py-3">

//                         <button

//                           type="button"

//                           onClick={() => void fetchDetails(item.id)}

//                           className="rounded-md border border-[#0446DB] px-3 py-1.5 text-xs font-medium text-[#0446DB] hover:bg-blue-50"

//                         >

//                           View / Scan

//                         </button>

//                       </td>

//                     </tr>

//                   ))}

//                   {!loadingList && filteredLoadouts.length === 0 && (

//                     <tr>

//                       <td colSpan={6} className="py-12 text-center text-slate-500">

//                         No loadouts found

//                       </td>

//                     </tr>

//                   )}

//                   {loadingList && (

//                     <tr>

//                       <td colSpan={6} className="py-12 text-center text-slate-500">

//                         Loading loadouts...

//                       </td>

//                     </tr>

//                   )}

//                 </tbody>

//               </table>

//             </div>

//             <div className="shrink-0 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-neutral-800">

//               Showing {filteredLoadouts.length} of {loadouts.length} loadouts

//             </div>

//           </div>

//           {selected && (

//             <div

//               className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6"

//               role="presentation"

//             >

//               <div

//                 role="dialog"

//                 aria-modal="true"

//                 aria-label="Loadout details"

//                 className="flex max-h-[90dvh] w-full max-w-4xl flex-col overflow-hidden rounded-sm bg-white shadow-xl dark:bg-neutral-900"

//               >

//                 <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-neutral-800">

//                   <div>

//                     <h2 className="font-bold">{selected.loadout_code}</h2>

//                     <p className="text-xs text-slate-500">

//                       {selected.loadout_type.toUpperCase()} · {selected.status.toUpperCase()}

//                     </p>

//                   </div>

//                   <button

//                     type="button"

//                     onClick={() => setSelected(null)}

//                     aria-label="Close details"

//                     className="rounded p-2 hover:bg-slate-100 dark:hover:bg-neutral-800"

//                   >

//                     <X size={20} />

//                   </button>

//                 </div>

//                 <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">

//                   <div className="flex flex-wrap gap-3 text-sm">

//                     <span className="rounded-sm bg-blue-50 px-3 py-2 text-blue-700">

//                       Accepted: {accepted}

//                     </span>

//                     <span className="rounded-sm bg-orange-50 px-3 py-2 text-orange-700">

//                       Rejected: {rejected}

//                     </span>

//                     <span className="rounded-sm bg-slate-100 px-3 py-2 text-slate-700">

//                       Total: {(selected.orders ?? []).length}

//                     </span>

//                   </div>

//                   {selected.status === "open" && (

//                     <form

//                       onSubmit={(event) => void scanAwb(event)}

//                       className="flex flex-col gap-2 sm:flex-row"

//                     >

//                       <input

//                         value={awb}

//                         onChange={(event) => setAwb(event.target.value)}

//                         placeholder="Scan or enter AWB number"

//                         autoComplete="off"

//                         className="h-11 min-w-0 flex-1 rounded-sm border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800"

//                       />

//                       <button

//                         disabled={scanning || !awb.trim()}

//                         type="submit"

//                         className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white disabled:opacity-50"

//                       >

//                         {scanning && <Loader2 size={16} className="animate-spin" />}

//                         Scan AWB

//                       </button>

//                     </form>

//                   )}

//                   <div className="overflow-x-auto rounded-sm border border-slate-200 dark:border-neutral-800">

//                     <table className="w-full min-w-[650px] text-left text-sm">

//                       <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-neutral-800">

//                         <tr>

//                           <th className="px-3 py-3">AWB Number</th>

//                           <th className="px-3 py-3">Order ID</th>

//                           <th className="px-3 py-3">Scan Status</th>

//                           <th className="px-3 py-3">Reason / Result</th>

//                         </tr>

//                       </thead>

//                       <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">

//                         {(selected.orders ?? []).map((order) => (

//                           <tr key={order.id}>

//                             <td className="px-3 py-3 font-medium">{order.awb_number}</td>

//                             <td className="px-3 py-3">{order.order_id ?? "-"}</td>

//                             <td className="px-3 py-3">{order.scan_status}</td>

//                             <td className="px-3 py-3">

//                               {order.rejection_reason || order.result_stage || "-"}

//                             </td>

//                           </tr>

//                         ))}

//                         {(selected.orders ?? []).length === 0 && (

//                           <tr>

//                             <td colSpan={4} className="py-8 text-center text-slate-500">

//                               No AWBs scanned yet

//                             </td>

//                           </tr>

//                         )}

//                       </tbody>

//                     </table>

//                   </div>

//                 </div>

//                 <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-slate-200 p-4 dark:border-neutral-800">

//                   <button

//                     type="button"

//                     onClick={() => void fetchDetails(selected.id)}

//                     disabled={loadingDetails}

//                     className="inline-flex items-center gap-2 rounded-sm border border-slate-200 px-4 py-2 text-sm dark:border-neutral-700"

//                   >

//                     <RefreshCw size={15} className={loadingDetails ? "animate-spin" : ""} /> Refresh

//                   </button>

//                   <button

//                     type="button"

//                     onClick={() => void downloadManifest()}

//                     disabled={downloadingPdf || loadingDetails || scanning || closing}

//                     className="inline-flex items-center gap-2 rounded-sm border border-[#0446DB] px-4 py-2 text-sm font-medium text-[#0446DB] hover:bg-blue-50 disabled:opacity-50 dark:hover:bg-neutral-800"

//                   >

//                     {downloadingPdf ? (

//                       <Loader2 size={15} className="animate-spin" />

//                     ) : (

//                       <Download size={15} />

//                     )}

//                     {downloadingPdf ? "Generating PDF..." : "Download PDF"}

//                   </button>

//                   {selected.status === "open" && (

//                     <button

//                       type="button"

//                       onClick={() => void closeLoadout()}

//                       disabled={closing || scanning || accepted === 0}

//                       className="inline-flex items-center gap-2 rounded-sm bg-[#eb8300] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"

//                     >

//                       {closing ? (

//                         <Loader2 size={16} className="animate-spin" />

//                       ) : (

//                         <RotateCcw size={16} />

//                       )}

//                       Close Loadout

//                     </button>

//                   )}

//                 </div>

//               </div>

//             </div>

//           )}

//         </div>

//       )}

//     </>

//   );

// }






"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

import { Download, Loader2, Package, RefreshCw, RotateCcw, Search, X } from "lucide-react";

import axios from "axios";

import { toast } from "react-toastify";

import AxiosInstance from "@/Helper/axiosInstance";

import logo from "@/assets/DaakitGo-Logo-removebg.png";

const API = "/api/vendor/loadouts";

type LoadoutType = "rto" | "misroute";

type LoadoutStatus = "open" | "closed" | "cancelled";

type Loadout = {

  id: number;

  loadout_code: string;

  loadout_type: LoadoutType;

  status: LoadoutStatus;

  accepted_count?: number;

  rejected_count?: number;

  total_scanned?: number;

  created_at?: string;

  closed_at?: string | null;

};

type ScannedOrder = {

  id: number;

  order_id: number | null;

  awb_number: string;

  scan_status: "accepted" | "rejected";

  rejection_code?: string | null;

  rejection_reason?: string | null;

  previous_status?: string | null;

  result_stage?: string | null;

  scanned_at?: string | null;

  previous_pickup_stage?: string | null;

  previous_submit_stage?: string | null;

};

type LoadoutDetails = Loadout & { orders: ScannedOrder[] };

type ApiResponse<T> = {

  success: boolean;

  message?: string;

  data?: T;

  total?: number;

  code?: string;

};

type CreateResult = {

  loadout_id: number;

  loadout_code: string;

  loadout_type: LoadoutType;

};

type ScanResult = {

  loadout_id: number;

  loadout_type: LoadoutType;

  order_id: number;

  awb_number: string;

  status: string;

  result_stage: string | null;

};

const tabs: { id: LoadoutType; label: string }[] = [

  { id: "rto", label: "Reverse Loadout" },

  { id: "misroute", label: "Misroute" },

];

function errorMessage(error: unknown): string {

  if (axios.isAxiosError<{ message?: string }>(error)) {

    return error.response?.data?.message || error.message;

  }

  return error instanceof Error ? error.message : "Something went wrong";

}

function formatDate(value?: string | null): string {

  if (!value) return "-";

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("en-IN");

}

type StaticImageLike = string | { src: string };

function getImageSrc(image: StaticImageLike): string {

  return typeof image === "string" ? image : image.src;

}

async function convertImageToPngDataUrl(

  src: string,

): Promise<{ dataUrl: string; width: number; height: number }> {

  return await new Promise((resolve, reject) => {

    const image = new Image();

    image.crossOrigin = "anonymous";

    image.onload = () => {

      const canvas = document.createElement("canvas");

      canvas.width = image.naturalWidth || image.width;

      canvas.height = image.naturalHeight || image.height;

      const context = canvas.getContext("2d");

      if (!context) {

        reject(new Error("Unable to prepare logo for PDF"));

        return;

      }

      context.clearRect(0, 0, canvas.width, canvas.height);

      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      resolve({

        dataUrl: canvas.toDataURL("image/png"),

        width: canvas.width,

        height: canvas.height,

      });

    };

    image.onerror = () => reject(new Error("Unable to load DAAKit logo for PDF"));

    image.src = src;

  });

}

// Default range: the last 10 calendar days including today (IST).*

function todayIST(): string {

  const parts = new Intl.DateTimeFormat("en-GB", {

    timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",

  }).formatToParts(new Date());

  const part = (type: string) => parts.find(p => p.type === type)?.value ?? "";

  return `${part("year")}-${part("month")}-${part("day")}`;

}



function shiftDate(date: string, days: number): string {

  const utc = new Date(`${date}T12:00:00Z`);

  utc.setUTCDate(utc.getUTCDate() + days);

  return utc.toISOString().slice(0, 10);

}



export default function DcLoadout(): React.JSX.Element {

  const [activeTab, setActiveTab] = useState<LoadoutType>("rto");

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(() => shiftDate(todayIST(), -9));
  const [endDate, setEndDate] = useState(todayIST);
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftStartDate, setDraftStartDate] = useState(() => shiftDate(todayIST(), -9));
  const [draftEndDate, setDraftEndDate] = useState(todayIST);


  const [loadouts, setLoadouts] = useState<Loadout[]>([]);

  const [selected, setSelected] = useState<LoadoutDetails | null>(null);

  const [awb, setAwb] = useState("");

  const [loadingList, setLoadingList] = useState(false);

  const [loadingDetails, setLoadingDetails] = useState(false);

  const [creating, setCreating] = useState(false);

  const [scanning, setScanning] = useState(false);

  const [closing, setClosing] = useState(false);

  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // GET /loadouts?loadout_type=rto|misroute

  const fetchLoadouts = useCallback(async () => {

    setLoadingList(true);

    try {

      const res = await AxiosInstance.get<ApiResponse<Loadout[]>>(API, {

        params: { loadout_type: activeTab, start_date: startDate, end_date: endDate },

      });

      if (!res.data.success) {

        throw new Error(res.data.message || "Failed to load loadouts");

      }

      setLoadouts(res.data.data ?? []);

    } catch (error: unknown) {

      setLoadouts([]);

      toast.error(errorMessage(error));

    } finally {

      setLoadingList(false);

    }

  }, [activeTab, startDate, endDate]);

  // GET /loadouts/:loadoutId

  const fetchDetails = async (loadoutId: number) => {

    setLoadingDetails(true);

    try {

      const res = await AxiosInstance.get<ApiResponse<LoadoutDetails>>(`${API}/${loadoutId}`);

      if (!res.data.success || !res.data.data) {

        throw new Error(res.data.message || "Loadout details unavailable");

      }

      setSelected(res.data.data);

    } catch (error: unknown) {

      toast.error(errorMessage(error));

    } finally {

      setLoadingDetails(false);

    }

  };

  useEffect(() => {

    setSelected(null);

    setSearch("");

    setAwb("");

    void fetchLoadouts();

  }, [fetchLoadouts]);

  // POST /loadouts

  const createLoadout = async () => {

    setCreating(true);

    try {

      const body: { loadout_type: LoadoutType } = {

        loadout_type: activeTab,

      };

      const res = await AxiosInstance.post<ApiResponse<CreateResult>>(API, body);

      if (!res.data.success || !res.data.data) {

        throw new Error(res.data.message || "Could not create loadout");

      }

      toast.success(res.data.message || "Loadout created successfully.");

      await fetchLoadouts();

      await fetchDetails(res.data.data.loadout_id);

    } catch (error: unknown) {

      toast.error(errorMessage(error));

    } finally {

      setCreating(false);

    }

  };

  // POST /loadouts/:loadoutId/scan

  const scanAwb = async (event: FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    if (!selected || selected.status !== "open" || scanning) return;

    const awbNumber = awb.trim();

    if (!awbNumber) {

      toast.warn("Please enter or scan an AWB number.");

      return;

    }

    setScanning(true);

    try {

      const res = await AxiosInstance.post<ApiResponse<ScanResult>>(

        `${API}/${selected.id}/scan`,

        { awb_number: awbNumber },

      );

      if (!res.data.success) {

        throw new Error(res.data.message || "AWB rejected");

      }

      toast.success(res.data.message || "AWB accepted successfully.");

      setAwb("");

    } catch (error: unknown) {

      setAwb("");

      toast.error(errorMessage(error));

      // Rejected scans may be saved on the backend.

    } finally {

      await Promise.all([fetchDetails(selected.id), fetchLoadouts()]);

      setScanning(false);

    }

  };

  // POST /loadouts/:loadoutId/close

  const closeLoadout = async () => {

    if (!selected || selected.status !== "open" || closing) return;

    if (!(selected.orders ?? []).some((order) => order.scan_status === "accepted")) {

      toast.warn("At least one shipment must be accepted before closing the loadout.");

      return;

    }

    if (

      !window.confirm(

        `Are you sure you want to close loadout ${selected.loadout_code}? You will not be able to scan additional shipments after closing this loadout.`,

      )

    ) {

      return;

    }

    setClosing(true);

    try {

      const res = await AxiosInstance.post<ApiResponse<{ accepted_count: number }>>(

        `${API}/${selected.id}/close`,

        {},

      );

      if (!res.data.success) {

        throw new Error(res.data.message || "Failed to close loadout");

      }

      toast.success(res.data.message || "Loadout closed successfully.");

      await Promise.all([fetchDetails(selected.id), fetchLoadouts()]);

    } catch (error: unknown) {

      toast.error(errorMessage(error));

    } finally {

      setClosing(false);

    }

  };

  // Download a handover manifest containing accepted shipments only.

  const downloadManifest = async () => {

    if (!selected || downloadingPdf) return;

    setDownloadingPdf(true);

    try {

      const response = await AxiosInstance.get<ApiResponse<LoadoutDetails>>(

        `${API}/${selected.id}`,

      );

      const details = response.data.data;

      if (!response.data.success || !details) {

        throw new Error(response.data.message || "Unable to load manifest details");

      }

      // These packages are loaded only when a PDF is requested.

      const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([

        import("jspdf"),

        import("jspdf-autotable"),

      ]);

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = pdf.internal.pageSize.getWidth();
      const H = pdf.internal.pageSize.getHeight();
      const M = 12;
      const R = W - M;
      const blue: [number, number, number] = [4, 70, 219];
      const ink: [number, number, number] = [23, 37, 61];
      const muted: [number, number, number] = [99, 111, 129];
      const stroke: [number, number, number] = [218, 226, 236];
      const acceptedOrders = (details.orders ?? []).filter((order) => order.scan_status === "accepted");
      const generated = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
      });
      const clean = (value: unknown) => String(value ?? "-").replace(/[^\x20-\x7E]/g, " ").trim() || "-";
      const fit = (value: unknown, width: number) => {
        const text = clean(value);
        if (pdf.getTextWidth(text) <= width) return text;
        let truncated = text;
        while (truncated.length && pdf.getTextWidth(`${truncated}...`) > width) {
          truncated = truncated.slice(0, -1);
        }
        return `${truncated}...`;
      };
      const line = (y: number) => {
        pdf.setDrawColor(...stroke);
        pdf.setLineWidth(0.3);
        pdf.line(M, y, R, y);
      };
      const { dataUrl: logoUrl, width: logoRawW, height: logoRawH } =
        await convertImageToPngDataUrl(getImageSrc(logo));
      const logoScale = Math.min(27 / logoRawW, 17 / logoRawH);
      const logoWidth = logoRawW * logoScale;
      const logoHeight = logoRawH * logoScale;
      const loadoutNames: Record<LoadoutType, string> = {
        rto: "Reverse Loadout (RTO)",
        misroute: "Miss Loadout (Misroute)",
      };
      const drawHeader = (continued = false) => {
        pdf.addImage(logoUrl, "PNG", M, 13, logoWidth, logoHeight);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(15);
        pdf.setTextColor(...ink);
        pdf.text("Vendor Loadout Details", M + 31, 19);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(...muted);
        pdf.text(continued ? "Accepted AWB List (continued)" : "Accepted AWB List", M + 31, 26);
        pdf.setFontSize(8);
        pdf.text("Loadout Code", R, 14.5, { align: "right" });
        pdf.setFillColor(231, 240, 255);
        pdf.roundedRect(R - 51, 18, 51, 11, 1.5, 1.5, "F");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(...blue);
        pdf.text(fit(details.loadout_code, 46), R - 25.5, 25, { align: "center" });
        line(37);
      };
      drawHeader();
      // Compact single-line label/value rows. Only PDF presentation has changed.
      pdf.setFillColor(248, 250, 253);
      pdf.setDrawColor(...stroke);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(M, 42, R - M, 32, 2.5, 2.5, "FD");
      pdf.setDrawColor(227, 233, 242);
      pdf.line(109, 46, 109, 69);

      const inlineDetail = (
        label: string, value: unknown, x: number, valueX: number,
        y: number, maxWidth: number,
      ) => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8.1);
        pdf.setTextColor(...muted);
        pdf.text(`${label} :`, x, y);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8.5);
        pdf.setTextColor(...ink);
        pdf.text(fit(value, maxWidth), valueX, y);
      };

      inlineDetail("LOADOUT TYPE", loadoutNames[details.loadout_type], M + 5, M + 37, 50, 58);
      inlineDetail("CREATED AT", formatDate(details.created_at), 114, 138, 50, 56);
      inlineDetail(
        "CLOSED AT", formatDate(details.closed_at),
        M + 5, M + 37, 60, 58,
      );
      inlineDetail("STATUS", details.status.toUpperCase(), 114, 138, 60, 56);
      inlineDetail("ACCEPTED SHIPMENTS", String(acceptedOrders.length), M + 5, M + 48, 69, 23);

      line(80);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(...ink);
      pdf.text("Accepted AWBs", M, 88);
      // AWB number is printed as plain text: NO barcode is generated.
      autoTable(pdf, {
        startY: 94,
        margin: { left: M, right: M, bottom: 28, top: 45 },
        head: [["#", "AWB Number", "Previous Status", "Result Stage", "Scanned At"]],
        body: acceptedOrders.map((order, index) => [
          String(index + 1),
          clean(order.awb_number),
          clean(order.previous_status),
          clean(order.result_stage),
          clean(formatDate(order.scanned_at)),
        ]),
        theme: "grid",
        styles: {
          font: "helvetica", fontSize: 8, cellPadding: { top: 3.2, right: 2.3, bottom: 3.2, left: 2.3 },
          textColor: ink, lineColor: stroke, lineWidth: 0.16, overflow: "linebreak",
          valign: "middle",
        },
        headStyles: {
          fillColor: [239, 243, 248], textColor: ink, fontStyle: "bold",
          lineColor: stroke, lineWidth: 0.2,
        },
        alternateRowStyles: { fillColor: [251, 252, 254] },
        columnStyles: {
          0: { cellWidth: 11, halign: "center" },
          1: { cellWidth: 49 },
          2: { cellWidth: 40 },
          3: { cellWidth: 39 },
          4: { cellWidth: 47 },
        },
        didDrawPage: (data) => {
          if (data.pageNumber > 1) drawHeader(true);
        },
      });
      const pages = pdf.getNumberOfPages();
      for (let pageNumber = 1; pageNumber <= pages; pageNumber++) {
        pdf.setPage(pageNumber);
        line(H - 24);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7.4);
        pdf.setTextColor(...ink);
        pdf.text(`Generated On: ${generated}`, M, H - 17);
        pdf.text("Generated By: Vendor User", M, H - 12);
        pdf.text(`Page ${pageNumber} of ${pages}`, R, H - 17, { align: "right" });
      }
      pdf.setProperties({ title: `DAAKit Vendor Loadout - ${clean(details.loadout_code)}` });
      const filename = details.loadout_code.replace(/[^a-zA-Z0-9_-]/g, "_");
      pdf.save(`DAAKit_Vendor_Loadout_${filename}.pdf`);
      toast.success("Loadout manifest PDF downloaded");

    } catch (error: unknown) {

      toast.error(errorMessage(error));

    } finally {

      setDownloadingPdf(false);

    }

  };

  const filteredLoadouts = loadouts.filter((item) =>

    [item.loadout_code, item.status, item.loadout_type].some(

      (text) => text.toLowerCase().includes(search.trim().toLowerCase()),

    ),

  );

  const accepted = selected?.orders?.filter((order) => order.scan_status === "accepted").length ?? 0;

  const rejected = selected?.orders?.filter((order) => order.scan_status === "rejected").length ?? 0;

  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {

      setLoadingPage(false);

    }, 2000);

    return () => clearTimeout(timer);

  }, []);

  return (

    <>

      {loadingPage ? (

        <div className=" w-full h-[90vh] flex justify-center items-center">

          <div>

            <Loader2 className="h-8 w-8 animate-spin mx-auto" />

            <p className="mt-2">Loading Loadout Details...</p>

          </div>

        </div>

      ) : (

        <div className="flex h-[calc(100dvh-80px)] min-h-0 w-full min-w-0 flex-col gap-3 overflow-x-hidden overflow-y-auto overscroll-contain pb-3 lg:h-[calc(100dvh-100px)] lg:gap-4 lg:overflow-hidden lg:pb-0 bg-[#F7F8FA] text-slate-900 dark:bg-neutral-950 dark:text-white">

          <div className="shrink-0">

            <h1 className="text-xl font-bold sm:text-2xl">Vendor Loadout</h1>

            <p className="mt-1 text-sm text-slate-500">

              Create RTO or Miss loadouts, scan AWBs and close completed batches.

            </p>

          </div>

          <div className="flex min-h-0 min-w-0 shrink-0 flex-col overflow-visible lg:flex-1 lg:shrink lg:overflow-hidden rounded-sm border border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">

            <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-slate-200 px-3 dark:border-neutral-800 sm:px-5">

              {tabs.map((tab) => (

                <button

                  key={tab.id}

                  type="button"

                  onClick={() => setActiveTab(tab.id)}

                  className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium ${

                    activeTab === tab.id

                      ? "border-[#0446DB] text-[#0446DB]"

                      : "border-transparent text-slate-500 hover:text-[#0446DB]"

                  }`}

                >

                  {tab.label}

                </button>

              ))}

            </div>

            <div className="flex shrink-0 flex-col gap-3 border-b border-slate-100 p-3 dark:border-neutral-800 sm:flex-row sm:items-end sm:justify-between sm:p-4">

              <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-end">

                <button

                  type="button"

                  onClick={() => void createLoadout()}

                  disabled={creating}

                  className="inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-[#0339b5] disabled:opacity-50"

                >

                  {creating ? (

                    <Loader2 size={16} className="animate-spin" />

                  ) : (

                    <Package size={16} />

                  )}

                  Create Loadout

                </button>

              </div>

              <div className="flex flex-wrap items-center gap-2">
              <button type="button"
                onClick={() => {
                  if (!filterOpen) { setDraftStartDate(startDate); setDraftEndDate(endDate); }
                  setFilterOpen((open) => !open);
                }}
                aria-expanded={filterOpen}
                className="inline-flex h-10 items-center justify-center rounded-sm border border-slate-200 px-4 text-sm font-medium dark:border-neutral-700"
              >Filter {filterOpen ? "-" : "+"}</button>
              <button

                type="button"

                onClick={() => void fetchLoadouts()}

                disabled={loadingList}

                className="inline-flex h-10 items-center justify-center gap-2 rounded-sm border border-slate-200 px-3 text-sm dark:border-neutral-700"

              >

                <RefreshCw size={16} className={loadingList ? "animate-spin" : ""} /> Refresh

              </button>
              </div>

            </div>

            <div className="shrink-0 border-b border-slate-100 p-3 dark:border-neutral-800 sm:p-4">

              {filterOpen && (
                <form
                  className="mb-3 flex flex-wrap items-end gap-3 rounded-sm border border-slate-200 bg-slate-50/70 p-3 dark:border-neutral-700 dark:bg-neutral-800/50"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const today = todayIST();
                    if (!draftStartDate || !draftEndDate || draftStartDate > draftEndDate || draftEndDate > today) {
                      toast.warning("Select valid dates: End Date must be between Start Date and today.");
                      return;
                    }
                    setStartDate(draftStartDate);
                    setEndDate(draftEndDate);
                    setFilterOpen(false);
                  }}
                >
                  <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                    Start Date
                    <input type="date" value={draftStartDate} max={todayIST()}
                      onChange={(event) => {
                        const next = event.target.value;
                        if (!next || next > todayIST()) return;
                        setDraftStartDate(next);
                        if (draftEndDate < next) setDraftEndDate(next);
                      }}
                      className="h-9 max-w-full rounded-sm border border-slate-200 bg-white px-2 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800" />
                  </label>
                  <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                    End Date
                    <input type="date" value={draftEndDate} min={draftStartDate} max={todayIST()}
                      onChange={(event) => {
                        const next = event.target.value;
                        if (!next || next < draftStartDate || next > todayIST()) return;
                        setDraftEndDate(next);
                      }}
                      className="h-9 max-w-full rounded-sm border border-slate-200 bg-white px-2 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800" />
                  </label>
                  <button type="submit" className="h-9 rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white">Apply Filter</button>
                  <button type="button" onClick={() => {
                    const today = todayIST();
                    const start = shiftDate(today, -9);
                    setDraftStartDate(start); setDraftEndDate(today);
                    setStartDate(start); setEndDate(today); setFilterOpen(false);
                  }} className="h-9 rounded-sm border border-slate-200 bg-white px-4 text-sm dark:border-neutral-700 dark:bg-neutral-900">Reset</button>
                </form>
              )}
              <div className="relative w-full min-w-0 max-w-sm">

                <Search

                  size={16}

                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"

                />

                <input

                  value={search}

                  onChange={(event) => setSearch(event.target.value)}

                  placeholder="Search loadout code or status..."

                  className="h-10 w-full rounded-sm border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800"

                />

              </div>

            </div>

            <div className="min-h-[200px] max-h-[48dvh] min-w-0 flex-1 overflow-auto overscroll-contain lg:min-h-0 lg:max-h-none">

              <table className="w-full min-w-[850px] text-left text-sm">

                <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase text-slate-500 dark:bg-neutral-800">

                  <tr>

                    <th className="px-4 py-3">Loadout</th>

                    <th className="px-4 py-3">Created</th>

                    <th className="px-4 py-3">Accepted</th>

                    <th className="px-4 py-3">Rejected</th>

                    <th className="px-4 py-3">Status</th>

                    <th className="px-4 py-3">Action</th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">

                  {filteredLoadouts.map((item) => (

                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800/50">

                      <td className="px-4 py-3 font-semibold text-[#0446DB]">

                        {item.loadout_code}

                      </td>

                      <td className="px-4 py-3">{formatDate(item.created_at)}</td>

                      <td className="px-4 py-3">{item.accepted_count ?? 0}</td>

                      <td className="px-4 py-3">{item.rejected_count ?? 0}</td>

                      <td className="px-4 py-3">

                        <span

                          className={`rounded-full px-2 py-1 text-xs font-medium ${item.status === "open" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"}`}

                        >

                          {item.status}

                        </span>

                      </td>

                      <td className="px-4 py-3">

                        <button

                          type="button"

                          onClick={() => void fetchDetails(item.id)}

                          className="rounded-md border border-[#0446DB] px-3 py-1.5 text-xs font-medium text-[#0446DB] hover:bg-blue-50"

                        >

                          View / Scan

                        </button>

                      </td>

                    </tr>

                  ))}

                  {!loadingList && filteredLoadouts.length === 0 && (

                    <tr>

                      <td colSpan={6} className="py-12 text-center text-slate-500">

                        No loadouts found

                      </td>

                    </tr>

                  )}

                  {loadingList && (

                    <tr>

                      <td colSpan={6} className="py-12 text-center text-slate-500">

                        Loading loadouts...

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

            <div className="shrink-0 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-neutral-800">

              Showing {filteredLoadouts.length} of {loadouts.length} loadouts

            </div>

          </div>

          {selected && (

            <div

              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6"

              role="presentation"

            >

              <div

                role="dialog"

                aria-modal="true"

                aria-label="Loadout details"

                className="flex max-h-[95dvh] min-h-0 w-full min-w-0 max-w-4xl flex-col overflow-hidden rounded-sm bg-white shadow-xl dark:bg-neutral-900"

              >

                <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-neutral-800">

                  <div>

                    <h2 className="font-bold">{selected.loadout_code}</h2>

                    <p className="text-xs text-slate-500">

                      {selected.loadout_type.toUpperCase()} · {selected.status.toUpperCase()}

                    </p>

                  </div>

                  <button

                    type="button"

                    onClick={() => setSelected(null)}

                    aria-label="Close details"

                    className="rounded p-2 hover:bg-slate-100 dark:hover:bg-neutral-800"

                  >

                    <X size={20} />

                  </button>

                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">

                  <div className="flex flex-wrap gap-3 text-sm">

                    <span className="rounded-sm bg-blue-50 px-3 py-2 text-blue-700">

                      Accepted: {accepted}

                    </span>

                    <span className="rounded-sm bg-orange-50 px-3 py-2 text-orange-700">

                      Rejected: {rejected}

                    </span>

                    <span className="rounded-sm bg-slate-100 px-3 py-2 text-slate-700">

                      Total: {(selected.orders ?? []).length}

                    </span>

                  </div>

                  {selected.status === "open" && (

                    <form

                      onSubmit={(event) => void scanAwb(event)}

                      className="flex flex-col gap-2 sm:flex-row"

                    >

                      <input

                        value={awb}

                        onChange={(event) => setAwb(event.target.value)}

                        placeholder="Scan or enter AWB number"

                        autoComplete="off"

                        className="h-11 min-w-0 flex-1 rounded-sm border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800"

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

                  <div className="overflow-x-auto rounded-sm border border-slate-200 dark:border-neutral-800">

                    <table className="w-full min-w-[650px] text-left text-sm">

                      <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-neutral-800">

                        <tr>

                          <th className="px-3 py-3">AWB Number</th>

                          <th className="px-3 py-3">Order ID</th>

                          <th className="px-3 py-3">Scan Status</th>

                          <th className="px-3 py-3">Reason / Result</th>

                        </tr>

                      </thead>

                      <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">

                        {(selected.orders ?? []).map((order) => (

                          <tr key={order.id}>

                            <td className="px-3 py-3 font-medium">{order.awb_number}</td>

                            <td className="px-3 py-3">{order.order_id ?? "-"}</td>

                            <td className="px-3 py-3">{order.scan_status}</td>

                            <td className="px-3 py-3">

                              {order.rejection_reason || order.result_stage || "-"}

                            </td>

                          </tr>

                        ))}

                        {(selected.orders ?? []).length === 0 && (

                          <tr>

                            <td colSpan={4} className="py-8 text-center text-slate-500">

                              No AWBs scanned yet

                            </td>

                          </tr>

                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

                <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-slate-200 p-4 dark:border-neutral-800">

                  <button

                    type="button"

                    onClick={() => void fetchDetails(selected.id)}

                    disabled={loadingDetails}

                    className="inline-flex items-center gap-2 rounded-sm border border-slate-200 px-4 py-2 text-sm dark:border-neutral-700"

                  >

                    <RefreshCw size={15} className={loadingDetails ? "animate-spin" : ""} /> Refresh

                  </button>

                  <button

                    type="button"

                    onClick={() => void downloadManifest()}

                    disabled={downloadingPdf || loadingDetails || scanning || closing}

                    className="inline-flex items-center gap-2 rounded-sm border border-[#0446DB] px-4 py-2 text-sm font-medium text-[#0446DB] hover:bg-blue-50 disabled:opacity-50 dark:hover:bg-neutral-800"

                  >

                    {downloadingPdf ? (

                      <Loader2 size={15} className="animate-spin" />

                    ) : (

                      <Download size={15} />

                    )}

                    {downloadingPdf ? "Generating PDF..." : "Download PDF"}

                  </button>

                  {selected.status === "open" && (

                    <button

                      type="button"

                      onClick={() => void closeLoadout()}

                      disabled={closing || scanning || accepted === 0}

                      className="inline-flex items-center gap-2 rounded-sm bg-[#eb8300] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"

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

            </div>

          )}

        </div>

      )}

    </>

  );

}
