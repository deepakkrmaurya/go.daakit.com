// // import { useCallback, useEffect, useMemo, useState } from "react";
// // import type { FormEvent } from "react";
// // import axios from "axios";
// // import { toast } from "react-toastify";
// // import { Link, useNavigate } from "react-router-dom";
// // import {
// //   Building2, Search, Filter, RefreshCw, Plus, Eye, X, ChevronLeft,
// //   ChevronRight, Mail, Phone, MapPin, UserRound, ExternalLink,
// //   Loader2, CheckCircle2, AlertCircle, Pencil, Save, LockKeyhole,
// // } from "lucide-react";
// // import AxiosInstance from "@/Helper/axiosInstance";

// // const baseURL = String(import.meta.env.VITE_BASE_URL || "").replace(/\/$/, "");
// // const frontendURL = String(import.meta.env.VITE_FRONTEND_URL || "").replace(/\/$/, "");
// // const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("token") || ""}` });

// // type DC = {
// //   id?: number | string;
// //   dc_id?: number | string;
// //   dc_name?: string | null;
// //   dc_code?: string | null;
// //   username?: string | null;
// //   email?: string | null;
// //   phone?: string | number | null;
// //   address?: string | null;
// //   city?: string | null;
// //   state?: string | null;
// //   pincode?: string | number | null;
// //   is_active?: number | string | boolean | null;
// //   status?: number | string | boolean | null;
// // };
// // type Status = "all" | "active" | "inactive";
// // type EditField = "dc_name" | "dc_code" | "phone" | "email" | "address" | "city" | "state" | "pincode" | "password";
// // type EditForm = Record<EditField, string>;
// // const emptyEdit: EditForm = { dc_name: "", dc_code: "", phone: "", email: "", address: "", city: "", state: "", pincode: "", password: "" };
// // const fields: { key: EditField; label: string }[] = [
// //   { key: "dc_name", label: "DC Name" }, { key: "dc_code", label: "DC Code" },
// //   { key: "email", label: "Email Address" }, { key: "phone", label: "Phone Number" },
// //   { key: "city", label: "City" }, { key: "state", label: "State" },
// //   { key: "pincode", label: "Pincode" }, { key: "address", label: "Complete Address" },
// //   { key: "password", label: "New Password (optional)" },
// // ];
// // const dcId = (dc: DC) => dc.dc_id ?? dc.id;
// // const isActive = (dc: DC) => Number(dc.is_active ?? dc.status) === 1;
// // const display = (v: unknown) => v === null || v === undefined || v === "" ? "—" : String(v);
// // const fieldClass = "mt-1.5 h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100";
// // const errorText = (err: unknown) => axios.isAxiosError(err) ? err.response?.data?.message || err.message : err instanceof Error ? err.message : "Something went wrong";

// // export default function UserDistributionCenterListing() {
// //   const navigate = useNavigate();
// //   const [permissions, setPermissions] = useState<string[]>([]);
// //   const [permissionLoading, setPermissionLoading] = useState(true);
// //   const [permissionError, setPermissionError] = useState("");
// //   const [list, setList] = useState<DC[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [search, setSearch] = useState("");
// //   const [status, setStatus] = useState<Status>("all");
// //   const [drawerOpen, setDrawerOpen] = useState(false);
// //   const [draftStatus, setDraftStatus] = useState<Status>("all");
// //   const [draftCity, setDraftCity] = useState("");
// //   const [city, setCity] = useState("");
// //   const [page, setPage] = useState(1);
// //   const [limit, setLimit] = useState(20);
// //   const [selected, setSelected] = useState<DC | null>(null);
// //   const [editing, setEditing] = useState(false);
// //   const [editForm, setEditForm] = useState<EditForm>({ ...emptyEdit });
// //   const [saving, setSaving] = useState(false);

// //   const can = (code: string) => permissions.includes(code) || permissions.includes("ADMIN_FULL_ACCESS");

// //   const fetchPermissions = useCallback(async () => {
// //     setPermissionLoading(true);
// //     setPermissionError("");
// //     try {
// //       const result = await axios.get(`${baseURL}/api/user/getUserPermissions`, { headers: headers() });
// //       const codes = result.data?.data?.data;
// //       if (!Array.isArray(codes)) throw new Error("Invalid permissions response");
// //       setPermissions(codes);
// //       if (!codes.includes("VIEW_DC") && !codes.includes("ADMIN_FULL_ACCESS")) {
// //         navigate("/unauthorized", { replace: true });
// //       }
// //     } catch (error) {
// //       setPermissionError(errorText(error));
// //     } finally {
// //       setPermissionLoading(false);
// //     }
// //   }, [navigate]);

// //   const fetchDCs = useCallback(async () => {
// //     setLoading(true);
// //     try {
// //       const token = localStorage.getItem("merchantToken") || localStorage.getItem("token");
// //       const resultRows: DC[] = [];
// //       let apiPage = 1;
// //       let more = true;
// //       while (more && apiPage <= 1000) {
// //         const response = await axios.get(`${baseURL}/api/user/getDcs`, {
// //           headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}`, "x-auth-token": token } : {}) },
// //           params: { page: apiPage, limit: 100 },
// //         });
// //         if (response.data?.success === false) throw new Error(response.data?.message || "Unable to load distribution centers");
// //         const body = response.data?.data;
// //         const rows: DC[] = Array.isArray(body) ? body : Array.isArray(body?.dcs) ? body.dcs : Array.isArray(response.data?.dcs) ? response.data.dcs : [];
// //         resultRows.push(...rows);
// //         const pagination = response.data?.pagination ?? body?.pagination;
// //         const totalPages = Number(pagination?.totalPages ?? pagination?.total_pages) || (Number(pagination?.total) ? Math.ceil(Number(pagination.total) / (Number(pagination.limit) || 100)) : 0);
// //         // If API does not return pagination, treat the response as a complete list.
// //         more = totalPages > 0 && apiPage < totalPages && rows.length > 0;
// //         apiPage++;
// //       }
// //       setList(resultRows);
// //     } catch (error) {
// //       toast.error(errorText(error));
// //       setList([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []);

// //   useEffect(() => { void fetchPermissions(); }, [fetchPermissions]);
// //   useEffect(() => { if (!permissionLoading && can("VIEW_DC")) void fetchDCs(); }, [permissionLoading, permissions, fetchDCs]);

// //   const cities = useMemo(() => [...new Set(list.map((d) => String(d.city || "").trim()).filter(Boolean))].sort(), [list]);
// //   const filtered = useMemo(() => list.filter((dc) => {
// //     const q = search.trim().toLowerCase();
// //     const searchable = [dc.dc_name, dc.dc_code, dc.username, dc.email, dc.phone, dc.address, dc.city, dc.state, dc.pincode]
// //       .some((value) => String(value ?? "").toLowerCase().includes(q));
// //     const statusMatch = status === "all" || (status === "active" ? isActive(dc) : !isActive(dc));
// //     return searchable && statusMatch && (!city || String(dc.city || "").toLowerCase() === city.toLowerCase());
// //   }), [list, search, status, city]);
// //   const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
// //   const visible = useMemo(() => filtered.slice((page - 1) * limit, page * limit), [filtered, page, limit]);
// //   useEffect(() => { setPage(1); }, [search, status, city, limit]);
// //   useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

// //   const openDC = (dc: DC) => {
// //     setSelected(dc);
// //     setEditing(false);
// //     setEditForm({
// //       ...emptyEdit,
// //       dc_name: String(dc.dc_name ?? ""), dc_code: String(dc.dc_code ?? ""),
// //       email: String(dc.email ?? ""), phone: String(dc.phone ?? ""),
// //       city: String(dc.city ?? ""), state: String(dc.state ?? ""),
// //       pincode: String(dc.pincode ?? ""), address: String(dc.address ?? ""),
// //     });
// //   };
// //   const closeDC = () => { if (!saving) { setSelected(null); setEditing(false); } };

