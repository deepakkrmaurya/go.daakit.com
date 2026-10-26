import React from "react";

const ORDER_CONFIG = {
  booked: { label: "Booked", color: "bg-indigo-500" },
  pending_pickup: { label: "Pending Pickup", color: "bg-amber-400" },
  picked: { label: "Picked", color: "bg-blue-500" },
  in_transit: { label: "In Transit", color: "bg-violet-500" },
  out_for_delivery: { label: "Out For Delivery", color: "bg-orange-500" },
  delivered: { label: "Delivered", color: "bg-green-500" },
  ndr: { label: "NDR", color: "bg-rose-500" },
  undelivered: { label: "Undelivered", color: "bg-red-500" },
  undelivered_assigned: { label: "Undelivered Assigned", color: "bg-slate-400" },
  rto_in_transit: { label: "RTO In Transit", color: "bg-blue-600" },
  rto_delivered: { label: "RTO Delivered", color: "bg-teal-500" },
  cancelled: { label: "Cancelled", color: "bg-gray-500" },
  lost: { label: "Lost", color: "bg-slate-500" },
};

const COD_CONFIG = {
  received: { label: "Received", color: "bg-green-500" },
  initiated: { label: "Initiated", color: "bg-blue-500" },
  adjusted: { label: "Adjusted", color: "bg-purple-600" },
  pending: { label: "Pending", color: "bg-orange-500" },
};

function numberValue(value) {
  return Math.max(0, Number(value) || 0);
}

function percentage(count, total) {
  return total > 0
    ? Math.min(100, Math.max(0, (numberValue(count) / total) * 100))
    : 0;
}

function labelFor(status) {
  return String(status).replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function BarsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3 17 6-6 4 3 8-9" /><path d="M15 5h6v6" /><path d="M4 21v-4M9 21v-6M14 21v-4M19 21v-8" />
    </svg>
  );
}

function CoinsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v5c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 10v5c0 1.7 3.6 3 8 3s8-1.3 8-3v-5" />
      <path d="M4 15v4c0 1.7 3.6 3 8 3s8-1.3 8-3v-4" />
    </svg>
  );
}

