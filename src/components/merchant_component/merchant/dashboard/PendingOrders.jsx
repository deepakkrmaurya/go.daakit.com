import React, { useEffect, useState } from "react";
import {
  Check,
  Copy,
  Loader2,
  MapPin,
  PackageOpen,
  Truck,
} from "lucide-react";

/**
 * Pending pickup table with a stationary section header, sticky table columns,
 * vertically/horizontally scrollable rows, and stationary pagination.
 *
 * Props:
 *   orders: existing API order array
 *   loading: existing loading state
 *   baseFRONT: frontend URL for tracking links (defaults to current origin)
 */
export default function PendingOrders({
  orders = [],
  loading = false,
  baseFRONT = typeof window !== "undefined" ? window.location.origin : "",
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedAwb, setCopiedAwb] = useState(null);
  const itemsPerPage = 20;

  const totalOrders = orders.length;
  const totalPages = Math.max(1, Math.ceil(totalOrders / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const indexOfFirstOrder = (safePage - 1) * itemsPerPage;
  const indexOfLastOrder = safePage * itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  useEffect(() => {
    setCurrentPage(1);
  }, [orders]);

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
    "whitespace-nowrap bg-gray-50 px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:bg-neutral-800 dark:text-neutral-400";
  const buttonClass =
    "h-8 rounded-sm border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 transition hover:border-[#0446DB]/30 hover:text-[#0446DB] disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300";

  return (
    <div className="flex h-[min(720px,calc(100dvh-100px))] min-h-[360px] min-w-0 flex-col overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      {/* STATIONARY HEADER: outside the scrollable table area */}
      <div className="relative z-20 flex shrink-0 flex-col gap-3 border-b border-gray-100 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-[#0446DB]/10">
            <Truck className="h-4 w-4 text-[#0446DB]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Pending Pickup</h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
              Pending pickup orders requiring attention
            </p>
          </div>
        </div>
        <span className="w-fit shrink-0 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0446DB] dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
          {totalOrders} Orders
        </span>
      </div>

      {/* ONLY THE TABLE SCROLLS. Header and pagination remain stationary. */}
      <div className="min-h-0 min-w-0 flex-1 overflow-auto overscroll-contain">
        {loading ? (
          <div className="flex min-h-full items-center justify-center p-10">
            <Loader2 className="h-7 w-7 animate-spin text-[#0446DB]" />
          </div>
        ) : (
          <table className="w-full min-w-[900px] border-separate border-spacing-0 text-left">
            <thead className="sticky top-0 z-10">
              <tr>
                <th className={`${headingClass} border-b border-gray-100 dark:border-neutral-800`}>
                  Order Information
                </th>
                <th className={`${headingClass} border-b border-gray-100 dark:border-neutral-800`}>
                  Delivery Address
                </th>
                <th className={`${headingClass} border-b border-gray-100 dark:border-neutral-800`}>
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
                      className=" border hover:bg-gray-50/70 dark:hover:bg-neutral-800/50"
                    >
                      <td className="px-5 align-top">
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`${String(baseFRONT).replace(/\/$/, "")}/track-order?awb_number=${encodeURIComponent(awb ?? "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-[#0446DB] transition hover:underline"
                            >
                              {awb || "-"}
                            </a>
                            <button
                              type="button"
                              onClick={() => copyAwb(awb)}
                              title="Copy AWB"
                              aria-label={`Copy AWB ${awb || ""}`}
                              className="rounded-md p-1 text-gray-400 transition hover:bg-blue-50 hover:text-[#0446DB] dark:hover:bg-blue-500/10"
                            >
                              {copiedAwb === String(awb) ? (
                                <Check className="h-3.5 w-3.5 text-green-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-400">
                            {formatDate(order?.created_at)} <span
  className={`inline-flex items-center gap-1.5 rounded-full border border-dashed px-2.5 py-1 text-[11px] font-bold tracking-wide transition-colors ${
    order?.rider_preference === "self"
      ? "border-purple-400 bg-purple-50 text-purple-700 dark:border-purple-500/60 dark:bg-purple-500/10 dark:text-purple-300"
      : "border-[#0446DB]/50 bg-blue-50 text-[#0446DB] dark:border-blue-400/50 dark:bg-blue-500/10 dark:text-blue-300"
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
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-400">
                            <span>MID: {order?.merchant_id ?? "-"}</span>
                            <span>•</span>
                            <span title={moid}>MOID: {moid.length <= 15 ? moid || "-" : `${moid.slice(0, 15)}...`}</span>
                          </div>
                          


                        </div>
                      </td>
                      <td className="px-5  align-top">
                        <div className="flex max-w-[330px] items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                          <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                              {order?.delivery_contact_name || "-"}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-neutral-400">
                              {order?.delivery_address_line || "-"}
                            </p>
                            <p className="mt-1 text-xs text-gray-400 dark:text-neutral-500">
                              {order?.delivery_city || "-"}, {order?.delivery_state || "-"} - {order?.delivery_pincode || "-"}
                            </p>
                            <p className="mt-0.5 text-[11px] text-gray-400 dark:text-neutral-500">
                              {order?.delivery_country || "-"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5  align-top">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <PackageOpen className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">
                              {(Number.isFinite(weight) ? weight : 0).toLocaleString("en-IN")} g
                            </span>
                          </div>
                          <p className="pl-6 text-xs text-gray-500 dark:text-neutral-400">
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
                      <p className="mt-3 text-sm font-semibold text-gray-600 dark:text-neutral-300">No orders found</p>
                      <p className="mt-1 text-xs text-gray-400 dark:text-neutral-500">Try adjusting your date filters</p>
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
        <div className="relative z-20 flex shrink-0 flex-col gap-3 border-t border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950/50 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
          <p className="text-xs text-gray-600 dark:text-neutral-300">
            Showing <span className="font-semibold">{indexOfFirstOrder + 1}</span> to{" "}
            <span className="font-semibold">{Math.min(indexOfLastOrder, totalOrders)}</span> of{" "}
            <span className="font-semibold">{totalOrders}</span> orders
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <button type="button" onClick={() => handlePageChange(safePage - 1)} disabled={safePage === 1} className={buttonClass}>
              Previous
            </button>
            {getPageNumbers().map((pageNumber) => (
              <button
                type="button"
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                aria-current={safePage === pageNumber ? "page" : undefined}
                className={`flex h-8 min-w-8 items-center justify-center rounded-sm border px-2 text-xs font-semibold transition ${
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
