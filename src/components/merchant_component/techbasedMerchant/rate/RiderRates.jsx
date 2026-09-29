import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import AxiosInstance from "@/Helper/axiosInstance";
import GlassSurface from "../../../UiComponents/GlassSurface";

const baseURL = import.meta.env.VITE_BASE_URL;

const RiderRates = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const [selectedRates, setSelectedRates] = useState([]);

  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    rateId: null,
    rateName: "",
  });

  const [editModal, setEditModal] = useState({
    isOpen: false,
    rate: null,
  });

  const [formData, setFormData] = useState({
    rate_id: "",
    rateType: "",
    rate: "",
    orderMode: "",
  });

  // =========================================================
  // VALUES
  // =========================================================

  const rateValues = [
    {
      value: "SDD",
      label: "Same Day Delivery",
    },
    {
      value: "NDD",
      label: "Next Day Delivery",
    },
  ];

  const rateTypeValues = [
    {
      value: "perorder",
      label: "Per Order",
    },
    {
      value: "perkms",
      label: "Per Kilometer",
    },
  ];

  // =========================================================
  // GET RATES
  // =========================================================

  const getRates = async () => {
    try {
      setLoading(true);
      const res = await AxiosInstance.get(
        "/api/tech-merchant/getMerchantRates",
      );

      setRates(res?.data?.rates || []);
      setError("");
    } catch (error) {
      console.error("Error fetching rates:", error);

      const message =
        error?.response?.data?.message ||
        "Failed to load rider rates. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRates();
  }, []);

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // OPEN EDIT
  // =========================================================

  const handleEdit = (rate) => {
    setFormData({
      rate_id: rate?.id || "",
      rateType: rate?.rate_type || "",
      rate: rate?.rate ?? "",
      orderMode: rate?.order_mode || "",
    });

    setEditModal({
      isOpen: true,
      rate,
    });
  };

  const closeEditModal = () => {
    if (actionLoading) return;

    setEditModal({
      isOpen: false,
      rate: null,
    });

    setFormData({
      rate_id: "",
      rateType: "",
      rate: "",
      orderMode: "",
    });
  };

  // =========================================================
  // UPDATE RATE
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editModal?.rate?.id) {
      toast.error("Rate ID not found.");
      return;
    }

    if (!formData.rateType) {
      toast.error("Please select rate type.");
      return;
    }

    if (
      formData.rate === "" ||
      formData.rate === null ||
      Number.isNaN(Number(formData.rate))
    ) {
      toast.error("Please enter valid rate amount.");
      return;
    }

    if (Number(formData.rate) < 0) {
      toast.error("Rate cannot be negative.");
      return;
    }

    if (!formData.orderMode) {
      toast.error("Please select order mode.");
      return;
    }

    try {
      setActionLoading(true);

      const payload = {
        rate_id: editModal.rate.id,
        rate_type: formData.rateType,
        rate: parseFloat(formData.rate),
        order_mode: formData.orderMode,
      };

      const res = await AxiosInstance.put(
        "/api/tech-merchant/updateMerchantRate",
        payload,
      );

      if (res?.data?.success) {
        toast.success(res?.data?.message || "Rider rate updated successfully");

        closeEditModal();

        await getRates();
      } else {
        toast.error(res?.data?.message || "Failed to update rider rate");
      }
    } catch (err) {
      console.error("Update rate error:", err);

      toast.error(
        err?.response?.data?.message || "Failed to update rider rate",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = (rateId, rateName) => {
    setDeleteModal({
      isOpen: true,
      rateId,
      rateName,
    });
  };

  const closeDeleteModal = () => {
    if (actionLoading) return;

    setDeleteModal({
      isOpen: false,
      rateId: null,
      rateName: "",
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal?.rateId) return;

    try {
      setActionLoading(true);

      // Bulk Delete
      if (deleteModal.rateId === "bulk") {
        await Promise.all(
          selectedRates.map((rateId) =>
            AxiosInstance.delete("/api/tech-merchant/deleteMerchantRate", {
              data: {
                rate_id: rateId,
              },
            }),
          ),
        );

        toast.success(`${selectedRates.length} rate(s) deleted successfully`);

        setSelectedRates([]);
      } else {
        // Single Delete
        const res = await AxiosInstance.delete(
          "/api/tech-merchant/deleteMerchantRate",
          {
            data: {
              rate_id: deleteModal.rateId,
            },
          },
        );

        toast.success(res?.data?.message || "Rate deleted successfully");
      }

      // Close delete modal
      setDeleteModal({
        isOpen: false,
        rateId: null,
        rateName: "",
      });

      setError("");

      // Refresh rates
      await getRates();
    } catch (error) {
      console.error("Error deleting rate:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete rate. Please try again.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // BULK DELETE
  // =========================================================

  const handleBulkDelete = () => {
    if (selectedRates.length === 0) return;

    const rateNames = rates
      .filter((rate) => selectedRates.includes(rate.id))
      .map((rate) => rate.rider_name || "All Riders")
      .join(", ");

    setDeleteModal({
      isOpen: true,
      rateId: "bulk",
      rateName: rateNames,
    });
  };

  // =========================================================
  // CHECKBOX
  // =========================================================

  const handleSelectRate = (rateId) => {
    setSelectedRates((prev) => {
      if (prev.includes(rateId)) {
        return prev.filter((id) => id !== rateId);
      }

      return [...prev, rateId];
    });
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    const value = Number(amount);

    if (Number.isNaN(value)) {
      return "₹0.00";
    }

    return `₹${value.toFixed(2)}`;
  };

  // =========================================================
  // BADGES
  // =========================================================

  const getRateTypeBadge = (type) => {
    const config = {
      perorder: {
        className:
          "bg-[#0446DB]/10 text-[#0446DB] dark:bg-[#0446DB]/20 dark:text-blue-300",
        label: "Per Order",
      },

      perkms: {
        className:
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
        label: "Per KM",
      },
    };

    const cfg = config[type] || {
      className:
        "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
      label: type || "-",
    };

    return (
      <span
        className={`
          inline-flex
          items-center
          whitespace-nowrap
          rounded-md
          px-2
          py-1
          text-xs
          font-semibold
          ${cfg.className}
        `}
      >
        {cfg.label}
      </span>
    );
  };

  const getModeBadge = (mode) => {
    const config = {
      SDD: {
        className:
          "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
        label: "Same Day",
      },

      NDD: {
        className:
          "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
        label: "Next Day",
      },

      HLD: {
        className:
          "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400",
        label: "HLD",
      },
    };

    const cfg = config[mode] || {
      className:
        "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
      label: mode || "-",
    };

    return (
      <span
        className={`
          inline-flex
          items-center
          whitespace-nowrap
          rounded-md
          px-2
          py-1
          text-xs
          font-semibold
          ${cfg.className}
        `}
      >
        {cfg.label}
      </span>
    );
  };

  const getRateForBadge = (rateFor, riderName) => {
    if (rateFor === "all") {
      return (
        <div className="flex flex-col">
          <span className="inline-flex w-fit items-center rounded-md bg-[#0446DB]/10 px-2 py-1 text-xs font-semibold text-[#0446DB] dark:bg-[#0446DB]/20 dark:text-blue-300">
            All Riders
          </span>
        </div>
      );
    }

    return (
      <div className="flex min-w-0 flex-col gap-1">
        <span className="inline-flex w-fit items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-semibold text-pink-700 dark:bg-pink-500/10 dark:text-pink-400">
          Individual
        </span>

        {riderName && (
          <span
            title={riderName}
            className="max-w-[160px] truncate text-xs text-neutral-500 dark:text-neutral-400"
          >
            {riderName}
          </span>
        )}
      </div>
    );
  };

  // =========================================================
  // FILTER
  // =========================================================

  const filteredRates = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return rates.filter((rate) => {
      const matchesSearch =
        !search ||
        rate?.rider_name?.toLowerCase().includes(search) ||
        rate?.rate?.toString().includes(search) ||
        rate?.rate_type?.toLowerCase().includes(search) ||
        rate?.order_mode?.toLowerCase().includes(search) ||
        rate?.id?.toString().includes(search);

      const matchesFilter =
        selectedFilter === "all" ||
        (selectedFilter === "individual" && rate?.rate_for === "individual") ||
        (selectedFilter === "allRiders" && rate?.rate_for === "all");

      return matchesSearch && matchesFilter;
    });
  }, [rates, searchTerm, selectedFilter]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRates.length / itemsPerPage),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentRates = filteredRates.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) {
      return;
    }

    setCurrentPage(pageNumber);
  };

  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  // =========================================================
  // LOADER
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] w-full items-center justify-center bg-[#F8FAFC] dark:bg-neutral-900">
        <div className="text-center">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-[#0446DB]" />

          <p className="mt-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Loading rider rates...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
      {/* =====================================================
          HEADER
      ====================================================== */}


      <div className="text-gray-700 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto px-3 py-5 sm:px-4 lg:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl dark:text-white">
                Rider Rate Management
              </h1>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm dark:text-neutral-400">
                Manage and monitor your rider rates and delivery charges
              </p>
            </div>

            <Link
              to="/techbased_merchant/rider/rate"
              className="w-full shrink-0 sm:w-auto"
            >
              <button
                type="button"
                className="flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-4 text-sm font-semibold text-white shadow-sm transition-all  sm:w-auto dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
              >
                <Plus className="h-4 w-4" />
                Add New Rate
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================
          BODY
      ====================================================== */}

      <div className="mx-auto w-full px-3 py-5 sm:px-4 lg:px-6">
        {/* ERROR */}

        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-sm border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/20">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

            <p className="flex-1 text-sm text-red-700 dark:text-red-300">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-500 transition-colors hover:text-red-700"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* =================================================
            SEARCH / FILTER
        ================================================== */}

        <div className="mb-4 rounded-sm border border-neutral-200 bg-white p-3 shadow-sm sm:p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* SEARCH */}

            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

              <input
                type="text"
                placeholder="Search rates..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 w-full rounded-sm border border-neutral-200 bg-white pl-9 pr-3 text-sm text-neutral-700 outline-none transition-all placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
              />
            </div>

            {/* FILTER */}

            <div className="relative w-full sm:w-[190px]">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

              <select
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 w-full cursor-pointer appearance-none rounded-sm border border-neutral-200 bg-white pl-9 pr-8 text-sm text-neutral-700 outline-none transition-all focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              >
                <option value="all">All Types</option>
                <option value="individual">Individual</option>
                <option value="allRiders">All Riders</option>
              </select>

              <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-neutral-400" />
            </div>

            {/* BULK DELETE */}

            {selectedRates.length > 0 && (
              <button
                type="button"
                onClick={handleBulkDelete}
                className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-sm bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete ({selectedRates.length})
              </button>
            )}
          </div>
        </div>

        {/* =================================================
            TABLE
            Same table on MOBILE + DESKTOP
        ================================================== */}

        <div className="w-full overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="w-full overflow-x-auto overscroll-x-contain">
            <table className="w-full min-w-[900px]">
              {/* TABLE HEADER */}

              <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800">
                <tr>
                  {/* CHECKBOX */}

                  <th className="w-[48px] px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        currentRates.length > 0 &&
                        currentRates.every((rate) =>
                          selectedRates.includes(rate.id),
                        )
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const currentIds = currentRates.map(
                            (rate) => rate.id,
                          );

                          setSelectedRates((prev) => [
                            ...new Set([...prev, ...currentIds]),
                          ]);
                        } else {
                          const currentIds = currentRates.map(
                            (rate) => rate.id,
                          );

                          setSelectedRates((prev) =>
                            prev.filter((id) => !currentIds.includes(id)),
                          );
                        }
                      }}
                      className="h-4 w-4 cursor-pointer accent-[#0446DB]"
                    />
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Rider / Rate For
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Rate Details
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Order Mode
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Amount
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Created
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* TABLE BODY */}

              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {loading ? (
                  <>
                    <tr>
                      <td colSpan={10} className="h-[200px] w-full p-0">
                        <div className="flex h-full w-full items-center justify-center">
                          <div className="flex flex-col items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin " />

                            <p className="mt-2 text-sm font-medium text-gray-600 dark:text-neutral-300">
                              Loading pricing...
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </>
                ) : currentRates.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                          <Users className="h-5 w-5 text-neutral-400" />
                        </div>

                        <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                          No rates found
                        </p>

                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
                          {searchTerm
                            ? "Try adjusting your search"
                            : "Add your first rider rate"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentRates.map((rate) => {
                    const selected = selectedRates.includes(rate.id);

                    return (
                      <tr
                        key={rate.id}
                        className={`
                          transition-colors

                          ${
                            selected
                              ? `
                                bg-[#0446DB]/5
                                dark:bg-[#0446DB]/10
                              `
                              : `
                                bg-white
                                hover:bg-neutral-50

                                dark:bg-neutral-900
                                dark:hover:bg-neutral-800/60
                              `
                          }
                        `}
                      >
                        {/* CHECKBOX */}

                        <td className="px-4 py-3.5">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => handleSelectRate(rate.id)}
                            className="h-4 w-4 cursor-pointer accent-[#0446DB]"
                          />
                        </td>

                        {/* RIDER */}

                        <td className="whitespace-nowrap px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-[#0446DB]/10 text-[#0446DB] dark:bg-[#0446DB]/20 dark:text-blue-300">
                              <Users className="h-4 w-4" />
                            </div>

                            {getRateForBadge(rate.rate_for, rate.rider_name)}
                          </div>
                        </td>

                        {/* RATE TYPE */}

                        <td className="whitespace-nowrap px-4 py-3.5">
                          <div className="flex flex-col items-start gap-1.5">
                            {getRateTypeBadge(rate.rate_type)}

                            <span className="text-xs text-neutral-400 dark:text-neutral-500">
                              ID: {rate.id}
                            </span>
                          </div>
                        </td>

                        {/* ORDER MODE */}

                        <td className="whitespace-nowrap px-4 py-3.5">
                          {getModeBadge(rate.order_mode)}
                        </td>

                        {/* AMOUNT */}

                        <td className="whitespace-nowrap px-4 py-3.5">
                          <p className="text-sm font-bold text-neutral-900 dark:text-white">
                            {formatCurrency(rate.rate)}
                          </p>

                          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-500">
                            {rate.rate_type === "perkms"
                              ? "per kilometer"
                              : "per order"}
                          </p>
                        </td>

                        {/* CREATED */}

                        <td className="whitespace-nowrap px-4 py-3.5">
                          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                            {formatDate(rate.created_at)}
                          </p>

                          <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500">
                            Updated:{" "}
                            {rate.updated_at
                              ? new Date(rate.updated_at).toLocaleDateString()
                              : "-"}
                          </p>
                        </td>

                        {/* ACTION */}

                        <td className="whitespace-nowrap px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleEdit(rate)}
                              title="Edit rate"
                              className="flex h-8 w-8 items-center justify-center rounded-md text-[#0446DB] transition-colors hover:bg-[#0446DB]/10 dark:text-blue-300 dark:hover:bg-[#0446DB]/20"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  rate.id,
                                  rate.rider_name || "All Riders",
                                )
                              }
                              title="Delete rate"
                              className="flex h-8 w-8 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/40"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile scroll helper */}

          <div className="border-t border-neutral-100 px-3 py-2 text-center text-[11px] text-neutral-400 md:hidden dark:border-neutral-800 dark:text-neutral-500">
            Swipe horizontally to view all columns
          </div>
        </div>

        {/* =================================================
            PAGINATION
        ================================================== */}

        {filteredRates.length > 0 && (
          <div className="mt-4 flex flex-col gap-3 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between dark:text-neutral-400">
            <div>
              Showing{" "}
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, filteredRates.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                {filteredRates.length}
              </span>{" "}
              rates
            </div>

            <div className="flex items-center gap-1.5">
              {/* PREVIOUS */}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-9 items-center justify-center gap-1 rounded-sm border border-neutral-200 bg-white px-2.5 text-sm font-medium text-neutral-600 transition-all hover:border-[#0446DB] hover:text-[#0446DB] disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-[#0446DB] dark:hover:text-blue-300"
              >
                <ChevronLeft className="h-4 w-4" />

                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* PAGE NUMBERS */}

              <div className="flex items-center gap-1">
                {getVisiblePages().map((pageNumber) => (
                  <button
                    type="button"
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-sm
                        text-sm
                        font-semibold
                        transition-all

                        ${
                          currentPage === pageNumber
                            ? `
                              bg-[#0446DB]
                              text-white
                              shadow-sm
                            `
                            : `
                              border
                              border-neutral-200
                              bg-white
                              text-neutral-600

                              hover:border-[#0446DB]
                              hover:text-[#0446DB]

                              dark:border-neutral-700
                              dark:bg-neutral-900
                              dark:text-neutral-300
                            `
                        }
                      `}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>

              {/* NEXT */}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-9 items-center justify-center gap-1 rounded-sm border border-neutral-200 bg-white px-2.5 text-sm font-medium text-neutral-600 transition-all hover:border-[#0446DB] hover:text-[#0446DB] disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-[#0446DB] dark:hover:text-blue-300"
              >
                <span className="hidden sm:inline">Next</span>

                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          DELETE MODAL
      ====================================================== */}

      {deleteModal.isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !actionLoading) {
              closeDeleteModal();
            }
          }}
        >
          <div className="w-full max-w-md rounded-sm border border-neutral-200 bg-white p-5 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900 sm:p-6">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
                <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                  Delete Rate
                </h3>

                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              Are you sure you want to delete{" "}
              {deleteModal.rateId === "bulk"
                ? `${selectedRates.length} selected rate(s)`
                : `rate for "${deleteModal.rateName}"`}
              ?
            </p>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={actionLoading}
                className="h-10 rounded-sm border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={actionLoading}
                className="flex h-10 items-center justify-center gap-2 rounded-sm bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          EDIT MODAL
      ====================================================== */}

      {editModal.isOpen && editModal.rate && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-[2px] sm:p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !actionLoading) {
              closeEditModal();
            }
          }}
        >
          <div className="my-auto max-h-[calc(100vh-24px)] w-full max-w-lg overflow-y-auto rounded-sm border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-5">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Edit Rider Rate
                </h3>

                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  Update rate details and delivery mode
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={actionLoading}
                className="flex h-9 w-9 items-center justify-center rounded-sm text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-5">
              {/* RATE TYPE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                  Rate Type <span className="text-red-500">*</span>
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {rateTypeValues.map((rt) => {
                    const selected = formData.rateType === rt.value;

                    return (
                      <button
                        key={rt.value}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            rateType: rt.value,

                            // Per KM always uses Turant.
                            orderMode:
                              rt.value === "perkms"
                                ? "HLD"
                                : prev.orderMode === "HLD"
                                  ? ""
                                  : prev.orderMode,
                          }));
                        }}
                        className={`
                          rounded-sm
                          border
                          p-3
                          text-left
                          transition-all

                          ${
                            selected
                              ? `
                                border-[#0446DB]
                                bg-[#0446DB]/5
                                ring-1
                                ring-[#0446DB]

                                dark:bg-[#0446DB]/10
                              `
                              : `
                                border-neutral-200
                                bg-white

                                hover:border-[#0446DB]/50

                                dark:border-neutral-700
                                dark:bg-neutral-800
                                dark:hover:border-[#0446DB]
                              `
                          }
                        `}
                      >
                        <p
                          className={`
                            text-sm
                            font-semibold

                            ${
                              selected
                                ? "text-[#0446DB] dark:text-blue-300"
                                : "text-neutral-700 dark:text-neutral-200"
                            }
                          `}
                        >
                          {rt.label}
                        </p>

                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                          {rt.value === "perorder"
                            ? "Fixed charge per order"
                            : "Charge based on distance"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RATE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                  Rate Amount <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="rate"
                    value={formData.rate}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="Enter rate amount"
                    required
                    className="h-11 w-full rounded-sm border border-neutral-200 bg-white pl-8 pr-3 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
                  />
                </div>

                <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                  {formData.rateType === "perorder"
                    ? "Amount charged per order"
                    : formData.rateType === "perkms"
                      ? "Amount charged per kilometer"
                      : "Enter the rider rate amount"}
                </p>
              </div>

              {/* ORDER MODE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                  Order Mode <span className="text-red-500">*</span>
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {formData.rateType === "perorder" &&
                    rateValues.map((mode) => {
                      const selected = formData.orderMode === mode.value;

                      return (
                        <button
                          key={mode.value}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              orderMode: mode.value,
                            }))
                          }
                          className={`
                            rounded-sm
                            border
                            p-3
                            text-left
                            transition-all

                            ${
                              selected
                                ? `
                                  border-[#0446DB]
                                  bg-[#0446DB]/5
                                  ring-1
                                  ring-[#0446DB]

                                  dark:bg-[#0446DB]/10
                                `
                                : `
                                  border-neutral-200
                                  bg-white

                                  hover:border-[#0446DB]/50

                                  dark:border-neutral-700
                                  dark:bg-neutral-800
                                  dark:hover:border-[#0446DB]
                                `
                            }
                          `}
                        >
                          <p
                            className={`
                              text-sm
                              font-semibold

                              ${
                                selected
                                  ? "text-[#0446DB] dark:text-blue-300"
                                  : "text-neutral-700 dark:text-neutral-200"
                              }
                            `}
                          >
                            {mode.label}
                          </p>
                        </button>
                      );
                    })}

                  {formData.rateType === "perkms" && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          orderMode: "HLD",
                        }))
                      }
                      className={`
                        rounded-sm
                        border
                        p-3
                        text-left
                        transition-all

                        ${
                          formData.orderMode === "HLD"
                            ? `
                              border-[#0446DB]
                              bg-[#0446DB]/5
                              ring-1
                              ring-[#0446DB]

                              dark:bg-[#0446DB]/10
                            `
                            : `
                              border-neutral-200
                              bg-white

                              hover:border-[#0446DB]/50

                              dark:border-neutral-700
                              dark:bg-neutral-800
                            `
                        }
                      `}
                    >
                      <p
                        className={`
                          text-sm
                          font-semibold

                          ${
                            formData.orderMode === "HLD"
                              ? "text-[#0446DB] dark:text-blue-300"
                              : "text-neutral-700 dark:text-neutral-200"
                          }
                        `}
                      >
                        HLD
                      </p>
                    </button>
                  )}
                </div>
              </div>

              {/* ACTION */}

              <div className="flex flex-col-reverse gap-2 border-t border-neutral-100 pt-5 sm:flex-row sm:justify-end dark:border-neutral-800">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={actionLoading}
                  className="h-10 rounded-sm border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex h-10 items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0339B5] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4" />
                      Update Rate
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderRates;
