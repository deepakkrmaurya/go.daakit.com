import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  Eye,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  IndianRupee,
  Loader2,
  Package,
  Receipt,
  ReceiptText,
  RefreshCw,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

// ============================================================
// API CONFIG
// ============================================================

const API_BASE = "/api/merchant";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// API functions
const getInvoices = async (params) => {
  const { data } = await axiosInstance.get(`${API_BASE}/invoices`, { params });
  return data;
};

const getCreditNotes = async (params) => {
  const { data } = await axiosInstance.get(`${API_BASE}/credit-notes`, {
    params,
  });
  return data;
};

const getInvoiceDetail = async (id) => {
  const { data } = await axiosInstance.get(`${API_BASE}/invoices/${id}`);
  return data;
};

const getCreditNoteDetail = async (id) => {
  const { data } = await axiosInstance.get(`${API_BASE}/credit-notes/${id}`);
  return data;
};

const getInvoicePdf = async (id) => {
  return axiosInstance.get(`${API_BASE}/invoices/${id}/pdf`, {
    responseType: "blob",
  });
};

const getCreditNotePdf = async (id) => {
  return axiosInstance.get(`${API_BASE}/credit-notes/${id}/pdf`, {
    responseType: "blob",
  });
};

const getShipmentExport = async (id) => {
  return axiosInstance.get(`${API_BASE}/invoices/${id}/shipments/export`, {
    responseType: "blob",
  });
};

// ============================================================
// HELPERS
// ============================================================

