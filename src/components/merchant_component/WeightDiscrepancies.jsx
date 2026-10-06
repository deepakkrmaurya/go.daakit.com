import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
const baseURL = import.meta.env.VITE_BASE_URL;

import {
  getMerchantDiscrepancies,
  getMerchantDiscrepancyDetail,
  acceptMerchantDiscrepancy,
  acceptMerchantDiscrepanciesBulk,
  rejectMerchantDiscrepancy,
  exportMerchantDiscrepancies,
} from "../../Redux/weightMis";
import { ArrowLeft } from "lucide-react";

const BRAND_COLOR = "#0446DB";
const PAGE_SIZE = 10;
const MAX_EVIDENCE_FILES = 3;

const TAB_STATUS_MAP = {
  "needs-action": "Awaiting Seller",
  disputed: "Dispute Open,Settlement Pending",
  history: "Seller Accepted,Auto-Accepted,Seller Favour,Courier Favour",
};

const fmtGrams = (grams) => {
  if (grams === null || grams === undefined || grams === "") return "—";
  const num = Number(grams);
  if (isNaN(num)) return "—";
  return `${num.toFixed(2)} gm`;
};

const fmtMoney = (v) => {
  if (v === null || v === undefined || v === "") return "—";
  const num = Number(v);
  if (isNaN(num)) return "—";
  return `₹${num.toLocaleString("en-IN")}`;
};

const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const fmtDims = (l, b, h) => {
  if (!l && !b && !h) return "—";
  return `${l || 0} × ${b || 0} × ${h || 0} cm`;
};

const getAmount = (item) =>
  Number(item?.additional_charge ?? item?.amount_on_hold ?? 0);

const getDiscrepancyId = (item) => item?.discrepancy_id ?? item?.id ?? null;

