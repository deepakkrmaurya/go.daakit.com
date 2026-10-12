import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import {
  getDisputeQueue,
  getDisputeDetail,
  resolveDispute,
} from "../../Redux/weightMis";
import { FiRefreshCw } from "react-icons/fi";

const BRAND_COLOR = "#0446DB";
const baseURL = import.meta.env.VITE_BASE_URL;

// ============================================================
// HELPERS
// ============================================================
const fmtGrams = (val) => `${val ?? "—"} gm`;
const fmtMoney = (val) => `₹${val ?? "—"}`;
const fmtDims = (l, b, h) => `${l ?? "—"} × ${b ?? "—"} × ${h ?? "—"}`;
const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getEvidenceUrl = (filePath) => {
  if (!filePath) return "";
  const normalized = String(filePath).replace(/\\/g, "/");
  const clean = normalized.replace(/^\/?uploads\//i, "");
  return `${baseURL}/uploads/${clean}`;
};

const daysAgo = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const diff = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "today";
  if (diff === 1) return "1 day ago";
  return `${diff} days ago`;
};

const isDeadlinePassed = (deadline) => {
  if (!deadline) return false;
  const d = new Date(deadline);
  if (isNaN(d.getTime())) return false;
  return d.getTime() < Date.now();
};

const getSlaBadge = (deadline) => {
  if (!deadline) return { sla: "—", slaColor: "bg-gray-100 text-gray-600" };
  const d = new Date(deadline);
  if (isNaN(d.getTime()))
    return { sla: "—", slaColor: "bg-gray-100 text-gray-600" };

  const hrs = Math.floor((d.getTime() - Date.now()) / (1000 * 60 * 60));

  if (hrs < 0)
    return { sla: "Deadline passed", slaColor: "bg-red-100 text-red-800" };
  if (hrs < 24)
    return { sla: `${hrs}h left`, slaColor: "bg-red-100 text-red-800" };
  if (hrs < 72)
    return { sla: `${hrs}h left`, slaColor: "bg-yellow-100 text-yellow-800" };
  const days = Math.floor(hrs / 24);
  return { sla: `${days}d left`, slaColor: "bg-green-100 text-green-800" };
};

// ============================================================
// ICONS
// ============================================================
const Icons = {
  ChevronDown: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  ),
  Filter: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      />
    </svg>
  ),
  Check: () => (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  Document: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
};

// Status labels
const STATUS_LABELS = {
  "Dispute Open": "Disputed",
  "Settlement Pending": "Retry Pending",
  "Seller Accepted": "Accepted by Seller",
  Closed: "Closed",
  "Auto-Accepted": "Auto Accepted",
  "Seller Favour": "Resolved in Seller's favour",
  "Courier Favour": "Resolved in Courier's favour",
  Voided: "Voided",
};

