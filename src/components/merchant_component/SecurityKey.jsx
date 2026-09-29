// import axios from 'axios';
// import React, { useEffect, useState } from 'react'
// import { toast } from 'react-toastify';
// const baseURL = import.meta.env.VITE_BASE_URL;
// function SecurityKey() {
//     const [profile, setProfile] = useState({});
//     const maskSensitiveData = (data) => {
//         if (!data) return '';
//         if (data.length <= 16) return data;
//         return data.substring(0, 8) + '*' + data.substring(data.length - 8);
//     };
//       const getMerchantProfile = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/api/merchant/getMerchantProfile`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setProfile(res.data.data || {});
//     } catch (err) {
//       console.error('profile', err);
//     }
//   };
//   const handleCopy = (text) => {
//       navigator.clipboard.writeText(text);
//       toast.success('Copied to clipboard!');
//     };

//   useEffect(() => {
//     getMerchantProfile();
//   }, []);
//     return (
//         <div className="bg-[#EEEEEE] min-h-screen w-full">
//             {/* Heading Strip */}
//             <div className="relative z-0 mb-6 bg-[#0446DB] py-[33px] shadow-md h-38 px-[24px]">
//                 <div className="flex flex-wrap items-center justify-between w-full">
//                     {/* Heading */}
//                     <h1 className="text-2xl text-white">Security key</h1>
//                 </div>
//             </div>
//             <div className="px-2 z-99 ">
//                 <div className="-mt-16 md:-mt-24 relative ">
//                     <div className="space-y-6">
//                         <div className="space-y-4 bg-white px-4 py-6 rounded">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">Merchant Key</label>
//                                 <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
//                                     <div className="flex-1 bg-gray-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 overflow-x-auto">
//                                         <code className="text-xs sm:text-sm font-mono text-gray-900 whitespace-nowrap">
//                                             {maskSensitiveData(profile.merchant_key)}
//                                         </code>
//                                     </div>
//                                     <button
//                                         onClick={() => handleCopy(profile.merchant_key)}
//                                         className="px-4 py-2 cursor-pointer bg-[#0446DB] text-white rounded-lg  transition-colors text-sm sm:text-base whitespace-nowrap"
//                                     >
//                                         Copy
//                                     </button>
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
//                                 <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
//                                     <div className="flex-1 bg-gray-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 overflow-x-auto">
//                                         <code className="text-xs sm:text-sm font-mono text-gray-900 whitespace-nowrap">
//                                             {maskSensitiveData(profile.secret_key)}
//                                         </code>
//                                     </div>
//                                     <button
//                                         onClick={() => handleCopy(profile.secret_key)}
//                                         className="px-4 cursor-pointer  py-2 bg-[#0446DB] text-white rounded-lg  transition-colors text-sm sm:text-base whitespace-nowrap"
//                                     >
//                                         Copy
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default SecurityKey



import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  AlertTriangle,
  Check,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;

