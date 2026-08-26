import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Clock3,
  Download,
  FileText,
  RefreshCw,
  Upload,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const MAX_ROWS = 500;
const INSURANCE_COLUMN = "is_insurance";

const baseURL = import.meta.env.VITE_BASE_URL;
const merchantFrontAPI = `${String(baseURL || "").replace(
  /\/$/,
  "",
)}/api/merchant`;

const getToken = () =>
  localStorage.getItem("merchantToken") || localStorage.getItem("token");

const normalizeHeader = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

const findHeader = (headers, aliases) =>
  headers.find((header) => aliases.includes(normalizeHeader(header)));

const escapeCsvValue = (value) => {
  const text = String(value ?? "");

  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const parseCsv = (text) => {
  const rows = [];
  let currentRow = [];
  let currentCell = "";
  let insideQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];

    if (character === '"') {
      if (insideQuotes && nextCharacter === '"') {
        currentCell += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (character === "," && !insideQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
    } else if ((character === "\n" || character === "\r") && !insideQuotes) {
      if (character === "\r" && nextCharacter === "\n") {
        index += 1;
      }

      currentRow.push(currentCell);

      if (currentRow.some((cell) => String(cell).trim() !== "")) {
        rows.push(currentRow);
      }

      currentRow = [];
      currentCell = "";
    } else {
      currentCell += character;
    }
  }

  if (insideQuotes) {
    throw new Error("CSV contains an unclosed quoted value");
  }

  currentRow.push(currentCell);
  if (currentRow.some((cell) => String(cell).trim() !== "")) {
    rows.push(currentRow);
  }

  if (rows.length < 2) {
    throw new Error("CSV must contain a header and at least one data row");
  }

  const headers = rows[0].map(
    (header, index) =>
      String(header)
        .replace(/^\uFEFF/, "")
        .trim() || `column_${index + 1}`,
  );

  const normalizedHeaders = headers.map(normalizeHeader);
  const duplicateHeader = normalizedHeaders.find(
    (header, index) => normalizedHeaders.indexOf(header) !== index,
  );

  if (duplicateHeader) {
    throw new Error(`Duplicate CSV column: ${duplicateHeader}`);
  }

  const records = rows.slice(1).map((values, index) => ({
    id: `csv-row-${index + 2}`,
    csvRow: index + 2,
    data: Object.fromEntries(
      headers.map((header, columnIndex) => [header, values[columnIndex] ?? ""]),
    ),
    errors: [],
  }));

  return { headers, records };
};

const buildCsv = (headers, rows, insuranceLimit) => {
  const output = [headers.map(escapeCsvValue).join(",")];
  const totalAmountHeader = findHeader(headers, ["total_amount"]);
  console.log("Insurance limit:", insuranceLimit);

  const configuredLimit = Number(insuranceLimit || 0);
  const insuranceActive = configuredLimit >= 2000;

  rows.forEach((row) => {
    output.push(
      headers
        .map((header) => {
          if (normalizeHeader(header) === INSURANCE_COLUMN) {
            const totalAmount = Number(row.data[totalAmountHeader] || 0);

            return insuranceActive && totalAmount >= configuredLimit
              ? "1"
              : "0";
          }

          return escapeCsvValue(row.data[header]);
        })
        .join(","),
    );
  });

  return output.join("\r\n");
};

const downloadCsv = (contents, filename) => {
  const blob = new Blob([contents], { type: "text/csv;charset=utf-8" });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(downloadUrl);
};

const addSubmissionResultsToCsv = ({
  csvText,
  results,
  fallbackStatus = "",
  fallbackMessage = "",
  includeReason = false,
}) => {
  const { headers, records } = parseCsv(csvText);
  const orderNumberHeader = findHeader(headers, ["merchant_order_id"]);
  const metadataColumns = [
    "draft_id",
    "status",
    "message",
    ...(includeReason ? ["reason"] : []),
  ];
  const normalizedHeaders = new Set(headers.map(normalizeHeader));
  const outputHeaders = [
    ...headers,
    ...metadataColumns.filter(
      (column) => !normalizedHeaders.has(normalizeHeader(column)),
    ),
  ];
  const resultByOrderId = new Map(
    results
      .filter((result) => result?.merchant_order_id)
      .map((result) => [String(result.merchant_order_id).trim(), result]),
  );

  const outputRows = records.map((record, index) => {
    const orderNumber = orderNumberHeader
      ? String(record.data[orderNumberHeader] || "").trim()
      : "";
    const result = resultByOrderId.get(orderNumber) || results[index] || {};
    const resultStatus = result.status || fallbackStatus;
    const resultMessage = result.message || fallbackMessage;

    return outputHeaders
      .map((header) => {
        const existingValue = record.data[header];

        if (String(existingValue ?? "").trim()) {
          return escapeCsvValue(existingValue);
        }

        switch (normalizeHeader(header)) {
          case "draft_id":
            return escapeCsvValue(result.draft_id ?? "");
          case "status":
            return escapeCsvValue(resultStatus);
          case "message":
            return escapeCsvValue(resultMessage);
          case "reason":
            return escapeCsvValue(resultMessage);
          default:
            return escapeCsvValue(existingValue);
        }
      })
      .join(",");
  });

  return [outputHeaders.map(escapeCsvValue).join(","), ...outputRows].join(
    "\r\n",
  );
};

const inferBackendErrors = (message, headers) =>
  String(message || "")
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const backendColumn = item.match(/^([a-zA-Z0-9_]+)/)?.[1] || "server";
      const matchedHeader = headers.find(
        (header) => normalizeHeader(header) === normalizeHeader(backendColumn),
      );

      return {
        column: matchedHeader || backendColumn,
        message: item,
        source: "backend",
      };
    });

