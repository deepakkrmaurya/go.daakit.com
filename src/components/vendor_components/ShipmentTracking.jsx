import { useEffect, useMemo, useState } from "react";
import {
  Users,
  PackageCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Search,
  ChevronDown,
  Download,
  Loader2,
} from "lucide-react";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;
import { jwtDecode } from "jwt-decode";
// Flip to true only if you want to preview the UI without hitting the API.
const USE_DUMMY_DATA = false;

const DUMMY_RIDERS_RAW = [
  {
    id: 40,
    name: "jay maurya",
    total: 84,
    assigned: "16",
    ofd: "14",
    delivered: "48",
    ndr: "6",
    cancel: "2",
  },
  {
    id: 39,
    name: "yash",
    total: 72,
    assigned: "10",
    ofd: "18",
    delivered: "40",
    ndr: "4",
    cancel: "0",
  },
  {
    id: 35,
    name: "rider 1",
    total: 68,
    assigned: "13",
    ofd: "9",
    delivered: "41",
    ndr: "5",
    cancel: "1",
  },
  {
    id: 32,
    name: "deepak",
    total: 63,
    assigned: "8",
    ofd: "15",
    delivered: "37",
    ndr: "3",
    cancel: "0",
  },
];

// ─────────────────────────────────────────────────────────
// Small presentational helpers
// ─────────────────────────────────────────────────────────

function StatCard({ icon: Icon, iconClass, label, value, sublabel }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex-1 min-w-[170px]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold tracking-wide text-gray-400">
          {label}
        </span>
        <Icon className={`h-4 w-4 ${iconClass}`} />
      </div>
      <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
      <p className="text-xs text-gray-400 mt-1.5">{sublabel}</p>
    </div>
  );
}

function StatusBadge({ label, dotClass }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-gray-500">
      <span className={`h-2 w-2 rounded-full ${dotClass}`} />
      {label}
    </span>
  );
}

// `onDownload` is called with no args — the parent already knows which
// rider/column this cell belongs to via closure. `downloading` disables
// the button and swaps the icon for a spinner while the request is in flight.
function ColumnCell({ value, tone, onDownload, downloading }) {
  const toneClass =
    {
      neutral: "text-gray-800",
      blue: "text-[#0446DB]",
      amber: "text-amber-500",
      green: "text-green-600",
      red: "text-red-500",
      gray: "text-gray-400",
    }[tone] || "text-gray-800";

  return (
    <button
      type="button"
      onClick={onDownload}
      disabled={!onDownload || downloading || !value}
      className="flex items-center gap-1 hover:opacity-70 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      title="Download list"
    >
      <span className={`text-sm font-semibold ${toneClass}`}>{value}</span>
      {downloading ? (
        <RefreshCw className="h-3 w-3 text-gray-300 animate-spin" />
      ) : (
        <Download className="h-3 w-3 text-gray-300" />
      )}
    </button>
  );
}

