import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

export default function PerformanceTrendChart({
  title = "Delivery performance trend",
  subtitle = "Daily delivery conversion for created-order cohorts",
  xAxisData = ["01 Oct", "07 Oct", "13 Oct", "19 Oct", "25 Oct", "29 Oct"],
  seriesData = [45, 55, 50, 68, 62, 75, 70, 85, 78, 90, 88, 95],
  lineColor = "#1558df",
  badgeText = "IST cohorts",
  height = 265,
}) {

 
  const gradientId = `gradient-${title.replace(/\s+/g, "-").toLowerCase()}`; 
  const chartXAxisData = Array.from(
    { length: seriesData.length },
    (_, index) => {
      if (xAxisData.length <= 1) return xAxisData[0] || "";

      const labelIndex = Math.round(
        (index * (xAxisData.length - 1)) /
          (seriesData.length - 1)
      );

      const pointIndex = Math.round(
        (labelIndex * (seriesData.length - 1)) /
          (xAxisData.length - 1)
      );

      return pointIndex === index
        ? xAxisData[labelIndex]
        : "";
    }
  );

  return (
    <div className="w-full rounded-xl border border-[#dce3ed] bg-white p-4 transition-all duration-300 dark:border-gray-800 dark:bg-neutral-900">

      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">

        <div>
          <h3 className="text-[13px] font-semibold text-[#101828] dark:text-white">
            {title}
          </h3>

          <p className="mt-1 text-[10px] text-[#667085] dark:text-gray-400">
            {subtitle}
          </p>
        </div>

        {badgeText && (
          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#e4e7ec] bg-[#f9fafb] px-2.5 py-1 text-[9px] font-medium text-[#475467] dark:border-gray-700 dark:bg-neutral-800 dark:text-gray-300">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            {badgeText}
          </span>
        )}
      </div>

      {/* Chart */}
      <div className="w-full" style={{ height }}>

        <LineChart
          width={undefined}
          height={height}
          xAxis={[
            {
              scaleType: "point",
              data: chartXAxisData,

              tickLabelStyle: {
                fontSize: 9,
                fill: "#98A2B3",
              },

              tickSize: 0,
              disableLine: true,
            },
          ]}

          yAxis={[
            {
              min: 0,
              max: 110,
              width: 0,
              tickLabelStyle: {
                display: "none",
              },
              disableLine: true,
              disableTicks: true,
            },
          ]}

          series={[
            {
              data: seriesData,
              color: lineColor,
              area: true,
              curve: "linear",
              showMark: true,
              showArea: true,
            },
          ]}

          grid={{
            horizontal: true,
            vertical: false,
          }}

          margin={{
            top: 8,
            bottom: 26,
            left: 5,
            right: 5,
          }}

          sx={{
            "& .MuiAreaElement-root": {
              fill: `url(#${gradientId})`,
              opacity: 1,
            },

            "& .MuiLineElement-root": {
              strokeWidth: 2.5,
            },

            "& .MuiMarkElement-root": {
              fill: "#ffffff",
              stroke: lineColor,
              strokeWidth: 2,
              r: 4,
            },

            "& .MuiChartsGrid-line": {
              stroke: "#edf0f5",
              strokeWidth: 1,
              strokeDasharray: "0",
            },

            "& .MuiChartsAxis-line": {
              display: "none",
            },

            "& .MuiChartsAxis-tick": {
              display: "none",
            },

            "& .MuiChartsAxis-tickLabel": {
              fontSize: "9px",
            },

            "& .MuiChartsLegend-root": {
              display: "none",
            },
          }}
        >
          <defs>
            <linearGradient
              id={gradientId}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={lineColor}
                stopOpacity={0.13}
              />

              <stop
                offset="100%"
                stopColor={lineColor}
                stopOpacity={0.02}
              />
            </linearGradient>
          </defs>
        </LineChart>
      </div>
    </div>
  );
}