function StatusPanel({
  title,
  subtitle,
  icon: Icon,
  totalLabel,
  total,
  rows,
  config,
  firstColumn,
  emptyMessage,
  selectedVendorName,
  vendorId,
  formatCount,
}) {
  const displayCount = typeof formatCount === "function"
    ? formatCount
    : (value) => numberValue(value).toLocaleString("en-IN");

  return (
    <section className="min-w-0 overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:rounded-sm md:border-gray-300 md:shadow-none">
      <div className="flex flex-col gap-3 px-4 pb-3 pt-5 sm:px-5 md:flex-row md:flex-wrap md:items-start md:justify-between md:py-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400 md:h-11 md:w-11">
            <Icon />
          </span>
          <div className="min-w-0 flex flex-col text-left">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">{title}</h4>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
        </div>
        <div className="hidden shrink-0 items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/70 px-3 py-2 dark:border-blue-500/20 dark:bg-blue-500/10 md:flex">
          <span className="text-xs text-slate-500 dark:text-slate-300">{totalLabel}</span>
          <span className="text-xl font-bold tabular-nums text-[#0446DB] dark:text-blue-400">{displayCount(total)}</span>
        </div>
      </div>

      {/* Mobile: tags follow the reference layout. Desktop: fleet partner remains visible. */}
      <div className="flex flex-col items-start gap-3 px-4 pb-4 sm:px-5 md:pb-3">
        {vendorId != null && vendorId !== "" && (
          <span className="inline-flex max-w-full break-words rounded-md border border-dashed border-orange-300 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-400">
            Fleet Partner: {selectedVendorName || `Vendor #${vendorId}`}
          </span>
        )}
        <span className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400 md:hidden">
          {totalLabel} <strong>{displayCount(total)}</strong>
        </span>
      </div>

      {/* MOBILE (<md): status/count/percentage and an individual progress bar per row */}
      <div className="px-4 pb-5 sm:px-5 md:hidden">
        <div className="mb-3 flex   gap-2 text-[11px] font-medium text-gray-500 dark:text-gray-400">
          <span className="min-w-0 flex-1 text-left">{firstColumn}</span>
          <span className="w-12 shrink-0 text-left">{firstColumn === "Order Status" ? "Orders" : "Count"}</span>
          <span className="w-16 shrink-0 text-left">% of total</span>
        </div>
        {rows.length === 0 ? (
          <p className="py-6 text-center text-xs text-gray-500 dark:text-gray-400">{emptyMessage}</p>
        ) : (
          <div className="space-y-4">
            {rows.map(({ status, count }, index) => {
              const configItem = config[status] || { label: labelFor(status), color: "bg-slate-400" };
              const percent = percentage(count, total);
              return (
                <div key={`${status}-${index}`} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${configItem.color}`} />
                      <span className="min-w-0 break-words text-xs font-medium text-gray-800 dark:text-gray-200">{configItem.label}</span>
                    </div>
                    <span className="w-12 shrink-0 text-right text-xs font-bold tabular-nums text-gray-900 dark:text-white">{displayCount(count)}</span>
                    <span className="w-16 shrink-0 text-right text-xs font-semibold tabular-nums text-gray-500 dark:text-gray-400">{percent.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800">
                    <div className={`h-full rounded-full transition-all duration-500 ${configItem.color}`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DESKTOP (md+): original-style table with sticky table header and scroll */}
      <div className="hidden px-4 pb-4 sm:px-5 md:block">
        <div className="h-[40vh] max-w-full overflow-auto overscroll-contain rounded-lg border border-slate-200 dark:border-neutral-700">
          <table className="w-full min-w-[620px] border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-neutral-800">
              <tr className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                <th className="w-[35%] px-4 py-3">{firstColumn}</th>
                <th className="w-[15%] px-4 py-3 text-right">{firstColumn === "Order Status" ? "Orders" : "Count"}</th>
                <th className="w-[15%] px-4 py-3 text-right">% of Total</th>
                <th className="w-[35%] px-4 py-3">Visual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {rows.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-slate-500 dark:text-slate-400">{emptyMessage}</td></tr>
              ) : rows.map(({ status, count }, index) => {
                const configItem = config[status] || { label: labelFor(status), color: "bg-slate-400" };
                const percent = percentage(count, total);
                return (
                  <tr key={`${status}-${index}`} className="transition-colors hover:bg-blue-50/40 dark:hover:bg-neutral-800/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className={`h-3.5 w-3.5 shrink-0 rounded-full ${configItem.color}`} />
                        <span className="font-medium text-slate-800 dark:text-slate-200">{configItem.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-slate-900 dark:text-white">{displayCount(count)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-600 dark:text-slate-300">{percent.toFixed(1)}%</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-neutral-700">
                          <div className={`h-full rounded-full transition-all duration-500 ${configItem.color}`} style={{ width: `${percent}%` }} />
                        </div>
                        <span className="w-12 text-right text-xs tabular-nums text-slate-600 dark:text-slate-300">{percent.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default function OrderAndCODStatus({
  filteredStats,
  appliedScope,
  selectedVendorName,
  formatCount,
}) {
  if (!filteredStats) return null;

  const orders = filteredStats?.order_status_counts || {};
  const remittance = Array.isArray(filteredStats?.cod_remittance_counts)
    ? filteredStats.cod_remittance_counts
    : [];
  const totalOrders = numberValue(orders.total_orders);
  const totalCOD = remittance.reduce((sum, item) => sum + numberValue(item?.count), 0);
  const orderRows = Object.entries(orders)
    .filter(([status]) => status !== "total_orders")
    .map(([status, count]) => ({ status, count }));
  const codRows = remittance.map((item) => ({
    status: String(item?.status || "unknown").toLowerCase(),
    count: item?.count,
  }));

  return (
    <div className="my-6 grid min-w-0 grid-cols-1 items-start gap-4 md:gap-5 xl:grid-cols-2">
      <StatusPanel
        title="Order Status Counts"
        subtitle="Detailed overview of orders by current status"
        icon={BarsIcon}
        totalLabel="Total Orders"
        total={totalOrders}
        rows={orderRows}
        config={ORDER_CONFIG}
        firstColumn="Order Status"
        emptyMessage="No order statistics available"
        vendorId={appliedScope?.vendor_id}
        selectedVendorName={selectedVendorName}
        formatCount={formatCount}
      />
      <StatusPanel
        title="COD Remittance Status"
        subtitle="Overview of COD remittance records by status"
        icon={CoinsIcon}
        totalLabel="Total Records"
        total={totalCOD}
        rows={codRows}
        config={COD_CONFIG}
        firstColumn="Status"
        emptyMessage="No COD remittance records found"
        vendorId={appliedScope?.vendor_id}
        selectedVendorName={selectedVendorName}
        formatCount={formatCount}
      />
    </div>
  );
}
