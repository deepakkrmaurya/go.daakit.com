import AxiosInstance from "../Helper/axiosInstance";

export const downloadBlob = (blobData, filename) => {
  const blob = new Blob([blobData], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
};

export const exportEligibleShipments = async ({
  pickup_date,
  seller_id,
} = {}) => {
  const params = {};
  if (pickup_date) params.pickup_date = pickup_date;
  if (seller_id && String(seller_id).trim()) {
    params.seller_id = String(seller_id).trim();
  }

  const res = await AxiosInstance.get(
    "/api/admin/exportEligibleWeightShipments",
    { params, responseType: "blob" },
  );

  if (res?.data?.size > 0) {
    downloadBlob(
      res.data,
      `weight_export_${pickup_date || "all"}_${Date.now()}.csv`,
    );
  }

  return res;
};

// ============================================================
// 2. UPLOAD WEIGHT MIS
//    POST /api/admin/uploadWeightMIS
//    FormData: csvFile (file)
// ============================================================

export const uploadMIS = async (file) => {
  const formData = new FormData();
  formData.append("csvFile", file);

  const res = await AxiosInstance.post("/api/admin/uploadWeightMIS", formData);
  return res.data;
};

// ============================================================
// 3. DASHBOARD SUMMARY
//    GET /api/admin/weight/dashboard/summary
// ============================================================
export const getDashboardSummary = async () => {
  const res = await AxiosInstance.get("/api/admin/weight/dashboard/summary");
  return res.data;
};

// ============================================================
// 4. UPLOAD SUMMARY
//    GET /api/admin/weight/uploads/:id
// ============================================================
export const getUploadSummary = async (uploadId) => {
  const res = await AxiosInstance.get(`/api/admin/weight/uploads/${uploadId}`);
  return res.data;
};

// ============================================================
// 5. UPLOAD ROWS
//    GET /api/admin/weight/uploads/:id/rows
//    Query: page, limit, awb_number, seller_id,
//           validation_status ('valid' | 'invalid'), fallback ('true')
// ============================================================
export const getUploadRows = async (uploadId, params = {}) => {
  const res = await AxiosInstance.get(
    `/api/admin/weight/uploads/${uploadId}/rows`,
    { params },
  );
  return res.data;
};

// ============================================================
// 6. UPDATE ROW
//    PATCH /api/admin/weight/uploads/:id/rows/:rowId
//    Body: captured_dead_weight, captured_length, captured_breadth,
//          captured_height, capture_timestamp
// ============================================================
export const updateRow = async (uploadId, rowId, payload) => {
  try {
    const res = await AxiosInstance.patch(
      `/api/admin/weight/uploads/${uploadId}/rows/${rowId}`,
      payload,
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

// ============================================================
// 7. DISCARD DRAFT UPLOAD
//    DELETE /api/admin/weight/uploads/:id
// ============================================================
export const discardUpload = async (uploadId) => {
  const res = await AxiosInstance.delete(
    `/api/admin/weight/uploads/${uploadId}`,
  );
  return res.data;
};

// ============================================================
// 8. EXPORT ERRORS CSV
//    GET /api/admin/weight/uploads/:id/errors/export
//    Response: CSV blob → auto-download
// ============================================================
export const exportErrors = async (uploadId) => {
  const res = await AxiosInstance.get(
    `/api/admin/weight/uploads/${uploadId}/errors/export`,
    { responseType: "blob" },
  );
  downloadBlob(res.data, `weight_upload_${uploadId}_errors_${Date.now()}.csv`);

  return res;
};

// ============================================================
// 9. SUBMIT PREVIEW (dry run — no DB writes)
//    GET /api/admin/weight/uploads/:id/submit-preview
// ============================================================
export const getSubmitPreview = async (uploadId) => {
  const res = await AxiosInstance.get(
    `/api/admin/weight/uploads/${uploadId}/submit-preview`,
  );
  return res.data;
};

// ============================================================
// 10. SUBMIT UPLOAD
//     POST /api/admin/weight/uploads/:id/submit
// ============================================================
export const submitUpload = async (uploadId) => {
  const res = await AxiosInstance.post(
    `/api/admin/weight/uploads/${uploadId}/submit`,
  );
  return res.data;
};

// ============================================================
// 11. DISCREPANCIES
//     GET /api/admin/weight/uploads/:id/discrepancies
//     Query: page, limit
// ============================================================
export const getDiscrepancies = async (uploadId, params = {}) => {
  const res = await AxiosInstance.get(
    `/api/admin/weight/uploads/${uploadId}/discrepancies`,
    { params },
  );
  return res.data;
};

// ============================================================
// 12. EXPORT DISCREPANCIES CSV
//     GET /api/admin/weight/uploads/:id/discrepancies/export
//     Response: CSV blob → auto-download
// ============================================================
export const exportDiscrepancies = async (uploadId) => {
  const res = await AxiosInstance.get(
    `/api/admin/weight/uploads/${uploadId}/discrepancies/export`,
    { responseType: "blob" },
  );

  downloadBlob(
    res.data,
    `weight_upload_${uploadId}_discrepancies_${Date.now()}.csv`,
  );

  return res;
};

// 13. GET Merchant Discrepancies
export const getMerchantDiscrepancies = async (params = {}) => {
  try {
    const res = await AxiosInstance.get(
      "/api/merchant/weight/discrepancies",
      { params },
    );

    return res.data;
  } catch (error) {
    console.error(
      "[Merchant Weight API] getMerchantDiscrepancies Error:",
      error?.response?.data || error,
    );
    throw error;
  }
};

// 14. GET Merchant Discrepancy Detail
export const getMerchantDiscrepancyDetail = async (discrepancyId) => {
  try {
    const res = await AxiosInstance.get(
      `/api/merchant/weight/discrepancies/${discrepancyId}`,
    );

    return res.data;
  } catch (error) {
    console.error(
      "[Merchant Weight API] getMerchantDiscrepancyDetail Error:",
      error?.response?.data || error,
    );
    throw error;
  }
};

// 15. POST Accept Merchant Discrepancy
export const acceptMerchantDiscrepancy = async (discrepancyId) => {
  const idempotencyKey = crypto.randomUUID();
  try {
    const res = await AxiosInstance.post(
      `/api/merchant/weight/discrepancies/${discrepancyId}/accept`,
      {},
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      },
    );

    return res.data;
  } catch (error) {
    console.error(
      "[Merchant Weight API] acceptMerchantDiscrepancy Error:",
      error?.response?.data || error,
    );
    throw error;
  }
};

// 16. POST Reject / Dispute Merchant Discrepancy
export const rejectMerchantDiscrepancy = async ({
  discrepancyId,
  reason,
  comments,
  evidence = [],
}) => {
  try {
    const formData = new FormData();

    formData.append("reason", reason);
    formData.append("comments", comments);

    evidence.forEach((file) => {
      formData.append("evidence", file);
    });

    const res = await AxiosInstance.post(
      `/api/merchant/weight/discrepancies/${discrepancyId}/reject`,
      formData,
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

// 17. GET Export Merchant Discrepancies
export const exportMerchantDiscrepancies = async ({
  status,
  start_date,
  end_date,
} = {}) => {
  const params = {};

  if (status) params.status = status;
  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;

  try {
    const res = await AxiosInstance.get(
      "/api/merchant/weight/discrepancies/export",
      {
        params,
        responseType: "blob",
      },
    );

    if (res?.data?.size > 0) {
      downloadBlob(res.data, `merchant_weight_discrepancies_${Date.now()}.csv`);
    }

    return res;
  } catch (error) {
    throw error;
  }
};

export const acceptMerchantDiscrepanciesBulk = async ({ discrepancy_ids }) => {
  const res = await AxiosInstance.post(
    "/api/merchant/weight/discrepancies/accept-bulk",
    { discrepancy_ids },
  );
  return res.data;
};

export const getDisputeQueue = async (params = {}) => {
  const cleanParams = {};
  if (params.section) cleanParams.section = params.section;
  if (params.status) cleanParams.status = params.status;
  if (params.seller_id) cleanParams.seller_id = params.seller_id;
  if (params.awb_number) cleanParams.awb_number = params.awb_number;
  if (params.page) cleanParams.page = params.page;
  if (params.limit) cleanParams.limit = params.limit;

  const res = await AxiosInstance.get("/api/admin/weight/disputes", {
    params: cleanParams,
  });
  return res.data;
};

// ============================================================
// 18. GET DISPUTE DETAIL (Admin)
//     GET /api/admin/weight/disputes/:discrepancyId
// ============================================================
export const getDisputeDetail = async (discrepancyId) => {
  const res = await AxiosInstance.get(
    `/api/admin/weight/disputes/${discrepancyId}`,
  );
  return res.data;
};

export const getMerchantWeightDiscrepancyHistory = async (
  merchantId,
  filters = {},
) => {
  try {
    const res = await AxiosInstance.get(
      `/api/admin/weight/merchants/${merchantId}/history`,
      { params: filters },
    );
    return res.data;
  } catch (err) {
    return {
      success: false,
      status: err?.response?.status || 500,
      message:
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to fetch merchant history",
      error: err?.message,
    };
  }
};

// ============================================================
// 19. RESOLVE DISPUTE (Admin)
//     POST /api/admin/weight/disputes/:discrepancyId/resolve
//     Body: decision ("Seller Favour" | "Courier Favour"),
//           admin_notes, zoho_resolution_reference
// ============================================================
export const resolveDispute = async (
  discrepancyId,
  { decision, admin_notes, zoho_resolution_reference },
) => {
  const res = await AxiosInstance.post(
    `/api/admin/weight/disputes/${discrepancyId}/resolve`,
    {
      decision,
      admin_notes,
      zoho_resolution_reference,
    },
  );
  return res.data;
};

// ============================================================
// 20. CANCEL SUBMITTED UPLOAD (Admin)
//     POST /api/admin/weight/uploads/:id/cancel
//     Body: reason, approval_reference
// ============================================================
export const cancelSubmittedUpload = async (
  uploadId,
  { reason, approval_reference },
) => {
  const res = await AxiosInstance.post(
    `/api/admin/weight/uploads/${uploadId}/cancel`,
    {
      reason,
      approval_reference,
    },
  );
  return res.data;
};

export default {
  downloadBlob,
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

  getMerchantDiscrepancies,
  getMerchantDiscrepancyDetail,
  acceptMerchantDiscrepancy,
  rejectMerchantDiscrepancy,
  exportMerchantDiscrepancies,
  acceptMerchantDiscrepanciesBulk,

  getDisputeQueue,
  getDisputeDetail,
  resolveDispute,
  cancelSubmittedUpload,
  getMerchantWeightDiscrepancyHistory,
};
