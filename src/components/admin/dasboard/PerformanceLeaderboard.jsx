import React, { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

// API breakdown rows have { dimensions, display_name, metrics, generated_at }.
// Keep the backend's percentage values instead of recalculating them.
const TABS = [
  { id: "merchant", label: "Merchants", prefix: "M", idKey: "merchant_id", prop: "merchants" },
  { id: "dc", label: "DCs", prefix: "D", idKey: "dc_id", prop: "dcs" },
  { id: "vendor", label: "Vendors", prefix: "V", idKey: "vendor_id", prop: "vendors" },
  { id: "rider", label: "Riders", prefix: "R", idKey: "rider_id", prop: "riders" },
];

const number = (value) => Number(value ?? 0).toLocaleString("en-IN");
const percent = (value) => value == null ? "—" : `${Number(value).toFixed(2)}%`;
const hours = (minutes) => minutes == null ? "—" : `${(Number(minutes) / 60).toFixed(2)} hrs`;

export default function PerformanceLeaderboard({
  merchants = [],
  dcs = [],
  vendors = [],
  riders = [],
  getBreakdownSummery,
}) {
     
  const [activeTab, setActiveTab] = useState("merchant");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const active = TABS.find((tab) => tab.id === activeTab) || TABS[0];
  const source = { merchant: merchants, dc: dcs, vendor: vendors, rider: riders }[activeTab];

  const currentData = useMemo(() => {
    const entries = Array.isArray(source) ? source : [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((item) => {
      const id = item?.dimensions?.[active.idKey] ?? item?.id ?? "";
      return String(item?.display_name ?? item?.name ?? "").toLowerCase().includes(q) ||
        String(id).toLowerCase().includes(q);
    });
  }, [source, searchQuery, active.idKey]);

  const selectTab = (id) => {
    setActiveTab(id);
    setExpandedRow(null);
    setIsMobileDropdownOpen(false);
    setSearchQuery("");
    if (typeof getBreakdownSummery === "function") getBreakdownSummery(id);
  };

  const rows = currentData.map((item, idx) => {
    const m = item?.metrics || {};
    return {
      key: `${item?.dimensions?.[active.idKey] ?? item?.id ?? idx}-${idx}`,
      id: item?.dimensions?.[active.idKey] ?? item?.id ?? "—",
      name: item?.display_name || item?.name || "Unmapped",
      orders: m.total_orders,
      picked: m.pickup_orders,
      attempted: m.attempted_orders,
      delivered: m.delivered_orders,
      fasr: m.fasr?.percentage,
      ndr: m.ndr_rate?.percentage,
      rto: m.rto_conversion?.percentage,
      delivery: m.delivery_conversion?.percentage,
      tat: m.average_delivery_tat_minutes,
    };
  });

  const headings = [active.label.slice(0, -1), "Orders", "Picked", "Delivery attempted", "Delivered", "FASR", "NDR rate", "RTO rate", "Delivery", "Avg delivery TAT"];

  return (
    <section
     className="flex min-h-0 w-full flex-col overflow-hidden rounded-sm border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
    
    >
      <div className="shrink-0 border-b border-gray-100 p-4 dark:border-neutral-800 sm:p-5">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div className="min-w-0">
            <h3 className="text-[15px] font-bold text-gray-900 text-left dark:text-white ">Performance leaderboard</h3>
            <div className="mt-3 hidden text-left flex-wrap gap-1 sm:flex">
              {TABS.map((tab) => (
                <button key={tab.id} type="button" onClick={() => selectTab(tab.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${activeTab === tab.id ? "bg-blue-50 text-[#0446db] dark:bg-blue-900/30" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800"}`}>
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="relative mt-3 sm:hidden">
              <button type="button" onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)} className="flex w-full items-center justify-between rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-[#0446db]">
                {active.label}<ChevronDown size={16} />
              </button>
              {isMobileDropdownOpen && <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-md border bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                {TABS.map((tab) => <button type="button" key={tab.id} onClick={() => selectTab(tab.id)} className="block w-full px-4 py-2 text-left text-xs hover:bg-blue-50 dark:hover:bg-neutral-700">{tab.label}</button>)}
              </div>}
            </div>
          </div>
          <label className="relative block w-full shrink-0 md:w-64">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search name or ID"
              className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-[#0446db] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
          </label>
        </div>
      </div>

      <div className="hidden h-80 min-h-0 shrink-0 overflow-y-scroll overscroll-contain md:block">
        <table className="w-full min-w-[1050px] border-separate border-spacing-0 text-left">
          <thead><tr>{headings.map((heading) => <th key={heading} className="sticky top-0 z-10 whitespace-nowrap border-b border-gray-200 bg-slate-50 px-4 py-3 text-center text-[11px] font-semibold text-gray-500 first:text-left dark:border-neutral-800 dark:bg-neutral-800 dark:text-gray-300">{heading}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
            {rows.map((row) => <tr key={row.key} className="hover:bg-gray-50 dark:hover:bg-neutral-800/40">
              <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white"><span className="mr-2 rounded bg-blue-50 px-1.5 py-1 text-[#0446db]">{active.prefix}</span>{row.name} <span className="font-normal text-gray-400">#{row.id}</span></td>
              <td className="px-4 py-3 text-center text-xs">{number(row.orders)}</td>
              <td className="px-4 py-3 text-center text-xs">{number(row.picked)}</td>
              <td className="px-4 py-3 text-center text-xs">{number(row.attempted)}</td>
              <td className="px-4 py-3 text-center text-xs">{number(row.delivered)}</td>
              <td className="px-4 py-3 text-center text-xs"><span className="rounded bg-blue-50 px-2 py-1 font-semibold text-[#0446db]">{percent(row.fasr)}</span></td>
              <td className="px-4 py-3 text-center text-xs">{percent(row.ndr)}</td>
              <td className="px-4 py-3 text-center text-xs">{percent(row.rto)}</td>
              <td className="px-4 py-3 text-center text-xs"><span className="rounded bg-blue-50 px-2 py-1 font-semibold text-[#0446db]">{percent(row.delivery)}</span></td>
              <td className="px-4 py-3 text-center text-xs">{hours(row.tat)}</td>
            </tr>)}
            {!rows.length && <tr><td colSpan={10} className="px-4 py-10 text-center text-sm text-gray-500">No records found</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="h-40 min-h-0 shrink-0 space-y-2 overflow-y-auto overscroll-contain p-3 md:hidden">
        {rows.map((row) => <div key={row.key} className="overflow-hidden rounded-lg border border-gray-200 dark:border-neutral-800">
          <button type="button" onClick={() => setExpandedRow(expandedRow === row.key ? null : row.key)} className="flex w-full items-center justify-between gap-2 bg-gray-50 p-3 text-left dark:bg-neutral-800">
            <div className="min-w-0"><p className="truncate text-sm font-semibold">{row.name}</p><p className="text-xs text-gray-500">ID: {row.id}</p></div>
            <div className="text-right text-xs"><b>{number(row.delivered)}</b><p className="text-gray-500">Delivered</p></div>
            <ChevronDown size={16} className={`shrink-0 transition-transform ${expandedRow === row.key ? "rotate-180" : ""}`} />
          </button>
          {expandedRow === row.key && <div className="grid grid-cols-2 gap-2 p-3">
            {[["Orders",number(row.orders)],["Picked",number(row.picked)],["Attempted",number(row.attempted)],["FASR",percent(row.fasr)],["NDR Rate",percent(row.ndr)],["RTO Rate",percent(row.rto)],["Delivery",percent(row.delivery)],["Avg Delivery TAT",hours(row.tat)]].map(([label,value]) =>
              <div key={label} className="flex items-center justify-between gap-2 rounded-md border border-gray-100 p-2 text-xs dark:border-neutral-800"><span className="text-gray-500">{label}</span><b className="text-right">{value}</b></div>)}
          </div>}
        </div>)}
        {!rows.length && <p className="py-8 text-center text-xs text-gray-500">No records found</p>}
      </div>
    </section>
  );
}
