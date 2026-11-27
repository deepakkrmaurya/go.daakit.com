import React, { useEffect, useState } from "react";
import {
  Check,
  Copy,
  Loader2,
  MapPin,
  PackageOpen,
  Search,
  X,
} from "lucide-react";
export default function PendingOrders({
  orders = [],
  loading = false,
  baseFRONT = typeof window !== "undefined" ? window.location.origin : "",
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedAwb, setCopiedAwb] = useState(null);
  const [searchAwb, setSearchAwb] = useState("");
  const itemsPerPage = 20;
  const query = searchAwb.trim().toLowerCase();
  const filteredOrders = query
    ? orders.filter((order) => String(order?.awb_number ?? "").toLowerCase().includes(query))
    : orders;
  const totalOrders = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalOrders / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const indexOfFirstOrder = (safePage - 1) * itemsPerPage;
  const indexOfLastOrder = safePage * itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  useEffect(() => {
    setCurrentPage(1);
  }, [orders, searchAwb]);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(Math.min(totalPages, Math.max(1, pageNumber)));
  };
  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    const startPage = Math.max(
      1,
      Math.min(safePage - Math.floor(maxVisiblePages / 2), totalPages - maxVisiblePages + 1),
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };
  const copyAwb = async (awb) => {
    if (!awb) return;
    try {
      await navigator.clipboard.writeText(String(awb));
      setCopiedAwb(String(awb));
    } catch (error) {
      setCopiedAwb(null);
      console.error("Unable to copy AWB", error);
    }
  };
  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  const headingClass =
    "sticky top-0 whitespace-nowrap bg-gray-50 px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:bg-neutral-800 dark:text-neutral-400";
  const buttonClass =
    "h-7 rounded-sm border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 transition hover:border-[#0446DB]/30 hover:text-[#0446DB] disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300";
  return (
    <div className="flex h-[min(480px,calc(100dvh-100px))] min-h-0 min-w-0 flex-col overflow-hidden rounded-sm border border-gray-300 bg-white dark:border-gray-800 dark:bg-neutral-900">
      {/* STATIONARY HEADER: outside the scrollable table area */}
      <div className="relative z-20 flex shrink-0 flex-wrap items-center justify-between gap-2 bg-white px-4 py-3 dark:bg-neutral-900 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Pending Pickup</h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
              Pending pickup orders requiring attention
            </p>
          </div>
        </div>
        <div className="flex w-full min-w-0 flex-wrap items-center gap-3 sm:w-auto">
          <div className="relative min-w-0 flex-1 sm:w-64 sm:flex-none">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              aria-label="Search by AWB number"
              placeholder="Search by AWB number..."
              value={searchAwb}
              onChange={(e) => { setSearchAwb(e.target.value); setCurrentPage(1); }}
              className="h-9 w-full rounded-sm border border-gray-200 bg-white pl-9 pr-9 text-sm text-gray-800 outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
            {searchAwb && (
              <button type="button" aria-label="Clear AWB search" onClick={() => { setSearchAwb(""); setCurrentPage(1); }} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <span className="shrink-0 text-sm font-semibold tabular-nums text-[#0446DB] dark:text-blue-300">
            {totalOrders} Orders
          </span>
        </div>
      </div>
      {/* ONLY THE TABLE SCROLLS. Header and pagination remain stationary. */}
      <div className="min-h-0 min-w-0 flex-1 overflow-auto overscroll-contain">
        {loading ? (
          <div className="flex min-h-full items-center justify-center p-10">
            <Loader2 className="h-7 w-7 animate-spin text-[#0446DB]" />
          </div>
        ) : (
          <table className="w-full min-w-[780px] table-fixed border-separate border-spacing-0 text-left">
            <thead className="sticky top-0 z-10">
              <tr>
                <th className={`${headingClass} w-[34%] border-b border-gray-200 dark:border-neutral-800`}>
                  Order Information
                </th>
                <th className={`${headingClass} w-[46%] border-b border-gray-200 dark:border-neutral-800`}>
                  Delivery Address
                </th>
                <th className={`${headingClass} w-[20%] border-b border-gray-200 dark:border-neutral-800`}>
                  Package Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
              {currentOrders.length > 0 ? (
                currentOrders.map((order, index) => {
                  const awb = order?.awb_number;
                  const moid = String(order?.merchant_order_id ?? "");
                  const weight = Number(order?.total_weight || 0);
                  return (
                    <tr
                      key={`${order?.id ?? awb ?? "order"}-${index}`}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                    >
                      <td className="border-b border-gray-100 px-4 py-2.5 align-middle dark:border-neutral-800">
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`${String(baseFRONT).replace(/\/$/, "")}/track-order?awb_number=${encodeURIComponent(awb ?? "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="break-all text-sm font-semibold text-[#0446DB] transition hover:underline dark:text-blue-400"
                            >
                              {awb || "-"}
                            </a>
                            <button
                              type="button"
                              onClick={() => copyAwb(awb)}
                              title="Copy AWB"
                              aria-label={`Copy AWB ${awb || ""}`}
                              className="shrink-0 rounded p-1 text-gray-400 transition hover:bg-blue-50 hover:text-[#0446DB] dark:hover:bg-blue-500/10"
                            >
                              {copiedAwb === String(awb) ? (
                                <Check className="h-3.5 w-3.5 text-green-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                          <p className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500 dark:text-neutral-400">
                            {formatDate(order?.created_at)} <span
  className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
    order?.rider_preference === "self"
      ? "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300"
      : "bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-300"
  }`}
>
  <span
    className={`h-1.5 w-1.5 rounded-full ${
      order?.rider_preference === "self"
        ? "bg-purple-500"
        : "bg-[#0446DB]"
    }`}
  />
  {order?.rider_preference === "self" ? "BYOB" : "DDN"}
</span>
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
                            <span>MID: {order?.merchant_id ?? "-"}</span>
                            <span>•</span>
                            <span title={moid}>MOID: {moid.length <= 15 ? moid || "-" : `${moid.slice(0, 15)}...`}</span>
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-gray-100 px-4 py-2.5 align-middle dark:border-neutral-800">
                        <div className="flex min-w-0 items-start gap-2">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                          <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                              {order?.delivery_contact_name || "-"}
                            </p>
                            <p className="break-words text-xs leading-4 text-gray-600 dark:text-neutral-400">
                              {order?.delivery_address_line || "-"}
                            </p>
                            <p className="break-words text-xs text-gray-500 dark:text-neutral-500">
                              {order?.delivery_city || "-"}, {order?.delivery_state || "-"} - {order?.delivery_pincode || "-"}
                            </p>
                            <p className="mt-0.5 text-[11px] text-gray-500 dark:text-neutral-500">
                              {order?.delivery_country || "-"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-gray-100 px-4 py-2.5 align-middle dark:border-neutral-800">
                        <div className="min-w-0 space-y-1">
                          <div className="inline-flex items-center gap-1.5">
                            <PackageOpen className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-semibold tabular-nums text-gray-800 dark:text-neutral-200">
                              {(Number.isFinite(weight) ? weight : 0).toLocaleString("en-IN")} g
                            </span>
                          </div>
                          <p className="break-words text-xs text-gray-500 dark:text-neutral-400">
                            {order?.package_length || "-"} × {order?.package_breadth || "-"} × {order?.package_height || "-"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">
                        <PackageOpen className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-gray-600 dark:text-neutral-300">{query ? "No matching AWB found" : "No orders found"}</p>
                      <p className="break-words text-xs text-gray-500 dark:text-neutral-500">{query ? "Try another AWB number" : "Try adjusting your date filters"}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {/* STATIONARY PAGINATION: never scrolls with table rows */}
      {totalOrders > 0 && (
        <div className="relative z-20 flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-gray-100 bg-white px-4 py-2 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs text-gray-600 dark:text-neutral-300">
            Showing <span className="font-semibold">{indexOfFirstOrder + 1}</span> to{" "}
            <span className="font-semibold">{Math.min(indexOfLastOrder, totalOrders)}</span> of{" "}
            <span className="font-semibold">{totalOrders}</span> orders
          </p>
          <div className="flex max-w-full items-center gap-1.5 overflow-x-auto [&>button]:shrink-0">
            <button type="button" onClick={() => handlePageChange(safePage - 1)} disabled={safePage === 1} className={buttonClass}>
              Previous
            </button>
            {getPageNumbers().map((pageNumber) => (
              <button
                type="button"
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                aria-current={safePage === pageNumber ? "page" : undefined}
                className={`flex h-7 min-w-7 items-center justify-center rounded-sm border px-2 text-xs font-semibold transition ${
                  safePage === pageNumber
                    ? "border-[#0446DB] bg-[#0446DB] text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-[#0446DB]/30 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button type="button" onClick={() => handlePageChange(safePage + 1)} disabled={safePage === totalPages} className={buttonClass}>
              Next
            </button>
          </div>
          <p className="text-xs text-gray-400 dark:text-neutral-500">{itemsPerPage} per page</p>
        </div>
      )}
    </div>
  );
}
