
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Search,
  RefreshCw,
  Store,
  Users,
  UserCheck,
  UserX,
  FileText,
  KeyRound,
  ExternalLink,
  ShieldCheck,
  Copy,
  Check,
  X,
  Pencil,
  Save,
  Loader2,
  Building2,
  Mail,
  Phone,
  MapPin,
  Landmark,
  Eye,
  EyeOff,
  Upload,
  BadgeCheck,
  CircleAlert,
  WalletCards,
  Hash,
  MapPinned,
  FileCheck2,
  UserRound,
  ChevronRight,
} from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;
const frontendURL = import.meta.env.VITE_FRONTEND_URL;

function MerchantDetails() {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [merchantsData, setMerchantsData] = useState([]);
  const [search, setSearch] = useState("");

  const [popup, setPopup] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [copySuccess, setCopySuccess] = useState(null);

  const [changePasswordPopup, setChangePasswordPopup] = useState(null);

  const [newPassword, setNewPassword] = useState({
    id: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const [actionLoading, setActionLoading] = useState({
    status: null,
    account: null,
    kyc: null,
    password: false,
    save: false,
  });

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // =========================================================
  // FETCH MERCHANTS
  // =========================================================

  const fetchMerchants = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${baseURL}/api/admin/getAllMerchants`,
        {
          headers: authHeaders(),
        },
      );

      setMerchantsData(
        Array.isArray(res?.data?.merchants)
          ? res.data.merchants
          : [],
      );
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error fetching merchants",
      );
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] : value,
    }));
  };

  // =========================================================
  // UPDATE MERCHANT
  // =========================================================

  const handleSave = async (e) => {
    e?.preventDefault();

    if (!formData?.id) return;

    try {
      setActionLoading((prev) => ({
        ...prev,
        save: true,
      }));

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        const value = formData[key];

        if (
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          data.append(key, value);
        }
      });

      const res = await axios.post(
        `${baseURL}/api/admin/updateMerchantInfo/${formData.id}`,
        data,
        {
          headers: {
            ...authHeaders(),
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success(
        res?.data?.message ||
          "Merchant details updated successfully",
      );

      setIsEditing(false);
      setPopup(null);
      setFormData(null);

      await fetchMerchants();
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while saving merchant",
      );
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        save: false,
      }));
    }
  };

  // =========================================================
  // STATUS
  // =========================================================

  const changeStatus = async (id, status) => {
    try {
      setActionLoading((prev) => ({
        ...prev,
        status: id,
      }));

      await axios.post(
        `${baseURL}/api/admin/updateMerchantStatus/${id}`,
        {
          is_active: status,
        },
        {
          headers: authHeaders(),
        },
      );

      toast.success(
        status === 1
          ? "Merchant activated successfully"
          : "Merchant deactivated successfully",
      );

      await fetchMerchants();
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while changing status",
      );
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        status: null,
      }));
    }
  };

  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  const handlePasswordChange = async () => {
    if (!newPassword.password) {
      toast.error("Please enter new password");
      return;
    }

    if (!newPassword.confirmPassword) {
      toast.error("Please confirm password");
      return;
    }

    if (
      newPassword.password !==
      newPassword.confirmPassword
    ) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setActionLoading((prev) => ({
        ...prev,
        password: true,
      }));

      const res = await axios.post(
        `${baseURL}/api/admin/changeMerchantPassword/${newPassword.id}`,
        {
          password: newPassword.password,
          confirmPassword:
            newPassword.confirmPassword,
        },
        {
          headers: authHeaders(),
        },
      );

      toast.success(
        res?.data?.message ||
          "Password changed successfully",
      );

      closePasswordModal();
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error updating password",
      );
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        password: false,
      }));
    }
  };

  // =========================================================
  // ACCOUNT TYPE
  // =========================================================

  const updateMerchantType = async (id) => {
    try {
      setActionLoading((prev) => ({
        ...prev,
        account: id,
      }));

      const res = await axios.post(
        `${baseURL}/api/admin/updateMerchantAccountType/${id}`,
        {
          account_type: "main",
        },
        {
          headers: authHeaders(),
        },
      );

      toast.success(
        res?.data?.message ||
          "Merchant type changed successfully",
      );

      await fetchMerchants();
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error updating merchant type",
      );
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        account: null,
      }));
    }
  };

  // =========================================================
  // VERIFY KYC
  // =========================================================

  const VerifyKyc = async (id) => {
    try {
      setActionLoading((prev) => ({
        ...prev,
        kyc: id,
      }));

      const res = await axios.post(
        `${baseURL}/api/admin/verifyKycMerchant`,
        {
          merchant_id: id,
        },
        {
          headers: authHeaders(),
        },
      );

      toast.success(
        res?.data?.message ||
          "KYC verified successfully",
      );

      setPopup(null);
      setFormData(null);

      await fetchMerchants();
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          "Something went wrong",
      );
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        kyc: null,
      }));
    }
  };

  // =========================================================
  // COPY
  // =========================================================

  const copyText = async (value, type) => {
    if (!value) {
      toast.error("Value not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);

      setCopySuccess(type);

      toast.success("Copied");

      setTimeout(() => {
        setCopySuccess(null);
      }, 1500);
    } catch {
      toast.error("Unable to copy");
    }
  };

  // =========================================================
  // MODALS
  // =========================================================

  const openMerchant = (merchant) => {
    setPopup(merchant);
    setFormData({ ...merchant });
    setIsEditing(false);
  };

  const closeMerchantModal = () => {
    setPopup(null);
    setFormData(null);
    setIsEditing(false);
  };

  const openPasswordModal = (merchant) => {
    setChangePasswordPopup(merchant);

    setNewPassword({
      id: merchant.id,
      password: "",
      confirmPassword: "",
    });

    setShowPassword({
      password: false,
      confirmPassword: false,
    });
  };

  const closePasswordModal = () => {
    setChangePasswordPopup(null);

    setNewPassword({
      id: "",
      password: "",
      confirmPassword: "",
    });

    setShowPassword({
      password: false,
      confirmPassword: false,
    });
  };

  // =========================================================
  // FILTER
  // =========================================================

  const filteredMerchants = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return merchantsData;

    const normalizedId = term.replace(/^(?:id\s*)?#?\s*/, "");

    return merchantsData.filter((merchant) => {

        // Exact Merchant ID matching
        if (/^\d+$/.test(normalizedId)) {
            return String(merchant?.id ?? "").trim() === normalizedId;
        }

        // Existing partial search functionality
        return [
            merchant?.name,
            merchant?.email,
            merchant?.phone,
            merchant?.company_name,
            merchant?.account_type,
        ].some((value) =>
            String(value ?? "")
                .toLowerCase()
                .includes(term)
        );
    });
}, [merchantsData, search]);

  // =========================================================
  // STATS
  // =========================================================

  const stats = useMemo(() => {
    const total = merchantsData.length;

    const active = merchantsData.filter(
      (item) => Number(item?.is_active) === 1,
    ).length;

    const inactive = total - active;

    const verified = merchantsData.filter(
      (item) => Number(item?.kyc_verified) === 1,
    ).length;

    return {
      total,
      active,
      inactive,
      verified,
    };
  }, [merchantsData]);

  // =========================================================
  // EFFECT
  // =========================================================

  useEffect(() => {
    fetchMerchants();
  }, []);

  // =========================================================
  // PAGE LOADER
  // =========================================================

  if (pageLoading) {
    return (
      <div className="flex min-h-[85vh] w-full items-center justify-center bg-[#f6f8fc] dark:bg-[#080d17]">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center   dark:border-blue-500/20 dark:bg-slate-900">
            <Loader2 className="h-6 w-6 animate-spin " />
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Loading merchant details...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Please wait a moment
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-[90dvh] min-h-0 flex-col overflow-hidden bg-[#f6f8fc] text-slate-900 transition-colors dark:bg-[#080d17] dark:text-slate-100">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="relative  shrink-0  dark:bg-[#0d1421]">
          <div className="">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white md:text-3xl">
                  Merchant Details
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Manage merchant accounts, KYC,
                  credentials and account access.
                </p>
              </div>

              <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">

                <div className="relative sm:w-[330px]">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search merchants..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0446DB] focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500 dark:focus:bg-slate-900 dark:focus:ring-blue-500/10"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={fetchMerchants}
                  disabled={loading}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      loading ? "animate-spin" : ""
                    }`}
                  />

                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden ">

          {/* ================================================= */}
          {/* TABLE */}
          {/* ================================================= */}

          <section className="flex min-h-0 mt-2  flex-1 flex-col overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0d1421]">

            

            <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
              <table className="w-full min-w-[1200px]">

                <thead className="sticky top-0 z-30 bg-slate-50 shadow-sm dark:bg-slate-900">
                  <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60">
                    <TableHead>Merchant</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>KYC</TableHead>
                    <TableHead>Account Type</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>Access</TableHead>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                  {loading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-20 text-center"
                      >
                        <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#0446DB]" />

                        <p className="mt-3 text-sm font-medium text-slate-500">
                          Loading merchants...
                        </p>
                      </td>
                    </tr>
                  ) : filteredMerchants.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-20"
                      >
                        <EmptyState
                          search={search}
                          clear={() => setSearch("")}
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredMerchants.map(
                      (merchant) => (
                        <tr
                          key={merchant.id}
                          className="group transition hover:bg-slate-50/80 dark:hover:bg-slate-900/40"
                        >

                          {/* MERCHANT */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                                {getInitials(
                                  merchant?.name,
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="max-w-[190px] truncate text-sm font-bold text-slate-900 dark:text-white">
                                  {merchant?.name ||
                                    "Unnamed Merchant"}
                                </p>

                                <p className="mt-0.5 text-xs text-slate-400">
                                  ID #{merchant?.id}
                                </p>

                                {merchant?.company_name && (
                                  <p className="mt-0.5 max-w-[190px] truncate text-xs text-slate-500 dark:text-slate-400">
                                    {
                                      merchant.company_name
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* CONTACT */}

                          <td className="px-5 py-4">
                            <div className="space-y-1.5">

                              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                                <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                                <span className="max-w-[210px] truncate">
                                  {merchant?.email ||
                                    "N/A"}
                                </span>
                              </div>

                              {merchant?.phone && (
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                  <Phone className="h-3.5 w-3.5" />
                                  {merchant.phone}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">

                              <button
                                type="button"
                                disabled={
                                  actionLoading.status ===
                                  merchant.id
                                }
                                onClick={() =>
                                  changeStatus(
                                    merchant.id,
                                    Number(
                                      merchant.is_active,
                                    ) === 1
                                      ? 0
                                      : 1,
                                  )
                                }
                                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
                                  Number(
                                    merchant.is_active,
                                  ) === 1
                                    ? "bg-emerald-500"
                                    : "bg-slate-300 dark:bg-slate-600"
                                }`}
                              >
                                {actionLoading.status ===
                                merchant.id ? (
                                  <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin text-white" />
                                ) : (
                                  <span
                                    className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                                      Number(
                                        merchant.is_active,
                                      ) === 1
                                        ? "translate-x-6"
                                        : "translate-x-1"
                                    }`}
                                  />
                                )}
                              </button>

                              <span
                                className={`text-xs font-semibold ${
                                  Number(
                                    merchant.is_active,
                                  ) === 1
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-slate-500 dark:text-slate-400"
                                }`}
                              >
                                {Number(
                                  merchant.is_active,
                                ) === 1
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </div>
                          </td>

                          {/* KYC */}

                          <td className="px-5 py-4">
                            {Number(
                              merchant?.kyc_verified,
                            ) === 1 ? (
                              <StatusBadge type="success">
                                <BadgeCheck className="h-3.5 w-3.5" />
                                Verified
                              </StatusBadge>
                            ) : (
                              <StatusBadge type="warning">
                                <CircleAlert className="h-3.5 w-3.5" />
                                Pending
                              </StatusBadge>
                            )}
                          </td>

                          {/* ACCOUNT TYPE */}

                          <td className="px-5 py-4">

                            {merchant?.account_type ===
                            "test" ? (
                              <button
                                type="button"
                                disabled={
                                  actionLoading.account ===
                                  merchant.id
                                }
                                onClick={() =>
                                  updateMerchantType(
                                    merchant.id,
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400"
                              >
                                {actionLoading.account ===
                                merchant.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <CircleAlert className="h-3.5 w-3.5" />
                                )}

                                Test
                              </button>
                            ) : merchant?.account_type ===
                              "main" ? (
                              <StatusBadge type="blue">
                                <BadgeCheck className="h-3.5 w-3.5" />
                                Main
                              </StatusBadge>
                            ) : (
                              <StatusBadge>
                                N/A
                              </StatusBadge>
                            )}
                          </td>

                          {/* DOCUMENT */}

                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                openMerchant(merchant)
                              }
                              className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0446DB] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                            >
                              <FileText className="h-4 w-4" />
                              View
                            </button>
                          </td>

                          {/* PASSWORD */}

                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                openPasswordModal(
                                  merchant,
                                )
                              }
                              className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0446DB] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                            >
                              <KeyRound className="h-4 w-4" />
                              Change
                            </button>
                          </td>

                          {/* LOGIN */}

                          <td className="px-5 py-4">
                            <a
                              href={`${frontendURL}/incognitoLogin/${localStorage.getItem(
                                "token",
                              )}/${merchant.email}/merchant`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#0446DB] px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0338b5]"
                            >
                              Login
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </td>
                        </tr>
                      ),
                    )
                  )}
                </tbody>
              </table>
            </div>

            {!loading &&
              filteredMerchants.length > 0 && (
                <div className="flex flex-col gap-1 border-t border-slate-200 bg-slate-50/70 px-5 py-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">

                  <p>
                    Showing{" "}
                    <strong className="text-slate-700 dark:text-slate-200">
                      {filteredMerchants.length}
                    </strong>{" "}
                    merchants
                  </p>

                  {search && (
                    <p>
                      Search:{" "}
                      <span className="font-semibold text-[#0446DB] dark:text-blue-400">
                        "{search}"
                      </span>
                    </p>
                  )}
                </div>
              )}
          </section>
        </main>
      </div>

      {/* ================================================= */}
      {/* MERCHANT DETAILS MODAL */}
      {/* ================================================= */}

      {popup && formData && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-[3px] sm:p-5"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !actionLoading.save
            ) {
              closeMerchantModal();
            }
          }}
        >
          <div className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#0d1421]">

            {/* MODAL HEADER */}

            <div className="shrink-0 border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-[#0d1421] sm:px-6">

              <div className="flex items-start justify-between gap-4">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0446DB] font-bold text-white">
                    {getInitials(popup?.name)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">

                      <h2 className="truncate text-lg font-bold text-slate-900 dark:text-white">
                        {popup?.name ||
                          "Merchant Details"}
                      </h2>

                      {Number(
                        popup?.kyc_verified,
                      ) === 1 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                          <BadgeCheck className="h-3 w-3" />
                          KYC Verified
                        </span>
                      )}
                    </div>

                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Merchant ID #{popup?.id}
                      {popup?.company_name
                        ? ` • ${popup.company_name}`
                        : ""}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeMerchantModal}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* MODAL CONTENT */}

            <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 dark:bg-[#080d17] sm:p-6">

              <form
                onSubmit={handleSave}
                className="space-y-5"
              >

                {/* CREDENTIALS */}

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">

                  <InfoBox
                    icon={
                      <Hash className="h-4 w-4" />
                    }
                    label="Merchant ID"
                    value={`#${popup?.id}`}
                  />

                  <CopyBox
                    label="Merchant Key"
                    value={popup?.merchant_key}
                    copied={
                      copySuccess ===
                      "merchant_key"
                    }
                    onCopy={() =>
                      copyText(
                        popup?.merchant_key,
                        "merchant_key",
                      )
                    }
                  />

                  <CopyBox
                    label="Secret Key"
                    value={popup?.secret_key}
                    copied={
                      copySuccess === "secret_key"
                    }
                    onCopy={() =>
                      copyText(
                        popup?.secret_key,
                        "secret_key",
                      )
                    }
                  />
                </div>

                {/* BASIC DETAILS */}

                <ModalSection
                  icon={
                    <UserRound className="h-5 w-5" />
                  }
                  title="Basic Information"
                  subtitle="Merchant and company information"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <FormInput
                      label="Merchant Name"
                      name="name"
                      value={formData?.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<UserRound />}
                    />

                    <FormInput
                      label="Phone Number"
                      name="phone"
                      value={formData?.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<Phone />}
                    />

                    <FormInput
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData?.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<Mail />}
                    />

                    <FormInput
                      label="Company Name"
                      name="company_name"
                      value={
                        formData?.company_name
                      }
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<Building2 />}
                    />

                    <FormInput
                      label="Company Address"
                      name="company_address"
                      value={
                        formData?.company_address
                      }
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<MapPin />}
                    />

                    <FormInput
                      label="Company City"
                      name="company_city"
                      value={
                        formData?.company_city
                      }
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<MapPinned />}
                    />

                    <FormInput
                      label="Company State"
                      name="company_state"
                      value={
                        formData?.company_state
                      }
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<MapPinned />}
                    />

                    <FormInput
                      label="Company Pincode"
                      name="company_pincode"
                      value={
                        formData?.company_pincode
                      }
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<MapPin />}
                    />

                    <FormInput
                      label="Company GST Number"
                      name="company_gst_number"
                      value={
                        formData?.company_gst_number
                      }
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<FileText />}
                    />
                  </div>
                </ModalSection>

                {/* KYC */}

                <ModalSection
                  icon={
                    <ShieldCheck className="h-5 w-5" />
                  }
                  title="KYC Verification"
                  subtitle="Review merchant verification documents"
                  right={
                    Number(
                      popup?.kyc_verified,
                    ) === 1 ? (
                      <StatusBadge type="success">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verified
                      </StatusBadge>
                    ) : (
                      <StatusBadge type="warning">
                        Pending Verification
                      </StatusBadge>
                    )
                  }
                >

                  <div className="space-y-4">

                    {(popup?.document_type ||
                      popup?.document_id) && (
                      <DocumentCard
                        title="Primary Document"
                        companyType={
                          popup?.company_type
                        }
                        documentType={
                          popup?.document_type
                        }
                        documentId={
                          popup?.document_id
                        }
                        image={
                          popup?.document_image
                        }
                      />
                    )}

                    {popup?.supporting_document_id && (
                      <DocumentCard
                        title="Supporting Document"
                        companyType={
                          popup?.company_type
                        }
                        documentType={
                          popup?.supporting_document_type
                        }
                        documentId={
                          popup?.supporting_document_id
                        }
                        image={
                          popup?.supporting_document_image
                        }
                      />
                    )}

                    {!popup?.document_id &&
                      !popup?.supporting_document_id && (
                        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                          <FileText className="mx-auto h-7 w-7 text-slate-300 dark:text-slate-600" />

                          <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                            No KYC documents
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Merchant has not uploaded
                            verification documents.
                          </p>
                        </div>
                      )}

                    {Number(
                      popup?.kyc_verified,
                    ) !== 1 &&
                      (popup?.document_id ||
                        popup?.supporting_document_id) && (
                        <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10 sm:flex-row sm:items-center sm:justify-between">

                          <div className="flex items-start gap-3">
                            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />

                            <div>
                              <p className="text-sm font-bold text-amber-900 dark:text-amber-300">
                                Verification Required
                              </p>

                              <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
                                Review the uploaded
                                documents before approving
                                KYC.
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={
                              actionLoading.kyc ===
                              popup?.id
                            }
                            onClick={() =>
                              VerifyKyc(popup?.id)
                            }
                            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                          >
                            {actionLoading.kyc ===
                            popup?.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <ShieldCheck className="h-4 w-4" />
                            )}

                            Verify KYC
                          </button>
                        </div>
                      )}
                  </div>
                </ModalSection>

                {/* BANK */}

                <ModalSection
                  icon={
                    <Landmark className="h-5 w-5" />
                  }
                  title="Bank Details"
                  subtitle="Settlement and banking information"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <FormInput
                      label="Bank Name"
                      name="bank_name"
                      value={formData?.bank_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<Landmark />}
                    />

                    <FormInput
                      label="Account Number"
                      name="bank_account_number"
                      value={
                        formData?.bank_account_number
                      }
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<WalletCards />}
                    />

                    <FormInput
                      label="Branch"
                      name="bank_branch"
                      value={formData?.bank_branch}
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<Building2 />}
                    />

                    <FormInput
                      label="IFSC Code"
                      name="bank_ifsc_code"
                      value={
                        formData?.bank_ifsc_code
                      }
                      onChange={handleChange}
                      disabled={!isEditing}
                      icon={<Hash />}
                    />

                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300">
                        Cheque Document
                      </label>

                      {!isEditing ? (
                        popup?.cheque_image ? (
                          <a
                            href={`${baseURL}${popup.cheque_image}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex min-h-[60px] items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 transition hover:border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10"
                          >
                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#0446DB] shadow-sm dark:bg-slate-800 dark:text-blue-400">
                                <FileCheck2 className="h-4 w-4" />
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                  Cheque Document
                                </p>

                                <p className="text-xs text-slate-400">
                                  Click to view uploaded
                                  document
                                </p>
                              </div>
                            </div>

                            <ExternalLink className="h-4 w-4 text-slate-400" />
                          </a>
                        ) : (
                          <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-400 dark:border-slate-700">
                            No cheque document uploaded
                          </div>
                        )
                      ) : (
                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-[#0446DB] hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-500 dark:hover:bg-blue-500/10">

                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#0446DB] shadow-sm dark:bg-slate-800 dark:text-blue-400">
                            <Upload className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                              Upload new cheque
                            </p>

                            <p className="text-xs text-slate-400">
                              Image or PDF document
                            </p>
                          </div>

                          <input
                            type="file"
                            name="cheque_image"
                            accept="image/*,application/pdf"
                            onChange={handleChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </ModalSection>
              </form>
            </div>

            {/* MODAL FOOTER */}

            <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-[#0d1421]">

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                {isEditing ? (
                  <>
                    <button
                      type="button"
                      disabled={
                        actionLoading.save
                      }
                      onClick={() => {
                        setFormData({
                          ...popup,
                        });
                        setIsEditing(false);
                      }}
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      disabled={
                        actionLoading.save
                      }
                      onClick={handleSave}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0446DB] px-5 text-sm font-semibold text-white transition hover:bg-[#0338b5] disabled:opacity-60"
                    >
                      {actionLoading.save ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}

                      {actionLoading.save
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={
                        closeMerchantModal
                      }
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Close
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...popup,
                        });
                        setIsEditing(true);
                      }}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0446DB] px-5 text-sm font-semibold text-white transition hover:bg-[#0338b5]"
                    >
                      <Pencil className="h-4 w-4" />

                      Edit Details
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* CHANGE PASSWORD MODAL */}
      {/* ================================================= */}

      {changePasswordPopup && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-[3px]"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !actionLoading.password
            ) {
              closePasswordModal();
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#0d1421]">

            {/* HEADER */}

            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">

              <div className="flex gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                  <KeyRound className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Change Password
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Update merchant login password.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closePasswordModal}
                disabled={actionLoading.password}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePasswordChange();
              }}
            >

              <div className="space-y-5 p-5">

                {/* USER */}

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-[#0446DB] shadow-sm dark:bg-slate-800 dark:text-blue-400">
                    {getInitials(
                      changePasswordPopup?.name,
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      {changePasswordPopup?.name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Merchant ID #
                      {changePasswordPopup?.id}
                    </p>
                  </div>
                </div>

                {/* PASSWORD */}

                <PasswordInput
                  label="New Password"
                  value={newPassword.password}
                  show={showPassword.password}
                  onToggle={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      password:
                        !prev.password,
                    }))
                  }
                  onChange={(e) =>
                    setNewPassword((prev) => ({
                      ...prev,
                      password:
                        e.target.value,
                    }))
                  }
                />

                <PasswordInput
                  label="Confirm Password"
                  value={
                    newPassword.confirmPassword
                  }
                  show={
                    showPassword.confirmPassword
                  }
                  onToggle={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      confirmPassword:
                        !prev.confirmPassword,
                    }))
                  }
                  onChange={(e) =>
                    setNewPassword((prev) => ({
                      ...prev,
                      confirmPassword:
                        e.target.value,
                    }))
                  }
                />

                {newPassword.password &&
                  newPassword.confirmPassword &&
                  newPassword.password !==
                    newPassword.confirmPassword && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                      <CircleAlert className="h-4 w-4" />
                      Passwords do not match
                    </div>
                  )}
              </div>

              {/* FOOTER */}

              <div className="flex gap-3 border-t border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/50">

                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={
                    actionLoading.password
                  }
                  className="h-10 flex-1 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    actionLoading.password
                  }
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0446DB] text-sm font-semibold text-white transition hover:bg-[#0338b5] disabled:opacity-60"
                >
                  {actionLoading.password ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <KeyRound className="h-4 w-4" />
                  )}

                  {actionLoading.password
                    ? "Updating..."
                    : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

/* ========================================================= */
/* COMPONENTS */
/* ========================================================= */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-[#0d1421]">

      <div className="flex items-start justify-between gap-3">

        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            {value}
          </p>

          <p className="mt-1 hidden text-xs text-slate-400 sm:block">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function TableHead({ children }) {
  return (
    <th className="sticky top-0 z-30 whitespace-nowrap bg-slate-50 px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-900 dark:text-slate-400">
      {children}
    </th>
  );
}

function StatusBadge({
  type = "default",
  children,
}) {
  const classes = {
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",

    warning:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400",

    blue:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",

    default:
      "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-bold ${classes[type]}`}
    >
      {children}
    </span>
  );
}

function ModalSection({
  icon,
  title,
  subtitle,
  right,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0d1421]">

      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
            {icon}
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {title}
            </h3>

            <p className="mt-0.5 text-xs text-slate-400">
              {subtitle}
            </p>
          </div>
        </div>

        {right}
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}

function FormInput({
  label,
  icon,
  disabled,
  ...props
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300">
        {label}
      </label>

      <div className="relative">

        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 [&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </div>
        )}

        <input
          {...props}
          disabled={disabled}
          value={props.value || ""}
          placeholder="N/A"
          className={`h-11 w-full rounded-xl border px-3 text-sm outline-none transition ${
            icon ? "pl-9" : ""
          } ${
            disabled
              ? "cursor-default border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
              : "border-slate-300 bg-white text-slate-900 focus:border-[#0446DB] focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/10"
          }`}
        />
      </div>
    </div>
  );
}

