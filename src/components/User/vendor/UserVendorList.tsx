
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AxiosInstance from "@/Helper/axiosInstance";
import { toast } from "react-toastify";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Loader2,
  Pencil,
  RefreshCcw,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

type Vendor = {
  id: number;
  vendor_name?: string | null;
  company_name?: string | null;
  company_gst_number?: string | null;
  company_address?: string | null;
  company_type?: string | null;
  company_pancard_name?: string | null;
  company_pancard_image?: string | null;
  supporting_document_type?: string | null;
  supporting_document_id?: string | null;
  supporting_document_image?: string | null;
  phone?: string | null;
  email?: string | null;
  document_type?: string | null;
  document_id?: string | null;
  document_image?: string | null;
  bank_name?: string | null;
  bank_branch?: string | null;
  bank_ifsc_code?: string | null;
  bank_account_number?: string | null;
  cheque_image?: string | null;
  vendor_code?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  is_active?: number | boolean;
  kyc_verified?: number | boolean;
  created_at?: string | null;
  updated_at?: string | null;
};

type VendorForm = {
  vendor_name: string;
  company_name: string;
  email: string;
  phone: string;
  company_gst_number: string;
  company_address: string;
  bank_name: string;
  bank_branch: string;
  bank_ifsc_code: string;
  bank_account_number: string;
  vendor_code: string;
  is_active: "0" | "1";
  password: string;
  confirm_password: string;
  cheque_image: File | null;
};

type Pagination = { page: number; limit: number; total: number; totalPages: number };
const PAGE_SIZE = 20;
const fileBase = String(import.meta.env.VITE_BASE_URL ?? "").replace(/\/$/, "");
const isEnabled = (value: number | boolean | undefined) => value === 1 || value === true;
const safeText = (value: unknown) =>
  value === null || value === undefined || value === "" ? "—" : String(value);
const initialForm = (v: Vendor): VendorForm => ({
  vendor_name: v.vendor_name ?? "",
  company_name: v.company_name ?? "",
  email: v.email ?? "",
  phone: v.phone ?? "",
  company_gst_number: v.company_gst_number ?? "",
  company_address: v.company_address ?? "",
  bank_name: v.bank_name ?? "",
  bank_branch: v.bank_branch ?? "",
  bank_ifsc_code: v.bank_ifsc_code ?? "",
  bank_account_number: v.bank_account_number ?? "",
  vendor_code: v.vendor_code ?? "",
  is_active: isEnabled(v.is_active) ? "1" : "0",
  password: "",
  confirm_password: "",
  cheque_image: null,
});
const inputClass =
  "w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500";
const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

