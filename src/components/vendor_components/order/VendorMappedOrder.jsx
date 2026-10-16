
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Handshake,
  Loader2,
  PackageCheck,
  PackageOpen,
  RotateCcw,
  Search,
  Truck,
  X,
} from "lucide-react";
import AxiosInstance from "../../../Helper/axiosInstance";

const baseURL = import.meta.env.VITE_BASE_URL;

const toApiDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatToDMY = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${d.getFullYear()}`;
};

const getDefaultFilters = () => {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  return {
    startDate: oneMonthAgo,
    endDate: today,
    awbNumber: "",
  };
};

const statusClass = (status) => {
  const value = String(status || "").toLowerCase();

  if (["picked", "handovered", "completed", "delivered"].includes(value)) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400";
  }

  if (["pending", "to be handover", "to be picked"].includes(value)) {
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400";
  }

  return "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400";
};

const StatusBadge = ({ children }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(
      children
    )}`}
  >
    {children || "-"}
  </span>
);

const EmptyState = ({ message }) => (
  <tr>
    <td colSpan={4} className="px-6 py-16">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-gray-100 dark:bg-neutral-800">
          <PackageOpen className="h-6 w-6 text-gray-400 dark:text-neutral-500" />
        </div>
        <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-neutral-200">
          {message}
        </p>
        <p className="mt-1 text-xs text-gray-400 dark:text-neutral-500">
          Try changing your filters or date range.
        </p>
      </div>
    </td>
  </tr>
);

const TableLoader = () => (
  <tr>
    <td colSpan={4} className="px-6 py-20">
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#0446DB]" />
        <p className="mt-3 text-sm text-gray-500 dark:text-neutral-400">
          Loading mapped orders...
        </p>
      </div>
    </td>
  </tr>
);

