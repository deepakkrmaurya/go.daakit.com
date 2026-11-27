
import { useEffect, useMemo, useState } from "react";



import Select from "react-select";

import { toast } from "react-hot-toast";

import { Link } from "react-router-dom";

import {
  Building2,
  Search,
  MapPin,
  Mail,
  Phone,
  User,
  Eye,
  X,
  Hash,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Plus,
  CircleCheck,
  CircleX,
  MapPinned,
  Pencil,
  Save,
  LockKeyhole,
  Loader2,
} from "lucide-react";
import AxiosInstance from "@/Helper/axiosInstance";

const baseURL = String(import.meta.env.VITE_BASE_URL || "").replace(/\/+$/, "");

const DC_LIST_API = `/api/dc/list`;

const DC_UPDATE_API = (dcId) => `/api/dc/updateDc/${encodeURIComponent(dcId)}`;

const statusOptions = [
  { value: "all", label: "All Status" },

  { value: "active", label: "Active" },

  { value: "inactive", label: "Inactive" },
];

const editableFields = [
  { key: "dc_name", label: "DC Name", required: true },

  { key: "dc_code", label: "DC Code", required: true },

  // { key: "username", label: "Username" },

  { key: "email", label: "Email Address", type: "email", required: true },

  { key: "phone", label: "Phone Number", type: "tel" },

  { key: "city", label: "City", required: true },

  { key: "state", label: "State" },

  { key: "pincode", label: "Pincode" },

  { key: "address", label: "Complete Address", textarea: true },

  { key: "password", label: "New Password (optional)", type: "password" },
];

const blankEdit = () => Object.fromEntries(editableFields.map(({ key }) => [key, ""]));

const getId = (item) => item?.dc_id ?? item?.id;

const isActive = (item) => Number(item?.is_active ?? item?.status) === 1;

const labelValue = (value) =>
  value === null || value === undefined || value === "" ? "—" : String(value);

const inputClass =
  "mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white";

const buttonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0446DB] px-4 text-sm font-semibold text-white transition hover:bg-[#0339b5] disabled:cursor-not-allowed disabled:opacity-50";

const authConfig = () => {
  const token = localStorage.getItem("merchantToken") || localStorage.getItem("token");

  return {
    headers: {
      "Content-Type": "application/json",

      ...(token ? { Authorization: `Bearer ${token}`, "x-auth-token": token } : {}),
    },
  };
};

function DetailCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 dark:border-neutral-800">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-neutral-800">
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 dark:text-neutral-400">{label}</p>
          <p className="mt-1 break-words text-sm font-semibold text-gray-800 dark:text-neutral-200">
            {labelValue(value)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DistributionCenterListing() {
  const [dcList, setDcList] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState(statusOptions[0]);

  const [selectedDC, setSelectedDC] = useState(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState(blankEdit);

  const [updateLoading, setUpdateLoading] = useState(false);

  const [statusUpdating, setStatusUpdating] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const observer = new MutationObserver(() =>
      setIsDarkMode(document.documentElement.classList.contains("dark")),
    );

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const fetchDCs = async () => {
    try {
      setLoading(true);

      const response = await AxiosInstance.get(DC_LIST_API, authConfig());

      if (response?.data?.success === false)
        throw new Error(response?.data?.message || "Failed to fetch Distribution Centers");

      const payload = response?.data?.data;

      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.dcs)
          ? payload.dcs
          : Array.isArray(response?.data?.dcs)
            ? response.data.dcs
            : [];

      setDcList(list);
    } catch (error) {
      console.error("DC List API Error:", error?.response?.data || error);

      setDcList([]);

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error.message ||
          "Failed to fetch Distribution Centers",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDCs();
  }, []);

  const filteredDCs = useMemo(
    () =>
      dcList.filter((item) => {
        const q = search.trim().toLowerCase();

        const fields = [
          item.dc_name,
          item.dc_code,
          // item.username,
          item.email,
          item.phone,
          item.address,
          item.city,
          item.state,
          item.pincode,
        ];

        const matchesSearch =
          !q ||
          fields.some((value) =>
            String(value ?? "")
              .toLowerCase()
              .includes(q),
          );

        const matchesStatus =
          statusFilter.value === "all" ||
          (statusFilter.value === "active" ? isActive(item) : !isActive(item));

        return matchesSearch && matchesStatus;
      }),
    [dcList, search, statusFilter],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const totalItems = filteredDCs.length;

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginatedDCs = filteredDCs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const showingFrom = totalItems ? (currentPage - 1) * pageSize + 1 : 0;

  const showingTo = Math.min(currentPage * pageSize, totalItems);

  const handleView = (item) => {
    setSelectedDC(item);

    setEditForm(
      Object.fromEntries(
        editableFields.map(({ key }) => [key, key === "password" ? "" : String(item[key] ?? "")]),
      ),
    );

    setIsEditing(false);

    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    if (updateLoading || statusUpdating) return;

    setViewModalOpen(false);

    setSelectedDC(null);

    setIsEditing(false);
  };

  const saveDcDetails = async (event) => {
    event.preventDefault();

    const id = getId(selectedDC);

    if (id === undefined || id === null) return toast.error("DC ID not available");

    for (const { key, label, required } of editableFields) {
      if (required && !editForm[key].trim()) return toast.error(`${label} is required`);
    }

    // Optional fields: when provided, phone must be 10 digits and pincode 6 digits.
    if (editForm.phone.trim() && !/^\d{10}$/.test(editForm.phone.trim())) {
      return toast.error("Phone number must be exactly 10 digits");
    }
    if (editForm.pincode.trim() && !/^\d{6}$/.test(editForm.pincode.trim())) {
      return toast.error("Pincode must be exactly 6 digits");
    }

    if (
      editForm.password &&
      (editForm.password.length < 8 || new TextEncoder().encode(editForm.password).length > 72)
    ) {
      return toast.error("Password must be between 8 and 72 bytes");
    }

    const patch = {
      dc_name: editForm.dc_name.trim(),

      dc_code: editForm.dc_code.trim(),

      // username: editForm.username.trim(),

      phone: editForm.phone.trim() || null,

      email: editForm.email.trim().toLowerCase(),

      address: editForm.address.trim() || null,

      city: editForm.city.trim(),

      state: editForm.state.trim() || null,

      pincode: editForm.pincode.trim() || null,

      ...(editForm.password ? { password: editForm.password } : {}),
    };

    try {
      setUpdateLoading(true);

      const res = await AxiosInstance.patch(DC_UPDATE_API(id), patch, authConfig());

      if (res?.data?.success === false)
        throw new Error(res?.data?.message || "Failed to update Distribution Center");

      const updated = res?.data?.data?.dc ?? res?.data?.dc ?? {};

      const merged = { ...selectedDC, ...patch, ...updated };

      delete merged.password;

      setSelectedDC(merged);

      setDcList((prev) =>
        prev.map((item) => (String(getId(item)) === String(id) ? { ...item, ...merged } : item)),
      );

      setEditForm((prev) => ({ ...prev, password: "" }));

      setIsEditing(false);

      toast.success(res?.data?.message || "Distribution Center updated successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to update Distribution Center",
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  // Status-only request. Backend must explicitly support is_active on this route.
  const toggleDcStatus = async () => {
    if (!selectedDC || statusUpdating || updateLoading) return;
    const id = getId(selectedDC);
    if (id === undefined || id === null) return toast.error("DC ID not available");

    const nextStatus = isActive(selectedDC) ? 0 : 1;
    const action = nextStatus ? "activate" : "deactivate";
    if (!window.confirm(`Are you sure you want to ${action} this Distribution Center?`)) return;

    setStatusUpdating(true);
    try {
      const res = await AxiosInstance.patch(DC_UPDATE_API(id), { is_active: nextStatus }, authConfig());
      if (res?.data?.success === false)
        throw new Error(res?.data?.message || `Failed to ${action} DC`);

      // Verify persisted status rather than showing success for a field ignored by the API.
      const verify = await AxiosInstance.get(DC_LIST_API, authConfig());
      if (verify?.data?.success === false)
        throw new Error(verify?.data?.message || "Unable to verify DC status");
      const data = verify?.data?.data;
      const rows = Array.isArray(data)
        ? data
        : Array.isArray(data?.dcs)
          ? data.dcs
          : Array.isArray(verify?.data?.dcs)
            ? verify.data.dcs
            : [];
      const updated = rows.find((item) => String(getId(item)) === String(id));
      if (!updated || Number(updated.is_active ?? updated.status) !== nextStatus) {
        throw new Error(
          "Status was not changed. Confirm that the updateDc API supports is_active.",
        );
      }

      setDcList(rows);
      setSelectedDC(updated);
      toast.success(`Distribution Center ${nextStatus ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to update DC status");
    } finally {
      setStatusUpdating(false);
    }
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "42px",
      borderRadius: "8px",
      backgroundColor: isDarkMode ? "#171717" : "#ffffff",
      borderColor: state.isFocused ? "#0446DB" : isDarkMode ? "#404040" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(4,70,219,0.10)" : "none",
    }),

    singleValue: (base) => ({ ...base, color: isDarkMode ? "#f5f5f5" : "#111827" }),

    input: (base) => ({ ...base, color: isDarkMode ? "#f5f5f5" : "#111827" }),

    menu: (base) => ({ ...base, zIndex: 999, backgroundColor: isDarkMode ? "#171717" : "#ffffff" }),

    option: (base, state) => ({
      ...base,
      cursor: "pointer",
      color: state.isSelected ? "#ffffff" : isDarkMode ? "#e5e5e5" : "#111827",
      backgroundColor: state.isSelected
        ? "#0446DB"
        : state.isFocused
          ? isDarkMode
            ? "#262626"
            : "#eff6ff"
          : isDarkMode
            ? "#171717"
            : "#ffffff",
    }),
  };

  return (
    <div className="flex h-[calc(100dvh-100px)] min-h-[420px] flex-col overflow-hidden bg-gray-50/40 text-gray-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="z-20 shrink-0 border-b border-gray-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900 md:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0446DB] dark:bg-blue-950/30">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold md:text-2xl">Distribution Centers</h1>
              <p className="mt-0.5 text-sm text-gray-500">
                View and manage all Distribution Centers.
              </p>
            </div>
          </div>

          <Link to="/admin/onboarding/distribution-center" className={buttonClass}>
            <Plus className="h-4 w-4" /> Add Distribution Center
          </Link>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3 md:p-4">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="z-10 flex shrink-0 flex-col gap-3 border-b border-gray-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, code, city, email..."
                className="h-[42px] w-full rounded-lg border border-gray-300 bg-white pl-10 pr-9 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="z-50 min-w-[180px]">
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value || statusOptions[0])}
                  isSearchable={false}
                  styles={selectStyles}
                />
              </div>
              <button
                type="button"
                onClick={fetchDCs}
                disabled={loading}
                title="Refresh"
                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-950"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3">
              <RefreshCw className="h-7 w-7 animate-spin text-[#0446DB]" />
              <p className="text-sm text-gray-500">Loading Distribution Centers...</p>
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
                <table className="w-full min-w-[1150px] text-sm">
                  <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-neutral-800">
                    <tr>
                      {[
                        "Distribution Center",
                        "Code",
                        // "Username",
                        "Contact",
                        "Location",
                        "Status",
                        "Action",
                      ].map((h) => (
                        <th
                          key={h}
                          className="border-b border-gray-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-neutral-700"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDCs.length ? (
                      paginatedDCs.map((item, index) => (
                        <tr
                          key={String(getId(item) ?? index)}
                          className="border-b border-gray-100 hover:bg-gray-50/70 dark:border-neutral-800 dark:hover:bg-neutral-800/40"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB]">
                                <Building2 className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="max-w-[230px] truncate font-semibold">
                                  {labelValue(item.dc_name)}
                                </p>
                                <p className="mt-0.5 text-xs text-gray-400">
                                  ID: {labelValue(getId(item))}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <span className="rounded-md bg-gray-100 px-2.5 py-1 font-mono text-xs font-semibold text-gray-700 dark:bg-neutral-800 dark:text-neutral-300">
                              {labelValue(item.dc_code)}
                            </span>
                          </td>

                          {/* <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <User className="h-3.5 w-3.5 text-gray-400" />
                              {labelValue(item.username)}
                            </div>
                          </td> */}

                          <td className="px-4 py-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs">
                                <Mail className="h-3.5 w-3.5 text-gray-400" />
                                {labelValue(item.email)}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Phone className="h-3.5 w-3.5" />
                                {labelValue(item.phone)}
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-start gap-2">
                              <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                              <div>
                                <p className="font-medium">{labelValue(item.city)}</p>
                                <p className="text-xs text-gray-400">
                                  {labelValue(item.state)}
                                  {item.pincode ? ` • ${item.pincode}` : ""}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            {isActive(item) ? (
                              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                                Active
                              </span>
                            ) : (
                              <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                                Inactive
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() => handleView(item)}
                              title="View / Edit Distribution Center"
                              className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-xs font-semibold text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0446DB]"
                            >
                              <Eye className="h-4 w-4" /> View / Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-16 text-center text-sm text-gray-500">
                          No Distribution Center found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
                <p className="text-xs text-gray-500">
                  Showing {showingFrom} to {showingTo} of {totalItems} Distribution Centers
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-3 text-xs disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>
                  <div className="flex h-9 min-w-[65px] items-center justify-center rounded-lg bg-[#0446DB] px-3 text-xs font-semibold text-white">
                    {currentPage} / {totalPages}
                  </div>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-3 text-xs disabled:opacity-40"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {viewModalOpen && selectedDC && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeViewModal();
          }}
        >
          <div
            role="dialog"
            _aria-modal_="true"
            className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex shrink-0 items-start justify-between border-b border-gray-200 px-5 py-4 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0446DB]">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">{labelValue(selectedDC.dc_name)}</h2>
                  <p className="text-xs text-gray-500">{labelValue(selectedDC.dc_code)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeViewModal}
                disabled={updateLoading || statusUpdating}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 disabled:opacity-40"
                _aria-label_="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <div className="mb-5 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
                <span className="text-sm font-semibold">Current Status</span>
                {isActive(selectedDC) ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
                    <CircleCheck className="h-4 w-4" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700">
                    <CircleX className="h-4 w-4" /> Inactive
                  </span>
                )}
              </div>

              {!isEditing ? (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <DetailCard icon={Hash} label="DC ID" value={getId(selectedDC)} />
                    <DetailCard icon={Hash} label="DC Code" value={selectedDC.dc_code} />
                    {/* <DetailCard icon={User} label="Username" value={selectedDC.username} /> */}
                    <DetailCard icon={Mail} label="Email Address" value={selectedDC.email} />
                    <DetailCard icon={Phone} label="Phone Number" value={selectedDC.phone} />
                    <DetailCard icon={MapPinned} label="City / Town" value={selectedDC.city} />
                    <DetailCard icon={MapPin} label="State" value={selectedDC.state} />
                    <DetailCard icon={Hash} label="Pincode" value={selectedDC.pincode} />
                  </div>
                  <div className="mt-4 rounded-xl border border-gray-200 p-4 dark:border-neutral-800">
                    <p className="text-xs font-medium text-gray-500">Complete Address</p>
                    <p className="mt-1.5 text-sm">{labelValue(selectedDC.address)}</p>
                  </div>
                </>
              ) : (
                <form
                  id="dc-update-form"
                  onSubmit={saveDcDetails}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                >
                  {editableFields.map(({ key, label, type, required, textarea }) => (
                    <label
                      key={key}
                      className={`block text-xs font-medium text-gray-600 dark:text-gray-300 ${textarea ? "sm:col-span-2" : ""}`}
                    >
                      <span>
                        {label}
                        {required ? " *" : ""}
                      </span>
                      {textarea ? (
                        <textarea
                          rows={3}
                          value={editForm[key]}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, [key]: e.target.value }))
                          }
                          className={`${inputClass} min-h-[90px]`}
                        />
                      ) : (
                        <input
                          type={key === "phone" || key === "pincode" ? "text" : type || "text"}
                          inputMode={key === "phone" || key === "pincode" ? "numeric" : undefined}
                          pattern={
                            key === "phone"
                              ? "[0-9]{10}"
                              : key === "pincode"
                                ? "[0-9]{6}"
                                : undefined
                          }
                          maxLength={key === "phone" ? 10 : key === "pincode" ? 6 : undefined}
                          required={required}
                          autoComplete={key === "password" ? "new-password" : "off"}
                          value={editForm[key]}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              [key]:
                                key === "phone" || key === "pincode"
                                  ? e.target.value
                                      .replace(/\D/g, "")
                                      .slice(0, key === "phone" ? 10 : 6)
                                  : e.target.value,
                            }))
                          }
                          className={inputClass}
                        />
                      )}
                    </label>
                  ))}
                  <p className="sm:col-span-2 flex items-center gap-2 text-xs text-gray-500">
                    <LockKeyhole className="h-4 w-4" /> Leave password blank to keep the existing
                    password.
                  </p>
                </form>
              )}
            </div>

            <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-gray-200 bg-gray-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-950/50">
              {!isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    disabled={statusUpdating}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-blue-300 px-4 text-sm font-semibold text-[#0446DB] disabled:opacity-50"
                  >
                    <Pencil className="h-4 w-4" /> Edit DC
                  </button>
                  <button
                    type="button"
                    onClick={toggleDcStatus}
                    disabled={statusUpdating || updateLoading}
                    className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold disabled:opacity-50 ${isActive(selectedDC) ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100" : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"}`}
                  >
                    {statusUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isActive(selectedDC) ? (
                      <CircleX className="h-4 w-4" />
                    ) : (
                      <CircleCheck className="h-4 w-4" />
                    )}
                    {statusUpdating
                      ? "Updating..."
                      : isActive(selectedDC)
                        ? "Deactivate"
                        : "Activate"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={updateLoading}
                    onClick={() => setIsEditing(false)}
                    className="h-10 rounded-lg border border-gray-300 px-4 text-sm disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="dc-update-form"
                    disabled={updateLoading}
                    className={buttonClass}
                  >
                    {updateLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {updateLoading ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={closeViewModal}
                disabled={updateLoading || statusUpdating}
                className={buttonClass}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
