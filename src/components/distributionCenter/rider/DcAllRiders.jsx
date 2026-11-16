
import React, { useCallback, useEffect, useMemo, useState } from "react";

import axios from "axios";

import { toast } from "react-toastify";

import {

  Search,

  RefreshCw,

  Users,

  UserCheck,

  ShieldCheck,

  Clock3,

  Eye,

  KeyRound,

  X,

  Pencil,

  Save,

  Loader2,

  MapPin,

  Phone,

  Mail,

  FileText,

  Building2,

  CheckCircle2,

  AlertCircle,

  SlidersHorizontal,

  ChevronDown,

  EyeOff,

  UserPlus,

} from "lucide-react";

import AxiosInstance from "../../../Helper/axiosInstance";

import { Country, State, City } from "country-state-city";

import CreatableSelect from "react-select/creatable";

import CustomButton from "../../common/CustomButton";

import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITEBASEURL;

const auth = () => ({

  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },

});

const cn = (...a) => a.filter(Boolean).join(" ");

const on = (v) => String(v) === "1";

const inputClass =

  "w-full h-10 rounded-sm border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-800";

const softButton =

  "inline-flex items-center justify-center gap-2 rounded-sm border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0446DB] disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800";

const primaryButton =

  "inline-flex items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0339b5] disabled:opacity-50";

function Pill({ good, children }) {

  return (

    <span

      className={cn(

        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",

        good

          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"

          : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

      )}

    >

      <span

        className={cn(

          "h-1.5 w-1.5 rounded-full",

          good ? "bg-emerald-500" : "bg-amber-500",

        )}

      />

      {children}

    </span>

  );

}

function Switch({ checked, disabled, onChange, label }) {

  return (

    <button

      type="button"

      role="switch"

      _aria-label_={label}

      _aria-checked_={checked}

      disabled={disabled}

      onClick={onChange}

      className={cn(

        "relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-40",

        checked ? "bg-[#0446DB]" : "bg-slate-300 dark:bg-slate-600",

      )}

    >

      <span

        className={cn(

          "absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform",

          checked ? "translate-x-6" : "translate-x-1",

        )}

      />

    </button>

  );

}

function Modal({

  title,

  subtitle,

  icon: Icon,

  onClose,

  children,

  wide = false,

}) {

  useEffect(() => {

    const esc = (e) => e.key === "Escape" && onClose();

    window.addEventListener("keydown", esc);

    return () => window.removeEventListener("keydown", esc);

  }, [onClose]);

  return (

    <div

      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"

      onMouseDown={(e) => e.target === e.currentTarget && onClose()}

    >

      <div

        role="dialog"

        _aria-modal_="true"

        _aria-label_={title}

        className={cn(

          "flex max-h-[92vh] w-full flex-col overflow-hidden rounded-sm border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900",

          wide ? "max-w-4xl" : "max-w-lg",

        )}

      >

        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">

          <div className="flex items-center gap-3">

            <div className="rounded-sm bg-blue-50 p-2.5 text-[#0446DB] dark:bg-blue-500/10">

              {Icon && <Icon size={20} />}

            </div>

            <div>

              <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>

              {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}

            </div>

          </div>

          <button

            type="button"

            onClick={onClose}

            _aria-label_="Close"

            className="rounded-sm p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"

          >

            <X size={19} />

          </button>

        </div>

        <div className="min-h-0 overflow-y-auto p-5 sm:p-6">{children}</div>

      </div>

    </div>

  );

}

const numericLimits = { phone: 10, pincode: 6, bankaccountnumber: 30 };

const lettersOnlyFields = new Set(["name", "bank_name", "bank_branch"]);

const sanitizeNumericField = (key, value) => {

  if (lettersOnlyFields.has(key)) return String(value).replace(/[^a-zA-Z ]/g, "");

  const digits = String(value).replace(/\D/g, "");

  return numericLimits[key] ? digits.slice(0, numericLimits[key]) : value;

};

const fields = [

  ["name", "Rider name"],

  ["phone", "Phone number"],

  ["email", "Email address"],

  ["address_line", "Address"],

  ["state", "State"],

  ["city", "City"],

  ["pincode", "Pincode"],

  ["facility_city", "Facility city"],

  ["facility_zone", "Facility zone"],

  ["bank_name", "Bank name"],

  ["bank_branch", "Bank branch"],

  ["bankaccountnumber", "Account number"],

  ["bankifsccode", "IFSC code"],

];

