import React, { useEffect, useState } from "react";
import axiosInstance from "@/Helper/axiosInstance";
import {
  Building2, UserRound, Mail, Phone, MapPin, Hash,
  CalendarDays, ShieldCheck, Loader2, AlertCircle, Clock3,
} from "lucide-react";

// View only. The only API request on this page is GET /api/dc/profile.
const display = (value) => value === null || value === undefined || value === "" ? "—" : String(value);

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata", day: "2-digit", month: "short",
    year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true,
  });
};

function InfoItem({ label, value, Icon }) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-100 bg-slate-50/60 px-3.5 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400">
        <Icon size={13} className="shrink-0 text-[#0446DB]" />
        {label}
      </div>
      <div title={display(value)} className="break-words text-sm font-semibold leading-5 text-slate-900 dark:text-white">
        {display(value)}
      </div>
    </div>
  );
}

export default function DcProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      try {
        const response = await axiosInstance.get("/api/dc/profile");
        if (!active) return;
        if (response.data?.success === false) {
          throw new Error(response.data?.message || "Unable to load DC profile");
        }
        setProfile(response.data?.data ?? null);
      } catch (err) {
        if (active) setError(err.response?.data?.message || err.message || "Unable to load DC profile");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProfile();
    return () => { active = false; };
  }, []);

  return (
    <div className="flex h-[calc(100dvh-80px)] min-h-0 w-full flex-col overflow-hidden bg-[#f6f8fc] text-slate-900 dark:bg-neutral-950 dark:text-white">
      {/* Fixed page heading */}
      <header className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-950/40">
          <Building2 size={21} />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-bold tracking-tight sm:text-xl">Distribution Center Profile</h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400">DC account information · View only</p>
        </div>
      </header>

      {/* Compact content; the page itself never scrolls. Small screens can scroll inside this area. */}
      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 lg:overflow-hidden lg:p-5">
        {loading ? (
          <div className="flex h-full items-center justify-center gap-2 text-sm text-slate-500">
            <Loader2 size={19} className="animate-spin text-[#0446DB]" /> Loading profile...
          </div>
        ) : error ? (
          <div role="alert" className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} className="shrink-0" /> {error}
          </div>
        ) : !profile ? (
          <p className="py-12 text-center text-sm text-slate-500">No profile found.</p>
        ) : (
          <div className="mx-auto flex  min-h-0 w-full max-w-6xl flex-col gap-3 lg:gap-4">
            {/* Compact identity strip */}
            <section className="flex shrink-0 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#0446DB] text-white">
                  <Building2 size={22} />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-base font-bold sm:text-lg">{display(profile.dc_name)}</h2>
                  <p className="mt-0.5 text-xs text-slate-500">DC Code: {display(profile.dc_code)} <span className="mx-1">·</span> ID: {display(profile.id)}</p>
                </div>
              </div>
              <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${Number(profile.is_active) === 1 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"}`}>
                <ShieldCheck size={14} /> {Number(profile.is_active) === 1 ? "Active" : "Inactive"}
              </span>
            </section>

            <section className="min-h-0 flex-1 rounded-xl border border-slate-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900 sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold">Center Details</h3>
                <span className="text-[11px] text-slate-400">Read-only information</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                <InfoItem label="DC Name" value={profile.dc_name} Icon={Building2} />
                <InfoItem label="DC Code" value={profile.dc_code} Icon={Hash} />
                <InfoItem label="Username" value={profile.username} Icon={UserRound} />
                <InfoItem label="Email Address" value={profile.email} Icon={Mail} />
                <InfoItem label="Phone Number" value={profile.phone} Icon={Phone} />
                <InfoItem label="Pincode" value={profile.pincode} Icon={Hash} />
                <InfoItem label="City" value={profile.city} Icon={MapPin} />
                <InfoItem label="State" value={profile.state} Icon={MapPin} />
                 <InfoItem label="Full Address" value={profile.address} Icon={MapPin} />
                
              </div>
            </section>

            
          </div>
        )}
      </main>
    </div>
  );
}