async function apiError(error: unknown) {
  if (axios.isAxiosError(error)) return error.response?.data?.message || error.message;
  return error instanceof Error ? error.message : "Something went wrong";
}
function documentUrl(path?: string | null) {
  if (!path) return "";
  // Never allow javascript/data URLs in document links.
  if (/^https?:\/\//i.test(path)) return path;
  return `${fileBase}/${String(path).replace(/^\/+/, "")}`;
}

export default function VendorList() {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [permissionLoading, setPermissionLoading] = useState(true);
  const can = (p: string) => permissions.includes("ADMIN_FULL_ACCESS") || permissions.includes(p);
  const canView = can("VIEW_VENDOR");
  const canUpdate = can("UPDATE_VENDOR");
  const canVerify = can("VERIFY_VENDOR_KYC");
  const canLogin = can("LOGIN_VENDOR");

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [cityInput, setCityInput] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [cityFilter, setCityFilter] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const fetchSequence = useRef(0);
  const requestPage = debouncedSearch ? 1 : page;
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [selected, setSelected] = useState<Vendor | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<VendorForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [loggingInId, setLoggingInId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await AxiosInstance.get("/api/user/getUserPermissions");
        const result = res.data?.data?.data;
        if (!Array.isArray(result)) throw new Error("Invalid permission response");
        if (!active) return;
        setPermissions(result);
        if (!result.includes("VIEW_VENDOR") && !result.includes("ADMIN_FULL_ACCESS"))
          navigate("/unauthorized", { replace: true });
      } catch (error) {
        if (!active) return;
        toast.error(await apiError(error));
        navigate("/unauthorized", { replace: true });
      } finally {
        if (active) setPermissionLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [navigate]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  // The documented API supports page, limit and city only (no server-side search).
  // While searching, retrieve all city-authorized pages and filter them locally.
  const fetchVendors = useCallback(async () => {
    const sequence = ++fetchSequence.current;
    setLoading(true);
    try {
      if (debouncedSearch) {
        const all: Vendor[] = [];
        let apiPage = 1;
        let totalPages = 1;
        do {
          const response = await AxiosInstance.get("/api/user/getAllVendors", {
            params: { page: apiPage, limit: 100, ...(cityFilter ? { city: cityFilter } : {}) },
          });
          if (response.data?.success === false)
            throw new Error(response.data.message || "Could not fetch vendors");
          if (sequence !== fetchSequence.current) return;
          const rows: Vendor[] = Array.isArray(response.data?.data) ? response.data.data : [];
          all.push(...rows);
          totalPages = Math.max(1, Number(response.data?.pagination?.totalPages) || 1);
          apiPage += 1;
          if (!rows.length) break;
        } while (apiPage <= totalPages);
        if (sequence !== fetchSequence.current) return;
        setVendors(all);
        setPagination({
          page: 1,
          limit: PAGE_SIZE,
          total: all.length,
          totalPages: Math.max(1, Math.ceil(all.length / PAGE_SIZE)),
        });
      } else {
        const response = await AxiosInstance.get("/api/user/getAllVendors", {
          params: {
            page: requestPage,
            limit: PAGE_SIZE,
            ...(cityFilter ? { city: cityFilter } : {}),
          },
        });
        if (response.data?.success === false)
          throw new Error(response.data.message || "Could not fetch vendors");
        if (sequence !== fetchSequence.current) return;
        const rows = response.data?.data;
        const meta = response.data?.pagination;
        setVendors(Array.isArray(rows) ? rows : []);
        setPagination({
          page: Number(meta?.page) || requestPage,
          limit: Number(meta?.limit) || PAGE_SIZE,
          total: Number(meta?.total) || 0,
          totalPages: Math.max(1, Number(meta?.totalPages) || 1),
        });
      }
    } catch (error) {
      if (sequence !== fetchSequence.current) return;
      setVendors([]);
      toast.error(await apiError(error));
    } finally {
      if (sequence === fetchSequence.current) setLoading(false);
    }
  }, [requestPage, cityFilter, debouncedSearch]);

  useEffect(() => {
    if (!permissionLoading && canView) void fetchVendors();
  }, [permissionLoading, canView, fetchVendors]);

  const filteredVendors = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (query !== debouncedSearch.toLowerCase()) return [];
    if (!query) return vendors;
    // Exact numeric/FP vendor ID takes priority over incidental phone-number matches.
    if (/^(?:fp)?\d+$/i.test(query)) {
      const normalizedId = query.replace(/^fp/i, "");
      const exactIds = vendors.filter((v) => String(v.id) === normalizedId);
      if (exactIds.length) return exactIds;
    }
    return vendors.filter((v) =>
      [
        v.id,
        `FP${v.id}`,
        v.vendor_name,
        v.company_name,
        v.email,
        v.phone,
        v.vendor_code,
        v.city,
      ].some((val) =>
        String(val ?? "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [vendors, search, debouncedSearch]);

  const isSearching = Boolean(search.trim());
  const searchPending = search.trim() !== debouncedSearch;
  const effectiveTotal = isSearching ? filteredVendors.length : pagination.total;
  const effectiveTotalPages = isSearching
    ? Math.max(1, Math.ceil(filteredVendors.length / PAGE_SIZE))
    : pagination.totalPages;
  const displayedVendors = isSearching
    ? filteredVendors.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : filteredVendors;
  useEffect(() => {
    setPage(1);
  }, [search]);
  useEffect(() => {
    setPage((current) => Math.min(current, effectiveTotalPages));
  }, [effectiveTotalPages]);

  const openDetails = (v: Vendor) => {
    setSelected(v);
    setForm(initialForm(v));
    setEditing(false);
  };
  const closeDetails = () => {
    if (saving || verifying) return;
    setSelected(null);
    setForm(null);
    setEditing(false);
  };
  const updateField = (name: keyof VendorForm, value: string | File | null) => {
    setForm((prev) => (prev ? ({ ...prev, [name]: value } as VendorForm) : prev));
  };
  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    updateField("cheque_image", event.target.files?.[0] ?? null);
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected || !form || !canUpdate || !editing || saving) return;
    if (form.password && form.password !== form.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    const initial = initialForm(selected);
    const fields: (keyof VendorForm)[] = [
      "vendor_name",
      "company_name",
      "email",
      "phone",
      "company_gst_number",
      "company_address",
      "bank_name",
      "bank_branch",
      "bank_ifsc_code",
      "bank_account_number",
      "vendor_code",
      "is_active",
    ];
    const data = new FormData();
    fields.forEach((key) => {
      if (form[key] !== initial[key]) data.append(key, String(form[key]));
    });
    if (form.password) {
      data.append("password", form.password);
      data.append("confirm_password", form.confirm_password);
    }
    if (form.cheque_image) data.append("cheque_image", form.cheque_image);
    if (Array.from(data.keys()).length === 0) {
      toast.info("No changes to save");
      return;
    }
    if (
      initial.is_active === "1" &&
      form.is_active === "0" &&
      !window.confirm("Deactivate this vendor? Active vendor sessions will be revoked.")
    )
      return;
    setSaving(true);
    try {
      const res = await AxiosInstance.post(`/api/user/updateVendor/${selected.id}`, data);
      if (res.data?.success === false) throw new Error(res.data.message || "Update failed");
      const terminated = res.data?.terminated_sessions;
      toast.success(
        `${res.data?.message || "Vendor updated"}${typeof terminated === "number" ? ` (${terminated} sessions revoked)` : ""}`,
      );
      closeAfterSuccess();
      await fetchVendors();
    } catch (error) {
      toast.error(await apiError(error));
    } finally {
      setSaving(false);
    }
  };
  const closeAfterSuccess = () => {
    setSelected(null);
    setForm(null);
    setEditing(false);
  };

  const verifyKyc = async () => {
    if (!selected || !canVerify || verifying || isEnabled(selected.kyc_verified)) return;
    if (
      !window.confirm(`Mark KYC verified for ${selected.vendor_name || `vendor #${selected.id}`}?`)
    )
      return;
    setVerifying(true);


  
    try {
      const res = await AxiosInstance.post("/api/user/verifyKycVendor", { vendor_id: selected.id });
      if (res.data?.success === false)
        throw new Error(res.data.message || "KYC verification failed");
      toast.success(res.data?.message || "KYC verified");
      closeAfterSuccess();
      await fetchVendors();
    } catch (error) {
      toast.error(await apiError(error));
    } finally {
      setVerifying(false);
    }
  };



  if (permissionLoading)
    return (
      <div className="flex h-[90dvh] items-center justify-center gap-2 text-sm text-slate-500">
        <Loader2 className="animate-spin" size={20} /> Loading vendor permissions...
      </div>
    );
  if (!canView) return null;

  const fields: {
    key: keyof VendorForm;
    label: string;
    type?: string;
    section: "basic" | "bank" | "security";
  }[] = [
    { key: "vendor_name", label: "Vendor name", section: "basic" },
    { key: "vendor_code", label: "Vendor code", section: "basic" },
    { key: "company_name", label: "Company name", section: "basic" },
    { key: "company_gst_number", label: "GST number", section: "basic" },
    { key: "phone", label: "Phone", section: "basic" },
    { key: "email", label: "Email", type: "email", section: "basic" },
    { key: "company_address", label: "Company address", section: "basic" },
    { key: "bank_name", label: "Bank name", section: "bank" },
    { key: "bank_branch", label: "Bank branch", section: "bank" },
    { key: "bank_ifsc_code", label: "IFSC", section: "bank" },
    { key: "bank_account_number", label: "Account number", section: "bank" },
    { key: "password", label: "New password (optional)", type: "password", section: "security" },
    { key: "confirm_password", label: "Confirm password", type: "password", section: "security" },
  ];
  const docLinks = selected
    ? ([
        ["Primary document", selected.document_image],
        ["Company PAN", selected.company_pancard_image],
        ["Supporting document", selected.supporting_document_image],
        ["Cheque image", selected.cheque_image],
      ] as const)
    : [];

  return (
    <div className="flex h-[87dvh] min-h-0 w-full flex-col overflow-hidden bg-slate-50 text-slate-900 dark:bg-neutral-950 dark:text-white">
      <div className="shrink-0  dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold">Vendors</h1>
            <p className="text-xs text-slate-500">Manage vendors in your assigned cities</p>
          </div>
          <button
            type="button"
            onClick={() => void fetchVendors()}
            disabled={loading || searchPending}
            className={`${buttonClass} border border-slate-200 bg-white text-slate-700 dark:bg-neutral-800 dark:text-white`}
          >
            <RefreshCcw size={15} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[170px] flex-1 sm:max-w-xs">
            <Search size={15} className="absolute left-3 top-3 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search all vendors (ID, name, phone...)"
              className={`${inputClass} pl-9`}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setCityInput(cityFilter);
              setFilterDrawerOpen(true);
            }}
            className={`${buttonClass} border border-slate-200 bg-white text-slate-700 dark:bg-neutral-800 dark:text-white`}
          >
            <Filter size={15} /> Filters{" "}
            {cityFilter && <span className="rounded bg-blue-50 px-1.5 text-[#0446DB]">1</span>}
          </button>
          {cityFilter && (
            <span className="rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-[#0446DB]">
              City: {cityFilter}
            </span>
          )}
        </div>
        <Drawer open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen} direction="right">
          <DrawerContent className="h-full w-full max-w-full rounded-none sm:max-w-md">
            <DrawerHeader className="shrink-0 border-b border-slate-200 text-left dark:border-neutral-800">
              <DrawerTitle className="flex items-center gap-2 text-base">
                <Filter size={17} className="text-[#0446DB]" /> Filter Vendors
              </DrawerTitle>
            </DrawerHeader>
            <form
              className="flex min-h-0 flex-1 flex-col"
              onSubmit={(e) => {
                e.preventDefault();
                setPage(1);
                setCityFilter(cityInput.trim());
                setFilterDrawerOpen(false);
              }}
            >
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
                <label
                  htmlFor="vendor-city-filter"
                  className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Company City
                </label>
                <input
                  id="vendor-city-filter"
                  autoFocus
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  placeholder="e.g. Gurugram, Lucknow"
                  className={inputClass}
                />
                <p className="mt-2 text-xs text-slate-500">
                  The city filter is applied by the backend. Press Enter to apply and close this
                  drawer.
                </p>
              </div>
              <DrawerFooter className="shrink-0 border-t border-slate-200 dark:border-neutral-800">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCityInput("");
                      setCityFilter("");
                      setPage(1);
                      setFilterDrawerOpen(false);
                    }}
                    className={`${buttonClass} border border-slate-200 bg-white text-slate-700`}
                  >
                    Clear Filter
                  </button>
                  <button type="submit" className={`${buttonClass} bg-[#0446DB] text-white`}>
                    Apply Filter
                  </button>
                </div>
                <DrawerClose asChild>
                  <button type="button" className={`${buttonClass} w-full border border-slate-200`}>
                    Cancel
                  </button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-white dark:bg-neutral-900">
        <table className="min-w-[950px] w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-100 text-xs uppercase text-slate-600 dark:bg-neutral-800 dark:text-slate-300">
            <tr>
              {[
                "Vendor ID",
                "Vendor / Company",
                "City",
                "Contact",
                "Account",
                "KYC",
                "Documents",
                "Vendor Login",
              ].map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap border-b border-slate-200 px-4 py-3 font-semibold"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
            {loading || searchPending ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-slate-500">
                  <Loader2 size={24} className="mx-auto mb-2 animate-spin" />
                  Loading vendors...
                </td>
              </tr>
            ) : displayedVendors.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-slate-500">
                  No independent vendors found
                </td>
              </tr>
            ) : (
              displayedVendors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800/50">
                  <td className="px-4 py-3 font-mono font-semibold">FP{v.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{safeText(v.vendor_name)}</div>
                    <div className="text-xs text-slate-500">
                      {safeText(v.company_name)} · {safeText(v.vendor_code)}
                    </div>
                  </td>
                  <td className="px-4 py-3">{safeText(v.city)}</td>
                  <td className="px-4 py-3">
                    <div>{safeText(v.phone)}</div>
                    <div className="text-xs text-slate-500">{safeText(v.email)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${isEnabled(v.is_active) ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}
                    >
                      {isEnabled(v.is_active) ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${isEnabled(v.kyc_verified) ? "bg-blue-50 text-[#0446DB]" : "bg-orange-50 text-orange-700"}`}
                    >
                      {isEnabled(v.kyc_verified) ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => openDetails(v)}
                      className={`${buttonClass} border border-blue-200 bg-blue-50 text-[#0446DB]`}
                    >
                      <Eye size={14} /> View / Edit
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {canLogin ? (
                    <a
                      href={`${import.meta.env.VITE_FRONTEND_URL}/incognitoLogin/${localStorage.getItem("token")}/${v?.email}/user_vendor`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${buttonClass} bg-[#0446DB] text-white inline-flex items-center justify-center gap-2`}
                    >
                      <ExternalLink size={14} />
                      Login
                    </a>
                    ) : (
                      <span className="text-xs text-slate-400">No access</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 text-xs dark:border-neutral-800 dark:bg-neutral-900">
        <span className="text-slate-500">
          Showing {effectiveTotal ? (page - 1) * PAGE_SIZE + 1 : 0}–
          {Math.min(page * PAGE_SIZE, effectiveTotal)} of {effectiveTotal} vendors
          {isSearching ? " (all permitted vendor pages searched)" : ""}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading || searchPending}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`${buttonClass} border border-slate-200`}
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <span>
            Page {page} / {effectiveTotalPages}
          </span>
          <button
            type="button"
            disabled={page >= effectiveTotalPages || loading || searchPending}
            onClick={() => setPage((p) => p + 1)}
            className={`${buttonClass} border border-slate-200`}
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {selected && form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5">
          <div className="flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-neutral-900">
            <div className="flex shrink-0 items-center justify-between gap-3 bg-[#0446DB] px-5 py-4 text-white">
              <div>
                <h2 className="text-lg font-bold">Vendor Details · FP{selected.id}</h2>
                <p className="text-xs text-blue-100">
                  {safeText(selected.vendor_name)} · {safeText(selected.city)}
                </p>
              </div>
              <button
                type="button"
                onClick={closeDetails}
                aria-label="Close"
                className="rounded-md p-2 hover:bg-white/20"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={isEnabled(selected.is_active) ? "text-green-700" : "text-red-600"}
                  >
                    {isEnabled(selected.is_active) ? "Active account" : "Inactive account"}
                  </span>
                  <span>·</span>
                  <span
                    className={
                      isEnabled(selected.kyc_verified) ? "text-green-700" : "text-orange-600"
                    }
                  >
                    {isEnabled(selected.kyc_verified) ? "KYC verified" : "KYC pending"}
                  </span>
                </div>
                {!editing && canUpdate && (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className={`${buttonClass} bg-[#0446DB] text-white`}
                  >
                    <Pencil size={14} /> Edit details
                  </button>
                )}
              </div>
              {(["basic", "bank", "security"] as const).map((section) =>
                section === "security" && !editing ? null : (
                  <section
                    key={section}
                    className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50"
                  >
                    <h3 className="mb-3 font-semibold">
                      {section === "basic"
                        ? "Basic / Company Information"
                        : section === "bank"
                          ? "Bank Details"
                          : "Password & Account Status"}
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {fields
                        .filter((f) => f.section === section)
                        .map((f) => (
                          <label key={f.key} className="block">
                            <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
                              {f.label}
                            </span>
                            <input
                              type={f.type || "text"}
                              name={f.key}
                              value={String(form[f.key] ?? "")}
                              onChange={(e) => updateField(f.key, e.target.value)}
                              disabled={!editing}
                              autoComplete={f.type === "password" ? "new-password" : undefined}
                              className={inputClass}
                            />
                          </label>
                        ))}
                      {section === "security" && (
                        <label className="block">
                          <span className="mb-1 block text-xs font-medium">Account status</span>
                          <select
                            className={inputClass}
                            value={form.is_active}
                            onChange={(e) => updateField("is_active", e.target.value)}
                          >
                            <option value="1">Active</option>
                            <option value="0">Inactive (revokes sessions)</option>
                          </select>
                        </label>
                      )}
                    </div>
                  </section>
                ),
              )}
              <section className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <ShieldCheck size={17} /> KYC & Documents
                </h3>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <p>
                    Document type: <b>{safeText(selected.document_type)}</b>
                  </p>
                  <p>
                    Document ID: <b>{safeText(selected.document_id)}</b>
                  </p>
                  <p>
                    Company type: <b>{safeText(selected.company_type)}</b>
                  </p>
                  <p>
                    Supporting document: <b>{safeText(selected.supporting_document_type)}</b>
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {docLinks.map(
                    ([label, path]) =>
                      path && (
                        <a
                          key={label}
                          href={documentUrl(path)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${buttonClass} border border-blue-200 bg-white text-[#0446DB]`}
                        >
                          <FileText size={14} /> {label} <ExternalLink size={12} />
                        </a>
                      ),
                  )}
                </div>
                <div className="mt-3">
                  {isEnabled(selected.kyc_verified) ? (
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-green-700">
                      <CheckCircle2 size={16} /> KYC verified
                    </span>
                  ) : canVerify ? (
                    <button
                      type="button"
                      disabled={verifying}
                      onClick={() => void verifyKyc()}
                      className={`${buttonClass} bg-[#EB8300] text-white`}
                    >
                      {verifying ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <ShieldCheck size={14} />
                      )}{" "}
                      Verify KYC
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500">
                      KYC pending — no verification permission
                    </span>
                  )}
                </div>
              </section>
              <section className="mb-2 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                <h3 className="mb-2 font-semibold">Cheque Image</h3>
                {selected.cheque_image && (
                  <a
                    href={documentUrl(selected.cheque_image)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-2 inline-flex items-center gap-2 text-sm text-[#0446DB]"
                  >
                    <Download size={14} /> View current file
                  </a>
                )}
                {editing && (
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFile}
                    className="block w-full text-xs"
                  />
                )}
                {form.cheque_image && (
                  <p className="mt-1 text-xs">Selected: {form.cheque_image.name}</p>
                )}
              </section>
              <div className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-200 bg-white py-3 dark:bg-neutral-900">
                {editing && canUpdate ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setForm(initialForm(selected));
                      }}
                      className={`${buttonClass} border border-slate-200`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className={`${buttonClass} bg-[#0446DB] text-white`}
                    >
                      {saving && <Loader2 size={14} className="animate-spin" />} Save changes
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={closeDetails}
                    className={`${buttonClass} bg-[#0446DB] text-white`}
                  >
                    Close
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