const mapBackendResults = (results, records, headers, insuranceLimit) => {
  const orderNumberHeader = findHeader(headers, ["merchant_order_id"]);
  const totalAmountHeader = findHeader(headers, ["total_amount"]);
  const configuredLimit = Number(insuranceLimit || 0);
  const insuranceActive = configuredLimit >= 2000;

  return results.map((result) => {
    const matchedRow = records.find(
      (row) =>
        String(row.data[orderNumberHeader] || "").trim() ===
        String(result.merchant_order_id || "").trim(),
    );

    const totalAmount = Number(
      result.total_amount ?? matchedRow?.data?.[totalAmountHeader] ?? 0,
    );

    const insuranceEligible = insuranceActive && totalAmount >= configuredLimit;

    return {
      ...result,
      row: result.row || result.csv_row || matchedRow?.csvRow || null,
      totalAmount,
      insuranceEligible,
      isInsurance: insuranceEligible ? "1" : "0",
      columnReferences:
        String(result.status).toLowerCase() === "failed"
          ? inferBackendErrors(result.message, headers).map(
              (error) => error.column,
            )
          : [],
    };
  });
};

const applyBackendValidation = (records, results, headers) => {
  const orderNumberHeader = findHeader(headers, ["merchant_order_id"]);
  const failedByOrderId = new Map(
    results
      .filter((result) => String(result.status).toLowerCase() === "failed")
      .map((result) => [String(result.merchant_order_id || "").trim(), result]),
  );

  return records
    .filter((record) =>
      failedByOrderId.has(String(record.data[orderNumberHeader] || "").trim()),
    )
    .map((record) => {
      const result = failedByOrderId.get(
        String(record.data[orderNumberHeader] || "").trim(),
      );

      return {
        ...record,
        errors: inferBackendErrors(result?.message, headers),
      };
    });
};

const statusMeta = {
  idle: { label: "Waiting for CSV", style: "bg-slate-100 text-slate-600" },
  ready: { label: "Ready to submit", style: "bg-blue-100 text-blue-700" },
  submitting: { label: "Processing", style: "bg-amber-100 text-amber-700" },
  completed: { label: "Completed", style: "bg-[#0446DB] text-white" },
  partial: {
    label: "Partially completed",
    style: "bg-orange-100 text-orange-700",
  },
  failed: { label: "Failed", style: "bg-red-100 text-red-700" },
};