export default function DcAllRiders() {

  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [riders, setRiders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [busy, setBusy] = useState(false);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [vendorId, setvendorId] = useState("");

  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({});

  const [countryCode, setCountryCode] = useState("IN");

  const countryOptions = useMemo(

    () =>

      Country.getAllCountries().map((c) => ({

        value: c.isoCode,

        label: c.name,

      })),

    [],

  );

  const stateOptions = useMemo(

    () =>

      State.getStatesOfCountry(countryCode).map((s) => ({

        value: s.isoCode,

        label: s.name,

      })),

    [countryCode],

  );

  const selectedState = useMemo(

    () =>

      stateOptions.find((s) => s.label.toLowerCase() === String(form.state || "").toLowerCase()),

    [stateOptions, form.state],

  );

  const cityOptions = useMemo(

    () =>

      selectedState

        ? City.getCitiesOfState(countryCode, selectedState.value).map((c) => ({

            value: c.name,

            label: c.name,

          }))

        : [],

    [countryCode, selectedState],

  );

  const facilityOptions = useMemo(() => cityOptions, [cityOptions]);

  const locationSelectStyles = useMemo(

    () => ({

      control: (base, state) => ({

        ...base,

        minHeight: 40,

        borderRadius: 12,

        borderColor: state.isFocused ? "#0446DB" : "#cbd5e1",

        backgroundColor: "transparent",

        boxShadow: state.isFocused ? "0 0 0 3px rgba(4,70,219,.1)" : "none",

      }),

      menu: (base) => ({ ...base, zIndex: 110 }),

      singleValue: (base) => ({ ...base, color: "inherit" }),

      input: (base) => ({ ...base, color: "inherit" }),

    }),

    [],

  );

  const selectOption = (items, value) =>

    items.find((x) => x.value === value || x.label === value) ||

    (value ? { value, label: value } : null);

  const updateLocation = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const renderLocationField = (key, label) => {

    const isCountry = key === "country";

    const isState = key === "state";

    const options = isCountry

      ? countryOptions

      : isState

        ? stateOptions

        : key === "city"

          ? cityOptions

          : facilityOptions;

    const current = isCountry ? countryCode : form[key];

    return (

      <label key={key} className="block min-w-0">

        <span className="mb-1.5 block text-xs font-semibold text-slate-500">{label}</span>

        <CreatableSelect

          className="text-sm text-slate-800 dark:text-slate-100"

          classNamePrefix="location-select"

          styles={locationSelectStyles}

          isDisabled={!editing || (key !== "country" && key !== "state" && !selectedState)}

          isClearable={!isCountry}

          isSearchable

          options={options}

          value={selectOption(options, current)}

          placeholder={

            key === "facility_city"

              ? "Select or type facility town/city..."

              : `Select ${label.toLowerCase()}...`

          }

          formatCreateLabel={(text) => `Use custom city/town: "${text}"`}

          isValidNewOption={(input) => !isState && !isCountry && Boolean(input.trim())}

          onChange={(option) => {

            if (isCountry) {

              setCountryCode(option?.value || "IN");

              setForm((prev) => ({

                ...prev,

                state: "",

                city: "",

                facility_city: "",

              }));

            } else if (isState) {

              setForm((prev) => ({

                ...prev,

                state: option?.label || "",

                city: "",

                facility_city: "",

              }));

            } else {

              updateLocation(key, option?.value || "");

            }

          }}

        />

        {key === "facility_city" && (

          <p className="mt-1 text-[11px] text-slate-400">

            City or town missing? Type its name and select the custom option.

          </p>

        )}

      </label>

    );

  };

  const [editing, setEditing] = useState(false);

  const [passwordRider, setPasswordRider] = useState(null);

  const [passwords, setPasswords] = useState({

    password: "",

    confirmPassword: "",

  });

  const getVendor = async()=>{

    try {

       const {data} = await AxiosInstance.get(`/api/dc/vendors`)

       setVendors(data?.data)

    } catch (error) {

    }

  }

 const fetchRiders = useCallback(async () => {

  setLoading(true);

  try {

    const params = {};

    if (vendorId !== "") {

      params.vendor_id = vendorId;

    }

    const res = await AxiosInstance.get("/api/dc/riders", {

      params,

    });

    setRiders(

      Array.isArray(res.data?.data) ? res.data.data : []

    );

  } catch (err) {

    toast.error(

      err.response?.data?.message ||

      err.message ||

      "Failed to load riders"

    );

  } finally {

    setLoading(false);

  }

}, [vendorId]);

useEffect(() => {

  fetchRiders();

}, [fetchRiders]);

  const filtered = useMemo(

    () =>

      riders.filter((r) => {

        const q = search.trim().toLowerCase();

        const matches =

          !q ||

          [

            r.id,

            r.name,

            r.phone,

            r.email,

            r.facility_city,

            r.facility_zone,

            `DC_${r.dc_id}_${r.id}`,

          ].some((v) =>

            String(v ?? "")

              .toLowerCase()

              .includes(q),

          );

        return (

          matches &&

          (filter === "all" ||

            (filter === "active" && on(r.is_active)) ||

            (filter === "inactive" && !on(r.is_active)) ||

            (filter === "available" && on(r.is_available)) ||

            (filter === "pending" && !on(r.kyc_verified)))

        );

      }),

    [riders, search, filter],

  );

  const [currentPage, setCurrentPage] = useState(1);

  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {

    setCurrentPage(1);

  }, [search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const safePage = Math.min(currentPage, totalPages);

  const paginatedRiders = useMemo(

    () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),

    [filtered, safePage, pageSize],

  );

  const openRider = (r) => {

    setSelected(r);

    setForm({ ...r });

    setCountryCode(r.country_code || "IN");

    setEditing(false);

  };

  const refresh = async () => {

    await fetchRiders();

  };

  // PATCH requires both values even if only one switch changes.
  // Preserve the other value from the current rider row.
  const updateDcRiderStatus = async (rider, changes) => {
    const riderId = Number(rider?.id);
    if (!Number.isSafeInteger(riderId) || riderId <= 0) {
      toast.error("Invalid rider ID");
      return;
    }

    const payload = {
      active: changes.active ?? Number(on(rider.is_active)),
      status: changes.status ?? Number(on(rider.account_status)),
    };

    setBusy(true);
    try {
      const res = await AxiosInstance.patch(
        `/api/dc/riders/${riderId}/status`,
        payload,
      );
      if (res.data?.success === false) {
        throw new Error(res.data?.message || "Failed to update rider status");
      }
      // Reflect the response immediately, then re-sync with the server.
      const updated = res.data?.data || {};
      setRiders((previous) => previous.map((item) =>
        Number(item.id) === riderId
          ? {
              ...item,
              is_active: updated.is_active ?? payload.active,
              is_available: updated.is_available ?? payload.active,
              account_status: updated.account_status ?? payload.status,
            }
          : item,
      ));
      toast.success(res.data?.message || "Rider status updated successfully");
      await fetchRiders();
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Unable to update rider status",
      );
    } finally {
      setBusy(false);
    }
  };

  const saveProfile = async (e) => {

    e.preventDefault();

    if (String(form.phone ?? "").length !== 10 || !/^\d{10}$/.test(String(form.phone ?? ""))) {

      toast.error("Phone number must be exactly 10 digits");

      return;

    }

    if (String(form.pincode ?? "").length !== 6 || !/^\d{6}$/.test(String(form.pincode ?? ""))) {

      toast.error("Pincode must be exactly 6 digits");

      return;

    }

    if (form.bank_account_number && !/^\d+$/.test(String(form.bank_account_number))) {

      toast.error("Account number must contain only digits");

      return;

    }

    setBusy(true);

    try {

      const res = await AxiosInstance.patch(`/api/dc/riders/${selected.id}`, form);

      toast.success(res.data?.message || "Profile updated");

      setSelected(null);

      await fetchRiders();

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Unable to update rider");

    } finally {

      setBusy(false);

    }

  };

  const verifyKyc = async () => {

    if (!selected?.document_image) {

      toast.error("No KYC document available for review");

      return;

    }

    if (

      !window.confirm(

        "Confirm that you have reviewed the rider KYC document and want to verify it?",

      )

    )

      return;

    setBusy(true);

    try {

      const data = new FormData();

      data.append("kyc_verified", "1");

      const res = await axios.post(

        `${baseURL}/api/vendor/updateRiderProfile/${selected.id}`,

        data,

        auth(),

      );

      toast.success(res.data?.message || "KYC verified");

      setSelected(null);

      await fetchRiders();

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Unable to verify KYC");

    } finally {

      setBusy(false);

    }

  };

  const changePassword = async (e) => {

    e.preventDefault();

    if (passwords.password.length < 8)

      return toast.error("Use a password of at least 8 characters");

    if (passwords.password !== passwords.confirmPassword)

      return toast.error("Passwords do not match");

    setBusy(true);

    try {

      const res = await AxiosInstance.post(

        `/api/dc/riders/${passwordRider.id}/changePassword`,

        passwords,

      );

      toast.success(res.data?.message || "Password changed");

      setPasswordRider(null);

      setPasswords({ password: "", confirmPassword: "" });

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Unable to change password");

    } finally {

      setBusy(false);

    }

  };

  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {

      setLoadingPage(false);

    }, 2000);

    return () => clearTimeout(timer);

  }, []);

  return (

    <>

      {loadingPage ? (

        <div className=" w-full h-[90vh] flex justify-center items-center">

          <div>

            <Loader2 className="h-8 w-8 animate-spin mx-auto" />

            <p className="mt-2">Loading Rider Details...</p>

          </div>

        </div>

      ) : (

        <div className="flex h-[88dvh] min-h-0 w-full flex-col overflow-hidden bg-[#F5F7FB] text-slate-900 dark:bg-slate-950 dark:text-white">

          <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">

            <div className="z-20 flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-[#F5F7FB] px-3 py-3 dark:border-slate-800 dark:bg-slate-950 sm:px-5">

              <div>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Rider Management</h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">

                  Manage rider profiles, verification, availability and account access.

                </p>

              </div>

              <div className=" flex gap-3">

                <CustomButton

                  type="button"

                  variant="primary"

                  size="md"

                  icon={UserPlus}

                  onClick={() => navigate("/dc/rider-onboarding")}

                >

                  Onboard Rider

                </CustomButton>

                <CustomButton

                  type="button"

                  variant="outline"

                  size="md"

                  icon={RefreshCw}

                  onClick={refresh}

                  loading={loading}

                  disabled={loading || busy}

                >

                  Refresh riders

                </CustomButton>

              </div>

            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-slate-900">

              <div className="z-10 flex shrink-0 flex-col gap-3 border-b border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-3">

                <div>

                  <h2 className="text-base font-bold">All riders</h2>

                  <p className="mt-1 text-xs text-slate-500">

                    {filtered.length} rider{filtered.length !== 1 ? "s" : ""} found

                  </p>

                </div>

                <div className="flex flex-col gap-2 sm:flex-row">

                  <label className="relative block">

                    <Search

                      size={17}

                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"

                    />

                    <input

                      value={search}

                      onChange={(e) => setSearch(e.target.value)}

                      placeholder="Search name, ID, phone, city..."

                      className={cn(inputClass, "w-full pl-10 sm:w-72")}

                      _aria-label_="Search riders"

                    />

                  </label>

                  <div className="relative">

                    <SlidersHorizontal

                      size={16}

                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"

                    />

                    <select

                      _aria-label_="Filter riders"

                      value={filter}

                      onChange={(e) => setFilter(e.target.value)}

                      className={cn(inputClass, "appearance-none pl-9 pr-9")}

                    >

                      <option value="all">All riders</option>

                      <option value="active">Active</option>

                      <option value="inactive">Inactive</option>

                      <option value="available">Available</option>

                      <option value="pending">KYC pending</option>

                    </select>

                    <ChevronDown

                      size={15}

                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"

                    />

                  </div>

                  <div className="relative">

                    <SlidersHorizontal

                      size={16}

                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"

                    />

                    <select

                    onClick={getVendor}

                      _aria-label_="Filter riders"

                      value={vendorId}

                      onChange={(e) => setvendorId(e.target.value)}

                      className={cn(inputClass, "appearance-none pl-9 pr-9")}

                    >

                      <option value="">Select Vendor</option>

                      {

                        vendors?.map((v)=>{

                         return <>

                          <option value={v?.id}>{v?.id}:{v?.vendor_name}</option>

                          </>

                        })

                      }

                    </select>

                    <ChevronDown

                      size={15}

                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"

                    />

                  </div>

                </div>

              </div>

              <div className="min-h-0 flex-1 overflow-auto overscroll-contain">

                <table className="w-full min-w-[1000px] text-left text-sm">

                  <thead className="sticky top-0 z-20 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 shadow-sm dark:bg-slate-800">

                    <tr>

                      {[

                        "Rider",

                        "Contact / Location",

                        "Account Status",

                        "Active",

                        "KYC",

                        "Actions",

                      ].map((h) => (

                        <th

                          key={h}

                          className="sticky top-0 whitespace-nowrap bg-slate-50 px-5 py-4 font-semibold dark:bg-slate-800"

                        >

                          {h}

                        </th>

                      ))}

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                    {loading ? (

                      <tr>

                        <td colSpan={7} className="py-20 text-center">

                          <Loader2 className="mx-auto mb-3 animate-spin text-[#0446DB]" />

                          <span className="text-slate-500">Loading riders...</span>

                        </td>

                      </tr>

                    ) : filtered.length === 0 ? (

                      <tr>

                        <td colSpan={7} className="py-20 text-center">

                          <Users className="mx-auto mb-3 text-slate-300" size={32} />

                          <p className="font-medium">No riders found</p>

                          <p className="mt-1 text-xs text-slate-500">

                            Try adjusting your search or filter.

                          </p>

                        </td>

                      </tr>

                    ) : (

                      paginatedRiders.map((r) => (

                        <tr

                          key={r.id}

                          className="transition hover:bg-blue-50/30 dark:hover:bg-slate-800/40"

                        >

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-blue-100 font-bold text-[#0446DB] dark:bg-blue-500/10">

                                {String(r.name || "R")

                                  .slice(0, 1)

                                  .toUpperCase()}

                              </div>

                              <div>

                                <p className="whitespace-nowrap font-semibold">

                                  {r.name || "Unnamed rider"}

                                </p>

                                <p className="mt-0.5 text-xs text-slate-400">

                                  DC_{r.dc_id}_{r.id}

                                </p>

                              </div>

                            </div>

                          </td>

                          <td className="px-5 py-4">

                            <p className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">

                              <Phone size={13} className="text-slate-400" />

                              {r.phone || "—"}

                            </p>

                            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">

                              <MapPin size={13} />

                              {r.facility_city || r.city || "Location not set"}

                            </p>

                          </td>

                          <td className="px-5 py-4">

                            <div className="mt-2">

                              <Switch

                                label={`Toggle account for ${r.name}`}

                                checked={on(r.account_status)}

                                disabled={busy}

                                onChange={() => updateDcRiderStatus(r, {
                                  status: on(r.account_status) ? 0 : 1,
                                })}

                              />

                            </div>

                          </td>

                          <td className="px-5 py-4">

                            <Switch

                              label={`Toggle active for ${r.name}`}

                              checked={on(r.is_active)}

                              disabled={busy || !on(r.account_status)}

                              onChange={() => updateDcRiderStatus(r, {
                                active: on(r.is_active) ? 0 : 1,
                              })}

                            />

                          </td>

                          <td className="px-5 py-4">

                            <Pill good={on(r.kyc_verified)}>

                              {on(r.kyc_verified) ? "Verified" : "Pending review"}

                            </Pill>

                          </td>

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2">

                              <button

                                type="button"

                                title="View rider"

                                _aria-label_={`View ${r.name}`}

                                onClick={() => openRider(r)}

                                className={softButton}

                              >

                                <Eye size={16} />

                              </button>

                              <button

                                type="button"

                                title="Change password"

                                _aria-label_={`Change password for ${r.name}`}

                                onClick={() => {

                                  setPasswordRider(r);

                                  setPasswords({

                                    password: "",

                                    confirmPassword: "",

                                  });

                                }}

                                className={softButton}

                              >

                                <KeyRound size={16} />

                              </button>

                            </div>

                          </td>

                        </tr>

                      ))

                    )}

                  </tbody>

                </table>

              </div>

              <div className="z-10 flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-white px-3 py-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 sm:px-5">

                <span>

                  {filtered.length === 0

                    ? "Showing 0 riders"

                    : `Showing ${(safePage - 1) * pageSize + 1}-${Math.min(safePage * pageSize, filtered.length)} of ${filtered.length} riders`}

                </span>

                <div className="flex items-center gap-2">

                  <label htmlFor="ridersPageSize" className="whitespace-nowrap">

                    Per page

                  </label>

                  <select

                    id="ridersPageSize"

                    value={pageSize}

                    onChange={(e) => {

                      setPageSize(Number(e.target.value));

                      setCurrentPage(1);

                    }}

                    className="rounded-sm border border-slate-200 bg-white px-2 py-1.5 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"

                  >

                    {[10, 20, 50, 100].map((size) => (

                      <option key={size} value={size}>

                        {size}

                      </option>

                    ))}

                  </select>

                  <button

                    type="button"

                    disabled={safePage <= 1}

                    onClick={() => setCurrentPage(safePage - 1)}

                    className="rounded-sm border border-slate-200 px-3 py-1.5 font-medium disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"

                  >

                    Previous

                  </button>

                  <span className="whitespace-nowrap font-semibold text-slate-700 dark:text-slate-200">

                    {safePage} / {totalPages}

                  </span>

                  <button

                    type="button"

                    disabled={safePage >= totalPages}

                    onClick={() => setCurrentPage(safePage + 1)}

                    className="rounded-sm border border-slate-200 px-3 py-1.5 font-medium disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"

                  >

                    Next

                  </button>

                </div>

              </div>

            </div>

          </div>

          {selected && (

            <Modal

              title="Rider profile"

              subtitle={`DC_${selected.dc_id}_${selected.id} · ${selected.name || "Rider"}`}

              icon={Users}

              onClose={() => setSelected(null)}

              wide

            >

              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-sm bg-slate-50 p-4 dark:bg-slate-800/60">

                <div className="flex flex-wrap gap-2">

                  <Pill good={on(selected.account_status)}>

                    {on(selected.account_status) ? "Account approved" : "Account pending"}

                  </Pill>

                  <Pill good={on(selected.kyc_verified)}>

                    {on(selected.kyc_verified) ? "KYC verified" : "KYC pending"}

                  </Pill>

                  <Pill good={on(selected.is_available)}>

                    {on(selected.is_available) ? "Available" : "Unavailable"}

                  </Pill>

                </div>

                <button

                  type="button"

                  className={softButton}

                  onClick={() => {

                    if (editing) setForm({ ...selected });

                    setEditing(!editing);

                  }}

                >

                  <Pencil size={15} />

                  {editing ? "Cancel editing" : "Edit profile"}

                </button>

              </div>

              <form onSubmit={saveProfile}>

                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">

                  <Users size={17} className="text-[#0446DB]" />

                  Personal & facility information

                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  {renderLocationField("country", "Country")}

                  {fields.slice(0, 9).map(([key, label]) =>

                    ["state", "city", "facility_city"].includes(key) ? (

                      renderLocationField(key, label)

                    ) : (

                      <label key={key} className="block">

                        <span className="mb-1.5 block text-xs font-semibold text-slate-500">

                          {label}

                        </span>

                        <input

                          className={inputClass}

                          disabled={!editing}

                          value={form[key] ?? ""}

                          type="text"

                          inputMode={numericLimits[key] ? "numeric" : undefined}

                          maxLength={numericLimits[key]}

                          onChange={(e) =>

                            setForm((p) => ({

                              ...p,

                              [key]: sanitizeNumericField(key, e.target.value),

                            }))

                          }

                        />

                      </label>

                    ),

                  )}

                </div>

                <div className="my-5 border-t border-slate-100 dark:border-slate-800" />

                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">

                  <FileText size={17} className="text-[#0446DB]" />

                  KYC documents

                </h3>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="rounded-sm border border-slate-200 p-4 dark:border-slate-700">

                    <p className="text-xs text-slate-500">Document type</p>

                    <p className="mt-1 font-semibold">{selected.document_type || "Not provided"}</p>

                    <p className="mt-3 text-xs text-slate-500">Document ID</p>

                    <p className="mt-1 font-semibold">{selected.document_id || "Not provided"}</p>

                  </div>

                  <div className="rounded-sm border border-slate-200 p-4 dark:border-slate-700">

                    <p className="mb-3 text-xs text-slate-500">Uploaded document</p>

                    {selected.document_image ? (

                      <a

                        href={`${baseURL}/${String(selected.document_image)}`}

                        target="_blank"

                        rel="noopener noreferrer"

                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0446DB] hover:underline"

                      >

                        <FileText size={17} /> View KYC document

                      </a>

                    ) : (

                      <p className="text-sm text-slate-400">No document uploaded</p>

                    )}

                    {!on(selected.kyc_verified) && (

                      <button

                        type="button"

                        onClick={verifyKyc}

                        disabled={busy || !selected.document_image}

                        className={cn(primaryButton, "mt-4 w-full")}

                      >

                        <ShieldCheck size={16} /> Verify KYC

                      </button>

                    )}

                    {on(selected.kyc_verified) && (

                      <p className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-600">

                        <CheckCircle2 size={16} /> KYC verified

                      </p>

                    )}

                  </div>

                </div>

                <div className="my-5 border-t border-slate-100 dark:border-slate-800" />

                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">

                  <Building2 size={17} className="text-[#0446DB]" />

                  Bank information

                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  {fields.slice(9).map(([key, label]) => (

                    <label key={key} className="block">

                      <span className="mb-1.5 block text-xs font-semibold text-slate-500">

                        {label}

                      </span>

                      <input

                        className={inputClass}

                        disabled={!editing}

                        value={form[key] ?? ""}

                        type="text"

                        inputMode={numericLimits[key] ? "numeric" : undefined}

                        maxLength={numericLimits[key]}

                        onChange={(e) =>

                          setForm((p) => ({

                            ...p,

                            [key]: sanitizeNumericField(key, e.target.value),

                          }))

                        }

                      />

                    </label>

                  ))}

                </div>

                <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-5 dark:border-slate-800">

                  <button type="button" onClick={() => setSelected(null)} className={softButton}>

                    Close

                  </button>

                  {editing && (

                    <button type="submit" disabled={busy} className={primaryButton}>

                      {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}

                      Save changes

                    </button>

                  )}

                </div>

              </form>

            </Modal>

          )}

          {passwordRider && (

            <Modal

              title="Change rider password"

              subtitle={`${passwordRider.name} · DC_${passwordRider.dc_id}_${passwordRider.id}`}

              icon={KeyRound}

              onClose={() => setPasswordRider(null)}

            >

              <form onSubmit={changePassword} className="space-y-4">

                <div className="rounded-sm border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">

                  <AlertCircle size={15} className="mr-2 inline" />

                  Use a strong password. The new password will replace the rider's existing

                  password.

                </div>

                <div className="space-y-4">

                  <label className="block">

                    <span className="mb-1.5 block text-xs font-semibold text-slate-500">

                      New Password

                    </span>

                    <div className="relative">

                      <input

                        type={showPassword ? "text" : "password"}

                        autoComplete="new-password"

                        required

                        minLength={8}

                        value={passwords.password}

                        onChange={(e) =>

                          setPasswords((prev) => ({

                            ...prev,

                            password: e.target.value,

                          }))

                        }

                        placeholder="Enter new password"

                        className={`${inputClass} pr-11`}

                      />

                      <button

                        type="button"

                        onClick={() => setShowPassword((prev) => !prev)}

                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#0446DB] dark:text-slate-500"

                        _aria-label_={showPassword ? "Hide password" : "Show password"}

                      >

                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}

                      </button>

                    </div>

                  </label>

                  <label className="block">

                    <span className="mb-1.5 block text-xs font-semibold text-slate-500">

                      Confirm New Password

                    </span>

                    <div className="relative">

                      <input

                        type={showConfirmPassword ? "text" : "password"}

                        autoComplete="new-password"

                        required

                        minLength={8}

                        value={passwords.confirmPassword}

                        onChange={(e) =>

                          setPasswords((prev) => ({

                            ...prev,

                            confirmPassword: e.target.value,

                          }))

                        }

                        placeholder="Confirm new password"

                        className={`${inputClass} pr-11`}

                      />

                      <button

                        type="button"

                        onClick={() => setShowConfirmPassword((prev) => !prev)}

                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#0446DB] dark:text-slate-500"

                        _aria-label_={

                          showConfirmPassword ? "Hide confirm password" : "Show confirm password"

                        }

                      >

                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}

                      </button>

                    </div>

                  </label>

                </div>

                <div className="flex justify-end gap-2 pt-2">

                  <button

                    type="button"

                    onClick={() => setPasswordRider(null)}

                    className={softButton}

                  >

                    Cancel

                  </button>

                  <button type="submit" disabled={busy} className={primaryButton}>

                    {busy ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}

                    Update password

                  </button>

                </div>

              </form>

            </Modal>

          )}

        </div>

      )}

    </>

  );

}
