
import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";

export default function CityOrdersChart({
  cityWiseOrders = [],
}) {
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";

  // ==========================================
  // CITY LABELS
  // ==========================================

  const labels = cityWiseOrders.map((item) => {
  const city = String(item?.pickup_city || "Unknown")
    .trim()
    .toLowerCase();

  return city.replace(/\b\p{L}/gu, (char) =>
    char.toUpperCase()
  );
});

  // ==========================================
  // CHART SERIES
  // ==========================================

  const series = [
    {
      label: "Orders",

      data: cityWiseOrders.map((item) =>
        Number(item?.total_orders || 0),
      ),

      color: "#0446DB",
    },
  ];

  // ==========================================
  // DYNAMIC THEME COLORS
  // ==========================================

  const textColor = isDark ? "#E5E7EB" : "#374151";

  const secondaryTextColor = isDark
    ? "#D1D5DB"
    : "#6B7280";

  const gridColor = isDark ? "#374151" : "#E5E7EB";

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="bg-white transition-colors duration-300 dark:bg-neutral-900 dark:text-white">
      {/* HEADER */}

      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          City Wise Orders
        </h2>

        <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
          Total orders by pickup city
        </p>
      </div>

      {/* CHART */}

      <div className="w-full overflow-x-auto">
        <BarChart
          height={350}

          // ==================================
          // X AXIS
          // ==================================

          xAxis={[
            {
              scaleType: "band",

              data: labels,

              tickLabelStyle: {
                fontSize: 12,
                fill: textColor,
              },
            },
          ]}

          // ==================================
          // Y AXIS
          // ==================================

          yAxis={[
            {
              tickLabelStyle: {
                fontSize: 12,
                fill: textColor,
              },
            },
          ]}

          // ==================================
          // SERIES
          // ==================================

          series={series}

          // ==================================
          // BAR VALUE
          // ==================================

          barLabel={({ value }) =>
            value <= 0 ? null : value
          }

          // ==================================
          // GRID
          // ==================================

          grid={{
            horizontal: true,
          }}

          // ==================================
          // STYLES
          // ==================================

          sx={{
            // X / Y axis labels

            "& .MuiChartsAxis-tickLabel": {
              fill: `${textColor} !important`,
            },

            // Axis lines

            "& .MuiChartsAxis-line": {
              stroke: `${secondaryTextColor} !important`,
            },

            // Axis tick lines

            "& .MuiChartsAxis-tick": {
              stroke: `${secondaryTextColor} !important`,
            },

            // Grid lines

            "& .MuiChartsGrid-line": {
              stroke: `${gridColor} !important`,
              strokeOpacity: isDark ? 0.5 : 1,
            },

            // Legend text

            "& .MuiChartsLegend-label": {
              color: `${textColor} !important`,
              fill: `${textColor} !important`,
            },

            // ==================================
            // BAR NUMBER - ALWAYS WHITE
            // ==================================

            "& .MuiBarLabel-root": {
              fill: "#ffffff !important",
              fontWeight: 700,
              fontSize: "12px",
            },
          }}
        />
      </div>
    </div>
  );
}