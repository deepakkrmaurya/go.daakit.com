// import React from "react";
// import { BarChart } from "@mui/x-charts/BarChart";

// export default function CityOrdersChart({ cityWiseOrders }) {
//   const labels = cityWiseOrders.map((item) => item.pickup_city);
//   const series = [
//     {
//       label: "Orders",
//       data: cityWiseOrders.map((item) => Number(item.total_orders)),
//       color: "#0446DB"
//     }
//   ];

//   return (
//     <div className=" bg-white dark:bg-neutral-900 dark:text-white p-4 rounded-lg shadow">
      

//       <BarChart
          
//             height={350}
//             xAxis={[
//               {
//                 scaleType: "band",
//                 data: labels,
//                 tickLabelStyle: { fontSize: 12, fill: "#374151" }
//               }
//             ]}
//             series={series}
//             barLabel={({ value }) =>
//               value <= 0 ? null : (
//                 <tspan style={{ fontWeight: "bold", fill: "#1f2937" }}>
//                   {value}
//                 </tspan>
//               )
//             }
//             grid={{ horizontal: true }}
//           />
//     </div>
//   );
// }



import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";

export default function CityOrdersChart({ cityWiseOrders = [] }) {
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";

  const labels = cityWiseOrders.map(
    (item) => item?.pickup_city || "Unknown",
  );

  const series = [
    {
      label: "Orders",
      data: cityWiseOrders.map((item) =>
        Number(item?.total_orders || 0),
      ),
      color: "#0446DB",
    },
  ];

  // Dynamic colors
  const textColor = isDark ? "#E5E7EB" : "#374151";
  const secondaryTextColor = isDark ? "#D1D5DB" : "#6B7280";
  const gridColor = isDark ? "#374151" : "#E5E7EB";

  return (
    <div className="rounded-lg bg-white p-4 shadow transition-colors duration-300 dark:bg-neutral-900 dark:text-white">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          City Wise Orders
        </h2>

        <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
          Total orders by pickup city
        </p>
      </div>

      <div className="w-full overflow-x-auto">
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
            value <= 0 ? null : value
          }
          grid={{
            horizontal: true,
          }}
          sx={{
            // X/Y axis labels
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

            // Grid
            "& .MuiChartsGrid-line": {
              stroke: `${gridColor} !important`,
              strokeOpacity: isDark ? 0.5 : 1,
            },

            // Legend text
            "& .MuiChartsLegend-label": {
              color: `${textColor} !important`,
              fill: `${textColor} !important`,
            },

            // Bar value labels
            "& .MuiBarLabel-root": {
              fill: `${textColor} !important`,
              fontWeight: 700,
              fontSize: "12px",
            },
          }}
        />
      </div>
    </div>
  );
}
