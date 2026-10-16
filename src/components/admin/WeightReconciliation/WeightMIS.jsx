import React, { useEffect, useRef, useState } from "react";

import {
  exportEligibleShipments,
  uploadMIS,
  getDashboardSummary,
  getUploadSummary,
  getUploadRows,
  updateRow,
  discardUpload,
  exportErrors,
  getSubmitPreview,
  submitUpload,
  getDiscrepancies,
  exportDiscrepancies,
} from "../../../Redux/weightMis";
import { toast } from "react-toastify";

// ============================================================
// CONSTANTS
// ============================================================
const BRAND_COLOR = "#0446DB";

// ============================================================
// HELPERS
// ============================================================
const fmtGm = (v) =>
  v === null || v === undefined || v === "" ? "—" : `${v} gm`;

const fmtMoney = (v) => `₹${Number(v || 0).toLocaleString("en-IN")}`;

const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ============================================================
// ICONS
// ============================================================
const Icons = {
  UploadNewMISICON: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.625 4.875V2.70833C1.625 2.42102 1.73914 2.14547 1.9423 1.9423C2.14547 1.73914 2.42102 1.625 2.70833 1.625H10.2917C10.579 1.625 10.8545 1.73914 11.0577 1.9423C11.2609 2.14547 11.375 2.42102 11.375 2.70833V4.875"
        stroke="white"
        stroke-width="1.08333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.20831 7.5835L6.49998 4.87516L3.79165 7.5835"
        stroke="white"
        stroke-width="1.08333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.5 4.875V11.375"
        stroke="white"
        stroke-width="1.08333"
        stroke-linecap="round"
        stroke-linejoin="round"
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
  Warning: () => (
    <svg
      className="w-5 h-5 text-red-800"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  CheckCircle: () => (
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
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
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
  Upload: () => (
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
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
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
  ArrowRight: () => (
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
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  ),
  ChevronDown: () => (
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
        d="M19 9l-7 7-7-7"
      />
    </svg>
  ),
  Edit: () => (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  ),
  Trash: () => (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
      />
    </svg>
  ),
  PickedUPShipmentsIcon: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M12.5 2.5H1.66666C1.20642 2.5 0.833328 2.8731 0.833328 3.33333V12.5C0.833328 12.9602 1.20642 13.3333 1.66666 13.3333H12.5C12.9602 13.3333 13.3333 12.9602 13.3333 12.5V3.33333C13.3333 2.8731 12.9602 2.5 12.5 2.5Z"
        stroke="#2563EB"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3333 6.6665H16.6667L19.1667 9.1665V13.3332H13.3333V6.6665Z"
        stroke="#2563EB"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.58333 17.5002C5.73393 17.5002 6.66667 16.5674 6.66667 15.4168C6.66667 14.2662 5.73393 13.3335 4.58333 13.3335C3.43274 13.3335 2.5 14.2662 2.5 15.4168C2.5 16.5674 3.43274 17.5002 4.58333 17.5002Z"
        stroke="#2563EB"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.4167 17.5002C16.5673 17.5002 17.5 16.5674 17.5 15.4168C17.5 14.2662 16.5673 13.3335 15.4167 13.3335C14.2661 13.3335 13.3333 14.2662 13.3333 15.4168C13.3333 16.5674 14.2661 17.5002 15.4167 17.5002Z"
        stroke="#2563EB"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  DraftUploadsIcon: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M11.6666 1.6665H4.99998C4.55795 1.6665 4.13403 1.8421 3.82147 2.15466C3.50891 2.46722 3.33331 2.89114 3.33331 3.33317V16.6665C3.33331 17.1085 3.50891 17.5325 3.82147 17.845C4.13403 18.1576 4.55795 18.3332 4.99998 18.3332H15C15.442 18.3332 15.8659 18.1576 16.1785 17.845C16.4911 17.5325 16.6666 17.1085 16.6666 16.6665V6.6665L11.6666 1.6665Z"
        stroke="#F59E0B"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.6667 1.6665V6.6665H16.6667"
        stroke="#F59E0B"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  ValidationErrorsIcon: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M8.57502 3.21684L1.51668 15.0002C1.37116 15.2522 1.29416 15.5379 1.29334 15.8289C1.29253 16.12 1.36793 16.4061 1.51204 16.6589C1.65615 16.9118 1.86396 17.1225 2.11477 17.27C2.36559 17.4176 2.65068 17.497 2.94168 17.5002H17.0583C17.3494 17.497 17.6344 17.4176 17.8853 17.27C18.1361 17.1225 18.3439 16.9118 18.488 16.6589C18.6321 16.4061 18.7075 16.12 18.7067 15.8289C18.7059 15.5379 18.6289 15.2522 18.4834 15.0002L11.425 3.21684C11.2765 2.97193 11.0673 2.76944 10.8177 2.62891C10.5681 2.48838 10.2865 2.41455 10 2.41455C9.71357 2.41455 9.43196 2.48838 9.18235 2.62891C8.93275 2.76944 8.72358 2.97193 8.57502 3.21684Z"
        stroke="#EF4444"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 7.5V10.8333"
        stroke="#EF4444"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 14.1665H10.0083"
        stroke="#EF4444"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  SubmittedUploadsicon: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M18.3333 9.23355V10.0002C18.3323 11.7972 17.7504 13.5458 16.6744 14.9851C15.5985 16.4244 14.0861 17.4773 12.3628 17.9868C10.6395 18.4963 8.79771 18.4351 7.11205 17.8124C5.42639 17.1896 3.9872 16.0386 3.00912 14.5311C2.03105 13.0236 1.56648 11.2403 1.68472 9.44714C1.80296 7.65402 2.49766 5.94715 3.66522 4.58111C4.83278 3.21506 6.41064 2.26303 8.16348 1.867C9.91632 1.47097 11.7502 1.65216 13.3917 2.38355"
        stroke="#2563EB"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3333 3.3335L10 11.6752L7.5 9.17516"
        stroke="#2563EB"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  OpenDiscrepanciesIcon: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2.5V17.5"
        stroke="#F59E0B"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.1667 4.1665H7.91667C7.14312 4.1665 6.40125 4.47379 5.85427 5.02078C5.30729 5.56776 5 6.30962 5 7.08317C5 7.85672 5.30729 8.59858 5.85427 9.14557C6.40125 9.69255 7.14312 9.99984 7.91667 9.99984H12.0833C12.8569 9.99984 13.5987 10.3071 14.1457 10.8541C14.6927 11.4011 15 12.143 15 12.9165C15 13.6901 14.6927 14.4319 14.1457 14.9789C13.5987 15.5259 12.8569 15.8332 12.0833 15.8332H5"
        stroke="#F59E0B"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  AmountOnHoldIcon: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M16.6666 10.0002V6.66683H4.99998C4.55795 6.66683 4.13403 6.49123 3.82147 6.17867C3.50891 5.86611 3.33331 5.44219 3.33331 5.00016C3.33331 4.0835 4.08331 3.3335 4.99998 3.3335H15V6.66683"
        stroke="#16A34A"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.33331 5V15C3.33331 15.9167 4.08331 16.6667 4.99998 16.6667H16.6666V13.3333"
        stroke="#16A34A"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 10C14.558 10 14.134 10.1756 13.8215 10.4882C13.5089 10.8007 13.3333 11.2246 13.3333 11.6667C13.3333 12.1087 13.5089 12.5326 13.8215 12.8452C14.134 13.1577 14.558 13.3333 15 13.3333H18.3333V10H15Z"
        stroke="#16A34A"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// ============================================================
// REUSABLE
// ============================================================
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    draft: "bg-yellow-100 text-yellow-800",
    errors: "bg-red-100 text-red-800",
    error: "bg-red-100 text-red-800",
    invalid: "bg-red-100 text-red-800",
    processing: "bg-blue-100 text-blue-800",
    submitted: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-700",
    "backend cancelled": "bg-red-50 text-red-700",
    valid: "bg-green-100 text-green-800",
    fallback: "bg-orange-100 text-orange-800",
    discarded: "bg-gray-200 text-gray-600",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.default}`}
    >
      {children}
    </span>
  );
};

const Button = ({
  children,
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}) => {
  const variants = {
    primary: "text-white hover:opacity-90",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-100",
    outline: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button
      type="button"
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${variants[variant]} ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer active:scale-[0.98]"
      } ${className}`}
      style={variant === "primary" ? { backgroundColor: BRAND_COLOR } : {}}
      {...props}
    >
      {children}
    </button>
  );
};

