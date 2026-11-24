import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, LogOut, Mail, LockKeyhole } from "lucide-react";

export default function NoPermissionPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Only clear the current user-panel client state. If your app has a
    // server-side logout endpoint, call it in your shared logout handler.
    localStorage.removeItem("token");
    localStorage.removeItem("permission");
    localStorage.removeItem("userType");
    navigate("/login/user", { replace: true });
  };

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#f5f7fb] px-4 py-8 dark:bg-gray-950">
      <div className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.07)] dark:border-gray-800 dark:bg-gray-900">
        <div className="h-1.5 w-full bg-[#0446DB]" />
        <div className="px-6 pb-7 pt-9 text-center sm:px-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-[#0446DB] dark:border-blue-900 dark:bg-blue-950">
            <ShieldAlert size={30} strokeWidth={1.8} />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#0446DB]">Access restricted</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-[28px]">
            No permissions assigned
          </h1>
          <p className="mx-auto mt-3 max-w-[395px] text-sm leading-6 text-slate-500 dark:text-slate-400">
            Your account is signed in, but you don't currently have access to any user-panel modules.
            Please contact your administrator to request the required role permissions.
          </p>

          <div className="mt-7 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left dark:border-gray-700 dark:bg-gray-800/50">
            <LockKeyhole className="mt-0.5 shrink-0 text-[#0446DB]" size={18} />
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">Administrator action required</p>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Ask your administrator to assign the appropriate permissions and then sign in again.
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <ArrowLeft size={16} /> Go back
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#0446DB] px-4 text-sm font-semibold text-white transition hover:bg-[#0338b5]"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
          <p className="mt-6 inline-flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Mail size={14} /> Contact your system administrator for access.
          </p>
        </div>
      </div>
    </main>
  );
}