function SecurityKey() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  const [showMerchantKey, setShowMerchantKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const [copiedKey, setCopiedKey] = useState("");

  /* =====================================================
     MASK KEY
  ===================================================== */

  const maskSensitiveData = (data) => {
    if (!data) return "Not available";

    if (data.length <= 16) {
      return "•".repeat(Math.max(data.length, 8));
    }

    return (
      data.substring(0, 8) +
      "••••••••••••••••" +
      data.substring(data.length - 8)
    );
  };

  /* =====================================================
     GET PROFILE
  ===================================================== */

  const getMerchantProfile = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${baseURL}/api/merchant/getMerchantProfile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      setProfile(res?.data?.data || {});
    } catch (err) {
      console.error("profile", err);

      toast.error(
        err?.response?.data?.message ||
          "Failed to load security keys"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     COPY
  ===================================================== */

  const handleCopy = async (text, type) => {
    if (!text) {
      toast.error("Key is not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);

      setCopiedKey(type);

      toast.success("Copied to clipboard!");

      setTimeout(() => {
        setCopiedKey("");
      }, 2000);
    } catch (error) {
      toast.error("Unable to copy key");
    }
  };

  useEffect(() => {
    getMerchantProfile();
  }, []);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="flex min-h-[90vh] w-full items-center justify-center bg-[#F7F8FA] dark:bg-neutral-950">
        <div className="flex flex-col items-center">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-[#0446DB]/10" />

            <div className="absolute inset-0 animate-ping rounded-2xl bg-[#0446DB]/5" />

            <Loader2 className="relative z-10 h-7 w-7 animate-spin text-[#0446DB]" />
          </div>

          <h2 className="mt-5 text-base font-semibold text-gray-900 dark:text-white">
            Loading Security Keys
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            Retrieving your credentials securely...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-neutral-950">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* LEFT */}

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0446DB]/10">
                <KeyRound className="h-5 w-5 text-[#0446DB]" />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
                  Security Keys
                </h1>

                <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                  Manage and securely access your API credentials
                </p>
              </div>
            </div>

            {/* SECURITY BADGE */}

            <div className="flex w-fit items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 dark:border-green-500/20 dark:bg-green-500/10">
              <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />

              <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                Secure Credentials
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        {/* ===================================================
            SECURITY NOTICE
        =================================================== */}

        <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-300">
              Keep your credentials secure
            </h3>

            <p className="mt-1 text-xs leading-5 text-amber-700 dark:text-amber-400/80">
              Never share your Secret Key publicly or include it
              directly in frontend/client-side code. Treat these
              credentials like a password.
            </p>
          </div>
        </div>

        {/* ===================================================
            CREDENTIAL CARD
        =================================================== */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          {/* CARD HEADER */}

          <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 dark:border-neutral-800 sm:px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0446DB]/10">
              <LockKeyhole className="h-5 w-5 text-[#0446DB]" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                API Credentials
              </h2>

              <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                Credentials used to authenticate API requests
              </p>
            </div>
          </div>

          {/* KEYS */}

          <div className="space-y-6 p-5 sm:p-6">
            {/* MERCHANT KEY */}

            <CredentialField
              title="Merchant Key"
              description="Public identifier for your merchant account."
              value={profile?.merchant_key}
              maskedValue={maskSensitiveData(
                profile?.merchant_key
              )}
              show={showMerchantKey}
              setShow={setShowMerchantKey}
              copied={copiedKey === "merchant"}
              onCopy={() =>
                handleCopy(
                  profile?.merchant_key,
                  "merchant"
                )
              }
            />

            {/* DIVIDER */}

            <div className="border-t border-gray-100 dark:border-neutral-800" />

            {/* SECRET KEY */}

            <CredentialField
              title="Secret Key"
              description="Private credential used for secure authentication."
              value={profile?.secret_key}
              maskedValue={maskSensitiveData(
                profile?.secret_key
              )}
              show={showSecretKey}
              setShow={setShowSecretKey}
              copied={copiedKey === "secret"}
              onCopy={() =>
                handleCopy(
                  profile?.secret_key,
                  "secret"
                )
              }
              secret
            />
          </div>
        </div>

        {/* ===================================================
            BOTTOM INFO
        =================================================== */}

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <SecurityInfo
            icon={ShieldCheck}
            title="Protect your Secret Key"
            description="Store your secret key on your server and never expose it in browser code."
          />

          <SecurityInfo
            icon={LockKeyhole}
            title="Use Secure Connections"
            description="Use your credentials only with secure HTTPS connections and trusted services."
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CREDENTIAL FIELD
========================================================= */

const CredentialField = ({
  title,
  description,
  value,
  maskedValue,
  show,
  setShow,
  copied,
  onCopy,
  secret = false,
}) => {
  return (
    <div>
      {/* LABEL */}

      <div className="mb-2.5 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
              {title}
            </label>

            {secret && (
              <span className="rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-600 dark:bg-red-500/10 dark:text-red-400">
                Private
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
            {description}
          </p>
        </div>
      </div>

      {/* KEY BOX */}

      <div
        className={`
          flex
          flex-col
          overflow-hidden
          rounded-xl
          border
          bg-gray-50
          transition-all

          focus-within:border-[#0446DB]
          focus-within:ring-2
          focus-within:ring-[#0446DB]/10

          dark:bg-neutral-950

          ${
            secret
              ? "border-gray-200 dark:border-neutral-700"
              : "border-gray-200 dark:border-neutral-700"
          }

          sm:flex-row
          sm:items-center
        `}
      >
        {/* VALUE */}

        <div className="min-w-0 flex-1 px-4 py-3.5">
          <code className="block overflow-x-auto whitespace-nowrap font-mono text-sm font-medium text-gray-700 dark:text-neutral-300">
            {show
              ? value || "Not available"
              : maskedValue}
          </code>
        </div>

        {/* ACTIONS */}

        <div className="flex items-center gap-1 border-t border-gray-200 bg-white p-1.5 dark:border-neutral-700 dark:bg-neutral-900 sm:border-l sm:border-t-0">
          {/* SHOW/HIDE */}

          <button
            type="button"
            onClick={() => setShow(!show)}
            disabled={!value}
            title={show ? "Hide key" : "Show key"}
            className="flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-40 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            {show ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span className="hidden lg:inline">
                  Hide
                </span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span className="hidden lg:inline">
                  Show
                </span>
              </>
            )}
          </button>

          {/* COPY */}

          <button
            type="button"
            onClick={onCopy}
            disabled={!value}
            className={`
              flex
              h-9
              items-center
              gap-2
              rounded-lg
              px-3
              text-xs
              font-semibold
              transition-all
              disabled:cursor-not-allowed
              disabled:opacity-40

              ${
                copied
                  ? `
                    bg-green-50
                    text-green-600

                    dark:bg-green-500/10
                    dark:text-green-400
                  `
                  : `
                    bg-[#0446DB]
                    text-white

                    hover:bg-[#033BB9]
                  `
              }
            `}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   SECURITY INFO CARD
========================================================= */

const SecurityInfo = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-neutral-800">
        <Icon className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-neutral-400">
          {description}
        </p>
      </div>
    </div>
  );
};

export default SecurityKey;