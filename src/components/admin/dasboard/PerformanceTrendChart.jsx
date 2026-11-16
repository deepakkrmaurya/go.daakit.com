// import React from "react";
// import { LineChart } from "@mui/x-charts/LineChart";

// export default function PerformanceTrendChart({
//   title = "Delivery performance trend",
//   subtitle = "Daily delivery conversion for created-order cohorts",
//   xAxisData = [],
//   seriesData = [],
//   lineColor = "#1558df",
//   badgeText = "IST cohorts",
//   height = 265,
// }) {

//   console.log(
//      xAxisData ,
//      seriesData 
//   )
//   const gradientId = `gradient-${title.replace(/\s+/g, "-").toLowerCase()}`; 
//   const chartXAxisData = Array.from(
//     { length: seriesData.length },
//     (_, index) => {
//       if (xAxisData.length <= 1) return xAxisData[0] || "";

//       const labelIndex = Math.round(
//         (index * (xAxisData.length - 1)) /
//           (seriesData.length - 1)
//       );

//       const pointIndex = Math.round(
//         (labelIndex * (seriesData.length - 1)) /
//           (xAxisData.length - 1)
//       );

//       return pointIndex === index
//         ? xAxisData[labelIndex]
//         : "";
//     }
//   );

//   return (
//     <div className="w-full rounded-xl border border-[#dce3ed] bg-white p-4 transition-all duration-300 dark:border-gray-800 dark:bg-neutral-900">

//       {/* Header */}
//       <div className="mb-3 flex items-start justify-between gap-3">

//         <div>
//           <h3 className="text-[13px] font-semibold text-[#101828] dark:text-white">
//             {title}
//           </h3>

//           <p className="mt-1 text-[10px] text-[#667085] dark:text-gray-400">
//             {subtitle}
//           </p>
//         </div>

//         {badgeText && (
//           <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#e4e7ec] bg-[#f9fafb] px-2.5 py-1 text-[9px] font-medium text-[#475467] dark:border-gray-700 dark:bg-neutral-800 dark:text-gray-300">
//             <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
//             {badgeText}
//           </span>
//         )}
//       </div>

//       {/* Chart */}
//       <div className="w-full" style={{ height }}>

//         <LineChart
//           width={undefined}
//           height={height}
//           xAxis={[
//             {
//               scaleType: "point",
//               data: chartXAxisData,

//               tickLabelStyle: {
//                 fontSize: 9,
//                 fill: "#98A2B3",
//               },

//               tickSize: 0,
//               disableLine: true,
//             },
//           ]}

//           yAxis={[
//             {
//               min: 0,
//               max: 110,
//               width: 0,
//               tickLabelStyle: {
//                 display: "none",
//               },
//               disableLine: true,
//               disableTicks: true,
//             },
//           ]}

//           series={[
//             {
//               data: seriesData,
//               color: lineColor,
//               area: true,
//               curve: "linear",
//               showMark: true,
//               showArea: true,
//             },
//           ]}

//           grid={{
//             horizontal: true,
//             vertical: false,
//           }}

//           margin={{
//             top: 8,
//             bottom: 26,
//             left: 5,
//             right: 5,
//           }}

//           sx={{
//             "& .MuiAreaElement-root": {
//               fill: `url(#${gradientId})`,
//               opacity: 1,
//             },

//             "& .MuiLineElement-root": {
//               strokeWidth: 2.5,
//             },

//             "& .MuiMarkElement-root": {
//               fill: "#ffffff",
//               stroke: lineColor,
//               strokeWidth: 2,
//               r: 4,
//             },

//             "& .MuiChartsGrid-line": {
//               stroke: "#edf0f5",
//               strokeWidth: 1,
//               strokeDasharray: "0",
//             },

//             "& .MuiChartsAxis-line": {
//               display: "none",
//             },

//             "& .MuiChartsAxis-tick": {
//               display: "none",
//             },

//             "& .MuiChartsAxis-tickLabel": {
//               fontSize: "9px",
//             },

//             "& .MuiChartsLegend-root": {
//               display: "none",
//             },
//           }}
//         >
//           <defs>
//             <linearGradient
//               id={gradientId}
//               x1="0"
//               y1="0"
//               x2="0"
//               y2="1"
//             >
//               <stop
//                 offset="0%"
//                 stopColor={lineColor}
//                 stopOpacity={0.13}
//               />

//               <stop
//                 offset="100%"
//                 stopColor={lineColor}
//                 stopOpacity={0.02}
//               />
//             </linearGradient>
//           </defs>
//         </LineChart>
//       </div>
//     </div>
//   );
// }






import React, { useMemo } from "react";
import { LineChart } from "@mui/x-charts/LineChart";