const DateFilter = ({
  label,
  value,
  open,
  setOpen,
  onSelect,
  disabled,
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
      {label}
    </label>

    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full justify-start gap-2 rounded-sm border-gray-200 bg-white px-3 font-normal text-gray-700 shadow-none hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          <CalendarDays className="h-4 w-4 text-[#0446DB]" />
          {value ? formatToDMY(value) : "Select date"}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto overflow-hidden rounded-sm border-gray-200 p-0 shadow-xl dark:border-neutral-700"
        align="start"
      >
        <Calendar
          mode="single"
          selected={value || undefined}
          defaultMonth={value || undefined}
          disabled={disabled}
          onSelect={(date) => {
            if (!date) return;
            onSelect(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  </div>
);

export default function VendorMappedOrder() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const [orderID, setOrderId] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const [newVendorRecords, setNewVendorRecords] = useState([]);
  const [oldVendorRecords, setOldVendorRecords] = useState([]);
  const [tab, setTab] = useState("newvendor");

  const [advanceFilters, setAdvanceFilters] = useState(getDefaultFilters);

  const getAllNewMappedOrders = async (customFilters = advanceFilters) => {
    setLoading(true);

    try {
      const res = await AxiosInstance.get(
        `/api/vendor/getAllNewMappedOrders`,
        {
          params: {
            page,
            limit,
            awb_number: customFilters.awbNumber?.trim() || "",
            startDate: toApiDate(customFilters.startDate),
            endDate: toApiDate(customFilters.endDate),
          },
          
        }
      );
      console.log(res.data)
      const data = res?.data?.data || {};

      setNewVendorRecords(data?.newVendorRecords || []);
      setOldVendorRecords(data?.oldVendorRecords || []);

      const pages =
        data?.totalPages ??
        res?.data?.totalPages ??
        data?.pagination?.totalPages ??
        1;

      setTotalPages(Math.max(Number(pages) || 1, 1));
    } catch (err) {
      setNewVendorRecords([]);
      setOldVendorRecords([]);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "An error occurred while fetching orders."
      );
    } finally {
      setLoading(false);
    }
  };

  const pickupOrderFromOldVendor = async (order_id) => {
    setActionLoadingId(order_id);

    try {
      const res = await AxiosInstance.post(
        `/api/vendor/pickupOrderFromOldVendor`,
        { order_id },
        
      );

      toast.success(res?.data?.message || "Order picked successfully");
      setOrderId(null);
      setTab("newvendor");
      await getAllNewMappedOrders();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to pick order"
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handoverOrderToNewVendor = async (order_id) => {
    setActionLoadingId(order_id);

    try {
      const res = await AxiosInstance.post(
        `/api/vendor/handoverOrderToNewVendor`,
        { order_id },
        
      );

      toast.success(res?.data?.message || "Order handed over successfully");
      setOrderId(null);
      setTab("oldvendor");
      await getAllNewMappedOrders();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to handover order"
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const applyFilters = async (e) => {
    e?.preventDefault();

    if (
      advanceFilters.startDate &&
      advanceFilters.endDate &&
      new Date(advanceFilters.startDate) > new Date(advanceFilters.endDate)
    ) {
      toast.error("Start date cannot be after end date");
      return;
    }

    setPage(1);
    setIsFilterOpen(false);
    await getAllNewMappedOrders();
  };

  const resetAdvanceFilters = async () => {
    const defaults = getDefaultFilters();
    setAdvanceFilters(defaults);
    setPage(1);
    setIsFilterOpen(false);
    await getAllNewMappedOrders(defaults);
  };

  useEffect(() => {
    getAllNewMappedOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  useEffect(() => {
    const timer = setTimeout(() => setLoadingPage(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loadingPage) {
    return (
      <div className="flex h-[90vh] w-full items-center justify-center bg-[#f7f8fa] dark:bg-neutral-950">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center ">
            <Loader2 className="h-7 w-7 animate-spin text-[#0446DB]" />
          </div>
          <p className="mt-4 text-sm font-medium text-gray-600 dark:text-neutral-300">
            Loading Mapped Orders...
          </p>
        </div>
      </div>
    );
  }

  const currentCount =
    tab === "newvendor" ? newVendorRecords.length : oldVendorRecords.length;

  return (
    <div className="min-h-screen w-full text-gray-900 dark:bg-neutral-950 dark:text-white">
      {/* Header */}
      <div className="sticky top-0 z-20  dark:bg-neutral-900/90">
        <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-2">
              
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  New Mapped Orders
                </h1>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                  Manage vendor pickup and handover orders
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-sm border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500 sm:block dark:border-neutral-800 dark:bg-neutral-800/70 dark:text-neutral-400">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {currentCount}
              </span>{" "}
              records
            </div>

            <Drawer
              direction="right"
              open={isFilterOpen}
              onOpenChange={setIsFilterOpen}
            >
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 gap-2 rounded-sm border-gray-200 bg-white px-4 text-[#0446DB] shadow-sm hover:border-[#0446DB]/30 hover:bg-[#0446DB]/5 dark:border-neutral-700 dark:bg-neutral-900 dark:text-blue-400 dark:hover:bg-[#0446DB]/10"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DrawerTrigger>

              <DrawerContent className="ml-auto h-full w-full max-w-md rounded-none border-l border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <DrawerHeader className="border-b border-gray-200 px-5 py-5 text-left dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#0446DB]/10 text-[#0446DB] dark:bg-[#0446DB]/20 dark:text-blue-400">
                      <Filter className="h-4 w-4" />
                    </div>
                    <div>
                      <DrawerTitle className="text-lg">
                        Filter Orders
                      </DrawerTitle>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                        Narrow down mapped orders
                      </p>
                    </div>
                  </div>
                </DrawerHeader>

                <form
                  onSubmit={applyFilters}
                  className="flex min-h-0 flex-1 flex-col"
                >
                  <div className="flex-1 space-y-5 overflow-y-auto p-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <DateFilter
                        label="Start Date"
                        value={advanceFilters.startDate}
                        open={startOpen}
                        setOpen={setStartOpen}
                        onSelect={(date) =>
                          setAdvanceFilters((prev) => ({
                            ...prev,
                            startDate: date,
                            endDate:
                              prev.endDate && new Date(prev.endDate) < date
                                ? null
                                : prev.endDate,
                          }))
                        }
                        disabled={(date) => date > new Date()}
                      />

                      <DateFilter
                        label="End Date"
                        value={advanceFilters.endDate}
                        open={endOpen}
                        setOpen={setEndOpen}
                        onSelect={(date) =>
                          setAdvanceFilters((prev) => ({
                            ...prev,
                            endDate: date,
                          }))
                        }
                        disabled={(date) =>
                          date > new Date() ||
                          (advanceFilters.startDate &&
                            date < new Date(advanceFilters.startDate))
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                        AWB Number(s)
                      </label>

                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={advanceFilters.awbNumber}
                          onChange={(e) =>
                            setAdvanceFilters((prev) => ({
                              ...prev,
                              awbNumber: e.target.value,
                            }))
                          }
                          placeholder="Enter AWB number"
                          className="h-11 w-full rounded-sm border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500"
                        />
                      </div>
                    </div>
                  </div>

                  <DrawerFooter className="border-t border-gray-200 bg-gray-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetAdvanceFilters}
                        className="h-11 gap-2 rounded-sm dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reset
                      </Button>

                      <Button
                        type="submit"
                        className="h-11 gap-2 rounded-sm bg-[#0446DB] text-white hover:bg-[#0339b5]"
                      >
                        <Filter className="h-4 w-4" />
                        Apply Filter
                      </Button>
                    </div>

                    <DrawerClose asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        className="mt-1 h-10 gap-2 text-gray-500 dark:text-neutral-400"
                      >
                        <X className="h-4 w-4" />
                        Close
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </form>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5 lg:p-6">
        <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <Tabs
            value={tab}
            onValueChange={(value) => {
              setTab(value);
              setOrderId(null);
            }}
          >
            <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
              <TabsList className="grid h-10 w-full grid-cols-2 rounded-sm bg-gray-100 p-1 sm:w-[320px] dark:bg-neutral-800">
                <TabsTrigger
                  value="newvendor"
                  className="gap-2 rounded-md text-xs font-semibold text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#0446DB] data-[state=active]:shadow-sm dark:text-neutral-400 dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-blue-400"
                >
                  <PackageCheck className="h-4 w-4" />
                  New Vendor
                  <span className="rounded-full bg-[#0446DB]/10 px-1.5 py-0.5 text-[10px] text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                    {newVendorRecords.length}
                  </span>
                </TabsTrigger>

                <TabsTrigger
                  value="oldvendor"
                  className="gap-2 rounded-md text-xs font-semibold text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#0446DB] data-[state=active]:shadow-sm dark:text-neutral-400 dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-blue-400"
                >
                  <Handshake className="h-4 w-4" />
                  Old Vendor
                  <span className="rounded-full bg-[#0446DB]/10 px-1.5 py-0.5 text-[10px] text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                    {oldVendorRecords.length}
                  </span>
                </TabsTrigger>
              </TabsList>

              <p className="text-xs text-gray-400 dark:text-neutral-500">
                Click a pending status to perform the vendor action.
              </p>
            </div>

            {/* New Vendor */}
            <TabsContent value="newvendor" className="m-0">
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/80 dark:border-neutral-800 dark:bg-neutral-800/50">
                      {[
                        "ORDER ID",
                        "AWB NUMBER",
                        "NEW VENDOR REMARKS",
                        "NEW VENDOR STATUS",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="whitespace-nowrap px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                    {loading ? (
                      <TableLoader />
                    ) : newVendorRecords.length === 0 ? (
                      <EmptyState message="No new vendor orders found" />
                    ) : (
                      newVendorRecords.map((order) => (
                        <tr
                          key={order.id}
                          className="transition-colors hover:bg-gray-50/70 dark:hover:bg-neutral-800/40"
                        >
                          <td className="px-5 py-4">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {order.order_id || "-"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-md bg-gray-100 px-2.5 py-1 font-mono text-xs font-medium text-gray-700 dark:bg-neutral-800 dark:text-neutral-300">
                              {order.awb_number || "-"}
                            </span>
                          </td>

                          <td className="max-w-[320px] px-5 py-4 text-sm text-gray-500 dark:text-neutral-400">
                            <span className="line-clamp-2">
                              {order.new_vendor_remarks || "-"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            {order.new_vendor_status === "picked" ? (
                              <StatusBadge>picked</StatusBadge>
                            ) : order.order_id === orderID ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  disabled={actionLoadingId === order.order_id}
                                  onClick={() =>
                                    pickupOrderFromOldVendor(order.order_id)
                                  }
                                  className="h-8 gap-1.5 rounded-md bg-[#0446DB] px-3 text-xs text-white hover:bg-[#0339b5]"
                                >
                                  {actionLoadingId === order.order_id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <PackageCheck className="h-3.5 w-3.5" />
                                  )}
                                  Pick
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setOrderId(null)}
                                  className="h-8 rounded-md px-3 text-xs dark:border-neutral-700"
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : order.old_vendor_status === "handovered" ? (
                              <button
                                type="button"
                                onClick={() => setOrderId(order.order_id)}
                                className="cursor-pointer"
                              >
                                <StatusBadge>
                                  {order.new_vendor_status}
                                </StatusBadge>
                              </button>
                            ) : (
                              <StatusBadge>
                                {order.new_vendor_status}
                              </StatusBadge>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Old Vendor */}
            <TabsContent value="oldvendor" className="m-0">
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/80 dark:border-neutral-800 dark:bg-neutral-800/50">
                      {[
                        "ORDER ID",
                        "AWB NUMBER",
                        "OLD VENDOR REMARKS",
                        "OLD VENDOR STATUS",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="whitespace-nowrap px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                    {loading ? (
                      <TableLoader />
                    ) : oldVendorRecords.length === 0 ? (
                      <EmptyState message="No old vendor orders found" />
                    ) : (
                      oldVendorRecords.map((order) => (
                        <tr
                          key={order.id}
                          className="transition-colors hover:bg-gray-50/70 dark:hover:bg-neutral-800/40"
                        >
                          <td className="px-5 py-4">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {order.order_id || "-"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-md bg-gray-100 px-2.5 py-1 font-mono text-xs font-medium text-gray-700 dark:bg-neutral-800 dark:text-neutral-300">
                              {order.awb_number || "-"}
                            </span>
                          </td>

                          <td className="max-w-[320px] px-5 py-4 text-sm text-gray-500 dark:text-neutral-400">
                            <span className="line-clamp-2">
                              {order.old_vendor_remarks || "-"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            {order.order_id === orderID ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  disabled={actionLoadingId === order.order_id}
                                  onClick={() =>
                                    handoverOrderToNewVendor(order.order_id)
                                  }
                                  className="h-8 gap-1.5 rounded-md bg-[#0446DB] px-3 text-xs text-white hover:bg-[#0339b5]"
                                >
                                  {actionLoadingId === order.order_id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <ArrowRight className="h-3.5 w-3.5" />
                                  )}
                                  Handover
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setOrderId(null)}
                                  className="h-8 rounded-md px-3 text-xs dark:border-neutral-700"
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : order.old_vendor_status === "handovered" ? (
                              <StatusBadge>
                                {order.old_vendor_status}
                              </StatusBadge>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setOrderId(order.order_id)}
                                className="cursor-pointer"
                              >
                                <StatusBadge>
                                  {order.old_vendor_status}
                                </StatusBadge>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>

          {/* Pagination */}
          <div className="flex flex-col gap-4 border-t border-gray-200 bg-gray-50/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 dark:text-neutral-400">
                Rows per page
              </span>

              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="h-9 rounded-md border border-gray-200 bg-white px-2.5 text-sm text-gray-700 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                {[10, 20, 50, 100, 200].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <p className="text-xs text-gray-500 dark:text-neutral-400">
                Page{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {totalPages}
                </span>
              </p>

              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page === 1 || loading}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="h-9 gap-1 rounded-md border-gray-200 px-3 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || loading}
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="h-9 gap-1 rounded-md border-gray-200 px-3 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
