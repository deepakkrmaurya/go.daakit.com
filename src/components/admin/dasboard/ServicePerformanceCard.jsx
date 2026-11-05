import React from "react";

export default function ServicePerformanceCard({
  // Service level data (Array of objects)
  services = [],
  // Funnel data
  funnel = {
    ordersCreated: 0,
    picked: 0,
    deliveryAttempted: 0,
    delivered: 0,
  },
  badgeText = "Daily rollup",
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 w-full shadow-sm flex flex-col mb-10">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-[14px] text-start font-bold text-gray-900 dark:text-white">
            Service-level performance
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Volume and delivery quality by service type
          </p>
        </div>
        
        {/* Badge */}
        {badgeText && (
          <span className="flex items-center gap-1.5 rounded-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 px-2.5 py-1 text-[10px] font-medium text-gray-600 dark:text-gray-300">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
            {badgeText}
          </span>
        )}
      </div>

      {/* Top 4 Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {services.map((service, idx) => (
          <div 
            key={idx} 
            className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col"
          >
            {/* Service Header (Name & Type) */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-bold text-gray-900 dark:text-white">
                {service.name}
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                {service.type}
              </span>
            </div>

            {/* Volume */}
            <div className="text-[20px] text-start font-bold text-gray-900 dark:text-white leading-tight mb-1 tabular-nums">
              {Number(service.volume).toLocaleString("en-IN")}
            </div>

            {/* Quality Metrics */}
            <p className="text-[10px] text-start text-gray-500 dark:text-gray-400 mt-auto">
              Delivery {service.delivery}% · FASR {service.fasr}%
            </p>
          </div>
        ))}
      </div>

      {/* Funnel (Bottom Bar) */}
      <div className="grid grid-cols-2 md:grid-cols-4 bg-[#f8f9fb] dark:bg-neutral-800/50 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800">
        
        {/* Stage 1 */}
        <div className="p-4 text-center">
          <div className="text-[16px] font-bold text-gray-900 dark:text-white tabular-nums">
            {Number(funnel.ordersCreated).toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Orders created</div>
        </div>

        {/* Stage 2 */}
        <div className="p-4 text-center">
          <div className="text-[16px] font-bold text-gray-900 dark:text-white tabular-nums">
            {Number(funnel.picked).toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Picked</div>
        </div>

        {/* Stage 3 */}
        <div className="p-4 text-center">
          <div className="text-[16px] font-bold text-gray-900 dark:text-white tabular-nums">
            {Number(funnel.deliveryAttempted).toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Delivery attempted</div>
        </div>

        {/* Stage 4 */}
        <div className="p-4 text-center">
          <div className="text-[16px] font-bold text-gray-900 dark:text-white tabular-nums">
            {Number(funnel.delivered).toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Delivered</div>
        </div>

      </div>
    </div>
  );
}