// //   const updateDC = async (patch: Record<string, string | number>) => {
// //     if (!selected || !can("UPDATE_DC") || saving) return;
// //     const id = dcId(selected);
// //     if (id === null || id === undefined) return toast.error("DC ID is missing");
// //     setSaving(true);
// //     try {
// //       const res = await AxiosInstance.patch(`/api/user/updateDc/${id}`, patch);
// //       if (res.data?.success === false) throw new Error(res.data?.message || "Update failed");
// //       const updated = res.data?.data?.dc as DC | undefined;
// //       if (updated) {
// //         setList((prev) => prev.map((d) => String(dcId(d)) === String(id) ? { ...d, ...updated } : d));
// //         setSelected((prev) => prev ? { ...prev, ...updated } : prev);
// //       } else {
// //         await fetchDCs();
// //         setSelected((prev) => prev ? { ...prev, ...patch } as DC : prev);
// //       }
// //       setEditing(false);
// //       setEditForm((prev) => ({ ...prev, password: "" }));
// //       toast.success(res.data?.message || "Distribution center updated");
// //     } catch (error) {
// //       toast.error(errorText(error));
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const saveDetails = (event: FormEvent<HTMLFormElement>) => {
// //     event.preventDefault();
// //     if (!["dc_name", "dc_code", "email"].every((key) => editForm[key as EditField].trim())) return toast.error("DC name, code and email are required");
// //     if (editForm.password && (editForm.password.length < 8 || new TextEncoder().encode(editForm.password).length > 72)) return toast.error("Password must be between 8 and 72 bytes");
// //     const { password, ...values } = editForm;
// //     void updateDC({ ...values, ...(password ? { password } : {}) });
// //   };

// //   if (permissionLoading) return <div className="flex h-[80vh] items-center justify-center gap-2 text-sm"><Loader2 className="h-5 w-5 animate-spin text-[#0446DB]" /> Checking permissions...</div>;
// //   if (permissionError) return (
// //     <div className="flex h-[70vh] flex-col items-center justify-center gap-3 text-sm">
// //       <AlertCircle className="h-7 w-7 text-red-500" />
// //       <p>Could not verify permissions: {permissionError}</p>
// //       <button onClick={() => void fetchPermissions()} className="rounded-md bg-[#0446DB] px-4 py-2 font-medium text-white">Retry</button>
// //     </div>
// //   );
// //   if (!can("VIEW_DC")) return null;

// //   return (
// //     <div className="flex h-[calc(100dvh-80px)] min-h-0 w-full flex-col overflow-hidden bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
// //       <div className="shrink-0 space-y-3 border-b border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900">
// //         <div className="flex flex-wrap items-center justify-between gap-3">
// //           <div><h1 className="text-2xl font-semibold">Distribution Centers</h1><p className="mt-1 text-xs text-gray-500 dark:text-gray-400">View and manage delivery center accounts and locations</p></div>
// //           <div className="flex flex-wrap items-center gap-2">
// //             <button type="button" disabled={loading} onClick={() => void fetchDCs()} className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 px-3 text-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button>
// //             {
// //               (permissions.includes('CREATE_DC') || permissions.includes('ADMIN_FULL_ACCESS') )&& (

// //                 <Link to="/user/onboarding/distribution-center" className="inline-flex h-9 items-center gap-2 rounded-md bg-[#0446DB] px-3 text-sm font-medium text-white hover:bg-blue-800"><Plus className="h-4 w-4" /> Add DC</Link>
// //               )
// //             }
// //           </div>
// //         </div>
// //         <div className="flex flex-wrap items-center gap-2">
// //           <div className="relative min-w-[220px] flex-1 sm:max-w-lg">
// //             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
// //             <input aria-label="Search distribution centers" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, code, city, email..." className="h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-8 text-sm outline-none focus:border-[#0446DB] dark:border-gray-700 dark:bg-gray-800" />
// //             {!!search && <button type="button" aria-label="Clear search" onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"><X className="h-4 w-4" /></button>}
// //           </div>
// //           <button type="button" onClick={() => { setDraftStatus(status); setDraftCity(city); setDrawerOpen(true); }} className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800"><Filter className="h-4 w-4" /> Filters {city && <span className="rounded bg-blue-50 px-1.5 text-[#0446DB]">1</span>}</button>
// //         </div>
// //         <div className="flex gap-2 overflow-x-auto pb-1">
// //           {([ { value: "all", label: "All" }, { value: "active", label: "Active" }, { value: "inactive", label: "Inactive" } ] as const).map((tab) => (
// //             <button key={tab.value} type="button" onClick={() => setStatus(tab.value)} className={`shrink-0 rounded-md border px-4 py-2 text-sm font-medium transition ${status === tab.value ? "border-[#0446DB] bg-[#0446DB] text-white" : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}>{tab.label}</button>
// //           ))}
// //         </div>
// //       </div>

// //       <div className="min-h-0 flex-1 overflow-auto bg-white dark:bg-gray-900">
// //         <table className="w-full min-w-[1080px] border-separate border-spacing-0 text-sm">
// //           <thead className="sticky top-0 z-20 bg-gray-50 text-left text-xs font-semibold uppercase text-gray-600 dark:bg-gray-800 dark:text-gray-300">
// //             <tr>{["Distribution Center", "Code / Username", "Contact", "Location", "Status", "Actions"].map((heading) => <th key={heading} className="whitespace-nowrap border-b border-gray-200 px-4 py-3 dark:border-gray-700">{heading}</th>)}</tr>
// //           </thead>
// //           <tbody>
// //             {loading ? <tr><td colSpan={6} className="py-20 text-center text-gray-500"><Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-[#0446DB]" />Loading Distribution Centers...</td></tr>
// //             : visible.length === 0 ? <tr><td colSpan={6} className="py-20 text-center text-gray-500"><Building2 className="mx-auto mb-3 h-8 w-8 text-gray-300" />No distribution centers found</td></tr>
// //             : visible.map((dc, index) => (
// //               <tr key={String(dcId(dc) ?? index)} className="hover:bg-blue-50/40 dark:hover:bg-gray-800/50">
// //                 <td className="border-b border-gray-100 px-4 py-3 dark:border-gray-800"><div className="flex items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-950/40"><Building2 className="h-4 w-4" /></div><div className="min-w-0"><div className="max-w-[250px] truncate font-semibold">{display(dc.dc_name)}</div><div className="mt-0.5 text-xs text-gray-400">ID: {display(dcId(dc))}</div></div></div></td>
// //                 <td className="border-b border-gray-100 px-4 py-3 dark:border-gray-800"><div className="font-mono text-xs font-semibold">{display(dc.dc_code)}</div><div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500"><UserRound className="h-3.5 w-3.5" /> {display(dc.username)}</div></td>
// //                 <td className="border-b border-gray-100 px-4 py-3 dark:border-gray-800"><div className="flex items-center gap-1.5 text-xs"><Mail className="h-3.5 w-3.5 text-gray-400" /><span className="max-w-[215px] truncate">{display(dc.email)}</span></div><div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500"><Phone className="h-3.5 w-3.5" /> {display(dc.phone)}</div></td>
// //                 <td className="border-b border-gray-100 px-4 py-3 dark:border-gray-800"><div className="flex items-start gap-1.5"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" /><div><div className="text-sm font-medium">{display(dc.city)}</div><div className="mt-0.5 text-xs text-gray-500">{display(dc.state)}{dc.pincode ? ` · ${dc.pincode}` : ""}</div></div></div></td>
// //                 <td className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">{isActive(dc) ? <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400"><span className="h-1.5 w-1.5 rounded-full bg-green-500" />Active</span> : <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-950/30 dark:text-red-400"><span className="h-1.5 w-1.5 rounded-full bg-red-500" />Inactive</span>}</td>
// //                 <td className="border-b border-gray-100 px-4 py-3 dark:border-gray-800"><div className="flex items-center gap-2"><button type="button" onClick={() => openDC(dc)} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-200 px-2.5 text-xs font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-[#0446DB] dark:border-gray-700 dark:text-gray-200"><Eye className="h-3.5 w-3.5" />View / Edit</button>{can("LOGIN_DC") && isActive(dc) && <a href={`${frontendURL}/incognitoLogin/${encodeURIComponent(localStorage.getItem("token") || "")}/${encodeURIComponent(String(dcId(dc) ?? ""))}/dc`} target="_blank" rel="noopener noreferrer" className="inline-flex h-8 items-center gap-1 rounded-md bg-[#0446DB] px-2.5 text-xs font-medium text-white hover:bg-blue-800">Login<ExternalLink className="h-3.5 w-3.5" /></a>}</div></td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //       <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3 text-xs dark:border-gray-800 dark:bg-gray-900">
// //         <span className="text-gray-600 dark:text-gray-300">{filtered.length ? `${(page - 1) * limit + 1}–${Math.min(page * limit, filtered.length)} of ${filtered.length}` : "0"} distribution centers</span>
// //         <div className="flex items-center gap-2"><span>Rows</span><select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="rounded border border-gray-200 px-2 py-1 dark:border-gray-700 dark:bg-gray-800">{[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}</select><button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded border border-gray-200 p-1.5 disabled:opacity-30 dark:border-gray-700"><ChevronLeft className="h-4 w-4" /></button><span>Page {page} of {totalPages}</span><button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded border border-gray-200 p-1.5 disabled:opacity-30 dark:border-gray-700"><ChevronRight className="h-4 w-4" /></button></div>
// //       </div>

// //       {drawerOpen && <div className="fixed inset-0 z-[100] flex justify-end bg-black/40" onMouseDown={(e) => { if (e.target === e.currentTarget) setDrawerOpen(false); }}><div className="flex h-full w-full max-w-md flex-col bg-white shadow-xl dark:bg-gray-900"><div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800"><div><h2 className="text-lg font-semibold">Advanced Filters</h2><p className="mt-1 text-xs text-gray-500">Filter distribution centers by city and status</p></div><button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close filters"><X className="h-5 w-5" /></button></div><form onSubmit={(e) => { e.preventDefault(); setStatus(draftStatus); setCity(draftCity); setDrawerOpen(false); }} className="flex min-h-0 flex-1 flex-col"><div className="flex-1 space-y-5 overflow-y-auto px-5 py-5"><label className="block text-sm font-medium">Status<select value={draftStatus} onChange={(e) => setDraftStatus(e.target.value as Status)} className={fieldClass}><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select></label><label className="block text-sm font-medium">City<select value={draftCity} onChange={(e) => setDraftCity(e.target.value)} className={fieldClass}><option value="">All cities</option>{cities.map((name) => <option key={name} value={name}>{name}</option>)}</select></label></div><div className="flex gap-3 border-t border-gray-200 p-5 dark:border-gray-800"><button type="button" onClick={() => { setDraftCity(""); setDraftStatus("all"); setCity(""); setStatus("all"); setDrawerOpen(false); }} className="h-10 flex-1 rounded-md border border-gray-200 text-sm font-medium dark:border-gray-700">Reset</button><button type="submit" className="h-10 flex-1 rounded-md bg-[#0446DB] text-sm font-medium text-white hover:bg-blue-800">Apply Filters</button></div></form></div></div>}

// //       {selected && <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-3 sm:p-5" onMouseDown={(e) => { if (e.target === e.currentTarget) closeDC(); }}><div role="dialog" aria-modal="true" aria-label="Distribution center details" className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900"><div className="flex shrink-0 items-start justify-between bg-[#0446DB] px-5 py-4 text-white"><div className="flex items-center gap-3"><Building2 className="h-6 w-6" /><div><h2 className="text-lg font-semibold">{display(selected.dc_name)}</h2><p className="text-xs text-blue-100">{display(selected.dc_code)} · ID {display(dcId(selected))}</p></div></div><button type="button" disabled={saving} onClick={closeDC} aria-label="Close details"><X className="h-5 w-5" /></button></div><div className="min-h-0 flex-1 overflow-y-auto p-5"><div className="mb-5 flex items-center justify-between rounded-md border border-gray-200 px-4 py-3 dark:border-gray-700"><span className="text-sm font-medium">Account Status</span><span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isActive(selected) ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"}`}>{isActive(selected) ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}{isActive(selected) ? "Active" : "Inactive"}</span></div>{!editing ? <><div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{[ ["DC ID", dcId(selected)], ["DC Code", selected.dc_code], ["Username", selected.username], ["Email", selected.email], ["Phone", selected.phone], ["City", selected.city], ["State", selected.state], ["Pincode", selected.pincode] ].map(([label, value]) => <div key={String(label)} className="rounded-md border border-gray-200 p-3.5 dark:border-gray-700"><p className="text-xs text-gray-500">{label}</p><p className="mt-1 break-words text-sm font-semibold">{display(value)}</p></div>)}</div><div className="mt-3 rounded-md border border-gray-200 p-3.5 dark:border-gray-700"><p className="text-xs text-gray-500">Complete Address</p><p className="mt-1 text-sm">{display(selected.address)}</p></div></> : <form id="dc-edit-form" onSubmit={saveDetails} className="grid grid-cols-1 gap-4 sm:grid-cols-2">{fields.map(({ key, label }) => <label key={key} className={`block text-sm font-medium ${key === "address" ? "sm:col-span-2" : ""}`}>{label}{key === "address" ? <textarea rows={3} value={editForm[key]} onChange={(e) => setEditForm((p) => ({ ...p, [key]: e.target.value }))} className={`${fieldClass} h-auto py-2`} /> : <input type={key === "password" ? "password" : key === "email" ? "email" : "text"} autoComplete={key === "password" ? "new-password" : "off"} value={editForm[key]} onChange={(e) => setEditForm((p) => ({ ...p, [key]: e.target.value }))} className={fieldClass} />}</label>)}<div className="sm:col-span-2 flex items-center gap-2 text-xs text-gray-500"><LockKeyhole className="h-4 w-4" /> Changing a DC password revokes its existing sessions.</div></form>}</div><div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/40">{can("UPDATE_DC") && (!editing ? <><button type="button" onClick={() => setEditing(true)} className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 px-3 text-sm font-medium dark:border-gray-700"><Pencil className="h-4 w-4" /> Edit DC</button><button type="button" disabled={saving} onClick={() => void updateDC({ is_active: isActive(selected) ? 0 : 1 })} className="h-9 rounded-md border border-gray-200 px-3 text-sm font-medium disabled:opacity-50 dark:border-gray-700">{saving ? "Updating..." : isActive(selected) ? "Deactivate" : "Activate"}</button></> : <><button type="button" disabled={saving} onClick={() => setEditing(false)} className="h-9 rounded-md border border-gray-200 px-3 text-sm font-medium dark:border-gray-700">Cancel Edit</button><button form="dc-edit-form" type="submit" disabled={saving} className="inline-flex h-9 items-center gap-2 rounded-md bg-[#0446DB] px-3 text-sm font-medium text-white disabled:opacity-50"><Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}</button></>)}<button type="button" disabled={saving} onClick={closeDC} className="h-9 rounded-md bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50">Close</button></div></div></div>}
// //     </div>
// //   );
// // }

// import { useCallback, useEffect, useMemo, useState } from "react";
// import type { FormEvent } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { Link } from "react-router-dom";
// import {
//   Building2,
//   Search,
//   Filter,
//   RefreshCw,
//   Plus,
//   Eye,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   Mail,
//   Phone,
//   MapPin,
//   UserRound,
//   ExternalLink,
//   Loader2,
//   CheckCircle2,
//   AlertCircle,
//   Pencil,
//   Save,
//   LockKeyhole,
// } from "lucide-react";
// import AxiosInstance from "@/Helper/axiosInstance";

// const baseURL = String(import.meta.env.VITE_BASE_URL || "").replace(/\/$/, "");
// const frontendURL = String(import.meta.env.VITE_FRONTEND_URL || "").replace(/\/$/, "");

// type DC = {
//   id?: number | string;
//   dc_id?: number | string;
//   dc_name?: string | null;
//   dc_code?: string | null;
//   username?: string | null;
//   email?: string | null;
//   phone?: string | number | null;
//   address?: string | null;
//   city?: string | null;
//   state?: string | null;
//   pincode?: string | number | null;
//   is_active?: number | string | boolean | null;
//   status?: number | string | boolean | null;
// };
// type Status = "all" | "active" | "inactive";
// type EditField =
//   | "dc_name"
//   | "dc_code"
//   | "phone"
//   | "email"
//   | "address"
//   | "city"
//   | "state"
//   | "pincode"
//   | "password";
// type EditForm = Record<EditField, string>;
// const emptyEdit: EditForm = {
//   dc_name: "",
//   dc_code: "",
//   phone: "",
//   email: "",
//   address: "",
//   city: "",
//   state: "",
//   pincode: "",
//   password: "",
// };
// const fields: { key: EditField; label: string }[] = [
//   { key: "dc_name", label: "DC Name" },
//   { key: "dc_code", label: "DC Code" },
//   { key: "email", label: "Email Address" },
//   { key: "phone", label: "Phone Number" },
//   { key: "city", label: "City" },
//   { key: "state", label: "State" },
//   { key: "pincode", label: "Pincode" },
//   { key: "address", label: "Complete Address" },
//   { key: "password", label: "New Password (optional)" },
// ];
// const dcId = (dc: DC) => dc.dc_id ?? dc.id;
// const isActive = (dc: DC) => Number(dc.is_active ?? dc.status) === 1;
// const display = (v: unknown) => (v === null || v === undefined || v === "" ? "—" : String(v));
// const fieldClass =
//   "mt-1.5 h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100";
// const errorText = (err: unknown) =>
//   axios.isAxiosError(err)
//     ? err.response?.data?.message || err.message
//     : err instanceof Error
//       ? err.message
//       : "Something went wrong";

// export default function UserDistributionCenterListing() {
//   const [permissions] = useState<string[]>(() => {
//     try {
//       const stored = JSON.parse(localStorage.getItem("permission") || "[]");
//       return Array.isArray(stored) ? stored : [];
//     } catch {
//       return [];
//     }
//   });
//   const [list, setList] = useState<DC[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState<Status>("all");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [draftStatus, setDraftStatus] = useState<Status>("all");
//   const [draftCity, setDraftCity] = useState("");
//   const [city, setCity] = useState("");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(20);
//   const [selected, setSelected] = useState<DC | null>(null);
//   const [editing, setEditing] = useState(false);
//   const [editForm, setEditForm] = useState<EditForm>({ ...emptyEdit });
//   const [saving, setSaving] = useState(false);

//   const can = (code: string) =>
//     permissions.includes(code) || permissions.includes("ADMIN_FULL_ACCESS");

//   const fetchDCs = useCallback(async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("merchantToken") || localStorage.getItem("token");
//       const resultRows: DC[] = [];
//       let apiPage = 1;
//       let more = true;
//       while (more && apiPage <= 1000) {
//         const response = await axios.get(`${baseURL}/api/user/getDcs`, {
//           headers: {
//             "Content-Type": "application/json",
//             ...(token ? { Authorization: `Bearer ${token}`, "x-auth-token": token } : {}),
//           },
//           params: { page: apiPage, limit: 100 },
//         });
//         if (response.data?.success === false)
//           throw new Error(response.data?.message || "Unable to load distribution centers");
//         const body = response.data?.data;
//         const rows: DC[] = Array.isArray(body)
//           ? body
//           : Array.isArray(body?.dcs)
//             ? body.dcs
//             : Array.isArray(response.data?.dcs)
//               ? response.data.dcs
//               : [];
//         resultRows.push(...rows);
//         const pagination = response.data?.pagination ?? body?.pagination;
//         const totalPages =
//           Number(pagination?.totalPages ?? pagination?.total_pages) ||
//           (Number(pagination?.total)
//             ? Math.ceil(Number(pagination.total) / (Number(pagination.limit) || 100))
//             : 0);
//         // If API does not return pagination, treat the response as a complete list.
//         more = totalPages > 0 && apiPage < totalPages && rows.length > 0;
//         apiPage++;
//       }
//       setList(resultRows);
//     } catch (error) {
//       toast.error(errorText(error));
//       setList([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     void fetchDCs();
//   }, [fetchDCs]);

//   const cities = useMemo(
//     () => [...new Set(list.map((d) => String(d.city || "").trim()).filter(Boolean))].sort(),
//     [list],
//   );
//   const filtered = useMemo(
//     () =>
//       list.filter((dc) => {
//         const q = search.trim().toLowerCase();
//         const searchable = [
//           dc.dc_name,
//           dc.dc_code,
//           dc.username,
//           dc.email,
//           dc.phone,
//           dc.address,
//           dc.city,
//           dc.state,
//           dc.pincode,
//         ].some((value) =>
//           String(value ?? "")
//             .toLowerCase()
//             .includes(q),
//         );
//         const statusMatch =
//           status === "all" || (status === "active" ? isActive(dc) : !isActive(dc));
//         return (
//           searchable &&
//           statusMatch &&
//           (!city || String(dc.city || "").toLowerCase() === city.toLowerCase())
//         );
//       }),
//     [list, search, status, city],
//   );
//   const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
//   const visible = useMemo(
//     () => filtered.slice((page - 1) * limit, page * limit),
//     [filtered, page, limit],
//   );
//   useEffect(() => {
//     setPage(1);
//   }, [search, status, city, limit]);
//   useEffect(() => {
//     if (page > totalPages) setPage(totalPages);
//   }, [page, totalPages]);

//   const openDC = (dc: DC) => {
//     setSelected(dc);
//     setEditing(false);
//     setEditForm({
//       ...emptyEdit,
//       dc_name: String(dc.dc_name ?? ""),
//       dc_code: String(dc.dc_code ?? ""),
//       email: String(dc.email ?? ""),
//       phone: String(dc.phone ?? ""),
//       city: String(dc.city ?? ""),
//       state: String(dc.state ?? ""),
//       pincode: String(dc.pincode ?? ""),
//       address: String(dc.address ?? ""),
//     });
//   };
//   const closeDC = () => {
//     if (!saving) {
//       setSelected(null);
//       setEditing(false);
//     }
//   };

//   const updateDC = async (patch: Record<string, string | number>) => {
//     if (!selected || !can("UPDATE_DC") || saving) return;
//     const id = dcId(selected);
//     if (id === null || id === undefined) return toast.error("DC ID is missing");
//     setSaving(true);
//     try {
//       const res = await AxiosInstance.patch(`/api/user/updateDc/${id}`, patch);
//       if (res.data?.success === false) throw new Error(res.data?.message || "Update failed");
//       const updated = res.data?.data?.dc as DC | undefined;
//       if (updated) {
//         setList((prev) =>
//           prev.map((d) => (String(dcId(d)) === String(id) ? { ...d, ...updated } : d)),
//         );
//         setSelected((prev) => (prev ? { ...prev, ...updated } : prev));
//       } else {
//         await fetchDCs();
//         setSelected((prev) => (prev ? ({ ...prev, ...patch } as DC) : prev));
//       }
//       setEditing(false);
//       setEditForm((prev) => ({ ...prev, password: "" }));
//       toast.success(res.data?.message || "Distribution center updated");
//     } catch (error) {
//       toast.error(errorText(error));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const saveDetails = (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if (!["dc_name", "dc_code", "email"].every((key) => editForm[key as EditField].trim()))
//       return toast.error("DC name, code and email are required");
//     if (
//       editForm.password &&
//       (editForm.password.length < 8 || new TextEncoder().encode(editForm.password).length > 72)
//     )
//       return toast.error("Password must be between 8 and 72 bytes");
//     const { password, ...values } = editForm;
//     void updateDC({ ...values, ...(password ? { password } : {}) });
//   };

//       const [loadingPage, setLoadingPage] = useState(true);

// useEffect(() => {
//   const timer = setTimeout(() => {
//     setLoadingPage(false);
//   }, 2000);

//   return () => clearTimeout(timer);
// }, []);

//   if (!can("VIEW_DC")) return null;

//   return (

//     <>
//     {
//       loadingPage ? (
//         <>
//                 <div className=" w-full h-[90vh] flex justify-center items-center">
//                   <div>
//                     <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//                     <p className="mt-2"> Loading DC Details...</p>
//                   </div>
//                 </div>
//         </>
//       ):(

//         <div className="flex h-[calc(100dvh-80px)] min-h-0 w-full flex-col overflow-hidden bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
//           <div className="shrink-0 space-y-3 border-b border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900">
//             <div className="flex flex-wrap items-center justify-between gap-3">
//               <div>
//                 <h1 className="text-2xl font-semibold">Distribution Centers</h1>
//                 <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
//                   View and manage delivery center accounts and locations
//                 </p>
//               </div>
//               <div className="flex flex-wrap items-center gap-2">
//                 <button
//                   type="button"
//                   disabled={loading}
//                   onClick={() => void fetchDCs()}
//                   className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 px-3 text-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
//                 >
//                   <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
//                 </button>
//                 <Link
//                   to="/user/onboarding/distribution-center"
//                   className="inline-flex h-9 items-center gap-2 rounded-md bg-[#0446DB] px-3 text-sm font-medium text-white hover:bg-blue-800"
//                 >
//                   <Plus className="h-4 w-4" /> Add DC
//                 </Link>
//               </div>
//             </div>
//             <div className="flex flex-wrap items-center gap-2">
//               <div className="relative min-w-[220px] flex-1 sm:max-w-lg">
//                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//                 <input
//                   aria-label="Search distribution centers"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Search name, code, city, email..."
//                   className="h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-8 text-sm outline-none focus:border-[#0446DB] dark:border-gray-700 dark:bg-gray-800"
//                 />
//                 {!!search && (
//                   <button
//                     type="button"
//                     aria-label="Clear search"
//                     onClick={() => setSearch("")}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 )}
//               </div>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setDraftStatus(status);
//                   setDraftCity(city);
//                   setDrawerOpen(true);
//                 }}
//                 className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
//               >
//                 <Filter className="h-4 w-4" /> Filters{" "}
//                 {city && <span className="rounded bg-blue-50 px-1.5 text-[#0446DB]">1</span>}
//               </button>
//             </div>
//             <div className="flex gap-2 overflow-x-auto pb-1">
//               {(
//                 [
//                   { value: "all", label: "All" },
//                   { value: "active", label: "Active" },
//                   { value: "inactive", label: "Inactive" },
//                 ] as const
//               ).map((tab) => (
//                 <button
//                   key={tab.value}
//                   type="button"
//                   onClick={() => setStatus(tab.value)}
//                   className={`shrink-0 rounded-md border px-4 py-2 text-sm font-medium transition ${status === tab.value ? "border-[#0446DB] bg-[#0446DB] text-white" : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="min-h-0 flex-1 overflow-auto bg-white dark:bg-gray-900">
//             <table className="w-full min-w-[1080px] border-separate border-spacing-0 text-sm">
//               <thead className="sticky top-0 z-20 bg-gray-50 text-left text-xs font-semibold uppercase text-gray-600 dark:bg-gray-800 dark:text-gray-300">
//                 <tr>
//                   {[
//                     "Distribution Center",
//                     "Code / Username",
//                     "Contact",
//                     "Location",
//                     "Status",
//                     "Actions",
//                   ].map((heading) => (
//                     <th
//                       key={heading}
//                       className="whitespace-nowrap border-b border-gray-200 px-4 py-3 dark:border-gray-700"
//                     >
//                       {heading}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan={6} className="py-20 text-center text-gray-500">
//                       <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-[#0446DB]" />
//                       Loading Distribution Centers...
//                     </td>
//                   </tr>
//                 ) : visible.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} className="py-20 text-center text-gray-500">
//                       <Building2 className="mx-auto mb-3 h-8 w-8 text-gray-300" />
//                       No distribution centers found
//                     </td>
//                   </tr>
//                 ) : (
//                   visible.map((dc, index) => (
//                     <tr
//                       key={String(dcId(dc) ?? index)}
//                       className="hover:bg-blue-50/40 dark:hover:bg-gray-800/50"
//                     >
//                       <td className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
//                         <div className="flex items-center gap-3">
//                           <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-950/40">
//                             <Building2 className="h-4 w-4" />
//                           </div>
//                           <div className="min-w-0">
//                             <div className="max-w-[250px] truncate font-semibold">
//                               {display(dc.dc_name)}
//                             </div>
//                             <div className="mt-0.5 text-xs text-gray-400">ID: {display(dcId(dc))}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
//                         <div className="font-mono text-xs font-semibold">{display(dc.dc_code)}</div>
//                         <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
//                           <UserRound className="h-3.5 w-3.5" /> {display(dc.username)}
//                         </div>
//                       </td>
//                       <td className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
//                         <div className="flex items-center gap-1.5 text-xs">
//                           <Mail className="h-3.5 w-3.5 text-gray-400" />
//                           <span className="max-w-[215px] truncate">{display(dc.email)}</span>
//                         </div>
//                         <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
//                           <Phone className="h-3.5 w-3.5" /> {display(dc.phone)}
//                         </div>
//                       </td>
//                       <td className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
//                         <div className="flex items-start gap-1.5">
//                           <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
//                           <div>
//                             <div className="text-sm font-medium">{display(dc.city)}</div>
//                             <div className="mt-0.5 text-xs text-gray-500">
//                               {display(dc.state)}
//                               {dc.pincode ? ` · ${dc.pincode}` : ""}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
//                         {isActive(dc) ? (
//                           <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400">
//                             <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
//                             Active
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-950/30 dark:text-red-400">
//                             <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
//                             Inactive
//                           </span>
//                         )}
//                       </td>
//                       <td className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
//                         <div className="flex items-center gap-2">
//                           <button
//                             type="button"
//                             onClick={() => openDC(dc)}
//                             className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-200 px-2.5 text-xs font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-[#0446DB] dark:border-gray-700 dark:text-gray-200"
//                           >
//                             <Eye className="h-3.5 w-3.5" />
//                             View / Edit
//                           </button>
//                           {can("LOGIN_DC") && isActive(dc) && (
//                             <a
//                               href={`${frontendURL}/incognitoLogin/${encodeURIComponent(localStorage.getItem("token") || "")}/${encodeURIComponent(String(dcId(dc) ?? ""))}/dc`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="inline-flex h-8 items-center gap-1 rounded-md bg-[#0446DB] px-2.5 text-xs font-medium text-white hover:bg-blue-800"
//                             >
//                               Login
//                               <ExternalLink className="h-3.5 w-3.5" />
//                             </a>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3 text-xs dark:border-gray-800 dark:bg-gray-900">
//             <span className="text-gray-600 dark:text-gray-300">
//               {filtered.length
//                 ? `${(page - 1) * limit + 1}–${Math.min(page * limit, filtered.length)} of ${filtered.length}`
//                 : "0"}{" "}
//               distribution centers
//             </span>
//             <div className="flex items-center gap-2">
//               <span>Rows</span>
//               <select
//                 value={limit}
//                 onChange={(e) => setLimit(Number(e.target.value))}
//                 className="rounded border border-gray-200 px-2 py-1 dark:border-gray-700 dark:bg-gray-800"
//               >
//                 {[10, 20, 50, 100].map((n) => (
//                   <option key={n} value={n}>
//                     {n}
//                   </option>
//                 ))}
//               </select>
//               <button
//                 type="button"
//                 disabled={page <= 1}
//                 onClick={() => setPage((p) => p - 1)}
//                 className="rounded border border-gray-200 p-1.5 disabled:opacity-30 dark:border-gray-700"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </button>
//               <span>
//                 Page {page} of {totalPages}
//               </span>
//               <button
//                 type="button"
//                 disabled={page >= totalPages}
//                 onClick={() => setPage((p) => p + 1)}
//                 className="rounded border border-gray-200 p-1.5 disabled:opacity-30 dark:border-gray-700"
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </button>
//             </div>
//           </div>

//           {drawerOpen && (
//             <div
//               className="fixed inset-0 z-[100] flex justify-end bg-black/40"
//               onMouseDown={(e) => {
//                 if (e.target === e.currentTarget) setDrawerOpen(false);
//               }}
//             >
//               <div className="flex h-full w-full max-w-md flex-col bg-white shadow-xl dark:bg-gray-900">
//                 <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
//                   <div>
//                     <h2 className="text-lg font-semibold">Advanced Filters</h2>
//                     <p className="mt-1 text-xs text-gray-500">
//                       Filter distribution centers by city and status
//                     </p>
//                   </div>
//                   <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close filters">
//                     <X className="h-5 w-5" />
//                   </button>
//                 </div>
//                 <form
//                   onSubmit={(e) => {
//                     e.preventDefault();
//                     setStatus(draftStatus);
//                     setCity(draftCity);
//                     setDrawerOpen(false);
//                   }}
//                   className="flex min-h-0 flex-1 flex-col"
//                 >
//                   <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
//                     <label className="block text-sm font-medium">
//                       Status
//                       <select
//                         value={draftStatus}
//                         onChange={(e) => setDraftStatus(e.target.value as Status)}
//                         className={fieldClass}
//                       >
//                         <option value="all">All statuses</option>
//                         <option value="active">Active</option>
//                         <option value="inactive">Inactive</option>
//                       </select>
//                     </label>
//                     <label className="block text-sm font-medium">
//                       City
//                       <select
//                         value={draftCity}
//                         onChange={(e) => setDraftCity(e.target.value)}
//                         className={fieldClass}
//                       >
//                         <option value="">All cities</option>
//                         {cities.map((name) => (
//                           <option key={name} value={name}>
//                             {name}
//                           </option>
//                         ))}
//                       </select>
//                     </label>
//                   </div>
//                   <div className="flex gap-3 border-t border-gray-200 p-5 dark:border-gray-800">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setDraftCity("");
//                         setDraftStatus("all");
//                         setCity("");
//                         setStatus("all");
//                         setDrawerOpen(false);
//                       }}
//                       className="h-10 flex-1 rounded-md border border-gray-200 text-sm font-medium dark:border-gray-700"
//                     >
//                       Reset
//                     </button>
//                     <button
//                       type="submit"
//                       className="h-10 flex-1 rounded-md bg-[#0446DB] text-sm font-medium text-white hover:bg-blue-800"
//                     >
//                       Apply Filters
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}

