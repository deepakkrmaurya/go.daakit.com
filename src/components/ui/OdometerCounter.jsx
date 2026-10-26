
// import FlipNumbers from "react-flip-numbers";
// const BottomScrollCounter = ({
//     prevValue,
//     newValue,
//     duration = 600,
//     className = "",
//     fontSize = "64px",
//     fontWeight = "700",
//     color = "inherit"
// }) => {

//     return (
//         <div
//             className={`flex items-center  ${className}`}

//         >
          
//             <FlipNumbers
//                 height={32}
//                 width={20}
//                 color="black"
//                 background="white"
//                 play
//                 perspective={400}
//                 duration={duration / 1000}
//                 numbers={String(newValue)}
//                 className={'text-xl'}
//             />


//         </div>
//     );
// };

// export default BottomScrollCounter;



import React from "react";
import FlipNumbers from "react-flip-numbers";

const BottomScrollCounter = ({
  prevValue,
  newValue = 0,
  duration = 600,
  className = "",
  fontSize = "25px",
  fontWeight = 700,
  color = "inherit",
}) => {
  const size = parseFloat(fontSize) || 32;

  const formattedValue = Number(newValue).toLocaleString("en-IN");

  return (
    <div
      className={`inline-flex min-w-0 items-center ${className}`}
      style={{
        fontSize,
        fontWeight,
        color,
        lineHeight: 1.2,
      }}
    >
      <FlipNumbers
        height={size}
        width={size * 0.62}
        color="currentColor"
        background="transparent"
        play
        perspective={400}
        duration={duration / 1000}
        numbers={String(newValue)}
      />
    </div>
  );
};

export default BottomScrollCounter;
