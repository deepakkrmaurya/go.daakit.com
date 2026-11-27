import React from "react";
import { useTheme } from "@mui/material/styles";
export default function CityOrdersChart({
  cityWiseOrders = [],
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // CITY LABELS AND ORDER COUNT
  const chartData = cityWiseOrders.map((item) => {
    const city = String(
      item?.delivery_city || item?.pickup_city || "Unknown"
    )
      .trim()
      .toLowerCase();

    return {
      city: city.replace(/\b\p{L}/gu, (char) =>
        char.toUpperCase()
      ),
      orders: Number(
        item?.count ?? item?.total_orders ?? 0
      ) || 0,
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
    ? "border-neutral-800"
    : "border-gray-300";

  const titleColor = isDark
    ? "text-white"
    : "text-gray-800";

  const secondaryColor = isDark
    ? "text-neutral-400"
    : "text-gray-500";

  return (
    <div
      className={`
        flex h-[255px] w-full min-w-0
        flex-col overflow-hidden
        rounded-sm border p-4
        transition-colors duration-300
        ${cardBg}
        ${borderColor}
      `}
    >
      {/* HEADER */}

      <div className="flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0 text-start">
          <h2
            className={`text-lg font-semibold ${titleColor}`}
          >
            City-wise order distribution
          </h2>

          <p className={`mt-1 text-xs ${secondaryColor}`}>
            Top destination cities
          </p>
        </div>

        <span
          className={`shrink-0 whitespace-nowrap text-xs ${secondaryColor}`}
        >
          {chartData.length} cities
        </span>
      </div>

      {/* BAR CHART */}

      {chartData.length > 0 ? (
        <div
          className="
            mt-2 min-h-0 min-w-0 flex-1
            overflow-x-auto overflow-y-hidden
            overscroll-x-contain
            pb-2
          "
        >
          <div
            className="
              flex h-full items-end
              gap-3 sm:gap-4
            "
            style={{
              minWidth: Math.max(
                chartData.length * 85,
                0
              ),
            }}
          >
            {chartData.map((item, index) => {
              const barHeight =
                (item.orders / maxOrders) * 132;

              return (
                <div
                  key={`${item.city}-${index}`}
                  className="
                    flex h-full min-w-[65px] flex-1
                    flex-col items-center justify-end
                  "
                >
                  {/* ORDER VALUE */}

                  <span
                    className="
                      mb-[5px]
                      whitespace-nowrap
                      text-[10px] font-semibold
                      text-[#0446DB]
                      dark:text-blue-400
                    "
                  >
                    {item.orders.toLocaleString("en-IN")}
                  </span>

                  {/* BAR */}

                  <div
                    className="
                      w-full max-w-[65px]
                      shrink-0
                      rounded-t-[5px]
                      bg-gradient-to-b
                      from-blue-500
                      to-[#0446DB]
                      transition-all duration-300
                      hover:from-blue-400
                      hover:to-blue-600
                    "
                    style={{
                      height: `${barHeight}px`,
                      minHeight:
                        item.orders > 0 ? "4px" : "0px",
                    }}
                    title={`${item.city}: ${item.orders.toLocaleString(
                      "en-IN"
                    )} orders`}
                  />

                  {/* CITY NAME */}

                  <span
                    title={item.city}
                    className={`
                      mt-2 w-full truncate
                      text-center text-[10px]
                      font-medium
                      ${secondaryColor}
                    `}
                  >
                    {item.city}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <p className={`text-xs ${secondaryColor}`}>
            No city order data available
          </p>
        </div>
      )}
    </div>
  );
}
