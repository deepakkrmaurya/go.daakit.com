// import daakitIcon from "@/assets/daakit-icon.png";

// function Loader() {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0446DB]">
//       <img
//         src={daakitIcon}
//         alt="Daakit Icon"
//         className="w-32 h-32 animate-spin"
//       />
//     </div>
//   );
// }

// export default Loader;





import daakitIcon from "@/assets/daakit-icon.png";

function Loader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#F6F9FF] dark:bg-[#080F20]">
      
      <div className="relative flex flex-col items-center justify-center">
        
        {/* Soft Background Glow */}
        <div className="absolute h-72 w-72 rounded-full bg-[#0446DB]/10 blur-[70px] animate-pulse" />

        {/* Animated Logo Container */}
        <div className="relative flex h-40 w-40 items-center justify-center">

          {/* Outer Rotating Ring */}
          <div className="absolute inset-0 rounded-full border-[3px] border-[#0446DB]/10 border-t-[#0446DB] border-r-[#0446DB]/40 animate-[spin_2s_linear_infinite]" />

          {/* Inner Reverse Ring */}
          <div className="absolute inset-[12px] rounded-full border-2 border-[#0446DB]/10 border-b-[#EB8300] animate-[spin_1.5s_linear_infinite_reverse]" />

          {/* Expanding Pulse Ring */}
          <div className="absolute inset-[20px] rounded-full border-2 border-[#0446DB]/30 animate-[daakitPulse_2s_ease-out_infinite]" />

          {/* Logo Background */}
          <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-[#0446DB] shadow-[0_10px_40px_rgba(4,70,219,0.15)] dark:bg-white">
            <img
              src={daakitIcon}
              alt="DAAKit"
              className="h-16 w-16 object-contain animate-[daakitFloat_2s_ease-in-out_infinite]"
            />
          </div>

          {/* Orbiting Accent */}
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 animate-[spin_3s_linear_infinite]">
            <div className="absolute left-1/2 top-[-4px] h-2 w-2 -translate-x-1/2 rounded-full bg-[#EB8300] shadow-[0_0_12px_rgba(235,131,0,0.7)]" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="relative z-10 mt-8 flex flex-col items-center">
          <h2 className="text-xl font-bold tracking-[0.18em] text-[#0446DB] dark:text-blue-400">
            DAAKit GO
          </h2>

          <p className="mt-2 text-xs font-medium tracking-[0.15em] text-slate-500 dark:text-slate-400">
            Hyperlocal Delivery, Hyperfast.
          </p>

          {/* Animated Loading Dots */}
          <div className="mt-6 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#0446DB] animate-[daakitBounce_1s_ease-in-out_infinite]" />
            <span className="h-2 w-2 rounded-full bg-[#0446DB] animate-[daakitBounce_1s_ease-in-out_0.15s_infinite]" />
            <span className="h-2 w-2 rounded-full bg-[#EB8300] animate-[daakitBounce_1s_ease-in-out_0.3s_infinite]" />
          </div>

          
        </div>
      </div>

      <style>{`
        @keyframes daakitPulse {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        @keyframes daakitFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes daakitBounce {
          0%, 80%, 100% {
            transform: scale(0.65);
            opacity: 0.4;
          }
          40% {
            transform: scale(1.25);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default Loader;
