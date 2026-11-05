import React, { useMemo, useRef, useState } from "react";

import axios from "axios";

import CreatableSelect from "react-select/creatable";

import { toast } from "react-toastify";

import { City } from "country-state-city";

import { Download, Upload, UserPlus, RotateCcw, Eye, EyeOff, Loader2 } from "lucide-react";

import AxiosInstance from "../../../Helper/axiosInstance";

const baseUrl = import.meta.env.VITE_BASE_URL || "";

const initialForm = {
  name: "",

  email: "",

  phone_number: "",

  password: "",

  facility_city: "",
};

const inputClass =
  "h-11 w-full rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-gray-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white";

// Supply the exact route registered in your DC Express router.

export default function DcRiderOnboarding({
  onboardEndpoint = "/api/dc/riders",

  csvImportEndpoint,

  csvSampleEndpoint,

  onOnboardSuccess,
}) {
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(false);

  const [csvLoading, setCsvLoading] = useState(false);

  const [sampleLoading, setSampleLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const fileRef = useRef(null);

  const cityOptions = useMemo(() => {
    const names = new Map();

    City.getCitiesOfCountry("IN")?.forEach((city) => {
      const name = city.name?.trim();

      if (name && !names.has(name.toLocaleLowerCase("en-IN"))) {
        names.set(name.toLocaleLowerCase("en-IN"), {
          value: name,

          label: name,
        });
      }
    });

    return [...names.values()].sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const selectStyles = {
    control: (base, state) => ({
      ...base,

      minHeight: 44,

      borderRadius: 8,

      borderColor: state.isFocused ? "#0446DB" : "#d1d5db",

      boxShadow: state.isFocused ? "0 0 0 2px rgba(4,70,219,.12)" : "none",

      "&:hover": { borderColor: "#0446DB" },
    }),

    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  const authHeaders = () => {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("Session expired. Please log in again.");

    return { Authorization: `Bearer ${token}` };
  };

  const errorMessage = (err, fallback) => err?.response?.data?.message || err?.message || fallback;

  const resetForm = () => {
    setForm({ ...initialForm });

    setShowPassword(false);
  };

  const cleanName = (value) =>
    value

      .replace(/[^A-Za-z ]/g, "")

      .replace(/\s{2,}/g, " ")

      .slice(0, 80);

  const cleanCity = (value) =>
    value

      .replace(/[^A-Za-z ]/g, "")

      .replace(/\s{2,}/g, " ")

      .trim()

      .slice(0, 100);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        name === "phone_number"
          ? value.replace(/\D/g, "").slice(0, 10)
          : name === "name"
            ? cleanName(value)
            : name === "email"
              ? value.replace(/\s/g, "").slice(0, 254)
              : name === "password"
                ? value.slice(0, 72)
                : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const name = form.name.trim();

    const email = form.email.trim().toLowerCase();

    const phone = form.phone_number.trim();

    if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(name) || name.length < 2 || name.length > 80)
      return toast.error("Rider name must be 2–80 letters (A–Z), with spaces only between words");

    console.log(email);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email.trim())) {
      return toast.error("Please enter a valid email address");
    }

    if (!/^[6-9]\d{9}$/.test(phone))
      return toast.error("Please enter a valid 10-digit Indian phone number");

    if (
      !/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(form.facility_city.trim()) ||
      form.facility_city.trim().length > 100
    )
      return toast.error("Facility city must contain only letters and spaces (max 100)");

    setLoading(true);

    try {
      const payload = {
        name,

        email,

        phone,

        password: form.password,

        facility_city: form.facility_city.trim(),
      };

      const { data } = await AxiosInstance.post(`${onboardEndpoint}`, payload);

      if (data?.success === false) throw new Error(data.message || "Rider onboarding failed");

      toast.success(data?.message || "DC rider onboarded successfully");

      resetForm();

      onOnboardSuccess?.(data);
    } catch (err) {
      toast.error(errorMessage(err, "Error onboarding DC rider"));
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = async (e) => {
    const input = e.currentTarget;

    const file = input.files?.[0];

    if (!file) return; // Validate CSV extension

    if (!/\.csv$/i.test(file.name)) {
      toast.error("Please choose a valid CSV file");

      input.value = "";

      return;
    } // Validate MIME type

    const allowedTypes = [
      "text/csv",

      "application/vnd.ms-excel",

      "text/plain",

      "application/csv",

      "application/octet-stream",

      "",
    ];

    if (!allowedTypes.includes((file.type || "").toLowerCase())) {
      toast.error("Invalid CSV file format");

      input.value = "";

      return;
    } // Validate file size

    const maxSize = 5 * 1024 * 1024;

    if (file.size === 0 || file.size > maxSize) {
      toast.error("CSV file must be non-empty and at most 5 MB");

      input.value = "";

      return;
    }

    setCsvLoading(true);

    try {
      const body = new FormData();

      body.append("file", file);

      const { data } = await AxiosInstance.post(
        `/api/dc/bulkOnboardRidersCSV`,

        body,
      );

      if (data?.success === false) {
        throw new Error(data.message || "CSV import failed");
      }

      const uploaded = Number(data?.uploaded ?? 0);

      const failedCount = Number(data?.failedcount_ ?? 0);

      if (uploaded > 0) {
        toast.success(`${uploaded} rider(s) imported successfully`);
      }

      if (failedCount > 0) {
        toast.error(`${failedCount} rider(s) failed to import`);

        console.table(data?.failed || []);
      }

      if (uploaded === 0 && failedCount === 0) {
        toast(data?.message || "CSV processing completed");
      }
    } catch (err) {
      toast.error(errorMessage(err, "Error importing rider CSV"));
    } finally {
      setCsvLoading(false);

      input.value = "";
    }
  };

  const downloadSample = async () => {
    setSampleLoading(true);

    try {
      const response = await AxiosInstance.get("/api/dc/generateRiderSampleCSV", {
        responseType: "blob",
      });

      const url = URL.createObjectURL(response.data);

      const a = document.createElement("a");

      a.href = url;

      a.download = "DC_Rider_Onboarding_Sample.csv";

      document.body.appendChild(a);

      a.click();

      a.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1000);

      toast.success("Sample CSV downloaded");
    } catch (err) {
      toast.error(errorMessage(err, "Error downloading sample CSV"));
    } finally {
      setSampleLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100dvh-100px)] min-h-0 w-full flex-col overflow-hidden bg-[#F7F8FA] dark:bg-neutral-950">
                 {" "}
      <div className="z-20 flex shrink-0 flex-col gap-3 border-b border-gray-200 bg-[#F7F8FA] px-3 py-3 sm:px-5 sm:py-4 lg:flex-row lg:items-center lg:justify-between dark:border-neutral-800 dark:bg-neutral-950">
                       {" "}
        <div>
                             {" "}
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Rider Onboarding          {" "}
          </h1>
                             {" "}
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                        Add a new DC rider or import riders using CSV          {" "}
          </p>
                           {" "}
        </div>
                       {" "}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
                             {" "}
          {/* <button
            type="button"
            onClick={downloadSample}
            disabled={sampleLoading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-3 text-xs font-medium text-[#0446DB] transition hover:bg-blue-50 disabled:opacity-60 sm:px-4 sm:text-sm"
          >
                                   {" "}
            {sampleLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}{" "}
                        Sample CSV                    {" "}
          </button> */}
                             {" "}
          {/* <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={csvLoading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0446DB] px-3 text-xs font-medium text-white transition hover:bg-blue-700 disabled:opacity-60 sm:px-4 sm:text-sm"
          >
                                   {" "}
            {csvLoading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}    
                    Upload CSV                    {" "}
          </button>
                             {" "}
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleCsvUpload}
          /> */}
                           {" "}
        </div>
                     {" "}
      </div>
                 {" "}
      <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col overflow-hidden px-2 py-3 sm:px-5 sm:py-4 lg:px-6">
                       {" "}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                             {" "}
          <div className="shrink-0 border-b border-gray-200 px-4 py-3 dark:border-neutral-800 sm:px-6 sm:py-4">
                                   {" "}
            <div className="flex items-center gap-2">
                            <UserPlus size={19} className="text-[#0446DB]" />                       
                 {" "}
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                                Rider Information              {" "}
              </h2>
                                       {" "}
            </div>
                                   {" "}
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                            Enter rider details to create a DC rider account.            {" "}
            </p>
                                 {" "}
          </div>
                             {" "}
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
                                     {" "}
              <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
                                           {" "}
                <div>
                                                 {" "}
                  <label
                    htmlFor="rider-name"
                    className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-neutral-300"
                  >
                                      Rider Name <span className="text-red-500">*</span>           
                       {" "}
                  </label>
                                                 {" "}
                  <input
                    id="rider-name"
                    name="name"
                    type="text"
                    maxLength={80}
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter rider name"
                    autoComplete="name"
                    className={inputClass}
                    required
                  />
                                               {" "}
                </div>
                                           {" "}
                <div>
                                                 {" "}
                  <label
                    htmlFor="rider-email"
                    className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-neutral-300"
                  >
                                      Email Address <span className="text-red-500">*</span>         
                         {" "}
                  </label>
                                                 {" "}
                  <input
                    id="rider-email"
                    name="email"
                    type="email"
                    maxLength={254}
                    value={form.email}
                    onChange={handleChange}
                    placeholder="rider\@example.com"
                    autoComplete="email"
                    className={inputClass}
                    required
                  />
                                               {" "}
                </div>
                                           {" "}
                <div>
                                                 {" "}
                  <label
                    htmlFor="rider-phone"
                    className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-neutral-300"
                  >
                                      Phone Number <span className="text-red-500">*</span>         
                         {" "}
                  </label>
                                                 {" "}
                  <input
                    id="rider-phone"
                    name="phone_number"
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.phone_number}
                    onChange={handleChange}
                    placeholder="Enter 10-digit phone number"
                    autoComplete="tel"
                    className={inputClass}
                    required
                  />
                                               {" "}
                </div>
                                           {" "}
                <div>
                                                 {" "}
                  <label
                    htmlFor="rider-password"
                    className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-neutral-300"
                  >
                                      Password <span className="text-red-500">*</span>             
                     {" "}
                  </label>
                                                 {" "}
                  <div className="relative">
                                                       {" "}
                    <input
                      id="rider-password"
                      name="password"
                      maxLength={72}
                      minLength={6}
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      autoComplete="new-password"
                      className={`${inputClass} pr-12`}
                      required
                    />
                                                       {" "}
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    >
                                                             {" "}
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}                     
                                     {" "}
                    </button>
                                                     {" "}
                  </div>
                                               {" "}
                </div>
                                           {" "}
                <div className="md:col-span-2">
                                                 {" "}
                  <label
                    htmlFor="rider-city"
                    className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-neutral-300"
                  >
                                      Facility City                  {" "}
                    <span className="text-red-500">*</span>                              {" "}
                  </label>
                                                 {" "}
                  <CreatableSelect
                    inputId="rider-city"
                    options={cityOptions}
                    isSearchable
                    isClearable
                    styles={selectStyles}
                    menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                    menuPosition="fixed"
                    value={
                      form.facility_city
                        ? { value: form.facility_city, label: form.facility_city }
                        : null
                    }
                    placeholder="Search any Indian city or type a new city..."
                    formatCreateLabel={(value) => `Add custom city: ${value}`}
                    isValidNewOption={(value) =>
                      Boolean(cleanCity(value)) &&
                      /^[A-Za-z ]+$/.test(value.trim()) &&
                      !cityOptions.some(
                        (city) =>
                          city.value.toLocaleLowerCase("en-IN") ===
                          value.trim().toLocaleLowerCase("en-IN"),
                      )
                    }
                    onChange={(option) =>
                      setForm((prev) => ({
                        ...prev,

                        facility_city: cleanCity(option?.value || ""),
                      }))
                    }
                    onCreateOption={(value) =>
                      setForm((prev) => ({
                        ...prev,

                        facility_city: cleanCity(value),
                      }))
                    }
                    noOptionsMessage={() => "City not found — type its name to add it"}
                  />
                                                 {" "}
                  <p className="mt-1.5 text-xs text-gray-400">
                                      All available Indian cities are searchable. If yours is      
                                missing, type its name and select Add custom city.              
                     {" "}
                  </p>
                                               {" "}
                </div>
                                         {" "}
              </div>
                                     {" "}
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-gray-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:gap-3 sm:px-6">
                                         {" "}
              <button
                type="button"
                disabled={loading}
                onClick={resetForm}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 sm:flex-none sm:px-5"
              >
                                <RotateCcw size={16} /> Reset                            {" "}
              </button>
                                         {" "}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#0446DB] px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 sm:flex-none sm:min-w-[155px] sm:px-5"
              >
                                               {" "}
                {loading ? <Loader2 size={17} className="animate-spin" /> : <UserPlus size={17} />} 
                              {loading ? "Onboarding..." : "Onboard Rider"}                         
                   {" "}
              </button>
                                       {" "}
            </div>
                                 {" "}
          </form>
                           {" "}
        </div>
                     {" "}
      </div>
               {" "}
    </div>
  );
}
