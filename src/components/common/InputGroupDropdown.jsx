
"use client";

import { useState, useRef, useEffect } from "react";
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
import AxiosInstance from "../../Helper/axiosInstance";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_BASE_URL;

// Replace with your actual backend endpoint
const SEARCH_API = "/api/orders";

const searchOptions = [
  {
    label: "AWB Number",
    value: "awb_number",
    icon: Package,
  },
  // {
  //   label: "Order ID",
  //   value: "order_id",
  //   icon: Hash,
  // },
];

export default function OrderSearch() {
  const [searchType, setSearchType] = useState("awb_number");
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const requestRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    return () => {
      requestRef.current?.abort();
    };
  }, []);

  const selectedOption =
    searchOptions.find((item) => item.value === searchType) ||
    searchOptions[0];

  const SelectedIcon = selectedOption.icon;
  const trimmedValue = searchValue.trim();

  // -----------------------------
  // Validation
  // -----------------------------
  const validateSearch = (value, type = searchType) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return "Please enter a search value";
    }

    if (trimmed.length > 100) {
      return "Maximum 100 characters allowed";
    }

    if (type === "order_id") {
      if (!/^\d+$/.test(trimmed)) {
        return "Order ID must contain numbers only";
      }
    }

    if (type === "awb_number") {
      if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
        return "AWB Number can contain letters, numbers, hyphens and underscores only";
      }
    }

    return "";
  };

  const validationError = trimmedValue
    ? validateSearch(trimmedValue)
    : "";

  const isSearchDisabled =
    loading || !trimmedValue || !!validationError;

  // -----------------------------
  // Input Change
  // -----------------------------
  const handleInputChange = (e) => {
    const value = e.target.value;

    if (value.length > 100) return;

    setSearchValue(value);
    setError("");
  };

  const navigate = useNavigate()

  // -----------------------------
  // API Search
  // -----------------------------
  const fetchOrders = async (params) => {
    if (requestRef.current) return;

    const controller = new AbortController();
    requestRef.current = controller;

    setLoading(true);
    setError("");
    setHasSearched(false);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Session expired. Please login again.");
      }

      


      const {data} = await AxiosInstance.get(`/api/admin/getAwbCompleteHistory/${params?.awb_number}`)

    
       const {awb_number} = data.data?.order
       navigate(`/admin/order-history?awb_number=${awb_number}`)
       setSearchValue("")

     
    } catch (err) {
      if (axios.isCancel(err)) return;

      setOrders([]);
      setHasSearched(false);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to search orders";

      setError(message);
      toast.error(message);
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null;
        setLoading(false);
      }
    }
  };

  // -----------------------------
  // Search Submit
  // -----------------------------
  const handleSearch = async (e) => {
    e.preventDefault();

    if (loading || requestRef.current) return;

    const value = searchValue.trim();
    const message = validateSearch(value);

    if (message) {
      setError(message);
      return;
    }

    setError("");

    await fetchOrders({
      [searchType]: value,
    });
  };

  // -----------------------------
  // Clear Search
  // -----------------------------
  const handleClear = () => {
    if (loading) return;

    setSearchValue("");
    setError("");
    setOrders([]);
    setHasSearched(false);

    inputRef.current?.focus();
  };

  // -----------------------------
  // Change Search Type
  // -----------------------------
  const handleSearchTypeChange = (type) => {
    if (loading) return;

    setSearchType(type);
    setSearchValue("");
    setError("");
    setOrders([]);
    setHasSearched(false);

    inputRef.current?.focus();
  };

  return (
    <div className="w-full space-y-4">
      {/* ================= SEARCH FORM ================= */}
      <form
        onSubmit={handleSearch}
        className="w-full max-w-xl"
        noValidate
      >
        <InputGroup
          className="
            !h-11 !w-full !rounded-lg
            !border !border-gray-300
            !bg-white shadow-sm
            transition-all duration-200
            hover:!border-blue-300
            focus-within:!border-[#0446DB]
            focus-within:!ring-2
            focus-within:!ring-blue-500/15
            dark:!border-gray-600
            dark:!bg-gray-900
            dark:hover:!border-blue-500
          "
        >
          {/* Search Type Dropdown */}
          <InputGroupAddon align="inline-start">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  disabled={loading}
                  className="
                    flex h-9 shrink-0 items-center
                    gap-2 rounded-md px-3
                    text-sm font-medium
                    !text-gray-800
                    !opacity-100
                    transition-colors
                    hover:!bg-blue-50
                    hover:!text-[#0446DB]
                    dark:!text-gray-200
                    dark:hover:!bg-gray-800
                    disabled:cursor-not-allowed
                  "
                >
                  <SelectedIcon
                    className="
                      h-[17px] w-[17px]
                      shrink-0 text-[#0446DB]
                      dark:text-blue-400
                    "
                  />

                  <span className="whitespace-nowrap">
                    {selectedOption.label}
                  </span>

                  <ChevronDown
                    className="
                      h-4 w-4 shrink-0
                      text-gray-500
                      dark:text-gray-400
                    "
                  />
                </InputGroupButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                sideOffset={8}
                className="
                  z-50 w-48 rounded-lg
                  border border-gray-200
                  bg-white p-1.5 shadow-xl
                  dark:border-gray-700
                  dark:bg-gray-900
                "
              >
                {searchOptions.map((item) => {
                  const Icon = item.icon;
                  const isSelected = searchType === item.value;

                  return (
                    <DropdownMenuItem
                      key={item.value}
                      onSelect={() =>
                        handleSearchTypeChange(item.value)
                      }
                      className="
                        flex cursor-pointer
                        items-center justify-between
                        gap-2 rounded-md
                        px-3 py-2.5 text-sm
                        font-medium
                        text-gray-700
                        focus:bg-blue-50
                        focus:text-[#0446DB]
                        dark:text-gray-200
                        dark:focus:bg-gray-800
                      "
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`h-4 w-4 ${
                            isSelected
                              ? "text-[#0446DB]"
                              : "text-gray-500"
                          }`}
                        />

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
          <div
            className="
              h-6 w-px shrink-0
              bg-gray-300
              dark:bg-gray-700
            "
          />

          {/* Search Input */}
          <InputGroupInput
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={handleInputChange}
            placeholder={`Search by ${selectedOption.label}...`}
            maxLength={100}
            autoComplete="off"
            spellCheck={false}
            aria-label={`Search by ${selectedOption.label}`}
            aria-invalid={!!error || !!validationError}
            className="
              h-full min-w-0 flex-1
              !bg-transparent px-3
              text-sm font-medium
              !text-gray-900
              !opacity-100
              placeholder:!text-gray-500
              focus:!outline-none
              dark:!text-white
              dark:placeholder:!text-gray-400
            "
          />

          {/* Clear Button */}
          {searchValue.length > 0 && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                variant="ghost"
                size="icon-xs"
                disabled={loading}
                onClick={handleClear}
                aria-label="Clear search"
                className="
                  flex h-7 w-7 shrink-0
                  items-center justify-center
                  rounded-md
                  !text-gray-500
                  !opacity-100
                  hover:!bg-gray-100
                  hover:!text-gray-800
                  dark:!text-gray-400
                  dark:hover:!bg-gray-800
                  dark:hover:!text-white
                "
              >
                <X className="h-4 w-4" />
              </InputGroupButton>
            </InputGroupAddon>
          )}

          {/* Search Button */}
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="submit"
              disabled={isSearchDisabled}
              aria-label="Search orders"
              className={`
                mr-1 flex h-9 shrink-0
                items-center justify-center
                gap-2 rounded-md px-4
                text-sm font-semibold
                transition-all duration-200

                ${
                  isSearchDisabled
                    ? `
                      !cursor-not-allowed
                      !bg-blue-50
                      !text-blue-400
                      !opacity-100
                      !shadow-none
                      dark:!bg-blue-950/40
                      dark:!text-blue-400
                    `
                    : `
                      !cursor-pointer
                      !bg-[#0446DB]
                      !text-white
                      !opacity-100
                      shadow-sm
                      hover:!bg-[#0339B5]
                      hover:!text-white
                      hover:shadow-md
                      active:scale-[0.98]
                    `
                }
              `}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}

              <span>
                {loading ? "Searching..." : "Search"}
              </span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        {/* Validation Error */}
        {/* {(error || validationError) && (
          <p
            role="alert"
            className="
              mt-1.5 text-xs
              font-medium text-red-500
            "
          >
            {error || validationError}
          </p>
        )} */}
      </form>

      {/* ================= SEARCH RESULTS ================= */}
      {hasSearched && (
        <div
          className="
            overflow-hidden rounded-lg
            border border-gray-200
            bg-white shadow-sm
            dark:border-gray-700
            dark:bg-gray-900
          "
        >
          {/* Results Header */}
          <div
            className="
              flex items-center
              justify-between gap-3
              border-b border-gray-200
              px-4 py-3
              dark:border-gray-700
            "
          >
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-[#0446DB]" />

              <h3
                className="
                  text-sm font-semibold
                  text-gray-900
                  dark:text-white
                "
              >
                Search Results
              </h3>
            </div>

            <span
              className="
                rounded-full
                bg-blue-50 px-3 py-1
                text-xs font-semibold
                text-[#0446DB]
                dark:bg-blue-950/40
                dark:text-blue-400
              "
            >
              {orders.length} orders found
            </span>
          </div>

          {/* Results Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead
                className="
                  bg-gray-50
                  text-xs font-semibold
                  text-gray-600
                  dark:bg-gray-800
                  dark:text-gray-300
                "
              >
                <tr>
                  <th className="whitespace-nowrap px-4 py-3">
                    #
                  </th>

                  <th className="whitespace-nowrap px-4 py-3">
                    Order ID
                  </th>

                  <th className="whitespace-nowrap px-4 py-3">
                    AWB Number
                  </th>

                  <th className="whitespace-nowrap px-4 py-3">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody
                className="
                  divide-y divide-gray-100
                  dark:divide-gray-800
                "
              >
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr
                      key={order.id ?? order.order_id ?? index}
                      className="
                        text-gray-700
                        transition-colors
                        hover:bg-blue-50/50
                        dark:text-gray-200
                        dark:hover:bg-gray-800/60
                      "
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
                        <span
                          className="
                            inline-flex rounded-full
                            bg-gray-100 px-2.5 py-1
                            text-xs font-medium
                            text-gray-700
                            dark:bg-gray-800
                            dark:text-gray-200
                          "
                        >
                          {order.order_status ??
                            order.status ??
                            "—"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-10 text-center"
                    >
                      <Inbox
                        className="
                          mx-auto mb-2
                          h-8 w-8
                          text-gray-400
                        "
                      />

                      <p className="text-sm text-gray-500">
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
