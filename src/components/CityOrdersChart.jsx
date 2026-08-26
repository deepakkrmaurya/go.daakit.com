import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

export default function CityOrdersChart({ cityWiseOrders }) {
  const labels = cityWiseOrders.map((item) => item.pickup_city);
  const series = [
    {
      label: "Orders",
      data: cityWiseOrders.map((item) => Number(item.total_orders)),
      color: "#0446DB"
    }
  ];

  return (
    <div className=" bg-white dark:bg-gray-800 dark:text-white p-4 rounded-lg shadow">
      

      <BarChart
          
            height={350}
            xAxis={[
              {
                scaleType: "band",
                data: labels,
                tickLabelStyle: { fontSize: 12, fill: "#374151" }
              }
            ]}
            series={series}
            barLabel={({ value }) =>
              value <= 0 ? null : (
                <tspan style={{ fontWeight: "bold", fill: "#1f2937" }}>
                  {value}
                </tspan>
              )
            }
            grid={{ horizontal: true }}
          />
    </div>
  );
}
