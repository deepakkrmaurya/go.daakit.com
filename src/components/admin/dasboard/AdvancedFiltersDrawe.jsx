import React, { useEffect, useState } from "react";
import { Check, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";

export default function AdvancedFiltersDrawer({
  filterDrawerOpen,
  openFilters,
  draftDatePreset,
  setDraftDatePreset,
  draftStartDate,
  setDraftStartDate,
  draftEndDate,
  setDraftEndDate,
  filterCity,
  setFilterCity,
  filterVendorId,
  setFilterVendorId,
  vendorList = [],
  applyScope,
  resetAllFilters,
}) {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(query.matches);
    sync();
    query.addEventListener?.("change", sync);
    return () => query.removeEventListener?.("change", sync);
  }, []);

  const fieldClass =
    "h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:ring-blue-950";

  const openNativeDatePicker = (event) => {
    if (typeof event.currentTarget.showPicker === "function") {
      try {
        event.currentTarget.showPicker();
      } catch {
        // Some browsers display the native picker automatically.
      }
    }
  };

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={filterDrawerOpen}
      onOpenChange={openFilters}
    >
      <DrawerTrigger>
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0339b5]"
        >
          <SlidersHorizontal size={17} />
          Filters
        </button>
      </DrawerTrigger>

      <DrawerContent
        className="!fixed !z-50 !inset-x-0 !bottom-0 !top-auto !mt-0 !h-auto !max-h-[90dvh] !w-full !max-w-none !rounded-t-2xl !rounded-b-none !border-t !border-l-0 bg-white dark:border-neutral-700 dark:bg-neutral-900 md:!inset-x-auto md:!right-0 md:!top-0 md:!bottom-0 md:!h-dvh md:!max-h-dvh md:!w-[440px] md:!rounded-none md:!border-l md:!border-t-0 flex min-h-0 flex-col overflow-hidden"
      >
        <DrawerHeader className="shrink-0 border-b border-gray-100 px-5 pb-4 pt-5 text-left dark:border-neutral-800">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex flex-col text-left">
              <DrawerTitle className="text-lg font-bold text-gray-900 dark:text-white">
                Advanced Filters
              </DrawerTitle>
              <DrawerDescription className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Filter by date, pickup city, DC and vendor.
              </DrawerDescription>
            </div>
            <DrawerClose
              render={
                <button
                  type="button"
                  aria-label="Close filters"
                  className="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800"
                />
              }
            >
              <X size={18} />
            </DrawerClose>
          </div>
        </DrawerHeader>

        <form
          id="analytics-advanced-filters"
          onSubmit={applyScope}
          className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-5"
        >
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Date Range</h4>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                Select Period
              </span>
              <select
                value={draftDatePreset}
                onChange={(e) => setDraftDatePreset(e.target.value)}
                className={fieldClass}
              >
                {[
                  "Today",
                  "Yesterday",
                  "Last 7 Days",
                  "Last 30 Days",
                  "This Month",
                  "Last Month",
                  "Custom Range",
                ].map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </label>
            {draftDatePreset === "Custom Range" && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-gray-700 dark:text-gray-200">
                    Start Date
                  </span>
                  <input
                    required
                    type="date"
                    value={draftStartDate}
                    max={draftEndDate || undefined}
                    onChange={(e) => setDraftStartDate(e.target.value)}
                    onClick={openNativeDatePicker}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-gray-700 dark:text-gray-200">
                    End Date
                  </span>
                  <input
                    required
                    type="date"
                    value={draftEndDate}
                    min={draftStartDate || undefined}
                    onChange={(e) => setDraftEndDate(e.target.value)}
                    onClick={openNativeDatePicker}
                    className={fieldClass}
                  />
                </label>
              </div>
            )}
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Pickup City
            </span>
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className={fieldClass}
            >
              <option value="">All Cities</option>
              {["delhi", "lucknow", "gurugram", "bangalore"].map((city) => (
                <option key={city} value={city}>
                  {city.charAt(0).toUpperCase() + city.slice(1)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Fleet Partner
            </span>
            <select
              value={filterVendorId}
              onChange={(e) => setFilterVendorId(e.target.value)}
              className={fieldClass}
            >
              <option value="">Select a Vendor</option>
              {vendorList.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.id}: {vendor.vendor_name}
                </option>
              ))}
            </select>
          </label>
        </form>

        <DrawerFooter className="flex w-full shrink-0 flex-row items-center justify-end gap-2 border-t border-gray-100 bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-neutral-800 dark:bg-neutral-900">
          <button
            type="button"
            onClick={resetAllFilters}
            className="inline-flex h-10 w-1/2 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-200 dark:hover:bg-neutral-800"
          >
            <RotateCcw size={16} /> Reset
          </button>
          <button
            type="submit"
            form="analytics-advanced-filters"
            className="inline-flex h-10 w-1/2 items-center justify-center gap-2 rounded-md bg-[#0446DB] px-3 text-sm font-semibold text-white hover:bg-[#0339b5]"
          >
            <Check size={16} /> Apply Filters
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