// ============================================================
// EDIT ROW MODAL
// ============================================================
const EditRowModal = ({ row, uploadId, onClose, onSaved }) => {
  const [form, setForm] = useState({
    captured_dead_weight: row.captured_dead_weight ?? "",
    captured_length: row.captured_length ?? "",
    captured_breadth: row.captured_breadth ?? "",
    captured_height: row.captured_height ?? "",
    capture_timestamp: row.capture_timestamp
      ? new Date(row.capture_timestamp).toISOString().slice(0, 16)
      : "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // ---------- VALIDATION ----------
  // Rule: if value exists, must be a positive number (> 0)
  // Empty is allowed (means no change / fallback)
  const validateField = (name, value) => {
    if (value === "" || value === null || value === undefined) {
      return ""; // Empty is OK
    }

    const str = String(value).trim();

    // Must be a valid number
    if (str === "" || isNaN(Number(str))) {
      return "Must be a valid number";
    }

    const num = Number(str);

    // Must be positive
    if (num <= 0) {
      return "Must be greater than 0";
    }

    // Must not be scientific notation
    if (str.includes("e") || str.includes("E")) {
      return "Scientific notation not allowed";
    }

    // Must not have leading + or be weird
    if (str.startsWith("+")) {
      return "Invalid number format";
    }

    // Max length check (avoid absurdly long numbers)
    if (str.replace(".", "").length > 10) {
      return "Number is too long";
    }

    return "";
  };

  const validateAll = () => {
    const newErrors = {};

    [
      "captured_dead_weight",
      "captured_length",
      "captured_breadth",
      "captured_height",
    ].forEach((field) => {
      const err = validateField(field, form[field]);
      if (err) newErrors[field] = err;
    });

    // Timestamp validation
    if (form.capture_timestamp) {
      const ts = new Date(form.capture_timestamp);
      if (isNaN(ts.getTime())) {
        newErrors.capture_timestamp = "Invalid date/time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- KEY BLOCKER ----------
  const blockInvalidKeys = (e) => {
    const blocked = ["e", "E", "+", "-"];
    if (blocked.includes(e.key)) {
      e.preventDefault();
    }
  };

  // ---------- PASTE HANDLER ----------
  const handleNumberChange = (field, rawValue) => {
    let cleaned = rawValue.replace(/[^\d.]/g, "");

    // Only one decimal point
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts.slice(1).join("");
    }

    setForm((f) => ({ ...f, [field]: cleaned }));

    // Validate live
    const err = validateField(field, cleaned);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSave = async () => {
    if (!validateAll()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        captured_dead_weight:
          form.captured_dead_weight === ""
            ? null
            : Number(form.captured_dead_weight),
        captured_length:
          form.captured_length === "" ? null : Number(form.captured_length),
        captured_breadth:
          form.captured_breadth === "" ? null : Number(form.captured_breadth),
        captured_height:
          form.captured_height === "" ? null : Number(form.captured_height),
        capture_timestamp:
          form.capture_timestamp === ""
            ? null
            : form.capture_timestamp.replace("T", " ") + ":00",
      };

      const res = await updateRow(uploadId, row.id, payload);
      toast.success(res.message || "Row updated");
      onSaved?.();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update row");
    } finally {
      setSaving(false);
    }
  };

  // ---------- INPUT CLASS HELPER ----------
  const inputClass = (field) =>
    `w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
        : "border-gray-200 focus:border-[#0446DB]"
    }`;

  // ---------- ERROR MESSAGE ----------
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 cursor-pointer"
        >
          <Icons.Close />
        </button>

        <h3 className="text-lg font-bold text-gray-900 mb-1">
          Edit captured values
        </h3>
        <p className="text-xs text-gray-500 mb-5">
          AWB <span className="font-semibold">{row.awb_number}</span> · Row #
          {row.row_number}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Weight */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Captured weight (gm)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={form.captured_dead_weight}
              onChange={(e) =>
                handleNumberChange("captured_dead_weight", e.target.value)
              }
              onKeyDown={blockInvalidKeys}
              placeholder="Enter weight in gm"
              className={inputClass("captured_dead_weight")}
            />
            <FieldError field="captured_dead_weight" />
          </div>

          {/* Timestamp */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Capture timestamp
            </label>
            <input
              type="datetime-local"
              value={form.capture_timestamp}
              onChange={(e) =>
                setForm((f) => ({ ...f, capture_timestamp: e.target.value }))
              }
              className={inputClass("capture_timestamp")}
            />
            <FieldError field="capture_timestamp" />
          </div>

          {/* Length */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Length (cm)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={form.captured_length}
              onChange={(e) =>
                handleNumberChange("captured_length", e.target.value)
              }
              onKeyDown={blockInvalidKeys}
              placeholder="Enter length in cm"
              className={inputClass("captured_length")}
            />
            <FieldError field="captured_length" />
          </div>

          {/* Breadth */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Breadth (cm)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={form.captured_breadth}
              onChange={(e) =>
                handleNumberChange("captured_breadth", e.target.value)
              }
              onKeyDown={blockInvalidKeys}
              placeholder="Enter breadth in cm"
              className={inputClass("captured_breadth")}
            />
            <FieldError field="captured_breadth" />
          </div>

          {/* Height */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={form.captured_height}
              onChange={(e) =>
                handleNumberChange("captured_height", e.target.value)
              }
              onKeyDown={blockInvalidKeys}
              placeholder="Enter height in cm"
              className={inputClass("captured_height")}
            />
            <FieldError field="captured_height" />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2.5 rounded-lg bg-[#0446DB] text-white text-sm font-semibold hover:bg-[#0339B5] disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save & Revalidate"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// DISCREPANCIES VIEW (Step 5)
// ============================================================
const DiscrepanciesView = ({ uploadId, onBack }) => {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getDiscrepancies(uploadId, { page, limit: 20 });
      setRows(res.data.rows || []);
      setPagination(res.data.pagination || null);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to load discrepancies",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, uploadId]);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportDiscrepancies(uploadId);
      toast.success("Discrepancies CSV downloaded");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to export");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header
        className="text-white p-5 md:p-6 md:px-10"
        style={{ backgroundColor: BRAND_COLOR }}
      >
        <div className="mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Discrepancies</h1>
            <p className="text-blue-100 text-sm mt-1">
              Upload #{uploadId} · All raised discrepancies
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {exporting ? "Exporting…" : "Export CSV"}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              ← Back
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 md:px-8 mt-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-sm text-gray-400">
              Loading…
            </div>
          ) : rows.length === 0 ? (
            <div className="py-16 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                  <Icons.Document />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  No discrepancies
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  This upload didn't raise any discrepancies.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-left">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-gray-200">
                      {[
                        "AWB No.",
                        "Order ID",
                        "Seller ID",
                        "Declared Wt",
                        "Captured Wt",
                        "Effective Wt",
                        "Declared Freight",
                        "Captured Freight",
                        "Additional Charge",
                        "Status",
                        "Created",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-[11px] font-semibold tracking-wide uppercase text-[#8A9AB5]"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-[13px] font-medium text-[#27364D]">
                          {r.awb_number}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-[#5F6F86]">
                          {r.order_id ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-[#5F6F86]">
                          {r.seller_id}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-[#27364D]">
                          {fmtGm(r.declared_dead_weight)}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-[#27364D]">
                          {fmtGm(r.captured_dead_weight)}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-[#27364D]">
                          {fmtGm(r.effective_dead_weight)}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-[#27364D]">
                          {fmtMoney(r.declared_freight)}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-[#27364D]">
                          {fmtMoney(r.captured_freight)}
                        </td>
                        <td className="px-4 py-3 text-[13px] font-semibold text-red-600">
                          {fmtMoney(r.additional_charge)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 rounded-md bg-yellow-100 text-yellow-800 text-[12px] font-medium">
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-gray-500">
                          {fmtDate(r.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-xs text-gray-400">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}{" "}
                    of {pagination.total} discrepancies
                  </p>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md border ${
                        page === 1
                          ? "text-gray-300 border-gray-200 cursor-not-allowed"
                          : "text-gray-700 border-gray-200 hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      Previous
                    </button>

                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1,
                    ).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 text-xs font-semibold rounded-md ${
                          page === p
                            ? "bg-[#0446DB] text-white"
                            : "text-gray-600 hover:bg-gray-100 cursor-pointer"
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={page === pagination.totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(pagination.totalPages, p + 1))
                      }
                      className={`px-3 py-1.5 text-xs font-medium rounded-md border ${
                        page === pagination.totalPages
                          ? "text-gray-300 border-gray-200 cursor-not-allowed"
                          : "text-gray-700 border-gray-200 hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
// ============================================================
// DASHBOARD
// ============================================================
const Dashboard = ({ onNavigateToUpload }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const [exporting, setExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  });
  const [sellerId, setSellerId] = useState("");
  const [uploadsPage, setUploadsPage] = useState(1);
  const UPLOADS_PER_PAGE = 5;

  const load = async () => {
    setLoading(true);
    try {
      const res = await getDashboardSummary();
      setSummary(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleExportPickupList = () => {
    setSellerId("");
    setShowExportModal(true);
  };

  const handleDownloadPickupCSV = async () => {
    setExporting(true);
    try {
      const res = await exportEligibleShipments({
        pickup_date: pickupDate || undefined,
        seller_id: sellerId?.trim() || undefined,
      });

      const isEmpty = !res?.data || res.data.size === 0;
      if (isEmpty) {
        toast.error("No eligible shipments found for the selected filters.");
        return;
      }

      toast.success("Pickup list exported successfully.");
      setShowExportModal(false);
      setSellerId("");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to export pickup list.",
      );
    } finally {
      setExporting(false);
    }
  };

  const handleRecentAction = (row) => {
    onNavigateToUpload(row.upload_id);
  };

  const stats = summary
    ? [
        {
          title: "Eligible Picked-up Shipments",
          value: summary.picked_up_shipments ?? 0,
          icon: <Icons.PickedUPShipmentsIcon />,
          iconBg: "bg-blue-50 text-[#0446DB]",
        },
        {
          title: "Draft Uploads",
          value: summary.draft_uploads ?? 0,
          icon: <Icons.DraftUploadsIcon />,
          iconBg: "bg-yellow-50 text-yellow-600",
        },
        {
          title: "Validation Errors",
          value: summary.validation_errors ?? 0,
          icon: <Icons.ValidationErrorsIcon />,
          iconBg: "bg-red-50 text-red-600",
        },
        {
          title: "Submitted Uploads",
          value: summary.submitted_uploads_this_month ?? 0,
          // sub: "This Month",
          icon: <Icons.SubmittedUploadsicon />,
          iconBg: "bg-blue-50 text-[#0446DB]",
        },
        {
          title: "Awaiting Seller",
          value: summary.awaiting_seller_discrepancies ?? 0,
          icon: <Icons.OpenDiscrepanciesIcon />,
          iconBg: "bg-yellow-50 text-yellow-600",
        },
        {
          title: "Settlement Pending",
          value: summary.settlement_pending_discrepancies ?? 0,
          icon: <Icons.AmountOnHoldIcon />,
          iconBg: "bg-orange-50 text-orange-600",
        },
        {
          title: "Amount on Hold",
          value: fmtMoney(summary.amount_on_hold),
          icon: <Icons.AmountOnHoldIcon />,
          iconBg: "bg-green-50 text-green-600",
        },
      ]
    : [];

  const recentUploads = summary?.recent_uploads || [];
  const totalUploadPages = Math.max(
    1,
    Math.ceil(recentUploads.length / UPLOADS_PER_PAGE),
  );
  const uploadStartIdx = (uploadsPage - 1) * UPLOADS_PER_PAGE;
  const uploadEndIdx = uploadStartIdx + UPLOADS_PER_PAGE;
  const paginatedUploads = recentUploads.slice(uploadStartIdx, uploadEndIdx);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="">
      
      <main className="mx-auto ">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-7 gap-5 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="relative">
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-gray-500 text-sm">{stat.title}</div>
              {stat.sub && (
                <div className="text-gray-400 text-xs mt-2">{stat.sub}</div>
              )}
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Uploads */}
          <Card className="xl:col-span-2 p-0 overflow-hidden">
            <div className="p-5 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
              <h2 className="text-lg font-bold text-gray-900">
                Recent Weight Uploads
              </h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  className="text-xs"
                  onClick={handleExportPickupList}
                >
                  <Icons.Download />
                  Export Pickup List
                </Button>
                <Button
                  className="text-xs"
                  onClick={() => onNavigateToUpload(null)}
                >
                  <Icons.UploadNewMISICON />
                  Upload New MIS
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3 font-medium">AWB Batch</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Records</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Discrepancies</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedUploads.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-sm text-gray-400"
                      >
                        No uploads yet.
                      </td>
                    </tr>
                  ) : (
                    paginatedUploads.map((row) => (
                      <tr
                        key={row.upload_id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-gray-500 w-[250px] max-w-[250px]">
                          <div className="relative group w-[210px]">
                            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                              {row.original_filename}
                            </div>

                            {/* Full filename on hover */}
                            <div
                              className="absolute left-0 top-full mt-1 z-50 hidden group-hover:block
                    bg-white border border-[#D8E0EA] rounded-lg shadow-lg
                    px-3 py-2 text-[12px] text-[#344054]
                    whitespace-nowrap max-w-[400px]"
                            >
                              {row.original_filename}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                          {new Date(row.created_at).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {row.total_rows}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={String(row.upload_status).toLowerCase()}
                          >
                            {row.upload_status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {row.discrepancy_rows ?? "—"}
                        </td>
                        <td className="px-6 py-4">
                          {row.upload_status === "Draft" ? (
                            <button
                              type="button"
                              onClick={() => handleRecentAction(row)}
                              className="inline-flex items-center px-3 py-1.5 rounded-md bg-[#0446DB] text-white text-xs font-semibold hover:bg-[#0339B5] transition-colors whitespace-nowrap cursor-pointer"
                            >
                              Continue
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleRecentAction(row)}
                              className="text-[#0446DB] text-xs font-semibold hover:underline whitespace-nowrap cursor-pointer"
                            >
                              {row.discrepancy_rows
                                ? `View ${row.discrepancy_rows} discrepancies →`
                                : "View"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {recentUploads.length > 0 && totalUploadPages > 1 && (
                <div className="px-4 md:px-6 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-xs text-gray-500">
                    Showing <strong>{uploadStartIdx + 1}</strong> to{" "}
                    <strong>
                      {Math.min(uploadEndIdx, recentUploads.length)}
                    </strong>{" "}
                    of <strong>{recentUploads.length}</strong> uploads
                  </p>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={uploadsPage === 1}
                      onClick={() => setUploadsPage((p) => Math.max(1, p - 1))}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md border ${
                        uploadsPage === 1
                          ? "text-gray-300 border-gray-200 cursor-not-allowed"
                          : "text-gray-700 border-gray-200 hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      Previous
                    </button>

                    {Array.from(
                      { length: totalUploadPages },
                      (_, i) => i + 1,
                    ).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setUploadsPage(p)}
                        className={`w-8 h-8 text-xs font-semibold rounded-md ${
                          uploadsPage === p
                            ? "bg-[#0446DB] text-white"
                            : "text-gray-600 hover:bg-gray-100 cursor-pointer"
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={uploadsPage === totalUploadPages}
                      onClick={() =>
                        setUploadsPage((p) => Math.min(totalUploadPages, p + 1))
                      }
                      className={`px-3 py-1.5 text-xs font-medium rounded-md border ${
                        uploadsPage === totalUploadPages
                          ? "text-gray-300 border-gray-200 cursor-not-allowed"
                          : "text-gray-700 border-gray-200 hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                Needs Attention
              </h2>
            </div>

            <div className="p-4 space-y-2">
              {(summary?.open_discrepancies ?? 0) > 0 &&
                (() => {
                  const discs = (summary?.recent_uploads || []).filter(
                    (u) =>
                      Number(u.discrepancy_rows) > 0 &&
                      u.upload_status === "Submitted",
                  );
                  if (!discs.length) return null;
                  const ids = discs.map((d) => d.upload_id);
                  const totalDisc = discs.reduce(
                    (s, u) => s + Number(u.discrepancy_rows || 0),
                    0,
                  );

                  return (
                    <button
                      type="button"
                      onClick={() => onNavigateToUpload(ids)}
                      className="group w-full text-left bg-red-50 p-4 border-l-4 border-l-red-500 border border-red-100 hover:bg-red-100 transition-colors "
                    >
                      <p className="text-sm text-red-800 font-medium">
                        {totalDisc} dispute{totalDisc === 1 ? "" : "s"} near SLA
                        breach — review now
                      </p>
                      <span className="group text-xs text-[#0446DB] font-medium mt-2 inline-flex items-center gap-1 cursor-pointer">
                        View Queue
                        <Icons.ArrowRight />
                        <span className="inline-flex overflow-hidden w-0 opacity-0 transition-all duration-200 group-hover:w-4 group-hover:opacity-100">
                          <Icons.ArrowRight />
                        </span>
                      </span>
                    </button>
                  );
                })()}

              {(summary?.draft_uploads ?? 0) > 0 &&
                (() => {
                  const drafts = (summary?.recent_uploads || []).filter(
                    (u) => u.upload_status === "Draft",
                  );
                  if (!drafts.length) return null;
                  const ids = drafts.map((d) => d.upload_id);

                  return (
                    <button
                      type="button"
                      className="group w-full text-left bg-yellow-50 p-4 border-l-4 border-l-[#F4A900] border border-yellow-100 hover:bg-yellow-100 transition-colors"
                    >
                      <p className="text-sm text-yellow-800 font-medium">
                        {drafts.length} Draft upload(s) pending — submit or
                        discard
                      </p>
                    </button>
                  );
                })()}

              {(summary?.validation_errors ?? 0) > 0 &&
                (() => {
                  const errs = (summary?.recent_uploads || []).filter(
                    (u) =>
                      Number(u.invalid_rows) > 0 && u.upload_status === "Draft",
                  );
                  if (!errs.length) return null;
                  const ids = errs.map((e) => e.upload_id);

                  return (
                    <button
                      type="button"
                      className="group w-full text-left bg-yellow-50 p-4 border-l-4 border-l-[#F4A900] border border-yellow-100 hover:bg-yellow-100 transition-colors"
                    >
                      <p className="text-sm text-yellow-800 font-medium">
                        {summary.validation_errors} validation error(s) — fix or
                        exclude
                      </p>
                    </button>
                  );
                })()}

              {(summary?.submitted_uploads_this_month ?? 0) > 0 &&
                (() => {
                  const subs = (summary?.recent_uploads || []).filter(
                    (u) => u.upload_status === "Submitted",
                  );
                  if (!subs.length) return null;
                  const ids = subs.map((s) => s.upload_id);
                  const idsPreview = subs
                    .slice(0, 3)
                    .map((u) => `#${u.upload_id}`)
                    .join(", ");

                  return (
                    <button
                      type="button"
                      className="group w-full text-left bg-gray-50 p-4 border-l-4 border-l-gray-400 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <p className="text-sm text-gray-700 font-medium">
                        {subs.length} Upload{subs.length > 1 ? "s" : ""}{" "}
                        <strong className="text-gray-900">
                          {idsPreview}
                          {subs.length > 3 ? "…" : ""}
                        </strong>{" "}
                        submitted · processing
                      </p>
                    </button>
                  );
                })()}

              {(summary?.draft_uploads ?? 0) === 0 &&
                (summary?.validation_errors ?? 0) === 0 &&
                (summary?.open_discrepancies ?? 0) === 0 &&
                (summary?.submitted_uploads_this_month ?? 0) === 0 && (
                  <p className="text-sm text-gray-400 text-center py-6">
                    Nothing needs attention right now.
                  </p>
                )}
            </div>
          </Card>
        </div>
      </main>

      {/* Export Modal */}
      {showExportModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowExportModal(false);
          }}
        >
          <div
            className="w-full max-w-[470px] rounded-2xl bg-white shadow-2xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="px-6 pt-7">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[18px] font-bold text-[#182337]">
                    Export Pickup List
                  </h2>
                  <p className="mt-2 text-[14px] leading-5 text-[#718096]">
                    Download pickup data as CSV. Filter by date and seller to
                    narrow the export.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="ml-4 shrink-0 text-[#94A3B8] hover:text-white hover:bg-red-500 cursor-pointer rounded-full p-2 transition-colors"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 pt-6">
              <div>
                <label className="block text-[13px] font-semibold text-[#344054] mb-2">
                  Pickup date{" "}
                  <span className="font-normal text-[#94A3B8]">— Optional</span>
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full h-11 rounded-lg border border-[#D8E0EA] bg-white px-3 text-[14px] outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10"
                />
                <p className="mt-1.5 text-[12px] text-[#94A9C7]">
                  Leave blank to export all dates
                </p>
              </div>

              <div className="mt-5">
                <label className="block text-[13px] font-semibold text-[#344054] mb-2">
                  Seller ID{" "}
                  <span className="font-normal text-[#94A3B8]">— Optional</span>
                </label>
                <input
                  type="number"
                  value={sellerId}
                  onChange={(e) => setSellerId(e.target.value)}
                  placeholder="e.g. 15"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full h-11 rounded-lg border border-[#D8E0EA] bg-white px-3 text-[14px] outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10"
                />
                <p className="mt-1.5 text-[12px] text-[#94A9C7]">
                  Leave blank to export all sellers for this date
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 rounded-lg border border-[#DCE5F0] bg-[#F7F9FC] px-3 py-3">
                <p className="text-[13px] text-[#64748B]">
                  Exporting{" "}
                  <span className="font-bold text-[#182337]">
                    {pickupDate
                      ? new Date(`${pickupDate}T00:00:00`).toLocaleDateString(
                          "en-GB",
                          { day: "2-digit", month: "short", year: "numeric" },
                        )
                      : "All dates"}
                  </span>
                  <span className="mx-1">·</span>
                  {sellerId.trim()
                    ? `Seller ${sellerId.trim()}`
                    : "All sellers"}
                  <span className="mx-1">→</span>
                  <span className="font-medium">CSV</span>
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 px-6 py-7">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="h-11 rounded-lg bg-[#E8EDF5] px-5 text-[14px] font-semibold text-[#27364D] hover:bg-red-500 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDownloadPickupCSV}
                disabled={exporting}
                className="h-11 rounded-lg bg-[#0446DB] px-5 text-[14px] font-semibold text-white flex items-center gap-2 hover:bg-[#0844cf] disabled:opacity-50 cursor-pointer"
              >
                <Icons.Download />
                {exporting ? "Exporting…" : "Download CSV"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// UPLOAD WIZARD
// ============================================================
const UploadWizard = ({ onComplete, resumeUploadIds = [] }) => {
  const [uploadIds, setUploadIds] = useState(() =>
    Array.isArray(resumeUploadIds)
      ? resumeUploadIds
      : resumeUploadIds
        ? [resumeUploadIds]
        : [],
  );

  const [uploadId, setUploadId] = useState(uploadIds[0] || null);
  const [step, setStep] = useState(uploadIds.length ? 2 : 1);
  const [allRows, setAllRows] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showExample, setShowExample] = useState(false);

  const [summary, setSummary] = useState(null);
  const [validationTab, setValidationTab] = useState("All");
  const [rowsLoading, setRowsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ROWS_PER_PAGE = 10;
  const [expandedFallback, setExpandedFallback] = useState(null);

  const [preview, setPreview] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const [editRow, setEditRow] = useState(null);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [discarding, setDiscarding] = useState(false);
  const [showDiscrepancies, setShowDiscrepancies] = useState(false);
  const [wasDiscarded, setWasDiscarded] = useState(false);

  const [exportingErrors, setExportingErrors] = useState(false);
  const handleExportErrors = async (id) => {
    if (!id) {
      toast.error("No upload selected");
      return;
    }
    setExportingErrors(true);
    try {
      await exportErrors(id);
      toast.success("Errors CSV downloaded");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to export errors");
    } finally {
      setExportingErrors(false);
    }
  };
  const fileInputRef = useRef(null);

  // ---------- FILE ----------
  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const maxSize = 10 * 1024 * 1024;
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();

    if (!["csv", "xlsx"].includes(ext)) {
      toast.error("Only CSV and XLSX files are supported.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > maxSize) {
      toast.error("File size must be less than 10MB.");
      event.target.value = "";
      return;
    }

    setFile({
      name: selectedFile.name,
      size: formatBytes(selectedFile.size),
      rawFile: selectedFile,
    });

    toast.success(`${selectedFile.name} selected successfully.`);
  };
  const openFilePicker = () => fileInputRef.current?.click();
  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const goToStep = (target) => {
    if (target <= step) return setStep(target);
    if (!uploadId && target > 1)
      return toast.error("Please upload a MIS file first.");
    if (target <= 3) setStep(target);
  };

  const prevStep = () => step > 1 && setStep((c) => c - 1);

  // ---------- UPLOAD ----------
  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file first.");
    setUploading(true);
    try {
      const res = await uploadMIS(file.rawFile);
      const newId = res.data.upload_id;
      setUploadId(newId);
      setUploadIds([newId]);
      toast.success(`Draft #${newId} created successfully`);
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ---------- LOAD SUMMARY + ROWS ----------
  const loadSummary = async () => {
    if (!uploadId) return;
    try {
      const res = await getUploadSummary(uploadId);
      setSummary(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load summary");
    }
  };
  useEffect(() => {
    if (step !== 2 || !uploadIds.length) return;
    (async () => {
      setRowsLoading(true);
      try {
        const results = await Promise.all(
          uploadIds.map(async (id) => {
            const rowsRes = await getUploadRows(id, { page: 1, limit: 500 });
            return (rowsRes.data.rows || []).map((r) => ({
              ...r,
              upload_id: id,
            }));
          }),
        );
        setAllRows(results.flat());
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load uploads");
      } finally {
        setRowsLoading(false);
      }
    })();
  }, [step, uploadIds.join(","), reloadKey]);

  useEffect(() => {
    if (step !== 2 || !uploadId) return;
    loadSummary();
  }, [step, uploadId, reloadKey]);

  const counts = {
    All: allRows.length,
    Valid: allRows.filter(
      (r) =>
        r.validation_status === "valid" &&
        r.used_fallback_weight !== 1 &&
        r.used_fallback_dimensions !== 1,
    ).length,
    Error: allRows.filter((r) => r.validation_status === "invalid").length,
    Fallback: allRows.filter(
      (r) => r.used_fallback_weight === 1 || r.used_fallback_dimensions === 1,
    ).length,
  };

  const filteredRows = allRows.filter((r) => {
    const isFallback =
      r.used_fallback_weight === 1 || r.used_fallback_dimensions === 1;

    if (validationTab === "All") return true;

    if (validationTab === "Valid")
      return r.validation_status === "valid" && !isFallback;

    if (validationTab === "Error") return r.validation_status === "invalid";

    if (validationTab === "Fallback") return isFallback;

    return true;
  });
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / ROWS_PER_PAGE),
  );
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const paginatedRows = filteredRows.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [validationTab]);

  // ---------- REVIEW ----------
  const goToReview = async () => {
    try {
      const res = await getSubmitPreview(uploadId);
      setPreview(res.data);
      setStep(3);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Cannot proceed — rows invalid",
      );
    }
  };

  // ---------- SUBMIT ----------
  const submitMIS = async () => {
    if (confirmText !== String(uploadId)) {
      return toast.error(`Type ${uploadId} to confirm.`);
    }
    setSubmitting(true);
    try {
      const res = await submitUpload(uploadId);
      setSubmittedData(res.data);
      setShowConfirmModal(false);
      setConfirmText("");
      setStep(4);
      toast.success("MIS submitted successfully.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- DISCARD ----------
  const handleDiscard = async () => {
    setDiscarding(true);
    try {
      const res = await discardUpload(uploadId);
      if (res?.success) {
        toast.success(res.message || "Draft discarded");
        setWasDiscarded(true);
        setShowDiscardConfirm(false);

        setSummary((prev) =>
          prev ? { ...prev, status: "Discarded" } : { status: "Discarded" },
        );

        setTimeout(() => {
          onComplete();
        }, 1200);
      } else {
        toast.error(res?.message || "Failed to discard");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to discard");
    } finally {
      setDiscarding(false);
    }
  };

  // ---------- STEP 1 ----------
  const renderUploadStep = () => (
    <Card>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx"
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        className={`border-2 border-dashed rounded-xl p-8 md:p-12 text-center transition-colors ${
          file
            ? "border-green-500 bg-green-50"
            : "border-[#0446DB]/30 bg-blue-50 hover:bg-blue-100 cursor-pointer"
        }`}
        onClick={!file ? openFilePicker : undefined}
      >
        {file ? (
          <div className="text-green-600 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <Icons.CheckCircle />
            </div>
            <p className="font-semibold text-gray-900">{file.name}</p>
            <p className="text-sm text-gray-500 mt-1">{file.size}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openFilePicker();
              }}
              className="text-[#0446DB] text-sm font-medium mt-3 hover:underline cursor-pointer"
            >
              Change file
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="text-red-600 text-sm font-medium mt-1 hover:underline cursor-pointer"
            >
              Remove file
            </button>
          </div>
        ) : (
          <div className="text-gray-500 flex flex-col items-center">
            <div className="w-15 h-15 rounded-full bg-blue-100 text-[#0446DB] flex items-center justify-center mb-3">
              <Icons.Upload />
            </div>
            <p className="font-medium text-gray-900">
              Drag CSV here or{" "}
              <span className="text-[#0446DB] underline">Browse files</span>
            </p>
            <p className="text-xs mt-2">Supports .csv, .xlsx · Max 10MB</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
          Required Columns
        </p>
        <div className="flex gap-2 flex-wrap">
          {[
            "AWB No",
            "Seller Id",
            "Captured Dead Weight",
            "Captured Length",
            "Captured Breadth",
            "Captured Height",
            "Weight Unit",
            "Dimension Unit",
          ].map((c) => (
            <span
              key={c}
              className="px-3 py-1 bg-blue-50 text-[#0446DB] text-xs font-medium rounded-md"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 border rounded-lg overflow-hidden">
        <button
          type="button"
          className="w-full flex justify-between items-center p-3 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={() => setShowExample((c) => !c)}
        >
          <span>See example row</span>
          <span
            className={`transition-transform ${showExample ? "rotate-180" : ""}`}
          >
            <Icons.ChevronDown />
          </span>
        </button>
        {showExample && (
          <div className="p-3 bg-gray-50 border-t text-xs overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="text-gray-500">
                  <th className="pb-2">AWB No</th>
                  <th className="pb-2">Seller Id</th>
                  <th className="pb-2">Captured Dead Weight</th>
                  <th className="pb-2">Captured Length</th>
                  <th className="pb-2">Captured Breadth</th>
                  <th className="pb-2">Captured Height</th>
                  <th className="pb-2">Weight Unit</th>
                  <th className="pb-2">Dimension Unit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>DKTGO-6931290418</td>
                  <td>15</td>
                  <td>1250</td>
                  <td>30</td>
                  <td>20</td>
                  <td>10</td>
                  <td>gm</td>
                  <td>cm</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="px-4 py-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row sm:justify-between gap-2.5">
        <Button onClick={onComplete}>← Back</Button>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="min-w-[180px]"
          >
            {uploading ? "Uploading…" : "Upload & Validate"}
            <Icons.ArrowRight />
          </Button>
        </div>
      </div>
    </Card>
  );

  // ---------- STEP 2 ----------
  const renderValidateStep = () => {
    return (
      <div className="space-y-4 md:space-y-5">
        <div className="flex flex-wrap items-center gap-2.5">
          {[
            { label: "Total", value: counts.All, color: "text-[#0446DB]" },
            { label: "Valid", value: counts.Valid, color: "text-green-600" },
            {
              label: "Fallbacks",
              value: counts.Fallback,
              color: "text-yellow-600",
            },
            { label: "Errors", value: counts.Error, color: "text-red-600" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-baseline gap-2 bg-white rounded-xl border px-4 py-3 shadow-sm"
            >
              <span className={`text-[22px] font-bold ${s.color}`}>
                {s.value}
              </span>
              <span className="text-[13px] text-gray-500">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Fallback banner */}
        {counts.Fallback > 0 && (
          <div className="bg-[#FFF9E8] border border-[#F4C430] text-[#92400E] px-4 py-3 rounded-xl">
            <p className="text-[13px]">
              <span className="font-bold">
                {counts.Fallback} record(s) used fallback:
              </span>{" "}
              captured weight missing → defaulted to declared weight.
            </p>
          </div>
        )}

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 pt-3 border-b border-gray-100">
            <div className="flex items-center gap-2 overflow-x-auto">
              {["All", "Valid", "Error", "Fallback"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setValidationTab(tab)}
                  className={`shrink-0 px-5 py-2.5 text-[13px] font-semibold rounded-lg mb-2 transition-all cursor-pointer ${
                    validationTab === tab
                      ? "bg-white text-[#182337] shadow-[0_2px_10px_rgba(15,23,42,0.10)]"
                      : "text-[#667085] hover:bg-gray-50"
                  }`}
                >
                  {tab === "Error" ? "Errors" : tab} ({counts[tab] ?? 0})
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px] text-left">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-gray-200">
                  {[
                    "AWB No.",
                    "Seller ID",
                    "Declared Wt",
                    "Captured Wt",
                    "Declared LBH",
                    "Captured LBH",
                    "Variance",
                    "Upload Status",
                    "Row Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-[11px] font-semibold uppercase text-[#8A9AB5]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rowsLoading ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="px-6 py-12 text-center text-sm text-gray-400"
                    >
                      Loading rows…
                    </td>
                  </tr>
                ) : paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                          <Icons.Document />
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                          No records found
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          There are no records for this validation status.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row) => {
                    const isFallback =
                      row.used_fallback_weight === 1 ||
                      row.used_fallback_dimensions === 1;
                    const isError = row.validation_status === "invalid";
                    const isExcluded =
                      row.submission_outcome === "excluded" ||
                      (row.validation_error || "").startsWith(
                        "Excluded at submission:",
                      );
                    const variance =
                      row.declared_dead_weight != null &&
                      row.effective_dead_weight != null
                        ? Number(row.effective_dead_weight) -
                          Number(row.declared_dead_weight)
                        : null;

                    return (
                      <React.Fragment key={`${row.upload_id}-${row.id}`}>
                        <tr
                          onClick={() => {
                            if (isFallback) {
                              setExpandedFallback(
                                expandedFallback ===
                                  `${row.upload_id}-${row.id}`
                                  ? null
                                  : `${row.upload_id}-${row.id}`,
                              );
                            }
                          }}
                          className={`border-b transition-colors cursor-pointer ${
                            isError
                              ? "bg-[#FFF8F8]"
                              : isFallback
                                ? "bg-[#FFFBEF]"
                                : "bg-[#F0FDF4] hover:bg-[#DCFCE7]"
                          }`}
                        >
                          {/* AWB */}
                          <td
                            className={`px-4 py-3 text-[13px] font-medium text-[#27364D] ${
                              isFallback
                                ? "border-l-[3px] border-[#F4A900] border-b-[#F4A900]"
                                : isError
                                  ? "border-l-[3px] border-red-500 border-b-red-500"
                                  : "border-l-[3px] border-green-500 border-b-green-500"
                            }`}
                          >
                            {row.awb_number}
                          </td>

                          {/* Seller */}
                          <td className="px-4 py-3 text-[13px] text-[#5F6F86]">
                            {row.seller_id || "—"}
                          </td>

                          {/* Declared Wt */}
                          <td className="px-4 py-3 text-[13px] text-[#27364D]">
                            {fmtGm(row.declared_dead_weight)}
                          </td>

                          {/* Captured Wt */}
                          <td className="px-4 py-3 text-[13px] text-[#27364D]">
                            {fmtGm(row.effective_dead_weight)}
                          </td>

                          {/* Declared LBH */}
                          <td className="px-4 py-3 text-[13px] text-[#5F6F86]">
                            {row.declared_length
                              ? `${row.declared_length}×${row.declared_breadth}×${row.declared_height} cm`
                              : "—"}
                          </td>

                          {/* Captured LBH */}
                          <td className="px-4 py-3 text-[13px] text-[#5F6F86]">
                            {row.effective_length
                              ? `${row.effective_length}×${row.effective_breadth}×${row.effective_height} cm`
                              : "—"}
                          </td>

                          {/* Variance */}
                          <td
                            className={`px-4 py-3 text-[13px] font-medium ${
                              variance > 0
                                ? "text-red-600"
                                : variance < 0
                                  ? "text-gray-500"
                                  : "text-[#5F6F86]"
                            }`}
                          >
                            {variance == null
                              ? "—"
                              : variance > 0
                                ? `+${variance} gm`
                                : `${variance} gm`}
                          </td>

                          {/* Upload Status — NEW */}
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide ${
                                summary?.status === "Draft"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : summary?.status === "Submitted"
                                    ? "bg-green-100 text-green-800"
                                    : summary?.status === "Discarded"
                                      ? "bg-gray-200 text-gray-600"
                                      : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {summary?.status || "—"}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            {isFallback ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedFallback(
                                    expandedFallback ===
                                      `${row.upload_id}-${row.id}`
                                      ? null
                                      : `${row.upload_id}-${row.id}`,
                                  );
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFF0C2] text-[#A64B00] text-[12px] font-medium hover:bg-[#FFE6A0] cursor-pointer"
                              >
                                Fallback
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  className={`transition-transform ${
                                    expandedFallback ===
                                    `${row.upload_id}-${row.id}`
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                >
                                  <path d="M6 9l6 6 6-6" />
                                </svg>
                              </button>
                            ) : isError ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedFallback(
                                    expandedFallback ===
                                      `${row.upload_id}-${row.id}`
                                      ? null
                                      : `${row.upload_id}-${row.id}`,
                                  );
                                }}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium cursor-pointer ${
                                  isExcluded
                                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                                }`}
                              >
                                {isExcluded ? "Excluded" : "Error"}
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  className={`transition-transform ${
                                    expandedFallback ===
                                    `${row.upload_id}-${row.id}`
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                >
                                  <path d="M6 9l6 6 6-6" />
                                </svg>
                              </button>
                            ) : (
                              <span className="inline-flex px-2.5 py-1 rounded-md bg-[#E7F8EF] text-[#16834D] text-[12px] font-medium">
                                Valid
                              </span>
                            )}
                          </td>

                          {/* Action */}

                          <td className="px-4 py-3 text-[12px]">
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Action */}
                              <td className="px-4 py-3 text-[12px]">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {summary?.status === "Draft" ? (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditRow(row);
                                      }}
                                      className="inline-flex items-center gap-1 text-[#0446DB] text-[12px] font-semibold hover:underline cursor-pointer shrink-0"
                                    >
                                      <Icons.Edit />
                                      Edit
                                    </button>
                                  ) : (
                                    <span className="text-gray-400 text-[12px]">
                                      —
                                    </span>
                                  )}
                                </div>
                              </td>
                            </div>
                          </td>
                        </tr>

                        {/* Fallback OR Error expanded */}
                        {(isFallback || isError) &&
                          expandedFallback === `${row.upload_id}-${row.id}` && (
                            <tr
                              className={`border-b ${
                                isError
                                  ? "bg-[#FFF8F8] border-red-300"
                                  : "bg-[#FFFBEF] border-[#F4C430]"
                              }`}
                            >
                              <td colSpan={10} className="px-4 pt-0 pb-3">
                                <div
                                  className={`ml-3 pl-4 flex items-start gap-2 text-[12px] ${
                                    isError ? "text-red-700" : "text-[#92400E]"
                                  }`}
                                >
                                  {isError ? (
                                    <>
                                      <span className="font-bold shrink-0">
                                        ↳{" "}
                                        {isExcluded
                                          ? "Excluded at submission:"
                                          : "Error:"}
                                      </span>
                                      <span className="break-words">
                                        {row.validation_error?.replace(
                                          "Excluded at submission: ",
                                          "",
                                        ) || "Validation failed for this row."}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="font-bold shrink-0">
                                        ↳ Fallback used:
                                      </span>
                                      <span>
                                        Captured weight missing → defaulted to
                                        declared{" "}
                                        <strong>
                                          {fmtGm(row.declared_dead_weight)}
                                        </strong>
                                      </span>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!rowsLoading && filteredRows.length > 0 && totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-gray-500">
                Showing <strong>{startIndex + 1}</strong> to{" "}
                <strong>{Math.min(endIndex, filteredRows.length)}</strong> of{" "}
                <strong>{filteredRows.length}</strong> records
              </p>

              <div className="flex items-center gap-1">
                {/* Previous */}
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border ${
                    currentPage === 1
                      ? "text-gray-300 border-gray-200 cursor-not-allowed"
                      : "text-gray-700 border-gray-200 hover:bg-gray-50 cursor-pointer"
                  }`}
                >
                  Previous
                </button>

                {/* Page numbers with ellipsis */}
                {(() => {
                  const pages = [];
                  const maxVisible = 5;
                  let start = Math.max(
                    1,
                    currentPage - Math.floor(maxVisible / 2),
                  );
                  let end = Math.min(totalPages, start + maxVisible - 1);

                  if (end - start + 1 < maxVisible) {
                    start = Math.max(1, end - maxVisible + 1);
                  }

                  if (start > 1) {
                    pages.push(
                      <button
                        key={1}
                        type="button"
                        onClick={() => setCurrentPage(1)}
                        className={`w-8 h-8 text-xs font-semibold rounded-md ${
                          currentPage === 1
                            ? "bg-[#0446DB] text-white"
                            : "text-gray-600 hover:bg-gray-100 cursor-pointer"
                        }`}
                      >
                        1
                      </button>,
                    );
                    if (start > 2) {
                      pages.push(
                        <span
                          key="start-ellipsis"
                          className="px-1 text-gray-400 text-xs"
                        >
                          …
                        </span>,
                      );
                    }
                  }

                  for (let i = start; i <= end; i++) {
                    pages.push(
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCurrentPage(i)}
                        className={`w-8 h-8 text-xs font-semibold rounded-md ${
                          currentPage === i
                            ? "bg-[#0446DB] text-white"
                            : "text-gray-600 hover:bg-gray-100 cursor-pointer"
                        }`}
                      >
                        {i}
                      </button>,
                    );
                  }

                  if (end < totalPages) {
                    if (end < totalPages - 1) {
                      pages.push(
                        <span
                          key="end-ellipsis"
                          className="px-1 text-gray-400 text-xs"
                        >
                          …
                        </span>,
                      );
                    }
                    pages.push(
                      <button
                        key={totalPages}
                        type="button"
                        onClick={() => setCurrentPage(totalPages)}
                        className={`w-8 h-8 text-xs font-semibold rounded-md ${
                          currentPage === totalPages
                            ? "bg-[#0446DB] text-white"
                            : "text-gray-600 hover:bg-gray-100 cursor-pointer"
                        }`}
                      >
                        {totalPages}
                      </button>,
                    );
                  }

                  return pages;
                })()}

                {/* Next */}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border ${
                    currentPage === totalPages
                      ? "text-gray-300 border-gray-200 cursor-not-allowed"
                      : "text-gray-700 border-gray-200 hover:bg-gray-50 cursor-pointer"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          <div className="px-4 py-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row sm:justify-between gap-2.5">
            <Button variant="outline" onClick={prevStep}>
              ← Back
            </Button>

            <div className="flex flex-col sm:flex-row gap-2.5">
              {/* {summary?.status !== "Submitted" &&
                summary?.status !== "Discarded" &&
                !wasDiscarded && (
                  <button
                    type="button"
                    onClick={() => setShowDiscardConfirm(true)}
                    disabled={discarding}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold border border-red-200 hover:bg-red-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icons.Trash />
                    {discarding ? "Discarding…" : "Discard Upload"}
                  </button>
                )} */}
              {summary?.status === "Draft" && !wasDiscarded && (
                <button
                  type="button"
                  onClick={() => setShowDiscardConfirm(true)}
                  disabled={discarding}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold border border-red-200 hover:bg-red-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icons.Trash />
                  {discarding ? "Discarding…" : "Discard Upload"}
                </button>
              )}

              {counts.Error > 0 &&
                summary?.status === "Draft" &&
                !wasDiscarded && (
                  <button
                    type="button"
                    onClick={() => handleExportErrors(uploadId)}
                    disabled={exportingErrors}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold border border-gray-200 hover:bg-gray-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icons.Download />
                    {exportingErrors ? "Exporting…" : "Export Errors"}
                  </button>
                )}

              {summary?.status === "Draft" && !wasDiscarded ? (
                <Button
                  onClick={goToReview}
                  disabled={(summary?.valid_rows ?? 0) === 0}
                  className="min-w-[220px]"
                >
                  Proceed with {summary?.valid_rows ?? 0} valid record
                  {(summary?.valid_rows ?? 0) === 1 ? "" : "s"} →
                </Button>
              ) : (
                <span className="text-gray-400 text-xs font-medium px-4 py-2">
                  {summary?.status === "Discarded"
                    ? "This upload was discarded"
                    : summary?.status === "Submitted"
                      ? "This upload was submitted"
                      : summary?.status === "Closed"
                        ? "This upload was closed — no actions available"
                        : summary?.status === "Backend Cancelled"
                          ? "This upload was cancelled by admin"
                          : "No actions available"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReviewStep = () => {
    const blockedRows = preview?.blocked_rows || [];
    const excludedCount = preview?.excluded_row_count ?? blockedRows.length;
    const hasBlocked = excludedCount > 0;
    const hasNoValidRows = (preview?.shipment_count ?? 0) === 0;

    return (
      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Submission Summary
          </h2>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-[#0446DB]">
                {preview?.shipment_count ?? "—"}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Shipments to Submit
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-700">
                {preview?.discrepancy_candidate_count ?? "—"}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Expected Discrepancies
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-700">
                {fmtMoney(preview?.estimated_hold_amount)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Est. Hold Amount</div>
            </div>
          </div>

          {/* ✅ Blocked rows section */}
          {hasBlocked && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#DC2626"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 9v2m0 4h.01M4.93 19h14.14c1.02 0 1.66-1.1 1.16-1.99L13.16 4.99a1.34 1.34 0 00-2.32 0L3.77 17.01A1.34 1.34 0 004.93 19z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-red-800">
                    {excludedCount} row{excludedCount > 1 ? "s" : ""} will be
                    excluded from submission
                  </p>
                  <p className="text-xs text-red-700 mt-0.5">
                    These rows have validation errors and won't be submitted.
                    You can still proceed with the remaining valid rows.
                  </p>

                  {/* Blocked rows list */}
                  {blockedRows.length > 0 && (
                    <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto">
                      {blockedRows.map((b, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 bg-white border border-red-200 rounded-md px-3 py-2 text-xs"
                        >
                          <span className="font-mono font-semibold text-red-800 shrink-0">
                            Row #{b.row_number ?? b.mis_weight_id ?? "—"}
                          </span>
                          <span className="text-gray-700 font-medium shrink-0">
                            {b.awb_number ?? "—"}
                          </span>
                          <span className="text-red-600 ml-auto text-right break-words">
                            {b.error || b.error_message || "Validation failed"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ✅ No valid rows — block UI */}
          {hasNoValidRows && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-bold text-red-800">
                No valid rows available for submission
              </p>
              <p className="text-xs text-red-700 mt-1">
                Fix the errors in your draft and try again.
              </p>
            </div>
          )}
        </Card>

        <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-lg text-sm">
          Sellers will be notified by email once submitted. They have{" "}
          <strong>7 days</strong> to accept or dispute each discrepancy.
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Button variant="outline" onClick={prevStep}>
            ← Back
          </Button>
          <Button
            onClick={() => setShowConfirmModal(true)}
            disabled={hasNoValidRows}
          >
            {hasNoValidRows
              ? "No valid rows"
              : `Submit ${preview?.shipment_count ?? 0} valid rows`}
            <Icons.ArrowRight />
          </Button>
        </div>
      </div>
    );
  };

  // ---------- STEP 4 ----------
  const renderSuccessStep = () => (
    <div className="max-w-[600px] mx-auto mt-10 text-center border border-gray-100 rounded-xl p-8 bg-white shadow-sm">
      <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
        <svg
          className="w-8 h-8"
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
      </div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
        {submittedData?.upload_status === "Closed"
          ? "MIS submitted — no discrepancies raised"
          : `MIS submitted — ${submittedData?.discrepancy_rows ?? 0} discrepancies raised`}
      </h1>
      <p className="text-sm text-gray-500">
        {submittedData?.upload_status === "Closed"
          ? "Upload closed. All rows processed successfully with no discrepancies."
          : "Your weight MIS has been successfully submitted."}
      </p>

      <div className="grid grid-cols-3 gap-4 my-8 text-sm">
        <div className="text-center">
          <div className="text-[#0446DB] font-bold text-lg">
            #{submittedData?.upload_id}
          </div>
          <div className="text-gray-500">Upload ID</div>
        </div>
        <div className="text-center">
          <div className="text-[#0446DB] font-bold text-lg">
            {submittedData?.shipment_count ?? 0}
          </div>
          <div className="text-gray-500">Records</div>
        </div>
        <div className="text-center">
          <div className="text-[#0446DB] font-bold text-lg">
            {fmtMoney(submittedData?.total_hold_amount)}
          </div>
          <div className="text-gray-500">On Hold</div>
        </div>
      </div>

      {/* NEW: Excluded rows notice */}
      {(submittedData?.excluded_row_count ?? 0) > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-bold text-red-800">
            {submittedData.excluded_row_count} row(s) were excluded
          </p>
          <p className="text-xs text-red-700 mt-1">
            These rows had validation errors and were not submitted. Fix them
            and re-upload in a new CSV.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <Button
          className="w-full h-12 font-semibold"
          onClick={() => setShowDiscrepancies(true)}
        >
          View {submittedData?.discrepancy_rows ?? 0} discrepancies
          <Icons.ArrowRight />
        </Button>
        <Button
          variant="secondary"
          className="w-full h-12 font-semibold bg-[#E8EDF5] text-[#27364D]"
          onClick={async () => {
            try {
              await exportDiscrepancies(uploadId);
              toast.success("Discrepancies CSV downloaded");
            } catch (err) {
              toast.error(err?.response?.data?.message || "Failed to export");
            }
          }}
        >
          <Icons.Download />
          Download Discrepancies CSV
        </Button>
        <Button
          variant="secondary"
          className="w-full h-12 font-semibold bg-[#E8EDF5] text-[#27364D]"
          onClick={onComplete}
        >
          Return to Overview
        </Button>

        <p className="text-[#94A3B8] text-[12px]">
          This cannot be adjusted here — but you can update the discrepancy
          threshold for future uploads in Settings.
        </p>
      </div>
    </div>
  );

  if (showDiscrepancies) {
    return (
      <DiscrepanciesView
        uploadId={uploadId}
        onBack={() => setShowDiscrepancies(false)}
      />
    );
  }

  // ---------- MAIN WIZARD ----------
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header
        className="text-white p-5 md:p-10"
        style={{ backgroundColor: BRAND_COLOR }}
      >
        <h1 className="text-2xl font-bold">
          {step === 4 ? "Weight MIS" : "Upload Weight MIS"}
        </h1>
        {step < 4 && (
          <p className="text-blue-100 text-sm mt-1">
            Upload, validate and submit your weight MIS
            {uploadId
              ? ` · Draft #${uploadId}${
                  uploadIds.length > 1 ? ` (+${uploadIds.length - 1} more)` : ""
                }`
              : ""}
          </p>
        )}
      </header>

      <div className="mx-auto px-4 md:px-8 mt-8">
        {step < 4 && (
          <div className="flex items-center w-full lg:w-[40%] mb-8 overflow-x-auto pb-2">
            {[
              { num: 1, label: "Upload" },
              { num: 2, label: "Validate" },
              { num: 3, label: "Review" },
              { num: 4, label: "Submit" },
            ].map((item, idx) => {
              const isCompleted = step > item.num;
              const isActive = step === item.num;
              return (
                <React.Fragment key={item.num}>
                  <button
                    type="button"
                    // onClick={() => goToStep(item.num)}
                    className="flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCompleted
                          ? "bg-green-100 text-green-600"
                          : isActive
                            ? "text-white"
                            : "bg-gray-200 text-gray-500"
                      }`}
                      style={isActive ? { backgroundColor: BRAND_COLOR } : {}}
                    >
                      {isCompleted ? "✓" : item.num}
                    </div>
                    <span
                      className={`text-[13px] font-medium whitespace-nowrap ${
                        isActive
                          ? "text-[#0446DB] font-semibold"
                          : "text-gray-400"
                      }`}
                    >
                      {item.num}. {item.label}
                    </span>
                  </button>
                  {idx < 3 && (
                    <div
                      className={`flex-1 min-w-[20px] h-[2px] mx-2 ${step > item.num ? "bg-[#0446DB]" : "bg-gray-200"}`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {step === 1 && renderUploadStep()}
        {step === 2 && renderValidateStep()}
        {step === 3 && renderReviewStep()}
        {step === 4 && renderSuccessStep()}
      </div>

      {/* Edit Row Modal */}
      {editRow && (
        <EditRowModal
          row={editRow}
          uploadId={editRow.upload_id}
          onClose={() => setEditRow(null)}
          onSaved={() => setReloadKey((k) => k + 1)}
        />
      )}
      {/* Discard Confirm */}
      {showDiscardConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowDiscardConfirm(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Discard this draft?
            </h3>
            <p className="text-sm text-gray-600 mb-5">
              Upload <strong>#{uploadId}</strong> and all its rows will be
              permanently discarded. This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDiscardConfirm(false)}
                disabled={discarding}
                className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDiscard}
                disabled={discarding}
                className="px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {discarding ? "Discarding…" : "Yes, discard"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirm */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowConfirmModal(false);
          }}
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Confirm MIS Submission
              </h2>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-white hover:bg-red-600 p-1 rounded-md"
              >
                <Icons.Close />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              This will submit the MIS and raise discrepancies for affected
              sellers.
            </p>

            {/* <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Upload ID</span>
                <span className="font-medium">#{uploadId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Valid Records</span>
                <span className="font-medium">
                  {preview?.shipment_count ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Expected discrepancies</span>
                <span className="font-medium">
                  {preview?.discrepancy_candidate_count ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated hold amount</span>
                <span className="font-medium">
                  {fmtMoney(preview?.estimated_hold_amount)}
                </span>
              </div>
            </div> */}

            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Upload ID</span>
                <span className="font-medium">#{uploadId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Valid Records</span>
                <span className="font-medium">
                  {preview?.shipment_count ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Expected discrepancies</span>
                <span className="font-medium">
                  {preview?.discrepancy_candidate_count ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated hold amount</span>
                <span className="font-medium">
                  {fmtMoney(preview?.estimated_hold_amount)}
                </span>
              </div>
              {(preview?.excluded_row_count ?? 0) > 0 && (
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <span className="text-red-600 font-medium">
                    Rows to exclude
                  </span>
                  <span className="text-red-600 font-bold">
                    {preview.excluded_row_count}
                  </span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <strong>{uploadId}</strong> to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && confirmText === String(uploadId))
                    submitMIS();
                }}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0446DB]"
                placeholder={String(uploadId)}
              />
            </div>

            <div className="bg-[#FFF8F0] border border-[#FCD9B6] text-[#D97706] p-3.5 rounded-lg text-[13px] mb-6 flex items-start gap-2.5">
              <div className="mt-0.5 shrink-0">
                <Icons.Warning />
              </div>
              <p>
                This cannot be undone from here — but you can adjust the
                discrepancy threshold before it applies to future uploads.
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmText("");
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={confirmText !== String(uploadId) || submitting}
                onClick={submitMIS}
              >
                {submitting ? "Submitting…" : "Confirm Submission"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Discrepancies View */}
      {showDiscrepancies && (
        <DiscrepanciesView
          uploadId={uploadId}
          onBack={() => setShowDiscrepancies(false)}
        />
      )}
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function WeightMIS() {
  const [currentScreen, setCurrentScreen] = useState("dashboard");
  const [resumeUploadIds, setResumeUploadIds] = useState([]);

  const navigateToUpload = (ids) => {
    const arr = Array.isArray(ids) ? ids : ids ? [ids] : [];
    setResumeUploadIds(arr);
    setCurrentScreen("upload");
  };

  const navigateToDashboard = () => {
    setResumeUploadIds([]);
    setCurrentScreen("dashboard");
  };

  return (
    <>
      <div className="font-sans text-gray-900 antialiased">
        {currentScreen === "dashboard" ? (
          <Dashboard onNavigateToUpload={navigateToUpload} />
        ) : (
          <UploadWizard
            onComplete={navigateToDashboard}
            resumeUploadIds={resumeUploadIds}
          />
        )}
      </div>
    </>
  );
}