function Avatar({ name, color }) {
  const initials = (name || "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className="h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

const AVATAR_COLORS = [
  "#7C3AED",
  "#059669",
  "#16A34A",
  "#DB2777",
  "#EA580C",
  "#2563EB",
  "#0D9488",
  "#9333EA",
];

// Column key -> `report_type` query param expected by the download endpoint.
const REPORT_TYPES = {
  total: "total",
  assigned: "assigned",
  ofd: "ofd",
  delivered: "delivered",
  ndr: "ndr",
  cancelled: "cancel",
};

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

// Normalizes one raw API row (strings, `cancel` key) into the shape the UI uses.
function normalizeRider(raw) {
  return {
    riderId: `RDR-${raw.id}`,
    id: raw.id,
    name: raw.name,
    total: Number(raw.total) || 0,
    assigned: Number(raw.assigned) || 0,
    ofd: Number(raw.ofd) || 0,
    delivered: Number(raw.delivered) || 0,
    ndr: Number(raw.ndr) || 0,
    cancelled: Number(raw.cancel) || 0,
  };
}

// The API only returns per-rider rows, so the summary cards are derived
// by summing across all riders (not just the filtered/visible ones).
function computeSummary(riders) {
  return riders.reduce(
    (acc, r) => ({
      assignedToday: acc.assignedToday + r.assigned,
      outForDelivery: acc.outForDelivery + r.ofd,
      delivered: acc.delivered + r.delivered,
      ndr: acc.ndr + r.ndr,
      cancelled: acc.cancelled + r.cancelled,
      activeRiders: acc.activeRiders + (r.total > 0 ? 1 : 0),
    }),
    {
      assignedToday: 0,
      outForDelivery: 0,
      delivered: 0,
      ndr: 0,
      cancelled: 0,
      activeRiders: 0,
    },
  );
}

function todayISO() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// Pulls a filename out of a Content-Disposition header, e.g.
// `attachment; filename="ofd_report.csv"` -> `ofd_report.csv`.
function filenameFromContentDisposition(headerValue, fallback) {
  if (!headerValue) return fallback;
  const match = headerValue.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  return match ? decodeURIComponent(match[1]) : fallback;
}

// ─────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────

export default function ShipmentTracking() {
  const [riders, setRiders] = useState([]);
  const [summary, setSummary] = useState({
    assignedToday: 0,
    outForDelivery: 0,
    delivered: 0,
    ndr: 0,
    cancelled: 0,
    activeRiders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignedDate, setAssignedDate] = useState(todayISO());
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Tracks which single cell is currently downloading, e.g. "40-ofd".
  // Keeps the spinner scoped to the exact button that was tapped.
  const [downloadingKey, setDownloadingKey] = useState(null);
  const [downloadError, setDownloadError] = useState(null);

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const fetchShipmentTracking = async () => {
    if (USE_DUMMY_DATA) {
      setLoading(true);
      setTimeout(() => {
        const normalized = DUMMY_RIDERS_RAW.map(normalizeRider);
        setRiders(normalized);
        setSummary(computeSummary(normalized));
        setLastUpdated(new Date());
        setLoading(false);
      }, 400);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${baseURL}/api/vendor/getVendorRiderPerformance`,
        {
          params: {
            assigned_date: assignedDate,
            page: 1,
            limit: 100, // pull enough rows to cover the day; bump if you paginate
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const rows = res?.data?.data || [];
      const normalized = rows.map(normalizeRider);
      setRiders(normalized);
      setSummary(computeSummary(normalized));
      setLastUpdated(new Date());
    } catch (err) {
      console.error("shipment tracking----", err);
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Couldn't load shipment tracking. Try refreshing.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Hits /downloadVendorRiderReport for one rider + one column, then saves
  // the response as a file. Uses axios (not a plain <a href>) so the auth
  // header travels with the request — the endpoint is presumably token-gated
  // the same way the listing endpoint is.
  const handleDownload = async (riderId, columnKey) => {
    const reportType = REPORT_TYPES[columnKey];
    const key = `${riderId}-${columnKey}`;
    setDownloadingKey(key);
    setDownloadError(null);
    try {
      const res = await axios.get(
        `${baseURL}/api/vendor/downloadVendorRiderReport`,
        {
          params: {
            assigned_date: assignedDate,
            rider_id: riderId,
            report_type: reportType,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob",
        },
      );

      const fallbackName = `rider-${riderId}-${reportType}-${assignedDate}.csv`;
      const filename = filenameFromContentDisposition(
        res.headers?.["content-disposition"],
        fallbackName,
      );

      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("download report----", err);
      setDownloadError(
        err?.response?.data?.message ||
          err.message ||
          "Couldn't download that report. Try again.",
      );
    } finally {
      setDownloadingKey(null);
    }
  };

  useEffect(() => {
    fetchShipmentTracking();
    const interval = setInterval(fetchShipmentTracking, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignedDate]);

  const totalAssignments = riders.reduce((sum, r) => sum + (r.total || 0), 0);
  const deliveryRate =
    totalAssignments > 0
      ? ((summary.delivered / totalAssignments) * 100).toFixed(1)
      : "0.0";
  const ofdShare =
    totalAssignments > 0
      ? ((summary.outForDelivery / totalAssignments) * 100).toFixed(1)
      : "0.0";
  const ndrShare =
    totalAssignments > 0
      ? ((summary.ndr / totalAssignments) * 100).toFixed(1)
      : "0.0";
  const cancelShare =
    totalAssignments > 0
      ? ((summary.cancelled / totalAssignments) * 100).toFixed(1)
      : "0.0";

  const filteredRiders = useMemo(() => {
    return riders.filter((r) => {
      const matchesSearch =
        !searchTerm ||
        r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.riderId?.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "assigned" && r.assigned > 0) ||
        (statusFilter === "ofd" && r.ofd > 0) ||
        (statusFilter === "delivered" && r.delivered > 0) ||
        (statusFilter === "ndr" && r.ndr > 0) ||
        (statusFilter === "cancelled" && r.cancelled > 0);

      return matchesSearch && matchesStatus;
    });
  }, [riders, searchTerm, statusFilter]);

  const timeAgoLabel = useMemo(() => {
    const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
    if (seconds < 45) return "just now";
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  }, [lastUpdated]);
 

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
            <p className="mt-2">Loading Rider Performance...</p>
          </div>
        </div>
      ):(

    <div className="min-h-full bg-gray-50">
      {/* Header banner */}
      <div className=" px-6 py-3">
        <h1 className="text-2xl font-bold dark:text-white">Rider Performance</h1>
        <p className="dark:text-blue-100 text-sm mt-1">
          Live rider-wise delivery status — updated every 5 minutes.
        </p>
      </div>

      <div className="">
        {/* Filters + table card */}
        <div className="bg-white rounded-sm border border-gray-100 ">
          {/* Filter row */}
          <div className="flex flex-wrap items-end justify-between gap-4 px-5 pt-5 pb-4 border-b border-gray-100">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Date</label>
                <input
                  type="date"
                  value={assignedDate}
                  onChange={(e) => setAssignedDate(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0446DB]/20 focus:border-[#0446DB]"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Search rider
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rider ID or name"
                    className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-[#0446DB]/20 focus:border-[#0446DB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Shipment status
                </label>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg w-44 focus:outline-none focus:ring-2 focus:ring-[#0446DB]/20 focus:border-[#0446DB] bg-white"
                  >
                    <option value="all">All status</option>
                    <option value="assigned">Assigned</option>
                    <option value="ofd">Out for delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="ndr">NDR</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <button
                onClick={fetchShipmentTracking}
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                title="Refresh"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            
          </div>

          {error && (
            <div className="px-5 py-3 text-sm text-red-600 bg-red-50 border-b border-red-100">
              {error}
            </div>
          )}

          {downloadError && (
            <div className="px-5 py-3 text-sm text-red-600 bg-red-50 border-b border-red-100">
              {downloadError}
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400">
                  <th className="px-5 py-3 font-medium">Rider ID</th>
                  <th className="px-5 py-3 font-medium">Rider Name</th>
                  <th className="px-5 py-3 font-medium text-[#0446DB]">
                    Total
                  </th>
                  <th className="px-5 py-3 font-medium text-[#0446DB]">
                    Assigned
                  </th>
                  <th className="px-5 py-3 font-medium text-amber-500">OFD</th>
                  <th className="px-5 py-3 font-medium text-green-600">
                    Delivered
                  </th>
                  <th className="px-5 py-3 font-medium text-red-500">NDR</th>
                  <th className="px-5 py-3 font-medium text-gray-400">
                    Cancel
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td colSpan={8} className="px-5 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
                      </td>
                    </tr>
                  ))
                ) : filteredRiders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-10 text-center text-sm text-gray-400"
                    >
                      No riders match this search or filter.
                    </td>
                  </tr>
                ) : (
                  filteredRiders.map((rider, idx) => {
                   
                    return (
                      <tr
                        key={rider.riderId}
                        className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <span className="text-[#0446DB] font-medium">
                            {`FP_${decoded?.id}_${rider.id}`}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={rider.name}
                              color={AVATAR_COLORS[idx % AVATAR_COLORS.length]}
                            />
                            <p className="font-medium text-gray-800">
                              {rider.name}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <ColumnCell
                            value={rider.total}
                            tone="blue"
                            downloading={downloadingKey === `${rider.id}-total`}
                            onDownload={() => handleDownload(rider.id, "total")}
                          />
                        </td>
                        <td className="px-5 py-3">
                          <ColumnCell
                            value={rider.assigned}
                            tone="blue"
                            downloading={
                              downloadingKey === `${rider.id}-assigned`
                            }
                            onDownload={() =>
                              handleDownload(rider.id, "assigned")
                            }
                          />
                        </td>
                        <td className="px-5 py-3">
                          <ColumnCell
                            value={rider.ofd}
                            tone="amber"
                            downloading={downloadingKey === `${rider.id}-ofd`}
                            onDownload={() => handleDownload(rider.id, "ofd")}
                          />
                        </td>
                        <td className="px-5 py-3">
                          <ColumnCell
                            value={rider.delivered}
                            tone="green"
                            downloading={
                              downloadingKey === `${rider.id}-delivered`
                            }
                            onDownload={() =>
                              handleDownload(rider.id, "delivered")
                            }
                          />
                        </td>
                        <td className="px-5 py-3">
                          <ColumnCell
                            value={rider.ndr}
                            tone="red"
                            downloading={downloadingKey === `${rider.id}-ndr`}
                            onDownload={() => handleDownload(rider.id, "ndr")}
                          />
                        </td>
                        <td className="px-5 py-3">
                          <ColumnCell
                            value={rider.cancelled}
                            tone="gray"
                            downloading={
                              downloadingKey === `${rider.id}-cancelled`
                            }
                            onDownload={() =>
                              handleDownload(rider.id, "cancelled")
                            }
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer legend */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Showing {filteredRiders.length} of {riders.length} riders
            </span>
            <div className="flex items-center gap-4">
              <StatusBadge label="OFD" dotClass="bg-amber-400" />
              <StatusBadge label="Delivered" dotClass="bg-green-500" />
              <StatusBadge label="NDR" dotClass="bg-red-400" />
              <StatusBadge label="Cancelled" dotClass="bg-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
      )
    }
    </>
  );
}


