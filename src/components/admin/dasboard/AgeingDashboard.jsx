
import { useState, useEffect, Fragment } from "react";
import AxiosInstance from "@/Helper/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Clock3, Loader2 } from "lucide-react";

export default function UserAgeingDashboard() {

    const navigate = useNavigate();
const location = useLocation();

const isUserRoute = location.pathname.startsWith("/user/");

const overviewPath = isUserRoute
  ? "/user/analytics"
  : "/admin/analytics";

  // 1. State variables
const [selectedCity, setSelectedCity] = useState("");
const [cityTabs, setCityTabs] = useState([]);
  const [showVendor, setShowVendor] = useState(true);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  // 2. Region options
  const regions = [
    { key: "delhi-ncr", label: "Delhi NCR" },
    { key: "lucknow", label: "Lucknow" },
    { key: "bangalore", label: "Bangalore" },
  ];

  // 3. Fetch data when cluster changes
 
useEffect(() => {
  let cancelled = false;

  const fetchAgeingReport = async () => {
    try {
      setLoading(true);
      setError("");
      setReport(null);

      const response = await AxiosInstance.get(
        "/api/analytics/ageing",
        {
          params: {
            cluster: "all",
            ...(selectedCity
              ? { delivery_city: selectedCity }
              : {}),
            show_vendor: showVendor,
          },
        }
      );

      if (cancelled) return;

      if (response.data.success) {
        const data = response.data.data;

        const availableCities = data.delivery_city_tabs || [];
        setCityTabs(availableCities);

        if (!selectedCity && availableCities.length > 0) {
          setSelectedCity(availableCities[0].label);
          return;
        }

        setReport(data);
      } else {
        setError("Failed to fetch ageing report");
      }
    } catch (err) {
      if (cancelled) return;

      setError(
        err.response?.data?.message ||
        "Unable to fetch ageing report"
      );
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  fetchAgeingReport();

  return () => {
    cancelled = true;
  };
}, [selectedCity, showVendor]);

const ageingTable = report?.table;
const isVendorGrouped =
  ageingTable?.group_columns?.includes("vendor") ?? false;
const ageColumns = ageingTable?.age_columns.filter(
  (column) => column.key !== "unknown"
) || [];

const tableRows = [];

if (ageingTable) {
  if (isVendorGrouped) {
    // Vendor -> Brand -> Status
    ageingTable.groups.forEach((group) => {

      (group.brands || []).forEach((brand, brandIndex) => {

        (brand.statuses || []).forEach((row, statusIndex) => {
          tableRows.push({
            type: "status",
            key: `${group.vendor.key}-${brand.brand_name}-${row.status}`,
            vendor:
              brandIndex === 0 && statusIndex === 0
                ? group.vendor.name
                : "",
            brand:
              statusIndex === 0
                ? brand.brand_name
                : "",
            row,
          });
        });

      });

      tableRows.push({
        type: "subtotal",
        key: `subtotal-${group.vendor.key}`,
        label: `${group.vendor.name} Total`,
        counts: group.subtotal.counts,
        total: group.subtotal.total,
      });
    });

  } else {
    // Brand -> Status
    ageingTable.groups.forEach((group) => {

      (group.rows || []).forEach((row, statusIndex) => {
        tableRows.push({
          type: "status",
          key: `${group.brand_name}-${row.status}`,
          vendor: "",
          brand:
            statusIndex === 0
              ? group.brand_name
              : "",
          row,
        });
      });

      tableRows.push({
        type: "subtotal",
        key: `subtotal-${group.brand_name}`,
        label: `${group.brand_name} Total`,
        counts: group.subtotal.counts,
        total: group.subtotal.total,
      });
    });
  }

  tableRows.push({
    type: "grand_total",
    key: "grand-total",
    label: "Grand total",
    counts: ageingTable.grand_total.counts,
    total: ageingTable.grand_total.total,
  });
}

const handleExportCsv = async () => {
  try {
    setExporting(true);

   const response = await AxiosInstance.get(
  "/api/analytics/ageing/export",
  {
    params: {
      cluster: "all",
      delivery_city: selectedCity,
      show_vendor: showVendor,
    },
    responseType: "blob",
    timeout: 60000,
  }
);

    const blob = new Blob(
      [response.data],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
   link.download =
  `ageing_report_${selectedCity.replace(/\s+/g, "_")}.csv`;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error("CSV export failed:", err);
    alert("Unable to export ageing report");
  } finally {
    setExporting(false);
  }
};

  // 4. JSX - User Interface
  return (

    <>
     {
      loading ? (
        <div className=" w-full h-[90vh] flex justify-center items-center">
            <div>
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2">Loading Ageing Dashboard...</p>
            </div>
          </div>
      ):(

   <div className="min-w-0 w-full p-3 md:p-6">

     
<div className="flex items-start justify-between gap-4">

 <div>
 <div className="flex items-start justify-between gap-4">
  <div>
    <h1 className="text-2xl font-bold text-gray-900">
      Dashboard
    </h1>

    <p className="mt-2 text-sm text-gray-500">
      Real-time insights and performance metrics
    </p>
  </div>
</div>

{/* Overview / Ageing Report Tabs */}
<div className="mt-5 flex flex-wrap items-center gap-1 rounded-xl border border-gray-200 bg-white p-1.5">

  <button
    type="button"
    onClick={() => navigate(overviewPath)}
    className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100"
  >
    <LayoutDashboard size={17} />
    Overview
  </button>

  <button
    type="button"
    className="flex items-center gap-2 rounded-lg bg-[#0446db] px-4 py-3 text-sm font-semibold text-white"
  >
    <Clock3 size={17} />
    Ageing Report
  </button>

</div>

  <p className="mt-2 text-sm text-gray-500">
    Monitor open orders and delivery ageing.
  </p>
</div>



</div>


      {/* Region tabs */}
      
{/* Region tabs and Export CSV */}
<div className="mt-6 flex flex-wrap items-center justify-between gap-4">

  {/* City tabs */}
  <div className="flex w-full min-w-0 gap-2 overflow-x-auto pb-1 md:w-auto">
    {cityTabs.map((city) => (
      <button
        key={city.key}
        type="button"
        onClick={() => setSelectedCity(city.label)}
        className={`shrink-0 whitespace-nowrap rounded-lg border px-4 py-2.5 text-sm font-semibold ${
          selectedCity === city.label
            ? "border-[#0446db] bg-[#0446db] text-white"
            : "border-gray-300 bg-white text-gray-700"
        }`}
      >
        {city.label} · {city.open_orders}
      </button>
    ))}
  </div>

  {/* Export CSV */}
  <button
    type="button"
    onClick={handleExportCsv}
    disabled={exporting || loading || !report}
    className="inline-flex items-center gap-2 rounded-lg bg-[#0446db] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0338b0] disabled:cursor-not-allowed disabled:opacity-50"
  >
    <span>↓</span>
    {exporting ? "Exporting..." : "Export CSV"}
  </button>

</div>


      {/* Loading message */}
      {loading && (
        <p className="mt-4 text-blue-600">
          Loading ageing report...
        </p>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-4 text-red-600">
          {error}
        </p>
      )}

      {/* API response */}
     
{report && (
  <div className="mt-6">

    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6 xl:gap-3">

      {report.cards.map((card) => (
        <div
  key={card.key}
 className={`rounded-xl border bg-white p-3 shadow-sm md:p-4 ${
  card.key === "all"
    ? ""
    : "border-gray-200"
}`}
>
            
  <div className="flex items-center gap-2">
  <span
    className="h-2 w-2 shrink-0 rounded-full"
    style={{
      backgroundColor:
        card.key === "all" ? "#111827" :
        card.key === "picked" ? "#0446db" :
        card.key === "out for delivery" ? "#15803d" :
        card.key === "ndr" ? "#c2410c" :
        card.key === "rto in transit" ? "#dc2626" :
        "#64748b"
    }}
  />

  <h3 className="text-xs font-semibold text-gray-700">
    {card.label}
  </h3>
</div>
         <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900">
            {card.total}
          </h2>

          <p className="text-xs text-gray-500 mt-2">
            {card.aged_3_plus} aged 3+ days
          </p>
        </div>
      ))}

    </div>

  </div>
)}


{ageingTable && (
  <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">

    {/* Table heading */}
    
<div className="flex flex-col gap-3 border-b border-gray-200 px-3 py-3 md:flex-row md:items-center md:justify-between md:px-4">

 <h2 className="text-xs font-bold text-gray-900">
  {selectedCity.toUpperCase()}
  {" - OPEN ORDERS PENDENCY SUMMARY"}
</h2>

<div className="flex w-full flex-wrap items-center justify-between gap-3 md:w-auto md:justify-end md:gap-5">

    <div className="flex items-center gap-2">
      <span className="h-3 w-3 rounded-sm bg-[#ffa5aa]" />
      <span className="text-[11px] text-gray-500">
        Over 7 days
      </span>
    </div>

    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={showVendor}
        onChange={(e) => {
  setReport(null);
  setShowVendor(e.target.checked);
}}
        className="sr-only"
      />

      <span
        className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${
          showVendor ? "bg-[#0446db]" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-[3px] h-[14px] w-[14px] rounded-full bg-white transition-transform ${
            showVendor ? "translate-x-[19px]" : "translate-x-[3px]"
          }`}
        />
      </span>

      <span className="whitespace-nowrap text-[11px] text-gray-600">
  Show vendor column
</span>
    </label>

  </div>
</div>


    {/* Horizontal scrolling */}
  
{/* Scrollable ageing matrix */}
<div className="w-full min-w-0">
  <div
    className="w-full overflow-x-auto md:max-h-[600px] md:overflow-auto"
    style={{
      WebkitOverflowScrolling: "touch",
    }}
  >
  <table
  className="table-fixed border-separate border-spacing-0 text-[11px] text-gray-900"
  style={{
    width: "100%",
    minWidth: `${
      (isVendorGrouped ? 160 : 0) +
      220 +
      140 +
      ageColumns.length * 38 +
      90
    }px`,
  }}
>
    {/* Column widths */}
    <colgroup>
      {isVendorGrouped && <col style={{ width: "160px" }} />}

      <col style={{ width: "220px" }} />
      <col style={{ width: "140px" }} />

      {ageColumns.map((column) => (
        <col
          key={column.key}
          style={{ width: "38px" }}
        />
      ))}

      <col style={{ width: "90px" }} />
    </colgroup>

    {/* Table headers */}
    <thead className="sticky top-0 z-30 bg-[#eef4fc] text-[11px] font-bold">

      <tr className="h-[28px]">
        {isVendorGrouped && (
          <th
            rowSpan={2}
          className="md:sticky md:left-0 z-40 border-r border-b border-[#d9e2ec] bg-[#eef4fc] px-3 py-3 text-left text-[13px] font-extrabold"
          >
            Vendor
          </th>
        )}

        <th
          rowSpan={2}
        className={`md:sticky z-40 border-r border-b border-[#d9e2ec] bg-[#eef4fc] px-3 py-3 text-left text-[13px] font-extrabold ${
  isVendorGrouped ? "md:left-[160px]" : "md:left-0"
}`}
        >
          Brand name
        </th>

        <th
          rowSpan={2}
          className="border-r border-b border-[#d9e2ec] px-3 py-3 text-left text-[13px] font-extrabold text-[#1f2a37]"
        >
          Status
        </th>

        <th
          colSpan={ageColumns.length}
         className="border-r border-b border-[#b9cdea] px-2 py-3 text-center text-[15px] font-extrabold tracking-wide"
        >
          AGEING (DAYS)
        </th>

       <th
  rowSpan={2}
  className="md:sticky md:right-0 z-40 border-r border-b border-[#d9e2ec] bg-[#eef4fc] px-2 py-3 text-right text-[13px] font-extrabold text-[#1f2a37]"
>
  Grand total
</th>
      </tr>

      <tr className="h-[26px]">
        {ageColumns.map((column) => (
          <th
            key={column.key}
            className={`border-r border-b border-[#d9e2ec] px-2 py-3 text-center text-[13px] font-extrabold ${
              column.highlight
                ? "bg-[#ffe3e4] text-red-700"
                : "bg-[#eef4fc]"
            }`}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>

    {/* Table body */}
    <tbody>
      {tableRows.map((item) => {

        {/* Normal status row */}
        if (item.type === "status") {
          const row = item.row;

          return (
            <tr key={item.key} className="h-[32px]">

              {isVendorGrouped && (
                <td className="md:sticky md:left-0 z-10 border-r border-b border-[#d9e2ec] bg-white px-2 font-bold">
                  {item.vendor}
                </td>
              )}

              <td
             className={`md:sticky z-10 border-r border-b border-[#d9e2ec] bg-white px-2 font-bold ${
  isVendorGrouped ? "md:left-[160px]" : "md:left-0"
}`}
              >
                {item.brand}
              </td>

              <td className="border-r border-b border-[#d9e2ec] bg-white px-2">
                <span
                  className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    row.status === "ndr"
                      ? "bg-yellow-100 text-yellow-800"
                      : row.status === "out for delivery"
                      ? "bg-green-100 text-green-800"
                      : row.status === "rto in transit"
                      ? "bg-red-100 text-red-800"
                      : row.status === "picked"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {row.label}
                </span>
              </td>

              {ageColumns.map((column) => {
                const count = row.counts[column.key] || 0;

                let cellColor = "bg-white";

                if (column.highlight) {
                  cellColor = count > 0
                    ? "bg-[#ffb6bb]"
                    : "bg-[#fff1f1]";
                } else if (count >= 20) {
                  cellColor = "bg-[#8daaea]";
                } else if (count >= 10) {
                  cellColor = "bg-[#b4c8f2]";
                } else if (count >= 5) {
                  cellColor = "bg-[#d2def6]";
                } else if (count > 0) {
                  cellColor = "bg-[#e7edfa]";
                }

                return (
                  <td
  key={column.key}
className={`border-r border-b border-[#d9e2ec] px-1 text-center font-bold tabular-nums ${cellColor}`}
>
  {count || ""}
</td>
                );
              })}

  <td className="md:sticky md:right-0 z-10 border-b border-r border-[#d9e2ec] bg-white px-2 text-right font-extrabold tabular-nums text-gray-900">
  {row.total}
</td>
            </tr>
          );
        }

        {/* Vendor / Brand subtotal */}
        if (item.type === "subtotal") {
          return (
            <tr
              key={item.key}
              className="h-[30px] bg-[#eef4fc] font-bold"
            >
             <td
  colSpan={isVendorGrouped ? 3 : 2}
  className="md:sticky md:left-0 z-10 border-r border-b border-[#c9d9ee] bg-[#eef4fc] px-2 font-extrabold"
>
  {item.label}
</td>

              {ageColumns.map((column) => (
                <td
                  key={column.key}
                 className={`border-r border-b border-[#d9e2ec] px-1 text-center font-bold tabular-nums ${
  column.highlight
    ? "bg-[#ffe3e4]"
    : "bg-[#eef4fc]"
}`}
                >
                  {item.counts[column.key] || ""}
                </td>
              ))}

           <td className="md:sticky md:right-0 z-10 border-b border-r border-[#d9e2ec] bg-[#eef4fc] px-2 text-right font-extrabold tabular-nums">
  {item.total}
</td>
            </tr>
          );
        }

        {/* Grand total */}
        if (item.type === "grand_total") {
          return (
            <tr
              key={item.key}
              className="md:sticky md:bottom-0 z-20 h-[34px] bg-[#0446db] text-white"
            >
              <td
                colSpan={isVendorGrouped ? 3 : 2}
                className="md:sticky md:left-0 z-20 bg-[#0446db] px-2 font-bold"
              >
                Grand total
              </td>

              {ageColumns.map((column) => (
                <td
                  key={column.key}
                  className={`px-1 text-center font-bold tabular-nums ${
                    column.highlight
                      ? "bg-[#b91c1c]"
                      : "bg-[#0446db]"
                  }`}
                >
                  {item.counts[column.key] || ""}
                </td>
              ))}

              <td className="md:sticky md:right-0 z-30 bg-[#0446db] px-2 text-right font-extrabold text-white tabular-nums">
  {item.total}
</td>
            </tr>
          );
        }

        return null;
      })}
    </tbody>
  </table>
</div>

  </div>
  </div>
)}


    </div>
      )
     }
    </>
  );
}
