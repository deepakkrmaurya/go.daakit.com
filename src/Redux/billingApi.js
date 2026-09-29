import AxiosInstance from "../Helper/axiosInstance";



const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong.";

const getApiData = (response) => response?.data?.data ?? response?.data ?? response ?? null;
const getApiMessage = (response) =>
  response?.message ||
  response?.data?.message ||
  response?.data?.data?.message ||
  "Request failed";
const getApiStatus = (response) =>
  Number(response?.status || response?.data?.status || response?.response?.status || 0);
const getApiCode = (response) =>
  response?.code ||
  response?.data?.code ||
  response?.data?.data?.code ||
  response?.response?.data?.code ||
  "";

const cleanParams = (params) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );

export const getBillingDashboard = async () => {
  try {
    const response = await AxiosInstance.get("/api/admin/billing/dashboard");
    return response.data;
  } catch (error) {
    console.error("[Billing API] Dashboard Error:", error?.response?.data || error);
    throw error;
  }
};


export const getMerchants = async (params = {}) => {
  try {
    const response = await AxiosInstance.get("/api/admin/billing/merchants", {
      params: cleanParams(params),
    });
    return response.data;
  } catch (error) {
    console.error("[Billing API] Merchant List Error:", error?.response?.data || error);
    throw error;
  }
};


export const getMerchantDetails = async (merchantId) => {
  if (!merchantId) throw new Error("Merchant ID is required.");
  try {
    const response = await AxiosInstance.get(`/api/admin/billing/merchants/${merchantId}`);
    return response.data;
  } catch (error) {
    console.error("[Billing API] Merchant Detail Error:", error?.response?.data || error);
    throw error;
  }
};


