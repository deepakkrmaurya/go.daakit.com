import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { State, City } from "country-state-city";
import { toast } from "react-toastify";
import GoogleMap from "../../googlemap";
import AxiosInstance from "@/Helper/axiosInstance";
import {
  AlertCircle, Building2, CheckCircle2, Eye, EyeOff, Hash,
  LockKeyhole, Map, MapPin, MapPinned, Navigation,
  Plus, RotateCcw, UserRound, Loader2,
} from "lucide-react";

const EMPTY_FORM = {
  hub_name: "", hub_code: "", username: "", password: "",
  address: "", city: "", state: "", pincode: "",
  latitude: "", longitude: "",
};

const clean = (value) => String(value ?? "").trim();

function InputError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600" role="alert">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {message}
    </p>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3 border-b border-neutral-200 pb-4 dark:border-neutral-800">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-50 text-[#0446DB] dark:bg-blue-950/40 dark:text-blue-400">
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">{title}</h2>
        <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">{description}</p>
      </div>
    </div>
  );
}

export default function DcCreateHub() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hubIdParam = searchParams.get("hubId");
  const isEdit = hubIdParam !== null;
  const hubId = Number(hubIdParam);
  const [initialForm, setInitialForm] = useState(null);
  const [loadingHub, setLoadingHub] = useState(isEdit);
  const [hubLoadError, setHubLoadError] = useState("");
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [createdHubId, setCreatedHubId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [customCity, setCustomCity] = useState(false);
  const indianStates = useMemo(
    () => State.getStatesOfCountry("IN").slice().sort((a, b) => a.name.localeCompare(b.name)),
    []
  );
  const cities = useMemo(() => {
    if (!selectedStateCode) return [];
    const uniqueNames = [...new Set(City.getCitiesOfState("IN", selectedStateCode).map((city) => city.name))];
    return uniqueNames.sort((a, b) => a.localeCompare(b));
  }, [selectedStateCode]);
  const disabled = submitting || (!isEdit && createdHubId !== null) || loadingHub || Boolean(hubLoadError);

  // GET /hubs provides the edit source; there is no GET /hubs/:hubId endpoint.
  useEffect(() => {
    if (!isEdit) {
      setLoadingHub(false);
      setHubLoadError("");
      setFormData({ ...EMPTY_FORM });
      setInitialForm(null);
      setSelectedStateCode("");
      setCustomCity(false);
      return;
    }
    if (!Number.isSafeInteger(hubId) || hubId <= 0) {
      setLoadingHub(false);
      setHubLoadError("Invalid hub ID");
      return;
    }
    const controller = new AbortController();
    const loadHub = async () => {
      setLoadingHub(true);
      setHubLoadError("");
      try {
        const response = await AxiosInstance.get("/api/dc/hubs", { signal: controller.signal });
        const outer = response.data;
        const result = Array.isArray(outer?.data) ? outer : (outer?.data ?? outer);
        if (result?.success === false || outer?.success === false) {
          throw new Error(result?.message || outer?.message || "Unable to fetch hubs");
        }
        const rows = Array.isArray(result?.data) ? result.data : [];
        const hub = rows.find((row) => Number(row.id) === hubId);
        if (!hub) throw new Error("This hub was not found for your DC");
        const nextForm = Object.fromEntries(Object.keys(EMPTY_FORM).map((key) => [key, key === "password" ? "" : String(hub[key] ?? "")]));
        const matchingState = indianStates.find((state) => state.name.toLowerCase() === nextForm.state.toLowerCase());
        const code = matchingState?.isoCode ?? "";
        const availableCities = code ? City.getCitiesOfState("IN", code).map((city) => city.name) : [];
        if (!controller.signal.aborted) {
          setFormData(nextForm);
          setInitialForm(nextForm);
          setSelectedStateCode(code);
          setCustomCity(Boolean(nextForm.city && !availableCities.some((name) => name.toLowerCase() === nextForm.city.toLowerCase())));
          setErrors({});
        }
      } catch (error) {
        if (!controller.signal.aborted && error?.code !== "ERR_CANCELED") {
          setHubLoadError(error?.response?.data?.message || error.message || "Failed to load hub");
        }
      } finally {
        if (!controller.signal.aborted) setLoadingHub(false);
      }
    };
    loadHub();
    return () => controller.abort();
  }, [isEdit, hubId, indianStates]);

  const inputClass = (error) =>
    `h-10 w-full rounded-sm border bg-white px-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:opacity-60 dark:bg-neutral-900 dark:text-neutral-100 ${
      error ? "border-red-400 dark:border-red-700" : "border-neutral-300 dark:border-neutral-700"
    }`;

  const handleChange = (event) => {
    const { name, value } = event.target;
    // Keep PIN as a six-digit string, including any leading zero.
    // Coordinates allow typing a minus sign and a single decimal point.
    if (name === "pincode" && !/^\d{0,6}$/.test(value)) return;
    if ((name === "latitude" || name === "longitude") &&
        !/^-?\d*(?:\.\d*)?$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleStateChange = (event) => {
    const code = event.target.value;
    const state = indianStates.find((item) => item.isoCode === code);
    setSelectedStateCode(code);
    setCustomCity(false);
    setFormData((prev) => ({ ...prev, state: state?.name || "", city: "" }));
    setErrors((prev) => ({ ...prev, state: "", city: "" }));
  };

  const handleCityChange = (event) => {
    if (event.target.value === "__other__") {
      setCustomCity(true);
      setFormData((prev) => ({ ...prev, city: "" }));
    } else {
      setCustomCity(false);
      setFormData((prev) => ({ ...prev, city: event.target.value }));
    }
    setErrors((prev) => ({ ...prev, city: "" }));
  };

  // Preserve existing GoogleMap's callback contract; accepts {selectedLocation, prefix}.
  const fetchCurrentLocatipon = ({ selectedLocation }) => {
    if (!selectedLocation) return;
    const { lat, lng } = selectedLocation;
    setFormData((prev) => ({ ...prev, latitude: String(lat ?? ""), longitude: String(lng ?? "") }));
    setErrors((prev) => ({ ...prev, latitude: "", longitude: "" }));
  };

  const validateForm = () => {
    const next = {};
    for (const [key, label] of [
      ["hub_name", "Hub name"], ["hub_code", "Hub code"],
      ["username", "Username"], ...(!isEdit ? [["password", "Password"]] : []),
    ]) {
      if (!clean(formData[key])) next[key] = `${label} is required`;
    }
    if (formData.password) {
      const passwordBytes = new TextEncoder().encode(formData.password).length;
      if (isEdit && (formData.password.length < 8 || passwordBytes > 72))
        next.password = "New password must be at least 8 characters and at most 72 bytes";
      if (!isEdit && formData.password.length < 6)
        next.password = "Password must be at least 6 characters";
    }
    if (clean(formData.city) && !selectedStateCode)
      next.state = "Select a state before entering the city";
    if (clean(formData.pincode) && !/^\d{6}$/.test(clean(formData.pincode)))
      next.pincode = "Pincode must be exactly 6 digits";
    if (clean(formData.latitude) && (!/^-?\d+(?:\.\d+)?$/.test(clean(formData.latitude)) || Number(formData.latitude) < -90 || Number(formData.latitude) > 90))
      next.latitude = "Latitude must be between -90 and 90";
    if (clean(formData.longitude) && (!/^-?\d+(?:\.\d+)?$/.test(clean(formData.longitude)) || Number(formData.longitude) < -180 || Number(formData.longitude) > 180))
      next.longitude = "Longitude must be between -180 and 180";
    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (disabled) return;
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      toast.error("Please correct the highlighted fields");
      return;
    }
    const payload = {
      hub_name: clean(formData.hub_name),
      hub_code: clean(formData.hub_code),
      username: clean(formData.username),
      ...(!isEdit ? { password: formData.password } : formData.password ? { password: formData.password } : {}),
      address: clean(formData.address) || null,
      city: clean(formData.city) || null,
      state: clean(formData.state) || null,
      pincode: clean(formData.pincode) || null,
      latitude: clean(formData.latitude) === "" ? null : Number(formData.latitude),
      longitude: clean(formData.longitude) === "" ? null : Number(formData.longitude),
    };
    try {
      setSubmitting(true);
      // dcAuth derives dc_id from the token. Never submit dc_id, hub_type or associated_vendor.
      const response = isEdit
        ? await AxiosInstance.patch(`/api/dc/hubs/${hubId}`, payload)
        : await AxiosInstance.post("/api/dc/hub", payload);
      const outer = response.data;
      const result = outer?.data?.success !== undefined ? outer.data : outer;
      if (result?.success === false || outer?.success === false) {
        throw new Error(result?.message || outer?.message || "Hub save failed");
      }
      toast.success(result?.message || outer?.message || (isEdit ? "Hub updated successfully" : "DC hub created successfully"));
      if (isEdit) {
        navigate("/dc/hub_list");
      } else {
        const createdId = result?.data?.hub_id ?? outer?.data?.hub_id ?? null;
        setCreatedHubId(createdId ?? "created");
        setFormData({ ...EMPTY_FORM });
        setErrors({});
        setSelectedStateCode("");
        setCustomCity(false);
      }
    } catch (error) {
      const data = error?.response?.data;
      const nested = data?.data;
      const status = error?.response?.status ?? data?.status ?? nested?.status;
      const message = nested?.message || data?.message || error?.message || (isEdit ? "Unable to update hub" : "Unable to create hub");
      toast.error(status === 409 && !message ? "A hub already exists for this DC" : message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(isEdit && initialForm ? { ...initialForm } : { ...EMPTY_FORM });
    setErrors({});
    if (isEdit && initialForm) {
      const state = indianStates.find((item) => item.name.toLowerCase() === initialForm.state.toLowerCase());
      const code = state?.isoCode ?? "";
      setSelectedStateCode(code);
      const names = code ? City.getCitiesOfState("IN", code).map((city) => city.name) : [];
      setCustomCity(Boolean(initialForm.city && !names.some((name) => name.toLowerCase() === initialForm.city.toLowerCase())));
    } else {
      setSelectedStateCode("");
      setCustomCity(false);
    }
  };

  const field = ({ name, label, placeholder, icon: Icon, required = false, type = "text", inputMode, maxLength }) => (
    <div key={name}>
      <label htmlFor={name} className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
        {label}{required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />}
        <input
          id={name} name={name} type={name === "password" && showPassword ? "text" : type}
          value={formData[name]} onChange={handleChange}
          placeholder={placeholder} required={required} inputMode={inputMode} maxLength={maxLength}
          autoComplete={name === "password" ? "new-password" : "off"}
          pattern={name === "pincode" ? "[0-9]{6}" : undefined}
          disabled={disabled}
          aria-invalid={Boolean(errors[name])}
          className={`${inputClass(errors[name])} ${Icon ? "pl-9" : ""} ${name === "password" ? "pr-10" : ""}`}
        />
        {name === "password" && (
          <button type="button" disabled={submitting} aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-neutral-500 hover:text-[#0446DB]">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      <InputError message={errors[name]} />
    </div>
  );

  return (
    <div className="flex h-[90dvh] min-h-0 w-full flex-col overflow-hidden bg-[#F7F8FA] text-neutral-900 dark:bg-neutral-950 dark:text-white">
      {/* Fixed within the page's 100dvh height; only the middle content scrolls. */}
      <header className="z-20 shrink-0 border-b border-neutral-200  pb-3 dark:border-neutral-800 dark:bg-neutral-900 ">
        <div className="mx-auto flex  items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold sm:text-2xl">{isEdit ? "Edit Hub" : "Create New Hub"}</h1>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{isEdit ? `Update hub #${hubId} information and location details.` : "Add DC hub information, login credentials and location details."}</p>
          </div>
          <div className="hidden shrink-0 items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-xs font-semibold text-[#0446DB] dark:bg-blue-950/40 sm:flex">
            <Building2 className="h-4 w-4" /> DC Hub Management
          </div>
        </div>
      </header>

      <form id="dc-create-hub-form" onSubmit={handleSubmit} className="contents">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain ">
          <div className="mx-auto ">
            {loadingHub && <div className="mb-4 flex items-center gap-2 rounded-md bg-blue-50 p-4 text-sm text-[#0446DB]"><Loader2 className="h-4 w-4 animate-spin" /> Loading hub details...</div>}
            {hubLoadError && <div role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">{hubLoadError}</div>}
            {createdHubId !== null && !isEdit && (
              <div className="mb-4 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300" role="status">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <div><p className="text-sm font-semibold">DC hub created successfully</p>
                  <p className="mt-1 text-xs">{createdHubId === "created" ? "Your hub is now registered." : `Hub ID: ${createdHubId}`} You can create only one hub per DC.</p></div>
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <section className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-5">
                <SectionHeader icon={Building2} title="Hub Information" description="Enter basic details for this DC hub. Hub type is automatically set to DC." />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {field({ name: "hub_name", label: "Hub Name", placeholder: "e.g. Gurugram DC Hub", icon: Building2, required: true })}
                  {field({ name: "hub_code", label: "Hub Code", placeholder: "e.g. GGN-DC-001", icon: Hash, required: true })}
                </div>
                
              </section>

              <section className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-5">
                <SectionHeader icon={LockKeyhole} title="Login Credentials" description={isEdit ? "Change username or optionally set a new password." : "Set the username and password for accessing this hub."} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {field({ name: "username", label: "Username", placeholder: "Enter username", icon: UserRound, required: true })}
                  {field({ name: "password", label: isEdit ? "New Password (optional)" : "Password", placeholder: isEdit ? "Leave blank to keep current password (8+ characters if changed)" : "Minimum 6 characters", icon: LockKeyhole, required: !isEdit, type: "password" })}
                </div>
              </section>

              <section className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-5 xl:col-span-2">
                <SectionHeader icon={MapPin} title="Address Details" description="Provide optional address and area information for this hub." />
                <label htmlFor="address" className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">Complete Address</label>
                <textarea id="address" name="address" rows={3} value={formData.address} onChange={handleChange} disabled={disabled}
                  placeholder="Enter complete hub address..." className={`${inputClass(errors.address)} h-auto resize-y py-2.5`} />
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="state" className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">State</label>
                    <select id="state" name="state" value={selectedStateCode} onChange={handleStateChange}
                      disabled={disabled} className={inputClass(errors.state)}>
                      <option value="">Select State</option>
                      {indianStates.map((state) => <option key={state.isoCode} value={state.isoCode}>{state.name}</option>)}
                    </select>
                    <InputError message={errors.state} />
                  </div>
                  <div>
                    <label htmlFor="city" className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">City</label>
                    <select id="city" value={customCity ? "__other__" : formData.city}
                      onChange={handleCityChange} disabled={disabled || !selectedStateCode}
                      className={inputClass(errors.city)}>
                      <option value="">{selectedStateCode ? "Select City" : "Select state first"}</option>
                      {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                      <option value="__other__">Other / Add Custom City</option>
                    </select>
                    {customCity && (
                      <input type="text" name="city" value={formData.city} onChange={handleChange}
                        disabled={disabled} placeholder="Enter custom city name"
                        aria-label="Custom city" className={`${inputClass(errors.city)} mt-2`} />
                    )}
                    <InputError message={errors.city} />
                  </div>
                  {field({ name: "pincode", label: "Pincode", placeholder: "6-digit pincode", inputMode: "numeric", maxLength: 6 })}
                </div>
              </section>

              <section className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 xl:col-span-2">
                <div className="p-4 sm:p-5">
                  <SectionHeader icon={MapPinned} title="Hub Location" description="Enter coordinates or choose the hub location using the map." />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {field({ name: "latitude", label: "Latitude", placeholder: "23.4353453453", icon: Navigation, inputMode: "decimal" })}
                    {field({ name: "longitude", label: "Longitude", placeholder: "77.2090", icon: Navigation, inputMode: "decimal" })}
                  </div>
                </div>
                <div className="border-t border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950/40 sm:p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300"><Map className="h-4 w-4 text-[#0446DB]" /> Select location from map</p>
                    {(formData.latitude !== "" || formData.longitude !== "") && (
                      <span className="text-xs text-neutral-500">Lat: {formData.latitude || "—"} · Lng: {formData.longitude || "—"}</span>
                    )}
                  </div>
                  <div className="overflow-hidden rounded-md border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                    <GoogleMap fetchCurrentLocatipon={fetchCurrentLocatipon} />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Always visible bottom actions; no window/page scrollbar needed. */}
        <footer className="z-20 shrink-0 border-t border-neutral-200 bg-white px-3 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6">
          <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
            <p className="hidden text-xs text-neutral-500 dark:text-neutral-400 sm:block">Fields marked <span className="font-semibold text-red-500">*</span> are required. {isEdit ? "Leave password empty to keep the existing password." : "One hub is allowed per DC."}</p>
            <div className="flex w-full gap-2 sm:w-auto">
              <button type="button" onClick={handleReset} disabled={disabled}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 sm:flex-none">
                <RotateCcw className="h-4 w-4" /> {isEdit ? "Reset Changes" : "Reset"}
              </button>
              <button type="submit" disabled={disabled}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-[#0446DB] px-5 text-sm font-semibold text-white hover:bg-[#0339B8] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : !isEdit && createdHubId !== null ? <CheckCircle2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {submitting ? (isEdit ? "Updating Hub..." : "Creating Hub...") : isEdit ? "Update Hub" : createdHubId !== null ? "Hub Created" : "Create Hub"}
              </button>
            </div>
          </div>
        </footer>
      </form>
    </div>
  );
}
