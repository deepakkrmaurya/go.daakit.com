// import React from "react";
// import { toast } from "react-toastify";
// import { jwtDecode } from "jwt-decode";

// const TechBasedIntegration = () => {
//   const handleIntegrationRedirect = () => {
//     try {
//       const token = localStorage.getItem("token");
//       const decoded = jwtDecode(token);

//       // Configure your external integration URL here
//       const integrationURL = "https://integration.example.com"; // Update this with your actual integration portal URL

//       // Redirect to external application with token in query parameter
//       window.open(`${integrationURL}?token=${token}`, "_blank");

//       toast.success("Redirecting to Integration Portal...");
//     } catch (error) {
//       console.error("Integration redirect error:", error);
//       toast.error("Failed to open integration portal");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 p-4 md:p-8">
//       <div className="max-w-md mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
//             Integration Portal
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-2">
//             Connect to external applications
//           </p>
//         </div>

//         {/* Card */}
//         <div
//           className="
//             bg-white dark:bg-neutral-800
//             rounded-2xl border border-gray-200 dark:border-neutral-700
//             p-6 shadow-lg
//             transform transition-all duration-200 hover:shadow-xl
//           "
//         >
//           {/* Status Indicator */}
//           <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-neutral-700">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
//                 Integration Portal
//               </h3>
//               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                 Connect to external applications
//               </p>
//             </div>
//             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//           </div>

//           {/* Content */}
//           <div className="flex flex-col gap-4">
//             {/* Info Box */}
//             <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
//               <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
//                 <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">
//                   ℹ️
//                 </span>
//               </div>
//               <div className="flex-1">
//                 <p className="text-sm font-medium text-gray-800 dark:text-white">
//                   External Integration
//                 </p>
//                 <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
//                   You will be redirected to an external portal. Your authentication
//                   token will be securely passed for seamless login.
//                 </p>
//               </div>
//             </div>

//             {/* Action Button */}
//             <button
//               onClick={handleIntegrationRedirect}
//               className="
//                 w-full flex items-center justify-center gap-2
//                 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
//                 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700
//                 text-white font-medium py-3 px-4 rounded-lg
//                 transition-all duration-200 transform hover:scale-105
//                 shadow-lg hover:shadow-xl
//               "
//             >
//               <span>🔗</span>
//               Open Integration Portal
//               <span className="text-lg">→</span>
//             </button>

//             {/* Security Note */}
//             <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
//               Your session will remain active. You can close the window anytime.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TechBasedIntegration;
