import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/Helper/axiosInstance";
import Shield_icon from "../../assets/Shield_icon.jpeg";
import terms_and_conditions from "../../assets/terms_and_conditions.pdf";

const DaakitShieldIcon = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 2.5 20 6v5.4c0 4.8-3.1 8.6-8 10.1-4.9-1.5-8-5.3-8-10.1V6l8-3.5Z"
        fill="#EAF2FF"
        stroke="#0756C9"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m8.2 12 2.4 2.4 5.2-5.4"
        stroke="#0756C9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const MINIMUM_VALUE = 2000;
const MAXIMUM_VALUE = 500000;

const rawBaseURL = (import.meta.env.VITE_BASE_URL || "").replace(/\/+$/, "");

const getMerchantFrontBaseURL = (url) => {
  if (!url) return "";
  const apiRoot = url
    .replace(/\/api\/merchantfront$/i, "")
    .replace(/\/merchantfront$/i, "")
    .replace(/\/api$/i, "");

  return `${apiRoot}/api/merchant`;
};

const merchantFrontBaseURL = getMerchantFrontBaseURL(rawBaseURL);
const UPDATE_INSURANCE_LIMIT_API = `${merchantFrontBaseURL}/updateInsuranceLimit`;
const GET_INSURANCE_LIMIT_API = `${merchantFrontBaseURL}/getInsuranceLimit`;

const normalizeThreshold = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) return MINIMUM_VALUE;

  return Math.min(MAXIMUM_VALUE, Math.max(MINIMUM_VALUE, numericValue));
};

const formatNumber = (value) =>
  new Intl.NumberFormat("en-IN").format(normalizeThreshold(value));

const iconClass =
  "h-6 w-6 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.8]";

function ShieldIcon({ type }) {
  if (type === "document") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3h8l5 5v13H7V3Z M15 3v5h5 M10 12h7 M10 16h7" />
      </svg>
    );
  }

  if (type === "package") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 2 8 4.5v11L12 22l-8-4.5v-11L12 2Z M4.5 6.8 12 11l7.5-4.2M12 11v10.5M8 4.4l7.8 4.4" />
      </svg>
    );
  }

  return (
    <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3 7 3v5c0 4.5-2.8 8.4-7 10-4.2-1.6-7-5.5-7-10V6l7-3Z" />
    </svg>
  );
}

function BenefitCard({ type, color = "blue", title, description }) {
  const iconColor =
    color === "orange"
      ? "bg-orange-50 text-[#ff5d00]"
      : "bg-blue-50 text-[#0057c9]";

  return (
    <article className="flex min-h-[83px] items-center gap-4 rounded-2xl border border-slate-200 bg-white p-[18px] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5">
      <div
        className={`grid size-[47px] shrink-0 place-items-center rounded-xl ${iconColor}`}
      >
        <ShieldIcon type={type} />
      </div>
      <div>
        <h3 className="mb-0.5 text-base font-extrabold text-slate-950">
          {title}
        </h3>
        <p className="text-[13px] text-[#567092]">{description}</p>
      </div>
    </article>
  );
}

