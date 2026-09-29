

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ChevronDown,
  CirclePlus,
  Layers3,
  MoreHorizontal,
  Search,
  Ticket,
  Upload,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Package,
  Loader2,
  Download,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import AxiosInstance from "../../../../Helper/axiosInstance";

const baseURL = import.meta.env.VITE_BASE_URL;

const merchantFrontAPI = `${String(baseURL || "").replace(/\/$/, "")}/api/tech-merchant`;

const apiRequest = async (path, options = {}) => {
  const token =
    localStorage.getItem("merchantToken") || localStorage.getItem("token");

  const response = await fetch(`${merchantFrontAPI}${path}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",

      ...(token ? { "x-auth-token": token } : {}),

      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  let result = {};

  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    result = {
      message: text || "Invalid server response",
    };
  }

  if (!response.ok || result.success === false) {
    console.error("API Error Response:", {
      url: `${merchantFrontAPI}${path}`,

      status: response.status,

      message: result.message,

      error: result.error,

      completeResponse: result,
    });

    const error = new Error(
      result.message || `Request failed (${response.status})`,
    );

    error.status = response.status;

    error.payload = result;

    throw error;
  }

  return result;
};

const mapDraft = (draft) => {
  const fulfillmentStatus = String(
    draft.fulfillment_status || "unfulfilled",
  ).toUpperCase();

  return {
    id: draft.id,

    orderNo: draft.orderno || "—",

    internalNo: draft.merchant_order_id || `DRAFT-${draft.id}`,

    awb: draft.awb_number || "—",

    receiver: draft.delivery_contact_name || "—",

    phone: draft.delivery_phone || "—",

    city: draft.delivery_city || "—",

    weight: draft.total_weight ? `${draft.total_weight} gm` : "—",

    carrier: "—",

    cod:
      Number(draft.collectable_amount) > 0
        ? `₹${Number(draft.collectable_amount).toLocaleString("en-IN")}`
        : "—",

    type:
      String(draft.order_type || "prepaid").toUpperCase() === "COD"
        ? "COD"
        : "Prepaid",

    status:
      fulfillmentStatus === "UNFULFILLED"
        ? "DRAFT"
        : fulfillmentStatus === "FULFILLED"
          ? "FULFILLED"
          : fulfillmentStatus,

    fulfillmentStatus,

    route: `${draft.pickup_city || "—"} → ${draft.delivery_city || "—"}`,

    amount: `₹${Number(draft.total_amount || 0).toLocaleString("en-IN")}`,

    orderSpecific: draft.order_specific || "—",

    error: draft.error_message || "—",

    created: draft.created_at
      ? new Date(draft.created_at).toLocaleDateString("en-IN", {
          day: "2-digit",

          month: "short",
        })
      : "—",

    raw: draft,
  };
};

const tabs = ["All", "unfulfilled", "process", "fulfilled", "cancelled"];

const statusStyles = {
  unfulfilled: "bg-amber-100 text-amber-800",

  process: "bg-sky-100 text-sky-700",

  fulfilled: "bg-emerald-100 text-emerald-700",

  draft: "bg-slate-100 text-slate-700",

  "AWB ISSUED": "bg-sky-100 text-sky-700",

  MANIFESTED: "bg-amber-100 text-amber-800",

  "IN TRANSIT": "bg-orange-100 text-orange-700",

  DELIVERED: "bg-emerald-100 text-emerald-700",

  RTO: "bg-purple-100 text-purple-700",

  cancelled: "bg-red-100 text-red-600",
};

function normalizeStatus(status) {
  return status.toUpperCase();
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-medium ${
        statusStyles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

export default function TeachDraftsList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const actionMenuRef = useRef(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [bulkAwbLoading, setBulkAwbLoading] = useState(false);
  const [bulkAwbSummary, setBulkAwbSummary] = useState(null);
  const [bulkAwbResults, setBulkAwbResults] = useState([]);
  const [shipmentOrder, setShipmentOrder] = useState(null);
  const [shipmentMode, setShipmentMode] = useState(null);
  const [shipmentSpecific, setShipmentSpecific] = useState("");
  const [shipmentLoading, setShipmentLoading] = useState(false);
  const [shipmentError, setShipmentError] = useState(null);
  const [shipmentPreference, setShipmentPreference] = useState(null);

  // Filtering and pagination are handled by the API.
  const fetchDrafts = async () => {
    try {
      setLoading(true);

      const result = await AxiosInstance.get("/api/tech-merchant/drafts", {
        params: {
          fulfillment_status: activeTab === "All" ? "" : activeTab.toLowerCase(),
          order_type: typeFilter === "All types" ? "" : typeFilter.toLowerCase(),
          page: currentPage,
          limit: rowsPerPage,
        },
      });

      const response = result.data?.data || {};
      setOrders(Array.isArray(response.data) ? response.data : []);
      setPagination({
        page: Number(response.pagination?.page || currentPage),
        limit: Number(response.pagination?.limit || rowsPerPage),
        total: Number(response.pagination?.total || 0),
        totalPages: Math.max(1, Number(response.pagination?.totalPages || 1)),
      });
    } catch (error) {
      console.error("Fetch Draft Error:", error);
      setOrders([]);
      setPagination({ page: 1, limit: rowsPerPage, total: 0, totalPages: 1 });
      toast.error(error?.response?.data?.message || error?.message || "Unable to fetch drafts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, [activeTab, typeFilter, currentPage, rowsPerPage]);

  const totalOrders = Number(pagination?.total || 0);
  const totalPages = Math.max(1, Number(pagination?.totalPages || 1));

  const firstVisibleRow =
    totalOrders > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;

  const lastVisibleRow =
    totalOrders > 0
      ? Math.min(firstVisibleRow + orders.length - 1, totalOrders)
      : 0;

  const visiblePages = useMemo(() => {
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    return Array.from(
      { length: Math.max(0, endPage - startPage + 1) },
      (_, index) => startPage + index,
    );
  }, [currentPage, totalPages]);

  const handleTabChange = (tab) => {
    setSelectedIds([]);
    setCurrentPage(1);
    setActiveTab(tab);
  };

  const handleTypeChange = (value) => {
    setSelectedIds([]);
    setCurrentPage(1);
    setTypeFilter(value);
  };

  const handleRowsPerPageChange = (value) => {
    setSelectedIds([]);
    setCurrentPage(1);
    setRowsPerPage(Number(value));
  };

  useEffect(() => {
    if (!loading && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [loading, currentPage, totalPages]);

  const selectableDraftIds = orders
    .filter((order) =>
      ["unfulfilled", "process"].includes(
        String(order?.fulfillment_status || "").toLowerCase(),
      ),
    )
    .map((order) => order.id);

  const allDraftsSelected =
    selectableDraftIds.length > 0 &&
    selectableDraftIds.every((id) => selectedIds.includes(id));

  const toggleOrder = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const toggleAllDrafts = () => {
    setSelectedIds((current) => {
      if (allDraftsSelected) {
        return current.filter((id) => !selectableDraftIds.includes(id));
      }

      return [...new Set([...current, ...selectableDraftIds])];
    });
  };

  

  const openShipmentModal = (order) => {
    setShipmentOrder(order);

    setShipmentMode("single");

    // Order specific is selected only during Get AWB.

    setShipmentSpecific("");

    setShipmentError(null);

    setOpenMenu(null);
  };

  const openBulkShipmentModal = () => {
    if (selectedIds.length === 0) {
      toast.error("Select at least one eligible draft");

      return;
    }

    setShipmentOrder(null);

    setShipmentMode("bulk");

    setShipmentSpecific("");

    setShipmentError(null);

    setBulkAwbResults([]);

    setBulkAwbSummary(null);

    setOpenMenu(null);
  };

  const closeShipmentModal = () => {
    if (shipmentLoading) return;

    if (shipmentMode === "bulk") {
      setBulkAwbResults([]);

      setBulkAwbSummary(null);
    }

    setShipmentOrder(null);

    setShipmentMode(null);

    setShipmentSpecific("");

    setShipmentError(null);
  };

  // POST /api/merchantfront/getAwbForDraft/:draft_id

  const createShipment = async () => {
  if (!shipmentMode) return;

  // =========================================================
  // VALIDATION
  // =========================================================

  if (!shipmentSpecific) {
    setShipmentError({
      message: "Please select an order specific service",
      details: [],
    });
    return;
  }

  if (!shipmentPreference) {
    toast.error("Please select a rider preference");
    return;
  }

  if (shipmentMode === "bulk" && !selectedIds?.length) {
    toast.error("Please select at least one order");
    return;
  }

  if (shipmentMode !== "bulk" && !shipmentOrder) {
    toast.error("Please select an order");
    return;
  }

  try {
    setShipmentLoading(true);
    setShipmentError(null);

    // =========================================================
    // BULK SHIPMENT
    // =========================================================

    if (shipmentMode === "bulk") {
      console.log("Creating bulk shipment:", {
        order_specific: shipmentSpecific,
        rider_preference: shipmentPreference,
        selectedIds,
      });

      const results = await Promise.all(
        selectedIds.map((draftId) =>
          AxiosInstance.post(
            "/api/tech-merchant/getAwbForDraft",
            {
              order_specific: shipmentSpecific,
              rider_preference: shipmentPreference,
              draft_id: draftId,
            },
          ),
        ),
      );

      console.log("Bulk AWB Results:", results);

      toast.success(
        `${results.length} shipment${
          results.length > 1 ? "s" : ""
        } created successfully`,
      );

      await fetchDrafts();

      // Reset bulk selection
      setSelectedIds([]);

      // Reset modal/form
      setShipmentOrder(null);
      setShipmentMode(null);
      setShipmentSpecific("");
      setShipmentPreference("");
      setShipmentError(null);

      return results;
    }

    // =========================================================
    // SINGLE SHIPMENT
    // =========================================================
      
    console.log("Creating single shipment:", {
      order_specific: shipmentSpecific,
      rider_preference: shipmentPreference,
      draft_id: shipmentOrder.id,
    });

    const response = await AxiosInstance.post(
      "/api/tech-merchant/getAwbForDraft",
      {
        order_specific: shipmentSpecific,
        rider_preference: shipmentPreference,
        draft_id: shipmentOrder?.id,
      },
    );

    

    console.log("Get AWB Response:", response?.data);

    toast.success(
      response?.data?.message || "AWB generated successfully",
    );

    await fetchDrafts();

    // Reset
    setShipmentOrder(null);
    setShipmentMode(null);
    setShipmentSpecific("");
    setShipmentPreference("");
    setShipmentError(null);

    return response?.data;
  } catch (error) {
    console.error("Get AWB Error:", error);

    const errorData = error?.response?.data;

    console.error("API Error:", {
      status: error?.response?.status,
      message: errorData?.message,
      error: errorData?.error,
    });

    setShipmentError({
      message:
        errorData?.message ||
        error?.message ||
        "Unable to create shipment",

      details: Array.isArray(errorData?.error)
        ? errorData.error
        : [],
    });

    toast.error(
      errorData?.message ||
        error?.message ||
        "Failed to generate AWB",
    );
  } finally {
    setShipmentLoading(false);
  }
};

  // GET /api/merchantfront/draft/:draft_id

  const viewOrder = async (id) => {
    try {
      const res = await AxiosInstance.get(`/api/tech-merchant/drafts/${id}`);

      setViewingOrder({
        draft: res.data?.data?.draft,

        items: res.data?.data?.items || [],
      });

      setOpenMenu(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const copyOrder = async (id) => {
    setOpenMenu(null);

    // const res = await AxiosInstance.post(
    //   `/api/tech-merchant/drafts/${id}/copy`,
    // );

    
   
    navigate("/techbased_merchant/create_order", {
      state: {
        copyOrder: {
        //  id: res.data?.data?.draft_id,
         id: id,
        },
      },
    });
  };

  // POST /api/merchantfront/draft/:draft_id/cancel

  const cancelOrder = async (id) => {
    try {
      const res = await AxiosInstance.post(
        `/api/tech-merchant/drafts/${id}/cancel`,
      );

      setOpenMenu(null);

      toast.success("Order cancelled successfully");

      await fetchDrafts();
    } catch (error) {
      toast.error(error.message);
    }
  };
 const exportOrder = async () => {
  try {
    const res = await AxiosInstance.get(
      "/api/tech-merchant/exportDrafts",
      {
        params:{
           fulfillment_status: activeTab === "All" ? "" : activeTab.toLowerCase(),
        }
      },
      {
        responseType: "blob",
      }
    );

    const contentType =
      res.headers?.["content-type"] || "";

    console.log("Export Content-Type:", contentType);
    console.log(
      "Content-Disposition:",
      res.headers?.["content-disposition"]
    );

    // Backend ne JSON error return kiya
    if (contentType.includes("application/json")) {
      const text = await res.data.text();

      let errorData = {};

      try {
        errorData = JSON.parse(text);
      } catch {
        // ignore parse error
      }

      throw new Error(
        errorData?.message || "Failed to export orders"
      );
    }

    // Backend ke actual response ko blob banao
    const blob = new Blob([res.data], {
      type: contentType || "application/octet-stream",
    });

    // Filename backend se lene ki try karo
    const contentDisposition =
      res.headers?.["content-disposition"];

    let fileName = "";

    if (contentDisposition) {
      const utfMatch = contentDisposition.match(
        /filename\*=UTF-8''([^;]+)/
      );

      const normalMatch = contentDisposition.match(
        /filename="?([^";]+)"?/
      );

      if (utfMatch?.[1]) {
        fileName = decodeURIComponent(utfMatch[1]);
      } else if (normalMatch?.[1]) {
        fileName = normalMatch[1].trim();
      }
    }

    // Backend filename nahi bhej raha
    if (!fileName) {
      const date = new Date().toISOString().slice(0, 10);

      if (
        contentType.includes(
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
      ) {
        fileName = `draft-orders-${date}.xlsx`;
      } else if (
        contentType.includes("text/csv") ||
        contentType.includes("application/csv")
      ) {
        fileName = `draft-orders-${date}.csv`;
      } else if (
        contentType.includes("application/vnd.ms-excel")
      ) {
        fileName = `draft-orders-${date}.xls`;
      } else {
        fileName = `draft-orders-${date}.xlsx`;
      }
    }

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);

    setOpenMenu(null);

    toast.success("Orders exported successfully");
  } catch (error) {
    console.error("Export error:", error);

    toast.error(
      error?.message ||
        error?.response?.data?.message ||
        "Failed to export orders"
    );
  }
};

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target)
      ) {
        setOpenMenu(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);

      document.removeEventListener("keydown", handleEscape);
    };
  }, []);


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
      loadingPage ?(
         <div className=" w-full h-[90vh] flex justify-center items-center">
          <div>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2"> Loading Draft Orders...</p>
          </div>
        </div>
      ):(

        <div className="min-h-screen bg-[#f5f8fb] text-slate-900 dark:bg-neutral-950 dark:text-neutral-100">
          <header className="border-b dark:bg-neutral-950 dark:border-neutral-950 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-xl font-bold tracking-tight dark:text-white sm:text-2xl">
                  Draft Orders
                </h1>
    
                <p className="mt-1 max-w-xl text-xs leading-5 dark:text-blue-100 sm:text-sm">
                  Create, review and ship orders. Drafts stay editable until an AWB
                  is issued.
                </p>
              </div>
    
              <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-shrink-0 sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/techbased_merchant/bulk-upload")}
                  className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-white/30 bg-[#0446DB] px-3 text-xs font-medium text-white shadow-sm transition  sm:px-4 sm:text-sm"
                >
                  <Layers3 size={17} className="shrink-0" />
    
                  <span>Bulk Upload</span>
                </button>

                <button
  type="button"
  onClick={exportOrder}
  disabled={loading}
  className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-white/30 bg-[#0446DB] px-3 text-xs font-medium text-white shadow-sm transition hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
>
  <Download size={17} className="shrink-0" />

  <span>{loading ? "Exporting..." : "Export"}</span>
</button>
    
                <Link
                  to="/techbased_merchant/create_order"
                  className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#0446DB] px-3 text-xs font-semibold text-white shadow-sm transition sm:px-4 sm:text-sm"
                >
                  <CirclePlus size={17} className="shrink-0" />
    
                  <span>Create Order</span>
                </Link>
              </div>
            </div>
          </header>
    
          <main className="p-2">
            <div className="overflow-x-auto rounded-sm bg-slate-20/70 p-1 dark:bg-neutral-950">
              <div className="overflow-x-auto rounded-lg bg-slate-100/70 p-2 scrollbar-hide dark:bg-neutral-900/70">
                <div className="mx-auto flex min-w-max items-center justify-center gap-2">
                  {tabs.map((tab) => (
                    <Button
                      key={tab}
                      type="button"
                      onClick={() => handleTabChange(tab)}
                      className={`cursor-pointer whitespace-nowrap rounded-full border px-4 py-2 text-sm shadow-sm transition ${
                        activeTab === tab
                          ? "border-[#0446DB] bg-[#0446DB] font-medium hover:bg-[#0446DB text-white shadow-md"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-[#0446DB] hover:text-white hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-blue-500/60 dark:hover:text-blue-300"
                      }`}
                    >
                      {tab}
    
                      {activeTab === tab && (
                        <span
                          className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] ${
                            activeTab === tab
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {pagination?.total}
                        </span>
                      )}
                    </Button>
                  ))}
    
                  <div className="mx-1 h-6 w-px bg-slate-300 dark:bg-neutral-700" />
    
                  <label className="relative">
                    <select
                      value={typeFilter}
                      onChange={(event) => handleTypeChange(event.target.value)}
                      className="h-9 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white px-3 pr-8 text-xs text-slate-900 shadow-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                    >
                      <option value="All types">All types</option>
    
                      <option value="prepaid">Prepaid</option>
    
                      <option value="cod">COD</option>
                    </select>
    
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-neutral-400"
                    />
                  </label>
    
                  {selectedIds.length > 0 && (
                    <button
                      type="button"
                      disabled={bulkAwbLoading}
                      onClick={openBulkShipmentModal}
                      className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#0446DB] px-4 text-xs font-medium text-white shadow-sm transition hover:bg-[#0a3eb7] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Ticket size={15} />
    
                      {bulkAwbLoading
                        ? "Processing..."
                        : `Bulk Get AWB (${selectedIds.length})`}
                    </button>
                  )}
                </div>
              </div>
            </div>
    
            <div className="mt-4 overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div
                className={`overflow-x-auto ${
                  orders.length <= 2 ? "min-h-[360px]" : ""
                }`}
              >
                <table className="w-full min-w-[900px] text-left">
                  <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 dark:bg-neutral-800 dark:text-neutral-400">
                    <tr>
                      <th className="px-3 py-4">
                        <input
                          type="checkbox"
                          checked={allDraftsSelected}
                          onChange={toggleAllDrafts}
                          className="h-4 w-4 cursor-pointer accent-[#0446DB]"
                        />
                      </th>
    
                      <th className="px-5 py-4 font-medium">Order No</th>
    
                      <th className="px-3 py-4 font-medium">Route</th>
    
                      <th className="px-3 py-4 font-medium">Amount</th>
    
                      <th className="px-3 py-4 font-medium">Status</th>
    
                      {activeTab === "process" && (
                        <th className="px-3 py-4 font-medium">Error</th>
                      )}
    
                      <th className="px-3 py-4 font-medium">Created</th>
    
                      <th className="px-3 py-4 font-medium">Actions</th>
                    </tr>
                  </thead>
    
                  <tbody className="divide-y divide-slate-200 text-sm dark:divide-neutral-800">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="transition hover:bg-slate-50/70 dark:hover:bg-neutral-800/70"
                      >
                        <td className="px-3 py-4">
                          <input
                            type="checkbox"
                            disabled={
                              !["unfulfilled", "process"].includes(
                                order.fulfillment_status,
                              )
                            }
                            checked={selectedIds.includes(order.id)}
                            onChange={() => toggleOrder(order.id)}
                            className="h-4 w-4 cursor-pointer accent-[#0446DB] disabled:cursor-not-allowed disabled:opacity-30"
                          />
                        </td>
    
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-950 dark:text-neutral-100">
                            {order.merchant_order_id}
                          </p>
    
                          <p className="mt-1 font-mono text-[10px] text-slate-500 dark:text-neutral-400">
                            {order.internalNo}
                          </p>
                        </td>
    
                        <td className="px-3 py-4 font-medium text-slate-700 dark:text-neutral-300">
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-neutral-300">
                            <span>{order?.pickup_city || "N/A"}</span>
                            <span className="text-[#0446DB]">→</span>
                            <span>{order?.delivery_city || "N/A"}</span>
                          </div>
                        </td>
    
                        <td className="px-3 py-4 font-mono font-semibold">
                          {order.total_amount}
                        </td>
    
                        <td className="px-3 py-4">
                          <StatusBadge status={order.fulfillment_status} />
                        </td>
    
                        {activeTab === "process" && (
                          <td className="max-w-[240px] px-3 py-4">
                            <span
                              className={
                                order.error_message !== "—"
                                  ? "inline-flex items-center gap-1.5 text-xs font-medium text-red-600"
                                  : "text-slate-400 dark:text-neutral-500"
                              }
                            >
                              {order.error_message !== "—" && (
                                <AlertTriangle size={14} />
                              )}
    
                              {order.error_message}
                            </span>
                          </td>
                        )}
    
                        <td className="px-3 py-4 text-xs text-slate-600 dark:text-neutral-400">
                          {order.created_at}
                        </td>
    
                        <td
                          ref={openMenu === order.id ? actionMenuRef : null}
                          className="relative px-3 py-4"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenu((current) =>
                                current === order.id ? null : order.id,
                              )
                            }
                            className="grid h-8 w-8 cursor-pointer place-items-center rounded-md hover:bg-slate-100 dark:hover:bg-neutral-800"
                          >
                            <MoreHorizontal size={18} />
                          </button>
    
                          {openMenu === order.id && (
                            <div className="absolute right-3 z-50 w-40 rounded-md border border-slate-200 bg-white p-1 shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                              <button
                                type="button"
                                onClick={() => viewOrder(order.id)}
                                className="w-full cursor-pointer rounded px-3 py-2 text-left text-xs hover:bg-slate-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                              >
                                View
                              </button>
    
                              {!["fulfilled", "cancelled"].includes(
                                order.fulfillment_status,
                              ) && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate("/techbased_merchant/create_order", {
                                      state: {
                                        editOrder: {
                                          id: order.id,
                                        },
                                      },
                                    })
                                  }
                                  className="w-full cursor-pointer rounded px-3 py-2 text-left text-xs hover:bg-slate-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                >
                                  Edit
                                </button>
                              )}
    
                              <button
                                type="button"
                                onClick={() => copyOrder(order.id)}
                                className="w-full cursor-pointer rounded px-3 py-2 text-left text-xs hover:bg-slate-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                              >
                                Copy
                              </button>
                               
                              {["unfulfilled", "process"].includes(
                                order.fulfillment_status,
                              ) && (
                                <button
                                  type="button"
                                  onClick={() => openShipmentModal(order)}
                                  className="w-full cursor-pointer rounded px-3 py-2 text-left text-xs hover:bg-slate-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                >
                                  Get AWB
                                </button>
                              )}
    
                              {!["fulfilled", "cancelled"].includes(
                                order.fulfillment_status,
                              ) && (
                                <button
                                  type="button"
                                  onClick={() => cancelOrder(order.id)}
                                  className="w-full cursor-pointer rounded px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
    
                    {!loading && !orders.length && (
                      <tr>
                        <td
                          colSpan={activeTab === "Process" ? 9 : 8}
                          className="px-6 py-16 text-center text-sm text-slate-500 dark:text-neutral-400"
                        >
                          No orders found
                        </td>
                      </tr>
                    )}
    
                    {loading && (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-6 py-16 text-center text-sm text-slate-500 dark:text-neutral-400"
                        >
                          Loading drafts...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
    
              {/* NEW: Pagination UI */}
    
              {!loading && totalOrders > rowsPerPage && (
                <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-neutral-400">
                    <p>
                      Showing{" "}
                      <span className="font-semibold text-slate-900 dark:text-neutral-100">
                        {firstVisibleRow}-{lastVisibleRow}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-slate-900 dark:text-neutral-100">
                        {totalOrders}
                      </span>{" "}
                      orders
                    </p>
    
                    <label className="flex items-center gap-2">
                      <span>Rows per page</span>
    
                      <select
                        value={rowsPerPage}
                        onChange={(event) =>
                          handleRowsPerPageChange(event.target.value)
                        }
                        className="h-8 cursor-pointer rounded-md border border-slate-300 bg-white px-2 text-xs font-medium text-slate-700 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                      >
                        {[5, 10, 20, 50, 100, 200, 300, 400, 500].map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
    
                  <div className="flex items-center justify-between gap-2 sm:justify-end">
                    {/* Previous button */}
    
                    <button
                      type="button"
                      aria-label="Previous page"
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      className="grid h-8 w-8 cursor-pointer place-items-center rounded-md border border-slate-300 bg-white text-slate-600 transition hover:border-[#0446DB] hover:text-[#0446DB] disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
                    >
                      <ChevronLeft size={16} />
                    </button>
    
                    {/* Page numbers */}
    
                    <div className="flex items-center gap-1">
                      {visiblePages.map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          aria-current={currentPage === page ? "page" : undefined}
                          className={`h-8 min-w-8 cursor-pointer rounded-md border px-2 text-xs font-semibold transition ${
                            currentPage === page
                              ? "border-[#0446DB] bg-[#0446DB] text-white"
                              : "border-slate-300 bg-white text-slate-600 hover:border-[#0446DB] hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
    
                    {/* Next button */}
    
                    <button
                      type="button"
                      aria-label="Next page"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((page) => Math.min(totalPages, page + 1))
                      }
                      className="grid h-8 w-8 cursor-pointer place-items-center rounded-md border border-slate-300 bg-white text-slate-600 transition hover:border-[#0446DB] hover:text-[#0446DB] disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
    
          
    
          {viewingOrder && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
              onMouseDown={() => setViewingOrder(null)}
            >
              <div
                className="
    
            w-full max-w-5xl
    
            overflow-hidden
    
            rounded-2xl
    
            border border-slate-200
    
            bg-white
    
            shadow-2xl
    
            dark:border-neutral-800
    
            dark:bg-neutral-900
    
          "
                onMouseDown={(event) => event.stopPropagation()}
              >
                {/* ================= HEADER ================= */}
    
                <div className="flex items-start justify-between border-b border-slate-200 dark:border-neutral-800 px-5 py-4 sm:px-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-slate-950 dark:text-neutral-100">
                        Order Details
                      </h2>
    
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        Draft
                      </span>
                    </div>
    
                    <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">
                      Order #{viewingOrder?.draft?.orderno || "—"}
                    </p>
                  </div>
    
                  <button
                    type="button"
                    onClick={() => setViewingOrder(null)}
                    className="
    
                grid h-9 w-9
    
                cursor-pointer
    
                place-items-center
    
                rounded-lg
    
                text-slate-500
    
                transition
    
                hover:bg-slate-100
    
                hover:text-slate-900
    
              "
                  >
                    <X size={19} />
                  </button>
                </div>
    
                {/* ================= BODY ================= */}
    
                <div className="max-h-[75vh] overflow-y-auto p-5 sm:p-6">
                  {/* Top summary */}
    
                  <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Order Number */}
    
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/70 dark:bg-neutral-800/70">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Order Number
                      </p>
    
                      <p className="mt-2 break-all text-sm font-semibold text-slate-900 dark:text-neutral-100">
                        {viewingOrder?.draft?.orderno || "—"}
                      </p>
                    </div>
    
                    {/* Merchant Order */}
    
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/70 dark:bg-neutral-800/70">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Merchant Order ID
                      </p>
    
                      <p className="mt-2 break-all text-sm font-semibold text-slate-900 dark:text-neutral-100">
                        {viewingOrder?.draft?.merchant_order_id || "—"}
                      </p>
                    </div>
    
                    {/* Payment */}
    
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/70 dark:bg-neutral-800/70">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Payment Type
                      </p>
    
                      <p className="mt-2 text-sm font-semibold capitalize text-slate-900">
                        {viewingOrder?.draft?.order_type || "—"}
                      </p>
                    </div>
    
                    {/* Total */}
    
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/70 dark:bg-neutral-800/70">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Total Amount
                      </p>
    
                      <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-neutral-100">
                        ₹
                        {Number(
                          viewingOrder?.draft?.total_amount || 0,
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
    
                  {/* ================= PICKUP ADDRESS ================= */}
    
                  <section className="mb-5 rounded-xl border border-slate-200 p-4 sm:p-5 dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB]">
                        <MapPin size={17} />
                      </div>
    
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-neutral-100">
                          Pickup Address
                        </h3>
    
                        <p className="text-xs text-slate-500 dark:text-neutral-400">
                          Shipment pickup details
                        </p>
                      </div>
                    </div>
    
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <DetailItem
                        label="Contact Name"
                        value={viewingOrder?.draft?.pickup_contact_name}
                      />
    
                      <DetailItem
                        label="Phone"
                        value={viewingOrder?.draft?.pickup_phone}
                      />
    
                      <DetailItem
                        label="Pincode"
                        value={viewingOrder?.draft?.pickup_pincode}
                      />
    
                      <DetailItem
                        label="City"
                        value={viewingOrder?.draft?.pickup_city}
                      />
    
                      <DetailItem
                        label="State"
                        value={viewingOrder?.draft?.pickup_state}
                      />
    
                      <DetailItem
                        label="Country"
                        value={viewingOrder?.draft?.pickup_country}
                      />
    
                      <div className="sm:col-span-2 lg:col-span-3">
                        <DetailItem
                          label="Address"
                          value={viewingOrder?.draft?.pickup_address_line}
                        />
                      </div>
    
                      <DetailItem
                        label="Latitude"
                        value={viewingOrder?.draft?.pickup_latitude}
                      />
    
                      <DetailItem
                        label="Longitude"
                        value={viewingOrder?.draft?.pickup_longitude}
                      />
                    </div>
                  </section>
    
                  {/* ================= DELIVERY ADDRESS ================= */}
    
                  <section className="mb-5 rounded-xl border border-slate-200 p-4 sm:p-5 dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <MapPin size={17} />
                      </div>
    
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-neutral-100">
                          Delivery Address
                        </h3>
    
                        <p className="text-xs text-slate-500 dark:text-neutral-400">
                          Customer delivery details
                        </p>
                      </div>
                    </div>
    
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <DetailItem
                        label="Receiver"
                        value={viewingOrder?.draft?.delivery_contact_name}
                      />
    
                      <DetailItem
                        label="Phone"
                        value={viewingOrder?.draft?.delivery_phone}
                      />
    
                      <DetailItem
                        label="Pincode"
                        value={viewingOrder?.draft?.delivery_pincode}
                      />
    
                      <DetailItem
                        label="City"
                        value={viewingOrder?.draft?.delivery_city}
                      />
    
                      <DetailItem
                        label="State"
                        value={viewingOrder?.draft?.delivery_state}
                      />
    
                      <DetailItem
                        label="Country"
                        value={viewingOrder?.draft?.delivery_country}
                      />
    
                      <div className="sm:col-span-2 lg:col-span-3">
                        <DetailItem
                          label="Address"
                          value={viewingOrder?.draft?.delivery_address_line}
                        />
                      </div>
                    </div>
                  </section>
    
                  {/* ================= RETURN ADDRESS ================= */}
    
                  <section className="mb-5 rounded-xl border border-slate-200 p-4 sm:p-5 dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                          <MapPin size={17} />
                        </div>
    
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-neutral-100">
                            Return Address
                          </h3>
    
                          <p className="text-xs text-slate-500 dark:text-neutral-400">
                            Return shipment details
                          </p>
                        </div>
                      </div>
    
                      {Number(viewingOrder?.draft?.same_as_pickup_return) === 1 && (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-600">
                          Same as pickup
                        </span>
                      )}
                    </div>
    
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <DetailItem
                        label="Contact Name"
                        value={viewingOrder?.draft?.return_contact_name}
                      />
    
                      <DetailItem
                        label="Phone"
                        value={viewingOrder?.draft?.return_phone}
                      />
    
                      <DetailItem
                        label="Pincode"
                        value={viewingOrder?.draft?.return_pincode}
                      />
    
                      <DetailItem
                        label="City"
                        value={viewingOrder?.draft?.return_city}
                      />
    
                      <DetailItem
                        label="State"
                        value={viewingOrder?.draft?.return_state}
                      />
    
                      <DetailItem
                        label="Country"
                        value={viewingOrder?.draft?.return_country}
                      />
    
                      <div className="sm:col-span-2 lg:col-span-3">
                        <DetailItem
                          label="Address"
                          value={viewingOrder?.draft?.return_address_line}
                        />
                      </div>
    
                      <DetailItem
                        label="Latitude"
                        value={viewingOrder?.draft?.return_latitude}
                      />
    
                      <DetailItem
                        label="Longitude"
                        value={viewingOrder?.draft?.return_longitude}
                      />
                    </div>
                  </section>
    
                  {/* ================= PACKAGE DETAILS ================= */}
    
                  <section className="mb-5 rounded-xl border border-slate-200 p-4 sm:p-5 dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                        <Package size={17} />
                      </div>
    
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-neutral-100">
                          Package Details
                        </h3>
    
                        <p className="text-xs text-slate-500 dark:text-neutral-400">
                          Weight, dimensions and payment
                        </p>
                      </div>
                    </div>
    
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <DetailItem
                        label="Total Weight"
                        value={
                          viewingOrder?.draft?.total_weight
                            ? `${viewingOrder.draft.total_weight} gm`
                            : "—"
                        }
                      />
    
                      <DetailItem
                        label="Number of Boxes"
                        value={viewingOrder?.draft?.number_of_boxes}
                      />
    
                      <DetailItem
                        label="Length"
                        value={
                          viewingOrder?.draft?.package_length
                            ? `${viewingOrder.draft.package_length} cm`
                            : "—"
                        }
                      />
    
                      <DetailItem
                        label="Breadth"
                        value={
                          viewingOrder?.draft?.package_breadth
                            ? `${viewingOrder.draft.package_breadth} cm`
                            : "—"
                        }
                      />
    
                      <DetailItem
                        label="Height"
                        value={
                          viewingOrder?.draft?.package_height
                            ? `${viewingOrder.draft.package_height} cm`
                            : "—"
                        }
                      />
    
                      <DetailItem
                        label="Collectable Amount"
                        value={`₹${Number(
                          viewingOrder?.draft?.collectable_amount || 0,
                        ).toLocaleString("en-IN")}`}
                      />
    
                      <DetailItem
                        label="Insurance"
                        value={
                          Number(viewingOrder?.draft?.opt_insurance) === 1
                            ? "Enabled"
                            : "Disabled"
                        }
                      />
    
                      <DetailItem
                        label="Fulfillment"
                        value={viewingOrder?.draft?.fulfillment_status || "—"}
                      />
                    </div>
                  </section>
    
                  {/* ================= PRODUCTS ================= */}
    
                  <section className="rounded-xl border border-slate-200 p-4 sm:p-5 dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-neutral-100">
                          Products
                        </h3>
    
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                          {viewingOrder?.items?.length || 0} item(s)
                        </p>
                      </div>
                    </div>
    
                    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-neutral-700">
                      <table className="w-full min-w-[700px] text-left">
                        <thead className="bg-slate-50 dark:bg-neutral-800">
                          <tr>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-600 dark:text-neutral-300">
                              Product
                            </th>
    
                            <th className="px-4 py-3 text-xs font-semibold text-slate-600 dark:text-neutral-300">
                              SKU
                            </th>
    
                            <th className="px-4 py-3 text-xs font-semibold text-slate-600 dark:text-neutral-300">
                              Price
                            </th>
    
                            <th className="px-4 py-3 text-xs font-semibold text-slate-600 dark:text-neutral-300">
                              Qty
                            </th>
    
                            <th className="px-4 py-3 text-xs font-semibold text-slate-600 dark:text-neutral-300">
                              Weight
                            </th>
    
                            <th className="px-4 py-3 text-xs font-semibold text-slate-600 dark:text-neutral-300">
                              Dimensions
                            </th>
                          </tr>
                        </thead>
    
                        <tbody className="divide-y divide-slate-200 dark:divide-neutral-800">
                          {viewingOrder?.items?.length > 0 ? (
                            viewingOrder.items.map((item) => (
                              <tr
                                key={item.id}
                                className="hover:bg-slate-50 dark:hover:bg-neutral-800/70"
                              >
                                <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-neutral-100">
                                  {item?.product_name || "—"}
                                </td>
    
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-neutral-300">
                                  {item?.product_sku || "—"}
                                </td>
    
                                <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-neutral-100">
                                  ₹
                                  {Number(item?.product_price || 0).toLocaleString(
                                    "en-IN",
                                  )}
                                </td>
    
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-neutral-300">
                                  {item?.product_quantity ?? "—"}
                                </td>
    
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-neutral-300">
                                  {item?.product_weight
                                    ? `${item.product_weight} gm`
                                    : "—"}
                                </td>
    
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-neutral-300">
                                  {item?.dimensions || "—"}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={6}
                                className="px-4 py-8 text-center text-sm text-slate-500 dark:text-neutral-400"
                              >
                                No products found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
    
                {/* ================= FOOTER ================= */}
    
                <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 dark:border-neutral-800 bg-slate-50 px-5 py-4 sm:px-6">
                  <button
                    type="button"
                    onClick={() => setViewingOrder(null)}
                    className="
    
                h-10 cursor-pointer
    
                rounded-lg
    
                border border-slate-300
    
                bg-white
    
                px-5
    
                text-sm font-medium
    
                text-slate-700
    
                shadow-sm
    
                transition
    
                hover:bg-slate-100
    
              "
                  >
                    Close
                  </button>
    
                  <button
                    type="button"
                    onClick={() => {
                      const draft = viewingOrder?.draft;
    
                      if (!draft?.id) {
                        toast.error("Draft ID not found");
    
                        return;
                      }
    
                      setViewingOrder(null);
    
                      navigate("/techbased_merchant/create_order", {
                        state: {
                          editOrder: {
                            id: draft.id,
                          },
                        },
                      });
                    }}
                    className="
    
                h-10 cursor-pointer
    
                rounded-lg
    
                bg-[#0446DB]
    
                px-5
    
                text-sm font-semibold
    
                text-white
    
                shadow-sm
    
                transition
    
                hover:bg-[#0339b4]
    
              "
                  >
                    Edit Order
                  </button>
                </div>
              </div>
            </div>
          )}
    
          {shipmentMode && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
              onMouseDown={closeShipmentModal}
            >
              <div
                className={`max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-5 shadow-2xl sm:p-6 ${
                  shipmentMode === "bulk" ? "max-w-2xl" : "max-w-md"
                }`}
                onMouseDown={(event) => event.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-950">
                    {shipmentMode === "bulk" ? "Bulk Generate AWB" : "Generate AWB"}
                  </h2>
    
                  <button
                    type="button"
                    disabled={shipmentLoading}
                    onClick={closeShipmentModal}
                    className="grid h-9 w-9 cursor-pointer place-items-center rounded-md text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
    
                <label className="mt-5 block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Order Specific
                  </span>
    
                  <select
                    value={shipmentSpecific}
                    disabled={shipmentLoading}
                    onChange={(event) => {
                      setShipmentSpecific(event.target.value);
    
                      setShipmentError(null);
                    }}
                    className="h-11 w-full cursor-pointer rounded-lg border border-slate-300 bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 px-3 text-sm outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    <option value="" disabled>
                      Select service
                    </option>
    
                    <option value="SDD-500gm">SDD - 500gm</option>
    
                    <option value="SDD-2kg">SDD - 2kg</option>
    
                    <option value="SDD-5kg">SDD - 5kg</option>
    
                    <option value="NDD-500gm">NDD - 500gm</option>
    
                    <option value="NDD-2kg">NDD - 2kg</option>
    
                    <option value="NDD-5kg">NDD - 5kg</option>
                  </select>
                </label>
    
                <label className="mt-5 block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Rider Preference
                  </span>
    
                  <select
                    value={shipmentPreference}
                    onChange={(event) => {
                      setShipmentPreference(event.target.value);
                    }}
                    className="h-11 w-full cursor-pointer rounded-lg border border-slate-300 bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 px-3 text-sm outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    <option value="">Select rider preference</option>
    
                    <option value="self">Self</option>
    
                    <option value="daakit">Daakit</option>
                  </select>
                </label>
    
                {shipmentError && (
                  <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                    <p>{shipmentError.message}</p>
    
                    {shipmentError.details.length > 0 && (
                      <ul className="mt-1 list-disc pl-5 text-xs">
                        {shipmentError.details.map((detail, index) => (
                          <li key={index}>{String(detail)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
    
                {shipmentMode === "bulk" && bulkAwbResults.length > 0 && (
                  <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                    <div className="border-b border-slate-200 dark:border-neutral-800 bg-slate-50 px-4 py-3">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-neutral-100">
                        Bulk AWB Results
                      </h3>
    
                      {bulkAwbSummary && (
                        <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">
                          Total {bulkAwbSummary.total}
                          {" · "}
                          Booked {bulkAwbSummary.booked}
                          {" · "}
                          Failed {bulkAwbSummary.failed}
                        </p>
                      )}
                    </div>
    
                    <div className="max-h-[320px] space-y-2 overflow-y-auto p-3">
                      {bulkAwbResults.map((result, index) => {
                        const booked =
                          String(result.status).toLowerCase() === "booked";
    
                        return (
                          <div
                            key={`${result.draft_id || "draft"}-${index}`}
                            className={`rounded-lg border px-3 py-3 ${
                              booked
                                ? "border-emerald-200 bg-emerald-50"
                                : "border-red-200 bg-red-50"
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm font-semibold text-slate-900 dark:text-neutral-100">
                                {result.merchant_order_id ||
                                  `Draft ${result.draft_id}`}
                              </p>
    
                              <span
                                className={`text-xs font-semibold ${
                                  booked ? "text-emerald-700" : "text-red-700"
                                }`}
                              >
                                {booked ? result.awb_number || "Booked" : "Failed"}
                              </span>
                            </div>
    
                            {result.message && (
                              <p className="mt-1 text-xs text-slate-600">
                                {result.message}
                              </p>
                            )}
    
                            {!booked && Array.isArray(result.error) && (
                              <ul className="mt-2 list-disc pl-5 text-xs text-red-600">
                                {result.error.map((message, errorIndex) => (
                                  <li key={errorIndex}>{String(message)}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
    
                {shipmentMode === "bulk" && bulkAwbResults.length > 0 ? (
                  <button
                    type="button"
                    onClick={closeShipmentModal}
                    className="mt-5 h-11 w-full cursor-pointer rounded-lg bg-[#0446DB] px-5 text-sm font-semibold text-white transition hover:bg-[#2258d6]"
                  >
                    Close
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={
                      shipmentLoading || bulkAwbLoading || !shipmentSpecific
                    }
                    onClick={createShipment}
                    className="mt-5 h-11 w-full cursor-pointer rounded-lg bg-[#0446DB] px-5 text-sm font-semibold text-white transition hover:bg-[#2258d6] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {shipmentLoading || bulkAwbLoading
                      ? "Generating..."
                      : shipmentMode === "bulk"
                        ? `Generate AWB (${selectedIds.length})`
                        : "Generate AWB"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )
    }
    </>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-semibold capitalize text-slate-900">
        {value !== null && value !== undefined && value !== "" ? value : "—"}
      </p>
    </div>
  );
}