const formatCurrency = (value) => {
  if (value == null || value === "") return "—";
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatLabel = (value) => {
  if (value == null || value === "") return "—";
  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const isDateField = (key) =>
  [
    "created_at",
    "updated_at",
    "generation_date",
    "period_start",
    "period_end",
    "payment_updated_at",
    "txn_created_at",
  ].includes(key);

const isAmountField = (key) =>
  [
    "amount",
    "taxable_amount",
    "cgst_amount",
    "sgst_amount",
    "igst_amount",
    "total_amount",
    "debit_total",
    "credit_total",
    "net_amount",
    "freight_charge",
    "cod_charge",
    "rto_freight_charge",
    "insurance_charge",
  ].includes(key);

const formatValue = (key, value) => {
  if (value == null || value === "") return "—";
  if (isAmountField(key)) return formatCurrency(value);
  if (isDateField(key)) return formatDateTime(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return formatLabel(value);
};

const downloadBlob = (blob, filename) => {
  if (!(blob instanceof Blob)) throw new Error("Invalid file response.");
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
};

const getBlobErrorMessage = async (error, fallback) => {
  const data = error?.response?.data;
  if (data instanceof Blob) {
    try {
      const text = await data.text();
      if (text) {
        const json = JSON.parse(text);
        return json?.message || fallback;
      }
    } catch {
      return fallback;
    }
  }
  return error?.response?.data?.message || error?.message || fallback;
};

// ============================================================
// SUBCOMPONENTS (StatusBadge, EmptyState, LoadingState, etc.)
// ============================================================

const StatusBadge = ({ status }) => {
  const value = String(status || "").toLowerCase();
  let classes = "bg-slate-50 text-slate-600 border-slate-200";
  let Icon = FileText;
  if (["paid", "success", "successful"].includes(value)) {
    classes = "bg-emerald-50 text-emerald-700 border-emerald-200";
    Icon = CheckCircle;
  } else if (value === "generated") {
    classes = "bg-blue-50 text-blue-700 border-blue-200";
    Icon = FileCheck2;
  } else if (["pending", "processing", "due"].includes(value)) {
    classes = "bg-amber-50 text-amber-700 border-amber-200";
    Icon = AlertCircle;
  } else if (["failed", "cancelled", "rejected", "overdue"].includes(value)) {
    classes = "bg-red-50 text-red-700 border-red-200";
    Icon = AlertCircle;
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${classes}`}
    >
      <Icon size={12} />
      {formatLabel(status)}
    </span>
  );
};

const EmptyState = ({ type, clearSearch }) => {
  const isInvoice = type === "invoice";
  const Icon = isInvoice ? FileText : Receipt;
  return (
    <div className="flex flex-col items-center justify-center py-14">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
        <Icon size={26} className="text-slate-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-800">
        No {isInvoice ? "invoices" : "credit notes"} found
      </h3>
      <p className="mt-1 text-sm text-slate-500 text-center">
        {isInvoice
          ? "Invoices generated for your account will appear here."
          : "Credit notes issued for your account will appear here."}
      </p>
      {clearSearch && (
        <button
          type="button"
          onClick={clearSearch}
          className="mt-4 px-4 py-2 rounded-sm text-sm font-semibold text-[#0345da] hover:bg-blue-50"
        >
          Clear search
        </button>
      )}
    </div>
  );
};

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-14">
    <Loader2 size={34} className="animate-spin text-[#0345da]" />
    <p className="mt-3 text-sm text-slate-500">Loading billing data...</p>
  </div>
);

const DetailField = ({ label, value }) => (
  <div className="rounded-sm bg-slate-50 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="mt-1 text-sm font-semibold text-slate-800 break-words">
      {value}
    </p>
  </div>
);

const DynamicTable = ({ rows }) => {
  if (!rows?.length)
    return (
      <div className="p-6 text-center text-sm text-slate-500">
        No data available.
      </div>
    );
  const columns = Object.keys(rows[0]);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] text-sm">
        <thead>
          <tr className="bg-white border-b border-slate-200">
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500"
              >
                {formatLabel(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={row.id ?? idx}
              className="border-b border-slate-100 last:border-0"
            >
              {columns.map((col) => (
                <td
                  key={col}
                  className="px-4 py-3 text-slate-700 whitespace-nowrap"
                >
                  {formatValue(col, row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ExpandableSection = ({
  title,
  count,
  icon: Icon,
  open,
  onClick,
  children,
}) => (
  <div className="border border-slate-200 rounded-sm overflow-hidden">
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50"
    >
      <div className="flex items-center gap-3">
        <Icon size={17} className="text-[#0345da]" />
        <span className="text-sm font-semibold text-slate-800">{title}</span>
        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0345da] text-xs font-semibold">
          {count}
        </span>
      </div>
      {open ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
    </button>
    {open && (
      <div className="border-t border-slate-200 bg-slate-50">{children}</div>
    )}
  </div>
);

// Summary Card
const SummaryCard = ({ title, value, tone = "blue" }) => {
  const red = tone === "red";
  return (
    <article
      className={`flex min-h-[84px] items-center gap-4 rounded-sm border bg-white px-5 py-4 ${
        red ? "border-red-400" : "border-slate-400"
      }`}
    >
      <div
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${
          red ? "bg-red-50 text-red-500" : "bg-blue-50 text-[#0464E8]"
        }`}
      >
        <ReceiptText size={20} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[21px] font-bold leading-tight text-slate-900">
          {formatCurrency(value)}
        </p>
        <p className="mt-1 text-xs text-slate-500">{title}</p>
      </div>
    </article>
  );
};

// Filter dropdowns (reused)
const SelectField = ({ label, value, onChange, options, placeholder }) => (
  <label className="relative">
    <span className="sr-only">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 min-w-[105px] cursor-pointer appearance-none rounded-full border border-slate-200 bg-white py-0 pl-4 pr-9 text-xs font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100 cursor-pointer"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDown
      size={13}
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
    />
  </label>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

const Billing = () => {
  const [activeTab, setActiveTab] = useState("invoice"); // "invoice" | "credit_note"

  // Data states
  const [invoices, setInvoices] = useState([]);
  const [creditNotes, setCreditNotes] = useState([]);
  const [invoicePagination, setInvoicePagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [creditNotePagination, setCreditNotePagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Filter states
  const [search, setSearch] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(""); // "paid" | "due" | ""
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [balanceFilter, setBalanceFilter] = useState(""); // "has_balance" | "no_balance" | ""

  // UI states
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Detail modal states
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  // Download/export loading
  const [downloadingId, setDownloadingId] = useState(null);
  const [exportingId, setExportingId] = useState(null);

  // Determine current data
  const rows = activeTab === "invoice" ? invoices : creditNotes;
  const pagination =
    activeTab === "invoice" ? invoicePagination : creditNotePagination;
  const isInvoiceTab = activeTab === "invoice";

  // Filtering logic
  const filteredRows = useMemo(() => {
    let data = rows;
    // Search by invoice/credit note number
    const query = search.trim().toLowerCase();
    if (query) {
      data = data.filter((item) =>
        String(item.invoice_number || "")
          .toLowerCase()
          .includes(query),
      );
    }
    // Payment status filter
    if (paymentStatusFilter) {
      data = data.filter(
        (item) =>
          String(item.payment_status || "").toLowerCase() ===
          paymentStatusFilter,
      );
    }
    // Date range (generation_date)
    if (dateFrom) {
      data = data.filter(
        (item) =>
          item.generation_date && item.generation_date.slice(0, 10) >= dateFrom,
      );
    }
    if (dateTo) {
      data = data.filter(
        (item) =>
          item.generation_date && item.generation_date.slice(0, 10) <= dateTo,
      );
    }
    // Balance filter (based on total_amount and payment_status)
    if (balanceFilter) {
      data = data.filter((item) => {
        const outstanding =
          Number(item.total_amount || 0) -
          (item.payment_status === "paid" ? Number(item.total_amount || 0) : 0);
        return balanceFilter === "has_balance"
          ? outstanding > 0
          : outstanding === 0;
      });
    }
    return data;
  }, [rows, search, paymentStatusFilter, dateFrom, dateTo, balanceFilter]);

  // Stats (total, paid, unpaid)
  const stats = useMemo(() => {
    const total = rows.reduce(
      (sum, item) => sum + Number(item.total_amount || 0),
      0,
    );
    const paid = rows
      .filter(
        (item) => String(item.payment_status || "").toLowerCase() === "paid",
      )
      .reduce((sum, item) => sum + Number(item.total_amount || 0), 0);
    return { total, paid, unpaid: total - paid };
  }, [rows]);

  // Fetch functions
  const fetchInvoices = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError("");
      try {
        const response = await getInvoices({
          page,
          limit: invoicePagination.limit,
        });
        if (!response?.success)
          throw new Error(response?.message || "Unable to fetch invoices.");
        setInvoices(response?.data?.rows || []);
        setInvoicePagination(
          response?.data?.pagination || {
            page,
            limit: invoicePagination.limit,
            total: 0,
            totalPages: 1,
          },
        );
      } catch (err) {
        console.error("[Billing] Invoice error:", err);
        setInvoices([]);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to fetch invoices.",
        );
      } finally {
        setLoading(false);
      }
    },
    [invoicePagination.limit],
  );

  const fetchCreditNotes = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError("");
      try {
        const response = await getCreditNotes({
          page,
          limit: creditNotePagination.limit,
        });
        if (!response?.success)
          throw new Error(response?.message || "Unable to fetch credit notes.");
        setCreditNotes(response?.data?.rows || []);
        setCreditNotePagination(
          response?.data?.pagination || {
            page,
            limit: creditNotePagination.limit,
            total: 0,
            totalPages: 1,
          },
        );
      } catch (err) {
        console.error("[Billing] Credit note error:", err);
        setCreditNotes([]);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to fetch credit notes.",
        );
      } finally {
        setLoading(false);
      }
    },
    [creditNotePagination.limit],
  );

  // Initial load
  useEffect(() => {
    fetchInvoices(1);
    fetchCreditNotes(1);
  }, []);

  // Refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const toastId = toast.loading("Refreshing billing data...");
      await Promise.all([
        fetchInvoices(invoicePagination.page),
        fetchCreditNotes(creditNotePagination.page),
      ]);
      toast.dismiss(toastId);
      toast.success("Billing data refreshed.");
    } catch {
      toast.error("Unable to refresh billing data.");
    } finally {
      setRefreshing(false);
    }
  };

  const getCreditNoteDetail = async (id) => {
    const { data } = await axiosInstance.get(`${API_BASE}/credit-notes/${id}`);
    return data;
  };

  const handleView = async (item) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailError("");
    setSelectedDocument(null);
    setExpandedSection(null);

    try {
      const response =
        item.invoice_type === "credit_note"
          ? await getCreditNoteDetail(item.id)
          : await getInvoiceDetail(item.id);

      if (!response?.success) {
        throw new Error(
          response?.message ||
            `Unable to fetch ${
              item.invoice_type === "credit_note" ? "credit note" : "invoice"
            } details.`,
        );
      }

      setSelectedDocument(response?.data || null);
    } catch (err) {
      console.error("[Billing] Detail error:", err);

      setDetailError(
        err?.response?.data?.message ||
          err?.message ||
          `Unable to fetch ${
            item.invoice_type === "credit_note" ? "credit note" : "invoice"
          } details.`,
      );
    } finally {
      setDetailLoading(false);
    }
  };
  // Download PDF (works for both invoices and credit notes)
  const handleDownloadPdf = async (item) => {
    setDownloadingId(item.id);
    try {
      const response =
        item.invoice_type === "credit_note"
          ? await getCreditNotePdf(item.id)
          : await getInvoicePdf(item.id);
      const blob = response?.data;
      if (!(blob instanceof Blob))
        throw new Error("Invalid PDF response from server.");
      const contentType = response.headers?.["content-type"] || "";
      if (contentType.includes("application/json")) {
        throw new Error(
          await getBlobErrorMessage(
            { response: { data: blob } },
            "Unable to download PDF.",
          ),
        );
      }
      const filename = item.invoice_number
        ? `${item.invoice_number}.pdf`
        : `document-${item.id}.pdf`;
      downloadBlob(blob, filename);
      toast.success("PDF downloaded successfully.");
    } catch (err) {
      console.error("[Billing] PDF error:", err);
      toast.error(await getBlobErrorMessage(err, "Unable to download PDF."));
    } finally {
      setDownloadingId(null);
    }
  };

  // Export shipments (only for invoices)
  const handleExportShipments = async (item) => {
    setExportingId(item.id);
    try {
      const response = await getShipmentExport(item.id);
      const blob = response?.data;
      if (!(blob instanceof Blob))
        throw new Error("Invalid CSV response from server.");
      const contentType = response.headers?.["content-type"] || "";
      if (contentType.includes("application/json")) {
        throw new Error(
          await getBlobErrorMessage(
            { response: { data: blob } },
            "Unable to export shipments.",
          ),
        );
      }
      const filename = item.invoice_number
        ? `${item.invoice_number}_shipments.csv`
        : `invoice-${item.id}_shipments.csv`;
      downloadBlob(blob, filename);
      toast.success("Shipments exported successfully.");
    } catch (err) {
      console.error("[Billing] CSV error:", err);
      toast.error(
        await getBlobErrorMessage(err, "Unable to export shipments."),
      );
    } finally {
      setExportingId(null);
    }
  };

  // Pagination
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    if (activeTab === "invoice") fetchInvoices(page);
    else fetchCreditNotes(page);
  };

  // Tab change resets filters and search
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearch("");
    setPaymentStatusFilter("");
    setDateFrom("");
    setDateTo("");
    setBalanceFilter("");
    setError("");
  };

  // Close modal
  const closeDetail = () => {
    setDetailOpen(false);
    setSelectedDocument(null);
    setDetailError("");
    setExpandedSection(null);
  };

  const invoiceData = selectedDocument?.invoice;
  const charges = selectedDocument?.charges || [];
  const transactions = selectedDocument?.transactions || [];
  const shipments = selectedDocument?.shipments || [];

  // Determine filter options based on actual data (payment statuses present)
  const paymentStatusOptions = useMemo(() => {
    const statuses = new Set(
      rows
        .map((item) => String(item.payment_status || "").toLowerCase())
        .filter(Boolean),
    );
    return Array.from(statuses).map((s) => ({
      value: s,
      label: s.charAt(0).toUpperCase() + s.slice(1),
    }));
  }, [rows]);


    const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingPage(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    {
      loadingPage?(
        <div className=" w-full h-[90vh] flex justify-center items-center">
          <div>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2"> Loading...</p>
          </div>
        </div>
      ):(

    <div className="min-h-screen">
      <div className="mx-auto">
        <div className=" p-2 mb-3">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            {/* ✅ LEFT - Heading & Subtitle */}
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold dark:text-white truncate">
                {activeTab === "invoice" ? "Invoices" : "Credit Notes"}
              </h1>
              <p className="mt-1 text-xs sm:text-sm dark:text-white/60 leading-snug">
                {activeTab === "invoice"
                  ? "View and manage all your invoices, transactions, and shipment details."
                  : "View and manage all your credit notes and adjustments."}
              </p>
            </div>

            {/* ✅ RIGHT - Refresh Button (End) */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing || loading}
                className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-sm  dark:bg-white/10 backdrop-blur-sm border border-gray-200 text-[#0446DB] dark:text-white text-xs sm:text-sm font-semibold hover:bg-white/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                <span className="whitespace-nowrap">
                  {refreshing ? "Refreshing..." : "Refresh"}
                </span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-5 pt-5 border-t border-white/10">
            {[
              {
                key: "invoice",
                label: "Invoices",
                count: invoicePagination.total,
                Icon: FileText,
              },
              {
                key: "credit_note",
                label: "Credit Notes",
                count: creditNotePagination.total,
                Icon: Receipt,
              },
            ].map(({ key, label, count, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => handleTabChange(key)}
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-sm text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === key
                    ? "bg-[#0446DB] text-white shadow-sm shadow-black/20"
                    : " bg-white text-[#0446DB] hover:bg-white/20 border "
                }`}
              >
                <Icon size={15} className="sm:w-[17px] sm:h-[17px]" />
                {label}
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs ${
                    activeTab === key
                      ? "bg-[#0446DB]/10 text-[#0446DB]"
                      : "bg-white/10 text-white/60"
                  }`}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-5 bg-white border border-slate-200 rounded-sm p-4">
          {/* Search */}
          <div className="relative w-[280px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by number"
              className="w-full h-10 pl-10 pr-10 rounded-sm border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#0345da] focus:ring-2 focus:ring-[#0345da]/10 transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Payment Status Filter */}
          <SelectField
            label="Payment Status"
            value={paymentStatusFilter}
            onChange={setPaymentStatusFilter}
            options={[
              { value: "paid", label: "Paid" },
              { value: "due", label: "Due" },
              { value: "creditNote", label: "Credit Note" },
            ]}
            placeholder="Payment Status"
          />

          {/* Date From */}
          <label className="relative">
            <span className="sr-only">Date from</span>
            <CalendarDays
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="date"
              value={dateFrom}
              max={dateTo || ""}
              onChange={(e) => {
                const value = e.target.value;
                setDateFrom(value);
                if (dateTo && value > dateTo) setDateTo("");
              }}
              className="h-9 w-[150px] cursor-pointer rounded-full border border-slate-200 bg-white py-0 pl-9 pr-3 text-xs text-slate-700 outline-none transition hover:border-slate-300 focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="relative">
            <span className="sr-only">Date to</span>
            <CalendarDays
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="date"
              value={dateTo}
              min={dateFrom || ""}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-9 w-[150px] cursor-pointer rounded-full border border-slate-200 bg-white py-0 pl-9 pr-3 text-xs text-slate-700 outline-none transition hover:border-slate-300 focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100"
            />
          </label>

          {/* Clear all filters */}
          {(search ||
            paymentStatusFilter ||
            dateFrom ||
            dateTo ||
            balanceFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPaymentStatusFilter("");
                setDateFrom("");
                setDateTo("");
                setBalanceFilter("");
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-red-200 px-4 text-xs font-semibold text-red-500 transition hover:bg-red-500 hover:text-white cursor-pointer"
            >
              <X size={14} />
              Clear Filters
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">
          {loading ? (
            <LoadingState />
          ) : filteredRows.length === 0 ? (
            <EmptyState
              type={activeTab}
              clearSearch={search ? () => setSearch("") : undefined}
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Document
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Billing Period
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Generated
                      </th>
                      <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                        Taxable
                      </th>
                      <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                        Total
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                        Status
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                        Payment
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        {/* Document info */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {item.invoice_type === "credit_note" ? (
                              <Receipt size={18} className="text-[#0345da]" />
                            ) : (
                              <FileText size={18} className="text-[#0345da]" />
                            )}
                            <div>
                              <p className="font-semibold text-sm text-slate-800">
                                {item.invoice_number}
                              </p>
                              <p className="text-xs text-slate-400">
                                {formatLabel(item.invoice_type)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {/* View – only for invoices */}
                            {/* {isInvoiceTab && ( */}
                            <button
                              type="button"
                              title={
                                item.invoice_type === "credit_note"
                                  ? "View credit note details"
                                  : "View invoice details"
                              }
                              onClick={() => handleView(item)}
                              className="w-9 h-9 rounded-sm border border-slate-200 flex items-center justify-center hover:border-[#0345da] hover:text-[#0345da] cursor-pointer"
                            >
                              <Eye size={16} />
                            </button>
                            {/* )} */}
                            {/* Download PDF */}
                            <button
                              type="button"
                              title="Download PDF"
                              disabled={downloadingId === item.id}
                              onClick={() => handleDownloadPdf(item)}
                              className="w-9 h-9 rounded-sm border border-slate-200 flex items-center justify-center hover:border-[#0345da] hover:text-[#0345da] disabled:opacity-50 cursor-pointer"
                            >
                              {downloadingId === item.id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Download size={16} />
                              )}
                            </button>
                            <button
                              type="button"
                              title="Export shipments"
                              disabled={exportingId === item.id}
                              onClick={() => handleExportShipments(item)}
                              className="w-9 h-9 rounded-sm border border-slate-200 flex items-center justify-center hover:border-[#0345da] hover:text-[#0345da] disabled:opacity-50 cursor-pointer"
                            >
                              {exportingId === item.id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <FileSpreadsheet size={16} />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Billing Period */}
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {formatDate(item.period_start)}{" "}
                          <span className="mx-1">→</span>{" "}
                          {formatDate(item.period_end)}
                        </td>

                        {/* Generated Date */}
                        <td className="px-4 py-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={15} className="text-slate-400" />
                            {formatDate(item.generation_date)}
                          </div>
                        </td>

                        {/* Taxable Amount */}
                        <td className="px-4 py-4 text-sm text-right">
                          {formatCurrency(item.taxable_amount)}
                        </td>

                        {/* Total Amount */}
                        <td className="px-4 py-4 text-sm font-bold text-right">
                          {formatCurrency(item.total_amount)}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4 text-center">
                          <StatusBadge status={item.status} />
                        </td>

                        {/* Payment Status */}
                        <td className="px-4 py-4 text-center">
                          <StatusBadge status={item.payment_status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-5 py-4 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <b>
                    {Math.min(
                      (pagination.page - 1) * pagination.limit + 1,
                      pagination.total,
                    )}
                  </b>{" "}
                  to{" "}
                  <b>
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}
                  </b>{" "}
                  of <b>{pagination.total}</b>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={pagination.page <= 1 || loading}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    className="px-3 py-2 rounded-sm border border-slate-200 disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-3 text-sm font-semibold">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={
                      pagination.page >= pagination.totalPages || loading
                    }
                    onClick={() => handlePageChange(pagination.page + 1)}
                    className="px-3 py-2 rounded-sm border border-slate-200 disabled:opacity-40"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Detail Modal  */}
      {detailOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={closeDetail}
        >
          <div
            className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-sm bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {selectedDocument?.invoice?.invoice_number ||
                    selectedDocument?.credit_note?.invoice_number ||
                    selectedDocument?.credit_note?.credit_note_number ||
                    "Document Details"}
                </h2>
                <p className="text-xs text-slate-500">
                  {formatLabel(
                    selectedDocument?.invoice?.invoice_type ||
                      selectedDocument?.credit_note?.invoice_type ||
                      "document",
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {invoiceData && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleDownloadPdf(invoiceData)}
                      disabled={downloadingId === invoiceData.id}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-sm bg-[#0345da] text-white text-sm font-semibold disabled:opacity-50 cursor-pointer"
                    >
                      {downloadingId === invoiceData.id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Download size={15} />
                      )}
                      PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExportShipments(invoiceData)}
                      disabled={exportingId === invoiceData.id}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-sm border border-slate-200 text-sm font-semibold disabled:opacity-50 cursor-pointer"
                    >
                      {exportingId === invoiceData.id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <FileSpreadsheet size={15} />
                      )}
                      Export
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={closeDetail}
                  className="w-9 h-9 rounded-sm flex items-center justify-center hover:bg-red-500 hover:text-white cursor-pointer"
                >
                  <X size={19} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-6">
              {detailLoading ? (
                <LoadingState />
              ) : detailError ? (
                <div className="rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {detailError}
                </div>
              ) : invoiceData ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      "invoice_type",
                      "billing_cycle_days",
                      "gst_type",
                      "generated_by",
                      "merchant_state",
                      "merchant_gst_number",
                      "status",
                      "payment_status",
                    ].map((key) => (
                      <DetailField
                        key={key}
                        label={formatLabel(key)}
                        value={
                          key === "status" || key === "payment_status" ? (
                            <StatusBadge status={invoiceData[key]} />
                          ) : (
                            formatValue(key, invoiceData[key])
                          )
                        }
                      />
                    ))}
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-bold text-slate-800">
                      Amount Summary
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {[
                        "taxable_amount",
                        "cgst_amount",
                        "sgst_amount",
                        "igst_amount",
                        "total_amount",
                      ].map((key) => (
                        <DetailField
                          key={key}
                          label={formatLabel(key)}
                          value={formatCurrency(invoiceData[key])}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DetailField
                      label="Billing Period Start"
                      value={formatDate(invoiceData.period_start)}
                    />
                    <DetailField
                      label="Billing Period End"
                      value={formatDate(invoiceData.period_end)}
                    />
                    <DetailField
                      label="Generation Date"
                      value={formatDateTime(invoiceData.generation_date)}
                    />
                  </div>

                  <div className="space-y-3">
                    <ExpandableSection
                      title="Charges"
                      count={charges.length}
                      icon={IndianRupee}
                      open={expandedSection === "charges"}
                      onClick={() =>
                        setExpandedSection(
                          expandedSection === "charges" ? null : "charges",
                        )
                      }
                    >
                      <DynamicTable rows={charges} />
                    </ExpandableSection>

                   
                  </div>
                </div>
              ) : (
                <EmptyState type="invoice" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
      )
    }
    
    </>
  );
};

export default Billing;