function Insurance({
  initialEnabled = false,
  initialThresholdEnabled = false,
  initialValue = MINIMUM_VALUE,
  shieldImage = Shield_icon,
  onChange,
}) {
  const [merchantActive, setMerchantActive] = useState(Boolean(initialEnabled));
  const [thresholdEnabled, setThresholdEnabled] = useState(
    Boolean(initialEnabled && initialThresholdEnabled),
  );
  const [hasInsuranceLimit, setHasInsuranceLimit] = useState(
    Boolean(initialEnabled && Number(initialValue) >= MINIMUM_VALUE),
  );
  const [threshold, setThreshold] = useState(() =>
    normalizeThreshold(initialValue),
  );
  const [savedThreshold, setSavedThreshold] = useState(() =>
    normalizeThreshold(initialValue),
  );
  const [fetchLoading, setFetchLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const isLoading = fetchLoading || saveLoading;

  const progress = useMemo(
    () => ((threshold - MINIMUM_VALUE) / (MAXIMUM_VALUE - MINIMUM_VALUE)) * 100,
    [threshold],
  );

  useEffect(() => {
    let isMounted = true;

    const fetchInsuranceLimit = async () => {
      try {
        setFetchLoading(true);

        if (!merchantFrontBaseURL) {
          throw new Error(
            "VITE_BASE_URL is missing. Please check your .env file and restart Vite.",
          );
        }

        console.info("[Insurance API] Fetching insurance limit", {
          url: GET_INSURANCE_LIMIT_API,
        });

        const response = await axiosInstance.get(GET_INSURANCE_LIMIT_API);
        const rawDatabaseLimit = Number(response?.data?.data?.insurance_limit);
        // ₹2,000 OFF/default value hai. ₹2,000 se zyada limit par ON hoga.
        const hasStoredLimit =
          Number.isFinite(rawDatabaseLimit) &&
          rawDatabaseLimit >= MINIMUM_VALUE;
        const isInsuranceActive =
          Number.isFinite(rawDatabaseLimit) &&
          rawDatabaseLimit >= MINIMUM_VALUE;

        const isThresholdActive =
          Number.isFinite(rawDatabaseLimit) && rawDatabaseLimit > MINIMUM_VALUE;
        const databaseLimit = normalizeThreshold(rawDatabaseLimit);

        if (!isMounted) return;

        setThreshold(databaseLimit);
        setSavedThreshold(databaseLimit);
        setMerchantActive(isInsuranceActive);
        setThresholdEnabled(isThresholdActive);
        setHasInsuranceLimit(hasStoredLimit);

        console.info("[Insurance API] Insurance limit fetched", {
          status: response?.status,
          insurance_limit: databaseLimit,
          insurance_active: isInsuranceActive,
        });
      } catch (error) {
        if (!isMounted) return;

        const responseData = error?.response?.data;
        const errorMessage =
          responseData?.message ||
          responseData?.error ||
          error?.message ||
          "Failed to fetch insurance limit";

        toast.error(errorMessage);
      } finally {
        if (isMounted) setFetchLoading(false);
      }
    };

    fetchInsuranceLimit();

    return () => {
      isMounted = false;
    };
  }, []);

  const saveInsuranceLimit = async (value) => {
    const normalizedValue = normalizeThreshold(value);
    const requestPayload = {
      insurance_limit: normalizedValue,
    };

    try {
      setSaveLoading(true);

      if (!merchantFrontBaseURL) {
        throw new Error(
          "VITE_BASE_URL is missing. Please check your .env file and restart Vite.",
        );
      }

      console.info("[Insurance API] Updating insurance limit", {
        url: UPDATE_INSURANCE_LIMIT_API,
        payload: requestPayload,
      });

      const response = await axiosInstance.post(
        UPDATE_INSURANCE_LIMIT_API,
        requestPayload,
      );

      console.info("[Insurance API] Update successful", {
        status: response?.status,
        data: response?.data,
      });

      if (response?.data?.success === false) {
        throw new Error(
          response?.data?.message || "Failed to update insurance limit",
        );
      }

      setThreshold(normalizedValue);
      setSavedThreshold(normalizedValue);
      setHasInsuranceLimit(true);

      toast.success(
        response?.data?.message || "Insurance limit updated successfully",
      );

      return true;
    } catch (error) {
      const responseData = error?.response?.data;
      const errorMessage =
        responseData?.message ||
        responseData?.error ||
        error?.message ||
        "Failed to update insurance limit";

      console.group("[Insurance API] Update failed");
      console.error("Request URL:", UPDATE_INSURANCE_LIMIT_API);
      console.error("Request payload:", requestPayload);
      console.error("HTTP status:", error?.response?.status || "No response");
      console.error("Backend response:", responseData || "No response data");
      console.error("Error code:", error?.code || "Unknown");
      console.error("Complete error:", error);
      console.groupEnd();

      toast.error(errorMessage);

      return false;
    } finally {
      setSaveLoading(false);
    }
  };

  const resetInsuranceLimit = async ({ deactivateMerchant = false } = {}) => {
    const resetValue = deactivateMerchant ? 0 : MINIMUM_VALUE;
    const requestPayload = {
      insurance_limit: resetValue,
    };

    try {
      setSaveLoading(true);

      if (!merchantFrontBaseURL) {
        throw new Error(
          "VITE_BASE_URL is missing. Please check your .env file and restart Vite.",
        );
      }

      console.info("[Insurance API] Resetting insurance limit", {
        url: UPDATE_INSURANCE_LIMIT_API,
        payload: requestPayload,
      });

      const response = await axiosInstance.post(
        UPDATE_INSURANCE_LIMIT_API,
        requestPayload,
      );

      if (response?.data?.success === false) {
        throw new Error(
          response?.data?.message || "Failed to reset insurance limit",
        );
      }

      if (deactivateMerchant) {
        setMerchantActive(false);
      }

      setThresholdEnabled(false);
      setHasInsuranceLimit(!deactivateMerchant);
      setThreshold(MINIMUM_VALUE);
      setSavedThreshold(MINIMUM_VALUE);

      onChange?.({
        enabled: deactivateMerchant ? false : merchantActive,
        thresholdEnabled: false,
        threshold: deactivateMerchant ? null : MINIMUM_VALUE,
      });

      toast.success(
        deactivateMerchant
          ? "Insurance deactivated successfully"
          : "B2C threshold disabled. Limit reset to ₹2,000",
      );

      return true;
    } catch (error) {
      const responseData = error?.response?.data;
      const errorMessage =
        responseData?.message ||
        responseData?.error ||
        error?.message ||
        "Failed to reset insurance limit";

      toast.error(errorMessage);
      return false;
    } finally {
      setSaveLoading(false);
    }
  };

  const updateMerchantStatus = async (nextActive) => {
    if (isLoading || nextActive === merchantActive) return;

    // Activate → 2000, Deactivate → 0
    const requestPayload = {
      insurance_limit: nextActive ? MINIMUM_VALUE : 0,
    };

    try {
      setSaveLoading(true);

      console.log("Insurance status payload:", requestPayload);

      const response = await axiosInstance.post(
        UPDATE_INSURANCE_LIMIT_API,
        requestPayload,
      );

      if (response?.data?.success === false) {
        throw new Error(
          response?.data?.message || "Failed to update insurance status",
        );
      }

      setMerchantActive(nextActive);
      setThresholdEnabled(false);
      setHasInsuranceLimit(nextActive);
      setThreshold(MINIMUM_VALUE);
      setSavedThreshold(MINIMUM_VALUE);

      onChange?.({
        enabled: nextActive,
        thresholdEnabled: false,
        threshold: nextActive ? MINIMUM_VALUE : null,
      });

      toast.success(
        nextActive
          ? "Insurance activated successfully"
          : "Insurance deactivated successfully",
      );
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update insurance status";

      console.error("Insurance status update failed:", {
        payload: requestPayload,
        response: error?.response?.data,
        error,
      });

      toast.error(errorMessage);
    } finally {
      setSaveLoading(false);
    }
  };

  const updateThresholdEnabled = async (nextEnabled) => {
    if (isLoading || nextEnabled === thresholdEnabled) return;

    // Toggle OFF par POST API se database limit ₹2,000 reset hogi.
    if (!nextEnabled) {
      await resetInsuranceLimit();
      return;
    }

    if (!merchantActive) {
      toast.error("Please activate insurance first");
      return;
    }

    // Merchant active hone par hi threshold ON karte waqt POST API call hogi.
    const updated = await saveInsuranceLimit(threshold);

    if (updated) {
      setThresholdEnabled(true);
      onChange?.({
        enabled: true,
        thresholdEnabled: true,
        threshold,
      });
    }
  };

  const updateThreshold = (event) => {
    const nextValue = normalizeThreshold(event.target.value);
    setThreshold(nextValue);
    onChange?.({
      enabled: merchantActive,
      thresholdEnabled,
      threshold: nextValue,
    });
  };

  const commitThreshold = async () => {
    if (
      !merchantActive ||
      !thresholdEnabled ||
      isLoading ||
      threshold === savedThreshold
    ) {
      return;
    }

    const updated = await saveInsuranceLimit(threshold);

    if (!updated) {
      setThreshold(savedThreshold);
      onChange?.({
        enabled: true,
        thresholdEnabled: true,
        threshold: savedThreshold,
      });
    }
  };

  return (
    <main className="w-full bg-slate-50 px-3 py-6 sm:px-5 lg:px-[3%]">
      <div className="mx-auto w-full  rounded-2xl border border-slate-200 bg-white p-2.5 shadow-[0_2px_4px_rgba(15,23,42,0.08),0_10px_30px_rgba(15,23,42,0.03)] sm:p-3.5 md:p-[22px] xl:rounded-[22px] xl:p-[38px]">
        <section className="relative flex min-h-[395px] items-center justify-between overflow-hidden rounded-2xl bg-[linear-gradient(128deg,#073db4_0%,#0754c4_23%,#0877dc_51%,#438bcf_63%,#a992a6_82%,#f47a42_100%)] px-[19px] py-7 sm:px-6 sm:py-8 lg:px-11 lg:py-10 xl:rounded-[21px] xl:p-[54px]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_87%_48%,rgba(255,144,92,0.4)_0%,rgba(255,144,92,0.18)_28%,transparent_55%)]" />

          <div className="relative z-10 w-full lg:w-[calc(100%-155px)] xl:w-[68%]">
            <div className="mb-[18px] inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md sm:mb-6 sm:text-sm">
              <svg
                className="size-[15px] fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.8]"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="m13 2-2.5 6.5L4 11l6.5 2.5L13 20l2.5-6.5L22 11l-6.5-2.5L13 2ZM5 3l-.7 2.3L2 6l2.3.7L5 9l.7-2.3L8 6l-2.3-.7L5 3Z" />
              </svg>
              <span>New · Auto Protection</span>
            </div>

            <h1 className="mb-5 text-[27px] font-extrabold leading-[1.18] tracking-[-0.7px] text-white sm:text-[31px] lg:text-4xl xl:text-[50px] xl:tracking-[-1.3px]">
              Secure Your Shipments and
              <br />
              Ship Hassle Free
            </h1>

            <p className="mb-6 max-w-[750px] text-[15px] leading-relaxed text-white/95 lg:text-base xl:mb-7 xl:text-lg xl:leading-[1.65]">
              <a
                href={terms_and_conditions}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-white underline underline-offset-2"
              >
                Terms And Condition
              </a>{" "}
              Automatically shield your shipments above{" "}
              <strong>
                {fetchLoading
                  ? "..."
                  : hasInsuranceLimit
                    ? `₹${formatNumber(threshold)}`
                    : "-"}
              </strong>{" "}
              without any manual intervention.
            </p>

            <button
              type="button"
              aria-pressed={merchantActive}
              onClick={() => updateMerchantStatus(!merchantActive)}
              disabled={isLoading}
              className={`inline-flex h-[43px] min-w-32 cursor-pointer items-center justify-center gap-2 rounded-lg border px-5 text-[15px] font-bold transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 ${merchantActive ? "border-[#ff6300] bg-white text-[#ff6300] shadow-[0_8px_20px_rgba(255,99,0,0.15)] hover:bg-orange-50" : "border-[#ff6300] bg-[#ff6300] text-white shadow-[0_8px_20px_rgba(255,99,0,0.25)] hover:bg-[#e95900]"}`}
              // className="inline-flex h-[43px] min-w-32 cursor-pointer items-center justify-center gap-2 rounded-lg border-0 bg-[#ff6300] px-5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(255,99,0,0.25)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(255,99,0,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <svg
                className="size-[18px] fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:2]"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M13 2 4 14h7l-1 8L20 9h-7V2Z" />
              </svg>
              {fetchLoading
                ? "Loading..."
                : saveLoading
                  ? "Saving..."
                  : merchantActive
                    ? "Deactivate"
                    : "Activate"}
            </button>
          </div>

          <div className="relative z-10 mr-7 hidden size-[140px] shrink-0 overflow-hidden rounded-full border border-white/35 bg-white/10 lg:block xl:size-[185px]">
            <img
              src={shieldImage}
              alt="Daakit Shield"
              className="size-full object-cover"
            />
          </div>
        </section>

        <section className="pt-9 sm:pt-[46px]">
          <h2 className="mb-6 text-center text-[22px] font-extrabold text-black sm:text-[25px] xl:mb-7 xl:text-[31px]">
            Why Choose <span className="text-[#0756c9]">Shield by</span>{" "}
            <span className="bg-gradient-to-r from-[#406fbd] to-[#f48b69] bg-clip-text text-transparent">
              DAAKit
            </span>
            ?
          </h2>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:gap-6">
            <div className="flex min-h-[83px] items-center gap-4 rounded-2xl border border-slate-200 bg-white p-[18px] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                <DaakitShieldIcon />
              </div>

              <div>
                <p className="mb-0.5 text-base font-extrabold text-slate-950">
                  Up to ₹5,00,000
                </p>
                <p className="text-xs text-slate-500">Security Coverage</p>
              </div>
            </div>
            <BenefitCard
              type="document"
              color="orange"
              title="Within 7 Days"
              description="Claim Settlement"
            />
            <BenefitCard
              type="package"
              title="1,00,000+"
              description="Shipments Shielded"
            />
          </div>
        </section>

        <section className="pt-9 sm:pt-[47px]">
          <div className="flex items-center justify-between gap-3 sm:justify-start sm:gap-[15px]">
            <h2 className="text-base font-extrabold text-slate-950 sm:text-[21px]">
              B2C Shipment Value Threshold
            </h2>

            <label
              className={`relative inline-block h-6 w-[42px] shrink-0 ${
                merchantActive && !isLoading
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-60"
              }`}
            >
              <input
                type="checkbox"
                checked={thresholdEnabled}
                onChange={(event) =>
                  updateThresholdEnabled(event.target.checked)
                }
                disabled={!merchantActive || isLoading}
                className="peer sr-only"
              />
              <span className="absolute inset-0 rounded-full bg-slate-400 transition-colors duration-200 peer-checked:bg-green-600 peer-focus-visible:ring-4 peer-focus-visible:ring-blue-200 after:absolute after:left-[3px] after:top-[3px] after:size-[18px] after:rounded-full after:bg-white after:shadow-md after:transition-transform after:duration-200 peer-checked:after:translate-x-[18px]" />
            </label>
          </div>

          <div
            className={`relative mt-[62px] px-2.5 transition-opacity ${
              merchantActive && thresholdEnabled && !fetchLoading
                ? "opacity-100"
                : "opacity-55"
            }`}
          >
            <output
              className="absolute -top-[38px] z-10 grid h-7 min-w-12 -translate-x-1/2 place-items-center rounded-lg bg-[linear-gradient(135deg,#0060d5_5%,#0060d5_72%,#ff8759)] px-2 text-sm font-bold text-white shadow-md after:absolute after:-bottom-1 after:left-1/2 after:-z-10 after:size-2.5 after:-translate-x-1/2 after:rotate-45 after:bg-[#0863ce]"
              style={{
                left: `calc(${progress}% + ${9 - progress * 0.18}px)`,
              }}
            >
              {fetchLoading
                ? "..."
                : hasInsuranceLimit
                  ? formatNumber(threshold)
                  : "-"}
            </output>

            <input
              type="range"
              min={MINIMUM_VALUE}
              max={MAXIMUM_VALUE}
              step="1000"
              value={threshold}
              disabled={!merchantActive || !thresholdEnabled || isLoading}
              onChange={updateThreshold}
              onPointerUp={commitThreshold}
              onKeyUp={commitThreshold}
              aria-label="B2C shipment value threshold"
              className="h-5 w-full cursor-pointer appearance-none rounded-full bg-transparent disabled:cursor-not-allowed [&::-moz-range-thumb]:size-[19px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-slate-500 [&::-moz-range-thumb]:bg-white [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-thumb]:-mt-[6.5px] [&::-webkit-slider-thumb]:size-[19px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-slate-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm"
              style={{
                background: `linear-gradient(to right, #0967d8 0%, #0967d8 ${progress}%, #cfd4da ${progress}%, #cfd4da 100%)`,
              }}
            />

            <div className="mt-1 flex justify-between text-xs text-[#445f86]">
              <span>{formatNumber(MINIMUM_VALUE)}</span>
              <span>{formatNumber(MAXIMUM_VALUE)}</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Insurance;
