import React, { useEffect, useState } from "react";
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";

import AxiosInstance from "../../../Helper/axiosInstance";

function TechSecurityKey() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  const [copied, setCopied] = useState({
    merchant: false,
    secret: false,
  });

  const [showKey, setShowKey] = useState({
    merchant: false,
    secret: false,
  });

  // =========================================================
  // GET MERCHANT PROFILE
  // =========================================================

  const getMerchantProfile = async () => {
    try {
      setLoading(true);

      const res = await AxiosInstance.get(
        "/api/tech-merchant/getMerchantProfile"
      );

      setProfile(res?.data?.data || {});
    } catch (error) {
      console.error("Profile Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load security keys"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // MASK KEY
  // =========================================================

  const maskSensitiveData = (data) => {
    if (!data) return "Not available";

    const value = String(data);

    if (value.length <= 12) {
      return "•".repeat(value.length);
    }

    return `${value.substring(0, 8)}${"•".repeat(
      Math.min(16, value.length - 16)
    )}${value.substring(value.length - 8)}`;
  };

  // =========================================================
  // COPY
  // =========================================================

  const handleCopy = async (text, type) => {
    if (!text) {
      toast.error("Key is not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);

      setCopied((prev) => ({
        ...prev,
        [type]: true,
      }));

      toast.success("Copied to clipboard");

      setTimeout(() => {
        setCopied((prev) => ({
          ...prev,
          [type]: false,
        }));
      }, 2000);
    } catch (error) {
      console.error("Copy Error:", error);
      toast.error("Unable to copy key");
    }
  };

  // =========================================================
  // SHOW / HIDE
  // =========================================================

  const toggleVisibility = (type) => {
    setShowKey((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  useEffect(() => {
    getMerchantProfile();
  }, []);

  // =========================================================
  // LOADER
  // =========================================================

   const [loadingPage, setLoadingPage] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingPage(false);
    }, 2000);
  
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div
        className="
          flex
          min-h-[calc(100vh-100px)]
          w-full
          items-center
          justify-center
          bg-[#F7F8FA]
          dark:bg-neutral-950
        "
      >
        <div className="flex flex-col items-center justify-center">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-sm
              bg-[#0446DB]/10
              dark:bg-[#0446DB]/20
            "
          >
            <Loader2 className="h-6 w-6 animate-spin text-[#0446DB]" />
          </div>

          <p className="mt-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Loading security keys...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
     {
      loadingPage ?(
        <div className=" w-full h-[90vh] flex justify-center items-center">
          <div>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2"> Loading security keys...</p>
          </div>
        </div>
      ):(

    <div
      className="
        min-h-full
        w-full
        bg-[#F7F8FA]
        px-3
        py-4

        sm:px-5
        sm:py-5

        lg:px-6

        dark:bg-neutral-950
      "
    >
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-6">
        <div className="flex items-start gap-3">
         

          <div>
            <h1
              className="
                text-xl
                font-bold
                tracking-tight
                text-neutral-900

                sm:text-2xl

                dark:text-white
              "
            >
              Security Keys
            </h1>

            <p
              className="
                mt-1
                max-w-2xl
                text-sm
                leading-5
                text-neutral-500

                dark:text-neutral-400
              "
            >
              Manage your merchant credentials used for secure API
              authentication.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="mx-auto w-full ">
        {/* SECURITY WARNING */}

        <div
          className="
            mb-5
            flex
            items-start
            gap-3

            rounded-sm
            border
            border-blue-100

            bg-blue-50/70

            p-4

            dark:border-blue-900/40
            dark:bg-blue-950/20
          "
        >
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-sm
              bg-[#0446DB]/10

              dark:bg-[#0446DB]/20
            "
          >
            <LockKeyhole className="h-4 w-4 text-[#0446DB] dark:text-blue-400" />
          </div>

          <div className="min-w-0">
            <h3
              className="
                text-sm
                font-semibold
                text-neutral-900

                dark:text-white
              "
            >
              Keep your credentials secure
            </h3>

            <p
              className="
                mt-1
                text-sm
                leading-5
                text-neutral-600

                dark:text-neutral-400
              "
            >
              Never share your Secret Key publicly or expose it in
              frontend code, screenshots, Git repositories, or public
              documentation.
            </p>
          </div>
        </div>

        {/* ===================================================
            SECURITY CARD
        ==================================================== */}

        <div
          className="
            overflow-hidden
            rounded-sm

            border
            border-neutral-200

            bg-white

            shadow-sm

            dark:border-neutral-800
            dark:bg-neutral-900
          "
        >
          {/* CARD HEADER */}

          <div
            className="
              flex
              items-center
              gap-3

              border-b
              border-neutral-200

              px-4
              py-4

              sm:px-5

              dark:border-neutral-800
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-sm

                bg-[#0446DB]/10

                dark:bg-[#0446DB]/20
              "
            >
              <KeyRound className="h-5 w-5 text-[#0446DB] dark:text-blue-400" />
            </div>

            <div>
              <h2
                className="
                  text-base
                  font-semibold
                  text-neutral-900

                  dark:text-white
                "
              >
                API Credentials
              </h2>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-neutral-500

                  sm:text-sm

                  dark:text-neutral-400
                "
              >
                Credentials associated with your merchant account
              </p>
            </div>
          </div>

          {/* CARD BODY */}

          <div className="space-y-6 p-4 sm:p-5 lg:p-6">
            {/* =================================================
                MERCHANT KEY
            ================================================== */}

            <SecurityKeyField
              title="Merchant Key"
              description="Public identifier for your merchant account."
              value={profile?.merchant_key}
              displayedValue={
                showKey.merchant
                  ? profile?.merchant_key || "Not available"
                  : maskSensitiveData(profile?.merchant_key)
              }
              visible={showKey.merchant}
              copied={copied.merchant}
              onToggle={() => toggleVisibility("merchant")}
              onCopy={() =>
                handleCopy(profile?.merchant_key, "merchant")
              }
            />

            {/* DIVIDER */}

            <div className="h-px w-full bg-neutral-100 dark:bg-neutral-800" />

            {/* =================================================
                SECRET KEY
            ================================================== */}

            <SecurityKeyField
              title="Secret Key"
              description="Private credential used to authenticate secure requests."
              value={profile?.secret_key}
              displayedValue={
                showKey.secret
                  ? profile?.secret_key || "Not available"
                  : maskSensitiveData(profile?.secret_key)
              }
              visible={showKey.secret}
              copied={copied.secret}
              onToggle={() => toggleVisibility("secret")}
              onCopy={() =>
                handleCopy(profile?.secret_key, "secret")
              }
            />
          </div>
        </div>

        {/* BOTTOM INFO */}

        <div
          className="
            mt-4
            flex
            items-center
            gap-2

            text-xs
            text-neutral-500

            dark:text-neutral-500
          "
        >
          <ShieldCheck className="h-4 w-4 shrink-0 text-[#0446DB]" />

          <span>
            Your credentials are hidden by default for security.
          </span>
        </div>
      </div>
    </div>
      )
     }
    </>
  );
}

// =============================================================
// SECURITY KEY FIELD
// =============================================================

function SecurityKeyField({
  title,
  description,
  value,
  displayedValue,
  visible,
  copied,
  onToggle,
  onCopy,
}) {
  return (
    <div>
      {/* LABEL */}

      <div className="mb-2.5">
        <div className="flex items-center gap-2">
          <label
            className="
              text-sm
              font-semibold
              text-neutral-800

              dark:text-neutral-200
            "
          >
            {title}
          </label>

          <span
            className="
              rounded-full
              bg-neutral-100

              px-2
              py-0.5

              text-[10px]
              font-semibold
              uppercase
              tracking-wide
              text-neutral-500

              dark:bg-neutral-800
              dark:text-neutral-400
            "
          >
            Sensitive
          </span>
        </div>

        <p
          className="
            mt-1
            text-xs
            text-neutral-500

            dark:text-neutral-400
          "
        >
          {description}
        </p>
      </div>

      {/* KEY BOX */}

      <div
        className="
          flex
          w-full
          min-w-0
          flex-col
          gap-2

          sm:flex-row
          sm:items-center
        "
      >
        <div
          className="
            group
            flex
            h-11
            min-w-0
            flex-1
            items-center

            rounded-sm

            border
            border-neutral-200

            bg-neutral-50

            transition-all

            focus-within:border-[#0446DB]
            focus-within:ring-2
            focus-within:ring-[#0446DB]/10

            dark:border-neutral-700
            dark:bg-neutral-950
          "
        >
          {/* LOCK ICON */}

          <div
            className="
              flex
              h-full
              w-11
              shrink-0
              items-center
              justify-center

              border-r
              border-neutral-200

              text-neutral-400

              dark:border-neutral-700
              dark:text-neutral-500
            "
          >
            <LockKeyhole className="h-4 w-4" />
          </div>

          {/* KEY */}

          <div className="min-w-0 flex-1 overflow-hidden px-3">
            <code
              className="
                block
                overflow-x-auto

                whitespace-nowrap

                font-mono
                text-xs
                font-medium
                text-neutral-700

                scrollbar-none

                sm:text-sm

                dark:text-neutral-300
              "
            >
              {displayedValue}
            </code>
          </div>

          {/* SHOW / HIDE */}

          <button
            type="button"
            onClick={onToggle}
            disabled={!value}
            title={visible ? "Hide key" : "Show key"}
            className="
              mr-1
              grid
              h-9
              w-9
              shrink-0
              place-items-center

              rounded-md

              text-neutral-400

              transition-colors

              hover:bg-neutral-200/70
              hover:text-[#0446DB]

              disabled:cursor-not-allowed
              disabled:opacity-40

              dark:hover:bg-neutral-800
              dark:hover:text-blue-400
            "
          >
            {visible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* COPY BUTTON */}

        <button
          type="button"
          onClick={onCopy}
          disabled={!value}
          className={`
            flex
            h-11
            shrink-0
            items-center
            justify-center
            gap-2

            rounded-sm

            px-4

            text-sm
            font-semibold

            shadow-sm

            transition-all
            duration-200

            disabled:cursor-not-allowed
            disabled:opacity-50

            sm:min-w-[105px]

            ${
              copied
                ? `
                  bg-emerald-600
                  text-white
                `
                : `
                  bg-[#0446DB]
                  text-white

                  hover:bg-[#0339B5]
                  hover:shadow-md
                  hover:shadow-blue-600/20

                  active:scale-[0.98]
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
  );
}

export default TechSecurityKey;