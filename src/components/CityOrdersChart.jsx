
// import React from "react";
// import { BarChart } from "@mui/x-charts/BarChart";
// import { useTheme } from "@mui/material/styles";

// export default function CityOrdersChart({
//   cityWiseOrders = [],
// }) {
//   const theme = useTheme();

//   const isDark = theme.palette.mode === "dark";

//   // ==========================================
//   // CITY LABELS
//   // ==========================================

//   const labels = cityWiseOrders.map((item) => {
//   const city = String(item?.pickup_city || "Unknown")
//     .trim()
//     .toLowerCase();

//   return city.replace(/\b\p{L}/gu, (char) =>
//     char.toUpperCase()
//   );
// });

//   // ==========================================
//   // CHART SERIES
//   // ==========================================

//   const series = [
//     {
//       label: "Orders",

//       data: cityWiseOrders.map((item) =>
//         Number(item?.total_orders || 0),
//       ),

//       color: "#0446DB",
//     },
//   ];

//   // ==========================================
//   // DYNAMIC THEME COLORS
//   // ==========================================

//   const textColor = isDark ? "#E5E7EB" : "#374151";

//   const secondaryTextColor = isDark
//     ? "#D1D5DB"
//     : "#6B7280";

//   const gridColor = isDark ? "#374151" : "#E5E7EB";

//   // ==========================================
//   // UI
//   // ==========================================

//   return (
//     <div className="bg-white transition-colors duration-300 dark:bg-neutral-900 dark:text-white">
//       {/* HEADER */}

//       <div className="mb-4">
//         <h2 className="text-base font-semibold text-gray-900 dark:text-white">
//           City Wise Orders
//         </h2>

//         <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
//           Total orders by pickup city
//         </p>
//       </div>

//       {/* CHART */}

//       <div className="w-full overflow-x-auto">
//         <BarChart
//           height={350}

//           // ==================================
//           // X AXIS
//           // ==================================

//           xAxis={[
//             {
//               scaleType: "band",

//               data: labels,

//               tickLabelStyle: {
//                 fontSize: 12,
//                 fill: textColor,
//               },
//             },
//           ]}

//           // ==================================
//           // Y AXIS
//           // ==================================

//           yAxis={[
//             {
//               tickLabelStyle: {
//                 fontSize: 12,
//                 fill: textColor,
//               },
//             },
//           ]}

//           // ==================================
//           // SERIES
//           // ==================================

//           series={series}

//           // ==================================
//           // BAR VALUE
//           // ==================================

//           barLabel={({ value }) =>
//             value <= 0 ? null : value
//           }

//           // ==================================
//           // GRID
//           // ==================================

//           grid={{
//             horizontal: true,
//           }}

//           // ==================================
//           // STYLES
//           // ==================================

//           sx={{
//             // X / Y axis labels

//             "& .MuiChartsAxis-tickLabel": {
//               fill: `${textColor} !important`,
//             },

//             // Axis lines

//             "& .MuiChartsAxis-line": {
//               stroke: `${secondaryTextColor} !important`,
//             },

//             // Axis tick lines

//             "& .MuiChartsAxis-tick": {
//               stroke: `${secondaryTextColor} !important`,
//             },

//             // Grid lines

//             "& .MuiChartsGrid-line": {
//               stroke: `${gridColor} !important`,
//               strokeOpacity: isDark ? 0.5 : 1,
//             },

//             // Legend text

//             "& .MuiChartsLegend-label": {
//               color: `${textColor} !important`,
//               fill: `${textColor} !important`,
//             },

//             // ==================================
//             // BAR NUMBER - ALWAYS WHITE
//             // ==================================

//             "& .MuiBarLabel-root": {
//               fill: "#ffffff !important",
//               fontWeight: 700,
//               fontSize: "12px",
//             },
//           }}
//         />
//       </div>
//     </div>
//   );
// }





import React, { useMemo } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";