const STATUS_COLORS = {
  "Dispute Open": "bg-orange-100 text-orange-800",
  "Settlement Pending": "bg-red-100 text-red-800",
  "Seller Accepted": "bg-teal-100 text-teal-800",
  Closed: "bg-green-100 text-green-800",
  "Auto-Accepted": "bg-blue-100 text-blue-800",
  "Seller Favour": "bg-emerald-100 text-emerald-800",
  "Courier Favour": "bg-indigo-100 text-indigo-800",
  Voided: "bg-gray-200 text-gray-600",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
        STATUS_COLORS[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}

const SlaBadge = ({ sla, color }) => (
  <span
    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${color}`}
  >
    {sla}
  </span>
);

// ============================================================
// FILTER DROPDOWN
// ============================================================
function FilterDropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const displayText = value === "All" ? label : value;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
      >
        <span className="font-medium">{displayText}</span>
        <Icons.ChevronDown />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 w-44 max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg py-1">
            {options.map((opt) => {
              const optLabel = opt === "All" ? "All" : opt;
              const isSelected = value === opt;
              return (
                <button
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "text-[#0446DB] font-semibold bg-blue-50"
                      : "text-gray-700"
                  }`}
                >
                  <span>{optLabel}</span>
                  {isSelected && <span className="text-[#0446DB]">✓</span>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
function Dispute() {
  const [sellerSearch, setSellerSearch] = useState({
    action_required: "",
    closed: "",
  });
  const [view, setView] = useState("list");
  const [activeTab, setActiveTab] = useState("action_required");

  // ------- LIST -------
  const [listRows, setListRows] = useState([]);
  const [listPagination, setListPagination] = useState({
    action_required: { page: 1, limit: 10, total: 0, totalPages: 1 },
    closed: { page: 1, limit: 10, total: 0, totalPages: 1 },
  });

  const [sectionStatusFilter, setSectionStatusFilter] = useState({
    action_required: "All",
    closed: "All",
  });

  const [listLoading, setListLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({
    "Dispute Open": 0,
    "Settlement Pending": 0,
    "Seller Accepted": 0,
    "Auto-Accepted": 0,
    "Seller Favour": 0,
    "Courier Favour": 0,
  });
  const ROWS_PER_PAGE = 10;

  // ------- QUEUE -------
  const [queueRows, setQueueRows] = useState([]);
  const [queueStatusFilter, setQueueStatusFilter] = useState("All");
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [sectionCounts, setSectionCounts] = useState({
    action_required: 0,
    closed: 0,
  });

  // ------- resolve -------
  const [resolution, setResolution] = useState(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [zohoRef, setZohoRef] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resolutionResult, setResolutionResult] = useState(null);

  const TERMINAL = [
    "Seller Accepted",
    "Auto-Accepted",
    "Seller Favour",
    "Courier Favour",
    "Closed",
  ];

  const filteredQueueRows =
    queueStatusFilter === "All"
      ? queueRows
      : queueRows.filter((r) => r.status === queueStatusFilter);

  // ============================================================
  // LOAD LIST
  // ============================================================
  const loadList = async (
    section = activeTab,
    p = null,
    statusOverride = null,
    sellerOverride = null,
  ) => {
    const pageNum = p ?? listPagination[section]?.page ?? 1;
    const status = statusOverride ?? sectionStatusFilter[section] ?? "All";
    const sellerId = sellerOverride ?? sellerSearch[section] ?? "";

    setListLoading(true);
    try {
      const params = { section, page: pageNum, limit: ROWS_PER_PAGE };
      if (status && status !== "All") params.status = status;

      if (sellerId && String(sellerId).trim())
        params.seller_id = String(sellerId).trim();

      const res = await getDisputeQueue(params);
      setListRows(res?.data?.rows || []);

      setListPagination((prev) => ({
        ...prev,
        [section]: res?.data?.pagination || {
          page: 1,
          limit: ROWS_PER_PAGE,
          total: 0,
          totalPages: 1,
        },
      }));

      if (res?.data?.status_counts) {
        setStatusCounts({ ...res.data.status_counts });
      }
      if (res?.data?.section_counts) {
        setSectionCounts({
          action_required: res.data.section_counts.action_required ?? 0,
          closed: res.data.section_counts.closed ?? 0,
        });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load disputes");
      setListRows([]);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (view === "list") loadList(activeTab);
  }, [
    view,
    activeTab,
    sectionStatusFilter[activeTab],
    sellerSearch[activeTab],
  ]);

  // ============================================================
  // LOAD DETAIL
  // ============================================================
  const loadDetail = async (discrepancyId, rowData) => {
    setSelectedDispute(rowData);
    setDetailLoading(true);
    setResolution(null);
    setResolutionNote("");
    setZohoRef("");
    try {
      const res = await getDisputeDetail(discrepancyId);
      setDetail(res?.data ?? res);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load detail");
      setDetail(rowData);
    } finally {
      setDetailLoading(false);
    }
  };

  // ============================================================
  // RESOLVE
  // ============================================================
  const handleResolve = async (resolutionChoice) => {
    if (!detail?.discrepancy_id) return toast.error("No dispute selected");
    if (!resolutionChoice) return toast.error("Please choose a resolution");
    if (!resolutionNote.trim())
      return toast.error("Please add a resolution note");
    if (!zohoRef.trim())
      return toast.error("Zoho resolution reference is required");

    setSubmitting(true);
    setResolutionResult(null);
    try {
      const decision =
        resolutionChoice === "seller" ? "Seller Favour" : "Courier Favour";

      const res = await resolveDispute(detail.discrepancy_id, {
        decision,
        admin_notes: resolutionNote.trim(),
        zoho_resolution_reference: zohoRef.trim(),
      });

      if (res?.success) {
        toast.success(res.message || "Dispute resolved successfully");

        await loadDetail(detail.discrepancy_id, selectedDispute);

        setResolutionResult({
          success: true,
          message: res.message || "Dispute resolved successfully",
          discrepancy_id: res.data?.discrepancy_id ?? detail.discrepancy_id,
          status: res.data?.status ?? decision,
          amount_deducted:
            res.data?.amount_deducted ?? detail.additional_charge,
        });

        setResolution(null);
        setResolutionNote("");
        setZohoRef("");
      } else {
        setResolutionResult({
          success: false,
          message: res?.message || "Failed to resolve dispute",
        });
        toast.error(res?.message || "Failed to resolve dispute");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to resolve dispute";
      setResolutionResult({ success: false, message: msg });
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };


  const handleRefresh = async () => {
  try {
    await loadList("action_required");
    if (detail?.discrepancy_id) {
      await loadDetail(detail.discrepancy_id, selectedDispute, true);
    }

    toast.success("Dispute queue refreshed");
  } catch (err) {
    toast.error(
      err?.response?.data?.message || "Failed to refresh queue",
    );
  }
};


  // ============================================================
  // VIEW 1: ALL DISCREPANCIES
  // ============================================================
  if (view === "list") {
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <header
          className="text-white p-5 md:p-6 md:px-10"
          style={{ backgroundColor: BRAND_COLOR }}
        >
          <div className="mx-auto">
            <h1 className="text-2xl font-bold">All Discrepancies</h1>
            <p className="text-blue-100 text-sm mt-1">
              Weight MIS · All batches
            </p>
          </div>
        </header>

        <main className="mx-auto px-4 md:px-8 mt-6">
          {/* TABS */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 mb-3 max-w-md">
            <button
              type="button"
              onClick={() => setActiveTab("action_required")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-sm transition-all cursor-pointer ${
                activeTab === "action_required"
                  ? "bg-[#0446DB] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Action Required
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === "action_required"
                    ? "bg-white text-[#0446DB]"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {sectionCounts.action_required ?? 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("closed")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "closed"
                  ? "bg-[#0446DB] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Closed
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === "closed"
                    ? "bg-white text-[#0446DB]"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {sectionCounts.closed ?? 0}
              </span>
            </button>
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Icons.Filter />
              <span className="font-medium">Filters:</span>
            </div>

            <FilterDropdown
              label="All Status"
              value={sectionStatusFilter[activeTab] || "All"}
              options={
                activeTab === "action_required"
                  ? ["All", "Dispute Open", "Settlement Pending"]
                  : [
                      "All",
                      "Seller Accepted",
                      "Auto-Accepted",
                      "Seller Favour",
                      "Courier Favour",
                    ]
              }
              onChange={(v) => {
                setSectionStatusFilter((prev) => ({ ...prev, [activeTab]: v }));
              }}
            />

            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                value={sellerSearch[activeTab] || ""}
                onChange={(e) =>
                  setSellerSearch((prev) => ({
                    ...prev,
                    [activeTab]: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-", "."].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                placeholder="Search Seller ID…"
                className="w-56 pl-8 pr-8 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10"
              />

              {/* Search icon */}
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>

              {/* Clear X */}
              {sellerSearch[activeTab] && (
                <button
                  type="button"
                  onClick={() =>
                    setSellerSearch((prev) => ({ ...prev, [activeTab]: "" }))
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  title="Clear search"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setSectionStatusFilter((prev) => ({
                  ...prev,
                  [activeTab]: "All",
                }));
                setSellerSearch((prev) => ({ ...prev, [activeTab]: "" }));
              }}
              className={`ml-auto text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                (sectionStatusFilter[activeTab] || "All") !== "All" ||
                sellerSearch[activeTab]
                  ? "bg-[#0446DB] text-white border-[#0446DB] hover:bg-[#0339B5] cursor-pointer"
                  : "text-gray-400 border-transparent hover:text-gray-600 cursor-pointer"
              }`}
            >
              Clear filters
            </button>
          </div>

          {/* STATUS SUMMARY CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-6">
            {(activeTab === "action_required"
              ? [
                  {
                    key: "Dispute Open",
                    label: "Dispute Open",
                    color: "text-red-700",
                    bg: "bg-red-50",
                    border: "border-red-200",
                  },
                  {
                    key: "Settlement Pending",
                    label: "Settlement Pending",
                    color: "text-orange-700",
                    bg: "bg-orange-50",
                    border: "border-orange-200",
                  },
                ]
              : [
                  {
                    key: "Seller Accepted",
                    label: "Seller Accepted",
                    color: "text-teal-700",
                    bg: "bg-teal-50",
                    border: "border-teal-200",
                  },
                  {
                    key: "Auto-Accepted",
                    label: "Auto-Accepted",
                    color: "text-emerald-700",
                    bg: "bg-emerald-50",
                    border: "border-emerald-200",
                  },
                  {
                    key: "Seller Favour",
                    label: "Seller Favour",
                    color: "text-green-700",
                    bg: "bg-green-50",
                    border: "border-green-200",
                  },
                  {
                    key: "Courier Favour",
                    label: "Courier Favour",
                    color: "text-blue-700",
                    bg: "bg-blue-50",
                    border: "border-blue-200",
                  },
                ]
            ).map((tab) => {
              const count = statusCounts?.[tab.key] ?? 0;
              return (
                <div
                  key={tab.key}
                  className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border ${tab.bg} ${tab.border}`}
                >
                  <span
                    className={`text-lg sm:text-xl lg:text-2xl font-bold ${tab.color}`}
                  >
                    {count}
                  </span>
                  <span className="text-[11px] sm:text-xs lg:text-sm font-medium text-gray-600 leading-tight">
                    {tab.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              {activeTab === "action_required" ? (
                <table className="w-full min-w-[900px] text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {[
                        "AWB",
                        "SELLER",
                        "DECLARED",
                        "CAPTURED",
                        "VARIANCE",
                        "AMOUNT",
                        "STATUS",
                        "DEADLINE",
                        "ACTION",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-[11px] font-semibold tracking-wide uppercase text-gray-400"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {listLoading ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-4 py-12 text-center text-sm text-gray-400"
                        >
                          Loading…
                        </td>
                      </tr>
                    ) : listRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-4 py-12 text-center text-sm text-gray-400"
                        >
                          No action-required discrepancies.
                        </td>
                      </tr>
                    ) : (
                      listRows.map((row) => {
                        const sla = getSlaBadge(row.action_deadline);
                        return (
                          <tr
                            key={row.discrepancy_id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 text-[13px] font-medium text-gray-900 whitespace-nowrap">
                              {row.awb_number}
                            </td>
                            <td className="px-4 py-3 text-[13px] text-gray-600 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="text-[13px] font-medium text-gray-900">
                                  {row.seller_name || "—"}
                                </span>
                                <span className="text-[11px] text-gray-400">
                                  ID: {row.seller_id}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[13px] text-gray-700 whitespace-nowrap">
                              {fmtGrams(row.declared_dead_weight)}
                            </td>
                            <td className="px-4 py-3 text-[13px] text-gray-700 whitespace-nowrap">
                              {fmtGrams(row.captured_dead_weight)}
                            </td>
                            <td className="px-4 py-3 text-[13px] font-medium text-red-600 whitespace-nowrap">
                              {fmtGrams(row.weight_diff_grams)}
                            </td>
                            <td className="px-4 py-3 text-[13px] font-semibold text-gray-900 whitespace-nowrap">
                              {fmtMoney(row.amount_on_hold)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <StatusBadge status={row.status} />
                            </td>
                            <td className="px-4 py-3 text-[13px] text-gray-500 whitespace-nowrap">
                              <SlaBadge sla={sla.sla} color={sla.slaColor} />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <button
                                onClick={async () => {
                                  setSelectedDispute(row);
                                  setDetail(row);

                                  setDetailLoading(true);
                                  try {
                                    const res = await getDisputeDetail(
                                      row.discrepancy_id,
                                    );
                                    const full = res?.data ?? res;
                                    setDetail(full);

                                    if (
                                      full?.seller_disputes &&
                                      full.seller_disputes.length > 0
                                    ) {
                                      setQueueRows(full.seller_disputes);
                                    } else {
                                      setQueueRows([row]);
                                    }
                                  } catch (err) {
                                    toast.error(
                                      err?.response?.data?.message ||
                                        "Failed to load detail",
                                    );
                                    setDetail(row);
                                    setQueueRows([row]);
                                  } finally {
                                    setDetailLoading(false);
                                    setView("queue");
                                  }
                                }}
                                className="text-[#0446DB] text-[13px] font-semibold hover:underline cursor-pointer"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="w-full min-w-[900px] text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {[
                        "AWB",
                        "SELLER",
                        "DECLARED",
                        "CAPTURED",
                        "VARIANCE",
                        "AMOUNT",
                        "STATUS",
                        "DISPUTE",
                        "RESOLVED",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-[11px] font-semibold tracking-wide uppercase text-gray-400"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {listLoading ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-4 py-12 text-center text-sm text-gray-400"
                        >
                          Loading…
                        </td>
                      </tr>
                    ) : listRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-4 py-12 text-center text-sm text-gray-400"
                        >
                          No closed discrepancies.
                        </td>
                      </tr>
                    ) : (
                      listRows.map((row) => {
                        const isRealDispute = !!row.dispute_reason;
                        return (
                          <tr
                            key={row.discrepancy_id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 text-[13px] font-medium text-gray-900 whitespace-nowrap">
                              {row.awb_number}
                            </td>
                            <td className="px-4 py-3 text-[13px] text-gray-600 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="text-[13px] font-medium text-gray-900">
                                  {row.seller_name || "—"}
                                </span>
                                <span className="text-[11px] text-gray-400">
                                  ID: {row.seller_id}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[13px] text-gray-700 whitespace-nowrap">
                              {fmtGrams(row.declared_dead_weight)}
                            </td>
                            <td className="px-4 py-3 text-[13px] text-gray-700 whitespace-nowrap">
                              {fmtGrams(row.captured_dead_weight)}
                            </td>
                            <td className="px-4 py-3 text-[13px] font-medium text-red-600 whitespace-nowrap">
                              {fmtGrams(row.weight_diff_grams)}
                            </td>
                            <td className="px-4 py-3 text-[13px] font-semibold text-gray-900 whitespace-nowrap">
                              {fmtMoney(row.amount_on_hold)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <StatusBadge status={row.status} />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${isRealDispute ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-600"}`}
                              >
                                {isRealDispute ? "Yes" : "No"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-[13px] text-gray-500 whitespace-nowrap">
                              {fmtDate(row.resolved_at)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* PAGINATION */}
            <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-gray-400">
                Showing{" "}
                {listRows.length === 0
                  ? 0
                  : (listPagination[activeTab].page - 1) *
                      listPagination[activeTab].limit +
                    1}{" "}
                to{" "}
                {Math.min(
                  listPagination[activeTab].page *
                    listPagination[activeTab].limit,
                  listPagination[activeTab].total,
                )}{" "}
                of {listPagination[activeTab].total} discrepancies
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    loadList(activeTab, listPagination[activeTab].page - 1)
                  }
                  disabled={listPagination[activeTab].page === 1}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border ${listPagination[activeTab].page === 1 ? "text-gray-300 border-gray-200 cursor-not-allowed" : "text-gray-700 border-gray-200 hover:bg-gray-50 cursor-pointer"}`}
                >
                  Previous
                </button>
                {Array.from(
                  { length: listPagination[activeTab].totalPages },
                  (_, i) => i + 1,
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => loadList(activeTab, p)}
                    className={`w-8 h-8 text-xs font-semibold rounded-md ${listPagination[activeTab].page === p ? "bg-[#0446DB] text-white" : "text-gray-600 hover:bg-gray-100 cursor-pointer"}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() =>
                    loadList(activeTab, listPagination[activeTab].page + 1)
                  }
                  disabled={
                    listPagination[activeTab].page ===
                    listPagination[activeTab].totalPages
                  }
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border ${listPagination[activeTab].page === listPagination[activeTab].totalPages ? "text-gray-300 border-gray-200 cursor-not-allowed" : "text-gray-700 border-gray-200 hover:bg-gray-50 cursor-pointer"}`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ============================================================
  // VIEW 2: DISPUTE QUEUE (sirf detail API call hoga)
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-50">
     <header
        className="text-white p-5 md:p-6 md:px-10"
        style={{ backgroundColor: BRAND_COLOR }}
      >
        <div className="mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dispute Queue</h1>
            <p className="text-blue-100 text-sm mt-1">
              Action Required · Resolve open disputes
            </p>
          </div>

          <div className="flex items-center gap-2">
          
            <button
              type="button"
              onClick={handleRefresh}
              className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              title="Refresh dispute queue"
            >
             <FiRefreshCw className="w-3 h-3" />
              Refresh
            </button>

            
            <button
              onClick={() => setView("list")}
              className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              ← Back to List
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 md:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
              <div className="p-4 border-b border-gray-100 shrink-0">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h2 className="font-bold text-gray-900 text-sm">
                    Dispute Queue{" "}
                    <span className="text-gray-400 font-medium">
                      ({filteredQueueRows.length})
                    </span>
                  </h2>
                </div>

                <FilterDropdown
                  label="All Status"
                  value={queueStatusFilter}
                  options={[
                    "All",
                    "Dispute Open",
                    "Settlement Pending",
                    "Seller Favour",
                    "Courier Favour",
                    "Auto-Accepted",
                  ]}
                  onChange={(v) => setQueueStatusFilter(v)}
                />
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredQueueRows.length === 0 ? (
                  <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                      <Icons.Document />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">
                      No disputes
                    </p>
                  </div>
                ) : (
                  filteredQueueRows.map((item) => {
                    const isSelected =
                      selectedDispute?.discrepancy_id === item.discrepancy_id;
                    const sla = getSlaBadge(item.action_deadline);

                    return (
                      <div
                        key={item.discrepancy_id}
                        className={`border-b border-gray-100 ${
                          isSelected ? "bg-blue-50" : ""
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => loadDetail(item.discrepancy_id, item)}
                          className={`w-full text-left px-4 py-3.5 transition-colors cursor-pointer border-l-4 border-b-2 ${
                            isSelected
                              ? "border-l-[#0446DB] border-b-[#0446DB] bg-blue-50"
                              : "border-l-transparent border-b-transparent hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-[15px] text-gray-900">
                              DSP-{item.discrepancy_id}
                            </span>
                            {item.action_deadline && (
                              <SlaBadge sla={sla.sla} color={sla.slaColor} />
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[13px] text-gray-500 truncate">
                              {item.awb_number}
                            </span>
                            <span className="font-bold text-[14px] text-gray-900 shrink-0">
                              {fmtMoney(
                                item.amount_on_hold ?? item.additional_charge,
                              )}
                            </span>
                          </div>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {detailLoading ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-sm text-gray-400">
                Loading detail…
              </div>
            ) : !detail ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-sm text-gray-400">
                Select a dispute
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex flex-row items-start justify-between gap-3 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase text-gray-400">
                      Dispute ID
                    </p>
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1 truncate">
                      DSP-{detail.discrepancy_id}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
                      {detail.awb_number}
                    </p>
                    <div className="mt-1.5 sm:mt-2">
                      <StatusBadge status={detail.status} />
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-lg sm:text-3xl font-extrabold text-gray-900 whitespace-nowrap">
                      {fmtMoney(detail.additional_charge)}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1 whitespace-nowrap">
                      Opened {daysAgo(detail.created_at)}
                    </p>
                  </div>
                </div>

                {/* Evidence + Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Evidence */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    <h3 className="font-bold text-gray-900 text-base mb-3">
                      Evidence
                    </h3>
                    <div className="space-y-2">
                      {detail.evidence && detail.evidence.length > 0 ? (
                        detail.evidence.map((file) => {
                          const url = getEvidenceUrl(file.file_path);
                          return (
                            <div
                              key={file.id}
                              className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg p-2.5 hover:bg-gray-100 transition-colors"
                            >
                              {/* Thumbnail */}
                              <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="shrink-0"
                                title="Click to view full image"
                              >
                                <div className="w-11 h-11 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                                  <img
                                    src={url}
                                    alt={file.original_filename}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.style.display = "none";
                                      e.target.parentNode.innerHTML =
                                        "<span class='text-[10px] font-semibold text-gray-400'>IMG</span>";
                                    }}
                                  />
                                </div>
                              </a>

                              {/* File info */}
                              <div className="min-w-0 flex-1">
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[13px] font-semibold text-gray-900 hover:text-[#0446DB] block truncate leading-tight"
                                  title={file.original_filename}
                                >
                                  {file.original_filename}
                                </a>
                                <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                                  {fmtDate(file.uploaded_at)}
                                </p>
                                <p className="text-[11px] text-green-600 font-medium mt-0.5">
                                  ✓ Timestamp verified
                                </p>
                              </div>

                              <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="shrink-0 px-3 py-1.5 rounded-md bg-[#0446DB] text-white text-[11px] font-bold hover:bg-[#0339B5] active:scale-95 transition-all"
                              >
                                View
                              </a>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg">
                          <p className="text-xs text-gray-400">
                            No evidence uploaded
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <h3 className="font-bold text-gray-900 mb-4">
                      Discrepancy Details
                    </h3>
                    <dl className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <dt className="text-gray-500">Declared weight</dt>
                        <dd className="font-medium text-gray-900">
                          {fmtGrams(detail.declared_dead_weight)}
                        </dd>
                      </div>
                      <div className="flex justify-between items-center">
                        <dt className="text-gray-500">Captured weight</dt>
                        <dd className="font-medium text-gray-900">
                          {fmtGrams(
                            detail.effective_dead_weight ||
                              detail.captured_dead_weight,
                          )}
                        </dd>
                      </div>
                      <div className="flex justify-between items-center">
                        <dt className="text-gray-500">Variance</dt>
                        <dd className="font-semibold text-red-600">
                          {fmtGrams(detail.weight_diff_grams)}
                        </dd>
                      </div>
                      <div className="flex justify-between items-center">
                        <dt className="text-gray-500">Declared dims</dt>
                        <dd className="text-gray-700">
                          {fmtDims(
                            detail.declared_length,
                            detail.declared_breadth,
                            detail.declared_height,
                          )}
                        </dd>
                      </div>
                      <div className="flex justify-between items-center">
                        <dt className="text-gray-500">Captured dims</dt>
                        <dd className="text-gray-700">
                          {fmtDims(
                            detail.effective_length,
                            detail.effective_breadth,
                            detail.effective_height,
                          )}
                        </dd>
                      </div>
                      <div className="flex justify-between items-center">
                        <dt className="text-gray-500">Upload ID</dt>
                        <dd className="text-gray-700">#{detail.upload_id}</dd>
                      </div>
                      <div className="flex justify-between items-center">
                        <dt className="text-gray-500">Order ID</dt>
                        <dd className="text-gray-700">
                          {detail.order_id ?? "—"}
                        </dd>
                      </div>
                      {detail.action_deadline && (
                        <div className="flex justify-between items-center">
                          <dt className="text-gray-500">Respond by</dt>
                          <dd
                            className={`font-medium ${isDeadlinePassed(detail.action_deadline) ? "text-red-600" : "text-gray-700"}`}
                          >
                            {fmtDate(detail.action_deadline)}
                          </dd>
                        </div>
                      )}
                    </dl>

                    {detail.dispute_reason && (
                      <div className="border-t border-gray-100 mt-4 pt-3">
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Reason for dispute
                        </label>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                            {detail.dispute_reason}
                          </p>
                        </div>
                      </div>
                    )}

                    {detail.seller_comments && (
                      <div className="border-t border-gray-100 mt-4 pt-3">
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Comments
                        </label>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto">
                          <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                            {detail.seller_comments}
                          </p>
                        </div>
                      </div>
                    )}

                    {detail.declared_freight != null &&
                      detail.captured_freight != null && (
                        <div className="border-t border-gray-100 mt-4 pt-3">
                          <p className="text-[11px] font-bold uppercase text-gray-400 mb-2">
                            Freight breakdown
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">
                                Declared freight
                              </span>
                              <span className="text-gray-800 font-medium">
                                {fmtMoney(detail.declared_freight)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">
                                Captured freight
                              </span>
                              <span className="text-gray-800 font-medium">
                                {fmtMoney(detail.captured_freight)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center bg-red-50 rounded-md px-2 py-1.5">
                              <span className="text-red-700 font-medium">
                                Additional charge
                              </span>
                              <span className="text-red-700 font-bold">
                                {fmtMoney(detail.additional_charge)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                    {detail.zoho_ticket_reference && (
                      <div className="border-t border-gray-100 mt-4 pt-3">
                        <div
                          onClick={() => {
                            navigator.clipboard.writeText(
                              detail.zoho_ticket_reference,
                            );
                            toast.success("Ticket ref copied");
                          }}
                          className="flex items-center justify-between gap-2 cursor-pointer group"
                          title="Click to copy"
                        >
                          <p className="text-[11px] text-gray-400">
                            Ticket ref:
                          </p>
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-[12px] text-gray-700 truncate group-hover:text-[#0446DB]">
                              {detail.zoho_ticket_reference}
                            </span>
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-400 group-hover:text-[#0446DB] shrink-0"
                            >
                              <rect
                                x="9"
                                y="9"
                                width="13"
                                height="13"
                                rx="2"
                                ry="2"
                              />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* RESOLUTION AREA */}
                {!TERMINAL.includes(detail.status) ? (
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <h3 className="font-bold text-gray-900">
                        Resolution Decision
                      </h3>
                    </div>

                    {detail.status === "Settlement Pending" ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-4">
                          <span className="text-2xl">⏳</span>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">
                          Processing
                        </h4>
                        <p className="text-sm text-gray-500 text-center max-w-md">
                          This dispute is being processed. No action is
                          required.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                          <button
                            type="button"
                            onClick={() => setResolution("seller")}
                            className={`py-3 rounded-lg border text-sm font-semibold cursor-pointer transition-colors ${
                              resolution === "seller"
                                ? "bg-[#0D9488] text-white border-[#0D9488]"
                                : "border-gray-200 text-gray-700 hover:bg-[#0D9488] hover:text-white"
                            }`}
                          >
                            Rule for Seller
                          </button>
                          <button
                            type="button"
                            onClick={() => setResolution("courier")}
                            className={`py-3 rounded-lg border text-sm font-semibold cursor-pointer transition-colors ${
                              resolution === "courier"
                                ? "bg-[#0D9488] text-white border-[#0D9488]"
                                : "border-gray-200 text-gray-700 hover:bg-[#0D9488] hover:text-white"
                            }`}
                          >
                            Rule for Courier
                          </button>
                        </div>

                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Admin notes <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={resolutionNote}
                          onChange={(e) => setResolutionNote(e.target.value)}
                          placeholder="e.g. Carrier scan confirms captured weight of 1.42 kg..."
                          className="w-full h-24 rounded-lg border border-gray-200 p-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 resize-none"
                        />

                        <label className="block text-xs font-semibold text-gray-700 mb-1.5 mt-3">
                          Zoho Resolution Reference{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={zohoRef}
                          onChange={(e) => setZohoRef(e.target.value)}
                          placeholder="e.g. ZOHO-RES-12345"
                          className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10"
                        />

                        <button
                          type="button"
                          disabled={
                            !resolution ||
                            !resolutionNote.trim() ||
                            !zohoRef.trim() ||
                            submitting
                          }
                          onClick={() => handleResolve(resolution)}
                          className={`w-full h-12 rounded-xl font-semibold text-sm mt-4 transition-all ${
                            resolution &&
                            resolutionNote.trim() &&
                            zohoRef.trim() &&
                            !submitting
                              ? "bg-[#0446DB] text-white hover:bg-[#0339B5] active:scale-[0.99] cursor-pointer"
                              : "bg-[#7aa2f8] text-white cursor-not-allowed"
                          }`}
                        >
                          {submitting ? "Submitting…" : "Submit Resolution"}
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                        <Icons.Check />
                      </div>

                      <p className="font-bold text-gray-900 mb-1">
                        Resolution Recorded
                      </p>
                      <p className="text-sm text-gray-500 text-center">
                        {detail.status === "Seller Accepted" && (
                          <>
                            Accepted by seller —{" "}
                            {fmtMoney(detail.additional_charge)} retained
                          </>
                        )}
                        {detail.status === "Seller Favour" && (
                          <>
                            Ruled for seller —{" "}
                            {fmtMoney(detail.additional_charge)} released
                          </>
                        )}
                        {detail.status === "Courier Favour" && (
                          <>
                            Ruled for courier —{" "}
                            {fmtMoney(detail.additional_charge)} retained
                          </>
                        )}
                        {detail.status === "Auto-Accepted" && (
                          <>
                            Auto-accepted — {fmtMoney(detail.additional_charge)}{" "}
                            retained
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dispute;
