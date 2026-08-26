// import { PieChart as PC } from '@mui/x-charts/PieChart';

// const settings = {
//   margin: { right: 5 },
//   width: 200,
//   height: 200,
//   hideLegend: true,
// };

// export default function PieChart({ data,theme }) {
//   data = data.filter(d => d.value!=0);
//    const textColor = theme?.textColor || "#ffffff";
//   return (
//     <PC

//       series={[{ innerRadius: 50, outerRadius: 100, data, arcLabel: 'value' }]}

//       {...settings}

//     />
//   );
// }

import React from "react";
import { ResponsivePie } from "@nivo/pie";
export default function NivoPieChart({ data = [] }) {
 
  return (
    <div style={{ height: 300, width: "100%" }}>
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0}
        padAngle={0}
        cornerRadius={0}
        activeOuterRadiusOffset={8}
        colors={{ datum: "data.color" }}
        borderWidth={0}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        tooltip={({ datum }) => (
          <div style={{ background: "white", padding: "5px 10px", border: "1px solid #ccc", borderRadius: "4px" ,whiteSpace: "nowrap"}}>
            <strong>{datum.id}</strong>: {datum.value}
          </div>
        )}
      />
    </div>
  );
}