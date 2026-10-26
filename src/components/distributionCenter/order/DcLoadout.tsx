
"use client";

import React, { useState } from "react";
import { Package, RotateCcw, Search } from "lucide-react";

type LoadoutTab = "fresh" | "reloadout";

interface LoadoutOrder {
  id: number;
  awb: string;
  customerName: string;
  destination: string;
  riderName: string;
  status: string;
}

const freshOrders: LoadoutOrder[] = [
  {
    id: 1,
    awb: "DKTGO10001",
    customerName: "Rahul Sharma",
    destination: "Gurugram",
    riderName: "Amit Kumar",
    status: "Pending",
  },
  {
    id: 2,
    awb: "DKTGO10002",
    customerName: "Priya Singh",
    destination: "Noida",
    riderName: "Rohit Verma",
    status: "Pending",
  },
  {
    id: 3,
    awb: "DKTGO10003",
    customerName: "Aman Gupta",
    destination: "Delhi",
    riderName: "Vikas Yadav",
    status: "Pending",
  },
  {
    id: 4,
    awb: "DKTGO10004",
    customerName: "Neha Kapoor",
    destination: "Faridabad",
    riderName: "Sandeep",
    status: "Pending",
  },
];

const reLoadoutOrders: LoadoutOrder[] = [
  {
    id: 5,
    awb: "DKTGO20001",
    customerName: "Karan Mehta",
    destination: "Gurugram",
    riderName: "Amit Kumar",
    status: "Undelivered",
  },
  {
    id: 6,
    awb: "DKTGO20002",
    customerName: "Anjali Jain",
    destination: "Noida",
    riderName: "Rohit Verma",
    status: "Undelivered",
  },
  {
    id: 7,
    awb: "DKTGO20003",
    customerName: "Mohit Arora",
    destination: "Delhi",
    riderName: "Vikas Yadav",
    status: "Undelivered",
  },
  {
    id: 8,
    awb: "DKTGO20004",
    customerName: "Pooja Bansal",
    destination: "Faridabad",
    riderName: "Sandeep",
    status: "Undelivered",
  },
];

const DcLoadout: React.FC = () => {
  const [activeTab, setActiveTab] =
    useState<LoadoutTab>("fresh");

  const [search, setSearch] = useState<string>("");

  const orders =
    activeTab === "fresh" ? freshOrders : reLoadoutOrders;

  const filteredOrders = orders.filter((order) =>
    [
      order.awb,
      order.customerName,
      order.destination,
      order.riderName,
    ].some((value) =>
      value.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="flex h-[calc(100dvh-100px)] min-h-0 flex-col overflow-hidden bg-[#F7F8FA] p-3 text-slate-900 dark:bg-neutral-950 dark:text-white sm:p-5">
      {/* Header */}
      <div className="mb-4 shrink-0">
        <h1 className="text-xl font-bold sm:text-2xl">
          DC Loadout
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage fresh and repeat delivery loadouts.
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        {/* Tabs */}
        <div className="flex shrink-0 border-b border-slate-200 px-3 pt-3 dark:border-neutral-800 sm:px-5">
          <button
            type="button"
            onClick={() => {
              setActiveTab("fresh");
              setSearch("");
            }}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold ${
              activeTab === "fresh"
                ? "border-[#0446DB] text-[#0446DB]"
                : "border-transparent text-slate-500"
            }`}
          >
            <Package size={17} />
            Fresh Loadout
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
              {freshOrders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("reloadout");
              setSearch("");
            }}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold ${
              activeTab === "reloadout"
                ? "border-[#0446DB] text-[#0446DB]"
                : "border-transparent text-slate-500"
            }`}
          >
            <RotateCcw size={17} />
            Re-Loadout
            <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs text-orange-700">
              {reLoadoutOrders.length}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="shrink-0 border-b border-slate-100 p-3 dark:border-neutral-800 sm:p-4">
          <div className="relative max-w-sm">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              placeholder="Search AWB, customer, rider..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>
        </div>

        {/* Table */}
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase text-slate-500 dark:bg-neutral-800">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">AWB Number</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">Rider</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50 dark:hover:bg-neutral-800/50"
                >
                  <td className="px-4 py-4 font-medium">
                    #{order.id}
                  </td>
                  <td className="px-4 py-4 font-semibold text-[#0446DB]">
                    {order.awb}
                  </td>
                  <td className="px-4 py-4">
                    {order.customerName}
                  </td>
                  <td className="px-4 py-4">
                    {order.destination}
                  </td>
                  <td className="px-4 py-4">
                    {order.riderName}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        order.status === "Pending"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-orange-50 text-orange-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-14 text-center text-slate-500"
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-neutral-800">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>
    </div>
  );
};

export default DcLoadout;
