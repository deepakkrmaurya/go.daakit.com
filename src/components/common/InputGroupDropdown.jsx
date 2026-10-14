
"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Search,
  ChevronDown,
  Package,
  Hash,
  X,
  Loader2,
  Check,
  Inbox,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

const baseURL = import.meta.env.VITE_BASE_URL;

// Replace with your actual search API endpoint
const SEARCH_API = "/api/orders";

const searchOptions = [
  {
    label: "AWB Number",
    value: "awb_number",
    icon: Package,
  },
  {
    label: "Order ID",
    value: "order_id",
    icon: Hash,
  },
];

export default function OrderSearch() {
  const [searchType, setSearchType] = useState("awb_number");
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const selectedOption =
    searchOptions.find(
      (item) => item.value === searchType
    ) || searchOptions[0];

  const SelectedIcon = selectedOption.icon;

  // Validate search input
  const validateSearch = (value) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return "Please enter a search value";
    }

    if (trimmed.length > 100) {
      return "Maximum 100 characters allowed";
    }

    if (searchType === "order_id") {
      if (!/^\d+$/.test(trimmed)) {
        return "Order ID must contain numbers only";
      }
    }

    if (searchType === "awb_number") {
      if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
        return "Invalid AWB Number";
      }
    }

    return "";
  };

  // Input change
  const handleInputChange = (e) => {
    const value = e.target.value;

    if (value.length > 100) return;

    setSearchValue(value);
    setError("");
  };

  // Fetch orders API
  const fetchOrders = async (params) => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Session expired. Please login again.");
      }

      const res = await axios.get(
        `${baseURL}${SEARCH_API}`,
        {
          params: {
            ...params,
            page: 1,
            limit: 20,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success === false) {
        throw new Error(
          res.data?.message || "Failed to fetch orders"
        );
      }

      const responseData = res.data?.data;

      // Supports common API response structures
      const records = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.records)
        ? responseData.records
        : Array.isArray(responseData?.orders)
        ? responseData.orders
        : Array.isArray(res.data?.orders)
        ? res.data.orders
        : [];

      setOrders(records);
      setHasSearched(true);

      if (records.length === 0) {
        toast("No orders found");
      } else {
        toast.success(
          `${records.length} order(s) found`
        );
      }
    } catch (err) {
      setOrders([]);
      setHasSearched(false);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to search orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // Search submit
  const handleSearch = async (e) => {
    e.preventDefault();

    if (loading) return;

    const value = searchValue.trim();
    const validationError = validateSearch(value);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    await fetchOrders({
      [searchType]: value,
    });
  };

  // Clear search
  const handleClear = () => {
    if (loading) return;

    setSearchValue("");
    setError("");
    setOrders([]);
    setHasSearched(false);
  };

  // Change search type
  const handleSearchTypeChange = (type) => {
    if (loading) return;

    setSearchType(type);
    setSearchValue("");
    setError("");
    setOrders([]);
    setHasSearched(false);
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Input */}
      <form
        onSubmit={handleSearch}
        className="w-full max-w-xl"
      >
        <InputGroup className="h-10 rounded-sm border border-neutral-200 bg-white shadow-sm transition-all focus-within:border-[#0446DB] focus-within:ring-2 focus-within:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-900">
          {/* Search Type Dropdown */}
          <InputGroupAddon align="inline-start">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton
                  type="button"
                  variant="ghost"
                 
                  className="flex h-8 shrink-0 items-center gap-2 rounded-sm px-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800 disabled:opacity-100"
                >
                  <SelectedIcon className="h-4 w-4 text-[#0446DB] dark:text-blue-400" />

                  <span className="whitespace-nowrap">
                    {selectedOption.label}
                  </span>

                  <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
                </InputGroupButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                sideOffset={8}
                className="w-48 rounded-sm border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
              >
                {searchOptions.map((item) => {
                  const Icon = item.icon;
                  const isSelected =
                    searchType === item.value;

                  return (
                    <DropdownMenuItem
                      key={item.value}
                      onSelect={() =>
                        handleSearchTypeChange(item.value)
                      }
                      className="flex cursor-pointer items-center justify-between gap-2 rounded-sm px-3 py-2.5 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-neutral-500" />
                        <span>{item.label}</span>
                      </div>

                      {isSelected && (
                        <Check className="h-4 w-4 text-[#0446DB]" />
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </InputGroupAddon>

          {/* Divider */}
          <div className="h-5 w-px shrink-0 bg-neutral-200 dark:bg-neutral-700" />

          {/* Search Input */}
          <InputGroupInput
            type="text"
            value={searchValue}
            onChange={handleInputChange}
            placeholder={`Search by ${selectedOption.label}...`}
            maxLength={100}
            autoComplete="off"
            spellCheck={false}
            aria-label={`Search by ${selectedOption.label}`}
            aria-invalid={!!error}
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-neutral-800 placeholder:text-neutral-400 dark:text-white"
          />

          {/* Clear Button */}
          {searchValue && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                variant="ghost"
                size="icon-xs"
                disabled={loading}
                onClick={handleClear}
                aria-label="Clear search"
                className="h-7 w-7 rounded-sm text-neutral-400 hover:text-neutral-700 disabled:opacity-100 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </InputGroupButton>
            </InputGroupAddon>
          )}

          {/* Search Button */}
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="submit"
              disabled={loading || !searchValue.trim()}
              className="mr-1 flex h-8 shrink-0 items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-3 text-xs font-medium text-white transition-colors hover:bg-blue-700 hover:text-white disabled:!cursor-not-allowed disabled:!bg-[#0446DB] disabled:!text-white disabled:!opacity-100"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        {error && (
          <p
            role="alert"
            className="mt-1.5 text-xs font-medium text-red-500"
          >
            {error}
          </p>
        )}
      </form>

      {/* Search Results */}
      {hasSearched && (
        <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
            <h3 className="text-sm font-semibold text-neutral-800 dark:text-white">
              Search Results
            </h3>

            <span className="text-xs text-neutral-500">
              {orders.length} orders found
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">AWB Number</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr
                      key={order.id ?? order.order_id ?? index}
                      className="text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800/50"
                    >
                      <td className="px-4 py-3">
                        {index + 1}
                      </td>

                      <td className="px-4 py-3 font-medium">
                        {order.id ?? order.order_id ?? "—"}
                      </td>

                      <td className="px-4 py-3">
                        {order.awb_number ??
                          order.tpc_awb_number ??
                          "—"}
                      </td>

                      <td className="px-4 py-3">
                        {order.order_status ??
                          order.status ??
                          "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-10 text-center"
                    >
                      <Inbox className="mx-auto mb-2 h-7 w-7 text-neutral-400" />
                      <p className="text-sm text-neutral-500">
                        No orders found
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