//           {selected && (
//             <div
//               className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-3 sm:p-5"
//               onMouseDown={(e) => {
//                 if (e.target === e.currentTarget) closeDC();
//               }}
//             >
//               <div
//                 role="dialog"
//                 aria-modal="true"
//                 aria-label="Distribution center details"
//                 className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900"
//               >
//                 <div className="flex shrink-0 items-start justify-between bg-[#0446DB] px-5 py-4 text-white">
//                   <div className="flex items-center gap-3">
//                     <Building2 className="h-6 w-6" />
//                     <div>
//                       <h2 className="text-lg font-semibold">{display(selected.dc_name)}</h2>
//                       <p className="text-xs text-blue-100">
//                         {display(selected.dc_code)} · ID {display(dcId(selected))}
//                       </p>
//                     </div>
//                   </div>
//                   <button type="button" disabled={saving} onClick={closeDC} aria-label="Close details">
//                     <X className="h-5 w-5" />
//                   </button>
//                 </div>
//                 <div className="min-h-0 flex-1 overflow-y-auto p-5">
//                   <div className="mb-5 flex items-center justify-between rounded-md border border-gray-200 px-4 py-3 dark:border-gray-700">
//                     <span className="text-sm font-medium">Account Status</span>
//                     <span
//                       className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isActive(selected) ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"}`}
//                     >
//                       {isActive(selected) ? (
//                         <CheckCircle2 className="h-4 w-4" />
//                       ) : (
//                         <AlertCircle className="h-4 w-4" />
//                       )}
//                       {isActive(selected) ? "Active" : "Inactive"}
//                     </span>
//                   </div>
//                   {!editing ? (
//                     <>
//                       <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                         {[
//                           ["DC ID", dcId(selected)],
//                           ["DC Code", selected.dc_code],
//                           ["Username", selected.username],
//                           ["Email", selected.email],
//                           ["Phone", selected.phone],
//                           ["City", selected.city],
//                           ["State", selected.state],
//                           ["Pincode", selected.pincode],
//                         ].map(([label, value]) => (
//                           <div
//                             key={String(label)}
//                             className="rounded-md border border-gray-200 p-3.5 dark:border-gray-700"
//                           >
//                             <p className="text-xs text-gray-500">{label}</p>
//                             <p className="mt-1 break-words text-sm font-semibold">{display(value)}</p>
//                           </div>
//                         ))}
//                       </div>
//                       <div className="mt-3 rounded-md border border-gray-200 p-3.5 dark:border-gray-700">
//                         <p className="text-xs text-gray-500">Complete Address</p>
//                         <p className="mt-1 text-sm">{display(selected.address)}</p>
//                       </div>
//                     </>
//                   ) : (
//                     <form
//                       id="dc-edit-form"
//                       onSubmit={saveDetails}
//                       className="grid grid-cols-1 gap-4 sm:grid-cols-2"
//                     >
//                       {fields.map(({ key, label }) => (
//                         <label
//                           key={key}
//                           className={`block text-sm font-medium ${key === "address" ? "sm:col-span-2" : ""}`}
//                         >
//                           {label}
//                           {key === "address" ? (
//                             <textarea
//                               rows={3}
//                               value={editForm[key]}
//                               onChange={(e) => setEditForm((p) => ({ ...p, [key]: e.target.value }))}
//                               className={`${fieldClass} h-auto py-2`}
//                             />
//                           ) : (
//                             <input
//                               type={
//                                 key === "password" ? "password" : key === "email" ? "email" : "text"
//                               }
//                               autoComplete={key === "password" ? "new-password" : "off"}
//                               value={editForm[key]}
//                               onChange={(e) => setEditForm((p) => ({ ...p, [key]: e.target.value }))}
//                               className={fieldClass}
//                             />
//                           )}
//                         </label>
//                       ))}
//                       <div className="sm:col-span-2 flex items-center gap-2 text-xs text-gray-500">
//                         <LockKeyhole className="h-4 w-4" /> Changing a DC password revokes its existing
//                         sessions.
//                       </div>
//                     </form>
//                   )}
//                 </div>
//                 <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/40">
//                   {can("UPDATE_DC") &&
//                     (!editing ? (
//                       <>
//                         <button
//                           type="button"
//                           onClick={() => setEditing(true)}
//                           className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 px-3 text-sm font-medium dark:border-gray-700"
//                         >
//                           <Pencil className="h-4 w-4" /> Edit DC
//                         </button>
//                         <button
//                           type="button"
//                           disabled={saving}
//                           onClick={() => void updateDC({ is_active: isActive(selected) ? 0 : 1 })}
//                           className="h-9 rounded-md border border-gray-200 px-3 text-sm font-medium disabled:opacity-50 dark:border-gray-700"
//                         >
//                           {saving ? "Updating..." : isActive(selected) ? "Deactivate" : "Activate"}
//                         </button>
//                       </>
//                     ) : (
//                       <>
//                         <button
//                           type="button"
//                           disabled={saving}
//                           onClick={() => setEditing(false)}
//                           className="h-9 rounded-md border border-gray-200 px-3 text-sm font-medium dark:border-gray-700"
//                         >
//                           Cancel Edit
//                         </button>
//                         <button
//                           form="dc-edit-form"
//                           type="submit"
//                           disabled={saving}
//                           className="inline-flex h-9 items-center gap-2 rounded-md bg-[#0446DB] px-3 text-sm font-medium text-white disabled:opacity-50"
//                         >
//                           <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
//                         </button>
//                       </>
//                     ))}
//                   <button
//                     type="button"
//                     disabled={saving}
//                     onClick={closeDC}
//                     className="h-9 rounded-md bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )
//     }

