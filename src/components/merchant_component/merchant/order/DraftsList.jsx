import React, { useEffect, useMemo, useRef, useState } from "react";
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
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_BASE_URL;

const merchantFrontAPI = `${String(baseURL || "").replace(
  /\/$/,
  "",
)}/api/merchant`;

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

const tabs = ["All", "Unfulfilled", "Process", "Fulfilled", "Cancelled"];

const statusStyles = {
  UNFULFILLED: "bg-amber-100 text-amber-800",
  PROCESS: "bg-sky-100 text-sky-700",
  FULFILLED: "bg-emerald-100 text-emerald-700",
  DRAFT: "bg-slate-100 text-slate-700",
  "AWB ISSUED": "bg-sky-100 text-sky-700",
  MANIFESTED: "bg-amber-100 text-amber-800",
  "IN TRANSIT": "bg-orange-100 text-orange-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  RTO: "bg-purple-100 text-purple-700",
  CANCELLED: "bg-red-100 text-red-600",
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

export default function DraftsList() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
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

  // GET /api/merchantfront/drafts
  const fetchDrafts = async () => {
    try {
      setLoading(true);

      const result = await apiRequest("/drafts?page=1&limit=500");

      setOrders((result.data || []).map(mapDraft));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const tabCount = (tab) => {
    if (tab === "All") {
      return orders.length;
    }

    return orders.filter(
      (order) => order.fulfillmentStatus === normalizeStatus(tab),
    ).length;
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab =
        activeTab === "All" ||
        order.fulfillmentStatus === normalizeStatus(activeTab);

      const matchesType =
        typeFilter === "All types" || order.type === typeFilter;

      return matchesTab && matchesType;
    });
  }, [orders, activeTab, typeFilter]);

  // NEW: Total pages
  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / rowsPerPage),
  );

  // NEW: Current page orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;

    return filteredOrders.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredOrders, currentPage, rowsPerPage]);

  // NEW: Show maximum 5 page buttons
  const visiblePages = useMemo(() => {
    const firstPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));

    const lastPage = Math.min(totalPages, firstPage + 4);

    return Array.from(
      { length: lastPage - firstPage + 1 },
      (_, index) => firstPage + index,
    );
  }, [currentPage, totalPages]);

  // NEW: Showing 1-10 of 50
  const firstVisibleRow = filteredOrders.length
    ? (currentPage - 1) * rowsPerPage + 1
    : 0;

  const lastVisibleRow = Math.min(
    currentPage * rowsPerPage,
    filteredOrders.length,
  );

  // NEW: Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, typeFilter, rowsPerPage]);

  // NEW: Handle deleted/updated records
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const selectableDraftIds = paginatedOrders
    .filter((order) =>
      ["UNFULFILLED", "PROCESS"].includes(order.fulfillmentStatus),
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

  // POST /api/merchantfront/bulkGetAwbForDrafts
  const generateBulkAwb = async (
    ids = selectedIds,
    orderSpecific = shipmentSpecific,
  ) => {
    if (!Array.isArray(ids) || ids.length === 0) {
      toast.error("Select at least one eligible draft");
      return;
    }

    try {
      setBulkAwbLoading(true);
      setBulkAwbResults([]);
      setBulkAwbSummary(null);

      // Backend will get order_specific from the saved draft.
      const requests = ids
        .map((draftId) => {
          const orderExists = orders.some(
            (order) => Number(order.id) === Number(draftId),
          );

          if (!orderExists) {
            console.warn("Draft not found in current orders:", draftId);

            return null;
          }

          return {
            draft_id: draftId,
            order_specific: orderSpecific,
          };
        })
        .filter(Boolean);

      if (requests.length === 0) {
        toast.error("No valid drafts found");
        return;
      }

      console.log("Bulk Get AWB Request:", requests);

      console.table(requests);

      const result = await apiRequest("/bulkGetAwbForDrafts", {
        method: "POST",
        body: JSON.stringify(requests),
      });

      console.log("Bulk Get AWB Response:", result);

      console.log("Bulk Get AWB Summary:", result.summary);

      console.table(result.results || []);

      const results = Array.isArray(result.results) ? result.results : [];

      const summary = {
        total: Number(result.summary?.total ?? requests.length),

        booked: Number(result.summary?.booked ?? 0),

        failed: Number(result.summary?.failed ?? 0),
      };

      setBulkAwbSummary(summary);
      setBulkAwbResults(results);
      setSelectedIds([]);

      const { booked, failed } = summary;

      // All AWBs generated.
      if (booked > 0 && failed === 0) {
        toast.success(
          result.message ||
            `${booked} AWB${booked > 1 ? "s" : ""} generated successfully`,
        );
      }

      // All AWBs failed.
      else if (booked === 0 && failed > 0) {
        const firstFailure = results.find(
          (item) => String(item.status).toLowerCase() === "failed",
        );

        toast.error(
          firstFailure?.message || result.message || "All AWB requests failed",
          {
            duration: 5000,
          },
        );
      }

      // Some AWBs booked and some failed.
      else if (booked > 0 && failed > 0) {
        toast(`${booked} booked and ${failed} failed`, {
          icon: "⚠️",
          duration: 5000,
        });
      }

      // No result received.
      else {
        toast(result.message || "Bulk Get AWB processed", {
          icon: "ℹ️",
        });
      }

      await fetchDrafts();

      return true;
    } catch (error) {
      console.error("Bulk Get AWB Error:", {
        status: error?.status,
        message: error?.message,
        payload: error?.payload,
        error,
      });

      const validationError = Array.isArray(error?.payload?.error)
        ? error.payload.error.join(", ")
        : error?.payload?.error;

      toast.error(
        validationError ||
          error?.payload?.message ||
          error?.message ||
          "Bulk Get AWB failed",
        {
          duration: 5000,
        },
      );

      return false;
    } finally {
      setBulkAwbLoading(false);
    }
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

    if (!shipmentSpecific) {
      setShipmentError({
        message: "Please select an order specific service",
        details: [],
      });

      return;
    }

    try {
      setShipmentLoading(true);
      setShipmentError(null);

      if (shipmentMode === "bulk") {
        await generateBulkAwb(selectedIds, shipmentSpecific);

        return;
      }

      if (!shipmentOrder) return;

      const result = await apiRequest(`/getAwbForDraft/${shipmentOrder.id}`, {
        method: "POST",
        body: JSON.stringify({
          order_specific: shipmentSpecific,
        }),
      });

      console.log("Get AWB Response:", result);

      toast.success(result.message || "AWB generated successfully");

      await fetchDrafts();

      setShipmentOrder(null);
      setShipmentMode(null);
      setShipmentSpecific("");
      setShipmentError(null);
    } catch (error) {
      console.error("Get AWB Error:", {
        status: error.status,
        message: error.message,
        payload: error.payload,
      });

      setShipmentError({
        message: error.message || "Unable to create shipment",

        details: Array.isArray(error.payload?.error) ? error.payload.error : [],
      });

      toast.error(
        error.payload?.message || error.message || "Failed to generate AWB",
      );
    } finally {
      setShipmentLoading(false);
    }
  };

  // GET /api/merchantfront/draft/:draft_id
  const viewOrder = async (id) => {
    try {
      const result = await apiRequest(`/draft/${id}`);

      setViewingOrder({
        ...mapDraft(result.draft),
        items: result.items || [],
      });

      setOpenMenu(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // POST /api/merchantfront/draft/:draft_id/copy
  // const copyOrder = async (id) => {
  //   try {
  //     const result = await apiRequest(`/draft/${id}/copy`, {
  //       method: "POST",
  //       body: JSON.stringify({}),
  //     });

  //     const copiedDraftId =
  //       result?.draft_id ||
  //       result?.draft?.id ||
  //       result?.data?.draft_id ||
  //       result?.data?.id ||
  //       result?.id;

  //     if (!copiedDraftId) {
  //       throw new Error("Copied draft ID was not returned by the API");
  //     }

  //     toast.success(
  //       `Draft copied: ${
  //         result?.orderno || result?.data?.orderno || copiedDraftId
  //       }`,
  //     );

  //     setOpenMenu(null);

  //     // Open copied draft on Create Order page
  //     navigate("/merchant/create_order", {
  //       state: {
  //         editOrder: {
  //           id: copiedDraftId,
  //         },
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Copy Draft Error:", error);

  //     toast.error(error?.message || "Failed to copy draft");
  //   }
  // };

  const copyOrder = (id) => {
  setOpenMenu(null);

  navigate("/merchant/create_order", {
    state: {
      copyOrder: {
        id,
      },
    },
  });
};
  // POST /api/merchantfront/draft/:draft_id/cancel
  const cancelOrder = async (id) => {
    try {
      await apiRequest(`/draft/${id}/cancel`, {
        method: "POST",
        body: JSON.stringify({}),
      });

      setOpenMenu(null);

      toast.success("Order cancelled successfully");

      await fetchDrafts();
    } catch (error) {
      toast.error(error.message);
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

    <div className="min-h-screen  text-slate-900">
      <header className=" py-2">
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
              onClick={() => navigate("/merchant/bulk-upload")}
              className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-white/30 bg-[#0446Db] px-3 text-xs font-medium text-white shadow-sm transition hover:bg-white/20 sm:px-4 sm:text-sm"
            >
              <Layers3 size={17} className="shrink-0" />
              <span>Bulk Upload</span>
            </button>

            <Link
              to="/merchant/create_order"
              className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-white px-3 text-xs font-semibold text-[#0446DB] shadow-sm transition hover:bg-blue-50 sm:px-4 sm:text-sm"
            >
              <CirclePlus size={17} className="shrink-0" />
              <span>Create Order</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="p-2">
        <div className="overflow-x-auto rounded-lg dark:bg-neutral-800 bg-slate-20/70 p-1">
          <div className="overflow-x-auto rounded-lg bg-slate-100/70 dark:bg-neutral-800 p-2 scrollbar-hide">
            <div className="mx-auto flex min-w-max items-center justify-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`cursor-pointer whitespace-nowrap rounded-full border px-3 py-2 text-xs shadow-sm transition ${
                    activeTab === tab
                      ? "border-[#0446DB] bg-[#0446DB] font-medium text-white shadow-md"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#0446DB]/40 hover:text-[#0446DB] hover:shadow-md"
                  }`}
                >
                  {tab}

                  <span
                    className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] ${
                      activeTab === tab
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tabCount(tab)}
                  </span>
                </button>
              ))}

              <div className="mx-1 h-6 w-px bg-slate-300" />

              <label className="relative">
                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value)}
                  className="h-9 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white px-3 pr-8 text-xs shadow-sm outline-none focus:border-[#0446DB]"
                >
                  <option value="All types">All types</option>
                  <option value="Prepaid">Prepaid</option>
                  <option value="COD">COD</option>
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
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

        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div
            className={`overflow-x-auto ${
              filteredOrders.length <= 2 ? "min-h-[360px]" : ""
            }`}
          >
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-slate-50 dark:bg-neutral-800  text-[11px] uppercase text-slate-500">
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

                  {activeTab === "Process" && (
                    <th className="px-3 py-4 font-medium">Error</th>
                  )}

                  <th className="px-3 py-4 font-medium">Created</th>

                  <th className="px-3 py-4 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:bg-neutral-800 text-sm">
                {paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-700"
                  >
                    <td className="px-3 py-4 dark:text-white">
                      <input
                        type="checkbox"
                        disabled={
                          !["UNFULFILLED", "PROCESS"].includes(
                            order.fulfillmentStatus,
                          )
                        }
                        checked={selectedIds.includes(order.id)}
                        onChange={() => toggleOrder(order.id)}
                        className="h-4 w-4 cursor-pointer accent-[#0446DB] disabled:cursor-not-allowed disabled:opacity-30"
                      />
                    </td>

                    <td className="px-5 py-4 dark:text-white">
                      <p className="font-semibold dark:text-white text-slate-950">
                        {order.orderNo}
                      </p>

                      <p className="mt-1 font-mono text-[10px] dark:text-white text-slate-500">
                        {order.internalNo}
                      </p>
                    </td>

                    <td className="px-3 py-4 dark:text-white font-medium text-slate-700">
                      {order.route}
                    </td>

                    <td className="px-3 py-4 dark:text-white font-mono font-semibold">
                      {order.amount}
                    </td>

                    <td className="px-3 py-4">
                      <StatusBadge status={order.fulfillmentStatus} />
                    </td>

                    {activeTab === "Process" && (
                      <td className="max-w-[240px] dark:bg-neutral-800 px-3 py-4">
                        <span
                          className={
                            order.error !== "—"
                              ? "inline-flex items-center gap-1.5 text-xs font-medium text-red-600"
                              : "text-slate-400"
                          }
                        >
                          {order.error !== "—" && <AlertTriangle size={14} />}

                          {order.error}
                        </span>
                      </td>
                    )}

                    <td className="px-3 py-4 text-xs text-slate-600">
                      {order.created}
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
                        className="grid h-8 w-8 cursor-pointer place-items-center rounded-md hover:bg-slate-100"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {openMenu === order.id && (
                        <div className="absolute  right-3 z-50 w-40 rounded-md border dark:bg-neutral-800 border-slate-200 bg-white p-1 shadow-xl">
                          <button
                            type="button"
                            onClick={() => viewOrder(order.id)}
                            className="w-full cursor-pointer rounded  px-3 py-2 text-left text-xs hover:bg-slate-50 dark:hover:text-gray-900"
                          >
                            View
                          </button>

                          {!["FULFILLED", "CANCELLED"].includes(
                            order.fulfillmentStatus,
                          ) && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate("/merchant/create_order", {
                                  state: {
                                    editOrder: {
                                      id: order.id,
                                    },
                                  },
                                })
                              }
                              className="w-full cursor-pointer rounded px-3 py-2 text-left text-xs hover:bg-slate-50 dark:hover:text-gray-900"
                            >
                              Edit
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => copyOrder(order.id)}
                            className="w-full cursor-pointer rounded px-3 py-2 text-left text-xs hover:bg-slate-50 dark:hover:text-gray-900"
                          >
                            Copy
                          </button>

                          {["UNFULFILLED", "PROCESS"].includes(
                            order.fulfillmentStatus,
                          ) && (
                            <button
                              type="button"
                              onClick={() => openShipmentModal(order)}
                              className="w-full cursor-pointer rounded px-3 py-2 text-left text-xs hover:bg-slate-50 dark:hover:text-gray-900"
                            >
                              Get AWB
                            </button>
                          )}

                          {!["FULFILLED", "CANCELLED"].includes(
                            order.fulfillmentStatus,
                          ) && (
                            <button
                              type="button"
                              onClick={() => cancelOrder(order.id)}
                              className="w-full cursor-pointer rounded px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 dark:hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {!loading && !filteredOrders.length && (
                  <tr>
                    <td
                      colSpan={activeTab === "Process" ? 9 : 8}
                      className="px-6 py-16 text-center text-sm text-slate-500"
                    >
                      No orders found
                    </td>
                  </tr>
                )}

                {loading && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-16 text-center text-sm text-slate-500"
                    >
                      Loading drafts...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* NEW: Pagination UI */}
          {!loading && filteredOrders.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <p>
                  Showing{" "}
                  <span className="font-semibold text-slate-900">
                    {firstVisibleRow}-{lastVisibleRow}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900">
                    {filteredOrders.length}
                  </span>{" "}
                  orders
                </p>

                <label className="flex items-center gap-2">
                  <span>Rows per page</span>

                  <select
                    value={rowsPerPage}
                    onChange={(event) =>
                      setRowsPerPage(Number(event.target.value))
                    }
                    className="h-8 cursor-pointer rounded-md border border-slate-300 bg-white px-2 text-xs font-medium text-slate-700 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10"
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
                  className="grid h-8 w-8 cursor-pointer place-items-center rounded-md border border-slate-300 bg-white text-slate-600 transition hover:border-[#0446DB] hover:text-[#0446DB] disabled:cursor-not-allowed disabled:opacity-40"
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
                          : "border-slate-300 bg-white text-slate-600 hover:border-[#0446DB] hover:text-[#0446DB]"
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
                  className="grid h-8 w-8 cursor-pointer place-items-center rounded-md border border-slate-300 bg-white text-slate-600 transition hover:border-[#0446DB] hover:text-[#0446DB] disabled:cursor-not-allowed disabled:opacity-40"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onMouseDown={() => setViewingOrder(null)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Order Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {viewingOrder.orderNo}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-md text-slate-500 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-5 sm:p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-50 p-4">
                <div>
                  <p className="text-xs text-slate-500">Current status</p>

                  <div className="mt-2">
                    <StatusBadge status={viewingOrder.status} />
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500">Created on</p>

                  <p className="mt-1 text-sm font-semibold">
                    {viewingOrder.created}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  // ["Order number", viewingOrder.orderNo],
                  // ["Internal number", viewingOrder.internalNo],
                  // ["AWB number", viewingOrder.awb],
                  ["Receiver", viewingOrder.receiver],
                  ["Phone", viewingOrder.phone],
                  ["City", viewingOrder.city],
                  ["Weight", viewingOrder.weight],
                  // ["Carrier", viewingOrder.carrier],
                  ["Payment type", viewingOrder.type],
                  ["COD amount", viewingOrder.cod],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-slate-200 p-3"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {label}
                    </p>

                    <p className="mt-1.5 break-words text-sm font-semibold text-slate-900">
                      {value || "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="h-10 cursor-pointer rounded-md border border-slate-300 bg-white px-5 text-sm font-medium shadow-sm hover:bg-slate-50"
              >
                Close
              </button>

              {viewingOrder.status === "DRAFT" && (
                <button
                  type="button"
                  onClick={() => {
                    const orderToEdit = viewingOrder;

                    setViewingOrder(null);

                    navigate("/merchant/create_order", {
                      state: {
                        editOrder: orderToEdit,
                      },
                    });
                  }}
                  className="h-10 cursor-pointer rounded-md bg-[#0446DB] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[#0446DB]/80"
                >
                  Edit Order
                </button>
              )}
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
                className="h-11 w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-slate-100"
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
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Bulk AWB Results
                  </h3>

                  {bulkAwbSummary && (
                    <p className="mt-1 text-xs text-slate-500">
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
                          <p className="text-sm font-semibold text-slate-900">
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