function InfoBox({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0d1421]">

      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-[11px] font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-2 truncate text-sm font-bold text-slate-900 dark:text-white">
        {value || "N/A"}
      </p>
    </div>
  );
}

function CopyBox({
  label,
  value,
  copied,
  onCopy,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0d1421]">

      <div className="flex items-center justify-between gap-3">

        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>

        <button
          type="button"
          onClick={onCopy}
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-blue-50 hover:text-[#0446DB] dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>

      <p
        className="mt-2 max-w-full truncate font-mono text-xs font-semibold text-slate-700 dark:text-slate-300"
        title={value}
      >
        {value || "Not available"}
      </p>
    </div>
  );
}

function DocumentCard({
  title,
  companyType,
  documentType,
  documentId,
  image,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">

      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70">

        <FileCheck2 className="h-4 w-4 text-[#0446DB] dark:text-blue-400" />

        <p className="text-sm font-bold text-slate-800 dark:text-white">
          {title}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">

        <DocumentInfo
          label="Company Type"
          value={companyType}
        />

        <DocumentInfo
          label="Document Type"
          value={documentType}
        />

        <DocumentInfo
          label="Document ID"
          value={documentId}
        />

        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Document File
          </p>

          {image ? (
            <a
              href={`${baseURL}${image}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0446DB] transition hover:underline dark:text-blue-400"
            >
              <Eye className="h-4 w-4" />
              View Document
            </a>
          ) : (
            <p className="mt-1.5 text-sm text-slate-400">
              Not uploaded
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function DocumentInfo({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-semibold text-slate-700 dark:text-slate-200">
        {value || "N/A"}
      </p>
    </div>
  );
}

function PasswordInput({
  label,
  value,
  show,
  onToggle,
  onChange,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300">
        {label}
        <span className="ml-1 text-red-500">
          *
        </span>
      </label>

      <div className="relative">

        <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          type={show ? "text" : "password"}
          value={value || ""}
          onChange={onChange}
          required
          autoComplete="new-password"
          placeholder={`Enter ${label.toLowerCase()}`}
          className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0446DB] focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/10"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 dark:hover:text-white"
        >
          {show ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

function EmptyState({ search, clear }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 text-center">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
        <Store className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-white">
        {search
          ? "No merchants found"
          : "No merchants available"}
      </h3>

      <p className="mt-1 max-w-sm text-xs text-slate-400">
        {search
          ? `No merchant matches "${search}". Try another search.`
          : "Merchant records will appear here once available."}
      </p>

      {search && (
        <button
          type="button"
          onClick={clear}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#0446DB] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0338b5]"
        >
          <X className="h-3.5 w-3.5" />
          Clear Search
        </button>
      )}
    </div>
  );
}

function getInitials(name) {
  if (!name) return "M";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

export default MerchantDetails;