export default function CityOrdersChart({
  cityWiseOrders = [],
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Normalize city names and order counts once
  const cities = useMemo(() => {
    return cityWiseOrders.map((item, index) => {
      const rawCity =
        item?.pickup_city ||
        item?.delivery_city ||
        item?.city ||
        "Unknown";

      const cityName = String(rawCity)
        .trim()
        .toLowerCase()
        .replace(/\b\p{L}/gu, (char) => char.toUpperCase());

      const orders = Number(
        item?.total_orders ?? item?.count ?? 0
      );

      return {
        id: index,
        cityName,
        orders: Number.isFinite(orders)
          ? Math.max(0, orders)
          : 0,
      };
    });
  }, [cityWiseOrders]);

  const labels = cities.map((city) => city.cityName);

  const series = [
    {
      label: "Orders",
      data: cities.map((city) => city.orders),
      color: "#0446DB",
    },
  ];

  const maxOrders = Math.max(
    0,
    ...cities.map((city) => city.orders)
  );

  const textColor = isDark ? "#E5E7EB" : "#374151";
  const secondaryTextColor = isDark ? "#D1D5DB" : "#6B7280";
  const gridColor = isDark ? "#374151" : "#E5E7EB";

  return (
    <div className="w-full min-w-0 bg-white transition-colors duration-300 dark:bg-neutral-900 dark:text-white">

      {/* HEADER */}
     

      {cities.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-sm text-gray-500 dark:text-neutral-400">
          No city-wise orders found
        </div>
      ) : (
        <>
          {/* MOBILE VIEW - Progress Bars */}
          <div className="space-y-4 md:hidden">
            {cities.map((city) => {
              const percent =
                maxOrders > 0
                  ? (city.orders / maxOrders) * 100
                  : 0;

              return (
                <div
                  key={`${city.cityName}-${city.id}`}
                  className="flex items-center gap-3"
                >
                  {/* City Name */}
                  <span
                    title={city.cityName}
                    className="w-20 shrink-0 truncate text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    {city.cityName}
                  </span>

                  {/* Progress Bar */}
                  <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800">
                    <div
                      className="h-full rounded-full bg-[#0446DB] transition-all duration-500"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(percent, 100)
                        )}%`,
                      }}
                    />
                  </div>

                  {/* Total Orders */}
                  <span className="w-12 shrink-0 text-right text-sm font-bold text-gray-900 dark:text-white">
                    {city.orders.toLocaleString("en-IN")}
                  </span>
                </div>
              );
            })}
          </div>

          {/* DESKTOP VIEW - MUI BarChart */}
          <div className="hidden w-full min-w-0 overflow-x-auto md:block">
            <div
              style={{
                minWidth: Math.max(500, cities.length * 75),
              }}
            >
              <BarChart
                height={350}
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
                yAxis={[
                  {
                    tickLabelStyle: {
                      fontSize: 12,
                      fill: textColor,
                    },
                  },
                ]}
                series={series}
                barLabel={({ value }) =>
                  value > 0 ? value : null
                }
                grid={{ horizontal: true }}
                sx={{
                  "& .MuiChartsAxis-tickLabel": {
                    fill: `${textColor} !important`,
                  },
                  "& .MuiChartsAxis-line": {
                    stroke: `${secondaryTextColor} !important`,
                  },
                  "& .MuiChartsAxis-tick": {
                    stroke: `${secondaryTextColor} !important`,
                  },
                  "& .MuiChartsGrid-line": {
                    stroke: `${gridColor} !important`,
                    strokeOpacity: isDark ? 0.5 : 1,
                  },
                  "& .MuiChartsLegend-label": {
                    color: `${textColor} !important`,
                    fill: `${textColor} !important`,
                  },
                  "& .MuiBarLabel-root": {
                    fill: "#ffffff !important",
                    fontWeight: 700,
                    fontSize: "12px",
                  },
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
