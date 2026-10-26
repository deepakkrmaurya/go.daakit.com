import { ResponsivePie } from "@nivo/pie";

const Piechart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[150px] items-center justify-center text-xs text-gray-500">
        No data available
      </div>
    );
  }

  const activeData = data.filter((item) => Number(item.value) > 0);

  if (activeData.length === 0) {
    return (
      <div className="flex h-[150px] items-center justify-center text-xs text-gray-500">
        No active data
      </div>
    );
  }

  const total = activeData.reduce((sum, item) => sum + Number(item.value), 0);

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Left Side: Donut Chart */}
      <div className="relative h-[130px] w-[130px] shrink-0">
        <ResponsivePie
          data={activeData}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          innerRadius={0.65}
          padAngle={0}
          cornerRadius={2}
          // activeOuterRadiusOffset={2}
          colors={{ datum: "data.color" }}
          borderWidth={0}
          enableArcLinkLabels={false}
          enableArcLabels={false}
          isInteractive={true}
          tooltip={({ datum }) => (
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: datum.color }}
              />
              <span>{datum.label}:</span>
              <span className="font-bold">
                {datum.value.toLocaleString("en-IN")}
              </span>
            </div>
          )}
        />
      </div>

      {/* Right Side: Legend List */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-3">
        {data.map((item, idx) => {
          return (
            <div key={idx} className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate text-xs font-semibold text-gray-600 dark:text-gray-300">
                  {item.label}
                </span>
              </div>
              <span className="shrink-0 text-xs font-bold text-gray-900 dark:text-white">
                {Number(item.value).toLocaleString("en-IN")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export {
Piechart
}