export default function BulkUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedCsvText, setUploadedCsvText] = useState("");
  const [headers, setHeaders] = useState([]);
  const [previewRows, setPreviewRows] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSummary, setUploadSummary] = useState(null);
  const [uploadResults, setUploadResults] = useState([]);
  const [resultsPage, setResultsPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [validCsv, setValidCsv] = useState("");
  const [invalidCsv, setInvalidCsv] = useState("");
  const [job, setJob] = useState({ id: null, status: "idle" });
  const [insuranceLimit, setInsuranceLimit] = useState(0);
  const [insuranceLimitLoading, setInsuranceLimitLoading] = useState(true);

  const validRows = useMemo(
    () => previewRows.filter((row) => row.errors.length === 0),
    [previewRows],
  );
  const invalidRows = useMemo(
    () => previewRows.filter((row) => row.errors.length > 0),
    [previewRows],
  );
  const totalSubmitted = Number(
    uploadSummary?.total_orders ??
      uploadSummary?.total_rows ??
      uploadSummary?.total ??
      previewRows.length,
  );
  const totalCsvRows = Number(
    uploadSummary?.total_rows ??
      uploadSummary?.total_orders ??
      previewRows.length,
  );
  const createdCount = Number(
    uploadSummary?.created ?? uploadSummary?.booked ?? 0,
  );

  const failedCount = Number(uploadSummary?.failed ?? 0);

  const uploadCompleted = Boolean(uploadSummary);

  const hasInvalidCsv =
    failedCount > 0 && Boolean(invalidCsv?.trim() || uploadedCsvText?.trim());

  const hasValidCsv = createdCount > 0 && Boolean(validCsv?.trim());

  const processedCount = uploadSummary ? createdCount + failedCount : 0;

  const jobProgress = totalSubmitted
    ? Math.min(100, (processedCount / totalSubmitted) * 100)
    : 0;

  const clearSubmission = () => {
    setUploadError(null);
    setUploadSummary(null);
    setUploadResults([]);
    setValidCsv("");
    setInvalidCsv("");
    setJob({ id: null, status: "idle" });
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadedCsvText("");
    setHeaders([]);
    setPreviewRows([]);
    clearSubmission();
    setResultsPage(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchInsuranceLimit = async () => {
      try {
        setInsuranceLimitLoading(true);

        const token = getToken();

        const response = await fetch(`${merchantFrontAPI}/getInsuranceLimit`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "x-auth-token": token } : {}),
          },
        });

        const result = await response.json();

        if (!response.ok || result?.success === false) {
          throw new Error(result?.message || "Failed to fetch insurance limit");
        }

        const fetchedLimit = Number(
          result?.data?.insurance_limit ?? result?.insurance_limit ?? 0,
        );

        if (isMounted) {
          setInsuranceLimit(Number.isFinite(fetchedLimit) ? fetchedLimit : 0);
        }

        console.log("Insurance limit:", fetchedLimit);
      } catch (error) {
        console.error("Get insurance limit failed:", error);

        if (isMounted) {
          setInsuranceLimit(0);
        }
      } finally {
        if (isMounted) {
          setInsuranceLimitLoading(false);
        }
      }
    };

    fetchInsuranceLimit();

    return () => {
      isMounted = false;
    };
  }, []);

  const insuranceEnabled =
    !insuranceLimitLoading && Number(insuranceLimit) >= 2000;

  const handleFile = async (file) => {
    if (!file) return;

    const isCsv =
      file.name.toLowerCase().endsWith(".csv") || file.type === "text/csv";

    if (!isCsv) {
      toast.error("CSV file only.");
      return;
    }

    try {
      const text = await file.text();
      const parsed = parseCsv(text);

      if (parsed.records.length > MAX_ROWS) {
        throw new Error(
          `Maximum ${MAX_ROWS} rows are allowed. This CSV contains ${parsed.records.length} rows.`,
        );
      }

      const nextHeaders = parsed.headers.some(
        (header) => normalizeHeader(header) === INSURANCE_COLUMN,
      )
        ? parsed.headers
        : [...parsed.headers, INSURANCE_COLUMN];
      const insuranceHeader = nextHeaders.find(
        (header) => normalizeHeader(header) === INSURANCE_COLUMN,
      );

      const recordsWithInsurance = parsed.records.map((record) => ({
        ...record,
        data: {
          ...record.data,
          [insuranceHeader]: record.data[insuranceHeader] || "0",
        },
      }));
      clearSubmission();
      setSelectedFile(file);
      setUploadedCsvText(text);
      setHeaders(nextHeaders);
      setPreviewRows(recordsWithInsurance);
      setResultsPage(1);

      toast.success("CSV is ready for submission.");

      setJob({ id: null, status: "ready" });
    } catch (error) {
      console.error("CSV validation failed:", error);
      resetUpload();
      setUploadError({ message: error.message, details: [] });
      toast.error("Invalid CSV file.");
    }
  };

  const downloadTemplate = async () => {
    try {
      setDownloading(true);
      const token = getToken();
      const response = await fetch(
        `${merchantFrontAPI}/downloadDraftSampleCSV`,
        {
          headers: {
            ...(token ? { "x-auth-token": token } : {}),
          },
        },
      );

      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({}));
        throw new Error(
          errorResult.message || "Failed to download CSV template",
        );
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = "draft_bulk_sample.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
      toast.success("Template downloaded.");
    } catch (error) {
      console.error("Template download failed:", error);
      toast.error("Download failed.");
    } finally {
      setDownloading(false);
    }
  };

  const submitBatch = async () => {
    if (!selectedFile || previewRows.length === 0) {
      toast.error("Select a CSV file.");
      return;
    }

    if (previewRows.length > MAX_ROWS) {
      toast.error("Maximum 500 rows allowed.");
      return;
    }

    if (validRows.length === 0) {
      toast.error("No valid rows found.");
      return;
    }

    const localJobId = `BULK-${Date.now()}`;

    try {
      setUploading(true);
      setUploadError(null);
      setUploadSummary(null);
      setUploadResults([]);
      setValidCsv("");
      setInvalidCsv("");
      setJob({ id: localJobId, status: "submitting" });

      const correctedCsv = buildCsv(headers, previewRows, insuranceLimit);
      const correctedFile = new File(
        [correctedCsv],
        `validated-${selectedFile.name}`,
        { type: "text/csv" },
      );
      const formData = new FormData();

      formData.append("file", correctedFile);

      const token = getToken();
      const response = await fetch(`${merchantFrontAPI}/bulkSaveDraft`, {
        method: "POST",
        headers: {
          ...(token ? { "x-auth-token": token } : {}),
        },
        body: formData,
      });
      const result = await response.json().catch(() => ({}));
      console.log("Bulk Save Draft Response:", result);
      console.table(result?.results || []);

      // Store the exact CSV strings returned by the backend response.
      const backendInvalidCsv =
        typeof result.invalid_csv === "string" ? result.invalid_csv : "";
      const backendValidCsv =
        typeof result.valid_csv === "string" ? result.valid_csv : "";

      if (!response.ok || result.success === false) {
        console.error("Bulk upload rejected:", result);
        const rawFailureResults = Array.isArray(result.results)
          ? result.results
          : Array.isArray(result.error)
            ? result.error
            : [];
        const failureResults = mapBackendResults(
          rawFailureResults,
          previewRows,
          headers,
          insuranceLimit,
        );

        setUploadError({
          message: result.message || "Bulk upload failed",
          details: rawFailureResults,
        });
        setUploadSummary(
          result.summary || {
            total_rows: previewRows.length,
            total_orders: previewRows.length,
            created: 0,
            failed: previewRows.length,
          },
        );
        setValidCsv(backendValidCsv);
        setInvalidCsv(backendInvalidCsv);
        setUploadResults(failureResults);
        setResultsPage(1);
        setJob({ id: result.job_id || localJobId, status: "failed" });
        toast.error("Bulk upload failed.");
        return;
      }

      const summary = result.summary || {
        total_rows: previewRows.length,
        total_orders: previewRows.length,
        created: previewRows.length,
        failed: 0,
      };
      const rawResults = Array.isArray(result.results) ? result.results : [];
      const results = mapBackendResults(
        rawResults,
        previewRows,
        headers,
        insuranceLimit,
      );
      const resultFailedCount = Number(summary.failed || 0);
      const nextStatus = resultFailedCount > 0 ? "partial" : "completed";

      setUploadSummary(summary);
      setUploadResults(results);
      setValidCsv(backendValidCsv);
      setInvalidCsv(backendInvalidCsv);
      setResultsPage(1);
      setJob({ id: result.job_id || localJobId, status: nextStatus });
      if (resultFailedCount > 0) {
        setPreviewRows(
          applyBackendValidation(previewRows, rawResults, headers),
        );
      }

      if (nextStatus === "partial") {
        toast.error("Some rows failed.");
      } else {
        toast.success("Bulk upload completed.");
      }
    } catch (error) {
      console.error("Bulk upload failed:", error);
      setUploadError({
        message: error.message || "Bulk upload failed",
        details: [],
      });
      setUploadSummary({
        total_rows: previewRows.length,
        total_orders: previewRows.length,
        created: 0,
        failed: previewRows.length,
      });
      setJob({ id: localJobId, status: "failed" });
      toast.error("Bulk upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const downloadInvalidCsv = () => {
    const csvToDownload = invalidCsv?.trim() ? invalidCsv : uploadedCsvText;

    if (!csvToDownload?.trim()) {
      toast.error("Invalid CSV unavailable.");
      return;
    }

    const failedResults = uploadResults.filter((result) =>
      ["failed", "error"].includes(String(result.status || "").toLowerCase()),
    );
    const csvWithResults = addSubmissionResultsToCsv({
      csvText: csvToDownload,
      results: failedResults,
      fallbackStatus: "failed",
      fallbackMessage: uploadError?.message || "Validation failed",
      includeReason: true,
    });

    downloadCsv(csvWithResults, `bulk-upload-invalid-${Date.now()}.csv`);
  };

  const downloadValidCsv = () => {
    if (!validCsv?.trim()) {
      toast.error("Valid CSV unavailable.");
      return;
    }

    const successfulResults = uploadResults.filter((result) =>
      ["created", "booked", "success"].includes(
        String(result.status || "").toLowerCase(),
      ),
    );
    const csvWithResults = addSubmissionResultsToCsv({
      csvText: validCsv,
      results: successfulResults,
      fallbackStatus: "created",
    });

    downloadCsv(csvWithResults, `bulk-upload-valid-${Date.now()}.csv`);
  };

  const currentStatus = statusMeta[job.status] || statusMeta.idle;

  const showInsuranceColumn = uploadResults.some(
    (result) => result.insuranceEligible,
  );

  const resultsPageCount = Math.max(
    1,
    Math.ceil(uploadResults.length / resultsPerPage),
  );

  const currentResultsPage = Math.min(resultsPage, resultsPageCount);

  const resultsStartIndex = (currentResultsPage - 1) * resultsPerPage;

  const paginatedUploadResults = uploadResults.slice(
    resultsStartIndex,
    resultsStartIndex + resultsPerPage,
  );

  const toggleInsurance = (merchantOrderId) => {
    const selectedResult = uploadResults.find(
      (result) => result.merchant_order_id === merchantOrderId,
    );

    if (!selectedResult) return;

    const currentlyEnabled = ["1", "true", "yes", "on"].includes(
      String(selectedResult.isInsurance).toLowerCase(),
    );
    const nextValue = currentlyEnabled ? "0" : "1";

    setUploadResults((currentResults) =>
      currentResults.map((result) =>
        result.merchant_order_id === merchantOrderId
          ? { ...result, isInsurance: nextValue }
          : result,
      ),
    );

    toast.success(nextValue === "1" ? "Insurance ON." : "Insurance OFF.");
  };

  return (
    <div className="min-h-screen bg-[#f5f8fb] text-slate-900">
    

      <header className="border-b border-[#0446DB] bg-[#0446DB] px-5 py-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Bulk Creation
            </h1>

            <p className="mt-1 text-sm text-blue-100">
              Validate, fix and submit up to {MAX_ROWS} draft orders in one CSV.
            </p>
          </div>

          <button
            type="button"
            disabled={downloading}
            onClick={downloadTemplate}
            className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-[#0446DB] shadow-sm transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download size={17} />
            {downloading ? "Downloading..." : "Download CSV Template"}
          </button>
        </div>
      </header>

      <main className="space-y-6 p-5 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold">
                  1. Upload and validate CSV
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  CSV only · Header required · Maximum {MAX_ROWS} data rows
                </p>
              </div>

              {selectedFile && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-xs font-medium hover:bg-slate-50"
                >
                  <RefreshCw size={14} /> Re-upload CSV
                </button>
              )}
            </div>

            {selectedFile ? (
              <div className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-[#0446DB] bg-[#0446DB]/10 p-6 text-center">
                <FileText size={35} className="text-[#0446DB]" />
                <p className="mt-3 break-all text-sm font-semibold">
                  {selectedFile.name}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB ·{" "}
                  {previewRows.length} rows
                </p>
                {job.status !== "completed" && (
                  <button
                    type="button"
                    onClick={resetUpload}
                    className="mt-4 inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    <X size={15} /> Remove file
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                  handleFile(event.dataTransfer.files?.[0]);
                }}
                className={`flex min-h-44 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center transition ${
                  isDragging
                    ? "border-[#0446DB] bg-blue-50"
                    : "border-slate-300 bg-slate-50 hover:border-slate-400"
                }`}
              >
                <Upload size={30} className="text-slate-500" />
                <span className="mt-3 text-sm font-semibold">
                  Choose or drop a CSV file
                </span>
                <span className="mt-2 text-xs text-slate-500">
                  A validation preview opens before anything is submitted.
                </span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(event) => {
                handleFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />

            {uploadError && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <div className="flex items-start gap-2">
                  <AlertCircle size={17} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">{uploadError.message}</p>
                    {uploadError.details.length > 0 && (
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
                        {uploadError.details.map((detail, index) => (
                          <li key={`${detail.row || "error"}-${index}`}>
                            {detail.row ? `Row ${detail.row}: ` : ""}
                            {detail.message || String(detail)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>

          <aside className="h-fit space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
            <div>
              {/* Batch job header */}
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold">Batch job</h2>

                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold  ${currentStatus.style}`}
                >
                  {currentStatus.label}
                </span>
              </div>

              {/* Upload summary */}
              <dl className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Total rows</dt>

                  <dd className="font-semibold">
                    {uploadSummary ? totalCsvRows : previewRows.length}
                  </dd>
                </div>

                {uploadSummary && (
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Total orders</dt>

                    <dd className="font-semibold">{totalSubmitted}</dd>
                  </div>
                )}

                <div className="flex justify-between">
                  <dt className="text-slate-500">Valid</dt>

                  <dd className="font-semibold text-[#0446DB]">
                    {validRows.length}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-slate-500">Validation errors</dt>

                  <dd className="font-semibold text-red-600">
                    {invalidRows.length}
                  </dd>
                </div>

                {uploadSummary && (
                  <>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Created</dt>

                      <dd className="font-semibold text-[#0446DB]">
                        {createdCount}
                      </dd>
                    </div>

                    <div className="flex justify-between">
                      <dt className="text-slate-500">Failed</dt>

                      <dd className="font-semibold text-red-600">
                        {failedCount}
                      </dd>
                    </div>
                  </>
                )}
              </dl>

              {/* Processing status */}
              {job.status === "submitting" && (
                <div className="mt-4 flex items-center gap-2 text-xs text-amber-700">
                  <Clock3 size={14} className="animate-pulse" />
                  Processing batch…
                </div>
              )}

              {/* Progress bar */}
              {uploadSummary && (
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-[#0446DB] transition-all"
                    style={{
                      width: `${jobProgress}%`,
                    }}
                  />
                </div>
              )}

              {/* Submit button: hidden after API response */}
              {!uploadCompleted && (
                <button
                  type="button"
                  disabled={uploading || validRows.length === 0}
                  onClick={submitBatch}
                  className="mt-5 h-11 w-full cursor-pointer rounded-md bg-[#0446DB] px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading
                    ? "Submitting..."
                    : `Submit (${validRows.length} valid row${
                        validRows.length === 1 ? "" : "s"
                      })`}
                </button>
              )}

              {/* Show only when invalid rows exist */}
              {hasInvalidCsv && (
                <button
                  type="button"
                  onClick={downloadInvalidCsv}
                  className="mt-2 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-700 hover:bg-red-100"
                >
                  <Download size={15} />
                  Download invalid CSV
                </button>
              )}

              {/* Show only when created rows exist */}
              {hasValidCsv && (
                <button
                  type="button"
                  onClick={downloadValidCsv}
                  className="mt-2 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border  bg-[#0446DB] px-4 text-xs font-semibold text-white hover:text-[#0446DB] hover:bg-[#0446DB]/10"
                >
                  <Download size={15} />
                  Download valid CSV
                </button>
              )}

              {/* Show after API processing */}
              {uploadCompleted && (
                <button
                  type="button"
                  onClick={() => navigate("/merchant/order-draft")}
                  className="mt-2 h-10 w-full cursor-pointer rounded-md border border-slate-300 bg-white text-xs font-semibold hover:bg-slate-50"
                >
                  View Draft Orders
                </button>
              )}
            </div>
          </aside>
        </div>

        {uploadResults.length > 0 && (
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-sm font-semibold">2. Submission results</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">S.No.</th>
                    <th className="px-4 py-3">Order ID</th>

                    <th className="px-4 py-3">Status</th>
                    {/* {showInsuranceColumn && (
                      <th className="px-4 py-3">Insurance</th>
                    )} */}
                    <th className="px-4 py-3">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {paginatedUploadResults.map((result, index) => (
                    <tr
                      key={`${result.merchant_order_id || "result"}-${index}`}
                    >
                      <td className="px-4 py-3 font-medium">
                        {resultsStartIndex + index + 1}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {result.merchant_order_id || result.orderno || "—"}
                      </td>

                      <td
                        className={`px-4 py-3 font-semibold ${
                          ["created", "booked", "success"].includes(
                            String(result.status).toLowerCase(),
                          )
                            ? "text-[#0446DB]"
                            : "text-red-600"
                        }`}
                      >
                        {result.status || "—"}
                      </td>
                      
                      {/* {showInsuranceColumn && (
                        <td className="px-4 py-3">
                          {result.insuranceEligible ? (
                            <button
                              type="button"
                              role="switch"
                              aria-checked={["1", "true", "yes", "on"].includes(
                                String(result.isInsurance).toLowerCase(),
                              )}
                              onClick={() =>
                                toggleInsurance(result.merchant_order_id)
                              }
                              className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${
                                ["1", "true", "yes", "on"].includes(
                                  String(result.isInsurance).toLowerCase(),
                                )
                                  ? "bg-[#0446DB]"
                                  : "bg-slate-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                                  ["1", "true", "yes", "on"].includes(
                                    String(result.isInsurance).toLowerCase(),
                                  )
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      )} */}

                      <td className="px-4 py-3 text-slate-600">
                        {result.message || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span>Rows per page</span>

                  <select
                    value={resultsPerPage}
                    onChange={(event) => {
                      setResultsPerPage(Number(event.target.value));
                      setResultsPage(1);
                    }}
                    className="h-8 cursor-pointer rounded-md border border-slate-300 bg-white px-2 outline-none focus:border-[#0446DB]"
                  >
                    {[5, 10, 20, 50, 100, 200, 300, 400, 500].map(
                      (pageSize) => (
                        <option key={pageSize} value={pageSize}>
                          {pageSize}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div className="text-xs text-slate-500">
                  Showing{" "}
                  {uploadResults.length === 0 ? 0 : resultsStartIndex + 1}
                  {" - "}
                  {Math.min(
                    resultsStartIndex + resultsPerPage,
                    uploadResults.length,
                  )}{" "}
                  of {uploadResults.length}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentResultsPage === 1}
                    onClick={() =>
                      setResultsPage((previous) => Math.max(1, previous - 1))
                    }
                    className="h-8 cursor-pointer rounded-md border border-slate-300 px-3 text-xs font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="min-w-20 text-center text-xs font-medium">
                    Page {currentResultsPage} of {resultsPageCount}
                  </span>

                  <button
                    type="button"
                    disabled={currentResultsPage === resultsPageCount}
                    onClick={() =>
                      setResultsPage((previous) =>
                        Math.min(resultsPageCount, previous + 1),
                      )
                    }
                    className="h-8 cursor-pointer rounded-md border border-slate-300 px-3 text-xs font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
