import React from "react";

export default function TurnaroundTimeCard({ 
  pickupTat = 187, 
  deliveryTat = 19.3 
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-sm border border-gray-300 dark:border-gray-800 p-5 sm:p-6 w-full h-full flex flex-col shadow-sm">
      
      {/* Header Section */}
      <div className="mb-6">
        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white text-start">
          Turnaround time
        </h3>
        <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1 text-start">
          Weighted averages for the period
        </p>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Pickup TAT Card */}
        <div className="bg-[#f8f9fb] dark:bg-neutral-800/50 rounded-lg p-4 flex flex-col justify-center">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[24px] font-bold text-gray-900 dark:text-white leading-none tracking-tight">
              {pickupTat}
            </span>
            <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400">
              min
            </span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
            Average pickup TAT
          </p>
        </div>

        {/* Delivery TAT Card */}
        <div className="bg-[#f8f9fb] dark:bg-neutral-800/50 rounded-lg p-4 flex flex-col justify-center">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[24px] font-bold text-gray-900 dark:text-white leading-none tracking-tight">
              {deliveryTat}
            </span>
            <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400">
              hrs
            </span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
            Average delivery TAT
          </p>
        </div>

      </div>
    </div>
  );
}