export default function PerformanceTrendChart({
  title = "Delivery performance trend",
  subtitle = "Daily delivery conversion for created-order cohorts",
  xAxisData = [],
  seriesData = [],
  lineColor = "#0446DB",
  badgeText = "IST cohorts",
  height = 300,
}) {
  // Prepare chart data
  const { dates, values, maxValue, hasData } = useMemo(() => {
    const length = Math.min(
      xAxisData.length,
      seriesData.length
    );

    const dates = xAxisData.slice(0, length);

    const values = seriesData
      .slice(0, length)
      .map((value) => {
        if (
          value === null ||
          value === undefined ||
          value === ""
        ) {
          return null;
        }

        const num = Number(value);

        return Number.isFinite(num) ? num : null;
      });

    const validValues = values.filter(
      (value) => value !== null
    );

    const highest = validValues.length
      ? Math.max(...validValues)
      : 0;

    const maxValue =
      Math.ceil(Math.max(highest, 1) / 100) * 100;

    return {
      dates,
      values,
      maxValue,
      hasData: validValues.length > 0,
    };
  }, [xAxisData, seriesData]);

  // Format date for tooltip
  const formatDate = (date) => {
    if (!date) return "";

    const match = String(date).match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    );

    if (match) {
      return `${match[3]}/${match[2]}/${match[1]}`;
    }

    return String(date);
  };

  return (
    <div
      className="
        w-full min-w-0 overflow-hidden
        rounded-sm border border-gray-300
        bg-white p-4
        
        transition-all duration-300
        dark:border-neutral-800
        dark:bg-neutral-900
      "
    >
      {/* ================= HEADER ================= */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[#101828] dark:text-white">
            {title}
          </h3>

          <p className="mt-1 text-xs text-[#667085] dark:text-neutral-400">
            {subtitle}
          </p>
        </div>

        {badgeText && (
          <span
            className="
              inline-flex shrink-0 items-center gap-2
              rounded-full
              border border-[#e4e7ec]
              bg-[#f9fafb]
              px-3 py-1.5
              text-[10px] font-medium text-[#475467]
              dark:border-neutral-700
              dark:bg-neutral-800
              dark:text-neutral-300
            "
          >
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {badgeText}
          </span>
        )}
      </div>

      {/* ================= CHART ================= */}
      <div
        className="relative w-full min-w-0"
        style={{ height }}
      >
        {!hasData ? (
          <div
            className="
              flex h-full items-center justify-center
              rounded-lg bg-gray-50
              text-sm text-gray-400
              dark:bg-neutral-800/40
              dark:text-neutral-500
            "
          >
            No performance data available
          </div>
        ) : (
          <LineChart
            height={height}
            xAxis={[
              {
                id: "date-axis",
                scaleType: "point",
                data: dates,

                valueFormatter: formatDate,

                disableLine: true,
                disableTicks: true,

                tickLabelStyle: {
                  display: "none",
                },
              },
            ]}
            yAxis={[
              {
                id: "value-axis",
                min: 0,
                max: maxValue,

                width: 0,

                disableLine: true,
                disableTicks: true,

                tickLabelStyle: {
                  display: "none",
                },
              },
            ]}
            series={[
              {
                id: "delivery-performance",
                data: values,

                color: lineColor,
                curve: "linear",

                showMark: true,
                area: false,
                connectNulls: false,

                valueFormatter: (value) =>
                  value === null
                    ? "No data"
                    : Number(value).toLocaleString(),
              },
            ]}
            grid={{
              horizontal: true,
              vertical: false,
            }}
            margin={{
              top: 20,
              bottom: 12,
              left: 10,
              right: 12,
            }}
            hideLegend
            sx={{
              /* White background */
              backgroundColor: "transparent",

              /* Blue connecting line */
              "& .MuiLineElement-root": {
                stroke: lineColor,
                strokeWidth: 2.2,
                fill: "none",
              },

              /* Grey circular markers */
              "& .MuiMarkElement-root": {
                fill: "#0446DB",
                stroke: "#0446DB",
                strokeWidth: 2,
                r: 4.5,
              },

              /* Horizontal dotted grid lines */
              "& .MuiChartsGrid-line": {
                stroke: "#e5eaf1",
                strokeWidth: 1,
                strokeDasharray: "3 4",
              },

              /* Hide X and Y axis lines */
              "& .MuiChartsAxis-line": {
                display: "none",
              },

              /* Hide axis tick marks */
              "& .MuiChartsAxis-tick": {
                display: "none",
              },

              /* Hide axis text labels */
              "& .MuiChartsAxis-tickLabel": {
                display: "none",
              },

              /* Hide legend */
              "& .MuiChartsLegend-root": {
                display: "none",
              },

              /* Hover marker */
              "& .MuiMarkElement-root:hover": {
                fill: lineColor,
                stroke: "#ffffff",
                strokeWidth: 2,
              },

              /* Chart tooltip */
              "& .MuiChartsTooltip-root": {
                borderRadius: "8px",
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