//     </>
//   );
// }

import { useCallback, useEffect, useMemo, useState } from "react";

import type { FormEvent } from "react";

import axios from "axios";

import { toast } from "react-toastify";

import { Link } from "react-router-dom";

import {
  Building2,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  UserRound,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Save,
  LockKeyhole,
} from "lucide-react";

import AxiosInstance from "@/Helper/axiosInstance";

const baseURL = String(import.meta.env.VITE_BASE_URL || "").replace(/\/$/, "");

const frontendURL = String(import.meta.env.VITE_FRONTEND_URL || "").replace(/\/$/, "");

type DC = {
  id?: number | string;

  dc_id?: number | string;

  dc_name?: string | null;

  dc_code?: string | null;

  username?: string | null;

  email?: string | null;

  phone?: string | number | null;

  address?: string | null;

  city?: string | null;

  state?: string | null;

  pincode?: string | number | null;

  is_active?: number | string | boolean | null;

  status?: number | string | boolean | null;
};

type Status = "all" | "active" | "inactive";

type EditField =
  | "dc_name"
  | "dc_code"
  | "username"
  | "phone"
  | "email"
  | "address"
  | "city"
  | "state"
  | "pincode"
  | "password";

type EditForm = Record<EditField, string>;

const emptyEdit: EditForm = {
  dc_name: "",

  dc_code: "",
  username: "",

  phone: "",

  email: "",

  address: "",

  city: "",

  state: "",

  pincode: "",

  password: "",
};

