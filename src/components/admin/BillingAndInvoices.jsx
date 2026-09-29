import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  getBillingDashboard,
  getMerchants,
  getMerchantDetails,
  getBillingCycle,
  getBillingCycleHistory,
  getInvoices,
  getInvoiceDetails,
  exportInvoiceShipments,
  updatePaymentStatus,
  getGenerationLogs,
  downloadInvoicePdf,
  getFailedGenerations,
  retryFailedGenerations,
  getCreditNotes,
  generateMerchantInvoice,
  getInvoiceGenerationJob,
  updateBillingCycle as updateBillingCycleApi,
  generateInvoices,
  regenerateInvoice,
  generateCustomInvoice,
} from "../../Redux/billingApi";
import toast from "react-hot-toast";

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

const formatMoney = (value) => {
  const num = Number(value) || 0;
  const sign = num < 0 ? "−" : "";
  return `${sign}₹${Math.abs(num).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (date) => {
  if (!date) return "N/A";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(date));
  } catch {
    return "N/A";
  }
};

const formatTime = (date) => {
  if (!date) return "N/A";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(new Date(date));
  } catch {
    return "N/A";
  }
};

// ============================================================
// STATUS MARKUP
// ============================================================

const statusMarkup = (status) => {
  const cls = String(status || "").toLowerCase();

  const statusConfig = {
    ready: {
      dotColor: "bg-green-500",
      textColor: "text-green-700",
      label: "Ready",
    },
    success: {
      dotColor: "bg-green-500",
      textColor: "text-green-700",
      label: "Success",
    },
    paid: {
      dotColor: "bg-green-500",
      textColor: "text-green-700",
      label: "Paid",
    },
    generated: {
      dotColor: "bg-green-500",
      textColor: "text-green-700",
      label: "Generated",
    },
    completed: {
      dotColor: "bg-green-500",
      textColor: "text-green-700",
      label: "Completed",
    },
    active: {
      dotColor: "bg-green-500",
      textColor: "text-green-700",
      label: "Active",
    },
    approved: {
      dotColor: "bg-green-500",
      textColor: "text-green-700",
      label: "Approved",
    },
    delivered: {
      dotColor: "bg-green-500",
      textColor: "text-green-700",
      label: "Delivered",
    },
    warning: {
      dotColor: "bg-amber-500",
      textColor: "text-amber-700",
      label: "Warning",
    },
    due: {
      dotColor: "bg-amber-500",
      textColor: "text-amber-700",
      label: "Due",
    },
    pending: {
      dotColor: "bg-amber-500",
      textColor: "text-amber-700",
      label: "Pending",
    },
    in_progress: {
      dotColor: "bg-amber-500",
      textColor: "text-amber-700",
      label: "In Progress",
    },
    partial: {
      dotColor: "bg-amber-500",
      textColor: "text-amber-700",
      label: "Partial",
    },
    processing: {
      dotColor: "bg-amber-500",
      textColor: "text-amber-700",
      label: "Processing",
    },
    review: {
      dotColor: "bg-amber-500",
      textColor: "text-amber-700",
      label: "Under Review",
    },
    superseded: {
      dotColor: "bg-amber-500",
      textColor: "text-amber-700",
      label: "Superseded",
    },
    booked: {
      dotColor: "bg-amber-500",
      textColor: "text-amber-700",
      label: "Booked",
    },
    "rto in transit": {
      dotColor: "bg-amber-500",
      textColor: "text-amber-700",
      label: "RTO In Transit",
    },
    rto: {
      dotColor: "bg-amber-500",
      textColor: "text-amber-700",
      label: "RTO",
    },
    failed: {
      dotColor: "bg-red-500",
      textColor: "text-red-700",
      label: "Failed",
    },
    excluded: {
      dotColor: "bg-red-500",
      textColor: "text-red-700",
      label: "Excluded",
    },
    overdue: {
      dotColor: "bg-red-500",
      textColor: "text-red-700",
      label: "Overdue",
    },
    error: {
      dotColor: "bg-red-500",
      textColor: "text-red-700",
      label: "Error",
    },
    cancelled: {
      dotColor: "bg-red-500",
      textColor: "text-red-700",
      label: "Cancelled",
    },
    rejected: {
      dotColor: "bg-red-500",
      textColor: "text-red-700",
      label: "Rejected",
    },
    unknown: {
      dotColor: "bg-gray-400",
      textColor: "text-gray-600",
      label: "Unknown",
    },
  };

  const config = statusConfig[cls] || statusConfig.unknown;
  const displayLabel = status || config.label || "Pending";

  return (
    <span className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
      <span className={`text-sm font-bold ${config.textColor}`}>
        {displayLabel}
      </span>
    </span>
  );
};

// ============================================================
// HELPERS
// ============================================================

const getApiMessage = (response) =>
  response?.message ||
  response?.data?.message ||
  response?.data?.data?.message ||
  "Request failed";

const BillingAndInvoices = () => {
  const [setupInvoiceRows, setSetupInvoiceRows] = useState([]);
  const [setupActiveTab, setSetupActiveTab] = useState("summary");
  const [setupComponents, setSetupComponents] = useState([]);
  const [setupComponentsLoading, setSetupComponentsLoading] = useState(false);
  const [setupCreditNotes, setSetupCreditNotes] = useState([]);
  const [setupCreditNotesLoading, setSetupCreditNotesLoading] = useState(false);
  const [setupCreditNotesPagination, setSetupCreditNotesPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [setupFailedGenerations, setSetupFailedGenerations] = useState([]);
  const [setupFailedLoading, setSetupFailedLoading] = useState(false);
  const [setupFailedTotal, setSetupFailedTotal] = useState(0);
  const [setupFailedPage, setSetupFailedPage] = useState(1);
  const [setupFailedTotalPages, setSetupFailedTotalPages] = useState(0);
  const [setupActivityItems, setSetupActivityItems] = useState([]);
  const [setupActivityLoading, setSetupActivityLoading] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState(null);

  const [showAllShipments, setShowAllShipments] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [merchantSearchTerm, setMerchantSearchTerm] = useState("");

  const [view, setView] = useState("setup");
  const [scope, setScope] = useState("all");
  const [activeTab, setActiveTab] = useState("summary");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const [dashboardData, setDashboardData] = useState(null);
  const [sellerCatalog, setSellerCatalog] = useState([]);
  const [invoiceRows, setInvoiceRows] = useState([]);
  const [componentRows, setComponentRows] = useState([]);
  const [drawerComponents, setDrawerComponents] = useState([]);
  const [activityItems, setActivityItems] = useState([]);
  const [issuesData, setIssuesData] = useState([]);

  const [selectedSellers, setSelectedSellers] = useState(new Set());
  const [currentDrawerRow, setCurrentDrawerRow] = useState(null);
  const [batchId, setBatchId] = useState(null);
  const [merchantDetail, setMerchantDetail] = useState(null);
  const [merchantBillingCycle, setMerchantBillingCycle] = useState(null);
  const [billingCycleHistory, setBillingCycleHistory] = useState([]);
  const [invoiceDetail, setInvoiceDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [exportingInvoice, setExportingInvoice] = useState(false);
  const [componentsLoading, setComponentsLoading] = useState(false);
  const [componentsFetched, setComponentsFetched] = useState(false);
  const [failedFetched, setFailedFetched] = useState(false);

  const [generationDate, setGenerationDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [confirmSubmission, setConfirmSubmission] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);

  const [failedGenerations, setFailedGenerations] = useState([]);
  const [failedGenerationsLoading, setFailedGenerationsLoading] =
    useState(false);
  const [retryingFailed, setRetryingFailed] = useState(false);
  const [selectedFailedIds, setSelectedFailedIds] = useState(new Set());
  const [invoiceDetailsMap, setInvoiceDetailsMap] = useState({});
  const [updatingPaymentStatus, setUpdatingPaymentStatus] = useState(new Set());

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [creditNotes, setCreditNotes] = useState([]);
  const [creditNotesLoading, setCreditNotesLoading] = useState(false);
  const [generatedDate, setGeneratedDate] = useState(null);
  const [creditNotesPagination, setCreditNotesPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [expandedAwbs, setExpandedAwbs] = useState(new Set());
  const [filters, setFilters] = useState({
    invoiceSearch: "",
    cycleFilter: "all",
    validationFilter: "all",
    submissionFilter: "all",
    componentSearch: "",
    eventFilter: "all",
    paymentFilter: "all",
    dateFrom: "",
    dateTo: "",
  });

  const [batchStatus, setBatchStatus] = useState({
    text: "READY",
    className: "bg-green-100 text-green-700",
  });

  const [processSteps, setProcessSteps] = useState([
    {
      step: 1,
      title: "Checking billing cycles",
      desc: "Finding closed 15-day and 30-day periods",
      status: "pending",
    },
    {
      step: 2,
      title: "Reserving unbilled components",
      desc: "Preventing duplicate selection",
      status: "pending",
    },
    {
      step: 3,
      title: "Calculating debit and credit",
      desc: "Applying RTO freight and COD rules",
      status: "pending",
    },
    {
      step: 4,
      title: "Preparing preview",
      desc: "Creating invoice groups",
      status: "pending",
    },
  ]);

  // ============================================================
  // STEP 1 DASHBOARD DATA LOADERS (run on mount)
  // ============================================================

  const loadSetupInvoices = useCallback(async (params = {}) => {
    try {
      const response = await getInvoices(params);
      if (response?.success) {
        const rows = Array.isArray(response.data?.rows)
          ? response.data.rows
          : [];

        const mappedRows = rows.map((inv) => {
          let paymentStatus = inv.payment_status;
          if (paymentStatus === undefined || paymentStatus === null) {
            paymentStatus = "due";
          }
          const status = String(inv?.status || "").toLowerCase();

          return {
            key:
              inv?.invoice_number ||
              inv?.invoice_id ||
              inv?.id ||
              `INV-${inv?.merchant_id || "NA"}`,
            sellerId: inv?.merchant_id,
            seller:
              inv?.merchant_name || inv?.merchant?.name || inv?.name || "N/A",
            billing_type:
              inv?.billing_type || inv?.merchant?.billing_type || "postpaid",
            cycle:
              Number(inv?.billing_cycle_days ?? inv?.billing_cycle) === 30
                ? "30-day"
                : "15-day",
            period:
              inv?.period_start && inv?.period_end
                ? `${formatDate(inv.period_start)} – ${formatDate(inv.period_end)}`
                : "N/A",
            awbs: Number(
              inv?.total_shipments ??
                inv?.awb_count ??
                inv?.shipments_count ??
                0,
            ),
            components: Number(
              inv?.total_transactions ??
                inv?.component_count ??
                inv?.components_count ??
                0,
            ),
            debit: Number(inv?.debit_amount ?? inv?.total_debit ?? 0),
            credit: Number(inv?.credit_amount ?? inv?.total_credit ?? 0),
            net: Number(inv?.total_amount ?? inv?.net_amount ?? 0),
            validation:
              status === "ready"
                ? "Ready"
                : inv?.validation_status || inv?.status || "Pending",
            validationMessage: inv?.validation_message || "All checks passed.",
            submission: inv?.submission_status || "Pending",
            selected: false,
            invoiceId: inv?.id || inv?.invoice_id,
            invoiceDate: inv?.generation_date || inv?.invoice_date,
            status: inv?.status,
            period_start: inv?.period_start,
            period_end: inv?.period_end,
            taxable_amount: inv?.taxable_amount,
            cgst_amount: inv?.cgst_amount,
            sgst_amount: inv?.sgst_amount,
            igst_amount: inv?.igst_amount,
            total_amount: inv?.total_amount,
            gst_type: inv?.gst_type,
            generation_date: inv?.generation_date,
            created_at: inv?.created_at,
            payment_status: paymentStatus,
            invoiceType: inv?.invoice_type || "invoice",
            raw: inv,
          };
        });

        setSetupInvoiceRows(mappedRows);
        return mappedRows;
      }
      return [];
    } catch (error) {
      console.error("[Setup Invoices] Load error:", error);
      return [];
    }
  }, []);

  const loadSetupComponents = useCallback(async () => {
    setSetupComponentsLoading(true);
    try {
      const invRes = await getInvoices({ page: 1, limit: 50 });
      if (!invRes?.success) {
        setSetupComponents([]);
        return;
      }
      const invoices = Array.isArray(invRes.data?.rows) ? invRes.data.rows : [];
      const BATCH = 8;
      const allComponents = [];

      for (let i = 0; i < invoices.length; i += BATCH) {
        const slice = invoices.slice(i, i + BATCH);
        const results = await Promise.allSettled(
          slice.map((inv) =>
            getInvoiceDetails(inv.id || inv.invoice_id).then((r) => ({
              inv,
              detail: r,
            })),
          ),
        );

        results.forEach((res) => {
          if (res.status !== "fulfilled") return;
          const { inv, detail } = res.value;
          if (!detail?.success) return;
          const shipments = Array.isArray(detail.data?.shipments)
            ? detail.data.shipments
            : [];
          const invoiceData = detail.data?.invoice || {};

          shipments.forEach((s) => {
            allComponents.push({
              awb: s.awb_number || s.awb || "N/A",
              component: s.charge_type || s.shipment_status || "Shipment",
              seller:
                invoiceData.merchant_name ||
                inv.merchant_name ||
                `Merchant ${inv.merchant_id}`,
              sellerId: invoiceData.merchant_id || inv.merchant_id,
              event: s.shipment_status || "SHIPMENT",
              date:
                formatDate(
                  invoiceData.generation_date || invoiceData.created_at,
                ) || "N/A",
              direction: Number(s.total_amount || 0) > 0 ? "Debit" : "Credit",
              debit:
                Number(s.total_amount || 0) > 0
                  ? Math.abs(Number(s.total_amount))
                  : 0,
              credit:
                Number(s.total_amount || 0) < 0
                  ? Math.abs(Number(s.total_amount))
                  : 0,
              net: Number(s.total_amount || 0),
              rto: Number(s.rto_freight_charge || 0) > 0,
              reversal: Number(s.cod_charge || 0) < 0,
              status: "Reserved",
              freight_charge: s.freight_charge,
              cod_charge: s.cod_charge,
              rto_freight_charge: s.rto_freight_charge,
              insurance_charge: s.insurance_charge,
              taxable_amount: s.taxable_amount,
              cgst_amount: s.cgst_amount,
              sgst_amount: s.sgst_amount,
              igst_amount: s.igst_amount,
              total_amount: s.total_amount,
              order_id: s.order_id,
              merchant_order_id: s.merchant_order_id,
              courier: s.courier,
              payment_type: s.payment_type,
              charged_weight: s.charged_weight,
              shipment_status: s.shipment_status,
              invoiceType: invoiceData.invoice_type || "invoice",
              gst_type: invoiceData.gst_type || "N/A",
            });
          });
        });
      }

      setSetupComponents(allComponents);
    } catch (error) {
      console.error("[Setup] Components load error:", error);
      setSetupComponents([]);
    } finally {
      setSetupComponentsLoading(false);
    }
  }, []);

  /**
   * Step-1 Credit Notes loader (separate state).
   */
  const loadSetupCreditNotes = useCallback(async (params = {}) => {
    setSetupCreditNotesLoading(true);
    try {
      const response = await getCreditNotes({
        page: params.page || 1,
        limit: params.limit || 20,
      });

      if (response?.success) {
        const data = response.data || {};
        const rows = data?.rows || data?.data?.rows || [];
        const pag = data?.pagination || {};

        setSetupCreditNotes(rows);
        setSetupCreditNotesPagination({
          page: pag.page || params.page || 1,
          limit: pag.limit || params.limit || 20,
          total: pag.total || rows.length,
          totalPages:
            pag.totalPages ||
            Math.ceil((pag.total || rows.length) / (params.limit || 20)),
        });
      } else {
        setSetupCreditNotes([]);
      }
    } catch (error) {
      console.error("[Setup CreditNotes] Error:", error);
      setSetupCreditNotes([]);
    } finally {
      setSetupCreditNotesLoading(false);
    }
  }, []);

  /**
   * Step-1 Failed Generations loader (separate state).
   */
  const loadSetupFailedGenerations = useCallback(
    async (page = 1, limit = 20) => {
      setSetupFailedLoading(true);
      try {
        const response = await getFailedGenerations({ page, limit });
        if (response?.success) {
          const data = response.data;
          setSetupFailedGenerations(data?.rows || []);
          setSetupFailedTotal(data?.pagination?.total || 0);
          setSetupFailedTotalPages(data?.pagination?.totalPages || 0);
          setSetupFailedPage(data?.pagination?.page || 1);
        } else {
          setSetupFailedGenerations([]);
          setSetupFailedTotal(0);
          setSetupFailedTotalPages(0);
        }
      } catch (error) {
        console.error("[Setup] Failed generations load error:", error);
        setSetupFailedGenerations([]);
      } finally {
        setSetupFailedLoading(false);
      }
    },
    [],
  );

  /**
   * Step-1 Activity Log loader — pulls latest global generation logs
   * (no batch_id needed; shows most recent events across all batches).
   */
  const loadSetupActivity = useCallback(async () => {
    setSetupActivityLoading(true);
    try {
      const response = await getGenerationLogs({
        limit: 50,
        page: 1,
        order: "desc",
      });
      if (response?.success) {
        const logs = response.data?.rows || response.data?.data?.rows || [];
        setSetupActivityItems(
          logs.map((log) => ({
            time: formatTime(
              log.created_at || log.generation_date || new Date(),
            ),
            title: log.outcome || log.message || "Log Entry",
            body: log.message || log.error_detail || "No details available",
            actor: log.attempted_by || "System",
            merchant_id: log.merchant_id,
            period_start: log.period_start,
            period_end: log.period_end,
            status_code: log.status_code,
            outcome: log.outcome,
            raw: log,
          })),
        );
      } else {
        setSetupActivityItems([]);
      }
    } catch (error) {
      console.error("[Setup] Activity load error:", error);
      setSetupActivityItems([]);
    } finally {
      setSetupActivityLoading(false);
    }
  }, []);

  // ============================================================
  // CUSTOM INVOICE STATE
  // ============================================================
  const [customInvoiceModal, setCustomInvoiceModal] = useState({
    isOpen: false,
    merchantId: null,
    source: null, 
  });
  const [customPeriodStart, setCustomPeriodStart] = useState("");
  const [customPeriodEnd, setCustomPeriodEnd] = useState("");
  const [customGenerating, setCustomGenerating] = useState(false);
  const [lastInvoicedThrough, setLastInvoicedThrough] = useState(null);

  // ============================================================
  // HELPER FUNCTIONS
  // ============================================================

  const paginateData = useCallback(
    (data) => {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      return data.slice(indexOfFirstItem, indexOfLastItem);
    },
    [currentPage, itemsPerPage],
  );

  const getTotalPages = useCallback(
    (dataLength) => Math.ceil(dataLength / itemsPerPage),
    [itemsPerPage],
  );

  const toggleAWBExpansion = useCallback((awbNumber) => {
    setExpandedAwbs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(awbNumber)) newSet.delete(awbNumber);
      else newSet.add(awbNumber);
      return newSet;
    });
  }, []);

  // ============================================================
  // API DATA FETCHING
  // ============================================================

  const loadDashboard = useCallback(async () => {
    try {
      const response = await getBillingDashboard();
      if (response?.success) {
        setDashboardData(response.data);
        return response;
      }
      toast.error(getApiMessage(response));
      return null;
    } catch (error) {
      toast.error(getApiMessage(error));
      return null;
    }
  }, []);

  const loadMerchants = useCallback(async (params = {}) => {
    try {
      const response = await getMerchants(params);
      if (response?.success) {
        const merchants = Array.isArray(response.data?.rows)
          ? response.data.rows
          : [];
        setSellerCatalog(
          merchants.map((m) => ({
            id: m.merchant_id,
            name: m.name,
            cycle:
              Number(m.billing_cycle_days ?? m.billing_cycle) === 30
                ? "30-day"
                : "15-day",
            billing_type: m.billing_type,
            billing_cycle: m.billing_cycle_days ?? m.billing_cycle,
            is_active: Boolean(m.is_active),
            status: m.is_active ? "Active" : "Inactive",
            wallet_balance: Number(m.wallet_balance || 0),
            wallet_limit: m.wallet_limit,
            credit_utilization: m.credit_utilization,
            invoice_total: Number(m.total_invoice_amount || 0),
            credit_note_total: Number(m.total_credit_note_amount || 0),
            net_billed: Number(m.net_billed_amount || m.net_billed || 0),
            latest_invoice: m.latest_invoice,
            gst_number: m.gst_number,
            state: m.state,
            raw: m,
          })),
        );
        return response.data;
      }
      toast.error(getApiMessage(response));
      return null;
    } catch (error) {
      toast.error(getApiMessage(error));
      return null;
    }
  }, []);

  const loadInvoices = useCallback(async (params = {}) => {
    try {
      const response = await getInvoices(params);
      if (response?.success) {
        const rows = Array.isArray(response.data?.rows)
          ? response.data.rows
          : [];

        const mappedRows = rows.map((inv) => {
          let paymentStatus = inv.payment_status;
          if (paymentStatus === undefined || paymentStatus === null) {
            paymentStatus = inv.invoice_type === "credit_note" ? "due" : "due";
          }

          const status = String(inv?.status || "").toLowerCase();

          return {
            key:
              inv?.invoice_number ||
              inv?.invoice_id ||
              inv?.id ||
              `INV-${inv?.merchant_id || "NA"}`,
            sellerId: inv?.merchant_id,
            seller:
              inv?.merchant_name || inv?.merchant?.name || inv?.name || "N/A",
            billing_type:
              inv?.billing_type || inv?.merchant?.billing_type || "postpaid",
            cycle:
              Number(inv?.billing_cycle_days ?? inv?.billing_cycle) === 30
                ? "30-day"
                : "15-day",
            period:
              inv?.period_start && inv?.period_end
                ? `${formatDate(inv.period_start)} – ${formatDate(inv.period_end)}`
                : "N/A",
            awbs: Number(
              inv?.total_shipments ??
                inv?.awb_count ??
                inv?.shipments_count ??
                0,
            ),
            components: Number(
              inv?.total_transactions ??
                inv?.component_count ??
                inv?.components_count ??
                0,
            ),
            debit: Number(inv?.debit_amount ?? inv?.total_debit ?? 0),
            credit: Number(inv?.credit_amount ?? inv?.total_credit ?? 0),
            net: Number(inv?.total_amount ?? inv?.net_amount ?? 0),
            validation:
              status === "ready"
                ? "Ready"
                : inv?.validation_status || inv?.status || "Pending",
            validationMessage: inv?.validation_message || "All checks passed.",
            submission:
              inv?.submission_status ||
              (status === "generated" ? "Pending" : "Pending"),
            selected:
              inv?.submission_status !== "Success" && status !== "submitted",
            invoiceId: inv?.id || inv?.invoice_id,
            invoiceDate: inv?.generation_date || inv?.invoice_date,
            error: inv?.error_message,
            status: inv?.status,
            period_start: inv?.period_start,
            period_end: inv?.period_end,
            taxable_amount: inv?.taxable_amount,
            cgst_amount: inv?.cgst_amount,
            sgst_amount: inv?.sgst_amount,
            igst_amount: inv?.igst_amount,
            total_amount: inv?.total_amount,
            gst_type: inv?.gst_type,
            generation_date: inv?.generation_date,
            created_at: inv?.created_at,
            payment_status: paymentStatus,
            invoiceType: inv?.invoice_type || "invoice",
            raw: inv,
          };
        });

        setInvoiceRows(mappedRows);
        setCurrentPage(1);

        setIssuesData(
          mappedRows
            .filter((row) => row.validation !== "Ready")
            .map((row) => ({
              severity: row.validation === "Failed" ? "Failed" : "Warning",
              seller: row.seller,
              sellerId: row.sellerId,
              key: row.key,
              issue: row.validationMessage,
              lines: row.components,
              action:
                row.validation === "Failed"
                  ? "Update seller profile and regenerate invoice"
                  : "Review and acknowledge warning",
              invoiceId: row.invoiceId,
              period: row.period,
              cycle: row.cycle,
              net: row.net,
              awbs: row.awbs,
            })),
        );
        return mappedRows;
      }
      toast.error(getApiMessage(response));
      return null;
    } catch (error) {
      toast.error(getApiMessage(error));
      return null;
    }
  }, []);

  const loadCreditNotes = useCallback(async (params = {}) => {
    setCreditNotesLoading(true);
    try {
      const response = await getCreditNotes({
        page: params.page || 1,
        limit: params.limit || 20,
        ...params,
      });
      if (response?.success) {
        const data = response.data;
        setCreditNotes(data?.rows || []);
        setCreditNotesPagination({
          page: data?.pagination?.page || 1,
          limit: data?.pagination?.limit || 20,
          total: data?.pagination?.total || 0,
          totalPages: data?.pagination?.totalPages || 0,
        });
      }
    } catch (error) {
      toast.error(error?.message || "Failed to load credit notes");
    } finally {
      setCreditNotesLoading(false);
    }
  }, []);

  // ============================================================
  // POLLING HELPER — Invoice Generation Job
  // ============================================================

  const pollInvoiceGenerationJob = useCallback(
    async (jobId, { intervalMs = 2500, maxAttempts = 120 } = {}) => {
      let attempts = 0;

      while (attempts < maxAttempts) {
        attempts += 1;

        const response = await getInvoiceGenerationJob(jobId);
        const job = response?.data || {};

        if (job.status === "completed") {
          return { status: "completed", result: job.result || {} };
        }

        if (job.status === "failed") {
          return {
            status: "failed",
            error_detail: job.error_detail || "Invoice generation failed.",
            result: job.result || {},
          };
        }

        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      }
      throw new Error(
        "Invoice generation timed out. Please check the failed queue.",
      );
    },
    [],
  );

  const [failedPage, setFailedPage] = useState(1);
  const [failedLimit, setFailedLimit] = useState(10);
  const [failedTotal, setFailedTotal] = useState(0);
  const [failedTotalPages, setFailedTotalPages] = useState(0);

  const loadFailedGenerations = useCallback(async (page = 1, limit = 10) => {
    setFailedGenerationsLoading(true);
    try {
      const response = await getFailedGenerations({ page, limit });
      if (response?.success) {
        const data = response.data;
        setFailedGenerations(data?.rows || []);
        setFailedTotal(data?.pagination?.total || 0);
        setFailedTotalPages(data?.pagination?.totalPages || 0);
      }
    } catch (error) {
      toast.error(error?.message || "Failed to load failed generations");
    } finally {
      setFailedGenerationsLoading(false);
    }
  }, []);

  const loadGenerationLogs = useCallback(async () => {
    if (!batchId) return;
    setLogsLoading(true);
    try {
      const response = await getGenerationLogs({
        batch_id: batchId,
        limit: 100,
        page: 1,
        order: "desc",
      });

      if (response?.success) {
        const logs = response.data?.rows || response.data?.data?.rows || [];
        setActivityItems(
          logs.map((log) => ({
            time: formatTime(
              log.created_at || log.generation_date || new Date(),
            ),
            title: log.outcome || log.message || "Log Entry",
            body: log.message || log.error_detail || "No details available",
            actor: log.attempted_by || "System",
            merchant_id: log.merchant_id,
            period_start: log.period_start,
            period_end: log.period_end,
            status_code: log.status_code,
            outcome: log.outcome,
            raw: log,
          })),
        );
      }
    } catch (error) {
      toast.error("Failed to load audit logs");
      console.error("Generation logs error:", error);
    } finally {
      setLogsLoading(false);
    }
  }, [batchId]);

  const loadMerchantDetail = useCallback(async (merchantId) => {
    if (!merchantId) return;
    setDetailLoading(true);
    try {
      const [detailResponse, cycleResponse, historyResponse] =
        await Promise.allSettled([
          getMerchantDetails(merchantId),
          getBillingCycle(merchantId),
          getBillingCycleHistory(merchantId),
        ]);
      if (
        detailResponse.status === "fulfilled" &&
        detailResponse.value?.success
      ) {
        setMerchantDetail(detailResponse.value.data);
      }
      if (
        cycleResponse.status === "fulfilled" &&
        cycleResponse.value?.success
      ) {
        setMerchantBillingCycle(
          Number(
            cycleResponse.value.data?.billing_cycle_days ??
              cycleResponse.value.data?.billing_cycle,
          ) || 15,
        );
      }
      if (
        historyResponse.status === "fulfilled" &&
        historyResponse.value?.success
      ) {
        setBillingCycleHistory(
          Array.isArray(historyResponse.value.data?.history)
            ? historyResponse.value.data.history
            : [],
        );
      }
    } catch (error) {
      // Silent fail
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const loadInvoiceDetail = useCallback(async (invoiceId) => {
    if (!invoiceId) return;
    setDetailLoading(true);
    try {
      const response = await getInvoiceDetails(invoiceId);
      if (response?.success) {
        const data = response.data;
        setInvoiceDetail(data);
        const shipments = Array.isArray(data?.shipments) ? data.shipments : [];

        if (!shipments.length) {
          setDrawerComponents([]);
          return data;
        }

        setDrawerComponents(
          shipments.map((s) => ({
            awb: s.awb_number || s.awb || "N/A",
            order_id: s.order_id || null,
            merchant_order_id: s.merchant_order_id || null,
            courier: s.courier || "N/A",
            shipment_status: s.shipment_status || "N/A",
            payment_type: s.payment_type || "N/A",
            charged_weight: s.charged_weight || 0,
            freight_charge: Number(s.freight_charge) || 0,
            cod_charge: Number(s.cod_charge) || 0,
            rto_freight_charge: Number(s.rto_freight_charge) || 0,
            insurance_charge: Number(s.insurance_charge) || 0,
            unclassified_charge: Number(s.unclassified_charge) || 0,
            taxable_amount: Number(s.taxable_amount) || 0,
            cgst_amount: Number(s.cgst_amount) || 0,
            sgst_amount: Number(s.sgst_amount) || 0,
            igst_amount: Number(s.igst_amount) || 0,
            total_amount: Number(s.total_amount) || 0,
            component: s.shipment_status || s.charge_type || "Shipment",
            seller: data?.invoice?.merchant_name || "N/A",
            sellerId: data?.invoice?.merchant_id || "N/A",
            event: s.shipment_status || "SHIPMENT",
            date:
              formatDate(
                data?.invoice?.generation_date || data?.invoice?.created_at,
              ) || "N/A",
            direction: Number(s.total_amount || 0) > 0 ? "Debit" : "Credit",
            debit:
              Number(s.total_amount || 0) > 0
                ? Math.abs(Number(s.total_amount))
                : 0,
            credit:
              Number(s.total_amount || 0) < 0
                ? Math.abs(Number(s.total_amount))
                : 0,
            net: Number(s.total_amount || 0),
            rto: Number(s.rto_freight_charge || 0) > 0,
            reversal: Number(s.cod_charge || 0) < 0,
            status: "Reserved",
            invoiceType: data?.invoice?.invoice_type || "invoice",
            gst_type: data?.invoice?.gst_type || "N/A",
          })),
        );
        return data;
      }
    } catch (error) {
      toast.error(error?.message || "Failed to load invoice details");
      console.error("Invoice detail error:", error);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const handleUpdatePaymentStatus = useCallback(
    async (invoiceId, newStatus) => {
      if (!invoiceId) {
        toast.error("Invoice ID is required");
        return;
      }

      const currentInvoice =
        invoiceRows.find((row) => row.invoiceId === invoiceId) ||
        setupInvoiceRows.find((row) => row.invoiceId === invoiceId);

      if (!currentInvoice) {
        toast.error("Invoice not found");
        return;
      }

      if (currentInvoice?.invoiceType === "credit_note") {
        toast("Cannot change status for Credit Notes", { icon: "⚠️" });
        return;
      }

      if (currentInvoice?.billing_type?.toLowerCase() === "prepaid") {
        toast("Prepaid merchants don't have due/paid status", { icon: "ℹ️" });
        return;
      }

      if (currentInvoice.payment_status === newStatus) {
        toast(`Already marked '${newStatus}'`, { icon: "ℹ️" });
        return;
      }

      setUpdatingPaymentStatus((prev) => new Set(prev).add(invoiceId));

      try {
        const response = await updatePaymentStatus(invoiceId, newStatus);
        if (response?.success) {
          toast.success(`Payment status updated to ${newStatus}`);
          await Promise.allSettled([
            loadInvoices({ page: 1, limit: 20 }),
            loadSetupInvoices({ page: 1, limit: 20 }),
          ]);
        } else {
          toast.error(response?.message || "Failed to update");
        }
      } catch (error) {
        const message = error?.response?.data?.message || error?.message;
        if (error?.response?.status === 400) {
          toast(message || "Already in this status", { icon: "ℹ️" });
        } else {
          toast.error(message || "Failed to update");
        }
      } finally {
        setUpdatingPaymentStatus((prev) => {
          const newSet = new Set(prev);
          newSet.delete(invoiceId);
          return newSet;
        });
      }
    },
    [invoiceRows, setupInvoiceRows, loadInvoices, loadSetupInvoices],
  );

  const handleRegenerate = useCallback(
    async (invoiceId) => {
      if (!invoiceId) return toast.error("Invoice ID is required.");
      if (!window.confirm(`Regenerate invoice ${invoiceId}?`)) return;

      setIsLoading(true);
      try {
        const response = await regenerateInvoice(invoiceId);
        if (response?.success) {
          toast.success(`Invoice ${invoiceId} regenerated.`);
          await Promise.all([
            loadInvoices({ page: 1, limit: 20 }),
            loadDashboard(),
            loadMerchants({ page: 1, limit: 20 }),
          ]);
          if (isDrawerOpen) closeDrawer();
          setActivityItems((prev) => [
            {
              time: formatTime(new Date()),
              title: "Invoice regenerated",
              body: `Invoice ${invoiceId} regenerated.`,
              actor: "Admin",
            },
            ...prev,
          ]);
        } else {
          toast.error(response?.message || "Failed to regenerate invoice");
        }
      } catch (error) {
        const status = error?.response?.status;
        if (status === 409) toast.error("Invoice already regenerated.");
        else if (status === 422)
          toast.error("Cannot regenerate. Must be Failed or Cancelled.");
        else if (status === 404) toast.error("Invoice not found.");
        else
          toast.error(
            error?.response?.data?.message ||
              error?.message ||
              "Failed to regenerate.",
          );
      } finally {
        setIsLoading(false);
      }
    },
    [loadInvoices, loadDashboard, loadMerchants, isDrawerOpen],
  );

  const setupComponentsFiltered = useMemo(() => {
    const { componentSearch, eventFilter, paymentFilter } = filters;
    return setupComponents.filter((row) => {
      const searchTerm = componentSearch?.toLowerCase() || "";
      const matchesSearch =
        !searchTerm ||
        `${row.awb || ""} ${row.order_id || ""} ${row.merchant_order_id || ""} ${row.seller || ""} ${row.component || ""}`
          .toLowerCase()
          .includes(searchTerm);
      const status = (row.shipment_status || row.event || "")
        .toLowerCase()
        .trim();
      const normalizedStatus = status.replace(/\s+/g, "_");
      const matchesEvent =
        eventFilter === "all" ||
        status === eventFilter.toLowerCase() ||
        normalizedStatus === eventFilter.toLowerCase();
      const payment = (row.payment_type || "").toLowerCase();
      const matchesPayment =
        paymentFilter === "all" || payment === paymentFilter.toLowerCase();
      return matchesSearch && matchesEvent && matchesPayment;
    });
  }, [setupComponents, filters]);

  // ============================================================
  // API: GENERATE MERCHANT INVOICE
  // ============================================================

  const handleGenerateMerchantInvoice = useCallback(
    async (merchantId) => {
      if (!merchantId) return toast.error("Merchant ID is required.");

      setIsLoading(true);
      try {
        const response = await generateMerchantInvoice(
          merchantId,
          generationDate,
        );
        if (response?.success) {
          toast.success(`Invoice generated for merchant ${merchantId}`);
          await Promise.all([
            loadInvoices({ page: 1, limit: 20 }),
            loadDashboard(),
            loadMerchants({ page: 1, limit: 20 }),
          ]);
          if (isDrawerOpen) {
            await loadInvoiceDetail(currentDrawerRow?.invoiceId);
            await loadMerchantDetail(merchantId);
          }
        } else if (response?.reason === "DUPLICATE") {
          toast.info("Invoice already exists for this period");
        } else if (response?.reason === "NO_ACTIVITY") {
          toast.info("No billable activity found for this period");
        } else if (response?.reason === "ZERO_NET") {
          toast.info("Net amount is zero - no invoice generated");
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to generate invoice",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      generationDate,
      loadInvoices,
      loadDashboard,
      loadMerchants,
      loadInvoiceDetail,
      currentDrawerRow,
      isDrawerOpen,
    ],
  );

  // ============================================================
  // API: UPDATE BILLING CYCLE
  // ============================================================

  const handleUpdateBillingCycle = useCallback(
    async (merchantId, billingCycleDays) => {
      if (!merchantId) return toast.error("Merchant ID is required.");
      if (![15, 30].includes(Number(billingCycleDays))) {
        return toast.error("Billing cycle must be 15 or 30 days.");
      }

      try {
        const response = await updateBillingCycleApi(
          merchantId,
          billingCycleDays,
        );
        if (response?.success) {
          toast.success(`Billing cycle updated to ${billingCycleDays} days`);
          await loadMerchantDetail(merchantId);
        } else {
          toast.error(response?.message || "Failed to update billing cycle");
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to update billing cycle",
        );
      }
    },
    [loadMerchantDetail],
  );

  // ============================================================
  // API: RETRY FAILED GENERATIONS
  // ============================================================

  const handleRetryFailed = useCallback(async () => {
    if (selectedFailedIds.size === 0) {
      toast.error("Please select at least one failed generation to retry");
      return;
    }

    if (
      !window.confirm(`Retry ${selectedFailedIds.size} failed generation(s)?`)
    ) {
      return;
    }

    setRetryingFailed(true);
    try {
      const combinedSource = [...failedGenerations, ...setupFailedGenerations];
      const uniqueMap = new Map();
      combinedSource.forEach((f) => {
        if (f?.log_id) uniqueMap.set(f.log_id, f);
      });

      const targets = Array.from(uniqueMap.values())
        .filter((f) => selectedFailedIds.has(f.log_id))
        .map((f) => ({
          merchant_id: f.merchant_id,
          generation_date: f.generation_date,
        }));

      if (targets.length === 0) {
        toast.error("No matching failed generations found.");
        return;
      }

      const response = await retryFailedGenerations(targets);
      if (response?.success) {
        const data = response.data;
        toast.success(
          `${data.succeeded || 0} succeeded, ${data.still_failed || 0} still failed`,
        );
        await Promise.allSettled([
          loadFailedGenerations(failedPage, failedLimit),
          loadSetupFailedGenerations(setupFailedPage, 20),
          loadInvoices({ page: 1, limit: 20 }),
          loadDashboard(),
          loadMerchants({ page: 1, limit: 20 }),
        ]);
        setSelectedFailedIds(new Set());
      } else {
        toast.error(response?.message || "Failed to retry generations");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to retry generations");
    } finally {
      setRetryingFailed(false);
    }
  }, [
    selectedFailedIds,
    failedGenerations,
    setupFailedGenerations,
    loadFailedGenerations,
    loadSetupFailedGenerations,
    loadInvoices,
    loadDashboard,
    loadMerchants,
    failedPage,
    failedLimit,
    setupFailedPage,
  ]);
  // ============================================================
  // EXPORT HANDLERS
  // ============================================================

  const exportIssuesCSV = useCallback(() => {
    if (!issuesData.length) return toast.error("No issues to export.");
    const headers = [
      "Severity",
      "Seller ID",
      "Seller Name",
      "Invoice Key",
      "Issue",
      "Affected Lines",
      "Recommended Action",
    ];
    const rows = issuesData.map((issue) => [
      issue.severity,
      issue.sellerId,
      issue.seller,
      issue.key,
      issue.issue,
      issue.lines,
      issue.action,
    ]);
    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `validation-issues-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success("Issues exported.");
  }, [issuesData]);

  const handleDownloadPdf = useCallback(async (invoiceId) => {
    if (!invoiceId) return toast.error("Invoice ID required.");
    setIsLoading(true);
    try {
      await downloadInvoicePdf(invoiceId);
      toast.success("PDF downloaded.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to download PDF",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleExport = useCallback(
    async (type, invoiceId = null) => {
      if (type === "issues") return exportIssuesCSV();
      const id = invoiceId || currentDrawerRow?.invoiceId;
      if (!id) return toast.error("Invoice ID required.");
      setExportingInvoice(true);
      try {
        await exportInvoiceShipments(id);
        toast.success("Shipment CSV exported.");
      } catch (error) {
        toast.error(getApiMessage(error));
      } finally {
        setExportingInvoice(false);
      }
    },
    [currentDrawerRow, exportIssuesCSV],
  );

  // const runGeneration = useCallback(async () => {
  //   setView("loading");
  //   setIsLoading(true);
  //   setIsGenerating(true);
  //   setGenerationStage("submitting");
  //   setComponentRows([]);
  //   setCurrentPage(1);

  //   const dateStr = generationDate || new Date().toISOString().slice(0, 10);
  //   setGeneratedDate(dateStr);

  //   setProcessSteps((prev) =>
  //     prev.map((step, idx) => ({
  //       ...step,
  //       status: idx === 0 ? "running" : "pending",
  //     })),
  //   );

  //   try {
  //     // ---- STEP ANIMATIONS (unchanged) ----
  //     await new Promise((resolve) => setTimeout(resolve, 600));
  //     setProcessSteps((prev) =>
  //       prev.map((step, idx) => ({
  //         ...step,
  //         status: idx === 0 ? "complete" : idx === 1 ? "running" : "pending",
  //       })),
  //     );

  //     await new Promise((resolve) => setTimeout(resolve, 600));
  //     setProcessSteps((prev) =>
  //       prev.map((step, idx) => ({
  //         ...step,
  //         status: idx <= 1 ? "complete" : idx === 2 ? "running" : "pending",
  //       })),
  //     );

  //     await new Promise((resolve) => setTimeout(resolve, 600));
  //     setProcessSteps((prev) =>
  //       prev.map((step, idx) => ({
  //         ...step,
  //         status: idx <= 2 ? "complete" : idx === 3 ? "running" : "pending",
  //       })),
  //     );

  //     const merchantIds = Array.from(selectedSellers);
  //     const isSelected = scope === "selected";

  //     if (isSelected && merchantIds.length === 0) {
  //       setView("setup");
  //       setIsLoading(false);
  //       setIsGenerating(false);
  //       setGenerationStage(null);
  //       return;
  //     }

  //     let response;
  //     try {
  //       response = await generateInvoices(
  //         isSelected ? "selected" : "all",
  //         isSelected ? merchantIds : [],
  //         dateStr,
  //       );
  //     } catch (apiError) {
  //       console.error("API Error:", apiError);
  //       toast.error(
  //         apiError?.response?.data?.message ||
  //           apiError?.message ||
  //           "Failed to start invoice generation.",
  //       );
  //       setView("setup");
  //       setIsLoading(false);
  //       setIsGenerating(false);
  //       setGenerationStage(null);
  //       return;
  //     }

  //     if (!response?.success) {
  //       toast.error(response?.message || "Failed to start invoice generation.");
  //       setView("setup");
  //       setIsLoading(false);
  //       setIsGenerating(false);
  //       setGenerationStage(null);
  //       return;
  //     }

  //     const jobId = response?.data?.job_id;

  //     if (!jobId) {
  //       console.warn(
  //         "[Invoice Generation] No job_id returned — falling back to sync result.",
  //       );
  //       const syncData = response.data || {};
  //       return await finalizeGeneration({
  //         isSelected,
  //         dateStr,
  //         data: syncData,
  //       });
  //     }

  //     setGenerationStage("polling");

  //     let jobOutcome;
  //     try {
  //       jobOutcome = await pollInvoiceGenerationJob(jobId);
  //     } catch (pollError) {
  //       console.error("Polling Error:", pollError);
  //       toast.error(
  //         pollError?.message ||
  //           "Timed out waiting for invoice generation to complete.",
  //       );
  //       setView("setup");
  //       setIsLoading(false);
  //       setIsGenerating(false);
  //       setGenerationStage(null);
  //       return;
  //     }

  //     if (jobOutcome.status === "failed") {
  //       toast.error(`Invoice generation failed: ${jobOutcome.error_detail}`);
  //       setView("setup");
  //       setIsLoading(false);
  //       setIsGenerating(false);
  //       setGenerationStage(null);
  //       return;
  //     }

  //     const data = jobOutcome.result || {};
  //     if (data?.generation_date) {
  //       setGeneratedDate(data.generation_date);
  //     }

  //     setProcessSteps((prev) =>
  //       prev.map((step, idx) => ({
  //         ...step,
  //         status: idx <= 2 ? "complete" : idx === 3 ? "running" : "pending",
  //       })),
  //     );

  //     await new Promise((resolve) => setTimeout(resolve, 600));
  //     setProcessSteps((prev) =>
  //       prev.map((step) => ({ ...step, status: "complete" })),
  //     );

  //     const summary = data?.summary || {};
  //     const generated = summary.generated || 0;
  //     const skipped_duplicate = summary.skipped_duplicate || 0;
  //     const no_billable_activity = summary.no_billable_activity || 0;
  //     const failed = summary.failed || 0;

  //     const batchIdValue =
  //       data?.batch_id ||
  //       (isSelected ? `SELECTED-${dateStr}` : `BATCH-${dateStr}`);
  //     setBatchId(batchIdValue);

  //     await Promise.all([
  //       loadInvoices({ page: 1, limit: 20 }),
  //       loadDashboard(),
  //       loadMerchants({ page: 1, limit: 20 }),
  //     ]);

  //     setBatchStatus(
  //       failed > 0
  //         ? {
  //             text: "PARTIAL SUCCESS",
  //             className: "bg-amber-100 text-amber-700",
  //           }
  //         : { text: "SUCCESS", className: "bg-green-100 text-green-700" },
  //     );

  //     setActivityItems((prev) => [
  //       {
  //         time: formatTime(new Date()),
  //         title: "Invoice generation completed",
  //         body: `Mode: ${isSelected ? "Selected" : "All"}, Generated: ${generated}, Failed: ${failed}, Skipped: ${skipped_duplicate}, No Activity: ${no_billable_activity}`,
  //         actor: "Billing API",
  //       },
  //       ...prev,
  //     ]);

  //     await new Promise((resolve) => setTimeout(resolve, 500));

  //     const freshInvoices = await loadInvoices({ page: 1, limit: 20 });
  //     const currentInvoiceRows = freshInvoices || invoiceRows;

  //     const allComponents = [];

  //     for (const row of currentInvoiceRows) {
  //       if (!row.invoiceId) continue;

  //       try {
  //         const detailResponse = await getInvoiceDetails(row.invoiceId);
  //         if (
  //           !detailResponse?.success ||
  //           !Array.isArray(detailResponse?.data?.shipments)
  //         ) {
  //           continue;
  //         }

  //         const shipments = detailResponse.data.shipments;
  //         const invoiceData = detailResponse.data.invoice || {};

  //         allComponents.push(
  //           ...shipments.map((s) => ({
  //             awb: s.awb_number || s.awb || "N/A",
  //             component: s.charge_type || s.shipment_status || "Shipment",
  //             seller: invoiceData.merchant_name || row.seller,
  //             sellerId: invoiceData.merchant_id || row.sellerId,
  //             event: s.shipment_status || "SHIPMENT",
  //             date:
  //               formatDate(
  //                 invoiceData.generation_date || invoiceData.created_at,
  //               ) || "N/A",
  //             direction: Number(s.total_amount || 0) > 0 ? "Debit" : "Credit",
  //             debit:
  //               Number(s.total_amount || 0) > 0
  //                 ? Math.abs(Number(s.total_amount))
  //                 : 0,
  //             credit:
  //               Number(s.total_amount || 0) < 0
  //                 ? Math.abs(Number(s.total_amount))
  //                 : 0,
  //             net: Number(s.total_amount || 0),
  //             rto: Number(s.rto_freight_charge || 0) > 0,
  //             reversal: Number(s.cod_charge || 0) < 0,
  //             status: "Reserved",
  //             freight_charge: s.freight_charge,
  //             cod_charge: s.cod_charge,
  //             rto_freight_charge: s.rto_freight_charge,
  //             insurance_charge: s.insurance_charge,
  //             taxable_amount: s.taxable_amount,
  //             cgst_amount: s.cgst_amount,
  //             sgst_amount: s.sgst_amount,
  //             igst_amount: s.igst_amount,
  //             total_amount: s.total_amount,
  //             order_id: s.order_id,
  //             merchant_order_id: s.merchant_order_id,
  //             courier: s.courier,
  //             payment_type: s.payment_type,
  //             charged_weight: s.charged_weight,
  //             invoiceType: invoiceData.invoice_type || "invoice",
  //             gst_type: invoiceData.gst_type || "N/A",
  //           })),
  //         );
  //       } catch (error) {
  //         console.error(
  //           `Failed to fetch invoice details for ${row.invoiceId}:`,
  //           error,
  //         );
  //       }
  //     }

  //     setComponentRows(allComponents);
  //     setInvoiceRows((prevRows) =>
  //       prevRows.map((row) =>
  //         row.invoiceId &&
  //         row.validation !== "Failed" &&
  //         row.submission !== "Success"
  //           ? { ...row, selected: true }
  //           : row,
  //       ),
  //     );

  //     setView("preview");
  //   } catch (error) {
  //     console.error("Generation error:", error);
  //     toast.error(error?.message || "Generation failed");
  //     setView("setup");
  //   } finally {
  //     setIsLoading(false);
  //     setIsGenerating(false);
  //     setGenerationStage(null);
  //   }
  // }, [
  //   generationDate,
  //   scope,
  //   selectedSellers,
  //   loadInvoices,
  //   loadDashboard,
  //   loadMerchants,
  //   invoiceRows,
  //   pollInvoiceGenerationJob,
  // ]);

 
 const runGeneration = useCallback(async () => {
  setView("loading");
  setIsLoading(true);
  setIsGenerating(true);
  setGenerationStage("submitting");
  setComponentRows([]);
  setCurrentPage(1);

  const dateStr = generationDate || new Date().toISOString().slice(0, 10);
  setGeneratedDate(dateStr);

  setProcessSteps((prev) =>
    prev.map((step, idx) => ({
      ...step,
      status: idx === 0 ? "running" : "pending",
    })),
  );

  try {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setProcessSteps((prev) =>
      prev.map((step, idx) => ({
        ...step,
        status: idx === 0 ? "complete" : idx === 1 ? "running" : "pending",
      })),
    );

    await new Promise((resolve) => setTimeout(resolve, 600));
    setProcessSteps((prev) =>
      prev.map((step, idx) => ({
        ...step,
        status: idx <= 1 ? "complete" : idx === 2 ? "running" : "pending",
      })),
    );

    await new Promise((resolve) => setTimeout(resolve, 600));
    setProcessSteps((prev) =>
      prev.map((step, idx) => ({
        ...step,
        status: idx <= 2 ? "complete" : idx === 3 ? "running" : "pending",
      })),
    );

    const merchantIds = Array.from(selectedSellers);
    const isSelected = scope === "selected";

    if (isSelected && merchantIds.length === 0) {
      setView("setup");
      setIsLoading(false);
      setIsGenerating(false);
      setGenerationStage(null);
      return;
    }

    let response;
    try {
      response = await generateInvoices(
        isSelected ? "selected" : "all",
        isSelected ? merchantIds : [],
        dateStr,
      );
    } catch (apiError) {
      console.error("API Error:", apiError);
      toast.error(
        apiError?.response?.data?.message ||
          apiError?.message ||
          "Failed to start invoice generation.",
      );
      setView("setup");
      setIsLoading(false);
      setIsGenerating(false);
      setGenerationStage(null);
      return;
    }

    if (!response?.success) {
      toast.error(response?.message || "Failed to start invoice generation.");
      setView("setup");
      setIsLoading(false);
      setIsGenerating(false);
      setGenerationStage(null);
      return;
    }

    const jobId = response?.data?.job_id;

    if (!jobId) {
      console.warn(
        "[Invoice Generation] No job_id returned — falling back to sync result.",
      );
      const syncData = response.data || {};
      return await finalizeGeneration({
        isSelected,
        dateStr,
        data: syncData,
      });
    }

    setGenerationStage("polling");

    let jobOutcome;
    try {
      jobOutcome = await pollInvoiceGenerationJob(jobId);
    } catch (pollError) {
      console.error("Polling Error:", pollError);
      toast.error(
        pollError?.message ||
          "Timed out waiting for invoice generation to complete.",
      );
      setView("setup");
      setIsLoading(false);
      setIsGenerating(false);
      setGenerationStage(null);
      return;
    }

    if (jobOutcome.status === "failed") {
      toast.error(`Invoice generation failed: ${jobOutcome.error_detail}`);
      setView("setup");
      setIsLoading(false);
      setIsGenerating(false);
      setGenerationStage(null);
      return;
    }

    const data = jobOutcome.result || {};
    if (data?.generation_date) {
      setGeneratedDate(data.generation_date);
    }

    setProcessSteps((prev) =>
      prev.map((step, idx) => ({
        ...step,
        status: idx <= 2 ? "complete" : idx === 3 ? "running" : "pending",
      })),
    );

    await new Promise((resolve) => setTimeout(resolve, 600));
    setProcessSteps((prev) =>
      prev.map((step) => ({ ...step, status: "complete" })),
    );

    const generatedArr = Array.isArray(data?.generated)
      ? data.generated
      : [];
    const skippedArr = Array.isArray(data?.skipped_duplicate)
      ? data.skipped_duplicate
      : [];
    const noActivityArr = Array.isArray(data?.no_billable_activity)
      ? data.no_billable_activity
      : [];
    const failedArr = Array.isArray(data?.failed) ? data.failed : [];

    const generatedCount = generatedArr.length;
    const skippedCount = skippedArr.length;
    const noActivityCount = noActivityArr.length;
    const failedCount = failedArr.length;

    if (generatedCount > 0 && failedCount === 0 && skippedCount === 0) {
      toast.success(
        `${generatedCount} invoice${generatedCount > 1 ? "s" : ""} generated successfully`,
        { duration: 4000 },
      );
    } else if (generatedCount > 0) {
      toast.success(
        `${generatedCount} generated, ${skippedCount} skipped, ${failedCount} failed`,
        { duration: 5000 },
      );
    } else if (skippedCount > 0) {
  const invoiceSuffixes = skippedArr
    .map((item) => {
      const match = item?.message?.match(/INV-[\d-]+-(\d+)/);
      if (match?.[1]) {
        return match[1].slice(-2);
      }
      return item?.existing_invoice_id ? String(item.existing_invoice_id).slice(-2) : null;
    })
    .filter(Boolean);

  const combinedMessage =
    invoiceSuffixes.length > 0
      ? `invoice (${invoiceSuffixes.join(",")}) already exists for this billing period`
      : "Invoice already exists for this billing period";

  toast(combinedMessage, { icon: "ℹ️", duration: 5000 });
    } else if (noActivityCount > 0) {
      noActivityArr.forEach((item, idx) => {
        setTimeout(() => {
          toast(
            item?.message ||
              `No billable activity (merchant ${item?.merchant_id})`,
            { icon: "ℹ️", duration: 5000 },
          );
        }, idx * 250);
      });
    } else if (failedCount > 0) {
      failedArr.forEach((item, idx) => {
        setTimeout(() => {
          toast.error(
            item?.message ||
              `Generation failed (merchant ${item?.merchant_id})`,
            { duration: 5000 },
          );
        }, idx * 250);
      });
    } else {
      toast("No invoices were generated", { icon: "ℹ️" });
    }

    // ============================================================
    // Batch ID
    // ============================================================
    const batchIdValue =
      data?.batch_id ||
      (isSelected ? `SELECTED-${dateStr}` : `BATCH-${dateStr}`);
    setBatchId(batchIdValue);

    await Promise.all([
      loadInvoices({ page: 1, limit: 20 }),
      loadDashboard(),
      loadMerchants({ page: 1, limit: 20 }),
    ]);

    // ============================================================
    // Batch Status
    // ============================================================
    setBatchStatus(
      failedCount > 0
        ? { text: "PARTIAL SUCCESS", className: "bg-amber-100 text-amber-700" }
        : skippedCount > 0 && generatedCount === 0
          ? { text: "ALREADY GENERATED", className: "bg-blue-100 text-blue-700" }
          : noActivityCount > 0 && generatedCount === 0
            ? { text: "NO ACTIVITY", className: "bg-gray-100 text-gray-700" }
            : generatedCount > 0
              ? { text: "SUCCESS", className: "bg-green-100 text-green-700" }
              : { text: "NO CHANGE", className: "bg-gray-100 text-gray-700" },
    );

    // ============================================================
    // Activity item
    // ============================================================
    setActivityItems((prev) => [
      {
        time: formatTime(new Date()),
        title:
          generatedCount > 0
            ? "Invoice generation completed"
            : skippedCount > 0
              ? "Invoice already exists"
              : "Invoice generation completed",
        body: `Generated: ${generatedCount}, Skipped: ${skippedCount}, No Activity: ${noActivityCount}, Failed: ${failedCount}`,
        actor: "Billing API",
      },
      ...prev,
    ]);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const freshInvoices = await loadInvoices({ page: 1, limit: 20 });
    const currentInvoiceRows = freshInvoices || invoiceRows;

    const allComponents = [];

    for (const row of currentInvoiceRows) {
      if (!row.invoiceId) continue;

      try {
        const detailResponse = await getInvoiceDetails(row.invoiceId);
        if (
          !detailResponse?.success ||
          !Array.isArray(detailResponse?.data?.shipments)
        ) {
          continue;
        }

        const shipments = detailResponse.data.shipments;
        const invoiceData = detailResponse.data.invoice || {};

        allComponents.push(
          ...shipments.map((s) => ({
            awb: s.awb_number || s.awb || "N/A",
            component: s.charge_type || s.shipment_status || "Shipment",
            seller: invoiceData.merchant_name || row.seller,
            sellerId: invoiceData.merchant_id || row.sellerId,
            event: s.shipment_status || "SHIPMENT",
            date:
              formatDate(
                invoiceData.generation_date || invoiceData.created_at,
              ) || "N/A",
            direction: Number(s.total_amount || 0) > 0 ? "Debit" : "Credit",
            debit:
              Number(s.total_amount || 0) > 0
                ? Math.abs(Number(s.total_amount))
                : 0,
            credit:
              Number(s.total_amount || 0) < 0
                ? Math.abs(Number(s.total_amount))
                : 0,
            net: Number(s.total_amount || 0),
            rto: Number(s.rto_freight_charge || 0) > 0,
            reversal: Number(s.cod_charge || 0) < 0,
            status: "Reserved",
            freight_charge: s.freight_charge,
            cod_charge: s.cod_charge,
            rto_freight_charge: s.rto_freight_charge,
            insurance_charge: s.insurance_charge,
            taxable_amount: s.taxable_amount,
            cgst_amount: s.cgst_amount,
            sgst_amount: s.sgst_amount,
            igst_amount: s.igst_amount,
            total_amount: s.total_amount,
            order_id: s.order_id,
            merchant_order_id: s.merchant_order_id,
            courier: s.courier,
            payment_type: s.payment_type,
            charged_weight: s.charged_weight,
            invoiceType: invoiceData.invoice_type || "invoice",
            gst_type: invoiceData.gst_type || "N/A",
          })),
        );
      } catch (error) {
        console.error(
          `Failed to fetch invoice details for ${row.invoiceId}:`,
          error,
        );
      }
    }

    setComponentRows(allComponents);
    setInvoiceRows((prevRows) =>
      prevRows.map((row) =>
        row.invoiceId &&
        row.validation !== "Failed" &&
        row.submission !== "Success"
          ? { ...row, selected: true }
          : row,
      ),
    );

    setView("preview");
  } catch (error) {
    console.error("Generation error:", error);
    toast.error(error?.message || "Generation failed");
    setView("setup");
  } finally {
    setIsLoading(false);
    setIsGenerating(false);
    setGenerationStage(null);
  }
}, [
  generationDate,
  scope,
  selectedSellers,
  loadInvoices,
  loadDashboard,
  loadMerchants,
  invoiceRows,
  pollInvoiceGenerationJob,
]);
 
  const submitInvoices = useCallback(async () => {
    setIsSubmitModalOpen(false);
    setIsLoading(true);
    try {
      await Promise.all([
        loadInvoices({ page: 1, limit: 20 }),
        loadDashboard(),
        loadMerchants({ page: 1, limit: 20 }),
      ]);
      toast.success("Invoice data refreshed successfully.");
    } catch (error) {
      toast.error(getApiMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [loadInvoices, loadDashboard, loadMerchants]);

  // ============================================================
  // RESET BATCH
  // ============================================================
  const resetBatch = useCallback(() => {
    setComponentRows([]);
    setDrawerComponents([]);
    setBatchStatus({ text: "READY", className: "bg-green-100 text-green-700" });
    setView("setup");
    setBatchId(null);
    setIssuesData([]);
    setActivityItems([]);
    setGeneratedDate(null);
    setCurrentPage(1);
    setFailedFetched(false);
    setComponentsFetched(false);
    setSelectedSellers(new Set());
    setInvoiceDetailsMap({});
    setCreditNotes([]);
    setFailedGenerations([]);
    setSelectedFailedIds(new Set());
    setExpandedAwbs(new Set());

    setFilters({
      invoiceSearch: "",
      cycleFilter: "all",
      validationFilter: "all",
      submissionFilter: "all",
      componentSearch: "",
      eventFilter: "all",
      paymentFilter: "all",
      dateFrom: "",
      dateTo: "",
    });

    setActiveTab("summary");
    setSetupActiveTab("summary");

    Promise.allSettled([
      loadInvoices({ page: 1, limit: 20 }),
      loadSetupInvoices({ page: 1, limit: 20 }),
      loadSetupCreditNotes({ page: 1, limit: 20 }),
      loadSetupFailedGenerations(1, 20),
      loadSetupActivity(),
    ]).then(() => {
      loadSetupComponents();
    });
  }, [
    loadInvoices,
    loadSetupInvoices,
    loadSetupCreditNotes,
    loadSetupFailedGenerations,
    loadSetupActivity,
    loadSetupComponents,
  ]);
  // ============================================================
  // REFRESH ALL
  // ============================================================

  const handleRefreshAll = useCallback(async () => {
    setIsRefreshing(true);
    const toastId = toast.loading("Refreshing data...");
    try {
      await Promise.allSettled([
        loadDashboard(),
        loadMerchants(),
        loadInvoices(),
        loadSetupInvoices(),
        loadSetupCreditNotes(),
        loadSetupFailedGenerations(1, 20),
        loadSetupActivity(),
      ]);

      await loadSetupComponents();

      if (view === "preview") {
        if (activeTab === "credit-notes") await loadCreditNotes();
        if (activeTab === "failed")
          await loadFailedGenerations(failedPage, failedLimit);
        if (activeTab === "activity" && batchId) await loadGenerationLogs();
      }

      if (isDrawerOpen && currentDrawerRow?.invoiceId) {
        await loadInvoiceDetail(currentDrawerRow.invoiceId);
      }
      if (isDrawerOpen && currentDrawerRow?.sellerId) {
        await loadMerchantDetail(currentDrawerRow.sellerId);
      }

      toast.dismiss(toastId);
      toast.success("All data refreshed successfully!");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(
        "Failed to refresh data: " + (error?.message || "Unknown error"),
      );
    } finally {
      setIsRefreshing(false);
    }
  }, [
    loadDashboard,
    loadMerchants,
    loadInvoices,
    loadSetupInvoices,
    loadSetupCreditNotes,
    loadSetupFailedGenerations,
    loadSetupActivity,
    loadSetupComponents,
    loadCreditNotes,
    loadFailedGenerations,
    loadGenerationLogs,
    loadInvoiceDetail,
    loadMerchantDetail,
    view,
    activeTab,
    batchId,
    isDrawerOpen,
    currentDrawerRow,
    failedPage,
    failedLimit,
  ]);

  // ============================================================
  // CUSTOM INVOICE HANDLERS
  // ============================================================

  const openCustomInvoiceModal = useCallback(
    (merchantId, source = "drawer") => {
      setCustomInvoiceModal({ isOpen: true, merchantId, source });
      setCustomPeriodStart("");
      setCustomPeriodEnd("");
      setLastInvoicedThrough(null);
      setMerchantSearchTerm("");
      setMerchantSearchTerm("");
    },
    [],
  );

  const closeCustomInvoiceModal = useCallback(() => {
    setCustomInvoiceModal({ isOpen: false, merchantId: null, source: null });
    setCustomPeriodStart("");
    setCustomPeriodEnd("");
    setLastInvoicedThrough(null);
  }, []);

  const handleCustomInvoiceSubmit = useCallback(async () => {
    const { merchantId, source } = customInvoiceModal;
    if (!merchantId) return toast.error("Merchant ID missing");
    if (!customPeriodStart || !customPeriodEnd)
      return toast.error("Please select both start and end dates");
    if (new Date(customPeriodStart) > new Date(customPeriodEnd))
      return toast.error("Start date cannot be after end date");

    const diffDays = Math.ceil(
      (new Date(customPeriodEnd) - new Date(customPeriodStart)) /
        (1000 * 60 * 60 * 24),
    );
    if (diffDays > 255) return toast.error("Period cannot exceed 255 days");

    setView("loading");
    setIsLoading(true);
    setCustomGenerating(true);

    setProcessSteps([
      {
        step: 1,
        title: "Checking billing cycles",
        desc: "Finding closed 15-day and 30-day periods",
        status: "pending",
      },
      {
        step: 2,
        title: "Reserving unbilled components",
        desc: "Preventing duplicate selection",
        status: "pending",
      },
      {
        step: 3,
        title: "Calculating debit and credit",
        desc: "Applying RTO freight and COD rules",
        status: "pending",
      },
      {
        step: 4,
        title: "Preparing preview",
        desc: "Creating invoice groups",
        status: "pending",
      },
    ]);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setProcessSteps((prev) =>
        prev.map((step, idx) => ({
          ...step,
          status: idx === 0 ? "complete" : idx === 1 ? "running" : "pending",
        })),
      );

      await new Promise((resolve) => setTimeout(resolve, 600));
      setProcessSteps((prev) =>
        prev.map((step, idx) => ({
          ...step,
          status: idx <= 1 ? "complete" : idx === 2 ? "running" : "pending",
        })),
      );

      await new Promise((resolve) => setTimeout(resolve, 600));
      setProcessSteps((prev) =>
        prev.map((step, idx) => ({
          ...step,
          status: idx <= 2 ? "complete" : idx === 3 ? "running" : "pending",
        })),
      );

      const response = await generateCustomInvoice(
        merchantId,
        customPeriodStart,
        customPeriodEnd,
      );

      // --- SUCCESS ---
      if (response?.success) {
        setProcessSteps((prev) =>
          prev.map((step) => ({ ...step, status: "complete" })),
        );
        toast.success("Custom invoice generated successfully");

        await loadInvoices({ merchant_id: merchantId, page: 1, limit: 20 });

        const invoiceId = response.data?.invoice_id;
        if (invoiceId) {
          const detail = await loadInvoiceDetail(invoiceId);
          if (detail) {
            const shipments = detail.shipments || [];
            setComponentRows(
              shipments.map((s) => ({
                awb: s.awb_number || s.awb || "N/A",
                component: s.charge_type || s.shipment_status || "Shipment",
                seller: detail?.invoice?.merchant_name || "N/A",
                sellerId: detail?.invoice?.merchant_id || merchantId,
                event: s.shipment_status || "SHIPMENT",
                date:
                  formatDate(
                    detail?.invoice?.generation_date ||
                      detail?.invoice?.created_at,
                  ) || "N/A",
                direction: Number(s.total_amount || 0) > 0 ? "Debit" : "Credit",
                debit:
                  Number(s.total_amount || 0) > 0
                    ? Math.abs(Number(s.total_amount))
                    : 0,
                credit:
                  Number(s.total_amount || 0) < 0
                    ? Math.abs(Number(s.total_amount))
                    : 0,
                net: Number(s.total_amount || 0),
                rto: Number(s.rto_freight_charge || 0) > 0,
                reversal: Number(s.cod_charge || 0) < 0,
                status: "Reserved",
                freight_charge: s.freight_charge,
                cod_charge: s.cod_charge,
                rto_freight_charge: s.rto_freight_charge,
                insurance_charge: s.insurance_charge,
                taxable_amount: s.taxable_amount,
                cgst_amount: s.cgst_amount,
                sgst_amount: s.sgst_amount,
                igst_amount: s.igst_amount,
                total_amount: s.total_amount,
                order_id: s.order_id,
                merchant_order_id: s.merchant_order_id,
                courier: s.courier,
                payment_type: s.payment_type,
                charged_weight: s.charged_weight,
                invoiceType: detail?.invoice?.invoice_type || "invoice",
                gst_type: detail?.invoice?.gst_type || "N/A",
              })),
            );
          }
        }

        const dateStr =
          customPeriodStart || new Date().toISOString().slice(0, 10);
        setBatchId(`CUSTOM-${merchantId}-${dateStr}`);
        setBatchStatus({
          text: "SUCCESS",
          className: "bg-green-100 text-green-700",
        });

        setInvoiceRows((prevRows) =>
          prevRows.map((row) => {
            if (
              row.sellerId === merchantId &&
              row.validation !== "Failed" &&
              row.submission !== "Success"
            ) {
              return { ...row, selected: true };
            }
            return row;
          }),
        );

        setView("preview");
        setActiveTab("summary");
        closeCustomInvoiceModal();
      } else if (response?.reason === "PERIOD_ALREADY_INVOICED") {
        const lastEnd = response?.data?.last_invoiced_period_end;

        toast.error(
          response?.message || "This billing period has already been invoiced.",
          {
            duration: 5000,
          },
        );

        if (lastEnd) {
          setLastInvoicedThrough(lastEnd);
        }

        setProcessSteps((prev) =>
          prev.map((step) => ({ ...step, status: "complete" })),
        );

        await loadInvoices({
          merchant_id: merchantId,
          page: 1,
          limit: 20,
        });

        const dateStr =
          customPeriodStart || new Date().toISOString().slice(0, 10);

        setBatchId(`EXISTING-${merchantId}-${dateStr}`);

        setBatchStatus({
          text: "EXISTING INVOICES",
          className: "bg-blue-100 text-blue-700",
        });

        setInvoiceRows((prevRows) =>
          prevRows.map((row) => {
            if (
              row.sellerId === merchantId &&
              row.validation !== "Failed" &&
              row.submission !== "Success"
            ) {
              return {
                ...row,
                selected: true,
              };
            }

            return row;
          }),
        );

        setView("preview");
        setActiveTab("summary");
        closeCustomInvoiceModal();
      }
      // --- OTHER ERRORS ---
      else if (response?.reason === "CUSTOM_BILLING_NOT_ENABLED") {
        toast.error("Custom billing is not enabled for this merchant");
        setView("setup");
      } else if (response?.reason === "NO_ACTIVITY") {
        toast("No billable activity in this period", { icon: "ℹ️" });
        setView("setup");
      } else if (response?.reason === "ZERO_NET") {
        toast("Net billable amount is zero for this period", { icon: "ℹ️" });
        setView("setup");
      } else {
        toast.error(response?.message || "Failed to generate custom invoice");
        setView("setup");
      }
    } catch (error) {
      toast.error(error?.message || "An unexpected error occurred");
      setView("setup");
    } finally {
      setIsLoading(false);
      setCustomGenerating(false);
    }
  }, [
    customInvoiceModal,
    customPeriodStart,
    customPeriodEnd,
    loadInvoices,
    loadInvoiceDetail,
    closeCustomInvoiceModal,
  ]);

  const getFilteredInvoices = useCallback(() => {
    const {
      invoiceSearch,
      cycleFilter,
      validationFilter,
      submissionFilter,
      paymentFilter,
      dateFrom,
      dateTo,
    } = filters;
    return invoiceRows.filter((row) => {
      const matchesSearch =
        !invoiceSearch ||
        `${row.key} ${row.sellerId} ${row.seller}`
          .toLowerCase()
          .includes(invoiceSearch.toLowerCase());
      const matchesCycle = cycleFilter === "all" || row.cycle === cycleFilter;
      const matchesValidation =
        validationFilter === "all" || row.validation === validationFilter;
      const matchesSubmission =
        submissionFilter === "all" || row.submission === submissionFilter;

      let matchesPayment = true;
      if (paymentFilter === "creditNote" || paymentFilter === "credit_note") {
        matchesPayment = row.invoiceType === "credit_note";
      } else {
        matchesPayment =
          paymentFilter === "all" || row.payment_status === paymentFilter;
      }

      let matchesDate = true;
      if (dateFrom && row.generation_date)
        matchesDate = row.generation_date >= dateFrom;
      if (dateTo && row.generation_date)
        matchesDate = matchesDate && row.generation_date <= dateTo;
      return (
        matchesSearch &&
        matchesCycle &&
        matchesValidation &&
        matchesSubmission &&
        matchesPayment &&
        matchesDate
      );
    });
  }, [invoiceRows, filters]);

  const getFilteredSetupInvoices = useCallback(() => {
    const { invoiceSearch, cycleFilter, paymentFilter, dateFrom, dateTo } =
      filters;
    return setupInvoiceRows.filter((row) => {
      const matchesSearch =
        !invoiceSearch ||
        `${row.key} ${row.sellerId} ${row.seller}`
          .toLowerCase()
          .includes(invoiceSearch.toLowerCase());
      const matchesCycle = cycleFilter === "all" || row.cycle === cycleFilter;

      let matchesPayment = true;
      if (paymentFilter === "creditNote" || paymentFilter === "credit_note") {
        matchesPayment = row.invoiceType === "credit_note";
      } else {
        matchesPayment =
          paymentFilter === "all" || row.payment_status === paymentFilter;
      }

      let matchesDate = true;
      if (dateFrom && row.generation_date)
        matchesDate = row.generation_date >= dateFrom;
      if (dateTo && row.generation_date)
        matchesDate = matchesDate && row.generation_date <= dateTo;

      return matchesSearch && matchesCycle && matchesPayment && matchesDate;
    });
  }, [setupInvoiceRows, filters]);

  const filteredComponents = useMemo(() => {
    const { componentSearch, eventFilter, paymentFilter } = filters;
    return componentRows.filter((row) => {
      const searchTerm = componentSearch?.toLowerCase() || "";
      const matchesSearch =
        !searchTerm ||
        `${row.awb || ""} ${row.order_id || ""} ${row.merchant_order_id || ""} ${row.seller || ""} ${row.component || ""}`
          .toLowerCase()
          .includes(searchTerm);
      const status = (row.shipment_status || row.event || "")
        .toLowerCase()
        .trim();
      const normalizedStatus = status.replace(/\s+/g, "_");
      const matchesEvent =
        eventFilter === "all" ||
        status === eventFilter.toLowerCase() ||
        normalizedStatus === eventFilter.toLowerCase();
      const payment = (row.payment_type || "").toLowerCase();
      const matchesPayment =
        paymentFilter === "all" || payment === paymentFilter.toLowerCase();
      return matchesSearch && matchesEvent && matchesPayment;
    });
  }, [componentRows, filters]);

  const selectedInvoiceCount = useMemo(() => {
    return invoiceRows.filter(
      (row) =>
        row.selected &&
        row.validation !== "Failed" &&
        row.submission !== "Success",
    ).length;
  }, [invoiceRows]);

  const netAmount = useMemo(() => {
    return invoiceRows
      .filter(
        (row) =>
          row.selected &&
          row.validation !== "Failed" &&
          row.submission !== "Success",
      )
      .reduce((sum, row) => sum + row.net, 0);
  }, [invoiceRows]);

  // ============================================================
  // EVENT HANDLERS
  // ============================================================

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      invoiceSearch: "",
      cycleFilter: "all",
      validationFilter: "all",
      submissionFilter: "all",
      componentSearch: "",
      eventFilter: "all",
      paymentFilter: "all",
      dateFrom: "",
      dateTo: "",
    });
  }, []);

  const toggleSellerSelection = useCallback((sellerId) => {
    setSelectedSellers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sellerId)) newSet.delete(sellerId);
      else newSet.add(sellerId);
      return newSet;
    });
  }, []);

  const selectAllSellers = useCallback(() => {
    if (!sellerCatalog.length) return toast.error("No sellers available.");
    setSelectedSellers(new Set(sellerCatalog.map((s) => s.id)));
    toast.success(`All ${sellerCatalog.length} sellers selected`);
  }, [sellerCatalog]);

  const clearAllSellers = useCallback(() => {
    setSelectedSellers(new Set());
    toast("All sellers deselected");
  }, []);

  const openDrawer = useCallback(
    async (row) => {
      if (!row) return;
      setCurrentDrawerRow(row);
      setIsDrawerOpen(true);

      const cachedDetail = invoiceDetailsMap[row.invoiceId];
      if (cachedDetail) {
        setInvoiceDetail(cachedDetail);
        setDrawerComponents(cachedDetail.shipments || []);
      } else {
        setInvoiceDetail(null);
        setDrawerComponents([]);
        setMerchantDetail(null);
        setMerchantBillingCycle(null);
        setBillingCycleHistory([]);
        await Promise.allSettled([
          row.invoiceId ? loadInvoiceDetail(row.invoiceId) : Promise.resolve(),
          row.sellerId ? loadMerchantDetail(row.sellerId) : Promise.resolve(),
        ]);
      }
    },
    [invoiceDetailsMap, loadInvoiceDetail, loadMerchantDetail],
  );

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setCurrentDrawerRow(null);
  }, []);

  const activateTab = useCallback((tab) => setActiveTab(tab), []);

  // ============================================================
  // EFFECTS
  // ============================================================

  // Add after filteredComponents useMemo
  const filteredMerchants = useMemo(() => {
    if (!merchantSearchTerm.trim()) return sellerCatalog;

    const search = merchantSearchTerm.toLowerCase().trim();
    return sellerCatalog.filter(
      (seller) =>
        seller.name.toLowerCase().includes(search) ||
        String(seller.id).toLowerCase().includes(search),
    );
  }, [sellerCatalog, merchantSearchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    if (view !== "preview") {
      setFailedFetched(false);
    }
  }, [view]);

  useEffect(() => {
    const initData = async () => {
      await Promise.all([
        loadDashboard(),
        loadMerchants({ page: 1, limit: 20 }),
        loadInvoices({ page: 1, limit: 20 }),
      ]);
    };
    initData();
  }, [loadDashboard, loadMerchants, loadInvoices]);

  useEffect(() => {
    if (view === "preview") loadCreditNotes({ page: 1, limit: 20 });
  }, [view, loadCreditNotes]);

  useEffect(() => {
    if (view === "preview" && activeTab === "failed") loadFailedGenerations();
  }, [activeTab, view, loadFailedGenerations]);

  useEffect(() => {
    if (activeTab === "activity" && batchId) loadGenerationLogs();
  }, [activeTab, view, batchId, loadGenerationLogs]);

  useEffect(() => {
    setComponentsFetched(false);
  }, [invoiceRows]);

  useEffect(() => {
    if (view === "preview" && !failedFetched) {
      loadFailedGenerations().then(() => setFailedFetched(true));
    }
  }, [view, loadFailedGenerations, failedFetched, failedPage, failedLimit]);

  // ============================================================
  // AUTO-LOAD ALL DATA ON STEP 1 MOUNT
  // ============================================================
  useEffect(() => {
    if (view === "setup") {
      Promise.all([
        loadCreditNotes({ page: 1, limit: 20 }),
        loadFailedGenerations(1, 10),
      ]);
    }
  }, [view, loadCreditNotes, loadFailedGenerations]);

  // ============================================================
  // STYLES
  // ============================================================

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      .animate-spin { animation: spin 1.2s linear infinite; }
      .animate-pulse { animation: pulse 1.5s ease-in-out infinite; }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  // ============================================================
  // INIT: Load everything on first mount (parallel, fast)
  // ============================================================
  useEffect(() => {
    const initData = async () => {
      await Promise.allSettled([
        loadDashboard(),
        loadMerchants({ page: 1, limit: 20 }),
        loadInvoices({ page: 1, limit: 20 }),
        loadSetupInvoices({ page: 1, limit: 20 }),
        loadSetupCreditNotes(),
        loadSetupFailedGenerations(1, 20),
        loadSetupActivity(),
      ]);

      // Components need invoices first, so run after
      await loadSetupComponents();
    };
    initData();
  }, [
    loadDashboard,
    loadMerchants,
    loadInvoices,
    loadSetupInvoices,
    loadSetupCreditNotes,
    loadSetupFailedGenerations,
    loadSetupActivity,
    loadSetupComponents,
  ]);

  // ============================================================
  // RENDER DRAWER
  // ============================================================

  const renderDrawer = useCallback(() => {
    if (!isDrawerOpen) return null;

    const row = currentDrawerRow;
    if (!row) return null;

    const invoice = invoiceDetail?.invoice || row;
    const shipments = drawerComponents || [];
    const charges = invoiceDetail?.charges || [];
    const transactions = invoiceDetail?.transactions || [];

    const visibleShipments = showAllShipments
      ? shipments
      : shipments.slice(0, 10);
    const hasMoreShipments = shipments.length > 10;
    const remainingShipments = shipments.length - 10;

    const visibleTransactions = showAllTransactions
      ? transactions
      : transactions.slice(0, 10);
    const hasMoreTransactions = transactions.length > 10;

    const getPaymentStatusDisplay = () => {
      if (invoice?.invoice_type === "credit_note") {
        return {
          label: "Credit Note",
          color: "bg-purple-100 text-purple-700 border-purple-300",
        };
      }
      const billingType =
        merchantDetail?.merchant?.billing_type ||
        invoice?.billing_type ||
        row?.billing_type ||
        "";
      if (billingType?.toLowerCase() === "prepaid") {
        return {
          label: "Prepaid",
          color: "bg-blue-100 text-blue-700 border-blue-300",
        };
      }
      if (invoice?.payment_status === "paid") {
        return {
          label: "Paid ",
          color: "bg-green-100 text-green-700 border-green-300",
        };
      }
      return {
        label: "Due",
        color: "bg-amber-100 text-amber-700 border-amber-300",
      };
    };

    const paymentStatus = getPaymentStatusDisplay();

    return (
      <div className="fixed inset-0 z-50 flex">
        <div
          className="flex-1 bg-black/40 backdrop-blur-sm"
          onClick={closeDrawer}
        />
        <div className="w-[700px] max-w-[95vw] h-full bg-white shadow-2xl overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-[#0446DB] to-[#1a5cff] p-5 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Invoice Details</h2>
              <p className="text-white/70 text-sm mt-0.5">
                {invoice?.invoice_number || row?.key || "N/A"}
              </p>
            </div>
            <button
              onClick={closeDrawer}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors text-2xl hover:rotate-90 duration-300"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-5">
            {detailLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Invoice Info Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">
                        Invoice Number
                      </span>
                      <p className="font-bold text-sm text-blue-600 mt-0.5">
                        {invoice?.invoice_number || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">
                        Type
                      </span>
                      <p className="font-bold text-sm mt-0.5">
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs font-bold ${invoice?.invoice_type === "credit_note" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                        >
                          {invoice?.invoice_type === "credit_note"
                            ? "Credit Note"
                            : "Invoice"}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">
                        Status
                      </span>
                      <p className="mt-0.5">
                        {statusMarkup(invoice?.status || row?.status)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">
                        Payment
                      </span>
                      <p className="mt-0.5">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-bold border ${paymentStatus.color}`}
                        >
                          {paymentStatus.label}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Period & Amount Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                    <span className="text-xs text-blue-600 uppercase tracking-wider">
                      Period
                    </span>
                    <p className="font-bold text-sm mt-0.5 text-blue-800">
                      {invoice?.period_start && invoice?.period_end
                        ? `${formatDate(invoice.period_start)} – ${formatDate(invoice.period_end)}`
                        : row?.period || "N/A"}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl border border-green-200 p-4">
                    <span className="text-xs text-green-600 uppercase tracking-wider">
                      Billing Cycle
                    </span>
                    <p className="font-bold text-sm mt-0.5 text-green-800">
                      {invoice?.billing_cycle_days || row?.cycle || "N/A"} days
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
                    <span className="text-xs text-purple-600 uppercase tracking-wider">
                      Generated
                    </span>
                    <p className="font-bold text-sm mt-0.5 text-purple-800">
                      {formatDate(
                        invoice?.generation_date ||
                          row?.generation_date ||
                          row?.created_at,
                      )}
                    </p>
                  </div>
                </div>

                {/* Tax Amount Breakdown */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-sm text-gray-700 mb-3">
                    Amount Breakdown
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                      <span className="text-xs text-gray-500">Taxable</span>
                      <p className="font-bold text-sm mt-0.5">
                        {formatMoney(invoice?.taxable_amount || 0)}
                      </p>
                    </div>
                    {invoice?.gst_type === "intra_state" ? (
                      <>
                        <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                          <span className="text-xs text-orange-600">CGST</span>
                          <p className="font-bold text-sm mt-0.5 text-orange-700">
                            {formatMoney(invoice?.cgst_amount || 0)}
                          </p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                          <span className="text-xs text-blue-600">SGST</span>
                          <p className="font-bold text-sm mt-0.5 text-blue-700">
                            {formatMoney(invoice?.sgst_amount || 0)}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                        <span className="text-xs text-purple-600">IGST</span>
                        <p className="font-bold text-sm mt-0.5 text-purple-700">
                          {formatMoney(invoice?.igst_amount || 0)}
                        </p>
                      </div>
                    )}
                    <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                      <span className="text-xs text-green-600">Total</span>
                      <p className="font-bold text-sm mt-0.5 text-green-700">
                        {formatMoney(invoice?.total_amount || 0)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Merchant Details - with Custom Invoice button */}
                {merchantDetail && (
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-blue-700 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        Merchant Details
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Name</span>
                        <p className="font-semibold">
                          {merchantDetail?.merchant?.name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">ID</span>
                        <p className="font-semibold">
                          {merchantDetail?.merchant?.merchant_id || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">GST</span>
                        <p className="font-semibold">
                          {merchantDetail?.merchant?.gst_number}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">State</span>
                        <p className="font-semibold">
                          {merchantDetail?.merchant?.state || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Billing Type</span>
                        <p
                          className={`font-semibold ${merchantDetail?.merchant?.billing_type === "postpaid" ? "text-red-600" : "text-green-600"}`}
                        >
                          {merchantDetail?.merchant?.billing_type || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Wallet Balance</span>
                        <p className="font-semibold">
                          {formatMoney(
                            merchantDetail?.merchant?.wallet_balance || 0,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* {shipments.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-sm flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                        Shipments ({shipments.length})
                      </h3>
                      <span className="text-xs text-gray-400">
                        {showAllShipments
                          ? `All ${shipments.length}`
                          : `Showing ${Math.min(shipments.length, 10)} of ${shipments.length}`}
                      </span>
                    </div>
                    <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                      {visibleShipments.map((shipment, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-sm text-blue-600">
                                  {shipment.awb_number || "N/A"}
                                </span>
                                {shipment.shipment_status && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                                    {shipment.shipment_status}
                                  </span>
                                )}
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${Number(shipment.total_amount) >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                >
                                  {formatMoney(shipment.total_amount || 0)}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mt-1">
                                <span>Order: {shipment.order_id || "N/A"}</span>
                                <span>
                                  Courier: {shipment.courier || "N/A"}
                                </span>
                                <span>
                                  Weight: {shipment.charged_weight || 0} kg
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {hasMoreShipments && (
                      <button
                        onClick={() => setShowAllShipments(!showAllShipments)}
                        className="mt-3 w-full py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 flex items-center justify-center gap-2"
                      >
                        {showAllShipments ? (
                          <>Show Less</>
                        ) : (
                          <>Show {remainingShipments} More</>
                        )}
                      </button>
                    )}
                  </div>
                )} */}

                {/* Charges Breakdown */}
                {charges.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      Charge Breakdown
                    </h3>
                    <div className="space-y-1 text-sm bg-gray-50 rounded-lg p-3 border border-gray-200">
                      {charges.map((charge, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between py-1.5 border-b border-gray-100 last:border-0"
                        >
                          <span className="capitalize text-gray-600">
                            {charge.charge_type?.replace(/_/g, " ")}
                            <span className="text-xs text-gray-400 ml-2">
                              ({charge.transaction_count || 0} txns)
                            </span>
                          </span>
                          <span
                            className={`font-medium ${Number(charge.net_amount) >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {formatMoney(charge.net_amount || 0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Transactions */}
                {/* {transactions.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-sm flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Transactions ({transactions.length})
                      </h3>
                      <span className="text-xs text-gray-400">
                        {showAllTransactions
                          ? `All ${transactions.length}`
                          : `Showing ${Math.min(transactions.length, 10)} of ${transactions.length}`}
                      </span>
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                      {visibleTransactions.map((txn, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center py-1.5 px-2 bg-gray-50 rounded border border-gray-100 text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded ${txn.txn_type === "debit" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
                            >
                              {txn.txn_type || "N/A"}
                            </span>
                            <span className="font-mono text-xs text-gray-600">
                              {txn.awb_number || "N/A"}
                            </span>
                            <span className="text-xs text-gray-400">
                              {txn.charge_type || "unclassified"}
                            </span>
                          </div>
                          <span
                            className={`font-bold text-sm ${txn.txn_type === "debit" ? "text-red-600" : "text-green-600"}`}
                          >
                            {formatMoney(txn.amount || 0)}
                          </span>
                        </div>
                      ))}
                    </div>
                    {hasMoreTransactions && (
                      <button
                        onClick={() =>
                          setShowAllTransactions(!showAllTransactions)
                        }
                        className="mt-3 w-full py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 flex items-center justify-center gap-2"
                      >
                        {showAllTransactions ? (
                          <>Show Less</>
                        ) : (
                          <>Show {transactions.length - 10} More</>
                        )}
                      </button>
                    )}
                  </div>
                )} */}

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                  {row?.validation === "Failed" && row?.invoiceId && (
                    <button
                      onClick={() => handleRegenerate(row.invoiceId)}
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      {isLoading ? "..." : "Regenerate"}
                    </button>
                  )}
                  {row?.invoiceId && (
                    <div className="flex flex-wrap justify-center sm:justify-end gap-2 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleDownloadPdf(row.invoiceId)}
                        disabled={isLoading}
                        className="px-4 sm:px-10 py-2 sm:py-3 bg-purple-600 text-white text-xs sm:text-sm font-bold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-1.5 sm:gap-2 cursor-pointer"
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        PDF
                      </button>

                      <button
                        onClick={() => handleExport("shipments", row.invoiceId)}
                        disabled={exportingInvoice}
                        className="px-4 sm:px-10 py-2 sm:py-3 bg-gray-600 text-white text-xs sm:text-sm font-bold rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-1.5 sm:gap-2 cursor-pointer"
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        {exportingInvoice ? "..." : "CSV"}
                      </button>

                      <button
                        onClick={closeDrawer}
                        className="px-4 sm:px-10 py-2 sm:py-3 bg-[#0446DB] text-white text-xs sm:text-sm font-bold rounded-lg hover:bg-[#0f52ec] transition-colors disabled:opacity-50 flex items-center gap-1.5 sm:gap-2 cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }, [
    isDrawerOpen,
    currentDrawerRow,
    invoiceDetail,
    drawerComponents,
    merchantDetail,
    showAllShipments,
    showAllTransactions,
    detailLoading,
    isLoading,
    exportingInvoice,
    closeDrawer,
    handleRegenerate,
    handleDownloadPdf,
    handleExport,
    openCustomInvoiceModal,
  ]);

  // ============================================================
  // RENDER - SETUP VIEW
  // ============================================================

  if (view === "setup") {
    const dueSellers15 = invoiceRows.filter((r) => r.cycle === "15-day").length;
    const dueSellers30 = invoiceRows.filter((r) => r.cycle === "30-day").length;

    return (
      <>

        <div className="flex flex-col sm:flex-row justify-between gap-4  p-4 sm:p-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-bold dark:text-white">
                Generate Seller Invoices
              </h1>
              <button className="w-7 h-7 sm:w-8 sm:h-8 border border-white/40 rounded-full bg-white text-[#0446DB] text-sm sm:text-base font-extrabold relative group flex items-center justify-center hover:border-white transition-colors">
                ?
                <span
                  className="
      invisible opacity-0
      group-hover:visible group-hover:opacity-100
      group-focus-within:visible group-focus-within:opacity-100
      
      /* 📱 Mobile: Fixed centered on screen */
      fixed sm:absolute
      left-1/2 -translate-x-1/2
      top-24 sm:top-[calc(100%+12px)]
      
      z-50
      w-[260px] sm:w-[280px]
      max-w-[85vw]
      bg-[#12263f] dark:text-white
      rounded-lg p-3 sm:p-4
      text-[11px] sm:text-sm
      shadow-xl
      transition-all duration-200
      pointer-events-none
      text-center
      leading-snug
    "
                >
                  Only closed billing periods are considered for invoice
                  generation.
                  <span className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-b-[#12263f]"></span>
                </span>
              </button>
            </div>
            <p className="dark:text-white/75 text-sm sm:text-base mt-1 sm:mt-2">
              Create invoices from eligible unbilled AWB components based on
              each seller's billing cycle.
            </p>
          </div>
          <div className="flex justify-end">
            {/* Business Date - Only shows on tablet+ (sm+) */}
            <div className="hidden sm:block text-right sm:pl-6 sm:border-l border-white/30">
              <span className="block dark:text-white/65 text-xs tracking-widest font-extrabold uppercase">
                Business Date
              </span>
              <strong className="block mt-1.5 text-sm sm:text-base dark:text-white">
                {generationDate}
              </strong>
            </div>

            {/* Step Badge - Only shows on phone (< 640px) */}
            <div className="sm:hidden whitespace-nowrap px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold h-fit">
              Step 1 of 2
            </div>
          </div>
        </div>

        <div className="min-h-screen bg-gray-50 font-sans text-base text-[#12263f] p-4 sm:p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            {/* Setup Card */}
            <article className="order-2 lg:order-1 bg-white border border-[#dfe5ec] rounded-[12px] shadow-sm p-6 sm:p-8 md:p-10">
              <div className="flex flex-col sm:flex-row justify-between gap-4 pb-6 border-b border-[#edf1f5]">
                <div>
                  <span className="block text-[#78869a] text-xs tracking-widest font-extrabold uppercase">
                    New Billing Run
                  </span>
                  <h2 className="text-2xl sm:text-3xl tracking-[-0.3px] my-2">
                    Invoice generation setup
                  </h2>
                  <p className="text-[#66758a] text-sm sm:text-base">
                    Choose the billing scope. The system will reserve eligible
                    components before preparing a preview.
                  </p>
                </div>
                <div className="hidden sm:block whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-blue-50 text-blue-600 text-xs sm:text-sm font-bold h-fit">
                  Step 1 of 2
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-7">
                {/* Invoice date + custom action */}
                <div>
                  <label className="block text-[#12263f] font-bold text-sm mb-2.5">
                    Invoice date
                  </label>
                  <div className="h-12 flex items-center gap-3 border border-[#dfe5ec] bg-[#f8fafc] rounded-lg px-4">
                    <span className="text-sm text-[#12263f] font-medium">
                      {generationDate}
                    </span>
                    <button
                      type="button"
                      onClick={() => openCustomInvoiceModal(null, "setup")}
                      className="ml-auto text-sm font-bold text-blue-600 hover:text-blue-700  flex items-center gap-1.5 cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Custom invoice
                    </button>
                  </div>
                  <small className="block text-[#66758a] text-sm mt-1.5 min-h-[40px]">
                    Captured when the billing run is generated and retained as
                    the invoice date.
                  </small>
                </div>

                {/* Billing scope */}
                <div>
                  <label className="block text-[#12263f] font-bold text-sm mb-2.5">
                    Billing scope
                  </label>
                  <div
                    role="group"
                    aria-label="Billing scope"
                    className="grid grid-cols-2 p-1 border border-[#dfe5ec] bg-[#f2f5f8] rounded-lg"
                  >
                    {[
                      { key: "all", label: "All Invoice Summary" },
                      { key: "selected", label: "Selected sellers" },
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={scope === key}
                        onClick={() => {
                          setScope(key);
                          if (key === "all") setSelectedSellers(new Set());
                        }}
                        className={`h-10 rounded-md text-sm font-bold transition-colors cursor-pointer ${
                          scope === key
                            ? "bg-white text-blue-600 shadow-sm ring-1 ring-blue-100"
                            : "bg-transparent text-[#66758a] hover:text-[#12263f]"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <small className="block text-[#66758a] text-sm mt-1.5 min-h-[40px]">
                    {scope === "all"
                      ? `Invoice periods across ${sellerCatalog.length} seller accounts are currently due.`
                      : "Choose one or more seller accounts with a closed billing period."}
                  </small>
                </div>
              </div>

              {scope === "selected" && (
                <div className="mt-6 p-4 sm:p-6 bg-[#f8fafc] border border-[#dfe5ec] rounded-lg">
                  <label className="block text-[#12263f] font-bold text-sm mb-2.5">
                    Select seller accounts
                  </label>
                  <div className="max-w-[450px] h-11 flex items-center border border-[#dfe5ec] rounded-lg bg-white px-3 text-[#66758a]">
                    <span className="text-lg">⌕</span>
                    <input
                      type="search"
                      placeholder="Search by seller ID or name"
                      className="w-full border-0 outline-none px-2 text-base"
                      onChange={(e) => {
                        const query = e.target.value.toLowerCase();
                        document
                          .querySelectorAll(".seller-option")
                          .forEach((opt) => {
                            opt.style.display = (
                              opt.dataset.search || ""
                            ).includes(query)
                              ? "flex"
                              : "none";
                          });
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 max-h-[214px] overflow-auto pr-1">
                    {sellerCatalog.map((seller) => (
                      <label
                        key={seller.id}
                        className={`seller-option flex items-center gap-3 border rounded-lg p-3 bg-white cursor-pointer transition-all ${
                          selectedSellers.has(seller.id)
                            ? "border-blue-600 bg-blue-50 shadow-sm"
                            : "border-[#dfe5ec] hover:border-blue-300 hover:shadow-sm"
                        }`}
                        data-search={`${seller.id} ${seller.name}`.toLowerCase()}
                        onClick={() => toggleSellerSelection(seller.id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSellers.has(seller.id)}
                          readOnly
                          className="accent-blue-600 w-4 h-4"
                        />
                        <div className="min-w-0 flex-1">
                          <strong className="block text-sm truncate">
                            {seller.name}
                          </strong>
                          <small className="block text-[#66758a] text-xs mt-0.5">
                            {seller.id}
                          </small>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-md text-xs font-extrabold ${seller.cycle === "15-day" ? "bg-blue-50 text-blue-600" : "bg-violet-50 text-violet-600"}`}
                        >
                          {seller.cycle}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-3 pt-3 border-t border-[#dfe5ec]">
                    <strong className="text-sm">
                      {selectedSellers.size} seller
                      {selectedSellers.size !== 1 ? "s" : ""} selected
                    </strong>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1.5 rounded-md border border-[#cfd8e3] bg-white text-[#243c57] text-xs font-bold hover:bg-gray-50 cursor-pointer"
                        onClick={selectAllSellers}
                        disabled={!sellerCatalog.length}
                      >
                        Select All
                      </button>
                      <button
                        className="px-3 py-1.5 rounded-md border border-[#cfd8e3] bg-white text-red-600 text-xs font-bold hover:bg-red-50 cursor-pointer"
                        onClick={clearAllSellers}
                        disabled={!selectedSellers.size}
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                {[
                  {
                    label: "15-day billing merchants",
                    count: dueSellers15,
                    color: "bg-blue-50 text-blue-600",
                    icon: "15",
                  },
                  {
                    label: "30-day billing merchants",
                    count: dueSellers30,
                    color: "bg-violet-50 text-violet-600",
                    icon: "30",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-[#dfe5ec] rounded-xl p-5 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`hidden sm:flex w-10 h-10 items-center justify-center rounded-lg ${item.color} text-base font-extrabold`}
                      >
                        {item.icon}
                      </span>
                      <div>
                        <span className="block text-[#66758a] text-xs font-medium">
                          {item.label}
                        </span>
                        <strong className="block text-sm">
                          {item.count || "No invoices"}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
                {[
                  {
                    label: "Total Merchants",
                    value: dashboardData?.merchants?.total ?? 0,
                    icon: "M",
                    color: "bg-blue-50 text-blue-600",
                  },
                  {
                    label: "Active Merchants",
                    value: dashboardData?.merchants?.active ?? 0,
                    icon: "A",
                    color: "bg-emerald-50 text-emerald-600",
                  },
                  {
                    label: "Prepaid Merchants",
                    value: dashboardData?.merchants?.prepaid ?? 0,
                    icon: "P",
                    color: "bg-cyan-50 text-cyan-600",
                  },
                  {
                    label: "Postpaid Merchants",
                    value: dashboardData?.merchants?.postpaid ?? 0,
                    icon: "P",
                    color: "bg-violet-50 text-violet-600",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 min-h-[72px] rounded-xl border border-[#dfe5ec] bg-white"
                  >
                    <span
                      className={`hidden sm:flex w-10 h-10 flex-shrink-0 items-center justify-center rounded-lg ${item.color} text-base font-extrabold`}
                    >
                      {item.icon}
                    </span>
                    <div>
                      <small className="block text-[#66758a] text-xs">
                        {item.label}
                      </small>
                      <strong className="block mt-1 text-base">
                        {item.value}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 mt-6 border-t border-[#edf1f5]">
                <button
                  className="h-[46px] px-6 rounded-lg border border-[#cfd8e3] bg-white text-[#243c57] text-sm font-bold whitespace-nowrap transition-all hover:-translate-y-0.5 hover:shadow-sm hover:bg-[#0446DB] hover:text-white disabled:opacity-50 cursor-pointer"
                  onClick={() => setIsRulesModalOpen(true)}
                >
                  View billing rules
                </button>

                {/* NEW: Custom Invoice Button */}

                <button
                  className="h-[46px] px-8 rounded-lg border border-blue-600 bg-blue-600 text-white text-sm font-bold whitespace-nowrap shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  onClick={runGeneration}
                  disabled={
                    isGenerating ||
                    isLoading ||
                    (scope === "selected" && selectedSellers.size === 0)
                  }
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Generating invoices…
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                      {scope === "all"
                        ? "Generate All Invoices"
                        : selectedSellers.size === 0
                          ? "Select sellers first"
                          : `Generate Invoice for ${selectedSellers.size} seller${selectedSellers.size > 1 ? "s" : ""}`}
                    </>
                  )}
                </button>
              </div>
            </article>

            {/* Estimated Billing Value Card */}
            <aside className="order-1 lg:order-2 grid grid-cols-1 gap-6">
              <article className="bg-white border border-[#dfe5ec] rounded-[12px] shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#12263f] text-sm font-bold uppercase tracking-wider">
                    Estimated Billing Value
                  </span>
                  <button
                    onClick={handleRefreshAll}
                    disabled={isRefreshing}
                    className="text-[#66758a] hover:text-[#0446DB] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isRefreshing ? (
                      <svg
                        className="w-5 h-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 4v6h6" />
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                      </svg>
                    )}
                  </button>
                </div>
                <h3 className="text-3xl sm:text-4xl tracking-[-0.5px] mt-2 font-extrabold text-[#12263f]">
                  {formatMoney(
                    dashboardData?.billing_documents?.net_billed_amount || 0,
                  )}
                </h3>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center py-2 border-t border-[#edf1f5]">
                    <span className="text-[#66758a] text-sm font-medium">
                      Total Debit
                    </span>
                    <strong className="text-[#12263f] text-base font-bold">
                      {formatMoney(
                        dashboardData?.wallet_ledger?.total_debit || 0,
                      )}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-[#edf1f5]">
                    <span className="text-[#66758a] text-sm font-medium">
                      Total Credit
                    </span>
                    <strong className="text-[#12263f] text-base font-bold">
                      {formatMoney(
                        dashboardData?.wallet_ledger?.total_credit || 0,
                      )}
                    </strong>
                  </div>
                </div>
              </article>
            </aside>
          </div>

          {/* Rules Modal */}
          {isRulesModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="w-[min(580px,calc(100vw-30px))] max-h-[calc(100vh-36px)] overflow-auto bg-white border border-[#dfe5ec] rounded-[12px] shadow-lg">
                <div className="flex justify-between items-start gap-4 p-5 border-b border-[#dfe5ec]">
                  <div>
                    <span className="block text-[#78869a] text-xs tracking-widest font-extrabold uppercase">
                      Billing Policy
                    </span>
                    <h2 className="text-2xl mt-1.5">Seller billing rules</h2>
                  </div>
                  <button
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#dfe5ec] bg-white text-[#66758a] text-2xl hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                    onClick={() => setIsRulesModalOpen(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    {
                      title: "15-day billing",
                      desc: "Invoices cover the 1st–15th and the 16th–last day of each month.",
                      icon: "15",
                      color: "bg-blue-50 text-blue-600",
                    },
                    {
                      title: "30-day billing",
                      desc: "Invoices cover the configured monthly cycle. Default closes on last day of month.",
                      icon: "30",
                      color: "bg-violet-50 text-violet-600",
                    },
                    {
                      title: "RTO COD reversal",
                      desc: "For RTO shipments, original COD fee remains visible and a separate credit line reverses it.",
                      icon: "↩",
                      color: "bg-amber-50 text-amber-600",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3.5 p-4 border border-[#dfe5ec] rounded-lg"
                    >
                      <span
                        className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg ${item.color} text-base font-extrabold`}
                      >
                        {item.icon}
                      </span>
                      <div>
                        <h3 className="text-base my-0.5">{item.title}</h3>
                        <p className="text-[#66758a] text-sm leading-4">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2.5 p-4 border-t border-[#dfe5ec] bg-[#fafbfd] rounded-b-[12px]">
                  <button
                    className="h-[46px] px-6 rounded-lg border border-blue-600 bg-blue-600 text-white text-sm font-bold whitespace-nowrap shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 cursor-pointer"
                    onClick={() => setIsRulesModalOpen(false)}
                  >
                    Understood
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CUSTOM INVOICE MODAL */}
          {customInvoiceModal.isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-[2px] p-4">
              <div className="w-full max-w-[620px] max-h-[calc(100vh-32px)] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-200">
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <h2 className="text-[22px] leading-7 font-bold text-slate-900">
                        Generate Custom Invoice
                      </h2>
                      {/* Close */}
                      <button
                        type="button"
                        onClick={closeCustomInvoiceModal}
                        disabled={customGenerating}
                        className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-red-500 hover:text-white transition disabled:opacity-50 cursor-pointer"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 6l12 12M18 6L6 18"
                          />
                        </svg>
                      </button>
                    </div>

                    {customInvoiceModal.source === "drawer" ? (
                      <p className="mt-1 text-sm text-slate-500">
                        Merchant ID:{" "}
                        <span className="font-semibold text-slate-700">
                          {customInvoiceModal.merchantId}
                        </span>
                      </p>
                    ) : (
                      /* Merchant Selector */
                      <div className="mt-5">
                        <label className="block text-sm font-bold text-slate-800 mb-2">
                          Select Merchant
                        </label>

                        <div className="relative">
                          {/* Search Box */}
                          <div
                            className={`relative flex items-center w-full h-12 rounded-xl border transition-all ${
                              customInvoiceModal.merchantId
                                ? "border-blue-300 bg-blue-50/40"
                                : "border-slate-300 bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10"
                            }`}
                          >
                            <svg
                              className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0z"
                              />
                            </svg>

                            <input
                              type="text"
                              placeholder="Search merchant by name or ID..."
                              value={merchantSearchTerm}
                              onChange={(e) =>
                                setMerchantSearchTerm(e.target.value)
                              }
                              className="w-full h-full pl-11 pr-11 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400 rounded-xl"
                            />

                            {merchantSearchTerm && (
                              <button
                                type="button"
                                onClick={() => setMerchantSearchTerm("")}
                                className="absolute right-3 flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 6l12 12M18 6L6 18"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>

                          {/* Merchant List */}
                          <div className="mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="max-h-[220px] overflow-y-auto">
                              {filteredMerchants.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 px-4">
                                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 mb-2">
                                    <svg
                                      className="w-5 h-5 text-slate-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0z"
                                      />
                                    </svg>
                                  </div>

                                  <p className="text-sm font-semibold text-slate-700">
                                    No merchants found
                                  </p>

                                  <p className="text-xs text-slate-400 mt-1">
                                    Try searching with another name or merchant
                                    ID
                                  </p>
                                </div>
                              ) : (
                                filteredMerchants.map((seller) => {
                                  const isSelected =
                                    customInvoiceModal.merchantId === seller.id;

                                  return (
                                    <button
                                      key={seller.id}
                                      type="button"
                                      onClick={() => {
                                        setCustomInvoiceModal((prev) => ({
                                          ...prev,
                                          merchantId: seller.id,
                                        }));
                                        setMerchantSearchTerm("");
                                      }}
                                      className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-slate-100 last:border-b-0 transition-all cursor-pointer ${
                                        isSelected
                                          ? "bg-blue-50"
                                          : "hover:bg-slate-50"
                                      }`}
                                    >
                                      {/* Merchant Avatar */}
                                      <div
                                        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                                          isSelected
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-slate-100 text-slate-600"
                                        }`}
                                      >
                                        {seller.name
                                          ?.charAt(0)
                                          ?.toUpperCase() || "M"}
                                      </div>

                                      {/* Merchant Details */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <p className="text-sm font-semibold text-slate-800 truncate">
                                            {seller.name}
                                          </p>

                                          {seller.billing_mode === "custom" && (
                                            <span className="flex-shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-bold">
                                              Custom
                                            </span>
                                          )}
                                        </div>

                                        <div className="flex items-center gap-2 mt-0.5">
                                          <span className="text-xs text-slate-500">
                                            ID: {seller.id}
                                          </span>

                                          <span className="w-1 h-1 rounded-full bg-slate-300" />

                                          <span className="text-xs text-slate-500">
                                            {seller.cycle}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Selected Indicator */}
                                      {isSelected ? (
                                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                                          <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                        </div>
                                      ) : (
                                        <svg
                                          className="flex-shrink-0 w-4 h-4 text-slate-300"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m9 18 6-6-6-6"
                                          />
                                        </svg>
                                      )}
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          </div>

                          {customInvoiceModal.merchantId && (
                            <div className="mt-2 w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-blue-50 border border-blue-100">
                              <div className="flex items-center gap-2 text-xs font-medium text-blue-700 min-w-0">
                                <svg
                                  className="w-4 h-4 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>

                                <span className="truncate">
                                  Merchant selected successfully
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setCustomInvoiceModal((prev) => ({
                                    ...prev,
                                    merchantId: "",
                                  }));
                                  setMerchantSearchTerm("");
                                }}
                                className="flex items-center gap-1.5 flex-shrink-0 px-2.5 py-1.5 rounded-md text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                              >
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 6l12 12M18 6L6 18"
                                  />
                                </svg>
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                  {/* Date Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">
                          Invoice Period
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Select the billing period for this invoice
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Start Date */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Start Date
                        </label>

                        <input
                          type="date"
                          value={customPeriodStart}
                          onChange={(e) => setCustomPeriodStart(e.target.value)}
                          min={
                            lastInvoicedThrough
                              ? new Date(
                                  new Date(lastInvoicedThrough).getTime() +
                                    86400000,
                                )
                                  .toISOString()
                                  .slice(0, 10)
                              : ""
                          }
                          className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm outline-none transition
                   hover:border-blue-400 hover:shadow-sm hover:bg-blue-50/30
                   focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                   cursor-pointer group-hover:cursor-pointer"
                        />

                        {lastInvoicedThrough && (
                          <p className="flex items-center gap-1.5 text-xs text-amber-600 mt-1.5">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16a2 2 0 001.73 3z"
                              />
                            </svg>
                            Must be after {formatDate(lastInvoicedThrough)}
                          </p>
                        )}
                      </div>

                      {/* End Date */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          End Date
                        </label>

                        <input
                          type="date"
                          value={customPeriodEnd}
                          onChange={(e) => setCustomPeriodEnd(e.target.value)}
                          min={customPeriodStart || ""}
                          className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm outline-none transition
                   hover:border-blue-400 hover:shadow-sm hover:bg-blue-50/30
                   focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                   cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 mt-6 pt-5 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={closeCustomInvoiceModal}
                      disabled={customGenerating}
                      className="w-full sm:w-auto h-11 px-5 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-bold hover:bg-red-500 hover:text-white transition disabled:opacity-50 cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleCustomInvoiceSubmit}
                      disabled={
                        customGenerating ||
                        !customPeriodStart ||
                        !customPeriodEnd ||
                        !customInvoiceModal.merchantId
                      }
                      className="w-full sm:w-auto h-11 px-6 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed  cursor-pointer"
                    >
                      {customGenerating ? (
                        <span className="flex items-center justify-center">
                          <span className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Generating...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Generate Invoice
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* ALREADY GENERATED INVOICES TABLE (Step 1 Bottom) */}
          {/* ============================================================ */}
          <div className="mt-8 bg-white border border-[#dfe5ec] rounded-[12px] shadow-sm overflow-hidden">
            {/* Tabs — using setupActiveTab */}
            <div className="flex gap-3 sm:gap-5 h-[60px] items-end px-4 sm:px-6 border-b border-[#dfe5ec] overflow-x-auto">
              {[
                {
                  id: "summary",
                  label: "Invoice Summary",
                  count: setupInvoiceRows.length,
                },
                {
                  id: "components",
                  label: "AWB Components",
                  count: setupComponentsFiltered.length,
                },
                {
                  id: "credit-notes",
                  label: "Credit Notes",
                  count: setupCreditNotes.length,
                },
                {
                  id: "failed",
                  label: "Failed Generations",
                  count: setupFailedTotal || setupFailedGenerations.length,
                },
                { id: "activity", label: "Activity Log" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`h-[60px] flex items-center gap-2 border-0 border-b-2 bg-transparent text-sm font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    setupActiveTab === tab.id
                      ? "text-blue-600 border-blue-600"
                      : "text-[#66758a] border-transparent hover:text-[#12263f]"
                  }`}
                  onClick={() => {
                    setSetupActiveTab(tab.id);
                    // Lazy load if data missing
                    if (tab.id === "credit-notes" && creditNotes.length === 0) {
                      loadCreditNotes({ page: 1, limit: 20 });
                    }
                    if (tab.id === "failed" && failedGenerations.length === 0) {
                      loadFailedGenerations(1, 10);
                    }
                  }}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs ${
                        tab.id === "failed" && tab.count > 0
                          ? "bg-red-100 text-red-700"
                          : "bg-[#edf1f5] text-[#65758a]"
                      }`}
                    >
                      {tab.count.toLocaleString()}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {setupActiveTab === "summary" && (
              <div>
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2 p-3 sm:p-4 border-b border-[#dfe5ec] bg-[#fafbfd]">
                  <label className="flex-1 sm:flex-initial sm:w-[200px] h-[38px] flex items-center px-3 border border-[#dfe5ec] rounded-lg bg-white">
                    <span className="text-lg">⌕</span>
                    <input
                      type="search"
                      placeholder="Search invoice, seller..."
                      className="flex-1 bg-transparent border-0 px-2.5 outline-none text-sm"
                      value={filters.invoiceSearch}
                      onChange={(e) =>
                        handleFilterChange("invoiceSearch", e.target.value)
                      }
                    />
                  </label>
                  <select
                    className="h-[38px] min-w-[110px] border border-[#dfe5ec] rounded-lg bg-white px-3 text-sm"
                    value={filters.cycleFilter}
                    onChange={(e) =>
                      handleFilterChange("cycleFilter", e.target.value)
                    }
                  >
                    <option value="all">All cycles</option>
                    <option value="15-day">15-day</option>
                    <option value="30-day">30-day</option>
                  </select>
                  <select
                    className="h-[38px] min-w-[110px] border border-[#dfe5ec] rounded-lg bg-white px-3 text-sm"
                    value={filters.paymentFilter}
                    onChange={(e) =>
                      handleFilterChange("paymentFilter", e.target.value)
                    }
                  >
                    <option value="all">All payment</option>
                    <option value="due">Due</option>
                    <option value="paid">Paid</option>
                    <option value="creditNote">Credit Note</option>
                  </select>
                  <button
                    className="h-[38px] px-3 rounded-lg text-[#66758a] text-sm font-bold hover:bg-[#0446DB] hover:text-white cursor-pointer"
                    onClick={resetFilters}
                  >
                    Reset
                  </button>
                </div>

                {/* Table */}
                <div className="w-full overflow-x-auto">
                  <table className="w-full border-collapse min-w-[1200px]">
                    <thead>
                      <tr>
                        {[
                          { label: "Invoice", align: "left" },
                          { label: "Seller", align: "left" },
                          { label: "Type", align: "left" },
                          { label: "Cycle", align: "left" },
                          { label: "Period", align: "left" },
                          { label: "Taxable", align: "right" },
                          { label: "CGST", align: "right" },
                          { label: "SGST", align: "right" },
                          { label: "IGST", align: "right" },
                          { label: "Total", align: "right" },
                          { label: "Payment", align: "left" },
                          { label: "Action", align: "left" },
                        ].map((h, i) => (
                          <th
                            key={i}
                            className={`h-[40px] px-3 text-${h.align} border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider`}
                          >
                            {h.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginateData(getFilteredSetupInvoices()).length === 0 ? (
                        <tr>
                          <td
                            colSpan="12"
                            className="px-5 py-12 text-center text-[#66758a]"
                          >
                            <strong className="block text-[#12263f] text-base mb-1.5">
                              {invoiceRows.length === 0
                                ? "No invoices generated yet"
                                : "No invoice groups match these filters"}
                            </strong>
                            {invoiceRows.length > 0 && (
                              <button
                                onClick={resetFilters}
                                className="mt-2 px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                              >
                                Clear Filters
                              </button>
                            )}
                          </td>
                        </tr>
                      ) : (
                        paginateData(getFilteredSetupInvoices()).map(
                          (row, idx) => (
                            <tr
                              key={row.key || idx}
                              className="hover:bg-blue-50/60 transition-colors"
                            >
                              <td className="px-3 py-3 border-b border-[#edf1f5] text-sm">
                                <span
                                  className={`font-bold text-sm whitespace-nowrap ${
                                    row.invoiceType === "credit_note"
                                      ? "text-purple-600"
                                      : "text-blue-600"
                                  }`}
                                >
                                  {row.key || "N/A"}
                                </span>
                              </td>
                              <td className="px-3 py-3 border-b border-[#edf1f5] text-sm">
                                <span className="block text-[#12263f] font-bold text-sm">
                                  {row.seller || "N/A"}
                                </span>
                              </td>
                              <td className="px-3 py-3 border-b border-[#edf1f5] text-sm">
                                <span
                                  className={`px-3 py-1 rounded-md text-xs font-bold ${
                                    row.invoiceType === "credit_note"
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {row.invoiceType === "credit_note"
                                    ? "Credit Note"
                                    : "Invoice"}
                                </span>
                              </td>
                              <td className="px-3 py-3 border-b border-[#edf1f5] text-sm">
                                <span className="px-3 py-1 rounded-md bg-[#eef2f6] text-[#435671] text-xs font-bold">
                                  {row.cycle || "30-day"}
                                </span>
                              </td>
                              <td className="px-3 py-3 border-b border-[#edf1f5] text-sm">
                                <span className="block text-[#12263f] font-bold text-sm">
                                  {row.period || "N/A"}
                                </span>
                              </td>
                              <td className="px-3 py-3 border-b border-[#edf1f5] text-sm text-right font-mono">
                                {row.taxable_amount
                                  ? formatMoney(row.taxable_amount)
                                  : "—"}
                              </td>
                              <td className="px-3 py-3 border-b border-[#edf1f5] text-sm text-right font-mono text-orange-600">
                                {row.cgst_amount
                                  ? formatMoney(row.cgst_amount)
                                  : "—"}
                              </td>
                              <td className="px-3 py-3 border-b border-[#edf1f5] text-sm text-right font-mono text-blue-600">
                                {row.sgst_amount
                                  ? formatMoney(row.sgst_amount)
                                  : "—"}
                              </td>
                              <td className="px-3 py-3 border-b border-[#edf1f5] text-sm text-right font-mono text-purple-600">
                                {row.igst_amount
                                  ? formatMoney(row.igst_amount)
                                  : "—"}
                              </td>
                              <td className="px-3 py-3 border-b border-[#edf1f5] text-sm text-right font-mono font-extrabold whitespace-nowrap">
                                {formatMoney(row.total_amount || row.net || 0)}
                              </td>
                              <td className="px-3 py-3 border-b border-[#edf1f5] text-sm">
                                {row?.invoiceType === "credit_note" ? (
                                  <span className="px-3 py-1.5 rounded-lg text-xs font-medium border bg-purple-100 text-purple-700 border-purple-300">
                                    Credit Note
                                  </span>
                                ) : row?.billing_type?.toLowerCase() ===
                                  "prepaid" ? (
                                  <span className="px-3 py-1.5 rounded-lg text-xs font-medium border bg-blue-100 text-blue-700 border-blue-300">
                                    Prepaid
                                  </span>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newStatus =
                                        row.payment_status === "paid"
                                          ? "due"
                                          : "paid";
                                      handleUpdatePaymentStatus(
                                        row.invoiceId,
                                        newStatus,
                                      );
                                    }}
                                    disabled={updatingPaymentStatus.has(
                                      row.invoiceId,
                                    )}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                      row.payment_status === "paid"
                                        ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
                                        : "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200"
                                    } ${
                                      updatingPaymentStatus.has(row.invoiceId)
                                        ? "opacity-50 cursor-not-allowed"
                                        : "cursor-pointer hover:scale-105"
                                    }`}
                                  >
                                    {updatingPaymentStatus.has(
                                      row.invoiceId,
                                    ) ? (
                                      <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    ) : row.payment_status === "paid" ? (
                                      "Paid ✓"
                                    ) : (
                                      "Due"
                                    )}
                                  </button>
                                )}
                              </td>
                              <td className="px-3 py-3 border-b border-[#edf1f5] text-sm">
                                <button
                                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#dfe5ec] bg-white text-[#66758a] hover:bg-gray-50 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!row.invoiceId) {
                                      toast.error("Invoice ID not found");
                                      return;
                                    }
                                    openDrawer(row);
                                  }}
                                >
                                  •••
                                </button>
                              </td>
                            </tr>
                          ),
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {getFilteredSetupInvoices().length > 0 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t border-[#dfe5ec] bg-[#fafbfd]">
                    <span className="text-sm text-[#66758a]">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(
                        currentPage * itemsPerPage,
                        getFilteredSetupInvoices().length,
                      )}{" "}
                      of {getFilteredSetupInvoices().length} entries
                    </span>
                    <div className="flex gap-2">
                      <button
                        disabled={currentPage === 1}
                        onClick={() =>
                          setCurrentPage((p) => Math.max(p - 1, 1))
                        }
                        className="px-4 py-1.5 rounded-md border border-[#dfe5ec] bg-white text-sm font-bold disabled:opacity-50 hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-1.5 rounded-md bg-blue-600 text-white text-sm font-bold">
                        {currentPage}
                      </span>
                      <button
                        disabled={
                          currentPage ===
                          getTotalPages(getFilteredInvoices().length)
                        }
                        onClick={() =>
                          setCurrentPage((p) =>
                            Math.min(
                              p + 1,
                              getTotalPages(getFilteredInvoices().length),
                            ),
                          )
                        }
                        className="px-4 py-1.5 rounded-md border border-[#dfe5ec] bg-white text-sm font-bold disabled:opacity-50 hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {setupActiveTab === "components" && (
              <div>
                <div className="flex flex-wrap items-center gap-2 min-h-[60px] p-3 sm:p-4 border-b border-[#dfe5ec] bg-[#fafbfd]">
                  <label className="flex-1 sm:flex-initial sm:w-[220px] h-[38px] flex items-center px-3 border border-[#dfe5ec] rounded-lg bg-white text-[#66758a]">
                    <span className="text-lg mr-2">⌕</span>
                    <input
                      type="search"
                      placeholder="Search AWB, Order, Merchant..."
                      className="flex-1 bg-transparent border-0 px-2 outline-none text-[#12263f] text-sm"
                      value={filters.componentSearch}
                      onChange={(e) =>
                        handleFilterChange("componentSearch", e.target.value)
                      }
                    />
                    {filters.componentSearch && (
                      <button
                        onClick={() =>
                          handleFilterChange("componentSearch", "")
                        }
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    )}
                  </label>
                  <select
                    className="h-[38px] min-w-[140px] border border-[#dfe5ec] rounded-lg bg-white text-[#40536b] px-3 pr-8 text-sm cursor-pointer"
                    value={filters.eventFilter}
                    onChange={(e) =>
                      handleFilterChange("eventFilter", e.target.value)
                    }
                  >
                    <option value="all">All Status</option>
                    <option value="delivered">Delivered</option>
                    <option value="rto_delivered">RTO Delivered</option>
                    <option value="lost">Lost</option>
                  </select>
                  <select
                    className="h-[38px] min-w-[130px] border border-[#dfe5ec] rounded-lg bg-white text-[#40536b] px-3 pr-8 text-sm cursor-pointer"
                    value={filters.paymentFilter}
                    onChange={(e) =>
                      handleFilterChange("paymentFilter", e.target.value)
                    }
                  >
                    <option value="all">All Payment</option>
                    <option value="cod">COD</option>
                    <option value="prepaid">Prepaid</option>
                    <option value="creditNote">Credit Note</option>
                  </select>
                  <button
                    className="h-[38px] px-3 rounded-lg border border-[#dfe5ec] bg-white text-[#66758a] text-sm font-bold hover:bg-[#0446DB] hover:text-white transition-colors cursor-pointer"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        componentSearch: "",
                        eventFilter: "all",
                        paymentFilter: "all",
                      }))
                    }
                  >
                    Reset Filters
                  </button>
                  <span className="text-xs text-[#66758a] ml-auto">
                    {setupComponentsFiltered.length} results
                  </span>
                </div>

                {setupComponentsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <table className="w-full border-collapse min-w-[1200px]">
                      <thead>
                        <tr>
                          <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                            AWB
                          </th>
                          <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                            Courier
                          </th>
                          <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                            Status
                          </th>
                          <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                            Payment
                          </th>
                          <th className="h-[40px] px-3 text-right border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                            Weight
                          </th>
                          <th className="h-[40px] px-3 text-right border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                            Freight
                          </th>
                          <th className="h-[40px] px-3 text-right border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                            COD
                          </th>
                          <th className="h-[40px] px-3 text-right border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                            RTO
                          </th>
                          <th className="h-[40px] px-3 text-right border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                            Insurance
                          </th>
                          <th className="h-[40px] px-3 text-right border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                            Taxable
                          </th>
                          <th className="h-[40px] px-3 text-right border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginateData(setupComponentsFiltered).length === 0 ? (
                          <tr>
                            <td
                              colSpan="12"
                              className="px-5 py-12 text-center text-[#66758a]"
                            >
                              <strong className="block text-[#12263f] text-base mb-1.5">
                                No component lines match these filters
                              </strong>
                            </td>
                          </tr>
                        ) : (
                          paginateData(setupComponentsFiltered).map(
                            (row, idx) => {
                              const isExpanded = expandedAwbs.has(row.awb);
                              return (
                                <React.Fragment key={row.awb || idx}>
                                  <tr
                                    className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                                    onClick={() => toggleAWBExpansion(row.awb)}
                                  >
                                    <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle">
                                      <div className="flex items-center gap-2">
                                        <button
                                          className={`w-6 h-6 flex items-center justify-center rounded-md border transition-all duration-200 ${
                                            isExpanded
                                              ? "border-blue-400 bg-blue-50 text-blue-600"
                                              : "border-[#dfe5ec] bg-white text-[#66758a] hover:bg-gray-50"
                                          }`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleAWBExpansion(row.awb);
                                          }}
                                        >
                                          {isExpanded ? "−" : "+"}
                                        </button>
                                        <span className="font-bold text-sm text-blue-600">
                                          {row.awb}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle">
                                      <span className="text-sm">
                                        {row.order_id || "-"}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle">
                                      <span className="text-sm">
                                        {row.courier || "-"}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle">
                                      {statusMarkup(
                                        row.shipment_status || row.event,
                                      )}
                                    </td>
                                    <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle">
                                      <span
                                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                                          row.payment_type === "COD"
                                            ? "bg-orange-100 text-orange-700"
                                            : "bg-green-100 text-green-700"
                                        }`}
                                      >
                                        {row.payment_type || "-"}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle text-right">
                                      <span className="text-sm">
                                        {row.charged_weight || 0} kg
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle text-right font-mono">
                                      {row.freight_charge
                                        ? formatMoney(row.freight_charge)
                                        : "—"}
                                    </td>
                                    <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle text-right font-mono text-amber-600">
                                      {row.cod_charge
                                        ? formatMoney(row.cod_charge)
                                        : "—"}
                                    </td>
                                    <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle text-right font-mono text-red-600">
                                      {row.rto_freight_charge
                                        ? formatMoney(row.rto_freight_charge)
                                        : "—"}
                                    </td>
                                    <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle text-right font-mono text-purple-600">
                                      {row.insurance_charge
                                        ? formatMoney(row.insurance_charge)
                                        : "—"}
                                    </td>
                                    <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle text-right font-mono">
                                      {row.taxable_amount
                                        ? formatMoney(row.taxable_amount)
                                        : "—"}
                                    </td>
                                    <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle text-right font-mono font-extrabold">
                                      <span
                                        className={
                                          row.total_amount >= 0
                                            ? "text-[#12263f]"
                                            : "text-red-600"
                                        }
                                      >
                                        {formatMoney(row.total_amount)}
                                      </span>
                                    </td>
                                  </tr>
                                  {isExpanded && (
                                    <tr className="bg-[#f8fafc] border-b border-[#edf1f5]">
                                      <td colSpan="12" className="px-4 py-3">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                          <div>
                                            <span className="text-[#66758a] text-xs block">
                                              Merchant Order
                                            </span>
                                            <span className="font-medium">
                                              {row.merchant_order_id || "-"}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-[#66758a] text-xs block">
                                              GST Type
                                            </span>
                                            <span className="font-medium">
                                              {row.gst_type || "N/A"}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-[#66758a] text-xs block">
                                              CGST
                                            </span>
                                            <span className="font-medium">
                                              {formatMoney(row.cgst_amount)}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-[#66758a] text-xs block">
                                              SGST
                                            </span>
                                            <span className="font-medium">
                                              {formatMoney(row.sgst_amount)}
                                            </span>
                                          </div>
                                          {row.igst_amount > 0 && (
                                            <div>
                                              <span className="text-[#66758a] text-xs block">
                                                IGST
                                              </span>
                                              <span className="font-medium">
                                                {formatMoney(row.igst_amount)}
                                              </span>
                                            </div>
                                          )}
                                          <div>
                                            <span className="text-[#66758a] text-xs block">
                                              Direction
                                            </span>
                                            <span
                                              className={`font-medium ${
                                                row.direction === "Debit"
                                                  ? "text-red-600"
                                                  : "text-green-600"
                                              }`}
                                            >
                                              {row.direction}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-[#66758a] text-xs block">
                                              Unclassified
                                            </span>
                                            <span className="font-medium">
                                              {formatMoney(
                                                row.unclassified_charge,
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              );
                            },
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {setupComponentsFiltered.length > 0 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t border-[#dfe5ec] bg-[#fafbfd]">
                    <span className="text-sm text-[#66758a]">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(
                        currentPage * itemsPerPage,
                        setupComponentsFiltered.length,
                      )}{" "}
                      of {setupComponentsFiltered.length} entries
                    </span>
                    <div className="flex gap-2">
                      <button
                        disabled={currentPage === 1}
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        className="px-4 py-1.5 rounded-md border border-[#dfe5ec] bg-white text-sm font-bold disabled:opacity-50 hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-1.5 rounded-md bg-blue-600 text-white text-sm font-bold">
                        {currentPage}
                      </span>
                      <button
                        disabled={
                          currentPage ===
                          getTotalPages(setupComponentsFiltered.length)
                        }
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(
                              prev + 1,
                              getTotalPages(setupComponentsFiltered.length),
                            ),
                          )
                        }
                        className="px-4 py-1.5 rounded-md border border-[#dfe5ec] bg-white text-sm font-bold disabled:opacity-50 hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {setupActiveTab === "credit-notes" && (
              <div>
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 sm:p-5 border-b border-[#dfe5ec]">
                  <div>
                    <span className="block text-[#78869a] text-xs tracking-widest font-extrabold uppercase">
                      Credit Notes
                    </span>
                    <h3 className="text-xl my-1">
                      {setupCreditNotesPagination.total} credit note
                      {setupCreditNotesPagination.total !== 1 ? "s" : ""}
                    </h3>
                    <p className="text-[#66758a] text-sm">
                      List of all credit notes generated.
                    </p>
                  </div>
                  <button
                    className="h-[42px] px-4 rounded-lg border border-[#cfd8e3] bg-white text-[#243c57] text-sm font-bold whitespace-nowrap transition-all hover:-translate-y-0.5 hover:shadow-sm flex items-center gap-2 cursor-pointer"
                    onClick={() =>
                      loadSetupCreditNotes({
                        page: 1,
                        limit: setupCreditNotesPagination.limit || 20,
                      })
                    }
                    disabled={setupCreditNotesLoading}
                  >
                    {setupCreditNotesLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-gray-400 border-t-blue-600 rounded-full animate-spin" />{" "}
                        Loading...
                      </>
                    ) : (
                      "Refresh"
                    )}
                  </button>
                </div>

                {/* Body */}
                <div className="p-4 bg-[#fafbfd]">
                  {setupCreditNotesLoading ? (
                    <div className="p-8 text-center text-[#66758a]">
                      <div className="flex justify-center mb-3">
                        <span className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                      </div>
                      <strong className="block text-[#12263f] text-base mb-1">
                        Loading credit notes...
                      </strong>
                    </div>
                  ) : setupCreditNotes.length === 0 ? (
                    <div className="p-8 text-center text-[#66758a] bg-white rounded-lg">
                      <strong className="block text-[#12263f] text-base mb-1">
                        No credit notes found
                      </strong>
                    </div>
                  ) : (
                    <>
                      {/* Table */}
                      <div className="w-full overflow-x-auto">
                        <table className="w-full border-collapse min-w-[1000px]">
                          <thead>
                            <tr>
                              <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                                Credit Note
                              </th>
                              <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                                Merchant
                              </th>
                              <th className="h-[40px] px-3 text-right border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                                Total
                              </th>
                              <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                                Status
                              </th>
                              <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                                Date
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {setupCreditNotes.map((note, idx) => (
                              <tr
                                key={note.id || idx}
                                className="hover:bg-blue-50/60 transition-colors"
                              >
                                <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle">
                                  <span className="text-purple-600 font-bold text-sm whitespace-nowrap">
                                    {note.invoice_number || "N/A"}
                                  </span>
                                </td>
                                <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle">
                                  <span className="block text-[#12263f] font-bold text-sm">
                                    {note.merchant_name ||
                                      `Merchant ${note.merchant_id}`}
                                  </span>
                                  <span className="block mt-0.5 text-[#66758a] text-xs">
                                    ID: {note.merchant_id}
                                  </span>
                                </td>
                                <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle text-right font-mono font-bold text-purple-600">
                                  {formatMoney(note.total_amount || 0)}
                                </td>
                                <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle">
                                  {statusMarkup(note.status)}
                                </td>
                                <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle">
                                  {formatDate(note.generation_date)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {setupCreditNotesPagination.totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t border-[#dfe5ec] bg-[#fafbfd]">
                          <span className="text-sm text-[#66758a]">
                            Showing{" "}
                            {(setupCreditNotesPagination.page - 1) *
                              setupCreditNotesPagination.limit +
                              1}{" "}
                            to{" "}
                            {Math.min(
                              setupCreditNotesPagination.page *
                                setupCreditNotesPagination.limit,
                              setupCreditNotesPagination.total,
                            )}{" "}
                            of {setupCreditNotesPagination.total} entries
                          </span>
                          <div className="flex gap-2">
                            <button
                              disabled={
                                setupCreditNotesPagination.page === 1 ||
                                setupCreditNotesLoading
                              }
                              onClick={() =>
                                loadSetupCreditNotes({
                                  page: setupCreditNotesPagination.page - 1,
                                  limit: setupCreditNotesPagination.limit,
                                })
                              }
                              className="px-4 py-1.5 rounded-md border border-[#dfe5ec] bg-white text-sm font-bold disabled:opacity-50 hover:bg-gray-50"
                            >
                              Previous
                            </button>
                            <span className="px-4 py-1.5 rounded-md bg-blue-600 text-white text-sm font-bold">
                              {setupCreditNotesPagination.page} /{" "}
                              {setupCreditNotesPagination.totalPages}
                            </span>
                            <button
                              disabled={
                                setupCreditNotesPagination.page ===
                                  setupCreditNotesPagination.totalPages ||
                                setupCreditNotesLoading
                              }
                              onClick={() =>
                                loadSetupCreditNotes({
                                  page: setupCreditNotesPagination.page + 1,
                                  limit: setupCreditNotesPagination.limit,
                                })
                              }
                              className="px-4 py-1.5 rounded-md border border-[#dfe5ec] bg-white text-sm font-bold disabled:opacity-50 hover:bg-gray-50"
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
            )}

            {setupActiveTab === "failed" && (
              <div>
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 sm:p-5 border-b border-[#dfe5ec]">
                  <div>
                    <span className="block text-[#78869a] text-xs tracking-widest font-extrabold uppercase">
                      Failed Generations
                    </span>
                    <h3 className="text-xl my-1">
                      {setupFailedTotal} failed generation
                      {setupFailedTotal !== 1 ? "s" : ""}
                    </h3>
                    <p className="text-[#66758a] text-sm">
                      Select and retry failed generations.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="h-[42px] px-4 rounded-lg border border-[#cfd8e3] bg-white text-[#243c57] text-sm font-bold whitespace-nowrap transition-all hover:-translate-y-0.5 hover:shadow-sm flex items-center gap-2 cursor-pointer"
                      onClick={() =>
                        loadSetupFailedGenerations(setupFailedPage, 20)
                      }
                      disabled={setupFailedLoading}
                    >
                      {setupFailedLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-gray-400 border-t-blue-600 rounded-full animate-spin" />{" "}
                          Loading...
                        </>
                      ) : (
                        "Refresh"
                      )}
                    </button>
                    <button
                      className="h-[42px] px-4 rounded-lg border border-blue-600 bg-blue-600 text-white text-sm font-bold whitespace-nowrap shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      onClick={handleRetryFailed}
                      disabled={
                        selectedFailedIds.size === 0 ||
                        retryingFailed ||
                        setupFailedLoading
                      }
                    >
                      {retryingFailed ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                          Retrying...
                        </>
                      ) : (
                        <>↻ Retry Selected ({selectedFailedIds.size})</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 bg-[#fafbfd]">
                  {setupFailedLoading ? (
                    <div className="p-8 text-center text-[#66758a]">
                      <div className="flex justify-center mb-3">
                        <span className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                      </div>
                      <strong className="block text-[#12263f] text-base mb-1">
                        Loading...
                      </strong>
                    </div>
                  ) : setupFailedGenerations.length === 0 ? (
                    <div className="p-8 text-center text-[#66758a] bg-white rounded-lg">
                      <strong className="block text-[#12263f] text-base mb-1">
                        No failed generations
                      </strong>
                    </div>
                  ) : (
                    <>
                      {/* ✅ Select All — same as Step 2 */}
                      <div className="flex items-center gap-3 mb-4 px-2">
                        <input
                          type="checkbox"
                          checked={
                            setupFailedGenerations.length > 0 &&
                            setupFailedGenerations.every((log) =>
                              selectedFailedIds.has(log.log_id),
                            )
                          }
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setSelectedFailedIds((prev) => {
                              const newSet = new Set(prev);
                              if (checked) {
                                setupFailedGenerations.forEach((log) =>
                                  newSet.add(log.log_id),
                                );
                              } else {
                                setupFailedGenerations.forEach((log) =>
                                  newSet.delete(log.log_id),
                                );
                              }
                              return newSet;
                            });
                          }}
                          className="accent-blue-600 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-[#12263f]">
                          Select All ({setupFailedGenerations.length} on this
                          page)
                        </span>
                      </div>

                      {/* List */}
                      <div className="space-y-2">
                        {setupFailedGenerations.map((log) => {
                          const isSelected = selectedFailedIds.has(log.log_id);
                          return (
                            <div
                              key={log.log_id}
                              className={`w-full bg-white rounded-lg border shadow-sm overflow-hidden cursor-pointer transition-all ${
                                isSelected
                                  ? "border-blue-600 bg-blue-50"
                                  : "border-[#d9e1ea] hover:bg-gray-50"
                              }`}
                              onClick={() => {
                                setSelectedFailedIds((prev) => {
                                  const newSet = new Set(prev);
                                  if (newSet.has(log.log_id))
                                    newSet.delete(log.log_id);
                                  else newSet.add(log.log_id);
                                  return newSet;
                                });
                              }}
                            >
                              <div className="flex flex-wrap items-center gap-3 sm:gap-5 px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  readOnly
                                  className="accent-blue-600 w-4 h-4"
                                />
                                <div className="w-8 h-8 flex items-center justify-center bg-red-100 rounded-lg">
                                  <span className="text-red-600 font-bold text-lg">
                                    ×
                                  </span>
                                </div>
                                <div className="min-w-[150px]">
                                  <div className="text-sm font-bold text-[#243c57]">
                                    {log.merchant_name ||
                                      `Merchant ${log.merchant_id}`}
                                  </div>
                                  <div className="text-xs text-[#66758a]">
                                    ID: {log.merchant_id}
                                  </div>
                                  <div className="text-xs text-[#66758a]">
                                    {formatDate(log.generation_date)}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-[150px]">
                                  <div className="text-sm font-bold text-red-600">
                                    Generation Failed
                                  </div>
                                  <div className="text-xs text-[#66758a]">
                                    {log.message || "Unknown error"}
                                  </div>
                                </div>
                                <span className="px-2.5 py-1 rounded-md bg-red-100 text-red-700 text-xs font-bold">
                                  {log.status_code || "500"}
                                </span>
                                <div className="text-right text-xs text-[#66758a]">
                                  <div>{formatTime(log.created_at)}</div>
                                  <div>{formatDate(log.created_at)}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Pagination */}
                      {setupFailedTotalPages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 pt-4 border-t border-[#dfe5ec]">
                          <span className="text-sm text-[#66758a]">
                            Showing {(setupFailedPage - 1) * 20 + 1} to{" "}
                            {Math.min(setupFailedPage * 20, setupFailedTotal)}{" "}
                            of {setupFailedTotal} entries
                          </span>
                          <div className="flex gap-2">
                            <button
                              disabled={
                                setupFailedPage === 1 || setupFailedLoading
                              }
                              onClick={() => {
                                const newPage = setupFailedPage - 1;
                                setSetupFailedPage(newPage);
                                loadSetupFailedGenerations(newPage, 20);
                              }}
                              className="px-4 py-1.5 rounded-md border border-[#dfe5ec] bg-white text-sm font-bold disabled:opacity-50 hover:bg-gray-50"
                            >
                              Previous
                            </button>
                            <span className="px-4 py-1.5 rounded-md bg-blue-600 text-white text-sm font-bold">
                              {setupFailedPage} / {setupFailedTotalPages}
                            </span>
                            <button
                              disabled={
                                setupFailedPage === setupFailedTotalPages ||
                                setupFailedLoading
                              }
                              onClick={() => {
                                const newPage = setupFailedPage + 1;
                                setSetupFailedPage(newPage);
                                loadSetupFailedGenerations(newPage, 20);
                              }}
                              className="px-4 py-1.5 rounded-md border border-[#dfe5ec] bg-white text-sm font-bold disabled:opacity-50 hover:bg-gray-50"
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
            )}
            {setupActiveTab === "activity" && (
              <div>
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 sm:p-5 border-b border-[#dfe5ec]">
                  <div>
                    <span className="block text-black text-xl tracking-widest font-extrabold uppercase">
                      Audit Trail
                    </span>
                    <h3 className="text-xl my-1">Recent Activity</h3>
                    <p className="text-[#66758a] text-sm">
                      Latest generation logs across all batches.
                    </p>
                  </div>
                  <button
                    className="h-[42px] px-4 rounded-lg border border-[#cfd8e3] bg-white text-[#243c57] text-sm font-bold whitespace-nowrap transition-all hover:-translate-y-0.5 hover:shadow-sm flex items-center gap-2 cursor-pointer"
                    onClick={loadSetupActivity}
                    disabled={setupActivityLoading}
                  >
                    {setupActivityLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-gray-400 border-t-blue-600 rounded-full animate-spin" />{" "}
                        Loading...
                      </>
                    ) : (
                      "Refresh"
                    )}
                  </button>
                </div>

                {/* Timeline body */}
                <div className="max-w-[850px] p-4 sm:p-6">
                  {setupActivityLoading ? (
                    <div className="p-8 text-center text-[#66758a]">
                      <div className="flex justify-center mb-3">
                        <span className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                      </div>
                      <strong className="block text-[#12263f] text-base mb-1">
                        Loading audit logs...
                      </strong>
                    </div>
                  ) : setupActivityItems.length === 0 ? (
                    <div className="p-8 text-center text-[#66758a] bg-white rounded-lg border border-[#dfe5ec]">
                      <strong className="block text-[#12263f] text-base mb-1">
                        No activity yet
                      </strong>
                      <p className="text-sm">
                        Run a batch to see activity logs here.
                      </p>
                    </div>
                  ) : (
                    setupActivityItems.map((item, idx) => {
                      let statusColor = "bg-[#0446DB]";
                      let statusBorder = "#0446DB";

                      if (
                        item.outcome === "failed" ||
                        item.outcome === "error" ||
                        item.status_code >= 400
                      ) {
                        statusColor = "bg-red-600";
                        statusBorder = "#fca5a5";
                      } else if (
                        item.outcome === "no_activity" ||
                        item.outcome === "zero_net" ||
                        item.outcome === "skipped_duplicate" ||
                        item.outcome === "duplicate"
                      ) {
                        statusColor = "bg-amber-500";
                        statusBorder = "#fcd34d";
                      } else if (
                        item.outcome === "generated" ||
                        item.outcome === "success" ||
                        item.outcome === "complete"
                      ) {
                        statusColor = "bg-green-600";
                        statusBorder = "#6ee7b7";
                      } else if (
                        item.outcome === "warning" ||
                        item.outcome === "pending"
                      ) {
                        statusColor = "bg-yellow-500";
                        statusBorder = "#fbbf24";
                      }

                      return (
                        <div
                          key={idx}
                          className={`grid grid-cols-[60px_20px_1fr] sm:grid-cols-[80px_24px_1fr] gap-3 ${
                            idx === setupActivityItems.length - 1 ? "pb-0" : ""
                          }`}
                        >
                          <div className="text-right text-[#66758a] text-xs pt-0.5">
                            {item.time}
                          </div>
                          <div className="flex flex-col items-center">
                            <span
                              className={`w-4 h-4 flex-shrink-0 rounded-full ${statusColor} border-2 border-white`}
                              style={{ boxShadow: `0 0 0 2px ${statusBorder}` }}
                            />
                            {idx < setupActivityItems.length - 1 && (
                              <span className="w-px flex-1 bg-[#dfe5ec] mt-0.5" />
                            )}
                          </div>
                          <div
                            className={
                              idx < setupActivityItems.length - 1 ? "pb-5" : ""
                            }
                          >
                            <strong className="block text-sm">
                              {item.title}
                            </strong>
                            <p className="text-[#66758a] text-xs leading-4 mt-0.5">
                              {item.body}
                            </p>
                            {item.merchant_id && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                                Merchant: {item.merchant_id}
                              </span>
                            )}
                            {item.period_start && item.period_end && (
                              <span className="inline-block mt-1 ml-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                {formatDate(item.period_start)} -{" "}
                                {formatDate(item.period_end)}
                              </span>
                            )}
                            <span className="inline-flex mt-1.5 px-2.5 py-0.5 bg-[#eef2f6] rounded-md text-[#637287] text-xs font-bold">
                              {item.actor}
                            </span>

                            {item.outcome && (
                              <span className="inline-flex mt-1.5 ml-1 px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded-md text-xs">
                                {item.outcome}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {renderDrawer()}
        </div>
      </>
    );
  }

  // ============================================================
  // RENDER - LOADING VIEW
  // ============================================================

  if (view === "loading") {
    return (
      <div className="min-h-screen bg-transparent font-sans text-base text-[#12263f] p-4 sm:p-6 md:p-10">
        <article className="max-w-[720px] mx-auto mt-12 md:mt-[80px] bg-white border border-[#dfe5ec] rounded-[12px] shadow-sm p-8 sm:p-12 text-center">
          <div className="flex justify-center mb-5">
            <div className="relative w-[80px] h-[80px]">
              <div
                className="absolute inset-0 rounded-full animate-spin"
                style={{
                  background:
                    "conic-gradient(from 0deg, #e6eef8 0deg, #2563eb 180deg, #e6eef8 360deg)",
                  padding: "4px",
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))",
                  WebkitMask:
                    "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-[52px] h-[52px] rounded-full flex items-center justify-center bg-[#0446DB] text-white text-2xl font-extrabold">
                  ₹
                </span>
              </div>
            </div>
          </div>
          <span className="block text-[#78869a] text-xs tracking-widest font-extrabold uppercase">
            BUILDING BATCH
          </span>
          <h2 className="text-2xl sm:text-3xl mt-2">
            Preparing your invoice preview
          </h2>

          <p className="text-[#66758a] text-sm sm:text-base">
            {generationStage === "polling"
              ? "Backend is processing your batch. This may take a moment…"
              : "Validating billing cycles and reconciling unbilled AWB components."}
          </p>

          <div className="max-w-[570px] mx-auto mt-8 text-left space-y-3">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className={`grid grid-cols-[34px_1fr_auto] items-center gap-3 p-3 border rounded-lg bg-white transition-all duration-300 ${
                  step.status === "running"
                    ? "border-blue-300 bg-blue-50 shadow-md scale-[1.01]"
                    : step.status === "complete"
                      ? "border-green-200 bg-green-50"
                      : "border-[#dfe5ec]"
                }`}
              >
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-extrabold transition-all duration-300 ${
                    step.status === "complete"
                      ? "bg-green-500 text-white"
                      : step.status === "running"
                        ? "bg-blue-500 text-white animate-pulse"
                        : "bg-[#eef2f6] text-[#758399]"
                  }`}
                >
                  {step.status === "complete" ? "✓" : step.step}
                </span>
                <div>
                  <strong className="text-sm">{step.title}</strong>
                  <small className="block mt-0.5 text-[#66758a] text-xs">
                    {step.desc}
                  </small>
                </div>
                <b
                  className={`text-xs uppercase tracking-wide transition-all duration-300 ${
                    step.status === "complete"
                      ? "text-green-600"
                      : step.status === "running"
                        ? "text-blue-600 animate-pulse"
                        : "text-[#8a97a9]"
                  }`}
                >
                  {step.status === "complete"
                    ? "Complete"
                    : step.status === "running"
                      ? "Running"
                      : "Pending"}
                </b>
              </div>
            ))}
          </div>
        </article>
      </div>
    );
  }

  // ============================================================
  // RENDER - PREVIEW VIEW
  // ============================================================
 
  return (
    
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#0446DB] p-4 sm:p-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-4xl font-bold text-white">
              Invoice Preview
            </h1>
          </div>
          <p className="text-white/75 text-sm sm:text-base mt-1.5">
            Review and submit generated invoice preview.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Refresh Data Button */}
          <button
            className={`h-[38px] px-4 rounded-lg border border-white/30 bg-white/10 text-white hover:bg-white/20 text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              isRefreshing ? "opacity-70 cursor-not-allowed" : ""
            }`}
            onClick={handleRefreshAll}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 4v6h6" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                Refresh
              </>
            )}
          </button>

          {/* Back Button */}
          <button
            className="h-[38px] px-4 rounded-lg border border-white/30 bg-white/10 text-white hover:bg-white/20 text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer"
            onClick={resetBatch}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Business Date (optional – can keep or move) */}
          <div className="text-right pl-0 sm:pl-4 sm:border-l border-white/30">
            <span className="block text-white/65 text-xs tracking-widest font-extrabold uppercase">
              Business Date
            </span>
            <strong className="block text-sm text-white">
              {generationDate}
            </strong>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 font-sans text-base text-[#12263f] p-4 sm:p-6 md:p-10">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {[
            {
              icon: "▤",
              color: "bg-[#eef2f6] text-[#5b697d]",
              label: "Provisional invoices",
              value: invoiceRows.length.toString(),
              sub: "Across closed periods",
            },
            {
              icon: "↗",
              color: "bg-red-50 text-red-600",
              label: "Total debit",
              value: formatMoney(
                dashboardData?.wallet_ledger?.total_debit ||
                  invoiceRows.reduce((s, r) => s + (r.debit || 0), 0) ||
                  0,
              ),
              sub: "Seller charges",
            },
            {
              icon: "↙",
              color: "bg-green-50 text-green-600",
              label: "Total credit",
              value: formatMoney(
                dashboardData?.wallet_ledger?.total_credit ||
                  invoiceRows.reduce((s, r) => s + (r.credit || 0), 0) ||
                  0,
              ),
              sub: "Reversals & refunds",
            },
            {
              icon: "₹",
              color: "bg-white text-[#0b1f38]",
              label: "Net invoice amount",
              value: formatMoney(
                dashboardData?.billing_documents?.net_billed_amount ||
                  invoiceRows.reduce((s, r) => s + (r.net || 0), 0) ||
                  0,
              ),
              sub: "Debit less credit",
              featured: true,
            },
          ].map((kpi, idx) => (
            <div
              key={idx}
              className={`min-h-[96px] sm:min-h-[120px] flex items-start gap-3 
        p-3 sm:p-5 bg-white border border-[#dfe5ec] rounded-[10px] 
        relative transition-all hover:shadow-sm overflow-hidden
        ${kpi.featured ? "border-[#0446DB] shadow-md" : ""}`}
              style={kpi.featured ? { backgroundColor: "#0446DB" } : {}}
            >
              <span
                className={`w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center 
          justify-center rounded-lg text-lg sm:text-xl font-extrabold ${kpi.color}`}
              >
                {kpi.icon}
              </span>

              <div className="min-w-0 flex-1">
                <span
                  className={`block text-[10px] sm:text-xs uppercase tracking-wide 
            font-bold leading-tight ${
              kpi.featured ? "text-[#a8bad0]" : "text-[#66758a]"
            }`}
                >
                  {kpi.label}
                </span>

                <strong
                  className={`block mt-1 sm:mt-1.5 text-lg sm:text-2xl 
            tracking-[-0.25px] break-words ${kpi.featured ? "text-white" : ""}`}
                >
                  {kpi.value}
                </strong>

                <small
                  className={`block mt-1 text-[10px] sm:text-xs leading-tight ${
                    kpi.featured ? "text-[#a8bad0]" : "text-[#66758a]"
                  }`}
                >
                  {kpi.sub}
                </small>
              </div>

              {kpi.featured && (
                <span className="absolute right-3 bottom-3 text-[#6fa9fb] text-lg sm:text-xl">
                  ↗
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Data Card */}
        <article className="bg-white border border-[#dfe5ec] rounded-[12px] shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex gap-3 sm:gap-5 lg:gap-7 h-[60px] sm:h-[65px] items-end px-4 sm:px-6 lg:px-8 border-b border-[#dfe5ec] overflow-x-auto">
            {[
              {
                id: "summary",
                label: "Invoice Summary",
                count: invoiceRows.length,
              },
              {
                id: "components",
                label: "AWB Components",
                count: componentRows.length,
              },
              {
                id: "credit-notes",
                label: "Credit Notes",
                count: creditNotes.length,
              },
              {
                id: "failed",
                label: "Failed Generations",
                count: failedGenerations.length,
              },
              { id: "activity", label: "Activity Log" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`h-[60px] sm:h-[65px] flex items-center gap-2 border-0 border-b-2 bg-transparent text-sm font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "text-blue-600 border-blue-600"
                    : "text-[#66758a] border-transparent hover:text-[#12263f]"
                }`}
                onClick={() => activateTab(tab.id)}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-xs ${
                      tab.id === "failed" && tab.count > 0
                        ? "bg-red-100 text-red-700"
                        : tab.id === "issues" && tab.count > 0
                          ? "bg-amber-100 text-amber-700"
                          : "bg-[#edf1f5] text-[#65758a]"
                    }`}
                  >
                    {tab.count.toLocaleString()}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Summary Tab */}
          {activeTab === "summary" && (
            <div>
              <div className="flex flex-wrap items-center gap-2 min-h-[60px] p-3 sm:p-4 border-b border-[#dfe5ec] bg-[#fafbfd]">
                <label className="flex-1 sm:flex-initial sm:w-[200px] h-[38px] flex items-center px-3 border border-[#dfe5ec] rounded-lg bg-white text-[#66758a]">
                  <span className="text-lg">⌕</span>
                  <input
                    type="search"
                    placeholder="Search"
                    className="flex-1 bg-transparent border-0 px-2.5 outline-none text-[#12263f] text-sm"
                    value={filters.invoiceSearch}
                    onChange={(e) =>
                      handleFilterChange("invoiceSearch", e.target.value)
                    }
                  />
                </label>
                <select
                  className="h-[38px] min-w-[110px] border border-[#dfe5ec] rounded-lg bg-white text-[#40536b] px-3 pr-8 text-sm"
                  value={filters.cycleFilter}
                  onChange={(e) =>
                    handleFilterChange("cycleFilter", e.target.value)
                  }
                >
                  <option value="all">All cycles</option>
                  <option value="15-day">15-day</option>
                  <option value="30-day">30-day</option>
                </select>
                <select
                  className="h-[38px] min-w-[110px] border border-[#dfe5ec] rounded-lg bg-white text-[#40536b] px-3 pr-8 text-sm"
                  value={filters.paymentFilter}
                  onChange={(e) =>
                    handleFilterChange("paymentFilter", e.target.value)
                  }
                >
                  <option value="all">All payment</option>
                  <option value="due">Due</option>
                  <option value="paid">Paid</option>
                  <option value="creditNote">Credit Note</option>
                </select>
                <input
                  type="date"
                  className="h-[38px] min-w-[130px] border border-[#dfe5ec] rounded-lg bg-white text-[#40536b] px-3 text-sm"
                  value={filters.dateFrom}
                  max={filters.dateTo || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleFilterChange("dateFrom", value);
                    if (filters.dateTo && value > filters.dateTo) {
                      handleFilterChange("dateTo", "");
                    }
                  }}
                />
                <input
                  type="date"
                  className="h-[38px] min-w-[130px] border border-[#dfe5ec] rounded-lg bg-white text-[#40536b] px-3 text-sm"
                  value={filters.dateTo}
                  min={filters.dateFrom || ""}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                />
                <button
                  className="h-[38px] px-3 rounded-lg border border-transparent bg-transparent text-[#66758a] text-sm font-bold hover:bg-[#0446DB] hover:text-white cursor-pointer"
                  onClick={resetFilters}
                >
                  Reset
                </button>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse min-w-[1400px]">
                  <thead>
                    <tr>
                      <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                        Seller
                      </th>
                      <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                        Type
                      </th>
                      <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                        Cycle
                      </th>
                      <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                        Period
                      </th>
                      <th className="h-[40px] px-3 text-right border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                        Taxable
                      </th>
                      <th className="h-[40px] px-3 text-right border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                        CGST
                      </th>
                      <th className="h-[40px] px-3 text-right border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                        SGST
                      </th>
                      <th className="h-[40px] px-3 text-right border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                        IGST
                      </th>
                      <th className="h-[40px] px-3 text-right border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                        Total
                      </th>
                      <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                        GST Type
                      </th>
                      <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginateData(getFilteredInvoices()).length === 0 ? (
                      <tr>
                        <td
                          colSpan="13"
                          className="px-5 py-12 text-center text-[#66758a]"
                        >
                          <strong className="block text-[#12263f] text-base mb-1.5">
                            {invoiceRows.length === 0
                              ? "No invoices found"
                              : "No invoice groups match these filters"}
                          </strong>
                          {invoiceRows.length > 0 && (
                            <button
                              onClick={resetFilters}
                              className="mt-2 px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                              Clear Filters
                            </button>
                          )}
                        </td>
                      </tr>
                    ) : (
                      paginateData(getFilteredInvoices()).map((row, idx) => (
                        <tr
                          key={row.key || idx}
                          className={`${row.validation === "Failed" ? "bg-red-50" : row.validation === "Warning" ? "bg-amber-50/50" : ""} hover:bg-blue-50/60 transition-colors`}
                        >
                          <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle">
                            <span
                              className={`font-bold text-sm whitespace-nowrap ${row.invoiceType === "credit_note" ? "text-purple-600" : "text-blue-600"}`}
                            >
                              {row.key || "N/A"}
                            </span>
                          </td>
                          <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle">
                            <span className="block text-[#12263f] font-bold text-sm">
                              {row.seller || "N/A"}
                            </span>
                          </td>
                          <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle">
                            <span
                              className={`px-3 py-1 rounded-md text-xs font-bold ${row.invoiceType === "credit_note" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                            >
                              {row.invoiceType === "credit_note"
                                ? "Credit Note"
                                : "Invoice"}
                            </span>
                          </td>
                          <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle">
                            <span className="px-3 py-1 rounded-md bg-[#eef2f6] text-[#435671] text-xs font-bold">
                              {row.cycle || "30-day"}
                            </span>
                          </td>
                          <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle">
                            <span className="block text-[#12263f] font-bold text-sm">
                              {row.period || "N/A"}
                            </span>
                          </td>
                          <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle text-right font-mono text-sm">
                            {row.taxable_amount
                              ? formatMoney(row.taxable_amount)
                              : "—"}
                          </td>
                          <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle text-right font-mono text-sm text-orange-600">
                            {row.cgst_amount
                              ? formatMoney(row.cgst_amount)
                              : "—"}
                          </td>
                          <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle text-right font-mono text-sm text-blue-600">
                            {row.sgst_amount
                              ? formatMoney(row.sgst_amount)
                              : "—"}
                          </td>
                          <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle text-right font-mono text-sm text-purple-600">
                            {row.igst_amount
                              ? formatMoney(row.igst_amount)
                              : "—"}
                          </td>
                          <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle text-right font-mono font-extrabold whitespace-nowrap text-sm">
                            {formatMoney(row.total_amount || row.net || 0)}
                          </td>
                          <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle">
                            <span
                              className={`px-3 py-1 rounded-md text-xs font-bold ${row.gst_type === "intra_state" ? "bg-green-100 text-green-700" : row.gst_type === "inter_state" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"}`}
                            >
                              {row.gst_type === "intra_state"
                                ? "Intra-State"
                                : row.gst_type === "inter_state"
                                  ? "Inter-State"
                                  : row.gst_type || "N/A"}
                            </span>
                          </td>
                          <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle">
                            {row?.invoiceType === "credit_note" ? (
                              <span className="px-3 py-1.5 rounded-lg text-xs font-medium border bg-purple-100 text-purple-700 border-purple-300">
                                Credit Note
                              </span>
                            ) : row?.billing_type?.toLowerCase() ===
                              "prepaid" ? (
                              <span className="px-3 py-1.5 rounded-lg text-xs font-medium border bg-blue-100 text-blue-700 border-blue-300">
                                Prepaid
                              </span>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  const newStatus =
                                    row.payment_status === "paid"
                                      ? "due"
                                      : "paid";
                                  handleUpdatePaymentStatus(
                                    row.invoiceId,
                                    newStatus,
                                  );
                                }}
                                disabled={updatingPaymentStatus.has(
                                  row.invoiceId,
                                )}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                  row.payment_status === "paid"
                                    ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
                                    : "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200"
                                } ${updatingPaymentStatus.has(row.invoiceId) ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"}`}
                              >
                                {updatingPaymentStatus.has(row.invoiceId) ? (
                                  <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : row.payment_status === "paid" ? (
                                  "Paid ✓"
                                ) : (
                                  "Due"
                                )}
                              </button>
                            )}
                          </td>
                          <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle">
                            <div className="flex items-center gap-1">
                              <button
                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#dfe5ec] bg-white text-[#66758a] hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  if (!row.invoiceId) {
                                    toast.error("Invoice ID not found");
                                    return;
                                  }
                                  openDrawer(row);
                                }}
                              >
                                •••
                              </button>
                              {row.validation === "Failed" && row.invoiceId && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleRegenerate(row.invoiceId);
                                  }}
                                  disabled={isLoading}
                                  className="px-2.5 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isLoading ? "..." : "↻ Regenerate"}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {getFilteredInvoices().length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t border-[#dfe5ec] bg-[#fafbfd]">
                  <span className="text-sm text-[#66758a]">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      getFilteredInvoices().length,
                    )}{" "}
                    of {getFilteredInvoices().length} entries
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className="px-4 py-1.5 rounded-md border border-[#dfe5ec] bg-white text-sm font-bold disabled:opacity-50 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-1.5 rounded-md bg-blue-600 text-white text-sm font-bold">
                      {currentPage}
                    </span>
                    <button
                      disabled={
                        currentPage ===
                        getTotalPages(getFilteredInvoices().length)
                      }
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(
                            prev + 1,
                            getTotalPages(getFilteredInvoices().length),
                          ),
                        )
                      }
                      className="px-4 py-1.5 rounded-md border border-[#dfe5ec] bg-white text-sm font-bold disabled:opacity-50 hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Components Tab - Simplified */}
          {activeTab === "components" && (
            <div>
              <div className="flex flex-wrap items-center gap-2 min-h-[60px] p-3 sm:p-4 border-b border-[#dfe5ec] bg-[#fafbfd]">
                <label className="flex-1 sm:flex-initial sm:w-[220px] h-[38px] flex items-center px-3 border border-[#dfe5ec] rounded-lg bg-white text-[#66758a]">
                  <span className="text-lg mr-2">⌕</span>
                  <input
                    type="search"
                    placeholder="Search AWB, Order, Merchant..."
                    className="flex-1 bg-transparent border-0 px-2 outline-none text-[#12263f] text-sm"
                    value={filters.componentSearch}
                    onChange={(e) =>
                      handleFilterChange("componentSearch", e.target.value)
                    }
                  />
                  {filters.componentSearch && (
                    <button
                      onClick={() => handleFilterChange("componentSearch", "")}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </label>
                <select
                  className="h-[38px] min-w-[140px] border border-[#dfe5ec] rounded-lg bg-white text-[#40536b] px-3 pr-8 text-sm cursor-pointer"
                  value={filters.eventFilter}
                  onChange={(e) =>
                    handleFilterChange("eventFilter", e.target.value)
                  }
                >
                  <option value="all">All Status</option>
                  <option value="delivered">Delivered</option>
                  <option value="rto_delivered">RTO Delivered</option>
                  <option value="lost">Lost</option>
                </select>
                <select
                  className="h-[38px] min-w-[130px] border border-[#dfe5ec] rounded-lg bg-white text-[#40536b] px-3 pr-8 text-sm cursor-pointer"
                  value={filters.paymentFilter}
                  onChange={(e) =>
                    handleFilterChange("paymentFilter", e.target.value)
                  }
                >
                  <option value="all">All Payment</option>
                  <option value="cod">COD</option>
                  <option value="prepaid">Prepaid</option>
                  <option value="creditNote">Credit Note</option>
                </select>
                <button
                  className="h-[38px] px-3 rounded-lg border border-[#dfe5ec] bg-white text-[#66758a] text-sm font-bold hover:bg-[#0446DB] hover:text-white transition-colors cursor-pointer"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      componentSearch: "",
                      eventFilter: "all",
                      paymentFilter: "all",
                    }))
                  }
                >
                  Reset Filters
                </button>
                <span className="text-xs text-[#66758a] ml-auto">
                  {filteredComponents.length} results
                </span>
              </div>

              {componentsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
              ) : (
                <div className="w-full overflow-x-auto">
                  <table className="w-full border-collapse min-w-[1200px]">
                    <thead>
                      <tr>
                        <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                          AWB
                        </th>
                        <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                          Courier
                        </th>
                        <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                          Status
                        </th>
                        <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="h-[40px] px-3 text-right border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                          Weight
                        </th>
                        <th className="h-[40px] px-3 text-right border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                          Freight
                        </th>
                        <th className="h-[40px] px-3 text-right border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                          COD
                        </th>
                        <th className="h-[40px] px-3 text-right border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                          RTO
                        </th>
                        <th className="h-[40px] px-3 text-right border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                          Insurance
                        </th>
                        <th className="h-[40px] px-3 text-right border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                          Taxable
                        </th>
                        <th className="h-[40px] px-3 text-right border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginateData(filteredComponents).length === 0 ? (
                        <tr>
                          <td
                            colSpan="12"
                            className="px-5 py-12 text-center text-[#66758a]"
                          >
                            <strong className="block text-[#12263f] text-base mb-1.5">
                              No component lines match these filters
                            </strong>
                          </td>
                        </tr>
                      ) : (
                        paginateData(filteredComponents).map((row, idx) => {
                          const isExpanded = expandedAwbs.has(row.awb);
                          return (
                            <React.Fragment key={row.awb || idx}>
                              <tr
                                className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                                onClick={() => toggleAWBExpansion(row.awb)}
                              >
                                <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle">
                                  <div className="flex items-center gap-2">
                                    <button
                                      className={`w-6 h-6 flex items-center justify-center rounded-md border transition-all duration-200 ${
                                        isExpanded
                                          ? "border-blue-400 bg-blue-50 text-blue-600"
                                          : "border-[#dfe5ec] bg-white text-[#66758a] hover:bg-gray-50"
                                      }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleAWBExpansion(row.awb);
                                      }}
                                    >
                                      {isExpanded ? "−" : "+"}
                                    </button>
                                    <span className="font-bold text-sm text-blue-600">
                                      {row.awb}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle">
                                  <span className="text-sm">
                                    {row.order_id || "-"}
                                  </span>
                                </td>
                                <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle">
                                  <span className="text-sm">
                                    {row.courier || "-"}
                                  </span>
                                </td>
                                <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle">
                                  {statusMarkup(
                                    row.shipment_status || row.event,
                                  )}
                                </td>
                                <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle">
                                  <span
                                    className={`px-2 py-1 rounded-md text-xs font-medium ${row.payment_type === "COD" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}
                                  >
                                    {row.payment_type || "-"}
                                  </span>
                                </td>
                                <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle text-right">
                                  <span className="text-sm">
                                    {row.charged_weight || 0} kg
                                  </span>
                                </td>
                                <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle text-right font-mono">
                                  {row.freight_charge
                                    ? formatMoney(row.freight_charge)
                                    : "—"}
                                </td>
                                <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle text-right font-mono text-amber-600">
                                  {row.cod_charge
                                    ? formatMoney(row.cod_charge)
                                    : "—"}
                                </td>
                                <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle text-right font-mono text-red-600">
                                  {row.rto_freight_charge
                                    ? formatMoney(row.rto_freight_charge)
                                    : "—"}
                                </td>
                                <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle text-right font-mono text-purple-600">
                                  {row.insurance_charge
                                    ? formatMoney(row.insurance_charge)
                                    : "—"}
                                </td>
                                <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle text-right font-mono">
                                  {row.taxable_amount
                                    ? formatMoney(row.taxable_amount)
                                    : "—"}
                                </td>
                                <td className="px-3 py-2 border-b border-[#edf1f5] text-sm align-middle text-right font-mono font-extrabold">
                                  <span
                                    className={
                                      row.total_amount >= 0
                                        ? "text-[#12263f]"
                                        : "text-red-600"
                                    }
                                  >
                                    {formatMoney(row.total_amount)}
                                  </span>
                                </td>
                              </tr>
                              {isExpanded && (
                                <tr className="bg-[#f8fafc] border-b border-[#edf1f5]">
                                  <td colSpan="12" className="px-4 py-3">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                      <div>
                                        <span className="text-[#66758a] text-xs block">
                                          Merchant Order
                                        </span>
                                        <span className="font-medium">
                                          {row.merchant_order_id || "-"}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-[#66758a] text-xs block">
                                          GST Type
                                        </span>
                                        <span className="font-medium">
                                          {row.gst_type || "N/A"}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-[#66758a] text-xs block">
                                          CGST
                                        </span>
                                        <span className="font-medium">
                                          {formatMoney(row.cgst_amount)}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-[#66758a] text-xs block">
                                          SGST
                                        </span>
                                        <span className="font-medium">
                                          {formatMoney(row.sgst_amount)}
                                        </span>
                                      </div>
                                      {row.igst_amount > 0 && (
                                        <div>
                                          <span className="text-[#66758a] text-xs block">
                                            IGST
                                          </span>
                                          <span className="font-medium">
                                            {formatMoney(row.igst_amount)}
                                          </span>
                                        </div>
                                      )}
                                      <div>
                                        <span className="text-[#66758a] text-xs block">
                                          Direction
                                        </span>
                                        <span
                                          className={`font-medium ${row.direction === "Debit" ? "text-red-600" : "text-green-600"}`}
                                        >
                                          {row.direction}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-[#66758a] text-xs block">
                                          Unclassified
                                        </span>
                                        <span className="font-medium">
                                          {formatMoney(row.unclassified_charge)}
                                        </span>
                                      </div>
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
              )}

              {filteredComponents.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t border-[#dfe5ec] bg-[#fafbfd]">
                  <span className="text-sm text-[#66758a]">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredComponents.length,
                    )}{" "}
                    of {filteredComponents.length} entries
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className="px-4 py-1.5 rounded-md border border-[#dfe5ec] bg-white text-sm font-bold disabled:opacity-50 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-1.5 rounded-md bg-blue-600 text-white text-sm font-bold">
                      {currentPage}
                    </span>
                    <button
                      disabled={
                        currentPage === getTotalPages(filteredComponents.length)
                      }
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(
                            prev + 1,
                            getTotalPages(filteredComponents.length),
                          ),
                        )
                      }
                      className="px-4 py-1.5 rounded-md border border-[#dfe5ec] bg-white text-sm font-bold disabled:opacity-50 hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Credit Notes Tab - Simplified */}
          {activeTab === "credit-notes" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 sm:p-5 border-b border-[#dfe5ec]">
                <div>
                  <span className="block text-[#78869a] text-xs tracking-widest font-extrabold uppercase">
                    Credit Notes
                  </span>
                  <h3 className="text-xl my-1">
                    {creditNotesPagination.total} credit note
                    {creditNotesPagination.total !== 1 ? "s" : ""}
                  </h3>
                  <p className="text-[#66758a] text-sm">
                    List of all credit notes generated.
                  </p>
                </div>
                <button
                  className="h-[42px] px-4 rounded-lg border border-[#cfd8e3] bg-white text-[#243c57] text-sm font-bold whitespace-nowrap transition-all hover:-translate-y-0.5 hover:shadow-sm flex items-center gap-2"
                  onClick={() =>
                    loadCreditNotes({
                      page: 1,
                      limit: creditNotesPagination.limit || 20,
                    })
                  }
                  disabled={creditNotesLoading}
                >
                  {creditNotesLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-gray-400 border-t-blue-600 rounded-full animate-spin" />{" "}
                      Loading...
                    </>
                  ) : (
                    "Refresh"
                  )}
                </button>
              </div>
              <div className="p-4 bg-[#fafbfd]">
                {creditNotesLoading ? (
                  <div className="p-8 text-center text-[#66758a]">
                    <div className="flex justify-center mb-3">
                      <span className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                    <strong className="block text-[#12263f] text-base mb-1">
                      Loading credit notes...
                    </strong>
                  </div>
                ) : creditNotes.length === 0 ? (
                  <div className="p-8 text-center text-[#66758a] bg-white rounded-lg">
                    <strong className="block text-[#12263f] text-base mb-1">
                      No credit notes found
                    </strong>
                  </div>
                ) : (
                  <>
                    <div className="w-full overflow-x-auto">
                      <table className="w-full border-collapse min-w-[1000px]">
                        <thead>
                          <tr>
                            <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                              Credit Note
                            </th>
                            <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                              Merchant
                            </th>
                            <th className="h-[40px] px-3 text-right border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                              Total
                            </th>
                            <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                              Status
                            </th>
                            <th className="h-[40px] px-3 text-left border-b border-[#dfe5ec] text-[#6d7b8e] bg-white text-xs uppercase tracking-wider">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {creditNotes.map((note, idx) => (
                            <tr
                              key={note.id || idx}
                              className="hover:bg-blue-50/60 transition-colors"
                            >
                              <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle">
                                <span className="text-purple-600 font-bold text-sm whitespace-nowrap">
                                  {note.invoice_number || "N/A"}
                                </span>
                              </td>
                              <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle">
                                <span className="block text-[#12263f] font-bold text-sm">
                                  {note.merchant_name ||
                                    `Merchant ${note.merchant_id}`}
                                </span>
                                <span className="block mt-0.5 text-[#66758a] text-xs">
                                  ID: {note.merchant_id}
                                </span>
                              </td>
                              <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle text-right font-mono font-bold text-purple-600">
                                {formatMoney(note.total_amount || 0)}
                              </td>
                              <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle">
                                {statusMarkup(note.status)}
                              </td>
                              <td className="px-3 py-3 border-b border-[#edf1f5] text-sm align-middle">
                                {formatDate(note.generation_date)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {creditNotesPagination.totalPages > 1 && (
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t border-[#dfe5ec] bg-[#fafbfd]">
                        <span className="text-sm text-[#66758a]">
                          Showing{" "}
                          {(creditNotesPagination.page - 1) *
                            creditNotesPagination.limit +
                            1}{" "}
                          to{" "}
                          {Math.min(
                            creditNotesPagination.page *
                              creditNotesPagination.limit,
                            creditNotesPagination.total,
                          )}{" "}
                          of {creditNotesPagination.total} entries
                        </span>
                        <div className="flex gap-2">
                          <button
                            disabled={
                              creditNotesPagination.page === 1 ||
                              creditNotesLoading
                            }
                            onClick={() =>
                              loadCreditNotes({
                                page: creditNotesPagination.page - 1,
                                limit: creditNotesPagination.limit,
                              })
                            }
                            className="px-4 py-1.5 rounded-md border border-[#dfe5ec] bg-white text-sm font-bold disabled:opacity-50 hover:bg-gray-50"
                          >
                            Previous
                          </button>
                          <span className="px-4 py-1.5 rounded-md bg-blue-600 text-white text-sm font-bold">
                            {creditNotesPagination.page} /{" "}
                            {creditNotesPagination.totalPages}
                          </span>
                          <button
                            disabled={
                              creditNotesPagination.page ===
                                creditNotesPagination.totalPages ||
                              creditNotesLoading
                            }
                            onClick={() =>
                              loadCreditNotes({
                                page: creditNotesPagination.page + 1,
                                limit: creditNotesPagination.limit,
                              })
                            }
                            className="px-4 py-1.5 rounded-md border border-[#dfe5ec] bg-white text-sm font-bold disabled:opacity-50 hover:bg-gray-50"
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
          )}

          {/* Failed Generations Tab - Simplified */}
          {activeTab === "failed" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 sm:p-5 border-b border-[#dfe5ec]">
                <div>
                  <span className="block text-[#78869a] text-xs tracking-widest font-extrabold uppercase">
                    Failed Generations
                  </span>
                  <h3 className="text-xl my-1">
                    {failedTotal} failed generation
                    {failedTotal !== 1 ? "s" : ""}
                  </h3>
                  <p className="text-[#66758a] text-sm">
                    Select and retry failed generations.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    className="h-[42px] px-4 rounded-lg border border-[#cfd8e3] bg-white text-[#243c57] text-sm font-bold whitespace-nowrap transition-all hover:-translate-y-0.5 hover:shadow-sm flex items-center gap-2"
                    onClick={() =>
                      loadFailedGenerations(failedPage, failedLimit)
                    }
                    disabled={failedGenerationsLoading}
                  >
                    {failedGenerationsLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-gray-400 border-t-blue-600 rounded-full animate-spin" />{" "}
                        Loading...
                      </>
                    ) : (
                      "Refresh"
                    )}
                  </button>
                  <button
                    className="h-[42px] px-4 rounded-lg border border-blue-600 bg-blue-600 text-white text-sm font-bold whitespace-nowrap shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    onClick={handleRetryFailed}
                    disabled={
                      selectedFailedIds.size === 0 ||
                      retryingFailed ||
                      failedGenerationsLoading
                    }
                  >
                    {retryingFailed ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                        Retrying...
                      </>
                    ) : (
                      <>↻ Retry Selected ({selectedFailedIds.size})</>
                    )}
                  </button>
                </div>
              </div>
              <div className="p-4 bg-[#fafbfd]">
                {failedGenerationsLoading ? (
                  <div className="p-8 text-center text-[#66758a]">
                    <div className="flex justify-center mb-3">
                      <span className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                    <strong className="block text-[#12263f] text-base mb-1">
                      Loading...
                    </strong>
                  </div>
                ) : failedGenerations.length === 0 ? (
                  <div className="p-8 text-center text-[#66758a] bg-white rounded-lg">
                    <strong className="block text-[#12263f] text-base mb-1">
                      No failed generations
                    </strong>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-4 px-2">
                      <input
                        type="checkbox"
                        checked={failedGenerations.every((log) =>
                          selectedFailedIds.has(log.log_id),
                        )}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const newSet = new Set(selectedFailedIds);
                          if (checked) {
                            failedGenerations.forEach((log) =>
                              newSet.add(log.log_id),
                            );
                          } else {
                            failedGenerations.forEach((log) =>
                              newSet.delete(log.log_id),
                            );
                          }
                          setSelectedFailedIds(newSet);
                        }}
                        className="accent-blue-600 w-4 h-4"
                      />
                      <span className="text-sm font-medium text-[#12263f]">
                        Select All ({failedGenerations.length} on this page)
                      </span>
                    </div>
                    <div className="space-y-2">
                      {failedGenerations.map((log) => {
                        const isSelected = selectedFailedIds.has(log.log_id);
                        return (
                          <div
                            key={log.log_id}
                            className={`w-full bg-white rounded-lg border shadow-sm overflow-hidden cursor-pointer transition-all ${
                              isSelected
                                ? "border-blue-600 bg-blue-50"
                                : "border-[#d9e1ea] hover:bg-gray-50"
                            }`}
                            onClick={() => {
                              setSelectedFailedIds((prev) => {
                                const newSet = new Set(prev);
                                if (newSet.has(log.log_id))
                                  newSet.delete(log.log_id);
                                else newSet.add(log.log_id);
                                return newSet;
                              });
                            }}
                          >
                            <div className="flex flex-wrap items-center gap-3 sm:gap-5 px-4 py-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                readOnly
                                className="accent-blue-600 w-4 h-4"
                              />
                              <div className="w-8 h-8 flex items-center justify-center bg-red-100 rounded-lg">
                                <span className="text-red-600 font-bold text-lg ">
                                  ×
                                </span>
                              </div>
                              <div className="min-w-[150px]">
                                <div className="text-sm font-bold text-[#243c57]">
                                  {log.merchant_name ||
                                    `Merchant ${log.merchant_id}`}
                                </div>
                                <div className="text-xs text-[#66758a]">
                                  ID: {log.merchant_id}
                                </div>
                                <div className="text-xs text-[#66758a]">
                                  {formatDate(log.generation_date)}
                                </div>
                              </div>
                              <div className="flex-1 min-w-[150px]">
                                <div className="text-sm font-bold text-red-600">
                                  Generation Failed
                                </div>
                                <div className="text-xs text-[#66758a]">
                                  {log.message || "Unknown error"}
                                </div>
                              </div>
                              <span className="px-2.5 py-1 rounded-md bg-red-100 text-red-700 text-xs font-bold">
                                {log.status_code || "500"}
                              </span>
                              <div className="text-right text-xs text-[#66758a]">
                                <div>{formatTime(log.created_at)}</div>
                                <div>{formatDate(log.created_at)}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {failedTotalPages > 1 && (
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 pt-4 border-t border-[#dfe5ec]">
                        <span className="text-sm text-[#66758a]">
                          Showing {(failedPage - 1) * failedLimit + 1} to{" "}
                          {Math.min(failedPage * failedLimit, failedTotal)} of{" "}
                          {failedTotal} entries
                        </span>
                        <div className="flex gap-2">
                          <button
                            disabled={
                              failedPage === 1 || failedGenerationsLoading
                            }
                            onClick={() => {
                              setFailedPage((p) => p - 1);
                              loadFailedGenerations(
                                failedPage - 1,
                                failedLimit,
                              );
                            }}
                            className="px-4 py-1.5 rounded-md border border-[#dfe5ec] bg-white text-sm font-bold disabled:opacity-50 hover:bg-gray-50"
                          >
                            Previous
                          </button>
                          <span className="px-4 py-1.5 rounded-md bg-blue-600 text-white text-sm font-bold">
                            {failedPage} / {failedTotalPages}
                          </span>
                          <button
                            disabled={
                              failedPage === failedTotalPages ||
                              failedGenerationsLoading
                            }
                            onClick={() => {
                              setFailedPage((p) => p + 1);
                              loadFailedGenerations(
                                failedPage + 1,
                                failedLimit,
                              );
                            }}
                            className="px-4 py-1.5 rounded-md border border-[#dfe5ec] bg-white text-sm font-bold disabled:opacity-50 hover:bg-gray-50"
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
          )}

          {/* Activity Tab - Simplified */}
          {activeTab === "activity" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 sm:p-5 border-b border-[#dfe5ec]">
                <div>
                  <span className="block text-black text-xl tracking-widest font-extrabold uppercase">
                    Audit Trail
                  </span>
                  <h3 className="text-xl my-1">Batch activity</h3>
                  {batchId && (
                    <p className="text-[#66758a] text-sm">
                      Batch ID: {batchId}
                    </p>
                  )}
                </div>
                <button
                  className="h-[42px] px-4 rounded-lg border border-[#cfd8e3] bg-white text-[#243c57] text-sm font-bold whitespace-nowrap transition-all hover:-translate-y-0.5 hover:shadow-sm flex items-center gap-2"
                  onClick={loadGenerationLogs}
                  disabled={logsLoading}
                >
                  {logsLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-gray-400 border-t-blue-600 rounded-full animate-spin" />{" "}
                      Loading...
                    </>
                  ) : (
                    "Refresh"
                  )}
                </button>
              </div>
              <div className="max-w-[850px] p-4 sm:p-6">
                {logsLoading ? (
                  <div className="p-8 text-center text-[#66758a]">
                    <div className="flex justify-center mb-3">
                      <span className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                    <strong className="block text-[#12263f] text-base mb-1">
                      Loading audit logs...
                    </strong>
                  </div>
                ) : activityItems.length === 0 ? (
                  <div className="p-8 text-center text-[#66758a] bg-white rounded-lg border border-[#dfe5ec]">
                    <strong className="block text-[#12263f] text-base mb-1">
                      No activity yet
                    </strong>
                    <p className="text-sm">
                      Run a batch to see activity logs here.
                    </p>
                  </div>
                ) : (
                  activityItems.map((item, idx) => {
                    let statusColor = "bg-[#0446DB]";
                    let statusBorder = "#0446DB";

                    if (
                      item.outcome === "failed" ||
                      item.outcome === "error" ||
                      item.status_code >= 400
                    ) {
                      statusColor = "bg-red-600";
                      statusBorder = "#fca5a5";
                    } else if (
                      item.outcome === "no_activity" ||
                      item.outcome === "zero_net" ||
                      item.outcome === "skipped_duplicate" ||
                      item.outcome === "duplicate"
                    ) {
                      statusColor = "bg-amber-500";
                      statusBorder = "#fcd34d";
                    } else if (
                      item.outcome === "generated" ||
                      item.outcome === "success" ||
                      item.outcome === "complete"
                    ) {
                      statusColor = "bg-green-600";
                      statusBorder = "#6ee7b7";
                    } else if (
                      item.outcome === "warning" ||
                      item.outcome === "pending"
                    ) {
                      statusColor = "bg-yellow-500";
                      statusBorder = "#fbbf24";
                    }

                    return (
                      <div
                        key={idx}
                        className={`grid grid-cols-[60px_20px_1fr] sm:grid-cols-[80px_24px_1fr] gap-3 ${idx === activityItems.length - 1 ? "pb-0" : ""}`}
                      >
                        <div className="text-right text-[#66758a] text-xs pt-0.5">
                          {item.time}
                        </div>
                        <div className="flex flex-col items-center">
                          <span
                            className={`w-4 h-4 flex-shrink-0 rounded-full ${statusColor} border-2 border-white`}
                            style={{ boxShadow: `0 0 0 2px ${statusBorder}` }}
                          />
                          {idx < activityItems.length - 1 && (
                            <span className="w-px flex-1 bg-[#dfe5ec] mt-0.5" />
                          )}
                        </div>
                        <div
                          className={
                            idx < activityItems.length - 1 ? "pb-5" : ""
                          }
                        >
                          <strong className="block text-sm">
                            {item.title}
                          </strong>
                          <p className="text-[#66758a] text-xs leading-4 mt-0.5">
                            {item.body}
                          </p>
                          {item.merchant_id && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                              Merchant: {item.merchant_id}
                            </span>
                          )}
                          {item.period_start && item.period_end && (
                            <span className="inline-block mt-1 ml-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              {formatDate(item.period_start)} -{" "}
                              {formatDate(item.period_end)}
                            </span>
                          )}
                          <span className="inline-flex mt-1.5 px-2.5 py-0.5 bg-[#eef2f6] rounded-md text-[#637287] text-xs font-bold">
                            {item.actor}
                          </span>

                          {item.outcome && (
                            <span className="inline-flex mt-1.5 ml-1 px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded-md text-xs">
                              {item.outcome}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </article>

        {/* Submit Modal */}
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="w-[min(580px,calc(100vw-30px))] max-h-[calc(100vh-36px)] overflow-auto bg-white border border-[#dfe5ec] rounded-[12px] shadow-lg">
              <div className="flex justify-between items-start gap-4 p-5 border-b border-[#dfe5ec]">
                <div>
                  <span className="block text-[#78869a] text-xs tracking-widest font-extrabold uppercase">
                    FINAL REVIEW
                  </span>
                  <h2 className="text-2xl mt-1.5 font-bold">
                    Submit & create invoices
                  </h2>
                  <p className="text-[#66758a] text-sm mt-1">
                    {selectedInvoiceCount} invoice
                    {selectedInvoiceCount !== 1 ? "s" : ""} selected
                  </p>
                </div>
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#dfe5ec] bg-white text-[#66758a] text-2xl hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setIsSubmitModalOpen(false);
                    setConfirmSubmission(true);
                  }}
                >
                  ×
                </button>
              </div>
              <div className="p-5">
                <div className="flex gap-3 p-4 rounded-lg bg-amber-50 text-amber-800 border border-[#f0d9ad]">
                  <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full bg-amber-500 text-white font-extrabold text-sm">
                    !
                  </span>
                  <div>
                    <strong className="text-sm">
                      This action creates seller invoices
                    </strong>
                    <p className="text-xs leading-4 mt-0.5">
                      {selectedInvoiceCount} invoice
                      {selectedInvoiceCount !== 1 ? "s" : ""} will be created.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3.5">
                  <div className="p-3 border border-[#dfe5ec] rounded-lg bg-blue-50">
                    <small className="block text-[#66758a] text-xs uppercase tracking-wide">
                      Selected
                    </small>
                    <strong className="block mt-1 text-2xl text-blue-600">
                      {selectedInvoiceCount}
                    </strong>
                  </div>
                  <div className="p-3 border border-[#dfe5ec] rounded-lg bg-green-50">
                    <small className="block text-[#66758a] text-xs uppercase tracking-wide">
                      Ready to Submit
                    </small>
                    <strong className="block mt-1 text-2xl text-green-600">
                      {selectedInvoiceCount}
                    </strong>
                  </div>
                  <div className="p-3 border border-[#dfe5ec] rounded-lg bg-red-50">
                    <small className="block text-[#66758a] text-xs uppercase tracking-wide">
                      Excluded
                    </small>
                    <strong className="block mt-1 text-2xl text-red-600">
                      {
                        invoiceRows.filter((r) => r.validation === "Failed")
                          .length
                      }
                    </strong>
                  </div>
                  <div className="p-3 border border-[#0446DB] bg-[#0446DB] text-white rounded-lg">
                    <small className="block text-[#a8bad0] text-xs uppercase tracking-wide">
                      Net Amount
                    </small>
                    <strong className="block mt-1 text-2xl">
                      {formatMoney(netAmount)}
                    </strong>
                  </div>
                </div>
                <label className="grid grid-cols-[22px_1fr] gap-3 mt-4 p-4 border border-[#dfe5ec] rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={confirmSubmission}
                    onChange={(e) => setConfirmSubmission(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 mt-0.5"
                  />
                  <div>
                    <strong className="text-sm">
                      I confirm the preview and totals have been reviewed.
                    </strong>
                    <small className="block mt-0.5 text-[#66758a] text-xs leading-4">
                      {selectedInvoiceCount} invoice
                      {selectedInvoiceCount !== 1 ? "s" : ""} will be sent to
                      the Create Invoice API.
                    </small>
                  </div>
                </label>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2.5 p-4 border-t border-[#dfe5ec] bg-[#fafbfd] rounded-b-[12px]">
                <button
                  className="h-[46px] px-5 rounded-lg border border-[#cfd8e3] bg-white text-[#243c57] text-sm font-bold whitespace-nowrap transition-all hover:-translate-y-0.5 hover:shadow-sm"
                  onClick={() => {
                    setIsSubmitModalOpen(false);
                    setConfirmSubmission(true);
                  }}
                >
                  Back
                </button>
                <button
                  className="h-[46px] px-6 rounded-lg border border-blue-600 bg-blue-600 text-white text-sm font-bold whitespace-nowrap shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!confirmSubmission || selectedInvoiceCount === 0}
                  onClick={submitInvoices}
                >
                  Create {selectedInvoiceCount} invoice
                  {selectedInvoiceCount !== 1 ? "s" : ""}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM INVOICE MODAL (also in preview) */}
        {customInvoiceModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="w-[min(580px,calc(100vw-30px))] max-h-[calc(100vh-36px)] overflow-auto bg-white border border-[#dfe5ec] rounded-[12px] shadow-lg">
              <div className="flex justify-between items-start gap-4 p-5 border-b border-[#dfe5ec]">
                <div>
                  <span className="block text-[#78869a] text-xs tracking-widest font-extrabold uppercase">
                    Custom Invoice
                  </span>
                  <h2 className="text-2xl mt-1.5">Generate Custom Invoice</h2>
                  {customInvoiceModal.source === "drawer" ? (
                    <p className="text-[#66758a] text-sm mt-1">
                      Merchant ID: {customInvoiceModal.merchantId}
                    </p>
                  ) : (
                    <div className="mt-1">
                      <label className="block text-[#12263f] font-bold text-sm mb-1.5">
                        Select Merchant
                      </label>
                      <select
                        value={customInvoiceModal.merchantId || ""}
                        onChange={(e) =>
                          setCustomInvoiceModal((prev) => ({
                            ...prev,
                            merchantId: e.target.value || null,
                          }))
                        }
                        className="w-full h-11 px-3 border border-[#dfe5ec] rounded-lg bg-white text-[#12263f] text-sm"
                      >
                        <option value="">-- Choose a merchant --</option>
                        {sellerCatalog.map((seller) => (
                          <option key={seller.id} value={seller.id}>
                            {seller.name} ({seller.id})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#dfe5ec] bg-white text-[#66758a] text-2xl hover:bg-gray-50 transition-colors"
                  onClick={closeCustomInvoiceModal}
                >
                  ×
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#12263f] font-bold text-sm mb-1.5">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={customPeriodStart}
                      onChange={(e) => setCustomPeriodStart(e.target.value)}
                      min={
                        lastInvoicedThrough
                          ? new Date(
                              new Date(lastInvoicedThrough).getTime() +
                                86400000,
                            )
                              .toISOString()
                              .slice(0, 10)
                          : ""
                      }
                      className="w-full h-11 px-3 border border-[#dfe5ec] rounded-lg bg-white text-[#12263f] text-sm cursor-pointer"
                    />
                    {lastInvoicedThrough && (
                      <p className="text-xs text-amber-600 mt-1">
                        Start date must be after{" "}
                        {formatDate(lastInvoicedThrough)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[#12263f] font-bold text-sm mb-1.5">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={customPeriodEnd}
                      onChange={(e) => setCustomPeriodEnd(e.target.value)}
                      min={customPeriodStart || ""}
                      className="w-full h-11 px-3 border border-[#dfe5ec] rounded-lg bg-white text-[#12263f] text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2.5 pt-4 border-t border-[#dfe5ec]">
                  <button
                    className="h-[46px] px-5 rounded-lg border border-[#cfd8e3] bg-white text-[#243c57] text-sm font-bold whitespace-nowrap transition-all hover:-translate-y-0.5 hover:shadow-sm"
                    onClick={closeCustomInvoiceModal}
                    disabled={customGenerating}
                  >
                    Cancel
                  </button>
                  <button
                    className="h-[46px] px-6 rounded-lg border border-blue-600 bg-blue-600 text-white text-sm font-bold whitespace-nowrap shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleCustomInvoiceSubmit}
                    disabled={
                      customGenerating ||
                      !customPeriodStart ||
                      !customPeriodEnd ||
                      !customInvoiceModal.merchantId
                    }
                  >
                    {customGenerating ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      "Generate Invoice"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {renderDrawer()}
      </div>
    </>
  );
};

export default BillingAndInvoices;