const getEvidenceUrl = (filePath) => {
  if (!filePath) return "";
  const normalized = String(filePath).replace(/\\/g, "/");
  const clean = normalized.replace(/^\/?uploads\//i, "");
  return `${baseURL}/uploads/${clean}`;
};

// ============================================================
// ICONS
// ============================================================
const Icons = {
  Refresh: ({ spin = false }) => (
    <svg
      className={`w-4 h-4 ${spin ? "animate-spin" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  ),
  Close: () => (
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  ArrowRightIcon: () => (
    <svg width="15" height="15" viewBox="0 0 13 13" fill="none">
      <path
        d="M4.875 9.75L8.125 6.5L4.875 3.25"
        stroke="#94A3B8"
        strokeWidth="1.08"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  ChevronRight: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M3.75 9H14.25"
        stroke="#94A3B8"
        strokeWidth="1.87"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 3.75L14.25 9L9 14.25"
        stroke="#94A3B8"
        strokeWidth="1.87"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Warning: () => (
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
        d="M12 9v2m0 4h.01M4.93 19h14.14c1.02 0 1.66-1.1 1.16-1.99L13.16 4.99a1.34 1.34 0 00-2.32 0L3.77 17.01A1.34 1.34 0 004.93 19z"
      />
    </svg>
  ),
  Check: () => (
    <svg
      className="w-5 h-5"
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
  Upload: () => (
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
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 9l5-5 5 5M12 4v12"
      />
    </svg>
  ),
  Download: () => (
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
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  ),
  Cube: ({ className = "w-3.5 h-3.5", color = "#64748B" }) => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={className}
    >
      <path
        d="M12.25 9.33V4.67a1.17 1.17 0 00-.58-1.01L7.58 1.32a1.17 1.17 0 00-1.16 0L2.33 3.66A1.17 1.17 0 001.75 4.67v4.66c0 .42.22.81.58 1.01l4.09 2.33c.36.21.8.21 1.16 0l4.09-2.33c.36-.2.58-.59.58-1.01z"
        stroke={color}
        strokeWidth="1.17"
      />
    </svg>
  ),
  AmountCurrentlyHoldIcon: () => (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 10C0 4.47715 4.47715 0 10 0H28C33.5228 0 38 4.47715 38 10V28C38 33.5228 33.5228 38 28 38H10C4.47715 38 0 33.5228 0 28V10Z"
        fill="#FFEDD5"
      />
      <path
        d="M25.6666 19.0002V15.6668H13.9999C13.5579 15.6668 13.134 15.4912 12.8214 15.1787C12.5088 14.8661 12.3333 14.4422 12.3333 14.0002C12.3333 13.0835 13.0833 12.3335 13.9999 12.3335H23.9999V15.6668"
        stroke="#F97316"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12.3333 14V24C12.3333 24.9167 13.0833 25.6667 13.9999 25.6667H25.6666V22.3333"
        stroke="#F97316"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M23.9999 19C23.5579 19 23.134 19.1756 22.8214 19.4882C22.5088 19.8007 22.3333 20.2246 22.3333 20.6667C22.3333 21.1087 22.5088 21.5326 22.8214 21.8452C23.134 22.1577 23.5579 22.3333 23.9999 22.3333H27.3333V19H23.9999Z"
        stroke="#F97316"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  ),
};

// ============================================================
// STATUS BADGE
// ============================================================
function StatusBadge({ status }) {
  const styles = {
    "Awaiting Seller": "bg-yellow-100 text-yellow-800",
    "Dispute Open": "bg-orange-100 text-orange-800",
    "Settlement Pending": "bg-orange-100 text-orange-800",
    "Seller Accepted": "bg-green-100 text-green-800",
    "Auto-Accepted": "bg-blue-100 text-blue-800",
    "Seller Favour": "bg-emerald-100 text-emerald-800",
    "Courier Favour": "bg-indigo-100 text-indigo-800",
    // Legacy fallbacks
    Closed: "bg-gray-100 text-gray-700",
    Voided: "bg-gray-200 text-gray-600",
  };
  const label = {
    "Awaiting Seller": "Needs Action",
    "Dispute Open": "Disputed",
    "Settlement Pending": "Retry Pending",
    "Seller Accepted": "Accepted by Seller",
    "Auto-Accepted": "Auto-Accepted",
    "Seller Favour": "Dispute resolved in Seller's Favour",
    "Courier Favour": "Dispute resolved in Courier's Favour",
    // Legacy fallbacks
    Closed: "Closed",
    Voided: "Voided",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase whitespace-nowrap ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
      title={label[status] || status}
    >
      {label[status] || status}
    </span>
  );
}

// ============================================================
// LOADING SKELETON
// ============================================================
const LoadingSkeleton = ({ rows = 5 }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td className="px-4 md:px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-2 w-16 bg-gray-100 rounded" />
            </div>
          </div>
        </td>
        {Array.from({ length: 7 }).map((_, j) => (
          <td key={j} className="px-4 md:px-5 py-3.5">
            <div className="h-3 w-16 bg-gray-100 rounded" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

// ============================================================
// PAGINATION
// ============================================================
function Pagination({ page, totalPages, total, limit, onPageChange }) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages = [];
  const maxVisible = 5;
  let pStart = Math.max(1, page - Math.floor(maxVisible / 2));
  let pEnd = Math.min(totalPages, pStart + maxVisible - 1);
  if (pEnd - pStart + 1 < maxVisible) {
    pStart = Math.max(1, pEnd - maxVisible + 1);
  }

  if (pStart > 1) {
    pages.push(1);
    if (pStart > 2) pages.push("...");
  }
  for (let i = pStart; i <= pEnd; i++) pages.push(i);
  if (pEnd < totalPages) {
    if (pEnd < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="px-4 md:px-5 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-xs text-gray-500 text-center sm:text-left">
        Showing <strong>{start}</strong> to <strong>{end}</strong> of{" "}
        <strong>{total}</strong> records
      </p>
      <div className="flex items-center gap-1 flex-wrap justify-center">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md border ${
            page === 1
              ? "text-gray-300 border-gray-200 cursor-not-allowed"
              : "text-gray-700 border-gray-200 hover:bg-gray-50 cursor-pointer"
          }`}
        >
          Previous
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-1 text-gray-400 text-xs">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 text-xs font-semibold rounded-md ${
                page === p
                  ? "bg-[#0446DB] text-white"
                  : "text-gray-600 hover:bg-gray-100 cursor-pointer"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md border ${
            page === totalPages
              ? "text-gray-300 border-gray-200 cursor-not-allowed"
              : "text-gray-700 border-gray-200 hover:bg-gray-50 cursor-pointer"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ============================================================
// TABS
// ============================================================
function Tabs({ active, counts, onChange }) {
  const tabs = [
    { key: "needs-action", label: "Pending Action" },
    { key: "disputed", label: "Disputed" },
    { key: "history", label: "History / Completed" },
  ];
  return (
    <div className="flex items-center gap-1 bg-[#0446DB] rounded-xl p-1 w-full sm:w-fit overflow-x-auto">
      {tabs.map((t) => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex-1 sm:flex-initial justify-center ${
              isActive
                ? "bg-white text-[#0446DB]"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            {t.label}
            <span
              className={`text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full ${
                isActive ? "bg-[#0446DB] text-white" : "bg-white/20 text-white"
              }`}
            >
              {counts[t.key] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// EVIDENCE MODAL
// ============================================================
function EvidenceModal({ evidence, awb, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!evidence || evidence.length === 0) return null;

  const total = evidence.length;
  const current = evidence[currentIndex];
  const currentUrl = getEvidenceUrl(current?.file_path);

  const hasMultiple = total > 1;

  const goPrev = () => {
    setCurrentIndex((i) => (i - 1 + total) % total);
  };

  const goNext = () => {
    setCurrentIndex((i) => (i + 1) % total);
  };

  // Keyboard navigation (arrow keys)
  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-wide uppercase text-gray-400">
              Captured package evidence
            </p>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-0.5 truncate">
              {awb}
              {hasMultiple && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  · {currentIndex + 1} of {total}
                </span>
              )}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer shrink-0"
          >
            <Icons.Close />
          </button>
        </div>

        {/* Image viewer */}
        <div className="flex-1 bg-gray-900 relative flex items-center justify-center overflow-hidden">
          {/* Prev button */}
          {hasMultiple && (
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-800 shadow-lg cursor-pointer transition-colors"
              aria-label="Previous image"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          {/* Current image */}
          <img
            key={current?.id}
            src={currentUrl}
            alt={current?.original_filename || "Evidence"}
            className="max-w-full max-h-[60vh] sm:max-h-[65vh] object-contain select-none"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23374151'/%3E%3Ctext x='50%25' y='48%25' font-family='sans-serif' font-size='14' fill='%239ca3af' text-anchor='middle'%3EImage not available%3C/text%3E%3Ctext x='50%25' y='60%25' font-family='sans-serif' font-size='11' fill='%236b7280' text-anchor='middle'%3ECheck backend /uploads route%3C/text%3E%3C/svg%3E";
            }}
          />

          {/* Next button */}
          {hasMultiple && (
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-800 shadow-lg cursor-pointer transition-colors"
              aria-label="Next image"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
        </div>

        {/* Thumbnail strip (only if multiple) */}
        {hasMultiple && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-center gap-2 overflow-x-auto">
            {evidence.map((ev, idx) => {
              const thumbUrl = getEvidenceUrl(ev.file_path);
              const isActive = idx === currentIndex;
              return (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    isActive
                      ? "border-[#0446DB] ring-2 ring-[#0446DB]/30"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={thumbUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f3f4f6'/%3E%3C/svg%3E";
                    }}
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Meta / Footer */}
        <div className="p-4 sm:p-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-800 truncate">
              {current?.original_filename || "Evidence file"}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Uploaded {fmtDate(current?.uploaded_at)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={currentUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 cursor-pointer"
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
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
              Open original
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#0446DB] text-white text-xs font-semibold hover:bg-[#0339B5] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// ============================================================
// RAISE DISPUTE MODAL
// ============================================================
function RaiseDisputeModal({ onClose, onSubmit, submitting }) {
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState({ reason: "", comments: "" });
  const fileInputRef = useRef(null);

  useEffect(() => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  // ---------- VALIDATION ----------
  const validateText = (
    value,
    fieldName,
    { minLen = 3, maxLen = 500 } = {},
  ) => {
    const str = String(value || "").trim();

    if (!str) {
      return `${fieldName} is required`;
    }

    if (str.length < minLen) {
      return `${fieldName} must be at least ${minLen} characters`;
    }

    if (str.length > maxLen) {
      return `${fieldName} must be at most ${maxLen} characters`;
    }

    const validPattern = /^[\p{L}\p{N}\s.,'&()\-_/]+$/u;
    if (!validPattern.test(str)) {
      return `${fieldName} contains invalid characters`;
    }

    if (!/\p{L}/u.test(str)) {
      return `${fieldName} must contain letters`;
    }

    return "";
  };

  const validateAll = () => {
    const newErrors = {
      reason: validateText(reason, "Reason", { minLen: 3, maxLen: 200 }),
      comments: validateText(comments, "Comments", { minLen: 5, maxLen: 500 }),
    };
    setErrors(newErrors);
    return !newErrors.reason && !newErrors.comments;
  };

  // ---------- INPUT HANDLERS ----------
  const handleReasonChange = (e) => {
    const val = e.target.value;
    setReason(val);
    if (errors.reason) {
      setErrors((prev) => ({
        ...prev,
        reason: validateText(val, "Reason", { minLen: 3, maxLen: 200 }),
      }));
    }
  };

  const handleCommentsChange = (e) => {
    const val = e.target.value;
    setComments(val);
    if (errors.comments) {
      setErrors((prev) => ({
        ...prev,
        comments: validateText(val, "Comments", { minLen: 5, maxLen: 500 }),
      }));
    }
  };

  // ---------- FILE ----------
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    const imagesOnly = selected.filter((f) =>
      ["image/jpeg", "image/png", "image/jpg"].includes(f.type),
    );
    if (imagesOnly.length !== selected.length) {
      toast.error("Only JPG / PNG files are allowed.");
    }
    const combined = [...files, ...imagesOnly];
    if (combined.length > MAX_EVIDENCE_FILES) {
      toast.error(`Max ${MAX_EVIDENCE_FILES} evidence files allowed`);
      return;
    }
    setFiles(combined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (i) =>
    setFiles((prev) => prev.filter((_, idx) => idx !== i));

  // ---------- SUBMIT ----------
  const handleSubmit = () => {
    if (!validateAll()) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    if (files.length === 0) {
      toast.error("At least 1 evidence file required");
      return;
    }
    onSubmit({ reason: reason.trim(), comments: comments.trim(), files });
  };

  // ---------- HELPERS ----------
  const inputClass = (field) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors disabled:opacity-60 ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
        : "border-gray-200 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10"
    }`;

  const FieldError = ({ field }) =>
    errors[field] ? (
      <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        {errors[field]}
      </p>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 sm:p-6 relative max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={submitting}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-red-500 cursor-pointer disabled:opacity-50"
        >
          <Icons.Close />
        </button>

        <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mb-3">
          <Icons.Warning />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-gray-900 pr-8">
          Raise a weight dispute
        </h3>
        <p className="text-xs text-gray-500 mt-1 mb-4 sm:mb-5">
          Tell us why the captured weight is incorrect and attach timestamped
          packaging evidence.
        </p>

        {/* Reason */}
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Reason for dispute <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={reason}
          onChange={handleReasonChange}
          onBlur={() =>
            setErrors((prev) => ({
              ...prev,
              reason: validateText(reason, "Reason", {
                minLen: 3,
                maxLen: 200,
              }),
            }))
          }
          disabled={submitting}
          maxLength={200}
          placeholder="e.g. Packaging damaged, Incorrect dimensions captured..."
          className={inputClass("reason")}
        />
        <div className="flex justify-between mt-1">
          <FieldError field="reason" />
          <span
            className={`text-[10px] ${reason.length > 180 ? "text-orange-500" : "text-gray-400"}`}
          >
            {reason.length}/200
          </span>
        </div>

        {/* Comments */}
        <label className="block text-xs font-semibold text-gray-700 mb-1.5 mt-4">
          Comments <span className="text-red-500">*</span>
        </label>
        <textarea
          value={comments}
          onChange={handleCommentsChange}
          onBlur={() =>
            setErrors((prev) => ({
              ...prev,
              comments: validateText(comments, "Comments", {
                minLen: 5,
                maxLen: 500,
              }),
            }))
          }
          disabled={submitting}
          maxLength={500}
          placeholder="Add details for the resolution team..."
          className={`${inputClass("comments")} h-20 sm:h-24 resize-none`}
        />
        <div className="flex justify-between mt-1">
          <FieldError field="comments" />
          <span
            className={`text-[10px] ${comments.length > 450 ? "text-orange-500" : "text-gray-400"}`}
          >
            {comments.length}/500
          </span>
        </div>

        <div className="mt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            onClick={() => !submitting && fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (submitting) return;
              const dropped = Array.from(e.dataTransfer.files || []);
              const imagesOnly = dropped.filter((f) =>
                ["image/jpeg", "image/png", "image/jpg"].includes(f.type),
              );
              const combined = [...files, ...imagesOnly];
              if (combined.length > MAX_EVIDENCE_FILES) {
                toast.error(`Max ${MAX_EVIDENCE_FILES} files allowed`);
                return;
              }
              setFiles(combined);
            }}
            className={`border-2 border-dashed border-blue-200 rounded-xl p-4 sm:p-6 text-center cursor-pointer hover:bg-blue-50/50 transition-colors ${
              submitting ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <div className="w-9 h-9 mx-auto rounded-full bg-blue-100 text-[#0446DB] flex items-center justify-center mb-2">
              <Icons.Upload />
            </div>
            <p className="text-sm font-semibold text-[#0446DB]">
              Upload packaging evidence images
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              JPG or PNG · Max {MAX_EVIDENCE_FILES} · Timestamp must be visible
            </p>
          </div>
        </div>

        {/* File previews */}
        {files.length > 0 && (
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-gray-500 uppercase mb-2">
              Selected ({files.length}/{MAX_EVIDENCE_FILES})
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100"
                >
                  <img
                    src={previews[i]}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
                    <p className="text-[9px] text-white font-medium truncate">
                      {(file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(i);
                    }}
                    disabled={submitting}
                    aria-label="Remove file"
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 hover:bg-red-700 disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2.5 rounded-lg bg-[#0446DB] text-white text-sm font-semibold hover:bg-[#0339B5] disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Submitting…" : "Submit dispute"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ACCEPT MODAL
// ============================================================
function AcceptModal({ awb, amount, onClose, onConfirm, submitting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5 sm:p-6">
        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3">
          <Icons.Check />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
          Accept weight difference?
        </h3>
        <p className="text-sm text-gray-600 mb-5">
          <span className="font-semibold text-gray-900">
            {fmtMoney(amount)}
          </span>{" "}
          will be deducted from your wallet against{" "}
          <span className="font-semibold text-gray-900">{awb}</span>. This
          action cannot be reversed.
        </p>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="px-4 py-2.5 rounded-lg bg-[#0446DB] text-white text-sm font-semibold hover:bg-[#0339B5] text-center leading-tight disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              "Processing…"
            ) : (
              <>
                Accept &amp; deduct
                <br />
                {fmtMoney(amount)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ item, onClose, onDispute, onAccept, isAdmin = false }) {
  const amount = getAmount(item);
  const isDisputeOpen = item.status === "Dispute Open";
  const isActionable =
    item.status === "Awaiting Seller" ||
    (item.status === "Settlement Pending" &&
      item.settlement_action === "SELLER_ACCEPT");

  const declaredWeight =
    item.declared_chargeable_weight ?? item.declared_dead_weight;
  const rawCaptured = item.raw_captured_dead_weight;
  const capturedChargeable = item.captured_chargeable_weight;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-start justify-between p-4 sm:p-5 border-b border-gray-100 gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-wide uppercase text-gray-400">
            Weight discrepancy · DSP-{item.discrepancy_id ?? item.id}
          </p>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5 truncate">
            {item.awb_number}
          </h2>
          <div className="mt-1">
            <StatusBadge status={item.status} />
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 shrink-0 cursor-pointer"
        >
          <Icons.Close />
        </button>
      </div>

      <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
        {/* ============ AMOUNT ON HOLD (Admin only) ============ */}
        {(isAdmin || !isDisputeOpen) && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
            <p className="text-[13px] font-semibold text-orange-700">
              Amount currently on hold
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1 flex items-center gap-2">
              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path
                  d="M0 10C0 4.47715 4.47715 0 10 0H28C33.5228 0 38 4.47715 38 10V28C38 33.5228 33.5228 38 28 38H10C4.47715 38 0 33.5228 0 28V10Z"
                  fill="#FFEDD5"
                />
                <path
                  d="M25.6666 19.0002V15.6668H13.9999C13.5579 15.6668 13.134 15.4912 12.8214 15.1787C12.5088 14.8661 12.3333 14.4422 12.3333 14.0002C12.3333 13.0835 13.0833 12.3335 13.9999 12.3335H23.9999V15.6668"
                  stroke="#F97316"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.3333 14V24C12.3333 24.9167 13.0833 25.6667 13.9999 25.6667H25.6666V22.3333"
                  stroke="#F97316"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M23.9999 19C23.5579 19 23.134 19.1756 22.8214 19.4882C22.5088 19.8007 22.3333 20.2246 22.3333 20.6667C22.3333 21.1087 22.5088 21.5326 22.8214 21.8452C23.134 22.1577 23.5579 22.3333 23.9999 22.3333H27.3333V19H23.9999Z"
                  stroke="#F97316"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {fmtMoney(amount)}
            </p>
          </div>
        )}

        {/* ============ ORDER INFO ============ */}
        <div className="bg-gray-50 rounded-lg divide-y divide-gray-100 text-sm">
          <div className="flex justify-between gap-2 px-3 py-2.5">
            <span className="text-gray-500">AWB</span>
            <span className="text-gray-800 font-medium break-all text-right">
              {item.awb_number ?? "—"}
            </span>
          </div>
          <div className="flex justify-between gap-2 px-3 py-2.5">
            <span className="text-gray-500">Order ID</span>
            <span className="text-gray-800 font-medium">
              {item.order_id ?? "—"}
            </span>
          </div>
        </div>

        {/* ============ WEIGHT BREAKDOWN ============ */}
        <div>
          <p className="text-xs font-bold text-gray-900 mb-2">Weight details</p>
          <div className="bg-gray-50 rounded-lg divide-y divide-gray-100 text-sm">
            <div className="flex justify-between gap-2 px-3 py-2.5">
              <span className="text-gray-500">Declared dead weight</span>
              <span className="text-gray-800 font-medium">
                {fmtGrams(item.declared_dead_weight)}
              </span>
            </div>

            <div className="flex justify-between gap-2 px-3 py-2.5">
              <span className="text-gray-500">Raw captured weight</span>
              <span className="text-gray-800 font-medium">
                {fmtGrams(rawCaptured)}
              </span>
            </div>

            {item.captured_volumetric_weight != null && (
              <div className="flex justify-between gap-2 px-3 py-2.5">
                <span className="text-gray-500">
                  Captured volumetric weight
                </span>
                <span className="text-gray-800 font-medium">
                  {fmtGrams(item.captured_volumetric_weight)}
                </span>
              </div>
            )}

            <div className="flex justify-between gap-2 px-3 py-2.5">
              <span className="text-gray-500">Captured chargeable weight</span>
              <span className="text-gray-800 font-semibold">
                {fmtGrams(capturedChargeable)}
              </span>
            </div>

            <div className="flex justify-between gap-2 px-3 py-2.5">
              <span className="text-gray-500">Declared dimensions</span>
              <span className="text-gray-800 font-medium">
                {fmtDims(
                  item.declared_length,
                  item.declared_breadth,
                  item.declared_height,
                )}
              </span>
            </div>

            <div className="flex justify-between gap-2 px-3 py-2.5">
              <span className="text-gray-500">Captured dimensions</span>
              <span className="text-gray-800 font-medium">
                {fmtDims(
                  item.effective_length,
                  item.effective_breadth,
                  item.effective_height,
                )}
              </span>
            </div>

            {item.weight_diff_grams != null && (
              <div className="flex justify-between gap-2 px-3 py-2.5 bg-red-50">
                <span className="text-red-700 font-medium">
                  Weight difference
                </span>
                <span className="text-red-700 font-bold">
                  {fmtGrams(item.weight_diff_grams)}
                </span>
              </div>
            )}
          </div>
        </div>

        {(item.declared_freight != null || item.captured_freight != null) && (
          <div>
            <p className="text-xs font-bold text-gray-900 mb-2">
              Freight breakdown
            </p>
            <div className="bg-gray-50 rounded-lg divide-y divide-gray-100 text-sm">
              <div className="flex justify-between gap-2 px-3 py-2.5">
                <span className="text-gray-500">Declared freight</span>
                <span className="text-gray-800 font-medium">
                  {fmtMoney(item.declared_freight)}
                </span>
              </div>
              <div className="flex justify-between gap-2 px-3 py-2.5">
                <span className="text-gray-500">Captured freight</span>
                <span className="text-gray-800 font-medium">
                  {fmtMoney(item.captured_freight)}
                </span>
              </div>
              <div className="flex justify-between gap-2 px-3 py-2.5 bg-red-50">
                <span className="text-red-700 font-medium">
                  Additional charge
                </span>
                <span className="text-red-700 font-bold">
                  {fmtMoney(item.additional_charge)}
                </span>
              </div>
            </div>
          </div>
        )}

        {(item.dispute_reason || item.seller_comments) && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-[11px] font-bold uppercase text-orange-700 mb-1">
              Dispute raised
            </p>
            {item.dispute_reason && (
              <p className="text-xs text-orange-800">
                <strong>Reason:</strong> {item.dispute_reason}
              </p>
            )}
            {item.seller_comments && (
              <p className="text-xs text-orange-800 mt-1">
                <strong>Comments:</strong> {item.seller_comments}
              </p>
            )}
          </div>
        )}

        {item.status !== "Awaiting Seller" &&
          item.evidence &&
          item.evidence.length > 0 && (
            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              <p className="text-xs font-bold text-gray-900 mb-2">
                Captured package evidence
              </p>
              <div className="space-y-3">
                {item.evidence.map((file, idx) => {
                  const url = getEvidenceUrl(file.file_path);
                  return (
                    <div
                      key={file.id ?? idx}
                      className="flex items-center gap-3"
                    >
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0"
                      >
                        <img
                          src={url}
                          alt={file.original_filename || `Evidence ${idx + 1}`}
                          className="w-14 h-14 rounded-lg object-cover bg-gray-100 hover:opacity-80 transition-opacity"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect width='56' height='56' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-size='9' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo img%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </a>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-gray-900 truncate">
                          {file.original_filename || `Evidence ${idx + 1}`}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {fmtDate(file.uploaded_at)}
                        </p>
                      </div>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-bold text-[#0446DB] hover:text-[#0339B5] cursor-pointer shrink-0"
                      >
                        View
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
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {isActionable && item.action_deadline && (
          <p className="text-xs text-gray-400">
            Respond by{" "}
            <span className="font-semibold text-red-600">
              {fmtDate(item.action_deadline)}
            </span>
          </p>
        )}

        {isActionable && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-1">
            <button
              onClick={onDispute}
              className="py-2.5 rounded-lg border-2 border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 cursor-pointer"
            >
              Reject &amp; dispute
            </button>
            <button
              onClick={onAccept}
              className="py-2.5 rounded-lg bg-[#0446DB] text-white text-sm font-semibold hover:bg-[#0339B5] cursor-pointer"
            >
              Accept difference
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WeightDiscrepancies() {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [bulkAccepting, setBulkAccepting] = useState(false);
  const [bulkResults, setBulkResults] = useState(null);
  const [showBulkResults, setShowBulkResults] = useState(false);

  const [tab, setTab] = useState("needs-action");
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [counts, setCounts] = useState({
    "needs-action": 0,
    disputed: 0,
    history: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showRaiseModal, setShowRaiseModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [exporting, setExporting] = useState(false);

  // ---------- LOAD LIST ----------
  const loadList = async (page = pagination.page) => {
    setLoading(true);
    try {
      const res = await getMerchantDiscrepancies({
        status: TAB_STATUS_MAP[tab],
        page,
        limit: PAGE_SIZE,
      });

      const rows = res?.data?.rows || [];
      const pg = res?.data?.pagination || {
        page: 1,
        limit: PAGE_SIZE,
        total: 0,
        totalPages: 1,
      };

      setList(rows);
      setPagination(pg);

      if (rows.length > 0 && !selected) {
        setSelected(rows[0]);
      } else if (rows.length === 0) {
        setSelected(null);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to load discrepancies",
      );
      setList([]);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelected(null);
    loadList(1);
  }, [tab]);

  // ---------- LOAD COUNTS ----------
  const loadCounts = async () => {
    try {
      const [a, d, h] = await Promise.all([
        getMerchantDiscrepancies({ status: "Awaiting Seller", limit: 1 }),
        getMerchantDiscrepancies({
          status: "Dispute Open,Settlement Pending",
          limit: 1,
        }),
        getMerchantDiscrepancies({
          status: "Seller Accepted,Auto-Accepted,Seller Favour,Courier Favour",
          limit: 1,
        }),
      ]);
      setCounts({
        "needs-action": a?.data?.pagination?.total ?? 0,
        disputed: d?.data?.pagination?.total ?? 0,
        history: h?.data?.pagination?.total ?? 0,
      });
    } catch (err) {
      console.error("Failed to load counts", err);
    }
  };

  useEffect(() => {
    loadCounts();
  }, []);

  // ---------- ROW CLICK ----------
  const handleRowClick = async (row) => {
    setDetailLoading(true);
    try {
      const id = getDiscrepancyId(row);
      const res = await getMerchantDiscrepancyDetail(id);
      setSelected(res.data);
    } catch (err) {
      setSelected(row);
      toast.error(err?.response?.data?.message || "Failed to load detail");
    } finally {
      setDetailLoading(false);
    }
  };

  // ---------- ACCEPT ----------
  const handleAcceptConfirm = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      const id = getDiscrepancyId(selected);
      await acceptMerchantDiscrepancy(id);
      toast.success("Discrepancy accepted — amount deducted");
      setShowAcceptModal(false);
      await loadList();
      await loadCounts();
    } catch (err) {
      const msg = err?.response?.data?.message || "";
      if (msg.includes("Settlement Pending")) {
        toast.info(
          "We couldn't process this right now, we'll retry automatically",
          { autoClose: 5000 },
        );
      } else {
        toast.error(msg || "Failed to accept");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- DISPUTE ----------
  const handleDisputeSubmit = async ({ reason, comments, files }) => {
    if (!selected) return;
    setSubmitting(true);
    try {
      const id = getDiscrepancyId(selected);
      const res = await rejectMerchantDiscrepancy({
        discrepancyId: id,
        reason,
        comments,
        evidence: files,
      });
      toast.success(
        `Dispute raised. Reference: ${res?.data?.zoho_ticket_reference || "—"}`,
      );
      setShowRaiseModal(false);
      await loadList();
      await loadCounts();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to raise dispute");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- EXPORT ----------
  const handleExport = async () => {
    setExporting(true);
    try {
      await exportMerchantDiscrepancies({ status: TAB_STATUS_MAP[tab] });
      toast.success("CSV downloaded");
    } catch (err) {
      toast.error("Failed to export");
    } finally {
      setExporting(false);
    }
  };

  const handleRefresh = async () => {
    try {
      await Promise.all([loadList(pagination.page), loadCounts()]);
      toast.success("Refreshed", { autoClose: 1500 });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to refresh data. Please try again.";

      toast.error(message, { autoClose: 3000 });
      if (err?.config?.url) {
        console.error("Failed URL:", err.config.url);
      }
    }
  };

  // ---------- BULK ACCEPT ----------
  const toggleRowSelection = (id, status) => {
    if (status !== "Awaiting Seller") return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const selectableIds = list
      .filter((r) => r.status === "Awaiting Seller")
      .map((r) => getDiscrepancyId(r));

    const allSelected =
      selectableIds.length > 0 &&
      selectableIds.every((id) => selectedIds.has(id));

    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(selectableIds.slice(0, 100)));
    }
  };

  const getSelectedRows = () =>
    list.filter((r) => selectedIds.has(getDiscrepancyId(r)));

  const selectedTotal = getSelectedRows().reduce(
    (sum, r) => sum + Number(r.amount_on_hold || r.additional_charge || 0),
    0,
  );

  const handleBulkAccept = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return toast.error("No rows selected");
    if (ids.length > 100) return toast.error("Max 100 rows per request");

    setBulkAccepting(true);
    try {
      const res = await acceptMerchantDiscrepanciesBulk({
        discrepancy_ids: ids,
      });
      const data = res?.data || {};

      setBulkResults(data);
      setShowBulkConfirm(false);
      setShowBulkResults(true);
      setSelectedIds(new Set());

      await loadList(pagination.page);
      await loadCounts();

      toast.success(
        `Accepted ${data.accepted_count ?? 0} of ${data.requested_count ?? ids.length}`,
      );
    } catch (err) {
      console.error("[bulk-accept] error:", err);
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.message;

      if (serverMsg) {
        toast.error(serverMsg);
      } else if (status === 404) {
        toast.error("Bulk accept endpoint not found. Contact support.");
      } else if (status === 401 || status === 403) {
        toast.error("Session expired. Please login again.");
      } else if (status >= 500) {
        toast.error("Server error. Please try again.");
      } else if (err?.message === "Network Error") {
        toast.error("Network error. Check your connection.");
      } else {
        toast.error("Failed to bulk accept discrepancies");
      }
    } finally {
      setBulkAccepting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header
        className="text-white px-4 sm:px-6 md:px-10 py-4 sm:py-5"
        style={{ backgroundColor: BRAND_COLOR }}
      >
        <p className="text-[11px] font-semibold tracking-wider uppercase text-blue-200">
          Seller / Billing
        </p>
        <h1 className="text-lg sm:text-2xl font-bold mt-1">
          Weight Discrepancies
        </h1>
        <p className="text-blue-100 text-xs sm:text-sm mt-1">
          Accept a verified difference or dispute it with timestamped packaging
          evidence.
        </p>
      </header>

      <main className="p-3 sm:p-4 md:p-8">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Tabs active={tab} counts={counts} onChange={setTab} />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading || exporting}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
              title="Refresh"
            >
              <Icons.Refresh spin={loading} />
              <span className="hidden sm:inline">
                {loading ? "Refreshing…" : "Refresh"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleExport}
              disabled={exporting || loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            >
              <Icons.Download />
              {exporting ? "Exporting…" : "Export CSV"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          {/* ✅ Bulk Accept Bar */}
          {selectedIds.size > 0 && (
            <div className="bg-[#0446DB] text-white rounded-xl px-4 py-3 mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-lg lg:col-span-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">
                  {selectedIds.size} selected
                </span>
                <span className="text-sm text-blue-100">
                  Total: {fmtMoney(selectedTotal)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedIds(new Set())}
                  className="text-xs px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setShowBulkConfirm(true)}
                  className="text-xs px-4 py-1.5 rounded-lg bg-white text-[#0446DB] font-bold hover:bg-blue-50 cursor-pointer"
                >
                  Accept Selected ({selectedIds.size})
                </button>
              </div>
            </div>
          )}
          {/* LEFT: List */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-3 py-3 w-[40px]">
                      <input
                        type="checkbox"
                        checked={
                          list.filter((r) => r.status === "Awaiting Seller")
                            .length > 0 &&
                          list
                            .filter((r) => r.status === "Awaiting Seller")
                            .every((r) => selectedIds.has(getDiscrepancyId(r)))
                        }
                        onChange={toggleSelectAll}
                        disabled={
                          !list.some((r) => r.status === "Awaiting Seller")
                        }
                        className="w-4 h-4 rounded border-gray-300 text-[#0446DB] focus:ring-[#0446DB] cursor-pointer"
                        title="Select all (Awaiting Seller only)"
                      />
                    </th>
                    {[
                      "AWB / PICKUP SOURCE",
                      "DECLARED WEIGHT",
                      "CAPTURED WEIGHT",
                      "VARIANCE",
                      "DECLARED FREIGHT",
                      "CAPTURED FREIGHT",
                      "STATUS",
                      "",
                    ].map((h, i) => (
                      <th
                        key={i}
                        className="px-4 md:px-5 py-3 text-[10px] font-bold tracking-wider uppercase text-gray-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <LoadingSkeleton rows={5} />
                  ) : list.length === 0 ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="px-5 py-12 text-center text-sm text-gray-400"
                      >
                        No discrepancies in this tab.
                      </td>
                    </tr>
                  ) : (
                    list.map((row) => {
                      const id = getDiscrepancyId(row);
                      const isSel = getDiscrepancyId(selected) === id;
                      const isActionable =
                        row.status === "Awaiting Seller" ||
                        (row.status === "Settlement Pending" &&
                          row.settlement_action === "SELLER_ACCEPT");

                      return (
                        <tr
                          key={id}
                          onClick={() => handleRowClick(row)}
                          className={`cursor-pointer transition-colors border-l-4 ${
                            isSel
                              ? "bg-blue-50 border-l-[#0446DB]"
                              : "border-l-transparent hover:bg-gray-50"
                          }`}
                        >
                          <td
                            className="px-3 py-3.5 w-[40px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {row.status === "Awaiting Seller" ? (
                              <input
                                type="checkbox"
                                checked={selectedIds.has(id)}
                                onChange={() =>
                                  toggleRowSelection(id, row.status)
                                }
                                className="w-4 h-4 rounded border-gray-300 text-[#0446DB] focus:ring-[#0446DB] cursor-pointer"
                              />
                            ) : (
                              <span className="inline-block w-4 h-4" />
                            )}
                          </td>

                          {/* AWB / PICKUP SOURCE */}
                          <td className="px-4 md:px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                  isSel ? "bg-blue-100" : "bg-gray-50"
                                }`}
                              >
                                <Icons.Cube
                                  color={isSel ? "#0446DB" : "#64748B"}
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {row.awb_number}
                                </p>
                                <p className="text-[11px] text-gray-500">
                                  Seller pickup #{id}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* DECLARED WEIGHT */}
                          <td className="px-4 md:px-5 py-3.5 text-sm text-gray-700 whitespace-nowrap">
                            {fmtGrams(row.declared_dead_weight)}
                          </td>

                          {/* CAPTURED WEIGHT */}
                          <td className="px-4 md:px-5 py-3.5 text-sm text-gray-700 whitespace-nowrap">
                            {fmtGrams(row.captured_dead_weight)}
                          </td>

                          {/* VARIANCE */}
                          <td className="px-4 md:px-5 py-3.5 text-sm font-bold text-red-600 whitespace-nowrap">
                            {fmtGrams(row.weight_diff_grams)}
                          </td>

                          {/* DECLARED FREIGHT */}
                          <td className="px-4 md:px-5 py-3.5 text-sm text-gray-700 whitespace-nowrap">
                            {fmtMoney(row.declared_freight)}
                          </td>

                          {/* CAPTURED FREIGHT */}
                          <td className="px-4 md:px-5 py-3.5 text-sm text-gray-700 whitespace-nowrap">
                            {fmtMoney(row.captured_freight)}
                          </td>
                          <td className="px-4 md:px-5 py-3.5 whitespace-nowrap">
                            <StatusBadge status={row.status} />
                          </td>

                          {/* Action */}
                          <td className="px-4 md:px-5 py-3.5">
                            <div className="flex items-center justify-center">
                              {isSel ? (
                                <Icons.ArrowRightIcon />
                              ) : isActionable ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRowClick(row).then(() =>
                                      setShowAcceptModal(true),
                                    );
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-[#0446DB] text-white text-xs font-semibold hover:bg-[#0339B5] whitespace-nowrap cursor-pointer"
                                >
                                  Accept
                                </button>
                              ) : (
                                <ArrowLeft className="w-5 h-5 text-gray-300 text-xs" />
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={(p) => loadList(p)}
            />
          </div>

          {showBulkConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3">
                  <Icons.Check />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Accept {selectedIds.size} discrepancies?
                </h3>
                <p className="text-sm text-gray-600 mb-5">
                  Total{" "}
                  <span className="font-semibold text-gray-900">
                    {fmtMoney(selectedTotal)}
                  </span>{" "}
                  will be deducted from your wallet. This action cannot be
                  reversed.
                </p>
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                  <button
                    onClick={() => setShowBulkConfirm(false)}
                    disabled={bulkAccepting}
                    className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkAccept}
                    disabled={bulkAccepting}
                    className="px-4 py-2.5 rounded-lg bg-[#0446DB] text-white text-sm font-semibold hover:bg-[#0339B5] disabled:opacity-50 cursor-pointer"
                  >
                    {bulkAccepting
                      ? "Processing…"
                      : `Accept & Deduct ${fmtMoney(selectedTotal)}`}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showBulkResults && bulkResults && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Bulk Accept Results
                  </h3>
                  <button
                    onClick={() => {
                      setShowBulkResults(false);
                      setBulkResults(null);
                    }}
                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                  >
                    <Icons.Close />
                  </button>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-[#0446DB]">
                      {bulkResults.requested_count ?? 0}
                    </p>
                    <p className="text-[10px] font-bold uppercase text-gray-500 mt-0.5">
                      Requested
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-700">
                      {bulkResults.accepted_count ?? 0}
                    </p>
                    <p className="text-[10px] font-bold uppercase text-gray-500 mt-0.5">
                      Accepted
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-700">
                      {bulkResults.already_accepted_count ?? 0}
                    </p>
                    <p className="text-[10px] font-bold uppercase text-gray-500 mt-0.5">
                      Already
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {bulkResults.failed_count ?? 0}
                    </p>
                    <p className="text-[10px] font-bold uppercase text-gray-500 mt-0.5">
                      Failed
                    </p>
                  </div>
                </div>

                {/* Per-row results */}
                <div className="flex-1 overflow-y-auto space-y-2">
                  {(bulkResults.results || []).map((r) => {
                    const isSuccess = r.status === "Seller Accepted";
                    const isPending = r.status === "Settlement Pending";
                    const isAlready = r.message
                      ?.toLowerCase()
                      .includes("already");

                    let badge, badgeColor;
                    if (isSuccess) {
                      badge = "Accepted";
                      badgeColor = "bg-green-100 text-green-700";
                    } else if (isPending) {
                      badge = "Settlement Pending";
                      badgeColor = "bg-orange-100 text-orange-700";
                    } else if (isAlready) {
                      badge = "Already Accepted";
                      badgeColor = "bg-gray-100 text-gray-700";
                    } else {
                      badge = "Failed";
                      badgeColor = "bg-red-100 text-red-700";
                    }

                    return (
                      <div
                        key={r.discrepancy_id}
                        className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs"
                      >
                        <span className="font-mono font-bold text-gray-900 shrink-0">
                          DSP-{r.discrepancy_id}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase shrink-0 ${badgeColor}`}
                        >
                          {badge}
                        </span>
                        <span className="text-gray-600 flex-1 text-right break-words">
                          {r.message}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setShowBulkResults(false);
                      setBulkResults(null);
                    }}
                    className="px-5 py-2.5 rounded-lg bg-[#0446DB] text-white text-sm font-semibold hover:bg-[#0339B5] cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="lg:col-span-2">
            {detailLoading ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-sm text-gray-400">
                Loading detail…
              </div>
            ) : selected ? (
              <DetailPanel
                item={selected}
                onClose={() => setSelected(null)}
                onDispute={() => setShowRaiseModal(true)}
                onAccept={() => setShowAcceptModal(true)}
                onViewEvidence={() => setShowEvidenceModal(true)}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-sm text-gray-400">
                Select a row to view details
              </div>
            )}
          </div>
        </div>
      </main>

      {showRaiseModal && (
        <RaiseDisputeModal
          onClose={() => setShowRaiseModal(false)}
          onSubmit={handleDisputeSubmit}
          submitting={submitting}
        />
      )}

      {showAcceptModal && selected && (
        <AcceptModal
          awb={selected.awb_number}
          amount={getAmount(selected)}
          onClose={() => setShowAcceptModal(false)}
          onConfirm={handleAcceptConfirm}
          submitting={submitting}
        />
      )}

      {showEvidenceModal && selected && (
        <EvidenceModal
          evidence={selected.evidence || []}
          awb={selected.awb_number}
          onClose={() => setShowEvidenceModal(false)}
        />
      )}
    </div>
  );
}
