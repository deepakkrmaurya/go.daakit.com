import React, { useState } from "react";
import { toast } from "react-toastify";
import { Building2, UserRound, LockKeyhole, Save, RotateCcw, Loader2, Eye, EyeOff, ShieldCheck, CheckCircle2 } from "lucide-react";
import AxiosInstance from "../../../Helper/axiosInstance";

const initialForm = { vendor_name: "", company_name: "", phone: "", email: "", password: "" };
const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
const companyRegex = /^[A-Za-z0-9][A-Za-z0-9 .,&'()/-]*$/;
const emailRegex = /^(?!.*\.\.)(?!\.)[A-Za-z0-9_%+-]+(?:\.[A-Za-z0-9_%+-]+)*@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;
const inputClass = "h-11 w-full rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-gray-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white";
const labelClass = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-neutral-300";

export default function DcVendorOnboarding({
  onboardEndpoint = "/api/dc/vendors", // Update prefix if your router is mounted elsewhere
  onOnboardSuccess,
}) {
  const [form, setForm] = useState({ ...initialForm });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const change = (name, raw) => {
    let value = raw;
    if (name === "vendor_name") value = raw.replace(/[^A-Za-z ]/g, "").replace(/ {2,}/g, " ").slice(0, 80);
    if (name === "company_name") value = raw.replace(/[^A-Za-z0-9 .,&'()/-]/g, "").replace(/ {2,}/g, " ").slice(0, 120);
    if (name === "phone") value = raw.replace(/\D/g, "").slice(0, 10);
    if (name === "email") value = raw.replace(/\s/g, "").slice(0, 254);
    // Limit by UTF-8 bytes, matching backend's Buffer.byteLength(password) rule.
    if (name === "password") {
      value = "";
      for (const char of raw) {
        if (new TextEncoder().encode(value + char).length > 72) break;
        value += char;
      }
    }
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    const vendor = form.vendor_name.trim();
    const company = form.company_name.trim();
    if (vendor.length < 2 || vendor.length > 80 || !nameRegex.test(vendor)) e.vendor_name = "Enter 2–80 letters; numbers and symbols are not allowed";
    if (company.length < 2 || company.length > 120 || !companyRegex.test(company)) e.company_name = "Enter a valid company name (2–120 characters)";
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Enter a valid 10-digit Indian mobile number";
    if (!emailRegex.test(form.email) || form.email.length > 254) e.email = "Enter a valid email address";
    const passwordBytes = new TextEncoder().encode(form.password).length;
    if (passwordBytes < 8 || passwordBytes > 72) e.password = "Password must be between 8 and 72 bytes";
    return e;
  };

  const submit = async event => {
    event.preventDefault();
    if (loading) return;
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      toast.error(Object.values(nextErrors)[0]);
      return;
    }
    const payload = {
      vendor_name: form.vendor_name.trim(),
      company_name: form.company_name.trim(),
      phone: form.phone,
      email: form.email.trim().toLowerCase(),
      password: form.password,
    };
    setLoading(true);
    try {
      const { data } = await AxiosInstance.post(onboardEndpoint, payload);
      if (data?.success === false) throw new Error(data.message || "Vendor onboarding failed");
      toast.success(data?.message || "Vendor onboarded successfully");
      setForm({ ...initialForm });
      setErrors({});
      onOnboardSuccess?.(data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to onboard vendor");
    } finally {
      setLoading(false);
    }
  };

  const field = (label, name, placeholder, options = {}) => (
    <div key={name} className={options.wide ? "sm:col-span-2" : ""}>
      <label htmlFor={`vendor-${name}`} className={labelClass}>{label} <span className="text-red-500">*</span></label>
      <div className="relative">
        <input
          id={`vendor-${name}`}
          name={name}
          type={name === "password" ? (showPassword ? "text" : "password") : options.type || "text"}
          inputMode={name === "phone" ? "numeric" : undefined}
          maxLength={name === "phone" ? 10 : name === "vendor_name" ? 80 : name === "company_name" ? 120 : name === "email" ? 254 : undefined}
          autoComplete={name === "password" ? "new-password" : name === "email" ? "email" : name === "phone" ? "tel" : "off"}
          value={form[name]}
          onChange={event => change(name, event.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `error-${name}` : undefined}
          className={`${inputClass} ${name === "password" ? "pr-11" : ""} ${errors[name] ? "border-red-500" : ""}`}
          required
        />
        {name === "password" && (
          <button type="button" onClick={() => setShowPassword(prev => !prev)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-neutral-400">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {errors[name] && <p id={`error-${name}`} className="mt-1 text-xs text-red-600">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#F7F8FA] px-4 py-5 dark:bg-neutral-950 sm:px-6 lg:py-7">
      <div className="mx-auto w-full ">
        <div className="mb-5 flex items-center gap-3">
          
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Vendor Onboarding</h1>
            <p className="text-sm text-gray-500 dark:text-neutral-400">Register a new vendor under your DC account</p>
          </div>
        </div>

        <form onSubmit={submit} noValidate className="overflow-hidden  rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="p-5 sm:p-7">
              <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-neutral-800">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-950/40"><UserRound size={19} /></div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">Vendor Information</h2>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">Business and contact details</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
                {field("Vendor Name", "vendor_name", "Enter vendor name")}
                {field("Company Name", "company_name", "Enter company name")}
                {field("Mobile Number", "phone", "10-digit mobile number")}
                {field("Email Address", "email", "vendor@example.com", { type: "email" })}
              </div>
            </section>

            <section className="border-t border-gray-100 bg-slate-50/60 p-5 dark:border-neutral-800 dark:bg-neutral-900/70 sm:p-7 lg:border-l lg:border-t-0">
              <div className="mb-6 flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-neutral-800">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-950/40"><LockKeyhole size={19} /></div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">Account Security</h2>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">Set up vendor login credentials</p>
                </div>
              </div>
              {field("Password", "password", "Enter a secure password")}
              
              <div className="mt-5 flex items-center gap-2 text-xs text-gray-500 dark:text-neutral-400">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                Vendor will be linked to your DC account.
              </div>
            </section>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-white px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-7">
            <p className="text-xs text-gray-500 dark:text-neutral-400"><span className="text-red-500">*</span> All fields are required</p>
            <div className="flex items-center gap-3">
              <button type="button" disabled={loading} onClick={() => { setForm({ ...initialForm }); setErrors({}); setShowPassword(false); }} className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"><RotateCcw size={16} /> Reset</button>
              <button type="submit" disabled={loading} className="inline-flex h-10 min-w-[164px] items-center justify-center gap-2 rounded-lg bg-[#0446DB] px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">{loading ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}{loading ? "Onboarding..." : "Onboard Vendor"}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
