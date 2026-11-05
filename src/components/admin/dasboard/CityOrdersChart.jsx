import React from "react";
import { useTheme } from "@mui/material/styles";

export default function CityOrdersChart({
  cityWiseOrders = [],
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // CITY LABELS
  const chartData = cityWiseOrders.map((item) => {
    const city = String(item?.pickup_city || "Unknown")
      .trim()
      .toLowerCase();

    return {
      city: city.replace(/\b\p{L}/gu, (char) =>
        char.toUpperCase()
      ),
      orders: Number(item?.total_orders || 0),
    };
  });

  // MAX ORDERS
  const maxOrders = Math.max(
    ...chartData.map((item) => item.orders),
    1
  );

  // THEME COLORS
  const cardBg = isDark
    ? "bg-neutral-900"
    : "bg-white";

  const borderColor = isDark
    ? "border border-gray-300"
    : "border border-gray-300";

  const titleColor = isDark
    ? "text-white"
    : "text-slate-700";

  const secondaryColor = isDark
    ? "text-neutral-400"
    : "text-slate-500";

  return (
    <div
      className={`
        w-full h-[255px]
        rounded-sm
        ${cardBg}
        ${borderColor}
        p-4
         border-gray-300
        transition-colors duration-300
        overflow-hidden
      `}
    >
      {/* HEADER */}

      <div className="flex items-start justify-between">

        <div className="text-start">
          <h2
            className={`text-lg font-semibold text-gray-800 dark:text-white ${titleColor}`}
          >
            City-wise order distribution
          </h2>

          <p
            className={`mt-1 text-[12px] ${secondaryColor}`}
          >
            Top destination cities
          </p>
        </div>

        <span className={`text-[12px] ${secondaryColor}`}>
          {chartData.length} cities
        </span>

      </div>

      {/* BAR CHART */}

      {chartData.length > 0 ? (

        <div className="flex h-[178px] w-full items-end gap-2.5 sm:gap-3">

          {chartData.map((item, index) => {

            const barHeight =
              (item.orders / maxOrders) * 132;

            return (
              <div
                key={`${item.city}-${index}`}
                className="
                  flex h-full min-w-0 flex-1
                  flex-col items-center justify-end
                "
              >

                {/* ORDER VALUE */}

                <span
                  className="
                    mb-[5px]
                    text-[9px]
                    font-semibold
                    text-blue-600
                    whitespace-nowrap
                  "
                >
                  {item.orders.toLocaleString("en-IN")}
                </span>

                {/* BAR */}

                <div
                  className="
                    w-full
                    rounded-t-[5px]
                    bg-gradient-to-b
                    from-blue-500
                    to-blue-700
                    transition-all
                    duration-300
                    hover:from-blue-400
                    hover:to-blue-600
                  "
                  style={{
                    height: `${barHeight}px`,
                    minHeight: item.orders > 0 ? "4px" : "0px",
                  }}
                  title={`${item.city}: ${item.orders.toLocaleString("en-IN")} orders`}
                />

                {/* CITY NAME */}

                <span
                  className={`
                    mt-[9px]
                    text-[8px]
                    sm:text-[9px]
                    whitespace-nowrap
                    ${secondaryColor}
                  `}
                >
                  {item.city}
                </span>

              </div>
            );
          })}

        </div>

      ) : (

        <div className="flex h-[178px] items-center justify-center">
          <p className={`text-xs ${secondaryColor}`}>
            No city order data available
          </p>
        </div>

      )}

    </div>
  );
}