const fields: { key: EditField; label: string }[] = [
  { key: "dc_name", label: "DC Name" },

  { key: "dc_code", label: "DC Code" },
  { key: "username", label: "Username" },

  { key: "email", label: "Email Address" },

  { key: "phone", label: "Phone Number" },

  { key: "city", label: "City" },

  { key: "state", label: "State" },

  { key: "pincode", label: "Pincode" },

  { key: "address", label: "Complete Address" },

  { key: "password", label: "New Password (optional)" },
];

const dcId = (dc: DC) => dc.dc_id ?? dc.id;

const isActive = (dc: DC) => Number(dc.is_active ?? dc.status) === 1;

const display = (v: unknown) => (v === null || v === undefined || v === "" ? "—" : String(v));

const fieldClass =
  "mt-1.5 h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100";

const errorText = (err: unknown) =>
  axios.isAxiosError(err)
    ? err.response?.data?.message || err.message
    : err instanceof Error
      ? err.message
      : "Something went wrong";

export default function UserDistributionCenterListing() {
  const [permissions] = useState<string[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("permission") || "[]");

      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  const [list, setList] = useState<DC[]>([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<Status>("all");

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [draftStatus, setDraftStatus] = useState<Status>("all");

  const [draftCity, setDraftCity] = useState("");

  const [city, setCity] = useState("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(20);

  const [selected, setSelected] = useState<DC | null>(null);

  const [editing, setEditing] = useState(false);

  const [editForm, setEditForm] = useState<EditForm>({ ...emptyEdit });

  const [saving, setSaving] = useState(false);

  const can = (code: string) =>
    permissions.includes(code) || permissions.includes("ADMIN_FULL_ACCESS");

  const fetchDCs = useCallback(async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("merchantToken") || localStorage.getItem("token");

      const resultRows: DC[] = [];

      let apiPage = 1;

      let more = true;

      while (more && apiPage <= 1000) {
        const response = await axios.get(`${baseURL}/api/user/getDcs`, {
          headers: {
            "Content-Type": "application/json",

            ...(token ? { Authorization: `Bearer ${token}`, "x-auth-token": token } : {}),
          },

          params: { page: apiPage, limit: 100 },
        });

        if (response.data?.success === false)
          throw new Error(response.data?.message || "Unable to load distribution centers");

        const body = response.data?.data;

        const rows: DC[] = Array.isArray(body)
          ? body
          : Array.isArray(body?.dcs)
            ? body.dcs
            : Array.isArray(response.data?.dcs)
              ? response.data.dcs
              : [];

        resultRows.push(...rows);

        const pagination = response.data?.pagination ?? body?.pagination;

        const totalPages =
          Number(pagination?.totalPages ?? pagination?.total_pages) ||
          (Number(pagination?.total)
            ? Math.ceil(Number(pagination.total) / (Number(pagination.limit) || 100))
            : 0);

        // If API does not return pagination, treat the response as a complete list.*

        more = totalPages > 0 && apiPage < totalPages && rows.length > 0;

        apiPage++;
      }

      setList(resultRows);
    } catch (error) {
      toast.error(errorText(error));

      setList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDCs();
  }, [fetchDCs]);

  const cities = useMemo(
    () => [...new Set(list.map((d) => String(d.city || "").trim()).filter(Boolean))].sort(),

    [list],
  );

  const filtered = useMemo(
    () =>
      list.filter((dc) => {
        const q = search.trim().toLowerCase();

        const searchable = [
          dc.dc_name,

          dc.dc_code,

          dc.username,

          dc.email,

          dc.phone,

          dc.address,

          dc.city,

          dc.state,

          dc.pincode,
        ].some((value) =>
          String(value ?? "")
            .toLowerCase()

            .includes(q),
        );

        const statusMatch =
          status === "all" || (status === "active" ? isActive(dc) : !isActive(dc));

        return (
          searchable &&
          statusMatch &&
          (!city || String(dc.city || "").toLowerCase() === city.toLowerCase())
        );
      }),

    [list, search, status, city],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));

  const visible = useMemo(
    () => filtered.slice((page - 1) * limit, page * limit),

    [filtered, page, limit],
  );

  useEffect(() => {
    setPage(1);
  }, [search, status, city, limit]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const openDC = (dc: DC) => {
    setSelected(dc);

    setEditing(false);

    setEditForm({
      ...emptyEdit,

      dc_name: String(dc.dc_name ?? ""),

      dc_code: String(dc.dc_code ?? ""),
      username: String(dc.username ?? ""),

      email: String(dc.email ?? ""),

      phone: String(dc.phone ?? ""),

      city: String(dc.city ?? ""),

      state: String(dc.state ?? ""),

      pincode: String(dc.pincode ?? ""),

      address: String(dc.address ?? ""),
    });
  };

  const closeDC = () => {
    if (!saving) {
      setSelected(null);

      setEditing(false);
    }
  };

  const updateDC = async (patch: Record<string, string | number>) => {
    if (!selected || !can("UPDATE_DC") || saving) return;

    const id = dcId(selected);

    if (id === null || id === undefined) return toast.error("DC ID is missing");

    setSaving(true);

    try {
      const res = await AxiosInstance.patch(`/api/user/updateDc/${id}`, patch);

      if (res.data?.success === false) throw new Error(res.data?.message || "Update failed");

      const updated = res.data?.data?.dc as DC | undefined;

      if (updated) {
        setList((prev) =>
          prev.map((d) => (String(dcId(d)) === String(id) ? { ...d, ...updated } : d)),
        );

        setSelected((prev) => (prev ? { ...prev, ...updated } : prev));
      } else {
        await fetchDCs();

        setSelected((prev) => (prev ? ({ ...prev, ...patch } as DC) : prev));
      }

      setEditing(false);

      setEditForm((prev) => ({ ...prev, password: "" }));

      toast.success(res.data?.message || "Distribution center updated");
    } catch (error) {
      toast.error(errorText(error));
    } finally {
      setSaving(false);
    }
  };

  const saveDetails = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !["dc_name", "dc_code", "username", "email", "city"].every((key) =>
        editForm[key as EditField].trim(),
      )
    )
      return toast.error("DC name, code, username, email and city are required");

    if (
      editForm.password &&
      (editForm.password.length < 8 || new TextEncoder().encode(editForm.password).length > 72)
    )
      return toast.error("Password must be between 8 and 72 bytes");

    if (editForm.phone && !/^\d{10}$/.test(editForm.phone))
      return toast.error("Phone number must contain exactly 10 digits");

    if (editForm.pincode && !/^\d{6}$/.test(editForm.pincode))
      return toast.error("Pincode must contain exactly 6 digits");

    const { password, ...values } = editForm;

    void updateDC({ ...values, ...(password ? { password } : {}) });
  };

  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingPage(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!can("VIEW_DC")) return null;

  return (
    <>
      {loadingPage ? (
        <>
          <div className=" w-full h-[90vh] flex justify-center items-center">
            <div>
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />

              <p className="mt-2"> Loading DC Details...</p>
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-[calc(100dvh-80px)] min-h-0 w-full flex-col overflow-hidden bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
          <div className="shrink-0 space-y-3 border-b border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold">Distribution Centers</h1>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  View and manage delivery center accounts and locations
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => void fetchDCs()}
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 px-3 text-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
                </button>

                {
                  (permissions.includes('CREATE_DC') || permissions.includes('ADMIN_FULL_ACCESS')) && (
                    <>
                    
                <Link
                  to="/user/onboarding/distribution-center"
                  className="inline-flex h-9 items-center gap-2 rounded-md bg-[#0446DB] px-3 text-sm font-medium text-white hover:bg-blue-800"
                >
                  <Plus className="h-4 w-4" /> Add DC
                </Link>
                    </>
                  )
                }

              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[220px] flex-1 sm:max-w-lg">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  _aria-label_="Search distribution centers"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, code, city, email..."
                  className="h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-8 text-sm outline-none focus:border-[#0446DB] dark:border-gray-700 dark:bg-gray-800"
                />

                {!!search && (
                  <button
                    type="button"
                    _aria-label_="Clear search"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setDraftStatus(status);

                  setDraftCity(city);

                  setDrawerOpen(true);
                }}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
              >
                <Filter className="h-4 w-4" /> Filters{" "}
                {city && <span className="rounded bg-blue-50 px-1.5 text-[#0446DB]">1</span>}
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {(
                [
                  { value: "all", label: "All" },

                  { value: "active", label: "Active" },

                  { value: "inactive", label: "Inactive" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setStatus(tab.value)}
                  className={`shrink-0 rounded-md border px-4 py-2 text-sm font-medium transition ${status === tab.value ? "border-[#0446DB] bg-[#0446DB] text-white" : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto bg-white dark:bg-gray-900">
            <table className="w-full min-w-[1080px] border-separate border-spacing-0 text-sm">
              <thead className="sticky top-0 z-20 bg-gray-50 text-left text-xs font-semibold uppercase text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                <tr>
                  {[
                    "Distribution Center",

                    "Code / Username",

                    "Contact",

                    "Location",

                    "Status",

                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap border-b border-gray-200 px-4 py-3 dark:border-gray-700"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-gray-500">
                      <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-[#0446DB]" />
                      Loading Distribution Centers...
                    </td>
                  </tr>
                ) : visible.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-gray-500">
                      <Building2 className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                      No distribution centers found
                    </td>
                  </tr>
                ) : (
                  visible.map((dc, index) => (
                    <tr
                      key={String(dcId(dc) ?? index)}
                      className="hover:bg-blue-50/40 dark:hover:bg-gray-800/50"
                    >
                      <td className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-950/40">
                            <Building2 className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <div className="max-w-[250px] truncate font-semibold">
                              {display(dc.dc_name)}
                            </div>

                            <div className="mt-0.5 text-xs text-gray-400">
                              ID: {display(dcId(dc))}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                        <div className="font-mono text-xs font-semibold">{display(dc.dc_code)}</div>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                          <UserRound className="h-3.5 w-3.5" /> {display(dc.username)}
                        </div>
                      </td>

                      <td className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Mail className="h-3.5 w-3.5 text-gray-400" />

                          <span className="max-w-[215px] truncate">{display(dc.email)}</span>
                        </div>

                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
                          <Phone className="h-3.5 w-3.5" /> {display(dc.phone)}
                        </div>
                      </td>

                      <td className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />

                          <div>
                            <div className="text-sm font-medium">{display(dc.city)}</div>

                            <div className="mt-0.5 text-xs text-gray-500">
                              {display(dc.state)}

                              {dc.pincode ? ` · ${dc.pincode}` : ""}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                        {isActive(dc) ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-950/30 dark:text-red-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openDC(dc)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-200 px-2.5 text-xs font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-[#0446DB] dark:border-gray-700 dark:text-gray-200"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View / Edit
                          </button>

                          {can("LOGIN_DC") && isActive(dc) && (
                            <a
                              href={`${frontendURL}/incognitoLogin/${encodeURIComponent(localStorage.getItem("token") || "")}/${encodeURIComponent(String(dcId(dc) ?? ""))}/dc`}
                              target="\_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-8 items-center gap-1 rounded-md bg-[#0446DB] px-2.5 text-xs font-medium text-white hover:bg-blue-800"
                            >
                              Login
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3 text-xs dark:border-gray-800 dark:bg-gray-900">
            <span className="text-gray-600 dark:text-gray-300">
              {filtered.length
                ? `${(page - 1) * limit + 1}–${Math.min(page * limit, filtered.length)} of ${filtered.length}`
                : "0"}{" "}
              distribution centers
            </span>

            <div className="flex items-center gap-2">
              <span>Rows</span>

              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="rounded border border-gray-200 px-2 py-1 dark:border-gray-700 dark:bg-gray-800"
              >
                {[10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>

              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded border border-gray-200 p-1.5 disabled:opacity-30 dark:border-gray-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded border border-gray-200 p-1.5 disabled:opacity-30 dark:border-gray-700"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {drawerOpen && (
            <div
              className="fixed inset-0 z-[100] flex justify-end bg-black/40"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) setDrawerOpen(false);
              }}
            >
              <div className="flex h-full w-full max-w-md flex-col bg-white shadow-xl dark:bg-gray-900">
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
                  <div>
                    <h2 className="text-lg font-semibold">Advanced Filters</h2>

                    <p className="mt-1 text-xs text-gray-500">
                      Filter distribution centers by city and status
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    _aria-label_="Close filters"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    setStatus(draftStatus);

                    setCity(draftCity);

                    setDrawerOpen(false);
                  }}
                  className="flex min-h-0 flex-1 flex-col"
                >
                  <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
                    <label className="block text-sm font-medium">
                      Status
                      <select
                        value={draftStatus}
                        onChange={(e) => setDraftStatus(e.target.value as Status)}
                        className={fieldClass}
                      >
                        <option value="all">All statuses</option>

                        <option value="active">Active</option>

                        <option value="inactive">Inactive</option>
                      </select>
                    </label>

                    <label className="block text-sm font-medium">
                      City
                      <select
                        value={draftCity}
                        onChange={(e) => setDraftCity(e.target.value)}
                        className={fieldClass}
                      >
                        <option value="">All cities</option>

                        {cities.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="flex gap-3 border-t border-gray-200 p-5 dark:border-gray-800">
                    <button
                      type="button"
                      onClick={() => {
                        setDraftCity("");

                        setDraftStatus("all");

                        setCity("");

                        setStatus("all");

                        setDrawerOpen(false);
                      }}
                      className="h-10 flex-1 rounded-md border border-gray-200 text-sm font-medium dark:border-gray-700"
                    >
                      Reset
                    </button>

                    <button
                      type="submit"
                      className="h-10 flex-1 rounded-md bg-[#0446DB] text-sm font-medium text-white hover:bg-blue-800"
                    >
                      Apply Filters
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {selected && (
            <div
              className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-3 sm:p-5"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) closeDC();
              }}
            >
              <div
                role="dialog"
                _aria-modal_="true"
                _aria-label_="Distribution center details"
                className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900"
              >
                <div className="flex shrink-0 items-start justify-between bg-[#0446DB] px-5 py-4 text-white">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-6 w-6" />

                    <div>
                      <h2 className="text-lg font-semibold">{display(selected.dc_name)}</h2>

                      <p className="text-xs text-blue-100">
                        {display(selected.dc_code)} · ID {display(dcId(selected))}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={closeDC}
                    _aria-label_="Close details"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-5">
                  <div className="mb-5 flex items-center justify-between rounded-md border border-gray-200 px-4 py-3 dark:border-gray-700">
                    <span className="text-sm font-medium">Account Status</span>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isActive(selected) ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"}`}
                    >
                      {isActive(selected) ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}

                      {isActive(selected) ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {!editing ? (
                    <>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {[
                          ["DC ID", dcId(selected)],

                          ["DC Code", selected.dc_code],

                          ["Username", selected.username],

                          ["Email", selected.email],

                          ["Phone", selected.phone],

                          ["City", selected.city],

                          ["State", selected.state],

                          ["Pincode", selected.pincode],
                        ].map(([label, value]) => (
                          <div
                            key={String(label)}
                            className="rounded-md border border-gray-200 p-3.5 dark:border-gray-700"
                          >
                            <p className="text-xs text-gray-500">{label}</p>

                            <p className="mt-1 break-words text-sm font-semibold">
                              {display(value)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 rounded-md border border-gray-200 p-3.5 dark:border-gray-700">
                        <p className="text-xs text-gray-500">Complete Address</p>

                        <p className="mt-1 text-sm">{display(selected.address)}</p>
                      </div>
                    </>
                  ) : (
                    <form
                      id="dc-edit-form"
                      onSubmit={saveDetails}
                      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                    >
                      {fields.map(({ key, label }) => (
                        <label
                          key={key}
                          className={`block text-sm font-medium ${key === "address" ? "sm:col-span-2" : ""}`}
                        >
                          {label}

                          {key === "address" ? (
                            <textarea
                              rows={3}
                              value={editForm[key]}
                              onChange={(e) =>
                                setEditForm((p) => ({ ...p, [key]: e.target.value }))
                              }
                              className={`${fieldClass} h-auto py-2`}
                            />
                          ) : (
                            <input
                              type={
                                key === "password" ? "password" : key === "email" ? "email" : "text"
                              }
                              autoComplete={key === "password" ? "new-password" : "off"}
                              inputMode={
                                key === "phone" || key === "pincode" ? "numeric" : undefined
                              }
                              maxLength={key === "phone" ? 10 : key === "pincode" ? 6 : undefined}
                              pattern={
                                key === "phone"
                                  ? "[0-9]{10}"
                                  : key === "pincode"
                                    ? "[0-9]{6}"
                                    : undefined
                              }
                              title={
                                key === "phone"
                                  ? "Enter exactly 10 digits"
                                  : key === "pincode"
                                    ? "Enter exactly 6 digits"
                                    : undefined
                              }
                              value={editForm[key]}
                              onChange={(e) => {
                                const value =
                                  key === "phone" || key === "pincode"
                                    ? e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, key === "phone" ? 10 : 6)
                                    : e.target.value;
                                setEditForm((p) => ({ ...p, [key]: value }));
                              }}
                              className={fieldClass}
                            />
                          )}
                        </label>
                      ))}

                      <div className="sm:col-span-2 flex items-center gap-2 text-xs text-gray-500">
                        <LockKeyhole className="h-4 w-4" /> Changing a DC password revokes its
                        existing sessions.
                      </div>
                    </form>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/40">
                  {can("UPDATE_DC") &&
                    (!editing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setEditing(true)}
                          className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 px-3 text-sm font-medium dark:border-gray-700"
                        >
                          <Pencil className="h-4 w-4" /> Edit DC
                        </button>

                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => void updateDC({ is_active: isActive(selected) ? 0 : 1 })}
                          className="h-9 rounded-md border border-gray-200 px-3 text-sm font-medium disabled:opacity-50 dark:border-gray-700"
                        >
                          {saving ? "Updating..." : isActive(selected) ? "Deactivate" : "Activate"}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => setEditing(false)}
                          className="h-9 rounded-md border border-gray-200 px-3 text-sm font-medium dark:border-gray-700"
                        >
                          Cancel Edit
                        </button>

                        <button
                          form="dc-edit-form"
                          type="submit"
                          disabled={saving}
                          className="inline-flex h-9 items-center gap-2 rounded-md bg-[#0446DB] px-3 text-sm font-medium text-white disabled:opacity-50"
                        >
                          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
                        </button>
                      </>
                    ))}

                  <button
                    type="button"
                    disabled={saving}
                    onClick={closeDC}
                    className="h-9 rounded-md bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
