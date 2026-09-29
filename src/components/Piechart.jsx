

// import React from "react";
// import { ResponsivePie } from "@nivo/pie";
// export default function NivoPieChart({ data = [] }) {
 
//   return (
//     <div style={{ height: 350, width: "100%" }}>
//       <ResponsivePie
//         data={data}
//         margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
//         innerRadius={0}
//         padAngle={0}
//         cornerRadius={0}
//         activeOuterRadiusOffset={8}
//         colors={{ datum: "data.color" }}
//         borderWidth={0}
//         arcLinkLabelsSkipAngle={10}
//         arcLinkLabelsTextColor="#333333"
//         arcLinkLabelsThickness={2}
//         arcLinkLabelsColor={{ from: "color" }}
//         arcLabelsSkipAngle={10}
//         arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
//         tooltip={({ datum }) => (
//           <div style={{ background: "white", padding: "5px 10px", border: "1px solid #ccc", borderRadius: "4px" ,whiteSpace: "nowrap"}}>
//             <strong>{datum.id}</strong>: {datum.value}
//           </div>
//         )}
//       />
//     </div>
//   );
// }





import { ResponsivePie } from "@nivo/pie";
import { useEffect, useState } from "react";

export default function NivoPieChart({ data = [] }) {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark")
      );
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-[300px] w-full text-gray-700 dark:text-white">
      <ResponsivePie
        data={data}

        // ================================
        // CHART SIZE / SPACING
        // ================================
        margin={{
          top: 20,
          right: 55,
          bottom: 20,
          left: 55,
        }}

        // ================================
        // PIE DESIGN
        // ================================
        innerRadius={0}
        padAngle={0}
        cornerRadius={0}
        activeOuterRadiusOffset={8}
        colors={{ datum: "data.color" }}
        borderWidth={0}

        // ================================
        // OUTSIDE LABELS
        // ================================
        arcLinkLabelsSkipAngle={8}
        arcLinkLabelsTextColor={
          isDark ? "#ffffff" : "#333333"
        }
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLinkLabelsOffset={4}
        arcLinkLabelsDiagonalLength={12}
        arcLinkLabelsStraightLength={15}

        // ================================
        // INSIDE VALUE LABELS
        // ================================
        arcLabelsSkipAngle={8}
        arcLabelsTextColor={
          isDark ? "#ffffff" : "#222222"
        }

        // ================================
        // THEME
        // ================================
        theme={{
          text: {
            fill: isDark ? "#ffffff" : "#333333",
            fontSize: 12,
          },

          labels: {
            text: {
              fill: isDark ? "#ffffff" : "#333333",
              fontSize: 12,
            },
          },

          legends: {
            text: {
              fill: isDark ? "#ffffff" : "#333333",
              fontSize: 12,
            },
          },

          tooltip: {
            container: {
              background: isDark ? "#171717" : "#ffffff",
              color: isDark ? "#ffffff" : "#171717",
              border: isDark
                ? "1px solid #404040"
                : "1px solid #e5e5e5",
              borderRadius: "8px",
              boxShadow:
                "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
          },
        }}

        // ================================
        // TOOLTIP
        // ================================
        tooltip={({ datum }) => (
          <div
            className="
              whitespace-nowrap
              rounded-lg
              border
              border-gray-200
              bg-white
              px-3
              py-2
              text-sm
              text-gray-900
              shadow-lg
              dark:border-neutral-700
              dark:bg-neutral-900
              dark:text-white
            "
          >
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: datum.color,
                }}
              />

              <span>
                <strong>{datum.id}</strong>: {datum.value}
              </span>
            </div>
          </div>
        )}
      />
    </div>
  );
}