export const exportMerchantsBilling = async (params = {}) => {
  try {
    const response = await AxiosInstance.get("/api/admin/billing/merchants/export", {
      params: cleanParams(params),
      responseType: "blob",
    });

    const contentType = response.headers?.["content-type"] || "text/csv";
    const blob = new Blob([response.data], { type: contentType });

    const disposition = response.headers?.["content-disposition"] || "";
    const filenameMatch = disposition.match(/filename[^;=]*=((['"]).*?\2|[^;]*)/i);
    const filename = filenameMatch
      ? filenameMatch[1].replace(/["']/g, "")
      : `merchants_billing_${new Date().toISOString().slice(0, 10)}.csv`;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("[Billing API] Merchants Export Error:", error?.response?.data || error);
    throw error;
  }
};


export const getBillingCycle = async (merchantId) => {
  if (!merchantId) throw new Error("Merchant ID is required.");
  try {
    const response = await AxiosInstance.get(`/api/admin/merchants/${merchantId}/billing-cycle`);
    return response.data;
  } catch (error) {
    console.error("[Billing API] Billing Cycle Error:", error?.response?.data || error);
    throw error;
  }
};


export const getBillingCycleHistory = async (merchantId) => {
  if (!merchantId) throw new Error("Merchant ID is required.");
  try {
    const response = await AxiosInstance.get(`/api/admin/merchants/${merchantId}/billing-cycle-history`);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    if (message.toLowerCase().includes("no billing-cycle history found")) {
      return {
        success: true,
        status: 200,
        data: { merchant_id: merchantId, history: [] },
      };
    }
    console.error("[Billing API] Billing Cycle History Error:", error?.response?.data || error);
    throw error;
  }
};

export const updateBillingCycle = async (merchantId, billingCycleDays) => {
  if (!merchantId) throw new Error("Merchant ID is required.");
  const cycle = Number(billingCycleDays);
  if (![15, 30].includes(cycle)) {
    throw new Error("Billing cycle must be either 15 or 30 days.");
  }
  try {
    const response = await AxiosInstance.patch(
      `/api/admin/merchants/${merchantId}/billing-cycle`,
      { billing_cycle_days: cycle }
    );
    return response.data;
  } catch (error) {
    console.error("[Billing API] Update Billing Cycle Error:", error?.response?.data || error);
    throw error;
  }
};


export const updateWalletLimit = async () => {
  throw new Error(
    "Wallet limit API is currently broken and must not be used."
  );
};


export const getInvoices = async (params = {}) => {
  try {
    const response = await AxiosInstance.get("/api/admin/invoices", {
      params: cleanParams(params),
    });
    return response.data;
  } catch (error) {
    console.error("[Billing API] Invoice List Error:", error?.response?.data || error);
    throw error;
  }
};


export const getInvoiceDetails = async (invoiceId) => {
  if (!invoiceId) throw new Error("Invoice ID is required.");
  try {
    const response = await AxiosInstance.get(`/api/admin/invoices/${invoiceId}`);
    return response.data;

  } catch (error) {
    console.error("[Billing API] Invoice Detail Error:", error?.response?.data || error);
    throw error;
  }
};


export const exportInvoiceShipments = async (invoiceId) => {
  if (!invoiceId) throw new Error("Invoice ID is required.");
  try {
    const response = await AxiosInstance.get(
      `/api/admin/invoices/${invoiceId}/shipments/export`,
      { responseType: "blob" }
    );

    const contentType = response.headers?.["content-type"] || "text/csv";
    const blob = new Blob([response.data], { type: contentType });

    const disposition = response.headers?.["content-disposition"] || "";
    const filenameMatch = disposition.match(/filename[^;=]*=((['"]).*?\2|[^;]*)/i);
    const filename = filenameMatch
      ? filenameMatch[1].replace(/["']/g, "")
      : `invoice_${invoiceId}_shipments.csv`;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("[Billing API] Invoice Export Error:", error?.response?.data || error);
    throw error;
  }
};

export const updatePaymentStatus = async (invoiceId, paymentStatus) => {
  if (!invoiceId) throw new Error("Invoice ID is required.");
  if (!["due", "paid"].includes(paymentStatus)) {
    throw new Error("Payment status must be 'due' or 'paid'.");
  }
  try {
    const response = await AxiosInstance.patch(
      `/api/admin/invoices/${invoiceId}/payment-status`,
      { payment_status: paymentStatus }
    );
    return response.data;
    
  } catch (error) {
    console.error("[Billing API] Update Payment Status Error:", error?.response?.data || error);
    throw error;
  }
};


export const regenerateInvoice = async (invoiceId) => {
  if (!invoiceId) throw new Error("Invoice ID is required.");
  try {
    const response = await AxiosInstance.post(
      `/api/admin/invoices/${invoiceId}/regenerate`
    );
    return response.data;
  } catch (error) {
    console.error("[Billing API] Regenerate Invoice Error:", error?.response?.data || error);
    throw error;
  }
};

export const generateInvoices = async (mode, merchantIds = [], generationDate) => {
  try {
    const payload = {
      mode: mode, 
      generation_date: generationDate,
    };
    if (mode === "selected" && merchantIds.length > 0) {
      payload.merchant_ids = merchantIds;
    }

    const response = await AxiosInstance.post(
      "/api/admin/merchants/invoices/generate",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Generate Invoices Error:", error);
    throw error;
  }
};

export const getGenerationLogs = async (params = {}) => {
  try {
    const response = await AxiosInstance.get("/api/admin/invoice-generation-logs", {
      params: cleanParams(params),
    });
    return response.data;
  } catch (error) {
    console.error("[Billing API] Generation Logs Error:", error?.response?.data || error);
    throw error;
  }
};


export const downloadInvoicePdf = async (invoiceId) => {
  if (!invoiceId) throw new Error("Invoice ID is required.");
  try {
    const response = await AxiosInstance.get(
      `/api/admin/invoices/${invoiceId}/pdf`,
      { responseType: "blob" }
    );

    const contentType = response.headers?.["content-type"] || "application/pdf";
    const blob = new Blob([response.data], { type: contentType });

    const disposition = response.headers?.["content-disposition"] || "";
    const filenameMatch = disposition.match(/filename[^;=]*=((['"]).*?\2|[^;]*)/i);
    const filename = filenameMatch
      ? filenameMatch[1].replace(/["']/g, "")
      : `invoice_${invoiceId}.pdf`;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("[Billing API] PDF Download Error:", error?.response?.data || error);
    throw error;
  }
};

export const generateMerchantInvoice = async (merchantId, generationDate) => {
  if (!merchantId) throw new Error("Merchant ID is required.");
  const payload = {};
  if (generationDate) payload.generation_date = generationDate;

  try {
    const response = await AxiosInstance.post(
      `/api/admin/merchants/${merchantId}/invoices/generate`,
      payload
    );
    return response.data;
  } catch (error) {
    if (error?.response?.status === 409) {
      return {
        success: false,
        status: 409,
        code: "DUPLICATE",
        message: error?.response?.data?.message || "Invoice already exists for this period.",
        data: error?.response?.data?.data || null,
      };
    }
    console.error("[Billing API] Single Invoice Generation Error:", error?.response?.data || error);
    throw error;
  }
};

export const getMerchantInvoices = async (merchantId, params = {}) => {
  if (!merchantId) throw new Error("Merchant ID is required.");
  try {
    const response = await AxiosInstance.get(`/api/admin/merchants/${merchantId}/invoices`, {
      params: cleanParams(params),
    });
    return response.data;
  } catch (error) {
    console.error("[Billing API] Merchant Invoices Error:", error?.response?.data || error);
    throw error;
  }
};

export const getFailedGenerations = async (params = {}) => {
  try {
    const response = await AxiosInstance.get("/api/admin/invoice-generation-logs/failed", {
      params: cleanParams(params),
    });
    return response.data;
  } catch (error) {
    console.error("[Billing API] Failed Generations Error:", error?.response?.data || error);
    throw error;
  }
};


export const retryFailedGenerations = async (targets) => {
  if (!Array.isArray(targets) || targets.length === 0) {
    throw new Error("targets must be a non-empty array");
  }
  try {
    const response = await AxiosInstance.post(
      "/api/admin/invoice-generation-logs/retry",
      { targets }
    );
    return response.data;
  } catch (error) {
    console.error("[Billing API] Retry Failed Generations Error:", error?.response?.data || error);
    throw error;
  }
};

export const getPublicInvoiceShipmentsCsv = async (invoiceId) => {
  if (!invoiceId) throw new Error("Invoice ID is required.");
  try {
    const response = await AxiosInstance.get(
      `/api/admin/public/invoices/${invoiceId}/shipments/export`,
      { responseType: "blob" }
    );
    return response.data;
  } catch (error) {
    console.error("[Billing API] Public Invoice CSV Error:", error?.response?.data || error);
    throw error;
  }
};


export const getCreditNotes = async (params = {}) => {
  try {
    const response = await AxiosInstance.get("/api/admin/credit-notes", {
      params: cleanParams(params),
    });
    return response.data;
  } catch (error) {
    console.error("[Billing API] Credit Notes Error:", error?.response?.data || error);
    throw error;
  }
};

export const generateCustomInvoice = async (merchantId, periodStart, periodEnd) => {
  if (!merchantId) throw new Error("Merchant ID is required.");
  if (!periodStart || !periodEnd) throw new Error("Period start and end are required.");
  
  try {
    const response = await AxiosInstance.post(
      `/api/admin/merchants/${merchantId}/invoices/generate-custom`,
      { period_start: periodStart, period_end: periodEnd }
    );
    return response.data;
  } catch (error) {
    const status = error?.response?.status;
    const data = error?.response?.data;
    
    if (status === 409 && data?.reason === "PERIOD_ALREADY_INVOICED") {
      return {
        success: false,
        status: 409,
        reason: "PERIOD_ALREADY_INVOICED",
        message: data.message,
        data: data.data,
      };
    }
    
    if (status === 400 && data?.reason === "CUSTOM_BILLING_NOT_ENABLED") {
      return {
        success: false,
        status: 400,
        reason: "CUSTOM_BILLING_NOT_ENABLED",
        message: data.message || "Custom billing not enabled for this merchant.",
      };
    }
    
    if (status === 200 && data?.success === false) {
      return data;
    }
    
    console.error("[Billing API] Custom Invoice Error:", error?.response?.data || error);
    throw error;
  }
};


export const getInvoiceGenerationJob = async (jobId) => {
  if (!jobId) throw new Error("Job ID is required.");
  try {
    const response = await AxiosInstance.get(`/api/admin/invoice-generation-jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error(
      "[Billing API] Invoice Generation Job Error:",
      error?.response?.data || error
    );
    throw error;
  }
};
export default {
  getBillingDashboard,
  getMerchants,
  getMerchantDetails,
  exportMerchantsBilling,
  getBillingCycle,
  getBillingCycleHistory,
  updateBillingCycle,
  updateWalletLimit,
  getInvoices,
  getInvoiceDetails,
  exportInvoiceShipments,
  updatePaymentStatus,
  generateInvoices,
  regenerateInvoice, 
  getGenerationLogs,
  downloadInvoicePdf,
  generateMerchantInvoice,
  getMerchantInvoices,
  getFailedGenerations,
  retryFailedGenerations,
  getPublicInvoiceShipmentsCsv,
  getCreditNotes,
  generateCustomInvoice,
  getInvoiceGenerationJob
};