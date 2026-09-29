
import { BarChart } from "@mui/x-charts/BarChart";
function StackBarChart({ data = [] }) {
  const labels = data.map((item) => item.delivery_city);

  const series = [
    {
      label: "Orders",
      data: data.map((item) => Number(item.count)),
      color: "#0446DB",
    },
  ];

  // minimum width 800px, har bar ko approx 70px space
  const chartWidth = Math.max(800, data.length * 70);

  return (
    <div className="w-full overflow-x-auto">
      <div style={{ minWidth: `${chartWidth}px` }}>
        <BarChart
          width={chartWidth}
          height={350}
          series={series}
          xAxis={[
            {
              scaleType: "band",
              data: labels,
              tickLabelStyle: {
                fontSize: 12,
                fill: "#374151",
              },
            },
          ]}
          barLabel={({ value }) =>
            value <= 0 ? null : (
              <tspan
                style={{
                  fontWeight: "bold",
                  fill: "#1f2937",
                }}
              >
                {value}
              </tspan>
            )
          }
          grid={{ horizontal: true }}
          legend={{
            direction: "row",
            position: {
              vertical: "top",
              horizontal: "middle",
            },
          }}
        />
      </div>
    </div>
  );
}

export default StackBarChart;
